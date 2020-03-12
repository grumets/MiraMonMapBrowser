/* 
    This file is part of MiraMon Map Browser.
    MiraMon Map Browser is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MiraMon Map Browser.  If not, see "http://www.gnu.org/licenses/".

    Copyright 2001, 2020 Xavier Pons

    Aquest codi JavaScript ha estat realitzat per Joan Masó Pau 
    (joan maso at uab cat) i Nuria Julià (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del Centre
    de recerca i aplicacions forestals (CREAF) que elabora programari de 
    Sistema d'Informació Geogràfica i de Teledetecció per a la 
    visualització, consulta, edició i anàlisi de mapes ràsters i 
    vectorials. Elabora programari d'escriptori i també servidors i clients 
    per Internet. No tots aquests productes són gratuïts o de codi obert. 
    En particular, el Navegador de Mapes del MiraMon (client per Internet) 
    es distribueix sota els termes de la llicència "GNU General Public 
    License". Es pot actualitzar des de www.creaf.uab.cat/miramon/mmn
*/

/*This module deals with "capa" that are volatile such as 
   * the query by location "cross" (most of the code is in consult.js)
   * the goto a coordinate
   * edition (the status of this code is uncertain due to the time we do not use it (last used in the cetatis map browser
   * current position (reported by the GPS, introduced in 05-01-2020)
*/

"use strict"

var ICapaVolaPuntConsult=-1, ICapaVolaAnarCoord=-1, ICapaVolaEdit=-1, ICapaVolaGPS=-1;

var FormAnarCoord={};

function OmpleFinestraAnarCoordenada()
{
var cdns=[];
	cdns.push("<form name=\"AnarCoord\" onSubmit=\"return false;\"><table class=\"Verdana11px\" width=\"100%\"><tr><td align=\"center\">",
			"<input name=\"proj\" type=\"radio\" value=\"0\" id=\"proj_anarcoord\"",
			(FormAnarCoord.proj ? "checked" : "") ,
			" onClicK=\"CanviaEtiquetesAnarCoord(0);\"><label for=\"proj_anarcoord\" >",
			(DonaCadenaLang({"cat":"Proj", "spa":"Proy", "eng":"Proj","fre":"Proj"})),
			"</label>  <input name=\"proj\" type=\"radio\" value=\"1\" id=\"longlat_anarcoord\"",
			(FormAnarCoord.proj ? "" : "checked"), 
			" onClicK=\"CanviaEtiquetesAnarCoord(1);\"><label for=\"longlat_anarcoord\" >Long/Lat</label></td></tr>");
	if (ICapaVolaGPS!=-1)
		cdns.push("<tr><td align=\"center\"><input class=\"Verdana11px\" type=\"button\" name=\"Acceptar\" value=\"",
			(DonaCadenaLang({"cat":"Ubicació dispositiu", "spa":"Ubicación dispositivo", "eng":"Device location","fre":"Emplacement de l'appareil"})),
			"\" onClick=\"AnarACoordGPS(form);\"></td></tr>");
	cdns.push("<tr><td align=\"right\"><label id=\"X_anarcoord\" for=\"coordX_anarcoord\">X: </label><input class=\"Verdana11px\" id=\"coordX_anarcoord\" name=\"coordX\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.x,"\"><label id=\"Y_anarcoord\" for=\"coordY_anarcoord\"> Y: </label><input class=\"Verdana11px\" id=\"coordY_anarcoord\" name=\"coordY\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.y,"\"></td></tr><tr><td align=\"right\"><label for=\"mVoltant_anarcoord\">",
			(DonaCadenaLang({"cat":"Zona al voltant (m):", "spa":"Zona alrededor (m):", "eng":"Round zone (m):","fre":"Zone autour (m):"})),
			" </label><input class=\"Verdana11px\" id=\"mVoltant_anarcoord\" name=\"mVoltant\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.m_voltant,"\"></td></tr>",
		"<tr><td align=\"center\"><input class=\"Verdana11px\" type=\"button\" name=\"Acceptar\" value=\"",
			(DonaCadenaLang({"cat":"Anar-hi", "spa":"Ir", "eng":"Go to","fre":"Aller à"})),
			"\" onClick=\"AnarACoordenada(form);\">",
			"<input class=\"Verdana11px\" type=\"button\" name=\"Tancar\" value=\"",
			(DonaCadenaLang({"cat":"Tancar", "spa":"Cerrar", "eng":"Close", "fre":"Quitter"})),
			"\" onClick='TancaFinestraLayer(\"anarCoord\");'></td></tr></table></form>");
	contentFinestraLayer(window, "anarCoord", cdns.join("")); 
}//Fi de OmpleFinestraAnarCoordenada()

function MostraFinestraAnarCoordenada()
{
	if (!ObreFinestra(window, "anarCoord", DonaCadenaLang({"cat":"d'anar a coordenada", 
							  "spa":"de ir a coordenada",
							  "eng":"of go-to coordenate",
							  "fre":"pour aller à la coordonnée"})))
		return;
	OmpleFinestraAnarCoordenada();
	if (ICapaVolaAnarCoord!=-1)
	{
		ParamCtrl.capa[ICapaVolaAnarCoord].visible="no";
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
	if (ICapaVolaAnarCoord!=-1)
	{
	   ParamCtrl.capa[ICapaVolaAnarCoord].visible="no";
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



function AnarACoordenada(form)
{
var d, crs_xy;	
var punt_coord={x: parseFloat(form.coordX.value), y: parseFloat(form.coordY.value)};

	if(isNaN(punt_coord.x) || isNaN(punt_coord.y))
	{
  	   alert(DonaCadenaLang({"cat":"Format de les coordenades erroni:\nS'ha d'indicar un valor numèric.", 
						"spa":"Formato de las coordenadas erróneo:\nSe debe indicar un valor numérico.", 
						"eng":"Coordinate format is incorrectly:\nIt Must indicate a numeric value.",
						"fre":"Format des coordonnées erroné:\nVous devez indiquer une valeur numérique."}));
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
  	   alert(DonaCadenaLang({"cat":"El punt sol·licitat està fora de l'àmbit de navegació", 
						 "spa":"El punto solicitado está fuera del ámbito de navegación", 
						 "eng":"The requested point is outside browser envelope",
						 "fre":"Le point requis se trouve dehors le milieu de navigation"}));
	   return;
	}

	d=parseFloat(form.mVoltant.value);
	if(isNaN(d))
	    d=0;
	FormAnarCoord.m_voltant=d;

	//Dibuixo la icona per mostrar el punt consultat
	if (ICapaVolaAnarCoord>=0)
	{
		var capa=ParamCtrl.capa[ICapaVolaAnarCoord];
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
	if(ICapaVolaPuntConsult!=-1)
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ICapaVolaPuntConsult], crs_ori, crs_dest);
	if(ICapaVolaAnarCoord!=-1)
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ICapaVolaAnarCoord], crs_ori, crs_dest);
	if(ICapaVolaEdit!=-1)
	{
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ICapaVolaEdit], crs_ori, crs_dest);
		if(ParamCtrl.BarraBotoInsereix==true && ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
			eval(ParamCtrl.FuncioIconaEdicio);		
	}
	if(ICapaVolaGPS!=-1)
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ICapaVolaGPS], crs_ori, crs_dest);
}

function EsIndexCapaVolatil(i_capa)
{
	if (ICapaVolaPuntConsult==i_capa || ICapaVolaAnarCoord==i_capa || ICapaVolaEdit==i_capa || ICapaVolaGPS==i_capa)
		return true;
	else
		return false;
}

function NumeroDeCapesVolatils(i_capa)
{
	if (i_capa==-1)  //nombre de capes total
		return ((-1!=ICapaVolaPuntConsult)?1:0) + ((-1!=ICapaVolaAnarCoord)?1:0) + ((-1!=ICapaVolaEdit)?1:0) + ((-1!=ICapaVolaGPS)?1:0) + ((-1!=ICapaVolaGPS)?1:0);
	else     //nombre de capes per sobre (amb index més baix que i_capa)
		return ((-1!=ICapaVolaPuntConsult && ICapaVolaPuntConsult<i_capa )?1:0) + ((-1!=ICapaVolaAnarCoord && ICapaVolaAnarCoord<i_capa )?1:0) + ((-1!=ICapaVolaEdit && ICapaVolaEdit<i_capa)?1:0) + ((-1!=ICapaVolaGPS && ICapaVolaGPS<i_capa)?1:0);
}

function EliminaCapaVolatil(i_capa)
{
	ParamCtrl.capa.splice(i_capa, 1);
	if (ICapaVolaPuntConsult==i_capa)
		ICapaVolaPuntConsult=-1;
	if (ICapaVolaAnarCoord==i_capa)
		ICapaVolaAnarCoord=-1;
	if (ICapaVolaEdit==i_capa)
		ICapaVolaEdit=-1;
	if (ICapaVolaGPS==i_capa)
		ICapaVolaGPS=-1;
	CanviaIndexosCapesSpliceCapa(-1, i_capa, -1);
}

function CanviaIndexosCapesVolatils(n_moviment, i_capa_ini, i_capa_fi_per_sota)
{
	if (typeof i_capa_fi_per_sota==="undefined")
		var i_capa_fi_per_sota=i_capa_ini+1;

	if (ICapaVolaPuntConsult!=-1 && ICapaVolaPuntConsult>=i_capa_ini && ICapaVolaPuntConsult<i_capa_fi_per_sota)
		ICapaVolaPuntConsult+=n_moviment;
	if (ICapaVolaAnarCoord!=-1 && ICapaVolaAnarCoord>=i_capa_ini && ICapaVolaAnarCoord<i_capa_fi_per_sota)
		ICapaVolaAnarCoord+=n_moviment;
	if (ICapaVolaEdit!=-1 && ICapaVolaEdit>=i_capa_ini && ICapaVolaEdit<i_capa_fi_per_sota)
		ICapaVolaEdit+=n_moviment;
	if (ICapaVolaGPS!=-1 && ICapaVolaGPS>=i_capa_ini && ICapaVolaGPS<i_capa_fi_per_sota)
		ICapaVolaGPS+=n_moviment;
}

function CreaCapesVolatils()
{
	var i_nova_capa=0;

	if (!ParamCtrl.IconaConsulta)
		ParamCtrl.IconaConsulta={"icona": "mes.gif", "ncol": 9, "nfil": 9, "i": 5, "j": 5};
	if (ICapaVolaPuntConsult==-1)
	{
		ICapaVolaPuntConsult=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(ICapaVolaPuntConsult, 0, {
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
		CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1);
	}
	if (ParamCtrl.IconaEdicio && ICapaVolaEdit==-1)
	{
		ICapaVolaEdit=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(ICapaVolaEdit, 0, {
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
		CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1);
	}
	if (!ParamCtrl.IconaAnarCoord)
		ParamCtrl.IconaAnarCoord={"icona": "mes.gif", "ncol": 9, "nfil": 9, "i": 5, "j": 5};
	if (ICapaVolaAnarCoord==-1)
	{
		ICapaVolaAnarCoord=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(ICapaVolaAnarCoord, 0, {
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
						"vora":
						{
							"paleta": {
								"colors": [
									"#BB8888"
								]
							}
						},
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
		CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1);
	}
	if (typeof ParamCtrl.MostraPosicioGPS==="undefined" || (ParamCtrl.MostraPosicioGPS!=null && ParamCtrl.MostraPosicioGPS!=false))
	{
		if (!ParamCtrl.IconaPosicioGPS)
			ParamCtrl.IconaPosicioGPS={"icona": "mesgps.png", "ncol": 24, "nfil": 13, "i": 5, "j": 5};
		if (ICapaVolaGPS==-1)
		{
			ICapaVolaGPS=i_nova_capa;
			i_nova_capa++;
			ParamCtrl.capa.splice(ICapaVolaGPS, 0, {
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
						"vora":
						{
							"paleta": {
								"colors": [
									"#FF0000"
								]
							}
						},
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
			CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1);
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
	 	var capa=ParamCtrl.capa[ICapaVolaEdit];
		capa.objectes.features[0].geometry.coordinates[0]=PuntConsultat.x;
		capa.objectes.features[0].geometry.coordinates[1]=PuntConsultat.y;		
		capa.objectes.features[0].seleccionat=false;	
		capa.visible="si";
	    
		CreaVistes();
	}
	if (ParamCtrl.BarraBotoInsereix==true && ParamCtrl.FuncioIconaEdicio)
		eval(ParamCtrl.FuncioIconaEdicio);		
	else if(ICapaVolaEdit!=-1 && ParamCtrl.capa[ICapaVolaEdit].FuncioEdicio)
		eval(ParamCtrl.capa[ICapaVolaEdit].FuncioEdicio);		
	
}//Fi de EditarPunts()


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
	if (ICapaVolaGPS>=0)
	{
		if (navigator.geolocation)
			IdPositionGPS=navigator.geolocation.watchPosition(ActualitzaPosicioGPS, ErrorPosicioGPS, {enableHighAccuracy: true, maximumAge: 8000});
		else
		{
			alert("Geolocation is not supported by this browser.");			
			CancelaPosicioGPS();
		}
	}
}	

function ActualitzaPosicioGPS(position)
{
	if (ICapaVolaGPS>=0)
	{
		var punt=DonaCoordenadesCRS(position.coords.longitude, position.coords.latitude, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		var capa=ParamCtrl.capa[ICapaVolaGPS];
		capa.objectes.features[0].geometry.coordinates[0]=punt.x;
		capa.objectes.features[0].geometry.coordinates[1]=punt.y;
		//For the moment, a field can not be used to define the radius of the circle, so I have to do it here. This would be fixed.
		capa.objectes.features[0].properties.uncertainty=position.coords.accuracy;
		//if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
		//	capa.objectes.features[0].properties.uncertainty/=FactorGrausAMetres;
		CreaVistes();
	}
}

function AnarACoordGPS(form)
{
	if (ICapaVolaGPS<0)
		return;

	var capa=ParamCtrl.capa[ICapaVolaGPS];

	form.coordX.value=capa.objectes.features[0].geometry.coordinates[0];
	form.coordY.value=capa.objectes.features[0].geometry.coordinates[1];
	form.mVoltant.value=capa.objectes.features[0].properties.uncertainty*4;
	form.proj[0].checked=true;
	form.proj[1].checked=false;
	CanviaEtiquetesAnarCoord(0);
}

function CancelaPosicioGPS()
{
	if (ICapaVolaGPS>=0)
	{
		//Potser seria millor apagar la visualització de les capes i prou?
		EliminaCapaVolatil(ICapaVolaGPS);
		ParamCtrl.MostraPosicioGPS=false;
		if (IdPositionGPS)  
			clearWatch(IdPositionGPS);
	}
}

function ErrorPosicioGPS(error)
{
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
	      		alert(DonaCadenaLang({"cat":"L'usuari ha denegat la sol·licitud de geolocalització", "spa":"El usuario ha denegado la solicitud de geolocalitzación", "eng":"User denied the request for Geolocation.","fre":"L'utilisateur a refusé la demande de géolocalisation"}));
			CancelaPosicioGPS();
			break;
		case error.POSITION_UNAVAILABLE:
      			alert(DonaCadenaLang({"cat":"La informació sobre la ubicació no està disponible", "spa":"La información sobre la ubicación no está disponible", "eng":"Location information is unavailable.","fre":"Les informations de localisation ne sont pas disponibles"}));
			CancelaPosicioGPS();
      			break;
		case error.TIMEOUT:
			alert(DonaCadenaLang({"cat":"Temps de sol·licitut de l'obtenció de la ubicació de l’usuari esgotat", "spa":"Tiempo de solicitud de obtención de la ubicación del usuario esgotado", "eng":"Request to get user location timed out.","fre":"Demande pour expiration de l'emplacement de l'utilisateur"}));
			CancelaPosicioGPS();
			break;
		case error.UNKNOWN_ERROR:
		default:
			alert(DonaCadenaLang({"cat":"S'ha produït un error desconegut", "spa":"Se ha producido un error desconocido", "eng":"An unknown error occurred","fre":"Une erreur inconnue est survenue"})+" (" + error.code + ").");
			break;
	}
}
