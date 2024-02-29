﻿/*
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
    amb l'ajut de Alba Brobia (a brobia at creaf uab cat) i Dídac Pardell
    dins del grup del MiraMon. MiraMon és un projecte del
    CREAF que elabora programari de Sistema d'Informació Geogràfica
    i de Teledetecció per a la visualització, consulta, edició i anàlisi
    de mapes ràsters i vectorials. Aquest progamari programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert.

    En particular, el Navegador de Mapes del MiraMon (client per Internet)
    es distribueix sota els termes de la llicència GNU Affero General Public
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.

    El Navegador de Mapes del MiraMon es pot actualitzar des de
    https://github.com/grumets/MiraMonMapBrowser.
*/

"use strict"

var indexStoryMapActiu=null;
const tinyTextId = "storyTextArea";
// Crea inici Storymap identificadors.
const inputstoryTitolId = "inputtitolRelat";
const inputThumbnailId = "inputThumbnail";
const h1TitleStorymap = "titleStorymap";
const imageThumbnailId = "imageThumbnail";
// Límit de mida per imatges. Establerta en píxels.
const midaImatgeMiniaturaMaximaPx = 150;
const midaImatgeMaximaPx = 500;
const numMaximPixels = Math.pow(midaImatgeMaximaPx, 2);
// Extensions imatges permeses.
const pngMIMETType = "image/png", jpgMIMEType = "image/jpg", jpegMIMEType = "image/jpeg";
// Identificador input imatges internes del Storymap.
const inputImageId = "imagePicker";
// Identificadors diàlegs
const dialogCaractId = "caractDialog", dialogMidesId = "midesDialog", dialogAlertaId = "dialogAlerta";
// Dialeg Mida Imatges identificadors
const lableWidthId = "labelWidth", inputWidthId = "widthMesure", lableHeightId = "labelHeight", inputHeightId = "heightMesure", confirmImageBtnId = "confirmImageBtn", chboxProportionalId = "chboxProportional", selectSizeUnitId = "selectSizeUnit";
// Dialeg Característiques checkbox identificadors i noms
const chBoxTempsId = "chboxDate", chboxTempsName = "date", chBoxCapesStyleId = "chboxLayerStyle", chboxCapesStyleName = "layerStyle",  chBoxPosZoomId = "chboxPosZoom", chboxPosZoomName = "positionZoom", confirmCaractBtnId = "confirmCaractBtn", chboxCapesName = "layers", chboxEstilsName = "styles", chboxZoomName = "zoom", chboxCoordName = "coordinates";
const pixelUnit = "px", percentageUnit = "%";
const limitsMidesImatge = {};
var resultatMidesImatge = {};
var resultatCaract = {[chboxCapesName]: {}, [chboxEstilsName]: {}, [chboxZoomName]: {}, [chboxCoordName]: {}, [chboxTempsName]:{}};
const nomImgPuntSincr = "sincrPoint";
// Tots els idiomes suportats pel navegador amb les seves correspondències amb els idiomes de Tiny Editor.
const idiomesTiny = {cat: 'ca', spa: 'es', eng: 'en', cze: 'cs', ger: 'de', fre: 'fr_FR'};
// Origen dels relats fets per usuaris.
const relatUsuari = "usuari";


IncludeScript("tinymce/js/tinymce/tinymce.min.js");

//Mostra la finestra que conté el llistat d'històries
function MostraFinestraTriaStoryMap()
{
	if (!ObreFinestra(window, "triaStoryMap"))
		return;
	OmpleFinestraTriaStoryMap(window, "triaStoryMap");
}

function TancaFinestra_triaStoryMap()
{
	indexStoryMapActiu=null;
}


function TancaFinestra_visualitzaStoryMap()
{
	indexStoryMapActiu=null;
}

//Omple la finestra amb el llistat d'històries (i mostra la imatge de pre-visualització de la història).
function OmpleFinestraTriaStoryMap(win, name)
{
var cdns=[], i_story=0, ncol=2, nstory=0, i_real_story=[], newStory={"desc": GetMessageJSON("NewStorymap", "storymap"), "src": "nova_storymap.svg", "url": "", "isNew": true};

	if (ParamCtrl.StoryMap == null)
	{
		ParamCtrl.StoryMap = [];
		ParamCtrl.StoryMap.push(newStory);
	}
	else if (ParamCtrl.StoryMap[ParamCtrl.StoryMap.length-1].isNew != true)
	{
		const indexNovaStorymap = ParamCtrl.StoryMap.findIndex(story => story.isNew == true);
		if (indexNovaStorymap != -1)
		{
			ParamCtrl.StoryMap.splice(indexNovaStorymap, 1);
			ParamCtrl.StoryMap.push(newStory);
		}
		else 
		{
			ParamCtrl.StoryMap.push(newStory);	
		}
	}
	let indexSeg = 0;
	while (nstory < ParamCtrl.StoryMap.length)
	{
		if (ParamCtrl.StoryMap[nstory].EnvTotal && !EsEnvDinsAmbitActual(ParamCtrl.StoryMap[nstory].EnvTotal))
		{
			nstory++;
			continue;
		}
			
		i_real_story[indexSeg]=nstory;  // Ens quedem els índex que correpsonen a Stories dins l'àmbit del mapa.
		indexSeg++;
		nstory++;
	}
	cdns.push("<br><button style='position:relative; right:5px;' onclick='DemanaStorymapsNimmbus(\"", name, "\")'><img src='baixada_nuvol.svg' alt='Download' width='23'/>",
				GetMessage("RetrieveStorymap", "storymap"), "</button>", "<br><br>",
				GetMessage("SelectStory", "storymap"), ":" ,
				"<br><table class=\"Verdana11px\">");

	// Omplim totes les histories
	while (i_story<i_real_story.length)
	{
		const storyActual = ParamCtrl.StoryMap[i_real_story[i_story]];
		if ((i_story%ncol)==0)
			cdns.push("<tr>");
		cdns.push("<td style = 'vertical-align:text-top; text-align: center;'><a style='display: block;", /*background:", storyActual.compartida? "green" : "red", ";'*/" href='javascript:void(0)' onclick='");
		(storyActual.isNew) ? cdns.push("TancaICreaEditaStoryMap();'>") : cdns.push("TancaIIniciaStoryMap(", i_real_story[i_story], ");'>");
		cdns.push("<img src='",(storyActual.src) ? storyActual.src : (storyActual.srcData) ? storyActual.srcData : AfegeixAdrecaBaseSRC("1griscla.gif"),"' height='100' width='150' border='0'><p>",
			DonaCadena(storyActual.desc),
		"</p></a></td>");
			//style='position:relative; top:0px; right:0px; height:50px; width:50px;'
		/* Incrementem valor en aquest precís instant per aconseguir que
		incloure els tags <tr> i </tr> sigui l'adequat, tal que quan s'inclou
		<tr> el </tr> no s'inclou fins la següent iteració que compleixi
		la condició.*/
		i_story++;
		if ((i_story%ncol)==0 || i_story==nstory)
			cdns.push("</tr>");
	}
	cdns.push("</table>");
	contentFinestraLayer(win, name, cdns.join(""));
	indexStoryMapActiu=-1;
}

function DemanaStorymapsNimmbus(name)
{
	const urlIdNavegador = ParamCtrl.ServidorLocal;
	const urlServidor = new URL(urlIdNavegador);
	const elem = getFinestraLayer(window, name);
	GUFShowPreviousFeedbackWithReproducibleUsageInHTMLDiv(elem, "triaStoryMap_finestra", urlServidor.host, urlIdNavegador,
	{ru_platform: encodeURI(ToolsMMN), ru_version: VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers,
		ru_schema: encodeURIComponent(config_schema_storymap) /*, ru_sugg_app: location.href -> no cal passar-ho perquè s'omple per defecte*/},
	ParamCtrl.idioma, DonaAccessTokenTypeFeedback(urlIdNavegador) /*access_token_type*/, "AdoptaStorymap"/*callback_function*/, null);
}
/**
 * Ens permet descarregar un relat concret que estigui disponible a la plataforma Nimmbus i pel nostre mapa. 
 * @param {*} guf 
 * @returns 
 */
function AdoptaStorymap(guf)
{
	if (!guf)
	{
		// modificar text missatge per relats.
		alert(GetMessage("UnexpectedDefinitionOfFeedback", "qualitat") + ". " + GetMessage("StorymapCannotImported", "storymap") + ".");
		TancaFinestraLayer('feedbackAmbEstils');
		return;
	}

	const storyMapAGuardar = {compartida: true};
	const parserAWeb = new DOMParser();
	const relatSencer = parserAWeb.parseFromString(guf.usage.usage_descr.code, "text/html");
	const errorNode = relatSencer.querySelector("parsererror");
	if (errorNode) {
		console.log(errorNode.innerHTML);
		return;
	}

	// Trobem la imatge de portada si n'hi ha.
	const imgPortada = relatSencer.querySelector("img#" + imageThumbnailId);
	if (imgPortada) 
	{
		storyMapAGuardar.srcData = imgPortada.src;
		imgPortada.remove();
	}
	// Trobem el títol del relat si n'hi ha
	const titol = relatSencer.querySelector("h1#" + h1TitleStorymap);
	if (titol) 
	{
		storyMapAGuardar.desc = titol.textContent;
		titol.remove();
	}
	const parser = new XMLSerializer();
	storyMapAGuardar.html = parser.serializeToString(relatSencer);
	
	ParamCtrl.StoryMap.push(storyMapAGuardar);
}

function TancaIIniciaStoryMap(i_story)
{
	//Tancar la caixa de les histories
	TancaFinestraLayer("triaStoryMap");
	IniciaStoryMap(i_story);
}

// Deficinció de la nova StoryMap
var novaStoryMap = {};
// Identificador relat essent editat.
var idRelatEditat = "";

function TancaICreaEditaStoryMap(i_relat = "nou")
{
	let storyToEdit;
	if (i_relat != "nou")
	{
		TancaFinestraLayer("storyMap");

		storyToEdit = ParamCtrl.StoryMap[i_relat];
		idRelatEditat = storyToEdit.id;
	}
	else
	{
		//Tancar la finestra de la graella de les histories
		TancaFinestraLayer("triaStoryMap");
	}

	if (isFinestraLayer(window, "creaStoryMap"))
	{
		const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
		novaStoryMapFinestra.replaceChildren();
		const beginingStoryMapContent = ["<br><br><label for='title'>", GetMessage('Title') + ":", "</label><input type='text' id='", inputstoryTitolId, "' name='title' minlength='1' size='25' value='", (i_relat != "nou" ? storyToEdit.desc : ""), "'/><br><br>",
						"<label>", GetMessage('StorymapThumbnailImage', 'storymap') + "(JPEG ",GetMessage("or")," PNG): ", "</label>",
						"<button class=\"Verdana11px\" onclick=\"document.getElementById('",inputThumbnailId,"').click()\">"+GetMessage("SelectImage", "storymap")+"</button>",
						"<input id='", inputThumbnailId, "' type='file' align='center' accept='.jpg,.jpeg,.png' style='display:none' onChange='CarregaImatgeStoryMap(this, \"imageThumbnail\", )'/><br><br>",												
						"<img id='", imageThumbnailId, "' alt='", GetMessage("StorymapThumbnailImage", "storymap"), "' title='", GetMessage("StorymapThumbnailImage", "storymap"), "' style='visibility:", (i_relat != "nou" && storyToEdit.srcData ? "visible" : "hidden"),";' ", (i_relat != "nou" && storyToEdit.srcData ? "src='" + storyToEdit.srcData + "'" : ""),"/><br>",
						"<input class='buttonDialog' type='button' value='", GetMessage("Next"), "' onClick='SeguentPasStoryMap(\"", i_relat, "\")'>"];
		novaStoryMapFinestra.insertAdjacentHTML("afterbegin", beginingStoryMapContent.join(""));
	}

	ObreFinestra(window, "creaStoryMap");
}
/**
 * Seqüència sincrona de operacións per a la selecció de la imatge pertinent, modificació de les mides d'aquesta i càrrega de <img> dins del HTML del Tiny.    
 * @param {*} input Element DOM tipus input que incorpora la imatge. 
 */
function CarregaImatgeStoryMap(input) 
{
	const fitxerObjectiu = input.files ? input.files[0] : null;

	if (fitxerObjectiu &&  (fitxerObjectiu.type == pngMIMETType || fitxerObjectiu.type == jpgMIMEType || fitxerObjectiu.type == jpegMIMEType))
	{
		if (input.id == inputImageId)
		{
			CarregaImatgeRelatStoryMap(fitxerObjectiu);
		}
		else if (input.id == inputThumbnailId)
		{
			CarregaImatgeMiniaturaStoryMap(fitxerObjectiu);
		}
	}
}

/**
 * Seqüència sincrona de operacións per a la selecció de la imatge pertinent, modificació de les mides d'aquesta i càrrega de <img> dins del HTML del Tiny.    
 * @param {*} fitxerImatge Element DOM tipus input que incorpora la imatge. 
 */
function CarregaImatgeRelatStoryMap(fitxerImatge) 
{
	const midesPromise = new Promise((resolve, reject) => {

		//Mirem la mida de la imatge
		const urlIamge = URL.createObjectURL(fitxerImatge);
		const imageToMesure = new Image();

		imageToMesure.onload =  function () {
			URL.revokeObjectURL(this.src);
			if (this)
			{
				resolve(this);
			}
			else
			{
				reject(new Error("Error carregant la imatge."))
			}
		};

		imageToMesure.src = urlIamge;
	}).then(result => {

		MostraDialogImatgeNavegador(result);

	});
}
/**
 * Seqüència sincrona de operacións per a la selecció de la imatge pertinent, modificació de les mides d'aquesta i càrrega de <img> de portada del relat.    
 * @param {*} fitxerImatge Element DOM tipus input que incorpora la imatge. 
 */
function CarregaImatgeMiniaturaStoryMap(fitxerImatge) 
{
	//Mirem la mida de la imatge
	const urlIamge = URL.createObjectURL(fitxerImatge);
	const imageToMesure = new Image();
	try{
		imageToMesure.onload =  function () {
			URL.revokeObjectURL(this.src);
			if (this)
			{
				const canvasThumbnailId = "canvasReduccioThumbnail";
				let canvasReduccioThumbnail = document.getElementById(canvasThumbnailId);
				if (!canvasReduccioThumbnail)
				{
					canvasReduccioThumbnail = document.createElement("canvas");
					canvasReduccioThumbnail.setAttribute("id", canvasThumbnailId);
				}
				canvasReduccioThumbnail.width = midaImatgeMiniaturaMaximaPx;
				canvasReduccioThumbnail.height = midaImatgeMiniaturaMaximaPx * this.height / this.width;
				const cntx = canvasReduccioThumbnail.getContext("2d");
				cntx.drawImage(this, 0, 0, canvasReduccioThumbnail.width, canvasReduccioThumbnail.height);
				const imageThumbnail = document.getElementById(imageThumbnailId);
				imageThumbnail.setAttribute("style", "visibility:visible;");
				imageThumbnail.src = canvasReduccioThumbnail.toDataURL("image/jpeg", 0.5);
 			}
		}
	}
	catch (err)
	{
		throw new Error(GetMessage("ErrorReadingImages", "storymap") + ":", {cause: err});
	}

	imageToMesure.src = urlIamge;
}
/**
 * Crea un diàleg que apareix flotant al centre de la pantalla per a que l'usuari decideixi
 * sobre la mida de la imatge que vol incorporar al Storymap. 
 * @param {*} imatge El fitxer imatge que es vol incloure a la Storymap.
 * @returns Cadena HTML amb les mides de la imatge que es preten carregar i 2 caixes de text per indicar-ne les noves mides.
 */
function CreaDialegMidesImatge(imatge)
{
	const textMides = GetMessage("OriginalMeasurementsImage", "storymap") + ": <b>" + imatge.width + GetMessage("pxWidth", "storymap") + "</b>, <b>" + imatge.height + GetMessage("pxHeight", "storymap") + "</b>."
	const dialogHtml = ["<form><p>", textMides, "</p><div align-items='stretch'><p style='align: center'><label id='" + lableWidthId + "' for='", inputWidthId, "'>"+ GetMessage("ReducedWidth", "storymap") + " (" + percentageUnit +"):</label><input type='text'  id='", inputWidthId, "' title='Only digits'><label id='" + lableHeightId + "' for='", inputHeightId, "'>"+ GetMessage("ReducedHeight", "storymap") + " (" + percentageUnit + "):</label><input type='text' title='Only digits' id='", inputHeightId, "' ></p><p><label for='" + selectSizeUnitId + "'>" + GetMessage("ChooseUnitMeasurement", "storymap") + ":</label><select id='" + selectSizeUnitId + "'><option value='" + pixelUnit + "'>" + pixelUnit + "</option><option value='" + percentageUnit + "' selected>" + percentageUnit + "</option></select><label for='", chboxProportionalId, "'>" + GetMessage("MaintainProportionality", "storymap") + "</label><input type='checkbox' id='", chboxProportionalId, "' checked></p><p style='align: center'><button id='", confirmImageBtnId, "' class='button_image_dialog buttonDialog' formmethod='dialog' value='default'>" + GetMessage("OK") + "</button><button class='button_image_dialog buttonDialog' value='cancel' formmethod='dialog'>" + GetMessage("Cancel") + "</button></p></div></form>"];

	return CreaDialog(dialogMidesId, dialogHtml.join(""));
}
/**
 * Crea un diàleg per a elegir quines característiques del mapa mantindre per un determinat fragment del relat.
 * @returns 
 */
function CreaDialegSincronitzarAmbMapa()
{
	const dialogHtml = ["<form><p>" + GetMessage("SelectMapFeatures", "storymap") + "</p><div class='horizontalSpreadElements'><p><input type='checkbox' id='", chBoxPosZoomId, "' name='", chboxPosZoomName,"'><label for='", chBoxPosZoomId, "'>" + GetMessage("Position&Zoom", "storymap") + "</label></p><p><input type='checkbox' id='", chBoxCapesStyleId, "' name='", chboxCapesStyleName,"'><label for='", chBoxCapesStyleId, "'>" + GetMessage("Layers&Styles", "storymap") + "</label></p><p><input type='checkbox' id='", chBoxTempsId, "' name='", chboxTempsName,"'><label for='", chBoxTempsId, "'>" + GetMessage("Date") + "</label></p></div><div class= 'horizontalSpreadElements'><button id='", confirmCaractBtnId, "' formmethod='dialog' value='default'>" + GetMessage("OK") + "</button><button value='cancel' formmethod='dialog'>" + GetMessage("Cancel") + "</button></div></form>"];

	return CreaDialog(dialogCaractId, dialogHtml.join(""));
}

function CreaDialegAlertaSeleccio()
{
	const dialogHtml = ["<form><div><p>" + GetMessage("SaveMapCharactMandatory", "storymap") + ":</p><p style= 'text-align: center;'><button class='buttonDialog' value='cancel' formmethod='dialog'>", GetMessage("OK"), "</button></p></div></form>"];

	const dialog = CreaDialog(dialogAlertaId, dialogHtml.join(""));

	dialog.setAttribute("style", "max-width: 25%;");

	return dialog;
}

function MostraDialogImatgeNavegador(imatgeSeleccionada)
{
	const esImatgeApaisada = imatgeSeleccionada.width >= imatgeSeleccionada.height;
	function calcularLimitImatges(imatgeSeleccionada)
	{
		let proporcio = imatgeSeleccionada.height/imatgeSeleccionada.width;
		if (esImatgeApaisada)
		{
			limitsMidesImatge.width = {};
			limitsMidesImatge["width"][percentageUnit] = midaImatgeMaximaPx * 100 / imatgeSeleccionada.width;
			limitsMidesImatge["width"][pixelUnit] = midaImatgeMaximaPx;
			limitsMidesImatge.height = {};
			limitsMidesImatge["height"][pixelUnit] = limitsMidesImatge["width"][pixelUnit] * proporcio;
			limitsMidesImatge["height"][percentageUnit] = limitsMidesImatge["height"][pixelUnit] * 100 / imatgeSeleccionada.height;
		}
		else 
		{
			limitsMidesImatge.height = {};
			limitsMidesImatge["height"][percentageUnit] = midaImatgeMaximaPx * 100 / imatgeSeleccionada.height;
			limitsMidesImatge["height"][pixelUnit] = midaImatgeMaximaPx;
			limitsMidesImatge.width = {};
			limitsMidesImatge["width"][pixelUnit] = limitsMidesImatge["height"][pixelUnit] * (1 / proporcio);
			limitsMidesImatge["width"][percentageUnit] = limitsMidesImatge["width"][pixelUnit] * 100 / imatgeSeleccionada.width;
		}	
	}

	calcularLimitImatges(imatgeSeleccionada);
	// Element del DOM que ens permet anclar el dialeg
	let anchorElement = document.getElementById(inputImageId);
	
	if (anchorElement)
	{
		const midesDialog = CreaDialegMidesImatge(imatgeSeleccionada);
		anchorElement.insertAdjacentElement("afterend", midesDialog);
		
		midesDialog.addEventListener("close", (event) => {
			// Després de tancar el missatge emergent de les mides.
			let resultatMides = JSON.parse(event.target.returnValue);
			if (resultatMides) {
				const canvasId = "reduccioImatges";
				let canvasReduccioImg = document.getElementById(canvasId);
				if (!canvasReduccioImg)
				{
					canvasReduccioImg = document.createElement("canvas");
					canvasReduccioImg.setAttribute("id", canvasId);
				} 

				canvasReduccioImg.width = resultatMides.width;
				canvasReduccioImg.height = resultatMides.height;

				const cntx = canvasReduccioImg.getContext("2d");
				cntx.drawImage(imatgeSeleccionada, 0, 0, resultatMides.width, resultatMides.height);
				const tinyEditor = tinymce.get(tinyTextId);
				const imatgeReduida = canvasReduccioImg.toDataURL("image/jpeg", 0.5);
				// "data:," és el resultat de crear una imatge amb canvas mides (0,0). Això passa en introduir caracters enlloc de números.
				if (tinyEditor && imatgeReduida && imatgeReduida!="data:,")
				{ 
					let writenOnTiny = tinyEditor.getContent();
					tinyEditor.setContent(writenOnTiny + "<img src='" + imatgeReduida + "' width=" + resultatMides.width + "/>", { format: 'html' });
				}
			}
			resultatMidesImatge = {};
		});
		// Entrada de mides imatge
		const inputWidth = document.getElementById(inputWidthId);
		inputWidth.value = limitsMidesImatge["width"][percentageUnit];
		resultatMidesImatge.width = limitsMidesImatge["width"][percentageUnit];
		inputWidth.addEventListener("change", (event) => {
			if (chboxProportional.checked)
			{
				resultatMidesImatge = adaptImageGivenProportionaly({width: event.target.value, height: resultatMidesImatge.height}, imatgeSeleccionada, event.target);
				updateSizeInputValues(resultatMidesImatge.width, resultatMidesImatge.height);
			}
			else
			{
				resultatMidesImatge.width = parseFloat(event.target.value);
			}
			confirmBtn.disabled = checkForEmptyValuesOrNonNumbers(inputWidth, inputHeight);
		});
		const inputHeight = document.getElementById(inputHeightId);
		inputHeight.value = limitsMidesImatge["height"][percentageUnit];
		resultatMidesImatge.height = limitsMidesImatge["height"][percentageUnit];
		inputHeight.addEventListener("change", (event) => {
			if (chboxProportional.checked)
			{
				resultatMidesImatge = adaptImageGivenProportionaly({width: resultatMidesImatge.width, height: event.target.value}, imatgeSeleccionada, event.target);
				updateSizeInputValues(resultatMidesImatge.width, resultatMidesImatge.height);
			}
			else
			{
				resultatMidesImatge.height = parseFloat(event.target.value);
			}			
			confirmBtn.disabled = checkForEmptyValuesOrNonNumbers(inputWidth, inputHeight);
		});
		// Checkbox Propocional
		const chboxProportional = document.getElementById(chboxProportionalId);
		chboxProportional.addEventListener("change", (event) => {
			if (event.target.checked)
			{
				resultatMidesImatge = adaptImageGivenProportionaly(resultatMidesImatge, imatgeSeleccionada, null);
				updateSizeInputValues(resultatMidesImatge.width, resultatMidesImatge.height);
				confirmBtn.disabled = checkForEmptyValuesOrNonNumbers(inputWidth, inputHeight);
			}
		});
		// Selector de unitats
		const selector = document.getElementById(selectSizeUnitId);
		selector.addEventListener("change", (event) => {
			updateUnitChangeInputValuesLabelUnits(event.target.value, imatgeSeleccionada);
		});
		// Botó de confirmació
		const confirmBtn = document.getElementById(confirmImageBtnId);
		confirmBtn.addEventListener("click", (event) => {
			event.preventDefault();
			if (checkImageLimits())
			{
				let midesConfirmades = 0;
				selector.value == percentageUnit ? midesConfirmades = JSON.stringify({width: resultatMidesImatge.width*imatgeSeleccionada.width/100, height: resultatMidesImatge.height*imatgeSeleccionada.height/100}) : midesConfirmades = JSON.stringify(resultatMidesImatge);

				midesDialog.close(midesConfirmades); // S'envia les mides en pixels al diàleg.	
			}
			else 
			{
				alert("La mida de imatge desitjada supera el límit establert. Redueixi-la.");
			}
		});
		
		// Comprovem que no tenim valors en els caixetins de mides.
		const checkForEmptyValuesOrNonNumbers = new Function("inputWidth", "inputHeight", "return isNaN(parseFloat(inputWidth.value)) || isNaN(parseFloat(inputHeight.value))");
		
		// Comprovem per les proporcions de la imatges quines són les mides més amplies que ens podem permetre.
		function checkImageLimits()
		{
			if (chboxProportional.checked)
			{
				if (esImatgeApaisada)
				{
					return resultatMidesImatge.width <= limitsMidesImatge["width"][selector.value];
				}
				else 
				{
					return resultatMidesImatge.height <= limitsMidesImatge["height"][selector.value];
				}
			}
			else
			{
				if (selector.value == pixelUnit)
				{
					return resultatMidesImatge.width*resultatMidesImatge.height <= numMaximPixels;
				}
				else
				{
					return (resultatMidesImatge.width*imatgeSeleccionada.width/100) * (resultatMidesImatge.height*imatgeSeleccionada.height/100) <= numMaximPixels;

				}
			}
		}

		// En tenir només 1 de les dos mides definides, com adaptem l'altra dimensió per a que mantingui la proporció.
		function adaptImageGivenProportionaly(midesAdaptImatge, imatgeOriginal, novaMesura) {
			
			if(!(isNaN(midesAdaptImatge.width) && isNaN(midesAdaptImatge.height)))
			{
				let proporcio =  imatgeOriginal.height / imatgeOriginal.width;
				// Quan tenim dos valors prenem la base del width per buscar la proporcionalitat. Decisió arbitraria.
				if (!isNaN(midesAdaptImatge.width) && (novaMesura == inputWidth || novaMesura == null))
				{
					if (selector.value == percentageUnit)
					{
						let valorPxWidth = midesAdaptImatge.width * imatgeOriginal.width / 100;
						let valorPxHeight = proporcio * valorPxWidth;
	
						return {width: midesAdaptImatge.width, height: valorPxHeight * 100 / imatgeOriginal.height};
					}
					else
					{
						return {width: midesAdaptImatge.width, height: proporcio * midesAdaptImatge.width};
					}
				}
				else 
				{
					if (selector.value == percentageUnit)
					{
						let valorPxHeight = midesAdaptImatge.height * imatgeOriginal.height / 100;
						let valorPxWidth =  valorPxHeight * imatgeOriginal.width / imatgeOriginal.height;
	
						return {width: valorPxWidth * 100 / imatgeOriginal.width, height: valorPxHeight * 100 / imatgeOriginal.height};
					}
					else
					{
						return {width:  midesAdaptImatge.height * (1 / proporcio), height: midesAdaptImatge.height};
					}
				}
			} 
			else  
				return {width: NaN, height: NaN};
		};
		
		// Actualitzem els valors dels caixetins amb nous valors.
		function updateSizeInputValues(widthField, heightField) 
		{
			inputWidth.value = widthField;
			inputHeight.value = heightField;
		}

		// Actualitzem les unitats de mesura i els valors de les mides segons el nou valor del selector d'unitats.
		function updateUnitChangeInputValuesLabelUnits(nextUnit, imatgeOriginal)
		{	
			// Actualitza etiquetes unitats.
			const labelWidth = document.getElementById(lableWidthId);
			const labelHeight = document.getElementById(lableHeightId);
			if (nextUnit == percentageUnit)
			{
				labelWidth.innerText = labelWidth.innerText.replace(pixelUnit, percentageUnit);
				labelHeight.innerText = labelHeight.innerText.replace(pixelUnit, percentageUnit);
			}
			else 
			{
				labelWidth.innerText = labelWidth.innerText.replace(percentageUnit, pixelUnit);
				labelHeight.innerText = labelHeight.innerText.replace(percentageUnit, pixelUnit);
			}

			// Actualitza valors caixetins segons nova unitat de mesura.
			// Passem de valors en píxels a valors en percentatge.
			if (selector.value == percentageUnit)
			{
				resultatMidesImatge.width = isNaN(resultatMidesImatge.width) ? NaN : resultatMidesImatge.width * 100 / imatgeOriginal.width;
				resultatMidesImatge.height = isNaN(resultatMidesImatge.height) ? NaN : resultatMidesImatge.height * 100 / imatgeOriginal.height;
			}
			else // Passem de valors en percentatge a valors en píxels.
			{
				resultatMidesImatge.width = isNaN(resultatMidesImatge.width) ? NaN : resultatMidesImatge.width * imatgeOriginal.width / 100;
				resultatMidesImatge.height = isNaN(resultatMidesImatge.height) ? NaN : resultatMidesImatge.height * imatgeOriginal.height / 100;
			}

			updateSizeInputValues(resultatMidesImatge.width, resultatMidesImatge.height);
			
		}
		
		midesDialog.showModal();
	}
}

function MostraDialogCaracteristiquesNavegador(ultimElemId)
{
	const ultimElem = document.getElementById(ultimElemId);
	const tinyEditor = tinymce.get(tinyTextId);

	/*if (ultimElem && tinyEditor.selection.getContent({format: "html"}) != "")
	{*/
		const caractDialog = CreaDialegSincronitzarAmbMapa();
		ultimElem.insertAdjacentElement("afterend", caractDialog);		

		caractDialog.addEventListener("close", (event) => {
			
			if (event.target.returnValue != "")
			{	
				let resultatCaractUsuari = "";
				try
				{
					resultatCaractUsuari = JSON.parse(event.target.returnValue);
				}
				catch(e)
				{
					if (e instanceof SyntaxError && event.target.returnValue == "cancel")
					{
						// El contingut no és un JSON vàlid perquè s'ha cancel·lat l'acció.
						return
					}
				}
				
				if(resultatCaractUsuari[chboxPosZoomName]["status"])
				{
					resultatCaractUsuari[chboxCoordName]["attribute"] = {name: "data-mm-center", value: JSON.stringify(DonaCentreVista())};
					resultatCaractUsuari[chboxZoomName]["attribute"] = {name: "data-mm-zoom", value: ParamInternCtrl.vista.CostatZoomActual};
				}
	
				if(resultatCaractUsuari[chboxCapesStyleName]["status"])
				{
					const capesVisiblesIds = [];
					const estilsCapesIds = [];
					ParamCtrl.capa.forEach(capa => { 
						if (capa.visible=="si")
						{
							capesVisiblesIds.push(capa.id);
							estilsCapesIds.push(capa.estil ? capa.estil[capa.i_estil].id : "");
						}
					});
					if (capesVisiblesIds.length > 0)
						resultatCaractUsuari[chboxCapesName]["attribute"] = {name: "data-mm-layers", value: capesVisiblesIds.toString()};
					if (estilsCapesIds.length > 0)
						resultatCaractUsuari[chboxEstilsName]["attribute"] = {name: "data-mm-styles", value: estilsCapesIds.toString()};
				}
				
				if (resultatCaractUsuari[chboxTempsName]["status"])
				{
					let dataResultat = new Date(0); // Data inicial en milisegons, which is 1970-01-01T00:00:00.000Z .
					let indexCorregit = 0;
					let dataCapaAComparar;

					ParamCtrl.capa.forEach((capaActual) => {
						if (capaActual.visible=="si" && capaActual.data && capaActual.data.length)
						{
							indexCorregit = DonaIndexDataCapa(capaActual, capaActual.i_data);
							 dataCapaAComparar = DonaDateDesDeDataJSON(capaActual.data[indexCorregit]);
							if (dataResultat < dataCapaAComparar) {
								dataResultat = dataCapaAComparar;
							}			
						}
					});
 
					resultatCaractUsuari[chboxTempsName]["attribute"] = {name: "data-mm-time", value: JSON.stringify(DonaDataJSONDesDeDate(dataResultat))};
				}

				let divResultatCaract = document.createElement("div");
	
				Object.keys(resultatCaractUsuari).forEach((caracteristica) => {
					if(resultatCaractUsuari[caracteristica]["attribute"])
					{
						divResultatCaract.setAttribute(resultatCaractUsuari[caracteristica]["attribute"]["name"], resultatCaractUsuari[caracteristica]["attribute"]["value"]);
					}
				});
				const tinyEditor = tinymce.get(tinyTextId);
				const tinyParent = tinyEditor.selection.getNode();
				if (tinyParent && tinyParent.childNodes)
				{
					// Distingim quan la selecció s'ha fet sobre 1 sol node o sobre més d'un.
					if (tinyEditor.selection.getStart() == tinyEditor.selection.getEnd())
					{
						tinyParent.parentNode.insertBefore(divResultatCaract, tinyParent);
						divResultatCaract.appendChild(tinyParent);
					}
					else
					{
						const nodesEditor = Array.from(tinyParent.childNodes);
						const nodesToCharacterize = nodesEditor.slice(nodesEditor.indexOf(tinyEditor.selection.getStart()), nodesEditor.indexOf(tinyEditor.selection.getEnd())+1);
						tinyParent.insertBefore(divResultatCaract, tinyParent.childNodes[nodesEditor.indexOf(tinyEditor.selection.getStart())]);
						nodesToCharacterize.forEach((node) => divResultatCaract.appendChild(node));
					}
					// Afegim la imatge que indica que hem realitzat una sincronització amb el mapa.
					const paragrafImatge = document.createElement("p");
					const imatgeSincr = document.createElement("img");

					imatgeSincr.src = AfegeixAdrecaBaseSRC("storymap_action" + (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors ? ".svg" : ".gif"));
					imatgeSincr.setAttribute("style","width:22px; height:22px;")
					imatgeSincr.setAttribute("name",nomImgPuntSincr);
					paragrafImatge.appendChild(imatgeSincr);
					divResultatCaract.insertAdjacentElement("afterbegin", paragrafImatge);
				}
			}
		});

		function saveCheckStatus(checkbox)
		{
			resultatCaract[checkbox.name]["status"] = checkbox.checked;
		};

		const contenedorCheckbox = document.querySelector("dialog[id='"+ dialogCaractId + "']");
		const checkboxes = contenedorCheckbox.querySelectorAll("input[type='checkbox']");
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener("change", (event) => saveCheckStatus(event.target));
			resultatCaract[checkbox.name] = {status: false};
		});
		
		const confirmBtn = document.getElementById(confirmCaractBtnId);
		confirmBtn.addEventListener("click", (event) => {
			event.preventDefault();
			caractDialog.close(JSON.stringify(resultatCaract));
		});

		caractDialog.showModal();
	/*}
	else
	{
		let dialogAlerta = document.getElementById(dialogAlertaId);

		if (!dialogAlerta)
		{
			dialogAlerta = CreaDialegAlertaSeleccio();
			ultimElem.insertAdjacentElement("afterend", dialogAlerta);
		}

		dialogAlerta.showModal();
	}*/
}

function SeguentPasStoryMap(i_relat)
{	
	GuardarInformacioInicialStoryMap();
	
	const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
	novaStoryMapFinestra.replaceChildren();
	const endButtonId= "endUpButton";
	const htmlExternTiny = ["<div id='storyMapInterface'>", 
	"<input hidden id='", inputImageId, "' type='file' align='center' accept='.jpg,.jpeg,.png' onChange='CarregaImatgeStoryMap(this)'>",
	"<input id ='", endButtonId, "' class='buttonDialog' type='button' value='", GetMessage("End"), "' onClick='FinalitzarStoryMap(", i_relat != "nou",")'>"];
	novaStoryMapFinestra.innerHTML = htmlExternTiny.join("");

	// Creo aquest textarea fora de l'string "htmlExternTiny" per a que l'eina tinymce el detecti i el pugui substituir
	const tinytextarea = document.createElement("textarea");
	tinytextarea.setAttribute("id", tinyTextId)
	//tinytextarea.innerHTML = "hello <input data-attr-invent='styyle:\"elmeue\"'></input> world"
	const endBtn = document.getElementById(endButtonId);
	endBtn.parentNode.insertBefore(tinytextarea, endBtn);
	endBtn.parentNode.insertBefore(document.createElement("br"), endBtn);

	tinymce.init({
        target: tinytextarea,
		custom_undo_redo_levels: 15,
		plugins: 'code lists',
		toolbar: 'undo redo styles bold italic insertImageButton insertLocationZoom | alignleft aligncenter alignright alignjustify outdent indent bullist numlist code',
		promotion: false,
		min_height: 375,
		min_width: 740,
		language: idiomesTiny[ParamCtrl.idioma],
		setup: (editor) => {
			editor.ui.registry.addButton("insertImageButton", {
				text: GetMessage("AttachImage", "storymap"),
				icon: "image",
				tooltip: GetMessage("OpensImageFilesSelector", "storymap"),
				onAction: (_) => document.getElementById(inputImageId).click()
			});
			editor.ui.registry.addButton("insertLocationZoom", {
				text: GetMessage("SyncWithMap", "storymap"),
				icon: "embed", //checkmark
				tooltip: GetMessage("SavesMapCharacteristics", "storymap"),
				onAction: (_) => MostraDialogCaracteristiquesNavegador(endButtonId)
			});
		}
    }).then((initEditors) => {
		if (initEditors && initEditors.length > 0 && i_relat != "nou")
		{
			const relat = ParamCtrl.StoryMap[i_relat].html;
			const parser = new DOMParser();
			const DOMStorymap = parser.parseFromString(relat, "text/html");

			const title = DOMStorymap.querySelector("#" + h1TitleStorymap);
			if (title !== null)
			{
				title.remove();
			}
			const seiralizer = new XMLSerializer();
			(initEditors.find((editor) => editor.id == tinyTextId)).setContent( seiralizer.serializeToString(DOMStorymap), { format: 'html' });
		}	
	});
}

function FinalitzarStoryMap(estemEditant = false)
{
	const tinyEditor = tinymce.get(tinyTextId);
	const tinyEditorBody = tinyEditor.getBody();
	const imatgesSincro = tinyEditorBody.querySelectorAll("img[name='" + nomImgPuntSincr + "']");
	// Eliminem les imatges que indiquen cada punt del relat on s'ha sincronitzat el relat amb el mapa.
	imatgesSincro.forEach((imatge) => imatge.parentNode.removeChild(imatge));

	const cdns = "<html><h1 id='" + h1TitleStorymap + "'>"+ novaStoryMap.titol + "</h1><div>" + tinyEditor.getContent({format: "html"}) + "</div></html>";
	novaStoryMap.relat = cdns;
	novaStoryMap.identificador = estemEditant ? idRelatEditat : novaStoryMap.titol + "_" +  Date.now();
	GuardaEntradaStorymapConfig();
	TancaFinestraLayer("creaStoryMap");
}

function GuardaEntradaStorymapConfig()
{
	// Encara que ja hagués estat compartida, després d'editar un relat el marquem com a no compratit.
	const storyMapAGuardar = {compartida: false};
	if (novaStoryMap.identificador && novaStoryMap.identificador != "")
	{
		storyMapAGuardar.id = novaStoryMap.identificador;
		storyMapAGuardar.origen = relatUsuari;
		
		if (novaStoryMap.titol)
			storyMapAGuardar.desc = novaStoryMap.titol;
		if (novaStoryMap.imatgePortada)
			storyMapAGuardar.srcData = novaStoryMap.imatgePortada;
		if (novaStoryMap.relat)
			storyMapAGuardar.html = novaStoryMap.relat;

		// Guardem l'entrada de Storymap al config. Si ja hi és present la substituïm per la nova versió editada.
		const indexConegut = ParamCtrl.StoryMap.findIndex((relat) => relat.id == idRelatEditat);
		if (indexConegut != -1)
		{
			ParamCtrl.StoryMap.splice(indexConegut, 1, storyMapAGuardar);
		}
		else
		{
			ParamCtrl.StoryMap.push(storyMapAGuardar);
		}
	}
}

function GuardarInformacioInicialStoryMap()
{
	novaStoryMap.titol = document.getElementById(inputstoryTitolId).value;
	const imatgePortada = document.getElementById(imageThumbnailId);
	if (imatgePortada && imatgePortada.src != "")
		novaStoryMap.imatgePortada = imatgePortada.src;
}

// Inicia una Storymap
function IniciaStoryMap(i_story)
{
	const relatACarregar = ParamCtrl.StoryMap[i_story];
	if (relatACarregar.html && relatACarregar.html.length) 
	{
		// Relat creat en el propi navegador i que no té fitxer .html, està al config.json directament.
		CarregaStoryMap(relatACarregar.html, i_story);
	}
	else
	{
		loadFile(DonaCadena(relatACarregar.url), "text/html", CarregaStoryMap, null /*error*/, i_story);
		//Mode Pantalla Completa en iniciar la història:
		//openFullscreen(document.documentElement);
		//Desplaçar finestra a l'esquerra de la pantalla quan Mode Pantalla Completa: PENDENT
	}	
}


// Elimina les etiquetes <base> si les hi hagués.
function RemoveBaseHTMLTag(text_html)
{
var base;
	if (-1!=(base=text_html.indexOf("<base ")) || -1!=(base=text_html.indexOf("<Base ")) || -1!=(base=text_html.indexOf("<BASE ")))
	{
		var endbase=text_html.indexOf('>', base+6);
		if (-1!=endbase)
			return text_html.substring(0, base) + text_html.substring(endbase+1);
	}
	return text_html;
}

// Carrega Storymap tant si prové de un recurs extern o bé del config.json.
function CarregaStoryMap(text_html, i_story)
{
const relatACarregar = ParamCtrl.StoryMap[i_story];

	if (relatACarregar.desc)
		titolFinestraLayer(window, "storyMap", DonaCadena(relatACarregar.desc));

	if (typeof relatACarregar.MargeEsq!=="undefined" || typeof relatACarregar.MargeSup!=="undefined" ||
	    relatACarregar.Ample || relatACarregar.Alt)
	{
		var rect=getRectFinestraLayer(window, "storyMap");
		moveFinestraLayer(window, "storyMap", (typeof relatACarregar.MargeEsq!=="undefined" && relatACarregar.MargeEsq>=0) ? relatACarregar.MargeEsq : rect.esq,
				(typeof relatACarregar.MargeSup!=="undefined" && relatACarregar.MargeSup>=0) ? relatACarregar.MargeSup : rect.sup,
				(relatACarregar.Ample) ? relatACarregar.Ample : rect.ample,
				(relatACarregar.Alt) ? relatACarregar.Alt : rect.alt);
	}

	if (relatACarregar.origen && relatACarregar.origen == relatUsuari)
	{	
		// Afegim els botons d'edició dins de la finestra de visualització:
		const parser = new DOMParser();
		const DOMStorymap = parser.parseFromString(relatACarregar.html, "text/html");
		let divBotons = document.createElement("div");
		divBotons.setAttribute("class", "horizontalSpreadElements");
		divBotons.insertAdjacentHTML("afterbegin", ["<button class='center' onclick='TancaICreaEditaStoryMap(", i_story,")'><img src='editar_contingut.svg' alt='", GetMessage("Edit"), "' width='25'/> ", GetMessage("Edit"), "</button>"].join(""));

		if (relatACarregar.compartida !=null && !relatACarregar.compartida)
		{
			divBotons.insertAdjacentHTML("beforeend", ["<button name='upload' class='center' onclick='CompartirStorymap(", i_story ,")'><img src='pujada_nuvol.svg' alt='", GetMessage("Share"), "' width='25'/> ", GetMessage("Share"), "</button>"].join(""));
		}
		const title = DOMStorymap.querySelector("#"+ h1TitleStorymap);
		if (title !== null)
		{
			title.insertAdjacentElement("beforebegin", divBotons);
		}
		
		const seiralizer = new XMLSerializer();

		text_html = seiralizer.serializeToString(DOMStorymap);
	}
	
	contentFinestraLayer(window, "storyMap", RemoveBaseHTMLTag(text_html));

	ObreFinestra(window, "storyMap")
	indexStoryMapActiu=i_story;

	AfegeixMarkerStoryMapVisible();

	darrerNodeStoryMapVisibleExecutat=null;
	ExecutaAttributsStoryMapVisible();
}
// Reiniciar els valors que intervenen en la creació de l'StoryMap.
function TancaFinestra_creaStoryMap()
{
	const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
	tinymce.remove("textarea");
	novaStoryMapFinestra.replaceChildren();
	novaStoryMap = {};
	indexStoryMapActiu=null;
}

function isElemScrolledIntoViewDiv(el, div, partial)
{
	var rect_el = el.getBoundingClientRect();
	var rect_div=div.getBoundingClientRect();

	if (partial)
	{
		//Partially visible elements return true:
		//return rect_div.top < rect_el.bottom && rect_div.bottom > rect_el.top;
		return rect_div.top <= rect_el.top+rect_el.height*partial && rect_div.bottom >= rect_el.top;
	}
	//Only completely visible elements return true:
	//return (elemTop >= 0) && (elemBottom <= window.innerHeight);
	return rect_div.top <= rect_el.top && rect_div.bottom >= rect_el.bottom;
}

function AfegeixMarkerStoryMapVisible()
{
	var div=getFinestraLayer(window, "storyMap");
	AfegeixMarkerANodesFillsStoryMapVisible(div, div.childNodes, 0);
}

//Els tags "vendor specific" han de començar per "data-" https://www.w3schools.com/tags/att_data-.asp
function AfegeixMarkerANodesFillsStoryMapVisible(div, nodes, i_mm)
{
var node, attribute;

	for (var i = 0; i < nodes.length; i++)
	{
		node=nodes[i];
		if (node.nodeType!=Node.ELEMENT_NODE)
			continue;
		if (node.attributes)
		{
			if (node.dataset.mmCrs || node.dataset.mmCenter || node.dataset.mmZoom || node.dataset.mmLayers ||
			node.dataset.mmTime || node.dataset.mmSels || node.dataset.mmHistos)
			{
				//Afegir el simbol dins
				// Create a text node:
				var divNode = document.createElement("span");
				divNode.innerHTML=DonaTextImgGifSvg("id_storymap_mm_action_"+i_mm, "storymap_mm_action_"+i_mm, "storymap_action", 14, GetMessage("ActionOnMap", "storymap"), null);
				i_mm++;
				node.insertBefore(divNode, node.children[0]);
			}
		}
		if (node.childNodes && node.childNodes.length)
		{
			if (AfegeixMarkerANodesFillsStoryMapVisible(div, node.childNodes, i_mm))
				return true;
		}
	}
	return false;
}

var darrerNodeStoryMapVisibleExecutat=null;

function RecorreNodesFillsAttributsStoryMapVisible(div, nodes)
{
var hihacanvis, node, attribute;

	for (var i = 0; i < nodes.length; i++)
	{
		node=nodes[i];
		if (node.nodeType!=Node.ELEMENT_NODE)
			continue;
		if (!isElemScrolledIntoViewDiv(node, div, 0.85))
			continue;
		hihacanvis=false;

		if (node.attributes)
		{
			if (darrerNodeStoryMapVisibleExecutat==node)
				return false;

			if (node.dataset.mmCrs)   //NEcessito aplicar aquest abans que tots els altres.
			{
				if (node.dataset.mmCrs.trim().length)
				{
					if (0==CommandMMNSetCRS(node.dataset.mmCrs.trim()))
						hihacanvis=true;
				}
			}
			
			if (node.dataset.mmCenter)
			{
				var mmcenter = node.dataset.mmCenter.trim();
				if (mmcenter.length)
				{
					var punt;
					try {
						punt=JSON.parse(mmcenter);
					}
					catch (e) {
						alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name + ". " + e + ". " +
									GetMessage("ParameterValueFoundIs", "storymap") + ": "  + mmcenter);
						break;
					}
					if (0==CommandMMNSetCenterCoord(punt))
						hihacanvis=true;
				}
				else
					alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name);
			}
			
			if (node.dataset.mmZoom)
			{
				if (node.dataset.mmZoom.trim().length)
				{
					if (0==CommandMMNSetZoom(parseFloat(node.dataset.mmZoom.trim())))
						hihacanvis=true;
				}
			}

			if (node.dataset.mmLayers)
			{
				CommandMMNSetLayersAndStyles(node.dataset.mmLayers.trim(), 
						(node.dataset.mmStyles) ? node.dataset.mmStyles.trim() : null, 
						"data-mm-layers");
				hihacanvis=true;
			}

			if (node.dataset.mmTime)
			{
				var datejson;
				var mmtime = node.dataset.mmTime.trim();
				if (mmtime.length)
				{
					try
					{
						datejson=JSON.parse(mmtime);
					}
					catch (e)
					{
						alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name + ". " + e + ". "+
									GetMessage("ParameterValueFoundIs", "storymap") + ": " + mmtime);
						break;
					}
					if (0==CommandMMNSetDateTime(datejson))
						hihacanvis=true;
				}
			}

			if (node.dataset.mmSels)
			{
				var mmsels = "["+node.dataset.mmSels.trim().replaceAll('¨', '\'')+"]";
				if (mmsels.length>3)
				{
					var sels;
					try {
						sels=JSON.parse(mmsels);
					}
					catch (e) {
						alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name + ". " + e + ". " +
									GetMessage("ParameterValueFoundIs", "storymap") + ": "  + mmsels);
						break;
					}
					if (0==CommandMMNSelections(sels))
						hihacanvis=true;
				}
				else
					alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name);
			}

			if (node.dataset.mmHistos)
			{
				var mmhistos = "["+node.dataset.mmHistos.trim()+"]";
				if (mmhistos.length>3)
				{
					var histos;
					try {
						histos=JSON.parse(mmhistos);
					}
					catch (e) {
						alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name + ". " + e + ". " +
									GetMessage("ParameterValueFoundIs", "storymap") + ": "  + mmhisto);
						break;
					}
					if (0==CommandMMNHistograms(histos))
						hihacanvis=true;
				}
				else
					alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name);
			}
			if (hihacanvis)
			{
				darrerNodeStoryMapVisibleExecutat=node;
				if (!histos)
					TancaTotsElsHistogramaFinestra();
				RepintaMapesIVistes();
				return true;
			}
		}
		if (node.childNodes && node.childNodes.length)
		{
			if (RecorreNodesFillsAttributsStoryMapVisible(div, node.childNodes))
				return true;
		}
	}
	return false;
}

var timerExecutaAttributsStoryMapVisible=null;

function ExecutaAttributsStoryMapVisibleEvent(event)
{
	if (timerExecutaAttributsStoryMapVisible)
		clearTimeout(timerExecutaAttributsStoryMapVisible);
	timerExecutaAttributsStoryMapVisible=setTimeout(ExecutaAttributsStoryMapVisible,500);
}

function ExecutaAttributsStoryMapVisible()
{
	var div=getFinestraLayer(window, "storyMap")
	RecorreNodesFillsAttributsStoryMapVisible(div, div.childNodes);
	timerExecutaAttributsStoryMapVisible=null;
}

// Puja al Nimmbus un relat de mapes.
function CompartirStorymap(i_story)
{
	const relatACompartir = ParamCtrl.StoryMap[i_story];
	const urlServidor = new URL(ParamCtrl.ServidorLocal);
	const relatFragDoc = new DocumentFragment();
	
	relatFragDoc.prepend(relatACompartir.html);
	
	if (relatACompartir.srcData) 
	{
		// Modifiquem l'html del relat per incloure la imatge de portada dins del propi relat i així poder-la recuperar en un futur.
		const imgPortada = document.createElement("img");
		imgPortada.setAttribute("src", relatACompartir.srcData);
		imgPortada.setAttribute("id", imageThumbnailId);
		relatFragDoc.prepend(imgPortada.outerHTML);
	}
	
	GUFCreateFeedbackWithReproducibleUsage([{title: relatACompartir.desc, code: urlServidor.host, codespace: ParamCtrl.ServidorLocal}],
			{abstract: relatACompartir.desc, specific_usage: GetMessage("ShareStorymap", "storymap"),
			ru_code: relatFragDoc.textContent, ru_code_media_type: "text/html",
			ru_platform: ToolsMMN, ru_version: VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers, ru_schema: config_schema_storymap
			}, ParamCtrl.idioma, "");
}
