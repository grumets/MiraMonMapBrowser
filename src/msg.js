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
  close: {"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"},
	Close: {"cat":"Tancar", "spa":"Cerrar", "eng":"Close", "fre":"Quitter"},
  UnderDevelopment: {"cat":"En desenvolupament.", "spa":"En desarrollo.", "eng":"Under development.", "fre":"En développement."},
  layer: {"cat":"capa", "spa":"capa", "eng":"layer", "fre":"couche"},
  Layer: {"cat":"Capa", "spa":"Capa", "eng":"Layer", "fre":"Couche"},
  LayerId: {"cat":"Identificador de la capa", "spa":"Identificador de la capa", "eng":"Layer identifier", "fre":"Identificateur de couche"},
  Layers: {"cat":"Capes","spa":"Capas","eng":"Layers","fre":"Couches"},
	TheLayer: {"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"},
	TheLayer_: {"cat":"La capa ", "spa":"La capa ", "eng":"Layer ", "fre":"La couche "},
	_ofTheLayer_: {"cat": " de la capa ", "spa": " de la capa ", "eng": " of the layer ", "fre":" de la couche "},
	ofTheLayer: {"cat": "de la capa", "spa": "de la capa", "eng": "of the layer", "fra": "de la couche"},
  Add: {"cat":"Afegir", "spa":"Añadir", "eng":"Add", "fre":"Ajouter"},
	Cancel: {"cat":"Cancel·lar", "spa":"Cancelar", "eng":"Cancel", "fre":"Annuler"},
  Expression: {"cat":"Fórmula", "spa":"Fórmula:", "eng":"Expression", "fre":"Formule"},
  Value: {"cat":"Valor", "spa":"Valor", "eng":"Value", "fre":"Valeur"},
	TheValue_:{"cat":"El valor ", "spa":"El valor ", "eng":"The value ", "fre":"La valeur "},
  Operator: {"cat":"Operador", "spa":"Operador", "eng":"Operator", "fre":"Opérateur"},
  Date: {"cat":"Data", "spa":"Fecha", "eng":"Date", "fre":"Date"},
  Field: {"cat":"Camp", "spa":"Camp", "eng":"Field", "fre":"Champ"},
	_ofTheField_:{"cat":" del camp ", "spa": " del campo ", "eng": " of the field ", "fre": " du champ "},
  Title: {"cat":"T&iacute;tol", "spa":"T&iacute;tulo", "eng":"Title", "fre":"Titre"},
  Condition: {"cat":"Condició", "spa":"Condición", "eng":"Condition", "fre":"Condition"},
  OK: {"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"},
  Presentation: {"cat":"Presentació", "spa":"Presentación","eng":"Presentation", "fre":"Présentation"},
  Graphical: {"cat":"Gràfica", "spa":"Gráfica", "eng":"Graphical", "fre":"Graphique"},
  Textual: {"cat":"Textual", "spa":"Textual", "eng":"Textual", "fre":"Textuelle"},
  Unsorted: {"cat":"Cap", "spa":"Ninguno", "eng":"Unsorted", "fre":"Non trié"},
  ColorPalette: {"cat":"Paleta de colors", "spa":"Paleta de colores", "eng":"Color palette", "fre":"Palette de couleurs"},
  Current: {"cat": "Actual", "spa": "Actual", "eng": "Current", "fre": "Actuel"},
  Previous: {"cat": "Prèvia", "spa": "Previa", "eng": "Previous", "fre": "Précédente"},
  LayerName:{"cat":"Nom de la capa", "spa":"Nombre de la capa", "eng":"Name of the layer", "fre":"Nom de la couche"},
  ModalClass: {"cat": "Classe modal", "spa": "Clase modal", "eng": "Modal class", "fre": "Classe modale"},
  PercentageMode: {"cat": "Percentatge de la moda", "spa": "Porcentaje de la moda", "eng": "Percentage of the mode", "fre": "Pourcentage de mode"},
  Sum: {"cat": "Suma", "spa": "Suma", "eng": "Sum", "fre": "Somme"},
  SumArea: {"cat": "Suma àrea", "spa": "Suma área", "eng": "Sum area", "fre": "Somme area"},
  Mean: {"cat": "Mitjana", "spa": "Media", "eng": "Mean", "fre": "Moyenne"},
  Variance: {"cat": "Variança", "spa": "Varianza", "eng": "Variance", "fre": "Variance"},
  StandardDeviation: {"cat": "Desviació estàndard", "spa": "Desviació estándar", "eng": "Standard deviation", "fre": "Écart-type"},
  Minimum: {"cat":"Mínim", "spa":"Mínimo", "eng":"Minimum", "fre":"Minimum"},
	Maximum: {"cat":"Màxim", "spa":"Máximo", "eng":"Maximum", "fre":"Maximum"},
  Range: {"cat": "Rang", "spa": "Rango", "eng": "Range", "fre": "Gamme"},
  SortingOrder: {"cat":"Ordre", "spa":"Orden","eng":"Sorting order", "fre":"Ordre de tri"},
  Others: {"cat":"Altres", "spa":"Otros", "eng":"Others", "fre":"Autres"},
	Link: {"cat":"Enllaç", "spa":"Enlace", "eng":"Link", "fre":"Relier"},
	Point: {"cat":"Punt", "spa":"Punto", "eng":"Point", "fre":"Point"},
	Query: {"cat":"Consulta", "spa":"Consulta", "eng":"Query","fre":"Recherche"},
	Select: {"cat":"Seleccionar", "spa":"Seleccionar", "eng":"Select", "fre":"Sélectionner"},
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
		ofEditingStyle: {"cat":"de editar l'estil", "spa":"de editar el estilo", "eng":"of editing the style", "fre":"pour modifier le style"},
    StyleName: {"cat":"Nom de l'estil", "spa":"Nombre del estilo", "eng":"Name of the style", "fre":"Nom du style"},
		ConfusionMatrix: {"cat":"Matriu de confusió", "spa":"Matriz de confusión", "eng":"Confusion matrix", "fre":"Matrice de confusion"},
		ContingencyTable: {"cat":"Taula de contingència", "spa":"Tabla de contingencia", "eng":"Contingency table", "fre":"Tableau de contingence"},
		StatisticByCategory: {"cat": "Estadístic per categoria", "spa": "Estadístico por categoria", "eng": "Statistic by category", "fre": "Statistique par catégorie"},
		Statistic: {"cat": "Estadístic", "spa": "Estadístico", "eng": "Statistic", "fre": "Statistique"},
		Surface: {"cat":"Superfície", "spa":"Superficie", "eng":"Surface", "fre":"Surface"},
		RGBCombination: {"cat":"Combinació RGB", "spa":"Combinación RGB", "eng":"RGB combination", "fre":"Combinaison RVB"},
		Reclassification: {"cat":"Reclassificació", "spa":"Reclasificación", "eng":"Reclassification", "fre":"Reclassement"},
    RetrieveStyles: {"cat":"Recupera estils", "spa":"Recupera estilos", "eng":"Retrieve styles", "fre":"Récupérer les styles"},
    ShareStyle: {"cat":"Compartir estil", "spa":"Compartir estilo", "eng":"Share style", "fre":"Partager style"},
    DeleteStyle: {"cat":"Esborrar estil", "spa":"Borrar estilo", "eng":"Delete style", "fre":"Effacer style"},
    ComputeQuality: {"cat":"Calcula la qualitat", "spa":"Calcula la calidad", "eng":"Compute the quality", "fre":"Calculer la qualité"},
		toComputeTheQuality: {"cat":"de calcular la qualitat", "spa":"de calcular la calidad", "eng":"to compute the quality", "fre":"pour calculer la qualité"},
		NewLayerAdded: {"cat":"La nova capa afegida", "spa":"La nueva capa añadida", "eng":"The new added layer", "fre":"La nouvelle couche ajoutée"},
		notVisibleInCurrentZoom: {"cat":"no és visible al nivell de zoom actual del navegador", "spa":"no es visible al nivel de zoom actual del navegador", "eng":"is not visible in the current zoom level of the browser", "fre":"n'est pas visible au niveau du zoom actuel du navigateur"},
		toTheLayer: {"cat":"a la capa", "spa":"a la capa", "eng":"to the layer", "fre":"à la couche"},
    containsReferencesEraseContinue: {"cat":"conté referències a la capa que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias a la capa que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références à la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"},
    containsReferencesStyleEraseContinue: {"cat":"conté referències a l'estil que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias al estilo que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the style that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références au style que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"},
		ChooseTwoDifferentLayers: {"cat":"Cal triar dues capes diferents o la mateixa en estils i/o dates diferents.", "spa":"Es necesario elegir dos capas diferentes o la misma en estilos y/o fechas diferentes.", "eng":"You should choose two different layers or the same in different styles and/or dates.", "fre": "You should  choose two different layers or the same in different styles and/or dates."},
    CombinationOf: {"cat": "Combinació de ", "spa": "Combinación de ", "eng": "Combination of ", "fre": "Combination of "},
    byCategoryOf: {"cat":"per categoria de","spa":"por categorías de","eng":"by category of", "fre":"par catégorie de"},
    byCategoriesOf: {"cat":"per les categories de", "spa":"para las categorías de", "eng":"by categories of", "fre":"par catégories des"},
		withStatisticsOf:{"cat":" amb estadistics de ","spa":" con estadísticos de ","eng":" with statistics of ", "fre":" avec statistiques par "},
		WrongNumberElementsInLine: {"cat": "Nombre d'elements incorrecte a la línia", "spa": "Número de elementos incorrecto en la línea", "eng": "Wrong number of elements in line","fre": "Wrong number of elements in line"},
		WrongValuesFormatInLine: {"cat": "Format incorrecte dels valors a la línia", "spa": "Formato incorrecto de los valores en la línea", "eng": "Wrong values format in line", "fre": "Wrong values format in line"},
		WrongOldValueInLine: {"cat": "Valor a canviar incorrecte a la línia", "spa": "Valor a cambiar incorrecto en la línea", "eng": "Wrong old value in line", "fre": "Ancienne valeur erronée dans la ligne"},
		CannotObtainValidResponseFromServer: {"cat":"No s'ha obtingut cap resposta vàlida del servidor sol·licitat", "spa":"No se ha obtenido ninguna respuesta válida del servidor solicitado", "eng":"Cannot obtain any valid response from server", "fre":"Aucune réponse valide n'a été obtenue du serveur demandé"},
    ServerURL: {"cat":"URL del servidor:", "spa":"URL del servidor:", "eng":"server URL:", "fre":"URL du serveur:"},
    SelectAllLayers: {"cat":"Seleccionar totes les capes", "spa":"Seleccionar todas las capas", "eng":"Select all layers", "fre":"Sélectionner toutes les couches"},
		ServerNotHaveLayerInBrowserReferenceSystem: {"cat":"Aquest servidor no té cap capa disponible en el sistema de referència actual del navegador", "spa":"Este servidor no tiene ninguna capa disponible en el sistema de referéncia actual del navegador", "eng":"This server don't have any layer in the browser actual reference system", "fre":"Ce serveur n'a aucune couche disponible dans le système de référence actuel du navigateur"},
		ValidURLMustBeProvided: {"cat":"Cal indicar una adreça vàlida", "spa":"Se debe indicar una dirección válida","eng":"A valid URL must be provided","fre":"Vous devez indiquer une adresse valide"},
    ChooseOneFromList: {"cat":"Seleccciona'n un de la llista", "spa":"Escoja uno de la lista","eng": "Choose one from list", "fre":"Sélectionnez un objet de la liste"},
		toShowInformationOrHelp: {"cat":"per mostrar informació o ajuda", "spa":"para mostrar información o ayuda","eng":"to show information or help", "fre":"pour afficher des informations ou de l'aide"},
		AddReclassifiedLayerAsNewStyle: {"cat":"Afegeix capa reclassificada com un nou estil", "spa":"Añada capa reclasificada como un nuevo estilo","eng":"Add reclassified layer as a new style", "fre":"Ajouter une couche reclassée en tant que nouveau style"},
    LayerToReclassify: {"cat":"Capa a reclassificar", "spa":"Capa a reclasificar", "eng":"Layer to reclassify", "fre":"Couche à reclassifier"},
    ReclassifyingExpression: {"cat":"Fórmula de reclassificació", "spa":"Fórmula de reclasificación:", "eng":"Reclassifying expression", "fre":"Formule de reclassement"},
		ResultOfReclassificationAddedAsNewStyleWithName: {"cat":"El resultat de la reclassificació serà afegit com a un estil nou de nom", "spa":"El resultado de la reclasssificación será añadido como un estilo nuevo de nombre", "eng":"The result of the reclassification will be added as a new style with name", "fre":"Le résultat du reclassement sera ajouté en tant que nouveau style avec le nom"},
    LayerForExpression: {"cat":"Capa per a la fórmula", "spa":"Capa para la fórmula", "eng":"Layer for the expression", "fre":"Couche pour l'expression"},
    WriteInExpression: {"cat":"Escriu a la fórmula", "spa":"Escribe en fórmula", "eng":"Write in expression", "fre":"Ecrire à la formule"},
    OperatorsFunctionsForExpression: {"cat":"Operadors i funcions per a la fórmula", "spa":"Operadores y funciones para la fórmula", "eng":"Operators and functions for the expression", "fre":"Opérateurs et fonctions pour l'expression"},
    ResultOfSelectionAddedAsNewLayerStyleWithName: {"cat":"El resultat de la selecció serà afegit com a una capa/estil nou de nom", "spa":"El resultado de la selección será añadido como una capa/estilo nuevo de nombre", "eng":"The result of the selection will be added as a new layer/style with name", "fre":"Le résultat de la sélection sera ajouté en tant que nouveau couche/style avec le nom"},
    AddGeometricOverlayLayerBetweenTwoCategoricalLayers: {"cat":"Afegir una capa de superposició geomètrica entre dues capes categòriques", "spa":"Añadir una capa de superposición geométrica entre dos capas categóricas", "eng":"Add a geometric overlay layer between two categorical layers", "fre":"Ajouter un couche de superposition géométrique entre deux couche catégoriels"},
    AddGeometricOverlay: {"cat":"Afegir superposició geomètrica", "spa":"Añadir superposición geométrica", "eng":"Add geometric overlay", "fre":"Ajouter une superposition géométrique"},
    AddStatisticalFieldsToCategoricalLayerFromAnotherLayer: {"cat":"Afegir camps estadístics a una capa categòrica des d'una altra capa (de qualsevol tipus)", "spa":"Añada capa combinada a partir de dues capas existentes", "eng":"Add statistical fields to a categorical layer from another layer (of any type)", "fre":"Ajouter des champs statistiques à une couche catégorielle à partir d'une autre couche (de tout type)"},
    AddStatisticalFields: {"cat":"Afegir camps estadíscs", "spa":"Añadir campos estadísticos", "eng":"Add statistical fields", "fre":"Ajouter des champs statistiques"},
    NewLayerFromServer:{"cat":"Capa nova de servidor", "spa":"Capa nueva de servidor:", "eng":"New layer from server", "fre":"Nouvelle couche du serveur"},
    SpecifyServerURL: {"cat":"Especifica l'adreça URL del servidor", "spa":"Especifique la dirección URL del servidor", "eng":"Specify the server URL", "fre":"Spécifiez l'adresse URL du serveur"},
    orChooseOnFromServiceList: {"cat":"o Seleccciona'n un de la llista de serveis", "spa":"o Escoja uno de la lista de servicios", "eng":"or Choose one from service list", "fre":"ou sélectionnez un des services de la liste"},
		ofAddingLayerToBrowser: {"cat":"d'afegir capes al navegador", "spa":"de añadir capas al navegador", "eng":"of adding a layer to browser", "fre":"pour ajouter des couches au navigateur"},
		toMakeCalculationsOfLayers: {"cat":"per fer càlculs de capes", "spa":"para hacer cálculos de capas", "eng":"to make calculations of layers", "fre":"pour réaliser de calculs des couches"},
		toCombineLayers: {"cat":"per combinar capes", "spa":"para combinar capas", "eng":"to combine layers", "fre":"pour correspondre des couches"},
		toReclassifyLayer: {"cat":"per reclassificar la capa", "spa":"para reclasificar la capa", "eng":"to reclassify the layer", "fre":"pour reclassifier de couche"},
    WriteValueInExpression: {"cat":"Escriu valor a la fórmula", "spa":"Escribe valor en fórmula", "eng":"Write value in expression", "fre":"Écrire une valeur dans l'expression"},
    RecommendedRangeOfValues: {"cat":"Interval de valors recomenats", "spa":"Intervalo de valores recomendados", "eng":"Recommended range of values", "fre":"Intervalle des valeurs recommandées"},
    anyValue: {"cat":"qualsevol valor", "spa":"cualquier valor", "eng":"any value", "fre":"toute valeur"},
    constant: {"cat":"constant", "spa":"constante", "eng":"constant", "fre":"constant"},
    SelectedInLayer: {"cat":"Seleccionada a la capa", "spa":"Seleccionada en la capa", "eng":"Selected in the layer", "fre":"Sélectionné dans la couche"},
    byDefault: {"cat":"per defecte","spa":"por defecto","eng":"by default", "fre":"par défaut"},
		OnlyShowValuesOfLayer: {"cat":"Mostra només els valors de la capa", "spa":"Muestra solo los valores de la capa", "eng":"Only show the values of the layer", "fre":"Afficher uniquement les valeurs de la couche"},
    ofTheStyle: {"cat":"de l'estil", "spa":"del estil", "eng":"of the style", "fre":"du style"},
    ofTheField: {"cat":"del camp", "spa":"del campo", "eng":"of the field", "fre":"du champ"},
		thatConformFollowingConditions: {"cat":"que complexien les condicions següents", "spa":"que cumplen las siguientes condiciones", "eng":"that conform the following conditions", "fre":"qui se conforment aux conditions suivantes"},
    NexusWithNextCondition: {"cat":"Nexe amb la següent condició", "spa":"Nexo con la siguiente condición", "eng":"Nexus with next condition", "fre":"Nexus avec la prochaine condition"},
    none: {"cat":"cap", "spa":"ninguno", "eng":"none", "fre":"aucun"},
    _and_: {"cat": " i ", "spa": " y ", "eng": " and ", "fre": " et "},
    and: {"cat": "i", "spa": "y", "eng": "and", "fre": "et"},
    or: {"cat":"o", "spa":"o", "eng":"or", "fre":"ou"},
    TheResultOfSelectionAddedAsNewStyleWithName: {"cat":"El resultat de la selecció serà afegit com a un estil nou de nom", "spa":"El resultado de la selección será añadido como un estilo nuevo de nombre", "eng":"The result of the selection will be added as a new style with name", "fre":"Le résultat de la sélection sera ajouté en tant que nouveau style avec le nom"},
		ofQueryByAttributeSelectionByCondition: {"cat":"de selecció per condició","spa":"de selección por condición", "eng":"of query by attribute selection by condition", "fre":" pour sélection par condition"},
		ofRGBCombination: {"cat":"de combinació RGB", "spa":"de combinación RGB", "eng":"of RGB combination", "fre":"pour combinaison RVB"},
    SelectThreeComponentsOfLayer: {"cat":"Sel·lecciona les 3 components de la capa", "spa":"Selecciona las 3 componentes de la capa", "eng":"Select the three components of the layer", "fre":"Sélectionnez les trois composants de la couche"},
    Component: {"cat":"Component", "spa":"Componente", "eng":"Component", "fre":"Composant"},
    RGBCombinationAddedAsNewStyleWithName: {"cat":"La combinació RGB serà afegida com a un estil nou de nom", "spa":"La combinación RGB será añadida como un estilo nuevo de nombre", "eng":"The RGB combination will be added as a new style with name", "fre":"La combinaison RVB sera ajouté en tant que nouveau style avec le nom"},
		SelectionStatisticValue: {"cat":"Selecció del valor estadístic", "spa":"Selección del valor estadístico","eng":"Selection of statistic value", "fre":"Sélection de la valeur statistique"},
		StatisticalValueToDisplayForLayer: {"cat":"Valor estadístic a mostrar per la capa", "spa":"Valor estadístico para mostrar para la capa", "eng":"Statistical value to display for the layer", "fre":"Valeur statistique à afficher pour la couche"},
    StatisticalValueOf: {"cat":"Valor estadístic de", "spa":"Valor estadístico de", "eng":"Statistical value of", "fre":"Valeur statistique des"},
    Ascending: {"cat":"Ascendent", "spa":"Ascendiente", "eng":"Ascending", "fre":"Ascendant"},
    Descending: {"cat":"Descendent", "spa":"Descendiente", "eng":"Descending", "fre":"Descendant"},
    CannotEditStyleNeverVisualized: {"cat":"No es pot editar un estil no visualitzat", "spa":"No es puede editar un estilo no visualizado", "eng":"You cannot edit a style never visualized", "fre":"Vous ne pouvez pas éditer un style jamais visualisé"},
    StyleLayer: {"cat":"Estil de la capa", "spa":"Estilo de la capa", "eng":"Style of the layer", "fre":"Style de la couche"},
    ValueForStretchingColor: {"cat":"Valors per l'estirament de color", "spa":"Valores para el estiramiento de color", "eng":"Value for stretching of color", "fre":"Valeur pour l'étirement de la couleur"},
    computed: {"cat":"calculat", "spa":"calculado", "eng":"computed", "fre":"calculé"},
    Adopt: {"cat":"Adoptar", "spa":"Adoptar", "eng":"Adopt", "fre":"Adopter"},
    SunPositionForComputationIllumination: {"cat":"Posició del sol pel càlcul de la il·luminació", "spa":"Posició del sol para el cálculo de la iluminación", "eng":"Sun position for the computation of the illumination", "fre":"Position du soleil par le calcul de l'éclairement"},
    Azimuth: {"cat":"Azimut", "spa":"Azimut", "eng":"Azimuth", "fre":"Azimut"},
    originNorthNorthClockwiseDegress: {"cat":"origen al nord nord i en sentit horari (en graus)", "spa":"origen en el norte norte y en el sentido de las agujas del reloj (en grados)", "eng":"origin north north and clockwise (in degress)", "fre":"origine au nord nord et dans le sens des aiguilles d'une montre (en degrés)"},
		Elevation: {"cat":"Elevació", "spa":"Elevación", "eng":"Elevation", "fre":"Élévation"},
    fromGroundDegress: {"cat":"des del terra (en graus)", "spa":"desde el suelo (en grados)", "eng":"from the ground (in degress)", "fre":"à partir du sol (en degrés)"},
    ReliefExaggerationFactor: {"cat":"Factor d'exageració del relleu", "spa":"Factor de exageración del relieve", "eng":"Relief exaggeration factor", "fre":"Facteur d'exagération du relief"},
    Greyscale: {"cat": "Escala de grisos", "spa": "Escala de grises", "eng": "Greyscale", "fre": "Niveaux de gris"},
    IncorrectAzimuth: {"cat":"Azimut incorrecte. Hauria de ser un número entre 0 i 360. Aplicant el valor per defecte", "spa":"Azimut incorrecto. Debería ser un número entre 0 y 360. Aplicando el valor por defecto", "eng":"Incorrect azimuth. It should be a number between 0 and 360. Applying the default value", "fre":"Azimut incorrect. Il doit s'agir d'un nombre compris entre 0 et 360. Application de la valeur par défaut"},
    IncorrectElevation:{"cat":"Elevació incorrecta. Hauria de ser un número entre 0 i 90. Aplicant el valor per defecte", "spa":"Elevación incorrecta. Debería ser un número entre 0 y 90. Aplicando el valor por defecto", "eng":"Incorrect elevation. It should be a number between 0 and 90. Applying the default value", "fre":"Élévation incorrect. Il doit s'agir d'un nombre compris entre 0 et 90. Application de la valeur par défaut"},
    IncorrectReliefExaggerationFactor: {"cat":"Factor d'exageració del relleu incorrecte. Hauria de ser un número major de 0.0001. Aplicant el valor per defecte", "spa":"Factor de exageración del relieve incorrecta. Debería ser un número mayor que 0.0001. Aplicando el valor por defecto", "eng":"Incorrect relief exaggeration factor. It should be a number bigger than 0.0001. Applying the default value", "fre":"Facteur d'exagération du relief incorrect. Il doit s'agir d'un nombre supérieur à 0,0001. Application de la valeur par défaut"},
		ofModifingName: {"cat":"de modificar el nom", "spa":"de modificar el nombre", "eng":"of modifing the name", "fre":"pour modifier le nom"},
    LayerNameInLegend: {"cat":"Nom de la capa a la llegenda", "spa":"Nombre de la capa en la leyenda", "eng":"Name of the layer in the legend", "fre":"Nom de la couche dans la légende"},
		forShowingLinageInformation: {"cat":"de mostrar la informació del llinatge", "spa":"de mostrar la información del linaje", "eng":"for showing the linage information", "fre":"pour afficher les informations de lignage"},
		forShowingQualityInformation: {"cat":"de mostrar la informació de qualitat", "spa":"de mostrar la información de calidad", "eng":"for showing the quality information", "fre":"pour afficher l'information de qualité"},
		ofUserFeedback: {"cat":"de valoracions dels usuaris", "spa":"de valoraciones de los usuarios", "eng":"of user feedback", "fre":"pour la rétroaction de l'utilisateur"},
	  _withStatisticOf_: {"cat":" amb estadistics de ","spa":" con estadísticos de ","eng":" with statistic of ", "fre":" avec statistiques des "},
		StatisticalDescriptorDisplayNeedSelected: {"cat":"Cal sel·leccionar el descriptor estadístic a mostrar per la capa", "spa":"Debe seleccionar el descriptor estadístico para mostrar para la capa", "eng":"The statistical descriptor to display for the layer needs to be selected", "fre":"Le descripteur statistique à afficher pour la couche doit être sélectionné"}
	},
  storymap:{
		SelectStory: {"cat":"Selecciona una història", "spa":"Selecciona una historia", "eng":"Select a story", "fre":"Sélectionnez une histoire"},
		WrongFormat_mm_center_Parameter: {"cat":"Format del paràmetre mm-center incorrecte", "spa":"Formato del parametro mm-center icnorrecto", "eng":"Wrong format in mm-center parameter", "fre":"Format incorrect dans le paramètre mm-center"},
		ParameterValueFoundIs: {"cat":"El valor del paràmetre indicat és:", "spa":"El valor del parámetro indicado es:", "eng":"The parameter value found is:", "fre":"La valeur de paramètre trouvée est:"},
		WrongFormat_mm_time_Parameter: {"cat":"Format del paràmetre mm-time incorrecte", "spa":"Formato del parámetro mm-time icnorrecto", "eng":"Wrong format in mm-time parameter", "fre":"Format incorrect dans le paramètre mm-time"}
	},
	tresD:{
		Dynamic: {"cat":"Dinàmic", "spa":"Dinámico", "eng":"Dynamic", "fre":"Dynamique"},
		Disabled: {"cat":"Desactivat (capa o estil no visible)", "spa":"Desactivado (capa o estil no visible)", "eng":"Disabled (layer or style not visible)", "fre":"Désactivé (couche or style non visible)"},
		Graphic_3D: {"cat":"Gràfic 3D", "spa":"Gráfico 3D", "eng":"3D Graphic", "fre":"Diagramme 3D"},
		VerticalScale: {"cat":"Escala vertical", "spa":"Escala vertical", "eng":"Vertical scale", "fre":"Échelle verticale"},
  },
	canviprj:{
		LongLatConversionNotImplementedforRefSys: {"cat":"Pas a longitud/latitud no implementat per aquest sistema de referència", "spa":"Paso a longitud/latitud no implementado para este sistema de referencia", "eng":"Longitude/latitude conversion has not been implemented for this reference system", "fre":"Conversion à longitude/latitude pas implémenté pour ce système de référence"},
		MapCoordConversionNotImplementedInRefSys: {"cat":"Pas a coordenades mapa no implementat per aquest sistema de referència", "spa":"Paso a coordenades mapa no implementado para este sistema de referencia", "eng":"Map coordinates conversion has not been implemented for this reference system", "fre":"Conversion à coordonnées de la carte pas implémenté pour ce système de référence."},
		LambertConformalConicZoneIII_NTF: {"cat":"Lambert Cònica Conforme Zona III - NTF", "spa":"Lambert Cónica Conforme Zona III - NTF", "eng":"Lambert Conformal Conic Zone III - NTF", "fre":"Lambert Conique Conforme Zone III –NTF"},
		LambertConformalConicZoneIIext_NTF: {"cat":"Lambert Cònica Conforme Zona IIext - NTF", "spa":"Lambert Cónica Conforme Zona IIext - NTF", "eng":"Lambert Conformal Conic Zone IIext - NTF", "fre":"Lambert Conique Conforme Zone IIext–NTF"},
		LambertConformalConicZoneIIIext_NTF: {"cat":"Lambert Cònica Conforme Zona IIIext - NTF", "spa":"Lambert Cónica Conforme Zona IIIext - NTF", "eng":"Lambert Conformal Conic Zone IIIext - NTF", "fre":"Lambert Conique Conforme Zone IIIext –NTF"},
		LambertConformalConicICCMediterranianRegion: {"cat":"Lambert Cònica Conforme ICC Regió Mediterrània", "spa":"Lambert Cónica Conforme ICC Región Mediterránea", "eng":"Lambert Conformal Conic ICC Mediterranian Region", "fre":"Lambert Conique Conforme ICC Région Méditerranéenne"},
		MercatorParallel_41d25m_ED50: {"cat":"Mercator paral·lel 41° 25' - ED50", "spa":"Mercator paralelo 41°25' - ED50", "eng":"Mercator parallel 41°25' - ED50",  "fre":"Mercator parallèle 41°25' - ED50"},
		MercatorParallel_41d25m_WGS84: {"cat":"Mercator paral·lel 41° 25' - WGS84", "spa":"Mercator paralelo 41°25' - WGS84", "eng":"Mercator parallel 41°25' - WGS84", "fre":"Mercator parallèle 41°25' - WGS84"},
		MercatorParallel_40d36m_ED50: {"cat":"Mercator paral·lel 40° 36' - ED50", "spa":"Mercator paralelo 40°36' - ED50", "eng":"Mercator parallel 40°36' - ED50", "fre":"Mercator parallèle 40°36' – ED50"},
		MercatorParallelEquator_ED50: {"cat":"Mercator paral·lel Equador - ED50", "spa":"Mercator paralelo Ecuador - ED50", "eng":"Mercator parallel Equator - ED50", "fre":"Mercator parallèle Equateur – ED50"},
		MercatorParallelEquator_WGS84: {"cat":"Mercator paral·lel Equador - WGS84", "spa":"Mercator paralelo Ecuador - WGS84", "eng":"Mercator parallel Equator - WGS84", "fre":"Mercator parallèle Equateur- WGS84"},
		WebMercator: {"cat":"Web Mercator", "spa":"Web Mercator", "eng":"Web Mercator", "fre":"Web Mercator"},
	},
	capavola:{
    Proj: {"cat":"Proj", "spa":"Proy", "eng":"Proj","fre":"Proj"},
		DeviceLocation: {"cat":"Ubicació dispositiu", "spa":"Ubicación dispositivo", "eng":"Device location","fre":"Emplacement de l'appareil"},
		AroundZone: {"cat":"Zona al voltant (m):", "spa":"Zona alrededor (m):", "eng":"Around zone (m):","fre":"Zone autour (m):"},
		GoTo: {"cat":"Anar-hi", "spa":"Ir", "eng":"Go to","fre":"Aller à"},
		ofGoToCoordinate: {"cat":"d'anar a coordenada", "spa":"de ir a coordenada", "eng":"of go-to coordinate", "fre":"pour aller à la coordonnée"},
		RequestedPointOutsideBrowserEnvelope: {"cat":"El punt sol·licitat està fora de l'àmbit de navegació", "spa":"El punto solicitado está fuera del ámbito de navegación", "eng":"The requested point is outside browser envelope", "fre":"Le point requis se trouve dehors le milieu de navigation"},
		toInsertNewPoints: {"cat":"per inserir punts nous", "spa":"para insertar puntos nuevos", "eng":"to insert new points", "fre":"pour insérer de nouveaux points"},
		UserDeniedRequestGeolocation: {"cat":"L'usuari ha denegat la sol·licitud de geolocalització", "spa":"El usuario ha denegado la solicitud de geolocalización", "eng":"User denied the request for geolocation","fre":"L'utilisateur a refusé la demande de géolocalisation"},
		LocationInfoUnavailable: {"cat":"La informació sobre la ubicació no està disponible", "spa":"La información sobre la ubicación no está disponible", "eng":"Location information is unavailable","fre":"Les informations de localisation ne sont pas disponibles"},
		RequestGetUserLocationTimedOut: {"cat":"S'ha esgotat el temps d'espera de la sol·licitud per obtenir la ubicació de l'usuari", "spa":"Se ha agotado el tiempo de espera de la solicitud para obtener la ubicación del usuario", "eng":"Request to get user location timed out","fre":"La demande d’obtention de l’emplacement de l’utilisateur a expiré"},
		UnknownErrorObtainingLocation: {"cat":"S'ha produït un error desconegut durant l'obtenció de la ubicació", "spa":"Se ha producido un error desconocido durante la obtención de la geolocalización", "eng":"An unknown error occurred while obtaining the location","fre":"Une erreur inconnue s'est survenue lors de l'obtention de l'emplacement"},
		CoordFormatIncorrectly: {"cat":"Format de les coordenades erroni:S'ha d'indicar un valor numèric.", "spa":"Formato de las coordenadas erróneo:Se debe indicar un valor numérico.", "eng":"Coordinate format is incorrectly:It must indicate a numeric value.", "fre":"Format des coordonnées erroné:Vous devez indiquer une valeur numérique."},
  },
	commands:{
		ZoomSizeFormatIncorrectly: {"cat":"Format del valor del costat de zoom erroni:S'ha d'indicar un valor numèric.", "spa":"Formato del lado de zoom erróneo:Se debe indicar un valor numérico.", "eng":"Zoom size format is incorrectly:It Must indicate a numeric value.", "fre":"Format des zoom erroné:Vous devez indiquer une valeur numérique."},
		ZoomSizeRequestedNotAvailableBrowser: {"cat":"El costat de zoom sol·licitat no és un dels costats disponibles en aquest navegador.", "spa":"El lado de zoom solicitado no es uno de los lados disponibles en este navegador.", "eng":"The zoom size requested is not available in this browser.", "fre":"	La taille de zoom demandée n'est pas disponible dans ce navigateur."},
		CoordFormatIncorrectly: {"cat":"Format de les coordenades erroni:S'ha d'indicar dos valors numèrics en el format: ", "spa":"Formato de las coordenadas erróneo:Se debe indicar dos valores numéricos en el formato: ", "eng":"Coordinate format is incorrectly:Two numerical values are required in the format: ", "fre":"Format des coordonnées erroné:Deux valeurs numériques sont requises dans le format: "},
	},
	consola:{
		ofWatchingReportsConsole: {"cat":"de veure els informes de la consola",  "spa":"de ver los informes de la consola", "eng":"of watching the reports in the console", "fre":"pour regarder les rapports dans la console"},
		DeleteAll: {"cat":"Esborra-ho tot", "spa":"Borrar todo", "eng":"Delete all","fre":"Tout effacer"},
  },
	consult:{
		NoDataForRequestedPoint: {"cat":"No hi ha dades pel punt consultat", "spa":"No hay datos para el punto consultado", "eng":"There are no data for the requested point", "fre":"Pas de données au point consulté"},
		_andActiveQueryableLayers: {"cat":" i les capes consultables actives", "spa":" y las capas consultables activas", "eng":" and active queryable layers", "fre":" et les couches consultables activées"},
		ChartValueCopiedClipboardFormat: {"cat": "Els valors del gràfic han estat copiats al portaretalls en format", "spa": "Los valores del gráfico han sido copiados al portapapeles en formato", "eng": "The values of the chart have been copied to clipboard in the format", "fre": "Les valeurs du graphique ont été copiées dans le presse-papiers dans le format"},
		tabSeparatedText: {"cat": "text separat per tabulacions", "spa": "texto separado por tabulaciones", "eng": "tab-separated text", "fre": "texte séparé par des tabulations"},
		MessagesNotDisplayedAgain: {"cat": "Aquests missatge no es tornarà a mostrar", "spa": "Este mensaje no se volverá a mostrar", "eng": "These messages will not be displayed again", "fre": "Ces messages ne seront plus affichés"},
		CopySeriesValues: {"cat":"Copia valors de la sèrie", "spa":"Copiar valores de la serie", "eng":"Copy series values","fre":"Copier les valeurs des séries"},
		FollowingCoordinateSelected: {"cat":"S'ha seleccionat la següent coordenada:","spa":"Se ha seleccionado la siguiente coordenada:", "eng":"The following coordinate has been selected:", "fre":"La coordonnée suivante a été sélectionnée:"},
		IfCorrectValidateIt: {"cat":"Si és correcte, ja la pot validar.", "spa":"Si es correcta, ya la puede validar.", "eng":"If it is correct, you can already validate it.", "fre":"Si correcte, vous pouvez la valider."},
		BrowserClosedReturnForm: {"cat":"Es tancarà la finestra de navegació i tornarà al formulari.", "spa":"Se cerrará la ventana de navegación y volverá al formulario.", "eng":"Browser window will be closed and will return to form.", "fre":"La fenêtre du navigateur va se fermer et vous serez redirigés vers le formulaire."},
		IfIncorrectClicksViewAgain: {"cat":"Si és incorrecte, torni a clicar sobre la vista.", "spa":"Si es incorrecta, vuelva a cliquear sobre la vista.", "eng":"If it is incorrect, click on the view again.", "fre":"Si incorrecte, cliquez une autre fois sur la vue."},
		ValidateCoordinate: {"cat":"Validar Coordenada","spa": "Validar Coordenada", "eng":"Validate Coordinate","fre":"Valider coordonnée"},
		WaitingForData_: {"cat":"Esperant dades...", "spa":"Esperando datos...", "eng":"Waiting for data...", "fre":"En attente des données..."},
		ProfileTransversalCutQueriedLine: {"cat": "Perfil del tall transversal de la línia consultada", "spa": "Perfil del corte transversal de la línea consultada", "eng": "Profile of the transversal cut of the queried line", "fra": "Profil de la coupe transversale de la ligne interrogée"},
		PreviousLayer: {"cat":"Anterior capa", "spa":"Anterior capa", "eng":"Previous layer", "fre":"Précédente couche"},
		NextLayer: {"cat":"Següent capa", "spa":"Siguiente capa", "eng":"Next layer", "fre":"Suivant couche"},
		noconsul_htm: {"cat":"noconsul.htm", "spa":"noconsul_spa.htm", "eng":"noconsul_eng.htm", "fre":"noconsul_fre.htm"},
		NotImplementedYetRESTful: {"cat":"De moment no implementat per RESTful", "spa":"De momento no implementado para RESTful", "eng":"Not implemented yet for RESTful", "fre":"Pas encore implémenté pour RESTful"},
  },
	ctipica:{
		AnyMatch: {"cat":"Cap coincidència", "spa":"Ninguna coincidencia", "eng":"Any match", "fre":"Aucune coïncidence"},
		UpdatingList: {"cat":"Actualitzant la llista, espereu", "spa":"Actualizando la lista, espere", "eng":"Updating the list, please wait","fre":"La liste est en train d'être actualisée, attendez."},
		_toBeShownInFrame_: {"cat":" per a mostrar al frame ", "spa":" para mostrar en el frame ", "eng":" to be shown in the frame ", "fre":" à montrer au frame "},
		_notInTypicalQueryLayerList: {"cat":" no és a la llista de capes amb consulta típica.", "spa":" no está en la lista de capas con consulta típica.", "eng":" is not in the typical query layer list.", "fre":" ne se trouve pas dans la liste de couches avec recherche typique"},
		UseBrowserToolsPlaceOnView: {"cat":"Usa les eines del navegador per situar-te sobre la vista.\nA continuació fés clic sobre la vista per determinar la coordenada i la informació del punt a validar.\nPer finalitzar, prem [Validar Coordenada] o [Cancel·lar] des de la finestra de validació.", "spa":"Utiliza las herramientas del navegador para situarte sobre la vista.\nA continuación haz clic sobre la vista para determinar la coordenada y la información del punto a validar.\nPara finalizar aprieta [Validar Coordenada] o [Cancelar] desde la ventana de validación.", "eng":"You have to use browser tools to place on the view.\n Later, you have to click on the view to determine the coordinate\nand the information of the point of validating.\nTo finish you have to click [Validate coordinate] or [Cancel] from the validation window.", "fre":"Utilisez les outils du navigateur pour vous placer sur la vue.\n Ensuite cliquez sur la vue pour déterminer la coordonné\net l'information du point à valider.\nFinalement, pressez [Valider Coordonnée] où [Annuler] de la fenêtre de validation."},
		_isIncorrect: { "cat": " és incorrecte", "spa": " es incorrecta", "eng": " is incorrect", "fre": " est incorrecte"},
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
