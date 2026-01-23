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
var ClientGUF="https://www.nimmbus.cat";

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

function LBShowLogBookInHTMLDiv(elem, seed_div_id, rsc_type, title, code, codespace, lang, access_token_type, name_scope_function, capa, idfeature)
{
    var targets=[{title: title, code: code, codespace: codespace, role: "primary"}];
    if (targets[0].codespace)
        targets[0].codespace=targets[0].codespace.replace("https://","http://");

    elem.innerHTML = LBDonaCadenaFinestraLogBookResource(seed_div_id, rsc_type, targets, lang, access_token_type, name_scope_function, capa, idfeature);

    //demano el fitxer atom de logpages previs
    LBShowPreviousLogPagesInHTMLDiv(seed_div_id, rsc_type, targets, lang, access_token_type, idfeature);
}

function LBShowPreviousLogPagesInHTMLDiv(div_id, rsc_type, targets, lang, access_token_type, idfeature)
{
	var url=ServerGUF+"?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:ENUMERATE&LANGUAGE=" + lang + "&STARTINDEX=1&COUNT=100&FORMAT=text/xml&TYPE=LOGPAGE";
	
	if (idfeature != null)
        url += "&ID_FEATURE=" + idfeature;
    //Agafo el logbook i l'envio a la primera part de la finestra
    if (targets[0].codespace) //decidim que els codespace han de ser independent del protocol i per això els posarem sense S sempre ara
        targets[0].codespace=targets[0].codespace.replace("https://","http://");

    if (targets[0].title && targets[0].code && targets[0].codespace && (typeof(targets[0].role)== "undefined" || targets[0].role=="primary"))
        url+="&TRG_TYPE_1=LOGBOOK&TRG_FLD_1=CODE&TRG_VL_1=" + targets[0].code + "&TRG_OPR_1=EQ&TRG_NXS_1=AND&TRG_TYPE_2=LOGBOOK&TRG_FLD_2=NAMESPACE&TRG_VL_2=" + targets[0].codespace + "&TRG_OPR_2=EQ";
	
	//l'espai de LogPages previs sobre el LogBook el poso sempre 
	loadFile(url, "text/xml", LBCarregaLogPageAnteriorsCallback, function(xhr, extra_param) { alert(extra_param.url + ": " + xhr ); }, {url: url, div_id: div_id, rsc_type:rsc_type, lang: lang, access_token_type: access_token_type, id_feature: idfeature});
}

function LBDonaCadenaFinestraLogBookResource(div_id, rsc_type, targets, lang, access_token_type, name_scope_function, capa, idfeature) 
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

	// Desplegable
	if (capa && capa.objectes && capa.objectes.features && capa.objectes.features.length > 0) 
	{
		var optAllText = { cat: "Tots", spa: "Todos", eng: "All", fre: "Tous" }[lang] || "All";

		var featureLabelText = {cat: "Objecte", spa: "Objecto", eng: "Feature", fre: "Entité"}[lang] || "Feature";

		cdns.push(
			"<label for=\"featureSelect\" style=\"margin-right:0.5em;\">",
			featureLabelText,
			":</label>"
		);


		cdns.push(
			"<select id=\"featureSelect\" name=\"featureSelect\" class=\"lb_select user\" style=\"margin-bottom:0.5em;\">"
		);

		// Opció "Tots"
				cdns.push("<option value=\"-1\">" + optAllText + "</option>");

		for (var i = 0; i < capa.objectes.features.length; i++) {
			var feature = capa.objectes.features[i];

			// Evitem errors si no té id
			if (feature && feature.id !== undefined && feature.id !== null) {
				// Si coincideix amb idfeature, afegim selected
				var selectedAttr = (idfeature && feature.id === idfeature) ? ' selected' : '';
				cdns.push(
					"<option value=\"" + feature.id + "\"" + selectedAttr + ">" +
					feature.id +
					"</option>"
				);
			}
		}

			cdns.push("</select><br>");
	}

	// Núm. de features
	var numFeatures = (capa && capa.objectes && capa.objectes.features)	? capa.objectes.features.length : 0;

	// Botó 1: Afegir un registre
	cdns.push(DonaBotoAfegirLogBook(
		targets,
		lang,
		access_token_type,
		"LBAfegirLogPageCapaMultipleTargets",
		numFeatures,
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
			numFeatures,
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
		cdns.push(LBDonaCadenaLang({"cat":"Registres previs de", "spa":"Registros previos", "eng":"Previous logs of", "fre":"Précédent enregistrements de"}, lang));
	else
		cdns.push(LBDonaCadenaLang({"cat":"Registres previs", "spa":"Registros previos", "eng":"Previous logs", "fre":"Précédent enregistrements"}, lang));
	cdns.push(" ", rsc_type, "</legend>");
	
	cdns.push("<div id=\"",div_id,"Previ\" style=\"width:98%\">", "</div></fieldset>");
	cdns.push("</div>");

	//----------
	cdns.push("<div id=\"altresLP\" class=\"lb_report user\" style=\"display:none\"><fieldset class=\"lb_fieldset user\"><legend class=\"lb_legend user\">");
	if (idfeature!=null)
		cdns.push(LBDonaCadenaLang({"cat":"Altres registres genèrics d'aquest llibre de registros", "spa":"Otros registros genèricos de este libro de registros", "eng":"Other generic logs of this logbook", "fre":"Autres enregistrements génériques de ce Livre des records"}, lang));
	cdns.push("</legend>");
	cdns.push("<div id=\"", div_id, "Altres\" style=\"width:98%\">", "</div></fieldset></div>");
	cdns.push("</div>");
	//-------------

	cdns.push("</div></form>");
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

	if (idfeature)
		url+="&ID_FEATURE=" + idFeature;

    url+="&ACCESS_TOKEN_TYPE=" + access_token_type + "&PAGE=ADDLOGPAGE&SHARE_BORROWER_1=Anonymous"; 

	return url;
}

function LBCreaBotoEdit(extra_param)
{
    return (
        "<div class=\"lb_edit user\">" +
            "<input type=\"button\" class=\"lb_button user\" value=\"" +
            LBDonaCadenaLang(
                {"cat":"Edita","spa":"Edita","eng":"Edit","fre":"Éditer"},
                extra_param.lang
            ) +
            "\" onClick='LBOpenNimmbus(\"" +
            extra_param.lang + "\",\"" +
            extra_param.access_token_type + "\");' /> " +
            LBDonaCadenaLang(
                {
                    "cat":"les teves entrades",
                    "spa":"tus entradas",
                    "eng":"your entries",
                    "fre":"vos entrées"
                },
                extra_param.lang
            ) +
        "</div>"
    );
}

function LBCarregaLogPageAnteriorsCallback(doc, extra_param)
{
	if (!doc || !doc.documentElement)
	{
        alert(extra_param.url + ": " +
            LBDonaCadenaLang({
                "cat":"El retorn no és xml",
                "spa":"El retorno no es xml",
                "eng":"Return is not xml",
                "fre":"Le retour n'est pas xml"
            }, extra_param.lang)
        );
        return;
	}

    var root = doc.documentElement;
	if (LBAnalitzaExceptionReport(root, extra_param.url))
		return;
		
    var owc = ParseOWSContextAtom(root);
    if (!owc || owc.properties.totalResults == 0 || !owc.features)
	{
        document.getElementById(extra_param.div_id + "Previ").innerHTML =
            LBMissatgeSenseElementsRetornats(extra_param);
		return;
	}


    /* Botó Edita */
	if (typeof extra_param.edit_button === "undefined" || extra_param.edit_button !== false)
		{
		var htmlEdit = LBCreaBotoEdit(extra_param);
 		  
		var previDiv = document.getElementById(extra_param.div_id + "Previ");
		if (previDiv)
			previDiv.insertAdjacentHTML("afterbegin", htmlEdit);
								
		var altresDiv = document.getElementById(extra_param.div_id + "Altres");
		if (altresDiv)
			altresDiv.insertAdjacentHTML("afterbegin", htmlEdit);
	}

    /* Creem els fieldsets (sense decidir Previ/Altres) */
    for (var i = 0; i < owc.features.length; i++)
			{
        var feature = owc.features[i];
        var type = GetNimmbusTypeOfAOWCFeature(feature);
        if (type !== "LOGPAGE")
            continue;

        var href = feature.properties.links.alternates[0].href;
        var n = href.indexOf("&RESOURCE=");
        var tmp = href.substring(n + 10);
        var n2 = tmp.indexOf("&");
        var resourceId = tmp.substring(0, n2);

        /* Placeholder temporal */
        var fieldset = document.createElement("fieldset");
        fieldset.className = "lb_fieldset user";
        fieldset.id = extra_param.div_id + "_fs_" + i;

        fieldset.innerHTML =
            "<legend class=\"lb_legend user\">" +
                "<a class=\"lb_link user\" href=\"" + ServerGUF +
                "?SERVICE=WPS&REQUEST=EXECUTE&IDENTIFIER=NB_RESOURCE:RETRIEVE" +
                "&LANGUAGE=" + extra_param.lang +
                "&RESOURCE=" + resourceId +
                "\" target=\"_blank\">" +
                feature.properties.authors[0].name + ", " +
                DonaDataISOComAText(feature.properties.updated) +
                "</a>" +
            "</legend>" +
            "<div id=\"" + extra_param.div_id + "_" + i + "\"></div>";

        /* Inicialment els pengem tots a Altres */
        document.getElementById(extra_param.div_id + "Altres").appendChild(fieldset);
	}
    /* Carreguem el contingut de cada LOGPAGE */
    for (var i = 0; i < owc.features.length; i++)
	{
        var feature = owc.features[i];
        var type = GetNimmbusTypeOfAOWCFeature(feature);

        if (type === "LOGPAGE" &&
            feature.properties &&
            feature.properties.links &&
            feature.properties.links.alternates &&
            feature.properties.links.alternates.length &&
			feature.properties.links.alternates[0].href)
        {
            loadFile(
                feature.properties.links.alternates[0].href,
                "text/xml",
                LBCarregaLogPageAnteriorCallback,
                function(xhr, extra_param)
                {
                    alert(extra_param.url + ": " + xhr);
                },
                {
                    url: feature.properties.links.alternates[0].href,
                    div_id: extra_param.div_id + "_" + i,
                    fieldset_id: extra_param.div_id + "_fs_" + i,
                    id_feature: extra_param.id_feature,
                    div_previ: extra_param.div_id + "Previ",
                    div_altres:  extra_param.div_id + "Altres",
                    lang: extra_param.lang
	}
            );
}
    }
}

function LBMissatgeSenseElementsRetornats(elements)
{
	let missatge = [];
	let lang = elements.lang

	missatge.push(GUFDonaCadenaLang({"cat":"No hi ha pàgines prèvies", 
		"spa":"No hay página previas", 
		"eng":"There is no previous log pages", 
		"fre":"Il n'y a pas encore pages précédentes"}, lang));


	if (typeof elements.rsc_type !== "undefined" && elements.rsc_type != "")
		missatge.push(GUFDonaCadenaLang({"cat":" sobre la", 
					"spa":" sobre la", 
					"eng":" on the", 
					"fre":" sur la"}, lang), 
					" ", elements.rsc_type);

	missatge.push(GUFDonaCadenaLang({"cat":" encara", 
				"spa":" todavía", 
				"eng":" yet", 
				"fre":" encore"}, lang));

	return missatge.join("");
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

function CridaACallBackFunctionAmbEstructuraLB( lang, resource_id, callback_function, params_function, extra_param)
{
    var url = ServerGUF +
        "?SERVICE=WPS&REQUEST=EXECUTE" +
        "&IDENTIFIER=NB_RESOURCE:RETRIEVE" +
        "&LANGUAGE=" + lang +
        "&RESOURCE=" + resource_id;

    if (!extra_param)
        extra_param = {};

    extra_param.url = url;
    extra_param.lang = lang;
    extra_param.callback_function = callback_function;
    extra_param.params_function = params_function;

    loadFile(
        url,
        "text/xml",
        LBCarregaLogPageAnteriorCallback,
        function(xhr, extra_param)
        {
            alert(extra_param.url + ": " + xhr);
        },
        extra_param
    );
}

function LBCarregaLogPageAnteriorCallback(doc, extra_param) 
{
    if (!doc || !doc.documentElement)
        return;

    var root = doc.documentElement;

    if (LBAnalitzaExceptionReport(root, extra_param.url))
        return;

    var log = GetRetrieveResourceLogBookOutputs(root);
    if (!log)
        return;

    /* ===============================
       DECISIÓ PREVI / ALTRES (CLAU)
       =============================== */

    var idFeatureLog = (log && log.idFeature) ? log.idFeature : null;
	var targetDiv;

	/* CAS 1: no hi ha filtre → tot a Previ */
	if (extra_param.id_feature == null)
	{
		targetDiv = extra_param.div_previ;
    }
	/* CAS 2: hi ha filtre → només coincidències a Previ */
	else if (idFeatureLog && idFeatureLog === extra_param.id_feature)
	{
		targetDiv = extra_param.div_previ;
	}
	else
	{
		targetDiv = extra_param.div_altres;
	}

	//només mostrem secció logs genèrics si n'hi ha algun
	if (targetDiv === extra_param.div_altres)
	{
		var altresLP = document.getElementById("altresLP");
		if (altresLP)
			altresLP.style.display = "block";
	}


    var fieldset = document.getElementById(extra_param.fieldset_id);
    var container = document.getElementById(targetDiv);

    if (fieldset && container && fieldset.parentNode !== container)
        container.appendChild(fieldset);

    /* ===============================
       DIBUIXAT DEL CONTINGUT
       =============================== */

    var div = document.getElementById(extra_param.div_id);
    if (!div)
        return;

    var comment = log.comment || "";
    var isLong = comment.length > 100;
    var truncated = isLong ? comment.substring(0, 100) + "[...]" : comment;

    var cdns = [];

    cdns.push("<b>", log.title || "", "</b><br><br>");
    cdns.push("<span id=\"lpDesc_", extra_param.div_id, "\">", truncated, "</span><br>");
    cdns.push(
        "<span id=\"extraInfo_", extra_param.div_id,
        "\" style=\"display:none; margin-top:0.5em;\">"
    );

    cdns.push(
        "<div><strong>Content Date:</strong> ",
        (log.contentDateIni || "-"), " / ", (log.contentDateFin || "-"),
        "</div>"
    );

    if (log.link)
        cdns.push("<div><strong>Link:</strong> ", log.link, "</div>");

    if (log.dimName)
        cdns.push("<div><strong>Dimension Name:</strong> ", log.dimName, "</div>");

    if (log.dimValue)
        cdns.push("<div><strong>Dimension Value:</strong> ", log.dimValue, "</div>");

    if (log.idFeature)
        cdns.push("<div><strong>Feature ID:</strong> ", log.idFeature, "</div>");

    cdns.push("</span><br>");
    cdns.push("<a href=\"#\" id=\"toggleInfo_", extra_param.div_id, "\">+ info</a>");

    div.innerHTML = cdns.join("");

    /* ===============================
       TOGGLE INFO
       =============================== */

    document
        .getElementById("toggleInfo_" + extra_param.div_id)
        .addEventListener("click", function (e) {
            e.preventDefault();

            var extra = document.getElementById("extraInfo_" + extra_param.div_id);
            var desc  = document.getElementById("lpDesc_" + extra_param.div_id);

            if (extra.style.display === "block") {
            extra.style.display = "none";
                desc.innerHTML = isLong ? truncated : comment;
                this.innerHTML = "+ info";
            } else {
            extra.style.display = "block";
                desc.innerHTML = comment;
                this.innerHTML = "- info";
        }
    });
}




