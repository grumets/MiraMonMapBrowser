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

function MostraFinestraCoord(event)
{
	showFinestraLayer(window, "coord");
	document.getElementById("llegenda_situacio_coord").innerHTML=DonaCadenaBotonsVistaLlegendaSituacioCoord();
	dontPropagateEvent(event);
}

function CreaCoordenades()
{
var cdns=[];

	var elem=getResizableLayer(window, "coord");
	if (elem)
	{
		cdns.push("<form name=\"form_coord\" onSubmit=\"return false;\" style=\"height: 100%;\">",
			"<table style=\"width: 100%; height: 100%;\"><tr>");
		if (!isFinestraLayer(window, "coord"))
		{
			cdns.push("<td style=\"width: 1px\"><span class=\"text_coord\">", (ParamCtrl.TitolCoord ? DonaCadena(ParamCtrl.TitolCoord) : "Coord: "),
				   "</span></td>");
			if (ParamCtrl.EstilCoord && ParamCtrl.EstilCoord=="area")
				cdns.push("</tr><tr>");
		}
		if (ParamCtrl.EstilCoord && ParamCtrl.EstilCoord=="area") 
			cdns.push("<td><fieldset class=\"input_info_coord\" name=\"info_coord\" style=\"width: 90%; margin-right:3%; min-height: ", ((isFinestraLayer(window, "coord")? "90%" : (elem.clientHeight-25)+"px")), ";resize: none;\" readonly=\"readonly\"></fieldset></td>");
		else
			cdns.push("<td><input class=\"input_info_coord\" type=\"text\" name=\"info_coord\" style=\"width: 97%;\" readonly=\"readonly\"></td>");
		cdns.push("</tr></table></form>");
		contentLayer(elem, cdns.join(""));
		elem.style.opacity=0.8;
		elem.style.backgroundColor="#FFFFFF";
	}
}

