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

    Copyright 2001, 2019 Xavier Pons

    Aquest codi JavaScript ha estat realitzat per Joan Masó Pau 
    (joan maso at uab cat) i Nuria Julià (n julia at creaf uab cat)
    dins del grup de MiraMon. MiraMon és un projecte del Centre
    de recerca i aplicacions forestals (CREAF) que elabora programari de 
    Sistema d'Informació Geogràfica i de Teledetecció per a la 
    visualització, consulta, edició i anàlisi de mapes ràsters i 
    vectorials. Elabora programari d'escriptori i també servidors i clients 
    per Internet. No tots aquests productes són gratuïts o de codi obert. 
    En particular, el Navegador de Mapes del MiraMon (client per Internet) 
    es distribueix sota els termes de la llicència "GNU General Public 
    License". Es pot actualitzar des de www.creaf.uab.cat/miramon/mmn
*/

"use strict"

var QualityML=null;
var ArrelURLQualityML="http://www.qualityml.org/";


// Funciona tant per capa com per capa_digi
function AfegeixQualitatACapa(capa, quality)
{
	if (!capa.metadades)
		capa.metadades={};
	if (!capa.metadades.quality)
		capa.metadades.quality=[];
	return capa.metadades.quality[capa.metadades.quality.length]=quality;
}

function FinestraMostraQualitatCapa(elem, capa, i_estil)
{
	if (!QualityML)
	{
		loadJSON("http://www.qualityml.org/qualityml.json",
				// "qualityml.json",
			function(quality_ml, extra_param) { 
				QualityML=quality_ml;
				MostraQualitatCapa(extra_param.elem, extra_param.capa, extra_param.i_estil);
			},
			function(xhr) { alert(xhr); },
			{elem:elem, capa:capa, i_estil: i_estil});
	}
	else
		MostraQualitatCapa(elem, capa, i_estil);
}

function DonaIndexIndicatorQualityML(id)
{
	for (var i=0; i<QualityML.indicator.length; i++)
	{
		if (QualityML.indicator[i].id==id)
			return i;
	}
	return -1;
}

function MostraQualitatCapa(elem, capa, i_estil)
{
	contentLayer(elem, DonaCadenaMostraQualitatCapa(capa, i_estil));
}

function DesplegaOPlegaIFramaQualityML(nom)
{
	if (document.getElementById(nom+"iframe").style.display=="none")
	{
		document.getElementById(nom+"iframe").style.display="inline";
		document.getElementById(nom+"img").src=AfegeixAdrecaBaseSRC("boto_contract.png");
	}
	else
	{
		document.getElementById(nom+"iframe").style.display="none";
		document.getElementById(nom+"img").src=AfegeixAdrecaBaseSRC("boto_expand.png");
	}
}

function DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, concept, i, id_qml)
{
var cdns=[], nom="MostraQualitatCapa_"+i_q+"_"+i_r+"_"+concept+"_"+i+"_";
	cdns.push(" <img src=\"", 
		 AfegeixAdrecaBaseSRC("boto_expand.png"), "\" id=\"",nom,"img\" ",
		 "alt=\"", DonaCadenaLang({"cat":"més info", "spa":"más info", "eng":"more info","fre":"plus d'info"}) , "\" ",
		 "title=\"",DonaCadenaLang({"cat":"més info", "spa":"más info", "eng":"more info","fre":"plus d'info"}), "\" ",
		 "onClick='DesplegaOPlegaIFramaQualityML(\"",nom,"\")'\"><iframe src=\"",ArrelURLQualityML, version, "/", concept,"/", id_qml, "\" id=\"",nom,"iframe\" style=\"display: none\" width=\"98%\" height=\"180\" scrolling=\"auto\"></iframe>");
	return cdns.join("");
}

function DonaCadenaValorsComLlistaQualitatCapa(values)
{
var cdns=[];
	if (values)
	{
		if (values.list && values.list.length)
		{
			cdns.push("&nbsp;&nbsp;<b>Value: </b>", values.list[0]);
			for (var i=1; i<values.list.length; i++)
				cdns.push(", ", values.list[i]);
		}
		if (values.units)
			cdns.push(" (", values.units, ")");
		cdns.push("<br/>");
	}
	return cdns.join("");
}

function DonaCadenaParamQualitatCapa(param)
{
var cdns=[];
	if (param)
	{
		for (var i=0; i<param.length; i++)
			cdns.push("&nbsp;&nbsp;<b>", param[i].name, ":</b> ", param[i].value, "<br/>");
	}
	return cdns.join("");
}

function DonaCadenaMostraQualitatCapa(capa, i_estil)
{
var quality;
var i_indicator, cdns=[];

	if (i_estil==-1)
		quality=capa.metadades.quality;
	else
		quality=capa.estil[i_estil].metadades.quality;
    cdns.push("<form name=\"QualitatCapa\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerQualitatCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;width:95%\">",
			DonaCadenaLang({"cat":"Qualitat de la capa", "spa":"Calidad de la capa", "eng":"Quality of the layer", "fre":"Qualité de la couche"}), " \"", 
			(DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom));
	if (i_estil!=-1)
		cdns.push(", ", DonaCadena(capa.estil[i_estil].desc));
	cdns.push("\"<br/>");
	
	for (var i_q=0; i_q<quality.length; i_q++)
	{
		i_indicator=DonaIndexIndicatorQualityML(quality[i_q].indicator);
		cdns.push("<fieldset><legend>", 
			((i_indicator==-1) ? quality[i_q].indicator: DonaCadena(QualityML.indicator[i_indicator].name)),
			":</legend>");
		if (i_indicator!=-1)
			cdns.push(DonaCadena(QualityML.indicator[i_indicator].desc), "<br/>");
		if (quality[i_q].scope && quality[i_q].scope.env && quality[i_q].scope.env.EnvCRS)
		{
			var env=quality[i_q].scope.env.EnvCRS, decimals;
			if (DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)=="m" && DonaUnitatsCoordenadesProj(quality[i_q].scope.env.CRS)=="°")
				decimals=ParamCtrl.NDecimalsCoordXY+4;
			else if (DonaUnitatsCoordenadesProj(quality[i_q].scope.env.CRS)=="m" && DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)=="°")
				decimals=ParamCtrl.NDecimalsCoordXY-4;
			else
				decimals=ParamCtrl.NDecimalsCoordXY;
			cdns.push("<b>Scope:</b> Dataset fragment of this area: x=[", OKStrOfNe(env.MinX, decimals), ",", OKStrOfNe(env.MaxX, decimals), "], y=[", OKStrOfNe(env.MinY, decimals), ",", OKStrOfNe(env.MaxY, decimals), "] ");
			if (quality[i_q].scope.env.CRS.toUpperCase()==ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase())
				cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",				
				  	DonaCadenaLang({"cat":"Anar-hi", "spa":"Ir", "eng":"Go to","fre":"Aller à"}), 
					"\" onClick='PortamAAmbit(",JSON.stringify(env),")' />");
			else
				cdns.push("(CRS: ", DonaDescripcioCRS(quality[i_q].scope.env.CRS), ")");
			cdns.push("<br/>");
		}
		if (quality[i_q].statement)
			cdns.push("<b>Statement:</b> ", DonaCadena(quality[i_q].statement), "<br/>");
		if (quality[i_q].result)
		{
			for (var i_r=0; i_r<quality[i_q].result.length; i_r++)
			{	
				if (quality[i_q].result.length>1)
					cdns.push("<fieldset>");
				if (quality[i_q].result[i_r].qualityml)
				{
					var qualityml=quality[i_q].result[i_r].qualityml;
					var version=(qualityml.version) ? qualityml.version : "1.0";
					if (qualityml.measure)
					{
						cdns.push("<b>Measure:</b> ", qualityml.measure.name, DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, "measure", 0, qualityml.measure.name), "<br/>",
									DonaCadenaParamQualitatCapa(qualityml.measure.param));
					}	
					if (qualityml.domain)
					{
						for (var i_d=0; i_d<qualityml.domain.length; i_d++)
						{
							cdns.push("<b>Domain:</b> ", qualityml.domain[i_d].name, DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, "domain", i_d, qualityml.domain[i_d].name), "<br/>", 
									DonaCadenaParamQualitatCapa(qualityml.domain[i_d].param), 
									DonaCadenaValorsComLlistaQualitatCapa(qualityml.domain[i_d].values));
						}
					}	
					if (qualityml.metrics)
					{
						for (var i_m=0; i_m<qualityml.metrics.length; i_m++)
						{
							cdns.push("<b>Metrics:</b> ", qualityml.metrics[i_m].name, DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, "metrics", i_m, qualityml.metrics[i_m].name), "<br/>", 
									DonaCadenaParamQualitatCapa(qualityml.metrics[i_m].param), 
									DonaCadenaValorsComLlistaQualitatCapa(qualityml.metrics[i_m].values));
						}
					}	
				}
				else if (quality[i_q].result[i_r].values)
					cdns.push(DonaCadenaValorsComLlistaQualitatCapa(quality[i_q].result[i_r].values));
				if (quality[i_q].result.length>1)
					cdns.push("</fieldset>");
			}
		}
		cdns.push("</fieldset>");
	}
	cdns.push("</div></form>");
	return cdns.join("");
}

function DonaCodeCapaEstilFeedback(capa, i_estil)
{
	return capa.nom + (i_estil==-1 ? "": "_" + (capa.estil[i_estil].desc ? capa.estil[i_estil].desc : DonaCadena(capa.estil[i_estil].desc)));
}

function FinestraFeedbackCapa(elem, capa, i_estil)
{
var cdns=[];

	cdns.push(DonaCadenaLang({"cat":"la capa", "spa":"la capa", "eng":"the layer", "fre":"la couche"}), 
				" \"", (DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom));
 	if (i_estil!=-1)
		cdns.push(", ", DonaCadena(capa.estil[i_estil].desc));
	cdns.push("\"");

	GUFShowFeedbackInHTMLDiv(elem,
			"LayerFeedbackCapa", 
			cdns.join(""), 
			DonaCadena(capa.desc) + (i_estil==-1 ? "": ", " + DonaCadena(capa.estil[i_estil].desc)), 
			DonaCodeCapaEstilFeedback(capa, i_estil), 
			DonaServidorCapa(capa), 
			ParamCtrl.idioma);
}

function CalculaValidessaTemporal(param)
{
var punt={}, capa_digi=ParamCtrl.capa[param.i_capa], n_valids=0, n=0, n_dins=0, data_obj, i_camp, camp;

	if (!capa_digi.objectes.features)
		return false;
		
	for (i_camp=0; i_camp<capa_digi.atributs.length; i_camp++)
	{
		if (capa_digi.atributs[i_camp].nom==param.atribut)
		{
			camp=capa_digi.atributs[i_camp];
			break;
		}
	}
	if (i_camp==capa_digi.atributs.length)
		return false;

	for (var i_obj=0; i_obj<capa_digi.objectes.features.length; i_obj++)
	{
		var feature=capa_digi.objectes.features[i_obj];
		DonaCoordenadaPuntCRSActual(punt, capa_digi.objectes.features[i_obj], capa_digi.CRSgeometry);
		if (!EsPuntDinsEnvolupant(punt, ParamInternCtrl.vista.EnvActual))
			continue;			
		n_dins++;		
		
		/* L'objecte ha de tenir data de mesura sino no ho puc avaluar
		if (typeof feature.properties["__om_time__"]==="undefined" ||
		    feature.properties.__om_time__=="" ||
			feature.properties.__om_time__==null)
			continue;*/
		if (typeof feature.properties[param.atribut]==="undefined" ||
			feature.properties[param.atribut]=="" ||
			feature.properties[param.atribut]==null)
			continue;

		n++;
		
		if (camp.format=="dd/mm/yyyy")
		{
			var dateParts = feature.properties[param.atribut].split("/");
			if (!dateParts || dateParts.length!=3)
				continue;
			data_obj=new Date(dateParts[2]+"-"+dateParts[1]+"-"+dateParts[0]);  //fet així pensa que el text és hora UTC que és el mateix que passa amb la lectura dels formularis
		}
		else
			data_obj=new Date(feature.properties[param.atribut]);
		if(data_obj>= param.data_ini && data_obj<=param.data_fi)
			n_valids++;
	}

	if (n==0)
	{
		alert(DonaCadenaLang({"cat": "No hi ha observacions amb valors vàlids per obtenir la vàlidessa temporal en aquesta àrea", 
					"spa": "No hay observaciones con valores válidos para obtener la validez temporal en esta área", 
					"eng": "There is no observations with valid values to obtain temporal validity in this area", 
					"fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la validité temporelle dans ce domaine"}));
		return false;
	}
	var quality={
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_TemporalValidity",
		statement: DonaCadenaLang({"cat": "La validessa temporal resumida està basada en la comparació de la data de cada observació individual indicada a l'atribut",
					"spa": "La validez temporal está basada en la comparación de la fecha de cada observación individual indicada por el atributo",
					"eng": "The temporal consistency is based on the comparison of the date of each individual observation as indicated in the field",
					"fre": "The temporal consistency is based on the comparison of the date of each individual observation as indicated in "}) + 
			" \'"+param.atribut+"\' "+
			DonaCadenaLang({"cat": "amb l'interval especificat.",
					"spa": "con el intervalo especificado.",
					"eng": "against the data interval specified.",
					"fre": "against the data interval specified."}) + 
			DonaCadenaLang({"cat": "Hi ha",
					"spa": "Hay",
					"eng": "There are",
					"fre": "Il y a"}) + 
			" " + (n_dins-n) + " "+
			DonaCadenaLang({"cat": "de",
					"spa": "de",
					"eng": "of",
					"fre": "de"}) + 
			" " +n_dins+ " " + 
			DonaCadenaLang({"cat": "que no tenen informació sobre la validessa.",
					"spa": "que no tienen información sobre la validez.",
					"eng": "that does not have validity information.",
					"fre": "qui n'ont pas d'informations de la validité."}),
		result: [{
			qualityml: {
				version: "1.0",
				measure: {
					name: "ValueDomain"
				},
				domain: [{
					name: "Conformance",
					param: [
					{
						name: "InitialDate",
						value: param.data_ini.toJSON()
					},
					{
						name: "FinalDate",
						value: param.data_fi.toJSON()
					}],
					values:{
						list:[param.atribut]
					}
				}],
				metrics: [{
					name: "items",
					param: [{
						name: "count",
						value: n
					}],
					values: {
						list: [n_valids]
					}
				}]
			}
		}]
	};
	AfegeixQualitatACapa(capa_digi, quality);
	return true;
}

function CalculaValidessaPosicionalBBOX(param)
{
var punt={}, capa_digi=ParamCtrl.capa[param.i_capa], n_valids=0, n_dins=0;

	if (!capa_digi.objectes.features)
		return false;
		
	for (var i_obj=0; i_obj<capa_digi.objectes.features.length; i_obj++)
	{
		var feature=capa_digi.objectes.features[i_obj];
		DonaCoordenadaPuntCRSActual(punt, capa_digi.objectes.features[i_obj], capa_digi.CRSgeometry);
		if (!EsPuntDinsEnvolupant(punt, ParamInternCtrl.vista.EnvActual))
			continue;			
		n_dins++;		
		if (EsPuntDinsEnvolupant(punt, param.env))
			n_valids++;		
	}

	if (n_dins==0)
	{
		alert(DonaCadenaLang({"cat": "No hi ha observacions amb valors vàlids per obtenir la validessa de les posicions de les observacions en aquesta àrea", 
					"spa": "No hay observaciones con valores válidos para obtener la validez de las posiciones de las observaciones en esta área", 
					"eng": "There is no observations with valid values to obtain the validity of the positions of observations in this area", 
					"fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la validité des positions des observations dans ce domaine"}));
		return false;
	}

	var quality={
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_DomainConsistency",
		statement: DonaCadenaLang({"cat": "La consistència del domini resumida està basada en la localització de cada observació individual present en la vista actual comparada amb l'àmbit especificat.",
					"spa": "La consistencia del dominio resumida está basada en la localización de cada observación individual present en la vista actual comparada con el ámbito especificado.",
					"eng": "The domain consistency is based on the localization of each individual observation present in the actual view against the envelope specified.",
					"fre": "The domain consistency is based on the localization of each individual observation present in the actual view against the envelope specified."}) ,
		result: [{
			qualityml: {
				version: "1.0",
				measure: {
					name: "ValueDomain"
				},
				domain: [{
					name: "Conformance",
					param: [
					{
						name: "BBOX",
						value: JSON.stringify(param.env)
					}],
					values:{
						list:["coordinates"]
					}
				}],
				metrics: [{
					name: "items",
					param: [{
						name: "count",
						value: n_dins
					}],
					values: {
						list: [n_valids]
					}
				}]
			}
		}]
	};
	AfegeixQualitatACapa(capa_digi, quality);
	return true;
}


/*function CercaCombinacioCL(objecte)
{
	if((!objecte[0] && !this[0]) || (objecte[0].toLowerCase()==this[0].toLowerCase()))   // no hauria de passar que una combinació fós tot null, però ho protegeixo per si de cas
	{	
		if((!objecte[1] && !this[1]) || (objecte[1] && this[1] && this[1].toLowerCase()==objecte[1].toLowerCase()))
		{
			if((!objecte[2] && !this[2]) || (objecte[2] && this[2] && this[2].toLowerCase()==objecte[2].toLowerCase()))
				return 1;			
		}
	}
	return 0;
}*/


function CercaCombinacioCamps(llista_comb, combinacio)
{
	if(!llista_comb ||  llista_comb.length<1)
		return null;

	/*try
	{*/						
		return llista_comb.find(function (objecte) {
			if(((!objecte[0] && !combinacio[0]) || objecte[0].toLowerCase()==combinacio[0].toLowerCase()) &&   // no hauria de passar que una combinació fós tot null, però ho protegeixo per si de cas
			   ((!objecte[1] && !combinacio[1]) || (objecte[1] && combinacio[1] && combinacio[1].toLowerCase()==objecte[1].toLowerCase())) &&
                	   ((!objecte[2] && !combinacio[2]) || (objecte[2] && combinacio[2] && combinacio[2].toLowerCase()==objecte[2].toLowerCase())))
				return true;
			return false;
		});  //tools1.js afageix suport a find() si no hi és.
	/*}
	catch(ex)
	{								
		// En funció de la versió potser que no existeixi la funció find()
		for(var i=0; i<llista_comb.length; i++)
		{
			if (CercaCombinacioCL(llista_comb[i]))
				return llista_comb[i];
		}
	}
	return null;*/
}

function CalculaConsistenciaLogicaDeCampsiLlistaValors(param)
{
var punt={}, capa_digi=ParamCtrl.capa[param.i_capa], combinacio=[], n_consistents=0, n=0, n_dins=0;

	if (!capa_digi.objectes.features)
		return false;
		
	for (var i_obj=0; i_obj<capa_digi.objectes.features.length; i_obj++)
	{
		var feature=capa_digi.objectes.features[i_obj];
		DonaCoordenadaPuntCRSActual(punt, capa_digi.objectes.features[i_obj], capa_digi.CRSgeometry);
		if (!EsPuntDinsEnvolupant(punt, ParamInternCtrl.vista.EnvActual))
			continue;			
		n_dins++;		
		
		// El primer atribut a avaluar la consistència lògica és obligatòri, per tant, si l'objecte que vaig a mirar no té aquest
		// atribut no el considero dins de l'avalució
		if (typeof feature.properties[param.atributlogic1]==="undefined" ||
		    feature.properties[param.atributlogic1]=="" ||
			feature.properties[param.atributlogic1]==null)
			continue;			
		n++;
		combinacio[0]=feature.properties[param.atributlogic1];
		combinacio[1]=(!param.atributlogic2 || typeof feature.properties[param.atributlogic2]==="undefined" || feature.properties[param.atributlogic2]=="") ? null : feature.properties[param.atributlogic2];
		combinacio[2]=(!param.atributlogic3 || typeof feature.properties[param.atributlogic3]==="undefined" || feature.properties[param.atributlogic3]=="") ? null : feature.properties[param.atributlogic3];		
		if(CercaCombinacioCamps(param.combinacions, combinacio))  // retorna l'objecte trobat, potser es vol usar per mostrar el domini?
			n_consistents++;
	}
		
	if (n==0)
	{
		alert(DonaCadenaLang({"cat": "No hi ha observacions amb valors vàlids per obtenir la consistència lògica dels atributs en aquesta àrea", 
					"spa": "No hay observaciones con valores válidos para obtener la consistencia lógica de los atributos en esta área", 
					"eng": "There is no observations with valid values to obtain logical consistency of attributes in this area", 
					"fre": "Il n'y a pas d'observations avec des valeurs valides pour obtenir la cohérence logique des attributs dans ce domaine"}));
		return false;
	}
	var quality={
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_DomainConsistency",
		statement: DonaCadenaLang({"cat": "La consistència resumida està basada en la comparació dels valors de cada observació pels atribut/s: ",
					"spa": "La consistència resumida está basada en la comparación de los valores de cada observación individual para los atributo/s: ",
					"eng": "The overall consistency is based on the comparison of the values of each individual observation for the field/s: ",
					"fre": "The overall consistency is based on the comparison of the values of each individual observation for the field(s: "}) + 
			param.atributlogic1+
			(param.atributlogic2 ?  ", " : "")+
			(param.atributlogic2 ? param.atributlogic2 : "")+
			(param.atributlogic3 ?  ", " : "")+
			(param.atributlogic3 ? param.atributlogic3 : "")+
			DonaCadenaLang({"cat": " contra la llista de valors possibles especificada al domini.",
					"spa": " contra la lista de valores posibles especificada en el dominio.",
					"eng": " against the list of possible values specified in the domain.",
					"fre": " against the list of possible values specified in the domain."}) + 
			DonaCadenaLang({"cat": "Hi ha",
					"spa": "Hay",
					"eng": "There are",
					"fre": "Il y a"}) + 
			" " + (n_dins-n) + " "+
			DonaCadenaLang({"cat": "de",
					"spa": "de",
					"eng": "of",
					"fre": "de"}) + 
			" " +n_dins+ " " + 
			DonaCadenaLang({"cat": "que no tenen informació sobre la consistència, perquè no tenen els atributs indicats.",
					"spa": "que no tienen información sobre la consisténcia, porque no tienen los atributos indicados.",
					"eng": "that does not have consistency information, because it does not have the specified attributes.",
					"fre": "qui n'ont pas d'informations de coherénce, parce qu'ils n'ont pas les attributs."}),
		result: [{
			qualityml: {
				version: "1.0",
				measure: {
					name: "ValueDomain"
				},
				domain: [{
					name: "Conformance",
					param: [
					{
						name: "PossibleValues",
						value: JSON.stringify(param.combinacions)
					}],
					values:{
						list:[param.atributlogic1]
					}
				}],
				metrics: [{
					name: "items",
					param: [{
						name: "count",
						value: n
					}],
					values: {
						list: [n_consistents]
					}
				}]
			}
		}]
	};
	if(param.atributlogic2)
		quality.result[0].qualityml.domain[0].values.list.push(param.atributlogic2);
	if(param.atributlogic3)
		quality.result[0].qualityml.domain[0].values.list.push(param.atributlogic3);
	
	AfegeixQualitatACapa(capa_digi, quality);
	return true;
}

function CalculaQualExacPosicDesDeCampUncertainty(param)
{
var capa_digi=ParamCtrl.capa[param.i_capa], n=0, n_dins=0, desv_tip=0, punt={}, i, unitats;

	if (!capa_digi.objectes.features)
		return false;
		
	for (var i_obj=0; i_obj<capa_digi.objectes.features.length; i_obj++)
	{
		var feature=capa_digi.objectes.features[i_obj];
		DonaCoordenadaPuntCRSActual(punt, capa_digi.objectes.features[i_obj], capa_digi.CRSgeometry);
		if (!EsPuntDinsEnvolupant(punt, ParamInternCtrl.vista.EnvActual))
			continue;			
		n_dins++;

		if (typeof feature.properties[param.atribut]!=="undefined" &&
			feature.properties[param.atribut]!=null)
		{
			desv_tip+=(feature.properties[param.atribut]*
				feature.properties[param.atribut])
			n++;
		}
	}
	if (n==0)
	{
		alert(DonaCadenaLang({"cat": "No hi ha observacions amb incertesa posicional en aquesta àrea", 
					"spa": "No hay observaciones con incertidumbre posicional en esta área", 
					"eng": "There is no observations with positional uncertainty in this area", 
					"fre": "Il n'y a pas d'observations avec une incertitude de position dans ce domaine"}));
		return false;
	}
	
	desv_tip=Math.sqrt(desv_tip/n);

	i=DonaIAtributsDesDeNomAtribut(capa_digi, param.atribut);
	if (i==-1)
	{
		alert(DonaCadenaLang({"cat": "Nom d'atribut incorrecte", 
					"spa": "Nombre de atributo incorrecto", 
					"eng": "Wrong attribute name", 
					"fre": "Nom d'attribut incorrect"}) + " " +
				param.atribut + "  " +
				DonaCadenaLang({"cat": "per calcular la qualitat de la capa",
						"spa": "para calcular la calidad de la capa", 
						"eng": "to compute data quality for the layer", 
						"fre": "pour calculer la qualité des données pour la couche"}) + " " +
				(capa_digi.desc ? capa_digi.desc : capa_digi.nom));
		unitats=null;
	}
	else
		unitats=capa_digi.atributs[i].unitats;

	AfegeixQualitatACapa(capa_digi, {
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_AbsoluteExternalPositionalAccuracy",
		statement: DonaCadenaLang({"cat": "La exactitud resumida està basada en la incertesa posicional de cada observació individual indicada a l'atribut",
					"spa": "La exactitud resumida está basada en la incertidumbre posicional de cada observación individual indicada en el atributo",
					"eng": "The overall accuracy is based on the positional uncertainty for each indiviadual observation as indicated in the field",
					"fre": "The overall accuracy is based on the positional uncertainty for each indiviadual observation as indicated in the field"}) + 
			" " +param.atribut+". " + 
			DonaCadenaLang({"cat": "Hi ha",
					"spa": "Hay",
					"eng": "There are",
					"fre": "There are"}) + 
			" " + (n_dins-n) + " "+
			DonaCadenaLang({"cat": "de",
					"spa": "de",
					"eng": "of",
					"fre": "of"}) + 
			" " +n_dins+ " " + 
			DonaCadenaLang({"cat": "que no tenen informació sobre la incertesa.",
					"spa": "que no tienen información sobre la incertidumbre.",
					"eng": "that does not have uncetainty information.",
					"fre": "that does not have uncetainty information."}),
		result: [{
			qualityml: {
				version: "1.0",
				measure: {
					name: "CircularMapAccuracy"
				},
				domain: [{
					name: "DifferentialErrors2D",					
					values: {
						list: [param.atribut],
						units : (unitats ? unitats : null)
					}
				}],
				metrics: [{
					name: "Half-lengthConfidenceInterval",
					param: [{
						name: "level",
						value: 0.683
					}],
					values: {
						list: [desv_tip],
						units: (unitats ? unitats : null)
					}
				}]
			}
		}]
	});
	return true;
}

function CalculaIAfegeixQualitatACapa(form, i_capa, i_estil)
{
var sel=form.metode_eval_qual, i, capa=ParamCtrl.capa[i_capa], retorn=false, param;
		
	if(sel.selectedIndex<sel.length)
	{
		if(sel.options[sel.selectedIndex].value=="PositionalAccuracyFromUncertainty")
		{
			var sel_camp=form.camp_incertesa;
			if(sel_camp.selectedIndex<sel_camp.length)
			{
				param={i_capa: i_capa, intencions: "qualitat", atribut: sel_camp.options[sel_camp.selectedIndex].value};
				if(DescarregaPropietatsCapaDigiVistaSiCal(CalculaQualExacPosicDesDeCampUncertainty, param))
					return;
				retorn=CalculaQualExacPosicDesDeCampUncertainty(param);				
			}
			else
			{
				alert(DonaCadenaLang({"cat": "Cal seleccionar un camp", "spa": "Debe seleccionar un campo", "eng": "You must select a field", "fre": "Vous devez sélectionner un champ"}));
				return;
			}
		}
		else if (sel.options[sel.selectedIndex].value=="LogicalConsistencyFromThematicAttributes")
		{
			var camp_log1=form.camp_logic1;
			var camp_log2=form.camp_logic2;
			var camp_log3=form.camp_logic3;
			var combi=form.llista_valors_logic;
			if(camp_log1.selectedIndex<camp_log1.length)
			{
				param={i_capa: i_capa, intencions: "qualitat", atributlogic1: camp_log1.options[camp_log1.selectedIndex].value};
				if(camp_log2.selectedIndex<camp_log2.length)
				{
					if(camp_log2.options[camp_log2.selectedIndex].value!="camp_logic_empty")
						param.atributlogic2=camp_log2.options[camp_log2.selectedIndex].value;
					else
						param.atributlogic2=null;
				}
				else
					param.atributlogic2=null;
				if(camp_log3.selectedIndex<camp_log3.length)
				{
					if(camp_log3.options[camp_log3.selectedIndex].value!="camp_logic_empty")
						param.atributlogic3=camp_log3.options[camp_log3.selectedIndex].value;
					else
						param.atributlogic3=null;
				}
				else
					param.atributlogic3=null;
					
				var linies=[];
				linies=combi.value.split("\n");
				param.combinacions=[];
				for(i=0; i<linies.length; i++)
				{
					param.combinacions[i]=[];
					param.combinacions[i]=linies[i].split(";");
				}
				if(DescarregaPropietatsCapaDigiVistaSiCal(CalculaConsistenciaLogicaDeCampsiLlistaValors, param))
					return;
				retorn=CalculaConsistenciaLogicaDeCampsiLlistaValors(param);				
			}
			else
			{
				alert(DonaCadenaLang({"cat": "Cal seleccionar un camp", "spa": "Debe seleccionar un campo", "eng": "You must select a field", "fre": "Vous devez sélectionner un champ"}));
				return;
			}
		}
		/*else if (sel.options[sel.selectedIndex].value=="ThematicAccuracyGroundTruth")
		{
			//·$·
			;
		}*/
		else if (sel.options[sel.selectedIndex].value=="TemporalValidityOfObservationData")
		{			
			// SORPRESA: Les dates s'enmagatzemen com a data UTC, però sorpresa que si escric 2018-12-01 acaba sent 2018-12-01 01:00 i en canvi si escric 2018/12/01 acaba sent 2018-12-01 00:00. 
			// Hi ha una hora de diferència!!! Això fa que quan comparo les dates aquestes poden estar escrites de diferent manera i per tant tenir una hora de diferència.
			// Com que la data s'enmagatzema com a hora UTC això fa que si comparo 2018-12-01 < 2018/12/01 en realitat estigui comparant 2018-12-01 1:00 < 2017-01-31 23:00.
			// Buscant més he trobat que si li passes una cadena amb '-' estas indicant el format UTC i si ho fas amb '/' fas el format local
			
			var sel_camp=form.camp_temporal;
			if(sel_camp.selectedIndex>=sel_camp.length)
			{
				alert(DonaCadenaLang({"cat": "Cal seleccionar un camp", "spa": "Debe seleccionar un campo", "eng": "You must select a field", "fre": "Vous devez sélectionner un champ"}));
				return;
			}

			if (!form.data_ini.value)
			{
				alert(DonaCadenaLang({"cat": "La data inicial no pot es pot deixar en blanc", 
									 "spa": "La fecha inicial no puede dejarse en blaco", 
									 "eng": "The initial date cannot be left blank", 
									 "fre": "La date finitiale ne peut pas être laissée en blanc"}));
				return;
			}
			var date_ini=new Date(form.data_ini.value);			

			if (!form.data_final.value)
			{
				alert(DonaCadenaLang({"cat": "La data final no pot es pot deixar en blanc", 
									 "spa": "La fecha final no puede dejarse en blaco", 
									 "eng": "The final date cannot be left blank", 
									 "fre": "La date finale ne peut pas être laissée en blanc"}));
				return;
			}
			var date_fi=new Date(form.data_final.value+"T23:59:59.999Z");  // form.data_final.value està com a hora UTC en format cadena. Necessito que estigui al final del dia per a fer comparacions.
			
			if(date_fi<=date_ini)
			{
				alert(DonaCadenaLang({"cat": "La data final no pot ser inferior a la inicial", 
									 "spa": "La fecha final no puede ser inferior a la inicial", 
									 "eng": "The final date cannot be less than the initial date", 
									 "fre": "La date finale ne peut pas être inférieure à la date initiale"}));
				return;
			}

			param= {i_capa: i_capa, intencions: "qualitat", atribut: sel_camp.options[sel_camp.selectedIndex].value, data_ini: date_ini, data_fi: date_fi};
			if(DescarregaPropietatsCapaDigiVistaSiCal(CalculaValidessaTemporal,param))
				return;
			retorn=CalculaValidessaTemporal(param);
			
		}
		else if (sel.options[sel.selectedIndex].value=="BBoxPositionalValidity")
		{
			var env={"MinX": form.coordXmin.value, "MaxX": form.coordXmax.value, "MinY": form.coordYmin.value, "MaxY": form.coordYmax.value};
			param={i_capa: i_capa, intencions: "qualitat", env: env};
			if(DescarregaPropietatsCapaDigiVistaSiCal(CalculaValidessaPosicionalBBOX, param))
				return;
			retorn=CalculaValidessaPosicionalBBOX(param);			
			
		}
		if(retorn)
		{
			alert(DonaCadenaLang({"cat": "El paràmetre de qualitat calculat està disponible a la entrada de menú contextual 'qualitat' de la capa", 
						"spa": "El parámetro de calidad calculado está disponible en la entrada de menú contextual 'calidad' de la capa", 
						"eng": "The calculated quality parameter is available as an entry in the context menu entry 'quality' of the layer", 
						"fre": "The calculated quality parameter is available as an entry in the context menu entry 'quality' of the layer"}) + " \"" +
				(DonaCadena(capa.desc) ? DonaCadena(capa.desc) : capa.nom) + "\".");
			TancaFinestraLayer('calculaQualitat');
		}
		else
		{
			alert(DonaCadenaLang({"cat": "No s'ha pogut calcular la qualitat de la capa", 
						"spa": "No se ha podido calcular la calidad de la capa", 
						"eng": "The quality cannot be computed for the layer", 
						"fre": "The quality cannot be computed for the layer"}) + " \"" +
				(DonaCadena(capa.desc) ? DonaCadena(capa.desc) : capa.nom) + "\".");
		}
	}
}


function DonaCadenaCampsPositionalAccuracyFromUncertainty(capa)
{
var cdns=[];	

	cdns.push("<fieldset><legend>",
				DonaCadenaLang({"cat":"Camp d'incertesa posicional", "spa":"Campo de incertidumbre posicional", "eng": "Field of positional uncertainty", "fre":"Champ d'incertitude de position"}), 
			  "</legend>");
	cdns.push("<select name=\"camp_incertesa\" class=\"Verdana11px\" >");	
	if(capa.atributs)
	{
		for(var i=0; i<capa.atributs.length; i++)	
			cdns.push("<option value=\"",capa.atributs[i].nom,"\"", (i==0 ? " selected ":""), "\>", 
					(DonaCadena(capa.atributs[i].descripcio) ? DonaCadena(capa.atributs[i].descripcio) : capa.atributs[i].nom));
	}
	cdns.push("</select></fieldset>");
	return cdns.join("");
}

function DonaCadenaCampsLogicalConsistencyFromThematicAttributes(capa)
{
var cdns=[];	

	cdns.push("<fieldset><legend>",
				DonaCadenaLang({"cat":"Atributs a verificar la consistència lògica", 
							   "spa":"Atributos a verificar la consistencia lógica", 
							   "eng":"Fields to verify the logical consistency", 
							   "fre":"Attributs pour vérifier la cohérence logique"}), 
			  "</legend>");

	cdns.push("<select name=\"camp_logic1\" class=\"Verdana11px\" >");	
	if(capa.atributs)
	{
		for(var i=0; i<capa.atributs.length; i++)	
			cdns.push("<option value=\"",capa.atributs[i].nom,"\"", (i==0 ? " selected ":""), "\>", 			
				(DonaCadena(capa.atributs[i].descripcio) ? DonaCadena(capa.atributs[i].descripcio) : capa.atributs[i].nom));
	}
	cdns.push("</select><br>");
	cdns.push("<select name=\"camp_logic2\" class=\"Verdana11px\">");	
	if(capa.atributs)
	{
		cdns.push("<option value=\"camp_logic_empty\" selected \>", DonaCadenaLang({"cat":"--buit--","spa":"--vacio--", "eng":"--empty--", "fre":"--vide--"}));
		for(var i=0; i<capa.atributs.length; i++)	
			cdns.push("<option value=\"",capa.atributs[i].nom,"\" \>", 
					(DonaCadena(capa.atributs[i].descripcio) ? DonaCadena(capa.atributs[i].descripcio) : capa.atributs[i].nom));
	}
	cdns.push("</select><br>");
	cdns.push("<select name=\"camp_logic3\" class=\"Verdana11px\">");	

	if(capa.atributs)
	{
		cdns.push("<option value=\"camp_logic_empty\" selected \>", DonaCadenaLang({"cat":"--buit--","spa":"--vacio--", "eng":"--empty--", "fre":"--vide--"}));
		for(var i=0; i<capa.atributs.length; i++)	
			cdns.push("<option value=\"",capa.atributs[i].nom,"\" \>", 
				   (DonaCadena(capa.atributs[i].descripcio) ? DonaCadena(capa.atributs[i].descripcio) : capa.atributs[i].nom));
	}
	cdns.push("</select><br>");
	cdns.push( DonaCadenaLang({"cat":"Llista de valors possibles (separats per ;)", 
				   "spa":"Lista de valores posibles (separados por ;)", 
				   "eng":"List of possible values (separated by ;)", 
				   "fre":"Liste des valeurs possibles (séparées par ;)"}),
			  "<br><textarea name=\"llista_valors_logic\" rows=\"8\" cols=\"60\" >",
			  DonaCadenaLang({"cat":"valor1camp1;valor1camp2;valor1camp3","spa":"valor1campo1;valor1campo2;valor1campo3", "eng":"value1field1;value1field2;value1field3", "fre":"valeur1champ1;valeur1champ2;valeur1champ3"}),
			  "</textarea>");
	cdns.push("</fieldset>");
	return cdns.join("");
}

function DonaCadenaCampsThematicAccuracyGroundTruth(capa)
{
	cdns.push("<fieldset><legend>",
				DonaCadenaLang({"cat":"Capa veritat terreny", "spa":"Capa verdad terreno", "eng": "Ground truth layer", "fre":"Couche de vérité terrain"}), 
			  "</legend>");
	//·$·
	cdns.push("</fieldset>");
	return cdns.join("");
}


function DonaCadenaCampsTemporalValidityOfObservationData(capa)
{
var cdns=[];	

	cdns.push("<fieldset><legend>",
				DonaCadenaLang({"cat":"Camp temporal", "spa":"Campo temporal", "eng": "Temporal field", "fre":"Temporal Champ"}), 
			  "</legend>");
	cdns.push("<select name=\"camp_temporal\" class=\"Verdana11px\" >");
	if(capa.atributs)
	{
		for(var i=0; i<capa.atributs.length; i++)	
			cdns.push("<option value=\"",capa.atributs[i].nom,"\"", (i==0 ? " selected ":""), "\>", 
					(DonaCadena(capa.atributs[i].descripcio) ? DonaCadena(capa.atributs[i].descripcio) : capa.atributs[i].nom));
	}
	cdns.push("</select></fieldset>");

	cdns.push("<fieldset><legend>",
				DonaCadenaLang({"cat":"Interval de les dates d'observació", "spa":"Intervalo de las fechas de observación", "eng": "Range of observation dates", "fre":"Plage de dates d'observation"}), 
			  "</legend>");
	
	cdns.push(DonaCadenaLang({"cat":"Data inicial", "spa":"Fecha inicial", "eng": "Initial date", "fre":"Date initiale"}), 
			": ",
			"<input type=\"date\" name=\"data_ini\" class=\"Verdana11px\" >",
			" ",
			DonaCadenaLang({"cat":"Data final", "spa":"Fecha final", "eng": "Final date", "fre":"Date finale"}),
			": ",
			"<input type=\"date\" name=\"data_final\" class=\"Verdana11px\" ><br>");	
	cdns.push("</fieldset>");
	return cdns.join("");
}

function DonaCadenaCampsBBOXPositionalValidity(capa)
{
var cdns=[], es_long_lat;	

	cdns.push("<fieldset><legend>",
				DonaCadenaLang({"cat":"Àmbit geogràfic", "spa":"Ámbito geográfico", "eng": "Geographic extent", "fre":"Etendue géographique"}), 
			  "</legend>");
	
	es_long_lat=EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

	cdns.push("<table class=\"Verdana11px\"><tr><td align=\"right\"><label id=\"label_xmin\" for=\"coordXmin\">",
			  (es_long_lat ? DonaCadenaLang({"cat":"Longitud mínima","spa":"Longitud mínima","eng":"Minimum longitude","fre":"Longitude minimale"}) : DonaCadenaLang({"cat":"X mínima","spa":"X mínima","eng":"Minimum X","fre":"X minimale"})),
			  ": </label><input class=\"Verdana11px\" id=\"coordXmin\" name=\"coordX\" type=\"text\" size=\"10\" value=\"", 
			  OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX, ParamCtrl.NDecimalsCoordXY),"\"></td>",
			  "<td align=\"right\"><label id=\"label_xmax\" for=\"coordXmax\">",
			  (es_long_lat ? DonaCadenaLang({"cat":"Longitud màxima","spa":"Longitud máxima","eng":"Maximum longitude","fre":"Longitude maximale"}) : DonaCadenaLang({"cat":"X màxima","spa":"X máxima","eng":"Maxima X","fre":"X maximale"})),
			  ": </label><input class=\"Verdana11px\" id=\"coordXmax\" name=\"coordX\" type=\"text\" size=\"10\" value=\"", 
			  OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX, ParamCtrl.NDecimalsCoordXY),"\"></td></tr>",
			  "<tr><td align=\"right\"><label id=\"label_ymin\" for=\"coordYmin\">",
			  (es_long_lat ? DonaCadenaLang({"cat":"Latitud mínima","spa":"Latitud mínima","eng":"Minimum latitude","fre":"Latitude minimale"}) : DonaCadenaLang({"cat":"Y mínima","spa":"Y mínima","eng":"Minimum Y","fre":"Y minimale"})),
			  ": </label><input class=\"Verdana11px\" id=\"coordYmin\" name=\"coordX\" type=\"text\" size=\"10\" value=\"", 
			  OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY, ParamCtrl.NDecimalsCoordXY),"\"></td>",
			  "<td align=\"right\"><label id=\"label_ymax\" for=\"coordYmax\">",
			  (es_long_lat ? DonaCadenaLang({"cat":"Latitud máxima","spa":"Latitud máxima","eng":"Maximum latitude","fre":"Latitude maximale"}) : DonaCadenaLang({"cat":"Y màxima","spa":"Y máxima","eng":"Maximum Y","fre":"Y maximale"})),
			  ": </label><input class=\"Verdana11px\" id=\"coordYmax\" name=\"coordX\" type=\"text\" size=\"10\" value=\"", 
			  OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY, ParamCtrl.NDecimalsCoordXY),"\"></td></tr></table>");

	cdns.push("</fieldset>");
	return cdns.join("");
}

function ActualitzaCampsEnFuncioMetodeAvaluacioQualitat(form, i_capa, i_estil)
{
var sel=form.metode_eval_qual;
var capa;

	capa=ParamCtrl.capa[i_capa];

	if(sel.selectedIndex<sel.length)
	{
		if(sel.options[sel.selectedIndex].value=="PositionalAccuracyFromUncertainty")
			window.document.getElementById('LayerParamEvalQual').innerHTML=DonaCadenaCampsPositionalAccuracyFromUncertainty(capa);
		else if (sel.options[sel.selectedIndex].value=="LogicalConsistencyFromThematicAttributes")
			window.document.getElementById('LayerParamEvalQual').innerHTML=DonaCadenaCampsLogicalConsistencyFromThematicAttributes(capa);
		else if (sel.options[sel.selectedIndex].value=="ThematicAccuracyGroundTruth")
			window.document.getElementById('LayerParamEvalQual').innerHTML=DonaCadenaCampsThematicAccuracyGroundTruth(capa);
		else if (sel.options[sel.selectedIndex].value=="TemporalValidityOfObservationData")
			window.document.getElementById('LayerParamEvalQual').innerHTML=DonaCadenaCampsTemporalValidityOfObservationData(capa);
		else if (sel.options[sel.selectedIndex].value=="BBoxPositionalValidity")
			window.document.getElementById('LayerParamEvalQual').innerHTML=DonaCadenaCampsBBOXPositionalValidity(capa);
	}
}

function DonaCadenaCalculaQualitatCapa(i_capa, i_estil)
{
var i_indicator, cdns=[];
var capa;

	capa=ParamCtrl.capa[i_capa];

	cdns.push("<form name=\"CalculaQualitatCapa\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerCalculaQualitatCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;width:95%\"><b>",
			DonaCadenaLang({"cat":"Calcular la qualitat de la capa", "spa":"Calcular la Calidad de la capa", "eng":"Compute the quality of the layer", "fre":"Calculer la qualité de la couche"}), " \"", 
			(DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom));
	if (i_estil!=-1)
		cdns.push(", ", DonaCadena(capa.estil[i_estil].desc));
	cdns.push("\"<b><br/><br/>");

	cdns.push("<fieldset><legend>",
			  DonaCadenaLang({"cat":"Mètode d'avaluació de la qualitat", "spa":"Método de evaluación de la calidad", "eng": "Quality assesment", "fre":"Méthode d'évaluation de la qualité"}), 
			  "</legend>");

	cdns.push("<select name=\"metode_eval_qual\" class=\"Verdana11px\" onChange=\"ActualitzaCampsEnFuncioMetodeAvaluacioQualitat(form,",i_capa,",",i_estil,");\" >");	
	cdns.push("<option value=\"PositionalAccuracyFromUncertainty\" selected \>",
			DonaCadenaLang({"cat":"Exactitud posicional de la capa a partir de la incertessa de l'observació",
				   "spa":"Exactitud posicional de la capa a partir de la incertidumbre de la observación",
				   "eng":"Positional accuracy of the layer from observation uncertainties",
				   "fre": "Précision de positionnement de la couche par rapport à l'incertitude d'observation"}));
	cdns.push("<option value=\"LogicalConsistencyFromThematicAttributes\" \>",
			DonaCadenaLang({"cat":"Consistència lògica dels atributs temàtics",
				   "spa":"Consistencia lógica de los atributos temáticos",
				   "eng":"Logical consistency of the thematic attributes",
				   "fre": "Cohérence logique des attributs thématiques"}));
	/*cdns.push("<option value=\"ThematicAccuracyGroundTruth\" \>",
			DonaCadenaLang({"cat":"Exactitud temàtica comparant amb la veritat terreny",
				   "spa":"Exactitud temática comparando con la verdad terreno",
				   "eng":"Thematic accuracy comparing with the ground truth",
				   "fre": "Exactitude thématique par rapport à la vérité du terrain"}));*/
	cdns.push("<option value=\"TemporalValidityOfObservationData\" \>",
			DonaCadenaLang({"cat":"Validessa temporal de la data d'observació",
				   "spa":"Validez temporal de la fecha de observación",
				   "eng":"Temporal validity of observation date",
				   "fre": "Validité temporelle de la date de l'observation"}));
	cdns.push("<option value=\"BBoxPositionalValidity\" \>",
			DonaCadenaLang({"cat":"Validessa de les posicions de les observacions (per envolupant)",
				   "spa":"Validez de las posiciones de las observaciones (por envolvente)",
				   "eng":"Validity of the positions of observations (by bounding box)",
				   "fre": "Validité des positions des observations (par enveloppe)"}));
	cdns.push("</select></fieldset>");
	cdns.push("<br/><div id=\"LayerParamEvalQual\" class=\"Verdana11px\">",DonaCadenaCampsPositionalAccuracyFromUncertainty(capa),"</div>");
	cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",				
			  DonaCadenaLang({"cat":"Calcular", "spa":"Calcular", "eng":"Compute", "fre":"Calculer"}), 
			  "\" onClick='CalculaIAfegeixQualitatACapa(form,",i_capa,",",i_estil,");' />",
			  "<input type=\"button\" class=\"Verdana11px\" value=\"",				
			  DonaCadenaLang({"cat":"Cancel·lar", "spa":"Cancelar", "eng":"Cancel", "fre":"Annuler"}), 
			  "\" onClick='TancaFinestraLayer(\"calculaQualitat\");' />");

	cdns.push("</div></form>");
	return cdns.join("");
}

function FinestraCalculaQualitatCapa(elem, i_capa, i_estil)
{
	contentLayer(elem, DonaCadenaCalculaQualitatCapa(i_capa, i_estil));
}
