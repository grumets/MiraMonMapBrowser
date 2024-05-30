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
const tinyTextStoryMapId = "storyTextArea";
// Crea inici Storymap identificadors.
const inputStoryTitolId = "inputTitolRelat";
const inputThumbnailId = "inputThumbnail";
const h1TitleStorymap = "titleStorymap";
const imageThumbnailId = "imageThumbnail";
// Límit de mida per imatges. Establerta en píxels.
const midaImatgeMiniaturaMaximaPx = 150;
const midaImatgeMaximaPx = 500;
const numMaximPixelsStorymap = Math.pow(midaImatgeMaximaPx, 2);
// Identificador input imatges internes del Storymap.
const inputImageStorymapId = "imagePicker";
// Identificadors diàlegs
const dialegCaractId = "caractDialeg", dialegMidesId = "midesDialeg", dialegAlertaTitolId = "dialegAlertaTitol";
// Dialeg Mida Imatges identificadors
const labelWidthId = "labelWidth", inputWidthId = "widthMesure", labelHeightId = "labelHeight", inputHeightId = "heightMesure", confirmImageBtnId = "confirmImageBtn", chboxProportionalId = "chboxProportional", selectSizeUnitId = "selectSizeUnit";
// Dialeg Característiques checkbox identificadors i noms
const chBoxTempsId = "chboxDate", chboxTempsName = "date", chBoxCapesStyleId = "chboxLayerStyle", chboxCapesStyleName = "layerStyle",  chBoxPosZoomId = "chboxPosZoom", chboxPosZoomName = "positionZoom", confirmCaractBtnId = "confirmCaractBtn", chboxCapesName = "layers", chboxEstilsName = "styles", chboxZoomName = "zoom", chboxCoordName = "coordinates";
const pixelUnit = "px", percentageUnit = "%";
const limitsMidesImatge = {};
var resultatMidesImatge = {};
var resultatCaract = {[chboxCapesName]: {}, [chboxEstilsName]: {}, [chboxZoomName]: {}, [chboxCoordName]: {}, [chboxTempsName]:{}};
const nomPuntSincr = "sincrPoint";
// Tots els idiomes suportats pel navegador amb les seves correspondències amb els idiomes de Tiny Editor.
const idiomesTiny = {cat: 'ca', spa: 'es', eng: 'en', cze: 'cs', ger: 'de', fre: 'fr_FR'};
let arrayAlcadesScrollIAccions = [];
const identificadorDivAccioMapa = "AccioMapa_";
var contadorAccionsMapa = 0;
const indentificadorSelectorControls = "controls";
const controlScroll = "scroll", controlManual = "manual";
const divRelatId = "divRelat";
const idImgSvgAccioMapa = "id_storymap_mm_action_";
const ancoraRelat = "ancoraRelat"; 
IncludeScript("tinymce/js/tinymce/tinymce.min.js");

// Especificitat de la funció creaFinestraLayer per a l'Storymap.
function createStorymapFinestraLayer(win, name, titol, botons, left, top, width, height, ancora, param, content)   //param --> scroll, visible, ev, bg_trans, resizable
{
	const min_width_finestra_storymap = 335, min_height_finestra_storymap = 400;
	createFinestraLayer(window, name, titol, botons, left, top, width, height, ancora, param, content);

	let currentStyle;
	const barraStorymap = getLayer(win, name+SufixBarra);
	currentStyle = barraStorymap.getAttribute("style");
	barraStorymap.setAttribute("style", currentStyle + ` min-width: ${min_width_finestra_storymap}px; min-height: ${min_height_finestra_storymap}px;`);

	const finestraStorymap = getLayer(win, name+SufixFinestra);
	currentStyle = finestraStorymap.getAttribute("style");
	finestraStorymap.setAttribute("style", currentStyle + ` min-width: ${min_width_finestra_storymap}px; min-height: ${min_height_finestra_storymap}px;`);
	
	let i_finestra;

	for (i_finestra=0; i_finestra<layerFinestraList.length; i_finestra++)
	{
		if (layerFinestraList[i_finestra].nom==name)
		{
			layerFinestraList[i_finestra].min_size_finestra = {w: min_width_finestra_storymap, h: min_height_finestra_storymap};
			break;
		}
	}
}

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
	contadorAccionsMapa = 0;
}

//Omple la finestra amb el llistat d'històries (i mostra la imatge de pre-visualització de la història).
function OmpleFinestraTriaStoryMap(win, name)
{
var cdns=[], i_story=0, ncol=2, nstory=0, i_real_story=[], newStory={"desc": GetMessageJSON("NewStorymap", "storymap"), "src": "nova_storymap.svg", "url": "", "isNew": true};

	if (!ParamCtrl.StoryMap || ParamCtrl.StoryMap.length == 0)
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
	cdns.push("<br><button style='position:relative; right:-25px;' onclick='DemanaStorymapsNimmbus(\"", name, "\")'>",
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

	function comprovaTitol(event)
	{	
		const finestra = event.target.parentNode;
		const inputTitolRelat = document.getElementById(inputStoryTitolId);
		if (inputTitolRelat && inputTitolRelat.value && inputTitolRelat.value != "")
			SeguentPasStoryMap(i_relat);
		else
		{
			const dialegNodeList = finestra.querySelectorAll("dialog[id='"+ dialegAlertaTitolId + "']");
			if (dialegNodeList && dialegNodeList.length != 0)
				dialegNodeList[0].show();
			else
			{
				const caractDialog = CreaDialegAlertaTitol();
				finestra.insertAdjacentElement("beforeend", caractDialog);
				caractDialog.show();
			}
		}
	};	

	if (isFinestraLayer(window, "creaStoryMap"))
	{
		const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
		novaStoryMapFinestra.replaceChildren();
		const beginingStoryMapContent = ["<br><br><label for='title'>", GetMessage('Title') + ":", "</label><input type='text' id='", inputStoryTitolId, "' name='title' minlength='1' size='25' value='", (i_relat != "nou" ? storyToEdit.desc : ""), "'/><br><br>",
						"<label>", GetMessage('StorymapThumbnailImage', 'storymap') + "(JPEG ",GetMessage("or")," PNG): ", "</label>",
						"<button class=\"Verdana11px\" onclick=\"document.getElementById('",inputThumbnailId,"').click()\">"+GetMessage("SelectImage", "storymap")+"</button>",
						"<input id='", inputThumbnailId, "' type='file' align='center' accept='.jpg,.jpeg,.png' style='display:none' onChange='CarregaImatgeStoryMap(this, \"imageThumbnail\", )'/><br><br>",												
						"<img id='", imageThumbnailId, "' alt='", GetMessage("StorymapThumbnailImage", "storymap"), "' title='", GetMessage("StorymapThumbnailImage", "storymap"), "' style='visibility:", (i_relat != "nou" && storyToEdit.srcData ? "visible" : "hidden"),";' ", (i_relat != "nou" && storyToEdit.srcData ? "src='" + storyToEdit.srcData + "'" : ""),"/><br>"];
		const inputBtnNext = document.createElement("input");
		inputBtnNext.setAttribute("type", "button");
		inputBtnNext.setAttribute("class", "buttonDialog");
		inputBtnNext.setAttribute("value", GetMessage("Next"));						
		inputBtnNext.addEventListener("click", comprovaTitol);
						
		novaStoryMapFinestra.insertAdjacentHTML("afterbegin", beginingStoryMapContent.join(""));
		novaStoryMapFinestra.insertAdjacentElement("beforeend", inputBtnNext);
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

	if (fitxerObjectiu &&  (fitxerObjectiu.type == "image/png" || fitxerObjectiu.type == "image/jpg" || fitxerObjectiu.type == "image/jpeg"))
	{
		if (input.id == inputImageStorymapId)
		{
			CarregaImatgeRelatStoryMap(fitxerObjectiu);
		}
		else if (input.id == inputThumbnailStoryMapId)
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
 * Crea un diàleg per avisar a l'usuari la falta d'un títol per al relat.
 * @returns 
 */
function CreaDialegAlertaTitol()
{
	const dialogHtml = ["<form><p>" + GetMessage("TitleStoryMandatory", "storymap") + ":</p><p style= 'text-align: center;'><button class='buttonDialog' value='cancel' formmethod='dialog'>", GetMessage("OK"), "</button></p></form>"];

	const dialog = CreaDialog(dialegAlertaTitolId, dialogHtml.join(""));

	return dialog;
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
	const dialogHtml = ["<form><p>", textMides, "</p><div align-items='stretch'><p style='align: center'><label id='" + labelWidthId + "' for='", inputWidthId, "'>"+ GetMessage("ReducedWidth", "storymap") + " (" + percentageUnit +"):</label><input type='text'  id='", inputWidthId, "' title='Only digits'><label id='" + labelHeightId + "' for='", inputHeightId, "'>"+ GetMessage("ReducedHeight", "storymap") + " (" + percentageUnit + "):</label><input type='text' title='Only digits' id='", inputHeightId, "' ></p><p><label for='" + selectSizeUnitId + "'>" + GetMessage("ChooseUnitMeasurement", "storymap") + ":</label><select id='" + selectSizeUnitId + "'><option value='" + pixelUnit + "'>" + pixelUnit + "</option><option value='" + percentageUnit + "' selected>" + percentageUnit + "</option></select><label for='", chboxProportionalId, "'>" + GetMessage("MaintainProportionality", "storymap") + "</label><input type='checkbox' id='", chboxProportionalId, "' checked></p><p style='align: center'><button id='", confirmImageBtnId, "' class='button_image_dialog buttonDialog' formmethod='dialog' value='default'>" + GetMessage("OK") + "</button><button class='button_image_dialog buttonDialog' value='cancel' formmethod='dialog'>" + GetMessage("Cancel") + "</button></p></div></form>"];

	return CreaDialog(dialegMidesId, dialogHtml.join(""));
}
/**
 * Crea un diàleg per a elegir quines característiques del mapa mantindre per un determinat fragment del relat.
 * @returns 
 */
function CreaDialegSincronitzarAmbMapa()
{
	const dialogHtml = ["<form><p>" + GetMessage("SelectMapFeatures", "storymap") + "</p><div class='horizontalSpreadElements'><p><input type='checkbox' id='", chBoxPosZoomId, "' name='", chboxPosZoomName,"' checked><label for='", chBoxPosZoomId, "'>" + GetMessage("Position&Zoom", "storymap") + "</label></p><p><input type='checkbox' id='", chBoxCapesStyleId, "' name='", chboxCapesStyleName,"' checked><label for='", chBoxCapesStyleId, "'>" + GetMessage("Layers&Styles", "storymap") + "</label></p><p><input type='checkbox' id='", chBoxTempsId, "' name='", chboxTempsName,"' checked><label for='", chBoxTempsId, "'>" + GetMessage("Date") + "</label></p></div><div class= 'horizontalSpreadElements'><button id='", confirmCaractBtnId, "' formmethod='dialog' value='default'>" + GetMessage("OK") + "</button><button value='cancel' formmethod='dialog'>" + GetMessage("Cancel") + "</button></div></form>"];

	return CreaDialog(dialegCaractId, dialogHtml.join(""));
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
	let anchorElement = document.getElementById(inputImageStorymapId);
	
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
				const tinyEditor = tinymce.get(tinyTextStoryMapId);
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
					return resultatMidesImatge.width*resultatMidesImatge.height <= numMaximPixelsStorymap;
				}
				else
				{
					return (resultatMidesImatge.width*imatgeSeleccionada.width/100) * (resultatMidesImatge.height*imatgeSeleccionada.height/100) <= numMaximPixelsStorymap;

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
			const labelWidth = document.getElementById(labelWidthId);
			const labelHeight = document.getElementById(labelHeightId);
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

// Imatge o svg per a indicar el punt exacte on es produeix la sincronització del relat amb el mapa. 
let imgSvgSincroMapa;

function MostraDialogCaracteristiquesNavegador(ultimElemId)
{
	const ultimElem = document.getElementById(ultimElemId);

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
			
			let hiHaCheckboxSeleccionat = false;

			if(resultatCaractUsuari[chboxPosZoomName]["status"])
			{
				resultatCaractUsuari[chboxCoordName]["attribute"] = {name: "data-mm-center", value: JSON.stringify(DonaCentreVista())};
				resultatCaractUsuari[chboxZoomName]["attribute"] = {name: "data-mm-zoom", value: ParamInternCtrl.vista.CostatZoomActual};
				hiHaCheckboxSeleccionat = true;
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
				{
					resultatCaractUsuari[chboxCapesName]["attribute"] = {name: "data-mm-layers", value: capesVisiblesIds.toString()};
				}
				if (estilsCapesIds.length > 0)
				{
					resultatCaractUsuari[chboxEstilsName]["attribute"] = {name: "data-mm-styles", value: estilsCapesIds.toString()};
				}
				hiHaCheckboxSeleccionat = true;
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
						if (dataResultat < dataCapaAComparar) 
						{
							dataResultat = dataCapaAComparar;
						}			
					}
				});

				resultatCaractUsuari[chboxTempsName]["attribute"] = {name: "data-mm-time", value: JSON.stringify(DonaDataJSONDesDeDate(dataResultat))};
				hiHaCheckboxSeleccionat = true;
			}

			if (hiHaCheckboxSeleccionat) 
			{
				let divResultatCaract = document.createElement("div");

				Object.keys(resultatCaractUsuari).forEach((caracteristica) => {
					if(resultatCaractUsuari[caracteristica]["attribute"])
					{
						divResultatCaract.setAttribute(resultatCaractUsuari[caracteristica]["attribute"]["name"], resultatCaractUsuari[caracteristica]["attribute"]["value"]);
					}
				});
				const tinyEditor = tinymce.get(tinyTextStoryMapId);
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
					const tinyEditorBody = tinyEditor.getBody();
					const imatgesSincro = tinyEditorBody.querySelectorAll("img[name='" + nomPuntSincr + "']");
					CreaImatgeMarcadorSincronismeMapa(divResultatCaract, imatgesSincro.length);
				}
			
			}
		}
	});

	function saveCheckStatus(checkbox)
	{
		resultatCaract[checkbox.name]["status"] = checkbox.checked;
	};

	const contenedorCheckbox = document.querySelector("dialog[id='"+ dialegCaractId + "']");
	const checkboxes = contenedorCheckbox.querySelectorAll("input[type='checkbox']");
	checkboxes.forEach(checkbox => {
		checkbox.addEventListener("change", (event) => saveCheckStatus(event.target));
		resultatCaract[checkbox.name] = {status: true};
	});
	
	const confirmBtn = document.getElementById(confirmCaractBtnId);
	confirmBtn.addEventListener("click", (event) => {
		event.preventDefault();
		caractDialog.close(JSON.stringify(resultatCaract));
	});

	caractDialog.showModal();
}

function SeguentPasStoryMap(i_relat)
{	
	GuardarInformacioInicialStoryMap();
	
	const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
	novaStoryMapFinestra.replaceChildren();
	const endButtonId= "endUpButton";
	const htmlExternTiny = ["<div id='storyMapInterface'>", 
	"<input hidden id='", inputImageStorymapId, "' type='file' align='center' accept='.jpg,.jpeg,.png' onChange='CarregaImatgeStoryMap(this)'>",
	"<input id ='", endButtonId, "' class='buttonDialog' type='button' value='", GetMessage("End"), "' onClick='FinalitzarStoryMap(", i_relat != "nou",")'>"];
	novaStoryMapFinestra.innerHTML = htmlExternTiny.join("");

	// Creo aquest textarea fora de l'string "htmlExternTiny" per a que l'eina tinymce el detecti i el pugui substituir
	const tinytextarea = document.createElement("textarea");
	tinytextarea.setAttribute("id", tinyTextStoryMapId)
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
				onAction: (_) => document.getElementById(inputImageStorymapId).click()
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
			(initEditors.find((editor) => editor.id == tinyTextStoryMapId)).setContent( seiralizer.serializeToString(DOMStorymap), { format: 'html' });
		}	
	});
}

function FinalitzarStoryMap(estemEditant = false)
{
	const tinyEditor = tinymce.get(tinyTextStoryMapId);
	const tinyEditorBody = tinyEditor.getBody();
	const imatgesSincro = tinyEditorBody.querySelectorAll("img[name='" + nomPuntSincr + "']");
	// Eliminem les imatges que indiquen cada punt del relat on s'ha sincronitzat el relat amb el mapa.
	imatgesSincro.forEach((imatge) => imatge.parentNode.removeChild(imatge));
	// Identifiquem cada <div> amb atributs d'acció al mapa.
	const arrayImgsAccions = tinyEditorBody.querySelectorAll("div[data-mm-center],div[data-mm-zoom],div[data-mm-layers],div[data-mm-styles],div[data-mm-time],div[data-mm-sels],div[data-mm-diags],div[data-mm-extradims],div[data-mm-crs]");
	arrayImgsAccions.forEach((divElement) => { 
		divElement.setAttribute("id", identificadorDivAccioMapa+contadorAccionsMapa);
		contadorAccionsMapa++;
	});
	contadorAccionsMapa = 0;

	const cdns = "<html>" + ((novaStoryMap.titol && novaStoryMap.titol != "") ? ("<h1 id='" + h1TitleStorymap + "'>"+ novaStoryMap.titol + "</h1>") : "") + "<div>" + tinyEditor.getContent({format: "html"}) + "</div></html>";
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
		storyMapAGuardar.origen = OrigenUsuari;
		
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
	novaStoryMap.titol = document.getElementById(inputStoryTitolId).value;
	
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

	contadorAccionsMapa= 0;
	const finestraRelat = getFinestraLayer(window, "storyMap");
	const childNodesFinestraRelat = finestraRelat.childNodes;
	
	// Eliminem els nodes anidats a la finestra de lectura de relats així evitar tenir elements repretits de l'anterior visualitsació 
	while (childNodesFinestraRelat.firstChild) {
		childNodesFinestraRelat.removeChild(childNodesFinestraRelat.firstChild);
	}
	  
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

	if (relatACarregar.origen && relatACarregar.origen == OrigenUsuari)
	{		
		// Crear el marc per al relat de mapes. 
		let divRelat = document.createElement("div");
		divRelat.setAttribute("id", divRelatId);
		divRelat.setAttribute("style", "overflow-x: hidden; overflow-y: auto; padding: 0 3%; height: 92%;");
		divRelat.addEventListener("scroll", ExecutaAttributsStoryMapVisibleEvent);
		divRelat.insertAdjacentHTML("afterbegin", relatACarregar.html);
		
		/* 
		*	Tot canvi que hi hagi entre les nodesfills del relat volem estar-ne al corrent 
		*	i així saber quan podem calcular les alçades correctes dels <div> amb acció al mapa.
		*/
		const mutationObserver = new MutationObserver(function(changes, observer) {
			const imgBlanc = document.querySelector("img[name='"+ imgEspaiBlancNom +"']");
			const imgAccio = document.querySelectorAll("img[id^=" + idImgSvgAccioMapa);
			if(changes[0].target.contains(imgBlanc) && imgAccio && changes[0].target.contains(imgAccio[0]))
			{
				// Quan la imatge en blanc ja està inclosa en el DOM fem el càlcul de les alçades.
				ExtreuAlcadesIAccionsDivisions(changes[0].target.innerHTML);
				observer.disconnect();
			}
		});

		mutationObserver.observe(divRelat, {childList: true, subtree: true, attributes: false, characterData: false});

		// Text explicatiu controls
		let definicio = document.createElement("label");
		definicio.innerHTML = GetMessage("ActionOnMap", "storymap") + ":";
		definicio.className = "control";
		// Botons següent i previ
		let previBoto = document.createElement("input");
		previBoto.setAttribute("type", "button");
		previBoto.className = "button_image_dialog";
		previBoto.classList.add("center");
		previBoto.classList.add("control");
		previBoto.setAttribute("name", "controlAccio");
		previBoto.setAttribute("value", GetMessage("Previous"));
		previBoto.addEventListener("click", function () {
			contadorAccionsMapa--;
			if (contadorAccionsMapa >= 0)
			{
				const infoAccio = arrayAlcadesScrollIAccions[contadorAccionsMapa];
				let ancoraNavegacio= document.querySelector("a[name='" + ancoraRelat + "']")
				if (ancoraNavegacio)
				{
					ancoraNavegacio.setAttribute("href", "#" + infoAccio.identificadorImg);
					ancoraNavegacio.click();
				}
				else 
				{
					ancoraNavegacio = document.createElement("a");
					ancoraNavegacio.setAttribute("href", "#" + infoAccio.identificadorImg);
					ancoraNavegacio.click();
				}
			}
			if (contadorAccionsMapa < 0)
				contadorAccionsMapa = 0;
		});

		let seguentBoto = document.createElement("input");
		seguentBoto.setAttribute("type", "button");
		seguentBoto.className = "button_image_dialog";
		seguentBoto.classList.add("center");
		seguentBoto.classList.add("control");
		seguentBoto.setAttribute("name", "controlAccio");
		seguentBoto.setAttribute("value", GetMessage("Next"));
		seguentBoto.addEventListener("click", function () {
			contadorAccionsMapa++;
			if (contadorAccionsMapa < arrayAlcadesScrollIAccions.length)
			{
				const infoAccio = arrayAlcadesScrollIAccions[contadorAccionsMapa];
				let ancoraNavegacio= document.querySelector("a[name='" + ancoraRelat + "']")
				if (ancoraNavegacio)
				{
					ancoraNavegacio.setAttribute("href", "#" + infoAccio.identificadorImg);
					ancoraNavegacio.click();
				}
				else 
				{
					ancoraNavegacio = document.createElement("a");
					ancoraNavegacio.setAttribute("href", "#" + infoAccio.identificadorImg);
					ancoraNavegacio.click();
				}
			}
			if (contadorAccionsMapa == arrayAlcadesScrollIAccions.length)
				contadorAccionsMapa--;
		});

		let divDivisio = document.createElement("div");
		divDivisio.setAttribute("class", "control");
		
		let divBotonsAccio = document.createElement("div");
		divBotonsAccio.setAttribute("class", "horizontalSpreadElements");
		divBotonsAccio.setAttribute("style", "height: 100%;");
		divBotonsAccio.appendChild(divDivisio);
		divBotonsAccio.appendChild(definicio);
		divBotonsAccio.appendChild(previBoto);
		divBotonsAccio.appendChild(seguentBoto);

		// Afegim els botons d'edició dins de la finestra de visualització:
		let divBotons = document.createElement("div");
		divBotons.setAttribute("class", "horizontalSpreadElements");
		divBotons.setAttribute("style", "height: 8%; position: relative; top: 0 px; left: 0 px");
		divBotons.insertAdjacentHTML("afterbegin", ["<button class='center' onclick='TancaICreaEditaStoryMap(", i_story,")'>", GetMessage("Edit"), "</button>"].join(""));

		if (relatACarregar.compartida !=null && !relatACarregar.compartida)
		{
			divBotons.insertAdjacentHTML("beforeend", ["<button name='upload' class='center' onclick='CompartirStorymap(", i_story ,")'>", GetMessage("Share"), "</button>"].join(""));
		}
		
		divBotons.appendChild(divBotonsAccio);

		finestraRelat.insertAdjacentElement("afterbegin", divRelat);
		finestraRelat.insertAdjacentElement("afterbegin", divBotons);
		
		// Línia horitzontal separadora amb inici del relat.
		let liniaHoritzontal = document.createElement("hr");
		liniaHoritzontal.className = "separadorHoritzonal";
		divBotons.insertAdjacentElement("afterend", liniaHoritzontal);
	}
	
	ObreFinestra(window, "storyMap");
	
	AfegeixEspaiTransparent();
	AfegeixMarkerStoryMapVisible();

	indexStoryMapActiu=i_story;
	darrerNodeStoryMapVisibleExecutat=null;
	ExecutaAttributsStoryMapVisible();
}

function ExtreuAlcadesIAccionsDivisions(textHtml)
{
	// Netegem l'array d'antics càlculs
	arrayAlcadesScrollIAccions = [];

	const domFromText = new DOMParser().parseFromString(textHtml, "text/html");
	const arrayDivAccions = domFromText.body.querySelectorAll("div[data-mm-center],div[data-mm-zoom],div[data-mm-layers],div[data-mm-styles],div[data-mm-time],div[data-mm-sels],div[data-mm-diags],div[data-mm-extradims],div[data-mm-crs]");
	
	if (arrayDivAccions.length > 0)
	{
		let divAccio, imgAccio;
		let contadorAccionsTransformades= 0;
		for(contadorAccionsTransformades=0; contadorAccionsTransformades < arrayDivAccions.length; contadorAccionsTransformades++)
		{	
			let datasetTransformat=[];
			divAccio = document.getElementById(identificadorDivAccioMapa+contadorAccionsTransformades);
			const atributsPropis = divAccio.dataset;
			for (var key in atributsPropis)
			{	
				const prefix = "data-mm-";
				let transformacioClau = prefix + String.fromCharCode(key.charCodeAt(2)+32) + key.substring(3);
				datasetTransformat.push(transformacioClau);
				datasetTransformat.push(atributsPropis[key]);
			}
			imgAccio = divAccio.querySelector("img[id^='" + idImgSvgAccioMapa + "']");
			arrayAlcadesScrollIAccions.push({"identificadorImg": imgAccio.id, "datasetTransformat": datasetTransformat});
		}
	}	
}

/* 	Afegeix una imatge transparent al final del relat per tal que
	l'última línia de text pugui arribar fins dalt de tot de la finestra.
*/
var imgEspaiBlancNom = "imgEspaiBlanc"
function AfegeixEspaiTransparent()
{
	const imgTransparent = document.createElement("img");
	let storyWindow = getFinestraLayer(window, "storyMap");
	imgTransparent.setAttribute("name", imgEspaiBlancNom);
	imgTransparent.src = "1tran.gif";
	const boundingRectWindow = storyWindow.getBoundingClientRect();
	imgTransparent.width = boundingRectWindow.width;
	imgTransparent.height = boundingRectWindow.height - boundingRectWindow.height * 0.1;

	const divRelat = document.getElementById(divRelatId);
	if (divRelat) {
		
		divRelat.insertAdjacentElement("beforeend", imgTransparent);
	
		const cantoRedimensionaStoryMap = getLayer(window, "storyMap" + SufixCanto);
		if (cantoRedimensionaStoryMap) {
			const imgRedimensiona = cantoRedimensionaStoryMap.querySelector("img[name=" + nomImgRedimensiona + "]");
			if (imgRedimensiona.onmousedown.length == 1)
			{
				/*
				* Elimino l'event de redimensió per posteriorment afegir-lo de nou mitjaçant la funció "addEventListener()" 
				* i així poder enllaçar 2 funcions diferents al mateix event.
				*/
				imgRedimensiona.removeEventListener("mousedown", ActivaMovimentFinestraLayer);
	
				// Trobar índex de la finestra
				let i_finestra
				for (i_finestra=0; i_finestra<layerFinestraList.length; i_finestra++)
				{
					if (layerFinestraList[i_finestra].nom=="storyMap")
					{
						console.log("createFinestraLayer is creating a finestra with the same finestra name twice. Old one is overwritten.");
						break;
					}
				}
				imgRedimensiona.addEventListener("mousedown", function(event){
					ActivaMovimentFinestraLayer(event, i_finestra, movimentRedimensionant);
				});
	
				imgRedimensiona.addEventListener("mousedown", ActualitzaEspaiTransparent);
			}
		}
	}
}
// Actualitza la mida de la imatge transparent quan es redimensioni la finestra del relat.
function ActualitzaEspaiTransparent()
{
	let storyWindow = getFinestraLayer(window, "storyMap");
	const imgTransparent = storyWindow.querySelector("img[name=" + imgEspaiBlancNom + "]");
	if (imgTransparent)
	{
		const boundingRectWindow = storyWindow.getBoundingClientRect();
		imgTransparent.width = boundingRectWindow.width;
		imgTransparent.height = boundingRectWindow.height - boundingRectWindow.height * 0.1;
	}
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

		// DPS: return rect_div.top <= rect_el.top+rect_el.height*partial && rect_div.bottom >= rect_el.top;
		const elem_Y = rect_el.top + rect_el.height*partial;
		return rect_div.top <= elem_Y && rect_div.bottom >= rect_el.top;
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

const imgRelatAccio = "storymap_mm_action";
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
			/*Es podria fer directament amb (node.dataset.mmCrs || node.dataset.mmCenter || node.dataset.mmZoom || node.dataset.mmLayers ||
			node.dataset.mmTime || node.dataset.mmSels || node.dataset.mmHistos) però trobo que no aporta res i ofusca el codi vers el que realment hi ha a l'htm*/
			for (var i_at = 0; i_at < node.attributes.length; i_at++)
			{
				attribute=node.attributes[i_at];
				if (attribute.name=='data-mm-crs' || attribute.name=="data-mm-center" || attribute.name=='data-mm-zoom' || attribute.name=='data-mm-layers' ||
					attribute.name=="data-mm-time" || attribute.name=='data-mm-sels' || attribute.name=='data-mm-diags' || attribute.name=='data-mm-diags' || 
					attribute.name=='data-mm-extradims')
				{
					//Afegir el simbol dins
					// Create a text node:
					var divNode = document.createElement("span");
					divNode.innerHTML=DonaTextImgGifSvg(idImgSvgAccioMapa + i_mm, imgRelatAccio, "storymap_action", 14, GetMessage("ActionOnMap", "storymap"), null);
					i_mm++;
					node.insertBefore(divNode, node.children[0]);
					break;
				}
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

/*Arguments variables. Com a parametres te una llista de 'data-mm-????' i els seu valor, 'data-mm-????' i els seu valor, ...
Es fa servir per posar botons i altres controls que executen accions en resposta d'accions de l'usuari.*/
function ExecuteDataMMAttributes()
{
var attributes=[];

	for (var i_arg = 0; i_arg < arguments.length; i_arg+=2)
	{
		if (i_arg+1 == arguments.length)
			break;
		attributes.push({name: arguments[i_arg], value:arguments[i_arg+1]}); 
	}
	if (ExecuteDataMMAttributesArray(attributes))
		RepintaMapesIVistes();
}

function ExecuteDataMMAttributesArray(attributes)
{
var hihacanvis, attribute;
const htmlStory = ParamCtrl.StoryMap[indexStoryMapActiu];
	
	hihacanvis=false;

	for (var i_at = 0; i_at < attributes.length; i_at++)
	{
		attribute=attributes[i_at];
		if (attribute.name=='data-mm-crs')   //Necessito aplicar aquest abans que tots els altres.
		{
			if (attribute.value.trim().length)
			{
				if (0==CommandMMNSetCRS(attribute.value.trim()))
					hihacanvis=true;
			}
		}
	}
	for (var i_at = 0; i_at < attributes.length; i_at++)
	{
		attribute=attributes[i_at];
		if (attribute.name=="data-mm-center")
		{
			var mmcenter = attribute.value.trim();
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
		else if (attribute.name=='data-mm-zoom')
		{
			if (attribute.value.trim().length)
			{
				if (0==CommandMMNSetZoom(parseFloat(attribute.value.trim())))
					hihacanvis=true;
			}
		}
		else if (attribute.name=="data-mm-layers")
		{
			for (var i_styles = 0; i_styles < attributes.length; i_styles++)
			{
				if (attributes[i_styles].name=="data-mm-styles")
					break;
			}
			if (0==CommandMMNSetLayersAndStyles(attribute.value.trim(), 
					(i_styles == attributes.length) ? null : attributes[i_styles].value.trim(), 
					"data-mm-layers"))
				hihacanvis=true;
		}
		else if (attribute.name=="data-mm-time")
		{
			var datejson;
			var mmtime = attribute.value.trim();
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
		else if (attribute.name=='data-mm-sels')
		{
			var mmsels = "["+attribute.value.trim().replaceAll('¨', '\'')+"]";
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
		else if (attribute.name=='data-mm-diags')
		{
			var mmdiags = "["+attribute.value.trim()+"]";
			if (mmdiags.length>3)
			{
				var diags;
				try {
					diags=JSON.parse(mmdiags);
				}
				catch (e) {
					alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name + ". " + e + ". " +
								GetMessage("ParameterValueFoundIs", "storymap") + ": "  + mmhisto);
					break;
				}
				if (0==CommandMMNDiagrams(diags))
					hihacanvis=true;
			}
			else
				alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name);
		}
		else if (attribute.name=="data-mm-extradims")
		{
			var mmlayerdims = "["+attribute.value.trim()+"]";
			if (mmlayerdims.length>3)
			{
				var layerdims;
				try {
					layerdims=JSON.parse(mmlayerdims);
				}
				catch (e) {
					alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name + ". " + e + ". " +
								GetMessage("ParameterValueFoundIs", "storymap") + ": "  + mmlayerdims);
					break;
				}
				if (0==CommandMMNSetLayersExtraDimensions(layerdims))
					hihacanvis=true;
			}
			else
				alert(GetMessage("WrongFormatParameter")+ ": " + attribute.name);
		}
	}

	if (!diags)
		TancaTotsElsHistogramaFinestra();
	return hihacanvis;
}


var darrerNodeStoryMapVisibleExecutat=null;

function RecorreNodesFillsAttributsStoryMapVisible(div, nodes)
{
var node;

	for (var i = 0; i < nodes.length; i++)
	{
		node=nodes[i];
		if (node.nodeType!=Node.ELEMENT_NODE)
			continue;
		if (!isElemScrolledIntoViewDiv(node, div, 0.85))
			continue;
		if (node.attributes)
		{
			if (darrerNodeStoryMapVisibleExecutat==node)
				return false;

			if (ExecuteDataMMAttributesArray(node.attributes))
			{
				darrerNodeStoryMapVisibleExecutat=node;
				/* 	
				*	Actualitzem l'índex de l'última acció de mapa executada per tal que 
				*	els botons "next" i "previous" en cas d'utilitzar-se executin l'acció correcta.
				*/
				if (node.getAttribute("id"))
				{
					const nodeId = node.getAttribute("id");
					contadorAccionsMapa = parseInt(nodeId.slice(nodeId.indexOf("_")+1));
				}
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

// TODO: Utilitzar aquesta funció per tal de crear botó del Tiny on crei botons per executar attributs de mm-data...	
function ExecutaAttributsStoryMapVisibleEvent(event)
{
	if (event !== undefined && timerExecutaAttributsStoryMapVisible)
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

var imgSvgIconaSincroMapa;

function CreaImatgeMarcadorSincronismeMapa(divRef, indexImatge)
{
	if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
	{
		var cdns=[];
		cdns.push("<img align=\"absmiddle\" src=\"", AfegeixAdrecaBaseSRC("storymap_action.gif"), "\" ",
			"id=\"", nomPuntSincr, indexImatge, "\" name=\"", nomPuntSincr, "\" ",
			"width=\"", (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.ncol) ? ParamCtrl.BarraEstil.ncol : 23, "\" ",
			"height=\"", (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.nfil) ? ParamCtrl.BarraEstil.nfil : 22, "\" ", "alt=\"", GetMessage("SyncWithMap", "storymap"), "\" title=\"", GetMessage("SyncWithMap", "storymap"), "\" >");
		divRef.insertAdjacentHTML("afterbegin", cdns.join(""));
	}
	else
	{
		if (imgSvgIconaSincroMapa)
		{
			const svgClone = imgSvgIconaSincroMapa.cloneNode(true);
			svgClone.setAttribute('id', nomPuntSincr + indexImatge);
			divRef.insertAdjacentElement("afterbegin", svgClone);
		}
		else
		{
			fetch("storymap_action.svg").then(function(response) {
				return response.text();
			}).then(function(text){
				var xmlDoc = new DOMParser().parseFromString(text, "text/xml");
				var svg = xmlDoc.getElementsByTagName('svg')[0];
				if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.nfil)
					svg.setAttribute('height', ParamCtrl.BarraEstil.nfil);
				else 
					svg.setAttribute('height', '22');
				
				if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.ncol)
					svg.setAttribute('width', ParamCtrl.BarraEstil.ncol);
				else
					svg.setAttribute('width', '23');
				
				ChangeTitleColorsSVGElement(svg, {title: GetMessage('SyncWithMap', 'storymap'), colors: ParamCtrl.BarraEstil.colors});
				/* 	Com que el Tiny editor considera que els svg poden ser un problema de següertat 
					(https://www.tiny.cloud/docs/tinymce/latest/image/#basic-setup), no accepta elements del tipus <svg>.
					En lloc seu es crea aquest <img> que conté la imatge llegida en <svg>.
				*/
				const imgDeSvg = document.createElement("img");
				imgDeSvg.setAttribute("src", "data:image/svg+xml;UTF8," + encodeURI(svg.outerHTML));
				imgDeSvg.setAttribute('id', nomPuntSincr + indexImatge);
				imgDeSvg.setAttribute('name', nomPuntSincr);
				imgSvgIconaSincroMapa = imgDeSvg;
				divRef.insertAdjacentElement("afterbegin", imgDeSvg);
			}).catch(function(event){
				console.log("Error loading "+event.target.src);
				return;
			});
		}
	}
}

// Aplicar colors per a la imatge SVG.
function ChangeTitleColorsSVGElement(svg, params)
{
	if (params && svg)
	{
		if (params.title)
		{
			if (!svg.getElementsByTagName("title") || !svg.getElementsByTagName("title").length)
			{
				var newNode = document.createElementNS("http://www.w3.org/2000/svg", "title");
				svg.insertBefore(newNode, svg.firstChild);
			}
			svg.getElementsByTagName("title")[0].textContent=params.title;
		}
		if (params.width)
			svg.setAttribute('width', params.width);
		if (params.height)
			svg.setAttribute('height', params.height);
		if (params.colors)
		{
			for(var c in params.colors)
			{
				if (svg.getElementsByClassName(c))
				{
					for (var i=0; i<svg.getElementsByClassName(c).length; i++)
						svg.getElementsByClassName(c)[i].style.fill=params.colors[c];
				}
			}
		}
	}
}