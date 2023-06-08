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

    Copyright 2014, 2023 Xavier Pons

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

//var ServerGUF="http://localhost/cgi-bin/server1/nimmbus.cgi";
//var ClientGUF="http://localhost/nimmbus/index.htm";
var ServerGUF="https://www.nimmbus.cat/cgi-bin/nimmbus.cgi";
var ClientGUF="https://www.nimmbus.cat/index.htm";

var Opcions_GUFFeedbackWindow='toolbar=no,status=no,scrollbars=yes,location=no,menubar=no,directories=no,resizable=yes,width=1500,height=1000';

function GUFIncludeScript(url, late)   //https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
{
	var script = document.createElement("script");  // create a script DOM node

	if (late)
	{
	script.setAttributeNode(document.createAttribute("async"));
	script.setAttributeNode(document.createAttribute("defer"));
	}
	script.src = url;  // set its src to the provided URL
	document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead). Ja ho he fet.
}

GUFIncludeScript("Nmmblang.js");
GUFIncludeScript("xml.js");
GUFIncludeScript("owc_atom.js");
GUFIncludeScript("wps_iso_guf.js");
GUFIncludeScript("guf_locale.js");

function GUFCreateFeedbackWithReproducibleUsage(targets, reprod_usage, lang, access_token_type)
{
	for (var i=0; i<targets.length; i++)
	{	
		if (targets[i].title)
			targets[i].title = DonaCadenaPerValorDeFormulari(targets[i].title);
		if (targets[i].code)
			targets[i].code = DonaCadenaPerValorDeFormulari(targets[i].code);
		if (targets[i].codespace) //decidim que els codespace han de ser independent del protocol i per això els posarem sense S sempre ara
			targets[i].codespace = DonaCadenaPerValorDeFormulari(targets[i].codespace).replace("https://","http://"); 
	}
	if (reprod_usage.abstract)
		reprod_usage.abstract = DonaCadenaPerValorDeFormulari(reprod_usage.abstract);
	if (reprod_usage.ru_code)
		reprod_usage.ru_code = DonaCadenaPerValorDeFormulari(reprod_usage.ru_code);
	if (reprod_usage.ru_code_media_type)
		reprod_usage.ru_code_media_type = DonaCadenaPerValorDeFormulari(reprod_usage.ru_code_media_type);
	if (reprod_usage.ru_platform)
		reprod_usage.ru_platform = encodeURI(reprod_usage.ru_platform);
	if (reprod_usage.ru_schema)
		reprod_usage.ru_schema = encodeURIComponent(reprod_usage.ru_schema);
	if (typeof reprod_usage.ru_sugg_app === "undefined")
		reprod_usage.ru_sugg_app = encodeURI(location.href);
	else if (reprod_usage.ru_sugg_app)
		reprod_usage.ru_sugg_app = encodeURI(reprod_usage.ru_sugg_app);
	return GUFAfegirFeedbackCapaMultipleTargets(targets, lang, access_token_type, reprod_usage);
}

function GUFShowPreviousFeedbackWithReproducibleUsageInHTMLDiv(elem, seed_div_id, code, codespace, reprod_usage, lang, access_token_type, callback_function, params_function)
{	
	var cdns=[];
	
	cdns.push("<form name=\"FeedbackWithReproducibleUsageResourceForm\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"",seed_div_id,"\" style=\"width:98%\">", "</div></fieldset></div>", "</div></form>");
	elem.innerHTML = cdns.join("")

	if (!code || !codespace)
	{
		alert("code and codespace are mandatory in GUFShowPreviousFeedbackWithReproducibleUsageInHTMLDiv()");
		return;
	}
	
	var url=ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:ENUMERATE";
	if (lang)
		url+="&LANGUAGE=" + lang;
		
	//decidim que els codespace han de ser independent del protocol i per això els posarem sense S sempre ara 
	codespace = codespace.replace("https://","http://"); 
	url+="&STARTINDEX=1&COUNT=100&FORMAT=text/xml&TYPE=FEEDBACK&TRG_TYPE_1=CITATION&TRG_FLD_1=CODE&TRG_VL_1=" + DonaCadenaPerValorDeFormulari(code) + 
					"&TRG_OPR_1=EQ&TRG_NXS_1=AND&TRG_TYPE_2=CITATION&TRG_FLD_2=NAMESPACE&TRG_VL_2=" + encodeURI(codespace) + "&TRG_OPR_2=EQ";
	
	var i_cond=1;
	if (reprod_usage.ru_platform)
	{		
		url+="&RSC_FLD_" + i_cond + "=RU_PLATFORM&RSC_VL_" + i_cond + "=" + /*encodeURI(*/reprod_usage.ru_platform/*)*/ + "&RSC_OPR_" + i_cond + "=EQ"; //no needed
		i_cond++;
	}
	if (reprod_usage.ru_version)
	{
		if (i_cond>1)
			url+="&RSC_NXS_"+ (i_cond-1) + "=AND";
			
		url+="&RSC_FLD_" + i_cond + "=RU_VERSION&RSC_VL_" + i_cond + "=" + /*DonaCadenaPerValorDeFormulari(*/reprod_usage.ru_version/*)*/ + "&RSC_OPR_" + i_cond + "=EQ"; //no needed
		i_cond++;
	}
	
	if (reprod_usage.ru_schema)
	{
		if (i_cond>1)
			url+="&RSC_NXS_"+ (i_cond-1) + "=AND";
			
		url+="&RSC_FLD_" + i_cond + "=RU_SCHEMA&RSC_VL_" + i_cond + "=" + /*encodeURIComponent(*/reprod_usage.ru_schema/*)*/ + "&RSC_OPR_" + i_cond + "=EQ"; //no needed
		i_cond++;
	}
	
	var intern_sugg_app;
	if (typeof reprod_usage.ru_sugg_app === "undefined")
		intern_sugg_app=location.href;
	else 
		intern_sugg_app=reprod_usage.ru_sugg_app;
	
	if (intern_sugg_app)
	{
		if (i_cond>1)
			url+="&RSC_NXS_"+ (i_cond-1) + "=AND";
	
		url+="&RSC_FLD_" + i_cond + "=RU_SUGG_APP&RSC_VL_" + i_cond + "=" + /*encodeURI(*/intern_sugg_app/*)*/ + "&RSC_OPR_" + i_cond + "=EQ";	 //no needed			
		i_cond++;
	}
	loadFile(url, "text/xml", CarregaFeedbacksAnteriors, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); }, {url: url, div_id: seed_div_id, lang: lang, access_token_type: access_token_type, callback_function: callback_function, params_function: params_function, edit_button: false});
}

function GUFShowFeedbackInHTMLDiv(elem, seed_div_id, rsc_type, title, code, codespace, lang, access_token_type, name_scope_function)
{
var targets=[{title: title, code: code, codespace: codespace, role: "primary"}];
	return GUFShowFeedbackMultipleTargetsInHTMLDiv(elem, seed_div_id, rsc_type, targets, lang, access_token_type, name_scope_function);
}

function GUFShowFeedbackMultipleTargetsInHTMLDiv(elem, seed_div_id, rsc_type, targets, lang, access_token_type, name_scope_function)
{
	for (var i=0; i<targets.length; i++)	
	{
		if (targets[i].codespace) //decidim que els codespace han de ser independent del protocol i per això els posarem sense S sempre ara
			targets[i].codespace=targets[i].codespace.replace("https://","http://");
	}
	elem.innerHTML = GUFDonaCadenaFinestraFeedbackResourceMultipleTargets(seed_div_id, rsc_type, targets, lang, access_token_type, name_scope_function);
	//demano el fitxer atom de feedbacks previs
	GUFShowPreviousFeedbackMultipleTargetsInHTMLDiv(seed_div_id, rsc_type, targets, lang, access_token_type);
}

function GUFShowPreviousFeedbackInHTMLDiv(div_id, rsc_type, code, codespace, lang, access_token_type)
{
var targets=[{title: title, code: code, codespace: codespace, role: "primary"}];	
	return GUFShowPreviousFeedbackMultipleTargetsInHTMLDiv(div_id, rsc_type, targets, lang, access_token_type);
}

function GUFShowPreviousFeedbackMultipleTargetsInHTMLDiv(div_id, rsc_type, targets, lang, access_token_type)
{
	var tinc_target_secondary=false;
	var url=ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:ENUMERATE&LANGUAGE=" + lang + "&STARTINDEX=1&COUNT=100&FORMAT=text/xml&TYPE=FEEDBACK";
	var url2=url;
	
//ara assumeixo que tinc un primari segur i potser un secundari. Futur-> poden haver N de cada un dels TRES tipus, i per cada un farçe un quadradet, suposo

	//busco el target primari i l'envio a la primera part de la finestra
	for (var i=0; i<targets.length; i++)	
	{
		if (targets[i].codespace) //decidim que els codespace han de ser independent del protocol i per això els posarem sense S sempre ara
			targets[i].codespace=targets[i].codespace.replace("https://","http://");
	
		if (targets[i].title && targets[i].code && targets[i].codespace && (typeof(targets[i].role)== "undefined" || targets[i].role=="primary"))
		{			 
			url+="&TRG_TYPE_1=CITATION&TRG_FLD_1=CODE&TRG_VL_1=" + targets[i].code + "&TRG_OPR_1=EQ&TRG_NXS_1=AND&TRG_TYPE_2=CITATION&TRG_FLD_2=NAMESPACE&TRG_VL_2=" + targets[i].codespace + "&TRG_OPR_2=EQ";			
			break;
		}
	}
	//l'espai de FB previs sobre el target primari el poso sempre, perquè sempre en tinc un	
	loadFile(url, "text/xml", CarregaFeedbacksAnteriors, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); }, {url: url, div_id: div_id+"Previ", rsc_type:rsc_type, lang: lang, access_token_type: access_token_type});

	//busco el target secundari i l'envio a la segona part de la finestra
	for (var i=0; i<targets.length; i++)	
	{
		if (targets[i].title && targets[i].code && targets[i].codespace && targets[i].role=="secondary")
		{	//la peticio buscarà els que parlin del secondari d'ara, però només com a PRIMARI, per veure tb en el dataset els comentaris generals de la col·lecció (i no tornar a veure els secudaris d'questa o altres imatges!)
			url2+="&TRG_TYPE_1=CITATION&TRG_FLD_1=CODE&TRG_VL_1=" + targets[i].code + "&TRG_OPR_1=EQ&TRG_NXS_1=AND&TRG_TYPE_2=CITATION&TRG_FLD_2=NAMESPACE&TRG_VL_2=" + targets[i].codespace + "&TRG_OPR_2=EQ" +
						"&TRG_ROLE=primary";
			tinc_target_secondary=true;
			break;
		}
	}	
	if (tinc_target_secondary)
		loadFile(url2, "text/xml", CarregaFeedbacksAnteriors, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); }, {url: url2, div_id: div_id+"Previ_secundari", rsc_type:rsc_type, lang: lang, access_token_type: access_token_type});
}

function GUFDonaCadenaLang(cadena_lang, lang)
{
	if(cadena_lang)
	{
		switch(lang)
		{	
			case "cat":
				return cadena_lang.cat;
			case "spa":
				return cadena_lang.spa;
			default:     //Si no hi ha l'idioma solicitat faig que xerri en anglès
			case "eng":
				return cadena_lang.eng;
			case "fre":
				return cadena_lang.fre;
		}
	}
	return cadena_lang.eng;
}

//Duplicated from the MiraMon Map Browser
function GUFShaObertPopUp(wnd, lang)
{
	if (wnd==null)
	{
	    alert(GUFDonaCadenaLang({"cat":"Aquest navegador té les finestres emergents bloquejades. Canvia la configuració del teu navegador.\nEn algunes versions d'Internet Explorer, només cal fer un clic sobre la faixa groga superior.", 
							  "spa":"Este navegador tiene las ventanas emergentes bloqueadas. Modifique la configuración de su navegador.\nEn algunas versiones de Internet Explorer, un clic sobre la banda amarilla superior es suficiente.", 
							  "eng":"Sorry, this browser has pop-up windows locked. Please change browser configuration.\nIn some Internet Explorer versions only a click on top yellow band will fix it.",
							  "fre":"Ce navigateur a les fenêtres émergentes fermées. Changez la configuration de votre navigateur.\nDans certaines versions d'Internet Explorer, il suffit de cliquer sur la barre jaune supérieure."}, lang));
	    return false;
	}
	return true;
}


function GUFAnalitzaExceptionReport(root, url)
{
var exception_error;

	exception_error=GetXMLElementByName(root, "ows", "ExceptionText");
	if (exception_error)
	{
		alert(url + ": "+ exception_error.childNodes[0].nodeValue);
		return true;
	}
	//Si no trobo text, potser encara trovaré el codi
	exception_error=GetXMLElementByName(root, "ows", "Exception");
	if (exception_error)
	{
		exception_error=GetXMLAttributeByName(exception_error, null, "exceptionCode");
		if (exception_error && exception_error.value)
		{
			alert(url + ": "+ exception_error.value);
			return true;
		}
	}
	return false;
}


function DonaCadenaDataHoraDesDeElementCompost(elem)
{
	var s="";
	
	if (elem)
	{
		if (elem.date)
		{
			s+=elem.date;
			if (elem.time)
				s+="T"+elem.time+":00Z";
		}
	}
	return s;
}

function CridaACallBackFunctionAmbEstructuraGUF(lang, resource_id, callback_function, params_function)
{
	var url=ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE&LANGUAGE="+lang+"&RESOURCE="+resource_id;		
	loadFile(url, "text/xml", CarregaFeedbackAnterior, function(xhr, extra_param) { alert(url + ": " + xhr ); }, {url: url, lang: lang, callback_function: callback_function, params_function: params_function});
}

function CarregaFeedbacksAnteriors(doc, extra_param)
{
var cdns=[];

	if (!doc || !doc.documentElement)
	{
		alert (extra_param.url + ": " + GUFDonaCadenaLang({"cat":"El retorn no és xml", "spa":"El retorno no es xml", "eng":"Return is not xml", "fre":"Le retour n'est pas xml"}, extra_param.lang));
		return ;
	}
	var root=doc.documentElement;

	if (GUFAnalitzaExceptionReport(root, extra_param.url))
		return;
		
	var owc=ParseOWSContextAtom(root);
	if (owc.properties.totalResults==0 || !owc.features)
	{
		cdns.push(GUFDonaCadenaLang({"cat":"No hi ha cap valoració prèvia", 
					"spa":"No hay ninguna valoración previa", 
					"eng":"There is no previous user feedback", 
					"fre":"Il n'y a pas encore de commentaires des utilisateurs"}, extra_param.lang)); 

		if (extra_param.rsc_type != "")
			cdns.push(GUFDonaCadenaLang({"cat":" sobre la", 
						"spa":" sobre la", 
						"eng":" on the", 
						"fre":" sur la"}, extra_param.lang), 
						" ", extra_param.rsc_type, " ");

		cdns.push(GUFDonaCadenaLang({"cat":"encara", 
					"spa":"todavía", 
					"eng":"yet", 
					"fre":"encore"}, extra_param.lang));
		document.getElementById(extra_param.div_id).innerHTML=cdns.join("");
		return;
	}
	//OG: canviem de posició el botó edit, que inicialment estava al final de tot de la llista de FB
	if (typeof extra_param.edit_button!=="undefined" && extra_param.edit_button==false)
	; //si el param no existeix o diu que no vull botó no el poso
	else
		cdns.push("<div class=\"guf_edit user\"><input type=\"button\" class=\"guf_button user\" value=\"",
			GUFDonaCadenaLang({"cat":"Edita", "spa":"Edita", "eng":"Edit", "fre":"Éditer"}, extra_param.lang), "\"",
			" onClick='GUFOpenNimmbus(\"", extra_param.lang, "\",\"", extra_param.access_token_type, "\");' /> ",
			GUFDonaCadenaLang({"cat":"les teves entrades prèvies", "spa":"tus entradas previas", "eng":"your previous entries", "fre":"vos entrées précédentes"}, extra_param.lang), "</div><!-- guf_edit -->"); 
			//fi de  "</div><!-- guf_report -->");
	var type;
	//cdns.push("<div class=\"guf_report user\">");
	for (var i=0; i<owc.features.length; i++)
	{
		type=GetNimmbusTypeOfAOWCFeature(owc.features[i]);
		if (type=="FEEDBACK")
		{
			var str = owc.features[i].properties.links.alternates[0].href; 
			var n = str.indexOf("&RESOURCE=");
			var str2 = str.substring(n+10);
			var n2 = str2.indexOf("&");  
			str = str2.substring(0, n2);
 		  
			cdns.push("<fieldset class=\"guf_fieldset user\"><legend class=\"guf_legend user\">", owc.features[i].properties.authors[0].name, ", ", DonaDataISOComAText(owc.features[i].properties.updated), 
				"</legend>", 							
				"<div class=\"guf_fb_id user\"><span class=\"guf_key user\">NiMMbus Id.</span>: <a class=\"guf_link user\" href=\""+ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE&LANGUAGE="+extra_param.lang+"&RESOURCE="+str+"\" target=\"_blank\">"+str+"</a></div>",				
				"<div class=\"guf_abstract user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Resum", "spa":"Resumen", "eng":"Abstract", "fre":"Résumé"}, extra_param.lang), "</span>: ", owc.features[i].properties.title,
				"</div><div id=\"", extra_param.div_id, "_",i , "\"></div>");
								
			if (typeof extra_param.callback_function!=="undefined" && extra_param.callback_function != "")
			{
				var params=JSON.stringify(extra_param.params_function);
				
					params=params.replaceAll("\"","\\\"");
				cdns.push("<div class=\"guf_adopt user\"><input type=\"button\" class=\"guf_button user\" value=\"",
						GUFDonaCadenaLang({"cat":"Adopta", "spa":"Adopta", "eng":"Adopt", "fre":"Adopter"}, extra_param.lang), "\"",
						//" onClick='", extra_param.callback_function, "(\"", str, "\");' /> ");			
						" onClick='CridaACallBackFunctionAmbEstructuraGUF(\"", extra_param.lang, "\",\"", str, "\",\"", extra_param.callback_function, "\",\"", params, "\");'/>");			
			}
			cdns.push("</fieldset>");		
		}
	}
	document.getElementById(extra_param.div_id).innerHTML=cdns.join("");
	for (var i=0; i<owc.features.length; i++)
	{
		type=GetNimmbusTypeOfAOWCFeature(owc.features[i]);
		if (type=="FEEDBACK" && owc.features[i].properties && owc.features[i].properties.links && owc.features[i].properties.links.alternates && owc.features[i].properties.links.alternates.length && owc.features[i].properties.links.alternates[0].href)
			loadFile(owc.features[i].properties.links.alternates[0].href, "text/xml", CarregaFeedbackAnterior, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); }, {url: owc.features[i].properties.links.alternates[0].href, div_id: extra_param.div_id + "_" + i, lang: extra_param.lang});
	}
}

function ConstrueixURLDesdeIdentifierSiDOIoNiMMbus(identifier, lang, es_id_fb_item)
{
	var link_html="";
	
	if (identifier)
	{
		var text_html="";
		if (identifier.codeSpace)
		{
			if (identifier.codeSpace.endsWith("/"))
				text_html=identifier.codeSpace;
			else
				text_html=identifier.codeSpace+"/";
		}
		
		if (identifier.code)
			text_html=text_html+identifier.code;
			
		//text_html=text_html+". ";
			
		if (text_html.indexOf("www.doi.org") >= 0 || text_html.indexOf("/doi.org") >= 0)
			link_html="<span class=\"guf_key_2 user\">DOI</span>: <a class=\"guf_link user\" href=\""+text_html+"\" target=\"_blank\">"+identifier.code+"</a>. <br/>";
		else if (text_html.indexOf("https://www.nimmbus.cat/resourceId") >= 0) //si codeSpace és https://www.nimmbus.cat/resourceId és que és un recurs NiMMbus, i per tant puc fer la consulta de retrieve
		{
			if (es_id_fb_item)
				link_html="<span class=\"guf_key user\">NiMMbus Id.</span>: <a class=\"guf_link user\" href=\""+ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE&LANGUAGE="+lang+"&RESOURCE="+identifier.code+"\" target=\"_blank\">"+identifier.code+"</a><br/>";
			else
				link_html="<span class=\"guf_key_2 user\">NiMMbus Id.</span>: <a class=\"guf_link user\" href=\""+ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE&LANGUAGE="+lang+"&RESOURCE="+identifier.code+"\" target=\"_blank\">"+identifier.code+"</a><br/>";
		}
		else			
			link_html="<span class=\"guf_key_2 user\">"+GUFDonaCadenaLang({"cat":"Identificador", "spa":"Identificador", "eng":"Identifier", "fre":"Identifiant"}, lang)+"</span>: "+text_html+"<br/>";	
	}
	return link_html;
}

function ConstrueixCadenaDesdeCitationOPublication(cdns, cit_o_pub, i_cit_o_pub, text_titol, prefix_div, extra_param, es_public)
{
	if (text_titol)
	{
		if (es_public && cit_o_pub.category)
			cdns.push("<span class=\"guf_key user\">", text_titol, " (", GUFDonaCadenaLang(QCM_PublicationCategoryCode[cit_o_pub.category], extra_param.lang),"):</span> ");
		else
			cdns.push("<span class=\"guf_key user\">", text_titol,":</span> ");
	}
	else
	{
		if (es_public && cit_o_pub.category)
			cdns.push("<span class=\"guf_key user\">", GUFDonaCadenaLang(QCM_PublicationCategoryCode[cit_o_pub.category], extra_param.lang),":</span> ");
		else
		{
			if (es_public)
				cdns.push("<span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Publicació", "spa":"Publicación", "eng":"Publication", "fre":"Publication"}, extra_param.lang), ":</span> ");
			else //cas remot perquè mai em passi una citació sense text_titol, però per si de cas
				cdns.push("<span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Citació", "spa":"Citación", "eng":"Citation", "fre":"Citation"}, extra_param.lang), ":</span> ");
		}
	}
	cdns.push("<input type=\"checkbox\" id=\""+extra_param.div_id+"_"+prefix_div+"_"+i_cit_o_pub+"\" style=\"display:none;\">");

	if (cit_o_pub.title)
		cdns.push(cit_o_pub.title);
					
	cdns.push(" <div class=\"guf_folded user\">"); //L'espai cal perquè si no el "Shown ..." queda junt amb lo anterior quan està plegat
		
	if (cit_o_pub.edition || cit_o_pub.editionDate)
	{
		cdns.push("<div class=\"guf_cit_edition user\"><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat": "Edició", "spa": "Edición", "eng": "Edition", "fre":"Édition"}, extra_param.lang), ":</span> ");
		if (cit_o_pub.edition)
		{
			cdns.push(cit_o_pub.edition);
			if (cit_o_pub.editionDate)
				cdns.push(", ", cit_o_pub.editionDate);
		}
		else //si no tinc edition és que tinc editionDate, si no no hauria entrat
			cdns.push(cit_o_pub.editionDate);
		cdns.push("</div>");				
	}
	
	if (cit_o_pub.series && cit_o_pub.series.name)
	{
		cdns.push("<div class=\"guf_cit_series user\"><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Sèrie", "spa":"Serie", "eng": "Series", "fre":"série"}, extra_param.lang), ":</span> ");
		cdns.push("<i>", cit_o_pub.series.name, "</i>");
		if (cit_o_pub.series.issueIdentification)
		{
			cdns.push(", ", cit_o_pub.series.issueIdentification);
			if (cit_o_pub.series.page)
				cdns.push(", pp.", cit_o_pub.series.page);
		}
		cdns.push("</div>");
	}
	
	if (cit_o_pub.otherCitationDetails)
		cdns.push("<div class=\"guf_cit_other_citation user\"><span class=\"guf_key_2 user\">", 
			GUFDonaCadenaLang({"cat": "Altres detalls de la citació", "spa": "Otros detalles de la cita", "eng": "Other citation details", "fre":"Autres détails de la citation"}, extra_param.lang), 
			":</span> ", cit_o_pub.otherCitationDetails, "</div>");				
	
	//citedResponsibleParty
	if (cit_o_pub.resp_party)
	{	
		cdns.push("<div class=\"guf_cit_responsibles user\">");
		for (var i_resp_party=0; i_resp_party<cit_o_pub.resp_party.length; i_resp_party++)
		{
			if (cit_o_pub.resp_party[i_resp_party].party_name)
			{
				var party_name_txt="";
				//construeixo la cadena dels N parties amb igual rol
				for (var i_party_name=0, i_afegit=0; i_party_name<cit_o_pub.resp_party[i_resp_party].party_name.length; i_party_name++)
				{
					if (cit_o_pub.resp_party[i_resp_party].party_name[i_party_name].name!="")
							cdns.push("<span class=\"guf_key_2 user\">",GUFDonaCadenaLang(CI_RoleCode[cit_o_pub.resp_party[i_resp_party].role],extra_param.lang)+":</span> "+cit_o_pub.resp_party[i_resp_party].party_name[i_party_name].name+"<br/>");	
				}
			}
		}
		cdns.push("</div>");
	}			

	if (cit_o_pub.onlineResource && cit_o_pub.onlineResource.linkage)
	{				
		var text_html="<div class=\"guf_cit_online_resource user\"><span class=\"guf_key_2 user\">"+GUFDonaCadenaLang({"cat":"Recurs online", "spa":"Recurso online", "eng":"Online resource", "fre":"Ressource en ligne"},extra_param.lang)+"</span>: <a class=\"guf_link user\" href=\""+cit_o_pub.onlineResource.linkage+"\" target=\"_blank\">";
		if (cit_o_pub.onlineResource.description)
			text_html=text_html+cit_o_pub.onlineResource.description;
		else
			text_html=text_html+cit_o_pub.onlineResource.linkage;
		text_html=text_html+"</a>";
		
		if (cit_o_pub.onlineResource.function)
			text_html=text_html+" ("+GUFDonaCadenaLang(CI_OnLineFunctionCode[cit_o_pub.onlineResource.function],extra_param.lang)+")";
		text_html=text_html+"</div>";
		cdns.push(text_html);	
	}			
	
	if (cit_o_pub.identifier)
	{
		cdns.push("<div class=\"guf_cit_identifier user\">");
		for (var i_id=0; i_id<cit_o_pub.identifier.length; i_id++)
			cdns.push(ConstrueixURLDesdeIdentifierSiDOIoNiMMbus(cit_o_pub.identifier[i_id], extra_param.lang, false));
		cdns.push("</div>");
	}

	if (es_public && cit_o_pub.abstract)
		cdns.push("<div class=\"guf_pub_abstract user\"><span class=\"guf_key_2 user\">"+GUFDonaCadenaLang({"cat":"Resum", "spa":"Resumen", "eng":"Abstract", "fre":"Résumé"},extra_param.lang)+"</span>: ", cit_o_pub.abstract,"</div>");				
		
	cdns.push("</div><a class=\"guf_link user\" href=\"javascript:void(0);\"><label for=\""+extra_param.div_id+"_"+prefix_div+"_"+i_cit_o_pub+"\"><span class=\"guf_show_more user\">"+GUFDonaCadenaLang({"cat":"Mostrar/amagar més informació", "spa":"Mostrar/ocultar más información", "eng":"Show/hide more information", "fre":"Afficher/masquer plus d'informations"},extra_param.lang)+"</span></label></a></input>");

	return;
}

function HiHaReprodUsage(usage_descr)
{
	if (usage_descr.code || usage_descr.codeLink || usage_descr.codeMediaType ||
			usage_descr.platform || usage_descr.version || usage_descr.schema || usage_descr.suggestedApplication ||
			usage_descr.diagram || usage_descr.diagramLink || usage_descr.diagramMediaType)
			return true;
	return false; 
}

function CarregaFeedbackAnterior(doc, extra_param)
{
var cdns=[];

	if (!doc || !doc.documentElement)
	{
		alert (extra_param.url + ": " + GUFDonaCadenaLang({"cat":"El retorn no és xml", "spa":"El retorno no es xml", "eng":"Return is not xml", "fre":"Le retour n'est pas xml"}, extra_param.lang)); 
		return ;
	}
	var root=doc.documentElement;

	if (GUFAnalitzaExceptionReport(root, extra_param.url))
		return;

	var guf=GetRetrieveResourceFeedbackOutputs(root);

	if (!guf)
	{	
		alert (extra_param.url + ": " + GUFDonaCadenaLang({"cat":"El retorn no és un xml guf", "spa":"El retorno no es xml guf", "eng":"Return is not xml guf", "fre":"Le retour n'est pas xml guf"}, extra_param.lang)); 
		return;
	}
	
	if (extra_param.callback_function && typeof window[extra_param.callback_function]==="function")
	{		
		window[extra_param.callback_function](JSON.parse(extra_param.params_function), guf);
		return;
	}
	
	/* Ara l'he posat a fora perquè quedi més endreçat (Id, titol + resta)
	if (guf.identifier)
		cdns.push(ConstrueixURLDesdeIdentifierSiDOIoNiMMbus(guf.identifier, extra_param.lang, true));*/
	
	/*if (guf.abstract) ja no existeix pq és el feature.title que JA he posat)
		cdns.push("<div class=\"guf_abstract user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Resum", "spa":"Resumen", "eng":"Abstract", "fre":"Abstrait"}, extra_param.lang), ":</span> ", guf.abstract, "</div>");*/

	if (guf.purpose)
		cdns.push("<div class=\"guf_purpose user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Propòsit", "spa":"Propósito", "eng":"Purpose", "fre":"Raison"}, extra_param.lang), ":</span> ", guf.purpose, "</div>");

	//if (guf.contact)
	
	if (guf.contactRole && GUF_UserRoleCode[guf.contactRole])
		cdns.push("<div class=\"guf_contact_role user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Rol de l'usuari", "spa":"Rol del usuario", "eng":"User role", "fre":"Rôle de user"}, extra_param.lang), ":</span> ", GUFDonaCadenaLang(GUF_UserRoleCode[guf.contactRole], extra_param.lang), "</div>");

	if (guf.dateInfo)
	{
		for (var i_date=0; i_date<guf.dateInfo.length; i_date++)
		{
			if (guf.dateInfo[i_date].dateType)
				cdns.push("<div class=\"guf_date user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Data", "spa":"Fecha", "eng":"Date", "fre":"Date"},extra_param.lang)+" ("+GUFDonaCadenaLang(CI_DateTypeCode[guf.dateInfo[i_date].dateType],extra_param.lang)+"):</span> "+guf.dateInfo[i_date].date+"</div>");
			else
				cdns.push("<div class=\"guf_date user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Data", "spa":"Fecha", "eng":"Date", "fre":"Date"},extra_param.lang)+":</span> "+guf.dateInfo[i_date].date+"</div>");
		}
	}	
	
	if (guf.rating)	
		cdns.push("<div class=\"guf_rating user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Puntuació", "spa":"Puntuación", "eng":"Rating", "fre":"Évaluation"}, extra_param.lang), ":</span> ", guf.rating, "/5</div>");

	if (guf.user_comment && guf.user_comment.comment)
	{ 
		cdns.push("<div class=\"guf_comment user\"><hr class=\"guf_solid user\">");
		cdns.push("<span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Comentari", "spa":"Comentario", "eng":"Comment", "fre":"Commentaire"}, extra_param.lang), ":</span> ", guf.user_comment.comment, "<br/>");
		if (guf.user_comment.motivation && GUF_MotivationCode[guf.user_comment.motivation])
			cdns.push("<span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Motivació del comentari", "spa":"Motivación del comentario", "eng":"Comment motivation", "fre":"Motivation du commentaire"}, extra_param.lang), ":</span> ", GUFDonaCadenaLang(GUF_MotivationCode[guf.user_comment.motivation], extra_param.lang));			
		cdns.push("</div><!-- guf_comment -->");
	}

	if (guf.usage)
	{
		cdns.push("<div class=\"guf_usage user\"><hr class=\"guf_solid user\">");
		if (guf.usage.reportAspect && guf.usage.reportAspect.length>0)
		{
			var s="";
			for (var item=0; item<guf.usage.reportAspect.length; item++)
			{
				if (item!=0)
					s+=", ";
				s+=GUFDonaCadenaLang(GUF_ReportAspectCode[guf.usage.reportAspect[item]], extra_param.lang);
			}
			cdns.push("<div class=\"guf_aspect_reported user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Aspecte reportat", "spa": "Aspecto reportado", "eng": "Aspect reported", "fre":"Aspect rapporté"}, extra_param.lang), ":</span> ", s, "</div>");
		}
		
		if (guf.usage.usage_descr)
		{
			cdns.push("<div class=\"guf_usage_description user\"><hr class=\"guf_dashed user\">");			
			if (guf.usage.usage_descr.specific_usage)
				cdns.push("<div class=\"guf_spec_usage_description user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Descripció de l'ús específic", "spa": "Descripción del uso específico", "eng": "Specific usage description", "fre":"Description d'utilisation spécifique"}, extra_param.lang), ":</span> ", guf.usage.usage_descr.specific_usage, "</div>");				
				
			if (guf.usage.usage_descr.usage_dt)
			{
				var s=DonaCadenaDataHoraDesDeElementCompost(guf.usage.usage_descr.usage_dt);
				if (s!="")
					cdns.push("<div class=\"guf_usage_dt user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Data i  hora de l'ús", "spa": "Fecha y hora del uso", "eng": "Usage date and time", "fre": "Date et heure d'utilisation"}, extra_param.lang), ":</span> ", s, "</div>");
			}
			
			if (guf.usage.usage_descr.user_det_lim)
				cdns.push("<div class=\"guf_user_deter_limits user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Limitacions determinades per l'usuari", "spa": "Limitaciones determinadas por el usuario", "eng": "User determined limitations", "fre":"Limites déterminées par l'utilisateur"}, extra_param.lang), ":</span> ", guf.usage.usage_descr.user_det_lim, "</div>");				
				
			if (guf.usage.usage_descr.response)
				cdns.push("<div class=\"guf_response user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Resposta", "spa": "Respuesta", "eng": "Response", "fre":"Réponse"}, extra_param.lang), ":</span> ", guf.usage.usage_descr.response, "</div>");				
				
			if (guf.usage.usage_descr.add_doc)
			{
				cdns.push("<div class=\"guf_add_doc user\">");
				for (var item=0; item<guf.usage.usage_descr.add_doc.length; item++)
				{
					cdns.push("<div>");
					ConstrueixCadenaDesdeCitationOPublication(cdns, guf.usage.usage_descr.add_doc[item], item, 
						GUFDonaCadenaLang({"cat": "Documentació addicional", "spa": "Documentación adicional", "eng": "Additional documentation", "fre":"Documentation complémentaire"}, extra_param.lang), 
						"add_doc", extra_param, false);
					cdns.push("</div>");
				}
				cdns.push("</div><!-- guf_add_doc -->");
			}
			
			if (HiHaReprodUsage(guf.usage.usage_descr))
			{
				cdns.push("<div class=\"guf_reprodUsage user\">");
				cdns.push("<span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Ús reproduïble", "spa":"Uso reproducible", "eng":"Reproducible usage", "fre":"Utilisation reproductible"}, extra_param.lang), ":</span>");								
				if (guf.usage.usage_descr.code)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Codi (text)", "spa":"Código (texto)", "eng":"Code (text)", "fre":"Code (texte)"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.code);
				if (guf.usage.usage_descr.codeLink.linkage)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Codi (adreça URL)", "spa":"Código (dirección URL)", "eng": "Code (URL link)", "fre":"Code (URL)"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.codeLink.linkage);												
				if (guf.usage.usage_descr.codeMediaType && guf.usage.usage_descr.codeMediaType.length>0)
				{
					var s="";				
					if (guf.usage.usage_descr.codeMediaType=="application/json")
						s="JSON ("+guf.usage.usage_descr.codeMediaType+")";
					else if (guf.usage.usage_descr.codeMediaType=="text/x-python")
						s="Phyton ("+guf.usage.usage_descr.codeMediaType+")";
					else if (guf.usage.usage_descr.codeMediaType=="text/x-r-source")
						s="R ("+guf.usage.usage_descr.codeMediaType+")";
					else if (guf.usage.usage_descr.codeMediaType=="application/vnd.docker")
						s=GUFDonaCadenaLang({"cat":"Contenidor docker", "spa":"Contenedor docker", "eng":"Docker container", "fre":"Conteneur Docker"}, extra_param.lang)+" ("+guf.usage.usage_descr.codeMediaType+")";
					else
						s=guf.usage.usage_descr.codeMediaType;
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Format del codi", "spa":"Formato del código", "eng": "Code format", "fre":"Format de code"}, extra_param.lang), "</span>: ", s);								
				}	
				if (guf.usage.usage_descr.platform)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Plataforma", "spa":"Plataforma", "eng":"Platform", "fre":"Plateforme"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.platform);							
				if (guf.usage.usage_descr.version)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Versió", "spa":"Versión", "eng": "Version", "fre":"Version"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.version);								
				if (guf.usage.usage_descr.schema)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Esquema", "spa":"Esquema", "eng": "Schema", "fre":"Schème"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.schema);
				if (guf.usage.usage_descr.suggestedApplication)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Aplicació suggerida", "spa":"Aplicación sugerida", "eng":"Suggested application", "fre":"Application suggérée"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.suggestedApplication);							
				if (guf.usage.usage_descr.diagram)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Diagrama (text)", "spa":"Diagrama (texto)", "eng": "Diagram (text)", "fre":"Diagramme (texte)"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.diagram);			
				if (guf.usage.usage_descr.diagramLink.linkage)
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Diagrama (adreça URL)", "spa":"Diagrama (dirección URL)", "eng": "Diagram (URL link)", "fre":"Diagramme (URL)"}, extra_param.lang), "</span>: ", guf.usage.usage_descr.diagramLink.linkage);			
				if (guf.usage.usage_descr.diagramMediaType && guf.usage.usage_descr.diagramMediaType.length>0)
				{
					var s="";					
					if (guf.usage.usage_descr.diagramMediaType=="image/jpeg")
						s="JPEG ("+guf.usage.usage_descr.diagramMediaType+")";
					else if (guf.usage.usage_descr.diagramMediaType=="image/png")
						s="PNG ("+guf.usage.usage_descr.diagramMediaType+")";
					else if (guf.usage.usage_descr.diagramMediaType=="text/x-python")
						s="Phyton ("+guf.usage.usage_descr.diagramMediaType+")";
					else if (guf.usage.usage_descr.diagramMediaType=="text/x-yuml")
						s="YUML ("+guf.usage.usage_descr.diagramMediaType+")";
					else if (guf.usage.usage_descr.diagramMediaType=="application/xmi+xml")
						s="XMI ("+guf.usage.usage_descr.diagramMediaType+")";
					else
						s=guf.usage.usage_descr.diagramMediaType;
					cdns.push("<br><span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Format del diagrama", "spa":"Formato del diagrama", "eng": "Diagram format", "fre":"Format de diagramme"}, extra_param.lang), "</span>: ", s);
				}
				cdns.push("</div><!-- guf_reprodUsage -->");
			}						
			cdns.push("</div><!-- guf_usage_description -->");						
		}	
		if (guf.usage.discov_issue)
		{			
			cdns.push("<div class=\"guf_discovered_issue user\"><hr class=\"guf_dashed user\">");
			
			if (guf.usage.discov_issue.known_problem)
				cdns.push("<div class=\"guf_known_problem user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Problema conegut", "spa": "Problema conocido", "eng": "Known problem", "fre": "Problème connu"}, extra_param.lang), ":</span> ", guf.usage.discov_issue.known_problem, "</div>");
			
			if (guf.usage.discov_issue.problem_dt)
			{
				var s=DonaCadenaDataHoraDesDeElementCompost(guf.usage.discov_issue.problem_dt);
				if (s!="")
					cdns.push("<div class=\"guf_known_problem_dt user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Data i hora del problema conegut", "spa": "Fecha y hora del problema conocido", "eng": "Known problem date and time", "fre": "Problème connu date et heure"}, extra_param.lang), ":</span> ", s, "</div>");
			}	
			
			if (guf.usage.discov_issue.work_around)
				cdns.push("<div class=\"guf_work_around user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Solució", "spa": "Solución", "eng": "Work around", "fre":"Solution"}, extra_param.lang), ":</span> ", guf.usage.discov_issue.work_around, "</div>");		
				
			if (guf.usage.discov_issue.ref_doc)
			{	
				cdns.push("<div class=\"guf_ref_doc user\">");				
				for (var item=0; item<guf.usage.discov_issue.ref_doc.length; item++)
				{
					cdns.push("<div>");
					ConstrueixCadenaDesdeCitationOPublication(cdns, guf.usage.discov_issue.ref_doc[item], item, 
						GUFDonaCadenaLang({"cat": "Document de referencia", "spa": "Documento de referencia", "eng": "Reference document", "fre":"Document de référence"}, extra_param.lang), 
						"ref_doc", extra_param, true);
					cdns.push("</div>");
				}
				cdns.push("</div><!-- guf_ref_doc -->");
			}
			
			if (guf.usage.discov_issue.exp_fix_date)
				cdns.push("<div class=\"guf_exp_solution_date user\"><span class=\"guf_key user\">", GUFDonaCadenaLang({"cat": "Data prevista per la distribució d'una solució", "spa": "Fecha prevista para la distribución de una solución", 
					"eng": "Expected date for a solution to be released", "fre": "Date prévue pour la publication d'une solution"}, extra_param.lang), ":</span> ", guf.usage.discov_issue.exp_fix_date, "</div>");;
			
			if (guf.usage.discov_issue.fix_rsrc)
			{					
				cdns.push("<div class=\"guf_fix_rsrc user\">");				
				for (var item=0; item<guf.usage.discov_issue.fix_rsrc.length; item++)
				{
					cdns.push("<div>");
					ConstrueixCadenaDesdeCitationOPublication(cdns, guf.usage.discov_issue.fix_rsrc[item], item, 
						GUFDonaCadenaLang({"cat": "Recurs arreglat", "spa": "Recurso arreglado", "eng": "Fixed resource", "fre": "Ressource fixe"}, extra_param.lang), 
						"fix_rsrc", extra_param, false);
					cdns.push("</div>");
				}
				cdns.push("</div><!-- guf_fix_rsrc -->");
			}			
			cdns.push("</div><!-- guf_discovered_issue -->");
			
			if (guf.usage.discov_issue.alt_rsrc)
			{					
				cdns.push("<div class=\"guf_alt_rsrc user\">");				
				for (var item=0; item<guf.usage.discov_issue.alt_rsrc.length; item++)
				{
					cdns.push("<div>");
					ConstrueixCadenaDesdeCitationOPublication(cdns, guf.usage.discov_issue.alt_rsrc[item], item, 
						GUFDonaCadenaLang({"cat": "Recurs alternatiu", "spa": "Recurso alternativo", "eng": "Alternative resource", "fre": "Ressource alternative"}, extra_param.lang), 
						"alt_rsrc", extra_param, false);
					cdns.push("</div>");
				}
				cdns.push("</div><!-- guf_alt_rsrc -->");
			}			
			cdns.push("</div><!-- guf_discovered_issue -->");
		}	
		cdns.push("</div><!-- guf_usage user -->");
	}

	if (guf.public)
	{			
		cdns.push("<div class=\"guf_public user\"><hr class=\"guf_solid user\">");
		for (var i_publi=0; i_publi<guf.public.length; i_publi++)
		{
			cdns.push("<div>");
			ConstrueixCadenaDesdeCitationOPublication(cdns, guf.public[i_publi], i_publi, null, "pub", extra_param, true);		
			cdns.push("</div>");
		}
		cdns.push("</div><!-- guf_public -->");
	}
	
	if (guf.target)
	{			
		cdns.push("<div class=\"guf_target user\"><hr class=\"guf_solid user\">");	
		for (var i_target=0; i_target<guf.target.length; i_target++)
		{	
			cdns.push("<span class=\"guf_key user\">", GUFDonaCadenaLang({"cat":"Recurs valorat", "spa":"Recurso valorado", "eng":"Target resource", "fre":"Ressource valoris�e"}, extra_param.lang));
			
			if (guf.target[i_target].role)
				cdns.push(" (", GUFDonaCadenaLang(GUF_TargetRoleCode[guf.target[i_target].role],extra_param.lang),"):</span> ");
			else
				cdns.push(":</span> ");
			//cdns.push("<input type=\"checkbox\" id=\""+extra_param.div_id+"_"+i_target+"\" style=\"display:none;\">");

			if (guf.target[i_target].title)
				cdns.push(guf.target[i_target].title, "<br/>");
			//cdns.push(" <div class=\"guf_folded user\">");
			
			if (guf.target[i_target].identifier)
			{
	  			for (var i_id=0; i_id<guf.target[i_target].identifier.length; i_id++)
	  				cdns.push(ConstrueixURLDesdeIdentifierSiDOIoNiMMbus(guf.target[i_target].identifier[i_id], extra_param.lang, false));
			}
			if (guf.target[i_target].scope) //comprovem que a l'xml hi ha la secci� scope
			{
				if (guf.target[i_target].minlong) //comprovem que hi ha dades de coordenades. No cal comprovar que hi siguin totes.
					cdns.push("<span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Envolupant", "spa":"Envolvente", "eng":"Bounding box", "fre":"Extension g�ographique"}, extra_param.lang),":</span>"," ",guf.target[i_target].minlong,", ",guf.target[i_target].maxlong,", ",guf.target[i_target].minlat,", ",guf.target[i_target].maxlat,"<br>");
				if (guf.target[i_target].gmlpol) //comprovem si tenim un poligon gml
					cdns.push("<span class=\"guf_key_2 user\">", GUFDonaCadenaLang({"cat":"Pol�gon GML", "spa":"Pol�gono GML", "eng":"GML polygon", "fre":"GML polygone"}, extra_param.lang),":</span>"," ", GUFDonaCadenaLang({"cat":"definit", "spa":"definido", "eng":"defined", "fre":"d�fini"}),"<br>");
			}
			//cdns.push("</div><label for=\""+extra_param.div_id+"_"+i_target+"\"><i>Click to show/hide more information</i></label></input>");
			//cdns.push("<br/>");
		}
		cdns.push("</div><!-- guf_target -->");
	}
	document.getElementById(extra_param.div_id).innerHTML=cdns.join("");
}

var GUFFeedbackWindow=null;
function GUFOpenNimmbus(lang, access_token_type)
{
	if (GUFFeedbackWindow==null || GUFFeedbackWindow.closed)
	{
		GUFFeedbackWindow=window.open(ClientGUF+"?ACCESS_TOKEN_TYPE="+access_token_type, Opcions_GUFFeedbackWindow);
		GUFShaObertPopUp(GUFFeedbackWindow, lang);
	}
	else
	{
		GUFFeedbackWindow.location.href=ClientGUF;
		GUFFeedbackWindow.focus();
	}
}

function GUFDonaNomFitxerAddFeedback(title, code, codespace, access_token_type, reprod_usage, lang)
{
var targets=[{title: title, code: code, codespace: codespace, role: "primary"}];
//en versions previes no es passava lang, per això ho faig així:
	return GUFDonaNomFitxerAddFeedbackMutipleTargets(targets, lang ? lang : "eng", access_token_type, reprod_usage);
}

function GUFFragmentKVPSobreReproducibleUsage(reprod_usage)
{
	var url="";

	if (reprod_usage.abstract!="") //típicament hi va el nom estil, p.ex.
		url+="&ABSTRACT="+reprod_usage.abstract;					
	url+="&REPORT_ASPECT="+"usage";
	if (reprod_usage.specific_usage!="")
		url+="&SPECIFIC_USAGE="+reprod_usage.specific_usage;
	/*date time -> de moment es crearà amb l'actual en el nimmbus al darrer moment
	if ((p=DonaCadenaDataHoraPerValorDeFormulari(document.feedback_resource_form.usage_date.value,document.feedback_resource_form.usage_time.value))!="")
		url+="&USAGE_DATE_TIME="+p;*/
	if (reprod_usage.ru_code!="")
		url+="&RU_CODE="+reprod_usage.ru_code;
	if (reprod_usage.ru_code_media_type!="")
		url+="&RU_CODE_FORMAT="+reprod_usage.ru_code_media_type;		
	if (reprod_usage.ru_platform!="")
		url+="&RU_PLATFORM="+reprod_usage.ru_platform;
	if (reprod_usage.ru_version!="")
		url+="&RU_VERSION="+reprod_usage.ru_version;
	if (reprod_usage.ru_sugg_app!="")
		url+="&RU_SUGG_APP="+reprod_usage.ru_sugg_app;
	if (reprod_usage.ru_schema!="")
		url+="&RU_SCHEMA="+reprod_usage.ru_schema;	
	return url;
}

var ReprodUsageForPostMessage="";

function GUFDonaNomFitxerAddFeedbackMutipleTargets(targets, lang, access_token_type, reprod_usage)
{
	var url=ClientGUF;
	var n_targets=0;

	for (var i=0; i<targets.length; i++)	
	{		
		if (targets[i].title && targets[i].title!="" && targets[i].code && targets[i].code!="" && targets[i].codespace && targets[i].codespace!="")
		{	//aquest target és vàlid
			//OG: aquí afegim el bbox i el gml pol a la query que rebrà el nimmbus
			if (n_targets==0) //i és el primer
				url+="?target_title=" + targets[i].title + "&target_code=" + targets[i].code + "&target_codespace=" + targets[i].codespace + (targets[i].role ? ("&target_role=" + targets[i].role) : "") +
				 (targets[i].bbox ? ("&target_geo_bbox=" + targets[i].bbox.xmin+","+targets[i].bbox.xmax+","+targets[i].bbox.ymin+","+targets[i].bbox.ymax ): "")+
				 (targets[i].gmlpol ? ("&target_bnd_pol=" + targets[i].gmlpol.gml) : ""); 	
			else
				url+="&target_title_" + (n_targets+1) + "=" + targets[i].title + "&target_code_" + (n_targets+1) + "=" + targets[i].code + 
						"&target_codespace_" + (n_targets+1) + "=" + targets[i].codespace + 
						(targets[i].role ? ("&target_role_" + (n_targets+1) + "=" + targets[i].role) : "")+
						(targets[i].bbox ? ("&target_geo_bbox_" + (n_targets+1) + "=" + targets[i].bbox.xmin+","+targets[i].bbox.xmax+","+targets[i].bbox.ymin+","+targets[i].bbox.ymax ): "") +
				 		(targets[i].gmlpol ? ("&target_bnd_pol_"+ (n_targets+1) + "=" + targets[i].gmlpol.gml) : "")	; 	
			n_targets++;
		}		
		
		if (n_targets>2)
		{
	    alert(GUFDonaCadenaLang({"cat":"De moment només s'accepten dos recursos objectius de la valoració, la resta seran ignorats.", 
							  "spa":"De momento sólo se aceptan dos recursos objetivos de la valoración, el resto serán ignorados.", 
							  "eng":"At the moment, only two target resources of the feedback item are accepted, the rest will be ignored.",
							  "fre":"Pour le moment, seules deux ressources cibles de l'élément de rétroaction sont acceptées, le reste sera ignoré."}, lang));
			break;
		}
	}
	if (n_targets==0) //cap vàlid
	{
	    alert(GUFDonaCadenaLang({"cat":"No hi ha cap recurs objectiu de la valoració.", 
							  "spa":"No hay ningún recurso objetivo de la valoración.", 
							  "eng":"There is no target resources of the feedback item.",
							  "fre":"Il n'y a pas de ressources cibles de l'élément de rétroaction."}, lang));	
			return "";
	}	
	url+="&ACCESS_TOKEN_TYPE=" + access_token_type + "&page=ADDFEEDBACK&share_borrower_1=Anonymous"; 	

	ReprodUsageForPostMessage="";
	if (reprod_usage!=null)
	{
			url+="&POST_MESSAGE_FROM=" + location.href;	
			ReprodUsageForPostMessage=GUFFragmentKVPSobreReproducibleUsage(reprod_usage);
	}	
	return url;
}

function GUFAfegirFeedbackCapa(title, code, codespace, lang, access_token_type, reprod_usage)
{
var targets=[{title: title, code: code, codespace: codespace, role: "primary"}];
	return GUFAfegirFeedbackCapaMultipleTargets(targets, lang, access_token_type, reprod_usage);
}

var HeAfegitListenerReprodUsage=false;
function GUFAfegirFeedbackCapaMultipleTargets(targets_obj_o_str, lang, access_token_type, reprod_usage)
{
var targets;
	
	if (typeof(targets_obj_o_str) === "string")
		targets = JSON.parse(targets_obj_o_str);
	else if (typeof(targets_obj_o_str) === "object" && Array.isArray(targets_obj_o_str))
		targets = targets_obj_o_str;
	else
	{
		alert("targets_obj_o_str needs and object or an string");	
		return;
	}
	
	if (!HeAfegitListenerReprodUsage)
	{
		window.addEventListener("message", EnviaReprodUsageComAPostMessage);
		HeAfegitListenerReprodUsage=true;
	}
	if (GUFFeedbackWindow==null || GUFFeedbackWindow.closed)
	{
		var url=GUFDonaNomFitxerAddFeedbackMutipleTargets(targets, lang, access_token_type, reprod_usage);
		GUFFeedbackWindow=window.open(url,"Feedback", Opcions_GUFFeedbackWindow);
		GUFShaObertPopUp(GUFFeedbackWindow, lang);
	}
	else
	{
		GUFFeedbackWindow.location.href=GUFDonaNomFitxerAddFeedbackMutipleTargets(targets, lang, access_token_type, reprod_usage);
		GUFFeedbackWindow.focus();
	}	
}

function GUFDonaCadenaFinestraFeedbackResource(div_id, rsc_type, title, code, codespace, lang, access_token_type)
{
var targets=[{title: title, code: code, codespace: codespace, role: "primary"}];	
	return GUFDonaCadenaFinestraFeedbackResourceMultipleTargets(div_id, rsc_type, targets, lang, access_token_type);
}

function TornaNTargetsSecundaris(targets)
{
	var n_targets_secundaris=0;

	for (var i=0; i<targets.length; i++)	
	{		
		if (targets[i].role=="secondary")
			n_targets_secundaris++;
	}
	return n_targets_secundaris;
}

function GUFDonaCadenaFinestraFeedbackResourceMultipleTargets(div_id, rsc_type, targets, lang, access_token_type, name_scope_function) 
{
var cdns=[];
var n_targets_secundaris=0;

	cdns.push("<form name=\"FeedbackResourceForm\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"", div_id, "\" class=\"guf_widget user\" style=\"position:relative;left:10px;top:10px;width:95%\">");
	if (rsc_type != "")
		cdns.push("<div class=\"guf_add_fb user\"><fieldset class=\"guf_fieldset user\"><legend class=\"guf_legend user\">", 
			GUFDonaCadenaLang({"cat":"Afegir valoracions a", "spa":"Añadir valoraciones a", "eng":"Add user feedback to", "fre":"Ajouter rétroaction de l'utilisateur de"}, lang), 
			" ", rsc_type,
			"</legend>");
	else
		cdns.push("<div class=\"guf_add_fb user\">");

	cdns.push("<input type=\"button\" class=\"guf_button user\" value=\"",
				  GUFDonaCadenaLang({"cat":"Afegir una valoració", "spa":"Añadir una valoración", "eng":"Add a user feedback", "fre":"Ajouter une rétroaction de l'utilisateur"}, lang), "\"",
				  " onClick='GUFAfegirFeedbackCapaMultipleTargets(\"", JSON.stringify(targets).replaceAll("\"","\\\""), "\", \"", lang, "\", \"", access_token_type, "\");' />");

//$$OG: nou botó per afegir scope a un FB
	if (name_scope_function)
	{
		cdns.push("<input type=\"button\" class=\"guf_button user\" value=\"",
				  GUFDonaCadenaLang({"cat":"Valoració d'una àrea específica", "spa":"Valoración de un área específica", "eng":"Feedback of a specific area", "fre":"Rétroaction d'un domaine spécifique"}, lang), "\"",
				  " onClick='"+name_scope_function+"(\"", JSON.stringify(targets).replaceAll("\"","\\\""), "\", \"", lang, "\", \"", access_token_type, "\");' />");
	}
	if (rsc_type != "")
		cdns.push("</fieldset></div>");
	else
		cdns.push("</div><br>");

	cdns.push("<div class=\"guf_report user\"><fieldset class=\"guf_fieldset user\"><legend class=\"guf_legend user\">"); 
	if (rsc_type != "")
		cdns.push(GUFDonaCadenaLang({"cat":"Valoracions prèvies a", "spa":"Valoraciones previas a", "eng":"Previous user feedback to", "fre":"Précédent rétroaction de l'utilisateur de"}, lang));
	else
		cdns.push(GUFDonaCadenaLang({"cat":"Valoracions prèvies", "spa":"Valoraciones previas", "eng":"Previous user feedback", "fre":"Précédent rétroaction de l'utilisateur"}, lang));
	cdns.push(" ", rsc_type, "</legend>");
	
	cdns.push("<div id=\"",div_id,"Previ\" style=\"width:98%\">", "</div></fieldset>");
	
	n_targets_secundaris=TornaNTargetsSecundaris(targets);
	if (n_targets_secundaris)
	{
		for (var i=0; i<targets.length; i++)	
		{		
			if (targets[i].role=="secondary")
				break;
		}
		//caldria fer un bucle per els N secundaris, ara només uso el primer (pq com ara només permeto dos...)
		cdns.push("<fieldset class=\"guf_fieldset user\"><legend class=\"guf_legend user\">"); 
		cdns.push(GUFDonaCadenaLang({"cat":"Valoracions prèvies a l'objectiu secundari", "spa":"Valoraciones previas al objectivo secundario", "eng":"Previous user feedback to secondary target", "fre":"Précédent rétroaction de l'utilisateur sur la cible secondaire"}, lang));
		cdns.push(" ", targets[i].title ? ("\""+targets[i].title +"\""): "", "</legend>");		
		cdns.push("<div id=\"",div_id,"Previ_secundari\" style=\"width:98%\">", "</div></fieldset>");
	}
	cdns.push("</div>", "</div></form>");
	
	return cdns.join("");
}

function EnviaReprodUsageComAPostMessage(event)
{
	if (GUFFeedbackWindow && ReprodUsageForPostMessage!="")
	{
		GUFFeedbackWindow.postMessage(ReprodUsageForPostMessage, ClientGUF);
		ReprodUsageForPostMessage="";
	}
}
