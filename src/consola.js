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

var TipusEventGetMap=1;
var TipusEventGetFeatureInfo=2;
var TipusEventGetFeature=3;
var TipusEventGetCoverage=4;
var TipusEventDonaProjeccioConsultaTipica=5;
var TipusEventWMTSTile=6;
var TipusEventWMTSTileSOAP=7;
var TipusEventExecuteProces=8;
var TipusEventGetFeatureOfInterest=9;
var TipusEventGetObservation=10;
var TipusEventGetRecordByIdLlinatge=11;
var TipusEventFeatureInsertTransaction=12;
var TipusEventFeatureUpdateTransaction=13;
var TipusEventFeatureDeleteTransaction=14;

var EstarEventPendent=1;
var EstarEventError=2;
var EstarEventTotBe=3;

var EventConsola=[];
var i_EventConsola=0; //Actual d¡identificador perquè sepre augmenta i ningú el torna a posar mai a 0

function CreaIOmpleEventConsola(titol, i_capa, desc, tipus)
{
	var elem=getLayer(window, "consola_finestra");
	if(isLayer(elem))
	{
		EventConsola.push({"id": i_EventConsola,
						"titol": titol,
						"i_capa": i_capa,
						"desc": desc, 
						"tipus": tipus,
						"estat": EstarEventPendent,
						"timeRequest": new Date(),
						"timeResponse": null});
		i_EventConsola++;
		if (isLayerVisible(elem))
			OmpleFinestraConsola();
		return i_EventConsola-1;
	}
	return -1;
}

function CanviaEstatEventConsola(event, i_event, estat)
{
	if (i_event==-1)
		return;
	for (var i=EventConsola.length-1; i>=0; i--)
	{
		if (EventConsola[i].id==i_event)
		{
			var elem=getLayer(window, "consola_finestra");
			EventConsola[i].estat=estat;
			EventConsola[i].timeResponse=new Date();
			if(isLayer(elem) && isLayerVisible(elem))
				OmpleFinestraConsola();
			return;
		}
	}
}

function MostraFinestraConsola()
{
	if (!ObreFinestra(window, "consola", DonaCadenaLang({"cat":"de veure els informes de la consola", 
							  "spa":"de ver los informes de la consola",
							  "eng":"of watching the reports in the console",
							  "fre":"pour regarder les rapports dans la console"})))
		return;
	OmpleFinestraConsola();
}

function OmpleFinestraConsola()
{
var cdns=[];
var temp, event_consola;
	cdns.push("<center><table border=0 width=95%><tr><td><font size=1><a href=\"javascript:void(0);\" onClick=\"EsborraTotIOmpleEventConsola();\">", 
				DonaCadenaLang({"cat":"Esborra-ho tot", "spa":"Borrar todo", "eng":"Delete all","fre":"Tout effacer"}),"</a><br>");
	for (var i=0; i<EventConsola.length; i++)
	{
		event_consola=EventConsola[i];
		temp=event_consola.desc;
		if (event_consola.tipus!=TipusEventDonaProjeccioConsultaTipica && ParamCtrl.capa[event_consola.i_capa].tipus=="TipusSOS" && ParamCtrl.capa[event_consola.i_capa].FormatImatge=="application/json")
		{
			//Afegeixo un nou paràmetre, perquè es pugui veure realment que la petició és JSON, ja que és va per la via HTTP_ACCEPT i això no es pot reproduir en un link
			temp=temp+"&responseFormat=application/json";
		}
		temp=temp.replace("<", "&lt;");
		temp=temp.replace(">", "&gt;");
		temp=temp.replace("\n", "<br>");			
		cdns.push("<b>", event_consola.titol);
		if (event_consola.tipus==TipusEventGetFeature || event_consola.tipus==TipusEventGetFeatureOfInterest || event_consola.tipus==TipusEventGetObservation)
		{
			if (ParamCtrl.capa[event_consola.i_capa].desc)
				cdns.push(" ", DonaCadena(ParamCtrl.capa[event_consola.i_capa].desc));
			else
				cdns.push(" ", ParamCtrl.capa[event_consola.i_capa].nom);
		}
		else if (event_consola.tipus==TipusEventDonaProjeccioConsultaTipica)
		{
			;
		}
		else
		{
			if (ParamCtrl.capa[event_consola.i_capa].desc)
				cdns.push(" ", DonaCadena(ParamCtrl.capa[event_consola.i_capa].desc));
			else
				cdns.push(" ", ParamCtrl.capa[event_consola.i_capa].nom);
		}
		cdns.push("</b> <small>layer " + event_consola.i_capa +"</small> (", DonaDateComATextISO8601(event_consola.timeRequest, {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true, "DataMostraSegon": true}), ")<br>",
			  "<i><a href=\"",temp,"\" target=\"_blank\">",temp,"</a></i><br>");
		if (event_consola.estat==EstarEventError)
			cdns.push("<font color=\"red\">Error</font>");
		else if (event_consola.estat==EstarEventTotBe)
			cdns.push("<font color=\"green\">Ok</font>");
		if ((event_consola.estat==EstarEventError || event_consola.estat==EstarEventTotBe) && event_consola.timeResponse)
			cdns.push(" ("+(event_consola.timeResponse.getTime() - event_consola.timeRequest.getTime()) +" ms)<br>");
		cdns.push("<br>");
	}
	cdns.push("</font></td></tr></table>");

	contentFinestraLayer(window, "consola", cdns.join(""));
}
