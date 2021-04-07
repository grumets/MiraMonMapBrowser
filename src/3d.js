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

function ObreFinestraSuperficie3D(i_capa)
{
var ncol=460, nfil=420, titol, vscale=0.5;
var nom_grafic3d=prefixSuperficie3DFinestra+Superficie3DFinestra.n;
var cdns=[];

	titol=DonaCadenaLang({"cat":"Gràfic 3D", "spa":"Gráfico 3D", "eng":"3D Graphic", "fre":"Diagramme 3D"})+" " + (Superficie3DFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
	cdns.push("<div id=\"", nom_grafic3d, "_3d\" style=\"width: ", ncol, "px;height: ", nfil, "px;\"></div>",
		"<div style=\"position: absolute; top: 0; margin-left: auto; margin-right: auto; width:", ncol, "\"><form name=\"", nom_grafic3d, "_3d_f\"><center>",
			DonaCadenaLang({"cat":"Escala vertical", "spa":"Escala vertical", "eng":"Vertical scale", "fre":"Échelle verticale"}),
			": <input id=\"", nom_grafic3d, "_3d_fh\" type=\"range\" step=\"0.01\" min=\"0.1\" max=\"1.0\" value=\"", vscale ,"\" onchange=\"CanviaEscalaVSuperficie3D(event, this.value, ", Superficie3DFinestra.n, ");\" oninput=\"CanviaEscalaVSuperficie3D(event, this.value, "+Superficie3DFinestra.n+");\" style=\"width: 75px\"> &nbsp;&nbsp;",
			"Zoom", //DonaCadenaLang({"cat":"Distància", "spa":"Distancia", "eng":"Distance", "fre":"Distance"}),
			": <input id=\"", nom_grafic3d, "_3d_fd\" type=\"range\" step=\"0.01\" min=\"0\" max=\"4.29\" value=\"", 5-1.7,"\" onchange=\"CanviaDistanciaSuperficie3D(event, this.value, ", Superficie3DFinestra.n, ");\" oninput=\"CanviaDistanciaSuperficie3D(event, this.value, "+Superficie3DFinestra.n+");\" style=\"width: 75px\">",
		  "</center></form></div>");

	insertContentLayer(getLayer(window, "menuContextualCapa"), "afterEnd", textHTMLFinestraLayer(nom_grafic3d, titol, boto_tancar, 200+Superficie3DFinestra.n*10, 200+Superficie3DFinestra.n*10, ncol, nfil+AltBarraFinestraLayer+2, "NW", {scroll: "no", visible: true, ev: null}, cdns.join("")));
	OmpleBarraFinestraLayerNom(window, nom_grafic3d);
	Superficie3DFinestra.vista[Superficie3DFinestra.n]={ height: nfil,
				width: ncol,
				vscale: vscale,
                i_capa: i_capa,
				i_estil: ParamCtrl.capa[i_capa].i_estil,
				i_grafic3d: Superficie3DFinestra.n};

	CreaSuperficie3D(nom_grafic3d+"_3d", Superficie3DFinestra.vista[Superficie3DFinestra.n]);
	Superficie3DFinestra.n++;
}

// Documentació a: http://visjs.org/docs/graph3d/
//No és posible canvair de color en aquest moment. 
//He après a la internet que per canviar la paleta de colors cal canviar/hack la funció _hsv2rgb quan es cridada des del la llibreria de surfaces.
//https://www.rapidtables.com/convert/color/hsv-to-rgb.html
/*La primera component que rep _hsv2rgb() és l'index de color i el darrer la sombra:
Caldria traduir la primera component a RGB aplicant la paleta (o el color que vingui d'una altre capa), 
passar-ho a HSV, aplicar la sombra i tornar filament a RGB.*/
function CreaSuperficie3D(nom_div, vista_grafic3d)
{
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
		width:  vista_grafic3d.width,
		height: vista_grafic3d.height,
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
