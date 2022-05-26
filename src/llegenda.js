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

    Aquest codi JavaScript ha estat idea de Joan Mas� Pau (joan maso at uab cat) 
    amb l'ajut de N�ria Juli� (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon �s un projecte del 
    CREAF que elabora programari de Sistema d'Informaci� Geogr�fica 
    i de Teledetecci� per a la visualitzaci�, consulta, edici� i an�lisi 
    de mapes r�sters i vectorials. Aquest programari inclou
    aplicacions d'escriptori i tamb� servidors i clients per Internet.
    No tots aquests productes s�n gratu�ts o de codi obert. 
    
    En particular, el Navegador de Mapes del MiraMon (client per Internet) 
    es distribueix sota els termes de la llic�ncia GNU Affero General Public 
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.
    
    El Navegador de Mapes del MiraMon es pot actualitzar des de 
    https://github.com/grumets/MiraMonMapBrowser.
*/

"use strict"

//https://www.freecodecamp.org/news/css-shapes-explained-how-to-draw-a-circle-triangle-and-more-using-pure-css

function DonaCaracterHexaMultiple3(s)
{
	if (s=='1')
		return '0';
	if (s=='2' || s=='4')
		return '3';
	if (s=='5' || s=='7')
		return '6';
	if (s=='8' || s=='a' || s=='A')
		return '9';
	if (s=='b' || s=='B' || s=='C' || s=='d' || s=='D')
		return 'c';
	if (s=='e' || s=='E' || s=='F')
		return 'f';
	return s;
}

/*function DonaFitxerColor(c)
{
	//Arrodoneix el valor del color
	var s=new String(c)	
	if (s.toLowerCase()=="#e6f2ff")
		s="colors/c"+s.substring(1,7)+".gif";	
	else
	{
		if (s.charAt(0)=='#')
		{
			if (s.length!=7)
				alert("Unsupported hexadecimal format color \"" + s +"\". Hexadecimal colors should follow the exact format \"#RRGGBB\". If first digits are 0, manually add 0 digits at the left hand side.");
			s="colors/c"+DonaCaracterHexaMultiple3(s.substring(1,2))+DonaCaracterHexaMultiple3(s.charAt(1))+DonaCaracterHexaMultiple3(s.substring(3,4))+DonaCaracterHexaMultiple3(s.charAt(3))+DonaCaracterHexaMultiple3(s.substring(5,6))+DonaCaracterHexaMultiple3(s.charAt(5))+".gif";
		}
	}
	return s;
}*/

function EsColorSimilar(c, c2)
{
	if (!c || !c2 || !c.length || !c2.length)
		return false;
	if (c.charAt(0)!="#"  || c.length!=7 )
	{
		alert("Unsupported hexadecimal format color \"" + c +"\". Hexadecimal colors should follow the exact format \"#RRGGBB\". If first digits are 0, manually add 0 digits at the left hand side.");
		return false;
	}
	if (c2.charAt(0)!="#" || c2.length!=7)
	{
		alert("Unsupported hexadecimal format color \"" + c +"\". Hexadecimal colors should follow the exact format \"#RRGGBB\". If first digits are 0, manually add 0 digits at the left hand side.");
		return false;
	}
	if (DonaCaracterHexaMultiple3(c.charAt(1))==DonaCaracterHexaMultiple3(c2.charAt(1)) && 
	    DonaCaracterHexaMultiple3(c.charAt(3))==DonaCaracterHexaMultiple3(c2.charAt(3)) &&
	    DonaCaracterHexaMultiple3(c.charAt(5))==DonaCaracterHexaMultiple3(c2.charAt(5)))
		return true;
	return false;
}

//https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
//Note that it "mirrors over the middle of the color", so colors close to the middle get a color very close to it. e.g. invertHex('808080'); produces '7F7F7F' which is almost the same color.
function invertColor(c) {
	if (c.charAt(0)!="#"  || c.length!=7 )
		return c;
	return "#" + (Number(`0x1${c.substring(1)}`) ^ 0xFFFFFF).toString(16).substr(1).toLowerCase();
}

function DonaCadenaHTMLSimbolUnicLlegenda(estil)
{
var cdns=[];
	cdns.push("<td valign=\"middle\">");
	if (estil.TipusObj=="S")
		cdns.push("<img src=\"", AfegeixAdrecaBaseSRC(estil.ItemLleg[0].color), "\">");
	else if (estil.TipusObj=="L" || estil.TipusObj=="P")
	{
		cdns.push('<span style="width:' , 16 - (EsColorSimilar(estil.ItemLleg[0].color, ParamCtrl.ColorFonsPlana) ? 2 : 0), 'px;height:', ((estil.TipusObj=="P") ? 8 : 3) - (EsColorSimilar(estil.ItemLleg[0].color, ParamCtrl.ColorFonsPlana) ? 2 : 0), 'px;background:', estil.ItemLleg[0].color, (EsColorSimilar(estil.ItemLleg[0].color, ParamCtrl.ColorFonsPlana) ? ';border-color:'+ invertColor(ParamCtrl.ColorFonsPlana) +';border-width:1;border-style:solid' : '') , ';display:inline-block;vertical-align:middle"></span>');
		/*cdns.push("<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"><tr><td><img src=\"" ,
					AfegeixAdrecaBaseSRC(DonaFitxerColor(estil.ItemLleg[0].color)), "\" width=\"18\" height=\"",
					((estil.TipusObj=="P") ? 10 : 2), "\"></td></tr></table>");*/
	}
	cdns.push("</td><td valign=\"middle\" nowrap>");
	return cdns.join("");
}

function DonaCadenaHTMLSimbolMultipleLlegenda(estil, aspecte)
{
var cdns=[];

	var ncol_items=estil.ncol ? estil.ncol : 1;
	var salt_entre_columnes=Math.floor(estil.ItemLleg.length/ncol_items)+((estil.ItemLleg.length%ncol_items!=0) ? 1 : 0);
	cdns.push("<TABLE border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	for (var j=0; j<salt_entre_columnes; j++)
	{
		cdns.push("<tr><td valign=\"middle\"><img src=\"",
				  AfegeixAdrecaBaseSRC("1tran.gif"), 
				  "\" width=\"4\" height=\"1\"></td>");
		for (var k=0; k<ncol_items; k++)
		{
			var l=j+k*salt_entre_columnes;
			if (l<estil.ItemLleg.length)
			{
				cdns.push("<td valign=\"middle\">");
				if (estil.TipusObj=="S")
					cdns.push("<img src=\"", AfegeixAdrecaBaseSRC(estil.ItemLleg[l].color), "\">");
				else if (estil.TipusObj=="L" || estil.TipusObj=="P")
				{
					cdns.push('<span style="width:', 12 - (EsColorSimilar(estil.ItemLleg[l].color, ParamCtrl.ColorFonsPlana) ? 2 : 0),'px;height:', ((estil.TipusObj=="P") ? 8 : 3) - (EsColorSimilar(estil.ItemLleg[l].color, ParamCtrl.ColorFonsPlana) ? 2 : 0), 'px;background:', estil.ItemLleg[l].color, (EsColorSimilar(estil.ItemLleg[l].color, ParamCtrl.ColorFonsPlana) ? ';border-color:'+ invertColor(ParamCtrl.ColorFonsPlana) +';border-width:1;border-style:solid' : ''), ';display:inline-block;vertical-align:middle"></span>');
					/*cdns.push("<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"><tr><td><img src=\"",
						AfegeixAdrecaBaseSRC(DonaFitxerColor(estil.ItemLleg[l].color)),
						"\" width=\"10\" height=\"",
						((estil.TipusObj=="P") ? 6 : 2),
						"\"></td></tr></table>");*/
				}
				cdns.push("</td>",
					"<td valign=\"middle\"><img src=\"",
					AfegeixAdrecaBaseSRC("1tran.gif"), 
					"\" width=\"2\" height=\"1\"></td>",
					"<td valign=\"middle\">",aspecte.PreviDescColor,
						(DonaCadena(estil.ItemLleg[l].DescColor)==null ? 
							"" : DonaCadena(estil.ItemLleg[l].DescColor)) ,
						aspecte.PostDescColor,"</td>");
			}
			else
				cdns.push("<td colspan=3 valign=\"middle\">",aspecte.PreviDescColor,"&nbsp;",aspecte.PostDescColor,"</td>");
		}
		cdns.push("</tr>");
	}
	cdns.push("</TABLE>");
	return cdns.join("");
}

function CreaItemLlegDePaletaSiCal(i_capa, i_estil)
{
var capa=ParamCtrl.capa[i_capa];

	if (!capa.estil)
		return;

var estil=capa.estil[i_estil];
var a, value, valor_min, valor_max, i_color, value_text, ncolors, colors, ample, n_item_lleg_auto;

	if (estil.ItemLleg && estil.ItemLleg.length>0)
		return;  //No cal fer-la: ja est� feta.

	if (estil.paleta && estil.paleta.ramp && !estil.paleta.colors)
		TransformRampToColorsArray(estil.paleta);
	colors=(estil.paleta && estil.paleta.colors) ? estil.paleta.colors : null;
	ncolors=colors ? colors.length : 256;

	/*if (estil.categories && estil.atributs)
	{
		var desc
		//La llegenda es pot generar a partir de la llista de categories i la paleta.

		estil.ItemLleg=[];
		ncolors=(estil.categories.length>ncolors) ? ncolors : estil.categories.length;
		
		for (var i=0, i_color=0; i_color<ncolors; i_color++)
		{
			if (!estil.categories[i_color])
				continue;
			desc=DonaDescCategoriaDesDeColor(estil.categories, estil.atributs, i_color, true);
			if (desc=="")
				continue;
			estil.ItemLleg[i]={"color": (colors) ? colors[i_color] : RGB(i_color,i_color,i_color), "DescColor": desc};
			i++;
		}	
		return;
	}*/

	if (!estil.component || estil.component.length==0 || estil.component.length>2)
		return;

	//La llegenda es pot generar a partir d'estirar la paleta.
	a=DonaFactorAEstiramentPaleta(estil.component[0].estiramentPaleta, ncolors);
	valor_min=DonaFactorValorMinEstiramentPaleta(estil.component[0].estiramentPaleta);
	valor_max=DonaFactorValorMaxEstiramentPaleta(estil.component[0].estiramentPaleta, ncolors);

	if (!estil.nItemLlegAuto)
	{
		if (estil.nItemLlegAuto===0)
			return;
		n_item_lleg_auto=ncolors;
	}
	else
		n_item_lleg_auto=estil.nItemLlegAuto;

	ample=(valor_max-valor_min)/n_item_lleg_auto;
	if (estil.ColorMinimASota)
		ample=-ample;

	estil.ItemLleg=[];
	for (var i=0, value=(estil.ColorMinimASota ? valor_max+ample/2: ample/2+valor_min); (estil.ColorMinimASota) ? value>valor_min : value<valor_max; value+=ample)
	{
		i_color=Math.floor(a*(value-valor_min));
		if (i_color>=ncolors)	
			i_color=ncolors-1;
		else if (i_color<0)
			i_color=0;

		if (estil.categories && estil.atributs)
		{
			value_text=DonaDescCategoriaDesDeColor(estil.categories, estil.atributs, parseInt(value), true);
			if (value_text=="")
				continue;
		}
		else
		{
			if (estil.descColorMultiplesDe)
				value_text=multipleOf(value, estil.descColorMultiplesDe) 
			else
				value_text=value;
			if (estil.component[0].NDecimals!=null)
				value_text=OKStrOfNe(parseFloat(value_text), estil.component[0].NDecimals);
		}
		estil.ItemLleg[i]={"color": (colors) ? colors[i_color] : RGB(i_color,i_color,i_color), "DescColor": value_text};
		i++;
	}
}

function DonaCadenaImgCanviaEstatCapa(i, estat)
{
var cdns=[], lletra, msg, nom_gif, width=-1, capa=ParamCtrl.capa[i];

	if (estat=="consultable")
	{
		lletra="c";
		msg=(capa[estat]=="si") ? GetMessage("queryable", "llegenda") : GetMessage("nonQueryable", "llegenda");
		if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
			nom_gif=(capa[estat]=="si" ? estat : "ara_no_"+estat);
		else
			nom_gif=estat;
		width=14;
	}
	else if (estat=="descarregable")
	{
		lletra="z";
		msg=(capa[estat]=="si") ? GetMessage("downloadable", "llegenda") : GetMessage("nonDownloadable", "llegenda");
		if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
			nom_gif=(capa[estat]=="si" ? estat : "ara_no_"+estat);
		else
			nom_gif=estat;
	}
	else
	{
		lletra="v";
		msg=(capa[estat]=="si") ? GetMessage("visible", "llegenda") : GetMessage("nonVisible", "llegenda");
		if (capa.grup && ParamCtrl.LlegendaGrupsComARadials)
		{
			if (capa.visible=="si")
			{
				nom_gif="radio"; 
				msg=GetMessage("visible", "llegenda");
			}
			else if (capa.visible=="semitransparent")
			{	
				nom_gif="semi_radio"; 
				msg=GetMessage("semitransparent", "llegenda");
			}
			else
			{	
				nom_gif="ara_no_radio"; 
				msg=GetMessage("nonVisible", "llegenda");
			}
			if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors)
				width=14;
		}
		else
		{
			if (capa.visible=="si")
			{
				nom_gif="visible"; 
				msg=GetMessage("visible", "llegenda");
			}
			else if (capa.visible=="semitransparent")
			{	
				nom_gif="semitransparent"; 
				msg=GetMessage("semitransparent", "llegenda");
			}
			else
			{	
				nom_gif="ara_no_visible"; 
				msg=GetMessage("nonVisible", "llegenda");
			}
			if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors)
				width=17;
		}
	}

	return DonaTextImgGifSvg(lletra+"_ll_capa"+i, null, nom_gif, width, msg, "CanviaEstatCapa("+i+", \""+estat+"\");");
}

function DonaCadenaImgCanviaEstilCapa(i_capa, i_estil, repinta_si_mateix_estil)
{
var cdns=[], nom_gif, capa=capa=ParamCtrl.capa[i_capa];

	return DonaTextImgGifSvg("e_raster_vector"+i_capa+"_"+i_estil, null, (i_estil==capa.i_estil ? "radio" : "ara_no_radio"), 14, null, "CanviaEstilCapa("+i_capa+", "+i_estil+", "+repinta_si_mateix_estil+");");
}

function CanviaSelectorEstilCapa(input, i_capa, i_estil, i_comp, i_sltr)
{
	ParamCtrl.capa[i_capa].estil[i_estil].component[i_comp].selector[i_sltr].valorActual=parseFloat(input.value);
	delete ParamCtrl.capa[i_capa].estil[i_estil].component[i_comp].formulaInterna;
	CanviaEstilCapa(i_capa, i_estil, true);
}

function DeterminaAlgunaCapa(flag)
{
var capa, alguna={desplegable:1, visible:1, consultable:1, descarregable:1, getcoverage:1, WPS:1};

	if (flag&LlegendaAmbControlDeCapes)
	{
		if (!ParamCtrl.LlegendaIconesInactivesGrises)
		{
			alguna.visible=0;
			alguna.consultable=0;
			alguna.descarregable=0;			
			alguna.getcoverage=0;
			alguna.WPS=0;
			for (var i=0; i<ParamCtrl.capa.length; i++)
			{
				if (EsIndexCapaVolatil(i, ParamCtrl))
					continue;
				capa=ParamCtrl.capa[i];
				/*if (capa.model==model_vector)
				{
					if ((ParamCtrl.LlegendaAmagaSegonsEscala && !EsCapaDinsRangDEscalesVisibles(capa)) ||
						!capa.VisibleALaLlegenda)
						continue;
					if (capa.visible!="no")
						alguna.visible=1;
					if (capa.consultable!="no")
						alguna.consultable=1;
				}
				else
				{*/
					if(!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa))
						continue;
					if (capa.visible!="no")
						alguna.visible=1;
					if (capa.consultable!="no")
						alguna.consultable=1;
					if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable!=true && capa.descarregable!="no")
						alguna.descarregable=1;
					if (EsCapaDecarregableIndividualment(capa))
						alguna.getcoverage=1;
					if (capa.proces)
						alguna.WPS=1;
				//}
			}
		}
	}
	else
	{
		alguna.desplegable=0;
		alguna.visible=0;
		alguna.consultable=0;
		alguna.descarregable=0;
		alguna.getcoverage=0;
		alguna.WPS=0;
	}
	return alguna;
}

function DonaCadenaHTMLEstilItemLlegenda(i_capa, aspecte, flag)
{
var cdns=[], cal_retorn=false;

	var capa=ParamCtrl.capa[i_capa];
	var estil=capa.estil[capa.i_estil];
	cdns.push(aspecte.PreviDescItems);
	if (capa.model!=model_vector &&  capa.visible!="ara_no" &&
		estil.component && estil.component.length && estil.component[0].selector && estil.component[0].selector.length)
	{
		for (var i_sltr=0; i_sltr<estil.component[0].selector.length; i_sltr++)
		{
			var selector=estil.component[0].selector[i_sltr];

			if (selector.categories && selector.categories.length && selector.atributs)
			{
				if (selector.categories.length>1)
				{
					if (cal_retorn)
						cdns.push("<br>");
					else
						cal_retorn=true;
					cdns.push(DonaCadena(selector.desc), ": ",
					          "<select id=\"selector-lleg-", i_capa, "-i_estil-", capa.i_estil, "-sltr-", i_sltr, "\" onChange=\"CanviaSelectorEstilCapa(this, "+i_capa+", "+capa.i_estil+", 0, " +i_sltr+ ");\">");
					for (var i_cat=0; i_cat<selector.categories.length; i_cat++)
					{
						if (selector.categories[i_cat])
						{
							cdns.push("<option value=\"",i_cat,"\"",
								((i_cat==selector.valorActual) ? " selected=\"selected\"" : "") ,
								">", DonaTextCategoriaDesDeColor(selector.categories, selector.atributs, i_cat, true), "</option>");
						}
					}
					cdns.push("</select>");
				}
			}
			else
			{
				if (cal_retorn)
					cdns.push("<br>");
				else
					cal_retorn=true;
				cdns.push(DonaCadena(selector.desc), ": ", 
					"<input type=\"text\" id=\"selector-lleg-", i_capa, "-i_estil-", capa.i_estil, "-sltr-",i_sltr,"\" value=\"", selector.valorActual, "\" onChange='CanviaSelectorEstilCapa(this, "+i_capa+", "+capa.i_estil+", 0, " +i_sltr+ ");'/>");
				if (selector.estiramentPaleta && typeof selector.estiramentPaleta.valorMaxim!=="undefined" && typeof selector.estiramentPaleta.valorMinim!=="undefined")
					cdns.push(" [", selector.estiramentPaleta.valorMinim, ",", selector.estiramentPaleta.valorMaxim, "]");
			}
		}
	}

	//Si la capa t� una paleta, defineixo els colors de la llegenda aqu�. Necessari si m'han canviar l'estil de visualitzaci� i no s'havia calculat abans.
	CreaItemLlegDePaletaSiCal(i_capa, capa.i_estil);

	//Llegenda si hi ha m�s d'un item
	if (estil.ItemLleg && estil.ItemLleg.length>1 && 
		(!(flag&LlegendaAmbControlDeCapes) || capa.LlegDesplegada) &&
		capa.visible!="ara_no")
	{
		if (estil.DescItems)
		{
			if (cal_retorn)
				cdns.push("<br>");
			else
				cal_retorn=true;
			cdns.push(DonaCadena(estil.DescItems))
		}
		if (cal_retorn)
			cdns.push("<br>");
		else
			cal_retorn=true;
		cdns.push(DonaCadenaHTMLSimbolMultipleLlegenda(estil, aspecte));
	}
	cdns.push(aspecte.PostDescItems);
	return cdns.join("");
}

var LlegendaAmbControlDeCapes=0x01;
var LlegendaAmbCapesNoVisibles=0x02;

function DonaCadenaHTMLLlegenda(aspecte, flag)
{
var salt_entre_columnes, cdns=[], capa, estil;

	var alguna=DeterminaAlgunaCapa(flag);

	if (flag&LlegendaAmbControlDeCapes)
		cdns.push("<form name=\"form_llegenda\">");			

	//Inici de taula i regle d'un p�xel
	cdns.push((aspecte.CapcaleraLlegenda?DonaCadena(aspecte.CapcaleraLlegenda):""),
			"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr>");
	if (alguna.desplegable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"", ((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? 7 : 9), "\" height=\"1\"></td>");
	if (alguna.visible)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"", ((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? 10 : 19), "\" height=\"1\"></td>");
	if (alguna.consultable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"16\" height=\"1\"></td>");
	if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable!=true && alguna.descarregable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"18\" height=\"1\"></td>");
	if (alguna.getcoverage)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"", ((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? 20 : 16), "\" height=\"1\"></td>");
	if (alguna.WPS)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"22\" height=\"1\"></td>");		
	cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"27\" height=\"1\"></td><td><img src=\"",
									AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"300\" height=\"1\"></td></tr>");

	for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		if (EsIndexCapaVolatil(i_capa, ParamCtrl))
			continue;
		capa=ParamCtrl.capa[i_capa];
	    if (capa.separa!=null)
	    {
	        if (ParamCtrl.LlegendaAmagaSeparaNoCapa &&
	        	(!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa) ||
			    (capa.visible!="si" && capa.visible!="semitransparent" && !(flag&LlegendaAmbCapesNoVisibles))))
	        {
	 		    //Busco si hi ha alguna capa visible fins al pr�xim separador
				var capa2;
				for (var i2=i_capa+1; i2<ParamCtrl.capa.length; i2++)
		 		{
					capa2=ParamCtrl.capa[i2];
					if (capa2.separa)
						break;
					if (!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa2) ||
						(capa2.visible!="si" && capa2.visible!="semitransparent" && !(flag&LlegendaAmbCapesNoVisibles)))
					{
						continue;
					}
						
					cdns.push("<tr><td colspan=");
					if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)					
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
					else
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
					cdns.push(" valign=\"middle\">",aspecte.PreviSepara , DonaCadena(capa.separa) , aspecte.PostSepara , "</td></tr>");
					break;
				}
			}
			else
	    	{
			    cdns.push("<tr><td colspan=");
				if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
				else
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
				cdns.push(" valign=\"middle\">",aspecte.PreviSepara , DonaCadena(capa.separa) , aspecte.PostSepara , "</td></tr>");

	    	}
	    }

	    if (!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa) ||
		   (capa.visible!="si" && capa.visible!="semitransparent" && !(flag&LlegendaAmbCapesNoVisibles)) )
			continue;

		if (flag&LlegendaAmbControlDeCapes)
		{
			cdns.push("<tr><td valign=\"middle\">");
		
			//Icones de + o -:
			if (capa.estil && capa.estil.length>0 && 
				(!capa.grup || !(ParamCtrl.LlegendaGrupsComARadials) || (capa.visible!="no" && capa.visible!="ara_no")) &&
				(!(ParamCtrl.LlegendaGrisSegonsEscala) || EsCapaDinsRangDEscalesVisibles(capa)) &&
				(!(ParamCtrl.LlegendaGrisSiForaAmbit) || EsCapaDinsAmbitActual(capa)) &&
				((capa.estil[capa.i_estil].ItemLleg && capa.estil[capa.i_estil].ItemLleg.length>1) || (capa.estil[capa.i_estil].nItemLlegAuto && capa.estil[capa.i_estil].nItemLlegAuto>1)))
			{
				cdns.push(DonaTextImgGifSvg("m_ll_capa"+i_capa, null, (capa.LlegDesplegada ? "menys": "mes"), 8, GetMessage(capa.LlegDesplegada ? "foldLegend" : "unfoldLegend", "llegenda"), 
						"CanviaEstatCapa("+i_capa+", \"lleg_desplegada\");"));
			}
			else
			{
				//cdns.push(DonaTextImgGifSvg("m_ll_capa"+i_capa, null, "menysg", 8, null, null));
				cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"8\" height=\"1\">");
			}
			cdns.push("</td>");
			//Icones d'estats:
			//Icones visible:
			if (capa.visible=="no")
			{
				if (alguna.visible)
				{
					if (ParamCtrl.LlegendaIconesInactivesGrises)
					{
						if (capa.grup!=null && capa.grup!="")
							cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_radiog.gif"), 
									  "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_visibleg.gif"), 
									  "\" align=middle></td>");
					}
					else
						cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("1tran.gif"), 
								  "\" width=\"5\" height=\"1\"></td>");
				}
			}
			else if ((ParamCtrl.LlegendaGrisSegonsEscala && !EsCapaDinsRangDEscalesVisibles(capa)) ||
				 (ParamCtrl.LlegendaGrisSiForaAmbit && !EsCapaDinsAmbitActual(capa)))
			{
				if (capa.grup!=null && capa.grup!="")
				{
					if (capa.visible=="ara_no")
						cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("ara_no_radiog.gif"),  
							  "\" align=middle></td>");
					else
						cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("radiog.gif"), 
							  "\" align=middle></td>");
				}
				else
				{
					if (capa.visible=="ara_no")
						cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("ara_no_visibleg.gif"), 
								  "\" align=middle></td>");
					else
						cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("visibleg.gif"), 
								  "\" align=middle></td>");
				}
			}
			else
			{
				cdns.push("<td valign=\"middle\">",
					DonaCadenaImgCanviaEstatCapa(i_capa, "visible"),
					"</td>");
				cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"3\" height=\"1\">");
			}
			//Icones consultable:
			if (capa.consultable=="no")
			{
				if (alguna.consultable)
				{
					if (ParamCtrl.LlegendaIconesInactivesGrises)
						cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("ara_no_consultableg.gif"),  
							  "\" align=middle></td>");
					else
						cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("1tran.gif"), 
							  "\" width=\"1\" height=\"1\"></td>");
				}
			}
			else if ((ParamCtrl.LlegendaGrisSegonsEscala && !EsCapaDinsRangDEscalesVisibles(capa)) ||
				 (ParamCtrl.LlegendaGrisSiForaAmbit && !EsCapaDinsAmbitActual(capa)))
			{
				if (capa.consultable=="ara_no")
					cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("ara_no_consultableg.gif"),  
							  "\" align=middle></td>");
				else
					cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("consultableg.gif"), 
							  "\" align=middle></td>");
			}
			else
			{
				cdns.push("<td valign=\"middle\">",
					DonaCadenaImgCanviaEstatCapa(i_capa, "consultable"),
					"</td>");
			}
			//Icones descarregable:
			if (!ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
			{
				if (capa.descarregable=="no")
				{
					if (alguna.descarregable)
					{
						if (ParamCtrl.LlegendaIconesInactivesGrises)
							cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("ara_no_descarregableg.gif"), 
								  "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("1tran.gif"), 
								  "\" width=\"1\" height=\"1\"></td>");
					}
				}
				else if ((ParamCtrl.LlegendaGrisSegonsEscala && !EsCapaDinsRangDEscalesVisibles(capa)) ||
					 (ParamCtrl.LlegendaGrisSiForaAmbit && !EsCapaDinsAmbitActual(capa)))
				{
					if (capa.descarregable=="ara_no")
						cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("ara_no_descarregableg.gif"), 
								  "\" align=middle></td>");
					else
						cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("descarregableg.gif"), 
								  "\" align=middle></td>");
				}
				else
				{
					cdns.push("<td valign=\"middle\">",
						DonaCadenaImgCanviaEstatCapa(i_capa, "descarregable"),
						"</td>");
				}
			}
		}
		//Bot� de GetCovergage:
		if (EsCapaDecarregableIndividualment(capa))
		{
			cdns.push("<td valign=\"middle\">",
				CadenaBotoPolsable("getcov"+i_capa, "getcov", GetMessage("Download").toLowerCase(), "MostraFinestraDownload("+i_capa+")", 14),
				"</td>");
		}
		else
		{
			if (alguna.getcoverage)
				cdns.push("<td valign=\"middle\"><img src=\"",
						  AfegeixAdrecaBaseSRC("1tran.gif"), 
						  "\" width=\"1\" height=\"1\"></td>");
		}

		//Bot� de WPS
		if(capa.proces==null)
		{
			if (alguna.WPS)
				cdns.push("<td valign=\"middle\"><img src=\"",
					  AfegeixAdrecaBaseSRC("1tran.gif"), 
					  "\" width=\"1\" height=\"1\"></td>");
		}
		else
			cdns.push("<td valign=\"middle\">",
						(CadenaBotoPolsable("excutewps"+i_capa, "executewps", 
								DonaCadenaLang({"cat":"servei de processos", "spa":"servicio de procesos", "eng":"processing service","fre":"service des processus"}), 
								"IniciaFinestraExecutaProcesCapa("+i_capa+")")),
						"</td>");


		//Si la capa t� una paleta, defineixo els colors de la llegenda aqu�.
		CreaItemLlegDePaletaSiCal(i_capa, capa.i_estil);

		//Icona o color general per tota la capa en cas de simbol �nic.
		if (capa.estil && capa.estil.length && capa.estil[capa.i_estil].ItemLleg && 
			capa.estil[capa.i_estil].ItemLleg.length==1 &&
			(!(ParamCtrl.LlegendaGrisSegonsEscala) || EsCapaDinsRangDEscalesVisibles(capa)) &&
				(!(ParamCtrl.LlegendaGrisSiForaAmbit) || EsCapaDinsAmbitActual(capa)))
			cdns.push(DonaCadenaHTMLSimbolUnicLlegenda(capa.estil[capa.i_estil]));
		else
			cdns.push("<td colspan=2 valign=\"middle\" nowrap>");

		//Nom de capa
		if (flag&LlegendaAmbControlDeCapes)
		{
			if (isLayer(window, "menuContextualCapa"))
				cdns.push("<a href=\"javascript:void(0);\" style=\"cursor:context-menu;\" onClick=\"OmpleLayerContextMenuCapa(event,",i_capa,");\" onContextMenu=\"return OmpleLayerContextMenuCapa(event,",i_capa,");\">");
			else if (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades.standard))
				cdns.push("<a href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i_capa,",-1);\" title=\"", 
					DonaCadenaLang({"cat":"metadades", "spa":"metadatos", "eng":"metadata","fre":"m�tadonn�es"}), "\">");
		}		
		if ((ParamCtrl.LlegendaGrisSegonsEscala && !EsCapaDinsRangDEscalesVisibles(capa)) ||
			(ParamCtrl.LlegendaGrisSiForaAmbit && !EsCapaDinsAmbitActual(capa)))
			cdns.push(aspecte.PreviDescLlegendaGris, DonaCadena(capa.DescLlegenda), aspecte.PostDescLlegendaGris);
		else
			cdns.push(aspecte.PreviDescLlegenda , DonaCadena(capa.DescLlegenda) , aspecte.PostDescLlegenda);
		
		if (flag&LlegendaAmbControlDeCapes && (isLayer(window, "menuContextualCapa") || (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades.standard))))
			cdns.push("</a>");
		cdns.push("</td></tr>");

		//Control del temps si cal
		if (capa.visible!="no" && capa.visible!="ara_no" &&
			(!ParamCtrl.LlegendaGrisSegonsEscala || EsCapaDinsRangDEscalesVisibles(capa)) &&
				(!ParamCtrl.LlegendaGrisSiForaAmbit || EsCapaDinsAmbitActual(capa)))
		{
			if (capa.AnimableMultiTime)
			{
				if(capa.data)
				{
					if (flag&LlegendaAmbControlDeCapes)
					{
						cdns.push("<tr><td valign=\"middle\" colspan=2><img src=\"",
								  AfegeixAdrecaBaseSRC("1tran.gif"), 
								  "\"></td>",
						   "<td valign=\"middle\" colspan=");
						if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
						else
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
						cdns.push("><select CLASS=text_petit name=\"data_capa_",i_capa,"\" onChange=\"CanviaDataDeCapaMultitime(",
						   i_capa,", parseInt(document.form_llegenda.data_capa_",i_capa,".value));\">\n");
						var i_data_sel=DonaIndexDataCapa(capa, null);
						for (var i_data=0; i_data<capa.data.length; i_data++)
						{
							cdns.push("<OPTION VALUE=\"",i_data,"\"",
								((i_data==i_data_sel) ? " SELECTED" : "") ,
							">", DonaDataCapaPerLlegenda(i_capa,i_data) , "</OPTION>\n");
						}
						cdns.push("</select></td></tr>");
					}
					else
					{
						cdns.push("<td valign=\"middle\" colspan=3>",aspecte.PreviDescEstil, DonaDataCapaPerLlegenda(i_capa, null),
							aspecte.PostDescEstil , "</td>");
					}
				}
				else
				{
					alert(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) +" "+ DonaCadena(capa.desc) + " " +
						DonaCadenaLang({"cat":"indica que �s AnimableMultiTime per� no t� dates definides", "spa":"indica que es AnimableMultiTime pero no tiene fechas definidas", "eng":"indicates that is AnimableMultiTime but it has no dates defined", "fre":"Indique que c\'est AnimableMultiTime, mais il n\'a pas de dates d�finies"}));
				}
			}
			if (capa.dimensioExtra && capa.dimensioExtra.length)
			{
				for (var i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
				{
					var dim=capa.dimensioExtra[i_dim];
					if (flag&LlegendaAmbControlDeCapes)
					{
						cdns.push("<tr><td valign=\"middle\" colspan=2><img src=\"",
								  AfegeixAdrecaBaseSRC("1tran.gif"), 
								  "\"></td>",
							"<td valign=\"middle\" colspan=");
						if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
						else
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
						cdns.push(">", aspecte.PreviDescItems, DonaCadenaNomDesc(dim.clau), 
							": <select CLASS=text_petit name=\"dim_capa_",i_capa,"_",i_dim,"\" onChange=\"CanviaValorDimensioExtraDeCapa(",
							   i_capa,", parseInt(document.form_llegenda.dim_capa_",i_capa,"_",i_dim,".value));\">\n");
						for (var i_v_dim=0; i_v_dim<dim.valor.length; i_v_dim++)
						{
							cdns.push("<OPTION VALUE=\"",i_v_dim,"\"",
								((i_v_dim==dim.i_valor) ? " SELECTED" : "") ,
							">", DonaCadenaNomDesc(dim.valor[i_v_dim]), "</OPTION>\n");
						}
						cdns.push("</select>", aspecte.PostDescItems, "</td></tr>");
					}
					else
					{
						cdns.push("<td valign=\"middle\" colspan=3>",aspecte.PreviDescEstil, DonaCadenaNomDesc(dim.clau), ": ",  DonaCadenaNomDesc(dim.valor[dim.i_valor]),
							aspecte.PostDescEstil , "</td>");
					}
				}
			}
		}

		if (capa.estil && capa.estil.length && 
			(!capa.grup || !ParamCtrl.LlegendaGrupsComARadials || (capa.visible!="no" && capa.visible!="ara_no" &&
			(!ParamCtrl.LlegendaGrisSegonsEscala || EsCapaDinsRangDEscalesVisibles(capa)) &&
		        (!ParamCtrl.LlegendaGrisSiForaAmbit || EsCapaDinsAmbitActual(capa))
			)))
		{
			//Radials d'estil si cal	
			if (capa.estil.length>1 && capa.visible!="ara_no")
			{
				var ncol_estil=capa.NColEstil ? capa.NColEstil : 1;
				/*if (capa.NColEstil==0)
				{
					alert(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) +" "+ DonaCadenaNomDesc(capa) + " "+
							DonaCadenaLang({"cat":", "indica incorrectament 0 columnes dels items de la llegenda per� t�", "spa":"indica incorrectamente 0 columnas en los items de la leyenda pero tiene", "eng":"has been incorrectly set to 0 columns on the legend items but it has", "fre":"indique 0 colonnes des �l�ments de la l�gende mais a"}) +
							 " "+ estil.ItemLleg.length + " " + 
							DonaCadenaLang({"cat":"elements descrits. No es dibuixaran.", "spa":"elementos descritos. No es dibujaran.", "eng":"described elements. They will not be shown on the legend.", "fre":"�l�ments d�crits. Ils ne seront pas dessin�s."}));
				}
				else
				{*/
				    cdns.push("<tr>");
				    if (flag&LlegendaAmbControlDeCapes)
				    {
						cdns.push("<td valign=\"middle\" colspan=2><img src=\"",
								  AfegeixAdrecaBaseSRC("1tran.gif"), "\"></td>",
							  "<td valign=\"middle\" colspan=");
						if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
						else
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
						cdns.push("><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
						var salt_entre_columnes=Math.floor(capa.estil.length/ncol_estil)+((capa.estil.length%ncol_estil!=0) ? 1 : 0);
						for (var j=0; j<salt_entre_columnes; j++)
						{
							cdns.push("<tr><td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\" width=\"4\" height=\"1\"></td>");
							for (var k=0; k<ncol_estil; k++)
							{
								var l=j+k*salt_entre_columnes;
								if (l<capa.estil.length)
								{
									cdns.push("<td valign=\"middle\">",
										"<img src=\"",
										AfegeixAdrecaBaseSRC("1tran.gif"), 
										"\" width=\"4\" height=\"1\">",
										DonaCadenaImgCanviaEstilCapa(i_capa, l, false),
										"</td>",
										"<td valign=\"middle\"><img src=\"",
										AfegeixAdrecaBaseSRC("1tran.gif"), 
										"\" width=\"2\" height=\"1\"></td>",
										"<td valign=\"middle\">");
									if (isLayer(window, "menuContextualCapa"))
										cdns.push("<a href=\"javascript:void(0);\" style=\"cursor:context-menu;\" onClick=\"OmpleLayerContextMenuEstil(event,", i_capa, ",", l,");\" onContextMenu=\"return OmpleLayerContextMenuEstil(event,", i_capa, ",", l,");\">");
									cdns.push(aspecte.PreviDescEstil , DonaCadenaNomDesc(capa.estil[l]) , aspecte.PostDescEstil);
									cdns.push("</a>");
									cdns.push("</td>");
								}
								else
									cdns.push("<td colspan=3 valign=\"middle\">",aspecte.PreviDescEstil,"&nbsp;",aspecte.PostDescEstil,"</td>");
							}
							cdns.push("</tr>");
						}
						cdns.push("</table></td>");
				    }
				    else
				    {
						cdns.push("<td valign=\"middle\" colspan=3>" ,
							aspecte.PreviDescEstil, (DonaCadenaNomDesc(capa.estil[capa.i_estil])),
							aspecte.PostDescEstil, "</td>");
				    }
				    cdns.push("</tr>");
				//}				
			}

			//Contingut d'un estil a la llegenda (selectors, desc del items, i items de la llegenda
			cdns.push("<tr><td id=\"id-descrip-lleg-capa-", i_capa, "\" colspan=");
			if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
				cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
			else
				cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
			cdns.push(">");

			cdns.push(DonaCadenaHTMLEstilItemLlegenda(i_capa, aspecte, flag));

			cdns.push("</td></tr>");
		}
	}
	cdns.push("</table>",
		(aspecte.PeuLlegenda ? 
			(DonaCadena(aspecte.PeuLlegenda)!="" ? "<br>" + DonaCadena(aspecte.PeuLlegenda) : "") 
			: ""));
	if (flag&LlegendaAmbControlDeCapes)
		cdns.push("</form>");
	return cdns.join("");
}//Fi de DonaCadenaHTMLLlegenda()

function MostraFinestraLlegenda(event)
{
	showFinestraLayer(window, "llegenda");
	document.getElementById("llegenda_situacio_coord").innerHTML=DonaCadenaBotonsVistaLlegendaSituacioCoord();
	dontPropagateEvent(event);
}

//var scroll_llegenda_previ={"x": 0, "y": 0}; NOTA20200403-1912 Es descubreix que no es fa servir el 

function CreaLlegenda()
{
	var s=DonaCadenaHTMLLlegenda(ParamCtrl.AspecteLlegenda, LlegendaAmbControlDeCapes|LlegendaAmbCapesNoVisibles);

	var elem=getResizableLayer(window, "llegenda");

	if (isLayer(elem))
	{
		contentLayer(elem, s);
		//showLayer(elem);
		//Queda pendent el tema de la recuperaci� d'scrolls. Veure NOTA20200403-1912
	}
}

function EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa)
{
	if ((ParamCtrl.LlegendaAmagaSegonsEscala && !EsCapaDinsRangDEscalesVisibles(capa)) ||
		(ParamCtrl.LlegendaAmagaSiForaAmbit && !EsCapaDinsAmbitActual(capa)) ||
		!EsCapaDisponibleEnElCRSActual(capa) ||
		!capa.VisibleALaLlegenda)
		return false;
	return true;
}

function CanviaEstatVisibleCapaLlegenda(icon_capa, i)
{
var i_vista, capa=ParamCtrl.capa[i], capa2, grup_consultable=false;
var nom_icona=icon_capa.src ? TreuExtensio(TreuAdreca(icon_capa.src)) : null;

	if ( (nom_icona && (nom_icona=="ara_no_visible" || nom_icona=="ara_no_radio")) ||
		(!nom_icona && capa.visible=="ara_no") )
	{
		//pas a visible
		if (capa.grup)
		{
			for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
			{
				if (i_capa==i)
					continue;
				capa2=ParamCtrl.capa[i_capa];
				if (capa.grup==capa2.grup && 
				    EsCapaVisibleAAquestNivellDeZoom(capa2))
				{
					//In the case of groups We sincronize the querible (consultable) with the visible property.
					if (!(ParamCtrl.LlegendaGrupsComARadials && ParamCtrl.LlegendaGrupsComARadials==true))
					{
						if (!confirm(DonaCadenaLang({"cat":"No �s possible mostrar dues capes del mateix grup.\nLa capa \"" + DonaCadenaNomDesc(capa2) + "\", que tamb� format part del grup \"" + capa2.grup + "\", ser� desmarcada.",
													"spa":"No es posible mostrar dos capas del mismo grupo.\nLa capa \"" + DonaCadenaNomDesc(capa2) + "\", que tambi�n forma parte del grupo \"" + capa2.grup + "\", ser� desmarcada.",
													"eng":"It is not possible to show two layers from the same group.\nLayer \"" + DonaCadenaNomDesc(capa2) + "\", that also is member to the group \"" + capa2.grup + "\", will be deselected.", 
													"fre":"Impossible de montrer deux couches du m�me groupe..\nLa couche \"" + DonaCadenaNomDesc(capa2) + "\", appartenant aussi au groupe \"" + capa2.grup + "\", va �tre d�s�lectionn�e."})))
							return;
					}
					if (capa.model!=model_vector && capa2.transparencia=="semitransparent")
					{
						CanviaEstatVisibleISiCalDescarregableCapa(i_capa, "semitransparent");//Aix� for�o que passi a no visible
				       		if (ParamCtrl.LlegendaGrupsComARadials)
						{
							if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors)
								document.getElementById("v_ll_capa"+i_capa).outerHTML=DonaCadenaImgCanviaEstatCapa(i_capa, "visible");
							else
								document.getElementById("v_ll_capa"+i_capa).src=AfegeixAdrecaBaseSRC("semi_radio.gif");
						}
					}
					CanviaEstatVisibleCapaLlegenda(document.getElementById("v_ll_capa"+i_capa),i_capa);
					if (capa2.consultable=="si")
					{
						CanviaEstatConsultableCapa(document.getElementById("c_ll_capa"+i_capa),i_capa);
						grup_consultable=true;
					}
					break;
				}
			}
		}
		CanviaEstatVisibleISiCalDescarregableCapa(i,"si");
		if (grup_consultable && capa.consultable=="ara_no")
			CanviaEstatConsultableCapa(document.getElementById("c_ll_capa"+i),i);
		if (capa.model==model_vector)
		{
			if (EsCapaVisibleAAquestNivellDeZoom(capa) && ((capa.objectes && capa.objectes.features) || capa.servidor))
			{
				for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
				{
					if (EsCapaVisibleEnAquestaVista(i_vista, i))
					{
						OmpleVistaCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i);
						showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
					}
				}
			}
		}
		else
		{
			if (EsCapaVisibleAAquestNivellDeZoom(capa))
			{
				for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
				{
					if (EsCapaVisibleEnAquestaVista(i_vista, i))
					{
						OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i);
						showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
					}
				}
			}
		}
		if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors)
			icon_capa.outerHTML=DonaCadenaImgCanviaEstatCapa(i, "visible");
		else
		{
			if (capa.grup && ParamCtrl.LlegendaGrupsComARadials)
				icon_capa.src=AfegeixAdrecaBaseSRC("radio.gif");
			else
				icon_capa.src=AfegeixAdrecaBaseSRC("visible.gif");
			if (icon_capa.alt)
				icon_capa.alt=GetMessage("visible", "llegenda");
		}
			
		//Miro si l'estil actiu t� gr�fics que estaven "congelats" perqu� la capa no era visible
		//(els altres possibles gr�fics d'altres estils de la capa encara han d'estar congelats)
		if (capa.estil)
			DesactivaCheckITextChartsMatriusDinamics(i, capa.i_estil, false);
	}	
	else if ((nom_icona && (nom_icona=="semitransparent" || nom_icona=="semi_radio")) ||
                  (!nom_icona && capa.visible=="semitransparent") ||
	          (capa.transparencia && capa.transparencia!="semitransparent") ||
		  capa.model==model_vector)  //Els vectors no tenen semitranpar�ncia (de moment)
	{	
		//pas a no visible
		CanviaEstatVisibleISiCalDescarregableCapa(i, "ara_no");
		if (capa.model==model_vector)
		{
			if(capa.objectes && capa.objectes.features)
			{
				for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
				{
					if (EsCapaVisibleEnAquestaVista(i_vista, i))
					{
						hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
					}
				}
			}
		}
		else
		{
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				if (ParamCtrl.TransparenciaDesDeServidor!=true)
					opacLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
				hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
			}
		}
		if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors)
			icon_capa.outerHTML=DonaCadenaImgCanviaEstatCapa(i, "visible");
		else
		{
			if (capa.grup && ParamCtrl.LlegendaGrupsComARadials)
				icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_radio"+((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? ".gif" : ".svg"));
			else
				icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_visible"+((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? ".gif" : ".svg"));
			if (icon_capa.alt)
				icon_capa.alt=GetMessage("nonVisible", "llegenda");
		}
		//Miro hi havia estils d'aquesta capa tenien gr�fics que cal "congelar" perqu� ara la capa no ser� visible
		if (capa.estil)
		{
			for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
				DesactivaCheckITextChartsMatriusDinamics(i, i_estil, true);
		}
	}	
	else
	{
		//pas a semitransparent
		CanviaEstatVisibleISiCalDescarregableCapa(i,"semitransparent");
		if (EsCapaVisibleAAquestNivellDeZoom(capa))
		{
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				if (EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
					if (ParamCtrl.TransparenciaDesDeServidor!=true)
						semitransparentLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
					else
						OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i);
				}
			}
		}
		if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors)
			icon_capa.outerHTML=DonaCadenaImgCanviaEstatCapa(i, "visible");
		else
		{
			if (capa.grup && ParamCtrl.LlegendaGrupsComARadials)
				icon_capa.src=AfegeixAdrecaBaseSRC("semi_radio"+((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? ".gif" : ".svg"));
			else
				icon_capa.src=AfegeixAdrecaBaseSRC("semitransparent"+((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? ".gif" : ".svg"));
			if (icon_capa.alt)
				icon_capa.alt=DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent", "fre":"semi transparent"});
		}	
		// El cas "semitransparent" �s nom�s un subtipus de "visible" per tant no afecta als gr�fics
	}
	CreaAtribucioVista();
}

function CanviaEstatConsultableCapa(icon_capa, i)
{
	if (!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors)
	{
		if (TreuAdreca(icon_capa.src)=="ara_no_consultable.gif")
		{
			ParamCtrl.capa[i].consultable="si";
			icon_capa.src=AfegeixAdrecaBaseSRC("consultable.gif");
			if (icon_capa.alt)
				icon_capa.alt=GetMessage("queryable", "llegenda");
			if (icon_capa.title)
				icon_capa.title=GetMessage("queryable", "llegenda");
		}
		else 
		{
			ParamCtrl.capa[i].consultable="ara_no";
			icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_consultable.gif");
			if (icon_capa.alt)
				icon_capa.alt=GetMessage("nonQueryable", "llegenda");
			if (icon_capa.title)
				icon_capa.title=GetMessage("nonQueryable", "llegenda");
		}
	}
	else
	{
		if (ParamCtrl.capa[i].consultable=="ara_no")
		{
			ParamCtrl.capa[i].consultable="si";
			AddRemoveMouseOverOutSVG("c_ll_capa"+ i, true);
			ChangeTitleColorsSVG("c_ll_capa"+ i, {title: GetMessage("queryable", "llegenda"), colors: ParamCtrl.BarraEstil.colors});
		}
		else 
		{
			ParamCtrl.capa[i].consultable="ara_no";
			AddRemoveMouseOverOutSVG("c_ll_capa"+ i, false);
			ChangeTitleColorsSVG("c_ll_capa"+ i, {title: GetMessage("nonQueryable", "llegenda"), colors: ParamCtrl.BarraEstil.colorsGrey ? ParamCtrl.BarraEstil.colorsGrey : ParamCtrl.BarraEstil.colors});
		}
	}
}

function CanviaEstatDescarregableCapa(icon_capa, i)
{
var capa=ParamCtrl.capa[i];
	if (TreuExtensio(TreuAdreca(icon_capa.src))=="ara_no_descarregable")
	{
	    if (capa.grup)
	    {
			for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
			{
				if (i_capa==i)
					continue;
				if (capa.grup==ParamCtrl.capa[i_capa].grup && ParamCtrl.capa[i_capa].descarregable=="si")
				{
				   if (!confirm(DonaCadenaLang({"cat":"No �s possible descarregar dues capes del mateix grup.\nLa capa \"" + DonaCadenaNomDesc(ParamCtrl.capa[i_capa]) + "\", que tamb� format part del grup \"" + ParamCtrl.capa[i_capa].grup + "\", ser� desmarcada.", 
												"spa":"No es posible descargar dos capas del mismo grupo.\nLa capa \"" + DonaCadenaNomDesc(ParamCtrl.capa[i_capa]) + "\", que tambi�n forma parte del grupo \"" + ParamCtrl.capa[i_capa].grup + "\", ser� desmarcada.", 
												"eng":"It is not possible to download two layers from the same group.\nLayer \"" + DonaCadenaNomDesc(ParamCtrl.capa[i_capa]) + "\", that also is member to the group \"" + ParamCtrl.capa[i_capa].grup + "\", will be deselected.", 
												"fre":"Impossible de t�l�charger deux couches du m�me groupe.\nLa couche \"" + DonaCadenaNomDesc(ParamCtrl.capa[i_capa]) + "\", appartenant aussi au groupe \"" + ParamCtrl.capa [i_capa].grup + "\", va �tre d�s�lectionn�e."})))
					   return;
				   CanviaEstatDescarregableCapa(document.getElementById("z_ll_capa"+i_capa), i_capa);
				   break;
				}
			}
	    }
	    capa.descarregable="si";
	    icon_capa.src=AfegeixAdrecaBaseSRC("descarregable"+((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? ".gif" : ".svg"));
	    if (icon_capa.alt)
		icon_capa.alt=DonaCadenaLang({"cat":"descarregable", "spa":"descargable", "eng":"downloadable","fre":"t�l�chargeable"});
	}
	else 
	{
	    capa.descarregable="ara_no";
	    icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_descarregable"+((!ParamCtrl.BarraEstil || !ParamCtrl.BarraEstil.colors) ? ".gif" : ".svg"));
	    if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"no descarregable", "spa":"no descargable", "eng":"no downloadable", "fre":"non t�l�chargeable"});
	}
}

function CanviaEstatLlegendaDesplegadaCapa(icon_capa, i)
{
	//if (TreuAdreca(icon_capa.src)=="menys.gif")
	if (ParamCtrl.capa[i].LlegDesplegada)
		ParamCtrl.capa[i].LlegDesplegada=false;
	else 
		ParamCtrl.capa[i].LlegDesplegada=true;

	CreaLlegenda();
}

function CanviaEstatCapa(i, estat)
{
	if (estat=="visible")
	{
		var capa=ParamCtrl.capa[i];
		CanviaEstatVisibleCapaLlegenda(document.getElementById("v_ll_capa"+i), i);
		if ((capa.estil && capa.estil.length>1) || 
			(capa.grup && ParamCtrl.LlegendaGrupsComARadials) ||
			capa.AnimableMultiTime)
			CreaLlegenda();
	}
	else if (estat=="consultable")
		CanviaEstatConsultableCapa(document.getElementById("c_ll_capa"+i), i);
	else if (estat=="descarregable")
		CanviaEstatDescarregableCapa(document.getElementById("z_ll_capa"+i), i);
	else if (estat=="lleg_desplegada")
		CanviaEstatLlegendaDesplegadaCapa(document.getElementById("m_ll_capa"+ i),i);
	else
		alert(DonaCadenaLang({"cat":"Estat no reconegut.", "spa":"Estado no reconocido.", "eng":"Unknown state.", "fre":"�tat non reconnu"}));
}

function CanviaEstatLlegendaRadioEstil(i_capa, i_estil, repinta_si_mateix_estil, marcat)
{
	if (ParamCtrl.BarraEstil && ParamCtrl.BarraEstil.colors)
		document.getElementById("e_raster_vector"+i_capa+"_"+i_estil).outerHTML=DonaCadenaImgCanviaEstilCapa(i_capa, i_estil, repinta_si_mateix_estil);
	else
		document.getElementById("e_raster_vector"+i_capa+"_"+i_estil).src=AfegeixAdrecaBaseSRC((marcat) ? "radio.gif" : "ara_no_radio.gif");
}

function CanviaEstilCapa(i_capa, i_estil, repinta_si_mateix_estil)
{
var redibuixar_llegenda=false, capa=ParamCtrl.capa[i_capa];

	if (!repinta_si_mateix_estil && capa.i_estil==i_estil)
		return;
	
	if (capa.i_estil!=i_estil)
	{
		/*if (!redibuixar_llegenda && capa.LlegDesplegada && capa.estil[capa.i_estil].ItemLleg && capa.estil[capa.i_estil].ItemLleg.length>=1)
			redibuixar_llegenda=true;
		if (!redibuixar_llegenda && capa.LlegDesplegada && ((capa.estil[i_estil].ItemLleg && capa.estil[i_estil].ItemLleg.length>=1) || capa.estil[i_estil].nItemLlegAuto>=1))
			redibuixar_llegenda=true;*/
		capa.i_estil=i_estil;
		document.getElementById("id-descrip-lleg-capa-" + i_capa).innerHTML=DonaCadenaHTMLEstilItemLlegenda(i_capa, ParamCtrl.AspecteLlegenda, LlegendaAmbControlDeCapes|LlegendaAmbCapesNoVisibles);
		for (var i=0; i<capa.estil.length; i++)
		{
			if (i==i_estil)
			{
				CanviaEstatLlegendaRadioEstil(i_capa, i, repinta_si_mateix_estil, true);
				DesactivaCheckITextChartsMatriusDinamics(i_capa, i, false);
			}
			else
			{
				CanviaEstatLlegendaRadioEstil(i_capa, i, repinta_si_mateix_estil, false);
				DesactivaCheckITextChartsMatriusDinamics(i_capa, i, true);
			}
		}
	}

	if (capa.model==model_vector)
	{
		if(!redibuixar_llegenda && capa.visible!="no" && capa.visible!="ara_no" &&
			i_estil!=capa.i_estil && capa.LlegDesplegada==false && 
			((capa.estil[i_estil].ItemLleg && capa.estil[i_estil].ItemLleg.length<2) ||
			 (capa.estil[capa.i_estil].ItemLleg && capa.estil[capa.i_estil].ItemLleg.length<2)))
			redibuixar_llegenda=true;
		CarregaSimbolsEstilActualCapaDigi(capa);
		/* Abans s'assumia que un canvi d'estil era tamb� un canvi de contingut. De moment, aix� no �s pas aix�
		  i per aix� no cal fer aix� que hi ha aqu�:
		capa.objectes=null;
		if (capa.tipus)
		{
			InicialitzaTilesSolicitatsCapaDigi(capa);
			DemanaTilesDeCapaDigitalitzadaSiCal(i_capa, ParamInternCtrl.vista.EnvActual);
		}
		else
			capa.TileMatrixGeometry.tiles_solicitats=null;*/
	}
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(i_vista, i_capa))
		{
			if (capa.model==model_vector)
				OmpleVistaCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
			else 
				OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
		}			
	}
	if (redibuixar_llegenda)
		CreaLlegenda();
}
