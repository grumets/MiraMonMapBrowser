/*
    This file is part of MiraMon Map Browser.
    MiraMon Map Browser is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    MiraMon Map Browser is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General
    Public License along with MiraMon Map Browser.
    If not, see https://www.gnu.org/licenses/licenses.html#AGPL.

    MiraMon Map Browser can be updated from
    https://github.com/grumets/MiraMonMapBrowser.

    Copyright 2001, 2026 Xavier Pons

    Aquest codi JavaScript ha estat idea de Joan Masó Pau (joan maso at uab cat)
    amb l'ajut de Núria Julià (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del
    CREAF que elabora programari de Sistema d'Informació Geogràfica
    i de Teledetecció per a la visualització, consulta, edició i anàlisi
    de mapes ràsters i vectorials. Aquest programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert.

    En particular, el Navegador de Mapes del MiraMon (client per Internet)
    es distribueix sota els termes de la llicència GNU Affero General Public
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.

    El Navegador de Mapes del MiraMon es pot actualitzar des de
    https://github.com/grumets/MiraMonMapBrowser.
*/
"use strict";

/*
  Cloud-optimized DBF access: read a remote catalogue.dbf and a collection
  DBF with fetch() + HTTP Range, without downloading the whole files.

      const cache = await openDBFDGGSCache(catalogueUrl);
      const records = await getDBFDGGSCells(cache, tileMatrix, iIni, iEnd, jIni, jEnd, optimSol);
      closeDBFDGGSCache(cache);
      // records or getDBFDGGSCells.lastMeta / cache.lastMeta

  Two handles to the same catalogue URL share Range results (headers,
  field descriptors and catalogue records used by binary search). The
  collection record slice is never cached. getDBFDGGSCells() still accepts
  a catalogue URL for callers that do not keep a handle.

  Catalogue records are sorted by TILEMATRIX (descending), then I (ascending),
  then J (ascending). A match yields DBF_CODE, OFFSET and SIZE, used to read
  a slice of another DBF in the same folder.

  readDBF(url, options) fetches only what flags ask for. Pass header/fields
  (or reuse the per-URL parsed structure) to skip structure Range requests.

      flags: DBF_LlegeixHeader | DBF_LlegeixFields | DBF_LlegeixRecords
      header, fields: reuse known structure
      recordRange: { start, end } bytes inclusive, or { index, count }
      rangeStore, cacheRecords: optional HTTP Range cache
*/

var LITTLE_ENDIAN = true;

function oemToAnsi(c) {
	var t = [
		199, 252, 233, 226, 228, 224, 229, 231, 234, 235, 232, 239, 238, 236,
		196, 197, 201, 230, 198, 244, 246, 242, 251, 249, 255, 214, 220, 248,
		163, 216, 215, 131, 225, 237, 243, 250, 241, 209, 170, 186, 191, 174,
		172, 189, 188, 161, 171, 187, 164, 164, 164, 166, 166, 193, 194, 192,
		169, 166, 166, 164, 164, 162, 165, 164, 164, 164, 164, 164, 164, 164,
		227, 195, 164, 164, 164, 164, 166, 164, 164, 164, 240, 208, 202, 203,
		200, 180, 205, 206, 207, 164, 164, 164, 164, 166, 204, 164, 211, 223,
		212, 210, 245, 213, 181, 254, 222, 218, 219, 217, 253, 221, 175, 180,
		173, 177, 164, 190, 182, 167, 247, 184, 176, 168, 183, 185, 179, 178,
		164, 183
	];
	if (c <= 127) {
		return c;
	}
	return t[c - 128];
}

function decodeDBFChar(code, characterEncoding) {
	return String.fromCharCode(characterEncoding === 0x14 ? oemToAnsi(code) : code);
}

function readCStringDBF(dataView, offset, length, characterEncoding) {
	var s = "";
	var j, c;
	for (j = 0; j < length; j++) {
		c = dataView.getUint8(offset + j);
		if (c === 0) {
			break;
		}
		s += decodeDBFChar(c, characterEncoding);
	}
	return s;
}

function trimDBFText(s) {
	return s.replace(/^\s+/, "").replace(/\s+$/, "");
}

function DBFResolvedUrl(url) {
	return new URL(url, window.location.href).href;
}

function DBFRangeCacheKey(url, start, endInclusive) {
	return url + "#" + start + "-" + endInclusive;
}

async function fetchDBFRangeNetwork(resolved, start, endInclusive) {
	var response, buffer, status;

	response = await fetch(resolved, {
		headers: {
			Range: "bytes=" + start + "-" + endInclusive
		}
	});
	status = response.status;
	if (!response.ok && status !== 206) {
		throw new Error("HTTP " + status + " reading " + resolved +
			" bytes " + start + "-" + endInclusive);
	}
	buffer = await response.arrayBuffer();
	if (status === 200 && buffer.byteLength > endInclusive - start + 1) {
		return buffer.slice(start, endInclusive + 1);
	}
	if (buffer.byteLength < endInclusive - start + 1) {
		throw new Error("Short HTTP Range response for " + resolved +
			" (got " + buffer.byteLength + " bytes, wanted " +
			(endInclusive - start + 1) + ")");
	}
	return buffer;
}

async function fetchDBFRange(url, start, endInclusive, fetchLog, rangeStore, cacheResult) {
	var resolved = DBFResolvedUrl(url);
	var useCache = rangeStore && cacheResult !== false;
	var key, pending;
	var logEntry = {
		url: resolved,
		start: start,
		end: endInclusive,
		bytes: endInclusive - start + 1,
		cached: false
	};

	if (useCache) {
		key = DBFRangeCacheKey(resolved, start, endInclusive);
		if (Object.prototype.hasOwnProperty.call(rangeStore.rangePromises, key)) {
			logEntry.cached = true;
			rangeStore.hits++;
			if (fetchLog) {
				fetchLog.push(logEntry);
			}
			return await rangeStore.rangePromises[key];
		}
		rangeStore.misses++;
		pending = fetchDBFRangeNetwork(resolved, start, endInclusive).catch(function (err) {
			if (rangeStore.rangePromises[key]) {
				delete rangeStore.rangePromises[key];
			}
			throw err;
		});
		rangeStore.rangePromises[key] = pending;
		if (fetchLog) {
			fetchLog.push(logEntry);
		}
		return await pending;
	}

	if (fetchLog) {
		fetchLog.push(logEntry);
	}
	return await fetchDBFRangeNetwork(resolved, start, endInclusive);
}

function parseDBFHeader(buffer) {
	var dataView = new DataView(buffer);
	var version = dataView.getUint8(0);
	var isMMExtended = version === 0x90;
	var nRecords = dataView.getUint32(4, LITTLE_ENDIAN);
	var offsetFirstRecord = dataView.getUint16(8, LITTLE_ENDIAN);
	var recordBytes;
	var characterEncoding = dataView.getUint8(29);
	var year = dataView.getUint8(1);
	var month = dataView.getUint8(2);
	var day = dataView.getUint8(3);

	if (isMMExtended) {
		offsetFirstRecord += dataView.getUint16(30, LITTLE_ENDIAN) << 16;
		recordBytes = dataView.getUint32(10, LITTLE_ENDIAN);
	} else {
		recordBytes = dataView.getUint16(10, LITTLE_ENDIAN);
	}

	return {
		version: version,
		isMMExtended: isMMExtended,
		date: new Date(1900 + year, month - 1, day),
		nRecords: nRecords,
		offsetFirstRecord: offsetFirstRecord,
		recordBytes: recordBytes,
		characterEncoding: characterEncoding,
		fieldDescriptionLength: offsetFirstRecord - 32
	};
}

function parseDBFFieldDescriptors(buffer, header) {
	var dataView = new DataView(buffer);
	var fields = [];
	var i = 0;
	var offset = 0;
	var recordBytesAcc = 1;
	var attribute, j, c, name, datatype, length, decFigures;
	var offsetLongName, lengthLongName, longName;

	while (offset + 32 <= dataView.byteLength && recordBytesAcc < header.recordBytes) {
		if (dataView.getUint8(offset) === 0x0D) {
			break;
		}
		name = "";
		for (j = 0; j < 11; j++) {
			c = dataView.getUint8(offset + j);
			if (c === 0) {
				break;
			}
			name += decodeDBFChar(c, header.characterEncoding);
		}
		datatype = String.fromCharCode(dataView.getUint8(offset + 11));
		length = dataView.getUint8(offset + 16);
		decFigures = dataView.getUint8(offset + 17);
		if (header.isMMExtended && datatype === "C" && length === 0) {
			length = dataView.getUint32(offset + 21, LITTLE_ENDIAN);
		}
		attribute = {
			name: name,
			datatype: datatype,
			length: length,
			decFigures: decFigures,
			offsetInRecord: recordBytesAcc
		};
		if (header.isMMExtended) {
			offsetLongName = dataView.getUint32(offset + 25, LITTLE_ENDIAN);
			lengthLongName = dataView.getUint8(offset + 29);
			if (lengthLongName > 0 && lengthLongName < 129 &&
					offsetLongName < header.offsetFirstRecord) {
				longName = "";
				for (j = 0; j < lengthLongName; j++) {
					c = dataView.getUint8(offsetLongName - 32 + j);
					if (c === 0) {
						break;
					}
					longName += decodeDBFChar(c, header.characterEncoding);
				}
				if (longName) {
					attribute.longName = longName;
				}
			}
		}
		fields[i] = attribute;
		recordBytesAcc += length;
		offset += 32;
		i++;
	}
	return fields;
}

function parseDBFFieldValue(dataView, recOffset, attribute, characterEncoding) {
	var s, name, date, time, dt;

	name = attribute.longName ? attribute.longName : attribute.name;
	switch (attribute.datatype) {
		case "N":
		case "F":
		case "D":
			s = trimDBFText(readCStringDBF(dataView, recOffset + attribute.offsetInRecord,
				attribute.length, 0));
			break;
		case "C":
			s = trimDBFText(readCStringDBF(dataView, recOffset + attribute.offsetInRecord,
				attribute.length, characterEncoding));
			break;
		default:
			s = "";
	}

	switch (attribute.datatype) {
		case "C":
			return { name: name, value: s };
		case "N":
		case "F":
			return { name: name, value: s === "" ? null : parseFloat(s) };
		case "D":
			if (s.length >= 8) {
				return {
					name: name,
					value: s.substring(0, 4) + "-" + s.substring(4, 6) + "-" + s.substring(6, 8)
				};
			}
			return { name: name, value: s };
		case "L":
			s = String.fromCharCode(dataView.getUint8(recOffset + attribute.offsetInRecord));
			switch (s) {
				case "T":
				case "t":
				case "Y":
				case "y":
				case "S":
				case "s":
				case "O":
				case "o":
				case "1":
					return { name: name, value: true };
				case "F":
				case "f":
				case "N":
				case "n":
				case "0":
					return { name: name, value: false };
				default:
					return { name: name, value: null };
			}
		case "@":
			date = dataView.getUint32(recOffset + attribute.offsetInRecord, LITTLE_ENDIAN);
			time = dataView.getUint32(recOffset + attribute.offsetInRecord + 4, LITTLE_ENDIAN);
			dt = new Date((date - 2440953) * 24 * 60 * 60 * 1000 + time);
			return { name: name, value: dt.toISOString() };
		case "I":
		case "+":
			return {
				name: name,
				value: dataView.getInt32(recOffset + attribute.offsetInRecord, LITTLE_ENDIAN)
			};
		case "O":
			return {
				name: name,
				value: dataView.getFloat64(recOffset + attribute.offsetInRecord, LITTLE_ENDIAN)
			};
		default:
			return { name: name, value: null };
	}
}

function parseDBFRecord(buffer, recOffset, fields, characterEncoding) {
	var dataView = new DataView(buffer);
	var record = {};
	var i, parsed;
	var deleted = dataView.getUint8(recOffset) === 0x2A;

	record._deleted = deleted;
	for (i = 0; i < fields.length; i++) {
		parsed = parseDBFFieldValue(dataView, recOffset, fields[i], characterEncoding);
		record[parsed.name] = parsed.value;
	}
	return record;
}

function parseDBFRecords(buffer, header, fields, includeDeleted) {
	var records = [];
	var n = Math.floor(buffer.byteLength / header.recordBytes);
	var r, rec;
	for (r = 0; r < n; r++) {
		rec = parseDBFRecord(buffer, r * header.recordBytes, fields, header.characterEncoding);
		if (!rec._deleted) {
			delete rec._deleted;
			records.push(rec);
		} else if (includeDeleted) {
			records.push(rec);
		}
	}
	return records;
}

var DBF_LlegeixHeader = 1;
var DBF_LlegeixFields = 2;
var DBF_LlegeixRecords = 4;

var dbfStructureByUrl = {};
var dbfSharedByUrl = {};
var dbfHandleById = {};
var nextDbfCacheId = 1;

function DBFStructureCacheKey(url) {
	return new URL(url, window.location.href).href;
}

function getCachedDBFStructure(url) {
	return dbfStructureByUrl[DBFStructureCacheKey(url)] || null;
}

function setCachedDBFStructure(url, header, fields) {
	var key = DBFStructureCacheKey(url);
	var prev = dbfStructureByUrl[key];
	if (!prev) {
		dbfStructureByUrl[key] = {
			header: header || null,
			fields: fields || null
		};
		return;
	}
	if (header) {
		prev.header = header;
	}
	if (fields) {
		prev.fields = fields;
	}
}

function resolveDBFRecordByteRange(header, recordRange) {
	var start, end, index, count;
	if (!recordRange) {
		throw new Error("DBF_LlegeixRecords requires recordRange");
	}
	if (typeof recordRange.start === "number" && typeof recordRange.end === "number") {
		return { start: recordRange.start, end: recordRange.end };
	}
	if (typeof recordRange.index === "number") {
		index = recordRange.index;
		count = typeof recordRange.count === "number" ? recordRange.count : 1;
		if (count < 1) {
			throw new Error("recordRange.count must be >= 1");
		}
		start = header.offsetFirstRecord + index * header.recordBytes;
		end = start + count * header.recordBytes - 1;
		return { start: start, end: end };
	}
	throw new Error("recordRange must be { start, end } or { index, count }");
}

async function readDBF(url, options) {
	var opts = options || {};
	var flags = opts.flags;
	var fetchLog = opts.fetchLog;
	var header = opts.header || null;
	var fields = opts.fields || null;
	var records = null;
	var cached, needHeader, needFields, needRecords;
	var headerBuffer, fieldBuffer, recordsBuffer, range, result;

	if (typeof flags !== "number") {
		flags = DBF_LlegeixHeader | DBF_LlegeixFields;
	}

	needHeader = (flags & DBF_LlegeixHeader) !== 0;
	needFields = (flags & DBF_LlegeixFields) !== 0;
	needRecords = (flags & DBF_LlegeixRecords) !== 0;

	if (!needHeader && !needFields && !needRecords) {
		throw new Error("readDBF: no flags set");
	}
	if (needFields && !header && !needHeader) {
		throw new Error("readDBF: DBF_LlegeixFields requires a header or DBF_LlegeixHeader");
	}
	if (needRecords && !header && !needHeader) {
		throw new Error("readDBF: DBF_LlegeixRecords requires a header or DBF_LlegeixHeader");
	}
	if (needRecords && !fields && !needFields) {
		throw new Error("readDBF: DBF_LlegeixRecords requires fields or DBF_LlegeixFields");
	}

	cached = getCachedDBFStructure(url);
	if (!header && cached && cached.header) {
		header = cached.header;
	}
	if (!fields && cached && cached.fields) {
		fields = cached.fields;
	}

	if (!header && (needHeader || needFields || needRecords)) {
		headerBuffer = await fetchDBFRange(url, 0, 31, fetchLog, opts.rangeStore, true);
		header = parseDBFHeader(headerBuffer);
	}

	if (!fields && (needFields || needRecords)) {
		if (header.fieldDescriptionLength < 1) {
			throw new Error("Invalid DBF header: field description length is " +
				header.fieldDescriptionLength);
		}
		fieldBuffer = await fetchDBFRange(url, 32, header.offsetFirstRecord - 1, fetchLog,
			opts.rangeStore, true);
		fields = parseDBFFieldDescriptors(fieldBuffer, header);
	}

	if (header && fields) {
		setCachedDBFStructure(url, header, fields);
	} else if (header) {
		setCachedDBFStructure(url, header, null);
	}

	if (needRecords) {
		range = resolveDBFRecordByteRange(header, opts.recordRange);
		if (range.end < range.start) {
			records = [];
		} else {
			recordsBuffer = await fetchDBFRange(url, range.start, range.end, fetchLog,
				opts.rangeStore, opts.cacheRecords !== false);
			records = parseDBFRecords(recordsBuffer, header, fields, opts.includeDeleted);
		}
	}

	result = { fetches: fetchLog };
	if (needHeader) {
		result.header = header;
	}
	if (needFields) {
		result.fields = fields;
	}
	if (needRecords) {
		result.records = records;
	}
	return result;
}

async function readDBFStructure(url, fetchLog, rangeStore) {
	return readDBF(url, {
		flags: DBF_LlegeixHeader | DBF_LlegeixFields,
		fetchLog: fetchLog,
		rangeStore: rangeStore
	});
}

function getDBFSharedState(cache) {
	var handle, shared;
	if (!cache || cache.id == null) {
		throw new Error("Invalid DBF cache handle. Call openDBFDGGSCache(catalogueUrl) first.");
	}
	handle = dbfHandleById[cache.id];
	if (!handle || handle.closed) {
		throw new Error("DBF cache handle is closed. Call openDBFDGGSCache(catalogueUrl) again.");
	}
	shared = dbfSharedByUrl[handle.catalogueUrl];
	if (!shared) {
		throw new Error("DBF cache handle is closed. Call openDBFDGGSCache(catalogueUrl) again.");
	}
	return shared;
}

function isDBFDGGSCacheOpen(cache) {
	var handle;
	if (!cache || cache.id == null) {
		return false;
	}
	handle = dbfHandleById[cache.id];
	return !!(handle && !handle.closed && dbfSharedByUrl[handle.catalogueUrl]);
}

function getDBFDGGSCacheStats(cache) {
	var shared;
	try {
		shared = getDBFSharedState(cache);
	} catch (err) {
		return null;
	}
	return {
		id: cache.id,
		catalogueUrl: shared.catalogueUrl,
		entries: Object.keys(shared.rangePromises).length,
		hits: shared.hits,
		misses: shared.misses,
		refCount: shared.refCount
	};
}

function createDBFSharedStore(resolved) {
	return {
		catalogueUrl: resolved,
		refCount: 0,
		catalogue: null,
		opening: null,
		rangePromises: {},
		hits: 0,
		misses: 0
	};
}

async function openDBFDGGSCache(url) {
	var resolved, shared, cache, required, k;

	if (!url) {
		throw new Error("openDBFDGGSCache(catalogueUrl) requires a catalogue URL");
	}
	resolved = DBFResolvedUrl(url);
	shared = dbfSharedByUrl[resolved];
	if (!shared) {
		shared = createDBFSharedStore(resolved);
		dbfSharedByUrl[resolved] = shared;
	}

	if (!shared.catalogue) {
		if (!shared.opening) {
			shared.opening = readDBF(resolved, {
				flags: DBF_LlegeixHeader | DBF_LlegeixFields,
				rangeStore: shared
			}).then(function (catalogue) {
				required = ["TILEMATRIX", "I", "J", "DBF_CODE", "OFFSET", "SIZE"];
				for (k = 0; k < required.length; k++) {
					if (!fieldDBFByName(catalogue.fields, required[k])) {
						throw new Error("Catalogue DBF is missing field " + required[k]);
					}
				}
				shared.catalogue = catalogue;
				shared.opening = null;
				return catalogue;
			}).catch(function (err) {
				shared.opening = null;
				if (shared.refCount <= 0) {
					delete dbfSharedByUrl[resolved];
					delete dbfStructureByUrl[resolved];
				}
				throw err;
			});
		}
		await shared.opening;
	}

	shared = dbfSharedByUrl[resolved];
	if (!shared || !shared.catalogue) {
		throw new Error("openDBFDGGSCache failed: catalogue is not available");
	}
	shared.refCount++;
	cache = {
		id: nextDbfCacheId,
		catalogueUrl: resolved,
		lastMeta: null
	};
	nextDbfCacheId++;
	dbfHandleById[cache.id] = {
		catalogueUrl: resolved,
		closed: false
	};
	return cache;
}

function closeDBFDGGSCache(cache) {
	var handle, shared;
	if (!cache || cache.id == null) {
		return;
	}
	handle = dbfHandleById[cache.id];
	if (!handle || handle.closed) {
		return;
	}
	handle.closed = true;
	cache.lastMeta = null;
	delete dbfHandleById[cache.id];
	shared = dbfSharedByUrl[handle.catalogueUrl];
	if (!shared) {
		return;
	}
	shared.refCount--;
	if (shared.refCount <= 0 && !shared.opening) {
		shared.rangePromises = {};
		shared.catalogue = null;
		delete dbfSharedByUrl[handle.catalogueUrl];
		delete dbfStructureByUrl[handle.catalogueUrl];
	}
}

function fieldDBFByName(fields, name) {
	var u = name.toUpperCase();
	var i;
	for (i = 0; i < fields.length; i++) {
		if (fields[i].name.toUpperCase() === u) {
			return fields[i];
		}
	}
	return null;
}

function toComparableDBF(value) {
	var n;
	if (typeof value === "number") {
		return value;
	}
	if (value === null || value === undefined || value === "") {
		return value;
	}
	n = Number(value);
	if (!isNaN(n) && String(value).search(/^\s*[+-]?(\d+(\.\d*)?|\.\d+)\s*$/) !== -1) {
		return n;
	}
	return String(value);
}

function compareDBFAscending(a, b) {
	var va = toComparableDBF(a);
	var vb = toComparableDBF(b);
	if (va === vb) {
		return 0;
	}
	if (va === null || va === undefined) {
		return -1;
	}
	if (vb === null || vb === undefined) {
		return 1;
	}
	if (va < vb) {
		return -1;
	}
	if (va > vb) {
		return 1;
	}
	return 0;
}

function normalitzaLimitDBF(valor, fallback) {
	if (valor === null || typeof valor === "undefined" || valor === "" || valor === -1) {
		return fallback;
	}
	return valor;
}

function esOrdreCatalegDBFPerCols(optimSol) {
	return optimSol === "cols";
}

/*
  Catalogue sort: TILEMATRIX descending, then I/J according to optimSol.
  rows/no: I ascending, then J ascending.
  cols: J ascending, then I ascending.
  Returns < 0 if the search key is before the record (towards lower indexes).
*/
function compareDBFCatalogueKey(tileMatrix, i, j, record, ordreCols) {
	var tmCmp = compareDBFAscending(tileMatrix, record.TILEMATRIX);
	if (tmCmp !== 0) {
		return -tmCmp;
	}
	if (ordreCols) {
		tmCmp = compareDBFAscending(j, record.J);
		if (tmCmp !== 0) {
			return tmCmp;
		}
		return compareDBFAscending(i, record.I);
	}
	tmCmp = compareDBFAscending(i, record.I);
	if (tmCmp !== 0) {
		return tmCmp;
	}
	return compareDBFAscending(j, record.J);
}

function recordDBFCoincideixClau(record, tileMatrix, i, j) {
	return compareDBFAscending(tileMatrix, record.TILEMATRIX) === 0 &&
		compareDBFAscending(i, record.I) === 0 &&
		compareDBFAscending(j, record.J) === 0;
}

function recordDBFDinsRun(record, tileMatrix, i_ini, i_end, j_ini, j_end, ordreCols) {
	if (compareDBFAscending(tileMatrix, record.TILEMATRIX) !== 0) {
		return false;
	}
	if (ordreCols) {
		return compareDBFAscending(record.J, j_ini) === 0 &&
			compareDBFAscending(record.I, i_ini) >= 0 &&
			compareDBFAscending(record.I, i_end) <= 0;
	}
	return compareDBFAscending(record.I, i_ini) === 0 &&
		compareDBFAscending(record.J, j_ini) >= 0 &&
		compareDBFAscending(record.J, j_end) <= 0;
}

function recordDBFPassatRun(record, tileMatrix, i_ini, i_end, j_ini, j_end, ordreCols) {
	if (compareDBFAscending(tileMatrix, record.TILEMATRIX) !== 0) {
		return true;
	}
	if (ordreCols) {
		if (compareDBFAscending(record.J, j_ini) > 0) {
			return true;
		}
		return compareDBFAscending(record.J, j_ini) === 0 &&
			compareDBFAscending(record.I, i_end) > 0;
	}
	if (compareDBFAscending(record.I, i_ini) > 0) {
		return true;
	}
	return compareDBFAscending(record.I, i_ini) === 0 &&
		compareDBFAscending(record.J, j_end) > 0;
}

function sonOFFSETDBFConsecutius(prev, next) {
	if (!prev || !next) {
		return false;
	}
	if (prev.DBF_CODE !== next.DBF_CODE) {
		return false;
	}
	if (typeof prev.OFFSET !== "number" || typeof prev.SIZE !== "number" ||
			typeof next.OFFSET !== "number" || typeof next.SIZE !== "number") {
		return false;
	}
	return next.OFFSET === prev.OFFSET + prev.SIZE;
}

async function readDBFCatalogueRecord(url, header, fields, index, fetchLog, rangeStore) {
	var result = await readDBF(url, {
		flags: DBF_LlegeixRecords,
		header: header,
		fields: fields,
		recordRange: { index: index, count: 1 },
		includeDeleted: true,
		fetchLog: fetchLog,
		rangeStore: rangeStore,
		cacheRecords: true
	});
	if (!result.records || !result.records.length) {
		return { _deleted: true };
	}
	return result.records[0];
}

async function bsearchDBFCatalogue(url, header, fields, tileMatrix, i, j, fetchLog, rangeStore, ordreCols) {
	var low = 0;
	var high = header.nRecords - 1;
	var mid, record, cmp;

	while (low <= high) {
		mid = low + ((high - low) >> 1);
		record = await readDBFCatalogueRecord(url, header, fields, mid, fetchLog, rangeStore);
		cmp = compareDBFCatalogueKey(tileMatrix, i, j, record, ordreCols);
		if (cmp === 0) {
			return { index: mid, record: record, insert: mid };
		}
		if (cmp < 0) {
			high = mid - 1;
		} else {
			low = mid + 1;
		}
	}
	return { index: -1, record: null, insert: low };
}

async function readDBFCatalogueRecords(url, header, fields, index, count, fetchLog, rangeStore) {
	var result;
	if (count < 1) {
		return [];
	}
	result = await readDBF(url, {
		flags: DBF_LlegeixRecords,
		header: header,
		fields: fields,
		recordRange: { index: index, count: count },
		includeDeleted: true,
		fetchLog: fetchLog,
		rangeStore: rangeStore,
		cacheRecords: true
	});
	return result.records || [];
}

function siblingDBFUrl(baseUrl, dbfCode) {
	var url = new URL(baseUrl, window.location.href);
	url.pathname = url.pathname.replace(/[^/]+$/, encodeURIComponent(dbfCode) + ".dbf");
	return url.href;
}

function assignDBFDGGSLastMeta(cache, shared, meta) {
	if (cache) {
		cache.lastMeta = meta;
	}
	if (shared) {
		shared.lastMeta = meta;
	}
	getDBFDGGSCells.lastMeta = meta;
}

async function llegeixDBFSliceDades(catalogueUrl, header, fields, dbfCode, offset, size, fetchLog, rangeStore) {
	var dataUrl, dataStruct, dataRecords;

	if (dbfCode === null || dbfCode === undefined || dbfCode === "") {
		throw new Error("Matching catalogue record has an empty DBF_CODE");
	}
	if (typeof offset !== "number" || typeof size !== "number" || size < 0) {
		throw new Error("Matching catalogue record has invalid OFFSET/SIZE");
	}
	dataUrl = siblingDBFUrl(catalogueUrl, dbfCode);
	dataStruct = await readDBF(dataUrl, {
		flags: DBF_LlegeixHeader | DBF_LlegeixFields,
		fetchLog: fetchLog,
		rangeStore: rangeStore
	});
	if (size === 0) {
		return { records: [], dataUrl: dataUrl, dataHeader: dataStruct.header, dataFields: dataStruct.fields };
	}
	dataRecords = await readDBF(dataUrl, {
		flags: DBF_LlegeixRecords,
		header: dataStruct.header,
		fields: dataStruct.fields,
		recordRange: { start: offset, end: offset + size - 1 },
		fetchLog: fetchLog,
		rangeStore: rangeStore,
		cacheRecords: false
	});
	return {
		records: dataRecords.records || [],
		dataUrl: dataUrl,
		dataHeader: dataStruct.header,
		dataFields: dataStruct.fields
	};
}

async function getDBFDGGSCellsAmbCache(cache, tileMatrix, i_ini, i_end, j_ini, j_end, optimSol) {
	var shared, catalogue, hit, records, fetchLog = [], meta;
	var ordreCols, count, catRecords, prefix, k, rec, startIndex;
	var slices, slice, last, dataUrl, dataHeader, dataFields, part;

	shared = getDBFSharedState(cache);
	if (!shared.catalogue) {
		throw new Error("Call openDBFDGGSCache(catalogueUrl) before getDBFDGGSCells()");
	}

	i_end = normalitzaLimitDBF(i_end, i_ini);
	j_end = normalitzaLimitDBF(j_end, j_ini);
	ordreCols = esOrdreCatalegDBFPerCols(optimSol);
	if (compareDBFAscending(i_ini, i_end) !== 0 && compareDBFAscending(j_ini, j_end) !== 0) {
		if (ordreCols) {
			j_end = j_ini;
		} else {
			i_end = i_ini;
		}
	}
	if (ordreCols) {
		count = Number(i_end) - Number(i_ini) + 1;
	} else {
		count = Number(j_end) - Number(j_ini) + 1;
	}
	if (!(count >= 1)) {
		count = 1;
		i_end = i_ini;
		j_end = j_ini;
	}

	catalogue = shared.catalogue;
	hit = await bsearchDBFCatalogue(shared.catalogueUrl, catalogue.header, catalogue.fields,
		tileMatrix, i_ini, j_ini, fetchLog, shared, ordreCols);
	if (hit && hit.record) {
		delete hit.record._deleted;
	}
	startIndex = (hit && hit.record) ? hit.index : hit.insert;
	if (startIndex < 0 || startIndex >= catalogue.header.nRecords) {
		records = [];
		meta = {
			catalogueUrl: shared.catalogueUrl,
			cacheId: cache.id,
			catalogueHeader: catalogue.header,
			catalogueFields: catalogue.fields,
			match: null,
			fetches: fetchLog.slice(),
			cache: getDBFDGGSCacheStats(cache)
		};
		records.meta = meta;
		assignDBFDGGSLastMeta(cache, shared, meta);
		return records;
	}

	if (count === 1 && hit.record) {
		catRecords = [hit.record];
	} else {
		catRecords = await readDBFCatalogueRecords(shared.catalogueUrl, catalogue.header,
			catalogue.fields, startIndex, count, fetchLog, shared);
	}

	prefix = [];
	for (k = 0; k < catRecords.length; k++) {
		rec = catRecords[k];
		if (rec._deleted) {
			continue;
		}
		if (recordDBFDinsRun(rec, tileMatrix, i_ini, i_end, j_ini, j_end, ordreCols)) {
			prefix.push(rec);
			continue;
		}
		if (prefix.length > 0 || recordDBFPassatRun(rec, tileMatrix, i_ini, i_end, j_ini, j_end, ordreCols)) {
			break;
		}
	}

	records = [];
	slices = [];
	for (k = 0; k < prefix.length; k++) {
		rec = prefix[k];
		last = slices.length ? slices[slices.length - 1] : null;
		if (last && sonOFFSETDBFConsecutius(last.last, rec)) {
			last.size += rec.SIZE;
			last.last = rec;
			last.n++;
		} else {
			slices.push({
				dbfCode: rec.DBF_CODE,
				offset: rec.OFFSET,
				size: rec.SIZE,
				last: rec,
				n: 1
			});
		}
	}

	dataUrl = null;
	dataHeader = null;
	dataFields = null;
	for (k = 0; k < slices.length; k++) {
		slice = slices[k];
		part = await llegeixDBFSliceDades(shared.catalogueUrl, catalogue.header, catalogue.fields,
			slice.dbfCode, slice.offset, slice.size, fetchLog, shared);
		if (!dataUrl) {
			dataUrl = part.dataUrl;
			dataHeader = part.dataHeader;
			dataFields = part.dataFields;
		}
		records.push.apply(records, part.records);
	}

	meta = {
		catalogueUrl: shared.catalogueUrl,
		cacheId: cache.id,
		catalogueHeader: catalogue.header,
		catalogueFields: catalogue.fields,
		match: {
			index: hit.index,
			record: hit.record,
			nCatalogue: prefix.length,
			nSlices: slices.length
		},
		dataUrl: dataUrl,
		dataHeader: dataHeader,
		dataFields: dataFields,
		fetches: fetchLog.slice(),
		cache: getDBFDGGSCacheStats(cache)
	};
	records.meta = meta;
	assignDBFDGGSLastMeta(cache, shared, meta);
	return records;
}

async function getDBFDGGSCells(cacheOrUrl, tileMatrix, i_ini, i_end, j_ini, j_end, optimSol) {
	var cache = cacheOrUrl, openedHere = false, records;

	if (typeof cacheOrUrl === "string") {
		cache = await openDBFDGGSCache(cacheOrUrl);
		openedHere = true;
	}
	try {
		records = await getDBFDGGSCellsAmbCache(cache, tileMatrix, i_ini, i_end, j_ini, j_end, optimSol);
		return records;
	} finally {
		if (openedHere) {
			closeDBFDGGSCache(cache);
		}
	}
}

getDBFDGGSCells.lastMeta = null;
