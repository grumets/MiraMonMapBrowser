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

    Aquest codi JavaScript ha estat idea de Joan MasÛ Pau (joan maso at uab cat)
    amb l'ajut de Alba Brobia (a brobia at creaf uab cat) i Didac Pardell (d.pardell at creaf uab cat)
    dins del grup del MiraMon. MiraMon Ès un projecte del
    CREAF que elabora programari de Sistema d'InformaciÛ Geogr‡fica
    i de TeledetecciÛ per a la visualitzaciÛ, consulta, ediciÛ i an‡lisi
    de mapes r‡sters i vectorials. Aquest progamari programari inclou
    aplicacions d'escriptori i tambÈ servidors i clients per Internet.
    No tots aquests productes sÛn gratuÔts o de codi obert.

    En particular, el Navegador de Mapes del MiraMon (client per Internet)
    es distribueix sota els termes de la llicËncia GNU Affero General Public
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.

    El Navegador de Mapes del MiraMon es pot actualitzar des de
    https://github.com/grumets/MiraMonMapBrowser.
*/

"use strict"

var MessageLang={
	"TheLanguageName": {
	  "cat": "Catalù",
	  "spa": "Espaùol",
	  "eng": "English",
	  "fre": "Franùais",
	  "cze": "Anglictina"
	},
	"MissingMessage": {
	  "cat": "Missatge no trobat",
	  "spa": "Mensage no encontrado",
	  "eng": "Missing message",
	  "fre": "Message non trouvù",
	  "cze": "Chybejùcù zprùva"
	},
	"neitherRecognizedNorImplemented": {
	  "cat": "no reconnegut o implementat",
	  "spa": "no reconocido o implementado",
	  "eng": "neither recognized nor implemented",
	  "fre": "Ni reconnu ni mis en ùuvre",
	  "cze": "nenù rozpoznùn ani implementovùn"
	},
	"UseTheFormat": {
	  "cat": "Useu el format",
	  "spa": "Use el formato",
	  "eng": "Use the format",
	  "fre": "Utilisez le format",
	  "cze": "Pouùijte formùt"
	},
	"WrongFormatParameter": {
	  "cat": "Format de parùmetre incorrecte",
	  "spa": "Formato de parametro incorrecto",
	  "eng": "Wrong format in parameter",
	  "fre": "Format incorrect dans le paramùtre",
	  "cze": "ùpatnù formùt v parametru"
	},
	"ModifyName": {
	  "cat": "Modifica el nom",
	  "spa": "Modifica el nombre",
	  "eng": "Modify the name",
	  "fre": "Modifier le nom",
	  "cze": "Upravit nùzev"
	},
	"AddLayer": {
	  "cat": "Afegir capa",
	  "spa": "AÒadir capa",
	  "eng": "Add layer",
	  "fre": "Ajouter couche",
	  "cze": "Pridat vrstvu"
	},
	"Georeference": {
	  "cat": "Georeferùncia",
	  "spa": "Georeferencia",
	  "eng": "Georeference",
	  "fre": "Gùorùfùrence",
	  "cze": "Georeference (noun)"
	},
	"Coordinates": {
	  "cat": "Coordenades",
	  "spa": "Coordenadas",
	  "eng": "Coordinates",
	  "fre": "Coordonnùes",
	  "cze": "Souradnice"
	},
	"CentralPoint": {
	  "cat": "Punt central",
	  "spa": "Punto central",
	  "eng": "Central point",
	  "fre": "Point central",
	  "cze": "Strednù bod"
	},
	"CurrentReferenceSystem": {
	  "cat": "Sistema de referùncia actual",
	  "spa": "Sistema de referencia actual",
	  "eng": "Current reference system",
	  "fre": "Systùme de rùfùrence actuel",
	  "cze": "Aktuùlnù referencnù systùm"
	},
	"AvailableBoundary": {
	  "cat": "ùmbit disponible",
	  "spa": "ùmbito disponible",
	  "eng": "Available boundary",
	  "fre": "Champ disponible",
	  "cze": "Dostupnù hranice"
	},
	"CellSize": {
	  "cat": "Costat de celùla",
	  "spa": "Lado de celda",
	  "eng": "Cell size",
	  "fre": "Taille de la cellule",
	  "cze": "Velikost bunky"
	},
	"CellArea": {
	  "cat": "ùrea de la celùla",
	  "spa": "ùrea de celda",
	  "eng": "Cell area",
	  "fre": "Zone de la cellule",
	  "cze": "Plocha bunky"
	},
	"metadata": {
	  "cat": "metadades",
	  "spa": "metadatos",
	  "eng": "metadata",
	  "fre": "mùtadonnùes",
	  "cze": "metadata"
	},
	"Metadata": {
	  "cat": "Metadades",
	  "spa": "Metadatos",
	  "eng": "Metadata",
	  "fre": "Mùtadonnùes",
	  "cze": "Metadata"
	},
	"Quality": {
	  "cat": "Qualitat",
	  "spa": "Calidad",
	  "eng": "Quality",
	  "fre": "Qualitù",
	  "cze": "Kvalita"
	},
	"Lineage": {
	  "cat": "Llinatge",
	  "spa": "Linaje",
	  "eng": "Lineage",
	  "fre": "Lignage",
	  "cze": "Linie"
	},
	"Feedback": {
	  "cat": "Valoracions",
	  "spa": "Valoraciones",
	  "eng": "Feedback",
	  "fre": "rùtroaction",
	  "cze": "Zpetnù vazba"
	},
	"PieChart": {
	  "cat": "Grùfic circular",
	  "spa": "Grùfico circular",
	  "eng": "Pie chart",
	  "fre": "Diagramme ù secteurs",
	  "cze": "Kolùcovù graf"
	},
	"Histogram": {
	  "cat": "Histograma",
	  "spa": "Histograma",
	  "eng": "Histogram",
	  "fre": "Histogramme",
	  "cze": "Histogram"
	},
	"Selection": {
	  "cat": "Selecciù",
	  "spa": "Selecciùn",
	  "eng": "Selection",
	  "fre": "Sùlection",
	  "cze": "Vùber"
	},
	"Open": {
	  "cat": "Obrir",
	  "spa": "Abrir",
	  "eng": "Open",
	  "fre": "Ouvrir",
	  "cze": "Otevrùt"
	},
	"Save": {
	  "cat": "Desar",
	  "spa": "Guardar",
	  "eng": "Save",
	  "fre": "Sauvegarder",
	  "cze": "Uloùit"
	},
	"close": {
	  "cat": "tancar",
	  "spa": "cerrar",
	  "eng": "close",
	  "fre": "quitter",
	  "cze": "zavrùt"
	},
	"Close": {
	  "cat": "Tancar",
	  "spa": "Cerrar",
	  "eng": "Close",
	  "fre": "Quitter",
	  "cze": "Zavrùt"
	},
	"print": {
	  "cat": "imprimir",
	  "spa": "imprimir",
	  "eng": "print",
	  "fre": "imprimer",
	  "cze": "tisk"
	},
	"indicates": {
	  "cat": "indica",
	  "spa": "indica",
	  "eng": "indicates",
	  "fre": "indique",
	  "cze": "oznacuje"
	},
	"show": {
	  "cat": "mostrar",
	  "spa": "mostrar",
	  "eng": "show",
	  "fre": "afficher",
	  "cze": "zobrazit"
	},
	"Show": {
	  "cat": "Mostrar",
	  "spa": "Mostrar",
	  "eng": "Show",
	  "fre": "Afficher",
	  "cze": "Zobrazit"
	},
	"Shown": {
	  "cat": "Mostrades",
	  "spa": "Mostradas",
	  "eng": "Shown",
	  "fre": "Montrù",
	  "cze": "Zobrazeno"
	},
	"Hide": {
	  "cat": "Amagar",
	  "spa": "Ocultar",
	  "eng": "Hide",
	  "fre": "Cacher",
	  "cze": "Skrùt"
	},
	"UnderDevelopment": {
	  "cat": "En desenvolupament.",
	  "spa": "En desarrollo.",
	  "eng": "Under development.",
	  "fre": "En dùveloppement.",
	  "cze": "Ve vùvoji."
	},
	"layer": {
	  "cat": "capa",
	  "spa": "capa",
	  "eng": "layer",
	  "fre": "couche",
	  "cze": "vrstva"
	},
	"Layer": {
	  "cat": "Capa",
	  "spa": "Capa",
	  "eng": "Layer",
	  "fre": "Couche",
	  "cze": "Vrstva"
	},
	"LayerId": {
	  "cat": "Identificador de la capa",
	  "spa": "Identificador de la capa",
	  "eng": "Layer identifier",
	  "fre": "Identificateur de couche",
	  "cze": "Identifikùtor vrstvy"
	},
	"Layers": {
	  "cat": "Capes",
	  "spa": "Capas",
	  "eng": "Layers",
	  "fre": "Couches",
	  "cze": "Vrstvy"
	},
	"theLayer": {
	  "cat": "la capa",
	  "spa": "la capa",
	  "eng": "the layer",
	  "fre": "la couche",
	  "cze": "vrstva"
	},
	"TheLayer": {
	  "cat": "La capa",
	  "spa": "La capa",
	  "eng": "The layer",
	  "fre": "La couche",
	  "cze": "Vrstva"
	},
	"ofTheLayer": {
	  "cat": "de la capa",
	  "spa": "de la capa",
	  "eng": "of the layer",
	  "fra": "de la couche",
	  "cze": "vrstvy"
	},
	"Add": {
	  "cat": "Afegir",
	  "spa": "Aùadir",
	  "eng": "Add",
	  "fre": "Ajouter",
	  "cze": "Pridat"
	},
	"Explore": {
	  "cat": "Explorar",
	  "spa": "Explorar",
	  "eng": "Explore",
	  "fre": "Examiner",
	  "cze": "Prozkoumat"
	},
	"AddLayers": {
	  "cat": "Afegir capes",
	  "spa": "Aùadir capas",
	  "eng": "Add layers",
	  "fre": "Ajouter couches",
	  "cze": "Pridat vrstvy"
	},
	"Expression": {
	  "cat": "Fùrmula",
	  "spa": "Fùrmula:",
	  "eng": "Expression",
	  "fre": "Formule",
	  "cze": "Vùraz"
	},
	"Value": {
	  "cat": "Valor",
	  "spa": "Valor",
	  "eng": "Value",
	  "fre": "Valeur",
	  "cze": "Hodnota"
	},
	"InitialValue": {
	  "cat": "Valor inicial",
	  "spa": "Valor inicial",
	  "eng": "Initial value",
	  "fre": "Valeur initiale",
	  "cze": "Pocùtecnù hodnota"
	},
	"TheValue": {
	  "cat": "El valor",
	  "spa": "El valor",
	  "eng": "The value",
	  "fre": "La valeur",
	  "cze": "Hodnota"
	},
	"Operator": {
	  "cat": "Operador",
	  "spa": "Operador",
	  "eng": "Operator",
	  "fre": "Opùrateur",
	  "cze": "Operùtor"
	},
	"Parameters": {
	  "cat": "Parùmetres",
	  "spa": "Parùmetros",
	  "eng": "Parameters",
	  "fre": "Parameters",
	  "cze": "Parametry"
	},
	"date": {
	  "cat": "data",
	  "spa": "fecha",
	  "eng": "date",
	  "fre": "date",
	  "cze": "datum"
	},
	"Date": {
	  "cat": "Data",
	  "spa": "Fecha",
	  "eng": "Date",
	  "fre": "Date",
	  "cze": "Datum"
	},
	"Field": {
	  "cat": "Camp",
	  "spa": "Camp",
	  "eng": "Field",
	  "fre": "Champ",
	  "cze": "Pole"
	},
	"ofTheField": {
	  "cat": "del camp",
	  "spa": "del campo",
	  "eng": "of the field",
	  "fre": "du champ",
	  "cze": "pole"
	},
	"Title": {
	  "cat": "TÌtol",
	  "spa": "TÌtulo",
	  "eng": "Title",
	  "fre": "Titre",
	  "cze": "Nùzev"
	},
	"Condition": {
	  "cat": "Condiciù",
	  "spa": "Condiciùn",
	  "eng": "Condition",
	  "fre": "Condition",
	  "cze": "Podmùnka"
	},
	"OK": {
	  "cat": "Acceptar",
	  "spa": "Aceptar",
	  "eng": " OK ",
	  "fre": "Accepter",
	  "cze": " OK "
	},
	"Cancel": {
	  "cat": "Cancelùlar",
	  "spa": "Cancelar",
	  "eng": "Cancel",
	  "fre": "Annuler",
	  "cze": "Zruùit"
	},
	"Apply": {
	  "cat": "Aplicar",
	  "spa": "Aplicar",
	  "eng": "Apply",
	  "fre": "Appliquer",
	  "cze": "Pouùùt"
	},
	"Presentation": {
	  "cat": "Presentaciù",
	  "spa": "Presentaciùn",
	  "eng": "Presentation",
	  "fre": "Prùsentation",
	  "cze": "Prezentace"
	},
	"Graphical": {
	  "cat": "Grùfica",
	  "spa": "Grùfica",
	  "eng": "Graphical",
	  "fre": "Graphique",
	  "cze": "Grafickù"
	},
	"Textual": {
	  "cat": "Textual",
	  "spa": "Textual",
	  "eng": "Textual",
	  "fre": "Textuelle",
	  "cze": "Textovù"
	},
	"Unsorted": {
	  "cat": "Cap",
	  "spa": "Ninguno",
	  "eng": "Unsorted",
	  "fre": "Non triù",
	  "cze": "Netrùdenù"
	},
	"ColorPalette": {
	  "cat": "Paleta de colors",
	  "spa": "Paleta de colores",
	  "eng": "Color palette",
	  "fre": "Palette de couleurs",
	  "cze": "Paleta barev"
	},
	"Colors": {
	  "cat": "Colors",
	  "spa": "Colores",
	  "eng": "Colors",
	  "fre": "Couleurs",
	  "cze": "Barvy"
	},
	"Current": {
	  "cat": "Actual",
	  "spa": "Actual",
	  "eng": "Current",
	  "fre": "Actuel",
	  "cze": "Aktuùlnù"
	},
	"Previous": {
	  "cat": "Prùvia",
	  "spa": "Previa",
	  "eng": "Previous",
	  "fre": "Prùcùdente",
	  "cze": "Predchozù"
	},
	"View": {
	  "cat": "Vista",
	  "spa": "Vista",
	  "eng": "View",
	  "fre": "Vue",
	  "cze": "Zobrazit"
	},
	"Width": {
	  "cat": "Ample",
	  "spa": "Ancho",
	  "eng": "Width",
	  "fre": "Largeur",
	  "cze": "ùùrka"
	},
	"Height": {
	  "cat": "Alt",
	  "spa": "Alto",
	  "eng": "Height",
	  "fre": "Hauteur",
	  "cze": "Vùùka"
	},
	"LayerName": {
	  "cat": "Nom de la capa",
	  "spa": "Nombre de la capa",
	  "eng": "Name of the layer",
	  "fre": "Nom de la couche",
	  "cze": "Nùzev vrstvy"
	},
	"ModalClass": {
	  "cat": "Classe modal",
	  "spa": "Clase modal",
	  "eng": "Modal class",
	  "fre": "Classe modale",
	  "cze": "Modùlnù trùda"
	},
	"PercentageMode": {
	  "cat": "Percentatge de la moda",
	  "spa": "Porcentaje de la moda",
	  "eng": "Percentage of the mode",
	  "fre": "Pourcentage de mode",
	  "cze": "Procento reùimu"
	},
	"Sum": {
	  "cat": "Suma",
	  "spa": "Suma",
	  "eng": "Sum",
	  "fre": "Somme",
	  "cze": "Soucet"
	},
	"SumArea": {
	  "cat": "Suma ùrea",
	  "spa": "Suma ùrea",
	  "eng": "Sum area",
	  "fre": "Somme area",
	  "cze": "Soucet plochy"
	},
	"Mean": {
	  "cat": "Mitjana",
	  "spa": "Media",
	  "eng": "Mean",
	  "fre": "Moyenne",
	  "cze": "Prumer"
	},
	"Variance": {
	  "cat": "Varianùa",
	  "spa": "Varianza",
	  "eng": "Variance",
	  "fre": "Variance",
	  "cze": "Rozptyl"
	},
	"StandardDeviation": {
	  "cat": "Desviaciù estùndard",
	  "spa": "Desviaciù estùndar",
	  "eng": "Standard deviation",
	  "fre": "ùcart-type",
	  "cze": "Smerodatnù odchylka"
	},
	"Mode": {
	  "cat": "Moda",
	  "spa": "Moda",
	  "eng": "Mode",
	  "fre": "Mode",
	  "cze": "Mùd"
	},
	"Minimum": {
	  "cat": "Mùnim",
	  "spa": "Mùnimo",
	  "eng": "Minimum",
	  "fre": "Minimum",
	  "cze": "Minimum"
	},
	"Maximum": {
	  "cat": "Mùxim",
	  "spa": "Mùximo",
	  "eng": "Maximum",
	  "fre": "Maximum",
	  "cze": "Maximum"
	},
	"Range": {
	  "cat": "Rang",
	  "spa": "Rango",
	  "eng": "Range",
	  "fre": "Gamme",
	  "cze": "Rozsah"
	},
	"SortingOrder": {
	  "cat": "Ordre",
	  "spa": "Orden",
	  "eng": "Sorting order",
	  "fre": "Ordre de tri",
	  "cze": "Radit podle"
	},
	"Others": {
	  "cat": "Altres",
	  "spa": "Otros",
	  "eng": "Others",
	  "fre": "Autres",
	  "cze": "Ostatnù"
	},
	"Link": {
	  "cat": "Enllaù",
	  "spa": "Enlace",
	  "eng": "Link",
	  "fre": "Relier",
	  "cze": "Odkaz"
	},
	"Point": {
	  "cat": "Punt",
	  "spa": "Punto",
	  "eng": "Point",
	  "fre": "Point",
	  "cze": "Bod"
	},
	"Query": {
	  "cat": "Consulta",
	  "spa": "Consulta",
	  "eng": "Query",
	  "fre": "Recherche",
	  "cze": "Dotaz"
	},
	"QueryByLocation": {
	  "cat": "Consulta per localitzaciù",
	  "spa": "Consulta por localizaciùn",
	  "eng": "Query by location",
	  "fre": "Requùte par emplacement",
	  "cze": "Dotaz podle lokality"
	},
	"Options": {
	  "cat": "Opcions",
	  "spa": "Opciones",
	  "eng": "Options",
	  "fre": "Options",
	  "cze": "Moùnosti"
	},
	"Select": {
	  "cat": "Seleccionar",
	  "spa": "Seleccionar",
	  "eng": "Select",
	  "fre": "Sùlectionner",
	  "cze": "Vyberte"
	},
	"pleaseWait": {
	  "cat": "espereu",
	  "spa": "espere",
	  "eng": "please wait",
	  "fre": "attendez",
	  "cze": "pockejte prosùm"
	},
	"PleaseWait": {
	  "cat": "Espereu si us plau",
	  "spa": "Espere por favor",
	  "eng": "Please, wait",
	  "fre": "Attendez, s'il-vous-plaùt",
	  "cze": "Prosùm, pockejte"
	},
	"DateTime": {
	  "cat": "Data i hora",
	  "spa": "Fecha y hora",
	  "eng": "Date and time",
	  "fre": "Date et l'heure",
	  "cze": "Datum a cas"
	},
	"Next": {
	  "cat": "Segùent",
	  "spa": "Siguiente",
	  "eng": "Next",
	  "fre": "Suivant",
	  "cze": "Dalùù"
	},
	"Format": {
	  "cat": "Format",
	  "spa": "Formato",
	  "eng": "Format",
	  "fre": "Format",
	  "cze": "Formùt"
	},
	"Download": {
	  "cat": "Descarregar",
	  "spa": "Descargar",
	  "eng": "Download",
	  "fre": "Tùlùcharger",
	  "cze": "Stùhnout"
	},
	"of": {
	  "cat": "de",
	  "spa": "de",
	  "eng": "of",
	  "fre": "de",
	  "cze": "z"
	},
	"Time": {
	  "cat": "Hora",
	  "spa": "Hora",
	  "eng": "Time",
	  "fre": "L'heure",
	  "cze": "Cas"
	},
	"Option": {
	  "cat": "Opciù",
	  "spa": "Opiciùn",
	  "eng": "Option",
	  "fre": "Option",
	  "cze": "Moùnost"
	},
	"Status": {
	  "cat": "Estat",
	  "spa": "Estado",
	  "eng": "Status",
	  "fre": "Statut",
	  "cze": "Stav"
	},
	"tabSeparatedText": {
	  "cat": "text separat per tabulacions",
	  "spa": "texto separado por tabulaciones",
	  "eng": "tab-separated text",
	  "fre": "texte sùparù par des tabulations",
	  "cze": "text oddelenù tabulùtorem"
	},
	"Style": {
	  "cat": "Estil",
	  "spa": "Estilo",
	  "eng": "Style",
	  "fre": "Style",
	  "cze": "Styl"
	},
	"Count": {
	  "cat": "Recompte",
	  "spa": "Cuenta",
	  "eng": "Count",
	  "fre": "Compter",
	  "cze": "Pocet"
	},
	"Area": {
	  "cat": "ùrea",
	  "spa": "ùrea",
	  "eng": "Area",
	  "fre": "Zone",
	  "cze": "Oblast"
	},
	"NoData": {
	  "cat": "Sense dades",
	  "spa": "Sin datos",
	  "eng": "No data",
	  "fre": "Pas de donnùes",
	  "cze": "ùùdnù ùdaje"
	},
	"Class": {
	  "cat": "Classe",
	  "spa": "Clase",
	  "eng": "Class",
	  "fre": "Classe",
	  "cze": "Trùda"
	},
	"All": {
	  "cat": "Totes",
	  "spa": "Todas",
	  "eng": "All",
	  "fre": "Toutes",
	  "cze": "Vùechny"
	},
	"Dynamic": {
	  "cat": "Dinùmic",
	  "spa": "Dinùmico",
	  "eng": "Dynamic",
	  "fre": "Dynamique",
	  "cze": "Dynamickù"
	},
	"Disabled": {
	  "cat": "Desactivat)",
	  "spa": "Desactivado",
	  "eng": "Disabled",
	  "fre": "Dùsactivù",
	  "cze": "Vypnuto"
	},
	"layerOrStyleNotVisible": {
	  "cat": "capa o estil no visible",
	  "spa": "capa o estil no visible",
	  "eng": "layer or style not visible",
	  "fre": "couche or style non visible",
	  "cze": "vrstva nebo styl nenù viditelnù"
	},
	"Statistics": {
	  "cat": "Estadùstics",
	  "spa": "Estadùsticos",
	  "eng": "Statistics",
	  "fre": "Statistique",
	  "cze": "Statistiky"
	},
	"Statistic": {
	  "cat": "Estadùstic",
	  "spa": "Estadùstico",
	  "eng": "Statistic",
	  "fre": "Statistique",
	  "cze": "Statistika"
	},
	"ContingencyTable": {
	  "cat": "Taula de contingùncia",
	  "spa": "Tabla de contingencia",
	  "eng": "Contingency table",
	  "fre": "Tableau de contingence",
	  "cze": "Kontingencnù tabulka"
	},
	"Columns": {
	  "cat": "Columnes",
	  "spa": "Columnas",
	  "eng": "Columns",
	  "fre": "Colonnes",
	  "cze": "Sloupce"
	},
	"columns": {
	  "cat": "columnes",
	  "spa": "columnas",
	  "eng": "columns",
	  "fre": "colonnes",
	  "cze": "sloupce"
	},
	"Rows": {
	  "cat": "Files",
	  "spa": "Filas",
	  "eng": "Rows",
	  "fre": "Lignes",
	  "cze": "Rùdky"
	},
	"rows": {
	  "cat": "files",
	  "spa": "filas",
	  "eng": "rows",
	  "fre": "lignes",
	  "cze": "rùdky"
	},
	"name": {
	  "cat": "nom",
	  "spa": "nombre",
	  "eng": "name",
	  "fre": "nom",
	  "cze": "nùzev"
	},
	"Name": {
	  "cat": "Nom",
	  "spa": "Nombre",
	  "eng": "Name",
	  "fre": "Nom",
	  "cze": "Nùzev"
	},
	"Band": {
	  "cat": "Banda",
	  "spa": "Banda",
	  "eng": "Band",
	  "fre": "Bande",
	  "cze": "Pùsmo"
	},
	"Measure": {
	  "cat": "Mesura",
	  "spa": "Medida",
	  "eng": "Measure",
	  "fre": "Mesure",
	  "cze": "Opatrenù"
	},
	"copy": {
	  "cat": "copiar",
	  "spa": "copiar",
	  "eng": "copy",
	  "fre": "copier",
	  "cze": "kopùrovat"
	},
	"help": {
	  "cat": "ajuda",
	  "spa": "ayuda",
	  "eng": "help",
	  "fre": "aider",
	  "cze": "nùpoveda"
	},
	"InteractiveHelp": {
	  "cat": "Ajuda interactiva",
	  "spa": "Ayuda interactiva",
	  "eng": "Interactive help",
	  "fre": "Aide intùractive",
	  "cze": "Interaktivnù nùpoveda"
	},
	"popDown": {
	  "cat": "incrustar",
	  "spa": "incrustar",
	  "eng": "pop down",
	  "fre": "incruster",
	  "cze": "vyskakovacù okno - dolu"
	},
	"popUp": {
	  "cat": "desincrustar",
	  "spa": "desincrustar",
	  "eng": "pop up",
	  "fre": "desincruster",
	  "cze": "vyskakovacù okno - nahoru"
	},
	"KappaCoef": {
	  "cat": "Index Kappa",
	  "spa": "Indice Kappa",
	  "eng": "Kappa coefficient",
	  "fre": "Coefficient kappa",
	  "cze": "Koeficient kappa"
	},
	"none": {
	  "cat": "cap",
	  "spa": "ninguno",
	  "eng": "none",
	  "fre": "aucun",
	  "cze": "ùùdnù"
	},
	"and": {
	  "cat": "i",
	  "spa": "y",
	  "eng": "and",
	  "fre": "et",
	  "cze": "a"
	},
	"or": {
	  "cat": "o",
	  "spa": "o",
	  "eng": "or",
	  "fre": "ou",
	  "cze": "nebo"
	},
	"Working": {
	  "cat": "Processant",
	  "spa": "Procesando",
	  "eng": "Working",
	  "fre": "En traitement",
	  "cze": "Pracovnù"
	},
	"Source": {
	  "cat": "Font",
	  "spa": "Fuente",
	  "eng": "Source",
	  "fre": "Source",
	  "cze": "Zdroj"
	},
	"Agent": {
	  "cat": "Agent",
	  "spa": "Agente",
	  "eng": "Agent",
	  "fre": "Agent",
	  "cze": "Agent"
	},
	"Agents": {
	  "cat": "Agents",
	  "spa": "Agentes",
	  "eng": "Agents",
	  "fre": "Agents",
	  "cze": "Agenti"
	},
	"Executable": {
	  "cat": "Executable",
	  "spa": "Ejecutable",
	  "eng": "Executable",
	  "fre": "Exùcutable",
	  "cze": "Spustitelnù"
	},
	"compilationDate": {
	  "cat": "data de compilaciù",
	  "spa": "fecha de compilaciùn",
	  "eng": "compilation date",
	  "fre": "date de compilation",
	  "cze": "datum kompilace"
	},
	"CompilationDate": {
	  "cat": "Data de compilaciù",
	  "spa": "Fecha de compilaciùn",
	  "eng": "Compilation date",
	  "fre": "Date de compilation",
	  "cze": "Datum kompilace"
	},
	"Algorithm": {
	  "cat": "Algorisme",
	  "spa": "Algoritmo",
	  "eng": "Algorithm",
	  "fre": "Algorithme",
	  "cze": "Algoritmus"
	},
	"Algorithms": {
	  "cat": "Algorismes",
	  "spa": "Algoritmos",
	  "eng": "Algorithms",
	  "fre": "Algorithmes",
	  "cze": "Algoritmy"
	},
	"Functionality": {
	  "cat": "Funcionalitat",
	  "spa": "Funcionalidad",
	  "eng": "Functionality",
	  "fre": "Fonctionnalitù",
	  "cze": "Funkcnost"
	},
	"Functionalities": {
	  "cat": "Funcionalitats",
	  "spa": "Funcionalidades",
	  "eng": "Functionalities",
	  "fre": "Fonctionnalitùs",
	  "cze": "Funkce"
	},
	"Step": {
	  "cat": "Pas",
	  "spa": "Paso",
	  "eng": "Step",
	  "fre": "ùtape",
	  "cze": "Krok"
	},
	"role": {
	  "cat": "paper",
	  "spa": "papel",
	  "eng": "role",
	  "fre": "rùle",
	  "cze": "role"
	},
	"reference": {
	  "cat": "referùncia",
	  "spa": "referencia",
	  "eng": "reference",
	  "fre": "rùfùrence",
	  "cze": "odkaz"
	},
	"description": {
	  "cat": "descripciù",
	  "spa": "descripciùn",
	  "eng": "description",
	  "fre": "description",
	  "cze": "popis"
	},
	"Description": {
	  "cat": "Descripciù",
	  "spa": "Descripciùn",
	  "eng": "Description",
	  "fre": "Descriptif",
	  "cze": "Popis"
	},
	"purpose": {
	  "cat": "propùsit",
	  "spa": "propùsito",
	  "eng": "purpose",
	  "fre": "raison",
	  "cze": "ùcel"
	},
	"Start": {
	  "cat": "Inici ",
	  "spa": "Inicio",
	  "eng": "Start",
	  "fre": "Dùpart",
	  "cze": "Start"
	},
	"Type": {
	  "cat": "Tipus ",
	  "spa": "Tipo",
	  "eng": "Type",
	  "fre": "Type",
	  "cze": "Typ"
	},
	"Attribute": {
	  "cat": "Atribut: ",
	  "spa": "Atributo:",
	  "eng": "Attribute:",
	  "fre": "Attribut:",
	  "cze": "Atribut:"
	},
	"TheProperty": {
	  "cat": "La propietat",
	  "spa": "La propiedad",
	  "eng": "The property",
	  "fre": "La propriùtù",
	  "cze": "Vlastnost"
	},
	"End": {
	  "cat": "Fi",
	  "spa": "Fin",
	  "eng": "End",
	  "fre": "But",
	  "cze": "Konec"
	},
	"mustBe": {
	  "cat": "ha de ser",
	  "spa": "debe ser",
	  "eng": "must be",
	  "fre": "doit ùtre",
	  "cze": "musù bùt"
	},
	"YouMayContinue": {
	  "cat": "Es deixa continuar",
	  "spa": "Se deja continuar",
	  "eng": "You may continue",
	  "fre": "Il est permis de continuer",
	  "cze": "Muùete pokracovat"
	},
	"approx": {
	  "cat": "aprox",
	  "spa": "aprox",
	  "eng": "approx",
	  "fre": "approx",
	  "cze": "pribliùne"
	},
	"atLat": {
	  "cat": "a lat",
	  "spa": "a lat",
	  "eng": "at lat",
	  "fre": "ù lat",
	  "cze": "na late"
	},
	"automatic": {
	  "cat": "automùtic",
	  "spa": "automùtico",
	  "eng": "automatic",
	  "fre": "automatique",
	  "cze": "automatickù"
	},
	"indicatedAt": {
	  "cat": "indicada a",
	  "spa": "indicada en",
	  "eng": "indicated at",
	  "fre": "indiquùe ù",
	  "cze": "uvedeno na"
	},
	"cannotBeActivated": {
	  "cat": "no pot ser activada",
	  "spa": "no puede ser activada",
	  "eng": "cannot be activated",
	  "fre": "ne peut pas ùtre activùe",
	  "cze": "nelze aktivovat"
	},
	"CannotFindStyle": {
	  "cat": "No trobo l'estil",
	  "spa": "No encuentro el estilo",
	  "eng": "Cannot find style",
	  "fre": "Impossible trouver le style",
	  "cze": "Nelze najùt styl"
	},
	"ForLayer": {
	  "cat": "per a la capa",
	  "spa": "para la capa",
	  "eng": "for the layer",
	  "fre": "pour cette couche",
	  "cze": "pro vrstvu"
	},
	"CannotFindLayer": {
	  "cat": "No trobo la capa",
	  "spa": "No encuentro la capa",
	  "eng": "Cannot find layer",
	  "fre": "Impossible trouver la couche",
	  "cze": "Nelze najùt vrstvu"
	},
	"request": {
	  "cat": "peticiù",
	  "spa": "peticiùn",
	  "eng": "request",
	  "fre": "demande",
	  "cze": "poùadavek"
	},
	"Request": {
	  "cat": "Peticiù",
	  "spa": "Peticiùn",
	  "eng": "Request",
	  "fre": "Demande",
	  "cze": "Poùadavek"
	},
	"unknown": {
	  "cat": "desconeguda",
	  "spa": "desconocida",
	  "eng": "unknown",
	  "fre": "inconnu",
	  "cze": "neznùmù"
	},
	"IncompleteTag": {
	  "cat": "Etiqueta incomplerta",
	  "spa": "Etiqueta incompleta",
	  "eng": "Incomplete tag",
	  "fre": "ùtiquette incomplùte",
	  "cze": "Neùplnù znacka"
	},
	"MissingAttribute": {
	  "cat": "Manca atribut",
	  "spa": "Falta atributo",
	  "eng": "Missing attribute",
	  "fre": "Manque attribut",
	  "cze": "Chybejùcù atribut"
	},
	"MissingMandatoryTag": {
	  "cat": "Manca etiqueta obligatùria",
	  "spa": "Falta etiqueta obligatoria",
	  "eng": "Missing mandatory tag",
	  "fre": "Manque ùtiquette obligatorire",
	  "cze": "Chybejùcù povinnù znacka"
	},
	"missingMandatoryNestedTags": {
	  "cat": "manquen etiquetes anidades obligatùries",
	  "spa": "falten etiquetas anidadas obligatorias",
	  "eng": "missing mandatory nested tags",
	  "fre": "des ùtiquettes nichùes obligatoires manquantes",
	  "cze": "chybejùcù povinnù vloùenù znacky"
	},
	"Authorship": {
	  "cat": "Autoria",
	  "spa": "Autorùa",
	  "eng": "Authorship",
	  "fre": "Paternitù",
	  "cze": "Autorstvù"
	},
	"Publisher": {
	  "cat": "Editor",
	  "spa": "Editor",
	  "eng": "Publisher",
	  "fre": "ùditeur",
	  "cze": "Vydavatel"
	},
	"Generated": {
	  "cat": "Generar",
	  "spa": "Generar",
	  "eng": "Generate",
	  "fre": "Gùnùrer",
	  "cze": "Generovat"
	},
	"GeneratedBy": {
	  "cat": "Generat amb",
	  "spa": "Generado con",
	  "eng": "Generated by",
	  "fre": "Gùnùrù par",
	  "cze": "Vygenerovùno podle"
	},
	"Boundaries": {
	  "cat": "ùmbit",
	  "spa": "ùmbito",
	  "eng": "Boundaries",
	  "fre": "Champ",
	  "cze": "Hranice"
	},
	"TimeResolution": {
	  "cat": "Interval de temps",
	  "spa": "Intùrvalo de tiempo",
	  "eng": "Time resolution",
	  "fre": "Rùsolution temporelle",
	  "cze": "Casovù rozliùenù"
	},
	"UpdateDate": {
	  "cat": "Data d'actualitzaciù",
	  "spa": "Fecha de actualizaciùn",
	  "eng": "Update date",
	  "fre": "Date de mise ù jour",
	  "cze": "Datum aktualizace"
	},
	"CreatorApplication": {
	  "cat": "Creat amb",
	  "spa": "Creado con",
	  "eng": "Creator application",
	  "fre": "Crùù avec",
	  "cze": "Aplikace tvurce"
	},
	"Rights": {
	  "cat": "Drets",
	  "spa": "Derechos",
	  "eng": "Rights",
	  "fre": "Droits",
	  "cze": "Prùva"
	},
	"GeospatialExtent": {
	  "cat": "Extensiù geoespacial",
	  "spa": "Extensiùn geoespacial",
	  "eng": "Geospatial extent",
	  "fre": "Extension gùospatiale",
	  "cze": "Geoprostorovù rozsah"
	},
	"TemporalExtent": {
	  "cat": "Extensiù temporal",
	  "spa": "Extensiùn temporal",
	  "eng": "Temporal extent",
	  "fre": "Extension temporelle",
	  "cze": "Casovù rozsah"
	},
	"Preview": {
	  "cat": "Previsualitzaciù",
	  "spa": "Previsualizaciùn",
	  "eng": "Preview",
	  "fre": "Aperùu",
	  "cze": "Nùhled"
	},
	"ContentDescription": {
	  "cat": "Descripciù del contingut",
	  "spa": "Descripciùn del contenido",
	  "eng": "Content description",
	  "fre": "Description du contenu",
	  "cze": "Popis obsahu"
	},
	"ContentReference": {
	  "cat": "Referùncia al contingut",
	  "spa": "Referencia al contenido",
	  "eng": "Content by reference",
	  "fre": "Contenu par rùfùrence",
	  "cze": "Obsah podle odkazu"
	},
	"SourceMetadata": {
	  "cat": "Metadades de la font",
	  "spa": "Metadatos de la fuente",
	  "eng": "Source metadata",
	  "fre": "Mùtadùnnùes de source",
	  "cze": "Zdrojovù metadata"
	},
	"MinimumDisplayScale": {
	  "cat": "Escala mùnima de visualitzaciù",
	  "spa": "Escala mùnima de visualizaciùn",
	  "eng": "Minimum display scale",
	  "fre": "ùchelle d'affichage minimale",
	  "cze": "Minimùlnù merùtko zobrazenù"
	},
	"MaximumDisplayScale": {
	  "cat": "Escala mùxima de visualitzaciù",
	  "spa": "Escala mùxima de visualizaciùn",
	  "eng": "Maximum display scale",
	  "fre": "ùchelle d'affichage maximale",
	  "cze": "Maximùlnù merùtko zobrazenù"
	},
	"Offering": {
	  "cat": "Oferta de servei ('offering')",
	  "spa": "Oferta de servicio ('offering')",
	  "eng": "Offering",
	  "fre": "Offre de services ('offering')",
	  "cze": "Nabùzejùcù"
	},
	"LayerActiveAndVisible": {
	  "cat": "La capa estarù activa i visible",
	  "spa": "La capa estarù activa y visible",
	  "eng": "Layer will be active and visible",
	  "fre": "La couche sera active et visible",
	  "cze": "Vrstva bude aktivnù a viditelnù"
	},
	"LayerNotVisible": {
	  "cat": "La capa no estarù visible",
	  "spa": "La capa no estarù visible",
	  "eng": "Layer will be not visible",
	  "fre": "La couche ne sera pas visible",
	  "cze": "Vrstva nebude viditelnù"
	},
	"LayersOnView": {
	  "cat": "Capes de la vista",
	  "spa": "Capas de la vista",
	  "eng": "Layers on this view",
	  "fre": "Couches sur ce point de vue",
	  "cze": "Vrstvy v tomto zobrazenù"
	},
	"AddToView": {
	  "cat": "Afegir a vista",
	  "spa": "Aùadir a vista",
	  "eng": "Add to view",
	  "fre": "Ajoutez ù la vue",
	  "cze": "Pridat do zobrazenù"
	},
	"AddSelectedLayersCurrentVisu": {
	  "cat": "Afegeix les capes seleccionades a la visualitzaciù actual",
	  "spa": "Aùade las capas seleccionadas a la visualizaciùn actual",
	  "eng": "Add the selected layers to the current visualization",
	  "fre": "Ajoutez les couches choisies ù la visualisation actuelle",
	  "cze": "Pridùnù vybranùch vrstev do "
	},
	"CloseViewOpen": {
	  "cat": "Tancar vista i obrir",
	  "spa": "Cerrar vista y abrir",
	  "eng": "Close view and open",
	  "fre": "Fermer la vue et ovrir",
	  "cze": "Zavrùt zobrazenù a otevrùt"
	},
	"CloseOpenNewSelectedLayers": {
	  "cat": "Tanca la visualitzaciù actual i obra una nova amb les capes seleccionades",
	  "spa": "Cierra la visualizaciùn actual y abre una nueva con las capas seleccionadas",
	  "eng": "Close the current visualization and open a new one with the selected layers",
	  "fre": "Fermez la visualisation en cours et ouvrez une nouvelle avec les couches choisies",
	  "cze": "Zavrùt aktuùlnù vizualizaci a otevrùt "
	},
	"DocumentLanguage": {
	  "cat": "Idioma del document",
	  "spa": "Idioma del documento",
	  "eng": "Document language",
	  "fre": "Langue du document",
	  "cze": "Jazyk dokumentu"
	},
	"Author": {
	  "cat": "Autor",
	  "spa": "Autor",
	  "eng": "Author",
	  "fre": "Auteur",
	  "cze": "Autor"
	},
	"MandatoryField": {
	  "cat": "Camp obligatori",
	  "spa": "Campo obligatorio",
	  "eng": "Mandatory field",
	  "fre": "Champ obligatoire",
	  "cze": "Povinnù pole"
	},
	"NotHaveOffering": {
	  "cat": "no tù cap 'offering'",
	  "spa": "no tiene ningùn 'offering'",
	  "eng": "do not have any offering",
	  "fre": "n'a pas 'offering'",
	  "cze": "nemajù ùùdnou nabùdku"
	},
	"moreInfo": {
	  "cat": "mùs info",
	  "spa": "mùs info",
	  "eng": "more info",
	  "fre": "plus d'info",
	  "cze": "vùce informacù"
	},
	"ThereAre": {
	  "cat": "Hi ha",
	  "spa": "Hay",
	  "eng": "There are",
	  "fre": "Il y a",
	  "cze": "Tam jsou"
	},
	"WrongAttributeName": {
	  "cat": "Nom d'atribut incorrecte",
	  "spa": "Nombre de atributo incorrecto",
	  "eng": "Wrong attribute name",
	  "fre": "Nom d'attribut incorrect",
	  "cze": "ùpatnù nùzev atributu"
	},
	"MustSelectField": {
	  "cat": "Cal seleccionar un camp",
	  "spa": "Debe seleccionar un campo",
	  "eng": "You must select a field",
	  "fre": "Vous devez sùlectionner un champ",
	  "cze": "Musùte vybrat pole"
	},
	"empty": {
	  "cat": "buit",
	  "spa": "vacio",
	  "eng": "empty",
	  "fre": "vide",
	  "cze": "prùzdnù"
	},
	"separatedBy": {
	  "cat": "separats per",
	  "spa": "separados por",
	  "eng": "separated by",
	  "fre": "sùparùes par",
	  "cze": "oddelenù podle"
	},
	"TemporalField": {
	  "cat": "Camp temporal",
	  "spa": "Campo temporal",
	  "eng": "Temporal field",
	  "fre": "Temporal Champ",
	  "cze": "Casovù pole"
	},
	"byBoundingBox": {
	  "cat": "per envolupant",
	  "spa": "por envolvente",
	  "eng": "by bounding box",
	  "fre": "par enveloppe",
	  "cze": "ohranicujùcùm polem"
	},
	"Compute": {
	  "cat": "Calcular",
	  "spa": "Calcular",
	  "eng": "Compute",
	  "fre": "Calculer",
	  "cze": "Vùpocùtat"
	},
	"resize": {
	  "cat": "redimensionar",
	  "spa": "redimensionar",
	  "eng": "resize",
	  "fre": "redimensionner",
	  "cze": "zmena velikosti"
	},
	"symbolizeLayer": {
	  "cat": "per simbolitzar la capa",
	  "spa": "para simbolizar la capa",
	  "eng": "to symbolize the layer",
	  "fre": "por symboliser la couche",
	  "cze": "symbolizovat vrstvu"
	},
	"UnsuppServiceType": {
	  "cat": "Tipus de servei suportat",
	  "spa": "Tipo de servicio no suportado",
	  "eng": "Unsupported service type",
	  "fre": "Type de service non supportùe",
	  "cze": "Nepodporovanù typ sluùby"
	},
	"toTheStart": {
	  "cat": "al inici",
	  "spa": "al inicio",
	  "eng": "to the start",
	  "fre": "au dùbut",
	  "cze": "na zacùtek"
	},
	"stepBack": {
	  "cat": "retrocedir un",
	  "spa": "retroceder una",
	  "eng": "step back",
	  "fre": "revenir un",
	  "cze": "krok zpet"
	},
	"pause": {
	  "cat": "pausa",
	  "spa": "pausa",
	  "eng": "pause",
	  "fre": "pause",
	  "cze": "pauza"
	},
	"play": {
	  "cat": "reproduir",
	  "spa": "reproducir",
	  "eng": "play",
	  "fre": "reproduire",
	  "cze": "prehrùt"
	},
	"repeatedlyPlay": {
	  "cat": "reproduir repetitivament",
	  "spa": "reproducir repetitùvamente",
	  "eng": "repeatedly play",
	  "fre": "reproduire ù plusieurs reprises",
	  "cze": "opakovane prehrùvat"
	},
	"stepForward": {
	  "cat": "avanùar un",
	  "spa": "avanzar una",
	  "eng": "step forward",
	  "fre": "avancer un",
	  "cze": "krok vpred"
	},
	"toTheEnd": {
	  "cat": "al final",
	  "spa": "al final",
	  "eng": "to the end",
	  "fre": "ù la fin",
	  "cze": "aù do konce"
	},
	"SpeedyBy": {
	  "cat": "Rapidesa per",
	  "spa": "Rapidez por",
	  "eng": "Speed by",
	  "fre": "Vitesse pour",
	  "cze": "Rychlost podle"
	},
	"StartDate": {
	  "cat": "Data inicial",
	  "spa": "Fecha inicial",
	  "eng": "Start date",
	  "fre": "Date de dùbut",
	  "cze": "Datum zahùjenù"
	},
	"EndDate": {
	  "cat": "Data final",
	  "spa": "Fecha final",
	  "eng": "End date",
	  "fre": "Date de fin",
	  "cze": "Datum konce"
	},
	"Load": {
	  "cat": "Carregar",
	  "spa": "Cargar",
	  "eng": "Load",
	  "fre": "Charge",
	  "cze": "Nacùst"
	},
	"Loading": {
	  "cat": "Carregant",
	  "spa": "Cargando",
	  "eng": "Loading",
	  "fre": "Chargement",
	  "cze": "Nacùtùnù"
	},
	"WrongFormat": {
	  "cat": "Format incorrecte",
	  "spa": "Formato incorrecto",
	  "eng": "Wrong format",
	  "fre": "Format incorrect",
	  "cze": "ùpatnù formùt"
	},
	"TryAgain": {
	  "cat": "Torna-ho a intentar",
	  "spa": "Vuùlvalo a intentar",
	  "eng": "Try again",
	  "fre": "Rùessayez",
	  "cze": "Zkuste to znovu"
	},
	"SendingFile": {
	  "cat": "Enviant fitxer",
	  "spa": "Enviando fichero",
	  "eng": "Sending file",
	  "fre": "Fichier en cours dùenvoi",
	  "cze": "Odesùlùnù souboru"
	},
	"Predefined": {
	  "cat": "Predefinit",
	  "spa": "Predefinido",
	  "eng": "Predefined",
	  "fre": "Prùdùfinie",
	  "cze": "Preddefinovanù"
	},
	"Local": {
	  "cat": "Local",
	  "spa": "Local",
	  "eng": "Local",
	  "fre": "Local",
	  "cze": "Mùstnù"
	},
	"ChangeFile": {
	  "cat": "Canviar el fitxer",
	  "spa": "Cambiar el fichero",
	  "eng": "Change a file",
	  "fre": "Changer le fichier",
	  "cze": "Zmenit soubor"
	},
	"Send": {
	  "cat": "Enviar",
	  "spa": "Enviar",
	  "eng": "Send",
	  "fre": "Envoyer",
	  "cze": "Odeslat"
	},
	"Url": {
	  "cat": "URL",
	  "spa": "URL",
	  "eng": "URL",
	  "fre": "URL",
	  "cze": "URL"
	},
	"OutputParameter": {
	  "cat": "Parùmetres de sortida",
	  "spa": "Parùmetros de salida",
	  "eng": "Output parameters",
	  "fre": "Paramùtres de sortie",
	  "cze": "Vùstupnù parametry"
	},
	"Execute": {
	  "cat": "Executar",
	  "spa": "Ejecutar",
	  "eng": "Execute",
	  "fre": "Exùcuter",
	  "cze": "Spustit"
	},
	"UserConfiguration": {
	  "cat": "Configuraciù d'usuari",
	  "spa": "Configuraciùn de usuario",
	  "eng": "User configuration",
	  "fre": "Configuration de l'utilisateur",
	  "cze": "Konfigurace uùivatele"
	},
	"SelectConfigLoad": {
	  "cat": "Selecciona un fitxer de configuraciù a carregar",
	  "spa": "Selecciona un fichero de configuraciùn para cargar",
	  "eng": "Select a config file to load",
	  "fre": "Sùlectionnez un fichier de configuration ù charger",
	  "cze": "Vùber konfiguracnùho souboru k nactenù"
	},
	"FileName": {
	  "cat": "Nom del fitxer",
	  "spa": "Nombre del fichero",
	  "eng": "File name",
	  "fre": "Nom du fichier",
	  "cze": "Nùzev souboru"
	},
	"FileNameToSave": {
	  "cat": "Nom del fitxer a guardar",
	  "spa": "Nombre del fichero a guardar",
	  "eng": "File name to save",
	  "fre": "Nom du fichier ù sauvegarder",
	  "cze": "Nùzev souboru k uloùenù"
	},
	"WrongNumberElementsLine": {
	  "cat": "Nombre d'elements incorrecte a la lùnia",
	  "spa": "Nùmero de elementos incorrecto en la lùnea",
	  "eng": "Wrong number of elements in line",
	  "fre": "Wrong number of elements in line",
	  "cze": "ùpatnù pocet prvku v rùdku"
	},
	"WrongFormatInLine": {
	  "cat": "Format incorrecte a la lùnia",
	  "spa": "Formato incorrecto en la lùnea",
	  "eng": "Wrong values format in line",
	  "fre": "Mauvais format en ligne",
	  "cze": "ùpatnù formùt hodnot v rùdku"
	},
	"cntxmenu": {
	  "ShareLayer": {
		"cat": "Compartir capa",
		"spa": "Compartir capa",
		"eng": "Share layer",
		"fre": "Partager couche",
		"cze": "Sdùlenù vrstvy"
	  },
	  "RemoveLayer": {
		"cat": "Eliminar capa",
		"spa": "Eliminar capa",
		"eng": "Remove layer",
		"fre": "Effacer couche",
		"cze": "Odstranenù vrstvy"
	  },
	  "MoveLayer": {
		"cat": "Moure la capa",
		"spa": "Mover la capa",
		"eng": "Move layer",
		"fre": "Dùplacer la couche",
		"cze": "Presun vrstvy"
	  },
	  "ToTheTop": {
		"cat": "A sobre de tot",
		"spa": "Encima de todo",
		"eng": "To the top",
		"fre": "En haut de",
		"cze": "Na vrchol"
	  },
	  "Up": {
		"cat": "A sobre",
		"spa": "Encima",
		"eng": "Up",
		"fre": "Au-dessus",
		"cze": "Nahoru"
	  },
	  "Down": {
		"cat": "A sota",
		"spa": "Debajo",
		"eng": "Down",
		"fre": "Au-dessous",
		"cze": "Dolu"
	  },
	  "ToTheEnd": {
		"cat": "A sota de tot",
		"spa": "Debajo de todo",
		"eng": "To the end",
		"fre": "En bas",
		"cze": "Na konec"
	  },
	  "EditStyle": {
		"cat": "Edita estil",
		"spa": "Editar estilo",
		"eng": "Edit style",
		"fre": "Modifier le style",
		"cze": "Upravit styl"
	  },
	  "ofEditingStyle": {
		"cat": "de editar l'estil",
		"spa": "de editar el estilo",
		"eng": "of editing the style",
		"fre": "pour modifier le style",
		"cze": "ùpravy stylu"
	  },
	  "StyleName": {
		"cat": "Nom de l'estil",
		"spa": "Nombre del estilo",
		"eng": "Name of the style",
		"fre": "Nom du style",
		"cze": "Nùzev stylu"
	  },
	  "ConfusionMatrix": {
		"cat": "Matriu de confusiù",
		"spa": "Matriz de confusiùn",
		"eng": "Confusion matrix",
		"fre": "Matrice de confusion",
		"cze": "Matice zmatku"
	  },
	  "StatisticByCategory": {
		"cat": "Estadùstic per categoria",
		"spa": "Estadùstico por categoria",
		"eng": "Statistic by category",
		"fre": "Statistique par catùgorie",
		"cze": "Statistika podle kategorie"
	  },
	  "Statistic": {
		"cat": "Estadùstic",
		"spa": "Estadùstico",
		"eng": "Statistic",
		"fre": "Statistique",
		"cze": "Statistika"
	  },
	  "Surface": {
		"cat": "Superfùcie",
		"spa": "Superficie",
		"eng": "Surface",
		"fre": "Surface",
		"cze": "Povrch"
	  },
	  "RGBCombination": {
		"cat": "Combinaciù RGB",
		"spa": "Combinaciùn RGB",
		"eng": "RGB combination",
		"fre": "Combinaison RVB",
		"cze": "Kombinace RGB"
	  },
	  "Reclassification": {
		"cat": "Reclassificaciù",
		"spa": "Reclasificaciùn",
		"eng": "Reclassification",
		"fre": "Reclassement",
		"cze": "Reklasifikace"
	  },
	  "RetrieveStyles": {
		"cat": "Recupera estils",
		"spa": "Recupera estilos",
		"eng": "Retrieve styles",
		"fre": "Rùcupùrer les styles",
		"cze": "Vyhledùvat styly"
	  },
	  "ShareStyle": {
		"cat": "Compartir estil",
		"spa": "Compartir estilo",
		"eng": "Share style",
		"fre": "Partager style",
		"cze": "Sdùlet styl"
	  },
	  "DeleteStyle": {
		"cat": "Esborrar estil",
		"spa": "Borrar estilo",
		"eng": "Delete style",
		"fre": "Effacer style",
		"cze": "Odstranit styl"
	  },
	  "ComputeQuality": {
		"cat": "Calcula la qualitat",
		"spa": "Calcula la calidad",
		"eng": "Compute the quality",
		"fre": "Calculer la qualitù",
		"cze": "Vùpocet kvality"
	  },
	  "toComputeTheQuality": {
		"cat": "de calcular la qualitat",
		"spa": "de calcular la calidad",
		"eng": "to compute the quality",
		"fre": "pour calculer la qualitù",
		"cze": "vypocùtat kvalitu"
	  },
	  "NewLayerAdded": {
		"cat": "La nova capa afegida",
		"spa": "La nueva capa aùadida",
		"eng": "The new added layer",
		"fre": "La nouvelle couche ajoutùe",
		"cze": "Nove pridanù vrstva"
	  },
	  "ZoomToLayer": {
		"cat": "Zoom a capa",
		"spa": "Zoom a capa",
		"eng": "Zoom to layer",
		"fre": "Afficher en entier",
		"cze": "Priblùenù k vrstve"
	  },
	  "WhyNotVisible": {
		"cat": "Perquù no visible",
		"spa": "Porque no visible",
		"eng": "Why not visible",
		"fre": "Pourquoi pas visible",
		"cze": "Proc nenù videt"
	  },
	  "notVisibleInCurrentZoom": {
		"cat": "no ùs visible al nivell de zoom actual del navegador",
		"spa": "no es visible al nivel de zoom actual del navegador",
		"eng": "is not visible in the current zoom level of the browser",
		"fre": "n'est pas visible au niveau du zoom actuel du navigateur",
		"cze": "nenù viditelnù v aktuùlnù ùrovni "
	  },
	  "notVisibleInCurrentCRS": {
		"cat": "no ùs visible amb el CRS actual",
		"spa": "no es visible en el CRS actual",
		"eng": "is not visible in the current CRS",
		"fre": "n'est pas visible au CRS actuel",
		"cze": "nenù viditelnù v aktuùlnùm CRS"
	  },
	  "notVisibleInCurrentView": {
		"cat": "no ùs visible en ùmbit actual de la vista",
		"spa": "no es visible en el ùmbito actual de la vista",
		"eng": "is not visible in the current view extent",
		"fre": "n'est pas visible dans l'ùtendue de la vue actuelle",
		"cze": "nenù viditelnù v aktuùlnùm rozsahu "
	  },
	  "OnlyVisibleInTheFollowCRS": {
		"cat": "Nomùs ùs visible en els segùents CRSs",
		"spa": "Solo es visible en los seguientes CRSs:",
		"eng": "It is only visible in the following CRSs",
		"fre": "Il n'est visible que dans les CRS suivants",
		"cze": "Je viditelnù pouze v nùsledujùcùch CRSs"
	  },
	  "toTheLayer": {
		"cat": "a la capa",
		"spa": "a la capa",
		"eng": "to the layer",
		"fre": "ù la couche",
		"cze": "ve vrstve"
	  },
	  "containsReferencesEraseContinue": {
		"cat": "contù referùncies a la capa que s'estù intentant esborrar i deixarù de funcionar. Vols continuar",
		"spa": "contiene referencias a la capa que se estù intentando borrar y dejarù de funcionar. Desea continuar",
		"eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue",
		"fre": "contient des rùfùrences ù la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer",
		"cze": "obsahuje odkazy na vrstvu, kterou "
	  },
	  "containsReferencesStyleEraseContinue": {
		"cat": "contù referùncies a l'estil que s'estù intentant esborrar i deixarù de funcionar. Vols continuar",
		"spa": "contiene referencias al estilo que se estù intentando borrar y dejarù de funcionar. Desea continuar",
		"eng": "contains references to the style that you are trying to erase and will stop working. Do you want to continue",
		"fre": "contient des rùfùrences au style que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer",
		"cze": "obsahuje odkazy na styl, "
	  },
	  "ChooseTwoDifferentLayers": {
		"cat": "Cal triar dues capes diferents o la mateixa en estils i/o dates diferents.",
		"spa": "Es necesario elegir dos capas diferentes o la misma en estilos y/o fechas diferentes.",
		"eng": "You should choose two different layers or the same in different styles and/or dates.",
		"fre": "You should choose two different layers or the same in different styles and/or dates.",
		"cze": "Meli byste si vybrat dve ruznù vrstvy "
	  },
	  "_and_": {
		"cat": " i ",
		"spa": " y ",
		"eng": " and ",
		"fre": " et ",
		"cze": " a"
	  },
	  "CombinationOf": {
		"cat": "Combinaciù de ",
		"spa": "Combinaciùn de ",
		"eng": "Combination of ",
		"fre": "Combination of ",
		"cze": "Kombinace "
	  },
	  "byCategoryOf": {
		"cat": "per categoria de",
		"spa": "por categorùas de",
		"eng": "by category of",
		"fre": "par catùgorie de",
		"cze": "podle kategorie"
	  },
	  "byCategoriesOf": {
		"cat": "per les categories de",
		"spa": "para las categorùas de",
		"eng": "by categories of",
		"fre": "par catùgories des",
		"cze": "podle kategoriù"
	  },
	  "withStatisticsOf": {
		"cat": " amb estadistics de ",
		"spa": " con estadùsticos de ",
		"eng": " with statistics of ",
		"fre": " avec statistiques par ",
		"cze": " se statistikami "
	  },
	  "WrongNumberElementsInLine": {
		"cat": "Nombre d'elements incorrecte a la lùnia",
		"spa": "Nùmero de elementos incorrecto en la lùnea",
		"eng": "Wrong number of elements in line",
		"fre": "Wrong number of elements in line",
		"cze": "Chybnù pocet prvku v rùdku"
	  },
	  "WrongValuesFormatInLine": {
		"cat": "Format incorrecte dels valors a la lùnia",
		"spa": "Formato incorrecto de los valores en la lùnea",
		"eng": "Wrong values format in line",
		"fre": "Wrong values format in line",
		"cze": "Chybnù formùt hodnot v rùdku"
	  },
	  "WrongOldValueInLine": {
		"cat": "Valor a canviar incorrecte a la lùnia",
		"spa": "Valor a cambiar incorrecto en la lùnea",
		"eng": "Wrong old value in line",
		"fre": "Ancienne valeur erronùe dans la ligne",
		"cze": "ùpatnù starù hodnota v rùdku"
	  },
	  "CannotObtainValidResponseFromServer": {
		"cat": "No s'ha obtingut cap resposta vùlida del servidor solùlicitat",
		"spa": "No se ha obtenido ninguna respuesta vùlida del servidor solicitado",
		"eng": "Cannot obtain any valid response from server",
		"fre": "Aucune rùponse valide n'a ùtù obtenue du serveur demandù",
		"cze": "Ze se serveru nelze zùskat "
	  },
	  "ServerURL": {
		"cat": "URL del servidor",
		"spa": "URL del servidor",
		"eng": "server URL",
		"fre": "URL du serveur",
		"cze": "adresa URL serveru"
	  },
	  "SelectAllLayers": {
		"cat": "Seleccionar totes les capes",
		"spa": "Seleccionar todas las capas",
		"eng": "Select all layers",
		"fre": "Sùlectionner toutes les couches",
		"cze": "Vybrat vùechny vrstvy"
	  },
	  "ServerNotHaveLayerInBrowserReferenceSystem": {
		"cat": "Aquest servidor no tù cap capa disponible en el sistema de referùncia actual del navegador",
		"spa": "Este servidor no tiene ninguna capa disponible en el sistema de referùncia actual del navegador",
		"eng": "This server don't have any layer in the browser actual reference system",
		"fre": "Ce serveur n'a aucune couche disponible dans le systùme de rùfùrence actuel du navigateur",
		"cze": "Tento server nemù v "
	  },
	  "ServerNotHaveLayer": {
		"cat": "Aquest servidor no tù cap capa disponible",
		"spa": "Este servidor no tiene ninguna capa disponible",
		"eng": "This server don't have any layer",
		"fre": "Ce serveur n'a aucune couche disponible",
		"cze": "Tento server nemù ùùdnou vrstvu"
	  },
	  "ValidURLMustBeProvided": {
		"cat": "Cal indicar una adreùa vùlida",
		"spa": "Se debe indicar una direcciùn vùlida",
		"eng": "A valid URL must be provided",
		"fre": "Vous devez indiquer une adresse valide",
		"cze": "Musù bùt zadùna platnù adresa URL"
	  },
	  "ChooseOneFromList": {
		"cat": "Seleccciona'n un de la llista",
		"spa": "Escoja uno de la lista",
		"eng": "Choose one from list",
		"fre": "Sùlectionnez un objet de la liste",
		"cze": "Vyberte jednu ze seznamu"
	  },
	  "toShowInformationOrHelp": {
		"cat": "per mostrar informaciù o ajuda",
		"spa": "para mostrar informaciùn o ayuda",
		"eng": "to show information or help",
		"fre": "pour afficher des informations ou de l'aide",
		"cze": "pro zobrazenù informacù nebo nùpovedy"
	  },
	  "AddReclassifiedLayerAsNewStyle": {
		"cat": "Afegeix capa reclassificada com un nou estil",
		"spa": "Aùada capa reclasificada como un nuevo estilo",
		"eng": "Add reclassified layer as a new style",
		"fre": "Ajouter une couche reclassùe en tant que nouveau style",
		"cze": "Pridat reklasifikovanou vrstvu "
	  },
	  "LayerToReclassify": {
		"cat": "Capa a reclassificar",
		"spa": "Capa a reclasificar",
		"eng": "Layer to reclassify",
		"fre": "Couche ù reclassifier",
		"cze": "Vrstva, kterou chcete reklasifikovat"
	  },
	  "ReclassifyingExpression": {
		"cat": "Fùrmula de reclassificaciù",
		"spa": "Fùrmula de reclasificaciùn:",
		"eng": "Reclassifying expression",
		"fre": "Formule de reclassement",
		"cze": "Vùraz pro reklasifikaci"
	  },
	  "ResultOfReclassificationAddedAsNewStyleWithName": {
		"cat": "El resultat de la reclassificaciù serù afegit com a un estil nou de nom",
		"spa": "El resultado de la reclasssificaciùn serù aùadido como un estilo nuevo de nombre",
		"eng": "The result of the reclassification will be added as a new style with name",
		"fre": "Le rùsultat du reclassement sera ajoutù en tant que nouveau style avec le nom",
		"cze": "Vùsledek "
	  },
	  "LayerForExpression": {
		"cat": "Capa per a la fùrmula",
		"spa": "Capa para la fùrmula",
		"eng": "Layer for the expression",
		"fre": "Couche pour l'expression",
		"cze": "Vrstva pro vùraz"
	  },
	  "WriteInExpression": {
		"cat": "Escriu a la fùrmula",
		"spa": "Escribe en fùrmula",
		"eng": "Write in expression",
		"fre": "Ecrire ù la formule",
		"cze": "Zùpis do vùrazu"
	  },
	  "OperatorsFunctionsForExpression": {
		"cat": "Operadors i funcions per a la fùrmula",
		"spa": "Operadores y funciones para la fùrmula",
		"eng": "Operators and functions for the expression",
		"fre": "Opùrateurs et fonctions pour l'expression",
		"cze": "Operùtory a funkce pro vùraz"
	  },
	  "ResultOfSelectionAddedAsNewLayerStyleWithName": {
		"cat": "El resultat de la selecciù serù afegit com a una capa/estil nou de nom",
		"spa": "El resultado de la selecciùn serù aùadido como una capa/estilo nuevo de nombre",
		"eng": "The result of the selection will be added as a new layer/style with name",
		"fre": "Le rùsultat de la sùlection sera ajoutù en tant que nouveau couche/style avec le nom",
		"cze": "Vùsledek vùberu "
	  },
	  "AddGeometricOverlayLayerBetweenTwoCategoricalLayers": {
		"cat": "Afegir una capa de superposiciù geomùtrica entre dues capes categùriques",
		"spa": "Aùadir una capa de superposiciùn geomùtrica entre dos capas categùricas",
		"eng": "Add a geometric overlay layer between two categorical layers",
		"fre": "Ajouter un couche de superposition gùomùtrique entre deux couche catùgoriels",
		"cze": "Pridùnù "
	  },
	  "AddGeometricOverlay": {
		"cat": "Afegir superposiciù geomùtrica",
		"spa": "Aùadir superposiciùn geomùtrica",
		"eng": "Add geometric overlay",
		"fre": "Ajouter une superposition gùomùtrique",
		"cze": "Pridat geometrickù prekryv"
	  },
	  "AddStatisticalFieldsToCategoricalLayerFromAnotherLayer": {
		"cat": "Afegir camps estadùstics a una capa categùrica des d'una altra capa (de qualsevol tipus)",
		"spa": "Aùada capa combinada a partir de dues capas existentes",
		"eng": "Add statistical fields to a categorical layer from another layer (of any type)",
		"fre": "Ajouter des champs statistiques ù une couche catùgorielle ù partir d'une autre couche (de tout type)",
		"cze": "Pridùnù "
	  },
	  "AddStatisticalFields": {
		"cat": "Afegir camps estadùscs",
		"spa": "Aùadir campos estadùsticos",
		"eng": "Add statistical fields",
		"fre": "Ajouter des champs statistiques",
		"cze": "Pridat statistickù pole"
	  },
	  "NewLayerFromServer": {
		"cat": "Capa nova de servidor",
		"spa": "Capa nueva de servidor",
		"eng": "New layer from server",
		"fre": "Nouvelle couche du serveur",
		"cze": "Novù vrstva ze serveru"
	  },
	  "NewLayerFromDisk": {
		"cat": "Capa nova de disc local",
		"spa": "Capa nueva de disco local",
		"eng": "New layer from local drive",
		"fre": "Nouvelle couche du lecteur local",
		"cze": "Novù vrstva z mùstnù jednotky"
	  },
	  "NewLayerFromURL": {
		"cat": "Capa nova des de URL",
		"spa": "Capa nueva desde URL",
		"eng": "New layer from URL",
		"fre": "Nouvelle couche du URL",
		"cze": "Novù vrstva z adresy URL"
	  },
	  "SpecifyServerURL": {
		"cat": "Especifica l'adreùa URL del servidor",
		"spa": "Especifique la direcciùn URL del servidor",
		"eng": "Specify the server URL",
		"fre": "Spùcifiez l'adresse URL du serveur",
		"cze": "Zadejte adresu URL serveru"
	  },
	  "orChooseOnFromServiceList": {
		"cat": "o Seleccciona'n un de la llista de serveis",
		"spa": "o Escoja uno de la lista de servicios",
		"eng": "or Choose one from service list",
		"fre": "ou sùlectionnez un des services de la liste",
		"cze": "nebo Vyberte jednu ze seznamu sluùeb"
	  },
	  "ofAddingLayerToBrowser": {
		"cat": "d'afegir capes al navegador",
		"spa": "de aùadir capas al navegador",
		"eng": "of adding a layer to browser",
		"fre": "pour ajouter des couches au navigateur",
		"cze": "pridùnù vrstvy do prohlùece"
	  },
	  "LayerCalculator": {
		"cat": "Calculadora de capes",
		"spa": "Calculadora de capas",
		"eng": "Layer calculator",
		"fre": "Calculateur de couches",
		"cze": "Kalkulacka vrstev"
	  },
	  "toMakeCalculationsOfLayers": {
		"cat": "per fer cùlculs de capes",
		"spa": "para hacer cùlculos de capas",
		"eng": "to make calculations of layers",
		"fre": "pour rùaliser de calculs des couches",
		"cze": "pro provùdenù vùpoctu vrstev"
	  },
	  "AnalyticalCombinationLayers": {
		"cat": "Combinaciù analùtica de capes",
		"spa": "Combinaciùn analùtica de capas",
		"eng": "Analytical combination of layers",
		"fre": "Combinaison analytique de couches",
		"cze": "Analytickù kombinace vrstev"
	  },
	  "toCombineLayers": {
		"cat": "per combinar capes",
		"spa": "para combinar capas",
		"eng": "to combine layers",
		"fre": "pour correspondre des couches",
		"cze": "ke kombinaci vrstev"
	  },
	  "toReclassifyLayer": {
		"cat": "per reclassificar la capa",
		"spa": "para reclasificar la capa",
		"eng": "to reclassify the layer",
		"fre": "pour reclassifier de couche",
		"cze": "k preklasifikovùnù vrstvy"
	  },
	  "WriteValueInExpression": {
		"cat": "Escriu valor a la fùrmula",
		"spa": "Escribe valor en fùrmula",
		"eng": "Write value in expression",
		"fre": "ùcrire une valeur dans l'expression",
		"cze": "Zùpis hodnoty ve vùrazu"
	  },
	  "RecommendedRangeOfValues": {
		"cat": "Interval de valors recomenats",
		"spa": "Intervalo de valores recomendados",
		"eng": "Recommended range of values",
		"fre": "Intervalle des valeurs recommandùes",
		"cze": "Doporucenù rozsah hodnot"
	  },
	  "anyValue": {
		"cat": "qualsevol valor",
		"spa": "cualquier valor",
		"eng": "any value",
		"fre": "toute valeur",
		"cze": "libovolnù hodnota"
	  },
	  "constant": {
		"cat": "constant",
		"spa": "constante",
		"eng": "constant",
		"fre": "constant",
		"cze": "konstanta"
	  },
	  "selector": {
		"cat": "selector",
		"spa": "selector",
		"eng": "selector",
		"fre": "sùlecteur",
		"cze": "selektor"
	  },
	  "SelectedInLayer": {
		"cat": "Seleccionada a la capa",
		"spa": "Seleccionada en la capa",
		"eng": "Selected in the layer",
		"fre": "Sùlectionnù dans la couche",
		"cze": "Vybranù ve vrstve"
	  },
	  "byDefault": {
		"cat": "per defecte",
		"spa": "por defecto",
		"eng": "by default",
		"fre": "par dùfaut",
		"cze": "podle vùchozùho nastavenù"
	  },
	  "OnlyShowValuesOfLayer": {
		"cat": "Mostra nomùs els valors de la capa",
		"spa": "Muestra solo los valores de la capa",
		"eng": "Only show the values of the layer",
		"fre": "Afficher uniquement les valeurs de la couche",
		"cze": "Zobrazit pouze hodnoty vrstvy"
	  },
	  "ofTheStyle": {
		"cat": "de l'estil",
		"spa": "del estil",
		"eng": "of the style",
		"fre": "du style",
		"cze": "stylu"
	  },
	  "ofTheField": {
		"cat": "del camp",
		"spa": "del campo",
		"eng": "of the field",
		"fre": "du champ",
		"cze": "pole"
	  },
	  "thatConformFollowingConditions": {
		"cat": "que complexien les condicions segùents",
		"spa": "que cumplen las siguientes condiciones",
		"eng": "that conform the following conditions",
		"fre": "qui se conforment aux conditions suivantes",
		"cze": "kterù splnujù nùsledujùcù podmùnky"
	  },
	  "NexusWithNextCondition": {
		"cat": "Nexe amb la segùent condiciù",
		"spa": "Nexo con la siguiente condiciùn",
		"eng": "Nexus with next condition",
		"fre": "Nexus avec la prochaine condition",
		"cze": "Nexus s dalùù podmùnkou"
	  },
	  "TheResultOfSelectionAddedAsNewStyleWithName": {
		"cat": "El resultat de la selecciù serù afegit com a un estil nou de nom",
		"spa": "El resultado de la selecciùn serù aùadido como un estilo nuevo de nombre",
		"eng": "The result of the selection will be added as a new style with name",
		"fre": "Le rùsultat de la sùlection sera ajoutù en tant que nouveau style avec le nom",
		"cze": "Vùsledek vùberu bude "
	  },
	  "ofQueryByAttributeSelectionByCondition": {
		"cat": "de selecciù per condiciù",
		"spa": "de selecciùn por condiciùn",
		"eng": "of query by attribute selection by condition",
		"fre": " pour sùlection par condition",
		"cze": "dotazu podle vùberu "
	  },
	  "ofRGBCombination": {
		"cat": "de combinaciù RGB",
		"spa": "de combinaciùn RGB",
		"eng": "of RGB combination",
		"fre": "pour combinaison RVB",
		"cze": "kombinace RGB"
	  },
	  "SelectThreeComponentsOfLayer": {
		"cat": "Selùlecciona les 3 components de la capa",
		"spa": "Selecciona las 3 componentes de la capa",
		"eng": "Select the three components of the layer",
		"fre": "Sùlectionnez les trois composants de la couche",
		"cze": "Vùber trù sloùek vrstvy"
	  },
	  "Component": {
		"cat": "Component",
		"spa": "Componente",
		"eng": "Component",
		"fre": "Composant",
		"cze": "Sloùka"
	  },
	  "RGBCombinationAddedAsNewStyleWithName": {
		"cat": "La combinaciù RGB serù afegida com a un estil nou de nom",
		"spa": "La combinaciùn RGB serù aùadida como un estilo nuevo de nombre",
		"eng": "The RGB combination will be added as a new style with name",
		"fre": "La combinaison RVB sera ajoutù en tant que nouveau style avec le nom",
		"cze": "Kombinace RGB bude pridùna "
	  },
	  "SelectionStatisticValue": {
		"cat": "Selecciù del valor estadùstic",
		"spa": "Selecciùn del valor estadùstico",
		"eng": "Selection of statistic value",
		"fre": "Sùlection de la valeur statistique",
		"cze": "Vùber statistickù hodnoty"
	  },
	  "StatisticalValueToDisplayForLayer": {
		"cat": "Valor estadùstic a mostrar per la capa",
		"spa": "Valor estadùstico para mostrar para la capa",
		"eng": "Statistical value to display for the layer",
		"fre": "Valeur statistique ù afficher pour la couche",
		"cze": "Statistickù hodnota, kterù se "
	  },
	  "StatisticalValueOf": {
		"cat": "Valor estadùstic de",
		"spa": "Valor estadùstico de",
		"eng": "Statistical value of",
		"fre": "Valeur statistique des",
		"cze": "Statistickù hodnota"
	  },
	  "Ascending": {
		"cat": "Ascendent",
		"spa": "Ascendiente",
		"eng": "Ascending",
		"fre": "Ascendant",
		"cze": "Vzestupne"
	  },
	  "Descending": {
		"cat": "Descendent",
		"spa": "Descendiente",
		"eng": "Descending",
		"fre": "Descendant",
		"cze": "Sestupne"
	  },
	  "CannotEditStyleNeverVisualized": {
		"cat": "No es pot editar un estil no visualitzat",
		"spa": "No es puede editar un estilo no visualizado",
		"eng": "You cannot edit a style never visualized",
		"fre": "Vous ne pouvez pas ùditer un style jamais visualisù",
		"cze": "Styl, kterù nebyl nikdy "
	  },
	  "StyleLayer": {
		"cat": "Estil de la capa",
		"spa": "Estilo de la capa",
		"eng": "Style of the layer",
		"fre": "Style de la couche",
		"cze": "Styl vrstvy"
	  },
	  "ValueForStretchingColor": {
		"cat": "Valors per l'estirament de color",
		"spa": "Valores para el estiramiento de color",
		"eng": "Value for stretching of color",
		"fre": "Valeur pour l'ùtirement de la couleur",
		"cze": "Hodnota pro roztaùenù barvy"
	  },
	  "computed": {
		"cat": "calculat",
		"spa": "calculado",
		"eng": "computed",
		"fre": "calculù",
		"cze": "vypoctenù"
	  },
	  "Adopt": {
		"cat": "Adoptar",
		"spa": "Adoptar",
		"eng": "Adopt",
		"fre": "Adopter",
		"cze": "Prijmout"
	  },
	  "SunPositionForComputationIllumination": {
		"cat": "Posiciù del sol pel cùlcul de la ilùluminaciù",
		"spa": "Posiciù del sol para el cùlculo de la iluminaciùn",
		"eng": "Sun position for the computation of the illumination",
		"fre": "Position du soleil par le calcul de l'ùclairement",
		"cze": "Poloha slunce pro vùpocet "
	  },
	  "Azimuth": {
		"cat": "Azimut",
		"spa": "Azimut",
		"eng": "Azimuth",
		"fre": "Azimut",
		"cze": "Azimut"
	  },
	  "originNorthNorthClockwiseDegress": {
		"cat": "origen al nord nord i en sentit horari (en graus)",
		"spa": "origen en el norte norte y en el sentido de las agujas del reloj (en grados)",
		"eng": "origin north north and clockwise (in degress)",
		"fre": "origine au nord nord et dans le sens des aiguilles d'une montre (en degrùs)"
	  },
	  "Elevation": {
		"cat": "Elevaciù",
		"spa": "Elevaciùn",
		"eng": "Elevation",
		"fre": "ùlùvation",
		"cze": "Nadmorskù vùùka"
	  },
	  "fromGroundDegress": {
		"cat": "des del terra (en graus)",
		"spa": "desde el suelo (en grados)",
		"eng": "from the ground (in degress)",
		"fre": "ù partir du sol (en degrùs)",
		"cze": "od zeme (ve stupnùch)"
	  },
	  "ReliefExaggerationFactor": {
		"cat": "Factor d'exageraciù del relleu",
		"spa": "Factor de exageraciùn del relieve",
		"eng": "Relief exaggeration factor",
		"fre": "Facteur d'exagùration du relief",
		"cze": "Faktor prevùùenù reliùfu"
	  },
	  "Greyscale": {
		"cat": "Escala de grisos",
		"spa": "Escala de grises",
		"eng": "Greyscale",
		"fre": "Niveaux de gris",
		"cze": "Stupnice ùedi"
	  },
	  "IncorrectAzimuth": {
		"cat": "Azimut incorrecte. Hauria de ser un nùmero entre 0 i 360. Aplicant el valor per defecte",
		"spa": "Azimut incorrecto. Deberùa ser un nùmero entre 0 y 360. Aplicando el valor por defecto",
		"eng": "Incorrect azimuth. It should be a number between 0 and 360. Applying the default value",
		"fre": "Azimut incorrect. Il doit s'agir d'un nombre compris entre 0 et 360. Application de la valeur par dùfaut",
		"cze": "Nesprùvnù azimut. Melo by to bùt cùslo mezi 0 a "
	  },
	  "IncorrectElevation": {
		"cat": "Elevaciù incorrecta. Hauria de ser un nùmero entre 0 i 90. Aplicant el valor per defecte",
		"spa": "Elevaciùn incorrecta. Deberùa ser un nùmero entre 0 y 90. Aplicando el valor por defecto",
		"eng": "Incorrect elevation. It should be a number between 0 and 90. Applying the default value",
		"fre": "ùlùvation incorrect. Il doit s'agir d'un nombre compris entre 0 et 90. Application de la valeur par dùfaut",
		"cze": "Nesprùvnù nadmorskù vùùka. Melo by to bùt "
	  },
	  "IncorrectReliefExaggerationFactor": {
		"cat": "Factor d'exageraciù del relleu incorrecte. Hauria de ser un nùmero major de 0.0001. Aplicant el valor per defecte",
		"spa": "Factor de exageraciùn del relieve incorrecta. Deberùa ser un nùmero mayor que 0.0001. Aplicando el valor por defecto",
		"eng": "Incorrect relief exaggeration factor. It should be a number bigger than 0.0001. Applying the default value",
		"fre": "Facteur d'exagùration du relief incorrect. Il doit s'agir d'un nombre supùrieur ù 0,0001. Application de la valeur par dùfaut",
		"cze": "Nesprùvnù faktor prevùùenù "
	  },
	  "ofModifingName": {
		"cat": "de modificar el nom",
		"spa": "de modificar el nombre",
		"eng": "of modifing the name",
		"fre": "pour modifier le nom",
		"cze": "o ùprave nùzvu"
	  },
	  "LayerNameInLegend": {
		"cat": "Nom de la capa a la llegenda",
		"spa": "Nombre de la capa en la leyenda",
		"eng": "Name of the layer in the legend",
		"fre": "Nom de la couche dans la lùgende",
		"cze": "Nùzev vrstvy v legende"
	  },
	  "forShowingLinageInformation": {
		"cat": "de mostrar la informaciù del llinatge",
		"spa": "de mostrar la informaciùn del linaje",
		"eng": "for showing the linage information",
		"fre": "pour afficher les informations de lignage",
		"cze": "pro zobrazenù informacù o linii"
	  },
	  "forShowingQualityInformation": {
		"cat": "de mostrar la informaciù de qualitat",
		"spa": "de mostrar la informaciùn de calidad",
		"eng": "for showing the quality information",
		"fre": "pour afficher l'information de qualitù",
		"cze": "pro zobrazenù informacù o kvalite"
	  },
	  "ofUserFeedback": {
		"cat": "de valoracions dels usuaris",
		"spa": "de valoraciones de los usuarios",
		"eng": "of user feedback",
		"fre": "pour la rùtroaction de l'utilisateur",
		"cze": "zpetnù vazby od uùivatele"
	  },
	  "_withStatisticOf_": {
		"cat": " amb estadistics de ",
		"spa": " con estadùsticos de ",
		"eng": " with statistic of ",
		"fre": " avec statistiques des ",
		"cze": " se statistikou"
	  },
	  "StatisticalDescriptorDisplayNeedSelected": {
		"cat": "Cal selùleccionar el descriptor estadùstic a mostrar per la capa",
		"spa": "Debe seleccionar el descriptor estadùstico para mostrar para la capa",
		"eng": "The statistical descriptor to display for the layer needs to be selected",
		"fre": "Le descripteur statistique ù afficher pour la couche doit ùtre sùlectionnù",
		"cze": "Je treba vybrat "
	  }
	},
	"storymap": {
	  "Storymaps": {
		"cat": "Relats amb mapes",
		"spa": "Relatos con mapas",
		"eng": "Storymaps",
		"fre": "Carte de l'histoire",
		"cze": "Prùbehovù mapy"
	  },
	  "SelectStory": {
		"cat": "Selecciona un relat",
		"spa": "Selecciona un relato",
		"eng": "Select a story",
		"fre": "Sùlectionnez une histoire",
		"cze": "Vùber prùbehu"
	  },
	  "NoStoryInThisArea": {
		"cat": "No hi ha cap relat associat a aquesta zona",
		"spa": "No hay ningùn relato asociado a esta zona",
		"eng": "There are no stories associated with this area",
		"fre": "Il n'y a pas d'histoires associùes ù cette zone",
		"cze": "K tùto oblasti nejsou prirazeny ùùdnù prùbehy"
	  },
	  "ParameterValueFoundIs": {
		"cat": "El valor del parùmetre indicat ùs",
		"spa": "El valor del parùmetro indicado es",
		"eng": "The parameter value found is",
		"fre": "La valeur de paramùtre trouvùe est",
		"cze": "Nalezenù hodnota parametru je"
	  },
	  "ActionOnMap": {
		"cat": "Acciù sobre el mapa",
		"spa": "Acciùn sobre el mapa",
		"eng": "Action on the map",
		"fre": "Agir sur la carte",
		"cze": "Akce na mape"
	  },
	  "NewStorymap": {
		"cat": "Nou relat amb mapes",
		"spa": "Nuevo relato con mapas",
		"eng": "New storymaps",
		"fre": "Nouvelle carte de l'histoire",
		"cze": "Novù prùbehovù mapy"
	  }
	},
	"tresD": {
	  "Graphic_3D": {
		"cat": "Grùfic 3D",
		"spa": "Grùfico 3D",
		"eng": "3D Graphic",
		"fre": "Diagramme 3D",
		"cze": "3D grafika"
	  },
	  "VerticalScale": {
		"cat": "Escala vertical",
		"spa": "Escala vertical",
		"eng": "Vertical scale",
		"fre": "ùchelle verticale",
		"cze": "Vertikùlnù merùtko"
	  }
	},
	"canviprj": {
	  "LongLatConversionNotImplementedforRefSys": {
		"cat": "Pas a longitud/latitud no implementat per aquest sistema de referùncia",
		"spa": "Paso a longitud/latitud no implementado para este sistema de referencia",
		"eng": "Longitude/latitude conversion has not been implemented for this reference system",
		"fre": "Conversion ù longitude/latitude pas implùmentù pour ce systùme de rùfùrence",
		"cze": "Prevod zemepisnù dùlky a "
	  },
	  "MapCoordConversionNotImplementedInRefSys": {
		"cat": "Pas a coordenades mapa no implementat per aquest sistema de referùncia",
		"spa": "Paso a coordenades mapa no implementado para este sistema de referencia",
		"eng": "Map coordinates conversion has not been implemented for this reference system",
		"fre": "Conversion ù coordonnùes de la carte pas implùmentù pour ce systùme de rùfùrence.",
		"cze": "Prevod mapovùch "
	  },
	  "LambertConformalConicZoneIII_NTF": {
		"cat": "Lambert Cùnica Conforme Zona III - NTF",
		"spa": "Lambert Cùnica Conforme Zona III - NTF",
		"eng": "Lambert Conformal Conic Zone III - NTF",
		"fre": "Lambert Conique Conforme Zone III ùNTF",
		"cze": "Lambert Conformal Conic Zone III "
	  },
	  "LambertConformalConicZoneIIext_NTF": {
		"cat": "Lambert Cùnica Conforme Zona IIext - NTF",
		"spa": "Lambert Cùnica Conforme Zona IIext - NTF",
		"eng": "Lambert Conformal Conic Zone IIext - NTF",
		"fre": "Lambert Conique Conforme Zone IIextùNTF",
		"cze": "Lambert Conformal Conic Zone "
	  },
	  "LambertConformalConicZoneIIIext_NTF": {
		"cat": "Lambert Cùnica Conforme Zona IIIext - NTF",
		"spa": "Lambert Cùnica Conforme Zona IIIext - NTF",
		"eng": "Lambert Conformal Conic Zone IIIext - NTF",
		"fre": "Lambert Conique Conforme Zone IIIext ùNTF",
		"cze": "Lambert Conformal Conic Zone "
	  },
	  "LambertConformalConicICCMediterranianRegion": {
		"cat": "Lambert Cùnica Conforme ICC Regiù Mediterrùnia",
		"spa": "Lambert Cùnica Conforme ICC Regiùn Mediterrùnea",
		"eng": "Lambert Conformal Conic ICC Mediterranian Region",
		"fre": "Lambert Conique Conforme ICC Rùgion Mùditerranùenne",
		"cze": "Lambert Conformal "
	  },
	  "MercatorParallel_41d25m_ED50": {
		"cat": "Mercator paralùlel 41ù 25' - ED50",
		"spa": "Mercator paralelo 41ù25' - ED50",
		"eng": "Mercator parallel 41ù25' - ED50",
		"fre": "Mercator parallùle 41ù25' - ED50",
		"cze": "Mercator parallel 41ù25' - ED50"
	  },
	  "MercatorParallel_41d25m_WGS84": {
		"cat": "Mercator paralùlel 41ù 25' - WGS84",
		"spa": "Mercator paralelo 41ù25' - WGS84",
		"eng": "Mercator parallel 41ù25' - WGS84",
		"fre": "Mercator parallùle 41ù25' - WGS84",
		"cze": "Mercator parallel 41ù25' - WGS84"
	  },
	  "MercatorParallel_40d36m_ED50": {
		"cat": "Mercator paralùlel 40ù 36' - ED50",
		"spa": "Mercator paralelo 40ù36' - ED50",
		"eng": "Mercator parallel 40ù36' - ED50",
		"fre": "Mercator parallùle 40ù36' ù ED50",
		"cze": "Mercator parallel 40ù36' - ED50"
	  },
	  "MercatorParallelEquator_ED50": {
		"cat": "Mercator paralùlel Equador - ED50",
		"spa": "Mercator paralelo Ecuador - ED50",
		"eng": "Mercator parallel Equator - ED50",
		"fre": "Mercator parallùle Equateur ù ED50",
		"cze": "Mercator parallel Equator - ED50"
	  },
	  "MercatorParallelEquator_WGS84": {
		"cat": "Mercator paralùlel Equador - WGS84",
		"spa": "Mercator paralelo Ecuador - WGS84",
		"eng": "Mercator parallel Equator - WGS84",
		"fre": "Mercator parallùle Equateur- WGS84",
		"cze": "Mercator parallel Equator - WGS84"
	  },
	  "WebMercator": {
		"cat": "Web Mercator",
		"spa": "Web Mercator",
		"eng": "Web Mercator",
		"fre": "Web Mercator",
		"cze": "Web Mercator"
	  }
	},
	"capavola": {
	  "Proj": {
		"cat": "Proj",
		"spa": "Proy",
		"eng": "Proj",
		"fre": "Proj",
		"cze": "Proj"
	  },
	  "DeviceLocation": {
		"cat": "Ubicaciù dispositiu",
		"spa": "Ubicaciùn dispositivo",
		"eng": "Device location",
		"fre": "Emplacement de l'appareil",
		"cze": "Umùstenù zarùzenù"
	  },
	  "AroundZone": {
		"cat": "Zona al voltant",
		"spa": "Zona alrededor",
		"eng": "Around zone",
		"fre": "Zone autour",
		"cze": "Okolù zùny"
	  },
	  "GoTo": {
		"cat": "Anar-hi",
		"spa": "Ir",
		"eng": "Go to",
		"fre": "Aller ù",
		"cze": "Prejùt na"
	  },
	  "ofGoToCoordinate": {
		"cat": "d'anar a coordenada",
		"spa": "de ir a coordenada",
		"eng": "of go-to coordinate",
		"fre": "pour aller ù la coordonnùe",
		"cze": "souradnice go-to"
	  },
	  "RequestedPointOutsideBrowserEnvelope": {
		"cat": "El punt solùlicitat estù fora de l'ùmbit de navegaciù",
		"spa": "El punto solicitado estù fuera del ùmbito de navegaciùn",
		"eng": "The requested point is outside browser envelope",
		"fre": "Le point requis se trouve dehors le milieu de navigation",
		"cze": "Poùadovanù bod je mimo "
	  },
	  "toInsertNewPoints": {
		"cat": "per inserir punts nous",
		"spa": "para insertar puntos nuevos",
		"eng": "to insert new points",
		"fre": "pour insùrer de nouveaux points",
		"cze": "pro vloùenù novùch bodu"
	  },
	  "UserDeniedRequestGeolocation": {
		"cat": "L'usuari ha denegat la solùlicitud de geolocalitzaciù",
		"spa": "El usuario ha denegado la solicitud de geolocalizaciùn",
		"eng": "User denied the request for geolocation",
		"fre": "L'utilisateur a refusù la demande de gùolocalisation",
		"cze": "Uùivatel odmùtl poùadavek na "
	  },
	  "LocationInfoUnavailable": {
		"cat": "La informaciù sobre la ubicaciù no estù disponible",
		"spa": "La informaciùn sobre la ubicaciùn no estù disponible",
		"eng": "Location information is unavailable",
		"fre": "Les informations de localisation ne sont pas disponibles",
		"cze": "Informace o poloze nejsou k dispozici"
	  },
	  "RequestGetUserLocationTimedOut": {
		"cat": "S'ha esgotat el temps d'espera de la solùlicitud per obtenir la ubicaciù de l'usuari",
		"spa": "Se ha agotado el tiempo de espera de la solicitud para obtener la ubicaciùn del usuario",
		"eng": "Request to get user location timed out",
		"fre": "La demande dùobtention de lùemplacement de lùutilisateur a expirù",
		"cze": "Poùadavek na zùskùnù polohy "
	  },
	  "UnknownErrorObtainingLocation": {
		"cat": "S'ha produùt un error desconegut durant l'obtenciù de la ubicaciù",
		"spa": "Se ha producido un error desconocido durante la obtenciùn de la geolocalizaciùn",
		"eng": "An unknown error occurred while obtaining the location",
		"fre": "Une erreur inconnue s'est survenue lors de l'obtention de l'emplacement",
		"cze": "Pri zùskùvùnù umùstenù doùlo k "
	  },
	  "CoordIncorrectFormat": {
		"cat": "Format de les coordenades erroni",
		"spa": "Formato de las coordenadas errùneo",
		"eng": "Coordinate format is incorrect",
		"fre": "Format des coordonnùes erronù",
		"cze": "Formùt souradnic je nesprùvnù"
	  },
	  "NumericalValueMustBeIndicated": {
		"cat": "S'ha d'indicar un valor numùric",
		"spa": "Se debe indicar un valor numùrico",
		"eng": "A numerical value must be indicated",
		"fre": "Vous devez indiquer une valeur numùrique",
		"cze": "Musù bùt uvedena cùselnù hodnota"
	  },
	  "GeolocationNotSupportedByBrowser": {
		"cat": "La geolocalitzaciù no estù suportada en aquest navegador",
		"spa": "La geolocalizaciùn no estù soportada en este navegador",
		"eng": "Geolocation is not supported by this browser",
		"fre": "La gùolocalisation n'est pas prise en charge dans ce navigateur",
		"cze": "Geolokace nenù tùmto prohlùecem "
	  }
	},
	"commands": {
	  "ZoomSizeIncorrectFormat": {
		"cat": "Format del valor del costat de zoom erroni",
		"spa": "Formato del lado de zoom errùneo",
		"eng": "Zoom size format is incorrect.",
		"fre": "Format des zoom erronù",
		"cze": "Formùt velikosti zoomu je nesprùvnù."
	  },
	  "NumericalValueIsRequired": {
		"cat": "S'ha d'indicar un valor numùric",
		"spa": "Se debe indicar un valor numùrico",
		"eng": "A numerical value is required",
		"fre": "Vous devez indiquer une valeur numùrique",
		"cze": "Je vyùadovùna cùselnù hodnota"
	  },
	  "ZoomSizeNotAvailableBrowser": {
		"cat": "El costat de zoom solùlicitat no ùs un dels costats disponibles en aquest navegador.",
		"spa": "El lado de zoom solicitado no es uno de los lados disponibles en este navegador.",
		"eng": "The requested zoom size is not available in this browser.",
		"fre": "La taille de zoom demandùe n'est pas disponible dans ce navigateur.",
		"cze": "Poùadovanù velikost zvetùenù nenù v "
	  },
	  "CRSNotAvailableBrowser": {
		"cat": "El CRS solùlicitat no te un mapa de situaciù associat en aquest navegador i no estù disponible.",
		"spa": "El CRS solicitado no tiene un mapa de situaciùn asociado i no estù disponibles en este navegador.",
		"eng": "The requested CRS has no situation map associated and it is not available in this browser.",
		"fre": "Le CRS demandù n'a pas de carte de situation associùe et n'est pas disponible dans ce navigateur.",
		"cze": "Poùadovanù pocùtacovù rezervacnù systùm "
	  },
	  "CoordIncorrectFormat": {
		"cat": "Format de les coordenades erroni",
		"spa": "Formato de las coordenadas errùneo",
		"eng": "Coordinate format is incorrect",
		"fre": "Format des coordonnùes erronù",
		"cze": "Formùt souradnic je nesprùvnù"
	  },
	  "TwoNumericalValuesRequiredFormat": {
		"cat": "S'ha d'indicar dos valors numùrics en el format",
		"spa": "Se debe indicar dos valores numùricos en el formato",
		"eng": "Two numerical values are required with the format",
		"fre": "Deux valeurs numùriques sont requises dans le format",
		"cze": "Ve formùtu jsou vyùadovùny dve "
	  },
	  "SelectionsIncorrectFormat": {
		"cat": "Format de les consultes erroni",
		"spa": "Formato de las consultas errùneo",
		"eng": "Query format is incorrect",
		"fre": "Format des requete erronù",
		"cze": "Formùt dotazu je nesprùvnù"
	  },
	  "HistogramsIncorrectFormat": {
		"cat": "Format dels histogrames erroni",
		"spa": "Formato de los histogramas errùneo",
		"eng": "Histogram format is incorrect",
		"fre": "Format d'histogramme erronù",
		"cze": "Formùt histogramu je nesprùvnù"
	  },
	  "LyQNameRequired": {
		"cat": "S'han d'indicar l'identificador de la capa, la consulta i el nom del nou estil en el format",
		"spa": "Debe indicar el identificador de la capa, la consulta y el nombre del nuevo estilo en el formato",
		"eng": "The layer identifier, query, and new style name must be specified in the format",
		"fre": "L'identifiant de la couche, la requùte et le nom du nouveau style doivent ùtre spùcifiùs dans le format",
		"cze": "Identifikùtor vrstvy, dotaz a nùzev novùho stylu "
	  },
	  "LyRequired": {
		"cat": "S'han d'indicar l'identificador de la capa",
		"spa": "Debe indicar el identificador de la capa",
		"eng": "The layer identifier, must be specified in the format",
		"fre": "L'identifiant de la couche, ùtre spùcifiùs dans le format",
		"cze": "Identifikùtor vrstvy, musù bùt zadùn ve formùtu"
	  }
	},
	"consola": {
	  "Console": {
		"cat": "Consola",
		"spa": "Consola",
		"eng": "Console",
		"fre": "Console",
		"cze": "Konzole"
	  },
	  "ofWatchingReportsConsole": {
		"cat": "de veure els informes de la consola",
		"spa": "de ver los informes de la consola",
		"eng": "of watching the reports in the console",
		"fre": "pour regarder les rapports dans la console",
		"cze": "sledovùnù hlùenù v konzole"
	  },
	  "DeleteAll": {
		"cat": "Esborra-ho tot",
		"spa": "Borrar todo",
		"eng": "Delete all",
		"fre": "Tout effacer",
		"cze": "Smazat vùe"
	  }
	},
	"consult": {
	  "NoDataForRequestedPoint": {
		"cat": "No hi ha dades pel punt consultat",
		"spa": "No hay datos para el punto consultado",
		"eng": "There are no data for the requested point",
		"fre": "Pas de donnùes au point consultù",
		"cze": "Pro poùadovanù bod nejsou k dispozici "
	  },
	  "andActiveQueryableLayers": {
		"cat": "i les capes consultables actives",
		"spa": "y las capas consultables activas",
		"eng": "and active queryable layers",
		"fre": "et les couches consultables activùes",
		"cze": "a aktivnù dotazovatelnù vrstvy"
	  },
	  "ChartValueCopiedClipboardFormat": {
		"cat": "Els valors del grùfic han estat copiats al portaretalls en format",
		"spa": "Los valores del grùfico han sido copiados al portapapeles en formato",
		"eng": "The values of the chart have been copied to clipboard in the format",
		"fre": "Les valeurs du graphique ont ùtù copiùes dans le presse-papiers dans le format",
		"cze": "Hodnoty grafu byly zkopùrovùny do "
	  },
	  "MessagesNotDisplayedAgain": {
		"cat": "Aquests missatge no es tornarù a mostrar",
		"spa": "Este mensaje no se volverù a mostrar",
		"eng": "These messages will not be displayed again",
		"fre": "Ces messages ne seront plus affichùs",
		"cze": "Tyto zprùvy se jiù nebudou zobrazovat"
	  },
	  "CopySeriesValues": {
		"cat": "Copia valors de la sùrie",
		"spa": "Copiar valores de la serie",
		"eng": "Copy series values",
		"fre": "Copier les valeurs des sùries",
		"cze": "Kopùrovùnù hodnot rad"
	  },
	  "FollowingCoordinateSelected": {
		"cat": "S'ha seleccionat la segùent coordenada",
		"spa": "Se ha seleccionado la siguiente coordenada",
		"eng": "The following coordinate has been selected",
		"fre": "La coordonnùe suivante a ùtù sùlectionnùe",
		"cze": "Byla vybrùna nùsledujùcù souradnice"
	  },
	  "IfCorrectValidateIt": {
		"cat": "Si ùs correcte, ja la podeu validar.",
		"spa": "Si es correcta, ya la puede validar.",
		"eng": "If it is correct, you can already validate it.",
		"fre": "Si correcte, vous pouvez la valider.",
		"cze": "Pokud je sprùvnù, muùete ji jiù potvrdit."
	  },
	  "BrowserClosedReturnForm": {
		"cat": "Es tancarù la finestra de navegaciù i tornarù al formulari.",
		"spa": "Se cerrarù la ventana de navegaciùn y volverù al formulario.",
		"eng": "Browser window will be closed and will return to form.",
		"fre": "La fenùtre du navigateur va se fermer et vous serez redirigùs vers le formulaire.",
		"cze": "Okno prohlùece se zavre a vrùtù se do "
	  },
	  "IfIncorrectClicksViewAgain": {
		"cat": "Si ùs incorrecte, torni a clicar sobre la vista.",
		"spa": "Si es incorrecta, vuelva a cliquear sobre la vista.",
		"eng": "If it is incorrect, click on the view again.",
		"fre": "Si incorrecte, cliquez une autre fois sur la vue.",
		"cze": "Pokud je nesprùvnù, kliknete na "
	  },
	  "ValidateCoordinate": {
		"cat": "Validar Coordenada",
		"spa": "Validar Coordenada",
		"eng": "Validate Coordinate",
		"fre": "Valider coordonnùe",
		"cze": "Overenù souradnice"
	  },
	  "WaitingForData": {
		"cat": "Esperant dades",
		"spa": "Esperando datos",
		"eng": "Waiting for data",
		"fre": "En attente des donnùes",
		"cze": "Cekùnù na data"
	  },
	  "ProfileTransversalCutQueriedLine": {
		"cat": "Perfil del tall transversal de la lùnia consultada",
		"spa": "Perfil del corte transversal de la lùnea consultada",
		"eng": "Profile of the transversal cut of the queried line",
		"fra": "Profil de la coupe transversale de la ligne interrogùe",
		"cze": "Profil prùcnùho rezu dotazovanù "
	  },
	  "PreviousLayer": {
		"cat": "Anterior capa",
		"spa": "Anterior capa",
		"eng": "Previous layer",
		"fre": "Prùcùdente couche",
		"cze": "Predchozù vrstva"
	  },
	  "NextLayer": {
		"cat": "Segùent capa",
		"spa": "Siguiente capa",
		"eng": "Next layer",
		"fre": "Suivant couche",
		"cze": "Dalùù vrstva"
	  },
	  "noconsul_htm": {
		"cat": "noconsul.htm",
		"spa": "noconsul_spa.htm",
		"eng": "noconsul_eng.htm",
		"fre": "noconsul_fre.htm",
		"cze": "noconsul_eng.htm"
	  },
	  "NotImplementedYetRESTful": {
		"cat": "De moment no implementat per RESTful",
		"spa": "De momento no implementado para RESTful",
		"eng": "Not implemented yet for RESTful",
		"fre": "Pas encore implùmentù pour RESTful",
		"cze": "Zatùm neimplementovùno pro RESTful"
	  }
	},
	"ctipica": {
	  "AnyMatch": {
		"cat": "Cap coincidùncia",
		"spa": "Ninguna coincidencia",
		"eng": "Any match",
		"fre": "Aucune coùncidence",
		"cze": "Jakùkoli shoda"
	  },
	  "UpdatingList": {
		"cat": "Actualitzant la llista",
		"spa": "Actualizando la lista",
		"eng": "Updating the list",
		"fre": "La liste est en train d'ùtre actualisùe",
		"cze": "Aktualizace seznamu"
	  },
	  "toBeShownInFrame": {
		"cat": "per a mostrar al frame",
		"spa": "para mostrar en el frame",
		"eng": "to be shown in the frame",
		"fre": "ù montrer au frame",
		"cze": "kterù se mù zobrazit v rùmecku"
	  },
	  "notInTypicalQueryLayerList": {
		"cat": "no ùs a la llista de capes amb consulta tùpica",
		"spa": "no estù en la lista de capas con consulta tùpica",
		"eng": "is not in the typical query layer list",
		"fre": "ne se trouve pas dans la liste de couches avec recherche typique",
		"cze": "nenù v typickùm seznamu vrstvy dotazu"
	  },
	  "isIncorrect": {
		"cat": "ùs incorrecte",
		"spa": "es incorrecta",
		"eng": "is incorrect",
		"fre": "est incorrecte",
		"cze": "je nesprùvnù"
	  },
	  "UseBrowserToolsPlaceOnView": {
		"cat": "Usa les eines del navegador per situar-te sobre la vista.\nA continuaciù fùs clic sobre la vista per determinar la coordenada i la informaciù del punt a validar.\nPer finalitzar, prem [Validar Coordenada] o [Cancelùlar] des de la finestra de validaciù.",
		"spa": "Utiliza las herramientas del navegador para situarte sobre la vista.\nA continuaciùn haz clic sobre la vista para determinar la coordenada y la informaciùn del punto a validar.\nPara finalizar aprieta [Validar Coordenada] o [Cancelar] desde la ventana de validaciùn.",
		"eng": "You have to use browser tools to place on the view.\n Later, you have to click on the view to determine the coordinate\nand the information of the point of validating.\nTo finish you have to click [Validate coordinate] or [Cancel] from the validation window.",
		"fre": "Utilisez les outils du navigateur pour vous placer sur la vue.\n Ensuite cliquez sur la vue pour dùterminer la coordonnù\net l'information du point ù valider.\nFinalement, pressez [Valider Coordonnùe] où [Annuler] de la fenùtre de validation.",
		"cze": "K umùstenù na zobrazenù musùte pouùùt "
	  }
	},
	"download": {
	  "ErrorWhileSendingTryAgain": {
		"cat": "S'ha produùt algun error durant l'enviament del fitxer. Torna-ho a intentar",
		"spa": "Se ha producido algun error durante el envùo del fichero. Vuùlvalo a intentar",
		"eng": "An error has been occurred while sending the file. Try again",
		"fre": "Une erreur vient de se produire pendant l'envoi du fichier. Rùessayez",
		"cze": "Pri odesùlùnù souboru doùlo k chybe. "
	  },
	  "LayerDownloadedTakeMinutes": {
		"cat": "La generaciù de la descùrrega de la capa podria trigar alguns minuts",
		"spa": "La generaciùn de la descarga de la capa podrùa demorarse algunos minutos",
		"eng": "Generation of layer to be downloaded can take some minutes",
		"fre": "La crùation du tùlùchargement de la couche pourrai prendre quelques minutes",
		"cze": "Generovùnù vrstvy ke staùenù muùe "
	  },
	  "PreparingRequestedLayer": {
		"cat": "Preparant la capa solùlicitada",
		"spa": "Preparando la capa solicitada",
		"eng": "Preparing the requested layer",
		"fre": "En prùparant la couche demandùe",
		"cze": "Prùprava poùadovanù vrstvy"
	  },
	  "SelectiveDownloadZone": {
		"cat": "Descùrrega selectiva de la zona",
		"spa": "Descarga selectiva de la zona",
		"eng": "Selective download of the zone",
		"fre": "Tùlùchargement sùlectif de la zone",
		"cze": "Selektivnù staùenù zùny"
	  },
	  "MMZ_MMZX_NotInstalledDownload": {
		"cat": "Pel format MMZ o MMZX (ISO 19165-1), si no teniu instalùlat o actualitzat el Lector Universal de Mapes del MiraMon, descarregueu-lo",
		"spa": "Para el formato MMZ o MMZX (ISO 19165-1), si no tiene instalado o actualizado el Lector Universal de Mapas de MiraMon, descùrguelo",
		"eng": "For the MMZ or MMZX format (ISO 19165-1), if you don't have installed or updated MiraMon Universal Map Reader, please, download it",
		"fre": "Pour le format MMZ ou MMZX (ISO 19165-1), si vous n'avez pas installù où actualisù le Lecteur Universel de Cartes du MiraMon, please, download it",
		"cze": "Pokud nemùte nainstalovanou nebo "
	  },
	  "ViewLayers_MMZ_MMZX_InstalledMM": {
		"cat": "Per poder visualitzar les capes en format MMZ o MMZX (ISO 19165-1) cal tenir correctament instalùlat el programa MiraMon.",
		"spa": "Para poder visualitzar las capas en formato MMZ o MMZX (ISO 19165-1) es necessario tener correctamente instalado el programa MiraMon.",
		"eng": "In order to be able to view the layers in MMZ or MMZX format (ISO 19165-1), an installed version of the MiraMon software is required.",
		"fre": "Pour pouvoir visualiser les couches en MMZ du format MMZX (ISO 19165-1), et la version installùe du logiciel MiraMon est nùcessaire",
		"cze": "Pro zobrazenù vrstev ve formùtu "
	  },
	  "DownloadLayerCompleted": {
		"cat": "Descùrrega la capa completa",
		"spa": "Descarga de la capa completa",
		"eng": "Download the complete layer",
		"fre": "Tùlùchargement de la couche complùte",
		"cze": "Stùhnete si kompletnù vrstvu"
	  },
	  "DownloadLayer": {
		"cat": "Descùrrega de capes",
		"spa": "Descarga de capas",
		"eng": "Layer download",
		"fre": "Tùlùcharger des couches",
		"cze": "Staùenù vrstvy"
	  },
	  "ofDownloading": {
		"cat": "de descarregar",
		"spa": "de descargar",
		"eng": "of downloading",
		"fre": "de tùlùchargement",
		"cze": "stahovùnù"
	  }
	},
	"params": {
	  "ViewAreaBackgroundColor": {
		"cat": "Color de fons de la vista",
		"spa": "Color de fondo de la vista",
		"eng": "Background color of the view area",
		"fre": "Couleur du fond",
		"cze": "Barva pozadù oblasti zobrazenù"
	  },
	  "SituationRectangleColor": {
		"cat": "Color del rectangle de situaciù",
		"spa": "Color del rectùngulo de situaciùn",
		"eng": "Color of the situation rectangle",
		"fre": "Couleur du rectangle de situation",
		"cze": "Barva obdùlnùku situace"
	  },
	  "WidthOfTheView": {
		"cat": "Mida de l'ample de la vista",
		"spa": "Tamaùo del ancho de la vista",
		"eng": "Width of the view",
		"fre": "Dimensions de la largeur de la vue",
		"cze": "ùùrka zobrazenù"
	  },
	  "LateralJumpPerc": {
		"cat": "Perc. de salt lateral",
		"spa": "Porc. de salto lateral",
		"eng": "Lateral jump perc.",
		"fre": "Pourc. de saut latùral",
		"cze": "Bocnù skok perc."
	  },
	  "ShowCleanMap_View": {
		"cat": "Mostra vista del mapa neta",
		"spa": "Muestra vista del mapa limpia",
		"eng": "Show a clean map view",
		"fre": "Afficher une vue de carte propre",
		"cze": "Zobrazenù cistùho zobrazenù mapy"
	  },
	  "ZoomPan_2Clicks": {
		"cat": "Zoom i pan basat en 2 simples clics (ergonùmic)",
		"spa": "Zoom y pan basado en 2 simples clics (ergonùmico)",
		"eng": "Zoom and pan based in 2 simples clicks (ergonomic)",
		"fre": "Zoom et pan basù en 2 simples clics (ergonomique)",
		"cze": "Priblùenù a posun na zùklade 2 jednoduchùch "
	  },
	  "ZoomPan_1ClickDrag": {
		"cat": "Zoom i pan en 1 clic i arrossegant",
		"spa": "Zoom y pan en 1 clic y arrastrando",
		"eng": "Zoom and pan with 1 click and dragging",
		"fre": "Zoom et pan en 1 cliques et glisser",
		"cze": "Priblùenù a posun pomocù 1 kliknutù a taùenù"
	  },
	  "NOfFigures": {
		"cat": "N. decimals",
		"spa": "N. decimales",
		"eng": "N. of decimal figures",
		"fre": "N. dùcimales",
		"cze": "N. desetinnùch cùsel"
	  },
	  "Corners": {
		"cat": "Cantonades",
		"spa": "Esquinas",
		"eng": "Corners",
		"fre": "Coins",
		"cze": "Rohy"
	  },
	  "None_underlined": {
		"cat": "cap",
		"spa": "ninguna",
		"eng": "none",
		"fre": "aucune",
		"cze": "ùùdnù"
	  },
	  "None_underlined_char": {
		"cat": "a",
		"spa": "a",
		"eng": "n",
		"fre": "a",
		"cze": "n"
	  },
	  "Proj_underlined_p": {
		"cat": "Proj",
		"spa": "Proy",
		"eng": "Proj",
		"fre": "Proj",
		"cze": "Proj"
	  },
	  "Proj_underlined_r": {
		"cat": "Proj",
		"spa": "Proy",
		"eng": "Proj",
		"fre": "Proj",
		"cze": "Proj"
	  },
	  "ShowWindow_underlined": {
		"cat": "Mostra finestra",
		"spa": "Muestra ventana",
		"eng": "Show window",
		"fre": "Afficher la fenùtre",
		"cze": "Zobrazit okno"
	  },
	  "ShowWindow_underlined_char": {
		"cat": "m",
		"spa": "m",
		"eng": "h",
		"fre": "f",
		"cze": "h"
	  },
	  "JsonConfigurationFile": {
		"cat": "Fitxer de configuraciù JSON",
		"spa": "Fichero de configuraciùn JSON",
		"eng": "JSON configuration file",
		"fre": "Fichier de configuration JSON)",
		"cze": "Konfiguracnù soubor JSON"
	  },
	  "changesAboveWillBeApplied": {
		"cat": "s'ùaplicaran els canvis anteriors",
		"spa": "los cambios anteriores se aplicarùn",
		"eng": "changes above will be applied",
		"fre": "les modifications ci-dessus s'appliqueront",
		"cze": "vùùe uvedenù zmeny budou pouùity"
	  },
	  "ofChangingParameters": {
		"cat": "de canviar parùmetres",
		"spa": "de cambiar parùmetros",
		"eng": "of changing parameters",
		"fre": "pour changement de paramùtres",
		"cze": "menùcùch se parametru"
	  },
	  "LayersOutSideTheBBox": {
		"cat": "Capes fora de l'ùmbit actual",
		"spa": "Capas fuera del ùmbito actual",
		"eng": "Layers outside the current bounding box",
		"fre": "Calques en dehors de la zone de dùlimitation actuelle",
		"cze": "Vrstvy mimo aktuùlnù ohranicujùcù rùmecek"
	  },
	  "LayersOutSideScale": {
		"cat": "Capes sense suport pel nivell de zoom actual",
		"spa": "Capas sin soporte para el nivel de zoom actual",
		"eng": "Layers without suport for the current zoom level",
		"fre": "Calques sans prise en charge du niveau de zoom actuel",
		"cze": "Vrstvy bez podpory pro aktuùlnù ùroven zvetùenù"
	  },
	  "LayersWithoutSupportCurrentCRS": {
		"cat": "Capes sense suport pel CRS actual",
		"spa": "Capas sin soporte para el CRS actual",
		"eng": "Layers without suport for the current CRS",
		"fre": "Calques sans prise en charge du CRS actuel",
		"cze": "Vrstvy bez podpory aktuùlnùho CRS"
	  }
	},
	"editavec": {
	  "InsertTransactionObjectIntoLayer": {
		"cat": "La transacciù d'inserciù a la capa",
		"spa": "La transacciùn de inserciùn a la capa",
		"eng": "The insert transaction of the object into the layer",
		"fre": "L'opùration d'insertion de l'objet dans la couche",
		"cze": "Transakce vloùenù objektu do "
	  },
	  "hasFailed": {
		"cat": "ha fallat",
		"spa": "ha fallado",
		"eng": "has failed",
		"fre": "a ùchouù",
		"cze": "selhala"
	  },
	  "InsertTransactionObject": {
		"cat": "La transacciù d'inserciù de l'objecte",
		"spa": "La transacciùn de inserciùn del objeto",
		"eng": "The insert transaction of the object",
		"fre": "La transaction d'insertion de l'objet",
		"cze": "Transakce vloùenù objektu"
	  },
	  "successfullyCompleted": {
		"cat": "ha finalitzat amb ùxit",
		"spa": "ha finalizado con ùxito",
		"eng": "has been successfully completed",
		"fre": "a ùtù achevù avec succùs",
		"cze": "byla ùspeùne dokoncena"
	  },
	  "toReportResultTransaction": {
		"cat": "per informar del resultat de la transacciù",
		"spa": "para informar del resultado de la transacciùn",
		"eng": "to report the result of the transaction",
		"fre": "pour rapporter le rùsultat de la transaction",
		"cze": "hlùenù vùsledku transakce"
	  },
	  "ClickOnViewDeterminesCoordNewPoint": {
		"cat": "Un clic sobre la vista determina la coordenada del nou punt. Ompliu en aquesta fitxa les propietats del objecte que conegueu i premeu [D'acord] per enviar el punt al servidor.",
		"spa": "Un clic sobre la vista determina la coordenada del punto nuevo. Rellena en esta ficha los datos del objeto que conozcas y pulsa [Aceptar] para enviar el punto al servidor.",
		"eng": "A click on the view determines the coordinate of the new point. In this tab fill the properties of the feature that you known and press [OK] to send the point to the server.",
		"fre": "Un clic sur la vue dùtermine la coordonnùe du nouveau point. Dans cet onglet remplissez les propriùtùs de la fonctionnalitù que vous connaissez et appuyez sur [Accepter] pour envoyer le point au serveur.",
		"cze": "Kliknutùm na zobrazenù urcùte "
	  }
	},
	"histopie": {
	  "ImageValuesCopiedClipboardFormat": {
		"cat": "Els valors de la imatge han estat copiats al portaretalls en format",
		"spa": "Los valores de la image han sido copiados al portapapeles en formato",
		"eng": "The values of the image have been copied to clipboard in the format",
		"fre": "Les valeurs du graphique ont ùtù copiùes dans le presse-papier dans le format",
		"cze": "Hodnoty obrùzku byly zkopùrovùny "
	  },
	  "ClassDescription": {
		"cat": "Descripciù de classe",
		"spa": "Descripciùn de clase",
		"eng": "Class description",
		"fre": "Description de la classe",
		"cze": "Popis trùdy"
	  },
	  "ClassValue": {
		"cat": "Valor de classe",
		"spa": "Valor de classe",
		"eng": "Class value",
		"fre": "Valeur de classe",
		"cze": "Hodnota trùdy"
	  },
	  "AreaPercentage": {
		"cat": "Percentatge de l'ùrea",
		"spa": "Porcentaje del ùrea",
		"eng": "Percentage of area",
		"fre": "Pourcentage de zone",
		"cze": "Procento plochy"
	  },
	  "ClassCentalValue": {
		"cat": "Valor central de la classe",
		"spa": "Valor central de la classe",
		"eng": "Class cental value",
		"fre": "Classe valeur centrale"
	  },
	  "CountByCategory": {
		"cat": "Recompte per categoria",
		"spa": "Cuenta por categorùa",
		"eng": "Count by category",
		"fre": "Compter par catùgorie",
		"cze": "Pocet podle kategorie"
	  },
	  "AreaByCategory": {
		"cat": "ùrea per categoria",
		"spa": "ùrea por categorùa",
		"eng": "Area by category",
		"fre": "Zone par catùgorie",
		"cze": "Plocha podle kategorie"
	  },
	  "Similarity": {
		"cat": "Semblanùa",
		"spa": "Similitud",
		"eng": "Similarity",
		"fra": "Similitude",
		"cze": "Podobnost"
	  },
	  "MeanPlusDev": {
		"cat": "Mitjana+desv",
		"spa": "Media+desv",
		"eng": "Mean+dev",
		"fre": "Moyenne+ùcart",
		"cze": "Prumer+odchylka"
	  },
	  "MeanMinusDev": {
		"cat": "Mitjana-desv",
		"spa": "Media-desv",
		"eng": "Mean-dev",
		"fre": "Moyenne-ùcart",
		"cze": "Prumer-odchylka"
	  },
	  "ChartValuesCopiedClipboard": {
		"cat": "Els valors del grùfic han estat copiats al portaretalls",
		"spa": "Los valores del grùfico han sido copiados al portapapeles",
		"eng": "The values of the chart have been copied to clipboard",
		"fre": "Les valeurs du graphique ont ùtù copiùes dans le presse-papier",
		"cze": "Hodnoty grafu byly zkopùrovùny do "
	  },
	  "CutTails": {
		"cat": "Retall de cues",
		"spa": "Recorte de colas",
		"eng": "Tail trimming",
		"fre": "Coupe de la queue",
		"cze": "Orezùvùnù ocùsku"
	  }
	},
	"datahora": {
	  "ofData": {
		"cat": "de",
		"spa": "de",
		"eng": "",
		"fre": ""
	  },
	  "PrepMonthOfTheYear0": {
		"cat": "de gener",
		"spa": "de enero",
		"eng": "January",
		"fre": "Janvier",
		"cze": "Leden"
	  },
	  "PrepMonthOfTheYear1": {
		"cat": "de febrer",
		"spa": "de febrero",
		"eng": "February",
		"fre": "Fùvrier",
		"cze": "ùnor"
	  },
	  "PrepMonthOfTheYear2": {
		"cat": "de marù",
		"spa": "de marzo",
		"eng": "March",
		"fre": "Mars",
		"cze": "Brezen"
	  },
	  "PrepMonthOfTheYear3": {
		"cat": "d'abril",
		"spa": "de abril",
		"eng": "April",
		"fre": "Avril",
		"cze": "Duben"
	  },
	  "PrepMonthOfTheYear4": {
		"cat": "de maig",
		"spa": "de mayo",
		"eng": "May",
		"fre": "Mai",
		"cze": "Kveten"
	  },
	  "PrepMonthOfTheYear5": {
		"cat": "de juny",
		"spa": "de junio",
		"eng": "June",
		"fre": "Juin",
		"cze": "Cerven"
	  },
	  "PrepMonthOfTheYear6": {
		"cat": "de juliol",
		"spa": "de julio",
		"eng": "July",
		"fre": "Juillet",
		"cze": "Cervenec"
	  },
	  "PrepMonthOfTheYear7": {
		"cat": "d'agost",
		"spa": "de agosto",
		"eng": "August",
		"fre": "Aoùt",
		"cze": "Srpen"
	  },
	  "PrepMonthOfTheYear8": {
		"cat": "de setembre",
		"spa": "de setiembre",
		"eng": "September",
		"fre": "Septembre",
		"cze": "Zùrù"
	  },
	  "PrepMonthOfTheYear9": {
		"cat": "d'octubre",
		"spa": "de octubre",
		"eng": "October",
		"fre": "Octobre",
		"cze": "Rùjen"
	  },
	  "PrepMonthOfTheYear10": {
		"cat": "de novembre",
		"spa": "de noviembre",
		"eng": "November",
		"fre": "Novembre",
		"cze": "Listopad"
	  },
	  "PrepMonthOfTheYear11": {
		"cat": "de desembre",
		"spa": "de diciembre",
		"eng": "December",
		"fre": "Dùcembre",
		"cze": "Prosinec"
	  },
	  "MonthOfTheYear0": {
		"cat": "Gener",
		"spa": "Enero",
		"eng": "January",
		"fre": "Janvier",
		"cze": "Leden"
	  },
	  "MonthOfTheYear1": {
		"cat": "Febrer",
		"spa": "Febrero",
		"eng": "February",
		"fre": "Fùvrier",
		"cze": "ùnor"
	  },
	  "MonthOfTheYear2": {
		"cat": "Marù",
		"spa": "Marzo",
		"eng": "March",
		"fre": "Mars",
		"cze": "Brezen"
	  },
	  "MonthOfTheYear3": {
		"cat": "Abril",
		"spa": "Abril",
		"eng": "April",
		"fre": "Avril",
		"cze": "Duben"
	  },
	  "MonthOfTheYear4": {
		"cat": "Maig",
		"spa": "Mayo",
		"eng": "May",
		"fre": "Mai",
		"cze": "Kveten"
	  },
	  "MonthOfTheYear5": {
		"cat": "Juny",
		"spa": "Junio",
		"eng": "June",
		"fre": "Juin",
		"cze": "Cerven"
	  },
	  "MonthOfTheYear6": {
		"cat": "Juliol",
		"spa": "Julio",
		"eng": "July",
		"fre": "Juillet",
		"cze": "Cervenec"
	  },
	  "MonthOfTheYear7": {
		"cat": "Agost",
		"spa": "Agosto",
		"eng": "August",
		"fre": "Aoùt",
		"cze": "Srpen"
	  },
	  "MonthOfTheYear8": {
		"cat": "Setembre",
		"spa": "Setiembre",
		"eng": "September",
		"fre": "Septembre",
		"cze": "Zùrù"
	  },
	  "MonthOfTheYear9": {
		"cat": "Octubre",
		"spa": "Octubre",
		"eng": "October",
		"fre": "Octobre",
		"cze": "Rùjen"
	  },
	  "MonthOfTheYear10": {
		"cat": "Novembre",
		"spa": "Noviembre",
		"eng": "November",
		"fre": "Novembre",
		"cze": "Listopad"
	  },
	  "MonthOfTheYear11": {
		"cat": "Desembre",
		"spa": "Diciembre",
		"eng": "December",
		"fre": "Dùcembre",
		"cze": "Prosinec"
	  }
	},
	"barra": {
	  "ZoomIn": {
		"cat": "Acostar",
		"spa": "Acercar",
		"eng": "Zoom in",
		"fre": "Rapprocher",
		"cze": "Priblùenù"
	  },
	  "ZoomOut": {
		"cat": "Allunyar",
		"spa": "Alejar",
		"eng": "Zoom out",
		"fre": "ùloigner",
		"cze": "Zvetùenù a zmenùenù"
	  },
	  "goToCoordinate": {
		"cat": "anar a coordenada",
		"spa": "ir a coordenada",
		"eng": "go to coordinate",
		"fre": "aller ù la coordonnùe",
		"cze": "prejùt na souradnice"
	  },
	  "GoToCoordinate": {
		"cat": "Anar a coordenada",
		"spa": "Ir a coordenada",
		"eng": "Go to coordinate",
		"fre": "Aller ù la coordonnùe",
		"cze": "Prejùt na souradnice"
	  },
	  "previousView": {
		"cat": "vista prùvia",
		"spa": "vista previa",
		"eng": "previous view",
		"fre": "vue prùalable",
		"cze": "predchozù zobrazenù"
	  },
	  "PreviousView": {
		"cat": "Vista prùvia",
		"spa": "Vista previa",
		"eng": "Previous view",
		"fre": "Vue prùalable",
		"cze": "Predchozù zobrazenù"
	  },
	  "generalView": {
		"cat": "vista general",
		"spa": "vista general",
		"eng": "general view",
		"fre": "vue gùnùrale",
		"cze": "obecnù zobrazenù"
	  },
	  "GeneralView": {
		"cat": "Vista general",
		"spa": "Vista general",
		"eng": "General view",
		"fre": "Vue gùnùrale",
		"cze": "Obecnù zobrazenù"
	  },
	  "PanView": {
		"cat": "Mou vista",
		"spa": "Mueve vista",
		"eng": "Pan view",
		"fre": "Dùplace vue",
		"cze": "Pohled na panorama"
	  },
	  "CenterWhereClick": {
		"cat": "Centra on faci clic",
		"spa": "Centra donde haga clic",
		"eng": "Center where click",
		"fre": "Centre où cliquer",
		"cze": "Stredisko, kde kliknete"
	  },
	  "WindowZoom": {
		"cat": "Zoom de finestra",
		"spa": "Zoom de ventana",
		"eng": "Window zoom",
		"fre": "Zoom de fenùtre",
		"cze": "Priblùenù okna"
	  },
	  "NewView": {
		"cat": "Nova vista",
		"spa": "Nova vista",
		"eng": "New view",
		"fre": "Nouvelle vue",
		"cze": "Novù zobrazenù"
	  },
	  "Validation": {
		"cat": "Validaciù",
		"spa": "Validaciùn",
		"eng": "Validation",
		"fre": "Validation",
		"cze": "Overovùnù"
	  },
	  "EditANewPoint": {
		"cat": "Editar un nou punt",
		"spa": "Editar un nuevo punto",
		"eng": "Edit a new point",
		"fre": "ùditer un nouveaux point",
		"cze": "Upravit novù bod"
	  },
	  "TypicalOrObjectQuery": {
		"cat": "Consulta tùpica o per objectes",
		"spa": "Consulta tùpica o por objetos",
		"eng": "Typical or object query",
		"fre": "Recherche typique où par objets",
		"cze": "Typickù nebo objektovù dotaz"
	  },
	  "TimeSeriesAnimations": {
		"cat": "Series temporals i animacions",
		"spa": "Series temporales y animaciones",
		"eng": "Time series and animations",
		"fre": "Sùries chronologiques et animations",
		"cze": "Casovù rady a animace"
	  },
	  "LinkToMap": {
		"cat": "Enllaù al mapa",
		"spa": "Enlace al mapa",
		"eng": "Link to map",
		"fre": "Lien ù la carte",
		"cze": "Odkaz na mapu"
	  },
	  "LinksToServers": {
		"cat": "Enllaùos als servidors",
		"spa": "Enlaces a los servidores",
		"eng": "Links to the servers",
		"fre": "Lien aux serveurs",
		"cze": "Odkazy na servery"
	  },
	  "RestartFromServer": {
		"cat": "Reiniciar des de servidor",
		"spa": "Reiniciar desde servidor",
		"eng": "Restart from server",
		"fre": "Redùmarrer depuis le serveur",
		"cze": "Restart ze serveru"
	  },
	  "InstallMiraMonReader": {
		"cat": "Instalùlar el Lector Universal de Mapes del MiraMon",
		"spa": "Instalar el Lector Universal de Mapas de MiraMon",
		"eng": "Install MiraMon Universal Map Reader",
		"fre": "Installer le Lecteur Universel de Cartes du Miramon",
		"cze": "Instalace univerzùlnù ctecky map MiraMon"
	  }
	},
	"llegenda": {
	  "Legend": {
		"cat": "Llegenda",
		"spa": "Leyenda",
		"eng": "Legend",
		"fre": "Lùgende",
		"cze": "Legenda"
	  },
	  "queryable": {
		"cat": "consultable",
		"spa": "consultable",
		"eng": "queryable",
		"fre": "consultable",
		"cze": "dotazovatelnù"
	  },
	  "nonQueryable": {
		"cat": "no consultable",
		"spa": "no consultable",
		"eng": "non queryable",
		"fre": "non consultable",
		"cze": "nedotazovatelnù"
	  },
	  "downloadable": {
		"cat": "descarregable",
		"spa": "descargable",
		"eng": "downloadable",
		"fre": "tùlùchargeable",
		"cze": "ke staùenù"
	  },
	  "nonDownloadable": {
		"cat": "no descarregable",
		"spa": "no descargable",
		"eng": "no downloadable",
		"fre": "non tùlùchargeable",
		"cze": "bez moùnosti staùenù"
	  },
	  "visible": {
		"cat": "visible",
		"spa": "visible",
		"eng": "visible",
		"fre": "visible",
		"cze": "viditelnù"
	  },
	  "nonVisible": {
		"cat": "no visible",
		"spa": "no visible",
		"eng": "non visible",
		"fre": "non visible",
		"cze": "neviditelnù"
	  },
	  "semitransparent": {
		"cat": "semitransparent",
		"spa": "semitransparente",
		"eng": "semitransparent",
		"fre": "semi transparent",
		"cze": "polopruhlednù"
	  },
	  "foldLegend": {
		"cat": "plega llegenda",
		"spa": "recoge leyenda",
		"eng": "fold legend up",
		"fre": "plie lùgende",
		"cze": "sloùit legendu nahoru"
	  },
	  "unfoldLegend": {
		"cat": "desplega llegenda",
		"spa": "expande leyenda",
		"eng": "unfold legend",
		"fre": "dùplier lùgende",
		"cze": "rozloùit legendu"
	  },
	  "processingService": {
		"cat": "servei de processos",
		"spa": "servicio de procesos",
		"eng": "processing service",
		"fre": "service des processus",
		"cze": "sluùba zpracovùnù"
	  },
	  "animableButNoDate": {
		"cat": "indica que ùs AnimableMultiTime perù no tù dates definides",
		"spa": "indica que es AnimableMultiTime pero no tiene fechas definidas",
		"eng": "indicates that is AnimableMultiTime but it has no dates defined",
		"fre": "Indique que c'est AnimableMultiTime, mais il n'a pas de dates dùfinies",
		"cze": "oznacuje, ùe je AnimableMultiTime, ale nemù "
	  },
	  "NotPossibleDownloadLayersSameGroup": {
		"cat": "No ùs possible descarregar dues capes del mateix grup",
		"spa": "No es posible descargar dos capas del mismo grupo",
		"eng": "It is not possible to download two layers from the same group",
		"fre": "Impossible de tùlùcharger deux couches du mùme groupe",
		"cze": "Nenù moùnù stùhnout dve vrstvy "
	  },
	  "UnknownState": {
		"cat": "Estat no reconegut",
		"spa": "Estado no reconocido",
		"eng": "Unknown state",
		"fre": "ùtat non reconnu",
		"cze": "Neznùmù stùt"
	  }
	},
	"imgrle": {
	  "UnsupportedColor": {
		"cat": "Color no suportat",
		"spa": "Color no suportado",
		"eng": "Unsupported color",
		"fre": "Couleur non supportùe",
		"cze": "Nepodporovanù barva"
	  },
	  "LayerSingleComponentNeedPallette": {
		"cat": "Una capa amb una sola component ha de tenir definits els colors de la paleta",
		"spa": "Una capa con una sola componente debe tener definidos los colores de la paleta",
		"eng": "A layer with a single component must define a pallette of colors",
		"fre": "Une couche d'un composant unique doit avoir dùfini les couleurs de la palette"
	  },
	  "LayerMustHave1or3Components": {
		"cat": "Una capa no pot tenir 2 components. Ha de tenir definides 1 o 3 components.",
		"spa": "Una capa no puede tener 2 componentes. Debe tener definidas 1 o 3 componentes",
		"eng": "A layer can not have 2 component. It must have defined 1 or 3 components",
		"fre": "Une couche ne peut pas avoir deux composants. Vous devez avoir dùfini un ou trois composants",
		"cze": "Vrstva nemuùe mùt 2 sloùky. Musù mùt "
	  },
	  "LayerIMGNoDefinesComponents": {
		"cat": "La capa ha estat demanada com img perù no hi ha components definides al estil actual.",
		"spa": "La capa ha sido solicitada como img pero no tiene componentes definidas en el estilo actual.",
		"eng": "The layer is requested as img but there are no defined components for the current style.",
		"fre": "La couche est requise comme img mais il n'y a pas de composants dùfinis pour le style actuel.",
		"cze": "Vrstva je poùadovùna jako img, ale pro "
	  }
	},
	"miramon": {
	  "NotPossibleShowLayersSameGroup": {
		"cat": "No ùs possible mostrar dues capes del mateix grup",
		"spa": "No es posible mostrar dos capas del mismo grupo",
		"eng": "It is not possible to show two layers from the same group",
		"fre": "Impossible de montrer deux couches du mùme groupe",
		"cze": "Nenù moùnù zobrazit dve vrstvy ze "
	  },
	  "alsoMemberToTheGroup": {
		"cat": "que tambù format part del grup",
		"spa": "que tambiùn forma parte del grupo",
		"eng": "that also is member to the group",
		"fre": "appartenant aussi au groupe",
		"cze": "kterù je takù clenem skupiny"
	  },
	  "willBeDeselected": {
		"cat": "serù desmarcada",
		"spa": "serù desmarcada",
		"eng": "will be deselected",
		"fre": "va ùtre dùsùlectionnùe",
		"cze": "bude zruùen vùber"
	  },
	  "LayerTIFFIMGMustHaveValues": {
		"cat": "Una capa amb FormatImatge image/tiff o application/x-img ha de definir un array de 'valors'",
		"spa": "Una capa con FormatImatge image/tiff o application/x-img debe definir un array de 'valors'",
		"eng": "A layer with FormatImatge image/tiff or application/x-img must define an array of 'valors'",
		"fre": "Une couche avec FormatImatge image/tiff ou application/x-img doit dùfinir un tableau de 'valeurs'",
		"cze": "Vrstva s FormatImatge image/tiff nebo "
	  },
	  "LayerBinaryArrayMustBeHTTPS": {
		"cat": "Una capa amb FormatImatge image/tiff o application/x-img ha de ser servida en https:",
		"spa": "Una capa con FormatImatge image/tiff o application/x-img debe ser servida en https:",
		"eng": "A layer with FormatImatge image/tiff or application/x-img must be provided in https:",
		"fre": "Une couche avec FormatImatge image/tiff ou application/x-img doit ùtre fourni en https",
		"cze": "Vrstva s FormatImatge image/tiff nebo "
	  },
	  "LayerSetToNoVisibleQueriable": {
		"cat": "La capa no es podria carregar i es declara no visible ni consultable",
		"spa": "La capa no es podrùa carregar por lo que declara no visible ni consultable",
		"eng": "The layer will not load so it is declared as neither visible nor queriable",
		"fre": "La couche ne se chargera pas, elle est donc dùclarùe comme ni visible ni interrogeable",
		"cze": "Vrstva se nenacte, takùe nenù "
	  },
	  "ExecuteProcessWPS": {
		"cat": "Executar un proces (WPS)",
		"spa": "Ejecutar un proceso (WPS)",
		"eng": "Execute a process (WPS)",
		"fre": "Exùcuter un processus (WPS)",
		"cze": "Spustit proces (WPS)"
	  },
	  "AddLayerToMap": {
		"cat": "Afegir capa al mapa",
		"spa": "Aùadir capa al mapa",
		"eng": "Add layer to map",
		"fre": "Ajouter une couche ù la carte",
		"cze": "Pridùnù vrstvy do mapy"
	  },
	  "SelectionByCondition": {
		"cat": "Selecciù per condicions",
		"spa": "Selecciùn por condiciùn",
		"eng": "Selection by condition",
		"fre": "Sùlection par condition",
		"cze": "Vùber podle podmùnky"
	  },
	  "TimeSeriesAnalysisAndAnimations": {
		"cat": "Anùlisi de sùries temporals i animacions",
		"spa": "Analisis de series temporales y animaciones",
		"eng": "Time series analysis and animations",
		"fre": "Analyse de sùries chronologiques et animations",
		"cze": "Analùza casovùch rad a animace"
	  },
	  "RequestConsole": {
		"cat": "Consola de peticions",
		"spa": "Consola de peticiones",
		"eng": "Request console",
		"fre": "Console de demandes",
		"cze": "Vyùùdùnù konzoly"
	  },
	  "ReclassifierLayerValues": {
		"cat": "Reclassificadora de valors de la capa",
		"spa": "Reclasificadora de valores de la capa",
		"eng": "Reclassifier of layer values",
		"fre": "Reclassificateur de valeurs de couches",
		"cze": "Reklasifikùtor hodnot vrstev"
	  },
	  "FeedbackContainingStyles": {
		"cat": "Valoracions que contenen estils",
		"spa": "Valoraciones que contienen estilos",
		"eng": "Feedback containing styles",
		"fre": "Rùtroaction contenant des styles",
		"cze": "Zpetnù vazba obsahujùcù styly"
	  },
	  "OpenOrSaveContext": {
		"cat": "Obrir o desar el contexte",
		"spa": "Abrir o guardar el contexto",
		"eng": "Open or save the context",
		"cze": "Otevrenù nebo uloùenù kontextu"
	  },
	  "LinksToOGCServicesBrowser": {
		"cat": "Enllaùos als servidors OGC del navegador",
		"spa": "Enlaces a los servidors OGC del navegador",
		"eng": "Links to OGC services in the browser",
		"fre": "Liens aux serveurs OGC du navigateur",
		"cze": "Odkazy na sluùby OGC v prohlùeci"
	  },
	  "storyMapTitle": {
		"cat": "titol del relat",
		"spa": "tùtulo del ralato",
		"eng": "storymap title",
		"fre": "titre de l'histoire",
		"cze": "nùzev mapy prùbehu"
	  },
	  "InformationHelp": {
		"cat": "Informaciù/Ajuda",
		"spa": "Informaciùn/Ayuda",
		"eng": "Information/Help",
		"fre": "Information/Aide",
		"cze": "Informace/nùpoveda"
	  },
	  "InsertNewPoint": {
		"cat": "Inserir un punt nou",
		"spa": "Insertar un punto nuevo",
		"eng": "Insert new point",
		"fre": "Insùrer un nouveaux point",
		"cze": "Vloùenù novùho bodu"
	  },
	  "ResultOfTheTransaction": {
		"cat": "Resultat de la transacciù",
		"spa": "Resulado de la transacciùn",
		"eng": "Result of the transaction",
		"fre": "Rùsultats de la transaction",
		"cze": "Vùsledek transakce"
	  },
	  "NoPreviousView": {
		"cat": "No hi ha cap vista prùvia a recuperar",
		"spa": "No hay ninguna vista previa a recuperar",
		"eng": "There is no previous view to be shown",
		"fre": "Il n'y a pas une vue prùalable ù rùcupùrer",
		"cze": "Neexistuje ùùdnù predchozù pohled, kterù by se "
	  },
	  "NoFullScreenMultiBrowser": {
		"cat": "No es possible saltar a pantalla completa en un navegador multivista",
		"spa": "No es posible saltar a pantalla completa en un navegador multivista",
		"eng": "You cannot go full screen in a multiview browser",
		"fre": "Vous ne pouvez pas accùder au plein ùcran dans un navigateur ù vues multiples.",
		"cze": "V prohlùeci s vùce zobrazenùmi nelze "
	  },
	  "BrowserPopUpWindowsLocked": {
		"cat": "Aquest navegador tù les finestres emergents bloquejades",
		"spa": "Este navegador tiene las ventanas emergentes bloqueadas",
		"eng": "Sorry, this browser has pop-up windows locked",
		"fre": "Ce navigateur a les fenùtres ùmergentes fermùes",
		"cze": "Omlouvùme se, tento prohlùec mù uzamcenù "
	  },
	  "ChangeBrowserConfig": {
		"cat": "Canvia la configuraciù del teu navegador",
		"spa": "Modifique la configuraciùn de su navegador",
		"eng": "Please change browser configuration",
		"fre": "Changez la configuration de votre navigateur",
		"cze": "Zmente prosùm konfiguraci prohlùece"
	  },
	  "SomeInternetExplorerClickYellowBand": {
		"cat": "En algunes versions d'Internet Explorer, nomùs cal fer un clic sobre la faixa groga superior",
		"spa": "En algunas versiones de Internet Explorer, un clic sobre la banda amarilla superior es suficiente",
		"eng": "In some Internet Explorer versions only a click on top yellow band will fix it",
		"fre": "Dans certaines versions d'Internet Explorer, il suffit de cliquer sur la barre jaune supùrieure",
		"cze": "V nekterùch verzùch Internet "
	  },
	  "FinishValidation": {
		"cat": "Validaciù finalitzada",
		"spa": "Validaciùn finalizada",
		"eng": "Finished validation",
		"fre": "Validation terminùe",
		"cze": "Dokonceno overovùnù"
	  },
	  "MayCloseBrowser": {
		"cat": "Pots tancar el navegador",
		"spa": "Puedes cerrar el navegador",
		"eng": "You may close the browser",
		"fre": "Vous pouvez fermer le navigateur",
		"cze": "Muùete zavrùt prohlùec"
	  },
	  "MainServerBrowser": {
		"cat": "Servidor principal d'aquest navegador",
		"spa": "Servidor principal de este navegador",
		"eng": "Main Server of this browser",
		"fre": "Serveur principal du navigateur",
		"cze": "Hlavnù server tohoto prohlùece"
	  },
	  "OtherServersUsed": {
		"cat": "Altres servidors usats",
		"spa": "Otros servidores usados",
		"eng": "Others servers used",
		"fre": "Autres serveurs utilisùs",
		"cze": "Ostatnù pouùùvanù servery"
	  },
	  "ServerUrlNotDetermine": {
		"cat": "No s'han pogut determinar les adreùes dels servidors usats en aquest navegador",
		"spa": "No se han podido determinar las direcciones de los servidores usados en este navegador",
		"eng": "It could not determine the servers URL used in this browser",
		"fre": "Impossible de dùterminer les adresses des serveurs utilisùs avec ce navigateur",
		"cze": "Nepodarilo se urcit adresu URL serveru "
	  },
	  "OWSContextDocument": {
		"cat": "Document de context OWS",
		"spa": "Documento de contexto OWS",
		"eng": "OWS context document",
		"fre": "Document de contexte OWS",
		"cze": "Kontextovù dokument OWS"
	  },
	  "LinkToView": {
		"cat": "Enllaù a aquesta vista",
		"spa": "Enlace a esta vista",
		"eng": "Link to this view",
		"fre": "Lien ù cette vue",
		"cze": "Odkaz na toto zobrazenù"
	  },
	  "NoMoreZoomOut": {
		"cat": "No hi ha zoom inferior a mostrar",
		"spa": "No hay zoom inferior a mostrar",
		"eng": "There is no more zoom out to be shown",
		"fre": "Il n'y a pas un zoom infùrieur ù montrer",
		"cze": "Nenù moùnù zobrazit dalùù zvetùenù"
	  },
	  "NoMoreZoomIn": {
		"cat": "No hi ha zoom superior a mostrar",
		"spa": "No hay zoom superior a mostrar",
		"eng": "There is no more zoom in to be shown",
		"fre": "Il n'y a pas un zoom supùrieur ù montrer",
		"cze": "Jiù nenù moùnù zobrazit ùùdnù dalùù priblùenù"
	  },
	  "timeSeries": {
		"cat": "de sùries temporals",
		"spa": "de series temporales",
		"eng": "of time series",
		"fre": "pour sùries chronologiques",
		"cze": "casovù rady"
	  },
	  "BinaryPayloadNotFound": {
		"cat": "No trobo BinaryPayload a la resposta GetTile en SOAP",
		"spa": "No encuentro BinaryPayload la respuesta GetTile en SOAP",
		"eng": "BinaryPayload cannot be found on GetTile SOAP answer",
		"fre": "Impossible trouver BinaryPayload ù la rùponse GetTile ù SOAP",
		"cze": "BinaryPayload nelze nalùzt v odpovedi "
	  },
	  "FormatNotFound": {
		"cat": "No trobo Format a la resposta GetTile en SOAP",
		"spa": "No encuentro Format en la respuesta GetTile en SOAP",
		"eng": "Format cannot be found on GetTile SOAP answer",
		"fre": "Impossible trouver Format ù la rùponse GetTile ù SOAP",
		"cze": "V odpovedi GetTile SOAP nelze nalùzt formùt"
	  },
	  "BinaryPayloadAndPayloadContentNotFound": {
		"cat": "No trobo BinaryContent ni PayloadContent a la resposta GetTile en SOAP",
		"spa": "No encuentro BinaryContent ni PayloadContent en la respuesta GetTile en SOAP",
		"eng": "BinaryPayload and PayloadContent cannot be found on GetTile SOAP answer",
		"fre": "Impossible trouver BinaryPayload ou PayloadContent ù la rùponse GetTile ù SOAP",
		"cze": "BinaryPayload a "
	  },
	  "ShowLegend": {
		"cat": "Mostra llegenda",
		"spa": "Muestra legenda",
		"eng": "Show legend",
		"fre": "Afficher la lùgende",
		"cze": "Zobrazit legendu"
	  },
	  "ShowSituationMap": {
		"cat": "Mostra mapa de situaciù",
		"spa": "Muestra mapa de situaciùn",
		"eng": "Show situation map",
		"fre": "Afficher la carte de situation",
		"cze": "Zobrazit situacnù mapu"
	  },
	  "ShowInfoCurrentPosition": {
		"cat": "Mostra informaciù de la posiciù",
		"spa": "Muestra informaciùn sobre la posiciùn",
		"eng": "Show information about current position",
		"fre": "Afficher des informations sur la position actuelle",
		"cze": "Zobrazit informace o aktuùlnù poloze"
	  },
	  "moveNorthWest": {
		"cat": "mou al Nord-Oest",
		"spa": "mover al NorOeste",
		"eng": "move to North-West",
		"fre": "dùplacer vers le Nord-Ouest",
		"cze": "presunout na severozùpad"
	  },
	  "moveNorth": {
		"cat": "mou al Nord",
		"spa": "mover al Norte",
		"eng": "move to North",
		"fre": "dùplacer vers le Nord",
		"cze": "presunout na sever"
	  },
	  "moveNorthEast": {
		"cat": "mou al Nord-Est",
		"spa": "mover al Noreste",
		"eng": "move to North-East",
		"fre": "dùplacer vers le Nord-Est",
		"cze": "presunout na severovùchod"
	  },
	  "moveWest": {
		"cat": "mou a l'Oest",
		"spa": "mover al Oeste",
		"eng": "move to West",
		"fre": "dùplacer vers l'Ouest",
		"cze": "presunout na zùpad"
	  },
	  "moveEast": {
		"cat": "mou a l'Est",
		"spa": "mover al Este",
		"eng": "move to East",
		"fre": "dùplacer vers l'Est",
		"cze": "presunout na vùchod"
	  },
	  "moveSouthWest": {
		"cat": "mou al Sud-Oest",
		"spa": "mover al Suroeste",
		"eng": "move to South-West",
		"fre": "dùplacer vers le Sud-Ouest",
		"cze": "presunout na jihozùpad"
	  },
	  "moveSouth": {
		"cat": "mou al Sud",
		"spa": "mover al Sur",
		"eng": "move to South",
		"fre": "dùplacer vers le Sud",
		"cze": "presunout na jih"
	  },
	  "moveSouthEast": {
		"cat": "mou al Sud-Est",
		"spa": "mover al Sureste",
		"eng": "move to South-East",
		"fre": "dùplacer vers le Sud-Est",
		"cze": "presunout na jihovùchod"
	  },
	  "IncreaseZoomLevel": {
		"cat": "augmenta 1 nivell de zoom",
		"spa": "augmenta 1 nivel de zoom",
		"eng": "increase 1 zoom level",
		"fre": "augmenter 1 niveau de zoom",
		"cze": "zvùùit ùroven priblùenù o 1"
	  },
	  "ReduceZoomLevel": {
		"cat": "redueix 1 nivell de zoom",
		"spa": "reduce 1 nivel de zoom",
		"eng": "reduce 1 zoom level",
		"fre": "rùduire 1 niveau de zoom",
		"cze": "snùit o 1 ùroven priblùenù"
	  },
	  "exitFullScreen": {
		"cat": "sortir de pantalla completa",
		"spa": "salir de pantalla completa",
		"eng": "exit full screen",
		"fre": "Quitter le mode plein ùcran",
		"cze": "ukoncit celou obrazovku"
	  },
	  "fullScreen": {
		"cat": "pantalla completa",
		"spa": "pantalla completa",
		"eng": "full screen",
		"fre": "plein ùcran",
		"cze": "na celou obrazovku"
	  },
	  "StyleNumberNotNumberLayers": {
		"cat": "El nombre d'estils no es correspon amb el nombre de capes",
		"spa": "El nùmero de estilos no se corresponde con el nùmero de capas",
		"eng": "Style number is not the same of the number of layers",
		"fre": "Le nombre de styles ne correspond pas au nombre de couches",
		"cze": "Cùslo stylu nenù stejnù jako pocet "
	  },
	  "CannotFindServerToResponse": {
		"cat": "No s'ha trobat el parùmetre 'SERVERTORESPONSE'",
		"spa": "No se ha encontrado el parùmetro 'SERVERTORESPONSE'",
		"eng": "Cannot find the 'SERVERTORESPONSE' parameter",
		"fre": "Le paramùtre 'SERVERTORESPONSE' n'a pas ùtù trouvù",
		"cze": "Nelze najùt parametr 'SERVERTORESPONSE'"
	  },
	  "CannotFindTestLayers": {
		"cat": "No s'ha trobat el parùmetre 'TEST_LAYERS'",
		"spa": "No se ha encontrado el parùmetro 'TEST_LAYERS'",
		"eng": "Cannot find the 'TEST_LAYERS' parameter",
		"fre": "Le paramùtre 'TEST_LAYERS' n'a pas ùtù trouvù",
		"cze": "\"Nelze najùt parametr \"\"TEST_LAYERS\"\".\""
	  },
	  "CannotFindTestFields": {
		"cat": "No s'ha trobat el parùmetre 'TEST_FIELDS'",
		"spa": "No se ha encontrado el parùmetro 'TEST_FIELDS'",
		"eng": "Cannot find the 'TEST_FIELDS' parameter",
		"fre": "Le paramùtre 'TEST_FIELDS' n'a pas ùtù trouvù",
		"cze": "\"Nelze najùt parametr \"\"TEST_FIELDS\"\".\""
	  },
	  "FieldNumberNotNumberLayers": {
		"cat": "El nombre de camps no es correspon amb el nombre de capes",
		"spa": "El nùmero de campos no se corresponde con el nùmero de capas",
		"eng": "Field number is not the same of the number of layers",
		"fre": "Le nombre de champs ne correspond pas au nombre de couches",
		"cze": "Cùslo pole nenù stejnù jako pocet vrstev"
	  },
	  "ValuesNumberNotNumberLayers": {
		"cat": "El nombre de valors no es correspon amb el nombre de capes",
		"spa": "El nùmero de valores no se corresponde con el nùmero de capas",
		"eng": "Field values number is not the same of the number of layers",
		"fre": "Le nombre de valeurs ne correspond pas au nombre de couches",
		"cze": "Pocet hodnot pole nenù stejnù jako "
	  },
	  "indicatedTestLayerNotExist": {
		"cat": " indicada al parùmetre TEST_LAYERS no existeix",
		"spa": " indicada en el parùmetro TEST_LAYERS no existe",
		"eng": "indicated in TEST_LAYERS parameter does not exist",
		"fre": "indiquùe au paramùtre TEST_LAYERS n'existe pas",
		"cze": "parametr TEST_LAYERS neexistuje"
	  },
	  "RequestedPoint": {
		"cat": "El punt solùlicitat",
		"spa": "El punto solicitado",
		"eng": "The requested point",
		"fre": "Le point requis",
		"cze": "Poùadovanù bod"
	  },
	  "isOutsideBrowserEnvelope": {
		"cat": "estù fora de l'ùmbit de navegaciù",
		"spa": "estù fuera del ùmbito de navegaciùn",
		"eng": "is outside browser envelope",
		"fre": "se trouve dehors le milieu de navigation",
		"cze": "je mimo obùlku prohlùece"
	  },
	  "CannotFindXYParameters": {
		"cat": "No s'ha trobat els parùmetres 'X' i 'Y'.",
		"spa": "No se ha encontrado los parùmetro 'X' y 'Y'.",
		"eng": "Cannot find 'X' and 'Y' parameters.",
		"fre": "Les paramùtres 'X' et 'Y' nùont pas ùtù trouvùs.",
		"cze": "Nelze najùt parametry 'X' a 'Y'."
	  },
	  "TheVersion": {
		"cat": "La versiù de",
		"spa": "La versiùn de",
		"eng": "The version of",
		"fre": "La version",
		"cze": "Verze"
	  },
	  "notAccrodingVersion": {
		"cat": "no es correspon amb la versiù de",
		"spa": "no se corresponde con la versiùn de",
		"eng": "it is not according with the version of",
		"fre": "ne correspond pas ù la version de",
		"cze": "nenù v souladu s verzù"
	  },
	  "UpgradeCorrectly": {
		"cat": "Actualitza't correctament",
		"spa": "Actualicese correctamente",
		"eng": "Please, upgrade it correctly",
		"fre": "S'il vous plaùt, actualisez vous correctement",
		"cze": "Prosùm, aktualizujte jej sprùvne"
	  },
	  "ServerHasNewConfMap": {
		"cat": "El servidor incorpora una configuraciù del mapa mùs nova",
		"spa": "El servidor incorpora una configuraciùn del mapa mùs nueva",
		"eng": "The server has a newer configuration for the map",
		"fre": "Le serveur intùgre une configuration de carte plus rùcente",
		"cze": "Server mù novejùù konfiguraci mapy"
	  },
	  "AcceptToAdopt": {
		"cat": "Acceptes adoptar-la?",
		"spa": "ùAcepta adoptarla?",
		"eng": "Do you accept to adopt it?",
		"fre": "Acceptez-vous de l'adopter",
		"cze": "Souhlasùte s jejùm prijetùm?"
	  },
	  "SavingStatusMapNotPossible": {
		"cat": "No serù possible guardar l'estat del mapa",
		"spa": "No serù posible guardar el estado del mapa",
		"eng": "Saving the status of the map will not possible",
		"fre": "Il ne sera pas possible de sauvegarder le statut de la carte",
		"cze": "Uloùenù stavu mapy nenù moùnù"
	  },
	  "CapaDigiNoLongerSupported": {
		"cat": "CapaDigi ja no se suporta",
		"spa": "CapaDigi ya no se soporta",
		"eng": "CapaDigi no longer supported",
		"fre": "CapaDigi n'est plus pris en charge",
		"cze": "CapaDigi jiù nenù podporovùno"
	  },
	  "UseLayerModelInstead": {
		"cat": "seu una \"capa\" amb \"model\": \"vector\"",
		"spa": "Use una \"capa\" con \"model\": \"vector\"",
		"eng": "Use a \"capa\" with \"model\": \"vector\" instead",
		"fre": "Utilisez un \"capa\" avec le \"model\": \"vector\"",
		"cze": "\"Pouùijte \"\"capa\"\" s \"\"model\"\": mùsto toho "
	  },
	  "ValueIgnoredAttributeShowable": {
		"cat": "El valor serù ignorat i l'atribut marcat com a mostrable",
		"spa": "El valor serù ignorado y el atributo marcado como mostrable",
		"eng": "The value will be ignored and the attribute marked as showable",
		"fre": "La valeur sera ignorùe et l'attribut marquù comme affichable",
		"cze": "Hodnota bude ignorovùna a atribut "
	  },
	  "ZoomSizesSortedBiggerFirst": {
		"cat": "Els costats de zoom han d'estat ordenats amb el mùs gran primer",
		"spa": "Los lados de zoom deben estar ordenados con el mùs grande primero",
		"eng": "The zoom sizes must be sorted with the bigger first",
		"fre": "Les tailles de zoom doivent ùtre triùes par ordre croissant",
		"cze": "Velikosti zvetùenù musù bùt serazeny "
	  },
	  "NivellZoomCostatNotIndicated": {
		"cat": "El NivellZoomCostat no ùs cap del costats indicats a la llista de zooms",
		"spa": "El NivellZoomCostat no es ninguno de los 'costat' indicados en la lista de zooms",
		"eng": "The NivellZoomCostat is not one of the indicated 'costat' in the zoom array",
		"fre": "Le NivellZoomCostat n'est pas l'un des 'costat' indiquùs dans la matrice de zoom",
		"cze": "\"NivellZoomCostat nenù jednou z "
	  },
	  "NotFindBBox": {
		"cat": "No trobo les 4 coordenades a BBOX",
		"spa": "No encuentro las 4 coordenadas en BBOX",
		"eng": "Cannot find 4 coordinates at BBOX",
		"fre": "Impossible de trouver les 4 coordonnùes ù BBOX",
		"cze": "Nelze najùt 4 souradnice v BBOX"
	  },
	  "IndicatedQueryLayers": {
		"cat": "indicada a QUERY_LAYERS",
		"spa": "indicada en QUERY_LAYERS",
		"eng": "indicated at QUERY_LAYERS",
		"fre": "indiquùe ù QUERY_LAYERS",
		"cze": "uvedenù v QUERY_LAYERS"
	  },
	  "butTransparenciaDoesNotAllowIt": {
		"cat": "perù capa.transparencia no permet semitrasparùncia",
		"spa": "pero capa.transparencia no permite semitrasparencia",
		"eng": "but capa.transparencia does not allow semitransparency",
		"fre": "mais capa.transparencia n'autorise pas la semi-transparence",
		"cze": "ale capa.transparencia neumoùnuje "
	  },
	  "andIsInsteadSetTo": {
		"cat": "i en canvi estù definit com a",
		"spa": "y en cambio estù definido como",
		"eng": "and is instead set to",
		"fre": "et est ù la place dùfinie sur",
		"cze": "a mùsto toho je nastavena na hodnotu"
	  },
	  "andIsInsteadSetOtherwise": {
		"cat": "i en canvi estù definida d'una altra manera",
		"spa": "y en cambio estù definido de otra manera",
		"eng": "and is set otherwise",
		"fre": "et est dùfinie autrement",
		"cze": "a jinak je nastavena"
	  }
	},
	"authens": {
	  "Login": {
		"cat": "Iniciar sessiù",
		"spa": "Iniciar sesiùn",
		"eng": "Login",
		"fre": "Se connecter",
		"cze": "Prihlùenù"
	  },
	  "LoginAccountFailed": {
		"cat": "Error o cancelùlaciù de la identificaciù amb el compte de",
		"spa": "Error o cancelaciùn de la identificaciùn en la cuenta de",
		"eng": "Login in your account failed or cancelled in",
		"fre": "La connexion ù votre compte a ùchouù ou a ùtù annulùe dans",
		"cze": "Prihlùenù k ùctu se nezdarilo nebo bylo zruùeno "
	  },
	  "ContinueWithoutAuthentication": {
		"cat": "Vols continuar sense autentificaciù",
		"spa": "Desea continuar sin autentificaciùn",
		"eng": "Do you what to continue without authentication",
		"fre": "Faites-vous quoi continuer sans authentification",
		"cze": "Chcete pokracovat bez overenù"
	  },
	  "SessionsAlreadyStarted": {
		"cat": "Les sessions han estat ja iniciades",
		"spa": "Las sesiones han sido ya iniciadas",
		"eng": "The sessions were already started",
		"fre": "Les sùances ùtaient dùjù commencùes",
		"cze": "Relace jiù byly zahùjeny"
	  },
	  "CloseTheStartedSessions": {
		"cat": "Vols tancar les sessions iniciades?",
		"spa": "ùDesea cerrar las sesiones iniciadas?",
		"eng": "Do you want to close the started sessions?",
		"fre": "Voulez-vous fermer les sessions ouvertes?",
		"cze": "Chcete ukoncit zahùjenù relace?"
	  },
	  "BrowserContainsLayersRequireLogin": {
		"cat": "Aquest navegador contù capes que requereixen inici de sessiù",
		"spa": "Este navegador contiene capas que requieren inicio de sesiùn",
		"eng": "This browser contains layers that require login",
		"fre": "Ce navigateur contient des couches qui nùcessitent une connexion",
		"cze": "Tento prohlùec obsahuje vrstvy, "
	  },
	  "DoYouWantToLogInNow": {
		"cat": "Vols iniciar sessiù ara?",
		"spa": "ùDesea iniciar sesiùn ahora?",
		"eng": "Do you want to log in now?",
		"fre": "Voulez-vous vous connecter maintenant?",
		"cze": "Chcete se nynù prihlùsit?"
	  }
	},
	"llinatge": {
	  "Process": {
		"cat": "Procùs",
		"spa": "Proceso",
		"eng": "Process",
		"fre": "Processus",
		"cze": "Proces"
	  },
	  "Processes": {
		"cat": "Processos",
		"spa": "Procesos",
		"eng": "Processes",
		"fre": "Processus",
		"cze": "Procesy"
	  },
	  "ProcessGroup": {
		"cat": "Grup de processos",
		"spa": "Grupo de procesos",
		"eng": "Process group",
		"fre": "Groupe de processus",
		"cze": "Skupina procesu"
	  },
	  "ResultingDataset": {
		"cat": "Capa Resultat",
		"spa": "Capa Resultado",
		"eng": "Resulting dataset",
		"fre": "Jeu de donnùes rùsultant",
		"cze": "Vùslednù soubor dat"
	  },
	  "GroupWithFollowing": {
		"cat": "Agrupar amb el seguùnt",
		"spa": "Agrupar con el seguiente",
		"eng": "Group with the following",
		"fre": "Grouper avec le suivant",
		"cze": "Skupina s nùsledujùcùmi ùdaji"
	  },
	  "GroupWithPrevious": {
		"cat": "Agrupar amb l'anterior",
		"spa": "Agrupar con el anterior",
		"eng": "Group with the previous",
		"fre": "Grouper avec le prùcùdent",
		"cze": "Skupina s predchozùm"
	  },
	  "UngroupRecentLevel": {
		"cat": "Desagrupa un nivell mùs recent",
		"spa": "Desagrupar un nivel mùs reciente",
		"eng": "Ungroup a more recent level",
		"fre": "Dissocier un niveau plus rùcent",
		"cze": "Odskupenù s novejùù ùrovnù"
	  },
	  "UngroupOlderLevel": {
		"cat": "Desagrupa un nivell mùs antic",
		"spa": "Desagrupar un nivel mùs antiguo",
		"eng": "Ungroup an older level",
		"fre": "Dissocier un niveau plus ancien",
		"cze": "Odskupenù starùù ùrovne"
	  },
	  "VisibleElements": {
		"cat": "Elements visibles",
		"spa": "Elementos visibles",
		"eng": "Visible elements",
		"fre": "ùlùments visibles",
		"cze": "Viditelnù prvky"
	  },
	  "InternalSources": {
		"cat": "Fonts intermitges/temporals",
		"spa": "Fuentes intermedias/temporales",
		"eng": "Internal/temporary sources",
		"fre": "Sources intermùdiaires / temporaires",
		"cze": "Internù/docasnù zdroje"
	  },
	  "LeafSources": {
		"cat": "Fonts fulles",
		"spa": "Fuentes hoja",
		"eng": "Leaf sources",
		"fre": "Sources feuilles",
		"cze": "Listovù zdroje"
	  },
	  "ProcessSteps": {
		"cat": "Passos del procùs",
		"spa": "Pasos del proceso",
		"eng": "Process steps",
		"fre": "ùtapes du processus",
		"cze": "Kroky procesu"
	  },
	  "ProcessingTools": {
		"cat": "Eines de processament",
		"spa": "Herramientas de procesamiento",
		"eng": "Processing tools",
		"fre": "Outils de traitement",
		"cze": "Zpracovatelskù nùstroje"
	  },
	  "TheUnion": {
		"cat": "La uniù",
		"spa": "La uniùn",
		"eng": "The union",
		"fre": "L'union",
		"cze": "Svaz"
	  },
	  "DatasetsIndependentsGraphs": {
		"cat": "Cada capa en un grùfic independent",
		"spa": "Cada capa en un grùfico independiente",
		"eng": "Datasets as independents graphs",
		"fre": "Chaque couche sur un graphique sùparù",
		"cze": "Datovù sady jako nezùvislù grafy"
	  },
	  "TheIntersection": {
		"cat": "La intersecciù",
		"spa": "La intersecciùn",
		"eng": "The intersection",
		"fre": "l'intersection",
		"cze": "Prunik"
	  },
	  "TheComplementIntersection": {
		"cat": "El complement de la intersecciù",
		"spa": "El complemento de la intersecciùn",
		"eng": "The complement of the intersection",
		"fre": "Le complùment de l'intersection",
		"cze": "Doplnek pruniku"
	  },
	  "TheSubstractionFirst": {
		"cat": "La resta de la primera",
		"spa": "La resta del primero",
		"eng": "The substraction of the first",
		"fre": "La soustraction de la premiùre"
	  },
	  "MoreOneDataset": {
		"cat": "Quan hi ha mùs d'una capa",
		"spa": "Cuando hay mùs de una capa",
		"eng": "When more than one dataset",
		"fre": "Quand il y a plus d'une couche",
		"cze": "Kdyù je vùce neù jedna datovù sada"
	  },
	  "SimpleQuery": {
		"cat": "Consulta simple",
		"spa": "Consulta simple",
		"eng": "Simple query",
		"fre": "Requùte simple",
		"cze": "Jednoduchù dotaz"
	  },
	  "StartNode": {
		"cat": "Node inicial",
		"spa": "Nodo inicial",
		"eng": "Start node",
		"fre": "Noeud initial",
		"cze": "Pocùtecnù uzel"
	  },
	  "EndNode": {
		"cat": "Node final",
		"spa": "Nodo final",
		"eng": "End node",
		"fre": "Noeud finale",
		"cze": "Koncovù uzel"
	  },
	  "ComplexQuery": {
		"cat": "Consulta complexa",
		"spa": "Consulta compleja",
		"eng": "Complex query",
		"fre": "Requùte complexe",
		"cze": "Komplexnù dotaz"
	  },
	  "QueryFilterOptions": {
		"cat": "Opcions de visualitzaciù, consulta i filtre",
		"spa": "Opciones de visualizaciùn, consulta y filtro",
		"eng": "Show, query and filter options",
		"fre": "Options de visualisation, consultations et filtrage",
		"cze": "Moùnosti zobrazenù, dotazovùnù a filtrovùnù"
	  }
	},
	"owsc": {
	  "EmptyGeospatialContent": {
		"cat": "Aquesta entrada no tù cap contingut geoespacial (cap etiqueta 'offering' definida)",
		"spa": "Esta entrada carece de contenido geoespacial (ninguna etiqueta 'offering' definida)",
		"eng": "This entry is empty of geospatial content (no 'offering' tag defined)",
		"fre": "Cette entrùe manque du contenu gùospatial (aucune ùtiquette 'offering' dùfinie)",
		"cze": "\"Tento zùznam neobsahuje geoprostorovù obsah "
	  },
	  "NonComptibleCRS": {
		"cat": "Sistema de referùncia de coordenades no compatible.",
		"spa": "Sistema de referencia de coordenadas no compatible.",
		"eng": "Non-compatible Coordinate Reference System.",
		"fre": "Systùme de rùfùrence de coordonnùes non compatible.",
		"cze": "Nekompatibilnù souradnicovù referencnù systùm."
	  },
	  "FormatWhereNotHaveEnvelope": {
		"cat": "El format de 'where' no inclou cap 'Envelope' o 'Polygon' de 2 o mùs punts",
		"spa": "El formato de 'where' no incluye ningùn 'Envelope' o 'Polygon' de 2 o mùs puntos",
		"eng": "The format of 'where' do not have any 'Envelope' or 'Polygon' of 2 or more points",
		"fre": "Le format de 'where' n'inclut pas de 'Envelope' ou ' Polygon ' de 2 ou plus de points",
		"cze": "\"Formùt \"\"kde\"\" nemù ùùdnù \"\"Envelope\"\" "
	  },
	  "NonSupportedOperation": {
		"cat": "'Operation' no acceptada",
		"spa": "'Operation' no soportada",
		"eng": "Non supported operation",
		"fre": "'Operation' non supportùe",
		"cze": "Nepodporovanù operace"
	  },
	  "NonSupportedOperationMethod": {
		"cat": "Mùtode d'operaciù",
		"spa": "Mùtodo de operaciùn",
		"eng": "Non supported operation method",
		"fre": "Mùthode d'opùration",
		"cze": "Nepodporovanù operacnù metoda"
	  },
	  "OnlyGetSupported": {
		"cat": "no acceptat (nomùs GET ùs acceptat actualment)",
		"spa": "no aceptado (sùlo GET es soportado actualmente)",
		"eng": "(only GET is currently supported)",
		"fre": "non acceptùe (seulement 'GET' est actuellement supportùe)",
		"cze": "(v soucasnù dobe je podporovùna pouze operace GET)"
	  },
	  "AttributeHrefNotFound": {
		"cat": "L'atribut 'href' no s'ha trobat en l'operaciù",
		"spa": "El atributo 'href' no se encontrù en la operaciùn",
		"eng": "Attribute 'href' was not found in the operation",
		"fre": "L'attribut 'href' n'a pas ùtù trouvù dans l'opùration",
		"cze": "V operaci nebyl nalezen atribut 'href'."
	  },
	  "requestUrlCannotObtained": {
		"cat": "la 'requestURL' no es pot obtenir",
		"spa": "la 'requestURL' no se puede obtener",
		"eng": "the 'requestURL' cannot be obtained",
		"fre": "le 'requestURL' ne peut pas ùtre obtenu",
		"cze": "nelze zùskat 'requestURL'"
	  },
	  "MissingMandatoryCodeAttribute": {
		"cat": "Falta l'atribut obligatori 'code' en l' 'offering' de",
		"spa": "Falta el atributo obligatorio 'code' en el 'offering' de",
		"eng": "Missing mandatory 'code' attribute on offering",
		"fre": "Manque l'attribut obligatoire 'code' sur l' 'offereing' de",
		"cze": "\"Chybù povinnù atribut \"\"code\"\" pri "
	  },
	  "NonSupportedOfferingType": {
		"cat": "Tipus d''offering' no acceptat",
		"spa": "Tipo de 'offering' no soportado",
		"eng": "Non supported offering type",
		"fre": "Type d' 'offering' non supportù",
		"cze": "Nepodporovanù typ nabùdky"
	  },
	  "OwsContextDocumentNotHaveFeed": {
		"cat": "El document de context OWS no tù \"feed\" com a node arrel.",
		"spa": "El documento de contexto OWS no tiene \"feed\" como nodo raiz.",
		"eng": "The OWS context document does not have \"feed\" as a root node.",
		"fre": "Le document de context OWS n'a pas \"feed\" comme un noeud racine.",
		"cze": "\"Kontextovù dokument OWS nemù jako "
	  },
	  "DisabledLayersCannotOpened": {
		"cat": "Les capes inactives no es poden obrir (moure el punter per sobre del nom mostrarù una descripciù del motiu)",
		"spa": "Las capas inactivas no se pueden abrir (mover el puntero por encima del nombre mostrarù una descripciùn del motivo)",
		"eng": "Disabled layers cannot be opened (move the cursor over the layer name will make appear a description of the reason)",
		"fre": "Les couches inactives ne peuvent pas ùtre ouvertes (mouvoir le pointeur sur le nom montrera une description du motif)",
		"cze": "Zakùzanù vrstvy nelze otevrùt (po najetù "
	  },
	  "OwscDocumentNotStandardCompliant": {
		"cat": "El teu document OWSC no serù compatible amb l'estùndard ja que no has proporcionat un tùtol vùlid",
		"spa": "Su documento OWSC no serù compatible con el estùndar ya que no ha proporcionado un tùtulo vùlido",
		"eng": "Your OWSC document will not be standard compliant as you have not provided a valid title",
		"fre": "Votre document OWSC ne sera pas conforme avec le norme car vous n'avez pas fourni un titre valable",
		"cze": "Vù dokument OWSC nebude v souladu se "
	  },
	  "DownloadOwscDocument": {
		"cat": "Descarrega document OWSC",
		"spa": "Descarga documento OWSC",
		"eng": "Download OWSC document",
		"fre": "Tùlùchargez document OWSC",
		"cze": "Stùhnete si dokument OWSC"
	  },
	  "LanguageWhichDocumentingOws": {
		"cat": "Llengua en quù s'estù documentant aquest arxiu OWS Context",
		"spa": "Idioma en el que se estù documentando este archivo OWS Context",
		"eng": "Language at which you are documenting this OWS Context file",
		"fre": "La langue ù lequel vous documentez ce fichier de Contexte OWS",
		"cze": "Jazyk, ve kterùm dokumentujete tento OWS "
	  },
	  "TitleContextDocument": {
		"cat": "Un tùtol per al document de context",
		"spa": "Un tùtulo para el documento de contexto",
		"eng": "A title for the Context document",
		"fre": "Un titre pour le document de context",
		"cze": "Nùzev kontextovùho dokumentu"
	  },
	  "DescriptionContextDocumentContent": {
		"cat": "Descripciù de la finalitat o el contingut del document de context",
		"spa": "Descripciùn de la finalidad o el contenido del documento de contexto",
		"eng": "Description of the Context document purpose or content",
		"fre": "Description du but ou du contenu du document de context",
		"cze": "Popis ùcelu nebo obsahu "
	  },
	  "EntityResponsibleMakingContextDoc": {
		"cat": "Una entitat directament responsable de crear el document de context (en general tu o la teva organitzaciù)",
		"spa": "Una entidad directamente responsable de crear el documento de contexto (por lo general usted o su organizaciùn)",
		"eng": "An entity primarily responsible for making the Context Document (usually you or your organisation)",
		"fre": "Une entitù principalement responsable de faire le document de contexte (d'habitude vous ou votre organisation)",
		"cze": "Subjekt primùrne odpovednù za "
	  },
	  "IdentifiePublisherContextDoc": {
		"cat": "Identificador de l'editor del document de context",
		"spa": "Identificador del editor del documento de contexto",
		"eng": "Identifier for the publisher of the Context document",
		"fre": "Identifiant de l'ùditeur du document de contexte",
		"cze": "Identifikùtor vydavatele kontextovùho "
	  },
	  "RightsOverContextDoc": {
		"cat": "Drets sobre el document de context",
		"spa": "Derechos sobre el documento de contexto",
		"eng": "Rights over the context document",
		"fre": "Les droits sur le document de contexte",
		"cze": "Prùva ke kontextovùmu dokumentu"
	  },
	  "InformationRightsContextDoc": {
		"cat": "Informaciù sobre els drets continguts en i sobre el document de context",
		"spa": "Informaciùn sobre los derechos contenidos en y sobre el documento de contexto",
		"eng": "Information about rights held in and over the Context document",
		"fre": "Informations sur les droits dùtenus dans et sur le document de contexte",
		"cze": "Informace o prùvech, kterù jsou drùena v "
	  },
	  "NotPossibleLoadContextDoc": {
		"cat": "El document de context no s'ha pogut carregar",
		"spa": "El documento de contexto no se ha podido cargar",
		"eng": "It was not possible to load the context document",
		"fre": "Il n'ùtait pas possible de charger le document de contexte",
		"cze": "Kontextovù dokument nebylo moùnù nacùst"
	  },
	  "StateMapBrowserSavedOwsContextDocumentStandard": {
		"cat": "L'estat actual del navegador de mapes es desarù mitjanùant l'estùndar de documents de context OWS",
		"spa": "El estado actual del navegador de mapas se guardarù usando el estùndar de documentos de contexto OWS",
		"eng": "The current state of the map browser will be saved using the OWS Context document standard",
		"fre": "L'ùtat actuel du navigateur des cartes sera sauvù utilisant la norme de document de Contexte OWS",
		"cze": "Aktuùlnù stav mapovùho "
	  },
	  "MayRestoreUsingFileOrOwsCompliantClient": {
		"cat": "El podrù restaurar mùs tard usant el fitxer amb aquest navegador de mapes o qualsevol altre client compatible amb OWS",
		"spa": "Lo podrù restaurar mùs tarde usando el archivo con este navegador de mapas o cualquier cliente compatible con OWS",
		"eng": "You may restore it later using the file in this map browser or any other OWS compliant client",
		"fre": "Vous pouvez le reconstituer pour utiliser plus tard le fichier dans ce navigateur des cartes ou un autre client conforme OWS",
		"cze": "Pozdeji jej muùete obnovit "
	  }
	},
	"paleta": {
	  "WrongColorIndex": {
		"cat": "ùndex de color incorrecte",
		"spa": "ùndice de color incorrecto",
		"eng": "Wrong color index",
		"fre": "Index de couleur incorrect",
		"cze": "ùpatnù barevnù index"
	  },
	  "ColorIndicesHaveToBe": {
		"cat": "Els ùndexs de color han d'anar de 0 a 255",
		"spa": "Los ùndices de color deberian ir entre 0 y 255",
		"eng": "Color indices have to be between 0 and 255",
		"fre": "Les valeurs des index de couleurs doivent ùtre comprises entre 0 et 255",
		"cze": "Barevnù indexy musù bùt v rozmezù 0 aù 255."
	  },
	  "ColorNotObjectInFormat": {
		"cat": "Aquest color no es un objecte RGB en format",
		"spa": "Este color no es un objecto RGB en formato",
		"eng": "This color is not an object in the format",
		"fre": "Cette couleur n'est pas un objet au format",
		"cze": "Tato barva nenù objektem ve formùtu"
	  },
	  "HastagColorIndices": {
		"cat": "Els ### sùn ùndexs de color que han d'anar de 0 a 255.",
		"spa": "Los ### sùn ùndices de color deberian ir entre 0 y 255.",
		"eng": "The ### are Color indices that have to be between 0 and 255.",
		"fre": "Les ### sont des indices de couleur qui doivent ùtre compris entre 0 et 255",
		"cze": "### jsou barevnù indexy, kterù musù bùt mezi 0 a "
	  }
	},
	"qualitat": {
	  "QualityOfLayer": {
		"cat": "Qualitat de la capa",
		"spa": "Calidad de la capa",
		"eng": "Quality of the layer",
		"fre": "Qualitù de la couche",
		"cze": "Kvalita vrstvy"
	  },
	  "ComplexDefinitionOfStyle": {
		"cat": "En desenvolupament: definiciù complexa de l'estil que no permet actualment crear el seu identificador ni, per tant, crear valoracions sobre el mateix",
		"spa": "En desarollo: definiciùn compleja del estilo que no permite crear actualmente su identificador ni, por tanto, crear valoraciones sobre el mismo",
		"eng": "To be developed: complex definition of the style that does not allow to create its identifier nor, therefore, to create feedbacks about it",
		"fre": "ù dùvelopper: dùfinition complexe du style qui ne permet pas de crùer son identifiant ni, par consùquent, de crùer des valorisations sur le mùme",
		"cze": "K rozpracovùnù: komplexnù definice "
	  },
	  "UnexpectedDefinitionOfStyle": {
		"cat": "Definiciù inesperada de l'estil que no permet crear el seu identificador ni, per tant, crear valoracions sobre el mateix",
		"spa": "Definiciùn inesperada del estilo que no permite crear su identificador ni, por tanto, crear valoraciones sobre el mismo",
		"eng": "Unexpected definition of the style that does not allow to create its identifier nor, therefore, to create feedbacks about it",
		"fre": "Dùfinition inattendue du style qui ne permet pas de crùer son identifiant ni, par consùquent, de crùer des valorisations sur le mùme",
		"cze": "Neocekùvanù definice stylu, kterù "
	  },
	  "UnexpectedDefinitionOfFeedback": {
		"cat": "Definiciù inesperada de la valoraciù",
		"spa": "Definiciùn inesperada de la valoraciùn",
		"eng": "Unexpected definition of the feedback item",
		"fre": "Dùfinition inattendue du ùlùment de rùtroaction",
		"cze": "Neocekùvanù definice poloùky "
	  },
	  "StyleCannotImported": {
		"cat": "No es pot importar l'estil",
		"spa": "No se puede importar el estilo",
		"eng": "The style cannot be imported",
		"fre": "Le style ne peut pas ùtre importù",
		"cze": "Styl nelze importovat"
	  },
	  "FeedbackNotValidReproducibleDescription": {
		"cat": "Aquesta valoraciù no contù una descripciù d'ùs reproduible vùlida per a aquest navegador de mapas, versiù o esquema",
		"spa": "Esta valoraciùn no contiene una descripciùn de uso reproducible vùlida para este navegador de mapas, versiùn o esquema",
		"eng": "This feedback item does not contain a valid reproducible usage description for this web map browser, version or schema",
		"fre": "Cet ùlùment de rùtroaction ne contient pas de description d'utilisation reproductible valide pour ce navigateur de carte web, cette version ou ce schùma",
		"cze": "Tato poloùka zpetnù vazby "
	  },
	  "NoObservationsValidObtainValidity": {
		"cat": "No hi ha observacions amb valors vùlids per obtenir la vùlidessa temporal en aquesta ùrea",
		"spa": "No hay observaciones con valores vùlidos para obtener la validez temporal en esta ùrea",
		"eng": "There is no observations with valid values to obtain temporal validity in this area",
		"fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la validitù temporelle dans ce domaine",
		"cze": "V tùto oblasti neexistujù ùùdnù "
	  },
	  "ConsistencyBasedOnComparisonObservation": {
		"cat": "La validessa temporal resumida estù basada en la comparaciù de la data de cada observaciù individual indicada a l'atribut",
		"spa": "La validez temporal estù basada en la comparaciùn de la fecha de cada observaciùn individual indicada por el atributo",
		"eng": "The temporal consistency is based on the comparison of the date of each individual observation as indicated in the field",
		"fre": "La cohùrence temporelle est basùe sur la comparaison de la date de chaque observation individuelle telle qu'elle est indiquùe dans le champ",
		"cze": "Casovù shoda je zaloùena "
	  },
	  "dataIntervalSpecified": {
		"cat": "amb l'interval especificat",
		"spa": "con el intervalo especificado",
		"eng": "against the data interval specified",
		"fre": "against the data interval specified",
		"cze": "s uvedenùm datovùm intervalem"
	  },
	  "notValdityInformation": {
		"cat": "que no tenen informaciù sobre la validessa",
		"spa": "que no tienen informaciùn sobre la validez",
		"eng": "that does not have validity information",
		"fre": "qui n'ont pas d'informations de la validitù",
		"cze": "kterù nemù informace o platnosti"
	  },
	  "NoObservationsValidityPositions": {
		"cat": "No hi ha observacions amb valors vùlids per obtenir la validessa de les posicions de les observacions en aquesta ùrea",
		"spa": "No hay observaciones con valores vùlidos para obtener la validez de las posiciones de las observaciones en esta ùrea",
		"eng": "There is no observations with valid values to obtain the validity of the positions of observations in this area",
		"fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la validitù des positions des observations dans ce domaine",
		"cze": "Neexistujù ùùdnù pozorovùnù s "
	  },
	  "DomainConsistencyOnLocationIndividual": {
		"cat": "La consistùncia del domini resumida estù basada en la localitzaciù de cada observaciù individual present en la vista actual comparada amb l'ùmbit especificat",
		"spa": "La consistencia del dominio resumida estù basada en la localizaciùn de cada observaciùn individual present en la vista actual comparada con el ùmbito especificado",
		"eng": "The domain consistency is based on the localization of each individual observation present in the actual view against the envelope specified",
		"fre": "La cohùrence du domaine est basùe sur la localisation de chaque observation individuelle prùsente dans la vue rùelle par rapport ù l'enveloppe spùcifiùe",
		"cze": "Konzistence oblasti je "
	  },
	  "NoObservationsLogicalConsistency": {
		"cat": "No hi ha observacions amb valors vùlids per obtenir la consistùncia lùgica dels atributs en aquesta ùrea",
		"spa": "No hay observaciones con valores vùlidos para obtener la consistencia lùgica de los atributos en esta ùrea",
		"eng": "There is no observations with valid values to obtain logical consistency of attributes in this area",
		"fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la cohùrence logique des attributs dans ce domaine",
		"cze": "Neexistujù ùùdnù pozorovùnù s "
	  },
	  "OverallConsistencyComparisonIndividualObservation": {
		"cat": "La consistùncia resumida estù basada en la comparaciù dels valors de cada observaciù pels atribut/s",
		"spa": "La consistùncia resumida estù basada en la comparaciùn de los valores de cada observaciùn individual para los atributo/s",
		"eng": "The overall consistency is based on the comparison of the values of each individual observation for the field/s",
		"fre": "La cohùrence globale est basùe sur la comparaison des valeurs de chaque observation individuelle pour les champ/s",
		"cze": "Celkovù "
	  },
	  "listPossibleValuesDomain": {
		"cat": "contra la llista de valors possibles especificada al domini",
		"spa": "contra la lista de valores posibles especificada en el dominio",
		"eng": "against the list of possible values specified in the domain",
		"fre": "against the list of possible values specified in the domain",
		"cze": "se seznamem moùnùch hodnot uvedenùch v "
	  },
	  "notConsistencyInformationSpecifiedAttributes": {
		"cat": "que no tenen informaciù sobre la consistùncia, perquù no tenen els atributs indicats.",
		"spa": "que no tienen informaciùn sobre la consistùncia, porque no tienen los atributos indicados.",
		"eng": "that does not have consistency information, because it does not have the specified attributes.",
		"fre": "qui n'ont pas d'informations de coherùnce, parce qu'ils n'ont pas les attributs.",
		"cze": "kterù nemù informace "
	  },
	  "NoObservationsPositionalUncertainty": {
		"cat": "No hi ha observacions amb incertesa posicional en aquesta ùrea",
		"spa": "No hay observaciones con incertidumbre posicional en esta ùrea",
		"eng": "There is no observations with positional uncertainty in this area",
		"fre": "Il n'y a pas d'observations avec une incertitude de position dans ce domaine",
		"cze": "V tùto oblasti nejsou ùùdnù "
	  },
	  "computeDataQuality": {
		"cat": "per calcular la qualitat de la capa",
		"spa": "para calcular la calidad de la capa",
		"eng": "to compute data quality for the layer",
		"fre": "pour calculer la qualitù des donnùes pour la couche",
		"cze": "pro vùpocet kvality dat pro vrstvu"
	  },
	  "AccuracyPositionalUncertainty": {
		"cat": "La exactitud resumida estù basada en la incertesa posicional de cada observaciù individual indicada a l'atribut",
		"spa": "La exactitud resumida estù basada en la incertidumbre posicional de cada observaciùn individual indicada en el atributo",
		"eng": "The overall accuracy is based on the positional uncertainty for each indiviadual observation as indicated in the field",
		"fre": "The overall accuracy is based on the positional uncertainty for each indiviadual observation as indicated in the field",
		"cze": "Celkovù presnost je zaloùena na "
	  },
	  "noUncertaintyInformation": {
		"cat": "que no tenen informaciù sobre la incertesa",
		"spa": "que no tienen informaciùn sobre la incertidumbre",
		"eng": "that does not have uncertainty information",
		"fre": "qui n'a pas d'information sur l'incertitude",
		"cze": "kterù nemù informace o nejistote"
	  },
	  "InitialDateNotBlank": {
		"cat": "La data inicial no pot es pot deixar en blanc",
		"spa": "La fecha inicial no puede dejarse en blaco",
		"eng": "The initial date cannot be left blank",
		"fre": "La date finitiale ne peut pas ùtre laissùe en blanc",
		"cze": "Pocùtecnù datum nelze ponechat prùzdnù"
	  },
	  "FinalDateNotBlank": {
		"cat": "La data final no pot es pot deixar en blanc",
		"spa": "La fecha final no puede dejarse en blaco",
		"eng": "The final date cannot be left blank",
		"fre": "La date finale ne peut pas ùtre laissùe en blanc",
		"cze": "Konecnù datum nelze ponechat prùzdnù"
	  },
	  "FinalDateNotLessInitialDate": {
		"cat": "La data final no pot ser inferior a la inicial",
		"spa": "La fecha final no puede ser inferior a la inicial",
		"eng": "The final date cannot be less than the initial date",
		"fre": "La date finale ne peut pas ùtre infùrieure ù la date initiale",
		"cze": "konecnù datum nesmù bùt kratùù neù "
	  },
	  "QualityParamAvailableMenu": {
		"cat": "El parùmetre de qualitat calculat estù disponible a la entrada de menù contextual 'qualitat' de la capa",
		"spa": "El parùmetro de calidad calculado estù disponible en la entrada de menù contextual 'calidad' de la capa",
		"eng": "The calculated quality parameter is available as an entry in the context menu entry 'quality' of the layer",
		"fre": "Le paramùtre de qualitù calculù est disponible en tant qu'entrùe dans l'entrùe du menu contextuel 'qualitù' de la couche",
		"cze": "\"Vypoctenù parametr kvality je k "
	  },
	  "QualityNotComputedLayer": {
		"cat": "No s'ha pogut calcular la qualitat de la capa",
		"spa": "No se ha podido calcular la calidad de la capa",
		"eng": "The quality cannot be computed for the layer",
		"fre": "La qualitù ne peut pas ùtre calculùe pour la couche",
		"cze": "Pro vrstvu nelze vypocùtat kvalitu"
	  },
	  "FieldPositionalUncertainty": {
		"cat": "Camp d'incertesa posicional",
		"spa": "Campo de incertidumbre posicional",
		"eng": "Field of positional uncertainty",
		"fre": "Champ d'incertitude de position",
		"cze": "Pole polohovù nejistoty"
	  },
	  "FieldsVerifyLogicalConsistency": {
		"cat": "Atributs a verificar la consistùncia lùgica",
		"spa": "Atributos a verificar la consistencia lùgica",
		"eng": "Fields to verify the logical consistency",
		"fre": "Attributs pour vùrifier la cohùrence logique",
		"cze": "Pole pro overenù logickù "
	  },
	  "ListPossibleValues": {
		"cat": "Llista de valors possibles ",
		"spa": "Lista de valores posibles ",
		"eng": "List of possible values ",
		"fre": "Liste des valeurs possibles",
		"cze": "Seznam moùnùch hodnot "
	  },
	  "valueField": {
		"cat": "valor1camp1;valor1camp2;valor1camp3",
		"spa": "valor1campo1;valor1campo2;valor1campo3",
		"eng": "value1field1;value1field2;value1field3",
		"fre": "valeur1champ1;valeur1champ2;valeur1champ3",
		"cze": "hodnota1pole1hodnota1pole2hodnota1pole3"
	  },
	  "GroundTruthLayer": {
		"cat": "Capa veritat terreny",
		"spa": "Capa verdad terreno",
		"eng": "Ground truth layer",
		"fre": "Couche de vùritù terrain",
		"cze": "Pozemnù pravdivostnù vrstva"
	  },
	  "RangeObservationDates": {
		"cat": "Interval de les dates d'observaciù",
		"spa": "Intervalo de las fechas de observaciùn",
		"eng": "Range of observation dates",
		"fre": "Plage de dates d'observation",
		"cze": "Rozsah dat pozorovùnù"
	  },
	  "InitialDate": {
		"cat": "Data inicial",
		"spa": "Fecha inicial",
		"eng": "Initial date",
		"fre": "Date initiale",
		"cze": "Pocùtecnù datum"
	  },
	  "FinalDate": {
		"cat": "Data final",
		"spa": "Fecha final",
		"eng": "Final date",
		"fre": "Date finale",
		"cze": "Konecnù datum"
	  },
	  "GeographicExtent": {
		"cat": "ùmbit geogrùfic",
		"spa": "ùmbito geogrùfico",
		"eng": "Geographic extent",
		"fre": "Etendue gùographique",
		"cze": "Geografickù rozsah"
	  },
	  "MinimumLongitude": {
		"cat": "Longitud mùnima",
		"spa": "Longitud mùnima",
		"eng": "Minimum longitude",
		"fre": "Longitude minimale",
		"cze": "Minimùlnù zemepisnù dùlka"
	  },
	  "MinimumX": {
		"cat": "X mùnima",
		"spa": "X mùnima",
		"eng": "Minimum X",
		"fre": "X minimale",
		"cze": "Minimùlnù X"
	  },
	  "MaximumLongitude": {
		"cat": "Longitud mùxima",
		"spa": "Longitud mùxima",
		"eng": "Maximum longitude",
		"fre": "Longitude maximale",
		"cze": "Maximùlnù zemepisnù dùlka"
	  },
	  "MaximumX": {
		"cat": "X mùxima",
		"spa": "X mùxima",
		"eng": "Maximum X",
		"fre": "X maximale",
		"cze": "Maximùlnù X"
	  },
	  "MinimumLatitude": {
		"cat": "Latitud mùnima",
		"spa": "Latitud mùnima",
		"eng": "Minimum latitude",
		"fre": "Latitude minimale",
		"cze": "Minimùlnù zemepisnù ùùrka"
	  },
	  "MinimumY": {
		"cat": "Y mùnima",
		"spa": "Y mùnima",
		"eng": "Minimum Y",
		"fre": "Y minimale",
		"cze": "Minimùlnù Y"
	  },
	  "MaximumLatitude": {
		"cat": "Latitud mùxima",
		"spa": "Latitud mùxima",
		"eng": "Maximum latitude",
		"fre": "Latitude maximale",
		"cze": "Maximùlnù zemepisnù ùùrka"
	  },
	  "MaximumY": {
		"cat": "Y mùxima",
		"spa": "Y mùxima",
		"eng": "Maximum Y",
		"fre": "Y maximale",
		"cze": "Maximùlnù Y"
	  },
	  "ComputeQualityLayer": {
		"cat": "Calcular la qualitat de la capa",
		"spa": "Calcular la Calidad de la capa",
		"eng": "Compute the quality of the layer",
		"fre": "Calculer la qualitù de la couche",
		"cze": "Vùpocet kvality vrstvy"
	  },
	  "QualityAssesment": {
		"cat": "Mùtode d'avaluaciù de la qualitat",
		"spa": "Mùtodo de evaluaciùn de la calidad",
		"eng": "Quality assesment",
		"fre": "Mùthode d'ùvaluation de la qualitù"
	  },
	  "PositionalLayerObsUncertainties": {
		"cat": "Exactitud posicional de la capa a partir de la incertessa de l'observaciù",
		"spa": "Exactitud posicional de la capa a partir de la incertidumbre de la observaciùn",
		"eng": "Positional accuracy of the layer from observation uncertainties",
		"fre": "Prùcision de positionnement de la couche par rapport ù l'incertitude d'observation",
		"cze": "Presnost polohy vrstvy z nejistot "
	  },
	  "LogicalConsistencyThematicAttr": {
		"cat": "Consistùncia lùgica dels atributs temùtics",
		"spa": "Consistencia lùgica de los atributos temùticos",
		"eng": "Logical consistency of the thematic attributes",
		"fre": "Cohùrence logique des attributs thùmatiques",
		"cze": "Logickù konzistence tematickùch "
	  },
	  "TemporalValidityObsDate": {
		"cat": "Validessa temporal de la data d'observaciù",
		"spa": "Validez temporal de la fecha de observaciùn",
		"eng": "Temporal validity of observation date",
		"fre": "Validitù temporelle de la date de l'observation",
		"cze": "Casovù platnost data pozorovùnù"
	  },
	  "ValidityPositionsObs": {
		"cat": "Validessa de les posicions de les observacions",
		"spa": "Validez de las posiciones de las observaciones",
		"eng": "Validity of the positions of observations",
		"fre": "Validitù des positions des observations",
		"cze": "Platnost polohy pozorovùnù"
	  }
	},
	"tools": {
	  "LayerTypeWindow": {
		"cat": "No s'ha definit la layer de tipus finestra",
		"spa": "No se ha definido la layer de tipo ventana",
		"eng": "The layer",
		"fre": "La layer de type fenùtre",
		"cze": "Vrstva"
	  },
	  "notDefinedNotFunctionality": {
		"cat": "i per tant no es pot usar la funcionalitat",
		"spa": "y en consecuencia no se puede usar la funcionalidad",
		"eng": "has not been defined and its not possible use the functionality",
		"fre": "n'a ùtù pas dùfinie et il n'est donc pas possible d'utilise l'outil",
		"cze": "nebyla definovùna a nenù moùnù pouùùt "
	  },
	  "TheValueOf": {
		"cat": "El valor de",
		"spa": "El valor de",
		"eng": "The value of",
		"fre": "La valeur de",
		"cze": "Hodnota"
	  },
	  "requiresACharacter": {
		"cat": "ha de contenir un caracter",
		"spa": "debe contenir un caracter",
		"eng": "requires a character",
		"fre": "nùcessite un caractùre",
		"cze": "vyùaduje znak"
	  },
	  "ReferencesOtherJSONNotSupported": {
		"cat": "Encara no se suporten valors de $ref amb referùncies a altres fitxers JSON",
		"spa": "Aùn no se suporta valores de $ref con referencias a otros ficheros JSON",
		"eng": "$ref values with references to other JSON files are still not supported",
		"fre": "Les valeurs $ref avec des rùfùrences ù d'autres fichiers JSON ne sont toujours pas prises en charge",
		"cze": "Hodnoty $ref s odkazy na jinù "
	  },
	  "isNotDefined": {
		"cat": "no estù definit",
		"spa": "no estù definido",
		"eng": "is not defined",
		"fre": "n'est pas dùfini",
		"cze": "nenù definovùn"
	  },
	  "isNotObject": {
		"cat": "no ùs un objecte",
		"spa": "no es un objecto",
		"eng": "is not an object",
		"fre": "n'est pas un objet",
		"cze": "nenù objektem"
	  }
	},
	"vector": {
	  "CannotSelectObjectLayerNoExist": {
		"cat": "No es poden seleccionar els objectes solùlicitats perquù la capa no existeix",
		"spa": "No se pueden seleccionar los objetos solicitados porquù la capa no existe",
		"eng": "Cannot select request objecte because the layer doesn't exist",
		"fre": "Les objets demandùs ne peuvent pas ùtre sùlectionnùes parce que la couche n'existe pas",
		"cze": "Nelze vybrat objekt poùadavku, "
	  }
	},
	"video": {
	  "NoLayerAvailableForAnimation": {
		"cat": "No hi ha cap capa disponible per l'ùnimaciù en aquesta ùrea o zoom.",
		"spa": "No hi ha ninguna capa disponible para la animaciùn en este ùrea o zoom.",
		"eng": "There is no layer available for the animation in this area or zoom.",
		"fre": "Il n'y a pas de couche disponible pour la animation dans cette zone ou le zoom",
		"cze": "Pro animaci v tùto oblasti nebo "
	  },
	  "TimeSeries": {
		"cat": "Sùries temporals",
		"spa": "Series temporales",
		"eng": "Time series",
		"fre": "Sùries chronologiques",
		"cze": "Casovù rada"
	  },
	  "TemporalScale": {
		"cat": "Escala temporal",
		"spa": "Escala temporal",
		"eng": "Temporal scale",
		"fre": "ùchelle temporelle",
		"cze": "Casovù merùtko"
	  },
	  "Interval": {
		"cat": "Interval",
		"spa": "Intervalo",
		"eng": "Interval",
		"fre": "Intervalle",
		"cze": "Interval"
	  },
	  "Animations": {
		"cat": "Animacions",
		"spa": "Animaciones",
		"eng": "Animations",
		"fre": "Animations",
		"cze": "Animace"
	  },
	  "Graph": {
		"cat": "Grùfic",
		"spa": "Grùfico",
		"eng": "Graph",
		"fre": "Graphique",
		"cze": "Graf"
	  },
	  "NumPhotosValue": {
		"cat": "N. fotog. amb valor",
		"spa": "N. fotog. con valor",
		"eng": "N. photos with value",
		"fre": "N. fotog. avec valeur",
		"cze": "N. fotografiù s hodnotou"
	  },
	  "StartSeasonDay": {
		"cat": "Dia d'inici de la temporada",
		"spa": "Dùa de inicio de la temporada",
		"eng": "Start of the Season day",
		"fre": "Jour de dùbut de saison",
		"cze": "Zacùtek dne sezùny"
	  },
	  "PeakSeasonDay": {
		"cat": "Dia el mùxim de la temporada",
		"spa": "Dùa del mùximo de la temporada",
		"eng": "Peak of the Season day",
		"fre": "Journùe de pointe de la saison",
		"cze": "Den vrcholu sezùny"
	  },
	  "EndSeasonDay": {
		"cat": "Dia de fi de la temporada",
		"spa": "Dùa de final de la temporada",
		"eng": "End of the Season day",
		"fre": "Jour de fin de saison",
		"cze": "Den konce sezùny"
	  },
	  "LengthSeasonDays": {
		"cat": "Dies D'allargada de la temporada",
		"spa": "Dùas de longitud de la temporada",
		"eng": "Length of the season (days)",
		"fre": "Durùe de la saison (jours)",
		"cze": "Dùlka sezùny (dny)"
	  },
	  "StartSeasonValue": {
		"cat": "Valor d'inici de la temporada",
		"spa": "Valor de inicio de la temporada",
		"eng": "Start of the Season value",
		"fre": "Valeur de dùbut de saison",
		"cze": "Hodnota zacùtku sezùny"
	  },
	  "PeakSeasonValue": {
		"cat": "Valor mùxim de la temporada",
		"spa": "Valor mùximo de la temporada",
		"eng": "Peak of the Season value",
		"fre": "Valeur maximale de la saison",
		"cze": "Vrcholovù hodnota sezùny"
	  },
	  "EndSeasonValue": {
		"cat": "Valor de fi de la temporada",
		"spa": "Valor de final de la temporada",
		"eng": "End of the Season value",
		"fre": "Valeur de fin de saison",
		"cze": "Hodnota na konci sezùny"
	  },
	  "SeasonBaseValue": {
		"cat": "Valor base la temporada",
		"spa": "Valor base de la temporada",
		"eng": "Season base value",
		"fre": "Valeur de base de la saison",
		"cze": "Zùkladnù hodnota sezùny"
	  },
	  "AmplitudeSeason": {
		"cat": "Amplitud de la temporada",
		"spa": "Amplitud de la temporada",
		"eng": "Amplitude of the season",
		"fre": "Amplitude de la saison",
		"cze": "Amplituda sezùny"
	  },
	  "RateGreening": {
		"cat": "Taxa de verdor",
		"spa": "Tasa de verdor",
		"eng": "Rate of Greening",
		"fre": "Taux de verdissement",
		"cze": "Mùra ozelenenù"
	  },
	  "RateSenescing": {
		"cat": "Taxa de senecùncia",
		"spa": "Tasa de sensecencia",
		"eng": "Rate of Senescing",
		"fre": "Taux de sùnescente"
	  },
	  "frames": {
		"cat": "fotogrames",
		"spa": "fotogramas",
		"eng": "frames",
		"fre": "cadres",
		"cze": "rùmy"
	  },
	  "LoadingFilm": {
		"cat": "Carregant rodet",
		"spa": "Cargando carrete",
		"eng": "Loading film",
		"fre": "Chargement film",
		"cze": "Vklùdùnù filmu"
	  },
	  "LoadingFrames": {
		"cat": "Carregant fotogrames",
		"spa": "Cargando fotogramas",
		"eng": "Loading frames",
		"fre": "Chargement des cadres",
		"cze": "Vklùdùnù snùmku"
	  },
	  "AllowedPercentageVoidSpace": {
		"cat": "Percentatge tolerat de superfùcie buida",
		"spa": "Porcentage tolerado de superficie vacia",
		"eng": "Allowed percentage of void space",
		"fre": "Pourcentage de surface vide tolùrù",
		"cze": "Povolenù procento prùzdnùho prostoru"
	  },
	  "ComputingStatisticSeries": {
		"cat": "Calculant estadùstic de la sùrie",
		"spa": "Calculando estadùstico de la serie",
		"eng": "Computing statistic of the series",
		"fre": "Statistique de calcul de la sùrie",
		"cze": "Vùpocet statistiky sùrie"
	  },
	  "UnsupportedStatisticalFunction": {
		"cat": "Funciù estadùstica no suportada",
		"spa": "Funciùn estadùstica no soportada",
		"eng": "Unsupported statistical function",
		"fre": "Statistical function non supportùe",
		"cze": "Nepodporovanù statistickù funkce"
	  },
	  "ComputingGraphicSeries": {
		"cat": "Calculant grafic x/t de la sùrie",
		"spa": "Calculando grùfico x/t de la serie",
		"eng": "Computing graphic x/t of the series",
		"fre": "Informatique graphique x/t de la sùrie",
		"cze": "Vùpocet grafickù x/t rady"
	  },
	  "ValuesImageCopiedClipboard": {
		"cat": "Els valors de la imatge han estat copiats al portaretalls en format rùster ASCII",
		"spa": "Los valores de la imagen han sido copiados al portapapeles en formato rùster ASCII",
		"eng": "The values of the image have been copied to clipboard in ASCII raster format",
		"fre": "Les valeurs de l'image ont ùtù copiùes dans le presse-papier dans le format raster ASCII",
		"cze": "Hodnoty snùmku byly zkopùrovùny do "
	  },
	  "LoadingThumbnails": {
		"cat": "Carregant miniatures",
		"spa": "Cargando miniaturas",
		"eng": "Loading thumbnails",
		"fre": "Chargement des vignettes",
		"cze": "Nacùtùnù miniatur"
	  },
	  "WrongValueTemporalScale": {
		"cat": "Valor incorrecte de l'escala temporal",
		"spa": "Valor incorrecto de la escala temporal",
		"eng": "Wrong value in temporal scale",
		"fre": "Valeur incorrect de l'ùchelle temporelle",
		"cze": "ùpatnù hodnota v casovù stupnici"
	  },
	  "IncorrectValueIntervalSeconds": {
		"cat": "Valor incorrecte de l'interval de segons",
		"spa": "Valor incorrecto del intervaluo de segundos",
		"eng": "Incorrect value of the interval of seconds",
		"fre": "Valeur incorrecte de l'intervalle de secondes",
		"cze": "Nesprùvnù hodnota sekundovùho intervalu"
	  },
	  "WillUse": {
		"cat": "Usarù 5.0",
		"spa": "Usarù 5.0",
		"eng": "I'll use 5.0",
		"fre": "Je vais utiliser 5.0",
		"cze": "Pouùiji hodnotu 5,0"
	  },
	  "SelectTempScaleInterval": {
		"cat": "Selùlecciona escala temporal o interval",
		"spa": "Seleccione escala temporal o intervalo",
		"eng": "Select temporal scale or interval",
		"fre": "Sùlectionner ùchelle temporelle où intervalle",
		"cze": "Vyberte casovou stupnici nebo interval"
	  }
	},
	"wps": {
	  "Result": {
		"cat": "Resultat: ",
		"spa": "Resultado: ",
		"eng": "Result: ",
		"fre": "Rùsultat: ",
		"cze": "Vùsledek: "
	  },
	  "Accepted": {
		"cat": "Acceptat",
		"spa": "Aceptado",
		"eng": "Accepted",
		"fre": "Acceptù",
		"cze": "Prijato"
	  },
	  "Started": {
		"cat": "Iniciat",
		"spa": "Iniciado",
		"eng": "Started",
		"fre": "Initiù",
		"cze": "Spuùteno"
	  },
	  "percentCompleted": {
		"cat": "percentatge completat",
		"spa": "porcentaje completado",
		"eng": "percent completed",
		"fre": "pourcentage complùtù",
		"cze": "procento dokonceno"
	  },
	  "Paused": {
		"cat": "Pausat",
		"spa": "Pausado",
		"eng": "Paused",
		"fre": "En pause",
		"cze": "Paused"
	  },
	  "Succeeded": {
		"cat": "Finalitzat",
		"spa": "Finalizado",
		"eng": "Succeeded",
		"fre": "Terminù",
		"cze": "ùspeùnù"
	  },
	  "Failed": {
		"cat": "Error: ",
		"spa": "Error: ",
		"eng": "Failed: ",
		"fre": "Erreur: ",
		"cze": "Neùspeùne:"
	  },
	  "NoValueDefinedParameter": {
		"cat": "No s'ha definit cap valor pel parùmetre",
		"spa": "No se ha definido ningùn valor para el parùmetro",
		"eng": "No value has been defined by parameter",
		"fre": "Aucun valeur dùfini pour le paramùtre",
		"cze": "U parametru nebyla definovùna ùùdnù hodnota"
	  },
	  "NecessarySendFileBeforeExecProcess": {
		"cat": "Cal enviar el fitxer al servidor abans d'executar el procùs",
		"spa": "Es necesario enviar el fichero al servidor antes de ejecutar el proceso",
		"eng": "It is necessary to send the file to the server before executing the process",
		"fre": "Il faut envoyer le fichier au serveur avant d'exùcuter le processus",
		"cze": "Pred spuùtenùm procesu je nutnù "
	  },
	  "URLIntroducedInParameter": {
		"cat": "La URL introduùda en el parùmetre",
		"spa": "La URL introducida en el parametro",
		"eng": "The URL introduced in the parameter",
		"fre": "La URL introduite au paramùtre",
		"cze": "Adresa URL uvedenù v parametru"
	  },
	  "isInvalid": {
		"cat": "ùs invùlida",
		"spa": " es invalida",
		"eng": "is invalid",
		"fre": "n'est pas valide",
		"cze": "je neplatnù"
	  },
	  "StateExecution": {
		"cat": "Estat de l'execuciù",
		"spa": "Estado de la ejecuciùn",
		"eng": "State of execution",
		"fre": "ùtat de l'exùcution",
		"cze": "Stav provùdenù"
	  },
	  "ExecutionTime": {
		"cat": "Temps d'execuciù",
		"spa": "Tiempo de ejecuciùn",
		"eng": "Execution time",
		"fre": "Durùe dùexùcution",
		"cze": "Cas provedenù"
	  },
	  "AdvancedOptions": {
		"cat": "Opcions avanùades",
		"spa": "Opciones avanzadas",
		"eng": "Advanced options",
		"fre": "Options avancùes",
		"cze": "Rozùùrenù moùnosti"
	  },
	  "ErrorBuildingExecReq": {
		"cat": "Error al construir la peticiù d'execuciù",
		"spa": "Error al construir la peticiùn de ejecuciùn",
		"eng": "Error while building execution request",
		"fre": "Erreur en construisant la demande d'exùcution",
		"cze": "Chyba pri sestavovùnù poùadavku na provedenù"
	  },
	  "AllowedFormatsParameter": {
		"cat": "Formats permesos by parameter",
		"spa": "Formatos permitidos by parameter",
		"eng": "Allowed formats by parameter",
		"fre": "Formats permis by parameter",
		"cze": "Povolenù formùty podle parametru"
	  },
	  "OccurredErrorSendingFile": {
		"cat": "S'ha produùt algun error durant l'enviament del fitxer",
		"spa": "Se ha producido algun error durante el envùo del fichero",
		"eng": "Has been occurred an error while sending the file",
		"fre": "Une erreur vient de se produire pendant l'envoi du fichier",
		"cze": "Doùlo k chybe pri odesùlùnù souboru"
	  },
	  "InputParameters": {
		"cat": "Parùmetres d'entrada",
		"spa": "Parùmetros de entrada",
		"eng": "Input parameters",
		"fre": "Paramùtres d'entrùe",
		"cze": "Vstupnù parametry"
	  },
	  "LayerProcess": {
		"cat": "Capa a processar",
		"spa": "Capa a procesar",
		"eng": "Layer to process",
		"fre": "Couche ù traiter",
		"cze": "Vrstva ke zpracovùnù"
	  },
	  "OperationExecute": {
		"cat": "Operaciù a executar: ",
		"spa": "Operaciùn a ejecutar: ",
		"eng": "Operation to execute: ",
		"fre": "Opùration ù exùcuter: ",
		"cze": "Operace, kterù se mù provùst: "
	  },
	  "someProcessWithoutOperation": {
		"cat": "tù processos sense cap operaciù definida",
		"spa": "tiene procesos sin ninguna operaciùn definida",
		"eng": "have some process without any operation defined",
		"fre": "a des processus sans aucune opùration dùfinie",
		"cze": "mùt nejakù proces bez definovanù operace"
	  },
	  "notAnyExecProcesDefined": {
		"cat": "no tù capa procùs executable definit",
		"spa": "no tiene ningùn proceso ejecutable definido",
		"eng": "do not have any executable proces defined",
		"fre": "n'a aucun processus exùcutable dùfinit"
	  },
	  "addingLayersToBrowser": {
		"cat": "d'afegir capes al navegador",
		"spa": "de aùadir capas al navegador",
		"eng": "of adding a layer to the browser",
		"fre": "pour ajouter des couches au navigateur",
		"cze": "pridùnù vrstvy do prohlùece"
	  }
	},
	"urls": {
	  "helpHtm": {
		"cat": "ajuda/cat/ajuda.htm",
		"spa": "ajuda/spa/ajuda.htm",
		"eng": "ajuda/eng/ajuda.htm",
		"fre": "ajuda/fre/ajuda.htm",
		"cze": "ajuda/eng/ajuda.htm"
	  },
	  "installerMMRExe": {
		"cat": "http://www.creaf.uab.cat/miramon/mmr/cat/exe/Inst_MMR.EXE",
		"spa": "http://www.creaf.uab.cat/miramon/mmr/esp/exe/Inst_MMR.EXE",
		"eng": "http://www.creaf.uab.cat/miramon/mmr/usa/exe/Inst_MMR.EXE",
		"fre": "http://www.creaf.uab.cat/miramon/mmr/cat/exe/Inst_MMR.EXE",
		"cze": "http://www.creaf.uab.cat/miramon/mmr/usa/exe/Inst_MMR.EXE"
	  }
	}
  }
