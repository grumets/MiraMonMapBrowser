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

    Copyright 2001, 2020 Xavier Pons

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
var LListaCapesGraphsMM=[];
var GraphsMM={hihaElements:false};
var IdNodeGraphsMM=0;

function EsborraGrafLlinatge()
{
	GraphsMM.nodes=null;
	GraphsMM.sortedNodId=null;
	if(GraphsMM.nodesGraf)
		GraphsMM.nodesGraf.clear();
    if(GraphsMM.edgesGraf)
		GraphsMM.edgesGraf.clear();
	if(GraphsMM.lineageNetWork)
		GraphsMM.lineageNetWork.setData({nodes:GraphsMM.nodesGraf, edges:GraphsMM.edgesGraf})
	GraphsMM.hihaElements=false;
	IdNodeGraphsMM=0;
	ListaCapesGraphsMM=[];
}

function ComparaEdgesLlinatge(a, b)
{
	if (a.label < b.label) return -1; 
	if (a.label > b.label) return 1;
	if (a.from < b.from) return -1; 
	if (a.from > b.from) return 1;
	if (a.to < b.to) return -1; 
	if (a.to > b.to) return 1;
	return 0;
}

function ComparaNodesLlinatge(a, b)
{	
	// Ordeno per group i dins de cada group per alguna cosa diferencial.
	if (a.group < b.group) return -1; 
	if (a.group > b.group) return 1;
	if(a.group=="resultat")  // Potser hauria de comparar també els resultats amb les fonts, perquè potser que el propi resultat sigui la font d'alguna cosa ·$·
	{
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return 0;
	}
	if(a.group=="font")
	{
		if (a.source.reference < b.source.reference) return -1;
		if (a.source.reference > b.source.reference) return 1;
		return 0;
	}
	/*By definition a process is always different from another because they were executed in different times. 
	The only exception is a process that generates 2 outputs at the same time.*/
	if(a.group=="proces")
	{
		if (DonaCadena(a.proces.purpose) < DonaCadena(b.proces.purpose)) return -1; 
		if (DonaCadena(a.proces.purpose) > DonaCadena(b.proces.purpose)) return 1;
		if (a.proces.timeDate < b.proces.timeDate) return -1; 
		if (a.proces.timeDate > b.proces.timeDate) return 1;
		return 0;
	}
	if(a.group=="agent")
	{
		/*I believe the role should always be processor, so I decided to ignore it
		if (DonaCadena(a.processor.role) < DonaCadena(b.processor.role)) return -1; 
		if (DonaCadena(a.processor.role) > DonaCadena(b.processor.role)) return 1;*/
		if (!a.processor.party && b.processor.party) return -1;
		if (a.processor.party && !b.processor.party) return 1;
		if (a.processor.party && b.processor.party)
		{
			if (!a.processor.party.organisation && b.processor.party.organisation) return -1;
			if (a.processor.party.organisation && !b.processor.party.organisation) return 1;
			if (a.processor.party.organisation && b.processor.party.organisation)
			{
				if (a.processor.party.organisation.name < b.processor.party.organisation.name) return -1;
				if (a.processor.party.organisation.name > b.processor.party.organisation.name) return 1;
			}
			if (!a.processor.party.individual && b.processor.party.individual) return -1;
			if (a.processor.party.individual && !b.processor.party.individual) return 1;
			if (a.processor.party.individual && b.processor.party.individual)
			{
				if (a.processor.party.individual.name < b.processor.party.individual.name) return -1;
				if (a.processor.party.individual.name > b.processor.party.individual.name) return 1;
			}
		}
		return 0;
	}
	if(a.group=="executable")
	{
		if (!a.executable.reference && b.executable.reference) return -1;
		if (a.executable.reference && !b.executable.reference) return 1;
		if (a.executable.reference < b.executable.reference) return -1;
		if (a.executable.reference > b.executable.reference) return 1;
		if (!a.executable.compilationDate && b.executable.compilationDate) return -1;
		if (a.executable.compilationDate && !b.executable.compilationDate) return 1;
		if (a.executable.compilationDate < b.executable.compilationDate) return -1;
		if (a.executable.compilationDate > b.executable.compilationDate) return 1;
		//	node.executable.algorithm);
		//	node.executable.functionanlity);
		return 0;
	}
	return 0; 
}

function GetPartyName(party)
{
	if (!party)
		return "";
	return ((party.organisation && party.organisation.name) ? party.organisation.name : "") + 
		((party.individual && party.individual.name) ? party.individual.name : "");
}

function CreaGrafProcesLlinatge(info_graf, proces, id_pare, i_capa_llista)
{
var j, i_node, i_edge, id_proces, id_usar, exe, name, pro;

	i_node=info_graf.nodes.binarySearch({group:"proces", proces: proces}, ComparaNodesLlinatge);
	if(i_node>=0) // trobat
	{
		id_proces=info_graf.nodes[i_node].id;
	}
	else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
	{
		//id_proces=info_graf.nodes.length+1;
		id_proces=IdNodeGraphsMM;
		IdNodeGraphsMM++;		
		name=[];
	 	name.push(DonaCadenaLang({"cat": "Pas", "spa": "Paso", "eng": "Step", "fre": "Étape"}), " ", LListaCapesGraphsMM[i_capa_llista].nSteps);
		LListaCapesGraphsMM[i_capa_llista].nSteps++;
		if(proces.executable && proces.executable.reference)
			name.push(": ",  TreuExtensio(TreuAdreca(proces.executable.reference)));
		if(proces.timeDate)
		{
			var data_temp=new Date(proces.timeDate);
			//OmpleDataJSONAPartirDeDataISO8601(data_temp, proces.timeDate);
			if(proces.executable && proces.executable.reference)
				name.push("_");
			else
				name.push(": ");
			name.push(DonaDateComATextISO8601(data_temp,{DataMostraAny: true, DataMostraMes: true, DataMostraDia: true, DataMostraHora: true, DataMostraMinut: true}));
		}
		info_graf.nodes.splice(-i_node-1, 0, {id:id_proces, 
					label: name.join(""),
					title: proces.purpose, 
					group: "proces", 
					proces: proces});
	}
	i_edge=info_graf.edges.binarySearch({from: id_pare, to: id_proces, label: 'wasGeneratedBy'}, ComparaEdgesLlinatge);
	if(i_edge<0) // no trobat
	{
		info_graf.edges.splice(-i_edge-1, 0, {from: id_pare, to: id_proces, arrows:'to', label: 'wasGeneratedBy', font: {align: 'top', size: 10}});
	}			
	if(proces.processor)
	{
		for(j=0; j<proces.processor.length;j++)
		{
			pro=proces.processor[j];
			name=GetPartyName(pro.party);
			if (name!="")
			{
				i_node=info_graf.nodes.binarySearch({group:"agent", processor: pro}, ComparaNodesLlinatge);
				if(i_node>=0) // trobat
				{
					id_usar=info_graf.nodes[i_node].id;
				}
				else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
				{
					//id_usar=info_graf.nodes.length+1;
					id_usar=IdNodeGraphsMM;
					IdNodeGraphsMM++;		
					info_graf.nodes.splice(-i_node-1, 0, {id:id_usar, 
									label: name.indexOf(' ')==-1 ? name : name.substring(0, name.indexOf(' ')), 
									title: (DonaCadena(pro.role) ? (DonaCadena(pro.role)+": ") : "" ) + name, 
									group: "agent", 
									processor: pro});
				}			
				// els segments també he de fer una cerca i inserció ordenada perquè també hi podria haver repeticions
				i_edge=info_graf.edges.binarySearch({from: id_proces, to: id_usar, label: 'wasAssociatedWith'}, ComparaEdgesLlinatge);
				if(i_edge<0) // no trobat
				{
					info_graf.edges.splice(-i_edge-1, 0, {from: id_proces, to: id_usar, arrows:'to', label: 'wasAssociatedWith', font: {align: 'top', size: 10}});
				}
			}
		}
	}
	if(proces.executable)
	{
		exe=proces.executable;
		i_node=info_graf.nodes.binarySearch({group:"executable", executable: exe}, ComparaNodesLlinatge);
		if(i_node>=0) // trobat
		{
			id_usar=info_graf.nodes[i_node].id;
		}
		else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
		{			
			//id_usar=info_graf.nodes.length+1;
			id_usar=IdNodeGraphsMM;
			IdNodeGraphsMM++;		
			info_graf.nodes.splice(-i_node-1, 0, {id:id_usar, 
						label: TreuAdreca(exe.reference), 
						title: exe.reference, 
						group: "executable", 
						executable: exe});
		}
		i_edge=info_graf.edges.binarySearch({from: id_proces, to: id_usar, label: 'used'}, ComparaEdgesLlinatge);
		if(i_edge<0) // no trobat
		{
			info_graf.edges.splice(-i_edge-1, 0, {from: id_proces, to: id_usar, arrows:'to', label: 'executed', font: {align: 'top', size: 10}});					
		}
	}
	if(proces.parameters)
	{
		for(j=0; j<proces.parameters.length;j++)
		{
			if(proces.parameters[j].valueType=="source" && typeof proces.parameters[j].source!=="undefined" && proces.parameters[j].source!=null)
				CreaGrafFontLlinatge(info_graf, proces.parameters[j].direction, proces.parameters[j].source, id_proces, i_capa_llista);
		}				
	}	
	return;
}

function CreaGrafFontLlinatge(info_graf, direction, source, id_pare, i_capa_llista)
{
var id_font, i_node, i_edge, j;
 
	i_node=info_graf.nodes.binarySearch({group:"font", source: source}, ComparaNodesLlinatge);
	if(i_node>=0) // trobat
	{
		id_font=info_graf.nodes[i_node].id;
	}
	else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
	{
		//id_font=info_graf.nodes.length+1;
		id_font=IdNodeGraphsMM;
		IdNodeGraphsMM++;		
		info_graf.nodes.splice(-i_node-1, 0, {id:id_font, 
					label: TreuAdreca(source.reference),  //"font"+id_font, 
					title: source.reference, 
					group: "font", 
					source: source});
	}
	if(direction=="in")
	{
		i_edge=info_graf.edges.binarySearch({from: id_pare, to:id_font, label: 'used'}, ComparaEdgesLlinatge);
		if(i_edge<0) // no trobat
		{
			info_graf.edges.splice(-i_edge-1, 0, {from: id_pare, to: id_font, arrows:'to', label: 'used', font: {align: 'top', size: 10}});					
		}
	}
	else
	{
		i_edge=info_graf.edges.binarySearch({from: id_font, to:id_pare, label: 'wasGeneratedBy'}, ComparaEdgesLlinatge);
		if(i_edge<0) // no trobat
		{
			info_graf.edges.splice(-i_edge-1, 0, {from: id_font, to: id_pare, arrows:'to', label: 'wasGeneratedBy', font: {align: 'top', size: 10}});					
		}	
	}
	if (source.processes && source.processes.length>0)
	{
		for(var i=source.processes.length-1; i>=0; i--)
		//for(var i=0; i<source.processes.length; i++)
			CreaGrafProcesLlinatge(info_graf, source.processes[i], id_font, i_capa_llista);
	}
	return;
}

function sortSortedNodId(a, b)
{
	return ((a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0));
}

function findSortedNodId(id, b)
{
	return ((id < b.id) ? -1 : ((id > b.id) ? 1 : 0));
}

function FesLlistaOrdenaNodesPerId(graphsMM)
{
	if(graphsMM.nodes)
	{
		graphsMM.sortedNodId=[];
		for (var i=0; i<graphsMM.nodes.length; i++)
			graphsMM.sortedNodId[i]={id: graphsMM.nodes[i].id, i: i};
		graphsMM.sortedNodId.sort(sortSortedNodId);
	}
}

function INodFromNetworkId(graphsMM, id)
{
	var i=graphsMM.sortedNodId.binarySearch(id,findSortedNodId);
	if (i<0 || i>graphsMM.sortedNodId.length)
		return -1;
	return graphsMM.sortedNodId[i].i;
}

function DonaInformacioAssociadaANodeLlinatge(params)
{
var cdns=[], node;	
     // a params rebo un array dels id dels nodes seleccionats 
	 // i a partir de la llista ordenada i d'equivalents entre id i i trobo el node/s dels quals vull la informació0
	for (var i_nod=0; i_nod<params.nodes.length; i_nod++)
	{
		node=GraphsMM.nodes[INodFromNetworkId(GraphsMM, params.nodes[i_nod])];
		if(node.group=="resultat")
		{
			cdns.push(DonaCadenaLang({"cat": "Capa Resultat", "spa": "Capa Resultado", "eng": "Resulting dataset", "fre": "Jeu de données résultant"}), ": ", node.capa.nom);
		}
		else if(node.group=="font")
		{
			cdns.push(DonaCadenaLang({"cat":"Font", "spa":"Fuente", "eng":"Source", "fre":"Source"}),": ", node.source.reference);
		}
		else if(node.group=="proces")
		{
			cdns.push(DonaCadenaLang({"cat":"Procés", "spa":"Proceso", "eng":"Process", "fre":"Processus"}),": ", DonaCadena(node.proces.purpose));
		}
		else if(node.group=="agent")
		{
			if(DonaCadena(node.processor.role))
				cdns.push(DonaCadena(node.processor.role), ": ");
			else
				cdns.push(DonaCadenaLang({"cat":"Agent", "spa":"Agente", "eng":"Agent", "fre":"Agent"}), ": ");
			cdns.push(GetPartyName(node.processor.party));
		}
		else if(node.group=="executable")
		{
			cdns.push(DonaCadenaLang({"cat": "Executable", "spa": "Ejecutable", "eng": "Executable", "fre": "Exécutable"}), ": ", node.executable.reference);
			if (node.executable.compilationDate)
				cdns.push("<br>", DonaCadenaLang({"cat": "Data de compilació", "spa": "Fecha de compilación", "eng": "Compilation date", "fre": "Date de compilation"}), ": ", node.executable.compilationDate);
			if (node.executable.algorithm)
				cdns.push("<br>", DonaCadenaLang({"cat": "Algoritme", "spa": "Algoritmo", "eng": "Algorithm", "fre": "Algorithme"}), ": ", node.executable.algorithm);
			if (node.executable.functionanlity)
				cdns.push("<br>", DonaCadenaLang({"cat": "Funcionalitat", "spa": "Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}), ": ", DonaCadena(node.executable.functionanlity));
		}	
	}
	return cdns.join("");
}

function AfegeixCapaAGrafLlinatge(i_capa_llista)
{
var i, capa=ParamCtrl.capa[LListaCapesGraphsMM[i_capa_llista].i_capa], lli=capa.metadades.provenance.lineage;
		
	// El primer que he de posar és la capa generada, que és la que estic documentant el llinatge i tot penja d'aquesta capa.	
	var info_graf={nodes: [{id:IdNodeGraphsMM, label: capa.nom, group: "resultat", capa: capa}], edges: []};
	var id_node_pare=IdNodeGraphsMM;
	IdNodeGraphsMM++;
	
		
	// Ara miro els processos i les fonts que pengen d'aquesta capa
	// Aniré afegint els nodes de manera ordenada per nom i group	
	if(lli.processes && lli.processes.length>0)
	{
		// Faig l'ordre invers perquè quedi una numeració més intuïtiva de l'odre en que s'ha fet cada procés,
		// ja que en el llinatge està ordenat a l'inversa
		//for(i=0; i<lli.processes.length; i++)
		for(i=lli.processes.length-1; i>=0; i--)
			CreaGrafProcesLlinatge(info_graf, lli.processes[i], id_node_pare, i_capa_llista);
	}	
	if(lli.sources)
	{
		for(i=0; i<lli.sources.length; i++)
			CreaGrafFontLlinatge(info_graf, "in", lli.sources[i], id_node_pare, i_capa_llista);	
	}
	if(info_graf.nodes)
	{
		GraphsMM.nodesGraf.add(info_graf.nodes);	
		if(!GraphsMM.nodes)
			GraphsMM.nodes=[];
		GraphsMM.nodes.push(info_graf.nodes);	
	}
	if(info_graf.edges)
		GraphsMM.edgesGraf.add(info_graf.edges);
}

function CreaGrafLlinatge(nom_div)
{
var i, cdns=[];

	cdns.push("<center><table border=0 width=95%><tr><td><font size=1><a href=\"javascript:void(0);\" onClick=\"EsborraGrafLlinatge();\">", 
				DonaCadenaLang({"cat":"Esborra-ho tot", "spa":"Borrar todo", "eng":"Delete all","fre":"Tout effacer"}),"</a><br>");
	
	GraphsMM.nodesGraf = new vis.DataSet({});
	GraphsMM.edgesGraf = new vis.DataSet({});
			
	for(i=0; i<LListaCapesGraphsMM.length; i++)
		AfegeixCapaAGrafLlinatge(i);	
		
	GraphsMM.options = { 
		"interaction": { "navigationButtons": true, "keyboard": true},
		"layout": {"improvedLayout": false},
		"nodes": {"shape": "box", "borderWidth": 2, "shadow":true},
		"edges": {"font": {"align": "top", "size": 10}},
		"groups": {
			"font": {"shape": "ellipse","color": {"background":"LightYellow", "border":"GoldenRod"}},
			"executable": {"shape": "ellipse","color": {"background":"DarkSeaGreen", "border":"ForestGreen"}},
			"proces": {"shape":"box","color":{"background":"LightSteelBlue", "border":"purple"}},
			"resultat": {"shape": "ellipse","color": {"background":"Yellow","border":"GoldenRod"}, "borderWidth": 3},
			"agent": {"shape":"circle","color":{"background":"DarkSalmon","border":"Bisque"}},
	        }
	};
	GraphsMM.div=nom_div;	
	GraphsMM.lineageNetWork = new vis.Network(document.getElementById(nom_div), {nodes: GraphsMM.nodesGraf, edges: GraphsMM.edgesGraf},  GraphsMM.options);
	GraphsMM.lineageNetWork.on("click", function (params) {document.getElementById("InfoLlinatge").innerHTML = DonaInformacioAssociadaANodeLlinatge(params)});
	// GraphsMM.darrerIdUsat=info_graf.nodes.length;
	GraphsMM.hihaElements=true;
	FesLlistaOrdenaNodesPerId(GraphsMM);
}

function OmpleLlinatgeCapa(doc,info_lli)
{
var capa, records;

	if(!doc) 
	{
		CanviaEstatEventConsola(null, info_lli.i_event, EstarEventError);
		return;
	}
	capa=ParamCtrl.capa[info_lli.i_capa];
	try {
		var doc_json=JSON.parse(doc);
		records=doc_json.records;
	} 
	catch (e) {
		CanviaEstatEventConsola(null, info_lli.i_event, EstarEventError);
		return;
	}
	if(records && records.length>0)
	{
		if(records[0].lineage)
		{
			if (!capa.metadades.provenance)
				capa.metadades.provenance={"lineage": records[0].lineage};
			else
				capa.metadades.provenance.lineage=records[0].lineage;			
		}
	}
	CanviaEstatEventConsola(null, info_lli.i_event, EstarEventTotBe);
	if(info_lli.funcio)
		info_lli.funcio(info_lli.param);
	return;
}

function ErrorOmpleLlinatgeCapa(doc,info_lli)
{
	CanviaEstatEventConsola(null, info_lli.i_event, EstarEventError);
}

function DonaRequestCSWGetRecordByIdPerLlinatge(i_capa)
{
var cdns=[];
var capa=ParamCtrl.capa[i_capa];

	// ·$· Cal resoldre el tema del EPSG al servidor, ara per ara no es fa res en el servidor i es busca directament la secció que conté
	// el valor indicat per ID [capa.nom, ":", ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS] i si no existeix falla	// caldria fer alguna heurística com en el cas del WMS
	cdns.push("SERVICE=CSW&REQUEST=GetRecordByID&OUTPUTSCHEMA=http://www.isotc211.org/2005/gmd&ELEMENTSETNAME=lineage&ID=", 
			  capa.nom, ":", 
			  ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, "&OUTPUTFORMAT=application/json");
	return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), true, DonaCorsServidorCapa(cors));
}

function DescarregaLlinatgeCapa(i_capa, funcio, param)
{
	var url=DonaRequestCSWGetRecordByIdPerLlinatge(i_capa);
	var i_event=CreaIOmpleEventConsola("GetRecordById", i_capa, url, TipusEventGetRecordByIdLlinatge);
	
	loadFile(url, "application/json", OmpleLlinatgeCapa, ErrorOmpleLlinatgeCapa, {i_capa: i_capa, i_event: i_event, funcio: funcio, param: param});
}


// Funcions que permeten que hi hagi més d'una capa a la mateixa finestra on es mostren els grafs del llinatge
function MostraLlinatge(param)
{	
	if(GraphsMM.hihaElements)
	{
		AfegeixCapaAGrafLlinatge("LayerLlinatgeCapa", param.i_capa);
	}
	else
	{
		contentLayer(param.elem, "<div id=\"LayerLlinatgeCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;width:500px;height:500px;border: 1px solid lightgray;\"></div><br><div id=\"InfoLlinatge\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:520px;width:500px;height:50px;border: 1px solid lightgray;\"></div>");
		CreaGrafLlinatge("LayerLlinatgeCapa");
	}
}

function sortLListaCapesGraphsMM(a,b) 
{
	if(a.i_capa < b.i_capa)
		return -1;
	if(a.i_capa > b.i_capa)
		return 1;

	if(a.nSteps< b.nSteps)
		return -1;
	if(a.nSteps > b.nSteps)
		return 1;
	return 0;
}

function findLListaCapesGraphsMMIdCapa(i_capa, b)
{
	return ((i_capa< b.i_capa) ? -1 : ((i_capa> b.i_capa) ? 1 : 0));
}


function AfegeixCapaALlistaCapesGrafLLinatge(param)
{
	LListaCapesGraphsMM.push({i_capa: param.i_capa, nSteps: 0});
	LListaCapesGraphsMM.sort(sortLListaCapesGraphsMM);
	LListaCapesGraphsMM.removeDuplicates(sortLListaCapesGraphsMM);
	MostraLlinatge(param);
}

function FinestraMostraLlinatgeCapa(elem, i_capa)
{
var capa=ParamCtrl.capa[i_capa];

	if(!capa.metadades || !capa.metadades.provenance)
	{
		MostraLlinatge({elem: elem, i_capa: -1});
		return;
	}
		
	var prov=capa.metadades.provenance;
	if(prov.peticioServCSW && !prov.lineage)
	{
		// Demano el llinatge al servidor i el carrego a memòria
		DescarregaLlinatgeCapa(i_capa, AfegeixCapaALlistaCapesGrafLLinatge, {elem: elem, i_capa: i_capa});
		return;
	}
	if(prov.lineage)
		AfegeixCapaALlistaCapesGrafLLinatge({elem: elem, i_capa: i_capa});
	else
		MostraLlinatge({elem: elem, i_capa: -1});
	return;
}