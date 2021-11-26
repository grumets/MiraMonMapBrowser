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

//----

function CommandMMNSetZoom(costat)
{
	if (isNaN(costat))
	{
		alert(GetMessage("ZoomSizeFormatIncorrect", "commmands") + ":\n" + GetMessage("NumericalValueIsRequired", "commmands") +".");
		return;
	}
	for (var nivell=0; nivell<ParamCtrl.zoom.length; nivell++)
	{
		if (ParamCtrl.zoom[nivell].costat==costat)
		{
			CanviaNivellDeZoom(nivell, false);
			return 0;
		}
	}
	if (nivell==ParamCtrl.zoom.length)
		alert(GetMessage("ZoomSizeRequestedNotAvailableBrowser", "commands"));
	return 1;
}

function CommandMMNSetCenterCoord(punt)
{
	if(typeof punt.x === 'undefined' || typeof punt.y === 'undefined' || isNaN(punt.x) || isNaN(punt.y))
	{
		alert(GetMessage("CoordFormatIncorrect", "commands") + GetMessage("TwoNumericalValuesRequiredFormat", "commands") + ": {x: ##, y: ##}");
			return 1;
	}
	CentraLaVista(punt.x, punt.y);
	return 0;
}

function CommandMMNSetDateTime(datejson)
{
	var date=DonaDateDesDeDataJSON(datejson);
	SincronitzaCapesMillisegons(date.getTime());
	return 0;
}

function CommandMMNSetLayersAndStyles(layers, styles)
{
	FesVisiblesNomesAquestesCapesAmbEstils(layers, styles, "CommandMMNSetLayersAndStyles");
	return 0;
}
