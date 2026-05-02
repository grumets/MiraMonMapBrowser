"use strict"

const brandSOHMeaning=[
		{brand: "miaf", meaning: "File structured in boxes with Metabox and HandlerBox (from ISO 23000-33)"},
		{brand: "mif1", meaning: "HEIF File: Still imagery version 1 (from HEIF)"},
		{brand: "mif2", meaning: "HEIF File: Still imagery version 2 (from HEIF)"},
		{brand: "msf1", meaning: "HEIF File: Image sequence version 1 (from HEIF)"},
		{brand: "msf2", meaning: "HEIF File: Image sequence version 2 (from HEIF)"},
		{brand: "isob", meaning: "HEIF File: Media track including Motion Imagery (from ISOBMFF)"},
		{brand: "unif", meaning: "Unified handling of IDs across file scoped MetaBox items, tracks, track groups, and entity groups (from ISOBMFF)"},
		{brand: "geo1", meaning: "GIMI File: conformant to version 1 of NGA.STND.0076_1.0 (from NGA.STND.0076-01_v1)"},
		{brand: "sm01", meaning: "GIMI File with Security XML markings (from NGA.STND.0076-01_v1)"},
		{brand: "j2ki", meaning: "Image item coding is JPEG2000 or HTJ2K (from 15444-16)"},
		{brand: "j2is", meaning: "Image sequences are JPEG2000 or HTJ2K (from 15444-16)"},
		{brand: "heic", meaning: "Image item coding is HEVC (from 23008-2 and -12)"},
		{brand: "hevc", meaning: "Image sequences are HEVC (from  23008-12 and 14496-15)"},
		{brand: "heix", meaning: "Image item coding is an extension of HEVC (from 23008-2 and -12)"},
		{brand: "hevx", meaning: "Image sequences are extension of HEVC (from 23008-12 and 14496-15)"},
		{brand: "avci", meaning: "Image item coding is an AVC (from 14496-10 and 23008-12)"},
		{brand: "avcs", meaning: "Image sequences are an AVC (from 23008-12 and 14496-15)"}
	];

const mediaHandlerSOHMeaning=[
		{handler: "pict", meaning: "Picture media (defined in: ISO23008-12)"},
		{handler: "vide", meaning: "Video media (defined in: ISO14496-12)"},
		{handler: "soud", meaning: "Sound media (defined in: ISO14496-12)"},
		{handler: "test", meaning: "Text media (defined in: ISO14496-12)"}
	];

function readSOHFtypBox(dataView, offset, dataOffset, size) {
	var result={};
	result.majorBrand=getSOHString(dataView, offset, offset+4);
	result.minorVersion=dataView.getUint32(4);
	offset+=8;
	if (offset<size-dataOffset-3) {
		result.compatibleBrands=[];
		while(offset<size-dataOffset-3)
		{
			result.compatibleBrands.push(getSOHString(dataView, offset, offset+4));
			offset+=4;
		}
	}
	return result;
}

function isBrandPresent(fileInfo, brand) {
	if (fileInfo.brand.majorBrand==brand)
		return true;
	return (fileInfo.brand.compatibleBrands.indexOf(brand)==-1) ? false : true;
}

async function readSOHFtypBoxURL(url, fileInfo) {

	var i=getIndexSOHBoxType(fileInfo.boxes, "ftyp");
	if (i==-1)
		return;

	var result=await readSOHBoxURL(url, fileInfo.boxes[i].start, fileInfo.fileSize);
	return readSOHFtypBox(result.dataView, 0, result.dataOffset, result.size);
}

async function readSOHHdlrBox(url, fileInfo) {
	var i=getIndexSOHBoxType(fileInfo.boxes, "meta/hdlr");
	if (i==-1)
		return;

	var start=fileInfo.boxes[i].start;
	var result=await readSOHBoxURL(url, start, fileInfo.fileSize);
	//var dvOffset=result.dataOffset;
	var dataView=result.dataView;
	//result.version=getFullBoxVersion(dataView, 0);
	//result.flags=getFullBoxFlags(dataView, 1);

    	//unsigned int(32) pre_defined = 0; //No need to read it
	var offset=8;
	var handlerType=getSOHString(dataView, offset, offset+4);
    	//const unsigned int(32)[3] reserved = 0;   //No need to read it
    	//string name;  //Not found in the examples
	return handlerType;
}

async function readSOHPitmBoxURL(url, fileInfo) {
	var i=getIndexSOHBoxType(fileInfo.boxes, "meta/pitm");
	if (i==-1)
		return null;

	var start=fileInfo.boxes[i].start;
		
	var result=await readSOHBoxURL(url, start, fileInfo.fileSize);
	var dataView=result.dataView;
	//var dvOffset=result.dataOffset;
	//result=readSOHFullBox(dataView, dvOffset, start, fileInfo.fileSize);
	result.version=getFullBoxVersion(dataView, 0);
	result.flags=getFullBoxFlags(dataView, 1);

	if (result.version == 0) {
       //unsigned int(16) item_ID;
	   result.primaryItemId=dataView.getUint16(4);
    } else if (result.version == 1) {
        //unsigned int(32) item_ID;
		result.primaryItemId=dataView.getUint32(4);
    }
	return result;
}

async function readSOHBoxDumpURL(url, limit, divIdBox, showDump) {
	var start = 0, result, array=[];
	var fileSize=await getURLSize(url);
	if(typeof fileSize==="undefined")
		return null;

	while (result=await readSOHBoxURL(url, start, fileSize, limit)) {
		array.push(result);
		if (showDump)
			showDump({boxes: array}, divIdBox);
		if (result.type=='meta' && result.dataView && result.dataView.getUint32(0)==0) {
			var startBox=start + 12;
			var endBox=result.size+start;
			var resultBox;
			while (resultBox=await readSOHBoxURL(url, startBox, fileSize, limit)) {
				resultBox.type='meta'+'/'+resultBox.type;
				array.push(resultBox);
				if (showDump)
					showDump({boxes: array}, divIdBox);
				startBox+=resultBox.size;
				if (startBox>=endBox)
					break;
			};
		}	
		start+=result.size;
		if (start>=fileSize)
			break;
	};
	if(typeof fileSize==="undefined" && typeof array==="undefined")
		return null;
	return {boxes: array, fileSize: fileSize};
}

function getIndexSOHBoxType(boxes, type) {
	for (var i=0; i<boxes.length; i++) {
		if (boxes[i].type==type)
			return i;
	}
	return -1;
}

function getIndexSOHItemID(items, itemId) {
	for (var i=0; i<items.length; i++) {
		if (items[i].itemId==itemId)
			return i;
	}
	return -1;
}

function getUIntegerByteSize(dataView, offset, byteSize) {
	if (byteSize==4)
		return dataView.getUint32(offset);
	if (byteSize==8)
		return Number(dataView.getBigUint64(offset));
	return 0;
}

function readSOHIspe(dataView, offset, start, fileSize) {
	var result=readSOHFullBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	result.imageWidth=dataView.getUint32(offset);
	result.imageHeight=dataView.getUint32(offset+4);
	result.dataOffset+=8;
	return result;
}

function readSOHPixi(dataView, offset, start, fileSize) {
	var result=readSOHFullBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	var numChannels=dataView.getUint8(offset);
	offset++;
	result.bitsPerChannels=[];
	for (var i=0; i<numChannels; i++)
		result.bitsPerChannels.push(dataView.getUint8(offset+i)); 
	result.dataOffset+=1+numChannels;
	return result;
}

function readSOHColr(dataView, offset, start, fileSize) {
	var result=readSOHBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	
	result.colourType=getSOHString(dataView, offset, offset+4);
	offset+=4;
	if (result.colourType == 'nclx') {
		result.colourPrimaries=dataView.getUint16(offset);
		result.transferCharacteristics=dataView.getUint16(offset+2);
		result.matrixCoefficients=dataView.getUint16(offset+4);
		result.fullRangeFlag=dataView.getUint8(offset+6)>>7;
    }
    else if (result.colourType == 'rICC' || result.colourType == 'prof') {
		result.iccProfile=dataView.getUint8(offset);
    }
	return result;
}

const possibleOffsetTileLengths=[32, 40, 48, 64];
const possibleSizeTileLengths=[0, 24, 32, 64];
function readSOHTilC(dataView, offset, start, fileSize) {
	var offsetIni=offset;
	var result=readSOHFullBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	result.tileWidth=dataView.getUint32(offset);
	result.tileHeight=dataView.getUint32(offset+4);

	result.offsetTileLength=possibleOffsetTileLengths[result.flags&0x03]
	result.sizeTileLength=possibleSizeTileLengths[(result.flags>>2) & 0x03];
	result.areTileOffsetsSequential=(result.flags & 0x10) ? true : false;

	result.itemTypeTile=getBoxType(dataView, offset+8); // the standard name, in the version implemented, is tile_compression_type (in the last draft is tile_item_type)
	

	var numberOfExtraDimensions=dataView.getUint8(offset+12);
	offset+=13;
	if (numberOfExtraDimensions) {
		result.extraDimensionSizes=[];
	  	for (var i=0; i<numberOfExtraDimensions; i++) { 
			result.extraDimensionSizes[i].push(dataView.getUint32(offset));
			offset+=4;
		}
	}

	var numberOfTileProperties=dataView.getUint8(offset);
	offset+=1;
	var prop;
	if (numberOfTileProperties) {
		result.tileProperties=[];
	  	for (var i=0; i<numberOfTileProperties; i++) { 
			prop=readSOHBox(dataView, offset, start, fileSize);
			result.tileProperties[i]=prop.type;
			if (prop.type=="ispe")
				prop=readSOHIspe(dataView, offset, start, fileSize);
			else if (prop.type=="pixi")
				prop=readSOHPixi(dataView, offset, start, fileSize);
			else if (prop.type=="colr")
				prop=readSOHColr(dataView, offset, start, fileSize);
			else if (prop.type=="hvcC")
				prop=readSOHHvcC(dataView, offset, start, fileSize);
			else if (prop.type=="uncC")
				prop=readSOHUncC(dataView, offset, start, fileSize);
			else if (prop.type=="cmpC")
				prop=readSOHCmpC(dataView, offset, start, fileSize);
			else if (prop.type=="cmpd")
				prop=readSOHCmpd(dataView, offset, start, fileSize);
			else if (prop.type=="j2kH")
				prop=readSOHJ2kH(dataView, offset, start, fileSize);
			else 
				continue;
			copyPropertiesIpcoBox(result, prop);
			
			offset+=prop.size;
		}
	}
	result.dataOffset+=offset-offsetIni;
	return result;
}

function readSOHHvcC(dataView, offset, start, fileSize) {
	var result=readSOHBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	//HEVCDecoderConfigurationRecord
	result.configurationVersion=dataView.getUint8(offset);
	if (result.configurationVersion!=1) {
		console.log("Unsupported HvcC configuration version: " + result.configurationVersion);
		return result;
	}
	offset++;
	result.generalProfileSpace=dataView.getUint8(offset)>>6;
	result.generalTierFlag=(dataView.getUint8(offset)&0x20)>>5;
	result.generalProfileIdc=dataView.getUint8(offset)&0x1F;
	offset++;
	
	result.generalProfileCompatibility=dataView.getUint32(offset);
	offset+=4;
	//This one is a int of 48 bytes mapped as an array of 6 bytes
	result.generalConstraintIndicator=[dataView.getUint8(offset), dataView.getUint8(offset+1), dataView.getUint8(offset+2), 
						dataView.getUint8(offset+3), dataView.getUint8(offset+4), dataView.getUint8(offset+5)];
	offset+=6;
	result.generalLevelIdc=dataView.getUint8(offset);
	offset++;
	result.minSpatialSegmentationIdc=dataView.getUint16(offset)&0x0FFF;
	offset+=2;
	result.parallelismType=dataView.getUint8(offset)&0x03;
	offset++;
	result.chromaFormatIdc=dataView.getUint8(offset)&0x03;
	offset++;
	result.bitDepthLuma=(dataView.getUint8(offset)&0x07)+8;
	offset++;
	result.bitDepthChroma=(dataView.getUint8(offset)&0x07)+8;
	offset++;
	result.avgFrameRate=dataView.getUint16(offset);
	offset+=2;
	result.constantFrameRate=dataView.getUint8(offset)>>6
	result.numTemporalLayers=(dataView.getUint8(offset)&0x38)>>3;
	result.temporalIdNested=(dataView.getUint8(offset)&0x04)>>2;
	result.lengthSize=(dataView.getUint8(offset)&0x03)+1;
	offset++;
	var nArray=dataView.getUint8(offset);
	offset++;
	var nNalus, size;
	result.naluArrays=[];
	for (var j=0; j<nArray; j++) {
		result.naluArrays[j]={arrayCompleteness: dataView.getUint8(offset)>>7,
					naluType: dataView.getUint8(offset)&0x3F}
		offset++;
		nNalus=dataView.getUint16(offset);
		offset+=2;
		result.naluArrays[j].data=[];
		for (var i=0; i<nNalus; i++) {
			size=dataView.getUint16(offset);
			offset+=2;
			result.naluArrays[j].data[i]=[];
			for (var z=0; z<size; z++) {
				result.naluArrays[j].data[i][z]=dataView.getUint8(offset);
				offset++;
			}		
		}
	}
	return result;
}


function readSOHCdef(dataView, offset, start, fileSize) {
	var result=readSOHBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	// cdef (ComponentDefinitionBox)
	// number of component definitions
	result.nComp=dataView.getUint16(offset);
	offset+=2;
	if(!result.nComp)
		return result;
	result.comp=[];
	for (var i = 0; i < result.nComp; i++) {
		 // component index (0..N-1)
		result.comp[i]={index: dataView.getUint16(offset)};
		offset+=2;
		// component type
		result.comp[i].type=dataView.getUint16(offset);
		/*Type – Component type (16 bits)
		0	Unspecified
		1	Y (luma)
		2	Cb
		3	Cr
		4	R
		5	G
		6	B
		7	Alpha
		8	Opacity
		9   Deepht*/
		offset+=2;
		// component association
		result.comp[i].assoc=dataView.getUint16(offset);
		offset+=2;
	}
	return result;
}

function readSOHJ2kH(dataView, offset, start, fileSize) {
	var result=readSOHBox(dataView, offset, start, fileSize);
	var resultSize=offset+result.size;
	offset+=result.dataOffset;
	var boxes;
	while (resultSize>offset){
		boxes=readSOHBox(dataView, offset, start, fileSize);
		if (boxes.type=='cdef') {
			//read 'cdef'
			result.cdef=readSOHCdef(dataView, offset, start, fileSize);
		}
		offset+=boxes.size;
	}
	return result;
}

function readSOHCmpC(dataView, offset, start, fileSize) {
	// cmpC CompressionConfigurationBox 
	var result=readSOHFullBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	result.compressionType=getBoxType(dataView, offset);
	
	//‘defl’	DEFLATE algorithm as defined in IETF RFC 1951
	//‘zlib’	DEFLATE algorithm as packaged in the format defined by IETF RFC 1950
	//‘brot’	Brotli algorithm as defined in IETF RFC 7932
	
	//unsigned int(1) must_decompress_individual_entities can_decompress_contiguous_ranges;
	//unsigned int(7) compressed_range_typecompressed_entity_type;
	return result;
}


/*aligned(8) class ComponentDefinitionBox extends Box('cmpd') {
	unsigned int(32) component_count;	
	{
		unsigned int(16) component_type;
		if (component_type>=0x8000) {
			utf8string component_type_uri;
		}
	} [component_count];
}*/

function readSOHCmpd(dataView, offset, start, fileSize) {
	var result=readSOHBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;
	// cmpd (ComponentDefinitionBox)
	
	// number of component definitions
	result.componentCountDef=dataView.getUint32(offset);
	offset+=4;
	if(!result.componentCountDef)
		return result;
	result.componentTypeDef=[];
	for (var i = 0; i < result.componentCountDef; i++) {
		result.componentTypeDef[i]=dataView.getUint16(offset);
		/*Type – Component type (16 bits)
		0	Monochrome component 
		1	Luma component (Y)
		2	Chroma component (Cb / U)
		3	Chroma component (Cr / V)
		4	Red component (R)
		5	Green component (G)
		6	Blue component(B)
		7	Alpha/transparency component (A)
		8	Depth component (D)
		9	Disparity component (Disp)
		10	Palette component (P)
		The component_format value for this component shall be 0.
		11	Filter Array component such as Bayer, RGBW, etc. (FA)
		12	Padded component (unused bits/bytes)
		13-0x7FFF	ISO/IEC reserved*/
		offset+=2;
		if(result.componentTypeDef[i] >= 0x8000) // user defined
		{
			result.componentTypeDef[i]=getSOHString(dataView, offset, offset+result.size);
			offset+=getSOHStringSize(items[i].itemName, offset, offset+result.size);
		}
		
	}
	return result;
}

function readSOHUncC(dataView, offset, start, fileSize) {
	//uncC UncompressedFrameConfigBox
	var result=readSOHFullBox(dataView, offset, start, fileSize);
	offset+=result.dataOffset;	
	if(result.version==1) // there is only uncompressProfile
	{
		result.uncompressProfile=getBoxType(dataView, offset);
		return result;
	}
	//version==0 
	result.uncompressProfile=dataView.getUint32(offset); 
	if(result.uncompressProfile>0)		
		result.uncompressProfile=getBoxType(dataView, offset);
	offset+=4;
	result.componentCount=dataView.getUint32(offset);
	offset+=4;
	result.componentIndex=[];
	result.componentBitDepthMinusOne=[];
	result.componentFormat=[];
	result.componentAlignSize=[];
	for(var i=0; i<result.componentCount; i++)
	{
		result.componentIndex[i]=dataView.getUint16(offset);
		result.componentBitDepthMinusOne[i]=dataView.getUint8(offset+2);
		result.componentFormat[i]=dataView.getUint8(offset+3);
		result.componentAlignSize[i]=dataView.getUint8(offset+4);
    }
	offset+=5;
	result.samplingType=dataView.getUint8(offset);
	offset++;
	result.interleaveType=dataView.getUint8(offset);
	offset++;
	result.blockSize=dataView.getUint8(offset);
	offset++;
	result.componentsLittleEndian=(dataView.getUint8(offset)>>7)&1;
	result.blockPadLsb=(dataView.getUint8(offset)>>6)&1;
	result.blockLittleEndian=(dataView.getUint8(offset)>>5)&1;
	result.blockReversed=(dataView.getUint8(offset)>>4)&1;
	result.padUnknown=(dataView.getUint8(offset)>>3)&1;
	//bit(3) reserved = 0;
	offset++;

	result.pixelSize=dataView.getUint32(offset);
	offset+=4;
	result.rowAlignSize=dataView.getUint32(offset);
	offset+=4;
	result.tileAlignSize=dataView.getUint32(offset);
	offset+=4;
	result.numTileColsMinusOne=dataView.getUint32(offset);
	offset+=4;
	result.numTileRowsMinusOne=dataView.getUint32(offset);
	
	return result;
	
}

function copyPropertiesIpcoBox(item, prop) {
	if(!prop)
		return;
	var propArray=Object.keys(prop);
	for (var i=0; i<propArray.length; i++){
		if (propArray[i]=="size" || propArray[i]=="type" || propArray[i]=="dataOffset" || propArray[i]=="version" || propArray[i]=="flags")
			continue;
		if(typeof item[propArray[i]]==="undefined" || item[propArray[i]]==null || item[propArray[i]]=="")  // NJ I've seen that sometimes the same property is there twice.
			item[propArray[i]]=prop[propArray[i]];
	}
}

async function readSOHItemsDumpURL(url, sidecarUrl, fileInfo, divIdItem, showDump) {
	var result, resultItem, offset, offsetItem, entryCount;

	var i=getIndexSOHBoxType(fileInfo.boxes, "meta/iinf");
	if (i==-1)
		return;

	//Reading iinf as a FullBox 
	var start=fileInfo.boxes[i].start;
	result=await readSOHBoxURL(url, start, fileInfo.fileSize);
	var dvOffset=result.dataOffset;
	var dataView=result.dataView;
	result.version=getFullBoxVersion(dataView, 0);
	result.flags=getFullBoxFlags(dataView, 1);
	
	if (result.version==0) {
		entryCount=dataView.getUint16(4);
		offset=6;
	} else {
		entryCount=dataView.getUint32(4);
		offset=8;
	}

	var items=[];
	for (var i=0; i<entryCount; i++) {
		offsetItem=offset;
		resultItem=readSOHFullBox(dataView, offset, start, fileInfo.fileSize);
		offset+=resultItem.dataOffset;
		items.push(resultItem);
		if (resultItem.type=="infe") {
			if (resultItem.version == 0 || resultItem.version == 1) {
				items[i].itemId=dataView.getUint16(offset);
				offset+=2;
				items[i].itemProtectionIndex=dataView.getUint16(offset);
				offset+=2;

				items[i].itemName=getSOHString(dataView, offset, offsetItem+resultItem.size);
				offset+=getSOHStringSize(items[i].itemName, offset, offsetItem+resultItem.size);

 				items[i].contentType=getSOHString(dataView, offset, offsetItem+resultItem.size);
				offset+=getSOHStringSize(items[i].contentType, offset, offsetItem+resultItem.size);

				items[i].contentEncoding=getSOHString(dataView, offset, offsetItem+resultItem.size);
				offset+=getSOHStringSize(items[i].contentEncoding, offset, offsetItem+resultItem.size);
			} else {
				if (resultItem.version == 2) { 
					items[i].itemId=dataView.getUint16(offset);
					offset+=2;
				} else if (resultItem.version == 3) { 
					items[i].itemId=dataView.getUint32(offset);
					offset+=4;
				}
				items[i].itemProtectionIndex=dataView.getUint16(offset);
				offset+=2;
				items[i].itemType=getBoxType(dataView, offset);
				offset+=4;

				items[i].itemName=getSOHString(dataView, offset, offsetItem+resultItem.size)
				offset+=getSOHStringSize(items[i].itemName, offset, offsetItem+resultItem.size);;
				if (items[i].itemType=='mime') { 
	 				items[i].contentType=getSOHString(dataView, offset, offsetItem+resultItem.size); 
					offset+=getSOHStringSize(items[i].contentType, offset, offsetItem+resultItem.size);

					items[i].contentEncoding=getSOHString(dataView, offset, offsetItem+resultItem.size);
					offset+=getSOHStringSize(items[i].contentEncoding, offset, offsetItem+resultItem.size);
 				} else if (items[i].itemType == 'uri ') {
					items[i].itemUriType=getSOHString(dataView, offset, offsetItem+resultItem.size);
					offset+=getSOHStringSize(items[i].itemUriType, offset, offsetItem+resultItem.size);
				}
 			}
  		}
		if (showDump && (entryCount<20 || i%Math.trunc(entryCount/20)==0))
			showDump(items, divIdItem);
	}
	if (showDump && entryCount>=20)
		showDump(items, divIdItem);

	var idat=getIndexSOHBoxType(fileInfo.boxes, "meta/idat");  //in case constructionMethod==1;

	var i=getIndexSOHBoxType(fileInfo.boxes, "meta/iloc");
	if (i==-1)
		return items;

	//Reading iloc as a FullBox 
	var start=fileInfo.boxes[i].start;
	result=await readSOHBoxURL(url, start, fileInfo.fileSize);
	var dvOffset=result.dataOffset
	var dataView=result.dataView;
	result.version=getFullBoxVersion(dataView, 0);
	result.flags=getFullBoxFlags(dataView, 1);

	result.offsetSize=dataView.getUint8(4)>>4;
	result.lengthSize=dataView.getUint8(4)&0x0F;
	result.baseOffsetSize=dataView.getUint8(5)>>4; 
	if (result.version == 1 || result.version == 2)
		result.indexSize=dataView.getUint8(5)&0x0F; 
	else {
		result.indexSize=0;
	//	result.reserved=dataView.getUint8(5)&0x0F;
	}

	if (result.version < 2) {
		result.itemCount=dataView.getUint16(6);
		offset=8;
	}
	else if (result.version == 2) { 
 		result.itemCount=dataView.getUint32(6);
		offset=10;
	}
	var itemId, item, constructionMethod;
	for (i=0; i<result.itemCount; i++) { 
		if (result.version < 2) { 
			itemId=dataView.getUint16(offset);
			offset+=2;
		} else if (result.version == 2) { 
			itemId=dataView.getUint32(offset);
			offset+=4;
		}

		var z=getIndexSOHItemID(items, itemId);
		if (z==-1)
			continue;
		item=items[z];
		if (result.version == 1 || result.version == 2) { 
			//unsigned int(12) reserved = 0; 
			constructionMethod=dataView.getUint16(offset)&0x0F;
			offset+=2;
		}
		else
			constructionMethod=0;
		//data_reference_index=dataView.getUint16(offset)  //the origin of the offset is the beginning of the file identified by the data_reference_index
		offset+=2;
		var baseOffset=getUIntegerByteSize(dataView, offset, result.baseOffsetSize);
		offset+=result.baseOffsetSize;
		var extentCount=dataView.getUint16(offset);
		offset+=2;
		item.extents=[];
		for (var j=0; j<extentCount; j++) {
			item.extents.push({});
			if ((result.version == 1 || result.version == 2) && result.indexSize > 0) { 
				item.extents[j].extentIndex=getUIntegerByteSize(dataView, offset, result.indexSize);
				offset+=result.baseOffsetSize;
 			}
			else
				item.extents[j].extentIndex=0;
			item.extents[j].extentOffset=getUIntegerByteSize(dataView, offset, result.offsetSize)+baseOffset;
			offset+=result.offsetSize;
			if (idat!=-1 && constructionMethod==1) 
				item.extents[j].extentOffset+=fileInfo.boxes[idat].start+fileInfo.boxes[idat].dataOffset;
			item.extents[j].extentLength=getUIntegerByteSize(dataView, offset, result.lengthSize);
			offset+=result.lengthSize;
		} 
		if (showDump && (result.itemCount<20 || i%Math.trunc(result.itemCount/20)==0))
			showDump(items, divIdItem);
	}
	if (showDump && result.itemCount>=20)
		showDump(items, divIdItem);
	
	var i=getIndexSOHBoxType(fileInfo.boxes, "meta/iprp");
	if (i==-1)
		return items;
	//Reading iloc as a FullBox 
	var start=fileInfo.boxes[i].start;
	result=await readSOHBoxURL(url, start, fileInfo.fileSize);
	var dvOffset=result.dataOffset
	var dataView=result.dataView;

	//read 'ipco'
	result=readSOHBox(dataView, 0, start, fileInfo.fileSize);
	offset=result.dataOffset;
	if (result.type!='ipco') {
		console.log("Unexpected section in 'meta/iprp':" + result.type);
		return items;
	}

	var props=[], prop;
	while (result.size>offset){
		prop=readSOHBox(dataView, offset, start, fileInfo.fileSize);
		//Details of reading each individual box
		if (prop.type=="ispe")
			prop=readSOHIspe(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="pixi")
			prop=readSOHPixi(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="colr")
			prop=readSOHColr(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="tilC")
			prop=readSOHTilC(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="hvcC")
			prop=readSOHHvcC(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="uncC")
			prop=readSOHUncC(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="cmpC")
			prop=readSOHCmpC(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="cmpd")
			prop=readSOHCmpd(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="j2kH")
			prop=readSOHJ2kH(dataView, offset, start, fileInfo.fileSize);
		else if (prop.type=="uuid") 
			prop.contentId=getSOHString(dataView, offset+prop.dataOffset, offset+prop.size);

		props.push(prop);
		offset+=prop.size;
	}
	result=readSOHFullBox(dataView, offset, start, fileInfo.fileSize);
	offset+=result.dataOffset;
	if (result.type!='ipma') {
		console.log("Unexpected section in 'meta/iprp':" + result.type);
		return items;
	}
	entryCount=dataView.getUint32(offset);
	offset+=4;
	var associationCount, propIndex;
	for(var i=0; i<entryCount; i++) { 
		if (result.version < 1) {
			itemId=dataView.getUint16(offset);
			offset+=2;
		} else {
			itemId=dataView.getUint32(offset);
			offset+=4;
		}

		var z=getIndexSOHItemID(items, itemId);
		if (z==-1)
			continue;
		item=items[z];
		var associationCount=dataView.getUint8(offset);
		offset+=1;
		item.associations=[];
		for (j=0; j<associationCount; j++) {
			item.associations.push({});
			if (dataView.getUint8(offset)&0x80)
				item.associations[j].essential=true; 
			if (result.flags & 1) {
				propIndex=dataView.getUint16(offset)&0x7FFF;
				offset+=2;
			} else {
				propIndex=dataView.getUint8(offset)&0x7F;
				offset+=1;
			}
			propIndex--;
			if (propIndex<props.length) {
				item.associations[j].type=props[propIndex].type;
				if (props[propIndex].type=="ispe" || props[propIndex].type=="pixi" || props[propIndex].type=="uuid" || props[propIndex].type=="colr" || 
					props[propIndex].type=="tilC" || props[propIndex].type=="hvcC" || props[propIndex].type=="uncC" || props[propIndex].type=="cmpC" || 
					props[propIndex].type=="cmpd" || props[propIndex].type=="j2kH")
					copyPropertiesIpcoBox(item, props[propIndex]);
			}
		}

		//Calculating number of tiles
		if (item.tileWidth && item.imageWidth && item.tileHeight && item.imageHeight) {
			item.matrixWidth = Math.trunc((item.imageWidth + item.tileWidth -1)/item.tileWidth);
			item.matrixHeight = Math.trunc((item.imageHeight + item.tileHeight -1)/item.tileHeight);
			var nTiles = item.matrixWidth * item.matrixHeight;
			if (item.extraDimensionSizes &&item.extraDimensionSizes.length) {
				for (var k=0; k<item.extraDimensionSizes.length; z++)
					nTiles *= item.extraDimensionSizes[z];
			}
			var sizeMdatTileHeader=(item.offsetTileLength+item.sizeTileLength)/8*nTiles;
			if (item.extents.length>1 && sizeMdatTileHeader>item.extents[0].extentLength) {
				console.log("Offsets of the tiles in 'mdat' box are in two or more separate chucks. This is not supported.");
				sizeMdatTileHeader=item.extents[0].extentLength;
			}
			var headerOffsetBuffer=await getURLBuffer(url, item.extents[0].extentOffset, item.extents[0].extentOffset+sizeMdatTileHeader-1);
			var headerOffsetDV = new DataView(headerOffsetBuffer);
			var offsetHeader=0;
			if (headerOffsetDV) {
				item.tiles=[];
				for (j=0; j<nTiles; j++) {
					item.tiles.push({});
					switch(item.offsetTileLength) {
						case 32:
							item.tiles[j].offset=headerOffsetDV.getUint32(offsetHeader);
							break;
						case 40:
							item.tiles[j].offset=headerOffsetDV.getUint32(offsetHeader)*256 + 
										headerOffsetDV.getUint8(offsetHeader+4);
							break;
						case 48:
							item.tiles[j].offset=headerOffsetDV.getUint32(offsetHeader)*65536 + 
											headerOffsetDV.getUint16(offsetHeader+4);
							break;
						case 64:
							item.tiles[j].offset=Number(headerOffsetDV.getBigUint64(offsetHeader));
							break;
					}
					item.tiles[j].offset+=item.extents[0].extentOffset; // Converting to absolut offsett from the beginning of the file
					offsetHeader+=item.offsetTileLength/8;
					switch(item.sizeTileLength) {
						case 0:
							if (item.areTileOffsetsSequential && j>0)
								item.tiles[j-1].size=item.tiles[j].offset-item.tiles[j-1].offset;
						case 24:
							item.tiles[j].size=headerOffsetDV.getUint16(offsetHeader)*256 + 
										headerOffsetDV.getUint8(offsetHeader+2);
							break;
						case 32:
							item.tiles[j].size=headerOffsetDV.getUint32(offsetHeader);
							break;
						case 64:
							item.tiles[j].size=Number(headerOffsetDV.getBigUint64(offsetHeader));
							break;
					}
					offsetHeader+=item.sizeTileLength/8;
					item.tiles[j].itemId=item.itemId;  
				}
				if (item.sizeTileLength==0 && item.areTileOffsetsSequential)
					item.tiles[nTiles-1].size=(nTiles>1) ? item.extents[0].extentOffset+item.extents[0].extentLength-item.tiles[nTiles-2].offset : //The end of the box minus the last offset
								item.extents[0].extentLength-sizeMdatTileHeader;
  			}
		}
		if (showDump && (entryCount<20 || i%Math.trunc(entryCount/20)==0))
			showDump(items, divIdItem);
	}
	if (showDump && entryCount>=20)
		showDump(items, divIdItem);

	var i=getIndexSOHBoxType(fileInfo.boxes, "meta/iref");
	if (i!=-1) {
		//Reading iloc as a FullBox 
		start=fileInfo.boxes[i].start;
		result=await readSOHBoxURL(url, start, fileInfo.fileSize);
		var dvOffset=result.dataOffset;
		var dataView=result.dataView;
		result.version=getFullBoxVersion(dataView, 0);
		result.flags=getFullBoxFlags(dataView, 1);
		offset=4;
		var mdat=getIndexSOHBoxType(fileInfo.boxes, "mdat");
		if (mdat==-1)
			return items;
		var offsetMdat=fileInfo.boxes[mdat].start;

		var rel, itemRel, fromItemId, toItemId, referenceCount, offsetRel;
		while (result.size>offset+result.dataOffset){
			rel=readSOHBox(dataView, offset, start, fileInfo.fileSize);
			offsetRel=offset+rel.dataOffset;
			if (rel.type=='dimg') {
				if (result.version==0) {
					fromItemId=dataView.getUint16(offsetRel);
					offsetRel+=2;
				} else {
					fromItemId=dataView.getUint32(offsetRel);
					offsetRel+=4;
				}
				//Look for the itemId.
				var z=getIndexSOHItemID(items, fromItemId);
				if (z==-1) {
					offset+=rel.size;
					continue;
				}
				item=items[z];
				if (item.itemType!='grid') {
					offset+=rel.size;
					continue;
				}									
				referenceCount=dataView.getUint16(offsetRel);
				offsetRel+=2;
				for (j=0; j<referenceCount; j++) {
					if (result.version==0) {
						toItemId=dataView.getUint16(offsetRel);
						offsetRel+=2;
					} else {
						toItemId=dataView.getUint32(offsetRel);
						offsetRel+=4;
					}
					var zz=getIndexSOHItemID(items, toItemId);
					if (zz==-1)
						continue;
					itemRel=items[zz];
					itemRel.isTile=true;
					if (!item.tileWidth && !item.tileHeight) {
						item.tileWidth=itemRel.imageWidth;
						item.tileHeight=itemRel.imageHeight;
						item.matrixWidth = Math.trunc((item.imageWidth + item.tileWidth -1)/item.tileWidth);
						item.matrixHeight = Math.trunc((item.imageHeight + item.tileHeight -1)/item.tileHeight);
						item.itemTypeTile = itemRel.itemType;						
						// From uncC box
						if (typeof itemRel.uncompressProfile!== "undefined")
							item.uncompressProfile = itemRel.uncompressProfile;
						if (typeof itemRel.componentCount!== "undefined")
							item.componentCount = itemRel.componentCount;
						if (typeof itemRel.componentIndex!== "undefined")
							item.componentIndex = itemRel.componentIndex;
						if (typeof itemRel.componentBitDepthMinusOne!== "undefined")
							item.componentBitDepthMinusOne = itemRel.componentBitDepthMinusOne;
						if (typeof itemRel.componentFormat!== "undefined")
							item.componentFormat = itemRel.componentFormat;
						if (typeof itemRel.componentAlignSize!== "undefined")
							item.componentAlignSize = itemRel.componentAlignSize;
						if (typeof itemRel.samplingType!== "undefined")
							item.samplingType = itemRel.samplingType;
						if (typeof itemRel.interleaveType!== "undefined")
							item.interleaveType = itemRel.interleaveType;
						if (typeof itemRel.componentsLittleEndian!== "undefined")
							item.componentsLittleEndian = itemRel.componentsLittleEndian;
						if (typeof itemRel.blockPadLsb!== "undefined")
							item.blockPadLsb = itemRel.blockPadLsb;
						if (typeof itemRel.blockLittleEndian!== "undefined")
							item.blockLittleEndian = itemRel.blockLittleEndian;
						if (typeof itemRel.blockReversed!== "undefined")
							item.blockReversed = itemRel.blockReversed;
						if (typeof itemRel.padUnknown!== "undefined")
							item.padUnknown = itemRel.padUnknown;
						if (typeof itemRel.pixelSize!== "undefined")
							item.pixelSize = itemRel.pixelSize;
						// From cmpC box
						if (typeof itemRel.compressionType!== "undefined")
							item.compressionType = itemRel.compressionType;
					}
					if (!item.tiles)
						item.tiles=[];
					if (itemRel.extents && itemRel.extents.length>0)
						item.tiles.push({offset: itemRel.extents[0].extentOffset, size: itemRel.extents[0].extentLength, itemId: itemRel.itemId});
				}
				if (!item.tiles || item.tiles.length<item.matrixWidth*item.matrixHeight)
					console.log("This grid item (id:" + item.itemId + ") requires "+item.matrixWidth*item.matrixHeight+" but it only contains " + item.tiles.length + " tiles");
				if (showDump)
					showDump(items, divIdItem);		
			}
			offset+=rel.size;
		}		
	}
	if (sidecarUrl) {
		var ttl=await getURLText(sidecarUrl);
		fileInfo.ttlJsonld = ttl2jsonld.parse(ttl);
		addGeoreferenceToItems(items, fileInfo.ttlJsonld);
		if (showDump)
			showDump(items, divIdItem);
	} else {
		for (var i=0; i<items.length; i++) {
			if (items[i].itemType=='mime' && items[i].contentType=="text/turtle" && items[i].extents && items[i].extents.length) {
				var ttl=await getURLText(url, items[i].extents[0].extentOffset, items[i].extents[0].extentOffset+items[i].extents[0].extentLength-1);
				fileInfo.ttlJsonld = ttl2jsonld.parse(ttl);
				addGeoreferenceToItems(items, fileInfo.ttlJsonld);
				if (showDump)
					showDump(items, divIdItem);
				break;
			}
		}
	}
	var group, itemId;
	if (fileInfo.groups && fileInfo.groups.length) {
		for (var i=0; i<fileInfo.groups.length; i++) {
			if (fileInfo.groups[i].type=='pymd') {
				var group=fileInfo.groups[i];
				for (var j=0; j<items.length; j++) {
					item=items[j];
					for (var e=0; e<group.entities.length; e++) {
						if (group.entities[e].itemId==item.itemId) {
							item.pyramidId=group.groupId;
							item.sizeMultiple=group.entities[e].sizeMultiple;
							break;
						}
					}					
				}
				if (showDump)
					showDump(items, divIdItem);
			}
		}		
	}
	return items;
}

function addSOHPymd(group, dataView, offset){
	group.tileWidth=dataView.getUint16(offset);
	group.tileHeight=dataView.getUint16(offset+2);
	offset+=4;
	for (var i=0; i<group.entities.length; i++)
	{
		group.entities[i].sizeMultiple=dataView.getUint16(offset);      //layer_binning
		group.entities[i].matrixHeight=dataView.getUint16(offset+2)+1;   //tiles_in_layer_row_minus1+1
		group.entities[i].matrixWidth=dataView.getUint16(offset+4)+1;  //tiles_in_layer_column_minus1+1
		offset+=6;
	}
}

async function readSOHGroupsDumpURL(url, fileInfo, divIdGroups, showDump) {
	var result, resultItem, offset, offsetItem, entryCount;

	var i=getIndexSOHBoxType(fileInfo.boxes, "meta/grpl");
	if (i==-1) {
		if (showDump)
			showDump(null, divIdGroups);
		return;
	}

	//Reading grpl as a Box 
	var start=fileInfo.boxes[i].start;
	result=await readSOHBoxURL(url, start, fileInfo.fileSize);
	offset=0;
	var dataView=result.dataView;

	var groups=[], group;
	while (result.size>offset+result.dataOffset){
		group=readSOHFullBox(dataView, offset, start, fileInfo.fileSize);
		var groupOffset=offset+group.dataOffset;
		group.groupId=dataView.getUint32(groupOffset);
		var numEntitiesInGroup=dataView.getUint32(groupOffset+4);
		groupOffset+=8;
		if (numEntitiesInGroup) {
			group.entities=[];
			for (var i=0; i<numEntitiesInGroup; i++) {
				group.entities[i]={itemId: dataView.getUint32(groupOffset)};
				groupOffset+=4;
			}
		}
		//Details of reading each individual box
		if (group.type=="pymd") {
			addSOHPymd(group, dataView, groupOffset);
		}

		groups.push(group);
		offset+=group.size;
		if (showDump)
			showDump(groups, divIdGroups);
	}
	return groups;
}

async function getURLBuffer(url, begin, end){
	var options=(begin || end) ? {headers: {
        	    'range': 'bytes='+begin+'-'+end
	        }} : null;

	var response=await fetch(url, options);
	if (!response?.ok) {
		return;
	}
	return await response.arrayBuffer();
}

async function getURLText(url, begin, end){
	var options=(begin || end) ? {headers: {
        	    'range': 'bytes='+begin+'-'+end
	        }} : null;

	var response=await fetch(url, options);
	if (!response?.ok) {
		return;
	}	
	return await response.text();
}

async function getURLSize(url){
	var response=await fetch(url, {
		method: "HEAD"
    	});
	if (!response?.ok) {
		return;
	}
	if (response.headers.get('Content-Length')==null)
		return;
	return parseInt(response.headers.get('Content-Length'));
}

function getBoxSize(dataView, offset, start, fileSize){
	var size=dataView.getUint32(offset);
	/*if (size==1) {  //It is considered later.
		console.log("Size=1 not implemented");
		return;
	}*/
	if (size==0) 
		size=fileSize-start;
	return size;
}

async function getBoxLargeSizeURL(url, begin, end, fileSize){
			
	if (fileSize - begin + 1 < 8) {
		console.log("Not enough file size to parse the largesize of the box");
		return;
	}	
	var buffer=await getURLBuffer(url, begin, end);
	if(!buffer)
		return;	
	var dataView = new DataView(buffer);
	if(!dataView)
		return;	
	var large_size=Number(dataView.getBigUint64(0));
	return large_size;	
}

function getFullBoxVersion(dataView, offset) {
	return dataView.getUint8(offset);
}

function getFullBoxFlags(dataView, offset) {
	return dataView.getUint8(offset+2)+dataView.getUint8(offset+1)*256+dataView.getUint8(offset)*256*256;
}

function getBoxType(dataView, offset){
	return String.fromCharCode(dataView.getUint8(offset))+String.fromCharCode(dataView.getUint8(offset+1))+
		String.fromCharCode(dataView.getUint8(offset+2))+String.fromCharCode(dataView.getUint8(offset+3));
}

function getSOHString(dataView, offset, size){
	var s="";
	for (var i=0; offset<size; i++) {
		if (dataView.getUint8(offset)==0)
			return s;
		s+=String.fromCharCode(dataView.getUint8(offset));
		offset++;
	}
	return s;
}

function getSOHStringSize(s, offset, size){
	var l=s.length;
	if (offset<size)
		l++;
	return l;
}

function getBoxUUIDType(dataView, offset){
	var s="", h;
	for (var i=0; i<4; i++) {
		h=dataView.getUint8(offset+i).toString(16).toLowerCase();
		s+=h.length==1 ? "0"+h : h;
	}
	s+="-"
	for (var i=4; i<6; i++) {
		h=dataView.getUint8(offset+i).toString(16).toLowerCase();
		s+=h.length==1 ? "0"+h : h;
	}
	s+="-"
	for (var i=6; i<8; i++) {
		h=dataView.getUint8(offset+i).toString(16).toLowerCase();
		s+=h.length==1 ? "0"+h : h;
	}
	s+="-"
	for (var i=8; i<16; i++) {
		h=dataView.getUint8(offset+i).toString(16).toLowerCase();
		s+=h.length==1 ? "0"+h : h;
	}
	return s;
}

//result.dataOffset is number of bytes between the start the box and the start of the data (the size of the headers of a box; not the offset for the start of dataView)
function readSOHBox(dataView, offset, start, fileSize){
	var dataOffset=offset;
	var size=getBoxSize(dataView, offset, start, fileSize);
	var type=getBoxType(dataView, offset+4);
	offset+=8; 
	if (size==1) {
		size=Number(dataView.getBigUint64(offset+8));
		offset+=8;
	}
	if (type=="uuid") {
		var userType=getBoxUUIDType(dataView, offset);
		offset+=16;
	}
	var result={start: start, size: size, type: type, dataOffset: offset-dataOffset}
	if (type=="uuid")
		result.userType=userType;
	return result;	
}

//result.dataOffset is number of bytes between the start the full box and the start of the data (the size of the headers of a full box; not the offset for the start of dataView)
function readSOHFullBox(dataView, offset, start, fileSize){
	var result=readSOHBox(dataView, offset, start, fileSize);
	result.version=getFullBoxVersion(dataView, offset+result.dataOffset);
	result.flags=getFullBoxFlags(dataView, offset+result.dataOffset+1);
	result.dataOffset+=4;
	return result;
}

/* limit==-1: Do not read the data (dataView is undefined in the return)
   limit==0 (or undefined): No limit; read the complete data. */
async function readSOHBoxURL(url, start, fileSize, limit){	
	if (fileSize - start + 1 < 8) {
		console.log("Not enough file size to parse the type and size of the box");
		return;
	}	
	var begin=start, end=begin+7, dataOffset=8;	
	var buffer=await getURLBuffer(url, begin, end);
	if(!buffer)
		return;
	var dataView = new DataView(buffer);
	if(!dataView)
		return;
		
	// size
	var size = getBoxSize(dataView, 0, begin, fileSize);
	// boxtype
	var type=getBoxType(dataView, 4);

	if (size==1) {		
		// the size is a largesize
		begin=end+1;
		end=begin+7;
		var size = await getBoxLargeSizeURL(url, begin, end, fileSize);
		dataOffset+=8;		
	}	

	if (size==dataOffset)   //This is an empty box
		return {start: start, size: size, type: type, dataOffset: dataOffset};

	if (type=="uuid") {
		begin=end+1;
		end=begin+15;
		buffer=await getURLBuffer(url, begin, end);
		dataView = new DataView(buffer);
		if(!dataView)
			return;
		type=getBoxUUIDType(dataView, 0);
		dataOffset+=16;		
	}
		
	if (size==dataOffset ||   //This is an empty box
	    (limit && limit==-1) || //Do not read the content
		(type=="mdat" && !limit) )  // Do not read the content
  		return {start: start, size: size, type: type, dataOffset: dataOffset};
		
	begin=start+dataOffset;
	end=(limit && (size-dataOffset)>limit) ? begin+limit-1 : start+size-1;
	buffer=await getURLBuffer(url, begin, end);
	if(!buffer)
		return;
	dataView = new DataView(buffer);
	if (!dataView) {
		console.log("Failure in reading the content for the '" + type + "' section");
		return;
	}

	return {start: start, size: size, type: type, dataOffset: dataOffset, dataView: dataView};
}

function addGeoreferenceToItems(items, jsonld){
	
	for (var i=0; i<items.length; i++) {
		if (!items[i].contentId)
			continue;
		for (var j=0; j<jsonld["@graph"].length; j++) {
			if (!jsonld["@graph"][j]["cco:ont00001808"] || jsonld["@graph"][j]["cco:ont00001808"]["@id"]!=items[i].contentId)
				continue;
			items[i].wkt=jsonld["@graph"][j]["geosparql:asWKT"]["@value"];
			break;
		}
	}
}

