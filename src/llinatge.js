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
var LListaCapesGraphsMM=[];
var GraphsMM={hihaElements:false, elemVisibles: {agents:true, fontsFulles: true, fontsIntermitges: true, passos: true, eines: true, algorismes: true, funcions: true, conjunts: {union:true, nonUnion:false, intersection:false, complement: false, substraction: false}}};
var IdNodeGraphsMM=0;


function EsborraGrafLlinatge()
{
	GraphsMM.nodes=null;
	GraphsMM.edges=null;
	GraphsMM.sortedNodId=null;
	if(GraphsMM.nodesGraf)
		GraphsMM.nodesGraf.clear();
    if(GraphsMM.edgesGraf)
		GraphsMM.edgesGraf.clear();
	if(GraphsMM.lineageNetWork)
		GraphsMM.lineageNetWork.setData({nodes:GraphsMM.nodesGraf, edges:GraphsMM.edgesGraf})
	GraphsMM.hihaElements=false;
	IdNodeGraphsMM=0;
	
	for(var i=0; i<LListaCapesGraphsMM.length; i++)
		LListaCapesGraphsMM[i].nSteps=0;
}

function EsborraGrafLlinatgeICapes()
{
	EsborraGrafLlinatge();
	LListaCapesGraphsMM=[];	
	document.getElementById("capesLlinatge").innerHTML = DonaCadenaFormCapesALlinatge();
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
	if (a.group < b.group)
	{
		// Tracto el cas especial del resultat i la font
		if(a.group=="resultat" && b.group=="font") 
		{
			if (a.label < b.font.reference) return -1;
			if (a.label > b.font.reference) return 1;
			return 0;
		}
		if(b.group=="resultat" && a.group=="font") 
		{
			if (b.label < a.font.reference) return -1;
			if (b.label > a.font.reference) return 1;
			return 0;
		}
		return -1;
	}
	if (a.group > b.group) 
	{
		// Tracto el cas especial del resultat i la font
		if(a.group=="resultat" && b.group=="font") 
		{
			if (a.label < b.font.reference) return -1;
			if (a.label > b.font.reference) return 1;
			return 0;
		}
		if(b.group=="resultat" && a.group=="font") 
		{
			if (b.label < a.font.reference) return -1;
			if (b.label > a.font.reference) return 1;
			return 0;
		}
		return 1;
	}
	// Si són el mateix grup
	if(a.group=="resultat") 
	{
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return 0;
	}
	if(a.group=="font")
	{
		if (a.font.reference < b.font.reference) return -1;
		if (a.font.reference > b.font.reference) return 1;
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
		var resp_a=a.responsibleParty;
		var resp_b=b.responsibleParty;
		/*I believe the role should always be processor, so I decided to ignore it
		if (DonaCadena(resp_a.role) < DonaCadena(resp_b.role)) return -1; 
		if (DonaCadena(resp_a.role) > DonaCadena(resp_b.role)) return 1;*/
		if (!resp_a.party && resp_b.party) return -1;
		if (resp_a.party && !resp_b.party) return 1;
		if (resp_a.party && resp_b.party)
		{
			if (!resp_a.party.organisation && resp_b.party.organisation) return -1;
			if (resp_a.party.organisation && !resp_b.party.organisation) return 1;
			if (resp_a.party.organisation && resp_b.party.organisation)
			{
				if (resp_a.party.organisation.name < resp_b.party.organisation.name) return -1;
				if (resp_a.party.organisation.name > resp_b.party.organisation.name) return 1;
			}
			if (!resp_a.party.individual && resp_b.party.individual) return -1;
			if (resp_a.party.individual && !resp_b.party.individual) return 1;
			if (resp_a.party.individual && resp_b.party.individual)
			{
				if (resp_a.party.individual.name < resp_b.party.individual.name) return -1;
				if (resp_a.party.individual.name > resp_b.party.individual.name) return 1;
			}
		}
		return 0;
	}
	if(a.group=="executable")
	{
		if (!a.executable.reference && b.executable.reference) return -1;
		if (a.executable.reference && !b.executable.reference) return 1;
		var a_exec=TreuAdreca(a.executable.reference), b_exec=TreuAdreca(a.executable.reference);
		if (a_exec < b_exec) return -1;
		if (a_exec > b_exec) return 1;
		if (!a.executable.compilationDate && b.executable.compilationDate) return -1;
		if (a.executable.compilationDate && !b.executable.compilationDate) return 1;
		if (a.executable.compilationDate < b.executable.compilationDate) return -1;
		if (a.executable.compilationDate > b.executable.compilationDate) return 1;
		return 0;
	}
	if(a.group=="algorisme")
	{
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return 0;
	}
	if(a.group=="funcionalitat")
	{
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
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

function AfegeixNomProcessLlinatgeACadena(proces, cdns, id_grup_pare)
{
var source, j, i;	

	if(!proces.grup || !proces.grup.id || proces.grup.id=="")
		return cdns;
	if(!id_grup_pare || id_grup_pare=="" || proces.grup.id!=id_grup_pare) 
	{
		cdns.push("<br>", DonaCadenaLang({"cat":"Procés", "spa":"Proceso", "eng":"Process", "fre":"Processus"})," ");
		if(proces.executable && proces.executable.reference)	
			cdns.push(TreuExtensio(TreuAdreca(proces.executable.reference)));
		if(proces.timeDate)
		{
			var data_temp=new Date(proces.timeDate);
			//OmpleDataJSONAPartirDeDataISO8601(data_temp, proces.timeDate);
			if(proces.executable && proces.executable.reference)
				cdns.push("_");
			cdns.push(DonaDateComATextISO8601(data_temp,{DataMostraAny: true, DataMostraMes: true, DataMostraDia: true, DataMostraHora: true, DataMostraMinut: true}));			
		}
		cdns.push(": ");
		cdns.push(DonaCadena(proces.purpose));
		
		if(proces.parameters)
		{
			for(j=0; j<proces.parameters.length;j++)
			{
				if(proces.parameters[j].valueType=="source" && typeof proces.parameters[j].source!=="undefined" && proces.parameters[j].source!=null)
				{
					source=proces.parameters[j].source;
					if (source.processes && source.processes.length>0)
					{
						for(i=source.processes.length-1; i>=0; i--)			
							cdns=AfegeixNomProcessLlinatgeACadena(source.processes[i], id_grup_pare, cdns);
					}
				}
			}				
		}
	}
	return cdns;
}

function DonaInformacioAssociadaANodeLlinatge(params)
{
var cdns=[], node, i_nod;	
     // a params rebo un array dels id dels nodes seleccionats 
	 // i a partir de la llista ordenada i d'equivalents entre id i i trobo el node/s dels quals vull la informació0
	for (i_nod=0; i_nod<params.nodes.length; i_nod++)
	{
		node=GraphsMM.nodes[INodFromNetworkId(GraphsMM, params.nodes[i_nod])];
		if(node.group=="procesAgrupat")
		{
			// He de mostrar la llista de processos que formen part del mateix grup
			name.push(DonaCadenaLang({"cat": "Grup de processos", "spa": "Grupo de procesos", "eng": "Process group", "fre": "Groupe de processus"}), ": ", 
									 (DonaCadena (p.grup.desc)?DonaCadena(p.grup.desc):p.grup.id));
			if(node.proces)
			{
				cdns=AfegeixNomProcessLlinatgeACadena(node.proces, node.proces.grup.id, cdns);
			}
			else if(node.llinatge)
			{
				var i, j, p=node.llinatge;
				if(p.processes && p.processes.length>0)
				{
					for(i=p.processes.length-1; i>=0; i--)
						cdns=AfegeixNomProcessLlinatgeACadena(p.processes[i], node.llinatge.grup.id, cdns);
				}
				if(p.sources && p.sources.length>0)
				{
					for(i=p.sources.length-1; i>=0; i--)
					{
						if (p.sources[i].processes && p.sources[i].processes.length>0)
						{
							for(i=p.sources[i].processes.length-1; i>=0; i--)			
								cdns=AfegeixNomProcessLlinatgeACadena(p.sources[i].processes[i], node.llinatge.grup.id, cdns);
						}
					}
				}
			}
		}
		else if(node.group=="resultat")
		{
			cdns.push(DonaCadenaLang({"cat": "Capa Resultat", "spa": "Capa Resultado", "eng": "Resulting dataset", "fre": "Jeu de données résultant"}), ": ", DonaCadena(node.capa.desc) ? DonaCadena(node.capa.desc): node.capa.nom);
			var llinatge=node.capa.metadades.provenance.lineage;
			if(DonaCadena(llinatge.statement))
				cdns.push("<br>", DonaCadena(llinatge.statement));
		}
		else if(node.group=="font")
		{
			cdns.push(DonaCadenaLang({"cat":"Font", "spa":"Fuente", "eng":"Source", "fre":"Source"}),": ", node.font.reference);
		}
		else if(node.group=="proces")
		{
			cdns.push(DonaCadenaLang({"cat":"Procés", "spa":"Proceso", "eng":"Process", "fre":"Processus"}),": ", DonaCadena(node.proces.purpose));
		}
		else if(node.group=="agent")
		{
			if(DonaCadena(node.responsibleParty.role))
				cdns.push(DonaCadena(node.responsibleParty.role), ": ");
			else
				cdns.push(DonaCadenaLang({"cat":"Agent", "spa":"Agente", "eng":"Agent", "fre":"Agent"}), ": ");
			cdns.push(GetPartyName(node.responsibleParty.party));
		}
		else if(node.group=="executable")
		{
			cdns.push(DonaCadenaLang({"cat": "Executable", "spa": "Ejecutable", "eng": "Executable", "fre": "Exécutable"}), ": ", node.executable.reference);
			if (node.executable.compilationDate)
				cdns.push("<br>", DonaCadenaLang({"cat": "Data de compilació", "spa": "Fecha de compilación", "eng": "Compilation date", "fre": "Date de compilation"}), ": ", node.executable.compilationDate);
			if (node.executable.algorithm)
			{
				cdns.push("<br>", DonaCadenaLang({"cat": "Algorisme", "spa": "Algoritmo", "eng": "Algorithm", "fre": "Algorithme"}), ": ", DonaCadena(node.executable.algorithm.name));
				if (node.executable.algorithm.functionality)
					cdns.push("<br>", DonaCadenaLang({"cat": "Funcionalitat", "spa": "Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}), ": ", DonaCadena(node.executable.algorithm.functionality));
			}
		}	
		else if(node.group=="algorisme")
		{
			if (node.algorithm)
			{
				cdns.push("<br>", DonaCadenaLang({"cat": "Algorisme", "spa": "Algoritmo", "eng": "Algorithm", "fre": "Algorithme"}), ": ", DonaCadena(node.algorithm.name));
				if (node.algorithm.functionality)
					cdns.push("<br>", DonaCadenaLang({"cat": "Funcionalitat", "spa": "Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}), ": ", DonaCadena(node.algorithm.functionality));
			}
		}	
		else if(node.group=="funcionalitat")
		{
			if (node.functionality)
				cdns.push("<br>", DonaCadenaLang({"cat": "Funcionalitat", "spa": "Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}), ": ", DonaCadena(node.functionality));
		}	
	}
	return cdns.join("");
}

function CreaGrafOrganismeLlinatge(org, id_pare)
{
	var name=GetPartyName(org.party);
	if (!name || name=="")
		return;
	var id_usar, i_node=GraphsMM.nodes.binarySearch({group:"agent", responsibleParty: org}, ComparaNodesLlinatge);
	if(i_node>=0) // trobat
	{
		id_usar=GraphsMM.nodes[i_node].id;
	}
	else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
	{
		//id_usar=GraphsMM.nodes.length+1;
		id_usar=IdNodeGraphsMM;
		IdNodeGraphsMM++;		
		GraphsMM.nodes.splice(-i_node-1, 0, {id:id_usar, 
						label: name.indexOf(' ')==-1 ? name : name.substring(0, name.indexOf(' ')), 
						title: (DonaCadena(org.role) ? (DonaCadena(org.role)+": ") : "" ) + name, 
						group: "agent", 
						responsibleParty: org});
	}			
		// els segments també he de fer una cerca i inserció ordenada perquè també hi podria haver repeticions
	var i_edge=GraphsMM.edges.binarySearch({from: id_pare, to: id_usar, label: 'wasAssociatedWith'}, ComparaEdgesLlinatge);
	if(i_edge<0) // no trobat
		GraphsMM.edges.splice(-i_edge-1, 0, {from: id_pare, to: id_usar, arrows:'to', label: 'wasAssociatedWith', font: {align: 'top', size: 10}});
	return ;
}

function DonaLabelPerProces(proces, pas)
{
var name=[];
	if(pas!=null) // pas pot valer 0
		name.push(DonaCadenaLang({"cat": "Pas", "spa": "Paso", "eng": "Step", "fre": "Étape"}), " ", pas, ": ");
	if(proces.executable && proces.executable.reference)
		name.push(TreuExtensio(TreuAdreca(proces.executable.reference)));
	if(proces.timeDate)
	{
		var data_temp=new Date(proces.timeDate);
		if(proces.executable && proces.executable.reference)
			name.push("_");
		else
			name.push(": ");
		name.push(DonaDateComATextISO8601(data_temp,{DataMostraAny: true, DataMostraMes: true, DataMostraDia: true, DataMostraHora: true, DataMostraMinut: true}));
	}
	return name.join("");
}

function CreaGrafProcesLlinatge(in_node, id_pare, id_grup_pare, i_capa_llista)
{
var j, i_node, i_edge, id_proces, id_usar, exe, p, node_afegit=false, id_grup_nou=null;

	p=in_node.llinatge ? in_node.llinatge : in_node.proces;
	
	if(GraphsMM.elemVisibles.passos)
	{
		if(p.grup && p.grup.id && p.grup.id!="")
		{
			if(!id_grup_pare || id_grup_pare=="" || p.grup.id!=id_grup_pare) 
			{
				i_node=(-GraphsMM.nodes.length-1);
				id_proces=IdNodeGraphsMM;
				IdNodeGraphsMM++;		
				LListaCapesGraphsMM[i_capa_llista].nSteps++;  // Potser més endavant em pot servir per anar desplegant el llinatge		
				var name=[];			
				name.push(DonaCadenaLang({"cat": "Grup de processos", "spa": "Grupo de procesos", "eng": "Process group", "fre": "Groupe de processus"}), ": ", 
										 (DonaCadena (p.grup.desc)?DonaCadena(p.grup.desc):p.grup.id));
				if(in_node.llinatge)
				{
					GraphsMM.nodes.splice(-i_node-1, 0, {id:id_proces, 
							label: name.join(""),
							title: DonaCadena(p.statement)? DonaCadena(p.statement) : name.join(""), 
							group: "procesAgrupat", 
							llinatge: p});
				}
				else
				{
					GraphsMM.nodes.splice(-i_node-1, 0, {id:id_proces, 
							label: name.join(""),
							title: name.join(""), 
							group: "procesAgrupat", 
							proces: p});			
				}
				id_grup_nou=p.grup.id;
				node_afegit=true;
			}
		}
		else
		{
			i_node=GraphsMM.nodes.binarySearch({group:"proces", proces: p}, ComparaNodesLlinatge);
			if(i_node>=0) // trobat
			{
				id_proces=GraphsMM.nodes[i_node].id;
			}
			else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
			{
				//id_proces=GraphsMM.nodes.length+1;
				id_proces=IdNodeGraphsMM;
				IdNodeGraphsMM++;					
				GraphsMM.nodes.splice(-i_node-1, 0, {id:id_proces, 
							label: DonaLabelPerProces(p, LListaCapesGraphsMM[i_capa_llista].nSteps),
							title: p.purpose, 
							group: "proces", 
							proces: p});
				LListaCapesGraphsMM[i_capa_llista].nSteps++;
			}
			node_afegit=true;
		}
		if(node_afegit)
		{
			i_edge=GraphsMM.edges.binarySearch({from: id_pare, to: id_proces, label: 'wasGeneratedBy'}, ComparaEdgesLlinatge);
			if(i_edge<0) // no trobat
				GraphsMM.edges.splice(-i_edge-1, 0, {from: id_pare, to: id_proces, arrows:'to', label: 'wasGeneratedBy', font: {align: 'top', size: 10}});	
		}
		else 
			id_proces=id_pare;
	}
	else
		id_proces=id_pare;
	if(p.grup)
	{
		// He de dibuixar les fonts fulles
		if(in_node.llinatge) // no miro p, perquè vull saber si vinc de llinatge o de proces
		{			
			if(p.processes && p.processes.length>0)
			{
				for(j=p.processes.length-1; j>=0; j--)
					CreaGrafProcesLlinatge({proces: p.processes[j], nomesSiFulla: true},
										  id_proces, (id_grup_nou? id_grup_nou: id_grup_pare), i_capa_llista);
			}	
			if(p.sources)
			{
				for(j=0; j<p.sources.length; j++)
					CreaGrafFontLlinatge("in",  {font: p.sources[j], nomesSiFulla: true}, 
										  id_proces, (id_grup_nou? id_grup_nou: id_grup_pare), i_capa_llista);	
			}
		}		
		else if(in_node.proces)		
		{
			if(p.parameters)
			{
				var param;
				for(j=0; j<p.parameters.length;j++)
				{
					param=p.parameters[j];
					if(param.valueType=="source" && typeof param.source!=="undefined" && param.source!=null)
						CreaGrafFontLlinatge(param.direction, {font: param.source, nomesSiFulla: true},
										  id_proces, (id_grup_nou? id_grup_nou: id_grup_pare), i_capa_llista);	
				}				
			}
		}	
	}
	else 
	{	
		if(GraphsMM.elemVisibles.agents && p.processor)
		{
			for(j=0; j<p.processor.length;j++)
				CreaGrafOrganismeLlinatge(p.processor[j], id_proces);
		}
		if(p.executable)
		{
			exe=p.executable;
			if(GraphsMM.elemVisibles.eines)
			{
				i_node=GraphsMM.nodes.binarySearch({group:"executable", executable: exe}, ComparaNodesLlinatge);
				if(i_node>=0) // trobat
				{
					id_usar=GraphsMM.nodes[i_node].id;
				}
				else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
				{			
					//id_usar=GraphsMM.nodes.length+1;
					id_usar=IdNodeGraphsMM;
					IdNodeGraphsMM++;		
					GraphsMM.nodes.splice(-i_node-1, 0, {id:id_usar, 
								label: TreuAdreca(exe.reference), 
								title: exe.reference, 
								group: "executable", 
								executable: exe});
				}
				i_edge=GraphsMM.edges.binarySearch({from: id_proces, to: id_usar, label: 'executed'}, ComparaEdgesLlinatge);
				if(i_edge<0) // no trobat
					GraphsMM.edges.splice(-i_edge-1, 0, {from: id_proces, to: id_usar, arrows:'to', label: 'executed', font: {align: 'top', size: 10}});					
			}
			else 
				id_usar=id_proces;
			if(GraphsMM.elemVisibles.agents && exe.responsibleParty)
			{
				for(j=0; j<exe.responsibleParty.length;j++)
					CreaGrafOrganismeLlinatge(exe.responsibleParty[j], id_usar);
			}
			if(exe.algorithm)
			{
				var id_usar2;
				if(GraphsMM.elemVisibles.algorismes && DonaCadena(exe.algorithm.name))
				{
					i_node=GraphsMM.nodes.binarySearch({group:"algorisme", algorithm: exe.algorithm}, ComparaNodesLlinatge);
					
					if(i_node>=0) // trobat
					{
						id_usar2=GraphsMM.nodes[i_node].id;
					}
					else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
					{			
						//id_usar=GraphsMM.nodes.length+1;
						id_usar2=IdNodeGraphsMM;
						IdNodeGraphsMM++;		
						GraphsMM.nodes.splice(-i_node-1, 0, {id:id_usar2, 
									label: DonaCadena(exe.algorithm.name), 
									title: DonaCadena(exe.algorithm.name), 
									group: "algorisme", 
									algorithm: exe.algorithm});
					}
					i_edge=GraphsMM.edges.binarySearch({from: id_usar, to: id_usar2, label: 'implemented'}, ComparaEdgesLlinatge);
					if(i_edge<0) // no trobat
						GraphsMM.edges.splice(-i_edge-1, 0, {from: id_usar, to: id_usar2, arrows:'to', label: 'implemented', font: {align: 'top', size: 10}});
				}
				else 
					id_usar2=id_usar;
				if(GraphsMM.elemVisibles.agents && exe.algorithm.responsibleParty)
				{
					for(j=0; j<exe.algorithm.responsibleParty.length;j++)
						CreaGrafOrganismeLlinatge(exe.algorithm.responsibleParty[j], id_usar2);
				}
				if(GraphsMM.elemVisibles.funcions && DonaCadena(exe.algorithm.functionality))
				{
					i_node=GraphsMM.nodes.binarySearch({group:"funcionalitat", functionality: exe.algorithm.functionality}, ComparaNodesLlinatge);
					var id_usar3;
					if(i_node>=0) // trobat
					{
						id_usar3=GraphsMM.nodes[i_node].id;
					}
					else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
					{			
						//id_usar=GraphsMM.nodes.length+1;
						id_usar3=IdNodeGraphsMM;
						IdNodeGraphsMM++;		
						GraphsMM.nodes.splice(-i_node-1, 0, {id:id_usar3, 
									label: DonaCadena(exe.algorithm.functionality), 
									title: DonaCadena(exe.algorithm.functionality), 
									group: "funcionalitat", 
									functionality: exe.algorithm.functionality});
					}
					i_edge=GraphsMM.edges.binarySearch({from: id_usar2, to: id_usar3, label: 'gaved'}, ComparaEdgesLlinatge);
					if(i_edge<0) // no trobat
						GraphsMM.edges.splice(-i_edge-1, 0, {from: id_usar2, to: id_usar3, arrows:'to', label: 'gaved', font: {align: 'top', size: 10}});
				}
			}
		}
		if(p.parameters)
		{
			for(j=0; j<p.parameters.length;j++)
			{
				if(p.parameters[j].valueType=="source" && typeof p.parameters[j].source!=="undefined" && p.parameters[j].source!=null)
					CreaGrafFontLlinatge(p.parameters[j].direction, {font: p.parameters[j].source, nomesSiFulla: false}, id_proces, null, i_capa_llista);
			}
		}	
	}
	return;
}

function CreaGrafFontLlinatge(direction, in_node, id_pare, id_grup_pare, i_capa_llista)
{
var id_font, i_node, i_edge, i, j;

	if(in_node.nomesSiFulla)
	{
		if(in_node.font.processes && in_node.font.processes.length>0)
		{
			for(i=in_node.font.processes.length-1; i>=0; i--)
				CreaGrafProcesLlinatge({proces: in_node.font.processes[i], nomesSiFulla: in_node.nomesSiFulla}, id_pare, id_grup_pare, i_capa_llista);
		}
		return;
	}
	if(CountPropertiesOfObject(in_node.font) == 0)
	{
		// Si la font no té cap element, això és un error de definició del llinatge
		alert("There is a source without properties");
		return;
	}
	var es_fulla=(in_node.font.processes && in_node.font.processes.length>0) ? false : true;
	if((es_fulla && GraphsMM.elemVisibles.fontsFulles) || (!es_fulla && GraphsMM.elemVisibles.fontsIntermitges))
	{
		i_node=GraphsMM.nodes.binarySearch({group:"font", font: in_node.font}, ComparaNodesLlinatge);
		if(i_node>=0) // trobat
		{
			id_font=GraphsMM.nodes[i_node].id;
		}
		else // no trobat, retorna (-n-1) on n és la posició on he d'insertar l'element
		{
			//id_font=GraphsMM.nodes.length+1;
			id_font=IdNodeGraphsMM;
			IdNodeGraphsMM++;		
			GraphsMM.nodes.splice(-i_node-1, 0, {id:id_font, 
						label: TreuAdreca(in_node.font.reference),  //"font"+id_font, 
						title: in_node.font.reference, 
						group: "font", 
						font: in_node.font});
		}
		if(direction=="in")
		{
			i_edge=GraphsMM.edges.binarySearch({from: id_pare, to:id_font, label: 'used'}, ComparaEdgesLlinatge);
			if(i_edge<0) // no trobat
				GraphsMM.edges.splice(-i_edge-1, 0, {from: id_pare, to: id_font, arrows:'to', label: 'used', font: {align: 'top', size: 10}});					
		}
		else
		{
			i_edge=GraphsMM.edges.binarySearch({from: id_font, to:id_pare, label: 'wasGeneratedBy'}, ComparaEdgesLlinatge);
			if(i_edge<0) // no trobat
				GraphsMM.edges.splice(-i_edge-1, 0, {from: id_font, to: id_pare, arrows:'to', label: 'wasGeneratedBy', font: {align: 'top', size: 10}});					
		}
	}
	else 
		id_font=id_pare;
	if(GraphsMM.elemVisibles.agents && in_node.font.responsibleParty)
	{		
		for(i=0; i<in_node.font.responsibleParty.length;i++)
			CreaGrafOrganismeLlinatge(in_node.font.responsibleParty[i], id_font);		
	}
	if (in_node.font.processes && in_node.font.processes.length>0)
	{
		for(i=in_node.font.processes.length-1; i>=0; i--)
			CreaGrafProcesLlinatge({proces: in_node.font.processes[i], nomesSiFulla: false}, id_font, id_grup_pare, i_capa_llista);
	}
	return;
}

function AfegeixCapaAGrafLlinatge(i_capa_llista)
{
var i, capa=ParamCtrl.capa[LListaCapesGraphsMM[i_capa_llista].i_capa], lli=capa.metadades.provenance.lineage;
		
	// El primer que he de posar és la capa generada, que és la que estic documentant el llinatge i tot penja d'aquesta capa.	
	if(GraphsMM.nodes==null)
		GraphsMM.nodes=[];
	if(GraphsMM.edges==null)
		GraphsMM.edges=[];
	//var info_graf={nodes: [{id:IdNodeGraphsMM, label: capa.nom, group: "resultat", capa: capa}], edges: []};
	GraphsMM.nodes.push.apply(GraphsMM.nodes, [{id:IdNodeGraphsMM, label: capa.nom, group: "resultat", capa: capa}]);	
	var id_node_pare=IdNodeGraphsMM;
	IdNodeGraphsMM++;	
	
	if(lli.grup && lli.grup.id && lli.grup.id!="")
		CreaGrafProcesLlinatge({llinatge: lli, nomesSiFulla: false}, id_node_pare, null, i_capa_llista);
	else
	{
		// Ara miro els processos i les fonts que pengen d'aquesta capa
		// Aniré afegint els nodes de manera ordenada per nom i group	
		if(lli.processes && lli.processes.length>0)
		{
			// Faig l'ordre invers perquè quedi una numeració més intuïtiva de l'ordre en que s'ha fet cada procés,
			// ja que en el llinatge està ordenat a l'inversa
			//for(i=0; i<lli.processes.length; i++)
			for(i=lli.processes.length-1; i>=0; i--)
				CreaGrafProcesLlinatge({proces: lli.processes[i], nomesSiFulla: false}, id_node_pare, null, i_capa_llista);
		}	
		if(lli.sources)
		{
			for(i=0; i<lli.sources.length; i++)
				CreaGrafFontLlinatge("in",  {font: lli.sources[i], nomesSiFulla: false}, id_node_pare, null, i_capa_llista);	
		}
	}	
}

function DesagrupaUnNivellRecentNodeLlinatge (node)
{
	return;
}

function DesagrupaUnNivellAnticNodeLlinatge (node)
{
	return;
}

function AgrupaAmbSeguentNodeLlinatge (node)
{
	return;
}

function AgrupaAmbAnteriorNodeLlinatge (node)
{
	return;
}


function MostraContextMenuNodeAgrupat(event, node)
{
var cdns=[];

	// He d'afegir les opcions del menú
	cdns.push(DonaCadenaLang({"cat": "Processos", "spa": "Procesos", "eng": "Processes", "fre": "Processus"}),"<br><hr>");
	if(!node.lineage)	// Si és el llinatge, vol dir que ho tinc tot agrupat
	{
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"AgrupaAmbSeguentNodeLlinatge(", node, ");TancaContextMenuCapa();\">",
				DonaCadenaLang({"cat":"Agrupar amb el seguënt", "spa":"Agrupar con el seguiente", "eng":"Group with the following", "fre":"Grouper avec le suivant"}), "</a><br>");

		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"AgrupaAmbAnteriorNodeLlinatge(", node, ");TancaContextMenuCapa();\">",
				DonaCadenaLang({"cat":"Agrupar amb l'anterior", "spa":"Agrupar con el anterior", "eng":"Group with the previous", "fre":"Grouper avec le précédent"}), "</a><br>");
	}
	if(node.grup && node.grup.id && node.grup.id!="")	
	{ 	// Si forma part d'algun grup		
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"DesagrupaUnNivellRecentNodeLlinatge(", node, ");TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Desagrupa un nivell més recent", "spa":"Desagrupar un nivel más reciente", "eng":"Ungroup a more recent level", "fre":"Dissocier un niveau plus récent"}), "</a><br>");
	
		cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"DesagrupaUnNivellAnticNodeLlinatge(", node, ");TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Desagrupa un nivell més antic", "spa":"Desagrupar un nivel más antiguo", "eng":"Ungroup an older level", "fre":"Dissocier un niveau plus ancien"}), "</a><br>");
	}
	if (cdns.length==0)
		return false;
	cdns.splice(0, 0, "<div class=\"MenuContextualCapa\" id=\"menuContextualCapa-contingut\">",
			  "<img align=\"right\" src=\"tanca_consulta.gif\" alt=\"",
				DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" onClick=\"TancaContextMenuCapa();\">",
			   "<div class=\"llistaMenuContext\"  id=\"menuContextualCapa-text\">");
	cdns.push("</div></div>");
	MouLayerContextMenuCapa(event, cdns.join(""));
}


function MostraMenuSiCalIDonaInformacioAssociadaANodeLlinatge(params)
{
	// Segons el tipus d'element caldria mostrar algun menú contextual
	if (isLayer(window, "menuContextualCapa"))
	{
		for (var i_nod=0; i_nod<params.nodes.length; i_nod++)
		{
			var node=GraphsMM.nodes[INodFromNetworkId(GraphsMM, params.nodes[i_nod])];
			MostraContextMenuNodeAgrupat(event, node);
		}
	}
	document.getElementById("infoLlinatge").innerHTML = DonaInformacioAssociadaANodeLlinatge(params);
}

function CreaGrafLlinatge(nom_div)
{
var i, cdns=[];
	
	GraphsMM.nodesGraf = new vis.DataSet({});
	GraphsMM.edgesGraf = new vis.DataSet({});
			
	for(i=0; i<LListaCapesGraphsMM.length; i++)
	{
		if(LListaCapesGraphsMM[i].visible)
			AfegeixCapaAGrafLlinatge(i);	
	}		
	GraphsMM.nodesGraf.add(GraphsMM.nodes);	
	GraphsMM.edgesGraf.add(GraphsMM.edges);
		
	GraphsMM.options = { 
		"interaction": { "navigationButtons": true, "keyboard": true},
		"layout": {"improvedLayout": false},
		"nodes": {"shape": "box", "borderWidth": 2, "shadow":true},
		"edges": {"font": {"align": "top", "size": 10}},
		"groups": {
			"font": {"shape": "ellipse","color": {"background":"LightYellow", "border":"GoldenRod"}},			
			"resultat": {"shape": "ellipse","color": {"background":"Yellow","border":"GoldenRod"}, "borderWidth": 3},
			"proces": {"shape":"box","color":{"background":"LightSteelBlue", "border":"purple"}},
			"procesAgrupat": {"shape":"box","color":{"background":"LightSteelBlue", "border":"blue"}, "borderWidth": 3},			
			"agent": {"shape":"circle","color":{"background":"DarkSalmon","border":"Bisque"}},
			"executable": {"shape": "box","color": {"background":"DarkSeaGreen", "border":"ForestGreen"}},
			"algorisme": {"shape": "box","color": {"background":"MediumOrchid", "border":"#ff34b3"}},
			"funcionalitat": {"shape": "box","color": {"background":"#66cdaa", "border":"#458b74"}},
		}
	};
	GraphsMM.div=nom_div;	
	GraphsMM.lineageNetWork = new vis.Network(document.getElementById(nom_div), {nodes: GraphsMM.nodesGraf, edges: GraphsMM.edgesGraf},  GraphsMM.options);
	//GraphsMM.lineageNetWork.on("click", function (params) {document.getElementById("infoLlinatge").innerHTML = DonaInformacioAssociadaANodeLlinatge(params)}); 
	GraphsMM.lineageNetWork.on("click", function (params) {MostraMenuSiCalIDonaInformacioAssociadaANodeLlinatge(params)});	
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

function VisibleoNoCapaLlinatge(i_capa)
{
	var visible=eval("document.LlinatgeCapes.cll_visible_"+i_capa);
	if (!visible)
		return;
	var i_capa_llista=LListaCapesGraphsMM.binarySearch(i_capa,findLListaCapesGraphsMMIdCapa);
	if(i_capa_llista<0)
		return; // capa no trobada a la llista, això no hauria de passar	
	LListaCapesGraphsMM[i_capa_llista].visible=(visible.checked)?true :false;
	/*
	var agrupat=eval("document.LlinatgeCapes.cll_agrupat_"+i_capa);
	if(LListaCapesGraphsMM[i_capa_llista].visible)
	{		
		agrupat.disabled=false;
		agrupat.checked==LListaCapesGraphsMM[i_capa_llista].agrupada?true:false;
	}
	else
	{
		agrupat.disabled=true;
	}*/
}

/*
function AgrupadaoNoCapaLlinatge(i_capa)
{
	var agrupat=eval("document.LlinatgeCapes.cll_agrupat_"+i_capa);
	if (!agrupat)
		return;
	var i_capa_llista=LListaCapesGraphsMM.binarySearch(i_capa,findLListaCapesGraphsMMIdCapa);
	if(i_capa_llista<0)
		return; // capa no trobada a la llista, això no hauria de passar	
	LListaCapesGraphsMM[i_capa_llista].agrupada=(agrupat.checked)?true :false;
}*/

function RedibuixaFinestraLlinatge()
{
	var elem=getFinestraLayer(window, "mostraLlinatge");
	if(elem)
		OmpleFinestraLlinatge({elem: elem, i_capa: -1, redibuixat: true});
}

function DonaCadenaFormCapesALlinatge()
{
var cdns=[],capa;	

	cdns.push(	"<legend>",DonaCadenaLang({"cat":"Capes", "spa":"Capas", "eng":"Layers", "fre":"Couches"}), "</legend>");					
	for(var i=0;i<LListaCapesGraphsMM.length; i++)
	{
		capa=ParamCtrl.capa[LListaCapesGraphsMM[i].i_capa];
		cdns.push("<input name=\"cll_visible_",LListaCapesGraphsMM[i].i_capa,"\" value=\"",LListaCapesGraphsMM[i].i_capa, 
				"\" onclick='VisibleoNoCapaLlinatge(", LListaCapesGraphsMM[i].i_capa, ");' type=\"checkbox\"",
				LListaCapesGraphsMM[i].visible ? " checked" : "", "/>", 				
				"<label for=\"cll_visible_",LListaCapesGraphsMM[i].i_capa,"\">", (DonaCadena(capa.DescLlegenda)? DonaCadena(capa.DescLlegenda): capa.nom), "</label>",
				//"<input name=\"cll_agrupat_",LListaCapesGraphsMM[i].i_capa,"\" value=\"",LListaCapesGraphsMM[i].i_capa, 				
				//"\" onclick='AgrupadaoNoCapaLlinatge(", LListaCapesGraphsMM[i].i_capa, ");' type=\"checkbox\"",
				//(LListaCapesGraphsMM[i].visible && LListaCapesGraphsMM[i].agrupada) ? " checked" : "", 
				//LListaCapesGraphsMM[i].visible ? "" : "disabled", "/>", 				
				//"<label for=\"cll_agrupat_",LListaCapesGraphsMM[i].i_capa,"\">", DonaCadenaLang({"cat":"Vista agrupada", "spa":"Vista agrupada", "eng":"Group view", "fre": "Vue groupée"}), "</label>",
				"<br>");
	}	
	if(LListaCapesGraphsMM.length>0)
		cdns.push("<font size=1><a href=\"javascript:void(0);\" onClick=\"EsborraGrafLlinatgeICapes();\">",DonaCadenaLang({"cat":"Esborra-ho tot", "spa":"Borrar todo", "eng":"Delete all","fre":"Tout effacer"}),"</a></font>");
	return cdns.join("");
}

function ActualitzaValorConjuntsVisiblesALlinatge()
{
	if(document.LlinatgeCapes.cLl_conjunts.value=="nonUnion")
	{
		GraphsMM.elemVisibles.conjunts.union=false;
		GraphsMM.elemVisibles.conjunts.nonUnion=true;		
		GraphsMM.elemVisibles.conjunts.intersection=false;
		GraphsMM.elemVisibles.conjunts.complement=false;
		GraphsMM.elemVisibles.conjunts.substraction=false;
	}
	else if(document.LlinatgeCapes.cLl_conjunts.value=="intersection")
	{
		GraphsMM.elemVisibles.conjunts.union=false;
		GraphsMM.elemVisibles.conjunts.nonUnion=false;		
		GraphsMM.elemVisibles.conjunts.intersection=true;
		GraphsMM.elemVisibles.conjunts.complement=false;
		GraphsMM.elemVisibles.conjunts.substraction=false;
	}
	else if(document.LlinatgeCapes.cLl_conjunts.value=="complement")
	{
		GraphsMM.elemVisibles.conjunts.union=false;
		GraphsMM.elemVisibles.conjunts.nonUnion=false;		
		GraphsMM.elemVisibles.conjunts.intersection=false;
		GraphsMM.elemVisibles.conjunts.complement=true;
		GraphsMM.elemVisibles.conjunts.substraction=false;
	}
	else if(document.LlinatgeCapes.cLl_conjunts.value=="substraction")
	{
		GraphsMM.elemVisibles.conjunts.union=false;
		GraphsMM.elemVisibles.conjunts.nonUnion=false;		
		GraphsMM.elemVisibles.conjunts.intersection=false;
		GraphsMM.elemVisibles.conjunts.complement=false;
		GraphsMM.elemVisibles.conjunts.substraction=true;
	}	
	else//if(document.LlinatgeCapes.cLl_conjunts.value=="union")
	{
		GraphsMM.elemVisibles.conjunts.union=true;
		GraphsMM.elemVisibles.conjunts.nonUnion=false;		
		GraphsMM.elemVisibles.conjunts.intersection=false;
		GraphsMM.elemVisibles.conjunts.complement=false;
		GraphsMM.elemVisibles.conjunts.substraction=false;
	}
}
	
function DonaCadenaFormElementsVisiblesALlinatge()
{
var cdns=[];	
	cdns.push("<legend>",DonaCadenaLang({"cat":"Elements visibles", "spa":"Elementos visibles", "eng":"Visible elements", "fre":"Éléments visibles"}), "</legend>", 
		" <input name=\"eLl_fontsIntermitges\" onclick='GraphsMM.elemVisibles.fontsIntermitges=(document.LlinatgeCapes.eLl_fontsIntermitges.checked)?true:false;' type=\"checkbox\"", GraphsMM.elemVisibles.fontsIntermitges ? " checked" : "", "/>",
		" <label for=\"eLl_fontsIntermitges\">", DonaCadenaLang({"cat":"Fonts intermitges/temporals", "spa":"Fuentes intermedias/temporales", "eng":"Internal/temporary sources", "fre":"Sources intermédiaires / temporaires"}), "</label>",
		" <input name=\"eLl_fontsFulles\" onclick='GraphsMM.elemVisibles.fontsFulles=(document.LlinatgeCapes.eLl_fontsFulles.checked)?true:false;' type=\"checkbox\"", GraphsMM.elemVisibles.fontsFulles ? " checked" : "", "/>",
		" <label for=\"eLl_fontsFulles\">", DonaCadenaLang({"cat":"Fonts fulles", "spa":"Fuentes hoja", "eng":"Leaf sources", "fre":"Sources feuilles"}), "</label>",
		" <input name=\"eLl_agents\" onclick='GraphsMM.elemVisibles.agents=(document.LlinatgeCapes.eLl_agents.checked)?true:false;' type=\"checkbox\"", GraphsMM.elemVisibles.agents ? " checked" : "", "/>",
		" <label for=\"eLl_agents\">", DonaCadenaLang({"cat":"Agents", "spa":"Agentes", "eng":"Agents", "fre":"Agents"}), "</label><br>",
		" <input name=\"eLl_passos\" onclick='GraphsMM.elemVisibles.passos=(document.LlinatgeCapes.eLl_passos.checked)?true:false;' type=\"checkbox\"", GraphsMM.elemVisibles.passos ? " checked" : "", "/>",
		" <label for=\"eLl_passos\">", DonaCadenaLang({"cat":"Passos del procés", "spa":"Pasos del proceso", "eng":"Process steps", "fre":"Étapes du processus"}), "</label>",
		" <input name=\"eLl_eines\" onclick='GraphsMM.elemVisibles.eines=(document.LlinatgeCapes.eLl_eines.checked)?true:false;' type=\"checkbox\"", GraphsMM.elemVisibles.eines ? " checked" : "", "/>",
		" <label for=\"eLl_eines\">", DonaCadenaLang({"cat":"Eines de processament", "spa":"Herramientas de procesamiento", "eng":"Processing tools", "fre":"Outils de traitement"}), "</label>",
		" <input name=\"eLl_algorismes\" onclick='GraphsMM.elemVisibles.algorismes=(document.LlinatgeCapes.eLl_algorismes.checked)?true:false;' type=\"checkbox\"", GraphsMM.elemVisibles.algorismes? " checked" : "", "/>",
		" <label for=\"eLl_algorismes\">", DonaCadenaLang({"cat": "Algorismes", "spa": "Algoritmos", "eng": "Algorithms", "fre": "Algorithmes"}), "</label>",
		" <input name=\"eLl_funcions\" onclick='GraphsMM.elemVisibles.funcions=(document.LlinatgeCapes.eLl_funcions.checked)?true:false;' type=\"checkbox\"", GraphsMM.elemVisibles.funcions ? " checked" : "", "/>",
		" <label for=\"eLl_funcions\">", DonaCadenaLang({"cat": "Funcionalitats", "spa": "Funcionalidades", "eng": "Functionalities", "fre": "Fonctionnalités"}), "</label>");
	
	if(LListaCapesGraphsMM.length>1)
	{
		cdns.push("<fieldset id=\"conjuntsLlinatge\">",
			"<legend>",DonaCadenaLang({"cat":"Quan hi ha més d'una capa, mostrar:", "spa":"Cuando hay más de una capa, mostrar:", "eng":"When more than one dataset, show:", "fre":"Quand il y a plus d'une couche, affichage:"}), "</legend>", 
			" <input name=\"cLl_conjunts\" value=\"union\" onclick='ActualitzaValorConjuntsVisiblesALlinatge()' type=\"radio\"", GraphsMM.elemVisibles.conjunts.union ? " checked" : "", "/>",
			" <label for=\"union\">", DonaCadenaLang({"cat":"La unió", "spa":"La unión", "eng":"The union", "fre":"L'union"}), "</label>",
			" <input name=\"cLl_conjunts\" value=\"nonUnion\" onclick='ActualitzaValorConjuntsVisiblesALlinatge()' type=\"radio\"", GraphsMM.elemVisibles.conjunts.nonUnion ? " checked" : "", "/>",
			" <label for=\"nonUnion\">", DonaCadenaLang({"cat":"Cada capa en un gràfic independent", "spa":"Cada capa en un gráfico independiente", "eng":"Datasets as independents graphs", "fre":"Chaque couche sur un graphique séparé"}), "</label><br>",
			" <input name=\"cLl_conjunts\" value=\"intersection\" onclick='ActualitzaValorConjuntsVisiblesALlinatge()' type=\"radio\"", GraphsMM.elemVisibles.conjunts.intersection ? " checked" : "", "/>",
			" <label for=\"intersection\">", DonaCadenaLang({"cat":"La intersecció", "spa":"La intersección", "eng":"The intersection", "fre":"l'intersection"}), "</label>",
			" <input name=\"cLl_conjunts\" value=\"complement\" onclick='ActualitzaValorConjuntsVisiblesALlinatge()' type=\"radio\"", GraphsMM.elemVisibles.conjunts.complement ? " checked" : "", "/>",
			" <label for=\"complement\">", DonaCadenaLang({"cat":"El complement de la intersecció", "spa":"El complemento de la intersección", "eng":"The complement of the intersection", "fre":"Le complément de l'intersection"}), "</label>",
			" <input name=\"cLl_conjunts\" value=\"substraction\" onclick='ActualitzaValorConjuntsVisiblesALlinatge()' type=\"radio\"", GraphsMM.elemVisibles.conjunts.substraction ? " checked" : "", "/>",
			" <label for=\"substraction\">", DonaCadenaLang({"cat":"La resta de la primera", "spa":"La resta del primero", "eng":"The substraction of the first", "fre":"La soustraction de la première"}), "</label>",
			"</fieldset>");
	}
	return cdns.join("");
}

function AfegeixNodeALlistaNodesPerQuery(node, llista_nodes)
{
var valor=[], i, p;
	if(node.capa)
	{
		valor.push(DonaCadenaLang({"cat":"Font", "spa":"Fuente", "eng":"Source", "fre":"Source"}), ": ", DonaCadena(node.capa.desc) ? DonaCadena(node.capa.desc): node.capa.nom);
		llista_nodes.push({tipus: "font", etiqueta: valor.join("")});
		p=node.capa.metadades.provenance.lineage.processes;
		if(p)
		{
			for(i=0; i<p.length; i++)
				AfegeixNodeALlistaNodesPerQuery({process: p[i]}, llista_nodes);
		}
		p=node.capa.metadades.provenance.lineage.sources;
		if(p)
		{
			for(i=0; i<p.length; i++)
				AfegeixNodeALlistaNodesPerQuery({source: p[i]}, llista_nodes);
		}
		// ·$· Falta afegir l'agent de l'atribució
		return llista_nodes;
	}
	if(node.process)
	{
		valor.push(DonaCadenaLang({"cat":"Procés", "spa":"Proceso", "eng":"Process", "fre":"Processus"}),": ", DonaLabelPerProces(node.process, null));
		llista_nodes.push({tipus: "proces", etiqueta: valor.join("")});
		p=node.process.processor;
		if(p)
		{
			for(i=0; i<p.length; i++)
				AfegeixNodeALlistaNodesPerQuery({reponsibleParty: p[i]}, llista_nodes);
		}
		if(node.process.executable)
			AfegeixNodeALlistaNodesPerQuery({exe: node.process.executable}, llista_nodes);
		p=node.process.parameters;
		if(p)
		{
			for(i=0; i<p.length; i++)
				if(p[i].valueType=="source" && typeof p[i].source!=="undefined" && p[i].source!=null)
					AfegeixNodeALlistaNodesPerQuery({source: p[i].source}, llista_nodes);			
		}
		return llista_nodes;
	}
	if(node.source && CountPropertiesOfObject(node.source)>0 && node.source.reference)
	{
		valor.push(DonaCadenaLang({"cat":"Font", "spa":"Fuente", "eng":"Source", "fre":"Source"}), ": ", TreuAdreca(node.source.reference));
		llista_nodes.push({tipus: "font", etiqueta: valor.join("")});
		p=node.source.responsibleParty;
		if(p)		
		{		
			for(i=0; i<p.length;i++)
				AfegeixNodeALlistaNodesPerQuery({reponsibleParty: p[i]}, llista_nodes);		
		}
		p=node.source.processes;
		if(p)		
		{		
			for(i=0; i<p.length;i++)
				AfegeixNodeALlistaNodesPerQuery({process: p[i]}, llista_nodes);		
		}
		return llista_nodes;
	}
	if(node.reponsibleParty)
	{
		var name=GetPartyName(node.reponsibleParty.party);
		if (!name || name=="")
			return llista_nodes;
		valor.push(DonaCadenaLang({"cat":"Agent", "spa":"Agente", "eng":"Agent", "fre":"Agent"}), ": ",  name.indexOf(' ')==-1 ? name : name.substring(0, name.indexOf(' ')));		
		llista_nodes.push({tipus: "agent", etiqueta: valor.join("")});
		return llista_nodes;
	}
	if(node.exe)
	{
		valor.push(DonaCadenaLang({"cat": "Executable", "spa": "Ejecutable", "eng": "Executable", "fre": "Exécutable"}), ": ",  TreuAdreca(node.exe.reference));
		llista_nodes.push({tipus: "exe", etiqueta: valor.join("")});					
		p=node.exe.responsibleParty;
		if(p)
		{			
			for(i=0; i<p.length;i++)
				AfegeixNodeALlistaNodesPerQuery({reponsibleParty: p[i]}, llista_nodes);	
		}
		if(node.exe.algorithm)
		{
			AfegeixNodeALlistaNodesPerQuery({algorithm: node.exe.algorithm}, llista_nodes);	
			if(node.exe.algorithm.functionality)
				AfegeixNodeALlistaNodesPerQuery({functionality: node.exe.algorithm.functionality}, llista_nodes);	
		}
		return llista_nodes;		
	}
	if(node.algorithm)
	{
		valor.push(DonaCadenaLang({"cat": "Algorisme", "spa": "Algoritmo", "eng": "Algorithm", "fre": "Algorithme"}), ": ",  DonaCadena(node.algorithm.name));
		llista_nodes.push({tipus: "algorisme", etiqueta: valor.join("")});					
		p=node.algorithm.responsibleParty;
		if(p)
		{			
			for(i=0; i<p.length;i++)
				AfegeixNodeALlistaNodesPerQuery({reponsibleParty: p[i]}, llista_nodes);	
		}
		return llista_nodes;		
	}
	if(node.functionality)
	{
		valor.push(DonaCadenaLang({"cat": "Funcionalitat", "spa": "Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}), ": ",  DonaCadena(node.functionality));
		llista_nodes.push({tipus: "algorisme", etiqueta: valor.join("")});							
		return llista_nodes;		
	}
	return llista_nodes;
}

function sortLListaNodesPerQuery(a,b) 
{
	if(a.tipus < b.tipus)
		return -1;
	if(a.tipus > b.tipus)
		return 1;
	if(a.etiqueta< b.etiqueta)
		return -1;
	if(a.etiqueta > b.etiqueta)
		return 1;
	return 0;
}
function DonaCadenaFormSimpleQueryLlinatge()
{
var cdns=[], llista_nodes=[], i;	
	
	// Construeixo una llista de Nodes
	for(i=0; i<LListaCapesGraphsMM.length; i++)
		if(LListaCapesGraphsMM[i].visible)
			AfegeixNodeALlistaNodesPerQuery({capa: ParamCtrl.capa[LListaCapesGraphsMM[i].i_capa]}, llista_nodes);
	llista_nodes.sort(sortLListaNodesPerQuery);
	llista_nodes.removeDuplicates(sortLListaNodesPerQuery);
	
	cdns.push("<legend>",DonaCadenaLang({"cat":"Consulta simple", "spa":"Consulta simple", "eng":"Simple query", "fre":"Requête simple"}), "</legend>",
			  DonaCadenaLang({"cat":"Node inicial", "spa":"Nodo inicial", "eng":"Start node", "fre":"Noeud initial"}), " <select name=\"sQLl_startNode\">");	
	for(i=0; i<llista_nodes.length; i++)
		cdns.push("<option value=\"",i,"\">", llista_nodes[i].etiqueta);			
	cdns.push("</select><br>",DonaCadenaLang({"cat":"Node final", "spa":"Nodo final", "eng":"End node", "fre":"Noeud finale"}), " <select name=\"sQLl_endNode\">");
	for(i=0; i<llista_nodes.length; i++)
		cdns.push("<option value=\"",i,"\">", llista_nodes[i].etiqueta);
	cdns.push("</select>");
	return cdns.join("");
}


function CanviaContigutAtributComplexQueryLlinatge(i_node, t_node)
{
var i_sel, tipus_node,sel_a_omplir;	
	if(i_node="start")
	{
		if(t_node)
			tipus_node=t_node;
		else
		{
			if(-1==(i_sel=document.LlinatgeCapes.cQLl_startTypeNode.selectedIndex))
				document.LlinatgeCapes.cQLl_startTypeNode.selectedIndex=i_sel=0;
			tipus_node= document.LlinatgeCapes.cQLl_startTypeNode[i_sel].value;
		}
		sel_a_omplir=document.LlinatgeCapes.cQLl_startAttributeNode;
	}
	else if(i_node="end")
	{
		if(t_node)
			tipus_node=t_node;
		else
		{
			if(-1==(i_sel=document.LlinatgeCapes.cQLl_endTypeNode.selectedIndex))
				document.LlinatgeCapes.cQLl_endTypeNode.selectedIndex=i_sel=0;
			tipus_node= document.LlinatgeCapes.cQLl_endTypeNode[i_sel].value;
		}		
		sel_a_omplir=document.LlinatgeCapes.cQLl_endAttributeNode;
	}
	EsborraTotesOptionDeSelect(sel_a_omplir);	
	if(tipus_node=="agent")
	{
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"paper","spa":"papel","eng":"role","fre":"rôle"}), value:"role", selected: true});
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"nom", "spa":"nombre","eng":"name","fre":"nom"}), value:"name", selected: false});		
	}
	else if(tipus_node=="font")
	{
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"nom", "spa":"nombre","eng":"name","fre":"nom"}), value:"name", selected: true});		
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"referència","spa":"referencia","eng":"reference","fre":"référence"}), value:"reference", selected: false});		
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"descripció", "spa":"descripción","eng":"description","fre":"description"}), value:"description", selected: false});		
	}
	else if(tipus_node=="proces")
	{
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"propòsit","spa":"propósito","eng":"purpose","fre":"raison"}), value:"purpose", selected: true});		
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"data", "spa":"fecha","eng":"date","fre":"date"}), value:"date", selected: false});		
	}
	else if(tipus_node=="exe")
	{
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"nom", "spa":"nombre","eng":"name","fre":"nom"}), value:"name", selected: true});		
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"referència","spa":"referencia","eng":"reference","fre":"référence"}), value:"reference", selected: false});		
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"data de compilació", "spa":"fecha de compilación","eng":"compilation date","fre":"date de compilation"}), value:"compilationDate", selected: false});		
	}
	else if(tipus_node=="algorisme")
	{
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"nom", "spa":"nombre","eng":"name","fre":"nom"}), value:"name", selected: true});		
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat": "Funcionalitat", "spa": "Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}), value:"functionality", selected: false});		
	}
	else if(tipus_node=="funcio")
	{
		AfegeixOptionASelect(sel_a_omplir, {text: DonaCadenaLang({"cat":"descripció", "spa":"descripción","eng":"description","fre":"description"}), value:"description", selected: true});		
	}
}

function DonaCadenaFormComplexQueryLlinatge()
{
var cdns=[];	
	cdns.push("<legend>",DonaCadenaLang({"cat":"Consulta complexa", "spa":"Consulta compleja", "eng":"Complex query", "fre":"Requête complexe"}), "</legend>",
			DonaCadenaLang({"cat":"Inici: ", "spa":"Inicio:", "eng":"Start:", "fre":"Départ:"}),
			DonaCadenaLang({"cat":"Tipus: ", "spa":"Tipo:", "eng":"Type:", "fre":"Type:"}),
			"<select name=\"cQLl_startTypeNode\" onChange=\"CanviaContigutAtributComplexQueryLlinatge('start', null);\">",	
			"<option value=\"agent\" selected>", DonaCadenaLang({"cat":"Agent", "spa":"Agente", "eng":"Agent", "fre":"Agent"}),
			"<option value=\"font\">", DonaCadenaLang({"cat":"Font", "spa":"Fuente", "eng":"Source", "fre":"Source"}),
			"<option value=\"proces\">", DonaCadenaLang({"cat":"Procés", "spa":"Proceso", "eng":"Process", "fre":"Processus"}),
			"<option value=\"exe\">", DonaCadenaLang({"cat":"Executable", "spa":"Ejecutable", "eng": "Executable", "fre": "Exécutable"}),
			"<option value=\"algorisme\">", DonaCadenaLang({"cat":"Algorisme", "spa":"Algoritmo", "eng": "Algorithm", "fre": "Algorithme"}),
			"<option value=\"funcio\">", DonaCadenaLang({"cat":"Funcionalitat", "spa":"Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}),
			"</select>",
			DonaCadenaLang({"cat":"Atribut: ", "spa":"Atributo:", "eng":"Attribute:", "fre":"Attribut:"}),
			"<select name=\"cQLl_startAttributeNode\">",
			"<option value=\"role\" selected>", DonaCadenaLang({"cat":"paper","spa":"papel","eng":"role","fre":"rôle"}),"</option>",
			"<option value=\"name\">",DonaCadenaLang({"cat":"nom", "spa":"nombre","eng":"name","fre":"nom"}), "</option>",
			DonaCadenaLang({"cat":"Valor: ", "spa":"Valor:", "eng":"Value:", "fre":"valeur:"}),
			"<input type=\"text\" name=\"cQLl_startValueNode\" size=\"20\"><br>",
			DonaCadenaLang({"cat":"Fi: ", "spa":"Fin:", "eng":"End:", "fre":"But:"}),
			DonaCadenaLang({"cat":"Tipus: ", "spa":"Tipo:", "eng":"Type:", "fre":"Type:"}),
			"<select name=\"cQLl_endTypeNode\" onChange=\"CanviaContigutAtributComplexQueryLlinatge('end', null);\">",
			"<option value=\"agent\" selected>", DonaCadenaLang({"cat":"Agent", "spa":"Agente", "eng":"Agent", "fre":"Agent"}),
			"<option value=\"font\">", DonaCadenaLang({"cat":"Font", "spa":"Fuente", "eng":"Source", "fre":"Source"}),
			"<option value=\"proces\">", DonaCadenaLang({"cat":"Procés", "spa":"Proceso", "eng":"Process", "fre":"Processus"}),
			"<option value=\"exe\">", DonaCadenaLang({"cat":"Executable", "spa":"Ejecutable", "eng": "Executable", "fre": "Exécutable"}),
			"<option value=\"algorisme\">", DonaCadenaLang({"cat":"Algorisme", "spa":"Algoritmo", "eng": "Algorithm", "fre": "Algorithme"}),
			"<option value=\"funcio\">", DonaCadenaLang({"cat":"Funcionalitat", "spa":"Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}),
			"</select>",
			DonaCadenaLang({"cat":"Atribut: ", "spa":"Atributo:", "eng":"Attribute:", "fre":"Attribut:"}),
			"<select name=\"cQLl_endAttributeNode\">",
			"<option value=\"role\" selected>", DonaCadenaLang({"cat":"paper","spa":"papel","eng":"role","fre":"rôle"}),"</option>",
			"<option value=\"name\">",DonaCadenaLang({"cat":"nom", "spa":"nombre","eng":"name","fre":"nom"}), "</option>",
			"</select>",
			DonaCadenaLang({"cat":"Valor: ", "spa":"Valor:", "eng":"Value:", "fre":"valeur:"}),
			"<input type=\"text\" name=\"cQLl_endValueNode\" size=\"20\">");
	return cdns.join("");
}

// Funcions que permeten que hi hagi més d'una capa a la mateixa finestra on es mostren els grafs del llinatge
function OmpleFinestraLlinatge(param)
{	
	if(param.redibuixat)		
	{	
		if(LListaCapesGraphsMM.length==0)
			return;
		EsborraGrafLlinatge();
	}	
	
	if(GraphsMM.hihaElements && param.i_capa!=-1)
	{
		if(AfegeixCapaALlistaCapesGrafLLinatge(param.i_capa))
		{
			var i_capa_llista=LListaCapesGraphsMM.binarySearch(param.i_capa,findLListaCapesGraphsMMIdCapa);
			if(i_capa_llista>=0)
			{
				AfegeixCapaAGrafLlinatge(i_capa_llista);				
				if(GraphsMM.nodesGraf)				
					GraphsMM.nodesGraf.clear();
				if(GraphsMM.edgesGraf)
					GraphsMM.edgesGraf.clear();
				GraphsMM.nodesGraf.add(GraphsMM.nodes);	
				GraphsMM.edgesGraf.add(GraphsMM.edges);				
			}
		}
		// Modifico la llista de capes
		document.getElementById("capesLlinatge").innerHTML = DonaCadenaFormCapesALlinatge();
		document.getElementById("elemsLlinatge").innerHTML = DonaCadenaFormElementsVisiblesALlinatge();
		document.getElementById("simpleQLlinatge").innerHTML = DonaCadenaFormSimpleQueryLlinatge();
		document.getElementById("complexQLlinatge").innerHTML = DonaCadenaFormComplexQueryLlinatge();
	}
	else
	{
		if(param.i_capa!=-1) 
		 	AfegeixCapaALlistaCapesGrafLLinatge(param.i_capa);
		
		var cdns=[];
		cdns.push("<form name=\"LlinatgeCapes\" onSubmit=\"return false;\">",
				  "<fieldset id=\"opcionsLlinatge\"><legend>",DonaCadenaLang({"cat":"Opcions de visualització, consulta i filtre", "spa":"Opciones de visualización, consulta y filtro", "eng":"Show, query and filter options", "fre":"Options de visualisation, consultations et filtrage"}), "</legend>",
				  "<fieldset id=\"capesLlinatge\">",DonaCadenaFormCapesALlinatge(),"</fieldset>",
				  "<fieldset id=\"elemsLlinatge\">",DonaCadenaFormElementsVisiblesALlinatge(),"</fieldset>",
				  "<fieldset id=\"simpleQLlinatge\">",DonaCadenaFormSimpleQueryLlinatge(),"</fieldset>",
				  "<fieldset id=\"complexQLlinatge\">",DonaCadenaFormComplexQueryLlinatge(),"</fieldset>",				  
				  "<br><input name=\"aplicarCanvisCapes\" type=\"button\" value=\"", DonaCadenaLang({"cat":"Aplicar canvis", "spa":"Aplicar", "eng":"Apply", "fre":"Appliquer"}), 
		 		  "\" onClick='RedibuixaFinestraLlinatge();'/><br></fieldset>",
				  "<fieldset id=\"grafLlinatge\" style=\"height:70%;position:relative;\"></fieldset>",
				  "<fieldset id=\"infoLlinatge\" style=\"height:15%;position:relative;\"></fieldset>",
				  "</form>");
		contentLayer(param.elem, cdns.join(""));		
		CreaGrafLlinatge("grafLlinatge");
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

function AfegeixCapaALlistaCapesGrafLLinatge(i_capa)
{
	var i_capa_llista=LListaCapesGraphsMM.binarySearch(i_capa,findLListaCapesGraphsMMIdCapa);
	if(i_capa_llista<0)
	{
		LListaCapesGraphsMM.push({i_capa: i_capa, nSteps: 0, visible: true, agrupada: true});
		LListaCapesGraphsMM.sort(sortLListaCapesGraphsMM);
		return true;
	}	
	return false;
}

function CanviaIndexosCapesGraphsMM(n_moviment, i_capa_ini, i_capa_fi_per_sota)
{
	if(LListaCapesGraphsMM && LListaCapesGraphsMM.length>0)
	{
		for(var i=0; i<LListaCapesGraphsMM.length; i++)
		{
			if (LListaCapesGraphsMM[i].i_capa>=i_capa_ini && LListaCapesGraphsMM[i].i_capa<i_capa_fi_per_sota)
				LListaCapesGraphsMM[i].i_capa+=n_moviment;
		}
	}
}

function FinestraMostraLlinatgeCapa(elem, i_capa)
{
var capa=ParamCtrl.capa[i_capa];

	if(!capa.metadades || !capa.metadades.provenance)
	{
		OmpleFinestraLlinatge({elem: elem, i_capa: -1});
		return;
	}		
	var prov=capa.metadades.provenance;
	if(prov.peticioServCSW && !prov.lineage)
	{
		// Demano el llinatge al servidor i el carrego a memòria
		DescarregaLlinatgeCapa(i_capa, OmpleFinestraLlinatge, {elem: elem, i_capa: i_capa});
		return;
	}
	OmpleFinestraLlinatge({elem: elem, i_capa: (prov.lineage) ? i_capa : -1});
	return;
}