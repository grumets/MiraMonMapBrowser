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

function GaussianFit(){};

//GaussianFit.sqr2pi = Math.sqrt(2 * Math.PI);

GaussianFit.evalAssymGaussian = function(x, r_left, r_right)
{
	if (x<=r_left.mean)
		return r_left.c*Math.exp(-(x-r_left.mean)*(x-r_left.mean)/r_left.sdev_square_2)+r_left.base;
	return r_right.c*Math.exp(-(x-r_right.mean)*(x-r_right.mean)/r_right.sdev_square_2)+r_right.base;
}

GaussianFit.CenterGaussian = function(ys)
{
var len=ys.length, ymax=ys[0], i_center=0;

	for (var i=1; i<len; i++)
	{
		if (ymax<ys[i])
		{
			ymax=ys[i];
			i_center=i;
		}			
	}
	return i_center;
}

GaussianFit.leftGaussian = function(xs, ys, i_center)
{
var sigma=0, n=0, base=ys[0];
	if (i_center==null)
		i_center=xs.length-1;		

	for (var i=0; i<i_center; i++)
	{
		if (base>ys[i])
			base=ys[i];
	}


	for (var i=0; i<i_center; i++)
	{
		sigma+=(ys[i]-base)*(xs[i]-xs[i_center])*(xs[i]-xs[i_center]);
		n+=ys[i]-base;
	}
	n+=ys[i_center]-base;
	var sdev_square=sigma/(n-1)

	return {mean: xs[i_center], sdev_square_2: sdev_square*2, sdev: Math.sqrt(sdev_square), base: base, c: ys[i_center]-base /* 1/(Math.sqrt(sdev_square)*GaussianFit.sqr2pi) */};
}

GaussianFit.rightGaussian = function(xs, ys, i_center)
{
var sigma=0, n, len=ys.length, base=ys[i_center];
	
	for (var i=i_center+1; i<len; i++)
	{
		if (base>ys[i])
			base=ys[i];
	}

	n=ys[i_center]-base;
	for (var i=i_center+1; i<len; i++)
	{
		sigma+=(ys[i]-base)*(xs[i]-xs[i_center])*(xs[i]-xs[i_center]);
		n+=ys[i]-base;
	}
	var sdev_square=sigma/(n-1);

	return {mean: xs[i_center], sdev_square_2: sdev_square*2, sdev: Math.sqrt(sdev_square), base: base, c: ys[i_center]-base /* 1/(Math.sqrt(sdev_square)*GaussianFit.sqr2pi) */};
}

