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

    Copyright 2014, 2025 Xavier Pons

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

var Opcions_LBlogpageWindow='toolbar=no,status=no,scrollbars=yes,location=no,menubar=no,directories=no,resizable=yes,width=1500,height=1000';

function LBIncludeScript(url, late)   //https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
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

LBIncludeScript("xml_log.js");

function LBShowLogBookInHTMLDiv(elem, seed_div_id, rsc_type, title, code, codespace, lang, access_token_type, name_scope_function, capa)
{
    var targets=[{title: title, code: code, codespace: codespace, role: "primary"}];
    if (targets[0].codespace)
        targets[0].codespace=targets[0].codespace.replace("https://","http://");

    elem.innerHTML = LBDonaCadenaFinestraLogBookResource(seed_div_id, rsc_type, targets, lang, access_token_type, name_scope_function, capa);

    //demano el fitxer atom de logpages previs
    LBShowPreviousLogPagesInHTMLDiv(seed_div_id, rsc_type, targets, lang, access_token_type);
}

function LBShowPreviousLogPagesInHTMLDiv(div_id, rsc_type, targets, lang, access_token_type)
{
	var url=ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:ENUMERATE&LANGUAGE=" + lang + "&STARTINDEX=1&COUNT=100&FORMAT=text/xml&TYPE=LOGPAGE";
	var url2=url;
	
    //Agafo el logbook i l'envio a la primera part de la finestra
    if (targets[0].codespace) //decidim que els codespace han de ser independent del protocol i per això els posarem sense S sempre ara
        targets[0].codespace=targets[0].codespace.replace("https://","http://");

    if (targets[0].title && targets[0].code && targets[0].codespace && (typeof(targets[0].role)== "undefined" || targets[0].role=="primary"))
        url+="&TRG_TYPE_1=LOGBOOK&TRG_FLD_1=CODE&TRG_VL_1=" + targets[0].code + "&TRG_OPR_1=EQ&TRG_NXS_1=AND&TRG_TYPE_2=LOGBOOK&TRG_FLD_2=NAMESPACE&TRG_VL_2=" + targets[0].codespace + "&TRG_OPR_2=EQ";
	
	//l'espai de LogPages previs sobre el LogBook el poso sempre 
	loadFile(url, "text/xml", LBCarregaLogPageAnteriorsCallback, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); }, {url: url, div_id: div_id+"Previ", rsc_type:rsc_type, lang: lang, access_token_type: access_token_type});
}

function LBDonaCadenaFinestraLogBookResource(div_id, rsc_type, targets, lang, access_token_type, name_scope_function, capa) 
{
	var cdns = [];

	cdns.push("<form name=\"LogBookResourceForm\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"", div_id, "\" class=\"lb_widget user\" style=\"position:relative;left:10px;top:10px;width:95%\">");
	if (rsc_type != "")
		cdns.push("<div class=\"lb_add_lp user\"><fieldset class=\"lb_fieldset user\"><legend class=\"lb_legend user\">", 
			LBDonaCadenaLang({"cat":"Afegir registres a", "spa":"Añadir registros a", "eng":"Add logs to", "fre":"Ajouter des enregistrements à"}, lang), 
			" ", rsc_type, "</legend>");
	else
		cdns.push("<div class=\"lb_add_fb user\">");

	// Desplegables
	if (capa && capa.dimensioExtra && capa.dimensioExtra.length > 0) {
		for (var i = 0; i < capa.dimensioExtra.length; i++) {
			var dim = capa.dimensioExtra[i];
			var selectedIndex = dim.i_valor || 0;

			var optAllText = { cat: "Tots", spa: "Todos", eng: "All", fre: "Tous" }[lang] || "Tots";

			var hasAll = dim.valor.some(function(v) {
				return v.desc.trim().toLowerCase() === optAllText.toLowerCase();
			});

			cdns.push("<label for=\"dimExtra_" + i + "\" style=\"margin-right:0.5em;\">",
					dim.clau.desc || ("Dimensió " + (i+1)), ":</label>");
			cdns.push("<select id=\"dimExtra_" + i + "\" name=\"dimExtra_" + i + "\" class=\"lb_select user\" style=\"margin-bottom:0.5em;\">");

			if (!hasAll) {
				cdns.push("<option value=\"-1\">" + optAllText + "</option>");
			}

			for (var j = 0; j < dim.valor.length; j++) {
				var val = dim.valor[j];
				var selected = (j === selectedIndex) ? " selected" : "";
				cdns.push("<option value=\"" + j + "\"" + selected + ">" + val.desc + "</option>");
			}

			cdns.push("</select><br>");
		}
	}

	var numDimExtras = (capa && capa.dimensioExtra) ? capa.dimensioExtra.length : 0;

	// Botó 1: Afegir un registre
	cdns.push(DonaBotoAfegirLogBook(
		targets,
		lang,
		access_token_type,
		"LBAfegirLogPageCapaMultipleTargets",
		numDimExtras,
		LBDonaCadenaLang({
			cat: "Afegir un registre",
			spa: "Añadir un registro",
			eng: "Add a logpage",
			fre: "Ajouter une enregistrements"
		}, lang),
		"boto_lb_1"
	));

	// Botó 2: Afegir un registre (punt/pol)
	if (name_scope_function) {
		cdns.push(DonaBotoAfegirLogBook(
			targets,
			lang,
			access_token_type,
			name_scope_function,
			numDimExtras,
			LBDonaCadenaLang({
				cat: "Afegir un registre (punt/pol)",
				spa: "Añadir un registro (punto/pol)",
				eng: "Add a logpage (point/pol)",
				fre: "Ajouter une enregistrements (place/pol)"
			}, lang), 
			"boto_lb_2"
		));
	}

	if (rsc_type != "")
		cdns.push("</fieldset></div>");
	else
		cdns.push("</div><br>");

	cdns.push("<div id=\"preLP\" class=\"lb_report user\"><fieldset class=\"lb_fieldset user\"><legend class=\"lb_legend user\">"); 
	if (rsc_type != "")
		cdns.push(LBDonaCadenaLang({"cat":"Registres previs a", "spa":"Registros previos a", "eng":"Previous logs to", "fre":"Précédent enregistrements de"}, lang));
	else
		cdns.push(LBDonaCadenaLang({"cat":"Registres previs", "spa":"Registros previos", "eng":"Previous logs", "fre":"Précédent enregistrements"}, lang));
	cdns.push(" ", rsc_type, "</legend>");
	
	cdns.push("<div id=\"",div_id,"Previ\" style=\"width:98%\">", "</div></fieldset>");
	cdns.push("</div>", "</div></form>");

	return cdns.join("");
}

function DonaBotoAfegirLogBook(targets, lang, access_token_type, name_scope_function, numDimExtras, label, id_boto) {
	const id = id_boto;
	const cdns = [];

	// Assignem el botó amb id i onclick simple
	cdns.push("<input type=\"button\" class=\"lb_button user\" id=\"", id, "\" value=\"", label, "\" />");

	setTimeout(function () {
		const boto = document.getElementById(id);
		if (boto) {
			boto.onclick = function () {
				const dims = [];
				for (let i = 0; i < numDimExtras; i++) {
					const sel = document.getElementById("dimExtra_" + i);
					const labelEl = document.querySelector("label[for='dimExtra_" + i + "']");
					const label = labelEl ? labelEl.innerText.trim() : "dimExtra_" + i;
					const val = sel ? sel.options[sel.selectedIndex].text : "-1";
					dims.push([label, val]);
				}
				window[name_scope_function](targets, lang, access_token_type, dims);
			};
		}
	}, 0);

	return cdns.join("");
}

function LBAfegirLogPageCapaMultipleTargets(targets_obj_o_str, lang, access_token_type, dims)
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
	
	if (LBlogpageWindow==null || LBlogpageWindow.closed)
	{
		var url=LBDonaNomFitxerAddLogPageMutipleTargets(targets, lang, access_token_type, dims);
		if (!url)
			return;
		LBlogpageWindow=window.open(url,"Logpage", Opcions_LBlogpageWindow);
		GUFShaObertPopUp(LBlogpageWindow, lang);
	}
	else
	{
		LBlogpageWindow.location.href=LBDonaNomFitxerAddLogPageMutipleTargets(targets, lang, access_token_type, dims);
		LBlogpageWindow.focus();
	}	
}

function LBDonaNomFitxerAddLogPageMutipleTargets(targets, lang, access_token_type, dims)
{
	var url=ClientGUF;

    if (targets.length == 0)
    {
        alert(GUFDonaCadenaLang({"cat":"No hi ha cap recurs objectiu de la valoració.", 
                        "spa":"No hay ningún recurso objetivo de la valoración.", 
                        "eng":"There is no target resources of the feedback item.",
                        "fre":"Il n'y a pas de ressources cibles de l'élément de rétroaction."}, lang));	
        return "";
    }

    if (targets[0].title)
        targets[0].title = DonaCadenaPerValorDeFormulari(targets[0].title);
    if (targets[0].code)
        targets[0].code = DonaCadenaPerValorDeFormulari(targets[0].code);
    if (targets[0].codespace)
        targets[0].codespace = DonaCadenaPerValorDeFormulari(targets[0].codespace);
    
    if (targets[0].title && targets[0].title!="" && targets[0].code && targets[0].code!="" && targets[0].codespace && targets[0].codespace!="")
    {	//aquest target és vàlid
        url+="?LOGBOOK_TITLE=" + targets[0].title + "&LOGBOOK_CODE=" + targets[0].code + "&LOGBOOK_CODESPACE=" + targets[0].codespace;
    }
	
	var n=1;
	if (targets[0].scopePnt)
	{
		for (var i = 0; i < targets[0].scopePnt.length; i++)
		{
			url+="&LPSC_TYPE_"+ n +"=PNT&LPSC_COORDS_" + n + "=" + targets[0].scopePnt[i].x + "," + targets[0].scopePnt[i].y;
			n++;
		}
	}
	if (targets[0].scopePol)
	{
		for (var i = 0; i < targets[0].scopePol.length; i++)
		{
			url+="&LPSC_TYPE_"+ n +"=POL&LPSC_COORDS_" + n + "=["+ targets[0].scopePol[i].xmin + "," + targets[0].scopePol[i].ymin + "]," +
				"["+ targets[0].scopePol[i].xmax + "," + targets[0].scopePol[i].ymin + "]," +
				"["+ targets[0].scopePol[i].xmax + "," + targets[0].scopePol[i].ymax + "]," +
				"["+ targets[0].scopePol[i].xmin + "," + targets[0].scopePol[i].ymax + "]," +
				"["+ targets[0].scopePol[i].xmin + "," + targets[0].scopePol[i].ymin + "]";
			n++;
		}
	}

	if (dims)
	{
		for (var i = 0; i < dims.length; i++)		
		{
			url+="&AGG_TYPE_"+ (i+1) + "=" + dims[i][0] +" &AGG_VAL_"+ (i+1) + "=" + dims[i][1];
		}
	}

    url+="&ACCESS_TOKEN_TYPE=" + access_token_type + "&PAGE=ADDLOGPAGE&SHARE_BORROWER_1=Anonymous"; 

	return url;
}

function LBCarregaLogPageAnteriorsCallback(doc, extra_param)
{
var cdns=[];

	if (!doc || !doc.documentElement)
	{
		alert (extra_param.url + ": " + LBDonaCadenaLang({"cat":"El retorn no és xml", "spa":"El retorno no es xml", "eng":"Return is not xml", "fre":"Le retour n'est pas xml"}, extra_param.lang));
		return ;
	}
	var root=doc.documentElement;

	if (LBAnalitzaExceptionReport(root, extra_param.url))
		return;
		
	var owc=ParseOWSContextAtom(root);
	if (owc.properties.totalResults==0 || !owc.features)
	{
		document.getElementById(extra_param.div_id).innerHTML= MissatgeSenseElementsRetornats(extra_param);
		return;
	}

	if (typeof extra_param.edit_button!=="undefined" && extra_param.edit_button==false)
	; //si el param no existeix o diu que no vull botó no el poso
	else
		cdns.push("<div class=\"lb_edit user\"><input type=\"button\" class=\"lb_button user\" value=\"",
			LBDonaCadenaLang({"cat":"Edita", "spa":"Edita", "eng":"Edit", "fre":"Éditer"}, extra_param.lang), "\"",
			" onClick='LBOpenNimmbus(\"", extra_param.lang, "\",\"", extra_param.access_token_type, "\");' /> ",
			LBDonaCadenaLang({"cat":"les teves entrades prèvies", "spa":"tus entradas previas", "eng":"your previous entries", "fre":"vos entrées précédentes"}, extra_param.lang), "</div><!-- lb_edit -->"); 

	var type;

	for (var i=0; i<owc.features.length; i++)
	{
		type=GetNimmbusTypeOfAOWCFeature(owc.features[i]);
		if (type=="LOGPAGE")
		{
			var str = owc.features[i].properties.links.alternates[0].href; 
			var n = str.indexOf("&RESOURCE=");
			var str2 = str.substring(n+10);
			var n2 = str2.indexOf("&");  
			str = str2.substring(0, n2);
 		  
			cdns.push("<fieldset class=\"lb_fieldset user\"><legend class=\"lb_legend user\"><a class=\"lb_link user\" href=\""+ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE&LANGUAGE="+extra_param.lang+"&RESOURCE="+str+"\" target=\"_blank\">", owc.features[i].properties.authors[0].name, ", ", DonaDataISOComAText(owc.features[i].properties.updated), 
				"</a></legend>", 							
				"<div id=\"", extra_param.div_id, "_",i , "\"></div>");
								
			/*if (typeof extra_param.callback_function!=="undefined" && extra_param.callback_function != "")
			{
				var params=JSON.stringify(extra_param.params_function);
				params=params.replaceAll("\"","\\\"");
				cdns.push("<div class=\"lb_adopt user\"><input type=\"button\" class=\"lb_button user\" value=\"",
						LBDonaCadenaLang({"cat":"Adopta", "spa":"Adopta", "eng":"Adopt", "fre":"Adopter"}, extra_param.lang), "\"",
                        " onClick='CridaACallBackFunctionAmbEstructuraLB(\"", extra_param.lang, "\",\"", str, "\",\"", extra_param.callback_function, "\",\"", params, "\");'/>");			
			}*/
			cdns.push("</fieldset>");		
		}
	}
	document.getElementById(extra_param.div_id).innerHTML=cdns.join("");
	for (var i=0; i<owc.features.length; i++)
	{
		type=GetNimmbusTypeOfAOWCFeature(owc.features[i]);
		if (type=="LOGPAGE" && owc.features[i].properties && owc.features[i].properties.links && owc.features[i].properties.links.alternates && owc.features[i].properties.links.alternates.length && owc.features[i].properties.links.alternates[0].href)
            loadFile(owc.features[i].properties.links.alternates[0].href, "text/xml", LBCarregaLogPageAnteriorCallback, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); }, {url: owc.features[i].properties.links.alternates[0].href, div_id: extra_param.div_id + "_" + i, lang: extra_param.lang, esRU: extra_param.callback_function});
	}
}

var LBlogpageWindow=null;
function LBOpenNimmbus(lang, access_token_type)
{
	if (LBlogpageWindow==null || LBlogpageWindow.closed)
	{
		LBlogpageWindow=window.open(ClientGUF+"?ACCESS_TOKEN_TYPE="+access_token_type, Opcions_LBlogpageWindow);
		GUFShaObertPopUp(LBlogpageWindow, lang);
	}
	else
	{
		LBlogpageWindow.location.href=ClientGUF;
		LBlogpageWindow.focus();
	}
}

//Duplicated from the MiraMon Map Browser
function GUFShaObertPopUp(wnd, lang)
{
	if (wnd==null)
	{
	    alert(LBDonaCadenaLang({"cat":"Aquest navegador té les finestres emergents bloquejades. Canvia la configuració del teu navegador.\nEn algunes versions d'Internet Explorer, només cal fer un clic sobre la faixa groga superior.", 
							  "spa":"Este navegador tiene las ventanas emergentes bloqueadas. Modifique la configuración de su navegador.\nEn algunas versiones de Internet Explorer, un clic sobre la banda amarilla superior es suficiente.", 
							  "eng":"Sorry, this browser has pop-up windows locked. Please change browser configuration.\nIn some Internet Explorer versions only a click on top yellow band will fix it.",
							  "fre":"Ce navigateur a les fenêtres émergentes fermées. Changez la configuration de votre navigateur.\nDans certaines versions d'Internet Explorer, il suffit de cliquer sur la barre jaune supérieure."}, lang));
	    return false;
	}
	return true;
}

//Duplicated from guf.js
function LBAnalitzaExceptionReport(root, url)
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

function LBDonaCadenaLang(cadena_lang, lang)
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

function CridaACallBackFunctionAmbEstructuraLB(lang, resource_id, callback_function, params_function)
{
	var url=ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE&LANGUAGE="+lang+"&RESOURCE="+resource_id;		
	loadFile(url, "text/xml", LBCarregaLogPageAnteriorCallback, function(xhr, extra_param) { alert(url + ": " + xhr ); }, {url: url, lang: lang, callback_function: callback_function, params_function: params_function});
}

function LBCarregaLogPageAnteriorCallback(doc, extra_param) 
{
    var cdns = [];

    if (!doc || !doc.documentElement) {
        alert(extra_param.url + ": " + LBDonaCadenaLang({
            "cat": "El retorn no és xml",
            "spa": "El retorno no es xml",
            "eng": "Return is not xml",
            "fre": "Le retour n'est pas xml"
        }, extra_param.lang));
        return;
    }

    var root = doc.documentElement;

    if (LBAnalitzaExceptionReport(root, extra_param.url))
        return;

    var lp = GetRetrieveResourceLogBookOutputs(root);

    if (!lp) 
	{
        alert(extra_param.url + ": " + LBDonaCadenaLang({
            "cat": "El retorn no és un xml d'una pàgina de registre",
            "spa": "El retorno no es un xml de una página de registro",
            "eng": "Return is not a logpage xml",
            "fre": "Le retour n'est pas un xml d'une page d'inscription"
        }, extra_param.lang));
        return;
    }

    var divId = extra_param.div_id;
    var comment = lp.comment || "";
    var isLong = comment.length > 100;
    var truncated = isLong ? comment.substring(0, 100) + '[...]' : comment;

    cdns.push('<span id="title_' + divId + '"><b>' + lp.title + '</b></span><br><br>');
    cdns.push('<span id="lpDesc_' + divId + '">' + truncated + '</span><br>');

    // Extra info sempre present però ocult d'inici
    cdns.push(
        '<span id="extraInfo_' + divId + '" style="display:none; margin-top: 0.5em;">' +
            '<div><strong>Content Date:</strong> ' + (lp.contentDateIni || '-') + ' / ' + (lp.contentDateFin || '-') +'</div>' +
            '<div><strong>Link:</strong> ' + (lp.link || '-') + '</div>' +
			'<div><strong>Aggregation Type:</strong> ' + (lp.aggType || '-') + '</div>' +
            '<div><strong>Aggregation Value:</strong> ' + (lp.aggValue || '-') + '</div>' +
        '</span><br>' +
        '<a href="#" id="toggleInfo_' + divId + '">+ info</a>'
    );

    document.getElementById(divId).innerHTML = cdns.join("");

    // Afegeix el comportament de toggle sempre
    document.getElementById("toggleInfo_" + divId).addEventListener("click", function (event) {
        event.preventDefault();
        var extra = document.getElementById("extraInfo_" + divId);
        var shortComment = document.getElementById("lpDesc_" + divId);
        var link = document.getElementById("toggleInfo_" + divId);

        var showingExtra = extra.style.display === "block";

        if (showingExtra) 
		{
            extra.style.display = "none";
            shortComment.innerHTML = isLong ? truncated : comment;
            link.innerHTML = "+ info";
        }
		else 
		{
            extra.style.display = "block";
            shortComment.innerHTML = comment;  // sempre mostrem el complet
            link.innerHTML = "- info";
        }
    });
}




