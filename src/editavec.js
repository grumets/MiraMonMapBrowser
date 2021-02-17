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
    amb l'ajut de Núria Julià (n julia at creaf uab cat)
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

var ajaxTransaccio=[];
var Transaccio=[];
var i_transaccio=0;



var tipus_insert=0x0001;
var tipus_update=0x0002;
var tipus_delete=0x0004;


function ErrorAvaluaRespostaTransaccio(doc, param)
{
var text=[], trans=Transaccio[param.i_transaccio], capa=ParamCtrl.capa[trans.i_capa];
;
	// Informo a l'usuari que s'ha produït un error
	text.push(DonaCadenaLang({"cat": "La transacció d'inserció a la capa \"", "eng":"The insert transaction of the object into the layer \""}), 
				   capa.nom, DonaCadenaLang({"cat":"\" ha fallat.", "eng":"\" has failed."}));
	if(param.text && param.text.length)
		text.push("<br>More Information about the error: ", param.text);
	MostraMissatgeTransaccio(text.join(""));	
	CanviaEstatEventConsola(null, trans.i_event, EstarEventError);
}

function AvaluaRespostaTransaccio(doc, param)
{
var trans=Transaccio[param.i_transaccio], capa=ParamCtrl.capa[trans.i_capa], objectes=null;

	var url_object=ajaxTransaccio[param.i_transaccio].getResponseHeader("Location");
	if(url_object)
	{
		var id=url_object.substring(url_object.lastIndexOf("/")+1);
		//trans.feature.id=id.substring(capa.nom.length+1);
		if (!capa.objectes)
			capa.objectes=[];
		if(!capa.objectes.features)
			capa.objectes.features=[];
		var features=[];
		features.push(trans.feature);
		capa.objectes.features.push.apply(capa.objectes.features, features);

	}
	else
	{	
		var d=0.5;
		if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
			d/=FactorGrausAMetres;
		var punt={x: trans.feature.geometry.coordinates[0], y: trans.feature.geometry.coordinates[1]};
		if(capa.CRSgeometry.toUpperCase()!=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase())
			punt=TransformaCoordenadesPunt(punt, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRS);
		FesPeticioAjaxObjectesDigitalitzatsPerEnvolupant(trans.i_capa, DonaEnvDeXYAmpleAlt(punt.x, punt.y, d, d), false);
	}
	/*if(!doc) return;	
	try {
		feature=JSON.parse(doc);
		feature.id=feature.id.substring(capa.nom.length+1);
	} 
	catch (e) {
		CanviaEstatEventConsola(null, trans.i_event, EstarEventError);
		return;
	}*/
	
	// Dibuixo l'objecte i aviso a l'usuari que s?ha afegit un nou objecte
	CreaVistes();
	var missatge=[];
	if(trans.feature.id)
	{
	    missatge.push("<br>",DonaCadenaLang({"cat": "La transacció d'inserció de l'objecte \"", "eng": "The insert transaction of the object \""}), 
		    trans.feature.id, 
		    DonaCadenaLang({"cat":"\" a la capa \"", "eng":"\" into the layer \"" }), capa.nom, DonaCadenaLang({"cat":"\" ha finalitzat amb èxit.", "eng":"\" has successfully completed."}));
	}
	else
	{
		missatge.push("<br>",DonaCadenaLang({"cat": "La transacció d'inserció a la capa \"", "eng": "The insert transaction into the layer \""}), 
					 capa.nom, DonaCadenaLang({"cat":"\" ha finalitzat amb èxit.", "eng":"\" has successfully completed."}));
	}
	MostraMissatgeTransaccio(missatge.join(""));
	CanviaEstatEventConsola(null, trans.i_event, EstarEventTotBe);
	return;
}//Fi de AvaluaRespostaTransaccio()

function AmagaLayerMissatgeTransaccio()
{
	TancaFinestraLayer("misTransaccio");
}

//$$ Innacabat: Aquest sistema de missatgeria és particular de l'edició però requereix una window nova. Considerar si aquest podria ser el sistema de missatgeria general del navegador (tal com ho fa el GeMM). També cal connectar la transacció amb a línia de comanda de la consula i reportar-lo com un error.
function MostraMissatgeTransaccio(missatge)
{
var elem=ObreFinestra(window, "misTransaccio", DonaCadenaLang({"cat":"per informar del resultat de la transacció",
						  "spa":"para informar del resultado de la transacción",
						  "eng":"to report the result of the transaction",
						  "fre":"pour rapporter le résultat de la transaction"}));
	if (!elem)
		return;
	//classLayer(elem, "mistrans");
	contentLayer(elem, missatge);
	//setTimeout("AmagaLayerMissatgeTransaccio();",5000); 
}



/*function ValidaFormIEnviaTransaccioInsertar(form)
{
var capa=ParamCtrl.capa[form.i_capa.value], objecte, num, plantilla=[], url, i_event;


	objecte={
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ PuntConsultat.x, PuntConsultat.y]
      },
      "properties": {
        "feature_id": create_UUID(false),
		"date_min": form.datemin_any.options[form.datemin_any.selectedIndex].value,
		"date_max": form.datemax_any.options[form.datemax_any.selectedIndex].value
	  }
	};
	if(form.haccmin.value)
	{
		num=parseFloat(form.haccmin.value);
		if(isNaN(num))
		{
			alert("Wrong value for \"haccmin\" input, must be a numerical o decimal value.");
			return;
		}
		objecte.properties.haccmin=num;
	}
	if(form.haccmax.value)
	{
		num=parseFloat(form.haccmax.value);
		if(isNaN(num))
		{
			alert("Wrong value for \"haccmax\" input, must be a numerical o decimal value.");
			return;
		}
		objecte.properties.haccmax=num;
	}
	if(form.map_sel.value)
	{
		num=parseInt(form.map_sel.value);
		if(isNaN(num))
		{
			alert("Wrong value for \"haccmax\" input, must be a integer value.");
			return;
		}
		objecte.properties.map_sel=num;
	}
	if(form.map_sel_en.value && form.map_sel_en.value!="")
		objecte.properties.map_sel_en=form.map_sel_en.value;
	if(form.map_sel_fr.value && form.map_sel_fr.value!="")
		objecte.properties.map_sel_fr=form.map_sel_fr.value;
				
	plantilla.push("/collections/",capa.nom, "/items");
	url=AfegeixNomServidorARequest(DonaServidorCapa(capa), plantilla.join(""), ParamCtrl.UsaSempreMeuServidor==true ? true : false, DonaCorsServidorCapa(capa));	
	i_event=CreaIOmpleEventConsola("OAPI_Features_Transactions (POST)", param.i_capa, url, TipusEventFeatureInsertTransaction);	
	
	Transaccio[i_transaccio]={i_capa: form.i_capa.value, i_event : i_event, tipus: tipus_insert};
	ajaxTransaccio[i_transaccio]=new Ajax();
	ajaxTransaccio[i_transaccio].setHandlerErr(ErrorAvaluaRespostaTransaccio);
	if (window.doAutenticatedHTTPRequest && capa.access)
		doAutenticatedHTTPRequest(capa.access, "POST", ajaxTransaccio[i_transaccio], url, 'application/json', JSON.stringify(objecte), AvaluaRespostaTransaccio, 'application/json', {i_transaccio: i_transaccio});
	else		
		ajaxTransaccio[i_transaccio].doPost(url, 'application/geo+json', JSON.stringify(objecte), AvaluaRespostaTransaccio, 'application/json', {i_transaccio: i_transaccio});
	i_transaccio++;
	TancaFinestraLayer('editarVector');
}*/

function ValidaFormIEnviaTransaccioInsertar(form)
{
var i_capa=parseInt(form.i_capa.value), capa=ParamCtrl.capa[i_capa], objecte, num, plantilla=[], url, i_event;

	objecte={
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ PuntConsultat.x, PuntConsultat.y]
      },
      "properties": {
        "fid": parseInt(form.id.value), //create_UUID(false),
		"id": parseInt(form.id.value),
		"type": form.type.options[form.type.selectedIndex].value,
		"name1": form.name1.value
	  }
	};
				
	plantilla.push("/collections/",capa.nom, "/items");
	url=AfegeixNomServidorARequest(DonaServidorCapa(capa), plantilla.join(""), ParamCtrl.UsaSempreMeuServidor==true ? true : false, DonaCorsServidorCapa(capa));	
	i_event=CreaIOmpleEventConsola("OAPI_Features_Transactions (POST)", i_capa, url, TipusEventFeatureInsertTransaction);	
	
	Transaccio[i_transaccio]={i_capa: i_capa, i_event : i_event, tipus: tipus_insert, feature: objecte};
	ajaxTransaccio[i_transaccio]=new Ajax();
	ajaxTransaccio[i_transaccio].setHandlerErr(ErrorAvaluaRespostaTransaccio);
	if (window.doAutenticatedHTTPRequest && capa.access)
		doAutenticatedHTTPRequest(capa.access, "POST", ajaxTransaccio[i_transaccio], url, 'application/geo+json', JSON.stringify(objecte), AvaluaRespostaTransaccio, 'application/json', {i_transaccio: i_transaccio});
	else
		ajaxTransaccio[i_transaccio].doPost(url, 'application/geo+json', JSON.stringify(objecte), AvaluaRespostaTransaccio, 'application/json', {i_transaccio: i_transaccio});
	i_transaccio++;
	TancaFinestraLayer('editarVector');
}


function SelectorData(nom_form, any_inici, any_fi, flags_data)
{	
var any=new Date(), cdns=[], i;
	
	if(flags_data.DataMostraDia)
	{
		var diaactual=any.getDate();
		//selector de dia
		cdns.push("<select name=\"",nom_form,"_dia\" class=\"Verdana11px\">");	
		for(i=1; i<=31; i++)
		{
			if(i==diaactual)
				cdns.push("<option selected value=\"",(i<10 ? "0" : ""),i,"\">",(i<10 ? "0" : ""),i);	
			else
				cdns.push("<option value=\"",(i<10 ? "0" : ""),i,"\">",(i<10 ? "0" : ""),i);	
		}
		cdns.push("</select>");
	}
	if(flags_data.DataMostraMes)
	{
		var mesactual=1+any.getMonth();
		//selector de mes
		cdns.push("<select name=\"",nom_form,"_mes\" class=\"Verdana11px\">",
				  "<option", (mesactual==1 ? " selected" : "")," value=\"01\">",  DonaCadena(MesDeLAny[0]),
				  "<option", (mesactual==2 ? " selected" : "")," value=\"02\">",  DonaCadena(MesDeLAny[1]),
				  "<option", (mesactual==3 ? " selected" : "")," value=\"03\">",  DonaCadena(MesDeLAny[2]),
				  "<option", (mesactual==4 ? " selected" : "")," value=\"04\">",  DonaCadena(MesDeLAny[3]),
				  "<option", (mesactual==5 ? " selected" : "")," value=\"05\">",  DonaCadena(MesDeLAny[4]),
				  "<option", (mesactual==6 ? " selected" : "")," value=\"06\">",  DonaCadena(MesDeLAny[5]),
				  "<option", (mesactual==7 ? " selected" : "")," value=\"07\">",  DonaCadena(MesDeLAny[6]),
				  "<option", (mesactual==8 ? " selected" : "")," value=\"08\">",  DonaCadena(MesDeLAny[7]),
				  "<option", (mesactual==9 ? " selected" : "")," value=\"09\">",  DonaCadena(MesDeLAny[8]),
				  "<option", (mesactual==10 ? " selected" : "")," value=\"10\">", DonaCadena(MesDeLAny[9]),
				  "<option", (mesactual==11 ? " selected" : "")," value=\"11\">", DonaCadena(MesDeLAny[10]),
				  "<option", (mesactual==12 ? " selected" : "")," value=\"12\">", DonaCadena(MesDeLAny[11]),
				  "</select>");

	}
	if(flags_data.DataMostraAny)
	{		
		var anyactual=takeYear(any), inici, fi;	
		//selector d'any
		if (any_inici==null)
			inici=2000;
		else
			inici=any_inici;
		if(any_fi==null)
			fi=anyactual;
		else
			fi=any_fi;
		cdns.push("<select name=\"",nom_form,"_any\" class=\"Verdana11px\">");
		for(i=inici; i<=fi; i++)
		{
			if(i==anyactual)
				cdns.push("	<option selected value=\""+i+"\"> "+i);
			else
				cdns.push("	<option value=\""+i+"\"> "+i);
		}
		cdns.push("</select>");
	}
	return cdns.join("");
}

function DonaCadenaFormulariEditarPunts(elem)
{
var cdns=[], i_capa;

	for(i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		if(ParamCtrl.capa[i_capa].editable=="si")
			break;
	}
	if(i_capa==ParamCtrl.capa.length)
	{
		alert("No hi ha cap capa editable"); // de moment no faig gran cosa més perquè en un futur proper la funció d'edició ha de ser de cada capa i no s'arribarà aquí si la capa no és editable
		return;
	}
	
	cdns.push("<form name=\"editarCapaOPIFeatures\">",
			  "<div align=\"center\" id=\"LayerTextEdicio\" class=\"layerpunteditar\">",
			  "<span class=\"Verdana11px\">",
			  DonaCadenaLang({"cat": "Un clic sobre la vista determina la coordenada del nou punt. Ompliu en aquesta fitxa les propietats del objecte que conegueu i premeu [D'acord] per enviar el punt al servidor.",
							  "spa": "Un clic sobre la vista determina la coordenada del punto nuevo. Rellena en esta ficha los datos del objeto que conozcas y pulsa [Aceptar] para enviar el punto al servidor.", 
							  "eng": "A click on the view determines the coordinate of the new point. In this tab filling the properties of the feature that you known and press [OK] to send the point to the server.",
							  "fre": "Un clic sur la vue détermine la coordonnée du nouveau point. Dans cet onglet remplissez les propriétés de la fonctionnalité que vous connaissez et appuyez sur [Accepter] pour envoyer le point au serveur."}),
			  "</span><br><br>",
			  "<center><input type=\"button\" class=\"Verdana11px\" value=\"",				
		      DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}), 
			  "\" onClick=\"ValidaFormIEnviaTransaccioInsertar(form);\"> <input type=\"button\" class=\"Verdana11px\" value=\"",
		      DonaCadenaLang({"cat":"Cancel·lar", "spa":"Cancelar", "eng":"Cancel", "fre":"Annuler"}), 
			  "\" onClick=\"TancaFinestraLayer('editarVector');\"></center></div>",
			  "<div align=\"left\" id=\"LayerPuntConsulta\" class=\"layereditar\"><br>",
			  DonaCadenaLang({"cat":"Coordenades", "spa":"Coordenadas", "eng":"Coordinates", "fre":"Coordonnées"}),"<br>",
			  DonaValorDeCoordActual(PuntConsultat.x,PuntConsultat.y,false, true),
			  "</div><div align=\"left\" class=\"layereditar\"><br>");
/*	cdns.push(DonaCadenaLang({"cat":"Data mínima", "spa":"Fecha mínima", "eng":"Minimum date", "fre":"Date minimale"}),
 			  ": ", SelectorData("datemin", null, null, {"DataMostraAny": true, "DataMostraMes": false, "DataMostraDia": false}),"<br>",							  
  			  DonaCadenaLang({"cat":"Data màxima", "spa":"Fecha máxima", "eng":"Maximum date", "fre": "Date maximale"}),			  
   			  ": ", SelectorData("datemax", null, null, {"DataMostraAny": true, "DataMostraMes": false, "DataMostraDia": false}),"<br>",				
			  "haccmin: <input type=\"text\" name=\"haccmin\" class=\"input_text\"><br>",
			  "haccmax: <input type=\"text\" name=\"haccmax\" class=\"input_text\"><br>",
  			  "map_sel: <input type=\"text\" name=\"map_sel\" class=\"input_text\"><br>",
 			  "map_sel_en: <input type=\"text\" name=\"map_sel_en\" class=\"input_text\"><br>",
   			  "map_sel_fr: <input type=\"text\" name=\"map_sel_fr\" class=\"input_text\"><br>");		*/
	cdns.push("Identifier: <input type=\"text\" name=\"id\" class=\"input_text\"><br>",
  			  "Type: <select name=\"type\" class=\"Verdana11px\">",
			  "<option value=\"Sites\">Sites", 
			  "<option value=\"Greenspace\">Greenspace",
			  "<option value=\"Suburban Area\">Suburban Area",
			  "<option value=\"Water\">Water", 
			  "<option value=\"City\">City", 
			  "</select><br>",
  			  "Place name: <input type=\"text\" name=\"name1\" class=\"input_text\"><br>");
	
	cdns.push("<input type=\"hidden\" value=\"", i_capa,"\" name=\"i_capa\" id=\"i_capa\">",
			  "</div></form>");			
	return cdns.join(""); 
}

//$$ Aquesta operació NO ha estat probada mai i segurament cal repassar-la
function FesTransaccioEliminarPunt(i_capa, i_feature)
{
var	capa=ParamCtrl.capa[i_capa], feature=capa.objectes.features[i_feature], plantilla=[];

	plantilla.push("/collections/",capa.nom, "/items/", feature.id);
	var url=AfegeixNomServidorARequest(DonaServidorCapa(capa), plantilla.join(""), ParamCtrl.UsaSempreMeuServidor==true ? true : false, DonaCorsServidorCapa(capa));	
	var i_event=CreaIOmpleEventConsola("OAPI_Features_Transactions (POST)", i_capa, url, TipusEventFeatureInsertTransaction);	
	
	Transaccio[i_transaccio]={i_capa: i_capa, i_event : i_event, tipus: tipus_delete, feature: objecte};
	ajaxTransaccio[i_transaccio]=new Ajax();
	ajaxTransaccio[i_transaccio].setHandlerErr(ErrorAvaluaRespostaTransaccioDelete);
	//if (window.doAutenticatedHTTPRequest && capa.access)
	//	doAutenticatedHTTPRequest(capa.access, "POST", url, 'application/geo+json', JSON.stringify(objecte), AvaluaRespostaTransaccio, 'application/json', {i_transaccio: i_transaccio});
	//else
	ajaxTransaccio[i_transaccio].doDelete(url, AvaluaRespostaTransaccioDelete, 'application/json',  {i_transaccio: i_transaccio});
	i_transaccio++;
	TancaFinestraLayer('editarVector');
}

/*

// Tot aquest codi sembla no usar-se mai i per això el deixo comentat aquí 2018-01-04 (JM)
var estat_pendent=0x0001;
var estat_fi_exit=0x0002;
var estat_fi_error=0x0004;

var tipus_insert=0x0001;

function CreaTransaccio(i_capa, tipus, estat, win)
{
	this.i_capa=i_capa;
	this.tipus=tipus;
	this.estat=estat;
	this.text="";
	this.win=win;
}

var i_transaccio=0;
var transaccio=[];

function AvaluaRespostaTransaccio(doc)
{
var root;
var elem;
var trans_actual;

	if(!doc) return;	
	root=doc.documentElement;
	
	if(!root) return;
	
	elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "totalInserted");
	if(elem==null) return;

	if(parseInt(elem[0].childNodes[0].nodeValue,10)==1)
	{
		//Llegeix-ho la info, agafo l'identificador i faig un GetFeature d'aquest nou element
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "Feature");
		var i_trans=parseInt(elem[0].getAttribute('handle'),10);
		trans_actual=transaccio[i_trans];
		trans_actual.estat=estat_fi_exit;
		
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/ogc", "ogc", "FeatureId");
		var identificador=[];
		identificador.push(elem[0].getAttribute('fid'));		
		
		//Faig la petició GetFeature
		FesPeticioAjaxObjectesDigitalitzatsPerIdentificador(trans_actual.i_capa, identificador, false);		
		var mis=getLayer(trans_actual.win, "missatges");
		if(mis)
		{
			classLayer(mis, "mistrans");
			contentLayer(mis, "La transacció d'inserció \""+i_trans+ "\" de l'element \""+
						 	   identificador+"\" de la capa \""+ParamCtrl.capa[trans_actual.i_capa].nom+
							   "\" ha finalitzat amb èxit.") ;			
			showLayer(mis);
			setTimeout("AmagaLayerMissatges();",5000); 	
		}
		return;
	}
	else
	{
		
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "Action");
		var i_trans=parseInt(elem[0].getAttribute('locator'),10);
		trans_actual=transaccio[i_trans];
		trans_actual.estat=estat_fi_error;
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "Message");
		var mis=getLayer(trans_actual.win, "missatges");
		if(mis)
		{
			classLayer(mis, "mistrans");
			contentLayer(mis, "La transacció d'inserció \""+i_trans+ "\" d'un element de la capa \""+ParamCtrl.capa[trans_actual.i_capa].nom+
							   "\" NO ha estat finalitzat amb èxit."+((elem && elem[0].childNodes[0].nodeValue) ? ("\n"+elem[0].childNodes[0].nodeValue) : ""));			
			showLayer(mis);
			setTimeout("AmagaLayerMissatges();",5000); 	
		}
		return;
	}					 	
}//Fi de AvaluaRespostaTransaccio()
*/