/* 
    This file is part of NiMMbus system. NiMMbus is a solution for 
    storing geospatial resources on the MiraMon private cloud. 
    MiraMon is a family of GIS&RS products developed since 1994 
    and includes a desktop GIS, a desktop Metadata Manager, a 
    Web Map Browser and the NiMMbus system. 
    
    The NiMMbus JavaScript client is free software: you can redistribute 
    it and/or modify it under the terms of the GNU Affero General 
    Public License as published by the Free Software Foundation, 
    either version 3 of the License, or (at your option) any later version.

    The NiMMbus JavaScript client is distributed in the hope that 
    it will be useful, but WITHOUT ANY WARRANTY; without even the 
    implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
    See the GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General 
    Public License along with the NiMMbus JavaScript Client.
    If not, see https://www.gnu.org/licenses/licenses.html#AGPL.
    
    The NiMMbus JavaScript Client can be updated from
    https://github.com/grumets/NiMMbus.

    Copyright 2014, 2024 Xavier Pons

    Aquest codi JavaScript ha estat idea de Joan Masó Pau (joan maso at uab cat) 
    amb l'ajut de l'Alaitz Zabala (alaitz zabala at uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del 
    CREAF que elabora programari de Sistema d'Informació Geogràfica 
    i de Teledetecció per a la visualització, consulta, edició i anàlisi 
    de mapes ràsters i vectorials. Aquest programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert. 
    
    En particular, el client JavaScript del NiMMbus es distribueix sota 
    els termes de la llicència GNU Affero General Public License, 
    mireu https://www.gnu.org/licenses/licenses.html#AGPL.
    
    El client JavaScript del NiMMbus es pot actualitzar des de 
    https://github.com/grumets/NiMMbus.
*/

"use strict"
function OmpleInputDesDeWPSLiteralOutput(item)
{
	var literal_data=GetXMLElementByName(item, "wps", "LiteralData");
	if (literal_data && literal_data.childNodes[0] && literal_data.childNodes[0].nodeValue)
		return literal_data.childNodes[0].nodeValue;
	else
		return "";
}

function DonaTextDesDeGcoCharacterString(item)
{
	var elem=GetValueXMLElementByName(item, "gco", "CharacterString");
	if (elem)
		return elem;
	else
		return "";
}

function DonaTextDesDeGcoCharacterStringOGcxAnchor(item)
{
	var elem=DonaTextDesDeGcoCharacterString(item);
	if (elem)
		return elem;
	
	elem=GetXMLElementByName(item, "gcx", "Anchor");
	if (elem)
	{
		var code_list_value=GetXMLAttributeByName(elem, "xlink", "href");
		if (code_list_value && code_list_value.value)
			return code_list_value.value;
		else
			return "";		
	}
	else
		return "";
}

function OmpleInputDesDeWPSComplexOutput(item)
{
	return GetXMLElementByName(item, "wps", "ComplexData");
}

function GetRetrieveResourceLogBookOutputs(root)
{
    var output, output2, identifier, logbook_item;
    var elem;

	output=GetXMLElementCollectionByName(root, "wps", "Output");

	if (output && output.length)
	{
		var logpage={};
		for (var item=0; item<output.length; item++)
		{
            identifier=GetXMLElementByName(output.item(item), "ows", "Identifier");
			if (identifier)
			{
                if (identifier.childNodes[0].nodeValue=="obj_id")
                    logpage.obj_id=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="obj_time")
                    logpage.obj_time=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="language")
                    logpage.lang=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="last_modif_time")
                    logpage.last_modif_time=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="rights")
                    logpage.rights=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="owner_user")
                    logpage.owner=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="title")
                    logpage.title=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="idFeature")
                    logpage.idFeature=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="reason")
                    logpage.reason=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="idLogBook")
                {
                    logbook_item=OmpleInputDesDeWPSComplexOutput(output.item(item));
                    if (logbook_item)
                    {
                        output2=GetXMLElementCollectionByName(logbook_item,"", "LogPageTarget");							
						if (output2 && output2.length)
						{	
                            logpage.logbook=[];
                            for (var item2 = 0; item2 < output2.length; item2++) {
                                var ciCitation = GetXMLElementByName(output2[item2], "cit", "CI_Citation");
                                if (!ciCitation) continue;

                                var identifiers = GetXMLElementCollectionByName(ciCitation, "cit", "identifier");
                                if (!identifiers || !identifiers.length) continue;

                                for (var j = 0; j < identifiers.length; j++) {
                                    var mdIdentifier = GetXMLElementByName(identifiers[j], "mcc", "MD_Identifier");
                                    if (!mdIdentifier) continue;

                                    var codeElem = GetXMLElementByName(mdIdentifier, "mcc", "code");
                                    var codeSpaceElem = GetXMLElementByName(mdIdentifier, "mcc", "codeSpace");

                                    var itemObj = {};
                                    if (codeElem)
                                        itemObj.code = DonaTextDesDeGcoCharacterString(codeElem);

                                    if (codeSpaceElem)
                                        itemObj.codeSpace = DonaTextDesDeGcoCharacterStringOGcxAnchor(codeSpaceElem);
                                    else
                                        itemObj.codeSpace = "";

                                    logpage.logbook.push(itemObj);
                                }
                            }
                        }
                    }
                }
                else if (identifier.childNodes[0].nodeValue=="contentDateIni")
                    logpage.contentDateIni=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="contentDateFin")
                    logpage.contentDateFin=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="comment")
                    logpage.comment=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue=="link")
                    logpage.link=OmpleInputDesDeWPSLiteralOutput(output.item(item));
                else if (identifier.childNodes[0].nodeValue == "LogPageScope") 
                {
                    var scope_item = OmpleInputDesDeWPSComplexOutput(output.item(item));
                    if (scope_item) {
                        var logPageScope = GetXMLElementByName(scope_item, "", "LogPageScope");
                        if (logPageScope)
                        {
                            var nElemsNode = GetXMLElementByName(logPageScope, "", "n_elems");
                            var n = nElemsNode ? parseInt(nElemsNode.textContent.trim()) : 0;
                            logpage.scope = [];

                            for (var i = 0; i < n; i++) 
                            {
                                var elemTag = "elem_" + i;
                                var elemNode = GetXMLElementByName(logPageScope, "", elemTag);
                                if (elemNode) 
                                {
                                    var scopeObj = {};

                                    var typeNode = GetXMLElementByName(elemNode, "", "type");
                                    if (typeNode)
                                        scopeObj.type = typeNode.textContent.trim();

                                    var coordsNode = GetXMLElementByName(elemNode, "", "coords");
                                    if (coordsNode)
                                        scopeObj.coords = coordsNode.textContent.trim();

                                    var descNode = GetXMLElementByName(elemNode, "", "desc");
                                    if (descNode)
                                        scopeObj.desc = descNode.textContent.trim();

                                    logpage.scope.push(scopeObj);
                                }
                            }
                        }
                    }
                }
            }
        }
        return logpage;
    }    

    return null;
}

//copiada de wps_iso_guf.js
function GetNimmbusTypeOfAOWCFeature(feature)
{
// type is decided searching for a category with scheme equal no nimmbus. If more than one is present (it should not happen) the first one is used
// initially type is set to "" in case no category properly defines it
	if (!feature || !feature.properties || !feature.properties.categories)
		return "";
	var categories=feature.properties.categories
	for (var j=0; j<categories.length; j++)
	{
		if (categories[j].scheme &&
			categories[j].scheme=="https://www.nimmbus.cat/resource_type" &&
			categories[j].term)
		{
			if (categories[j].term=="POI")
				return "POI"; 
			else if (categories[j].term=="LOGBOOK")
				return "LOGBOOK"; 
			else if (categories[j].term=="LOGPAGE")
				return "LOGPAGE"; 
			else if (categories[j].term=="HREF")
				return "HREF";
			else if (categories[j].term=="FEEDBACK")
				return "FEEDBACK";
			else if (categories[j].term=="CITATION")
				return "CITATION";
			else if (categories[j].term=="PUBLICAT")
				return "PUBLICAT";
			else if (categories[j].term=="INDIVIDU")
				return "INDIVIDU";
			else if (categories[j].term=="ORGANISM")
				return "ORGANISM";
		}
	}		
	return "";		
}