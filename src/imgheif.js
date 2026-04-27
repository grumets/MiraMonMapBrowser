

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

    Aquest codi JavaScript ha estat idea de Núria Julià (n julia at creaf uab cat)
    amb l'ajut de Joan Masó Pau (joan maso at uab cat) 
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
// no sé perquè però no em funciona l'import
//import { decode as AVIFDecoder } from "@jsquash/avif"; // from https://www.npmjs.com/package/@jsquash/avif

IncludeScript("ttl2jsonld/ttl2jsonld.js"); // from: https://github.com/frogcat/ttl2jsonld
IncludeScript("libde265/libde265.js");
IncludeScript("j2k/openjpegjs.js"); //from : https://www.npmjs.com/package/@cornerstonejs/codec-openjpeg?activeTab=code and https://github.com/cornerstonejs/codecs/tree/main/packages/openjpeg
IncludeScript("libSOH.js"); 



const GreyScale=1, RGBScale=2, YCbCrScale=3;
const colorSpaceByDefault=YCbCrScale;

async function InitLoadSOH(url, ttlMdURL)
{
	var heif=await readSOHBoxDumpURL(url, null, null, false);
	if (!heif)
		return null;
	
	heif.brand=await readSOHFtypBoxURL(url, heif);
	if (heif.brand){
		if (isBrandPresent(heif, 'miaf')){
			heif.mediaHandler=await readSOHHdlrBox(url, heif);
			if(typeof heif.mediaHandler!=="undefined" && heif.mediaHandler!="pict"){
				// ·$· potser cal dir alguna cosa?
				return null; // només se suporta imatges
			}
		}
		else
			return null; // ·$· potser cal dir alguna cosa?
	}
	var pitm=await readSOHPitmBoxURL(url, heif);
	if(pitm)
		heif.primaryItemId=pitm.primaryItemId;
	heif.groups=await readSOHGroupsDumpURL(url, heif, null, false);
	heif.items=await readSOHItemsDumpURL(url, ttlMdURL, heif, null, false);
	if(ttlMdURL)
		heif.hasTtlMd=true;
	else 
	{
		heif.hasTtlMd=false;
		for(var i=0; i<heif.items.length; i++){
			if (heif.items[i].itemType=='mime' && heif.items[i].contentType=="text/turtle"){
				heif.hasTtlMd=true;
				break;
			}			
		}
	}
	return heif;
}


function GetHeifBoundingBox(heif, iItem, pyramidId){
	if(!heif)
		return null;
	var env={MinX: +1e300, MaxX: -1e300, MinY: +1e300, MaxY: -1e300};
	var wkt = null, geom; 
	if(heif.group && typeof pyramidId!=="undefined" && pyramidId!=null){
		for(var i=0; i<heif.items.length; i++){
			if (!heif.items[i].isTile && heif.items[i].wkt && pyramidId==heif.items[i].pyramidId) {
				if(!wkt)
					wkt=new Wkt.Wkt();
				if(wkt && heif.items[i].wkt){
					wkt.read(heif.items[i].wkt);
					geom=wkt.toJson();
					heif.items[i].env=DonaEnvCalculatGeometry(geom, null);
					env=DonaEnvCalculatGeometry(geom, env);
				}
			}
		}	
	}
	else if(typeof iItem!=="undefined" && iItem!=null){
		if(!wkt)
			wkt=new Wkt.Wkt();
		if(wkt && heif.items[iItem].wkt){
			wkt.read(heif.items[iItem].wkt);
			geom=wkt.toJson();
			heif.items[iItem].env=DonaEnvCalculatGeometry(geom, null);
			env=DonaEnvCalculatGeometry(geom, env);
		}
	}			
	else{
		for(var i=0; i<heif.items.length; i++){
			if (!heif.items[i].isTile && heif.items[i].wkt) {
				if(!wkt)
					wkt=new Wkt.Wkt();
				if(wkt && heif.items[i].wkt){
					wkt.read(heif.items[i].wkt);
					geom=wkt.toJson();
					env=DonaEnvCalculatGeometry(geom, env);
				}
			}
		}			
	}
	return env;
}

function InitTileStructCapaHeif(heif, envTotalCapa, iItem, iPyramid)
{
var TileMatrixSet=null, i;

	if(typeof iPyramid!==undefined && iPyramid!=null && iPyramid!=-1)
	{
		TileMatrixSet=[];
		TileMatrixSet[0]={};
		TileMatrixSet[0].nom=DonaIdPyramidDeIndexPyramidHeifCapa(heif, iPyramid);
		TileMatrixSet[0].CRS=envTotalCapa.CRS;
		TileMatrixSet[0].TileMatrix=[];
		var entity, iSizeMultipleOne=-1, env;
		for(i=0; i<heif.groups[iPyramid].entities.length;i++){
			entity=heif.groups[iPyramid].entities[i];
			TileMatrixSet[0].TileMatrix[i]={};
			iItem=TileMatrixSet[0].TileMatrix[i].iItem=getIndexSOHItemID(heif.items, entity.itemId);
			TileMatrixSet[0].TileMatrix[i].TileWidth=heif.items[iItem].tileWidth;
			TileMatrixSet[0].TileMatrix[i].TileHeight=heif.items[iItem].tileHeight;
			TileMatrixSet[0].TileMatrix[i].MatrixWidth=heif.items[iItem].matrixWidth;
			TileMatrixSet[0].TileMatrix[i].MatrixHeight=heif.items[iItem].matrixHeight;
			if(heif.items[iItem].env)
				env=heif.items[iItem].env;
			else
				env=envTotalCapa.EnvCRS;
			TileMatrixSet[0].TileMatrix[i].sizeMultiple=heif.items[iItem].sizeMultiple;
			if(heif.items[iItem].sizeMultiple==1)
				iSizeMultipleOne=i;
				
			// Això si la BBOX correspond a la imatge tesselada
			if(heif.items[iItem].imageWidth)
				TileMatrixSet[0].TileMatrix[i].costat=(env.MaxX-env.MinX)/heif.items[iItem].imageWidth;
			TileMatrixSet[0].TileMatrix[i].TopLeftPoint={ "x": env.MinX, "y": env.MaxY};
		}
		if(iSizeMultipleOne==-1)
		{
			alert("Error on TileMatrixSet of HEIF file");
			return null;
		}
		for(i=0; i<TileMatrixSet[0].TileMatrix.length;i++){
			if(i!=iSizeMultipleOne && !TileMatrixSet[0].TileMatrix[i].costat)
				TileMatrixSet[0].TileMatrix[i].costat=TileMatrixSet[0].TileMatrix[iSizeMultipleOne].costat*TileMatrixSet[0].TileMatrix[i].sizeMultiple;			
		}
	}
	else if(heif.items[iItem].itemType=="tili" || heif.items[iItem].itemType=="grid")
	{
		TileMatrixSet=[];
		TileMatrixSet[0]={};
		TileMatrixSet[0].nom=heif.items[iItem].itemId;
		TileMatrixSet[0].CRS=envTotalCapa.CRS;
		TileMatrixSet[0].TileMatrix=[];
		TileMatrixSet[0].TileMatrix[0]={};
		TileMatrixSet[0].TileMatrix[0].iItem=iItem;
		TileMatrixSet[0].TileMatrix[0].TileWidth=heif.items[iItem].tileWidth;
		TileMatrixSet[0].TileMatrix[0].TileHeight=heif.items[iItem].tileHeight;
		TileMatrixSet[0].TileMatrix[0].MatrixWidth=heif.items[iItem].matrixWidth;
		TileMatrixSet[0].TileMatrix[0].MatrixHeight=heif.items[iItem].matrixHeight;
		if(heif.items[iItem].env)
			env=heif.items[iItem].env;
		else
			env=envTotalCapa.EnvCRS;
		TileMatrixSet[0].TileMatrix[0].sizeMultiple=1;
		TileMatrixSet[0].TileMatrix[0].costat=(env.MaxX-env.MinX)/heif.items[iItem].imageWidth;
		TileMatrixSet[0].TileMatrix[0].TopLeftPoint={ "x": env.MinX, "y": env.MaxY};
	}
	
	if(TileMatrixSet && TileMatrixSet[0] && TileMatrixSet[0].TileMatrix)
	{
		// Ordenar la piramide del TileMatrix pel costat 
		TileMatrixSet[0].TileMatrix.sort(OrdenacioCostatDescendent);
		var nzoom_previs=ParamCtrl.zoom.length;
		
		// Afegir els costats de píxels que no siguin a la piramide
		for(k=0, i=0; i<TileMatrixSet[0].TileMatrix.length; i++)
		{
			for (k; k<ParamCtrl.zoom.length; k++)
			{
				if (ParamCtrl.zoom[k].costat>TileMatrixSet[0].TileMatrix[i].costat*0.9999 && ParamCtrl.zoom[k].costat<TileMatrixSet[0].TileMatrix[i].costat*1.0001)
					break;
				if(ParamCtrl.zoom[k].costat<TileMatrixSet[0].TileMatrix[i].costat)
				{
					ParamCtrl.zoom.splice(k, 0, {"costat": TileMatrixSet[0].TileMatrix[i].costat});
					k++;
					break;
				}
			}
		}
		if(nzoom_previs<ParamCtrl.zoom.length){
			CreaBarra();
			for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
				ReOmpleSlider(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista);
		}
	}
	return TileMatrixSet;
}


function GetPrimaryIndexImageItemHeifCapa(heif)
{
	if(!heif)
		return -1;
	var i, item;
	if(typeof heif.primaryItemId!=="undefined" && heif.primaryItemId!=null){
		for (i=0; i<heif.items.length; i++) {
			item=heif.items[i];
			if(item.itemId==heif.primaryItemId)
				return i;
		}
	}
	else{
		for (i=0; i<heif.items.length; i++) {
			item=heif.items[i];
			if (!item.isTile && 
				(item.type=="tili" || item.type=="grid" || item.type=="unci" || item.type=="jpeg" || item.type=="hvc1" || item.type=="j2k1" /* ||  item.type=="avc1" || item.type=="jpeg"*/)) 
				return i;
		}
	}
	return -1;
}
function GetIndexPyramidHeifCapa(heif)
{
	if(!heif || !heif.groups)
		return -1;
	var i, group;
	for (i=0; i<heif.groups.length; i++) {
		group=heif.groups[i];
		if (group.type=='pymd') 
			return i;
	}
	return -1;
}

function DonaIdPyramidDeIndexPyramidHeifCapa(heif, iPyramid)
{
	if(!heif || !heif.groups|| typeof iPyramid===undefined || iPyramid==null || iPyramid<0 || iPyramid>heif.groups.length)
		return null;
	return heif.groups[iPyramid].groupId;
}

function CompleteCapaHeifDefinition(capa, heif)
{
	if (capa.servidor)
	{
		capa.heif=heif;
		// capa.i_data_heif=0;
	}
	// capa CRS 
	if(!capa.CRSgeometry)
	{
		if(heif.crs)
			capa.CRSgeometry=DonaEPSGDeURLOpengis(heif.crs);
		else if(heif.hasTtlMd)
			capa.CRSgeometry="CRS:84";
		else
			capa.CRSgeometry=ParamCtrl.ImatgeSituacio[0].EnvTotal.CRS;
	}
	
	if(!capa.estil)
	{
		// cal que hi hagi un estil com a mínim per defecte amb a la informació de l'item que estem usant a dins de component
		capa.estil=[{"TipusObj": "I", "component": [{}]}];
	}
	if(!capa.estil[0].component)
		capa.estil[0].component=[];
	if(!capa.estil[0].component[0])
		capa.estil[0].component[0]={};
	if(typeof capa.estil[0].component[0].iItem==="undefined"  || capa.estil[0].component[0].iItem==-1)
		capa.estil[0].component[0].iItem=GetPrimaryIndexImageItemHeifCapa(heif);
	
	// Determino iPyramid, si té més d'un nivell de resolució
	if(typeof capa.estil[0].component[0].iPyramid==="undefined"  || capa.estil[0].component[0].iPyramid==-1)
		capa.estil[0].component[0].iPyramid=GetIndexPyramidHeifCapa(heif);
	
	// capa Bbox 
	if(!capa.EnvTotal && heif.hasTtlMd)
	{
		var env = GetHeifBoundingBox(heif, capa.estil[0].component[0].iItem, DonaIdPyramidDeIndexPyramidHeifCapa(capa.heif, capa.estil[0].component[0].iPyramid));
		if(env)
		{
			capa.EnvTotal={"EnvCRS": JSON.parse(JSON.stringify(env)), "CRS": capa.CRSgeometry};
			capa.EnvTotalLL=DonaEnvolupantLongLat(capa.EnvTotal.EnvCRS, capa.EnvTotal.CRS);
		}
	}
	
	// Tessel·lació de la capa
	if(!capa.TileMatrixSet)
		capa.TileMatrixSet=InitTileStructCapaHeif(heif, capa.EnvTotal, capa.estil[0].component[0].iItem, capa.estil[0].component[0].iPyramid);
	if(capa.TileMatrixSet && !capa.VistaCapaTiled)
		capa.VistaCapaTiled={"TileMatrix": null, "ITileMin": 0, "ITileMax": 0, "JTileMin": 0, "JTileMax": 0, "dx": 0, "dy": 0};
	
	// Tipus de valors si la capa és uncompressed
	var item=capa.heif.items[capa.estil[0].component[0].iItem];
	if((item.itemType=='unci' && !item.uncompressProfile) || (capa.TileMatrixSet && item.itemTypeTile=='unci' && !item.uncompressProfile)){
		if(!capa.valors)
			capa.valors=[];
		var bit_x_pixel, component_format, datatype, n_components=item.componentCount;
		for(var i=0; i<n_components;i++)
		{
			if(!capa.valors[i] || !capa.valors[i].datatype)
			{
				component_format=item.componentFormat[i];
				// 0 --> unsigned int, 1 --> float (16, 32, 64, 128 or 256), 2 -->imaginary, 3 signed int, >3 altres reservats
				bits_per_pixel=item.componentBitDepthMinusOne[i] +1;
				// tipus suportats per nosaltres [ "int8", "uint8", "int16", "uint16", "int32", "uint32", "float32", "float64" ]
				if(component_format==0)	{  // unsigned int
					if(bits_per_pixel==8) datatype="uint8";
					else if(bits_per_pixel==16) datatype="uint16";
					else if(bits_per_pixel==32) datatype="uint32";
					else if(bits_per_pixel==64) datatype="uint64"; // ·$· no el tenim
				}
				else if(component_format==1){ // coma flotant
					if(bits_per_pixel==16) datatype="float16";  // ·$· no el tenim
					else if(bits_per_pixel==32) datatype="float32";
					else if(bits_per_pixel==64) datatype="float64";
				}
				//else if(component_format==2){ // imaginary
				else if(component_format==3){ // signed int
					if(bits_per_pixel==8) datatype="int8";
					else if(bits_per_pixel==16) datatype="int16";
					else if(bits_per_pixel==32) datatype="int32";
					else if(bits_per_pixel==64) datatype="int64"; // ·$· no el tenim
				}	
				if(!capa.valors[i])
					capa.valors[i]={};	
				capa.valors[i].datatype=datatype;
				capa.valors[i].compression=null;
				capa.valors[i].iBand=item.componentIndex[i];
				
				// ·$· de moment no tinc en compte això
				/*if (itemRel.componentAlignSize)
					item.componentAlignSizeTile = itemRel.componentAlignSize;
				if (itemRel.samplingType)
					item.samplingTypeTile = itemRel.samplingType;
				if (itemRel.interleaveType) */
			}
			if(capa.estil[0].component[0] && typeof capa.estil[0].component[0].i_valor==="undefined")
				capa.estil[0].component[0].i_valor=i;
		}
	}
	return ;
}

async function PreparaLecturaHeif(vista, i_capa, i_estil, i_data)
{
	var capa= ParamCtrl.capa[i_capa];
	if(!capa.heif)
	{
		var url=CanviaVariablesDeCadena(capa.servidor, capa, i_data, null), mdTtl;
		if(capa.metadades && capa.metadades.standard && DonaExtensioFitxerSensePunt(DonaNomFitxerMetadades(capa, -1)).toLowerCase()=="ttl")
			mdTtl=DonaNomFitxerMetadades(capa, -1);
		else
			mdTtl=null;
		capa.heif=await InitLoadSOH(url, mdTtl);
		if(!capa.heif)
		{
			var error = new Error("Unable to initialize the HEIF file: "+url);
			error.param={vista: vista, i_capa: i_capa, i_estil: i_estil, i_data: i_data};
			throw error;
		}
	}
	CompleteCapaHeifDefinition(capa, capa.heif);
	return  {vista: vista, i_capa: i_capa, i_estil: i_estil, i_data: i_data};
}


function GetHeifCapa(i_capa, i_estil, i_data, vista)
{
var capa= ParamCtrl.capa[i_capa];
	
	// ·$· De moment ha d'estar a nivell de capa, potser més endavant n'hi haurà diversos com en el cas del tiff
	return capa.heif;
}

async function GetSOHImage(url, item, iTile, jTile){

	if(!item)
		return null;
	if (item.tileWidth && item.tileHeight)
		return await getURLBuffer(url, item.tiles[jTile*item.matrixWidth+iTile].offset, item.tiles[jTile*item.matrixWidth+iTile].offset+item.tiles[jTile*item.matrixWidth+iTile].size-1);
	return await getURLBuffer(url, item.extents[0].extentOffset, item.extents[0].extentOffset+item.extents[0].extentLength-1);
}

function ShowSOHImage(data, canvasId, width, height, nom_funcio_ok, param_funcio_ok) {

	var canvas=document.getElementById(canvasId);
	canvas.width=width;
	canvas.height=height;
	var ctx= canvas.getContext('2d');
	ctx.clearRect( 0, 0, width, height);
	var imgData=ctx.createImageData(width, height);
	imgData.data.set(data);
	ctx.putImageData(imgData, 0, 0);
	if(nom_funcio_ok)
	{
		if (param_funcio_ok)
			nom_funcio_ok(param_funcio_ok);
		else
			nom_funcio_ok(); 
	}
}

// Image Item in UNCI
async function GetAndShowSOHUnciImage(url, imatge, item, valors, estil, nom_funcio_ok, param_funcio_ok, iTile, jTile)
{
	var arrayBuffer=null, itemType, height, width;
	
	if (item.tileWidth && item.tileHeight) {
		itemType=item.itemTypeTile;
		width=item.tileWidth;
		height=item.tileHeight;
		//canvasId=item.itemId + "_" + jTile + "_" + iTile;	// ara és imatge	
	}
	else {
		itemType=item.itemType;
		width=item.imageWidth;
		height=item.imageHeight;
		//canvasId=item.itemId; // ara és imatge
	}
	if(itemType!='unci') 
		return false;	
	arrayBuffer=await GetSOHImage(url, item, iTile, jTile);
	if(!arrayBuffer)
		return false;
	
	var dataView=new DataView(arrayBuffer), data=[];
	
	if(typeof item.uncompressProfile=== "undefined" || item.uncompressProfile==0 )  // cap perfil predeterminat
	{
		if(item.compressionType){
			alert("ERROR: compression not supported");
			return false;
		}
		// Construeixo el canvas amb les dades+paleta (i/o categories)
		var dv=[];
		dv[0]=dataView;
		ConstrueixImatgeCanvas(data, null, width, height, dv, false, estil.component, valors, estil.paleta, estil.categories);
	}
	else if(item.uncompressProfile=="rgb3"){ //RGB 24 bits packed {'rgb3', 3, [{4,7},{5,7},{6,7}], 0, 1}
		for (var offset=0, j=0; j<height; j++) {
			for (var i=0; i<width; i++, offset+=3)
				data.push(dataView.getUint8(offset), dataView.getUint8(offset+1), dataView.getUint8(offset+2), 255);
		}
	}
	else if(item.uncompressProfile=="rgba"){ //RGBA 32bits packed {'rgba', [{4,7},{5,7},{6,7},{7,7}], 0, 1}
		for (var offset=0, j=0; j<height; j++) {
			for (var i=0; i<width; i++, offset+=4)
				data.push(dataView.getUint8(offset), dataView.getUint8(offset+1), dataView.getUint8(offset+2), dataView.getUint8(offset+3));
		}
	}
	else if(item.uncompressProfile=="abgr"){ //RGBA 32bits packed {'abgr', [ {7,7}, {6,7},{5,7},{4,7}], 0, 1}
		for (var offset=0, j=0; j<height; j++) {
			for (var i=0; i<width; i++, offset+=4)
				data.push(dataView.getUint8(offset+3), dataView.getUint8(offset+2), dataView.getUint8(offset+1), dataView.getUint8(offset));
		}
	}
	else
		return false;
	ShowSOHImage(data, imatge, width, height, nom_funcio_ok, param_funcio_ok);	
	return true;
}

// Image Item in H265/HVCC
function GetAndConvertImageYUV2RGB(image){

	var h = image.get_height(), w=image.get_width();
	
	var canvas = document.getElementById(image.decoder.canvasId);
	canvas.width=w;
	canvas.height=h;
	var ctx = canvas.getContext('2d');
	ctx.clearRect( 0, 0, h, w);
	var imgData=ctx.createImageData(w, h);
	var data = imgData.data;
	for (var i=0; i<w*h; i++) {
		data[i*4+3] = 255;
	}
	image.ImageData=imgData;
    image.display(image.ImageData, function(display_image_data) {
        ctx.putImageData(display_image_data, 0, 0);	
		if(image.decoder.nom_funcio_ok)
		{
			if (image.decoder.param_funcio_ok)
				image.decoder.nom_funcio_ok(image.decoder.param_funcio_ok);
			else
				image.decoder.nom_funcio_ok(); 
		}		
    });
	return ;
}

async function GetAndShowSOHH265Image(url, imatge, item, nom_funcio_ok, param_funcio_ok, iTile, jTile, itemsArray){
var arrayBuffer=null, itemType, height, width, tileItem;

	if(!item)
		return false;
	if (item.tileWidth && item.tileHeight){
		itemType=item.itemTypeTile;
		width=item.tileWidth;
		height=item.tileHeight;
		if(itemsArray && typeof item.tiles[jTile*item.matrixWidth+iTile].itemId !== "undefined"){
			var indexItem=getIndexSOHItemID(itemsArray, item.tiles[jTile*item.matrixWidth+iTile].itemId)
			if(indexItem!=-1)
				tileItem=itemsArray[indexItem];
			else
				tileItem=null;
		}
		else tileItem=null;
	}
	else{
		itemType=item.itemType;
		width=item.imageWidth;
		height=item.imageHeight;
		tileItem=null;
	}
	if(itemType!='hvc1')
		return false;
	arrayBuffer=await GetSOHImage(url, item, iTile, jTile);
	if(!arrayBuffer)
		return false;

	var dataView=new DataView(arrayBuffer);

	var decoder = new libde265.Decoder();
	decoder.canvasId=imatge;
	decoder.nom_funcio_ok=nom_funcio_ok;
	decoder.param_funcio_ok=param_funcio_ok; 
	decoder.set_image_callback(function(image) {
		GetAndConvertImageYUV2RGB(image);
		image.free();
	});		
	var naluArrays= (item.naluArrays) ? item.naluArrays : (tileItem ? tileItem.naluArrays : null);
	if(naluArrays)
	{
		for (var i_array=0; i_array<naluArrays.length; i_array++)
		{
			for (var i_nalu_unit=0; i_nalu_unit<naluArrays[i_array].data.length; i_nalu_unit++)
			{
				try {
				  var error=decoder.push_NAL(naluArrays[i_array].data[i_nalu_unit]);
				} catch (error) {
					console.log("error" + error);
					decoder.free();
					return false;
				}
			}
		}
	}
	var offset=0, data_length, data_pack, more;
	while(offset<dataView.byteLength)
	{
		data_length=dataView.getUint32(offset);
		data_pack=[];
		offset+=4;
		for (var z=0; z<data_length; z++) {
			data_pack[z]=dataView.getUint8(offset);
			offset++;
		}	
		try {
		  var error=decoder.push_NAL(data_pack);
		} catch (error) {
			console.log("error" + error);
			decoder.free();
			return false;
		}
	}
	try {
	  var error=decoder.push_end_of_frame();
	} catch (error) {
		console.log("error" + error);
		decoder.free();
		return false;
	}
	try {
	  var error=decoder.decode();
	} catch (error) {
		console.log("error" + error);
		decoder.free();
		return false;
	}
	decoder.free();
	return true; 
}

// Image Item in J2K
function GetPixelDataFromJ2KDecoded(frameInfo, decodedBuffer) {
    if(frameInfo.bitsPerSample > 8) {
    	if(frameInfo.isSigned) 
        	return new Int16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
    	return new Uint16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
    }
	return decodedBuffer;
}

function ycbcrToRgb(y, cb, cr) {
  const Y  = y;
  const Cb = cb - 128;
  const Cr = cr - 128;

  let r = Y + 1.402   * Cr;
  let g = Y - 0.34414 * Cb - 0.71414 * Cr;
  let b = Y + 1.772   * Cb;

  return [
    Math.min(255, Math.max(0, r)),
    Math.min(255, Math.max(0, g)),
    Math.min(255, Math.max(0, b))
  ];
}

async function GetAndShowSOHJ2KImage(url, imatge, item, nom_funcio_ok, param_funcio_ok, iTile, jTile, itemsArray)
{
	var arrayBuffer=null, itemType, tileItem, height, width, colorSpace, iR,iB,iG,iY,iCb,iCr,iA;

	if(!item)
		return false;
	if (item.tileWidth && item.tileHeight){
		itemType=item.itemTypeTile;
		width=item.tileWidth;
		height=item.tileHeight;
		// canvasId=item.itemId + "_" + jTile + "_" + iTile; // imatge
		if(itemsArray && typeof item.tiles[jTile*item.matrixWidth+iTile].itemId !== "undefined"){
			var indexItem=getIndexSOHItemID(itemsArray, item.tiles[jTile*item.matrixWidth+iTile].itemId)
			if(indexItem!=-1)
				tileItem=itemsArray[indexItem];
			else
				tileItem=null;
		}
		else tileItem=null;
	}
	else{
		itemType=item.itemType;
		width=item.imageWidth;
		height=item.imageHeight;
		// canvasId=item.itemId; // imatge
		tileItem=null;
	}
	if(itemType!='j2k1')
		return false;
	arrayBuffer=await GetSOHImage(url, item, iTile, jTile);
	if(!arrayBuffer)
		return false;

	var dataArray=new Uint8Array(arrayBuffer);
	
	// JS / WASM promises resolve the library and creates a new decoder
	//const openjpegjs = await OpenJPEGWASM();
	const openjpegjs = await OpenJPEGJS();
	const J2KDecoder = new openjpegjs.J2KDecoder();
	// Decode the dataArray
	const encodedBuffer = J2KDecoder.getEncodedBuffer(dataArray.length);
	encodedBuffer.set(dataArray);
	J2KDecoder.decode();
	// Get the decoded array
	const decodedBuffer = J2KDecoder.getDecodedBuffer();
	const frameInfo = J2KDecoder.getFrameInfo(); // width/height will be wrong if using decodeSubResolution
	// const interleaveMode = 2;

    // Trying to determine the correct colorSpace
	if(frameInfo.componentCount>=3)
	{
		colorSpace=0;
		iR=iB=iG=iY=iCb=iCr=iA=-1;
		var cdef= (item.cdef) ? item.cdef : (tileItem ? tileItem.cdef : null);
		if(cdef)
		{
			for(var i=0;i<cdef.nComp; i++){
				if(cdef.comp[i].type==1)
					iY=cdef.comp[i].index;
				else if(cdef.comp[i].type==2)
					iCb=cdef.comp[i].index;
				else if(cdef.comp[i].type==3)
					iCr=cdef.comp[i].index;
				else if(cdef.comp[i].type==4)
					iR=cdef.comp[i].index;
				else if(cdef.comp[i].type==5)
					iG=cdef.comp[i].index;
				else if(cdef.comp[i].type==6)
					iB=cdef.comp[i].index;
				else if(cdef.comp[i].type==7)
					iA=cdef.comp[i].index;
			}
		}
		if(iR!=-1 && iA==-1)
			colorSpace=RGBScale;
		else if (iR!=-1 && iA!=-1)
			colorSpace=RGBAScale;
		else if (iY!=-1 && iA!=-1)
			colorSpace=YCbCrAScale;
		else //if(iY!=-1 && iA==-1)
			colorSpace=colorSpaceByDefault;
	}
	else
		colorSpace=GreyScale;
	
	if(!decodedBuffer){
		J2KDecoder.delete();
		return false;
	}
	// Show the image in the canvas
	const image=GetPixelDataFromJ2KDecoded(frameInfo, decodedBuffer);
	if (!image){
		J2KDecoder.delete();
		return false;
	}
	var RGB, one_color, grey_value, data=[], bytesPerSample = (frameInfo.bitsPerSample <= 8) ? 1 : 2, 	pixelsPerChannel = frameInfo.width * frameInfo.height* bytesPerSample, shift=(frameInfo.bitsPerSample > 8) ? 8 : 0, inOffset=0;
	for(var y=0; y < frameInfo.height; y++) {
		for (var x = 0; x < frameInfo.width; x++) {
			if (frameInfo.componentCount==1 || colorSpace==GreyScale){
				grey_value=image[inOffset] >> shift;
				data.push(grey_value, grey_value, grey_value, 255);
				if(frameInfo.componentCount==1)
					inOffset++;
				else
					inOffset+=3;
			}
			else if (frameInfo.componentCount==3)
			{
				one_color=[];
				one_color.push(image[inOffset++] >> shift, image[inOffset++] >> shift, image[inOffset++] >> shift);
				if(colorSpace==RGBScale){
					if(iR!=-1 && iG!=-1 && iB!=-1)
						data.push(one_color[iR], one_color[iG], one_color[iB], 255);
					else
						data.push(one_color[0], one_color[1], one_color[2], 255);
				}
				else if(colorSpace==YCbCrScale){
					if(iY!=-1 && iCb!=-1 && iCr!=-1)
						RGB=ycbcrToRgb(one_color[iY], one_color[iCb], one_color[iCr]);
					else
						RGB=ycbcrToRgb(one_color[0], one_color[1], one_color[2]);
					data.push(RGB[0], RGB[1], RGB[2], 255);
				}
			}
			else if (frameInfo.componentCount==4)
			{
				one_color=[];
				one_color.push(image[inOffset++] >> shift, image[inOffset++] >> shift, image[inOffset++] >> shift, image[inOffset++] >> shift);
				if(colorSpace==RGBAScale){
					if(iR!=-1 && iG!=-1 && iB!=-1)
						data.push(one_color[iR], one_color[iG], one_color[iB]);
					else
						data.push(one_color[0], one_color[1], one_color[2]);
					data.push(iA!=-1 ? one_color[iA] : one_color[3]);
				}
				else if(colorSpace==YCbCrAScale){
					if(iY!=-1 && iCb!=-1 && iCr!=-1)
						RGB=ycbcrToRgb(one_color[iY], one_color[iCb], one_color[iCr]);
					else
						RGB=ycbcrToRgb(one_color[0], one_color[1], one_color[2]);
					data.push(RGB[0], RGB[1], RGB[2], iA!=-1 ? one_color[iA] : one_color[3]);
				}
			}
		}
	}
	ShowSOHImage(data, imatge, frameInfo.width, frameInfo.height, nom_funcio_ok, param_funcio_ok);	
    J2KDecoder.delete();
	return true;
}

async function GetAndShowSOHAvifImage(url, imatge, item, nom_funcio_ok, param_funcio_ok, iTile, jTile)
{
	var arrayBuffer=null, itemType, height, width;
	
	if (item.tileWidth && item.tileHeight) {
		itemType=item.itemTypeTile;
		width=item.tileWidth;
		height=item.tileHeight;
	}
	else {
		itemType=item.itemType;
		width=item.imageWidth;
		height=item.imageHeight;
	}
	if(itemType!='av01') 
		return false;	
	arrayBuffer=await GetSOHImage(url, item, iTile, jTile);
	if(!arrayBuffer)
		return false;
	
	var dataView=new DataView(arrayBuffer);
	
	const imageData = await AVIFDecoder(arrayBuffer);
	if(!imageData)
		return false;
	ShowSOHImage(imageData, imatge, width, height, nom_funcio_ok, param_funcio_ok);	
	return true;
}

async function LoadHeifData(imatge, nom_vista, vista, i_capa, i_estil, i_data, i_tile_matrix_set, i_tile_matrix, j_tile, i_tile, i_event, nom_funcio_ok)
{
var heif=GetHeifCapa(i_capa, i_estil, i_data, vista), capa= ParamCtrl.capa[i_capa], url=CanviaVariablesDeCadena(capa.servidor, capa, i_data, null);
var bbox, width, height, dades, param={imatge: imatge, nom_vista: nom_vista, vista: vista, i_capa: i_capa, i_estil: i_estil, i_data: i_data, i_tile_matrix_set: i_tile_matrix_set, i_tile_matrix: i_tile_matrix, j_tile: j_tile, i_tile: i_tile, i_event: i_event, nom_funcio_ok: nom_funcio_ok};

	if(!heif)
	{
		var error = new Error("Unable to read the HEIF file: " +url);
		error.param= param;
		throw error;
	}
	if(!capa.estil || !capa.estil[i_estil].component || !capa.estil[i_estil].component[0] || typeof capa.estil[i_estil].component[0].iItem==="undefined" || capa.estil[i_estil].component[0].iItem<0)
	{
		var error = new Error("Unable to read the HEIF file: "+url);
		error.param= param;
		throw error;
	}
	
	var mdat=getIndexSOHBoxType(heif.boxes, "mdat");
	if (mdat==-1)
	{
		var error = new Error("Unable to read the HEIF file: "+url);
		error.param= param;
		throw error;
	}
	
	var item, retorn=false;
	
	if(capa.TileMatrixSet){
		// Demano una tessel·la concreta d'un ítem
		var nomImatgeTessellada=nom_vista + "_i_raster"+ i_capa+"_"+j_tile+"_"+i_tile;
		
		// De moment en el cas de TileMatrixSet no redimensiono la imatge i per tant de moment només uso un canvas que és imatge, en aquest cas la variable imatge és el canvas_id i no el canvas com en el cas de no tessel·lació
		item=capa.heif.items[capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].iItem];
				
		if(item.itemTypeTile=='unci')
			retorn=await GetAndShowSOHUnciImage(url, nomImatgeTessellada, item, capa.valors, capa.estil[i_estil], nom_funcio_ok, param, i_tile, j_tile);
		else if(item.itemTypeTile=='hvc1')	
		{
			try{
				retorn=await GetAndShowSOHH265Image(url, nomImatgeTessellada, item, nom_funcio_ok, param, i_tile, j_tile, capa.heif.items);	
			}
			catch(error)
			{
				var error = new Error("Unable to read the HEIF file: " +url);
				error.param=param;
				throw error;
			}
		}			
		else if(item.itemTypeTile=='j2k1')	
			retorn= await GetAndShowSOHJ2KImage(url, nomImatgeTessellada, item, nom_funcio_ok, param, i_tile, j_tile, capa.heif.items);		
		else if(item.itemTypeTile=='av01')	
			retorn= await GetAndShowSOHAvifImage(url, nomImatgeTessellada, item, nom_funcio_ok, param, i_tile, j_tile);
	}
	else {
		var nomImatgeSencera=nom_vista + "_i_imatge"+i_capa;
		item=capa.heif.items[capa.estil[i_estil].component[0].iItem];
		
		if(item.itemType=='unci')
			retorn=await GetAndShowSOHUnciImage(url, nomImatgeSencera, item, capa.valors, capa.estil[i_estil], nom_funcio_ok, param);
		else if(item.itemType=='hvc1')	
		{
			try{
				retorn=await GetAndShowSOHH265Image(url, nomImatgeSencera, item, nom_funcio_ok, param);	
			}
			catch(error)
			{
				var error = new Error("Unable to read the HEIF file: " +url);
				error.param=param;
				throw error;
			}
		}			
		else if(item.itemType=='j2k1')	
			retorn= await GetAndShowSOHJ2KImage(url, nomImatgeSencera, item, nom_funcio_ok, param);		
		else if(item.itemTypeTile=='av01')	
			retorn= await GetAndShowSOHAvifImage(url, nomImatgeSencera, item, nom_funcio_ok, param);
	}
	if(!retorn)
	{
		var error = new Error("Unable to read the HEIF file: " +url);
		error.param=param;
		throw error;
	}
	return param;
}
