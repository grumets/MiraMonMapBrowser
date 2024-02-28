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

//Definits aquí i usats a histpie.js i a cntxmenu.js

function DonaTitolEstadistic(categories, attributes, tipus_estad)
{
var titol="";

	if (categories && attributes) //cas categòric
	{
		if (tipus_estad == "mode")
			titol=GetMessage("ModalClass");
		else if (tipus_estad == "percent_mode")
			titol=GetMessage("PercentageMode");
		else if (tipus_estad == "mode_and_percent")
			//titol=GetMessage("ModalClass")+" ("+GetMessage("PercentageMode")+")";
			titol=GetMessage("ModalClass")+" (%)";
	}
	else
	{
		if (tipus_estad == "sum")
			titol=GetMessage("Sum");
		else if (tipus_estad == "sum_area")
			titol=GetMessage("SumArea");
		else if (tipus_estad == "mean")
			titol=GetMessage("Mean");
		else if (tipus_estad == "variance")
			titol=GetMessage("Variance");
		else if (tipus_estad == "stdev")
			titol=GetMessage("StandardDeviation");
		else if (tipus_estad == "min")
			titol=GetMessage("Minimum");
		else if (tipus_estad == "max")
			titol=GetMessage("Maximum");
		else if (tipus_estad == "range")
			titol=GetMessage("Range");
	}
	return titol;
}

function CalculaCountClasseNValues(v, param)
{
var count=0, i, n=v.length;

	for(i=0;i<n;i++)
	{
		if (v[i]==param)
			count++;
	}
	return count;
}

function CalculaMeanNValues(v, param)
{
var n_valids=0, i, suma=0, v_i, n=v.length;

	for(i=0;i<n;i++)
	{
		v_i=v[i];
		if (!v_i && v_i!=0)
			continue;
		suma+=v_i;
		n_valids++;
	}
	if (!n_valids)
		return null;
	return suma/n_valids;
}

function CalculaStanDevNValues(v, param)
{
var n_valids=0, delta, i, suma=0, v_i, n=v.length;

	var mean=CalculaMeanNValues(v, param);
	if (mean==null)
		return null;

	for(i=0;i<n;i++)
	{
		v_i=v[i];
		if (!v_i && v_i!=0)
			continue;
		delta=v_i-mean;
		suma+=delta*delta;
		n_valids++;
	}
	if (!n_valids)
		return null;
	return Math.sqrt(suma/n_valids);
}

/* Si param == false (o undefined) retorna la primera moda en cas d'empat (això genera un biaix estadistic però és el cal fer si es calcula una imatge d'una serie temporal; de no fer-ho en cas d'empat entre dues taques de dues classes diferents genera salt i pebre)
   si param == true retorna una moda escollida aleatoriament en cas d'empat de modes (això no genera un biaix estadístic i és necessari per a finestres de convolució) */
function CalculaModeNValues(v, param)
{
var v_i, i, n=v.length, m_previa=[], n_m_previa=0, count_m_previa=0, m, count_m=0;

	if (v.length==0)
		return null;

	v.sort(sortAscendingNumberNull);  //ordena els null al final de la llista
	m=v[0];
	if (!m && m!=0)
		return null;

	count_m=1;
	for(i=1;i<n;i++)
	{
		v_i=v[i];
		if (!v_i && v_i!=0)
			break;
		if (m==v_i)
			count_m++;
		else
		{
			if (count_m_previa<count_m)
			{
				count_m_previa=count_m;
				m_previa[0]=m;
				n_m_previa=1;
			}
			else (count_m_previa==count_m)
			{
				m_previa[n_m_previa]=m;
				n_m_previa++;
			}
			//else no era una moda
			m=v_i;  //Nou candidat.
			count_m=1;
		}
	}
	if (count_m_previa<count_m)
		return m;
	if (!param)
		return m_previa[0];
	if (count_m_previa==count_m)
	{
		m_previa[n_m_previa]=m;
		n_m_previa++;
	}
	if (n_m_previa==1)
		return m_previa[0];
	return m_previa[Math.floor(Math.random()*n_m_previa)];
}

//Calcula estadistics categòrics a partir de les classes
function CalculaEstadisticsCategorics(classe)
{
var i, max_recompte=0;
var estadistics_categorics={
			recompte: 0,   //Nombre de pixels considerats en histograma que no són nodata. User estil.histograma.classe_nodata per saber el nombre de píxels a nodata
			i_moda: 0};    //categoria modal

	for (i=0; i<classe.length; i++)
	{
		if (!classe[i])
			continue;
		estadistics_categorics.recompte+=classe[i];
		if (max_recompte < classe[i]) //el nou recompte és més gran
		{
			max_recompte = classe[i];
			estadistics_categorics.i_moda = i;
		}
	}
	return estadistics_categorics;
}

//Calcula estadistics quantitatius continus a partir de les clases del histograma
function CalculaEstadisticsHistograma(classe, valor_min, valor_max, suma_real)
{
var ncolors=classe.length, value, i, suma_v_menys_mitj_quad_per_n=0;

var estadistics={valor_min: valor_min,   //Valor mínim cosiderat al histograma. Useu estil.histograma.component[].valorMinimReal per saber el valor mínim real
			valor_max: valor_max,  //Valor màxim cosiderat al histograma. Useu estil.histograma.component[].valorMaximReal per saber el valor màxim real
			ample: (valor_max-valor_min)/ncolors,           //Ample de cada clase
			recompte: 0,   //Nombre de pixels considerats en histograma que no són nodata. User estil.histograma.classe_nodata per saber el nombre de píxels a nodata
			suma: suma_real ? suma_real : 0,       //Suma de TOTS els valors de la imatge
			mitjana: 0,    //Mitjana de tots els valors de la imatge
			varianca: 0,   //Variança de tots els valors de la imatge
			desv_tipica: 0};  //Desviació estàndard de tots els valors de la imatge

	for (i=0, value=estadistics.ample/2+estadistics.valor_min; i<ncolors; i++, value+=estadistics.ample)
	{
		estadistics.recompte+=classe[i];
		if (suma_real==null)
			estadistics.suma+=classe[i]*value;
	}

	if (estadistics.recompte>0)
		estadistics.mitjana=estadistics.suma/estadistics.recompte;

	for (i=0; i<ncolors; i++)
	{
		value=estadistics.ample/2+estadistics.valor_min+estadistics.ample*i;
		suma_v_menys_mitj_quad_per_n+=(value-estadistics.mitjana)*(value-estadistics.mitjana)*classe[i];
	}

	if (estadistics.recompte>0)
	{
		estadistics.varianca=suma_v_menys_mitj_quad_per_n/estadistics.recompte;
		estadistics.desv_tipica=Math.sqrt(estadistics.varianca);
	}
	return estadistics;
}
