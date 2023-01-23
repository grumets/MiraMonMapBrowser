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

    Copyright 2001, 2022 Xavier Pons

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

function CalculaMidesSituacio()
{
	ParamInternCtrl.MargeEsqSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeEsq;
	ParamInternCtrl.AmpleSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample;
	ParamInternCtrl.MargeSupSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeSup;
	ParamInternCtrl.AltSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt;

	if (ParamCtrl.AmpleAltSituacioAuto)
	{
		var elem=getResizableLayer(window, "situacio");
		if (!isLayer(elem))
			return
		var rect=getRectLayer(elem);

		var factor=rect.ample/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeEsq*2+ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample);
		var factor_y=rect.alt/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeSup*2+ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt);
		if (factor_y<factor)
			factor=factor_y;
		factor*=0.97
		ParamInternCtrl.MargeEsqSituacio=Math.floor(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeEsq*factor);
		ParamInternCtrl.AmpleSituacio=Math.floor(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample*factor);
		ParamInternCtrl.MargeSupSituacio=Math.floor(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeSup*factor);
		ParamInternCtrl.AltSituacio=Math.floor(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt*factor);
	}
}

/*function DonaCadenaHTMLMarcSituacio(ample, alt)
{
var cdns=[];
	cdns.push( "<table border=0 cellspacing=0 cellpadding=0><tr><td colspan=3 style=\"background-color:", ParamCtrl.ColorQuadratSituacio ,";\" height=\"1\" width=\"",ample,
		"\"></td></tr><tr><td style=\"background-color:", ParamCtrl.ColorQuadratSituacio ,";\" height=\"",(alt-2),
		"\" width=\"1\"></td><td height=\"1\" width=\"",(ample-2),
		"\"></td><td style=\"background-color:", ParamCtrl.ColorQuadratSituacio ,";\" height=\"",(alt-2),
		"\" width=\"1\"></td></tr><tr><td colspan=3 style=\"background-color:", ParamCtrl.ColorQuadratSituacio ,";\" height=\"1\" width=\"",ample,"\"></td></table>");
	return cdns.join("");
}*/

function MostraFinestraSituacio(event)
{
	showFinestraLayer(window, "situacio");
	document.getElementById("llegenda_situacio_coord").innerHTML=DonaCadenaBotonsVistaLlegendaSituacioCoord();
	dontPropagateEvent(event);
}

function CreaSituacio()
{
var nom_img_src;

	var elem=getResizableLayer(window, "situacio");
	if (isLayer(elem))
	{
		var situacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio];
		if (!situacio.Alt)
			situacio.Alt=Math.round(situacio.Ample*(situacio.EnvTotal.EnvCRS.MaxY-situacio.EnvTotal.EnvCRS.MinY)/(situacio.EnvTotal.EnvCRS.MaxX-situacio.EnvTotal.EnvCRS.MinX));

		CalculaMidesSituacio();
		var rec=OmpleMidesRectangleSituacio(ParamInternCtrl.AmpleSituacio, ParamInternCtrl.AltSituacio, ParamInternCtrl.vista.EnvActual);

		//Determino el nom de la imatge de sitaució.
		if (typeof situacio.servidor==="undefined")
			nom_img_src=AfegeixAdrecaBaseSRC(situacio.nom);
		else if (DonaTipusServidorCapa(situacio)!="TipusWMS")
		{
			alert("'situacio' with 'tipus' different of 'TipusWMS' not supported");
			nom_img_src=AfegeixAdrecaBaseSRC(situacio.nom);
		}
		else
		{
			nom_img_src="SERVICE=WMS&VERSION=" + DonaVersioComAText(DonaVersioServidorCapa(situacio)) + "&REQUEST=GetMap&";
			if (DonaVersioServidorCapa(situacio).Vers<1 || (DonaVersioServidorCapa(situacio).Vers==1 && DonaVersioServidorCapa(situacio).SubVers<2))
		    		nom_img_src+="SRS=";
			else
        			nom_img_src+="CRS=";
			nom_img_src+=situacio.EnvTotal.CRS + "&BBOX=";
			var env=situacio.EnvTotal.EnvCRS;
			if (CalGirarCoordenades(situacio.EnvTotal.CRS,  DonaVersioServidorCapa(situacio)))
				nom_img_src+=env.MinY + "," + env.MinX + "," + env.MaxY + "," + env.MaxX;
			else
        			nom_img_src+=env.MinX + "," + env.MinY + "," + env.MaxX + "," + env.MaxY;
			nom_img_src+="&WIDTH=" + situacio.Ample + "&HEIGHT=" + situacio.Alt + "&LAYERS=" + situacio.nom + "&FORMAT=";
			if (situacio.FormatImatge)
				nom_img_src+=situacio.FormatImatge;
			else
				nom_img_src+="image/png";
			nom_img_src+="&TRANPARENT=TRUE&STYLES=";
			if (situacio.NomEstil)
				nom_img_src+=situacio.NomEstil;
			nom_img_src=CombinaURLServidorAmbParamPeticio(DonaServidorCapa(situacio), nom_img_src);
		}

		//Contrueixo les 3 divisions (el mapa, el rectangle i el tel sensible). La divisió del mapa conté les altres.
		var s='<div style="overflow:hidden; left:' + ParamInternCtrl.MargeEsqSituacio + 'px; top:' + ParamInternCtrl.MargeSupSituacio + 'px; width:' + ParamInternCtrl.AmpleSituacio+ 'px; height:' + ParamInternCtrl.AltSituacio  + 'px;">'+
			 '<img src="' + nom_img_src + '" width="' + ParamInternCtrl.AmpleSituacio + '" height="' + ParamInternCtrl.AltSituacio+'" border="0">';
		if (EsEnvDinsMapaSituacio(ParamInternCtrl.vista.EnvActual))
			s+='<div style="position:absolute; overflow:hidden; left:' + (ParamInternCtrl.MargeEsqSituacio+rec.MinX) + 'px; top:' + (ParamInternCtrl.MargeSupSituacio+ParamInternCtrl.AltSituacio-rec.MaxY) + 'px; width:' + (rec.MaxX-rec.MinX) + 'px; height:' + (rec.MaxY-rec.MinY) + 'px; border: 1px solid ' + ParamCtrl.ColorQuadratSituacio + ';">'+
				//DonaCadenaHTMLMarcSituacio(rec.MaxX-rec.MinX, rec.MaxY-rec.MinY)+
				'</div>';
		s+='<div style="position:absolute; overflow:hidden; left:' + ParamInternCtrl.MargeEsqSituacio + 'px; top:' + ParamInternCtrl.MargeSupSituacio + 'px; width:' + ParamInternCtrl.AmpleSituacio+ 'px; height:' + ParamInternCtrl.AltSituacio  + 'px;" onClick="ClickSobreSituacio(event);" onmousemove="MovimentSobreSituacio(event);">'+
			'</div>'+
			'</div>';
		contentLayer(elem, s);
	}
}

function CreaSituacioFullImprimir(win, esq, sup, ample, alt)
{
var factor_imatge=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt/ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample;
var factor_paper=alt/ample;
var elem=getLayer(win, "situacio");

    if (isLayer(elem))
    {
		if (factor_imatge>factor_paper)
			ample=floor_DJ(alt/factor_imatge);
		else
			alt=floor_DJ(ample*factor_imatge);

		var rec=OmpleMidesRectangleSituacio(ample,alt,VistaImprimir.EnvActual);
		contentLayer(elem,
				"<img src=\"" +
				AfegeixAdrecaBaseSRC(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].nom) + "\" width="+ample+" height="+alt+" border=0>"+
				"<br><img src=\""+
				AfegeixAdrecaBaseSRC("1tran.gif")+
				"\" height=\"15\" width=\"1\"><br>"+
				textHTMLLayer("l_rect", esq+rec.MinX,
						sup+alt-rec.MaxY,
						rec.MaxX-rec.MinX,
						rec.MaxY-rec.MinY,
						null, {scroll: "no", visible: true, ev: null, save_content: false, border: "1px solid " + ParamCtrl.ColorQuadratSituacio}, null,
						/*DonaCadenaHTMLMarcSituacio(rec.MaxX-rec.MinX, rec.MaxY-rec.MinY)*/null));
    }
}//Fi de CreaSituacioFullImprimir()


function OmpleMidesRectangleSituacio(ncol,nfil, env)
{
	return {"MinX": Math.max(0,Math.floor((env.MinX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)*ncol/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX))),
		"MaxX": Math.min(ncol,Math.floor((env.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)*ncol/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)+1)),
		"MinY": Math.max(0,Math.floor((env.MinY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)*nfil/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY))),
		"MaxY": Math.min(nfil,Math.floor((env.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)*nfil/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)+1))};
}

function ClickSobreSituacio(event)
{
	//Aquesta línia no es pot fer així perquè activa l'antivirus defender DragDrop.B. 10 anys més tard encara passa!! (https://joanma747.blogspot.com/2012/02/false-dragdropb-trojan-detected-by.html)
	//Portam A Punt(  DonaC oordXDeC oordSobreSituacio(event.c lientX),   DonaC oordYDeC oordSobreSituacio(event.c lientY));
	var x = DonaCoordXDeCoordSobreSituacio(event.clientX);
    	var y = DonaCoordYDeCoordSobreSituacio(event.clientY);
	PortamAPunt(x, y);
}

function DonaOrigenSuperiorSituacio()
{
	var elem=getResizableLayer(window, "situacio");
	if (isLayer(elem))
		return ParamInternCtrl.MargeSupSituacio+getRectSupLayer(elem);
	return ParamInternCtrl.MargeSupSituacio;
}

function DonaOrigenEsquerraSituacio()
{
	var elem=getResizableLayer(window, "situacio");
	if (isLayer(elem))
		return ParamInternCtrl.MargeEsqSituacio+getRectEsqLayer(elem);
	else
		return ParamInternCtrl.MargeEsqSituacio;
}


function DonaCoordXDeCoordSobreSituacio(x)
{
	return ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX+(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)/(ParamInternCtrl.AmpleSituacio-1)*(((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+x-DonaOrigenEsquerraSituacio());
}
function DonaCoordYDeCoordSobreSituacio(y)
{
	return ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)/(ParamInternCtrl.AltSituacio-1)*(((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+y-DonaOrigenSuperiorSituacio());
}


function MovimentSobreSituacio(event_de_moure)
{
	MostraValorDeCoordActual(-1, DonaCoordXDeCoordSobreSituacio(event_de_moure.clientX), DonaCoordYDeCoordSobreSituacio(event_de_moure.clientY));
}

function EsEnvDinsMapaSituacio(env_actual)
{
	return EsEnvDinsEnvolupant(env_actual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS);
}//Fi de EsPuntDinsAmbitNavegacio()
