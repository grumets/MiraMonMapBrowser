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
    amb l'ajut de Alba Brobia (a brobia at creaf uab cat)
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
// Límit de mida per imatges. Establerta en píxels.
const midaImatgeMaximaPx = 500;
const numMaximPixels = Math.pow(midaImatgeMaximaPx, 2);
// Extensions imatges permeses.
const pngMIMETType = "image/png", jpgMIMEType = "image/jpg", jpegMIMEType = "image/jpeg";
// Identificadors diàlegs
const dialogCaractId = "caractDialog", dialogMidesId = "midesDialog";
// Dialeg Mida Imatges identificadors
const lableWidthId = "labelWidth", inputWidthId = "widthMesure", lableHeightId = "labelHeight", inputHeightId = "heightMesure", confirmImageBtnId = "confirmImageBtn", chboxProportionalId = "chboxProportional", selectSizeUnitId = "selectSizeUnit";
// Dialeg Característiques checkbox identificadors i noms
const chBoxTempsId = "chboxTime", chboxTempsName = "time", chBoxCapesId = "chboxCapes", chboxCapesName = "layers", chBoxZoomId = "chboxZoom", chboxZoomName = "zoom", chBoxCoordId = "chboxCoord", chboxCoordName = "coordinates", confirmCaractBtnId = "confirmCaractBtn";
const pixelUnit = "px", percentageUnit = "%";
const limitsMidesImatge = {};
var resultatMidesImatge = {};
var resultatCaract = {};

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

//Omple la finestra amb el llistat d'històries (i mostra la imatge(s) de pre-visualització de la història).
function OmpleFinestraTriaStoryMap(win, name)
{
var cdns=[], i_story=0, ncol=2, nstory=0, i_real_story=[], newStory={"desc": "Crear nova HistoryMap", "src": "propies/StoryMaps/afegir.svg", "url": "", "isNew": true};

	if (ParamCtrl.StoryMap == null)
	{
		ParamCtrl.StoryMap = [];
		ParamCtrl.StoryMap.push(newStory);
	}
	else if (ParamCtrl.StoryMap[ParamCtrl.StoryMap.length-1].isNew != true)
	{
		//if (ParamCtrl.StoryMap.find(story => story.isNew == true))
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

	while (nstory < ParamCtrl.StoryMap.length)
	{
		if (ParamCtrl.StoryMap[nstory].EnvTotal && !EsEnvDinsAmbitActual(ParamCtrl.StoryMap[nstory].EnvTotal))
			continue;
		i_real_story[nstory]=nstory;  //This transforms filtered story index into unfiltered index.
		nstory++;
	}
	cdns.push("<br>",
				GetMessage("SelectStory", "storymap"), ":" ,
				"<br><table class=\"Verdana11px\">");

	// Omplim totes les histories
	while (i_story<nstory)
	{
		const storyActual = ParamCtrl.StoryMap[i_real_story[i_story]];
		if ((i_story%ncol)==0)
			cdns.push("<tr>");
		cdns.push("<td valign=\"top\"><a href=\"javascript:void(0)\" onclick=\"");
		(storyActual.isNew) ? cdns.push("TancaICreaStoryMap();\">") : cdns.push("TancaIIniciaStoryMap(", i_real_story[i_story], ");\">");
		cdns.push("<img align='middle' src='",(storyActual.src) ? storyActual.src : AfegeixAdrecaBaseSRC("1griscla.gif"),"' height='100' width='150' border='0'>",
			"<br>",
			DonaCadena(storyActual.desc),
			"</a><br></td>");
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

function TancaIIniciaStoryMap(i_story)
{
	//Tancar la caixa de les histories
	TancaFinestraLayer("triaStoryMap");
	IniciaStoryMap(i_story);
}

// Deficinció de la nova StoryMap
var novaStoryMap = {};

function TancaICreaStoryMap()
{
	const lastStoryStepElement = "lastStoryStepElement";
	const storyStepImage = "storyMainImage";
	//Tancar la finestra de la graella de les histories
	TancaFinestraLayer("triaStoryMap");

	if (isFinestraLayer(window, "creaStoryMap"))
	{
		const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
		novaStoryMapFinestra.replaceChildren();
		const beginingStoryMapContent = ["<label for='title'>", GetMessage('Title') + ":", "</label><input type='text' id='title' name='title' minlength='1' size='25'><br><br><img id='", storyStepImage, "' alt='", GetMessage("StorymapImage", "storymap"), "' /><br><input type='file' align='center' accept='.jpg,.jpeg,.png' onChange='CarregaImatgeStoryMap(this, \"storyMainImage\", )'><br><br><input type='button' id='", lastStoryStepElement, "' value='", GetMessage("Next"), "' onClick='SeguentPasStoryMap()'>"];
		novaStoryMapFinestra.innerHTML = beginingStoryMapContent.join("");
	}
	ObreFinestra(window, "creaStoryMap");
}
/**
 * Seqüència sincrona de operacións per a la selecció de la imatge pertinent, modificació de les mides d'aquesta i càrrega de <img> dins del HTML del Tiny.    
 * @param {*} input Element DOM tipus input que incorpora la imatge. 
 * @param {*} ultimElemId Identificador de l'últim element de la vista Storymap.
 */
function CarregaImatgeStoryMap(input, ultimElemId) 
{
	const fitxerObjectiu = input.files ? input.files[0] : null;

	if (fitxerObjectiu &&  (fitxerObjectiu.type == pngMIMETType || fitxerObjectiu.type == jpgMIMEType || fitxerObjectiu.type == jpegMIMEType))
	{
		const midesPromise = new Promise((resolve, reject) => {

			//Mirem la mida de la imatge
			const urlIamge = URL.createObjectURL(fitxerObjectiu);
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

			MostraDialogImatgeNavegador(result, ultimElemId);

		});
	}
}
/**
 * Crea un diàleg que apareix flotant al centre de la pantalla per a que l'usuari decideixi
 * sobre la mida de la imatge que vol incorporar al Storymap. 
 * @param {*} imatge El fitxer imatge que es vol incloure a la Storymap.
 * @returns Cadena HTML amb les mides de la imatge que es preten carregar i 2 caixes de text per indicar-ne les noves mides.
 */
function CreaDialogMidesImatge(imatge)
{
	const textMides = "Mides actuals de la imatge: <b>" + imatge.width + "px amplada</b>, <b>" + imatge.height + "px alçada</b>." 
	const dialogHtml = ["<form><p>", textMides, "</p><div align-items='stretch'><p style='align: center'><label id='" + lableWidthId + "' for='", inputWidthId, "'>Amplada reduida (" + percentageUnit +"):</label><input type='text'  id='", inputWidthId, "' pattern='[+-]?([0-9]*[.])?[0-9]+' title='Only digits'><label id='" + lableHeightId + "' for='", inputHeightId, "'>Alçada reduida (" + percentageUnit + "):</label><input type='text' pattern='[+-]?([0-9]*[.])?[0-9]+' title='Only digits' id='", inputHeightId, "' ></p><p><label for='" + selectSizeUnitId + "'>Elegeix la unitat de mesura:</label><select id='" + selectSizeUnitId + "'><option value='" + pixelUnit + "'>" + pixelUnit + "</option><option value='" + percentageUnit + "' selected>" + percentageUnit + "</option></select><label for='", chboxProportionalId, "'>Mantindre proporcionalitat</label><input type='checkbox' id='", chboxProportionalId, "' checked></p><p style='align: center'><button class='button_image_dialog' value='cancel' formmethod='dialog'>Cancel</button><button id='", confirmImageBtnId, "' class='button_image_dialog' formmethod='dialog' value='default'>Confirm</button></p></div></form>"];

	return CreaDialog(dialogMidesId, dialogHtml.join(""));
}

function CreaDialogCaracteristiquesNavagador()
{
	const textMides = "Selecciona les característiques del mapa i les capes a preservar per a aquest punt de l'Storymap:" 
	const dialogHtml = ["<form><p>Selecciona les característiques del mapa i les capes a preservar per a aquest punt de l'Storymap:</p><div class='horizontalSpreadElements'><p><input type='checkbox' id='", chBoxCoordId, "' name='", chboxCoordName,"'><label for='", chBoxCoordId, "'>Coordenades</label></p><p><input type='checkbox' id='", chBoxZoomId, "' name='", chboxZoomName,"'><label for='", chBoxZoomId, "'>Zoom</label></p><p><input type='checkbox' id='", chBoxCapesId, "' name='", chboxCapesName,"'><label for='", chBoxCapesId, "'>Capes</label></p><p><input type='checkbox' id='", chBoxTempsId, "' name='", chboxTempsName,"' checked><label for='", chBoxTempsId, "'>Temps</label></p></div><div class= 'horizontalSpreadElements'><button id='", confirmCaractBtnId, "' formmethod='dialog' value='default'>Confirm</button><button value='cancel' formmethod='dialog'>Cancel</button></div></form>"];

	return CreaDialog(dialogCaractId, dialogHtml.join(""));
}

function CreaDialog(identificadorDialog, contingutHtml)
{
	const dialog = document.createElement("dialog");
	dialog.setAttribute("id", identificadorDialog);
	dialog.insertAdjacentHTML("afterbegin", contingutHtml);
	return dialog;
}

function MostraDialogImatgeNavegador(imatgeSeleccionada, ultimElemId)
{
	const esImatgeApaisada = imatgeSeleccionada.width >= imatgeSeleccionada.height;
	function calcularLimitImatges(imatgeSeleccionada)
	{
		let proporcio = 0;
		if (esImatgeApaisada)
		{
			proporcio = imatgeSeleccionada.width/imatgeSeleccionada.height;
			limitsMidesImatge.width = {};
			limitsMidesImatge["width"][percentageUnit] = midaImatgeMaximaPx * 100 / imatgeSeleccionada.width;
			limitsMidesImatge["width"][pixelUnit] = imatgeSeleccionada.width * limitsMidesImatge["width"][percentageUnit] / 100;
			limitsMidesImatge.height = {};
			limitsMidesImatge["height"][percentageUnit] = limitsMidesImatge["width"][percentageUnit] / proporcio;
			limitsMidesImatge["height"][pixelUnit] = imatgeSeleccionada.height * limitsMidesImatge["height"][percentageUnit] / 100;
		}
		else 
		{
			proporcio = imatgeSeleccionada.height/imatgeSeleccionada.width;
			limitsMidesImatge.height = {};
			limitsMidesImatge["height"][percentageUnit] = midaImatgeMaximaPx * 100 / imatgeSeleccionada.height;
			limitsMidesImatge["height"][pixelUnit] = imatgeSeleccionada.height * limitsMidesImatge["height"][percentageUnit] / 100;
			limitsMidesImatge.width = {};
			limitsMidesImatge["width"][percentageUnit] = limitsMidesImatge["height"][percentageUnit] / proporcio;
			limitsMidesImatge["width"][pixelUnit] = imatgeSeleccionada.width * limitsMidesImatge["width"][percentageUnit] / 100;
		}	
	}

	calcularLimitImatges(imatgeSeleccionada);

	const divMidesImg = document.createElement("div");
	divMidesImg.setAttribute("id", "midesImgDiv");
	let ultimElem = document.getElementById(ultimElemId);
	
	if (ultimElem)
	{
		ultimElem.insertAdjacentElement("afterend", divMidesImg);
		divMidesImg.insertAdjacentElement("afterbegin", CreaDialogMidesImatge(imatgeSeleccionada));
		const midesDialog = document.getElementById(dialogMidesId);
		midesDialog.addEventListener("close", (event) => {
			// Després de tancar el missatge emergent de les mides.
			let resultatMides = JSON.parse(event.target.returnValue);
			resultatMides = adaptImageGivenOneDimension(resultatMides, imatgeSeleccionada);
			if (resultatMides) {
				let ultimElem = document.getElementById(ultimElemId);
				const canvasId = "reduccioImatges";
				let canvasReduccioImg = document.getElementById(canvasId);
				if (!canvasReduccioImg)
				{
					canvasReduccioImg = document.createElement("canvas");
					canvasReduccioImg.setAttribute("id", canvasId);
					
					if (ultimElem)
					{
						canvasReduccioImg.insertAdjacentElement("afterend", ultimElem);
					}
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
					tinyEditor.setContent(writenOnTiny + "<br><br><img src='" + imatgeReduida + "' width=" + resultatMides.width + ">");
				}
			}
			resultatMidesImatge = {};
		});
		const inputWidth = document.getElementById(inputWidthId);
		inputWidth.value = limitsMidesImatge["width"][percentageUnit];
		resultatMidesImatge.width = limitsMidesImatge["width"][percentageUnit];
		inputWidth.addEventListener("change", (event) => {
			resultatMidesImatge.width = parseFloat(event.target.value);
			confirmBtn.disabled = checkForEmptyValues(inputWidth, inputHeight);
		});
		const inputHeight = document.getElementById(inputHeightId);
		inputHeight.value = limitsMidesImatge["height"][percentageUnit];
		resultatMidesImatge.height = limitsMidesImatge["height"][percentageUnit];
		inputHeight.addEventListener("change", (event) => {
			resultatMidesImatge.height = parseFloat(event.target.value);
			confirmBtn.disabled = checkForEmptyValues(inputWidth, inputHeight);
		});
		const chboxProportional = document.getElementById(chboxProportionalId);
		chboxProportional.addEventListener("change", (event) => {
			event.target.checked;
			confirmBtn.disabled = checkForEmptyValues(inputWidth, inputHeight);
		});
		const selector = document.getElementById(selectSizeUnitId);
		selector.addEventListener("change", (event) => {
			updateLabelUnits(event.target.value);
		});
		const confirmBtn = document.getElementById(confirmImageBtnId);
		confirmBtn.addEventListener("click", (event) => {
			event.preventDefault();
			if (checkImageLimits())
			{
				midesDialog.close(JSON.stringify(resultatMidesImatge)); // S'envia les mides introduïdes al diàleg.	
			}
			else 
			{
				alert("La mida de imatge desitjada supera el límit establert. Redueixi-la.");
			}
		});

		const checkForEmptyValues = new Function("inputWidth", "inputHeight", "return (!inputWidth.value && !inputHeight.value)");

		function checkImageLimits()
		{
			const unitatSeleccionada = selector.value == percentageUnit ? percentageUnit : pixelUnit;
			if (chboxProportional.checked)
			{
				if (esImatgeApaisada)
				{
					return resultatMidesImatge.width <= limitsMidesImatge["width"][unitatSeleccionada];
				}
				else 
				{
					return resultatMidesImatge.height <= limitsMidesImatge["height"][unitatSeleccionada];
				}
			}
			else
			{
				if (unitatSeleccionada == pixelUnit)
				{
					return resultatMidesImatge.width*resultatMidesImatge.height <= numMaximPixels;
				}
				else
				{
					return (resultatMidesImatge.width*imatgeSeleccionada.width/100) * (resultatMidesImatge.height*imatgeSeleccionada.height/100) <= numMaximPixels;

				}
				//return resultatMidesImatge.width <= limitsMidesImatge["width"][unitatSeleccionada] && resultatMidesImatge.height <= limitsMidesImatge["height"][unitatSeleccionada];
			}
		}

		function adaptImageGivenOneDimension(midesAdaptImatge, imatgeOriginal) {
			if(midesAdaptImatge) {
				const midesKeys = Object.keys(midesAdaptImatge);
				const numKeys = midesKeys.length;
				if(numKeys==2) 
				{
					return midesAdaptImatge;
				} 
				else if(numKeys == 1)
				{
					if(imatgeOriginal.width >= imatgeOriginal.height)
					{
						const proporcio = imatgeOriginal.width/imatgeOriginal.height;
						if(midesKeys[0]=="width")
						{
							return {width: midesAdaptImatge.width, height: midesAdaptImatge.width / proporcio};
						}
						else
						{
							return {width: midesAdaptImatge.height * proporcio, height: midesAdaptImatge.height};
						}
					} 
					else 
					{
						const proporcio = imatgeOriginal.height/imatgeOriginal.width;
						if(midesKeys[0]=="width")
						{
							return {width: midesAdaptImatge.width, height: midesAdaptImatge.width * proporcio};
						}
						else
						{
							return {width: midesAdaptImatge.height / proporcio, height: midesAdaptImatge.height};
						}
					}
				} 
				else  
				{
					return;
				}
			}
			return;
		};

		function updateSizeInputValues(widthField, heightField) 
		{
			inputWidth.value = widthField;
			inputHeight.value = heightField;
		}

		function updateLabelUnits(nextUnit)
		{
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
		}

		updateSizeInputValues(limitsMidesImatge.width[percentageUnit], limitsMidesImatge.height[percentageUnit])

		midesDialog.showModal();
	}
}

function MostraDialogCaracteristiquesNavegador(ultimElemId)
{
	const divCaract = document.createElement("div");
	divCaract.setAttribute("id", "caractDiv");
	let ultimElem = document.getElementById(ultimElemId);
	
	if (ultimElem)
	{
		ultimElem.insertAdjacentElement("afterend", divCaract);
		divCaract.insertAdjacentElement("afterbegin", CreaDialogCaracteristiquesNavagador());
		const caractDialog = document.getElementById(dialogCaractId);

		caractDialog.addEventListener("close", (event) => {
			let resultatCaractUsuari = JSON.parse(event.target.returnValue);

			if(resultatCaractUsuari[chboxZoomName]["status"])
			{
				resultatCaractUsuari[chboxZoomName]["attribute"] = {name: "data-mm-zoom", value: ParamInternCtrl.vista.CostatZoomActual};
			}

			if(resultatCaractUsuari[chboxCoordName]["status"])
			{
				const coordCentre = ObtenirCentre();
				const puntCentral = {x: coordCentre.x, y: coordCentre.y};
				resultatCaractUsuari[chboxCoordName]["attribute"] = {name: "data-mm-center", value: JSON.stringify(puntCentral)};
			}

			if(resultatCaractUsuari[chboxCapesName]["status"])
			{
				let capesVisiblesIds = [];
				ParamCtrl.capa.filter(capa => { 
					if (capa.visible=="si")
						capesVisiblesIds.push(capa.id);
				});
				if (capesVisiblesIds.length > 0)
					resultatCaractUsuari[chboxCapesName]["attribute"] = {name: "data-mm-layers", value: capesVisiblesIds.toString()};
			}

			let imatgeResultatCaract = document.createElement("img");
			imatgeResultatCaract.setAttribute("src", "location.png");

			Object.keys(resultatCaractUsuari).forEach((caracteristica) => {
				if(resultatCaractUsuari[caracteristica]["attribute"])
				{
					imatgeResultatCaract.setAttribute(resultatCaractUsuari[caracteristica]["attribute"]["name"], resultatCaractUsuari[caracteristica]["attribute"]["value"]);
				}
			});
			const tinyEditor = tinymce.get(tinyTextId);
			//tinyEditor.insertContent(imatgeResultatCaract);
			let writenOnTiny = tinyEditor.getContent();
			tinyEditor.setContent(writenOnTiny + imatgeResultatCaract.outerHTML);
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
			caractDialog.close(JSON.stringify(resultatCaract)); // S'envia les mides introduïdes al diàleg.
		});

		caractDialog.showModal();
	}
}

function SeguentPasStoryMap()
{	
	GuardarInformacioInicialStoryMap();
	
	const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
	novaStoryMapFinestra.replaceChildren();
	const inputImageId = "imagePicker";
	const endButtonId= "endUpButton";
	const htmlNextStep = ["<div id='storyMapInterface'>", 
	"<input hidden id='" + inputImageId + "' type='file' align='center' accept='.jpg,.jpeg,.png' onChange='CarregaImatgeStoryMap(this, \"" + endButtonId + "\")'>",
	"<input id='", endButtonId,"' type='button' value='", GetMessage("End"), "' onClick='FinalitzarStoryMap()'>"];
	novaStoryMapFinestra.innerHTML = htmlNextStep.join("");

	// Creo aquest textarea fora de l'string "htmlNextStep" per a que l'eina tinymce el detecti i el pugui substituir
	const tinytextarea = document.createElement("textarea");
	tinytextarea.setAttribute("id", tinyTextId)
	const endBtn = document.getElementById(endButtonId);
	endBtn.parentNode.insertBefore(tinytextarea, endBtn);
	endBtn.parentNode.insertBefore(document.createElement("br"), endBtn);

	tinymce.init({
        target: tinytextarea,
		toolbar: 'undo redo styles bold italic insertImageButton insertLocationZoom | alignleft aligncenter alignright alignjustify bullist numlist outdent indent',
		promotion: false,
		min_height: 375,
		min_width: 700,
		setup: (editor) => {
			editor.ui.registry.addButton('insertImageButton', {
				text: 'Attach image',
				icon: "image",
				tooltip: 'Opens image selector files',
				onAction: (_) => document.getElementById(inputImageId).click()
			});
			editor.ui.registry.addButton('insertLocationZoom', {
				text: 'Record place',
				icon: 'ordered-list',
				tooltip: 'Insert current longitude, latitude and zoom',
				onAction: (_) => MostraDialogCaracteristiquesNavegador(endButtonId)
			});
		}
    });
}

function FinalitzarStoryMap()
{
	// Guardo la descripció definida en la StoryMap.
	GuardarDescripcioStoryMapTinymce();

	const cdns = ["<html><h1>"+novaStoryMap.titol+"</h1><br>", "<div>", novaStoryMap.descripcio, "</div>","</html>"];
	GuardaDadesFitxerExtern(cdns.join(""), novaStoryMap.titol.replace(/\s+/g, '_'), ".html");
	GuardaEntradaStorymapConfig();
	TancaFinestraLayer("creaStoryMap");
}

function GuardaEntradaStorymapConfig()
{
	const storyMapAGuardar = {};
	if (novaStoryMap.titol)
		storyMapAGuardar.desc = novaStoryMap.titol;
	if (novaStoryMap.imatgePrincipal)
		storyMapAGuardar.src = novaStoryMap.imatgePrincipal;
	// Modifiquem el titol per a substituïr els espais en blanc per guions baixos. Així no suposaran un problema per a la ruta del fitxer .html. La Regex "/\s+/g" implica substituïr tots els espais en blanc, tabulacions i altres en tot el text.	
	storyMapAGuardar.url = "propies/StoryMaps/" + novaStoryMap.titol.replace(/\s+/g, '_');
	// Guardem la nova entrada de Storymap al config.
	ParamCtrl.StoryMap.push(storyMapAGuardar);
}

function GuardarInformacioInicialStoryMap()
{
	novaStoryMap.titol = document.getElementById("title").value;
	const imatgePortada = document.getElementById("storyMainImage");
	if (imatgePortada && imatgePortada.src != "")
		novaStoryMap.imatgePrincipal = imatgePortada.src;
}

function GuardarDescripcioStoryMapTinymce()
{
	novaStoryMap.descripcio = tinymce.get("storyTextArea").getContent();
}

//Inicia una Storymap
function IniciaStoryMap(i_story)
{
	loadFile(DonaCadena(ParamCtrl.StoryMap[i_story].url), "text/html", CreaStoryMap, null /*error*/, i_story);
	//Mode Pantalla Completa en iniciar la història:
	//openFullscreen(document.documentElement);
	//Desplaçar finestra a l'esquerra de la pantalla quan Mode Pantalla Completa: PENDENT
}


//removes the <base> tag if it exists.
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

//Crea Storymap
function CreaStoryMap(text_html, extra_param)
{
var i_story=extra_param, elem;

	if (ParamCtrl.StoryMap[i_story].desc)
		titolFinestraLayer(window, "storyMap", DonaCadena(ParamCtrl.StoryMap[i_story].desc));

	if (typeof ParamCtrl.StoryMap[i_story].MargeEsq!=="undefined" || typeof ParamCtrl.StoryMap[i_story].MargeSup!=="undefined" ||
	    ParamCtrl.StoryMap[i_story].Ample || ParamCtrl.StoryMap[i_story].Alt)
	{
		var rect=getRectFinestraLayer(window, "storyMap");
		moveFinestraLayer(window, "storyMap", (typeof ParamCtrl.StoryMap[i_story].MargeEsq!=="undefined" && ParamCtrl.StoryMap[i_story].MargeEsq>=0) ? ParamCtrl.StoryMap[i_story].MargeEsq : rect.esq,
				(typeof ParamCtrl.StoryMap[i_story].MargeSup!=="undefined" && ParamCtrl.StoryMap[i_story].MargeSup>=0) ? ParamCtrl.StoryMap[i_story].MargeSup : rect.sup,
				(ParamCtrl.StoryMap[i_story].Ample) ? ParamCtrl.StoryMap[i_story].Ample : rect.ample,
				(ParamCtrl.StoryMap[i_story].Alt) ? ParamCtrl.StoryMap[i_story].Alt : rect.alt);
	}

	contentFinestraLayer(window, "storyMap", RemoveBaseHTMLTag(text_html));

	ObreFinestra(window, "storyMap")
	indexStoryMapActiu=i_story;

	AfegeixMarkerStoryMapVisible();

	darrerNodeStoryMapVisibleExecutat=null;
	ExecutaAttributsStoryMapVisible();
}
// Reiniciar els valors que intervenen en la creació de l'StoryMap.
function TancaFinestra_storyMap()
{
	const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
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
			for (var i_at = 0; i_at < node.attributes.length; i_at++)
			{
				attribute=node.attributes[i_at];
				if (attribute.name=='data-mm-crs' || attribute.name=="data-mm-center" || attribute.name=='data-mm-zoom' || attribute.name=="data-mm-layers" ||
					attribute.name=="data-mm-time" || attribute.name=='data-mm-sels' || attribute.name=='data-mm-histos')
				{
					//Afegir el simbol dins
					// Create a text node:
					var divNode = document.createElement("span");
					divNode.innerHTML=DonaTextImgGifSvg("id_storymap_mm_action_"+i_mm, "storymap_mm_action_"+i_mm, "storymap_action", 14, GetMessage("ActionOnMap", "storymap"), null);
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

var darrerNodeStoryMapVisibleExecutat=null;

function RecorreNodesFillsAttributsStoryMapVisible(div, nodes)
{
var hihacanvis, node, attribute;

	//var div=getFinestraLayer(window, "storyMap");

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

			for (var i_at = 0; i_at < node.attributes.length; i_at++)
			{
				attribute=node.attributes[i_at];
				if (attribute.name=='data-mm-crs')   //NEcessito aplicar aquest abans que tots els altres.
				{
					if (attribute.value.trim().length)
					{
						if (0==CommandMMNSetCRS(attribute.value.trim()))
							hihacanvis=true;
					}
				}
			}
			for (var i_at = 0; i_at < node.attributes.length; i_at++)
			{
				attribute=node.attributes[i_at];
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
					for (var i_styles = 0; i_styles < node.attributes.length; i_styles++)
					{
						if (node.attributes[i_styles].name=="data-mm-styles")
							break;
					}
					CommandMMNSetLayersAndStyles(attribute.value.trim(),
							(i_styles == node.attributes.length) ? null : node.attributes[i_styles].value.trim(),
							"data-mm-layers");
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
						if (0==CommandMMNSetChangeDateTime(datejson))
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
				else if (attribute.name=='data-mm-histos')
				{
					var mmhistos = "["+attribute.value.trim()+"]";
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
