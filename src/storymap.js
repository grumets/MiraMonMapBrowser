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
const pngMIMETType = "image/png", jpgMIMEType = "image/jpg", jpegMIMEType = "image/jpeg";


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
const novaStoryMap = {};
var comptadorPassos = 0;
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

function CarregaImatgeStoryMap(input, tinyEditId, ultimElemId) 
{
	const fitxerObjectiu = input.files ? input.files[0] : null;

	if (fitxerObjectiu &&  (fitxerObjectiu.type == pngMIMETType || fitxerObjectiu.type == jpgMIMEType || fitxerObjectiu.type == jpegMIMEType))
	{
		const canvasId = "reduccioImatges";
		let canvasReduccioImg = document.getElementById(canvasId);
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

			let ultimElem = document.getElementById(ultimElemId);
			if (!canvasReduccioImg)
			{
				canvasReduccioImg = document.createElement("canvas");
				canvasReduccioImg.setAttribute("id", canvasId);
				
				if (ultimElem)
				{
					canvasReduccioImg.insertAdjacentElement("afterend", ultimElem);
				}
			} 

			canvasReduccioImg.width = result.width/2;
			canvasReduccioImg.height = result.height/2;

			const cntx = canvasReduccioImg.getContext("2d");
			cntx.drawImage(result, 0, 0, result.width/2, result.height/2);
			const tinyEditor = tinymce.get(tinyEditId);
			const imatgeReduida = canvasReduccioImg.toDataURL("image/jpeg", 0.5);
			
			if (tinyEditor && imatgeReduida)
			{
				let writenOnTiny = tinyEditor.getContent();
				tinyEditor.setContent(writenOnTiny + "<br><br><img src='" + imatgeReduida + "' width= 400>");
			}
		});
	}
}

function SeguentPasStoryMap()
{
	if (comptadorPassos == 0)
	{
		GuardarInformacioInicialStoryMap()
	}
	else 
	{
		GuardarInformacioPasStoryMap()
	}
	comptadorPassos++;
	const novaStoryMapFinestra = getFinestraLayer(window, "creaStoryMap");
	novaStoryMapFinestra.replaceChildren();
	const stepPictureId = "stepImg" + comptadorPassos;
	const tinyTextId = "storyTextArea"+comptadorPassos;
	const ultimElementStorymapId = "ultimElementStorymap";
	const htmlNextStep = ["<div id='stepStoryMap", comptadorPassos, "'>",
	"<input id='imgStep", comptadorPassos, "' type='file' align='center' accept='.jpg,.jpeg,.png' onChange='CarregaImatgeStoryMap(this, \"" + tinyTextId + "\", \"" + ultimElementStorymapId + "\")'>", 
	"<img id='" + stepPictureId + "' alt='", GetMessage("StorymapImage", "storymap"), "'/><br><br>", 
	"<input id='" + ultimElementStorymapId + "' type='button' value='", GetMessage("Next"), "' onClick='SeguentPasStoryMap()'><br><br>", "<input type='button' value='", GetMessage("End"), "' onClick='FinalitzarStoryMap()'>"];
	novaStoryMapFinestra.innerHTML = htmlNextStep.join("");

	// Creo aquest textarea fora de l'string "htmlNextStep" per a que l'eina tinymce el detecti i el pugui substituir
	const tinytextarea = document.createElement("textarea");
	tinytextarea.setAttribute("id", tinyTextId)
	const imgStep = document.getElementById(stepPictureId);
	imgStep.parentNode.insertBefore(tinytextarea, imgStep);
	imgStep.parentNode.insertBefore(document.createElement("br"), imgStep);
	imgStep.parentNode.insertBefore(document.createElement("br"), imgStep);

	tinymce.init({
        target: tinytextarea,
		toolbar: 'insertImageButton',
		setup: (editor) => {
			editor.ui.registry.addButton('insertImageButton', {
				text: 'Attach Image',
				onAction: (_) => editor.insertContent(`&nbsp;<strong>It's my button!</strong>&nbsp;`)
			  });
		}
    });
}

function FinalitzarStoryMap()
{
	// Guardo l'últim pas definit en la StoryMap.
	GuardarInformacioPasStoryMap();

	const cdns = ["<html><h1>"+novaStoryMap.titol+"</h1><br>"];
	// Parsejar l'objecte novaStoryMap segons el format del htm de les altres Stories.
	for (let i_Story = 0, passosLength = novaStoryMap.passos.length; i_Story < passosLength; i_Story++) {
		const pas = novaStoryMap.passos[i_Story];
		cdns.push("<div data-mm-center='{\"x\":"+pas.x + ", \"y\":" + pas.y + "}' data-mm-zoom='"+ pas.zoom +"'>", pas.descripcio, pas.imatge ? "<br><img src='" + pas.imatge + "' width=400>" : "", "</div>");
	}
	cdns.push("</html>");
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

function GuardarInformacioPasStoryMap()
{
	if (novaStoryMap.passos == null)
		novaStoryMap.passos = [];
	const coordCentre = ObtenirCentre();
	novaStoryMap.passos.push({"imatge": document.getElementById("stepImg" + comptadorPassos).src, "descripcio": tinymce.get("storyTextArea"+comptadorPassos).getContent(), "x": (coordCentre && coordCentre.x)? coordCentre.x : 0, "y": (coordCentre && coordCentre.y)? coordCentre.y : 0,  "zoom": ParamInternCtrl.vista.CostatZoomActual});
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
	comptadorPassos = 0;
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
