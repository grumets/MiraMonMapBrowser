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
    amb l'ajut de Alba Brobia (a brobia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del
    CREAF que elabora programari de Sistema d'Informació Geogràfica
    i de Teledetecció per a la visualització, consulta, edició i anàlisi
    de mapes ràsters i vectorials. Aquest progamari programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert.

    En particular, el Navegador de Mapes del MiraMon (client per Internet)
    es distribueix sota els termes de la llicència GNU Affero General Public
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.

    El Navegador de Mapes del MiraMon es pot actualitzar des de
    https://github.com/grumets/MiraMonMapBrowser.
*/

"use strict"

var MessageLang={
	MissingMessage: {"cat":"Missatge no trobat", "spa":"Mensage no encontrado", "eng":"Missing message", "fre":"Message non trouvé"},
	ModifyName: {"cat":"Modifica el nom", "spa":"Modifica el nombre", "eng":"Modify the name", "fre":"Modifier le nom"},
	AddLayer: {"cat":"Afegir capa", "spa":"A&ntilde;adir capa", "eng":"Add layer", "fre":"Ajouter couche"},
	Metadata: {"cat":"Metadades", "spa":"Metadatos", "eng":"Metadata", "fre":"Métadonnées"},
	Quality: {"cat":"Qualitat", "spa":"Calidad", "eng":"Quality", "fre":"Qualité"},
	Lineage: {"cat":"Llinatge", "spa":"Linaje", "eng":"Lineage", "fre":"Lignage"},
	Feedback: {"cat":"Valoracions", "spa":"Valoraciones", "eng":"Feedback", "fre":"rétroaction"},
	PieChart: {"cat":"Gràfic circular", "spa":"Gráfico circular", "eng":"Pie chart", "fre":"Diagramme à secteurs"},
	Histogram: {"cat":"Histograma", "spa":"Histograma", "eng":"Histogram", "fre":"Histogramme"},
  Selection:{"cat":"Selecció", "spa":"Selección", "eng":"Selection", "fre":"Sélection"},
	cntxmenu:{
		ShareLayer: {"cat":"Compartir capa", "spa":"Compartir capa", "eng":"Share layer", "fre":"Partager couche"},
		RemoveLayer: {"cat":"Esborrar capa", "spa":"Borrar capa", "eng":"Delete layer", "fre":"Effacer couche"},
		MoveLayer: {"cat":"Moure la capa", "spa":"Mover la capa", "eng":"Move layer", "fre":"Déplacer la couche"},
		ToTheTop: {"cat":"A sobre de tot","spa":"Encima de todo", "eng":"To the top", "fre":"En haut de"},
		Up: {"cat":"A sobre","spa":"Encima", "eng":"Up", "fre":"Au-dessus"},
		Down: {"cat":"A sota", "spa":"Debajo::", "eng":"Down", "fre":"Au-dessous"},
		ToTheEnd: {"cat":"A sota de tot", "spa":"Debajo de todo", "eng":"To the end", "fre":"En bas"},
		ComputeQuality: {"cat":"Calcula la qualitat", "spa":"Calcula la calidad", "eng":"Compute the quality", "fre":"Calculer la qualité"},
		EditStyle: {"cat":"Edita estil", "spa":"Editar estilo", "eng":"Edit style", "fre":"Modifier le style"},
		ConfusionMatrix: {"cat":"Matriu de confusió", "spa":"Matriz de confusión", "eng":"Confusion matrix", "fre":"Matrice de confusion"},
		ContingencyTable: {"cat":"Taula de contingència", "spa":"Tabla de contingencia", "eng":"Contingency table", "fre":"Tableau de contingence"},
		StatisticByCategory: {"cat": "Estadístic per categoria", "spa": "Estadístico por categoria", "eng": "Statistic by category", "fre": "Statistique par catégorie"},
		Statistic: {"cat": "Estadístic", "spa": "Estadístico", "eng": "Statistic", "fre": "Statistique"},
		Surface: {"cat":"Superfície", "spa":"Superficie", "eng":"Surface", "fre":"Surface"},
		RGBCombination: {"cat":"Combinació RGB", "spa":"Combinación RGB", "eng":"RGB combination", "fre":"Combinaison RVB"},
		StatisticalDescriptorDisplayNeedSelected: {"cat":"Cal sel·leccionar el descriptor estadístic a mostrar per la capa", "spa":"Debe seleccionar el descriptor estadístico para mostrar para la capa", "eng":"The statistical descriptor to display for the layer needs to be selected", "fre":"Le descripteur statistique à afficher pour la couche doit être sélectionné"}
	},
	cntxmenu2:{
		statistics:
		{
			display:
			{
				SampleMessage: {"cat":"Cal sel·leccionar el descriptor estadístic a mostrar per la capa", "spa":"Debe seleccionar el descriptor estadístico para mostrar para la capa", "eng":"The statistical descriptor to display for the layer needs to be selected", "fre":"Le descripteur statistique à afficher pour la couche doit être sélectionné"}
			}
		}
	}
}
