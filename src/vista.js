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

    Copyright 2001, 2023 Xavier Pons

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

var nfilVistaImprimir;
var VistaImprimir={ "EnvActual": {"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0},
				 "nfil": 0,
				 "ncol": 0,
				 "CostatZoomActual": 0,
				 "i_vista": -2,
				 "i_nova_vista": NovaVistaImprimir};  //El significat de "i_nova_vista" es pot trobar a la funció PreparaParamInternCtrl()

function CalculaNColNFilVistaImprimir(ncol,nfil)
{
var factor_mapa=(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)/(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX);
var factor_paper=nfil/ncol;
var i, capa;
	if (factor_mapa>factor_paper)
	{
	    VistaImprimir.nfil=nfil;
	    VistaImprimir.ncol=floor_DJ(nfil/factor_mapa);
	}
	else
	{
	    VistaImprimir.ncol=ncol;
	    VistaImprimir.nfil=floor_DJ(ncol*factor_mapa);
	}
	var costat;
	if (!(plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&RespectarResolucioVistaImprimir))
	{
	    for (i=0; i<ParamCtrl.capa.length; i++)
	    {
			capa=ParamCtrl.capa[i];
			if (EsCapaVisibleAAquestNivellDeZoom(capa) &&
				DonaTipusServidorCapa(capa)!="TipusWMS" &&
				DonaTipusServidorCapa(capa)!="TipusOAPI_Maps")
			{
				//Hi ha 1 capa (o més) en WMTS. En aquest cas, es fixa un nivell de zoom superior al ambit que es vol demanar.
				costat=(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)/VistaImprimir.ncol;
				//Buscar el costar de pixel que cumplim:
				var i_zoom=DonaIndexNivellZoomCeil(costat);
				if (i_zoom==-1)
					i=ParamCtrl.capa.length;  //No ha ha cap costat que em serveixi.
				else
					costat=ParamCtrl.zoom[i_zoom].costat; //Ara amb el nou costat de píxel cal redefinir envolupant per excés donat que no la puc conservar totalment.
				break;
			}
	    }
	    if (i==ParamCtrl.capa.length)
	    {
			VistaImprimir.EnvActual.MinX=ParamInternCtrl.vista.EnvActual.MinX;
			VistaImprimir.EnvActual.MinY=ParamInternCtrl.vista.EnvActual.MinY;
			VistaImprimir.EnvActual.MaxX=ParamInternCtrl.vista.EnvActual.MaxX;
			VistaImprimir.EnvActual.MaxY=ParamInternCtrl.vista.EnvActual.MaxY;
	        return;
	    }
	}
	else
	    costat=ParamInternCtrl.vista.CostatZoomActual;

	VistaImprimir.EnvActual.MinX=(ParamInternCtrl.vista.EnvActual.MaxX+ParamInternCtrl.vista.EnvActual.MinX)/2-VistaImprimir.ncol/2*costat;
	VistaImprimir.EnvActual.MinY=(ParamInternCtrl.vista.EnvActual.MaxY+ParamInternCtrl.vista.EnvActual.MinY)/2-VistaImprimir.nfil/2*costat;
	VistaImprimir.EnvActual.MaxX=VistaImprimir.EnvActual.MinX+VistaImprimir.ncol*costat;
	VistaImprimir.EnvActual.MaxY=VistaImprimir.EnvActual.MinY+VistaImprimir.nfil*costat;
}


function CreaVistaFullImprimir(win)
{
	winImprimir=win;
	CreaVistaImmediata(win, "vista", VistaImprimir);
}


function DonaCadenaHTMLDibuixEscala(env, cal_desc_crs)
{
var cdns=[];

	var escala=DonaNumeroArrodonit125((env.MaxX-env.MinX)*0.4);
	cdns.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=\"middle\" width=\"1\" height=\"3\" border=\"0\"></td></tr>",
			"<tr><td align=\"middle\" style=\"font-size: 1px;\"><img src=\"",
			AfegeixAdrecaBaseSRC("1negre.gif"),
			"\" width=\"", Math.round(escala/ParamInternCtrl.vista.CostatZoomActual),
		  	"\" height=\"2\"></td></tr>",
			"<tr><td align=\"middle\"><font face=\"arial\" size=\"1\">", escala, DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS));
	if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
	{
		var d_escala=DonaDenominadorDeLEscalaArrodonit(escala*FactorGrausAMetres*Math.cos((env.MaxY+env.MinY)/2*FactorGrausARadiants))
		cdns.push(" (", GetMessage("approx"), ". " , (d_escala>10000 ? d_escala/1000+" km" : d_escala+" m"), " " ,
			GetMessage("atLat"), ". " , (OKStrOfNe((env.MaxY+env.MinY)/2,1)) , "°)");
	}
	else if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="AUTO2:MERCATOR,1,0,41.42")
		cdns.push(" (" , (GetMessage("atLat")) , " 41° 25\')");
	else if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="AUTO2:MERCATOR,1,0,40.60")
		cdns.push(" (" , (GetMessage("atLat")) , " 40° 36\')");
	else if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="AUTO2:MERCATOR,1,0,0.0" || ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="EPSG:3785")
		cdns.push(" (" , (GetMessage("atLat")) , " 0° 0\')");
	cdns.push("</font></td>");
	if (cal_desc_crs)
		cdns.push("<td><font face=\"arial\" size=\"2\"> &nbsp;",
				DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS),"</font></td>");
	cdns.push("</tr></table>");
	return cdns.join("");
}

function CreaEscalaFullImprimir(win)
{
    var elem=getLayer(win, "escala");
    if (isLayer(elem))
		contentLayer(elem, DonaCadenaHTMLDibuixEscala(VistaImprimir.EnvActual, true));
}

var TriaFullWindow=null;
function ObreTriaFullImprimir()
{
    if (TriaFullWindow==null || TriaFullWindow.closed)
    {
        TriaFullWindow=window.open("print.htm","FinestraPrint",'toolbar=no,status=yes,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=400,height=600,left=0,top=0');
		ShaObertPopUp(TriaFullWindow);
    }
    else
        TriaFullWindow.focus();
}

function SeparaNumerosDe3En3(s, separador)
{
var mida=s.length/3;
var j;

	for (var i=0; i<mida; i++)
	{
		j=s.length-i*(3+separador.length)-3;
		s=s.substring(0,j)+separador+s.substring(j,s.length);
	}
	return s;
}

function EscriuEscalaAproximada(i, crs)
{
var e=ParamCtrl.zoom[i].costat*1000/MidaDePixelPantalla;

	if (EsProjLongLat(crs))
		e*=FactorGrausAMetres;
	return DonaDenominadorDeLEscalaArrodonit(e);
}

//Aquesta funció converteix un nom de vista en un index de l'array ParamCtrl.VistaPermanent. Noteu que no funciona per les "vistes noves" creades per l'usuari.
function DonaIVista(nom)
{
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		if (ParamCtrl.VistaPermanent[i_vista].nom==nom)
			return i_vista;
	}
}

var NRequestedCursor=0;


//https://www.w3schools.com/cssref/pr_class_cursor.asp
/*cursor pot ser
	un cursor requerit (que cal cancelar més tard)
	"auto" per cancelar un cursor requerit
	null perque la funció determini el cursor a partir del estats del botons (de fet de les variables que reflectexien l'estat dels botons)*/
function CanviaCursorSobreVista(requested_cursor)
{
var cursor="auto";

	if (requested_cursor)
	{
		if (requested_cursor=="auto")
			NRequestedCursor--;
		else
		{
			cursor=requested_cursor;
			NRequestedCursor++
		}
	}

	if (NRequestedCursor==0)
	{
		if(ParamCtrl.EstatClickSobreVista=="ClickPan1" || ParamCtrl.EstatClickSobreVista=="ClickPan2")
			cursor="all-scroll";  //abans "move", "grab"

		if(ParamCtrl.EstatClickSobreVista=="ClickZoomRec1" || ParamCtrl.EstatClickSobreVista=="ClickZoomRec2" ||
			ParamCtrl.EstatClickSobreVista=="ClickRecFB1" || ParamCtrl.EstatClickSobreVista=="ClickRecFB2" ||
		   ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2" ||
		   ParamCtrl.EstatClickSobreVista=="ClickMouMig")
			cursor="crosshair";
		else if (ParamCtrl.EstatClickSobreVista=="ClickConLoc")
			cursor="help";
		else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
			cursor="crosshair";
	}
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		var elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixTelTrans);
		if(elem)
			elem.style.cursor=cursor;
		elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixSliderZoom);
		if(elem)
			elem.style.cursor=cursor;
	}
	for (var i_vista=0; i_vista<NovaVistaFinestra.vista.length; i_vista++)
	{
		var elem=getLayer(window, prefixNovaVistaFinestra+i_vista+"_finestra" + SufixTelTrans);
		if(elem)
			elem.style.cursor=cursor;
	}
}

function MouLaVista(dx,dy)
{
    if (ParamCtrl.ConsultaTipica)
		PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
    GuardaVistaPrevia();
    ParamInternCtrl.PuntOri.x+=dx;
    ParamInternCtrl.PuntOri.y+=dy;
    VerificaICorregeixPuntOri();
    RepintaMapesIVistes();
}

/*Mou la vista un finestra sencera en x, y especificant -1, 0 o 1 segons el sentit desitjat:
     sx: -1 per esquerra, 0 per res, 1 per dreta.
     sy: -1 per aball,    0 per res, 1 per adalt.
  El moviment no salta una finetra sencera exactament sino que té en compte el paràmetre psalt
  (percentatge de salt). Crida RepintaMapesIVistes() al final*/
function MouLaVistaSalt(sx,sy)
{
	MouLaVista( ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual*ParamCtrl.psalt/100*sx,
		   		ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual*ParamCtrl.psalt/100*sy);
}

function MouLaVistaEventDeSalt(event, sx, sy) //Afegit JM 18/09/2016
{
	ComprovaCalTancarFeedbackAmbScope();
	MouLaVistaSalt(sx,sy);
	dontPropagateEvent(event);
}


/*Mou la vista per centrar-la a la posició x,y en coordenades mapa. Crida RepintaMapesIVistes()
  al final. Aquesta funció NO guarda la vista.*/
function CentraLaVista(x,y)
{
    ParamInternCtrl.PuntOri.x=x;
    ParamInternCtrl.PuntOri.y=y;
    ParamInternCtrl.vista.EnvActual.MinX=ParamInternCtrl.PuntOri.x-(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2;
    //ParamInternCtrl.vista.EnvActual.MaxX=ParamInternCtrl.PuntOri.x+(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2;
    ParamInternCtrl.vista.EnvActual.MaxX=ParamInternCtrl.vista.EnvActual.MinX+(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual;
    ParamInternCtrl.vista.EnvActual.MinY=ParamInternCtrl.PuntOri.y-(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2;
    //ParamInternCtrl.vista.EnvActual.MaxY=ParamInternCtrl.PuntOri.y+(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2;
    ParamInternCtrl.vista.EnvActual.MaxY=ParamInternCtrl.vista.EnvActual.MinY+(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual;
}

var MidaFletxaInclinada=10;
var MidaFletxaPlana=15;

function DonaMargeSuperiorVista(i_nova_vista)
{
	if (i_nova_vista!=NovaVistaPrincipal)
		return 0;
	return ((ParamCtrl.MargeSupVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeSupVista:0)+(ParamCtrl.CoordExtremes?AltTextCoordenada:0)+(ParamCtrl.VoraVistaGrisa ? MidaFletxaInclinada:0);  //Distancia entre la vista i vora superior del frame
}

function DonaMargeEsquerraVista(i_nova_vista)
{
	if (i_nova_vista!=NovaVistaPrincipal)
		return 0;
	return ((ParamCtrl.MargeEsqVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeEsqVista:0)+(ParamCtrl.VoraVistaGrisa ? MidaFletxaInclinada:0);      //Distancia entre la vista i vora esquerra del frame
}


function DonaOrigenSuperiorVista(elem, i_nova_vista)
{
	return DonaMargeSuperiorVista(i_nova_vista)+getRectSupLayer(elem);
}

function DonaOrigenEsquerraVista(elem, i_nova_vista)
{
	return DonaMargeEsquerraVista(i_nova_vista)+getRectEsqLayer(elem);
}

function DonaCoordSobreVistaDeCoordX(elem, x)
{
	return (x-ParamInternCtrl.vista.EnvActual.MinX)/(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)*ParamInternCtrl.vista.ncol-((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0) + DonaOrigenEsquerraVista(elem, -1);
}

function DonaCoordSobreVistaDeCoordY(elem, y)
{
	return (ParamInternCtrl.vista.EnvActual.MaxY-y)/(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)*ParamInternCtrl.vista.nfil-((window.document.body.scrollTop) ? window.document.body.scrollTop : 0) + DonaOrigenSuperiorVista(elem, -1);
}

function DonaCoordXDeCoordSobreVista(elem, i_nova_vista, x)
{
	var vista=DonaVistaDesDeINovaVista(i_nova_vista);
	return vista.EnvActual.MinX+(vista.EnvActual.MaxX-vista.EnvActual.MinX)/vista.ncol*(((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+x-DonaOrigenEsquerraVista(elem, i_nova_vista));
}

function DonaCoordYDeCoordSobreVista(elem, i_nova_vista, y)
{
	var vista=DonaVistaDesDeINovaVista(i_nova_vista);
	return vista.EnvActual.MaxY-(vista.EnvActual.MaxY-vista.EnvActual.MinY)/vista.nfil*(((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+y-DonaOrigenSuperiorVista(elem, i_nova_vista));
}

function DonaCoordIDeCoordSobreVista(elem, i_nova_vista, x)
{
	return ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0) + x-DonaOrigenEsquerraVista(elem, i_nova_vista);
}

function DonaCoordJDeCoordSobreVista(elem, i_nova_vista, y)
{
	return ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0) + y-DonaOrigenSuperiorVista(elem, i_nova_vista);
}


//Fer un click sobre la vista.

var AmbitZoomRectangle={"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0};
var ZRec_1PuntClient={"x": 0, "y": 0};  //This is used for store the first point of a zoom window rectangle in desktop but also for a 2 fingers touch event in mobile devices
var ZRecSize_1Client={"x": 0, "y": 0}, ZRecSize_2Client={"x": 0, "y": 0};   //Only for touch events. I'm allowing for a negative sizes until the very last moment.
var HiHaHagutMoviment=false, HiHaHagutPrimerClick=false;
var NovaVistaFinestra={"n": 0, "vista":[]};
var CoordsFB={"x1":"", "y1":"","x2":"", "y2":""};

function ClickSobreVista(event, i_nova_vista)
{
var i_vista;

	if (ParamCtrl.EstatClickSobreVista=="ClickConLoc")
		ConsultaSobreVista(event, i_nova_vista);
	else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
		EditarPunts(event, i_nova_vista);
	else if (ParamCtrl.EstatClickSobreVista=="ClickMouMig")
	{
		PortamAPunt(DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX), DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY));
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan1")
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		ZRec_1PuntClient.x=event.clientX;
		ZRec_1PuntClient.y=event.clientY;

		ParamCtrl.EstatClickSobreVista="ClickPan2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan2")
	{
		if (!HiHaHagutMoviment)
			return;
		//Calculo el moviment que s'ha de produir i el faig.
		MouLaVista(AmbitZoomRectangle.MinX-DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX),
		AmbitZoomRectangle.MinY-DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY));
		ParamCtrl.EstatClickSobreVista="ClickPan1";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec1")
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		ZRec_1PuntClient.x=event.clientX;
		ZRec_1PuntClient.y=event.clientY;

		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista));
			showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		}
		ParamCtrl.EstatClickSobreVista="ClickZoomRec2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickRecFB1")
	{
		ZRec_1PuntClient.x=event.clientX;
		ZRec_1PuntClient.y=event.clientY;
		//Guardo les coordenades del primer click
		CoordsFB.x1=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		CoordsFB.y1=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista));
			showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		}
		ParamCtrl.EstatClickSobreVista="ClickRecFB2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" &&  i_nova_vista==NovaVistaPrincipal)
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		ZRec_1PuntClient.x=event.clientX;
		ZRec_1PuntClient.y=event.clientY;

		moveLayer2(getLayer(window, event.target.parentElement.id+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista));
		showLayer(getLayer(window, event.target.parentElement.id+SufixZRectangle));
		ParamCtrl.EstatClickSobreVista="ClickNovaVista2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec2")
	{
		if (!HiHaHagutMoviment)
			return;
		if (AmbitZoomRectangle.MinX<DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX))
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		else
		{
			AmbitZoomRectangle.MaxX=AmbitZoomRectangle.MinX;
			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		}
		if (AmbitZoomRectangle.MinY<DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY))
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		else
		{
			AmbitZoomRectangle.MaxY=AmbitZoomRectangle.MinY;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		}
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		if (ParamCtrl.ConsultaTipica)
			PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
		PortamAAmbit(AmbitZoomRectangle);
		ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickRecFB2")
	{
		//Guardo les coordenades del segon click
		CoordsFB.x2=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		CoordsFB.y2=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);

		EscriuCoordenadesAFinestraFeedbackAmbScope();

		ParamCtrl.EstatClickSobreVista="ClickRecFB1";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista2" && i_nova_vista==NovaVistaPrincipal)
	{
		if (!HiHaHagutMoviment)
			return;
		if (AmbitZoomRectangle.MinX<DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX))
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		else
		{
			AmbitZoomRectangle.MaxX=AmbitZoomRectangle.MinX;
			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		}
		if (AmbitZoomRectangle.MinY<DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY))
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		else
		{
			AmbitZoomRectangle.MaxY=AmbitZoomRectangle.MinY;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		}
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		if (ParamCtrl.ConsultaTipica)
			PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);

		var di, dj, min_i, min_j;
		if (event.clientX>ZRec_1PuntClient.x)
		{
			min_i=ZRec_1PuntClient.x;
			di= event.clientX-ZRec_1PuntClient.x
		}
		else
		{
			min_i=event.clientX;
			di= ZRec_1PuntClient.x-event.clientX;
		}
		if (event.clientY>ZRec_1PuntClient.y)
		{
			min_j=ZRec_1PuntClient.y;
			dj= event.clientY-ZRec_1PuntClient.y
		}
		else
		{
			min_j=event.clientY;
			dj= ZRec_1PuntClient.y-event.clientY;
		}
		min_i=((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ min_i + DonaMargeEsquerraVista(i_nova_vista);
		min_j=((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+ min_j + DonaMargeSuperiorVista(i_nova_vista);
		min_j-=AltBarraFinestraLayer*2;
		dj+=AltBarraFinestraLayer;

		var nom_nova_vista=prefixNovaVistaFinestra+NovaVistaFinestra.n;
		insertContentLayer(getLayer(window, event.target.parentElement.id), "afterEnd", textHTMLFinestraLayer(nom_nova_vista, {"cat": "Vista "+(NovaVistaFinestra.n+1), "spa": "Vista "+(NovaVistaFinestra.n+1), "eng": "View "+(NovaVistaFinestra.n+1), "fre": "Vue "+(NovaVistaFinestra.n+1) }, boto_tancar, min_i-1, min_j-1, di, dj, "NW", {scroll: "no", visible: true, ev: null}, null));
		OmpleBarraFinestraLayerNom(window, nom_nova_vista);
		dj-=(AltBarraFinestraLayer+1);
		di-=1;
		NovaVistaFinestra.vista[NovaVistaFinestra.n]={ "EnvActual": {"MinX": AmbitZoomRectangle.MinX, "MaxX": AmbitZoomRectangle.MinX+ParamInternCtrl.vista.CostatZoomActual*di, "MinY": AmbitZoomRectangle.MinY+ParamInternCtrl.vista.CostatZoomActual*AltBarraFinestraLayer, "MaxY": AmbitZoomRectangle.MinY+ParamInternCtrl.vista.CostatZoomActual*(AltBarraFinestraLayer+dj)},
				 "nfil": dj,
				 "ncol": di,
				 "CostatZoomActual": ParamInternCtrl.vista.CostatZoomActual,
				 "i_vista": DonaIVista(event.target.parentElement.id),
				 "i_nova_vista": NovaVistaFinestra.n};
		//alert(JSON.stringify(NovaVistaFinestra.vista[NovaVistaFinestra.n], null, "\t"));
		CreaVistaImmediata(window, nom_nova_vista+"_finestra", NovaVistaFinestra.vista[NovaVistaFinestra.n]);
		NovaVistaFinestra.n++;

		ParamCtrl.EstatClickSobreVista="ClickNovaVista1";
	}
	HiHaHagutPrimerClick=false;
}

function EscriuCoordenadesAFinestraFeedbackAmbScope()
{
	var xmin, xmax, ymin, ymax;
	if (CoordsFB.x1>CoordsFB.x2)
	{
		xmin=CoordsFB.x2;
		xmax=CoordsFB.x1;
	}
	else
	{
		xmin=CoordsFB.x1;
		xmax=CoordsFB.x2;
	}
	if (CoordsFB.y1>CoordsFB.y2)
	{
		ymin=CoordsFB.y2;
		ymax=CoordsFB.y1;
	}
	else
	{
		ymin=CoordsFB.y1;
		ymax=CoordsFB.y2;
	}
	//escrivim les coordenades endreçades a la finestra corresponent
	var dec=ParamCtrl.NDecimalsCoordXY;

	document.getElementById("fbscope_xmin").value=OKStrOfNe(xmin, dec);
	document.getElementById("fbscope_xmax").value=OKStrOfNe(xmax, dec);
	document.getElementById("fbscope_ymin").value=OKStrOfNe(ymin, dec);
	document.getElementById("fbscope_ymax").value=OKStrOfNe(ymax, dec);

	ResetCoordsFB();
}

//posem en blanc la variable Coord per la propera vegada que es defineixi un envoluant
function ResetCoordsFB () 
{
		CoordsFB.x1='';
		CoordsFB.y1='';
		CoordsFB.x2='';
		CoordsFB.y2='';
}


function CanviaEstatClickSobreVista(estat)
{
	ComprovaCalTancarFeedbackAmbScope(estat);
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixZRectangle));
	if(ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
		TancaFinestraLayer("editarVector");
	ParamCtrl.EstatClickSobreVista=estat;
	CanviaCursorSobreVista(null);
}

function CanviaEstatClickSobreVistaEvent(event, estat)
{
	CanviaEstatClickSobreVista(estat);
	dontPropagateEvent(event);
}

var MapTouchTypeIniciat=0;
function IniciDitsSobreVista(event, i_nova_vista)
{
/*https://stackoverflow.com/questions/11183174/simplest-way-to-detect-a-pinch/11183333#11183333*/
var i_vista;

	if (event.touches.length == 2 && MapTouchTypeIniciat == 0)
	{
    	MapTouchTypeIniciat = 2;
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientY)+DonaMargeSuperiorVista(i_nova_vista));
			showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		}
		ZRec_1PuntClient.x=(event.touches[1].clientX+event.touches[0].clientX)/2;
		ZRec_1PuntClient.y=(event.touches[1].clientY+event.touches[0].clientY)/2;
		ZRecSize_1Client.x=(event.touches[1].clientX-event.touches[0].clientX);
		ZRecSize_1Client.y=(event.touches[1].clientY-event.touches[0].clientY);
		HiHaHagutMoviment=false;
		return false;
	}
	MapTouchTypeIniciat==0;
	for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
	return true;
}

function MovimentDitsSobreVista(event, i_nova_vista)
{
var i_vista;

	if (MapTouchTypeIniciat==2)
	{
		/*if (event.touches.length != 2)
		{
			MapTouchTypeIniciat==-1;
			setTimeout("MapTouchTypeIniciat=0", 900);
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
				hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
			return false;
		}*/
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientY)+DonaMargeSuperiorVista(i_nova_vista));
		}
		ZRecSize_2Client.x=(event.touches[1].clientX-event.touches[0].clientX);
		ZRecSize_2Client.y=(event.touches[1].clientY-event.touches[0].clientY);
		PanVistes((event.touches[1].clientX+event.touches[0].clientX)/2, (event.touches[1].clientY+event.touches[0].clientY)/2, ZRec_1PuntClient.x, ZRec_1PuntClient.y);
		HiHaHagutMoviment=true;
		//return false;
	}
	return false;
}

function FiDitsSobreVista(event, i_nova_vista)
{
var i_vista, ratio={x:0, y:0};

	if (MapTouchTypeIniciat==2)
	{
		MapTouchTypeIniciat=-1;
		setTimeout("MapTouchTypeIniciat=0;", 200);
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		if (event.touches.length==1)  //The user has removed one finger and the 2 fingers event has concluded.
		{
			//unfortunatelly the data form the event is not useful now because we cannot get the two fingers possition.
			//This is why there has been stored in advance.
			if (!HiHaHagutMoviment || ZRecSize_1Client.x==0 || ZRecSize_1Client.y==0 || ZRecSize_2Client.x==0 || ZRecSize_2Client.y==0)
				return;
			ratio.x=ZRecSize_1Client.x/ZRecSize_2Client.x;
			ratio.y=ZRecSize_1Client.y/ZRecSize_2Client.y;
			if (ratio.x<0)
				ratio.x=-ratio.x;
			if (ratio.y<0)
				ratio.y=-ratio.y;

			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.x)-(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)/2*ratio.x;
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.x)+(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)/2*ratio.x;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.y)-(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)/2*ratio.y;
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.y)+(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)/2*ratio.y;
			if (ParamCtrl.ConsultaTipica)
				PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
			PortamAAmbit(AmbitZoomRectangle);
			//alert("Fer la feina!");
			return false;
		}
		return true;
	}
	return true;
}


function IniciClickSobreVistaUnSolClic(event, i_nova_vista)
{
/* http://unixpapa.com/js/mouse.html*/

	HiHaHagutPrimerClick=true;
	if (ParamCtrl.EstatClickSobreVista!="ClickPan2" && ParamCtrl.EstatClickSobreVista!="ClickZoomRec2" && ParamCtrl.EstatClickSobreVista!="ClickNovaVista2")
		HiHaHagutMoviment=false;
	if (ParamCtrl.EstatClickSobreVista=="ClickPan1" || ParamCtrl.EstatClickSobreVista=="ClickZoomRec1" || (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" && i_nova_vista==NovaVistaPrincipal))
	{
		if (event.which == null)
		{
			if (event.button==1)
				ClickSobreVista(event, i_nova_vista);
		}
		else
		{
			if (event.which==1)
				ClickSobreVista(event, i_nova_vista);
		}
	}
}

function IniciClickSobreVista(event, i_nova_vista)
{
	if (ParamCtrl.ZoomUnSolClic)
	   	IniciClickSobreVistaUnSolClic(event, i_nova_vista);
}


var NPanVista=0;

function PanVistes(cx, cy, cx_ori, cy_ori)
{
var w,xm,xc,h,ym,yc;
var elem;
var i_pan_vista;

	xm=DonaMargeEsquerraVista(-1)+1+cx-cx_ori;
	//alert(OrigenEsquerraVista+ " " +cx +"  " +cx_ori);
	if (cx_ori>cx)
	{
		w=ParamInternCtrl.vista.ncol-cx_ori+cx;
		xc=cx_ori-cx;
	}
	else
	{
		w=ParamInternCtrl.vista.ncol-cx+cx_ori;
		xc=0;
	}

	ym=DonaMargeSuperiorVista(-1)+1+cy-cy_ori;
	if (cy_ori>cy)
	{
		h=ParamInternCtrl.vista.nfil-cy_ori+cy;
		yc=cy_ori-cy;
	}
	else
	{
		h=ParamInternCtrl.vista.nfil-cy+cy_ori;
		yc=0;
	}

	NPanVista++;
	i_pan_vista=NPanVista;

	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		for (var i=0; i<ParamCtrl.capa.length; i++)
		{
			if (i_pan_vista!=NPanVista)
				return;
			var capa=ParamCtrl.capa[i];
			if (capa.model==model_vector)
			{
				//if (capa.visible!="no" &&  EsObjDigiVisibleAAquestNivellDeZoom(capa))
				if (EsCapaVisibleAAquestNivellDeZoom(capa) &&  EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					if ((!capa.objectes || !capa.objectes.features) && !HiHaObjectesNumericsAAquestNivellDeZoom(capa))						
						continue;
					elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa"+i);
					moveLayer(elem, xm, ym, ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil);
					clipLayer(elem, xc, yc, w, h);
				}
		    }
			else
			{
				if (EsCapaVisibleAAquestNivellDeZoom(capa) &&  EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i);
					if ((DonaTipusServidorCapa(capa)=="TipusWMS_C" || DonaTipusServidorCapa(capa)=="TipusWMTS_REST" || DonaTipusServidorCapa(capa)=="TipusWMTS_KVP"
						|| DonaTipusServidorCapa(capa)=="TipusWMTS_SOAP" || DonaTipusServidorCapa(capa)=="TipusOAPI_MapTiles"/* || DonaTipusServidorCapa(capa)=="TipusGoogle_KVP"*/) && capa.VistaCapaTiled.TileMatrix)
					{
						moveLayer(elem, xm-capa.VistaCapaTiled.dx, ym-capa.VistaCapaTiled.dy, ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil);
						clipLayer(elem, xc+capa.VistaCapaTiled.dx, yc+capa.VistaCapaTiled.dy, w, h);
					}
					else
					{
						moveLayer(elem, xm, ym, ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil);
						clipLayer(elem, xc, yc, w, h);
					}
				}
			}
		}
	}
}

function MovimentSobreVista(event_de_moure, i_nova_vista)
{
	var x=DonaCoordXDeCoordSobreVista(event_de_moure.target.parentElement, i_nova_vista, event_de_moure.clientX);
	var y=DonaCoordYDeCoordSobreVista(event_de_moure.target.parentElement, i_nova_vista, event_de_moure.clientY);
	MostraValorDeCoordActual(i_nova_vista, x, y);
	if (ParamCtrl.ZoomUnSolClic && HiHaHagutPrimerClick &&
	    ParamCtrl.EstatClickSobreVista!="ClickZoomRec1" && ParamCtrl.EstatClickSobreVista!="ClickZoomRec2" &&
		ParamCtrl.EstatClickSobreVista!="ClickRecFB1" && ParamCtrl.EstatClickSobreVista!="ClickRecFB2" &&
        ParamCtrl.EstatClickSobreVista!="ClickNovaVista1" && ParamCtrl.EstatClickSobreVista!="ClickNovaVista2" &&
	    ParamCtrl.EstatClickSobreVista!="ClickPan1" && ParamCtrl.EstatClickSobreVista!="ClickPan2" &&
		ParamCtrl.EstatClickSobreVista!="ClickEditarPunts" &&
		ParamCtrl.EstatClickSobreVista!="ClickMouMig" &&
		ParamCtrl.EstatClickSobreVista!="ClickConLoc")
	{
		ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
		CreaBarra(null);
		ClickSobreVista(event_de_moure);
	}

	if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec2" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2" || ParamCtrl.EstatClickSobreVista=="ClickRecFB2")
	{
		for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixZRectangle),
				DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.x)+DonaMargeEsquerraVista(i_nova_vista),
				DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.y)+DonaMargeSuperiorVista(i_nova_vista),
				DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event_de_moure.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event_de_moure.clientY)+DonaMargeSuperiorVista(i_nova_vista));
		HiHaHagutMoviment=true;
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan2")
	{
		PanVistes(event_de_moure.clientX, event_de_moure.clientY, ZRec_1PuntClient.x, ZRec_1PuntClient.y);
		HiHaHagutMoviment=true;
	}
}

function CreaAtribucioVista()
{
var elem=getLayer(window, "atribucio");

	if (isLayer(elem))
	{
		var cdns=[], atrib=[], i, j;

		cdns.push("<table style=\"width: 100%\"><tr><td align=\"right\"><span class=\"atribucio\">MiraMon<sup>&copy;</sup>");
		if (ParamCtrl.capa && ParamCtrl.capa.length)
		{
			for (i=0; i<ParamCtrl.capa.length; i++)
			{
				var capa=ParamCtrl.capa[i];
				if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(0/*i_vista*/, i) && capa.atribucio)
					atrib.push(DonaCadena(capa.atribucio));
			}
		}
		for (i=0; i<atrib.length; i++)
		{
			for (j=0; j<i; j++)
			{
				if (atrib[i]==atrib[j])
				{
					atrib.splice(i,1);  //Elimino el repetit.
					i--;
					break;
				}
			}
		}
		if (atrib.length)
			cdns.push("|");
		cdns.push(atrib.join("; "), "</span></td></tr></table>");
		contentLayer(elem, cdns.join(""));
	}
}


function OmpleVistaCapa(nom_vista, vista, i)
{
var tipus=DonaTipusServidorCapa(ParamCtrl.capa[i]);
	if (tipus=="TipusWMS" || tipus=="TipusOAPI_Maps" || tipus=="TipusHTTP_GET")
	{
		//var image=eval("this.document." + nom_vista + "_i_raster"+i);  //Això no funciona pel canvas.
		var win=DonaWindowDesDeINovaVista(vista);
		CanviaImatgeCapa(win.document.getElementById(nom_vista + "_i_raster"+i), vista, i, -1, null, null, null);
	}
	else
		CreaMatriuCapaTiled(nom_vista, vista, i);
}

//Aquesta funció està en desús i només es fa servir pel video. Useu DonaRequestGetMap() directament. 'estil' és el nom de l'estil o null per fer servir l'estiu predeterminat a l'estructura.
// ·$· potser ni pel vídeo
function DonaNomImatge(i_capa, vista, estil, pot_semitrans, i_data)
{
var i_estil, capa=ParamCtrl.capa[i_capa];

	if (capa.estil && capa.estil.length)
	{
		for (i_estil=0; i_estil<capa.estil.length; i_estil++)
		{
			if (capa.estil[i_estil].nom==estil)
				break;
		}
		if (i_estil==capa.estil.length)
			i_estil=-1;
	}
	else
		i_estil=-1;

	var s=DonaRequestGetMap(i_capa, i_estil, pot_semitrans, vista.ncol, vista.nfil, vista.EnvActual, i_data, null);
	CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
	return s;
}

function onLoadCanviaImatge(event)
{
	CanviaEstatEventConsola(event, this.i_event, EstarEventTotBe);
	if (this.nom_funcio_ok)
	{
		if (this.funcio_ok_param!=null)
			this.nom_funcio_ok(this.funcio_ok_param);
		else
			this.nom_funcio_ok();
	}
}

function onErrorCanviaImatge(event)
{
	CanviaEstatEventConsola(event, this.i_event, EstarEventError);
	this.onload=null;
	this.src="1tran.gif";
}

function CanviaImatgeCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param)
{
var capa=ParamCtrl.capa[i_capa];

	if (EsCapaBinaria(capa))
		CanviaImatgeBinariaCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param);
	else
	{
		var url_dades=DonaRequestGetMap(i_capa, i_estil, true, vista.ncol, vista.nfil, vista.EnvActual, i_data, null);
		var url_dades_real=url_dades;
		if (window.doAutenticatedHTTPRequest && capa.access && capa.access.request && capa.access.request.indexOf("map")!=-1)
		{
			/*var authResponse=hello(capa.access.tokenType).getAuthResponse();
			if (IsAuthResponseOnline(authResponse))
			{
				if (authResponse.error)
				{
					alert(authResponse.error.message)
					return;
				}
				if (authResponse.error_description)
				{
					alert(authResponse.error_description)
					return;
				}
				url_dades_real+= "&" + "access_token=" + authResponse.access_token;
			}
			else*/
			if (null==(url_dades_real=AddAccessTokenToURLIfOnline(url_dades_real, capa.access)))
			{
				AuthResponseConnect(CanviaImatgeCapa, capa.access, imatge, vista, i_capa, i_estil, i_data, null, nom_funcio_ok, funcio_ok_param, null, null, null);
				return;
			}
		}
		if (DonaTipusServidorCapa(ParamCtrl.capa[i_capa])=="TipusOAPI_Maps")
			imatge.i_event=CreaIOmpleEventConsola("OAPI_Maps", i_capa, url_dades, TipusEventGetMap);
		else
			imatge.i_event=CreaIOmpleEventConsola("GetMap", i_capa, url_dades, TipusEventGetMap);
		if (nom_funcio_ok)
			imatge.nom_funcio_ok=nom_funcio_ok;
		if (typeof funcio_ok_param!=="undefined" && funcio_ok_param!=null)
			imatge.funcio_ok_param=funcio_ok_param;
		imatge.onerror=onErrorCanviaImatge;
		imatge.onload=onLoadCanviaImatge;

		imatge.src=url_dades_real;
	}
}

/* No puc fer servir aquestas funció donat que els PNG's progressius no es tornen a mostrar només fent un showLayer. Els torno a demanar sempre.
function CanviaImatgeCapaSiCal(imatge, i_capa)
{
	//Aquí no faig servir DonaCadenaLang() expressament. Si es canvia l'idioma mentre es mostre un "espereu_???.gif", aquest no és canviat pel nou idioma. De fet, això es podria fer durant el canvi d'idioma però és un detall massa insignificant.
	if ((ParamCtrl.capa[i_capa].transparencia && ParamCtrl.capa[i_capa].transparencia=="semitransparent") ||
		imatge.src.indexOf("espereu_cat.gif")!=-1 || imatge.src.indexOf("espereu_spa.gif")!=-1 || imatge.src.indexOf("espereu_eng.gif")!=-1|| imatge.src.indexOf("espereu_fre.gif")!=-1)
	{
	    for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
	}
}*/

function PrecarregaValorsArrayBinaryAtributSiCal(i_atribut, funcio, param)
{
var capa_digi=ParamCtrl.capa[param.i_capa];
var atribut=capa_digi.atributs[i_atribut];

	if (atribut.calcul && !atribut.FormulaConsulta)
		atribut.FormulaConsulta=DonaFormulaConsultaDesDeCalcul(atribut.calcul, param.i_capa, i_atribut);

	if (atribut.FormulaConsulta)
	{
		// Aquí hem de pensar que passa si hi ha v[] però encara no estan carregats.
		// En aquest punt es demanes les capes v[] per fer servir més tard una consulta per localització
		if (!param["v_carregat_"+i_atribut] && HiHaValorsNecessarisCapaFormulaconsulta(capa_digi, atribut.FormulaConsulta))
		{
			param["v_carregat_"+i_atribut]=true;
			CanviaImatgeBinariaCapa(null, param.vista, param.i_capa, i_atribut, -1, funcio, param);
			return true;
		}
	}
	param["v_carregat_"+i_atribut]=true;
	return false;
}

var ErrorInRenderingIconsPresented=false;

function OmpleVistaCapaDigi(nom_vista, vista, i_capa_digi)
{
	OmpleVistaCapaDigiIndirect({nom_vista: nom_vista, vista: vista, i_capa: i_capa_digi, carregant_geo: false/*, v_carregat_*: false*/})
}

function ActivaSombraFonts(ctx)
{
var shadowPrevi={blur: ctx.shadowBlur, offsetX: ctx.shadowOffsetX, offsetY: ctx.shadowOffsetY, color: ctx.shadowColor};
	ctx.shadowBlur=3;
	ctx.shadowOffsetX=1;
	ctx.shadowOffsetY=1;
	ctx.shadowColor="white";
	return shadowPrevi;
}

function DesactivaSombraFonts(ctx, shadowPrevi)
{
	ctx.shadowBlur=shadowPrevi.blur;
	ctx.shadowOffsetX=shadowPrevi.offsetX;
	ctx.shadowOffsetY=shadowPrevi.offsetY;
	ctx.shadowColor=shadowPrevi.color;
}

function PreparaCtxColorVoraOInterior(vista, capa_digi, feature, previ, ctx, ctx_style, estil_interior_o_vora, atribut, a, valor_min, ncolors, i_col, i_fil)
{
	var i_color, valor;
	if (!estil_interior_o_vora || !estil_interior_o_vora)
		return;
	previ[ctx_style]=ctx[ctx_style];
	if (typeof atribut==="undefined")
	{
		ctx[ctx_style]=estil_interior_o_vora.paleta.colors[0];
		return;
	}
	valor=DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa_digi, feature, atribut, i_col, i_fil);
	if (isNaN(valor))
	{
		ctx[ctx_style]="rgba(255,255,255,0)";
		return;
	}
	i_color=Math.floor(a*(valor-valor_min));
	if (i_color>=ncolors)
		i_color=ncolors-1;
	else if (i_color<0)
		i_color=0;
	ctx[ctx_style]=estil_interior_o_vora.paleta.colors[i_color];
}

function PintaCtxColorVoraIInterior(estil_vora, estil_interior, ctx, previ)
{
	if (estil_interior)
	{
		//https://stackoverflow.com/questions/13618844/polygon-with-a-hole-in-the-middle-with-html5s-canvas
		ctx.mozFillRule = 'evenodd'; //for old firefox 1~30
		ctx.fill('evenodd'); //for firefox 31+, IE 11+, chrome
	}
	if (estil_vora)
		ctx.stroke();
	if (estil_interior && estil_interior.paleta)
		ctx.fillStyle=previ.fillStyle;
	if (estil_vora && estil_vora.paleta)
		ctx.strokeStyle=previ.strokeStyle;
}

function TracaCoordenadesCanvasGeometriaLinia(ctx, geometry, env, ncol, nfil)
{
var lineString;

	for (var c2=0; c2<(geometry.type=="MultiLineString" ? geometry.coordinates.length : 1); c2++)
	{
		if (geometry.type=="MultiLineString")
			lineString=geometry.coordinates[c2];
		else
			lineString=geometry.coordinates;
		//cal sumar sempre 0.5 perquè la linia es traça a la cantonada d'un pixel i no pel mig segons he llegit.
		ctx.moveTo(Math.round((lineString[0][0]-env.MinX)/(env.MaxX-env.MinX)*ncol)+0.5,
			Math.round((env.MaxY-lineString[0][1])/(env.MaxY-env.MinY)*nfil)+0.5);
		for (var c1=1; c1<lineString.length; c1++)
		{
			ctx.lineTo(Math.round((lineString[c1][0]-env.MinX)/(env.MaxX-env.MinX)*ncol)+0.5,
				Math.round((env.MaxY-lineString[c1][1])/(env.MaxY-env.MinY)*nfil)+0.5);
		}
	}
}

function TracaCoordenadesCanvasGeometriaPoligon(ctx, geometry, env, ncol, nfil)
{
var polygon, lineString;

	for (var c3=0; c3<(geometry.type=="MultiPolygon" ? geometry.coordinates.length : 1); c3++)
	{
		if (geometry.type=="MultiPolygon")
			polygon=geometry.coordinates[c3];
		else
			polygon=geometry.coordinates;
		for (var c2=0; c2<polygon.length; c2++)
		{
			lineString=polygon[c2];
			ctx.moveTo(Math.round((lineString[0][0]-env.MinX)/(env.MaxX-env.MinX)*ncol)+0.5,
				Math.round((env.MaxY-lineString[0][1])/(env.MaxY-env.MinY)*nfil)+0.5);
			for (var c1=1; c1<lineString.length; c1++)
			{
				ctx.lineTo(Math.round((lineString[c1][0]-env.MinX)/(env.MaxX-env.MinX)*ncol)+0.5,
					Math.round((env.MaxY-lineString[c1][1])/(env.MaxY-env.MinY)*nfil)+0.5);
			}
		}
	}
}

async function loadVectorData(i_capa2, i_valor2, imatge, vista, i_capa, i_data2, i_estil2, i_valor, nom_funcio_ok, funcio_ok_param)
{
	//De moment aiò només està ben implementat per capes vectorials que ja estan carregades.
	//Cal pensar que passa si els objectes encara no s'han carregat. Cal cridar la carrega dels vectors de manera assincrona 
	//aquí abans de cridar el dibuixat de la capa oculta amb un await.
	var objOculta = DonaObjCapaComABinaryArray(vista, i_capa2, ParamCtrl.capa[i_capa2].objectes);
	ParamCtrl.capa[i_capa].valors[i_valor].datatype=objOculta.datatype;
	ParamCtrl.capa[i_capa].valors[i_valor].nodata=[objOculta.nodata];
	return {dades: objOculta.arrayBuffer, extra_param: {imatge: imatge, vista: vista, i_capa: i_capa, i_data: i_data2, i_estil: i_estil2, i_valor: i_valor, nom_funcio_ok: nom_funcio_ok, funcio_ok_param: funcio_ok_param}};
}

/*Només dibuixa objectes de tipus polígon.
Conté l'index de objectes.features representat (l'identificador gràfic). 
El tipus de dades i el nodata depenen de objetes.features.length. 
* Si és <256, es un Uint8 i el 255 és el nodata; 
* si és <65536 es un Uint16 i el nodata és el 65535; 
* i si és <16777216 és un Uint32 i el nodata és el 16777215.*/
function DonaObjCapaComABinaryArray(vista, i_capa, objectes)
{
var env=vista.EnvActual;
var capa=ParamCtrl.capa[i_capa];
var feature, geometry;
var nom_canvas_ocult=DonaNomCanvasCapaDigi(ParamCtrl.VistaPermanent[0].nom, -i_capa-1);
var canvas_ocult = window.document.getElementById(nom_canvas_ocult);
var ctx_ocult = canvas_ocult.getContext('2d');
var arrayBuffer, array_uint, datatype, nodata, mida=canvas_ocult.width*canvas_ocult.height;

	//if (estil.TipusObj=='P')

	if (objectes.features.length<256)
	{
		//Cal canviar això per el arraybuffer que hi ha a valors[i]
		arrayBuffer = new ArrayBuffer(canvas_ocult.width*canvas_ocult.height);
		datatype = "uint8";
		nodata = 255;
		array_uint = new Uint8Array(arrayBuffer);
	}
	else if (objectes.features.length<65536)
	{
		arrayBuffer = new ArrayBuffer(canvas_ocult.width*canvas_ocult.height*2);
		datatype = "uint16";
		nodata = 65535;
		array_uint = new Uint16Array(arrayBuffer);
	}
	else //if (objectes.features.length<16777216)
	{
		arrayBuffer = new ArrayBuffer(canvas_ocult.width*canvas_ocult.height*4);
		datatype = "uint32";
		nodata = 16777215;
		array_uint = new Uint32Array(arrayBuffer);
	}
	array_uint.fill(nodata);
	
	//for (var j=0; j<objectes.features.length-1; j++)
	for (var j=objectes.features.length-1; j>=0; j--)
	{
		ctx_ocult.clearRect(0, 0, canvas_ocult.width, canvas_ocult.height);  //els 4 bytes a 0 incloent opacitat que serà la meva marca de nodata.
		feature=objectes.features[j];
		geometry=DonaGeometryCRSActual(feature, capa.CRSgeometry);
		if (geometry.type=="Polygon" || geometry.type=="MultiPolygon")
		{
			ctx_ocult.beginPath();
			ctx_ocult.fillStyle="rgba(255,255,255,1)";
			//https://stackoverflow.com/questions/13618844/polygon-with-a-hole-in-the-middle-with-html5s-canvas
			TracaCoordenadesCanvasGeometriaPoligon(ctx_ocult, geometry, env, vista.ncol, vista.nfil);
			ctx_ocult.mozFillRule = 'evenodd'; //for old firefox 1~30
			ctx_ocult.fill('evenodd'); //for firefox 31+, IE 11+, chrome
			var imgData = ctx_ocult.getImageData(0, 0, canvas_ocult.width, canvas_ocult.height);	
			for (var i=0; i<mida; i++)
			{
				if (imgData.data[i*4+3]!=0)
					array_uint[i]=j;
			}
		}
	}
	return {arrayBuffer: arrayBuffer, datatype: datatype, nodata: nodata};
}

function DibuixaObjCapaDigiAVista(param, neteja_canvas, atributs, objectes, estil)
{	
var nom_vista=param.nom_vista, vista=param.vista;
var capa=ParamCtrl.capa[param.i_capa];
var env=vista.EnvActual;
var i, i_atri_sel, i_atri_interior=[], i_atri_vora=[];
var i_simb, simbols, i_simbol, i_forma, forma;

	if (!objectes || !objectes.features || !estil)
		return;
		
	// Primer fem la precàrrega dels valors dels atributs que necessitem per simbolitzar els objectes
	if (estil.simbols && estil.simbols.length)
	{
		for (i_simb=0; i_simb<estil.simbols.length; i_simb++)
		{
			simbols=estil.simbols[i_simb];
			if (simbols.NomCamp)
			{
				//Precàrrega de valors si hi ha referències ràster.
				i=DonaIAtributsDesDeNomAtribut(capa, atributs, simbols.NomCamp)
				if (i==-1)
				{
					AlertaNomAtributIncorrecteSimbolitzar(simbols.NomCamp, "simbols.NomCamp", capa);
					return ;
				}
				if (PrecarregaValorsArrayBinaryAtributSiCal(i, OmpleVistaCapaDigiIndirect, param))
					return;
			}
			if (simbols.NomCampFEscala)
			{
				//Precàrrega de valors si hi ha referències ràster.
				i=DonaIAtributsDesDeNomAtribut(capa, atributs, simbols.NomCampFEscala)
				if (i==-1)
				{
					AlertaNomAtributIncorrecteSimbolitzar(simbols.NomCampFEscala, "simbols.NomCampFEscala", capa);
					return ;
				}
				if (PrecarregaValorsArrayBinaryAtributSiCal(i, OmpleVistaCapaDigiIndirect, param))
					return;
			}
		}
	}
	if (estil.NomCampSel)
	{
		//Precàrrega de valors de la selecció
		i_atri_sel=DonaIAtributsDesDeNomAtribut(capa, atributs, estil.NomCampSel)
		if (i_atri_sel==-1)
		{
			AlertaNomAtributIncorrecteSimbolitzar(estil.NomCampSel, "estil.NomCampSel", capa);
			return ;
		}
		if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_sel, OmpleVistaCapaDigiIndirect, param))
			return;
	}
	if (estil.formes && estil.formes.length)
	{
		for (i_forma=0; i_forma<estil.formes.length; i_forma++)
		{
			forma=estil.formes[i_forma];
			if (forma.interior && forma.interior.NomCamp)
			{
				//Precàrrega de valors si hi ha referències ràster.
				i_atri_interior[i_forma]=DonaIAtributsDesDeNomAtribut(capa, atributs, forma.interior.NomCamp)
				if (i_atri_interior[i_forma]==-1)
				{
					AlertaNomAtributIncorrecteSimbolitzar(forma.interior.NomCamp, "forma.interior.NomCamp", capa);
					return ;
				}
				if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_interior[i_forma], OmpleVistaCapaDigiIndirect, param))
					return;
			}
			if (forma.vora && forma.vora.NomCamp)
			{
				//Precàrrega de valors si hi ha referències ràster.
				i_atri_vora[i_forma]=DonaIAtributsDesDeNomAtribut(capa, atributs, forma.vora.NomCamp)
				if (i_atri_vora[i_forma]==-1)
				{
					AlertaNomAtributIncorrecteSimbolitzar(forma.vora.NomCamp, "forma.vora.NomCamp", capa);
					return ;
				}
				if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_vora[i_forma], OmpleVistaCapaDigiIndirect, param))
					return;
			}
		}
	}
	if (HiHaSimbolitzacioIndexadaPerPropietats(estil))
	{
		if (DescarregaPropietatsCapaDigiVistaSiCal(OmpleVistaCapaDigiIndirect, param))
			return;  //ja es tornarà a cridar a si mateixa quan la crida assíncrona acabi
	}
	
	// Ja tenim tot el que necessitem i anem a dibuixar els objectes
	var previ={}, a_vmin_ncol_interior=[], a_vmin_ncol_interiorSel=[], un_a_vmin_ncol_interior, valor, a_vmin_ncol_vora=[], a_vmin_ncol_voraSel=[], un_a_vmin_ncol_vora, forma_interior, forma_vora;
	var nom_canvas=DonaNomCanvasCapaDigi(nom_vista, param.i_capa);
	var env_icona, i_col, i_fil, simbol, icona, font, mida, text, coord, geometry;
	var win = DonaWindowDesDeINovaVista(vista);
	var canvas = win.document.getElementById(nom_canvas);
	var ctx = canvas.getContext('2d');
	if(neteja_canvas)
		ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (estil.formes && estil.formes.length)
	{
		for (i_forma=0; i_forma<estil.formes.length; i_forma++)
		{
			forma=estil.formes[i_forma];
			if (forma.interior && forma.interior.paleta)
			{
				a_vmin_ncol_interior[i_forma]={};
				a_vmin_ncol_interior[i_forma].ncolors=forma.interior.paleta.colors.length;
				a_vmin_ncol_interior[i_forma].a=DonaFactorAEstiramentPaleta(forma.interior.estiramentPaleta, a_vmin_ncol_interior[i_forma].ncolors);
				a_vmin_ncol_interior[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.interior.estiramentPaleta);
			}
			if (forma.interiorSel && forma.interiorSel.paleta)
			{
				a_vmin_ncol_interiorSel[i_forma]={};
				a_vmin_ncol_interiorSel[i_forma].ncolors=forma.interiorSel.paleta.colors.length;
				a_vmin_ncol_interiorSel[i_forma].a=DonaFactorAEstiramentPaleta(forma.interiorSel.estiramentPaleta, a_vmin_ncol_interiorSel[i_forma].ncolors);
				a_vmin_ncol_interiorSel[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.interiorSel.estiramentPaleta);
			}
			if (forma.vora && forma.vora.paleta)
			{
				a_vmin_ncol_vora[i_forma]={};
				a_vmin_ncol_vora[i_forma].ncolors=forma.vora.paleta.colors.length;
				a_vmin_ncol_vora[i_forma].a=DonaFactorAEstiramentPaleta(forma.vora.estiramentPaleta, a_vmin_ncol_vora[i_forma].ncolors);
				a_vmin_ncol_vora[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.vora.estiramentPaleta);
			}
			if (forma.voraSel && forma.voraSel.paleta)
			{
				a_vmin_ncol_voraSel[i_forma]={};
				a_vmin_ncol_voraSel[i_forma].ncolors=forma.voraSel.paleta.colors.length;
				a_vmin_ncol_voraSel[i_forma].a=DonaFactorAEstiramentPaleta(forma.voraSel.estiramentPaleta, a_vmin_ncol_voraSel[i_forma].ncolors);
				a_vmin_ncol_voraSel[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.voraSel.estiramentPaleta);
			}
		}
	}

	var feature;	
	for (var j=objectes.features.length-1; j>=0; j--)
	{
		feature=objectes.features[j];
		geometry=DonaGeometryCRSActual(feature, capa.CRSgeometry);
		if (geometry.type=="LineString" || geometry.type=="MultiLineString")
		{
			if (!estil.formes)
				alert("No symbology for lineString found: 'formes' found");
			else
			{
				for (i_forma=0; i_forma<estil.formes.length; i_forma++)
				{
					forma=estil.formes[i_forma];
					if (vista.i_nova_vista!=NovaVistaImprimir && feature.seleccionat==true && forma.voraSel)  //Sistema que feiem servir per l'edició
					{
						forma_vora=forma.voraSel;
						un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
					}
					else if (estil.NomCampSel)
					{
						if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa, feature, atributs[i_atri_sel], i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
						{
							if (forma.voraSel)
							{
								forma_vora=forma.voraSel;
								un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
							}
							else
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
						}
						else
						{
							if (forma.voraSel)
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							else
							{
								forma_vora=null;
								un_a_vmin_ncol_vora=null;
							}
						}
					}
					else
					{
						forma_vora=forma.vora;
						un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
					}

					if (!forma_vora)
						continue;
					PreparaCtxColorVoraOInterior(vista, capa, feature, previ, ctx, "strokeStyle", forma_vora, atributs[i_atri_vora[i_forma]], un_a_vmin_ncol_vora.a, un_a_vmin_ncol_vora.valor_min, un_a_vmin_ncol_vora.ncolors, i_col, i_fil);
					if (!forma_vora.gruix || !forma_vora.gruix.amples || !forma_vora.gruix.amples.length)
						ctx.lineWidth = 1;
					else
						ctx.lineWidth = forma_vora.gruix.amples[0];

					ctx.beginPath();
					if (!forma_vora.patro || !forma_vora.patro.separacions || !forma_vora.patro.separacions.length)
						ctx.setLineDash([]);
					else
						ctx.setLineDash(forma_vora.patro.separacions[0]);

					TracaCoordenadesCanvasGeometriaLinia(ctx, geometry, env, vista.ncol, vista.nfil);
					PintaCtxColorVoraIInterior(forma_vora, null, ctx, previ);
				}
			}
		}
		else if (geometry.type=="Polygon" || geometry.type=="MultiPolygon")
		{
			//http://stackoverflow.com/questions/13618844/polygon-with-a-hole-in-the-middle-with-html5s-canvas
			if (!estil.formes)
				alert("No symbology for polygon found: 'formes' found");
			else
			{
				for (i_forma=0; i_forma<estil.formes.length; i_forma++)
				{
					forma=estil.formes[i_forma];
					if (vista.i_nova_vista!=NovaVistaImprimir && feature.seleccionat==true && (forma.voraSel || forma.interiorSel))  //Sistema que feiem servir per l'edició
					{
						forma_vora=forma.voraSel ? forma.voraSel : forma.vora;
						un_a_vmin_ncol_vora=forma.voraSel ? a_vmin_ncol_voraSel[i_forma] : a_vmin_ncol_vora[i_forma];
						forma_interior=forma.interiorSel ? forma.interiorSel : forma.interior;
						un_a_vmin_ncol_interior=forma.interiorSel ? a_vmin_ncol_interiorSel[i_forma] : a_vmin_ncol_interior[i_forma];
					}
					else if (estil.NomCampSel)
					{
						if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa, feature, atributs[i_atri_sel], i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
						{
							if (forma.voraSel)
							{
								forma_vora=forma.voraSel;
								un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
							}
							else
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							if (forma.interiorSel)
							{
								forma_interior=forma.interiorSel;
								un_a_vmin_ncol_interior=a_vmin_ncol_interiorSel[i_forma];
							}
							else
							{
								forma_interior=forma.interior;
								un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
							}
						}
						else
						{
							if (forma.voraSel)
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							else
							{
								forma_vora=null;
								un_a_vmin_ncol_vora=null;
							}
							if (forma.interiorSel)
							{
								forma_interior=forma.interior;
								un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
							}
							else
							{
								forma_interior=null;
								un_a_vmin_ncol_interior=null;
							}
						}
					}
					else
					{
						forma_vora=forma.vora;
						un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
						forma_interior=forma.interior;
						un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
					}

					if (!forma_vora && !forma_interior)
						continue;
					if (forma_interior)
						PreparaCtxColorVoraOInterior(vista, capa, feature, previ, ctx, "fillStyle", forma_interior, atributs[i_atri_interior[i_forma]], un_a_vmin_ncol_interior.a, un_a_vmin_ncol_interior.valor_min, un_a_vmin_ncol_interior.ncolors, i_col, i_fil);
					if (forma_vora)
					{
						PreparaCtxColorVoraOInterior(vista, capa, feature, previ, ctx, "strokeStyle", forma_vora, atributs[i_atri_vora[i_forma]], un_a_vmin_ncol_vora.a, un_a_vmin_ncol_vora.valor_min, un_a_vmin_ncol_vora.ncolors, i_col, i_fil);

						if (!forma_vora.gruix || !forma_vora.gruix.amples || !forma_vora.gruix.amples.length)
							ctx.lineWidth = 1;
						else
							ctx.lineWidth = forma_vora.gruix.amples[0];
					}
					ctx.beginPath();
					if (forma_vora)
					{
						if (!forma_vora.patro || !forma_vora.patro.separacions || !forma_vora.patro.separacions.length)
							ctx.setLineDash([]);
						else
							ctx.setLineDash(forma_vora.patro.separacions[0]);
					}
					TracaCoordenadesCanvasGeometriaPoligon(ctx, geometry, env, vista.ncol, vista.nfil);
					PintaCtxColorVoraIInterior(forma_vora, forma_interior, ctx, previ);
				}
			}
		}
		else if (geometry.type=="Point" || geometry.type=="MultiPoint")
		{
			for (var c1=0; c1<(geometry.type=="MultiPoint" ? geometry.coordinates.length : 1); c1++)
			{
				if (geometry.type=="MultiPoint")
					coord=geometry.coordinates[c1];
				else
					coord=geometry.coordinates;
				i_col=Math.round((coord[0]-env.MinX)/(env.MaxX-env.MinX)*vista.ncol);
				i_fil=Math.round((env.MaxY-coord[1])/(env.MaxY-env.MinY)*vista.nfil);
				if (estil.simbols && estil.simbols.length)
				{
					for(i_simb=0; i_simb<estil.simbols.length; i_simb++)
					{
						simbols=estil.simbols[i_simb];
						if (simbols.simbol)
						{
							simbol=simbols.simbol;
							if (i_col<0 || i_col>vista.ncol || i_fil<0 || i_fil>vista.nfil)
								i_simbol=-1;  //Necessari per evitar formules que puguin contenir valors de raster.
							else if (simbol.length==1 && !simbols.NomCamp)
								i_simbol=0;
							else
								i_simbol=DeterminaISimbolObjecteCapaDigi(vista.i_nova_vista, capa, atributs, estil, feature, i_simb, i_col, i_fil);

							if (i_simbol!=-1)
							{
								if (vista.i_nova_vista!=NovaVistaImprimir && feature.seleccionat==true && simbol[i_simbol].IconaSel)  //Sistema que feiem servir per l'edició
									icona=simbol[i_simbol].IconaSel;
								else if (estil.NomCampSel)
								{
									if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa, feature, atributs[i_atri_sel], i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
										icona=(simbol[i_simbol].IconaSel ?simbol[i_simbol].IconaSel: simbol[i_simbol].icona);
									else
										icona=(simbol[i_simbol].IconaSel ?simbol[i_simbol].icona: null);
								}
								else
									icona=simbol[i_simbol].icona;

								if(icona)
								{
									if (simbols.NomCampFEscala)
									{
										icona.fescala=DeterminaValorObjecteCapaDigi(vista.i_nova_vista, capa, atributs, estil, feature, i_simb, i_col, i_fil, simbols.NomCampFEscala);
										if (typeof icona.fescala==="undefined" || isNaN(icona.fescala) || icona.fescala<=0)
											icona.fescala=-1;
									}
									else
										icona.fescala=1;

									if (icona.fescala>0)
										env_icona=DonaEnvIcona({x: coord[0],y: coord[1]}, icona);
									if (icona.fescala>0 && EsEnvDinsEnvolupant(env_icona, env))
									{
										//la layer l_obj_digi té les coordenades referides a la seva layer pare que és l_capa --> No he de considerar ni els marges de la vista ni els scrolls.
										//la manera de fer això està extreta de: http://stackoverflow.com/questions/6011378/how-to-add-image-to-canvas

										if (Array.isArray(icona))
										{
											alert("OmpleVistaCapaDigiIndirect() does not implement arrays of shapes yet");
										}
										else if (icona.type=="circle" || icona.type=="square")
										{
											if (!estil.formes)
												alert("No symbology for 'circle' or 'squere' was found: 'formes' is required");

											for (i_forma=0; i_forma<estil.formes.length; i_forma++)
											{
												forma=estil.formes[i_forma];

												if (vista.i_nova_vista!=NovaVistaImprimir && feature.seleccionat==true && (forma.voraSel || forma.interiorSel))  //Sistema que feiem servir per l'edició
												{
													forma_vora=forma.voraSel ? forma.voraSel : forma.vora;
													un_a_vmin_ncol_vora=forma.voraSel ? a_vmin_ncol_voraSel[i_forma] : a_vmin_ncol_vora[i_forma];
													forma_interior=forma.interiorSel ? forma.interiorSel : forma.interior;
													un_a_vmin_ncol_interior=forma.interiorSel ? a_vmin_ncol_interiorSel[i_forma] : a_vmin_ncol_interior[i_forma];
												}
												else if (estil.NomCampSel)
												{
													if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa, feature, atributs[i_atri_sel], i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
													{
														if (forma.voraSel)
														{
															forma_vora=forma.voraSel;
															un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
														}
														else
														{
															forma_vora=forma.vora;
															un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
														}
														if (forma.interiorSel)
														{
															forma_interior=forma.interiorSel;
															un_a_vmin_ncol_interior=a_vmin_ncol_interiorSel[i_forma];
														}
														else
														{
															forma_interior=forma.interior;
															un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
														}
													}
													else
													{
														if (forma.voraSel)
														{
															forma_vora=forma.vora;
															un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
														}
														else
														{
															forma_vora=null;
															un_a_vmin_ncol_vora=null;
														}
														if (forma.interiorSel)
														{
															forma_interior=forma.interior;
															un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
														}
														else
														{
															forma_interior=null;
															un_a_vmin_ncol_interior=null;
														}
													}
												}
												else
												{
													forma_vora=forma.vora;
													un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
													forma_interior=forma.interior;
													un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
												}

												if (!forma_vora && !forma_interior)
													continue;
												if (forma_interior)
													PreparaCtxColorVoraOInterior(vista, capa, feature, previ, ctx, "fillStyle", forma_interior, atributs[i_atri_interior[i_forma]], un_a_vmin_ncol_interior.a, un_a_vmin_ncol_interior.valor_min, un_a_vmin_ncol_interior.ncolors, i_col, i_fil);
												if (forma_vora)
													PreparaCtxColorVoraOInterior(vista, capa, feature, previ, ctx, "strokeStyle", forma_vora, atributs[i_atri_vora[i_forma]], un_a_vmin_ncol_vora.a, un_a_vmin_ncol_vora.valor_min, un_a_vmin_ncol_vora.ncolors, i_col, i_fil);
												if (!forma_vora || !forma_vora.gruix || !forma_vora.gruix.amples || !forma_vora.gruix.amples.length)
													ctx.lineWidth = 1;
												else
													ctx.lineWidth = forma_vora.gruix.amples[0];

												ctx.beginPath();
												if (!forma_vora || !forma_vora.patro || !forma_vora.patro.separacions || !forma_vora.patro.separacions.length)
													ctx.setLineDash([]);
												else
													ctx.setLineDash(forma_vora.patro.separacions[0]);

												mida=DonaMidaIconaForma(icona);
												if (icona.unitats=="m")
												{
													if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
														mida/=FactorGrausAMetres;
													mida/=ParamInternCtrl.vista.CostatZoomActual;
												}
												if (mida<=0)
													mida=1;
												if (icona.type=="square")
												{
													ctx.rect(i_col-icona.i-mida/2, i_fil-icona.j-mida/2, mida, mida);
												}
												else
													ctx.arc(i_col-icona.i, i_fil-icona.j, mida, 0, 2*Math.PI);

												PintaCtxColorVoraIInterior(forma_vora, forma_interior, ctx, previ);
											}
										}
										else
										{
											//Hi ha un problem extrany al intentar dibuixar una imatge sobre un canvas que està en un altre window. El problema ha estat analitzat aquí:
											//https://stackoverflow.com/questions/34402718/img-from-opener-is-not-img-type-for-canvas-drawimage-in-ie-causing-type-mismatch
											//In IE there is a problem "img from opener is not img type for canvas drawImage (DispHTMLImg, being HTMLImageElement instead) in IE causing TYPE_MISMATCH_ERR"
											//Després d'invertir dies, he estat incapaç de trobar una manera de resoldre això en IE i ha hagut de renunciar i fer un try an catch per sortir del pas. 2017-12-17 (JM)
											if (icona.img.sha_carregat==true)
											{
												try
												{
													ctx.drawImage(icona.img, (i_col-icona.i)*icona.fescala,
																(i_fil-icona.j)*icona.fescala, icona.img.ncol*icona.fescala, icona.img.nfil*icona.fescala);
												}
												catch (e)
												{
													if (!ErrorInRenderingIconsPresented)
													{
														if (e.message=="TypeMismatchError")
															win.alert("In Internet Explorer is not possible to render icons when printing. We recommed to print with Chrome or to deactivate layers with icons (" + e.message +")");
														else
															win.alert(e.message);
														ErrorInRenderingIconsPresented=true;
													}
												}
											}
											else if (!icona.img.hi_ha_hagut_error || icona.img.hi_ha_hagut_error==false)
											{
												//the icon is not available yet. Let's wait sometime and repeat this
												setTimeout("OmpleVistaCapaDigi(\"" + nom_vista + "\", " + JSON.stringify(vista) + ", " + param.i_capa + ");", 600);
												return;
											}
										}
									}
								}
							}
						}
					}
				}
				if (estil.fonts)
				{
					if (env.MinX < coord[0] &&
						env.MaxX > coord[0] &&
						env.MinY < coord[1] &&
						env.MaxY > coord[1])
					{
						valor=DeterminaTextValorObjecteCapaDigi(vista.i_nova_vista, capa, atributs, estil, feature, i_simb, i_col, i_fil, estil.fonts.NomCampText);
						if (typeof valor!=="undefined" && (typeof valor!=="string" || valor!="") && (typeof valor!=="number" || !isNaN(valor)))
						{
							previ.shadow=ActivaSombraFonts(ctx);
							if(estil.fonts.aspecte.length==1)
								font=estil.fonts.aspecte[0].font;
							else
								font=estil.fonts.aspecte[feature.i_aspecte].font;  //No acabat implementar encara. Caldria generar index d'estils a cada objecte.
							ctx.font=font.font;
							if (font.color)
							{
								previ.fillStyle=ctx.fillStyle;
								ctx.fillStyle=font.color;
							}
							if (font.align)
								ctx.textAlign=font.align;
							ctx.fillText(valor, i_col-font.i, i_fil-font.j);
							if (font.color)
								ctx.fillStyle=previ.fillStyle;
							DesactivaSombraFonts(ctx, previ.shadow);
						}
					}
				}
			}
		}
		else
		{
			alert("Type of feature geometry: " + geometry.type + " not supported yet");
		}
	}
	return;
}


function DeterminaEstilObjNumerics(estil)
{
	if((typeof estil.estilTilesObjNum === "undefined") || estil.estilTilesObjNum==null)
	{
		return {
			"simbols": [{"simbol": [{ "icona" : {"type": "circle", "r": 20}}]}],
			"formes":[{"interior": {"paleta":{"colors":["#FF0000"]}}, "vora": {"paleta":{"colors":["#000000"]}, "gruix": 1}}],
			"fonts":{"NomCampText": nom_camp_nObjs_tessella, "aspecte":[{"font":{"font":"10px Verdana", "i":10, "j":-2}}]},
		};	
	}
	return estil.estilTilesObjNum;		
}

function OmpleVistaCapaDigiIndirect(param)
{
var nom_vista=param.nom_vista, vista=param.vista;
var capa=ParamCtrl.capa[param.i_capa];
var env=vista.EnvActual;
var neteja_canvas=true;

	if (capa.model!=model_vector)
		return;

	if(DonaTipusServidorCapa(capa))
	{
		if(DemanaTilesDeCapaDigitalitzadaSiCal(capa, env, OmpleVistaCapaDigiIndirect, param))
			return;
		if(DemanaCSVPropietatsObjectesDeCapaDigitalitzadaSiCal(capa, env, OmpleVistaCapaDigiIndirect, param))
			return;		
	}
	// Si la capa és tessel·lada, dibuixo l'array d'objectes numèrics (un objecte amb el nombre d'objectes que conté la tessel·la si és superior al límit indicat)
	if((typeof capa.objLimit !== "undefined") && capa.objLimit!=-1 &&
		capa.tileMatrixSetGeometry && capa.tileMatrixSetGeometry.tileMatrix)
	{	
		var i_tileMatrix=DonaTileMatrixMesProperAZoomActual(capa);
		if(i_tileMatrix!=-1 && capa.tileMatrixSetGeometry.tileMatrix[i_tileMatrix].objNumerics && 
			capa.tileMatrixSetGeometry.tileMatrix[i_tileMatrix].objNumerics.features)
		{		
			var estil_obj_num=DeterminaEstilObjNumerics(capa.estil[capa.i_estil]);
			DibuixaObjCapaDigiAVista(param, neteja_canvas, capa.tileMatrixSetGeometry.atriObjNumerics, capa.tileMatrixSetGeometry.tileMatrix[i_tileMatrix].objNumerics, estil_obj_num);
			neteja_canvas=false;
		}		
	}
	if (capa.objectes && capa.objectes.features)
		DibuixaObjCapaDigiAVista(param, neteja_canvas, capa.atributs, capa.objectes, capa.estil[capa.i_estil]);
}

//Per la capa oculta cal cridar amb DonaNomCanvasCapaDigi(nom_vista, -i-1)  (l'index és negatiu i desplaçat en 1)
function DonaNomCanvasCapaDigi(nom_vista, i)
{
	if (i<0)
		return nom_vista + "_l_capa_" + (-i-1) + "_oculta_canvas";
	return nom_vista + "_l_capa_digi" + i + "_canvas";
}

function CreaCapaDigiLayer(nom_vista, i_nova_vista, i)
{
	if (i<0)
	{
		var vista=DonaVistaDesDeINovaVista(i_nova_vista);
		return textHTMLLayer(nom_vista+ "_l_capa_"+ (-i-1) + "_oculta", DonaMargeEsquerraVista(i_nova_vista)+1, DonaMargeSuperiorVista(i_nova_vista)+1,
						vista.ncol, vista.nfil,
						null, {scroll: "no", visible: false, ev: null, save_content: false}, null, "<canvas id=\"" + DonaNomCanvasCapaDigi(nom_vista, i	) + "\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>"); 
	}
	if (ParamCtrl.capa[i].visible!="no"/* && EsObjDigiVisibleAAquestNivellDeZoom(ParamCtrl.capa[i])*/)
	{
		var vista=DonaVistaDesDeINovaVista(i_nova_vista);
		return textHTMLLayer(nom_vista+"_l_capa"+i, DonaMargeEsquerraVista(i_nova_vista)+1, DonaMargeSuperiorVista(i_nova_vista)+1,
						vista.ncol, vista.nfil,
						null, {scroll: "no", visible: true, ev: null, save_content: false}, null, "<canvas id=\"" + DonaNomCanvasCapaDigi(nom_vista, i) + "\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>"); 
	}
	return "";
}

function OmpleMatriuVistaCapaTiled(i_capa, vista, i_tile_matrix_set)
{
var vista_tiled=ParamCtrl.capa[i_capa].VistaCapaTiled;

	var i_tile_matrix=DonaIndexTileMatrix(i_capa, i_tile_matrix_set, vista.CostatZoomActual);
	if (i_tile_matrix==-1)
	{
		vista_tiled.TileMatrix=null;
		return i_tile_matrix;
	}
	vista_tiled.TileMatrix=ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix];

	vista_tiled.ITileMin = floor_DJ((vista.EnvActual.MinX - vista_tiled.TileMatrix.TopLeftPoint.x) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileWidth));
	vista_tiled.ITileMax = floor_DJ((vista.EnvActual.MaxX - vista_tiled.TileMatrix.TopLeftPoint.x) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileWidth));
	vista_tiled.JTileMin = floor_DJ((vista_tiled.TileMatrix.TopLeftPoint.y - vista.EnvActual.MaxY) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileHeight));
	vista_tiled.JTileMax = floor_DJ((vista_tiled.TileMatrix.TopLeftPoint.y - vista.EnvActual.MinY) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileHeight));

	if (vista_tiled.ITileMin < 0) vista_tiled.ITileMin = 0;
	else if (vista_tiled.ITileMin >= vista_tiled.TileMatrix.MatrixWidth) vista_tiled.ITileMin = vista_tiled.TileMatrix.MatrixWidth - 1;
	if (vista_tiled.ITileMax < 0) vista_tiled.ITileMax = 0;
	else if (vista_tiled.ITileMax >= vista_tiled.TileMatrix.MatrixWidth) vista_tiled.ITileMax = vista_tiled.TileMatrix.MatrixWidth - 1;

	if (vista_tiled.JTileMin < 0) vista_tiled.JTileMin = 0;
	else if (vista_tiled.JTileMin >= vista_tiled.TileMatrix.MatrixHeight) vista_tiled.JTileMin = vista_tiled.TileMatrix.MatrixHeight - 1;
	if (vista_tiled.JTileMax < 0) vista_tiled.JTileMax = 0;
	else if (vista_tiled.JTileMax >= vista_tiled.TileMatrix.MatrixHeight) vista_tiled.JTileMax = vista_tiled.TileMatrix.MatrixHeight - 1;

	//Moc la layer, li canvio de mides i la tallo.
	vista_tiled.dx= floor_DJ((vista.EnvActual.MinX - (vista_tiled.TileMatrix.TopLeftPoint.x+vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileWidth*vista_tiled.ITileMin))/vista_tiled.TileMatrix.costat);
	vista_tiled.dy= floor_DJ(((vista_tiled.TileMatrix.TopLeftPoint.y-vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileHeight*vista_tiled.JTileMin) - vista.EnvActual.MaxY)/vista_tiled.TileMatrix.costat);
	return i_tile_matrix;
}

function AssignaDonaNomImatgeTiledASrc(nom_vista, i_capa, i_tile_matrix_set, i_tile_matrix, j, i)
{
	var capa=ParamCtrl.capa[i_capa];
	var img=window.document[nom_vista + "_i_raster"+ i_capa +"_"+ j +"_"+ i];
	var s=DonaNomImatgeTiled(i_capa, i_tile_matrix_set, i_tile_matrix, j, i, -1, true, null);
	var tipus=DonaTipusServidorCapa(capa);

	img.src=s;
	if (tipus=="TipusWMTS_REST")
		img.i_event=CreaIOmpleEventConsola("WMTS-REST, tiled", i_capa, s, TipusEventWMTSTile);
	else if (tipus=="TipusWMTS_KVP")
		img.i_event=CreaIOmpleEventConsola("WMTS-KVP, tiled", i_capa, s, TipusEventWMTSTile);
	else if (tipus=="TipusOAPI_MapTiles")
		img.i_event=CreaIOmpleEventConsola("OAPI_MapTiles", i_capa, s, TipusEventWMTSTile);
	else if (tipus=="TipusOAPI_Maps")
		img.i_event=CreaIOmpleEventConsola("OAPI_Maps", i_capa, s, TipusEventGetMap);
	else //wms-c
		img.i_event=CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);

	img.onload=onLoadCanviaImatge;
	img.onerror=onErrorCanviaImatge;
}

function CreaMatriuCapaTiled(nom_vista, vista, i_capa)
{
var cdns=[], vista_tiled=ParamCtrl.capa[i_capa].VistaCapaTiled;

	var i_tile_matrix_set=DonaIndexTileMatrixSetCRS(i_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	if (i_tile_matrix_set==-1)
	{
		window.document[nom_vista + "_i_raster"+i_capa].src=AfegeixAdrecaBaseSRC("1tran.gif");
		return;
	}
	var i_tile_matrix=OmpleMatriuVistaCapaTiled(i_capa, vista, i_tile_matrix_set);
	if(i_tile_matrix==-1)
	{
		window.document[nom_vista + "_i_raster"+i_capa].src=AfegeixAdrecaBaseSRC("1tran.gif");
		return;
	}
	var layer_vista=getLayer(window, nom_vista + "_l_capa"+i_capa);

	moveLayer(layer_vista, DonaMargeEsquerraVista(vista.i_nova_vista)+1-vista_tiled.dx, DonaMargeSuperiorVista(vista.i_nova_vista)+1-vista_tiled.dy, (vista_tiled.ITileMax-vista_tiled.ITileMin+1)*vista_tiled.TileMatrix.TileWidth, (vista_tiled.JTileMax-vista_tiled.JTileMin+1)*vista_tiled.TileMatrix.TileHeight);
	clipLayer(layer_vista, vista_tiled.dx, vista_tiled.dy, vista.ncol, vista.nfil);

	//Genero la taula
	cdns.push("<table style=\"border: 0px; border-collapse: collapse; padding: 0px;line-height:0px;\">");
	//cdns.push("<table border=0 cellspacing=0 cellpadding=0>");
	for (var j=vista_tiled.JTileMin; j<=vista_tiled.JTileMax; j++)
	{
		cdns.push(" <tr style=\"border: 0px; border-collapse: collapse; padding: 0px; height:",vista_tiled.TileMatrix.TileHeight,"px;\">");
		//cdns.push("  <tr cellspacing=0 cellpadding=0  height=",vista_tiled.TileMatrix.TileHeight,">");
		for (var i=vista_tiled.ITileMin; i<=vista_tiled.ITileMax; i++)
		{
			cdns.push("<td style=\"border: 0px; border-collapse: collapse; padding: 0px; width:", vista_tiled.TileMatrix.TileWidth,"px;\"><img name=\"", nom_vista, "_i_raster", i_capa, "_" , j , "_", i , "\" src=\"",
						AfegeixAdrecaBaseSRC("espereu_"+ParamCtrl.idioma+".gif"),"\" style=\"max-width:",vista_tiled.TileMatrix.TileWidth,"px;max-height:",vista_tiled.TileMatrix.TileHeight,"px;width:auto;height:auto;\"></td>");
		}
		cdns.push("  </tr>");
	}
	cdns.push("  </table>");

	contentLayer(layer_vista, cdns.join(""));

	//Carrego les imatges
	for (var j=vista_tiled.JTileMin; j<=vista_tiled.JTileMax; j++)
	{
		for (var i=vista_tiled.ITileMin; i<=vista_tiled.ITileMax; i++)
		{
			if (DonaTipusServidorCapa(ParamCtrl.capa[i_capa])=="TipusWMTS_SOAP")
			{
				//if(j==vista_tiled.JTileMin && i==vista_tiled.ITileMin)
				FesPeticioAjaxGetTileWMTS_SOAP(i_capa, null, i_tile_matrix_set, i_tile_matrix, j, i, null);  //NJ a JM: Perquè el estil i el i_data sempre són null en el WMTS??
			}
			else
			{
				//setTimeout("window.document." + nom_vista + "_i_raster"+ i_capa +"_"+ j +"_"+ i +".src=DonaNomImatgeTiled("+i_capa+", "+i_tile_matrix_set+", "+i_tile_matrix+", "+j+", "+i+", -1, true, null)", 75);
				setTimeout("AssignaDonaNomImatgeTiledASrc(\""+nom_vista+"\", "+i_capa+", "+i_tile_matrix_set+", "+i_tile_matrix+", "+j+", "+i+");");
			}
		}
	}
}

function DonaTextMatriuCapaTiledImprimir(i_capa, ncol, nfil, env)
{
var cdns=[], tile_matrix;

	//Donat que només és possible imprimir conservant la resolució.
	var i_tile_matrix_set=DonaIndexTileMatrixSetCRS(i_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

	if (i_tile_matrix_set==-1)
	{
		return "<img name=\"l_raster_print"+i_capa+"\" src=\""+
		AfegeixAdrecaBaseSRC("1tran.gif")+"\">";
	}
	var i_tile_matrix=DonaIndexTileMatrix(i_capa, i_tile_matrix_set, (env.MaxX-env.MinX)/ncol);
	if (i_tile_matrix==-1)
	{
		//ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix=null;
		return "<img name=\"l_raster_print"+i_capa+"\" src=\""+
		AfegeixAdrecaBaseSRC("1tran.gif")+"\">";
	}
	tile_matrix=ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix];

	var i_tile_min = floor_DJ((env.MinX - tile_matrix.TopLeftPoint.x) / (tile_matrix.costat*tile_matrix.TileWidth));
	var i_tile_max = floor_DJ((env.MaxX - tile_matrix.TopLeftPoint.x) / (tile_matrix.costat*tile_matrix.TileWidth));
	var j_tile_min = floor_DJ((tile_matrix.TopLeftPoint.y - env.MaxY) / (tile_matrix.costat*tile_matrix.TileHeight));
	var j_tile_max = floor_DJ((tile_matrix.TopLeftPoint.y - env.MinY) / (tile_matrix.costat*tile_matrix.TileHeight));

	if (i_tile_min < 0) i_tile_min = 0;
	else if (i_tile_min >= tile_matrix.MatrixWidth) i_tile_min = tile_matrix.MatrixWidth - 1;
	if (i_tile_max < 0) i_tile_max = 0;
	else if (i_tile_max >= tile_matrix.MatrixWidth) i_tile_max = tile_matrix.MatrixWidth - 1;

	if (j_tile_min < 0) j_tile_min = 0;
	else if (j_tile_min >= tile_matrix.MatrixHeight) j_tile_min = tile_matrix.MatrixHeight - 1;
	if (j_tile_max < 0) j_tile_max = 0;
	else if (j_tile_max >= tile_matrix.MatrixHeight) j_tile_max = tile_matrix.MatrixHeight - 1;

	//Moc la layer, li canvio de mides i la tallo.
	var dx= floor_DJ((env.MinX - (tile_matrix.TopLeftPoint.x+tile_matrix.costat*tile_matrix.TileWidth*i_tile_min))/tile_matrix.costat);
	var dy= floor_DJ(((tile_matrix.TopLeftPoint.y-tile_matrix.costat*tile_matrix.TileHeight*j_tile_min) - env.MaxY)/tile_matrix.costat);

	var layer_vista=getLayer(winImprimir, "l_raster_print"+i_capa);

	moveLayer(layer_vista, -dx, -dy, (i_tile_max-i_tile_min+1)*tile_matrix.TileWidth, (j_tile_max-j_tile_min+1)*tile_matrix.TileHeight);
	clipLayer(layer_vista, dx, dy, ncol, nfil);

	//Genero la taula
	//NJ a JM: cal fer alguna modificació aquí també perquè funcioni correctament la impressió en SOAP
	cdns.push("<table style=\"border: 0px; border-spacing: 0px; padding: 0px; line-height:0px;\">");	
	//cdns.push("<table border=0 cellspacing=0 cellpadding=0>");
	for (var j=j_tile_min; j<=j_tile_max; j++)
	{
		cdns.push(" <tr style=\"border: 0px; border-collapse: collapse; padding: 0px; height:",tile_matrix.TileHeight,"px;\">");
		//cdns.push("  <tr cellspacing=0 cellpadding=0 height=", tile_matrix.TileHeight ,">");
		for (var i=i_tile_min; i<=i_tile_max; i++)
		{
			cdns.push("<td style=\"border: 0px; border-collapse: collapse; padding: 0px; width:", tile_matrix.TileWidth,"px;\"><img name=\"i_raster", i_capa, "_" , j , "_", i , "\" src=");
						
			//cdns.push("<td width=", tile_matrix.TileWidth, "><img name=\"i_raster", i_capa, "_" , j , "_", i , "\"  src=");
			var s=DonaNomImatgeTiled(i_capa, i_tile_matrix_set, i_tile_matrix, j, i, -1, true, null);
			var i_event;
			if (DonaTipusServidorCapa(capa)=="TipusWMTS_REST")
				i_event=CreaIOmpleEventConsola("WMTS-REST, tiled", i_capa, s, TipusEventWMTSTile);
			else if (DonaTipusServidorCapa(capa)=="TipusWMTS_KVP")
				i_event=CreaIOmpleEventConsola("WMTS-KVP, tiled", i_capa, s, TipusEventWMTSTile);
			else if (DonaTipusServidorCapa(capa)=="TipusOAPI_MapTiles")
				i_event=CreaIOmpleEventConsola("OAPI_MapTiles", i_capa, s, TipusEventWMTSTile);
			else if (DonaTipusServidorCapa(capa)=="TipusOAPI_Maps")
				i_event=CreaIOmpleEventConsola("OAPI_Maps", i_capa, s, TipusEventGetMap);
			else //wms-c
				i_event=CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
			cdns.push(s);
			//cdns.push(DonaRequestGetMapTiled(i_capa, -1, true, tile_matrix.TileWidth, tile_matrix.TileHeight, i_tile_matrix_set, i_tile_matrix, j, i));
			cdns.push(" i_event=\""+i_event+"\" onLoad=\"onLoadCanviaImatge\" onError=\"onErrorCanviaImatge\"></td>");
		}
		cdns.push("  </tr>");
	}
	cdns.push("  </table>");

	return cdns.join("");
}

var AltTextCoordenada=18;
var AmpleTextCoordenada=85;

function CreaVistes()
{
	if (timeoutCreaVistes)
	{
		clearTimeout(timeoutCreaVistes);
		timeoutCreaVistes=null;
	}
	timeoutCreaVistes=setTimeout(CreaVistesImmediates, 10);
}

function CreaVistesImmediates()
{
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		CreaVistaImmediata(window, ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista);
	CanviaCursorSobreVista(null);
}

var NCreaVista=0;  //Guarda el nombre de vegades que he cridat CreaVistaImmediata(). D'aquesta manera puc detectar si he entrat a redibuixar quan encara estic redibuixant la vegada anterior i plegar immediatament de la vegada anterior.
var SufixSliderZoom="sliderzoom";    //No pot tenir subratllat al davant. Aquesta es pot desactivar
var SufixTelTrans="_tel_trans";    //Cal que porti el subratllat al davant. Aquesta no s'hauria de desactivar mai
var SufixZRectangle="_z_rectangle";  //Cal que porti el subratllat al davant.

var timeOutCapaVista={};

function CancellaTimeOutCapaVista(nom_vista, i_crea_vista)
{
	if (!timeOutCapaVista[nom_vista+"_"+i_crea_vista])
		return;
	for (var i=0; i<timeOutCapaVista[nom_vista+"_"+i_crea_vista].length; i++)
	{
		if (timeOutCapaVista[nom_vista+"_"+i_crea_vista][i])
		{
			clearTimeout(timeOutCapaVista[nom_vista+"_"+i_crea_vista][i]);
			timeOutCapaVista[nom_vista+"_"+i_crea_vista][i]=null;
		}
	}
	timeOutCapaVista[nom_vista+"_"+i_crea_vista]=null;
}


function OmpleSlider(vista)
{
var barra_slider=[];

	if (( ParamCtrl.VistaBotonsBruixola || ParamCtrl.VistaBotonsZoom || ParamCtrl.VistaSliderZoom || ParamCtrl.VistaEscalaNumerica) &&
		vista.i_nova_vista==NovaVistaPrincipal && !ParamCtrl.hideLayersOverVista)
	{
		barra_slider.push("<table class=\"", MobileAndTabletWebBrowser ? "finestra_superposada_opaca" : "finestra_superposada", "\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
		if (ParamCtrl.VistaBotonsBruixola && (parseInt(document.getElementById("vista").style.height) >= 300))
		{
			barra_slider.push("<tr><td align='center'>");
			barra_slider.push(CadenaBotoPolsable('boto_nw', 'nw', GetMessage("moveNorthWest", "miramon"), 'MouLaVistaEventDeSalt(event,-1,1)'));
			barra_slider.push(CadenaBotoPolsable("boto_n", "n", GetMessage("moveNorth", "miramon"), "MouLaVistaEventDeSalt(event,0,1)"));
			barra_slider.push(CadenaBotoPolsable("boto_ne", "ne", GetMessage("moveNorthEast", "miramon"), "MouLaVistaEventDeSalt(event,1,1)"));
			barra_slider.push("<br/>");
			barra_slider.push(CadenaBotoPolsable("boto_w", "w", GetMessage("moveWest", "miramon"), "MouLaVistaEventDeSalt(event,-1,0)"));
			barra_slider.push(CadenaBotoPolsable("boto_zoomall", "zoomall", GetMessage("generalView", "barra"), "PortamAVistaGeneralEvent(event)"));
			barra_slider.push(CadenaBotoPolsable("boto_e", "e", GetMessage("moveEast", "miramon"), "MouLaVistaEventDeSalt(event,1,0)"));
			barra_slider.push("<br/>");
			barra_slider.push(CadenaBotoPolsable("boto_sw", "sw", GetMessage("moveSouthWest", "miramon"), "MouLaVistaEventDeSalt(event,-1,-1)"));
			barra_slider.push(CadenaBotoPolsable("boto_s", "s", GetMessage("moveSouth", "miramon"), "MouLaVistaEventDeSalt(event,0,-1)"));
			barra_slider.push(CadenaBotoPolsable("boto_se", "se", GetMessage("moveSouthEast", "miramon"), "MouLaVistaEventDeSalt(event,1,-1)"));
			barra_slider.push("</td></tr><tr><td height='15px'></td></tr>");
		}
		barra_slider.push("<tr><td align='center'>");
		if (ParamCtrl.VistaBotonsZoom)
		{
			barra_slider.push(CadenaBotoPolsable("boto_zoom_in", "zoom_in", GetMessage("IncreaseZoomLevel", "miramon"), "PortamANivellDeZoomEvent(event, " + (DonaIndexNivellZoom(vista.CostatZoomActual)+1) + ")"));
			barra_slider.push("<br>");
		}
		if (ParamCtrl.VistaSliderZoom && (parseInt(document.getElementById("vista").style.height) >= 500))
		{
			barra_slider.push("<input id='zoomSlider' type='range' step='1' min='0' max='", (ParamCtrl.zoom.length-1), "' value='", DonaIndexNivellZoom(vista.CostatZoomActual), "' style=';' orient='vertical' onchange='PortamANivellDeZoomEvent(event, this.value);' onclick='dontPropagateEvent(event);'><br>");
		}
		if (ParamCtrl.VistaBotonsZoom)
		{
			barra_slider.push(CadenaBotoPolsable("boto_zoom_out", "zoomout", GetMessage("ReduceZoomLevel", "miramon"), "PortamANivellDeZoomEvent(event, " + (DonaIndexNivellZoom(vista.CostatZoomActual)-1) + ")"));
		}
		barra_slider.push("</td></tr>");
		if (ParamCtrl.VistaEscalaNumerica && (parseInt(document.getElementById("vista").style.height,10) >= 400))
		{
			barra_slider.push("<tr><td align='center'><span class=\"text_allus text_coord\" style='font-family: Verdana, Arial; font-size: 0.6em;'>", GetMessage("TitolLlistatNivellZoom", "miramon"), ":<br>", EscriuDescripcioNivellZoom(DonaIndexNivellZoom(vista.CostatZoomActual), ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, true), "</span>");
			barra_slider.push("<br>");
			barra_slider.push(CadenaBotoPolsable("boto_zoomcoord", "zoomcoord", GetMessage("goToCoordinate", "barra"), "MostraFinestraAnarCoordenadaEvent(event)"));
			barra_slider.push(CadenaBotoPolsable("boto_zoom_bk", "zoom_bk", GetMessage("previousView", "barra"), "RecuperaVistaPreviaEvent(event)"));
			if (ParamCtrl.fullScreen)
				barra_slider.push(CadenaBotoPolsable("boto_fullscreen", "exitfullscreen", GetMessage("exitFullScreen", "miramon"), "ExitFullScreenEvent(event)"));
			else
				barra_slider.push(CadenaBotoPolsable("boto_fullscreen", "fullscreen", GetMessage("fullScreen", "miramon"), "GoFullScreenEvent(event)"));

			barra_slider.push("</td></tr>");
		}
		barra_slider.push("</table>");
	}

	if (ParamCtrl.VistaSliderData && ParamInternCtrl.millisegons.length &&
		vista.i_nova_vista==NovaVistaPrincipal && !ParamCtrl.hideLayersOverVista)
	{
		barra_slider.push("<span style='position: absolute; bottom: 20px; right: 100px; font-family: Verdana, Arial; font-size: 0.6em;' class='text_allus ", MobileAndTabletWebBrowser ? "finestra_superposada_opaca" : "finestra_superposada", "'>",  DonaDataMillisegonsComATextBreu(ParamInternCtrl.FlagsData, ParamInternCtrl.millisegons[ParamInternCtrl.iMillisegonsActual]),
				"<input type='button' value='<' onClick='PortamADataEvent(event, ", ParamInternCtrl.millisegons[(ParamInternCtrl.iMillisegonsActual ? ParamInternCtrl.iMillisegonsActual-1 : 0)], ");'", (ParamInternCtrl.iMillisegonsActual==0 ? " disabled='disabled'" : ""), ">",
				"<input id='timeSlider' type='range' style='width: 300px;' step='1' min='", ParamInternCtrl.millisegons[0], "' max='", ParamInternCtrl.millisegons[ParamInternCtrl.millisegons.length-1], "' value='", ParamInternCtrl.millisegons[ParamInternCtrl.iMillisegonsActual], "' onchange='PortamADataEvent(event, this.value);' onclick='dontPropagateEvent(event);' list='timeticks'>",
				"<input type='button' value='>' onClick='PortamADataEvent(event, ", ParamInternCtrl.millisegons[(ParamInternCtrl.iMillisegonsActual==ParamInternCtrl.millisegons.length-1 ? ParamInternCtrl.millisegons.length-1 : ParamInternCtrl.iMillisegonsActual+1)], ");'", (ParamInternCtrl.iMillisegonsActual==ParamInternCtrl.millisegons.length-1 ? " disabled='disabled'" : ""), ">");
		if (ParamInternCtrl.millisegons.length<300/2)
		{
			barra_slider.push("<datalist id='timeticks'>");
			for (var i=0; i<ParamInternCtrl.millisegons.length; i++)
				barra_slider.push("<option value='", ParamInternCtrl.millisegons[i], "'></option>");
			barra_slider.push("</datalist>");
		}
		barra_slider.push("</span>");
	}

	barra_slider.push("<span id='llegenda_situacio_coord' style='position: absolute; top: 4; right: 4;' class='", MobileAndTabletWebBrowser ? "finestra_superposada_opaca" : "finestra_superposada", "'>",
		DonaCadenaBotonsVistaLlegendaSituacioCoord(),
		"</span>");
		
	return barra_slider.join("");	
}

function ReOmpleSlider(nom_vista, vista)
{
	var elem=getLayer(window, nom_vista+SufixSliderZoom);
	if(elem)
	{
		var cadena_barra_slider=OmpleSlider(vista); // Creem sempre l'element que conté la barra de l'slider per poder canviar el seu interior
		contentLayer(elem, cadena_barra_slider);
	}
}

function CreaVistaImmediata(win, nom_vista, vista)
{
var cdns=[], ll;
var i_crea_vista;
var elem=getLayer(win, nom_vista);
var cal_vora=(ParamCtrl.VoraVistaGrisa && vista.i_nova_vista==NovaVistaPrincipal) ? true : false;
var cal_coord=(ParamCtrl.CoordExtremes && (vista.i_nova_vista==NovaVistaPrincipal || vista.i_nova_vista==NovaVistaImprimir)) ? true : false;
var estil_parella_coord=(vista.i_nova_vista==NovaVistaImprimir) ? true : false;
var p, unitats_CRS;

	if (ParamCtrl.CoordExtremes=="longlat_g")
		unitats_CRS="°";
	else if (ParamCtrl.CoordExtremes=="proj")
	{
		p=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (p=="°")
			unitats_CRS=p;
		else
			unitats_CRS=" "+p;
	}
	else //if (ParamCtrl.CoordExtremes=="longlat_gms") -> tant pel cas gms (pq ja les té) com pel cas desconegut no poso unitats
		unitats_CRS="";

	NCreaVista++;
	i_crea_vista=NCreaVista;
	timeOutCapaVista[nom_vista+"_"+i_crea_vista]=[];

	cdns.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	if (vista.i_nova_vista==NovaVistaPrincipal)
	{
	    cdns.push("  <tr>",
				"    <td rowspan=", (cal_vora ? (cal_coord ? 8 : 7) : (cal_coord ? 5 : 3)), " height=\"1\" width=\"", ((ParamCtrl.MargeEsqVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeEsqVista:0) , "\"></td>",
				"    <td colspan=", (cal_vora ? (cal_coord ? 6 : 5) : (cal_coord ? 3 : 1)), " height=\"" , ((ParamCtrl.MargeSupVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeSupVista:0) , "\" width=\"1\"></td>",
				"  </tr>");
	}

	if (cal_coord)
	{
	    cdns.push("  <tr>\n");
		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MinX,vista.EnvActual.MaxY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (cal_vora)
			cdns.push("    <td height=\"0\" width=\"10\"></td>\n");
		cdns.push("    <td align=\"left\"><font face=\"arial\" size=\"1\">\n");
		if (estil_parella_coord)
		{
			if (ParamCtrl.CoordExtremes=="proj")
				cdns.push("(" , (OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
				  (OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
			else if (ParamCtrl.CoordExtremes=="longlat_g")
				cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
				  (OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, ")");
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)), unitats_CRS, "," , (g_gms(ll.y, true)), unitats_CRS, ")");
		}
		else
		{
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.x, true)), unitats_CRS);
		}
		cdns.push("</td>\n");

		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MaxY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push("    <td"+ (cal_vora ? " colspan=\"2\"" : ""), " align=\"right\"><font face=\"arial\" size=\"1\">\n");
		if (estil_parella_coord)
		{
			if (ParamCtrl.CoordExtremes=="proj")
				cdns.push("(" , (OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
					(OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
			else if (ParamCtrl.CoordExtremes=="longlat_g")
				cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
					(OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS , ")");
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)), unitats_CRS, ",", (g_gms(ll.y, true)), unitats_CRS , ")");
		}
		else
		{
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			   cdns.push((OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.x, true)), unitats_CRS);
		}
		cdns.push("    </td>\n");
		if (cal_vora)
			cdns.push("    <td height=\"0\" width=\"10\"></td>\n");
		cdns.push("    <td",(cal_vora ? " rowspan=\"2\"": "" )," height=\"" , AltTextCoordenada , "\"></td>\n",
		   "  </tr>\n");
	}

	if (cal_vora)
	{
	  cdns.push("  <tr>",
			   "    <td><a href=\"javascript:MouLaVistaSalt(-1,1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc11.gif"), "\"",
			   " width=\"",
				MidaFletxaInclinada,"\" height=\"",MidaFletxaInclinada,"\" border=\"0\"></a></td>",
			   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), "\"",
			   " width=\"",Math.floor((vista.ncol-MidaFletxaPlana)/2),"\" height=\"",MidaFletxaInclinada,"\"></td>",
			   "    <td><a href=\"javascript:MouLaVistaSalt(0,1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_pla1.gif"), "\"",
			   " width=\"",MidaFletxaPlana,"\" height=\"",MidaFletxaInclinada,"\" border=\"0\"></a></td>",
			   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), "\"",
			   " width=\"",(Math.floor((vista.ncol-MidaFletxaPlana)/2)+(vista.ncol-MidaFletxaPlana)%2),"\" height=\"",MidaFletxaInclinada,"\"></td>",
			   "    <td><a href=\"javascript:MouLaVistaSalt(1,1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc21.gif"), "\"",
			   " width=\"",MidaFletxaInclinada,"\" height=\"",MidaFletxaInclinada,
			   "\" border=\"0\"></a></td>\n");
	   cdns.push("  </tr>");
	}

	cdns.push("  <tr>");
	if (cal_vora)
		cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"),
	   		"\" width=\"",MidaFletxaInclinada,"\" height=\"",Math.floor((vista.nfil-MidaFletxaPlana)/2),"\"></td>");
	cdns.push(
	   "    <td colspan=\"", ((cal_vora) ? 3 : (cal_coord? 2: 1)), "\" rowspan=\"", ((cal_vora) ? 3 : ((cal_coord && !estil_parella_coord)? 2: 1)), "\" style=\"background-color:", ParamCtrl.ColorFonsVista ,";\" width=\"",vista.ncol,"\" height=\"",vista.nfil,"\"></td>");

	if (cal_vora)
	  cdns.push(
	   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"),
	   "\" width=\"",MidaFletxaInclinada,"\" height=\"",Math.floor((vista.nfil-MidaFletxaPlana)/2),"\"></td>");
	if (cal_coord)
	{
		if (estil_parella_coord)
			cdns.push("    <td", (cal_vora ? " rowspan=\"2\"":  ""),  " nowrap></td>\n");
		else
		{
			cdns.push("    <td", (cal_vora ? " rowspan=\"2\"":  ""), " valign=\"top\" nowrap><font face=\"arial\" size=\"1\">&nbsp;&nbsp;\n");
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.y, true)), unitats_CRS);
			cdns.push("</td>\n");
		}
	}
	cdns.push("  </tr>");

	if ((cal_coord && !estil_parella_coord) || cal_vora)
	{
		cdns.push("  <tr>");
		if (cal_vora)
		  cdns.push(
		   "    <td><a href=\"javascript:MouLaVistaSalt(-1,0);\"><img src=\"", AfegeixAdrecaBaseSRC("f_ver1.gif"),
		   "\" width=\"",MidaFletxaInclinada,"\" height=\"",MidaFletxaPlana,"\" border=\"0\"></a></td>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(1,0);\"><img src=\"", AfegeixAdrecaBaseSRC("f_ver2.gif"),
		   "\" width=\"",MidaFletxaInclinada,"\" height=\"",MidaFletxaPlana,"\" border=\"0\"></a></td>",
		   "  </tr>",
		   "  <tr>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"),
		   "\" width=\"",MidaFletxaInclinada,"\" height=\"",(Math.floor((vista.nfil-MidaFletxaPlana)/2)+(vista.nfil-MidaFletxaPlana)%2),"\"></td>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"),
		   "\" width=\"",MidaFletxaInclinada,"\" height=\"",(Math.floor((vista.nfil-MidaFletxaPlana)/2)+(vista.nfil-MidaFletxaPlana)%2),"\"></td>\n");
		if (cal_coord)
		{
			cdns.push("    <td valign=\"bottom\" nowrap><font face=\"arial\" size=\"1\">&nbsp;&nbsp;\n");
			if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
			    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MinY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.y, true)), unitats_CRS);
			cdns.push("</td>\n");
		}
		cdns.push("  </tr>");
	}

	if (cal_vora)
	{
		cdns.push("  <tr>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(-1,-1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc12.gif"),
		   "\" width=\"",MidaFletxaInclinada,"\" height=\"",MidaFletxaInclinada,"\" border=\"0\"></a></td>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"),
		   "\" width=\"",Math.floor((vista.ncol-MidaFletxaPlana)/2),"\" height=\"",MidaFletxaInclinada,"\"></td>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(0,-1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_pla2.gif"),
		   "\" width=\"",MidaFletxaPlana,"\" height=\"",MidaFletxaInclinada,"\" border=\"0\"></a></td>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"),
		   "\" width=\"",(Math.floor((vista.ncol-MidaFletxaPlana)/2)+(vista.ncol-MidaFletxaPlana)%2), "\" height=\"",MidaFletxaInclinada,"\"></td>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(1,-1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc22.gif"),
		   "\" width=\"",MidaFletxaInclinada,"\" height=\"",MidaFletxaInclinada,"\" border=\"0\"></a></td>");
		if (cal_coord)
		   cdns.push("    <td rowspan=\"2\"></td>");
		cdns.push("  </tr>");
	}
	if (cal_coord && estil_parella_coord)
	{
	    cdns.push("  <tr>\n");
		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MinX,vista.EnvActual.MinY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (cal_vora)
			cdns.push("    <td height=\"0\" width=\"10\"></td>\n");
		cdns.push("    <td align=\"left\"><font face=\"arial\" size=\"1\">\n");
		if (ParamCtrl.CoordExtremes=="proj")
			cdns.push("(" , (OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
				  (OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
		else if (ParamCtrl.CoordExtremes=="longlat_g")
			cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
				  (OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
		else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)), unitats_CRS, "," , (g_gms(ll.y, true)), unitats_CRS, ")");
		cdns.push("</td>\n");

		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MinY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push("    <td"+ (cal_vora ? " colspan=\"2\"" : ""), " align=\"right\"><font face=\"arial\" size=\"1\">\n");
		if (ParamCtrl.CoordExtremes=="proj")
			cdns.push("(" , (OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
					(OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
		else if (ParamCtrl.CoordExtremes=="longlat_g")
			cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
					(OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
		else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			cdns.push("(" , (g_gms(ll.x, true)), "," , (g_gms(ll.y, true)), unitats_CRS, ")");
		cdns.push("    </td>\n");
		if (cal_vora)
			cdns.push("    <td height=\"0\" width=\"10\"></td>\n");
		cdns.push("    <td",(cal_vora ? " rowspan=\"2\"": "" )," height=\"" , AltTextCoordenada , "\"></td>\n",
		   "  </tr>\n");
	}

	if(ParamCtrl.MostraBarraEscala && vista.i_nova_vista==NovaVistaPrincipal)
	{
		cdns.push("  <tr>",
		   "    <td colspan=\"", (cal_vora ? 5 : (cal_coord ? 2 : 1)), "\" align=\"middle\">", DonaCadenaHTMLDibuixEscala(vista.EnvActual, false) ,"</td>");  //Servirà per indicar l'escala.
		if (cal_coord && !cal_vora)
			cdns.push("    <td></td>\n");
		cdns.push("  </tr>");
	}
	cdns.push("</table>");

	//alert(cdns.join(""));

	if (isLayer(elem))
	{
		//Les capes
		for (var i=ParamCtrl.capa.length-1; i>=0; i--)
		{
			if(i_crea_vista!=NCreaVista)
			{
				CancellaTimeOutCapaVista(nom_vista, i_crea_vista);
				return;
			}
			var capa=ParamCtrl.capa[i];

			if (capa.model==model_vector)
			{
				cdns.push(CreaCapaDigiLayer(nom_vista, vista.i_nova_vista, i));
				if (capa.estil[capa.i_estil].TipusObj=='P')
					cdns.push(CreaCapaDigiLayer(nom_vista, vista.i_nova_vista, -i-1)); //La capa oculta per rasteritzar identificadors gràfics de poligons
			}
			else
			{
				if (capa.visible!="no")
				{
					cdns.push(textHTMLLayer(nom_vista+"_l_capa"+i, DonaMargeEsquerraVista(vista.i_nova_vista)+1, DonaMargeSuperiorVista(vista.i_nova_vista)+1, vista.ncol, vista.nfil, null, {scroll: "no", visible:
											((EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=-1 ? vista.i_vista : DonaIVista(nom_vista), i)) ? true : false), ev: null, save_content: false}, null,
											(EsCapaBinaria(capa) ? "<canvas id=\"" + nom_vista + "_i_raster"+i+"\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>" : "<img id=\"" + nom_vista + "_i_raster"+i+"\" name=\"" + nom_vista + "_i_raster"+i+"\" src=\""+AfegeixAdrecaBaseSRC("espereu_"+ParamCtrl.idioma+".gif")+"\"  class=\"ImgHVCenter\">")));
				}
			}
		}

		if (vista.i_nova_vista!=NovaVistaImprimir)  //Evito que la impressió tingui events.
		{
			//Dibuixo el rectangle de zoom sobre la vista (inicialment invisible)
			cdns.push(textHTMLLayer(nom_vista+SufixZRectangle, DonaMargeEsquerraVista(vista.i_nova_vista), DonaMargeSuperiorVista(vista.i_nova_vista), vista.ncol+1, vista.nfil+1, null, {scroll: "no", visible: false, border: "1px solid " + ParamCtrl.ColorQuadratSituacio, ev: null, save_content: false}, null, null));

			//Dibuixo el "tel" transparent amb els events de moure i click. Sembla que si tinc slider aquests esdeveniments no es fan servir i els altres tenen prioritat
			cdns.push(textHTMLLayer(nom_vista+SufixTelTrans, DonaMargeEsquerraVista(vista.i_nova_vista)+1, DonaMargeSuperiorVista(vista.i_nova_vista)+1, vista.ncol, vista.nfil, null, {scroll: "no", visible: true, ev: (ParamCtrl.ZoomUnSolClic ? "onmousedown=\"IniciClickSobreVista(event, "+vista.i_nova_vista+");\" " : "") + "onmousemove=\"MovimentSobreVista(event, "+vista.i_nova_vista+");\" onClick=\"ClickSobreVista(event, "+vista.i_nova_vista+");\" onTouchStart=\"return IniciDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchMove=\"return MovimentDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchEnd=\"return FiDitsSobreVista(event, "+vista.i_nova_vista+");\"", save_content: false, bg_trans: true}, null, "<!-- -->"));

		    var cadena_barra_slider=OmpleSlider(vista); // Creem sempre l'element que conté la barra de l'slider per poder canviar el seu interior
		    cdns.push(textHTMLLayer(nom_vista+SufixSliderZoom, DonaMargeEsquerraVista(vista.i_nova_vista)+4, DonaMargeSuperiorVista(vista.i_nova_vista)+4, vista.ncol-3, vista.nfil-3, null, {scroll: "no", visible: true, ev: (ParamCtrl.ZoomUnSolClic ? "onmousedown=\"IniciClickSobreVista(event, "+vista.i_nova_vista+");\" " : "") + "onmousemove=\"MovimentSobreVista(event, "+vista.i_nova_vista+");\" onClick=\"ClickSobreVista(event, "+vista.i_nova_vista+");\" onTouchStart=\"return IniciDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchMove=\"return MovimentDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchEnd=\"return FiDitsSobreVista(event, "+vista.i_nova_vista+");\"", save_content: false, bg_trans: true}, null, cadena_barra_slider));
		}

		contentLayer(elem, cdns.join(""));

		//Només s'hauria de fer si hi ha peticions SOAP
		RespostaGetTileWMTS_SOAP.splice(0,RespostaGetTileWMTS_SOAP.length);
		ajaxGetTileWMTS_SOAP.splice(0,ajaxGetTileWMTS_SOAP.length);

		for (var i=ParamCtrl.capa.length-1; i>=0; i--)
		{
			if(i_crea_vista!=NCreaVista)
			{
				CancellaTimeOutCapaVista(nom_vista, i_crea_vista);
				return;
			}
			var capa=ParamCtrl.capa[i];
			if (capa.model==model_vector)
			{
				//if (EsObjDigiVisibleAAquestNivellDeZoom(capa))
				if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=NovaVistaPrincipal ? vista.i_vista : DonaIVista(nom_vista), i))
					timeOutCapaVista[nom_vista+"_"+i_crea_vista][i]=setTimeout("OmpleVistaCapaDigi(\""+nom_vista+"\", "+JSON.stringify(vista)+", "+i+")", 25*i);
			}
			else
			{
				if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=NovaVistaPrincipal ? vista.i_vista : DonaIVista(nom_vista), i))
					timeOutCapaVista[nom_vista+"_"+i_crea_vista][i]=setTimeout("OmpleVistaCapa(\""+nom_vista+"\", "+JSON.stringify(vista)+", "+i+")", 25*i);
				else if (capa.estil) //si la capa ara és no visible, i té estils, he de mirar si hi ha gràfics vinculats a ella per a "congelar-los"
				{
					for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
						DesactivaCheckITextChartsMatriusDinamics(i, i_estil, true);
				}
			}
			if (capa.visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor!=true)
				timeOutCapaVista[nom_vista+"_"+i_crea_vista][i]=setTimeout("semitransparentThisNomLayer(\""+nom_vista+"_l_capa"+i+"\")", 25*i);
		}
	}
	if (vista.i_nova_vista==NovaVistaPrincipal || vista.i_nova_vista==NovaVistaImprimir)
		CreaAtribucioVista();
}


function CalculaMidesVista(i_nova_vista)
{
var w=0, h=0;
var elem=getLayer(window, "vista");
var cal_coord=(ParamCtrl.CoordExtremes) ? true : false;

	if (isLayer(elem))
	{
		var rect=getRectLayer(elem);
		w=rect.ample;
		h=rect.alt;
	}
	if (w>0)
	{
		ParamInternCtrl.vista.ncol=w-(((ParamCtrl.MargeEsqVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeEsqVista:0)+MidaFletxaInclinada*2+MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AmpleTextCoordenada : 0));
		if (w>200)
		    ParamInternCtrl.vista.ncol+=10;
		if (ParamInternCtrl.vista.ncol<MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AmpleTextCoordenada*2 : 5))
			ParamInternCtrl.vista.ncol=MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AmpleTextCoordenada*2 : 5);
	}
	if (h>0)
	{
		ParamInternCtrl.vista.nfil=h-(((ParamCtrl.MargeSupVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeSupVista:0)+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AltTextCoordenada:0)+MidaFletxaInclinada*2+MidaFletxaPlana+AltTextCoordenada+5);
		if (h>200)
		    ParamInternCtrl.vista.nfil+=18;
		if (ParamInternCtrl.vista.nfil<MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AltTextCoordenada*2 : 5))
			ParamInternCtrl.vista.nfil=MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AltTextCoordenada*2 : 5);
	}
}

function DonaVistaDesDeINovaVista(i_nova_vista)
{
	if (i_nova_vista==NovaVistaImprimir)
		return VistaImprimir;
	if (i_nova_vista==NovaVistaPrincipal || i_nova_vista==NovaVistaVideo)
		return ParamInternCtrl.vista;
	return NovaVistaFinestra.vista[i_nova_vista];
}

