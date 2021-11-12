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

function MoureASobreDeTot(i_capa)
{
	var n_capes_especials_a_sobre=NumeroDeCapesVolatils(i_capa);
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(1, n_capes_especials_a_sobre, i_capa, ParamCtrl);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+n_capes_especials_a_sobre, -1, ParamCtrl);

	ParamCtrl.capa.splice(n_capes_especials_a_sobre, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASobre(i_capa)
{
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(1, i_capa-1, ParamCtrl);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+i_capa-1, -1, ParamCtrl);

	ParamCtrl.capa.splice(i_capa-1, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	//Caldrà fer alguna cosa amb els grups, capes no visibles a la llegenda en aquell moment,...
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASota(i_capa)
{
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, ParamCtrl);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+i_capa+1, -1, ParamCtrl);

	ParamCtrl.capa.splice(i_capa+1, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASotaDeTot(i_capa)
{
	//He de pujar totes les capes que estan sota i_capa una posició
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, -1, ParamCtrl);

	ParamCtrl.capa.push(ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function EsborrarCapa(i_capa)
{
	if (AvisaDeCapaAmbIndexosACapaEsborrada(i_capa)==false)
		return;
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, -1, ParamCtrl);  // com que 'i_capa' desapareix, intentar moure cosa que apuntin a 'i_capa' no te sentit; i ja hem avisat que no anirà bé.
	ParamCtrl.capa.splice(i_capa, 1);
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
}

function EsborrarEstilCapa(i_capa, i_estil)
{
	if (AvisaDeCapaAmbIndexosAEstilEsborrar(i_capa, i_estil)==false)
		return;
	var capa=ParamCtrl.capa[i_capa];
	if(i_estil<capa.i_estil)
		capa.i_estil--;
	else if(i_estil==capa.i_estil && i_estil>0)
		capa.i_estil--;
	CanviaIndexosCapesSpliceEstil(-1, i_capa, i_estil+1, capa.estil.length);
	capa.estil.splice(i_estil, 1);
	CreaLlegenda();
	RepintaMapesIVistes()
}

function TancaContextMenuCapa()
{
	var elem=getLayer(window, "menuContextualCapa");
	hideLayer(elem);
}

function MouLayerContextMenuCapa(event, s)
{
	//Crear la layer i mostrar-ho en la posició on s'ha fet el clic amb aquest contingut
	var menu=getLayer(window, "menuContextualCapa");

	if (isLayer(menu))
	{
		var y;

		contentLayer(menu, s);
		var menu_marc=getLayer(window, "menuContextualCapa-contingut");
		var menu_text=getLayer(window, "menuContextualCapa-text");
		if(menu_text && menu_marc)
		{
			var rec=getRectLayer(menu_text);

			var mida=event.clientY+((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+parseInt(rec.alt);

			var rec_naveg=getRectLayer(window.document.body);
			if(mida>=rec_naveg.alt)
				y=event.clientY-parseInt(rec.alt);
			else
				y=event.clientY+5;
			changePosAndShowLayer(menu, event.clientX, y);
			moveLayer(menu_marc, event.clientX, y, rec.ample, rec.alt);
		}
		else
			changePosAndShowLayer(menu, event.clientX, y);

		setzIndexLayer(menu,(layerList.length-1));
		if(menu_text)
			setzIndexLayer(menu_text,(layerList.length-1));
		if(menu_marc)
			setzIndexLayer(menu_marc,(layerList.length-1));
	}
}

function OmpleLayerContextMenuCapa(event, i_capa)
{
var cdns=[]
var capa=ParamCtrl.capa[i_capa], alguna_opcio=false;

	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraModificaNomCapa(", i_capa, ");TancaContextMenuCapa();\">",
						GetMessage("ModifyName"), "</a><br>");
	cdns.push("<hr>");

	if(ParamCtrl.BarraBotoAfegeixCapa)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"IniciaFinestraAfegeixCapaServidor(", i_capa, ");TancaContextMenuCapa();\">",
						GetMessage("AddLayer"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;

	}
	if (capa.origen && capa.origen=="usuari")
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"CompartirCapa(", i_capa,");TancaContextMenuCapa();\">",
							GetMessage(ShareLayer, "cntxmenu"), "</a>");
		cdns.push("<br>");
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"EsborrarCapa(", i_capa,");TancaContextMenuCapa();\">",
							GetMessage("RemoveLayer", "cntxmenu"), "</a>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if(alguna_opcio)
	{
		cdns.push("<hr>");
		alguna_opcio=false;
	}
	if (ParamCtrl.capa.length>NumeroDeCapesVolatils(-1))
	{
		cdns.push("<b><font color=\"#888888\">",
			  GetMessage("MoveLayer", "cntxmenu"), "</b>");
		if(i_capa>NumeroDeCapesVolatils(i_capa))
		{
			cdns.push("<br /><a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASobreDeTot(", i_capa, ");TancaContextMenuCapa();\">",
					GetMessage("ToTheTop", "cntxmenu"), "</a><br>",
					"<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASobre(", i_capa,");TancaContextMenuCapa();\">",
					GetMessage("Up", "cntxmenu"), "</a>");
			if(!alguna_opcio)
				alguna_opcio=true;
		}
		if(i_capa<(ParamCtrl.capa.length-1))
		{
			cdns.push("<br/><a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASota(", i_capa, ");TancaContextMenuCapa();\">",
					GetMessage("Down", "cntxmenu"), "</a><br>",
					"<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASotaDeTot(", i_capa,");TancaContextMenuCapa();\">",
					GetMessage("ToTheEnd", "cntxmenu"), "</a>");
			if(!alguna_opcio)
				alguna_opcio=true;
		}
		cdns.push("<br />");
	}
	if(alguna_opcio)
	{
		cdns.push("<hr>");
		alguna_opcio=false;
	}
	if (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i_capa, ", -1);TancaContextMenuCapa();\">",
				GetMessage("Metadata"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (/*(capa.tipus=="TipusWMS" && capa.FormatImatge=="application/x-img") ||*/ capa.tipus=="TipusWFS" || capa.tipus=="TipusOAPI_Features" || capa.tipus=="TipusSOS" || capa.tipus=="TipusSTA" || capa.tipus=="TipusSTAplus")
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraCalculaQualitatCapa(",i_capa,", -1);TancaContextMenuCapa();\">",
				GetMessage("ComputeQuality", "cntxmenu"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.metadades)
	{
		if(capa.metadades.quality)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraMostraQualitatCapa(", i_capa,", -1);TancaContextMenuCapa();\">",
					GetMessage("Quality"), "</a><br>");
			if(!alguna_opcio)
				alguna_opcio=true;
		}
		if (capa.metadades.provenance && (capa.metadades.provenance.peticioServCSW || capa.metadades.provenance.lineage))
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraMostraLlinatge(", i_capa, ");TancaContextMenuCapa();\">",
					GetMessage("Lineage"), "</a><br>");
			if(!alguna_opcio)
				alguna_opcio=true;
		}
	}
	/*if (capa.metadades && capa.metadades.guf)
	{*/
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFeedbackCapa(", i_capa,", -1);TancaContextMenuCapa();\">",
				GetMessage("Feedback"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	//}
	if(alguna_opcio)
	{
		cdns.push("<hr>");
		alguna_opcio=false;
	}
	if (capa.estil && capa.estil.length==1)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraEditaEstilCapa(", i_capa, ",0);TancaContextMenuCapa();\">",
				GetMessage("EditStyle", "cntxmenu"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.FormatImatge=="application/x-img" && capa.estil && capa.estil.length && capa.estil[capa.i_estil].histograma)
	{
		var estil=capa.estil[capa.i_estil];
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraHistograma(", i_capa, ");TancaContextMenuCapa();\">");

		if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
		{
			//cdns.push(GetMessage("ConfusionMatrix", "cntxmenu"));
			cdns.push(GetMessage("ContingencyTable", "cntxmenu"));
		}
		else if (DonaTipusGraficHistograma(estil, 0)=='pie')
			cdns.push(GetMessage("PieChart"));
		else
			cdns.push(GetMessage("Histogram"));
		cdns.push("</a><br>");

		if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
			;
		else if (estil.component)
		{
			if (estil.component.length==2 && estil.component[1].herenciaOrigen) //capa especial: "estadistics (per categoria)"
				cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSeleccioEstadistic(", i_capa, ");TancaContextMenuCapa();\">",
					GetMessage("StatisticByCategory", "cntxmenu"), "</a><br>");
			else
				cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSeleccioEstadistic(", i_capa, ");TancaContextMenuCapa();\">",
					GetMessage("Statistic", "cntxmenu"), "</a><br>");
		}
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.FormatImatge=="application/x-img" && capa.estil && capa.estil.length && capa.estil[capa.i_estil].component.length>0 && capa.estil[capa.i_estil].component[0].representacio && capa.estil[capa.i_estil].component[0].representacio.tipus=="3d")
	{
		var estil=capa.estil[capa.i_estil];
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSuperficie3D(", i_capa, ");TancaContextMenuCapa();\">", GetMessage("Surface", "cntxmenu"), " 3D</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.valors && capa.valors.length>2)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraCombinacioRGB(", i_capa, ");TancaContextMenuCapa();\">",
				GetMessage("RGBCombination", "cntxmenu"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.FormatImatge=="application/x-img" || capa.model==model_vector)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSeleccioCondicional(", i_capa, ");TancaContextMenuCapa();\">",
				GetMessage("Selection"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.FormatImatge=="application/x-img")
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraReclassificaCapa(",i_capa,");TancaContextMenuCapa();\">",
				DonaCadenaLang({"cat":"Reclassificació", "spa":"Reclasificación", "eng":"Reclassification", "fre":"Reclassement"}), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if(alguna_opcio)
	{
		cdns.push("<hr>");
		alguna_opcio=false;
	}
	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFeedbackAmbEstilsDeCapa(", i_capa, ");TancaContextMenuCapa();\">",
				DonaCadenaLang({"cat":"Recupera estils", "spa":"Recupera estilos", "eng":"Retrieve styles", "fre":"Récupérer les styles"}), "</a><br>");

	if (cdns.length==0)
		return false;
	cdns.splice(0, 0, "<div class=\"MenuContextualCapa\" id=\"menuContextualCapa-contingut\">",
			  "<img align=\"right\" src=\"tanca_consulta.gif\" alt=\"",
				DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" onClick=\"TancaContextMenuCapa();\">",
			   "<div class=\"llistaMenuContext\"  id=\"menuContextualCapa-text\">");
	cdns.push("</div></div>");
	MouLayerContextMenuCapa(event, cdns.join(""));
	return false;
}

function CompartirCapa(i_capa)
{	//·$·
	alert(DonaCadenaLang({"cat":"En desenvolupament.", "spa":"En desarrollo.", "eng":"Under development.", "fre":"En développement."}));
}

function OmpleLayerContextMenuEstil(event, i_capa, i_estil)
{
var cdns=[];
var capa=ParamCtrl.capa[i_capa];

	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraModificaNomEstil(", i_capa,",",i_estil,");TancaContextMenuCapa();\">",
						DonaCadenaLang({"cat":"Modifica el nom", "spa":"Modifica el nombre", "eng":"Modify the name", "fre":"Modifier le nom"}), "</a><br>");
	cdns.push("<hr>");

	if (capa.estil[i_estil].origen && capa.estil[i_estil].origen=="usuari")
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"CompartirEstilCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
							DonaCadenaLang({"cat":"Compartir estil", "spa":"Compartir estilo", "eng":"Share style", "fre":"Partager style"}), "</a>");
		cdns.push("<br>");
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"EsborrarEstilCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
							DonaCadenaLang({"cat":"Esborrar estil", "spa":"Borrar estilo", "eng":"Delete style", "fre":"Effacer style"}), "</a>");
		cdns.push("<hr>");
	}
	if (capa.estil[i_estil].metadades && capa.estil[i_estil].metadades.standard && DonaCadena(capa.estil[i_estil].metadades.standard))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
				DonaCadenaLang({"cat":"Metadades", "spa":"Metadatos", "eng":"Metadata", "fre":"Métadonnées"}), "</a><br>");
	}
	if (/*(capa.tipus=="TipusWMS" && capa.FormatImatge=="application/x-img") || */capa.tipus=="TipusWFS" || capa.tipus=="TipusOAPI_Features" || capa.tipus=="TipusSOS" || capa.tipus=="TipusSTA" || capa.tipus=="TipusSTAplus")
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraCalculaQualitatCapa(",i_capa,",",i_estil,");TancaContextMenuCapa();\">",
				DonaCadenaLang({"cat":"Calcula la qualitat", "spa":"Calcula la calidad", "eng":"Compute the quality", "fre":"Calculer la qualité"}), "</a><br>");
	}
	if (capa.estil[i_estil].metadades && capa.estil[i_estil].metadades.quality)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraMostraQualitatCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
			DonaCadenaLang({"cat":"Qualitat", "spa":"Calidad", "eng":"Quality", "fre":"Qualité"}), "</a><br>");
	}
	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFeedbackCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
			DonaCadenaLang({"cat":"Valoracions", "spa":"Valoraciones", "eng":"Feedback", "fre":"rï¿½troaction"}), "</a><br>");

	if (capa.model!=model_vector)
	{
		cdns.push("<hr>");
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraEditaEstilCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
				DonaCadenaLang({"cat":"Edita estil", "spa":"Editar estilo", "eng":"Edit style", "fre":"Modifier le style"}), "</a><br>");
	}
	if (cdns.length==0)
		return false;
	cdns.splice(0, 0, "<div class=\"MenuContextualCapa\" id=\"menuContextualCapa-contingut\">",
			  "<img align=\"right\" src=\"tanca_consulta.gif\" alt=\"",
				DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" onClick=\"TancaContextMenuCapa();\">",
			   "<div class=\"llistaMenuContext\"  id=\"menuContextualCapa-text\">");
	cdns.push("</div></div>");
	MouLayerContextMenuCapa(event, cdns.join(""));
	return false;
}

function CompartirEstilCapa(i_capa, i_estil)
{
var s, text="";
var capa=ParamCtrl.capa[i_capa];

	//el TARGET de l'estil compartit és la seva capa "mare"
	if (!(s=DonaCodeCapaEstilFeedback(i_capa, -1)))
		return;

	//Eliminem els Item de la llegenda quan aquesta és automàtica, per fer el "code" més petit
	//·$· si això no es pot fer, o quan tenim paleta pròpia (pero ara pels estils propis encara no es pot) haurem de pensar que fer amb les URL llargues

	//·$· mirar si les funcions de neteja del jason treuen això de sota, i si es pot emancipar una "NetejaEstil" d'allà per usar-la aquí ·$·
	var estil_copia=JSON.parse(JSON.stringify(capa.estil[i_estil]));
	if (estil_copia.nItemLlegAuto)
		delete estil_copia.ItemLleg;
	if (estil_copia.histograma)
		delete estil_copia.histograma;
	if (estil_copia.component.length>1 && estil_copia.ItemLleg)
		delete estil_copia.ItemLleg;

	GUFCreateFeedbackWithReproducibleUsage([{title: DonaCadena(capa.desc), code: s, codespace: DonaServidorCapa(capa)}],
			{abstract: DonaCadena(capa.estil[i_estil].desc), specific_usage: DonaCadenaLang({"cat":"Compartir estil", "spa":"Compartir estilo", "eng":"Share style", "fre":"Partager style"}),
			ru_code: JSON.stringify(estil_copia), ru_code_media_type: "application/json",
			ru_platform: ToolsMMN, ru_version: VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers, ru_schema: config_schema_estil
			/*, ru_sugg_app: location.href -> s'afegeix automàticament */},
			ParamCtrl.idioma, "" /*access_token_type*/);
}

function DonaTextSeparadorCapaAfegida(i_capa)
{
//var separa_capa_afegida=DonaCadenaLang({"cat":"Capes afegides", "spa":"Capas añadidas", "eng":"Added layers", "fre":"Couches ajoutées"});
var separa_capa_afegida;

	var capa=ParamCtrl.capa[i_capa];

	if (capa.separa/* && capa.separa==separa_capa_afegida*/)
	{
		separa_capa_afegida=capa.separa;
		capa.separa=null;
		return separa_capa_afegida;
	}
	return null;
}

function AfegirCapaAlNavegador(form, servidorGC, i_on_afegir, i_capa, i_get_featureinfo, i_getmap)
{
var j, k;
var alguna_capa_afegida=false;
var estil;
var minim, maxim;

	var format=eval("form.format_capa_"+i_capa);
	var format_get_map=servidorGC.formatGetMap[format.options[format.selectedIndex].value];
	if(servidorGC.layer[i_capa].estil && servidorGC.layer[i_capa].estil.length>0)
	{
		estil=[];
		for(j=0; j<servidorGC.layer[i_capa].estil.length; j++)
		{
			estil[estil.length]={"nom": servidorGC.layer[i_capa].estil[j].nom,
						"desc": (servidorGC.layer[i_capa].estil[j].desc ? servidorGC.layer[i_capa].estil[j].desc: servidorGC.layer[i_capa].estil[j].nom),
						"DescItems": null,
						"TipusObj": "I",
						"metadades": null,
						"ItemLleg": null,
						"ncol": 0};
		}
	}
	else
		estil=null;
	if(servidorGC.layer[i_capa].CostatMinim && servidorGC.layer[i_capa].CostatMinim>=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat)
		minim=servidorGC.layer[i_capa].CostatMinim;
	else
		minim=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
	if(servidorGC.layer[i_capa].CostatMaxim && servidorGC.layer[i_capa].CostatMaxim<=ParamCtrl.zoom[0].costat)
		maxim=servidorGC.layer[i_capa].CostatMaxim;
	else
		maxim=ParamCtrl.zoom[0].costat;

	if(i_on_afegir==-1)
		k=ParamCtrl.capa.length;
	else
	{
		k=i_on_afegir;
		CanviaIndexosCapesSpliceCapa(1, k, -1, ParamCtrl);
	}
	ParamCtrl.capa.splice(k, 0, {"servidor": servidorGC.servidor,
				"versio": servidorGC.versio,
				"tipus": servidorGC.tipus,
				"nom": servidorGC.layer[i_capa].nom,
				"desc": servidorGC.layer[i_capa].desc,
				"CRS": [ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS],
				"FormatImatge": format_get_map,
				"transparencia": (format_get_map=="image/jpeg") ? "opac" : "transparent",
				"CostatMinim": minim,
				"CostatMaxim": maxim,
				"FormatConsulta": (i_get_featureinfo==-1 ? null :servidorGC.formatGetFeatureInfo[i_get_featureinfo]),
				"separa": DonaTextSeparadorCapaAfegida(k),
				"DescLlegenda": (servidorGC.layer[i_capa].desc ? servidorGC.layer[i_capa].desc : servidorGC.layer[i_capa].nom),
				"estil": estil,
				"i_estil": 0,
				"NColEstil": (estil && estil.length>0) ? 1: 0,
				"LlegDesplegada": false,
				"VisibleALaLlegenda": true,
				"visible": "si",
				"consultable": (i_get_featureinfo!=-1 && servidorGC.layer[i_capa].consultable)? "si" : "no",
				"descarregable": "no",
				"FlagsData": servidorGC.layer[i_capa].FlagsData,
				"data": servidorGC.layer[i_capa].data,
				"i_data": servidorGC.layer[i_capa].i_data,
				"animable": (servidorGC.layer[i_capa].data)? true: false,
				"AnimableMultiTime": (servidorGC.layer[i_capa].data)? true:false,
				"origen":"usuari"});

	CompletaDefinicioCapa(ParamCtrl.capa[k]);

	if (ParamCtrl.LlegendaAmagaSegonsEscala && !EsCapaDinsRangDEscalesVisibles(ParamCtrl.capa[k]))
		   alert(DonaCadenaLang({"cat":"La nova capa afegida, \'"+ParamCtrl.capa[k].nom+"\' no és visible al nivell de zoom actual del navegador",
							 "spa":"La nueva capa añadida, \'"+ParamCtrl.capa[k].nom+"\' no es visible al nivel de zoom actual del navegador",
							 "eng":"The new layer added, \'"+ParamCtrl.capa[k].nom+"\' is not visible in the current zoom level of the browser",
							 "fre":"La nouvelle couche ajoutée, \'"+ParamCtrl.capa[k].nom+"\' n'est pas visible au niveau du zoom actuel du navigateur"}));
}

function AfegirCapesAlNavegador(form, i_serv)
{
var i, j, i_capa, i_get_featureinfo, i_getmap;
var alguna_capa_afegida=false;
var servidorGC=ServidorGetCapabilities[i_serv];
var i_on_afegir=servidorGC.i_capa_on_afegir;

	if(form==null)
		return;
	//Format de consulta comú per totes les capes
	i_get_featureinfo=-1;
	if(servidorGC.formatGetFeatureInfo)
	{
		for(j=0; j<servidorGC.formatGetFeatureInfo.length; j++)
		{
			if(servidorGC.formatGetFeatureInfo[j].indexOf("text/xml"))
			{
				i_get_featureinfo=j;
				break;
			}
		}
		if(i_get_featureinfo==-1)
		{
			for(j=0; j<servidorGC.formatGetFeatureInfo.length; j++)
			{
				if(servidorGC.formatGetFeatureInfo[j].indexOf("text/html"))
				{
					i_get_featureinfo=j;
					break;
				}
			}
		}
	}

	//Potser només tinc una capa al servidor, en aquest cap form.sel_capes no és un array i no puc fer sel_capes.length
	if(form.sel_capes.length!=null)
	{
		for(i=0; i<form.sel_capes.length; i++)
		{
			if(form.sel_capes[i].checked)  //Si la capa està seleccionada l'afegeix-ho al navegador
			{
				i_capa=form.sel_capes[i].value;
				if(!alguna_capa_afegida)
					alguna_capa_afegida=true;

				AfegirCapaAlNavegador(form, servidorGC, i_on_afegir, i_capa, i_get_featureinfo, i_getmap);

				if(i_on_afegir!=-1)
					i_on_afegir++;
			}
		}
	}
	else
	{
		if(form.sel_capes.checked)  //Si la capa està seleccionada l'afegeix-ho al navegador
		{
			if(!alguna_capa_afegida)
				alguna_capa_afegida=true;
			i_capa=form.sel_capes.value;
			AfegirCapaAlNavegador(form, servidorGC, i_on_afegir, i_capa, i_get_featureinfo, i_getmap);
		}
	}
	if(alguna_capa_afegida)
	{
		/*Si s'ha afegit alguna capa de servidor extern, relaxo les
                limitacions d'àmbit de navegació per poder-me sortir del mapa
		de situació. En realitat, el que voldria programar és que si la
                capa que afegixo se surt del àmbit "relaxo" però si no, doncs no
		però no sembla que NJ llegeixi l'àmbit de la capa i per això
		decideixo fer-ho més general*/
		ParamCtrl.RelaxaAmbitVisualitzacio=true;
                //Redibuixo el navegador perquè les noves capes siguin visibles
		RevisaEstatsCapes();
		CreaLlegenda();
		RepintaMapesIVistes();
	}
}//Fi de AfegirCapesAlNavegador

/*Aquesta funció s'ha de cridar abans o després fer capa.splice() o similars.
Revisa totes les capes però només canvia els indexos de les capes i_capa_ini (inclosa) en endavant. Per tant el valor que cal passar a i_capa_ini no depèn
de si capa.splice() es fa abans o després de la crida a aquesta funció. Si capa.splice() es fa abans, els indexos encara tenen els valors antics igualment.
També canvia els indexos de les variables ParamCtrl.ICapaVola* .
'n_moviment' pot ser negatiu quan elimines capes o positiu quan insereixes.
'i_capa_ini' és la capa inicial (inclosa) per fer el canvi d'indexos. En eliminar capes eviteu usar la capa eliminada com a i_capa_ini
Si es fa un 'n_moviment' negatiu (eliminació de capes) que es combina amb capa.splice(), es pot fer servir
for (i=0 i<-n_moviment; i++)
    AvisaDeCapaAmbIndexosACapaEsborrada(i_capa_ini+i)
	return;
per avisar que hi ha capes que tenen indexos que apunten a capes que s'eliminen. Tot això ja es te en compte a EsborrarCapa().
'i_capa_fi_per_sota' és la capa fi (no incluent ella mateixa) on cal fer el canvi d'indexos. Si voleu fins al final especifiqueu -1 (o ParamCtrl.capa.length),
	Opcional; si no s'especifica, només es mouen els index que coindideixen amb i_capa_ini.
Des que els histogrames són dinàmics també ha de revisar els HistogramaFinestra[] i Superficie3DFinestra[]*/
function CanviaIndexosCapesSpliceCapa(n_moviment, i_capa_ini, i_capa_fi_per_sota, param_ctrl)
{
var capa, j, k, d, fragment, cadena, calcul, final, nou_valor, inici, calcul;

	if (typeof i_capa_fi_per_sota==="undefined")
		var i_capa_fi_per_sota=i_capa_ini+1;
	if (i_capa_fi_per_sota==-1)
		i_capa_fi_per_sota=param_ctrl.capa.length;

	for(var i=0; i<param_ctrl.capa.length; i++)
	{
		capa=param_ctrl.capa[i];
		if (capa.valors && capa.valors.length)
		{
			for (j=0; j<capa.valors.length; j++)
			{
				if (typeof capa.valors[j].i_capa!=="undefined" &&  capa.valors[j].i_capa!= null && capa.valors[j].i_capa>=i_capa_ini && capa.valors[j].i_capa<i_capa_fi_per_sota)
					capa.valors[j].i_capa+=n_moviment;
			}
		}
		if (capa.estil && capa.estil.length)
		{
			for (j=0; j<capa.estil.length; j++)
			{
				if (capa.estil[j].component && capa.estil[j].component.length)
				{
					for (k=0; k<capa.estil[j].component.length; k++)
					{
						if (capa.estil[j].component[k].calcul)
						{
							calcul="";
							fragment=capa.estil[j].component[k].calcul;
							while ((inici=fragment.indexOf("{"))!=-1)
							{
								//busco una clau de tancar
								final=fragment.indexOf("}");
								if (final==-1)
								{
									alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
									break;
								}
								cadena=fragment.substring(inici, final+1);
								//interpreto el fragment metajson
								nou_valor=JSON.parse(cadena);
								if (nou_valor.i_capa>=i_capa_ini && nou_valor.i_capa<i_capa_fi_per_sota)
								{
									nou_valor.i_capa+=n_moviment;
									calcul+=fragment.substring(0, inici)+JSON.stringify(nou_valor);
								}
								else
									calcul+=fragment.substring(0, inici)+cadena;
								fragment=fragment.substring(final+1, fragment.length);
							}
							calcul+=fragment;
							capa.estil[j].component[k].calcul=calcul;
						}
						if (capa.estil[j].component[k].representacio && capa.estil[j].component[k].representacio.dimMatriu && capa.estil[j].component[k].representacio.dimMatriu.length)
						{
							for (d=0; d<capa.estil[j].component[k].representacio.dimMatriu.length; d++)
							{
								if (typeof capa.estil[j].component[k].representacio.dimMatriu[d].i_capa!=="undefined" &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_capa!= null &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_capa>=i_capa_ini &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_capa<i_capa_fi_per_sota)
									capa.estil[j].component[k].representacio.dimMatriu[d].i_capa+=n_moviment;

							}
						}
					}
				}
			}
		}
		if (capa.atributs && capa.atributs.length)
		{
			for (j=0; j<capa.atributs.length; j++)
			{
				if (capa.atributs[j].calcul)
				{
					calcul="";
					fragment=capa.atributs[j].calcul;
					while ((inici=fragment.indexOf("{"))!=-1)
					{
						//busco una clau de tancar
						final=fragment.indexOf("}");
						if (final==-1)
						{
							alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
							break;
						}
						cadena=fragment.substring(inici, final+1);
						//interpreto el fragment metajson
						nou_valor=JSON.parse(cadena);
						if (nou_valor.i_capa>=i_capa_ini && nou_valor.i_capa<i_capa_fi_per_sota)
						{
							nou_valor.i_capa+=n_moviment;
							calcul+=fragment.substring(0, inici)+JSON.stringify(nou_valor);
						}
						else
							calcul+=fragment.substring(0, inici)+cadena;
						fragment=fragment.substring(final+1, fragment.length);
					}
					calcul+=fragment;
					capa.atributs[j].calcul=calcul;
				}
			}
		}
	}
	CanviaIndexosCapesGraphsMM(n_moviment, i_capa_ini, i_capa_fi_per_sota);
	CanviaIndexosCapesVolatils(n_moviment, i_capa_ini, i_capa_fi_per_sota, param_ctrl);
	CanviaIndexosCapesHistogramaFinestra(n_moviment, i_capa_ini, i_capa_fi_per_sota);
	CanviaIndexosCapes3DFinestra(n_moviment, i_capa_ini, i_capa_fi_per_sota);
}

function AvisaDeCapaAmbIndexosACapaEsborrada(i_capa)
{
var capa, j, k, fragment, cadena, inici, final, nou_valor;

	for(var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (i==i_capa)
			continue;
		if (capa.valors && capa.valors.length)
		{
			for (j=0; j<capa.valors.length; j++)
			{
				if (typeof capa.valors[j].i_capa!=="undefined" &&  capa.valors[j].i_capa!= null && capa.valors[j].i_capa==i_capa)
				{
					if (false==confirm(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"}) + " " + DonaCadena(capa.desc) + " " + DonaCadenaLang({"cat":"conté referències a la capa que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias a la capa que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références à la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"}) + "?"));
						return false;
				}
			}
		}
		if (capa.atributs && capa.atributs.length)
		{
			for (j=0; j<capa.atributs.length; j++)
			{
				if (!capa.atributs[j].calcul)
					continue;
				fragment=capa.atributs[j].calcul;
				while ((inici=fragment.indexOf("{"))!=-1)
				{
					//busco una clau de tancar
					final=fragment.indexOf("}");
					if (final==-1)
					{
						alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
						break;
					}
					cadena=fragment.substring(inici, final+1);
					//interpreto el fragment metajson
					nou_valor=JSON.parse(cadena);
					if (nou_valor.i_capa==i_capa)
					{
						if (false==confirm(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"}) + " " + DonaCadena(capa.desc) + " " + DonaCadenaLang({"cat":"conté referències a la capa que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias a la capa que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références à la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"}) + "?"))
							return false;
					}
					fragment=fragment.substring(final+1, fragment.length);
				}
			}
		}
		if (capa.estil && capa.estil.length)
		{
			for (j=0; j<capa.estil.length; j++)
			{
				if (capa.estil[j].component && capa.estil[j].component.length)
				{
					for (k=0; k<capa.estil[j].component.length; k++)
					{
						if (!capa.estil[j].component[k].calcul)
							continue;
						fragment=capa.estil[j].component[k].calcul;
						while ((inici=fragment.indexOf("{"))!=-1)
						{
							//busco una clau de tancar
							final=fragment.indexOf("}");
							if (final==-1)
							{
								alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
								break;
							}
							cadena=fragment.substring(inici, final+1);
							//interpreto el fragment metajson
							nou_valor=JSON.parse(cadena);
							if (nou_valor.i_capa==i_capa)
							{
								if (false==confirm(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"}) + " " + DonaCadena(capa.desc) + " " + DonaCadenaLang({"cat":"conté referències a la capa que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias a la capa que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références à la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"}) + "?"))
									return false;
							}
							fragment=fragment.substring(final+1, fragment.length);
						}
					}
				}
			}
		}
	}
	return true;
}


//n_moviment pot ser negatiu quan elimines capes o positiu quan insereixes. Aquest funció s'ha de cridar despres fer capa.splice() o similars.
//i_capa índex de la capa que conté l'estil a esborrar o a inserir
//i_estil_ini és l'índex de l'estil inicial per fer el canvi d'indexos
//i_estil_fi_per_sota és l'índex de l'estil  fi (no incluent ell mateixa) on cal fer el canvi d'indexos. Opcional; si no s'especifica, val i_estil_ini+1
function CanviaIndexosCapesSpliceEstil(n_moviment, i_capa, i_estil_ini, i_estil_fi_per_sota)
{
var capa, j, k, d, fragment, cadena, calcul, final, nou_valor, inici, calcul;

	if (typeof i_estil_fi_per_sota==="undefined")
		var i_estil_fi_per_sota=i_estil_ini+1;

	for(var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.estil && capa.estil.length)
		{
			for (j=0; j<capa.estil.length; j++)
			{
				if (capa.estil[j].component && capa.estil[j].component.length)
				{
					for (k=0; k<capa.estil[j].component.length; k++)
					{
						if (capa.estil[j].component[k].calcul)
						{
							calcul="";
							fragment=capa.estil[j].component[k].calcul;
							while ((inici=fragment.indexOf("{"))!=-1)
							{
								//busco una clau de tancar
								final=fragment.indexOf("}");
								if (final==-1)
								{
									alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
									break;
								}
								cadena=fragment.substring(inici, final+1);
								//interpreto el fragment metajson
								nou_valor=JSON.parse(cadena);
								if (nou_valor.i_capa==i_capa && (nou_valor.i_estil>=i_estil_ini && nou_valor.i_estil<i_estil_fi_per_sota))
								{
									nou_valor.i_estil+=n_moviment;
									calcul+=fragment.substring(0, inici)+JSON.stringify(nou_valor);
								}
								else
									calcul+=fragment.substring(0, inici)+cadena;
								fragment=fragment.substring(final+1, fragment.length);
							}
							calcul+=fragment;
							capa.estil[j].component[k].calcul=calcul;
						}
						if (capa.estil[j].component[k].representacio && capa.estil[j].component[k].representacio.dimMatriu && capa.estil[j].component[k].representacio.dimMatriu.length)
						{
							for (d=0; d<capa.estil[j].component[k].representacio.dimMatriu.length; d++)
							{
								if (typeof capa.estil[j].component[k].representacio.dimMatriu[d].i_capa!=="undefined" &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_capa!= null &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_capa== i_capa &&
									typeof capa.estil[j].component[k].representacio.dimMatriu[d].i_estil!=="undefined" &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_estil!= null &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_estil>=i_estil_ini &&
										capa.estil[j].component[k].representacio.dimMatriu[d].i_estil<i_estil_fi_per_sota)
									capa.estil[j].component[k].representacio.dimMatriu[d].i_estil+=n_moviment;
							}
						}
					}
				}
			}
		}
		if (capa.atributs && capa.atributs.length)
		{
			for (j=0; j<capa.atributs.length; j++)
			{
				if (capa.atributs[j].calcul)
				{
					if (capa.atributs[j].calcul)
					{
						calcul="";
						fragment=capa.atributs[j].calcul;
						while ((inici=fragment.indexOf("{"))!=-1)
						{
							//busco una clau de tancar
							final=fragment.indexOf("}");
							if (final==-1)
							{
								alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
								break;
							}
							cadena=fragment.substring(inici, final+1);
							//interpreto el fragment metajson
							nou_valor=JSON.parse(cadena);
							if (nou_valor.i_capa==i_capa && (nou_valor.i_estil>=i_estil_ini && nou_valor.i_estil<i_estil_fi_per_sota))
							{
								nou_valor.i_estil+=n_moviment;
								calcul+=fragment.substring(0, inici)+JSON.stringify(nou_valor);
							}
							else
								calcul+=fragment.substring(0, inici)+cadena;
							fragment=fragment.substring(final+1, fragment.length);
						}
						calcul+=fragment;
						capa.atributs[j].calcul=calcul;
					}
				}
			}
		}
	}
}

function AvisaDeCapaAmbIndexosAEstilEsborrar(i_capa, i_estil)
{
var capa, j, k, fragment, cadena, inici, final, nou_valor;

	for(var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.atributs && capa.atributs.length)
		{
			for (j=0; j<capa.atributs.length; j++)
			{
				if (!capa.atributs[j].calcul)
					continue;
				fragment=capa.atributs[j].calcul;
				while ((inici=fragment.indexOf("{"))!=-1)
				{
					//busco una clau de tancar
					final=fragment.indexOf("}");
					if (final==-1)
					{
						alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
						break;
					}
					cadena=fragment.substring(inici, final+1);
					//interpreto el fragment metajson
					nou_valor=JSON.parse(cadena);
					if (nou_valor.i_capa==i_capa && nou_valor.i_estil==i_estil)
					{
						if (false==confirm(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"}) + " " + DonaCadena(capa.desc) + " " + DonaCadenaLang({"cat":"conté referències a l'estil que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias al estilo que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the style that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références au style que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"}) + "?"))
							return false;
					}
					fragment=fragment.substring(final+1, fragment.length);
				}
			}
		}
		if (capa.estil && capa.estil.length)
		{
			for (j=0; j<capa.estil.length; j++)
			{
				if (capa.estil[j].component && capa.estil[j].component.length)
				{
					for (k=0; k<capa.estil[j].component.length; k++)
					{
						if (!capa.estil[j].component[k].calcul)
							continue;
						fragment=capa.estil[j].component[k].calcul;
						while ((inici=fragment.indexOf("{"))!=-1)
						{
							//busco una clau de tancar
							final=fragment.indexOf("}");
							if (final==-1)
							{
								alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
								break;
							}
							cadena=fragment.substring(inici, final+1);
							//interpreto el fragment metajson
							nou_valor=JSON.parse(cadena);
							if (nou_valor.i_capa==i_capa  && nou_valor.i_estil==i_estil)
							{
								if (false==confirm(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"}) + " " + DonaCadena(capa.desc) + " " + DonaCadenaLang({"cat":"conté referències a l'estil que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias al estilo que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the style that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références au style que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"}) + "?"))
									return false;
							}
							fragment=fragment.substring(final+1, fragment.length);
						}
					}
				}
			}
		}
	}
	return true;
}

function DonaIndexosACapesDeCalcul(calcul, i_capa)
/* i_capa es passa en el context que estic demanat els indexos en relació a una capa concreta,
per si la definicó d'algun v[] d'aquell no indica i_capa explícitament, com per exemple passa
en crear un flistre espacial a partir d'una banda de la mateixa capa
En contextos on no te sentit (per exemple a AfegeixCapaCalcul no es passa i està protegit */
{
var fragment, cadena, i_capes=[], inici, final, nou_valor;

	fragment=calcul;
	while ((inici=fragment.indexOf("{"))!=-1)
	{
		//busco una clau de tancar
		final=fragment.indexOf("}");
		if (final==-1)
		{
			alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		nou_valor=JSON.parse(cadena);
		if (typeof nou_valor.i_capa === "undefined" && typeof i_capa !== "undefined")
			i_capes.push(i_capa);
		else
			i_capes.push(nou_valor.i_capa);
		fragment=fragment.substring(final+1, fragment.length);
	}
	i_capes.sort(sortAscendingNumber);
	//EliminaRepeticionsArray(i_capes, sortAscendingNumber);
	i_capes.removeDuplicates(sortAscendingNumber);

	return i_capes;
}

function DeterminaEnvTotalDeCapes(i_capes)
{
var env={"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300}, i;

	if (!i_capes.length || !ParamCtrl.capa[i_capes[0]].EnvTotal)
		return null;
	if (i_capes.length==1)
		return JSON.parse(JSON.stringify(ParamCtrl.capa[i_capes[0]].EnvTotal));
	for (i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].EnvTotal)
			return null;
		if (i<0 && ParamCtrl.capa[i_capes[i]].EnvTotal.CRS!=ParamCtrl.capa[i_capes[i-1]].EnvTotal.CRS)
			break;
	}
	if (i<i_capes.length)  //Hi ha ambits en CRSs diferents. Ho faig amb LongLat
	{
		for (i=0; i<i_capes.length; i++)
		{
			if (ParamCtrl.capa[i_capes[i]].EnvTotalLL)
			{
				if (env.MinX>ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinX)
					env.MinX=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinX;
				if (env.MaxX<ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxX)
					env.MaxX=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxX;
				if (env.MinY>ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinY)
					env.MinY=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinY;
				if (env.MaxY<ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxY)
					env.MaxY=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxY;
			}
		}
		return {"EnvCRS": env, "CRS": "EPSG:4326"};
	}
	else
	{
		for (i=0; i<i_capes.length; i++)
		{
			if (env.MinX>ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinX)
				env.MinX=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinX;
			if (env.MaxX<ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxX)
				env.MaxX=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxX;
			if (env.MinY>ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinY)
				env.MinY=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinY;
			if (env.MaxY<ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxY)
				env.MaxY=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxY;
		}
		return {"EnvCRS": env, "CRS": ParamCtrl.capa[i_capes[0]].EnvTotal.CRS};
	}
}


function DeterminaCostatMinimDeCapes(i_capes)
{
var costat=1e300;

	if (!i_capes.length)
		return ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;

	for (var i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].CostatMinim)
			return ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
		if (costat>ParamCtrl.capa[i_capes[i]].CostatMinim)
			costat=ParamCtrl.capa[i_capes[i]].CostatMinim;
	}
	return (costat==1e300) ? ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat : costat;
}

function DeterminaCostatMaximDeCapes(i_capes)
{
var costat=1e-300;

	if (!i_capes.length)
		return ParamCtrl.zoom[0].costat;

	for (var i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].CostatMaxim)
			return ParamCtrl.zoom[0].costat;
		if (costat<ParamCtrl.capa[i_capes[i]].CostatMaxim)
			costat=ParamCtrl.capa[i_capes[i]].CostatMaxim;
	}
	return (costat==1e-300) ? ParamCtrl.zoom[0].costat : costat;
}

function AfegeixCapaCalcul()
{
var alguna_capa_afegida=false;

var i_capes=DonaIndexosACapesDeCalcul(document.CalculadoraCapes.calcul.value);
var desc_capa=document.CalculadoraCapes.nom_estil.value;

	var i_capa=Math.min.apply(Math, i_capes); //https://www.w3schools.com/js/js_function_apply.asp

	if (i_capes.length>1) //Si en l'expressió entra en joc més d'una capa -> la capa calculada és una capa nova
	{
		//pensar què fer amb origen en aquest cas, si es posa a nivell de capa (encara no al config.json) i/o de estil ·$·
		ParamCtrl.capa.splice(i_capa, 0, {"servidor": null,
			"versio": null,
			"tipus": null,
			"nom":	"ComputedLayer",
			"desc":	(desc_capa) ? desc_capa : "Computed layer",
			"CRS": (i_capes.length ? JSON.parse(JSON.stringify(ParamCtrl.capa[i_capes[0]].CRS)) : null),
			"EnvTotal": DeterminaEnvTotalDeCapes(i_capes),
			"FormatImatge": "application/x-img",
			"valors": [],
			"transparencia": "semitransparent",
			"CostatMinim": DeterminaCostatMinimDeCapes(i_capes),
			"CostatMaxim": DeterminaCostatMaximDeCapes(i_capes),
			"TileMatrixSet": null,
			"FormatConsulta": null,
			"grup":	null,
			"separa": DonaTextSeparadorCapaAfegida(i_capa),
			"DescLlegenda": (desc_capa) ? desc_capa : "Computed layer",
			"estil": [{
				"nom":	null,
				"desc":	(desc_capa) ? desc_capa : "Computed layer",
				"TipusObj": "P",
				"component": [{
					"calcul": document.CalculadoraCapes.calcul.value,
				}],
				"metadades": null,
				"nItemLlegAuto": 20,
				"ncol": 4,
				"descColorMultiplesDe": 0.01
			}],
			"i_estil":	0,
			"NColEstil":	1,
			"LlegDesplegada":	false,
			"VisibleALaLlegenda":	true,
			"visible":	"si",
			"visible_vista":	null,
			"consultable":	"si",
			"descarregable":	"no",
			"metadades":	null,
			"NomVideo":	null,
			"DescVideo":	null,
			"FlagsData": null,
			"data": null,
			"i_data": 0,
			"animable":	false, //··Segurament la capa es podria declarar animable si alguna capa té els temps "current" i és multitime.
			"AnimableMultiTime": false,  //··Segurament la capa es podria declarar AnimableMultiTime si alguna capa té els temps "current" i és multitime.
			"proces":	null,
			"ProcesMostrarTitolCapa" : false,
			"origen": "usuari"
			});

		if (i_capa<ParamCtrl.capa.length)  //això és fa després, donat que els índex de capa de la capa nova es poden referir a capes que s'han mogut.
			CanviaIndexosCapesSpliceCapa(1, i_capa, -1, ParamCtrl);

		CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

	  //Redibuixo el navegador perquè les noves capes siguin visibles
		RevisaEstatsCapes();
		CreaLlegenda();
		RepintaMapesIVistes();
	}
	else //si en l'expressió només entra en joc una capa (la i_capa) -> la capa calculada s'afegeix com un estil de la mateixa
	{
		var capa=ParamCtrl.capa[i_capa];
		capa.estil.push({
				"nom":	null,
				"desc":	(desc_capa) ? desc_capa : "Computed style",
				"TipusObj": "P",
				"component": [{
					"calcul": document.CalculadoraCapes.calcul.value,
				}],
				"metadades": null,
				"nItemLlegAuto": 20,
				"ncol": 4,
				"descColorMultiplesDe": 0.01,
				"origen": "usuari"
			});

			if (capa.visible=="ara_no")
				CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
			else
				CreaLlegenda();

			//Defineix el nou estil com estil actiu
			CanviaEstilCapa(i_capa, capa.estil.length-1, false);
	}
}//Fi de AfegeixCapaCalcul()

function AfegeixCapaCombicapaCategoric()
{
var alguna_capa_afegida=false;

var condicio=[], capa=[], i_capes, i_cat, categories, cat_noves, atributs, atrib_nous, colors=[], i_color_tipic;

	if (!PaletesGlobals)
	{
		loadJSON("paletes.json",
			function(paletes_globals, extra_param) {
				PaletesGlobals=paletes_globals;
				AfegeixCapaCombicapaCategoric();
			},
			function(xhr) { alert(xhr); },
			null);
		return;
	}
	condicio[0]=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-combicap", "-valor", 0);
	condicio[1]=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-combicap", "-valor", 1);

	i_capes=[condicio[0].i_capa, condicio[1].i_capa];

	if(i_capes[0]==i_capes[1] &&
	   ((typeof condicio[0].i_estil==="undefined" && typeof condicio[1].i_estil==="undefined") ||
		 (!condicio[0].i_estil && !condicio[1].i_estil) ||
		 (condicio[0].i_estil && condicio[1].i_estil && condicio[0].i_estil==condicio[1].i_estil)) &&
	   ((typeof condicio[0].i_data==="undefined" && typeof condicio[1].i_data==="undefined") ||
		 (!condicio[0].i_data && !condicio[1].i_data) ||
		 (condicio[0].i_data && condicio[1].i_data && condicio[0].i_data==condicio[1].i_data)) )
	{
		alert(DonaCadenaLang({"cat":"Cal triar dues capes diferents o la mateixa en estils i/o dates diferents.",
							 "spa":"Es necesario elegir dos capas diferentes o la misma en estilos y/o fechas diferentes.",
							 "eng":"You should choose two different layers or the same in different styles and/or dates.",
							 "fre": "You should  choose two different layers or the same in different styles and/or dates."}));
		return;
	}

	capa[0]=ParamCtrl.capa[i_capes[0]];
	capa[1]=ParamCtrl.capa[i_capes[1]];

	//Creo la nova descripció de les categories i la nova paleta
	categories=[capa[0].estil[condicio[0].i_estil].categories, capa[1].estil[condicio[1].i_estil].categories];
	cat_noves=[];
	i_color_tipic=0;

	for (var j=0, i_cat=0; j<categories[1].length; j++)
	{
		for (var i=0; i<categories[0].length; i++, i_cat++)
		{
			cat_noves[i_cat]=null;
			if (categories[0][i])
			{
				if (cat_noves[i_cat]==null)
					cat_noves[i_cat]={};
				for(var prop in categories[0][i])
					cat_noves[i_cat][prop+"1"]=categories[0][i][prop];
			}
			if (categories[1][j])
			{
				if (cat_noves[i_cat]==null)
					cat_noves[i_cat]={};
				for(var prop in categories[1][j])
					cat_noves[i_cat][prop+"2"]=categories[1][j][prop];
			}
			if (i_color_tipic==PaletesGlobals.categoric.tableau20.colors.length)
				i_color_tipic=0;
			colors.push(PaletesGlobals.categoric.tableau20.colors[i_color_tipic]);
			i_color_tipic++;
		}
	}

	//Creo la descripció des atributs
	atributs=[capa[0].estil[condicio[0].i_estil].atributs, capa[1].estil[condicio[1].i_estil].atributs];
	atrib_nous=[];

	for (var i=0; i<atributs[0].length; i++)
	{
		atrib_nous.push(JSON.parse(JSON.stringify(atributs[0][i])));
		atrib_nous[atrib_nous.length-1].nom+="1";
		if (atrib_nous[atrib_nous.length-1].descripcio)
			atrib_nous[atrib_nous.length-1].descripcio=
			ConcatenaCadenes(ConcatenaCadenes(ConcatenaCadenes(atrib_nous[atrib_nous.length-1].descripcio," ("),(capa[0].DescLlegenda?capa[0].DescLlegenda:capa[0].nom)),")");
			//DonaCadena(atrib_nous[atrib_nous.length-1].descripcio)+ " ("+ (DonaCadena(capa[0].DescLlegenda) ? DonaCadena(capa[0].DescLlegenda): capa[0].nom) + ")";
	}
	for (var i=0; i<atributs[1].length; i++)
	{
		atrib_nous.push(JSON.parse(JSON.stringify(atributs[1][i])));
		atrib_nous[atrib_nous.length-1].nom+="2";
		if (atrib_nous[atrib_nous.length-1].descripcio)
			atrib_nous[atrib_nous.length-1].descripcio=
			ConcatenaCadenes(ConcatenaCadenes(ConcatenaCadenes(atrib_nous[atrib_nous.length-1].descripcio," ("),(capa[1].DescLlegenda?capa[1].DescLlegenda:capa[1].nom)),")");
			//DonaCadena(atrib_nous[atrib_nous.length-1].descripcio)+ " ("+ (DonaCadena(capa[1].DescLlegenda) ? DonaCadena(capa[1].DescLlegenda): capa[1].nom) + ")";
	}

	var cadena_desc=ConcatenaCadenes(ConcatenaCadenes((capa[0].DescLlegenda ? capa[0].DescLlegenda: capa[0].nom),{"cat":" i ","spa":" y ","eng":" and ", "fre":" et "}),(capa[1].DescLlegenda?capa[1].DescLlegenda: capa[1].nom));

	var i_capa=Math.min.apply(Math, i_capes); //https://www.w3schools.com/js/js_function_apply.asp

	ParamCtrl.capa.splice(i_capa, 0, {"servidor": null,
		"versio": null,
		"tipus": null,
		"nom":	"CombinedLayer",
		"desc":	DonaCadenaLang({"cat": "Combinació de ", "spa": "Combinación de ", "eng": "Combination of ", "fre": "Combination of "}) + (DonaCadena(capa[0].desc) ? DonaCadena(capa[0].desc) : (DonaCadena(capa[0].DescLlegenda) ? DonaCadena(capa[0].DescLlegenda): capa[0].nom)) + " " + DonaCadenaLang({"cat": "i", "spa": "y", "eng": "and", "fre": "et"}) + " " + (DonaCadena(capa[1].desc) ? DonaCadena(capa[1].desc) : (DonaCadena(capa[1].DescLlegenda) ? DonaCadena(capa[1].DescLlegenda): capa[1].nom)),
		"CRS": (capa.length && capa[0].CRS) ? JSON.parse(JSON.stringify(capa[0].CRS)) : null,
		"EnvTotal": DeterminaEnvTotalDeCapes(i_capes),
		"FormatImatge": "application/x-img",
		"valors": [],
		"transparencia": "semitransparent",
		"CostatMinim": DeterminaCostatMinimDeCapes(i_capes),
		"CostatMaxim": DeterminaCostatMaximDeCapes(i_capes),
		"TileMatrixSet": null,
		"FormatConsulta": null,
		"grup":	null,
		"separa": DonaTextSeparadorCapaAfegida(i_capa),
		"DescLlegenda": cadena_desc,
		//(DonaCadena(capa[0].DescLlegenda) ? DonaCadena(capa[0].DescLlegenda): capa[0].nom) + " " + DonaCadenaLang({"cat": "i", "spa": "y", "eng": "and", "fre": "and"}) + " " + (DonaCadena(capa[1].DescLlegenda) ? DonaCadena(capa[1].DescLlegenda): capa[1].nom),
		"estil": [{
			"nom":	null,
			"desc":	cadena_desc,
			//(DonaCadena(capa[0].DescLlegenda) ? DonaCadena(capa[0].DescLlegenda): capa[0].nom) + " " + DonaCadenaLang({"cat": "i", "spa": "y", "eng": "and", "fre": "and"}) + " " + (DonaCadena(capa[1].DescLlegenda) ? DonaCadena(capa[1].DescLlegenda): capa[1].nom),
			"TipusObj": "P",
			"component": [{
				"calcul": DonaCadenaEstilCapaPerCalcul(-1, condicio[0].i_capa, condicio[0].i_data, condicio[0].i_estil) + "+" +
					DonaCadenaEstilCapaPerCalcul(-1, condicio[1].i_capa, condicio[1].i_data, condicio[1].i_estil) + "*" + capa[0].estil[condicio[0].i_estil].categories.length,
				"representacio": {
					"tipus": "matriuConfusio",
					"dimMatriu": [
						{
							i_capa: condicio[0].i_capa,
							i_estil: condicio[0].i_estil
						},{
							i_capa: condicio[1].i_capa,
							i_estil: condicio[1].i_estil
						}
					]
				}
			}],
			"categories": cat_noves,
			"atributs": atrib_nous,
			"metadades": null,
			"ncol": 1,
			"paleta": {
				"colors": colors
			}
		}],
		"i_estil":	0,
		"NColEstil":	1,
		"LlegDesplegada":	false,
		"VisibleALaLlegenda":	true,
		"visible":	"si",
		"visible_vista":	null,
		"consultable":	"si",
		"descarregable":	"no",
		"metadades":	null,
		"NomVideo":	null,
		"DescVideo":	null,
		"FlagsData": null,
		"data": null,
		"i_data": 0,
		"animable":	false, //··Segurament la capa es podria declarar animable si alguna capa té els temps "current" i és multitime.
		"AnimableMultiTime": false,  //··Segurament la capa es podria declarar AnimableMultiTime si alguna capa té els temps "current" i és multitime.
		"proces":	null,
		"ProcesMostrarTitolCapa" : false
		});

	if (i_capa<ParamCtrl.capa.length)  //això és fa després, donat que els índex de capa de la capa nova es poden referir a capes que s'han pogut.
		CanviaIndexosCapesSpliceCapa(1, i_capa, -1, ParamCtrl);

	CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

	//Redibuixo el navegador perquè les noves capes siguin visibles
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
}//Fi de AfegeixCapaCombicapaCategoric()

function AfegeixTransferenciaEstadistics()
{
var alguna_capa_afegida=false;
var condicio=[], capa=[], i_capes, i_cat, categories, categ_noves, atributs, atrib_nous=[], i_color_tipic;

	condicio[0]=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-combicap", "-valor", 2);
	condicio[1]=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-combicap", "-valor", 3);

	i_capes=[condicio[0].i_capa, condicio[1].i_capa];

	if(i_capes[0]==i_capes[1] &&
	   ((typeof condicio[0].i_estil==="undefined" && typeof condicio[1].i_estil==="undefined") ||
		 (!condicio[0].i_estil && !condicio[1].i_estil) ||
		 (condicio[0].i_estil && condicio[1].i_estil && condicio[0].i_estil==condicio[1].i_estil)) &&
	   ((typeof condicio[0].i_data==="undefined" && typeof condicio[1].i_data==="undefined") ||
		 (!condicio[0].i_data && !condicio[1].i_data) ||
		 (condicio[0].i_data && condicio[1].i_data && condicio[0].i_data==condicio[1].i_data)) )
	{
		alert(DonaCadenaLang({"cat":"Cal triar dues capes diferents o la mateixa en estils i/o dates diferents.",
							 "spa":"Es necesario elegir dos capas diferentes o la misma en estilos y/o fechas diferentes.",
							 "eng":"You should choose two different layers or the same in different styles and/or dates.",
							 "fre": "You should  choose two different layers or the same in different styles and/or dates."}));
		return;
	}

	capa[0]=ParamCtrl.capa[i_capes[0]];
	capa[1]=ParamCtrl.capa[i_capes[1]];

	//La descripció de les categories i la paleta és igual que la de la capa categòrica, la primera de la combinació
	//cat_noves=capa[0].estil[condicio[0].i_estil].categories;
	//colors=capa[0].estil[condicio[0].i_estil].paleta.colors;

	var n_dec_estad=4;

	//Creo la descripció dels atributs
	// a/ les categories com a primer atribut i tots els estadístics de la segona capa després
	for (var i_atrib_capa_0=0; i_atrib_capa_0<capa[0].estil[condicio[0].i_estil].atributs.length; i_atrib_capa_0++)
		atrib_nous.push(JSON.parse(JSON.stringify(capa[0].estil[condicio[0].i_estil].atributs[i_atrib_capa_0])));
	// b/ afegir els estadístics
	if (capa[1].estil[condicio[1].i_estil].categories && capa[1].estil[condicio[1].i_estil].atributs) //cas categòric
	{
		atrib_nous.push({nom: "$stat$_i_mode", descripcio: DonaCadenaLang(str_lang_mode), mostrar: "no"});
		atrib_nous.push({nom: "$stat$_mode", descripcio: DonaCadenaLang(str_lang_mode), mostrar: "si_ple"});
		atrib_nous.push({nom: "$stat$_percent_mode", descripcio: DonaCadenaLang(str_lang_percent_mode), mostrar: "si_ple", unitats: "%", NDecimals: n_dec_estad});
	}
	else
	{
		var n_atrib_ori=atrib_nous.length;
		/* marco alguns a mostrar "no" per provar que lo de darrera va, però després la idea és que quan s'esculli que vols crear estadístics
		quins vols que es mostrin (es calculen sempre tots)*/
		atrib_nous.push({nom: "$stat$_sum", descripcio: DonaCadenaLang(str_lang_sum), mostrar: "si_ple", simbol: "&Sigma;"});
		atrib_nous.push({nom: "$stat$_sum_area", descripcio: DonaCadenaLang(str_lang_sum_area), mostrar: "si_ple", simbol: "&Sigma;<small>a</small>"});
		atrib_nous.push({nom: "$stat$_mean", descripcio: DonaCadenaLang(str_lang_mean), mostrar: "si_ple", simbol: "x&#772"}); //x-bar
		atrib_nous.push({nom: "$stat$_variance", descripcio: DonaCadenaLang(str_lang_variance), mostrar: "si_ple", simbol: "&sigma;²"});
		atrib_nous.push({nom: "$stat$_stdev", descripcio: DonaCadenaLang(str_lang_stdev), mostrar: "si_ple", simbol: "&sigma;"});
		atrib_nous.push({nom: "$stat$_min", descripcio: DonaCadenaLang(str_lang_min), mostrar: "si_ple", simbol: "Min"});
		atrib_nous.push({nom: "$stat$_max", descripcio: DonaCadenaLang(str_lang_max), mostrar: "si_ple", simbol: "Max"});
		atrib_nous.push({nom: "$stat$_range", descripcio: DonaCadenaLang(str_lang_range), mostrar: "si_ple"});

		if (capa[1].estil[condicio[1].i_estil].DescItems)
		{
			for (var i=n_atrib_ori; i<atrib_nous.length; i++)
				atrib_nous[i].unitats=capa[1].estil[condicio[1].i_estil].DescItems;

			//per la sum_area les unitats són diferents -> buscar DonaUnitatsCoordenadesProj(crs) per mirar quines unitats he de concatenar al darrera
			atrib_nous[n_atrib_ori+1].unitats=capa[1].estil[condicio[1].i_estil].DescItems+"&sdot;m²";
			//la variança són les unitats al quadrat :)
			atrib_nous[n_atrib_ori+3].unitats="("+atrib_nous[n_atrib_ori+3].unitats+")²";
		}
		else //per la sum_area les unitats són les "no unitats"*m2 :)
			atrib_nous[n_atrib_ori+1].unitats="m²";

		if (capa[1].estil[condicio[1].i_estil].component[0].NDecimals)
		{
			for (var i=n_atrib_ori; i<atrib_nous.length; i++)
				atrib_nous[i].NDecimals=capa[1].estil[condicio[1].i_estil].component[0].NDecimals;
		}
		else /*si no hi havien decimals definits, en poso "2" pels camps calculats (on ens sortiran), però no als
			altres (així la suma, el rang, etc. els veure sesne decimals com la cpa original, pex DTM en m enters)*/
		{
			atrib_nous[n_atrib_ori+2].NDecimals=n_dec_estad;	//mean
			atrib_nous[n_atrib_ori+3].NDecimals=n_dec_estad;	//variance
			atrib_nous[n_atrib_ori+4].NDecimals=n_dec_estad;	//stdev
		}
	}

	//Creo la descripció de les categories, de moment només la original, les altres ja s'afegiran després
	categ_noves=JSON.parse(JSON.stringify(capa[0].estil[condicio[0].i_estil].categories));

	var cadena_desc=ConcatenaCadenes(ConcatenaCadenes((capa[0].DescLlegenda ? capa[0].DescLlegenda: capa[0].nom),{"cat":" amb estadistics de ","spa":" con estadísticos de ","eng":" with statistic of ", "fre":" avec statistiques des "}),(capa[1].DescLlegenda?capa[1].DescLlegenda: capa[1].nom));
	var desc_estil= capa[1].estil[condicio[1].i_estil].desc + DonaCadenaLang({"cat":" per categoria de","spa":" por categorías de ","eng":" by category of ", "fre":" par catégorie de "}) + capa[0].estil[condicio[0].i_estil].desc;
	var i_capa=Math.min.apply(Math, i_capes); //https://www.w3schools.com/js/js_function_apply.asp

	ParamCtrl.capa.splice(i_capa, 0, {"servidor": null,
		"versio": null,
		"tipus": null,
		//"nom":	"LayerWithStatistics", //capa[1].estil[condicio[1].i_estil].desc + "WithStatisticsOf" + capa[0].estil[condicio[0].i_estil].desc;
		"nom":	capa[1].estil[condicio[1].i_estil].desc + "WithStatisticsOf" + capa[0].estil[condicio[0].i_estil].desc,
		"desc":	(DonaCadena(capa[0].desc) ? DonaCadena(capa[0].desc) : (DonaCadena(capa[0].DescLlegenda) ? DonaCadena(capa[0].DescLlegenda): capa[0].nom)) + DonaCadenaLang({"cat":" amb estadistics de ","spa":" con estadísticos de ","eng":" with statistics of ", "fre":" avec statistiques par "}) + (DonaCadena(capa[1].desc) ? DonaCadena(capa[1].desc) : (DonaCadena(capa[1].DescLlegenda) ? DonaCadena(capa[1].DescLlegenda): capa[1].nom)),
		"CRS": (capa.length && capa[0].CRS) ? JSON.parse(JSON.stringify(capa[0].CRS)) : null,
		"EnvTotal": DeterminaEnvTotalDeCapes(i_capes),
		"FormatImatge": "application/x-img",
		"valors": [],
		"transparencia": "semitransparent",
		"CostatMinim": DeterminaCostatMinimDeCapes(i_capes),
		"CostatMaxim": DeterminaCostatMaximDeCapes(i_capes),
		"TileMatrixSet": null,
		"FormatConsulta": null,
		"grup":	null,
		"separa": DonaTextSeparadorCapaAfegida(i_capa),
		"DescLlegenda": cadena_desc,
		"estil": [{
			"nom":	null,
			"desc":	desc_estil,
			"TipusObj": "P",
			"component": [{"calcul": DonaCadenaEstilCapaPerCalcul(-1, condicio[0].i_capa, condicio[0].i_data, condicio[0].i_estil)},
										{"calcul": DonaCadenaEstilCapaPerCalcul(-1, condicio[1].i_capa, condicio[1].i_data, condicio[1].i_estil),
											"estiramentPaleta": capa[1].estil[condicio[1].i_estil].component[0].estiramentPaleta ? JSON.parse(JSON.stringify(capa[1].estil[condicio[1].i_estil].component[0].estiramentPaleta)) : null,
										 	"herenciaOrigen": {"nColors": (capa[1].estil[condicio[1].i_estil].paleta && capa[1].estil[condicio[1].i_estil].paleta.colors) ? capa[1].estil[condicio[1].i_estil].paleta.colors.length : 256,
										 		"categories": capa[1].estil[condicio[1].i_estil].categories ? JSON.parse(JSON.stringify(capa[1].estil[condicio[1].i_estil].categories)) : null,
										 		"atributs": capa[1].estil[condicio[1].i_estil].atributs ? JSON.parse(JSON.stringify(capa[1].estil[condicio[1].i_estil].atributs)) : null}
										}],
			"categories": categ_noves,
			"atributs": atrib_nous,
			"metadades": null,
			"ncol": 1,
			"paleta": (capa[0].estil[condicio[0].i_estil].paleta && capa[0].estil[condicio[0].i_estil].paleta.colors) ? {
				"colors": capa[0].estil[condicio[0].i_estil].paleta.colors
			} : null
		}],
		"i_estil":	0,
		"NColEstil":	1,
		"LlegDesplegada":	false,
		"VisibleALaLlegenda":	true,
		"visible":	"si",
		"visible_vista":	null,
		"consultable":	"si",
		"descarregable":	"no",
		"metadades":	null,
		"NomVideo":	null,
		"DescVideo":	null,
		"FlagsData": null,
		"data": null,
		"i_data": 0,
		"animable":	false, //··Segurament la capa es podria declarar animable si alguna capa té els temps "current" i és multitime.
		"AnimableMultiTime": false,  //··Segurament la capa es podria declarar AnimableMultiTime si alguna capa té els temps "current" i és multitime.
		"proces":	null,
		"ProcesMostrarTitolCapa" : false
		});

	if (i_capa<ParamCtrl.capa.length)  //això és fa després, donat que els índex de capa de la capa nova es poden referir a capes que s'han pogut.
		CanviaIndexosCapesSpliceCapa(1, i_capa, -1, ParamCtrl);

	CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

	//Redibuixo el navegador perquè les noves capes siguin visibles
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
}//Fi de AfegeixTransferenciaEstadistics()

function DonaOldNewDeCadenaReclass(linia_reclass, i_linia, categories,atributs)
{
var i, old_value, old_up_value, new_value, desc_value, inici, final;

	i=linia_reclass.indexOf(";");

	if(i==0)  // la línia és un comentari
		return null;

	if(i!=-1)
	{
		// tinc descripció
		desc_value=TreuCometesDePrincipiIFinalDeCadena(linia_reclass.substring(i+1).trim());
		linia_reclass=linia_reclass.substring(0,i);
	}

	// Si faig un split i hi ha dos espais en blanc seguits, m'ho dividirà en un element per cada espai, i
	// això no és el que vull
	/* var elem_reclass = (linia_reclass.trim()).split(" ");
	if(elem_reclass.length<2 || elem_reclass.length>3)
	{
		alert(DonaCadenaLang({"cat": "Nombre d'elements incorrecte a la línia",
							 "spa": "Número de elementos incorrecto en la línea",
							 "eng": "Wrong number of elements in line",
							 "fre": "Wrong number of elements in line"})+" "+i_linia+": "+linia_reclass);
		return null;
	}
	old_value=elem_reclass[0];
	if(elem_reclass.length>2)
	{
		old_up_value=elem_reclass[1].trim();
		new_value=elem_reclass[2].trim();
	}
	else
	{
		old_up_value=null;
		new_value=elem_reclass[1].trim();
	}
	if(NaN==parseFloat(old_value) || (old_up_value && NaN==parseFloat(old_up_value)) || NaN==parseFloat(new_value))
	{
		alert(DonaCadenaLang({"cat": "Format incorrecte dels valors a la línia",
							 "spa": "Formato incorrecto de los valores en la línea",
							 "eng": "Wrong values format in line",
							 "fre": "Wrong values format in line"})+" "+i_linia+": "+linia_reclass);
		return null;
	}*/
	var elem_reclass =linia_reclass.trim();
	if(-1==(i = elem_reclass.search(/[\s|\t]/i))) //no pot ser indexOf perquè és una regular expression
	{
		alert(DonaCadenaLang({"cat": "Nombre d'elements incorrecte a la línia",
							 "spa": "Número de elementos incorrecto en la línea",
							 "eng": "Wrong number of elements in line",
							 "fre": "Wrong number of elements in line"})+" "+i_linia+": "+linia_reclass);
		return null;
	}
	old_value=elem_reclass.substring(0,i);
	elem_reclass=elem_reclass.substring(i+1,elem_reclass.length).trim();
	i = elem_reclass.search(/[\s|\t]/i); 	//no pot ser indexOf perquè és una regular expression
	if(i!=-1)
	{
		old_up_value=elem_reclass.substring(0,i);
		elem_reclass=elem_reclass.substring(i+1,elem_reclass.length).trim();
		if(-1!=(i = elem_reclass.search(/[\s|\t]/i)))	 //no pot ser indexOf perquè és una regular expression
		{
			alert(DonaCadenaLang({"cat": "Nombre d'elements incorrecte a la línia",
							 "spa": "Número de elementos incorrecto en la línea",
							 "eng": "Wrong number of elements in line",
							 "fre": "Wrong number of elements in line"})+" "+i_linia+": "+linia_reclass);
			return null;
		}
	}
	else
		old_up_value=null;

	new_value=elem_reclass;

	// Ara he de buscar si cal les equivalències entre categories i valors
	if(!categories)
	{
		if(NaN==parseFloat(old_value) || (old_up_value && NaN==parseFloat(old_up_value)))
		{
			alert(DonaCadenaLang({"cat": "Format incorrecte dels valors a la línia",
								 "spa": "Formato incorrecto de los valores en la línea",
								 "eng": "Wrong values format in line",
								 "fre": "Wrong values format in line"})+" "+i_linia+": "+linia_reclass);
			return null;
		}
		if(new_value.toUpperCase=="REMOVE")
			new_value=NaN;
		else if(NaN==parseFloat(new_value))
		{
			alert(DonaCadenaLang({"cat": "Format incorrecte dels valors a la línia",
								 "spa": "Formato incorrecto de los valores en la línea",
								 "eng": "Wrong values format in line",
								 "fre": "Wrong values format in line"})+" "+i_linia+": "+linia_reclass);
			return null;
		}
	}
	else
	{
		if(-1!=old_value.search(/["|']/i)) 	//no pot ser indexOf perquè és una regular expression
		{
			old_value=TreuCometesDePrincipiIFinalDeCadena(old_value);
			for(i=0; i<categories.length; i++)
			{
				if(categories[i] && categories[i][atributs[0].nom].toLowerCase()==old_value.toLowerCase())
				{
					old_value=i;
					break;
				}
			}
			if(i==categories.length)
			{
				alert(DonaCadenaLang({"cat": "Valor a canviar incorrecte a la línia",
								 "spa": "Valor a cambiar incorrecto en la línea",
								 "eng": "Wrong old value in line",
								 "fre": "Wrong old value in line"})+" "+i_linia+": "+linia_reclass);
				return null;
			}
		}
		if(-1!=new_value.search(/["|']/i))  //no pot ser indexOf perquè és una regular expression
		{
			new_value=TreuCometesDePrincipiIFinalDeCadena(new_value.trim());
			for(i=0; i<categories.length; i++)
			{
				if(categories[i] && categories[i][atributs[0].nom].toLowerCase()==new_value.toLowerCase())
				{
					new_value=i;
					break;
				}
			}
			if(i==categories.length)
			{
				if(!desc_value)
					desc_value=new_value;
				new_value=categories.length;
			}
		}
		else if(new_value.toUpperCase=="REMOVE")
			new_value=NaN;
		if(old_up_value && -1!=old_up_value.search(/["|']/i))	 //no pot ser indexOf perquè és una regular expression
		{
			old_up_value=TreuCometesDePrincipiIFinalDeCadena(old_up_value.trim());
			for(i=0; i<categories.length; i++)
			{
				if(categories[i] && categories[i][atributs[0].nom].toLowerCase()==old_up_value.toLowerCase())
				{
					old_up_value=i;
					break;
				}
			}
			if(i==categories.length)
			{
				alert(DonaCadenaLang({"cat": "Valor a canviar incorrecte a la línia",
								 "spa": "Valor a cambiar incorrecto en la línea",
								 "eng": "Wrong old value in line",
								 "fre": "Wrong old value in line"})+" "+i_linia+": "+linia_reclass);
				return null;
			}
		}
	}
	return {"old_value": old_value, "old_up_value": old_up_value, "new_value": new_value, "desc_value": desc_value};
}

function AfegeixEstilReclassificacio(prefix_id, i_capa)
{
var condicio, capa, i_estil_nou, estil, i, i_value, i_color, i_color_tipic, cadena_reclass, linia_reclass, v, value, cadena_calcul;

	if (!PaletesGlobals)
	{
		loadJSON("paletes.json",
			function(paletes_globals, extra_param) {
				PaletesGlobals=paletes_globals;
				AfegeixEstilReclassificacio(extra_param.prefix_id, extra_param.i_capa);
			},
			function(xhr) { alert(xhr); },
			{prefix_id : prefix_id, i_capa: i_capa});
		return;
	}

	condicio=LlegeixParametresCondicioCapaDataEstil(prefix_id, "-valor", 0);
	capa=ParamCtrl.capa[condicio.i_capa];
	cadena_reclass=document.ReclassificadoraCapes.reclassificacio.value;

	//Crea un nou estil
	i_estil_nou=capa.estil.length;
	capa.estil[capa.estil.length]=JSON.parse(JSON.stringify(capa.estil[(condicio.i_estil) ? condicio.i_estil : 0]));
	estil=capa.estil[i_estil_nou];

	estil.desc=document.ReclassificadoraCapes.nom_estil.value;

	// Creo el component si no existeix
	if (!estil.component || estil.component.length==0)
	{
		estil.component=[{}];
		estil.component[0].estiramentPaleta=null;
	}

	i_color_tipic=0;
	v=DonaCadenaEstilCapaPerCalcul(-1, condicio.i_capa, condicio.i_data, condicio.i_estil);
	linia_reclass=cadena_reclass.split("\n");
	for (i=i_value=0; i<linia_reclass.length; i++)
	{
		if(value=DonaOldNewDeCadenaReclass(linia_reclass[i], i, estil.categories, estil.atributs))
		{
			if (i_value==0)
				cadena_calcul=v;
			if (value.old_up_value)
				cadena_calcul="(("+v+">="+value.old_value+" && "+v+"<"+value.old_up_value+") ? "+value.new_value+" : " + cadena_calcul;
			else
				cadena_calcul="(("+v+"=="+value.old_value+") ? "+value.new_value+" : "+cadena_calcul;
			cadena_calcul+=")";

			// He d'afegir o modificar les noves descripcions
			if(estil.categories)
			{
				if(!estil.categories[value.new_value])
				{
					estil.categories[value.new_value]={};
					estil.categories[value.new_value][estil.atributs[0].nom]=value.desc_value;
				}
				else if (value.desc_value)
					estil.categories[value.new_value][estil.atributs[0].nom]=value.desc_value;
			}

			// Modifico la paleta
			if(estil.paleta && value.new_value>=estil.paleta.colors.length)
			{
				for(i_color=estil.paleta.colors.length; i_color<value.new_value+1; i_color++)
				{
					if (i_color_tipic==PaletesGlobals.categoric.tableau20.colors.length)
						i_color_tipic=0;
					estil.paleta.colors.push(PaletesGlobals.categoric.tableau20.colors[i_color_tipic]);
					i_color_tipic++;
				}
			}

			// Modifico l'estirament si cal
			if(estil.component[0].estiramentPaleta)
			{
				if(value.new_value>estil.component[0].estiramentPaleta.valorMaxim)
					estil.component[0].estiramentPaleta.valorMaxim=value.new_value;
				if(value.new_value<estil.component[0].estiramentPaleta.valorMinim)
				  estil.component[0].estiramentPaleta.valorMinim=value.new_value;
			}
			i_value++;
		}
	}
	estil.component[0].calcul=cadena_calcul;
	delete estil.component[0].FormulaConsulta;

	if (capa.visible=="ara_no")
		CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
	else
		CreaLlegenda();

	//Defineix el nou estil com estil actiu
	CanviaEstilCapa(i_capa, i_estil_nou, false);

}//Fi de AfegeixEstilReclassificacio()

function SeleccionaTotesLesCapesDelServidor(form)
{
var i;

	if(form.sel_capes.length!=null)
	{
		if(form.seltotes_capes.checked=="1") //Seleccionar totes les capes
		{
			for(i=0; i<form.sel_capes.length; i++)
				form.sel_capes[i].checked=true;
		}
		else //Deseleccionar totes les capes
		{
			for(i=0; i<form.sel_capes.length; i++)
				form.sel_capes[i].checked=false;
		}
	}
	else
	{
		if(form.seltotes_capes.checked=="1") //Seleccionar totes les capes
		{
			form.sel_capes.checked=true;
		}
		else //Deseleccionar totes les capes
		{
			form.sel_capes.checked=false;
		}
	}
}


var ajaxGetCapabilities=[];
var ServidorGetCapabilities=[];

function CreaCapaServidor()
{
	this.nom = null;
	this.desc = null;
	this.CostatMinim = null;
	this.CostatMaxim = null;
	this.consultable = false;
	this.estil = [];
	this.FlagsData=null;
	this.i_data=0;
	this.data=null;
}

function LlegeixLayer(servidorGC, node, sistema_ref_comu, pare)
{
var i, j, node2, trobat=false, cadena, cadena2;
var minim, maxim, factor_k, factorpixel;

	//Llegeixo les capacitats d'aquesta capa
	//Començo pel sistema de referència
	//versió 1.0.0, 1.1.0 i 1.1.1 en l'estil antic --> un únic element amb els diversos sistemes de referència separats per espais (SRS)
    //versió 1.1.1 en l'estil nou--> un element per cada sistema de referència (SRS)
	//versió major a 1.1.1 --> un element per cada sistema de referència (CRS)


	if(DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)=="°")
	{
		factor_k=120000*1000/0.28;  //pas de graus a mm dividit per la mida de píxel
		factorpixel=120000; // de graus a metres
	}
	else //if(unitats=="m")
	{
		factor_k=1000/0.28;  // pas de m a mm dividit per la mida de píxel
		factorpixel=1; //de m a m
	}

	//Això no ho puc usar perquè em dona els elements SRS de node i dels seus fills node.getElementsByTagName('SRS');
	for(i=0; i<node.childNodes.length; i++)
	{
		node2=node.childNodes[i];
		if(node2.nodeName=="SRS" || node2.nodeName=="CRS")
		{
			cadena=node2.childNodes[0].nodeValue;
			if(cadena)
			{
				cadena=cadena.toUpperCase();
				cadena2=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase();
				if(cadena.indexOf(cadena2)!=-1)
				{
					//·$·Aqui s'haurà de fer alguna cosa amb els sinònims,...
					trobat=true;
					break;
				}
			}
		}
	}
	if(trobat || sistema_ref_comu)
	{
		for(i=0; i<node.childNodes.length; i++)
		{
			node2=node.childNodes[i];
			if(node2.nodeName=="Name")
			{
				//Llegeix-ho la capa si té name
				servidorGC.layer[servidorGC.layer.length]=new CreaCapaServidor();
				servidorGC.layer[servidorGC.layer.length-1].nom=node2.childNodes[0].nodeValue;
				//hereto les coses del pare
				if(pare)
				{
					if(pare.consultable)
						servidorGC.layer[servidorGC.layer.length-1].consultable=true;
					if(pare.estil)
					{
						for(j=0; j<pare.estil.length; j++)
							servidorGC.layer[servidorGC.layer.length-1].estil[servidorGC.layer[servidorGC.layer.length-1].estil.length]=pare.estil[j];
					}
					servidorGC.layer[servidorGC.layer.length-1].CostatMinim=pare.CostatMinim;
					servidorGC.layer[servidorGC.layer.length-1].CostatMaxim=pare.CostatMaxim;
				}
				break;
			}
		}

		if(i<node.childNodes.length)  //vol dir que aquesta capa té name
		{
			var temps_defecte=null, valors_temps=null;
			for(i=0; i<node.childNodes.length; i++)
			{
				node2=node.childNodes[i];

				if(node2.nodeName=="Title")
				{
					servidorGC.layer[servidorGC.layer.length-1].desc=node2.childNodes[0].nodeValue;
				}
				else if(node2.nodeName=="Style")
				{
					node3=node2.getElementsByTagName('Name');
					if(node3 && node3.length>0)
					{
						cadena=node3[0].childNodes[0].nodeValue;
						node3=node2.getElementsByTagName('Title');
						if(node3 && node3.length>0)
							cadena2=node3[0].childNodes[0].nodeValue;
						servidorGC.layer[servidorGC.layer.length-1].estil[servidorGC.layer[servidorGC.layer.length-1].estil.length]={"nom": cadena, "desc": cadena2};
					}
				}
				else if(node2.nodeName=="ScaleHint")
				{
					minim=parseInt(node2.getAttribute('min'));
					maxim=parseInt(node2.getAttribute('max'));
					if(minim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMinim=minim/Math.SQRT2;
					if(maxim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMaxim=maxim/Math.SQRT2;
				}
				else if(node2.nodeName=="MinScaleDenominator")
				{
					minim=parseInt(node2.childNodes[0].nodeValue);
					if(minim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMinim=minim*factorpixel/factor_k;
				}
				else if(node2.nodeName=="MaxScaleDenominator")
				{
					maxim=parseInt(node2.childNodes[0].nodeValue);
					if(maxim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMaxim=maxim*factorpixel/factor_k;
				}
				else if ((node2.nodeName=="Dimension" || node2.nodeName=="Extent") && node2.getAttribute('name').toLowerCase()=='time')
				{
					temps_defecte=node2.getAttribute('default');
					if(node2.childNodes.length>0)
						valors_temps=node2.childNodes[0].nodeValue;
				}
			}
			//Miro si és consultable
			if(node.getAttribute('queryable')=='1')
			{
				servidorGC.layer[servidorGC.layer.length-1].consultable=true;
			}
			if(valors_temps!=null)
			{
				if(valors_temps.indexOf("/")==-1)  //Si és un interval (!=-1) de moment no li dono suport ·$·
				{
					var data_defecte=null;
					var dates;
					//És una capa multitemporal
					//valors_temps és una cadena que pot contenir un únic valor, una llista de valors separats per coma o un interval amb període
					//yyyy-mm-ddThh:mm:ss.sssZ
					if(temps_defecte)
					{
						var data_defecte;
						OmpleDataJSONAPartirDeDataISO8601(data_defecte, temps_defecte);
					}
					servidorGC.layer[servidorGC.layer.length-1].data=[];
					dates=valors_temps.split(",");
					for(i=0; i<dates.length; i++)
					{
						//servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length]=new Date();
						if(i==0)
						{
							servidorGC.layer[servidorGC.layer.length-1].FlagsData=OmpleDataJSONAPartirDeDataISO8601(
														servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length],
														dates[i]);
						}
						else
							OmpleDataJSONAPartirDeDataISO8601(servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length],
														dates[i]);
						if(data_defecte &&
						   servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length-1]==data_defecte)
							servidorGC.layer[servidorGC.layer.length-1].i_data=servidorGC.layer[servidorGC.layer.length-1].data.length-1;
					}
				}
			}
		}
	}

	//Si aquesta layer té fills continuo llegint
	node2=node.getElementsByTagName('Layer');
	if(node2)
	{
		var pare2=servidorGC.layer[servidorGC.layer.length-1];
		for(i=0; i<node2.length; i++)
			LlegeixLayer(servidorGC, node2[i], trobat, pare2);
	}
}//Fi de LlegeixLayer()

function HiHaAlgunErrorDeParsejat(doc)
{
	if (doc.parseError && doc.parseError.errorCode != 0)
    {
	    alert("Error in line " + doc.parseError.line +
				" position " + doc.parseError.linePos +
				"\nError Code: " + doc.parseError.errorCode +
				"\nError Reason: " + doc.parseError.reason +
				"Error Line: " + doc.parseError.srcText);
	    return true;
    }
	else if (doc.documentElement.nodeName=="parsererror")
	{
		var errStr=doc.documentElement.childNodes[0].nodeValue;
		errStr=errStr.replace(/</g, "&lt;");
		alert(errStr);
		return true;
	}
	return false;
}

function ParsejaRespostaGetCapabilities(doc, servidorGC)
{
var root, cadena, node, node2, i, j, cdns=[];

	if(!doc)
	{
		alert(DonaCadenaLang({"cat":"No s'ha obtingut cap resposta vàlida del servidor sol·licitat",
						  "spa":"No se ha obtenido ninguna respuesta válida del servidor solicitado",
						  "eng":"Cannot obtain any valid response of server",
						  "fre":"Aucune réponse valide a été obtenue depuis le serveur sollicité"}));
		return;
	}
	if(HiHaAlgunErrorDeParsejat(doc))
		return;
	root=doc.documentElement;
	if(!root)
	{
		alert(DonaCadenaLang({"cat":"No s'ha obtingut cap resposta vàlida del servidor sol·licitat",
						  "spa":"No se ha obtenido ninguna respuesta válida del servidor solicitado",
						  "eng":"Cannot obtain any valid response of server",
						  "fre":"Aucune réponse valide a été obtenue depuis le serveur sollicité"}));
		return;
	}

	//Cal comprovar que és un document de capacitats, potser és un error, en aquest cas el llegeix-ho i el mostraré directament
	if(root.nodeName!="WMT_MS_Capabilities")
	{
		alert(DonaCadenaLang({"cat":"No s'ha obtingut cap resposta vàlida del servidor sol·licitat",
						  "spa":"No se ha obtenido ninguna respuesta válida del servidor solicitado",
						  "eng":"Cannot obtain any valid response of server",
						  "fre":"Aucune réponse valide a été obtenue depuis le serveur sollicité"}));
		//·$· mirar de possar el que ens ha retornat el servidor
		return;
	}

	//Obtinc la versió de les capacitats
	cadena=root.getAttribute('version');
	servidorGC.versio={"Vers": parseInt(cadena.substr(0,1)), "SubVers": parseInt(cadena.substr(2,1)), "VariantVers": parseInt(cadena.substr(4))};

	//Obtinc el títol del servidor, és obligatòri però podria ser que algun servidor posses el tag sense valor
	servidorGC.titol="";
	node=root.getElementsByTagName('Service')[0];
	if(node)
	{
		node2=node.getElementsByTagName('Title')[0];
		if(node2 && node2.hasChildNodes())
			servidorGC.titol=node2.childNodes[0].nodeValue;
	}

	//Selecciono el node request
	node=(root.getElementsByTagName('Capability')[0]).getElementsByTagName('Request')[0];

	//Formats de visualització
	if(servidorGC.versio.Vers==1 && servidorGC.versio.SubVers==0)
	{
		node2=(node.getElementsByTagName('Map')[0]).getElementsByTagName('Format');
		for(i=0; i<node2[0].childNodes.length; i++)
		{
			cadena=node2[0].childNodes[i].nodeName;
			if(cadena.search(/JPEG/i)!=-1)			//no pot ser indexOf perquè és una regular expression
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/jpeg";
			else if(cadena.search(/GIF/i)!=-1) 	//no pot ser indexOf perquè és una regular expression
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/gif";
			else if(cadena.search(/PNG/i)!=-1)	//no pot ser indexOf perquè és una regular expression
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/png";
		}
	}
	else
	{
		node2=(node.getElementsByTagName('GetMap')[0]).getElementsByTagName('Format');
		for(i=0; i<node2.length; i++)
		{
			cadena=node2[i].childNodes[0].nodeValue;
			if(cadena)
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]=cadena;
		}
	}

	//Formats de consulta
	if(servidorGC.versio.Vers==1 && servidorGC.versio.SubVers==0)
	{
		node2=node.getElementsByTagName('FeatureInfo')[0];
		if(node2)
		{
			node2=node2.getElementsByTagName('Format');
			for(i=0; i<node2[0].childNodes.length; i++)
			{
				cadena=node2[0].childNodes[i].nodeName;
				if(cadena)
				{
					if(cadena.search(/XML/i)!=-1)					//no pot ser indexOf perquè és una regular expression
						servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]="text/xml";
					else if(cadena.search(/HTML/i)!=-1)		//no pot ser indexOf perquè és una regular expression
						servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]="text/html";
				}
			}
		}
	}
	else
	{
		node2=node.getElementsByTagName('GetFeatureInfo')[0];
		if(node2)
		{
			node2=node2.getElementsByTagName('Format');
			for(i=0; i<node2.length; i++)
			{
				cadena=node2[i].childNodes[0].nodeValue;
				if(cadena)
					servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]=cadena;
			}
		}
	}

	//Llegeix-ho les capes disponibles en el sistema de referència actual del navegador
	node=root.getElementsByTagName('Capability')[0];
	for(i=0; i<node.childNodes.length; i++)
	{
		node2=node.childNodes[i];
		if(node2.nodeName=="Layer")  //És una layer que a dins pot tenir altres layers
		{
			//Si té name vol dir que és una capa de veritat, sinó és que és una capa d'agrupació
			LlegeixLayer(servidorGC, node2, false, null);
		}
	}
	if(servidorGC.layer.length>0)
	{
		cdns.push("<b>",
			  	DonaCadenaLang({"cat":"URL del servidor:", "spa":"URL del servidor:", "eng":"server URL:", "fre":"URL du serveur:"}),
			  	"</b><br><input type=\"text\" name=\"servidor\" readOnly style=\"width:400px;\" value=\"",
			  	servidorGC.servidor, "\" />",
				  "<br><br><b>",
				  DonaCadenaLang({"cat":"T&iacute;tol", "spa":"T&iacute;tulo", "eng":"Title", "fre":"Titre"}),
				  "</b><br><input type=\"text\" name=\"TitolServidor\" style=\"width:400px;\"");
		if(servidorGC.titol)
	  		cdns.push(" value=\"",servidorGC.titol, "\"");
		cdns.push(" /><br><br><hr><br><div class=\"layerselectorcapesafegir\">",
				  "<b>",DonaCadenaLang({"cat":"Capes","spa":"Capas","eng":"Layers","fre":"Couches"}),"</b><br>",
				  "<input name=\"seltotes_capes\" onclick=\"SeleccionaTotesLesCapesDelServidor(form);\" type=\"checkbox\" />",
				  DonaCadenaLang({"cat":"Seleccionar totes les capes", "spa":"Seleccionar todas las capas", "eng":"Select all layers", "fre":"Sélectionner toutes les couches"}), "<br><br><table class=\"Verdana11px\">");
		for(i=0; i<servidorGC.layer.length; i++)
		{
			cdns.push("<tr><td><input name=\"sel_capes\" value=\"", i, "\" type=\"checkbox\">",
					(servidorGC.layer[i].desc? servidorGC.layer[i].desc : servidorGC.layer[i].nom));
			cdns.push("</td><td><select name=\"format_capa_", i, "\" class=\"Verdana11px\">");
			for(j=0; j<servidorGC.formatGetMap.length; j++)
				cdns.push("<option value=\"", j, "\">",  servidorGC.formatGetMap[j]);
			cdns.push("</select></td></tr>");
		}
		cdns.push("</table></div><br>",
				  "<input type=\"button\" class=\"Verdana11px\" value=\"",
				  DonaCadenaLang({"cat":"Afegir\"", "spa":"A&ntilde;adir\"", "eng":"Add\"", "fre":"Ajouter\""}),
				  " onClick='AfegirCapesAlNavegador(form, ",servidorGC.index,");TancaFinestraLayer(\"afegirCapa\");' />",
				  "<input type=\"button\" class=\"Verdana11px\" value=\"",
				  DonaCadenaLang({"cat":"Cancel·lar\"", "spa":"Cancelar\"", "eng":"Cancel\"", "fre":"Annuler\""}),
				  " onClick='TancaFinestraLayer(\"afegirCapa\");' />");
		document.getElementById("LayerAfegeixCapaServidor").innerHTML=cdns.join("");
	}
	else
	{
		alert(DonaCadenaLang({"cat":"Aquest servidor no té cap capa disponible en el sistema de referència actual del navegador",
						  "spa":"Este servidor no tiene ninguna capa disponible en el sistema de referéncia actual del navegador",
						  "eng":"This server don't have any layer in the browser actual reference system",
						  "fre":"Ce serveur n'a aucune couche disponible dans le système de référence actuel du navigateur"}));
	}
}//Fi de ParsejaRespostaGetCapabilities()

function FesPeticioCapacitatsIParsejaResposta(form, i_capa)
{
var servidor=form.servidor.value;
var request;

	if(servidor)
		servidor=servidor.trim();

	if(!servidor || servidor=="")
	{

		//·$· Crec que caldria mirar més a fons que l'adreça sigui vàlida
		alert(DonaCadenaLang({"cat":"Cal indicar una adreça vàlida",
							 "spa":"Se debe indicar una dirección válida",
							 "eng":"Its necessary indicated a valid URL",
							 "fre":"Vous devez indiquer une adresse valide"}));
		return;
	}
	ajaxGetCapabilities[ajaxGetCapabilities.length]=new Ajax();
	ServidorGetCapabilities[ServidorGetCapabilities.length]={"win": window,
								"index": ServidorGetCapabilities.length,
								"i_capa_on_afegir": i_capa,
								"servidor": servidor,
								"versio": null,
								"tipus": "TipusWMS",
								"titol": null,
								"formatGetMap": [],
								"formatGetFeatureInfo": [],
								"layer": []};

	request=AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION=1.1.0&SERVICE=WMS", true);
	ajaxGetCapabilities[ajaxGetCapabilities.length-1].doGet(request,
				ParsejaRespostaGetCapabilities, "text/xml",
				ServidorGetCapabilities[ServidorGetCapabilities.length-1]);
}//Fi de FesPeticioCapacitatsIParsejaResposta

function ActualitzaLlistaServSegonsCategoriaSel(form)
{
var nova_opcio;
var i, j;

	var categoria_sel=form.llista_cat_serveis_OWS.options[form.llista_cat_serveis_OWS.selectedIndex].value;
	DonaCadena(LlistaServOWS[0].categoria.desc).toLowerCase();
	form.llista_serveis_OWS.options.length=0;
	i=0;
	while( i<LlistaServOWS.length && categoria_sel!=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
		i++;
	j=0;
	form.llista_serveis_OWS.options[j]=new Option(DonaCadenaLang({"cat":"--Seleccciona'n un de la llista--", "spa":"--Escoja uno de la lista--","eng": "--Choose one from list--", "fre":"--Sélectionnez un objet de la liste--"}), "");
	j++;
	while(i<LlistaServOWS.length && categoria_sel==DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
	{
		form.llista_serveis_OWS.options[j]=new Option(DonaCadena(LlistaServOWS[i].nom), LlistaServOWS[i].url);
		j++;
		i++;
	}
}

function MostraServidorSeleccionatDeLlistaOWSAEdit(form)
{
var url_a_mostrar;
	if(form.llista_serveis_OWS.selectedIndex>0)
		url_a_mostrar=form.llista_serveis_OWS.options[form.llista_serveis_OWS.selectedIndex].value;
	if(url_a_mostrar)
		form.servidor.value=url_a_mostrar;
}

function OrdenacioServOWSPerCategoriaINom(a,b) {
	//Ascendent per identificador i descendent per data
    var x = DonaCadena(a.categoria.desc);
    var y = DonaCadena(b.categoria.desc);

	//podria ser que en un dels idiomes no estigués indicat
	if(x==null && y==null)
		return 0;
	if(x==null)
		return -1;
	if(y==null)
		return 1;

	x = x.toLowerCase();
    y = y.toLowerCase();

	if(x < y)
		return -1;
	if(x > y)
		return 1;

	//Si són iguals ho ordeno pel nom
	x = DonaCadena(a.nom);
    y = DonaCadena(b.nom);
	if(x==null && y==null)
		return 0;
	if(x==null)
		return -1;
	if(y==null)
		return 1;

	x = x.toLowerCase();
    y = y.toLowerCase();

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function PreparaLlistaServidorsOWS()
{
	if (!LlistaServOWS)
		return;
	for(var i=0; i<LlistaServOWS.length; i++)
	{
		if(!LlistaServOWS[i].categoria || DonaCadena(LlistaServOWS[i].categoria.desc)==null)
			LlistaServOWS[i].categoria={"nom": "Altres", "desc": {"cat": "ZZAltresZZ", "spa": "ZZOtrosZZ", "eng": "ZZOthersZZ", "fre": "ZZAutresZZ"}};
	}
	LlistaServOWS.sort(OrdenacioServOWSPerCategoriaINom);
}

function EscriuCapaALaFormulaAfegeixCapa()
{
var condicio=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-calcul", "-valor", 0);
var calcul=document.CalculadoraCapes.calcul;
	calcul.focus();
	calcul.value = calcul.value.substring(0, calcul.selectionStart)+DonaCadenaEstilCapaPerCalcul(-1, condicio.i_capa, condicio.i_data, condicio.i_estil)+calcul.value.substring(calcul.selectionEnd);
}

function EscriuOperadorALaFormulaAfegeixCapa(prefix, sufix)
{
var calcul=document.CalculadoraCapes.calcul;
	calcul.focus();
	if (sufix)
		calcul.value = calcul.value.substring(0, calcul.selectionStart)+ prefix + calcul.value.substring(calcul.selectionStart, calcul.selectionEnd) + sufix + calcul.value.substring(calcul.selectionEnd);
	else
		calcul.value = calcul.value.substring(0, calcul.selectionStart)+ prefix + calcul.value.substring(calcul.selectionEnd);
}

function EscriuValorALaReclasssificacioAfegeixCapa(prefix_id)
{
var condicio, reclassificacio, valor, text_valor;

	condicio=LlegeixParametresCondicioCapaDataEstil(prefix_id, "-valor", 0);
	reclassificacio=document.ReclassificadoraCapes.reclassificacio;
	reclassificacio.focus();
	valor=eval("document.ReclassificadoraCapes.valor"+0+".value");
	if(valor && valor!="")
		text_valor="\""+DonaTextCategoriaDesDeColor(ParamCtrl.capa[condicio.i_capa].estil[condicio.i_estil].categories, ParamCtrl.capa[condicio.i_capa].estil[condicio.i_estil].atributs, valor, true)+"\"";
	else
		text_valor="";
	reclassificacio.value = reclassificacio.value.substring(0, reclassificacio.selectionStart)+text_valor+reclassificacio.value.substring(reclassificacio.selectionEnd);
}

function EsCapaAmbAlgunEstilAmbCategories(capa)
{
	if(!capa.estil)
		return false;
	for (var i=0; i<capa.estil.length; i++)
	{
		if(capa.estil[i].categories)
			return true;
	}
	return false;
}

function DonaCadenaInfoReclassificacio()
{
var cdns=[];

	cdns.push("<br><fieldset><legend>",
			  "Supported reclassification formats:</legend>",
			  "<span class=\"Verdana11px\">",
			  "<b>Unique value or category:</b> old new;new_description<br>",
			  "<b>Interval:</b> old old_just_below new new_description<br><br>",
			  "Help in mode \"Unique value\":<br>",
			  "If you want to assign 3 to values equal to 5 and 2 to values equal to 4, please write:<br>",
			  "<pre>	5	3;\"herbaceous crops\"\n	4	2;beaches</pre><br>",
			  "If you want to assign \"Rivers\" to cageories equal to \"Waters\", please write:<br>",
			  "<pre>	\"Waters\"	\"Rivers\"</pre><br>",
			  "If you want to delete \"Waters\" category, please write:<br>",
			  "<pre>	\"Waters\"	REMOVE</pre><br>",
			  "Help in mode \"Interval\":<br>",
			  "If you want to assign 9 to values comprised within the interval [5,7), please write:<br>",
			  "<pre>	5	7	9;crops</pre>",
			  "(please note that in this case 7 is NOT assigned to 9 since the upper limit is always open)<br>",
			  "If you want to delete the values comprised within the interval [5,7), please write:<br>",
			  "<pre>	5	7	REMOVE</pre>",
			  "</span></fieldset>");
	return cdns.join("");
}


function IniciaFinestraInformacio(nom_funcio)
{
var elem=ObreFinestra(window, "info", DonaCadenaLang({"cat":"per mostrar informació o ajuda",
						  "spa":"para mostrar información o ayuda",
						  "eng":"to show information or help",
						  "fre":"pour afficher des informations ou de l'aide"}));
	if (!elem)
		return;

	contentLayer(elem, nom_funcio);
}

function DonaCadenaReclassificadoraCapes(prefix_id, i_capa)
{
var cdns=[], i, capa;

	cdns.push("<form name=\"ReclassificadoraCapes\" onSubmit=\"return false;\">");
	capa=ParamCtrl.capa[i_capa];

	cdns.push("<br><fieldset><legend>",
			  DonaCadenaLang({"cat":"Afegeix capa reclassificada com un nou estil", "spa":"Añada capa reclasificada como un nuevo estilo",
							"eng":"Add reclassified layer as a new style", "fre":"Ajouter une couche reclassée en tant que nouveau style"}),
			  "</legend>",
			  "<fieldset><legend>",
			  DonaCadenaLang({"cat":"Capa a reclassificar ", "spa":"Capa a reclasificar ", "eng":"Layer to reclassify", "fre":"Couche à reclassifier"}),
			  "</legend>",
			  "<input type=\"hidden\" value=\"",i_capa,"\" id=\"", prefix_id, "-valor-capa-",0,"\" name=\"","valor_capa", 0, "\" />", DonaCadena(capa.DescLlegenda), "<br>",
			  DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, 0, {vull_operador: false, nomes_categoric: false, vull_valors: true}),
			  "</fieldset>");

	cdns.push(DonaCadenaLang({"cat":"Fórmula de reclassificació", "spa":"Fórmula de reclasificación:", "eng":"Reclassifying expression", "fre":"Formule de reclassement"}),
				"<input type=\"button\" class=\"Verdana11px\" value=\"i\" onClick='IniciaFinestraInformacio(DonaCadenaInfoReclassificacio());'/>",
				":<br><textarea name=\"reclassificacio\" class=\"Verdana11px\" style=\"width:440px;height:100\" ></textarea><br>",
				"<hr>",
				DonaCadenaLang({"cat":"El resultat de la reclassificació serà afegit com a un estil nou de nom", "spa":"El resultado de la reclasssificación será añadido como un estilo nuevo de nombre",
								"eng":"The result of the reclassification will be added as a new style with name", "fre":"Le résultat du reclassement sera ajouté en tant que nouveau style avec le nom"}),
				" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
				DonaNomNouEstilReclassificacio(prefix_id, i_capa, (capa.estil && capa.estil.length>1) ? capa.i_estil : 0),
				"\" /><br/>",
				DonaCadenaLang({"cat":"a la capa", "spa":"a la capa", "eng":"to the layer", "fre":"à la couche"}),
				" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
				"<input type=\"button\" class=\"Verdana11px\" value=\"",
				DonaCadenaLang({"cat":"Afegir", "spa":"Añadir", "eng":"Add", "fre":"Ajouter"}),
				"\" onClick='AfegeixEstilReclassificacio(\"",prefix_id,"\",",i_capa,");TancaFinestraLayer(\"reclassificaCapa\");' />");
	cdns.push("</<fieldset></form>");
	return cdns.join("");
}


function DonaCadenaCalculadoraCapes()
{
var cdns=[], i, capa, hi_ha_rasters=0, operacio;

	cdns.push("<form name=\"CalculadoraCapes\" onSubmit=\"return false;\">");
	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		if (EsIndexCapaVolatil(i, ParamCtrl))
			continue;
		capa=ParamCtrl.capa[i];
		if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) ||
			capa.FormatImatge!="application/x-img" || !capa.valors)
			continue;
		hi_ha_rasters++;
		break;
	}
	if (hi_ha_rasters)
	{
		cdns.push("<br>",
				//"<fieldset><legend>",
			  //DonaCadenaLang({"cat":"Afegeix capa calculada a partir de les capes existents", "spa":"Añada capa calculada a partir de las capas existentes", "eng":"Add layer computed from existing layers", "fre":"Rajouter couche calculé à partir de couches existantes"}),
			  //"</legend>",
			  "<fieldset><legend>",
			  DonaCadenaLang({"cat":"Capa per a la fórmula", "spa":"Capa para la fórmula", "eng":"Layer for the expression", "fre":"Couche pour l'expression"}),
			  "</legend>");
		//Posar uns desplegables de capes, estils i dates
		cdns.push(DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-calcul", -1, 0, {vull_operador: false, nomes_categoric: false, vull_valors: false}));
		//Posar un botó d'afegir a la fórmula
		cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	DonaCadenaLang({"cat":"Escriu a la fórmula", "spa":"Escribe en fórmula", "eng":"Write in expression", "fre":"Ecrire à la formule"}),
		        "\" onClick='EscriuCapaALaFormulaAfegeixCapa();' /></fieldset>");
		cdns.push("<fieldset><legend>",
		//Botons operadors i funcions per a la fórmula
				DonaCadenaLang({"cat":"Operadors i funcions per a la fórmula", "spa":"Operadores y funciones para la fórmula", "eng":"Operators and functions for the expression", "fre":"Opérateurs et fonctions pour l'expression"}),
			  "</legend>");
				operacio=[{text: "&equals;",prefix: "=",  size: "width:40px"},
						  {text: ">=", 		prefix:">=",  size: "width:40px"},
						  {text: "<", 		prefix: "<",  size: "width:40px"},
						  {text: "AND", 	prefix: "&&", size: "width:40px"},
						  {text: "XOR", 	prefix: "^",  size: "width:40px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "7", 		prefix: "7",  size: "width:30px"},
						  {text: "8", 		prefix: "8",  size: "width:30px"},
						  {text: "9", 		prefix: "9",  size: "width:30px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "/", 		prefix: "/",  size: "width:30px", separa: "<br>"},
						  {text: "&NotEqual;", 	prefix: "!=", size: "width:40px"},
						  {text: "<=", 		prefix: "<=", size: "width:40px"},
						  {text: ">", 		prefix: ">",  size: "width:40px"},
						  {text: "OR", 		prefix: "||", size: "width:40px"},
						  {text: "NOT", 	prefix: "!",  size: "width:40px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "4", 		prefix: "4",  size: "width:30px"},
						  {text: "5", 		prefix: "5",  size: "width:30px"},
						  {text: "6", 		prefix: "6",  size: "width:30px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "&times;", prefix: "*",  size: "width:30px", separa: "<br>"},
						  {text: "&radic;¯",prefix: "Math.sqrt	(", sufix: ")", size: "width:40px"},
						  {text: "LOG",     prefix: "Math.log10 (", sufix: ")", size: "width:40px"},
						  {text: "LN",    	prefix: "Math.log	(", sufix: ")", size: "width:40px"},
						  {text: "EXP",     prefix: "Math.exp	(", sufix: ")", size: "width:40px"},
						  {text: "1/x",     prefix: "1/(", sufix: ")", size: "width:40px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "1", 		prefix: "1",  size: "width:30px"},
						  {text: "2", 		prefix: "2",  size: "width:30px"},
						  {text: "3", 		prefix: "3",  size: "width:30px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "-", 		prefix: "-",  size: "width:30px", separa: "<br>"},
              {text: "ENT", 	prefix: "Math.trunc (", sufix: ")", size: "width:40px"},
						  {text: "Abs", 	prefix: "Math.abs   (", sufix: ")", size: "width:40px"},
						  {text: "e", 		prefix: "Math.E", size: "width:40px"},
						  {text: "(", 		prefix: "(",  size: "width:40px"},
						  {text: ")", 		prefix: ")",  size: "width:40px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "pi", 		prefix: "Math.PI", size: "width:30px"},
						  {text: "0", 		prefix: "0",  size: "width:30px"},
						  {text: ".", 		prefix: ".",  size: "width:30px", separa: "&nbsp;&nbsp;&nbsp;&nbsp;"},
						  {text: "&plus;", 	prefix: "+",  size: "width:30px", separa: "<br><br>"},
						  {text: "sin",     prefix: "Math.sin	(", sufix: ")", size: "width:62px"},
						  {text: "asin",    prefix: "Math.asin	(", sufix: ")", size: "width:62px"},
						  {text: "cos",     prefix: "Math.cos	(", sufix: ")", size: "width:62px"},
						  {text: "acos",    prefix: "Math.acos	(", sufix: ")", size: "width:62px"},
						  {text: "tan",   	prefix: "Math.tan	(", sufix: ")", size: "width:62px"},
						  {text: "atan",  	prefix: "Math.atan	(", sufix: ")", size: "width:62px", separa: "<br>"},
						  {text: "sing",    prefix: "Math.sin	(", sufix: "*Math.PI/180)", size: "width:62px"},
						  {text: "asing",   prefix: "Math.asin	(", sufix: ")*180/Math.PI", size: "width:62px"},
						  {text: "cosg",    prefix: "Math.cos	(", sufix: "*Math.PI/180)", size: "width:62px"},
						  {text: "acosg",   prefix: "Math.acos	(", sufix: ")*180/Math.PI", size: "width:62px"},
						  {text: "tang",  	prefix: "Math.tan	(", sufix: "*Math.PI/180)", size: "width:62px"},
						  {text: "atang", 	prefix: "Math.atan	(", sufix: ")*180/Math.PI", size: "width:62px"}
						  ];
				for (var i=0; i<operacio.length; i++)
				{
					cdns.push("<input type=\"button\" style=\"", operacio[i].size, "\", value=\"", operacio[i].text, "\" onclick='EscriuOperadorALaFormulaAfegeixCapa(\"", operacio[i].prefix, "\",\"", operacio[i].sufix, "\")'>");
					if (operacio[i].separa)
						cdns.push(operacio[i].separa);
				}
			  cdns.push("</fieldset>");
		//Caixa multilínia per a la formula.
		cdns.push(DonaCadenaLang({"cat":"Fórmula", "spa":"Fórmula:", "eng":"Expression", "fre":"Formule"}),
			":<br><textarea name=\"calcul\" class=\"Verdana11px\" style=\"width:420px;height:100\" ></textarea><br>",
			DonaCadenaLang({"cat":"El resultat de la selecció serà afegit com a una capa/estil nou de nom", "spa":"El resultado de la selección será añadido como una capa/estilo nuevo de nombre", "eng":"The result of the selection will be added as a new layer/style with name", "fre":"Le résultat de la sélection sera ajouté en tant que nouveau couche/style avec le nom"}),
			" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"\" /><br/>",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	DonaCadenaLang({"cat":"Afegir", "spa":"Añadir", "eng":"Add", "fre":"Ajouter"}),
		        "\" onClick='AfegeixCapaCalcul();TancaFinestraLayer(\"calculadoraCapa\");' />",
			//"</fieldset>"
			);
	}
	cdns.push("</div></form>");
	return cdns.join("");
}

function DonaCadenaCombinacioCapes()
{
var cdns=[], i, capa, hi_ha_raster_categ=0;

	cdns.push("<form name=\"CombinacioCapes\" onSubmit=\"return false;\">");
	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		if (EsIndexCapaVolatil(i, ParamCtrl))
			continue;
		capa=ParamCtrl.capa[i];
		if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) ||
			capa.FormatImatge!="application/x-img" || !capa.valors)
			continue;
		if(!EsCapaAmbAlgunEstilAmbCategories(capa))
			continue;
		hi_ha_raster_categ++;
		if(hi_ha_raster_categ==2)
			break;
	}
	if (hi_ha_raster_categ==2)
	{
			cdns.push("<div>",
				"<fieldset><legend>",
			  DonaCadenaLang({"cat":"Afegir una capa de superposició geomètrica entre dues capes categòriques", "spa":"Añadir una capa de superposición geométrica entre dos capas categóricas", "eng":"Add a geometric overlay layer between two categorical layers", "fre":"Ajouter un couche de superposition géométrique entre deux couche catégoriels"}),
			  "</legend>",
			  "<fieldset><legend>",
			  DonaCadenaLang({"cat":"Capa 1", "spa":"Capa 1", "eng":"Layer 1", "fre":"Couche 1"}),
			  "</legend>",
				DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 0, {vull_operador: false, nomes_categoric: true, vull_valors: false}),
			  "</fieldset><fieldset><legend>",
			  DonaCadenaLang({"cat":"Capa 2", "spa":"Capa 2", "eng":"Layer 2", "fre":"Couche 2"}),
			  "</legend>",
			  DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 1, {vull_operador: false, nomes_categoric: true, vull_valors: false}),
			  "</fieldset>",
			  "<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	DonaCadenaLang({"cat":"Afegir superposició geomètrica", "spa":"Añadir superposición geométrica", "eng":"Add geometric overlay", "fre":"Ajouter une superposition géométrique"}),
		        "\" onClick='AfegeixCapaCombicapaCategoric();TancaFinestraLayer(\"combinacioCapa\");' /><br>",
			"</fieldset>"
			);
	}

	cdns.push("<div>",
		"<fieldset><legend>",
	  DonaCadenaLang({"cat":"Afegir camps estadístics a una capa categòrica des d'una altra capa (de qualsevol tipus)", "spa":"Añada capa combinada a partir de dues capas existentes", "eng":"Add statistical fields to a categorical layer from another layer (of any type)", "fre":"Ajouter des champs statistiques à une couche catégorielle à partir d'une autre couche (de tout type)"}),
	  "</legend>",
	  "<fieldset><legend>",
	  DonaCadenaLang({"cat":"Capa 1", "spa":"Capa 1", "eng":"Layer 1", "fre":"Couche 1"}),
	  "</legend>",
		DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 2, {vull_operador: false, nomes_categoric: true, vull_valors: false}),
	  "</fieldset><fieldset><legend>",
	  DonaCadenaLang({"cat":"Capa 2", "spa":"Capa 2", "eng":"Layer 2", "fre":"Couche 2"}),
	  "</legend>",
	  DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 3, {vull_operador: false, nomes_categoric: false, vull_valors: false}),
	  "</fieldset>",
	  "<input type=\"button\" class=\"Verdana11px\" value=\"",
	    	DonaCadenaLang({"cat":"Afegir camps estadíscs", "spa":"Añadir campos estadísticos", "eng":"Add statistical fields", "fre":"Ajouter des champs statistiques"}),
	       "\" onClick='AfegeixTransferenciaEstadistics();TancaFinestraLayer(\"combinacioCapa\");' />",
		"</fieldset>"
		);
	cdns.push("</form>");
	return cdns.join("");
}

function DonaCadenaAfegeixCapaServidor(url, i_capa)
{
var cdns=[], i;

	cdns.push("<form name=\"AfegeixCapaServidor\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerAfegeixCapaServidor\" class=\"Verdana11px\" style=\"position:absolute; left:10px; top:10px;\">",
			"<fieldset><legend>",
			DonaCadenaLang({"cat":"Capa nova de servidor", "spa":"Capa nueva de servidor:", "eng":"New layer from server", "fre":"Nouvelle couche du serveur"}),
			"</legend>",
			DonaCadenaLang({"cat":"Especifica l'adreça URL del servidor", "spa":"Especifique la dirección URL del servidor", "eng":"Specify the server URL", "fre":"Spécifiez l'adresse URL du serveur"}),
			":<br><input type=\"text\" name=\"servidor\" style=\"width:400px;\" value=\"",
			(url ? url: "http://"), "\" />",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	DonaCadenaLang({"cat":"Afegir", "spa":"Añadir", "eng":"Add", "fre":"Ajouter"}),
		        "\" onClick=\"FesPeticioCapacitatsIParsejaResposta(document.AfegeixCapaServidor,",i_capa,");\" />");
	if(LlistaServOWS && LlistaServOWS.length)
	{
		cdns.push("<br><br>",
			DonaCadenaLang({"cat":"o Seleccciona'n un de la llista de serveis", "spa":"o Escoja uno de la lista de servicios", "eng":"or Choose one from service list", "fre":"ou sélectionnez un des services de la liste"}),
			"<br>",
			"<select name=\"llista_cat_serveis_OWS\" id=\"llista_cat_serveis_OWS\" class=\"Verdana11px\"",
			" onChange=\"ActualitzaLlistaServSegonsCategoriaSel(form);\">");
		var categoria_previa="";
		for(i=0;i<LlistaServOWS.length; i++)
		{
			if(categoria_previa!=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
			{
				categoria_previa=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase();
				if(categoria_previa==DonaCadenaLang({"cat":"ZZAltresZZ", "spa":"ZZOtrosZZ", "eng":"ZZOthersZZ", "fre":"ZZAutresZZ"}).toLowerCase())
					cdns.push("<option value=\"", categoria_previa, "\">",  DonaCadenaLang({"cat":"Altres", "spa":"Otros", "eng":"Others", "fre":"Autres"}));
				else
					cdns.push("<option value=\"", categoria_previa, "\">",  DonaCadena(LlistaServOWS[i].categoria.desc));
			}
		}
		cdns.push("</select><br>",
   		  		  "<select name=\"llista_serveis_OWS\" id=\"llista_serveis_OWS\" class=\"Verdana11px\"",
				  " onChange=\"MostraServidorSeleccionatDeLlistaOWSAEdit(form);\">");
		var categoria_sel=DonaCadena(LlistaServOWS[0].categoria.desc).toLowerCase();
		i=0;
		cdns.push("<option value=\"\">",  DonaCadenaLang({"cat":"--Seleccciona'n un de la llista--", "spa":"--Escoja uno de la lista--","eng": "--Choose one from list--", "fre":"--Sélectionnez un des objets de la liste--"}));
		while(categoria_sel==DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
		{
			cdns.push("<option value=\"", LlistaServOWS[i].url, "\">",  DonaCadena(LlistaServOWS[i].nom));
			i++;
		}
		cdns.push("</select>");
	}
	cdns.push("</fieldset>");
	cdns.push("</div></form>");
	return cdns.join("");
}

var LlistaServOWS=null;

function FinestraAfegeixCapaServidor(elem, i_capa)
{
	if (!LlistaServOWS)
	{
		loadJSON("serv_ows.json",
			function(llista_serv_OWS, extra_param) {
				LlistaServOWS=llista_serv_OWS;
				PreparaLlistaServidorsOWS();
				OmpleAfegeixCapaServidor(extra_param.elem, extra_param.i_capa);
			},
			function(xhr) { alert(xhr); },
			{elem:elem, i_capa:i_capa});
	}
	else
		OmpleAfegeixCapaServidor(elem, i_capa);
}

function OmpleAfegeixCapaServidor(elem, i_capa)
{
	contentLayer(elem, DonaCadenaAfegeixCapaServidor(null, i_capa));
}

function IniciaFinestraAfegeixCapaServidor(i_capa)
{
var elem=ObreFinestra(window, "afegirCapa", DonaCadenaLang({"cat":"d'afegir capes al navegador",
						  "spa":"de añadir capas al navegador",
						  "eng":"of adding a layer to browser",
						  "fre":"pour ajouter des couches au navigateur"}));
	if (!elem)
		return;
	FinestraAfegeixCapaServidor(elem, i_capa);
}

function IniciaFinestraCalculadoraCapes()
{
var elem=ObreFinestra(window, "calculadoraCapa", DonaCadenaLang({"cat":"per fer càlculs de capes",
						  "spa":"para hacer cálculos de capas",
						  "eng":"to make calculations of layers",
						  "fre":"pour réaliser de calculs des couches"}));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaCalculadoraCapes());
}

function IniciaFinestraCombiCapa()
{
var elem=ObreFinestra(window, "combinacioCapa", DonaCadenaLang({"cat":"per combinar capes",
						  "spa":"para combinar capas",
						  "eng":"to combine layers",
						  "fre":"pour correspondre des couches"}));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaCombinacioCapes());
}

function ObreFinestraReclassificaCapa(i_capa, i_estil)
{
var elem=ObreFinestra(window, "reclassificaCapa", DonaCadenaLang({"cat":"per reclassificar la capa",
						  "spa":"para reclasificar la capa",
						  "eng":"to reclassify the layer",
						  "fre":"pour reclassifier de couche"}));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaReclassificadoraCapes("afegeix-estil-capa-reclassif", i_capa));
}


function CanviaValorsValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil)
{
	document.getElementById(prefix_id + "-valor-valor-"+i_condicio).innerHTML=DonaCadenaValorsSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil);
}


function CanviaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil)
{
	document.getElementById(prefix_id + "-operador-valor-"+i_condicio).innerHTML=DonaCadenaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil);
}

function ActivaConstantOCapaSeleccioCondicional(prefix_id, i_condicio, es_capa)
{
	document.getElementById("div-" + prefix_id + "-operador-"+i_condicio).style.display=(es_capa==null) ? "none" : "inline";
	document.getElementById("div-" + prefix_id + "-cc-constant-"+i_condicio).style.display=(es_capa==null || es_capa==true) ? "none" : "inline";
	document.getElementById("div-" + prefix_id + "-cc-capa-"+i_condicio).style.display=(es_capa==null || es_capa==false) ? "none" : "inline";
}


/*Retorna un objecte amb "n_capa" que és nombre de capes compatibles amb i_capa i la vista actual (o si i_capa==-1 només amb la vista actual)
i "i_capa_unica" que és la primera capa compatible (o la única si només n'hi ha una)*/
function DonaNCapesVisiblesOperacioArraysBinarisOVectors(i_capa, considera_vectors)
{
var n_capa=0, i_capa_unica=-1, capa, i;

	if(considera_vectors==true)
	{
		var origen_vector=(i_capa!=-1 && ParamCtrl.capa[i_capa].model==model_vector) ?true: false;
		for (i=0; i<ParamCtrl.capa.length; i++)
		{
			if(EsIndexCapaVolatil(i, ParamCtrl))
			   continue;
			capa=ParamCtrl.capa[i];
			if(origen_vector)
			{
				// Quan l'origen és vector només vull veure les capes ràster o la pròpia i_capa
				if (i!=i_capa && (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) ||
					!EsCapaDinsAmbitCapa(capa, ParamCtrl.capa[i_capa]) || capa.FormatImatge!="application/x-img" || !capa.valors))
					continue;
			}
			else
			{
				// Quan l'origen és ràster ho vull tot el que sigui vector o application/x-img
				if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) ||
					((i_capa==-1) ? false : !EsCapaDinsAmbitCapa(capa, ParamCtrl.capa[i_capa])) || (capa.model!=model_vector && (capa.FormatImatge!="application/x-img" || !capa.valors)))
					continue;
			}
			n_capa++;
			if (i_capa_unica==-1)
				i_capa_unica=i;
		}
	}
	else
	{
		for (i=0; i<ParamCtrl.capa.length; i++)
		{
			if(EsIndexCapaVolatil(i, ParamCtrl))
			   continue;
			capa=ParamCtrl.capa[i];
			if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) ||
				((i_capa==-1) ? false : !EsCapaDinsAmbitCapa(capa, ParamCtrl.capa[i_capa])) || capa.FormatImatge!="application/x-img" || !capa.valors)
				continue;
			n_capa++;
			if (i_capa_unica==-1)
				i_capa_unica=i;
		}
	}
	return {"n_capa": n_capa, "i_capa_unica": i_capa_unica};
}

function DonaCadenaValorsSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];
var estil=capa.estil[i_estil];


	//Una caixa que permeti triar un valor com a constant
	//cdns.push("<div id=\"div-", prefix_id, "-cc-constant-",i_condicio,"\" style=\"display:inline;\">");
	if (estil.categories && estil.categories.length && estil.atributs)
	{
		cdns.push("<label for=\"", prefix_id, "-valor-",i_condicio, "\">", DonaCadenaLang({"cat":"Valor", "spa":"Valor", "eng":"Value", "fre":"Valeur"}), ":</label>");
		if (estil.categories.length>1)
		{
			cdns.push("<select  id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\">");
			for (var i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
				{
					cdns.push("<option value=\"",i_cat,"\"",
					    	((i_cat==0) ? " selected=\"selected\"" : "") ,
						">", DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, i_cat, true), "</option>");
				}
			}
			cdns.push("</select>");
		}
		else
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" />", DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, 0, true));
		cdns.push("<br>");

		//Posar un botó d'afegir a l'expressió de reclassificació
		cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	DonaCadenaLang({"cat":"Escriu valor a la fórmula", "spa":"Escribe valor en fórmula", "eng":"Write value in expression", "fre":"Écrire une valeur dans l'expression"}),
		        "\" onClick='EscriuValorALaReclasssificacioAfegeixCapa(\"",prefix_id,"\");' />");
	}
	else
	{
		if (estil.component[0].estiramentPaleta && typeof estil.component[0].estiramentPaleta.valorMaxim!=="undefined" && typeof estil.component[0].estiramentPaleta.valorMinim!=="undefined")
			cdns.push(DonaCadenaLang({"cat":"Interval de valors recomenats", "spa":"Intervaluo de valores recomendados", "eng":"Interval of recommended values", "fre":"Intervalle des valeurs recommandées"}), ": [", estil.component[0].estiramentPaleta.valorMinim, ",", estil.component[0].estiramentPaleta.valorMaxim, "]");
	}
	//cdns.push("</div>");
	return cdns.join("");
}

function CanviaValorSeleccionatSeleccioCondicional(prefix_id, i_condicio)
{
var i_option=document.getElementById(prefix_id+"-valor-select-"+i_condicio).selectedIndex;
	document.getElementById(prefix_id+"-valor-"+ i_condicio).value=document.getElementById(prefix_id+"-valor-select-"+i_condicio).options[i_option].text;
}

function DonaCadenaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil_o_atrib)
{
var cdns=[], nc, capa=ParamCtrl.capa[i_capa];
var estil_o_atrib;

	if(capa.model==model_vector)
		estil_o_atrib=capa.atributs[i_estil_o_atrib];
	else
		estil_o_atrib=capa.estil[i_estil_o_atrib];

	//Una caixa que permeti triar un operador
	cdns.push("<div id=\"div-", prefix_id, "-operador-",i_condicio,"\" ><label for=\"", prefix_id, "-operador-",i_condicio, "\">",
			  DonaCadenaLang({"cat":"Operador", "spa":"Operador", "eng":"Operator", "fre":"Opérateur"}), ":</label>",
			"<select id=\"", prefix_id, "-operador-",i_condicio,"\" name=\"operador", i_condicio, "\" style=\"width:80px;\">",
			"<option value=\"==\" selected=\"selected\">=</option>",
			"<option value=\"!=\">=/=</option>");
	if (capa.model==model_vector || !estil_o_atrib.categories)
	{
		cdns.push("<option value=\"<\">&lt;</option>",
			"<option value=\">\">&gt;</option>",
			"<option value=\"<=\">&lt;=</option>",
			"<option value=\">=\">&gt;=</option>");
	}
	cdns.push("</select></div>");

	nc=DonaNCapesVisiblesOperacioArraysBinarisOVectors(i_capa, capa.model==model_vector? true :false);
	cdns.push("<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-qualsevol\" name=\"cc",i_condicio, "\" value=\"qualsevol\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", null);' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-constant\">", DonaCadenaLang({"cat":"qualsevol valor", "spa":"cualquier valor", "eng":"any value", "fre":"toute valeur"}), "</label>",
			"<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-constant\" name=\"cc",i_condicio, "\" value=\"constant\" checked=\"checked\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", false);' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-constant\">", DonaCadenaLang({"cat":"constant", "spa":"constante", "eng":"constant", "fre":"constant"}), "</label>");
	if (nc.n_capa>1)
		cdns.push("<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-capa\" name=\"cc",i_condicio, "\" value=\"capa\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", true);' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-capa\">", DonaCadenaLang({"cat":"capa", "spa":"capa", "eng":"layer", "fre":"couche"}), "</label>");

	cdns.push("<br>");

	//Una caixa que permeti triar un valor com a constant
	cdns.push("<div id=\"div-", prefix_id, "-cc-constant-",i_condicio,"\" style=\"display:inline;\">",
		"<label for=\"", prefix_id, "-valor-",i_condicio, "\">", DonaCadenaLang({"cat":"Valor", "spa":"Valor", "eng":"Value", "fre":"Valeur"}), ":</label>");
	if(capa.model==model_vector)
	{
		if(capa.objectes && capa.objectes.features && capa.objectes.features.length>1)
		{
			//·$· El més probable és que no tingui els valors de les propietats, només tindrè els que s'han consultat, caldrà fer alguna cosa com es va dfer per la qualitats
			var feature, atribut=estil_o_atrib.nom, valors_atrib=[],i_obj, i_valor;

			for (i_obj=0; i_obj<capa.objectes.features.length; i_obj++)
			{
				feature=capa.objectes.features[i_obj];
				if (typeof feature.properties[atribut]==="undefined" ||
		    		feature.properties[atribut]=="" ||
					feature.properties[atribut]==null)
					continue;
				valors_atrib.push(DonaCadena(feature.properties[atribut]));
			}
			// pensar de fer una funció específica per nombres si acabo posant tipus als atributs
			valors_atrib.sort(sortAscendingStringSensible);
			valors_atrib.removeDuplicates(sortAscendingStringSensible);

			if(valors_atrib.length>0)
			{
				cdns.push("<select id=\"", prefix_id, "-valor-select-",i_condicio,"\" name=\"valor-select", i_condicio,
						  "\" style=\"width:400px;\" onChange='CanviaValorSeleccionatSeleccioCondicional(\"",prefix_id,"\", ", i_condicio,");'>");
				for (i_valor = 0; i_valor < valors_atrib.length; i_valor++)
				{
					cdns.push("<option value=\"",i_valor,"\"",((i_valor==0) ? " selected=\"selected\"" : ""),">", valors_atrib[i_valor], "</option>");
				}
				cdns.push("</select><br>");
			}
			cdns.push("<input type=\"text\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\" value=\"", (valors_atrib.length>0)? valors_atrib[0]: "", "\"><br>");
		}
	}
	else
	{
		if (estil_o_atrib.categories && estil_o_atrib.categories.length && estil_o_atrib.atributs)
		{
			if (estil_o_atrib.categories.length>1)
			{
				cdns.push("<select id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\">");
				for (var i_cat=0; i_cat<estil_o_atrib.categories.length; i_cat++)
				{
					if (estil_o_atrib.categories[i_cat])
					{
						cdns.push("<option value=\"",i_cat,"\"",
								((i_cat==0) ? " selected=\"selected\"" : "") ,
							">", DonaTextCategoriaDesDeColor(estil_o_atrib.categories, estil_o_atrib.atributs, i_cat, true), "</option>");
					}
				}
				cdns.push("</select>");
			}
			else
				cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" />", DonaTextCategoriaDesDeColor(estil_o_atrib.categories, estil_o_atrib.atributs, 0, true));
			cdns.push("<br>");
		}
		else
		{
			cdns.push("<input type=\"text\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\" value=\"\" /><br>");
			if (estil_o_atrib.component[0].estiramentPaleta && typeof estil_o_atrib.component[0].estiramentPaleta.valorMaxim!=="undefined" && typeof estil_o_atrib.component[0].estiramentPaleta.valorMinim!=="undefined")
				cdns.push(DonaCadenaLang({"cat":"Interval de valors recomenats", "spa":"Intervaluo de valores recomendados", "eng":"Interval of recommended values", "fre":"Intervalle des valeurs recommandées"}), ": [", estil_o_atrib.component[0].estiramentPaleta.valorMinim, ",", estil_o_atrib.component[0].estiramentPaleta.valorMaxim, "]");
		}
	}
	cdns.push("</div>");
	if (nc.n_capa>1)
	{
		//Una caixa que permeti triar un valor com a capa
		cdns.push("<div id=\"div-", prefix_id, "-cc-capa-",i_condicio,"\" style=\"display:none\">",
			DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, {vull_operador: false, nomes_categoric: false, vull_valors: false}),
			"</div>");
	}
	return cdns.join("");
}

function CanviaCondicioSeleccioCondicional(prefix_id, i_capa, i_condicio, param)
{
	document.getElementById(prefix_id+"-"+(param.vull_operador? "": "capa-valor-")+ i_condicio).innerHTML=DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, param);
}

function DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, param)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	//Desplegable de dates si s'escau.
	if (capa.AnimableMultiTime && capa.data && capa.data.length)
	{
		cdns.push("<label for=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"data-",i_condicio, "\">", DonaCadenaLang({"cat":"Data", "spa":"Fecha", "eng":"Date", "fre":"Date"}), ": </label>");
		if (capa.data.length>1)
		{
			cdns.push("<select id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"data-",i_condicio,"\" name=\"",(param.vull_operador? "": "valor_"),"data", i_condicio, "\" style=\"width:400px;\">");
			//var i_data_sel=DonaIndexDataCapa(capa, null);
			for (var i_data=0; i_data<capa.data.length; i_data++)
			{
				cdns.push("<option value=\"",i_data,"\"",
				    	/*((i_data==i_data_sel) ? " selected=\"selected\"" : "") ,*/
					">" , DonaDataCapaComATextBreu(i_capa,i_data) , "</option>");
			}
			cdns.push("<option value=\"null\" selected=\"selected\">" , DonaCadenaLang({"cat":"Seleccionada a la capa", "spa":"Seleccionada en la capa", "eng":"Selected in the layer", "fre":"···Selected in the layer"}), "</option>");
			cdns.push("</select>");
		}
		else
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"data-",i_condicio,"\" name=\"",(param.vull_operador? "": "valor_"),"data", i_condicio, "\" />", DonaDataCapaComATextBreu(i_capa,0));
		cdns.push("<br>");
	}
	// Desplegable de les bandes disponibles
	if(capa.model==model_vector)
	{
		if (capa.atributs && capa.atributs.length)
		{
			cdns.push("<label for=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-",i_condicio, "\">", DonaCadenaLang({"cat":"Camp", "spa":"Camp", "eng":"Field", "fre":"Champ"}), ": </label>");
			if (capa.atributs.length>1)
			{
				cdns.push("<select id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",(param.vull_operador? "" : "valor_"),"estil", i_condicio, "\" style=\"width:400px;\"");
				if (param.vull_operador)
					cdns.push(" onChange='CanviaOperadorValorSeleccioCondicional(\"", prefix_id, "\", ", i_capa, ", ", i_condicio, ", parseInt(document.getElementById(\"", prefix_id, "-",(param.vull_operador? "": "valor-"), "estil-", i_condicio, "\").value));'");
				cdns.push(">");
				for (var i_atrib=0; i_atrib<capa.atributs.length; i_atrib++)
				{
					cdns.push("<option value=\"",i_atrib,"\"",
							((i_atrib==0) ? " selected=\"selected\"" : "") ,
						">", DonaCadena(capa.atributs[i_atrib].descripcio)?DonaCadena(capa.atributs[i_atrib].descripcio):capa.atributs[i_atrib].nom , "</option>");
				}
				cdns.push("</select>");
			}
			else
				cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",
						 (param.vull_operador? "": "valor_"),"estil", i_condicio, "\" />", DonaCadena(capa.atributs[0].descripcio)?DonaCadena(capa.atributs[0].descripcio): capa.atributs[0].nom);
			cdns.push("<br>");
		}
	}
	else
	{
		if (capa.estil && capa.estil.length)
		{
			cdns.push("<label for=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-",i_condicio, "\">", DonaCadenaLang({"cat":"Camp", "spa":"Camp", "eng":"Field", "fre":"Champ"}), ": </label>");
			if (capa.estil.length>1)
			{
				cdns.push("<select id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",(param.vull_operador? "" : "valor_"),"estil", i_condicio, "\" style=\"width:400px;\"");
				if (param.vull_operador)
					cdns.push(" onChange='CanviaOperadorValorSeleccioCondicional(\"", prefix_id, "\", ", i_capa, ", ", i_condicio, ", parseInt(document.getElementById(\"", prefix_id, "-",(param.vull_operador? "": "valor-"), "estil-", i_condicio, "\").value));'");
				else if (param.vull_valors)
					cdns.push(" onChange='CanviaValorsValorSeleccioCondicional(\"", prefix_id, "\", ", i_capa, ", ", i_condicio, ", parseInt(document.getElementById(\"", prefix_id, "-",(param.vull_operador? "": "valor-"), "estil-", i_condicio, "\").value));'");
				cdns.push(">");
				for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
				{
					if (capa.estil[i_estil].component.length>1 /*||
						typeof capa.estil[i_estil].component[0].calcul!=="undefined"*/)
						continue;
					if (param.nomes_categoric && !capa.estil[i_estil].categories)
						continue;
					cdns.push("<option value=\"",i_estil,"\"",
							((i_estil==capa.i_estil) ? " selected=\"selected\"" : "") ,
						">", DonaCadena(capa.estil[i_estil].desc), "</option>");
				}
				cdns.push("</select>");
			}
			else
				cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",(param.vull_operador? "": "valor_"),"estil", i_condicio, "\" />", DonaCadena(capa.estil[0].desc));
			cdns.push("<br>");
		}
	}
	if (param.vull_operador)
	{
		cdns.push("<div id=\"", prefix_id, "-operador-valor-", i_condicio, "\">",
			DonaCadenaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, (capa.model==model_vector?0:capa.i_estil)),
			"</div>");
	}
	else if (param.vull_valors)
	{
		cdns.push("<div id=\"", prefix_id, "-valor-valor-", i_condicio, "\">",
			DonaCadenaValorsSeleccioCondicional(prefix_id, i_capa, i_condicio, capa.i_estil),
			"</div>");
	}
	return cdns.join("");
}

function ActivaCondicioSeleccioCondicional(prefix_id, i_condicio, estat)
{
	document.getElementById(prefix_id + "-nexe-"+i_condicio).style.display=(estat) ? "inline" : "none";
}

//i_capa és la capa que se seleccionarà per defecte en el selector. Pot ser -1 per seleccionar la primera compatible.
//param.vull_operador: indica que vulls els operador per fer una condició per selecció
//param.nomes_categoric: només vull capes ràster amb categories
//param.vull_valors:
function DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, param)
{
var cdns=[], capa, nc, capa_def, origen_vector;

	nc=DonaNCapesVisiblesOperacioArraysBinarisOVectors(i_capa, param.vull_operador==true? true:false);
	if (i_capa==-1)
	{
		capa_def=null;
		i_capa=nc.i_capa_unica;
		origen_vector=false;
	}
	else
	{
		capa_def=ParamCtrl.capa[i_capa];
		origen_vector=ParamCtrl.capa[i_capa].model==model_vector?true:false;
	}

	// Desplegable de les capes visibles per aquesta vista
	cdns.push("<label for=\""+prefix_id+"-",(param.vull_operador? "": "valor-"),"capa-",i_condicio, "\">", DonaCadenaLang({"cat":"Capa", "spa":"Capa", "eng":"Layer", "fre":"Couche"}), ":</label>");
	if (nc.n_capa>1)
	{
		cdns.push("<select id=\"", prefix_id, "-",(param.vull_operador? "" : "valor-"),"capa-",i_condicio,"\" name=\"",(param.vull_operador? "" : "valor_"),"capa", i_condicio, "\" style=\"width:400px;\" onChange='CanviaCondicioSeleccioCondicional(\"", prefix_id, "\", parseInt(document.getElementById(\"", prefix_id, "-",(param.vull_operador? "" : "valor-"),"capa-",i_condicio,"\").value), ",i_condicio, ", ", JSON.stringify(param), ");'>");
		for (var i=0; i<ParamCtrl.capa.length; i++)
		{
			if(EsIndexCapaVolatil(i, ParamCtrl))
			   continue;
			capa=ParamCtrl.capa[i];
			if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) ||
				((capa_def) ? !EsCapaDinsAmbitCapa(capa, capa_def) : false))
				continue;
			if (param.vull_operador)
			{
				if(origen_vector)
				{
					if (i!=i_capa && (capa.FormatImatge!="application/x-img" || !capa.valors))
						continue;
				}
				else
				{
					// Quan l'origen és ràster ho vull tot el que sigui vector o application/x-img
					if (capa.model!=model_vector && (capa.FormatImatge!="application/x-img" || !capa.valors))
						continue;
				}
			}
			else if(capa.FormatImatge!="application/x-img" || !capa.valors)
				continue;
			if (param.nomes_categoric && !EsCapaAmbAlgunEstilAmbCategories(capa))
				continue;
			cdns.push("<option value=\"", i, "\"", (i_capa==i ? " selected=\"selected\"" : ""), ">", DonaCadena(capa.DescLlegenda), "</option>");
		}
		cdns.push("</select>");
	}
	else if (nc.n_capa>0)
		cdns.push("<input type=\"hidden\" value=\"",nc.i_capa_unica,"\" id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"capa-",i_condicio,"\" name=\"",(param.vull_operador? "": "valor_"),"capa", i_condicio, "\" />", DonaCadena(ParamCtrl.capa[nc.i_capa_unica].DescLlegenda));
	cdns.push("<br>",
		"<div id=\"", prefix_id, "-",(param.vull_operador? "" : "capa-valor-"), i_condicio, "\">",
		DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, param),
		"</div>");
	return cdns.join("");
}

function DonaNomNouEstilReclassificacio(prefix_id, i_capa, i_estil)
{
	return DonaCadena(ParamCtrl.capa[i_capa].estil[(i_estil!=null) ? i_estil : parseInt(document.getElementById(prefix_id+"-estil").value)].desc) + " (" + DonaCadenaLang({"cat":"Reclassificació", "spa":"Reclasificación", "eng":"Reclassification", "fre":"Reclassement"}) + ")";
}

function DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, i_estil)
{
	var estil=ParamCtrl.capa[i_capa].estil[(i_estil!=null) ? i_estil : parseInt(document.getElementById(prefix_id+"-estil").value)];
	return (DonaCadena(estil.desc)? DonaCadena(estil.desc): (estil.nom? estil.nom:DonaCadenaLang({"cat":"per defecte","spa":"por defecto","eng":"by default", "fre":"par défaut"}) ))+
			" (" + DonaCadenaLang({"cat":"Selecció", "spa":"Selección", "eng":"Selection", "fre":"Sélection"}) + ")";
}

function CanviaNomNouEstilSeleccioCondicional(prefix_id, i_capa)
{
	document.SeleccioCondicional.nom_estil.value=DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, null);
}


function DonaCadenaSeleccioCondicional(prefix_id, i_capa)
{
var cdns=[], consulta, nexe, capa, primer_i_estil_valid=null;

	cdns.push("<form name=\"SeleccioCondicional\" onSubmit=\"return false;\">");
	capa=ParamCtrl.capa[i_capa];
	cdns.push("<div style=\"position:absolute; left:10px; top:10px;\">",
			DonaCadenaLang({"cat":"Mostra només els valors de la capa", "spa":"Muestra solo los valores de la capa",
						   "eng":"Only show the values of the layer", "fre":"Afficher uniquement les valeurs de la couche"}), " \"",
			DonaCadena(capa.DescLlegenda), "\"<br/>");
	if (capa.estil && capa.estil.length)
	{
		if(capa.model==model_vector)
			cdns.push("<label for=\"", prefix_id, "-estil\">", DonaCadenaLang({"cat":"de l'estil", "spa":"del estil", "eng":"of the style", "fre":"du style"}), ": </label>");
		else
			cdns.push("<label for=\"", prefix_id, "-estil\">", DonaCadenaLang({"cat":"del camp", "spa":"del campo", "eng":"of the field", "fre":"du champ"}), ": </label>");
		if (capa.estil.length>1)
		{
			cdns.push("<select id=\"", prefix_id, "-estil\" name=\"estil\" style=\"width:400px;\" onChange='CanviaNomNouEstilSeleccioCondicional(\"", prefix_id, "\",", i_capa, ");'>");
			for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
			{
				cdns.push("<option value=\"",i_estil,"\"",
				    	((i_estil==capa.i_estil) ? " selected=\"selected\"" : "") ,
					">", (DonaCadena(capa.estil[i_estil].desc)?DonaCadena(capa.estil[i_estil].desc): capa.estil[i_estil].nom), "</option>");
			}
			cdns.push("</select>");
		}
		else // si només hi ha un estil no és obligatòri ni el nom ni la descripció i es considera l'estil per defecte
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-estil\" name=\"estil\" />", DonaCadena(capa.estil[0].desc)?DonaCadena(capa.estil[0].desc): (capa.estil[0].nom?capa.estil[0].nom: DonaCadenaLang({"cat":"per defecte","spa":"por defecto","eng":"by default", "fre":"par défaut"})));
		cdns.push("<br>");
	}
	cdns.push(DonaCadenaLang({"cat":"que cumplexien les condicions següents", "spa":"que cumplen las condiciones seguientes",
							 "eng":"that conform to the following conditions", "fre":"qui se conforment aux conditions suivantes"}), ":");
	for (var i_condicio=0; i_condicio<10; i_condicio++)
	{
		cdns.push("<span id=\"", prefix_id, "-nexe-", i_condicio, "\" class=\"Verdana11px\" style=\"display: "+((i_condicio==0) ? "inline" : "none")+"\"><fieldset><legend>",
			DonaCadenaLang({"cat":"Condició", "spa":"Condición", "eng":"Condition", "fre":"Condition"}), " ", i_condicio+1, ":</legend>",
			DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, {vull_operador: true, nomes_categoric: false, vull_valors: false}),
			"</fieldset>");
		if (i_condicio<(10-1))
		{
			/*(Eventualment Un nexe... i altre cop el mateix)*/
			cdns.push(DonaCadenaLang({"cat":"Nexe amb la següent condició", "spa":"Nexo con la siguiente condición", "eng":"Nexus with next condition", "fre":"Nexus avec la prochaine condition"}), ":",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-none\" name=\"nexe",i_condicio, "\" value=\"\" checked=\"checked\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", false);' />", "<label for=\"", prefix_id, "-nexe-",i_condicio, "-none\">", DonaCadenaLang({"cat":"cap", "spa":"ninguno", "eng":"none", "fre":"aucun"}), "</label>",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-and\" name=\"nexe",i_condicio, "\" value=\"and\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", true);' />", "<label for=\"", prefix_id, "-nexe-",i_condicio, "-and\">", DonaCadenaLang({"cat":"i", "spa":"y", "eng":"and", "fre":"et"}), "</label>",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-or\" name=\"nexe",i_condicio, "\" value=\"or\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", true);' />",  "<label for=\"", prefix_id, "-nexe-",i_condicio, "-or\">", DonaCadenaLang({"cat":"o", "spa":"o", "eng":"or", "fre":"ou"}), "</label><br>");
		}
		cdns.push("</span>");
	}

	cdns.push("<hr>",
		DonaCadenaLang({"cat":"El resultat de la selecció serà afegit com a un estil nou de nom", "spa":"El resultado de la selección será añadido como un estilo nuevo de nombre", "eng":"The result of the selection will be added as a new style with name", "fre":"Le résultat de la sélection sera ajouté en tant que nouveau style avec le nom"}),
		" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
		DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, (capa.estil && capa.estil.length>1) ? capa.i_estil : 0),
		"\" /><br/>",
		DonaCadenaLang({"cat":"a la capa", "spa":"a la capa", "eng":"to the layer", "fre":"à la couche"}),
		" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}),
	        "\" onClick='CreaBandaSeleccioCondicional(\"", prefix_id, "\",", i_capa,");TancaFinestraLayer(\"seleccioCondicional\");' />",
		"</div></form>");
	return cdns.join("");
}

function FinestraSeleccioCondicional(elem, i_capa)
{
	contentLayer(elem, DonaCadenaSeleccioCondicional("condicio-seleccio-condicional", i_capa));
}

function ObreFinestraSeleccioCondicional(i_capa)
{
var elem=ObreFinestra(window, "seleccioCondicional", DonaCadenaLang({"cat":"de selecció per condició",
						  "spa":"de selección por condición",
						  "eng":"of query by attribute selection by condition",
						  "fre":" pour sélection par condition"}));
	if (!elem)
		return;
	FinestraSeleccioCondicional(elem, i_capa);
}

function LlegeixParametresCondicioCapaDataEstil(prefix_id, prefix_condicio, i_condicio)
{
var condicio_capa={};
	condicio_capa.i_capa=parseInt(document.getElementById(prefix_id + prefix_condicio + "-capa-" + i_condicio).value);
	var capa=ParamCtrl.capa[condicio_capa.i_capa];
	if (capa.AnimableMultiTime && capa.data && capa.data.length)
	{
		var i_time=parseInt(document.getElementById(prefix_id + prefix_condicio + "-data-" + i_condicio).value);
		if (!isNaN(i_time) && i_time!=null)
			condicio_capa.i_data=i_time;
	}
	if(capa.model==model_vector)
	{
		if (capa.atributs && capa.atributs.length)
			condicio_capa.i_estil=parseInt(document.getElementById(prefix_id + prefix_condicio + "-estil-" + i_condicio).value);
	}else
	{
		if (capa.estil && capa.estil.length)
			condicio_capa.i_estil=parseInt(document.getElementById(prefix_id + prefix_condicio + "-estil-" + i_condicio).value);
	}
	return condicio_capa;
}

/*function LlegeixParametresValorCondicioCapaDataEstil(prefix_id, condicio, i_condicio)
{
	condicio.valor_i_capa=parseInt(document.getElementById(prefix_id + "-valor-capa-" + i_condicio).value);
	var capa=ParamCtrl.capa[condicio.valor_i_capa];
	if (capa.AnimableMultiTime && capa.data && capa.data.length)
	{
		var i_time=parseInt(document.getElementById(prefix_id + "-valor-data-" + i_condicio).value;
		if (!isNaN(i_time) && i_time!=null)
			condicio.valor_i_data=i_time;
	}
	if (capa.estil && capa.estil.length)
		condicio.valor_i_estil=parseInt(document.getElementById(prefix_id + "-valor-estil-" + i_condicio).value);
}*/

function LlegeixParametresSeleccioCondicional(prefix_id, i_capa)
{
var sel_condicional={}, condicio, radials;

	sel_condicional.i_capa=i_capa;
	var capa=ParamCtrl.capa[i_capa];
	if (capa.estil && capa.estil.length)
		sel_condicional.i_estil=parseInt(document.getElementById(prefix_id+"-estil").value);  //No se perquè en IE no funciona la manera clàssica.
	sel_condicional.nom_estil=document.SeleccioCondicional.nom_estil.value;
	sel_condicional.condicio=[];
	for (var i_condicio=0; i_condicio<10; i_condicio++)
	{
		sel_condicional.condicio[i_condicio]={};
		condicio=sel_condicional.condicio[i_condicio];

		condicio.capa_clau=LlegeixParametresCondicioCapaDataEstil(prefix_id, "", i_condicio);

		radials=eval("document.SeleccioCondicional.cc"+i_condicio);
		if (radials && (radials[1] && radials[1].checked) || (radials[2] && radials[2].checked))
			condicio.operador=eval("document.SeleccioCondicional.operador"+i_condicio+".value");

		if (radials && radials[2] && radials[2].checked)
			condicio.capa_valor=LlegeixParametresCondicioCapaDataEstil(prefix_id, "-valor", i_condicio);
		else if (radials && radials[1] && radials[1].checked)
		{
			var valor=eval("document.SeleccioCondicional.valor"+i_condicio+".value");
			if (valor && valor!="")  //Si la cadena és buida, no ho recullo"
				condicio.valor=valor;
			else
				delete condicio.operador;
		}

		if (i_condicio<(10-1))
		{
			if (eval("document.SeleccioCondicional.nexe"+i_condicio+"[1].checked"))
				condicio.nexe="&&";
			else if (eval("document.SeleccioCondicional.nexe"+i_condicio+"[2].checked"))
				condicio.nexe="||";
			else
				break;
		}
	}
	return sel_condicional;
}

//Escriu una referencia a una capa, valor i data per un càlcul (format {\"i_capa\":0, \"i_valor\":1, \"i_data\":2})
function DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_valor, i_data)
{
var cdns=[];

	cdns.push("{");
	if (i_capa!=i_capa_ref)
		cdns.push("\"i_capa\":",i_capa);
	if (cdns.length!=1)
		cdns.push(",");
	if(ParamCtrl.capa[i_capa].model==model_vector)
		cdns.push("\"prop\": \"", (i_valor) ? ParamCtrl.capa[i_capa].atributs[i_valor].nom : "", "\"");
	else
		cdns.push("\"i_valor\":", (i_valor) ? i_valor : 0);
	if (typeof i_data!=="undefined" && i_data!=null /*&& DonaIndexDataCapa(ParamCtrl.capa[i_capa], null)!=i_data*/)
	{
		if (cdns.length!=1)
			cdns.push(",");
		cdns.push("\"i_data\":"+i_data);
	}
	cdns.push("}");
	return cdns.join("");
}

function DonaCadenaEstilCapaPerCalcul(i_capa_ref, i_capa, i_data, i_estil)
{
	if(ParamCtrl.capa[i_capa].model==model_vector)
	{
		var atribut=ParamCtrl.capa[i_capa].atributs[i_estil];
		if (typeof atribut.calcul!=="undefined")
			return atribut.calcul;
		if (typeof atribut.FormulaConsulta!=="undefined")
		{
			var s=atribut.FormulaConsulta;
			for (var i_atrib=0; i_atrib<ParamCtrl.capa[i_capa].atributs.length; i_valor++)
			{
				s_patro="p[\""+ParamCtrl.capa[i_capa].atributs[i_atrib].nom+"\"]";
				while ((i=s.indexOf(s_patro))!=-1)
					s=s.substring(0, i)+DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_atrib, i_data)+s.substring(i+s_patro.length);
			}
			return "("+ s +")";
		}
		return DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_estil, i_data);
	}
	else
	{
		var component_sel=ParamCtrl.capa[i_capa].estil[i_estil].component[0], s_patro, i;

		if (typeof component_sel.calcul!=="undefined")
			return component_sel.calcul;
		if (typeof component_sel.FormulaConsulta!=="undefined")
		{
			var valors=ParamCtrl.capa[i_capa].valors;
			var s=component_sel.FormulaConsulta;
			for (var i_valor=0; i_valor<valors.length; i_valor++)
			{
				s_patro="v["+i_valor+"]";
				while ((i=s.indexOf(s_patro))!=-1)
					s=s.substring(0, i)+DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_valor, i_data)+s.substring(i+s_patro.length);
			}
			return "("+ s +")";
		}
		return DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, component_sel.i_valor, i_data);
	}
}

function CreaBandaSeleccioCondicional(prefix_id, i_capa)
{
var sel_condicional, i_estil_nou, estil, calcul, capa;

	sel_condicional=LlegeixParametresSeleccioCondicional(prefix_id, i_capa);
	//Crea un nou estil
	capa=ParamCtrl.capa[i_capa];
	i_estil_nou=capa.estil.length;

	if(capa.estil.length==1 && !capa.estil[0].nom && !capa.estil[0].desc)
	{
		// Si la capa només té un estil, potser que no tingui ni nom ni descripció perquè és l'estil per defecte
		// com que ara n'afegeix-ho un de nou li he de possar com a mínim la descripció
		capa.estil[0].desc={"cat":"per defecte","spa":"por defecto","eng":"by default", "fre":"par défaut"};
	}
	capa.estil[i_estil_nou]=JSON.parse(JSON.stringify(capa.estil[(sel_condicional.i_estil) ? sel_condicional.i_estil : 0]));
	estil=capa.estil[i_estil_nou];
	if (estil.diagrama)
		delete estil.diagrama;
	estil.desc=sel_condicional.nom_estil;
	estil.origen="usuari";
	CarregaSimbolsEstilCapaDigi(capa, i_estil_nou, true);

	//Defineix el "calcul" de la selecció que serà de tipus "(capaA<5 || CapaA>capaB)? capa : null"
	if(capa.model!=model_vector)
		calcul="(";
	else
		calcul="";
	for (var i_condicio=0; i_condicio<sel_condicional.condicio.length; i_condicio++)
	{
		// Quan la capa és un vector  sel_condicional.condicio[i_condicio].capa_clau.i_estil és l'índex del atribut i no de l'estil
		calcul+=DonaCadenaEstilCapaPerCalcul(i_capa, sel_condicional.condicio[i_condicio].capa_clau.i_capa, sel_condicional.condicio[i_condicio].capa_clau.i_data, sel_condicional.condicio[i_condicio].capa_clau.i_estil);
		if (typeof sel_condicional.condicio[i_condicio].operador==="undefined")
			calcul+="!=null";
		else
		{
			calcul+=sel_condicional.condicio[i_condicio].operador;
			if (typeof sel_condicional.condicio[i_condicio].valor!=="undefined")
			{
				if(capa.model==model_vector && isNaN(sel_condicional.condicio[i_condicio].valor) )
					calcul+=("\""+sel_condicional.condicio[i_condicio].valor+"\"");
				else
					calcul+=sel_condicional.condicio[i_condicio].valor;
			}
			else
				calcul+=DonaCadenaEstilCapaPerCalcul(i_capa, sel_condicional.condicio[i_condicio].capa_valor.i_capa, sel_condicional.condicio[i_condicio].capa_valor.i_data, sel_condicional.condicio[i_condicio].capa_valor.i_estil);
		}
		if (typeof sel_condicional.condicio[i_condicio].nexe!=="undefined")
			calcul+=sel_condicional.condicio[i_condicio].nexe;
	}
	if(capa.model!=model_vector)
		calcul+=")?";

	if(capa.model==model_vector)
	{
		// Creo un atribut nou que contindrà el càlcul
		var i_atrib_nou=capa.atributs.length;
		var i=0, index=0, nom_proposat=sel_condicional.nom_estil.replace(/ /g, "_");

		while(i<capa.atributs.length)
		{
			if(nom_proposat==capa.atributs[i].nom)
			{
				index++;
				nom_proposat=nom_proposat+index;
				i=0;
				continue;
			}
			i++;
		}

		capa.atributs[i_atrib_nou]={"nom": nom_proposat,
									"calcul":calcul,
									"desc":sel_condicional.nom_estil + index!= 0 ? index:""};
		estil.NomCampSel=nom_proposat;
	}
	else
	{
		for (var i_c=0; i_c<estil.component.length; i_c++)
		{
			if (typeof estil.component[i_c].calcul!=="undefined" && estil.component[i_c].calcul!=null)
			{
				estil.component[i_c].calcul=calcul + "("+estil.component[i_c].calcul+")";
				if (estil.component[i_c].FormulaConsulta)
					delete estil.component[i_c].FormulaConsulta;
			}
			else if (typeof estil.component[i_c].FormulaConsulta!=="undefined" && estil.component[i_c].FormulaConsulta!=null)
			{
				estil.component[i_c].calcul=calcul + "("+estil.component[i_c].FormulaConsulta+")";
				delete estil.component[i_c].FormulaConsulta;
			}
			else //if (typeof estil.component[i_c].i_valor!=="undefined")
			{
				estil.component[i_c].calcul=calcul + "v["+estil.component[i_c].i_valor+"]";
				delete estil.component[i_c].i_valor;
			}
			estil.component[i_c].calcul+=":null";
		}
	}
	if (capa.visible=="ara_no")
		CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
	else
		CreaLlegenda();

	//Defineix el nou estil com estil actiu
	CanviaEstilCapa(i_capa, i_estil_nou, false);
}

function ObreFinestraCombinacioRGB(i_capa)
{
var elem=ObreFinestra(window, "combinacioRGB", DonaCadenaLang({"cat":"de combinació RGB",
						  "spa":"de combinación RGB",
						  "eng":"of RGB combination",
						  "fre":"pour combinaison RVB"}));
	if (!elem)
		return;
	FinestraCombinacioRGB(elem, i_capa);
}

function FinestraCombinacioRGB(elem, i_capa)
{
	contentLayer(elem, DonaCadenaCombinacioRGB(i_capa));
}

function DonaCadenaCombinacioRGB(i_capa)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	cdns.push("<form name=\"CombinacioRGB\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerCombinacioRGB\" style=\"position:absolute;left:10px;top:10px;\">",
			DonaCadenaLang({"cat":"Sel·lecciona les 3 components de la capa", "spa":"Selecciona las 3 componentes de la capa", "eng":"Select the three components of the layer", "fre":"Sélectionnez les trois composants de la couche"}), " \"",
			DonaCadena(capa.DescLlegenda),
			"\"<br/>");

	for (var i_c=0; i_c<3; i_c++)
	{
		cdns.push("<span id=\"combinacio-rgb-", i_c, "\" class=\"Verdana11px\"><fieldset><legend>",
			DonaCadenaLang({"cat":"Component", "spa":"Componente", "eng":"Component", "fre":"Composant"}), " ");
		switch (i_c)
		{
			case 0:
				cdns.push("R");
				break;
			case 1:
				cdns.push("G");
				break;
			case 2:
				cdns.push("B");
				break;
		}

		cdns.push(":</legend>",
			DonaCadenaComponentDeCombinacioRGB(i_capa, i_c),
			"</fieldset>");
		cdns.push("</span>");
	}
	cdns.push("<hr>",
		DonaCadenaLang({"cat":"La combinació RGB serà afegida com a un estil nou de nom", "spa":"La combinación RGB será añadida como un estilo nuevo de nombre", "eng":"The RGB combination will be added as a new style with name", "fre":"La combinaison RVB sera ajouté en tant que nouveau style avec le nom"}),
		" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
		DonaNomNouEstilCombinacioRGB(i_capa),
		"\" /><br/>",
		DonaCadenaLang({"cat":"a la capa", "spa":"a la capa", "eng":"to the layer", "fre":"à la couche"}),
		" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}),
	        "\" onClick='CreaBandaCombinacioRGB(",i_capa,"); TancaFinestraLayer(\"combinacioRGB\");' />",
		"</div></form>");
	return cdns.join("");
}

function DonaNomNouEstilCombinacioRGB(i_capa)
{
	return DonaCadenaLang({"cat":"Combinació RGB", "spa":"Combinación RGB", "eng":"RGB combination", "fre":"Combinaison RVB"});
}

function ObreFinestraSeleccioEstadistic(i_capa)
{
var elem=ObreFinestra(window, "seleccioEstadistic", DonaCadenaLang({"cat":"Selecció del valor estadístic",
						  "spa":"Selección del valor estadístico",
						  "eng":"Selection of statistic value",
						  "fre":"Sélection de la valeur statistique"}));
	if (!elem)
		return;
	FinestraSeleccioEstadistic(elem, i_capa);
}

function FinestraSeleccioEstadistic(elem, i_capa)
{
	contentLayer(elem, DonaCadenaSelecioEstadistic(i_capa));
}

function DonaCadenaSelecioEstadistic(i_capa)
{
var cdns=[], capa=ParamCtrl.capa[i_capa], estil=capa.estil[capa.i_estil];

	cdns.push("<form name=\"SeleccioEstadistic\" onSubmit=\"return false;\">");
	cdns.push("<div style=\"position:absolute;left:10px;top:10px;\">",
			DonaCadenaLang({"cat":"Valor estadístic a mostrar per la capa", "spa":"Valor estadístico para mostrar para la capa",
			"eng":"Statistical value to display for the layer", "fre":"Valeur statistique à afficher pour la couche"}), " \"",
			DonaCadena(capa.DescLlegenda),
			"\":<br/><br/>");

	if (estil.categories && estil.atributs) //cas categòric
	{
		cdns.push("<input type=\"radio\" id=\"stat_mode\" name=\"stat\" value=\"mode\"><label for=\"mode\">", DonaCadenaLang(str_lang_mode), "</label><br>",
	  					"<input type=\"radio\" id=\"stat_percent_mode\" name=\"stat\" value=\"percent_mode\"><label for=\"percent_mode\">", DonaCadenaLang(str_lang_percent_mode), "</label><br>",
	  					"<input type=\"radio\" id=\"stat_mode_and_percent\" name=\"stat\" value=\"mode_and_percent\"><label for=\"mode_and_percent\">", DonaCadenaLang(str_lang_mode), " (", DonaCadenaLang(str_lang_percent_mode), ")</label><br>");

	  if (estil.component.length==2 && estil.component[1].herenciaOrigen) //capa especial: "estadistics (per categoria)"
	  {
	  	var i_atrib, recompte;
	  	var value_text="";
	  	value_text="<br><fieldset><legend>"+DonaCadenaLang({"cat":"Valor estadístic de", "spa":"Valor estadístico de", "eng":"Statistical value of", "fre":"Valeur statistique des"})+" "+
	  					DonaCadena(ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].desc)+" "+DonaCadenaLang({"cat":"per les categories de", "spa":"para las categorías de", "eng":"by category of", "fre":"par catégorie des"})+
	  					" "+DonaCadena(ParamCtrl.capa[capa.valors[0].i_capa].estil[capa.valors[0].i_valor].desc)+":</legend>";
	    value_text+="<table style=\"width:100%;text-align:left;font-size:inherit\"><tr><td rowspan=\"2\">";

	    //només poso per triar els que els atributs de la capa categorica inicial indiquen com a mostrables
	    if (estil.component[1].herenciaOrigen.categories) //la segona és categòrica també
	    {
	    	for (i_atrib=0, recompte=0; i_atrib<estil.atributs.length; i_atrib++)
	    	{
	    		if (!estil.atributs[i_atrib].nom || estil.atributs[i_atrib].mostrar == "no") //en aquest cas no cal posar igual a false perquè ja es creen amb "si"/"no"...
	    			continue;
	    		//if (estil.atributs[i_atrib].nom == "$stat$_i_mode") -> no la miro perquè ja inicialment es declara com a mostrar = "no"
	    		if (estil.atributs[i_atrib].nom == "$stat$_mode")
	    		{
	    			value_text+="<input type=\"radio\" id=\"stat_mode_2\" name=\"stat\" value=\"mode_2\"><label for=\"mode\">"+DonaCadenaLang(str_lang_mode)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
	    		if (estil.atributs[i_atrib].nom == "$stat$_percent_mode")
	    		{
	    			value_text+="<input type=\"radio\" id=\"stat_percent_mode_2\" name=\"stat\" value=\"percent_mode_2\"><label for=\"percent_mode\">"+DonaCadenaLang(str_lang_percent_mode)+"</label><br>";
	    			recompte++;
	    			//break; -> no cal
	    		}
	    	}
    		if (recompte == 2)
						value_text+="<input type=\"radio\" id=\"stat_mode_and_percent_2\" name=\"stat\" value=\"mode_and_percent_2\" checked=\"true\"><label for=\"mode_and_percent\">"+
						DonaCadenaLang(str_lang_mode)+" ("+DonaCadenaLang(str_lang_percent_mode)+")</label><br>";
	  	}
			else //la segona és QC
			{
	    	for (i_atrib=0, recompte=0; i_atrib<estil.atributs.length; i_atrib++)
	    	{
	    		if (!estil.atributs[i_atrib].nom || estil.atributs[i_atrib].mostrar == "no") //en aquest cas no cal posar igual a false perquè ja es creen amb "si"/"no"...
	    			continue;

	    		//primer mirar sui_ple, pq si es que no no cal q em proecupi si él nom és un dles que m¡0interessa , oq igualment no es mostrara
					if (estil.atributs[i_atrib].nom == "$stat$_sum")
					{
						value_text+="<input type=\"radio\" id=\"stat_sum_2\" name=\"stat\" value=\"sum_2\"><label for=\"sum_2\">"+DonaCadenaLang(str_lang_sum)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
					if (estil.atributs[i_atrib].nom == "$stat$_sum_area")
					{
						value_text+="<input type=\"radio\" id=\"stat_sum_area_2\" name=\"stat\" value=\"sum_area_2\"><label for=\"sum_area_2\">"+DonaCadenaLang(str_lang_sum_area)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
					if (estil.atributs[i_atrib].nom == "$stat$_mean")
					{
						value_text+="<input type=\"radio\" id=\"stat_mean_2\" name=\"stat\" value=\"mean_2\" checked=\"true\"><label for=\"mean_2\">"+DonaCadenaLang(str_lang_mean)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
					if (estil.atributs[i_atrib].nom == "$stat$_variance")
					{
						value_text+="<input type=\"radio\" id=\"stat_variance_2\" name=\"stat\" value=\"variance_2\"><label for=\"variance_2\">"+DonaCadenaLang(str_lang_variance)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
					if (estil.atributs[i_atrib].nom == "$stat$_stdev")
					{
						value_text+="<input type=\"radio\" id=\"stat_stdev_2\" name=\"stat\" value=\"stdev_2\"><label for=\"stdev_2\">"+DonaCadenaLang(str_lang_stdev)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
					if (estil.atributs[i_atrib].nom == "$stat$_min")
					{
						value_text+="<input type=\"radio\" id=\"stat_min_2\" name=\"stat\" value=\"min_2\"><label for=\"min_2\">"+DonaCadenaLang(str_lang_min)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
					if (estil.atributs[i_atrib].nom == "$stat$_max")
					{
						value_text+="<input type=\"radio\" id=\"stat_max_2\" name=\"stat\" value=\"max_2\"><label for=\"max_2\">"+DonaCadenaLang(str_lang_max)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
					if (estil.atributs[i_atrib].nom == "$stat$_range")
					{
						value_text+="<input type=\"radio\" id=\"stat_range_2\" name=\"stat\" value=\"range_2\"><label for=\"range_2\">"+DonaCadenaLang(str_lang_range)+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
				}
  		}
  		if (recompte > 0)
  		{
				value_text+="<td><fieldset><legend>"+DonaCadenaLang({"cat":"Presentació", "spa":"Presentación","eng":"Presentation", "fre":"présentation"})+"</legend>"+
								"<input type=\"radio\" id=\"stat_graphic\" name=\"presentacio\" value=\"graphic\"><label for=\"graphic\">"+DonaCadenaLang({"cat":"Gràfica", "spa":"Gráfica", "eng":"Graphical", "fre":"graphique"})+"</label><br>"+
								"<input type=\"radio\" id=\"stat_text\" name=\"presentacio\" value=\"text\" checked=\"true\"><label for=\"sum_area_2\">"+DonaCadenaLang({"cat":"Textual", "spa":"Textual", "eng":"Textual", "fre":"textuelle"})+"</label><br>"+
	    					"</fieldset></td></tr>";
	    	value_text+="<tr><td><fieldset><legend>"+DonaCadenaLang({"cat":"Ordre", "spa":"Orden","eng":"Sorting order", "fre":"Ordre de tri"})+"</legend>"+
	    					"<input type=\"radio\" id=\"stat_unsorted\" name=\"order\" value=\"unsorted\" checked=\"true\"><label for=\"stat_unsorted\">"+DonaCadenaLang({"cat":"Cap", "spa":"Ninguno", "eng":"Unsorted", "fre":"Non trié"})+"</label><br>"+
	    					"<input type=\"radio\" id=\"stat_ascend\" name=\"order\" value=\"ascend\"><label for=\"stat_ascend\">"+DonaCadenaLang({"cat":"Ascendent", "spa":"Ascendiente", "eng":"Ascending", "fre":"Ascendant"})+"</label><br>"+
	    					"<input type=\"radio\" id=\"stat_descend\" name=\"order\" value=\"descend\"><label for=\"stat_descend\">"+DonaCadenaLang({"cat":"Descendent", "spa":"Descendiente", "eng":"Descending", "fre":"Descendant"})+"</label><br>";
		    value_text+="</fieldset></td></tr></table></fieldset>";
		    cdns.push(value_text);
		   }
	  }
	}
	else
		cdns.push("<input type=\"radio\" id=\"sum\" name=\"stat\" value=\"sum\"><label for=\"sum\">", DonaCadenaLang(str_lang_sum), "</label><br>",
							"<input type=\"radio\" id=\"sum_area\" name=\"stat\" value=\"sum_area\"><label for=\"sum_area\">", DonaCadenaLang(str_lang_sum_area), "</label><br>",
							"<input type=\"radio\" id=\"mean\" name=\"stat\" value=\"mean\"><label for=\"mean\">", DonaCadenaLang(str_lang_mean), "</label><br>",
							"<input type=\"radio\" id=\"variance\" name=\"stat\" value=\"variance\"><label for=\"variance\">", DonaCadenaLang(str_lang_variance), "</label><br>",
							"<input type=\"radio\" id=\"stdev\" name=\"stat\" value=\"stdev\"><label for=\"stdev\">", DonaCadenaLang(str_lang_stdev), "</label><br>",
							"<input type=\"radio\" id=\"min\" name=\"stat\" value=\"min\"><label for=\"min\">", DonaCadenaLang(str_lang_min), "</label><br>",
							"<input type=\"radio\" id=\"max\" name=\"stat\" value=\"max\"><label for=\"max\">", DonaCadenaLang(str_lang_max), "</label><br>",
  						"<input type=\"radio\" id=\"range\" name=\"stat\" value=\"range\"><label for=\"range\">", DonaCadenaLang(str_lang_range), "</label><br>");

  cdns.push("<br><input type=\"button\" class=\"Verdana11px\" value=\"",
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}),
	        "\" onClick='CridaCreacioEstadistic(",i_capa,");' />",
		"</div></form>");
	return cdns.join("");
}

function CridaCreacioEstadistic(i_capa)
{
	if (document.SeleccioEstadistic.stat.value=="")
	{
		alert(GetMessage("StatisticalDescriptorDisplayNeedSelected", "cntxmenu")+".");
		return;
	}
	TancaFinestraLayer("seleccioEstadistic");
	if (document.SeleccioEstadistic.stat.value.substr(document.SeleccioEstadistic.stat.value.length-2, 2) == "_2")
	//si acaba en "_2" és la part de transferència de camps estadístics, necessito saber tipus de representació i ordenació
		return ObreFinestraHistograma(i_capa, -1, document.SeleccioEstadistic.stat.value, document.SeleccioEstadistic.presentacio.value, document.SeleccioEstadistic.order.value);
	else //cas normal, només necessito saber el estadístic a mostrar
		return ObreFinestraHistograma(i_capa, -1, document.SeleccioEstadistic.stat.value);
}

function DonaDescripcioValorsCapa(params)
{
var cdns=[];
	for (var i_param=0; i_param<params.length; i_param++)
	{
		cdns.push((params[i_param].clau.desc ? DonaCadena(params[i_param].clau.desc) : params[i_param].clau.nom),
			 " ",
			(params[i_param].valor.desc ? DonaCadena(params[i_param].valor.desc) : params[i_param].valor.nom));
		if (i_param+1<params.length)
			cdns.push(", ");
	}
	return cdns.join("");
}


//només funciona bé amb i_component<3
function DonaCadenaComponentDeCombinacioRGB(i_capa, i_component)
{
var cdns=[], capa, primers_i_valor_valid=[null, null, null], params;

	capa=ParamCtrl.capa[i_capa];
	cdns.push("<select id=\"combinacio-rgb-component",i_component,"\" name=\"component",i_component,"\" style=\"width:400px;\">");
	for (var i_valor=0; i_valor<capa.valors.length; i_valor++)
	{
		params=capa.valors[i_valor].param;
		if (!params || params.length==0)
			continue;
		if (primers_i_valor_valid[0]==null)
			primers_i_valor_valid[0]=i_valor;
		else if (primers_i_valor_valid[1]==null)
			primers_i_valor_valid[1]=i_valor;
		else if (primers_i_valor_valid[2]==null)
			primers_i_valor_valid[2]=i_valor;
		cdns.push("<option value=\"",i_valor,"\"",
		    	((primers_i_valor_valid[i_component]==i_valor) ? " selected=\"selected\"" : "") ,
			">",
			DonaDescripcioValorsCapa(params),
			"</option>");
	}
	cdns.push("</select>");
	return cdns.join("");
}

function CreaBandaCombinacioRGB(i_capa)
{
var combinacio_rgb, i_estil_nou, estil, capa;

	combinacio_rgb=LlegeixParametresCombinacioRGB();
	//Crea un nou estil
	capa=ParamCtrl.capa[i_capa];
	i_estil_nou=capa.estil.length;
	capa.estil[capa.estil.length]={"nom": null, "desc": combinacio_rgb.nom_estil, "TipusObj": "P", "component": [], "origen": "usuari"};
	estil=capa.estil[i_estil_nou];

	for (var i_c=0; i_c<3; i_c++)
	{
		estil.component[i_c]={"i_valor": combinacio_rgb.i_valor[i_c],
					"desc": DonaDescripcioValorsCapa(capa.valors[combinacio_rgb.i_valor[i_c]].param),
					"NDecimals": 0}
		if (capa.estil[0].component && capa.estil[0].component[0] && capa.estil[0].component[0].estiramentPaleta)
			estil.component[i_c].estiramentPaleta=JSON.parse(JSON.stringify(capa.estil[0].component[0].estiramentPaleta));
	}

	if (capa.visible=="ara_no")
		CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
	else
		CreaLlegenda();

	//Defineix el nou estil com estil actiu
	CanviaEstilCapa(i_capa, i_estil_nou, false);
}

function LlegeixParametresCombinacioRGB()
{
var combinacio_rgb={"i_valor": []};

	for (var i_c=0; i_c<3; i_c++)
		combinacio_rgb.i_valor[i_c]=eval("document.CombinacioRGB.component"+i_c+".value");
	combinacio_rgb.nom_estil=document.CombinacioRGB.nom_estil.value;
	return combinacio_rgb;
}


function ObreFinestraEditaEstilCapa(i_capa, i_estil)
{
var elem=ObreFinestra(window, "editaEstil", DonaCadenaLang({"cat":"de editar l'estil",
						  "spa":"de editar el estilo",
						  "eng":"of editing the style",
						  "fre":"pour modifier le style"}));
	if (!elem)
		return;
	FinestraEditaEstilCapa(elem, i_capa, i_estil);
}

function FinestraEditaEstilCapa(elem, i_capa, i_estil)
{
	if (!PaletesGlobals)
	{
		loadJSON("paletes.json",
			function(paletes_globals, extra_param) {
				PaletesGlobals=paletes_globals;
				OmpleEditaEstilCapa(extra_param.elem, extra_param.i_capa, extra_param.i_estil);
			},
			function(xhr) { alert(xhr); },
			{elem:elem, i_capa:i_capa, i_estil, i_estil});
	}
	else
		OmpleEditaEstilCapa(elem, i_capa, i_estil);
}

function OmpleEditaEstilCapa(elem, i_capa, i_estil)
{
	contentLayer(elem, DonaCadenaEditaEstilCapa(i_capa, i_estil));
}

function DonaCadenaEditaEstilCapa(i_capa, i_estil)
{
var cdns=[], capa=ParamCtrl.capa[i_capa], estil=capa.estil[i_estil];

	if (!estil.histograma)
	{
		alert(DonaCadenaLang({"cat":"No es pot editar un estil no visualitzat", "spa":"No es puede editar un estilo no visualizado", "eng":"You cannot edit a style never visualized", "fre":"Vous ne pouvez pas éditer un style jamais visualisé"}));
		return "";
	}
	cdns.push("<form name=\"EstilCapa\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerEstilCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;\">",
			DonaCadenaLang({"cat":"Estil de la capa", "spa":"Estilo de la capa", "eng":"Style of the layer", "fre":"Style de la couche"}), " \"",
			DonaCadena(capa.DescLlegenda));
	if (capa.estil.length>1)
		cdns.push(" (", DonaCadena(estil.desc), ")");
	cdns.push("\"<br/>");

	if (estil.component && !estil.categories)
	{
		cdns.push("<fieldset><legend>",
			DonaCadenaLang({"cat":"Valors per l'estirament de color", "spa":"Valores para el estiramiento de color", "eng":"Value for stretching of color", "fre":"Valeur pour l'étirement de la couleur"}),
			":</legend>");
		for (var i_c=0; i_c<estil.component.length; i_c++)
		{
			if (estil.component.length>2)
			{
				cdns.push("<fieldset><legend>",
					DonaCadenaLang({"cat":"Component", "spa":"Componente", "eng":"Component", "fre":"Composant"}), " ");
				switch (i_c)
				{
					case 0:
						cdns.push("R");
						break;
					case 1:
						cdns.push("G");
						break;
					case 2:
						cdns.push("B");
						break;
					default:
						cdns.push(i_c);
				}
				cdns.push(":</legend>");
			}
			//Valor mínim i valor màxim

			cdns.push("<label for=\"edita-estil-capa-valor-minim-", i_c, "\">", DonaCadenaLang({"cat":"Mínim", "spa":"Mínimo", "eng":"Minimum", "fre":"Minimum"}), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-valor-minim-",i_c, "\" name=\"minim", i_c,"\" value=\"",
				DonaFactorValorMinEstiramentPaleta(estil.component[i_c].estiramentPaleta), "\" style=\"width:50px;\" />",
				" (", DonaCadenaLang({"cat":"calculat", "spa":"calculado", "eng":"computed", "fre":"calculé"}), " ", estil.histograma.component[i_c].valorMinimReal, " ",
				"<input type=\"button\" class=\"Verdana11px\" value=\"", DonaCadenaLang({"cat":"Adoptar", "spa":"Adoptar", "eng":"Adopt", "fre":"Adopter"}),
			        "\" onClick='document.getElementById(\"edita-estil-capa-valor-minim-", i_c, "\").value=", estil.histograma.component[i_c].valorMinimReal,";' />",")",
				"<br>");
			cdns.push("<label for=\"edita-estil-capa-valor-maxim-", i_c, "\">", DonaCadenaLang({"cat":"Màxim", "spa":"Máximo", "eng":"Maximum", "fre":"Maximum"}), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-valor-maxim-",i_c, "\" name=\"maxim", i_c,"\" value=\"",
				DonaFactorValorMaxEstiramentPaleta(estil.component[i_c].estiramentPaleta, estil.histograma.component[i_c].classe.length), "\" style=\"width:50px;\" />",
				" (", DonaCadenaLang({"cat":"calculat", "spa":"calculado", "eng":"computed", "fre":"calculé"}), " ", estil.histograma.component[i_c].valorMaximReal, " ",
				"<input type=\"button\" class=\"Verdana11px\" value=\"", DonaCadenaLang({"cat":"Adoptar", "spa":"Adoptar", "eng":"Adopt", "fre":"Adopter"}),
			        "\" onClick='document.getElementById(\"edita-estil-capa-valor-maxim-", i_c, "\").value=", estil.histograma.component[i_c].valorMaximReal,";' />",")");
			if (estil.component.length>1)
				cdns.push("</fieldset>");
		}
		cdns.push("</fieldset>");
	}

	if (estil.component && estil.component.length==1 && estil.component[0].illum)
	{
		cdns.push("<fieldset><legend>",
			DonaCadenaLang({"cat":"Posició del sol pel càlcul de la il·luminació", "spa":"Posició del sol para el cálculo de la iluminación", "eng":"Position of the sun for the computation of the illumination", "fre":"Position du soleil par le calcul de l'éclairement"}),
			":</legend>");
		//Deixo canviar les propietats az, elev i f
		cdns.push("<label for=\"edita-estil-capa-illum-az\">", DonaCadenaLang({"cat":"Azimut", "spa":"Azimut", "eng":"Azimuth", "fre":"Azimut"}), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-illum-az\" name=\"az\" value=\"",
				(estil.component[0].illum.az ? estil.component[0].illum.az : 225), "\" style=\"width:50px;\" />",
				" (", DonaCadenaLang({"cat":"origen al nord nord i en sentit horari (en graus)", "spa":"origen en el norte norte y en el sentido de las agujas del reloj (en grados)", "eng":"origin in the north north and clockwise (in degress)", "fre":"origine au nord nord et dans le sens des aiguilles d'une montre (en degrés)"}), ")",
				"<br>");
		cdns.push("<label for=\"edita-estil-capa-illum-elev\">", DonaCadenaLang({"cat":"Elevació", "spa":"Elevación", "eng":"Elevation", "fre":"Élévation"}), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-illum-elev\" name=\"elev\" value=\"",
				(estil.component[0].illum.elev ? estil.component[0].illum.elev: 45), "\" style=\"width:50px;\" />",
				" (", DonaCadenaLang({"cat":"des del terra (en graus)", "spa":"desde el suelo (en grados)", "eng":"from the ground (in degress)", "fre":"à partir du sol (en degrés)"}), ")",
				"<br>");
		cdns.push("<label for=\"edita-estil-capa-illum-f\">", DonaCadenaLang({"cat":"Factor d'exageració del relleu", "spa":"Factor de exageración del relieve", "eng":"Relief exaggeration factor", "fre":"Facteur d'exagération du relief"}), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-illum-f\" name=\"f\" value=\"",
				(estil.component[0].illum.f ? estil.component[0].illum.f : 1) , "\" style=\"width:50px;\" />",
				"<br>");
		cdns.push("</fieldset>");
	}
	else if (estil.component.length<3)
	{
		var paleta;
		cdns.push("<fieldset><legend>",
			DonaCadenaLang({"cat":"Paleta de colors", "spa":"Paleta de colores", "eng":"Color palette", "fre":"Palette de couleurs"}),
			":</legend>",
			"<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-actual\" checked=\"checked\"><label for=\"edita-estil-capa-paleta-actual\">", DonaCadenaHTMLPintaPaleta(estil.paleta), " (", DonaCadenaLang({cat: "Actual", spa: "Actual", eng: "Current", fre: "Actuel"}), ")</label><br>");
		if (estil.paletaPrevia)
			cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-previa\"><label for=\"edita-estil-capa-paleta-previa\">", DonaCadenaHTMLPintaPaleta(estil.paletaPrevia), " (", DonaCadenaLang({cat: "Prèvia", spa: "Previa", eng: "Previous", fre: "Précédente"}), ")</label><br>");
		//Paletes generals
		if (estil.categories)
		{
			for (paleta in PaletesGlobals.categoric)
			{
				if (!PaletesGlobals.categoric.hasOwnProperty(paleta))
					continue;
				cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-", paleta, "\"><label for=\"edita-estil-capa-paleta-", paleta, "\">", DonaCadenaHTMLPintaPaleta(PaletesGlobals.categoric[paleta]), " (", (PaletesGlobals.categoric[paleta].desc ? DonaCadena(PaletesGlobals.categoric[paleta].desc) : paleta), ")</label><br>");
			}
		}
		else
		{
			cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-grisos\"><label for=\"edita-estil-capa-paleta-grisos\">", DonaCadenaHTMLPintaPaleta(null), " (", DonaCadenaLang({cat: "Escala de grisos", spa: "Escala de grises", eng: "Greyscale", fre: "Niveaux de gris"}), ")</label><br>");
			for (paleta in PaletesGlobals.continuous)
			{
				if (!PaletesGlobals.continuous.hasOwnProperty(paleta))
					continue;
				cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-", paleta, "\"><label for=\"edita-estil-capa-paleta-", paleta, "\">", DonaCadenaHTMLPintaPaleta(PaletesGlobals.continuous[paleta]), " (", (PaletesGlobals.continuous[paleta].desc ? DonaCadena(PaletesGlobals.continuous[paleta].desc) : paleta), ")</label><br>");
			}
		}
		//Paletes d'altres estils d'aquesta mateixa capa si existen
		if (capa.estil.length>1)
		{
			for (var i=0; i<capa.estil.length; i++)
			{
				if (i==i_estil || !capa.estil[i].paleta)
					continue;
				cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-estil-", i, "\"><label for=\"edita-estil-capa-paleta-estil-", i, "\">", DonaCadenaHTMLPintaPaleta(capa.estil[i].paleta), " (", (capa.estil[i].desc ? DonaCadena(capa.estil[i].desc) : capa.estil[i].nom), ")</label><br>");
			}
		}
		cdns.push("</fieldset>");
	}

	cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}),
	        "\" onClick='EditaEstilCapa(", i_capa, ",", i_estil, ");TancaFinestraLayer(\"editaEstil\");' />",
		"</div></form>");
	return cdns.join("");
}

function EditaEstilCapa(i_capa, i_estil)
{
var capa=ParamCtrl.capa[i_capa], estil=capa.estil[i_estil], valor_min, valor_max;

	if (estil.component && !estil.categories)
	{
		for (var i_c=0; i_c<estil.component.length; i_c++)
		{
			valor_min=parseFloat(document.getElementById("edita-estil-capa-valor-minim-" + i_c).value);
			valor_max=parseFloat(document.getElementById("edita-estil-capa-valor-maxim-" + i_c).value);
			if (valor_min==0 && valor_max==255)
			{
				if (estil.component[i_c].estiramentPaleta)
					delete estil.component[i_c].estiramentPaleta;
			}
			else
			{
				estil.component[i_c].estiramentPaleta={"valorMinim": valor_min,
								"valorMaxim": valor_max};
			}
		}
	}
	if (estil.component && estil.component.length==1 && estil.component[0].illum)
	{
		var valor=parseFloat(document.getElementById("edita-estil-capa-illum-az").value);
		if (valor<0 || valor>=360)
		{
			valor=225;
			alert(DonaCadenaLang({"cat":"Azimut incorrecte. Hauria de ser un número entre 0 i 360. Aplicant el valor per defecte", "spa":"Azimut incorrecto. Debería ser un número entre 0 y 360. Aplicando el valor por defecto", "eng":"Incorrect azimuth. It should be a number between 0 and 360. Applying the default value", "fre":"Azimut incorrect. Il doit s'agir d'un nombre compris entre 0 et 360. Application de la valeur par défaut"})+": "+valor);
		}
		estil.component[0].illum.az=valor;
		var valor=parseFloat(document.getElementById("edita-estil-capa-illum-elev").value);
		if (valor<0 || valor>90)
		{
			valor=45;
			alert(DonaCadenaLang({"cat":"Elevació incorrecta. Hauria de ser un número entre 0 i 90. Aplicant el valor per defecte", "spa":"Elevación incorrecta. Debería ser un número entre 0 y 90. Aplicando el valor por defecto", "eng":"Incorrect azimuth. It should be a number between 0 and 90. Applying the default value", "fre":"Élévation incorrect. Il doit s'agir d'un nombre compris entre 0 et 90. Application de la valeur par défaut"})+": "+valor);
		}
		estil.component[0].illum.elev=valor;
		var valor=parseFloat(document.getElementById("edita-estil-capa-illum-f").value);
		if (valor<0.0001)
		{
			valor=1;
			alert(DonaCadenaLang({"cat":"Factor d'exageració del relleu incorrecte. Hauria de ser un número major de 0.0001. Aplicant el valor per defecte", "spa":"Factor de exageración del relieve incorrecta. Debería ser un número mayor que 0.0001. Aplicando el valor por defecto", "eng":"Incorrect relief exaggeration factor. It should be a number bigger than 0.0001. Applying the default value", "fre":"Facteur d'exagération du relief incorrect. Il doit s'agir d'un nombre supérieur à 0,0001. Application de la valeur par défaut"})+": "+1);
		}
		else
			estil.component[0].illum.f=valor;
	}
	else if (estil.component.length<3)
	{
		var paleta_de_estil_capa=false;
		if (document.getElementById("edita-estil-capa-paleta-actual").checked)
			; //Nothing to do
		else if (estil.paletaPrevia && document.getElementById("edita-estil-capa-paleta-previa").checked)
		{
			estil.paleta=JSON.parse(JSON.stringify(estil.paletaPrevia));
			delete estil.paletaPrevia;
		}
		else
		{
			if (capa.estil.length>1)
			{
				for (var i=0; i<capa.estil.length; i++)
				{
					if (i==i_estil || !capa.estil[i].paleta)
						continue;
					if (document.getElementById("edita-estil-capa-paleta-estil-"+i).checked)
					{
						paleta_de_estil_capa=true;
						if (!estil.paletaPrevia && estil.paleta)
							estil.paletaPrevia=JSON.parse(JSON.stringify(estil.paleta));
						estil.paleta=JSON.parse(JSON.stringify(capa.estil[i].paleta));
					}
				}
			}
			if (!paleta_de_estil_capa)
			{
				var paleta;
				if (estil.categories)
				{
					if (!estil.paletaPrevia && estil.paleta)
						estil.paletaPrevia=JSON.parse(JSON.stringify(estil.paleta));
					for (paleta in PaletesGlobals.categoric)
					{
						if (!PaletesGlobals.categoric.hasOwnProperty(paleta))
							continue;
						if (document.getElementById("edita-estil-capa-paleta-" + paleta).checked)
						{
							estil.paleta=JSON.parse(JSON.stringify(PaletesGlobals.categoric[paleta]));
						}
					}
				}
				else
				{
					if (document.getElementById("edita-estil-capa-paleta-grisos").checked)
						estil.paleta=null;
					else
					{
						if (!estil.paletaPrevia && estil.paleta)
							estil.paletaPrevia=JSON.parse(JSON.stringify(estil.paleta));
						for (paleta in PaletesGlobals.continuous)
						{
							if (!PaletesGlobals.continuous.hasOwnProperty(paleta))
								continue;
							if (document.getElementById("edita-estil-capa-paleta-" + paleta).checked)
								estil.paleta=JSON.parse(JSON.stringify(PaletesGlobals.continuous[paleta]));
						}
					}
				}
			}
		}
	}
	CanviaEstilCapa(i_capa, i_estil, true);
}


function ObreFinestraModificaNomCapa(i_capa)
{
var elem=ObreFinestra(window, "modificaNom", DonaCadenaLang({"cat":"de modificar el nom",
						  "spa":"de modificar el nombre",
						  "eng":"of modifing the name",
						  "fre":"pour modifier le nom"}));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaModificaNomCapa(i_capa));
}

function DonaCadenaModificaNomCapa(i_capa)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	cdns.push("<form name=\"NomCapa\" onSubmit=\"return false;\">",
		"<div id=\"LayerNomCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;\">",
		"<fieldset><legend>",
		DonaCadenaLang({"cat":"Nom de la capa", "spa":"Nombre de la capa", "eng":"Name of the layer", "fre":"Nom de la couche"}),
		":</legend>",
		"<input type=\"text\" id=\"edita-nom-capa\" name=\"nom_capa\" value=\"", DonaCadena(capa.desc), "\" style=\"width:400px;\" />",
		"<br>",
		"</fieldset>",
		"<fieldset><legend>",
		DonaCadenaLang({"cat":"Nom de la capa a la llegenda", "spa":"Nombre de la capa en la leyenda", "eng":"Name of the layer in the legend", "fre":"Nom de la couche dans la légende"}),
		":</legend>",
		"<input type=\"text\" id=\"edita-nom-capa-llegenda\" name=\"nom_capa\" value=\"", DonaCadena(capa.DescLlegenda), "\" style=\"width:400px;\" />",
		"<br>",
		"</fieldset>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}),
	        "\" onClick='ModificaNomCapa(", i_capa, ");TancaFinestraLayer(\"modificaNom\");' />",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
			  DonaCadenaLang({"cat":"Cancel·lar", "spa":"Cancelar", "eng":"Cancel", "fre":"Annuler"}),
			  "\" onClick='TancaFinestraLayer(\"modificaNom\");' />",
		"</div></form>");
	return cdns.join("");
}

function ModificaNomCapa(i_capa)
{
var desc=document.getElementById("edita-nom-capa").value, capa=ParamCtrl.capa[i_capa], desc_lleg=document.getElementById("edita-nom-capa-llegenda").value;

	if (ParamCtrl.idioma==null)
	{
		capa.desc=desc;
		capa.DescLlegenda=desc_lleg;
	}
	else
	{
		//capa.DescLlegenda
		if (capa.DescLlegenda.cat && ParamCtrl.idioma=="cat")
			capa.DescLlegenda.cat=desc_lleg;
		else if (capa.DescLlegenda.spa && ParamCtrl.idioma=="spa")
			capa.DescLlegenda.spa=desc_lleg;
		else if (capa.DescLlegenda.eng && ParamCtrl.idioma=="eng")
			capa.DescLlegenda.eng=desc_lleg;
		else if (capa.DescLlegenda.fre && ParamCtrl.idioma=="fre")
			capa.DescLlegenda.fre=desc_lleg;
		else
			capa.DescLlegenda=desc_lleg;

		//capa.desc
		if (capa.desc.cat && ParamCtrl.idioma=="cat")
			capa.desc.cat=desc;
		else if (capa.desc.spa && ParamCtrl.idioma=="spa")
			capa.desc.spa=desc;
		else if (capa.desc.eng && ParamCtrl.idioma=="eng")
			capa.desc.eng=desc;
		else if (capa.desc.fre && ParamCtrl.idioma=="fre")
			capa.desc.fre=desc;
		else
			capa.desc=desc;
	}

	CreaLlegenda();
}

function ObreFinestraModificaNomEstil(i_capa, i_estil)
{
var elem=ObreFinestra(window, "modificaNom", DonaCadenaLang({"cat":"de modificar el nom",
						  "spa":"de modificar el nombre",
						  "eng":"of modifing the name",
						  "fre":"pour modifier le nom"}));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaModificaNomEstil(i_capa, i_estil));
}

function DonaCadenaModificaNomEstil(i_capa, i_estil)
{
var cdns=[], estil=ParamCtrl.capa[i_capa].estil[i_estil];
	cdns.push("<form name=\"NomEstil\" onSubmit=\"return false;\">",
		"<div id=\"LayerNomEstil\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;\">",
		"<fieldset><legend>",
		DonaCadenaLang({"cat":"Nom de l'estil", "spa":"Nombre del estilo", "eng":"Name of the style", "fre":"Nom du style"}),
		":</legend>",
		"<input type=\"text\" id=\"edita-nom-estil\" name=\"nom_estil\" value=\"", DonaCadena(estil.desc), "\" style=\"width:400px;\" />",
		"<br>",
		"</fieldset>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}),
	        "\" onClick='ModificaNomEstil(", i_capa,",", i_estil,");TancaFinestraLayer(\"modificaNom\");' />",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
			  DonaCadenaLang({"cat":"Cancel·lar", "spa":"Cancelar", "eng":"Cancel", "fre":"Annuler"}),
			  "\" onClick='TancaFinestraLayer(\"modificaNom\");' />",
		"</div></form>");
	return cdns.join("");

}

function ModificaNomEstil(i_capa, i_estil)
{
var desc=document.getElementById("edita-nom-estil").value,  estil=ParamCtrl.capa[i_capa].estil[i_estil];

	if (ParamCtrl.idioma==null)
		estil.desc=desc;
	else if (estil.desc.cat && ParamCtrl.idioma=="cat")
		estil.desc.cat=desc;
	else if (estil.desc.spa && ParamCtrl.idioma=="spa")
		estil.desc.spa=desc;
	else if (estil.desc.eng && ParamCtrl.idioma=="eng")
		estil.desc.eng=desc;
	else if (estil.desc.fre && ParamCtrl.idioma=="fre")
		estil.desc.fre=desc;
	else
		estil.desc=desc;

    CreaLlegenda();
}

function ObreFinestraCalculaQualitatCapa(i_capa, i_estil)
{
var elem=ObreFinestra(window, "calculaQualitat", DonaCadenaLang({"cat":"de calcular la qualitat",
						  "spa":"de calcular la calidad",
						  "eng":"to compute the quality",
						  "fre":"pour calculer la qualité"}));
	if (!elem)
		return;
	FinestraCalculaQualitatCapa(elem, i_capa, i_estil);
}


function ObreFinestraMostraLlinatge(i_capa)
{
var elem=ObreFinestra(window, "mostraLlinatge", DonaCadenaLang({"cat":"de mostrar la informació del llinatge",
						  "spa":"de mostrar la información del linaje",
						  "eng":"for showing the linage information",
						  "fre":"pour afficher les informations de lignage"}));
	if (!elem)
		return;
	FinestraMostraLlinatgeCapa(elem, i_capa);
}

function ObreFinestraMostraQualitatCapa(i_capa, i_estil)
{
var capa=ParamCtrl.capa[i_capa];
var elem=ObreFinestra(window, "mostraQualitat", DonaCadenaLang({"cat":"de mostrar la informació de qualitat",
						  "spa":"de mostrar la información de calidad",
						  "eng":"for showing the quality information",
						  "fre":"pour afficher l'information de qualité"}));
	if (!elem)
		return;
	FinestraMostraQualitatCapa(elem, capa, i_estil);
}

function ObreFinestraFeedbackCapa(i_capa, i_estil)
{
//var capa=ParamCtrl.capa[i_capa];
var elem=ObreFinestra(window, "feedback", DonaCadenaLang({"cat":"de valoracions dels usuaris",
						  "spa":"de valoraciones de los usuarios",
						  "eng":"of user feedback",
						  "fre":"pour la rétroaction de l'utilisateur"}));
	if (!elem)
		return;
	FinestraFeedbackCapa(elem, i_capa, i_estil);
}

function ObreFinestraFeedbackAmbEstilsDeCapa(i_capa)
{
var elem=ObreFinestra(window, "feedbackAmbEstils", DonaCadenaLang({"cat":"de valoracions dels usuaris",
						  "spa":"de valoraciones de los usuarios",
						  "eng":"of user feedback",
						  "fre":"pour la rétroaction de l'utilisateur"}));
	if (!elem)
		return;
	FinestraFeedbackAmbEstilsCapa(elem, i_capa);
}
