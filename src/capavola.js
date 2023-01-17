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

    Copyright 2001, 2021 Xavier Pons

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
/*This module deals with "capa" that are volatile such as
   * the query by location "cross" (most of the code is in consult.js)
   * the goto a coordinate
   * edition (the status of this code is uncertain due to the time we do not use it (last used in the cetatis map browser
   * current position (reported by the GPS, introduced in 05-01-2020)
*/

"use strict"

var FormAnarCoord={};

function OmpleFinestraAnarCoordenada()
{
var cdns=[];
	cdns.push("<form name=\"AnarCoord\" onSubmit=\"return false;\"><table class=\"Verdana11px\" width=\"100%\"><tr><td align=\"center\">",
			"<input name=\"proj\" type=\"radio\" value=\"0\" id=\"proj_anarcoord\"",
			(FormAnarCoord.proj ? "checked" : "") ,
			" onClicK=\"CanviaEtiquetesAnarCoord(0);\"><label for=\"proj_anarcoord\" >",
			(GetMessage("Proj", "capavola")),
			"</label>  <input name=\"proj\" type=\"radio\" value=\"1\" id=\"longlat_anarcoord\"",
			(FormAnarCoord.proj ? "" : "checked"),
			" onClicK=\"CanviaEtiquetesAnarCoord(1);\"><label for=\"longlat_anarcoord\" >Long/Lat</label></td></tr>");
	if (typeof ParamCtrl.ICapaVolaGPS !== "undefined")
		cdns.push("<tr><td align=\"center\"><input class=\"Verdana11px\" type=\"button\" name=\"Acceptar\" value=\"",
			(GetMessage("DeviceLocation", "capavola")),
			"\" onClick=\"AnarACoordGPS(form);\"></td></tr>");
	cdns.push("<tr><td align=\"right\"><label id=\"X_anarcoord\" for=\"coordX_anarcoord\">X: </label><input class=\"Verdana11px\" id=\"coordX_anarcoord\" name=\"coordX\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.x,"\"><label id=\"Y_anarcoord\" for=\"coordY_anarcoord\"> Y: </label><input class=\"Verdana11px\" id=\"coordY_anarcoord\" name=\"coordY\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.y,"\"></td></tr><tr><td align=\"right\"><label for=\"mVoltant_anarcoord\">",
			(GetMessage("AroundZone", "capavola")), " (m):",
			" </label><input class=\"Verdana11px\" id=\"mVoltant_anarcoord\" name=\"mVoltant\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.m_voltant,"\"></td></tr>",
		"<tr><td align=\"center\"><input class=\"Verdana11px\" type=\"button\" name=\"Acceptar\" value=\"",
			(GetMessage("GoTo", "capavola")),
			"\" onClick=\"AnarACoordenada(form);\">",
			"<input class=\"Verdana11px\" type=\"button\" name=\"Tancar\" value=\"",
			(GetMessage("Close")),
			"\" onClick='TancaFinestraLayer(\"anarCoord\");'></td></tr></table></form>");
	contentFinestraLayer(window, "anarCoord", cdns.join(""));
}//Fi de OmpleFinestraAnarCoordenada()

function MostraFinestraAnarCoordenada()
{
	if (!ObreFinestra(window, "anarCoord", GetMessage("ofGoToCoordinate", "capavola")))
		return;
	OmpleFinestraAnarCoordenada();
	if (typeof ParamCtrl.ICapaVolaAnarCoord !== "undefined")
	{
		ParamCtrl.capa[ParamCtrl.ICapaVolaAnarCoord].visible="no";
		CreaVistes();
	}
}

function MostraFinestraAnarCoordenadaEvent(event) //Afegit Cristian 19/01/2016
{
	MostraFinestraAnarCoordenada()
	dontPropagateEvent(event)
}//Fi de MostraFinestraAnarCoordenada()

//No usar: Useu TancaFinestraLayer("anarCoord");
function TancaFinestra_anarCoord()
{
	if (typeof ParamCtrl.ICapaVolaAnarCoord !== "undefined")
	{
	   ParamCtrl.capa[ParamCtrl.ICapaVolaAnarCoord].visible="no";
	   CreaVistes();
	}
}//Fi de TancaFinestra_anarCoord()

function CanviaEtiquetesAnarCoord(sel)
{
	if(sel == 0)
	{
		window.document.getElementById('X_anarcoord').innerHTML = "X: ";
		window.document.getElementById('Y_anarcoord').innerHTML = "Y: ";
	}
	else
	{
		window.document.getElementById('X_anarcoord').innerHTML = "Lon: ";
		window.document.getElementById('Y_anarcoord').innerHTML = "Lat: ";
	}
}//Fi de CanviaEtiquetesAnarCoord()

function AnarAObjVectorialTaula(longitud, latitud)
{
var d, punt_coord;

	if(isNaN(longitud) || isNaN(latitud))
	{
  	   alert(GetMessage("CoordIncorrectFormat", "capavola") + ":\n" + GetMessage("NumericalValueMustBeIndicated", "capavola") + ".");
	   return;
	}
	punt_coord=DonaCoordenadesCRS(longitud, latitud, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);	

	if(!EsPuntDinsAmbitNavegacio(punt_coord))
	{
  	   alert(GetMessage("RequestedPointOutsideBrowserEnvelope", "capavola"));
	   return;
	}

	//Dibuixo la icona per mostrar el punt consultat
	/*if (typeof ParamCtrl.ICapaVolaAnarCoord !== "undefined")
	{
		var capa=ParamCtrl.capa[ParamCtrl.ICapaVolaAnarCoord];
		capa.objectes.features[0].geometry.coordinates[0]=punt_coord.x;
		capa.objectes.features[0].geometry.coordinates[1]=punt_coord.y;
		capa.objectes.features[0].properties.radius=d;
		capa.visible="si";
		CreaVistes();
	}*/
	// Constant a 1000m per a una bona visualització del punt i dels voltants.
	d=1000;
	if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
		d/=FactorGrausAMetres;
	var env=DonaEnvDeXYAmpleAlt(punt_coord.x, punt_coord.y, d, d);
	PortamAAmbit(env);
	
	//PortamAPunt(punt_coord.x,punt_coord.y);
}

function AnarACoordenada(form)
{
var d, crs_xy;
var punt_coord={x: parseFloat(form.coordX.value), y: parseFloat(form.coordY.value)};

	if(isNaN(punt_coord.x) || isNaN(punt_coord.y))
	{
  	   alert(GetMessage("CoordIncorrectFormat", "capavola") + ":\n" + GetMessage("NumericalValueMustBeIndicated", "capavola") + ".");
	   return;
	}

	FormAnarCoord.x=punt_coord.x;
	FormAnarCoord.y=punt_coord.y;

	//Ho transformo si cal de long/lat a les coordenades de la projecció
	if(form.proj[1].checked)
	{
   	   crs_xy=DonaCoordenadesCRS(punt_coord.x,punt_coord.y,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	   punt_coord.x=crs_xy.x;
	   punt_coord.y=crs_xy.y;
	   FormAnarCoord.proj=false;
	}
	else
	   FormAnarCoord.proj=true;

	if(!EsPuntDinsAmbitNavegacio(punt_coord))
	{
  	   alert(GetMessage("RequestedPointOutsideBrowserEnvelope", "capavola"));
	   return;
	}

	d=parseFloat(form.mVoltant.value);
	if(isNaN(d))
	    d=0;
	FormAnarCoord.m_voltant=d;

	//Dibuixo la icona per mostrar el punt consultat
	if (typeof ParamCtrl.ICapaVolaAnarCoord !== "undefined")
	{
		var capa=ParamCtrl.capa[ParamCtrl.ICapaVolaAnarCoord];
		capa.objectes.features[0].geometry.coordinates[0]=punt_coord.x;
		capa.objectes.features[0].geometry.coordinates[1]=punt_coord.y;
		capa.objectes.features[0].properties.radius=d;
		//if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
		//	capa.objectes.features[0].properties.radius/=FactorGrausAMetres;
		capa.visible="si";
		CreaVistes();
	}

	if(d>0)
	{
		d*=1.7;
		if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			d/=FactorGrausAMetres;
		var env=DonaEnvDeXYAmpleAlt(punt_coord.x, punt_coord.y, d, d);
		//env=AjustaAmbitAAmbitNavegacio(env);
		PortamAAmbit(env);
	}
	else
	{
	   PortamAPunt(punt_coord.x,punt_coord.y);
	}
}//Fi de AnarACoordenada()

function TransformaCoordenadesCapaVolatil(capa, crs_ori, crs_dest)
{
var punt;
	punt={"x": capa.objectes.features[0].geometry.coordinates[0],
		"y": capa.objectes.features[0].geometry.coordinates[1]}
	TransformaCoordenadesPunt(punt, crs_ori, crs_dest);
	capa.objectes.features[0].geometry.coordinates[0]=punt.x;
	capa.objectes.features[0].geometry.coordinates[1]=punt.y;
	capa.CRSgeometry=crs_dest;
}

function TransformaCoordenadesCapesVolatils(crs_ori, crs_dest)
{
	if (typeof ParamCtrl.ICapaVolaPuntConsult !== "undefined")
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ParamCtrl.ICapaVolaPuntConsult], crs_ori, crs_dest);
	if (typeof ParamCtrl.ICapaVolaAnarCoord !== "undefined")
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ParamCtrl.ICapaVolaAnarCoord], crs_ori, crs_dest);
	if (typeof ParamCtrl.ICapaVolaEdit !== "undefined")
	{
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ParamCtrl.ICapaVolaEdit], crs_ori, crs_dest);
		if(ParamCtrl.BarraBotoInsereix && ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
			IniciaFinestraEditarPunts();
	}
	if (typeof ParamCtrl.ICapaVolaGPS !== "undefined")
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ParamCtrl.ICapaVolaGPS], crs_ori, crs_dest);
}

function EsIndexCapaVolatil(i_capa, param_ctrl)
{
	if (param_ctrl.ICapaVolaPuntConsult==i_capa || param_ctrl.ICapaVolaAnarCoord==i_capa || param_ctrl.ICapaVolaEdit==i_capa || param_ctrl.ICapaVolaGPS==i_capa)
		return true;
	else
		return false;
}

function EliminaIndexDeCapesVolatils(param_ctrl)
{
	if(typeof param_ctrl.ICapaVolaPuntConsult !== "undefined")
		delete param_ctrl.ICapaVolaPuntConsult;
	if(typeof param_ctrl.ICapaVolaAnarCoord !== "undefined")
		delete param_ctrl.ICapaVolaAnarCoord;
	if(typeof param_ctrl.ICapaVolaEdit !== "undefined")
		delete param_ctrl.ICapaVolaEdit;
	if(typeof param_ctrl.ICapaVolaGPS !== "undefined")
		delete param_ctrl.ICapaVolaGPS;
}

function NumeroDeCapesVolatils(i_capa)
{
	var i=0;

	if (i_capa==-1)  //nombre de capes total
	{
		if (typeof ParamCtrl.ICapaVolaPuntConsult !== "undefined")
			i++;
		if (typeof ParamCtrl.ICapaVolaAnarCoord !== "undefined")
			i++;
		if (typeof ParamCtrl.ICapaVolaEdit !== "undefined")
			i++;
		if (typeof ParamCtrl.ICapaVolaGPS !== "undefined")
			i++;
		return i;
	}

	if (typeof ParamCtrl.ICapaVolaPuntConsult !== "undefined" && ParamCtrl.ICapaVolaPuntConsult<i_capa)
		i++;
	if (typeof ParamCtrl.ICapaVolaAnarCoord !== "undefined" && ParamCtrl.ICapaVolaAnarCoord<i_capa)
		i++;
	if (typeof ParamCtrl.ICapaVolaEdit !== "undefined" && ParamCtrl.ICapaVolaEdit<i_capa)
		i++;
	if (typeof ParamCtrl.ICapaVolaGPS !== "undefined" && ParamCtrl.ICapaVolaGPS<i_capa)
		i++;
	return i;
}

function EliminaCapaVolatil(i_capa, param_ctrl)
{
	param_ctrl.capa.splice(i_capa, 1);
	if (param_ctrl.ICapaVolaPuntConsult==i_capa)
		delete param_ctrl.ICapaVolaPuntConsult;
	if (param_ctrl.ICapaVolaAnarCoord==i_capa)
		delete param_ctrl.ICapaVolaAnarCoord;
	if (param_ctrl.ICapaVolaEdit==i_capa)
		delete param_ctrl.ICapaVolaEdit;
	if (param_ctrl.ICapaVolaGPS==i_capa)
		delete param_ctrl.ICapaVolaGPS;
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, -1, param_ctrl);  /* els indexos que apuntin a 'i_capa' ja no existeixen en absolut. Intentar moure'ls no sembla una bona idea i per tant uso i_capa+1.
						No uso AvisaDeCapaAmbIndexosACapaEsborrada() (tal com recomana CanviaIndexosCapesSpliceCapa() perquè generalment les capes volatils són desconegudes a l'usuari
						i no hi hauria d'haver índexos des de altres capes) */
}

//Generalment, aquesta funcio no resulta útil. Considereu usar CanviaIndexosCapesSpliceCapa() que canvia tots els índexos a totes les capes i crida aquesta funció al final.
function CanviaIndexosCapesVolatils(n_moviment, i_capa_ini, i_capa_fi_per_sota, param_ctrl)
{
	if (typeof i_capa_fi_per_sota==="undefined")
		var i_capa_fi_per_sota=i_capa_ini+1;

	if (typeof param_ctrl.ICapaVolaPuntConsult !== "undefined" && param_ctrl.ICapaVolaPuntConsult>=i_capa_ini && param_ctrl.ICapaVolaPuntConsult<i_capa_fi_per_sota)
		param_ctrl.ICapaVolaPuntConsult+=n_moviment;
	if (typeof param_ctrl.ICapaVolaAnarCoord !== "undefined" && param_ctrl.ICapaVolaAnarCoord>=i_capa_ini && param_ctrl.ICapaVolaAnarCoord<i_capa_fi_per_sota)
		param_ctrl.ICapaVolaAnarCoord+=n_moviment;
	if (typeof param_ctrl.ICapaVolaEdit !== "undefined" && param_ctrl.ICapaVolaEdit>=i_capa_ini && param_ctrl.ICapaVolaEdit<i_capa_fi_per_sota)
		param_ctrl.ICapaVolaEdit+=n_moviment;
	if (typeof param_ctrl.ICapaVolaGPS !== "undefined" && param_ctrl.ICapaVolaGPS>=i_capa_ini && param_ctrl.ICapaVolaGPS<i_capa_fi_per_sota)
		param_ctrl.ICapaVolaGPS+=n_moviment;
}

function CreaCapesVolatils()
{
	var i_nova_capa=0;

	if (!ParamCtrl.IconaConsulta)
		ParamCtrl.IconaConsulta={"icona": "mes.gif", "ncol": 9, "nfil": 9, "i": 5, "j": 5};
	if (typeof ParamCtrl.ICapaVolaPuntConsult === "undefined")
	{
		ParamCtrl.ICapaVolaPuntConsult=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(ParamCtrl.ICapaVolaPuntConsult, 0, {
					"servidor": null,
					"versio": null,
					"model": model_vector,
					"nom": null,
					"desc": null,
					"CRSgeometry": ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,
					"objectes": {
						"type": "FeatureCollection",
						"features":[{
							"id": null,
							"data": null,
							//"i_simbol": 0,
							"geometry": {
								"type": "Point",
								"coordinates": [0,0]
							},
							"properties": {},
						}]
					},
					"estil": [{
						"nom": null,
						"desc":	null,
						"DescItems": null,
						"simbols": [{
							"NomCamp": null,
							"simbol": [{"ValorCamp": null, "icona": JSON.parse(JSON.stringify(ParamCtrl.IconaConsulta)), "IconaSel": (ParamCtrl.IconaValidacio ? JSON.parse(JSON.stringify(ParamCtrl.IconaValidacio)) : null)}]
						}],
						"ItemLleg": null,
						"ncol": 1
					}],
					"i_estil": 0,
					"NColEstil": 1,
					"separa": null,
					"DescLlegenda": null,
					"LlegDesplegada": false,
					"VisibleALaLlegenda": false,
					"visible": "no",
					"consultable": "no",
					"editable": "no",
					"FuncioEdicio": null,
					"metadades": null
				});
		CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1, ParamCtrl);
	}
	if (!ParamCtrl.IconaEdicio)
		ParamCtrl.IconaEdicio={"icona": "mes.gif", "ncol": 9, "nfil": 9, "i": 5, "j": 5};
	if (typeof ParamCtrl.ICapaVolaEdit === "undefined")
	{
		ParamCtrl.ICapaVolaEdit=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(ParamCtrl.ICapaVolaEdit, 0, {
					"servidor": null,
					"versio": null,
					"model": model_vector,
					"nom": null,
					"desc": null,
					"CRSgeometry": ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,
					"objectes": {
						"type": "FeatureCollection",
						"features": [{
							"id": null,
							"data": null,
							//"i_simbol": 0,
							"geometry": {
								"type": "Point",
								"coordinates": [0,0]
							},
							"properties": {},
						}]
					},
					"estil": [{
						"nom": null,
						"desc":	null,
						"DescItems": null,
						"simbols": [{
							"NomCamp": null,
							"simbol":[{
								"ValorCamp": null,
								"icona": JSON.parse(JSON.stringify(ParamCtrl.IconaEdicio))
							}]
						}],
						"ItemLleg":	null,
						"ncol": 1,
					}],
					"i_estil": 0,
					"NColEstil": 1,
					"separa": null,
					"DescLlegenda": null,
					"LlegDesplegada": false,
					"VisibleALaLlegenda": false,
					"visible": "no",
					"consultable": "no",
					"editable": "no",
					"FuncioEdicio": null,
					"metadades": null
				});
		CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1, ParamCtrl);
	}
	if (!ParamCtrl.IconaAnarCoord)
		ParamCtrl.IconaAnarCoord={"icona": "mes.gif", "ncol": 9, "nfil": 9, "i": 5, "j": 5};
	if (typeof ParamCtrl.ICapaVolaAnarCoord === "undefined")
	{
		ParamCtrl.ICapaVolaAnarCoord=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(ParamCtrl.ICapaVolaAnarCoord, 0, {
					"servidor": null,
					"versio": null,
					"model": model_vector,
					"nom": null,
					"desc": null,
					"CRSgeometry": ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,
					"objectes": {
						"type": "FeatureCollection",
						"features": [{
							"id": null,
							"data": null,
							//"i_simbol": 0,
							"geometry": {
								"type": "Point",
								"coordinates": [0, 0]
							},
							"properties": {
								"radius": 1
							},
						}]
					},
					"atributs": [
						{
							"nom": "radius",
							"descripcio": "Buffer",
							"unitats": "m",
							"mostrar": "si"
						}
					],
					"estil": [{
						"nom": null,
						"desc":	null,
						"DescItems": null,
						"simbols": [
							{
								"NomCampFEscala": "radius",
								"simbol":
								[
									{
										"icona":
										{
											"type": "circle",
											"r": 1,
											"unitats": "m"
										}
									}
								]
							},{
							"NomCamp": null,
							"simbol": [{"ValorCamp": null, "icona": JSON.parse(JSON.stringify(ParamCtrl.IconaAnarCoord))}]
							}
						],
						"formes":[
							{
								"vora":
								{
									"paleta": {
										"colors": [
											"#BB8888"
										]
									}
								}
							}
						],
						"ItemLleg": null,
						"ncol": 1
					}],
					"i_estil": 0,
					"NColEstil": 1,
					"separa": null,
					"DescLlegenda": null,
					"LlegDesplegada": false,
					"VisibleALaLlegenda": false,
					"visible": "no",
					"consultable": "no",
					"editable": "no",
					"FuncioEdicio": null,
					"metadades": null
				});
		CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1, ParamCtrl);
	}
	if (typeof ParamCtrl.MostraPosicioGPS ==="undefined" || (ParamCtrl.MostraPosicioGPS!=null && ParamCtrl.MostraPosicioGPS!=false))
	{
		if (!ParamCtrl.IconaPosicioGPS)
			ParamCtrl.IconaPosicioGPS={"icona": "mesgps.png", "ncol": 24, "nfil": 13, "i": 5, "j": 5};
		if (typeof ParamCtrl.ICapaVolaGPS === "undefined")
		{
			ParamCtrl.ICapaVolaGPS=i_nova_capa;
			i_nova_capa++;
			ParamCtrl.capa.splice(ParamCtrl.ICapaVolaGPS, 0, {
					"servidor": null,
					"versio": null,
					"model": model_vector,
					"nom": null,
					"desc": null,
					"CRSgeometry": ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,
					"objectes": {
						"type": "FeatureCollection",
						"features": [{
							"id": null,
							"data": null,
							//"i_simbol": 0,
							"geometry": {
								"type": "Point",
								"coordinates": [0, 0]
							},
							"properties": {
								"uncertainty": 0.0
							},
						}]
					},
					"atributs": [
						{
							"nom": "uncertainty",
							"descripcio": "Uncertainty",
							"unitats": "m",
							"mostrar": "si"
						}
					],
					"estil": [{
						"nom": null,
						"desc":	null,
						"DescItems": null,
						"simbols": [
							{
								"NomCampFEscala": "uncertainty",
								"simbol":
								[
									{
										"icona":
										{
											"type": "circle",
											"r": 1,
											"unitats": "m"
										}
									}
								]
							},{
								"NomCamp": null,
								"simbol": [{"ValorCamp": null, "icona": JSON.parse(JSON.stringify(ParamCtrl.IconaPosicioGPS))}]
							}
						],
						"formes": [
							{
								"vora":
								{
									"paleta": {
										"colors": [
											"#FF0000"
										]
									}
								}
							}
						],
						"ItemLleg": null,
						"ncol": 1
					}],
					"i_estil": 0,
					"NColEstil": 1,
					"separa": null,
					"DescLlegenda": null,
					"LlegDesplegada": false,
					"VisibleALaLlegenda": false,
					"visible": "si",
					"consultable": "no",
					"editable": "no",
					"FuncioEdicio": null,
					"metadades": null
				});
			CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1, ParamCtrl);
		}
	}
}

function EditarPunts(event_de_click, i_nova_vista)
{
//	PuntConsultat.i=DonaCoordIDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX)
//	PuntConsultat.j=DonaCoordJDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY)

//	alert(event_de_click.clientY + " : " + PuntConsultat.j);
	PuntConsultat.x=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
	PuntConsultat.y=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
	PuntConsultat.i_nova_vista=i_nova_vista;

	if (ParamCtrl.IconaEdicio)
	{
	 	var capa=ParamCtrl.capa[ParamCtrl.ICapaVolaEdit];
		capa.objectes.features[0].geometry.coordinates[0]=PuntConsultat.x;
		capa.objectes.features[0].geometry.coordinates[1]=PuntConsultat.y;
		capa.objectes.features[0].seleccionat=false;
		capa.visible="si";

		CreaVistes();
	}
	if (ParamCtrl.BarraBotoInsereix)
		IniciaFinestraEditarPunts();
	else if(typeof ParamCtrl.ICapaVolaEdit !== "undefined"  && ParamCtrl.capa[ParamCtrl.ICapaVolaEdit].FuncioEdicio)
		eval(ParamCtrl.capa[ParamCtrl.ICapaVolaEdit].FuncioEdicio);

}//Fi de EditarPunts()

function IniciaFinestraEditarPunts()
{
	if(!ParamCtrl.FuncioIconaEdicio)
		 return;

	var elem=ObreFinestra(window, "editarVector", GetMessage("toInsertNewPoints", "capavola"));
	if (!elem)
		return;
	contentLayer(elem, eval(ParamCtrl.FuncioIconaEdicio));
}

function TancaFinestra_editarVector()
{
	if (typeof ParamCtrl.ICapaVolaEdit !== "undefined")
	{
		var elem, i_vista;
		ParamCtrl.capa[ParamCtrl.ICapaVolaEdit].visible="no";
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			if (EsCapaVisibleEnAquestaVista(i_vista, ParamCtrl.ICapaVolaEdit))
			{
				elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+ParamCtrl.ICapaVolaEdit);
				if(isLayer(elem))
					removeLayer(elem);
			}
		}
	}
}



/* El dia 06-02-2018 descubreixo aquesta funció però no tinc idea de a que es refereix i la esborro. (JM)
function MostraFinestraInserta()
{
	if (!ObreFinestra(window, "inserta", DonaCadenaLang({"cat":"d'inserir",
							  "spa":"de insertar",
							  "eng":"of inserting",
							  "fre":"d'insertion"})))
		return;
	OmpleFinestraInserta(elem);
}*/

var IdPositionGPS=0;
function IniciaPosicioGPS()
{
	if (typeof ParamCtrl.ICapaVolaGPS !== "undefined")
	{
		if("https:"!=location.protocol.toLowerCase())
		{
			// Decideixo no dir res perquè l'usuari final no en té la culpa de que el navegador sigui http i no https
			//alert("Geolocation is not supported by this browser.");
			CancelaPosicioGPS();
			return;
		}
		if (navigator.geolocation)
			IdPositionGPS=navigator.geolocation.watchPosition(ActualitzaPosicioGPS, ErrorPosicioGPS, {enableHighAccuracy: true, maximumAge: 8000});
		else
		{
			alert(GetMessage("GeolocationNotSupportedByBrowser","capavola"));
			CancelaPosicioGPS();
		}
	}
}

var PreviousGPSPoint={x:1e300, y:1e300}, PreviousGPSCRS="";

function ActualitzaPosicioGPS(position)
{
	if (typeof ParamCtrl.ICapaVolaGPS === "undefined")
		return

	var punt=DonaCoordenadesCRS(position.coords.longitude, position.coords.latitude, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	var capa=ParamCtrl.capa[ParamCtrl.ICapaVolaGPS];
	capa.objectes.features[0].geometry.coordinates[0]=punt.x;
	capa.objectes.features[0].geometry.coordinates[1]=punt.y;
	//For the moment, a field can not be used to define the radius of the circle, so I have to do it here. This would be fixed.
	capa.objectes.features[0].properties.uncertainty=position.coords.accuracy;
	//if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
	//	capa.objectes.features[0].properties.uncertainty/=FactorGrausAMetres;
	//Avoiding unnecessary redrawings
	if (PreviousGPSCRS==ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS && Math.abs(PreviousGPSPoint.x-punt.x)<ParamInternCtrl.vista.CostatZoomActual*2 && Math.abs(PreviousGPSPoint.y-punt.y)<ParamInternCtrl.vista.CostatZoomActual*2)
		return;
	PreviousGPSPoint={x: punt.x, y: punt.y};
	PreviousGPSCRS=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS;
	CreaVistes();
}

function AnarACoordGPS(form)
{
	if (typeof ParamCtrl.ICapaVolaGPS === "undefined")
		return;

	var capa=ParamCtrl.capa[ParamCtrl.ICapaVolaGPS];

	form.coordX.value=capa.objectes.features[0].geometry.coordinates[0];
	form.coordY.value=capa.objectes.features[0].geometry.coordinates[1];
	form.mVoltant.value=capa.objectes.features[0].properties.uncertainty*4;
	form.proj[0].checked=true;
	form.proj[1].checked=false;
	CanviaEtiquetesAnarCoord(0);
}

function CancelaPosicioGPS()
{
	if (typeof ParamCtrl.ICapaVolaGPS !== "undefined")
	{
		//Potser seria millor apagar la visualització de les capes i prou?
		EliminaCapaVolatil(ParamCtrl.ICapaVolaGPS, ParamCtrl);
		ParamCtrl.MostraPosicioGPS=false;
		if (IdPositionGPS)
			navigator.geolocation.clearWatch(IdPositionGPS);
		CreaLlegenda();  //La llegenda te indexos que han quedat malament.
	}
}

function ErrorPosicioGPS(error)
{
	switch(error.code)
	{
		case error.PERMISSION_DENIED:
	      	alert(GetMessage("UserDeniedRequestGeolocation", "capavola"));
			CancelaPosicioGPS();
			break;
		case error.POSITION_UNAVAILABLE:
      		alert(GetMessage("LocationInfoUnavailable", "capavola"));
			CancelaPosicioGPS();
      		break;
		case error.TIMEOUT:
			alert(GetMessage("RequestGetUserLocationTimedOut", "capavola"));
			CancelaPosicioGPS();
			break;
		case error.UNKNOWN_ERROR:
		default:
			alert(GetMessage("UnknownErrorObtainingLocation", "capavola")+" (" + error.code + ").");
			break;
	}
}
