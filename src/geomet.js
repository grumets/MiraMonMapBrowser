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

function EsPuntDinsEnvolupant(punt, env)
{
	if (punt.x>env.MaxX ||
	    punt.x<env.MinX ||
	    punt.y>env.MaxY ||
	    punt.y<env.MinY)
		return false;

	return true;
}//Fi de EsPuntDinsEnvolupant()

//Contesta que sí fins i tots si és parcialment dins.
function EsEnvDinsEnvolupant(currentEnv, bigEnv)
{
	if (currentEnv.MinX>bigEnv.MaxX ||
	    currentEnv.MaxX<bigEnv.MinX ||
	    currentEnv.MinY>bigEnv.MaxY ||
	    currentEnv.MaxY<bigEnv.MinY)
		return false;

	return true;
}//Fi de EsEnvDinsEnvolupant()

//Codi adaptat de https://stackoverflow.com/questions/907390/how-can-i-tell-if-a-point-belongs-to-a-certain-line
//p1 i p2 defineixen un segment que te un ample "unilateral" w (cal dividir per 2 l'ample de dibuixat) i p és el punt que vole saber si "toca" el segment.
function EsPuntSobreSegment(p1, p2, p, w)
{
var leftPoint, rightPoint;

	// Normalize start/end to left right to make the offset calc simpler.
	if (p1.x <= p2.x)
	{
		leftPoint   = p1;
		rightPoint  = p2;
	}
	else
	{
		leftPoint   = p2;
		rightPoint  = p1;
	}

	// If point is out of bounds, no need to do further checks.
	if (p.x + w < leftPoint.x || rightPoint.x < p.x - w)
		return false;
	else if (p.y + w < Math.min(leftPoint.y, rightPoint.y) || Math.max(leftPoint.y, rightPoint.y) < p.y - w)
		return false;

	var d_x = rightPoint.x - leftPoint.x;
	if (d_x < w && d_x > -w)
	{
		// If the line is vertical, the earlier boundary check is enough to determine that the point is on the line.
		// Also prevents division by zero exceptions.
        	return true;
	}
    	var d_y = rightPoint.y - leftPoint.y;
	if (d_y < w && d_y > -w)
	{
		// If the line is horizontal, the earlier boundary check is enough to determine that the point is on the line.
		// Also prevents division by zero exceptions.
        	return true;
	}

	var a=d_y/d_x;

	if (a<=1 && a>=-1)
	{
		var b=leftPoint.y - leftPoint.x*a;
		var calculatedY  = p.x*a + b;

		// Check calculated Y matches the points Y coord with some easing.

		return (p.y - w <= calculatedY && calculatedY <= p.y + w);
	}
	else  //if (a>1)
	{
		var a=d_x/d_y;
		var b=leftPoint.x - leftPoint.y*a;
		var calculatedX  = p.y*a + b;
		return (p.x - w <= calculatedX && calculatedX <= p.x + w);
	}
}

//Codi adaptat de https://github.com/rowanwins/point-in-polygon-hao/blob/master/src/index.js
//Diu que està basat en aquest article: https://www.researchgate.net/publication/328261365_Optimal_Reliable_Point-in-Polygon_Test_and_Differential_Coding_Boolean_Operations_on_Polygons
/*p es el punt com un array de 2 valors i polygon és un polígon amb forats amb el format GeoJSON directament (un array d'arrays d'arrays de 2 valors)
retorna:
1 if point is contained inside the polygon
0 if point is on the boundary of the polygon
-1 if point is outside the polygon*/
function PuntEnElPoligon(p, polygon)
{
	var i, ii, k=0, f, u1, v1, u2, v2, currentP, nextP, contourLen, contour;
	var x = p[0], y = p[1];

	var numContours = polygon.length;
	for (i=0; i<numContours; i++)
	{
	 	contourLen = polygon[i].length-1;
		contour = polygon[i];

		currentP = contour[0];
		if (currentP[0] !== contour[contourLen][0] && currentP[1] !== contour[contourLen][1])
		{
		    alert("First and last coordinates in a ring must be the same");
				return -1;
		}

		u1 = currentP[0] - x;
		v1 = currentP[1] - y;

		for (ii=0; ii<contourLen; ii++)
		{
			nextP = contour[ii+1];
			v2 = nextP[1]-y;
			if ((v1 < 0 && v2 < 0) || (v1 > 0 && v2 > 0))
			{
				currentP = nextP;
				v1 = v2;
				u1 = currentP[0] - x;
				continue;
			}

			u2 = nextP[0] - p[0];
			if (v2 > 0 && v1 <= 0)
			{
				f = u1*v2 - u2*v1;
				if (f > 0)
					k++;
				else if (f === 0)
					return 0;
			}
			else if (v1 > 0 && v2 <= 0)
			{
			        f = u1*v2 - u2*v1;
			        if (f < 0)
					k++;
			        else if (f == 0)
					return 0;
			}
			else if (v2 == 0 && v1 < 0)
			{
				f = u1*v2 - u2*v1;
				if (f === 0)
					return 0;
			}
			else if (v1 == 0 && v2 < 0)
			{
			        f = u1*v2 - u2*v1
				if (f === 0)
					return 0;
			}
			else if (v1 == 0 && v2 == 0)
			{
			        if (u2 <= 0 && u1 >= 0)
					return 0;
				else if (u1 <= 0 && u2 >= 0)
					return 0;
			}
			currentP = nextP;
			v1 = v2;
			u1 = u2;
		}
	}

	if (k % 2 == 0)
		return -1;
	return 1;
}
