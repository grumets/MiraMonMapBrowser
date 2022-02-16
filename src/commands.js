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

    Aquest codi JavaScript ha estat idea de Joan Mas� Pau (joan maso at uab cat)
    amb l'ajut de Alba Brobia (a brobia at creaf uab cat)
    dins del grup del MiraMon. MiraMon �s un projecte del
    CREAF que elabora programari de Sistema d'Informaci� Geogr�fica
    i de Teledetecci� per a la visualitzaci�, consulta, edici� i an�lisi
    de mapes r�sters i vectorials. Aquest progamari programari inclou
    aplicacions d'escriptori i tamb� servidors i clients per Internet.
    No tots aquests productes s�n gratu�ts o de codi obert.

    En particular, el Navegador de Mapes del MiraMon (client per Internet)
    es distribueix sota els termes de la llic�ncia GNU Affero General Public
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
		alert(GetMessage("ZoomSizeIncorrectFormat", "commmands") + ":\n" + GetMessage("NumericalValueIsRequired", "commmands") +".");
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
		alert(GetMessage("CoordIncorrectFormat", "commands") + GetMessage("TwoNumericalValuesRequiredFormat", "commands") + ": {x: ##, y: ##}");
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

function CommandMMNSelections(selections)
{
var sel, capa, estil, i_estil;

	for (var i_sel=0; i_sel<selections.length; i_sel++)
	{	
		sel=selections[i_sel];

		if(typeof sel.ly === 'undefined' || typeof sel.q === 'undefined' || typeof sel.name === 'undefined')
		{
			alert(GetMessage("SelectionsIncorrectFormat", "commands") + GetMessage("LyQNameRequired", "commands") + ": {ly: NomCapa, q: FormulaConsulta, name: NomEstil}");
				return 1;
		}
		if (null==(capa=DonaCapaDesDeIdCapa(sel.ly)))
			continue;

		estil=DonaEstilDesDeNomEstil(capa, sel.name);
		if (estil)
			i_estil=capa.estil.indexOf(estil);
		else
		{
			i_estil=DuplicaEstilCapa(capa, 0, sel.name);
			estil=capa.estil[i_estil];
		}
		
		if(capa.model==model_vector)
		{
			for (var i_atr=0; i_atr<capa.atributs.length; i_atr++)
			{
				if(sel.name==capa.atributs[i_atr].nom)
					continue;
			}
			capa.atributs[i_atr]={"nom": sel.name,
						"FormulaConsulta": sel.q,
						"desc": sel.name};
			estil.NomCampSel=sel.name;
		}
		else
		{
			for (var i_c=0; i_c<estil.component.length; i_c++)
			{
				if (typeof estil.component[i_c].calcul!=="undefined" && estil.component[i_c].calcul!=null)
					delete estil.component[i_c].calcul;
				else if (typeof estil.component[i_c].FormulaConsulta!=="undefined" && estil.component[i_c].FormulaConsulta!=null)
					delete estil.component[i_c].FormulaConsulta;
				else //if (typeof estil.component[i_c].i_valor!=="undefined")
					delete estil.component[i_c].i_valor;
				estil.component[i_c].FormulaConsulta=sel.q;
			}
		}
		if (capa.visible=="ara_no")
			CanviaEstatVisibleCapa(ParamCtrl.capa.indexOf(capa), "si");

		//Defineix el nou estil com estil actiu
		capa.i_estil=i_estil;
	}
}