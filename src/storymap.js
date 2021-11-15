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
		DonaCadenaLang({"cat":"Selecciona una història", "spa":"Selecciona una historia", "eng":"Select a story", "fre":"Sélectionnez une histoire"}), ":" ,
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
	var hihacanvis;
	for (var i = 0; i < nodes.length; i++)
	{
		if (nodes[i].nodeType!=Node.ELEMENT_NODE)
			continue;
		if (!isScrolledIntoView(nodes[i]))
			continue;
		hihacanvis=false;

		if (nodes[i].attributes)
		{
			for (var i_at = 0; i_at < nodes[i].attributes.length; i_at++)
			{
				if (nodes[i].attributes[i_at].name=="mm-center")
				{
					var mmcenter = nodes[i].attributes[i_at].value.trim();
					if (mmcenter.length)
					{
						var punt;
						try {
							punt=JSON.parse(mmcenter);
						}
						catch (e) {
							alert(DonaCadenaLang({"cat":"Format del paràmetre mm-center incorrecte:  ", "spa":"Formato del parametro mm-center icnorrecto:  ", "eng":"Wrong format in mm-center parameter:  ", "fre":"Format incorrect dans le paramètre mm-center:  "}) + e +
										DonaCadenaLang({"cat":". El valor del paràmetre indicat és:", "spa":". El valor del parámetro indicado es:", "eng":". The parameter value found is:", "fre":". La valeur de paramètre trouvée est:"}) + mmcenter);
							break;
						}
						if (0==CommandMMNSetCenterCoord(punt))
							hihacanvis=true;
					}
					else
						alert(DonaCadenaLang({"cat":"Format del paràmetre mm-center incorrecte", "spa":"Formato del parametro mm-center icnorrecto", "eng":"Wrong format in mm-center parameter", "fre":"Format incorrect dans le paramètre mm-center"}));
				}
				else if (nodes[i].attributes[i_at].name=='mm-zoom')
				{
					if (nodes[i].attributes[i_at].value.trim().length)
					{
						if (0==CommandMMNSetZoom(parseFloat(nodes[i].attributes[i_at].value.trim())))
							hihacanvis=true;
					}
				}
				else if (nodes[i].attributes[i_at].name=="mm-layer")
				{
					// Index capa
				}
				else if (nodes[i].attributes[i_at].name=="mm-style")
				{
					// Estil capa
				}
				else if (nodes[i].attributes[i_at].name=="mm-time")
				{
					var datejson;
					var mmtime = nodes[i].attributes[i_at].value.trim();
					if (mmtime.length)
					{
						try
						{
							datejson=JSON.parse(mmtime);
						}
						catch (e)
						{
							alert(DonaCadenaLang({"cat":"Format del paràmetre mm-time incorrecte:  ", "spa":"Formato del parámetro mm-time icnorrecto:  ", "eng":"Wrong format in mm-time parameter:  ", "fre":"Format incorrect dans le paramètre mm-time:  "}) + e +
										DonaCadenaLang({"cat":". El valor del paràmetre indicat és:", "spa":". El valor del parámetro indicado es:", "eng":". The parameter value found is:", "fre":". La valeur de paramètre trouvée est:"}) + mmtime);
							break;
						}
						if (0==CommandMMNSetChangeDateTime(datejson))
							hihacanvis=true;						
					}
				}
			}
			if (hihacanvis)
			{
				if (darrerNodeStoryMapVisibleExecutat==nodes[i])
					return true;
				darrerNodeStoryMapVisibleExecutat=nodes[i];
				RepintaMapesIVistes();
				return true;
			}
		}
		if (nodes[i].childNodes && nodes[i].childNodes.length)
		{
			if (RecorreNodesFillsAttributsStoryMapVisible(nodes[i].childNodes))
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

