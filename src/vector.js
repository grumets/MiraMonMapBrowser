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

    Copyright 2001, 2023 Xavier Pons

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

"use strict"

var model_vector="vector";
var nom_camp_nObjs_tessella="__nObjsTessella";
var mida_tessela_vec_defecte=256;

function HiHaObjectesNumericsAAquestNivellDeZoom(capa)
{
	if( typeof capa.model==="undefined" || capa.model!=model_vector ||
		typeof capa.tileMatrixSetGeometry==="undefined" || capa.tileMatrixSetGeometry==null ||
		typeof capa.tileMatrixSetGeometry.tileMatrix==="undefined" || capa.tileMatrixSetGeometry.tileMatrix==null)
		return false;
	
	var costat_actual=ParamInternCtrl.vista.CostatZoomActual;
	if (DonaUnitatsCoordenadesProj(capa.CRSgeometry)=="m" && EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamCtrl.ISituacioOri].EnvTotal.CRS))
		costat_actual=(costat_actual/FactorGrausAMetres);
	else if (EsProjLongLat(capa.CRSgeometry) && DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamCtrl.ISituacioOri].EnvTotal.CRS)=="m")
		costat_actual=costat_actual*FactorGrausAMetres;
	
	var i_tile_matrix=DonaIndexTileMatrixVectorAPartirDeCostat(capa.tileMatrixSetGeometry.tileMatrix, costat_actual);
	if(typeof capa.tileMatrixSetGeometry.tileMatrix[i_tile_matrix].objNumerics!=="undefined" && 
		capa.tileMatrixSetGeometry.tileMatrix[i_tile_matrix].objNumerics &&
		capa.tileMatrixSetGeometry.tileMatrix[i_tile_matrix].objNumerics.features &&
		capa.tileMatrixSetGeometry.tileMatrix[i_tile_matrix].objNumerics.features.length>0)
		return true;
	return false;
}

function HiHaObjectesNumerics(capa)
{
	if(typeof capa.model==="undefined" || capa.model!=model_vector ||
		typeof capa.tileMatrixSetGeometry==="undefined" || capa.tileMatrixSetGeometry==null ||
		typeof capa.tileMatrixSetGeometry.tileMatrix==="undefined" || capa.tileMatrixSetGeometry.tileMatrix==null)
		return false;
	
	for(var i=0; i<capa.tileMatrixSetGeometry.tileMatrix.length; i++)
	{		
		if(typeof capa.tileMatrixSetGeometry.tileMatrix[i].objNumerics!=="undefined" && 
			capa.tileMatrixSetGeometry.tileMatrix[i].objNumerics &&			
			capa.tileMatrixSetGeometry.tileMatrix[i].objNumerics.features &&
			capa.tileMatrixSetGeometry.tileMatrix[i].objNumerics.features.length>0)
		return true;
	}
	return false;
}


function InicialitzaIComprovaTileMatrixGeometryCapaDigi(capa)
{
var TMG, tiles, env_capa;

	if( typeof capa.tipus==="undefined" || capa.tipus==null ||
		typeof capa.model==="undefined" || capa.model!=model_vector ||
		DonaTipusServidorCapa(capa)=="TipusHTTP_GET")  // En les capes de tipus HTTP_GET ja siguin JSON o CSV no tinc tessel·lació, de moment tinc una petició única per obtenir tot el fitxer
		return;
	
		
	// En principi si no tinc límits no té sentit que hagi més d'un nivell de tessel·lació perquè al ser un model vectorial amb el que treballem amb els objectes directament
	// de moment sempre tenim els mateixos objectes, tot i que això podria no ser veritat en un futur, perquè en el OGC s'està treballant per fer tessel·les de vectors i es podrien 
	// servir objectes diferents en funció del nivell de zoom
	
	if (typeof capa.tileMatrixSetGeometry==="undefined" || capa.tileMatrixSetGeometry==null)
		capa.tileMatrixSetGeometry={};
	
	TMG=capa.tileMatrixSetGeometry;
	
	if(typeof capa.objLimit!=="undefined" && capa.objLimit!=-1)
	{		
		if(typeof TMG.atriObjNumerics==="undefined" || TMG.atriObjNumerics==null)
			TMG.atriObjNumerics=[{"nom": nom_camp_nObjs_tessella}];	
	}
	
	// Determino l'envolupant per poder determinar l'espai de tessel·lació
	env_capa={"EnvCRS": {"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300}, "CRS": capa.CRSgeometry};
	if(capa.EnvTotal)
	{
		env_capa.EnvCRS.MinX=capa.EnvTotal.EnvCRS.MinX;
		env_capa.EnvCRS.MinY=capa.EnvTotal.EnvCRS.MinY;
		env_capa.EnvCRS.MaxX=capa.EnvTotal.EnvCRS.MaxX;
		env_capa.EnvCRS.MaxY=capa.EnvTotal.EnvCRS.MaxY;

		if(capa.EnvTotal.CRS && !DonaCRSRepresentaQuasiIguals(capa.EnvTotal.CRS, env_capa.CRS))
			env_capa.EnvCRS=TransformaEnvolupant(env_capa.EnvCRS, crs_ori, env_capa.CRS);
	}
	else
	{
		var env_temp;
		for (var i=0; i<ParamCtrl.ImatgeSituacio.length; i++)
		{
			if (DonaCRSRepresentaQuasiIguals(ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS, env_capa.CRS))
				env_temp=ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS;
			else
				env_temp=TransformaEnvolupant(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, env_capa.CRS.toUpperCase())
			
			if (env_capa.EnvCRS.MinX>env_temp.MinX)
				env_capa.EnvCRS.MinX=env_temp.MinX;
			if (env_capa.EnvCRS.MaxX<env_temp.MaxX)
				env_capa.EnvCRS.MaxX=env_temp.MaxX;
			if (env_capa.EnvCRS.MinY>env_temp.MinY)
				env_capa.EnvCRS.MinY=env_temp.MinY;
			if (env_capa.EnvCRS.MaxY<env_temp.MaxY)
				env_capa.EnvCRS.MaxY=env_temp.MaxY;
		}
	}
	var factor=1;
	if (DonaUnitatsCoordenadesProj(env_capa.CRS)=="m" && EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamCtrl.ISituacioOri].EnvTotal.CRS))
		factor=1/FactorGrausAMetres;
	else if (EsProjLongLat(env_capa.CRS) && DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamCtrl.ISituacioOri].EnvTotal.CRS)=="m")
		factor=FactorGrausAMetres;

	// Calculo la tessel·lació si cal, usant el nivell 0 de l'array com a model		
	if(typeof capa.objLimit==="undefined" || capa.objLimit==-1)
	{
		if (typeof TMG.tileMatrix==="undefined" || TMG.tileMatrix==null)		
		{		
			// Si no tinc límit d'objectes faig la tessel·lació amb el costat de píxel més gran i amb una única tessel·la 
			TMG.tileMatrix=[{"TopLeftPoint": { "x": env_capa.EnvCRS.MinX, "y": env_capa.EnvCRS.MaxY}, 
						"TileWidth":Math.ceil((env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/(1*capa.CostatMaxim)), 
						"TileHeight":Math.ceil((env_capa.EnvCRS.MaxY-env_capa.EnvCRS.MinY)/(1*capa.CostatMaxim)),
						"costat": capa.CostatMaxim, 
						"MatrixWidth":1, 
						"MatrixHeight":1}];			
		}
		else if(TMG.tileMatrix.length==1)
		{
			// Si no tinc límit d'objectes faig la tessel·lació amb el costat de píxel més gran perquè sinó he de fer moltíssimes peticions i això és inviable.
			if(typeof TMG.tileMatrix[0].TopLeftPoint === "undefined")
				TMG.tileMatrix[0].TopLeftPoint={ "x": env_capa.EnvCRS.MinX, "y": env_capa.EnvCRS.MaxY};						
				
			if(typeof TMG.tileMatrix[0].costat === "undefined")
				TMG.tileMatrix[0].costat=capa.CostatMaxim;	
			if(typeof TMG.tileMatrix[0].MatrixWidth === "undefined")
			{		
				if(typeof TMG.tileMatrix[0].TileWidth === "undefined")
				{				
					TMG.tileMatrix[0].MatrixWidth=1;
					TMG.tileMatrix[0].TileWidth=Math.ceil((env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/(TMG.tileMatrix[0].MatrixWidth*capa.CostatMaxim));		
				}
				else
					TMG.tileMatrix[0].MatrixWidth=Math.ceil((env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/(TMG.tileMatrix[0].TileWidth*capa.CostatMaxim));		
			}
			if(typeof TMG.tileMatrix[0].MatrixHeight === "undefined")
			{		
				if(typeof TMG.tileMatrix[0].TileHeight === "undefined")
				{				
					TMG.tileMatrix[0].MatrixHeight=1;
					TMG.tileMatrix[0].TileHeight=Math.ceil((env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/(TMG.tileMatrix[0].MatrixHeight*capa.CostatMaxim));		
				}
				else
					TMG.tileMatrix[0].MatrixHeight=Math.ceil((env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/(TMG.tileMatrix[0].TileHeight*capa.CostatMaxim));		
			}			
			if(typeof TMG.tileMatrix[0].TileWidth === "undefined")
				TMG.tileMatrix[0].TileWidth=Math.ceil((env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/(TMG.tileMatrix[0].MatrixWidth*capa.CostatMaxim));		
			if(typeof TMG.tileMatrix[0].TileHeight === "undefined")
				TMG.tileMatrix[0].TileHeight=Math.ceil((env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/(TMG.tileMatrix[0].MatrixHeight*capa.CostatMaxim));		
		}
		return;
	}

	if((typeof TMG.tileMatrix==="undefined" || TMG.tileMatrix==null) || TMG.tileMatrix.length==1)  // si l'usuari no m'ha indicat la tessel·lacó la calculo sinó faig cas del que em diu
	{
		if (typeof TMG.tileMatrix==="undefined" || TMG.tileMatrix==null)		
			TMG.tileMatrix=[];		
		
		var topLeftPoint={ "x": env_capa.EnvCRS.MinX, "y": env_capa.EnvCRS.MaxY}, 
			tileWidth=((TMG.tileMatrix.length>0 && typeof TMG.tileMatrix[0].TileWidth === "number")? TMG.tileMatrix[0].TileWidth:mida_tessela_vec_defecte),
			tileHeight=((TMG.tileMatrix.length>0 && typeof TMG.tileMatrix[0].TileHeight === "number")? TMG.tileMatrix[0].TileHeight:mida_tessela_vec_defecte);		
			
		// Creo o comprovo l'espai de tessel·lació		
		for(var i_zoom=ParamCtrl.zoom.length-1, i_tile_matrix=0; i_zoom>=0; i_zoom--,i_tile_matrix++)
		{
			if(ParamCtrl.zoom[i_zoom].costat>=capa.CostatMinim && ParamCtrl.zoom[i_zoom].costat<=capa.CostatMaxim)				
			{
				if(typeof TMG.tileMatrix[i_tile_matrix]=== "undefined")
					TMG.tileMatrix[i_tile_matrix]={};									
				if(typeof TMG.tileMatrix[i_tile_matrix].costat !== "number")
					TMG.tileMatrix[i_tile_matrix].costat=ParamCtrl.zoom[i_zoom].costat*factor;						
				if(typeof TMG.tileMatrix[i_tile_matrix].TileHeight !== "number")
					TMG.tileMatrix[i_tile_matrix].TileHeight=tileHeight;
				if(typeof TMG.tileMatrix[i_tile_matrix].TileWidth !== "number")
					TMG.tileMatrix[i_tile_matrix].TileWidth=tileWidth;
				if(typeof TMG.tileMatrix[i_tile_matrix].TileHeight !== "number")
					TMG.tileMatrix[i_tile_matrix].TileHeight=tileHeight;
				if(typeof TMG.tileMatrix[i_tile_matrix].TopLeftPoint === "undefined")
					TMG.tileMatrix[i_tile_matrix].TopLeftPoint=topLeftPoint;					
				if(typeof TMG.tileMatrix[i_tile_matrix].MatrixWidth !== "number")
					TMG.tileMatrix[i_tile_matrix].MatrixWidth=Math.ceil((env_capa.EnvCRS.MaxX-TMG.tileMatrix[i_tile_matrix].TopLeftPoint.x)/(tileWidth*TMG.tileMatrix[i_tile_matrix].costat));
				if(typeof TMG.tileMatrix[i_tile_matrix].MatrixHeight !== "number")
					TMG.tileMatrix[i_tile_matrix].MatrixHeight=Math.ceil((TMG.tileMatrix[i_tile_matrix].TopLeftPoint.y-env_capa.EnvCRS.MinY)/(tileHeight*TMG.tileMatrix[i_tile_matrix].costat));
				
				if(TMG.tileMatrix[i_tile_matrix].MatrixWidth==1 && TMG.tileMatrix[i_tile_matrix].MatrixHeight==1)
				{
					//Ajusto l'envolupant de la tessel·la de manera que l'envolupant de la capa quedi centrada a la tessel·la				
					TMG.tileMatrix[i_tile_matrix].TopLeftPoint={"x":(env_capa.EnvCRS.MinX+(env_capa.EnvCRS.MaxX-env_capa.EnvCRS.MinX)/2)-(TMG.tileMatrix[i_tile_matrix].costat*TMG.tileMatrix[i_tile_matrix].TileWidth/2),
													"y":(env_capa.EnvCRS.MaxY-(env_capa.EnvCRS.MaxY-env_capa.EnvCRS.MinY)/2)+(TMG.tileMatrix[i_tile_matrix].costat*TMG.tileMatrix[i_tile_matrix].TileHeight/2)};
					// Recalculo la tessel·lació perquè ara pot haver canviat i que necessiti més tessel·les
					TMG.tileMatrix[i_tile_matrix].MatrixWidth=Math.ceil((env_capa.EnvCRS.MaxX-TMG.tileMatrix[i_tile_matrix].TopLeftPoint.x)/(tileWidth*TMG.tileMatrix[i_tile_matrix].costat));
					TMG.tileMatrix[i_tile_matrix].MatrixHeight=Math.ceil((TMG.tileMatrix[i_tile_matrix].TopLeftPoint.y-env_capa.EnvCRS.MinY)/(tileHeight*TMG.tileMatrix[i_tile_matrix].costat));
				}				
			}
		}
	}
}

// Fer sol·licitar la informació dels atributs d'un punt determinat
function ComparaObjCapaDigiIdData(x,y) {
	//Ascendent per identificador i descendent per data
	if (x.id < y.id) return -1;
	if (x.id > y.id) return 1;
	if (x.data && y.data)
	{
		if ( x.data > y.data) return -1;
		if ( x.data < y.data) return 1;
	}
	return 0;
}

function OmpleAtributsObjecteCapaDigiDesDeWFS(objecte_xml, atributs, feature)
{
var atribut;
var atrib_coll_xml, atrib_xml, tag2;

	atrib_coll_xml=DonamElementsNodeAPartirDelNomDelTag(objecte_xml, "http://miramon.uab.cat/ogc/schemas/atribut", "mmatrib", "Atribut");
	if (!atrib_coll_xml || atrib_coll_xml.length==0)
		return;
	atributs=[];  //Potser seria millor no esborrar-los cada cop però ara per ara ha quedat així
	for(var i=0; i<atrib_coll_xml.length; i++)
	{
		atrib_xml=atrib_coll_xml[i];
		atributs.push({});
		atribut=atributs[atributs.length-1];

		//Primer miro si l'atribut és consultable
		atribut.mostrar=(atrib_xml.getAttribute('mostrar')=="false") ? "no": "si";

		//descripció
		tag2=GetXMLChildElementByName(atrib_xml, '*', "descripcio");
		if(tag2 && tag2.hasChildNodes())
			atribut.descripcio=tag2.childNodes[0].nodeValue;
		//nom
		tag2=GetXMLChildElementByName(atrib_xml, '*', "nom");
		if(tag2 && tag2.hasChildNodes())
			atribut.nom=tag2.childNodes[0].nodeValue;
		//unitats
		tag2=GetXMLChildElementByName(atrib_xml, '*', "unitats");
		if(tag2 && tag2.hasChildNodes())
			atribut.unitats=tag2.childNodes[0].nodeValue;
		//separador
		tag2=GetXMLChildElementByName(atrib_xml, '*', "separador");
		if(tag2 && tag2.hasChildNodes())
		{
			atribut.separador=tag2.childNodes[0].nodeValue;
			atribut.separador=CanviaRepresentacioCaractersProhibitsXMLaCaractersText(atribut.separador);
		}
		//es link
		tag2=GetXMLChildElementByName(atrib_xml, '*', "esLink");
		if(tag2 && tag2.hasChildNodes() && tag2.childNodes[0].nodeValue=="true")
			atribut.esLink=true;
		//desc_link
		tag2=GetXMLChildElementByName(atrib_xml, '*', "descLink");
		if(tag2 && tag2.hasChildNodes())
			atribut.descLink=tag2.childNodes[0].nodeValue;
		//es imatge
		tag2=GetXMLChildElementByName(atrib_xml, '*', "esImatge");
		if(tag2 && tag2.hasChildNodes() && tag2.childNodes[0].nodeValue=="true")
			atribut.esImatge=true;
		//valor
		tag2=GetXMLChildElementByName(atrib_xml, '*', "valor");
		if(tag2 && tag2.hasChildNodes())
			feature.properties[atribut.nom ? atribut.nom : i]=tag2.childNodes[0].nodeValue;
	}
}


function OmpleAtributsObjecteCapaDigiDesDeGeoJSON(objecte_json, atributs, feature)
{

	if (!objecte_json.properties || CountPropertiesOfObject(objecte_json.properties)==0)
		return;

	feature.properties=objecte_json.properties;
}


function OmpleAtributsObjecteCapaDigiDesDeGeoJSONDeSOS(objecte_json, capa, feature)
{
	if (!objecte_json.result)
		return;

	if(objecte_json.type=="http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_ComplexObservation" && objecte_json.result.type=="DataRecord")
	{
		if(objecte_json.result.field && objecte_json.result.field.length>0)
		{
			if (!feature.properties)
				feature.properties={};
			for(var i=0;i<objecte_json.result.field.length;i++)
			{
				if(objecte_json.result.field[i].name)
					feature.properties[objecte_json.result.field[i].name]=objecte_json.result.field[i].value;
			}
		}
	}
	else if(objecte_json.observedProperty)// és un tipus simple
	{
		var prefix_valor=capa.namespace + "/" + capa.nom + "/observableProperty/";
		var property_name=objecte_json.observedProperty.substring(prefix_valor.length);
		if (!feature.properties)
			feature.properties={};
		feature.properties[property_name]=objecte_json.result.value;
	}
	//Ara el temps:
	if(objecte_json.phenomenonTime)
	{
		if (!feature.properties)
			feature.properties={};
		feature.properties.__om_time__=objecte_json.phenomenonTime;
	}
	//Ara el sensor:
	if(objecte_json.procedure)
	{
		var prefix_valor=capa.namespace + "/" + capa.nom + "/procedure/";
		var property_name=objecte_json.procedure.substring(prefix_valor.length);
		if (!feature.properties)
			feature.properties={};
		feature.properties.__om_sensor__=property_name;
	}
}

function OmpleAtributsObjecteCapaDigiDesDeSOS(objecte_xml, capa, feature)
{
var valor, tag, tags, property_name, camps, i;

	var om_type=GetXMLChildElementByName(objecte_xml, '*', "type");
	if (om_type)
	{
		valor=om_type.getAttribute('xlink:href');
		if (valor=="http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_ComplexObservation")
		{
			tag=GetXMLChildElementByName(objecte_xml, '*', "result");
			if(tag)
			{
				tag=GetXMLChildElementByName(tag, '*', "DataRecord");
				if (tag)
				{
					var camps = tag.childNodes;
					for(var i_camp=0; i_camp<camps.length; i_camp++)
					{
						if (HasXMLNodeTheRightName(camps[i_camp], '*', "field"))
						{
							property_name=camps[i_camp].getAttribute('name');
							if (property_name && property_name.length)
							{
								tags = camps[i_camp].childNodes;
								for (i=0; i<tags.length; i++)
								{
									if (HasXMLNodeTheRightName(tags[i], '*', "Text") ||
										HasXMLNodeTheRightName(tags[i], '*', "Count") ||
										HasXMLNodeTheRightName(tags[i], '*', "Quantity"))
									{
										tag=GetXMLChildElementByName(tags[i], '*', "value");
										if(tag && tag.hasChildNodes())
										{
											if (!feature.properties)
												feature.properties={};

											feature.properties[property_name]=tag.childNodes[0].nodeValue;
										}
										break;
									}
								}
							}
						}
					}
				}
			}
		}
		else
		{
			property_name=DonamElementsNodeAPartirDelNomDelTag(objecte_xml, "http://www.opengis.net/om/2.0", "om", "observedProperty");
			if (property_name && property_name.length>0)
			{
				valor=property_name[0].getAttribute('xlink:href');
				if (valor && valor.length)
				{
					var prefix_valor=capa.namespace + "/" + capa.nom + "/observableProperty/";
					property_name=valor.substring(prefix_valor.length);
					tag=DonamElementsNodeAPartirDelNomDelTag(objecte_xml, "http://www.opengis.net/om/2.0", "om", "result");
					if(tag && tag.length>0 && tag[0].hasChildNodes())
					{
						if (!feature.properties)
							feature.properties={};
						feature.properties[property_name]=tag[0].childNodes[0].nodeValue;
					}
				}
			}
		}
	}
	//Ara el temps:
	tag=GetXMLChildElementByName(objecte_xml, '*', "timePosition");
	if(tag)
	{
		if (!feature.properties)
			feature.properties={};
		feature.properties.__om_time__=tag.childNodes[0].nodeValue;
	}
	//Ara el sensor:
	tag=GetXMLChildElementByName(objecte_xml, '*', "procedure");
	if(tag)
	{
		valor=tag.getAttribute('xlink:href');
		if (valor)
		{
			var prefix_valor=capa.namespace + "/" + capa.nom + "/procedure/";
			property_name=valor.substring(prefix_valor.length);
			if (!feature.properties)
				feature.properties={};
			feature.properties.__om_sensor__=property_name;
		}
	}
}

function OmpleAtributsObjecteCapaDigiDesDeObservacionsDeSTA(obs, feature, data)
{
	feature.properties=ExtreuTransformaSTAObservations(obs, data);
}

function ProcessaResultatLecturaCSVPropietatsObjecte(results)
{
	var param=this;
	if(!results || !results.data ||  results.data.length<1)
	{
		if(param.func_error)
			param.func_error(param);
		return;
	}	
	var capa=ParamCtrl.capa[param.i_capa], feature=capa.objectes.features[param.i_obj], rows=results.data, i_row, i_atrib;
	
	if(!feature.properties)
		feature.properties={};
	if(capa.configCSV && capa.configCSV.nomCampDateTime)
	{
		// He de mirar si hi ha algun camp que sigui una serie temporal
		var i_data, data_iso;
		if(!capa.data)
		{
			capa.data=[];
			capa.AnimableMultiTime=true;
		}
		for(i_row=0; i_row<rows.length; i_row++)
		{
			data_iso=rows[i_row][capa.configCSV.nomCampDateTime];			
			i_data=InsereixDataISOaCapa(data_iso, capa.data);
			for(i_atrib=0; i_atrib<capa.atributs.length; i_atrib++)
			{
				if(capa.atributs[i_atrib].nomOri)
					feature.properties[CanviaVariablesDeCadena(capa.atributs[i_atrib].nom, capa, i_data)]=rows[i_row][capa.atributs[i_atrib].nomOri];
			}			
		}
	}
	else
	{
		for(i_row=0; i_row<rows.length; i_row++)
		{
			for(i_atrib=0; i_atrib<capa.atributs.length; i_atrib++)
			{
				if(capa.atributs[i_atrib].nomOri)
					feature.properties[capa.atributs[i_atrib].nom]=rows[i_row][capa.atributs[i_atrib].nomOri];
			}	
		}
	}
	CanviaEstatEventConsola(null, param.i_event, EstarEventTotBe);
	if(param.func_after)
		param.func_after(param);
}

function OmpleAtributsObjecteCapaDigiDesDeCadenaCSV(doc, param)
{
	if(!doc)
	{
		if(param.func_error)
			param.func_error(param);
		return;
	}
	
	var capa=ParamCtrl.capa[param.i_capa];
	
	// Si enlloc d'una cadena csv tinc un fitxer, cal que afegeixi al config del parse 
	// download: true,
	Papa.parse(doc, {
				header: true,
				delimiter: (capa.configCSV && capa.configCSV.separadorCamps) ? capa.configCSV.separadorCamps :  "",
				complete: ProcessaResultatLecturaCSVPropietatsObjecte.bind(param),				
				});		
}

function ErrorCapaDigiAmbPropietatsObjecteDigitalitzat(doc, consulta)
{
	removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
	NConsultesDigiZero++;
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
}


function MostraConsultaDeCapaDigiAmbPropietatsObjecteDigitalitzat(consulta)
{
var capa=ParamCtrl.capa[consulta.i_capa];

	if (!capa.objectes || !capa.objectes.features ||
		!capa.objectes.features[consulta.i_obj].properties || CountPropertiesOfObject(capa.objectes.features[consulta.i_obj].properties)==0)
	{
		removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
		NConsultesDigiZero++;
	}
	else
	{
		var text_resposta=MostraConsultaCapaDigitalitzadaComHTML(consulta.i_capa, consulta.i_obj, true, true)
		if(!text_resposta || text_resposta=="")
		{
			removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
			NConsultesDigiZero++;
		}
		else
		{
			contentLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj), text_resposta);
		}
	}	
}

function OmpleCapaDigiAmbPropietatsObjecteDigitalitzat(doc, consulta)
{
var root, id_obj_buscat, i_obj, capa, tipus, valor, features, objectes, objecte_xml, foi_xml;

	if(!doc)
	{
		removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
		NConsultesDigiZero++;
		CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
		return;
	}
	capa=ParamCtrl.capa[consulta.i_capa];
	if (capa.FormatImatge!="application/json" && capa.FormatImatge!="application/geo+json" && capa.FormatImatge!="text/csv")
	{
		root=doc.documentElement;

		if(!root)
		{
			removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
			NConsultesDigiZero++;
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return;
		}
	}

	features=capa.objectes.features;
	tipus=DonaTipusServidorCapa(capa);

	if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
	{
		id_obj_buscat=features[consulta.i_obj].id;
		if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json")
		{
			objectes=null;
			//try {
				//var geojson=JSON.parse(doc);
				//si hi ha una bbox es podria actualitzar però com que no la uso...
				objectes=doc.features;
			/*}
			catch (e) {
				removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
				NConsultesDigiZero++;
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
				return;
			}*/
			if(objectes && objectes.length>0)
			{
				for(i_obj=0; i_obj<objectes.length; i_obj++)
				{
					//objectes[i_obj].id=objectes[i_obj].id.substring(capa.nom.length+1); NJ no sé perquè serveix això
					if(id_obj_buscat==objectes[i_obj].id)
					{
						OmpleAtributsObjecteCapaDigiDesDeGeoJSON(objectes[i_obj], capa.atributs, capa.objectes.features[consulta.i_obj]);
						break;
					}
				}
			}
		}
		else
		{
			objectes=root.getElementsByTagName(capa.nom);
			if(objectes && objectes.length>0)
			{
				for(i_obj=0; i_obj<objectes.length; i_obj++)
				{
					//Agafo l'identificador del punt i miro si coincideix amb el de l'objecte que estic buscant.
					//els objectes estan ordenats per "id"
					valor=objectes[i_obj].getAttribute('gml:id');
					if (valor)
					{
						valor=valor.substring(capa.nom.length+1); //elimino el nom de la capa de l'id.
						if(id_obj_buscat==valor)
						{
							OmpleAtributsObjecteCapaDigiDesDeWFS(objectes[i_obj], capa.atributs, capa.objectes.features[consulta.i_obj]);
							break;
						}
					}
				}
			}
		}
	}
	else if (capa.tipus=="TipusSOS")
	{
		var prefix_foi=capa.namespace + "/" + capa.nom + "/featureOfInterest/";
		id_obj_buscat=prefix_foi + features[consulta.i_obj].id;
		if (capa.FormatImatge=="application/json")
		{
			objectes=null;
			//try {
				//var geojson=JSON.parse(doc);
				//si hi ha una bbox es podria actualitzar però com que no la uso...
				objectes=doc.observations;
			/*}
			catch (e) {
				removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
				NConsultesDigiZero++;
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
				return;
			}*/
			if(objectes && objectes.length>0)
			{
				for(i_obj=0; i_obj<objectes.length; i_obj++)
				{
					objectes[i_obj].featureOfInterest=objectes[i_obj].featureOfInterest.substring(prefix_foi.length); //elimino el prefix de l'id.
					if(id_obj_buscat==objectes[i_obj].featureOfInterest)
					{
						OmpleAtributsObjecteCapaDigiDesDeGeoJSONDeSOS(objectes[i_obj], capa, capa.objectes.features[consulta.i_obj]);
						break;
					}
				}
			}
		}
		else
		{
			objectes=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/om/2.0", "om", "OM_Observation");
			if(objectes && objectes.length>0)
			{
				for(i_obj=0; i_obj<objectes.length; i_obj++)
				{
					objecte_xml=objectes[i_obj];
					foi_xml=GetXMLChildElementByName(objecte_xml, '*', "featureOfInterest");
					if (foi_xml)
					{
						valor=foi_xml.getAttribute('xlink:href');
						if(id_obj_buscat==valor)
						{
							OmpleAtributsObjecteCapaDigiDesDeSOS(objecte_xml, capa, capa.objectes.features[consulta.i_obj]);
							break;
						}
					}
				}
			}
		}
	}
	else if (capa.tipus=="TipusSTA" || capa.tipus=="TipusSTAplus")
	{
		id_obj_buscat=features[consulta.i_obj].id;
		//try {
		//	var geojson=JSON.parse(doc);
			//si hi ha una bbox es podria actualitzar però com que no la uso...
		/*}
		catch (e) {
			removeLayer(getLayer(consulta.win, "LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_obj));
			NConsultesDigiZero++;
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return;
		}*/
		if(doc)
		{
			if(id_obj_buscat==doc["@iot.id"])
				OmpleAtributsObjecteCapaDigiDesDeObservacionsDeSTA(doc.Observations, capa.objectes.features[consulta.i_obj], capa.data);
		}
	}
	else if(capa.tipus=="TipusHTTP_GET" && capa.FormatImatge=="text/csv")
	{
		; //Si vinc aquí és que ja he passat per OmpleAtributsObjecteCapaDigiDesDeCadenaCSV(), però en principi no hi he de venir mai per aquest tipus
	}	
	MostraConsultaDeCapaDigiAmbPropietatsObjecteDigitalitzat(consulta);
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
}


function DescarregaPropietatsCapaDigiVistaSiCalCallBack(doc, consulta)
{
var capa_digi=ParamCtrl.capa[consulta.param.i_capa];

	//Carrega la informació sobre els objectes consultats
	if (0==OmpleCapaDigiAmbPropietatsObjectes(doc, consulta))
		var retorn=consulta.funcio(consulta.param);
	else
		return false;

	if (consulta.param.intencions && consulta.param.intencions=="qualitat")
	{
		if (retorn)
		{
			alert(GetMessage("QualityParamAvailableMenu", "qualitat") + " " +
				DonaCadenaNomDesc(capa_digi));
			TancaFinestraLayer('calculaQualitat');
		}
		else
		{
			alert(GetMessage("QualityNotComputedLayer", "qualitat") + " " +
				DonaCadenaNomDesc(capa_digi));
		}
	}
}

function ErrorDescarregaPropietatsCapaDigiVistaSiCalCallBack(doc, consulta)
{
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
}

//var secondTime=false;

//Retorna false si no cal o si no es pot. Retorno true si he iniciat un procés assincron per descarregar.
function DescarregaPropietatsCapaDigiVistaSiCal(funcio, param)
{
var capa=ParamCtrl.capa[param.i_capa], i_event, url, j, punt={}, tipus, env=ParamInternCtrl.vista.EnvActual;

	if (!capa.tipus //els objectes empotrats no poden obtenir les properties si no hi són
		|| !capa.objectes || !capa.objectes.features)  //falten massa coses que hi hauria d'haver
		return false;

	/*if (secondTime)
		return false;
	secondTime=true;*/
	tipus=DonaTipusServidorCapa(capa);
	for (j=0; j<capa.objectes.features.length; j++)
	{
		//Només vàlid per a fitxers de punts.
		DonaCoordenadaPuntCRSActual(punt, capa.objectes.features[j], capa.CRSgeometry);
		if (env.MinX < punt.x &&
			env.MaxX > punt.x &&
			env.MinY < punt.y &&
			env.MaxY > punt.y)
		{
			if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
			{
				if (CountPropertiesOfObject(capa.objectes.features[j].properties)<=DonaNombrePropietatsSimbolitzacio(param.i_capa))  //Només hi ha les propietats de simbolització actuals carregades
					break;
			}
			else //if (tipus=="TipusSOS" || tipus=="TipusSTA" || tipus=="TipusSTAplus")
			{
				if (CountPropertiesOfObject(capa.objectes.features[j].properties)==0)  //No hi ha propietats carregades
					break;
			}
		}
	}
	if (j==capa.objectes.features.length)
		return false; //no hi ha cap objecte que li faltin les properties.
	if (tipus=="TipusWFS")
	{
		url=DonaRequestGetFeature(param.i_capa, null, ParamInternCtrl.vista.EnvActual, null, true);
		i_event=CreaIOmpleEventConsola("GetFeature", param.i_capa, url, TipusEventGetFeature);
	}
	else if (tipus=="TipusOAPI_Features")
	{
		url=DonaRequestGetFeature(param.i_capa, null, ParamInternCtrl.vista.EnvActual, null, true);
		i_event=CreaIOmpleEventConsola("OAPI_Features", param.i_capa, url, TipusEventGetFeature);
	}
	else if (tipus=="TipusSOS")
	{
		url=DonaRequestGetObservation(param.i_capa, null, ParamInternCtrl.vista.EnvActual);
		i_event=CreaIOmpleEventConsola("GetObservation", param.i_capa, url, TipusEventGetObservation);
	}
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
	{
		url=DonaRequestSTAObservationsFeatureOfInterest(param.i_capa, null, null, ParamInternCtrl.vista.EnvActual);
		i_event=CreaIOmpleEventConsola("STA Observations", param.i_capa, url, TipusEventGetObservation);
	}
	else if (tipus=="TipusHTTP_GET" && capa.FormatImatge=="text/csv")
	{
		if(DemanaCSVPropietatsObjectesDeCapaDigitalitzadaSiCal(capa, ParamInternCtrl.vista.EnvActual, DescarregaPropietatsCapaDigiVistaSiCalCallBack, {funcio: funcio, param: param, i_event: i_event}))
			return true;	
	}
	if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json" || tipus=="TipusSTA" || tipus=="TipusSTAplus")
		loadJSON(url, DescarregaPropietatsCapaDigiVistaSiCalCallBack, ErrorDescarregaPropietatsCapaDigiVistaSiCalCallBack, {funcio: funcio, param: param, i_event: i_event});
	else
		loadFile(url, (capa.FormatImatge) ? capa.FormatImatge : "text/xml", DescarregaPropietatsCapaDigiVistaSiCalCallBack, ErrorDescarregaPropietatsCapaDigiVistaSiCalCallBack, {funcio: funcio, param: param, i_event: i_event});
	return true;
}

/*function OmpleCapaDigiAmbPropietatsObjectesText(doc, consulta)
{
var root, i_obj, capa, valor, s, ini, fi, observation;

	s=doc;
	while (true)
	{
		ini=s.length;
		ini=s.indexOf(":OM_Observation ")
		if (ini==-1)
			break;
		fi=s.indexOf("OM_Observation>")
		observation=s.slice(ini, fi);
		s=s.slice(fi+1);
	}
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
	return 0;
}
*/

function OmpleCapaDigiAmbPropietatsObjectes(doc, consulta)
{
var root, capa, features, valor, tipus, i_obj;

	capa=ParamCtrl.capa[consulta.param.i_capa];
	tipus=DonaTipusServidorCapa(capa);
	if(tipus=="tipusHTTP_GET" && capa.FormatImatge=="text/csv")
		return 0;
	if(!doc)
	{
		CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
		return 1;
	}	
	if (capa.FormatImatge!="application/json" && capa.FormatImatge!="application/geo+json" && capa.FormatImatge!="text/csv")
	{
		root=doc.documentElement;

		if(!root)
		{
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return 1;
		}
	}
	features=capa.objectes.features;
	
	if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features" || tipus=="tipusHTTP_GET")
	{
		if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json")
		{
			var objectes=null;
			//try {
			//	var geojson=JSON.parse(doc);
				//si hi ha una bbox es podria actualitzar però com que no la uso...
				objectes=doc.features;
			/*}
			catch (e) {
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
				return;
			}*/
			if(objectes && objectes.length>0)
			{
				for(var i_obj_llegit=0; i_obj_llegit<objectes.length; i_obj_llegit++)
				{
					// objectes[i_obj_llegit].id=objectes[i_obj_llegit].id.substring(capa.nom.length+1); NJ no sé perquè serveix això
					i_obj=features.binarySearch(objectes[i_obj_llegit], ComparaObjCapaDigiIdData);
					if (i_obj>=0)
						OmpleAtributsObjecteCapaDigiDesDeGeoJSON(objectes[i_obj_llegit], capa.atributs, features[i_obj]);
				}
			}
		}
		else
		{
			var objectes=root.getElementsByTagName(capa.nom);
			if(objectes && objectes.length>0)
			{
				for(var i_obj_llegit=0; i_obj_llegit<objectes.length; i_obj_llegit++)
				{
					//Agafo l'identificador del punt i miro si coincideix amb el de l'objecte que estic buscant.
					//els objectes estan ordenats per "id"
					valor=objectes[i_obj_llegit].getAttribute('gml:id');
					if (valor)
					{
						valor=valor.substring(capa.nom.length+1); //elimino el nom de la capa de l'id.
						i_obj=features.binarySearch({"id":valor}, ComparaObjCapaDigiIdData);
						if (i_obj>=0)
							OmpleAtributsObjecteCapaDigiDesDeWFS(objectes[i_obj_llegit], capa.atributs, features[i_obj]);
					}
				}
			}
		}
	}
	else if (capa.tipus=="TipusSOS")
	{
		if (capa.FormatImatge=="application/json")
		{
			var objectes=null;
			var prefix_foi=capa.namespace + "/" + capa.nom + "/featureOfInterest/";
			//try {
			//	var geojson=JSON.parse(doc);
				//si hi ha una bbox es podria actualitzar però com que no la uso...
				objectes=doc.observations;
			/*}
			catch (e) {
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
				return;
			}*/
			if(objectes && objectes.length>0)
			{
				for(var i_obj_llegit=0; i_obj_llegit<objectes.length; i_obj_llegit++)
				{
					objectes[i_obj_llegit].featureOfInterest=objectes[i_obj_llegit].featureOfInterest.substring(prefix_foi.length); //elimino el prefix de l'id.
					i_obj=features.binarySearch({"id":capa.nom+"_"+objectes[i_obj_llegit].featureOfInterest}, ComparaObjCapaDigiIdData);
					if (i_obj>=0)
						OmpleAtributsObjecteCapaDigiDesDeGeoJSONDeSOS(objectes[i_obj_llegit], capa, features[i_obj]);
				}
			}
		}
		else
		{
			var prefix_foi=capa.namespace + "/" + capa.nom + "/featureOfInterest/";
			var objectes=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/om/2.0", "om", "OM_Observation");
			if(objectes && objectes.length>0)
			{
				for(var i_obj_llegit=0; i_obj_llegit<objectes.length; i_obj_llegit++)
				{
					var objecte_xml=objectes[i_obj_llegit];
					var foi_xml=GetXMLChildElementByName(objecte_xml, '*', "featureOfInterest");
					if (foi_xml)
					{
						valor=foi_xml.getAttribute('xlink:href');
						if (valor)
						{
							valor=valor.substring(prefix_foi.length); //elimino el prefix de l'id.
							i_obj=features.binarySearch({"id":valor}, ComparaObjCapaDigiIdData);
							if (i_obj>=0)
								OmpleAtributsObjecteCapaDigiDesDeSOS(objecte_xml, capa, features[i_obj], capa.data);
						}
					}
				}
			}
		}
	}
	else if (capa.tipus=="TipusSTA" || capa.tipus=="TipusSTAplus")
	{
		/*try {
			var geojson=JSON.parse(doc);
			//si hi ha una bbox es podria actualitzar però com que no la uso...
		}
		catch (e) {
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return;
		}*/
		if(doc && doc.length>0)
		{
			for(var i_obj_llegit=0; i_obj_llegit<doc.length; i_obj_llegit++)
			{
				i_obj=features.binarySearch({"id":doc[i_obj_llegit]["@oit.id"]}, ComparaObjCapaDigiIdData);
				if (i_obj>=0)
					OmpleAtributsObjecteCapaDigiDesDeObservacionsDeSTA(doc[i_obj_llegit].Observations, features[i_obj], capa.data);
			}
		}
	}
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
	return 0;
}// Fi de OmpleCapaDigiAmbPropietatsObjectes()

function AddPropertyAndTime(prop, time, obsProp, uom, value)
{
var key;

	if (obsProp && obsProp.name)
		key=obsProp.name
	else
	{
		if ((!uom.name || uom.name=="n/a") && uom.definition)
		{
			if (uom.definition.lastIndexOf("/")>0)
				key=uom.definition.substring(uom.definition.lastIndexOf("/")+1);
			else
				key=uom.definition;
		}
		else if (!uom.name)
			key="name";
		else
		{
			key=uom.name;
			for (var i=0; i<key.length; i++)
			{
				if (!isalnum(key.charAt(i)))
					key=key.substring(0, i) + "_" + key.substring(i+1);
			}
		}
	}
	/*if (time)  //Mirar bé com s'ha de fer.
		prop[key+time]=value;
	else*/
		prop[key]=value;
}

function ExtreuTransformaSTAObservations(obs, data_capa)
{
var ob, prop={}, nom_param, ds;

	for (var i=0; i<obs.length; i++)
	{
		ob=obs[i];
		if (ob.phenomenonTime)
		{
			prop["time"]=ob.phenomenonTime;
			//InsereixDataISOaCapa(ob.phenomenonTime, data_capa);
		}
		if (ob.parameters)
		{
			for (nom_param in ob.parameters)
			{
				if (ob.parameters.hasOwnProperty(nom_param) && typeof ob.parameters[nom_param]!=="object")
					prop[nom_param]=ob.parameters[nom_param];
			}
		}
		if (ob.MultiDatastream)
		{
			for (var j=0; j<ob.MultiDatastream.unitOfMeasurements.length; j++)
				AddPropertyAndTime(prop, ob.phenomenonTime, ob.MultiDatastream.ObservedProperties[j], ob.MultiDatastream.unitOfMeasurements[j], ob.result[j]);
			ds=ob.MultiDatastream;
		}
		else // if (ob.Datastream)
		{
			AddPropertyAndTime(prop, ob.phenomenonTime, ob.Datastream.ObservedProperty, ob.Datastream.unitOfMeasurement, ob.result);
			ds=ob.Datastream;
		}
		if (ds.Thing && ds.Thing.name)
			prop["thing"]=ds.Thing.name;
		if (ds.Party && ds.Party.name)
			prop["party"]=ds.Party.name;
		if (ds.Project && ds.Project.name)
			prop["project"]=ds.Project.name;
		if (ds.License && ds.License.description)
			prop["license"]=ds.License.description;
	}
	return prop;
}

function ExtreuITransformaSTAfeatures(fois)
{
var features=[], foi;
	for (var i=0; i<fois.value.length; i++)
	{
		foi=fois.value[i];
		if (foi.feature.type=="Feature")
		{
			features.push(foi.feature);
			features[features.length-1].id=foi["@iot.id"];
			features[features.length-1].properties=[];
		}
		else
		{
			//Following https://developers.sensorup.com/docs/#featureOfInterest_post a STA feature is actually a geometry.
			features.push({type: "Feature",
					id: foi["@iot.id"],
					geometry: foi.feature,
					//properties: ExtreuTransformaSTAObservations(foi.Observations)}
					properties: []});
		}
	}
	return features;
}
function DonaPuntCentreEnvolupantTessella(capa, tile)
{
var TM=capa.tileMatrixSetGeometry.tileMatrix;
	
	var i=DonaIndexTileMatrixVectorAPartirDeCostat(TM, tile.costat);
	if(i==-1)
		return {"x":0, "y":0};	
	return {"x": TM[i].TopLeftPoint.x +(tile.iTile*TM[i].TileWidth*TM[i].costat) +(TM[i].TileWidth*TM[i].costat/2),
			"y": TM[i].TopLeftPoint.y -(tile.jTile*TM[i].TileHeight*TM[i].costat)-(TM[i].TileHeight*TM[i].costat/2)};
}

// Els objectes es mantenen en memòria ordenats per id. Això es fa servir per afegir atributs als objectes més endavant.
function OmpleCapaDigiAmbObjectesDigitalitzats(doc, consulta)
{
var root, tag, punt={}, objectes, valor, capa, feature, hi_havia_objectes, tipus, tile, i_tile_matrix=-1;
var nObj=false, tm=null, hi_havia_objectes_tm=false;

	//Agafo tots els nodes que tenen per nom el nom de la capa, cada un d'ells serà un punt
	if(!doc)
	{
		CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
		return;
	}

	capa=ParamCtrl.capa[consulta.i_capa_digi];
	tipus=DonaTipusServidorCapa(capa);
	if(consulta.i_tile!=-1)
	{
		tile=capa.tileMatrixSetGeometry.tilesSol[consulta.i_tile];
		i_tile_matrix=DonaIndexTileMatrixVectorAPartirDeCostat(capa.tileMatrixSetGeometry.tileMatrix, tile.costat);
		tm=capa.tileMatrixSetGeometry.tileMatrix[i_tile_matrix];
	}
	else	
		tile=null;
	
	if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json")
	{
		if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features" || tipus=="TipusSOS" || tipus=="TipusSTA" || tipus=="TipusSTAplus" || tipus=="TipusHTTP_GET")
		{				
			if((typeof capa.objLimit !== "undefined") && capa.objLimit!=-1 && tile!=null)
			{					
				// Potser que hagi rebuts els objectes o el nombre d'objectes o les dues coses
				if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
				{	
					if(doc.numberOfFeatures)
						tile.nombreObjectes=doc.numberOfFeatures;  // si WFS versió < 2.0
					else if (doc.numberMatched)
						tile.nombreObjectes=doc.numberMatched; // si WFS versió >= 2.0										
				}
				else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
				{
					if((typeof doc["@iot.count"]!=="undefined") && doc["@iot.count"]!=null)
						tile.nombreObjectes=doc["@iot.count"]; // si STA					
				}
				if(tile.nombreObjectes==0 || (tile.nombreObjectes>0 && tile.nombreObjectes<capa.objLimit))
				{
					CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
					// Torno a fer la petició però ara demanant els objectes i no el nombre d'objectes
					FesPeticioAjaxObjectesDigitalitzats(consulta.i_capa_digi, -1,  null, null, null, true, consulta.env_sol, false, consulta.funcio, consulta.param);					
					return;
				}
				// Afegeixo un objecte númeric amb el nombre d'Objectes de la tessel·la
				nObj=true;
				if((typeof tm.objNumerics==="undefined") || tm.objNumerics==null)
					tm.objNumerics={"type":"FeatureCollection", "features":[]};
				else if((typeof tm.objNumerics.features==="undefined") || tm.objNumerics.features==null)
					tm.objNumerics.features=[];
				else
					hi_havia_objectes_tm=true;
				var puntCentre=DonaPuntCentreEnvolupantTessella(capa, tile);
				var objecteNum={"type": "Feature",
							"id" : (tile.iTile +"_"+tile.jTile),										
							"geometry": {"type": "Point","coordinates": [puntCentre.x, puntCentre.y]}, 
							"properties": {}};								
				objecteNum.properties[capa.tileMatrixSetGeometry.atriObjNumerics[0].nom]=tile.nombreObjectes;
				tm.objNumerics.features.push(objecteNum);														
			}
			if(!nObj)
			{
				if (capa.objectes && capa.objectes.features)
				{
					hi_havia_objectes=true;
					//si hi ha una bbox es podria actualitzar però com que no la uso...
					if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features" || tipus=="TipusHTTP_GET")
						var features=doc.features;
					else if (tipus=="TipusSOS")
						var features=doc.featureOfInterest;
					else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
						var features=ExtreuITransformaSTAfeatures(doc);
					if(features.length>0)
					{
						/*NJ no sé perquè serveix això
						for (i=0; i<features.length; i++)
							features[i].id=features[i].id.substring(capa.nom.length+1); */
						capa.objectes.features.push.apply(capa.objectes.features, features);  //Millor no usar concat. Extret de: https://jsperf.com/concat-vs-push-apply/10
					}
				}
				else
				{
					hi_havia_objectes=false;
					if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features" || tipus=="TipusHTTP_GET")
						capa.objectes=doc;
					if (tipus=="TipusSOS")
						capa.objectes={"type": "FeatureCollection", "features": doc.featureOfInterest};
					else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
					{
						var features=ExtreuITransformaSTAfeatures(doc);
						capa.objectes={"type": "FeatureCollection", "features": features};
					}
					/*NJ no sé perquè serveix això
					var features=capa.objectes.features;
					for (i=0; i<features.length; i++)
						features[i].id=features[i].id.substring(capa.nom.length+1);*/
				}
			}
		}	
		else
		{
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return;
		}
	}
	/*else if (capa.FormatImatge=="text/csv" && tipus=="TipusHTTP_GET")
	{
		//·$·
		var parsedData=DonaJSONDeCadenaCSV(doc, ";");		
		function OmpleAtributsObjecteCapaDigiDesDeDataCSV(parsedData, atributs, feature)
	}*/
	else
	{
		root=doc.documentElement;
		if(!root)
		{
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return;
		}
		if((typeof capa.objLimit !== "undefined") && capa.objLimit!=-1 && tile)
		{					
			// Potser que hagi rebuts els objectes o el nombre d'objectes o les dues coses
			if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
			{
				var atributs=root.attributes, atribNObjs=null;				
				if(atributs)
				{
					atribNObjs=atributs.getNamedItem("numberOfFeatures");// si WFS versió < 2.0
					if(!atribNObjs)
						atribNObjs=atributs.getNamedItem("numberMatched");// si WFS versió >= 2.0	
				}
				if(atribNObjs)
					tile.nombreObjectes=atribNObjs.value;
			}			
			if(tile.nombreObjectes==0 || (tile.nombreObjectes>0 && tile.nombreObjectes<capa.objLimit))
			{
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
				// Torno a fer la petició però ara demanant els objectes i no el nombre d'objectes
				FesPeticioAjaxObjectesDigitalitzats(consulta.i_capa_digi, -1,  null, null, null, true, consulta.env_sol, false, consulta.funcio, consulta.param);					
				return;
			}
			nObj=true;			
			if((typeof tm.objNumerics==="undefined") || tm.objNumerics==null)
				tm.objNumerics={"type":"FeatureCollection", "features":[]};
			else if((typeof tm.objNumerics.features==="undefined") || tm.objNumerics.features==null)
				tm.objNumerics.features=[];
			else
				hi_havia_objectes_tm=true;
			var puntCentre=DonaPuntCentreEnvolupantTessella(capa, tile);
			var objecteNum={"type": "Feature",
							"id" : (tile.iTile +"_"+tile.jTile),										
							"geometry": {"type": "Point","coordinates": [puntCentre.x, puntCentre.y]}, 
							"properties": {}};
			objecteNum.properties[capa.tileMatrixSetGeometry.atriObjNumerics[0].nom]=tile.nombreObjectes;
			tm.objNumerics.features.push(objecteNum);																	
		}
		if(!nObj)
		{
			if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
			{
				if(!capa.namespace || capa.namespace==null)
				{
					var ns;
					var atributs=root.attributes;
					if(atributs)
						ns=atributs.getNamedItem("xmlns");
					if(ns)
						capa.namespace=ns.value;
				}
				objectes=root.getElementsByTagName(capa.nom);
			}
			else if (tipus=="TipusSOS")
				objectes=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/samplingSpatial/2.0", "sams", "SF_SpatialSamplingFeature");
			else
			{
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
				return;
			}
			if(objectes && objectes.length>0)
			{
				if (capa.objectes && capa.objectes.features)
					hi_havia_objectes=true;
				else
				{
					capa.objectes={"type": "FeatureCollection", "features": []};
					hi_havia_objectes=false;
				}
				for(var i_obj=0; i_obj<objectes.length; i_obj++)
				{
					//Agafo l'identificador del punt i creo l'objecte dins de la Capa
					valor=objectes[i_obj].getAttribute('gml:id');
					valor=valor.substring(capa.nom.length+1); //elimino el nom de la capa de l'id.
					feature=capa.objectes.features[capa.objectes.features.push({
										"id": valor,
										"geometry": {
											"type": "Point",
											"coordinates": [0.0, 0.0]
										},
										"properties": {},
										"seleccionat": (consulta.seleccionar? true : false)
									})-1];

					if(objectes[i_obj].hasChildNodes)
					{
						//Agafo la posició dels objectes
						tag=DonamElementsNodeAPartirDelNomDelTag(objectes[i_obj], "http://www.opengis.net/gml", "gml", "pos");
						if(tag.length>0)
						{
							//cal_crear_vista=true;
							valor=tag[0].childNodes[0].nodeValue;
							var coord=valor.split(" ");
							if (CalGirarCoordenades(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, null))  // ·$· NJ-> JM Crec que això no està bé, perquè les coordenades en el cas del SOS són de moment sempre en EPGS:4326 i  no en el sistema de sistuació acutal
							{
								feature.geometry.coordinates[0]=parseFloat(coord[1]);
								feature.geometry.coordinates[1]=parseFloat(coord[0]);
							}
							else
							{
								feature.geometry.coordinates[0]=parseFloat(coord[0]);
								feature.geometry.coordinates[1]=parseFloat(coord[1]);
							}
							CanviaCRSITransformaCoordenadesCapaDigi(capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
							if(consulta.seleccionar==true)
							{
								//Actualitzar EnvSelec, que sempre està en el sistema de coordenades actual
								DonaCoordenadaPuntCRSActual(punt, feature, capa.CRSgeometry);
								if(EnvSelec==null)
									EnvSelec={"MinX": punt.x, "MaxX": punt.x, "MinY": punt.y, "MaxY": punt.y};
								else
								{
									if(punt.x<EnvSelec.MinX)
										EnvSelec.MinX=punt.x;
									if(punt.x>EnvSelec.MaxX)
										EnvSelec.MaxX=punt.x;
									if(punt.y<EnvSelec.MinY)
										EnvSelec.MinY=punt.y;
									if(punt.y>EnvSelec.MaxY)
										EnvSelec.MaxY=punt.y;
								}
							}
						}

						if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
						{
							//ara els atributs
							OmpleAtributsObjecteCapaDigiDesDeWFS(objectes[i_obj], capa.atributs, feature);
						}
						//ara el i_simbol
						//DeterminaISimbolObjecteCapaDigi(capa, i_obj);
					}
				}
				CarregaSimbolsEstilActualCapaDigi(capa);
			}
		}
	}
	if(!nObj)
	{
		if (capa.objectes && capa.objectes.features && capa.objectes.features.length==0)
			capa.objectes=null;

		if (capa.objectes && capa.objectes.features)
		{
			//Elimino els objectes que han estat carregats més d'un cop. Això pot passar en usar tiles.
			var features=capa.objectes.features;
			features.sort(ComparaObjCapaDigiIdData);
			if (hi_havia_objectes)
			{
				var anterior=features[0].id;
				var i=1;
				while(i<features.length)
				{
					if(anterior==features[i].id)
						features.splice(i,1);
					else
					{
						anterior=features[i].id;
						i++;
					}
				}
			}
		}

		if (!hi_havia_objectes)
			DefineixAtributsCapaVectorSiCal(capa);

		CanviaCRSITransformaCoordenadesCapaDigi(capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		/*if(consulta.seleccionar==false && cal_crear_vista)
			CreaVistes(); Ara el redibuixat es fa en el canvas quan totes les tiles han finalitzat i no cal forçar-lo a cada tile mai.*/
	}
	else if(tm)
	{
		if (tm.objNumerics && tm.objNumerics.features && tm.objNumerics.features.length==0)
			tm.objNumerics=null;
		
		if (tm.objNumerics && tm.objNumerics.features)
		{
			//Elimino els objectes que han estat carregats més d'un cop. 
			var features=tm.objNumerics.features;
			features.sort(ComparaObjCapaDigiIdData);
			if (hi_havia_objectes_tm)
			{
				var anterior=features[0].id;
				var i=1;
				while(i<features.length)
				{
					if(anterior==features[i].id)
						features.splice(i,1);
					else
					{
						anterior=features[i].id;
						i++;
					}
				}
			}
		}
		
	}
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
	if(consulta.funcio)
		consulta.funcio(consulta.param);

}//Fi de OmpleCapaDigiAmbObjectesDigitalitzats()

function ErrorCapaDigiAmbObjectesDigitalitzats(doc, consulta)
{
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
}//Fi de ErrorCapaDigiAmbObjectesDigitalitzats()

//Dona l'índex dins de l'array d'atributs d'un nom d'attribut
function DonaIAtributsDesDeNomAtribut(capa_digi, atributs, nom_atribut)
{
	if(atributs==null)
		return -1;
	for(var i=0; i<atributs.length; i++)
	{
		if(!atributs[i].nom)
		{
			alert("The "+i+" attribute of the layer "+capa_digi.nom+" has no name.");
			return -1;
		}
		if(atributs[i].nom.toUpperCase()==nom_atribut.toUpperCase())
			return i;
	}
	return -1;
}

//Determina el valor per una data concreta. Pensada per muntar sèries temporals
function DeterminaValorAtributObjecteDataCapaDigi(i_nova_vista, capa, feature, atribut, i_data, i_col, i_fil)
{
	if (atribut.calcul && !atribut.FormulaConsulta)
	{
		alert("Irregular situation in the code. This needs to be solved in the feature collection level.");
		return 0;
	}

	if (atribut.FormulaConsulta)
	{
		var p=feature.properties;  //Encara que sembla que no es fa servir, aquesta variable és necessaria pels evals()
		var nonPropId=feature.id;
		if (HiHaValorsNecessarisCapaFormulaconsulta(capa, atribut.FormulaConsulta))
			var v=DonaValorsDeDadesBinariesCapa(i_nova_vista, capa, null, i_col, i_fil); //idem
		return eval(CanviaVariablesDeCadena(atribut.FormulaConsulta, capa, i_data));
	}
	if (atribut.nom=="nonPropId")
		return feature.id;
	return feature.properties[CanviaVariablesDeCadena(atribut.nom, capa, i_data)];
}

//Determina el valor per la data actual
function DeterminaValorAtributObjecteCapaDigi(i_nova_vista, capa, feature, atribut, i_col, i_fil)
{
	return DeterminaValorAtributObjecteDataCapaDigi(i_nova_vista, capa, feature, atribut, null, i_col, i_fil)
}

function DeterminaTextValorAtributObjecteCapaDigi(i_nova_vista, capa_digi, feature, atribut, i_col, i_fil)
{
	return DeterminaTextValorAtributObjecteDataCapaDigi(i_nova_vista, capa_digi, feature, atribut, null, i_col, i_fil);
}

function DeterminaTextValorAtributObjecteDataCapaDigi(i_nova_vista, capa_digi, feature, atribut, i_data, i_col, i_fil)
{
	var valor=DeterminaValorAtributObjecteDataCapaDigi(i_nova_vista, capa_digi, feature, atribut, i_data, i_col, i_fil);
	if (atribut.NDecimals || atribut.NDecimals===0)
		return OKStrOfNe(valor, atribut.NDecimals);
	return valor;
}

function AlertaNomAtributIncorrecteSimbolitzar(nom_camp, text_nom_camp, capa_digi)
{
	alert(GetMessage("WrongAttributeName") +
				" " +
				nom_camp + " (" + text_nom_camp + ") " +
				GetMessage("symbolizeLayer") + " " +
				DonaCadenaNomDesc(capa_digi));
}

function DeterminaValorObjecteCapaDigi(i_nova_vista, capa_digi, atributs, estil, feature, i_simbs, i_col, i_fil, nom_camp)
{
	if(estil && nom_camp && feature.properties && CountPropertiesOfObject(feature.properties)>0)
	{
		var i_atrib=DonaIAtributsDesDeNomAtribut(capa_digi, atributs, nom_camp);
		if (i_atrib==-1)
		{
			AlertaNomAtributIncorrecteSimbolitzar(nom_camp, "NomCamp*", capa_digi);
			return 0;
		}
		return DeterminaValorAtributObjecteCapaDigi(i_nova_vista, capa_digi, feature, atributs[i_atrib], i_col, i_fil);
	}
	return 0;
}

function DeterminaTextValorObjecteCapaDigi(i_nova_vista, capa_digi, atributs, estil, feature, i_simbs, i_col, i_fil, nom_camp)
{
	if(estil && nom_camp && feature.properties && CountPropertiesOfObject(feature.properties)>0)
	{
		var i_atrib=DonaIAtributsDesDeNomAtribut(capa_digi, atributs, nom_camp);
		if (i_atrib==-1)
		{
			AlertaNomAtributIncorrecteSimbolitzar(nom_camp, "NomCamp*", capa_digi);
			return 0;
		}
		return DeterminaTextValorAtributObjecteCapaDigi(i_nova_vista, capa_digi, feature, atributs[i_atrib], i_col, i_fil);
	}
	return 0;
}

function DeterminaISimbolObjecteCapaDigi(i_nova_vista, capa_digi, atributs, estil, feature, i_simbs, i_col, i_fil)
{
	if(estil && estil.simbols && estil.simbols.length &&
		estil.simbols[i_simbs].NomCamp && feature.properties &&
		CountPropertiesOfObject(feature.properties)>0)
	{
		var i_atrib=DonaIAtributsDesDeNomAtribut(capa_digi, atributs, estil.simbols[i_simbs].NomCamp)
		if (i_atrib==-1)
		{
			AlertaNomAtributIncorrecteSimbolitzar(estil.simbols[i_simbs].NomCamp, "estil.simbols[i_simbs].NomCamp", capa_digi);
			return -1;
		}
		var valor=DeterminaValorAtributObjecteCapaDigi(i_nova_vista, capa_digi, feature, atributs[i_atrib], i_col, i_fil);
		for(var i_simbol=0; i_simbol<estil.simbols[i_simbs].simbol.length; i_simbol++)
		{
			if(valor==estil.simbols[i_simbs].simbol[i_simbol].ValorCamp)
				return i_simbol;
		}
		return -1;  //The value of the object does not correspond with any simbol
	}
	return 0;  //simbols are not indexed by NomCamp (or there are no properties in the object) so there first simbol should be used
}

//Discusió de com fer tot això: http://stackoverflow.com/questions/17578280/how-to-pass-parameters-into-image-load-event
function EnCarregarSimbolCapaDigi()
{
	this.sha_carregat = true;
}

function EnErrorCarregarSimbolCapaDigi()
{
	this.hi_ha_hagut_error = true;
	alert("Error uploading "+ this.src);
}

function CarregaImatgeIcona(icona)
{
	if (icona.icona)
	{
		icona.img = new Image();
		icona.img.src = AfegeixAdrecaBaseSRC(icona.icona);
		icona.img.ncol = icona.ncol;
		icona.img.nfil = icona.nfil;
		icona.img.sha_carregat = false;
		icona.img.hi_ha_hagut_error = false;
		icona.img.onload = EnCarregarSimbolCapaDigi;
		icona.img.onerror = EnErrorCarregarSimbolCapaDigi;
	}
}

function DescarregaSimbolsEstil(estil)
{
var simbol;
	if (!estil.simbols || !estil.simbols.length)
		return;
	for (var i_simb=0; i_simb<estil.simbols.length; i_simb++)
	{
		if (!estil.simbols[i_simb].simbol)
			continue;
		simbol=estil.simbols[i_simb].simbol;

		for(var i_simbol=0; i_simbol<simbol.length; i_simbol++)
		{
			if (simbol[i_simbol].icona && simbol[i_simbol].icona.img)
				delete simbol[i_simbol].icona.img;
			if (simbol[i_simbol].IconaSel && simbol[i_simbol].IconaSel.img)
				delete simbol[i_simbol].IconaSel.img;
		}
	}
}

function DescarregaSimbolsCapaDigi(capa)
{
	if (!capa.estil)
		return;
	for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
	{
		DescarregaSimbolsEstil(capa.estil[i_estil]);
		if(capa.estil[i_estil].estilTilesObjNum)
			DescarregaSimbolsEstil(capa.estil[i_estil].estilTilesObjNum);		
	}
}

function CarregaSimbolsEstil(estil, recarrega)
{
var simbol;	
	if(!estil.simbols)
		return;
	for (var i_simb=0; i_simb<estil.simbols.length; i_simb++)
	{
		if (!estil.simbols[i_simb].simbol)
			continue;
		
		simbol=estil.simbols[i_simb].simbol;
		for(var i_simbol=0; i_simbol<simbol.length; i_simbol++)
		{
			if (simbol[i_simbol].icona)
			{
				if(!simbol[i_simbol].icona.i)
					simbol[i_simbol].icona.i=0;
				if(!simbol[i_simbol].icona.j)
					simbol[i_simbol].icona.j=0;			
				if(recarrega || !simbol[i_simbol].icona.img)
					CarregaImatgeIcona(simbol[i_simbol].icona);
				
			}
			if (simbol[i_simbol].IconaSel)
			{
				if(!simbol[i_simbol].IconaSel.i)
					simbol[i_simbol].IconaSel.i=0;
				if(!simbol[i_simbol].IconaSel.j)
					simbol[i_simbol].IconaSel.j=0;		
				if(recarrega || !simbol[i_simbol].IconaSel.img)
					CarregaImatgeIcona(simbol[i_simbol].IconaSel);
			}
		}
	}
}

function CarregaSimbolsEstilCapaDigi(capa, i_estil, recarrega)
{
	if (!capa.estil || capa.estil.length==0 ||
		!capa.estil[i_estil].simbols)
		return;

	if (!Array.isArray(capa.estil[i_estil].simbols))
		alert("New in 2020-03-10. In all 'capa's, \"simbols\" should be an array.");

	CarregaSimbolsEstil(capa.estil[i_estil], recarrega);
	if(capa.estil[i_estil].estilTilesObjNum)
		CarregaSimbolsEstil(capa.estil[i_estil].estilTilesObjNum, recarrega);
}

function CarregaSimbolsEstilActualCapaDigi(capa)
{
	CarregaSimbolsEstilCapaDigi(capa, capa.i_estil, false);
}

function DonaRequestDescribeFeatureTypeInterna(i, simple)
{
var cdns=[];
var c_afegir="";

	cdns.push("VERSION=",DonaVersioComAText(ParamCtrl.capa[i_capa].versio),"&amp;SERVICE=WFS&amp;REQUEST=DescribeFeatureType&amp;OUTPUTFORMAT=",
			  (simple ? "text/xml;subtype=gml/3.1.1/profiles/gmlsf/1.0.0/0" : "text/xml;subtype=gml/3.1.1/profiles/miramon/1.0.0/attributes") ,
			  "&amp;SRSNAME=",ParamCtrl.capa[i].CRSgeometry ,"&amp;TYPENAME=" ,ParamCtrl.capa[i].nom);

	return AfegeixNomServidorARequest(DonaServidorCapa(ParamCtrl.capa[i]), cdns.join(""), true, DonaCorsServidorCapa(ParamCtrl.capa[i]));
}//Fi de DonaRequestDescribeFeatureTypeInterna()

function DonaRequestOWSObjectesDigi(i_capa, limit, env, cadena_objectes, completa)
{
var tipus=DonaTipusServidorCapa(ParamCtrl.capa[i_capa]);

	if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
		return DonaRequestGetFeature(i_capa, limit, env, cadena_objectes, completa);
	if (tipus=="TipusSOS")
		return DonaRequestSOSGetFeatureOfInterest(i_capa, env);
	if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
		return DonaRequestSTAFeaturesOfInterest(i_capa, limit, env);
	if (tipus=="TipusHTTP_GET")
		return ParamCtrl.capa[i_capa].servidor;

	alert(GetMessage("UnsuppServiceType") + ": " + tipus);
	return "";
}

function EsCampCalculat(atributs, nom_camp)
{
	for(var i=0; i<atributs.length; i++)
	{
		if(atributs[i].nom==nom_camp)
		{
			if(atributs[i].FormulaConsulta)
				return i;
			return -1;
		}
	}
	return -1;
}

function DonaNomsCampsCapaDeAtributCalculat(i_capa, formula)
{
var fragment, cadena, inici, final;
var noms_camps=[];

	fragment=formula;
	while(((inici=fragment.indexOf("p[\""))!=-1 || (inici=fragment.indexOf("p['"))!=-1)  &&
		   ((final=fragment.indexOf("\"]"))!=-1 || (final=fragment.indexOf("']"))!=-1))
	{
		cadena=fragment.substring(inici+3, final);
		noms_camps.push(cadena);
		fragment=fragment.substring(final+2, fragment.length);
	}
	return noms_camps;
}

function HiHaSimbolitzacioIndexadaPerPropietats(estil)
{
var simbols;

	if (estil.simbols && estil.simbols.length)
	{
		for (var i_simb=0; i_simb<estil.simbols.length; i_simb++)
		{
			if (estil.simbols[i_simb].NomCamp)
				return true;
			if (estil.simbols[i_simb].NomCampFEscala)
				return true;
		}
	}

	if (estil.NomCampSel ||
		(estil.fonts && estil.fonts.NomCamp))
		return true;

	if (estil.formes && estil.formes.length)
	{
		for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
		{
			if (estil.formes[i_forma].interior && estil.formes[i_forma].interior.NomCamp)
				return true;
			if (estil.formes[i_forma].vora && estil.formes[i_forma].vora.NomCamp)
				return true;
		}
	}
	return false;
}

function DonaNombrePropietatsSimbolitzacio(i_capa)
{
	var llista=DonaLlistaPropietatsSimbolitzacio(i_capa);
	return llista.length;
}

function DonaLlistaPropietatsSimbolitzacio(i_capa)
{
var llista=[], i_calculat, capa=ParamCtrl.capa[i_capa], simbols, forma, estil;

	if(capa.estil && capa.estil.length)
	{
		for(var i=0;i<capa.estil.length; i++)
		{
			estil=capa.estil[i];
			if(estil.simbols && estil.simbols.length)
			{
				for (var i_simb=0; i_simb<estil.simbols.length; i_simb++)
				{
					simbols=estil.simbols[i_simb];
					if(simbols.NomCamp)
					{
						if(-1==(i_calculat=EsCampCalculat(capa.atributs, simbols.NomCamp)))
							llista.push(simbols.NomCamp);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAtributCalculat(i_capa, capa.atributs[i_calculat].FormulaConsulta));
					}
					if(simbols.NomCampFEscala)
					{
						if(-1==(i_calculat=EsCampCalculat(capa.atributs, simbols.NomCampFEscala)))
							llista.push(simbols.NomCampFEscala);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAtributCalculat(i_capa, capa.atributs[i_calculat].FormulaConsulta));
					}
				}
			}
			if(estil.NomCampSel)
			{
				if(-1==(i_calculat=EsCampCalculat(capa.atributs, estil.NomCampSel)))
					llista.push(estil.NomCampSel);
				else
					llista.push.apply(llista, DonaNomsCampsCapaDeAtributCalculat(i_capa, capa.atributs[i_calculat].FormulaConsulta));
			}
			if(estil.formes && estil.formes.length)
			{
				for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
				{
					forma=estil.formes[i_forma];
					if(forma.interior && forma.interior.NomCamp)
					{
						if(-1==(i_calculat=EsCampCalculat(capa.atributs, forma.interior.NomCamp)))
							llista.push(forma.interior.NomCamp);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAtributCalculat(i_capa, capa.atributs[i_calculat].FormulaConsulta));
					}
					if(forma.vora && forma.vora.NomCamp)
					{
						if(-1==(i_calculat=EsCampCalculat(capa.atributs, forma.vora.NomCamp)))
							llista.push(forma.vora.NomCamp);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAtributCalculat(i_capa, capa.atributs[i_calculat].FormulaConsulta));
					}
				}
			}
			if(estil.fonts && estil.fonts.NomCamp)
			{
				if(-1==(i_calculat=EsCampCalculat(capa.atributs, estil.fonts.NomCamp)))
					llista.push(estil.fonts.NomCamp);
				else
					llista.push.apply(llista, DonaNomsCampsCapaDeAtributCalculat(i_capa, capa.atributs[i_calculat].FormulaConsulta));
			}
		}
	}
	if(llista.length>1)
	{
		//Ordeno i elimino repetits
		llista.sort(sortAscendingStringSensible);
		llista.removeDuplicates(sortAscendingStringSensible);
	}
	return llista;
}

function DonaRequestGetFeature(i_capa, limit, env, cadena_objectes, completa)
{
var cdns=[], c_afegir="", capa=ParamCtrl.capa[i_capa], camps_implicats, i, tipus;

	tipus=DonaTipusServidorCapa(capa);
	if(tipus=="TipusOAPI_Features")
	{
		var plantilla=[];
		if(capa.URLTemplate)
			plantilla.push(capa.URLTemplate);
		else
			plantilla.push("/collections/{collectionId}/items");

		if(cadena_objectes && cadena_objectes.length==1)  // si n'hi ha més caldrà fer-ho d'una altra manera, tot i que crec que de moment mai usem aquesta opció de cadena_objectes
			plantilla.push("/", cadena_objectes[0], "?");
		else
			plantilla.push("?");
		var cp=plantilla.join("");
		cp=cp.replace("{collectionId}", capa.nom);
		cdns.push(cp);
		cdns.push("crs=", capa.CRSgeometrym,"&limit=", (limit && limit!=-1)? limit:"10000000","&f=");  //·$· hauria json i no application/json
		// ·$· en aquest cas el limit si se supera i no s'ha establert cap límit caldria continuar sol·licitant la petició amb next,...		
	}
	else
	{		
		cdns.push("VERSION=",DonaVersioComAText(capa.versio),"&SERVICE=WFS&REQUEST=GetFeature&ATRIBUTFORMAT=complex&SRSNAME=" ,
	          capa.CRSgeometry ,"&TYPENAME=" ,capa.nom);		
		if(limit && limit!=-1)
			cdns.push("&resultType=Hits");
		cdns.push("&OUTPUTFORMAT=");
	}
	if (capa.FormatImatge)
		cdns.push(capa.FormatImatge);
	else
		cdns.push("text/xml;subtype=gml/3.1.1/profiles/miramon/1.0.0/attributes");

	if(env)  //Està en el mateix sistema de referència que la capa
	{
		cdns.push("&BBOX=" , env.MinX , "," , env.MinY , "," , env.MaxX , "," , env.MaxY);
		if(completa==false)
		{
			if(tipus=="TipusOAPI_Features")	 //·$· Potser ha de ser més sofisticat i diferent en funció del format (json, gml,...)
				cdns.push("&PROPERTYNAME=" , capa.nom , "/geometry");
			else
				cdns.push("&PROPERTYNAME=" , capa.nom , "/gml:position");
			camps_implicats=DonaLlistaPropietatsSimbolitzacio(i_capa);
			for(i=0; i<camps_implicats.length; i++)
				if(camps_implicats[i] && camps_implicats[i]!="")
					cdns.push(",",capa.nom , "/", camps_implicats[i]);
		}
	}
	else if(cadena_objectes && tipus=="TipusWFS")
	{
		// NJ_28-09-2020: Sembla ser que per aquí no hi vinc mai , però de moment no ho elimino perquè potser és necessita per quan vull fer transaccions
		// Si això al final s''usa caldrà adaptar-ho per a TipusOAPI_Features
		cdns.push("&FEATUREID=",cadena_objectes.join(","));
		if(completa==false)
		{
			cdns.push("&PROPERTYNAME=");
			c_afegir="";
			for(i=0; i<camps_implicats.length; i++)
				if(camps_implicats[i] && camps_implicats[i]!="")
					cdns.c_afegir+=","+capa.nom + "/",+camps_implicats[i];
			for(var i_obj=0; i_obj<cadena_objectes.length; i_obj++)
				cdns.push("(", capa.nom , "/gml:position", c_afegir, ")");
		}
	}
	else if(completa==false)
	{
		if(tipus=="TipusOAPI_Features")	 //·$· Potser ha de ser més sofisticat i diferent en funció del format (json, gml,...)
			cdns.push("&PROPERTYNAME=" , capa.nom , "/geometry");
		else
			cdns.push("&PROPERTYNAME=" , capa.nom , "/gml:position");
		camps_implicats=DonaLlistaPropietatsSimbolitzacio(i_capa);
		for(i=0; i<camps_implicats.length; i++)
			if(camps_implicats[i] && camps_implicats[i]!="")
				cdns.push(",",capa.nom , "/", camps_implicats[i]);
	}
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}

function DonaRequestSOSGetFeatureOfInterest(i_capa, env)
{
var cdns=[];
var capa=ParamCtrl.capa[i_capa];

	cdns.push("VERSION=",DonaVersioComAText(capa.versio),"&SERVICE=SOS&REQUEST=GetFeatureOfInterest&observedProperty=", (capa.namespace ? capa.namespace + "/" + capa.nom + "/observedProperty" : capa.nom));
	if (env!=null)
	{
		var env2=null;
		if (!DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			env2=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry)
		else
			env2=env;
		cdns.push("&SRSNAME=",capa.CRSgeometry,"&BBOX=");
		if (CalGirarCoordenades(capa.CRSgeometry, null))
			cdns.push(env2.MinY,",",env2.MinX,",",env2.MaxY,",",env2.MaxX);
		else
			cdns.push(env2.MinX,",",env2.MinY,",",env2.MaxX,",",env2.MaxY);
	}
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}

function DonaRequestSTAFeaturesOfInterest(i_capa, limit, env)
{
	return DonaRequestSTAObservationsFeatureOfInterest(i_capa, limit, null, env);
}

function DonaRequestSTAObservationsFeatureOfInterest(i_capa, limit, i_obj, env)
{
var cdns=[], cdns_datastream=[];
var capa=ParamCtrl.capa[i_capa];

	cdns_datastream.push(",name;$expand=Thing($select=name)");
	if (capa.tipus=="TipusSTAplus")
		cdns_datastream.push(",Party($select=name),Project($select=name),License($select=description)");
	cdns.push("/v",DonaVersioComAText(capa.versio),"/FeaturesOfInterest");
	if (i_obj==null)
	{
		if(limit && limit!=-1)
			cdns.push("?$count=true&$top=",limit, "&");
		else
			cdns.push("?$top=10000000&"); // ·$· en aquest cas el limit si se supera i no s'ha establert cap límit caldria continuar sol·licitant la petició amb next,...		
	}
	else
	{
		if (capa.objectes.features[i_obj].id==+capa.objectes.features[i_obj].id)  //test if this is a number
			cdns.push("(", capa.objectes.features[i_obj].id, ")?");
		else
			cdns.push("('", capa.objectes.features[i_obj].id, "')?");
	}
	cdns.push("$select=feature,id&$expand=Observations($select=result,phenomenonTime,parameters;$expand=Datastream($select=unitOfMeasurement", cdns_datastream.join(""), ",ObservedProperty($select=name)),MultiDatastream($select=unitOfMeasurements", cdns_datastream.join(""), ",ObservedProperties($select=name)))");
	if (env!=null)
	{
		var env2=null;
		if (!DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			env2=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
		else
			env2=env;
		cdns.push("&$filter=st_within(feature,geography'POLYGON((", env2.MinX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MinY, "))')");
	}
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}

//i_obj pot ser null per demanar-los tots
//env està en el CRS actual
function DonaRequestGetObservation(i_capa, i_obj, env)
{
var cdns=[];
var capa=ParamCtrl.capa[i_capa];

	cdns.push("VERSION=",DonaVersioComAText(capa.versio),"&SERVICE=SOS&REQUEST=GetObservation&featureOfInterest=",
											capa.namespace, "/", capa.nom, "/featureOfInterest/", (i_obj==null ? "" : capa.objectes.features[i_obj].id));
	if (env!=null)
	{
		var env2=null;
		if (!DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			env2=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry)
		else
			env2=env;
		cdns.push("&SRSNAME=",capa.CRSgeometry,"&BBOX=");
		if (CalGirarCoordenades(capa.CRSgeometry, null))
			cdns.push(env2.MinY,",",env2.MinX,",",env2.MaxY,",",env2.MaxX);
		else
			cdns.push(env2.MinX,",",env2.MinY,",",env2.MaxX,",",env2.MaxY);
	}
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}

function FesPeticioAjaxObjectesDigitalitzatsPerEnvolupant(i_capa_digi, env, seleccionar)
{
var i_event, capa=ParamCtrl.capa[i_capa_digi];
	//ConsultaCapaDigi[i_consulta]=new CreaConsultaCapaDigi(i_capa_digi, -1, seleccionar);
	//env està en el CRS de la capa

	var url=DonaRequestOWSObjectesDigi(i_capa_digi, null, env, null, false);
	var tipus=DonaTipusServidorCapa(capa);

	if (tipus=="TipusWFS")
		i_event=CreaIOmpleEventConsola("GetFeature", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusOAPI_Features")
		i_event=CreaIOmpleEventConsola("OAPI_Features", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusSOS")
		i_event=CreaIOmpleEventConsola("GetFeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
		i_event=CreaIOmpleEventConsola("STA FeaturesOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusHTTP_GET")
		i_event=CreaIOmpleEventConsola("HTTP GET", i_capa_digi, url, TipusEventHttpGet);

	if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json" || tipus=="TipusSTA" || tipus=="TipusSTAplus")
		loadJSON(url, OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, {"i_capa_digi": i_capa_digi, "i_tile": -1, "env_sol": env, "seleccionar": seleccionar, "i_event": i_event});
	else
		loadFile(url, (capa.FormatImatge) ? capa.FormatImatge : "text/xml", OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, {"i_capa_digi": i_capa_digi, "i_tile": -1, "env_sol": env, "seleccionar": seleccionar, "i_event": i_event});
}//Fi de FesPeticioAjaxObjectesDigitalitzatsPerEnvolupant()

function FesPeticioAjaxObjectesDigitalitzatsPerIdentificador(i_capa_digi, cadena_objectes, seleccionar)
{
var i_event, capa=ParamCtrl.capa[i_capa_digi];

	//ConsultaCapaDigi[i_consulta]=new CreaConsultaCapaDigi(i_capa_digi, -1, seleccionar);

	var url=DonaRequestOWSObjectesDigi(i_capa_digi, null, cadena_objectes, false);
	var tipus=DonaTipusServidorCapa(capa);
	
	if (tipus=="TipusWFS")
		i_event=CreaIOmpleEventConsola("GetFeature", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusOAPI_Features")
		i_event=CreaIOmpleEventConsola("OAPI_Features", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusSOS")
		i_event=CreaIOmpleEventConsola("GetFeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusSTA" || capa.tipus=="TipusSTAplus")
		i_event=CreaIOmpleEventConsola("STA FeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);

	loadFile(url, (capa.FormatImatge) ? capa.FormatImatge : "text/xml", OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, {"i_capa_digi": i_capa_digi, "i_tile": -1, "seleccionar": seleccionar, "i_event": i_event});
}//Fi de FesPeticioAjaxObjectesDigitalitzatsPerIdentificador()

function FesPeticioAjaxObjectesDigitalitzats(i_capa_digi, i_tile, costat, i_col, j_fil, demana_objs, env_sol, seleccionar, funcio, param)
{
var i_event, capa=ParamCtrl.capa[i_capa_digi];

	if(i_tile!=null && i_tile!=-1)
	{		
		if(typeof capa.tileMatrixSetGeometry.tilesSol === "undefined" || capa.tileMatrixSetGeometry.tilesSol==null)
			capa.tileMatrixSetGeometry.tilesSol=[];
		if(i_tile>=capa.tileMatrixSetGeometry.tilesSol.length)
			capa.tileMatrixSetGeometry.tilesSol[i_tile]={"costat": costat, "iTile": i_col , "jTile": j_fil, "nombreObjectes": -1};

	}
	var tipus=DonaTipusServidorCapa(capa);	
	var url=DonaRequestOWSObjectesDigi(i_capa_digi, ((typeof capa.objLimit === "undefined" || i_tile==null  || i_tile==-1 || demana_objs) ? null: capa.objLimit), env_sol, null, false);
	if (tipus=="TipusWFS")
		i_event=CreaIOmpleEventConsola("GetFeature", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusOAPI_Features")
		i_event=CreaIOmpleEventConsola("OAPI_Features", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusSOS")
		i_event=CreaIOmpleEventConsola("GetFeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
		i_event=CreaIOmpleEventConsola("STA FeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusHTTP_GET")
		i_event=CreaIOmpleEventConsola("HTTP GET", i_capa_digi, url, TipusEventHttpGet);

	//env_sol està ja en el CRS de la capa
	if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json" || tipus=="TipusSTA" || tipus=="TipusSTAplus")
		loadJSON(url, OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats,
			 {i_capa_digi: i_capa_digi, i_tile: i_tile, env_sol: env_sol, seleccionar: seleccionar, i_event: i_event, funcio: funcio, param:param});
	else
		loadFile(url, (capa.FormatImatge) ? capa.FormatImatge : "text/xml", OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats,
			 {i_capa_digi: i_capa_digi, i_tile: i_tile, env_sol: env_sol, seleccionar: seleccionar, i_event: i_event, funcio: funcio, param:param});

}//Fi de FesPeticioAjaxObjectesDigitalitzats()


function DonaTileMatrixMesProperAZoomActual(capa)
{
var costat_actual=ParamInternCtrl.vista.CostatZoomActual;
var i_selec=0;

	if (DonaUnitatsCoordenadesProj(capa.CRSgeometry)=="m" && EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
		costat_actual=ParamInternCtrl.vista.CostatZoomActual*FactorGrausAMetres;
	else if (EsProjLongLat(capa.CRSgeometry) && DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamCtrl.ISituacioOri].EnvTotal.CRS)=="m")
		costat_actual=ParamInternCtrl.vista.CostatZoomActual/FactorGrausAMetres;
	else
		costat_actual=ParamInternCtrl.vista.CostatZoomActual;
	
	for(var i=0; i<capa.tileMatrixSetGeometry.tileMatrix.length;i++)
	{
		if (capa.tileMatrixSetGeometry.tileMatrix[i].costat<=costat_actual)		// Agafo el més proper per sota	
			i_selec=i;
	}
	return i_selec;
}

function DonaIndexTileDeCapaTileMatrixSetGeometry(capa, costat, i_col, j_fil)
{
	if(typeof capa.tileMatrixSetGeometry.tilesSol === "undefined" || capa.tileMatrixSetGeometry.tilesSol==null)
		return -1;
	
	for(var i=0; i<capa.tileMatrixSetGeometry.tilesSol.length; i++)
		if(capa.tileMatrixSetGeometry.tilesSol[i].costat>costat*0.9999 && 
			capa.tileMatrixSetGeometry.tilesSol[i].costat<costat*1.0001 &&
			capa.tileMatrixSetGeometry.tilesSol[i].iTile==i_col && 
			capa.tileMatrixSetGeometry.tilesSol[i].jTile==j_fil)
			return i;
	return -1;	
}
function DonaIndexTileMatrixVectorAPartirDeCostat(tileMatrix, costat)
{
	for(var i=0; i<tileMatrix.length;i++)
	{
		if(tileMatrix[i].costat>costat*0.9999 && tileMatrix[i].costat<costat*1.0001)
			return i;
	}
	return -1;	
}

function DemanaTilesDeCapaDigitalitzadaSiCal(capa, env, funcio, param)
{
var env_total, env_temp, env_sol;
var i_tessella_min, i_tessella_max, j_tessella_min, j_tessella_max, i_col, j_fil, i_tile=0;
var i_tileMatrix, tileMatrix, TMS;
var ha_calgut=false, vaig_a_carregar=false, demana_objs;

	if(typeof capa.tileMatrixSetGeometry=== "undefined" || capa.tileMatrixSetGeometry==null ||
	   typeof capa.tileMatrixSetGeometry.tileMatrix=== "undefined"|| capa.tileMatrixSetGeometry.tileMatrix==null || capa.tileMatrixSetGeometry.tileMatrix.length<1)
		return ha_calgut;
	
	// He de mirar quin tiles i en quin nivell de zoom cal sol·licitar
	if((typeof capa.objLimit !== "undefined") && capa.objLimit!=-1)
	{
		i_tileMatrix=DonaTileMatrixMesProperAZoomActual(capa)		
		if(i_tileMatrix==0)		
			demana_objs=true;
		else
			demana_objs=false;
	}
	else
	{
		// Només hi ha un nivell de zoom.
		i_tileMatrix=0;
		demana_objs=true;
	}
	TMS=capa.tileMatrixSetGeometry;
	tileMatrix=TMS.tileMatrix[i_tileMatrix];
	
	// Transformo l'envolupant de la vista a coordenades vector
	env_temp=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
	
	if(!param.carregant_geo)
	{
		param.carregant_geo=true;
		vaig_a_carregar=true;		
	}
	
	// Calculo els índexs de les tessel·les a demanar
	var incr_x=tileMatrix.TileWidth*tileMatrix.costat;
	var incr_y=tileMatrix.TileHeight*tileMatrix.costat;
	i_tessella_min=floor_DJ((env_temp.MinX-tileMatrix.TopLeftPoint.x)/incr_x);
	if(i_tessella_min<0)
    	i_tessella_min=0;
    else if(i_tessella_min>=tileMatrix.MatrixWidth)
    	i_tessella_min=tileMatrix.MatrixWidth-1;

	i_tessella_max=floor_DJ((env_temp.MaxX-tileMatrix.TopLeftPoint.x)/incr_x);
	if(i_tessella_max<0)
    	i_tessella_max=0;
    else if(i_tessella_max>=tileMatrix.MatrixWidth)
    	i_tessella_max=tileMatrix.MatrixWidth-1;

	j_tessella_min=floor_DJ((tileMatrix.TopLeftPoint.y-env_temp.MaxY)/incr_y);
	if(j_tessella_min<0)
    	j_tessella_min=0;
    else if(j_tessella_min>=tileMatrix.MatrixHeight)
    	j_tessella_min=tileMatrix.MatrixHeight-1;

	j_tessella_max=floor_DJ((tileMatrix.TopLeftPoint.y-env_temp.MinY)/incr_y);
	if(j_tessella_max<0)
    	j_tessella_max=0;
    else if(j_tessella_max>=tileMatrix.MatrixHeight)
    	j_tessella_max=tileMatrix.MatrixHeight-1;
	
	for(i_col=i_tessella_min; i_col<=i_tessella_max; i_col++)
	{
		for(j_fil=j_tessella_min; j_fil<=j_tessella_max; j_fil++)
		{				
			i_tile=DonaIndexTileDeCapaTileMatrixSetGeometry(capa, tileMatrix.costat, i_col, j_fil);
					
			if(i_tile==-1)
			{
				i_tile=(TMS.tilesSol) ? TMS.tilesSol.length : 0;
				env_sol={"MinX": tileMatrix.TopLeftPoint.x+(i_col*incr_x),
						"MaxX": tileMatrix.TopLeftPoint.x+((i_col+1)*incr_x),
						"MinY": tileMatrix.TopLeftPoint.y-((j_fil+1)*incr_y),
						"MaxY": tileMatrix.TopLeftPoint.y-(j_fil*incr_y)};
				if(vaig_a_carregar)
				{
					ha_calgut=true;
					FesPeticioAjaxObjectesDigitalitzats(ParamCtrl.capa.indexOf(capa), i_tile, tileMatrix.costat, i_col, j_fil, demana_objs, env_sol, false, funcio, param);					
				}
				else
					return true;
			}
		}
	}
	return ha_calgut;
}

function DemanaCSVPropietatsObjectesDeCapaDigitalitzadaSiCal(capa, env, funcio, param)
{
var env_total, env_temp, env_sol;
var ha_calgut=false, vaig_a_carregar=false;

	if(DonaTipusServidorCapa(capa)!="TipusHTTP_GET" || capa.FormatImatge!="text/csv" || !capa.objectes || !capa.objectes.features)
		return ha_calgut;
	
	// ·$· Potser es podria filtrar per env d'objecte i vista, però de moment no ho faig i ho demano per tots els objectes
	// Transformo l'envolupant de la vista a coordenades vector
	//env_temp=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
	
	if(!param.carregant_geo)
	{
		param.carregant_geo=true;
		vaig_a_carregar=true;		
	}
	var features=capa.objectes.features, feature;
	for(var i_obj=0; i_obj<features.length; i_obj++)
	{
		feature=features[i_obj];
		if(feature.propertiesSource && (!feature.properties || CountPropertiesOfObject(feature.properties)==0))
		{
			if(vaig_a_carregar)
			{
				ha_calgut=true;				
				param.i_capa=ParamCtrl.capa.indexOf(capa);
				param.i_event=CreaIOmpleEventConsola("HTTP GET", param.i_capa, feature.propertiesSource, TipusEventHttpGet);
				param.i_obj=i_obj;				
				param.func_after=funcio;
				param.func_error=ErrorCapaDigiAmbObjectesDigitalitzats;
				// no indico expressament el mimetype en aquest cas perquè he vist que no sempre respon com "text/csv" sino com "application/octet-stream" i fa que obtingui un error quan no és així
				loadFile(feature.propertiesSource, null, OmpleAtributsObjecteCapaDigiDesDeCadenaCSV, ErrorCapaDigiAmbObjectesDigitalitzats, param);
			}
			else
				return true;
		}
	}
	return ha_calgut;
}

var EnvSelec=null;

function SeleccionaObjsCapaDigiPerEnvolupant(id_capa, minx, maxx, miny, maxy, afegir)
{
var env={"MinX": minx, "MaxX": maxx, "MinY": miny, "MaxY": maxy};

	if(afegir==false)
		EsborraSeleccio();

	//Busco l'index de capa
	var i_capa=-1;
	if(ParamCtrl.capa)
	{
		for(var i=0; i<ParamCtrl.capa.length; i++)
			if(ParamCtrl.capa[i].model==model_vector && ParamCtrl.capa[i].nom==id_capa)
				i_capa=i;
	}
	if(i_capa==-1)
	{
		alert(GetMessage("CannotSelectObjectLayerNoExist", "vector") + ".");
		return;
	}
	if (!DonaCRSRepresentaQuasiIguals(ParamCtrl.capa[i_capa].CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
		env=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ParamCtrl.capa[i_capa].CRS);
	FesPeticioAjaxObjectesDigitalitzatsPerEnvolupant(i_capa, env, true);
}//Fi de SeleccionaObjsCapaDigiPerEnvolupant()


// Aquesta funció sembla ser que no s'usa enlloc (NJ 28-09-2020)
function SeleccionaObjsCapaDigiPerIdentificador(id_capa, id_obj, afegir)
{
var i_capa;
var punt, i;

	if(afegir==false)
		EsborraSeleccio();

	//Busco l'index de capa
	var i_capa=-1;
	if(ParamCtrl.capa)
	{
		for(var i=0; i<ParamCtrl.capa.length; i++)
			if(ParamCtrl.capa[i].nom==id_capa)
				i_capa=i;
	}
	if(i_capa==-1)
	{
		alert(GetMessage("CannotSelectObjectLayerNoExist", "vector"));
		return;
	}
	//Marco els objectes i els demano si cal
	var cadena_objectes=[], capa=ParamCtrl.capa[i_capa];
	if (capa.objectes && capa.objectes.features && capa.objectes.features.length>0)
	{
		for(var j=0; j<id_obj.length; j++)
		{
			for(i=0; i<capa.objectes.features.length; i++)
			{
				if(id_obj[j]==capa.objectes.features[i].id)
				{
					capa.objectes.features[i].seleccionat=true;

					//Actualitzar EnvSelec, que sempre està en el sistema de coordenades actual
					DonaCoordenadaPuntCRSActual(punt, capa.objectes.features[i], capa.CRSgeometry);
					if(EnvSelec==null)
						EnvSelec={"MinX": punt.x, "MaxX": punt.x, "MinY": punt.y, "MaxY": punt.y};
					else
					{
						if(punt.x<EnvSelec.MinX)
							EnvSelec.MinX=punt.x;
						if(punt.x>EnvSelec.MaxX)
							EnvSelec.MaxX=punt.x;
						if(punt.y<EnvSelec.MinY)
							EnvSelec.MinY=punt.y;
						if(punt.y>EnvSelec.MaxY)
							EnvSelec.MaxY=punt.y;
					}
					break;
				}
			}
			if(i==capa.objectes.features.length) //No trobat
				cadena_objectes[cadena_objectes.length]=id_obj[j];
		}
	}
	else
	{
		//Els demano tots
		for(var j=0; j<id_obj.length; j++)
			cadena_objectes[cadena_objectes.length]=id_obj[j];
	}
	//Faig la petició dels objectes no trobats
	if(cadena_objectes.length>0)
		FesPeticioAjaxObjectesDigitalitzatsPerIdentificador(i_capa, cadena_objectes, true);
}//Fi de SeleccionaObjsCapaDigiPerIdentificador()

function DonaMidaIconaForma(icona)
{
	if (icona.a)
	{
		if (icona.type=="square")
			return Math.sqrt(icona.a*icona.fescala);
		return Math.sqrt(icona.a*icona.fescala/Math.PI);
	}
	return icona.r*icona.fescala;
}

function DonaEnvIcona(punt, icona)
{
var env={}, mida;

	if (Array.isArray(icona))
	{
		env.MinI=MinJ=+1e300;
		env.MaxI=MaxJ=-1e300;
		for (var i=0; i<icona.length; i++)
		{
			mida=DonaMidaIconaForma(icona);
			if (icona[i].type=="circle")
			{
				if (env.MinI>-mida)
					env.MinI=-mida;
				if (env.MinJ>-mida)
					env.MinJ=-mida;
				if (env.MaxI<mida)
					env.MaxI=mida;
				if (env.MaxJ<mida)
					env.MaxJ=mida;
			}
			else if (icona.type=="square")
			{
				if (env.MinI>-mida/2)
					env.MinI=-mida/2;
				if (env.MinJ>-mida/2)
					env.MinJ=-mida/2;
				if (env.MaxI<mida/2)
					env.MaxI=mida/2;
				if (env.MaxJ<mida/2)
					env.MaxJ=mida/2;
			}
			else if (icona[i].type=="arc")
			{
				alert("DonaEnvIcona() does not implement 'arc' support yet");
			}
			else if (icona[i].type=="polyline")
			{
				for (var c=0; c<icona[i].coordinates.length; c++)
				{
					if (env.MinI>icona[i].coordinates[c][0])
						env.MinI=icona[i].coordinates[c][0];
					if (env.MinJ>icona[i].coordinates[c][1])
						env.MinJ=icona[i].coordinates[c][1];
					if (env.MaxI<icona[i].coordinates[c][0])
						env.MaxI=icona[i].coordinates[c][0];
					if (env.MaxJ<icona[i].coordinates[c][1])
						env.MaxJ=icona[i].coordinates[c][1];
				}
			}
		}
	}
	else if (icona.type=="circle")
	{
		mida=DonaMidaIconaForma(icona);
		env.MinI=-mida-icona.i;
		env.MinJ=-mida-icona.j;
		env.MaxI=mida-icona.i;
		env.MaxJ=mida-icona.j;
	}
	else if (icona.type=="square")
	{
		mida=DonaMidaIconaForma(icona);
		env.MinI=-mida/2-icona.i;
		env.MinJ=-mida/2-icona.j;
		env.MaxI=mida/2-icona.i;
		env.MaxJ=mida/2-icona.j;
	}
	else if (icona.icona) //Una icona com a url a una png o similar
	{
		env.MinI=-icona.i*icona.fescala;
		env.MaxI=(icona.ncol-icona.i)*icona.fescala;
		env.MinJ=-icona.j*icona.fescala;
		env.MaxJ=(icona.nfil-icona.j)*icona.fescala;
	}
	else
		env.MaxJ=env.MaxI=env.MinJ=env.MinI=0;

	if (icona.unitats=="m")
	{
		if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
		{
			env.MinI/=FactorGrausAMetres;
			env.MaxI/=FactorGrausAMetres;
			env.MinJ/=FactorGrausAMetres;
			env.MaxJ/=FactorGrausAMetres;
		}
		return {"MinX": punt.x+env.MinI,
			"MaxX": punt.x+env.MaxI,
			"MinY": punt.y-env.MaxJ,
			"MaxY": punt.y-env.MinJ};
	}
	return {"MinX": punt.x+env.MinI*ParamInternCtrl.vista.CostatZoomActual,
		"MaxX": punt.x+env.MaxI*ParamInternCtrl.vista.CostatZoomActual,
		"MinY": punt.y-env.MaxJ*ParamInternCtrl.vista.CostatZoomActual,
		"MaxY": punt.y-env.MinJ*ParamInternCtrl.vista.CostatZoomActual};
}

function TransformaCoordenadesFeatures(features, crs_ori, crs_dest)
{
	for(var j=0; j<features.length; j++)
	{
		var feature=features[j], coordinates2, coordinates3;
		feature.geometryCRSactual=JSON.parse(JSON.stringify(feature.geometry));
		if (feature.geometryCRSactual.type=="MultiPolygon")
		{
			for(var c3=0; c3<feature.geometryCRSactual.coordinates.length; c3++)
			{
				coordinates3=feature.geometryCRSactual.coordinates[c3];
				for(var c2=0; c2<coordinates3.length; c2++)
				{
					coordinates2=coordinates3[c2];
					for(var c1=0; c1<coordinates2.length; c1++)
						TransformaCoordenadesArray(coordinates2[c1], crs_ori, crs_dest);
				}
			}
		}
		else if (feature.geometryCRSactual.type=="MultiLineString" || feature.geometryCRSactual.type=="Polygon")
		{
			for(var c2=0; c2<feature.geometryCRSactual.coordinates.length; c2++)
			{
				coordinates2=feature.geometryCRSactual.coordinates[c2];
				for(var c1=0; c1<coordinates2.length; c1++)
					TransformaCoordenadesArray(coordinates2[c1],crs_ori, crs_dest);
			}
		}
		else if (feature.geometryCRSactual.type=="LineString" || feature.geometryCRSactual.type=="Multipoint")
		{
			for(var c1=0; c1<feature.geometryCRSactual.coordinates.length; c1++)
			{
				TransformaCoordenadesArray(feature.geometryCRSactual.coordinates[c1], crs_ori, crs_dest);
			}
		}
		else if (feature.geometryCRSactual.type=="Point")
			TransformaCoordenadesArray(feature.geometryCRSactual.coordinates, crs_ori, crs_dest);
		else
			feature.geometryCRSactual.coordinates=null;
	}
}

function CanviaCRSITransformaCoordenadesCapaDigi(capa, crs_dest)
{	
	if (capa.model==model_vector)
	{
		var hi_ha_objnums=false;
		if(capa.CRSgeometry &&
		   !DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, crs_dest) && ((capa.objectes && capa.objectes.features) || true==(hi_ha_objnums=HiHaObjectesNumerics(capa))))
		{
			if(capa.objectes && capa.objectes.features)
				TransformaCoordenadesFeatures(capa.objectes.features, capa.CRSgeometry, crs_dest);
			if(hi_ha_objnums)
			{
				for(var j=0; j<capa.tileMatrixSetGeometry.tileMatrix.length; j++)
				{
					if(capa.tileMatrixSetGeometry.tileMatrix.objNumerics &&  capa.tileMatrixSetGeometry.tileMatrix.objNumerics.features)
						TransformaCoordenadesFeatures(capa.tileMatrixSetGeometry.tileMatrix.objNumerics.features, capa.CRSgeometry, crs_dest);
				}
			}
		}
	}
}
