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

var ajaxGetCapabilities=[];
var ServidorGetCapabilities=[];

function ExtreuUnitatsDeCadenaPerWQEMS(layer, cadena)
{
var str_uom="UnitOfMeasure:", str_vom="SubService:", str_valueMeaning="ValueMeaning:", k;

	if (cadena.substr(0, str_uom.length)==str_uom)
	{
		layer.uom=cadena.substr(str_uom.length).trim();
		if (layer.uom=="mg/m^3")
			layer.uom="mg/m<sup>3</sup>";
		else if (layer.uom=="NTU")
			layer.uom="Nephelometric Turbidity (NTU)";
	}
	else if (cadena.substr(0, str_vom.length)==str_vom)
		layer.vom=cadena.substr(str_vom.length).trim();
	else if (cadena.substr(0, str_valueMeaning.length)==str_valueMeaning)
	{
		if (-1!=(k=cadena.substr(str_valueMeaning.length).indexOf(':')))
			layer.categories[parseInt(cadena.substr(str_valueMeaning.length,k))]=cadena.substr(str_valueMeaning.length+k+1).trim();		
	}
}

//Suporta totes les versions de WMS
// Si hi ha servidorGC.param_func_after.capa[].nom només es carregen les capes que hi ha a l'array.
function LlegeixLayerServidorGC(servidorGC, node_layer, sistema_ref_comu, pare)
{
var i, j, node2, node3, trobat=false, cadena, cadena2, layer={};
var minim, maxim, factor_k, factorpixel;


	//Llegeixo les capacitats d'aquesta capa
	//Començo pel sistema de referència
	//versió 1.0.0, 1.1.0 i 1.1.1 en l'estil antic --> un únic element amb els diversos sistemes de referència separats per espais (SRS)
	//versió 1.1.1 en l'estil nou--> un element per cada sistema de referència (SRS)
	//versió major a 1.1.1 --> un element per cada sistema de referència (CRS)

	if(DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)=="°")
		factorpixel=FactorGrausAMetres; // de graus a metres
	else //if(unitats=="m")
		factorpixel=1; //de m a m

	factor_k=factorpixel*1000/0.28;  //pas de unitats mapa a mm dividit per la mida de píxel

	//Això no ho puc usar perquè em dona els elements SRS de node_layer i dels seus fills node_layer.getElementsByTagName('SRS');
	layer={nom: null, 
		desc: null,
		CostatMinim: null,
		CostatMaxim: null,
		CRSs: [],
		keywords: [],
		consultable: false,
		estil: [],
		uom: null,
		vom: null,  //Variable of measure
		categories: [],
		FlagsData: null,
		i_data: 0,
		data: null,
		esCOG: false,
		EnvLL: null,
		uriDataTemplate: null,
		uriMDTemplate: null,
		dimensioExtra: null};
		
	for(i=0; i<node_layer.childNodes.length; i++)
	{
		node2=node_layer.childNodes[i];
		if(node2.nodeName=="SRS" || node2.nodeName=="CRS")
		{
			cadena=node2.childNodes[0].nodeValue;
			if(cadena)
			{
				if (DonaCRSRepresentaQuasiIguals(cadena.toUpperCase(), ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
				{
					layer.CRSs.push(cadena.toUpperCase());
					trobat=true;
				}
			}
		}
	}

	if(trobat || sistema_ref_comu)
	{
		var capa;
		for(i=0; i<node_layer.childNodes.length; i++)
		{
			node2=node_layer.childNodes[i];
			if(node2.nodeName=="Name")
			{
				//Llegeix-ho la capa si té name
				layer.nom=node2.childNodes[0].nodeValue;
				//Si tinc un array de noms de capes a llegir, només la llegeixo si està a la llista.
				if (servidorGC.param_func_after && servidorGC.param_func_after.capa)
				{
					capa=servidorGC.param_func_after.capa;
					for(var i_capa=0; i_capa<capa.length; i_capa++)
					{
						if (capa[i_capa].nom==layer.nom)
							break;
					}
					if (i_capa==servidorGC.param_func_after.capa.length)
					{
						// i=node_layer.childNodes.length;  //faig veure que no he trobat el nom: He recorregut tot l'array de nodes.  NJ-> JM no entenc perquè fas això, si ho fas no acabes de llegir els altres fills de la layer
						break;
					}
				}
				// Afegixo la capa en aquest punt on sé que té nom, i si hi ha una llista de capes és a la llista
				servidorGC.layer[servidorGC.layer.length]=layer;
				
				if(pare) //hereto les coses del pare si s'ha de fer
				{
					if(pare.CRSs && pare.CRSs.length>0)
					{
						layer.CRSs.push.apply(layer.CRSs, pare.CRSs);
						layer.CRSs.sort(sortAscendingStringInsensible);
						layer.CRSs.removeDuplicates(sortAscendingStringInsensible);
					}
					if(pare.keywords && pare.keywords.length>0)
					{
						layer.keywords.push.apply(layer.keywords, pare.keywords);
						layer.keywords.sort(sortAscendingStringInsensible);
						layer.keywords.removeDuplicates(sortAscendingStringInsensible);
					}
					if(pare.consultable)
						layer.consultable=true;
					if(pare.estil)
					{
						for(j=0; j<pare.estil.length; j++)
							layer.estil[layer.estil.length]=pare.estil[j];
					}
					layer.CostatMinim=pare.CostatMinim;
					layer.CostatMaxim=pare.CostatMaxim;
					layer.dimensioExtra=JSON.parse(JSON.stringify(pare.dimensioExtra));
				}
				break;
			}
		}

		if(i<node_layer.childNodes.length)  //vol dir que aquesta capa té name
		{
			//if (layer.nom=="landwatertransitionzone-twodates:lwtztd-polyphytos")
			//	alert(1);

			for(i=0; i<node_layer.childNodes.length; i++)
			{
				node2=node_layer.childNodes[i];

				if (node2.nodeName=="Title")
				{
					if (servidorGC.param_func_after && servidorGC.param_func_after.capa && capa.desc)
						layer.desc=capa.desc;
					else
						layer.desc=node2.childNodes[0].nodeValue;
				}
				else if(node2.nodeName=="Style")
				{
					node3=node2.getElementsByTagName('Name');
					if(node3 && node3.length>0)
					{
						cadena=node3[0].childNodes[0].nodeValue;
						node3=node2.getElementsByTagName('Title');
						if(node3 && node3.length>0)
							cadena2=node3[0].childNodes[0].nodeValue;
						layer.estil[layer.estil.length]={"nom": cadena, "desc": cadena2};
					}
				}
				else if (node2.nodeName=="ScaleHint")
				{
					minim=parseInt(node2.getAttribute('min'));
					maxim=parseInt(node2.getAttribute('max'));
					if(minim)
						layer.CostatMinim=minim/Math.SQRT2;
					if(maxim)
						layer.CostatMaxim=maxim/Math.SQRT2;
				}
				else if (node2.nodeName=="MinScaleDenominator")
				{
					minim=parseInt(node2.childNodes[0].nodeValue);
					if(minim)
						layer.CostatMinim=minim*factorpixel/factor_k;
				}
				else if (node2.nodeName=="MaxScaleDenominator")
				{
					maxim=parseInt(node2.childNodes[0].nodeValue);
					if(maxim)
						layer.CostatMaxim=maxim*factorpixel/factor_k;
				}
				else if (node2.nodeName=="LatLonBoundingBox")
				{
					layer.EnvLL={};	
					layer.EnvLL.MinX=parseFloat(node2.getAttribute('minx'));
					layer.EnvLL.MaxX=parseFloat(node2.getAttribute('maxx'));
					layer.EnvLL.MinY=parseFloat(node2.getAttribute('miny'));
					layer.EnvLL.MaxY=parseFloat(node2.getAttribute('maxy'));
				}
				else if (node2.nodeName=="EX_GeographicBoundingBox")
				{
					layer.EnvLL={};	
					node3=node2.getElementsByTagName('westBoundLongitude');
					if(node3 && node3.length>0)
						layer.EnvLL.MinX=parseFloat(node3[0].childNodes[0].nodeValue);
					node3=node2.getElementsByTagName('eastBoundLongitude');
					if(node3 && node3.length>0)
						layer.EnvLL.MaxX=parseFloat(node3[0].childNodes[0].nodeValue);
					node3=node2.getElementsByTagName('southBoundLatitude');
					if(node3 && node3.length>0)
						layer.EnvLL.MinY=parseFloat(node3[0].childNodes[0].nodeValue);
					node3=node2.getElementsByTagName('northBoundLatitude');
					if(node3 && node3.length>0)
						layer.EnvLL.MaxY=parseFloat(node3[0].childNodes[0].nodeValue);
				}
				else if(node2.nodeName=="Keywords") // A la versió 1.0.0 és una única clau amb les paraules separades per coma
				{
					// <Keywords>MCSC, Sòl, Cobertes, Catalunya, Nivell 5, MCSC-4, 2009</Keywords>
					cadena=node2.childNodes[0].nodeValue;
					var array_keywords=cadena.split(",");
					for(j=0; j<array_keywords.length; j++)
					{
						layer.keywords.push(array_keywords[j]);
						
						//Cas excepcional dels acords que WQeMS per obtenir les unitats i la descripció dels valors.
						ExtreuUnitatsDeCadenaPerWQEMS(layer, array_keywords[j]);
					}
				}
				else if (node2.nodeName=="KeywordList") // A partir de la versió 1.1.x és una llista amb diversos nodes 
				{
					//<KeywordList><Keyword>Cobertes</Keyword>....</KeywordList>
					if (node2.childNodes)
					{
						for(j=0; j<node2.childNodes.length; j++)
						{
							node3=node2.childNodes[j];
							if (node3.nodeName=="Keyword")
							{
								cadena=node3.childNodes[0].nodeValue;
								layer.keywords.push(cadena);
								
								//Cas excepcional dels acords que WQeMS per obtenir les unitats i la descripció dels valors.
								ExtreuUnitatsDeCadenaPerWQEMS(layer, cadena);
							}
						}
					}
				}
				else if (node2.nodeName=="Dimension" || node2.nodeName=="Extent")
				{
					//In WMS 1.0, 1.1 and 1.1.1 'default' and "valors" are in <Extent> and in WMS 1.3 are in <dimension>
					if (node2.getAttribute('name').toLowerCase()=='time')
					{
						var temps_defecte=null, valors_temps=null;

						if (node2.getAttribute('default')!=null)
							temps_defecte=node2.getAttribute('default');
						if (node2.childNodes.length>0)
						{
							valors_temps=node2.childNodes[0].nodeValue;
							if(valors_temps.indexOf("/")==-1)  //Si és un interval (!=-1) de moment no li dono suport
							{
								var data_defecte=null;
								var dates;
								//És una capa multitemporal
								//valors_temps és una cadena que pot contenir un únic valor, una llista de valors separats per coma (o un interval amb període que no suportem)
								//yyyy-mm-ddThh:mm:ss.sssZ
								if (temps_defecte)
								{
									data_defecte={};
									OmpleDataJSONAPartirDeDataISO8601(data_defecte, temps_defecte);
								}
								layer.data=[];
								dates=valors_temps.split(",");
								for(j=0; j<dates.length; j++)
								{
									layer.data.push({});
									if (j==0)
										layer.FlagsData=OmpleDataJSONAPartirDeDataISO8601(layer.data[layer.data.length-1], dates[j]);
									else
										OmpleDataJSONAPartirDeDataISO8601(layer.data[layer.data.length-1], dates[j]);
									if(data_defecte && /*layer.data[layer.data.length-1]==data_defecte*/ dates[j]==temps_defecte)
										layer.i_data=layer.data.length-1;
								}
							}
						}
					}
					else
					{
						if (node2.childNodes.length>0)
						{
							var extra_dim, items;
							var valors=node2.childNodes[0].nodeValue;
							if (layer.dimensioExtra==null)
								layer.dimensioExtra=[];
							layer.dimensioExtra[layer.dimensioExtra.length]={}
							extra_dim=layer.dimensioExtra[layer.dimensioExtra.length-1];
							extra_dim.clau={nom: node2.getAttribute('name')};
							items=valors.split(",");
							extra_dim.valor=[];
							for (j=0; j<items.length; j++)
								extra_dim.valor[j]={nom: items[j]};
							var valor_defecte=node2.getAttribute('default');
							if (valor_defecte!=null)
							{								
								for (j=0; j<extra_dim.valor.length; j++)
								{
									if (extra_dim.valor[j].nom==valor_defecte)
									{
										extra_dim.i_valor=j;
										break;
									}
								}
								if (j==extra_dim.valor.length)
									extra_dim.i_valor=extra_dim.valor.length-1
							}
							else
								extra_dim.i_valor=extra_dim.valor.length-1;
						}
					}
				}
			}
			//Aquests 2 els faig a part perquè necessito els noms de les dimensions.
			for(i=0; i<node_layer.childNodes.length; i++)
			{
				node2=node_layer.childNodes[i];
				if(node2.nodeName=="DataURL")
				{
					for(j=0; j<node2.childNodes.length; j++)
					{
						node3=node2.childNodes[j];
						if (node3.nodeName=="Format")
						{
							var format=node3.childNodes[0].nodeValue.split(";");
							if (format.length>2 && format[0]=="image/tiff")
							{
								for (var f1=1; f1<format.length; f1++)
								{
									if (format[f1].trim()=="profile=COG")
									{
										layer.esCOG=true;
										break;
									}
								}
							}
						}
						if (node3.nodeName=="OnlineResource")
						{
							layer.uriDataTemplate=node3.getAttribute("xlink:href");
							if (layer.dimensioExtra)
							{
								for (var d=0; d<layer.dimensioExtra.length; d++)
								{
									//DataURL xlink.href no pot portar una "{" o sigui que en el wqems varem acordar la notació "$(key)" que aquí canvio per la normal de les URI templates.
									layer.uriDataTemplate=layer.uriDataTemplate.replaceAll("$("+layer.dimensioExtra[d].clau.nom+")", "{"+layer.dimensioExtra[d].clau.nom+"}");
								}
							}
						}
					}
				}
				if(node2.nodeName=="MetadataURL")
				{
					for(j=0; j<node2.childNodes.length; j++)
					{
						node3=node2.childNodes[j];
						if (node3.nodeName=="OnlineResource")
						{
							layer.uriMDTemplate=node3.getAttribute("xlink:href");
							if (layer.dimensioExtra)
							{
								for (var d=0; d<layer.dimensioExtra.length; d++)
								{
									//DataURL xlink.href no pot portar una "{" o sigui que en el wqems varem acordar la notació "$(key)" que aquí canvio per la normal de les URI templates.
									layer.uriMDTemplate=layer.uriMDTemplate.replaceAll("$("+layer.dimensioExtra[d].clau.nom+")", "{"+layer.dimensioExtra[d].clau.nom+"}");
								}
							}
						}
					}
				}
			}
			//Miro si és consultable
			if(node_layer.getAttribute("queryable")=='1')
				layer.consultable=true;
		}
	}
	//Si aquesta layer té fills continuo llegint
	node2=node_layer.getElementsByTagName('Layer');
	if (node2 && node2.length)
	{
		for(i=0; i<node2.length; i++)
			LlegeixLayerServidorGC(servidorGC, node2[i], trobat, layer);
	}
}  //Fi de LlegeixLayerServidorGC()

function HiHaAlgunErrorDeParsejatGetCapabilities(doc)
{
	if (doc.parseError && doc.parseError.errorCode != 0)
	{
		alert("Error in line " + doc.parseError.line +
				" position " + doc.parseError.linePos +
				"\nError Code: " + doc.parseError.errorCode +
				"\nError Reason: " + doc.parseError.reason +
				"Error Line: " + doc.parseError.srcText);
		return true;
    }
	else if (doc.documentElement.nodeName=="parsererror")
	{
		var errStr=doc.documentElement.childNodes[0].nodeValue;
		errStr=errStr.replace(/</g, "&lt;");
		alert(errStr);
		return true;
	}
	return false;
}

function ParsejaRespostaGetCapabilities(doc, servidorGC)
{
var root, cadena, node, node2, i, j;

	if(!doc)
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu"));
		return;
	}
	if(HiHaAlgunErrorDeParsejatGetCapabilities(doc))
		return;
	root=doc.documentElement;
	if(!root) 
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu"));
		return;
	}

	//Cal comprovar que és un document de capacitats, potser és un error, en aquest cas el llegeix-ho i el mostraré directament
	if(root.nodeName!="WMT_MS_Capabilities" && root.nodeName!="WMS_Capabilities")
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu") + "rootNode: " + root.nodeName);
		return;
	}

	//Obtinc la versió de les capacitats
	cadena=root.getAttribute('version');
	servidorGC.versio={"Vers": parseInt(cadena.substr(0,1)), "SubVers": parseInt(cadena.substr(2,1)), "VariantVers": parseInt(cadena.substr(4))};

	//Obtinc el títol del servidor, és obligatòri però podria ser que algun servidor posses el tag sense valor
	servidorGC.titol="";
	node=root.getElementsByTagName('Service')[0];
	if(node)
	{
		node2=node.getElementsByTagName('Title')[0];
		if(node2 && node2.hasChildNodes())
			servidorGC.titol=node2.childNodes[0].nodeValue;
	}

	// Selecciono el node request
	node=(root.getElementsByTagName('Capability')[0]).getElementsByTagName('Request')[0];

	// Formats de visualització
	if(servidorGC.versio.Vers==1 && servidorGC.versio.SubVers==0)
	{
		node2=(node.getElementsByTagName('Map')[0]).getElementsByTagName('Format');
		for(i=0; i<node2[0].childNodes.length; i++)
		{
			cadena=node2[0].childNodes[i].nodeName;
			if(cadena.search(/JPEG/i)!=-1)			//no pot ser indexOf perquè és una regular expression
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/jpeg";
			else if(cadena.search(/GIF/i)!=-1) 	//no pot ser indexOf perquè és una regular expression
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/gif";
			else if(cadena.search(/PNG/i)!=-1)	//no pot ser indexOf perquè és una regular expression
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/png";
		}
	}
	else
	{
		node2=(node.getElementsByTagName('GetMap')[0]).getElementsByTagName('Format');
		for(i=0; i<node2.length; i++)
		{
			cadena=node2[i].childNodes[0].nodeValue;
			if(cadena)
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]=cadena;
		}
	}

	//Formats de consulta
	if(servidorGC.versio.Vers==1 && servidorGC.versio.SubVers==0)
	{
		node2=node.getElementsByTagName('FeatureInfo')[0];
		if(node2)
		{
			node2=node2.getElementsByTagName('Format');
			for(i=0; i<node2[0].childNodes.length; i++)
			{
				cadena=node2[0].childNodes[i].nodeName;
				if(cadena)
				{
					if(cadena.search(/XML/i)!=-1)					//no pot ser indexOf perquè és una regular expression
						servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]="text/xml";
					else if(cadena.search(/HTML/i)!=-1)		//no pot ser indexOf perquè és una regular expression
						servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]="text/html";
				}
			}
		}
	}
	else
	{
		node2=node.getElementsByTagName('GetFeatureInfo')[0];
		if(node2)
		{
			node2=node2.getElementsByTagName('Format');
			for(i=0; i<node2.length; i++)
			{
				cadena=node2[i].childNodes[0].nodeValue;
				if(cadena)
					servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]=cadena;
			}
		}
	}

	//Llegeix-ho les capes disponibles en el sistema de referència actual del navegador
	node=root.getElementsByTagName('Capability')[0];
	for(i=0; i<node.childNodes.length; i++)
	{
		node2=node.childNodes[i];
		if(node2.nodeName=="Layer")  //És una layer que a dins pot tenir altres layers
		{
			//Si té name vol dir que és una capa de veritat, sinó és que és una capa d'agrupació
			LlegeixLayerServidorGC(servidorGC, node2, false, null);
		}
	}
	if(servidorGC.layer.length>0)
	{
		if (servidorGC.func_after)
			servidorGC.func_after(servidorGC);
	}
	else
	{
		alert(GetMessage("ServerNotHaveLayerInBrowserReferenceSystem", "cntxmenu"));
	}
}//Fi de ParsejaRespostaGetCapabilities()


function ParsejaRespostaOAPI_MapCollection(servidorGC, collection)
{
var i, j, cadena, layer={};
var factor_k, factorpixel;

	if(!collection.links)
		return;

	if(DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)=="°")
		factorpixel=FactorGrausAMetres; // de graus a metres
	else //if(unitats=="m")
		factorpixel=1; //de m a m

	factor_k=factorpixel*1000/0.28;  //pas de unitats mapa a mm dividit per la mida de píxel

	//Això no ho puc usar perquè em dona els elements SRS de node_layer i dels seus fills node_layer.getElementsByTagName('SRS');
	layer={nom: null, 
		desc: null,
		CostatMinim: null,
		CostatMaxim: null,
		CRSs: [],
		consultable: false,
		estil: [],
		uom: null,
		vom: null,  //Variable of measure
		categories: [],
		FlagsData: null,
		i_data: 0,
		data: null,
		esCOG: false,
		EnvLL: null,
		uriDataTemplate: null,
		uriMDTemplate: null,
		dimensioExtra: null};
		
	// Miro si és un mapa
	var rel=(servidorGC.tipus=="TipusOAPI_Maps")?"http://www.opengis.net/def/rel/ogc/1.0/map":"http://www.opengis.net/def/rel/ogc/1.0/tilesets-map";
	
	if(collection.links)
	{
		for(i=0; i<collection.links.length;i++)
		{
			if(collection.links[i].rel==rel)
			{
				layer.nom=collection.id;
				layer.desc=collection.title;
				break;
			}
		}
	}
	// Comprovo els estils, potser no té un mapa en un estil per defecte però si té mapes per cada estil
	if(collection.styles)
	{
		for(i=0; i<collection.styles.length;i++)
		{
			for(j=0; j<collection.styles[i].links.length;j++)
			{
				if(collection.styles[i].links[j].rel==rel)
				{
					layer.estil[layer.estil.length]={"nom": collection.styles[i].id, "desc": collection.styles[i].title};
					if(!layer.nom)
					{
						layer.nom=collection.id;
						layer.desc=collection.title;
					}
					break;
				}
			}
		}
	}
	if(!layer.nom)
		return;
	
	// Si no s'indica cap CRS vol dir que tot està en CRS:84
	if(collection.crs && collection.crs.length)
	{
		for(i=0; i<collection.crs.length;i++)
		{
			if((cadena=DonaEPSGDeURLOpengis(collection.crs[i]))!=null &&
				DonaCRSRepresentaQuasiIguals(cadena.toUpperCase(), ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			{
				layer.CRSs.push(cadena);
			}
		}
	}
	else
	{
		if(DonaCRSRepresentaQuasiIguals("CRS:84", ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			layer.CRSs.push("CRS:84");
		else
			return;
	}
	if(layer.CRSs.length<1)
		return;
	
	if(collection.extent && collection.extent.spatial && collection.extent.spatial.bbox && collection.extent.spatial.bbox.length>0)
	{
		var env={"EnvCRS": {"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300}, "CRS": collection.extent.spatial.crs ? collection.extent.spatial.crs : "CRS:84"};
		for(i=0; i<collection.extent.spatial.bbox.length;i++)
		{
			if(env.EnvCRS.MinX>collection.extent.spatial.bbox[i][0])
				env.EnvCRS.MinX=collection.extent.spatial.bbox[i][0];
			if(env.EnvCRS.MinY>collection.extent.spatial.bbox[i][1])
				env.EnvCRS.MinY=collection.extent.spatial.bbox[i][1];
			if(collection.extent.spatial.bbox[i].length==4)
			{
				if(env.EnvCRS.MaxX<collection.extent.spatial.bbox[i][2])
					env.EnvCRS.MaxX=collection.extent.spatial.bbox[i][2];
				if(env.EnvCRS.MaxY<collection.extent.spatial.bbox[i][3])
					env.EnvCRS.MaxY=collection.extent.spatial.bbox[i][3];
			}
			else if(collection.extent.spatial.bbox[i].length==6)
			{
				if(env.EnvCRS.MaxX<collection.extent.spatial.bbox[i][3])
					env.EnvCRS.MaxX=collection.extent.spatial.bbox[i][3];
				if(env.EnvCRS.MaxY<collection.extent.spatial.bbox[i][4])
					env.EnvCRS.MaxY=collection.extent.spatial.bbox[i][4];
			}
		}
		layer.EnvLL=DonaEnvolupantLongLat(env.EnvCRS, env.CRS);
	}

	//minScaleDenominator
	if(typeof collection.minScaleDenominator==="number")
		layer.CostatMinim=collection.minScaleDenominator*factorpixel/factor_k;
	
	//maxScaleDenominator
	if(typeof collection.maxScaleDenominator==="number")
		layer.CostatMaxim=collection.maxScaleDenominator*factorpixel/factor_k;

	//MetadataURL
	//·$·
	//atribution
	//·$·
	
	//Miro si és consultable
	if(collection.queryable=='1' || collection.queryable=='true')
		layer.consultable=true;
	servidorGC.layer[servidorGC.layer.length]=layer;
	
}

function ParsejaRespostaOAPI_LandingPage(doc, servidorGC)
{
	if(!doc)
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu"));
		// tot i no tenir aquesta informació intento tirar endavant
		
		return;
	}
	servidorGC.titol=doc.title;
	if(servidorGC.func_after)
	{
		servidorGC.i_function++;
		if (servidorGC.i_function<servidorGC.func_after.length)
			servidorGC.func_after[servidorGC.i_function](servidorGC);
	}
}

function ParsejaRespostaOAPI_CollectionsOfMaps(doc, servidorGC)
{
var i;

	if(!doc)
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu"));
		return;
	}
	if(!doc.collections || doc.collections.length<1)
		alert(GetMessage("ServerNotHaveLayer", "cntxmenu"));
	
	//Llegeix-ho les capes disponibles en el sistema de referència actual del navegador
	for(i=0; i<doc.collections.length; i++)
		ParsejaRespostaOAPI_MapCollection(servidorGC, doc.collections[i]);
	
	//Formats de visualització
	//·$·
	servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/png";
	servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/jpeg";
	servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/gif";

	//Formats de consulta
	//·$·
	servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]="application/json";

	if(servidorGC.layer.length>0)
	{
		if(servidorGC.func_after)
		{
			servidorGC.i_function++;
			if (servidorGC.i_function<servidorGC.func_after.length)
				servidorGC.func_after[servidorGC.i_function](servidorGC);
		}
	}
	else
	{
		alert(GetMessage("ServerNotHaveLayerInBrowserReferenceSystem", "cntxmenu"));
	}

}

function FesPeticioOAPI_LandingPage(servidorGC)
{
	// Faig una petició de landing page per saber el nom i descripció del servidor
	var request=servidorGC.servidor;
	request=AfegeixNomServidorARequest(servidorGC.servidor, request, true, servidorGC.cors); 
	var ajax=new Ajax();
	if (window.doAutenticatedHTTPRequest && servidorGC.access)
		doAutenticatedHTTPRequest(servidorGC.access, "GET", 
				ajax, request, null, null, 
				ParsejaRespostaOAPI_LandingPage, "application/json", servidorGC);
	else
		ajax.doGet(request,
				ParsejaRespostaOAPI_LandingPage, "application/json",servidorGC);
}

function FesPeticioOAPI_CollectionsOfMaps(servidorGC)
{
	var request="/collections?f=json";
	request=AfegeixNomServidorARequest(servidorGC.servidor, request, true, servidorGC.cors);  /*Cal posar la versió i el tipus de servei a la caixa en lloc de definir-ho a foc*/
	
	var ajax=new Ajax();
	if (window.doAutenticatedHTTPRequest && servidorGC.access)
		doAutenticatedHTTPRequest(servidorGC.access, "GET", 
				ajax, request, null, null, 
				ParsejaRespostaOAPI_CollectionsOfMaps, 
				"application/json", 
				servidorGC);
	else
		ajax.doGet(request,
				ParsejaRespostaOAPI_CollectionsOfMaps, 
				"application/json",
				servidorGC);
}

function OmpleCapacitatsOAPI(servidorGC)
{
	servidorGC.i_function=0;
	if (servidorGC.i_function<servidorGC.func_after.length)
		servidorGC.func_after[servidorGC.i_function](servidorGC);
}

function FesPeticioCapacitatsIParsejaResposta(servidor, tipus, versio, suporta_cors, access, i_capa, func_after, param_func_after)
{
var request;

	if(servidor)
		servidor=servidor.trim();

	if(!servidor || servidor=="")  //Es podria mirar més a fons que l'adreça sigui vàlida
	{
		alert(GetMessage("ValidURLMustBeProvided", "cntxmenu"));
		return;
	}
	
	if(tipus=="TipusOAPI_Maps" || tipus=="TipusOAPI_MapTiles")
	{
		var functions;
		if(tipus=="TipusOAPI_Maps")
		{
			functions=[FesPeticioOAPI_CollectionsOfMaps,
						FesPeticioOAPI_LandingPage];
		}
		else
		{
			functions=[FesPeticioOAPI_CollectionsOfMaps,
						FesPeticioOAPI_LandingPage,
						FesPeticioOAPI_tileMatrixSet];
		}
		if(func_after)
			functions.push(func_after);
		
		ServidorGetCapabilities[ServidorGetCapabilities.length]={win: window,
								index: ServidorGetCapabilities.length,
								i_capa_on_afegir: i_capa,
								servidor: servidor,
								cors: suporta_cors,
								access: access ? JSON.parse(JSON.stringify(access)) : null,
								versio: null,
								tipus: tipus,
								titol: null,
								formatGetMap: [],
								formatGetFeatureInfo: [],
								tileMatrixSets:[],
								layer: [],
								func_after: functions,
								param_func_after: param_func_after};
		OmpleCapacitatsOAPI(ServidorGetCapabilities[ServidorGetCapabilities.length-1]);
		return;
	}
	
	ServidorGetCapabilities[ServidorGetCapabilities.length]={win: window,
								index: ServidorGetCapabilities.length,
								i_capa_on_afegir: i_capa,
								servidor: servidor,
								cors: suporta_cors,
								access: access ? JSON.parse(JSON.stringify(access)) : null,
								versio: null,
								tipus: tipus,
								titol: null,
								formatGetMap: [],
								formatGetFeatureInfo: [],
								tileMatrixSets:[],
								layer: [],
								func_after: func_after,
								param_func_after: param_func_after};
								
	ajaxGetCapabilities[ajaxGetCapabilities.length]=new Ajax();
	/* NJ_13_03_2023: Joan no sé per quin motiu es va afegir això aquí però amb això no em deixa decidir com tractar aquest servei, i 
	volen que les capes es puguin afegir les generals i les validades per usuari, així que ho trec. 
	if (!access && ServidorGetCapabilities[ServidorGetCapabilities.length-1].servidor=="https://geoserver-wqems.opsi.lecce.it/geoserver/wms")
		ServidorGetCapabilities[ServidorGetCapabilities.length-1].access={"tokenType": "wqems", "request": ["capabilities", "map"]}; */

	request="REQUEST=GetCapabilities&VERSION=";
	if(typeof versio==="object" && versio)
		request+=DonaVersioComAText(versio);
	else
		request+=versio	? versio : "1.1.0";
	request+="&SERVICE="
	if (tipus=="TipusWMS" || tipus=="TipusWMS_C")
		request+="WMS";
	else if (tipus=="TipusWMTS_KVP")
		request+="WMTS";
	else if (tipus=="TipusWFS")
		request+="WFS";
	else if (tipus=="TipusSOS")
		request+="SOS";

	request=AfegeixNomServidorARequest(servidor, request, true, suporta_cors);  /*Cal posar la versió i el tipus de servei a la caixa en lloc de definir-ho a foc*/
	
	if (window.doAutenticatedHTTPRequest && ServidorGetCapabilities[ServidorGetCapabilities.length-1].access)
		doAutenticatedHTTPRequest(ServidorGetCapabilities[ServidorGetCapabilities.length-1].access, "GET", 
				ajaxGetCapabilities[ajaxGetCapabilities.length-1], request, null, null, 
				ParsejaRespostaGetCapabilities, 
				"text/xml", 
				ServidorGetCapabilities[ServidorGetCapabilities.length-1]);
	else
		ajaxGetCapabilities[ajaxGetCapabilities.length-1].doGet(request,
				ParsejaRespostaGetCapabilities, 
				"text/xml",
				ServidorGetCapabilities[ServidorGetCapabilities.length-1]);
}//Fi de FesPeticioCapacitatsIParsejaResposta()
