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

    Copyright 2001, 2022 Xavier Pons

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

//Suporta totes les version de WMS
function LlegeixLayerServidorGC(servidorGC, node_layer, sistema_ref_comu, pare)
{
var i, j, k, node2, node3, trobat=false, cadena, cadena2, layer;
var minim, maxim, factor_k, factorpixel, CRSs=[];
var str_uom="UnitOfMeasure:", str_vom="SubService:", str_valueMeaning="ValueMeaning:"

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
					CRSs.push(cadena.toUpperCase());
					trobat=true;
				}
			}
		}
	}

	if(trobat || sistema_ref_comu)
	{
		for(i=0; i<node_layer.childNodes.length; i++)
		{
			node2=node_layer.childNodes[i];
			if(node2.nodeName=="Name")
			{
				//Llegeix-ho la capa si té name
				servidorGC.layer[servidorGC.layer.length]={nom: null, 
									desc: null,
									CostatMinim: null,
									CostatMaxim: null,
									CRSs: CRSs.length ? CRSs : null,
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
				layer=servidorGC.layer[servidorGC.layer.length-1];
				layer.nom=node2.childNodes[0].nodeValue;
				
				if(pare) //hereto les coses del pare si s'ha de fer
				{
					if(pare.consultable)
						layer.consultable=true;
					if(pare.estil)
					{
						for(j=0; j<pare.estil.length; j++)
							layer.estil[layer.estil.length]=pare.estil[j];
					}
					layer.CostatMinim=pare.CostatMinim;
					layer.CostatMaxim=pare.CostatMaxim;
					layer.dimensioExtra=JSON.parser(JSON.stringify(pare.dimensioExtra));
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
					layer.desc=node2.childNodes[0].nodeValue;
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
				else if (node2.nodeName=="KeywordList")
				{
					if (node2.childNodes)
					{
						for(j=0; j<node2.childNodes.length; j++)
						{
							node3=node2.childNodes[j];
							if (node3.nodeName=="Keyword")
							{
								cadena=node3.childNodes[0].nodeValue;
								//Cas excepcional dels acords que WQeMS per obtenir les unitats i la descripció dels valors.
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
									OmpleDataJSONAPartirDeDataISO8601(data_defecte, temps_defecte);
								layer.data=[];
								dates=valors_temps.split(",");
								for(j=0; j<dates.length; j++)
								{
									if(j==0)
									{
										layer.FlagsData=OmpleDataJSONAPartirDeDataISO8601(layer.data[layer.data.length],
														dates[j]);
									}
									else
										OmpleDataJSONAPartirDeDataISO8601(layer.data[layer.data.length],
														dates[j]);
									if(data_defecte && layer.data[layer.data.length-1]==data_defecte)
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
var root, cadena, node, node2, i, j

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

	//Selecciono el node request
	node=(root.getElementsByTagName('Capability')[0]).getElementsByTagName('Request')[0];

	//Formats de visualització
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

function FesPeticioCapacitatsIParsejaResposta(servidor, tipus, versio, access, i_capa, func_after, param_func_after)
{
var request;

	if(servidor)
		servidor=servidor.trim();

	if(!servidor || servidor=="")  //Es podria mirar més a fons que l'adreça sigui vàlida
	{
		alert(GetMessage("ValidURLMustBeProvided", "cntxmenu"));
		return;
	}
	ajaxGetCapabilities[ajaxGetCapabilities.length]=new Ajax();
	ServidorGetCapabilities[ServidorGetCapabilities.length]={win: window,
								index: ServidorGetCapabilities.length,
								i_capa_on_afegir: i_capa,
								servidor: servidor,
								access: access ? JSON.parse(JSON.stringify(access)) : null,
								versio: null,
								tipus: tipus,
								titol: null,
								formatGetMap: [],
								formatGetFeatureInfo: [],
								layer: [],
								func_after: func_after,
								param_func_after: param_func_after};
	if (!access && ServidorGetCapabilities[ServidorGetCapabilities.length-1].servidor=="https://geoserver-wqems.opsi.lecce.it/geoserver/wms")
		ServidorGetCapabilities[ServidorGetCapabilities.length-1].access={"tokenType": "wqems", "request": ["capabilities", "map"]};

	request="REQUEST=GetCapabilities&VERSION="
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
	request=AfegeixNomServidorARequest(servidor, request, true, true  /*Cal posar la versió i el tipus de servei a la caixa en lloc de definir-ho a foc*/);
	if (window.doAutenticatedHTTPRequest && ServidorGetCapabilities[ServidorGetCapabilities.length-1].access)
		doAutenticatedHTTPRequest(ServidorGetCapabilities[ServidorGetCapabilities.length-1].access, "GET", ajaxGetCapabilities[ajaxGetCapabilities.length-1], request, null, null, ParsejaRespostaGetCapabilities, "text/xml", ServidorGetCapabilities[ServidorGetCapabilities.length-1]);
	else
		ajaxGetCapabilities[ajaxGetCapabilities.length-1].doGet(request,
				ParsejaRespostaGetCapabilities, "text/xml",
				ServidorGetCapabilities[ServidorGetCapabilities.length-1]);
}//Fi de FesPeticioCapacitatsIParsejaResposta
