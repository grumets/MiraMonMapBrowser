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

var PaletesGlobals=null;  //llegedes de paletes.json

function DonaFactorAEstiramentPaleta(estiramentPaleta, n_colors)
{
	if (!estiramentPaleta || estiramentPaleta.valorMaxim==estiramentPaleta.valorMinim)
		return 1;
	return n_colors/(estiramentPaleta.valorMaxim-estiramentPaleta.valorMinim);
}

function DonaFactorValorMinEstiramentPaleta(estiramentPaleta)
{
	return (estiramentPaleta && estiramentPaleta.valorMinim) ? estiramentPaleta.valorMinim : 0;
}

function DonaFactorValorMaxEstiramentPaleta(estiramentPaleta, n_colors)
{
	return (estiramentPaleta && (estiramentPaleta.valorMaxim || estiramentPaleta.valorMaxim==0)) ? estiramentPaleta.valorMaxim : n_colors-1;
}

function DonaCadenaHTMLPintaPaleta(paleta)
{
var cdns=[], w;
	if (paleta)
	{
		if (paleta.ramp && !paleta.colors)
		{
			if (TransformRampToColorsArray(paleta))
				return;
		}
		w=paleta.colors.length<24 ? 12 : 1;
		for (var i=0; i<paleta.colors.length; i++)
			cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" style=\"height: 15px;width: ", w, "px;background-color:", paleta.colors[i], ";\">");
	}
	else
	{
		for (var i=0; i<256; i++)
			cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" style=\"height: 15px;width: 1px;background-color: ", RGB(i,i,i), ";\">");
	}
	return cdns.join("");
}

function TransformRampToColorsArray(paleta)
{
var ramp=paleta.ramp, color, color0, bigint, bigint0, r, g, b, r0, g0, b0, a_r, a_g, a_b, b_r, b_g, b_b;
	if (!ramp || !ramp.length)
		return 1;
	color0=ramp[0].color;
	if (typeof color0==="object")
		color0=RGB_JSON(color0);
	if (typeof color0!=="string" || color0.charAt(0)!="#")
	{
		alert(GetMessage("UnsupportedColor", "imgrle") + ": " + color0 + ". " + GetMessage("UseTheFormat") + ": #RRGGBB");
		return 1;
	}
	bigint0 = parseInt(color0.substring(1), 16);
	r0=(bigint0 >> 16) & 255;
	g0=(bigint0 >> 8) & 255;
	b0=bigint0 & 255;
	paleta.colors=[color0];
	for (var i_ramp=1; i_ramp<ramp.length; i_ramp++)
	{
		color=ramp[i_ramp].color;
		if (typeof color==="object")
			color=RGB_JSON(color);
		if (typeof color!=="string" || color.charAt(0)!="#")
		{
			alert(GetMessage("UnsupportedColor", "imgrle") + ": " + color + ". " + GetMessage("UseTheFormat") + ": #RRGGBB");
			return 1;
		}
		bigint = parseInt(color.substring(1), 16);
		r=(bigint >> 16) & 255;
		g=(bigint >> 8) & 255;
		b=bigint & 255;
		a_r=(r-r0)/(ramp[i_ramp].i_color-(paleta.colors.length-1));
		a_g=(g-g0)/(ramp[i_ramp].i_color-(paleta.colors.length-1));
		a_b=(b-b0)/(ramp[i_ramp].i_color-(paleta.colors.length-1));
		b_r=r0-(paleta.colors.length-1)*a_r;
		b_g=g0-(paleta.colors.length-1)*a_g;
		b_b=b0-(paleta.colors.length-1)*a_b;
		while (paleta.colors.length<ramp[i_ramp].i_color)
			paleta.colors.push(RGB(Math.round(a_r*paleta.colors.length+b_r), Math.round(a_g*paleta.colors.length+b_g), Math.round(a_b*paleta.colors.length+b_b)));
		bigint0 = bigint;
		r0=r;
		g0=g;
		b0=b;
		color0=color;
		paleta.colors.push(color0);
	}
	return 0;
}

function RGB(r,g,b)
{
	if (r<0 || r>255 || g<0 || g>255 || b<0 || b>255)
	{
		alert(GetMessage("WrongColorIndex", "paleta") + ": " + r + "," + g + "," + b + ". " + GetMessage("ColorIndicesHaveToBe", "paleta") + ".");
		return "#000000";
	}
	return "#" + (r.toString(16).length==1 ? "0"+r.toString(16) : r.toString(16))
			+ (g.toString(16).length==1 ? "0"+g.toString(16) : g.toString(16))
			+ (b.toString(16).length==1 ? "0"+b.toString(16) : b.toString(16));
}

//Aquesta funció necessita que color estigui en JSON i si no dona un error.
function RGB_JSON(color)
{
	if (typeof color!=="object" || typeof color.r!=="number" || typeof color.b!=="number" || typeof color.r!=="number")
	{
		alert(GetMessage("ColorNotObjectInFormat", "paleta") +
			" {r: ###, g: ###, b: ###}. "+
			GetMessage("HastagColorIndices", "paleta"));
		return color;
	}
	return RGB(color.r, color.g, color.b);
}


//Aquesta funció assumeix que si el color no és un RGB_JSON potser serà una cadena #RRGGBB i deixa continuar sense dir res
function RGB_color(color)
{
	if (typeof color!=="object" || typeof color.r!=="number" || typeof color.b!=="number" || typeof color.r!=="number")
		return color;
	return RGB(color.r, color.g, color.b);
}


