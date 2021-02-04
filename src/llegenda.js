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
    amb l'ajut de Nuria Julià (n julia at creaf uab cat)
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

function DonaCadenaHTMLSimbolUnicLlegenda(estil)
{
var cdns=[];
	cdns.push("<td valign=\"middle\">");
	if (estil.TipusObj=="S")
		cdns.push("<img src=\"", AfegeixAdrecaBaseSRC(estil.ItemLleg[0].color), "\">");
	else if (estil.TipusObj=="L" || estil.TipusObj=="P")
		cdns.push("<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"><tr><td><img src=\"" ,
					AfegeixAdrecaBaseSRC(DonaFitxerColor(estil.ItemLleg[0].color)), "\" width=\"18\" height=\"",
					((estil.TipusObj=="P") ? 10 : 2), "\"></td></tr></table>");
	cdns.push("</td><td valign=\"middle\" nowrap>");
	return cdns.join("");
}

function DonaCadenaHTMLSimbolMultipleLlegenda(estil, salt_entre_columnes, aspecte)
{
var cdns=[];

	var ncol_items=estil.ncol ? estil.ncol : 1;
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
					cdns.push("<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"><tr><td><img src=\"",
						AfegeixAdrecaBaseSRC(DonaFitxerColor(estil.ItemLleg[l].color)),
						"\" width=\"10\" height=\"",
						((estil.TipusObj=="P") ? 6 : 2),
						"\"></td></tr></table>");
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
var estil=capa.estil[i_estil];
var a, value, valor_min, valor_max, i_color, value_text, ncolors, colors, ample, n_item_lleg_auto;

	if (estil.ItemLleg && estil.ItemLleg.length>0)
		return;  //No cal fer-la: ja està feta.

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
			desc=DonaCadenaCategoriaDesDeColor(estil, i_color);
			if (desc=="")
				continue;
			estil.ItemLleg[i]={"color": (colors) ? colors[i_color] : RGB(i_color,i_color,i_color), "DescColor": desc};
			i++;
		}	
		return;
	}*/

	if (!estil.component || estil.component.length==0)
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

	ample=(valor_max-valor_min+1)/n_item_lleg_auto;
	if (estil.ColorMinimASota)
		ample=-ample;

	estil.ItemLleg=[];
	for (var i=0, value=(estil.ColorMinimASota ? valor_max+ample/2: ample/2+valor_min); (estil.ColorMinimASota) ? value>valor_min : value<valor_max+1; value+=ample)
	{
		i_color=Math.floor(a*(value-valor_min));
		if (i_color>=ncolors)	
			i_color=ncolors-1;
		else if (i_color<0)
			i_color=0;

		if (estil.categories && estil.atributs)
		{
			value_text=DonaCadenaCategoriaDesDeColor(estil, parseInt(value));
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

var LlegendaAmbControlDeCapes=0x01;
var LlegendaAmbCapesNoVisibles=0x02;

function DonaCadenaHTMLLlegenda(aspecte, flag)
{
var salt_entre_columnes, cdns=[], capa, estil;
var alguna={desplegable:1, visible:1, consultable:1, descarregable:1, getcoverage:1, WPS:1};

	if (flag&LlegendaAmbControlDeCapes)
	{
		cdns.push("<form name=form_llegenda>");			
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
	

	//Inici de taula i regle d'un píxel
	cdns.push((aspecte.CapcaleraLlegenda?DonaCadena(aspecte.CapcaleraLlegenda):""),
			"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr>");
	if (alguna.desplegable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"7\" height=\"1\"></td>");
	if (alguna.visible)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"10\" height=\"1\"></td>");
	if (alguna.consultable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"16\" height=\"1\"></td>");
	if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable!=true && alguna.descarregable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"18\" height=\"1\"></td>");
	if (alguna.getcoverage)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"20\" height=\"1\"></td>");
	if (alguna.WPS)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"22\" height=\"1\"></td>");		
	cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"27\" height=\"1\"></td><td><img src=\"",
									AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"300\" height=\"1\"></td></tr>");

    for (var i=0; i<ParamCtrl.capa.length; i++)
    {
		if (EsIndexCapaVolatil(i, ParamCtrl))
			continue;
		capa=ParamCtrl.capa[i];
	    if (capa.separa!=null)
	    {
	        if (ParamCtrl.LlegendaAmagaSeparaNoCapa &&
	        	(!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa) ||
			    (capa.visible!="si" && capa.visible!="semitransparent" && !(flag&LlegendaAmbCapesNoVisibles))))
	        {
	 		    //Busco si hi ha alguna capa visible fins al pròxim separador
				var capa2;
				for (var i2=i+1; i2<ParamCtrl.capa.length; i2++)
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
					if (capa.LlegDesplegada)
						cdns.push("<img src=\"",
								  AfegeixAdrecaBaseSRC("menys.gif"), 
								  "\" alt=\"",
							(DonaCadenaLang({"cat":"plega llegenda", "spa":"recoge leyenda", "eng":"fold legend up","fre":"plie légende"})),
							"\" title=\"",
							(DonaCadenaLang({"cat":"plega llegenda", "spa":"recoge leyenda", "eng":"fold legend up","fre":"plie légende"})),
							"\"");
					else 
						cdns.push("<img src=\"",
								  AfegeixAdrecaBaseSRC("mes.gif"), 
								  "\" alt=\"",
							(DonaCadenaLang({"cat":"desplega llegenda", "spa":"expande leyenda", "eng":"unfold legend", "fre":"déplier légende"})),
						"\" title=\"",
						(DonaCadenaLang({"cat":"desplega llegenda", "spa":"expande leyenda", "eng":"unfold legend", "fre":"déplier légende"})),
						"\"");
					cdns.push(" align=middle name=\"", "m_ll_capa", i, "\" border=\"0\" onClick='CanviaEstatCapa(",
						i,", \"lleg_desplegada\");' onMouseOver=\"if (", "m_ll_capa", i, ".alt) window.status=", "m_ll_capa",
						i,".alt; return true;\" onMouseOut=\"if (", "m_ll_capa", i, ".alt) window.status=\'\'; return true;\">");
				}
				else
					cdns.push("<img src=\"",
							  AfegeixAdrecaBaseSRC("menysg.gif"), 
							  "\" alt=\"\" align=middle>");
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
					//"<input type=\"checkbox\" name=\"raster"+i+"\""+ ((capa.visible=="si") ? " checked" : "") +" onClick=\"ControlCapes(document.llegenda)\">"+
					cdns.push("<td valign=\"middle\">");
					if (capa.grup && ParamCtrl.LlegendaGrupsComARadials)
					{
						if (capa.visible=="si")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("radio.gif"), 
									  "\" alt=\"visible\" title=\"visible\"");  //No cal DonaCadena();
						else if (capa.visible=="semitransparent")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("semi_radio.gif"),  
									  "\" alt=\"",
								(DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),
							"\" title=\"", (DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),"\"");
						else
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_radio.gif"),  
									  "\" alt=\"no visible\" title=\"no visible\"");  //No cal DonaCadena();
					}
					else
					{
						if (capa.visible=="si")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("visible.gif"), 
									  "\" alt=\"visible\" title=\"visible\"");  //No cal DonaCadena();
						else if (capa.visible=="semitransparent")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("semitransparent.gif"), 
									  "\" alt=\"",(DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),
							"\" title=\"",(DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),"\"");
						else
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_visible.gif"), 
									  "\" alt=\"no visible\" title=\"no visible\""); //No cal DonaCadena();
					}
					cdns.push(" align=middle name=\"", "v_ll_capa", i, "\" border=\"0\" onClick='CanviaEstatCapa(",
						i,", \"visible\");' onMouseOver=\"if (", "v_ll_capa", i, ".alt) window.status=", "v_ll_capa",
						i,".alt; return true;\" onMouseOut=\"if (", "v_ll_capa", i,".alt) window.status=\'\'; return true;\"></td>");
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
					cdns.push("<td valign=\"middle\"><img src=\"",
						((capa.consultable=="si") ? 
							(AfegeixAdrecaBaseSRC("consultable.gif") +
							"\" alt=\""+DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"})+
							"\" title=\""+DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"})+ "\"") : 
							(AfegeixAdrecaBaseSRC("ara_no_consultable.gif") +
							"\" alt=\""+DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"})+
							"\" title=\""+DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"})+ "\" align=middle")),
								" name=\"", "c_ll_capa", i,"\" border=\"0\" onClick='CanviaEstatCapa(",
							i,", \"consultable\");' onMouseOver=\"if (", "c_ll_capa", i,".alt) window.status=", "c_ll_capa", 
							i,".alt; return true;\" onMouseOut=\"if (", "c_ll_capa", i,".alt) window.status=\'\'; return true;\"></td>");
				//Icones descarregable:
				if (!ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
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
						cdns.push("<td valign=\"middle\"><img src=\"",
								((capa.descarregable=="si") ? 
											(AfegeixAdrecaBaseSRC("descarregable.gif") +
											"\" alt=\""+DonaCadenaLang({"cat":"descarregable", "spa":"descargable", "eng":"downloadable", "fre":"téléchargeable"})+"\"") : 
											(AfegeixAdrecaBaseSRC("ara_no_descarregable.gif") +
											"\" alt=\""+DonaCadenaLang({"cat":"no descarregable", "spa":"no descargable", "eng":"no downloadable", "fre":"non téléchargeable"})+"\" align=middle")),
									" name=\"","z_ll_capa", i,"\" border=\"0\" onClick='CanviaEstatCapa(",i,
								", \"descarregable\");' onMouseOver=\"if (","z_ll_capa" ,i,".alt) window.status=","z_ll_capa", i,
								".alt; return true;\" onMouseOut=\"if (","z_ll_raster", i,".alt) window.status=\'\'; return true;\"></td>");
			}
			//Botó de GetCovergage:
			if (EsCapaDecarregableIndividualment(capa))
			{
				cdns.push("<td valign=\"middle\">",
				(CadenaBotoPolsable("getcov"+i, "getcov", DonaCadenaLang({"cat":"descarregar", "spa":"descargar", "eng":"download", "fre":"téléchargeable"}), "MostraFinestraDownload("+i+")")),
				"</td>");
			}
			else
			{
				if (alguna.getcoverage)
					cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("1tran.gif"), 
							  "\" width=\"1\" height=\"1\"></td>");
			}
	
			//Botó de WPS
			if(capa.proces==null)
			{
				if (alguna.WPS)
					cdns.push("<td valign=\"middle\"><img src=\"",
						  AfegeixAdrecaBaseSRC("1tran.gif"), 
						  "\" width=\"1\" height=\"1\"></td>");
			}
			else
				cdns.push("<td valign=\"middle\">",
							(CadenaBotoPolsable("excutewps"+i, "executewps", 
									DonaCadenaLang({"cat":"servei de processos", "spa":"servicio de procesos", "eng":"processing service","fre":"service des processus"}), 
									"IniciaFinestraExecutaProcesCapa("+i+")")),
							"</td>");
	

			//Icona o color general per tota la capa en cas de simbol únic.
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
					cdns.push("<a href=\"javascript:void(0);\" style=\"cursor:context-menu;\" onClick=\"OmpleLayerContextMenuCapa(event,",i,");\" onContextMenu=\"return OmpleLayerContextMenuCapa(event,",i,");\">");
				else if (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades.standard))
					cdns.push("<a href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i,",-1);\" title=\"", 
						DonaCadenaLang({"cat":"metadades", "spa":"metadatos", "eng":"metadata","fre":"métadonnées"}), "\">");
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
			if (capa.AnimableMultiTime && capa.visible!="no" && capa.visible!="ara_no" &&
				(!ParamCtrl.LlegendaGrisSegonsEscala || EsCapaDinsRangDEscalesVisibles(capa)) &&
					(!ParamCtrl.LlegendaGrisSiForaAmbit || EsCapaDinsAmbitActual(capa)))
			{
				if (flag&LlegendaAmbControlDeCapes)
				{
					if(capa.data)
					{
						if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
						{
							cdns.push("<tr><td valign=\"middle\" colspan=2><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\"></td>",
							   "<td valign=\"middle\" colspan=" ,
							   (alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS) ,
								   "><select CLASS=text_petit name=\"data_capa_",i,"\" onChange=\"CanviaDataDeCapaMultitime(",
							   i,", parseInt(document.form_llegenda.data_capa_",i,".value,10));\">\n");
						}
						else
						{
							cdns.push("<tr><td valign=\"middle\" colspan=2><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\"></td>",
							   "<td valign=\"middle\" colspan=");
							if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
								cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
							else
								cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
							cdns.push("><select CLASS=text_petit name=\"data_capa_",i,"\" onChange=\"CanviaDataDeCapaMultitime(",
							   i,", parseInt(document.form_llegenda.data_capa_",i,".value,10));\">\n");
						}
						var i_data_sel=DonaIndexDataCapa(capa, null);
						for (var i_data=0; i_data<capa.data.length; i_data++)
						{
							cdns.push("<OPTION VALUE=\"",i_data,"\"",
								((i_data==i_data_sel) ? " SELECTED" : "") ,
							">" , (DonaDataCapaPerLlegenda(i,i_data)) , "</OPTION>\n");
						}
						cdns.push("</select></td></tr>");
					}
					else
					{
						alert(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) +" "+ DonaCadena(capa.desc) + " " +
							DonaCadenaLang({"cat":"indica que és AnimableMultiTime però no té dates definides", "spa":"indica que es AnimableMultiTime pero no tiene fechas definidas", "eng":"indicates that is AnimableMultiTime but it has no dates defined", "fre":"Indique que c\'est AnimableMultiTime, mais il n\'a pas de dates définies"}));
					}
				}
				else
				{
					cdns.push("<td valign=\"middle\" colspan=3>",aspecte.PreviDescEstil,(DonaDataCapaPerLlegenda(i, null)),
						aspecte.PostDescEstil , "</td>");
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
					alert(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) +" "+ DonaCadena(capa.desc) + " "+
							DonaCadenaLang({"cat":", "indica incorrectament 0 columnes dels items de la llegenda però té", "spa":"indica incorrectamente 0 columnas en los items de la leyenda pero tiene", "eng":"has been incorrectly set to 0 columns on the legend items but it has", "fre":"indique 0 colonnes des éléments de la légende mais a"}) +
							 " "+ estil.ItemLleg.length + " " + 
							DonaCadenaLang({"cat":"elements descrits. No es dibuixaran.", "spa":"elementos descritos. No es dibujaran.", "eng":"described elements. They will not be shown on the legend.", "fre":"éléments décrits. Ils ne seront pas dessinés."}));
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
						salt_entre_columnes=Math.floor(capa.estil.length/ncol_estil)+((capa.estil.length%ncol_estil!=0) ? 1 : 0);
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
										"\" width=\"4\" height=\"1\"><img align=middle name=\"e_raster_vector",
										i,"_",l,"\"  border=\"0\" onClick='CanviaEstilCapa(",i,", ",l,", false);' src=\"");
									if (l==capa.i_estil)
										cdns.push(AfegeixAdrecaBaseSRC("radio.gif"));
									else
										cdns.push(AfegeixAdrecaBaseSRC("ara_no_radio.gif"));
									cdns.push("\"></td>",
										"<td valign=\"middle\"><img src=\"",
										AfegeixAdrecaBaseSRC("1tran.gif"), 
										"\" width=\"2\" height=\"1\"></td>",
										"<td valign=\"middle\">");
									if (isLayer(window, "menuContextualCapa"))
										cdns.push("<a href=\"javascript:void(0);\" style=\"cursor:context-menu;\" onClick=\"OmpleLayerContextMenuEstil(event,", i, ",", l,");\" onContextMenu=\"return OmpleLayerContextMenuEstil(event,", i, ",", l,");\">");
									cdns.push(aspecte.PreviDescEstil , DonaCadena(capa.estil[l].desc) , aspecte.PostDescEstil);
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
							aspecte.PreviDescEstil, (DonaCadena(capa.estil[capa.i_estil].desc)),
							aspecte.PostDescEstil, "</td>");
				    }
				    cdns.push("</tr>");
				//}				
			}

			//Si la capa té una paleta, defineixo els colors de la llegenda aquí.
			CreaItemLlegDePaletaSiCal(i, capa.i_estil); 
		
			//Llegenda si hi ha més d'un item
			estil=capa.estil[capa.i_estil];
			if (estil.ItemLleg && estil.ItemLleg.length>1 && 
				(!(flag&LlegendaAmbControlDeCapes) || capa.LlegDesplegada))
			{
				var ncol_items=estil.ncol ? estil.ncol : 1;
				salt_entre_columnes=Math.floor(estil.ItemLleg.length/ncol_items)+((estil.ItemLleg.length%ncol_items!=0) ? 1 : 0);
				if (estil.DescItems)
				{
					cdns.push("<tr><td colspan=");
					if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
					else
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
					cdns.push(">",aspecte.PreviDescItems,DonaCadena(estil.DescItems),
						aspecte.PostDescItems,"</td></tr>");
				}
				cdns.push("<tr><td colspan=");
				if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
				else
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
				cdns.push(">");
				cdns.push(DonaCadenaHTMLSimbolMultipleLlegenda(estil, salt_entre_columnes, aspecte));
				cdns.push("</td></tr>");
			}
		}
		//i=i_fi_grup;
    }
    cdns.push("</table>",
		(aspecte.PeuLlegenda ? 
			(DonaCadena(aspecte.PeuLlegenda)!="" ? "<br>" + DonaCadena(aspecte.PeuLlegenda) : "") 
			: ""));
    if (flag&LlegendaAmbControlDeCapes)
		cdns.push("</form>");
    return cdns.join("");
}//Fi de DonaCadenaHTMLLlegenda()



//var scroll_llegenda_previ={"x": 0, "y": 0}; NOTA20200403-1912 Es descubreix que no es fa servir el 

function CreaLlegenda()
{
var salt_entre_columnes;

	var s=DonaCadenaHTMLLlegenda(ParamCtrl.AspecteLlegenda, LlegendaAmbControlDeCapes|LlegendaAmbCapesNoVisibles);
	var elem=getLayer(window, "llegenda");
	if (isLayer(elem))
	{
		contentLayer(elem, s);
		showLayer(elem);
		//Queda pendent el tema de la recuperaciò d'scrolls. Veure NOTA20200403-1912
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

function CanviaEstatVisibleCapa(icon_capa, i)
{
var i_vista, capa=ParamCtrl.capa[i], capa2, grup_consultable=false;
var nom_icona=TreuAdreca(icon_capa.src);

	if (nom_icona=="ara_no_visible.gif" ||
	    nom_icona=="ara_no_radio.gif")
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
				    EsCapaVisibleAAquestNivellDeZoom(i_capa))
				{
					//In the case of groups We sincronize the querible (consultable) with the visible property.
					if (!(ParamCtrl.LlegendaGrupsComARadials==true))
					{
						if (!confirm(DonaCadenaLang({"cat":"No és possible mostrar dues capes del mateix grup.\nLa capa \"" + DonaCadena(capa2.desc) + "\", que també format part del grup \"" + capa2.grup + "\", serà desmarcada.",
													"spa":"No es posible mostrar dos capas del mismo grupo.\nLa capa \"" + DonaCadena(capa2.desc) + "\", que también forma parte del grupo \"" + capa2.grup + "\", será desmarcada.",
													"eng":"It is not possible to show two layers from the same group.\nLayer \"" + DonaCadena(capa2.desc) + "\", that also is member to the group \"" + capa2.grup + "\", will be deselected.", 
													"fre":"Impossible de montrer deux couches du même groupe..\nLa couche \"" + DonaCadena(capa2.desc) + "\", appartenant aussi au groupe \"" + capa2.grup + "\", va être désélectionnée."})))
							return;
					}
					if (capa.model!=model_vector && capa2.transparencia=="semitransparent")
					{
						CanviaEstatVisibleISiCalDescarregableCapa(i_capa, "semitransparent");//Així forço que passi a no visible
				       		if (ParamCtrl.LlegendaGrupsComARadials==true)
							window.document["v_ll_capa"+i_capa].src=AfegeixAdrecaBaseSRC("semi_radio.gif");
					}
					CanviaEstatVisibleCapa(window.document["v_ll_capa"+i_capa],i_capa);
					if (capa2.consultable=="si")
					{
						CanviaEstatConsultableCapa(window.document["c_ll_capa"+i_capa],i_capa);
						grup_consultable=true;
					}
					break;
				}
			}
		}
		CanviaEstatVisibleISiCalDescarregableCapa(i,"si");
		if (grup_consultable && capa.consultable=="ara_no")
			CanviaEstatConsultableCapa(window.document["c_ll_capa"+i],i);
		if (capa.model==model_vector)
		{
			if (EsCapaVisibleAAquestNivellDeZoom(i) && capa.objectes && capa.objectes.features)
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
			if (EsCapaVisibleAAquestNivellDeZoom(i))
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
		if (capa.grup && ParamCtrl.LlegendaGrupsComARadials==true)
		    icon_capa.src=AfegeixAdrecaBaseSRC("radio.gif");
		else
		    icon_capa.src=AfegeixAdrecaBaseSRC("visible.gif");
		if (icon_capa.alt)
			icon_capa.alt="visible"; //no cal DonaCadenaLang();
	}	
	else if (nom_icona=="semitransparent.gif" || 
		 nom_icona=="semi_radio.gif"||
	         (capa.transparencia && capa.transparencia!="semitransparent") ||
		capa.model==model_vector)  //Els vectors no tenen semitranparència (de moment)
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
		if (capa.grup && ParamCtrl.LlegendaGrupsComARadials==true)
		    icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_radio.gif");
		else
		    icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_visible.gif");
		if (icon_capa.alt)
			icon_capa.alt="no visible";  //no cal DonaCadenaLang();
	}	
	else
	{
		//pas a semitransparent
		CanviaEstatVisibleISiCalDescarregableCapa(i,"semitransparent");
		if (EsCapaVisibleAAquestNivellDeZoom(i))
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
		if (capa.grup && ParamCtrl.LlegendaGrupsComARadials==true)
			icon_capa.src=AfegeixAdrecaBaseSRC("semi_radio.gif");
		else
			icon_capa.src=AfegeixAdrecaBaseSRC("semitransparent.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent", "fre":"semi transparent"});
	}
	CreaAtribucioVista();
}

function CanviaEstatConsultableCapa(icon_capa, i)
{
	if (TreuAdreca(icon_capa.src)=="ara_no_consultable.gif")
	{
		ParamCtrl.capa[i].consultable="si";
		icon_capa.src=AfegeixAdrecaBaseSRC("consultable.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"});
	}
	else 
	{
		ParamCtrl.capa[i].consultable="ara_no";
		icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_consultable.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"});
	}
}

function CanviaEstatDescarregableCapa(icon_capa, i)
{
var capa=ParamCtrl.capa[i];
	if (TreuAdreca(icon_capa.src)=="ara_no_descarregable.gif")
	{
	    if (capa.grup)
	    {
			for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
			{
				if (i_capa==i)
					continue;
				if (capa.grup==ParamCtrl.capa[i_capa].grup && ParamCtrl.capa[i_capa].descarregable=="si")
				{
				   if (!confirm(DonaCadenaLang({"cat":"No és possible descarregar dues capes del mateix grup.\nLa capa \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", que també format part del grup \"" + ParamCtrl.capa[i_capa].grup + "\", serà desmarcada.", 
												"spa":"No es posible descargar dos capas del mismo grupo.\nLa capa \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", que también forma parte del grupo \"" + ParamCtrl.capa[i_capa].grup + "\", será desmarcada.", 
												"eng":"It is not possible to download two layers from the same group.\nLayer \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", that also is member to the group \"" + ParamCtrl.capa[i_capa].grup + "\", will be deselected.", 
												"fre":"Impossible de télécharger deux couches du même groupe.\nLa couche \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", appartenant aussi au groupe \"" + ParamCtrl.capa [i_capa].grup + "\", va être désélectionnée."})))
					   return;
				   CanviaEstatDescarregableCapa(window.document["z_ll_capa"+i_capa], i_capa);
				   break;
				}
			}
	    }
	    capa.descarregable="si";
	    icon_capa.src=AfegeixAdrecaBaseSRC("descarregable.gif");
	    if (icon_capa.alt)
		icon_capa.alt=DonaCadenaLang({"cat":"descarregable", "spa":"descargable", "eng":"downloadable","fre":"téléchargeable"});
	}
	else 
	{
	    capa.descarregable="ara_no";
	    icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_descarregable.gif");
	    if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"no descarregable", "spa":"no descargable", "eng":"no downloadable", "fre":"non téléchargeable"});
	}
}

function CanviaEstatLlegendaDesplegadaCapa(icon_capa, i)
{
	if (TreuAdreca(icon_capa.src)=="menys.gif")
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
		CanviaEstatVisibleCapa(window.document["v_ll_capa"+i], i);
		if ((capa.estil && capa.estil.length>1) || 
			(capa.grup && ParamCtrl.LlegendaGrupsComARadials) ||
			capa.AnimableMultiTime==true)
			CreaLlegenda();
	}
	else if (estat=="consultable")
		CanviaEstatConsultableCapa(window.document["c_ll_capa"+i], i);
	else if (estat=="descarregable")
		CanviaEstatDescarregableCapa(window.document["z_ll_capa"+i], i);
	else if (estat=="lleg_desplegada")
		CanviaEstatLlegendaDesplegadaCapa(window.document["m_ll_capa"+ i],i);
	else
		alert(DonaCadenaLang({"cat":"Estat no reconegut.", "spa":"Estado no reconocido.", "eng":"Unknown state.", "fre":"État non reconnu"}));
}

function CanviaEstatLlegendaRadioEstil(icon_capa, marcat)
{
	if (marcat)
		icon_capa.src=AfegeixAdrecaBaseSRC("radio.gif");
	else
		icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_radio.gif");	
}

function CanviaEstilCapa(i_capa, i_estil, repinta_si_mateix_estil)
{
var redibuixar_llegenda=false, capa=ParamCtrl.capa[i_capa];

	if (!repinta_si_mateix_estil && capa.i_estil==i_estil)
		return;
	
	if (capa.i_estil!=i_estil)
	{
		for (var i=0; i<capa.estil.length; i++)
		{
			if (i==i_estil)
				//CanviaEstatLlegendaRadioEstil(eval("window.document.e_raster_vector"+i_capa+"_"+i), true);
				CanviaEstatLlegendaRadioEstil(window.document["e_raster_vector"+i_capa+"_"+i], true);
			else
				//CanviaEstatLlegendaRadioEstil(eval("window.document.e_raster_vector"+i_capa+"_"+i), false);
				CanviaEstatLlegendaRadioEstil(window.document["e_raster_vector"+i_capa+"_"+i], false);
			if (!redibuixar_llegenda && capa.LlegDesplegada==true && capa.estil[i].ItemLleg && capa.estil[i].ItemLleg.length>1)
				redibuixar_llegenda=true;
		}
		capa.i_estil=i_estil;
	}
	else
		redibuixar_llegenda=false;

	if (capa.model==model_vector)
	{
		if(!redibuixar_llegenda && capa.visible!="no" && capa.visible!="ara_no" &&
			i_estil!=capa.i_estil && capa.LlegDesplegada==false && 
			((capa.estil[i_estil].ItemLleg && capa.estil[i_estil].ItemLleg.length<2) ||
			 (capa.estil[capa.i_estil].ItemLleg && capa.estil[capa.i_estil].ItemLleg.length<2)))
			redibuixar_llegenda=true;
		CarregaSimbolsEstilActualCapaDigi(capa);
		/* Abans s'assumia que un canvi d'estil era també un canvi de contingut. De moment, això no és pas així
		  i per això no cal fer això que hi ha aquí:
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
		if (EsCapaVisibleAAquestNivellDeZoom(i_capa) && EsCapaVisibleEnAquestaVista(i_vista, i_capa))
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

