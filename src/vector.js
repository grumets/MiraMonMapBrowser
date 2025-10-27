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

    Copyright 2001, 2025 Xavier Pons

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
var origen_Things="Things", origen_FeaturesOfInterest="FeaturesOfInterest", origen_CellsFeaturesOfInterest="CellsFeaturesOfInterest", origen_CellsThings="CellsThings";
var nom_camp_nObjs_tessella="__nObjsTessella";
var mida_tessela_vec_defecte=256, STAtopValue=10000;

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
	if(i_tile_matrix!=-1 && typeof capa.tileMatrixSetGeometry.tileMatrix[i_tile_matrix].objNumerics!=="undefined" && 
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
var TMG, tiles, env_capa, tipus=DonaTipusServidorCapa(capa);

	if( typeof capa.tipus==="undefined" || capa.tipus==null ||
		typeof capa.model==="undefined" || capa.model!=model_vector ||
		tipus=="TipusHTTP_GET" ||
		((tipus=="TipusSTA" || tipus=="TipusSTAplus") && capa.origenAccesObjs==origen_CellsFeaturesOfInterest))  // En les capes de tipus HTTP_GET ja siguin JSON o CSV o STA/STAplus amb cel·les no tinc tessel·lació, de moment tinc una petició única per obtenir tot el fitxer
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
		{
			TMG.atriObjNumerics={};	
			TMG.atriObjNumerics[nom_camp_nObjs_tessella]={}; 
		}
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

// Fer sol·licitar la informació dels attributes d'un punt determinat
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

function OmpleAttributesObjecteCapaDigiDesDeWFS(objecte_xml, attributes, feature)
{
var attribute;
var atrib_coll_xml, atrib_xml, tag2, nom;

	// NJ_11_04_2024: Crec que de la manera que està programat només trobarà els attributs que venen d'un servidor del nostres, potser cal tocar alguna cosa i provar altres serveis WFS amb format XML	
	atrib_coll_xml=DonamElementsNodeAPartirDelNomDelTag(objecte_xml, "http://miramon.uab.cat/ogc/schemas/atribut", "mmatrib", "Atribut");
	if (!atrib_coll_xml || atrib_coll_xml.length==0)
		return;
	attributes={};  //Potser seria millor no esborrar-los cada cop però ara per ara ha quedat així
	for(var i=0; i<atrib_coll_xml.length; i++)
	{
		atrib_xml=atrib_coll_xml[i];
		//nom
		tag2=GetXMLChildElementByName(atrib_xml, '*', "nom");
		if(tag2 && tag2.hasChildNodes())
			nom=tag2.childNodes[0].nodeValue;
		else
			nom=i;

		attributes[nom]={};
		attribute=attributes[nom];

		//Primer miro si l'attribute és consultable
		attribute.mostrar=(atrib_xml.getAttribute('mostrar')=="false") ? "no": "si";

		//descripció
		tag2=GetXMLChildElementByName(atrib_xml, '*', "descripcio");
		if(tag2 && tag2.hasChildNodes())
			attribute.description=tag2.childNodes[0].nodeValue;
		//unitats
		tag2=GetXMLChildElementByName(atrib_xml, '*', "unitats");
		if(tag2 && tag2.hasChildNodes())
			attribute.UoM=tag2.childNodes[0].nodeValue;
		//separador
		tag2=GetXMLChildElementByName(atrib_xml, '*', "separador");
		if(tag2 && tag2.hasChildNodes())
		{
			attribute.separador=tag2.childNodes[0].nodeValue;
			attribute.separador=CanviaRepresentacioCaractersProhibitsXMLaCaractersText(attribute.separador);
		}
		//es link
		tag2=GetXMLChildElementByName(atrib_xml, '*', "esLink");
		if(tag2 && tag2.hasChildNodes() && tag2.childNodes[0].nodeValue=="true")
			attribute.esLink=true;
		//desc_link
		tag2=GetXMLChildElementByName(atrib_xml, '*', "descLink");
		if(tag2 && tag2.hasChildNodes())
			attribute.descLink=tag2.childNodes[0].nodeValue;
		//es imatge
		tag2=GetXMLChildElementByName(atrib_xml, '*', "esImatge");
		if(tag2 && tag2.hasChildNodes() && tag2.childNodes[0].nodeValue=="true")
			attribute.esImatge=true;
		//valor
		tag2=GetXMLChildElementByName(atrib_xml, '*', "valor");
		if(tag2 && tag2.hasChildNodes())
			feature.properties[nom]=tag2.childNodes[0].nodeValue;
	}
}


function OmpleAttributesObjecteCapaDigiDesDeGeoJSON(objecte_json, attributes, feature)
{

	if (!objecte_json.properties || CountPropertiesOfObject(objecte_json.properties)==0)
		return;

	feature.properties=objecte_json.properties;
}


function OmpleAttributesObjecteCapaDigiDesDeGeoJSONDeSOS(objecte_json, capa, feature)
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

function OmpleAttributesObjecteCapaDigiDesDeSOS(objecte_xml, capa, feature)
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

function OmpleAttributesObjecteCapaDigiDesDeObservacionsDeSTA(object, feature, capa)
{
	if( capa.origenAccesObjs==origen_Things)
		ExtreuTransformaSTAObservationsDeThing(object, feature, capa);
	else if( capa.origenAccesObjs==origen_CellsFeaturesOfInterest)
		ExtreuTransformaSTAObservationsDeCellsOfFeaturesOfInterest(object, feature, capa);
	else
		ExtreuTransformaSTAObservations(object, feature, capa); 	
}

function ParsejaCSVObjectesIPropietats(results, capa)
{
var wkt;

	if(!results || !results.data ||  results.data.length<1)
		return 0;
	if(!capa || !capa.configCSV || !capa.configCSV.nomCampGeometria)
		return 0;
	
	// Camp geometria
	// Puc tenir un camp geometria o bé dos camps x,y
	if(typeof capa.configCSV.nomCampGeometria==="string")
	{
		wkt = new Wkt.Wkt();
	}
	else if(typeof capa.configCSV.nomCampGeometria==="object" && 
		capa.configCSV.nomCampGeometria.x && capa.configCSV.nomCampGeometria.y)
	{
		wkt=null;
	}
	else
	{
		// tipus desconegut
		return 0;
	}
	
	if(!capa.objectes)
		capa.objectes={"type": "FeatureCollection", "features": []};
	
	// Camp multitime
	if(capa.configCSV.nomCampDateTime)
	{
		if(!capa.data)
		{
			capa.data=[];
			capa.AnimableMultiTime=true;
		}
	}
	
	var rows=results.data, i_row, row, i_atrib, i_obj, i_data=-1, data_iso, wkt_obj, x, y, geometria, feature, 
			attributesArray=capa.attributes ? Object.keys(capa.attributes): null,
			attributesRowArray;
	
	if(!capa.attributes)
		capa.attributes={};
	
	// cada fila del csv és un objecte amb les seves propietats
	for(i_row=0; i_row<rows.length; i_row++)
	{
		row=rows[i_row];
		geometria=null;
		if(wkt)
		{
			wkt_obj=row[capa.configCSV.nomCampGeometria];
			if(wkt_obj)
			{
				wkt.read(wkt_obj);
				geometria=wkt.toJson();
			}
		}
		else
		{		
			x=parseFloat(row[capa.configCSV.nomCampGeometria.x]);
			y=parseFloat(row[capa.configCSV.nomCampGeometria.y]);
			if(x && y || (x==0 || y==0))
			{
				geometria={"type": "Point", "coordinates": [x, y]};			
			}
		}				
		if(geometria)
		{
			// ·$· no faig cap transformació de les coordenades m'en refio del que s'ha documentat a CRSGeometry
			i_obj=capa.objectes.features.push({type: "Feature",
										geometry: geometria,
										properties: {}})-1;
										
			if(capa.configCSV.nomCampDateTime)
			{
				data_iso=row[capa.configCSV.nomCampDateTime];			
				i_data=InsereixDataISOaCapa(data_iso, capa.data);
			}
			if(attributesArray)
			{				
				for(i_atrib=0; i_atrib<attributesArray.length; i_atrib++)
				{
					if(capa.attributes[attributesArray[i_atrib]].originalName)
						capa.objectes.features[i_obj].properties[CanviaVariablesDeCadena(attributesArray[i_atrib], capa, i_data, null)]=row[capa.attributes[attributesArray[i_atrib]].originalName];
					else
						capa.objectes.features[i_obj].properties[CanviaVariablesDeCadena(attributesArray[i_atrib], capa, i_data, null)]=row[capa.attributes[attributesArray[i_atrib]]];
				}	
			}
			else
			{
				attributesRowArray=Object.keys(row);
				for(i_atrib=0; i_atrib<attributesRowArray.length; i_atrib++)
				{
					if((wkt && attributesRowArray[i_atrib]!=capa.configCSV.nomCampGeometria) ||  
						(!wkt && attributesRowArray[i_atrib]!=capa.configCSV.nomCampGeometria.x && 
									attributesRowArray[i_atrib]!=capa.configCSV.nomCampGeometria.y))
					{
						capa.objectes.features[i_obj].properties[attributesRowArray[i_atrib]]=row[attributesRowArray[i_atrib]];
						
						if(!capa.attributes[attributesRowArray[i_atrib]])
							capa.attributes[attributesRowArray[i_atrib]]={originalName:attributesRowArray[i_atrib], descripcio : attributesRowArray[i_atrib], mostrar: true};
					}
				}
			}
		}
	}
	return 1;
}

function ProcessaResultatLecturaCSVObjectesIPropietats(results)
{
var param=this;

	if(!results || !results.data ||  results.data.length<1)
	{
		if(param.func_error)
			param.func_error(results, param);
		return;
	}	
	var capa=ParamCtrl.capa[param.i_capa];
	if(0==ParsejaCSVObjectesIPropietats(results, capa))
	{
		if(param.func_error)
			param.func_error(results, param);
		return;
	}
	CanviaEstatEventConsola(null, param.i_event, EstarEventTotBe);
	if(param.func_after)
		param.func_after(param);
}


function ProcessaResultatLecturaCSVPropietatsObjecte(results)
{
	var param=this;
	if(!results || !results.data ||  results.data.length<1)
	{
		if(param.func_error)
			param.func_error(results, param);
		return;
	}	
	var capa=ParamCtrl.capa[param.i_capa], feature=capa.objectes.features[param.i_obj], rows=results.data, i_row, i_atrib;
	
	if(!feature.properties)
		feature.properties={};
	var attributesArray=Object.keys(capa.attributes); 
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
			for(i_atrib=0; i_atrib<attributesArray.length; i_atrib++)
			{
				if(capa.attributes[attributesArray[i_atrib]].originalName)
					feature.properties[CanviaVariablesDeCadena(attributesArray[i_atrib], capa, i_data, null)]=rows[i_row][capa.attributes[attributesArray[i_atrib]].originalName];
			}			
		}
	}
	else
	{
		for(i_row=0; i_row<rows.length; i_row++)
		{
			for(i_atrib=0; i_atrib<attributesArray.length; i_atrib++)
			{
				if(capa.attributes[attributesArray[i_atrib]].originalName)
					feature.properties[attributesArray[i_atrib]]=rows[i_row][capa.attributes[attributesArray[i_atrib]].originalName];
			}	
		}
	}
	CanviaEstatEventConsola(null, param.i_event, EstarEventTotBe);
	if(param.func_after)
		param.func_after(param);
}

function OmpleAttributesObjecteCapaDigiDesDeCadenaCSV(doc, param)
{
	if(!doc)
	{
		if(param.func_error)
			param.func_error(null, param);
		return;
	}
	
	var capa=ParamCtrl.capa[param.i_capa];
	
	// Si enlloc d'una cadena csv tinc un fitxer, cal que afegeixi al config del parse 
	// download: true,
	Papa.parse(doc, {
				header: (capa.configCSV && capa.configCSV.header) ? capa.configCSV.header : true,
				encoding: (capa.configCSV && capa.configCSV.encoding) ? capa.configCSV.encoding : "",
				delimiter: (capa.configCSV && capa.configCSV.separadorCamps) ? capa.configCSV.separadorCamps :  "",
				complete: ProcessaResultatLecturaCSVPropietatsObjecte.bind(param),				
				});		
}

function OmpleObjectesIAttributesCapaDigiDesDeCadenaCSV(doc, param)
{
	if(!doc)
	{
		if(param.func_error)
			param.func_error(null, param);
		return;
	}
	
	var capa=ParamCtrl.capa[param.i_capa];
	
	// Si enlloc d'una cadena csv tinc un fitxer, cal que afegeixi al config del parse 
	// download: true,
	Papa.parse(doc, {
				header: (capa.configCSV && capa.configCSV.header) ? capa.configCSV.header : true,
				encoding: (capa.configCSV && capa.configCSV.encoding) ? capa.configCSV.encoding : "",
				delimiter: (capa.configCSV && capa.configCSV.separadorCamps) ? capa.configCSV.separadorCamps :  "",
				complete: ProcessaResultatLecturaCSVObjectesIPropietats.bind(param),				
				});		
}

function ErrorCapaDigiAmbPropietatsObjecteDigitalitzat(doc, consulta)
{
	removeLayer(getLayer(consulta.win,"LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_zone_level+"_"+consulta.i_obj));
	NConsultesDigiZero++;
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
}


function MostraConsultaDeCapaDigiAmbPropietatsObjecteDigitalitzat(consulta)
{
var capa=ParamCtrl.capa[consulta.i_capa];
var nom_layer="LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_zone_level+"_"+consulta.i_obj;

	if(consulta.i_zone_level!=-1)
	{
		if(!capa.cellZoneLevelSet || !capa.cellZoneLevelSet.zoneLevels[consulta.i_zone_level].cells || 
			!capa.cellZoneLevelSet.zoneLevels[consulta.i_zone_level].cells.features[consulta.i_obj].properties || 
			CountPropertiesOfObject(capa.cellZoneLevelSet.zoneLevels[consulta.i_zone_level].cells.features[consulta.i_obj].properties)==0)
		{
			removeLayer(getLayer(consulta.win, nom_layer));
			NConsultesDigiZero++;
			return;
		}
	}
	else if (!capa.objectes || !capa.objectes.features ||
		!capa.objectes.features[consulta.i_obj].properties || CountPropertiesOfObject(capa.objectes.features[consulta.i_obj].properties)==0)
	{
		removeLayer(getLayer(consulta.win, nom_layer));
		NConsultesDigiZero++;
		return;
	}
	var text_resposta=MostraConsultaCapaDigitalitzadaComHTML(consulta.i_capa, consulta.i_zone_level, consulta.i_obj, true, true);
	if(!text_resposta || text_resposta=="")
	{
		removeLayer(getLayer(consulta.win, nom_layer));
		NConsultesDigiZero++;
	}
	else
	{
		contentLayer(getLayer(consulta.win, nom_layer), text_resposta);
		
		// Determino si cal pintar sèries temporals, no ho puc fer abans perquè fins que no he omplert la layer de la consulta no tinc el canvas on he
		// de pintar la sèrie creat
		// De moment només ho canvio per els serveis STA, no sé si també caldrà fer-ho per altres tipus de capes
		var tipus=DonaTipusServidorCapa(capa);
		if(capa.attributes && (tipus=="TipusSTA" || tipus=="TipusSTAplus"))
		{
			var attributesArray=Object.keys(capa.attributes);
			for (var a=0; a<attributesArray.length; a++)
			{
				if(capa.attributes[attributesArray[a]].serieTemporal)
					MostraGraficSerieTemporalAttribute(consulta.win, "canvas_cnsl_serie_" + consulta.i_capa + "_" + consulta.i_zone_level+"_"+consulta.i_obj + "_" + a, consulta.i_capa, consulta.i_zone_level, consulta.i_obj, a);
			}
		}
	}
	return;
}

function OmpleCapaDigiAmbPropietatsObjecteDigitalitzat(doc, consulta)
{
var root, id_obj_buscat, i_obj, capa, tipus, valor, features, objectes, objecte_xml, foi_xml, nom_layer="LayerObjDigiConsulta"+consulta.i_capa+"_"+consulta.i_zone_level+"_"+consulta.i_obj;

	if(!doc)
	{
		removeLayer(getLayer(consulta.win, nom_layer));
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
			removeLayer(getLayer(consulta.win, nom_layer));
			NConsultesDigiZero++;
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return;
		}
	}

	
	tipus=DonaTipusServidorCapa(capa);
	if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
	{
		features=capa.objectes.features;
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
				removeLayer(getLayer(consulta.win, nom_layer));
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
						OmpleAttributesObjecteCapaDigiDesDeGeoJSON(objectes[i_obj], capa.attributes, capa.objectes.features[consulta.i_obj]);
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
							OmpleAttributesObjecteCapaDigiDesDeWFS(objectes[i_obj], capa.attributes, capa.objectes.features[consulta.i_obj]);
							break;
						}
					}
				}
			}
		}
	}
	else if (tipus=="TipusSOS")
	{
		features=capa.objectes.features;
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
				removeLayer(getLayer(consulta.win, nom_layer));
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
						OmpleAttributesObjecteCapaDigiDesDeGeoJSONDeSOS(objectes[i_obj], capa, capa.objectes.features[consulta.i_obj]);
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
							OmpleAttributesObjecteCapaDigiDesDeSOS(objecte_xml, capa, capa.objectes.features[consulta.i_obj]);
							break;
						}
					}
				}
			}
		}
	}
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
	{
		// NJ_13_02_2025: Això ara ja no ho tinc perquè estic demanat Observacions d'una feature concreta
		//id_obj_buscat=features[consulta.i_obj].id;
		
		//try {
		//	var geojson=JSON.parse(doc);
			//si hi ha una bbox es podria actualitzar però com que no la uso...
		/*}
		catch (e) {
			removeLayer(getLayer(consulta.win, nom_layer));
			NConsultesDigiZero++;
			CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
			return;
		}*/
		if(doc)
		{
			var object, feature;
			if( capa.origenAccesObjs==origen_Things)
			{
				object=doc; // quan arribo aquí és que vull les observacions d'una thing concreta, però com que he de passar pels datastreams i els multidatastreams, ho demano a través de things
				feature=capa.objectes.features[consulta.i_obj];
			}
			else if( capa.origenAccesObjs==origen_CellsFeaturesOfInterest)
			{
				object=doc.value;
				feature=capa.cellZoneLevelSet.zoneLevels[consulta.i_zone_level].cells.features[consulta.i_obj];
			}
			else
			{
				object=doc.value;
				feature=capa.objectes.features[consulta.i_obj];
			}
			if(!object)
			{
				removeLayer(getLayer(consulta.win, nom_layer));
				NConsultesDigiZero++;
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
				return;
			}
			OmpleAttributesObjecteCapaDigiDesDeObservacionsDeSTA(object, feature, capa);
		}
	}
	else if(tipus=="TipusHTTP_GET" && capa.FormatImatge=="text/csv")
	{
		; //Si vinc aquí és que ja he passat per OmpleAttributesObjecteCapaDigiDesDeCadenaCSV(), però en principi no hi he de venir mai per aquest tipus
	}	
	MostraConsultaDeCapaDigiAmbPropietatsObjecteDigitalitzat(consulta);
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
}


function DescarregaPropietatsCapaDigiVistaSiCalCallBack(doc, consulta)
{
var capa_digi=ParamCtrl.capa[consulta.param.i_capa];

	// Carrega la informació sobre els objectes consultats
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
		// Només vàlid per a fitxers de punts.
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
				if (CountPropertiesOfObject(capa.objectes.features[j].properties)<DonaNombrePropietatsSimbolitzacio(param.i_capa))
				//if (CountPropertiesOfObject(capa.objectes.features[j].properties)==0)  //No hi ha propietats carregades
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
		if(capa.origenAccesObjs==origen_Things)
			url=DonaRequestSTAThings(param.i_capa, null, ParamInternCtrl.vista.EnvActual);
		else if(capa.origenAccesObjs==origen_CellsFeaturesOfInterest)
			url=DonaRequestSTACellsFeaturesOfInterest(param.i_capa, null, ParamInternCtrl.vista.EnvActual);
		else
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
						OmpleAttributesObjecteCapaDigiDesDeGeoJSON(objectes[i_obj_llegit], capa.attributes, features[i_obj]);
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
							OmpleAttributesObjecteCapaDigiDesDeWFS(objectes[i_obj_llegit], capa.attributes, features[i_obj]);
					}
				}
			}
		}
	}
	else if (tipus=="TipusSOS")
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
						OmpleAttributesObjecteCapaDigiDesDeGeoJSONDeSOS(objectes[i_obj_llegit], capa, features[i_obj]);
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
								OmpleAttributesObjecteCapaDigiDesDeSOS(objecte_xml, capa, features[i_obj], capa.data);
						}
					}
				}
			}
		}
	}
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
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
				//·$· Aquí cal fer bifurcacions segons si origen és Things, Features o Cells
				i_obj=features.binarySearch({"id":doc[i_obj_llegit]["@oit.id"]}, ComparaObjCapaDigiIdData);
				if (i_obj>=0)
					OmpleAttributesObjecteCapaDigiDesDeObservacionsDeSTA(doc[i_obj_llegit].Observations, features[i_obj], capa);
			}
		}
	}
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
	return 0;
}

function AddPropertyAndTime(capa, attributeArray, prop, i_data, obsProp, uom, value)
{
var key, i;

	// Agafo el nom de la propietat que em vé de les observacions
	if (obsProp && obsProp.name)
		key=obsProp.name;
	else if(uom)
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
			for (i=0; i<key.length; i++)
			{
				if (!isalnum(key.charAt(i)))
					key=key.substring(0, i) + "_" + key.substring(i+1);
			}
		}
	}
	if (i_data!=null && attributeArray!=null)
	{
		// Intento trobar l'equivalent a l'array d'attributes de la capa si hi ha temps, sinó ho inserto directament
		var index, attribute;		
		
		for(i=0; i<attributeArray.length; i++)
		{
			if(-1!=(index=attributeArray[i].indexOf("{")))
				attribute=attributeArray[i].slice(0,index);
			else
				attribute=attributeArray[i];
				
			if(attribute==key)
				break;			
		}
		if(i<attributeArray.length)
			prop[CanviaVariablesDeCadena(attributeArray[i], capa, i_data, null)]=value;
		else
			prop[key]=value;
	}
	else
		prop[key]=value;
}

function ExtreuTransformaSTAObservations(obs, feature, capa)
{
var ob, prop={}, nom_param, ds, es_serie_temporal, i_data, attributeArray=Object.keys(capa.attributes), phenomenonTime, final;
	
	if(HiHaAlgunaSerieTemporal(capa) || (capa.data && capa.data.length) || obs.length>1)
		es_serie_temporal=true;
	else 
		es_serie_temporal=false;
	if(es_serie_temporal)
	{		
		if(!capa.data)
		{
			capa.data=[];
			capa.AnimableMultiTime=true;
		}
		if(!feature.data)
			feature.data=[];
	}

	for (var i=0; i<obs.length; i++)
	{
		ob=obs[i];
		i_data=null;
		if (ob.phenomenonTime)
		{
			final=ob.phenomenonTime.indexOf('/');
			if(final!=-1)
				phenomenonTime=ob.phenomenonTime.substring(0, final);
			else
				phenomenonTime=ob.phenomenonTime;
			if(es_serie_temporal)
			{
				InsereixDataISOaCapa(phenomenonTime, feature.data);
				i_data=InsereixDataISOaCapa(phenomenonTime, capa.data);
			}			
			//prop["time"]=ob.phenomenonTime;
			AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"time"}, null, ob.phenomenonTime);				
		}
		if (ob.parameters)
		{
			for (nom_param in ob.parameters)
			{
				if (ob.parameters.hasOwnProperty(nom_param) && typeof ob.parameters[nom_param]!=="object")
				{
					//prop[nom_param]=ob.parameters[nom_param];
					AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:nom_param}, null, ob.parameters[nom_param]);					
				}
			}
		}
		
		// NJ_16-10-2024: M'he trobat en casos que tinc les dues coses MultiDatastream i Datastream, i potser que una de les dues
		// estigui buida i per tant peta!!
		if (ob.MultiDatastream && 
			ob.MultiDatastream.ObservedProperties && ob.MultiDatastream.ObservedProperties.length>0 && 
			ob.MultiDatastream.unitOfMeasurements && ob.MultiDatastream.unitOfMeasurements.length>0)
		{
			for (var j=0; j<ob.MultiDatastream.unitOfMeasurements.length; j++)
				AddPropertyAndTime(capa, attributeArray, prop, i_data, ob.MultiDatastream.ObservedProperties[j], ob.MultiDatastream.unitOfMeasurements[j], ob.result[j]);
			ds=ob.MultiDatastream;
		}
		else if (ob.Datastream)
		{
			AddPropertyAndTime(capa, attributeArray, prop, i_data, ob.Datastream.ObservedProperty, ob.Datastream.unitOfMeasurement, ob.result);				
			ds=ob.Datastream;
		}
		if (ds.Thing && ds.Thing.name)
		{
			//prop["thing"]=ds.Thing.name;
			AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"thing"}, null, ds.Thing.name);
		}
		/*if (ds.Party && ds.Party.name)
			prop["party"]=ds.Party.name;*/
		if (ds.Party && ds.Party.displayName)
		{
			//prop["party"]=ds.Party.displayName;
			AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"party"}, null, ds.Party.displayName);
		}
		if (ds.Project && ds.Project.name)
		{
			//prop["project"]=ds.Project.name;
			AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"project"}, null, ds.Project.name);
		}
		if (ds.License && ds.License.description)
		{
			//prop["license"]=ds.License.description;
			AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"license"}, null, ds.License.description);
		}
	}
	feature.properties=prop;
}

function ExtreuTransformaSTAObservationsDeThing(thing, feature, capa)
{
var i, j, ds, obs, ob, prop={}, nom_param, es_serie_temporal, i_data, attributeArray=Object.keys(capa.attributes), phenomenonTime, final;

	if(HiHaAlgunaSerieTemporal(capa) || (capa.data && capa.data.length))
		es_serie_temporal=true;
	else 
		es_serie_temporal=false;
	if (thing.name)
		AddPropertyAndTime(capa, attributeArray, prop, null, {name:"thing"}, null, thing.name);
	if (thing.Party && thing.Party.displayName)
		AddPropertyAndTime(capa, attributeArray, prop, null, {name:"party"}, null, thing.Party.displayName);
	if (thing.Project && thing.Project.name)
		AddPropertyAndTime(capa, attributeArray, prop, null, {name:"project"}, null, thing.Project.name);
	if (thing.License && thing.License.description)
		AddPropertyAndTime(capa, attributeArray, prop, null, {name:"license"}, null, thing.License.description);
	
	/* NJ: Això no ho puc fer en el cas de les sèries temporals
	Suposo que ho vaig fer per tenir el camp definit encara que fós a null per la simbolització
	però ara em dona problemes amb les sèries.
	Si cal ho he de corregir en la simbolització.
	if(attributeArray)
	{
		// Creo les propietats involucrades en la simbolització encara que siguin buides
		var camps_implicats=DonaLlistaPropietatsSimbolitzacio(ParamCtrl.capa.indexOf(capa));	
		if(camps_implicats)
		{
			for(i=0; i<camps_implicats.length; i++)
			{
				AddPropertyAndTime(capa, attributeArray, prop, null, {name:camps_implicats[i]}, null, null);
			}
		}
	}*/
	if(thing.Datastreams)
	{
		for (i=0; i<thing.Datastreams.length; i++)
		{
			ds=thing.Datastreams[i];
			obs=ds.Observations;
			i_data=null;
			if(obs.length>1 && !es_serie_temporal)
				es_serie_temporal=true;
			if(es_serie_temporal)
			{
				if(!capa.data)
				{
					capa.data=[];
					capa.AnimableMultiTime=true;
				}
				if(!feature.data)
					feature.data=[];
			}
			
			for (j=0; j<obs.length; j++)
			{
				ob=obs[j];
				i_data=null;
				if (ob.phenomenonTime)
				{
					final=ob.phenomenonTime.indexOf('/');
					if(final!=-1)
						phenomenonTime=ob.phenomenonTime.substring(0, final);
					else
						phenomenonTime=ob.phenomenonTime;
					if(es_serie_temporal)
					{
						InsereixDataISOaCapa(phenomenonTime, feature.data);
						i_data=InsereixDataISOaCapa(phenomenonTime, capa.data);
					}			
					//prop["time"]=ob.phenomenonTime;
					AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"time"}, null, ob.phenomenonTime);				
				}
				if (ob.parameters)
				{
					for (nom_param in ob.parameters)
					{
						if (ob.parameters.hasOwnProperty(nom_param) && typeof ob.parameters[nom_param]!=="object")
						{
							//prop[nom_param]=ob.parameters[nom_param];
							AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:nom_param}, null, ob.parameters[nom_param]);					
						}
					}
				}
				AddPropertyAndTime(capa, attributeArray, prop, i_data, ds.ObservedProperty, ob.unitOfMeasurement, ob.result);
			}
		}
	}
	if(thing.MultiDatastreams)
	{
		for (i=0; i<thing.MultiDatastreams.length; i++)
		{
			ds=thing.MultiDatastreams[i];
			obs=ds.Observations;
			i_data=null;
			if(obs.length>1 && !es_serie_temporal)
			{		
				es_serie_temporal=true;
			}
			if(es_serie_temporal)
			{
				if(!capa.data)
				{
					capa.data=[];
					capa.AnimableMultiTime=true;
				}
				if(!feature.data)
					feature.data=[];
			}
			
			for (j=0; j<obs.length; j++)
			{
				ob=obs[j];
				i_data=null;
				if (ob.phenomenonTime)
				{
					final=ob.phenomenonTime.indexOf('/');
					if(final!=-1)
						phenomenonTime=ob.phenomenonTime.substring(0, final);
					else
						phenomenonTime=ob.phenomenonTime;
					if(es_serie_temporal)
					{
						InsereixDataISOaCapa(phenomenonTime, feature.data);
						i_data=InsereixDataISOaCapa(phenomenonTime, capa.data);
					}			
					//prop["time"]=ob.phenomenonTime;
					AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"time"}, null, ob.phenomenonTime);				
				}
				if (ob.parameters)
				{
					for (nom_param in ob.parameters)
					{
						if (ob.parameters.hasOwnProperty(nom_param) && typeof ob.parameters[nom_param]!=="object")
						{
							//prop[nom_param]=ob.parameters[nom_param];
							AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:nom_param}, null, ob.parameters[nom_param]);					
						}
					}
				}
				if (ds.ObservedProperties && ds.ObservedProperties.length>0 && 
					ds.unitOfMeasurements && ds.unitOfMeasurements.length>0 
					&& ds.ObservedProperties.length==ds.unitOfMeasurements.length)
				{
					for (var k=0; k<ds.unitOfMeasurements.length; k++)
						AddPropertyAndTime(capa, attributeArray, prop, i_data, ds.ObservedProperties[k], ds.unitOfMeasurements[k], ob.result[k]);
				}
			}
		}
	}
	feature.properties=prop;
}

function ExtreuTransformaSTAObservationsDeCellsOfFeaturesOfInterest(cell, feature, capa)
{
var i, j, ds, obs, ob, prop={}, es_serie_temporal, i_data, attributeArray=Object.keys(capa.attributes), phenomenonTime, final;

	if(HiHaAlgunaSerieTemporal(capa) || (capa.data && capa.data.length) || obs.length>1)
		es_serie_temporal=true;
	else 
		es_serie_temporal=false;
	
	if (cell.name)
		AddPropertyAndTime(capa, attributeArray, prop, null, {name:"cell"}, null, cell.name);
	if (cell.zoneId)
		AddPropertyAndTime(capa, attributeArray, prop, null, {name:"zoneId"}, null, cell.zoneId);
	if (cell.zoneLevel)
		AddPropertyAndTime(capa, attributeArray, prop, null, {name:"zoneLevel"}, null, cell.zoneLevel);
	
	/*if(attributeArray)
	{
		// Creo les propietats involucrades en la simbolització encara que siguin buides
		var camps_implicats=DonaLlistaPropietatsSimbolitzacio(ParamCtrl.capa.indexOf(capa));	
		if(camps_implicats)
		{
			for(i=0; i<camps_implicats.length; i++)
			{
				AddPropertyAndTime(capa, attributeArray, prop, null, {name:camps_implicats[i]}, null, null);
			}
		}
	}*/
	if(cell.MultiDatastreams)
	{
		for (i=0; i<cell.MultiDatastreams.length; i++)
		{
			ds=cell.MultiDatastreams[i];
			obs=ds.Observations;
			
			if(obs.length>1 && !es_serie_temporal)
				es_serie_temporal=true;
			if(es_serie_temporal)
			{
				if(!capa.data)
				{
					capa.data=[];
					capa.AnimableMultiTime=true;
				}
				if(!feature.data)
					feature.data=[];
			}
			
			for (j=0; j<obs.length; j++)
			{
				ob=obs[j];
				i_data=null;
				if (ob.phenomenonTime)
				{
					final=ob.phenomenonTime.indexOf('/');
					if(final!=-1)
						phenomenonTime=ob.phenomenonTime.substring(0, final);
					else
						phenomenonTime=ob.phenomenonTime;
					if(es_serie_temporal)
					{
						InsereixDataISOaCapa(phenomenonTime, feature.data);
						i_data=InsereixDataISOaCapa(phenomenonTime, capa.data);
					}			
					//prop["time"]=ob.phenomenonTime;
					AddPropertyAndTime(capa, attributeArray, prop, i_data, {name:"time"}, null, ob.phenomenonTime);				
				}
				AddPropertyAndTime(capa, attributeArray, prop, i_data, ds.ObservedProperty, ob.unitOfMeasurement, ob.result);
			}
		}
	}
	feature.properties=prop;
}

function ExtreuITransformaSTACells(fois, capa)
{
var features=[], una_feature, foi, prop={}, zoneId, bbox;

	if(fois.value)
	for (var i=0; i<fois.value.length; i++)
	{
		foi=fois.value[i];		
		zoneId=foi["zoneId"];
		bbox=ngeohash_decode_bbox(zoneId); // bbox=[minLat, minLon, maxLat, maxLon];
		una_feature={type: "Feature",
					id: foi["@iot.id"],
					geometry: {
						type: "Polygon",
						coordinates: [[[bbox[1],bbox[0]],[bbox[3],bbox[0]],[bbox[3],bbox[2]],[bbox[1],bbox[2]],[bbox[1],bbox[0]]]]
					},
					properties: {}};
					
		ExtreuTransformaSTAObservationsDeCellsOfFeaturesOfInterest(foi, una_feature, capa);
		features.push(una_feature);
	}
	return features;
}

function AddUnSTAfeature(foi, capa)
{
	if(!foi)
		return null;
	var una_feature;
	if (foi.feature.type=="Feature")
	{
		una_feature=JSON.parse(JSON.stringify(foi.feature));
		una_feature.id=foi["@iot.id"];
		una_feature.properties={};
	}
	else
	{
		//Following https://developers.sensorup.com/docs/#featureOfInterest_post a STA feature is actually a geometry.
		una_feature={type: "Feature",
				id: foi["@iot.id"],
				geometry: foi.feature,
				properties: {}};
	}
	ExtreuTransformaSTAObservations(foi, una_feature, capa); // Per si s'ha demanat propietats per simbolització
	return una_feature;
}
						
function ExtreuUnaSTAthing(foi, capa)
{
	if(!foi)
		return null;
	var una_feature={type: "Feature",
				id: foi["@iot.id"],
				geometry: foi.Locations[0].location,
				properties: {}};
	ExtreuTransformaSTAObservationsDeThing(foi, una_feature, capa); // Per si s'ha demanat propietats per simbolització
	return una_feature;
}

function ExtreuITransformaSTAfeatures(fois, capa)
{
var features=[], una_feature, es_things=(capa.origenAccesObjs==origen_Things)? true : false;

	if(es_things)
	{
		// Versió amb Things
		// Potser que no tingui un array de valor, que només tingui un valor i no un array perquè vinc d'una actualització
		if(fois.value) // si hi ha més d'un valor
		{
			for (var i=0; i<fois.value.length; i++)
				if(null!=(una_feature=ExtreuUnaSTAthing(fois.value[i], capa)))
					features.push(una_feature);
		}
		else // si només hi ha un valor
		{
			if(null!=(una_feature=ExtreuUnaSTAthing(fois, capa)))
				features.push(una_feature);
		}
	}
	else
	{
		// Versió amb FeatureOfInterest
		if(fois.value) // si hi ha més d'un valor
		{
			for (var i=0; i<fois.value.length; i++)
				if(null!=(una_feature=AddUnSTAfeature(fois.value[i], capa)))
					features.push(una_feature);
		}
		else // Si només hi ha un valor
		{
			if(null!=(una_feature=AddUnSTAfeature(fois, capa)))
				features.push(una_feature);
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
function DonaIndexZoneLevelAPartirDeId(capa, zoneLevelId)
{
	if(!capa || !zoneLevelId || !capa.cellZoneLevelSet || !capa.cellZoneLevelSet.zoneLevels || capa.cellZoneLevelSet.zoneLevels.length<1)
		return -1;
	for(var i=0; i<capa.cellZoneLevelSet.zoneLevels.length; i++)
	{
		if(zoneLevelId==capa.cellZoneLevelSet.zoneLevels[i].zoneLevelId)
			return i;
	}
	return -1;
}

// Els objectes es mantenen en memòria ordenats per id. Això es fa servir per afegir attributes als objectes més endavant.
async function OmpleCapaDigiAmbObjectesDigitalitzats(doc, consulta)
{
var root, tag, punt={}, objectes, valor, capa, feature, hi_havia_objectes, tipus, tile, i_tile_matrix=-1, iZoneLevel=-1;
var nObj=false, tm=null, hi_havia_objectes_tm=false, next_link=null;

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
	{		
		tile=null;
		iZoneLevel=DonaIndexZoneLevelAPartirDeId(capa, consulta.zoneLevelId);
	}
	
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
					else
					{
						// NJ_12-02-2025:M'he trobat que a vegades no hi ha el count tot i haver-ho demanat
						if(doc.value!==undefined && doc.value!=null)
							tile.nombreObjectes=doc.value.length;
						else
							tile.nombreObjectes=0;
					}
				}
				if(tile.nombreObjectes==0 || (tile.nombreObjectes>0 && tile.nombreObjectes<capa.objLimit))
				{
					CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
					// Torno a fer la petició però ara demanant els objectes i no el nombre d'objectes
					FesPeticioAjaxObjectesDigitalitzats(consulta.i_capa_digi, -1,  null, null, null, true, consulta.env_sol, consulta.zoneLevelId, false, consulta.funcio, consulta.param, null, consulta.nomes_subsc);
					return;					
				}
				// Afegeixo un objecte númeric amb el nombre d'objectes de la tessel·la
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
				var attributesObjNum=Object.keys(capa.tileMatrixSetGeometry.atriObjNumerics);
				if(attributesObjNum && attributesObjNum[0])
					objecteNum.properties[attributesObjNum[0]]=tile.nombreObjectes;
				tm.objNumerics.features.push(objecteNum);														
			}
			if(iZoneLevel!=-1)
			{
				if (capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells && 
					capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells.features)
				{
					hi_havia_objectes=true;
					var features=ExtreuITransformaSTACells(doc, capa);
					next_link=doc["@iot.nextLink"];
					if(features.length>0)
					{
						capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells.features.push.apply(capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells.features, features);  //Millor no usar concat. Extret de: https://jsperf.com/concat-vs-push-apply/10
					}
				}
				else
				{
					hi_havia_objectes=false
					if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
					{
						var features=ExtreuITransformaSTACells(doc, capa);
						next_link=doc["@iot.nextLink"];
						capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells={"type": "FeatureCollection", "features": features};						
					}
				}
			}
			else if(!nObj)
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
					{
						var features=ExtreuITransformaSTAfeatures(doc, capa);
						next_link=doc["@iot.nextLink"];
					}
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
						var features=ExtreuITransformaSTAfeatures(doc, capa);
						next_link=doc["@iot.nextLink"];
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
		function OmpleAttributesObjecteCapaDigiDesDeDataCSV(parsedData, attributes, feature)
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
				var attributes=root.attributes, atribNObjs=null;				
				if(attributes)
				{
					atribNObjs=attributes.getNamedItem("numberOfFeatures");// si WFS versió < 2.0
					if(!atribNObjs)
						atribNObjs=attributes.getNamedItem("numberMatched");// si WFS versió >= 2.0	
				}
				if(atribNObjs)
					tile.nombreObjectes=atribNObjs.value;
			}			
			if(tile.nombreObjectes==0 || (tile.nombreObjectes>0 && tile.nombreObjectes<capa.objLimit))
			{
				CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);
				// Torno a fer la petició però ara demanant els objectes i no el nombre d'objectes
				FesPeticioAjaxObjectesDigitalitzats(consulta.i_capa_digi, -1,  null, null, null, true, consulta.env_sol, consulta.zoneLevelId, false, consulta.funcio, consulta.param, null, consulta.nomes_subsc);					
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
			var attributesObjNum=Object.keys(capa.tileMatrixSetGeometry.atriObjNumerics);
			if(attributesObjNum && attributesObjNum[0])
				objecteNum.properties[attributesObjNum[0]]=tile.nombreObjectes;
			tm.objNumerics.features.push(objecteNum);
		}
		if(!nObj)
		{
			if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
			{
				if(!capa.namespace || capa.namespace==null)
				{
					var ns;
					var attributes=root.attributes;
					if(attributes)
						ns=attributes.getNamedItem("xmlns");
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
							if (CalGirarCoordenades(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, null))  // ·$· NJ-> JM Crec que això no està bé, perquè les coordenades en el cas del SOS són de moment sempre en EPGS:4326 i  no en el sistema de situació actual
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
							//ara els attributes
							OmpleAttributesObjecteCapaDigiDesDeWFS(objectes[i_obj], capa.attributes, feature);
						}
						//ara el i_simbol
						//DeterminaISimbolObjecteCapaDigi(capa, i_obj);
					}
				}
				CarregaSimbolsEstilActualCapaDigi(capa);
			}
		}
	}	
	if(iZoneLevel!=-1)
	{
		if (capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells && 
			capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells.features && 
			capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells.features.length==0)
			capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells=null;
		
		if (capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells && capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells.features)
		{
			//Elimino els objectes que han estat carregats més d'un cop.
			var features=capa.cellZoneLevelSet.zoneLevels[iZoneLevel].cells.features;
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
	}
	else if(!nObj)
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
			DefineixAttributesCapaVectorSiCal(capa);

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
	if(next_link)
	{
		await FesPeticioAjaxObjectesDigitalitzats(consulta.i_capa_digi, consulta.i_tile, 
					null, null, null, true, consulta.env_sol, consulta.zoneLevelId, consulta.seleccionar, 
					consulta.funcio, consulta.param, next_link, consulta.nomes_subsc);										
		//return;
	}
		
	if(consulta.funcio)
		consulta.funcio(consulta.param);

}

function ErrorCapaDigiAmbObjectesDigitalitzats(doc, consulta)
{
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);
}//Fi de ErrorCapaDigiAmbObjectesDigitalitzats()

//Dona l'índex dins de l'array d'attributes d'un nom d'attribute
function DonaIAttributesDesDeNomAttribute(capa_digi, attributes, nom_attribute)
{
	if(attributes==null)
		return -1;
	var attributesArray=Object.keys(attributes);
	for(var i=0; i<attributesArray.length; i++)
	{
		if(!attributesArray[i])
		{
			alert("The "+i+" attribute of the layer "+capa_digi.nom+" has no name.");
			return -1;
		}
		if(attributesArray[i].toUpperCase()==nom_attribute.toUpperCase())
			return i;
	}
	return -1;
}

//Determina el valor per una data concreta. Pensada per muntar sèries temporals
function DeterminaValorAttributeObjecteDataCapaDigi(i_nova_vista, capa, feature, attribute, attribute_name, i_data, i_col, i_fil)
{
	if (attribute.calcul && !attribute.FormulaConsulta)
	{
		alert("Irregular situation in the code. This needs to be solved in the feature collection level.");
		return 0;
	}

	if (attribute.FormulaConsulta)
	{
		var p=feature.properties;  //Encara que sembla que no es fa servir, aquesta variable és necessaria pels evals()
		var nonPropId=feature.id;
		if (HiHaValorsNecessarisCapaFormulaconsulta(capa, attribute.FormulaConsulta))
			var v=DonaValorsDeDadesBinariesCapa(i_nova_vista, capa, null, i_col, i_fil); //idem
		return eval(CanviaVariablesDeCadena(attribute.FormulaConsulta, capa, i_data, null));
	}
	if (attribute.nom=="nonPropId")
		return feature.id;
	return feature.properties[CanviaVariablesDeCadena(attribute_name, capa, i_data, null)];
}

//Determina el valor per la data actual
function DeterminaValorAttributeObjecteCapaDigi(i_nova_vista, capa, feature, attribute, attribute_name, i_col, i_fil)
{
	return DeterminaValorAttributeObjecteDataCapaDigi(i_nova_vista, capa, feature, attribute, attribute_name, null, i_col, i_fil);
}

function DeterminaTextValorAttributeObjecteCapaDigi(i_nova_vista, capa_digi, feature, attribute, attribute_name, i_col, i_fil)
{
	return DeterminaTextValorAttributeObjecteDataCapaDigi(i_nova_vista, capa_digi, feature, attribute, attribute_name, null, i_col, i_fil);
}


function DeterminaTextValorAttributeObjecteDataCapaDigi(i_nova_vista, capa_digi, feature, attribute, attribute_name, i_data, i_col, i_fil)
{
	var valor=DeterminaValorAttributeObjecteDataCapaDigi(i_nova_vista, capa_digi, feature, attribute, attribute_name, i_data, i_col, i_fil);
	if (typeof valor === "undefined")
		valor=Number.NaN;
	if (!isNaN(valor) && (attribute.NDecimals || attribute.NDecimals===0))
		return OKStrOfNe(valor, attribute.NDecimals);
	return valor;
}

function AlertaNomAttributeIncorrecteSimbolitzar(nom_camp, text_nom_camp, capa_digi)
{
	alert(GetMessage("WrongAttributeName") +
				" " +
				nom_camp + " (" + text_nom_camp + ") " +
				GetMessage("symbolizeLayer") + " " +
				DonaCadenaNomDesc(capa_digi));
}

function DeterminaValorObjecteCapaDigi(i_nova_vista, capa_digi, attributes, estil, feature, i_simbs, i_col, i_fil, nom_camp)
{
	if(estil && nom_camp && feature.properties && CountPropertiesOfObject(feature.properties)>0)
	{
		var attributesArray=Object.keys(attributes);
		var i_atrib=DonaIAttributesDesDeNomAttribute(capa_digi, attributes, nom_camp);
		if (i_atrib==-1)
		{
			AlertaNomAttributeIncorrecteSimbolitzar(nom_camp, "NomCamp*", capa_digi);
			return 0;
		}
		return DeterminaValorAttributeObjecteCapaDigi(i_nova_vista, capa_digi, feature, attributes[attributesArray[i_atrib]], attributesArray[i_atrib], i_col, i_fil);
	}
	return 0;
}

function DeterminaTextValorObjecteCapaDigi(i_nova_vista, capa_digi, attributes, estil, feature, i_simbs, i_col, i_fil, nom_camp)
{
	if(estil && nom_camp && feature.properties && CountPropertiesOfObject(feature.properties)>0)
	{
		var attributesArray=Object.keys(attributes);
		var i_atrib=DonaIAttributesDesDeNomAttribute(capa_digi, attributes, nom_camp);
		if (i_atrib==-1)
		{
			AlertaNomAttributeIncorrecteSimbolitzar(nom_camp, "NomCamp*", capa_digi);
			return 0;
		}
		return DeterminaTextValorAttributeObjecteCapaDigi(i_nova_vista, capa_digi, feature, attributes[attributesArray[i_atrib]], attributesArray[i_atrib], i_col, i_fil);
	}
	return 0;
}

function DeterminaISimbolObjecteCapaDigi(i_nova_vista, capa_digi, attributes, estil, feature, i_simbs, i_col, i_fil)
{
	if(estil && estil.simbols && estil.simbols.length &&
		estil.simbols[i_simbs].NomCamp && feature.properties &&
		CountPropertiesOfObject(feature.properties)>0)
	{
		var attributesArray=Object.keys(attributes);
		var i_atrib=DonaIAttributesDesDeNomAttribute(capa_digi, attributes, estil.simbols[i_simbs].NomCamp)
		if (i_atrib==-1)
		{
			AlertaNomAttributeIncorrecteSimbolitzar(estil.simbols[i_simbs].NomCamp, "estil.simbols[i_simbs].NomCamp", capa_digi);
			return -1;
		}
		var valor=DeterminaValorAttributeObjecteCapaDigi(i_nova_vista, capa_digi, feature, attributes[attributesArray[i_atrib]], attributesArray[i_atrib], i_col, i_fil);
		for(var i_simbol=0; i_simbol<estil.simbols[i_simbs].simbol.length; i_simbol++)
		{
			if(valor==estil.simbols[i_simbs].simbol[i_simbol].ValorCamp)
				return i_simbol;
		}
		return -1;  //The value of the object does not correspond with any simbol
	}
	return 0;  //simbols are not indexed by NomCamp (or there are no properties in the object) so there first simbol should be used
}

// Discusió de com fer tot això: http://stackoverflow.com/questions/17578280/how-to-pass-parameters-into-image-load-event
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

function DonaRequestOWSObjectesDigi(i_capa, limit, env, zoneLevelId, cadena_objectes, completa)
{
var tipus=DonaTipusServidorCapa(ParamCtrl.capa[i_capa]);

	if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features")
		return DonaRequestGetFeature(i_capa, limit, env, cadena_objectes, completa);
	if (tipus=="TipusSOS")
		return DonaRequestSOSGetFeatureOfInterest(i_capa, env);
	if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
	{
		if(ParamCtrl.capa[i_capa].origenAccesObjs==origen_Things)
			return DonaRequestSTAThings(i_capa, limit, env);
		if(ParamCtrl.capa[i_capa].origenAccesObjs==origen_CellsFeaturesOfInterest)
			return DonaRequestSTACellsFeaturesOfInterest(i_capa, zoneLevelId, env); 
		return DonaRequestSTAFeaturesOfInterest(i_capa, limit, env);
	}
	if (tipus=="TipusHTTP_GET")
		return ParamCtrl.capa[i_capa].servidor;

	alert(GetMessage("UnsuppServiceType") + ": " + tipus);
	return "";
}

function EsCampCalculat(attributes, nom_camp)
{
	if(attributes[nom_camp])
	{
		if(attributes[nom_camp].FormulaConsulta)
		{
			var attributesArray=Object.keys(attributes)
			for (var i=0; i<attributesArray.length; i++)
			{
				if (attributesArray[i]==nom_camp)
					return i;
			}
		}
		return -1;
	}
	return -1;
}

function DonaNomsCampsCapaDeAttributeCalculat(i_capa, formula)
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
						if(-1==(i_calculat=EsCampCalculat(capa.attributes, simbols.NomCamp)))
							llista.push(simbols.NomCamp);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAttributeCalculat(i_capa, capa.attributes[simbols.NomCamp].FormulaConsulta));
					}
					if(simbols.NomCampFEscala)
					{
						if(-1==(i_calculat=EsCampCalculat(capa.attributes, simbols.NomCampFEscala)))
							llista.push(simbols.NomCampFEscala);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAttributeCalculat(i_capa, capa.attributes[simbols.NomCampFEscala].FormulaConsulta));
					}
				}
			}
			if(estil.NomCampSel)
			{
				if(-1==(i_calculat=EsCampCalculat(capa.attributes, estil.NomCampSel)))
					llista.push(estil.NomCampSel);
				else
					llista.push.apply(llista, DonaNomsCampsCapaDeAttributeCalculat(i_capa, capa.attributes[estil.NomCampSel].FormulaConsulta));
			}
			if(estil.formes && estil.formes.length)
			{
				for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
				{
					forma=estil.formes[i_forma];
					if(forma.interior && forma.interior.NomCamp)
					{
						if(-1==(i_calculat=EsCampCalculat(capa.attributes, forma.interior.NomCamp)))
							llista.push(forma.interior.NomCamp);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAttributeCalculat(i_capa, capa.attributes[forma.interior.NomCamp].FormulaConsulta));
					}
					if(forma.vora && forma.vora.NomCamp)
					{
						if(-1==(i_calculat=EsCampCalculat(capa.attributes, forma.vora.NomCamp)))
							llista.push(forma.vora.NomCamp);
						else
							llista.push.apply(llista, DonaNomsCampsCapaDeAttributeCalculat(i_capa, capa.attributes[forma.vora.NomCamp].FormulaConsulta));
					}
				}
			}
			if(estil.fonts && estil.fonts.NomCamp)
			{
				if(-1==(i_calculat=EsCampCalculat(capa.attributes, estil.fonts.NomCamp)))
					llista.push(estil.fonts.NomCamp);
				else
					llista.push.apply(llista, DonaNomsCampsCapaDeAttributeCalculat(i_capa, capa.attributes[estil.fonts.NomCamp].FormulaConsulta));
			}
		}
	}
	if(llista.length>1)
	{
		// Elimino dels noms dels atributs el temps o altres variables que hi puguin haver
		var index;
		for(var i=0; i<llista.length;i++)
		{
			if(-1!=(index=llista[i].indexOf("{")))
				llista[i]=llista[i].slice(0,index);
		}
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
		cdns.push("crs=", capa.CRSgeometry,"&limit=", (limit && limit!=-1)? limit:"10000000","&f=");  //·$· hauria json i no application/json
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
			camps_implicats=DonaLlistaPropietatsSimbolitzacio(i_capa);
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

function DonaRequestSTAThings(i_capa, limit, env)
{
var camps_implicats=DonaLlistaPropietatsSimbolitzacio(i_capa), capa=ParamCtrl.capa[i_capa], cdns=[], cdns_env=[];		

	cdns.push("/v",DonaVersioComAText(capa.versio),"/Things?$select=id&$expand=Locations($select=location)");
	
	if (env!=null)
	{	
		var env2=null;
		if (!DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			env2=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
		else
			env2=env;
					
		cdns_env.push("&$filter=st_within(Locations/location,geography'");
		if(DonaServidorCapa(capa).toUpperCase().includes("api-samenmeten.rivm.nl".toUpperCase())) // NOTA_12_02_2025_NJ
			cdns_env.push("SRID=4326;");
		cdns_env.push("POLYGON((", env2.MinX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MinY, "))')");
	}
	
	if(camps_implicats.length<1)
	{
		if(limit && limit!=-1)
			cdns.push("&$count=true&$top=",limit);
		else
			cdns.push("&$top=",STAtopValue); 
		cdns.push(cdns_env.join(""));
		return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
	}
	var cdns_datastream=[], i_camps_afegits, i;
	cdns_datastream.push(",Datastreams($filter=");
	for(i_camps_afegits=i=0; i<camps_implicats.length; i++)
	{
		if(camps_implicats[i] && camps_implicats[i]!="")
		{
			if(i_camps_afegits>0)
				cdns_datastream.push(" or ");
			cdns_datastream.push("ObservedProperty/name eq '", camps_implicats[i], "'");
			i_camps_afegits++;
		}
	}
	cdns_datastream.push(";$select=ObservedProperty;$expand=ObservedProperty($select=name),Observations($top=1;$orderby=phenomenonTime%20desc;$select=phenomenonTime,result");
	if(capa.data)
		cdns_datastream.push(";$filter=phenomenonTime le ", DonaDateDesDeDataJSON(capa.data[DonaIndexDataCapa(capa, null)]).toISOString());
	cdns_datastream.push("))");	
	cdns.push(cdns_datastream.join(""));
	cdns.push("&$top=",STAtopValue);
	if (env!=null)
		cdns.push(cdns_env.join(""));
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}

function DonaRequestSTAObservationsThings(i_capa, limit, i_obj, env)
{
var cdns=[], cdns_datastream=[], cdns_filter=[];
var capa=ParamCtrl.capa[i_capa], tipus=DonaTipusServidorCapa(capa.tipus);

	cdns.push("/v",DonaVersioComAText(capa.versio),"/Things");
	
	cdns_datastream.push(",name;$expand=");
	if (tipus=="TipusSTAplus")
		cdns_datastream.push("Party($select=displayName),License($select=description),");

	if(capa.dataMinima)
		cdns_filter.push(";$filter=phenomenonTime ge ", DonaDateDesDeDataJSON(capa.dataMinima).toISOString());
	if(capa.dataMaxima)
	{
		if(cdns_filter.length)
			cdns_filter.push(" and ");
		else
			cdns_filter.push(";$filter=");
		cdns_filter.push("phenomenonTime le ", DonaDateDesDeDataJSON(capa.dataMaxima).toISOString());
	}
	
	// Si no tinc identificador d'objectes demano Things, si vull les observacions d'un objecte en concret faig la petició per Observacions directament
	if (i_obj==null)
	{
		if(limit && limit!=-1)
			cdns.push("?$count=true&$top=",limit, "&");
		else
			cdns.push("?$top=",STAtopValue,"&");	
		
		cdns.push("$select=id,name&$expand=Locations($select=location),Datastreams($select=unitOfMeasurement", 
					cdns_datastream.join(""),
					"ObservedProperty($select=name),Observations($top=",STAtopValue,";$select=result,phenomenonTime,parameters",
					(cdns_filter.length) ? cdns_filter.join(""): "",
					")),MultiDatastreams($select=unitOfMeasurements", 
					cdns_datastream.join(""), 
					"ObservedProperties($select=name),Observations($top=",STAtopValue,";$select=result,phenomenonTime,parameters",
					(cdns_filter.length) ? cdns_filter.join(""): "",
					"))");
		if (env!=null)
		{
			var env2=null;
			if (!DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
				env2=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
			else
				env2=env;
			
			// NOTA_12_02_2025_NJ:
			cdns.push("&$filter=st_within(Locations/location,geography'");
			if(DonaServidorCapa(capa).toUpperCase().includes("api-samenmeten.rivm.nl".toUpperCase()))
				cdns.push("SRID=4326;");
			cdns.push("POLYGON((", env2.MinX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MinY, "))')");
		}
	}
	else
	{
		if (capa.objectes.features[i_obj].id==+capa.objectes.features[i_obj].id)  // test if this is a number
			cdns.push("(", capa.objectes.features[i_obj].id, ")");
		else
			cdns.push("('", capa.objectes.features[i_obj].id, "')");
		cdns.push("?$select=id,name&$expand=Locations($select=location),Datastreams($select=unitOfMeasurement", 
					cdns_datastream.join(""),
					"ObservedProperty($select=name),Observations($top=",STAtopValue,
					";$select=result,phenomenonTime,parameters",
					(cdns_filter.length) ? cdns_filter.join(""): "",
					")),MultiDatastreams($select=unitOfMeasurements", 
					cdns_datastream.join(""), 
					"ObservedProperties($select=name),Observations($top=",STAtopValue,
					";$select=result,phenomenonTime,parameters",
					(cdns_filter.length) ? cdns_filter.join(""): "",
					"))");
	}
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}


// Aquesta petició permet obtenir per una featureOfInterest tots els MultiDataStreams aggregats per dia
// https://airquality-frost.k8s.ilt-dmz.iosb.fraunhofer.de/v1.1/FeaturesOfInterest(3692)/Observations?$expand=MultiDatastream&$filter=MultiDatastream/properties/aggregateUnit%20eq%20%27Days%27%20and%20phenomenonTime%20ge%202023-10-31T23:00:00.000Z%20and%20phenomenonTime%20le%202023-12-31T23:00:00.000Z
//Per obtenir totes les observacions d'una feature of Interest quan el MultiDataStream és una agregació per dies amb tota la informació tal i com es fa habitualment
//https://airquality-frost.k8s.ilt-dmz.iosb.fraunhofer.de/v1.1/FeaturesOfInterest(3692)/Observations?$select=result,phenomenonTime,parameters&$expand=MultiDatastream($expand=Thing($select=name),ObservedProperties($select=name))&$filter=MultiDatastream/properties/aggregateUnit%20eq%20%27Days%27%20and%20phenomenonTime%20ge%202023-12-30T23:00:00.000Z%20and%20phenomenonTime%20le%202023-12-31T23:00:00.000Z


// Això cal fer-ho per cada una de les propietats (temperatura, pm2.5,...) i per cada una de les agregacions (dies, mesos, hores,...)
//Per obtenir la primera Observacions d'una featureOfInterest concreta que té un multidataStrem per dies i una propietat observada PM2.5 
//https://airquality-frost.k8s.ilt-dmz.iosb.fraunhofer.de/v1.1/FeaturesOfInterest(3692)/Observations?$top=1&$select=result,phenomenonTime,parameters&$expand=MultiDatastream($expand=Thing($select=name),ObservedProperties($select=name))&$filter=MultiDatastream/ObservedProperties/name%20eq%20%27PM2.5%27%20and%20MultiDatastream/properties/aggregateUnit%20eq%20%27Days%27
// D'aquí obtenim l'identificador del MultiDatastream que ens permet obtenir totes les Observacions d'aquella propietat agregades per dies
//https://airquality-frost.k8s.ilt-dmz.iosb.fraunhofer.de/v1.1/MultiDatastreams(28924)/Observations

function DonaRequestSTAFeaturesOfInterest(i_capa, limit, env)
{
var camps_implicats=DonaLlistaPropietatsSimbolitzacio(i_capa);
		
	if(camps_implicats.length<1)
	{
		var cdns=[];
		var capa=ParamCtrl.capa[i_capa];
			
		cdns.push("/v",DonaVersioComAText(capa.versio),"/FeaturesOfInterest");
		if(limit && limit!=-1)
			cdns.push("?$count=true&$top=",limit);
		else
			cdns.push("?$top=",STAtopValue); 
		
		if (env!=null)
		{
			var env2=null;
			if (!DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
				env2=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
			else
				env2=env;
			
			// NOTA_12_02_2025_NJ:
			// Sembla ser que els filtres spatial no funcionen correctament en el servidor de RIVM i cal afegir un paràmetre
			// no estàndard perquè funcionin, però només en aquest servidor perquè la resta donen error si els hi afegeixes.
			// Per tant a 12-02-2025 introdueixo aquesta excepció per aquest servidor (NJ)
			cdns.push("&$filter=st_within(feature,geography'");
			if(DonaServidorCapa(capa).toUpperCase().includes("api-samenmeten.rivm.nl".toUpperCase()))
				cdns.push("SRID=4326;");
			cdns.push("POLYGON((", env2.MinX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MinY, ",", env2.MaxX, " ", env2.		MaxY, ",", env2.MinX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MinY, "))')");
		}
		return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
	}
	/*for(i=0; i<camps_implicats.length; i++)
			if(camps_implicats[i] && camps_implicats[i]!="")
				cdns.push(",",capa.nom , "/", camps_implicats[i]); */
	//  Potser enlloc de demanar-ho tot hauriem de triar només el que necessiterm per simbolitzar, 
	// el problema és que no tenim estructura dels atributs i no sé ben be com s'hauria de fer això
	// Potser cal afegir el nom del camp original amb els pares? Per exemple 
	// Observations/phenomenonTime or Observations/result
	// 
	// camps_implicats=DonaLlistaPropietatsSimbolitzacio(i_capa);
	/*	for(i=0; i<camps_implicats.length; i++)
			if(camps_implicats[i] && camps_implicats[i]!="")
				cdns.push(",",capa.nom , "/", camps_implicats[i]); */
			
	return DonaRequestSTAObservationsFeatureOfInterest(i_capa, limit, null, env);
}

function DonaRequestSTAObservationsFeatureOfInterest(i_capa, limit, i_obj, env)
{
var cdns=[], cdns_datastream=[], cdns_filter=[];
var capa=ParamCtrl.capa[i_capa], tipus=DonaTipusServidorCapa(capa.tipus);

	cdns_datastream.push(",name;$expand=Thing($select=name)");
	if (tipus=="TipusSTAplus")
		cdns_datastream.push(",Party($select=displayName),License($select=description)");
		//cdns_datastream.push(",Party($select=name),Project($select=name),License($select=description)");
	cdns.push("/v",DonaVersioComAText(capa.versio),"/FeaturesOfInterest");
	
	if(capa.dataMinima)
	{
		cdns_filter.push("$filter=");
		cdns_filter.push("phenomenonTime ge ", DonaDateDesDeDataJSON(capa.dataMinima).toISOString());
	}
	if(capa.dataMaxima)
	{
		if(cdns_filter.length)
			cdns_filter.push(" and ");
		else
			cdns_filter.push("$filter=");
		cdns_filter.push("phenomenonTime le ", DonaDateDesDeDataJSON(capa.dataMaxima).toISOString());
	}
	
	// Si no tinc identificador d'objectes demano featuresOfInterest, si vull les observacions d'un objecte en concret faig la petició per Observacions directament
	if (i_obj==null)
	{
		if(limit && limit!=-1)
			cdns.push("?$count=true&$top=",limit, "&");
		else
			cdns.push("?$top=",STAtopValue,"&"); 
		
		//cdns.push("$select=feature,id");
		cdns.push("$select=feature,id&$expand=Observations($select=result,phenomenonTime,parameters"
					(cdns_filter.length>0) ? (";&"+ cdns_filter.join("")) : "",
					";$expand=Datastream($select=unitOfMeasurement", 
					cdns_datastream.join(""), ",ObservedProperty($select=name)),MultiDatastream($select=unitOfMeasurements", 
					cdns_datastream.join(""), ",ObservedProperties($select=name)))");	
		if (env!=null)
		{
			var env2=null;
			if (!DonaCRSRepresentaQuasiIguals(capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
				env2=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
			else
				env2=env;
			
			// NOTA_12_02_2025_NJ:
			push.push("&$filter=st_within(feature,geography'");
			if(DonaServidorCapa(capa).toUpperCase().includes("api-samenmeten.rivm.nl".toUpperCase()))
				push.push("SRID=4326;");
			push.push("POLYGON((", env2.MinX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MinY, ",", env2.MaxX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MaxY, ",", env2.MinX, " ", env2.MinY, "))')");
		}
	}
	else
	{
		if (capa.objectes.features[i_obj].id==+capa.objectes.features[i_obj].id)  // test if this is a number
			cdns.push("(", capa.objectes.features[i_obj].id, ")");
		else
			cdns.push("('", capa.objectes.features[i_obj].id, "')");
		cdns.push("/Observations?$count=true&$select=result,phenomenonTime,parameters&$expand=Datastream($select=unitOfMeasurement", cdns_datastream.join(""),
				  ",ObservedProperty($select=name)),MultiDatastream($select=unitOfMeasurements", cdns_datastream.join(""), ",ObservedProperties($select=name))");
		if(cdns_filter.length>0)
			cdns.push("&", cdns_filter.join(""));
	}
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}

function DonaCadenaFiltreGeohashesInbox(zoneLevelId, env, crs, funcions_propies)
{
var cdns=[];

	if(!env || !crs || !zoneLevelId)
		return "";
	var env_ll=DonaEnvolupantLongLat(env, crs);
	
	if(funcions_propies)
	{
		// Si vull usar les nostres llibreries del geohash
		var llista_geohash=ngeohash_bboxes(env_ll.MinY, env_ll.MinX, env_ll.MaxY, env_ll.MinY, zoneLevelId);
		cdns.push("zoneId in (");
		for (var i=0; i<llista_geohash.length; i++)
			cdns.push((i==0)? "":",", llista_geohash[i]);
		cdns.push(")");
	}
	else
	{
		// Funcions del servidor STA
		cdns.push("zoneId isin geohashes_inbox(",env_ll.MinX,",",env_ll.MinY,",",env_ll.MaxX,",",env_ll.MaxY,",",zoneLevelId,")");
	}
	return cdns.join("");
}

function DonaRequestSTACellsFeaturesOfInterest(i_capa, zoneLevelId, env)
{
var capa=ParamCtrl.capa[i_capa], cdns=[], camps_implicats=DonaLlistaPropietatsSimbolitzacio(i_capa);
		
	cdns.push("/v",DonaVersioComAText(capa.versio),"/Cells?$top=",STAtopValue,"&$select=id,zoneId,zoneLevel");
	// NJ: en el cas de Cells no considero el limit perquè les celles ja són un sistema de tessel·lació
	if (env!=null)
		cdns.push("&$filter=", DonaCadenaFiltreGeohashesInbox(zoneLevelId, env, capa.CRSgeometry, false));
	if(camps_implicats.length<1)
		return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
	
	var cdns_datastream=[], i_camps_afegits, i;
	cdns.push("&$expand=MultiDatastreams($filter=");
	for(i_camps_afegits=i=0; i<camps_implicats.length; i++)
	{
		if(camps_implicats[i] && camps_implicats[i]!="")
		{
			if(i_camps_afegits>0)
				cdns.push(" or ");
			cdns.push("ObservedProperties/name eq '", camps_implicats[i], "'");
			i_camps_afegits++;
		}
	}
	cdns.push(";$expand=ObservedProperties($select=name),Observations($top=1;$orderby=phenomenonTime%20desc;$select=phenomenonTime,result");
	if(capa.data)
		cdns_datastream.push(";$filter=phenomenonTime le ", DonaDateDesDeDataJSON(capa.data[DonaIndexDataCapa(capa, null)]).toISOString());
	cdns.push("))");	
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(capa));
}


function DonaRequestSTAObservationsCellsFeaturesOfInterest(i_capa, zoneLevelId, i_obj, env)
{
var cdns=[], cdns_filter=[];
var capa=ParamCtrl.capa[i_capa], tipus=DonaTipusServidorCapa(capa.tipus);

	
	cdns.push("/v",DonaVersioComAText(capa.versio),"/Cells");
		
	if(capa.dataMinima)
	{
		cdns_filter.push("$filter=");
		cdns_filter.push("phenomenonTime ge ", DonaDateDesDeDataJSON(capa.dataMinima).toISOString());
	}
	if(capa.dataMaxima)
	{
		if(cdns_filter.length)
			cdns_filter.push(" and ");
		else
			cdns_filter.push("$filter=");
		cdns_filter.push("phenomenonTime le ", DonaDateDesDeDataJSON(capa.dataMaxima).toISOString());
	}
	
	// Si no tinc identificador d'objectes demano Cells, si vull les observacions d'una cell en concret faig la petició per Observacions directament
	if (i_obj==null)
	{
		cdns.push("?$top=",STAtopValue,"&select=id,zoneId,zoneLevel"); 		
		cdns.push("&$expand=MultiDatastreams($select=unitOfMeasurements,name", 
					";$filter=Sensor/properties/virtual",
					";$expand=ObservedProperties($select=name),Observations($top=",STAtopValue,
					(cdns_filter.length) ? (";"+cdns_filter.join("")): "",
					"))");
		if (env!=null)
			push.push("&$filter=", DonaCadenaFiltreGeohashesInbox(zoneLevelId, env, capa.CRSgeometry, false));
	}
	else
	{
		var i_zone_level=DonaIndexZoneLevelAPartirDeId(capa, zoneLevelId), cell;
		cell=ZoneLevelSet.zoneLevels[i_zone_level].cells;
		if (cell.features[i_obj].id==+cell.features[i_obj].id)  // test if this is a number
			cdns.push("(", cell.features[i_obj].id, ")");
		else
			cdns.push("('", cell.features[i_obj].id, "')");
		cdns.push("/Observations?$count=true&$top=", STAtopValue, 
			"&$select=result,phenomenonTime,parameters&",
			"$expand=MultiDatastream($select=unitOfMeasurement,name",
			";$filter=Sensor/properties/virtual",
			";$expand=ObservedProperties($select=name))");
		if(cdns_filter.length)
			cdns.push("&",cdns_filter.join(""));
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

async function FesPeticioAjaxObjectesDigitalitzatsPerEnvolupant(i_capa_digi, env, zoneLevelId, seleccionar, url_link, nomes_subsc)
{
var i_event, capa=ParamCtrl.capa[i_capa_digi], url, tipus=DonaTipusServidorCapa(capa);
	//ConsultaCapaDigi[i_consulta]=new CreaConsultaCapaDigi(i_capa_digi, -1, seleccionar);
	//env està en el CRS de la capa

	if(url_link)
		url=url_link;
	else
		url=DonaRequestOWSObjectesDigi(i_capa_digi, null, env, zoneLevelId, null, false);
	
	if (tipus=="TipusWFS" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("GetFeature", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusOAPI_Features" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("OAPI_Features", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusSOS" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("GetFeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
	{
		if(!nomes_subsc)
		{
			if(capa.origenAccesObjs==origen_Things)
				i_event=CreaIOmpleEventConsola("STA Things", i_capa_digi, url, TipusEventGetFeatureOfInterest);
			else if(capa.origenAccesObjs==origen_CellsFeaturesOfInterest)
				i_event=CreaIOmpleEventConsola("STA Cells of FeaturesOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
			else 
				i_event=CreaIOmpleEventConsola("STA FeaturesOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
		}
		if(capa.subscribed=="si")
		{
			var websub=await DiscoverSTATopic(GetSTAURLtoSubscribe(url));

			if (websub && websub.hub && websub.self && ParamCtrl.webSocketUrl && ParamCtrl.webHookUrl) {
				SubscribeTopicToWebHub(ParamCtrl.webSocketUrl, ParamCtrl.webHookUrl, 
					websub.hub, websub.self, capa.id, 300, 
					OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, 
					{"i_capa_digi": i_capa_digi, "i_tile": -1, "env_sol": env, "seleccionar": seleccionar, "nomes_subsc": nomes_subsc});
			}
		}
	}
	else if (tipus=="TipusHTTP_GET" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("HTTP GET", i_capa_digi, url, TipusEventHttpGet);

	if(nomes_subsc)
		return;
	
	if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json" || tipus=="TipusSTA" || tipus=="TipusSTAplus")
		loadJSON(url, OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, {"i_capa_digi": i_capa_digi, "i_tile": -1, "env_sol": env, "seleccionar": seleccionar, "i_event": i_event});
	else
		loadFile(url, (capa.FormatImatge) ? capa.FormatImatge : "text/xml", OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, {"i_capa_digi": i_capa_digi, "i_tile": -1, "env_sol": env, "seleccionar": seleccionar, "i_event": i_event});
}

async function FesPeticioAjaxObjectesDigitalitzatsPerIdentificador(i_capa_digi, zoneLevelId, cadena_objectes, seleccionar, url_link, nomes_subsc)
{
var i_event, capa=ParamCtrl.capa[i_capa_digi], url, tipus=DonaTipusServidorCapa(capa);

	//ConsultaCapaDigi[i_consulta]=new CreaConsultaCapaDigi(i_capa_digi, -1, seleccionar);
	if(url_link)
		url=url_link;
	else
		url=DonaRequestOWSObjectesDigi(i_capa_digi, null, zoneLevelId, cadena_objectes, false);
	
	if (tipus=="TipusWFS" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("GetFeature", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusOAPI_Features" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("OAPI_Features", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusSOS" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("GetFeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
	{
		if(!nomes_subsc)
		{
			if(capa.origenAccesObjs==origen_Things)
				i_event=CreaIOmpleEventConsola("STA Things", i_capa_digi, url, TipusEventGetFeatureOfInterest);
			else if(capa.origenAccesObjs==origen_CellsFeaturesOfInterest)
				i_event=CreaIOmpleEventConsola("STA Cells of FeaturesOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
			else
				i_event=CreaIOmpleEventConsola("STA FeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
		}
		if(capa.subscribed=="si")
		{
			var websub=await DiscoverSTATopic(GetSTAURLtoSubscribe(url));

			if (websub && websub.hub && websub.self && ParamCtrl.webSocketUrl && ParamCtrl.webHookUrl) {
				SubscribeTopicToWebHub(ParamCtrl.webSocketUrl, ParamCtrl.webHookUrl, 
					websub.hub, websub.self, capa.id, 300, 
					OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, 
					{"i_capa_digi": i_capa_digi, "i_tile": -1, "seleccionar": seleccionar, "nomes_subsc": nomes_subsc});
			}
		}
	}
	if(nomes_subsc)
		return;

	loadFile(url, (capa.FormatImatge) ? capa.FormatImatge : "text/xml", OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, {"i_capa_digi": i_capa_digi, "i_tile": -1, "seleccionar": seleccionar, "i_event": i_event});
}

async function FesPeticioAjaxObjectesDigitalitzats(i_capa_digi, i_tile, costat, i_col, j_fil, demana_objs, env_sol, zoneLevelId, seleccionar, funcio, param, url_link, nomes_subsc)
{
var i_event, capa=ParamCtrl.capa[i_capa_digi], url, tipus=DonaTipusServidorCapa(capa);

	if(i_tile!=null && i_tile!=-1)
	{		
		if(typeof capa.tileMatrixSetGeometry.tilesSol === "undefined" || capa.tileMatrixSetGeometry.tilesSol==null)
			capa.tileMatrixSetGeometry.tilesSol=[];
		if(i_tile>=capa.tileMatrixSetGeometry.tilesSol.length)
			capa.tileMatrixSetGeometry.tilesSol[i_tile]={"costat": costat, "iTile": i_col , "jTile": j_fil, "nombreObjectes": -1};
	}
	
	if(url_link)
		url=url_link;
	else
		url=DonaRequestOWSObjectesDigi(i_capa_digi, ((typeof capa.objLimit === "undefined" || i_tile==null  || i_tile==-1 || demana_objs) ? null: capa.objLimit), env_sol, zoneLevelId, null, false);
	
	if (tipus=="TipusWFS" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("GetFeature", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusOAPI_Features" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("OAPI_Features", i_capa_digi, url, TipusEventGetFeature);
	else if (tipus=="TipusSOS" && !nomes_subsc)
		i_event=CreaIOmpleEventConsola("GetFeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
	else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
	{
		if(!nomes_subsc)
		{
			if(capa.origenAccesObjs==origen_Things)
				i_event=CreaIOmpleEventConsola("STA Things", i_capa_digi, url, TipusEventGetFeatureOfInterest);
			else if(capa.origenAccesObjs==origen_CellsFeaturesOfInterest)
				i_event=CreaIOmpleEventConsola("STA Cells of FeaturesOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
			else
				i_event=CreaIOmpleEventConsola("STA FeatureOfInterest", i_capa_digi, url, TipusEventGetFeatureOfInterest);
		}
		if(capa.subscribed=="si")
		{
			var websub=await DiscoverSTATopic(GetSTAURLtoSubscribe(url));

			if (websub && websub.hub && websub.self && ParamCtrl.webSocketUrl && ParamCtrl.webHookUrl) {
				SubscribeTopicToWebHub(ParamCtrl.webSocketUrl, ParamCtrl.webHookUrl, 
					websub.hub, websub.self, capa.id, 300, 
					OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, 
					{"i_capa_digi": i_capa_digi, "i_tile": i_tile, "env_sol": env_sol, "seleccionar": seleccionar, "funcio": funcio, "param":param, "nomes_subsc": nomes_subsc});
			}
		}
	}
	else if (tipus=="TipusHTTP_GET")
		i_event=CreaIOmpleEventConsola("HTTP GET", i_capa_digi, url, TipusEventHttpGet);
	
	if(nomes_subsc)
		return;

	// env_sol està ja en el CRS de la capa
	if (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json" || tipus=="TipusSTA" || tipus=="TipusSTAplus")
		loadJSON(url, OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats,
			 {"i_capa_digi": i_capa_digi, "i_tile": i_tile, "zoneLevelId": zoneLevelId, "env_sol": env_sol, "seleccionar": seleccionar, "i_event": i_event, "funcio": funcio, "param":param});
	else
		loadFile(url, (capa.FormatImatge) ? capa.FormatImatge : "text/xml", OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats,
			 {"i_capa_digi": i_capa_digi, "i_tile": i_tile, "env_sol": env_sol, "seleccionar": seleccionar, "i_event": i_event, "funcio": funcio, "param":param});
}

function DonaCellsIndexZoneLevelMesProperAZoomActual(capa)
{
var costat_actual=ParamInternCtrl.vista.CostatZoomActual;
var i_zoneLevel=-1;

	for(var i=0; i<capa.cellZoneLevelSet.zoneLevels.length;i++)
	{
		if(capa.cellZoneLevelSet.zoneLevels[i].costatMinim && capa.cellZoneLevelSet.zoneLevels[i].costatMaxim)
		{
			if (capa.cellZoneLevelSet.zoneLevels[i].costatMinim<=ParamInternCtrl.vista.CostatZoomActual && 
			capa.cellZoneLevelSet.zoneLevels[i].costatMaxim>=ParamInternCtrl.vista.CostatZoomActual)	
				i_zoneLevel=i;
		}
		else if(capa.cellZoneLevelSet.zoneLevels[i].costatMinim)
		{
			if(capa.cellZoneLevelSet.zoneLevels[i].costatMinim>costat_actual*0.9999 && 
				capa.cellZoneLevelSet.zoneLevels[i].costatMinim<costat_actual*1.0001)
				i_zoneLevel=i;
		}
		else if(capa.cellZoneLevelSet.zoneLevels[i].costatMaxim)
		{
			if(capa.cellZoneLevelSet.zoneLevels[i].costatMaxim>costat_actual*0.9999 && 
				capa.cellZoneLevelSet.zoneLevels[i].costatMaxim<costat_actual*1.0001)
				i_zoneLevel=i;
		}
	}
	return i_zoneLevel;
}

function DonaCellsZoneLevelIdMesProperAZoomActual(capa)
{
var costat_actual=ParamInternCtrl.vista.CostatZoomActual;
var i_zoneLevel;

	if(-1!=(i_zoneLevel=DonaCellsIndexZoneLevelMesProperAZoomActual(capa)))
		return capa.cellZoneLevelSet.zoneLevels[i_zoneLevel].zoneLevelId;
	return null;
}

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
		if (capa.tileMatrixSetGeometry.tileMatrix[i].costat<=costat_actual)	// Agafo el més proper per sota	
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

function DemanaCellsDeCapaDigitalitzadaSiCal(capa, env, funcio, param)
{
var tipus=DonaTipusServidorCapa(capa), vaig_a_carregar=false;

	if ((tipus!="TipusSTA" && tipus!="TipusSTAplus") || capa.origenAccesObjs!=origen_CellsFeaturesOfInterest)
		return false;
	if(!param.carregant_geo)
	{
		param.carregant_geo=true;
		vaig_a_carregar=true;		
	}
	if(vaig_a_carregar)
	{
		var zoneLevelId=null, env_temp, env_situacio;
		if(null==(zoneLevelId=DonaCellsZoneLevelIdMesProperAZoomActual(capa)))
			return true;
		
		// He d'ajustar l'envolupant a la situació
		env_temp={"MinX": env.MinX, "MaxX": env.MaxX, "MinY": env.MinY, "MaxY": env.MaxY};
		env_situacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS;
		if (env_temp.MinX<env_situacio.MinX)
			env_temp.MinX=env_situacio.MinX;
		if (env_temp.MaxX>env_situacio.MaxX)
			env_temp.MaxX=env_situacio.MaxX;
		if (env_temp.MinY<env_situacio.MinY)
			env_temp.MinY=env_situacio.MinY;
		if (env_temp.MaxY>env_situacio.MaxY)
			env_temp.MaxY=env_situacio.MaxY;
		
		env_temp=TransformaEnvolupant(env_temp, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
		FesPeticioAjaxObjectesDigitalitzats(ParamCtrl.capa.indexOf(capa), -1, null, null, null, true, env_temp, zoneLevelId, false, funcio, param, null, false);		
		return true;		
	}
	return false;
}


function DemanaTilesDeCapaDigitalitzadaSiCal(capa, env, funcio, param)
{
var env_total, env_temp, env_sol;
var i_tessella_min, i_tessella_max, j_tessella_min, j_tessella_max, i_col, j_fil, i_tile=0, zoneLevelId=null;
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
					
			if(i_tile==-1 || (capa.subscribed=="si" && vaig_a_carregar))
			{
				ha_calgut=(i_tile==-1)? true: false;
				i_tile=(TMS.tilesSol) ? TMS.tilesSol.length : 0;
				env_sol={"MinX": tileMatrix.TopLeftPoint.x+(i_col*incr_x),
						"MaxX": tileMatrix.TopLeftPoint.x+((i_col+1)*incr_x),
						"MinY": tileMatrix.TopLeftPoint.y-((j_fil+1)*incr_y),
						"MaxY": tileMatrix.TopLeftPoint.y-(j_fil*incr_y)};
				if(vaig_a_carregar)
				{
					FesPeticioAjaxObjectesDigitalitzats(ParamCtrl.capa.indexOf(capa), i_tile, tileMatrix.costat, i_col, j_fil, demana_objs, env_sol, zoneLevelId, false, funcio, param, null, !ha_calgut);			 		
				}
				else
					return true;
			}
		}
	}
	return ha_calgut;
}

function DemanaFitxerObjectesIPropietatsDeCapaDigitalitzadaSiCal(capa, env, funcio, param)
{
var env_total, env_temp, env_sol;
var ha_calgut=false, vaig_a_carregar=false;

	if(DonaTipusServidorCapa(capa)!="TipusHTTP_GET" || !capa.servidor ||
		(capa.FormatImatge!="text/csv" && capa.FormatImatge!="application/json" && capa.FormatImatge!="application/geo+json") || 
		(capa.objectes && capa.objectes.features && capa.objectes.features.length>0 && !capa.subscribed))
		return ha_calgut;
	
	// ·$· Potser es podria filtrar per env d'objecte i vista, però de moment no ho faig i ho demano per tots els objectes
	// Transformo l'envolupant de la vista a coordenades vector
	//env_temp=TransformaEnvolupant(env, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
	
	if(!param.carregant_geo)
	{
		param.carregant_geo=true;
		vaig_a_carregar=true;		
	}
	if(vaig_a_carregar)
	{
		ha_calgut=true;				
		param.i_capa=ParamCtrl.capa.indexOf(capa);
		param.i_capa_digi=param.i_capa;
		param.i_event=CreaIOmpleEventConsola("HTTP GET", param.i_capa, capa.servidor, TipusEventHttpGet);
		param.i_tile=-1;
		param.func_after=funcio;
		param.func_error=ErrorCapaDigiAmbObjectesDigitalitzats;
		param.nomes_subsc=(capa.objectes && capa.objectes.features && capa.objectes.features.length>0 && capa.subscrib)? true: false;
		if(capa.FormatImatge=="text/csv")
		{
			// no indico expressament el mimetype en aquest cas perquè he vist que no sempre respon com "text/csv" sino com "application/octet-stream" i fa que obtingui un error quan no és així
			loadFile(capa.servidor, null, OmpleObjectesIAttributesCapaDigiDesDeCadenaCSV, ErrorCapaDigiAmbObjectesDigitalitzats, param);
		}
		else  //fitxers en JSON
		{
			loadJSON(capa.servidor, OmpleCapaDigiAmbObjectesDigitalitzats, ErrorCapaDigiAmbObjectesDigitalitzats, param);
		}
	}
	else
		return true;
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
				loadFile(feature.propertiesSource, null, OmpleAttributesObjecteCapaDigiDesDeCadenaCSV, ErrorCapaDigiAmbObjectesDigitalitzats, param);
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
	FesPeticioAjaxObjectesDigitalitzatsPerEnvolupant(i_capa, env, -1, true, null, false);	
}


// Aquesta funció sembla ser que no s'usa enlloc (NJ 28-09-2020)
/*
function SeleccionaObjsCapaDigiPerIdentificador(id_capa, id_obj, zoneLevelId, afegir)
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
		FesPeticioAjaxObjectesDigitalitzatsPerIdentificador(i_capa, zoneLevelId, cadena_objectes, true);
}//Fi de SeleccionaObjsCapaDigiPerIdentificador()
*/

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
