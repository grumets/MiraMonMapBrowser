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

var prefixNovaVistaFinestra="nova_vista_fin_";
var prefixHistogramaFinestra="histo_fin_";
var sufixCheckDinamicHistograma="_dinamic";

function CopiaPortapapersFinestraLayer(nom_finestra)
{
	if (nom_finestra.length>prefixHistogramaFinestra.length && nom_finestra.substring(0, prefixHistogramaFinestra.length) == prefixHistogramaFinestra)
	{
		var i_histo, prefix_div_copy, div, textarea;
		i_histo=parseInt(nom_finestra.substring(prefixHistogramaFinestra.length));
		if (isNaN(i_histo))
			return;
		prefix_div_copy=prefixHistogramaFinestra+i_histo;
		div = window.document.getElementById(prefix_div_copy+"_copy_form_div");
		div.style.display="inline";  //Sembla que no es pot fer un select d'un element invisible.
		textarea = window.document.getElementById(prefix_div_copy+"_copy_text");
		textarea.select();
		window.document.execCommand("Copy");
		div.style.display="none";
		window.alert(DonaCadenaLang({"cat": "Els valors de la imatge han estat copiats al portaretalls en format", "spa": "Los valores de la image han sido copiados al portapapeles en formato", "eng": "The values of the image have been copied to clipboard in the format", "fre": "Les valeurs du graphique ont été copiées dans le presse-papier dans le format"}) + " " + DonaCadenaLang({"cat": "text separat per tabulacions", "spa": "texto separado por tabulaciones", "eng": "tab-separated text", "fre": "texte séparé par des tabulations"})+".");
	}
}

var HistogramaFinestra={"n": 0, "vista":[]};

function CanviaIndexosCapesHistogramaFinestra(n_moviment, i_capa_ini, i_capa_fi_per_sota)
{
	if (HistogramaFinestra && HistogramaFinestra.n && HistogramaFinestra.vista.length>0)
	{
		for (var i=0; i<HistogramaFinestra.vista.length; i++)
		{
			if (HistogramaFinestra.vista[i].i_capa>=i_capa_ini && HistogramaFinestra.vista[i].i_capa<i_capa_fi_per_sota)
				HistogramaFinestra.vista[i].i_capa+=n_moviment;
		}
	}
}

function OmpleTextPortapapersFinestraHistogramaADivisio(i_histo, tipus_chart)
{
var histograma, prefix_div_copy, capa, estil, costat, env, i_situacio, area_cella, cdns=[], div, textarea;

	histograma=HistogramaFinestra.vista[i_histo];
	prefix_div_copy=prefixHistogramaFinestra+i_histo;
	capa=ParamCtrl.capa[histograma.i_capa];
	estil=capa.estil[histograma.i_estil];
	costat=ParamInternCtrl.vista.CostatZoomActual;
	env={MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY};
	i_situacio=ParamInternCtrl.ISituacio;

	area_cella=DonaAreaCella(env, costat, ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);

	cdns.push(DonaCadenaLang({"cat": "Capa", "spa": "Capa", "eng": "Layer", "fre": "Couche"}), "\t", DonaCadena(capa.desc), "\n",
		DonaCadenaLang({"cat": "Data", "spa": "Fecha", "eng": "Date", "fre": "Date"}), "\t", capa.data ? DonaDataCapaComATextBreu(histograma.i_capa, capa.i_data) : "", "\n",
		//DonaCadenaLang({"cat": "Estil", "spa": "Estilo", "eng": "Style", "fre": "Style"}), "\t", DonaCadena(estil.desc), "\t", ((estil.DescItems) ? DonaCadena(estil.DescItems) : ""), "\n",
		DonaCadenaLang({"cat": "Estil", "spa": "Estilo", "eng": "Style", "fre": "Style"}), "\t", DonaCadena(estil.desc), "\n",
		DonaCadenaLang({"cat": "Costat de cel·la", "spa": "Lado de celda", "eng": "Cell size", "fre": "Taille de la cellule"}), " (", DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS), ")\t", costat, "\n",
		DonaCadenaLang({"cat": "Àrea de la cel·la", "spa": "Área de celda", "eng": "Cell area", "fre": "Zone de la cellule"}), " (m²)\t", area_cella, "\n",
		"MinX", "\t", env.MinX, "\n",
		"MaxX", "\t", env.MaxX, "\n",
		"MinY", "\t", env.MinY, "\n",
		"MaxY", "\t", env.MaxY, "\n");

	if (tipus_chart == "matriu") //else if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
	{
		cdns.push(CreaTextMatriuDeConfusio(i_histo, false)); /*no es pot posar el segon paràmetre a true, o es crearà un bucle infinit. Si en algun moment es vol copiar al portatapers en format hml, cal repensar
		com CreaTextMatriuDeConfusio crida a OmpleTextPortapapersFinestraHistogramaADivisio per evitar-ho (matenint que CreaTextMatriuDeConfusió actualitizi el OmpleTextPortapapers...*/
	}
	else if (tipus_chart == "stat" || tipus_chart == "chart") //en els dos casos el portapapers té tots els estadístics
	{
		var i_c, i, i_cat, columna_perc=false;
		if (estil.categories && estil.atributs) //cas categòric
		{
			var n_comp_usar = estil.component.length==2 ? 1 : estil.component.length;
			var estadistics_categorics=[];
			for (i_c=0; i_c<n_comp_usar; i_c++)
				estadistics_categorics[i_c]=CalculaEstadisticsCategorics(estil.histograma.component[i_c].classe);
			cdns.push(DonaCadenaLang({"cat": "Recompte", "spa": "Cuenta", "eng": "Count", "fre": "Compter"}));

			var un_recompte=estadistics_categorics[0].recompte;
			for (i_c=1; i_c<n_comp_usar; i_c++)
			{
				if (un_recompte!=estadistics_categorics[i_c].recompte)
					break;
			}
			if (i_c==n_comp_usar) //tots són iguals
			{
					cdns.push("\t", un_recompte);
					cdns.push("\n", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
					cdns.push("\t", un_recompte*area_cella);
			}
			else
			{
				for (i_c=0; i_c<n_comp_usar; i_c++)
					cdns.push("\t", estadistics_categorics[i_c].recompte);
				cdns.push("\n", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
				for (i_c=0; i_c<n_comp_usar; i_c++)
					cdns.push("\t", estadistics_categorics[i_c].recompte*area_cella);
			}
			cdns.push("\n",
				DonaCadenaLang({"cat": "Descripció de classe", "spa": "Descripción de clase", "eng": "Class description", "fre": "Description de la classe"}));
			for (i_c=0; i_c<n_comp_usar; i_c++)
				cdns.push("\t", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))));

			cdns.push("\n",	GetMessage("ModalClass"));
			for (i_c=0; i_c<n_comp_usar; i_c++)
				cdns.push("\t", DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, estadistics_categorics[i_c].i_moda, true));

			cdns.push("\n",	GetMessage("PercentageMode"));
			for (i_c=0; i_c<n_comp_usar; i_c++)
				cdns.push("\t", estil.histograma.component[i_c].classe[estadistics_categorics[i_c].i_moda]/estadistics_categorics[i_c].recompte*100);

			if (tipus_chart == "chart") //per chart poso histograma, per stat no
			{
				cdns.push("\n",	DonaCadenaLang({"cat": "Valor de classe", "spa": "Valor de classe", "eng": "Class value", "fre": "Valeur de classe"}),
						"\t", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");

				if (n_comp_usar == 1) //si només tinc una component, habitual en classes, a la segona columna poso el % de l'àrea d'aquella categoria
					columna_perc=true;
				if (columna_perc)
					cdns.push("\t",	DonaCadenaLang({"cat": "Percentatge de l'àrea", "spa": "Porcentaje del área", "eng": "Percentage of area", "fre": "Pourcentage de zone"}));

				cdns.push("\n");

				var n_colors=(estil.paleta && estil.paleta.colors) ? estil.paleta.colors.length : 256;
				var a0=DonaFactorAEstiramentPaleta(estil.component[0].estiramentPaleta, n_colors);
				var valor_min0=DonaFactorValorMinEstiramentPaleta(estil.component[0].estiramentPaleta);

				//for (i=0; i<estil.categories.length; i++)
				for (i=0; i<estil.histograma.component[0].classe.length; i++)
				{
					i_cat=estil.component[0].estiramentPaleta ? Math.floor(i/a0+valor_min0) : i;
					if (!estil.categories[i_cat])
						continue;
					cdns.push(DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, i_cat, true));

					for (i_c=0; i_c<n_comp_usar; i_c++)
					{
						cdns.push("\t", estil.histograma.component[i_c].classe[i]*area_cella);
						if (columna_perc)
							cdns.push("\t", estil.histograma.component[i_c].classe[i]/estadistics_categorics[i_c].recompte*100);
					}
					cdns.push("\n");
				}
			}
		}
		else
		{
			var value, ncolors;
			var estadistics=[];
			for (i_c=0; i_c<estil.component.length; i_c++)
			{
				ncolors=estil.histograma.component[i_c].classe.length;  //El nombre de colors, o és el nombre de colors de la paleta, o és 256 per totes les bandes
				estadistics[i_c]=CalculaEstadisticsHistograma(estil.histograma.component[i_c].classe,
							DonaFactorValorMinEstiramentPaleta(estil.component[i_c].estiramentPaleta),
							DonaFactorValorMaxEstiramentPaleta(estil.component[i_c].estiramentPaleta, ncolors),
							estil.histograma.component[i_c].sumaValorsReal);
			}
			cdns.push(DonaCadenaLang({"cat": "Recompte", "spa": "Cuenta", "eng": "Count", "fre": "Compter"}));

			var un_recompte=estadistics[0].recompte
			for (i_c=1; i_c<estil.component.length; i_c++)
			{
				if (un_recompte!=estadistics[i_c].recompte)
					break;
			}
			if (i_c==estil.component.length) //tots són iguals
			{
					cdns.push("\t", un_recompte);
					cdns.push("\n", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
					cdns.push("\t", un_recompte*area_cella);
			}
			else
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push("\t", estadistics[i_c].recompte);
				cdns.push("\n", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push("\t", estadistics[i_c].recompte*area_cella);
			}
			cdns.push("\n",
				DonaCadenaLang({"cat": "Descripció de classe", "spa": "Descripción de clase", "eng": "Class description", "fre": "Description de la classe"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))));
			cdns.push("\n",	GetMessage("Sum"));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].suma);
			cdns.push("\n",	GetMessage("SumArea"), " (*m²)");
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].suma*area_cella);
			cdns.push("\n",	GetMessage("Mean"));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].mitjana);
			cdns.push("\n",	GetMessage("Variance"));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].varianca);
			cdns.push("\n",	GetMessage("StandardDeviation"));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].desv_tipica);
			cdns.push("\n",	GetMessage("Minimum"));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estil.histograma.component[i_c].valorMinimReal);
			cdns.push("\n",	GetMessage("Maximum"));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estil.histograma.component[i_c].valorMaximReal);
			cdns.push("\n",	GetMessage("Range"));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estil.histograma.component[i_c].valorMaximReal-estil.histograma.component[i_c].valorMinimReal+1);

			if (tipus_chart == "chart") //per chart poso histograma, per stat no
			{
				cdns.push("\n",
					DonaCadenaLang({"cat": "Descripció de classe", "spa": "Descripción de clase", "eng": "Class description", "fre": "Description de la classe"}));
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push("\t", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))));

				for (i_c=1; i_c<estil.component.length; i_c++)
				{
					if (estadistics[i_c-1].valor_min!=estadistics[i_c].valor_min || estadistics[i_c-1].ample!=estadistics[i_c].ample)
						break;
				}
				if (i_c==estil.component.length)
				{
					//el valor màxim i mínim (i l'ample) són iguals per totes les components
					cdns.push("\n",
						DonaCadenaLang({"cat": "Valor central de la classe", "spa": "Valor central de la classe", "eng": "Class cental value", "fre": "Classe valeur centrale"}));
					for (i_c=0; i_c<estil.component.length; i_c++)
						cdns.push("\t", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
					if (estil.component.length==1 /*&& ncolors<51 havíem pensat que si tinc 255 colors els % serien molt petits, i és així per molts, pero alguns tenn valors alts, i és interessant de veure igualment*/)
					{
						columna_perc=true;
						cdns.push("\t",	DonaCadenaLang({"cat": "Percentatge de l'àrea", "spa": "Porcentaje del área", "eng": "Percentage of area", "fre": "Pourcentage de zone"}));
					}
					cdns.push("\n");

					//Tots els estiraments són iguals
					for (i=0, value=estadistics[0].ample/2+estadistics[0].valor_min; i<ncolors; i++, value+=estadistics[0].ample)
					{
						/*if (estil.descColorMultiplesDe)
							cdns.push(multipleOf(value, estil.descColorMultiplesDe));
						else*/
							cdns.push(value);
						for (i_c=0; i_c<estil.component.length; i_c++)
							cdns.push("\t", estil.histograma.component[i_c].classe[i]*area_cella);

						if (columna_perc) //si això és true és que només tinc 1 component, i per tant aquest % quedarà a la segona columna
							cdns.push("\t", estil.histograma.component[0].classe[i]/un_recompte*100);

						cdns.push("\n");
					}
				}
				else
				{
					for (i_c=0; i_c<estil.component.length; i_c++)
						cdns.push("\t", DonaCadenaLang({"cat": "Valor central de la classe", "spa": "Valor central de la clase", "eng": "Class central value", "fre": "Classe valeur centrale"}),
							"\t", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
					if (estil.component.length==1 /*&& ncolors<51 havíem pensat que si tinc 255 colors els % serien molt petits, i és així per molts, pero alguns tenn valors alts, i és interessant de veure igualment*/)
					{
						columna_perc=true;
						cdns.push("\t",	DonaCadenaLang({"cat": "Percentatge de l'àrea", "spa": "Porcentaje del área", "eng": "Percentage of area", "fre": "Pourcentage de zone"}));
					}
					cdns.push("\n");

					for (i=0; i<ncolors; i++)
					{
						cdns.push(i);
						for (i_c=0; i_c<estil.component.length; i_c++)
						{
							value=estadistics[i_c].ample/2+estadistics[i_c].valor_min+estadistics[i_c].ample*i
							cdns.push("\t", value, "\t", estil.histograma.component[i_c].classe[i]*area_cella);
						}

						if (columna_perc) //si això és true és que només tinc 1 component, i per tant aquest % quedarà a la segona columna
								cdns.push("\t", estil.histograma.component[0].classe[i]/un_recompte*100);

						cdns.push("\n");
					}
				}
			}
		}
		if (tipus_chart == "chart") //per chart poso histograma, per stat no
		{
			cdns.push(DonaCadenaLang({"cat": "Sense dades", "spa": "Sin datos", "eng": "No data", "fre": "Pas de données"}),
					"\t", estil.histograma.classe_nodata*area_cella);
			if (columna_perc)
				cdns.push("\t - \n");
			else
				cdns.push("\n");
		}
	}
	else if ((tipus_chart == "stat_categ" || tipus_chart == "chart_categ") &&			//cas d'estadistics de categories
					 (estil.categories && estil.atributs && estil.component.length == 2)) //en els dos casos el portapapers té tots els estadístics
	{
		var i_cat;
		var estadistics_categorics=CalculaEstadisticsCategorics(estil.histograma.component[0].classe);

		//primer poso les unitats de la segona capa de la combinació: -> quan s'ha creat la capa combinada, les unitats dels atributs estadístics són la descripció de la segona categoria
		cdns.push(DonaCadenaLang({"cat": "Descripció de classe", "spa": "Descripción de clase", "eng": "Class description", "fre": "Description de la classe"}), "\t");
				// això acaba donant el nom de la capa combinada, que no és el que vull aqui -> "\t", (estil.component[1].desc ? estil.component[1].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))));
		if (estil.component[1].herenciaOrigen.categories && estil.component[1].herenciaOrigen.atributs) //la segona també es categòrica
			cdns.push(estil.component[1].herenciaOrigen.atributs[0].descripcio ? estil.component[1].herenciaOrigen.atributs[0].descripcio : estil.component[1].herenciaOrigen.atributs[0].nom);
		else
		{
			for (i_cat=0; i_cat<estil.atributs.length; i_cat++)
			{
				if (estil.atributs[i_cat].nom == "$stat$_sum" && estil.atributs[i_cat].unitats)
				{
					cdns.push(estil.atributs[i_cat].unitats);
					break;
				}
			}
		}

		//després poso la capçalera de la separació per classes
		cdns.push("\n", DonaCadenaLang({"cat": "Classe", "spa": "Clase", "eng": "Class", "fre": "Classe"}), "\t", DonaCadenaLang({"cat": "Totes", "spa": "Todas", "eng": "All", "fre": "Toutes"}));
		for (i_cat=0; i_cat<estil.categories.length; i_cat++)
		{
				if (estil.categories[i_cat])
					cdns.push("\t", DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, i_cat, true));
		}


		//i després construeixo una taula amb els tots els estadístics típics en les files i amb les N categories en les columnes. Si hi ha moltes categories la taula
		// quedarà molt ample, però no és un problema. A més prefereixo fer les categ en columnes pq així les files son com en el cas normal
		if (estil.component[1].herenciaOrigen.categories) //la segona també es categòrica
		{
			estadistics_categorics=CalculaEstadisticsCategorics_AgrupatsDesDeCategories(estil.categories);
			cdns.push("\n", DonaCadenaLang({"cat": "Recompte per categoria", "spa": "Cuenta por categoría", "eng": "Count by category", "fre": "Compter par catégorie"}), " (m²)", "\t", estadistics_categorics.recompte);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.histograma.component[0].classe[i_cat]);
			}

			cdns.push("\n",	DonaCadenaLang({"cat": "Àrea per categoria", "spa": "Área por categoría", "eng": "Area by category", "fre": "Zone par catégorie"}), " (m²)", "\t", estadistics_categorics.recompte*area_cella);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.histograma.component[0].classe[i_cat]*area_cella);
			}

			cdns.push("\n",	DonaCadenaLang({"cat": "Àrea per categoria", "spa": "Área por categoría", "eng": "Area by category", "fre": "Zone par catégorie"}), " (%)", "\t", "100");
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.histograma.component[0].classe[i_cat]/estadistics_categorics.recompte*100);
			}

			cdns.push("\n",	GetMessage("ModalClass"), "\t", DonaTextCategoriaDesDeColor(estil.component[1].herenciaOrigen.categories, estil.component[1].herenciaOrigen.atributs, estadistics_categorics.i_moda, true));
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_i_mode"] ? DonaTextCategoriaDesDeColor(estil.component[1].herenciaOrigen.categories, estil.component[1].herenciaOrigen.atributs, estil.categories[i_cat]["$stat$_i_mode"], true) : 0);
			}

			cdns.push("\n",	GetMessage("PercentageMode"), "\t",  estadistics_categorics.recompte_moda/estadistics_categorics.recompte*100);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_percent_mode"] ? estil.categories[i_cat]["$stat$_percent_mode"] : 0);
			}
		}
		else //la segona és QC
		{
			estadistics=CalculaEstadisticsHistograma_AgrupatsDesDeCategories(estil.categories, DonaFactorValorMinEstiramentPaleta(estil.component[1].estiramentPaleta),
					DonaFactorValorMaxEstiramentPaleta(estil.component[1].estiramentPaleta, estil.component[1].herenciaOrigen.ncolors));

			cdns.push("\n", DonaCadenaLang({"cat": "Recompte per categoria", "spa": "Cuenta por categoría", "eng": "Count by category", "fre": "Compter par catégorie"}), " (m²)", "\t", estadistics.recompte);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.histograma.component[0].classe[i_cat]);
			}

			cdns.push("\n",	DonaCadenaLang({"cat": "Àrea per categoria", "spa": "Área por categoría", "eng": "Area by category", "fre": "Zone par catégorie"}), " (m²)", "\t", estadistics.recompte*area_cella);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.histograma.component[0].classe[i_cat]*area_cella);
			}

			cdns.push("\n",	DonaCadenaLang({"cat": "Àrea per categoria", "spa": "Área por categoría", "eng": "Area by category", "fre": "Zone par catégorie"}), " (%)", "\t", "100");
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.histograma.component[0].classe[i_cat]/estadistics.recompte*100);
			}

			cdns.push("\n",	GetMessage("Sum"), "\t", estadistics.suma);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_sum"] ?  estil.categories[i_cat]["$stat$_sum"] : 0);
			}

			cdns.push("\n",	GetMessage("SumArea"), " (*m²)\t", estadistics.suma*area_cella);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_sum_area"] ? estil.categories[i_cat]["$stat$_sum_area"] : (estil.categories[i_cat]["$stat$_sum"] ? estil.categories[i_cat]["$stat$_sum"]*area_cella : 0));
			}

			cdns.push("\n",	GetMessage("Mean"), "\t", estadistics.mitjana);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_mean"] ? estil.categories[i_cat]["$stat$_mean"] : 0);
			}

			cdns.push("\n",	GetMessage("Variance"), "\t", estadistics.varianca);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_variance"] ? estil.categories[i_cat]["$stat$_variance"] : 0);
			}

			cdns.push("\n",	GetMessage("StandardDeviation"), "\t", estadistics.desv_tipica);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_stdev"] ? estil.categories[i_cat]["$stat$_stdev"] : 0);
			}

			cdns.push("\n",	GetMessage("Minimum"), "\t", estadistics.valor_min);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_min"] ? estil.categories[i_cat]["$stat$_min"] : 0);
			}

			cdns.push("\n",	GetMessage("Maximum"), "\t", estadistics.valor_max);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_max"] ? estil.categories[i_cat]["$stat$_max"] : 0);
			}

			cdns.push("\n",	GetMessage("Range"), "\t", estadistics.valor_max-estadistics.valor_min+1);
			for (i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
					cdns.push("\t", estil.categories[i_cat]["$stat$_range"] ? estil.categories[i_cat]["$stat$_range"] : 0);
			}
		}
	}
	div=window.document.getElementById(prefix_div_copy+"_copy_form_div")
	textarea = window.document.getElementById(prefix_div_copy+"_copy_text");
	textarea.value=cdns.join("");
}

function CanviDinamismeHistograma(event)
{
	var n_histo, i_str, i_str_2, estil, retorn_prep_histo;

	if (event.srcElement)
	{
		i_str=event.srcElement.id.indexOf(prefixHistogramaFinestra);
		i_str_2=event.srcElement.id.indexOf(sufixCheckDinamicHistograma);
		n_histo=parseInt(event.srcElement.id.substr(i_str+prefixHistogramaFinestra.length, i_str_2-i_str+prefixHistogramaFinestra.length));
		if (isNaN(n_histo))
			return;

		if (window.document.getElementById(event.srcElement.id).checked)
		{
			estil=ParamCtrl.capa[HistogramaFinestra.vista[n_histo].i_capa].estil[HistogramaFinestra.vista[n_histo].i_estil]
			if (estil.diagrama)
			{
				for (var i_diagrama=0; i_diagrama<estil.diagrama.length; i_diagrama++)
				{	//actualitzo els diagrames
					if (estil.diagrama[i_diagrama].i_histograma!=n_histo) //si no és el que ha provocat l'event, no faig res
						continue;

					if (estil.diagrama[i_diagrama].tipus == "chart")
					{
						for (var i_c=0; i_c<estil.component.length; i_c++)
						{
							retorn_prep_histo=PreparaHistograma(n_histo, i_c);
							HistogramaFinestra.vista[n_histo].chart[i_c].config.data.labels=retorn_prep_histo.labels;
							HistogramaFinestra.vista[n_histo].chart[i_c].config.data.valors=(retorn_prep_histo.valors ? retorn_prep_histo.valors : null);
							HistogramaFinestra.vista[n_histo].chart[i_c].config.data.datasets=[{data: retorn_prep_histo.data,
															backgroundColor: retorn_prep_histo.colors,
															unitats: retorn_prep_histo.unitats}];
							HistogramaFinestra.vista[n_histo].chart[i_c].options=retorn_prep_histo.options;
							HistogramaFinestra.vista[n_histo].chart[i_c].update();
						}
					}
					else if (estil.diagrama[i_diagrama].tipus == "chart_categ")
					{
						//actualitzo el/s gràfic/s i això també actualitza el text ocult de la finestra que es copia al portapapers
						retorn_prep_histo=PreparaHistogramaPerCategories(n_histo, estil.diagrama[i_diagrama].stat, estil.diagrama[i_diagrama].order);
						//Gràfic de l'àrea
						HistogramaFinestra.vista[n_histo].chart[0].config.data.labels=retorn_prep_histo.labels;
						//HistogramaFinestra.vista[n_histo].chart[0].config.data.valors=(retorn_prep_histo.valors ? retorn_prep_histo.valors : null);
						HistogramaFinestra.vista[n_histo].chart[0].config.data.datasets=[{data: retorn_prep_histo.data_area,
														backgroundColor: retorn_prep_histo.colors_area,
														unitats: retorn_prep_histo.unitats_area}];
						HistogramaFinestra.vista[n_histo].chart[0].options=retorn_prep_histo.options_area;
						HistogramaFinestra.vista[n_histo].chart[0].update();
						//Gràfic de l'estadístic
						HistogramaFinestra.vista[n_histo].chart[1].config.data.labels=retorn_prep_histo.labels;
						//HistogramaFinestra.vista[n_histo].chart[0].config.data.valors=(retorn_prep_histo.valors ? retorn_prep_histo.valors : null);
						HistogramaFinestra.vista[n_histo].chart[1].config.data.datasets=[{data: retorn_prep_histo.data_estad,
														backgroundColor: retorn_prep_histo.colors_estad,
														unitats: retorn_prep_histo.unitats_estad}];
						HistogramaFinestra.vista[n_histo].chart[1].options=retorn_prep_histo.options_estad;
						HistogramaFinestra.vista[n_histo].chart[1].update();
					}
					else if (estil.diagrama[i_diagrama].tipus == "matriu")
						document.getElementById(DonaNomMatriuConfusio(n_histo)).innerHTML=CreaTextMatriuDeConfusio(n_histo, true);
					else if (estil.diagrama[i_diagrama].tipus == "stat")
						document.getElementById(DonaNomEstadistic(n_histo)).innerHTML=CreaTextEstadistic(n_histo, estil.diagrama[i_diagrama].stat);
					else if (estil.diagrama[i_diagrama].tipus == "stat_categ")
						document.getElementById(DonaNomEstadistic(n_histo)).innerHTML=CreaTextEstadisticPerCategories(n_histo, estil.diagrama[i_diagrama].stat, estil.diagrama[i_diagrama].order);
				}
			}
		}
	}
}

function DonaNomHistograma(i_histo)
{
	return prefixHistogramaFinestra+i_histo;
}

function DonaNomMatriuConfusio(i_histo)
{
	return DonaNomHistograma(i_histo)+"_matriu";
}

function DonaNomEstadistic(i_histo)
{
	return DonaNomHistograma(i_histo)+"_estad";
}

function DonaNomCanvasHistograma(i_histo)
{
	return DonaNomHistograma(i_histo)+"_canvas_";
}

function DonaNomCheckDinamicHistograma(i_histo)
{
	return DonaNomHistograma(i_histo)+sufixCheckDinamicHistograma;
}

function DonaNomCheckDinamicLabelHistograma(i_histo)
{
	return DonaNomCheckDinamicHistograma(i_histo)+"_label";
}

function DonaNomCheckDinamicTextHistograma(i_histo)
{
	return DonaNomCheckDinamicHistograma(i_histo)+"_text";
}

function ObreFinestraHistograma(i_capa, i_estil, tipus_estad, presentacio, order)
{
var ncol=460, nfil=260, estil, i_estil_intern, component, titol;
var nom_histograma=DonaNomHistograma(HistogramaFinestra.n);
var cdns=[];
var def_diagrama_existeix=false;
var i_diag=-1, des_top=-9999, des_left=-9999, des_width=-9999, des_height=-9999;
var tipus_chart;

	if (typeof i_estil !== "undefined" && i_estil != -1)
	{
		i_estil_intern=i_estil;
		def_diagrama_existeix=true;
	}
	else //si em pasen un estil concret d'aquesta capa, que pot no ser el "actiu", l'uso
		i_estil_intern=ParamCtrl.capa[i_capa].i_estil;
	estil=ParamCtrl.capa[i_capa].estil[i_estil_intern];
	component=estil.component;

	if (typeof estil.histograma === "undefined") // ara no estic preparat perquè no ha arribat la imatge
		return;

	//Check per a Histograma dinàmic i text per a indicar que actualització aturada per capa no visible
	cdns.push("<input type=\"checkbox\" name=\"", DonaNomCheckDinamicHistograma(HistogramaFinestra.n), "\" id=\"", DonaNomCheckDinamicHistograma(HistogramaFinestra.n), "\" checked=\"checked\" onclick=\"CanviDinamismeHistograma(event);\">")
	cdns.push("<label for=\"", DonaNomCheckDinamicHistograma(HistogramaFinestra.n), "\" id=\"", DonaNomCheckDinamicLabelHistograma(HistogramaFinestra.n), "\">", DonaCadenaLang({"cat":"Dinàmic", "spa":"Dinàmico", "eng":"Dynamic", "fre":"Dynamique"}) , "</label>");
	cdns.push("&nbsp;&nbsp;<span id=\"", DonaNomCheckDinamicTextHistograma(HistogramaFinestra.n), "\" style=\"display: none\">",
		DonaCadenaLang({"cat":"Desactivat (capa o estil no visible)", "spa":"Desactivado (capa o estil no visible)", "eng":"Disabled (layer or style not visible)", "fre":"Désactivé (couche or style non visible)"}) , "</span>");

	if (tipus_estad)
	{
		var tip_est_intern;
		if (tipus_estad.substr(tipus_estad.length-2, 2) == "_2")
		{
			tip_est_intern=tipus_estad.substring(0, tipus_estad.length-2);
			titol=DonaCadenaLang({"cat":"Estadístics", "spa":"Estadísticos", "eng":"Statistics", "fre":"Statistique"})+" " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(estil.desc);
			//titol=DonaCadenaLang({"cat":"Estadístics per categoria", "spa":"Estadísticos por categoría", "eng":"Statistics by category", "fre":"Statistique par catégorie"})+" " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
			if (presentacio == "graphic")
			{
				tipus_chart="chart_categ";
				ncol=650;
				nfil=200;
				cdns.push("<div style=\"width: ", ncol, "px;height: ", nfil, "px;\"><table><td><canvas id=\"", nom_histograma, "_canvas_", "area", "\" width=\"", ncol*4/6.5, "\" height=\"", nfil, "\"></canvas></td>");
				cdns.push("<td><canvas id=\"", nom_histograma, "_canvas_", "estad", "\" width=\"", ncol*2.5/6.5, "\" height=\"", nfil, "\"></canvas></td></table></div>");
				//després de indicar mida de canvas perquè tingui marge per dreta i per sota
				ncol+=20;
				nfil+=20;
			}
			else //"text"
			{
				tipus_chart="stat_categ";
				//·$· pensar mida que cal per aquesta representació textual per categories
				ncol/=1.3;
				nfil/=2;
				cdns.push("<p id=\"", DonaNomEstadistic(HistogramaFinestra.n), "\"></p>");
				//cdns.push("<div id=\"", DonaNomEstadistic(HistogramaFinestra.n), "\" style=\"width: ", ncol, "px;height: ", nfil, "px;overflow: scroll;\"></div>");
			}
		}
		else
		{
			tipus_chart="stat";
			tip_est_intern=tipus_estad;
			var s=DonaTitolEstadistic(estil.categories, estil.atributs, tip_est_intern);
			titol=DonaCadenaLang({"cat": "Estadístic", "spa": "Estadístico", "eng": "Statistic", "fre": "Statistique"})+ " " + (HistogramaFinestra.n+1) + (s == "" ? "" : (": " + s))+ ", "+ DonaCadena(estil.desc);
			//titol=DonaCadenaLang({"cat": "Estadístic", "spa": "Estadístico", "eng": "Statistic", "fre": "Statistique"})+ " " + (HistogramaFinestra.n+1) + (s == "" ? "" : (": " + s))+ ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
			//·$· ncol i nfil podria ser més ample o més estret segons els stat que em demanen? o fins i tot directament segons la longitud del text en omplir...
			ncol/=1.3;
			nfil/=2;
			cdns.push("<p id=\"", DonaNomEstadistic(HistogramaFinestra.n), "\" style=\"font-size: 4vw\"></p>");
			//cdns.push("<div id=\"", DonaNomEstadistic(HistogramaFinestra.n), "\" style=\"width: ", ncol, "px;height: ", nfil, "px;overflow: scroll;\"></div>");
		}
	}
	else if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
	{
		tipus_chart="matriu";
		titol=DonaCadenaLang({"cat":"Taula de contingència", "spa":"Tabla de contingencia", "eng":"Contingency table", "fre":"Tableau de contingence"}) + " " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(estil.desc);
		//titol=DonaCadenaLang({"cat":"Taula de contingència", "spa":"Tabla de contingencia", "eng":"Contingency table", "fre":"Tableau de contingence"}) + " " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
		ncol*=2;
		nfil*=2;
		cdns.push("<div id=\"", DonaNomMatriuConfusio(HistogramaFinestra.n), "\" style=\"width: ", ncol, "px;height: ", nfil, "px;overflow: scroll;\"></div>");
	}
	else
	{
		tipus_chart="chart";
		titol=((estil.categories && estil.atributs) ? DonaCadenaLang({"cat":"Gràfic circular", "spa":"Gráfico circular", "eng":"Pie chart", "fre":"Diagramme à secteurs"}) : DonaCadenaLang({"cat":"Histograma", "spa":"Histograma", "eng":"Histogram", "fre":"Histogramme"}))+" " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(estil.desc);
		//titol=((estil.categories && estil.atributs) ? DonaCadenaLang({"cat":"Gràfic circular", "spa":"Gráfico circular", "eng":"Pie chart", "fre":"Diagramme à secteurs"}) : DonaCadenaLang({"cat":"Histograma", "spa":"Histograma", "eng":"Histogram", "fre":"Histogramme"}))+" " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
		if (component.length==1 || component.length==2)
			cdns.push("<canvas id=\"", nom_histograma, "_canvas_0\" width=\"", ncol, "\" height=\"", nfil, "\"></canvas>");
		else
		{
			nfil*=2;
			nfil=Math.round(nfil/component.length);
			for (var i_c=0; i_c<component.length; i_c++)
				cdns.push("<div style=\"width: ", ncol, "px;height: ", nfil, "px;\"><canvas id=\"", nom_histograma, "_canvas_", i_c, "\" width=\"", ncol, "\" height=\"", nfil, "\"></canvas></div>");
		}
	}
	//Això només és pel portapapers, donat que aquesta àrea és invisible.
	cdns.push(DonaTextDivCopiaPortapapersFinestra(nom_histograma));

	if (def_diagrama_existeix) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
	{	//hi pot haver diversos diagrames d'aquest estil, p.ex. un histo i un 3d (i un estadístic en un futur). si tinc més de un del mateix tipus, cada cop faig el primer que trobo
		for (i_diag=0; i_diag<estil.diagrama.length; i_diag++)
		{
			if (estil.diagrama[i_diag].tipus == tipus_chart && (typeof estil.diagrama[i_diag].i_histograma === "undefined"))
			{
				if (typeof estil.diagrama[i_diag].left !== "undefined")
					des_left=estil.diagrama[i_diag].left; //ho deixo encara que no ho usaré més
				if (typeof estil.diagrama[i_diag].top !== "undefined")
					des_top=estil.diagrama[i_diag].top; //ho deixo encara que no ho usaré més
				if (typeof estil.diagrama[i_diag].width !== "undefined")
					des_width=estil.diagrama[i_diag].width; //ho deixo encara que no ho usaré més
				if (typeof estil.diagrama[i_diag].height !== "undefined")
					des_height=estil.diagrama[i_diag].height; //ho deixo encara que no ho usaré més
				break;
			}
		}
		if (i_diag == estil.diagrama.length) //no l'he trobat
			i_diag=-1;
	}
	insertContentLayer(getLayer(window, "menuContextualCapa"), "afterEnd",
		textHTMLFinestraLayer(nom_histograma, titol, boto_tancar|boto_copiar, (des_left == -9999 ) ? 200+HistogramaFinestra.n*10 : des_left, (des_top == -9999) ? 200+HistogramaFinestra.n*10 : des_top,
			(des_width == -9999) ? ncol : des_width, (des_height == -9999) ? (component.length == 2 ? nfil+AltBarraFinestraLayer+2+20 : nfil*component.length+AltBarraFinestraLayer+2+20) : des_height+20,
			 "NW", (tipus_chart == "matriu" || tipus_chart == "stat" || tipus_chart == "stat_categ") ? {scroll: "ara_no", visible: true, ev: null, resizable:true} : {scroll: "no", visible: true, ev: null}, cdns.join("")));
	OmpleBarraFinestraLayerNom(window, nom_histograma);
	HistogramaFinestra.vista[HistogramaFinestra.n]={ //"nfil": nfil,
				//"ncol": ncol,
        "i_capa": i_capa,
				"i_estil": i_estil_intern,
				//"costat": ParamInternCtrl.vista.CostatZoomActual,
				//"env": {"MinX": ParamInternCtrl.vista.EnvActual.MinX, "MaxX": ParamInternCtrl.vista.EnvActual.MaxX, "MinY": ParamInternCtrl.vista.EnvActual.MinY, "MaxY": ParamInternCtrl.vista.EnvActual.MaxY},
				//"i_situacio": ParamInternCtrl.ISituacio,
				"i_histograma": HistogramaFinestra.n};

	//if (tipus_chart == "matrestil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
	if (tipus_chart == "stat")
		CreaEstadistic(HistogramaFinestra.n, i_diag, tipus_estad); //dins ja omple estil.diagrama
	else if (tipus_chart == "stat_categ")
		CreaEstadisticPerCategories(HistogramaFinestra.n, i_diag, tip_est_intern, order); //dins ja omple estil.diagrama
	else if (tipus_chart == "matriu")
		CreaMatriuDeConfusio(HistogramaFinestra.n, i_diag); //dins ja omple estil.diagrama
	else if (tipus_chart == "chart")
	{
		var n_comp_usar = estil.component.length==2 ? 1 : estil.component.length;
		for (var i_c=0; i_c<n_comp_usar; i_c++)
			CreaHistograma(HistogramaFinestra.n, i_c);

		if (i_diag != -1) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
			estil.diagrama[i_diag].i_histograma=HistogramaFinestra.n;
		else
		{
			if (typeof estil.diagrama === "undefined") //no està creat (i.e. obertura de nova finestra de gràfic des del menú)
				estil.diagrama = []; //array de objectes
			estil.diagrama.push({tipus: "chart", i_histograma: HistogramaFinestra.n});
		}
	}
	else	// "chart_categ"
	{
		CreaHistogramesPerCategories(HistogramaFinestra.n, tip_est_intern, order); //crea 2
		if (i_diag != -1) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
			estil.diagrama[i_diag].i_histograma=HistogramaFinestra.n;
		else
		{
			if (typeof estil.diagrama === "undefined") //no està creat (i.e. obertura de nova finestra de gràfic des del menú)
				estil.diagrama = []; //array de objectes
			estil.diagrama.push({tipus: "chart_categ", stat: tip_est_intern, order: order, i_histograma: HistogramaFinestra.n});
		}
	}
	HistogramaFinestra.n++;
}

function SonCategoriesIguals(estil1, estil2)
{
	if (estil1.categories.length!=estil2.categories.length)
		return false;
	for (var i_cat=0; i_cat<estil1.categories.length; i_cat++)
	{
		if (!estil1.categories[i_cat] && !estil2.categories[i_cat])
			continue;
		if (!estil1.categories[i_cat] || !estil2.categories[i_cat])
			return false;
		if (DonaTextCategoriaDesDeColor(estil1.categories, estil1.atributs, i_cat, true)!=DonaTextCategoriaDesDeColor(estil2.categories, estil2.atributs, i_cat, true))
			return false;
	}
	return true;
}

function CreaTextMatriuDeConfusio(i_histograma, es_html)
{
var histograma=HistogramaFinestra.vista[i_histograma];
var cdns=[], ncol, nfil, j, v, cella, capa=[], estil=[], estil_nou, categories_iguals, suma_fil=[], suma_col=[], suma_total, encert, creuament, acumulat, area_cella, unitats, n_decimals, kappa, ncol_mostrades, nfil_mostrades;
var literal_total="Total", literal_sembla=DonaCadenaLang({"cat": "Semblança", "spa": "Similitud", "eng": "Similarity", "fra": "Similitude"});
var costat=ParamInternCtrl.vista.CostatZoomActual;
var env={MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY};
var i_situacio=ParamInternCtrl.ISituacio;

	//La primera capa està a les columnes i la segona a les files
	estil_nou=ParamCtrl.capa[histograma.i_capa].estil[histograma.i_estil];
	capa[0]=ParamCtrl.capa[estil_nou.component[0].representacio.dimMatriu[0].i_capa];
	estil[0]=capa[0].estil[estil_nou.component[0].representacio.dimMatriu[0].i_estil];
	capa[1]=ParamCtrl.capa[estil_nou.component[0].representacio.dimMatriu[1].i_capa];
	estil[1]=capa[1].estil[estil_nou.component[0].representacio.dimMatriu[1].i_estil];

	area_cella=DonaAreaCella(env, costat, ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);
	unitats=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);
	if (unitats=="°")
		unitats="m";
	if (area_cella>10000 && unitats=="m")
	{
		n_decimals=(area_cella>1000000)? 0 : 2;
		area_cella*=0.000001;
		unitats="km";
	}
	else
		n_decimals=0;
	if (!es_html)
		n_decimals+=2;

	categories_iguals=SonCategoriesIguals(estil[0], estil[1]);

	//Calculo el nombre de columnes real de la matriu (els categories sense descripció s'ignoren)
	suma_total=0;
	creuament=0;
	encert=0;
	for (var i_cat=0, ncol=0; i_cat<estil[0].categories.length; i_cat++)
	{
		acumulat=0;
		if (estil[0].categories[i_cat])
		{
			for (var j_cat=0; j_cat<estil[1].categories.length; j_cat++)
			{
				if (estil[1].categories[j_cat])
				{
					acumulat+=estil_nou.histograma.component[0].classe[i_cat+estil[0].categories.length*j_cat];
					if (categories_iguals)
						creuament=estil_nou.histograma.component[0].classe[i_cat+estil[0].categories.length*j_cat] *
							estil_nou.histograma.component[0].classe[j_cat+estil[0].categories.length*i_cat];
				}
			}
			ncol++;
		}
		suma_col.push(acumulat);
		suma_total+=acumulat;
		if (categories_iguals)
			encert+=estil_nou.histograma.component[0].classe[i_cat+estil[0].categories.length*i_cat];
	}
	if (categories_iguals)
		kappa=(suma_total*encert-creuament)/(suma_total*suma_total-creuament);

	for (var j_cat=0, nfil=0; j_cat<estil[1].categories.length; j_cat++)
	{
		acumulat=0;
		if (estil[1].categories[j_cat])
		{
			for (var i_cat=0; i_cat<estil[0].categories.length; i_cat++)
			{
				if (estil[0].categories[i_cat])
					acumulat+=estil_nou.histograma.component[0].classe[i_cat+estil[0].categories.length*j_cat];
			}
			nfil++;
		}
		suma_fil.push(acumulat);
	}

	ncol_mostrades=0;
	for (var i_cat=0; i_cat<estil[0].categories.length; i_cat++)
	{
		if (!estil[0].categories[i_cat] || (categories_iguals ? suma_col[i_cat]==0 && suma_fil[i_cat]==0 : suma_col[i_cat]==0))
			continue;
		ncol_mostrades++;
	}
	nfil_mostrades=0;
	for (var j_cat=0; j_cat<estil[1].categories.length; j_cat++)
	{
		if (!estil[1].categories[j_cat] || (categories_iguals ? suma_col[j_cat]==0 && suma_fil[j_cat]==0 : suma_fil[j_cat]==0))
			continue;
		nfil_mostrades++;
	}

	if (es_html)
	{
		cdns.push("<table class=\"text_petit\"><tr><th></th><th></th><th colspan=\"", ncol_mostrades+2, "\">",
			(DonaCadena(capa[0].desc) ? DonaCadena(capa[0].desc): capa[0].nom),
			(DonaCadena(estil[0].desc) ? (" " + DonaCadena(estil[0].desc)) : ""), " (", unitats, "²)");
		if (categories_iguals)
			cdns.push(" (Kappa: ", kappa, ")");
		cdns.push("</th></tr>",
			"<tr><th></th><th></th>");
	}
	else
	{
		cdns.push(DonaCadenaLang({"cat": "Capa", "spa": "Capa", "eng": "Layer", "fre": "Couche"}), " 1 (", DonaCadenaLang({"cat": "columnes", "spa": "columnas", "eng": "columns", "fre": "colonnes"}), ")\t", (DonaCadena(capa[0].desc) ? DonaCadena(capa[0].desc): capa[0].nom),
			(DonaCadena(estil[0].desc) ? (" " + DonaCadena(estil[0].desc)) : ""), "\n",
			DonaCadenaLang({"cat": "Capa", "spa": "Capa", "eng": "Layer", "fre": "Couche"}), " 2 (", DonaCadenaLang({"cat": "files", "spa": "filas", "eng": "rows", "fre": "lignes"}), ")\t", (DonaCadena(capa[1].desc) ? DonaCadena(capa[1].desc): capa[1].nom),
			(DonaCadena(estil[1].desc) ? (" " + DonaCadena(estil[1].desc)) : ""), "\n");
		cdns.push(DonaCadenaLang({"cat": "Columnes", "spa": "Columnas", "eng": "Columns", "fre": "Colonnes"}), "\t", ncol, "\t", DonaCadenaLang({"cat": "Mostrades", "spa": "Mostradas", "eng": "Shown", "fre": "Montré"}), "\t", ncol_mostrades, "\n");
		cdns.push(DonaCadenaLang({"cat": "Files", "spa": "Filas", "eng": "Rows", "fre": "Lignes"}), "\t", nfil, "\t", DonaCadenaLang({"cat": "Mostrades", "spa": "Mostradas", "eng": "Shown", "fre": "Montré"}), "\t", nfil_mostrades, "\n");
		if (categories_iguals)
			cdns.push(DonaCadenaLang({"cat": "Index Kappa", "spa": "Indice Kappa", "eng": "Kappa coefficient", "fre": "Coefficient kappa"}), "\t", kappa, "\n");
		//cdns.push(DonaCadenaLang({"cat":"Matriu de confusió", "spa":"Matriz de confusión", "eng":"Confusion matrix", "fre":"Matrice de confusion"}), "\t", "Units", "\t", unitats, "²\n");
		cdns.push(DonaCadenaLang({"cat":"Taula de contingència", "spa":"Tabla de contingencia", "eng":"Contingency table", "fre":"Tableau de contingence"}), "\t", "Units", "\t", unitats, "²\n");
		cdns.push("\t");
	}

	//Categories de la capa 1 (columnes)
	for (var i_cat=0; i_cat<estil[0].categories.length; i_cat++)
	{
		if (!estil[0].categories[i_cat] || (categories_iguals ? suma_col[i_cat]==0 && suma_fil[i_cat]==0 : suma_col[i_cat]==0))
			continue;
		if (es_html)
			cdns.push("<th style=\"vertical-align: bottom; text-align: center; height:", DonaTextCategoriaDesDeColor(estil[0].categories, estil[0].atributs, i_cat, true).length*4, "px;\"><div class=\"text_vertical\" style=\"width: 15px;\">");
		cdns.push(DonaTextCategoriaDesDeColor(estil[0].categories, estil[0].atributs, i_cat, true));
		if (es_html)
			cdns.push("</div></th>");
		else
			cdns.push("\t");
	}

	if (es_html)
	{
		cdns.push("<th style=\"vertical-align: bottom; height:", literal_total.length*4, "px;\"><div class=\"text_vertical\" style=\"width: 15px;\">", literal_total, "</div></th>");
		if (categories_iguals)
			cdns.push("<th style=\"vertical-align: bottom; height:", literal_sembla.length*4, "px;\"><div class=\"text_vertical\" style=\"width: 15px;\">", literal_sembla, "</div></th>");
		cdns.push("</tr>");
	}
	else
	{
		cdns.push(literal_total, "\t");
		if (categories_iguals)
			cdns.push(literal_sembla, "\t");
		cdns.push("\n");
	}
	j=0;
	for (var j_cat=0; j_cat<estil[1].categories.length; j_cat++)
	{
		if (!estil[1].categories[j_cat] || (categories_iguals ? suma_col[j_cat]==0 && suma_fil[j_cat]==0 : suma_fil[j_cat]==0))
			continue;
		if (es_html)
		{
			cdns.push("<tr>");
			if (j==0)
				cdns.push("<td style=\"vertical-align: bottom; text-align: center;\" rowspan=\"", nfil_mostrades+2, "\"><div class=\"text_vertical\" style=\"width: 15px;\">",
					(DonaCadena(capa[1].desc) ? DonaCadena(capa[1].desc): capa[1].nom),
					(DonaCadena(estil[1].desc) ? (" " + DonaCadena(estil[1].desc)) : ""), " (", unitats, "²)</div></td>");
			//Categories de la capa 2
			cdns.push("<td style=\"white-space: nowrap; text-align: right;\">");
		}
		cdns.push(DonaTextCategoriaDesDeColor(estil[1].categories, estil[1].atributs, j_cat, true));
		cdns.push(es_html ? "</td>" : "\t");
		for (var i_cat=0; i_cat<estil[0].categories.length; i_cat++)
		{
			if (!estil[0].categories[i_cat] || (categories_iguals ? suma_col[i_cat]==0 && suma_fil[i_cat]==0 : suma_col[i_cat]==0))
				continue;
			//pinto el valor del histograma
			v=estil_nou.histograma.component[0].classe[i_cat+estil[0].categories.length*j_cat];
			if (es_html)
			{
				cdns.push("<td style=\"text-align: right;");
				if (v==0)
					cdns.push("color: #AAAAAA");
				else if (categories_iguals)
				{
					if (j_cat==i_cat)
						cdns.push("color: #00AA00");
					else
						cdns.push("color: #AA0000");
				}
				cdns.push("\">");
			}
			cdns.push(OKStrOfNe(v*area_cella, n_decimals));
			cdns.push(es_html ? "</td>" : "\t");
		}
		if (es_html)
			cdns.push("<td style=\"text-align: right;color: #885533\">");
		cdns.push(OKStrOfNe(suma_fil[j_cat]*area_cella, n_decimals));
		cdns.push(es_html ? "</td>" : "\t");
		if (categories_iguals)
		{
			if (es_html)
				cdns.push("<td style=\"text-align: right;color: #885533\">");
			cdns.push(OKStrOfNe((suma_fil[j_cat] ? estil_nou.histograma.component[0].classe[j_cat+estil[0].categories.length*j_cat]/suma_fil[j_cat]*100 : 0), 1));
			cdns.push(es_html ? "%</td>" : "\t"); //si es HTML va el %, si no no
		}
		cdns.push(es_html ? "</tr>" : "\n");
		j++;
	}
	if (es_html)
	{
		cdns.push("<tr>");
		cdns.push("<td style=\"white-space: nowrap; text-align: right;\">", literal_total,"</td>");
	}
	else
		cdns.push(literal_total, "\t");
	//Pinto els totals
	for (var i_cat=0; i_cat<estil[0].categories.length; i_cat++)
	{
		if (!estil[0].categories[i_cat] || (categories_iguals ? suma_col[i_cat]==0 && suma_fil[i_cat]==0 : suma_col[i_cat]==0))
			continue;
		if (es_html)
			cdns.push("<td style=\"text-align: right;color: #885533\">");
		cdns.push(OKStrOfNe(suma_col[i_cat]*area_cella, n_decimals));
		cdns.push(es_html ? "</td>" : "\t");
	}
	if (es_html)
		cdns.push("<td style=\"text-align: right;color: #885533\">");
	cdns.push(OKStrOfNe(suma_total*area_cella, n_decimals));
	if (es_html)
	{
		cdns.push("</td>");
		if (categories_iguals)
			cdns.push("<td></td>");
		cdns.push("</tr>");
	}
	else
		cdns.push("\n");

	if (categories_iguals)
	{
		//Pinto els percentatges
		if (es_html)
			cdns.push("<tr>",
				"<td style=\"white-space: nowrap; text-align: right;\">", literal_sembla,"</td>");
		else
			cdns.push(literal_sembla,"\t");
		//Pinto els totals
		for (var i_cat=0; i_cat<estil[0].categories.length; i_cat++)
		{
			if (!estil[0].categories[i_cat] || (categories_iguals ? suma_col[i_cat]==0 && suma_fil[i_cat]==0 : suma_col[i_cat]==0))
				continue;
			if (es_html)
				cdns.push("<td style=\"text-align: right;color: #885533\">");
			cdns.push(OKStrOfNe((suma_col[i_cat] ? estil_nou.histograma.component[0].classe[i_cat+estil[0].categories.length*i_cat]/suma_col[i_cat]*100 : 0), 1));
			cdns.push(es_html ? "%</td>" : "\t"); //si es HTML va el %, si no no
		}
		if (es_html)
			cdns.push("<td></td>",
				"<td style=\"text-align: right;color: #885533\">");
		else
			cdns.push("\t");
		cdns.push(OKStrOfNe(encert/suma_total*100, 1));
		cdns.push(es_html ? "%</td></tr>" : "\n"); //si es HTML va el %, si no no
	}
	if (es_html)
	{
		cdns.push("</table>");
		//vol dir que estic a omplint el HTML de la finestra, i per tant també m'he de preocupar de omplir el text ocult que es copiarà al portapapers
		//la funció OmpleTextPortapapersFinestraHistogramaADivisio() crida a aquesta funció a la que estic però amb es_html=false, per tant no entraré en bucle infinit
		OmpleTextPortapapersFinestraHistogramaADivisio(i_histograma, "matriu");
	}
	return cdns.join("");
}

function CreaMatriuDeConfusio(n_histograma, i_diag)
{
	var estil = ParamCtrl.capa[HistogramaFinestra.vista[n_histograma].i_capa].estil[HistogramaFinestra.vista[n_histograma].i_estil];
	document.getElementById(DonaNomMatriuConfusio(n_histograma)).innerHTML=CreaTextMatriuDeConfusio(n_histograma, true);

	if (i_diag != -1) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
		estil.diagrama[i_diag].i_histograma=HistogramaFinestra.n;
	else
	{
		if (typeof estil.diagrama === "undefined") //no està creat
			estil.diagrama =[]; //array de objectes
		estil.diagrama.push({tipus: "matriu", i_histograma: n_histograma});
	}
}

function CreaTextEstadistic(i_histograma, tipus_estad)
{
var histograma=HistogramaFinestra.vista[i_histograma];
var estil=ParamCtrl.capa[histograma.i_capa].estil[histograma.i_estil];
var cdns=[];
var i_c, ncolors, area_cella, unitats;
var costat=ParamInternCtrl.vista.CostatZoomActual;
var env={MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY};
var i_situacio=ParamInternCtrl.ISituacio;

	area_cella=DonaAreaCella(env, costat, ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);
	unitats=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);

	//cdns.push("<span style=\"font-size: 4vw\">");
	//·$· depen del text a posar caldrà més curt o llarg, fer alguna cosa com posar-ho a una cadena deduir el numero segons la longitud de la cadena?

	if (estil.categories && estil.atributs) //cas categòric
	{
			var n_comp_usar;
			var estadistics_categorics=[];
			if (estil.component.length==2)
				n_comp_usar = 1;
			else
				n_comp_usar = estil.component.length;

			for (i_c=0; i_c<n_comp_usar; i_c++)
				estadistics_categorics[i_c]=CalculaEstadisticsCategorics(estil.histograma.component[i_c].classe);

			if (tipus_estad == "mode")
			{
				for (i_c=0; i_c<n_comp_usar; i_c++)
					cdns.push(DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, estadistics_categorics[i_c].i_moda, true), "<br>");
			}
			else if (tipus_estad == "percent_mode")
			{
				for (i_c=0; i_c<n_comp_usar; i_c++)
					cdns.push(OKStrOfNe(estil.histograma.component[i_c].classe[estadistics_categorics[i_c].i_moda]/estadistics_categorics[i_c].recompte*100, 3), " %<br>"); //va % perquè és text per finestra
			}
			else if (tipus_estad == "mode_and_percent")
			{
				for (i_c=0; i_c<n_comp_usar; i_c++)
					cdns.push(DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, estadistics_categorics[i_c].i_moda, true), " ("+ OKStrOfNe(estil.histograma.component[i_c].classe[estadistics_categorics[i_c].i_moda]/estadistics_categorics[i_c].recompte*100, 3), " %)<br>"); //va % perquè és text per finestra
			}
			// if (estil.component.length==2) cas especial --> cal pensar com ho fem
	}
	else
	{
			var estadistics=[];
			var str_ini="";
			var str_fi_array=[];

			for (i_c=0; i_c<estil.component.length; i_c++)
			{
				ncolors=estil.histograma.component[i_c].classe.length;  //El nombre de colors, o és el nombre de colors de la paleta, o és 256 per totes les bandes
				estadistics[i_c]=CalculaEstadisticsHistograma(estil.histograma.component[i_c].classe,
							DonaFactorValorMinEstiramentPaleta(estil.component[i_c].estiramentPaleta),
							DonaFactorValorMaxEstiramentPaleta(estil.component[i_c].estiramentPaleta, ncolors),
							estil.histograma.component[i_c].sumaValorsReal);
			}

			if (tipus_estad == "sum")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estadistics[i_c].suma, 3), " ", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), "<br>");
			}
			else if (tipus_estad == "sum_area")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estadistics[i_c].suma*area_cella, 3), " ", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), "&sdot;m²<br>");
			}
			else if (tipus_estad == "mean")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estadistics[i_c].mitjana, 3), " ", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), "<br>");
			}
			else if (tipus_estad == "variance")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estadistics[i_c].varianca, 3), " (", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), ")²<br>");
			}
			else if (tipus_estad == "stdev")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estadistics[i_c].desv_tipica, 3), " ", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), "<br>");
			}
			else if (tipus_estad == "min")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estil.histograma.component[i_c].valorMinimReal, 3), " ", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), "<br>");
			}
			else if (tipus_estad == "max")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estil.histograma.component[i_c].valorMaximReal, 3), " ", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), "<br>");
			}
			else if (tipus_estad == "range")
			{
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push(OKStrOfNe(estil.histograma.component[i_c].valorMaximReal-estil.histograma.component[i_c].valorMinimReal+1, 3), " ", (estil.component[i_c].desc ? estil.component[i_c].desc : ((estil.DescItems) ? DonaCadena(estil.DescItems) : DonaCadena(estil.desc))), "<br>");
			}
			//decidim no donar mediana i quartils perquè ja tenim agrupat per classes i pot tenir molt poc sentit si ni han poques (o encara que n'hagi moltes, pel fet que ja tinc les classe de l'histograma)
	}

	//cdns.push("</span>");
	OmpleTextPortapapersFinestraHistogramaADivisio(i_histograma, "stat");
	return cdns.join("");
}

function CreaEstadistic(n_histograma, i_diag, tipus_estad)
{
	var estil = ParamCtrl.capa[HistogramaFinestra.vista[n_histograma].i_capa].estil[HistogramaFinestra.vista[n_histograma].i_estil];
	document.getElementById(DonaNomEstadistic(n_histograma)).innerHTML=CreaTextEstadistic(n_histograma, tipus_estad /*, true*/);

	if (i_diag != -1) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
		estil.diagrama[i_diag].i_histograma=HistogramaFinestra.n;
	else
	{
		if (typeof estil.diagrama === "undefined") //no està creat
			estil.diagrama =[]; //array de objectes
		estil.diagrama.push({tipus: "stat", stat: tipus_estad, i_histograma: n_histograma});
	}
}

function OrdenacioCategoriesPerValorAscendent(x,y) {
	//Ascendent per valor
	if ( x.valor < y.valor ) return -1;
	if ( x.valor > y.valor ) return 1;
	return 0;
}

function OrdenacioCategoriesPerValorDescendent(x,y) {
	//Descendent per valor
	if ( x.valor < y.valor ) return 1;
	if ( x.valor > y.valor ) return -1;
	return 0;
}

function CalculaEstadisticsCategorics_AgrupatsDesDeCategories(categories)
{
var i_cat, i, classes_global=[], max_recompte=0;
var estadistics_categorics={
			recompte: 0,   //Nombre de pixels considerats en histograma que no són nodata. User estil.histograma.classe_nodata per saber el nombre de píxels a nodata
			i_moda: 0,
			recompte_moda: 0};    //categoria modal

	for (i_cat=0; i_cat<categories.length; i_cat++)
	{
		if (!categories[i_cat])
			continue;

		if (categories[i_cat]["$stat$_histo"] && categories[i_cat]["$stat$_histo"].classe && categories[i_cat]["$stat$_histo"].classe.length)
		{
			if (classes_global.length == 0) //encara no les he inicialitzat
			{
				classes_global=JSON.parse(JSON.stringify(categories[i_cat]["$stat$_histo"].classe));
				continue;
			}
			for (i=0; i<categories[i_cat]["$stat$_histo"].classe.length; i++)
				classes_global[i] += categories[i_cat]["$stat$_histo"].classe[i];
		}
	}

	for (i=0; i<classes_global.length; i++)
	{
		if (!classes_global[i])
			continue;
		estadistics_categorics.recompte += classes_global[i];
		if (max_recompte < classes_global[i]) //el nou recompte és més gran
		{
			max_recompte = classes_global[i];
			estadistics_categorics.i_moda = i;
		}
	}
	estadistics_categorics.recompte_moda = classes_global[estadistics_categorics.i_moda];
	return estadistics_categorics;
}

function CalculaEstadisticsHistograma_AgrupatsDesDeCategories(categories, valor_min_histo, valor_max_histo)
{
var i_cat, i, classes_global=[];
var estadistics={valor_min: +1e300,
			valor_max: -1e300,
			//ample: (valor_max-valor_min)/ncolors,           //Ample de cada clase
			recompte: 0,
			suma: 0,
			mitjana: 0,
			varianca: 0,
			desv_tipica: 0};

	for (i_cat=0; i_cat<categories.length; i_cat++)
	{
		if (!categories[i_cat])
				continue;
		if (categories[i_cat]["$stat$_count"])
			estadistics.recompte += categories[i_cat]["$stat$_count"];
		if (categories[i_cat]["$stat$_sum"])
			estadistics.suma += categories[i_cat]["$stat$_sum"];
		if (categories[i_cat]["$stat$_min"] && categories[i_cat]["$stat$_min"] < estadistics.valor_min)
			estadistics.valor_min = categories[i_cat]["$stat$_min"];
		if (categories[i_cat]["$stat$_max"] && categories[i_cat]["$stat$_max"] > estadistics.valor_max)
			estadistics.valor_max = categories[i_cat]["$stat$_max"];

		if (categories[i_cat]["$stat$_histo"] && categories[i_cat]["$stat$_histo"].classe && categories[i_cat]["$stat$_histo"].classe.length)
		{
			if (classes_global.length == 0) //encara no les he inicialitzat
			{
				classes_global=JSON.parse(JSON.stringify(categories[i_cat]["$stat$_histo"].classe));
				continue;
			}
			for (i=0; i<categories[i_cat]["$stat$_histo"].classe.length; i++)
				classes_global[i] += categories[i_cat]["$stat$_histo"].classe[i];
		}
	}

	if (estadistics.recompte>0)
	{
		var ncolors=classes_global.length;
		var ample=(valor_max_histo-valor_min_histo)/ncolors;
		var value, suma_v_menys_mitj_quad_per_n=0;

		estadistics.mitjana=estadistics.suma/estadistics.recompte;
		for (i=0; i<ncolors; i++)
		{
			value = ample/2+valor_min_histo+ample*i;
			suma_v_menys_mitj_quad_per_n += (value-estadistics.mitjana)*(value-estadistics.mitjana)*classes_global[i];
		}

		estadistics.varianca=suma_v_menys_mitj_quad_per_n/estadistics.recompte;
		estadistics.desv_tipica=Math.sqrt(estadistics.varianca);
	}
	return estadistics;
}


function CreaEstructuraAreaIValorEstadCategoriesEndrecades(estil, desc_capa2, tipus_estad, order)
{
	var estad_categ={};
	estad_categ.count_total=0;
	estad_categ.ordre_cat=[];
	estad_categ.tinc_dec=false; //en alguns casos si no n'ho havia no vull posar un valor per defecte a 2, i en altres casos si
	estad_categ.n_dec=2;
	estad_categ.unitats=null;
	estad_categ.desc=DonaTitolEstadistic(estil.component[1].herenciaOrigen.categories, estil.component[1].herenciaOrigen.atributs, tipus_estad) +
			DonaCadenaLang({"cat":" de ", "spa":" de ", "eng":" of ", "fre":" des "}) + desc_capa2;

	var tipus_intern;
	if (tipus_estad == "mode_and_percent")
		tipus_intern = "percent_mode";
	else
		tipus_intern = tipus_estad;

	for (var i_atrib=0; i_atrib<estil.atributs.length; i_atrib++)
	{
			if (estil.atributs[i_atrib].nom == ("$stat$_"+tipus_intern)) //per "mode_and_percent" miro unitats i decimals de percent_mode :)
			{
				if (estil.atributs[i_atrib].unitats)
					estad_categ.unitats=estil.atributs[i_atrib].unitats;

				if (estil.atributs[i_atrib].NDecimals)
				{
					estad_categ.tinc_dec=true;
					estad_categ.n_dec=estil.atributs[i_atrib].NDecimals;
				}
				break;
			}
	}

	for (var i_cat=0; i_cat<estil.categories.length; i_cat++)
	{
		if (tipus_estad == "mode_and_percent")
		{
			if (!estil.categories[i_cat] || !estil.categories[i_cat]["$stat$_mode"] || !estil.categories[i_cat]["$stat$_percent_mode"])
				continue;
			estad_categ.ordre_cat.push({valor: estil.categories[i_cat]["$stat$_percent_mode"], valor2: estil.categories[i_cat]["$stat$_mode"], valor3: estil.categories[i_cat]["$stat$_i_mode"], i_cat: i_cat});
		}
		else
		{
			if (!estil.categories[i_cat] || !estil.categories[i_cat]["$stat$_"+tipus_estad])
				continue;
			estad_categ.ordre_cat.push({valor: estil.categories[i_cat]["$stat$_"+tipus_estad], i_cat: i_cat});
		}
		if (estil.component[1].herenciaOrigen.categories) //la segona també es categòrica
		{
			estad_categ.ordre_cat[estad_categ.ordre_cat.length-1].count=0;
			for (var i_segona_cat=0; i_segona_cat<estil.categories[i_cat]["$stat$_histo"].classe.length; i_segona_cat++)
				estad_categ.ordre_cat[estad_categ.ordre_cat.length-1].count+=estil.categories[i_cat]["$stat$_histo"].classe[i_segona_cat];
			estad_categ.count_total+=estad_categ.ordre_cat[estad_categ.ordre_cat.length-1].count;
		}
		else
		{
			estad_categ.ordre_cat[estad_categ.ordre_cat.length-1].count=estil.categories[i_cat]["$stat$_count"];
			estad_categ.count_total+=estil.categories[i_cat]["$stat$_count"];
		}
		estad_categ.ordre_cat[estad_categ.ordre_cat.length-1].desc=DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, i_cat, true);
	}
	if (order)
	{
		if (order == "descend")
			estad_categ.ordre_cat.sort(OrdenacioCategoriesPerValorDescendent);
		else if (order == "ascend")
			estad_categ.ordre_cat.sort(OrdenacioCategoriesPerValorAscendent);
	}
	return estad_categ;
}

function CreaTextEstadisticPerCategories(i_histograma, tipus_estad, order)
{
var histograma=HistogramaFinestra.vista[i_histograma];
var capa=ParamCtrl.capa[histograma.i_capa];
var estil=capa.estil[histograma.i_estil];
var cdns=[];
var area_cella, i_cat;

	if (!estil.categories || !estil.atributs || estil.component.length != 2) //cas d'estadistics de categories
		return cdns.join("");

	area_cella=DonaAreaCella({MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY},
		ParamInternCtrl.vista.CostatZoomActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	var estad_categ = CreaEstructuraAreaIValorEstadCategoriesEndrecades(estil, DonaCadena(ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].desc), tipus_estad, order);

	//capçalera, lletra una mica més gran
	cdns.push("<p style=\"font-size: 2em; text-align: center;\">", estad_categ.desc);
 	if (estil.component[1].herenciaOrigen.categories) //la segona també es categòrica
	{
		var estadistics_categorics=CalculaEstadisticsCategorics_AgrupatsDesDeCategories(estil.categories);
		if (tipus_estad == "mode")
			cdns.push(": ", DonaTextCategoriaDesDeColor(estil.component[1].herenciaOrigen.categories, estil.component[1].herenciaOrigen.atributs, estadistics_categorics.i_moda, true), "</p>");
		else if (tipus_estad == "percent_mode")
			cdns.push(": ", OKStrOfNe(estadistics_categorics.recompte_moda/estadistics_categorics.recompte*100, estad_categ.n_dec), "%</p>");
		else if (tipus_estad == "mode_and_percent")
			cdns.push(": ", DonaTextCategoriaDesDeColor(estil.component[1].herenciaOrigen.categories, estil.component[1].herenciaOrigen.atributs, estadistics_categorics.i_moda, true),
					" (", OKStrOfNe(estadistics_categorics.recompte_moda/estadistics_categorics.recompte*100, estad_categ.n_dec), "%)</p>");
	}
	else
	{
		var estadistics=CalculaEstadisticsHistograma_AgrupatsDesDeCategories(estil.categories, DonaFactorValorMinEstiramentPaleta(estil.component[1].estiramentPaleta),
				DonaFactorValorMaxEstiramentPaleta(estil.component[1].estiramentPaleta, estil.component[1].herenciaOrigen.ncolors));
		if (tipus_estad == "sum")
			cdns.push(": ", estadistics.suma, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
		else if (tipus_estad == "sum_area")
			cdns.push(": ", estadistics.suma*area_cella, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
		else if (tipus_estad == "mean")
			cdns.push(": ", estad_categ.tinc_dec ? OKStrOfNe(estadistics.mitjana, estad_categ.n_dec) : estadistics.mitjana, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
		else if (tipus_estad == "variance")
			cdns.push(": ", estad_categ.tinc_dec ? OKStrOfNe(estadistics.varianca, estad_categ.n_dec) : estadistics.varianca, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
		else if (tipus_estad == "stdev")
			cdns.push(": ", estad_categ.tinc_dec ? OKStrOfNe(estadistics.desv_tipica, estad_categ.n_dec) : estadistics.desv_tipica, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
		else if (tipus_estad == "min")
			cdns.push(": ", estad_categ.tinc_dec ? OKStrOfNe(estadistics.valor_min, estad_categ.n_dec) : estadistics.valor_min, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
		else if (tipus_estad == "max")
			cdns.push(": ", estad_categ.tinc_dec ? OKStrOfNe(estadistics.valor_max, estad_categ.n_dec) : estadistics.valor_max, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
		else if (tipus_estad == "range")
			cdns.push(": ", estad_categ.tinc_dec ? OKStrOfNe(estadistics.valor_max-estadistics.valor_min+1, estad_categ.n_dec) : estadistics.valor_max-estadistics.valor_min+1, estad_categ.unitats ? " "+estad_categ.unitats : "","</p>");
	}

	//taula per categories
	cdns.push("</p>");
	cdns.push("<table style=\"width:100%;text-align:left;font-size:inherit\">");
	cdns.push("<tr><th style=\"text-align:center;\">", DonaCadena(ParamCtrl.capa[capa.valors[0].i_capa].estil[capa.valors[0].i_valor].desc), "</th><th style=\"text-align:center;\">",DonaCadenaLang({"cat":"Àrea", "spa":"Área", "eng":"Area", "fre":"Zone"}),
		"</th><th style=\"text-align:center;\">", estad_categ.desc, "</th></th>");

	for (i_cat=0; i_cat<estad_categ.ordre_cat.length; i_cat++)
	{
		cdns.push("<tr><td>", estad_categ.ordre_cat[i_cat].desc, "</td>");
		cdns.push("<td style=\"text-align:right;\">",	OKStrOfNe(estad_categ.ordre_cat[i_cat].count/estad_categ.count_total*100, estad_categ.n_dec), " %</td>"); //va % perquè és text per finestra
		if (estil.component[1].herenciaOrigen.categories) //la segona també es categòrica
		{
			if (tipus_estad == "mode_and_percent")
				cdns.push("<td style=\"text-align:right;\">", estad_categ.ordre_cat[i_cat].valor2," (", OKStrOfNe(estad_categ.ordre_cat[i_cat].valor, estad_categ.n_dec), estad_categ.unitats ? " "+estad_categ.unitats : "", ")</td>");
			else if (tipus_estad == "percent_mode")
				cdns.push("<td style=\"text-align:right;\">", OKStrOfNe(estad_categ.ordre_cat[i_cat].valor, estad_categ.n_dec), estad_categ.unitats ? " "+estad_categ.unitats : "", "</td>");
			else //és un text
				cdns.push("<td style=\"text-align:right;\">", estad_categ.ordre_cat[i_cat].valor, "</td>");
		}
		else
			cdns.push("<td style=\"text-align:right;\">", estad_categ.tinc_dec ? OKStrOfNe(estad_categ.ordre_cat[i_cat].valor, estad_categ.n_dec) : estad_categ.ordre_cat[i_cat].valor, estad_categ.unitats ? " "+estad_categ.unitats : "", "</td>");
	}
	cdns.push("</table>");

	OmpleTextPortapapersFinestraHistogramaADivisio(i_histograma, "stat_categ");
	return cdns.join("");
}

function CreaEstadisticPerCategories(n_histograma, i_diag, tipus_estad, order)
{
	var estil = ParamCtrl.capa[HistogramaFinestra.vista[n_histograma].i_capa].estil[HistogramaFinestra.vista[n_histograma].i_estil];
	document.getElementById(DonaNomEstadistic(n_histograma)).innerHTML=CreaTextEstadisticPerCategories(n_histograma, tipus_estad, order/*, true*/);

	if (i_diag != -1) //no s'havia creat encara i per això i_histograma estava indefinit, però estil.diagrama ja existia
		estil.diagrama[i_diag].i_histograma=HistogramaFinestra.n;
	else
	{
		if (typeof estil.diagrama === "undefined") //no està creat
			estil.diagrama =[]; //array de objectes
		estil.diagrama.push({tipus: "stat_categ", stat: tipus_estad, order: order, i_histograma: n_histograma});
	}
}

function DonaTipusGraficHistograma(estil, i_c)
{
	if (estil.component[i_c].representacio && (estil.component[i_c].representacio.tipus=='bar' || estil.component[i_c].representacio.tipus=='pie'))
		return estil.component[i_c].representacio.tipus;
	return (estil.categories && estil.atributs) ? 'pie' : 'bar';
}

function DesactivaCheckITextUnChartMatriuDinamic(i_capa, i_estil, i_diagrama, disabled)
{
	var estil = ParamCtrl.capa[i_capa].estil[i_estil];
	var part_id;

	if (typeof estil.diagrama === "undefined" || i_diagrama>estil.diagrama.length)
		return;

	if (typeof estil.diagrama[i_diagrama].i_histograma === "undefined") //encara no s'havia carregat mai
	{
		if (estil.diagrama[i_diagrama].tipus == "chart" || estil.diagrama[i_diagrama].tipus == "matriu")
			ObreFinestraHistograma(i_capa, i_estil);
		else if (estil.diagrama[i_diagrama].tipus == "chart_categ")
			ObreFinestraHistograma(i_capa, i_estil, estil.diagrama[i_diagrama].stat+"_2", "graphic", estil.diagrama[i_diagrama].order);
		else if (estil.diagrama[i_diagrama].tipus == "stat")
			ObreFinestraHistograma(i_capa, i_estil, estil.diagrama[i_diagrama].stat);
		else if (estil.diagrama[i_diagrama].tipus == "stat_categ")
			ObreFinestraHistograma(i_capa, i_estil, estil.diagrama[i_diagrama].stat+"_2", "text", estil.diagrama[i_diagrama].order);
		else if (estil.diagrama[i_diagrama].tipus == "vista3d")
			ObreFinestraSuperficie3D(i_capa, i_estil);
	}

	if (typeof estil.histograma !== "undefined" ) //potser encara no ho puc fer perquè no tinc les dades i ObreFinestraHistograma no ha acabat creant el chart encara
	{
		if (estil.diagrama[i_diagrama].tipus == "chart" || estil.diagrama[i_diagrama].tipus == "chart_categ" || estil.diagrama[i_diagrama].tipus == "matriu" ||
					estil.diagrama[i_diagrama].tipus == "stat" || estil.diagrama[i_diagrama].tipus == "stat_categ")
			part_id=DonaNomCheckDinamicHistograma(estil.diagrama[i_diagrama].i_histograma);
		else if (estil.diagrama[i_diagrama].tipus == "vista3d")
			part_id=DonaNomCheckDinamicGrafic3d(estil.diagrama[i_diagrama].i_histograma);
		else
			return;

		if (disabled)
		{
			window.document.getElementById(part_id).disabled = true;
			window.document.getElementById(part_id+"_label").style.fontStyle="italic";
			window.document.getElementById(part_id+"_text").style.display="inline";
		}
		else
		{
			window.document.getElementById(part_id).disabled = false;
			window.document.getElementById(part_id+"_label").style.fontStyle="";
			window.document.getElementById(part_id+"_text").style.display="none";
		}
	}
}

function DesactivaCheckITextChartsMatriusDinamics(i_capa, i_estil, disabled)
{
	var estil=ParamCtrl.capa[i_capa].estil[i_estil];

	if (typeof estil.diagrama === "undefined")
		return;

	for (var i_diagrama=0; i_diagrama<estil.diagrama.length; i_diagrama++)
		DesactivaCheckITextUnChartMatriuDinamic(i_capa, i_estil, i_diagrama, disabled); //desactivo aquest concret
}

function PreparaHistograma(n_histograma, i_c)
{
var histograma=HistogramaFinestra.vista[n_histograma];
var i, n_colors, i_color, area_cella;
var capa=ParamCtrl.capa[histograma.i_capa];
var estil=capa.estil[histograma.i_estil];
var costat=ParamInternCtrl.vista.CostatZoomActual;
var env={MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY};
var i_situacio=ParamInternCtrl.ISituacio;
var retorn_prep_histo={labels: [], valors: [], colors: []};

	if (estil.paleta && estil.paleta.colors)
	{
		n_colors=estil.paleta.colors.length;
		for (i=0; i<n_colors; i++)
			retorn_prep_histo.colors[i]=estil.paleta.colors[i];
	}
	else if (estil.component.length==1)
	{
		n_colors=256;
		for (i=0; i<n_colors; i++)
			retorn_prep_histo.colors[i]=RGB(i,i,i);
	}
	else
	{
		n_colors=256;
		if (i_c==0)
		{
			for (i=0; i<n_colors; i++)
				retorn_prep_histo.colors[i]=RGB(i,0,0);
		}
		else if (i_c==1)
		{
			for (i=0; i<n_colors; i++)
				retorn_prep_histo.colors[i]=RGB(0,i,0);
		}
		else if (i_c==2)
		{
			for (i=0; i<n_colors; i++)
				retorn_prep_histo.colors[i]=RGB(0,0,i);
		}
		else
		{
			retorn_prep_histo.colors[0]="#888888";
			for (i=1; i<n_colors; i++)
				retorn_prep_histo.colors[i]=colors[0];
		}
	}

	area_cella=DonaAreaCella(env, costat, ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);
	retorn_prep_histo.unitats=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);
	if (retorn_prep_histo.unitats=="°")
		retorn_prep_histo.unitats="m";
	if (area_cella>20 && retorn_prep_histo.unitats=="m")
	{
		area_cella*=0.000001;
		retorn_prep_histo.unitats="km";
	}

	if (estil.categories && estil.atributs)
	{
		//var total_celles=0;
		var a0=DonaFactorAEstiramentPaleta(estil.component[i_c].estiramentPaleta, n_colors);
		var valor_min0=DonaFactorValorMinEstiramentPaleta(estil.component[i_c].estiramentPaleta);
		var data=[], i_cat;
		if (estil.categories.length<n_colors)
			retorn_prep_histo.colors.length=n_colors=estil.categories.length;

		for (i=0, i_color=0; i_color<n_colors; i_color++)
		{
			i_cat=estil.component[i_c].estiramentPaleta ? Math.floor(i_color/a0+valor_min0) : i_color;
			if (!estil.categories[i_cat])
			{
				retorn_prep_histo.colors.splice(i, 1);
				continue;
			}
			data[i]=estil.histograma.component[i_c].classe[i_color]*area_cella;
			retorn_prep_histo.labels[i]=DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, i_cat, true);
			i++;
		}

		//var str=DonaCadena(estil.desc);
		var str=DonaCadena(capa.desc) + ((capa.estil.length > 1 && estil.desc)? ", " + DonaCadena(estil.desc) : "");
		if (capa.data)
			str+=" ("+DonaDataCapaComATextBreu(histograma.i_capa, capa.i_data)+")";
		retorn_prep_histo.options={
			title: {
				display: true,
				text: str
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var unitats = data.datasets[tooltipItem.datasetIndex].unitats;
						var tooltipLabel = data.labels[tooltipItem.index];
						var tooltipData = allData[tooltipItem.index];
						var total = 0;
						for (i=0; i<allData.length; i++) {
							total += allData[i];
						}
						var tooltipPercentage = OKStrOfNe(tooltipData / total * 100, 2);
						return tooltipLabel + ": " + tooltipPercentage + "%, "+ tooltipData +unitats+"²";
					}
				}
			}
		};

		retorn_prep_histo.data=data;
		if (retorn_prep_histo.labels.join("").length<800)  //Protencció contra llegendes massa grans.
		{
			for (i=0; i<retorn_prep_histo.labels.length; i++)
			{
				if (retorn_prep_histo.labels[i]>80/(retorn_prep_histo.labels.length/20+1))
					break;  //Protencció contra llegendes massa grans.
			}
		}
		else
			i=-1;
		if (i==retorn_prep_histo.labels.length)
		{
			retorn_prep_histo.options.legend={
				position: "right",
				labels: {
					fontSize: 10,
					padding: 3
				}
			};
		}
		else
		{
			retorn_prep_histo.options.legend={
				display: false
			};
		}
	}
	else
	{
		//data=estil.component[i_c].histograma;
		var data=[];
		for (i=0; i<n_colors; i++)
		{
			if (i==0)
				retorn_prep_histo.labels[i]=(estil.component[i_c].estiramentPaleta) ? estil.component[i_c].estiramentPaleta.valorMinim : 0;
			else if (n_colors>4 && i==n_colors/2)
				retorn_prep_histo.labels[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim+estil.component[i_c].estiramentPaleta.valorMinim)/2 : n_colors/2;
			else if (i==n_colors-1)
				retorn_prep_histo.labels[i]=(estil.component[i_c].estiramentPaleta) ? estil.component[i_c].estiramentPaleta.valorMaxim : n_colors;
			else
				retorn_prep_histo.labels[i]="";
			retorn_prep_histo.valors[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim-estil.component[i_c].estiramentPaleta.valorMinim)*i/n_colors+estil.component[i_c].estiramentPaleta.valorMinim : i;
			if (typeof estil.component[i_c].NDecimals!=="undefined" && estil.component[i_c].NDecimals!=null)
				retorn_prep_histo.valors[i]=OKStrOfNe(retorn_prep_histo.valors[i], estil.component[i_c].NDecimals);
			data[i]=estil.histograma.component[i_c].classe[i]*area_cella;
		}
		//En poso un de més deliveradament per tancar l'interval de útil cas.
		retorn_prep_histo.valors[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim-estil.component[i_c].estiramentPaleta.valorMinim)*i/n_colors+estil.component[i_c].estiramentPaleta.valorMinim : i;

		//var str=DonaCadena(estil.desc) + ((estil.component.length>1 && estil.component[i_c].desc) ? ", " + DonaCadena(estil.component[i_c].desc) : "")
		var str=DonaCadena(capa.desc) + ((capa.estil.length > 1 && estil.desc)? ", " + DonaCadena(estil.desc) : "") +
				((estil.component.length>1 && estil.component[i_c].desc) ? ", " + DonaCadena(estil.component[i_c].desc) : "");
		if (capa.data)
			str+=" ("+DonaDataCapaComATextBreu(histograma.i_capa, capa.i_data)+")";
		retorn_prep_histo.options={
			legend: {
				display: false
			},
			title: {
				display: true,
				text: str
			},
			scales: {
				xAxes: [{
					//scaleLabel: {display: true, labelString: DonaCadena(estil.desc) + ((estil.component.length>1 && estil.component[i_c].desc) ? " (" + DonaCadena(estil.component[i_c].desc) + ")" : "")},
					categoryPercentage: 1,
					barPercentage: 1.01+0.002*n_colors,   //Si no faig aquesta formula rara es veuen espais entre les barres.
					gridLines: { display: false },
					ticks: { autoSkip: false, maxRotation: 0 }
				}],
				yAxes: [{
					//type: "logarithmic",
					scaleLabel: {display: true, labelString: retorn_prep_histo.unitats+"²"}, //aquesta és retorn_prep_histo.unitats o unitats sol? crec que lo primer
					ticks: { beginAtZero:true }
				}]
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var tooltipLabel = "("+data.valors[tooltipItem.index]+","+data.valors[tooltipItem.index+1]+")";
						var tooltipData = allData[tooltipItem.index];
						return tooltipLabel + "," + tooltipData;
					}
				}
			}
		};

		retorn_prep_histo.data=data;
	}
	OmpleTextPortapapersFinestraHistogramaADivisio(n_histograma, "chart");
	return retorn_prep_histo;
}

function PreparaHistogramaPerCategories(n_histograma, tipus_estad, order)
{
var histograma=HistogramaFinestra.vista[n_histograma];
var i, n_colors_area, i_color, i_color1, area_cella;
var capa=ParamCtrl.capa[histograma.i_capa];
var estil=capa.estil[histograma.i_estil];
var costat=ParamInternCtrl.vista.CostatZoomActual;
var env={MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY};
var i_situacio=ParamInternCtrl.ISituacio;
var retorn_prep_histo={labels: [], data_area: [], colors_area: [], data_estad: [], colors_estad: []};

	if (estil.component.length!=2 || !estil.categories || !estil.atributs || !estil.paleta  || !estil.paleta.colors)
		return;

	area_cella=DonaAreaCella(env, costat, ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);
	retorn_prep_histo.unitats_area=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS);
	if (retorn_prep_histo.unitats_area=="°")
		retorn_prep_histo.unitats_area="m";
	if (area_cella>20 && retorn_prep_histo.unitats_area=="m")
	{
		area_cella*=0.000001;
		retorn_prep_histo.unitats_area="km";
	}

	var a0=DonaFactorAEstiramentPaleta(estil.component[0].estiramentPaleta, estil.paleta.colors.length);
	var valor_min0=DonaFactorValorMinEstiramentPaleta(estil.component[0].estiramentPaleta);
	var data_area=[];
	var data_estad=[];
	var grafic_estad_colors=false;

	var tipus_intern=tipus_estad;
	if (tipus_estad == "mean" || tipus_estad == "min" || tipus_estad == "max")
	{
		grafic_estad_colors=true;
		var ncolors1=estil.component[1].herenciaOrigen.nColors;
		var a1=DonaFactorAEstiramentPaleta(estil.component[1].estiramentPaleta, ncolors1);
		var valor_min1=DonaFactorValorMinEstiramentPaleta(estil.component[1].estiramentPaleta);
		//deduir la paleta de colors des de estil.component[1]
		var colors1=(ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].paleta && ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].paleta.colors) ? ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].paleta.colors : 256;
	}
	else if (tipus_estad =="mode" || tipus_estad == "percent_mode" || tipus_estad == "mode_and_percent")
	{
		//la sortida gràfica en cas de dues categòriques sempre és "mode_and_percent" perquè és el que té més sentit. En un futur es pot fer que la caixa posi en gris uns radials o altres, però de moment així va bé
	  tipus_intern="mode_and_percent";

		//deduir la paleta de colors des de estil.component[1] -> falta usar-los
		grafic_estad_colors=true;
		var colors1=ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].paleta.colors;
	}

	//en aquest context m'interessa primer no endreçar, després posar el color i després endreçar
	var estad_categ = CreaEstructuraAreaIValorEstadCategoriesEndrecades(estil, DonaCadena(ParamCtrl.capa[capa.valors[1].i_capa].estil[capa.valors[1].i_valor].desc), tipus_intern, "unsorted");
	n_colors_area=estil.categories.length;
	for (i=0, i_color=0; i_color<n_colors_area; i_color++)
	{
		if (!estil.categories[i_color] || i_color!=estad_categ.ordre_cat[i].i_cat /*a estad_categ les buides no hi son*/)
			continue;
		estad_categ.ordre_cat[i].color=estil.paleta.colors[i_color];
		i++;
	 	if (i==estad_categ.ordre_cat.length) //ja no en queden més
	 		break;
	}
	//endreçar
	if (order == "descend")
		estad_categ.ordre_cat.sort(OrdenacioCategoriesPerValorDescendent);
	else if (order == "ascend")
		estad_categ.ordre_cat.sort(OrdenacioCategoriesPerValorAscendent);

	for (i=0; i<estad_categ.ordre_cat.length; i++)
	{
		retorn_prep_histo.labels[i]=estad_categ.ordre_cat[i].desc;
		//dades pel gràfic d'àrea
		data_area[i]=estad_categ.ordre_cat[i].count*area_cella;
		retorn_prep_histo.colors_area[i]=estad_categ.ordre_cat[i].color;

		//dades pel gràfic de l'estadístic
		data_estad[i]=estad_categ.ordre_cat[i].valor;
		if (grafic_estad_colors)
		{
			if (colors1)
			{
				if (tipus_intern == "mode_and_percent")
					retorn_prep_histo.colors_estad[i] = colors1[estad_categ.ordre_cat[i].valor3];
				else
				{
					i_color1=Math.floor(a1*(estad_categ.ordre_cat[i].valor-valor_min1));
					if (i_color1>=ncolors1)
						i_color1=ncolors1-1;
					else if (i_color1<0)
						i_color1=0;
					retorn_prep_histo.colors_estad[i]=colors1[i_color1];
				}
			}
			else //poso el color de la categoria
				retorn_prep_histo.colors_estad[i]=estad_categ.ordre_cat[i].color;
		}
	}

	retorn_prep_histo.options_area={
 		legend: { display: false},
 	 	responsive: true,
 	 	scales: {
 	 		xAxes: [{
 					scaleLabel: {display: true, labelString: "Area ("+retorn_prep_histo.unitats_area+"²)"},
          ticks: {reverse: true},
          position: 'top',
    	}]
    },
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var allData = data.datasets[tooltipItem.datasetIndex].data	;
					var unitats = data.datasets[tooltipItem.datasetIndex].unitats;
					var tooltipData = estad_categ.tinc_dec ? OKStrOfNe(allData[tooltipItem.index], estad_categ.n_dec) :  allData[tooltipItem.index];
					var tooltipPercentage = OKStrOfNe(estad_categ.ordre_cat[tooltipItem.index].count / estad_categ.count_total * 100, estad_categ.tinc_dec ? estad_categ.n_dec : 2);
					return DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}) + ": " + tooltipPercentage + "%, "+ tooltipData +" "+ unitats+"²";
				}
			}
		}
	};
	retorn_prep_histo.data_area=data_area;

	//en el segon gràfic el cas de tipus_intern == "mode_and_percent" és una mica especial i té una estructura de tooltip diferent
	var label;
	if (tipus_intern == "mode_and_percent")
		label=estad_categ.desc; //ja és diu com a descriptor. No cal afegir-ho darrera si no queda "Modal class (%) of Habitat (%)"
	else
		label=estad_categ.desc + (estad_categ.unitats ? (" ("+estad_categ.unitats.replace("&sdot;","·")+")") : "");
	retorn_prep_histo.options_estad={
 		legend: { display: false},
 	 	responsive: true,
 	 	scales: {
 	 		xAxes: [{
 					scaleLabel: {display: true, labelString: label},
          ticks: {reverse: false},
          position: 'top',
    		}],
 	 		yAxes:[{
    	 				ticks: {display: false},
      	}]
    },
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					var allData = data.datasets[tooltipItem.datasetIndex].data;
					var unitats = data.datasets[tooltipItem.datasetIndex].unitats.replace("&sdot;","·");
					var tooltipData = estad_categ.tinc_dec ? OKStrOfNe(allData[tooltipItem.index], estad_categ.n_dec) :  allData[tooltipItem.index];
					if (tipus_intern == "mode_and_percent")
						return tooltipData + " " + unitats + " " + estad_categ.ordre_cat[tooltipItem.index].valor2;
					return estad_categ.desc + ": " + tooltipData + " " + unitats;
				}
			}
		}
	};
	retorn_prep_histo.data_estad=data_estad;
	retorn_prep_histo.unitats_estad = estad_categ.unitats ? estad_categ.unitats : "";


 /*}	/*
	else
	{
		//data=estil.component[i_c].histograma;
		var data=[];
		for (i=0; i<n_colors; i++)
		{
			if (i==0)
				retorn_prep_histo.labels[i]=(estil.component[i_c].estiramentPaleta) ? estil.component[i_c].estiramentPaleta.valorMinim : 0;
			else if (n_colors>4 && i==n_colors/2)
				retorn_prep_histo.labels[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim+estil.component[i_c].estiramentPaleta.valorMinim)/2 : n_colors/2;
			else if (i==n_colors-1)
				retorn_prep_histo.labels[i]=(estil.component[i_c].estiramentPaleta) ? estil.component[i_c].estiramentPaleta.valorMaxim : n_colors;
			else
				retorn_prep_histo.labels[i]="";
			retorn_prep_histo.valors[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim-estil.component[i_c].estiramentPaleta.valorMinim)*i/n_colors+estil.component[i_c].estiramentPaleta.valorMinim : i;
			if (typeof estil.component[i_c].NDecimals!=="undefined" && estil.component[i_c].NDecimals!=null)
				retorn_prep_histo.valors[i]=OKStrOfNe(retorn_prep_histo.valors[i], estil.component[i_c].NDecimals);
			data[i]=estil.histograma.component[i_c].classe[i]*area_cella;
		}
		//En poso un de més deliveradament per tancar l'interval de útil cas.
		retorn_prep_histo.valors[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim-estil.component[i_c].estiramentPaleta.valorMinim)*i/n_colors+estil.component[i_c].estiramentPaleta.valorMinim : i;

		var str=DonaCadena(estil.desc) + ((estil.component.length>1 && estil.component[i_c].desc) ? ", " + DonaCadena(estil.component[i_c].desc) : "")
		if (capa.data)
			str+=" ("+DonaDataCapaComATextBreu(histograma.i_capa, capa.i_data)+")";
		retorn_prep_histo.options={
			legend: {
				display: false
			},
			title: {
				display: true,
				text: str
			},
			scales: {
				xAxes: [{
					//scaleLabel: {display: true, labelString: DonaCadena(estil.desc) + ((estil.component.length>1 && estil.component[i_c].desc) ? " (" + DonaCadena(estil.component[i_c].desc) + ")" : "")},
					categoryPercentage: 1,
					barPercentage: 1.01+0.002*n_colors,    //Si no faig aquesta formula rara es veuen espais entre les barres.
					gridLines: { display: false },
					ticks: { autoSkip: false, maxRotation: 0 }
				}],
				yAxes: [{
					//type: "logarithmic",
					scaleLabel: {display: true, labelString: retorn_prep_histo.unitats+"²"}, //aquesta és retorn_prep_histo.unitats o unitats sol? crec que lo primer
					ticks: { beginAtZero:true }
				}]
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var tooltipLabel = "("+data.valors[tooltipItem.index]+","+data.valors[tooltipItem.index+1]+")";
						var tooltipData = allData[tooltipItem.index];
						return tooltipLabel + "," + tooltipData;
					}
				}
			}
		};

		retorn_prep_histo.data=data;
	}	*/
	OmpleTextPortapapersFinestraHistogramaADivisio(n_histograma, "chart_categ");
	return retorn_prep_histo;
	//alert("pendent");
}

function CreaHistograma(n_histograma, i_c)
{
	var histograma=HistogramaFinestra.vista[n_histograma];
	var retorn_prep_histo=PreparaHistograma(n_histograma, i_c);
	var ctx = document.getElementById(DonaNomCanvasHistograma(HistogramaFinestra.n)+i_c);
	var estil = ParamCtrl.capa[histograma.i_capa].estil[histograma.i_estil];

	var myChart = new Chart(ctx, {
		type: DonaTipusGraficHistograma(estil, i_c),
		data: {
			labels: retorn_prep_histo.labels,
			valors: (retorn_prep_histo.valors ? retorn_prep_histo.valors : null),
			datasets: [{
				data: retorn_prep_histo.data,
				backgroundColor: retorn_prep_histo.colors,
				borderWidth: 0,
				unitats: retorn_prep_histo.unitats
			}]
		},
		options: retorn_prep_histo.options
	});

	//per a una finestra amb tres histogrames, el ordre en que es crida e EsHistograma és el que toca
	//per tant el i de HistogramaFinestra.vista[n_histograma].chart hauria de coincidir amb i_c
	if (typeof HistogramaFinestra.vista[n_histograma].chart === "undefined") //no està creat
		HistogramaFinestra.vista[n_histograma].chart=[];

	if (HistogramaFinestra.vista[n_histograma].chart.length == i_c) //el i_c que em toca posar es el que toca
		HistogramaFinestra.vista[n_histograma].chart[i_c]=myChart; //però fent això la length s'amplia, es inteligent?
	else //no haria de passar i vol dir que ordre és diferent a l'esperat, però almenys faig algo
		HistogramaFinestra.vista[n_histograma].chart[HistogramaFinestra.vista[n_histograma].chart.length]=myChart;
}

function CreaHistogramesPerCategories(n_histograma, tip_est_intern, order)
{
	var histograma=HistogramaFinestra.vista[n_histograma];
	var retorn_prep_histo=PreparaHistogramaPerCategories(n_histograma, tip_est_intern, order);
	var estil = ParamCtrl.capa[histograma.i_capa].estil[histograma.i_estil];

	//primer gràfic de barres: àrea
	var ctx_area = document.getElementById(DonaNomCanvasHistograma(HistogramaFinestra.n)+"area");
	var myChart_area = new Chart(ctx_area, {
		type: 'horizontalBar',
		data: {
			labels: retorn_prep_histo.labels,
			datasets: [{
				label: DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}),
				data: retorn_prep_histo.data_area,
				backgroundColor: retorn_prep_histo.colors_area,
				borderWidth: 0,
				unitats: retorn_prep_histo.unitats_area
			}]
		},
		options: retorn_prep_histo.options_area
	});

	if (typeof HistogramaFinestra.vista[n_histograma].chart === "undefined") //no està creat
		HistogramaFinestra.vista[n_histograma].chart=[];

	HistogramaFinestra.vista[n_histograma].chart[0]=myChart_area; //conté l'àrea

	//segon gràfic de barres: l'estadístic
	var ctx_estad = document.getElementById(DonaNomCanvasHistograma(HistogramaFinestra.n)+"estad");
	var myChart_estad = new Chart(ctx_estad, {
		type: 'horizontalBar',
		data: {
			labels: retorn_prep_histo.labels,
			datasets: [{
				data: retorn_prep_histo.data_estad,
				backgroundColor: retorn_prep_histo.colors_estad,
				borderWidth: 0,
				unitats: retorn_prep_histo.unitats_estad
			}]
		},
		options: retorn_prep_histo.options_estad
	});

	HistogramaFinestra.vista[n_histograma].chart[1]=myChart_estad; //conté l'àrea
}

function DonaTextDivCopiaPortapapersFinestra(prefix_nom_div)
{
	//Això només és pel portapapers, donat que aquesta àrea és invisible.
	return "<div style=\"display: none\" id=\"" + prefix_nom_div + "_copy_form_div\"><form name=\"" + prefix_nom_div + "_copy_form\" onSubmit=\"return false;\"><textarea name=\"histo\" id=\"" + prefix_nom_div + "_copy_text\" wrap=\"off\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">kk</textarea></form></div>";
}

function IniciaCopiaPortapapersFinestra(win, prefix_nom_div)
{
	var div = win.document.getElementById(prefix_nom_div+"_copy_form_div");
	div.style.display="inline";  //Sembla que no es pot fer un select d'un element invisible.
	return div;
}

function FinalitzaCopiaPortapapersFinestra(win, prefix_nom_div, text, missatge)
{
	var div=win.document.getElementById(prefix_nom_div+"_copy_form_div")
	var textarea = win.document.getElementById(prefix_nom_div+"_copy_text");

	textarea.value=text;

	textarea.select();
	win.document.execCommand("Copy");
	div.style.display="none";
	if (missatge)
		win.alert(missatge);
}

function CopiaPortapapersFinestraSerieTemp(nom_histograma)
{
var cdns=[], data=[], temps, estadistics, capa, estil, area_cella;
var component_name=["R", "G", "B"];

	IniciaCopiaPortapapersFinestra(window, nom_histograma);

	estadistics=DonaDadesEstadistiquesFotogramaDeSerieTemporal()  //estadistics.mitjana+estadistics.desv_tipica, estadistics.mitjana, estadistics.mitjana-estadistics.desv_tipica
	temps=DonaTempsValorsSerieTemporalLocalitzacio()
	for (var p=0; p<PuntsSerieTemporal.length; p++)
		data[p]=DonaDadesValorsSerieTemporalLocalitzacio(PuntsSerieTemporal[p].i, PuntsSerieTemporal[p].j, false);

	capa=ParamCtrl.capa[DatesVideo[0].i_capa];
	estil=capa.estil[DatesVideo[0].i_estil];
	area_cella=DonaAreaCella(ParamInternCtrl.vista.EnvActual, ParamInternCtrl.vista.CostatZoomActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

	cdns.push(DonaCadenaLang({"cat": "Nom", "spa": "Nombre", "eng": "Name", "fre": "Name"}), "\t", DonaCadena(capa.DescVideo), "\n",
		DonaCadenaLang({"cat": "Banda", "spa": "Banda", "eng": "Band", "fre": "Bande"}), "\t", estil.desc, "\t", ((estil.DescItems) ? estil.DescItems : ""), "\n",
		DonaCadenaLang({"cat": "Mesura", "spa": "Medida", "eng": "Measure", "fre": "Measure"}), "\t", DonaTitolEixYSerieTemporalLocalitzacio(), "\n",
		DonaCadenaLang({"cat": "Costat de cel·la", "spa": "Lado de celda", "eng": "Cell size", "fre": "Taille de la cellule"}), "\t", ParamInternCtrl.vista.CostatZoomActual, "\t", DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS), "\n",
		DonaCadenaLang({"cat": "Àrea de la cel·la", "spa": "Área de celda", "eng": "Cell area", "fre": "Zone de la cellule"}), "\t", area_cella, "\tm²\n",
		"MinX", "\t", ParamInternCtrl.vista.EnvActual.MinX, "\n",
		"MaxX", "\t", ParamInternCtrl.vista.EnvActual.MaxX, "\n",
		"MinY", "\t", ParamInternCtrl.vista.EnvActual.MinY, "\n",
		"MaxY", "\t", ParamInternCtrl.vista.EnvActual.MaxY, "\n");

	//Titol de la columna és el nom de cada serie.
	for (var i_c=0; i_c<estadistics.length; i_c++)
	{
		if (estadistics.length==3)
			cdns.push(component_name[i_c], "\n");
		cdns.push("t", "\t",
			DonaCadenaLang({"cat": "Mitjana+desv", "spa": "Media+desv", "eng": "Mean+dev", "fre": "Moyenne+écart"}), "\t",
			DonaCadenaLang({"cat": "Mitjana", "spa": "Media", "eng": "Mean", "fre": "Moyenne"}), "\t",
			DonaCadenaLang({"cat": "Mitjana-desv", "spa": "Media-desv", "eng": "Mean-dev", "fre": "Moyenne-écart"}), "\t");
		for (var p=0; p<PuntsSerieTemporal.length; p++)
			cdns.push(DonaValorDeCoordActual(PuntsSerieTemporal[p].x, PuntsSerieTemporal[p].y, false, false).replace("\n", " - "), "\t");
		cdns.push("\n");
		for (var t=0; t<temps.length; t++)
		{
			cdns.push(temps[t], "\t", estadistics[i_c][0][t].y, "\t", estadistics[i_c][1][t].y, "\t", estadistics[i_c][2][t].y, "\t");
			for (var p=0; p<PuntsSerieTemporal.length; p++)
				cdns.push(data[p][i_c][t].y, "\t");
			cdns.push("\n");
		}
	}
	FinalitzaCopiaPortapapersFinestra(window, nom_histograma, cdns.join(""),
			DonaCadenaLang({"cat": "Els valors del gràfic han estat copiats al portaretalls", "spa": "Los valores del gráfico han sido copiados al portapapeles", "eng": "The values of the chart have been copied to clipboard", "fre": "Les valeurs du graphique ont été copiées dans le presse-papier"}));
}

function TancaFinestraSerieTemp(nom_div, nom_div_click)
{
	document.getElementById(nom_div).style.visibility="hidden";
	document.getElementById(nom_div_click).style.visibility="hidden";
	PuntsSerieTemporal=[];
}

function ObreGraficSerieTemporal(nom_div, nom_div_click, perfix_serie_temporal, data, labels, temps, y_scale_label, legend_label, que_mostrar)
{
var ncol=460, nfil=260, cdns=[];
var nom_histograma=perfix_serie_temporal+"serie_temp";
var chart=[];

	cdns.push("<div style=\"width: ", ncol, "px; position:absolute; opacity: 0.7; background-color: #FFFFFF\">");
	if (data.length==1)
		cdns.push("<div style=\"width: ", ncol, "px;height: ", nfil, "px;\"><canvas id=\"", nom_histograma, "_canvas_0\" width=\"", ncol, "\" height=\"", nfil, "\"></canvas></div>");
	else
	{
		nfil*=2;
		nfil=Math.round(nfil/data.length);
		for (i_c=0; i_c<data.length; i_c++)
			cdns.push("<div style=\"width: ", ncol, "px;height: ", nfil, "px;\"><canvas id=\"", nom_histograma, "_canvas_", i_c, "\" width=\"", ncol, "\" height=\"", nfil, "\"></canvas></div>");
	}
	//Això només és pel portapapers, donat que aquesta àrea és invisible.
	cdns.push(DonaTextDivCopiaPortapapersFinestra(nom_histograma),
	 	"</div>",
		"<div style=\"width: ", ncol, "px; position:absolute; opacity: 0.7;\">",
			  "<img align=\"right\" src=\"", AfegeixAdrecaBaseSRC("tanca_consulta.gif"), "\" ",
				"alt=\"",DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" ",
				"title=\"",DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}), "\" onClick=\"TancaFinestraSerieTemp('",nom_div,"','",nom_div_click,"');\">",
			  "<img align=\"right\" src=\"", AfegeixAdrecaBaseSRC("boto_copiar.gif"), "\" ",
				"alt=\"",DonaCadenaLang({"cat":"copiar", "spa":"copiar", "eng":"copy","fre":"copier"}), "\" ",
				"title=\"",DonaCadenaLang({"cat":"copiar", "spa":"copiar", "eng":"copy","fre":"copier"}), "\" onClick=\"CopiaPortapapersFinestraSerieTemp('",nom_histograma,"');\">",
		"</div>");

	document.getElementById(nom_div).innerHTML=cdns.join("");
	for (var i_c=0; i_c<data.length; i_c++)
		chart[i_c]=CreaGraficSerieTemporal(nom_histograma+"_canvas_"+i_c, data[i_c], labels, temps, y_scale_label[i_c], que_mostrar);

	document.getElementById(nom_div).style.visibility="visible";
	document.getElementById(nom_div_click).style.visibility="visible";
	return chart;
}

function CreaGraficSerieTemporal(nom_canvas, data, labels, temps, y_scale_label, que_mostrar)
{
	var cfg = {
		type: 'line',
		data: {
			labels: labels,
			temps: temps,
			datasets: [{
				label: DonaCadenaLang({"cat": "Mitjana+desv", "spa": "Media+desv", "eng": "Mean+dev", "fre": "Moyenne+écart"}),
				data: data[0],
				type: 'line',
				pointRadius: 0,
				pointHitRadius: 4,
				borderJoinStyle: "round",
				fill: false,
				lineTension: 0,
				borderWidth: 1,
				pointStyle: "line",
				borderDash: [7],
				borderColor: "#888888",
				backgroundColor: "#888888"
			},{
				label: DonaCadenaLang({"cat": "Mitjana", "spa": "Media", "eng": "Mean", "fre": "Moyenne"}),
				data: data[1],
				type: 'line',
				pointRadius: 0,
				pointHitRadius: 4,
				borderJoinStyle: "round",
				fill: false,
				lineTension: 0,
				borderWidth: 1,
				pointStyle: 'line',
				borderColor: "#888888",
				backgroundColor: "#888888"
			},{
				label: DonaCadenaLang({"cat": "Mitjana-desv", "spa": "Media-desv", "eng": "Mean-dev", "fre": "Moyenne-écart"}),
				data: data[2],
				type: 'line',
				pointRadius: 0,
				pointHitRadius: 4,
				borderJoinStyle: "round",
				fill: false,
				lineTension: 0,
				borderWidth: 1,
				pointStyle: 'line',
				borderDash: [7],
				borderColor: "#888888",
				backgroundColor: "#888888"
			}]
 		},
		options: {
			scales: {
				xAxes: [{
			                type: 'time',
			                distribution: 'linear',
					unit: DonaUnitTimeChartJSDataHora(que_mostrar),
					time: {
						tooltipFormat: DonaCadenaFormatDataHora(que_mostrar),
						displayFormats: DonaDisplayFormatsChartJSDataHora(que_mostrar)
					}
				}],
				yAxes: [{
					scaleLabel: {display: true, labelString: y_scale_label},
					ticks: { beginAtZero:true }
				}]
			},
			tooltips: {
				mode: 'x',
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var tooltipLabel = data.temps[tooltipItem.index];
						var tooltipData = allData[tooltipItem.index];
						return tooltipLabel + "," + tooltipData.y;
					}
				}
			},
	    		legend: {
				//position: 'right',
    				labels: {usePointStyle: true}
			}
		}
	};
	var ctx = document.getElementById(nom_canvas);
	return new Chart(ctx, cfg);
}


function AfegeixGraficSerieTemporal(chart, data, legend_label)
{
var color_name, color_names=["Black", "Red", "Maroon", "Yellow", "Olive", "Lime", "Green", "Aqua", "Teal", "Blue", "Navy", "Fuchsia", "Purple"]
var component_name=["R", "G", "B"];

	for (var i_c=0; i_c<data.length; i_c++)
	{
		color_name=color_names[(chart[i_c].data.datasets.length-3)%color_names.length];
		chart[i_c].data.datasets.push({
				label: legend_label + (data.length==3 ? "("+component_name[i_c]+")":""),
				data: data[i_c],
				type: 'line',
				pointRadius: 0,
				pointHitRadius: 4,
				borderJoinStyle: "round",
				fill: false,
				lineTension: 0,
				borderWidth: 3,
				pointStyle: "line",
				borderColor: color_name,
				backgroundColor: color_name
			});
		chart[i_c].update({
			duration: 0,
			easing: 'easeOutBounce'
		});
	}
	return color_name;
}

function CreaGraficSerieTemporalSimple(ctx, data, labels, temps, y_scale_label, color, que_mostrar)
{
	var cfg = {
		type: 'line',
		data: {
			labels: labels,
			temps: temps,
			datasets: [{
				label: y_scale_label,
				data: data,
				type: 'line',
				pointRadius: 0,
				pointHitRadius: 4,
				borderJoinStyle: "round",
				fill: false,
				lineTension: 0,
				borderWidth: 3,
				pointStyle: "line",
				borderColor: color,
				backgroundColor: color
			}]
 		},
		options: {
			scales: {
				xAxes: [{
			                type: 'time',
			                distribution: 'linear',
					unit: DonaUnitTimeChartJSDataHora(que_mostrar),
					time: {
						tooltipFormat: DonaCadenaFormatDataHora(que_mostrar),
						displayFormats: DonaDisplayFormatsChartJSDataHora(que_mostrar)
					}
				}],
				yAxes: [{
					scaleLabel: {display: true, labelString: y_scale_label},
					ticks: { beginAtZero:true }
				}]
			},
			tooltips: {
				mode: 'x',
				callbacks: {
					label: function(tooltipItem, data) {
						var allData = data.datasets[tooltipItem.datasetIndex].data;
						var tooltipLabel = data.temps[tooltipItem.index];
						var tooltipData = allData[tooltipItem.index];
						return tooltipLabel + "," + tooltipData.y;
					}
				}
			},
	    		legend: {
				display: false,
    				labels: {usePointStyle: true}
			}
		}
	};
	//var ctx = document.getElementById(nom_canvas);
	return new Chart(ctx, cfg);
}

function CreaGraficPerfilContinuSimple(ctx, valors, labels, colors, title)
{
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			valors: valors,
			datasets: [{
				data: valors,
				categoryPercentage: 1,
				barPercentage: 1.01+0.002*colors.length,  //Si no faig aquesta formula rara es veuen espais entre les barres
				backgroundColor: colors,
				borderWidth: 0,
			}]
		},
		options: {
			legend: {
				display: false
			},
			title: {
				display: true,
				text: title
			},
			scales: {
				xAxes: [{
					gridLines: { display: false },
					ticks: { autoSkip: true, autoSkipPadding: 10, maxRotation: 0 }
				}],
				yAxes: [{
					scaleLabel: {display: true},
					//ticks: { beginAtZero:true }
				}]
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
					}
				}
			}
		}

	});
}

function CreaGraficPerfilCategoricSimple(ctx, categories, labels, colors, title)
{
var data=[]

	for (var i_coord=0; i_coord<colors.length; i_coord++)
		data[i_coord]=1;  //faig totes les barres iguals.

	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			categories: categories,
			datasets: [{
				data: data,
				categoryPercentage: 1,
				barPercentage: 1.01+0.002*colors.length,  //Si no faig aquesta formula rara es veuen espais entre les barres.
				backgroundColor: colors,
				borderWidth: 0,
			}]
		},
		options: {
			legend: {
				display: false
			},
			title: {
				display: true,
				text: title
			},
			scales: {
				xAxes: [{
					gridLines: { display: false },
					ticks: { autoSkip: true, autoSkipPadding: 10, maxRotation: 0 }
				}],
				yAxes: [{
					display: false,
					scaleLabel: {display: false},
					ticks: { beginAtZero:true }
				}]
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						return data.categories[tooltipItem.index];
					}
				}
			}
		}

	});
}
