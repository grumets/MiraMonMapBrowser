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
const botoBorraThumbnailId = "borraThumbnail";
// Límit de mida per imatges. Establerta en píxels.
const midaImatgeMiniaturaMaximaPx = 150;
const midaImatgeMaximaPx = 500;
const numMaximPixelsStorymap = Math.pow(midaImatgeMaximaPx, 2);
// Identificador input imatges internes del Storymap.
const inputImageStorymapId = "imagePicker";
// Identificadors diàlegs
const dialegCaractId = "caractDialeg", dialegMidesId = "midesDialeg", dialegAlertaTitolId = "alertaTitol", dialegAlertaInsercioId = "alertaInsercioDialeg", dialegAlertaRedaccioEnCursId = "alertaRedaccioEnCurs";
// Dialeg Mida Imatges identificadors
const labelWidthId = "labelWidth", inputWidthId = "widthMesure", labelHeightId = "labelHeight", inputHeightId = "heightMesure", confirmImageBtnId = "confirmImageBtn", chboxProportionalId = "chboxProportional", selectSizeUnitId = "selectSizeUnit", textMidesImatgeId = "textMidesImatge";
// Dialeg Característiques checkbox identificadors i noms
const chBoxTempsId = "chboxDate", chboxTempsName = "date", chBoxCapesStyleId = "chboxLayerStyle",  chboxCapesStyleName = "layerStyle", chBoxDimensionsId = "chboxDimension",  chboxDimensionsName = "dimension",chBoxPosZoomId = "chboxPosZoom", chboxPosZoomName = "positionZoom", confirmCaractBtnId = "confirmCaractBtn", chboxCapesName = "layers", chboxEstilsName = "styles", chboxZoomName = "zoom", chboxCoordName = "coordinates", formCheckboxesId = "formCheckboxes";
const pixelUnit = "px", percentageUnit = "%";
const limitsMidesImatge = {};
var resultatMidesImatge = {};
var resultatCaract = {[chboxCapesName]: {}, [chboxEstilsName]: {}, [chboxZoomName]: {}, [chboxCoordName]: {}, [chboxTempsName]:{}, [chboxDimensionsName]:{}};
// NOM per a les imatges que impliquen una acció de mapa.
const nomPuntSincr = "sincrPoint";
// IDENTIFICADOR per a les imatges que impliquen una acció de mapa.
const idImgSvgAccioMapa = "id_storymap_mm_action_";
// Tots els idiomes suportats pel navegador amb les seves correspondències amb els idiomes de Tiny Editor.
const idiomesTiny = {cat: 'ca', spa: 'es', eng: 'en', cze: 'cs', ger: 'de', fre: 'fr_FR'};
let arrayIdsImgAccions = [];
const identificadorDivAccioMapa = "AccioMapa_";
var contadorAccionsMapa = -1;
const indentificadorSelectorControls = "controls";
const divRelatId = "divRelat";
const ancoraRelat = "ancoraRelat"; 
const confirmNoInsercioId = "confirmNoInsercio";
const paragrafContinuacioId = "pContinuacio";
const missatgeAvisImatgeId = "missatgeAvisImatge";
const min_width_finestra_storymap = 500, min_height_finestra_storymap = 400;
const fontImatgesUsuari = "data:image/jpeg;";
IncludeScript("tinymce/js/tinymce/tinymce.min.js");

// Especificitat de la funció creaFinestraLayer per a l'Storymap.
/*function createStorymapFinestraLayer(win, name, titol, botons, left, top, width, height, ancora, param, content)   //param --> scroll, visible, ev, bg_trans, resizable
{
	
	createFinestraLayer(window, name, titol, botons, left, top, width, height, ancora, param, content);

	let currentStyle;
	const barraStorymap = getLayer(win, name+SufixBarra);
	barraStorymap.style["minWidth"] = min_width_finestra_storymap + "px";

	const finestraStorymap = getLayer(win, name+SufixFinestra);
	finestraStorymap.style["minHeight"] = min_height_finestra_storymap + "px";
	finestraStorymap.style["minWidth"] = min_width_finestra_storymap + "px";

	let i_finestra;

	for (i_finestra=0; i_finestra<layerFinestraList.length; i_finestra++)
	{
		if (layerFinestraList[i_finestra].nom==name)
		{
			layerFinestraList[i_finestra].min_size_finestra = {w: min_width_finestra_storymap, h: min_height_finestra_storymap};
			break;
		}
	}
}*/

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
	contadorAccionsMapa = -1;
	
	if (window.location.hash != '')
	{
		history.replaceState(null, '', DonaAdrecaSenseHash());
	}
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
	if (ParamCtrl.ImatgeSituacio && ParamCtrl.ImatgeSituacio.length > 1)
	{
		let indexSeg = 0;
		while (nstory < ParamCtrl.StoryMap.length)
		{
			if (ParamCtrl.StoryMap[nstory].EnvTotal)
			{
				if (typeof ParamCtrl.StoryMap[nstory].EnvTotal==="object" && Array.isArray(ParamCtrl.StoryMap[nstory].EnvTotal))
				{
					for(var i_crs=0; i_crs<ParamCtrl.StoryMap[nstory].EnvTotal.length; i_crs++)
					{
						if (EsEnvDinsAmbitActual(ParamCtrl.StoryMap[nstory].EnvTotal[i_crs]))
						{
							break;
						}
					}
					if(i_crs >= ParamCtrl.StoryMap[nstory].EnvTotal.length)
					{
						nstory++;
						continue;
					}
				}
				else if (!EsEnvDinsAmbitActual(ParamCtrl.StoryMap[nstory].EnvTotal))
				{
					nstory++;
					continue;
				}
			}
			i_real_story[indexSeg]=nstory;  // Ens quedem els índex que correpsonen a Stories dins l'àmbit del mapa.
			indexSeg++;
			nstory++;
		}
	}
	else
	{
		// Crea un array amb una seqüencia de números des de 0 fins a la longitud de relats que tenim en el navegador. 
		// Aquests números seran els índexos dels storymaps a mostrar en el llistat.
		i_real_story = Array.from({length: ParamCtrl.StoryMap.length}, (e, i)=> i);
	}
		
	cdns.push("<br><button style='position:relative; right:-25px;' onclick='DemanaStorymapsNimmbus(\"", name, "\")'>",
				GetMessage("RetrieveOtherStories", "storymap"), "</button>", "<br><br>",
				GetMessage("SelectStory", "storymap"), ":" ,
				"<br><table class=\"Verdana11px\">");
	let cdns2 = [], i_relat_local = 0, i_relat_compartit = 0;
	// Omplim totes les histories
	while (i_story<i_real_story.length)
	{
		const storyActual = ParamCtrl.StoryMap[i_real_story[i_story]];
		if (storyActual.compartida)
		{
			if(cdns2.length == 0)
			{
				cdns2.push("<br><hr class=\"separadorHoritzonal\" /><br><table class=\"Verdana11px\">");
			}
			if ((i_relat_compartit%ncol)==0)
				cdns2.push("<tr>");
			cdns2.push("<td style = 'vertical-align:text-top; text-align: center;'><a style='display: block;'", " href='javascript:void(0)' onclick='TancaIIniciaStoryMap(", i_real_story[i_story], ");'><img src='",(storyActual.src) ? storyActual.src : ((storyActual.srcData) ? storyActual.srcData : AfegeixAdrecaBaseSRC("1griscla.gif")),"' height='100' width='150' border='0'><p>",DonaCadena(storyActual.desc), "</p></a></td>");
			/* Incrementem valor en aquest precís instant per aconseguir que
			incloure els tags <tr> i </tr> sigui l'adequat, tal que quan s'inclou
			<tr> el </tr> no s'inclou fins la següent iteració que compleixi
			la condició.*/
			i_relat_compartit++;
			if ((i_relat_compartit%ncol)==0 || (i_relat_local + i_relat_compartit) ==nstory)
				cdns2.push("</tr>");
		}
		else
		{
			if ((i_relat_local%ncol)==0)
				cdns.push("<tr>");
			cdns.push("<td style = 'vertical-align:text-top; text-align: center;'><a style='display: block;'", " href='javascript:void(0)' onclick='");
			(storyActual.isNew) ? cdns.push("TancaICreaEditaStoryMap();'>") : cdns.push("TancaIIniciaStoryMap(", i_real_story[i_story], ");'>");
			cdns.push("<img src='",(storyActual.src) ? storyActual.src : ((storyActual.srcData) ? storyActual.srcData : AfegeixAdrecaBaseSRC("1griscla.gif")),"' height='100' width='150' border='0'><p>",
				DonaCadena(storyActual.desc),
			"</p></a></td>");
			/* Incrementem valor en aquest precís instant per aconseguir que
			incloure els tags <tr> i </tr> sigui l'adequat, tal que quan s'inclou
			<tr> el </tr> no s'inclou fins la següent iteració que compleixi
			la condició.*/
			i_relat_local++;
			if ((i_relat_local%ncol)==0 || (i_relat_local + i_relat_compartit) ==nstory)
				cdns.push("</tr>");
		}
		i_story++;
	}
	cdns.push("</table>");
	if(cdns2.length != 0)
	{
		cdns2.push("</table>");
		cdns.push(cdns2);
	}
	contentFinestraLayer(win, name, cdns.join(""));
	indexStoryMapActiu=-1;
}

// Per un canvi d'àmbit es refresca el contingut del llistat de relats.
function RefrescaFinestraTriaStoryMap(win, name)
{
	let finestraTriaRelats = getFinestraLayer(win, name);

	if (finestraTriaRelats)
	{
		// Netegem els continguts prèvis del div finestra.
		while (finestraTriaRelats.firstChild) {
			finestraTriaRelats.removeChild(finestraTriaRelats.firstChild);
		}
	}

	OmpleFinestraTriaStoryMap(win, name);
}

function DemanaStorymapsNimmbus(name)
{
	const urlIdNavegador = ParamCtrl.ServidorLocal;
	const urlServidor = new URL(urlIdNavegador);
	const elem = getFinestraLayer(window, name);		
	// URL per a la consulta de relats disponibles per aquest navegador.
	let url = GUFGetURLPreviousStorymapWithReproducibleUsage(urlServidor.host, urlServidor.href.indexOf("?") != -1 ? (urlServidor.href.slice(0, urlServidor.href.indexOf("?"))).replace("https","http") : urlServidor.href.replace("https","http"),
	{ru_platform: encodeURI(ToolsMMN), ru_version: VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers,
		ru_schema: encodeURIComponent(config_schema_storymap)},
	ParamCtrl.idioma, DonaAccessTokenTypeFeedback(urlIdNavegador) /*access_token_type*/);
	// Obtenim la llista de relats
	loadFile(url, "application/xml", function(resposta) {
		if(resposta && resposta.documentElement)
		{
			let respostaParsejada = ParseOWSContextAtom(resposta.documentElement); 
			if(respostaParsejada.properties.totalResults != 0)
			{
				let type;
				for(let i = 0; i<respostaParsejada.properties.totalResults; i ++)
				{
					type=GetNimmbusTypeOfAOWCFeature(respostaParsejada.features[i]);
					if (type=="FEEDBACK")
					{
						var resource_id = respostaParsejada.features[i].properties.links.alternates[0].href;
						if(!resource_id) 
							continue;
						
						var n = resource_id.indexOf("&RESOURCE=");
						if(n==-1)
							continue;
						resource_id = resource_id.substring(n+10);
						if(!resource_id)
							continue;
						n = resource_id.indexOf("&");  
						if(n ==-1)
							continue;
						resource_id = resource_id.substring(0, n);
						if(!resource_id)
							continue;
						//CridaReadStorymap(ParamCtrl.idioma, resource_id, AdoptaStorymap, null);	
						CridaACallBackFunctionAmbEstructuraGUF(ParamCtrl.idioma, resource_id, AdoptaStorymap, null);

					}
					/*else
					{
						continue;
					}
					//let urlRelat = respostaParsejada.features[i].id; // Fem un loadFile de cada recurs?
					// Obtenim un relat concret
					//loadFile(urlRelat, "application/xml", CridaACallBackFunctionAmbEstructuraGUF, null, {lang: ParamCtrl.idioma, id: resource_id, callback_function: AdoptaStorymap, params_function: null});
					//CridaACallBackFunctionAmbEstructuraGUF(ParamCtrl.idioma, resource_id, AdoptaStorymap, null);
					*/
				}
			}
			else
			{
				alert(MissatgeSenseElementsRetornats(extra_param));
				return;
			}
		}
	}, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); },{lang: "eng"});
}
/**
 * 
 * @param {*} lang 
 * @param {*} resource_id 
 * @param {*} func 
 * @param {*} params_function 
 */
function CridaReadStorymap(lang, resource_id, func, params_function)
{
	var url=ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE&LANGUAGE="+lang+"&RESOURCE="+resource_id;		
	loadFile(url, "text/xml", func, function(xhr, extra_param) { alert(url + ": " + xhr ); }, params_function);
}

/**
 * Ens permet descarregar un relat concret que estigui disponible a la plataforma Nimmbus i pel nostre mapa. 
 * @param {*} guf 
 * @returns 
 */
function AdoptaStorymap(guf, params_function)
{
	if (!guf)
	{
		// modificar text missatge per relats.
		alert(GetMessage("UnexpectedDefinitionOfFeedback", "qualitat") + ". " + GetMessage("StorymapCannotImported", "storymap") + ".");
		TancaFinestraLayer('feedbackAmbEstils');
		return;
	}
	/*const parseAnswer = ParseOWSContextAtom(guf.documentElement);
	*/
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
	if (!comprovaRedaccioRelatEnCurs())
	{
		let storyToEdit;
		if (i_relat != "nou")
		{
			TancaFinestraLayer("storyMap");

			storyToEdit = ParamCtrl.StoryMap[i_relat];
			idRelatEditat = storyToEdit.id;
			if (isLayer(getBarraLayer(window, "creaStoryMap")))
			{
				titolFinestraLayer(window, "creaStoryMap", GetMessage("EditStorymap", "storymap"));
			}
		}
		else
		{
			//Tancar la finestra de la graella de les histories
			TancaFinestraLayer("triaStoryMap");

			if (isLayer(getBarraLayer(window, "creaStoryMap")))
			{
				titolFinestraLayer(window, "creaStoryMap", GetMessage("NewStorymap", "storymap"));
			}
		}

		if (isFinestraLayer(window, "creaStoryMap"))
		{
			const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
			novaStoryMapFinestra.replaceChildren();
			const beginingStoryMapContent = ["<br><br><label style='margin:0 5px' for='title'>", GetMessage('Title') + ":", "</label><input type='text' id='", inputStoryTitolId, "' name='title' minlength='1' size='25' value='", (i_relat != "nou" ? storyToEdit.desc : ""), "'/><br><br>",
							"<label style='margin: 0 5px;'>", GetMessage('StorymapThumbnailImage', 'storymap') + "(JPEG ",GetMessage("or")," PNG): ", "</label>",
							"<button class=\"Verdana11px\" onclick=\"document.getElementById('",inputThumbnailId,"').click()\">"+GetMessage("SelectImage", "storymap")+"</button>",
							"<input id='", inputThumbnailId, "' type='file' align='center' accept='.jpg,.jpeg,.png' style='display:none' onChange='CarregaImatgeStoryMap(this)'/><br><br>",												
							"<img id='", imageThumbnailId, "' alt='", GetMessage("StorymapThumbnailImage", "storymap"), "' title='", GetMessage("StorymapThumbnailImage", "storymap"), "' style='visibility:", (i_relat != "nou" && storyToEdit.srcData ? "visible" : "hidden"),"; padding: 0 10px;' ", (i_relat != "nou" && storyToEdit.srcData ? "src='" + storyToEdit.srcData + "'" : ""),"/>"];
			const botoEsborrar = document.createElement("input")
			botoEsborrar.setAttribute("type", "button");
			botoEsborrar.setAttribute("id", botoBorraThumbnailId);
			botoEsborrar.setAttribute("style", "display: " + (i_relat != "nou" && storyToEdit.srcData ? "inline" : "none"));
			botoEsborrar.setAttribute("value", GetMessage("RemoveImage", "storymap"));
			botoEsborrar.addEventListener("click", esborraImatgePortada);
			const inputBtnNext = document.createElement("input");
			inputBtnNext.setAttribute("type", "button");
			inputBtnNext.setAttribute("class", "buttonDialog");
			inputBtnNext.setAttribute("value", GetMessage("Next"));
			inputBtnNext.addEventListener("click", comprovaTitol);
							
			novaStoryMapFinestra.insertAdjacentHTML("afterbegin", beginingStoryMapContent.join(""));
			novaStoryMapFinestra.insertAdjacentElement("beforeend", botoEsborrar);
			novaStoryMapFinestra.insertAdjacentElement("beforeend", document.createElement("br"));
			novaStoryMapFinestra.insertAdjacentElement("beforeend", inputBtnNext);
		}		
		ObreFinestra(window, "creaStoryMap");
	} 
	else
	{
		
		let dialegRedaccioCurs = document.getElementById(dialegAlertaRedaccioEnCursId);
		
		if (!dialegRedaccioCurs)
		{
			dialegRedaccioCurs = CreaDialegRedaccioRelatEnCurs();
		}

		let finestra;
		if (i_relat != "nou")
		{
			finestra = getFinestraLayer(window, "storyMap");
		}
		else 
		{
			finestra = getFinestraLayer(window, "triaStoryMap");
		}
		
		if (!finestra.contains(dialegRedaccioCurs))
		{
			finestra.appendChild(dialegRedaccioCurs);
		}

		dialegRedaccioCurs.show();	
	}
		
	function comprovaTitol(event)
	{	
		const finestra = event.target.parentNode;
		const inputTitolRelat = document.getElementById(inputStoryTitolId);
		if (inputTitolRelat && inputTitolRelat.value && inputTitolRelat.value != "")
			SeguentPasStoryMap(i_relat);
		else
		{
			let dialegTitol = document.getElementById(dialegAlertaTitolId);
			
			if (!dialegTitol)
			{
				dialegTitol = CreaDialegAlertaTitol();
				finestra.appendChild(dialegTitol);
			}
			
			dialegTitol.show();
		}
	}

	function comprovaRedaccioRelatEnCurs()
	{
		const style = getFinestraLayer(window, "creaStoryMap").getAttribute("style");
		return style.includes("visible");
	}
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
		else if (input.id == inputThumbnailId)
		{
			CarregaImatgeMiniaturaStoryMap(fitxerObjectiu);
		}
	}
	input.value = null;
}

/**
 * Seqüència sincrona de operacións per a la selecció de la imatge pertinent, modificació de les mides d'aquesta i càrrega de <img> dins del HTML del Tiny.    
 * @param {*} fitxerImatge Element DOM tipus input que incorpora la imatge. 
 */
function CarregaImatgeRelatStoryMap(fitxerImatge) 
{
	//Mirem la mida de la imatge
	const urlImage = URL.createObjectURL(fitxerImatge);
	const imageToMesure = new Image();
	
	imageToMesure.onload =  function () {

		MostraDialogImatgeNavegador(this, mostraImatgeRedimensionada);
	};

	imageToMesure.onerror = function() {
		new Error("Error carregant la imatge.");
	};

	// Callback function to really draw image file allready read but with right sizes.
	function mostraImatgeRedimensionada(midesImatge)
	{
		if (midesImatge)
		{
			const canvasId = "reduccioImatges";
			let canvasReduccioImg = document.getElementById(canvasId);
			if (!canvasReduccioImg)
			{
				canvasReduccioImg = document.createElement("canvas");
				canvasReduccioImg.setAttribute("id", canvasId);
			} 
			canvasReduccioImg.width = midesImatge.width;
			canvasReduccioImg.height = midesImatge.height;

			const cntx = canvasReduccioImg.getContext("2d");
			cntx.drawImage(imageToMesure, 0, 0, midesImatge.width, midesImatge.height);
			const tinyEditor = tinymce.get(tinyTextStoryMapId);
			const imatgeReduida = canvasReduccioImg.toDataURL("image/jpeg", 0.5);
			
			if (tinyEditor && imatgeReduida && imatgeReduida!="data:," && esPermetAfegirImatge(tinyEditor))
			{ 
				const nodeDestiImatge = tinyEditor.selection.getNode();
				const rangCursor = tinyEditor.selection.getRng();
				const previHtml = nodeDestiImatge.innerText.substring(0, rangCursor.startOffset);
				const postHtml = nodeDestiImatge.innerText.substring(rangCursor.startOffset, nodeDestiImatge.innerHTML.length);

				nodeDestiImatge.innerHTML = previHtml + "<img src='" + imatgeReduida + "' width=" + midesImatge.width + "/>" + postHtml;
			}
			cntx.clearRect(0, 0, canvasReduccioImg.width, canvasReduccioImg.height);
		}
		URL.revokeObjectURL(urlImage);
	}

	imageToMesure.src = urlImage;
}

/**
 * Seqüència sincrona de operacións per a la selecció de la imatge pertinent, modificació de les mides d'aquesta i càrrega de <img> de portada del relat.    
 * @param {*} fitxerImatge Element DOM tipus input que incorpora la imatge. 
 */
function CarregaImatgeMiniaturaStoryMap(fitxerImatge) 
{
	//Mirem la mida de la imatge
	const urlImage = URL.createObjectURL(fitxerImatge);
	const imageToMesure = new Image();

	try{
		imageToMesure.onload =  function () {
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
				imageThumbnail.style.visibility = "visible";
				imageThumbnail.src = canvasReduccioThumbnail.toDataURL("image/jpeg", 0.5);
				const botoEsborrar = document.getElementById(botoBorraThumbnailId);
				if (botoEsborrar)
				{
					botoEsborrar.style.display = "inline";
				}
 			}
			 URL.revokeObjectURL(urlImage);
		}
	}
	catch (err)
	{
		throw new Error(GetMessage("ErrorReadingImages", "storymap") + ":", {cause: err});
	}

	imageToMesure.src = urlImage;
}

// Esborra la imatge que estigui carregada com a portada del relat.
function esborraImatgePortada()
{
	const imgThumbnail = document.getElementById(imageThumbnailId);
	if (imgThumbnail && imgThumbnail.src != "")
	{
		const botoEsborrar = document.getElementById(botoBorraThumbnailId);
		if (botoEsborrar)
		{
			botoEsborrar.style.display = "none";
		}

		imgThumbnail.removeAttribute("src");
		imgThumbnail.style.visibility = "hidden";
	}
}

/**
 * Crea un diàleg per avisar a l'usuari de la presència d'un relat en redacció en curs. Només permetrem redactar 1 relat a la vegada.
 * @returns 
 */
function CreaDialegRedaccioRelatEnCurs()
{
	const dialogHtml = ["<form><p>" + GetMessage("UnicStroymapWriting", "storymap") + ":</p><p style= 'text-align: center;'><button class='buttonDialog' value='cancel' formmethod='dialog'>", GetMessage("OK"), "</button></p></form>"];

	const dialog = CreaDialog(dialegAlertaRedaccioEnCursId, dialogHtml.join(""));

	return dialog;
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
	const dialogHtml = ["<form><p id='" + textMidesImatgeId + "'>", textMides, "</p><div align-items='stretch'><p style='align: center'><label id='" + labelWidthId + "' for='", inputWidthId, "'>"+ GetMessage("ReducedWidth", "storymap") + " (" + percentageUnit +"):</label><input type='text'  id='", inputWidthId, "' title='Only digits'><label id='" + labelHeightId + "' for='", inputHeightId, "'>"+ GetMessage("ReducedHeight", "storymap") + " (" + percentageUnit + "):</label><input type='text' title='Only digits' id='", inputHeightId, "'></p><p><label for='", selectSizeUnitId,"'>" + GetMessage("ChooseUnitMeasurement", "storymap") + ":</label><select id='" + selectSizeUnitId + "'><option value='" + pixelUnit + "'>" + pixelUnit + "</option><option value='" + percentageUnit + "' selected>" + percentageUnit + "</option></select><label for='", chboxProportionalId, "'>" + GetMessage("MaintainProportionality", "storymap") + "</label><input type='checkbox' id='", chboxProportionalId, "' checked></p><p style='align: center'><button id='", confirmImageBtnId, "' class='button_image_dialog buttonDialog' formmethod='dialog' value='default'>" + GetMessage("OK") + "</button><button class='button_image_dialog buttonDialog' value='cancel' formmethod='dialog'>" + GetMessage("Cancel") + "</button></p></div></form>"];

	return CreaDialog(dialegMidesId, dialogHtml.join(""));
}
// Actualitza les mides de la imatge en el text del dialeg.
function ActualitzaTextMidesImatge(imatge)
{
	const textMidesImatge = document.getElementById(textMidesImatgeId);
	textMidesImatge.innerHTML = GetMessage("OriginalMeasurementsImage", "storymap") + ": <b>" + imatge.width + GetMessage("pxWidth", "storymap") + "</b>, <b>" + imatge.height + GetMessage("pxHeight", "storymap") + "</b>."
}

/**
 * Crea un diàleg per a elegir quines característiques del mapa mantindre per un determinat fragment del relat.
 * @returns 
 */
function CreaDialegSincronitzarAmbMapa()
{
	const dialogHtml = ["<form id='", formCheckboxesId,"'><p>" + GetMessage("SelectMapFeatures", "storymap") + "</p><div class='horizontalSpreadElements' style='margin:0 0 2%;'><input type='checkbox' id='", chBoxPosZoomId, "' name='", chboxPosZoomName,"' checked><label for='", chBoxPosZoomId, "'>" + GetMessage("Position&Zoom", "storymap") + "</label><input type='checkbox' id='", chBoxCapesStyleId, "' name='", chboxCapesStyleName,"' checked><label for='", chBoxCapesStyleId, "'>" + GetMessage("Layers&Styles", "storymap") + "</label><input type='checkbox' id='", chBoxDimensionsId, "' name='", chboxDimensionsName,"' checked><label for='", chBoxDimensionsId, "'>" + GetMessage("Dimensions", "storymap") + "</label><input type='checkbox' id='", chBoxTempsId, "' name='", chboxTempsName,"' checked><label for='", chBoxTempsId, "'>" + GetMessage("Date") + "</label></div><div class= 'horizontalSpreadElements' style='margin:3% 0 0;'><button id='", confirmCaractBtnId, "' formmethod='dialog' value='default'>" + GetMessage("OK") + "</button><button value='cancel' formmethod='dialog'>" + GetMessage("Cancel") + "</button></div></form>"];

	return CreaDialog(dialegCaractId, dialogHtml.join(""));
}

/*
* Infroma a l'usuari que l'acció del mapa o la imatge que es vol inserir no és possible.
*/
function creaDialegInsercioIncorrecta(motiu)
{
	const dialogHtml = ["<form><p id='", missatgeAvisImatgeId, "'>", GetMessage("NotPossibleInsertNewContent", "storymap"), ": ", (motiu == null ? GetMessage("unknown") : motiu) , "</p><div style='align-items: center;'><button id='", confirmNoInsercioId, "' formmethod='dialog' value='cancel'>", GetMessage("OK"), "</button></div></form>"];

	return CreaDialog(dialegAlertaInsercioId, dialogHtml.join(""));
}

// Comprovar si podem afegir una imatge al relat en el lloc que preveiem.
function esPermetAfegirImatge(tinyEditor)
{
	let esPermet = false;
	let motiu;

	if (tinyEditor.selection.getSel().type=="Range")
	{
		if (tinyEditor.selection.getNode().nodeName == "IMG")
		{
			motiu = GetMessage("NotAdmittedOnImage", "storymap");
		}
		else
		{
			motiu = GetMessage("NotAdmittedRangeSelection", "storymap");
		}
		esPermet = false;
	}
	else
	{
		esPermet = true;
	}

	if (!esPermet)
	{
		const finestraRelats = document.getElementById("creaStoryMap_finestra");
		let dialegInsercio = document.getElementById(dialegAlertaInsercioId);
		if (dialegInsercio)
		{
			let missatgeAvis = document.getElementById(missatgeAvisImatgeId);
			if (missatgeAvis)
			{
				missatgeAvis.innerText = GetMessage("NotPossibleInsertNewContent", "storymap") + ": " + motiu;
			}

			if (!finestraRelats.contains(dialegInsercio))
			{
				finestraRelats.insertAdjacentElement("beforeend", dialegInsercio);
			}
		}
		else
		{
			dialegInsercio = creaDialegInsercioIncorrecta(motiu);
			dialegInsercio.setAttribute("id", dialegAlertaInsercioId);
			finestraRelats.insertAdjacentElement("beforeend", dialegInsercio);
		}
			
		dialegInsercio.show();
	}

	return esPermet;
}

// Funció per avaluar la ideoneitat del lloc del relat a adjuntar una modificació per inserir una imatge o bé una acció de mapa.
function esPermetModificacioAccio(tinyEditor)
{
	const regexpImgId = new RegExp(`^${idImgSvgAccioMapa}`);
	const seleccio = tinyEditor.selection.getSel();
	const nodeObjectiu = tinyEditor.selection.getNode();
	const cosRelat = tinyEditor.getBody();
	if (seleccio.type == "Caret" && comprovaNodePareAmbAccio(nodeObjectiu, cosRelat))
		return false
	else if (seleccio.type == "Range")
	{
		if (nodeObjectiu.nodeName == "IMG")
			return !regexpImgId.test(nodeObjectiu.id) && !comprovaNodePareAmbAccio(nodeObjectiu, cosRelat);
		else
		{
			const arrayNodes = Array.from(cosRelat.childNodes);
			const nodeInicial = tinyEditor.selection.getStart();
			const nodeFinal = tinyEditor.selection.getEnd();
			let accioTrobada = false, indexActual = arrayNodes.indexOf(nodeInicial), indexFinal = arrayNodes.indexOf(nodeFinal);
			
			while(!accioTrobada && indexActual <= indexFinal)
			{
				accioTrobada = comprovaNodePareAmbAccio(arrayNodes[indexActual], cosRelat) || comprovaNodeFillAmbAccio(arrayNodes[indexActual], 0);
				indexActual++;
			}

			return !accioTrobada;
		}
	}
	
	return true;

	/**
	 * Comprova si el node o algun del seus pares ja té una acció de mapa associada (attributes='data-mm-...').
	 * @param {*} nodeObjectiu Node des del qual comencem a observar i als seus nodes ascendets.
	 * @param {*} tinyBody Tot l'html que conté l'editor del Tiny MCE en aquest moment.
	 * @returns 
	 */
	function comprovaNodePareAmbAccio(nodeObjectiu, tinyBody)
	{
		if (comprovaHiHaAccio(nodeObjectiu))
			return true;
		/* Hem comprovat tots els nodes i els seus pares fins assegurar-nos que 
		   no n'hi ha cap amb acció de mapa en tota la gerarquia ascendent del 
		   node objectiu inicial. Si ja hem arribat a l'arrel del body hem acabat.
		*/
		if (nodeObjectiu === tinyBody || nodeObjectiu.parentNode === tinyBody || nodeObjectiu.parentNode == null)
			return false;
		//Recursivitat per seguir comprovant els pares de la gerarquia ascendent.
		return comprovaNodePareAmbAccio(nodeObjectiu.parentNode, tinyBody);
	}

	/**
	 * 
	 * @param {*} nodeObjectiu Node el qual comprovem si té alguna acció de mapa. 
	 * @param {*} profunditat 1er Nivell de fills, 2n nivell de fills... 0 és el nivell més superficial i inicial. 
	 * @returns true si es troba acció de mapa o false del contrari.
	 */
	function comprovaNodeFillAmbAccio(nodeObjectiu, profunditat)
	{
		if (comprovaHiHaAccio(nodeObjectiu))
			return true;
		if (nodeObjectiu.hasChildNodes)
		{
			const childs = nodeObjectiu.childNodes;
			for (const node of childs)
			{
				if (comprovaNodeFillAmbAccio(node, profunditat++))
					return true;
			}
		}
		else if (profunditat==0)
			return false;
	}

	// Busquem en el node passat per paràmetre un attribut que comenci per data-mm-
	function comprovaHiHaAccio(nodeObjectiu)
	{
		if (nodeObjectiu.nodeName == "DIV")
		{
			if (nodeObjectiu.hasAttributes())
			{
				//Com comprovar que hi han attributs propis amb forma de data-mm-... 
				const regex = new RegExp(`^data-mm-`);
				const attributsNode = nodeObjectiu.attributes;
				for (const atribut of attributsNode)
				{
					if (regex.test(atribut.name))
						return true;	
				}
			}
		}
		return false;
	}
}

function MostraDialogImatgeNavegador(imatgeSeleccionada, callback)
{
	const esImatgeApaisada = imatgeSeleccionada.width >= imatgeSeleccionada.height;
	function calcularLimitImatges(imatge)
	{
		let proporcio = imatge.height/imatge.width;
		if (esImatgeApaisada)
		{
			limitsMidesImatge.width = {};
			limitsMidesImatge["width"][percentageUnit] = midaImatgeMaximaPx * 100 / imatge.width;
			limitsMidesImatge["width"][pixelUnit] = midaImatgeMaximaPx;
			limitsMidesImatge.height = {};
			limitsMidesImatge["height"][pixelUnit] = limitsMidesImatge["width"][pixelUnit] * proporcio;
			limitsMidesImatge["height"][percentageUnit] = limitsMidesImatge["height"][pixelUnit] * 100 / imatge.height;
		}
		else 
		{
			limitsMidesImatge.height = {};
			limitsMidesImatge["height"][percentageUnit] = midaImatgeMaximaPx * 100 / imatge.height;
			limitsMidesImatge["height"][pixelUnit] = midaImatgeMaximaPx;
			limitsMidesImatge.width = {};
			limitsMidesImatge["width"][pixelUnit] = limitsMidesImatge["height"][pixelUnit] * (1 / proporcio);
			limitsMidesImatge["width"][percentageUnit] = limitsMidesImatge["width"][pixelUnit] * 100 / imatge.width;
		}	
	}

	calcularLimitImatges(imatgeSeleccionada);
	
	// Element del DOM que ens permet anclar el dialeg
	let anchorElement = document.getElementById(inputImageStorymapId);
	
	if (anchorElement)
	{
		function retornaMidesImatge(event) {
			// Després de tancar el missatge emergent de les mides.
			resultatMidesImatge = {};
			let resultatDialeg = null;

			if (event.target.returnValue != "cancel")
			{
				resultatDialeg = JSON.parse(event.target.returnValue);
			}
			// Eliminem els events abans de destruir el contexte en que han esta creats
			inputWidth.removeEventListener("change", nouValorAmplada, true);
			inputHeight.removeEventListener("change", nouValorAlcada, true);
			chboxProportional.removeEventListener("change", alternaProporcionalitat, true);
			selector.removeEventListener("change", canviUnitats, true);
			confirmBtn.removeEventListener("click", confirmarMides, true);
			midesDialog.removeEventListener("close", retornaMidesImatge, true);
			callback(resultatDialeg);
		};

		let midesDialog = document.getElementById(dialegMidesId);
		if (!midesDialog)
		{
			midesDialog = CreaDialegMidesImatge(imatgeSeleccionada);
			anchorElement.parentNode.appendChild(midesDialog);
			
			midesDialog.addEventListener("close", retornaMidesImatge, true);
		}
		else
		{
			ActualitzaTextMidesImatge(imatgeSeleccionada);
			midesDialog.addEventListener("close", retornaMidesImatge, true);
		}
		// Caixetí d'amplada
		const inputWidth = document.getElementById(inputWidthId);

		function nouValorAmplada(event) {
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
		}
		
		inputWidth.addEventListener("change", nouValorAmplada, true);

		// Caixetí d'alçada
		const inputHeight = document.getElementById(inputHeightId);

		function nouValorAlcada(event) {
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
		}

		inputHeight.addEventListener("change", nouValorAlcada, true);

		// Checkbox Propocional
		const chboxProportional = document.getElementById(chboxProportionalId);

		function alternaProporcionalitat(event) {
			if (event.target.checked)
			{
				resultatMidesImatge = adaptImageGivenProportionaly(resultatMidesImatge, imatgeSeleccionada, null);
				updateSizeInputValues(resultatMidesImatge.width, resultatMidesImatge.height);
				confirmBtn.disabled = checkForEmptyValuesOrNonNumbers(inputWidth, inputHeight);
			}
		}

		chboxProportional.addEventListener("change", alternaProporcionalitat, true);

		// Selector de unitats
		const selector = document.getElementById(selectSizeUnitId);

		function canviUnitats(event) {
			updateUnitChangeInputValuesLabelUnits(event.target.value, imatgeSeleccionada);
		}
		
		selector.addEventListener("change", canviUnitats, true);

		// Botó de confirmació
		const confirmBtn = document.getElementById(confirmImageBtnId);

		function confirmarMides(event) {
			event.preventDefault();
			if (checkImageLimits())
			{
				let midesConfirmadesImatge = 0;
				selector.value == percentageUnit ? midesConfirmadesImatge = {width: resultatMidesImatge.width*imatgeSeleccionada.width/100, height: resultatMidesImatge.height*imatgeSeleccionada.height/100} : midesConfirmadesImatge = {width: resultatMidesImatge.width, height: resultatMidesImatge.height};
				midesDialog.close(JSON.stringify(midesConfirmadesImatge)); // S'envia les mides en pixels.	
			}
			else 
			{
				alert("La mida de imatge desitjada supera el límit establert. Redueixi-la.");
			}
		}
		
		confirmBtn.addEventListener("click", confirmarMides, true);
		
		// Entrada de mides imatge
		inputWidth.value = limitsMidesImatge["width"][percentageUnit];
		resultatMidesImatge.width = limitsMidesImatge["width"][percentageUnit];
		
		inputHeight.value = limitsMidesImatge["height"][percentageUnit];
		resultatMidesImatge.height = limitsMidesImatge["height"][percentageUnit];
				
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
	let caractDialog = document.getElementById(dialegCaractId);
	if (!caractDialog)
	{
		const ultimElem = document.getElementById(ultimElemId);
		caractDialog = CreaDialegSincronitzarAmbMapa();
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
					
					ParamCtrl.capa.forEach((capa) => { 
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
				
				if (resultatCaractUsuari[chboxDimensionsName]["status"])
				{
					const dimensionsExtra=[];
					ParamCtrl.capa.forEach((capa) => { 
						if (capa.visible=="si" && capa.dimensioExtra && capa.dimensioExtra.length > 0)
						{
							let dimensio, cdns;
							cdns = `{"ly":"${capa.id}","dims":{`;
							for (let i=0; i<capa.dimensioExtra.length; i++)
							{
								dimensio = capa.dimensioExtra[i];
								cdns += `"${dimensio.clau.nom}":"${dimensio.valor[dimensio.i_valor].nom}"`;
								
								if (i!=capa.dimensioExtra.length-1)
								{
									cdns += ",";
								}
							}
							cdns += "}}";
							dimensionsExtra.push(cdns);
						}
					});
					
					if (dimensionsExtra.length > 0)
					{
						resultatCaractUsuari[chboxEstilsName]["attribute"] = {name: "data-mm-extradims", value: dimensionsExtra.toString()};
					}
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
				
				const tinyEditor = tinymce.get(tinyTextStoryMapId);
				const tinyParent = tinyEditor.selection.getNode();
				if (hiHaCheckboxSeleccionat) 
				{
					let divResultatCaract = document.createElement("div");
					divResultatCaract.setAttribute("data-mm-crs", ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

					Object.keys(resultatCaractUsuari).forEach((caracteristica) => {
						if(resultatCaractUsuari[caracteristica]["attribute"])
						{
							divResultatCaract.setAttribute(resultatCaractUsuari[caracteristica]["attribute"]["name"], resultatCaractUsuari[caracteristica]["attribute"]["value"]);
						}
					});
					
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

						if (esUltimNodeFill(divResultatCaract, tinyEditor.getBody()))
						{
							let paragrafContinuacioRelat = document.createElement("p");
							paragrafContinuacioRelat.setAttribute("id", paragrafContinuacioId);
							paragrafContinuacioRelat.innerText = " -	" + GetMessage("NextStoryMapContent", "storymap") +"	-";
							tinyEditor.getBody().appendChild(paragrafContinuacioRelat);
						}

						// Afegim la imatge que indica que hem realitzat una sincronització amb el mapa.
						const tinyEditorBody = tinyEditor.getBody();
						const imatgesSincro = tinyEditorBody.querySelectorAll("img[name='" + nomPuntSincr + "']");
						CreaImatgeMarcadorSincronismeMapa(divResultatCaract, imatgesSincro.length);
					}
				
				}
			}
		});
		// Events per als checkboxs
		const contenedorCheckbox = document.querySelector("dialog[id='"+ dialegCaractId + "']");
		const checkboxes = contenedorCheckbox.querySelectorAll("input[type='checkbox']");
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener("change", (event) => saveCheckStatus(event.target));
			resultatCaract[checkbox.name] = {status: true};
		});
		// Event per al botó de confirmació.
		const confirmBtn = document.getElementById(confirmCaractBtnId);
		confirmBtn.addEventListener("click", (event) => {
			event.preventDefault();
			caractDialog.close(JSON.stringify(resultatCaract));
		});
	}

	function saveCheckStatus(checkbox)
	{
		resultatCaract[checkbox.name]["status"] = checkbox.checked;
	};

	const contenedorCheckbox = document.querySelector("dialog[id='"+ dialegCaractId + "']");
	// Per tal que els checkboxs i els valors d'estat d'aquests guardats a resultatCaract es corresponguin, resetejo els checkbox al seu valor inicial de "checked" o "no checked".
	const formCheckbox = contenedorCheckbox.querySelector("form[id='" + formCheckboxesId + "']");
	if (formCheckbox)
		formCheckbox.reset();

	const tinyEditor = tinymce.get(tinyTextStoryMapId);
	if (esPermetModificacioAccio(tinyEditor))
	{
		caractDialog.showModal();
	}
	else
	{
		//const tinyContainer = tinyEditor.getContainer();
		const finestraRelats = document.getElementById("creaStoryMap_finestra");
		let dialegInsercio = document.getElementById(dialegAlertaInsercioId);
		if (dialegInsercio)
		{
			let missatgeAvis = document.getElementById(missatgeAvisImatgeId);
			if (missatgeAvis)
			{
				missatgeAvis.innerText = GetMessage("NotPossibleInsertNewContent", "storymap") + ": " + GetMessage("NotAdmittedMapActionsNested", "storymap");
			}

			if (!finestraRelats.contains(dialegInsercio))
			{
				finestraRelats.insertAdjacentElement("beforeend", dialegInsercio);
			}
		}
		else
		{
			dialegInsercio = creaDialegInsercioIncorrecta(GetMessage("NotAdmittedMapActionsNested", "storymap"));			
			finestraRelats.insertAdjacentElement("beforeend", dialegInsercio);
		}
		
		dialegInsercio.show();
	}
}

// Comprova si el node del primer paràmetre correspon amb l'últim del relat. 
function esUltimNodeFill(divCaracteristiques, tinyBody)
{
	let arrayChilds = Array.from(tinyBody.childNodes);
	return arrayChilds[arrayChilds.length -1] === divCaracteristiques;
}

// Substitueix el contingut automàtic de l'últim paràgraf per l'introduït per l'usuari.
function netejaUltimParagraf(modificacio) 
{
	if (modificacio.element && modificacio.element.id == paragrafContinuacioId && !modificacio.element.selectionChange)
	{
		modificacio.element.innerHTML = "&nbsp;";
		modificacio.element.removeAttribute("id");
	}
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
		license_key: 'gpl',
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
				icon: "embed",
				tooltip: GetMessage("SavesMapCharacteristics", "storymap"),
				onAction: (_) => MostraDialogCaracteristiquesNavegador(endButtonId)
			});
			editor.on("NodeChange", modificacioNode => {
				netejaUltimParagraf(modificacioNode);
			});
		}
    }).then((initEditors) => {
		if (initEditors && initEditors.length > 0 && i_relat != "nou")
		{
			const relat = ParamCtrl.StoryMap[i_relat].html;
			const parser = new DOMParser();
			const DOMStorymap = parser.parseFromString(relat, "text/html");
			//Eliminem el títol del relat de la part del text a editar
			const title = DOMStorymap.querySelector("#" + h1TitleStorymap);
			if (title !== null)
			{
				title.remove();
			}

			// Afegim les imatges indicatives d'accions de mapa
			const arrayDivAccions = DOMStorymap.querySelectorAll(`div[id^='${identificadorDivAccioMapa}']`);
			const arrayDivIds= [];
			/* No ens és vàlid només demanar la llista de <div> on hi han accions de mapa amb querySelectorAll 
			/	perquè la llista resultant és una llista estàtica de nodes. Tot canvi aplicat als 
			/ 	elements d'aquesta llista no tindrà efecte al HTML general del relat. Per això obtenim 
			/	la llista dels seus Ids	per poder-los instanciar amb aquests i llavors si modificar-los al nostre gust.
			*/
			arrayDivAccions.forEach((div)=> {arrayDivIds.push(div.getAttribute("id"))});
			let comptadorDivAccio = 0;
			let idDivAccio, divAccioACompletar;
			for(idDivAccio of arrayDivIds)
			{
				divAccioACompletar = DOMStorymap.getElementById(idDivAccio);
				CreaImatgeMarcadorSincronismeMapa(divAccioACompletar, comptadorDivAccio);
				comptadorDivAccio++;
			}
			const editor = initEditors.find((editor) => editor.id == tinyTextStoryMapId);
			editor.setContent( DOMStorymap.body.innerHTML);
		}	
	});
}

function FinalitzarStoryMap(estemEditant = false)
{
	const tinyEditor = tinymce.get(tinyTextStoryMapId);
	const tinyEditorBody = tinyEditor.getBody();
	const imatgesSincro = tinyEditorBody.querySelectorAll("img[name='" + nomPuntSincr + "']");
	// Eliminem les imatges que indiquen cada punt del relat on s'ha sincronitzat el relat amb el mapa.
	imatgesSincro.forEach((imatge) => imatge.remove());
	//Eliminem el paràgraf afegit automàticament en cas que hi fos
	let paragrafAutomatic = tinyEditorBody.querySelector("p[id='" + paragrafContinuacioId + "']");
	if (paragrafAutomatic)
	{
		paragrafAutomatic.remove();
	}

	const cdns = "<html>" + ((novaStoryMap.titol && novaStoryMap.titol != "") ? ("<h1 id='" + h1TitleStorymap + "'>"+ novaStoryMap.titol + "</h1>") : "") + tinyEditor.getContent({format: "html"}) + "</html>";
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
const storyMap = "storyMap";

	contadorAccionsMapa= -1;
	const finestraRelat = getFinestraLayer(window, storyMap);
	
	// Eliminem els nodes anidats a la finestra de lectura de relats així evitar tenir elements repretits de l'anterior visualitsació 
	while (finestraRelat.firstChild) {
		finestraRelat.removeChild(finestraRelat.firstChild);
	}
	  
	if (relatACarregar.desc)
		titolFinestraLayer(window, storyMap, DonaCadena(relatACarregar.desc));

	if (typeof relatACarregar.MargeEsq!=="undefined" || typeof relatACarregar.MargeSup!=="undefined" ||
	    relatACarregar.Ample || relatACarregar.Alt)
	{
		var rect=getRectFinestraLayer(window, storyMap);
		let minSize = getMinSizeFinestraLayer(win, storyMap);
		moveFinestraLayer(window, storyMap, (typeof relatACarregar.MargeEsq!=="undefined" && relatACarregar.MargeEsq>=0) ? relatACarregar.MargeEsq : rect.esq,
				(typeof relatACarregar.MargeSup!=="undefined" && relatACarregar.MargeSup>=0) ? relatACarregar.MargeSup : rect.sup,
				(relatACarregar.Ample) ? relatACarregar.Ample : rect.ample,
				(relatACarregar.Alt) ? relatACarregar.Alt : rect.alt, minSize.width, minSize.height);
	}
	
	// Crear el marc per al relat de mapes. 
	let divRelat = document.createElement("div");
	divRelat.setAttribute("id", divRelatId);
	divRelat.setAttribute("style", "overflow-x: hidden; overflow-y: auto; padding: 0 3%; height: 92%;");
	divRelat.addEventListener("scroll", ExecutaAttributsStoryMapVisibleEvent);
	divRelat.insertAdjacentHTML("afterbegin", RemoveBaseHTMLTag(text_html));
	
	/* 
	*	Tot canvi que hi hagi entre les nodesfills del relat volem estar-ne al corrent 
	*	i així saber quan ja hi son les imatges d'acció de mapa i poder obtenir-ne els seus Ids.
	*/
	const mutationObserver = new MutationObserver(function(changes, observer) {
		const imgAccio = document.querySelectorAll(`img[id^=${idImgSvgAccioMapa}]`);
		if(imgAccio && changes[0].target.contains(imgAccio[0]))
		{
			// Quan la imatge en blanc ja està inclosa en el DOM fem el càlcul de les alçades.
			RecuperarIdsImatgesAccions(changes[0].target.innerHTML);
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
		if (contadorAccionsMapa > 0)
		{
			contadorAccionsMapa--;
			
			const idImatge = arrayIdsImgAccions[contadorAccionsMapa];
			let ancoraNavegacio= document.querySelector("a[name='" + ancoraRelat + "']")
			if (ancoraNavegacio)
			{
				ancoraNavegacio.setAttribute("href", "#" + idImatge);
				ancoraNavegacio.click();
			}
			else 
			{
				ancoraNavegacio = document.createElement("a");
				ancoraNavegacio.setAttribute("href", "#" + idImatge);
				ancoraNavegacio.setAttribute("name", ancoraRelat);
				ancoraNavegacio.setAttribute("display", "none");
				finestraRelat.appendChild(ancoraNavegacio);
				ancoraNavegacio.click();
			}
		}
	});

	let seguentBoto = document.createElement("input");
	seguentBoto.setAttribute("type", "button");
	seguentBoto.className = "button_image_dialog";
	seguentBoto.classList.add("center");
	seguentBoto.classList.add("control");
	seguentBoto.setAttribute("name", "controlAccio");
	seguentBoto.setAttribute("value", GetMessage("Next"));
	seguentBoto.addEventListener("click", function () {
		
		if (contadorAccionsMapa < arrayIdsImgAccions.length-1)
		{
			contadorAccionsMapa++;

			const idImatge = arrayIdsImgAccions[contadorAccionsMapa];
			let ancoraNavegacio= document.querySelector("a[name='" + ancoraRelat + "']")
			if (ancoraNavegacio)
			{
				ancoraNavegacio.setAttribute("href", "#" + idImatge);
				ancoraNavegacio.click();
			}
			else 
			{
				ancoraNavegacio = document.createElement("a");
				ancoraNavegacio.setAttribute("href", "#" + idImatge);
				ancoraNavegacio.setAttribute("name", ancoraRelat);
				ancoraNavegacio.setAttribute("display", "none");
				finestraRelat.appendChild(ancoraNavegacio);
				ancoraNavegacio.click();
			}
		}
	});

	
	
	let divBotonsAccio = document.createElement("div");
	divBotonsAccio.setAttribute("class", "horizontalSpreadElements");
	divBotonsAccio.setAttribute("style", "height: 100%;");
	divBotonsAccio.appendChild(definicio);
	divBotonsAccio.appendChild(previBoto);
	divBotonsAccio.appendChild(seguentBoto);

	let divBotons = document.createElement("div");
		divBotons.setAttribute("class", "horizontalSpreadElements");
		divBotons.setAttribute("style", "height: 8%; position: relative; top: 0 px; left: 0 px");

	if (relatACarregar.origen && relatACarregar.origen == OrigenUsuari)
	{
		let divDivisio = document.createElement("div");
		divDivisio.setAttribute("class", "control");
		divBotonsAccio.insertAdjacentElement("afterbegin", divDivisio);

		// Afegim els botons d'edició dins de la finestra de visualització:
		divBotons.insertAdjacentHTML("afterbegin", ["<button class='center' onclick='TancaICreaEditaStoryMap(", i_story,")'>", GetMessage("Edit"), "</button>"].join(""));

		if (relatACarregar.compartida !=null && !relatACarregar.compartida)
		{
			divBotons.insertAdjacentHTML("beforeend", ["<button name='upload' class='center' onclick='CompartirStorymap(", i_story ,")'>", GetMessage("Share"), "</button>"].join(""));
		}
	}
	
	divBotons.appendChild(divBotonsAccio);

	finestraRelat.insertAdjacentElement("afterbegin", divRelat);
	finestraRelat.insertAdjacentElement("afterbegin", divBotons);
	
	// Línia horitzontal separadora amb inici del relat.
	let liniaHoritzontal = document.createElement("hr");
	liniaHoritzontal.className = "separadorHoritzonal";
	divBotons.insertAdjacentElement("afterend", liniaHoritzontal);
	
	ObreFinestra(window, storyMap);
	
	AfegeixEspaiTransparent();
	AfegeixMarkerStoryMapVisible();

	indexStoryMapActiu=i_story;
	darrerNodeStoryMapVisibleExecutat=null;
	ExecutaAttributsStoryMapVisible();
}

function RecuperarIdsImatgesAccions(textHtml)
{
	// Netegem l'array d'antics càlculs
	arrayIdsImgAccions = [];

	const domFromText = new DOMParser().parseFromString(textHtml, "text/html");
	const nodeListDivAccions = domFromText.body.querySelectorAll("div[data-mm-center],div[data-mm-zoom],div[data-mm-layers],div[data-mm-styles],div[data-mm-time],div[data-mm-sels],div[data-mm-diags],div[data-mm-extradims],div[data-mm-crs]");
	const arrayDivAccions = Array.from(nodeListDivAccions).filter((div) => div.id.includes(identificadorDivAccioMapa));
	if (arrayDivAccions.length > 0)
	{
		let divAccio, imgAccio;
		let contadorAccionsTransformades= 0;
		for(contadorAccionsTransformades=0; contadorAccionsTransformades < arrayDivAccions.length; contadorAccionsTransformades++)
		{	
			divAccio = domFromText.getElementById(identificadorDivAccioMapa+contadorAccionsTransformades);
			if (divAccio)
			{
				imgAccio = divAccio.querySelector(`img[id^=${idImgSvgAccioMapa}]`);
				arrayIdsImgAccions.push(imgAccio.id);
			}
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
	let storyLayer = getFinestraLayer(window, "storyMap");
	const imgTransparent = storyLayer.querySelector("img[name=" + imgEspaiBlancNom + "]");
	if (imgTransparent)
	{	
		const boundingRectWindow = storyLayer.getBoundingClientRect();
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
var iAccio = 0;
function AfegeixMarkerStoryMapVisible()
{
	var div=getFinestraLayer(window, "storyMap");
	iAccio = 0;
	AfegeixMarkerANodesFillsStoryMapVisible(div, div.childNodes);
}

const imgRelatAccio = "storymap_mm_action";
//Els tags "vendor specific" han de començar per "data-" https://www.w3schools.com/tags/att_data-.asp
function AfegeixMarkerANodesFillsStoryMapVisible(div, nodes)
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
					// Afegim un Id per al Div que conté el paràgraf afectat per l'acció:
					node.setAttribute("id", identificadorDivAccioMapa+iAccio);
					// Afegim la imatge d'acció:
					var divNode = document.createElement("span");
					divNode.innerHTML=DonaTextImgGifSvg(idImgSvgAccioMapa + iAccio, imgRelatAccio, "storymap_action", 14, GetMessage("ActionOnMap", "storymap"), null);
					iAccio++;
					node.insertBefore(divNode, node.children[0]);
					break;
				}
			}
		}
		if (node.childNodes && node.childNodes.length)
		{
			AfegeixMarkerANodesFillsStoryMapVisible(div, node.childNodes);
		}
	}
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
	var div=getFinestraLayer(window, "storyMap");
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
	
	GUFCreateStorymapWithReproducibleUsage([{title: relatACompartir.desc, code: urlServidor.host, codespace: ParamCtrl.ServidorLocal}],
			{abstract: relatACompartir.desc, specific_usage: GetMessage("ShareStorymap", "storymap"),
			ru_code: relatFragDoc.textContent, ru_code_media_type: "text/html",
			ru_platform: ToolsMMN, ru_version: VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers, ru_schema: config_schema_storymap}, ParamCtrl.idioma, "");
}

var imgSvgIconaSincroMapa;

function CreaImatgeMarcadorSincronismeMapa(divRef)
{
	if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
	{
		var cdns=[];
		cdns.push("<img align=\"absmiddle\" src=\"", AfegeixAdrecaBaseSRC("storymap_action.gif"), "\" name=\"", nomPuntSincr, "\" ",
			"width=\"", (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.ncol) ? ParamCtrl.BarraEstil.ncol : 23, "\" ",
			"height=\"", (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.nfil) ? ParamCtrl.BarraEstil.nfil : 22, "\" ", "alt=\"", GetMessage("SyncWithMap", "storymap"), "\" title=\"", GetMessage("SyncWithMap", "storymap"), "\" >");
		divRef.insertAdjacentHTML("afterbegin", cdns.join(""));
	}
	else
	{
		if (imgSvgIconaSincroMapa)
		{
			const svgClone = imgSvgIconaSincroMapa.cloneNode(true);
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