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

    Aquest codi JavaScript ha estat idea de Joan Masó Pau (joan maso at uab cat)
    amb l'ajut de Núria Julià (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del
    CREAF que elabora programari de Sistema d'Informació Geogràfica
    i de Teledetecció per a la visualització, consulta, edició i anàlisi
    de mapes ràsters i vectorials. Aquest programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert.

    En particular, el Navegador de Mapes del MiraMon (client per Internet)
    es distribueix sota els termes de la llicència GNU Affero General Public
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.

    El Navegador de Mapes del MiraMon es pot actualitzar des de
    https://github.com/grumets/MiraMonMapBrowser.
*/

"use strict"

var QualityML=null;
var ArrelURLQualityML="https://www.qualityml.org/";

function LlegeixReportDataQualtity(quality_element, node_DQElement)
{
	if(!node_DQElement || !quality_element)
		return false;
	
	//·$· Potser puc agafar més propietats del id per omplir altre info
	var result=node_DQElement.getElementsByTagName('gmd:result');
	
	if(!result || result.length<1)
		return false;
	
	quality_element.result=[{qualityml:{measure:null, domain:null, metrics:null }}];
	
	var i, node, node2, cadena, quality_ml=quality_element.result[0].qualityml, index, nom, i_metric;
	
	//  Busco la mesura
	node=node_DQElement.getElementsByTagName('gmd:measureIdentification');
	if(node && node.length>0)
	{
		node2=node[0].getElementsByTagName('gmd:MD_Identifier');
		if(!node2 ||  node2.length<1)
			return false;
		node2=node2[0].getElementsByTagName('gmd:code');
		if(!node2 ||  node2.length<1)
			return false;
		node2=node2[0].getElementsByTagName('gmx:Anchor');
		if(!node2 ||  node2.length<1)
			return false;	
		cadena=node2[0].getAttribute("xlink:href");	
		
		index=cadena.indexOf('?');		
		// Potser que el nom de la mesura sigui una URL, miro d'eliminar-ho
		nom=(index==-1) ? cadena : cadena.slice(0, index);
		cadena=DonaAdreca(nom).toLowerCase();
		if(cadena=="https://www.qualityml.org/1.0/measure" || cadena=="http://www.qualityml.org/1.0/measure" || cadena=="www.qualityml.org/1.0/measure")
			nom=TreuAdreca(nom);			
		quality_ml.measure={name: nom};
		
		// Busco el domini
		if(index!=-1)
		{
			index=cadena.indexOf('domain=');
			if(index!=-1)
			{			
				cadena=cadena.slice(index+7);
				var matriu=cadena.split(',');
				quality_ml.domain=[];
				for(i=0; i<matriu.length;i++)
					quality_ml.domain[i]={name: matriu[i]};
			}
			// ·$· també hi poden haver params
		}
	}
	else
	{
		node=node_DQElement.getElementsByTagName('gmd:nameOfMeasure');
		if(!node || node.length<1)
			return false;
		node2=node[0].getElementsByTagName('gco:CharacterString');
		if(!node2 || node2.length<1)
			return false;
		cadena=node2[0].textContent;	
		quality_ml.measure={name: cadena };
	}		
	
	// busco la mètrica
	quality_ml.metrics=[];
	
	for(i=0,i_metric=0; i<result.length; i++)
	{
		node=result[i].getElementsByTagName('gmd:DQ_QuantitativeResult');
		if(!node || node.length<1)
			continue;
		
		// metrica : errorStatistic no és obligatòri però value si
		
		//valor
		node2=node[0].getElementsByTagName('gmd:value');
		if(!node2 || node2.length<1)
			continue;
		node2=node2[0].getElementsByTagName('gco:Record');
		if(!node2 || node2.length<1)
			continue;
		
		quality_ml.metrics[i_metric]={name : null, values : {}};
		quality_ml.metrics[i_metric].values.list=[node2[0].textContent];
		// ·$· els valors també poden tenir units quality_ml.metrics[i].values.units="m";
		// i tipus i param measure
		
		// nom de la mètrica a errorStatistic
		node2=node[0].getElementsByTagName('gmd:errorStatistic');
		if(node2 && node2.length>0)
		{			
			node2=node2[0].getElementsByTagName('gco:CharacterString');
			if(node2 && node2.length>0)
			{
				nom=node2[0].textContent;
				// Potser que el nom sigui una URL miro d'eliminar tot el que no cal i quedar-me només amb el nom			
				cadena=DonaAdreca(nom).toLowerCase();
				if(cadena=="https://www.qualityml.org/1.0/metrics" || cadena=="http://www.qualityml.org/1.0/metrics" || cadena=="www.qualityml.org/1.0/metrics")
					nom=TreuAdreca(nom);			
				quality_ml.metrics[i_metric].name=nom;
			}
		}		
					
		/*
		·$· de moment no tenim tipus de metrica!! caldia afegir el type!!
		node2=(node.getElementsByTagName('gmd:valueType')[0]).getElementsByTagName('gco:RecordType')[0];
		if(node2)
		{
			//Double precision real (UoM=days)
			cadena=node2.textContent;
			var index=cadena.indexOf('(');
			if(index!=-1)
			{
				quality_ml.metrics[i_metric].type=cadena.slice(0, index);
				quality_ml.metrics[i_metric].params=[];
				cadena=cadena.slice(index+1,cadena.indexOf(')'));
				var matriu=cadena.split(','), matriu2;
				for(var j=0;j<matriu.length;j++)
				{
					matriu2=matriu[j].split('=');
					quality_ml.metrics[i_metric].params[j]={name: matriu2[0]
												  value: matriu2[1]};
				}
			}
			else
			{
				quality_ml.metrics[i_metric].type=cadena;
			}
		}*/
		i_metric++;
	}
	return true;
}

function ParsejaDocMetadadesXMLPerOmplirQualitatCapa(doc, extra_param)
{
var root, node_quality, i, cadena, node, node2, node_report, i, j, k, quality_element;

	if(!doc)
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu"));
		return;
	}
	root=doc.documentElement;
	if(!root) 
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu"));
		return;
	}
	//Cal comprovar que és un document de capacitats, potser és un error, en aquest cas el llegeix-ho i el mostraré directament
	if(root.nodeName!="gmd:MD_Metadata")
	{
		alert(GetMessage("CannotObtainValidResponseFromServer", "cntxmenu") + "rootNode: " + root.nodeName);
		return;
	}
	node_quality=root.getElementsByTagName('gmd:dataQualityInfo');
	if(!node_quality || node_quality.length<1)
		return;
	
	extra_param.quality=[];
	for(i=0; i<node_quality.length; i++)
	{
		node=node_quality[i].getElementsByTagName('gmd:DQ_DataQuality');
		if(!node || node.length<1)
			continue;
		node_report=node[0].getElementsByTagName('gmd:report');
		if(!node_report || node_report.length<1)
			continue;
		for(j=0; j<node_report.length; j++)
		{
			for(k=0; k<node_report[j].childNodes.length; k++)
			{
				quality_element={};
				node2=node_report[j].childNodes[k];
				if(node2.nodeName=="gmd:DQ_AbsoluteExternalPositionalAccuracy")
					quality_element.indicator="DQ_AbsoluteExternalPositionalAccuracy";
				else if(node2.nodeName=="gmd:DQ_GriddedDataPositionalAccuracy")
					quality_element.indicator="DQ_AbsoluteExternalPositionalAccuracy";
				else if(node2.nodeName=="gmd:DQ_RelativeInternalPositionalAccuracy")
					quality_element.indicator="DQ_AbsoluteExternalPositionalAccuracy";
				else if(node2.nodeName=="gmd:DQ_ThematicClassificationCorrectness")
					quality_element.indicator="DQ_AbsoluteExternalPositionalAccuracy";
				else if(node2.nodeName=="gmd:DQ_QuantitativeAttributeAccuracy")
					quality_element.indicator="DQ_AbsoluteExternalPositionalAccuracy";
				else if(node2.nodeName=="gmd:DQ_NonQuantitativeAttributeAccuracy") 
					quality_element.indicator="DQ_NonQuantitativeAttributeAccuracy";
				else if(node2.nodeName=="gmd:DQ_CompletenessCommission")
					quality_element.indicator="DQ_CompletenessCommission";					
				else if(node2.nodeName=="gmd:DQ_CompletenessOmission") 
					quality_element.indicator="DQ_CompletenessOmission";
				else if(node2.nodeName=="gmd:DQ_AccuracyOfATimeMeasurement") 
					quality_element.indicator="DQ_AccuracyOfATimeMeasurement";
				else if(node2.nodeName=="gmd:DQ_TemporalConsistency") 
					quality_element.indicator="DQ_TemporalConsistency";
				else if(node2.nodeName=="gmd:DQ_TemporalValidity")
					quality_element.indicator="DQ_TemporalValidity";
				else if(node2.nodeName=="gmd:DQ_DomainConsistency")
					quality_element.indicator="DQ_DomainConsistency";					
				else if(node2.nodeName=="gmd:DQ_FormatConsistency")
					quality_element.indicator="DQ_FormatConsistency";
				else if(node2.nodeName=="gmd:DQ_TopologicalConsistency")
					quality_element.indicator="DQ_TopologicalConsistency";
				else if(node2.nodeName=="gmd:DQ_ConceptualConsistency")
					quality_element.indicator="DQ_ConceptualConsistency";
				else
					continue;
				// En ISO19115 DQ_NonQuantitativeAttributeAccuracy i en ISO19157 DQ_NonQuantitativeAttributeCorrectness
				//"DQ_NonQuantitativeAttributeCorrectness",","DQ_UsabilityElement","DQ_Confidence","DQ_Representativity","DQ_Homogeneity"]
				
				if(LlegeixReportDataQualtity(quality_element,node2))
					extra_param.quality.push(quality_element);
			}
		}
	}
	MostraQualitatCapa(extra_param.elem, extra_param.quality, extra_param.capa, extra_param.i_estil);
}

// Funciona tant per capa com per capa_digi
function AfegeixQualitatACapa(capa, quality)
{
	if (!capa.metadades)
		capa.metadades={};
	if (!capa.metadades.quality)
		capa.metadades.quality=[];
	return capa.metadades.quality[capa.metadades.quality.length]=quality;
}


function TancaFinestra_mostraQualitat()
{
	// Buido el contingut de la finestra
	var elem=getFinestraLayer(window, "mostraQualitat");
	if(elem)
		contentLayer(elem, "");		
	
}

function FinestraMostraQualitatCapa(elem, quality, capa, i_estil)
{
	var elem=ObreFinestra(window, "mostraQualitat", GetMessage("forShowingQualityInformation", "cntxmenu"));

	if (!elem)
		return;

	MostraQualitatCapa(elem, quality, capa, i_estil);
}

function DonaIndexIndicatorQualityML(id)
{
const id_temp=id.toLowerCase();

	for (var i=0; i<QualityML.indicator.length; i++)
	{
		if (QualityML.indicator[i].id.toLowerCase()==id_temp)
			return i;
	}
	return -1;
}

function DonaIndexMeasureQualityML(id)
{
const id_temp=id.toLowerCase();

	for (var i=0; i<QualityML.measure.length; i++)
	{
		if (QualityML.measure[i].id.toLowerCase()==id_temp)
			return i;
	}
	return -1;
}

function DonaIndexDomainQualityML(id)
{
const id_temp=id.toLowerCase();
	for (var i=0; i<QualityML.domain.length; i++)
	{
		if (QualityML.domain[i].id.toLowerCase()==id_temp)
			return i;
	}
	return -1;
}

function DonaIndexMetricQualityML(id)
{
const id_temp=id.toLowerCase();
	for (var i=0; i<QualityML.metric.length; i++)
	{
		if (QualityML.metric[i].id.toLowerCase()==id_temp)
			return i;
	}
	return -1;
}

function MostraQualitatCapa(elem, quality, capa, i_estil)
{
	if (!QualityML)
	{
		loadJSON(ArrelURLQualityML+"qualityml.json",
				// "qualityml.json",
			function(quality_ml, extra_param) {
				QualityML=quality_ml;
				MostraQualitatCapa(extra_param.elem, extra_param.quality, extra_param.capa, extra_param.i_estil);
			},
			function(xhr) { alert(xhr); },
			{elem:elem, quality: quality, capa:capa, i_estil: i_estil});
	}
	else if (!quality)
	{
		var ajax=new Ajax();
		if (window.doAutenticatedHTTPRequest && capa.access)
			doAutenticatedHTTPRequest(capa.access, "GET", 
					ajax, DonaNomFitxerMetadades(capa, i_estil), null, null, 
					ParsejaDocMetadadesXMLPerOmplirQualitatCapa, 
					"text/xml", {elem: elem, quality: null, capa: capa, i_estil: i_estil});
		else
			ajax.doGet(DonaNomFitxerMetadades(capa, i_estil),
					ParsejaDocMetadadesXMLPerOmplirQualitatCapa, "text/xml",{elem: elem, quality: null, capa: capa, i_estil: i_estil});
	}
	else		
		contentLayer(elem, DonaCadenaMostraQualitatCapa(quality, capa, i_estil));
}

function DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, concept, i, id_qml)
{
var cdns=[], nom="MostraQualitatCapa_"+i_q+"_"+i_r+"_"+concept+"_"+i+"_", url= ArrelURLQualityML + version + "/" + concept + "/" + id_qml;

	return BotoDesplegableIFrame(nom, url);
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

function DonaCadenaMostraQualitatCapa(quality, capa, i_estil)
{
var i_indicator, i_measure, i_domain, i_metric, cdns=[];

    cdns.push("<form name=\"QualitatCapa\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerQualitatCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;width:95%\">",
			GetMessage("QualityOfLayer", "qualitat"), " \"",
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
			if (DonaCRSRepresentaQuasiIguals(quality[i_q].scope.env.CRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
				cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
				  	GetMessage("GoTo", "capavola"),
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
						cdns.push("<b>Measure:</b> ", qualityml.measure.name);
						i_measure=DonaIndexMeasureQualityML(qualityml.measure.name);
						if(i_measure!=-1)
							cdns.push(DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, "measure", 0, qualityml.measure.name));
						cdns.push("<br/>", DonaCadenaParamQualitatCapa(qualityml.measure.param));
					}
					if (qualityml.domain)
					{
						for (var i_d=0; i_d<qualityml.domain.length; i_d++)
						{
							cdns.push("<b>Domain:</b> ", qualityml.domain[i_d].name);
							i_domain=DonaIndexDomainQualityML(qualityml.domain[i_d].name);
							if(i_domain!=-1)
								cdns.push(DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, "domain", i_d, qualityml.domain[i_d].name));
							cdns.push("<br/>", DonaCadenaParamQualitatCapa(qualityml.domain[i_d].param),
									DonaCadenaValorsComLlistaQualitatCapa(qualityml.domain[i_d].values));
						}
					}
					if (qualityml.metrics)
					{
						for (var i_m=0; i_m<qualityml.metrics.length; i_m++)
						{
							if(qualityml.metrics[i_m].name) // Potser que no tinguem nom de metrica
							{
								cdns.push("<b>Metrics:</b> ", qualityml.metrics[i_m].name);
								i_metric=DonaIndexMetricQualityML( qualityml.metrics[i_m].name);
								if(i_metric!=-1)
									cdns.push(DonaCadenaBotoExpandQualitatCapa(i_q, i_r, version, "metrics", i_m, qualityml.metrics[i_m].name));
								cdns.push("<br/>");
							}
							cdns.push(DonaCadenaParamQualitatCapa(qualityml.metrics[i_m].param),
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

function DonaCodeComponentBasatEnValorParam(valor)
{
	var i, s="";

	for (i=0; i<valor.param.length; i++)
	{
		if (valor.param[i].clau.nom)
		{
			s+=valor.param[i].clau.nom;
			if (valor.param[i].valor.nom)
				s+="_" + valor.param[i].valor.nom;
		}
		else
		{
			if (valor.param[i].valor.nom)
				s+=valor.param[i].valor.nom;
		}
		if (i!=(valor.param.length-1))
			s+="_";
	}
	return s;
}

function DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, i_component, descriptiu)
{
	var s="";

	if (typeof capa.estil[i_estil].component[i_component].i_valor !== "undefined") //si tinc i_valor (que pot valdre 0)
	{
		if (descriptiu)
			s=DonaCodeComponentBasatEnValorParam(capa.valors[capa.estil[i_estil].component[i_component].i_valor]);
		else
			s="v[" + capa.estil[i_estil].component[i_component].i_valor + "])";
	}
	else if (capa.estil[i_estil].component[i_component].FormulaConsulta)
	{
		if (descriptiu)
		{	//fins que obrim la porta estem segurs que tots els v d'aqui son de la mateixa capa
			var fragment, cadena, inici, final, nou_valor="", error=false;

			fragment=capa.estil[i_estil].component[i_component].FormulaConsulta;

			while ((inici=fragment.indexOf("v["))!=-1)
			{
				//busco una clau de tancar
				final=fragment.indexOf("]");
				if (final==-1)
				{
					alert("Character 'v[' without ']' in 'FormulaConsulta' in capa " + DonaCadenaNomDesc(capa) + " estil " + i_estil);
					error=true;
					break;
				}
				nou_valor+=fragment.substring(0, inici);
				cadena=fragment.substring(inici+2, final); //-> inici+2 perquè no vull ni "v[" ni "]"
				//aquí "cadena" conté el i_valor que vull
				var index = cadena.match(/\d+/g).map(Number);
				nou_valor+=DonaCodeComponentBasatEnValorParam(capa.valors[index]);

				fragment=fragment.substring(final+1, fragment.length);
			}
			nou_valor+=fragment; //el que queda
			nou_valor=nou_valor.replace(/ /g, "");
			if (!error)
				s=nou_valor;
		}
		else
		{
			s=capa.estil[i_estil].component[i_component].FormulaConsulta;
			s=s.replace(/ /g, "");
		}
	}
	return s;
}


function DonaCodeCapaEstilFeedback(i_capa, i_estil)
{
var MAX_LEN_IDENTIFICADOR_CAPA_O_ESTIL=254;
var capa=ParamCtrl.capa[i_capa];
var s=capa.nom;

	if (ParamCtrl.capa[i_capa].FormatImatge=="image/tiff" && (ParamCtrl.capa[i_capa].tipus=="TipusHTTP_GET" || !ParamCtrl.capa[i_capa].tipus))
		return DonaUrlLecturaTiff(i_capa, 0, capa.i_data, null);

	if (i_estil==-1)
		return s;

	//estil antic -> return capa.nom + (i_estil==-1 ? "": "_" + DonaCadenaNomDesc(capa.estil[i_estil]) );

	if (capa.estil[i_estil].component.length==1)
	{	//pot ser un i_valor o un FormulaConsulta
		if (typeof capa.estil[i_estil].component[0].i_valor !== "undefined") //si no quan i_valor valia 0 no entrava!
		{
			s+="_VALUE(" + DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, 0, true) + ")";
			if (s.length < MAX_LEN_IDENTIFICADOR_CAPA_O_ESTIL)
				return s;

			s+="_VALUE(" + DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, 0, false) + ")";
				return s;
		}
		else if (capa.estil[i_estil].component[0].FormulaConsulta)
		{
			var s2=null, i_capes;
			if (!capa.estil[i_estil].component[0].calcul)	//per indexos predefinits el "calcul" no existeix, però puc entrar perquè segur que la FormulaConsulta només té v[] d'aquesta capa.
				//s2=capa.estil[i_estil].component[0].FormulaConsulta;
				s2=DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, 0, true);
			else
			{
				i_capes=DonaIndexosACapesDeCalcul(capa.estil[i_estil].component[0].calcul, i_capa);
				if (i_capes.length==1) //per indexos calculats per l'usuari, el "calcul" sí que existeix, i amb el darrer if he comprovat que en aquest càlcul només entren bandes d'aquesta capa (és a dir que i_capes==1)
					//s2=capa.estil[i_estil].component[0].FormulaConsulta;
					s2=DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, 0, true);
			}

			if (s2)
			{	//ho fem així per unificar la descripció a un sol, lloc, encara que vinguem de dos casos diferents a dalt
					s+="_CALC(" + s2 + ")";
					if (s.length < MAX_LEN_IDENTIFICADOR_CAPA_O_ESTIL)
						return s;

					s+="_CALC(" + DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, 0, false) + ")";
					return s;
			}

			//aquí arribo només si tinc calcul i quan l'analitzo em diu que hi ha capes "externes a la pròpia" implicades
			alert(GetMessage("ComplexDefinitionOfStyle", "qualitat") + ".");
			return null; //si no sé donar identificador a l'estil, no deixo posar feedback sobre ell

		//només arribo aquí (i.e. no surto) si tinc 1 sol component però aquest no té ni i_valor ni FormulaConsulta

			/*notes sobre com fer això:

			1/ La idea és que si ara filtro espacialment amb una banda de la mateixa capa (p.ex per scl), a formula és
				"(v[12]!=11)?((v[10]-v[11])/(v[10]+v[11])):null"
			i a d'alt ja m'ha tornat i_capes=1 i ho he fet

			2/ si filtro amb una altra capa(pex), la idea és que la formula diu
					"(v[        13                    ]!=11)?((v[10]-v[11])/(v[10]+v[11])):null"
			pero aquest v[13] s'ha creat pel programa i ha de ser substituit en primera instància per
					"(v[{\"i_capa\":228,\"i_valor\":0}]!=11)?((v[10]-v[11])/(v[10]+v[11])):null"
			però com els índexs de capa son super volàlits, realment hauré d'anar a alguna cosa tipus
				"(v[{\"servidor\":"http://maps-***.cgi",\"nom_capa\":"SwissNationalParkLULC",\"i_valor\":0}]!=11)?((v[10]-v[11])/(v[10]+v[11])):null"
			(el servidor al meu config.json pot ser "null" que vol dir el servidor_local que és una variable global. si ñes null puc no posar-lo pq s'entenc que la nom_capa :"SwissNationalParkLULC" és al amteix servidor que la capa de la qual faig el FB/estil (és a dir la que té els v[10], etc). Si relament ve d0un lloc diferent, aleshores si ho poso
			o bé, en un exemple diferent usar el mapa usos nostres 2019 per a filtra espacial el SwissNationalParkSen2 de \"servidor\":"http://maps-***.cgi"
				"(v[{\"servidor\":"http://MCSC....***.cgi",\"nom_capa\":"MUSC_2019",\"i_valor\":0}]!=11)?((v[10]-v[11])/(v[10]+v[11])):null"

			"calcul": "({\"i_valor\":12}!=11)?(({\"i_capa\":232,\"i_valor\":10}-{\"i_capa\":232,\"i_valor\":11})/({\"i_capa\":232,\"i_valor\":10}+{\"i_capa\":232,\"i_valor\":11})):null",

			capa nova
			FormulaConsulta -> i_capes diferents -> similar a aaixò -> unic cas amb i_valor
			"(v[{\"nom_capa\":\"SwissNationalParkLULC\",\"i_valor\":0}]!=11)?((v[10]-v[11])/(v[10]+v[11])):null" però amb NOMS CAPES DFE

			calcul sobre calcul no tinc nom de capa, però no passa res pq les formules s'expandeixen*/
		}
	}
	else //if (capa.estil[i_estil].component.length==3) //si tinc tres és que és RGB i per tant tres i_valor -> si per alguna no tinc i_valor, cosa teòricament no possible ara, aquell no l'afegeixo i el Identificador quedarà "amb menys components"
	{
		var i, s2;

		s2="_RGB(";
		for (i=0; i<capa.estil[i_estil].component.length; i++)
		{
			s2+=DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, i, true);
			if (i!=(capa.estil[i_estil].component.length-1))
				s2+=",";
		}
		s2+=")";

		if ((s2.length + s.length) < MAX_LEN_IDENTIFICADOR_CAPA_O_ESTIL)
			return s+s2;

		s2="_RGB(";
		for (i=0; i<capa.estil[i_estil].component.length; i++)
		{
			s2+=DonaCodeUnComponentCapaEstilFeedback(capa, i_estil, i, false);
			if (i!=(capa.estil[i_estil].component.length-1))
				s2+=",";
		}
		s2+=")";
		return s+s2;
		/*if (capa.estil[i_estil].component[0].i_valor && capa.estil[i_estil].component[1].i_valor && capa.estil[i_estil].component[2].i_valor)
		{
			$$ per cada una de les tres usar el i_valor
			s+="_RGB(" + "v[" + capa.estil[i_estil].component[0].i_valor + "],"+ "v[" + capa.estil[i_estil].component[1].i_valor + "],"+ "v[" + capa.estil[i_estil].component[2].i_valor + "])";
			return s;
		}	*/
		//·$· poter salvar aquest cas per si un dia volen fer RGB de formules?
	}

	/*Aquí arribo si tinc 1 sol component però aquest no té ni i_valor ni FormulaConsulta; si tinc 3 components però alguna no té i_valor,
	o bé si tinc un nombre de components diferent de 1 o de 3 no té sentit

	-> codi per si un dia volem desar un ID com a llista dels N valors, un darrera l'altre
	var i;
	for (i=0; i<capa.estil[i_estil].component.length; i++)
	{
		if (capa.estil[i_estil].component[i].i_valor)
			s+="_" + "v[" + capa.estil[i_estil].component[i].i_valor + "]";
	}*/
	alert(GetMessage("UnexpectedDefinitionOfStyle", "qualitat") + ".");
	return null; //si no sé donar identificador a l'estil, no deixo posar feedback sobre ell
}

//Si la capa te un tokenType associat es fa servir aquest, i si no el primer que estigui actiu, i si no n'hi ha cap, el primer que tingui possibilitat de fer-se servir
function DonaAccessTokenTypeFeedback(capa)
{
	if (!ParamCtrl.accessClientId)
		return null;

	if (capa.access)
		return capa.access.tokenType;

	for (var tokenType in ParamCtrl.accessClientId)
	{
		if (ParamCtrl.accessClientId.hasOwnProperty(tokenType))
		{
			if (!ParamInternCtrl.tokenType)
			{
				alert("authen.js not included in index.htm");
				return null;
			}
			if (ParamInternCtrl.tokenType[tokenType].userAlreadyWelcomed)
				return tokenType;
		}
	}
	for (var tokenType in ParamCtrl.accessClientId)
	{
		if (ParamCtrl.accessClientId.hasOwnProperty(tokenType))
		{
			return tokenType;
		}
	}
	return null;
}


function FinestraFeedbackCapa(elem, i_capa, i_estil)
{
var cdns=[], s;
var capa=ParamCtrl.capa[i_capa];

	cdns.push(GetMessage("theLayer"),
				" \"", (DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom));
 	if (i_estil!=-1)
		cdns.push(", ", DonaCadena(capa.estil[i_estil].desc));
	cdns.push("\"");

	if (!(s=DonaCodeCapaEstilFeedback(i_capa, i_estil)))
	{
		TancaFinestraLayer('feedback');
		return;
	}

	/*if (s.indexOf("Sentinel2Level2a")!=-1) //és una Sentinel2
	{
		var targets=[{title: DonaCadena(capa.desc) + (i_estil==-1 ? "": ", " + DonaCadena(capa.estil[i_estil].desc)), code: s, codespace: DonaServidorCapa(capa), role: "primary"},
				{title: "Sentinel 2 L2A Collection", code: "Sentinel2Level2aCollection", codespace: "http://datacube.uab.cat/cgi-bin/ecopotential/miramon.cgi", role: "secondary"}];
			GUFShowFeedbackMultipleTargetsInHTMLDiv(elem, "LayerFeedbackCapa", cdns.join(""), targets, ParamCtrl.idioma);
	}
	else*/
		GUFShowFeedbackInHTMLDiv(elem,
				"LayerFeedbackCapa",
				cdns.join(""),
				DonaCadena(capa.desc) + (i_estil==-1 ? "": ", " + DonaCadena(capa.estil[i_estil].desc)),  //desc, es pot haver canviat, però no és crític
				s, //identificador unic
				DonaAdrecaAbsoluta(DonaServidorCapa(capa)).replace("//ecopotential.grumets.cat/", "//maps.ecopotential-project.eu/"),
				ParamCtrl.idioma,
				DonaAccessTokenTypeFeedback(capa),
				"MostraFinestraFeedbackAmbScope");
}

function AdoptaEstil(params_function, guf)
{
var i_estil_nou, estil, capa;

	if (!guf)
	{
		alert(GetMessage("UnexpectedDefinitionOfFeedback", "qualitat") + ". " + GetMessage("StyleCannotImported", "qualitat") + ".");
		TancaFinestraLayer('feedbackAmbEstils');
		return;
	}

	if (guf.usage.usage_descr.platform && guf.usage.usage_descr.platform==encodeURI(ToolsMMN) &&
			guf.usage.usage_descr.version && guf.usage.usage_descr.version==(VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers) &&
			guf.usage.usage_descr.schema && guf.usage.usage_descr.schema==config_schema_estil &&
			guf.usage.usage_descr.code!="")
	{
		//Crea un nou estil
		capa=ParamCtrl.capa[params_function.i_capa];
		i_estil_nou=capa.estil.length;
		capa.estil[capa.estil.length]=JSON.parse(guf.usage.usage_descr.code);
		estil=capa.estil[i_estil_nou];

		if (capa.visible=="ara_no")
			CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
		else
			CreaLlegenda();

		//Defineix el nou estil com estil actiu
		CanviaEstilCapa(params_function.i_capa, i_estil_nou, false);
	}
	else
	{
		alert(GetMessage("FeedbackNotValidReproducibleDescription", "qualitat") + ". " + GetMessage("StyleCannotImported", "qualitat") + ".");
	}
	TancaFinestraLayer('feedbackAmbEstils');
	return;
}

function FinestraFeedbackAmbEstilsCapa(elem, i_capa)
{
var cdns=[], s;
var capa=ParamCtrl.capa[i_capa];

	cdns.push(GetMessage("theLayer"),
				" \"", (DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom));
	cdns.push("\"");

	if (!(s=DonaCodeCapaEstilFeedback(i_capa, -1)))
	{
		TancaFinestraLayer('feedbackAmbEstils');
		return;
	}

	GUFShowPreviousFeedbackWithReproducibleUsageInHTMLDiv(elem, "LayerFeedbackAmbEstilsCapa", s, DonaServidorCapa(capa),
		{ru_platform: encodeURI(ToolsMMN), ru_version: VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers,
			ru_schema: encodeURIComponent(config_schema_estil) /*, ru_sugg_app: location.href -> no cal passar-ho perquè s'omple per defecte*/},
		ParamCtrl.idioma, DonaAccessTokenTypeFeedback(capa) /*access_token_type*/, "AdoptaEstil"/*callback_function*/, {i_capa: i_capa});
}

function CalculaValidessaTemporal(param)
{
var punt={}, capa_digi=ParamCtrl.capa[param.i_capa], n_valids=0, n=0, n_dins=0, data_obj, i_camp, camp;

	if (!capa_digi.objectes.features)
		return false;

	if (!capa_digi.attributes[param.attribute_name])
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
		if (typeof feature.properties[param.attribute]==="undefined" ||
			feature.properties[param.attribute]=="" ||
			feature.properties[param.attribute]==null)
			continue;

		n++;

		if (camp.presentation=="dd/mm/yyyy")
		{
			var dateParts = feature.properties[param.attribute].split("/");
			if (!dateParts || dateParts.length!=3)
				continue;
			data_obj=new Date(dateParts[2]+"-"+dateParts[1]+"-"+dateParts[0]);  //fet així pensa que el text és hora UTC que és el mateix que passa amb la lectura dels formularis
		}
		else
			data_obj=new Date(feature.properties[param.attribute]);
		if(data_obj>= param.data_ini && data_obj<=param.data_fi)
			n_valids++;
	}

	if (n==0)
	{
		alert(GetMessage("NoObservationsValidObtainValidity", "qualitat"));
		return false;
	}
	var quality={
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_TemporalValidity",
		statement: GetMessage("ConsistencyBasedOnComparisonObservation","qualitat") +
			" \'"+param.attribute+"\' "+
			GetMessage("dataIntervalSpecified", "qualitat")+ ". " +
			GetMessage("ThereAre") +
			" " + (n_dins-n) + " "+
			GetMessage("of") +
			" " +n_dins+ " " +
			GetMessage("notValdityInformation", "qualitat") + ".",
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
						list:[param.attribute]
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
		alert(GetMessage("NoObservationsValidityPositions", "qualitat"));
		return false;
	}

	var quality={
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_DomainConsistency",
		statement: GetMessage("DomainConsistencyOnLocationIndividual", "qualitat") ,
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
		});  //tools1.js afegeix suport a find() si no hi és.
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

		// El primer attribute a avaluar la consistència lògica és obligatòri, per tant, si l'objecte que vaig a mirar no té aquest
		// attribute no el considero dins de l'avalució
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
		alert(GetMessage("NoObservationsLogicalConsistency", "qualitat"));
		return false;
	}
	var quality={
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_DomainConsistency",
		statement: GetMessage("OverallConsistencyComparisonIndividualObservation", "qualitat") + ": " +
			param.atributlogic1+
			(param.atributlogic2 ?  ", " : "")+
			(param.atributlogic2 ? param.atributlogic2 : "")+
			(param.atributlogic3 ?  ", " : "")+
			(param.atributlogic3 ? param.atributlogic3 : "")+
			+ " " + GetMessage("listPossibleValuesDomain", "qualitat") + "." +
			GetMessage("ThereAre") +
			" " + (n_dins-n) + " "+
			GetMessage("of") +
			" " + n_dins + " " +
			GetMessage("notConsistencyInformationSpecifiedAttributes", "qualitat"),
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
var capa_digi=ParamCtrl.capa[param.i_capa], n=0, n_dins=0, desv_tip=0, punt={}, i, UoM;

	if (!capa_digi.objectes.features)
		return false;

	for (var i_obj=0; i_obj<capa_digi.objectes.features.length; i_obj++)
	{
		var feature=capa_digi.objectes.features[i_obj];
		DonaCoordenadaPuntCRSActual(punt, capa_digi.objectes.features[i_obj], capa_digi.CRSgeometry);
		if (!EsPuntDinsEnvolupant(punt, ParamInternCtrl.vista.EnvActual))
			continue;
		n_dins++;

		if (typeof feature.properties[param.attribute_name]!=="undefined" &&
			feature.properties[param.attribute_name]!=null)
		{
			desv_tip+=(feature.properties[param.attribute_name]*
				feature.properties[param.attribute_name])
			n++;
		}
	}
	if (n==0)
	{
		alert(GetMessage("NoObservationsPositionalUncertainty", "qualitat"));
		return false;
	}

	desv_tip=Math.sqrt(desv_tip/n);

	i=DonaIAttributesDesDeNomAttribute(capa_digi, capa_digi.attributes, param.attribute_name);
	if (i==-1)
	{
		alert(GetMessage("WrongAttributeName", "qualitat") + " " +
				param.attribute_name + "  " +
				GetMessage("computeDataQuality", "qualitat") + " " +
				DonaCadenaNomDesc(capa_digi));
		UoM=null;
	}
	else
		UoM=capa_digi.attributes[param.attribute_name].UoM;

	AfegeixQualitatACapa(capa_digi, {
		scope: ((n_dins==capa_digi.objectes.features.length) ? null : {env: {EnvCRS: JSON.parse(JSON.stringify(ParamInternCtrl.vista.EnvActual)), CRS: ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS}}),
		indicator: "DQ_AbsoluteExternalPositionalAccuracy",
		statement: GetMessage("AccuracyPositionalUncertainty", "quality") +
			" " +param.attribute_name+". " +
			GetMessage("ThereAre") +
			" " + (n_dins-n) + " "+
			GetMessage("of") +
			" " +n_dins+ " " +
			GetMessage("noUncertaintyInformation", "qualitat"),
		result: [{
			qualityml: {
				version: "1.0",
				measure: {
					name: "CircularMapAccuracy"
				},
				domain: [{
					name: "DifferentialErrors2D",
					values: {
						list: [param.attribute_name],
						units : (UoM ? UoM : null)
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
						units: (UoM ? UoM : null)
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
				param={i_capa: i_capa, intencions: "qualitat", attribute_name: sel_camp.options[sel_camp.selectedIndex].value};
				if(DescarregaPropietatsCapaDigiVistaSiCal(CalculaQualExacPosicDesDeCampUncertainty, param))
					return;
				retorn=CalculaQualExacPosicDesDeCampUncertainty(param);
			}
			else
			{
				alert(GetMessage("MustSelectField"));
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
				alert(GetMessage("MustSelectField"));
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
				alert(GetMessage("MustSelectField"));
				return;
			}

			if (!form.data_ini.value)
			{
				alert(GetMessage("InitialDateNotBlank","qualitat"));
				return;
			}
			var date_ini=new Date(form.data_ini.value);

			if (!form.data_final.value)
			{
				alert(GetMessage("FinalDateNotBlank", "qualitat"));
				return;
			}
			var date_fi=new Date(form.data_final.value+"T23:59:59.999Z");  // form.data_final.value està com a hora UTC en format cadena. Necessito que estigui al final del dia per a fer comparacions.

			if(date_fi<=date_ini)
			{
				alert(GetMessage("FinalDateNotLessInitialDate", "qualitat"));
				return;
			}

			param= {i_capa: i_capa, intencions: "qualitat", attribute_name: sel_camp.options[sel_camp.selectedIndex].value, data_ini: date_ini, data_fi: date_fi};
			if(DescarregaPropietatsCapaDigiVistaSiCal(CalculaValidessaTemporal, param))
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
			alert(GetMessage("QualityParamAvailableMenu", "qualitat") + " \"" +
				DonaCadenaNomDesc(capa) + "\".");
			TancaFinestraLayer('calculaQualitat');
		}
		else
		{
			alert(GetMessage("QualityNotComputedLayer", "qualitat") + " \"" +
				DonaCadenaNomDesc(capa) + "\".");
		}
	}
}


function DonaCadenaCampsPositionalAccuracyFromUncertainty(capa)
{
var cdns=[];

	cdns.push("<fieldset><legend>",
				GetMessage("FieldPositionalUncertainty", "qualitat"),
			  "</legend>");
	cdns.push("<select name=\"camp_incertesa\" class=\"Verdana11px\" >");
	if(capa.attributes)
	{
		var attributesArray=Object.keys(capa.attributes);
		for(var i=0; i<attributesArray.length; i++)
			cdns.push("<option value=\"", attributesArray[i], "\"", (i==0 ? " selected ":""), "\>",
					DonaCadenaDescripcioAttribute(attributesArray[i], capa.attributes[attributesArray[i]], false));
	}
	cdns.push("</select></fieldset>");
	return cdns.join("");
}

function DonaCadenaCampsLogicalConsistencyFromThematicAttributes(capa)
{
var cdns=[];

	cdns.push("<fieldset><legend>",
				GetMessage("FieldsVerifyLogicalConsistency", "qualitat"),
			  "</legend>");

	cdns.push("<select name=\"camp_logic1\" class=\"Verdana11px\" >");
	if(capa.attributes)
	{
		var attributesArray=Object.keys(capa.attributes);
		for(var i=0; i<attributesArray.length; i++)
			cdns.push("<option value=\"", attributesArray[i],"\"", (i==0 ? " selected ":""), "\>",
				DonaCadenaDescripcioAttribute(attributesArray[i], capa.attributes[attributesArray[i]], false));
	}
	cdns.push("</select><br>");
	cdns.push("<select name=\"camp_logic2\" class=\"Verdana11px\">");
	if(capa.attributes)
	{
		cdns.push("<option value=\"camp_logic_empty\" selected \>", "--", GetMessage("empty"), "--");
		for(var i=0; i<attributesArray.length; i++)
			cdns.push("<option value=\"", attributesArray[i], "\" \>",
					DonaCadenaDescripcioAttribute(attributesArray[i], capa.attributes[attributesArray[i]], false));
	}
	cdns.push("</select><br>");
	cdns.push("<select name=\"camp_logic3\" class=\"Verdana11px\">");

	if(capa.attributes)
	{
		cdns.push("<option value=\"camp_logic_empty\" selected \>", "--", GetMessage("empty"), "--");
		for(var i=0; i<attributesArray.length; i++)
			cdns.push("<option value=\"", attributesArray[i], "\" \>",
				   DonaCadenaDescripcioAttribute(attributesArray[i], capa.attributes[attributesArray[i]], false));
	}
	cdns.push("</select><br>");
	cdns.push(GetMessage("ListPossibleValues", "qualitat"), " (", GetMessage("separatedBy"), " ;)",
			  "<br><textarea name=\"llista_valors_logic\" rows=\"8\" cols=\"60\" >",
			  GetMessage("valueField", "qualitat"),
			  "</textarea>");
	cdns.push("</fieldset>");
	return cdns.join("");
}

function DonaCadenaCampsThematicAccuracyGroundTruth(capa)
{
	cdns.push("<fieldset><legend>",
				GetMessage("GroundTruthLayer", "qualitat"),
			  "</legend>");
	//·$·
	cdns.push("</fieldset>");
	return cdns.join("");
}


function DonaCadenaCampsTemporalValidityOfObservationData(capa)
{
var cdns=[];

	cdns.push("<fieldset><legend>",
				GetMessage("TemporalField"),
			  "</legend>");
	cdns.push("<select name=\"camp_temporal\" class=\"Verdana11px\" >");
	if(capa.attributes)
	{
		var attributesArray=Object.keys(capa.attributes);
		for(var i=0; i<attributesArray.length; i++)
			cdns.push("<option value=\"", attributesArray[i], "\"", (i==0 ? " selected ":""), "\>",
					DonaCadenaDescripcioAttribute(attributesArray[i], capa.attributes[attributesArray[i]], false));
	}
	cdns.push("</select></fieldset>");

	cdns.push("<fieldset><legend>",
				GetMessage("RangeObservationDates", "qualitat"),
			  "</legend>");

	cdns.push(GetMessage("InitialDate", "qualitat"),
			": ",
			"<input type=\"date\" name=\"data_ini\" class=\"Verdana11px\" >",
			" ",
			GetMessage("FinalDate", "qualitat"),
			": ",
			"<input type=\"date\" name=\"data_final\" class=\"Verdana11px\" ><br>");
	cdns.push("</fieldset>");
	return cdns.join("");
}

function DonaCadenaCampsBBOXPositionalValidity(capa)
{
var cdns=[], es_long_lat;

	cdns.push("<fieldset><legend>",
				GetMessage("GeographicExtent", "qualitat"),
			  "</legend>");

	es_long_lat=EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

	cdns.push("<table class=\"Verdana11px\"><tr><td align=\"right\"><label id=\"label_xmin\" for=\"coordXmin\">",
			  (es_long_lat ? GetMessage("MinimumLongitude", "qualitat") : GetMessage("MinimumX", "qualitat")),
			  ": </label><input class=\"Verdana11px\" id=\"coordXmin\" name=\"coordX\" type=\"text\" size=\"10\" value=\"",
			  OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX, ParamCtrl.NDecimalsCoordXY),"\"></td>",
			  "<td align=\"right\"><label id=\"label_xmax\" for=\"coordXmax\">",
			  (es_long_lat ? GetMessage("MaximumLongitude", "qualitat") : GetMessage("MaximumX", "qualitat")),
			  ": </label><input class=\"Verdana11px\" id=\"coordXmax\" name=\"coordX\" type=\"text\" size=\"10\" value=\"",
			  OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX, ParamCtrl.NDecimalsCoordXY),"\"></td></tr>",
			  "<tr><td align=\"right\"><label id=\"label_ymin\" for=\"coordYmin\">",
			  (es_long_lat ? GetMessage("MinimumLatitude", "qualitat") : GetMessage("MinimumY", "qualitat")),
			  ": </label><input class=\"Verdana11px\" id=\"coordYmin\" name=\"coordX\" type=\"text\" size=\"10\" value=\"",
			  OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY, ParamCtrl.NDecimalsCoordXY),"\"></td>",
			  "<td align=\"right\"><label id=\"label_ymax\" for=\"coordYmax\">",
			  (es_long_lat ? GetMessage("MaximumLatitude", "qualitat") : GetMessage("MaximumY", "qualitat")),
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
			GetMessage("ComputeQualityLayer", "qualitat"), " \"",
			(DonaCadena(capa.DescLlegenda) ? DonaCadena(capa.DescLlegenda): capa.nom));
	if (i_estil!=-1)
		cdns.push(", ", DonaCadena(capa.estil[i_estil].desc));
	cdns.push("\"<b><br/><br/>");

	cdns.push("<fieldset><legend>",
			  GetMessage("QualityAssessment", "qualitat"),
			  "</legend>");

	cdns.push("<select name=\"metode_eval_qual\" class=\"Verdana11px\" onChange=\"ActualitzaCampsEnFuncioMetodeAvaluacioQualitat(form,",i_capa,",",i_estil,");\" >");
	cdns.push("<option value=\"PositionalAccuracyFromUncertainty\" selected \>",
			GetMessage("PositionalLayerObsUncertainties", "qualitat"));
	cdns.push("<option value=\"LogicalConsistencyFromThematicAttributes\" \>",
			GetMessage("LogicalConsistencyThematicAttr", "qualitat"));
	/*cdns.push("<option value=\"ThematicAccuracyGroundTruth\" \>",
			DonaCadenaLang({"cat":"Exactitud temàtica comparant amb la veritat terreny",
				   "spa":"Exactitud temática comparando con la verdad terreno",
				   "eng":"Thematic accuracy comparing with the ground truth",
				   "fre": "Exactitude thématique par rapport à la vérité du terrain"}));*/
	cdns.push("<option value=\"TemporalValidityOfObservationData\" \>",
			GetMessage("TemporalValidityObsDate", "qualitat"));
	cdns.push("<option value=\"BBoxPositionalValidity\" \>",
			GetMessage("ValidityPositionsObs", "qualitat"), " (", GetMessage("byBoundingBox"), ")");
	cdns.push("</select></fieldset>");
	cdns.push("<br/><div id=\"LayerParamEvalQual\" class=\"Verdana11px\">",DonaCadenaCampsPositionalAccuracyFromUncertainty(capa),"</div>");
	cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",
			  GetMessage("Compute"),
			  "\" onClick='CalculaIAfegeixQualitatACapa(form,",i_capa,",",i_estil,");' />",
			  "<input type=\"button\" class=\"Verdana11px\" value=\"",
			  GetMessage("Cancel"),
			  "\" onClick='TancaFinestraLayer(\"calculaQualitat\");' />");

	cdns.push("</div></form>");
	return cdns.join("");
}

function FinestraCalculaQualitatCapa(elem, i_capa, i_estil)
{
	contentLayer(elem, DonaCadenaCalculaQualitatCapa(i_capa, i_estil));
}
