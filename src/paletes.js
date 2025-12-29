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

    Copyright 2001, 2024 Xavier Pons

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
var ramp=paleta.ramp, color, color0, r, g, b, a, r0, g0, b0, a0, a_r, a_g, a_b, a_a, b_r, b_g, b_b, b_a;
	if (!ramp || !ramp.length)
		return 1;
	color0=ramp[0].color;
	if (typeof color0==="object")
		color0=RGB_JSON(color0);
	color0=rgbaToHex(color0);
	if (typeof color0!=="string" || color0.charAt(0)!="#")
	{
		alert(GetMessage("UnsupportedColor", "imgrle") + ": " + color0 + ". " + GetMessage("UseTheFormat") + ": #RRGGBB");
		return 1;
	}
	r0=parseInt(color0.substr(1,2), 16);
	g0=parseInt(color0.substr(3,2), 16);
	b0=parseInt(color0.substr(5,2), 16);
	a0=(color0.length==9) ? parseInt(color0.substr(7,2), 16) : 255;
	paleta.colors=[color0];
	for (var i_ramp=1; i_ramp<ramp.length; i_ramp++)
	{
		color=ramp[i_ramp].color;
		if (typeof color==="object")
			color=RGB_JSON(color);
		color=rgbaToHex(color);
		if (typeof color!=="string" || color.charAt(0)!="#")
		{
			alert(GetMessage("UnsupportedColor", "imgrle") + ": " + color + ". " + GetMessage("UseTheFormat") + ": #RRGGBB");
			return 1;
		}

		r=parseInt(color.substr(1,2), 16);
		g=parseInt(color.substr(3,2), 16);
		b=parseInt(color.substr(5,2), 16);
		a=(color.length==9) ? parseInt(color.substr(7,2), 16) : 255;

		a_r=(r-r0)/(ramp[i_ramp].i_color-(paleta.colors.length-1));
		a_g=(g-g0)/(ramp[i_ramp].i_color-(paleta.colors.length-1));
		a_b=(b-b0)/(ramp[i_ramp].i_color-(paleta.colors.length-1));
		a_a=(a-a0)/(ramp[i_ramp].i_color-(paleta.colors.length-1));
		b_r=r0-(paleta.colors.length-1)*a_r;
		b_g=g0-(paleta.colors.length-1)*a_g;
		b_b=b0-(paleta.colors.length-1)*a_b;
		b_a=a0-(paleta.colors.length-1)*a_a;
		while (paleta.colors.length<ramp[i_ramp].i_color)
			paleta.colors.push(RGB(Math.round(a_r*paleta.colors.length+b_r), Math.round(a_g*paleta.colors.length+b_g), Math.round(a_b*paleta.colors.length+b_b), Math.round(a_a*paleta.colors.length+b_a)));
		r0=r;
		g0=g;
		b0=b;
		a0=a;
		color0=color;
		paleta.colors.push(color0);
	}
	return 0;
}

function RGB(r,g,b,a)
{
	if (r<0 || r>255 || g<0 || g>255 || b<0 || b>255)
	{
		alert(GetMessage("WrongColorIndex", "paleta") + ": " + r + "," + g + "," + b + ". " + GetMessage("ColorIndicesHaveToBe", "paleta") + ".");
		return "#000000";
	}
	return "#" + (r.toString(16).length==1 ? "0"+r.toString(16) : r.toString(16))
			+ (g.toString(16).length==1 ? "0"+g.toString(16) : g.toString(16))
			+ (b.toString(16).length==1 ? "0"+b.toString(16) : b.toString(16))
			+ (typeof a==="undefined" ? "" : (a.toString(16).length==1 ? "0"+a.toString(16) : a.toString(16)));
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

/*Adapted from: https://medium.com/@techsolutionsx/converting-rgba-to-hex-in-javascript-a-comprehensive-guide-908fbb1d13cf
rgbaToHex('rgba(255, 99, 71, 0.5)') // Output: #ff634780
rgbaToHex('rgb(255, 99, 71)')       // Output: #ff6347
rgbaToHex('255 99 71 / 0.5')        // Output: #ff634780
rgbaToHex('255 99 71 / 0.5', true)) // Output: #ff6347
rgbaToHex(#ff6347) 		    // Output: #ff6347
*/
function rgbaToHex(colorStr, forceRemoveAlpha)
{
	// Check if the input string contains '/'
	const hasSlash = colorStr.includes('/')

	if (hasSlash) {
    		// Extract the RGBA values from the input string
    		const rgbaValues = colorStr.match(/(\d+)\s+(\d+)\s+(\d+)\s+\/\s+([\d.]+)/);

		if (!rgbaValues) 
			return colorStr; // Return the original string if it doesn't match the expected format

		const [red, green, blue, alpha] = rgbaValues.slice(1, 5).map(parseFloat);

		// Convert the RGB values to hexadecimal format	
		const redHex = red.toString(16).padStart(2, '0');
		const greenHex = green.toString(16).padStart(2, '0');
		const blueHex = blue.toString(16).padStart(2, '0');

		// Convert alpha to a hexadecimal format (assuming it's already a decimal value in the range [0, 1])
		const alphaHex = forceRemoveAlpha ? '' : Math.round(alpha * 255).toString(16).padStart(2, '0');

		// Combine the hexadecimal values to form the final hex color string
		return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
	} else {
		// Use the second code block for the case when '/' is not present
		if (!colorStr.startsWith("rgba(") && !colorStr.startsWith("rgb("))
			return(colorStr);
		return (
			'#' +
			colorStr
			.replace(/^rgba?\(|\s+|\)$/g, '') // Get's rgba / rgb string values
			.split(',') // splits them at ","
			.filter((string, index) => !forceRemoveAlpha || index !== 3)
			.map(string => parseFloat(string)) // Converts them to numbers
			.map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
			.map(number => number.toString(16)) // Converts numbers to hex
			.map(string => (string.length === 1 ? '0' + string : string)) // Adds 0 when length of one number is 1
			.join('')
		);
	}
}

