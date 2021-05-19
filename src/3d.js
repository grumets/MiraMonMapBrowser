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

var prefixSuperficie3DFinestra="graph3d_fin_";
var Superficie3DFinestra={"n": 0, "vista":[]};

function CanviaIndexosCapes3DFinestra(n_moviment, i_capa_ini, i_capa_fi_per_sota)
{
	if (Superficie3DFinestra && Superficie3DFinestra.n && Superficie3DFinestra.vista.length>0)
	{
		for (var i=0; i<Superficie3DFinestra.vista.length; i++)
		{
			if (Superficie3DFinestra.vista[i].i_capa>=i_capa_ini && Superficie3DFinestra.vista[i].i_capa<i_capa_fi_per_sota)
				Superficie3DFinestra.vista[i].i_capa+=n_moviment;
		}
	}
}

function CanviDinamismeGrafic3d(event)
{
	var n_histo, i_str, i_str_2, estil;
	
	if (event.srcElement)
	{		
		i_str=event.srcElement.id.indexOf(prefixSuperficie3DFinestra);
		i_str_2=event.srcElement.id.indexOf(sufixCheckDinamicHistograma);
		n_histo=parseInt(event.srcElement.id.substr(i_str+prefixSuperficie3DFinestra.length, i_str_2-i_str+prefixSuperficie3DFinestra.length));
		if (isNaN(n_histo))
			return;
		
		if (window.document.getElementById(event.srcElement.id).checked)
				CreaSuperficie3D(n_histo);
	}
}

function DonaNomCheckDinamicGrafic3d(i_histo)
{
	return DonaNomGrafic3d(i_histo)+sufixCheckDinamicHistograma; //sufixCheckDinamicHistograma de histopie 
}

function DonaIdDivGrafic3d(n_histograma)
{
	return DonaNomGrafic3d(n_histograma)+"_3d";
}

function DonaNomGrafic3d(n_histograma)
{
	return prefixSuperficie3DFinestra+n_histograma;
}

function DonaNomCheckDinamicLabelGrafic3d(i_histo)
{
	return DonaNomCheckDinamicGrafic3d(i_histo)+"_label";
}

function DonaNomCheckDinamicTextGrafic3d(i_histo)
{
	return DonaNomCheckDinamicGrafic3d(i_histo)+"_text";
}

function ObreFinestraSuperficie3D(i_capa, i_estil)
{
var ncol=460, nfil=420, estil, i_estil_intern, titol, vscale=0.5;
var nom_grafic3d=DonaNomGrafic3d(Superficie3DFinestra.n);
var cdns=[];
var def_diagrama_existeix=false;
var i_diag=-1, des_top=-9999, des_left=-9999;

	if (typeof i_estil !== "undefined")	 
	{
		i_estil_intern=i_estil;
		def_diagrama_existeix=true;
	}
	else //si em pasen un estil concret d'aquesta capa, que pot no ser el "actiu", l'uso
		i_estil_intern=ParamCtrl.capa[i_capa].i_estil;
	estil=ParamCtrl.capa[i_capa].estil[i_estil_intern]; 

	if (typeof estil.histograma === "undefined") // ara no estic preparat perquè no ha arribat la imatge
		return;

	//Check per a Gràfic 3d dinàmic i text per a indicar que actualització aturada per capa no visible
	cdns.push("<input type=\"checkbox\" name=\"", 	(Superficie3DFinestra.n), "\" id=\"", DonaNomCheckDinamicGrafic3d(Superficie3DFinestra.n), "\" checked=\"checked\" onclick=\"CanviDinamismeGrafic3d(event);\">")	
	cdns.push("<label for=\"", DonaNomGrafic3d(Superficie3DFinestra.n), "\" id=\"", DonaNomCheckDinamicLabelGrafic3d(Superficie3DFinestra.n), "\">", DonaCadenaLang({"cat":"Dinàmic", "spa":"Dinàmico", "eng":"Dynamic", "fre":"Dynamique"}) , "</label>");
	cdns.push("&nbsp;&nbsp;<span id=\"", DonaNomCheckDinamicTextGrafic3d(Superficie3DFinestra.n), "\" style=\"display: none\">", 		
		DonaCadenaLang({"cat":"Desactivat (capa o estil no visible)", "spa":"Desactivado (capa o estil no visible)", "eng":"Disabled (layer or style not visible)", "fre":"Désactivé (couche or style non visible)"}) , "</span>");

	titol=DonaCadenaLang({"cat":"Gràfic 3D", "spa":"Gráfico 3D", "eng":"3D Graphic", "fre":"Diagramme 3D"})+" " + (Superficie3DFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
	cdns.push("<div id=\"", DonaIdDivGrafic3d(Superficie3DFinestra.n), "\" style=\"width: ", ncol, "px;height: ", nfil, "px;\"></div>",
		"<div style=\"position: absolute; top: 20; margin-left: auto; margin-right: auto; width:", ncol, "\"><form name=\"", nom_grafic3d, "_3d_f\"><center>",
			DonaCadenaLang({"cat":"Escala vertical", "spa":"Escala vertical", "eng":"Vertical scale", "fre":"Échelle verticale"}),
			": <input id=\"", nom_grafic3d, "_3d_fh\" type=\"range\" step=\"0.01\" min=\"0.1\" max=\"1.0\" value=\"", vscale ,"\" onchange=\"CanviaEscalaVSuperficie3D(event, this.value, ", Superficie3DFinestra.n, ");\" oninput=\"CanviaEscalaVSuperficie3D(event, this.value, "+Superficie3DFinestra.n+");\" style=\"width: 75px\"> &nbsp;&nbsp;",
			"Zoom", //DonaCadenaLang({"cat":"Distància", "spa":"Distancia", "eng":"Distance", "fre":"Distance"}),
			": <input id=\"", nom_grafic3d, "_3d_fd\" type=\"range\" step=\"0.01\" min=\"0\" max=\"4.29\" value=\"", 5-1.7,"\" onchange=\"CanviaDistanciaSuperficie3D(event, this.value, ", Superficie3DFinestra.n, ");\" oninput=\"CanviaDistanciaSuperficie3D(event, this.value, "+Superficie3DFinestra.n+");\" style=\"width: 75px\">",
		  "</center></form></div>");

	if (def_diagrama_existeix) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
	{	//hi pot haver diversos diagrames d'aquest estil, p.ex. un histo i un 3d (i un estadístic en un futur). si tinc més de un del mateix tipus, cada cop faig el primer que trobo
		for (i_diag=0; i_diag<estil.diagrama.length; i_diag++)
		{
			if (estil.diagrama[i_diag].tipus == "vista3d" && (typeof estil.diagrama[i_diag].i_histograma === "undefined"))
			{
				if (typeof estil.diagrama[i_diag].left !== "undefined")
					des_left=estil.diagrama[i_diag].left;
				if (typeof estil.diagrama[i_diag].top !== "undefined")
					des_top=estil.diagrama[i_diag].top;
				break;
			}
		}
		if (i_diag == estil.diagrama.length) //no l'he trobat
			i_diag=-1;
	}

	insertContentLayer(getLayer(window, "menuContextualCapa"), "afterEnd", textHTMLFinestraLayer(nom_grafic3d, titol, boto_tancar, (des_left == -9999) ? 200+Superficie3DFinestra.n*10 : des_left, (des_top == -9999) ? 200+Superficie3DFinestra.n*10 : des_top, ncol, nfil+AltBarraFinestraLayer+2, "NW", {scroll: "no", visible: true, ev: null}, cdns.join("")));
	OmpleBarraFinestraLayerNom(window, nom_grafic3d);
	Superficie3DFinestra.vista[Superficie3DFinestra.n]={ height: nfil,
				width: ncol,
				vscale: vscale,
				i_capa: i_capa,
				i_estil: i_estil_intern,
				i_grafic3d: Superficie3DFinestra.n};

	/* Quan s'està creant la finestra per primera vegada, que per exemple estava definida al JSON, pot ser 
	que la imatge encara no s'hagi carregat mai i per tant no puc visualitzar hitograma encara -> la finestra 
	s'obrirà però he de posar "no visible" i més endavant quan arribi el nou array binari ja s'omplirà sol*/
	if (typeof estil.histograma !== "undefined")
	{		
		CreaSuperficie3D(Superficie3DFinestra.n);
			
		if (i_diag != -1) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
			estil.diagrama[i_diag].i_histograma=Superficie3DFinestra.n;				
		else
		{
			if (typeof estil.diagrama === "undefined") //no està creat
				estil.diagrama=[];
			estil.diagrama.push({tipus: "vista3d", i_histograma: Superficie3DFinestra.n});
		}
	}
	Superficie3DFinestra.n++;
}

// Documentació a: http://visjs.org/docs/graph3d/
//No és posible canviar de color en aquest moment. 
//He après a la internet que per canviar la paleta de colors cal canviar/hack la funció _hsv2rgb quan es cridada des del la llibreria de surfaces.
//https://www.rapidtables.com/convert/color/hsv-to-rgb.html
/*La primera component que rep _hsv2rgb() és l'index de color i el darrer l'ombra:
Caldria traduir la primera component a RGB aplicant la paleta (o el color que vingui d'una altre capa), 
passar-ho a HSV, aplicar l'ombra i tornar finalment a RGB.*/
function CreaSuperficie3D(n_histograma)
{
var vista_grafic3d=Superficie3DFinestra.vista[n_histograma];
var nom_div=DonaIdDivGrafic3d(n_histograma);
var capa=ParamCtrl.capa[vista_grafic3d.i_capa];
var estil=capa.estil[vista_grafic3d.i_estil];
var counter = 0, v, v_c, x, y;
var costat=ParamInternCtrl.vista.CostatZoomActual;
var env={MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY};
var ncol=ParamInternCtrl.vista.ncol, nfil=ParamInternCtrl.vista.nfil;

	vista_grafic3d.data = new vis.DataSet();
    	var axisDelta = env.MaxX-env.MinX;
	if (axisDelta<env.MaxY-env.MinY)
		axisDelta=env.MaxY-env.MinY;
	var axisStep = axisDelta / 120;  //120 is the number of steps. Cannot be bigger due to performance limitations
       	for (y = env.MaxY, counter=0; y > env.MinY; y-=axisStep) 
	{
		for (x = env.MinX; x < env.MaxX; x+=axisStep, counter++) 
		{
			v=DonaValorsDeDadesBinariesCapa(NovaVistaPrincipal, capa, null, parseInt((x-env.MinX)/costat), parseInt((env.MaxY-y)/costat))
			v_c=DonaValorEstilComArrayDesDeValorsCapa(NovaVistaPrincipal, vista_grafic3d.i_capa, vista_grafic3d.i_estil, v)
			if (v_c==null)
				continue;
   		vista_grafic3d.data.add({id:counter, x:x, y:y, z:v_c[0]});
	  }
  }

	// specify options
	var options = {
		width:  vista_grafic3d.width.toString(), //la llibreria espera un string, no un número, i donava un error en executar
		height: vista_grafic3d.height.toString(), //la llibreria espera un string, no un número, i donava un error en executar
		style: 'surface',
		showPerspective: true,
		showGrid: true,
		showShadow: true,
		showLegend: true,
		keepAspectRatio: true,
		verticalRatio: vista_grafic3d.vscale,
		xLabel: EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS) ? "long" : "x",
		yLabel: EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS) ? "lat" : "y",
		zLabel: DonaCadena(estil.desc) + ((estil.DescItems) ? " ("+DonaCadena(estil.DescItems)+")" : ""),
		legendLabel: DonaCadena(estil.desc) + ((estil.DescItems) ? " ("+DonaCadena(estil.DescItems)+")" : ""),
		tooltip: function (point) {
			// parameter point contains properties x, y, z, and data.
			// vegeu nota JM20190425 sobre estil.
			return DonaValorDeCoordActual(point.x, point.y, false, false).replace("\n", "<br>") + "<br>" + DonaCadena(this.estil.desc) + ": " + point.z + ((this.estil.DescItems) ? " ("+DonaCadena(this.estil.DescItems)+")" : "");
        	},
  		tooltipStyle: {
			content: {
				background    : 'rgba(255, 255, 255, 0.7)',
				padding       : '10px',
				borderRadius  : '10px'
          		},
			line: {
				borderLeft    : '1px dotted rgba(0, 0, 0, 0.5)'
			},
			dot: {
				border        : '5px solid rgba(0, 0, 0, 0.5)'
			}
		}
	};

	//aquesta llibreria no té un update, com la de charts, i per això cada vegada que canvien les dades, creo la vista3d de nou substituint l'anterior
	vista_grafic3d.graph3d = new vis.Graph3d(document.getElementById(nom_div), vista_grafic3d.data, options);
	vista_grafic3d.graph3d.estil=estil;  //NOTA: JM20190425: Amb aquest truc faig visible estil dincs de "graph3d", que es converteix en "this" dins de la funció del tooltip.

}

//El slider té més sentit com a zoom però llavors el valor s'ha de invertir per convertir-lo en un valor entre 0.71 (	aprop) i 5.0 (lluny) tal com ha de ser.
function CanviaDistanciaSuperficie3D(event, z, i)
{
	Superficie3DFinestra.vista[i].graph3d.setCameraPosition({distance: 4.29-z+0.71});		
}

function CanviaEscalaVSuperficie3D(event, vscale, i)
{
	Superficie3DFinestra.vista[i].graph3d.setOptions({verticalRatio: vscale, showLegend: true});
}
