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
