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
//costat is a number
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
		alert(GetMessage("ZoomSizeNotAvailableBrowser", "commands"));
	return 1;
}

//crs is a string
function CommandMMNSetCRS(crs)
{
	ParamCtrl.araCanviProjAuto=false;
	var retorn=EstableixNouCRSEnv(crs, null);
	if (retorn==2)
	{
		alert(GetMessage("CRSNotAvailableBrowser", "commands"));
		return 1;
	}
	return retorn;
}

//punt is an object as deifned in config-schema/definitions/punt2D
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

//datejson is a json structure as defined in config-schema/definitions/data
function CommandMMNSetDateTime(datejson)
{
	var date=DonaDateDesDeDataJSON(datejson);
	SincronitzaCapesMillisegons(date.getTime());
	return 0;
}

//layers is an array of capa ids (strings)
//styles is an array of style ids (strings)
function CommandMMNSetLayersAndStyles(layers, styles)
{
	FesVisiblesNomesAquestesCapesAmbEstils(layers, styles, "CommandMMNSetLayersAndStyles");
	return 0;
}

/*layerdims=[{"ly": id, "dims": [clau: valor}]}]*/
function CommandMMNSetLayersExtraDimensions(layerdims)
{
	return CanviaDimensionsExtraDeCapes(layerdims, "CommandMMNSetLayerExtraDimensions");
}

function CommandMMNAddGeoJSONLayer(desc, geojson, attributes, estil, data)
{
	AfegeixCapaGeoJSON(NumeroDeCapesVolatils(-1), desc, geojson, attributes, estil, data);
	return 0;
}

function CommandMMNSelections(selections)
{
var sel, capa, estil, i_estil;

	for (var i_sel=0; i_sel<selections.length; i_sel++)
	{	
		sel=selections[i_sel];

		if(typeof sel.ly === 'undefined' || typeof sel.q === 'undefined' || typeof sel.id === 'undefined')
		{
			alert(GetMessage("SelectionsIncorrectFormat", "commands") + GetMessage("LyQNameRequired", "commands") + ": {ly: NomCapa, q: FormulaConsulta, id: IdEstilNou}");
				return 1;
		}
		if (null==(capa=DonaCapaDesDeIdCapa(sel.ly)))
			continue;

		estil=DonaEstilDesDeIdEstil(capa, sel.id);
		if (estil)
			i_estil=capa.estil.indexOf(estil);
		else
		{
			i_estil=DuplicaEstilCapa(capa, 0, sel.id);
			estil=capa.estil[i_estil];
		}
		
		if(capa.model==model_vector)
		{
			capa.attributes[sel.id]={"FormulaConsulta": sel.q,
						"desc": sel.id};
			estil.NomCampSel=sel.id;
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
	return 0;
}

//histos is an array of {ly: `IdCapa1`, stl: `IdStyle1`', type': `veure diagrama.tipus`, stat: `veure diagrama.stat`, order: `veure diagrama.order`}
function CommandMMNDiagrams(histos)
{
var histo, capa, estil, i_estil;

	TancaTotsElsHistogramaFinestra();
	for (var i_histo=0; i_histo<histos.length; i_histo++)
	{	
		histo=histos[i_histo];

		if(typeof histo.ly === 'undefined')
		{
			alert(GetMessage("HistogramsIncorrectFormat", "commands") + GetMessage("LyRequired", "commands") + ": {ly: 'IdCapa1', style: 'styleNom', type: 'diagramType', stat: 'statEnum', order: 'orderEnum'}");
				return 1;
		}
		if (null==(capa=DonaCapaDesDeIdCapa(histo.ly)))
			continue;

		estil=DonaEstilDesDeIdEstil(capa, histo.stl);
		if (estil)
		{
			i_estil=capa.estil.indexOf(estil);	
			capa.i_estil=i_estil; //Defineix el nou estil com estil actiu. Si no ho faig l'histograma no es veurà.
		}
		else
			i_estil=-1;  //estil actual

		if (capa.visible=="ara_no")  //si no faig la capa visible no funcionaran les estadistiques igualment.
			CanviaEstatVisibleCapa(ParamCtrl.capa.indexOf(capa), "si");

		ObreFinestraHistograma(ParamCtrl.capa.indexOf(capa), i_estil, histo.type, histo.stat, histo.order);
	}
	return 0;
}

function ExecuteSerializedCommandMMN(functionName, redibuixar, param1, param2, param3, param4, param5)
{
	var retorn;
	if (typeof window[functionName]==="function")
	{
		if (functionName=="CommandMMNSetZoom" || functionName=="CommandMMNSetCRS")
			retorn=window[functionName](param1);
		else if (functionName=="CommandMMNSetLayersAndStyles")
			retorn=window[functionName](param1, param2);
		else if (functionName=="CommandMMNAddGeoJSONLayer")
			//(desc, geojson, attributes, estil, data)
			retorn=window[functionName](param1, JSON.parse(param2), JSON.parse(param3), param4, JSON.parse(param5));
		else
		{
			try {
				var param1Obj=JSON.parse(param1);
			}
			catch (e) {
				alert(GetMessage("WrongFormatParameter")+ ": " + functionName + ". " + e + ". " +
						GetMessage("ParameterValueFoundIs", "storymap") + ": "  + param1);
				return 1;
			}
			retorn=window[functionName](param1Obj);
		}
		if (retorn==0 && redibuixar)
			RepintaMapesIVistes();
		return;
	}
	alert(functionName + " is not a recognized function name");
}