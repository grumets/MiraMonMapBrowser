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

function DonaTextImgGifSvg(id, name, filename, size, title, onclick_function_name)
{
var cdns=[];	

	cdns.push("<img src=\"", AfegeixAdrecaBaseSRC(filename + (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors ? ".svg" : ".gif")), "\" ",
		 "id=\"", id, "\" ");
	if (name)
		cdns.push("name=\"", name, "\" ");
	if (size>0)
	{
		//cdns.push("width=\"", size, "\" height=\"", size, "\" ");
		cdns.push("width=\"", size, "\" ");
	}
	if (onclick_function_name)
		cdns.push("onClick='", onclick_function_name,"' ");
	if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
		cdns.push("border=\"0\" ");
	if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
	{
		if (title)
			cdns.push("alt=\"", title, "\" title=\"", title,"\" align=\"middle\" ",
				"onMouseOver='if (document.getElementById(\"", id, "\").alt) window.status=document.getElementById(\"", id, "\").alt; return true;' ",
				"onMouseOut='if (document.getElementById(\"", id, "\").alt) window.status=\"\"; return true;' ");
	}
	else
	{
		cdns.push("onLoad='ChangeSVGToInlineSVG(this, ChangeTitleColorsSVG, {", (title ? "title: \""+title.replaceAll("'", "&apos;")+"\", " : ""), "colors: ", JSON.stringify(ParamCtrl.BarraEstil.colors), ", format: \"gif\"});' ",
			"onError='DefaultSVGToPNG(event, this, \"gif\");' ");
		if (ParamCtrl.BarraEstil.colorsGrey && onclick_function_name)
			cdns.push("onmouseover='ChangeTitleColorsSVG(\"", id, "\", {colors: ", JSON.stringify(ParamCtrl.BarraEstil.colorsGrey), "});' ",
				"onmouseout='ChangeTitleColorsSVG(\"", id, "\", {colors: ", JSON.stringify(ParamCtrl.BarraEstil.colors), "});' ");
	}
	cdns.push(">");
	return cdns.join("");
}

function DonaTextBotoBarraFinestraLayer(nom_fin, nom_boto, size, title, onclick_function_name)
{
	return DonaTextImgGifSvg("id_"+nom_fin+"_"+nom_boto, nom_fin+"_"+nom_boto, nom_boto, size, title, onclick_function_name);
}

/*
 * Replace an SVG img src with inline XML SVG 
 */
//https://stackoverflow.com/questions/24933430/img-src-svg-changing-the-styles-with-css/24933495#24933495
//This code will be to replace them all: document.querySelectorAll('img.svg').forEach(ChangeSVGToInlineSVG())
function ChangeSVGToInlineSVG(img, f_next, params)
{
	var imgID = img.id;

	if (img.src.substring(img.src.lastIndexOf(".")).toLowerCase()!=".svg")
		return true;

	fetch(img.src).then(function(response) {
        	return response.text();
	}).then(function(text){

	        var parser = new DOMParser();
	        var xmlDoc = parser.parseFromString(text, "text/xml");
		
	        // Get the SVG tag, ignore the rest
        	var svg = xmlDoc.getElementsByTagName('svg')[0];

	        // Add replaced image's ID to the new SVG
	        if(typeof imgID !== 'undefined') {
        		svg.setAttribute('id', imgID);
	        }
	        // Add replaced image's classes to the new SVG
        	if(typeof img.className !== 'undefined') {
			svg.setAttribute('class', img.className+' replaced-svg');
        	}

	        // Remove any invalid XML tags as per http://validator.w3.org
        	svg.removeAttribute('xmlns:a');

	        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
        	if(!svg.getAttribute('viewBox') && svg.getAttribute('height') && svg.getAttribute('width')) {
        		svg.setAttribute('viewBox', '0 0 ' + svg.getAttribute('height') + ' ' + svg.getAttribute('width'))
	        }

		if (img.height)
			svg.setAttribute('height', img.height);
		if (img.width)
			svg.setAttribute('width', img.width);
		if (img.onclick)
			svg.onclick=img.onclick;
		if (img.onmouseover)
			svg.onmouseover=img.onmouseover;
		if (img.onmouseout)
			svg.onmouseout=img.onmouseout;
	        // Replace image with new SVG
        	img.parentNode.replaceChild(svg, img);

		if (f_next)
			f_next(imgID, params);

	}).catch(function(event){
		DefaultSVGToPNG(event, img, params.format);
	});
}

function DefaultSVGToPNG(event, img, ext)
{
	if (event && event.target && event.target.src && event.target.src && event.target.src.substring(event.target.src.lastIndexOf(".")+1)==ext)
	{
		alert("Error loading "+event.target.src);
		return;
	}
 	img.src=img.src.substring(0, img.src.lastIndexOf(".")+1)+(ext ? ext : "png");
}

function ChangeTitleColorsSVG(id, params)
{
	if (params)
	{
		var svg=document.getElementById(id);
		//Es possible que hi hagi una promesa pendent sobre un element de la llegenda que es redibuixa sobint. Pot passar que la llegenda s'hagi redibuixat completament i aquest element ja no existeixi en el document
		if (!svg)
			return;
			
		if (params.title)
		{
			if (!svg.getElementsByTagName("title") || !svg.getElementsByTagName("title").length)
			{
				var newNode = document.createElementNS("http://www.w3.org/2000/svg", "title");
				svg.insertBefore(newNode, svg.firstChild);
			}
			svg.getElementsByTagName("title")[0].textContent=params.title;
		}
		if (params.width)
			svg.setAttribute('width', params.width);
		if (params.height)
			svg.setAttribute('height', params.height);
		if (params.colors)
		{
			for(var c in params.colors)
			{
				if (svg.getElementsByClassName(c))
				{
					for (var i=0; i<svg.getElementsByClassName(c).length; i++)
						svg.getElementsByClassName(c)[i].style.fill=params.colors[c];
				}
			}
		}
	}
}

//---

function AddRemoveMouseOverOutSVG(id, add)
{
	var svg=document.getElementById(id);
	if (svg)
	{
		if (add && ParamCtrl.BarraEstil.colorsGrey)
		{
			//https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function (tercera resposta)
			svg.onmouseover=ChangeTitleColorsSVG.bind(null, id, {colors: ParamCtrl.BarraEstil.colorsGrey});
			svg.onmouseout=ChangeTitleColorsSVG.bind(null, id, {colors: ParamCtrl.BarraEstil.colors});
		}
		else
		{
			svg.onmouseover=null;
			svg.onmouseout=null;
		}
	}
}

function ChangeSizeSVG(id, size)
{
	var svg=document.getElementById(id);
	if (svg)
		svg.setAttribute('width', size);
}

function CanviaImageBotoPolsable(event, img, nom)
{
	img.src=nom;
	dontPropagateEvent(event);  //Si el botó està sobre altres coses no propaga aquest event
	return true;
}

//'size' is optional and it overwrites the config.js. Useful only for "non-barra" bottons
function CadenaBotoPolsable(nom, fitxer, text_groc, funcio, size)
{
var cdns=[];
	cdns.push("<img align=\"absmiddle\" src=\"", AfegeixAdrecaBaseSRC(fitxer + (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors ? ".svg" : ".gif") ), "\" ",
			"id=\"id_barra_", nom, "\" name=\"", nom, "\" ",
			"width=\"", (size ? size : ((ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.ncol) ? ParamCtrl.BarraEstil.ncol : 23)), "\" ",
			"height=\"", (size ? size : ((ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.nfil) ? ParamCtrl.BarraEstil.nfil : 22)), "\" ");
	if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
		cdns.push("alt=\"", text_groc, "\" title=\"", text_groc, "\" ",
			"onClick=\"this.src=\'", AfegeixAdrecaBaseSRC(fitxer + ".gif"), "\';", funcio, "\" ",
			"onmousedown=\"CanviaImageBotoPolsable(event, this, '", AfegeixAdrecaBaseSRC(fitxer + "p.gif"), "');\" ",
			"onmouseover=\"if (this.alt) window.status=this.alt; return true;\" ",
			"onmouseout=\"this.src=\'", AfegeixAdrecaBaseSRC(fitxer + ".gif"), "\';if (this.alt) window.status=\'\'; return true;\"");
	else
	{
		cdns.push("onLoad='ChangeSVGToInlineSVG(this, ChangeTitleColorsSVG, {title: \"", text_groc.replaceAll("'", "&apos;"), "\", colors: ", JSON.stringify(ParamCtrl.BarraEstil.colors), ", format: \"gif\"});' ",
			"onError='DefaultSVGToPNG(event, this, \"gif\");' ",
			"onClick='", funcio, "' ");
		if (ParamCtrl.BarraEstil.colorsGrey)
			cdns.push("onmouseover='ChangeTitleColorsSVG(\"id_barra_", nom, "\", {colors: ", JSON.stringify(ParamCtrl.BarraEstil.colorsGrey), "});' ",
				"onmouseout='ChangeTitleColorsSVG(\"id_barra_", nom, "\", {colors: ", JSON.stringify(ParamCtrl.BarraEstil.colors), "});' ");
	}
	cdns.push(">");
	return cdns.join("");
}

//Els arguments són tripletes de 'nom_img', 'nom_fitxer_img', 'p'...
function CanviaPolsatEnBotonsAlternatius()
{
	for (var i=0; i<arguments.length; i+=3)
	{
		if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
			window.document[arguments[i]].src=AfegeixAdrecaBaseSRC(arguments[i+1]+arguments[i+2]+".gif");
		else if (ParamCtrl.BarraEstil.colorsGrey)
		{
			ChangeTitleColorsSVG("id_barra_"+ arguments[i], {colors: (arguments[i+2]=='p' ? ParamCtrl.BarraEstil.colorsGrey : ParamCtrl.BarraEstil.colors)});
			AddRemoveMouseOverOutSVG("id_barra_"+ arguments[i], arguments[i+2]!='p');
		}
	}
	return true;
}

//Els arguments són: l'índex del botó premut al inici + trios de 'nom_img', 'text_groc', 'funcio'...
function CadenaBotonsAlternatius(boto_p, botons, space, size, sizep)
{
var j,l;
var cdns=[];
	for (j=0; j<botons.length; j++)
	{
		if (space && j!=0)
			cdns.push(" ");
		cdns.push( "<img align=\"absmiddle\" src=\"" ,
			AfegeixAdrecaBaseSRC(botons[j].src),
			((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) && boto_p==botons[j].src ? "p" : ""),
			(ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors ? ".svg" : ".gif"), 
			"\" ",
			"id=\"id_barra_", botons[j].src, "\" name=\"", botons[j].src, "\" "+
			"width=\"", (sizep ? (boto_p==botons[j].src ? sizep : size) : ((ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.ncol) ? ParamCtrl.BarraEstil.ncol : 23)), "\" ");
		if (!sizep)
			cdns.push("height=\"", ((ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.nfil) ? ParamCtrl.BarraEstil.nfil : 22), "\" ");

		if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
			cdns.push("alt=\"" , botons[j].alt, "\" title=\"", botons[j].alt, "\" ");
		cdns.push("onClick=\"CanviaPolsatEnBotonsAlternatius(" );
		for (l=0; l<botons.length; l++)
		{
			if (l!=0)
				cdns.push(",");
			cdns.push("\'", botons[l].src, "\',\'", botons[l].src, "\',\'", ((j==l) ? "p" : ""), "\'");
		}
		cdns.push( ");", botons[j].funcio, "\" ");
		if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
			cdns.push("onMouseOver=\"if (document." , botons[j].src , ".alt) window.status=document." , botons[j].src , ".alt; return true;\" ",
				"onMouseOut=\"if (document." , botons[j].src , ".alt) window.status=''; return true;\" ");
		else
		{
			cdns.push("onLoad='ChangeSVGToInlineSVG(this, ChangeTitleColorsSVG, {title: \"", botons[j].alt, "\", colors: ", JSON.stringify((boto_p==botons[j].src && ParamCtrl.BarraEstil.colorsGrey) ? ParamCtrl.BarraEstil.colorsGrey : ParamCtrl.BarraEstil.colors), ", format: \"gif\"});' ",
				"onError='DefaultSVGToPNG(event, this, \"gif\");' ");
			if (boto_p!=botons[j].src)
			{
				if (size!=sizep)
					cdns.push("onmouseover='ChangeTitleColorsSVG(\"id_barra_", botons[j].src, "\", {width: ", sizep, ", height: ", sizep, "});' ",
						"onmouseout='ChangeTitleColorsSVG(\"id_barra_", botons[j].src, "\", {width: ", size, ", height: ", size, "});' ");
				else if (ParamCtrl.BarraEstil.colorsGrey)
					cdns.push("onmouseover='ChangeTitleColorsSVG(\"id_barra_", botons[j].src, "\", {colors: ", JSON.stringify(ParamCtrl.BarraEstil.colorsGrey), "});' ",
						"onmouseout='ChangeTitleColorsSVG(\"id_barra_", botons[j].src, "\", {colors: ", JSON.stringify(ParamCtrl.BarraEstil.colors), "});' ");
			}
		}
		cdns.push(">");
	}
	return cdns.join("");
}


function CreaBarra(crs)
{
var i, j, k;
var cdns=[];

	if (ParamCtrl.BarraNomesDescarrega)
	{
		cdns.push("<FORM NAME=\"zoom\" METHOD=\"GET\" onSubmit=\"return ObtenirMMZ();\">");
		ParamCtrl.EstatClickSobreVista="ClickMouMig";
		cdns.push("<CENTER>",
		   (CadenaBotoPolsable("getmmz_text", "getmmz_text", GetMessage("Download"), "ObtenirMMZ();")),
		   "&nbsp;&nbsp;&nbsp;",
		   (CadenaBotoPolsable("ajuda", "ajuda", GetMessage("InteractiveHelp"), "ObreFinestraAjuda();")),
		   "</CENTER>");
	}
	else // Barra completa
	{
		cdns.push("<FORM NAME=\"zoom\" METHOD=\"GET\" onSubmit=\"return PortamANivellDeZoom(document.zoom.nivell.value)\">\n");
		if (ParamCtrl.BarraBotoMes)
		   	cdns.push((CadenaBotoPolsable("zoom_in", "zoom_in", GetMessage("ZoomIn", "barra"),
				"PortamANivellDeZoom(DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual)+1);")));
		if (ParamCtrl.BarraBotoMenys)
			cdns.push((CadenaBotoPolsable("zoomout", "zoomout", GetMessage("ZoomOut", "barra"),
				"PortamANivellDeZoom(DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual)-1);")));
		if (ParamCtrl.BarraBotoAnarCoord)
			cdns.push((CadenaBotoPolsable("zoomcoord", "zoomcoord", GetMessage("GoToCoordinate", "barra"),
				"MostraFinestraAnarCoordenada()")));
		if (ParamCtrl.BarraBotoBack)
			cdns.push((CadenaBotoPolsable("zoom_bk", "zoom_bk", GetMessage("PreviousView", "barra"),
				"RecuperaVistaPrevia();")));
		if (ParamCtrl.BarraBotoVGeneral)
			cdns.push((CadenaBotoPolsable("zoomall", "zoomall", GetMessage("GeneralView", "barra"),
				"PortamAVistaGeneral();")));

		// Activació de les consultes perquè hi ha alguna capa consultable
		if(~Accio.accio&AccioValidacio)
		{
			for (i=0; i<ParamCtrl.capa.length; i++)
			{
				if (ParamCtrl.capa[i].consultable!="no")
				    break;
			}
		}
		else
			i=0;

		// Activació de les consultes perquè hi ha alguna vector consultable
		for (k=0; k<ParamCtrl.capa.length; k++)
		{
			if (ParamCtrl.capa[k].model==model_vector && ParamCtrl.capa[k].consultable!="no")
				break;
		}
		// Activació de les consultes perquè hi ha alguna vector editable
		for (j=0; j<ParamCtrl.capa.length; j++)
		{
			if (ParamCtrl.capa[j].model==model_vector && ParamCtrl.capa[j].editable!="no")
				break;
		}
		if (ParamCtrl.BarraBotonsAlternatius)
		{
			var botons=[];
			var boto_p;

			//Precaucions previes: S'eviten situacions on ParamCtrl.EstatClickSobreVista és incompatible amb l'estat actual del navegador
			if (ParamCtrl.EstatClickSobreVista=="ClickMouMig" && !(ParamCtrl.BarraBotoMouMig))
				ParamCtrl.EstatClickSobreVista="ClickPan1";
			else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts" && !(ParamCtrl.BarraBotoInsereix || (ParamCtrl.capa && j<ParamCtrl.capa.length)))
				ParamCtrl.EstatClickSobreVista="ClickConLoc";
			else if ((ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2") && !(ParamCtrl.BarraBotoNovaVista))
				ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
			if (ParamCtrl.EstatClickSobreVista=="ClickConLoc" && (!(i<ParamCtrl.capa.length) && (ParamCtrl.capa && !(k<ParamCtrl.capa.length))))
				ParamCtrl.EstatClickSobreVista="ClickZoomRec1";


			if (ParamCtrl.EstatClickSobreVista=="ClickPan1" || ParamCtrl.EstatClickSobreVista=="ClickPan2")
				boto_p="pan";
			else if (ParamCtrl.EstatClickSobreVista=="ClickMouMig" )
				boto_p="moumig";
			else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec1" || ParamCtrl.EstatClickSobreVista=="ClickZoomRec2")
				boto_p="zoomfin";
			else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2")
				boto_p="novavista";
			else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts" && (ParamCtrl.BarraBotoInsereix || (ParamCtrl.capa && j<ParamCtrl.capa.length)))   //hi ha alguna capa digitalitzable
				boto_p="inserta";
			else if (i<ParamCtrl.capa.length || (ParamCtrl.capa && k<ParamCtrl.capa.length))  //hi ha alguna capa consultable
				boto_p=(i<ParamCtrl.capa.length && Accio.accio&AccioValidacio) ? "conval" : "conloc";
			else
				boto_p="zoomfin";

			botons[botons.length]={"src": "pan",
				   "alt": GetMessage("PanView", "barra"),
				   "funcio": "CanviaEstatClickSobreVista(\'ClickPan1\');"};
			if (ParamCtrl.BarraBotoMouMig)
			{
				botons[botons.length]={"src": "moumig",
					   "alt": GetMessage("CenterWhereClick", "barra"),
					   "funcio": "CanviaEstatClickSobreVista(\'ClickMouMig\');"};
 			}
			botons[botons.length]={"src": "zoomfin",
					   "alt": GetMessage("WindowZoom", "barra"),
					   "funcio": "CanviaEstatClickSobreVista(\'ClickZoomRec1\');"};
			if (ParamCtrl.BarraBotoNovaVista)
			{
				botons[botons.length]={"src": "novavista",
					   "alt": GetMessage("NewView", "barra"),
					   "funcio": "CanviaEstatClickSobreVista(\'ClickNovaVista1\');"};
			}
			if (i<ParamCtrl.capa.length || (ParamCtrl.capa && k<ParamCtrl.capa.length))  //hi ha alguna capa consultable
			{
				botons[botons.length]={"src": (i<ParamCtrl.capa.length && Accio.accio&AccioValidacio) ? "conval" : "conloc",
					   "alt": (i<ParamCtrl.capa.length && Accio.accio&AccioValidacio) ? GetMessage("Validation", "barra") : GetMessage("QueryByLocation"),
					   "funcio": "CanviaEstatClickSobreVista(\'ClickConLoc\');"};
			}
			if (ParamCtrl.BarraBotoInsereix || (ParamCtrl.capa && j<ParamCtrl.capa.length))
			{
				botons[botons.length]={"src": "inserta",
					   "alt": GetMessage("EditANewPoint", "barra"),
					   "funcio": "CanviaEstatClickSobreVista(\'ClickEditarPunts\');"};
 			}
			cdns.push(CadenaBotonsAlternatius(boto_p, botons),"\n");
		}

		if (ParamCtrl.BarraBotoMapaNet)
		{
			cdns.push(CadenaBotonsAlternatius(ParamCtrl.hideLayersOverVista ? "mapanet" : null, [{"src": "mapanet",
				   "alt": GetMessage("ShowCleanMap_View", "params").replace("<u>","").replace("</u>",""),
				   "funcio": "ParamCtrl.hideLayersOverVista=!ParamCtrl.hideLayersOverVista;showOrHideLayersOnTopOfVista();"}]), "\n");
		}

		if ((typeof ParamCtrl.BarraEscala==="undefined" || ParamCtrl.BarraEscala) &&
			(ParamCtrl.LlistatZoomFraccio || ParamCtrl.LlistatZoomMidaPixel || ParamCtrl.LlistatZoomEscalaAprox))
		{
			cdns.push("&nbsp;<span class=\"titol_zoom\">",
			   (ParamCtrl.TitolLlistatNivellZoom ?
					DonaCadena(ParamCtrl.TitolLlistatNivellZoom) :
					"Zoom:"),
			   "</span>",
			   "<select CLASS=text_petit name=\"nivell\" onChange=\"PortamANivellDeZoom(parseInt(document.zoom.nivell.value));\">\n");

			for (var i=0; i<ParamCtrl.zoom.length; i++)
			{
			    cdns.push("<OPTION VALUE=\"",i,"\"",
			    	((i==DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual)) ? " SELECTED" : "") ,">",
				(EscriuDescripcioNivellZoom(i, crs ? crs : ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, false)), "</OPTION>\n");
			}
			cdns.push("</select>\n");
		}
		if (ParamCtrl.BarraBotoCTipica && ParamCtrl.ConsultaTipica)
			cdns.push(CadenaBotoPolsable("consulta_tipica_i", "ctipica", GetMessage("TypicalOrObjectQuery", "barra"), "MostraOAmagaCtipiques();"));
		for (i=0; i<ParamCtrl.capa.length; i++)
		{
		 	if (ParamCtrl.capa[i].descarregable!="no")
			{
			    //window.document.write("&nbsp;");
				cdns.push(CadenaBotoPolsable("getmmz", "getmmz", GetMessage("Download"), "ObtenirMMZ();"),"\n");
				break;
			}
		}

		for (i=0; i<ParamCtrl.capa.length; i++)
		{
		 	if (ParamCtrl.capa[i].animable)
			{
				cdns.push((CadenaBotoPolsable("video", "video", GetMessage("TimeSeriesAnimations", "barra"),
					"MostraFinestraVideo();")),"\n");
				break;
			}
		}

		if (ParamCtrl.BarraBotoCaixaParam)
			cdns.push((CadenaBotoPolsable("param", "param", GetMessage("Options"), "MostraFinestraParametres();")));
		if (ParamCtrl.BarraBotoConsola)
			cdns.push((CadenaBotoPolsable("consola", "consola", GetMessage("Console", "consola"), "MostraFinestraConsola();")));
		if (ParamCtrl.BarraBotoEnllac)
			cdns.push((CadenaBotoPolsable("enllac", "enllac", GetMessage("LinkToMap", "barra"), "MostraFinestraEnllac();")));
		if (ParamCtrl.BarraBotoEnllacWMS)
			cdns.push((CadenaBotoPolsable("enllacWMS", "enllacWMS", GetMessage("LinksToServers", "barra"), "MostraFinestraEnllacWMS();")));
		if (ParamCtrl.BarraBotoAfegeixCapa)
			cdns.push((CadenaBotoPolsable("afegirCapa", "afegirCapa", GetMessage("AddLayers"), "IniciaFinestraAfegeixCapaServidor(NumeroDeCapesVolatils(-1));")));
		if (ParamCtrl.BarraBotoCalculadora)
			cdns.push((CadenaBotoPolsable("calculadora", "calculadora", GetMessage("LayerCalculator", "cntxmenu"), "IniciaFinestraCalculadoraCapes();")));
		if (ParamCtrl.BarraBotoCombiCapa)
			cdns.push((CadenaBotoPolsable("combicapa", "combicapa", GetMessage("AnalyticalCombinationLayers", "cntxmenu"), "IniciaFinestraCombiCapa();")));
		cdns.push("\n");

		if (ParamCtrl.BarraBotoPrint)
			cdns.push((CadenaBotoPolsable("print", "print", GetMessage("Print"), "ObreTriaFullImprimir();")));
		if (ParamCtrl.BarraBotoPlanaPrincipal)
			cdns.push((CadenaBotoPolsable("home", "home", GetMessage("RestartFromServer", "barra"), "RestartMiraMonMapBrowser();")));
		if (ParamCtrl.BarraBotoInstallarMMZ)
			cdns.push((CadenaBotoPolsable("instmmr", "instmmr",
				GetMessage("InstallMiraMonReader", "barra"),
				"InstalaLectorMapes();")));
		if (ParamCtrl.StoryMap && ParamCtrl.StoryMap.length)
			cdns.push((CadenaBotoPolsable("storyMap", "storyMap", GetMessage("Storymaps", "storymap"), "MostraFinestraTriaStoryMap();")));
		if (ParamCtrl.BarraBotoAjuda)
			cdns.push((CadenaBotoPolsable("ajuda", "ajuda", GetMessage("InteractiveHelp"),
				"ObreFinestraAjuda();")));

		if (ParamCtrl.accessClientId || ParamCtrl.AltresLinks)
			cdns.push("\n");
		if (ParamCtrl.accessClientId)
			cdns.push((CadenaBotoPolsable("login", "login", GetMessage("Login", "authens"), "FerLoginICarregaCapes();")));
		if (ParamCtrl.AltresLinks)
			cdns.push((CadenaBotoPolsable(ParamCtrl.AltresLinks.boto, ParamCtrl.AltresLinks.boto, DonaCadena(ParamCtrl.AltresLinks.text_boto), ParamCtrl.AltresLinks.funcio)));

		if (ParamCtrl.BarraBotonsIdiomes && ParamCtrl.idiomes.length>1)
		{
			//var boto_per_defecte=(ParamCtrl.idioma=="cat")?0:((ParamCtrl.idioma=="spa")?1:2);
			var boto_per_defecte;
			for (boto_per_defecte=0; boto_per_defecte<ParamCtrl.idiomes.length; boto_per_defecte++)
			{
				if (ParamCtrl.idiomes[boto_per_defecte]==ParamCtrl.idioma)
					break;
			}
			if (boto_per_defecte==ParamCtrl.idiomes.length)
				boto_per_defecte=0;
			if (ParamCtrl.idiomes.length>1)
			{
				var botons=[];
				for(i=0; i<ParamCtrl.idiomes.length; i++)
					botons.push({"src": "idioma_"+ParamCtrl.idiomes[i], "alt": DonaCadenaConcret(GetMessageJSON("TheLanguageName"), ParamCtrl.idiomes[i]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[i]+"\');"});
				cdns.push(" ", CadenaBotonsAlternatius("idioma_"+ParamCtrl.idiomes[boto_per_defecte], botons, true, (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.nfil) ? ParamCtrl.BarraEstil.nfil-6 : 17, (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.nfil) ? ParamCtrl.BarraEstil.nfil-2 : 21), "\n");
			}
		}
	}
	cdns.push("</FORM>\n");
	var elem=getLayer(window, "barra");
	if (isLayer(elem))
	{
		contentLayer(elem, cdns.join(""));
		if (window.document.zoom.nivell)
			window.document.zoom.nivell.focus();
	}
}//Fi de CreaBarra()

