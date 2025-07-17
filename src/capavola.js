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

    Copyright 2001, 2024 Xavier Pons

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
	ComprovaCalTancarAmbScope();
	MostraFinestraAnarCoordenada();
	dontPropagateEvent(event);
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
function MostraFinestraLogBookAmbScope(targets, lang, access_token_type, dims)
{
	
	var trg=targets;
	var lng=lang;
	var tkn=access_token_type;

	if (!ObreFinestra(window, "lbScope", GetMessage("ofLogBookScope", "capavola")))
		return;
	
	TancaFinestraLayer("logbook");
	OmpleFinestraLogBookAmbScope(trg, lng, tkn, dims);

	//per defecte deixo marcat que volem un scope rectangular
	mostraSelecLBScope(0);

	return;
}
//OG: mostra finestra que permetrà afegir envolupant a un FB
function MostraFinestraFeedbackAmbScope(targets, lang, access_token_type)
{
	
	var trg=targets;
	var lng=lang;
	var tkn=access_token_type;

	if (!ObreFinestra(window, "fbScope", GetMessage("ofUserFeedbackScope", "capavola")))
		return;
	

	
	TancaFinestraLayer("feedback");
	OmpleFinestraFeedbackAmbScope(trg, lng, tkn);

	//per defecte deixo marcat que volem un fbScope rectangular
	mostraSelecFBScope(0);

	return;
}

// Llista global de polígons
var lpscopePoligons = [];
var lpscopePoints = [];

function OmpleFinestraLogBookAmbScope(targets, lang, access_token_type, dims)
{
	//ens assegurem que no hi ha res a les llistes quan obrim la finestra
	lpscopePoligons = [];
	lpscopePoints = [];

	var trgStr = JSON.stringify(targets).replace(/'/g, "\\'");  // només un cop!
	var lng = lang;
	var tkn = access_token_type;
	var dimsStr = JSON.stringify(dims);

	var cdns = [];

	// escollim si volem un punt o un rectangle:
	cdns.push('<form name="LogPageScope_win" onSubmit="return false;">',
		'<table class="Verdana11px" width="100%" align="center">',
			'<tr>',
				'<td><span>', GetMessage("ScopeUseMouse", "capavola"), '</span></td>',
				'<td><input type="radio" id="LParea" name="LP_scope_type" value="area" checked onclick="mostraSelecLBScope(0);TancaFinestraEmergent_multi_consulta();"><label for="area">', GetMessage("ScopeTypeArea", "capavola"), '</label></td>',
				'<td><input type="radio" id="LPpoint" name="LP_scope_type" value="punt" onclick="mostraSelecLBScope(1);"><label for="point">', GetMessage("ScopeTypePoint", "capavola"), '</label></td>',
			'</tr>',
		'</table>',
		'<div id="lpScopeType"></div><br>',
		'<div id="lpScopeList" align="center"></div><br>');

	cdns.push('<table class="Verdana11px" width="50%" align="center">',
		'<tr>',
			'<td align="center"><input class="Verdana11px" type="button" name="Add" value="', GetMessage("Add"), '" onClick="AfegirElementsALPScope();"></td>',
			'<td align="center"><input class="Verdana11px" type="button" name="Acceptar" value="', GetMessage("OK"), 
				'" onClick=\'AfegirLogPageScopeALogBook(' + JSON.stringify(trgStr) + ', "' + lng + '", "' + tkn + '", ' + dimsStr + '); TancaFinestraLayer("fbScope");\'></td>',
			'<td align="center"><input class="Verdana11px" type="button" name="Tancar" value="', GetMessage("Cancel"), '" onClick=\'TancaFinestraLayer("lbScope");\'></td>',
		'</tr>',
		'</table>',
	'</form>');

	contentFinestraLayer(window, "lbScope", cdns.join(""));
}

//OG: aquesta funció és la que haurà d'omplir la finestra escrivint el codi hmtl
function OmpleFinestraFeedbackAmbScope(targets, lang, access_token_type)
{
	var trg=JSON.stringify(targets);
	var lng=lang;
	var tkn=access_token_type;

	var cdns=[];
	//escollim si volem un punt o un rectangle:
	cdns.push('<form name="FeedbackScope_win" onSubmit="return false;">',
		'<table class="Verdana11px" width="100%" align="center">',
			'<tr>',
			'<td><span>',GetMessage("ScopeUseMouse","capavola"),'</span></td>',
			'<td><input type="radio" id="FBarea" name="FB_scope_type" value="area" checked onclick="mostraSelecFBScope(0);TancaFinestraEmergent_multi_consulta();"><label for="area">',GetMessage("ScopeTypeArea","capavola"),'</label></td>',
			'<td><input type="radio" id="FBpoint" name="FB_scope_type" value="punt" onclick="mostraSelecFBScope(1);"><label for="point">',GetMessage("ScopeTypePoint","capavola"),'</label></td>',
			'</tr>',
		'</table>',
		'<div id=fbScopeType></div><br>',
		'<table class="Verdana11px" width="50%" align="center">',
			'<tr>',
				'<td align="center"><input class="Verdana11px" type="button" name="Acceptar" value="',GetMessage("OK"),'"'," onClick='AfegirFeedbackScopeCapaMultipleTargets(",trg,", \"",lng, "\", \"",tkn,"\"",");TancaFinestraLayer(\"fbScope\");'",'></td>',
				'<td align="center"><input class="Verdana11px" type="button" name="Tancar" value="',GetMessage("Cancel"),'"'," onClick='TancaFinestraLayer(\"fbScope\");'",'></td>',
			'</tr>',
		'</table>',
	'</form>');
	contentFinestraLayer(window, "fbScope", cdns.join(""));
}

function mostraSelecLBScope(type)
{
	var tp=type;
	
	//si pol
	if (tp==0)
	{
		document.getElementById("lpScopeList").innerHTML="";
		CanviaPolsatEnBotonsAlternatius("pan","pan","","moumig","moumig","","zoomfin","zoomfin","","novavista","novavista","","conloc","conloc",""); 
		CanviaEstatClickSobreVista("ClickRecLP1");		
		
		document.getElementById("lpScopeType").innerHTML='<br><br>'+
			'<table class="Verdana11px" width="50%" align="center">'+
				'<tr>'+
					'<td colspan="2">'+ DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)+'</td>'+
					'<td style="text-align:center;">Ymax</td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td><input class="Verdana11px" id="lpscope_ymax" name="lpscope_ymax" type="text" size="8" value="" disabled></td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
				'<tr>'+
					'<td style="text-align:rigth;">Xmin</td>'+
					'<td><input class="Verdana11px" id="lpscope_xmin" name="lpscope_xmin" type="text" size="8" value="" disabled></td>'+
					'<td></td>'+
					'<td><input class="Verdana11px" id="lpscope_xmax" name="lpscope_xmax" type="text" size="8" value="" disabled></td>'+
					'<td style="text-align:left;">Xmax</td>'+
				'</tr>'+
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td><input class="Verdana11px" id="lpscope_ymin" name="lpscope_ymin" type="text" size="8" value="" disabled></td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td style="text-align:center;">Ymin</td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
			'</table>';
	}
	//si punt
	if (tp==1)
	{
		document.getElementById("lpScopeList").innerHTML="";
		CanviaPolsatEnBotonsAlternatius("pan","pan","","moumig","moumig","","zoomfin","zoomfin","","novavista","novavista","","conloc","conloc",""); 
		CanviaEstatClickSobreVista("ClickPointLP");

		document.getElementById("lpScopeType").innerHTML='<br><br>'+
		'<table class="Verdana11px" width="75%" align="center">'+
		'<tr>'+
			'<td colspan="2">'+ DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)+'</td>'+
			'<td></td>'+
			'<td></td>'+
		'</tr>'+
		'<tr>'+
			'<td style="text-align:rigth;">X:</td>'+
			'<td><input class="Verdana11px" id="lpscope_x" name="lpscope_x" type="text" size="8" value="" disabled></td>'+
			'<td style="text-align:rigth;">Y:</td>'+
			'<td><input class="Verdana11px" id="lpscope_y" name="lpscope_y" type="text" size="8" value="" disabled></td>'+
		'</tr>'+
		'<tr>'+
			'<td><input class="Verdana11px" id="lpscope_x_dec" name="lpscope_x_dec" type="hidden" size="8" value="" disabled></td>'+
			'<td><input class="Verdana11px" id="lpscope_y_dec" name="lpscope_y_dec" type="hidden" size="8" value="" disabled></td>'+
		'</tr>'+
		'</table>';
	}
}

function AfegirElementsALPScope()
{
	var type = document.getElementById("LPpoint").checked ? 1 : 0;

	if (type==0)
	{
		var xmin = document.getElementById("lpscope_xmin").value;
		var xmax = document.getElementById("lpscope_xmax").value;
		var ymin = document.getElementById("lpscope_ymin").value;
		var ymax = document.getElementById("lpscope_ymax").value;

		if (!xmin || !xmax || !ymin || !ymax) {
			alert("Falten coordenades.");
			return;
		}

		// Afegeix el nou polígon a la llista
		lpscopePoligons.push({ xmin, xmax, ymin, ymax });

		// Mostra la llista
		MostraPoligonsLPScope();
	}
	if (type==1)
	{
		var x = document.getElementById("lpscope_x_dec").value;
		var y = document.getElementById("lpscope_y_dec").value;
		
		if (!x || !y) {
			alert("Falten coordenades.");
			return;
		}
		
		// Afegeix el nou punt a la llista
		lpscopePoints.push({ x, y });

		// Mostra la llista
		MostraPointsLPScope();		

	}
}

function MostraPoligonsLPScope() 
{
	const contenedor = document.getElementById("lpScopeList");
	contenedor.innerHTML = "<ol></ol>";
	const ol = contenedor.querySelector("ol");

	for (var i = 0; i < lpscopePoligons.length; i++) 
	{
		var poli = lpscopePoligons[i];
		var li = document.createElement("li");
		li.innerHTML = "Xmin: " + poli.xmin + "; Ymin: " + poli.ymin + "; Xmax: " + poli.xmax + "; Ymax: " + poli.ymax +
		               " <span style='color:red; font-weight:bold; cursor:pointer; margin-left:10px;' onclick=\"EliminaPoligonLPScope(" + i + ")\">❌</span>";
		ol.appendChild(li);
	}
}

function MostraPointsLPScope() 
{
	var dec=ParamCtrl.NDecimalsCoordXY
	const contenedor = document.getElementById("lpScopeList");
	contenedor.innerHTML = "<ol></ol>";
	const ol = contenedor.querySelector("ol");

	for (var i = 0; i < lpscopePoints.length; i++) 
	{
		var pnt = lpscopePoints[i];
		var li = document.createElement("li");
		//he guardat el punt amb tots els decimals, però només mostro els decimals configurats pel navegador
		li.innerHTML = "X: " + OKStrOfNe(pnt.x, dec) + "; Y: " + OKStrOfNe(pnt.y, dec) +
		               " <span style='color:red; font-weight:bold; cursor:pointer; margin-left:10px;' onclick=\"EliminaPointLPScope(" + i + ")\">❌</span>";
		ol.appendChild(li);
	}
}

function EliminaPoligonLPScope(index) 
{
	lpscopePoligons.splice(index, 1);
	MostraPoligonsLPScope();
}

function EliminaPointLPScope(index) 
{
	lpscopePoints.splice(index, 1);
	MostraPointsLPScope();
}

//OG: en funció de si l'usuari vol fer FB sobre un punt o una àrea, mostrem un formulari o un altre.
function mostraSelecFBScope(type)
{
	var tp=type;
	
	if (tp==0)
	{
		CanviaPolsatEnBotonsAlternatius("pan","pan","","moumig","moumig","","zoomfin","zoomfin","","novavista","novavista","","conloc","conloc",""); 
		CanviaEstatClickSobreVista("ClickRecFB1");

		document.getElementById("fbScopeType").innerHTML='<br><br>'+
			'<table class="Verdana11px" width="50%" align="center">'+
				'<tr>'+
					'<td colspan="2">'+ DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)+'</td>'+
					'<td style="text-align:center;">Ymax</td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td><input class="Verdana11px" id="fbscope_ymax" name="fbscope_ymax" type="text" size="8" value="" disabled></td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
				'<tr>'+
					'<td style="text-align:rigth;">Xmin</td>'+
					'<td><input class="Verdana11px" id="fbscope_xmin" name="fbscope_xmin" type="text" size="8" value="" disabled></td>'+
					'<td></td>'+
					'<td><input class="Verdana11px" id="fbscope_xmax" name="fbscope_xmax" type="text" size="8" value="" disabled></td>'+
					'<td style="text-align:left;">Xmax</td>'+
				'</tr>'+
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td><input class="Verdana11px" id="fbscope_ymin" name="fbscope_ymin" type="text" size="8" value="" disabled></td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
				'<tr>'+
					'<td></td>'+
					'<td></td>'+
					'<td style="text-align:center;">Ymin</td>'+
					'<td></td>'+
					'<td></td>'+
				'</tr>'+
			'</table>';
	}
		
	//si "punt":
	if (tp==1){

		CanviaPolsatEnBotonsAlternatius("pan","pan","","moumig","moumig","","zoomfin","zoomfin","","novavista","novavista","","conloc","conloc",""); 
		CanviaEstatClickSobreVista("ClickPointFB");

		document.getElementById("fbScopeType").innerHTML='<br><br>'+
		'<table class="Verdana11px" width="75%" align="center">'+
		'<tr>'+
			'<td colspan="2">'+ DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)+'</td>'+
			'<td></td>'+
			'<td></td>'+
		'</tr>'+
		'<tr>'+
			'<td style="text-align:rigth;">X:</td>'+
			'<td><input class="Verdana11px" id="fbscope_x" name="fbscope_x" type="text" size="8" value="" disabled></td>'+
			'<td style="text-align:rigth;">Y:</td>'+
			'<td><input class="Verdana11px" id="fbscope_y" name="fbscope_y" type="text" size="8" value="" disabled></td>'+
		'</tr>'+
		'<tr>'+
			'<td><input class="Verdana11px" id="fbscope_xmin" name="fbscope_xmin" type="hidden" size="8" value="" disabled></td>'+
			'<td><input class="Verdana11px" id="fbscope_ymin" name="fbscope_ymin" type="hidden" size="8" value="" disabled></td>'+
			'<td><input class="Verdana11px" id="fbscope_xmax" name="fbscope_xmax" type="hidden" size="8" value="" disabled></td>'+
			'<td><input class="Verdana11px" id="fbscope_ymax" name="fbscope_ymax" type="hidden" size="8" value="" disabled></td>'+
		'</tr>'+
		'</table>';
	}
}

function AfegirLogPageScopeALogBook(targets, lang, access_token_type, dims)
{
	var crs=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS; //mirem el SR
	var trg=JSON.parse(targets);
	var dec=ParamCtrl.NDecimalsCoordXY; //per defecte agafarem els decimals configurats

	var lpscopePoligons_ll = [];
	var lpscopePoints_ll = [];
	//mirem si estem enviant punts o polígons
	var type = document.getElementById("LPpoint").checked ? 1 : 0;

	//lpscopePoligons = [];
	//lpscopePoints = [];

	//pol
	if (type==0)
	{
		if (crs !="EPSG:4326" && crs !="CRS:84")
		{
			for (var i=0; i<lpscopePoints.length; i++)
			{
				var pol = lpscopePoligons[i];
				//lower left
				var ll= DonaCoordenadesLongLat(pol.xmin, pnt.ymin, crs);
				//uper rigth
				var ur= DonaCoordenadesLongLat(pol.xmax, pnt.ymax, crs);
				lpscopePoligons_ll.push({ xmin: ll.x, xmax: ur.x, ymin: ll.y, ymax: ur.y });
			}
			//en principi sempre tindrem un únic target, o sigui que aquest for no ens caldria
			for (var i=0; i<trg.length; i++)
			{
				trg[i].scopePol=lpscopePoligons_ll;
			}
		}
		else
		{
			//en principi sempre tindrem un únic target, o sigui que aquest for no ens caldria
			for (var i=0; i<trg.length; i++)
			{
				trg[i].scopePol=lpscopePoligons;
			}
		}
		LBAfegirLogPageCapaMultipleTargets(trg, lang, access_token_type, dims);
	}
	//pnt
	if (type==1)
	{
		// si les coordenades no són en lon/lat, les transformem
		if (crs !="EPSG:4326" && crs !="CRS:84")
		{
			for (var i=0; i<lpscopePoints.length; i++)
			{
				var pnt = lpscopePoints[i];
				var coord_ll = DonaCoordenadesLongLat(pnt.x, pnt.y, crs);
				lpscopePoints_ll.push({ x: coord_ll.x, y: coord_ll.y });
			}
			
			//en principi sempre tindrem un únic target, o sigui que aquest for no ens caldria
			for (var i=0; i<trg.length; i++)
			{
				trg[i].scopePnt=lpscopePoints_ll;
			}
		}
		else
		{
			//en principi sempre tindrem un únic target, o sigui que aquest for no ens caldria
			for (var i=0; i<trg.length; i++)
			{
				trg[i].scopePnt=lpscopePoints;
			}
		}
		LBAfegirLogPageCapaMultipleTargets(trg, lang, access_token_type, dims);
	}
	return;
}

//OG: afegim el bbox i el gmlpol als attributes del target abans d'enviar-ho al NiMMbus.
function AfegirFeedbackScopeCapaMultipleTargets(targets, lang, access_token_type)
{
	var crs=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS; //mirem el SR
	var trg=JSON.parse(targets);
	var dec=ParamCtrl.NDecimalsCoordXY; //per defecte agafarem els decimals configurats
	//comprovem que tenim totes les coordenades
	if (!document.getElementById("fbscope_xmin").value || !document.getElementById("fbscope_ymax").value || !document.getElementById("fbscope_xmin").value || !document.getElementById("fbscope_ymax").value)
	{
		alert(GetMessage("MissingCoordinates","capavola"));
		TancaFinestraLayer("fbScope");
	}
	else
	{
	
		//ulc: upper left corner lrc: lower rigth corner
		var ulc={"x": document.getElementById("fbscope_xmin").value, "y":document.getElementById("fbscope_ymax").value};
		var lrc={"x": document.getElementById("fbscope_xmax").value, "y":document.getElementById("fbscope_ymin").value};
	}
	
	//comprovem si el que volem enviar correspon a un punt
	if ((document.getElementById("fbscope_x")) && (document.getElementById("fbscope_y")))
	{
		// si les coordenades no són en lon/lat, les transformem
		if (crs !="EPSG:4326" && crs !="CRS:84")
		{
			//ulc:upper left corner. lrc: lower right corner
			//convertim coordenades a lon/lat
			var ulc_ll=DonaCoordenadesLongLat(ulc.x, ulc.y, crs);
			var lrc_ll=DonaCoordenadesLongLat(lrc.x, lrc.y, crs);

			for (var i=0; i<trg.length; i++)
			{
				//afegim el bbox i el gmlpol només al primary target
				if (trg[i].role=="primary")
				{
					//afegim el bounding box en lon/lat
					//al fer la transformació a graus no podem deixar el mateix nombre de decimals definit per al sistema de referència original pq es perd precissió. 
					//Podria passar que el sistema de referència original tingués definits 0 decimals i això ens podria portar a una situació on les lats i/o les long fossin idèntiques entre elles i la CGI no les guardés (la CGI sempre comprova que minLat<maxLat i minLong<maxLong, en cas contrari no es guarda el bbox)
					var dec_g=9;
					var dif_g=0.0000000045;
					trg[i].bbox={"xmin":OKStrOfNe((parseFloat(ulc_ll.x)-dif_g).toString(),dec_g),"xmax":OKStrOfNe((parseFloat(lrc_ll.x)+dif_g).toString(),dec_g),"ymin": OKStrOfNe((parseFloat(lrc_ll.y)-dif_g).toString(),dec_g),"ymax":OKStrOfNe((parseFloat(ulc_ll.y)+dif_g).toString(),dec_g)};
					//afegim el GMLpol en el crs original
					//modifiquem les coordenades per generar un pol de 1 mm de costat
					var dec_m=3;
					var dif_m=0.0005;
					trg[i].gmlpol={"gml": '<gml:Polygon srsName="'+crs+'"><gml:exterior><gml:LinearRing><gml:posList srsDimension="2">' + " " + OKStrOfNe((parseFloat(ulc.x)-dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(ulc.y)-dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(lrc.x)+dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(ulc.y)-dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(lrc.x)+dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(lrc.y)+dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(ulc.x)-dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(lrc.y)+dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(ulc.x)-dif_m).toString(),dec_m) + " " + OKStrOfNe((parseFloat(ulc.y)-dif_m).toString(),dec_m) + "</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon>"};
				}
			}
		}
		else // les coordenades son en lon/lat,per tant, tant el bbox com el GMLpol s'ecriuen en lon/lat
		{
			for (var i=0; i<trg.length; i++)
			{
				//afegim el bbox i el gmlpol només al primary target
				if (trg[i].role=="primary")
				{
					//afegim el bounding box en lon/lat
					var dec_g=9;
					var dif=0.0000000045;
					// li sumem/restem un diferencial de 0.0000000045 a les coordenades en graus, que és l'equivalent de 0.5 mm per generar micropols de 1 mm de costat.
					trg[i].bbox={"xmin":OKStrOfNe((parseFloat(ulc.x)-dif).toString(),dec_g),"xmax":OKStrOfNe((parseFloat(lrc.x)+dif).toString(),dec_g),"ymin": OKStrOfNe((parseFloat(lrc.y)-dif).toString(),dec_g),"ymax":OKStrOfNe((parseFloat(ulc.y)+dif).toString(),dec_g)};
					//afegim el GMLpol
					trg[i].gmlpol={"gml": '<gml:Polygon srsName="'+crs+'"><gml:exterior><gml:LinearRing><gml:posList srsDimension="2">' + " " + OKStrOfNe((parseFloat(ulc.x)-dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(ulc.y)-dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(lrc.x)+dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(ulc.y)-dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(lrc.x)+dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(lrc.y)+dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(ulc.x)-dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(lrc.y)+dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(ulc.x)-dif).toString(),dec_g) + " " + OKStrOfNe((parseFloat(ulc.y)-dif).toString(),dec_g) + "</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon>"};
				}
			}
		}
		GUFAfegirFeedbackCapaMultipleTargets(trg, lang, access_token_type);
	}
	//estem en el cas d'un pol
	else
	{
		// si les coordenades no són en lon/lat, les transformem
		if (crs !="EPSG:4326" && crs !="CRS:84")
		{
			var ulc_ll=DonaCoordenadesLongLat(ulc.x, ulc.y, crs);
			var lrc_ll=DonaCoordenadesLongLat(lrc.x, lrc.y, crs);
			for (var i=0; i<trg.length; i++)
			{
				//afegim el bbox i el gmlpol només al primary target
				if (trg[i].role=="primary")
				{
					//afegim el bounding box en lon/lat
			//al fer la transformació a graus no podem deixar el mateix nombre de decimals definit per al sistema de referència original pq es perd precissió. 
			//Podria passar que el sistema de referència original tingués definits 0 decimals i això ens podria portar a una situació on les lats i/o les long fossin idèntiques entre elles i la CGI no les guardés (la CGI sempre comprova que minLat<maxLat i minLong<maxLong, en cas contrari no es guarda el bbox)
			var dec_trans=9;
			trg[i].bbox={"xmin":OKStrOfNe(ulc_ll.x,dec_trans),"xmax":OKStrOfNe(lrc_ll.x,dec_trans),"ymin": OKStrOfNe(lrc_ll.y,dec_trans),"ymax":OKStrOfNe(ulc_ll.y,dec_trans)};
			//afegim el GMLpol en el crs original
					trg[i].gmlpol={"gml": '<gml:Polygon srsName="'+crs+'"><gml:exterior><gml:LinearRing><gml:posList srsDimension="2">' + " " + OKStrOfNe(ulc.x,dec) + " " + OKStrOfNe(ulc.y,dec) + " " + OKStrOfNe(lrc.x,dec) + " " + OKStrOfNe(ulc.y,dec) + " " + OKStrOfNe(lrc.x,dec) + " " + OKStrOfNe(lrc.y,dec) + " " + OKStrOfNe(ulc.x,dec) + " " + OKStrOfNe(lrc.y,dec) + " " + OKStrOfNe(ulc.x,dec) + " " + OKStrOfNe(ulc.y,dec) + "</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon>"};
				}
			}
		}
		else // les coordenades son en lon/lat,per tant, tant el bbox com el GMLpol s'ecriuen en lon/lat
		{
			//comprovem que les coordenades min/maxLat i min/maxLong no siguin iguals entre elles. En cas que ho siguin demanem a l'uruari que modifiqui el nombre de decimals a la configuració del navegador
			if ((OKStrOfNe(ulc.x,dec)==OKStrOfNe(lrc.x,dec)) || (OKStrOfNe(lrc.y,dec)==OKStrOfNe(ulc.y,dec)))
			{
				alert(GetMessage("CheckNDecimalFigures", "capavola"));
				TancaFinestraLayer("fbScope");
				return;
			}
			else
			{
				for (var i=0; i<trg.length; i++)
				{
					//afegim el bbox i el gmlpol només al primary target
					if (trg[i].role=="primary")
					{
						//afegim el bounding box en lon/lat
						trg[i].bbox={"xmin":OKStrOfNe(ulc.x,dec),"xmax":OKStrOfNe(lrc.x,dec),"ymin": OKStrOfNe(lrc.y,dec),"ymax":OKStrOfNe(ulc.y,dec)};
						//afegim el GMLpol
						trg[i].gmlpol={"gml": '<gml:Polygon srsName="'+crs+'"><gml:exterior><gml:LinearRing><gml:posList srsDimension="2">' + " " + OKStrOfNe(ulc.x,dec) + " " + OKStrOfNe(ulc.y,dec) + " " + OKStrOfNe(lrc.x,dec) + " " + OKStrOfNe(ulc.y,dec) + " " + OKStrOfNe(lrc.x,dec) + " " + OKStrOfNe(lrc.y,dec) + " " + OKStrOfNe(ulc.x,dec) + " " + OKStrOfNe(lrc.y,dec) + " " + OKStrOfNe(ulc.x,dec) + " " + OKStrOfNe(ulc.y,dec) + "</gml:posList></gml:LinearRing></gml:exterior></gml:Polygon>"};
					}
				}
			}
		}	
		GUFAfegirFeedbackCapaMultipleTargets(trg, lang, access_token_type);
	}
	return;
}

function TancaFinestraLogBookAmbScope()
{
	//Per defecte, al tancar la finestra de lbScope deixem les consultes per localització.
	//Aquí estem en la situació que hem tancat la caixa des del botó tancar.
	//primer comprovem si estàvem digitalitzant un punt. Si és així, esborrem la creu:
	if (document.getElementById("LPpoint").checked)
		TancaFinestra_multi_consulta();
	ParamCtrl.EstatClickSobreVista="ClickConLoc";
	CanviaEstatClickSobreVista("ClickConLoc");
}

function TancaFinestraFeedbackAmbScope()
{
	//Per defecte, al tancar la finestra de fbScope deixem les consultes per localització.
	//Aquí estem en la situació que hem tancat la caixa des del botó tancar.
	//primer comprovem si estàvem digitalitzant un punt. Si és així, esborrem la creu:
	if (document.getElementById("FBpoint").checked)
		TancaFinestra_multi_consulta();
	ParamCtrl.EstatClickSobreVista="ClickConLoc";
	CanviaEstatClickSobreVista("ClickConLoc");
}

function ComprovaCalTancarAmbScope(estat)
{
	ComprovaCalTancarFeedbackAmbScope(estat);
	ComprovaCalTancarLogBookAmbScope(estat);
}

function ComprovaCalTancarFeedbackAmbScope(estat)
{
	//si estem fent un FB amb Scope i clickem sobre algun botó de la barra d'eines que obra una finestra nova (anar a coord, config, calc, etc.) tanquem la finestra fbScope i posem per defecte el mouse a ConLoc
	if (((ParamCtrl.EstatClickSobreVista=="ClickRecFB1" || ParamCtrl.EstatClickSobreVista=="ClickRecFB2") && ((estat!="ClickPointFB")&&(estat!="ClickRecFB1"))) || ((ParamCtrl.EstatClickSobreVista=="ClickPointFB")&&(estat!="ClickRecFB1")))
	{
		TancaFinestraLayer("fbScope");
		//Per defecte, al tancar la finestra de fbScope deixem les consultes per localització.
		if(!estat) //Aquí estem en una situació en què estem tancant la caixa pq estem entrant a una nova finestra de l'estil anar a coord, config, calc, etc.
		{
			CanviaEstatClickSobreVista("ClickConLoc");
			CanviaPolsatEnBotonsAlternatius("pan","pan","","moumig","moumig","","zoomfin","zoomfin","","novavista","novavista","","conloc","conloc","p");
		} // si sí que hi ha "estat", vol dir que estem seleccionant una eina de zoom, pan, etc i que CanviaEstatClickSobreVista segueix en seu curs normal.
	}
}

function ComprovaCalTancarLogBookAmbScope(estat)
{
	//si estem fent un LB amb Scope i clickem sobre algun botó de la barra d'eines que obra una finestra nova (anar a coord, config, calc, etc.) tanquem la finestra lbScope i posem per defecte el mouse a ConLoc
	if (((ParamCtrl.EstatClickSobreVista=="ClickRecLP1" || ParamCtrl.EstatClickSobreVista=="ClickRecLP2") && ((estat!="ClickPointLP")&&(estat!="ClickRecLP1"))) || ((ParamCtrl.EstatClickSobreVista=="ClickPointLP")&&(estat!="ClickRecLP1")))
	{
		TancaFinestraLayer("lbScope");
		//Per defecte, al tancar la finestra de fbScope deixem les consultes per localització.
		if(!estat) //Aquí estem en una situació en què estem tancant la caixa pq estem entrant a una nova finestra de l'estil anar a coord, config, calc, etc.
		{
			CanviaEstatClickSobreVista("ClickConLoc");
			CanviaPolsatEnBotonsAlternatius("pan","pan","","moumig","moumig","","zoomfin","zoomfin","","novavista","novavista","","conloc","conloc","p");
		} // si sí que hi ha "estat", vol dir que estem seleccionant una eina de zoom, pan, etc i que CanviaEstatClickSobreVista segueix en seu curs normal.
	}
}
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

function AnarAObjVectorialTaula(x, y, crs_obj, minX, maxX, minY, maxY)
{
	if(isNaN(x) || isNaN(y))
	{
  	   alert(GetMessage("CoordIncorrectFormat", "capavola") + ":\n" + GetMessage("NumericalValueMustBeIndicated", "capavola") + ".");
	   return;
	}
	
	var punt_coord={x:x, y:y}, env_obj={MinX: minX, MaxX: maxX, MinY: minY, MaxY: maxY};
	
	TransformaCoordenadesPunt(punt_coord, crs_obj, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

	if(!EsPuntDinsAmbitNavegacio(punt_coord))
	{
		// La capa no es visible en el sistema de referència actual ni en el CRS actual, per tant he de canviar-ho i mirar en quina imatge de situació està continguda.
		// Calculo un envolupant amb uns 		
		EstableixNouCRSEnv(crs_obj, env_obj);
		
		// Recalculo el punt en el sistema que cal
		punt_coord={x:x, y:y};
		TransformaCoordenadesPunt(punt_coord, crs_obj, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	}
	env_obj=TransformaEnvolupant(env_obj, crs_obj, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

	// Dibuixo la icona per mostrar el punt de l'objecte
	if (typeof ParamCtrl.ICapaVolaAnarObj !== "undefined")
	{
		var capa=ParamCtrl.capa[ParamCtrl.ICapaVolaAnarObj];
		capa.objectes.features[0].geometry.coordinates[0]=punt_coord.x;
		capa.objectes.features[0].geometry.coordinates[1]=punt_coord.y;
		capa.visible="si";
		CreaVistes();
	}	
	PortamAAmbit(env_obj);
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
}

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
	if (typeof ParamCtrl.ICapaVolaAnarObj !== "undefined")
		TransformaCoordenadesCapaVolatil(ParamCtrl.capa[ParamCtrl.ICapaVolaAnarObj], crs_ori, crs_dest);
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
	if (param_ctrl.ICapaVolaPuntConsult==i_capa || param_ctrl.ICapaVolaAnarCoord==i_capa || param_ctrl.ICapaVolaAnarObj==i_capa  || param_ctrl.ICapaVolaEdit==i_capa || param_ctrl.ICapaVolaGPS==i_capa)
		return true;
	return false;
}

function EliminaIndexDeCapesVolatils(param_ctrl)
{
	if(typeof param_ctrl.ICapaVolaPuntConsult !== "undefined")
		delete param_ctrl.ICapaVolaPuntConsult;
	if(typeof param_ctrl.ICapaVolaAnarCoord !== "undefined")
		delete param_ctrl.ICapaVolaAnarCoord;
	if(typeof param_ctrl.ICapaVolaAnarObj !== "undefined")
		delete param_ctrl.ICapaVolaAnarObj;
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
		if (typeof ParamCtrl.ICapaVolaAnarObj !== "undefined")
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
	if (typeof ParamCtrl.ICapaVolaAnarObj !== "undefined" && ParamCtrl.ICapaVolaAnarObj<i_capa)
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
	if (param_ctrl.ICapaVolaAnarObj==i_capa)
		delete param_ctrl.ICapaVolaAnarObj;
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
	if (typeof param_ctrl.ICapaVolaAnarObj !== "undefined" && param_ctrl.ICapaVolaAnarObj>=i_capa_ini && param_ctrl.ICapaVolaAnarObj<i_capa_fi_per_sota)
		param_ctrl.ICapaVolaAnarObj+=n_moviment;
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
					"metadades": null,
					"explanation": null
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
					"metadades": null,
					"explanation": null
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
							"geometry": {
								"type": "Point",
								"coordinates": [0, 0]
							},
							"properties": {
								"radius": 1
							},
						}]
					},
					"attributes": { "radius":
						{
							"description": "Buffer",
							"UoM": "m",
							"mostrar": "si"
						}
					},
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
					"metadades": null,
					"explanation": null
				});
		CanviaIndexosCapesSpliceCapa(1, i_nova_capa, -1, ParamCtrl);
	}
	if (!ParamCtrl.IconaAnarObj)
		ParamCtrl.IconaAnarObj={"icona": "mes.gif", "ncol": 9, "nfil": 9, "i": 5, "j": 5};
	if (typeof ParamCtrl.ICapaVolaAnarObj === "undefined")
	{
		ParamCtrl.ICapaVolaAnarObj=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(ParamCtrl.ICapaVolaAnarObj, 0, {
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
							"simbol": [{"ValorCamp": null, "icona": JSON.parse(JSON.stringify(ParamCtrl.IconaAnarObj))}]
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
					"metadades": null,
					"explanation": null
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
							"geometry": {
								"type": "Point",
								"coordinates": [0, 0]
							},
							"properties": {
								"uncertainty": 0.0
							},
						}]
					},
					"attributes": { "uncertainty":
						{
							"description": "Uncertainty",
							"UoM": "m",
							"mostrar": "si"
						}
					},
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
					"metadades": null,
					"explanation": null
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
