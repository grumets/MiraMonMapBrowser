﻿/*
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

    Copyright 2001, 2025 Xavier Pons

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

const checkboxTotsElemTaulaVectId= "seleccionaTotsElem";
const checkboxCadaElementId = "checkExport_";
const urlTAPIS = "https://www.tapis.grumets.cat/";

function MoureASobreDeTot(i_capa)
{
	var n_capes_especials_a_sobre=NumeroDeCapesVolatils(i_capa);
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, null, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(1, n_capes_especials_a_sobre, i_capa, ParamCtrl);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+n_capes_especials_a_sobre, -1, null, ParamCtrl);

	ParamCtrl.capa.splice(n_capes_especials_a_sobre, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	RepintaMapesIVistes();
	return;
}

function MoureASobre(i_capa)
{
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, null, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(1, i_capa-1, null, ParamCtrl);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+i_capa-1, -1, null, ParamCtrl);

	ParamCtrl.capa.splice(i_capa-1, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	//Caldrà fer alguna cosa amb els grups, capes no visibles a la llegenda en aquell moment,...
	RevisaEstatsCapes();
	RepintaMapesIVistes();
	return;
}

function MoureASota(i_capa)
{
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, null, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, null, ParamCtrl);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+i_capa+1, -1, null, ParamCtrl);

	ParamCtrl.capa.splice(i_capa+1, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	RepintaMapesIVistes();
	return;
}

function MoureASotaDeTot(i_capa)
{
	//He de pujar totes les capes que estan sota i_capa una posició
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa, null, ParamCtrl);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, -1, ParamCtrl);

	ParamCtrl.capa.push(ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	RepintaMapesIVistes();
	return;
}

function EsborrarCapa(i_capa)
{
	if (AvisaDeCapaAmbIndexosACapaEsborrada(i_capa)==false)
		return;
	var separador=JSON.parse(JSON.stringify(ParamCtrl.capa[i_capa].separa));  // em deso el separador per si cal afegir-ho a la següent capa de la llegenda
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, -1, ParamCtrl);  // com que 'i_capa' desapareix, intentar moure cosa que apuntin a 'i_capa' no té sentit; i ja hem avisat que no anirà bé.
	ParamCtrl.capa.splice(i_capa, 1);
	if(i_capa<ParamCtrl.capa.length) //Podria ser que no hi hagués cap més capa
	{
		if(!ParamCtrl.capa[i_capa].separa)
			ParamCtrl.capa[i_capa].separa=separador;		
	}
	RevisaEstatsCapes();
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
		var menu_boto=getLayer(window, "menuContextualCapa-boto");
		if(menu_text && menu_marc && menu_boto)
		{
			var rec=getRectLayer(menu_text);

			var mida=event.clientY+((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+parseInt(rec.alt);

			var rec_naveg=getRectLayer(window.document.body);
			if(mida>=rec_naveg.alt)
				y=event.clientY-parseInt(rec.alt);
			else
				y=event.clientY+5;

			moveLayer(menu, event.clientX, y, rec.ample+4, rec.alt+4);
			showLayer(menu);
			moveLayer(menu_marc, event.clientX, y, rec.ample, rec.alt);
			moveLayer(menu_boto, -1, -1, rec.ample, -1);
		}
		else
			changePosAndShowLayer(menu, event.clientX, y);

		setzIndexLayer(menu,(layerList.length-1));
		if(menu_text)
			setzIndexLayer(menu_text,(layerList.length-1));
		if(menu_marc)
			setzIndexLayer(menu_marc,(layerList.length-1));
		if(menu_boto)
			setzIndexLayer(menu_boto,(layerList.length-1));
	}
}

function DonaEnvCalculatGeometry(geometry, env)
{
var c3, c2, c1, env_temp={MinX: +1e300, MaxX: -1e300, MinY: +1e300, MaxY: -1e300}, coordinates, polygon;

	if(env)
		env_temp=env;
	
	if (geometry.type=="Point" || geometry.type=="MultiPoint")
	{
		for (c1=0; c1<(geometry.type=="MultiPoint" ? geometry.coordinates.length : 1); c1++)
		{
			if (geometry.type=="MultiPoint")
				coordinates=geometry.coordinates[c1];
			else
				coordinates=geometry.coordinates;
			if (env_temp.MinX>coordinates[0])
				env_temp.MinX=coordinates[0];
			if (env_temp.MaxX<coordinates[0])
				env_temp.MaxX=coordinates[0];
			if (env_temp.MinY>coordinates[1])
				env_temp.MinY=coordinates[1];
			if (env_temp.MaxY<coordinates[1])
				env_temp.MaxY=coordinates[1];
		}
	}
	else if(geometry.type=="LineString" || geometry.type=="MultiLineString")
	{
		for (c2=0; c2<(geometry.type=="MultiLineString" ? geometry.coordinates.length : 1); c2++)
		{
			if (geometry.type=="MultiLineString")
				coordinates=geometry.coordinates[c2];
			else
				coordinates=geometry.coordinates;
			for( c1=0; c1<coordinates.length; c1++)
			{
				if (env_temp.MinX>coordinates[c1][0])
					env_temp.MinX=coordinates[c1][0];
				if (env_temp.MaxX<coordinates[c1][0])
					env_temp.MaxX=coordinates[c1][0];
				if (env_temp.MinY>coordinates[c1][1])
					env_temp.MinY=coordinates[c1][1];
				if (env_temp.MaxY<coordinates[c1][1])
					env_temp.MaxY=coordinates[c1][1];
			}
		}
	}
	else if(geometry.type=="Polygon" || geometry.type=="MultiPolygon")
	{
		for (c3=0; c3<(geometry.type=="MultiPolygon" ? geometry.coordinates.length : 1); c3++)
		{
			if (geometry.type=="MultiPolygon")
				polygon=geometry.coordinates[c3];
			else
				polygon=geometry.coordinates;
			for (c2=0; c2<polygon.length; c2++)
			{
				coordinates=polygon[c2];
				for( c1=0; c1<coordinates.length; c1++)
				{
					if (env_temp.MinX>coordinates[c1][0])
						env_temp.MinX=coordinates[c1][0];
					if (env_temp.MaxX<coordinates[c1][0])
						env_temp.MaxX=coordinates[c1][0];
					if (env_temp.MinY>coordinates[c1][1])
						env_temp.MinY=coordinates[c1][1];
					if (env_temp.MaxY<coordinates[c1][1])
						env_temp.MaxY=coordinates[c1][1];
				}
			}
		}
	}
	return env_temp;
}

function DonaEnvCalculatCapa(capa)
{
var i, geometry, env={MinX: +1e300, MaxX: -1e300, MinY: +1e300, MaxY: -1e300};
	
	if (capa.model!=model_vector || !capa.objectes || !capa.objectes.features)
		return null;
	
	for (i=0; i<capa.objectes.features.length; i++)
	{
		geometry=capa.objectes.features[i].geometry;
		env=DonaEnvCalculatGeometry(geometry, env);
	}
	return {"EnvCRS": env, "CRS": capa.CRSgeometry};
}

function ZoomACapa(capa)
{
	if (!EsCapaDisponibleEnElCRSActual(capa) && capa.CRS && capa.CRS.length)
		CanviaCRSISituacio(capa.CRS[0], -1);  //Canviar de CRS al primer que la capa indiqui.

	//Si l'envolupant de la capa no cap dins del CostatMaxim s'usa. Si no, es centra a la capa i el porta al costat màxim
	if (capa.EnvTotal)
		PortamAAmbit(TransformaEnvolupant(capa.EnvTotal.EnvCRS, capa.EnvTotal.CRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS));  //Aquesta funció refresca la vista i mes
	else 
	{
		// NJ: Intento calcular l'envolupant dels objectes que pugui tenir per fer el zoom a la capa
		var env_temp=DonaEnvCalculatCapa(capa);
		
		if(env_temp)
		{
			if(!DonaTipusServidorCapa(capa) ||		
				((typeof capa.tileMatrixSetGeometry=== "undefined" || capa.tileMatrixSetGeometry==null) &&  
				(typeof capa.objLimit === "undefined" || capa.objLimit!=-1)))
			{
				capa.EnvTotal=env_temp; // considero que tinc tots els objectes de la capa i per tant puc actualitzar l'envolupant total de la capa
				if (capa.EnvTotal && capa.EnvTotal.EnvCRS)
					capa.EnvTotalLL=DonaEnvolupantLongLat(capa.EnvTotal.EnvCRS, capa.EnvTotal.CRS);
			}
			PortamAAmbit(TransformaEnvolupant(env_temp.EnvCRS, env_temp.CRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS));  //Aquesta funció refresca la vista i mes			
		}
	}
	if (!EsCapaDinsRangDEscalesVisibles(capa))  // NJ: Tot i fer un canvi de nivell de zoom potser que la capa no sigui visible perquè no disposem del seu envolupant i potser que siguem en un àmbit NO visible de la capa 
		CanviaNivellDeZoom(DonaIndexNivellZoom(capa.CostatMaxim), true); //Canviar al CostatMaxim
}

function OmpleLayerContextMenuCapa(event, i_capa)
{
var cdns=[]
var capa=ParamCtrl.capa[i_capa], alguna_opcio=false;

	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraModificaNomCapa(", i_capa, ");TancaContextMenuCapa();\">",
						GetMessage("ModifyName"), "</a><br>");
	cdns.push("<hr>");

	if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraRaonsNoVisible(", i_capa, ");TancaContextMenuCapa();\">",
						GetMessage("WhyNotVisible", "cntxmenu"), "</a><br>");
	}
	if (ParamCtrl.LlegendaMostraCapaSencera)
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ZoomACapa(ParamCtrl.capa["+i_capa+"]);TancaContextMenuCapa();\">",
						GetMessage("ZoomToLayer", "cntxmenu"), "</a><br>");

	if(ParamCtrl.BarraBotoAfegeixCapa)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"IniciaFinestraAfegeixCapaServidor(", i_capa, ");TancaContextMenuCapa();\">",
						GetMessage("AddLayer"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.origen && capa.origen==OrigenUsuari)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"CompartirCapa(", i_capa,");TancaContextMenuCapa();\">",
							GetMessage("ShareLayer", "cntxmenu"), "</a>");
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
	if (capa.explanation && DonaCadena(capa.explanation))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraExplanation(", i_capa, ", -1);TancaContextMenuCapa();\">",
				GetMessage("Explanation"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;			
	}
	if (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i_capa, ", -1);TancaContextMenuCapa();\">",
				GetMessage("Metadata"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;			
	}
	if (/*((capa.tipus=="TipusWMS" || capa.tipus=="TipusHTTP_GET") && EsCapaBinaria(capa)) ||*/ capa.tipus=="TipusWFS" || capa.tipus=="TipusOAPI_Features" || capa.tipus=="TipusSOS" || capa.tipus=="TipusSTA" || capa.tipus=="TipusSTAplus" || (capa.tipus=="TipusHTTP_GET" && (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json")))
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
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraMostraQualitatCapa(true,", i_capa,", -1);TancaContextMenuCapa();\">",
					GetMessage("Quality"), "</a><br>");
			if(!alguna_opcio)
				alguna_opcio=true;
		}
		else if(capa.metadades.standard && DonaCadena(capa.metadades) && DonaExtensioFitxerSensePunt(DonaNomFitxerMetadades(capa, -1)).toLowerCase()=="xml")
		{
			//Puc obtenir la qualitat de les metadades
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraMostraQualitatCapa(false,",i_capa,", -1);TancaContextMenuCapa();\">",
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
	if (capa.estil && capa.estil.length==1 && (EsCapaBinaria(capa)  || (capa.model==model_vector && capa.estil[0].TipusObj != "S")))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraEditaEstilCapa(", i_capa, ",0);TancaContextMenuCapa();\">",
				GetMessage("EditStyle", "cntxmenu"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (EsCapaBinaria(capa) && capa.estil && capa.estil.length && capa.estil[capa.i_estil].histograma)
	{
		var estil=capa.estil[capa.i_estil];
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraHistograma(", i_capa, ");TancaContextMenuCapa();\">");

		if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
		{
			//cdns.push(GetMessage("ConfusionMatrix", "cntxmenu"));
			cdns.push(GetMessage("ContingencyTable"));
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
			if (estil.component.length==2 && estil.component[1].herenciaOrigen.tractament=="categoric")
				cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSeleccioEstadistic(", i_capa, ");TancaContextMenuCapa();\">",
					GetMessage("StatisticByCategory", "cntxmenu"), "</a><br>");
			else
				cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSeleccioEstadistic(", i_capa, ");TancaContextMenuCapa();\">",
					GetMessage("Statistic", "cntxmenu"), "</a><br>");
		}
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (EsCapaBinaria(capa) && capa.estil && capa.estil.length && capa.estil[capa.i_estil].component.length>0 && capa.estil[capa.i_estil].component[0].representacio && capa.estil[capa.i_estil].component[0].representacio.tipus=="3d")
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
	if (EsCapaBinaria(capa) || capa.model==model_vector)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSeleccioCondicional(", i_capa, ");TancaContextMenuCapa();\">",
				GetMessage("Selection"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (EsCapaBinaria(capa))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraReclassificaCapa(",i_capa,");TancaContextMenuCapa();\">",
				GetMessage("Reclassification", "cntxmenu"), "</a><br>");
		if(!alguna_opcio)
			alguna_opcio=true;
	}
	if (capa.estil && (EsCapaBinaria(capa)/* || capa.model==model_vector*/)) // Cal programar això per vector ·$·
	{
		if(alguna_opcio)
		{
			cdns.push("<hr>");
			alguna_opcio=false;
		}
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFeedbackAmbEstilsDeCapa(", i_capa, ");TancaContextMenuCapa();\">",
				GetMessage("RetrieveStyles", "cntxmenu"), "</a><br>");
	}
	if (capa.model==model_vector)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraTaulaDeCapaVectorial(", i_capa, ");TancaContextMenuCapa();\">",
				GetMessage("ShowLikeTable", "cntxmenu"), "</a><br>");
	}

	if (cdns.length==0)
		return false;

	cdns.splice(0, 0, "<div class=\"MenuContextualCapa\" id=\"menuContextualCapa-contingut\">",
			   "<div class=\"llistaMenuContext\" style=\"position:absolute\" id=\"menuContextualCapa-text\">");
	cdns.push("</div><div style=\"position:absolute;text-align:right;vertical-align:top;\" id=\"menuContextualCapa-boto\">",
				DonaTextImgGifSvg("id_context_menu_capa_close", "context_menu_capa_close", "boto_tancar", 11, GetMessage("close"), "TancaContextMenuCapa();"),
				"</div></div>");
	MouLayerContextMenuCapa(event, cdns.join(""));
	return false;
}

function CompartirCapa(i_capa)
{	//·$·
	alert(GetMessage("UnderDevelopment"));
}

function OmpleLayerContextMenuEstil(event, i_capa, i_estil)
{
var cdns=[];
var capa=ParamCtrl.capa[i_capa];

	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraModificaNomEstil(", i_capa,",",i_estil,");TancaContextMenuCapa();\">",
						GetMessage("ModifyName"), "</a><br>");
	cdns.push("<hr>");

	if (capa.estil[i_estil].origen && capa.estil[i_estil].origen==OrigenUsuari)
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"CompartirEstilCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
							GetMessage("ShareStyle", "cntxmenu"), "</a>");
		cdns.push("<br>");
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"EsborrarEstilCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
							GetMessage("DeleteStyle", "cntxmenu"), "</a>");
		cdns.push("<hr>");
	}
	if (capa.estil[i_estil].explanation && DonaCadena(capa.estil[i_estil].explanation))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraExplanation(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
				GetMessage("Explanation"), "</a><br>");
	}
	if (capa.estil[i_estil].metadades && capa.estil[i_estil].metadades.standard && DonaCadena(capa.estil[i_estil].metadades.standard))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
				GetMessage("Metadata"), "</a><br>");
	}
	if (/*((capa.tipus=="TipusWMS" || capa.tipus=="TipusHTTP_GET") && EsCapaBinaria(capa)) || */capa.tipus=="TipusWFS" || capa.tipus=="TipusOAPI_Features" || capa.tipus=="TipusSOS" || capa.tipus=="TipusSTA" || capa.tipus=="TipusSTAplus" || (capa.tipus=="TipusHTTP_GET" && (capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json")))
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraCalculaQualitatCapa(",i_capa,",",i_estil,");TancaContextMenuCapa();\">",
				GetMessage("ComputeQuality", "cntxmenu"), "</a><br>");
	}
	if (capa.estil[i_estil].metadades)
	{
		if(capa.estil[i_estil].metadades.quality)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraMostraQualitatCapa(true,",i_capa,",", i_estil,");TancaContextMenuCapa();\">",
					GetMessage("Quality"), "</a><br>");
		}
		else if(capa.estil[i_estil].metadades.standard && DonaCadena(capa.estil[i_estil].metadades.standard) && DonaExtensioFitxerSensePunt(DonaNomFitxerMetadades(capa, -1)).toLowerCase()=="xml")
		{
			//Puc obtenir la qualitat de les metadades
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraMostraQualitatCapa(false,", i_capa,", -1);TancaContextMenuCapa();\">",
					GetMessage("Quality"), "</a><br>");
		}
	}
	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFeedbackCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
			GetMessage("Feedback"), "</a><br>");

	if (EsCapaBinaria(capa) || (capa.model==model_vector && capa.estil[i_estil].TipusObj != "S"))
	{
		cdns.push("<hr>");
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraEditaEstilCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
				GetMessage("EditStyle", "cntxmenu"), "</a><br>");
	}
	if (cdns.length==0)
		return false;

	cdns.splice(0, 0, "<div class=\"MenuContextualCapa\" id=\"menuContextualCapa-contingut\">",
			   "<div class=\"llistaMenuContext\" style=\"position:absolute\" id=\"menuContextualCapa-text\">");
	cdns.push("</div><div style=\"position:absolute;text-align:right;vertical-align:top;\" id=\"menuContextualCapa-boto\">",
				DonaTextImgGifSvg("id_context_menu_capa_close", "context_menu_capa_close", "boto_tancar", 11, GetMessage("close"), "TancaContextMenuCapa();"),
				"</div></div>");
	MouLayerContextMenuCapa(event, cdns.join(""));
	return false;
}

function CompartirEstilCapa(i_capa, i_estil)
{
var s;
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
			{abstract: DonaCadena(capa.estil[i_estil].desc), specific_usage: GetMessage("ShareStyle", "cntxmenu"),
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

function DonaFormatFeatureInfoCapesWMS(servidorGC)
{
var j;

	//Format de consulta comú per totes les capes
	if(servidorGC.formatGetFeatureInfo)
	{
		for(j=0; j<servidorGC.formatGetFeatureInfo.length; j++)
		{
			if(-1!=servidorGC.formatGetFeatureInfo[j].indexOf("text/xml"))
				return j;
		}
		for(j=0; j<servidorGC.formatGetFeatureInfo.length; j++)
		{
			if(-1!=servidorGC.formatGetFeatureInfo[j].indexOf("text/html"))
				return j;
		}
	}
	return -1;
}

function DonaFormatGetMapCapesWMS(servidorGC, i_layer)
{
var j;

	var layer=servidorGC.layer[i_layer];
	if (layer.esCOG && layer.uriDataTemplate)
		return servidorGC.formatGetMap.length;
	for(j=0; j<servidorGC.formatGetMap.length; j++)
	{
		if (servidorGC.formatGetMap[j]=="image/jpeg")
			return j;
	}
	for(j=0; j<servidorGC.formatGetMap.length; j++)
	{
		if (servidorGC.formatGetMap[j]=="image/png")
			return j;
	}
	return 0;
}

function AfegeixCapesWMSAlNavegadorForm(form, i_serv)
{
var i, j, i_capa, i_get_featureinfo;
var alguna_capa_afegida=false;
var servidorGC=ServidorGetCapabilities[i_serv];
var i_on_afegir=servidorGC.i_capa_on_afegir;

	if(form==null)
		return;

	//Format de consulta comú per totes les capes
	i_get_featureinfo=DonaFormatFeatureInfoCapesWMS(servidorGC);

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

				AfegeixCapaWMSAlNavegador(parseInt(form["format_capa_"+i_capa].options[form["format_capa_"+i_capa].selectedIndex].value), servidorGC, i_on_afegir, i_capa, i_get_featureinfo, "si");

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
			AfegeixCapaWMSAlNavegador(parseInt(form["format_capa_"+i_capa].options[form["format_capa_"+i_capa].selectedIndex].value), servidorGC, i_on_afegir, i_capa, i_get_featureinfo, "si");
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
		RepintaMapesIVistes();
	}
}

function BuscaClauTancarJSON(fragment)
{
var dinsCadena=false;
	for (var i=0; i<fragment.length; i++) {
		if (fragment.charAt(i)=='"')
			dinsCadena=dinsCadena ? false : true;
		else if (fragment.charAt(i)=='}' && !dinsCadena)
			return i;
	}
	return -1;	
}

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
	Si voleu moure només els index que coindideixen amb i_capa_ini useu null o i_capa_ini+1
Des que els histogrames són dinàmics també ha de revisar els HistogramaFinestra[] i Superficie3DFinestra[]*/
function CanviaIndexosCapesSpliceCapa(n_moviment, i_capa_ini, i_capa_fi_per_sota, param_ctrl)
{
var capa, j, k, d, fragment, cadena, calcul, final, nou_valor, inici, calcul;

	if (typeof i_capa_fi_per_sota==="undefined" || i_capa_fi_per_sota==null)
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
							while ((inici=fragment.indexOf('{'))!=-1)
							{
								final=BuscaClauTancarJSON(fragment);
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
		if (capa.attributes)
		{
			var attributes=capa.attributes;
			var attributesArray=Object.keys(attributes);
			if (attributesArray.length)
			{
				for (j=0; j<attributesArray.length; j++)
				{
					if (attributes[attributesArray[j]].calcul)
					{
						calcul="";
						fragment=attributes[attributesArray[j]].calcul;
						while ((inici=fragment.indexOf('{'))!=-1)
						{
							final=BuscaClauTancarJSON(fragment);
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
						attributes[attributesArray[j]].calcul=calcul;
					}
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
					if (false==confirm(GetMessage("TheLayer") + " " + DonaCadena(capa.desc) + " " + GetMessage("containsReferencesEraseContinue", "cntxmenu") + "?"));
						return false;
				}
			}
		}
		if (capa.attributes)
		{
			var attributes=capa.attributes;
			var attributesArray=Object.keys(attributes);
		
			if (attributesArray.length)
			{
				for (j=0; j<attributesArray.length; j++)
				{
					if (!attributes[attributesArray[j]].calcul)
						continue;
					fragment=attributes[attributesArray[j]].calcul;
					while ((inici=fragment.indexOf('{'))!=-1)
					{
						final=BuscaClauTancarJSON(fragment)
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
							if (false==confirm(GetMessage("TheLayer") + " " + DonaCadena(capa.desc) + " " + GetMessage("containsReferencesEraseContinue", "cntxmenu") + "?"))
								return false;
						}
						fragment=fragment.substring(final+1, fragment.length);
					}
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
						while ((inici=fragment.indexOf('{'))!=-1)
						{
							final=BuscaClauTancarJSON(fragment);
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
								if (false==confirm(GetMessage("TheLayer") + " " + DonaCadena(capa.desc) + " " + GetMessage("containsReferencesEraseContinue", "cntxmenu") + "?"))
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
//i_estil_fi_per_sota és l'índex de l'estil  fi (no incluent ell mateixa) on cal fer el canvi d'indexos. Opcional; si no s'especifica (o es posa null), val i_estil_ini+1
function CanviaIndexosCapesSpliceEstil(n_moviment, i_capa, i_estil_ini, i_estil_fi_per_sota)
{
var capa, j, k, d, fragment, cadena, calcul, final, nou_valor, inici, calcul;

	if (typeof i_estil_fi_per_sota==="undefined" || i_estil_fi_per_sota==null)
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
							while ((inici=fragment.indexOf('{'))!=-1)
							{
								final=BuscaClauTancarJSON(fragment);
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
		if (capa.attributes)
		{
			var attributes=capa.attributes;
			var attributesArray=Object.keys(attributes);
			if (attributesArray.length)
			{
				for (j=0; j<attributesArray.length; j++)
				{
					if (attributes[attributesArray[j]].calcul)
					{
						calcul="";
						fragment=attributes[attributesArray[j]].calcul;
						while ((inici=fragment.indexOf('{'))!=-1)
						{
							final=BuscaClauTancarJSON(fragment);
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
						attributes[attributesArray[j]].calcul=calcul;
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
		if (capa.attributes)
		{
			var attributes=capa.attributes;
			var attributesArray=Object.keys(attributes);
			if (attributesArray.length)
			{
				for (j=0; j<attributesArray.length; j++)
				{
					if (!capa.attributes[attributesArray[j]].calcul)
						continue;
					fragment=capa.attributes[attributesArray[j]].calcul;
					while ((inici=fragment.indexOf('{'))!=-1)
					{
						final=BuscaClauTancarJSON(fragment);
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
							if (false==confirm(GetMessage("TheLayer") + " " + DonaCadena(capa.desc) + " " + GetMessage("containsReferencesStyleEraseContinue", "cntxmenu") + "?"))
								return false;
						}
						fragment=fragment.substring(final+1, fragment.length);
					}
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
						while ((inici=fragment.indexOf('{'))!=-1)
						{
							final=BuscaClauTancarJSON(fragment);
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
								if (false==confirm(GetMessage("TheLayer") + " " + DonaCadena(capa.desc) + " " + GetMessage("containsReferencesStyleEraseContinue", "cntxmenu") + "?"))
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

function AfegeixCapaCombicapaCategoric(desc_usu)
{
var alguna_capa_afegida=false;

var condicio=[], capa=[], i_capes, i_cat, categories, cat_noves, two_attributes, atrib_nous, colors=[], i_color_tipic;

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
		 (condicio[0].i_data && condicio[1].i_data && condicio[0].i_data==condicio[1].i_data)) &&
		 SonValorsDimensionsIguals(condicio[0].dim, condicio[1].dim)) 		
	{
		alert(GetMessage("ChooseTwoDifferentLayers", "cntxmenu"));
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

	//Creo la descripció des attributes
	two_attributes=[capa[0].estil[condicio[0].i_estil].attributes, 
		capa[1].estil[condicio[1].i_estil].attributes];
	atrib_nous={};

	var attributesArray=Object.keys(two_attributes[0]);
	for (var i=0; i<attributesArray.length; i++)
	{
		atrib_nous[attributesArray+"1"]=JSON.parse(JSON.stringify(two_attributes[0][attributesArray[i]]));
		if (atrib_nous[attributesArray+"1"].descripcio)
			atrib_nous[attributesArray+"1"].descripcio=
				ConcatenaCadenes(ConcatenaCadenes(ConcatenaCadenes(atrib_nous[attributesArray+"1"].descripcio," ("),(capa[0].DescLlegenda?capa[0].DescLlegenda:capa[0].nom)),")");
	}
	for (var i=0; i<two_attributes[1].length; i++)
	{
		atrib_nous[attributesArray+"2"]=JSON.parse(JSON.stringify(two_attributes[1][attributesArray[i]]));
		if (atrib_nous[attributesArray+"1"].descripcio)
			atrib_nous[attributesArray+"1"].descripcio=
				ConcatenaCadenes(ConcatenaCadenes(ConcatenaCadenes(atrib_nous[attributesArray+"1"].descripcio," ("),(capa[1].DescLlegenda?capa[1].DescLlegenda:capa[1].nom)),")");
	}
	var desc_capa=desc_usu ? desc_usu : (
	ConcatenaCadenes(GetMessage("CombinationOf", "cntxmenu"), 
			ConcatenaCadenes((DonaCadena(capa[0].desc) ? DonaCadena(capa[0].desc) : (DonaCadena(capa[0].DescLlegenda) ? DonaCadena(capa[0].DescLlegenda): capa[0].nom)), ConcatenaCadenes(" ",ConcatenaCadenes(GetMessage("and"),ConcatenaCadenes(" " ,(DonaCadena(capa[1].desc) ? DonaCadena(capa[1].desc) : (DonaCadena(capa[1].DescLlegenda) ? DonaCadena(capa[1].DescLlegenda): capa[1].nom))))))));
	var cadena_desc_llegenda=desc_usu ? desc_usu : (ConcatenaCadenes(ConcatenaCadenes((capa[0].DescLlegenda ? capa[0].DescLlegenda: capa[0].nom), GetMessageJSON("_and_", "cntxmenu")), (capa[1].DescLlegenda?capa[1].DescLlegenda : capa[1].nom)));

	var i_capa=Math.min.apply(Math, i_capes); //https://www.w3schools.com/js/js_function_apply.asp

	ParamCtrl.capa.splice(i_capa, 0, {"servidor": null,
		"versio": null,
		"tipus": null,
		"nom":	"CombinedLayer",
		"desc":	desc_capa,
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
		"DescLlegenda": cadena_desc_llegenda,		
		"estil": [{
			"nom":	null,
			"desc":	cadena_desc_llegenda,			
			"TipusObj": "P",
			"component": [{
				"calcul": DonaCadenaEstilCapaPerCalcul(-1, condicio[0].i_capa, condicio[0].i_data, condicio[0].i_estil, condicio[0].dim) + "+" +
					DonaCadenaEstilCapaPerCalcul(-1, condicio[1].i_capa, condicio[1].i_data, condicio[1].i_estil, condicio[1].dim) + "*" + capa[0].estil[condicio[0].i_estil].categories.length,
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
			"attributes": atrib_nous,
			"metadades": null,
			"explanation": null,
			
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
		"explanation": null,
		"NomVideo":	null,
		"DescVideo":	null,
		"FlagsData": null,
		"data": null,
		"i_data": 0,
		"animable":	false, //··Segurament la capa es podria declarar animable si alguna capa té els temps "current" i és multitime.
		"AnimableMultiTime": false,  //··Segurament la capa es podria declarar AnimableMultiTime si alguna capa té els temps "current" i és multitime.
		"proces":	null,
		"ProcesMostrarTitolCapa" : false,
		"origen": OrigenUsuari
		});

	if (i_capa<ParamCtrl.capa.length)  //això és fa després, donat que els índex de capa de la capa nova es poden referir a capes que s'han pogut.
		CanviaIndexosCapesSpliceCapa(1, i_capa, -1, ParamCtrl);

	CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

	//Redibuixo el navegador perquè les noves capes siguin visibles
	RevisaEstatsCapes();
	RepintaMapesIVistes();
}//Fi de AfegeixCapaCombicapaCategoric()

function AfegeixTransferenciaEstadistics(desc_usu)
{
var alguna_capa_afegida=false;
var condicio=[], capa=[], i_capes, i_cat, categories, categ_noves, attributes, atrib_nous, i_color_tipic;

	condicio[0]=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-combicap", "-valor", 2);
	condicio[1]=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-combicap", "-valor", 3);

	i_capes=[condicio[0].i_capa, condicio[1].i_capa];

	if(i_capes[0]==i_capes[1] &&
	   ((typeof condicio[0].i_estil==="undefined" && typeof condicio[1].i_estil==="undefined") ||
		 (!condicio[0].i_estil && !condicio[1].i_estil) ||
		 (condicio[0].i_estil && condicio[1].i_estil && condicio[0].i_estil==condicio[1].i_estil)) &&
	   ((typeof condicio[0].i_data==="undefined" && typeof condicio[1].i_data==="undefined") ||
		 (!condicio[0].i_data && !condicio[1].i_data) ||
		 (condicio[0].i_data && condicio[1].i_data && condicio[0].i_data==condicio[1].i_data)) &&
		 SonValorsDimensionsIguals(condicio[0].dim, condicio[1].dim))
	{
		alert(GetMessage("ChooseTwoDifferentLayers", "cntxmenu"));
		return;
	}

	capa[0]=ParamCtrl.capa[i_capes[0]];
	capa[1]=ParamCtrl.capa[i_capes[1]];

	//La descripció de les categories i la paleta és igual que la de la capa categòrica, la primera de la combinació
	//cat_noves=capa[0].estil[condicio[0].i_estil].categories;
	//colors=capa[0].estil[condicio[0].i_estil].paleta.colors;

	var n_dec_estad=4;

	//Creo la descripció dels attributes
	// a/ les categories com a primer attribute i tots els estadístics de la segona capa després
	atrib_nous=JSON.parse(JSON.stringify(capa[0].estil[condicio[0].i_estil].attributes));
	// b/ afegir els estadístics
	if (DonaTractamentComponent(capa[1].estil[condicio[1].i_estil], 0)=="categoric")
	{
		atrib_nous["$stat$_i_mode"]={descripcio: GetMessageJSON("ModalClass"), mostrar: "no"};
		atrib_nous["$stat$_mode"]={descripcio: GetMessageJSON("ModalClass"), mostrar: "si_ple"};
		atrib_nous["$stat$_percent_mode"]={descripcio: GetMessageJSON("PercentageMode"), mostrar: "si_ple", UoM: "%", NDecimals: n_dec_estad};
	}
	else
	{
		var n_atrib_ori=atrib_nous.length;
		/* marco alguns a mostrar "no" per provar que lo de darrera va, però després la idea és que quan s'esculli que vols crear estadístics
		quins vols que es mostrin (es calculen sempre tots)*/
		atrib_nous["$stat$_sum"]={descripcio: GetMessageJSON("Sum"), mostrar: "si_ple", symbol: "&Sigma;"};
		atrib_nous["$stat$_sum_area"]={descripcio: GetMessageJSON("SumArea"), mostrar: "si_ple", symbol: "&Sigma;<small>a</small>"};
		atrib_nous["$stat$_mean"]={descripcio: GetMessageJSON("Mean"), mostrar: "si_ple", symbol: "x&#772"}; //x-bar
		atrib_nous["$stat$_variance"]={descripcio: GetMessageJSON("Variance"), mostrar: "si_ple", symbol: "&sigma;²"};
		atrib_nous["$stat$_stdev"]={descripcio: GetMessageJSON("StandardDeviation"), mostrar: "si_ple", symbol: "&sigma;"};
		atrib_nous["$stat$_min"]={descripcio: GetMessageJSON("Minimum"), mostrar: "si_ple", symbol: "Min"};
		atrib_nous["$stat$_max"]={descripcio: GetMessageJSON("Maximum"), mostrar: "si_ple", symbol: "Max"};
		atrib_nous["$stat$_range"]={descripcio: GetMessageJSON("Range"), mostrar: "si_ple"};

		if (capa[1].estil[condicio[1].i_estil].DescItems)
		{
			atrib_nous["$stat$_sum"].UoM=
				//atrib_nous["$stat$_sum_area"].UoM=
				atrib_nous["$stat$_mean"].UoM=
				//atrib_nous["$stat$_variance"].UoM=
				atrib_nous["$stat$_stdev"].UoM=
				atrib_nous["$stat$_min"].UoM=
				atrib_nous["$stat$_max"].UoM=
				atrib_nous["$stat$_range"].UoM=
					capa[1].estil[condicio[1].i_estil].DescItems;


			//per la sum_area les UoM són diferents -> buscar DonaUnitatsCoordenadesProj(crs) per mirar quines unitats he de concatenar al darrera
			atrib_nous["$stat$_sum_area"].UoM=capa[1].estil[condicio[1].i_estil].DescItems+"&sdot;m²";
			//la variança són les UoM al quadrat
			atrib_nous["$stat$_variance"]="("+capa[1].estil[condicio[1].i_estil].DescItems+")²";
		}
		else //per la sum_area les UoM són les "no UoM"*m2 :)
			atrib_nous["$stat$_sum_area"].UoM="m²";

		if (capa[1].estil[condicio[1].i_estil].component[0].NDecimals)
		{
			atrib_nous["$stat$_sum"].NDecimals=
				atrib_nous["$stat$_sum_area"].NDecimals=
				atrib_nous["$stat$_mean"].NDecimals=
				atrib_nous["$stat$_variance"].NDecimals=
				atrib_nous["$stat$_stdev"].NDecimals=
				atrib_nous["$stat$_min"].NDecimals=
				atrib_nous["$stat$_max"].NDecimals=
				atrib_nous["$stat$_range"].NDecimals=
					capa[1].estil[condicio[1].i_estil].component[0].NDecimals;
		}
		else /*si no hi havien decimals definits, en poso "2" pels camps calculats (on ens sortiran), però no als
			altres (així la suma, el rang, etc. els veure sesne decimals com la cpa original, pex DTM en m enters)*/
		{
			atrib_nous["$stat$_mean"].NDecimals=n_dec_estad;
			atrib_nous["$stat$_variance"].NDecimals=n_dec_estad;
			atrib_nous["$stat$_stdev"].NDecimals=n_dec_estad;
		}
	}

	//Creo la descripció de les categories, de moment només la original, les altres ja s'afegiran després
	categ_noves=JSON.parse(JSON.stringify(capa[0].estil[condicio[0].i_estil].categories));

	var cadena_desc=desc_usu ? desc_usu : (ConcatenaCadenes(ConcatenaCadenes((DonaCadena(capa[0].desc) ? DonaCadena(capa[0].desc) : (DonaCadena(capa[0].DescLlegenda) ? DonaCadena(capa[0].DescLlegenda): capa[0].nom)), GetMessageJSON("_withStatisticOf_", "cntxmenu")),(DonaCadena(capa[1].desc) ? DonaCadena(capa[1].desc) : (DonaCadena(capa[1].DescLlegenda) ? DonaCadena(capa[1].DescLlegenda): capa[1].nom))));
	var cadena_desc_llegenda=desc_usu ? desc_usu : (ConcatenaCadenes(ConcatenaCadenes((capa[0].DescLlegenda ? capa[0].DescLlegenda: capa[0].nom),GetMessageJSON("_withStatisticOf_", "cntxmenu")),(capa[1].DescLlegenda?capa[1].DescLlegenda: capa[1].nom)));
	
		
	var desc_estil= capa[1].estil[condicio[1].i_estil].desc + " " + GetMessage("byCategoryOf", "cntxmenu" ) + " " + capa[0].estil[condicio[0].i_estil].desc;
	var i_capa=Math.min.apply(Math, i_capes); //https://www.w3schools.com/js/js_function_apply.asp

	ParamCtrl.capa.splice(i_capa, 0, {"servidor": null,
		"versio": null,
		"tipus": null,
		//"nom":	"LayerWithStatistics", //capa[1].estil[condicio[1].i_estil].desc + "WithStatisticsOf" + capa[0].estil[condicio[0].i_estil].desc;
		"nom":	capa[1].estil[condicio[1].i_estil].desc + "WithStatisticsOf" + capa[0].estil[condicio[0].i_estil].desc,
		"desc":	cadena_desc,
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
		"DescLlegenda": cadena_desc_llegenda,
		"estil": [{
			"nom":	null,
			"desc":	desc_estil,
			"TipusObj": "P",
			"component": [{"calcul": DonaCadenaEstilCapaPerCalcul(-1, condicio[0].i_capa, condicio[0].i_data, condicio[0].i_estil, condicio[0].dim)},
					{"calcul": DonaCadenaEstilCapaPerCalcul(-1, condicio[1].i_capa, condicio[1].i_data, condicio[1].i_estil, condicio[1].dim),
						"estiramentPaleta": capa[1].estil[condicio[1].i_estil].component[0].estiramentPaleta ? JSON.parse(JSON.stringify(capa[1].estil[condicio[1].i_estil].component[0].estiramentPaleta)) : null,
						"herenciaOrigen": {"nColors": (capa[1].estil[condicio[1].i_estil].paleta && capa[1].estil[condicio[1].i_estil].paleta.colors) ? capa[1].estil[condicio[1].i_estil].paleta.colors.length : 256,
								"categories": capa[1].estil[condicio[1].i_estil].categories ? JSON.parse(JSON.stringify(capa[1].estil[condicio[1].i_estil].categories)) : null,
								"attributes": capa[1].estil[condicio[1].i_estil].attributes ? JSON.parse(JSON.stringify(capa[1].estil[condicio[1].i_estil].attributes)) : null,
								"tractament": DonaTractamentComponent(capa[1].estil[condicio[1].i_estil], 0)
						}
				}],
			"categories": categ_noves,
			"attributes": atrib_nous,
			"metadades": null,
			"explanation": null,
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
		"explanation": null,
		"NomVideo":	null,
		"DescVideo":	null,
		"FlagsData": null,
		"data": null,
		"i_data": 0,
		"animable":	false, //··Segurament la capa es podria declarar animable si alguna capa té els temps "current" i és multitime.
		"AnimableMultiTime": false,  //··Segurament la capa es podria declarar AnimableMultiTime si alguna capa té els temps "current" i és multitime.
		"proces":	null,
		"ProcesMostrarTitolCapa" : false,
		"origen": OrigenUsuari
		});

	if (i_capa<ParamCtrl.capa.length)  //això és fa després, donat que els índex de capa de la capa nova es poden referir a capes que s'han pogut.
		CanviaIndexosCapesSpliceCapa(1, i_capa, -1, ParamCtrl);

	CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

	//Redibuixo el navegador perquè les noves capes siguin visibles
	RevisaEstatsCapes();
	RepintaMapesIVistes();
}//Fi de AfegeixTransferenciaEstadistics()

function DonaOldNewDeCadenaReclass(linia_reclass, i_linia, categories, attributes)
{
var i, old_value, old_up_value, new_value, desc_value, inici, final;

	i=linia_reclass.indexOf(';');

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
		alert(GetMessage("WrongNumberElementsLine")+" "+i_linia+": "+linia_reclass);
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
		alert(DonaCadenaLang("WrongFormatInLine")+" "+i_linia+": "+linia_reclass);
		return null;
	}*/
	var elem_reclass =linia_reclass.trim();
	if(-1==(i = elem_reclass.search(/[\s|\t]/i))) //no pot ser indexOf perquè és una regular expression
	{
		alert(GetMessage("WrongNumberElementsInLine", "cntxmenu")+" "+i_linia+": "+linia_reclass);
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
			alert(GetMessage("WrongNumberElementsInLine", "cntxmenu")+" "+i_linia+": "+linia_reclass);
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
			alert(GetMessage("WrongValuesFormatInLine", "cntxmenu")+" "+i_linia+": "+linia_reclass);
			return null;
		}
		if(new_value.toUpperCase=="REMOVE")
			new_value=NaN;
		else if(NaN==parseFloat(new_value))
		{
			alert(GetMessage("WrongValuesFormatInLine", "cntxmenu")+" "+i_linia+": "+linia_reclass);
			return null;
		}
	}
	else
	{
		var attributesArray=Object.keys(attributes);
		if(-1!=old_value.search(/["|']/i)) 	//no pot ser indexOf perquè és una regular expression
		{
			old_value=TreuCometesDePrincipiIFinalDeCadena(old_value);
			for(i=0; i<categories.length; i++)
			{
				if(categories[i] && categories[i][attributesArray[0]].toLowerCase()==old_value.toLowerCase())
				{
					old_value=i;
					break;
				}
			}
			if(i==categories.length)
			{
				alert(GetMessage("WrongOldValueInLine", "cntxmenu")+" "+i_linia+": "+linia_reclass);
				return null;
			}
		}
		if(-1!=new_value.search(/["|']/i))  //no pot ser indexOf perquè és una regular expression
		{
			new_value=TreuCometesDePrincipiIFinalDeCadena(new_value.trim());
			for(i=0; i<categories.length; i++)
			{
				if(categories[i] && categories[i][attributesArray[0]].toLowerCase()==new_value.toLowerCase())
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
				if(categories[i] && categories[i][attributesArray[0]].toLowerCase()==old_up_value.toLowerCase())
				{
					old_up_value=i;
					break;
				}
			}
			if(i==categories.length)
			{
				alert(GetMessage("WrongOldValueInLine", "cntxmenu")+" "+i_linia+": "+linia_reclass);
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
	v=DonaCadenaEstilCapaPerCalcul(-1, condicio.i_capa, condicio.i_data, condicio.i_estil, condicio.dim);
	linia_reclass=cadena_reclass.split("\n");
	for (i=i_value=0; i<linia_reclass.length; i++)
	{
		if(value=DonaOldNewDeCadenaReclass(linia_reclass[i], i, estil.categories, estil.attributes))
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
				attributesArray=Object.keys(estil.attributes);
				if(!estil.categories[value.new_value])
				{
					estil.categories[value.new_value]={};
					estil.categories[value.new_value][attributesArray[0]]=value.desc_value;
				}
				else if (value.desc_value)
					estil.categories[value.new_value][attributesArray[0]]=value.desc_value;
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
	form.llista_serveis_OWS.options[j]=new Option("--"+GetMessage("ChooseOneFromList", "cntxmenu")+"--", "");
	j++;
	while(i<LlistaServOWS.length && categoria_sel==DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
	{
		//form.llista_serveis_OWS.options[j]=new Option(DonaCadena(LlistaServOWS[i].nom), LlistaServOWS[i].url);
		form.llista_serveis_OWS.options[j]=new Option(DonaCadena(LlistaServOWS[i].nom), i);
		j++;
		i++;
	}
}

function MostraServidorSeleccionatDeLlistaOWSAEdit(form)
{
var url_a_mostrar;
	/*if(form.llista_serveis_OWS.selectedIndex>0)

		url_a_mostrar=form.llista_serveis_OWS.options[form.llista_serveis_OWS.selectedIndex].value;
	if(url_a_mostrar)
		form.servidor.value=url_a_mostrar;
	*/
	if(form.llista_serveis_OWS.selectedIndex>0)
	{
		var i_sel=form.llista_serveis_OWS.options[form.llista_serveis_OWS.selectedIndex].value;
		form.servidor.value=LlistaServOWS[i_sel].url;
		form.cors.checked=(LlistaServOWS[i_sel].cors==true ? true : false);
		form.cors.value=LlistaServOWS[i_sel].cors;
	}
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
			LlistaServOWS[i].categoria={"nom": "Altres", "desc": "ZZ"+GetMessage("Others")+"ZZ"};
	}
	LlistaServOWS.sort(OrdenacioServOWSPerCategoriaINom);
}

function EscriuCapaALaFormulaAfegeixCapa()
{
var condicio=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-calcul", "-valor", 0);
var calcul=document.CalculadoraCapes.calcul;
	calcul.focus();
	calcul.value = calcul.value.substring(0, calcul.selectionStart)+DonaCadenaEstilCapaPerCalcul(-1, condicio.i_capa, condicio.i_data, condicio.i_estil, condicio.dim)+calcul.value.substring(calcul.selectionEnd);
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
	valor=document.ReclassificadoraCapes["valor"+0].value;
	if(valor && valor!="")
		text_valor="\""+DonaTextCategoriaDesDeColor(ParamCtrl.capa[condicio.i_capa].estil[condicio.i_estil].categories, ParamCtrl.capa[condicio.i_capa].estil[condicio.i_estil].attributes, valor, true)+"\"";
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
			  "Supported reclassification formats: </legend>",
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
var elem=ObreFinestra(window, "info", GetMessage("toShowInformationOrHelp", "cntxmenu"));
	if (!elem)
		return;

	ajustaAllargadaAContingutFinestraLayer(window, "info", 0);  //fa la finestra petita per forçar l'scroll
	contentLayer(elem, nom_funcio);
	ajustaAllargadaAContingutFinestraLayer(window, "info", -1); //fa que es vegi tot el text
}

function DonaCadenaReclassificadoraCapes(prefix_id, i_capa)
{
var cdns=[], i, capa;

	cdns.push("<form name=\"ReclassificadoraCapes\" onSubmit=\"return false;\">");
	capa=ParamCtrl.capa[i_capa];

	cdns.push("<br><fieldset><legend>",
			  GetMessage("AddReclassifiedLayerAsNewStyle", "cntxmenu"),
			  ": </legend>",
			  "<fieldset><legend>",
			  GetMessage("LayerToReclassify", "cntxmenu"),
			  ": </legend>",
			  "<input type=\"hidden\" value=\"",i_capa,"\" id=\"", prefix_id, "-valor-capa-",0,"\" name=\"","valor_capa", 0, "\" />", DonaCadena(capa.DescLlegenda), "<br>",
			  DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, 0, {vull_operador: false, nomes_categoric: false, vull_valors: true, vull_dates: true, vull_dims: true}),
			  "</fieldset>");

	cdns.push(GetMessage("ReclassifyingExpression", "cntxmenu"),
				"<input type=\"button\" class=\"Verdana11px\" value=\"i\" onClick='IniciaFinestraInformacio(DonaCadenaInfoReclassificacio());'/>",
				":<br><textarea name=\"reclassificacio\" class=\"Verdana11px\" style=\"width:440px;height:100px\" ></textarea><br>",
				"<hr>",
				GetMessage("ResultOfReclassificationAddedAsNewStyleWithName", "cntxmenu"),
				" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
				DonaNomNouEstilReclassificacio(prefix_id, i_capa, (capa.estil && capa.estil.length>1) ? capa.i_estil : 0),
				"\" /><br/>",
				GetMessage("toTheLayer", "cntxmenu"),
				" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
				"<input type=\"button\" class=\"Verdana11px\" value=\"",
				GetMessage("Add"),
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
			!EsCapaBinaria(capa) || !capa.valors)
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
			  GetMessage("LayerForExpression", "cntxmenu"),
			  ": </legend>");
		//Posar uns desplegables de capes, estilsdates i dimensions extra
		cdns.push(DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-calcul", -1, 0, {vull_operador: false, nomes_categoric: false, vull_valors: false, vull_dates: true, vull_dims: true}));
		//Posar un botó d'afegir a la fórmula
		cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	GetMessage("WriteInExpression", "cntxmenu"),
		        "\" onClick='EscriuCapaALaFormulaAfegeixCapa();' /></fieldset>");
		cdns.push("<fieldset><legend>",
		//Botons operadors i funcions per a la fórmula
				GetMessage("OperatorsFunctionsForExpression", "cntxmenu"),
			  ": </legend>");
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
						  {text: "&plus;", 	prefix: "+",  size: "width:30px", separa: "<br>"},
						  {text: "&#x78;&#x207F;", 	prefix: "**",  size: "width:40px"},
						  {text: "&#x25;", 	prefix: "%",  size: "width:40px", separa: "<br><br>"},
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
		cdns.push(GetMessage("Expression"),
			":<br><textarea name=\"calcul\" class=\"Verdana11px\" style=\"width:438px;height:100px\" ></textarea><br>",
			GetMessage("ResultOfSelectionAddedAsNewLayerStyleWithName", "cntxmenu"),
			" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:438px;\" value=\"\" /><br/>",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	GetMessage("Add"),
		        "\" onClick='AfegeixCapaCalcul(document.CalculadoraCapes.calcul.value, document.CalculadoraCapes.nom_estil.value);TancaFinestraLayer(\"calculadoraCapa\");' />",
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
			!EsCapaBinaria(capa) || !capa.valors)
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
			  GetMessage("AddGeometricOverlayLayerBetweenTwoCategoricalLayers", "cntxmenu"),
			  ": </legend>",
			  "<fieldset><legend>",
			  GetMessage("Layer"),
			  "_1: </legend>",
				DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 0, {vull_operador: false, nomes_categoric: true, vull_valors: false, vull_dates: true, vull_dims: true}),
			  "</fieldset><fieldset><legend>",
			  GetMessage("Layer"),
			  "_2: </legend>",
			  DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 1, {vull_operador: false, nomes_categoric: true, vull_valors: false, vull_dates: true, vull_dims: true}),
			  "</fieldset>",
			  GetMessage("ResultAddedAsNewLayerWithName", "cntxmenu"),
			  ": <input type=\"text\" name=\"nom_capa_overlay\" class=\"Verdana11px\" style=\"width:438px;\" value=\"\" /><br/>",
			  "<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	GetMessage("AddGeometricOverlay", "cntxmenu"),
		        "\" onClick='AfegeixCapaCombicapaCategoric(document.CombinacioCapes.nom_capa_overlay.value);TancaFinestraLayer(\"combinacioCapa\");' /><br>",
			"</fieldset>"
			);
	}

	cdns.push("<div>",
		"<fieldset><legend>",
	  GetMessage("AddStatisticalFieldsToCategoricalLayerFromAnotherLayer", "cntxmenu"),
	  ": </legend>",
	  "<fieldset><legend>",
	  GetMessage("Layer"),
	  "_1: </legend>",
		DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 2, {vull_operador: false, nomes_categoric: true, vull_valors: false, vull_dates: true, vull_dims: true}),
	  "</fieldset><fieldset><legend>",
	  GetMessage("Layer"),
	  "_2: </legend>",
	  DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-combicap", -1, 3, {vull_operador: false, nomes_categoric: false, vull_valors: false, vull_dates: true, vull_dims: true}),
	  "</fieldset>",
	  GetMessage("ResultAddedAsNewLayerWithName", "cntxmenu"),
	  ": <input type=\"text\" name=\"nom_capa_statisctical\" class=\"Verdana11px\" style=\"width:438px;\" value=\"\" /><br/>",
	  "<input type=\"button\" class=\"Verdana11px\" value=\"",
	    	GetMessage("AddStatisticalFields", "cntxmenu"),
	       "\" onClick='AfegeixTransferenciaEstadistics(document.CombinacioCapes.nom_capa_statisctical.value);TancaFinestraLayer(\"combinacioCapa\");' />",
		"</fieldset>"
		);
	cdns.push("</form>");
	return cdns.join("");
}

function CarregaFitxersLocalsSeleccionats(form)
{
var algun_fitxer_ok=false, fileread=[], i_fitxer, tiff_blobs=[], ext;

	if (form.nom_fitxer_local.files.length<1)
		return;
	for (i_fitxer=0; i_fitxer<form.nom_fitxer_local.files.length; i_fitxer++)
	{
		if (form.nom_fitxer_local.files[i_fitxer].type=="application/json" || form.nom_fitxer_local.files[i_fitxer].type=="application/geo+json" || 
			((typeof form.nom_fitxer_local.files[i_fitxer].type==="undefined" || form.nom_fitxer_local.files[i_fitxer].type==null || form.nom_fitxer_local.files[i_fitxer].type=="") && 
			( "geojson"==(ext=DonaExtensioFitxerSensePunt(form.nom_fitxer_local.files[i_fitxer].name).toLowerCase()) || "json"==ext)))  
			//NJ he vist que si la extensió és geojson no em retorna el mimetype!! Segurament això depen de les extensions que té registrades cada usuari i com que sobre això no hi puc fer res afegeix-ho aquesta comprovació
		{
			//https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript
			fileread[i_fitxer] = new FileReader();
			fileread[i_fitxer].nom_json=form.nom_fitxer_local.files[i_fitxer].name;  //Així onload pot saber el nom del fitxer
			fileread[i_fitxer].onload = function(e) {
				var objectes;
				try{
					objectes=JSON.parse(e.target.result);
				}
				catch (e){
					alert("JSON file error. " + e);
				}
				AfegeixCapaGeoJSON(NumeroDeCapesVolatils(-1), this.nom_json, objectes);
				//Redibuixo el navegador perquè les noves capes siguin visibles
				//RevisaEstatsCapes();
				RepintaMapesIVistes();				
			};
			fileread[i_fitxer].readAsText(form.nom_fitxer_local.files[i_fitxer]);
			algun_fitxer_ok=true;
		}
		else if (form.nom_fitxer_local.files[i_fitxer].type!="image/tiff" ||
			((typeof form.nom_fitxer_local.files[i_fitxer].type==="undefined" || form.nom_fitxer_local.files[i_fitxer].type==null || form.nom_fitxer_local.files[i_fitxer].type=="") && 
			( "tiff"==(ext=DonaExtensioFitxerSensePunt(form.nom_fitxer_local.files[i_fitxer].name).toLowerCase()) || "tif"==ext || "geotiff"==ext)))
		{
			alert("Unrecognized file type '"+form.nom_fitxer_local.files[i_fitxer].type+ "' for the file '"+ form.nom_fitxer_local.files[i_fitxer].name + "'");
		}
	}
	for (i_fitxer=0; i_fitxer<form.nom_fitxer_local.files.length; i_fitxer++)
	{
		if (form.nom_fitxer_local.files[i_fitxer].type=="image/tiff")
			tiff_blobs.push(form.nom_fitxer_local.files[i_fitxer]);
	}
	if (tiff_blobs.length>0)
	{
		//AfegeixCapaGeoTIFF és asincrona.
		AfegeixCapaGeoTIFF((tiff_blobs.length==1) ? tiff_blobs[0].name : "TIFFs", tiff_blobs, NumeroDeCapesVolatils(-1));
		algun_fitxer_ok=true;
	}
	if (algun_fitxer_ok)
		TancaFinestraLayer("afegirCapa");
}

function CarregaFitxerURLSeleccionat(form)
{
	if (form.url_fitxer.value.length<1)
		return;
	if (form.file_type.value=="geojson")
		AfegeixCapaGeoJSON_URL(form.url_fitxer.value, NumeroDeCapesVolatils(-1));
	else
		AfegeixCapaGeoTIFF_URL(form.url_fitxer.value.split(" "), NumeroDeCapesVolatils(-1));
	TancaFinestraLayer("afegirCapa");
}

function ProcessaResultatLecturaFitxerLocalCSVObjectesIPropietats(results)
{
var capa=this;

	return ParsejaCSVObjectesIPropietats(results, capa);
}

function LlegeixParametresCSV(form)
{
var camp_geo=null, camp_x=null, camp_y=null;
	
	if(form.camp_geo.value)
		camp_geo=form.camp_geo.value;
	else
	{		
		camp_x=form.camp_geo_punt_x.value;		
		camp_y=form.camp_geo_punt_y.value;				
	}
	if(!camp_geo && (!camp_x || !camp_y))
		return;
	
	var separador;
	if(form.fieldDelimitador.value=="tab")
		separador="\t";
	else if(form.fieldDelimitador.value=="comma")
		separador=",";
	else if(form.fieldDelimitador.value=="semicolon")
		separador=";";
	else if(form.fieldDelimitador.value=="space")
		separador=" ";
	else //if(form.fieldDelimitador.value=="text")
		separador=form.separa_csv.value;
		
	var configuracio={
			  header: (form.header_csv.checked) ? true : false,
			  encoding: (form.encoding_csv.value && form.encoding_csv.value!="utf-8") ? form.encoding_csv.value : "",		
			  separadorCamps: separador,
			  nomCampDateTime : form.camp_time.value ? form.camp_time.value: null,
			  nomCampGeometria: (camp_geo ? camp_geo : {x: camp_x, y: camp_y})};
	return configuracio;
}

function CarregaCapaCSVLocal(i_on_afegir, configuracio, form)
{
var k;

	var capa={servidor: form.nom_fitxer_local.files[0].name,
		versio: null,
		tipus: "TipusHTTP_GET",
		model: model_vector,
		configCSV: JSON.parse(JSON.stringify(configuracio)),					
		nom: null,
		desc: TreuAdreca(form.nom_fitxer_local.files[0].name),
		CRSgeometry: form.crs_csv.value ? form.crs_csv.value: "EPSG:4326",
		objectes: null,
		attributes: null,
		FormatImatge: "text/csv",
		transparencia: "opac",
		CostatMinim: null,
		CostatMaxim: null,
		FormatConsulta: null,
		visible: "si",
		consultable: "si",
		descarregable: "no",
		FlagsData: null,
		data: null,
		i_data: 0,
		animable: false,
		AnimableMultiTime: false,
		origen: OrigenUsuari};
			
	
	Papa.parse(form.nom_fitxer_local.files[0], {
							header: (capa.configCSV && capa.configCSV.header) ? capa.configCSV.header : true,
							encoding: (capa.configCSV && capa.configCSV.encoding) ? capa.configCSV.encoding : "",
							delimiter: (capa.configCSV && capa.configCSV.separadorCamps) ? capa.configCSV.separadorCamps :  "",
							complete: ProcessaResultatLecturaFitxerLocalCSVObjectesIPropietats.bind(capa),				
							});
							
	capa.tipus=null;

	var calia_consultes=CalActivarConsultesALaBarra();

	if(i_on_afegir==-1)
		k=ParamCtrl.capa.length;
	else
	{
		k=i_on_afegir;
		CanviaIndexosCapesSpliceCapa(1, k, -1, ParamCtrl);
	}
	ParamCtrl.capa.splice(k, 0, capa);

	AfegeixSimbolitzacioVectorDefecteCapa(ParamCtrl.capa[k], false);
	CompletaDefinicioCapa(ParamCtrl.capa[k]);

	//Redibuixo el navegador perquè les noves capes siguin visibles
	//RevisaEstatsCapes();

	if (calia_consultes!=CalActivarConsultesALaBarra())
		CreaBarra(null);

	RepintaMapesIVistes();
}

function CarregaFitxerLocalOURLSeleccionat(form)
{
	// Cal que faci alguna comprovació entre extensió i tipus perquè sino no s'enten		
	if(form.file_type.value=="geojson" || form.file_type.value=="geotiff")
	{
		if(form.source_type.value=="local")
		{
			CarregaFitxersLocalsSeleccionats(form);
			return;
		}
		else //if(form.source_type.value=="url")
		{
			CarregaFitxerURLSeleccionat(form);
			return;
		}				
	}
	else if(form.file_type.value=="csv")
	{
		if (form.source_type.value=="url")
		{
			if (form.url_fitxer.value.length<1)
				return;
			var configuracio={};
			if(null==(configuracio=LlegeixParametresCSV(form)))
				return;	
			
			AfegeixCapaCSV_URL(NumeroDeCapesVolatils(-1), configuracio, form.crs_csv.value ? form.crs_csv.value: "EPSG:4326", form.url_fitxer.value);
			TancaFinestraLayer("afegirCapa");
			return;
		}
		else  if(form.source_type.value=="local")
		{
			if(!form.nom_fitxer_local.files[0].name)
				return;
			var configuracio={};
			if(null==(configuracio=LlegeixParametresCSV(form)))
				return;
			CarregaCapaCSVLocal(NumeroDeCapesVolatils(-1), configuracio, form);	
			TancaFinestraLayer("afegirCapa");			
			return;
		}
	}
	return;
	
}

function PlegaFieldSet(form)
{
	form.configCSV.height="8px"; /* for IE purposes, this can't be 0 */
	form.configCSV.overflow="hidden";
	form.configCSV.overflow="-moz-hidden-unscrollable";
	form.configCSV.padding="2px";
	form.configCSV.legend.span.before.content="+"; /* add a plus sign to indicate that it can be expanded still (since not active) */
  //padding: 10px 10px 10px 10px; 
  //margin: 10px 10px 10px 10px; 

}

var FieldSetPlegatConfigCSV=true, FieldSetDesactivatConfigCSV=true;
			
function PlegaDesplegaFieldSetConfiguracio(form)
{
	if(FieldSetPlegatConfigCSV && FieldSetDesactivatConfigCSV==false)
	{
		form.configCSV.className="deplegat";		
		document.getElementById("titolconfigCSV").innerHTML="- " + GetMessage("Parameters")+" (CSV)";
		FieldSetPlegatConfigCSV=false;
	}
	else
	{
		form.configCSV.className="plegat";
		document.getElementById("titolconfigCSV").innerHTML="+ " + GetMessage("Parameters")+" (CSV)";
		FieldSetPlegatConfigCSV=true;
	}
}
function DesactivaParametresCSV(form)
{
	FieldSetDesactivatConfigCSV=true;
	form.configCSV.disabled=true;
	PlegaDesplegaFieldSetConfiguracio(form);
}

function ActivaParametresCSV(form)
{
	form.configCSV.disabled=false;
	FieldSetDesactivatConfigCSV=false;
}

function DonaCadenaDesplegableCRS(id_desplegable, selectedCRS)
{
var cdns=[], i, crs_up= (selectedCRS ? selectedCRS.toUpperCase(): "EPSG:4326");

	if(CRSIds.length<1)
		InicialitzaArrayDeCRSIds();

	cdns.push("<select name=\"crs_",id_desplegable,"\" id=\"crs_",id_desplegable,"\">");
	
	for (i = 0; i < CRSIds.length; i++) 
		cdns.push("<option value=\"",CRSIds[i].id,"\"", (crs_up==CRSIds[i].id ? "selected":""), ">",DonaCadena(CRSIds[i].desc),"</option>");
	
	cdns.push("</select>");	
	return cdns.join("");
}

function DonaCadenaDesplegableEncoding(id_desplegable, selectedEncoding)
{
var LlistaEncoding=[
	{id:"windows-1252", desc: "Windows 1252 (Western Latin)"},
	{id:"utf-8", desc: "UTF-8"},
	{id:"iso8859-2", desc: "ISO-8859-2 (Latin 2)"},
	{id:"iso8859-3", desc: "ISO-8859-3 (Latin 3)"},
	{id:"iso8859-4", desc: "ISO-8859-4 (Latin 4)"},
	{id:"iso8859-5", desc: "ISO-8859-5 (Cyrillic)"},
	{id:"iso8859-6", desc: "ISO-8859-6, ecma-114 (Arabic)"},
	{id:"iso8859-7", desc: "ISO-8859-7 (greek)"},
	{id:"iso8859-8", desc: "ISO-8859-8 (hebrew)"},
	{id:"iso-8859-8-i", desc: "ISO-8859-8-I (logical)"},
	{id:"iso-8859-10", desc: "ISO-8859-10 (Latin 6)"},
	{id:"iso-8859-11", desc: "Windows-874, DOS-874"},
	{id:"iso-8859-13", desc: "ISO-8859-13"},
	{id:"iso-8859-14", desc: "ISO-8859-14"},
	{id:"iso-8859-15", desc: "ISO-8859-15 (Latin 9)"},
	{id:"iso-8859-16", desc: "ISO-8859-16"},
	{id:"windows-1250", desc: "Windows-1250"},
	{id:"windows-1251", desc: "Windows-1251"},
	{id:"windows-1253", desc: "Windows-1253"},
	{id:"iso-8859-9", desc: "ISO 8859-9, windows-1254, Latin 5"},
	{id:"windows-1255", desc: "Windows-1255"},
	{id:"windows-1256", desc: "Windows-1256"},
	{id:"windows-1257", desc: "Windows-1257"},
	{id:"windows-1258", desc: "Windows-1258"},
	{id:"cp866", desc: "IBM866"},				
	{id:"koi8", desc: "KOI8-R"},	
	{id:"koi8-ru", desc: "KOI8-U"},	
	{id:"macintosh", desc: "Macintosh"},	
	{id:"x-mac-cyrillic", desc: "X-MAC-Cyrillic"}	
	];
var cdns=[], i, encoding_up=(selectedEncoding ? selectedEncoding.toLowerCaseCase() : "utf-8");
	
	cdns.push("<select name=\"encoding_",id_desplegable,"\" id=\"encoding_",id_desplegable,"\">");	
	for (i = 0; i < LlistaEncoding.length; i++) 
		cdns.push("<option value=\"",LlistaEncoding[i].id,"\"", (encoding_up==LlistaEncoding[i].id ? "selected":""), ">",DonaCadena(LlistaEncoding[i].desc),"</option>");
	
	cdns.push("</select>");	
	return cdns.join("");
}
			
function DonaCadenaAfegeixCapaServidor(url, i_capa)
{
var cdns=[], i;

	// From server
	cdns.push("<div class=\"Verdana11px\" style=\"position:absolute; left:10px; top:10px;\">",
		"<form name=\"AfegeixCapaServidor\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerAfegeixCapaServidor\">",
			"<fieldset><legend>",
			GetMessage("NewLayerFromServer", "cntxmenu"),
			": </legend>",
			GetMessage("SpecifyServerURL", "cntxmenu"),
			":<br><input type=\"text\" name=\"servidor\" style=\"width:400px;\" ", (url ? "value=\"" + url + "\"" : "placeholder=\"https://\""), " />",
			"<br/>",
			"<input type=\"hidden\" name=\"cors\" value=\"",ParamCtrl.CorsServidorLocal,"\">",
			"<input type=\"hidden\" name=\"tipus\" value=\"TipusWMS\">",
			"<input type=\"radio\" id=\"RadioVersion_WMS11\" name=\"versio\" value=\"1.1.0\" onclick=\"document.AfegeixCapaServidor.tipus.value='TipusWMS';\"><label for=\"RadioVersion_WMS11\">OGC WMS v 1.1</label>",
			"<input type=\"radio\" id=\"RadioVersion_WMS111\" name=\"versio\" value=\"1.1.1\" onclick=\"document.AfegeixCapaServidor.tipus.value='TipusWMS';\"><label for=\"RadioVersion_WMS111\">OGC WMS v 1.1.1</label>",
			"<input type=\"radio\" id=\"RadioVersion_WMS13\" name=\"versio\" value=\"1.3.0\" checked=\"checked\" onclick=\"document.AfegeixCapaServidor.tipus.value='TipusWMS';\"><label for=\"RadioVersion_WMS13\">OGC WMS v 1.3</label><br/>",
			"<input type=\"radio\" id=\"RadioOAPI_Maps\" name=\"versio\" value=\"OAPI_Maps\" onclick=\"document.AfegeixCapaServidor.tipus.value='TipusOAPI_Maps';\"><label for=\"RadioOAPI_Maps\">OGC API Maps</label>",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",
			GetMessage("Explore"),
			"\" onClick=\"FesPeticioCapacitatsIParsejaResposta(document.AfegeixCapaServidor.servidor.value, document.AfegeixCapaServidor.tipus.value, document.AfegeixCapaServidor.versio.value, JSON.parse(document.AfegeixCapaServidor.cors.value), null, ", i_capa, ", MostraCapesCapacitatsWMS, null);\" />");
	if(LlistaServOWS && LlistaServOWS.length)
	{
		cdns.push("<br><br>",
			GetMessage("orChooseOnFromServiceList","cntxmenu"),
			"<br>",
			"<select name=\"llista_cat_serveis_OWS\" id=\"llista_cat_serveis_OWS\" class=\"Verdana11px\"",
			" onChange=\"ActualitzaLlistaServSegonsCategoriaSel(form);\">");
		var categoria_previa="";
		for(i=0;i<LlistaServOWS.length; i++)
		{
			if(categoria_previa!=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
			{
				categoria_previa=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase();
				if(categoria_previa=="zz"+GetMessage("Others").toLowerCase()+"zz")
					cdns.push("<option value=\"", categoria_previa, "\">",  GetMessage("Others"));
				else
					cdns.push("<option value=\"", categoria_previa, "\">",  DonaCadena(LlistaServOWS[i].categoria.desc));
			}
		}
		cdns.push("</select><br>",
   		  		  "<select name=\"llista_serveis_OWS\" id=\"llista_serveis_OWS\" class=\"Verdana11px\"",
				  " onChange=\"MostraServidorSeleccionatDeLlistaOWSAEdit(form);\">");
		var categoria_sel=DonaCadena(LlistaServOWS[0].categoria.desc).toLowerCase();
		i=0;
		cdns.push("<option value=\"\">--",  GetMessage("ChooseOneFromList", "cntxmenu"), "--");
		while(categoria_sel==DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
		{
			//cdns.push("<option value=\"", LlistaServOWS[i].url, "\">",  DonaCadena(LlistaServOWS[i].nom));
			cdns.push("<option value=\"", i, "\">",  DonaCadena(LlistaServOWS[i].nom));
			i++;
		}
		cdns.push("</select>");
	}
	cdns.push("</fieldset>",
	          "</div></form>");
			  
	// From file
	FieldSetPlegatConfigCSV=true;
	//https://stackoverflow.com/questions/5138719/change-default-text-in-input-type-file	
	cdns.push("<form name=\"AfegeixCapaFitxer\" onSubmit=\"return false;\">",
			"<fieldset><legend>", GetMessage("NewLayerFromFile", "cntxmenu"),": </legend>",
			"<input type=\"radio\" id=\"RadioAddFileTypeCSV\" name=\"file_type\" value=\"csv\" onclick=\"ActivaParametresCSV(form);\"><label for=\"RadioAddFileTypeCSV\">CSV ",GetMessage("or")," TXT</label>&nbsp;&nbsp;&nbsp;&nbsp;",			
			"<input type=\"radio\" id=\"RadioAddFileTypeGeoJSON\" name=\"file_type\" value=\"geojson\" checked=\"checked\" onclick=\"DesactivaParametresCSV(form);\"><label for=\"RadioAddUrlTypeGeoJSON\">GeoJSON</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
			"<input type=\"radio\" id=\"RadioAddFileTypeGeoTIFF\" name=\"file_type\" value=\"geotiff\" onclick=\"DesactivaParametresCSV(form);\"><label for=\"RadioAddUrlTypeGeoTIFF\">GeoTIFF ",GetMessage("or")," COG</label><br>",			
			"<fieldset><legend>",GetMessage("Source"),"</legend>",		
			"<input type=\"radio\" id=\"RadioAddFileSourceLocalFile\" name=\"source_type\" value=\"local\" ",
			"onclick=\"ActivaBotoFitxerDeFontLocal(form);\"><label for=\"RadioAddFileSourceLocalFile\">",GetMessage("LocalDrive", "cntxmenu"),": </label>",						
			"<input type=\"file\" name=\"nom_fitxer_local\" id=\"openLocalFile\" class=\"Verdana11px\" disabled accept=\".json;.geojson;.tiff;.tif;.cog;.csv;.txt\"><br>",					
			"<input type=\"radio\" id=\"RadioAddFileSourceURL\" name=\"source_type\" value=\"url\" checked=\"checked\"",
			"onclick=\"ActivaEditFitxerDeURL(form);\"><label for=\"RadioAddFileSourceURL\">URL: </label>",
			"<input type=\"text\" name=\"url_fitxer\" style=\"width:400px;\" ", (url ? "value=\"" + url + "\"" : "placeholder=\"https://\""), " /></fieldset>",
			"<fieldset name=\"configCSV\" id=\"configCSV\" class=\"plegat\" disabled>",
			"<legend name=\"titolconfigCSV\" id=\"titolconfigCSV\" onClick=\"PlegaDesplegaFieldSetConfiguracio(form);\">",FieldSetPlegatConfigCSV ? "+ ": "- ", 
			GetMessage("Parameters")," (CSV): </legend>", 
			"<label for=\"encoding_csv\">", GetMessage("Encoding", "cntxmenu"), ": </label>",
			DonaCadenaDesplegableEncoding("csv"),"<br>",
			"<fieldset><legend>", GetMessage("CSVFieldDelimiter", "cntxmenu"),": </legend>",	
			"<input type=\"radio\" id=\"TabDelimiter\" name=\"fieldDelimitador\" value=\"tab\">",
			"<label for=\"TabDelimiter\">Tab</label>",	
			"<input type=\"radio\" id=\"commaDelimiter\" name=\"fieldDelimitador\" value=\"comma\" checked=\"checked\">",
			"<label for=\"commaDelimiter\">", GetMessage("Comma", "cntxmenu"),"</label>",	
			"<input type=\"radio\" id=\"semicolonDelimiter\" name=\"fieldDelimitador\" value=\"semicolon\">",
			"<label for=\"semicolonDelimiter\">", GetMessage("Semicolon", "cntxmenu"),"</label>",	
			"<input type=\"radio\" id=\"spaceDelimiter\" name=\"fieldDelimitador\" value=\"space\">",
			"<label for=\"spaceDelimiter\">", GetMessage("Space", "cntxmenu"),"</label>",	
			"<input type=\"radio\" id=\"textDelimiter\" name=\"fieldDelimitador\" value=\"text\">",	
			"<input type=\"text\" id=\"separa_csv\" name=\"separa_csv\" style=\"width:30px;\">","</fieldset>",
			"<input type=\"checkbox\" id=\"header_csv\" name=\"header_csv\" checked=\"checked\"><label for=\"header_csv\">", GetMessage("FirstLineContainsFieldsName", "cntxmenu"), "</label><br>",
			"<fieldset><legend>", GetMessage("Geometry", "cntxmenu"),": </legend>",	
			"<label for=\"crs_csv\">CRS: </label>",
			DonaCadenaDesplegableCRS("csv"),"<br>",			
			"<input type=\"radio\" id=\"TipusGeoCamp\" name=\"tipus_geo\" value=\"camp\" checked=\"checked\">",
				"<label for=\"TipusGeoCamp\">",GetMessage("CSVNameGeoField", "cntxmenu"),": </label><br>",
				"&nbsp;&nbsp;&nbsp;<input type=\"text\" id=\"camp_geo\" name=\"camp_geo\" style=\"width:250px;\"><br>",
			"<input type=\"radio\" id=\"TipusGeoPunt\" name=\"tipus_geo\" value=\"camp\">",
				"<label for=\"TipusGeoPunt\">", GetMessage("NameFieldWith", "cntxmenu"),": </label><br>",
				"&nbsp;&nbsp;&nbsp;<label for=\"camp_geo_punt_x\">",GetMessage("XField", "cntxmenu"),": </label>",
				"<input type=\"text\" id=\"camp_geo_punt_x\" name=\"camp_geo_punt_x\" style=\"width:250px;\"><br>",
				"&nbsp;&nbsp;&nbsp;<label for=\"camp_geo_punt_y\">",GetMessage("YField", "cntxmenu"),": </label>",
				"<input type=\"text\" id=\"camp_geo_punt_y\" name=\"camp_geo_punt_y\" style=\"width:250px;\"><br>",
			"</fieldset>",
			"<label for=\"camp_time\">",GetMessage("CSVNameDateTimeField", "cntxmenu"),": </label>",
			"<input type=\"text\" id=\"camp_time\" name=\"camp_time\" style=\"width:200px;\"><br>",
			"</fieldset>",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",
		     GetMessage("Add"),
			"\" onClick=\"CarregaFitxerLocalOURLSeleccionat(form)\" />",
		"</fieldset></form>");		
	cdns.push("</div>");
	return cdns.join("");
}

function ActivaEditFitxerDeURL(form)
{
	form.url_fitxer.disabled=false;
	form.nom_fitxer_local.disabled=true;
}

function ActivaBotoFitxerDeFontLocal(form)
{
	form.url_fitxer.disabled=true;
	form.nom_fitxer_local.disabled=false;
}

function MostraCapesCapacitatsWMS(servidorGC)
{
var cdns=[], j, layer, j_selected;
	cdns.push("<b>",
	  	GetMessage("ServerURL", "cntxmenu"),
	  	":</b><br><input type=\"text\" name=\"servidor\" readOnly style=\"width:400px;\" value=\"",
	  	servidorGC.servidor, "\" />",
		"<br><br><b>",
		GetMessage("Title"),
		":</b><br>");
	if(servidorGC.titol)
		cdns.push(servidorGC.titol);
	cdns.push("<br><br><hr><br><div class=\"layerselectorcapesafegir\">",
		  "<b>",GetMessage("Layers"),":</b><br>",
		  "<input name=\"seltotes_capes\" onclick=\"SeleccionaTotesLesCapesDelServidor(form);\" type=\"checkbox\" />",
		  GetMessage("SelectAllLayers", "cntxmenu"), "<br><br><table class=\"Verdana11px\">");
	for(var i=0; i<servidorGC.layer.length; i++)
	{
		layer=servidorGC.layer[i];
		cdns.push("<tr><td><input name=\"sel_capes\" value=\"", i, "\" type=\"checkbox\">",
					DonaCadenaNomDesc(layer));
		cdns.push("</td><td><select name=\"format_capa_", i, "\" class=\"Verdana11px\">");

		j_selected=DonaFormatGetMapCapesWMS(servidorGC, i);
		for(j=0; j<servidorGC.formatGetMap.length; j++)
			cdns.push("<option value=\"", j, "\"", (j_selected==j ? " selected" : ""), ">",  servidorGC.formatGetMap[j]);
		if (layer.esCOG && layer.uriDataTemplate)
			cdns.push("<option value=\"-1\" selected>",  "Cloud Optimized GeoTIFF direct");
		cdns.push("</select></td></tr>");
	}
	cdns.push("</table></div><br>",
		  "<input type=\"button\" class=\"Verdana11px\" value=\"",
		  GetMessage("Add"),
		  "\"",
		  " onClick='AfegeixCapesWMSAlNavegadorForm(form, ",servidorGC.index,");TancaFinestraLayer(\"afegirCapa\");' />",
		  "<input type=\"button\" class=\"Verdana11px\" value=\"",
		  GetMessage("Cancel"),
		  "\"",
		  " onClick='TancaFinestraLayer(\"afegirCapa\");' />");
	document.getElementById("LayerAfegeixCapaServidor").innerHTML=cdns.join("");
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
	ComprovaCalTancarFeedbackAmbScope();
var elem=ObreFinestra(window, "afegirCapa", GetMessage("ofAddingLayerToBrowser", "cntxmenu"));
	if (!elem)
		return;
	FinestraAfegeixCapaServidor(elem, i_capa);
}

function IniciaFinestraCalculadoraCapes()
{
	ComprovaCalTancarFeedbackAmbScope();
var elem=ObreFinestra(window, "calculadoraCapa", GetMessage("toMakeCalculationsOfLayers", "cntxmenu"));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaCalculadoraCapes());
}

function IniciaFinestraCombiCapa()
{
	ComprovaCalTancarFeedbackAmbScope();
var elem=ObreFinestra(window, "combinacioCapa", GetMessage("toCombineLayers", "cntxmenu"));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaCombinacioCapes());
}

function ObreFinestraReclassificaCapa(i_capa, i_estil)
{
var elem=ObreFinestra(window, "reclassificaCapa", GetMessage("toReclassifyLayer", "cntxmenu"));
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

function ActivaConstantOCapaSeleccioCondicional(prefix_id, i_condicio, quin_radial)
{
	document.getElementById("div-" + prefix_id + "-operador-" + i_condicio).style.display=(quin_radial=="qualsevol") ? "none" : "block";
	document.getElementById("div-" + prefix_id + "-cc-constant-" + i_condicio).style.display=(quin_radial=="constant" || quin_radial=="selector") ? "inline" : "none";
	document.getElementById("span-text-" + prefix_id + "-cc-constant-" + i_condicio).innerHTML=GetMessage((quin_radial=="selector")? "InitialValue" : "Value")+":";
	document.getElementById("div-" + prefix_id + "-cc-capa-" + i_condicio).style.display=(quin_radial!="capa") ? "none" : "inline";
}


/*Retorna un objecte amb "n_capa" que és nombre de capes compatibles amb i_capa i la vista actual (o si i_capa==-1 només amb la vista actual)
i "i_capa_unica" que és la primera capa compatible (o la única si només n'hi ha una)*/
function DonaNCapesVisiblesOperacioArraysBinarisOVectors(i_capa, considera_vectors, nomes_categoric)
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
					!EsCapaDinsAmbitCapa(capa, ParamCtrl.capa[i_capa]) || !EsCapaBinaria(capa) || !capa.valors))
					continue;
			}
			else
			{
				// Quan l'origen és ràster ho vull tot el que sigui vector o capa binària
				if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) ||
					((i_capa==-1) ? false : !EsCapaDinsAmbitCapa(capa, ParamCtrl.capa[i_capa])) || (capa.model!=model_vector && (!EsCapaBinaria(capa) || !capa.valors)))
					continue;
				if (nomes_categoric && !EsCapaAmbAlgunEstilAmbCategories(capa))
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
				((i_capa==-1) ? false : !EsCapaDinsAmbitCapa(capa, ParamCtrl.capa[i_capa])) || !EsCapaBinaria(capa) || !capa.valors)
				continue;
			if (nomes_categoric && !EsCapaAmbAlgunEstilAmbCategories(capa))
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
	if (estil.categories && estil.categories.length && estil.attributes)
	{
		cdns.push("<label for=\"", prefix_id, "-valor-",i_condicio, "\">", GetMessage("Value"), ":</label>");
		if (estil.categories.length>1)
		{
			cdns.push("<select  id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\">",
				DonaCadenaOpcionsCategories(estil.categories, estil.attributes, 0, sortCategoriesValueAscendent),
				"</select>");
		}
		else
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" />", DonaTextCategoriaDesDeColor(estil.categories, estil.attributes, 0, true));
		cdns.push("<br>");

		//Posar un botó d'afegir a l'expressió de reclassificació
		cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
		     	GetMessage("WriteValueInExpression", "cntxmenu"),
		        "\" onClick='EscriuValorALaReclasssificacioAfegeixCapa(\"",prefix_id,"\");' />");
	}
	else
	{
		if (estil.component[0].estiramentPaleta && typeof estil.component[0].estiramentPaleta.valorMaxim!=="undefined" && typeof estil.component[0].estiramentPaleta.valorMinim!=="undefined")
			cdns.push(GetMessage("RecommendedRangeOfValues", "cntxmenu"), ": [", estil.component[0].estiramentPaleta.valorMinim, ",", estil.component[0].estiramentPaleta.valorMaxim, "]");
	}
	//cdns.push("</div>");
	return cdns.join("");
}

function CanviaValorSeleccionatSeleccioCondicional(prefix_id, i_condicio)
{
var i_option=document.getElementById(prefix_id+"-valor-select-"+i_condicio).selectedIndex;
	document.getElementById(prefix_id+"-valor-"+ i_condicio).value=document.getElementById(prefix_id+"-valor-select-"+i_condicio).options[i_option].text;
}

function sortCategoriesValueAscendent(a,b)
{
	return ((a.value<b.value) ? -1 : ((a.value>b.value) ? 1 : 0));
}

function DonaCadenaOpcionsCategories(categories, attributes, i_cat_sel, f_ordena)
{
var cdns=[];
	if (f_ordena)
	{
		var cat=[];
		for (var i_cat=0; i_cat<categories.length; i_cat++)
		{
			if (categories[i_cat])
				cat.push({i_cat: i_cat, value: DonaTextCategoriaDesDeColor(categories, attributes, i_cat, true)});
		}
		cat.sort(f_ordena);
		for (var i=0; i<cat.length; i++)
		{
			cdns.push("<option value=\"",cat[i].i_cat,"\"",
					((cat[i].i_cat==i_cat_sel) ? " selected=\"selected\"" : "") ,
					">", cat[i].value, "</option>");
		}
		return cdns.join("");
	}
	for (var i_cat=0; i_cat<categories.length; i_cat++)
	{
		if (categories[i_cat])
		{
			cdns.push("<option value=\"",i_cat,"\"",
					((i_cat==i_cat_sel) ? " selected=\"selected\"" : "") ,
				">", DonaTextCategoriaDesDeColor(categories, attributes, i_cat, true), "</option>");
		}
	}
	return cdns.join("");
}

function DonaCadenaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil_o_atrib)
{
var cdns=[], nc, capa=ParamCtrl.capa[i_capa];
var estil_o_atrib;

	if(capa.model==model_vector)
	{
		var attributesArray=Object.keys(capa.attributes);
		estil_o_atrib=capa.attributes[attributesArray[i_estil_o_atrib]];
	}
	else
		estil_o_atrib=capa.estil[i_estil_o_atrib];

	//Una caixa que permeti triar un operador
	cdns.push("<div id=\"div-", prefix_id, "-operador-",i_condicio,"\" ><label for=\"", prefix_id, "-operador-",i_condicio, "\">",
			  GetMessage("Operator"), ":</label>",
			"<select id=\"", prefix_id, "-operador-",i_condicio,"\" name=\"operador", i_condicio, "\" style=\"width:80px;\">",
			"<option value=\"==\" selected=\"selected\">=</option>",
			"<option value=\"!=\">=/=</option>");
	if (capa.model==model_vector || DonaTractamentComponent(estil_o_atrib, 0)!="categoric")
	{
		cdns.push("<option value=\"<\">&lt;</option>",
			"<option value=\">\">&gt;</option>",
			"<option value=\"<=\">&lt;=</option>",
			"<option value=\">=\">&gt;=</option>");
	}
	cdns.push("</select></div>");

	nc=DonaNCapesVisiblesOperacioArraysBinarisOVectors(i_capa, capa.model==model_vector? true :false, false);
	cdns.push(	"<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-qualsevol\" name=\"cc",i_condicio, "\" value=\"qualsevol\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", \"qualsevol\");' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-constant\">", GetMessage("anyValue", "cntxmenu"), "</label>",
			"<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-constant\" name=\"cc",i_condicio, "\" value=\"constant\" checked=\"checked\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", \"constant\");' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-constant\">", GetMessage("constant", "cntxmenu"), "</label>",
			"<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-selector\" name=\"cc",i_condicio, "\" value=\"selector\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", \"selector\");' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-selector\">", GetMessage("selector", "cntxmenu"), "</label>");
	if (nc.n_capa>1)
		cdns.push("<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-capa\" name=\"cc",i_condicio, "\" value=\"capa\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", \"capa\");' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-capa\">", GetMessage("layer"), "</label>");

	cdns.push("<br>");

	//Una caixa que permeti triar un valor
	cdns.push("<div id=\"div-", prefix_id, "-cc-constant-",i_condicio,"\" style=\"display:inline;\">",
		"<label for=\"", prefix_id, "-valor-",i_condicio, "\" id=\"span-text-", prefix_id, "-cc-constant-",i_condicio,"\">", GetMessage("Value"), ":</label>");
	if(capa.model==model_vector)
	{
		if(capa.objectes && capa.objectes.features && capa.objectes.features.length>0)
		{
			//·$· El més probable és que no tingui els valors de les propietats, només tindrè els que s'han consultat, caldrà fer alguna cosa com es va dfer per la qualitats
			var feature, attribute_name=attributesArray[i_estil_o_atrib], valors_atrib=[],i_obj, i_valor;

			for (i_obj=0; i_obj<capa.objectes.features.length; i_obj++)
			{
				feature=capa.objectes.features[i_obj];
				if (typeof feature.properties[attribute_name]==="undefined" ||
		    		feature.properties[attribute_name]=="" ||
					feature.properties[attribute_name]==null)
					continue;
				if (valors_atrib.length==0 || valors_atrib[valors_atrib.length-1]!=DonaCadena(feature.properties[attribute_name]))  //Això evita que si n'hi ha de repetits seguits es posin a la llista
					valors_atrib.push(DonaCadena(feature.properties[attribute_name]));
			}
			// pensar de fer una funció específica per nombres si acabo posant tipus als attributes
			valors_atrib.sort(sortAscendingStringSensible);
			valors_atrib.removeDuplicates(sortAscendingStringSensible);

			if(valors_atrib.length>0)
			{
				cdns.push("<select id=\"", prefix_id, "-valor-select-",i_condicio,"\" name=\"valor-select", i_condicio,
						  "\" style=\"width:360px;\" onChange='CanviaValorSeleccionatSeleccioCondicional(\"",prefix_id,"\", ", i_condicio,");'>");
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
		if (estil_o_atrib.categories && estil_o_atrib.categories.length && estil_o_atrib.attributes)
		{
			if (estil_o_atrib.categories.length>1)
			{
				cdns.push("<select id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\">",
					DonaCadenaOpcionsCategories(estil_o_atrib.categories, estil_o_atrib.attributes, 0, sortCategoriesValueAscendent),
					"</select>");
			}
			else
				cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" />", DonaTextCategoriaDesDeColor(estil_o_atrib.categories, estil_o_atrib.attributes, 0, true));
			cdns.push("<br>");
		}
		else
		{
			cdns.push("<input type=\"text\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\" value=\"\" /><br>");
			if (estil_o_atrib.component[0].estiramentPaleta && typeof estil_o_atrib.component[0].estiramentPaleta.valorMaxim!=="undefined" && typeof estil_o_atrib.component[0].estiramentPaleta.valorMinim!=="undefined")
				cdns.push(GetMessage("RecommendedRangeOfValues", "cntxmenu"), ": [", estil_o_atrib.component[0].estiramentPaleta.valorMinim, ",", estil_o_atrib.component[0].estiramentPaleta.valorMaxim, "]");
		}
	}
	cdns.push("</div>");
	if (nc.n_capa>1)
	{
		//Una caixa que permeti triar un valor com a capa
		cdns.push("<div id=\"div-", prefix_id, "-cc-capa-",i_condicio,"\" style=\"display:none\">",
			DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, {vull_operador: false, nomes_categoric: false, vull_valors: false, vull_dates: true, vull_dims: true}),
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

	// Desplegable de dates si s'escau.
	if (param.vull_dates && capa.AnimableMultiTime && capa.data && capa.data.length)
	{
		cdns.push("<label for=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"data-",i_condicio, "\">", GetMessage("Date"), ": </label>");
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
			cdns.push("<option value=\"null\" selected=\"selected\">" , GetMessage("SelectedInLayer", "cntxmenu"), "</option>");
			cdns.push("</select>");
		}
		else
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"data-",i_condicio,"\" name=\"",(param.vull_operador? "": "valor_"),"data", i_condicio, "\" />", DonaDataCapaComATextBreu(i_capa,0));
		cdns.push("<br>");
	}
	
	// Desplegable de dimensions
	if(param.vull_dims && capa.dimensioExtra &&  capa.dimensioExtra.length)
	{
		var dim;
		for(var i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
		{
			dim=capa.dimensioExtra[i_dim];			
			cdns.push("<label for=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"dimensio-",i_dim,"-",i_condicio, "\">", DonaCadenaNomDesc(dim.clau), ": </label>");
			cdns.push("<select id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"dimensio-",i_dim,"-",i_condicio,"\" name=\"",(param.vull_operador? "": "valor_"),"dimensio-",i_dim,"-",i_condicio, "\" style=\"width:400px;\">");			
			for (var i_v_dim=0; i_v_dim<dim.valor.length; i_v_dim++)
			{
				cdns.push("<option value=\"",i_v_dim,"\"",					
				">", DonaCadenaNomDescFormula(dim.formulaDesc, dim.valor[i_v_dim]), "</option>\n");
			}
			cdns.push("<option value=\"null\" selected=\"selected\">" , GetMessage("SelectedInLayer", "cntxmenu"), "</option>");
			cdns.push("</select><br>");			
		}
	}
	
	// Desplegable de les bandes disponibles
	if(capa.model==model_vector)
	{
		if (capa.attributes)
		{
			var attributesArray=Object.keys(capa.attributes);
			if (attributesArray.length)
			cdns.push("<label for=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-",i_condicio, "\">", GetMessage("Field"), ": </label>");
			if (attributesArray.length>1)
			{
				cdns.push("<select id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",(param.vull_operador? "" : "valor_"),"estil", i_condicio, "\" style=\"width:400px;\"");
				if (param.vull_operador)
					cdns.push(" onChange='CanviaOperadorValorSeleccioCondicional(\"", prefix_id, "\", ", i_capa, ", ", i_condicio, ", parseInt(document.getElementById(\"", prefix_id, "-",(param.vull_operador? "": "valor-"), "estil-", i_condicio, "\").value));'");
				cdns.push(">");
				for (var i_atrib=0; i_atrib<attributesArray.length; i_atrib++)
				{
					cdns.push("<option value=\"",i_atrib,"\"",
							((i_atrib==0) ? " selected=\"selected\"" : "") ,
						">", DonaCadenaDescripcioAttribute(attributesArray[i_atrib], capa.attributes[attributesArray[i_atrib]], false), "</option>");
				}
				cdns.push("</select>");
			}
			else
				cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",
						 (param.vull_operador? "": "valor_"),"estil", i_condicio, "\" />", DonaCadenaDescripcioAttribute(attributesArray[0], capa.attributes[attributesArray[0]], false));
			cdns.push("<br>");
		}
	}
	else
	{
		if (capa.estil && capa.estil.length)
		{
			cdns.push("<label for=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"estil-",i_condicio, "\">", GetMessage("Field"), ": </label>");
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

// i_capa és la capa que se seleccionarà per defecte en el selector. Pot ser -1 per seleccionar la primera compatible.
// param.vull_operador: indica que vull els operadors per fer una condició per selecció
// param.nomes_categoric: només vull capes ràster amb categories
// param.vull_valors:
// param.vull_dates: Vull que es mostri el selector de dates si la capa és multitime
// param.vull_dims: Vull que es mostrin els selectors de les dimensions extra si la capa en té

function DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, param)
{
var cdns=[], capa, nc, capa_def, origen_vector;

	nc=DonaNCapesVisiblesOperacioArraysBinarisOVectors(i_capa, param.vull_operador==true? true:false, param.nomes_categoric);
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
	cdns.push("<label for=\""+prefix_id+"-",(param.vull_operador? "": "valor-"),"capa-",i_condicio, "\">", GetMessage("Layer"), ":</label>");
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
					if (i!=i_capa && (!EsCapaBinaria(capa) || !capa.valors))
						continue;
				}
				else
				{
					// Quan l'origen és ràster ho vull tot el que sigui vector o capa binària
					if (capa.model!=model_vector && (!EsCapaBinaria(capa) || !capa.valors))
						continue;
				}
			}
			else if(!EsCapaBinaria(capa) || !capa.valors)
				continue;
			if (param.nomes_categoric && !EsCapaAmbAlgunEstilAmbCategories(capa))
				continue;
			cdns.push("<option value=\"", i, "\"", (i_capa==i ? " selected=\"selected\"" : ""), ">", DonaCadena(capa.DescLlegenda), "</option>");
		}
		cdns.push("</select>");
	}
	else if (nc.n_capa>0)
		cdns.push("<input type=\"hidden\" value=\"",nc.i_capa_unica,"\" id=\"", prefix_id, "-",(param.vull_operador? "": "valor-"),"capa-",i_condicio,"\" name=\"",(param.vull_operador? "": "valor_"),"capa", i_condicio, "\" />", DonaCadena(ParamCtrl.capa[nc.i_capa_unica].DescLlegenda));
	cdns.push("<br>");
	if (i_capa>-1)
	{
		cdns.push("<div id=\"", prefix_id, "-",(param.vull_operador? "" : "capa-valor-"), i_condicio, "\">",
			DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, param),
			"</div>");
	}
	return cdns.join("");
}

function DonaNomNouEstilReclassificacio(prefix_id, i_capa, i_estil)
{
	return DonaCadena(ParamCtrl.capa[i_capa].estil[(i_estil!=null) ? i_estil : parseInt(document.getElementById(prefix_id+"-estil").value)].desc) + " (" + GetMessage("Reclassification", "cntxmenu") + ")";
}

function DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, i_estil)
{
	var estil=ParamCtrl.capa[i_capa].estil[(i_estil!=null) ? i_estil : parseInt(document.getElementById(prefix_id+"-estil").value)];
	return (DonaCadena(estil.desc)? DonaCadena(estil.desc): (estil.nom? estil.nom:GetMessage("byDefault", "cntxmenu") ))+
			" (" + GetMessage("Selection") + ")";
}

function CanviaNomNouEstilSeleccioCondicional(prefix_id, i_capa)
{
	document.SeleccioCondicional.nom_estil.value=DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, null);
}

var MaxCondicionsSeleccioCondicional=10;  //Podria ser configurable en un futur si cal

function DonaCadenaSeleccioCondicional(prefix_id, i_capa)
{
var cdns=[], consulta, nexe, capa, primer_i_estil_valid=null;

	cdns.push("<form name=\"SeleccioCondicional\" onSubmit=\"return false;\">");
	capa=ParamCtrl.capa[i_capa];
	cdns.push("<div style=\"position:absolute; left:10px; top:10px;\">",
			GetMessage("OnlyShowValuesOfLayer", "cntxmenu"), " \"",
			DonaCadena(capa.DescLlegenda), "\"<br/>");
	if (capa.estil && capa.estil.length)
	{
		if(capa.model==model_vector)
			cdns.push("<label for=\"", prefix_id, "-estil\">", GetMessage("ofTheStyle", "cntxmenu"), ": </label>");
		else
			cdns.push("<label for=\"", prefix_id, "-estil\">", GetMessage("ofTheField", "cntxmenu"), ": </label>");
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
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-estil\" name=\"estil\" />", DonaCadena(capa.estil[0].desc)?DonaCadena(capa.estil[0].desc): (capa.estil[0].nom?capa.estil[0].nom: GetMessage("byDefault", "cntxmenu")));
		cdns.push("<br>");
	}
	cdns.push(GetMessage("thatConformFollowingConditions", "cntxmenu"), ":");
	for (var i_condicio=0; i_condicio<MaxCondicionsSeleccioCondicional; i_condicio++)
	{
		cdns.push("<span id=\"", prefix_id, "-nexe-", i_condicio, "\" class=\"Verdana11px\" style=\"display: "+((i_condicio==0) ? "inline" : "none")+"\"><fieldset><legend>",
			GetMessage("Condition"), " ", i_condicio+1, ": </legend>",
			DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, {vull_operador: true, nomes_categoric: false, vull_valors: false, vull_dates: true, vull_dims: true}),
			"</fieldset>");
		if (i_condicio<(MaxCondicionsSeleccioCondicional-1))
		{
			/*(Eventualment Un nexe... i altre cop el mateix)*/
			cdns.push(GetMessage("NexusWithNextCondition", "cntxmenu"), ":",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-none\" name=\"nexe",i_condicio, "\" value=\"\" checked=\"checked\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", false);' />", "<label for=\"", prefix_id, "-nexe-",i_condicio, "-none\">", GetMessage("none"), "</label>",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-and\" name=\"nexe",i_condicio, "\" value=\"and\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", true);' />", "<label for=\"", prefix_id, "-nexe-",i_condicio, "-and\">", GetMessage("and"), "</label>",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-or\" name=\"nexe",i_condicio, "\" value=\"or\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", true);' />",  "<label for=\"", prefix_id, "-nexe-",i_condicio, "-or\">", GetMessage("or"), "</label><br>");
		}
		cdns.push("</span>");
	}

	cdns.push("<hr>",
		GetMessage("TheResultOfSelectionAddedAsNewStyleWithName", "cntxmenu"),
		" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
		DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, (capa.estil && capa.estil.length>1) ? capa.i_estil : 0),
		"\" /><br/>",
		GetMessage("toTheLayer", "cntxmenu"),
		" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("OK"),
	        "\" onClick='ComprovaISiCalCreaBandaSeleccioCondicional(\"", prefix_id, "\",", i_capa,",\"seleccioCondicional\");' />",
		"</div></form>");
	return cdns.join("");
}


function ComprovaISiCalCreaBandaSeleccioCondicional(prefix_id, i_capa, nom_finestra)
{
var sel_condicional, capa;

	var sel_condicional=LlegeixParametresSeleccioCondicional(prefix_id, i_capa);
	capa=ParamCtrl.capa[i_capa];
	if(sel_condicional.condicio && sel_condicional.condicio[0].capa_clau && i_capa==sel_condicional.condicio[0].capa_clau.i_capa && 
		capa.estil && sel_condicional.i_estil!=sel_condicional.condicio[0].capa_clau.i_estil)
	{
		var capa_clau=sel_condicional.condicio[0].capa_clau;
		var contingut_msg=GetMessage("SelectionAppliesToLayer","cntxmenu")+"\""+DonaCadena(capa.DescLlegenda)+"\""+
			GetMessage("andTheFieldOf","cntxmenu")+
			"\""+(DonaCadena(capa.estil[sel_condicional.i_estil].desc)?DonaCadena(capa.estil[sel_condicional.i_estil].desc): capa.estil[sel_condicional.i_estil].nom)+"\""+
			GetMessage("butFirstCondition","cntxmenu")+
			"\""+(DonaCadena(capa.estil[capa_clau.i_estil].desc)?DonaCadena(capa.estil[capa_clau.i_estil].desc):capa.estil[capa_clau.i_estil].nom)+"\""+			
			GetMessage("TheResultingValuesWillBe","cntxmenu")+
			"\""+(DonaCadena(capa.estil[sel_condicional.i_estil].desc)?DonaCadena(capa.estil[sel_condicional.i_estil].desc): capa.estil[sel_condicional.i_estil].nom)+"\""+
			GetMessage("evenIfTheConditionApliesToAnotherField","cntxmenu");
		if(false==confirm(contingut_msg))
			return;
	}
	CreaBandaSeleccioCondicional(prefix_id, i_capa);
	TancaFinestraLayer(nom_finestra);
}

function FinestraSeleccioCondicional(elem, i_capa)
{
	contentLayer(elem, DonaCadenaSeleccioCondicional("condicio-seleccio-condicional", i_capa));
}

function ObreFinestraSeleccioCondicional(i_capa)
{
var elem=ObreFinestra(window, "seleccioCondicional", GetMessage("ofQueryByAttributeSelectionByCondition", "cntxmenu"));
	if (!elem)
		return;
	FinestraSeleccioCondicional(elem, i_capa);
}

function LlegeixParametresCondicioCapaDataEstil(prefix_id, prefix_condicio, i_condicio)
{
var condicio_capa={}, elem;
	condicio_capa.i_capa=parseInt(document.getElementById(prefix_id + prefix_condicio + "-capa-" + i_condicio).value);
	condicio_capa.dim=[];
	var capa=ParamCtrl.capa[condicio_capa.i_capa];
	if (capa.AnimableMultiTime && capa.data && capa.data.length)
	{
		elem=document.getElementById(prefix_id + prefix_condicio + "-data-" + i_condicio);
		if(elem) // Potser que no hi hagi desplegable de dates, per exemple en les seleccions condicionals
		{
			var i_time=parseInt(elem.value);
			if (!isNaN(i_time) && i_time!=null)
				condicio_capa.i_data=i_time;
		}
	}
	// Desplegable de dimensions
	if(capa.dimensioExtra &&  capa.dimensioExtra.length)
	{
		var dim, i_dim, i_v_dim;
		for(i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
		{
			dim=capa.dimensioExtra[i_dim];			
			elem=document.getElementById(prefix_id + prefix_condicio + "-dimensio-" + i_dim +"-"+i_condicio);
			if(elem) // Potser que no hi hagi desplegable de dimensio, per exemple en les seleccions condicionals
			{
				var i_v_dim=parseInt(elem.value);
				if (!isNaN(i_v_dim) && i_v_dim!=null)
					condicio_capa.dim.push({clau: dim.clau, valor: dim.valor[i_v_dim]});
			}
		}
	}
	if(capa.model==model_vector)
	{
		if (capa.attributes)
		{
			var attributesArray=Object.keys(capa.attributes);
			if (attributesArray.length)
				condicio_capa.i_estil=parseInt(document.getElementById(prefix_id + prefix_condicio + "-estil-" + i_condicio).value);
		}
	}
	else
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
		sel_condicional.i_estil=parseInt(document.getElementById(prefix_id+"-estil").value);  //No sé perquè en IE no funciona la manera clàssica.
	sel_condicional.nom_estil=document.SeleccioCondicional.nom_estil.value;
	sel_condicional.condicio=[];		
	
	for (var i_condicio=0; i_condicio<MaxCondicionsSeleccioCondicional; i_condicio++)
	{
		sel_condicional.condicio[i_condicio]={};
		condicio=sel_condicional.condicio[i_condicio];

		condicio.capa_clau=LlegeixParametresCondicioCapaDataEstil(prefix_id, "", i_condicio);

		radials=document.SeleccioCondicional["cc"+i_condicio];
		if (radials)
		{
			if ((radials[1] && radials[1].checked) || (radials[2] && radials[2].checked) || (radials[3] && radials[3].checked))
				condicio.operador=document.SeleccioCondicional["operador"+i_condicio].value;

			if (radials[3] && radials[3].checked)
				condicio.capa_valor=LlegeixParametresCondicioCapaDataEstil(prefix_id, "-valor", i_condicio);
			else if ((radials[1] && radials[1].checked) || (radials[2] && radials[2].checked))
			{
				var valor=document.SeleccioCondicional["valor"+i_condicio].value;
				if (valor && valor!="")  //Si la cadena és buida, no ho recullo"
					condicio.valor=valor;
				else
					delete condicio.operador;
			}
			if (radials[2] && radials[2].checked)
				condicio.selector=true;
		}

		if (i_condicio<(MaxCondicionsSeleccioCondicional-1))
		{
			if (document.SeleccioCondicional["nexe"+i_condicio][1].checked)
				condicio.nexe="&&";
			else if (document.SeleccioCondicional["nexe"+i_condicio][2].checked)
				condicio.nexe="||";
			else
				break;
		}
	}
	return sel_condicional;
}

//Escriu una referència a una capa, valor i data per un càlcul (format {\"i_capa\":0, \"i_valor\":1, \"i_data\":2, \"DIM_NomDim0\": valor_dim0, \"DIM_NomDim1\": valor_dim1})
function DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_valor, i_data, dimensions)
{
var cdns=[];

	cdns.push("{");
	if (i_capa!=i_capa_ref)
		cdns.push("\"i_capa\":",i_capa);
	if (cdns.length!=1)
		cdns.push(",");
	if(ParamCtrl.capa[i_capa].model==model_vector)
	{
		attributesArray=Object.keys(ParamCtrl.capa[i_capa].attributes);
		cdns.push("\"prop\": \"", (typeof i_valor!=="undefined" && i_valor!=null) ? attributesArray[i_valor] : "", "\"");
	}
	else
		cdns.push("\"i_valor\":", (typeof i_valor!=="undefined" && i_valor!=null) ? i_valor : 0);
	if (typeof i_data!=="undefined" && i_data!=null /*&& DonaIndexDataCapa(ParamCtrl.capa[i_capa], null)!=i_data*/)
	{
		if (cdns.length!=1)
			cdns.push(",");
		cdns.push("\"i_data\":"+i_data);
	}
	if(dimensions && dimensions.length)
	{		
		for(var i_dim=0; i_dim<dimensions.length; i_dim++)
		{
			if (typeof dimensions[i_dim].valor!=="undefined" && dimensions[i_dim].valor!=null && dimensions[i_dim].valor.nom)
			{
				if (cdns.length!=1)
					cdns.push(",");
				cdns.push("\"DIM_"+dimensions[i_dim].clau.nom+"\": \""+dimensions[i_dim].valor.nom+"\"");
			}
		}
	}
	cdns.push("}");
	return cdns.join("");
}

function DonaCadenaEstilCapaPerCalcul(i_capa_ref, i_capa, i_data, i_estil, dimensions)
{
	if(ParamCtrl.capa[i_capa].model==model_vector)
	{
		var attributesArray=Object.keys(ParamCtrl.capa[i_capa].attributes)
		var attribute=ParamCtrl.capa[i_capa].attributes[attributesArray[i_estil]];
		if (typeof attribute.calcul!=="undefined")
			//return (i_capa_ref==i_capa) ? attribute.calcul : AfegeixIcapaACalcul(attribute.calcul, i_capa, attributesArray[i_estil]);
		{
			// Cal mirar si he de canviar la referència del càlcul en funció de si hi ha i_data i dimensions en el que s'ha seleccionat i en el càlcul que hi havia
			if(i_capa_ref==i_capa)
			{
				var s=attribute.calcul, inici, final, cadena, nou_valor, nou_calcul="";							
				while ((inici=s.indexOf("{"))!=-1)
				{
					final=BuscaClauTancarJSON(s);
					if  (final==-1)
					{
						alert("Character '{' without '}' in 'calcul' in capa" + i_capa);
						return s;
					}
					cadena=s.substring(inici, final+1);
					//interpreto el fragment metajson
					nou_valor=JSON.parse(cadena);
					if (nou_valor.i_capa==i_capa &&
						(((typeof i_valor==="undefined" || i_valor==null) && (typeof nou_valor.prop==="undefined" || nou_valor.prop==null)) ||						
							nou_valor.prop==attributesArray[i_estil]))
					{
						// Estic revisant la mateixa capa en el mateix estil
						// la reescric de nou						
						nou_valor=DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_estil, i_data, dimensions);												
						nou_calcul+=s.substring(0, inici) + nou_valor;
					}
					else
						nou_calcul+=s.substring(0, inici)+cadena;
					s=s.substring(final+1, s.length);
				}
				nou_calcul=nou_calcul+s;				
				return nou_calcul;
			}			
			return AfegeixIcapaACalcul(attribute.calcul, i_capa, attributesArray[i_estil]);
		}
		if (typeof attribute.FormulaConsulta!=="undefined" && attribute.FormulaConsulta!=null)
		{
			var s=attribute.FormulaConsulta;
			for (var i_atrib=0; i_atrib<attributesArray.length; i_valor++)
			{
				s_patro="p[\""+attributesArray[i_atrib]+"\"]";
				while ((i=s.indexOf(s_patro))!=-1)
					s=s.substring(0, i)+DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_atrib, i_data, dimensions)+s.substring(i+s_patro.length);
			}
			return "("+ s +")";
		}
		return DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_estil, i_data, dimensions);
	}
	else
	{
		var component_sel=ParamCtrl.capa[i_capa].estil[i_estil].component[0], s_patro, i;

		if (typeof component_sel.calcul!=="undefined")
			//return (i_capa_ref==i_capa) ? component_sel.calcul : AfegeixIcapaACalcul(component_sel.calcul, i_capa, i_estil);
		{
			// Cal fer alguna cosa aquí si la capa i_capa_ref i i_capa és la capa en qüestió i tinc dates i/o dimensions, perquè segurament en el càlcul no hi és perquè vull anar fent la que 
			// estigui seleccionada. Però suposo que també he de poder fer la data per defecte per si per exemple vull fer el valor de la banda o del calcul *10
			// Cal mirar si he de canviar la referència del càlcul en funció de si hi ha i_data i dimensions en el que s'ha seleccionat i en el càlcul que hi havia
			if(i_capa_ref==i_capa)
			{
				var s=component_sel.calcul, inici, final, cadena, nou_valor, nou_calcul="";							
				while ((inici=s.indexOf("{"))!=-1)
				{
					final=BuscaClauTancarJSON(s);
					if  (final==-1)
					{
						alert("Character '{' without '}' in 'calcul' in capa" + i_capa);
						return s;
					}
					cadena=s.substring(inici, final+1);
					//interpreto el fragment metajson
					nou_valor=JSON.parse(cadena);
					if (nou_valor.i_capa==i_capa && (nou_valor.i_valor==i_estil || 
						((typeof nou_valor.i_valor==="undefined" ||  nou_valor.i_valor==null) && (typeof i_estil==="undefined" ||  i_estil==null))))
					{
						// Estic revisant la mateixa capa en el mateix estil
						// la reescric de nou						
						nou_valor=DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_estil, i_data, dimensions);												
						nou_calcul+=s.substring(0, inici) + nou_valor;
					}
					else
						nou_calcul+=s.substring(0, inici)+cadena;
					s=s.substring(final+1, s.length);
				}
				nou_calcul=nou_calcul+s;				
				return nou_calcul;
			}
			return AfegeixIcapaACalcul(component_sel.calcul, i_capa, i_estil);
		}
		if (typeof component_sel.FormulaConsulta!=="undefined" && component_sel.FormulaConsulta!=null)
		{
			var valors=ParamCtrl.capa[i_capa].valors;
			var s=component_sel.FormulaConsulta;
			for (var i_valor=0; i_valor<valors.length; i_valor++)
			{
				s_patro="v["+i_valor+"]";
				while ((i=s.indexOf(s_patro))!=-1)
					s=s.substring(0, i)+DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_valor, i_data, dimensions)+s.substring(i+s_patro.length);
			}
			return "("+ s +")";
		}
		return DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, component_sel.i_valor, i_data, dimensions);
	}
}

function CreaBandaSeleccioCondicional(prefix_id, i_capa)
{
var sel_condicional, i_estil_nou, estil, calcul, capa, condicio, estil_o_atrib, selectors=null, selector;

	sel_condicional=LlegeixParametresSeleccioCondicional(prefix_id, i_capa);
	
	//Crea un nou estil
	capa=ParamCtrl.capa[i_capa];

	i_estil_nou=DuplicaEstilCapa(capa, sel_condicional.i_estil, sel_condicional.nom_estil);
	estil=capa.estil[i_estil_nou];

	//Defineix el "calcul" de la selecció que serà de tipus "(capaA<5 || CapaA>capaB)? capa : null"
	if(capa.model!=model_vector)
		calcul="(";
	else
		calcul="";
	for (var i_condicio=0; i_condicio<sel_condicional.condicio.length; i_condicio++)
	{
		condicio=sel_condicional.condicio[i_condicio];
		// Quan la capa és un vector sel_condicional.condicio[i_condicio].capa_clau.i_estil és l'índex del attribute i no de l'estil
		calcul+=DonaCadenaEstilCapaPerCalcul(i_capa, condicio.capa_clau.i_capa, condicio.capa_clau.i_data, condicio.capa_clau.i_estil, condicio.capa_clau.dim);
		if (typeof condicio.operador==="undefined")
			calcul+="!=null";
		else
		{
			calcul+=condicio.operador;
			if (typeof condicio.valor!=="undefined")
			{
				if (condicio.selector)
				{
					if (!selectors)
						selectors=[];
					selectors.push({});
					selector=selectors[selectors.length-1];
					if(capa.model==model_vector)
					{
						var attributesArray=Object.keys(ParamCtrl.capa[condicio.capa_clau.i_capa].attributes);
						estil_o_atrib=ParamCtrl.capa[condicio.capa_clau.i_capa].attributes[attributesArray[condicio.capa_clau.i_estil]];
					}
					else
					{
						estil_o_atrib=ParamCtrl.capa[condicio.capa_clau.i_capa].estil[condicio.capa_clau.i_estil];
						selector.desc=DonaCadenaNomDescItemsLleg(estil_o_atrib);
					}
					if (estil_o_atrib.categories && estil_o_atrib.categories.length && estil_o_atrib.attributes)
					{
						selector.categories=JSON.parse(JSON.stringify(estil_o_atrib.categories));
						selector.attributes=JSON.parse(JSON.stringify(estil_o_atrib.attributes));
					}
					if (estil_o_atrib.estiramentPaleta)
						selector.estiramentPaleta=JSON.parse(JSON.stringify(estil_o_atrib.estiramentPaleta));
					selector.valorActual=condicio.valor;
					calcul+="{\"i_sltr\": " + (selectors.length-1) + "}";
				}
				else
				{
					if (/*capa.model==model_vector &&*/ isNaN(condicio.valor) )
						calcul+=("\""+condicio.valor+"\"");
					else
						calcul+=condicio.valor;
				}
			}
			else
				calcul+=DonaCadenaEstilCapaPerCalcul(i_capa, condicio.capa_valor.i_capa, condicio.capa_valor.i_data, condicio.capa_valor.i_estil, condicio.capa_valor.dim);
		}
		if (typeof condicio.nexe!=="undefined")
			calcul+=condicio.nexe;
	}
	if(capa.model!=model_vector)
		calcul+=")?";

	if(capa.model==model_vector)
	{
		// Creo un attribute nou que contindrà el càlcul
		var attributesArray=Object.keys(capa.attributes);
		//var i_atrib_nou=attributesArray.length;
		var i=0, index=0, nom_proposat=sel_condicional.nom_estil.replaceAll(' ', '_');

		while(i<attributesArray.length)
		{
			if(nom_proposat==attributesArray[i])
			{
				index++;
				nom_proposat=nom_proposat+index;
				i=0;
				continue;
			}
			i++;
		}

		capa.attributes[nom_proposat]={"calcul":calcul,
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
				//estil.component[i_c].calcul=calcul + "v["+estil.component[i_c].i_valor+"]";
				estil.component[i_c].calcul=calcul + "{\"i_valor\": "+estil.component[i_c].i_valor+"}";
				delete estil.component[i_c].i_valor;
			}
			estil.component[i_c].calcul+=":null";
			if (selectors && selectors.length)
				estil.component[i_c].selector=JSON.parse(JSON.stringify(selectors));
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
var elem=ObreFinestra(window, "combinacioRGB", GetMessage("ofRGBCombination", "cntxmenu"));
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
			GetMessage("SelectThreeComponentsOfLayer", "cntxmenu"), " \"",
			DonaCadena(capa.DescLlegenda),
			"\"<br/>");

	for (var i_c=0; i_c<3; i_c++)
	{
		cdns.push("<span id=\"combinacio-rgb-", i_c, "\" class=\"Verdana11px\"><fieldset><legend>",
			GetMessage("Component", "cntxmenu"), " ");
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

		cdns.push(": </legend>",
			DonaCadenaComponentDeCombinacioRGB(i_capa, i_c),
			"</fieldset>");
		cdns.push("</span>");
	}
	cdns.push("<hr>",
		GetMessage("RGBCombinationAddedAsNewStyleWithName", "cntxmenu"),
		" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
		DonaNomNouEstilCombinacioRGB(i_capa),
		"\" /><br/>",
		GetMessage("toTheLayer", "cntxmenu"),
		" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("OK"),
	        "\" onClick='CreaBandaCombinacioRGB(",i_capa,"); TancaFinestraLayer(\"combinacioRGB\");' />",
		"</div></form>");
	return cdns.join("");
}

function DonaNomNouEstilCombinacioRGB(i_capa)
{
	return GetMessage("RGBCombination", "cntxmenu");
}

function ObreFinestraSeleccioEstadistic(i_capa)
{
var elem=ObreFinestra(window, "seleccioEstadistic", GetMessage("SelectionStatisticValue", "cntxmenu"));
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
			GetMessage("StatisticalValueToDisplayForLayer", "cntxmenu"), " \"",
			DonaCadena(capa.DescLlegenda),
			"\":<br/><br/>");

	if (DonaTractamentComponent(estil, 0)=="categoric")
	{
		cdns.push("<input type=\"radio\" id=\"stat_mode\" name=\"stat\" value=\"mode\"><label for=\"stat_mode\">", GetMessage("ModalClass"), "</label><br>",
	  					"<input type=\"radio\" id=\"stat_percent_mode\" name=\"stat\" value=\"percent_mode\"><label for=\"stat_percent_mode\">", GetMessage("PercentageMode"), "</label><br>",
	  					"<input type=\"radio\" id=\"stat_mode_and_percent\" name=\"stat\" value=\"mode_and_percent\"><label for=\"stat_mode_and_percent\">", GetMessage("ModalClass"), " (", GetMessage("PercentageMode"), ")</label><br>");

	  if (estil.component.length==2 && estil.component[1].herenciaOrigen) //capa especial: "estadistics (per categoria)"
	  {
	  	var i_atrib, recompte;
	  	var value_text="";
	  	value_text="<br><fieldset><legend>"+GetMessage("StatisticalValueOf", "cntxmenu")+" "+
	  					DonaCadena(ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].desc)+" "+GetMessage("byCategoriesOf", "cntxmenu")+
	  					" "+DonaCadena(ParamCtrl.capa[capa.valors[0].i_capa].estil[capa.valors[0].i_valor].desc)+": </legend>";
	    value_text+="<table style=\"width:100%;text-align:left;font-size:inherit\"><tr><td rowspan=\"2\">";

	    //només poso per triar els que els attributes de la capa categorica inicial indiquen com a mostrables
	    if (estil.component[1].herenciaOrigen.tractament=="categoric") //la segona és categòrica també
	    {
		var attributesArray=Object.keys(estil.attributes);
	    	for (i_atrib=0, recompte=0; i_atrib<attributesArray.length; i_atrib++)
	    	{
	    		if (!attributesArray[i_atrib] || estil.attributes[attributesArray[i_atrib]].mostrar == "no") //en aquest cas no cal posar igual a false perquè ja es creen amb "si"/"no"...
	    			continue;
	    		//if (attributesArray[i_atrib] == "$stat$_i_mode") -> no la miro perquè ja inicialment es declara com a mostrar = "no"
	    		if (attributesArray[i_atrib] == "$stat$_mode")
	    		{
	    			value_text+="<input type=\"radio\" id=\"stat_mode_2\" name=\"stat\" value=\"mode_2\"><label for=\"stat_mode_2\">"+GetMessage("ModalClass")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
	    		if (attributesArray[i_atrib] == "$stat$_percent_mode")
	    		{
	    			value_text+="<input type=\"radio\" id=\"stat_percent_mode_2\" name=\"stat\" value=\"percent_mode_2\"><label for=\"stat_percent_mode_2\">"+GetMessage("PercentageMode")+"</label><br>";
	    			recompte++;
	    			//break; -> no cal
	    		}
	    	}
    		if (recompte == 2)
						value_text+="<input type=\"radio\" id=\"stat_mode_and_percent_2\" name=\"stat\" value=\"mode_and_percent_2\" checked=\"true\"><label for=\"stat_mode_and_percent_2\">"+
						GetMessage("ModalClass")+" ("+GetMessage("PercentageMode")+")</label><br>";
	  	}
		else //la segona és QC
		{
	    	    for (i_atrib=0, recompte=0; i_atrib<attributesArray.length; i_atrib++)
	    	    {
	    		if (!attributesArray[i_atrib] || estil.attributes[attributesArray[i_atrib]].mostrar == "no") //en aquest cas no cal posar igual a false perquè ja es creen amb "si"/"no"...
	    			continue;

	    		//primer mirar sui_ple, pq si es que no no cal q em proecupi si él nom és un dles que m¡0interessa , oq igualment no es mostrara
			if (attributesArray[i_atrib] == "$stat$_sum")
			{
				value_text+="<input type=\"radio\" id=\"stat_sum_2\" name=\"stat\" value=\"sum_2\"><label for=\"stat_sum_2\">"+GetMessage("Sum")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
			if (attributesArray[i_atrib] == "$stat$_sum_area")
			{
				value_text+="<input type=\"radio\" id=\"stat_sum_area_2\" name=\"stat\" value=\"sum_area_2\"><label for=\"stat_sum_area_2\">"+GetMessage("SumArea")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
			if (attributesArray[i_atrib] == "$stat$_mean")
			{
				value_text+="<input type=\"radio\" id=\"stat_mean_2\" name=\"stat\" value=\"mean_2\" checked=\"true\"><label for=\"stat_mean_2\">"+GetMessage("Mean")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
			if (attributesArray[i_atrib] == "$stat$_variance")
			{
				value_text+="<input type=\"radio\" id=\"stat_variance_2\" name=\"stat\" value=\"variance_2\"><label for=\"stat_variance_2\">"+GetMessage("Variance")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
			if (attributesArray[i_atrib] == "$stat$_stdev")
			{
				value_text+="<input type=\"radio\" id=\"stat_stdev_2\" name=\"stat\" value=\"stdev_2\"><label for=\"stat_stdev_2\">"+GetMessage("StandardDeviation")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
			if (attributesArray[i_atrib] == "$stat$_min")
			{
				value_text+="<input type=\"radio\" id=\"stat_min_2\" name=\"stat\" value=\"min_2\"><label for=\"stat_min_2\">"+GetMessage("Minimum")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
			if (attributesArray[i_atrib] == "$stat$_max")
			{
				value_text+="<input type=\"radio\" id=\"stat_max_2\" name=\"stat\" value=\"max_2\"><label for=\"stat_max_2\">"+GetMessage("Maximum")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
			if (attributesArray[i_atrib] == "$stat$_range")
			{
				value_text+="<input type=\"radio\" id=\"stat_range_2\" name=\"stat\" value=\"range_2\"><label for=\"stat_range_2\">"+GetMessage("Range")+"</label><br>";
	    			recompte++;
	    			continue;
	    		}
		    }
  		}
  		if (recompte > 0)
  		{
				value_text+="<td><fieldset><legend>"+GetMessage("Presentation")+": </legend>"+
								"<input type=\"radio\" id=\"stat_graphic\" name=\"presentacio\" value=\"graphic\"><label for=\"stat_graphic\">"+GetMessage("Graphical")+"</label><br>"+
								"<input type=\"radio\" id=\"stat_text\" name=\"presentacio\" value=\"text\" checked=\"true\"><label for=\"stat_text\">"+GetMessage("Textual")+"</label><br>"+
	    					"</fieldset></td></tr>";
	    	value_text+="<tr><td><fieldset><legend>"+GetMessage("SortingOrder")+": </legend>"+
	    					"<input type=\"radio\" id=\"stat_unsorted\" name=\"order\" value=\"unsorted\" checked=\"true\"><label for=\"stat_unsorted\">"+GetMessage("Unsorted")+"</label><br>"+
	    					"<input type=\"radio\" id=\"stat_ascend\" name=\"order\" value=\"ascend\"><label for=\"stat_ascend\">"+GetMessage("Ascending", "cntxmenu")+"</label><br>"+
	    					"<input type=\"radio\" id=\"stat_descend\" name=\"order\" value=\"descend\"><label for=\"stat_descend\">"+GetMessage("Descending", "cntxmenu")+"</label><br>";
		    value_text+="</fieldset></td></tr></table></fieldset>";
		    cdns.push(value_text);
		   }
	  }
	}
	else
		cdns.push("<input type=\"radio\" id=\"sum\" name=\"stat\" value=\"sum\"><label for=\"sum\">", GetMessage("Sum"), "</label><br>",
							"<input type=\"radio\" id=\"sum_area\" name=\"stat\" value=\"sum_area\"><label for=\"sum_area\">", GetMessage("SumArea"), "</label><br>",
							"<input type=\"radio\" id=\"mean\" name=\"stat\" value=\"mean\"><label for=\"mean\">", GetMessage("Mean"), "</label><br>",
							"<input type=\"radio\" id=\"variance\" name=\"stat\" value=\"variance\"><label for=\"variance\">", GetMessage("Variance"), "</label><br>",
							"<input type=\"radio\" id=\"stdev\" name=\"stat\" value=\"stdev\"><label for=\"stdev\">", GetMessage("StandardDeviation"), "</label><br>",
							"<input type=\"radio\" id=\"min\" name=\"stat\" value=\"min\"><label for=\"min\">", GetMessage("Minimum"), "</label><br>",
							"<input type=\"radio\" id=\"max\" name=\"stat\" value=\"max\"><label for=\"max\">", GetMessage("Maximum"), "</label><br>",
  						"<input type=\"radio\" id=\"range\" name=\"stat\" value=\"range\"><label for=\"range\">", GetMessage("Range"), "</label><br>");

  cdns.push("<br><input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("OK"),
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
		return ObreFinestraHistograma(i_capa, -1, (document.SeleccioEstadistic.presentacio.value == "graphic") ? "chart_categ" : "stat_categ",
					document.SeleccioEstadistic.stat.value.substring(0, document.SeleccioEstadistic.stat.value.length-2), document.SeleccioEstadistic.order.value);
	else //cas normal, només necessito saber el estadístic a mostrar
		return ObreFinestraHistograma(i_capa, -1, "stat", document.SeleccioEstadistic.stat.value);
}

function DonaDescripcioValorsCapa(params)
{
var cdns=[];
	for (var i_param=0; i_param<params.length; i_param++)
	{
		cdns.push(DonaCadenaNomDesc(params[i_param].clau),
			 " ",
			DonaCadenaNomDesc(params[i_param].valor));
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
	capa.estil[capa.estil.length]={"nom": null, "desc": combinacio_rgb.nom_estil, "TipusObj": "P", "component": [], "origen": OrigenUsuari};
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
		combinacio_rgb.i_valor[i_c]=document.CombinacioRGB["component"+i_c].value;
	combinacio_rgb.nom_estil=document.CombinacioRGB.nom_estil.value;
	return combinacio_rgb;
}


function ObreFinestraEditaEstilCapa(i_capa, i_estil)
{
var elem=ObreFinestra(window, "editaEstil", GetMessage("ofEditingStyle", "cntxmenu"));
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

	if (capa.model != "vector" && !estil.histograma)
	{
		alert(GetMessage("CannotEditStyleNeverVisualized", "cntxmenu"));
		return "";
	}
	cdns.push("<form name=\"EstilCapa\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerEstilCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;\">",
			GetMessage("StyleLayer", "cntxmenu"), " \"",
			DonaCadena(capa.DescLlegenda));
	if (capa.estil.length>1)
		cdns.push(" (", DonaCadena(estil.desc), ")");
	cdns.push("\"<br/>");

	if (estil.component && !estil.categories)
	{
		cdns.push("<fieldset><legend>",
			GetMessage("ValueForStretchingColor", "cntxmenu"),
			": </legend>",
			DonaCadenaHTMLFieldSetValueStrechingColor(i_capa, i_estil),
			"</fieldset>");
	}

	if (estil.component && estil.component.length==1 && estil.component[0].illum)
	{
		cdns.push("<fieldset><legend>",
			GetMessage("SunPositionForComputationIllumination", "cntxmenu"),
			": </legend>");
		//Deixo canviar les propietats az, elev i f
		cdns.push("<label for=\"edita-estil-capa-illum-az\">", GetMessage("Azimuth", "cntxmenu"), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-illum-az\" name=\"az\" value=\"",
				(estil.component[0].illum.az ? estil.component[0].illum.az : 225), "\" style=\"width:50px;\" />",
				" (", GetMessage("originNorthClockwiseDegress", "cntxmenu"), ")",
				"<br>");
		cdns.push("<label for=\"edita-estil-capa-illum-elev\">", GetMessage("Elevation", "cntxmenu"), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-illum-elev\" name=\"elev\" value=\"",
				(estil.component[0].illum.elev ? estil.component[0].illum.elev: 45), "\" style=\"width:50px;\" />",
				" (", GetMessage("fromGroundDegress", "cntxmenu"), ")",
				"<br>");
		cdns.push("<label for=\"edita-estil-capa-illum-f\">", GetMessage("ReliefExaggerationFactor", "cntxmenu"), ": </label>",
				"<input type=\"text\" id=\"edita-estil-capa-illum-f\" name=\"f\" value=\"",
				(estil.component[0].illum.f ? estil.component[0].illum.f : 1) , "\" style=\"width:50px;\" />",
				"<br>");
		cdns.push("</fieldset>");
	}
	else if (estil.component && estil.component.length<3)
	{
		var paleta;
		cdns.push("<fieldset><legend>",
			GetMessage("ColorPalette"),
			": </legend>",
			"<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-actual\" checked=\"checked\"><label for=\"edita-estil-capa-paleta-actual\">", DonaCadenaHTMLPintaPaleta(estil.paleta), " (", GetMessage("Current"), ")</label><br>");
		if (estil.paletaPrevia)
			cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-previa\"><label for=\"edita-estil-capa-paleta-previa\">", DonaCadenaHTMLPintaPaleta(estil.paletaPrevia), " (", GetMessage("Previous"), ")</label><br>");
		//Paletes generals
		if (DonaTractamentComponent(estil, 0)=="categoric")
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
			cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-grisos\"><label for=\"edita-estil-capa-paleta-grisos\">", DonaCadenaHTMLPintaPaleta(null), " (", GetMessage("Greyscale", "cntxmenu"), ")</label><br>");
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
				cdns.push("<input type=\"radio\" name=\"PaletaColors\" id=\"edita-estil-capa-paleta-estil-", i, "\"><label for=\"edita-estil-capa-paleta-estil-", i, "\">", DonaCadenaHTMLPintaPaleta(capa.estil[i].paleta), " (", DonaCadenaNomDesc(capa.estil[i]), ")</label><br>");
			}
		}
		cdns.push("</fieldset>");
	}

	if (capa.model == "vector")
	{
		/* Es construeix estructura amb colors i descripcions a mostrar. A partir dels
		colors de "forma" amb attribut "TipusNom" i les
		descripcions de "ItemLleg". Com relacionar els 2 arrays:
		índex ItemLleg = TipusNom - 1, si la simbolització és indexada
		*/
		const arrayColorsSelectors = [];

		if (estil.TipusObj == "L" && estil.ItemLleg && estil.ItemLleg.length > 0)
		{
			// Thicknesses to modify
			var arrayThicknessSelectors = [];
			if (estil.formes && estil.formes.length)
			{
				const lastFormaIndex = estil.formes.length - 1;
				const lastForma = estil.formes[lastFormaIndex];
				if (lastForma.vora && lastForma.vora.paleta && lastForma.vora.paleta.colors)
				{
					const isMultipleColored = lastForma.vora.NomCamp ? true : false;
					for (var indexColors = isMultipleColored ? 1 : 0, colorsLength = lastForma.vora.paleta.colors.length; indexColors < colorsLength; indexColors++)
					{
							const currentColor = lastForma.vora.paleta.colors[indexColors];
							// Index refering to ItemLleg where to find description of the color
							const indexItemLleg = estil.ItemLleg && estil.ItemLleg.length >= indexColors && isMultipleColored ? indexColors-1 : indexColors;
							arrayColorsSelectors.push({color:currentColor, descr:estil.ItemLleg[indexItemLleg].DescColor});
					}
				}
				// Check if thickness (gruix) is available
				if (lastForma.vora && lastForma.vora.gruix && lastForma.vora.gruix.amples)
				{
					arrayThicknessSelectors = lastForma.vora.gruix.amples;
				}
			}

			if(arrayColorsSelectors && arrayColorsSelectors.length)
			{
				// Color HTML Section
				cdns.push("<fieldset><legend>", GetMessage("Colors"), ": </legend><table>");
				for (var indexColorSel = 0, itemsColorSelLength = arrayColorsSelectors.length; indexColorSel < itemsColorSelLength; indexColorSel++)
				{
					cdns.push("<tr><td><input type=\"color\" name=\"PaletaColors\" id=\"edita-estil-color-" + indexColorSel + "\" value=\"" + arrayColorsSelectors[indexColorSel].color + "\"></td><td><label class=\"Verdana11px\" for=\"edita-estil-color-" + indexColorSel + "\">", arrayColorsSelectors[indexColorSel].descr, "</label></td></tr>");
				}
				cdns.push("</table></fieldset>");
			}

			if(arrayThicknessSelectors && arrayThicknessSelectors.length)
			{
				// Thickness HTML Section
				cdns.push("<fieldset><legend>", GetMessage("Thickness"), ": </legend><table>");
				cdns.push("<tr><td>", "<p class=\"Verdana11px\">", GetMessage("ThicknessRange", "cntxmenu"),"</p>","</td></tr>");
				for (var indexThickSel = 0, itemsThickSelLength = arrayThicknessSelectors.length; indexThickSel < itemsThickSelLength; indexThickSel++)
				{
					cdns.push("<tr><td><input type=\"text\" name=\"Gruixos\" size=\"2\" id=\"edita-estil-gruix-" + indexThickSel + "\" value=\"" + arrayThicknessSelectors[indexThickSel] + "\"></td></tr>");
				}
				cdns.push("</table></fieldset>");
			}
		}
		else if (estil.TipusObj == "P")
		{
			const voraKey = "vora";
			const interiorKey = "interior";
			// Alpha color values to modify
			var arrayAlphaSelectors = [];

			const formes = estil.formes.length > 0 ? estil.formes[0] : undefined;
			// Cast object() inside "formes" to a new Map()
			function objToMap(object)
			{
				return Object.keys(object).reduce(function(result, key) {
					result.set(key, object[key]);
					return result;
				} , new Map());
			}
			if (formes !== undefined)
			{
				const mapFormes = objToMap(formes);
				var descr_obj;
				// Gathers all interesting keyes from map
				const arrayKeyes = [];

				if (mapFormes.has(voraKey))
					arrayKeyes.push(voraKey);

				if (mapFormes.has(interiorKey))
					arrayKeyes.push(interiorKey);

				arrayKeyes.forEach((item, i) => {
					const objKey = item;
					const forma = mapFormes.get(objKey);

					if (forma.paleta && forma.paleta.colors && forma.paleta.colors.length > 0)
					{
						if(objKey==voraKey)
							descr_obj=GetMessage("Vora", "cntxmenu");
						else if (objKey==interiorKey)
							descr_obj=GetMessage("Interior", "cntxmenu");
						else 
							descr_obj=objKey;
						
						// The color is in hexadecimal format
						if (forma.paleta.colors[0].indexOf("#") != -1)
						{							
							arrayColorsSelectors.push({color:forma.paleta.colors[0], descr:descr_obj});
						}
						// The color is in RGB format
						else if (forma.paleta.colors[0].indexOf("#") == -1)
						{
							const rgbDigits = forma.paleta.colors[0].slice( forma.paleta.colors[0].indexOf("(") + 1, forma.paleta.colors[0].indexOf(")"));
							const arrayColorRGBA = rgbDigits.split(",");
							const hexColor = "#" + ((1 << 24) + (parseInt(arrayColorRGBA[0]) << 16) + (parseInt(arrayColorRGBA[1]) << 8) + parseInt(arrayColorRGBA[2])).toString(16).slice(1);

							arrayColorsSelectors.push({color:hexColor, descr:descr_obj});
							if (arrayColorRGBA.length == 4)
							{
								arrayAlphaSelectors.push({alpha:parseFloat(arrayColorRGBA[arrayColorRGBA.length-1]), descr:descr_obj});
							}
						}
					}
				});
			}
			// Build HTML inputs
			if(arrayColorsSelectors && arrayColorsSelectors.length)
			{
			// Color HTML Section
				cdns.push("<fieldset><legend>", GetMessage("Colors"), ": </legend><table>");
				for (var indexColorSel = 0, itemsColorSelLength = arrayColorsSelectors.length; indexColorSel < itemsColorSelLength; indexColorSel++)
				{
					const labelString = arrayColorsSelectors[indexColorSel].descr.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
					cdns.push("<tr><td><input type=\"color\" name=\"PaletaColors\" id=\"edita-estil-color-" + indexColorSel + "\" value=\"" + arrayColorsSelectors[indexColorSel].color + "\"></td><td><label class=\"Verdana11px\" for=\"edita-estil-color-" + indexColorSel + "\">", labelString, "</label></td></tr>");
				}
				cdns.push("</table></fieldset>");
			}

			if(arrayAlphaSelectors && arrayAlphaSelectors.length)
			{
				// Transparency HTML Section
				cdns.push("<fieldset><legend>", GetMessage("Transparency"), ": </legend><table>");
				for (var indexTranspSel = 0, itemsTransSelLength = arrayAlphaSelectors.length; indexTranspSel < itemsTransSelLength; indexTranspSel++)
				{
					const labelString = arrayAlphaSelectors[indexTranspSel].descr.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
					cdns.push("<tr><td><input type=\"text\" name=\"Transparencia\" size=\"2\" id=\"edita-estil-transparencia-" + indexTranspSel + "\" value=\"" + (100 - parseInt(arrayAlphaSelectors[indexTranspSel].alpha * 100)) + "\"></td><td><label class=\"Verdana11px\" for=\"edita-estil-transparencia-" + indexTranspSel + "\">", GetMessage("PercentageTransparencyRange", "cntxmenu"), "</label></td></tr></tr>");
				}
				cdns.push("</table></fieldset>");
			}
		}
	}
	cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("OK"),
	        "\" onClick='EditaEstilCapa(", i_capa, ",", i_estil, ");TancaFinestraLayer(\"editaEstil\");' />",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("Apply"),
	        "\" onClick='EditaEstilCapa(", i_capa, ",", i_estil, ");' />",
				"<input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("Cancel"),
	        "\" onClick='TancaFinestraLayer(\"editaEstil\");' />",		
		"</div></form>");
	return cdns.join("");
}

function DonaCadenaHTMLFieldSetValueStrechingColor(i_capa, i_estil)
{
var cdns=[], capa=ParamCtrl.capa[i_capa], estil=capa.estil[i_estil];

	for (var i_comp=0, compLength=estil.component.length; i_comp<compLength; i_comp++)
	{
		// Es fa una còpia de l'estirament de la paleta per preservar-lo després d'esser modificat.
		if (!estil.component[i_comp].estiramentPaletaExtrems)
		{
			estil.component[i_comp].estiramentPaletaExtrems = {
				valorMaxim: estil.component[i_comp].estiramentPaleta.valorMaxim > estil.histograma.component[i_comp].valorMaximReal ? estil.component[i_comp].estiramentPaleta.valorMaxim : estil.histograma.component[i_comp].valorMaximReal,
				valorMinim: estil.component[i_comp].estiramentPaleta.valorMinim < estil.histograma.component[i_comp].valorMinimReal ? estil.component[i_comp].estiramentPaleta.valorMinim : estil.histograma.component[i_comp].valorMinimReal
			};
			// NJ_08_03_2023: No sé per quina intenció es volia fer això però no és correcte, ja que si ho faig perdo els valors de l'estirament que tinc abans, 
			//estil.component[i_comp].estiramentPaleta.valorMaxim = estil.component[i_comp].estiramentPaletaExtrems.valorMaxim;
			//estil.component[i_comp].estiramentPaleta.valorMinim = estil.component[i_comp].estiramentPaletaExtrems.valorMinim;
		}

		if (estil.component.length>2)
		{
			cdns.push("<fieldset><legend>",
				GetMessage("Component", "cntxmenu"), " ");
			switch (i_comp)
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
					cdns.push(i_comp);
			}
			cdns.push(": </legend>");
		}
		// Valor mínim i valor màxim
		// Valor unitari prement botons incrmenet/decrement. Serà 1% del rang possible.
		var valUnitari = 1; // Per defecte.
		const estPaletaExtr = estil.component[i_comp].estiramentPaletaExtrems;
		const estPaleta = estil.component[i_comp].estiramentPaleta;
		if (estPaletaExtr)
		{
			valUnitari = (estPaletaExtr.valorMaxim - estPaletaExtr.valorMinim) / 100.00;
		}

		cdns.push("<label for=\"edita-estil-capa-valor-minim-", i_comp, "\">", GetMessage("Minimum"), ": </label>",
			"<input type=\"text\" id=\"edita-estil-capa-valor-minim-",i_comp, "\" name=\"minim", i_comp,"\" value=\"",
			DonaFactorValorMinEstiramentPaleta(estPaleta).toFixed(3), "\" style=\"width:80px;\" onChange=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", this.value, ", valUnitari, ", true);\">",
			" (", GetMessage("computed", "cntxmenu"), " ", estil.histograma.component[i_comp].valorMinimReal.toFixed(3), " ",
			"<input type=\"button\" class=\"Verdana11px\" value=\"", GetMessage("Adopt", "cntxmenu"),
				"\" onClick=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", ", estil.histograma.component[i_comp].valorMinimReal, ", ", valUnitari,", true);\">",")", "<br>",
				//NJ_08_03_2023: elimino les etiquetes dels extrems perquè resulten molt confuses, sembla que siguin els màxims de les imatges i no ho són
				//"<div style='display: flex; align-items: stretch;'><label id=\"minEsqBtn-", i_comp, "\" for=\"edita-estil-capa-button-fletxa-esq-valor-minim-", i_comp, "\">", GetMessage("Minimum"), " ", GetMessage("Range"), ": ", DonaFactorValorMinEstiramentPaleta(estPaletaExtr).toFixed(3), "</label>",
				"<div style='display: flex; align-items: stretch;'>",
				"<input type=\"button\" id=\"edita-estil-capa-button-fletxa-esq-valor-minim-",i_comp, "\" value=\"<\" onClick=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", parseFloat(document.getElementById('edita-estil-capa-valor-minim-", i_comp, "').value) - ", valUnitari,", ", valUnitari, ", true);\">",
			"<input type=\"range\" id=\"edita-estil-capa-slider-valor-minim-",i_comp, "\" style=\"width: 285px;\" step=\"", valUnitari, "\" min=\"", 0, "\" max=\"", estPaletaExtr.valorMaxim - estPaletaExtr.valorMinim, "\" value=\"", estPaleta.valorMinim - estPaletaExtr.valorMinim, "\" onchange=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", this.value, ", valUnitari, ", true);\" onclick=\"dontPropagateEvent(event);\">",
			"<input type=\"button\" id=\"edita-estil-capa-button-fletxa-dret-valor-minim-",i_comp, "\" value=\">\" onClick=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", parseFloat(document.getElementById('edita-estil-capa-valor-minim-", i_comp, "').value) + ", valUnitari,", ", valUnitari, ", true);\">",
			//"<label id=\"minDrtBtn-", i_comp, "\" for=\"edita-estil-capa-button-fletxa-dret-valor-minim-", i_comp, "\">", GetMessage("Maximum"), " ", GetMessage("Range"), ": ", DonaFactorValorMaxEstiramentPaleta(estPaletaExtr).toFixed(3), "</label>",
			"</div><br>");

		cdns.push("<label for=\"edita-estil-capa-valor-maxim-", i_comp, "\">", GetMessage("Maximum"), ": </label>",
			"<input type=\"text\" id=\"edita-estil-capa-valor-maxim-",i_comp, "\" name=\"maxim", i_comp,"\" value=\"",
			DonaFactorValorMaxEstiramentPaleta(estPaleta).toFixed(3), "\" style=\"width:80px;\" onChange=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", this.value, ", valUnitari,", false);\">",
			" (", GetMessage("computed", "cntxmenu"), " ", estil.histograma.component[i_comp].valorMaximReal.toFixed(3), " ",
			"<input type=\"button\" class=\"Verdana11px\" value=\"", GetMessage("Adopt", "cntxmenu"),
				"\" onClick=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", ", estil.histograma.component[i_comp].valorMaximReal, ", ", valUnitari, ", false);\">",")", "<br>",
				//"<div style='display: flex; align-items: stretch;'><label id=\"maxEsqBtn-", i_comp,"\" for=\"edita-estil-capa-button-fletxa-esq-valor-maxim-", i_comp, "\"  style=\"text-align: center;\">", GetMessage("Minimum"), " ", GetMessage("Range"), ": ", DonaFactorValorMinEstiramentPaleta(estPaletaExtr).toFixed(3), "</label>",
				"<div style='display: flex; align-items: stretch;'>",
				"<input type=\"button\" id=\"edita-estil-capa-button-fletxa-esq-valor-maxim-",i_comp, "\" value=\"<\" onClick=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", parseFloat(document.getElementById('edita-estil-capa-valor-maxim-", i_comp, "').value) - ", valUnitari,", ", valUnitari, ", false);\">",
				"<input type=\"range\" id=\"edita-estil-capa-slider-valor-maxim-",i_comp, "\" style=\"width: 285px;direction: rtl;\" step=\"", valUnitari, "\" min=\"", 0, "\" max=\"", estPaletaExtr.valorMaxim - estPaletaExtr.valorMinim, "\" value=\"", estPaletaExtr.valorMaxim - estPaletaExtr.valorMinim -(estPaleta.valorMaxim - estPaletaExtr.valorMinim), "\" onchange=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", this.value, ", valUnitari,", false);\" onclick=\"dontPropagateEvent(event);\">",
				"<input type=\"button\" id=\"edita-estil-capa-button-fletxa-dret-valor-maxim-",i_comp, "\" value=\">\" onClick=\"CanviaValorEstiramentDePaleta(event, ", i_capa, ", ", i_comp, ", ", i_estil, ", parseFloat(document.getElementById('edita-estil-capa-valor-maxim-", i_comp, "').value) + ", valUnitari, ", ", valUnitari, ", false);\">",
				//"<label id=\"maxDrtBtn-", i_comp, "\" for=\"edita-estil-capa-button-fletxa-dret-valor-maxim-", i_comp, "\">", GetMessage("Maximum"), " ", GetMessage("Range"), ": ", DonaFactorValorMaxEstiramentPaleta(estPaletaExtr).toFixed(3), "</label>",
			"</div><br>");
		if (estil.component.length>1)
			cdns.push("</fieldset>");
	}
	return cdns.join("");
}

function TancarFinestra_editEstil(idDiv)
{
	const idDivFinestra = idDiv + "_finestra";
	const divPrincipal = document.getElementById(idDivFinestra);
	//Comprovo que la finestra dispose de scroll.
	if (divPrincipal && divPrincipal.style.overflow == "auto")
	{
		divPrincipal.scrollTo(0,0);
	}
}

function ForcaRecalculItemLleg(estil)
{
	//Cal passar a llegenda automàtica per força
	estil.ItemLleg=null //això força a tornar a genera els colors de la llegenda i aquest eren automàtics.
	if (!estil.nItemLlegAuto)
		estil.nItemLlegAuto=20;
	if (!estil.ncol)
		estil.ncol=4;
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
			ForcaRecalculItemLleg(estil);
		}
	}
	if (estil.component && estil.component.length==1 && estil.component[0].illum)
	{
		var valor=parseFloat(document.getElementById("edita-estil-capa-illum-az").value);
		if (valor<0 || valor>=360)
		{
			valor=225;
			alert(GetMessage("IncorrectAzimuth", "cntxmenu")+": "+valor);
		}
		estil.component[0].illum.az=valor;
		var valor=parseFloat(document.getElementById("edita-estil-capa-illum-elev").value);
		if (valor<0 || valor>90)
		{
			valor=45;
			alert(GetMessage("IncorrectElevation", "cntxmenu")+": "+valor);
		}
		estil.component[0].illum.elev=valor;
		var valor=parseFloat(document.getElementById("edita-estil-capa-illum-f").value);
		if (valor<0.0001)
		{
			valor=1;
			alert(GetMessage("IncorrectReliefExaggerationFactor", "cntxmenu")+": "+1);
		}
		else
			estil.component[0].illum.f=valor;
	}
	else if (estil.component && estil.component.length<3)
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
				if (DonaTractamentComponent(estil, 0)=="categoric")
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
	if (capa.model == "vector")
	{
 		if (estil.TipusObj == "L" && estil.ItemLleg)
		{
			/* Save new colors selected for legend representation and to"forma.paleta"
			 object. It defines how the line should be painted on map */
			for (var iItemLleg = 0, itemsLlegLength = estil.ItemLleg.length; iItemLleg < itemsLlegLength; iItemLleg++)
			{
				var colorInput = document.getElementById("edita-estil-color-" + iItemLleg);
				if (colorInput && colorInput.value)
				{
					// Legend
					estil.ItemLleg[iItemLleg].color = colorInput.value;
					// Palette
					if (estil.formes && estil.formes.length > 0)
					{
						const lastForma = estil.formes[estil.formes.length - 1];
						if (lastForma.vora && lastForma.vora.paleta && lastForma.vora.paleta.colors)
						{
							// If NomCamp exists means we have multiple colors and then we need to worry about the first emtpy color in "paleta"
							const indexPalette = lastForma.vora.NomCamp ? iItemLleg + 1 : iItemLleg;
							if (lastForma.vora.paleta.colors.length > indexPalette)
							{
								lastForma.vora.paleta.colors[indexPalette] = colorInput.value;
							}
						}
					}
				}
			}
			if (estil.formes && estil.formes.length > 0)
			{
				const lastForma = estil.formes[estil.formes.length - 1];
				if (lastForma.vora && lastForma.vora.gruix && lastForma.vora.gruix.amples)
				{
					for (var iAmples = 0, amplesLength = lastForma.vora.gruix.amples.length; iAmples < amplesLength; iAmples++)
					{
						var textThicknessInput = document.getElementById("edita-estil-gruix-" + iAmples);
						if (textThicknessInput && textThicknessInput.value)
						{
							lastForma.vora.gruix.amples[iAmples] = textThicknessInput.value > 10 ? 10 : (textThicknessInput.value < 1 ? 1 : textThicknessInput.value);
						}
					}
				}
			}
		}
		else if (estil.TipusObj == "P" && estil.formes)
		{
			const voraKey = "vora";
			const interiorKey = "interior";
			const formes = estil.formes.length > 0 ? estil.formes[0] : undefined;

			function objToMap(object)
			{
				return Object.keys(object).reduce(function(result, key) {
					result.set(key, object[key]);
					return result;
				} , new Map());
			}

			function hexToRgb(hex) {
			  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			  return result ? {
			    r: parseInt(result[1], 16),
			    g: parseInt(result[2], 16),
			    b: parseInt(result[3], 16)
			  } : null;
			}

			if (formes !== undefined)
			{
				const mapFormes = objToMap(formes);

				// Gathers all interesting keyes from map
				const arrayKeyes = [];
				var alphaIndex = 0;
				if (mapFormes.has(voraKey))
					arrayKeyes.push(voraKey);

				if (mapFormes.has(interiorKey))
					arrayKeyes.push(interiorKey);

				arrayKeyes.forEach((item, i) => {
					const objKey = item;
					const forma = mapFormes.get(objKey);
					const colorInput = document.getElementById("edita-estil-color-" + i);

					if (forma.paleta && forma.paleta.colors && forma.paleta.colors.length > 0 && colorInput && colorInput.value)
					{
						if (forma.paleta.colors[0].indexOf("#") == -1)
						{
							const transpInput = document.getElementById("edita-estil-transparencia-" + alphaIndex);
							if (transpInput && transpInput.value)
							{
								const rgbComponents = hexToRgb(colorInput.value);
								const evalTanspValue = parseInt(transpInput.value) > 100 ? 100 : (parseInt(transpInput.value) < 0 ? 0 : parseInt(transpInput.value));
								const transValueTantPer1 = 1 - evalTanspValue/100;
								const rgbaValue = "rgba(" + rgbComponents.r + "," + rgbComponents.g + "," + rgbComponents.b + "," + transValueTantPer1.toString() + ")";
								forma.paleta.colors[0] = rgbaValue;
							}
							alphaIndex++;
						}
						else
						{
							forma.paleta.colors[0] = colorInput.value;
					}
				}
				});
			}
		}
	}
	CanviaEstilCapa(i_capa, i_estil, true);
	CreaLlegenda();
}

function ObreFinestraRaonsNoVisible(i_capa)
{
var elem=ObreFinestra(window, "modificaNom", GetMessage("ofModifingName", "cntxmenu"));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaRaonsNoVisible(i_capa));
	titolFinestraLayer(window, "modificaNom", GetMessage("WhyNotVisible", "cntxmenu"));
}

function DonaCadenaRaonsNoVisible(i_capa)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	if (!EsCapaDinsRangDEscalesVisibles(capa))
		cdns.push(GetMessage("Layer"), " ", GetMessage("notVisibleInCurrentZoom", "cntxmenu"), "<br>");
	if (!EsCapaDinsAmbitActual(capa))
		cdns.push(GetMessage("Layer"), " ", GetMessage("notVisibleInCurrentView", "cntxmenu"), "<br>");
	if (!EsCapaDisponibleEnElCRSActual(capa))
	{
		cdns.push(GetMessage("Layer"), " ", GetMessage("notVisibleInCurrentCRS", "cntxmenu"), ".\n", GetMessage("OnlyVisibleInTheFollowCRS", "cntxmenu"), ": ");
		for (var i=0; i<capa.CRS.length; i++)
		{
			cdns.push(DonaDescripcioCRS(capa.CRS[i]));
			if (i)
				cdns.push(", ");
		}
		cdns.push("<br>");
	}
	cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
			  GetMessage("Cancel"),
			  "\" onClick='TancaFinestraLayer(\"modificaNom\");' />");
	return cdns.join("");
}

function ObreFinestraModificaNomCapa(i_capa)
{
var elem=ObreFinestra(window, "modificaNom", GetMessage("ofModifingName", "cntxmenu"));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaModificaNomCapa(i_capa));
	titolFinestraLayer(window, "modificaNom", GetMessage("ModifyName"));
}

function DonaCadenaModificaNomCapa(i_capa)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	cdns.push("<form name=\"NomCapa\" onSubmit=\"return false;\">",
		"<div id=\"LayerNomCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;\">",
		GetMessage("LayerId"), ": ", capa.id, "<p>",
		"<fieldset><legend>",
		GetMessage("LayerName"),
		": </legend>",
		"<input type=\"text\" id=\"edita-nom-capa\" name=\"nom_capa\" value=\"", DonaCadena(capa.desc), "\" style=\"width:400px;\" />",
		"<br>",
		"</fieldset>",
		"<fieldset><legend>",
		GetMessage("LayerNameInLegend", "cntxmenu"),
		": </legend>",
		"<input type=\"text\" id=\"edita-nom-capa-llegenda\" name=\"nom_capa\" value=\"", DonaCadena(capa.DescLlegenda), "\" style=\"width:400px;\" />",
		"<br>",
		"</fieldset>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("OK"),
	        "\" onClick='ModificaNomCapa(", i_capa, ");TancaFinestraLayer(\"modificaNom\");' />",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
			  GetMessage("Cancel"),
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
var elem=ObreFinestra(window, "modificaNom", GetMessage("ofModifingName", "cntxmenu"));
	if (!elem)
		return;
	contentLayer(elem, DonaCadenaModificaNomEstil(i_capa, i_estil));
	titolFinestraLayer(window, "modificaNom", GetMessage("ModifyName"));
}

function DonaCadenaModificaNomEstil(i_capa, i_estil)
{
var cdns=[], estil=ParamCtrl.capa[i_capa].estil[i_estil];
	cdns.push("<form name=\"NomEstil\" onSubmit=\"return false;\">",
		"<div id=\"LayerNomEstil\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;\">",
		"<fieldset><legend>",
		GetMessage("StyleName", "cntxmenu"),
		": </legend>",
		"<input type=\"text\" id=\"edita-nom-estil\" name=\"nom_estil\" value=\"", DonaCadena(estil.desc), "\" style=\"width:400px;\" />",
		"<br>",
		"</fieldset>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
		GetMessage("OK"),
	        "\" onClick='ModificaNomEstil(", i_capa,",", i_estil,");TancaFinestraLayer(\"modificaNom\");' />",
		"<input type=\"button\" class=\"Verdana11px\" value=\"",
			  GetMessage("Cancel"),
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
var elem=ObreFinestra(window, "calculaQualitat", GetMessage("toComputeTheQuality", "cntxmenu"));
	if (!elem)
		return;
	FinestraCalculaQualitatCapa(elem, i_capa, i_estil);
}


function ObreFinestraMostraLlinatge(i_capa)
{
var elem=ObreFinestra(window, "mostraLlinatge", GetMessage("forShowingLinageInformation", "cntxmenu"));
	if (!elem)
		return;
	FinestraMostraLlinatgeCapa(elem, i_capa);
}

function ObreFinestraMostraQualitatCapa(existeix_qualitat, i_capa, i_estil)
{
var capa=ParamCtrl.capa[i_capa];
var elem=ObreFinestra(window, "mostraQualitat", GetMessage("forShowingQualityInformation", "cntxmenu"));

	if (!elem)
		return;
	if(existeix_qualitat)
		FinestraMostraQualitatCapa(elem,  (i_estil==-1) ? capa.metadades.quality : capa.estil[i_estil].metadades.quality, capa, i_estil);
	else
		FinestraMostraQualitatCapa(elem, null, capa, i_estil);
}

function ObreFinestraFeedbackCapa(i_capa, i_estil)
{
//var capa=ParamCtrl.capa[i_capa];
var elem=ObreFinestra(window, "feedback", GetMessage("ofUserFeedback", "cntxmenu"));
	if (!elem)
		return;
	FinestraFeedbackCapa(elem, i_capa, i_estil);
}

function ObreFinestraFeedbackAmbEstilsDeCapa(i_capa)
{
var elem=ObreFinestra(window, "feedbackAmbEstils", GetMessage("ofUserFeedback", "cntxmenu"));
	if (!elem)
		return;
	FinestraFeedbackAmbEstilsCapa(elem, i_capa);
}

function CanviaValorEstiramentDePaleta(event, i_capa, i_component, i_estil, valor, valorUnitari, esMinim)
{
const capa=ParamCtrl.capa[i_capa], estil=capa.estil[i_estil];
var floatValor=parseFloat(valor);

	if (estil && estil.component && estil.component.length > 0)
	{
		const estPaleta = estil.component[i_component].estiramentPaleta;
		const estPaletaExtr = estil.component[i_component].estiramentPaletaExtrems;
		if (!isNaN(estPaleta.valorMinim) && !isNaN(estPaleta.valorMaxim) && !isNaN(estPaletaExtr.valorMinim) && !isNaN(estPaletaExtr.valorMaxim))
		{
			if (esMinim)
			{
				var valorActual = 0;
				//	Distingim entre el tipus de element "input" que preten modifica el
				//	valor de la paleta. Diferenciem entre input.type= range/text/button
				if (event.target.attributes["type"].value.localeCompare("range") == 0)
				{
					valorActual = estPaletaExtr.valorMinim + floatValor;
				}
				else //	Tant per input.type= text o button
				{
					valorActual = floatValor;
					floatValor =  floatValor - estPaletaExtr.valorMinim;
				}

				const textMinim = document.getElementById("edita-estil-capa-valor-minim-" + i_component);
				const textMaxim = document.getElementById("edita-estil-capa-valor-maxim-" + i_component);
				const sliderMinim = document.getElementById("edita-estil-capa-slider-valor-minim-" + i_component);
				const sliderMaxim = document.getElementById("edita-estil-capa-slider-valor-maxim-" + i_component);
				if (parseFloat(valorActual) > parseFloat(estPaletaExtr.valorMinim) && parseFloat(valorActual) < parseFloat(textMaxim.value))
				{
					textMinim.value = valorActual.toFixed(3);
					sliderMinim.value = floatValor;
				}
				else
				{
					if (parseFloat(valorActual) <= parseFloat(estPaletaExtr.valorMinim))
					{
						//NJ_08_03_2023
						//const labelRangeEsqMin= document.getElementById("minEsqBtn-" + i_component);
						//const labelRangeEsqMax= document.getElementById("maxEsqBtn-" + i_component);
						textMinim.value = valorActual.toFixed(3);
						//labelRangeEsqMin.textContent = TextLimitsSliders(parseFloat(textMinim.value), true);
						//labelRangeEsqMax.textContent = TextLimitsSliders(parseFloat(textMinim.value), true);
						sliderMinim.max = parseFloat(sliderMinim.max) + (parseFloat(estPaletaExtr.valorMinim) - valorActual);
						sliderMaxim.max = sliderMinim.max;
						sliderMinim.value = 0;
						estPaletaExtr.valorMinim = parseFloat(estPaletaExtr.valorMinim) - (parseFloat(estPaletaExtr.valorMinim) - valorActual);
					}
					else
					{
						textMinim.value = (parseFloat(textMaxim.value) - valorUnitari).toFixed(3);
						sliderMinim.value = parseFloat(sliderMaxim.max) - parseFloat(sliderMaxim.value) - valorUnitari;
					}
				}
			}
			else
			{
				var valorActual = 0;
				//	Distingim entre el tipus de element "input" que preten modifica el
				//	valor de la paleta. Diferenciem entre input.type= range/text/button
				if (event.target.attributes["type"].value.localeCompare("range") == 0)
				{
					valorActual = estPaletaExtr.valorMaxim - floatValor;
				}
				else //	Tant per input.type= text o button
				{
					valorActual = floatValor;
					floatValor =  estPaletaExtr.valorMaxim - estPaletaExtr.valorMinim -(floatValor - estPaletaExtr.valorMinim);
				}

				const textMinim = document.getElementById("edita-estil-capa-valor-minim-" + i_component);
				const textMaxim = document.getElementById("edita-estil-capa-valor-maxim-" + i_component);
				const sliderMinim = document.getElementById("edita-estil-capa-slider-valor-minim-" + i_component);
				const sliderMaxim = document.getElementById("edita-estil-capa-slider-valor-maxim-" + i_component);
				if (parseFloat(valorActual) > parseFloat(textMinim.value) && parseFloat(valorActual) < parseFloat(estPaletaExtr.valorMaxim))
				{
					textMaxim.value = valorActual.toFixed(3);
					sliderMaxim.value = floatValor;
				}
				else
				{
					if (parseFloat(valorActual) >= parseFloat(estPaletaExtr.valorMaxim))
					{
						// NJ_08_03_2023
						//const labelRangeDrtMin= document.getElementById("minDrtBtn-" + i_component); 
						//const labelRangeDrtMax= document.getElementById("maxDrtBtn-" + i_component); 
						textMaxim.value = valorActual.toFixed(3);
						//labelRangeDrtMin.textContent = TextLimitsSliders(parseFloat(textMaxim.value), false);
						//labelRangeDrtMax.textContent = TextLimitsSliders(parseFloat(textMaxim.value), false);
						sliderMaxim.value = 0;
						sliderMaxim.max = valorActual - estPaletaExtr.valorMinim;
						sliderMinim.max = sliderMaxim.max;
						estPaletaExtr.valorMaxim = valorActual;
					}
					else
					{
						textMaxim.value =  (parseFloat(textMinim.value) + valorUnitari).toFixed(3);
						sliderMaxim.value = parseFloat(sliderMinim.max) - parseFloat(sliderMinim.value) - valorUnitari;
					}
				}
			}
		}
	}
}

/*
	Mostra la capa vectorial en format taula.
 */
const i_objectesAExportar = {};
var i_capaATaula = null;
/* Mostra la finestra flotant de la taula per representar la capa vectorial */
function ObreFinestraTaulaDeCapaVectorial(i_capa)
{
var elem=ObreFinestra(window, "taulaCapaVectorial", GetMessage("ElementsVectorialTable", "vector"));

	if (!elem)
		return;
	i_capaATaula = i_capa;
	InsereixCadenaTaulaDeCapaVectorial(elem, i_capa);
}

function MostraFinestraTaulaDeCapaVectorial()
{
	const elem = getFinestraLayer(window, "taulaCapaVectorial")
	InsereixCadenaTaulaDeCapaVectorial(elem, i_capaATaula)
}

/* Crea l'HTML per a construir la taula d'elements vectorials */
function InsereixCadenaTaulaDeCapaVectorial(nodePare, i_capa, isNomesAmbit = false, ambGeometria = true, ambTotSelec = false)
{
const cdnsFragmentsHtml=[], cdnsPortapapers=[], capa=ParamCtrl.capa[i_capa];
const attributesVisibles = {}, objectesDinsAmbit = [], etiquetesCorrd=["x", "y", "z"];
var attributesArray=Object.keys(capa.attributes);
var objectes = capa.objectes.features, i, j, attrLength = attributesArray.length, objLength, env_temp;

	nodePare.innerHTML = "";
	const divCapcalera = document.createElement("div");
	const paragrafTitol = divCapcalera.appendChild(document.createElement("p"));
	paragrafTitol.setAttribute("class", "vectorial");
	paragrafTitol.setAttribute("style", "font-size: 20px");
	paragrafTitol.appendChild(document.createTextNode(GetMessage("Layer")+": "+DonaCadena(capa.desc)));

	if (objectes.length <= 0)
	{
		divCapcalera.insertAdjacentElement("beforeend", document.createElement("hr"));
		divCapcalera.insertAdjacentHTML("beforeend","<p style='text-align:center;'><b>" + GetMessage("NoObjectsToDisplay", "cntxmenu") + "</b></p>");
		nodePare.appendChild(divCapcalera);
		return;
	}

	for (i = 0; i < attrLength; i++)
	{
		const attribute = capa.attributes[attributesArray[i]];
		if (attribute.mostrar == "si")
			attributesVisibles[attributesArray[i]]=capa.attributes[attributesArray[i]];
	}

	const paragrafCheckboxs = document.createElement("p");
	paragrafCheckboxs.setAttribute("class", "vectorial");
	paragrafCheckboxs.setAttribute("style", "display: flex;");

	// Si no hi han attributes per mostrar, parem i mostrem missatge explicatiu.
	var attributtesVisiblesArray=Object.keys(attributesVisibles);
	if (attributtesVisiblesArray.length <1)
	{
		divCapcalera.insertAdjacentElement("beforeend", document.createElement("hr"));
		divCapcalera.insertAdjacentHTML("beforeend", "<p style='text-align:center;'><b>" + GetMessage("NoAttributesToDisplayForLayer", "cntxmenu") + "</b></p>");
		nodePare.appendChild(divCapcalera);
		return;
	}
	cdnsFragmentsHtml.push("<fieldset>", "<legend>", GetMessage("Show"), "</legend>", "<input type='checkbox' id='nomesAmbit' ", (isNomesAmbit)? "checked" : "", " onChange='NetejaIndexosExportacio(); RecarregaTaula(", i_capa, ")'>&nbsp;",
			"<label for='nomesAmbit'>", GetMessage("OnlyItemsInScope", "cntxmenu"), "</label> ");

	// Si només desitgem veure els objectes de l'àmbit
	if (isNomesAmbit)
	{
		for (i = 0, objLength = objectes.length; i < objLength; i++)
		{
			const objActual = objectes[i];
			const geometryCRS = DonaGeometryCRSActual(objActual, capa.CRSgeometry);
			if (geometryCRS.type == "Point")
			{ 
				// Obtinc la geometria en el CRS actual de navegació.				
				if (EsPuntDinsEnvolupant({"x":geometryCRS.coordinates[0], "y":geometryCRS.coordinates[1]}, ParamInternCtrl.vista.EnvActual))
					objectesDinsAmbit.push(objActual);
			}
			else
			{
				if (!objActual.bbox)
					env_temp=DonaEnvCalculatGeometry(objActual.geometry, null);
				else
					env_temp=DonaEnvDeMinMaxXY(objActual.bbox[0], objActual.bbox[2], objActual.bbox[1], objActual.bbox[3]);
				// Obtinc l'àmbit en el CRS actual de navegació.
				const ambitCRS = DonaEnvolupantCRS(env_temp, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
				if (EsEnvDinsEnvolupant(ambitCRS, ParamInternCtrl.vista.EnvActual))
					objectesDinsAmbit.push(objActual);
			}
		}
		// Traspassem els objectes de l'àmbit a l'estructura que nodreix la resta de la funció.
		objectes = objectesDinsAmbit;

		if (objectes.length <= 0)
		{
			paragrafCheckboxs.insertAdjacentHTML("afterbegin", cdnsFragmentsHtml.join(""));
			divCapcalera.appendChild(paragrafCheckboxs);
			divCapcalera.insertAdjacentElement("beforeend", document.createElement("hr"));
			divCapcalera.insertAdjacentHTML("beforeend", "<p style='text-align:center;'><b>" + GetMessage("NoObjectsToDisplayWithinRange", "cntxmenu") + "</b></p>");
			nodePare.appendChild(divCapcalera);
			return;
		}
	}
	cdnsFragmentsHtml.push("<input type='checkbox' id='ambGeometria' ", (ambGeometria)? "checked" : "", " onChange='RecarregaTaula(",i_capa, ")'>&nbsp;",
	"<label for='ambGeometria'>", GetMessage("Geometry", "cntxmenu"), "</label>", "</fieldset>",
	"<fieldset>", "<legend>", GetMessage("Seleccions", "cntxmenu"), "</legend>", "<input type='checkbox' id='" + checkboxTotsElemTaulaVectId + "' ", (ambTotSelec)? "checked" : "", " onChange='SeleccionaTotsObjectes(", objectes.length, ")'>&nbsp;",
	"<label for='" + checkboxTotsElemTaulaVectId + "'>", GetMessage("AllObjects", "cntxmenu"), "</label> ",
	"<button onClick='ExportarObjectesGeoJSON(", i_capa, ")'>", GetMessage("SaveObjects", "cntxmenu"),"</button> ",
	"<button style='align-self:end;' onClick='ObreObjectesGeoJsonTAPIS(", i_capa, ")'>", GetMessage("OpenWithTapis", "cntxmenu"),"</button>", "</fieldset>");
	paragrafCheckboxs.insertAdjacentHTML("beforeend", cdnsFragmentsHtml.join(""));
	divCapcalera.appendChild(paragrafCheckboxs);
	divCapcalera.insertAdjacentElement("beforeend", document.createElement("hr"));

	// Porta papers capa info
	if (capa.EnvTotal)
		env_temp=capa.EnvTotal.EnvCRS;
	else if(capa.objectes.bbox)
		env_temp=DonaEnvDeMinMaxXY(capa.objectes.bbox[0], capa.objectes.bbox[2], capa.objectes.bbox[1], capa.objectes.bbox[3]);
	else
		env_temp=DonaEnvCalculatCapa(capa).EnvCRS;	
	cdnsPortapapers.push(GetMessage("Layer"), "\t", DonaCadena(capa.desc), "\n",
						 GetMessage("CurrentReferenceSystem"), "\t", capa.CRSgeometry, "\n",
						"MinX", "\t", env_temp.MinX, "\n",
						"MaxX", "\t", env_temp.MaxX, "\n",
						"MinY", "\t", env_temp.MinY, "\n",
						"MaxY", "\t", env_temp.MaxY, "\n",
						GetMessage("Type"), "\t", capa.model, " ", objectes[0].geometry.type, "\n");
	
	//Comencem la taula.
	const taulaElementsVect = document.createElement("table");
	taulaElementsVect.setAttribute("class", "vectorial");

	// Comencem la fila capçalera de la taula.
	const filaCapcalera = document.createElement("tr");	
	for (i = 0, attrLength = attributtesVisiblesArray.length; i < attrLength; i++)
	{
		filaCapcalera.insertAdjacentHTML("beforeend", "<th class='vectorial'>" + DonaCadenaDescripcioAttribute(attributtesVisiblesArray, attributesVisibles[attributtesVisiblesArray[i]], true) + "</th>");

		// Porta papers
		cdnsPortapapers.push(attributesVisibles[attributtesVisiblesArray[i]].descripcio, "\t");
	}
	filaCapcalera.insertAdjacentHTML("beforeend", "<th class='vectorial'>" + GetMessage("ExportObject", "cntxmenu") + "</th><th class='vectorial'>" + GetMessage("GoTo", "capavola") + "</th>");
	
	if (ambGeometria)
	{
		filaCapcalera.insertAdjacentHTML("beforeend", "<th class='vectorial' style='text-align:start;'>" + GetMessage("Geometry", "cntxmenu") + "</th>");
		
		// Porta papers
		cdnsPortapapers.push(GetMessage("Geometry", "cntxmenu"), "\n");		
	}
	taulaElementsVect.insertAdjacentElement("afterbegin", filaCapcalera);
	
	// Comencem files d'objectes vectorials de la taula.
	// Comprovo si algun attribute és sèrie temporal
	var algun_attribute_es_serie_temporal=false;
	if(capa.AnimableMultiTime && capa.data && capa.data.length>0)
	{
		for (i = 0; i < attributtesVisiblesArray.length; i++)
		{
			if(attributesVisibles[attributtesVisiblesArray[i]].serieTemporal)
			{
				algun_attribute_es_serie_temporal=true;
				break;
			}
		}
	}
	var wkt = new Wkt.Wkt();
	var cdns_anar_obj, cadena_obj_wkt, boto_desplegable, i_data, prop, n_dates=(algun_attribute_es_serie_temporal ? capa.data.length  : 1);
	for (i = 0, objLength = objectes.length; i < objLength; i++)
	{		
		const objecteARepresentar = objectes[i], tipusGeometria = objecteARepresentar.geometry.type;
		for (i_data = 0; i_data < n_dates; i_data++)
		{
			const filaObjecte = document.createElement("tr");
			filaObjecte.setAttribute("class", "vectorial");
			//cdnsHtml.push("<tr class='vectorial' height='20px'>");
			for (j = 0, attrLength = attributtesVisiblesArray.length; j < attrLength; j++)
			{
				prop=objecteARepresentar.properties[CanviaVariablesDeCadena(attributtesVisiblesArray[j], capa, i_data, null)];
				filaObjecte.insertAdjacentHTML("beforeend", "<td class='vectorial' sytle='text-overflow:ellipsis; overflow:hidden; white-space:nowrap'>" + (prop ? prop :"") + "</td>");
				// Porta papers
				cdnsPortapapers.push((prop ? prop :""), "\t");
			}
			filaObjecte.insertAdjacentHTML("beforeend", "<td style='text-align:center'><input type='checkbox' id='" + checkboxCadaElementId + i + 
							"' value='" + i + "' onChange='ActualitzaIndexObjectesExportar(this);'></td>");
			if(i_data==0)
			{				
				// obtindré array de punts de coordenades.
				var arrayCoords = [], anarCoord, anar_obj;				
				if (objecteARepresentar.geometry.coordinates.length > 0)
				{			
					if (tipusGeometria == "Point")
						arrayCoords = objecteARepresentar.geometry.coordinates;
					else if (tipusGeometria == "LineString" || tipusGeometria =="MultiPoint")
						arrayCoords = objecteARepresentar.geometry.coordinates;
					else if (tipusGeometria == "Polygon" || tipusGeometria =="MultiLineString")
						arrayCoords = objecteARepresentar.geometry.coordinates[0];
					else if (tipusGeometria == "MultiPolygon")
						arrayCoords = objecteARepresentar.geometry.coordinates[0][0];					
				}
		
				// Calculem o agafem l'env de l'objecte
				if (!objecteARepresentar.bbox)
					env_temp=DonaEnvCalculatGeometry(objecteARepresentar.geometry, null);
				else
					env_temp=DonaEnvDeMinMaxXY(objecteARepresentar.bbox[0], objecteARepresentar.bbox[2], objecteARepresentar.bbox[1], objecteARepresentar.bbox[3]);
				
				// La coordenada del objecte
				if (tipusGeometria == "Polygon" || tipusGeometria == "MultiPolygon")
					anarCoord ={x:(env_temp.MinX + env_temp.MaxX)/2, y: (env_temp.MinY + env_temp.MaxY)/2};
				else if (tipusGeometria == "Point")
					anarCoord={x : arrayCoords[0], y : arrayCoords[1]};
				else
					anarCoord={x : arrayCoords[0][0], y : arrayCoords[0][1]};
				
				anar_obj=["<td><button style='width=100%' onClick='AnarAObjVectorialTaula(", anarCoord.x, ",", anarCoord.y, ", \"",capa.CRSgeometry,"\",", 	env_temp.MinX, ",", env_temp.MaxX, ",", env_temp.MinY, ",", env_temp.MaxY, ");'>" , GetMessage("GoTo", "capavola") , "</button></td>"];
				
				cdns_anar_obj= anar_obj.join("");
				
				if (ambGeometria)
				{
					wkt.fromJson(objecteARepresentar.geometry);
					cadena_obj_wkt=wkt.write();
					boto_desplegable=capa.nom + "_feature_" + i;
				}	
			}
			filaObjecte.insertAdjacentHTML("beforeend", cdns_anar_obj);

			if (ambGeometria)
			{
				const columnaDada = document.createElement("td");
				
				if (tipusGeometria == "Point")
					columnaDada.insertAdjacentHTML("beforeend", cadena_obj_wkt);
				else
					columnaDada.insertAdjacentHTML("beforeend", GetMessage('moreInfo') + ": " +  BotoDesplegableDiv(boto_desplegable, CreaContenedorTextAmbScroll(cadena_obj_wkt, 120)));
				
				filaObjecte.insertAdjacentElement("beforeend", columnaDada);
				
				// Porta papers
				cdnsPortapapers.push(cadena_obj_wkt, "\t");
			}							
			taulaElementsVect.insertAdjacentElement("beforeend", filaObjecte);
			// Porta papers
			cdnsPortapapers.push("\n");
		}
	}
	divCapcalera.insertAdjacentElement("beforeend", taulaElementsVect);
	// Div i textArea per copar contingut de la taula i exportar-lo a .csv (Full de càlcul).
	divCapcalera.insertAdjacentHTML("beforeend", DonaPortapapersTaulaCapaVectorial(cdnsPortapapers.join("")));
	//cdnsHtml.push(DonaPortapapersTaulaCapaVectorial(cdnsPortapapers.join("")));
	//return cdnsHtml.join("");
	nodePare.appendChild(divCapcalera);
	return;
}

// Crea un conjunt de <div> anidats per a fixar una alçada concreta i la resta de contingut es mostri dins d'un scroll.
function CreaContenedorTextAmbScroll(contingut, alcada = "50")
{
	const cdnsDivScroller = [];

	cdnsDivScroller.push("<div style='height:", alcada,"px; position: relative;'>",
	"<div style='max-height: 100%; overflow: auto;'>", 
	"<div>", contingut, "</div>", "</div>", "</div>");

	return cdnsDivScroller.join("");
}

/* Determina quins elements vectorials s'inclouran en l'exportació */
function ActualitzaIndexObjectesExportar(checkbox)
{
	const indexATreballar = checkbox.value.toString();
	// És un diccionari d'índexos on cada element és a la vegada el mateix índex.
	checkbox.checked ? i_objectesAExportar[indexATreballar]=indexATreballar : delete i_objectesAExportar[indexATreballar];
}

// Neteja de l'objecte d'índexos a exportar.
function NetejaIndexosExportacio()
{
	const checkboxTotsElem = document.getElementById(checkboxTotsElemTaulaVectId);
	if (checkboxTotsElem)
		checkboxTotsElem.checked = false; 

	for (var clau in i_objectesAExportar)
		delete i_objectesAExportar[clau];
}

// Selecciona tots els objectes a exportar.
function SeleccionaTotsObjectes(totalObjectes) 
{
	const checkboxTotsElem = document.getElementById(checkboxTotsElemTaulaVectId);
	if (checkboxTotsElem)
	{
		let checkbox;
		for (let i = 0; i < totalObjectes; i++)
		{
			checkbox = document.getElementById(checkboxCadaElementId + i);
			if (checkbox)
			{
				checkbox.checked = checkboxTotsElem.checked;
				checkboxTotsElem.checked ? i_objectesAExportar[checkbox.value.toString()]=checkbox.value.toString() : delete i_objectesAExportar[checkbox.value.toString()];
			}
		}
	}
}

function DonaPortapapersTaulaCapaVectorial(contingutACopiar)
{
	const portapapers = "<div style=\"display: none\" id=\"taulaCapaVectorial_copy_div\"><form name=\"taulaCapaVectorial_copy_form\" onSubmit=\"return false;\"><textarea id=\"taulaCapaVectorial_copy_text\" wrap=\"off\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">" + contingutACopiar + "</textarea></form></div>";
	return portapapers;
}

// Funció que es crida al tancar la vista amb taula d'elements i elimina la creu punter de l'objecte localitzat.
function TancaFinestra_taulaCapaVectorial()
{
	i_capaATaula=null;
	if (typeof ParamCtrl.ICapaVolaAnarObj !== "undefined")
	{
	   ParamCtrl.capa[ParamCtrl.ICapaVolaAnarObj].visible="no";
	   CreaVistes();
	}
}

function RecarregaTaula(i_capa)
{
	const checkboxAmbit = document.getElementById("nomesAmbit");
	const checkboxGeometria = document.getElementById("ambGeometria");
	const checkboxTotSelec = document.getElementById(checkboxTotsElemTaulaVectId);
	const ambit = checkboxAmbit ? checkboxAmbit.checked : false, geometria = checkboxGeometria ? checkboxGeometria.checked : false, totSelecc = checkboxTotSelec ? checkboxTotSelec.checked : false;
	InsereixCadenaTaulaDeCapaVectorial(getFinestraLayer(window, "taulaCapaVectorial"), i_capa, ambit, geometria, totSelecc);
}

function PreparaGeoJSONObjectesSeleccionats(i_capa)
{
	const dadesExportar = {"type": "FeatureCollection", "features": []};
	const capa = ParamCtrl.capa[i_capa];
	// Valors mínims/màxims bbox
	const bboxObjectesAExportar = [180.0, 90.0, -180.0, -90.0];
	
	Object.keys(i_objectesAExportar).forEach(key => {
		const objAExportar = capa.objectes.features[key];
		// Definir l'àmbit global dels elements exportats
		if (objAExportar.bbox && objAExportar.bbox.length==4)
		{
			const iteradorIndex = objAExportar.bbox.keys();
			for (var index of iteradorIndex)
			{
				// Coord del bbox Mínima
				if (index < 2)
				{
					if (objAExportar.bbox[index] < bboxObjectesAExportar[index])
						bboxObjectesAExportar[index] = objAExportar.bbox[index];
				}
				else // Coord del bbox Màxima
				{
					if (objAExportar.bbox[index] > bboxObjectesAExportar[index])
						bboxObjectesAExportar[index] = objAExportar.bbox[index];
				}
			}
			dadesExportar.bbox = bboxObjectesAExportar;
		}
		dadesExportar.features.push(objAExportar);
	});

	return dadesExportar;
}

function ExportarObjectesGeoJSON(i_capa)
{
	if (Object.keys(i_objectesAExportar).length > 0)
	{
		const objectesGeoJSON = PreparaGeoJSONObjectesSeleccionats(i_capa);
		return GuardaDadesJSONFitxerExtern(objectesGeoJSON, GetMessage("exportedVectorObjects", "cntxmenu") + Date.now());
	}
	else
	{
		alert(GetMessage("NoObjectSelectedExport", "cntxmenu"));
	}
}

var finestraTAPIS;
var capaIndexPerTAPIS;
/**
 * Permet obrir l'eina web TAPIS per visualitzar les dades dels objectes seleccionat
 */
function ObreObjectesGeoJsonTAPIS (i_capa)
{
	if (Object.keys(i_objectesAExportar).length > 0)
	{
		capaIndexPerTAPIS = i_capa;
		finestraTAPIS = window.open(urlTAPIS, "_blank", "width=1400,height=800");
	}
	else
	{
		alert(GetMessage("NoObjectSelectedTapis", "cntxmenu"));
	}
}

/**
 * S'envia un GeoJSON per Post message al TAPIS que aquest interpretarà permetent visualitzar-lo.
 */
function EnviaGeoJSONTAPIS()
{
	const objectesGeoJSON = PreparaGeoJSONObjectesSeleccionats(capaIndexPerTAPIS);

	finestraTAPIS.postMessage(JSON.stringify({type:"GeoJSON", data: objectesGeoJSON, url: window.location.href}), "*");
}