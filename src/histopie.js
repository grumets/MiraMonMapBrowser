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
var i_histo, div, textarea, cdns=[], capa, estil, histograma, i_c, i, area_cella;

	i_histo=parseInt(nom_finestra.substring(prefixHistogramaFinestra.length));
	histograma=HistogramaFinestra.vista[i_histo];
	div = document.getElementById(prefixHistogramaFinestra+i_histo+"_form_div");
	div.style.display="inline";  //Sembla que no es pot fer un select d'un element invisible.
	textarea = document.getElementById(prefixHistogramaFinestra+i_histo+"_text");

	capa=ParamCtrl.capa[histograma.i_capa];
	estil=capa.estil[histograma.i_estil];
	area_cella=DonaAreaCella(histograma.env, histograma.costat, ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS);

	cdns.push(DonaCadenaLang({"cat": "Capa", "spa": "Capa", "eng": "Layer", "fre": "Couche"}), "\t", capa.desc, "\n",
		DonaCadenaLang({"cat": "Banda", "spa": "Banda", "eng": "Band", "fre": "Bande"}), "\t", estil.desc, "\t", ((estil.DescItems) ? estil.DescItems : ""), "\n",
		DonaCadenaLang({"cat": "Costat de cel·la", "spa": "Lado de celda", "eng": "Cell size", "fre": "Taille de la cellule"}), "\t", histograma.costat, "\t", DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[histograma.i_situacio].EnvTotal.CRS), "\n",
		DonaCadenaLang({"cat": "Àrea de la cel·la", "spa": "Área de celda", "eng": "Cell area", "fre": "Zone de la cellule"}), "\t", area_cella, "\tm²\n",
		"MinX", "\t", histograma.env.MinX, "\n",
		"MaxX", "\t", histograma.env.MaxX, "\n", 
		"MinY", "\t", histograma.env.MinY, "\n", 
		"MaxY", "\t", histograma.env.MaxY, "\n");

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
		var value, ncolors=estil.histograma.component[0].classe.length;  //El nombre de colors, o és el nombre de colors de la paleta, o és 256 per totes les bandes
		var estadistics=[];
		for (i_c=0; i_c<estil.component.length; i_c++)
		{
			estadistics[i_c]=CalculaEstadisticsHistograma(estil.histograma.component[i_c].classe, 
						DonaFactorValorMinEstiramentPaleta(estil.component[i_c]),
						DonaFactorValorMaxEstiramentPaleta(estil.component[i_c]));
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

	textarea.value=cdns.join("");

	textarea.select();
	document.execCommand("Copy");
	div.style.display="none";
	alert(DonaCadenaLang({"cat": "Els valors del gràfic han estat copiats al portaretalls", "spa": "Los valores del gráfico han sido copiados al portapapeles", "eng": "The values of the graphic have been copied to clipboard", "fre": "Les valeurs du graphique ont été copiées dans le presse-papier"}));
}

function ObreFinestraHistograma(i_capa)
{
var ncol=460, nfil=260, estil=ParamCtrl.capa[i_capa].estil[ParamCtrl.capa[i_capa].i_estil], component=estil.component;
var nom_histograma=prefixHistogramaFinestra+HistogramaFinestra.n;
var cdns=[];

	if (component.length==1)
		cdns.push("<canvas id=\"", nom_histograma, "_canvas_0\" width=\"", ncol, "\" height=\"", nfil, "\"></canvas>");
	else
	{
		nfil*=2;
		nfil=Math.round(nfil/component.length);
		for (var i_c=0; i_c<component.length; i_c++)
			cdns.push("<div style=\"width: ", ncol, "px;height: ", nfil, "px;\"><canvas id=\"", nom_histograma, "_canvas_", i_c, "\" width=\"", ncol, "\" height=\"", nfil, "\"></canvas></div>");
	}
	//Això només és ple portapapers, donat que aquesta àrea és invisible.
	cdns.push("<div style=\"display: none\" id=\"", nom_histograma, "_form_div\"><form name=\"",nom_histograma,"_form\" onSubmit=\"return false;\"><textarea name=\"histo\" id=\"", nom_histograma, "_text\">kk</textarea></form></div>");

	insertContentLayer(getLayer(this, "menuContextualCapa"), "afterEnd", textHTMLFinestraLayer(nom_histograma, ((estil.categories && estil.atributs) ? DonaCadenaLang({"cat":"Gràfic circular", "spa":"Gráfico circular", "eng":"Pie chart", "fre":"Diagramme à secteurs"}) : DonaCadenaLang({"cat":"Histograma", "spa":"Histograma", "eng":"Histogram", "fre":"Histogramme"}))+" " + (HistogramaFinestra.n+1) + ", "+ DonaCadena(ParamCtrl.capa[i_capa].desc), boto_tancar|boto_copiar, 200+HistogramaFinestra.n*10, 200+HistogramaFinestra.n*10, ncol, nfil*component.length+AltBarraFinestraLayer+2, "NW", "no", true, null, cdns.join("")));
	OmpleBarraFinestraLayerNom(this, nom_histograma);
	HistogramaFinestra.vista[HistogramaFinestra.n]={ "nfil": nfil,
				"ncol": ncol,
                                "i_capa": i_capa,
				"i_estil": ParamCtrl.capa[i_capa].i_estil,
				"costat": ParamInternCtrl.vista.CostatZoomActual,
				"env": {"MinX": ParamInternCtrl.vista.EnvActual.MinX, "MaxX": ParamInternCtrl.vista.EnvActual.MaxX, "MinY": ParamInternCtrl.vista.EnvActual.MinY, "MaxY": ParamInternCtrl.vista.EnvActual.MaxY},
				"i_situacio": ParamInternCtrl.ISituacio,
				"i_histograma": HistogramaFinestra.n};

	for (var i_c=0; i_c<component.length; i_c++)
		CreaHistograma(nom_histograma+"_canvas_", HistogramaFinestra.vista[HistogramaFinestra.n], i_c);
	HistogramaFinestra.n++;
}

function CreaHistograma(nom_canvas, histograma, i_c)
{
var ctx, myChart, i, options, labels=[], n_colors, colors=[], data, area_cella, unitats, valors=[];
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
	if (area_cella>20)
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
			valors[i]=(estil.component[i_c].estiramentPaleta) ? (estil.component[i_c].estiramentPaleta.valorMaxim-estil.component[i_c].estiramentPaleta.valorMinim)*i/256+estil.component[i_c].estiramentPaleta.valorMinim : i;
			data[i]=estil.histograma.component[i_c].classe[i]*area_cella;
		}	
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
						var tooltipLabel = data.valors[tooltipItem.index];
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
	//Això només és ple portapapers, donat que aquesta àrea és invisible.
	cdns.push("<div style=\"display: none\" id=\"", nom_histograma, "_form_div\"><form name=\"",nom_histograma,"_form\" onSubmit=\"return false;\"><textarea name=\"histo\" id=\"", nom_histograma, "_text\">kk</textarea></form></div>",
	 	"</div>",
		"<div style=\"width: ", ncol, "px; position:absolute; opacity: 0.7;\">",
				  "<img align=\"right\" src=\"tanca_consulta.gif\" alt=\"",
					DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" onClick='document.getElementById(\""+nom_div+"\").style.visibility=\"hidden\";'></div>");

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
				label: DonaCadenaLang({"cat": "Mitjana+desv", "spa": "Media+desv", "eng": "Mean+dev", "fre": "Moyenne+Écart"}),
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
				label: DonaCadenaLang({"cat": "Mitjana-desv", "spa": "Media-desv", "eng": "Mean-dev", "fre": "Moyenne-Écart"}),
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
