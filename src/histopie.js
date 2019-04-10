/* 
    This file is part of MiraMon Map Browser.
    MiraMon Map Browser is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MiraMon Map Browser.  If not, see "http://www.gnu.org/licenses/".

    Copyright 2001, 2018 Xavier Pons

    Aquest codi JavaScript ha estat realitzat per Joan Masó Pau 
    (joan maso at uab cat) i Nuria Julià (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del Centre
    de recerca i aplicacions forestals (CREAF) que elabora programari de 
    Sistema d'Informació Geogràfica i de Teledetecció per a la 
    visualització, consulta, edició i anàlisi de mapes ràsters i 
    vectorials. Elabora programari d'escriptori i també servidors i clients 
    per Internet. No tots aquests productes són gratuïts o de codi obert. 
    En particular, el Navegador de Mapes del MiraMon (client per Internet) 
    es distribueix sota els termes de la llicència "GNU General Public 
    License". Es pot actualitzar des de www.creaf.uab.cat/miramon/mmn
*/

"use strict"

//Calcula estadistics a partir de les clases del histograma.
function CalculaEstadisticsHistograma(classe, valor_min, valor_max)
{
var ncolors=classe.length, value, i, suma_v_menys_mitj_quad_per_n=0;

var estadistics={valor_min: valor_min,   //Valor mínim cosiderat al histograma. Useu estil.histograma.component[].valorMinimReal per saber el valor mínim real
			valor_max: valor_max,  //Valor màxim cosiderat al histograma. Useu estil.histograma.component[].valorMaximReal per saber el valor màxim real
			ample: (valor_max-valor_min)/ncolors,           //Ample de cada clase
			recompte: 0,   //Nombre de pixels considerats en histograma que no són nodata. User estil.histograma.classe_nodata per saber el nombre de píxels a nodata
			suma: 0,       //Suma de TOTS els valors de la imatge
			mitjana: 0,    //Mitjana de tots els valors de la imatge
			varianca: 0,   //Variança de tots els valors de la imatge
			desv_tipica: 0};  //Desviació estàndard de tots els valors de la imatge

	for (i=0, value=estadistics.ample/2+estadistics.valor_min; i<ncolors; i++, value+=estadistics.ample)
	{
		estadistics.recompte+=classe[i];
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

var prefixNovaVistaFinestra="nova_vista_fin_";
var prefixHistogramaFinestra="histo_fin_";

function CopiaPortapapersFinestraLayer(nom_finestra)
{
	if (nom_finestra.length>prefixHistogramaFinestra.length && nom_finestra.substring(0, prefixHistogramaFinestra.length) == prefixHistogramaFinestra)
		CopiaTextPortapapersFinestraHistograma(nom_finestra);
}

var HistogramaFinestra={"n": 0, "vista":[]};

function CopiaTextPortapapersFinestraHistograma(nom_finestra)
{
var i_histo, prefix_div_copy, cdns=[], capa, estil, histograma, i_c, i, area_cella;

	i_histo=parseInt(nom_finestra.substring(prefixHistogramaFinestra.length));
	histograma=HistogramaFinestra.vista[i_histo];
	prefix_div_copy=prefixHistogramaFinestra+i_histo;
	IniciaCopiaPortapapersFinestra(prefix_div_copy);

	capa=ParamCtrl.capa[histograma.i_capa];
	estil=capa.estil[histograma.i_estil];
	area_cella=DonaAreaCella(histograma.env, histograma.costat, ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS);

	cdns.push(DonaCadenaLang({"cat": "Capa", "spa": "Capa", "eng": "Layer", "fre": "Couche"}), "\t", DonaCadena(capa.desc), "\n",
		DonaCadenaLang({"cat": "Banda", "spa": "Banda", "eng": "Band", "fre": "Bande"}), "\t", DonaCadena(estil.desc), "\t", ((estil.DescItems) ? DonaCadena(estil.DescItems) : ""), "\n",
		DonaCadenaLang({"cat": "Costat de cel·la", "spa": "Lado de celda", "eng": "Cell size", "fre": "Taille de la cellule"}), "\t", histograma.costat, "\t", DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS), "\n",
		DonaCadenaLang({"cat": "Àrea de la cel·la", "spa": "Área de celda", "eng": "Cell area", "fre": "Zone de la cellule"}), "\t", area_cella, "\tm²\n",
		"MinX", "\t", histograma.env.MinX, "\n",
		"MaxX", "\t", histograma.env.MaxX, "\n", 
		"MinY", "\t", histograma.env.MinY, "\n", 
		"MaxY", "\t", histograma.env.MaxY, "\n");

	if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
	{
		cdns.push(CreaTextMatriuDeConfusio(histograma, false));
	}
	else	
	{
		if (estil.categories && estil.atributs)
		{
			for (i=0; i<estil.categories.length; i++)
			{
				if (!estil.categories[i])
					continue;
				cdns.push(DonaTextCategoriaDesDeColor(estil, i));
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push("\t", estil.histograma.component[i_c].classe[i]*area_cella);
				cdns.push("\n");
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
							DonaFactorValorMaxEstiramentPaleta(estil.component[i_c].estiramentPaleta, ncolors));
			}
			cdns.push(DonaCadenaLang({"cat": "Recompte", "spa": "Cuenta", "eng": "Count", "fre": "Compter"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].recompte);
			cdns.push("\n", 
				DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].recompte*area_cella);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Suma", "spa": "Suma", "eng": "Sum", "fre": "Somme"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].suma);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Suma àrea", "spa": "Suma área", "eng": "Sum area", "fre": "Somme area"}), " (*m²)");
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].suma*area_cella);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Mitjana", "spa": "Media", "eng": "Mean", "fre": "Moyenne"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].mitjana);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Variança", "spa": "Varianza", "eng": "Variance", "fre": "Variance"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].varianca);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Desviació estàndard", "spa": "Desviació estándar", "eng": "Standard deviation", "fre": "Écart-type"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estadistics[i_c].desv_tipica);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Mínim", "spa": "Mínimo", "eng": "Minimum", "fre": "Minimum"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estil.histograma.component[i_c].valorMinimReal);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Màxim", "spa": "Máximo", "eng": "Maximum", "fre": "Maximum"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estil.histograma.component[i_c].valorMaximReal);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Rang", "spa": "Rango", "eng": "Range", "fre": "Gamme"}));
			for (i_c=0; i_c<estil.component.length; i_c++)
				cdns.push("\t", estil.histograma.component[i_c].valorMaximReal-estil.histograma.component[i_c].valorMinimReal+1);
			cdns.push("\n",
				DonaCadenaLang({"cat": "Classes", "spa": "Clases", "eng": "Classes", "fre": "Classes"}));


			for (i_c=1; i_c<estil.component.length; i_c++)
			{
				if (estadistics[i_c-1].valor_min!=estadistics[i_c].valor_min || estadistics[i_c-1].ample!=estadistics[i_c].ample)
					break;
			}	
			if (i_c==estil.component.length)
			{
				//el valor màxim i mínim (i l'ample) són iguals per totes les components
				cdns.push("\n",
					DonaCadenaLang({"cat": "Valor central", "spa": "Valor central", "eng": "Central Value", "fre": "Valeur centrale"}));
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push("\t", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
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
					cdns.push("\n");
				}
			}
			else
			{
				cdns.push("\n",
					DonaCadenaLang({"cat": "Classe", "spa": "Clase", "eng": "Class", "fre": "Classe"}));
				for (i_c=0; i_c<estil.component.length; i_c++)
					cdns.push("\t", DonaCadenaLang({"cat": "Valor central", "spa": "Valor central", "eng": "Central Value", "fre": "Valeur centrale"}),
						"\t", DonaCadenaLang({"cat": "Àrea", "spa": "Área", "eng": "Area", "fre": "Zone"}), " (m²)");
				cdns.push("\n"); 
				for (i=0; i<ncolors; i++)
				{
					cdns.push(i); 
					for (i_c=0; i_c<estil.component.length; i_c++)
					{
						value=estadistics[i_c].ample/2+estadistics[i_c].valor_min+estadistics[i_c].ample*i
						cdns.push("\t", value, "\t", estil.histograma.component[i_c].classe[i]*area_cella);
					}
					cdns.push("\n");
				}
			}
		}
		cdns.push("Nodata", "\t", estil.histograma.classe_nodata*area_cella, "\n");
	}
	FinalitzaCopiaPortapapersFinestra(prefix_div_copy, cdns.join(""), DonaCadenaLang({"cat": "Els valors del gràfic han estat copiats al portaretalls", "spa": "Los valores del gráfico han sido copiados al portapapeles", "eng": "The values of the graphic have been copied to clipboard", "fre": "Les valeurs du graphique ont été copiées dans le presse-papier"}));
}

function ObreFinestraHistograma(i_capa)
{
var ncol=460, nfil=260, estil=ParamCtrl.capa[i_capa].estil[ParamCtrl.capa[i_capa].i_estil], component=estil.component, titol;
var nom_histograma=prefixHistogramaFinestra+HistogramaFinestra.n;
var cdns=[];

	if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
	{
		titol=DonaCadenaLang({"cat":"Matriu de confusió", "spa":"Matriz de confusión", "eng":"Confusion matrix", "fre":"Matrice de confusion"}) + " " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
		ncol*=2;
		nfil*=2;
		cdns.push("<div id=\"", nom_histograma, "_matriu\" style=\"width: ", ncol, "px;height: ", nfil, "px;overflow: scroll;\"></div>");
	}
	else
	{
		titol=((estil.categories && estil.atributs) ? DonaCadenaLang({"cat":"Gràfic circular", "spa":"Gráfico circular", "eng":"Pie chart", "fre":"Diagramme à secteurs"}) : DonaCadenaLang({"cat":"Histograma", "spa":"Histograma", "eng":"Histogram", "fre":"Histogramme"}))+" " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc);
		if (component.length==1)
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

	insertContentLayer(getLayer(window, "menuContextualCapa"), "afterEnd", textHTMLFinestraLayer(nom_histograma, titol, boto_tancar|boto_copiar, 200+HistogramaFinestra.n*10, 200+HistogramaFinestra.n*10, ncol, nfil*component.length+AltBarraFinestraLayer+2, "NW", "no", true, null, cdns.join("")));
	OmpleBarraFinestraLayerNom(window, nom_histograma);
	HistogramaFinestra.vista[HistogramaFinestra.n]={ "nfil": nfil,
				"ncol": ncol,
                                "i_capa": i_capa,
				"i_estil": ParamCtrl.capa[i_capa].i_estil,
				"costat": ParamInternCtrl.vista.CostatZoomActual,
				"env": {"MinX": ParamInternCtrl.vista.EnvActual.MinX, "MaxX": ParamInternCtrl.vista.EnvActual.MaxX, "MinY": ParamInternCtrl.vista.EnvActual.MinY, "MaxY": ParamInternCtrl.vista.EnvActual.MaxY},
				"i_situacio": ParamInternCtrl.ISituacio,
				"i_histograma": HistogramaFinestra.n};

	if (estil.component && estil.component[0].representacio && estil.component[0].representacio.tipus=="matriuConfusio")
		CreaMatriuDeConfusio(nom_histograma+"_matriu", HistogramaFinestra.vista[HistogramaFinestra.n]);
	else	
	{
		for (var i_c=0; i_c<component.length; i_c++)
			CreaHistograma(nom_histograma+"_canvas_", HistogramaFinestra.vista[HistogramaFinestra.n], i_c);
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
		if (DonaTextCategoriaDesDeColor(estil1, i_cat)!=DonaTextCategoriaDesDeColor(estil2, i_cat))
			return false;
	}
	return true;
}

function CreaTextMatriuDeConfusio(histograma, es_html)
{
var cdns=[], ncol, nfil, j, v, cella, capa=[], estil=[], estil_nou, categories_iguals, suma_fil=[], suma_col=[], suma_total, encert, creuament, acumulat, area_cella, unitats, n_decimals, kappa, ncol_mostrades, nfil_mostrades;
var literal_total="Total", literal_sembla=DonaCadenaLang({"cat": "Semblança", "spa": "Similitud", "eng": "Similarity", "fra": "Similitude"});

	//La primera capa està a les columnes i la segona a les files
	estil_nou=ParamCtrl.capa[histograma.i_capa].estil[histograma.i_estil];
	capa[0]=ParamCtrl.capa[estil_nou.component[0].representacio.dimMatriu[0].i_capa];
	estil[0]=capa[0].estil[estil_nou.component[0].representacio.dimMatriu[0].i_estil];
	capa[1]=ParamCtrl.capa[estil_nou.component[0].representacio.dimMatriu[1].i_capa];
	estil[1]=capa[1].estil[estil_nou.component[0].representacio.dimMatriu[1].i_estil];

	area_cella=DonaAreaCella(histograma.env, histograma.costat, ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS);
	unitats=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS);
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
		cdns.push(DonaCadenaLang({"cat":"Matriu de confusió", "spa":"Matriz de confusión", "eng":"Confusion matrix", "fre":"Matrice de confusion"}), "\t", "Units", "\t", unitats, "²\n");
		cdns.push("\t");
	}

	//Categories de la capa 1 (columnes)
	for (var i_cat=0; i_cat<estil[0].categories.length; i_cat++)
	{
		if (!estil[0].categories[i_cat] || (categories_iguals ? suma_col[i_cat]==0 && suma_fil[i_cat]==0 : suma_col[i_cat]==0))
			continue;
		if (es_html)
			cdns.push("<th style=\"vertical-align: bottom; text-align: center; height:", DonaTextCategoriaDesDeColor(estil[0], i_cat).length*4, "px;\"><div class=\"text_vertical\" style=\"width: 15px;\">");
		cdns.push(DonaTextCategoriaDesDeColor(estil[0], i_cat));
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
		cdns.push(DonaTextCategoriaDesDeColor(estil[1], j_cat));
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
			cdns.push(OKStrOfNe((suma_fil[j_cat] ? estil_nou.histograma.component[0].classe[j_cat+estil[0].categories.length*j_cat]/suma_fil[j_cat]*100 : 0), 1),"%");
			cdns.push(es_html ? "</td>" : "\t");
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
			cdns.push(OKStrOfNe((suma_col[i_cat] ? estil_nou.histograma.component[0].classe[i_cat+estil[0].categories.length*i_cat]/suma_col[i_cat]*100 : 0), 1),"%");
			cdns.push(es_html ? "</td>" : "\t");
		}
		if (es_html)
			cdns.push("<td></td>",
				"<td style=\"text-align: right;color: #885533\">");
		else
			cdns.push("\t");
		cdns.push(OKStrOfNe(encert/suma_total*100, 1),"%");
		cdns.push(es_html ? "</td></tr>" : "\n");
	}
	if (es_html)
		cdns.push("</table>");
	return cdns.join("");
}

function CreaMatriuDeConfusio(nom_div, histograma)
{
	document.getElementById(nom_div).innerHTML=CreaTextMatriuDeConfusio(histograma, true);
}

function CreaHistograma(nom_canvas, histograma, i_c)
{
var ctx, myChart, i, options, labels=[], n_colors, i_color, colors=[], data, area_cella, unitats, valors=[];
var capa=ParamCtrl.capa[histograma.i_capa];
var estil=capa.estil[histograma.i_estil];

	if (estil.paleta && estil.paleta.colors)
	{
		n_colors=estil.paleta.colors.length;
		for (i=0; i<n_colors; i++)
			colors[i]=estil.paleta.colors[i];
	}
	else if (estil.component.length==1)
	{
		n_colors=256;
		for (i=0; i<n_colors; i++)
			colors[i]=RGB(i,i,i);
	}
	else
	{
		n_colors=256;
		if (i_c==0)
		{
			for (i=0; i<n_colors; i++)
				colors[i]=RGB(i,0,0);
		}
		else if (i_c==1)
		{
			for (i=0; i<n_colors; i++)
				colors[i]=RGB(0,i,0);
		}
		else if (i_c==2)
		{
			for (i=0; i<n_colors; i++)
				colors[i]=RGB(0,0,i);
		}
		else
		{
			colors[0]="#888888";
			for (i=1; i<n_colors; i++)
				colors[i]=colors[0];
		}
	}

	area_cella=DonaAreaCella(histograma.env, histograma.costat, ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS);
	unitats=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS);
	if (unitats=="°")
		unitats="m";
	if (area_cella>20 && unitats=="m")
	{
		area_cella*=0.000001;
		unitats="km";
	}

	if (estil.categories && estil.atributs)
	{
		//var total_celles=0;
		data=[];
		if (estil.categories.length<n_colors)
			colors.length=n_colors=estil.categories.length;
		
		for (i=0, i_color=0; i_color<n_colors; i_color++)
		{
			if (!estil.categories[i_color])
			{
				colors.splice(i, 1);
				continue;
			}
			data[i]=estil.histograma.component[i_c].classe[i_color]*area_cella;
			labels[i]=DonaTextCategoriaDesDeColor(estil, i_color);
			i++;
		}	
		options={
			title: {
				display: true,
				text: DonaCadena(estil.desc)
			},
			tooltips: { 
				callbacks: { 
					label: function(tooltipItem, data) { 
						var allData = data.datasets[tooltipItem.datasetIndex].data; 
						var unitats = data.datasets[tooltipItem.datasetIndex].unitats; 
						var tooltipLabel = data.labels[tooltipItem.index]; 
						var tooltipData = allData[tooltipItem.index];
						var total = 0; 
						for (var i in allData) { 
							total += allData[i]; 
						} 
						var tooltipPercentage = OKStrOfNe(tooltipData / total * 100, 2); 
						return tooltipLabel + ": " + tooltipPercentage + "%, "+ tooltipData +unitats+"²"; 
					} 
				} 
			} 
		};

		if (labels.join("").length<800)  //Protencció contra llegendes massa grans.
		{
			for (i=0; i<labels.length; i++)
			{
				if (labels[i]>80/(labels.length/20+1))
					break;  //Protencció contra llegendes massa grans.
			}
		}
		else 
			i=-1;
		if (i==labels.length)
		{
			options.legend={
				position: "right",
				labels: {
					fontSize: 10,
					padding: 3
				}
			};
		}
		else
		{
			options.legend={
				display: false
			};
		}
	}	
	else
	{
		//data=estil.component[i_c].histograma;
		data=[];
		for (i=0; i<n_colors; i++)
		{
			if (i==0)
				labels[i]=(estil.component[i_c].estiramentPaleta) ? estil.component[i_c].estiramentPaleta.valorMinim : 0;
			else if (n_colors>4 && i==n_colors/2)
				labels[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim+estil.component[i_c].estiramentPaleta.valorMinim)/2 : n_colors/2;
			else if (i==n_colors-1)
				labels[i]=(estil.component[i_c].estiramentPaleta) ? estil.component[i_c].estiramentPaleta.valorMaxim : n_colors;
			else
				labels[i]="";
			valors[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim-estil.component[i_c].estiramentPaleta.valorMinim)*i/n_colors+estil.component[i_c].estiramentPaleta.valorMinim : i;
			if (typeof estil.component[i_c].NDecimals!=="undefined" && estil.component[i_c].NDecimals!=null) 
				valors[i]=OKStrOfNe(valors[i], estil.component[i_c].NDecimals);
			data[i]=estil.histograma.component[i_c].classe[i]*area_cella;
		}
		//En poso un de més deliveradament per tancar l'interval de útil cas.
		valors[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim-estil.component[i_c].estiramentPaleta.valorMinim)*i/n_colors+estil.component[i_c].estiramentPaleta.valorMinim : i;
		options={
			legend: {
				display: false
			},
			title: {
				display: true,
				text: DonaCadena(estil.desc) + ((estil.component.length>1 && estil.component[i_c].desc) ? ", " + DonaCadena(estil.component[i_c].desc) : "")
			},
			scales: {
				xAxes: [{
					//scaleLabel: {display: true, labelString: DonaCadena(estil.desc) + ((estil.component.length>1 && estil.component[i_c].desc) ? " (" + DonaCadena(estil.component[i_c].desc) + ")" : "")},
					categoryPercentage: 1+0.2*n_colors/256,
					barPercentage: 1+0.2*n_colors/256,
					gridLines: { display: false },
					ticks: { autoSkip: false, maxRotation: 0 }
				}],
				yAxes: [{
					//type: "logarithmic",
					scaleLabel: {display: true, labelString: unitats+"²"},
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
	}
	ctx = document.getElementById(nom_canvas+i_c);
	myChart = new Chart(ctx, {
		type: ((estil.categories && estil.atributs) ? 'pie' : 'bar'),
		data: {
			labels: labels,
			valors: (valors ? valors : null),
			datasets: [{
				data: data,
				backgroundColor: colors,
				borderWidth: 0,
				unitats: unitats
			}]
		},
		options: options
	});
}

function DonaTextDivCopiaPortapapersFinestra(prefix_nom_div)
{
	//Això només és pel portapapers, donat que aquesta àrea és invisible.
	return "<div style=\"display: none\" id=\"" + prefix_nom_div + "_copy_form_div\"><form name=\"" + prefix_nom_div + "_copy_form\" onSubmit=\"return false;\"><textarea name=\"histo\" id=\"" + prefix_nom_div + "_copy_text\">kk</textarea></form></div>";
}

function IniciaCopiaPortapapersFinestra(prefix_nom_div)
{
	var div = document.getElementById(prefix_nom_div+"_copy_form_div");
	div.style.display="inline";  //Sembla que no es pot fer un select d'un element invisible.
	return div;
}


function FinalitzaCopiaPortapapersFinestra(prefix_nom_div, text, missatge)
{
	var div=document.getElementById(prefix_nom_div+"_copy_form_div")
	var textarea = document.getElementById(prefix_nom_div+"_copy_text");

	textarea.value=text;

	textarea.select();
	document.execCommand("Copy");
	div.style.display="none";
	alert(missatge);
}

function CopiaPortapapersFinestraSerieTemp(nom_histograma)
{
var cdns=[], data=[], temps, estadistics, capa, estil, area_cella;
var component_name=["R", "G", "B"];

	IniciaCopiaPortapapersFinestra(nom_histograma)

	estadistics=DonaDadesEstadistiquesSerieTemporalLocalitzacio()  //estadistics.mitjana+estadistics.desv_tipica, estadistics.mitjana, estadistics.mitjana-estadistics.desv_tipica
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
	FinalitzaCopiaPortapapersFinestra(nom_histograma, cdns.join(""), DonaCadenaLang({"cat": "Els valors del gràfic han estat copiats al portaretalls", "spa": "Los valores del gráfico han sido copiados al portapapeles", "eng": "The values of the graphic have been copied to clipboard", "fre": "Les valeurs du graphique ont été copiées dans le presse-papier"}));
}

function TancaFinestraSerieTemp(nom_div)
{
	document.getElementById(nom_div).style.visibility="hidden";
	PuntsSerieTemporal=[];
}

function ObreGraficSerieTemporal(nom_div, perfix_serie_temporal, data, labels, temps, y_scale_label, legend_label)
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
				"title=\"",DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}), "\" onClick=\"TancaFinestraSerieTemp('",nom_div,"');\">",
			  "<img align=\"right\" src=\"", AfegeixAdrecaBaseSRC("boto_copiar.gif"), "\" ",
				"alt=\"",DonaCadenaLang({"cat":"copiar", "spa":"copiar", "eng":"copy","fre":"copier"}), "\" ", 
				"title=\"",DonaCadenaLang({"cat":"copiar", "spa":"copiar", "eng":"copy","fre":"copier"}), "\" onClick=\"CopiaPortapapersFinestraSerieTemp('",nom_histograma,"');\">",
		"</div>");

	document.getElementById(nom_div).innerHTML=cdns.join("");
	for (var i_c=0; i_c<data.length; i_c++)
		chart[i_c]=CreaGraficSerieTemporal(nom_histograma+"_canvas_"+i_c, data[i_c], labels, temps, y_scale_label[i_c]);

	document.getElementById(nom_div).style.visibility="visible";
	return chart;
}

function CreaGraficSerieTemporal(nom_canvas, data, labels, temps, y_scale_label)
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
			                distribution: 'linear'
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
var color_names=["Black", "Red", "Maroon", "Yellow", "Olive", "Lime", "Green", "Aqua", "Teal", "Blue", "Navy", "Fuchsia", "Purple"]
var component_name=["R", "G", "B"];

	for (var i_c=0; i_c<data.length; i_c++)
	{
		chart[i_c].data.datasets.push({
				label: legend_label + (data.length==3 ? "("+component_name[i_c]+")":""),
				data: data[i_c],
				type: 'line',
				pointRadius: 0,
				pointHitRadius: 4,
				fill: false,
				lineTension: 0,
				borderWidth: 3,
				pointStyle: "line",
				borderColor: color_names[(chart[i_c].data.datasets.length-3)%color_names.length], 
				backgroundColor: color_names[(chart[i_c].data.datasets.length-3)%color_names.length]
			});
		chart[i_c].update({
			duration: 0,
			easing: 'easeOutBounce'
		});
	}
}
