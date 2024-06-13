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
    amb l'ajut de Alba Brobia (a brobia at creaf uab cat) , Didac Pardell (d.pardell at creaf uab cat)
	i Núria Julià (n julia at creaf uab cat) dins del grup del MiraMon. MiraMon és un projecte del
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
var MessageLang=
{
  "TheLanguageName": {
    "cat": "Català",
    "spa": "Español",
    "eng": "English",
    "fre": "Français",
    "cze": "Čeština",
    "ger": "Deutsch"
  },
  "MissingMessage": {
    "cat": "Missatge no trobat",
    "spa": "Mensage no encontrado",
    "eng": "Missing message",
    "fre": "Message non trouvé",
    "cze": "Chybějící zpráva",
    "ger": "Fehlende Meldung"
  },
  "MissingMessageInBrackets": {
    "cat": "[Missatge no trobat]",
    "spa": "[Mensage no encontrado]",
    "eng": "[Missing message]",
    "fre": "[Message non trouvé]",
	"cze": "[Chybějící zpráva]",
    "ger": "[Fehlende Meldung]"
  },
  "neitherRecognizedNorImplemented": {
    "cat": "no reconnegut o implementat",
    "spa": "no reconocido o implementado",
    "eng": "neither recognized nor implemented",
    "fre": "ni reconnu ni mis en œuvre",
    "cze": "není rozpoznán ani implementován",
    "ger": "weder erkannt noch implementiert"
  },
  "UseTheFormat": {
    "cat": "Useu el format",
    "spa": "Use el formato",
    "eng": "Use the format",
    "fre": "Utilisez le format",
    "cze": "Použijte formát",
    "ger": "Verwenden Sie das Format"
  },
  "WrongFormatParameter": {
    "cat": "Format de paràmetre incorrecte",
    "spa": "Formato de parametro incorrecto",
    "eng": "Wrong format in parameter",
    "fre": "Format incorrect dans le paramètre",
    "cze": "Špatný formát v parametru",
    "ger": "Falsches Format im Parameter"
  },
  "ModifyName": {
    "cat": "Modifica el nom",
    "spa": "Modifica el nombre",
    "eng": "Modify the name",
    "fre": "Modifier le nom",
    "cze": "Upravit název",
    "ger": "Ändern Sie den Namen"
  },
  "AddLayer": {
    "cat": "Afegir capa",
    "spa": "Añadir capa",
    "eng": "Add layer",
    "fre": "Ajouter couche",
    "cze": "Přidat vrstvu",
    "ger": "Layer hinzufügen"
  },
  "Georeference": {
    "cat": "Georeferència",
    "spa": "Georeferencia",
    "eng": "Georeference",
    "fre": "Géoréférence",
    "cze": "Georeference",
    "ger": "Georeferenz"
  },
  "Coordinates": {
    "cat": "Coordenades",
    "spa": "Coordenadas",
    "eng": "Coordinates",
    "fre": "Coordonnées",
    "cze": "Souřadnice",
    "ger": "Koordinaten"
  },
  "CentralPoint": {
    "cat": "Punt central",
    "spa": "Punto central",
    "eng": "Central point",
    "fre": "Point central",
    "cze": "Střední bod",
    "ger": "Zentraler Punkt"
  },
  "CurrentReferenceSystem": {
    "cat": "Sistema de referència actual",
    "spa": "Sistema de referencia actual",
    "eng": "Current reference system",
    "fre": "Système de référence actuel",
    "cze": "Aktuální referenční systém",
    "ger": "Aktuelles Bezugssystem"
  },
  "AvailableBoundary": {
    "cat": "Àmbit disponible",
    "spa": "Ámbito disponible",
    "eng": "Available boundary",
    "fre": "Champ disponible",
    "cze": "Dostupná hranice",
    "ger": "Verfügbare Begrenzung"
  },
  "CellSize": {
    "cat": "Costat de cel·la",
    "spa": "Lado de celda",
    "eng": "Cell size",
    "fre": "Taille de la cellule",
    "cze": "Velikost buňky",
    "ger": "Größe der Zelle"
  },
  "CellArea": {
    "cat": "Àrea de la cel·la",
    "spa": "Área de celda",
    "eng": "Cell area",
    "fre": "Zone de la cellule",
    "cze": "Plocha buňky",
    "ger": "Fläche der Zelle"
  },
  "metadata": {
    "cat": "metadades",
    "spa": "metadatos",
    "eng": "metadata",
    "fre": "métadonnées",
    "cze": "metadata",
    "ger": "Metadaten"
  },
  "Metadata": {
    "cat": "Metadades",
    "spa": "Metadatos",
    "eng": "Metadata",
    "fre": "Métadonnées",
    "cze": "Metadata",
    "ger": "Metadaten"
  },
  "Quality": {
    "cat": "Qualitat",
    "spa": "Calidad",
    "eng": "Quality",
    "fre": "Qualité",
    "cze": "Kvalita",
    "ger": "Qualität"
  },
  "Lineage": {
    "cat": "Llinatge",
    "spa": "Linaje",
    "eng": "Lineage",
    "fre": "Lignage",
    "cze": "Linie",
    "ger": "Abstammung"
  },
  "Feedback": {
    "cat": "Valoracions",
    "spa": "Valoraciones",
    "eng": "Feedback",
    "fre": "rétroaction",
    "cze": "Zpětná vazba",
    "ger": "Rückmeldung"
  },
  "Definition":{
      "cat": "Definició",
      "spa": "Definición",
      "eng": "Definition",
      "fre": "Définition",
      "cze": "Definice",
      "ger": "Definition"
   },
   "Explanation":{
      "cat": "Explicació",
      "spa": "Explicación",
      "eng": "Explanation",
      "fre": "Explication",
      "cze": "Vysvětlení",
      "ger": "Erläuterung"
   },
   "ExplanationOfLayer":{
      "cat": "Explicació de la capa",
      "spa": "Explicación de la capa ",
      "eng": "Explanation of the layer",
      "fre": "Explication de la couche",
      "cze": "Vysvětlení vrstvy",
      "ger": "Erläuterung des Layers"
   },
  "PieChart": {
    "cat": "Gràfic circular",
    "spa": "Gráfico circular",
    "eng": "Pie chart",
    "fre": "Diagramme à secteurs",
    "cze": "Koláčový graf",
    "ger": "Kreisdiagramm"
  },
  "Histogram": {
    "cat": "Histograma",
    "spa": "Histograma",
    "eng": "Histogram",
    "fre": "Histogramme",
    "cze": "Histogram",
    "ger": "Histogramm"
  },
  "Selection": {
    "cat": "Selecció",
    "spa": "Selección",
    "eng": "Selection",
    "fre": "Sélection",
    "cze": "Výběr",
    "ger": "Auswahl"
  },
  "Open": {
    "cat": "Obrir",
    "spa": "Abrir",
    "eng": "Open",
    "fre": "Ouvrir",
    "cze": "Otevřít",
    "ger": "Öffnen"
  },
  "Save": {
    "cat": "Desar",
    "spa": "Guardar",
    "eng": "Save",
    "fre": "Sauvegarder",
    "cze": "Uložit",
    "ger": "Speichern"
  },
  "close": {
    "cat": "tancar",
    "spa": "cerrar",
    "eng": "close",
    "fre": "quitter",
    "cze": "zavřít",
    "ger": "schließen"
  },
  "Close": {
    "cat": "Tancar",
    "spa": "Cerrar",
    "eng": "Close",
    "fre": "Quitter",
    "cze": "Zavřít",
    "ger": "Schließen"
  },
  "print": {
    "cat": "imprimir",
    "spa": "imprimir",
    "eng": "print",
    "fre": "imprimer",
    "cze": "tisk",
    "ger": "drucken"
  },
  "Print": {
    "cat": "Imprimir",
    "spa": "Imprimir",
    "eng": "Print",
    "fre": "Imprimer",
    "cze": "Tisk",
    "ger": "Drucken"
  },
  "indicates": {
    "cat": "indica",
    "spa": "indica",
    "eng": "indicates",
    "fre": "indique",
    "cze": "označuje",
    "ger": "zeigt"
  },
  "show": {
    "cat": "mostrar",
    "spa": "mostrar",
    "eng": "show",
    "fre": "afficher",
    "cze": "zobrazit",
    "ger": "anzeigen"
  },
  "Show": {
    "cat": "Mostrar",
    "spa": "Mostrar",
    "eng": "Show",
    "fre": "Afficher",
    "cze": "Zobrazit",
    "ger": "Anzeigen"
  },
  "Shown": {
    "cat": "Mostrades",
    "spa": "Mostradas",
    "eng": "Shown",
    "fre": "Montré",
    "cze": "Zobrazeno",
    "ger": "Angezeigt"
  },
  "Hide": {
    "cat": "Amagar",
    "spa": "Ocultar",
    "eng": "Hide",
    "fre": "Cacher",
    "cze": "Skrýt",
    "ger": "Ausblenden"
  },
  "UnderDevelopment": {
    "cat": "En desenvolupament.",
    "spa": "En desarrollo.",
    "eng": "Under development.",
    "fre": "En développement.",
    "cze": "Ve vývoji.",
    "ger": "In Entwicklung."
  },
  "layer": {
    "cat": "capa",
    "spa": "capa",
    "eng": "layer",
    "fre": "couche",
    "cze": "vrstva",
    "ger": "Layer"
  },
  "Layer": {
    "cat": "Capa",
    "spa": "Capa",
    "eng": "Layer",
    "fre": "Couche",
    "cze": "Vrstva",
    "ger": "Layer"
  },
  "LayerId": {
    "cat": "Identificador de la capa",
    "spa": "Identificador de la capa",
    "eng": "Layer identifier",
    "fre": "Identificateur de couche",
    "cze": "Identifikátor vrstvy",
    "ger": "Bezeichner des Layers"
  },
  "Layers": {
    "cat": "Capes",
    "spa": "Capas",
    "eng": "Layers",
    "fre": "Couches",
    "cze": "Vrstvy",
    "ger": "Layers"
  },
  "theLayer": {
    "cat": "la capa",
    "spa": "la capa",
    "eng": "the layer",
    "fre": "la couche",
    "cze": "vrstva",
    "ger": "der Layer"
  },
  "TheLayer": {
    "cat": "La capa",
    "spa": "La capa",
    "eng": "The layer",
    "fre": "La couche",
    "cze": "Vrstva",
    "ger": "Der Layer"
  },
  "ofTheLayer": {
    "cat": "de la capa",
    "spa": "de la capa",
    "eng": "of the layer",
    "fre": "de la couche",
    "cze": "vrstvy",
    "ger": "des Layers"
  },
  "Add": {
    "cat": "Afegir",
    "spa": "Añadir",
    "eng": "Add",
    "fre": "Ajouter",
    "cze": "Přidat",
    "ger": "Hinzufügen"
  },
  "Explore": {
    "cat": "Explorar",
    "spa": "Explorar",
    "eng": "Explore",
    "fre": "Examiner",
    "cze": "Prozkoumat",
    "ger": "Erkunden Sie"
  },
  "AddLayers": {
    "cat": "Afegir capes",
    "spa": "Añadir capas",
    "eng": "Add layers",
    "fre": "Ajouter couches",
    "cze": "Přidat vrstvy",
    "ger": "Layers hinzufügen"
  },
  "Expression": {
    "cat": "Fórmula",
    "spa": "Fórmula:",
    "eng": "Expression",
    "fre": "Formule",
    "cze": "Výraz",
    "ger": "Ausdruck"
  },
  "Value": {
    "cat": "Valor",
    "spa": "Valor",
    "eng": "Value",
    "fre": "Valeur",
    "cze": "Hodnota",
    "ger": "Wert"
  },
  "InitialValue": {
    "cat": "Valor inicial",
    "spa": "Valor inicial",
    "eng": "Initial value",
    "fre": "Valeur initiale",
    "cze": "Počáteční hodnota",
    "ger": "Anfangswert"
  },
  "TheValue": {
    "cat": "El valor",
    "spa": "El valor",
    "eng": "The value",
    "fre": "La valeur",
    "cze": "Hodnota",
    "ger": "Der Wert"
  },
  "Operator": {
    "cat": "Operador",
    "spa": "Operador",
    "eng": "Operator",
    "fre": "Opérateur",
    "cze": "Operátor",
    "ger": "Operator"
  },
  "Parameters": {
    "cat": "Paràmetres",
    "spa": "Parámetros",
    "eng": "Parameters",
    "fre": "Parameters",
    "cze": "Parametry",
    "ger": "Parameter"
  },
  "date": {
    "cat": "data",
    "spa": "fecha",
    "eng": "date",
    "fre": "date",
    "cze": "datum",
    "ger": "Datum"
  },
  "Date": {
    "cat": "Data",
    "spa": "Fecha",
    "eng": "Date",
    "fre": "Date",
    "cze": "Datum",
    "ger": "Datum"
  },
  "Field": {
    "cat": "Camp",
    "spa": "Camp",
    "eng": "Field",
    "fre": "Champ",
    "cze": "Proměnná",
    "ger": "Feld"
  },
  "ofTheField": {
    "cat": "del camp",
    "spa": "del campo",
    "eng": "of the field",
    "fre": "du champ",
    "cze": "pole",
    "ger": "des Feldes"
  },
  "Title": {
    "cat": "Títol",
    "spa": "Título",
    "eng": "Title",
    "fre": "Titre",
    "cze": "Název",
    "ger": "Titel"
  },
  "Condition": {
    "cat": "Condició",
    "spa": "Condición",
    "eng": "Condition",
    "fre": "Condition",
    "cze": "Podmínka",
    "ger": "Bedingung"
  },
  "OK": {
    "cat": "Acceptar",
    "spa": "Aceptar",
    "eng": "OK",
    "fre": "Accepter",
    "cze": "OK",
    "ger": "OK"
  },
  "Cancel": {
    "cat": "Cancel·lar",
    "spa": "Cancelar",
    "eng": "Cancel",
    "fre": "Annuler",
    "cze": "Zrušit",
    "ger": "Abbrechen"
  },
  "Apply": {
    "cat": "Aplicar",
    "spa": "Aplicar",
    "eng": "Apply",
    "fre": "Appliquer",
    "cze": "Použít",
    "ger": "Anwenden"
  },
  "Presentation": {
    "cat": "Presentació",
    "spa": "Presentación",
    "eng": "Presentation",
    "fre": "Présentation",
    "cze": "Prezentace",
    "ger": "Präsentation"
  },
  "Graphical": {
    "cat": "Gràfica",
    "spa": "Gráfica",
    "eng": "Graphical",
    "fre": "Graphique",
    "cze": "Grafické",
    "ger": "Grafisch"
  },
  "Textual": {
    "cat": "Textual",
    "spa": "Textual",
    "eng": "Textual",
    "fre": "Textuelle",
    "cze": "Textové",
    "ger": "Textlich"
  },
  "Unsorted": {
    "cat": "Cap",
    "spa": "Ninguno",
    "eng": "Unsorted",
    "fre": "Non trié",
    "cze": "Netříděné",
    "ger": "Unsortiert"
  },
  "ColorPalette": {
    "cat": "Paleta de colors",
    "spa": "Paleta de colores",
    "eng": "Color palette",
    "fre": "Palette de couleurs",
    "cze": "Paleta barev",
    "ger": "Farbpalette"
  },
  "Colors": {
    "cat": "Colors",
    "spa": "Colores",
    "eng": "Colors",
    "fre": "Couleurs",
    "cze": "Barvy",
    "ger": "Farben"
  },
  "Current": {
    "cat": "Actual",
    "spa": "Actual",
    "eng": "Current",
    "fre": "Actuel",
    "cze": "Aktuální",
    "ger": "Aktuell"
  },
  "Previous": {
    "cat": "Prèvia",
    "spa": "Previa",
    "eng": "Previous",
    "fre": "Précédente",
    "cze": "Předchozí",
    "ger": "Vorherige"
  },
  "View": {
    "cat": "Vista",
    "spa": "Vista",
    "eng": "View",
    "fre": "Vue",
    "cze": "Zobrazit",
    "ger": "Ansicht"
  },
  "Width": {
    "cat": "Ample",
    "spa": "Ancho",
    "eng": "Width",
    "fre": "Largeur",
    "cze": "Šířka",
    "ger": "Breite"
  },
  "Height": {
    "cat": "Alt",
    "spa": "Alto",
    "eng": "Height",
    "fre": "Hauteur",
    "cze": "Výška",
    "ger": "Höhe"
  },
  "LayerName": {
    "cat": "Nom de la capa",
    "spa": "Nombre de la capa",
    "eng": "Name of the layer",
    "fre": "Nom de la couche",
    "cze": "Název vrstvy",
    "ger": "Name des Layers"
  },
  "ModalClass": {
    "cat": "Classe modal",
    "spa": "Clase modal",
    "eng": "Modal class",
    "fre": "Classe modale",
    "cze": "Modální třída",
    "ger": "Modale Klasse"
  },
  "PercentageMode": {
    "cat": "Percentatge de la moda",
    "spa": "Porcentaje de la moda",
    "eng": "Percentage of the mode",
    "fre": "Pourcentage de mode",
    "cze": "Procento režimu",
    "ger": "Prozentualer Anteil des Modus"
  },
  "Sum": {
    "cat": "Suma",
    "spa": "Suma",
    "eng": "Sum",
    "fre": "Somme",
    "cze": "Součet",
    "ger": "Summe"
  },
  "SumArea": {
    "cat": "Suma àrea",
    "spa": "Suma área",
    "eng": "Sum area",
    "fre": "Somme area",
    "cze": "Součet plochy",
    "ger": "Fläche der Summe"
  },
  "Mean": {
    "cat": "Mitjana",
    "spa": "Media",
    "eng": "Mean",
    "fre": "Moyenne",
    "cze": "Průměr",
    "ger": "Mittelwert"
  },
  "Variance": {
    "cat": "Variança",
    "spa": "Varianza",
    "eng": "Variance",
    "fre": "Variance",
    "cze": "Rozptyl",
    "ger": "Varianz"
  },
  "StandardDeviation": {
    "cat": "Desviació estàndard",
    "spa": "Desviació estándar",
    "eng": "Standard deviation",
    "fre": "Écart-type",
    "cze": "Směrodatná odchylka",
    "ger": "Standardabweichung"
  },
  "Mode": {
    "cat": "Moda",
    "spa": "Moda",
    "eng": "Mode",
    "fre": "Mode",
    "cze": "Mód",
    "ger": "Modus"
  },
  "Minimum": {
    "cat": "Mínim",
    "spa": "Mínimo",
    "eng": "Minimum",
    "fre": "Minimum",
    "cze": "Minimum",
    "ger": "Minimum"
  },
  "Maximum": {
    "cat": "Màxim",
    "spa": "Máximo",
    "eng": "Maximum",
    "fre": "Maximum",
    "cze": "Maximum",
    "ger": "Maximum"
  },
  "Range": {
    "cat": "Rang",
    "spa": "Rango",
    "eng": "Range",
    "fre": "Gamme",
    "cze": "Rozsah",
    "ger": "Bereich"
  },
  "SortingOrder": {
    "cat": "Ordre",
    "spa": "Orden",
    "eng": "Sorting order",
    "fre": "Ordre de tri",
    "cze": "Řadit podle",
    "ger": "Sortierreihenfolge"
  },
  "Others": {
    "cat": "Altres",
    "spa": "Otros",
    "eng": "Others",
    "fre": "Autres",
    "cze": "Ostatní",
    "ger": "Andere"
  },
  "Link": {
    "cat": "Enllaç",
    "spa": "Enlace",
    "eng": "Link",
    "fre": "Relier",
    "cze": "Odkaz",
    "ger": "Link"
  },
  "Point": {
    "cat": "Punt",
    "spa": "Punto",
    "eng": "Point",
    "fre": "Point",
    "cze": "Bod",
    "ger": "Punkt"
  },
  "Query": {
    "cat": "Consulta",
    "spa": "Consulta",
    "eng": "Query",
    "fre": "Recherche",
    "cze": "Dotaz",
    "ger": "Abfrage"
  },
  "QueryByLocation": {
    "cat": "Consulta per localització",
    "spa": "Consulta por localización",
    "eng": "Query by location",
    "fre": "Requête par emplacement",
    "cze": "Dotaz podle lokality",
    "ger": "Abfrage nach Ort"
  },
  "Options": {
    "cat": "Opcions",
    "spa": "Opciones",
    "eng": "Options",
    "fre": "Options",
    "cze": "Možnosti",
    "ger": "Optionen"
  },
  "Select": {
    "cat": "Seleccionar",
    "spa": "Seleccionar",
    "eng": "Select",
    "fre": "Sélectionner",
    "cze": "Vyberte",
    "ger": "Wählen Sie"
  },
  "pleaseWait": {
    "cat": "espereu",
    "spa": "espere",
    "eng": "please wait",
    "fre": "attendez",
    "cze": "počkejte prosím",
    "ger": "bitte warten"
  },
  "PleaseWait": {
    "cat": "Espereu si us plau",
    "spa": "Espere por favor",
    "eng": "Please, wait",
    "fre": "Attendez, s'il-vous-plaît",
    "cze": "Prosím, počkejte",
    "ger": "Bitte, warten"
  },
  "DateTime": {
    "cat": "Data i hora",
    "spa": "Fecha y hora",
    "eng": "Date and time",
    "fre": "Date et l'heure",
    "cze": "Datum a čas",
    "ger": "Datum und Uhrzeit"
  },
  "Next": {
    "cat": "Següent",
    "spa": "Siguiente",
    "eng": "Next",
    "fre": "Suivant",
    "cze": "Další",
    "ger": "Nächste"
  },
  "Format": {
    "cat": "Format",
    "spa": "Formato",
    "eng": "Format",
    "fre": "Format",
    "cze": "Formát",
    "ger": "Format"
  },
  "Download": {
    "cat": "Descarregar",
    "spa": "Descargar",
    "eng": "Download",
    "fre": "Télécharger",
    "cze": "Stáhnout",
    "ger": "Herunterladen"
  },
  "of": {
    "cat": "de",
    "spa": "de",
    "eng": "of",
    "fre": "de",
    "cze": "z",
    "ger": "von"
  },
  "Time": {
    "cat": "Hora",
    "spa": "Hora",
    "eng": "Time",
    "fre": "L'heure",
    "cze": "Čas",
    "ger": "Zeit"
  },
  "Option": {
    "cat": "Opció",
    "spa": "Opición",
    "eng": "Option",
    "fre": "Option",
    "cze": "Možnost",
    "ger": "Option"
  },
  "Status": {
    "cat": "Estat",
    "spa": "Estado",
    "eng": "Status",
    "fre": "Statut",
    "cze": "Stav",
    "ger": "Status"
  },
  "tabSeparatedText": {
    "cat": "text separat per tabulacions",
    "spa": "texto separado por tabulaciones",
    "eng": "tab-separated text",
    "fre": "texte séparé par des tabulations",
    "cze": "text oddělený tabulátorem",
    "ger": "tabulatorgetrennter Text"
  },
  "Style": {
    "cat": "Estil",
    "spa": "Estilo",
    "eng": "Style",
    "fre": "Style",
    "cze": "Styl",
    "ger": "Stil"
  },
  "Count": {
    "cat": "Recompte",
    "spa": "Cuenta",
    "eng": "Count",
    "fre": "Compter",
    "cze": "Počet",
    "ger": "Zählen"
  },
  "Area": {
    "cat": "Àrea",
    "spa": "Área",
    "eng": "Area",
    "fre": "Zone",
    "cze": "Oblast",
    "ger": "Bereich"
  },
  "NoData": {
    "cat": "Sense dades",
    "spa": "Sin datos",
    "eng": "No data",
    "fre": "Pas de données",
    "cze": "Žádné údaje",
    "ger": "Keine Daten"
  },
  "Class": {
    "cat": "Classe",
    "spa": "Clase",
    "eng": "Class",
    "fre": "Classe",
    "cze": "Třída",
    "ger": "Klasse"
  },
  "All": {
    "cat": "Totes",
    "spa": "Todas",
    "eng": "All",
    "fre": "Toutes",
    "cze": "Všechny",
    "ger": "Alle"
  },
  "Dynamic": {
    "cat": "Dinàmic",
    "spa": "Dinámico",
    "eng": "Dynamic",
    "fre": "Dynamique",
    "cze": "Dynamické",
    "ger": "Dynamisch"
  },
  "Disabled": {
    "cat": "Desactivat)",
    "spa": "Desactivado",
    "eng": "Disabled",
    "fre": "Désactivé",
    "cze": "Vypnuto",
    "ger": "Deaktiviert"
  },
  "layerOrStyleNotVisible": {
    "cat": "capa o estil no visible",
    "spa": "capa o estil no visible",
    "eng": "layer or style not visible",
    "fre": "couche or style non visible",
    "cze": "vrstva nebo styl není viditelný",
    "ger": "Layer oder Stil nicht sichtbar"
  },
  "Statistics": {
    "cat": "Estadístics",
    "spa": "Estadísticos",
    "eng": "Statistics",
    "fre": "Statistique",
    "cze": "Statistiky",
    "ger": "Statistiken"
  },
  "Statistic": {
    "cat": "Estadístic",
    "spa": "Estadístico",
    "eng": "Statistic",
    "fre": "Statistique",
    "cze": "Statistika",
    "ger": "Statistik"
  },
  "ContingencyTable": {
    "cat": "Taula de contingència",
    "spa": "Tabla de contingencia",
    "eng": "Contingency table",
    "fre": "Tableau de contingence",
    "cze": "Kontingenční tabulka",
    "ger": "Kontingenztabelle"
  },
  "Columns": {
    "cat": "Columnes",
    "spa": "Columnas",
    "eng": "Columns",
    "fre": "Colonnes",
    "cze": "Sloupce",
    "ger": "Spalten"
  },
  "columns": {
    "cat": "columnes",
    "spa": "columnas",
    "eng": "columns",
    "fre": "colonnes",
    "cze": "sloupce",
    "ger": "Spalten"
  },
  "Rows": {
    "cat": "Files",
    "spa": "Filas",
    "eng": "Rows",
    "fre": "Lignes",
    "cze": "Řádky",
    "ger": "Zeilen"
  },
  "rows": {
    "cat": "files",
    "spa": "filas",
    "eng": "rows",
    "fre": "lignes",
    "cze": "řádky",
    "ger": "Zeilen"
  },
  "name": {
    "cat": "nom",
    "spa": "nombre",
    "eng": "name",
    "fre": "nom",
    "cze": "název",
    "ger": "Name"
  },
  "Name": {
    "cat": "Nom",
    "spa": "Nombre",
    "eng": "Name",
    "fre": "Nom",
    "cze": "Název",
    "ger": "Name"
  },
  "Band": {
    "cat": "Banda",
    "spa": "Banda",
    "eng": "Band",
    "fre": "Bande",
    "cze": "Pásmo",
    "ger": "Band"
  },
  "Measure": {
    "cat": "Mesura",
    "spa": "Medida",
    "eng": "Measure",
    "fre": "Mesure",
    "cze": "Opatření",
    "ger": "Maßnahme"
  },
  "copy": {
    "cat": "copiar",
    "spa": "copiar",
    "eng": "copy",
    "fre": "copier",
    "cze": "kopírovat",
    "ger": "kopieren"
  },
  "help": {
    "cat": "ajuda",
    "spa": "ayuda",
    "eng": "help",
    "fre": "aider",
    "cze": "nápověda",
    "ger": "Hilfe"
  },
  "InteractiveHelp": {
    "cat": "Ajuda interactiva",
    "spa": "Ayuda interactiva",
    "eng": "Interactive help",
    "fre": "Aide intéractive",
    "cze": "Interaktivní nápověda",
    "ger": "Interaktive Hilfe"
  },
  "popDown": {
    "cat": "incrustar",
    "spa": "incrustar",
    "eng": "pop down",
    "fre": "incruster",
    "cze": "vyskakovací okno - dolů",
    "ger": "aufklappen"
  },
  "popUp": {
    "cat": "desincrustar",
    "spa": "desincrustar",
    "eng": "pop up",
    "fre": "desincruster",
    "cze": "vyskakovací okno - nahoru",
    "ger": "pop up"
  },
  "KappaCoef": {
    "cat": "Index Kappa",
    "spa": "Indice Kappa",
    "eng": "Kappa coefficient",
    "fre": "Coefficient kappa",
    "cze": "Koeficient kappa",
    "ger": "Kappa-Koeffizient"
  },
  "none": {
    "cat": "cap",
    "spa": "ninguno",
    "eng": "none",
    "fre": "aucun",
    "cze": "žádný",
    "ger": "keine"
  },
  "and": {
    "cat": "i",
    "spa": "y",
    "eng": "and",
    "fre": "et",
    "cze": "a",
    "ger": "und"
  },
  "or": {
    "cat": "o",
    "spa": "o",
    "eng": "or",
    "fre": "ou",
    "cze": "nebo",
    "ger": "oder"
  },
  "Working": {
    "cat": "Processant",
    "spa": "Procesando",
    "eng": "Working",
    "fre": "En traitement",
    "cze": "Pracovní",
    "ger": "Arbeitet"
  },
  "Source": {
    "cat": "Font",
    "spa": "Fuente",
    "eng": "Source",
    "fre": "Source",
    "cze": "Zdroj",
    "ger": "Quelle"
  },
  "Agent": {
    "cat": "Agent",
    "spa": "Agente",
    "eng": "Agent",
    "fre": "Agent",
    "cze": "Agent",
    "ger": "Agent"
  },
  "Agents": {
    "cat": "Agents",
    "spa": "Agentes",
    "eng": "Agents",
    "fre": "Agents",
    "cze": "Agenti",
    "ger": "Agenten"
  },
  "Executable": {
    "cat": "Executable",
    "spa": "Ejecutable",
    "eng": "Executable",
    "fre": "Exécutable",
    "cze": "Spustitelný",
    "ger": "Ausführbar"
  },
  "compilationDate": {
    "cat": "data de compilació",
    "spa": "fecha de compilación",
    "eng": "compilation date",
    "fre": "date de compilation",
    "cze": "datum kompilace",
    "ger": "Kompilierungsdatum"
  },
  "CompilationDate": {
    "cat": "Data de compilació",
    "spa": "Fecha de compilación",
    "eng": "Compilation date",
    "fre": "Date de compilation",
    "cze": "Datum kompilace",
    "ger": "Datum der Kompilierung"
  },
  "Algorithm": {
    "cat": "Algorisme",
    "spa": "Algoritmo",
    "eng": "Algorithm",
    "fre": "Algorithme",
    "cze": "Algoritmus",
    "ger": "Algorithmus"
  },
  "Algorithms": {
    "cat": "Algorismes",
    "spa": "Algoritmos",
    "eng": "Algorithms",
    "fre": "Algorithmes",
    "cze": "Algoritmy",
    "ger": "Algorithmen"
  },
  "Functionality": {
    "cat": "Funcionalitat",
    "spa": "Funcionalidad",
    "eng": "Functionality",
    "fre": "Fonctionnalité",
    "cze": "Funkčnost",
    "ger": "Funktionsweise"
  },
  "Functionalities": {
    "cat": "Funcionalitats",
    "spa": "Funcionalidades",
    "eng": "Functionalities",
    "fre": "Fonctionnalités",
    "cze": "Funkce",
    "ger": "Funktionalitäten"
  },
  "Step": {
    "cat": "Pas",
    "spa": "Paso",
    "eng": "Step",
    "fre": "Étape",
    "cze": "Krok",
    "ger": "Schritt"
  },
  "role": {
    "cat": "paper",
    "spa": "papel",
    "eng": "role",
    "fre": "rôle",
    "cze": "role",
    "ger": "Rolle"
  },
  "reference": {
    "cat": "referència",
    "spa": "referencia",
    "eng": "reference",
    "fre": "référence",
    "cze": "odkaz",
    "ger": "Referenz"
  },
  "description": {
    "cat": "descripció",
    "spa": "descripción",
    "eng": "description",
    "fre": "description",
    "cze": "popis",
    "ger": "Beschreibung"
  },
  "Description": {
    "cat": "Descripció",
    "spa": "Descripción",
    "eng": "Description",
    "fre": "Descriptif",
    "cze": "Popis",
    "ger": "Beschreibung"
  },
  "purpose": {
    "cat": "propòsit",
    "spa": "propósito",
    "eng": "purpose",
    "fre": "raison",
    "cze": "účel",
    "ger": "Zweck"
  },
  "Start": {
    "cat": "Inici",
    "spa": "Inicio",
    "eng": "Start",
    "fre": "Départ",
    "cze": "Start",
    "ger": "Start"
  },
  "Type": {
    "cat": "Tipus ",
    "spa": "Tipo",
    "eng": "Type",
    "fre": "Type",
    "cze": "Typ",
    "ger": "Typ"
  },
  "Attribute": {
    "cat": "Atribut:",
    "spa": "Atributo:",
    "eng": "Attribute:",
    "fre": "Attribut:",
    "cze": "Atribut:",
    "ger": "Attribut:"
  },
  "TheProperty": {
    "cat": "La propietat",
    "spa": "La propiedad",
    "eng": "The property",
    "fre": "La propriété",
    "cze": "Vlastnost",
    "ger": "Die Immobilie"
  },
  "End": {
    "cat": "Fi",
    "spa": "Fin",
    "eng": "End",
    "fre": "But",
    "cze": "Konec",
    "ger": "Ende"
  },
  "mustBe": {
    "cat": "ha de ser",
    "spa": "debe ser",
    "eng": "must be",
    "fre": "doit être",
    "cze": "musí být",
    "ger": "muss sein"
  },
  "YouMayContinue": {
    "cat": "Es deixa continuar",
    "spa": "Se deja continuar",
    "eng": "You may continue",
    "fre": "Il est permis de continuer",
    "cze": "Můžete pokračovat",
    "ger": "Sie können fortfahren"
  },
  "approx": {
    "cat": "aprox",
    "spa": "aprox",
    "eng": "approx",
    "fre": "approx",
    "cze": "přibližně",
    "ger": "ca."
  },
  "atLat": {
    "cat": "a lat",
    "spa": "a lat",
    "eng": "at lat",
    "fre": "à lat",
    "cze": "na latě",
    "ger": "bei lat"
  },
  "automatic": {
    "cat": "automàtic",
    "spa": "automático",
    "eng": "automatic",
    "fre": "automatique",
    "cze": "automatické",
    "ger": "automatisch"
  },
  "indicatedAt": {
    "cat": "indicada a",
    "spa": "indicada en",
    "eng": "indicated at",
    "fre": "indiquée à",
    "cze": "uvedeno na",
    "ger": "angezeigt bei"
  },
  "cannotBeActivated": {
    "cat": "no pot ser activada",
    "spa": "no puede ser activada",
    "eng": "cannot be activated",
    "fre": "ne peut pas être activée",
    "cze": "nelze aktivovat",
    "ger": "kann nicht aktiviert werden"
  },
  "CannotFindStyle": {
    "cat": "No trobo l'estil",
    "spa": "No encuentro el estilo",
    "eng": "Cannot find style",
    "fre": "Impossible trouver le style",
    "cze": "Nelze najít styl",
    "ger": "Stil nicht gefunden"
  },
  "ForLayer": {
    "cat": "per a la capa",
    "spa": "para la capa",
    "eng": "for the layer",
    "fre": "pour cette couche",
    "cze": "pro vrstvu",
    "ger": "für den Layer"
  },
  "CannotFindLayer": {
    "cat": "No trobo la capa",
    "spa": "No encuentro la capa",
    "eng": "Cannot find layer",
    "fre": "Impossible trouver la couche",
    "cze": "Nelze najít vrstvu",
    "ger": "Layer kann nicht gefunden werden"
  },
  "request": {
    "cat": "petició",
    "spa": "petición",
    "eng": "request",
    "fre": "demande",
    "cze": "požadavek",
    "ger": "Anfrage"
  },
  "Request": {
    "cat": "Petició",
    "spa": "Petición",
    "eng": "Request",
    "fre": "Demande",
    "cze": "Požadavek",
    "ger": "Anfrage"
  },
  "unknown": {
    "cat": "desconeguda",
    "spa": "desconocida",
    "eng": "unknown",
    "fre": "inconnu",
    "cze": "neznámý",
    "ger": "unbekannt"
  },
  "IncompleteTag": {
    "cat": "Etiqueta incomplerta",
    "spa": "Etiqueta incompleta",
    "eng": "Incomplete tag",
    "fre": "Étiquette incomplète",
    "cze": "Neúplná značka",
    "ger": "Unvollständige Kennzeichnung"
  },
  "MissingAttribute": {
    "cat": "Manca atribut",
    "spa": "Falta atributo",
    "eng": "Missing attribute",
    "fre": "Manque attribut",
    "cze": "Chybějící atribut",
    "ger": "Fehlendes Attribut"
  },
  "MissingMandatoryTag": {
    "cat": "Manca etiqueta obligatòria",
    "spa": "Falta etiqueta obligatoria",
    "eng": "Missing mandatory tag",
    "fre": "Manque étiquette obligatorire",
    "cze": "Chybějící povinná značka",
    "ger": "Fehlende obligatorische Kennzeichnung"
  },
  "missingMandatoryNestedTags": {
    "cat": "manquen etiquetes anidades obligatòries",
    "spa": "falten etiquetas anidadas obligatorias",
    "eng": "missing mandatory nested tags",
    "fre": "des étiquettes nichées obligatoires manquantes",
    "cze": "chybějící povinné vložené značky",
    "ger": "Fehlende obligatorische verschachtelte Kennzeichnungen"
  },
  "Authorship": {
    "cat": "Autoria",
    "spa": "Autoría",
    "eng": "Authorship",
    "fre": "Paternité",
    "cze": "Autorství",
    "ger": "Urheberschaft"
  },
  "Publisher": {
    "cat": "Editor",
    "spa": "Editor",
    "eng": "Publisher",
    "fre": "Éditeur",
    "cze": "Vydavatel",
    "ger": "Herausgeber"
  },
  "Generated": {
    "cat": "Generar",
    "spa": "Generar",
    "eng": "Generate",
    "fre": "Générer",
    "cze": "Generovat",
    "ger": "Erzeugen"
  },
  "GeneratedBy": {
    "cat": "Generat amb",
    "spa": "Generado con",
    "eng": "Generated by",
    "fre": "Généré par",
    "cze": "Vygenerováno podle",
    "ger": "Erzeugt von"
  },
  "Boundaries": {
    "cat": "Àmbit",
    "spa": "Ámbito",
    "eng": "Boundaries",
    "fre": "Champ",
    "cze": "Hranice",
    "ger": "Begrenzungen"
  },
  "TimeResolution": {
    "cat": "Interval de temps",
    "spa": "Intérvalo de tiempo",
    "eng": "Time resolution",
    "fre": "Résolution temporelle",
    "cze": "Časové rozlišení",
    "ger": "Zeitliche Auflösung"
  },
  "UpdateDate": {
    "cat": "Data d'actualització",
    "spa": "Fecha de actualización",
    "eng": "Update date",
    "fre": "Date de mise à jour",
    "cze": "Datum aktualizace",
    "ger": "Datum der Aktualisierung"
  },
  "CreatorApplication": {
    "cat": "Creat amb",
    "spa": "Creado con",
    "eng": "Creator application",
    "fre": "Créé avec",
    "cze": "Aplikace tvůrce",
    "ger": "Ersteller der Anwendung"
  },
  "Rights": {
    "cat": "Drets",
    "spa": "Derechos",
    "eng": "Rights",
    "fre": "Droits",
    "cze": "Práva",
    "ger": "Rechte"
  },
  "GeospatialExtent": {
    "cat": "Extensió geoespacial",
    "spa": "Extensión geoespacial",
    "eng": "Geospatial extent",
    "fre": "Extension géospatiale",
    "cze": "Geoprostorový rozsah",
    "ger": "Geografische Ausdehnung"
  },
  "TemporalExtent": {
    "cat": "Extensió temporal",
    "spa": "Extensión temporal",
    "eng": "Temporal extent",
    "fre": "Extension temporelle",
    "cze": "Časový rozsah",
    "ger": "Zeitliche Ausdehnung"
  },
  "Preview": {
    "cat": "Previsualització",
    "spa": "Previsualización",
    "eng": "Preview",
    "fre": "Aperçu",
    "cze": "Náhled",
    "ger": "Vorschau"
  },
  "ContentDescription": {
    "cat": "Descripció del contingut",
    "spa": "Descripción del contenido",
    "eng": "Content description",
    "fre": "Description du contenu",
    "cze": "Popis obsahu",
    "ger": "Beschreibung des Inhalts"
  },
  "ContentReference": {
    "cat": "Referència al contingut",
    "spa": "Referencia al contenido",
    "eng": "Content by reference",
    "fre": "Contenu par référence",
    "cze": "Obsah podle odkazu",
    "ger": "Inhalt durch Verweis"
  },
  "SourceMetadata": {
    "cat": "Metadades de la font",
    "spa": "Metadatos de la fuente",
    "eng": "Source metadata",
    "fre": "Métadónnées de source",
    "cze": "Zdrojová metadata",
    "ger": "Metadaten zur Quelle"
  },
  "MinimumDisplayScale": {
    "cat": "Escala mínima de visualització",
    "spa": "Escala mínima de visualización",
    "eng": "Minimum display scale",
    "fre": "Échelle d'affichage minimale",
    "cze": "Minimální měřítko zobrazení",
    "ger": "Minimaler Anzeigeskala"
  },
  "MaximumDisplayScale": {
    "cat": "Escala màxima de visualització",
    "spa": "Escala máxima de visualización",
    "eng": "Maximum display scale",
    "fre": "Échelle d'affichage maximale",
    "cze": "Maximální měřítko zobrazení",
    "ger": "Maximale Anzeigeskala"
  },
  "Offering": {
    "cat": "Oferta de servei ('offering')",
    "spa": "Oferta de servicio ('offering')",
    "eng": "Offering",
    "fre": "Offre de services ('offering')",
    "cze": "Nabízející ('offering')",
    "ger": "Angebot ('offering')"
  },
  "LayerActiveAndVisible": {
    "cat": "La capa estarà activa i visible",
    "spa": "La capa estarà activa y visible",
    "eng": "Layer will be active and visible",
    "fre": "La couche sera active et visible",
    "cze": "Vrstva bude aktivní a viditelná",
    "ger": "Layer wird aktiv und sichtbar sein"
  },
  "LayerNotVisible": {
    "cat": "La capa no estarà visible",
    "spa": "La capa no estarà visible",
    "eng": "Layer will be not visible",
    "fre": "La couche ne sera pas visible",
    "cze": "Vrstva nebude viditelná",
    "ger": "Layer wird nicht sichtbar sein"
  },
  "LayersOnView": {
    "cat": "Capes de la vista",
    "spa": "Capas de la vista",
    "eng": "Layers on this view",
    "fre": "Couches sur ce point de vue",
    "cze": "Vrstvy v tomto zobrazení",
    "ger": "Layers in dieser Ansicht"
  },
  "AddToView": {
    "cat": "Afegir a vista",
    "spa": "Añadir a vista",
    "eng": "Add to view",
    "fre": "Ajoutez à la vue",
    "cze": "Přidat do zobrazení",
    "ger": "Zur Ansicht hinzufügen"
  },
  "AddSelectedLayersCurrentVisu": {
    "cat": "Afegeix les capes seleccionades a la visualització actual",
    "spa": "Añade las capas seleccionadas a la visualización actual",
    "eng": "Add the selected layers to the current visualization",
    "fre": "Ajoutez les couches choisies à la visualisation actuelle",
    "cze": "Přidání vybraných vrstev do aktuálního zobrazení",
    "ger": "Hinzufügen der ausgewählten Layers zur aktuellen Visualisierung"
  },
  "CloseViewOpen": {
    "cat": "Tancar vista i obrir",
    "spa": "Cerrar vista y abrir",
    "eng": "Close view and open",
    "fre": "Fermer la vue et ovrir",
    "cze": "Zavřít zobrazení a otevřít",
    "ger": "Ansicht schließen und öffnen"
  },
  "CloseOpenNewSelectedLayers": {
    "cat": "Tanca la visualització actual i obre una nova amb les capes seleccionades",
    "spa": "Cierra la visualización actual y abre una nueva con las capas seleccionadas",
    "eng": "Close the current visualization and open a new one with the selected layers",
    "fre": "Fermez la visualisation en cours et ouvrez une nouvelle avec les couches choisies",
    "cze": "Zavřít aktuální vizualizaci a otevřít novou s vybranými vrstvami",
    "ger": "Schließen Sie die aktuelle Visualisierung und öffnen Sie eine neue mit den ausgewählten Layers"
  },
  "DocumentLanguage": {
    "cat": "Idioma del document",
    "spa": "Idioma del documento",
    "eng": "Document language",
    "fre": "Langue du document",
    "cze": "Jazyk dokumentu",
    "ger": "Sprache des Dokuments"
  },
  "Author": {
    "cat": "Autor",
    "spa": "Autor",
    "eng": "Author",
    "fre": "Auteur",
    "cze": "Autor",
    "ger": "Autor"
  },
  "MandatoryField": {
    "cat": "Camp obligatori",
    "spa": "Campo obligatorio",
    "eng": "Mandatory field",
    "fre": "Champ obligatoire",
    "cze": "Povinné pole",
    "ger": "Obligatorisches Feld"
  },
  "NotHaveOffering": {
    "cat": "no té cap 'offering'",
    "spa": "no tiene ningún 'offering'",
    "eng": "do not have any offering",
    "fre": "n'a pas 'offering'",
    "cze": "nemají žádnou nabídku",
    "ger": "kein Angebot haben"
  },
  "moreInfo": {
    "cat": "més info",
    "spa": "más info",
    "eng": "more info",
    "fre": "plus d'info",
    "cze": "více informací",
    "ger": "mehr Infos"
  },
  "ThereAre": {
    "cat": "Hi ha",
    "spa": "Hay",
    "eng": "There are",
    "fre": "Il y a",
    "cze": "Tam jsou",
    "ger": "Es gibt"
  },
  "WrongAttributeName": {
    "cat": "Nom d'atribut incorrecte",
    "spa": "Nombre de atributo incorrecto",
    "eng": "Wrong attribute name",
    "fre": "Nom d'attribut incorrect",
    "cze": "Špatný název atributu",
    "ger": "Falscher Attributname"
  },
  "MustSelectField": {
    "cat": "Cal seleccionar un camp",
    "spa": "Debe seleccionar un campo",
    "eng": "You must select a field",
    "fre": "Vous devez sélectionner un champ",
    "cze": "Musíte vybrat pole",
    "ger": "Sie müssen ein Feld auswählen"
  },
  "empty": {
    "cat": "buit",
    "spa": "vacio",
    "eng": "empty",
    "fre": "vide",
    "cze": "prázdný",
    "ger": "leer"
  },
  "separatedBy": {
    "cat": "separats per",
    "spa": "separados por",
    "eng": "separated by",
    "fre": "séparées par",
    "cze": "oddělené podle",
    "ger": "getrennt durch"
  },
  "TemporalField": {
    "cat": "Camp temporal",
    "spa": "Campo temporal",
    "eng": "Temporal field",
    "fre": "Temporal Champ",
    "cze": "Časové pole",
    "ger": "Zeitliches Feld"
  },
  "byBoundingBox": {
    "cat": "per envolupant",
    "spa": "por envolvente",
    "eng": "by bounding box",
    "fre": "par zone de délimitation",
    "cze": "ohraničujícím polem",
    "ger": "durch Bounding Box"
  },
  "Compute": {
    "cat": "Calcular",
    "spa": "Calcular",
    "eng": "Compute",
    "fre": "Calculer",
    "cze": "Výpočítat",
    "ger": "Berechnen Sie"
  },
  "resize": {
    "cat": "redimensionar",
    "spa": "redimensionar",
    "eng": "resize",
    "fre": "redimensionner",
    "cze": "změna velikosti",
    "ger": "Größe ändern"
  },
  "symbolizeLayer": {
    "cat": "per simbolitzar la capa",
    "spa": "para simbolizar la capa",
    "eng": "to symbolize the layer",
    "fre": "por symboliser la couche",
    "cze": "symbolizovat vrstvu",
    "ger": "um den Layer zu symbolisieren"
  },
  "UnsuppServiceType": {
    "cat": "Tipus de servei suportat",
    "spa": "Tipo de servicio no suportado",
    "eng": "Unsupported service type",
    "fre": "Type de service non supportée",
    "cze": "Nepodporovaný typ služby",
    "ger": "Nicht unterstützter Diensttyp"
  },
  "toTheStart": {
    "cat": "al inici",
    "spa": "al inicio",
    "eng": "to the start",
    "fre": "au début",
    "cze": "na začátek",
    "ger": "zum Start"
  },
  "stepBack": {
    "cat": "retrocedir un",
    "spa": "retroceder una",
    "eng": "step back",
    "fre": "revenir un",
    "cze": "krok zpět",
    "ger": "Schritt zurück"
  },
  "pause": {
    "cat": "pausa",
    "spa": "pausa",
    "eng": "pause",
    "fre": "pause",
    "cze": "pauza",
    "ger": "pausieren"
  },
  "play": {
    "cat": "reproduir",
    "spa": "reproducir",
    "eng": "play",
    "fre": "reproduire",
    "cze": "přehrát",
    "ger": "abspielen"
  },
  "repeatedlyPlay": {
    "cat": "reproduir repetitivament",
    "spa": "reproducir repetitívamente",
    "eng": "repeatedly play",
    "fre": "reproduire à plusieurs reprises",
    "cze": "opakovaně přehrávat",
    "ger": "wiederholt abspielen"
  },
  "stepForward": {
    "cat": "avançar un",
    "spa": "avanzar una",
    "eng": "step forward",
    "fre": "avancer un",
    "cze": "krok vpřed",
    "ger": "Schritt vorwärts"
  },
  "toTheEnd": {
    "cat": "al final",
    "spa": "al final",
    "eng": "to the end",
    "fre": "à la fin",
    "cze": "až do konce",
    "ger": "bis zum Ende"
  },
  "SpeedyBy": {
    "cat": "Rapidesa per",
    "spa": "Rapidez por",
    "eng": "Speed by",
    "fre": "Vitesse pour",
    "cze": "Rychlost podle",
    "ger": "Geschwindigkeit in"
  },
  "StartDate": {
    "cat": "Data inicial",
    "spa": "Fecha inicial",
    "eng": "Start date",
    "fre": "Date de début",
    "cze": "Datum zahájení",
    "ger": "Startdatum"
  },
  "EndDate": {
    "cat": "Data final",
    "spa": "Fecha final",
    "eng": "End date",
    "fre": "Date de fin",
    "cze": "Datum konce",
    "ger": "Enddatum"
  },
  "Load": {
    "cat": "Carregar",
    "spa": "Cargar",
    "eng": "Load",
    "fre": "Charge",
    "cze": "Načíst",
    "ger": "Laden"
  },
  "Loading": {
    "cat": "Carregant",
    "spa": "Cargando",
    "eng": "Loading",
    "fre": "Chargement",
    "cze": "Načítání",
    "ger": "Lädt"
  },
  "WrongFormat": {
    "cat": "Format incorrecte",
    "spa": "Formato incorrecto",
    "eng": "Wrong format",
    "fre": "Format incorrect",
    "cze": "Špatný formát",
    "ger": "Falsches Format"
  },
  "TryAgain": {
    "cat": "Torna-ho a intentar",
    "spa": "Vuélvalo a intentar",
    "eng": "Try again",
    "fre": "Réessayez",
    "cze": "Zkuste to znovu",
    "ger": "Erneut versuchen"
  },
  "SendingFile": {
    "cat": "Enviant fitxer",
    "spa": "Enviando fichero",
    "eng": "Sending file",
    "fre": "Fichier en cours d'envoi",
    "cze": "Odesílání souboru",
    "ger": "Datei wird gesendet"
  },
  "Predefined": {
    "cat": "Predefinit",
    "spa": "Predefinido",
    "eng": "Predefined",
    "fre": "Prédéfinie",
    "cze": "Předdefinované",
    "ger": "Vordefiniert"
  },
  "Local": {
    "cat": "Local",
    "spa": "Local",
    "eng": "Local",
    "fre": "Local",
    "cze": "Místní",
    "ger": "Lokal"
  },
  "ChangeFile": {
    "cat": "Canviar el fitxer",
    "spa": "Cambiar el fichero",
    "eng": "Change a file",
    "fre": "Changer le fichier",
    "cze": "Změnit soubor",
    "ger": "Ändern Sie eine Datei"
  },
  "Send": {
    "cat": "Enviar",
    "spa": "Enviar",
    "eng": "Send",
    "fre": "Envoyer",
    "cze": "Odeslat",
    "ger": "Senden"
  },
  "Url": {
    "cat": "URL",
    "spa": "URL",
    "eng": "URL",
    "fre": "URL",
    "cze": "URL",
    "ger": "URL"
  },
  "OutputParameter": {
    "cat": "Paràmetres de sortida",
    "spa": "Parámetros de salida",
    "eng": "Output parameters",
    "fre": "Paramètres de sortie",
    "cze": "Výstupní parametry",
    "ger": "Ausgabeparameter"
  },
  "Execute": {
    "cat": "Executar",
    "spa": "Ejecutar",
    "eng": "Execute",
    "fre": "Exécuter",
    "cze": "Spustit",
    "ger": "Ausführen von"
  },
  "Thickness": {
    "cat": "Griux",
    "spa": "Grosor",
    "eng": "Thickness",
    "fre": "Épaisseur",
    "cze": "Tloušťka",
    "ger": "Strichbreite"
  },
	"Transparency": {
    "cat": "Transparència",
    "spa": "Transparencia",
    "eng": "Transparency",
    "fre": "Transparence",
    "cze": "Transparentnost",
    "ger": "Transparenz"
  },
  "UserConfiguration": {
    "cat": "Configuració d'usuari",
    "spa": "Configuración de usuario",
    "eng": "User configuration",
    "fre": "Configuration de l'utilisateur",
    "cze": "Konfigurace uživatele",
    "ger": "Benutzer-Konfiguration"
  },
  "SelectConfigLoad": {
    "cat": "Selecciona un fitxer de configuració a carregar",
    "spa": "Selecciona un fichero de configuración para cargar",
    "eng": "Select a config file to load",
    "fre": "Sélectionnez un fichier de configuration à charger",
    "cze": "Výběr konfiguračního souboru k načtení",
    "ger": "Wählen Sie eine zu ladende Konfigurationsdatei"
  },
  "FileName": {
    "cat": "Nom del fitxer",
    "spa": "Nombre del fichero",
    "eng": "File name",
    "fre": "Nom du fichier",
    "cze": "Název souboru",
    "ger": "Name der Datei"
  },
  "FileNameToSave": {
    "cat": "Nom del fitxer a guardar",
    "spa": "Nombre del fichero a guardar",
    "eng": "File name to save",
    "fre": "Nom du fichier à sauvegarder",
    "cze": "Název souboru k uložení",
    "ger": "Zu speichernder Dateiname"
  },
  "WrongNumberElementsLine": {
    "cat": "Nombre d'elements incorrecte a la línia",
    "spa": "Número de elementos incorrecto en la línea",
    "eng": "Wrong number of elements in line",
    "fre": "Wrong number of elements in line",
    "cze": "Špatný počet prvků v řádku",
    "ger": "Falsche Anzahl von Elementen in der Zeile"
  },
  "WrongFormatInLine": {
    "cat": "Format incorrecte a la línia",
    "spa": "Formato incorrecto en la línea",
    "eng": "Wrong values format in line",
    "fre": "Mauvais format en ligne",
    "cze": "Špatný formát hodnot v řádku",
    "ger": "Falsches Werteformat in der Zeile"
  },
  "Share": {
    "cat": "Compartir",
    "spa": "Compartir",
    "eng": "Share",
    "fre": "Partager",
    "cze": "Sdílet",
    "ger": "Teilen"
  },
  "Edit": {
    "cat": "Editar",
    "spa": "Editar",
    "eng": "Edit",
    "fre": "Editer",
    "cze": "Upravit",
    "ger": "Bearbeiten"
  },
  "cntxmenu": {
    "ShareLayer": {
      "cat": "Compartir capa",
      "spa": "Compartir capa",
      "eng": "Share layer",
      "fre": "Partager couche",
      "cze": "Sdílení vrstvy",
      "ger": "Layer freigeben"
    },
    "RemoveLayer": {
      "cat": "Eliminar capa",
      "spa": "Eliminar capa",
      "eng": "Remove layer",
      "fre": "Effacer couche",
      "cze": "Odstranění vrstvy",
      "ger": "Layer entfernen"
    },
    "MoveLayer": {
      "cat": "Moure la capa",
      "spa": "Mover la capa",
      "eng": "Move layer",
      "fre": "Déplacer la couche",
      "cze": "Přesun vrstvy",
      "ger": "Layer verschieben"
    },
    "ToTheTop": {
      "cat": "A sobre de tot",
      "spa": "Encima de todo",
      "eng": "To the top",
      "fre": "En haut de",
      "cze": "Na vrchol",
      "ger": "Zum Anfang"
    },
    "Up": {
      "cat": "A sobre",
      "spa": "Encima",
      "eng": "Up",
      "fre": "Au-dessus",
      "cze": "Nahoru",
      "ger": "Nach oben"
    },
    "Down": {
      "cat": "A sota",
      "spa": "Debajo",
      "eng": "Down",
      "fre": "Au-dessous",
      "cze": "Dolů",
      "ger": "Nach unten"
    },
    "ToTheEnd": {
      "cat": "A sota de tot",
      "spa": "Debajo de todo",
      "eng": "To the end",
      "fre": "En bas",
      "cze": "Na konec",
      "ger": "Zum Ende"
    },
    "EditStyle": {
      "cat": "Edita estil",
      "spa": "Editar estilo",
      "eng": "Edit style",
      "fre": "Modifier le style",
      "cze": "Upravit styl",
      "ger": "Stil bearbeiten"
    },
    "ofEditingStyle": {
      "cat": "de editar l'estil",
      "spa": "de editar el estilo",
      "eng": "of editing the style",
      "fre": "pour modifier le style",
      "cze": "úpravy stylu",
      "ger": "der Bearbeitung des Stils"
    },
    "StyleName": {
      "cat": "Nom de l'estil",
      "spa": "Nombre del estilo",
      "eng": "Name of the style",
      "fre": "Nom du style",
      "cze": "Název stylu",
      "ger": "Name des Stils"
    },
	"Vora": {
		"cat": "Vora",
		"spa": "Borde",
		"eng": "Border",
		"fre": "Bordure",
		"cze": "Hranice",
		"ger": "Grenze"
	},
	"Interior": {
		"cat": "Interior",
		"spa": "Interior",
		"eng": "Interior",
		"fre": "Intérieur",
		"cze": "Vnitřek",
		"ger": "Innere"
	},
    "ConfusionMatrix": {
      "cat": "Matriu de confusió",
      "spa": "Matriz de confusión",
      "eng": "Confusion matrix",
      "fre": "Matrice de confusion",
      "cze": "Matice zmatků",
      "ger": "Konfusionsmatrix"
    },
    "StatisticByCategory": {
      "cat": "Estadístic per categoria",
      "spa": "Estadístico por categoria",
      "eng": "Statistic by category",
      "fre": "Statistique par catégorie",
      "cze": "Statistika podle kategorie",
      "ger": "Statistik nach Kategorie"
    },
    "Statistic": {
      "cat": "Estadístic",
      "spa": "Estadístico",
      "eng": "Statistic",
      "fre": "Statistique",
      "cze": "Statistika",
      "ger": "Statistik"
    },
    "Surface": {
      "cat": "Superfície",
      "spa": "Superficie",
      "eng": "Surface",
      "fre": "Surface",
      "cze": "Povrch",
      "ger": "Oberfläche"
    },
    "RGBCombination": {
      "cat": "Combinació RGB",
      "spa": "Combinación RGB",
      "eng": "RGB combination",
      "fre": "Combinaison RVB",
      "cze": "Kombinace RGB",
      "ger": "RGB-Kombination"
    },
    "Reclassification": {
      "cat": "Reclassificació",
      "spa": "Reclasificación",
      "eng": "Reclassification",
      "fre": "Reclassement",
      "cze": "Reklasifikace",
      "ger": "Neuklassifizierung"
    },
    "RetrieveStyles": {
      "cat": "Recupera estils",
      "spa": "Recupera estilos",
      "eng": "Retrieve styles",
      "fre": "Récupérer les styles",
      "cze": "Vyhledávat styly",
      "ger": "Stile abrufen"
    },
    "ShareStyle": {
      "cat": "Compartir estil",
      "spa": "Compartir estilo",
      "eng": "Share style",
      "fre": "Partager style",
      "cze": "Sdílet styl",
      "ger": "Stil freigeben"
    },
    "DeleteStyle": {
      "cat": "Esborrar estil",
      "spa": "Borrar estilo",
      "eng": "Delete style",
      "fre": "Effacer style",
      "cze": "Odstranit styl",
      "ger": "Stil löschen"
    },
    "ComputeQuality": {
      "cat": "Calcula la qualitat",
      "spa": "Calcula la calidad",
      "eng": "Compute the quality",
      "fre": "Calculer la qualité",
      "cze": "Výpočet kvality",
      "ger": "Berechnen der Qualität"
    },
    "toComputeTheQuality": {
      "cat": "de calcular la qualitat",
      "spa": "de calcular la calidad",
      "eng": "to compute the quality",
      "fre": "pour calculer la qualité",
      "cze": "vypočítat kvalitu",
      "ger": "zum Berechnen der Qualität"
    },
    "NewLayerAdded": {
      "cat": "La nova capa afegida",
      "spa": "La nueva capa añadida",
      "eng": "The new added layer",
      "fre": "La nouvelle couche ajoutée",
      "cze": "Nově přidaná vrstva",
      "ger": "Der neu hinzugefügte Layer"
    },
    "ZoomToLayer": {
      "cat": "Zoom a capa",
      "spa": "Zoom a capa",
      "eng": "Zoom to layer",
      "fre": "Afficher en entier",
      "cze": "Přiblížení k vrstvě",
      "ger": "Auf Layer zoomen"
    },
    "WhyNotVisible": {
      "cat": "Perquè no visible",
      "spa": "Porque no visible",
      "eng": "Why not visible",
      "fre": "Pourquoi pas visible",
      "cze": "Proč není vidět",
      "ger": "Warum nicht sichtbar"
    },
    "notVisibleInCurrentZoom": {
      "cat": "no és visible al nivell de zoom actual del navegador",
      "spa": "no es visible al nivel de zoom actual del navegador",
      "eng": "is not visible in the current zoom level of the browser",
      "fre": "n'est pas visible au niveau du zoom actuel du navigateur",
      "cze": "není viditelná v aktuální úrovni přiblížení prohlížeče",
      "ger": "ist in der aktuellen Zoomstufe des Browsers nicht sichtbar"
    },
    "notVisibleInCurrentCRS": {
      "cat": "no és visible amb el CRS actual",
      "spa": "no es visible en el CRS actual",
      "eng": "is not visible in the current CRS",
      "fre": "n'est pas visible au CRS actuel",
      "cze": "není viditelná v aktuálním CRS",
      "ger": "ist im aktuellen CRS nicht sichtbar"
    },
    "notVisibleInCurrentView": {
      "cat": "no és visible en l'àmbit actual de la vista",
      "spa": "no es visible en el ámbito actual de la vista",
      "eng": "is not visible in the current view extent",
      "fre": "n'est pas visible dans l'étendue de la vue actuelle",
      "cze": "není viditelná v aktuálním rozsahu zobrazení",
      "ger": "ist im aktuellen Ansichtsbereich nicht sichtbar"
    },
    "OnlyVisibleInTheFollowCRS": {
      "cat": "Només és visible en els següents CRSs",
      "spa": "Solo es visible en los seguientes CRSs:",
      "eng": "It is only visible in the following CRSs",
      "fre": "Il n'est visible que dans les CRS suivants",
      "cze": "Je viditelný pouze v následujících CRSs",
      "ger": "Es ist nur in den folgenden CRSs sichtbar"
    },
    "toTheLayer": {
      "cat": "a la capa",
      "spa": "a la capa",
      "eng": "to the layer",
      "fre": "à la couche",
      "cze": "ve vrstvě",
      "ger": "zum Layer"
    },
    "containsReferencesEraseContinue": {
      "cat": "conté referències a la capa que s'està intentant esborrar i deixarà de funcionar. Vols continuar",
      "spa": "contiene referencias a la capa que se está intentando borrar y dejará de funcionar. Desea continuar",
      "eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue",
      "fre": "contient des références à la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer",
      "cze": "obsahuje odkazy na vrstvu, kterou se snažíte vymazat, a tím přestane fungovat. Chcete pokračovat",
      "ger": "enthält Verweise auf den Layer, die Sie zu löschen versuchen, und wird nicht mehr funktionieren. Möchten Sie fortfahren"
    },
    "containsReferencesStyleEraseContinue": {
      "cat": "conté referències a l'estil que s'està intentant esborrar i deixarà de funcionar. Vols continuar",
      "spa": "contiene referencias al estilo que se está intentando borrar y dejará de funcionar. Desea continuar",
      "eng": "contains references to the style that you are trying to erase and will stop working. Do you want to continue",
      "fre": "contient des références au style que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer",
      "cze": "obsahuje odkazy na styl, který se snažíte vymazat, a tím přestane fungovat. Chcete pokračovat",
      "ger": "enthält Verweise auf den Stil, den Sie zu löschen versuchen, und wird nicht mehr funktionieren. Möchten Sie fortfahren"
    },
    "ChooseTwoDifferentLayers": {
      "cat": "Cal triar dues capes diferents o la mateixa en estils i/o dates diferents",
      "spa": "Es necesario elegir dos capas diferentes o la misma en estilos y/o fechas diferentes",
      "eng": "You should choose two different layers or the same in different styles and/or dates",
      "fre": "You should  choose two different layers or the same in different styles and/or dates",
      "cze": "Měli byste si vybrat dvě různé vrstvy nebo stejné v různých stylech a/nebo datech",
      "ger": "Sie sollten zwei verschiedene Layers oder denselben Layer mit verschiedenen Stilen und/oder Daten wählen."
    },
    "_and_": {
      "cat": " i ",
      "spa": " y ",
      "eng": " and ",
      "fre": " et ",
      "cze": " a ",
      "ger": " und "
    },
    "CombinationOf": {
      "cat": "Combinació de ",
      "spa": "Combinación de ",
      "eng": "Combination of ",
      "fre": "Combination of ",
      "cze": "Kombinace ",
      "ger": "Kombination von "
    },
    "byCategoryOf": {
      "cat": "per categoria de",
      "spa": "por categorías de",
      "eng": "by category of",
      "fre": "par catégorie de",
      "cze": "podle kategorie",
      "ger": "nach Kategorie von"
    },
    "byCategoriesOf": {
      "cat": "per les categories de",
      "spa": "para las categorías de",
      "eng": "by categories of",
      "fre": "par catégories des",
      "cze": "podle kategorií",
      "ger": "nach Kategorien von"
    },
    "withStatisticsOf": {
      "cat": " amb estadistics de ",
      "spa": " con estadísticos de ",
      "eng": " with statistics of ",
      "fre": " avec statistiques par ",
      "cze": " se statistikami ",
      "ger": " mit Statistiken von "
    },
    "WrongNumberElementsInLine": {
      "cat": "Nombre d'elements incorrecte a la línia",
      "spa": "Número de elementos incorrecto en la línea",
      "eng": "Wrong number of elements in line",
      "fre": "Wrong number of elements in line",
      "cze": "Chybný počet prvků v řádku",
      "ger": "Falsche Anzahl von Elementen in der Zeile"
    },
    "WrongValuesFormatInLine": {
      "cat": "Format incorrecte dels valors a la línia",
      "spa": "Formato incorrecto de los valores en la línea",
      "eng": "Wrong values format in line",
      "fre": "Wrong values format in line",
      "cze": "Chybný formát hodnot v řádku",
      "ger": "Falsches Werteformat in der Zeile"
    },
    "WrongOldValueInLine": {
      "cat": "Valor a canviar incorrecte a la línia",
      "spa": "Valor a cambiar incorrecto en la línea",
      "eng": "Wrong old value in line",
      "fre": "Ancienne valeur erronée dans la ligne",
      "cze": "Špatná stará hodnota v řádku",
      "ger": "Falscher alter Wert in der Zeile"
    },
    "CannotObtainValidResponseFromServer": {
      "cat": "No s'ha obtingut cap resposta vàlida del servidor sol·licitat",
      "spa": "No se ha obtenido ninguna respuesta válida del servidor solicitado",
      "eng": "Cannot obtain any valid response from server",
      "fre": "Aucune réponse valide n'a été obtenue du serveur demandé",
      "cze": "Ze se serveru nelze získat žádnou platnou odpověď",
      "ger": "Kann keine gültige Antwort vom Server erhalten"
    },
    "ServerURL": {
      "cat": "URL del servidor",
      "spa": "URL del servidor",
      "eng": "server URL",
      "fre": "URL du serveur",
      "cze": "adresa URL serveru",
      "ger": "Server-URL"
    },
    "SelectAllLayers": {
      "cat": "Seleccionar totes les capes",
      "spa": "Seleccionar todas las capas",
      "eng": "Select all layers",
      "fre": "Sélectionner toutes les couches",
      "cze": "Vybrat všechny vrstvy",
      "ger": "Alle Layers auswählen"
    },
    "ServerNotHaveLayerInBrowserReferenceSystem": {
      "cat": "Aquest servidor no té cap capa disponible en el sistema de referència actual del navegador",
      "spa": "Este servidor no tiene ninguna capa disponible en el sistema de referéncia actual del navegador",
      "eng": "This server don't have any layer in the browser actual reference system",
      "fre": "Ce serveur n'a aucune couche disponible dans le système de référence actuel du navigateur",
      "cze": "Tento server nemá v aktuálním referenčním systému prohlížeče žádnou vrstvu",
      "ger": "Dieser Server hat keinen Layer im aktuellen Referenzsystem des Browsers"
    },
    "ServerNotHaveLayer": {
      "cat": "Aquest servidor no té cap capa disponible",
      "spa": "Este servidor no tiene ninguna capa disponible",
      "eng": "This server don't have any layer",
      "fre": "Ce serveur n'a aucune couche disponible",
      "cze": "Tento server nemá žádnou vrstvu",
      "ger": "Dieser Server verfügt über keinen Layer"
    },
    "ValidURLMustBeProvided": {
      "cat": "Cal indicar una adreça vàlida",
      "spa": "Se debe indicar una dirección válida",
      "eng": "A valid URL must be provided",
      "fre": "Vous devez indiquer une adresse valide",
      "cze": "Musí být zadána platná adresa URL",
      "ger": "Es muss eine gültige URL angegeben werden"
    },
    "ChooseOneFromList": {
      "cat": "Seleccciona'n un de la llista",
      "spa": "Escoja uno de la lista",
      "eng": "Choose one from list",
      "fre": "Sélectionnez un objet de la liste",
      "cze": "Vyberte jednu ze seznamu",
      "ger": "Wählen Sie eine aus der Liste"
    },
    "toShowInformationOrHelp": {
      "cat": "per mostrar informació o ajuda",
      "spa": "para mostrar información o ayuda",
      "eng": "to show information or help",
      "fre": "pour afficher des informations ou de l'aide",
      "cze": "pro zobrazení informací nebo nápovědy",
      "ger": "um Informationen oder Hilfe anzuzeigen"
    },
    "AddReclassifiedLayerAsNewStyle": {
      "cat": "Afegeix capa reclassificada com un nou estil",
      "spa": "Añada capa reclasificada como un nuevo estilo",
      "eng": "Add reclassified layer as a new style",
      "fre": "Ajouter une couche reclassée en tant que nouveau style",
      "cze": "Přidat reklasifikovanou vrstvu jako nový styl",
      "ger": "Neu klassifizierter Layer als neuen Stil hinzufügen"
    },
    "LayerToReclassify": {
      "cat": "Capa a reclassificar",
      "spa": "Capa a reclasificar",
      "eng": "Layer to reclassify",
      "fre": "Couche à reclassifier",
      "cze": "Vrstva, kterou chcete reklasifikovat",
      "ger": "Neu zu klassifizierender Layer"
    },
    "ReclassifyingExpression": {
      "cat": "Fórmula de reclassificació",
      "spa": "Fórmula de reclasificación",
      "eng": "Reclassifying expression",
      "fre": "Formule de reclassement",
      "cze": "Výraz pro reklasifikaci",
      "ger": "Reklassifizierender Ausdruck"
    },
    "ResultOfReclassificationAddedAsNewStyleWithName": {
      "cat": "El resultat de la reclassificació serà afegit com a un estil nou de nom",
      "spa": "El resultado de la reclasssificación será añadido como un estilo nuevo de nombre",
      "eng": "The result of the reclassification will be added as a new style with name",
      "fre": "Le résultat du reclassement sera ajouté en tant que nouveau style avec le nom",
      "cze": "Výsledek reklasifikace bude přidán jako nový styl s názvem",
      "ger": "Das Ergebnis der Umklassifizierung wird als neuer Stil mit folgendem Namen hinzugefügt"
    },
    "LayerForExpression": {
      "cat": "Capa per a la fórmula",
      "spa": "Capa para la fórmula",
      "eng": "Layer for the expression",
      "fre": "Couche pour l'expression",
      "cze": "Vrstva pro výraz",
      "ger": "Layer für den Ausdruck"
    },
    "WriteInExpression": {
      "cat": "Escriu a la fórmula",
      "spa": "Escribe en fórmula",
      "eng": "Write in expression",
      "fre": "Ecrire à la formule",
      "cze": "Zápis do výrazu",
      "ger": "Ausdruck hineinschreiben"
    },
    "OperatorsFunctionsForExpression": {
      "cat": "Operadors i funcions per a la fórmula",
      "spa": "Operadores y funciones para la fórmula",
      "eng": "Operators and functions for the expression",
      "fre": "Opérateurs et fonctions pour l'expression",
      "cze": "Operátory a funkce pro výraz",
      "ger": "Operatoren und Funktionen für den Ausdruck"
    },
	"SelectionAppliesToLayer" : {
		"cat": "La selecció aplica sobre la capa ",
		"spa": "La selección aplica sobre la capa ",
		"eng": "Selection applies to layer ",
		"fre": "La sélection s'applique sur la couche ",
		"cze": "Výběr platí pro vrstvu ",
		"ger": "Die Auswahl gilt für Layer "
	},
	"andTheFieldOf" : {
		"cat": " i el camp ",
		"spa": " y el campo ",
		"eng": " and the field of ",
		"fre": " et le champ ",
		"cze": " a pole ",
		"ger": " und das Feld "
	},
	"butFirstCondition" : {
		"cat": ", però la primera condició es fa sobre el camp ",
		"spa": ", pero la primera condición se realiza sobre el campo ",
		"eng": ", but the first condition is performed on the field of ",
		"fre": ", mais la première condition est réalisée sur le champ ",
		"cze": ", ale první podmínka se provádí na poli ",
		"ger": ", die erste Bedingung gilt jedoch für das Feld "
	},			
	"TheResultingValuesWillBe": {
		"cat": ". Els valors resultant seran del camp ",
		"spa": ". Los valores resultantes serán del campo ",
		"eng": ". The resulting values will be from the field of ",
		"fre": ". Les valeurs résultantes proviendront du champ ",
		"cze": ". Výsledné hodnoty budou na poli ",
		"ger": ". Die resultierenden Werte stammen aus dem Feld "
	},
	"evenIfTheConditionApliesToAnotherField": {
		"cat": " encara que la condició apliqui sobre un altre camp. Estàs segur que és això el que vols fer?",
		"spa": " aunque la condición aplique sobre otro campo. ¿Estás seguro de que esto es lo que quieres hacer?",
		"eng": " even if the condition applies to another field. Are you sure this is what you want to do?",
		"fre": " même si la condition s'applique à un autre champ. Etes-vous sûr que c'est ce que vous voulez faire?",
		"cze": " , i když se podmínka vztahuje na jiné pole. Jste si jistý, že toto je to, co chcete dělat?",
		"ger": " , auch wenn die Bedingung auf ein anderes Feld zutrifft. Sind Sie sicher, dass Sie das wirklich tun möchten?"
	},	
    "ResultOfSelectionAddedAsNewLayerStyleWithName": {
      "cat": "El resultat de la selecció serà afegit com a una capa/estil nou de nom",
      "spa": "El resultado de la selección será añadido como una capa/estilo nuevo de nombre",
      "eng": "The result of the selection will be added as a new layer/style with name",
      "fre": "Le résultat de la sélection sera ajouté en tant que nouveau couche/style avec le nom",
      "cze": "Výsledek výběru bude přidán jako nová vrstva/styl s názvem",
      "ger": "Das Ergebnis der Auswahl wird als neuer Layer/Stil hinzugefügt mit dem Namen"
    },
    "AddGeometricOverlayLayerBetweenTwoCategoricalLayers": {
      "cat": "Afegir una capa de superposició geomètrica entre dues capes categòriques",
      "spa": "Añadir una capa de superposición geométrica entre dos capas categóricas",
      "eng": "Add a geometric overlay layer between two categorical layers",
      "fre": "Ajouter un couche de superposition géométrique entre deux couche catégoriels",
      "cze": "Přidání geometrické překryvné vrstvy mezi dvě kategorické vrstvy",
      "ger": "Hinzufügen eines geometrischen Überlagerungslayers zwischen zwei kategorischen Layers"
    },
    "AddGeometricOverlay": {
      "cat": "Afegir superposició geomètrica",
      "spa": "Añadir superposición geométrica",
      "eng": "Add geometric overlay",
      "fre": "Ajouter une superposition géométrique",
      "cze": "Přidat geometrický překryv",
      "ger": "Geometrische Überlagerung hinzufügen"
    },
    "AddStatisticalFieldsToCategoricalLayerFromAnotherLayer": {
      "cat": "Afegir camps estadístics a una capa categòrica des d'una altra capa (de qualsevol tipus)",
      "spa": "Añada capa combinada a partir de dues capas existentes",
      "eng": "Add statistical fields to a categorical layer from another layer (of any type)",
      "fre": "Ajouter des champs statistiques à une couche catégorielle à partir d'une autre couche (de tout type)",
      "cze": "Přidání statistických proměnných do kategoriální vrstvy z jiné vrstvy (libovolného typu)",
      "ger": "Hinzufügen von statistischen Feldern zu einem kategorischen Layer aus einem anderen Layer (beliebiger Typ)"
    },
    "AddStatisticalFields": {
      "cat": "Afegir camps estadístics",
      "spa": "Añadir campos estadísticos",
      "eng": "Add statistical fields",
      "fre": "Ajouter des champs statistiques",
      "cze": "Přidat statistické proměnné",
      "ger": "Statistische Felder hinzufügen"
    },
	"ResultAddedAsNewLayerWithName": {
      "cat": "El resultat serà afegit com a una capa nova de nom",
      "spa": "El resultado será añadido como una capa nueva de nombre",
      "eng": "The result will be added as a new layer with name",
      "fre": "Le résultat sera ajouté en tant que nouvelle couche avec le nom",
      "cze": "Výsledek bude přidán jako nová vrstva s názvem",
      "ger": "Das Ergebnis wird als neuer Layer mit Namen hinzugefügtt"
    },
    "NewLayerFromServer": {
      "cat": "Capa nova de servidor",
      "spa": "Capa nueva de servidor",
      "eng": "New layer from server",
      "fre": "Nouvelle couche du serveur",
      "cze": "Nová vrstva ze serveru",
      "ger": "Neuer Layer vom Server"
    },
	"NewLayerFromFile": {
      "cat": "Capa nova de fitxer",
      "spa": "Capa nueva de fichero",
      "eng": "New layer from file",
      "fre": "Nouvelle couche du fichier",
      "cze": "Nová vrstva ze souboru",
      "ger": "Neuer Layer aus Datei"
    },	
    "NewLayerFromDisk": {
      "cat": "Capa nova de disc local",
      "spa": "Capa nueva de disco local",
      "eng": "New layer from local drive",
      "fre": "Nouvelle couche du lecteur local",
      "cze": "Nová vrstva z místní jednotky",
      "ger": "Neuer Layer vom lokalen Laufwerk"
    },
    "NewLayerFromURL": {
      "cat": "Capa nova des de URL",
      "spa": "Capa nueva desde URL",
      "eng": "New layer from URL",
      "fre": "Nouvelle couche du URL",
      "cze": "Nová vrstva z adresy URL",
      "ger": "Neuer Layer von URL"
    },
	"LocalDrive": {
      "cat": "Disc local",
      "spa": "Disco local",
      "eng": "Local drive",
      "fre": "Lecteur local",
      "cze": "Místní jednotka",
      "ger": "Lokale Laufwerk"
    },
	"Encoding" : {
		"cat": "Codificació",
		"spa": "Codificación",
		"eng": "Encoding",
		"fre": "Codage",
		"cze": "Kódování",
		"ger": "Kodierung"		
	},
	"Comma": {
		"cat": "Coma",
		"spa": "Coma",
		"eng": "Comma",
		"fre": "Virgule",
		"cze": "Čárka",
		"ger": "Komma"
	},	
	"Semicolon": {
		"cat": "Punt i coma",
		"spa": "Punto y coma",
		"eng": "Semicolon",
		"fre": "Point-virgule",
		"cze": "Středník",
		"ger": "Semikolon"
	},	
	"Space": {
		"cat": "Espai",
		"spa": "Espacio",
		"eng": "Space",
		"fre": "Espace",
		"cze": "Mezera",
		"ger": "Leerzeichen"
	},	
	"CSVFieldDelimiter": {
		"cat": "Delimitador de camps",
		"spa": "Delimitador de campos",
		"eng": "Field delimiter",
		"fre": "Délimiteur de champs",
		"cze": "Vymezovač polí",
		"ger": "Feldtrennzeichen"
	},
	"FirstLineContainsFieldsName":{
		"cat": "La primera línia conté els noms dels camps",
		"spa": "La primera línea contiene los nombres de los campos",
		"eng": "First line contains field names",
		"fre": "La première ligne contient les noms des champs",
		"cze": "První řádek obsahuje názvy polí",
		"ger": "Die erste Zeile enthält Feldnamen"
	},
	"Geometry": {
		"cat": "Geometria",
		"spa": "Geometría",
		"eng": "Geometry",
		"fre": "Géométrie",
		"cze": "Geometrii",
		"ger": "Geometrie"
	},	
	"CSVNameGeoField": {
		"cat": "Nom del camp que conté la geometria",
		"spa": "Nombre del campo con la geometría",
		"eng": "Field name that contains the geometry",
		"fre": "Nom du champ contenant la géométrie",
		"cze": "Název pole obsahujícího geometrii",
		"ger": "Name des Feldes mit der Geometrie"
	},
	"NameFieldWith": {
		"cat": "Nom del camp amb",
		"spa": "Nombre del campo con",
		"eng": "Field name with",
		"fre": "Nom du champ avec",
		"cze": "Název pole s",
		"ger": "Feldname mit"
	},
	"XField": {
		"cat": "coordenada X",
		"spa": "coordenada X",
		"eng": "X coordinate",
		"fre": "coordonnée X",
		"cze": "X-souřadnicí",
		"ger": "X-Koordinate"
	},
	"YField": {
		"cat": "coordenada Y",
		"spa": "coordenada Y",
		"eng": "Y coordinate",
		"fre": "coordonnée Y",
		"cze": "Y-souřadnicí",
		"ger": "Y-Koordinate"
	},
	"CSVNameDateTimeField": {
		"cat": "Nom del camp que conté la data-hora",
		"spa": "Nombre del campo con la fecha-hora",
		"eng": "Field name that contains date-time",
		"fre": "Nom du champ contenant la date-heure",
		"cze": "Název pole s datem a časem",
		"ger": "Name des Feldes mit Datum und Uhrzeit"
	},
	"SpecifyServerURL": {
      "cat": "Especifica l'adreça URL del servidor",
      "spa": "Especifique la dirección URL del servidor",
      "eng": "Specify the server URL",
      "fre": "Spécifiez l'adresse URL du serveur",
      "cze": "Zadejte adresu URL serveru",
      "ger": "Geben Sie die Server-URL an"
    },
    "orChooseOnFromServiceList": {
      "cat": "o Seleccciona'n un de la llista de serveis",
      "spa": "o Escoja uno de la lista de servicios",
      "eng": "or Choose one from service list",
      "fre": "ou sélectionnez un des services de la liste",
      "cze": "nebo Vyberte jednu ze seznamu služeb",
      "ger": "oder wählen Sie einen aus der Serviceliste"
    },
    "ofAddingLayerToBrowser": {
      "cat": "d'afegir capes al navegador",
      "spa": "de añadir capas al navegador",
      "eng": "of adding a layer to browser",
      "fre": "pour ajouter des couches au navigateur",
      "cze": "přidání vrstvy do prohlížeče",
      "ger": "zum Hinzufügen eines Layers zum Browser"
    },
    "LayerCalculator": {
      "cat": "Calculadora de capes",
      "spa": "Calculadora de capas",
      "eng": "Layer calculator",
      "fre": "Calculateur de couches",
      "cze": "Kalkulačka vrstev",
      "ger": "Layer-Rechner"
    },
    "toMakeCalculationsOfLayers": {
      "cat": "per fer càlculs de capes",
      "spa": "para hacer cálculos de capas",
      "eng": "to make calculations of layers",
      "fre": "pour réaliser de calculs des couches",
      "cze": "pro provádění výpočtů vrstev",
      "ger": "um Berechnungen von Layers durchzuführen"
    },
    "AnalyticalCombinationLayers": {
      "cat": "Combinació analítica de capes",
      "spa": "Combinación analítica de capas",
      "eng": "Analytical combination of layers",
      "fre": "Combinaison analytique de couches",
      "cze": "Kombinovat vrstvy",
      "ger": "Analytische Kombination von Layers"
    },
    "toCombineLayers": {
      "cat": "per combinar capes",
      "spa": "para combinar capas",
      "eng": "to combine layers",
      "fre": "pour correspondre des couches",
      "cze": "ke kombinaci vrstev",
      "ger": "zum Kombinieren von Layers"
    },
    "toReclassifyLayer": {
      "cat": "per reclassificar la capa",
      "spa": "para reclasificar la capa",
      "eng": "to reclassify the layer",
      "fre": "pour reclassifier de couche",
      "cze": "k překlasifikování vrstvy",
      "ger": "um den Layer neu zu klassifizieren"
    },
    "WriteValueInExpression": {
      "cat": "Escriu valor a la fórmula",
      "spa": "Escribe valor en fórmula",
      "eng": "Write value in expression",
      "fre": "Écrire une valeur dans l'expression",
      "cze": "Zápis hodnoty ve výrazu",
      "ger": "Wert in Ausdruck schreiben"
    },
    "RecommendedRangeOfValues": {
      "cat": "Interval de valors recomenats",
      "spa": "Intervalo de valores recomendados",
      "eng": "Recommended range of values",
      "fre": "Intervalle des valeurs recommandées",
      "cze": "Doporučený rozsah hodnot",
      "ger": "Empfohlener Wertebereich"
    },
    "anyValue": {
      "cat": "qualsevol valor",
      "spa": "cualquier valor",
      "eng": "any value",
      "fre": "toute valeur",
      "cze": "libovolná hodnota",
      "ger": "beliebiger Wert"
    },
    "constant": {
      "cat": "constant",
      "spa": "constante",
      "eng": "constant",
      "fre": "constant",
      "cze": "konstanta",
      "ger": "Konstante"
    },
    "selector": {
      "cat": "selector",
      "spa": "selector",
      "eng": "selector",
      "fre": "sélecteur",
      "cze": "selektor",
      "ger": "Selektor"
    },
    "SelectedInLayer": {
      "cat": "Valor seleccionat al desplegable de la llegenda",
      "spa": "Valor seleccionado en el desplegable de la leyenda",
      "eng": "Value selected in the legend dropdown",
      "fre": "Valeur choisie dans la légende sélectionnable",
      "cze": "Hodnota vybraná v rozevíracím seznamu legend",
      "ger": "Im Legenden-Dropdown ausgewählter Wert"
    },
    "byDefault": {
      "cat": "per defecte",
      "spa": "por defecto",
      "eng": "by default",
      "fre": "par défaut",
      "cze": "podle výchozího nastavení",
      "ger": "standardmäßig"
    },
    "OnlyShowValuesOfLayer": {
      "cat": "Mostra només els valors de la capa",
      "spa": "Muestra solo los valores de la capa",
      "eng": "Only show the values of the layer",
      "fre": "Afficher uniquement les valeurs de la couche",
      "cze": "Zobrazit pouze hodnoty vrstvy",
      "ger": "Nur die Werte des Layers anzeigen"
    },
    "ofTheStyle": {
      "cat": "de l'estil",
      "spa": "del estil",
      "eng": "of the style",
      "fre": "du style",
      "cze": "stylu",
      "ger": "des Stils"
    },
    "ofTheField": {
      "cat": "del camp",
      "spa": "del campo",
      "eng": "of the field",
      "fre": "du champ",
      "cze": "pole",
      "ger": "des Feldes"
    },
    "thatConformFollowingConditions": {
      "cat": "que complexien les condicions següents",
      "spa": "que cumplen las siguientes condiciones",
      "eng": "that conform the following conditions",
      "fre": "qui se conforment aux conditions suivantes",
      "cze": "které splňují následující podmínky",
      "ger": "die die folgenden Bedingungen erfüllen"
    },
    "NexusWithNextCondition": {
      "cat": "Nexe amb la següent condició",
      "spa": "Nexo con la siguiente condición",
      "eng": "Nexus with next condition",
      "fre": "Nexus avec la prochaine condition",
      "cze": "Nexus s další podmínkou",
      "ger": "Nexus mit nächster Bedingung"
    },
    "TheResultOfSelectionAddedAsNewStyleWithName": {
      "cat": "El resultat de la selecció serà afegit com a un estil nou de nom",
      "spa": "El resultado de la selección será añadido como un estilo nuevo de nombre",
      "eng": "The result of the selection will be added as a new style with name",
      "fre": "Le résultat de la sélection sera ajouté en tant que nouveau style avec le nom",
      "cze": "Výsledek výběru bude přidán jako nový styl s názvem",
      "ger": "Das Ergebnis der Auswahl wird als neuer Stil hinzugefügt mit dem Namen"
    },
    "ofQueryByAttributeSelectionByCondition": {
      "cat": "de selecció per condició",
      "spa": "de selección por condición",
      "eng": "of query by attribute selection by condition",
      "fre": " pour sélection par condition",
      "cze": "dotazu podle výběru atributů podle podmínky",
      "ger": "der Abfrage nach Attributauswahl nach Bedingung"
    },
    "ofRGBCombination": {
      "cat": "de combinació RGB",
      "spa": "de combinación RGB",
      "eng": "of RGB combination",
      "fre": "pour combinaison RVB",
      "cze": "kombinace RGB",
      "ger": "der RGB-Kombination"
    },
    "SelectThreeComponentsOfLayer": {
      "cat": "Sel·lecciona les 3 components de la capa",
      "spa": "Selecciona las 3 componentes de la capa",
      "eng": "Select the three components of the layer",
      "fre": "Sélectionnez les trois composants de la couche",
      "cze": "Výběr tří složek vrstvy",
      "ger": "Wählen Sie die drei Komponenten des Layers"
    },
    "Component": {
      "cat": "Component",
      "spa": "Componente",
      "eng": "Component",
      "fre": "Composant",
      "cze": "Složka",
      "ger": "Komponente"
    },
    "RGBCombinationAddedAsNewStyleWithName": {
      "cat": "La combinació RGB serà afegida com a un estil nou de nom",
      "spa": "La combinación RGB será añadida como un estilo nuevo de nombre",
      "eng": "The RGB combination will be added as a new style with name",
      "fre": "La combinaison RVB sera ajouté en tant que nouveau style avec le nom",
      "cze": "Kombinace RGB bude přidána jako nový styl s názvem",
      "ger": "Die RGB-Kombination wird als neuer Stil hinzugefügt mit Namen"
    },
    "SelectionStatisticValue": {
      "cat": "Selecció del valor estadístic",
      "spa": "Selección del valor estadístico",
      "eng": "Selection of statistic value",
      "fre": "Sélection de la valeur statistique",
      "cze": "Výběr statistické hodnoty",
      "ger": "Auswahl des statistischen Wertes"
    },
    "StatisticalValueToDisplayForLayer": {
      "cat": "Valor estadístic a mostrar per la capa",
      "spa": "Valor estadístico para mostrar para la capa",
      "eng": "Statistical value to display for the layer",
      "fre": "Valeur statistique à afficher pour la couche",
      "cze": "Statistická hodnota, která se má zobrazit pro vrstvu",
      "ger": "Statistischer Wert, der für den Layer angezeigt werden soll"
    },
    "StatisticalValueOf": {
      "cat": "Valor estadístic de",
      "spa": "Valor estadístico de",
      "eng": "Statistical value of",
      "fre": "Valeur statistique des",
      "cze": "Statistická hodnota",
      "ger": "Statistischer Wert von"
    },
    "Ascending": {
      "cat": "Ascendent",
      "spa": "Ascendiente",
      "eng": "Ascending",
      "fre": "Ascendant",
      "cze": "Vzestupně",
      "ger": "Aufsteigend"
    },
    "Descending": {
      "cat": "Descendent",
      "spa": "Descendiente",
      "eng": "Descending",
      "fre": "Descendant",
      "cze": "Sestupně",
      "ger": "Absteigend"
    },
    "CannotEditStyleNeverVisualized": {
      "cat": "No es pot editar un estil no visualitzat",
      "spa": "No es puede editar un estilo no visualizado",
      "eng": "You cannot edit a style never visualized",
      "fre": "Vous ne pouvez pas éditer un style jamais visualisé",
      "cze": "Styl, který nebyl nikdy vizualizován, nelze upravit",
      "ger": "Sie können einen nie visualisierten Stil nicht bearbeiten"
    },
    "StyleLayer": {
      "cat": "Estil de la capa",
      "spa": "Estilo de la capa",
      "eng": "Style of the layer",
      "fre": "Style de la couche",
      "cze": "Styl vrstvy",
      "ger": "Stil des Layers"
    },
    "ValueForStretchingColor": {
      "cat": "Valors per l'estirament de color",
      "spa": "Valores para el estiramiento de color",
      "eng": "Value for stretching of color",
      "fre": "Valeur pour l'étirement de la couleur",
      "cze": "Hodnota pro roztažení barvy",
      "ger": "Wert für die Dehnung der Farbe"
    },
    "computed": {
      "cat": "calculat",
      "spa": "calculado",
      "eng": "computed",
      "fre": "calculé",
      "cze": "vypočtená",
      "ger": "errechnet"
    },
    "Adopt": {
      "cat": "Adoptar",
      "spa": "Adoptar",
      "eng": "Adopt",
      "fre": "Adopter",
      "cze": "Přijmout",
      "ger": "Übernehmen"
    },
    "SunPositionForComputationIllumination": {
      "cat": "Posició del sol pel càlcul de la il·luminació",
      "spa": "Posició del sol para el cálculo de la iluminación",
      "eng": "Sun position for the computation of the illumination",
      "fre": "Position du soleil par le calcul de l'éclairement",
      "cze": "Poloha slunce pro výpočet osvětlení",
      "ger": "Sonnenposition für die Berechnung der Beleuchtungsstärke"
    },
    "Azimuth": {
      "cat": "Azimut",
      "spa": "Azimut",
      "eng": "Azimuth",
      "fre": "Azimut",
      "cze": "Azimut",
      "ger": "Azimut"
    },
    "originNorthClockwiseDegress": {
      "cat": "origen al nord i en sentit horari (en graus)",
      "spa": "origen en el norte y en el sentido de las agujas del reloj (en grados)",
      "eng": "origin north and clockwise (in degress)",
      "fre": "origine au nord et dans le sens des aiguilles d'une montre (en degrés)",
      "cze": "počátek na sever a po směru hodinových ručiček (ve stupních)",
      "ger": "Ursprung Nord-Nord und im Uhrzeigersinn (in Grad)"
    },
    "Elevation": {
      "cat": "Elevació",
      "spa": "Elevación",
      "eng": "Elevation",
      "fre": "Élévation",
      "cze": "Nadmořská výška",
      "ger": "Höhe"
    },
    "fromGroundDegress": {
      "cat": "des del terra (en graus)",
      "spa": "desde el suelo (en grados)",
      "eng": "from the ground (in degress)",
      "fre": "à partir du sol (en degrés)",
      "cze": "od země (ve stupních)",
      "ger": "über dem Boden (in Grad)"
    },
    "ReliefExaggerationFactor": {
      "cat": "Factor d'exageració del relleu",
      "spa": "Factor de exageración del relieve",
      "eng": "Relief exaggeration factor",
      "fre": "Facteur d'exagération du relief",
      "cze": "Faktor převýšení reliéfu",
      "ger": "Relief-Überhöhungsfaktor"
    },
    "Greyscale": {
      "cat": "Escala de grisos",
      "spa": "Escala de grises",
      "eng": "Greyscale",
      "fre": "Niveaux de gris",
      "cze": "Stupnice šedi",
      "ger": "Grauskala"
    },
    "IncorrectAzimuth": {
      "cat": "Azimut incorrecte. Hauria de ser un número entre 0 i 360. Aplicant el valor per defecte",
      "spa": "Azimut incorrecto. Debería ser un número entre 0 y 360. Aplicando el valor por defecto",
      "eng": "Incorrect azimuth. It should be a number between 0 and 360. Applying the default value",
      "fre": "Azimut incorrect. Il doit s'agir d'un nombre compris entre 0 et 360. Application de la valeur par défaut",
      "cze": "Nesprávný azimut. Mělo by to být číslo mezi 0 a 360. Použití výchozí hodnoty",
      "ger": "Falscher Azimut. Es sollte eine Zahl zwischen 0 und 360 sein. Anwenden des Standardwerts"
    },
    "IncorrectElevation": {
      "cat": "Elevació incorrecta. Hauria de ser un número entre 0 i 90. Aplicant el valor per defecte",
      "spa": "Elevación incorrecta. Debería ser un número entre 0 y 90. Aplicando el valor por defecto",
      "eng": "Incorrect elevation. It should be a number between 0 and 90. Applying the default value",
      "fre": "Élévation incorrect. Il doit s'agir d'un nombre compris entre 0 et 90. Application de la valeur par défaut",
      "cze": "Nesprávná nadmořská výška. Mělo by to být číslo mezi 0 a 90. Použití výchozí hodnoty",
      "ger": "Falsche Höhe. Es sollte eine Zahl zwischen 0 und 90 sein. Anwenden des Standardwerts"
    },
    "IncorrectReliefExaggerationFactor": {
      "cat": "Factor d'exageració del relleu incorrecte. Hauria de ser un número major de 0.0001. Aplicant el valor per defecte",
      "spa": "Factor de exageración del relieve incorrecta. Debería ser un número mayor que 0.0001. Aplicando el valor por defecto",
      "eng": "Incorrect relief exaggeration factor. It should be a number bigger than 0.0001. Applying the default value",
      "fre": "Facteur d'exagération du relief incorrect. Il doit s'agir d'un nombre supérieur à 0.0001. Application de la valeur par défaut",
      "cze": "Nesprávný faktor převýšení reliéfu. Mělo by to být číslo větší než 0.0001. Použití výchozí hodnoty",
      "ger": "Falscher Reliefüberhöhungsfaktor. Es sollte eine Zahl größer als 0,0001 sein. Anwenden des Standardwerts"
    },
    "ofModifingName": {
      "cat": "de modificar el nom",
      "spa": "de modificar el nombre",
      "eng": "of modifing the name",
      "fre": "pour modifier le nom",
      "cze": "o úpravě názvu",
      "ger": "zum Ändern des Namens"
    },
    "LayerNameInLegend": {
      "cat": "Nom de la capa a la llegenda",
      "spa": "Nombre de la capa en la leyenda",
      "eng": "Name of the layer in the legend",
      "fre": "Nom de la couche dans la légende",
      "cze": "Název vrstvy v legendě",
      "ger": "Name des Layers in der Legende"
    },
    "forShowingLinageInformation": {
      "cat": "de mostrar la informació del llinatge",
      "spa": "de mostrar la información del linaje",
      "eng": "for showing the linage information",
      "fre": "pour afficher les informations de lignage",
      "cze": "pro zobrazení informací o linii",
      "ger": "für die Anzeige der Linieninformation"
    },
    "forShowingQualityInformation": {
      "cat": "de mostrar la informació de qualitat",
      "spa": "de mostrar la información de calidad",
      "eng": "for showing the quality information",
      "fre": "pour afficher l'information de qualité",
      "cze": "pro zobrazení informací o kvalitě",
      "ger": "für die Anzeige der Qualitätsinformationen"
    },
    "ofUserFeedback": {
      "cat": "de valoracions dels usuaris",
      "spa": "de valoraciones de los usuarios",
      "eng": "of user feedback",
      "fre": "pour la rétroaction de l'utilisateur",
      "cze": "zpětné vazby od uživatele",
      "ger": "des Benutzerfeedbacks"
    },
    "_withStatisticOf_": {
      "cat": " amb estadistics de ",
      "spa": " con estadísticos de ",
      "eng": " with statistic of ",
      "fre": " avec statistiques des ",
      "cze": " se statistikou",
      "ger": " mit der Statistik von"
    },
    "StatisticalDescriptorDisplayNeedSelected": {
      "cat": "Cal sel·leccionar el descriptor estadístic a mostrar per la capa",
      "spa": "Debe seleccionar el descriptor estadístico para mostrar para la capa",
      "eng": "The statistical descriptor to display for the layer needs to be selected",
      "fre": "Le descripteur statistique à afficher pour la couche doit être sélectionné",
      "cze": "Je třeba vybrat statistický deskriptor, který se má pro vrstvu zobrazit",
      "ger": "Der statistische Deskriptor, der für den Layer angezeigt werden soll, muss ausgewählt werden"
    },
    "ThicknessRange": {
      "cat": "Gruix limitat a un rang de 1 a 10px",
      "spa": "Grosor limitado a un rango de 1 a 10px",
      "eng": "Thickness limited to a range of 1 to 10px",
      "fre": "Épaisseur limitée à une gamme de 1 à 10px",
      "cze": "Tloušťka omezená na rozsah 1 až 10px",
      "ger": "Breite auf einen Bereich von 1 bis 10 Pixel begrenzt"
    },
    "ShowLikeTable": {
      "cat": "Mostrar com a taula",
      "spa": "Mostrar como tabla",
      "eng": "Show as table",
      "fre": "Afficher sous forme de tableau",
      "cze": "Zobrazit jako tabulku",
      "ger": "Als Tabelle anzeigen"
    },
    "PercentageTransparencyRange": {
      "cat": "Percentatge de transparència limitada a valors 0% (opac) i 100% (transparent)",
      "spa": "Porcentage de transparencia limitada a valores 0% (opaco) y 100% (transparente)",
      "eng": "Percentage of transparency limited to values 0% (opaque) to 100% (transparent)",
      "fre": "Pourcentage de transparence limité aux valeurs 0% (opaque) à 100% (transparent)",
      "cze": "Procento průhlednosti omezené na hodnoty 0 % (neprůhledné) až 100 % (průhledné)",
      "ger": "Transparenzanteil im Bereich von 0% (undurchsichtig) bis 100% (transparent)"
    },
	"ViewItemsInScope": {
      "cat": "Veure només objectes dins de l'àmbit",
      "spa": "Ver solo objectes dentro del ámbito",
      "eng": "View only features within the scope",
      "fre": "Ne voir que les objets dans le périmètre",
      "cze": "Zobrazit pouze funkce v rozsahu",
      "ger": "Nur Features innerhalb des Bereichs anzeigen"
    },
	"ShowGeometry": {
      "cat": "Mostrar geometria",
      "spa": "Mostrar geometría",
      "eng": "Show geometry",
      "fre": "Montrer la géométrie",
      "cze": "Zobrazit geometrii",
      "ger": "Geometrie anzeigen"
    },
	"Geometry": {
      "cat": "Geometria",
      "spa": "Geometría",
      "eng": "Geometry",
      "fre": "Géoméxtrie",
      "cze": "Geometrie",
      "ger": "Geometrie"
   },
   "ExportObject": {
     "cat": "Seleccionar l'objecte",
     "spa": "Seleccionar el objecto",
     "eng": "Select the object",
     "fre": "Sélectionnez l'objet",
      "cze": "Vyberte objekt",
      "ger": "Wähle das Objekt aus"
   },
   "ExportObjects": {
     "cat": "Guardar seleccionats com GeoJSON",
     "spa": "Guardar seleccionados como GeoJSON",
     "eng": "Save selected as GeoJSON",
     "fre": "Enregistrer la sélection sous GeoJSON",
     "cze": "Uložit vybrané jako GeoJSON",
     "ger": "Die Auswahl als GeoJSON speichern"
   },
	"VectorLayerValuesCopiedClipboardFormat": {
      "cat": "Els valors de la capa vectorial han estat copiats al portaretalls en format",
      "spa": "Los valores de la capa vectorial han sido copiados al portapapeles en formato",
      "eng": "The values of the vector layer have been copied to clipboard in the format",
      "fre": "Les valeurs de la couche vectorielle ont été copiées dans le presse-papiers au format",
      "cze": "Hodnoty vektorové vrstvy byly zkopírovány do schránky ve formátu",
      "ger": "Die Werte des Vektorlayers wurden in die Zwischenablage im Format kopiert"
    },
  "exportedVectorObjects": {
    "cat": "objectes_vectorials_exportats_",
    "spa": "objetos_vectoriales_exportados",
    "eng": "exported_vector_objects_",
    "fre": "objets_vectoriels_exportes_",
      "cze": "exportovane_vektorové_objekty_",
      "ger": "exportierte_Vektorobjeckte_"
    },
    "NoAttributesToDisplayForLayer": {
      "cat": "No hi han atributs per a mostrar d'aquesta capa",
      "spa": "No hay atributos para mostrar de esta capa",
      "eng": "There are no attributes to display for this layer",
      "fre": "Il n'y a pas d'attributs à afficher pour cette couche",
      "cze": "Pro tuto vrstvu nejsou zobrazeny žádné atributy",
      "ger": "Für diesen Layer sind keine Atributte verfügbar"
    },
    "NoObjectSelectedExport": {
      "cat": "No s'ha seleccionat cap objecte per exportar",
      "spa": "No se ha seleccionado ningún objeto para exportar",
      "eng": "No features has been selected for export",
      "fre": "Aucun objet n'a été sélectionné pour l'exportation",
      "cze": "Pro export nebyl vybrán žádný objekt",
      "ger": "Es wurde kein Objekt zum Exportieren ausgewählt"
    },
    "NoObjectsToDisplay": {
      "cat": "No hi han objectes d'aquesta capa per mostrar",
      "spa": "No hay objectos de esta capa para mostrar",
      "eng": "There are no features of this layer to display",
      "fre": "Il n'y a pas d'objets de cette couche à afficher",
      "cze": "Neexistují žádné objekty této vrstvy, které by bylo možné zobrazit",
      "ger": "Es sind keine Objekte dieses Layers zum Anzeigen vorhanden"
    },
    "NoObjectsToDisplayWithinRange": {
      "cat": "No hi han objectes d'aquesta capa dins l'àmbit de vista actual",
      "spa": "No hay objectos de esta capa dentro de l'ámbito vista actual",
      "eng": "There are no feautures of this layer within the current view range",
      "fre": "Il n'y a pas d'objets de cette couche dans le champ de vision actuel",
      "cze": "V aktuálním rozsahu zobrazení nejsou žádné objekty této vrstvy",
      "ger": "Innerhalb des aktuellen Sichtbereiches sind keine Objekte dieses Layers zum Anzeigen vorhanden"
    }
  },
  "storymap": {
    "Storymaps": {
      "cat": "Relats amb mapes",
      "spa": "Relatos con mapas",
      "eng": "Storymaps",
      "fre": "Carte de l'histoire",
      "cze": "Příběhové mapy",
      "ger": "Storymaps"
    },
    "SelectStory": {
      "cat": "Selecciona un relat",
      "spa": "Selecciona un relato",
      "eng": "Select a story",
      "fre": "Sélectionnez une histoire",
      "cze": "Výběr příběhu",
      "ger": "Wählen Sie einen Beitrag"
    },
    "NoStoryInThisArea": {
      "cat": "No hi ha cap relat associat a aquesta zona",
      "spa": "No hay ningún relato asociado a esta zona",
      "eng": "There are no storymap associated with this area",
      "fre": "Il n'y a pas d'histoires associées à cette zone",
      "cze": "K této oblasti nejsou přiřazeny žádné příběhy",
      "ger": "Diesem Bereich sind keine Beiträge zugeordnet"
    },
    "ParameterValueFoundIs": {
      "cat": "El valor del paràmetre indicat és",
      "spa": "El valor del parámetro indicado es",
      "eng": "The parameter value found is",
      "fre": "La valeur de paramètre trouvée est",
      "cze": "Nalezená hodnota parametru je",
      "ger": "Der gefundene Parameterwert ist"
    },
    "ActionOnMap": {
      "cat": "Acció sobre el mapa",
      "spa": "Acción sobre el mapa",
      "eng": "Action on the map",
      "fre": "Agir sur la carte",
      "cze": "Akce na mapě",
      "ger": "Aktion auf der Karte"
    },
    "NewStorymap": {
      "cat": "Nou relat amb mapes",
      "spa": "Nuevo relato con mapas",
      "eng": "New storymaps",
      "fre": "Nouvelle carte de l'histoire",
      "cze": "Nové příběhové mapy",
      "ger": "Neue Storymaps"
    },
	"StorymapThumbnailImage": {
      "cat": "Imatge en miniatura del relat",
      "spa": "Imagen en miniatura del relato",
      "eng": "Storymap thumbnail image",
      "fre": "Image miniature de la carte de l'histoire",
      "cze": "Obrázek miniatury mapy příběhu",
      "ger": "Miniaturansicht der Storymap"
    },
	"SelectImage": {
	  "cat": "Seleccionar imatge",
      "spa": "Seleccionar imagen",
      "eng": "Select image",
      "fre": "Sélectionner une image",
      "cze": "Vyberte obrázek",
      "ger": "Bild auswählen"
	},
    "AttachImage": {
      "cat": "Adjuntar imatge",
      "spa": "Adjuntar imagen",
      "eng": "Attach image",
      "fre": "Joindre une image",
      "cze": "Připojit obrázek",
      "ger": "Bild anhängen"
    },
    "OpensImageFilesSelector": {
      "cat": "Obre selector de fitxers d'imatge",
      "spa": "Abre selector de ficheros de imagen",
      "eng": "Opens image files selector",
      "fre": "Ouvre le sélecteur de fichiers image",
      "cze": "Otevře výběr obrazových souborů",
      "ger": "Öffnet den Selektor für Bilddateien"
    },
    "SyncWithMap": {
      "cat": "Sincronitzar amb al mapa",
      "spa": "Sincronizar con el mapa",
      "eng": "Sync with the map",
      "fre": "Synchroniser avec la carte",
      "cze": "Synchronizace s mapou",
      "ger": "Sync mit der Karte"
    },
    "SavesMapCharacteristics":{
      "cat": "Guarda les característiques actuals del mapa (longitud, latitud, zoom...) per un fragment concret del relat",
      "spa": "Guarda las características actuales del mapa (longitud, latitud, zoom...) para un fragmento concreto del relato",
      "eng": "Saves the current features of the map (length, latitude, zoom...) for a concrete fragment of the story",
      "fre": "Enregistrer les caractéristiques actuelles de la carte (longueur, latitude, zoom...) pour un fragment concret de l'histoire",
      "cze": "Ukládá aktuální vlastnosti mapy (délka, šířka, zoom...) pro konkrétní fragment příběhu",
      "ger": "Speichert die aktuellen Features der Karte (Länge, Breite, Zoom...) für ein konkretes Fragment der Geschichte"
    },
    "OriginalMeasurementsImage": {
      "cat": "Mides originals de la imatge",
      "spa": "Medidas originales de la imagen",
      "eng": "Original measurements of the image",
      "fre": "Mesures originales de l'image",
      "cze": "Původní měření obrazu",
      "ger": "Originalmessungen des Bildes"
    },
    "pxWidth": {
      "cat": "px amplada",
      "spa": "px anchura",
      "eng": "px width",
      "fre": "px largeur",
      "cze": "px šířka",
      "ger": "px Breite"
    },
    "pxHeight": {
      "cat": "px alçada",
      "spa": "px altura",
      "eng": "px height",
      "fre": "px hauteur",
      "cze": "px výška",
      "ger": "px Höhe"
    },
    "ReducedWidth": {
      "cat": "Amplada reduida",
      "spa": "Anchura reducida",
      "eng": "Reduced width",
      "fre": "Largeur réduite",
      "cze": "Zmenšená šířka",
      "ger": "Reduzierte Breite"
    },
    "ReducedHeight": {
      "cat": "Alçada reduïda",
      "spa": "Altura reducida",
      "eng": "Reduced height",
      "fre": "Hauteur réduite",
      "cze": "Zmenšená výška",
      "ger": "Reduzierte Höhe"
    },
    "ChooseUnitMeasurement": {
      "cat": "Escull la unitat de mesura",
      "spa": "Escoge la unidad de medida",
      "eng": "Choose the unit of measurement",
      "fre": "Choisir l'unité de mesure",
      "cze": "Výběr měrné jednotky",
      "ger": "Wählen Sie die Maßeinheit"
    },
    "MaintainProportionality": {
      "cat": "Mantenir proporcionalitat",
      "spa": "Mantener proporcionalidad",
      "eng": "Maintain proportionality",
      "fre": "Maintenir la proportionnalité",
      "cze": "Zachování proporcionality",
      "ger": "Wahrung der Verhältnismäßigkeit"
    },
    "SelectMapFeatures": {
      "cat": "Selecciona les característiques del mapa per a aquest punt del relat",
      "spa": "Selecciona las características del mapa para este punto del relato",
      "eng": "Select the map features for this point in the story",
      "fre": "Sélectionnez les caractéristiques cartographiques pour ce point de l'histoire",
      "cze": "Vyberte prvky mapy pro tento bod příběhu",
      "ger": "Wählen Sie die Kartenfunktionen für diesen Punkt in der Story aus"
    },
    "Zoom": {
      "cat": "Zoom",
      "spa": "Zoom",
      "eng": "Zoom",
      "fre": "Zoom",
      "cze": "Přiblížení",
      "ger": "Zoom"
    },
    "Styles": {
      "cat": "Estils",
      "spa": "Estilos",
      "eng": "Styles",
      "fre": "Styles",
      "cze": "Styly",
      "ger": "Stile"
    },
    "ErrorReadingImages": {
      "cat": "Error carregant la imatge",
      "spa": "Error cargando la imagen",
      "eng": "Error loading image",
      "fre": "Erreur de chargement de l'image",
      "cze": "Chyba při načítání obrázku",
      "ger": "Fehler beim Laden eines Bildes"
    },
    "Layers&Styles": {
      "cat": "Capes i estils",
      "spa": "Capas y estilos",
      "eng": "Layers and styles",
      "fre": "Couches et styles",
      "cze": "Vrstvy a styly",
      "ger": "Layers und Stile"
    },
    "Position&Zoom": {
      "cat": "Posició i zoom",
      "spa": "Posición y zoom",
      "eng": "Position and zoom",
      "fre": "Position et zoom",
      "cze": "Poloha a přiblížení",
      "ger": "Position und Zoom"
    },
    "TitleStoryMandatory": {
      "cat": "És obligatori especificar un títol per al relat",
      "spa": "Es obligatorio especificar un título para el relato",
      "eng": "It is mandatory to specify a title for the story",
      "fre": "Il est obligatoire de donner un titre à cette histoire",
      "cze": "Je nutné uvést název příběhu",
      "ger": "Es ist obligatorisch, einen Titel für die Geschichte anzugeben"
    },
    "ShareStorymap": {
      "cat": "Compartir relat",
      "spa": "Compartir relato",
      "eng": "Share storymap",
      "fre": "Partager histoire",
      "cze": "Sdílet mapu příběhu",
      "ger": "Storymap teilen"
    },
    "RetrieveStorymap": {
      "cat": "Recuperar relats",
      "spa": "Recuperar relatos",
      "eng": "Retrieve storymaps",
      "fre": "Récupérer des histoires",
      "cze": "Získat data příběhů",
      "ger": "Storymaps abrufen"
    },
    "StorymapCannotImported": {
      "cat": "No es pot importar el relat",
      "spa": "No se puede importar el relato",
      "eng": "The storymap cannot be imported",
      "fre": "L'histoire ne peut pas être importé",
      "cze": "Storymap nelze importovat",
      "ger": "Der Storymap kann nicht importiert werden"
    },
  },
  "tresD": {
    "Graphic_3D": {
      "cat": "Gràfic 3D",
      "spa": "Gráfico 3D",
      "eng": "3D Graphic",
      "fre": "Diagramme 3D",
      "cze": "3D grafika",
      "ger": "3D-Grafik"
    },
    "VerticalScale": {
      "cat": "Escala vertical",
      "spa": "Escala vertical",
      "eng": "Vertical scale",
      "fre": "Échelle verticale",
      "cze": "Vertikální měřítko",
      "ger": "Vertikaler Maßstab"
    }
  },
  "canviprj": {
    "LongLatConversionNotImplementedforRefSys": {
      "cat": "Pas a longitud/latitud no implementat per aquest sistema de referència",
      "spa": "Paso a longitud/latitud no implementado para este sistema de referencia",
      "eng": "Longitude/latitude conversion has not been implemented for this reference system",
      "fre": "Conversion à longitude/latitude pas implémenté pour ce système de référence",
      "cze": "Převod zeměpisné délky a šířky nebyl pro tento referenční systém implementován",
      "ger": "Die Umrechnung von Längen- und Breitengraden wurde für dieses Bezugssystem nicht implementiert."
    },
    "MapCoordConversionNotImplementedInRefSys": {
      "cat": "Pas a coordenades mapa no implementat per aquest sistema de referència",
      "spa": "Paso a coordenades mapa no implementado para este sistema de referencia",
      "eng": "Map coordinates conversion has not been implemented for this reference system",
      "fre": "Conversion à coordonnées de la carte pas implémenté pour ce système de référence",
      "cze": "Převod mapových souřadnic nebyl pro tento referenční systém implementován",
      "ger": "Die Umrechnung von Kartenkoordinaten wurde für dieses Bezugssystem nicht implementiert"
    },
    "LambertConformalConicZoneIII_NTF": {
      "cat": "Lambert Cònica Conforme Zona III - NTF",
      "spa": "Lambert Cónica Conforme Zona III - NTF",
      "eng": "Lambert Conformal Conic Zone III - NTF",
      "fre": "Lambert Conique Conforme Zone III – NTF",
      "cze": "Lambert Conformal Conic Zone III - NTF",
      "ger": "Lambert Conformal Conic Zone III - NTF"
    },
    "LambertConformalConicZoneIIext_NTF": {
      "cat": "Lambert Cònica Conforme Zona IIext - NTF",
      "spa": "Lambert Cónica Conforme Zona IIext - NTF",
      "eng": "Lambert Conformal Conic Zone IIext - NTF",
      "fre": "Lambert Conique Conforme Zone IIext – NTF",
      "cze": "Lambert Conformal Conic Zone IIext - NTF",
      "ger": "Lambert Conformal Conic Zone IIext - NTF"
    },
    "LambertConformalConicZoneIIIext_NTF": {
      "cat": "Lambert Cònica Conforme Zona IIIext - NTF",
      "spa": "Lambert Cónica Conforme Zona IIIext - NTF",
      "eng": "Lambert Conformal Conic Zone IIIext - NTF",
      "fre": "Lambert Conique Conforme Zone IIIext – NTF",
      "cze": "Lambert Conformal Conic Zone IIIext - NTF",
      "ger": "Lambert Conformal Conic Zone IIIext - NTF"
    },
    "LambertConformalConicICCMediterranianRegion": {
      "cat": "Lambert Cònica Conforme ICC Regió Mediterrània",
      "spa": "Lambert Cónica Conforme ICC Región Mediterránea",
      "eng": "Lambert Conformal Conic ICC Mediterranian Region",
      "fre": "Lambert Conique Conforme ICC Région Méditerranéenne",
      "cze": "Lambert Conformal Conic ICC Mediteránní oblast",
      "ger": "Lambert Conformal Conic ICC Mediterranian Region"
    },
    "MercatorParallel_41d25m_ED50": {
      "cat": "Mercator paral·lel 41° 25' - ED50",
      "spa": "Mercator paralelo 41° 25' - ED50",
      "eng": "Mercator parallel 41° 25' - ED50",
      "fre": "Mercator parallèle 41° 25' - ED50",
      "cze": "Mercator parallel 41° 25' - ED50",
      "ger": "Mercator parallel 41° 25' - ED50"
    },
    "MercatorParallel_41d25m_WGS84": {
      "cat": "Mercator paral·lel 41° 25' - WGS84",
      "spa": "Mercator paralelo 41° 25' - WGS84",
      "eng": "Mercator parallel 41° 25' - WGS84",
      "fre": "Mercator parallèle 41° 25' - WGS84",
      "cze": "Mercator parallel 41° 25' - WGS84",
      "ger": "Mercator parallel 41° 25' - WGS84"
    },
    "MercatorParallel_40d36m_ED50": {
      "cat": "Mercator paral·lel 40° 36' - ED50",
      "spa": "Mercator paralelo 40° 36' - ED50",
      "eng": "Mercator parallel 40° 36' - ED50",
      "fre": "Mercator parallèle 40° 36' – ED50",
      "cze": "Mercator parallel 40° 36' - ED50",
      "ger": "Mercator parallel 40° 36' – ED50"
    },
    "MercatorParallelEquator_ED50": {
      "cat": "Mercator paral·lel Equador - ED50",
      "spa": "Mercator paralelo Ecuador - ED50",
      "eng": "Mercator parallel Equator - ED50",
      "fre": "Mercator parallèle Equateur – ED50",
      "cze": "Mercator parallel Equator - ED50",
      "ger": "Mercator parallel Equator - ED50"
    },
    "MercatorParallelEquator_WGS84": {
      "cat": "Mercator paral·lel Equador - WGS84",
      "spa": "Mercator paralelo Ecuador - WGS84",
      "eng": "Mercator parallel Equator - WGS84",
      "fre": "Mercator parallèle Equateur - WGS84",
      "cze": "Mercator parallel Equator - WGS84",
      "ger": "Mercator parallel Equator - WGS84"
    },
    "WebMercator": {
      "cat": "Web Mercator",
      "spa": "Web Mercator",
      "eng": "Web Mercator",
      "fre": "Web Mercator",
      "cze": "Web Mercator",
      "ger": "Web Mercator"
    }
  },
  "vista":{
    "WrongDefinedArea":{
      "cat": "Les coordenades introduïdes no defineixen una àrea",
      "spa": "Las coordenadas introducidas no definen un área",
      "eng": "Selected coordinates doesn't define an area",
      "fre": "Les coordonnées entrées ne définissent pas une zone",
      "cze": "Zadané souřadnice nedefinují oblast",
      "ger": "Die eingegebenen Koordinaten definieren kein Gebiet"
    }
  },
  "capavola": {
    "Proj": {
      "cat": "Proj",
      "spa": "Proy",
      "eng": "Proj",
      "fre": "Proj",
      "cze": "Proj",
      "ger": "Proj"
    },
    "DeviceLocation": {
      "cat": "Ubicació dispositiu",
      "spa": "Ubicación dispositivo",
      "eng": "Device location",
      "fre": "Emplacement de l'appareil",
      "cze": "Umístění zařízení",
      "ger": "Standort des Geräts"
    },
    "AroundZone": {
      "cat": "Zona al voltant",
      "spa": "Zona alrededor",
      "eng": "Around zone",
      "fre": "Zone autour",
      "cze": "Okolí zóny",
      "ger": "Um die Zone herum"
    },
    "GoTo": {
      "cat": "Anar-hi",
      "spa": "Ir",
      "eng": "Go to",
      "fre": "Aller à",
      "cze": "Přejít na",
      "ger": "Gehe zu"
    },
    "ofGoToCoordinate": {
      "cat": "d'anar a coordenada",
      "spa": "de ir a coordenada",
      "eng": "of go-to coordinate",
      "fre": "pour aller à la coordonnée",
      "cze": "souřadnice go-to",
      "ger": "der Go-to-Koordinate"
    },
    "RequestedPointOutsideBrowserEnvelope": {
      "cat": "El punt sol·licitat està fora de l'àmbit de navegació",
      "spa": "El punto solicitado está fuera del ámbito de navegación",
      "eng": "The requested point is outside browser envelope",
      "fre": "Le point requis se trouve dehors le milieu de navigation",
      "cze": "Požadovaný bod je mimo obálku prohlížeče",
      "ger": "Der angeforderte Punkt liegt außerhalb der Browser-Hülle"
    },
    "toInsertNewPoints": {
      "cat": "per inserir punts nous",
      "spa": "para insertar puntos nuevos",
      "eng": "to insert new points",
      "fre": "pour insérer de nouveaux points",
      "cze": "pro vložení nových bodů",
      "ger": "um neue Punkte einzufügen"
    },
    "UserDeniedRequestGeolocation": {
      "cat": "L'usuari ha denegat la sol·licitud de geolocalització",
      "spa": "El usuario ha denegado la solicitud de geolocalización",
      "eng": "User denied the request for geolocation",
      "fre": "L'utilisateur a refusé la demande de géolocalisation",
      "cze": "Uživatel odmítl požadavek na geolokaci",
      "ger": "Der Benutzer hat die Anfrage nach Geolokalisierung abgelehnt"
    },
    "LocationInfoUnavailable": {
      "cat": "La informació sobre la ubicació no està disponible",
      "spa": "La información sobre la ubicación no está disponible",
      "eng": "Location information is unavailable",
      "fre": "Les informations de localisation ne sont pas disponibles",
      "cze": "Informace o poloze nejsou k dispozici",
      "ger": "Die Standortinformationen sind nicht verfügbar"
    },
    "RequestGetUserLocationTimedOut": {
      "cat": "S'ha esgotat el temps d'espera de la sol·licitud per obtenir la ubicació de l'usuari",
      "spa": "Se ha agotado el tiempo de espera de la solicitud para obtener la ubicación del usuario",
      "eng": "Request to get user location timed out",
      "fre": "La demande d'obtention de l'emplacement de l'utilisateur a expiré",
      "cze": "Požadavek na získání polohy uživatele vypršel",
      "ger": "Die Anforderung, den Standort des Benutzers abzurufen, wurde abgebrochen"
    },
    "UnknownErrorObtainingLocation": {
      "cat": "S'ha produït un error desconegut durant l'obtenció de la ubicació",
      "spa": "Se ha producido un error desconocido durante la obtención de la geolocalización",
      "eng": "An unknown error occurred while obtaining the location",
      "fre": "Une erreur inconnue s'est survenue lors de l'obtention de l'emplacement",
      "cze": "Při získávání umístění došlo k neznámé chybě",
      "ger": "Ein unbekannter Fehler ist beim Abrufen des Standorts aufgetreten"
    },
    "CoordIncorrectFormat": {
      "cat": "Format de les coordenades erroni",
      "spa": "Formato de las coordenadas erróneo",
      "eng": "Coordinate format is incorrect",
      "fre": "Format des coordonnées erroné",
      "cze": "Formát souřadnic je nesprávný",
      "ger": "Das Koordinatenformat ist falsch"
    },
    "NumericalValueMustBeIndicated": {
      "cat": "S'ha d'indicar un valor numèric",
      "spa": "Se debe indicar un valor numérico",
      "eng": "A numerical value must be indicated",
      "fre": "Vous devez indiquer une valeur numérique",
      "cze": "Musí být uvedena číselná hodnota",
      "ger": "Es muss ein numerischer Wert angegeben werden"
    },
    "GeolocationNotSupportedByBrowser": {
      "cat": "La geolocalització no està suportada en aquest navegador",
      "spa": "La geolocalización no está soportada en este navegador",
      "eng": "Geolocation is not supported by this browser",
      "fre": "La géolocalisation n'est pas prise en charge dans ce navigateur",
      "cze": "Geolokace není tímto prohlížečem podporována",
      "ger": "Die Geolokalisierung wird von diesem Browser nicht unterstützt"
    },
    "ofUserFeedbackScope": {
      "cat": "de valoració d'una àrea específica",
      "spa": "de valoración de un área específica",
      "eng": "of a feedback for a specific area",
      "fre": "pour la rétroaction d'un domaine spécifique",
      "cze": "posouzení konkrétní oblasti",
      "ger": "einen bestimmten Bereichs"
    },
    "CheckNDecimalFigures": {
      "cat": "El nombre de decimals configurat per l'usuari no és suficient per definir l'àmbit correctament. Modifica aquest paràmetre al menú Opcions --> N. decimals",
      "spa": "El número de decimales configurado por el usuario no es suficiente para definir el ámbito correctamente. Modifica este parámetro en el menú Opciones --> N. decimales",
      "eng": "The number of decimal figures defined by the user is not enougth to correctly define the bounding box. Modify this parameter in Options --> N. of decimal figures",
      "fre": "Le nombre de décimales configuré par l'utilisateur n'est pas suffisant pour définir correctement la zone de délimitation. Modifiez ce paramètre dans le menu Options --> N. décimales",
      "cze": "Počet desetinných míst nakonfigurovaný uživatelem nestačí ke správné definici rozsahu. Upravte tento parametr v nabídce Možnosti --> Počet desetinných míst",
      "ger": "Die vom Benutzer konfigurierte Anzahl der Dezimalstellen reicht nicht aus, um den Bereich korrekt zu definieren. Ändern Sie diesen Parameter im Menü Optionen --> N. Dezimalstellen"
    },
    "MissingCoordinates": {
      "cat": "Falten coordenades",
      "spa": "Faltan coordenadas",
      "eng": "Coordinates missing",
      "fre": "Coordonnées manquantes",
      "cze": "Chybějící souřadnice",
      "ger": "Fehlende Koordinaten"
    },
    "ScopeUseMouse": {
      "cat": "Usa el ratolí per marcar",
      "spa": "Usa el ratón para marcar",
      "eng": "Use the mouse to select",
      "fre": "Utiliser la souris pour sélectionner",
      "cze": "Použijte myš k výběru",
      "ger": "Benutzen Sie die Maus zum Auswählen"
    },
    "ScopeTypeArea": {
      "cat": "una àrea",
      "spa": "un área",
      "eng": "an area",
      "fre": "une zone",
      "cze": "oblast",
      "ger": "ein Gebiet"
    },
    "ScopeTypePoint": {
      "cat": "un punt",
      "spa": "un punto",
      "eng": "a point",
      "fre": "un point",
      "cze": "bod",
      "ger": "ein Punkt"
    }
  },
  "commands": {
    "ZoomSizeIncorrectFormat": {
      "cat": "Format del valor del costat de zoom erroni",
      "spa": "Formato del lado de zoom erróneo",
      "eng": "Zoom size format is incorrect",
      "fre": "Format des zoom erroné",
      "cze": "Formát velikosti zoomu je nesprávný",
      "ger": "Das Format der Zoomgröße ist nicht korrekt."
    },
    "NumericalValueIsRequired": {
      "cat": "S'ha d'indicar un valor numèric",
      "spa": "Se debe indicar un valor numérico",
      "eng": "A numerical value is required",
      "fre": "Vous devez indiquer une valeur numérique",
      "cze": "Je vyžadována číselná hodnota",
      "ger": "Ein numerischer Wert ist erforderlich"
    },
    "ZoomSizeNotAvailableBrowser": {
      "cat": "El costat de zoom sol·licitat no és un dels costats disponibles en aquest navegador",
      "spa": "El lado de zoom solicitado no es uno de los lados disponibles en este navegador",
      "eng": "The requested zoom size is not available in this browser",
      "fre": "La taille de zoom demandée n'est pas disponible dans ce navigateur",
      "cze": "Požadovaná velikost zvětšení není v tomto prohlížeči k dispozici",
      "ger": "Die angeforderte Zoom-Größe ist in diesem Browser nicht verfügbar."
    },
    "CRSNotAvailableBrowser": {
      "cat": "El CRS sol·licitat no te un mapa de situació associat en aquest navegador i no està disponible",
      "spa": "El CRS solicitado no tiene un mapa de situación asociado i no está disponibles en este navegador",
      "eng": "The requested CRS has no situation map associated and it is not available in this browser",
      "fre": "Le CRS demandé n'a pas de carte de situation associée et n'est pas disponible dans ce navigateur",
      "cze": "Požadovaný počítačový rezervační systém nemá přiřazenou mapu situace a v tomto prohlížeči není k dispozici",
      "ger": "Dem angeforderten CRS ist keine Lagekarte zugeordnet und er ist in diesem Browser nicht verfügbar."
    },
    "CoordIncorrectFormat": {
      "cat": "Format de les coordenades erroni",
      "spa": "Formato de las coordenadas erróneo",
      "eng": "Coordinate format is incorrect",
      "fre": "Format des coordonnées erroné",
      "cze": "Formát souřadnic je nesprávný",
      "ger": "Das Koordinatenformat ist nicht korrekt"
    },
    "TwoNumericalValuesRequiredFormat": {
      "cat": "S'ha d'indicar dos valors numèrics en el format",
      "spa": "Se debe indicar dos valores numéricos en el formato",
      "eng": "Two numerical values are required with the format",
      "fre": "Deux valeurs numériques sont requises dans le format",
      "cze": "Ve formátu jsou vyžadovány dvě číselné hodnoty",
      "ger": "Zwei numerische Werte sind für das Format erforderlich."
    },
    "SelectionsIncorrectFormat": {
      "cat": "Format de les consultes erroni",
      "spa": "Formato de las consultas erróneo",
      "eng": "Query format is incorrect",
      "fre": "Format des requete erroné",
      "cze": "Formát dotazu je nesprávný",
      "ger": "Das Abfrageformat ist nicht korrekt"
    },
    "HistogramsIncorrectFormat": {
      "cat": "Format dels histogrames erroni",
      "spa": "Formato de los histogramas erróneo",
      "eng": "Histogram format is incorrect",
      "fre": "Format d'histogramme erroné",
      "cze": "Formát histogramu je nesprávný",
      "ger": "Das Histogrammformat ist nicht korrekt"
    },
    "LyQNameRequired": {
      "cat": "S'han d'indicar l'identificador de la capa, la consulta i el nom del nou estil en el format",
      "spa": "Debe indicar el identificador de la capa, la consulta y el nombre del nuevo estilo en el formato",
      "eng": "The layer identifier, query, and new style name must be specified in the format",
      "fre": "L'identifiant de la couche, la requête et le nom du nouveau style doivent être spécifiés dans le format",
      "cze": "Identifikátor vrstvy, dotaz a název nového stylu musí být zadány ve formátu",
      "ger": "Der Layerbezeichner, die Abfrage und der Name des neuen Stils müssen angegeben werden im Format"
    },
    "LyRequired": {
      "cat": "S'han d'indicar l'identificador de la capa",
      "spa": "Debe indicar el identificador de la capa",
      "eng": "The layer identifier, must be specified in the format",
      "fre": "L'identifiant de la couche, être spécifiés dans le format",
      "cze": "Identifikátor vrstvy, musí být zadán ve formátu",
      "ger": "Der Layerbezeichner muss angegeben werden im Format"
    }
  },
  "consola": {
    "Console": {
      "cat": "Consola",
      "spa": "Consola",
      "eng": "Console",
      "fre": "Console",
      "cze": "Konzole",
      "ger": "Konsole"
    },
    "ofWatchingReportsConsole": {
      "cat": "de veure els informes de la consola",
      "spa": "de ver los informes de la consola",
      "eng": "of watching the reports in the console",
      "fre": "pour regarder les rapports dans la console",
      "cze": "sledování hlášení v konzole",
      "ger": "die Berichte in der Konsole zu sehen"
    },
    "DeleteAll": {
      "cat": "Esborra-ho tot",
      "spa": "Borrar todo",
      "eng": "Delete all",
      "fre": "Tout effacer",
      "cze": "Smazat vše",
      "ger": "Alle löschen"
    }
  },
  "consult": {
    "NoDataForRequestedPoint": {
      "cat": "No hi ha dades pel punt consultat",
      "spa": "No hay datos para el punto consultado",
      "eng": "There are no data for the requested point",
      "fre": "Pas de données au point consulté",
      "cze": "Pro požadovaný bod nejsou k dispozici žádná data",
      "ger": "Es gibt keine Daten für den angeforderten Punkt"
    },
    "andActiveQueryableLayers": {
      "cat": "i les capes consultables actives",
      "spa": "y las capas consultables activas",
      "eng": "and active queryable layers",
      "fre": "et les couches consultables activées",
      "cze": "a aktivní dotazovatelné vrstvy",
      "ger": "und aktive abfragbare Layer"
    },
    "ChartValueCopiedClipboardFormat": {
      "cat": "Els valors del gràfic han estat copiats al portaretalls en format",
      "spa": "Los valores del gráfico han sido copiados al portapapeles en formato",
      "eng": "The values of the chart have been copied to clipboard in the format",
      "fre": "Les valeurs du graphique ont été copiées dans le presse-papiers dans le format",
      "cze": "Hodnoty grafu byly zkopírovány do schránky ve formátu",
      "ger": "Die Werte des Diagramms wurden in die Zwischenablage kopiert im Format"
    },
    "MessagesNotDisplayedAgain": {
      "cat": "Aquests missatge no es tornarà a mostrar",
      "spa": "Este mensaje no se volverá a mostrar",
      "eng": "These messages will not be displayed again",
      "fre": "Ces messages ne seront plus affichés",
      "cze": "Tyto zprávy se již nebudou zobrazovat",
      "ger": "Diese Meldungen werden nicht mehr angezeigt"
    },
    "CopySeriesValues": {
      "cat": "Copia valors de la sèrie",
      "spa": "Copiar valores de la serie",
      "eng": "Copy series values",
      "fre": "Copier les valeurs des séries",
      "cze": "Kopírování hodnot řad",
      "ger": "Serienwerte kopieren"
    },
    "FollowingCoordinateSelected": {
      "cat": "S'ha seleccionat la següent coordenada",
      "spa": "Se ha seleccionado la siguiente coordenada",
      "eng": "The following coordinate has been selected",
      "fre": "La coordonnée suivante a été sélectionnée",
      "cze": "Byla vybrána následující souřadnice",
      "ger": "Die folgende Koordinate wurde ausgewählt"
    },
    "IfCorrectValidateIt": {
      "cat": "Si és correcte, ja la podeu validar",
      "spa": "Si es correcta, ya la puede validar",
      "eng": "If it is correct, you can already validate it",
      "fre": "Si correcte, vous pouvez la valider",
      "cze": "Pokud je správná, můžete ji již potvrdit",
      "ger": "Wenn sie korrekt ist, können Sie sie bereits validieren."
    },
    "BrowserClosedReturnForm": {
      "cat": "Es tancarà la finestra de navegació i tornarà al formulari",
      "spa": "Se cerrará la ventana de navegación y volverá al formulario",
      "eng": "Browser window will be closed and will return to form",
      "fre": "La fenêtre du navigateur va se fermer et vous serez redirigés vers le formulaire",
      "cze": "Okno prohlížeče se zavře a vrátí se do formuláře",
      "ger": "Das Browserfenster wird geschlossen und kehrt zum Formular zurück."
    },
    "IfIncorrectClicksViewAgain": {
      "cat": "Si és incorrecte, torni a clicar sobre la vista",
      "spa": "Si es incorrecta, vuelva a cliquear sobre la vista",
      "eng": "If it is incorrect, click on the view again",
      "fre": "Si incorrecte, cliquez une autre fois sur la vue",
      "cze": "Pokud je nesprávná, klikněte na zobrazení znovu",
      "ger": "Wenn sie nicht korrekt ist, klicken Sie erneut auf die Ansicht."
    },
    "ValidateCoordinate": {
      "cat": "Validar Coordenada",
      "spa": "Validar Coordenada",
      "eng": "Validate Coordinate",
      "fre": "Valider coordonnée",
      "cze": "Ověření souřadnice",
      "ger": "Koordinate validieren"
    },
    "WaitingForData": {
      "cat": "Esperant dades",
      "spa": "Esperando datos",
      "eng": "Waiting for data",
      "fre": "En attente des données",
      "cze": "Čekání na data",
      "ger": "Warten auf Daten"
    },
    "ProfileTransversalCutQueriedLine": {
      "cat": "Perfil del tall transversal de la línia consultada",
      "spa": "Perfil del corte transversal de la línea consultada",
      "eng": "Profile of the transversal cut of the queried line",
      "fre": "Profil de la coupe transversale de la ligne interrogée",
      "cze": "Profil příčného řezu dotazované linie",
      "ger": "Profil des transversalen Schnitts der abgefragten Linie"
    },
    "PreviousLayer": {
      "cat": "Anterior capa",
      "spa": "Anterior capa",
      "eng": "Previous layer",
      "fre": "Précédente couche",
      "cze": "Předchozí vrstva",
      "ger": "Vorheriger Layer"
    },
    "NextLayer": {
      "cat": "Següent capa",
      "spa": "Siguiente capa",
      "eng": "Next layer",
      "fre": "Suivant couche",
      "cze": "Další vrstva",
      "ger": "Nächster Layer"
    },
    "noconsul_htm": {
      "cat": "noconsul.htm",
      "spa": "noconsul_spa.htm",
      "eng": "noconsul_eng.htm",
      "fre": "noconsul_fre.htm",
      "cze": "noconsul_eng.htm",
      "ger": "noconsul_eng.htm"
    },
    "NotImplementedYetRESTful": {
      "cat": "De moment no implementat per RESTful",
      "spa": "De momento no implementado para RESTful",
      "eng": "Not implemented yet for RESTful",
      "fre": "Pas encore implémenté pour RESTful",
      "cze": "Zatím neimplementováno pro RESTful",
      "ger": "Noch nicht für RESTful implementiert"
    }
  },
  "ctipica": {
    "AnyMatch": {
      "cat": "Cap coincidència",
      "spa": "Ninguna coincidencia",
      "eng": "Any match",
      "fre": "Aucune coïncidence",
      "cze": "Jakákoli shoda",
      "ger": "Jede Übereinstimmung"
    },
    "UpdatingList": {
      "cat": "Actualitzant la llista",
      "spa": "Actualizando la lista",
      "eng": "Updating the list",
      "fre": "La liste est en train d'être actualisée",
      "cze": "Aktualizace seznamu",
      "ger": "Aktualisieren der Liste"
    },
    "toBeShownInFrame": {
      "cat": "per a mostrar al frame",
      "spa": "para mostrar en el frame",
      "eng": "to be shown in the frame",
      "fre": "à montrer au frame",
      "cze": "který se má zobrazit v rámečku",
      "ger": "die im Rahmen angezeigt werden soll"
    },
    "notInTypicalQueryLayerList": {
      "cat": "no és a la llista de capes amb consulta típica",
      "spa": "no está en la lista de capas con consulta típica",
      "eng": "is not in the typical query layer list",
      "fre": "ne se trouve pas dans la liste de couches avec recherche typique",
      "cze": "není v typickém seznamu vrstvy dotazů",
      "ger": "ist nicht in der typischen Liste des AbfrageLayer"
    },
    "isIncorrect": {
      "cat": "és incorrecte",
      "spa": "es incorrecta",
      "eng": "is incorrect",
      "fre": "est incorrecte",
      "cze": "je nesprávná",
      "ger": "ist falsch"
    },
    "UseBrowserToolsPlaceOnView": {
      "cat": "Usa les eines del navegador per situar-te sobre la vista.\nA continuació fés clic sobre la vista per determinar la coordenada i la informació del punt a validar.\nPer finalitzar, prem [Validar Coordenada] o [Cancel·lar] des de la finestra de validació.",
      "spa": "Utiliza las herramientas del navegador para situarte sobre la vista.\nA continuación haz clic sobre la vista para determinar la coordenada y la información del punto a validar.\nPara finalizar aprieta [Validar Coordenada] o [Cancelar] desde la ventana de validación.",
      "eng": "You have to use browser tools to place on the view.\n Later, you have to click on the view to determine the coordinate\nand the information of the point of validating.\nTo finish you have to click [Validate coordinate] or [Cancel] from the validation window.",
      "fre": "Utilisez les outils du navigateur pour vous placer sur la vue.\n Ensuite cliquez sur la vue pour déterminer la coordonné\net l'information du point à valider.\nFinalement, pressez [Valider Coordonnée] où [Annuler] de la fenêtre de validation.",
      "cze": "K umístění na zobrazení musíte použít nástroje prohlížeče.\n Později musíte kliknout na zobrazení, abyste určili souřadnice\n a informace o bodu validace.\n Pro dokončení musíte v okně validace kliknout na tlačítko [Validovat souřadnici] nebo [Zrušit].",
      "ger": "Sie müssen die Browser-Tools verwenden, um die Ansicht zu platzieren.\n Später müssen Sie auf die Ansicht klicken, um die Koordinate und die Informationen des zu validierenden Punktes zu bestimmen.\n Zum Abschluss müssen Sie im Validierungsfenster auf [Koordi]."
    }
  },
  "download": {
    "ErrorWhileSendingTryAgain": {
      "cat": "S'ha produït algun error durant l'enviament del fitxer. Torna-ho a intentar",
      "spa": "Se ha producido algun error durante el envío del fichero. Vuélvalo a intentar",
      "eng": "An error has been occurred while sending the file. Try again",
      "fre": "Une erreur vient de se produire pendant l'envoi du fichier. Réessayez",
      "cze": "Při odesílání souboru došlo k chybě. Zkuste to znovu",
      "ger": "Beim Senden der Datei ist ein Fehler aufgetreten. Versuchen Sie es erneut"
    },
    "LayerDownloadedTakeMinutes": {
      "cat": "La generació de la descàrrega de la capa podria trigar alguns minuts",
      "spa": "La generación de la descarga de la capa podría demorarse algunos minutos",
      "eng": "Generation of layer to be downloaded can take some minutes",
      "fre": "La création du téléchargement de la couche pourrai prendre quelques minutes",
      "cze": "Generování vrstvy ke stažení může trvat několik minut",
      "ger": "Die Generierung des herunterzuladenden Layers kann einige Minuten dauern"
    },
    "PreparingRequestedLayer": {
      "cat": "Preparant la capa sol·licitada",
      "spa": "Preparando la capa solicitada",
      "eng": "Preparing the requested layer",
      "fre": "En préparant la couche demandée",
      "cze": "Příprava požadované vrstvy",
      "ger": "Vorbereiten des angeforderten Layers"
    },
    "SelectiveDownloadZone": {
      "cat": "Descàrrega selectiva de la zona",
      "spa": "Descarga selectiva de la zona",
      "eng": "Selective download of the zone",
      "fre": "Téléchargement sélectif de la zone",
      "cze": "Selektivní stažení zóny",
      "ger": "Selektiver Download der Zone"
    },
    "MMZ_MMZX_NotInstalledDownload": {
      "cat": "Pel format MMZ o MMZX (ISO 19165-1), si no teniu instal·lat o actualitzat el Lector Universal de Mapes del MiraMon, descarregueu-lo",
      "spa": "Para el formato MMZ o MMZX (ISO 19165-1), si no tiene instalado o actualizado el Lector Universal de Mapas de MiraMon, descárguelo",
      "eng": "For the MMZ or MMZX format (ISO 19165-1), if you don't have installed or updated MiraMon Universal Map Reader, please, download it",
      "fre": "Pour le format MMZ ou MMZX (ISO 19165-1), si vous n'avez pas installé où actualisé le Lecteur Universel de Cartes du MiraMon, please, download it",
      "cze": "Pokud nemáte nainstalovanou nebo aktualizovanou aplikaci MiraMon Universal Map Reader, stáhněte si ji pro formát MMZ nebo MMZX (ISO 19165-1).",
      "ger": "Für das MMZ- oder MMZX-Format (ISO 19165-1) laden Sie bitte den MiraMon Universal Map Reader herunter, wenn Sie ihn nicht installiert oder aktualisiert haben."
    },
    "ViewLayers_MMZ_MMZX_InstalledMM": {
      "cat": "Per poder visualitzar les capes en format MMZ o MMZX (ISO 19165-1) cal tenir correctament instal·lat el programa MiraMon.",
      "spa": "Para poder visualitzar las capas en formato MMZ o MMZX (ISO 19165-1) es necessario tener correctamente instalado el programa MiraMon.",
      "eng": "In order to be able to view the layers in MMZ or MMZX format (ISO 19165-1), an installed version of the MiraMon software is required.",
      "fre": "Pour pouvoir visualiser les couches en MMZ du format MMZX (ISO 19165-1), et la version installée du logiciel MiraMon est nécessaire.",
      "cze": "Pro zobrazení vrstev ve formátu MMZ nebo MMZX (ISO 19165-1) je nutná nainstalovaná verze softwaru MiraMon.",
      "ger": "Um die Layers im MMZ- oder MMZX-Format (ISO 19165-1) betrachten zu können, ist eine installierte Version der MiraMon Software erforderlich."
    },
    "DownloadLayerCompleted": {
      "cat": "Descàrrega la capa completa",
      "spa": "Descarga de la capa completa",
      "eng": "Download the complete layer",
      "fre": "Téléchargement de la couche complète",
      "cze": "Stáhněte si kompletní vrstvu",
      "ger": "Herunterladen des kompletten Layers"
    },
    "DownloadLayer": {
      "cat": "Descàrrega de capes",
      "spa": "Descarga de capas",
      "eng": "Layer download",
      "fre": "Télécharger des couches",
      "cze": "Stažení vrstvy",
      "ger": "Layer-Download"
    },
    "ofDownloading": {
      "cat": "de descarregar",
      "spa": "de descargar",
      "eng": "of downloading",
      "fre": "de téléchargement",
      "cze": "stahování",
      "ger": "des Herunterladens"
    },
    "GenerationMMZMinutes": {
        "cat": "La generació d'un MMZ podria trigar alguns minuts",
        "spa": "La generación de un MMZ podría durar algunos minutos",
        "eng": "Generation of an MMZ could take some minutes",
        "fre": "La création d'un MMZ peut prendre quelques minutes",
      "cze": "Generování MMZ může trvat několik minut",
      "ger": "Die Erstellung eines MMZ kann einige Minuten dauern"
    },
    "PreparingMapLayers": {
      "cat": "Preparant un mapa amb les capes sol·licitades",
      "spa": "Preparando un mapa con las capas solicitadas",
      "eng": "Preparing a map with requested layers",
      "fre": "Préparant une carte avec les couches demandées",
      "cze": "Příprava mapy s požadovanými vrstvami",
      "ger": "Die Karte mit den angeforderten Layers wird vorbereitet"
    },
    "NoLayerSellectedForMMZ": {
      "cat": "No s'ha sel·lecionat cap capa per ser inclosa dins d'un MMZ",
      "spa": "No se ha seleccionado ninguna capa para ser incluida dentro de un MMZ",
      "eng": "No layer has been sellected for being included on a MMZ", 
      "fre": "Aucune couche n'a été sélectionnée pour être insérée dans un MMZ",
      "cze": "Žádná vrstva nebyla vybrána pro zařazení do MMZ",
      "ger": "Es wurde kein Layer für die Aufnahme in ein MMZ ausgewählt"
    },
    "DonwloadingCartography": {
      "cat": "Descàrrega de cartografia",
      "spa": "Descarga de cartografía",
      "eng": "Downloading the Cartography",
      "fre": "Téléchargement de cartographie",
      "cze": "Stažení kartografie",
      "ger": "Die Kartographie wird heruntergeladen"
    }, 
    "NotHaveMiramonInstalled": {
      "cat": "Si no teniu instal·lat o actualitzat el Lector Universal de Mapes del MiraMon", 
      "spa": "Si no tiene instalado o actualizado el Lector Universal de Mapas de MiraMon", 
      "eng": "If you don't have MiraMon Universal Map Reader installed or updated",
      "fre": "Si vous n'avez pas installé où actualisé le Lecteur Universel de Cartes MiraMon",
      "cze": "Pokud nemáte nainstalovanou nebo aktualizovanou aplikaci MiraMon Universal Map Reader",
      "ger": "Wenn MiraMon Universal Map Reader nicht installiert bzw. aktualisiert ist"
    },
    "CorrectDownloadLayers": {
      "cat": "Per poder descarregar les capes cal tenir correctament instal·lat el programa MiraMon", 
      "spa": "Para poder descargar las capas es necesario tener correctamente instalado el programa MiraMon", 
      "eng": "To correctly download the layers you have to have MiraMon program installed",
      "fre": "Pour télécharger les couches il faut voir installé correctement le logiciel MiraMon",
      "cze": "Pro správné stažení vrstev musíte mít nainstalovaný program MiraMon",
      "ger": "Um die Layers korrekt herunterzuladen, muss das MiraMon-Programm installiert sein"
    }, 
    "downloadIt": {
      "cat": "descarregueu-lo",
      "spa": "descárguelo",
      "eng": "download it",
      "fre": "téléchargez",
      "cze": "stáhnout",
      "ger": "Herunterladen"
    }, 
    "GenerateDirectlyOpen": {
      "cat": "Generar i obrir directament",
      "spa": "Generar y abrir directamente", 
      "eng": "Generate and directly open",
      "fre": "Créer et ouvrir directement",
      "cze": "Generování a přímé otevření",
      "ger": "Erzeugen und sofort öffnen"
    }, 
    "PrepareOffer": {
      "cat": "Preparar i oferir",
      "spa": "Preparar y ofrecer",
      "eng": "Prepare and offer",
      "fre": "Préparer et télécharger", 
      "cze": "Připravte a nabídněte",
      "ger": "vorbereiten und anbieten"
    },
    "toSaveFile": {
      "cat": "per a guardar fitxer",
      "spa": "para guardar fichero",
      "eng": "to save file",
      "fre": "pour enregistrer le fichier",
      "cze": "uložení souboru",
      "ger": "Zu Datei speichern"
    },
    "ProcessStatus": {
      "cat": "Estat del procés",
      "spa": "Estado del proceso",
      "eng": "Process status",
      "fre": "État du processus",
      "cze": "Stav procesu",
      "ger": "Prozessstatus"
    }, 
    "AllLayersSameServer": {
      "cat": "Totes les capes a descarregar han de ser del mateix servidor. Desactiva",
      "spa": "Todas las capas a descargar deben residir en el mismo servidor. Desactive",
      "eng": "All layers to download have to be in the same server. Please unselect",
      "fre": "Toutes les couches doivent être télécharger du même serveur. Désactivez",
      "cze": "Všechny vrstvy ke stažení musí být na stejném serveru. Zrušte prosím výběr",
      "ger": "Alle herunterzuladende Layers müssen auf dem gleichen Server sein. Bitte deselektieren"
    },
    "andTryAgain": {
      "cat": "i torna a intentar-ho",
      "spa": "y vuelva a intentarlo",
      "eng": "and try it again",
      "fre": "et réessayez",
      "cze": "a zkuste to znovu",
      "ger": "und versuchen Sie es erneut"
    },
    "vectorial": {
      "cat": "vectorial",
      "spa": "vectorial",
      "eng": "vector",
      "fre": "vecteur",
      "cze": "vektor",
      "ger": "Vektor"
    }
  },
  "params": {
    "ViewAreaBackgroundColor": {
      "cat": "Color de fons de la vista",
      "spa": "Color de fondo de la vista",
      "eng": "Background color of the view area",
      "fre": "Couleur du fond",
      "cze": "Barva pozadí oblasti zobrazení",
      "ger": "Hintergrundfarbe des Ansichtsbereichs"
    },
    "SituationRectangleColor": {
      "cat": "Color del rectangle de situació",
      "spa": "Color del rectángulo de situación",
      "eng": "Color of the situation rectangle",
      "fre": "Couleur du rectangle de situation",
      "cze": "Barva obdélníku situace",
      "ger": "Farbe des Lagerechtecks"
    },
    "WidthOfTheView": {
      "cat": "Mida de l'ample de la vista",
      "spa": "Tamaño del ancho de la vista",
      "eng": "Width of the view",
      "fre": "Dimensions de la largeur de la vue",
      "cze": "Šířka zobrazení",
      "ger": "Breite der Ansicht"
    },
    "LateralJumpPerc": {
      "cat": "Perc. de salt lateral",
      "spa": "Porc. de salto lateral",
      "eng": "Lateral jump perc.",
      "fre": "Pourc. de saut latéral",
      "cze": "Boční skok proc",
      "ger": "Seitlicher Sprung proc."
    },
    "ShowCleanMap_View": {
      "cat": "Mostra <u>v</u>ista del mapa neta",
      "spa": "Muestra <u>v</u>ista del mapa limpia",
      "eng": "Show a clean map <u>v</u>iew",
      "fre": "Afficher une <u>v</u>ue de carte propre",
      "cze": "Zobrazení čistého <u>z</u>obrazení mapy",
      "ger": "Anzeigen einer sauberen Kartenan<u>s</u>icht"
    },
    "ZoomPan_2Clicks": {
      "cat": "Zoom i pan basat en <u>2</u> simples clics (ergonòmic)",
      "spa": "Zoom y pan basado en <u>2</u> simples clics (ergonómico)",
      "eng": "Zoom and pan based in <u>2</u> simples clicks (ergonomic)",
      "fre": "Zoom et pan basé en <u>2</u> simples clics (ergonomique)",
      "cze": "Přiblížení a posun na základě <u>2</u> jednoduchých kliknutí (ergonomické)",
      "ger": "Zoomen und Schwenken mit <u>2</u> einfachen Klicks (ergonomisch)"
    },
    "ZoomPan_1ClickDrag": {
      "cat": "Zoom i pan en <u>1</u> clic i arrossegant",
      "spa": "Zoom y pan en <u>1</u> clic y arrastrando",
      "eng": "Zoom and pan with <u>1</u> click and dragging",
      "fre": "Zoom et pan en <u>1</u> cliques et glisser",
      "cze": "Přiblížení a posun pomocí <u>1</u> kliknutí a tažení",
      "ger": "Zoomen und Schwenken mit <u>1</u> Klick und Ziehen"
    },
    "NOfFigures": {
      "cat": "N. decimals",
      "spa": "N. decimales",
      "eng": "N. of decimal figures",
      "fre": "N. décimales",
      "cze": "Počet desetinných čísel",
      "ger": "Anzahl der Dezimalstellen"
    },
    "Corners": {
      "cat": "Cantonades",
      "spa": "Esquinas",
      "eng": "Corners",
      "fre": "Coins",
      "cze": "Rohy",
      "ger": "Ecken"
    },
    "None_underlined": {
      "cat": "c<u>a</u>p",
      "spa": "ningun<u>a</u>",
      "eng": "<u>n</u>one",
      "fre": "<u>a</u>ucune",
      "cze": "žá<u>d</u>né",
      "ger": "<u>k</u>eine"
    },
    "None_underlined_char": {
      "cat": "a",
      "spa": "a",
      "eng": "n",
      "fre": "a",
      "cze": "n",
      "ger": "n"
    },
    "Proj_underlined_p": {
      "cat": "<u>P</u>roj",
      "spa": "<u>P</u>roy",
      "eng": "<u>P</u>roj",
      "fre": "<u>P</u>roj",
      "cze": "<u>P</u>roj",
      "ger": "<u>P</u>roj"
    },
    "Proj_underlined_r": {
      "cat": "P<u>r</u>oj",
      "spa": "P<u>r</u>oy",
      "eng": "P<u>r</u>oj",
      "fre": "P<u>r</u>oj",
      "cze": "P<u>r</u>oj",
      "ger": "P<u>r</u>oj"
    },
    "ShowWindow_underlined": {
      "cat": "<u>M</u>ostra finestra",
      "spa": "<u>M</u>uestra ventana",
      "eng": "S<u>h</u>ow window",
      "fre": "A<u>f</u>ficher la fenêtre",
      "cze": "<u>Z</u>obrazit okno",
      "ger": "<u>F</u>enster anzeigen"
    },
    "ShowWindow_underlined_char": {
      "cat": "m",
      "spa": "m",
      "eng": "h",
      "fre": "f",
      "cze": "h",
      "ger": "h"
    },
    "JsonConfigurationFile": {
      "cat": "Fitxer de configuració JSON",
      "spa": "Fichero de configuración JSON",
      "eng": "JSON configuration file",
      "fre": "Fichier de configuration JSON",
      "cze": "Konfigurační soubor JSON",
      "ger": "JSON-Konfigurationsdatei"
    },
    "changesAboveWillBeApplied": {
      "cat": "s'aplicaran els canvis anteriors",
      "spa": "los cambios anteriores se aplicarán",
      "eng": "changes above will be applied",
      "fre": "les modifications ci-dessus s'appliqueront",
      "cze": "výše uvedené změny budou použity",
      "ger": "die obigen Änderungen werden übernommen"
    },
    "ofChangingParameters": {
      "cat": "de canviar paràmetres",
      "spa": "de cambiar parámetros",
      "eng": "of changing parameters",
      "fre": "pour changement de paramètres",
      "cze": "měnících se parametrů",
      "ger": "der sich ändernden Parameter"
    },
    "LayersOutSideTheBBox": {
      "cat": "Capes fora de l'àmbit actual",
      "spa": "Capas fuera del ámbito actual",
      "eng": "Layers outside the current bounding box",
      "fre": "Calques en dehors de la zone de délimitation actuelle",
      "cze": "Vrstvy mimo aktuální ohraničující rámeček",
      "ger": "Layers außerhalb des aktuellen Begrenzungsrahmens"
    },
    "LayersOutSideScale": {
      "cat": "Capes sense suport pel nivell de zoom actual",
      "spa": "Capas sin soporte para el nivel de zoom actual",
      "eng": "Layers without support for the current zoom level",
      "fre": "Calques sans prise en charge du niveau de zoom actuel",
      "cze": "Vrstvy bez podpory pro aktuální úroveň zvětšení",
      "ger": "Layers ohne Unterstützung für die aktuelle Zoomstufe"
    },
    "LayersWithoutSupportCurrentCRS": {
      "cat": "Capes sense suport pel CRS actual",
      "spa": "Capas sin soporte para el CRS actual",
      "eng": "Layers without support for the current CRS",
      "fre": "Calques sans prise en charge du CRS actuel",
      "cze": "Vrstvy bez podpory aktuálního CRS",
      "ger": "Layers ohne Unterstützung für das aktuelle CRS"
    }
  },
  "editavec": {
    "InsertTransactionObjectIntoLayer": {
      "cat": "La transacció d'inserció a la capa",
      "spa": "La transacción de inserción a la capa",
      "eng": "The insert transaction of the feature into the layer",
      "fre": "L'opération d'insertion de l'objet dans la couche",
      "cze": "Transakce vložení objektu do vrstvy",
      "ger": "Der Einfügevorgang des Objekts in den Layer"
    },
    "hasFailed": {
      "cat": "ha fallat",
      "spa": "ha fallado",
      "eng": "has failed",
      "fre": "a échoué",
      "cze": "selhala",
      "ger": "ist fehlgeschlagen"
    },
    "InsertTransactionObject": {
      "cat": "La transacció d'inserció de l'objecte",
      "spa": "La transacción de inserción del objeto",
      "eng": "The insert transaction of the feature",
      "fre": "La transaction d'insertion de l'objet",
      "cze": "Transakce vložení objektu",
      "ger": "Die Einfügetransaktion des Objekts"
    },
    "successfullyCompleted": {
      "cat": "ha finalitzat amb èxit",
      "spa": "ha finalizado con éxito",
      "eng": "has been successfully completed",
      "fre": "a été achevé avec succès",
      "cze": "byla úspěšně dokončena",
      "ger": "wurde erfolgreich abgeschlossen"
    },
    "toReportResultTransaction": {
      "cat": "per informar del resultat de la transacció",
      "spa": "para informar del resultado de la transacción",
      "eng": "to report the result of the transaction",
      "fre": "pour rapporter le résultat de la transaction",
      "cze": "hlášení výsledku transakce",
      "ger": "um das Ergebnis der Transaktion zu melden"
    },
    "ClickOnViewDeterminesCoordNewPoint": {
      "cat": "Un clic sobre la vista determina la coordenada del nou punt. Ompliu en aquesta fitxa les propietats del objecte que conegueu i premeu [D'acord] per enviar el punt al servidor.",
      "spa": "Un clic sobre la vista determina la coordenada del punto nuevo. Rellena en esta ficha los datos del objeto que conozcas y pulsa [Aceptar] para enviar el punto al servidor.",
      "eng": "A click on the view determines the coordinate of the new point. In this tab fill the properties of the feature that you known and press [OK] to send the point to the server.",
      "fre": "Un clic sur la vue détermine la coordonnée du nouveau point. Dans cet onglet remplissez les propriétés de la fonctionnalité que vous connaissez et appuyez sur [Accepter] pour envoyer le point au serveur.",
      "cze": "Kliknutím na zobrazení určíte souřadnici nového bodu. Na této kartě vyplňte vlastnosti známého prvku a stisknutím tlačítka [OK] odešlete bod na server.",
      "ger": "Ein Klick auf die Ansicht bestimmt die Koordinate des neuen Punktes. In dieser Registerkarte füllen Sie die Eigenschaften des bekannten Merkmals aus und drücken [OK], um den Punkt an den Server zu senden."
    }
  },
  "histopie": {
    "ImageValuesCopiedClipboardFormat": {
      "cat": "Els valors de la imatge han estat copiats al portaretalls en format",
      "spa": "Los valores de la image han sido copiados al portapapeles en formato",
      "eng": "The values of the image have been copied to clipboard in the format",
      "fre": "Les valeurs du graphique ont été copiées dans le presse-papier dans le format",
      "cze": "Hodnoty obrázku byly zkopírovány do schránky ve formátu",
      "ger": "Die Werte des Bildes wurden in die Zwischenablage kopiert und haben das Format"
    },
    "ClassDescription": {
      "cat": "Descripció de classe",
      "spa": "Descripción de clase",
      "eng": "Class description",
      "fre": "Description de la classe",
      "cze": "Popis třídy",
      "ger": "Beschreibung der Klasse"
    },
    "ClassValue": {
      "cat": "Valor de classe",
      "spa": "Valor de classe",
      "eng": "Class value",
      "fre": "Valeur de classe",
      "cze": "Hodnota třídy",
      "ger": "Wert der Klasse"
    },
    "AreaPercentage": {
      "cat": "Percentatge de l'àrea",
      "spa": "Porcentaje del área",
      "eng": "Percentage of area",
      "fre": "Pourcentage de zone",
      "cze": "Procento plochy",
      "ger": "Prozentsatz der Fläche"
    },
    "ClassCentralValue": {
      "cat": "Valor central de la classe",
      "spa": "Valor central de la clase",
      "eng": "Class central value",
      "fre": "Classe valeur centrale",
      "cze": "Střední hodnota třídy",
      "ger": "Zentraler Wert der Klasse"
    },
    "CountByCategory": {
      "cat": "Recompte per categoria",
      "spa": "Cuenta por categoría",
      "eng": "Count by category",
      "fre": "Compter par catégorie",
      "cze": "Počet podle kategorie",
      "ger": "Anzahl nach Kategorie"
    },
    "AreaByCategory": {
      "cat": "Àrea per categoria",
      "spa": "Área por categoría",
      "eng": "Area by category",
      "fre": "Zone par catégorie",
      "cze": "Plocha podle kategorie",
      "ger": "Fläche nach Kategorie"
    },
    "Similarity": {
      "cat": "Semblança",
      "spa": "Similitud",
      "eng": "Similarity",
      "fre": "Similitude",
      "cze": "Podobnost",
      "ger": "Ähnlichkeit"
    },
    "MeanPlusDev": {
      "cat": "Mitjana+desv",
      "spa": "Media+desv",
      "eng": "Mean+dev",
      "fre": "Moyenne+écart",
      "cze": "Průměr+odchylka",
      "ger": "Mittelwert+Abweichung"
    },
    "MeanMinusDev": {
      "cat": "Mitjana-desv",
      "spa": "Media-desv",
      "eng": "Mean-dev",
      "fre": "Moyenne-écart",
      "cze": "Průměr-odchylka",
      "ger": "Mittelwert-Abweichung"
    },
    "ChartValuesCopiedClipboard": {
      "cat": "Els valors del gràfic han estat copiats al portaretalls",
      "spa": "Los valores del gráfico han sido copiados al portapapeles",
      "eng": "The values of the chart have been copied to clipboard",
      "fre": "Les valeurs du graphique ont été copiées dans le presse-papier",
      "cze": "Hodnoty grafu byly zkopírovány do schránky",
      "ger": "Die Werte des Diagramms wurden in die Zwischenablage kopiert"
    },
    "CutTails": {
      "cat": "Retall de cues",
      "spa": "Recorte de colas",
      "eng": "Tail trimming",
      "fre": "Coupe de la queue",
      "cze": "Ořezávání ocásků",
      "ger": "Restes"
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
      "cze": "Leden",
      "ger": "Januar"
    },
    "PrepMonthOfTheYear1": {
      "cat": "de febrer",
      "spa": "de febrero",
      "eng": "February",
      "fre": "Février",
      "cze": "Únor",
      "ger": "Februar"
    },
    "PrepMonthOfTheYear2": {
      "cat": "de març",
      "spa": "de marzo",
      "eng": "March",
      "fre": "Mars",
      "cze": "Březen",
      "ger": "März"
    },
    "PrepMonthOfTheYear3": {
      "cat": "d'abril",
      "spa": "de abril",
      "eng": "April",
      "fre": "Avril",
      "cze": "Duben",
      "ger": "April"
    },
    "PrepMonthOfTheYear4": {
      "cat": "de maig",
      "spa": "de mayo",
      "eng": "May",
      "fre": "Mai",
      "cze": "Květen",
      "ger": "Mai"
    },
    "PrepMonthOfTheYear5": {
      "cat": "de juny",
      "spa": "de junio",
      "eng": "June",
      "fre": "Juin",
      "cze": "Červen",
      "ger": "Juni"
    },
    "PrepMonthOfTheYear6": {
      "cat": "de juliol",
      "spa": "de julio",
      "eng": "July",
      "fre": "Juillet",
      "cze": "Červenec",
      "ger": "Juli"
    },
    "PrepMonthOfTheYear7": {
      "cat": "d'agost",
      "spa": "de agosto",
      "eng": "August",
      "fre": "Août",
      "cze": "Srpen",
      "ger": "August"
    },
    "PrepMonthOfTheYear8": {
      "cat": "de setembre",
      "spa": "de setiembre",
      "eng": "September",
      "fre": "Septembre",
      "cze": "Září",
      "ger": "September"
    },
    "PrepMonthOfTheYear9": {
      "cat": "d'octubre",
      "spa": "de octubre",
      "eng": "October",
      "fre": "Octobre",
      "cze": "Říjen",
      "ger": "Oktober"
    },
    "PrepMonthOfTheYear10": {
      "cat": "de novembre",
      "spa": "de noviembre",
      "eng": "November",
      "fre": "Novembre",
      "cze": "Listopad",
      "ger": "November"
    },
    "PrepMonthOfTheYear11": {
      "cat": "de desembre",
      "spa": "de diciembre",
      "eng": "December",
      "fre": "Décembre",
      "cze": "Prosinec",
      "ger": "Dezember"
    },
    "MonthOfTheYear0": {
      "cat": "Gener",
      "spa": "Enero",
      "eng": "January",
      "fre": "Janvier",
      "cze": "Leden",
      "ger": "Januar"
    },
    "MonthOfTheYear1": {
      "cat": "Febrer",
      "spa": "Febrero",
      "eng": "February",
      "fre": "Février",
      "cze": "Únor",
      "ger": "Februar"
    },
    "MonthOfTheYear2": {
      "cat": "Març",
      "spa": "Marzo",
      "eng": "March",
      "fre": "Mars",
      "cze": "Březen",
      "ger": "März"
    },
    "MonthOfTheYear3": {
      "cat": "Abril",
      "spa": "Abril",
      "eng": "April",
      "fre": "Avril",
      "cze": "Duben",
      "ger": "April"
    },
    "MonthOfTheYear4": {
      "cat": "Maig",
      "spa": "Mayo",
      "eng": "May",
      "fre": "Mai",
      "cze": "Květen",
      "ger": "Mai"
    },
    "MonthOfTheYear5": {
      "cat": "Juny",
      "spa": "Junio",
      "eng": "June",
      "fre": "Juin",
      "cze": "Červen",
      "ger": "Juni"
    },
    "MonthOfTheYear6": {
      "cat": "Juliol",
      "spa": "Julio",
      "eng": "July",
      "fre": "Juillet",
      "cze": "Červenec",
      "ger": "Juli"
    },
    "MonthOfTheYear7": {
      "cat": "Agost",
      "spa": "Agosto",
      "eng": "August",
      "fre": "Août",
      "cze": "Srpen",
      "ger": "August"
    },
    "MonthOfTheYear8": {
      "cat": "Setembre",
      "spa": "Setiembre",
      "eng": "September",
      "fre": "Septembre",
      "cze": "Září",
      "ger": "September"
    },
    "MonthOfTheYear9": {
      "cat": "Octubre",
      "spa": "Octubre",
      "eng": "October",
      "fre": "Octobre",
      "cze": "Říjen",
      "ger": "Oktober"
    },
    "MonthOfTheYear10": {
      "cat": "Novembre",
      "spa": "Noviembre",
      "eng": "November",
      "fre": "Novembre",
      "cze": "Listopad",
      "ger": "November"
    },
    "MonthOfTheYear11": {
      "cat": "Desembre",
      "spa": "Diciembre",
      "eng": "December",
      "fre": "Décembre",
      "cze": "Prosinec",
      "ger": "Dezember"
    }
  },
  "barra": {
    "ZoomIn": {
      "cat": "Acostar",
      "spa": "Acercar",
      "eng": "Zoom in",
      "fre": "Rapprocher",
      "cze": "Přiblížení",
      "ger": "Vergrößern"
    },
    "ZoomOut": {
      "cat": "Allunyar",
      "spa": "Alejar",
      "eng": "Zoom out",
      "fre": "Éloigner",
      "cze": "Zvětšení a zmenšení",
      "ger": "Verkleinern"
    },
    "goToCoordinate": {
      "cat": "anar a coordenada",
      "spa": "ir a coordenada",
      "eng": "go to coordinate",
      "fre": "aller à la coordonnée",
      "cze": "přejít na souřadnice",
      "ger": "zur Koordinate gehen"
    },
    "GoToCoordinate": {
      "cat": "Anar a coordenada",
      "spa": "Ir a coordenada",
      "eng": "Go to coordinate",
      "fre": "Aller à la coordonnée",
      "cze": "Přejít na souřadnice",
      "ger": "Zur Koordinate gehen"
    },
    "FBwithScope":{
      "cat": "Definir envolupant de valoració",
      "spa": "Definir ámbito de valoración",
      "eng": "Define feedback's scope",
      "fre": "Définir domaine de l'évaluation",
      "cze": "Definujte doménu hodnocení",
      "ger": "Definieren Sie den Umfang der Beurteilung"
    },
    "previousView": {
      "cat": "vista prèvia",
      "spa": "vista previa",
      "eng": "previous view",
      "fre": "vue préalable",
      "cze": "předchozí zobrazení",
      "ger": "vorherige Ansicht"
    },
    "PreviousView": {
      "cat": "Vista prèvia",
      "spa": "Vista previa",
      "eng": "Previous view",
      "fre": "Vue préalable",
      "cze": "Předchozí zobrazení",
      "ger": "Vorherige Ansicht"
    },
    "generalView": {
      "cat": "vista general",
      "spa": "vista general",
      "eng": "general view",
      "fre": "vue générale",
      "cze": "obecné zobrazení",
      "ger": "allgemeine Ansicht"
    },
    "GeneralView": {
      "cat": "Vista general",
      "spa": "Vista general",
      "eng": "General view",
      "fre": "Vue générale",
      "cze": "Obecné zobrazení",
      "ger": "Allgemeine Ansicht"
    },
    "PanView": {
      "cat": "Mou vista",
      "spa": "Mueve vista",
      "eng": "Pan view",
      "fre": "Déplace vue",
      "cze": "Posun pomocí kurzoru ",
      "ger": "Schwenkansicht"
    },
    "CenterWhereClick": {
      "cat": "Centra on faci clic",
      "spa": "Centra donde haga clic",
      "eng": "Center where click",
      "fre": "Centre où cliquer",
      "cze": "Klikněte pro vycentrování mapy",
      "ger": "Zentrieren wo klicken"
    },
    "WindowZoom": {
      "cat": "Zoom de finestra",
      "spa": "Zoom de ventana",
      "eng": "Window zoom",
      "fre": "Zoom de fenêtre",
      "cze": "Přiblížení okna",
      "ger": "Fenster zoomen"
    },
    "NewView": {
      "cat": "Nova vista",
      "spa": "Nova vista",
      "eng": "New view",
      "fre": "Nouvelle vue",
      "cze": "Nové zobrazení",
      "ger": "Neue Ansicht"
    },
    "Validation": {
      "cat": "Validació",
      "spa": "Validación",
      "eng": "Validation",
      "fre": "Validation",
      "cze": "Ověřování",
      "ger": "Validierung"
    },
    "EditANewPoint": {
      "cat": "Editar un nou punt",
      "spa": "Editar un nuevo punto",
      "eng": "Edit a new point",
      "fre": "Éditer un nouveaux point",
      "cze": "Upravit nový bod",
      "ger": "Einen neuen Punkt bearbeiten"
    },
    "TypicalOrObjectQuery": {
      "cat": "Consulta típica o per objectes",
      "spa": "Consulta típica o por objetos",
      "eng": "Typical or feature query",
      "fre": "Recherche typique où par objets",
      "cze": "Typický nebo objektový dotaz",
      "ger": "Typische oder Objektabfrage"
    },
    "TimeSeriesAnimations": {
      "cat": "Series temporals i animacions",
      "spa": "Series temporales y animaciones",
      "eng": "Time series and animations",
      "fre": "Séries chronologiques et animations",
      "cze": "Časové řady a animace",
      "ger": "Zeitreihen und Animationen"
    },
    "LinkToMap": {
      "cat": "Enllaç al mapa",
      "spa": "Enlace al mapa",
      "eng": "Link to map",
      "fre": "Lien à la carte",
      "cze": "Odkaz na mapu",
      "ger": "Link zur Karte"
    },
    "LinksToServers": {
      "cat": "Enllaços als servidors",
      "spa": "Enlaces a los servidores",
      "eng": "Links to the servers",
      "fre": "Lien aux serveurs",
      "cze": "Odkazy na servery",
      "ger": "Links zu den Servern"
    },
    "RestartFromServer": {
      "cat": "Reiniciar des de servidor",
      "spa": "Reiniciar desde servidor",
      "eng": "Restart from server",
      "fre": "Redémarrer depuis le serveur",
      "cze": "Restart ze serveru",
      "ger": "Neustart vom Server"
    },
    "InstallMiraMonReader": {
      "cat": "Instal·lar el Lector Universal de Mapes del MiraMon",
      "spa": "Instalar el Lector Universal de Mapas de MiraMon",
      "eng": "Install MiraMon Universal Map Reader",
      "fre": "Installer le Lecteur Universel de Cartes du MiraMon",
      "cze": "Instalace MiraMon Universal Map Reader",
      "ger": "MiraMon Universal Map Reader installieren"
    },
    "SureToDownloadMMR": {
      "cat": "Segur que vols descarregar el Lector Universal de Mapes del MiraMon?",
      "spa": "¿Seguro que quieres descargar el Lector Universal de Mapas de MiraMon?",
      "eng": "Are you sure to download the MiraMon Universal Map Reader?",
      "fre": "Êtes-vous sûr de télécharger le Lecteur Universel de Cartes du MiraMon?",
      "cze": "Určitě jste si stáhli čtečku MiraMon Universal Map Reader?",
      "ger": "Sind Sie sicher, dass Sie den MiraMon Universal Map Reader herunterladen möchten?"
    }
  },
  "llegenda": {
    "Legend": {
      "cat": "Llegenda",
      "spa": "Leyenda",
      "eng": "Legend",
      "fre": "Légende",
      "cze": "Legenda",
      "ger": "Legende"
    },
    "queryable": {
      "cat": "consultable",
      "spa": "consultable",
      "eng": "queryable",
      "fre": "consultable",
      "cze": "dotazovatelné",
      "ger": "abfragbar"
    },
    "nonQueryable": {
      "cat": "no consultable",
      "spa": "no consultable",
      "eng": "non queryable",
      "fre": "non consultable",
      "cze": "nedotazovatelné",
      "ger": "nicht abfragbar"
    },
    "downloadable": {
      "cat": "descarregable",
      "spa": "descargable",
      "eng": "downloadable",
      "fre": "téléchargeable",
      "cze": "ke stažení",
      "ger": "herunterladbar"
    },
    "nonDownloadable": {
      "cat": "no descarregable",
      "spa": "no descargable",
      "eng": "no downloadable",
      "fre": "non téléchargeable",
      "cze": "bez možnosti stažení",
      "ger": "nicht herunterladbar"
    },
    "visible": {
      "cat": "visible",
      "spa": "visible",
      "eng": "visible",
      "fre": "visible",
      "cze": "viditelné",
      "ger": "sichtbar"
    },
    "nonVisible": {
      "cat": "no visible",
      "spa": "no visible",
      "eng": "non visible",
      "fre": "non visible",
      "cze": "neviditelný",
      "ger": "nicht sichtbar"
    },
    "semitransparent": {
      "cat": "semitransparent",
      "spa": "semitransparente",
      "eng": "semitransparent",
      "fre": "semi transparent",
      "cze": "poloprůhledné",
      "ger": "halbtransparent"
    },
    "foldLegend": {
      "cat": "plega llegenda",
      "spa": "recoge leyenda",
      "eng": "fold legend up",
      "fre": "plie légende",
      "cze": "složit legendu nahoru",
      "ger": "Legende einklappen"
    },
    "unfoldLegend": {
      "cat": "desplega llegenda",
      "spa": "expande leyenda",
      "eng": "unfold legend",
      "fre": "déplier légende",
      "cze": "rozložit legendu",
      "ger": "Legende aufklappen"
    },
    "processingService": {
      "cat": "servei de processos",
      "spa": "servicio de procesos",
      "eng": "processing service",
      "fre": "service des processus",
      "cze": "služba zpracování",
      "ger": "Verarbeitungsdienst"
    },
    "animableButNoDate": {
      "cat": "indica que és AnimableMultiTime però no té dates definides",
      "spa": "indica que es AnimableMultiTime pero no tiene fechas definidas",
      "eng": "indicates that is AnimableMultiTime but it has no dates defined",
      "fre": "Indique que c'est AnimableMultiTime, mais il n'a pas de dates définies",
      "cze": "označuje, že je AnimableMultiTime, ale nemá definované datumy",
      "ger": "zeigt an, dass es sich um AnimableMultiTime handelt, aber es sind keine Daten definiert"
    },
    "NotPossibleDownloadLayersSameGroup": {
      "cat": "No és possible descarregar dues capes del mateix grup",
      "spa": "No es posible descargar dos capas del mismo grupo",
      "eng": "It is not possible to download two layers from the same group",
      "fre": "Impossible de télécharger deux couches du même groupe",
      "cze": "Není možné stáhnout dvě vrstvy ze stejné skupiny",
      "ger": "Es ist nicht möglich, zwei Layers aus derselben Gruppe herunterzuladen"
    },
    "UnknownState": {
      "cat": "Estat no reconegut",
      "spa": "Estado no reconocido",
      "eng": "Unknown state",
      "fre": "État non reconnu",
      "cze": "Neznámý stát",
      "ger": "Unbekannter Zustand"
    }
  },
  "imgrle": {
    "UnsupportedColor": {
      "cat": "Color no suportat",
      "spa": "Color no suportado",
      "eng": "Unsupported color",
      "fre": "Couleur non supportée",
      "cze": "Nepodporovaná barva",
      "ger": "Nicht unterstützte Farbe"
    },
    "LayerSingleComponentNeedPalette": {
      "cat": "Una capa amb una sola component ha de tenir definits els colors de la paleta",
      "spa": "Una capa con una sola componente debe tener definidos los colores de la paleta",
      "eng": "A layer with a single component must define a palette of colors",
      "fre": "Une couche d'un composant unique doit avoir défini les couleurs de la palette",
      "cze": "Vrstva s jednou složkou musí definovat paletu barev",
      "ger": "Ein Layer mit einer einzigen Komponente muss eine Farbpalette definieren"
    },
    "LayerMustHave1or3Components": {
      "cat": "Una capa no pot tenir 2 components. Ha de tenir definides 1 o 3 components.",
      "spa": "Una capa no puede tener 2 componentes. Debe tener definidas 1 o 3 componentes",
      "eng": "A layer can not have 2 components. It must have defined 1 or 3 components",
      "fre": "Une couche ne peut pas avoir deux composants. Vous devez avoir défini un ou trois composants",
      "cze": "Vrstva nemůže mít 2 složky. Musí mít definovanou 1 nebo 3 složky",
      "ger": "Ein Layer kann nicht 2 Komponenten haben. Es müssen 1 oder 3 Komponenten definiert sein"
    },
    "LayerIMGNoDefinesComponents": {
      "cat": "La capa ha estat demanada com img però no hi ha components definides al estil actual.",
      "spa": "La capa ha sido solicitada como img pero no tiene componentes definidas en el estilo actual.",
      "eng": "The layer is requested as img but there are no defined components for the current style.",
      "fre": "La couche est requise comme img mais il n'y a pas de composants définis pour le style actuel.",
      "cze": "Vrstva je požadována jako img, ale pro aktuální styl nejsou definovány žádné komponenty.",
      "ger": "Der Layer wird als img angefordert, aber es sind keine Komponenten für den aktuellen Stil definiert."
    }
  },
  "miramon": {
    "NotPossibleShowLayersSameGroup": {
      "cat": "No és possible mostrar dues capes del mateix grup",
      "spa": "No es posible mostrar dos capas del mismo grupo",
      "eng": "It is not possible to show two layers from the same group",
      "fre": "Impossible de montrer deux couches du même groupe",
      "cze": "Není možné zobrazit dvě vrstvy ze stejné skupiny",
      "ger": "Es ist nicht möglich, zwei Layers aus derselben Gruppe anzuzeigen"
    },
    "alsoMemberToTheGroup": {
      "cat": "que també format part del grup",
      "spa": "que también forma parte del grupo",
      "eng": "that also is member to the group",
      "fre": "appartenant aussi au groupe",
      "cze": "která je také členem skupiny",
      "ger": "die auch Mitglied der Gruppe ist"
    },
    "willBeDeselected": {
      "cat": "serà desmarcada",
      "spa": "será desmarcada",
      "eng": "will be deselected",
      "fre": "va être désélectionnée",
      "cze": "bude zrušen výběr",
      "ger": "wird abgewählt"
    },
    "LayerTIFFIMGMustHaveValues": {
      "cat": "Una capa amb FormatImatge image/tiff o application/x-img ha de definir un array de 'valors'",
      "spa": "Una capa con FormatImatge image/tiff o application/x-img debe definir un array de 'valors'",
      "eng": "A layer with FormatImatge image/tiff or application/x-img must define an array of 'valors'",
      "fre": "Une couche avec FormatImatge image/tiff ou application/x-img doit définir un tableau de 'valeurs'",
      "cze": "Vrstva s FormatImatge image/tiff nebo application/x-img musí definovat pole 'valors'",
      "ger": "Ein Layer mit FormatImatge image/tiff oder application/x-img muss ein Array von 'valors' definieren"
    },
    "LayerBinaryArrayMustBeHTTPS": {
      "cat": "Una capa amb FormatImatge image/tiff o application/x-img ha de ser servida en https:",
      "spa": "Una capa con FormatImatge image/tiff o application/x-img debe ser servida en https:",
      "eng": "A layer with FormatImatge image/tiff or application/x-img must be provided in https:",
      "fre": "Une couche avec FormatImatge image/tiff ou application/x-img doit être fourni en https",
      "cze": "Vrstva s FormatImatge image/tiff nebo application/x-img musí být poskytnuta v https:",
      "ger": "Ein Layer mit dem FormatImatge image/tiff oder application/x-img muss in https: bereitgestellt werden"
    },
    "LayerSetToNoVisibleQueriable": {
      "cat": "La capa no es podria carregar i es declara no visible ni consultable",
      "spa": "La capa no es podría carregar por lo que declara no visible ni consultable",
      "eng": "The layer will not load so it is declared as neither visible nor queriable",
      "fre": "La couche ne se chargera pas, elle est donc déclarée comme ni visible ni interrogeable",
      "cze": "Vrstva se nenačte, takže není deklarována jako viditelná ani dotazovatelná",
      "ger": "Der Layer wird nicht geladen, daher wird sie als weder sichtbar noch abfragbar deklariert"
    },
    "ExecuteProcessWPS": {
      "cat": "Executar un proces (WPS)",
      "spa": "Ejecutar un proceso (WPS)",
      "eng": "Execute a process (WPS)",
      "fre": "Exécuter un processus (WPS)",
      "cze": "Spustit proces (WPS)",
      "ger": "Ausführen eines Prozesses (WPS)"
    },
    "AddLayerToMap": {
      "cat": "Afegir capa al mapa",
      "spa": "Añadir capa al mapa",
      "eng": "Add layer to map",
      "fre": "Ajouter une couche à la carte",
      "cze": "Přidání vrstvy do mapy",
      "ger": "Layer zur Karte hinzufügen"
    },
    "SelectionByCondition": {
      "cat": "Selecció per condicions",
      "spa": "Selección por condición",
      "eng": "Selection by condition",
      "fre": "Sélection par condition",
      "cze": "Výběr podle podmínky",
      "ger": "Auswahl nach Bedingung"
    },
    "TimeSeriesAnalysisAndAnimations": {
      "cat": "Anàlisi de sèries temporals i animacions",
      "spa": "Analisis de series temporales y animaciones",
      "eng": "Time series analysis and animations",
      "fre": "Analyse de séries chronologiques et animations",
      "cze": "Analýza časových řad a animace",
      "ger": "Zeitreihenanalyse und Animationen"
    },
    "RequestConsole": {
      "cat": "Consola de peticions",
      "spa": "Consola de peticiones",
      "eng": "Request console",
      "fre": "Console de demandes",
      "cze": "Vyžádání konzoly",
      "ger": "Konsole abfragen"
    },
    "ReclassifierLayerValues": {
      "cat": "Reclassificadora de valors de la capa",
      "spa": "Reclasificadora de valores de la capa",
      "eng": "Reclassifier of layer values",
      "fre": "Reclassificateur de valeurs de couches",
      "cze": "Reklasifikátor hodnot vrstev",
      "ger": "Reklassifizierer von Layerwerten"
    },
    "FeedbackContainingStyles": {
      "cat": "Valoracions que contenen estils",
      "spa": "Valoraciones que contienen estilos",
      "eng": "Feedback containing styles",
      "fre": "Rétroaction contenant des styles",
      "cze": "Zpětná vazba obsahující styly",
      "ger": "Feedback mit Stilen"
    },
    "OpenOrSaveContext": {
      "cat": "Obrir o desar el contexte",
      "spa": "Abrir o guardar el contexto",
      "eng": "Open or save the context",
      "cze": "Otevření nebo uložení kontextu",
      "ger": "Öffnen oder Speichern des Kontextes"
    },
    "LinksToOGCServicesBrowser": {
      "cat": "Enllaços als servidors OGC del navegador",
      "spa": "Enlaces a los servidors OGC del navegador",
      "eng": "Links to OGC services in the browser",
      "fre": "Liens aux serveurs OGC du navigateur",
      "cze": "Odkazy na služby OGC v prohlížeči",
      "ger": "Links zu OGC-Diensten im Browser"
    },
    "storyMapTitle": {
      "cat": "titol del relat",
      "spa": "título del ralato",
      "eng": "storymap title",
      "fre": "titre de l'histoire",
      "cze": "název mapy příběhu",
      "ger": "Storymap-Titel"
    },
    "InformationHelp": {
      "cat": "Informació/Ajuda",
      "spa": "Información/Ayuda",
      "eng": "Information/Help",
      "fre": "Information/Aide",
      "cze": "Informace/nápověda",
      "ger": "Informationen/Hilfe"
    },
    "InsertNewPoint": {
      "cat": "Inserir un punt nou",
      "spa": "Insertar un punto nuevo",
      "eng": "Insert new point",
      "fre": "Insérer un nouveaux point",
      "cze": "Vložení nového bodu",
      "ger": "Neuen Punkt einfügen"
    },
    "ResultOfTheTransaction": {
      "cat": "Resultat de la transacció",
      "spa": "Resulado de la transacción",
      "eng": "Result of the transaction",
      "fre": "Résultats de la transaction",
      "cze": "Výsledek transakce",
      "ger": "Ergebnis der Transaktion"
    },
    "NoPreviousView": {
      "cat": "No hi ha cap vista prèvia a recuperar",
      "spa": "No hay ninguna vista previa a recuperar",
      "eng": "There is no previous view to be shown",
      "fre": "Il n'y a pas une vue préalable à récupérer",
      "cze": "Neexistuje žádný předchozí pohled, který by se zobrazoval",
      "ger": "Es gibt keine vorherige Ansicht, die angezeigt wird"
    },
    "NoFullScreenMultiBrowser": {
      "cat": "No es possible saltar a pantalla completa en un navegador multivista",
      "spa": "No es posible saltar a pantalla completa en un navegador multivista",
      "eng": "You cannot go full screen in a multiview browser",
      "fre": "Vous ne pouvez pas accéder au plein écran dans un navigateur à vues multiples",
      "cze": "V prohlížeči s více zobrazeními nelze přejít na celou obrazovku",
      "ger": "Sie können in einem Multiview-Browser nicht zum Vollbild wechseln"
    },
    "BrowserPopUpWindowsLocked": {
      "cat": "Aquest navegador té les finestres emergents bloquejades",
      "spa": "Este navegador tiene las ventanas emergentes bloqueadas",
      "eng": "Sorry, this browser has pop-up windows locked",
      "fre": "Ce navigateur a les fenêtres émergentes fermées",
      "cze": "Omlouváme se, tento prohlížeč má uzamčená vyskakovací okna",
      "ger": "Sorry, dieser Browser hat Pop-up-Fenster gesperrt"
    },
    "ChangeBrowserConfig": {
      "cat": "Canvia la configuració del teu navegador",
      "spa": "Modifique la configuración de su navegador",
      "eng": "Please change browser configuration",
      "fre": "Changez la configuration de votre navigateur",
      "cze": "Změňte prosím konfiguraci prohlížeče",
      "ger": "Bitte ändern Sie die Browserkonfiguration"
    },
    "SomeInternetExplorerClickYellowBand": {
      "cat": "En algunes versions d'Internet Explorer, només cal fer un clic sobre la faixa groga superior",
      "spa": "En algunas versiones de Internet Explorer, un clic sobre la banda amarilla superior es suficiente",
      "eng": "In some Internet Explorer versions only a click on top yellow band will fix it",
      "fre": "Dans certaines versions d'Internet Explorer, il suffit de cliquer sur la barre jaune supérieure",
      "cze": "V některých verzích Internet Explore to opraví pouze kliknutí na horní žlutý pruh",
      "ger": "Bei einigen Internet Explorer-Versionen hilft nur ein Klick auf das obere gelbe Band"
    },
    "FinishValidation": {
      "cat": "Validació finalitzada",
      "spa": "Validación finalizada",
      "eng": "Finished validation",
      "fre": "Validation terminée",
      "cze": "Dokončeno ověřování",
      "ger": "Validierung abgeschlossen"
    },
    "MayCloseBrowser": {
      "cat": "Pots tancar el navegador",
      "spa": "Puedes cerrar el navegador",
      "eng": "You may close the browser",
      "fre": "Vous pouvez fermer le navigateur",
      "cze": "Můžete zavřít prohlížeč",
      "ger": "Sie können den Browser schließen"
    },
    "MainServerBrowser": {
      "cat": "Servidor principal d'aquest navegador",
      "spa": "Servidor principal de este navegador",
      "eng": "Main Server of this browser",
      "fre": "Serveur principal du navigateur",
      "cze": "Hlavní server tohoto prohlížeče",
      "ger": "Hauptserver dieses Browsers"
    },
    "OtherServersUsed": {
      "cat": "Altres servidors usats",
      "spa": "Otros servidores usados",
      "eng": "Others servers used",
      "fre": "Autres serveurs utilisés",
      "cze": "Ostatní používané servery",
      "ger": "Andere verwendete Server"
    },
    "ServerUrlNotDetermine": {
      "cat": "No s'han pogut determinar les adreçes dels servidors usats en aquest navegador",
      "spa": "No se han podido determinar las direcciones de los servidores usados en este navegador",
      "eng": "It could not determine the servers URL used in this browser",
      "fre": "Impossible de déterminer les adresses des serveurs utilisés avec ce navigateur",
      "cze": "Nepodařilo se určit adresu URL serverů použitou v tomto prohlížeči",
      "ger": "Es konnte nicht ermittelt werden, welche Server URL in diesem Browser verwendet wird"
    },
    "OWSContextDocument": {
      "cat": "Document de context OWS",
      "spa": "Documento de contexto OWS",
      "eng": "OWS context document",
      "fre": "Document de contexte OWS",
      "cze": "Kontextový dokument OWS",
      "ger": "OWS-Kontext-Dokument"
    },
    "LinkToView": {
      "cat": "Enllaç a aquesta vista",
      "spa": "Enlace a esta vista",
      "eng": "Link to this view",
      "fre": "Lien à cette vue",
      "cze": "Odkaz na toto zobrazení",
      "ger": "Link zu dieser Ansicht"
    },
    "NoMoreZoomOut": {
      "cat": "No hi ha zoom inferior a mostrar",
      "spa": "No hay zoom inferior a mostrar",
      "eng": "There is no more zoom out to be shown",
      "fre": "Il n'y a pas un zoom inférieur à montrer",
      "cze": "Není možné zobrazit další zvětšení",
      "ger": "Es kann nicht weiter verkleinert werden"
    },
    "NoMoreZoomIn": {
      "cat": "No hi ha zoom superior a mostrar",
      "spa": "No hay zoom superior a mostrar",
      "eng": "There is no more zoom in to be shown",
      "fre": "Il n'y a pas un zoom supérieur à montrer",
      "cze": "Již není možné zobrazit žádné další přiblížení",
      "ger": "Es kann nicht weiter vergrößert werden"
    },
    "timeSeries": {
      "cat": "de sèries temporals",
      "spa": "de series temporales",
      "eng": "of time series",
      "fre": "pour séries chronologiques",
      "cze": "časové řady",
      "ger": "der Zeitreihe"
    },
    "BinaryPayloadNotFound": {
      "cat": "No trobo BinaryPayload a la resposta GetTile en SOAP",
      "spa": "No encuentro BinaryPayload la respuesta GetTile en SOAP",
      "eng": "BinaryPayload cannot be found on GetTile SOAP answer",
      "fre": "Impossible trouver BinaryPayload à la réponse GetTile à SOAP",
      "cze": "BinaryPayload nelze nalézt v odpovědi GetTile SOAP",
      "ger": "BinaryPayload kann in der GetTile SOAP-Antwort nicht gefunden werden"
    },
    "FormatNotFound": {
      "cat": "No trobo Format a la resposta GetTile en SOAP",
      "spa": "No encuentro Format en la respuesta GetTile en SOAP",
      "eng": "Format cannot be found on GetTile SOAP answer",
      "fre": "Impossible trouver Format à la réponse GetTile à SOAP",
      "cze": "V odpovědi GetTile SOAP nelze nalézt formát",
      "ger": "Format kann in der GetTile SOAP-Antwort nicht gefunden werden"
    },
    "BinaryPayloadAndPayloadContentNotFound": {
      "cat": "No trobo BinaryContent ni PayloadContent a la resposta GetTile en SOAP",
      "spa": "No encuentro BinaryContent ni PayloadContent en la respuesta GetTile en SOAP",
      "eng": "BinaryPayload and PayloadContent cannot be found on GetTile SOAP answer",
      "fre": "Impossible trouver BinaryPayload ou PayloadContent à la réponse GetTile à SOAP",
      "cze": "BinaryPayload a PayloadContent nelze v GetTile nalézt Odpověď SOAP",
      "ger": "BinaryPayload und PayloadContent können in der GetTile SOAP-Antwort nicht gefunden werden"
    },
    "ShowLegend": {
      "cat": "Mostra llegenda",
      "spa": "Muestra legenda",
      "eng": "Show legend",
      "fre": "Afficher la légende",
      "cze": "Zobrazit legendu",
      "ger": "Legende anzeigen"
    },
    "ShowSituationMap": {
      "cat": "Mostra mapa de situació",
      "spa": "Muestra mapa de situación",
      "eng": "Show situation map",
      "fre": "Afficher la carte de situation",
      "cze": "Zobrazit situační mapu",
      "ger": "Lageplan anzeigen"
    },
    "ShowInfoCurrentPosition": {
      "cat": "Mostra informació de la posició",
      "spa": "Muestra información sobre la posición",
      "eng": "Show information about current position",
      "fre": "Afficher des informations sur la position actuelle",
      "cze": "Zobrazit informace o aktuální poloze",
      "ger": "Informationen zur aktuellen Position anzeigen"
    },
    "moveNorthWest": {
      "cat": "mou al Nord-Oest",
      "spa": "mover al NorOeste",
      "eng": "move to North-West",
      "fre": "déplacer vers le Nord-Ouest",
      "cze": "přesunout na severozápad",
      "ger": "nach Nord-West verschieben"
    },
    "moveNorth": {
      "cat": "mou al Nord",
      "spa": "mover al Norte",
      "eng": "move to North",
      "fre": "déplacer vers le Nord",
      "cze": "přesunout na sever",
      "ger": "nach Norden verschieben"
    },
    "moveNorthEast": {
      "cat": "mou al Nord-Est",
      "spa": "mover al Noreste",
      "eng": "move to North-East",
      "fre": "déplacer vers le Nord-Est",
      "cze": "přesunout na severovýchod",
      "ger": "nach Nord-Ost verschieben"
    },
    "moveWest": {
      "cat": "mou a l'Oest",
      "spa": "mover al Oeste",
      "eng": "move to West",
      "fre": "déplacer vers l'Ouest",
      "cze": "přesunout na západ",
      "ger": "nach Westen verschieben"
    },
    "moveEast": {
      "cat": "mou a l'Est",
      "spa": "mover al Este",
      "eng": "move to East",
      "fre": "déplacer vers l'Est",
      "cze": "přesunout na východ",
      "ger": "nach Osten verschieben"
    },
    "moveSouthWest": {
      "cat": "mou al Sud-Oest",
      "spa": "mover al Suroeste",
      "eng": "move to South-West",
      "fre": "déplacer vers le Sud-Ouest",
      "cze": "přesunout na jihozápad",
      "ger": "nach Süd-West verschieben"
    },
    "moveSouth": {
      "cat": "mou al Sud",
      "spa": "mover al Sur",
      "eng": "move to South",
      "fre": "déplacer vers le Sud",
      "cze": "přesunout na jih",
      "ger": "nach Süden verschieben"
    },
    "moveSouthEast": {
      "cat": "mou al Sud-Est",
      "spa": "mover al Sureste",
      "eng": "move to South-East",
      "fre": "déplacer vers le Sud-Est",
      "cze": "přesunout na jihovýchod",
      "ger": "nach Süd-Ost verschieben"
    },
    "IncreaseZoomLevel": {
      "cat": "augmenta 1 nivell de zoom",
      "spa": "augmenta 1 nivel de zoom",
      "eng": "increase 1 zoom level",
      "fre": "augmenter 1 niveau de zoom",
      "cze": "zvýšit úroveň přiblížení o 1",
      "ger": "1 Zoomstufe erhöhen"
    },
    "ReduceZoomLevel": {
      "cat": "redueix 1 nivell de zoom",
      "spa": "reduce 1 nivel de zoom",
      "eng": "reduce 1 zoom level",
      "fre": "réduire 1 niveau de zoom",
      "cze": "snížit o 1 úroveň přiblížení",
      "ger": "1 Zoomstufe verringern"
    },
    "exitFullScreen": {
      "cat": "sortir de pantalla completa",
      "spa": "salir de pantalla completa",
      "eng": "exit full screen",
      "fre": "Quitter le mode plein écran",
      "cze": "ukončit celou obrazovku",
      "ger": "Vollbild verlassen"
    },
    "fullScreen": {
      "cat": "pantalla completa",
      "spa": "pantalla completa",
      "eng": "full screen",
      "fre": "plein écran",
      "cze": "na celou obrazovku",
      "ger": "Vollbild"
    },
    "StyleNumberNotNumberLayers": {
      "cat": "El nombre d'estils no es correspon amb el nombre de capes",
      "spa": "El número de estilos no se corresponde con el número de capas",
      "eng": "Style number is not the same of the number of layers",
      "fre": "Le nombre de styles ne correspond pas au nombre de couches",
      "cze": "Číslo stylu není stejné jako počet vrstev",
      "ger": "Stilnummer ist nicht gleich der Anzahl der Layers"
    },
    "CannotFindServerToResponse": {
      "cat": "No s'ha trobat el paràmetre 'SERVERTORESPONSE'",
      "spa": "No se ha encontrado el parámetro 'SERVERTORESPONSE'",
      "eng": "Cannot find the 'SERVERTORESPONSE' parameter",
      "fre": "Le paramètre 'SERVERTORESPONSE' n'a pas été trouvé",
      "cze": "Nelze najít parametr 'SERVERTORESPONSE'",
      "ger": "Der Parameter 'SERVERTORESPONSE' kann nicht gefunden werden"
    },
    "CannotFindTestLayers": {
      "cat": "No s'ha trobat el paràmetre 'TEST_LAYERS'",
      "spa": "No se ha encontrado el parámetro 'TEST_LAYERS'",
      "eng": "Cannot find the 'TEST_LAYERS' parameter",
      "fre": "Le paramètre 'TEST_LAYERS' n'a pas été trouvé",
      "cze": "Nelze najít parametr 'TEST_LAYERS'",
      "ger": "Der Parameter 'TEST_LAYERS' kann nicht gefunden werden"
    },
    "CannotFindTestFields": {
      "cat": "No s'ha trobat el paràmetre 'TEST_FIELDS'",
      "spa": "No se ha encontrado el parámetro 'TEST_FIELDS'",
      "eng": "Cannot find the 'TEST_FIELDS'  parameter",
      "fre": "Le paramètre 'TEST_FIELDS' n'a pas été trouvé",
      "cze": "Nelze najít parametr 'TEST_FIELDS'",
      "ger": "Der Parameter 'TEST_FIELDS' kann nicht gefunden werden"
    },
    "FieldNumberNotNumberLayers": {
      "cat": "El nombre de camps no es correspon amb el nombre de capes",
      "spa": "El número de campos no se corresponde con el número de capas",
      "eng": "Field number is not the same of the number of layers",
      "fre": "Le nombre de champs ne correspond pas au nombre de couches",
      "cze": "Číslo pole není stejné jako počet vrstev",
      "ger": "Die Anzahl der Felder ist nicht gleich der Anzahl der Layers"
    },
    "ValuesNumberNotNumberLayers": {
      "cat": "El nombre de valors no es correspon amb el nombre de capes",
      "spa": "El número de valores no se corresponde con el número de capas",
      "eng": "Field values number is not the same of the number of layers",
      "fre": "Le nombre de valeurs ne correspond pas au nombre de couches",
      "cze": "Počet hodnot pole není stejný jako počet vrstev",
      "ger": "Die Anzahl der Feldwerte stimmt nicht mit der Anzahl der Layers überein"
    },
    "indicatedTestLayerNotExist": {
      "cat": " indicada al paràmetre TEST_LAYERS no existeix",
      "spa": " indicada en el parámetro TEST_LAYERS no existe",
      "eng": "indicated in TEST_LAYERS parameter does not exist",
      "fre": "indiquée au paramètre TEST_LAYERS n'existe pas",
      "cze": "parametr TEST_LAYERS neexistuje",
      "ger": "Der im Parameter TEST_LAYERS angegebene Wert existiert nicht"
    },
    "RequestedPoint": {
      "cat": "El punt sol·licitat",
      "spa": "El punto solicitado",
      "eng": "The requested point",
      "fre": "Le point requis",
      "cze": "Požadovaný bod",
      "ger": "Der angeforderte Punkt"
    },
    "isOutsideBrowserEnvelope": {
      "cat": "està fora de l'àmbit de navegació",
      "spa": "está fuera del ámbito de navegación",
      "eng": "is outside browser envelope",
      "fre": "se trouve dehors le milieu de navigation",
      "cze": "je mimo obálku prohlížeče",
      "ger": "liegt außerhalb der Browser-Hülle"
    },
    "CannotFindXYParameters": {
      "cat": "No s'ha trobat els paràmetres 'X' i 'Y'.",
      "spa": "No se ha encontrado los parámetro 'X' y 'Y'.",
      "eng": "Cannot find 'X' and 'Y' parameters.",
      "fre": "Les paramètres 'X' et 'Y' n'ont pas été trouvés.",
      "cze": "Nelze najít parametry 'X' a 'Y'.",
      "ger": "Die Parameter 'X' und 'Y' wurden nicht gefunden."
    },
    "TheVersion": {
      "cat": "La versió de",
      "spa": "La versión de",
      "eng": "The version of",
      "fre": "La version",
      "cze": "Verze",
      "ger": "Die Version von"
    },
    "notMatchVersion": {
      "cat": "no es correspon amb la versió de",
      "spa": "no se corresponde con la versión de",
      "eng": "it does not match with the version of",
      "fre": "ne correspond pas à la version de",
      "cze": "není v souladu s verzí",
      "ger": "stimmt nicht überein mit der Version von"
    },
    "UpgradeCorrectly": {
      "cat": "Actualitza't correctament",
      "spa": "Actualicese correctamente",
      "eng": "Please, upgrade it correctly",
      "fre": "S'il vous plaît, actualisez vous correctement",
      "cze": "Prosím, aktualizujte jej správně",
      "ger": "Bitte aktualisieren Sie sie korrekt"
    },
    "ServerHasNewConfMap": {
      "cat": "El servidor incorpora una configuració del mapa més nova",
      "spa": "El servidor incorpora una configuración del mapa más nueva",
      "eng": "The server has a newer configuration for the map",
      "fre": "Le serveur intègre une configuration de carte plus récente",
      "cze": "Server má novější konfiguraci mapy",
      "ger": "Der Server hat eine neuere Konfiguration für die Karte"
    },
    "AcceptToAdopt": {
      "cat": "Acceptes adoptar-la?",
      "spa": "¿Acepta adoptarla?",
      "eng": "Do you accept to adopt it?",
      "fre": "Acceptez-vous de l'adopter?",
      "cze": "Souhlasíte s jejím přijetím?",
      "ger": "Wollen Sie diese übernehmen?"
    },
    "SavingStatusMapNotPossible": {
      "cat": "No serà possible guardar l'estat del mapa",
      "spa": "No será posible guardar el estado del mapa",
      "eng": "Saving the status of the map will not be possible",
      "fre": "Il ne sera pas possible de sauvegarder le statut de la carte",
      "cze": "Uložení stavu mapy není možné",
      "ger": "Speichern des Status der Karte nicht möglich"
    },
    "CapaDigiNoLongerSupported": {
      "cat": "CapaDigi ja no se suporta",
      "spa": "CapaDigi ya no se soporta",
      "eng": "CapaDigi no longer supported",
      "fre": "CapaDigi n'est plus pris en charge",
      "cze": "CapaDigi již není podporováno",
      "ger": "CapaDigi wird nicht mehr unterstützt"
    },
    "UseLayerModelInstead": {
      "cat": "seu una \"capa\" amb \"model\": \"vector\"",
      "spa": "Use una \"capa\" con \"model\": \"vector\"",
      "eng": "Use a \"capa\" with \"model\": \"vector\" instead",
      "fre": "Utilisez un \"capa\" avec le \"model\": \"vector\"",
      "cze": "Použijte \"capa\" s \"model\": místo toho použijte \"vector\"",
      "ger": "Verwenden Sie stattdessen eine \"capa\" mit \"model\": \"vector\""
    },
    "ValueIgnoredAttributeShowable": {
      "cat": "El valor serà ignorat i l'atribut marcat com a mostrable",
      "spa": "El valor será ignorado y el atributo marcado como mostrable",
      "eng": "The value will be ignored and the attribute marked as showable",
      "fre": "La valeur sera ignorée et l'attribut marqué comme affichable",
      "cze": "Hodnota bude ignorována a atribut bude označen jako zobrazitelný",
      "ger": "Der Wert wird ignoriert und das Attribut als anzeigbar markiert"
    },
    "ZoomSizesSortedBiggerFirst": {
      "cat": "Els costats de zoom han d'estat ordenats amb el més gran primer",
      "spa": "Los lados de zoom deben estar ordenados con el más grande primero",
      "eng": "The zoom sizes must be sorted with the bigger first",
      "fre": "Les tailles de zoom doivent être triées par ordre croissant",
      "cze": "Velikosti zvětšení musí být seřazeny tak, aby první byla větší",
      "ger": "Die Zoom-Größen müssen mit den größeren zuerst sortiert werden"
    },
    "NivellZoomCostatNotIndicated": {
      "cat": "El NivellZoomCostat no és cap del costats indicats a la llista de zooms",
      "spa": "El NivellZoomCostat no es ninguno de los 'costat' indicados en la lista de zooms",
      "eng": "The NivellZoomCostat is not one of the indicated 'costat' in the zoom array",
      "fre": "Le NivellZoomCostat n'est pas l'un des 'costat' indiqués dans la matrice de zoom",
      "cze": "NivellZoomCostat není jednou z uvedených 'costat' v poli zvětšení",
      "ger": "Der NivellZoomCostat ist nicht einer der angegebenen 'costat' im Zoom-Array"
    },
    "NotFindBBox": {
      "cat": "No trobo les 4 coordenades a BBOX",
      "spa": "No encuentro las 4 coordenadas en BBOX",
      "eng": "Cannot find 4 coordinates at BBOX",
      "fre": "Impossible de trouver les 4 coordonnées à BBOX",
      "cze": "Nelze najít 4 souřadnice v BBOX",
      "ger": "Es konnten keine 4 Koordinaten bei BBOX gefunden werden"
    },
    "IndicatedQueryLayers": {
      "cat": "indicada a QUERY_LAYERS",
      "spa": "indicada en QUERY_LAYERS",
      "eng": "indicated at QUERY_LAYERS",
      "fre": "indiquée à QUERY_LAYERS",
      "cze": "uvedené v QUERY_LAYERS",
      "ger": "angegeben bei QUERY_LAYERS"
    },
    "butTransparenciaDoesNotAllowIt": {
      "cat": "però capa.transparencia no permet semitrasparència",
      "spa": "pero capa.transparencia no permite semitrasparencia",
      "eng": "but capa.transparencia does not allow semitransparency",
      "fre": "mais capa.transparencia n'autorise pas la semi-transparence",
      "cze": "ale capa.transparencia neumožňuje semitransparentnost",
      "ger": "aber capa.transparencia erlaubt keine Semitransparenz"
    },
    "andIsInsteadSetTo": {
      "cat": "i en canvi està definit com a",
      "spa": "y en cambio está definido como",
      "eng": "and is instead set to",
      "fre": "et est à la place définie sur",
      "cze": "a místo toho je nastavena na hodnotu",
      "ger": "und ist stattdessen gesetzt auf"
    },
    "andIsInsteadSetOtherwise": {
      "cat": "i en canvi està definida d'una altra manera",
      "spa": "y en cambio está definido de otra manera",
      "eng": "and is set otherwise",
      "fre": "et est définie autrement",
      "cze": "a jinak je nastavena",
      "ger": "und ist sonst gesetzt auf"
    },
    "TitolLlistatNivellZoom": {
      "cat": "Escala",
      "spa": "Escala",
      "eng": "Scale",
      "fre": "Échelle",
      "cze": "Měřítko",
      "ger": "Maßstab"
    }
  },
  "authens": {
    "Login": {
      "cat": "Iniciar sessió",
      "spa": "Iniciar sesión",
      "eng": "Login",
      "fre": "Se connecter",
      "cze": "Přihlášení",
      "ger": "Anmeldung"
    },
    "LoginAccountFailed": {
      "cat": "Error o cancel·lació de la identificació amb el compte de",
      "spa": "Error o cancelación de la identificación en la cuenta de",
      "eng": "Login in your account failed or cancelled in",
      "fre": "La connexion à votre compte a échoué ou a été annulée dans",
      "cze": "Přihlášení k účtu se nezdařilo nebo bylo zrušeno v",
      "ger": "Anmeldung in Ihrem Konto fehlgeschlagen oder abgebrochen in"
    },
    "ContinueWithoutAuthentication": {
      "cat": "Vols continuar sense autentificació",
      "spa": "Desea continuar sin autentificación",
      "eng": "Do you want to continue without authentication",
      "fre": "Faites-vous quoi continuer sans authentification",
      "cze": "Chcete pokračovat bez ověření",
      "ger": "Möchten Sie ohne Authentifizierung fortfahren"
    },
    "SessionsAlreadyStarted": {
      "cat": "Les sessions han estat ja iniciades",
      "spa": "Las sesiones han sido ya iniciadas",
      "eng": "The sessions were already started",
      "fre": "Les séances étaient déjà commencées",
      "cze": "Relace již byly zahájeny",
      "ger": "Die Sitzungen wurden bereits gestartet"
    },
    "CloseTheStartedSessions": {
      "cat": "Vols tancar les sessions iniciades?",
      "spa": "¿Desea cerrar las sesiones iniciadas?",
      "eng": "Do you want to close the started sessions?",
      "fre": "Voulez-vous fermer les sessions ouvertes?",
      "cze": "Chcete ukončit zahájené relace?",
      "ger": "Möchten Sie die gestarteten Sitzungen schließen?"
    },
    "BrowserContainsLayersRequireLogin": {
      "cat": "Aquest navegador conté capes que requereixen inici de sessió",
      "spa": "Este navegador contiene capas que requieren inicio de sesión",
      "eng": "This browser contains layers that require login",
      "fre": "Ce navigateur contient des couches qui nécessitent une connexion",
      "cze": "Tento prohlížeč obsahuje vrstvy, které vyžadují přihlášení",
      "ger": "Dieser Browser enthält Layers, die eine Anmeldung erfordern"
    },
    "DoYouWantToLogInNow": {
      "cat": "Vols iniciar sessió ara?",
      "spa": "¿Desea iniciar sesión ahora?",
      "eng": "Do you want to log in now?",
      "fre": "Voulez-vous vous connecter maintenant?",
      "cze": "Chcete se nyní přihlásit?",
      "ger": "Möchten Sie sich jetzt anmelden?"
    }
  },
  "llinatge": {
    "Process": {
      "cat": "Procés",
      "spa": "Proceso",
      "eng": "Process",
      "fre": "Processus",
      "cze": "Proces",
      "ger": "Prozess"
    },
    "Processes": {
      "cat": "Processos",
      "spa": "Procesos",
      "eng": "Processes",
      "fre": "Processus",
      "cze": "Procesy",
      "ger": "Prozesse"
    },
    "ProcessGroup": {
      "cat": "Grup de processos",
      "spa": "Grupo de procesos",
      "eng": "Process group",
      "fre": "Groupe de processus",
      "cze": "Skupina procesů",
      "ger": "Prozessgruppe"
    },
    "ResultingDataset": {
      "cat": "Capa Resultat",
      "spa": "Capa Resultado",
      "eng": "Resulting dataset",
      "fre": "Jeu de données résultant",
      "cze": "Výsledný soubor dat",
      "ger": "Resultierender Datensatz"
    },
    "GroupWithFollowing": {
      "cat": "Agrupar amb el seguënt",
      "spa": "Agrupar con el seguiente",
      "eng": "Group with the following",
      "fre": "Grouper avec le suivant",
      "cze": "Skupina s následujícími údaji",
      "ger": "Gruppieren mit der folgenden"
    },
    "GroupWithPrevious": {
      "cat": "Agrupar amb l'anterior",
      "spa": "Agrupar con el anterior",
      "eng": "Group with the previous",
      "fre": "Grouper avec le précédent",
      "cze": "Skupina s předchozím",
      "ger": "Gruppieren mit der vorherigen"
    },
    "UngroupRecentLevel": {
      "cat": "Desagrupa un nivell més recent",
      "spa": "Desagrupar un nivel más reciente",
      "eng": "Ungroup a more recent level",
      "fre": "Dissocier un niveau plus récent",
      "cze": "Odskupení s novější úrovní",
      "ger": "Aufhebung der Gruppierung eines neueren Layers"
    },
    "UngroupOlderLevel": {
      "cat": "Desagrupa un nivell més antic",
      "spa": "Desagrupar un nivel más antiguo",
      "eng": "Ungroup an older level",
      "fre": "Dissocier un niveau plus ancien",
      "cze": "Odskupení starší úrovně",
      "ger": "Auflösen eines älteren Layers"
    },
    "VisibleElements": {
      "cat": "Elements visibles",
      "spa": "Elementos visibles",
      "eng": "Visible elements",
      "fre": "Éléments visibles",
      "cze": "Viditelné prvky",
      "ger": "Sichtbare Elemente"
    },
    "InternalSources": {
      "cat": "Fonts intermitges/temporals",
      "spa": "Fuentes intermedias/temporales",
      "eng": "Internal/temporary sources",
      "fre": "Sources intermédiaires/temporaires",
      "cze": "Interní/dočasné zdroje",
      "ger": "Interne/temporäre Quellen"
    },
    "LeafSources": {
      "cat": "Fonts fulles",
      "spa": "Fuentes hoja",
      "eng": "Leaf sources",
      "fre": "Sources feuilles",
      "cze": "Listové zdroje",
      "ger": "Blatt-Quellen"
    },
    "ProcessSteps": {
      "cat": "Passos del procés",
      "spa": "Pasos del proceso",
      "eng": "Process steps",
      "fre": "Étapes du processus",
      "cze": "Kroky procesu",
      "ger": "Verarbeitungsschritte"
    },
    "ProcessingTools": {
      "cat": "Eines de processament",
      "spa": "Herramientas de procesamiento",
      "eng": "Processing tools",
      "fre": "Outils de traitement",
      "cze": "Zpracovatelské nástroje",
      "ger": "Verarbeitungswerkzeuge"
    },
    "TheUnion": {
      "cat": "La unió",
      "spa": "La unión",
      "eng": "The union",
      "fre": "L'union",
      "cze": "Svaz",
      "ger": "Die Vereinigung"
    },
    "DatasetsIndependentsGraphs": {
      "cat": "Cada capa en un gràfic independent",
      "spa": "Cada capa en un gráfico independiente",
      "eng": "Datasets as independents graphs",
      "fre": "Chaque couche sur un graphique séparé",
      "cze": "Datové sady jako nezávislé grafy",
      "ger": "Datensätze als unabhängige Graphen"
    },
    "TheIntersection": {
      "cat": "La intersecció",
      "spa": "La intersección",
      "eng": "The intersection",
      "fre": "l'intersection",
      "cze": "Průnik",
      "ger": "Der Schnittpunkt"
    },
    "TheComplementIntersection": {
      "cat": "El complement de la intersecció",
      "spa": "El complemento de la intersección",
      "eng": "The complement of the intersection",
      "fre": "Le complément de l'intersection",
      "cze": "Doplněk průniku",
      "ger": "Die Ergänzung des Schnittpunktes"
    },
    "TheSubtractionFirst": {
      "cat": "La resta de la primera",
      "spa": "La resta del primero",
      "eng": "The subtraction of the first",
      "fre": "La soustraction de la première",
      "cze": "Dílčí průnik prvního",
      "ger": "Die Subtraktion des ersten"
    },
    "MoreOneDataset": {
      "cat": "Quan hi ha més d'una capa",
      "spa": "Cuando hay más de una capa",
      "eng": "When more than one dataset",
      "fre": "Quand il y a plus d'une couche",
      "cze": "Když je více než jedna datová sada",
      "ger": "Bei mehr als einem Datensatz"
    },
    "SimpleQuery": {
      "cat": "Consulta simple",
      "spa": "Consulta simple",
      "eng": "Simple query",
      "fre": "Requête simple",
      "cze": "Jednoduchý dotaz",
      "ger": "Einfache Abfrage"
    },
    "StartNode": {
      "cat": "Node inicial",
      "spa": "Nodo inicial",
      "eng": "Start node",
      "fre": "Noeud initial",
      "cze": "Počáteční uzel",
      "ger": "Startknoten"
    },
    "EndNode": {
      "cat": "Node final",
      "spa": "Nodo final",
      "eng": "End node",
      "fre": "Noeud finale",
      "cze": "Koncový uzel",
      "ger": "Endknoten"
    },
    "ComplexQuery": {
      "cat": "Consulta complexa",
      "spa": "Consulta compleja",
      "eng": "Complex query",
      "fre": "Requête complexe",
      "cze": "Komplexní dotaz",
      "ger": "Komplexe Abfrage"
    },
    "QueryFilterOptions": {
      "cat": "Opcions de visualització, consulta i filtre",
      "spa": "Opciones de visualización, consulta y filtro",
      "eng": "Show, query and filter options",
      "fre": "Options de visualisation, consultations et filtrage",
      "cze": "Možnosti zobrazení, dotazování a filtrování",
      "ger": "Anzeige-, Abfrage- und Filteroptionen"
    }
  },
  "owsc": {
    "EmptyGeospatialContent": {
      "cat": "Aquesta entrada no té cap contingut geoespacial (cap etiqueta 'offering' definida)",
      "spa": "Esta entrada carece de contenido geoespacial (ninguna etiqueta 'offering' definida)",
      "eng": "This entry is empty of geospatial content (no 'offering' tag defined)",
      "fre": "Cette entrée manque du contenu géospatial (aucune étiquette 'offering' définie)",
      "cze": "Tento záznam neobsahuje geoprostorový obsah (není definován tag 'offering')",
      "ger": "Dieser Eintrag ist leer von geographischem Inhalt (kein 'offering'-Tag definiert)"
    },
    "NonComptibleCRS": {
      "cat": "Sistema de referència de coordenades no compatible.",
      "spa": "Sistema de referencia de coordenadas no compatible.",
      "eng": "Non-compatible Coordinate Reference System.",
      "fre": "Système de référence de coordonnées non compatible.",
      "cze": "Nekompatibilní souřadnicový referenční systém.",
      "ger": "Nicht kompatibles Koordinatenreferenzsystem."
    },
    "FormatWhereNotHaveEnvelope": {
      "cat": "El format de 'where' no inclou cap 'Envelope' o 'Polygon' de 2 o més punts",
      "spa": "El formato de 'where' no incluye ningún 'Envelope' o 'Polygon' de 2 o más puntos",
      "eng": "The format of 'where' do not have any 'Envelope' or 'Polygon' of 2 or more points",
      "fre": "Le format de 'where' n'inclut pas de 'Envelope' ou ' Polygon ' de 2 ou plus de points",
      "cze": "Formát 'where' nemá žádný 'Envelope' nebo 'Polygon' 2 nebo více bod",
      "ger": "Das Format von 'wo' hat keine 'Hülle' oder 'Polygon' von 2 oder mehr Punkten"
    },
    "NonSupportedOperation": {
      "cat": "'Operation' no acceptada",
      "spa": "'Operation' no soportada",
      "eng": "Non supported operation",
      "fre": "'Operation' non supportée",
      "cze": "Nepodporovaná 'Operation'",
      "ger": "Nicht unterstützte 'Operation'"
    },
    "NonSupportedOperationMethod": {
      "cat": "Métode d'operació",
      "spa": "Método de operación",
      "eng": "Non supported operation method",
      "fre": "Méthode d'opération",
      "cze": "Nepodporovaná operační metoda",
      "ger": "Nicht unterstützte Operationsmethode"
    },
    "OnlyGetSupported": {
      "cat": "no acceptat (només 'GET' és acceptat actualment)",
      "spa": "no aceptado (sólo 'GET' es soportado actualmente)",
      "eng": "(only 'GET' is currently supported)",
      "fre": "non acceptée (seulement 'GET' est actuellement supportée)",
      "cze": "(v současné době je podporována pouze operace 'GET')",
      "ger": "(nur GET wird derzeit unterstützt)"
    },
    "AttributeHrefNotFound": {
      "cat": "L'atribut 'href' no s'ha trobat en l'operació",
      "spa": "El atributo 'href' no se encontró en la operación",
      "eng": "Attribute 'href' was not found in the operation",
      "fre": "L'attribut 'href' n'a pas été trouvé dans l'opération",
      "cze": "V operaci nebyl nalezen atribut 'href'",
      "ger": "Das Attribut 'href' wurde in der Operation nicht gefunden"
    },
    "requestUrlCannotObtained": {
      "cat": "la 'requestURL' no es pot obtenir",
      "spa": "la 'requestURL' no se puede obtener",
      "eng": "the 'requestURL' cannot be obtained",
      "fre": "le 'requestURL' ne peut pas être obtenu",
      "cze": "nelze získat 'requestURL'",
      "ger": "die 'requestURL' kann nicht ermittelt werden"
    },
    "MissingMandatoryCodeAttribute": {
      "cat": "Falta l'atribut obligatori 'code' en l' 'offering' de",
      "spa": "Falta el atributo obligatorio 'code' en el 'offering' de",
      "eng": "Missing mandatory 'code' attribute on offering",
      "fre": "Manque l'attribut obligatoire 'code' sur l' 'offereing' de",
      "cze": "Chybí povinný atribut 'code' při nabízení",
      "ger": "Fehlendes obligatorisches Attribut 'code' für das Angebot"
    },
    "NonSupportedOfferingType": {
      "cat": "Tipus d''offering' no acceptat",
      "spa": "Tipo de 'offering' no soportado",
      "eng": "Non supported offering type",
      "fre": "Type d' 'offering' non supporté",
      "cze": "Nepodporovaný typ 'offering'",
      "ger": "Nicht unterstützter 'offering'"
    },
    "OwsContextDocumentNotHaveFeed": {
      "cat": "El document de context OWS no té \"feed\" com a node arrel.",
      "spa": "El documento de contexto OWS no tiene \"feed\" como nodo raiz.",
      "eng": "The OWS context document does not have \"feed\" as a root node.",
      "fre": "Le document de context OWS n'a pas \"feed\" comme un noeud racine.",
      "cze": "Kontextový dokument OWS nemá jako kořenový uzel \"feed\"",
      "ger": "Das OWS-Kontextdokument hat \"feed\" nicht als Wurzelknoten."
    },
    "DisabledLayersCannotOpened": {
      "cat": "Les capes inactives no es poden obrir (moure el punter per sobre del nom mostrarà una descripció del motiu)",
      "spa": "Las capas inactivas no se pueden abrir (mover el puntero por encima del nombre mostrará una descripción del motivo)",
      "eng": "Disabled layers cannot be opened (move the cursor over the layer name will show a description of the reason)",
      "fre": "Les couches inactives ne peuvent pas être ouvertes (mouvoir le pointeur sur le nom montrera une description du motif)",
      "cze": "Zakázané vrstvy nelze otevřít (po najetí kurzorem na název vrstvy se zobrazí popis důvodu)",
      "ger": "Deaktivierte Layers können nicht geöffnet werden (bewegen Sie den Cursor über den Layernamen, um eine Beschreibung des Grundes zu erhalten)"
    },
    "OwscDocumentNotStandardCompliant": {
      "cat": "El teu document OWSC no serà compatible amb l'estàndard ja que no has proporcionat un títol vàlid",
      "spa": "Su documento OWSC no será compatible con el estándar ya que no ha proporcionado un título válido",
      "eng": "Your OWSC document will not be standard compliant as you have not provided a valid title",
      "fre": "Votre document OWSC ne sera pas conforme avec le norme car vous n'avez pas fourni un titre valable",
      "cze": "Váš dokument OWSC nebude v souladu se standardem, protože jste neuvedli platný název",
      "ger": "Ihr OWSC-Dokument ist nicht standardkonform, da Sie keinen gültigen Titel angegeben haben"
    },
    "DownloadOwscDocument": {
      "cat": "Descarrega document OWSC",
      "spa": "Descarga documento OWSC",
      "eng": "Download OWSC document",
      "fre": "Téléchargez document OWSC",
      "cze": "Stáhněte si dokument OWSC",
      "ger": "OWSC-Dokument herunterladen"
    },
    "LanguageWhichDocumentingOws": {
      "cat": "Llengua en què s'està documentant aquest arxiu OWS Context",
      "spa": "Idioma en el que se está documentando este archivo OWS Context",
      "eng": "Language at which you are documenting this OWS Context file",
      "fre": "La langue à lequel vous documentez ce fichier de Contexte OWS",
      "cze": "Jazyk, ve kterém dokumentujete tento OWS Kontextový soubor",
      "ger": "Sprache, in der Sie diese OWS-Kontextdatei dokumentieren"
    },
    "TitleContextDocument": {
      "cat": "Un títol per al document de context",
      "spa": "Un título para el documento de contexto",
      "eng": "A title for the Context document",
      "fre": "Un titre pour le document de context",
      "cze": "Název kontextového dokumentu",
      "ger": "Ein Titel für das Kontextdokument"
    },
    "DescriptionContextDocumentContent": {
      "cat": "Descripció de la finalitat o el contingut del document de context",
      "spa": "Descripción de la finalidad o el contenido del documento de contexto",
      "eng": "Description of the Context document purpose or content",
      "fre": "Description du but ou du contenu du document de context",
      "cze": "Popis účelu nebo obsahu kontextového dokumentu",
      "ger": "Beschreibung des Zwecks oder Inhalts des Kontextdokuments"
    },
    "EntityResponsibleMakingContextDoc": {
      "cat": "Una entitat directament responsable de crear el document de context (en general tu o la teva organització)",
      "spa": "Una entidad directamente responsable de crear el documento de contexto (por lo general usted o su organización)",
      "eng": "An entity primarily responsible for making the Context Document (usually you or your organisation)",
      "fre": "Une entité principalement responsable de faire le document de contexte (d'habitude vous ou votre organisation)",
      "cze": "Subjekt primárně odpovědný za vytvoření kontextového dokumentu (obvykle vy nebo vaše organizace)",
      "ger": "Eine Instanz, die primär für die Erstellung des Kontextdokuments verantwortlich ist (normalerweise Sie oder Ihre Organisation)"
    },
    "IdentifiePublisherContextDoc": {
      "cat": "Identificador de l'editor del document de context",
      "spa": "Identificador del editor del documento de contexto",
      "eng": "Identifier for the publisher of the Context document",
      "fre": "Identifiant de l'éditeur du document de contexte",
      "cze": "Identifikátor vydavatele kontextového dokumentu",
      "ger": "Kennung für den Herausgeber des Kontextdokuments"
    },
    "RightsOverContextDoc": {
      "cat": "Drets sobre el document de context",
      "spa": "Derechos sobre el documento de contexto",
      "eng": "Rights over the context document",
      "fre": "Les droits sur le document de contexte",
      "cze": "Práva ke kontextovému dokumentu",
      "ger": "Rechte am Kontextdokument"
    },
    "InformationRightsContextDoc": {
      "cat": "Informació sobre els drets continguts en i sobre el document de context",
      "spa": "Información sobre los derechos contenidos en y sobre el documento de contexto",
      "eng": "Information about rights held in and over the Context document",
      "fre": "Informations sur les droits détenus dans et sur le document de contexte",
      "cze": "Informace o právech, která jsou držena v kontextovém dokumentu a nad ním",
      "ger": "Informationen über die Rechte, die in und an dem Kontextdokument bestehen"
    },
    "NotPossibleLoadContextDoc": {
      "cat": "El document de context no s'ha pogut carregar",
      "spa": "El documento de contexto no se ha podido cargar",
      "eng": "It was not possible to load the context document",
      "fre": "Il n'était pas possible de charger le document de contexte",
      "cze": "Kontextový dokument nebylo možné načíst",
      "ger": "Es war nicht möglich, das Kontextdokument zu laden"
    },
    "StateMapBrowserSavedOwsContextDocumentStandard": {
      "cat": "L'estat actual del navegador de mapes es desarà mitjançant l'estàndar de documents de context OWS",
      "spa": "El estado actual del navegador de mapas se guardará usando el estándar de documentos de contexto OWS",
      "eng": "The current state of the map browser will be saved using the OWS Context document standard",
      "fre": "L'état actuel du navigateur des cartes sera sauvé utilisant la norme de document de Contexte OWS",
      "cze": "Aktuální stav mapového prohlížeče bude uložen pomocí standardu dokumentu OWS Context",
      "ger": "Der aktuelle Zustand des Kartenbrowsers wird unter Verwendung des OWS-Kontextdokument-Standards gespeichert"
    },
    "MayRestoreUsingFileOrOwsCompliantClient": {
      "cat": "El podrà restaurar més tard usant el fitxer amb aquest navegador de mapes o qualsevol altre client compatible amb OWS",
      "spa": "Lo podrà restaurar más tarde usando el archivo con este navegador de mapas o cualquier cliente compatible con OWS",
      "eng": "You may restore it later using the file in this map browser or any other OWS compliant client",
      "fre": "Vous pouvez le reconstituer pour utiliser plus tard le fichier dans ce navigateur des cartes ou un autre client conforme OWS",
      "cze": "Později jej můžete obnovit pomocí souboru v tomto mapovém prohlížeči nebo v jakémkoli jiném klientovi kompatibilním s OWS",
      "ger": "Sie können ihn später wiederherstellen, indem Sie die Datei in diesem Kartenbrowser oder einem anderen OWS-kompatiblen Klienten verwenden"
    }
  },
  "paleta": {
    "WrongColorIndex": {
      "cat": "Índex de color incorrecte",
      "spa": "Índice de color incorrecto",
      "eng": "Wrong color index",
      "fre": "Index de couleur incorrect",
      "cze": "Špatný barevný index",
      "ger": "Falscher Farbindex"
    },
    "ColorIndicesHaveToBe": {
      "cat": "Els índexs de color han d'anar de 0 a 255",
      "spa": "Los índices de color deberian ir entre 0 y 255",
      "eng": "Color indices have to be between 0 and 255",
      "fre": "Les valeurs des index de couleurs doivent être comprises entre 0 et 255",
      "cze": "Barevné indexy musí být v rozmezí 0 až 255",
      "ger": "Farbindizes müssen zwischen 0 und 255 liegen"
    },
    "ColorNotObjectInFormat": {
      "cat": "Aquest color no es un objecte RGB en format",
      "spa": "Este color no es un objecto RGB en formato",
      "eng": "This color is not an object in the format",
      "fre": "Cette couleur n'est pas un objet au format",
      "cze": "Tato barva není objektem ve formátu",
      "ger": "Diese Farbe ist kein Objekt in dem Format"
    },
    "HastagColorIndices": {
      "cat": "Els ### són índexs de color que han d'anar de 0 a 255.",
      "spa": "Los ### són índices de color deberian ir entre 0 y 255.",
      "eng": "The ### are Color indices that have to be between 0 and 255.",
      "fre": "Les ### sont des indices de couleur qui doivent être compris entre 0 et 255.",
      "cze": "### jsou barevné indexy, které musí být mezi 0 a 255.",
      "ger": "Die ### sind Farbindizes, die zwischen 0 und 255 liegen müssen."
    }
  },
  "qualitat": {
    "QualityOfLayer": {
      "cat": "Qualitat de la capa",
      "spa": "Calidad de la capa",
      "eng": "Quality of the layer",
      "fre": "Qualité de la couche",
      "cze": "Kvalita vrstvy",
      "ger": "Qualität des Layers"
    },
    "ComplexDefinitionOfStyle": {
      "cat": "En desenvolupament: definició complexa de l'estil que no permet actualment crear el seu identificador ni, per tant, crear valoracions sobre el mateix",
      "spa": "En desarollo: definición compleja del estilo que no permite crear actualmente su identificador ni, por tanto, crear valoraciones sobre el mismo",
      "eng": "To be developed: complex definition of the style that does not allow to create its identifier nor, therefore, to create feedbacks about it",
      "fre": "À développer: définition complexe du style qui ne permet pas de créer son identifiant ni, par conséquent, de créer des valorisations sur le même",
      "cze": "K rozpracování: komplexní definice stylu, která neumožňuje vytvořit jeho identifikátor, a tedy ani zpětnou vazbu na něj",
      "ger": "Zu entwickeln: Komplexe Definition des Stils, die es nicht erlaubt, seinen Bezeichner zu erstellen und daher auch keine Rückmeldungen darüber zu geben"
    },
    "UnexpectedDefinitionOfStyle": {
      "cat": "Definició inesperada de l'estil que no permet crear el seu identificador ni, per tant, crear valoracions sobre el mateix",
      "spa": "Definición inesperada del estilo que no permite crear su identificador ni, por tanto, crear valoraciones sobre el mismo",
      "eng": "Unexpected definition of the style that does not allow to create its identifier nor, therefore, to create feedbacks about it",
      "fre": "Définition inattendue du style qui ne permet pas de créer son identifiant ni, par conséquent, de créer des valorisations sur le même",
      "cze": "Neočekávaná definice stylu, která neumožňuje vytvořit jeho identifikátor, ani o něm vytvořit zpětnou vazbu",
      "ger": "Unerwartete Definition des Stils, die es nicht erlaubt, seinen Bezeichner zu erstellen und daher auch keine Rückmeldungen darüber zu geben"
    },
    "UnexpectedDefinitionOfFeedback": {
      "cat": "Definició inesperada de la valoració",
      "spa": "Definición inesperada de la valoración",
      "eng": "Unexpected definition of the feedback item",
      "fre": "Définition inattendue du élément de rétroaction",
      "cze": "Neočekávaná definice položky zpětné vazby",
      "ger": "Unerwartete Definition des Feedback-Elements"
    },
    "StyleCannotImported": {
      "cat": "No es pot importar l'estil",
      "spa": "No se puede importar el estilo",
      "eng": "The style cannot be imported",
      "fre": "Le style ne peut pas être importé",
      "cze": "Styl nelze importovat",
      "ger": "Der Stil kann nicht importiert werden"
    },
    "FeedbackNotValidReproducibleDescription": {
      "cat": "Aquesta valoració no conté una descripció d'ús reproduible vàlida per a aquest navegador de mapas, versió o esquema",
      "spa": "Esta valoración no contiene una descripción de uso reproducible válida para este navegador de mapas, versión o esquema",
      "eng": "This feedback item does not contain a valid reproducible usage description for this web map browser, version or schema",
      "fre": "Cet élément de rétroaction ne contient pas de description d'utilisation reproductible valide pour ce navigateur de carte web, cette version ou ce schéma",
      "cze": "Tato položka zpětné vazby neobsahuje platný reprodukovatelný popis použití pro tento prohlížeč webových map, verzi nebo schéma",
      "ger": "Dieses Feedback-Element enthält keine gültige, reproduzierbare Nutzungsbeschreibung für diesen Web Map Browser, diese Version oder dieses Schema"
    },
    "NoObservationsValidObtainValidity": {
      "cat": "No hi ha observacions amb valors vàlids per obtenir la vàlidessa temporal en aquesta àrea",
      "spa": "No hay observaciones con valores válidos para obtener la validez temporal en esta área",
      "eng": "There are no observations with valid values to obtain temporal validity in this area",
      "fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la validité temporelle dans ce domaine",
      "cze": "V této oblasti neexistují žádná pozorování s platnými hodnotami pro získání časové platnosti",
      "ger": "Es gibt keine Beobachtungen mit gültigen Werten, um die zeitliche Gültigkeit in diesem Bereich zu erhalten"
    },
    "ConsistencyBasedOnComparisonObservation": {
      "cat": "La validessa temporal resumida està basada en la comparació de la data de cada observació individual indicada a l'atribut",
      "spa": "La validez temporal está basada en la comparación de la fecha de cada observación individual indicada por el atributo",
      "eng": "The temporal consistency is based on the comparison of the date of each individual observation as indicated in the field",
      "fre": "La cohérence temporelle est basée sur la comparaison de la date de chaque observation individuelle telle qu'elle est indiquée dans le champ",
      "cze": "Časová shoda je založena na porovnání data každého jednotlivého pozorování, jak je uvedeno v poli",
      "ger": "Die zeitliche Kohärenz basiert auf dem Vergleich des Datums jeder einzelnen Beobachtung, wie im Feld angegeben"
    },
    "dataIntervalSpecified": {
      "cat": "amb l'interval especificat",
      "spa": "con el intervalo especificado",
      "eng": "against the data interval specified",
      "fre": "against the data interval specified",
      "cze": "s uvedeným datovým intervalem",
      "ger": "gegen das angegebene Datenintervall"
    },
    "notValdityInformation": {
      "cat": "que no tenen informació sobre la validessa",
      "spa": "que no tienen información sobre la validez",
      "eng": "that does not have validity information",
      "fre": "qui n'ont pas d'informations de la validité",
      "cze": "který nemá informace o platnosti",
      "ger": "das keine Gültigkeitsinformationen enthält"
    },
    "NoObservationsValidityPositions": {
      "cat": "No hi ha observacions amb valors vàlids per obtenir la validessa de les posicions de les observacions en aquesta àrea",
      "spa": "No hay observaciones con valores válidos para obtener la validez de las posiciones de las observaciones en esta área",
      "eng": "There are no observations with valid values to obtain the validity of the positions of observations in this area",
      "fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la validité des positions des observations dans ce domaine",
      "cze": "Neexistují žádná pozorování s platnými hodnotami pro získání platnosti polohy pozorování v této oblasti.",
      "ger": "Es gibt keine Beobachtungen mit gültigen Werten, um die Gültigkeit der Positionen der Beobachtungen in diesem Bereich zu erhalten"
    },
    "DomainConsistencyOnLocationIndividual": {
      "cat": "La consistència del domini resumida està basada en la localització de cada observació individual present en la vista actual comparada amb l'àmbit especificat",
      "spa": "La consistencia del dominio resumida está basada en la localización de cada observación individual present en la vista actual comparada con el ámbito especificado",
      "eng": "The domain consistency is based on the localization of each individual observation present in the actual view against the envelope specified",
      "fre": "La cohérence du domaine est basée sur la localisation de chaque observation individuelle présente dans la vue réelle par rapport à l'enveloppe spécifiée",
      "cze": "Konzistence oblasti je založena na lokalizaci každého jednotlivého pozorování přítomného v aktuálním zobrazení vůči zadané obálce",
      "ger": "Die Domänenkohärenz basiert auf der Lokalisierung jeder einzelnen Beobachtung in der aktuellen Ansicht gegenüber der angegebenen Hülle"
    },
    "NoObservationsLogicalConsistency": {
      "cat": "No hi ha observacions amb valors vàlids per obtenir la consistència lògica dels atributs en aquesta àrea",
      "spa": "No hay observaciones con valores válidos para obtener la consistencia lógica de los atributos en esta área",
      "eng": "There are no observations with valid values to obtain logical consistency of attributes in this area",
      "fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la cohérence logique des attributs dans ce domaine",
      "cze": "Neexistují žádná pozorování s platnými hodnotami, aby bylo možné získat logickou konzistenci atributů v této oblasti",
      "ger": "Es gibt keine Beobachtungen mit gültigen Werten, um die logische Kohärenz der Attribute in diesem Bereich zu erhalten"
    },
    "OverallConsistencyComparisonIndividualObservation": {
      "cat": "La consistència resumida està basada en la comparació dels valors de cada observació pels atribut/s",
      "spa": "La consistència resumida está basada en la comparación de los valores de cada observación individual para los atributo/s",
      "eng": "The overall consistency is based on the comparison of the values of each individual observation for the field/s",
      "fre": "La cohérence globale est basée sur la comparaison des valeurs de chaque observation individuelle pour les champ/s",
      "cze": "Celková konzistence je založena na porovnání hodnot jednotlivých pozorování pro danou oblast/oblasti",
      "ger": "Die Gesamtkohärenz basiert auf dem Vergleich der Werte jeder einzelnen Beobachtung für das Feld/die Felder"
    },
    "listPossibleValuesDomain": {
      "cat": "contra la llista de valors possibles especificada al domini",
      "spa": "contra la lista de valores posibles especificada en el dominio",
      "eng": "against the list of possible values specified in the domain",
      "fre": "against the list of possible values specified in the domain",
      "cze": "se seznamem možných hodnot uvedených v oblasti",
      "ger": "gegen die Liste der möglichen Werte, die in der Domäne angegeben sind"
    },
    "notConsistencyInformationSpecifiedAttributes": {
      "cat": "que no tenen informació sobre la consistència, perquè no tenen els atributs indicats.",
      "spa": "que no tienen información sobre la consisténcia, porque no tienen los atributos indicados.",
      "eng": "that does not have consistency information, because it does not have the specified attributes.",
      "fre": "qui n'ont pas d'informations de coherénce, parce qu'ils n'ont pas les attributs.",
      "cze": "který nemá informace o konzistenci, protože nemá zadané atributy.",
      "ger": "die keine Kohärenzinformationen enthält, weil sie nicht über die angegebenen Attribute verfügt."
    },
    "NoObservationsPositionalUncertainty": {
      "cat": "No hi ha observacions amb incertesa posicional en aquesta àrea",
      "spa": "No hay observaciones con incertidumbre posicional en esta área",
      "eng": "There are no observations with positional uncertainty in this area",
      "fre": "Il n'y a pas d'observations avec une incertitude de position dans ce domaine",
      "cze": "V této oblasti nejsou žádná pozorování s polohovou nejistotou",
      "ger": "In diesem Bereich gibt es keine Beobachtungen mit Positionsunsicherheit"
    },
    "computeDataQuality": {
      "cat": "per calcular la qualitat de la capa",
      "spa": "para calcular la calidad de la capa",
      "eng": "to compute data quality for the layer",
      "fre": "pour calculer la qualité des données pour la couche",
      "cze": "pro výpočet kvality dat pro vrstvu",
      "ger": "um die Datenqualität für der Layer zu berechnen"
    },
    "AccuracyPositionalUncertainty": {
      "cat": "La exactitud resumida està basada en la incertesa posicional de cada observació individual indicada a l'atribut",
      "spa": "La exactitud resumida está basada en la incertidumbre posicional de cada observación individual indicada en el atributo",
      "eng": "The overall accuracy is based on the positional uncertainty for each individual observation as indicated in the field",
      "fre": "La précision globale est basée sur l'incertitude positionnelle de chaque observation individuelle, comme indiqué dans le champ",
      "cze": "Celková přesnost je založena na polohové nejistotě pro každé jednotlivé pozorování, jak je uvedeno v terénu",
      "ger": "Die Gesamtgenauigkeit basiert auf der Positionsunsicherheit für jede einzelne Beobachtung, wie im Feld angegeben"
    },
    "noUncertaintyInformation": {
      "cat": "que no tenen informació sobre la incertesa",
      "spa": "que no tienen información sobre la incertidumbre",
      "eng": "that does not have uncertainty information",
      "fre": "qui n'a pas d'information sur l'incertitude",
      "cze": "která nemá informace o nejistotě",
      "ger": "das keine Unsicherheitsinformationen enthält"
    },
    "InitialDateNotBlank": {
      "cat": "La data inicial no pot es pot deixar en blanc",
      "spa": "La fecha inicial no puede dejarse en blaco",
      "eng": "The initial date cannot be left blank",
      "fre": "La date finitiale ne peut pas être laissée en blanc",
      "cze": "Počáteční datum nelze ponechat prázdné",
      "ger": "Das Anfangsdatum darf nicht leer bleiben"
    },
    "FinalDateNotBlank": {
      "cat": "La data final no pot es pot deixar en blanc",
      "spa": "La fecha final no puede dejarse en blaco",
      "eng": "The final date cannot be left blank",
      "fre": "La date finale ne peut pas être laissée en blanc",
      "cze": "Konečné datum nelze ponechat prázdné",
      "ger": "Das Enddatum darf nicht leer bleiben"
    },
    "FinalDateNotLessInitialDate": {
      "cat": "La data final no pot ser inferior a la inicial",
      "spa": "La fecha final no puede ser inferior a la inicial",
      "eng": "The final date cannot be less than the initial date",
      "fre": "La date finale ne peut pas être inférieure à la date initiale",
      "cze": "konečné datum nesmí být kratší než počáteční datum",
      "ger": "Das Enddatum darf nicht kleiner als das Anfangsdatum sein"
    },
    "QualityParamAvailableMenu": {
      "cat": "El paràmetre de qualitat calculat està disponible a la entrada de menú contextual 'qualitat' de la capa",
      "spa": "El parámetro de calidad calculado está disponible en la entrada de menú contextual 'calidad' de la capa",
      "eng": "The calculated quality parameter is available as an entry in the context menu entry 'quality' of the layer",
      "fre": "Le paramètre de qualité calculé est disponible en tant qu'entrée dans l'entrée du menu contextuel 'qualité' de la couche",
      "cze": "Vypočtený parametr kvality je k dispozici jako položka v kontextovém menu vrstvy 'kvalita'",
      "ger": "Der berechnete Qualitätsparameter ist als Eintrag im Kontextmenü des Layers unter 'Qualität' verfügbar"
    },
    "QualityNotComputedLayer": {
      "cat": "No s'ha pogut calcular la qualitat de la capa",
      "spa": "No se ha podido calcular la calidad de la capa",
      "eng": "The quality cannot be computed for the layer",
      "fre": "La qualité ne peut pas être calculée pour la couche",
      "cze": "Pro vrstvu nelze vypočítat kvalitu",
      "ger": "Die Qualität kann für den Layer nicht berechnet werden"
    },
    "FieldPositionalUncertainty": {
      "cat": "Camp d'incertesa posicional",
      "spa": "Campo de incertidumbre posicional",
      "eng": "Field of positional uncertainty",
      "fre": "Champ d'incertitude de position",
      "cze": "Pole polohové nejistoty",
      "ger": "Feld der Positionsunsicherheit"
    },
    "FieldsVerifyLogicalConsistency": {
      "cat": "Atributs a verificar la consistència lògica",
      "spa": "Atributos a verificar la consistencia lógica",
      "eng": "Fields to verify the logical consistency",
      "fre": "Attributs pour vérifier la cohérence logique",
      "cze": "Pole pro ověření logické konzistence",
      "ger": "Felder zur Überprüfung der logischen Konsistenz"
    },
    "ListPossibleValues": {
      "cat": "Llista de valors possibles ",
      "spa": "Lista de valores posibles ",
      "eng": "List of possible values ",
      "fre": "Liste des valeurs possibles ",
      "cze": "Seznam možných hodnot ",
      "ger": "Liste der möglichen Werte "
    },
    "valueField": {
      "cat": "valor1camp1;valor1camp2;valor1camp3",
      "spa": "valor1campo1;valor1campo2;valor1campo3",
      "eng": "value1field1;value1field2;value1field3",
      "fre": "valeur1champ1;valeur1champ2;valeur1champ3",
      "cze": "hodnota1pole1;hodnota1pole2;hodnota1pole3",
      "ger": "Wert1Feld1;Wert1Feld2;Wert1Feld3"
    },
    "GroundTruthLayer": {
      "cat": "Capa veritat terreny",
      "spa": "Capa verdad terreno",
      "eng": "Ground truth layer",
      "fre": "Couche de vérité terrain",
      "cze": "Pozemní pravdivostní vrstva",
      "ger": "Layer der Grundwahrheit"
    },
    "RangeObservationDates": {
      "cat": "Interval de les dates d'observació",
      "spa": "Intervalo de las fechas de observación",
      "eng": "Range of observation dates",
      "fre": "Plage de dates d'observation",
      "cze": "Rozsah dat pozorování",
      "ger": "Bereich der Beobachtungsdaten"
    },
    "InitialDate": {
      "cat": "Data inicial",
      "spa": "Fecha inicial",
      "eng": "Initial date",
      "fre": "Date initiale",
      "cze": "Počáteční datum",
      "ger": "Anfangsdatum"
    },
    "FinalDate": {
      "cat": "Data final",
      "spa": "Fecha final",
      "eng": "Final date",
      "fre": "Date finale",
      "cze": "Konečné datum",
      "ger": "Enddatum"
    },
    "GeographicExtent": {
      "cat": "Àmbit geogràfic",
      "spa": "Ámbito geográfico",
      "eng": "Geographic extent",
      "fre": "Etendue géographique",
      "cze": "Geografický rozsah",
      "ger": "Geografische Ausdehnung"
    },
    "MinimumLongitude": {
      "cat": "Longitud mínima",
      "spa": "Longitud mínima",
      "eng": "Minimum longitude",
      "fre": "Longitude minimale",
      "cze": "Minimální zeměpisná délka",
      "ger": "Minimaler Längengrad"
    },
    "MinimumX": {
      "cat": "X mínima",
      "spa": "X mínima",
      "eng": "Minimum X",
      "fre": "X minimale",
      "cze": "Minimální X",
      "ger": "Minimaler X"
    },
    "MaximumLongitude": {
      "cat": "Longitud màxima",
      "spa": "Longitud máxima",
      "eng": "Maximum longitude",
      "fre": "Longitude maximale",
      "cze": "Maximální zeměpisná délka",
      "ger": "Maximaler Längengrad"
    },
    "MaximumX": {
      "cat": "X màxima",
      "spa": "X máxima",
      "eng": "Maximum X",
      "fre": "X maximale",
      "cze": "Maximální X",
      "ger": "Maximum X"
    },
    "MinimumLatitude": {
      "cat": "Latitud mínima",
      "spa": "Latitud mínima",
      "eng": "Minimum latitude",
      "fre": "Latitude minimale",
      "cze": "Minimální zeměpisná šířka",
      "ger": "Minimaler Breitengrad"
    },
    "MinimumY": {
      "cat": "Y mínima",
      "spa": "Y mínima",
      "eng": "Minimum Y",
      "fre": "Y minimale",
      "cze": "Minimální Y",
      "ger": "Minimum Y"
    },
    "MaximumLatitude": {
      "cat": "Latitud máxima",
      "spa": "Latitud máxima",
      "eng": "Maximum latitude",
      "fre": "Latitude maximale",
      "cze": "Maximální zeměpisná šířka",
      "ger": "Maximaler Breitengrad"
    },
    "MaximumY": {
      "cat": "Y màxima",
      "spa": "Y máxima",
      "eng": "Maximum Y",
      "fre": "Y maximale",
      "cze": "Maximální Y",
      "ger": "Maximales Y"
    },
    "ComputeQualityLayer": {
      "cat": "Calcular la qualitat de la capa",
      "spa": "Calcular la Calidad de la capa",
      "eng": "Compute the quality of the layer",
      "fre": "Calculer la qualité de la couche",
      "cze": "Výpočet kvality vrstvy",
      "ger": "Berechnen der Qualität des Layers"
    },
    "QualityAssessment": {
      "cat": "Mètode d'avaluació de la qualitat",
      "spa": "Método de evaluación de la calidad",
      "eng": "Quality assessment",
      "fre": "Méthode d'évaluation de la qualité",
      "cze": "Hodnocení kvality",
      "ger": "Qualitätsbeurteilung"
    },
    "PositionalLayerObsUncertainties": {
      "cat": "Exactitud posicional de la capa a partir de la incertessa de l'observació",
      "spa": "Exactitud posicional de la capa a partir de la incertidumbre de la observación",
      "eng": "Positional accuracy of the layer from observation uncertainties",
      "fre": "Précision de positionnement de la couche par rapport à l'incertitude d'observation",
      "cze": "Přesnost polohy vrstvy z nejistot pozorování",
      "ger": "Lagegenauigkeit des Layers aufgrund von Beobachtungsunsicherheiten"
    },
    "LogicalConsistencyThematicAttr": {
      "cat": "Consistència lògica dels atributs temàtics",
      "spa": "Consistencia lógica de los atributos temáticos",
      "eng": "Logical consistency of the thematic attributes",
      "fre": "Cohérence logique des attributs thématiques",
      "cze": "Logická konzistence tematických atributů",
      "ger": "Logische Konsistenz der thematischen Attribute"
    },
    "TemporalValidityObsDate": {
      "cat": "Validessa temporal de la data d'observació",
      "spa": "Validez temporal de la fecha de observación",
      "eng": "Temporal validity of observation date",
      "fre": "Validité temporelle de la date de l'observation",
      "cze": "Časová platnost data pozorování",
      "ger": "Zeitliche Gültigkeit des Beobachtungsdatums"
    },
    "ValidityPositionsObs": {
      "cat": "Validessa de les posicions de les observacions",
      "spa": "Validez de las posiciones de las observaciones",
      "eng": "Validity of the positions of observations",
      "fre": "Validité des positions des observations",
      "cze": "Platnost polohy pozorování",
      "ger": "Gültigkeit der Positionen von Beobachtungen"
    }
  },
  "tools": {
    "LayerTypeWindow": {
      "cat": "No s'ha definit la layer de tipus finestra",
      "spa": "No se ha definido la layer de tipo ventana",
      "eng": "The layer",
      "fre": "La layer de type fenêtre",
      "cze": "Vrstva",
      "ger": "Der Layer"
    },
    "notDefinedNotFunctionality": {
      "cat": "i per tant no es pot usar la funcionalitat",
      "spa": "y en consecuencia no se puede usar la funcionalidad",
      "eng": "has not been defined and its not possible to use the functionality",
      "fre": "n'a été pas définie et il n'est donc pas possible d'utilise l'outil",
      "cze": "nebyla definována a není možné použít funkci",
      "ger": "wurde nicht definiert und die Funktionalität kann nicht genutzt werden"
    },
    "TheValueOf": {
      "cat": "El valor de",
      "spa": "El valor de",
      "eng": "The value of",
      "fre": "La valeur de",
      "cze": "Hodnota",
      "ger": "Der Wert von"
    },
    "requiresACharacter": {
      "cat": "ha de contenir un caracter",
      "spa": "debe contenir un caracter",
      "eng": "requires a character",
      "fre": "nécessite un caractère",
      "cze": "vyžaduje znak",
      "ger": "erfordert ein Zeichen"
    },
    "ReferencesOtherJSONNotSupported": {
      "cat": "Encara no se suporten valors de $ref amb referències a altres fitxers JSON",
      "spa": "Aún no se suporta valores de $ref con referencias a otros ficheros JSON",
      "eng": "$ref values with references to other JSON files are still not supported",
      "fre": "Les valeurs $ref avec des références à d'autres fichiers JSON ne sont toujours pas prises en charge",
      "cze": "Hodnoty $ref s odkazy na jiné soubory JSON stále nejsou podporovány",
      "ger": "$ref-Werte mit Verweisen auf andere JSON-Dateien werden noch nicht unterstützt"
    },
    "isNotDefined": {
      "cat": "no està definit",
      "spa": "no está definido",
      "eng": "is not defined",
      "fre": "n'est pas défini",
      "cze": "není definován",
      "ger": "ist nicht definiert"
    },
    "isNotObject": {
      "cat": "no és un objecte",
      "spa": "no es un objecto",
      "eng": "is not an object",
      "fre": "n'est pas un objet",
      "cze": "není objektem",
      "ger": "ist kein Objekt"
    }
  },
  "vector": {
    "CannotSelectObjectLayerNoExist": {
      "cat": "No es poden seleccionar els objectes sol·licitats perquè la capa no existeix",
      "spa": "No se pueden seleccionar los objetos solicitados porquè la capa no existe",
      "eng": "Cannot select request features because the layer doesn't exist",
      "fre": "Les objets demandés ne peuvent pas être sélectionnées parce que la couche n'existe pas",
      "cze": "Nelze vybrat objekt požadavku, protože vrstva neexistuje",
      "ger": "Anfrageobjekt kann nicht ausgewählt werden, da der Layer nicht existiert"
    },
    "ElementsVectorialTable": {
      "cat": "Taula d'objectes vectorials",
      "spa": "Tabla de objectos vectoriales",
      "eng": "Vector features' table",
      "fre": "Table d'objets vectoriels",
      "cze": "Tabulka vektorových objektů",
      "ger": "Tabelle mit Vektorobjekten"
    } 
  },
  "video": {
    "NoLayerAvailableForAnimation": {
      "cat": "No hi ha cap capa disponible per l'ànimació en aquesta àrea o zoom.",
      "spa": "No hi ha ninguna capa disponible para la animación en este área o zoom.",
      "eng": "There is no layer available for the animation in this area or zoom.",
      "fre": "Il n'y a pas de couche disponible pour la animation dans cette zone ou le zoom.",
      "cze": "Pro animaci v této oblasti nebo zvětšení není k dispozici žádná vrstva.",
      "ger": "Es ist keiner Layer für die Animation in diesem Bereich oder Zoom verfügbar."
    },
    "ReferenceLayer": {
      "cat": "Capa de referència",
      "spa": "Capa de referencia",
      "eng": "Reference layer",
	  "fre": "Couche de référence",
	  "cze": "Referenční vrstva",
	  "ger": "Referenzebene"
    },
    "TimeSeries": {
      "cat": "Sèrie temporal",
      "spa": "Serie temporal",
      "eng": "Time series",
      "fre": "Séries chronologiques",
      "cze": "Časová řada",
      "ger": "Zeitreihe"
    },
    "TemporalScale": {
      "cat": "Escala temporal",
      "spa": "Escala temporal",
      "eng": "Temporal scale",
      "fre": "Échelle temporelle",
      "cze": "Časové měřítko",
      "ger": "Zeitliche Skala"
    },
    "Interval": {
      "cat": "Interval",
      "spa": "Intervalo",
      "eng": "Interval",
      "fre": "Intervalle",
      "cze": "Interval",
      "ger": "Intervall"
    },
    "Animations": {
      "cat": "Animacions",
      "spa": "Animaciones",
      "eng": "Animations",
      "fre": "Animations",
      "cze": "Animace",
      "ger": "Animationen"
    },
    "DataCube": {
      "cat": "Cub de dades",
      "spa": "Cubo de datos",
      "eng": "Data cube",
	  "fre": "Cube de données",
	  "cze": "Datovou kostkou",
	  "ger": "Datenwürfel"
    },
    "Graph": {
      "cat": "Gràfic",
      "spa": "Gráfico",
      "eng": "Graph",
      "fre": "Graphique",
      "cze": "Graf",
      "ger": "Grafik"
    },
    "NumPhotosValue": {
      "cat": "N. fotog. amb valor",
      "spa": "N. fotog. con valor",
      "eng": "N. photos with value",
      "fre": "N. fotog. avec valeur",
      "cze": "N. fotografií s hodnotou",
      "ger": "N. Fotos mit Wert"
    },
    "StartSeasonDay": {
      "cat": "Dia d'inici de la temporada",
      "spa": "Día de inicio de la temporada",
      "eng": "Start of the Season day",
      "fre": "Jour de début de saison",
      "cze": "Začátek dne sezóny",
      "ger": "Tag des Saisonbeginns"
    },
    "PeakSeasonDay": {
      "cat": "Dia el màxim de la temporada",
      "spa": "Día del máximo de la temporada",
      "eng": "Peak of the Season day",
      "fre": "Journée de pointe de la saison",
      "cze": "Den vrcholu sezóny",
      "ger": "Tag des Saisonhöhepunkts"
    },
    "EndSeasonDay": {
      "cat": "Dia de fi de la temporada",
      "spa": "Día de final de la temporada",
      "eng": "End of the Season day",
      "fre": "Jour de fin de saison",
      "cze": "Den konce sezóny",
      "ger": "Tag des Saisonendes"
    },
    "LengthSeasonDays": {
      "cat": "Dies D'allargada de la temporada",
      "spa": "Días de longitud de la temporada",
      "eng": "Length of the season (days)",
      "fre": "Durée de la saison (jours)",
      "cze": "Délka sezóny (dny)",
      "ger": "Länge der Saison (Tage)"
    },
    "StartSeasonValue": {
      "cat": "Valor d'inici de la temporada",
      "spa": "Valor de inicio de la temporada",
      "eng": "Start of the Season value",
      "fre": "Valeur de début de saison",
      "cze": "Hodnota začátku sezóny",
      "ger": "Wert zu Beginn der Saison"
    },
    "PeakSeasonValue": {
      "cat": "Valor màxim de la temporada",
      "spa": "Valor máximo de la temporada",
      "eng": "Peak of the Season value",
      "fre": "Valeur maximale de la saison",
      "cze": "Vrcholová hodnota sezóny",
      "ger": "Spitzenwert der Saison"
    },
    "EndSeasonValue": {
      "cat": "Valor de fi de la temporada",
      "spa": "Valor de final de la temporada",
      "eng": "End of the Season value",
      "fre": "Valeur de fin de saison",
      "cze": "Hodnota na konci sezóny",
      "ger": "Wert zum Ende der Saison"
    },
    "SeasonBaseValue": {
      "cat": "Valor base la temporada",
      "spa": "Valor base de la temporada",
      "eng": "Season base value",
      "fre": "Valeur de base de la saison",
      "cze": "Základní hodnota sezóny",
      "ger": "Basiswert der Saison"
    },
    "AmplitudeSeason": {
      "cat": "Amplitud de la temporada",
      "spa": "Amplitud de la temporada",
      "eng": "Amplitude of the season",
      "fre": "Amplitude de la saison",
      "cze": "Amplituda sezóny",
      "ger": "Amplitude der Saison"
    },
    "RateGreening": {
      "cat": "Taxa de verdor",
      "spa": "Tasa de verdor",
      "eng": "Rate of Greening",
      "fre": "Taux de verdissement",
      "cze": "Míra ozelenění",
      "ger": "Rate der Begrünung"
    },
    "RateSenescene": {
      "cat": "Taxa de Senescència",
      "spa": "Tasa de Senescencia",
      "eng": "Rate of Senescene",
      "fre": "Taux de Sénescence",
      "cze": "Míra senoseče",
      "ger": "Rate der Seneszenz"
    },
    "frames": {
      "cat": "fotogrames",
      "spa": "fotogramas",
      "eng": "frames",
      "fre": "cadres",
      "cze": "rámy",
      "ger": "Rahmen"
    },
    "LoadingFilm": {
      "cat": "Carregant rodet",
      "spa": "Cargando carrete",
      "eng": "Loading film",
      "fre": "Chargement film",
      "cze": "Vkládání filmu",
      "ger": "Laden des Films"
    },
    "LoadingFrames": {
      "cat": "Carregant fotogrames",
      "spa": "Cargando fotogramas",
      "eng": "Loading frames",
      "fre": "Chargement des cadres",
      "cze": "Vkládání snímků",
      "ger": "Laden der Rahmen"
    },
    "AllowedPercentageVoidSpace": {
      "cat": "Percentatge tolerat de superfície buida",
      "spa": "Porcentage tolerado de superficie vacia",
      "eng": "Allowed percentage of void space",
      "fre": "Pourcentage de surface vide toléré",
      "cze": "Povolené procento prázdného prostoru",
      "ger": "Zulässiger Prozentsatz des Leerraums"
    },
    "ComputingStatisticSeries": {
      "cat": "Calculant estadístic de la sèrie",
      "spa": "Calculando estadístico de la serie",
      "eng": "Computing statistic of the series",
      "fre": "Statistique de calcul de la série",
      "cze": "Výpočet statistiky série",
      "ger": "Berechnung der statistischen Daten der Serie"
    },
    "UnsupportedStatisticalFunction": {
      "cat": "Funció estadística no suportada",
      "spa": "Función estadística no soportada",
      "eng": "Unsupported statistical function",
      "fre": "Statistical function non supportée",
      "cze": "Nepodporovaná statistická funkce",
      "ger": "Nicht unterstützte statistische Funktion"
    },
    "ComputingGraphicSeries": {
      "cat": "Calculant grafic x/t de la sèrie",
      "spa": "Calculando gráfico x/t de la serie",
      "eng": "Computing graphic x/t of the series",
      "fre": "Informatique graphique x/t de la série",
      "cze": "Výpočet grafické x/t řady",
      "ger": "Berechnung der Grafik x/t der Serie"
    },
    "ValuesImageCopiedClipboard": {
      "cat": "Els valors de la imatge han estat copiats al portaretalls en format ràster ASCII",
      "spa": "Los valores de la imagen han sido copiados al portapapeles en formato ráster ASCII",
      "eng": "The values of the image have been copied to clipboard in ASCII raster format",
      "fre": "Les valeurs de l'image ont été copiées dans le presse-papier dans le format raster ASCII",
      "cze": "Hodnoty snímku byly zkopírovány do schránky ve formátu ASCII rastru",
      "ger": "Die Werte des Bildes wurden im ASCII-Rasterformat in die Zwischenablage kopiert"
    },
    "LoadingThumbnails": {
      "cat": "Carregant miniatures",
      "spa": "Cargando miniaturas",
      "eng": "Loading thumbnails",
      "fre": "Chargement des vignettes",
      "cze": "Načítání miniatur",
      "ger": "Laden von Miniaturbildern"
    },
    "WrongValueTemporalScale": {
      "cat": "Valor incorrecte de l'escala temporal",
      "spa": "Valor incorrecto de la escala temporal",
      "eng": "Wrong value in temporal scale",
      "fre": "Valeur incorrect de l'échelle temporelle",
      "cze": "Špatná hodnota v časové stupnici",
      "ger": "Falscher Wert in der zeitlichen Skala"
    },
    "IncorrectValueIntervalSeconds": {
      "cat": "Valor incorrecte de l'interval de segons",
      "spa": "Valor incorrecto del intervaluo de segundos",
      "eng": "Incorrect value of the interval of seconds",
      "fre": "Valeur incorrecte de l'intervalle de secondes",
      "cze": "Nesprávná hodnota sekundového intervalu",
      "ger": "Falscher Wert für das Sekundenintervall"
    },
    "WillUse": {
      "cat": "Usaré 5.0",
      "spa": "Usaré 5.0",
      "eng": "I'll use 5.0",
      "fre": "Je vais utiliser 5.0",
      "cze": "Použiji hodnotu 5,0",
      "ger": "Ich werde 5.0 verwenden"
    },
    "SelectTempScaleInterval": {
      "cat": "Sel·lecciona escala temporal o interval",
      "spa": "Seleccione escala temporal o intervalo",
      "eng": "Select temporal scale or interval",
      "fre": "Sélectionner échelle temporelle où intervalle",
      "cze": "Vyberte časovou stupnici nebo interval",
      "ger": "Zeitlichen Maßstab oder Intervall auswählen"
    }
  },
  "wps": {
    "Result": {
      "cat": "Resultat: ",
      "spa": "Resultado: ",
      "eng": "Result: ",
      "fre": "Résultat: ",
      "cze": "Výsledek: ",
      "ger": "Ergebnis: "
    },
    "Accepted": {
      "cat": "Acceptat",
      "spa": "Aceptado",
      "eng": "Accepted",
      "fre": "Accepté",
      "cze": "Přijato",
      "ger": "Angenommen"
    },
    "Started": {
      "cat": "Iniciat",
      "spa": "Iniciado",
      "eng": "Started",
      "fre": "Initié",
      "cze": "Spuštěno",
      "ger": "Gestartet"
    },
    "percentCompleted": {
      "cat": "percentatge completat",
      "spa": "porcentaje completado",
      "eng": "percent completed",
      "fre": "pourcentage complété",
      "cze": "procento dokončeno",
      "ger": "Prozent abgeschlossen"
    },
    "Paused": {
      "cat": "Pausat",
      "spa": "Pausado",
      "eng": "Paused",
      "fre": "En pause",
      "cze": "Paused",
      "ger": "Pausiert"
    },
    "Succeeded": {
      "cat": "Finalitzat",
      "spa": "Finalizado",
      "eng": "Succeeded",
      "fre": "Terminé",
      "cze": "Úspěšný",
      "ger": "Erfolgreich"
    },
    "Failed": {
      "cat": "Error: ",
      "spa": "Error: ",
      "eng": "Failed: ",
      "fre": "Erreur: ",
      "cze": "Neúspěšně: ",
      "ger": "Fehlgeschlagen: "
    },
    "NoValueDefinedParameter": {
      "cat": "No s'ha definit cap valor pel paràmetre",
      "spa": "No se ha definido ningún valor para el paràmetro",
      "eng": "No value has been defined by parameter",
      "fre": "Aucun valeur défini pour le paramètre",
      "cze": "U parametru nebyla definována žádná hodnota",
      "ger": "Für den Parameter wurde kein Wert definiert"
    },
    "NecessarySendFileBeforeExecProcess": {
      "cat": "Cal enviar el fitxer al servidor abans d'executar el procès",
      "spa": "Es necesario enviar el fichero al servidor antes de ejecutar el proceso",
      "eng": "It is necessary to send the file to the server before executing the process",
      "fre": "Il faut envoyer le fichier au serveur avant d'exécuter le processus",
      "cze": "Před spuštěním procesu je nutné odeslat soubor na server",
      "ger": "Es ist notwendig, die Datei an den Server zu senden, bevor der Prozess ausgeführt wird"
    },
    "URLIntroducedInParameter": {
      "cat": "La URL introduïda en el paràmetre",
      "spa": "La URL introducida en el parametro",
      "eng": "The URL introduced in the parameter",
      "fre": "La URL introduite au paramètre",
      "cze": "Adresa URL uvedená v parametru",
      "ger": "Die im Parameter angegebene URL"
    },
    "isInvalid": {
      "cat": "és invàlida",
      "spa": "es invalida",
      "eng": "is invalid",
      "fre": "n'est pas valide",
      "cze": "je neplatný",
      "ger": "ist ungültig"
    },
    "StateExecution": {
      "cat": "Estat de l'execució",
      "spa": "Estado de la ejecución",
      "eng": "State of execution",
      "fre": "État de l'exécution",
      "cze": "Stav provádění",
      "ger": "Zustand der Ausführung"
    },
    "ExecutionTime": {
      "cat": "Temps d'execució",
      "spa": "Tiempo de ejecución",
      "eng": "Execution time",
      "fre": "Durée d'exécution",
      "cze": "Čas provedení",
      "ger": "Ausführungszeit"
    },
    "AdvancedOptions": {
      "cat": "Opcions avançades",
      "spa": "Opciones avanzadas",
      "eng": "Advanced options",
      "fre": "Options avancées",
      "cze": "Rozšířené možnosti",
      "ger": "Erweiterte Optionen"
    },
    "ErrorBuildingExecReq": {
      "cat": "Error al construir la petició d'execució",
      "spa": "Error al construir la petición de ejecución",
      "eng": "Error while building execution request",
      "fre": "Erreur en construisant la demande d'exécution",
      "cze": "Chyba při sestavování požadavku na provedení",
      "ger": "Fehler beim Erstellen der Ausführungsanfrage"
    },
    "AllowedFormatsParameter": {
      "cat": "Formats permesos by parameter",
      "spa": "Formatos permitidos by parameter",
      "eng": "Allowed formats by parameter",
      "fre": "Formats permis by parameter",
      "cze": "Povolené formáty podle parametru",
      "ger": "Erlaubte Formate für Parameter"
    },
    "OccurredErrorSendingFile": {
      "cat": "S'ha produït algun error durant l'enviament del fitxer",
      "spa": "Se ha producido algun error durante el envío del fichero",
      "eng": "Has been occurred an error while sending the file",
      "fre": "Une erreur vient de se produire pendant l'envoi du fichier",
      "cze": "Došlo k chybě při odesílání souboru",
      "ger": "Es ist ein Fehler beim Senden der Datei aufgetreten"
    },
    "InputParameters": {
      "cat": "Paràmetres d'entrada",
      "spa": "Parámetros de entrada",
      "eng": "Input parameters",
      "fre": "Paramètres d'entrée",
      "cze": "Vstupní parametry",
      "ger": "Eingabeparameter"
    },
    "LayerProcess": {
      "cat": "Capa a processar",
      "spa": "Capa a procesar",
      "eng": "Layer to process",
      "fre": "Couche à traiter",
      "cze": "Vrstva ke zpracování",
      "ger": "Zu verarbeitender Layer"
    },
    "OperationExecute": {
      "cat": "Operació a executar: ",
      "spa": "Operación a ejecutar: ",
      "eng": "Operation to execute: ",
      "fre": "Opération à exécuter: ",
      "cze": "Operace, která se má provést: ",
      "ger": "Auszuführende Operation: "
    },
    "someProcessWithoutOperation": {
      "cat": "té processos sense cap operació definida",
      "spa": "tiene procesos sin ninguna operación definida",
      "eng": "have some process without any operation defined",
      "fre": "a des processus sans aucune opération définie",
      "cze": "mít nějaký proces bez definované operace",
      "ger": "haben einen Prozess ohne definierte Operation"
    },
    "notAnyExecProcessDefined": {
      "cat": "no té capa procés executable definit",
      "spa": "no tiene ningún proceso ejecutable definido",
      "eng": "do not have any executable process defined",
      "fre": "n'a aucun processus exécutable définit",
      "cze": "nemají definovaný žádný spustitelný proces",
      "ger": "keinen ausführbaren Prozess definiert haben"
    },
    "addingLayersToBrowser": {
      "cat": "d'afegir capes al navegador",
      "spa": "de añadir capas al navegador",
      "eng": "of adding a layer to the browser",
      "fre": "pour ajouter des couches au navigateur",
      "cze": "přidání vrstvy do prohlížeče",
      "ger": "Hinzufügen eines Layers zum Browser"
    }
  },
  "urls": {
    "helpHtm": {
      "cat": "ajuda/cat/ajuda.htm",
      "spa": "ajuda/spa/ajuda.htm",
      "eng": "ajuda/eng/ajuda.htm",
      "fre": "ajuda/fre/ajuda.htm",
      "cze": "ajuda/eng/ajuda.htm",
      "ger": "ajuda/eng/ajuda.htm"
    },
    "installerMMRExe": {
      "cat": "https://www.miramon.cat/mmr/cat/exe/Inst_MMR.exe",
      "spa": "https://www.miramon.cat/mmr/esp/exe/Inst_MMR.exe",
      "eng": "https://www.miramon.cat/mmr/usa/exe/Inst_MMR.exe",
      "fre": "https://www.miramon.cat/mmr/usa/exe/Inst_MMR.exe",
      "cze": "https://www.miramon.cat/mmr/usa/exe/Inst_MMR.exe",
      "ger": "https://www.miramon.cat/mmr/usa/exe/Inst_MMR.exe"
    }
  },
  "impressio": {
    "ReferSystem": {
       "cat": "Sistema de Referència",
       "spa": "Sistema de Referéncia",
       "eng": "Reference System",
       "fre": "Système de référence",
      "cze": "Referenční systém",
      "ger": "Koordinatenbezugssystem"
    },
    "PrintDate": {
      "cat": "Data de impressió",
      "spa": "Fecha de impresión",
      "eng": "Print date",
      "fre": "Date d'impression",
      "cze": "Vytisknout datum",
      "ger": "Druckdatum"
    },
    "Subtitle": {
      "cat": "Subtítol",
      "spa": "Subtítulo",
      "eng": "Subtitle",
      "fre": "Sous-titre",
      "cze": "Podtitul",
      "ger": "Untertitel"
    },
    "SizeOrientationPaper": {
      "cat": "Mida i orientació del paper", 
      "spa": "Tamaño y orientación del papel", 
      "eng": "Size and orientation of the paper",
      "fre": "Dimensions et position du papier",
      "cze": "Velikost a orientace papíru",
      "ger": "Seitengröße und Ausrichtung"
    },
    "WhenPrintingKeep": {
      "cat": "En imprimir la vista, respectar",
      "spa": "Al imprimir la vista, respetar",
      "eng": "When printing the view, keep",
      "fre": "En imprimant la vue, respecter",
      "cze": "Při tisku zobrazení zachovejte",
      "ger": "Beim Drucken"
    },
    "theExtent": {
      "cat": "l'àmbit",
      "spa": "el ámbito",
      "eng": "the extent",
      "fre": "le champ",
      "cze": "rozlišení podle rozsahu mapy",
      "ger": "Ausdehnung behalten"
    },
    "theResolution": {
      "cat": "la resolució",
      "spa": "la resolución",
      "eng": "the resolution",
      "fre": "la résolution",
      "cze": "originální rozlišení mapy",
      "ger": "Auflösung behalten"
    },
    "ResolutionKeptExtentChanged": {
      "cat": "La resolució original de la vista es respecta però es canvia l'àmbit",
      "spa": "La resolución original de la vista se respeta pero se cambia el ámbito",
      "eng": "The original resolution of the view is kept but the extent is changed",
      "fre": "La résolution originelle de la vue est respectée mais le champ est changé",
      "cze": "Původní rozlišení zobrazení zůstává zachováno, ale mění rozsah zobrazení",
      "ger": "Die ursprüngliche Auflösung der Ansicht bleibt erhalten, die Ausdehnung wird jedoch geändert"
    },
    "ResolutionAssignedIsLower": {
      "cat": "La resolució assignada a la impressora pel navegador és INFERIOR a la resolució de l'àrea de la vista a imprimir.\nPrem 'Imprimir' per a imprimir a un resolució inferior o cancel·la i fes més petita l'area de la vista (p.ex. canviat la mida del navegador)",
      "spa": "La resolución asignada a la impresora por el navegador es INFERIOR a la resolución del área de la vista a imprimir.\nSeleccione 'Imprimir' para imprimir a una resolución inferior o cancelar y haga más pequeña el área de la vista (p.ej. cambiando la medida del navegador)",
      "eng": "The resolution assigned to the printer in a browser is LOWER than the resolution of the view area to print.\nPlease, press 'Print' to print in a lower resolution or cancel to view area smaller (f.ex. changing browser window size)",
      "fre": "La résolution assignée à l'imprimante par le navigateur est INFÉRIEURE à la résolution de l'aire de la vue à imprimer.\nAppuyer 'Imprimer' pour imprimer à une résolution inférieure où annuler et faites plus petite l'aire de la vue (p.ex. En changeant la taille du navigateur)",
      "cze": "Rozlišení přiřazené tiskárně v prohlížeči je MENŠÍ než rozlišení zobrazované oblasti pro tisk.\nProsím, stiskněte 'Tisk' pro tisk v menším rozlišení nebo zrušte zobrazení menší oblasti (např. změna velikosti okna prohlížeče)",
      "ger": "Die dem Drucker im Browser zugewiesene Auflösung ist NIEDRIGER als die Auflösung des Druckbereiches. Bitte klicken Sie auf „Drucken“, um in einer niedrigeren Auflösung zu drucken, oder brechen Sie den Vorgang ab, um den Bereich kleiner anzuzeigen (z.B. durchs Ändern der Browserfenstergröße)."
    },
    "ResolutionAssignedIsEnough": {
      "cat": "La resolució assignada a la impressora pel navegador és suficient per imprimir la vista",
      "spa": "La resolución asignada a la impresora por el navegador es suficiente para imprimir la vista",
      "eng": "The resolution assigned to the printer in a browser is enough to print the view",
      "fre": "La résolution assignée à l'imprimante par le navigateur est suffisante  pour imprimer la vue",
      "cze": "Rozlišení přiřazené tiskárně v prohlížeči stačí k vytištění pohledu",
      "ger": "Die dem Drucker im Browser zugewiesene Auflösung reicht aus, um die Ansicht auszudrucken"
    },
    "ElementsToPrint": {
      "cat": "Elements a imprimir (píxels)",
      "spa": "Elementos a imprimir (píxeles)",
      "eng": "Elements to print (pixels)",
      "fre": "Éléments à imprimer (pixels)",
      "cze": "Prvky k tisku (pixely)",
      "ger": "Druckelemente (Pixel)"
    },
    "left": {
      "cat": "esq.",
      "spa": "izq.",
      "eng": "left",
      "fre": "gauche",
      "cze": "vlevo",
      "ger": "links"
    },
    "top": {
      "cat": "sup.",
      "spa": "sup.",
      "eng": "top",
      "fre": "sup.",
      "cze": "top",
      "ger": "oben"
    },
    "width": {
      "cat": "ample",
      "spa": "ancho",
      "eng": "width",
      "fre": "largeur",
      "cze": "šířka",
      "ger": "Breite"
    },
    "height": {
      "cat": "alt",
      "spa": "alto",
      "eng": "height",
      "fre": "hauteur",
      "cze": "výška",
      "ger": "Höhe"
    },
    "ScaleBar": {
      "cat": "Barra d'escala",
      "spa": "Barra de escala",
      "eng": "Scale Bar",
      "fre": "Barre d'échelle",
      "cze": "Měřítko",
      "ger": "Maßstab"
    },
    "SituationMap": {
      "cat": "Mapa de situació",
      "spa": "Mapa de situación",
      "eng": "Situation map",
      "fre": "Carte de situation",
      "cze": "Situační mapa",
      "ger": "Übersichtskarte"
    },
    "OtherElements": {
      "cat": "Altres elements",
      "spa": "Otros elementos",
      "eng": "Other elements",
      "fre": "Autres éléments",
      "cze": "Další prvky",
      "ger": "sonstige Elemente"
    }
  },
  "colors": {
    "ApplyNewColor": {
      "cat": "Per aplicar un nou color feu un clic directament sobre el color desitjat",
	    "spa": "Para aplicar un nuevo color haga clic directamente sobre el color deseado",
	    "eng": "To apply a new color, please click on the wished color",
	    "fre": "Pour appliquer une nouvelle couleur, faire clic sur la couleur désirée",
      "cze": "Chcete-li použít novou barvu, klikněte na požadovanou barvu",
      "ger": "Für eine Farbänderung, klicken Sie bitte auf die gewünschte Farbe"
    }
  },
  "config": {
    // Totes les claus d'aquesta secció "config" no estan en anglès perque corresponen a les paraules reservades definides per Layers -> name, com ara llegenda, situacio, coord, etc
    "llegenda": {
      "cat": "Llegenda i control de les capes",
      "spa": "Leyenda y control de capas",
      "eng": "Legend & layer control",
      "fre": "Contrôle des légendes et des couches",
      "cze": "Legenda a ovládání vrstev",
      "ger": "Legenden und Layerkontrolle"
    },
    "coord": {
      "cat": "Posició actual",
	  "spa": "Posición actual",
	  "eng": "Current position",
      "fre": "Position actuelle",
      "cze": "Současná pozice",
      "ger": "aktuelle Position"
    },
    "situacio": {
      "cat": "Mapa de situació",
	  "spa": "Mapa de situación",
	  "eng": "Situation map",
      "fre": "Carte de situation",
      "cze": "Situační mapa",
      "ger": "Übersichtskarte"
    }
  }
}
