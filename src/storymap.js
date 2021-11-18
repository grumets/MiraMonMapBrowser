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

//Mostra la finestra que conté el llistat d'històries
function MostraFinestraTriaStoryMap()
{
	if (!ObreFinestra(window, "triaStoryMap"))
		return;
	OmpleFinestraTriaStoryMap(window, "triaStoryMap");
}

//Omple la finestra amb el llistat d'històries (i mostra la imatge(s) de pre-visualització de la història).
function OmpleFinestraTriaStoryMap(win, name)
{
var cdns=[], storyMap, i_story;

	cdns.push("<br>",
		GetMessage("SelectStory", "storymap"), ":" ,
						"<br>");
		for (i_story=0; i_story<ParamCtrl.StoryMap.length; i_story++)
		{
			cdns.push("<img align='middle' src='",(ParamCtrl.StoryMap[i_story].src)?ParamCtrl.StoryMap[i_story].src:AfegeixAdrecaBaseSRC("1griscla.gif"),"' height='100' width='150'>",
							"<a href=\"javascript:void(0)\" onclick=\"IniciaStoryMap(", i_story, ");\">",
							"<br>",
							ParamCtrl.StoryMap[i_story].desc,
							"</a><br><br>");
		}
	contentFinestraLayer(win, name, cdns.join(""));
}

//Inicia una Storymap
function IniciaStoryMap(i_story)
{
 			loadFile(ParamCtrl.StoryMap[i_story].url, "text/html", CreaStoryMap, /*alert,*/ i_story);
			//Mode Pantalla Completa en iniciar la història:
			//openFullscreen(document.documentElement);
			//Desplaçar finestra a l'esquerra de la pantalla quan Mode Pantalla Completa: PENDENT
}

//Crea Storymap
function CreaStoryMap(text_html, extra_param)
{
var i_story=extra_param, elem;

			elem=getFinestraLayer(window, "storyMap")
			elem.innerHTML=text_html;

			ObreFinestra(window, "storyMap")
			darrerNodeStoryMapVisibleExecutat=null;
			ExecutaAttributsStoryMapVisible();
}

function isScrolledIntoView(el) {

    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

var darrerNodeStoryMapVisibleExecutat=null;

function RecorreNodesFillsAttributsStoryMapVisible(nodes)
{
var hihacanvis, node, attribute, i_styles
	for (var i = 0; i < nodes.length; i++)
	{
		node=nodes[i];
		if (node.nodeType!=Node.ELEMENT_NODE)
			continue;
		if (!isScrolledIntoView(node))
			continue;
		hihacanvis=false;

		if (node.attributes)
		{
			for (var i_at = 0; i_at < node.attributes.length; i_at++)
			{
				attribute=node.attributes[i_at];
				if (attribute.name=="mm-center")
				{
					var mmcenter = attribute.value.trim();
					if (mmcenter.length)
					{
						var punt;
						try {
							punt=JSON.parse(mmcenter);
						}
						catch (e) {
							alert(GetMessage("WrongFormat_mm_center_Parameter", "storymap") + ": " + e + ". " +
										GetMessage("ParameterValueFoundIs", "storymap") + ": "  + mmcenter);
							break;
						}
						if (0==CommandMMNSetCenterCoord(punt))
							hihacanvis=true;
					}
					else
						alert(GetMessage("WrongFormat_mm_center_Parameter", "storymap"));
				}
				else if (attribute.name=='mm-zoom')
				{
					if (attribute.value.trim().length)
					{
						if (0==CommandMMNSetZoom(parseFloat(attribute.value.trim())))
							hihacanvis=true;
					}
				}
				else if (attribute.name=="mm-layers")
				{
					for (i_styles = 0; i_styles < node.attributes.length; i_styles++)
					{
						if (node.attributes[i_styles].name=="mm-styles")
							break;
					}
					CommandMMNSetLayersAndStyles(attribute.value.trim(), 
							(i_styles == node.attributes.length) ? null : node.attributes[i_styles].value.trim(), 
							"mm-layers");
					hihacanvis=true;
				}
				else if (attribute.name=="mm-time")
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
							alert(GetMessage("WrongFormat_mm_time_Parameter", "storymap") + ": " + e + ". "+
										GetMessage("ParameterValueFoundIs", "storymap") + ": " + mmtime);
							break;
						}
						if (0==CommandMMNSetChangeDateTime(datejson))
							hihacanvis=true;
					}
				}
			}
			if (hihacanvis)
			{
				if (darrerNodeStoryMapVisibleExecutat==node)
					return true;
				darrerNodeStoryMapVisibleExecutat=node;
				RepintaMapesIVistes();
				return true;
			}
		}
		if (node.childNodes && node.childNodes.length)
		{
			if (RecorreNodesFillsAttributsStoryMapVisible(node.childNodes))
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
	RecorreNodesFillsAttributsStoryMapVisible(div.childNodes);
	timerExecutaAttributsStoryMapVisible=null;
}
