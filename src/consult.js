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

//1.- XML

//Valors de l'estat de la consulta
var EstatAjaxXMLInit=0x01;
var EstatXMLOmplert=0x02;
var EstatXMLTrobatsZero=0x04;
var EstatErrorXMLNoNodes=0x08;
var EstatErrorXMLTipusDesconegut=0x10;

function DonamRespostaConsultaXMLComAText(root)
{
	return root.text;
}//Fi de DonamRespostaConsultaXMLComAText()

function CanviaRepresentacioCaractersProhibitsXMLaCaractersText(cadena)
{
	cadena=cadena.replace(/&amp;/ig, "&");
	cadena=cadena.replace(/&quot;/ig, "\"");
	cadena=cadena.replace(/&apos;/ig, "\'");
	cadena=cadena.replace(/&lt;/ig, "<");
	cadena=cadena.replace(/&gt;/ig, ">");
	return cadena;
}

function CanviaRepresentacioCaractersProhibitsPerAtributXML(cadena)
{
	cadena=cadena.replace(/&/gi, "&amp;");
	cadena=cadena.replace(/\"/gi, "&quot;");
	cadena=cadena.replace(/\'/gi, "&apos;");
	cadena=cadena.replace(/</gi, "&lt;");
	cadena=cadena.replace(/>/gi, "&gt;");
	return cadena;
}

function OmpleRespostaConsultaXML(doc, consulta)
{
var root;
var text_sortida;
var tag, tag2;
var i, j, z;
var nom, descripcio, valor, unitats, separador, descLink;
var n_fills_NODATA;
var esNODATA, esLink, esImatge;

	if(!doc)
	{
		consulta.estat=EstatErrorXMLNoNodes;
		return 1;
	}
	root=doc.documentElement;
	if(root)
	{
		var arrel;
		if(root.tagName=="soap:Envelope")
		{
			//NJ
			arrel=root.getElementsByTagName('FeatureInfoResponse')[0];
			if(arrel==null)
			{
				consulta.estat=EstatErrorXMLTipusDesconegut;
				return 1;
			}
		}
		else if(root.tagName=="FeatureInfoResponse")
		{
			arrel=root;
		}
		else
		{
			consulta.estat=EstatErrorXMLTipusDesconegut;
			return 1;
		}
		if(arrel.hasChildNodes())
		{
			var i_capa_validar=-1;
			if(Accio && Accio.accio&AccioValidacio && Accio.capes)
			{
				for(i=0; i<Accio.capes.length; i++)
				{
					if(Accio.capes[i]==consulta.capa.nom)
					{
						i_capa_validar=i;
						break;
					}
				}
			}
			for(i=0; i<arrel.childNodes.length; i++)
			{
				tag=arrel.childNodes[i];
				if(tag.tagName!="FIELDS")
					continue;
				for(j=0; j<tag.attributes.length; j++)
				{
					if(i_capa_validar!=-1 && tag.attributes[j].name==Accio.camps[i_capa_validar])
					{
						Accio.valors[i_capa_validar]=tag.attributes[j].value;

						/* NJ_02_06_2017: Segons el W3schools
						DOM 4 Warning
						In the W3C DOM Core, the Attr (attribute) object inherits all properties and methods from the Node object.
						In DOM 4, the Attr object no longer inherits from Node.
						For future code quality, you should avoid using node object properties and methods on attribute objects:
						On algunes d'aquestes propietats és el nodeValue que passa a ser value.
						nodeName passa a ser name.
						Compte que això només és per attributtes elements */

					}
					consulta.Atribut[consulta.Atribut.length]={"nom": tag.attributes[j].name,
										"descripcio": tag.attributes[j].name,
										"valor": tag.attributes[j].value,
										"unitats": null,
										"mostrar": "si",
										"esNODATA": false,
										"separador": null,
										"esLink": false,
										"descLink": null,
										"esImatge": false};
				}
				for(j=0; j<tag.childNodes.length; j++)
				{
					if(tag.childNodes[j].nodeName!="FIELD")
						continue;

					nom=null; descripcio=null; valor=null; unitats=null;
					esNODATA=false;	separador=null; esLink=false; descLink=null;
					esImatge=false;

					tag2=tag.childNodes[j];
					for (z=0; z<tag2.attributes.length; z++)
					{
						if(tag2.attributes[z].name=="value")
							valor=tag2.attributes[z].value;
						else if(tag2.attributes[z].name=="name")
							nom=tag2.attributes[z].value;
						if(tag2.attributes[z].name=="title")
							descripcio=tag2.attributes[z].value;
						else if(tag2.attributes[z].name=="units")
							unitats=tag2.attributes[z].value;
						else if(tag2.attributes[z].name=="is_NODATA")
						{
							if(tag2.attributes[z].value=="yes")
							{
								esNODATA=true;
								n_fills_NODATA++;
							}
						}
						else if(tag2.attributes[z].name=="separator")
						{
							separador=tag2.attributes[z].value;
							separador=CanviaRepresentacioCaractersProhibitsXMLaCaractersText(separador);
						}
						else if(tag2.attributes[z].name=="is_link")
						{
							if(tag2.attributes[z].value=="yes")
								esLink=true;
						}
						else if(tag2.attributes[z].name=="desc_link")
						{
							descLink=tag2.attributes[z].value;
						}
						else if(tag2.attributes[z].name=="is_image")
						{
							if(tag2.attributes[z].value=="yes")
								esImatge=true;
						}
					}
					if(valor)
					{
						consulta.Atribut[consulta.Atribut.length]={"nom": nom,
										"descripcio": descripcio,
										"valor": valor,
										"unitats": unitats,
										"mostrar": "si",
										"esNODATA": esNODATA,
										"separador": separador,
										"esLink": esLink,
										"descLink": descLink,
										"esImatge": esImatge};
						if(i_capa_validar!=-1 && nom==Accio.camps[i_capa_validar])
							Accio.valors[i_capa_validar]=valor;
					}
				}

			}
			//Haig de calcular si tots els atributs són NODATA i si és aixì
			//consulta.estat=EstatXMLTrobatsZero;
			n_fills_NODATA=0;
			for(i=0; i<consulta.Atribut.length; i++)
			{
				if(consulta.Atribut[i].esNODATA==true)
					n_fills_NODATA++;
			}
			if(n_fills_NODATA==consulta.Atribut.length)
				consulta.estat=EstatXMLTrobatsZero;
			else
				consulta.estat=EstatXMLOmplert;
		}
		else
			consulta.estat=EstatXMLTrobatsZero;
		return 0;
	}
	else
	{
		consulta.estat=EstatErrorXMLNoNodes;
		return 1;
	}
}//Fi de OmpleRespostaConsultaXML()

function OmpleRespostaConsultaGeoJSON(doc, consulta)
{
var i, j;

	if (doc.type!="FeatureCollection" || !doc.features)
	{
		consulta.estat=EstatXMLTrobatsZero;
		return 1;
	}

	for(i=0; i<doc.features.length; i++)
	{
		if (!doc.features[i].properties)
			continue;

		for (j in doc.features[i].properties)
		{
			consulta.Atribut.push({"nom": j,
						"descripcio": j,
						"valor": doc.features[i].properties[j],
						"mostrar": "si",
						"unitats": null,
						"esNODATA": false,
						"separador": null,
						"esLink": false,
						"descLink": null,
						"esImatge": false});
		}
	}
	if (consulta.Atribut.length==0)
		consulta.estat=EstatXMLTrobatsZero;
	else
		consulta.estat=EstatXMLOmplert;

	return 0;
}//Fi de OmpleRespostaConsultaGeoJSON()


function MostraConsultaComHTML(consulta)
{
	if(consulta)
	{
		var cdns=[];
		var elem=getLayer(consulta.win, consulta.nom_layer);
		cdns.push("<span class='TitolRepostaConsulta'>",
			(DonaCadena(ParamCtrl.capa[consulta.i_capa].desc) ? DonaCadena(ParamCtrl.capa[consulta.i_capa].desc) : (DonaCadena(ParamCtrl.capa[consulta.i_capa].DescLlegenda) ? DonaCadena(ParamCtrl.capa[consulta.i_capa].DescLlegenda): ParamCtrl.capa[consulta.i_capa].nom )),
			(ParamCtrl.capa[consulta.i_capa].AnimableMultiTime? " "+DonaDataCapaComATextBreu(consulta.i_capa, null) : ""),
			"</span><hr size=\"2\">");

		if(consulta.estat==EstatXMLOmplert)
		{
			if(consulta.Atribut.length>0)
			{
				var i_capa_validar=-1;
				if(Accio && Accio.accio&AccioValidacio && Accio.capes)
				{
					for(var i=0; i<Accio.capes.length; i++)
					{
						if(Accio.capes[i]==consulta.capa.nom)
						{
							i_capa_validar=i;
							break;
						}
					}
				}
				for(var i=0; i<consulta.Atribut.length; i++)
				{
					if(consulta.Atribut.mostrar=="no")
						continue;
					if(consulta.Atribut.mostrar=="si_ple" && (typeof consulta.Atribut[i].valor === "undefined" || consulta.Atribut[i].valor==null || consulta.Atribut[i].valor==""))
						continue;
					cdns.push(MostraConsultaAtributComHTML(consulta.i_capa, 0, i, consulta.Atribut[i], consulta.Atribut[i].separador, consulta.Atribut[i].valor, i_capa_validar, true));
				}
				contentLayer(elem, cdns.join(""));
				//Com posar la serieTemporal aquí? Tot depen de com vinguin els valors. Tal com està ara hi ha un valor per cada atribut o sigui no anem bé.
			}
			else
				removeLayer(elem);
		}
		else
		{
			var s;
			if(cdns.length>0)
			{
				cdns.push(consulta.text);
				s=cdns.join("");
			}
			else
				s=consulta.text;
			contentLayer(elem, s);
		}
		return 0;
	}
	else
		return 1;
}//Fi de MostraConsultaComHTML()

function HiHaCapesConsultablesNoActives()
{
	for (var i=0; i<ParamCtrl.capa.length; i++)
	{
		if(ParamCtrl.capa[i].consultable=="ara_no")
			return true;
	}
	return false;
}

function OmpleRespostaConsultaNoHiHaDadesSiCal(win)
{
	if(NConsultesZero==NCapesConsultables && NConsultesDigiZero==NCapesDigiConsultables)
	{
	  	var s;
		// Totes les capes tenien 0 objectes trobats --> S'han destruit totes les layers
   	  	if(ParamCtrl.TipusConsulta=="IncrustadaDeCop")
			s=getcontentFinestraLayer(win, "multi_consulta", s);
	  	else //Consulta en finestra
	  		s=getContentLayer(getLayer(win, "multi_consulta"), s);
	 	s+="<center><div class=\"layerresposta\">" +
	 	   GetMessage("NoDataForRequestedPoint", "consult")+
		   (HiHaCapesConsultablesNoActives() ? " " + GetMessage("andActiveQueryableLayers", "consult") : "" )+
	  	   "</div></center>";
	  	if(ParamCtrl.TipusConsulta=="IncrustadaDeCop")
	  		contentFinestraLayer(win, "multi_consulta", s);
	  	else
	  		contentLayer(getLayer(win, "multi_consulta"), s);
	}
}

function OmpleRespostaConsultaXMLiEscriuEnHTML(doc, consulta)
{
	if (IsXMLMimeType(consulta.capa.FormatConsulta) || consulta.capa.FormatConsulta=="application/json")
	{
		if (consulta.capa.FormatConsulta=="application/json")
			OmpleRespostaConsultaGeoJSON(doc, consulta);
		else
			OmpleRespostaConsultaXML(doc, consulta);

		if (consulta.estat==EstatXMLTrobatsZero)
		{
			NConsultesZero++;
			removeLayer(getLayer(consulta.win, consulta.nom_layer));
		}
		else
			MostraConsultaComHTML(consulta);
	}
	else
	{
		contentLayer(getLayer(consulta.win, consulta.nom_layer),
			"<span class='TitolRepostaConsulta'>"+
			(DonaCadena(ParamCtrl.capa[consulta.i_capa].desc) ? DonaCadena(ParamCtrl.capa[consulta.i_capa].desc) : (DonaCadena(ParamCtrl.capa[consulta.i_capa].DescLlegenda) ? DonaCadena(ParamCtrl.capa[consulta.i_capa].DescLlegenda): ParamCtrl.capa[consulta.i_capa].nom ))+
			(ParamCtrl.capa[consulta.i_capa].AnimableMultiTime? " "+DonaDataCapaComATextBreu(consulta.i_capa, null) : "")+
			"</span><hr size=\"2\">" + "<span class='ValorRespostaConsulta'>" +
			((consulta.capa.FormatConsulta=="text/html") ? "" : "<pre>") +
			doc +
			((consulta.capa.FormatConsulta=="text/html") ? "" : "/<pre>") +
			"</span>");
	}
	OmpleRespostaConsultaNoHiHaDadesSiCal(consulta.win)
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventTotBe);

}//Fi de OmpleRespostaConsultaXMLiEscriuEnHTML()

function ErrorRespostaConsultaXMLiEscriuEnHTML(doc, consulta)
{
	if (IsXMLMimeType(consulta.capa.FormatConsulta))
	{
		NConsultesZero++;
		removeLayer(getLayer(consulta.win, consulta.nom_layer));
	}
	else
	{
		contentLayer(getLayer(consulta.win, consulta.nom_layer),
		"<span class='TitolRepostaConsulta'>"+
		(DonaCadena(ParamCtrl.capa[consulta.i_capa].desc) ? DonaCadena(ParamCtrl.capa[consulta.i_capa].desc) : (DonaCadena(ParamCtrl.capa[consulta.i_capa].DescLlegenda) ? DonaCadena(ParamCtrl.capa[consulta.i_capa].DescLlegenda): ParamCtrl.capa[consulta.i_capa].nom ))+
		(ParamCtrl.capa[consulta.i_capa].AnimableMultiTime? " "+DonaDataCapaComATextBreu(consulta.i_capa, null) : "")+
		"</span><hr size=\"2\">" + "<span class='ValorRespostaConsulta'></span>");
	}
	OmpleRespostaConsultaNoHiHaDadesSiCal(consulta.win)
	CanviaEstatEventConsola(null, consulta.i_event, EstarEventError);

}//Fi de ErrorRespostaConsultaXMLiEscriuEnHTML()


function FesPeticioAjaxConsulta(win)
{
var s, resposta_consulta_xml, env_icones, env_icona, punt={}, cal_transformar, url, i, capa, tipus, i_simb, i_simbol;

	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.model==model_vector)
			continue;
		if (EsCapaConsultable(i) && !capa.valors)
		{
			resposta_consulta_xml={"capa": capa, "i_capa": i, "win": win, "nom_layer": "LayerConsulta"+i, "estat": EstatAjaxXMLInit, "Atribut": [], "text": ""};

			if(DonaTipusServidorCapa(capa)=="TipusWMTS_SOAP")
				FesRequestGetFeatureInfoSOAP(resposta_consulta_xml);
			else
			{
				//ajax[i]=new Ajax();
				//ajax[i].doGet(DonaRequestGetFeatureInfo(i, true), OmpleRespostaConsultaXMLiEscriuEnHTML, "text/xml", resposta_consulta_xml);
				s=DonaRequestGetFeatureInfo(i, true);
				resposta_consulta_xml.i_event=CreaIOmpleEventConsola("GetFeatureInfo", i, s, TipusEventGetFeatureInfo);
				if (capa.FormatConsulta=="application/json")
					loadJSON(s, OmpleRespostaConsultaXMLiEscriuEnHTML, ErrorRespostaConsultaXMLiEscriuEnHTML, resposta_consulta_xml);
				else
					loadFile(s, capa.FormatConsulta, OmpleRespostaConsultaXMLiEscriuEnHTML, ErrorRespostaConsultaXMLiEscriuEnHTML, resposta_consulta_xml);
			}
		}
	}


	// Ara model==model_vector
	for (i=0; i<RespostaConsultaObjDigiXML.length; i++)
		NCapesDigiConsultables++;

	for (i=0; i<RespostaConsultaObjDigiXML.length; i++)
	{
		//ajax_consulta_capa_digi[i]=new Ajax();
		capa=ParamCtrl.capa[RespostaConsultaObjDigiXML[i].i_capa];
		tipus=DonaTipusServidorCapa(capa);
		if ((tipus=="TipusWFS" || tipus=="TipusOAPI_Features") && capa.estil[capa.i_estil].simbols && capa.estil[capa.i_estil].simbols.length)
		{
			cal_transformar=DonaCoordenadaPuntCRSActual(punt, capa.objectes.features[RespostaConsultaObjDigiXML[i].i_obj], capa.CRSgeometry)
			i_simbol=DeterminaISimbolObjecteCapaDigi(PuntConsultat.i_nova_vista, capa, RespostaConsultaObjDigiXML[i].i_obj, 0, PuntConsultat.i, PuntConsultat.j);
			if (i_simbol==-1)
				env_icones={"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300};
			else
				env_icones=DonaEnvIcona(punt, capa.estil[capa.i_estil].simbols[0].simbol[i_simbol].icona);
			for (i_simb=1; i_simb<capa.estil[capa.i_estil].simbols.length; i_simb++)
			{
				i_simbol=DeterminaISimbolObjecteCapaDigi(PuntConsultat.i_nova_vista, capa, RespostaConsultaObjDigiXML[i].i_obj, i_simb, PuntConsultat.i, PuntConsultat.j);
				if (i_simbol==-1)
					continue;
				env_icona=DonaEnvIcona(punt,
						capa.estil[capa.i_estil].simbols[i_simb].simbol[i_simbol].icona);
				if (env_icones.MinX>env_icona.MinX)
					env_icones.MinX=env_icona.MinX;
				if (env_icones.MaxX<env_icona.MaxX)
					env_icones.MaxX=env_icona.MaxX;
				if (env_icones.MinY>env_icona.MinY)
					env_icones.MinY=env_icona.MinY;
				if (env_icones.MaxY<env_icona.MaxY)
					env_icones.MaxY=env_icona.MaxY;
			}
			if(cal_transformar)
			{
				//Transformo l'envolupant al sistema de referència de la capa
				env_icones=TransformaEnvolupant(env_icones, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRSgeometry);
			}
			url=DonaRequestGetFeature(RespostaConsultaObjDigiXML[i].i_capa, env_icones, null, true);
			if(tipus=="TipusOAPI_Features")
				RespostaConsultaObjDigiXML[i].i_event=CreaIOmpleEventConsola("OAPI_Features", RespostaConsultaObjDigiXML[i].i_capa, url, TipusEventGetFeature);
			else
				RespostaConsultaObjDigiXML[i].i_event=CreaIOmpleEventConsola("GetFeature", RespostaConsultaObjDigiXML[i].i_capa, url, TipusEventGetFeature);
		}
		else if (tipus=="TipusSOS")
		{
			url=DonaRequestGetObservation(RespostaConsultaObjDigiXML[i].i_capa, RespostaConsultaObjDigiXML[i].i_obj, null);
			RespostaConsultaObjDigiXML[i].i_event=CreaIOmpleEventConsola("GetObservation", RespostaConsultaObjDigiXML[i].i_capa, url, TipusEventGetObservation);
		}
		else if (tipus=="TipusSTA" || tipus=="TipusSTAplus")
		{
			url=DonaRequestSTAObservationsFeatureOfInterest(RespostaConsultaObjDigiXML[i].i_capa, RespostaConsultaObjDigiXML[i].i_obj, null);
			RespostaConsultaObjDigiXML[i].i_event=CreaIOmpleEventConsola("STA Observations", RespostaConsultaObjDigiXML[i].i_capa, url, TipusEventGetObservation);
		}
		//ajax_consulta_capa_digi[i].doGet();
		//loadFile(url, "text/xml", OmpleCapaDigiAmbPropietatsObjecteDigitalitzat, ErrorCapaDigiAmbPropietatsObjecteDigitalitzat, RespostaConsultaObjDigiXML[i]);
		if (capa.FormatImatge=="application/json" || tipus=="TipusSTA" || tipus=="TipusSTAplus")
			loadJSON(url, OmpleCapaDigiAmbPropietatsObjecteDigitalitzat, ErrorCapaDigiAmbPropietatsObjecteDigitalitzat, RespostaConsultaObjDigiXML[i]);
		else
			loadFile(url, capa.FormatConsulta, OmpleCapaDigiAmbPropietatsObjecteDigitalitzat, ErrorCapaDigiAmbPropietatsObjecteDigitalitzat, RespostaConsultaObjDigiXML[i]);
	}
}//Fi de FesPeticioAjaxConsultaObjDigi()


var pop_down_no_esborra_cons=false;

function PopDownFinestra_multi_consulta()
{
	pop_down_no_esborra_cons=true;
	ParamCtrl.TipusConsulta="IncrustadaDeCop";
	afegeixBotoABarraFinestraLayer(window, "multi_consulta", boto_pop_up);
 	showFinestraLayer(window, "multi_consulta");
	setTimeout("CreaConsulta(window, 0);",30);
}

function PopUpFinestra_multi_consulta()
{
	hideFinestraLayer(window, "multi_consulta");
	ParamCtrl.TipusConsulta="FinestraDeCop";
	if (ConsultaWindow==null || ConsultaWindow.closed)
	{
		ConsultaWindow=window.open(ParamCtrl.PlantillaConsulta.src,"FinestraConsulta",'toolbar=no,status=no,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width='+ParamCtrl.PlantillaConsulta.ample+',height='+ParamCtrl.PlantillaConsulta.alt);
		ShaObertPopUp(ConsultaWindow);
	}
	else
	{
		CreaConsulta(ConsultaWindow, 0);
		ConsultaWindow.focus();
	}

}//Fi de PopUpFinestra_multi_consulta()


/*Aquesta funió sembla que no la crida ningú  (JM) 15-02-2016
(NJ 06-02-2017 Si que s'usa, es crida des de consulta_de_cop.htm)*/
function TancaFinestraEmergent_multi_consulta()
{
	if(pop_down_no_esborra_cons)
	{
		pop_down_no_esborra_cons=false;
		return;
	}
	if (typeof ParamCtrl.ICapaVolaPuntConsult !== "undefined")
	{
		TancaFinestra_multi_consulta();
		//ParamCtrl.capa[ParamCtrl.ICapaVolaPuntConsult].visible="no";
		//CreaVistes();
	}
}

//No usar sola. Useu TancaFinestraLayer("multi_consulta");
function TancaFinestra_multi_consulta()
{
	if (typeof ParamCtrl.ICapaVolaPuntConsult !== "undefined")
	{
		var elem, i_vista;
		ParamCtrl.capa[ParamCtrl.ICapaVolaPuntConsult].visible="no";
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			if (EsCapaVisibleEnAquestaVista(i_vista, ParamCtrl.ICapaVolaPuntConsult))
			{
				elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+ParamCtrl.ICapaVolaPuntConsult);
				if(isLayer(elem))
					removeLayer(elem);
			}
		}
		//var elem=getLayer(window, "l_obj_digi"+ParamCtrl.ICapaVolaPuntConsult+"_"+0);
		//if(isLayer(elem))
		//	removeLayer(elem);
		//hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa+ParamCtrl.ICapaVolaPuntConsult));
	}
}//Fi de TancaFinestra_multi_consulta()

var ConsultaCopiaSerieTemporalMostrat=false;

function ConsultaCopiaSerieTemporal(i_capa, i_obj, i_atr)
{
var cdns=[], capa, feature, atribut, atr;

	IniciaCopiaPortapapersFinestra(ConsultaWindow ? ConsultaWindow : window, "ConsultaDiv");

	capa=ParamCtrl.capa[i_capa];
	if (capa.objectes && capa.objectes.features && i_obj<capa.objectes.features.length)
		feature=capa.objectes.features[i_obj];
	else
		return false;
	atribut=capa.atributs[i_atr];

	cdns.push(GetMessage("Layer"), "\t", DonaCadena(capa.desc), "\n");
	//cdns.push(DonaCadenaLang({"cat": "Objecte", "spa": "Objecto", "eng": "Feature", "fre": "Feature"}), "\t", i_obj, "\n");

	for(var i=0; i<capa.atributs.length; i++)
	{
		atr=capa.atributs[i];
		if(atr.mostrar=="no" || atr.serieTemporal)
			continue;
		cdns.push((DonaCadena(atr.descripcio) ? DonaCadena(atr.descripcio) : atr.nom), "\t", DeterminaTextValorAtributObjecteDataCapaDigi(PuntConsultat.i_nova_vista, capa, i_obj, i, i_data, PuntConsultat.i, PuntConsultat.j));
		if (atr.unitats)
			cdns.push("\t", atr.unitats);
		cdns.push("\n");
	}

	cdns.push(GetMessage("Date"), "\t", DonaCadena(atribut.descripcio));
	if (atribut.unitats)
		cdns.push(" (", atribut.unitats, ")");
	cdns.push("\n");
	for (var i_data=0; i_data<capa.data.length; i_data++)
		cdns.push(DonaDataCapaComATextBreu(i_capa, i_data), "\t", DeterminaTextValorAtributObjecteDataCapaDigi(PuntConsultat.i_nova_vista, capa, i_obj, i_atr, i_data, PuntConsultat.i, PuntConsultat.j), "\n");

	FinalitzaCopiaPortapapersFinestra(ConsultaWindow ? ConsultaWindow : window, "ConsultaDiv", cdns.join(""),
			ConsultaCopiaSerieTemporalMostrat ? null : GetMessage("ChartValueCopiedClipboardFormat", "consult") + " " + GetMessage("tabSeparatedText")+". (" + GetMessage("MessagesNotDisplayedAgain", "consult")+")");
	ConsultaCopiaSerieTemporalMostrat=true;

	return false;
}

function MostraConsultaAtributComHTML(i_capa, i_obj, i_atr, atribut, separador, valor, i_capa_validar, cal_class)
{
var cdns=[], ncol=440, nfil=220;

	if(separador)
		cdns.push(DonaCadena(separador));

	if (cal_class)
	{
		if (i_capa_validar!=-1 && atribut.nom==Accio.camps[i_capa_validar])
			cdns.push("<span class='CampRespostaConsultaValidacio'>");
		else
			cdns.push("<span class='CampRespostaConsulta'>");
	}
	else
		cdns.push("<b>");

	cdns.push((DonaCadena(atribut.descripcio) ? DonaCadena(atribut.descripcio) : atribut.nom ));

	if(atribut.unitats)
		cdns.push("(" , atribut.unitats, ")");
	cdns.push(": ");

	if (cal_class)
	{
		if (i_capa_validar!=-1 && atribut.nom==Accio.camps[i_capa_validar])
			cdns.push("</span><span class='ValorRespostaConsultaValidacio'>");
		else
			cdns.push("</span><span class='ValorRespostaConsulta'>");
	}
	else
		cdns.push("</b>")

	if(typeof valor !== "undefined" && valor!=null)
	{
		if(atribut.FormatVideo)
		{
			if (valor)
			{
				if(atribut.esLink)
					cdns.push("<a href='",valor,"' target='_blank'>", GetMessage("Link"),"</a>");
				cdns.push("<br>");
				cdns.push("<video controls width='320'>",
						"<source src='", valor, "' type='", atribut.FormatVideo, "'>",
						"Your browser does not support a video tag",
					"</video>");
			}
		}
		if(atribut.esImatge)
		{
			if (valor)
			{
				cdns.push("<br>");
				if(atribut.esLink)
					cdns.push("<a href='",valor,"' target='_blank'>");
				cdns.push("<img src='",	valor,"' border='0' align='bottom' style='max-width: 320;'>");
				if(atribut.esLink)
					cdns.push("</a><br>");
			}
		}
		else if (atribut.esLink)
	 	{
			cdns.push("<a href='",valor,"' target='_blank'>",
				(atribut.descLink ? atribut.descLink: valor),
				"</a>");
		}
		else
			cdns.push(valor);
	}
	cdns.push((cal_class ? "</span>": ""), "<br>");

	if (atribut.serieTemporal)
	{
		if (cal_class)
		{
			cdns.push("<span class='ValorRespostaConsulta' class='invisiblewhenprint'>",
				"<a href=\"javascript:void(0);\" onClick=\"(opener) ? opener.ConsultaCopiaSerieTemporal(", i_capa, ", ", i_obj, ", ", i_atr, ") : ConsultaCopiaSerieTemporal(", i_capa, ", ", i_obj, ", ", i_atr, ")\">", GetMessage("CopySeriesValues", "consult"), "</a><br>",
				"</span>");
		}
		cdns.push("<div style=\"width: ", ncol, "px;height: ", nfil, "px;\"><canvas id=\"", "canvas_cnsl_serie", i_capa, "_", i_obj, "_", i_atr, "\" width=\"", ncol, "\" height=\"", nfil, "\"></canvas></div>");
	}

	return cdns.join("");
}


function MostraConsultaCapaDigitalitzadaComHTML(i_capa_digi, i_obj_digi, cal_titol_capa, cal_class)
{
var cdns=[], capa=ParamCtrl.capa[i_capa_digi], atributs=capa.atributs, feature, valor, atribut;
var separador=null;

	if(!capa.objectes || !capa.objectes.features || !capa.objectes.features[i_obj_digi].properties || CountPropertiesOfObject(capa.objectes.features[i_obj_digi].properties)==0)
		return "";
	if (cal_titol_capa)
	{
		cdns.push("<span class='TitolRepostaConsulta'>",
				(DonaCadena(capa.desc) ? DonaCadena(capa.desc) : (DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom )),
				"</span><hr size=\"2\">");
	}
	/* Pendent de fer
	if(capa.editable=="si")
	{
		cdns.push("<a href=\"EliminaPuntDesdeConsulta(", i_capa_digi,",", i_obj_digi,);\" onClick=\"EliminaPuntDesdeConsulta(", i_capa_digi,",", i_obj_digi, ");\">",
				DonaCadenaLang({"cat":"Esborrar l'objecte", "spa":"Borrar el objeto", "eng":"Delete the object","fre":"Supprimer l'objet"}),"</a><br><br>");
	}*/
	feature=capa.objectes.features[i_obj_digi];
	for (var i=0; i<atributs.length; i++)
	{
		atribut=atributs[i];
		if (atribut.separador && DonaCadena(atribut.separador))
			separador=atribut.separador;
		if(atribut.mostrar=="no")
			continue;
		valor=DeterminaTextValorAtributObjecteCapaDigi(PuntConsultat.i_nova_vista, capa, i_obj_digi, i, PuntConsultat.i, PuntConsultat.j);

		if(atribut.mostrar=="si_ple" && (typeof valor === "undefined" || valor==null || valor==""))
			continue;

		cdns.push(MostraConsultaAtributComHTML(i_capa_digi, i_obj_digi, i, atribut, separador, valor, -1, cal_class));
		if (separador)
			separador=null;
	}
	return cdns.join("");
}//Fi de function MostraConsultaCapaDigitalitzadaComHTML()

var RespostaConsultaObjDigiXML;

function IniciaFinestraConsulta(win)
{
var cdns=[], capa, capa2, hi_ha_capes_perfil=false, clic_sobre_elem_lineal=false, ncol=440, nfil=220, nfilCat=110;

	/*L'us del següent setTimeOut de 300 mseg i del setTimeOut de 30mseg que hi ha dins de PopDownFinestra_multi_consulta()
	  es necessari en Netscape per evitar 0x80040111 (NS_ERROR_NOT_AVAILABLE) [nsIXMLHttpRequest.status] (i potser també en els
	  altres navegadors). Això està explicat a: http://www.captain.at/howto-ajax-parent-opener-window-close-error.php*/
	if(ParamCtrl.TipusConsulta=="FinestraDeCop" && isFinestraLayer(window, "multi_consulta"))
		cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("pop_down.gif"),
				  "\" alt=\"pop down\" onClick=\"opener.PopDownFinestra_multi_consulta();setTimeout('window.close()', 300);\" align=\"right\" class=\"invisiblewhenprint\">");

	cdns.push("<center>",
		(Accio && Accio.accio&AccioValidacio) ?
		    ("<div align=\"left\" class=\"TextValidacio\">" +
		     GetMessage("FollowingCoordinateSelected", "consult") +
		     ":</div>") : "",
		"<div align=\"center\" id=\"LayerPuntConsulta\" class=\"layerpuntconsultat\">",
		"<b>", GetMessage("Point"),"</b>",
		 (DonaValorDeCoordActual(PuntConsultat.x,PuntConsultat.y,true,false)), "</div>");

	if(Accio && Accio.accio&AccioValidacio)
	{
	   //Actualitzo el punt consultat
	   Accio.coord.x=PuntConsultat.x;
	   Accio.coord.y=PuntConsultat.y;

	   cdns.push("<div align=\"left\" class=\"TextValidacio\"><ul><li>",
		     GetMessage("IfCorrectValidateIt", "consult"),
			 "<br>",  GetMessage("BrowserClosedReturnForm", "consult"),
		     "<br><br><li>", GetMessage("IfIncorrectClicksViewAgain", "consult"),
		     "</ul><form name=\"Validar\" onSubmit=\"return false;\"><input type=\"button\" value=\"",
		     GetMessage("ValidateCoordinate", "consult"),
		     (ParamCtrl.TipusConsulta=="IncrustadaDeCop" ?
			     " onClick=\"EnviarRespostaAccioValidacio(true);\"> <input type=\"button\" value=\"" :
			     " onClick=\"opener.EnviarRespostaAccioValidacio(true);\"> <input type=\"button\" value=\""),
		     GetMessage("Cancel"),
     		     (ParamCtrl.TipusConsulta=="IncrustadaDeCop" ?
			     " onClick=\"EnviarRespostaAccioValidacio(false);\"></form></div>" :
			     " onClick=\"opener.EnviarRespostaAccioValidacio(false);\"></form></div>"));
	}

	NConsultesDigiZero=NCapesDigiConsultables=0;
	RespostaConsultaObjDigiXML=[];

	NConsultesZero=NCapesConsultables=0;
	for (var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.model==model_vector)
		{
			if(!capa.objectes || !capa.objectes.features)
				continue;
			for(var j=0; j<capa.objectes.features.length; j++)
			{
				if (EsObjDigiConsultable(i,j))
				{
					if(!capa.objectes.features[j].properties || CountPropertiesOfObject(capa.objectes.features[j].properties)==0)
					{
						cdns.push("<div align=\"left\" id=\"LayerObjDigiConsulta",i,"_",j,"\" class=\"layerresposta\">",
						   "<span class='TitolRepostaConsulta'>",
						   (DonaCadena(capa.desc) ? DonaCadena(capa.desc) : (DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom )),
						   "</span><br>",(GetMessage("WaitingForData", "consult")),"...</div>");

						RespostaConsultaObjDigiXML[RespostaConsultaObjDigiXML.length]={"i_capa": i, "i_obj": j, "win": win /*, "nom_layer"="LayerObjDigiConsulta"+i+"_"+j*/};
					}
					else
					{
						cdns.push("<div align=\"left\" id=\"LayerObjDigiConsulta",i,"_",j,"\" class=\"layerresposta\">", MostraConsultaCapaDigitalitzadaComHTML(i, j, true, true),"</div>");
						if (!clic_sobre_elem_lineal && (capa.objectes.features[j].geometry.type=="MultiLineString" || capa.objectes.features[j].geometry.type=="LineString"))
							clic_sobre_elem_lineal=true;
						NCapesDigiConsultables++;
					}
				}
			}
		}
		else
		{
			if (!EsCapaConsultable(i))
				continue;

			NCapesConsultables++;
			//capa=ParamCtrl.capa[i]; Ja s'ha fet abans
			if (capa.valors)
			{
				if (HiHaDadesBinariesPerAquestaCapa(PuntConsultat.i_nova_vista, i))
				{
					if (capa.estil[capa.i_estil].component.length==1)
						hi_ha_capes_perfil=true;
					var v=DonaValorEstilComATextDesDeValorsCapa(PuntConsultat.i_nova_vista, i, DonaValorsDeDadesBinariesCapa(PuntConsultat.i_nova_vista, capa, null, PuntConsultat.i, PuntConsultat.j, false));
					if (v=="")
						NConsultesZero++;
					else
					{
						cdns.push("<div align=\"left\" id=\"LayerConsulta",i,"\" class=\"layerresposta\">");
						cdns.push("<span class='TitolRepostaConsulta'>",
							(DonaCadena(capa.desc) ? DonaCadena(capa.desc) : (DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom )),
							(capa.AnimableMultiTime? " "+DonaDataCapaComATextBreu(i, null) : ""),
							"</span><hr size=\"2\"><span class='CampRespostaConsulta'>", DonaDescripcioValorMostrarCapa(i, false), "</span>: <span class='ValorRespostaConsulta'>", v, "</span>");
						cdns.push("</div>");
					}
				}
				else
					NConsultesZero++;
			}
			else
			{
				cdns.push("<div align=\"left\" id=\"LayerConsulta",i,"\" class=\"layerresposta\">");
				cdns.push("<b>",
						(DonaCadena(capa.desc) ? DonaCadena(capa.desc) : (DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom )) ,
						(capa.AnimableMultiTime? " "+DonaDataCapaComATextBreu(i, null) : ""),
						"</b><br>", GetMessage("WaitingForData", "consult"));
				cdns.push("...</div>");
			}
		}
	}
	cdns.push("</center>",
		DonaTextDivCopiaPortapapersFinestra("ConsultaDiv"));

	var s=cdns.join("");
	if(ParamCtrl.TipusConsulta=="IncrustadaDeCop")
	{
	    contentFinestraLayer(win, "multi_consulta", s);
	    if(ConsultaWindow && ConsultaWindow.closed==false)
			ConsultaWindow.close();
	}
	else //if(ParamCtrl.TipusConsulta=="FinestraDeCop")
	    contentLayer(getLayer(win, "multi_consulta"), s);

	//Determino si cal pintar series temporals
	for (var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.model==model_vector)
		{
			if(!capa.objectes || !capa.objectes.features || !capa.atributs)
				continue;
			for (var a=0; a<capa.atributs.length; a++)
			{
				if (capa.atributs[a].serieTemporal)
					break;
			}
			if (a<capa.atributs.length)  //hi ha com a mínim un atribut amb series temporals
			{
				for(var j=0; j<capa.objectes.features.length; j++)
				{
					if (EsObjDigiConsultable(i,j) && capa.objectes.features[j].properties && CountPropertiesOfObject(capa.objectes.features[j].properties)>0)
					{
						for (var a=0; a<capa.atributs.length; a++)
						{
							if (capa.atributs[a].serieTemporal)
								MostraGraficSerieTemporalAtribut(win, "canvas_cnsl_serie_" + i + "_" + j + "_" + a, i, j, a);
						}
					}
				}
			}
		}
	}

	if (clic_sobre_elem_lineal && hi_ha_capes_perfil)
	{
		for (var i=0; i<ParamCtrl.capa.length; i++)
		{
			capa=ParamCtrl.capa[i];
			if (capa.model==model_vector)
			{
				if(!capa.objectes || !capa.objectes.features)
					continue;
				for(var j=0, k=0; j<capa.objectes.features.length; j++)
				{
					if ((capa.objectes.features[j].geometry.type=="MultiLineString" || capa.objectes.features[j].geometry.type=="LineString") &&
						EsObjDigiConsultable(i,j))
					{
						k++;
						//Determino la bateria de punts per l'objecte en questió.
						var v_c;
						var vista=DonaVistaDesDeINovaVista(PuntConsultat.i_nova_vista);
						var perfil=DonaArrayCoordsPerfilDeLineString(DonaGeometryCRSActual(capa.objectes.features[j], capa.CRSgeometry).coordinates, ParamInternCtrl.vista.CostatZoomActual);

						for (var i_coord=0; i_coord<perfil.coord.length; i_coord++)
						{
							perfil.coord[i_coord].i=Math.round((perfil.coord[i_coord].x-vista.EnvActual.MinX)/vista.CostatZoomActual);
							perfil.coord[i_coord].j=Math.round((vista.EnvActual.MaxY-perfil.coord[i_coord].y)/vista.CostatZoomActual);
							if (perfil.coord[i_coord].i<0 || perfil.coord[i_coord].i>=vista.ncol || perfil.coord[i_coord].j<0 || perfil.coord[i_coord].j>=vista.nfil)
								perfil.coord[i_coord].i=perfil.coord[i_coord].j=null;
						}

						for (var i2=0; i2<ParamCtrl.capa.length; i2++)
						{
							capa2=ParamCtrl.capa[i2];
							if (capa2.model==model_vector || !EsCapaConsultable(i2))
								continue;

							if (capa2.valors && HiHaDadesBinariesPerAquestaCapa(PuntConsultat.i_nova_vista, i2) && capa2.estil[capa2.i_estil].component.length==1)
							{
								//Determino l'array de valors per a tots els punts
								for (var i_coord=0; i_coord<perfil.coord.length; i_coord++)
								{
									v_c=DonaValorEstilComArrayDesDeValorsCapa(PuntConsultat.i_nova_vista, i2, capa2.i_estil, DonaValorsDeDadesBinariesCapa(PuntConsultat.i_nova_vista, capa2, null, perfil.coord[i_coord].i, perfil.coord[i_coord].j, false));
									perfil.coord[i_coord].v=(perfil.coord[i_coord].i==null || v_c==null) ? null : v_c[0];
									if (capa2.estil[capa2.i_estil].categories)
										perfil.coord[i_coord].cat=DonaValorEstilComATextDesDeValorsCapa(PuntConsultat.i_nova_vista, i2, DonaValorsDeDadesBinariesCapa(PuntConsultat.i_nova_vista, capa2, null, perfil.coord[i_coord].i, perfil.coord[i_coord].j, false));
								}
								//Creo un canvas al final del valor de atribut que s'ha indicat abans
								win.document.getElementById("LayerConsulta"+i2).insertAdjacentHTML("beforeend", "<div style=\"width: " + ncol + "px;height: " + (capa2.estil[capa2.i_estil].categories ? nfilCat : nfil) + "px;\"><canvas id=\"" + "canvas_cnsl_perfil_" + i2 + "_" + i + "_" + j + "\" width=\"" + ncol + "\" height=\"" + (capa2.estil[capa2.i_estil].categories ? nfilCat : nfil) + "\"></canvas></div>");
								//Afegeixo el grafic del perfil
								MostraGraficPerfilConsula(win, "canvas_cnsl_perfil_" + i2 + "_" + i + "_" + j, capa2, perfil, GetMessage("ProfileTransversalCutQueriedLine", "consult") + " " + k + " " + GetMessage("ofTheLayer") + " " + (capa.estil[capa.i_estil].desc ? capa.estil[capa.i_estil].desc : capa.desc));
							}
						}
					}
				}
			}
		}
	}

	FesPeticioAjaxConsulta(win);
	OmpleRespostaConsultaNoHiHaDadesSiCal(win);
}

function MostraGraficSerieTemporalAtribut(win, nom_canvas, i_capa, i_obj, i_atr)
{
var capa=ParamCtrl.capa[i_capa], data=[], labels=[], temps=[], millisegons;

	for (var i_data=0; i_data<capa.data.length; i_data++)
	{
		millisegons=DonaDateDesDeDataJSON(capa.data[i_data]).getTime();
		data[i_data]={t:millisegons, y:parseFloat(DeterminaTextValorAtributObjecteDataCapaDigi(PuntConsultat.i_nova_vista, capa, i_obj, i_atr, i_data, PuntConsultat.i, PuntConsultat.j))};
		labels[i_data]=moment(millisegons);
		temps[i_data]=DonaDataCapaComATextBreu(i_capa, i_data);
	}
	CreaGraficSerieTemporalSimple(win.document.getElementById(nom_canvas), data, labels, temps, capa.atributs[i_atr].descripcio, capa.atributs[i_atr].serieTemporal.color, capa.FlagsData);
}

function MostraGraficPerfilConsula(win, nom_canvas, capa, perfil, titol_perfil)
{
var data=[], categories=[], labels=[], colors=[], i_color0;

	var estil=capa.estil[capa.i_estil];
	var paleta=estil.paleta;
	var colorsPaleta=(paleta && paleta.colors) ? paleta.colors : null;
	var ncolors=colorsPaleta ? colorsPaleta.length : 256;
	var estiramentPaleta=estil.component[0].estiramentPaleta;
	var a0=DonaFactorAEstiramentPaleta(estiramentPaleta, ncolors);
	var valor_min0=DonaFactorValorMinEstiramentPaleta(estiramentPaleta);

	for (var i_coord=0; i_coord<perfil.coord.length; i_coord++)
	{
		labels[i_coord]=OKStrOfNe(perfil.step*i_coord, ParamCtrl.NDecimalsCoordXY);
		i_color0=Math.floor(a0*(perfil.coord[i_coord].v-valor_min0));
		if (i_color0>=ncolors)
			i_color0=ncolors-1;
		else if (i_color0<0)
			i_color0=0;

		colors[i_coord]=(colorsPaleta) ? colorsPaleta[i_color0] : RGB(i_color0, i_color0, i_color0);
	}

	if (estil.categories)
	{
		for (var i_coord=0; i_coord<perfil.coord.length; i_coord++)
			categories[i_coord]=perfil.coord[i_coord].cat;
		CreaGraficPerfilCategoricSimple(win.document.getElementById(nom_canvas), categories, labels, colors, titol_perfil);
	}
	else
	{
		for (var i_coord=0; i_coord<perfil.coord.length; i_coord++)
			data[i_coord]=(typeof estil.component[0].NDecimals!=="undefined" && estil.component[0].NDecimals!=null) ? parseFloat(OKStrOfNe(perfil.coord[i_coord].v, estil.component[0].NDecimals)) : perfil.coord[i_coord].v;
		CreaGraficPerfilContinuSimple(win.document.getElementById(nom_canvas), data, labels, colors, titol_perfil);
	}
}

//2.- Tradicional
function CreaPuntConsultat(win)  //Escriu la coordenada del punt consultat.
{
    	if (!win)
		return;
	win.document.open();
	win.document.write("<html><body"+
				((parent.tools) ? " BGCOLOR=\"" + ParamCtrl.ColorFonsPlana + "\"" : "") +
	    	           " TOPMARGIN=\"0\" LEFTMARGIN=\"2\" MARGINWIDTH=\"2\" MARGINHEIGHT=\"2\">"+
			//"Punt consultat", "Punto consultado", "Queried point"
    	           "<PRE>"+GetMessage("Point") +": ("+
				   OKStrOfNe(PuntConsultat.x,ParamCtrl.NDecimalsCoordXY)+
				   ", "+
				   OKStrOfNe(PuntConsultat.y,ParamCtrl.NDecimalsCoordXY)+
				   ")</PRE>"+
				   "</html>");
	win.document.close();
}

function CreaBotonsConsulta(win, anterior, posterior)
{
var cdns=[];

	if (!win)
		return;
	win.document.open();

			cdns.push("<html><body bgcolor=",
							   ((parent.tools) ? "\"" + ParamCtrl.ColorFonsPlana + "\"" : "\"#D4D0C8\"") ,
							   " text=\"#000000\" BOTTOMMARGIN=\"0\" TOPMARGIN=\"0\" LEFTMARGIN=\"2\" MARGINWIDTH=\"2\" MARGINHEIGHT=\"2\">",
							   "<form METHOD=\"POST\"",
				   ((!parent.tools) ? " onSubmit=\"return parent.consult1.TancaCaixaConsulta();\"" : "") ,
							   "><center>");
			if (anterior)
				cdns.push("<input TYPE=\"button\" VALUE=\"",
					(GetMessage("PreviousLayer", "consult")),
					"\" onClick=\"((parent.tools)?CreaConsulta(parent, -1):parent.opener.CreaConsulta(parent, -1));\">");
			if (posterior)
				cdns.push("<input TYPE=\"button\" VALUE=\"",
					(GetMessage("NextLayer", "consult")),
					"\" onClick=\"((parent.tools)?CreaConsulta(parent, 1):parent.opener.CreaConsulta(parent, 1));\">");
			if (!parent.tools)
				cdns.push("&nbsp;&nbsp;&nbsp;<input TYPE=\"submit\" VALUE=\"",
				(GetMessage("Close")),"\">");
			cdns.push("</center></form></body></html>");
	win.document.write(cdns.join(""));
	win.document.close();
}

function CreaTitolConsulta(win, i_capa)  //Escriu el títol de la capa consultada
{
	if (!win)
		return;
	win.document.open();
	win.document.write("<html><body"+
					   ((parent.tools) ? " BGCOLOR=\"" + ParamCtrl.ColorFonsPlana + "\"" : "") +
							  " TOPMARGIN=\"0\" LEFTMARGIN=\"2\" MARGINWIDTH=\"2\" MARGINHEIGHT=\"2\"><pre><b>"+
					(DonaCadena(ParamCtrl.capa[i_capa].desc) ? DonaCadena(ParamCtrl.capa[i_capa].desc) : (DonaCadena(ParamCtrl.capa[i_capa].DescLlegenda) ? DonaCadena(ParamCtrl.capa[i_capa].DescLlegenda): ParamCtrl.capa[i_capa].nom )) +
					   "</b><hr><pre></BODY></html>");
	win.document.close();
}

function RedibuixaConsultaCapa(win, i_capa)
{
	win.location.href=DonaRequestGetFeatureInfo(i_capa, false);
}

function RedibuixaConsultaObjDigi(win)
{
var punt={};

	var capa=ParamCtrl.capa[IElemActual];  //CapaDigi
	DonaCoordenadaPuntCRSActual(punt, capa.objectes.features[ISubElem], capa.CRSgeometry);

	win.document.open();
	win.document.write("<html><body BOTTOMMARGIN=\"0\" TOPMARGIN=\"0\" LEFTMARGIN=\"2\" MARGINWIDTH=\"2\" MARGINHEIGHT=\"2\"><PRE><b>"+
			DonaCadena(capa.desc)+"</b><br>"+
			GetMessage("Point") +": ("+
			OKStrOfNe(punt.x,ParamCtrl.NDecimalsCoordXY)+
			", "+
			OKStrOfNe(punt.y,ParamCtrl.NDecimalsCoordXY)+
			")<br>"+
			MostraConsultaCapaDigitalitzadaComHTML(IElemActual, ISubElem, false, false)+
			"</PRE></html>");
	win.document.close();
}


var IElemActual=0;
var ISubElem=0;
function DonaElementConsultaSeguent(increment)
{
var n_elem=ParamCtrl.capa.length;
var i_elem2=IElemActual;
var i;

	if ((i_elem2<0 && increment<0) || (i_elem2>=n_elem && increment>0))
		return i_elem2;

	for (i_elem2+=increment; i_elem2<n_elem && i_elem2>=0; i_elem2+=increment)
	{
		if (ParamCtrl.capa && i_elem2<ParamCtrl.capa.length && ParamCtrl.capa[i_elem2].model==model_vector && ParamCtrl.capa[i_elem2].objectes && ParamCtrl.capa[i_elem2].objectes.features)  // és un objecte digitalitzat
		{
			for(var i_obj=0; i_obj<ParamCtrl.capa[i_elem2].objectes.features.length; i_obj++)
			{
				if (EsObjDigiConsultable(i_elem2, i_obj))
				{
					ISubElem=i_obj;
					return i_elem2;
				}
			}
		}
		else  // és una capa
		{
			if (EsCapaConsultable(i_elem2))
				break;
		}
	}
	return i_elem2;
}

function CreaConsulta(win, increment)
{
var n_elem=ParamCtrl.capa.length;

	if (ParamCtrl.TipusConsulta=="FinestraDeCop" ||ParamCtrl.TipusConsulta=="IncrustadaDeCop")
	/*Això no cal que ho torni a comprovar ja ho he fet a ConsultaSobreVista
	  (win==this || ParamCtrl.PlantillaConsulta))
	  i he modificat el TipusConsulta si calia */
	{
		IniciaFinestraConsulta(win);
		return;
	}

	if ((IElemActual<0 && increment<0) || (IElemActual>=n_elem && increment>0))
		return;

	if (increment==0)  //Estem al principi.
	{
		if (!parent.tools)
			document.title=GetMessage("Query") + "; " + DonaCadena(ParamCtrl.titol);
		CreaPuntConsultat(win.consulta_punt);
		IElemActual=-1;
		increment=1;
	}
	IElemActual=DonaElementConsultaSeguent(increment);
	if (IElemActual<n_elem && IElemActual>=0)
	{
		if (ParamCtrl.capa && IElemActual<ParamCtrl.capa.length)
			win.consulta_info.location.href="consult_obj_digi.htm";
		else
		{
			CreaTitolConsulta(win.consulta_titol, IElemActual);
			RedibuixaConsultaCapa(win.consulta_info, IElemActual);
		}
	}
	else
	    win.consulta_info.location.href=GetMessage("noconsul_htm", "consult");

	var anterior=true;
	var posterior=true;
	if (0>IElemActual || 0>DonaElementConsultaSeguent(-1))
		anterior=false;
	if (n_elem<=IElemActual || n_elem<=DonaElementConsultaSeguent(1))
		posterior=false;
	/*Això no es pot fer a un plana que no has creat tu. 07/07/2005
	if (parent.tools)
		win.consulta_info.document.body.bgColor=ParamCtrl.ColorFonsPlana;
	*/
	CreaBotonsConsulta(win.consulta_botons, anterior, posterior);
}

var ConsultaWindow=null;
//var i_capa_consulta=0;
var PuntConsultat={"i": 0, "j": 0, "x": 0.0, "y": 0.0, "i_nova_vista": -1};

function ConsultaSobreVista(event_de_click, i_nova_vista)
{
	PuntConsultat.i=DonaCoordIDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX)
	PuntConsultat.j=DonaCoordJDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY)

	PuntConsultat.x=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
	PuntConsultat.y=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
	PuntConsultat.i_nova_vista=i_nova_vista;

	if (ParamCtrl.IconaConsulta || ParamCtrl.IconaValidacio)
	{
		var cal_crear;
		var capa=ParamCtrl.capa[ParamCtrl.ICapaVolaPuntConsult];
		capa.objectes.features[0].geometry.coordinates[0]=PuntConsultat.x;
		capa.objectes.features[0].geometry.coordinates[1]=PuntConsultat.y;
		if (capa.visible=="no")  //Vol dir que CreaVistaImmediata no haurà creat la layer per contenir aquesta creuta de la consulta i s'ha de fer.
			cal_crear=true;
		else
			cal_crear=false;
		capa.visible="ara_no";

		if(Accio && Accio.accio&AccioValidacio && ParamCtrl.IconaValidacio)
		{
			capa.objectes.features[0].seleccionat=true;
			capa.visible="si";
		}
		else if (ParamCtrl.IconaConsulta)
		{
			capa.objectes.features[0].seleccionat=false;
			capa.visible="si";
		}
		if (cal_crear)
		{
			var elem;
			var zindex_temp;
			for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				insertContentLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_z_rectangle"), "beforeBegin", CreaCapaDigiLayer(ParamCtrl.VistaPermanent[i_vista].nom, i_nova_vista, ParamCtrl.ICapaVolaPuntConsult));
				//if (capa.visible!="si" && EsObjDigiVisibleAAquestNivellDeZoom(capa))
				OmpleVistaCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, DonaVistaDesDeINovaVista(i_nova_vista), ParamCtrl.ICapaVolaPuntConsult);
				//Canvio el Z order de les capes del tel i de l'slider del zoom.
				zindex_temp=getzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa"+ParamCtrl.ICapaVolaPuntConsult));
				elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_sliderzoom");
				if (elem)
				{
					//Poso l'slider a dalt de tot
					setzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa"+ParamCtrl.ICapaVolaPuntConsult), getzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_sliderzoom")));
					setzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_sliderzoom"), zindex_temp);
					zindex_temp=getzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa"+ParamCtrl.ICapaVolaPuntConsult));
				}
				//Poso el tel_tran per sobre de la capa de la consulta.
				setzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa"+ParamCtrl.ICapaVolaPuntConsult), getzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_tel_trans")));
				setzIndexLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_tel_trans"), zindex_temp);
			}
		}
		else
		{
			for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				//contentLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa"+ParamCtrl.ICapaVolaPuntConsult), DonaCadenaHTMLCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, i_nova_vista, ParamCtrl.ICapaVolaPuntConsult));
				//if (capa.visible!="si" && EsObjDigiVisibleAAquestNivellDeZoom(capa))
				OmpleVistaCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, DonaVistaDesDeINovaVista(i_nova_vista), ParamCtrl.ICapaVolaPuntConsult);
			}
		}
	}

	if (ParamCtrl.TipusConsulta=="IncrustadaDeCop" && isFinestraLayer(window, "multi_consulta")) //consulta incrustada en una layer del estil finestra
	{
		if(ParamCtrl.PlantillaConsulta)
   		     afegeixBotoABarraFinestraLayer(window, "multi_consulta", boto_pop_up);
		showFinestraLayer(window, "multi_consulta");
		CreaConsulta(window, 0);
	}
	else if (parent.consulta_info)  //Consulta incrustada en un frame
		CreaConsulta(parent, 0);
	else  //Cas normal, s'obre una finestre a part, multiconsulta o normal
	{
		if (ConsultaWindow==null || ConsultaWindow.closed)
		{
			if (ParamCtrl.TipusConsulta=="FinestraDeCop" && ParamCtrl.PlantillaConsulta)
			{
				ConsultaWindow=window.open(ParamCtrl.PlantillaConsulta.src,"FinestraConsulta",'toolbar=no,status=no,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width='+ParamCtrl.PlantillaConsulta.ample+',height='+ParamCtrl.PlantillaConsulta.alt);
			}
			else
			{
				ConsultaWindow=window.open("consulta.htm","FinestraConsulta",'toolbar=no,status=no,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=500,height=500');
				ParamCtrl.TipusConsulta="FinestraSeguentCapa";
			}
			ShaObertPopUp(ConsultaWindow);
		}
		else
		{
			CreaConsulta(ConsultaWindow, 0);
			ConsultaWindow.focus();
		}
	}
}

var ajaxConsultaSOAP=[];

function FesRequestGetFeatureInfoSOAP(resposta_consulta_xml)
{
var cdns=[], cdns_temp=[], s, servidor_temp, i_capa=resposta_consulta_xml.i_capa;

	var i_tile_matrix_set=DonaIndexTileMatrixSetCRS(i_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	if (i_tile_matrix_set==-1) return;

	var i_tile_matrix=OmpleMatriuVistaCapaTiled(i_capa, i_tile_matrix_set);
	if(i_tile_matrix==-1)
		return;
	//Determino el tile afectat i les coordenades d'aquest tile.
	var tile_col = floor_DJ((PuntConsultat.i+ParamCtrl.capa[i_capa].VistaCapaTiled.dx)/ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileWidth);
	var tile_row = floor_DJ((PuntConsultat.j+ParamCtrl.capa[i_capa].VistaCapaTiled.dy)/ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileHeight);
	var i=PuntConsultat.i+ParamCtrl.capa[i_capa].VistaCapaTiled.dx - tile_col*ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileWidth;
	var j=PuntConsultat.j+ParamCtrl.capa[i_capa].VistaCapaTiled.dy - tile_row*ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileHeight;
	tile_col+=ParamCtrl.capa[i_capa].VistaCapaTiled.ITileMin;
	tile_row+=ParamCtrl.capa[i_capa].VistaCapaTiled.JTileMin;

	//Creo la petició de GetTile en SOAP
	cdns.push("<?xml version=\"1.0\"?>\n",
			  "<soap:Envelope xmlns:soap=\"http://www.w3.org/2001/12/soap-envelope\" ",
			  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ",
			  "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" ",
			  "xsi:schemaLocation=\"http://www.w3.org/2001/12/soap-envelope http://www.w3.org/2001/12/soap-envelope.xsd\">\n",
			  "<soap:Body>\n",
			  "<GetFeatureInfo service=\"WMTS\" version=\"", DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])),"\"",
			  " xmlns=\"http://www.opengis.net/wmts/", DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])),"\">\n",
			  "<GetTile xmlns=\"http://www.opengis.net/wmts/", DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])),"\" ",
						"xmlns:ows=\"http://www.opengis.net/ows/1.1\" ",
						"xsi:schemaLocation=\"http://www.opengis.net/wmts/",DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])),
						" http://www.miramon.uab.cat/ogc/schemas/wmts/",
						DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])), "/wmtsGetTile_request.xsd\" ",
						"service=\"WMTS\" version=\"",DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])),"\">\n",
							"<Layer>",ParamCtrl.capa[i_capa].nom, "</Layer>\n");
	if (ParamCtrl.capa[i_capa].estil && ParamCtrl.capa[i_capa].estil.length>0)
	{
		cdns.push(			  "<Style>");
		if (ParamCtrl.capa[i_capa].estil[ParamCtrl.capa[i_capa].i_estil].nom)
			cdns.push(ParamCtrl.capa[i_capa].estil[ParamCtrl.capa[i_capa].i_estil].nom);
		cdns.push(			  "</Style>\n");
	}
	cdns.push(			  "<Format>", ParamCtrl.capa[i_capa].FormatImatge,"</Format>\n");

	if (ParamCtrl.capa[i_capa].AnimableMultiTime)
	{
			cdns.push(			"<DimensionNameValue name=\"TIME\">",
					  			DonaDataJSONComATextISO8601(ParamCtrl.capa[i_capa].data[DonaIndexDataCapa(ParamCtrl.capa[i_capa], i_data)], ParamCtrl.capa[i_capa].FlagsData),
								"</DimensionNameValue>\n");
	}
	cdns.push(			"<TileMatrixSet>",ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].nom,"</TileMatrixSet>\n",
						"<TileMatrix>",ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier,"</TileMatrix>\n",
						"<TileRow>",tile_row,"</TileRow>\n",
						"<TileCol>",tile_col,"</TileCol>\n",
					"</GetTile>\n",
					"<J>",j,"</J>\n",
					"<I>",i,"</I>\n",
					"<InfoFormat>",ParamCtrl.capa[i_capa].FormatConsulta,"</InfoFormat>\n",
					"</GetFeatureInfo>\n");
	//ServerToRequest
	if ( !DonaCorsServidorCapa(ParamCtrl.capa[i_capa]) &&
		location.host && DonaHost(DonaServidorCapa(ParamCtrl.capa[i_capa]).toLowerCase())!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
	{
		var s_host=DonaHost(ParamCtrl.ServidorLocal);
		var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
		if (s_host.toLowerCase()!=location.host.toLowerCase())
			servidor_temp=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal.substring(0,pos_host)+
							location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length));
		else
			servidor_temp=ParamCtrl.ServidorLocal;
		cdns.push(		"<ServerToRequest>",DonaNomServidorSenseCaracterFinal(DonaServidorCapa(ParamCtrl.capa[i_capa])),"</ServerToRequest>\n");
	}
	else
		servidor_temp=DonaNomServidorSenseCaracterFinal(DonaServidorCapa(ParamCtrl.capa[i_capa]));

	cdns.push(			"</soap:Body>\n",
				"</soap:Envelope>\n");
	s=cdns.join("");
	CreaIOmpleEventConsola("GetFeatureInfo WMTS-SOAP, tiled", i_capa, servidor_temp+"\n\n"+s, TipusEventWMTSTileSOAP);
	ajaxConsultaSOAP[i_capa]=new Ajax();
	ajaxConsultaSOAP[i_capa].doPost(servidor_temp, 'text/xml', s, OmpleRespostaConsultaXMLiEscriuEnHTML, 'text/xml', resposta_consulta_xml);

}//Fi de FesRequestGetFeatureInfoSOAP()

function DonaRequestGetFeatureInfo(i_capa, es_ajax)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];
var s;

	if (DonaTipusServidorCapa(capa)=="TipusWMTS_REST")
	{
		alert(GetMessage("NotImplementedYetRESTful", "consult"));
	}
	/*if (DonaTipusServidorCapa(capa)=="TipusGoogle_KVP")
	{
		alert(DonaCadenaLang({"cat":"No és possible en Google KVP",
							 "spa":"No es posible en Google KVP",
							 "eng":"It is not possible on Google KVP",
							 "fre":"Il n'est pas possible sur Google KVP"}));
	}*/
	else if (DonaTipusServidorCapa(capa)=="TipusWMTS_KVP" || DonaTipusServidorCapa(capa)=="TipusOAPI_MapTiles")
	{
		var i_tile_matrix_set=DonaIndexTileMatrixSetCRS(i_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (i_tile_matrix_set==-1) return;

		var i_tile_matrix=OmpleMatriuVistaCapaTiled(i_capa, i_tile_matrix_set);
		if(i_tile_matrix==-1) return;
		//Determino el tile afectat i les coordenades d'aquest tile.
		var tile_col = floor_DJ((PuntConsultat.i+capa.VistaCapaTiled.dx)/capa.VistaCapaTiled.TileMatrix.TileWidth);
		var tile_row = floor_DJ((PuntConsultat.j+capa.VistaCapaTiled.dy)/capa.VistaCapaTiled.TileMatrix.TileHeight);
		//var tile_col = floor_DJ((PuntConsultat.x - ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TopLeftPoint.x) / (ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.costat*ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileWidth));
		//var tile_row = floor_DJ((ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TopLeftPoint.y - PuntConsultat.x) / (ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.costat*ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileHeight));
		var i=PuntConsultat.i+capa.VistaCapaTiled.dx - tile_col*capa.VistaCapaTiled.TileMatrix.TileWidth;
		var j=PuntConsultat.j+capa.VistaCapaTiled.dy - tile_row*capa.VistaCapaTiled.TileMatrix.TileHeight;
		/*alert("i:" + i + " j:" + j + " PuntConsultat.i:" + PuntConsultat.i + " PuntConsultat.j:" + PuntConsultat.j +
			" dx:" + ParamCtrl.capa[i_capa].VistaCapaTiled.dx + " dy:" + ParamCtrl.capa[i_capa].VistaCapaTiled.dy +
			" tile_col:" + tile_col + " tile_row:" + tile_row +
			" TileWidth:" + ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileWidth + " TileHeight:" + ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix.TileHeight +
			" PuntConsultat.x:" + PuntConsultat.x + " PuntConsultat.y:" + PuntConsultat.y +
			" ITileMin:" + ParamCtrl.capa[i_capa].VistaCapaTiled.ITileMin +" JTileMin:" + ParamCtrl.capa[i_capa].VistaCapaTiled.JTileMin);
		*/
		tile_col+=capa.VistaCapaTiled.ITileMin;
		tile_row+=capa.VistaCapaTiled.JTileMin;
		if (DonaTipusServidorCapa(capa)=="TipusWMTS_KVP")
		{
			cdns.push("SERVICE=WMTS&VERSION=", DonaVersioComAText(DonaVersioServidorCapa(capa)), "&REQUEST=GetFeatureInfo&TileMatrixSet=" ,
				  capa.TileMatrixSet[i_tile_matrix_set].nom ,
				 "&TileMatrix=" , capa.VistaCapaTiled.TileMatrix.Identifier , "&TileRow=" , tile_row , "&TileCol=" , tile_col ,
				 "&LAYER=" , capa.nom ,
				 "&INFOFORMAT=" , capa.FormatConsulta ,
				 "&I=" , i , "&J=" , j);

			if (capa.AnimableMultiTime)
				cdns.push("&TIME=",DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, null)], capa.FlagsData));
			s=AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), (ParamCtrl.UsaSempreMeuServidor && ParamCtrl.UsaSempreMeuServidor) ? true : es_ajax);
		}
		else //if (tipus=="TipusOAPI_MapTiles")
		{
			var plantill;
			if (capa.TileMatrixSet[i_tile_matrix_set].URLTemplate)
				plantill=capa.TileMatrixSet[i_tile_matrix_set].URLTemplate+"/info?";
			else
				plantill="collections/{collectionId}/styles/{styleId}/map/tiles/{tileMatrixSetId}/{tileMatrix}/{tileRow}/{tileCol}/info?";

			plantill=plantill.replace("{collectionId}", capa.nom);
			if (capa.estil && capa.estil.length)
			{
				i_estil2=(i_estil==-1) ? capa.i_estil : i_estil;

				if (capa.estil[i_estil2].nom)
					plantill=plantill.replace("{styleId}", capa.estil[i_estil2].nom);
				else
					plantill=plantill.replace("{styleId}/", "default");
			}
			else
				plantill=plantill.replace("{styleId}/", "default");
			plantill=plantill.replace("{tileMatrixSetId}", capa.TileMatrixSet[i_tile_matrix_set].nom);
			plantill=plantill.replace("{tileMatrix}", capa.VistaCapaTiled.TileMatrix.Identifier);
			plantill=plantill.replace("{tileRow}", tile_row);
			plantill=plantill.replace("{tileCol}", tile_col);
			cdns.push(plantill);

			cdns.push("&fTile=",capa.FormatImatge,"&f=",capa.FormatConsulta, "&i=", i, "&j=", j) ;
			cdns.push(((capa.FormatImatge=="image/jpeg") ? "" : "&transparent=" + ((capa.transparencia && capa.transparencia!="opac")? "TRUE" : "FALSE")));
			if (capa.AnimableMultiTime)
				cdns.push("&datetime=",DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)], capa.FlagsData));
			s=AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), ParamCtrl.UsaSempreMeuServidor ? true : false, DonaCorsServidorCapa(capa));
		}
		//CreaIOmpleEventConsola("GetFeatureInfo WMTS-KVP, tiled", i_capa, s, TipusEventGetFeatureInfo);
	}
	else
	{
		if (DonaVersioServidorCapa(capa).Vers<1 || (DonaVersioServidorCapa(capa).Vers==1 && DonaVersioServidorCapa(capa).SubVers==0))
			cdns.push("WMTVER=");
		else
			cdns.push("SERVICE=WMS&VERSION=");
		cdns.push(DonaVersioComAText(DonaVersioServidorCapa(capa)), "&REQUEST=");

		if (DonaVersioServidorCapa(capa).Vers<1 || (DonaVersioServidorCapa(capa).Vers==1 && DonaVersioServidorCapa(capa).SubVers==0))
			cdns.push("feature_info&");
		else
			cdns.push("GetFeatureInfo&");

		cdns.push(AfegeixPartCridaComunaGetMapiGetFeatureInfo(i_capa, -1, false, ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil,
								ParamInternCtrl.vista.EnvActual, (capa.AnimableMultiTime ? DonaIndexDataCapa(capa, null) : 0 )));

		cdns.push("&QUERY_LAYERS=" , capa.nom , "&INFO_FORMAT=" , capa.FormatConsulta);

		if (DonaVersioServidorCapa(capa).Vers<1 || (DonaVersioServidorCapa(capa).Vers==1 && DonaVersioServidorCapa(capa).SubVers<2))
			cdns.push("&X=" , PuntConsultat.i , "&Y=" , PuntConsultat.j);
		else
			cdns.push("&I=" , PuntConsultat.i , "&J=" , PuntConsultat.j);

		if (ParamCtrl.idiomes.length>1)
			cdns.push("&LANGUAGE=", ParamCtrl.idioma);

		s=AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), (ParamCtrl.UsaSempreMeuServidor && ParamCtrl.UsaSempreMeuServidor) ? true : es_ajax);
	}
	return s;
}

function EsObjDigiConsultable(i_capa, i_obj)
{
var capa=ParamCtrl.capa[i_capa];

	//Quan no té atributs només retorno fals si és una capa estàtica, perquè sinó pot voler dir que haig de sol·licitar els atributs
	if(capa.consultable!="si" || !capa.objectes ||
		(!capa.tipus && (!capa.objectes.features || CountPropertiesOfObject(capa.objectes.features[i_obj].properties)==0)) ||
		capa.estil==null || !capa.estil.length)
	{
		return false;
	}

	if (capa.objectes.features[i_obj].geometry.type=="Point")
	{
		if (!capa.estil[capa.i_estil].simbols)
			return false;
		var env_icones={"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300}, env_icona, punt={}, icona, simbols, unitatsMetre=false, i_simbol;
		DonaCoordenadaPuntCRSActual(punt, capa.objectes.features[i_obj], capa.CRSgeometry);

		for (var i_simb=0; i_simb<capa.estil[capa.i_estil].simbols.length; i_simb++)
		{
			simbols=capa.estil[capa.i_estil].simbols[i_simb];
			i_simbol=DeterminaISimbolObjecteCapaDigi(PuntConsultat.i_nova_vista, capa, i_obj, i_simb, PuntConsultat.i, PuntConsultat.j);
			if (i_simbol==-1)
				continue;
			icona=simbols.simbol[i_simbol].icona;
			if (simbols.NomCampFEscala)
			{
				icona.fescala=DeterminaValorObjecteCapaDigi(PuntConsultat.i_nova_vista, capa, i_obj, i_simb, PuntConsultat.i, PuntConsultat.j, simbols.NomCampFEscala);
				if (typeof icona.fescala==="undefined" || isNaN(icona.fescala) || icona.fescala<=0)
					continue;
			}
			else
				icona.fescala=1;

			if (env_icones.MinX==+1e300)
				env_icones=DonaEnvIcona(punt, icona);
			else
			{
				env_icona=DonaEnvIcona(punt, icona);

				if (env_icones.MinX>env_icona.MinX)
					env_icones.MinX=env_icona.MinX;
				if (env_icones.MaxX<env_icona.MaxX)
					env_icones.MaxX=env_icona.MaxX;
				if (env_icones.MinY>env_icona.MinY)
					env_icones.MinY=env_icona.MinY;
				if (env_icones.MaxY<env_icona.MaxY)
					env_icones.MaxY=env_icona.MaxY;
			}
			if (icona.unitats=="m")
				unitatsMetre=true;
		}
		if (env_icones.MinX==+1e300)
			return false;
		//Si el simbol és massa petit, i la simbolització no és en unitats mapa, faig que sel simbol tingui una area més gran.
		if (!unitatsMetre)
		{
			var costat4=ParamInternCtrl.vista.CostatZoomActual*4;
			if ((env_icones.MaxX-env_icones.MinX)<costat4*2)
			{
				env_icones.MaxX+=costat4;
				env_icones.MinX-=costat4;
			}
			if ((env_icones.MaxY-env_icones.MinY)<costat4*2)
			{
				env_icones.MaxY+=costat4;
				env_icones.MinY-=costat4;
			}
		}
		return EsPuntDinsEnvolupant(PuntConsultat, env_icones);
	}
	else if (capa.objectes.features[i_obj].geometry.type=="LineString" || capa.objectes.features[i_obj].geometry.type=="MultiLineString")
	{
		var p1={}, p2={}, p={x:PuntConsultat.i, y:PuntConsultat.j}, max_width=2, forma, lineString;
		var env=ParamInternCtrl.vista.EnvActual, ncol=ParamInternCtrl.vista.ncol, nfil=ParamInternCtrl.vista.nfil;

		if (!capa.estil[capa.i_estil].formes || !capa.estil[capa.i_estil].formes.length)
			return false;

		for (var i_forma=0; i_forma<capa.estil[capa.i_estil].formes.length; i_forma++)
		{
			forma=capa.estil[capa.i_estil].formes[i_forma];
			if (!forma.vora || !forma.vora.gruix || !forma.vora.gruix.amples || !forma.vora.gruix.amples.length)
				continue;
			if (max_width<forma.vora.gruix.amples[0])
				max_width<forma.vora.gruix.amples[0];
		}
		var geometry=DonaGeometryCRSActual(capa.objectes.features[i_obj], capa.CRSgeometry);
		for (var c2=0; c2<(geometry.type=="MultiLineString" ? geometry.coordinates.length : 1); c2++)
		{
			if (geometry.type=="MultiLineString")
				lineString=geometry.coordinates[c2];
			else
				lineString=geometry.coordinates;

			p1.x=Math.round((lineString[0][0]-env.MinX)/(env.MaxX-env.MinX)*ncol);
			p1.y=Math.round((env.MaxY-lineString[0][1])/(env.MaxY-env.MinY)*nfil);
			for (var c1=1; c1<lineString.length; c1++)
			{
				p2.x=Math.round((lineString[c1][0]-env.MinX)/(env.MaxX-env.MinX)*ncol);
				p2.y=Math.round((env.MaxY-lineString[c1][1])/(env.MaxY-env.MinY)*nfil);
				if (EsPuntSobreSegment(p1, p2, p, max_width))
					return true;
				p1.x=p2.x;
				p1.y=p2.y;
			}
		}
		return false;
	}
	else if (capa.objectes.features[i_obj].geometry.type=="Polygon" || capa.objectes.features[i_obj].geometry.type=="MultiPolygon")
	{
		//Aquest cop, decideixo fer-la en coordenades terreny i no en coordenades pantalla.
		var p=[PuntConsultat.x, PuntConsultat.y], poligon;
		if (!capa.estil[capa.i_estil].formes || !capa.estil[capa.i_estil].formes.length)
			return false;
		var geometry=DonaGeometryCRSActual(capa.objectes.features[i_obj], capa.CRSgeometry);
		for (var c3=0; c3<(geometry.type=="MultiPolygon" ? geometry.coordinates.length : 1); c3++)
		{
			if (geometry.type=="MultiPolygon")
				poligon=geometry.coordinates[c3];
			else
				poligon=geometry.coordinates;

			if (-1!=PuntEnElPoligon(p, poligon))
				return true;
		}
	}
	return false;
}
