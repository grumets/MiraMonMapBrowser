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

"use strict"

/*var ParametresWindow=null;
function ObreFinestraParametres()
{
    if (ParametresWindow==null || ParametresWindow.closed)
    {
        ParametresWindow=window.open("param.htm","FinestraParam",'toolbar=no,status=yes,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=430,height=400');
		ShaObertPopUp(ParametresWindow);
    }
    else
        ParametresWindow.focus();
}*/

function RedibuixaParamColors()
{
	contentLayer(getLayer(window, "param_colors"), DonaTextParamColors());
}

var param_ColorFonsVista;  //Copia de la variable local a la caixa de paràmetres
var param_ColorQuadratSituacio; //Copia de la variable local a la caixa de paràmetres

//https://stackoverflow.com/questions/13789163/how-to-know-if-html5-input-type-color-is-available-as-a-color-picker
function hasColorInputSupport()
{
	try {
		const input = document.createElement('input');
		input.type = 'color';
		input.value = '!';
		return input.type === 'color' && input.value !== '!';
	} catch (e) {
		return false;
	}
}

function RecuperaColorInput(v, id)
{
	window[v]=document.getElementById(id).value;
}

function DonaTextParamColors()
{
var cdns=[];

//https://www.educative.io/edpresso/how-to-add-a-color-picker-in-html
//https://stackoverflow.com/questions/39264722/onchange-event-is-not-working-in-color-type-input
	if (hasColorInputSupport())
		cdns.push('<label for="colorpicker_ColorFonsVista">', GetMessage("ViewAreaBackgroundColor", "params"), ' </label>',
			'<input type="color" id="colorpicker_ColorFonsVista" value="', param_ColorFonsVista, '" onInput="RecuperaColorInput(\'param_ColorFonsVista\', \'colorpicker_ColorFonsVista\');"><br>',
			'<label for="colorpicker_ColorQuadratSituacio">', GetMessage("SituationRectangleColor", "params"), ' </label>',
			'<input type="color" id="colorpicker_ColorQuadratSituacio" value="', param_ColorQuadratSituacio, '" onInput="RecuperaColorInput(\'param_ColorQuadratSituacio\', \'colorpicker_ColorQuadratSituacio\');">');
	else  //nomes pels navegadors antics.
		cdns.push(
			"<table class=\"Verdana11px\" border=0 cellspacing=0 cellpadding=0>",
	               "<tr>",
		           "<td>", GetMessage("ViewAreaBackgroundColor", "params") ,": </td>",
	        	   "<td bgcolor=",param_ColorFonsVista," height=\"6\" width=\"20\"></td>",
	                   "<td>&nbsp;<button onClick=\"return ObreFinestraColors('param_ColorFonsVista', '", GetMessage("ViewAreaBackgroundColor", "params") ,"');\"><img align=middle src=colors.gif></button></td>",
			"</tr>",
	               "<tr>",
		           "<td colspan=3 height=\"1\" width=\"2\"></td>",
				   "</tr>",
				   "<tr>",
		           "<td>", GetMessage("SituationRectangleColor", "params"), ":&nbsp;&nbsp; </td>",
		           "<td bgcolor=",param_ColorQuadratSituacio," height=\"6\" width=\"20\"></td>",
                	   "<td>&nbsp;<button onClick=\"return ObreFinestraColors('param_ColorQuadratSituacio', '", GetMessage("SituationRectangleColor", "params") ,"');\"><img align=middle src=colors.gif></button></td>",
	               "</tr></table>");
	return cdns.join("");
}



var ColorWindow=null;
var CadenaVariableTreball="";
var TextDescDelColor="";

function ObreFinestraColors(s,text)
{
	CadenaVariableTreball=s;
	TextDescDelColor=text;
	if (ColorWindow==null || ColorWindow.closed)
	{
		ColorWindow=window.open("colors.htm","FinestraColors",'toolbar=no,status=yes,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=520,height=200');
		ShaObertPopUp(ColorWindow);
	}
	else
		ColorWindow.focus();
	return false;
}

function showOrHideLayersOnTopOfVista()
{
var i_vista;
	var excepcions=["atribucio"];
	if (ParamCtrl.VistaPermanent.length>1)
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			excepcions.push(ParamCtrl.VistaPermanent[i_vista].nom);
	var prefixes=[];
	for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		prefixes.push(ParamCtrl.VistaPermanent[i_vista].nom+"_");
	for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		showOrHideLayersOnTopOfLayer(window, ParamCtrl.VistaPermanent[i_vista].nom, !ParamCtrl.hideLayersOverVista, excepcions, prefixes);
	CreaBarra();
}

function RecuperaValorsFinestraParametres(formul, tancar)
{
	if (document.getElementById("textarea_ConfigJSON").style.display!="none")
	{
		if (CarregaiAdoptaParamCtrl(formul.textarea_ConfigJSON.value)) //error
			return;
	}
	else
	{
		if (MidaDePixelPantalla!=parseFloat(formul.param_MidaAmplePantalla.value)/ParamInternCtrl.vista.ncol);
		{
		    MidaDePixelPantalla=parseFloat(formul.param_MidaAmplePantalla.value)/ParamInternCtrl.vista.ncol;
			CreaBarra(null);
		}
		ParamCtrl.psalt=parseInt(formul.param_psalt.value);
		ParamCtrl.hideLayersOverVista=(formul.param_SobreVistaVisible.checked) ? true : false;  //Això té efectes en el proper redibuixat de la vista
		showOrHideLayersOnTopOfVista();

		ParamCtrl.LlegendaAmagaSegonsEscala=(formul.param_LayersOutSideScale[1].checked) ? true : false;
		ParamCtrl.LlegendaAmagaSiForaAmbit=(formul.param_LayersOutSideTheBBox[1].checked) ? true : false;
		ParamCtrl.LlegendaAmagaSiForaCRS=(formul.param_LayersWithoutSupportCurrentCRS[1].checked) ? true : false;

		ParamCtrl.NDecimalsCoordXY=parseInt(formul.param_NDecimalsCoordXY.value);
		if (formul.param_CoordExtremes[1].checked)
			ParamCtrl.CoordExtremes="proj";
		else if (formul.param_CoordExtremes[2].checked)
		{
			if (formul.param_CoordExtremesGMS.checked)
				ParamCtrl.CoordExtremes="longlat_gms";
			else
				ParamCtrl.CoordExtremes="longlat_g";
		}
		else
		{
		    delete ParamCtrl.CoordExtremes;
		}
		if (formul.param_CoordActualProj.checked)
			ParamCtrl.CoordActualProj=true;
		else
			ParamCtrl.CoordActualProj=false;
		if (formul.param_CoordActualLongLat.checked)
		{
			ParamCtrl.CoordActualLongLatG=true;
			if (formul.param_CoordActualGMS.checked)
				ParamCtrl.CoordActualLongLatGMS=true;
			else
				ParamCtrl.CoordActualLongLatGMS=false;
		}
		else
		{
			ParamCtrl.CoordActualLongLatG=false;
			ParamCtrl.CoordActualLongLatGMS=false;
		}

		if (isFinestraLayer(window, "coord"))
		{
			showOrHideFinestraLayer(window, "coord", formul.param_CoordVisible.checked);
			document.getElementById("llegenda_situacio_coord").innerHTML=DonaCadenaBotonsVistaLlegendaSituacioCoord();
		}
		else
			showOrHideLayer(getLayer(window, "coord"), formul.param_CoordVisible.checked);

		if (formul.param_ZoomUnSolClic[1].checked)
			ParamCtrl.ZoomUnSolClic=true;
		else
			ParamCtrl.ZoomUnSolClic=false;

		ParamCtrl.ColorFonsVista=param_ColorFonsVista;
		ParamCtrl.ColorQuadratSituacio=param_ColorQuadratSituacio;
	}

	GuardaVistaPrevia();
	//ActualitzaEnvParametresDeControl();
	RepintaMapesIVistes();
	if (tancar==true)
		TancaFinestraLayer("param");

	return false;  //per no efectuar l'acció de submit del formulari
}


function MostraConfigJSON(text_area, param_desgranat, button_show)
{
	RecuperaValorsFinestraParametres(document.form_param, false);
	document.getElementById(param_desgranat).style.display="none";

	document.getElementById(text_area).style.display="block";
	document.getElementById(text_area).value=GetMessage("Working") + "...";
	document.getElementById(button_show).style.display="none";
	document.getElementById("text_canvis_aplicats").style.display="none";
	document.getElementById("param_hr_dprs_show").style.display="none";
	document.getElementById("param_button_apply").style.display="none";
	setTimeout("CreaDuplicatNetejaiMostraParamCtrl(\""+text_area+"\")", 200);
}

function OmpleFinestraParametres()
{
var cdns=[], coord_visible, p, unitats_CRS;

	param_ColorFonsVista=ParamCtrl.ColorFonsVista;
	param_ColorQuadratSituacio=ParamCtrl.ColorQuadratSituacio;

	p=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	if (p=="°")
		unitats_CRS=p;
	else
		unitats_CRS=" "+p;

	cdns.push("<form name=\"form_param\" onSubmit=\"return false;\"><div id=\"param_desgranat\" class=\"Verdana11px\">",
		"<fieldset><legend>",
		GetMessage("Georeference"),
		": </legend>",
	        GetMessage("CentralPoint"),":  x: ", OKStrOfNe(ParamCtrl.PuntOri.x, ParamCtrl.NDecimalsCoordXY),
	        unitats_CRS, "; y: ", OKStrOfNe(ParamCtrl.PuntOri.y, ParamCtrl.NDecimalsCoordXY), unitats_CRS, "<br>",
		"<small>&nbsp;&nbsp;&nbsp;", GetMessage("CurrentReferenceSystem") , ": ",
			DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS), " (", ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ")<br>&nbsp;&nbsp;&nbsp;",
		GetMessage("AvailableBoundary"), ": x=(",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX, ParamCtrl.NDecimalsCoordXY),
					",",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX, ParamCtrl.NDecimalsCoordXY),
					"); y=(",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY, ParamCtrl.NDecimalsCoordXY),
					",",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY, ParamCtrl.NDecimalsCoordXY),")<br>&nbsp;&nbsp;&nbsp;",
				GetMessage("CellSize"), ": ", ParamInternCtrl.vista.CostatZoomActual, unitats_CRS,
		"</small></fieldset>",

		"<fieldset><legend>",
		GetMessage("View"),
		": </legend>",
		GetMessage("Width") , ": ", ParamInternCtrl.vista.ncol, "px, ",
		GetMessage("Height") , ": " , ParamInternCtrl.vista.nfil, "px, ",
		GetMessage("WidthOfTheView", "params") , ": <input type=\"text\" size=\"6\" name=\"param_MidaAmplePantalla\" value=\"", OKStrOfNe(MidaDePixelPantalla*ParamInternCtrl.vista.ncol,1), "\" maxlength=\"8\"> mm<br>",
		GetMessage("LateralJumpPerc", "params") , ": <input type=\"text\" size=\"3\" name=\"param_psalt\" value=\"", ParamCtrl.psalt, "\" maxlength=\"3\"> %, ",
		"<input type=\"checkbox\" name=\"param_SobreVistaVisible\" id=\"id_SobreVistaVisible\"", (ParamCtrl.hideLayersOverVista ? " checked=\"checked\"" : ""), "> <label for=\"id_SobreVistaVisible\" accesskey=\"v\">", GetMessage("ShowCleanMap_View", "params"), "</label><br>",
		"<input type=\"radio\" name=\"param_ZoomUnSolClic\" id=\"id_ZoomUnSolClicNo\"", (ParamCtrl.ZoomUnSolClic ? "" : " checked=\"checked\""),"><label for=\"id_ZoomUnSolClicNo\" accesskey=\"2\"> ",
		GetMessage("ZoomPan_2Clicks", "params") , "</label><br>" ,
		"<input type=\"radio\" name=\"param_ZoomUnSolClic\" id=\"id_ZoomUnSolClicSi\"", (ParamCtrl.ZoomUnSolClic ? " checked=\"checked\"" : ""), "><label for=\"id_ZoomUnSolClicSi\" accesskey=\"1\"> ",
		GetMessage("ZoomPan_1ClickDrag", "params") ,
		"</label></fieldset>",

		"<fieldset><legend>",
		GetMessage("Legend", "llegenda"),
		": </legend>",
		GetMessage("LayersOutSideScale", "params") , ": <input type=\"radio\" name=\"param_LayersOutSideScale\" id=\"id_LayersOutSideScaleMostra\"", (ParamCtrl.LlegendaAmagaSegonsEscala ? "" : " checked=\"checked\""), "> <label for=\"id_LayersOutSideScaleMostra\">", GetMessage("Show") ,"</label> <input type=\"radio\" name=\"param_LayersOutSideScale\" id=\"id_LayersOutSideScaleAmaga\"", (ParamCtrl.LlegendaAmagaSegonsEscala ? " checked=\"checked\"" :  ""), "> <label for=\"id_LayersOutSideScaleAmaga\">", GetMessage("Hide") ,"</label><br>",
		GetMessage("LayersOutSideTheBBox", "params"), ": <input type=\"radio\" name=\"param_LayersOutSideTheBBox\" id=\"id_LayersOutSideTheBBoxMostra\"", (ParamCtrl.LlegendaAmagaSiForaAmbit ? "" : " checked=\"checked\""), "> <label for=\"id_LayersOutSideTheBBoxMostra\">", GetMessage("Show") ,"</label> <input type=\"radio\" name=\"param_LayersOutSideTheBBox\" id=\"id_LayersOutSideTheBBoxAmaga\"", (ParamCtrl.LlegendaAmagaSiForaAmbit ? " checked=\"checked\"" : ""), "> <label for=\"id_LayersOutSideTheBBoxAmaga\">", GetMessage("Hide") ,"</label><br>",
		GetMessage("LayersWithoutSupportCurrentCRS", "params"), ": <input type=\"radio\" name=\"param_LayersWithoutSupportCurrentCRS\" id=\"id_LayersWithoutSupportCurrentCRSMostra\"", (ParamCtrl.LlegendaAmagaSiForaCRS ? "" : " checked=\"checked\""), "> <label for=\"id_LayersWithoutSupportCurrentCRSMostra\">", GetMessage("Show") ,"</label> <input type=\"radio\" name=\"param_LayersWithoutSupportCurrentCRS\" id=\"id_LayersWithoutSupportCurrentCRSAmaga\"", (ParamCtrl.LlegendaAmagaSiForaCRS ? " checked=\"checked\"" : ""), "> <label for=\"id_LayersWithoutSupportCurrentCRSAmaga\">", GetMessage("Hide") ,"</label>",
		"</label></fieldset>",

		"<fieldset><legend>",
		GetMessage("Coordinates"),
		": </legend>",
		GetMessage("NOfFigures", "params") , ": <input type=\"text\" size=\"1\" name=\"param_NDecimalsCoordXY\" value=\"", ParamCtrl.NDecimalsCoordXY, "\" maxlength=\"1\"><br>",
		"&nbsp;&nbsp;&nbsp;" , GetMessage("Corners", "params") , ": ",
		   "<input type=\"radio\" name=\"param_CoordExtremes\" id=\"id_CoordExtremesCap\"", (ParamCtrl.CoordExtremes ? "": " checked=\"checked\""), "> <label for=\"id_CoordExtremesCap\" accesskey=\"", GetMessage("None_underlined_char", "params"), "\">", GetMessage("None_underlined", "params") ,"</label> ",
		   "<input type=\"radio\" name=\"param_CoordExtremes\" id=\"id_CoordExtremesProj\"", ((ParamCtrl.CoordExtremes && ParamCtrl.CoordExtremes=="proj") ? " checked=\"checked\"" : ""), "> <label for=\"id_CoordExtremesProj\" accesskey=\"p\">", GetMessage("Proj_underlined_p", "params") ,".</label> ",
                   "<input type=\"radio\" name=\"param_CoordExtremes\" id=\"id_CoordExtremesLongLat\"", ((ParamCtrl.CoordExtremes && (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")) ? " checked=\"checked\"" : ""), "> <label for=\"id_CoordExtremesLongLat\" accesskey=\"l\"><u>L</u>ong/Lat</label> ",
                   "<input type=\"checkbox\" name=\"param_CoordExtremesGMS\" id=\"id_CoordExtremesGMS\"", ((ParamCtrl.CoordExtremes && ParamCtrl.CoordExtremes=="longlat_gms") ? " checked=\"checked\"" : ""), "> <label for=\"id_CoordExtremesGMS\">(° \' \")</label><br>",
		"&nbsp;&nbsp;&nbsp;" , GetMessage("Current") , ": ",
                   "<input type=\"checkbox\" name=\"param_CoordActualProj\" id=\"id_CoordActualProj\"", (ParamCtrl.CoordActualProj ? " checked=\"checked\"" : ""), "> <label for=\"id_CoordActualProj\" accesskey=\"r\">", GetMessage("Proj_underlined_r", "params") ,".</label> ",
		   "<input type=\"checkbox\" name=\"param_CoordActualLongLat\" id=\"id_CoordActualLongLat\"", ((ParamCtrl.CoordActualLongLatG || ParamCtrl.CoordActualLongLatGMS) ? " checked=\"checked\"" : ""), "> <label for=\"id_CoordActualLongLat\" accesskey=\"o\">L<u>o</u>ng/Lat</label> ",
		   "(<input type=\"checkbox\" name=\"param_CoordActualGMS\" id=\"id_CoordActualGMS\"", (ParamCtrl.CoordActualLongLatGMS ? " checked=\"checked\"" : ""), "> <label for=\"id_CoordActualGMS\">(° \' \")</label>) ");
	if (isFinestraLayer(window, "coord"))
		coord_visible=isFinestraLayerVisible(window, "coord");
	else
		coord_visible=isLayerVisible(getLayer(window, "coord"));
	cdns.push("<input type=\"checkbox\" name=\"param_CoordVisible\" id=\"id_CoordVisible\"", (coord_visible ? " checked=\"checked\"" : ""), "> <label for=\"id_CoordVisible\" accesskey=\"", GetMessage("ShowWindow_underlined_char", "params"), "\">", GetMessage("ShowWindow_underlined", "params"), "</label>",
		   "</fieldset>",
		"<fieldset><legend>",
		GetMessage("Colors"),
		": </legend>",
		"<div id=\"param_colors\">",
		DonaTextParamColors(),
		"</div></fieldset>",
		"<fieldset><legend>",
		GetMessage("UserConfiguration"),
		": </legend>",
		"<div id=\"param_config_storage\">",
		"<label for=\"configLoadBtn\">", GetMessage("SelectConfigLoad"), "</label>&nbsp;",
		"<button class=\"Verdana11px\" id=\"configLoadBtn\" onclick=\"document.getElementById('selectConfigFileInput').click();return false;\">", GetMessage("Load"), "</button><br>",
		"<input TYPE=\"file\" id=\"selectConfigFileInput\" accept=\".json,.geojson\" multiple=\"false\" style=\"display:none\" onChange='RecuperaConfiguracioUsuari(this.files)'>",
		"<label for=\"configLoadBtn\">", GetMessage("FileNameToSave"), "</label>: &nbsp;",
		"<input TYPE=\"text\" id=\"\" name=\"textFileInput\" placeholder=\"", GetMessage("FileName"),"\" maxlength=\"15\">&nbsp;",
		"<input TYPE=\"button\" class=\"Verdana11px\" value=\"", GetMessage("Save"), "\" onClick='GuardaConfiguracioUsuari(ParamCtrl, form.textFileInput.value)'> ",
		"</div></fieldset>",
		GetMessage("JsonConfigurationFile", "params"),
		":&nbsp;&nbsp;<input TYPE=\"button\" id=\"button_show_ConfigJSON\" class=\"Verdana11px\" value=\"", GetMessage("Show"),
		"\" onClick='MostraConfigJSON(\"textarea_ConfigJSON\",\"param_desgranat\", \"button_show_ConfigJSON\");'>&nbsp;<small id=\"text_canvis_aplicats\"><i>(",
		GetMessage("changesAboveWillBeApplied", "params"),
		")</i></small></div>",
		"<textarea id=\"textarea_ConfigJSON\" name=\"textarea_ConfigJSON\" rows=\"39\" cols=\"70\" wrap=\"off\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" style=\"display:none\"></textarea></div>",
		"<div id=\"param_hr_dprs_show\"></div>",
		"<div align=\"center\">",
		"<input TYPE=\"button\" class=\"Verdana11px\" value=\"", GetMessage("OK"), "\" onClick=\"RecuperaValorsFinestraParametres(document.form_param, true);\"> ",
		"<input TYPE=\"button\" class=\"Verdana11px\" value=\"", GetMessage("Cancel"), "\" onClick='TancaFinestraLayer(\"param\");'> &nbsp;&nbsp;",
		"<input id=\"param_button_apply\" TYPE=\"button\" class=\"Verdana11px\" value=\"", GetMessage("Apply"), "\" onClick=\"RecuperaValorsFinestraParametres(document.form_param, false);\"></div>",
	        "</form>");
	contentFinestraLayer(window, "param", cdns.join(""));
}

function MostraFinestraParametres()
{
	ComprovaCalTancarFeedbackAmbScope();
	if (!ObreFinestra(window, "param", GetMessage("ofChangingParameters", "params")))
		return;
	OmpleFinestraParametres();
}

/*
*	Funció per a guardar el fitxer de configuració de JSON en memòria
*/
function GuardaConfiguracioUsuari(userConfig, fileName)
{
	if (fileName.length < 1)
		return false
	// Fem que els canvis de ParamInternCtrl passin a ParamCtrl.
	RecuperaValorsFinestraParametres(document.form_param, true);
	// Guardem el nivell de zoom
	userConfig.NivellZoomCostat = ParamInternCtrl.vista.CostatZoomActual;

  	return GuardaDadesJSONFitxerExtern(userConfig, fileName);
}

/*
*	Funció per a obrir el fitxer de configuració de JSON en memòria
*/
function RecuperaConfiguracioUsuari(files)
{
		if (files.length < 1)
			return false;
		const path = files[0];
		if (path.length < 1)
			return false;
		if (path.type=="application/json" || path.type=="application/geo+json")
		{
			//https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
			const fileReader = new FileReader();
			fileReader.nom_json = "./"+path.name; //Així onload pot saber el nom del fitxer
			fileReader.onload = function(e) {
				try {
							loadJSON(this.nom_json,
							IniciaParamCtrlIVisualitzacio,
							function(xhr) { alert(xhr); },
							{div_name:ParamCtrl.containerName, config_json:this.nom_json, config_reset: true, usa_local_storage: false});
				}
				catch (e){
					alert("JSON file error. " + e);
				}
			};
			fileReader.readAsText(path);
		}
		else
		{
			alert("Unrecognized file type '"+path.type+ "' for the file '"+ path.name + "'");
		}

		return false;
}
