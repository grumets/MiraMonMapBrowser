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
	
	for(var i=0; i<LListaCapesGraphsMM.length; i++)
		LListaCapesGraphsMM[i].nSteps=0;
}

function EsborraGrafLlinatgeICapes()
{
	EsborraGrafLlinatge();
	LListaCapesGraphsMM=[];	
	document.getElementById("capesllinatge").innerHTML = DonaCadenaFormCapesALlinatge();
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
		//	node.executable.functionality);
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

function AfegeixNomProcessLlinatgeACadena(proces, cdns)
{
var source, j, i;	

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
						cdns=AfegeixNomProcessLlinatgeACadena(source.processes[i], cdns);
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
		if(node.agrupat && node.group=="procesAgrupat")
		{
			cdns.push(DonaCadenaLang({"cat": "Grup de processos", "spa": "Grupo de procesos", "eng": "Process group", "fre": "Groupe de processus"}),":");
			if(node.proces)
			{
				cdns=AfegeixNomProcessLlinatgeACadena(node.proces, cdns);
			}
			else if(node.llinatge)
			{
				var i, j, p=node.llinatge;
				if(p.processes && p.processes.length>0)
				{
					for(i=p.processes.length-1; i>=0; i--)
						cdns=AfegeixNomProcessLlinatgeACadena(p.processes[i], cdns);
				}
				if(p.sources && p.sources.length>0)
				{
					for(i=p.sources.length-1; i>=0; i--)
					{
						if (p.sources[i].processes && p.sources[i].processes.length>0)
						{
							for(i=p.sources[i].processes.length-1; i>=0; i--)			
								cdns=AfegeixNomProcessLlinatgeACadena(p.sources[i].processes[i], cdns);
						}
					}
				}
			}
		}
		else if(node.group=="resultat")
		{
			cdns.push(DonaCadenaLang({"cat": "Capa Resultat", "spa": "Capa Resultado", "eng": "Resulting dataset", "fre": "Jeu de données résultant"}), ": ", DonaCadena(node.capa.desc) ? DonaCadena(node.capa.desc): node.capa.nom);
			llinatge=node.capa.metadades.provenance.lineage;
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
			if (node.executable.functionality)
				cdns.push("<br>", DonaCadenaLang({"cat": "Funcionalitat", "spa": "Funcionalidad", "eng": "Functionality", "fre": "Fonctionnalité"}), ": ", DonaCadena(node.executable.functionality));
		}	
	}
	return cdns.join("");
}

function CreaGrafProcesLlinatge(info_graf, in_node, id_pare, i_capa_llista)
{
var j, i_node, i_edge, id_proces, id_usar, exe, name, pro, p, node_afegit=false;

	if(in_node.agrupat)
	{
		if(typeof in_node.nomesSiFulla==="undefined" || !in_node.nomesSiFulla)
		{
			i_node=(-info_graf.nodes.length-1);
			id_proces=IdNodeGraphsMM;
			IdNodeGraphsMM++;		
			name=[];
			name.push(DonaCadenaLang({"cat": "Processos", "spa": "Procesos", "eng": "Processes", "fre": "Processus"}));
			LListaCapesGraphsMM[i_capa_llista].nSteps++;  // Potser més endavant em pot servir per anar desplegant el llinatge		
			if(in_node.llinatge)
			{
				if(DonaCadena(in_node.llinatge.statement))
					name.push(": ",  DonaCadena(in_node.llinatge.statement));			
				info_graf.nodes.splice(-i_node-1, 0, {id:id_proces, 
						label: name.join(""),
						title: DonaCadena(in_node.llinatge.statement)? DonaCadena(in_node.llinatge.statement) : DonaCadenaLang({"cat": "Grup de processos", "spa": "Grupo de procesos", "eng": "Process group", "fre": "Groupe de processus"}), 
						group: "procesAgrupat", 
						agrupat: true, 
						llinatge: in_node.llinatge});
			}
			else
			{
				info_graf.nodes.splice(-i_node-1, 0, {id:id_proces, 
						label: name.join(""),
						title: DonaCadenaLang({"cat": "Grup de processos", "spa": "Grupo de procesos", "eng": "Process group", "fre": "Groupe de processus"}), 
						group: "procesAgrupat", 
						agrupat: true, 
						proces: in_node.proces});			
			}
			node_afegit=true;
		}
	}
	else
	{
		p=in_node.proces;
		i_node=info_graf.nodes.binarySearch({group:"proces", proces: p}, ComparaNodesLlinatge);
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
			if(p.executable && p.executable.reference)
				name.push(": ",  TreuExtensio(TreuAdreca(p.executable.reference)));
			if(p.timeDate)
			{
				var data_temp=new Date(p.timeDate);
				//OmpleDataJSONAPartirDeDataISO8601(data_temp, p.timeDate);
				if(p.executable && p.executable.reference)
					name.push("_");
				else
					name.push(": ");
				name.push(DonaDateComATextISO8601(data_temp,{DataMostraAny: true, DataMostraMes: true, DataMostraDia: true, DataMostraHora: true, DataMostraMinut: true}));
			}
			info_graf.nodes.splice(-i_node-1, 0, {id:id_proces, 
						label: name.join(""),
						title: p.purpose, 
						group: "proces", 
						proces: p});
		}
		node_afegit=true;
	}
	if(node_afegit)
	{
		i_edge=info_graf.edges.binarySearch({from: id_pare, to: id_proces, label: 'wasGeneratedBy'}, ComparaEdgesLlinatge);
		if(i_edge<0) // no trobat
			info_graf.edges.splice(-i_edge-1, 0, {from: id_pare, to: id_proces, arrows:'to', label: 'wasGeneratedBy', font: {align: 'top', size: 10}});

	}
	if(in_node.agrupat)
	{
		// He de dibuixar les fonts fulles
		if(in_node.llinatge)
		{
			p=in_node.llinatge;
			if(p.processes && p.processes.length>0)
			{
				for(j=p.processes.length-1; j>=0; j--)
					CreaGrafProcesLlinatge(info_graf, {agrupat: true, proces: p.processes[j], nomesSiFulla: true}, node_afegit? id_proces : id_pare, i_capa_llista);
			}	
			if(p.sources)
			{
				for(j=0; j<p.sources.length; j++)
					CreaGrafFontLlinatge(info_graf, "in",  {agrupat: true, font: p.sources[j], nomesSiFulla: true}, node_afegit? id_proces : id_pare, i_capa_llista);	
			}
		}		
		else if(in_node.proces)		
		{
			if(in_node.proces.parameters)
			{				
				for(j=0; j<in_node.proces.parameters.length;j++)
				{
					p=in_node.proces.parameters[j];
					if(p.valueType=="source" && typeof p.source!=="undefined" && p.source!=null)
						CreaGrafFontLlinatge(info_graf, p.direction, {agrupat: true, font: p.source, nomesSiFulla: true}, node_afegit? id_proces : id_pare, i_capa_llista);
				}				
			}
		}	
	}
	else 
	{
		p=in_node.proces;
		if(p.processor)
		{
			for(j=0; j<p.processor.length;j++)
			{
				pro=p.processor[j];
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
		if(p.executable)
		{
			exe=p.executable;
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
				info_graf.edges.splice(-i_edge-1, 0, {from: id_proces, to: id_usar, arrows:'to', label: 'executed', font: {align: 'top', size: 10}});					
		}
		if(p.parameters)
		{
			for(j=0; j<p.parameters.length;j++)
			{
				if(p.parameters[j].valueType=="source" && typeof p.parameters[j].source!=="undefined" && p.parameters[j].source!=null)
					CreaGrafFontLlinatge(info_graf, p.parameters[j].direction, {agrupat:false, font: p.parameters[j].source, nomesSiFulla: false}, id_proces, i_capa_llista);
			}
		}	
	}
	return;
}


function CreaGrafFontLlinatge(info_graf, direction, in_node, id_pare, i_capa_llista)
{
var id_font, i_node, i_edge, i, j;
 
	if(in_node.nomesSiFulla && in_node.font.processes && in_node.font.processes.length>0)
	{
		for(i=in_node.font.processes.length-1; i>=0; i--)
			CreaGrafProcesLlinatge(info_graf, {agrupat: in_node.agrupat, proces: in_node.font.processes[i], nomesSiFulla: in_node.nomesSiFulla}, id_pare, i_capa_llista);
		return;
	}
	if(Object.keys(in_node.font).length == 0)
	{
		// Si la font no té cap element, això és un error de definició del llinatge
		alert("There is a source without elements");
		return;
	}
	i_node=info_graf.nodes.binarySearch({group:"font", font: in_node.font}, ComparaNodesLlinatge);
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
					label: TreuAdreca(in_node.font.reference),  //"font"+id_font, 
					title: in_node.font.reference, 
					group: "font", 
					font: in_node.font});
	}
	if(direction=="in")
	{
		i_edge=info_graf.edges.binarySearch({from: id_pare, to:id_font, label: 'used'}, ComparaEdgesLlinatge);
		if(i_edge<0) // no trobat
			info_graf.edges.splice(-i_edge-1, 0, {from: id_pare, to: id_font, arrows:'to', label: 'used', font: {align: 'top', size: 10}});					
	}
	else
	{
		i_edge=info_graf.edges.binarySearch({from: id_font, to:id_pare, label: 'wasGeneratedBy'}, ComparaEdgesLlinatge);
		if(i_edge<0) // no trobat
			info_graf.edges.splice(-i_edge-1, 0, {from: id_font, to: id_pare, arrows:'to', label: 'wasGeneratedBy', font: {align: 'top', size: 10}});					
	}
	if (in_node.font.processes && in_node.font.processes.length>0)
	{
		for(i=in_node.font.processes.length-1; i>=0; i--)
			CreaGrafProcesLlinatge(info_graf, {agrupat: in_node.agrupat, proces: in_node.font.processes[i], nomesSiFulla: in_node.nomesSiFulla}, id_font, i_capa_llista);
	}
	return;
}

function AfegeixCapaAGrafLlinatge(i_capa_llista)
{
var i, capa=ParamCtrl.capa[LListaCapesGraphsMM[i_capa_llista].i_capa], lli=capa.metadades.provenance.lineage;
		
	// El primer que he de posar és la capa generada, que és la que estic documentant el llinatge i tot penja d'aquesta capa.	
	var info_graf={nodes: [{id:IdNodeGraphsMM, label: capa.nom, group: "resultat", capa: capa}], edges: []};
	var id_node_pare=IdNodeGraphsMM;
	IdNodeGraphsMM++;	
	
	if(LListaCapesGraphsMM[i_capa_llista].agrupada)
		CreaGrafProcesLlinatge(info_graf,  {agrupat: true, llinatge: lli, nomesSiFulla: false}, id_node_pare, i_capa_llista);
	else
	{
		// Ara miro els processos i les fonts que pengen d'aquesta capa
		// Aniré afegint els nodes de manera ordenada per nom i group	
		if(lli.processes && lli.processes.length>0)
		{
			// Faig l'ordre invers perquè quedi una numeració més intuïtiva de l'odre en que s'ha fet cada procés,
			// ja que en el llinatge està ordenat a l'inversa
			//for(i=0; i<lli.processes.length; i++)
			for(i=lli.processes.length-1; i>=0; i--)
				CreaGrafProcesLlinatge(info_graf, {agrupat: false, proces: lli.processes[i], nomesSiFulla: false}, id_node_pare, i_capa_llista);
		}	
		if(lli.sources)
		{
			for(i=0; i<lli.sources.length; i++)
				CreaGrafFontLlinatge(info_graf, "in",  {agrupat: false, font: lli.sources[i], nomesSiFulla: false}, id_node_pare, i_capa_llista);	
		}
	}
	if(info_graf.nodes)
	{
		GraphsMM.nodesGraf.add(info_graf.nodes);	
		if(!GraphsMM.nodes)
			GraphsMM.nodes=[];
		GraphsMM.nodes.push.apply(GraphsMM.nodes, info_graf.nodes);	
	}
	if(info_graf.edges)
		GraphsMM.edgesGraf.add(info_graf.edges);
}

function DesagrupaUnNivellNodeLlinatge (node)
{
	return;
}

function MostraContextMenuNodeAgrupat(event, node)
{
var cdns=[];

	// El menú hem queda amagat a darrera i m'hauria de quedar davant
	//·$·
	// He d'afegir les opcions del menú
	cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"DesagrupaUnNivellNodeLlinatge(", node, ");TancaContextMenuCapa();\">",
						DonaCadenaLang({"cat":"Desagrupa un nivell", "spa":"Modifica el nombre", "eng":"Modify the name", "fre":"Modifier le nom"}), "</a><br>");
	
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
			if(node.agrupat)
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
	GraphsMM.options = { 
		"interaction": { "navigationButtons": true, "keyboard": true},
		"layout": {"improvedLayout": false},
		"nodes": {"shape": "box", "borderWidth": 2, "shadow":true},
		"edges": {"font": {"align": "top", "size": 10}},
		"groups": {
			"font": {"shape": "ellipse","color": {"background":"LightYellow", "border":"GoldenRod"}},
			"executable": {"shape": "ellipse","color": {"background":"DarkSeaGreen", "border":"ForestGreen"}},
			"proces": {"shape":"box","color":{"background":"LightSteelBlue", "border":"purple"}},
			"procesAgrupat": {"shape":"box","color":{"background":"LightSteelBlue", "border":"blue"}, "borderWidth": 3},
			"resultat": {"shape": "ellipse","color": {"background":"Yellow","border":"GoldenRod"}, "borderWidth": 3},
			"agent": {"shape":"circle","color":{"background":"DarkSalmon","border":"Bisque"}},
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
	if(i_capa_llista==-1)
		return; // capa no trobada a la llista, això no hauria de passar	
	LListaCapesGraphsMM[i_capa_llista].visible=(visible.checked)?true :false;
	var agrupat=eval("document.LlinatgeCapes.cll_agrupat_"+i_capa);
	if(LListaCapesGraphsMM[i_capa_llista].visible)
	{		
		agrupat.disabled=false;
		agrupat.checked==LListaCapesGraphsMM[i_capa_llista].agrupada?true:false;
	}
	else
	{
		agrupat.disabled=true;
	}	
}

function AgrupadaoNoCapaLlinatge(i_capa)
{
	var agrupat=eval("document.LlinatgeCapes.cll_agrupat_"+i_capa);
	if (!agrupat)
		return;
	var i_capa_llista=LListaCapesGraphsMM.binarySearch(i_capa,findLListaCapesGraphsMMIdCapa);
	if(i_capa_llista==-1)
		return; // capa no trobada a la llista, això no hauria de passar	
	LListaCapesGraphsMM[i_capa_llista].agrupada=(agrupat.checked)?true :false;
}

function RedibuixaFinestraLlinatge()
{
	var elem=getFinestraLayer(window, "mostraLlinatge");
	if(elem)
		OmpleFinestraLlinatge({elem: elem, i_capa: -1, redibuixat: true});
}

function DonaCadenaFormCapesALlinatge()
{
var cdns=[],capa;	

	cdns.push(	"<legend>",DonaCadenaLang({"cat":"Capes:", "spa":"Capas:", "eng":"Layers:", "fre":"Couches:"}), "</legend>");					
	for(var i=0;i<LListaCapesGraphsMM.length; i++)
	{
		capa=ParamCtrl.capa[LListaCapesGraphsMM[i].i_capa];
		cdns.push("<input name=\"cll_visible_",LListaCapesGraphsMM[i].i_capa,"\" value=\"",LListaCapesGraphsMM[i].i_capa, 
				"\" onclick='VisibleoNoCapaLlinatge(", LListaCapesGraphsMM[i].i_capa, ");' type=\"checkbox\"",
				LListaCapesGraphsMM[i].visible ? " checked" : "", "/>", 				
				"<label for=\"cll_visible_",LListaCapesGraphsMM[i].i_capa,"\">", (DonaCadena(capa.DescLlegenda)? DonaCadena(capa.DescLlegenda): capa.nom), "</label>",
				"<input name=\"cll_agrupat_",LListaCapesGraphsMM[i].i_capa,"\" value=\"",LListaCapesGraphsMM[i].i_capa, 				
				"\" onclick='AgrupadaoNoCapaLlinatge(", LListaCapesGraphsMM[i].i_capa, ");' type=\"checkbox\"",
				(LListaCapesGraphsMM[i].visible && LListaCapesGraphsMM[i].agrupada) ? " checked" : "", 
				LListaCapesGraphsMM[i].visible ? "" : "disabled", "/>", 				
				"<label for=\"cll_agrupat_",LListaCapesGraphsMM[i].i_capa,"\">", DonaCadenaLang({"cat":"Vista agrupada", "spa":"Vista agrupada", "eng":"Group view", "fre": "Vue groupée"}), "</label><br>");
	}	
	if(LListaCapesGraphsMM.length>0)
	{
		cdns.push("<br><input name=\"aplicarCanvisCapes\" type=\"button\" value=\"", DonaCadenaLang({"cat":"Aplicar canvis", "spa":"Aplicar", "eng":"Apply", "fre":"Appliquer"}), 
			  "\" onClick='RedibuixaFinestraLlinatge();'/><br>",
			  "<br><font size=1><a href=\"javascript:void(0);\" onClick=\"EsborraGrafLlinatgeICapes();\">",DonaCadenaLang({"cat":"Esborra-ho tot", "spa":"Borrar todo", "eng":"Delete all","fre":"Tout effacer"}),"</a></font>");
	}
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
			if(i_capa_llista!=-1)
			{
				AfegeixCapaAGrafLlinatge(i_capa_llista);				
				// Modifico la llista de capes
				document.getElementById("capesllinatge").innerHTML = DonaCadenaFormCapesALlinatge();
			}
		}
	}
	else
	{
		if(param.i_capa!=-1) 
		 	AfegeixCapaALlistaCapesGrafLLinatge(param.i_capa);
		
		var cdns=[];
		cdns.push(	"<form name=\"LlinatgeCapes\" onSubmit=\"return false;\">",
					"<fieldset id=\"capesllinatge\">",DonaCadenaFormCapesALlinatge(),"</fieldset>",
					"<fieldset id=\"grafLlinatge\" style=\"height:70%;position:relative;\"></fieldset>",
					"<fieldset id=\"infoLlinatge\" style=\"height:15%;position:relative;\"></fieldset>",
					"</form>");
		/*
		cdns.push(	"<table style=\"width: 97%; height: 97%;position: absolute;top: 50%;left: 50%;margin-right: -50%;transform: translate(-50%, -50%);\"><tr>",
					"<td style=\"width: 75%;border: 0px;\"><table style=\"width: 100%; height: 100%;\">",
				  	"<tr><td style=\"width:80%;height:5%;border:1px solid lightgray;\"><p id=\"botonsLlinatge\"><font size=1><a href=\"javascript:void(0);\" onClick=\"EsborraGrafLlinatge();\">", 
					DonaCadenaLang({"cat":"Esborra-ho tot", "spa":"Borrar todo", "eng":"Delete all","fre":"Tout effacer"}),"</a><p></td></tr>",
					"<tr><td class=\"Verdana11px\" style=\"width:100%;height:80%;border: 1px solid lightgray;\"><div style=\"border:0;width:98%;height:98%;position:relative;\" id=\"grafLlinatge\"></div></td></tr>",
				  	"<tr><td style=\"width:100%;height:15%;border:1px solid lightgray;\"><textarea id=\"infoLlinatge\" class=\"Verdana11px\" style=\"border:0;width:98%;height:98%;resize:none;\" readonly=\"readonly\"></textarea></td></tr>",
				  	"</table></td>",
					"<td style=\"width: 25%;border:1px solid lightgray;\">Elements visibles:</td></tr></table>");*/
		
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
	if(i_capa_llista==-1)
	{
		LListaCapesGraphsMM.push({i_capa: i_capa, nSteps: 0, visible: true, agrupada: true});
		LListaCapesGraphsMM.sort(sortLListaCapesGraphsMM);
		// LListaCapesGraphsMM.removeDuplicates(sortLListaCapesGraphsMM);
		return true;
	}	
	return false;
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