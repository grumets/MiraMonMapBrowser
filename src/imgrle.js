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

function AfegeixIcapaACalcul(calcul, i_capa, estil_o_atribut)
{
var text_estil_attribut=ParamCtrl.capa[i_capa].model==model_vector ? " name in attributes " : " estil ";
var fragment, inici, final, cadena, nou_valor;
var calcul_amb_icapa="";
	fragment=calcul;
	while ((inici=fragment.indexOf("{"))!=-1)
	{
		final=BuscaClauTancarJSON(fragment);
		if  (final==-1)
		{
			alert("Character '{' without '}' in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		nou_valor=JSON.parse(cadena);
		if (typeof nou_valor.i_capa==="undefined")
		{
			nou_valor.i_capa=i_capa;
			calcul_amb_icapa+=fragment.substring(0, inici)+JSON.stringify(nou_valor);
		}
		else
			calcul_amb_icapa+=fragment.substring(0, inici)+cadena;
		fragment=fragment.substring(final+1, fragment.length);
	}
	return calcul_amb_icapa+fragment;
}

function CompteValorsDimensions(dim, nomesExtra)
{
	if (!dim || !dim.length)
		return 0;
	if (nomesExtra)
	{
		for(var n_dim=0, i_dim=0; i_dim<dim.length; i_dim++)
		{
			if (nomesExtra && dim[i_dim].esExtra)
				n_dim++;
		}
		return n_dim;
	}
	return dim.length;
}


//Usar per a comparar valors.param. 
function SonValorsDimensionsIguals(dim1, dim2, nomesExtra)
{
	if (!dim1 && !dim2)
		return true;
	if (CompteValorsDimensions(dim1, nomesExtra)!=CompteValorsDimensions(dim2, nomesExtra))
		return false;
	if (CompteValorsDimensions(dim1, nomesExtra)==0 && CompteValorsDimensions(dim2, nomesExtra)==0)
		return true;
	for(var i_dim1=0; i_dim1<dim1.length; i_dim1++)
	{
		if (nomesExtra && !dim1[i_dim1].esExtra)
			continue;
		for(var i_dim2=0; i_dim2<dim2.length; i_dim2++)
		{
			if (nomesExtra && !dim2[i_dim2].esExtra)
				continue;
			if (dim1[i_dim1].clau.nom==dim2[i_dim2].clau.nom && dim1[i_dim1].valor.nom==dim2[i_dim2].valor.nom)
				break;
		}
		if (i_dim2==dim2.length)  //No he trobat cap equivalent
			return false;
	}
	return true;
}


/*Aquesta funció transforma {i_capa:, i_valor:, i_data:, DIM_nomdim: } a v[i] i {i_capa:, prop: } a p["nom_atribut"]
(la segona part només és vàlida per vectors).*/
function DonaFormulaConsultaDesDeCalcul(calcul, i_capa, estil_o_atribut)
{
var text_estil_attribut=ParamCtrl.capa[i_capa].model==model_vector ? " name in attributes " : " estil ";
//Busco la descripció de cada "valor" en la operació i creo un equivalent FormulaConsulta
//busco una clau d'obrir
var i, fragment, inici, final, cadena, nou_valor, c, i_capa_link, prop_nou_valor, i_prop_nou_valor, dim, i_dim, nom_dim, valor, i_v_dim;
var FormulaConsulta="";

	fragment=calcul;
	while ((inici=fragment.indexOf("{"))!=-1)
	{
		final=BuscaClauTancarJSON(fragment);
		if  (final==-1)
		{
			alert("Character '{' without '}' in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		nou_valor=JSON.parse(cadena);
		if (typeof nou_valor.i_sltr!=="undefined")
		{
			//Aquest tipus de objecte és un selector no s'ha de tractar ara
			FormulaConsulta+=fragment.substring(0, inici)+cadena;
		}
		else
		{
			if (typeof nou_valor.i_capa!=="undefined")
			{
				if (nou_valor.i_capa>=ParamCtrl.capa.length)
				{
					alert("capa " + nou_valor.i_capa + " in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut + " is out of range");
					break;
				}
				if (nou_valor.i_capa==i_capa)
				{
					delete nou_valor.i_capa;
					i_capa_link=i_capa;
				}
				else
					i_capa_link=nou_valor.i_capa;
			}
			else
				i_capa_link=i_capa

			if (typeof nou_valor.i_data!=="undefined" && !ParamCtrl.capa[i_capa_link].data)
			{
				alert("i_data has been indicated for a 'capa' without 'data' array in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
				break;
			}
			if (typeof nou_valor.i_data!=="undefined" && nou_valor.i_data>=ParamCtrl.capa[i_capa_link].data.length)
			{
				alert("'data' " + nou_valor.i_data + " in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut + " is out of range");
				break;
			}
			
			// miro si hi ha dimensioExtra
			prop_nou_valor=Object.keys(nou_valor);
			
			// miro si hi ha alguna dimensioExtra			
			for(i_prop_nou_valor=0; i_prop_nou_valor<prop_nou_valor.length; i_prop_nou_valor++)
			{
				if(prop_nou_valor[i_prop_nou_valor].startsWith("DIM_"))  // NJ: seria equivalent a prop_nou_valor[i_prop].substring(0,4)=="DIM_"
				{
					if(!ParamCtrl.capa[i_capa_link].dimensioExtra)
					{
						alert("dimension has been indicated for a 'capa' without 'dimensioExtra' array in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
						break;
					}
					dim=ParamCtrl.capa[i_capa_link].dimensioExtra;
					// comprovo el nom
					nom_dim=prop_nou_valor[i_prop_nou_valor].substring(4).toLowerCase();
					for(i_dim=0; i_dim<dim.length; i_dim++)
					{
						if(nom_dim==dim[i_dim].clau.nom.toLowerCase())
							break;
					}
					if(i_dim==dim.length)
					{
						alert("'dimension' " + nom_dim + " in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut + " is not found");
						break;					
					}					
					
					// comprovo el valor
					valor=nou_valor[prop_nou_valor[i_prop_nou_valor]].toLowerCase();
					for(i_v_dim=0; i_v_dim<dim[i_dim].valor.length; i_v_dim++)
					{
						if(valor==dim[i_dim].valor[i_v_dim].nom.toLowerCase())
							break;
					}
					if(i_v_dim==dim[i_dim].valor.length)
					{
						alert("value '"+valor +"' of dimension '" + nom_dim + "' in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut + " is out of range");
						break;					
					}					
					// em deso aquesta info que després necessitaré
					if(!nou_valor.param)
						nou_valor.param=[];
					nou_valor.param.push({clau: dim[i_dim].clau, valor: dim[i_dim].valor[i_v_dim], esExtra: true});  /* De moment 
									apunto al nom de dimensió i valor de la dimensió en 
									l'array de param (com si for un estil amb valors de dimensions fixes) 
									Més tard, si s'incorpara a la llista de valors aquest membre s'ha de
									"deapcopy" (p.ex. amb JSON.parse(JSON.stringify()) ).*/
				}
			}
			
			/*Eliminar aquesta línia em permet diferenciar entre "la data d'ara" encara que m'ho canviïn o "la seleccionada a la capa" i si la canvien l'adopto també.
			if (DonaIndexDataCapa(ParamCtrl.capa[mi_capa_link], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[i_capa_link], null))
				delete nou_valor.i_data;*/


			if(ParamCtrl.capa[i_capa_link].model==model_vector)
			{
				if (typeof nou_valor.prop==="undefined")
				{
					alert("prop is missing in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
					break;
				}
				//Contrueixo el fragment de FormulaConsulta
				if(ParamCtrl.capa[i_capa].model==model_vector)
				{
					if (i_capa!=i_capa_link)
					{
						alert("prop does not belong to the layer" + i_capa);
						break;
					}
					FormulaConsulta+=fragment.substring(0, inici)+"p[\""+nou_valor.prop+"\"]"; 
				}
				else //La capa origen és raster però la condició és vectorial
				{
					//cerco si ja existeix un valor amb aquestes caracteristiques
					if (typeof ParamCtrl.capa[i_capa].valors==="undefined")
						ParamCtrl.capa[i_capa].valors=[];
					var valors=ParamCtrl.capa[i_capa].valors;
					for (i=0; i<valors.length; i++)
					{
						if ((
							(typeof nou_valor.i_capa==="undefined" || nou_valor.i_capa==i_capa) &&
							(
								(typeof nou_valor.i_data==="undefined" && typeof valors[i].i_data==="undefined") ||
								(typeof nou_valor.i_data!=="undefined" && typeof valors[i].i_data!=="undefined" && DonaIndexDataCapa(ParamCtrl.capa[i_capa], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[i_capa], valors[i].i_data))
							) && 
							SonValorsDimensionsIguals(nou_valor.param, valors[i].param, true)
							&&
							nou_valor.objectes
							) ||
							(   typeof nou_valor.i_capa!=="undefined" && typeof valors[i].i_capa!=="undefined" && nou_valor.i_capa==valors[i].i_capa &&
								nou_valor.objectes &&
								(
									(typeof nou_valor.i_data==="undefined" && typeof valors[i].i_data==="undefined") ||
									(typeof nou_valor.i_data!=="undefined" && typeof valors[i].i_data!=="undefined" && DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], valors[i].i_data))
								)
								&&
								SonValorsDimensionsIguals(nou_valor.param, valors[i].param, true)
							)
							)
							break;
					}
					if (i==valors.length)
					{
						//afegeixo el valor si no existeix copiant tot el necessari.
						valors[i]={};
						if (typeof nou_valor.i_capa!=="undefined")
							valors[i].i_capa=nou_valor.i_capa;
						valors[i].objectes=ParamCtrl.capa[i_capa_link].objectes;
						if (typeof nou_valor.i_data!=="undefined")
							valors[i].i_data=nou_valor.i_data;
						if (typeof nou_valor.param!=="undefined")
							valors[i].param=JSON.parse(JSON.stringify(nou_valor.param));
					}
					FormulaConsulta+=fragment.substring(0, inici)+"valors["+i+"].objectes.features[v["+i+"]].properties[\""+nou_valor.prop+"\"]";
				}
			}
			else
			{
				if (typeof nou_valor.i_valor==="undefined")
				{
					alert("i_valor is missing in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
						break;
				}
				if (!ParamCtrl.capa[i_capa_link].valors)
				{
					alert("i_valor has been indicated for a 'capa' without 'valors' array in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
					break;
				}
				if (nou_valor.i_valor<0 || nou_valor.i_valor>=ParamCtrl.capa[i_capa_link].valors.length)
				{
					alert("i_valor " + nou_valor.i_valor + " in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut + " is out of range");
					break;
				}
				if (ParamCtrl.capa[i_capa_link].valors[nou_valor.i_valor].calcul)
				{
					alert("i_valor " + nou_valor.i_valor + " in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut + " points to one of the 'values' that is a 'calcul'. This is not supported yet.");
					break;
				}
				if (ParamCtrl.capa[i_capa_link].valors[nou_valor.i_valor].FormulaConsulta)
				{
					alert("i_valor " + nou_valor.i_valor + " in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut + " points to one of the 'values' that has a 'FormulaConsulta'. This is not supported yet.");
					break;
				}
				if (typeof nou_valor.i_capa==="undefined" && typeof nou_valor.i_data==="undefined" && 
					(typeof nou_valor.param==="undefined" || nou_valor.param.length<1))  //si és la mateixa capa i la mateixa data i les mateixes dimensions puc fer servir el valor de l'array de valors que ja existeix
					i=nou_valor.i_valor;
				else
				{
					//cerco si ja existeix un valor amb aquestes característiques
					if (typeof ParamCtrl.capa[i_capa].valors==="undefined")
						ParamCtrl.capa[i_capa].valors=[];
					var valors=ParamCtrl.capa[i_capa].valors;
					for (i=0; i<valors.length; i++)
					{
						if ((
							(typeof nou_valor.i_capa==="undefined" || nou_valor.i_capa==i_capa) &&
							(
								(typeof nou_valor.i_data==="undefined" && typeof valors[i].i_data==="undefined") ||
								(typeof nou_valor.i_data!=="undefined" && typeof valors[i].i_data!=="undefined" && DonaIndexDataCapa(ParamCtrl.capa[i_capa], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[i_capa], valors[i].i_data))
							)&& 
							SonValorsDimensionsIguals(nou_valor.param, valors[i].param, true)
							&&
							nou_valor.i_valor==i
							) ||
							(   typeof nou_valor.i_capa!=="undefined" && typeof valors[i].i_capa!=="undefined" && nou_valor.i_capa==valors[i].i_capa &&
								nou_valor.i_valor==valors[i].i_valor &&
								(
									(typeof nou_valor.i_data==="undefined" && typeof valors[i].i_data==="undefined") ||
									(typeof nou_valor.i_data!=="undefined" && typeof valors[i].i_data!=="undefined" && DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], valors[i].i_data)) 
								)
								&& 
								SonValorsDimensionsIguals(nou_valor.param, valors[i].param, true)
							)
							)
							break;
							
					}
					if (i==valors.length)
					{
						//afegeixo el valor si no existeix copiant tot el necessari.
						valors[i]=JSON.parse(JSON.stringify(ParamCtrl.capa[i_capa_link].valors[nou_valor.i_valor]));
						if (typeof nou_valor.i_capa!=="undefined")
							valors[i].i_capa=nou_valor.i_capa;
						valors[i].i_valor=nou_valor.i_valor;
						if (typeof nou_valor.i_data!=="undefined")
							valors[i].i_data=nou_valor.i_data;
						if (typeof nou_valor.param!=="undefined")
							valors[i].param=JSON.parse(JSON.stringify(nou_valor.param));
					}
				}
				FormulaConsulta+=fragment.substring(0, inici)+"v["+i+"]"; //contrueixo el fragment de FormulaConsulta
			}
		}
		fragment=fragment.substring(final+1, fragment.length);
	}
	return FormulaConsulta+fragment;
}

function ActualitzaSelectorsFormulaConsulta(component)
{
var fragment, cadena, inici, final, nou_valor;
var FormulaConsulta="";

	fragment=component.FormulaConsulta;
	while ((inici=fragment.indexOf("{"))!=-1)
	{
		final=BuscaClauTancarJSON(fragment);
		if  (final==-1)
		{
			alert("Character '{' without '}' in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		nou_valor=JSON.parse(cadena);
		if (typeof nou_valor.i_sltr!=="undefined")
		{
			if (nou_valor.i_sltr>=component.selector.length)
			{
				alert("Selector " + nou_valor.i_sltr + " in 'FormulaConsulta' is out of range");
				break;
			}
			FormulaConsulta+=fragment.substring(0, inici) + component.selector[nou_valor.i_sltr].valorActual;
		}
		else
			FormulaConsulta+=fragment.substring(0, inici)+cadena;
		fragment=fragment.substring(final+1, fragment.length);
	}
	component.formulaInterna=FormulaConsulta+fragment;
}

function HiHaValorsNecessarisCapaFormulaconsulta(capa, formula_consulta)
{
var valors=capa.valors;

	if (!valors)
		return false;
	for (var i=0; i<valors.length; i++)
	{
		if (formula_consulta.indexOf("v["+i+"]")!=-1)
			return true;
	}
	return false;
}

//v[] és false si la banda no està implicada en el redibuixat.
function DeterminaArrayValorsNecessarisCapa(i_capa, i_estil_o_atrib)
{
var capa=ParamCtrl.capa[i_capa], valors=capa.valors, v=[], i;

	for (i=0; i<valors.length; i++)
		v[i]=false;

	if (capa.model==model_vector)
	{
		for (i=0; i<valors.length; i++)
		{
			if (capa.attributes[i_estil_o_atrib].FormulaConsulta.indexOf("v["+i+"]")!=-1)
				v[i]=true;
		}
		return v;
	}

	if (!ParamCtrl.capa[i_capa].estil || ParamCtrl.capa[i_capa].estil.length<=i_estil_o_atrib)
		return v;

	var component=ParamCtrl.capa[i_capa].estil[i_estil_o_atrib].component, i_c;

	for (i_c=0; i_c<component.length; i_c++)
	{
		if (component[i_c].calcul && !component[i_c].FormulaConsulta)
			component[i_c].FormulaConsulta=DonaFormulaConsultaDesDeCalcul(component[i_c].calcul, i_capa, i_estil_o_atrib);

		if (component[i_c].FormulaConsulta)
		{
			ActualitzaSelectorsFormulaConsulta(component[i_c]);
			for (i=0; i<valors.length; i++)
			{
				if (component[i_c].FormulaConsulta.indexOf("v["+i+"]")!=-1)
					v[i]=true;
			}
		}
		else if (typeof component[i_c].i_valor !== "undefined" && component[i_c].i_valor!=null)
		{
			if (component[i_c].i_valor<0 || component[i_c].i_valor>=valors.length)
			{
				alert("i_valor " + component[i_c].i_valor + " in 'component[" + i_c + "]' in capa" + i_capa + " estil " + i_estil_o_atrib + " is out of range");
				continue;
			}
			v[component[i_c].i_valor]=true;
		}
		else
			v[0]=true;
	}
	return v;
}

function DonaEstilDadesBinariesCapa(i_nova_vista, i_capa)
{
var valors=ParamCtrl.capa[i_capa].valors, i_v;

	if (i_nova_vista==NovaVistaPrincipal || i_nova_vista==NovaVistaImprimir || i_nova_vista==NovaVistaRodet)  //L'estil d'impressió i de visualització són els mateixos
		return ParamCtrl.capa[i_capa].i_estil;
	else
	{
		for (i_v=0; i_v<valors.length; i_v++)
		{
			if (valors[i_v].nova_capa && valors[i_v].nova_capa[i_nova_vista] && typeof valors[i_v].nova_capa[i_nova_vista].arrayBuffer!=="undefined")
				return valors[i_v].nova_capa[i_nova_vista].i_estil;
		}
	}
	return ParamCtrl.capa[i_capa].i_estil;  //Per aquí no s'hauria de sortir mai.
}

//Aquesta funció, de moment només s'usa en les consultes.
function HiHaDadesBinariesPerAquestaCapa(i_nova_vista, i_capa)
{
var valors=ParamCtrl.capa[i_capa].valors, i_v, v, i_estil;

	if (!valors)
		return false;

	i_estil=DonaEstilDadesBinariesCapa(i_nova_vista, i_capa);

	v=DeterminaArrayValorsNecessarisCapa(i_capa, i_estil);

	//Comprovo que tinc les bandes que necessito:
	if (i_nova_vista==NovaVistaPrincipal)
	{
		for (i_v=0; i_v<valors.length; i_v++)
		{
			if (v[i_v] && !valors[i_v].arrayBuffer)
				return false;
		}
	}
	/*else if (i_nova_vista==NovaVistaImprimir)
	{
		for (i_v=0; i_v<valors.length; i_v++)
		{
			if (v[i_v] && !valors[i_v].arrayBufferPrint)
				return false;
		}
	}*/
	else
	{
		for (i_v=0; i_v<valors.length; i_v++)
		{
			if (v[i_v] && (!valors[i_v].nova_capa || !valors[i_v].nova_capa[i_nova_vista] || !valors[i_v].nova_capa[i_nova_vista].arrayBuffer))
				return false;
		}
	}
	return true;
}

//dv[] és null si la banda no està implicada en el dibuixat
function CarregaDataViewsCapa(dv, i_nova_vista, i_data, valors)
{
var n_v=0, i_v, array_buffer;

	for (i_v=0; i_v<valors.length; i_v++)
	{
		if (i_nova_vista==NovaVistaPrincipal)
			array_buffer=valors[i_v].arrayBuffer;
		else if (i_nova_vista==NovaVistaImprimir)
			array_buffer=valors[i_v].arrayBufferPrint;
		else if (i_nova_vista==NovaVistaRodet)
			array_buffer=valors[i_v].capa_rodet[i_data].arrayBuffer;
		else if (i_nova_vista==NovaVistaVideo)
			array_buffer=valors[i_v].capa_video[i_data].arrayBuffer;
		else
			array_buffer=(valors[i_v].nova_capa && valors[i_v].nova_capa[i_nova_vista] && valors[i_v].nova_capa[i_nova_vista].arrayBuffer) ? valors[i_v].nova_capa[i_nova_vista].arrayBuffer : null;
		if (array_buffer && array_buffer.byteLength)
		{
			dv[i_v]=new DataView(array_buffer);
			n_v++;
		}
		else
			dv[i_v]=null;
	}
	return n_v;
}

/*v[] és undefined si la banda no està implicada en el dibuixat i null si el valor és nodata.
i_data és útil per a construir series temporals però pot ser null per a triar la data actual.
Aquesta funció no es fa servir en el dibuixat sino només en les consultes*/
function DonaValorsDeDadesBinariesCapa(i_nova_vista, capa, i_data, i_col, i_fil)
{
var i_v, comptador, vista, dv=[], n_v_plena, v=[], i_nodata;
var valors=capa.valors;

	vista=DonaVistaDesDeINovaVista(i_nova_vista);

	n_v_plena=CarregaDataViewsCapa(dv, i_nova_vista, i_data, valors);
	if (n_v_plena==0)
		return null;
	//n_v--;

	for (i_v=0; i_v<valors.length; i_v++)
	{
		if (dv[i_v])
		{
			v[i_v]=DonaValorBandaDeDadesBinariesCapa(dv[i_v], valors[i_v].compression, valors[i_v].datatype, vista.ncol, i_col, i_fil);
			var nodata=valors[i_v].nodata;
			if (nodata)
			{
				i_nodata=nodata.indexOf(v[i_v]);
				if (i_nodata>=0)
					v[i_v]=null;
			}
		}
		//else v[i_v] queda a undefined deliveradament.
	}
	return v;
}

//Retorna els valors de les compoments com a text. Els valors es poden obtenir de DonaValorsDeDadesBinariesCapa()
function DonaValorEstilComATextDesDeValorsCapa(i_nova_vista, i_capa, v, compacte)
{
var capa=ParamCtrl.capa[i_capa], estil, component, valors=capa.valors, valor, i_v, i_c, i_a, i_valor, v_c;

	if (v==null)
		return "";

	estil=capa.estil[DonaEstilDadesBinariesCapa(i_nova_vista, i_capa)]
	component=estil.component;

	v_c=DonaValorEstilComArrayDesDeValorsCapa(i_nova_vista, i_capa, -1, v)

	if (v_c==null)
		return "";

	if (component.length==1 || component.length==2)
	{
		if (estil.categories && estil.attributes)
			return DonaTextCategoriaDesDeColor(estil.categories, estil.attributes, v_c[0], false, compacte);
		return (typeof component[0].NDecimals!=="undefined" && component[0].NDecimals!=null) ? OKStrOfNe(v_c[0], component[0].NDecimals) : v_c[0].toString();
	}
	var cdns=[];
	for (i_c=0; i_c<component.length; i_c++)
	{
		if (v_c[i_c]==null)
			cdns.push("");
		else
			cdns.push((typeof component[i_c].NDecimals!=="undefined" && component[i_c].NDecimals!=null) ? OKStrOfNe(v_c[i_c], component[i_c].NDecimals) : v_c[i_c]);
	}
	return cdns.join(", ");
}

//Retorna els valors de les compoments com a un array (un per cada component). Els valors es poden obtenir de DonaValorsDeDadesBinariesCapa()
function DonaValorEstilComArrayDesDeValorsCapa(i_nova_vista, i_capa, i_estil, v)
{
var capa=ParamCtrl.capa[i_capa], estil, component, valors=capa.valors, valor, i_v, i_c, i_a, i_valor;

	estil=capa.estil[(i_estil==-1) ? DonaEstilDadesBinariesCapa(i_nova_vista, i_capa) : i_estil]
	component=estil.component;

	for (i_v=0; i_v<valors.length; i_v++)
	{
	    if (typeof v[i_v]==="undefined")
			continue;
		if (v[i_v]==null)
			return null;
	}

	if (component.length==1)
	{
		if (component[0].formulaInterna)
		{
			valor=eval(component[0].formulaInterna);
			if (isNaN(valor) || valor==null)
				return null;
			return [valor];
		}
		i_valor=component[0].i_valor ? component[0].i_valor: 0;
		return [v[i_valor]];
	}
	var v_c=[];
	for (i_c=0; i_c<component.length; i_c++)
	{
		if (component[i_c].formulaInterna)
		{
			valor=eval(component[i_c].formulaInterna);
			if (isNaN(valor) || valor==null)
				v_c[i_c]=null;
			else
				v_c[i_c]=valor;
		}
		else if (component[i_c].i_valor)
			v_c[i_c]=v[component[i_c].i_valor];
		else
			v_c[i_c]=v[0];
	}
	return v_c;
}

function DonaBytesDataType(datatype)
{
	if (!datatype || datatype=="int8" || datatype=="uint8")
		return 1;
	if (datatype=="int16" || datatype=="uint16")
		return 2;
	if (datatype=="int32" || datatype=="uint32" || datatype=="float32")
		return 4;
	if (datatype=="float64")
		return 8;
	return 1;
}

function DonaFuncioDonaNumeroDataView(dv, datatype)
{
	if (!datatype)
		return dv.getUint8;	
	if (datatype=="int8")
		return dv.getInt8;
	if (datatype=="uint8")
		return dv.getUint8;
	if (datatype=="int16")
		return dv.getInt16;
	if (datatype=="uint16")
		return dv.getUint16;
	if (datatype=="int32")
		return dv.getInt32;
	if (datatype=="uint32")
		return dv.getUint32;
	if (datatype=="float32")
		return dv.getFloat32;
	if (datatype=="float64")
		return dv.getFloat64;
	return dv.getUint8;
}

function DonaFuncioPosaNumeroDataView(dv, datatype)
{
	if (!datatype)
		return dv.setUint8;	
	if (datatype=="int8")
		return dv.setInt8;
	if (datatype=="uint8")
		return dv.setUint8;
	if (datatype=="int16")
		return dv.setInt16;
	if (datatype=="uint16")
		return dv.setUint16;
	if (datatype=="int32")
		return dv.setInt32;
	if (datatype=="uint32")
		return dv.setUint32;
	if (datatype=="float32")
		return dv.setFloat32;
	if (datatype=="float64")
		return dv.setFloat64;
	return dv.setUint8;
}

var littleEndian = true;  //Constant

function DonaValorBandaDeDadesBinariesCapa(dv, compression, datatype, ncol, i_col, i_fil)
{
var j, i, comptador, acumulat, i_byte=0, bytesDadaType=DonaBytesDataType(datatype);

	dv.donaNumero=DonaFuncioDonaNumeroDataView(dv, datatype);

	//Aquesta funció es podria millorar verificant i el que retorna el servidor és un RLE indexat. De moment no ho faig.
	if (compression && compression=="RLE")
	{
		for (j=0;j<i_fil+1;j++)
		{
			acumulat=0;
			while (acumulat < ncol)
			{
				comptador=dv.getUint8(i_byte, littleEndian);
				i_byte++;
				if (comptador==0) /* Tros sense comprimir */
				{ /* La següent lectura de comptador no diu "quants de repetits vénen a continuació" sinó "quants de descomprimits en format ràster típic" */
					comptador=dv.getUint8(i_byte, littleEndian);
					i_byte++;
					acumulat += comptador;

					if (j==i_fil && i_col<acumulat)
					{
						//Ara toca llegir el valor
						i=comptador-acumulat+i_col;
						return dv.donaNumero(i_byte+i*bytesDadaType, littleEndian);
					}
					else
					{
						//Toca saltar.
						i_byte+=bytesDadaType*comptador;
					}
				}
				else
				{
					acumulat += comptador;

					if (j==i_fil && i_col<acumulat)
					{
						return dv.donaNumero(i_byte, littleEndian);
					}
					else
					{
						i_byte+=bytesDadaType;
					}
               			}
			}
		}
		return 0; //No s'hauria de sortir mai per aquí
	}
	return dv.donaNumero((i_fil*ncol+i_col)*bytesDadaType, littleEndian);
}

function ErrorImatgeBinariaCapaCallback(text, extra_param)
{
	alert(text);

	if (!extra_param)
		return;

	var valors=ParamCtrl.capa[extra_param.i_capa].valors
	CanviaEstatEventConsola(null, extra_param.i_event, EstarEventError);

	//arrayBuffer és "undefined" si la banda no està implicada al dibuixat. No em queda més remei que fer això.
	//Carrego la banda que m'ha passat
	if (extra_param.vista.i_nova_vista==NovaVistaPrincipal)
		delete valors[extra_param.i_valor].arrayBuffer;
	else if (extra_param.vista.i_nova_vista==NovaVistaImprimir)
		delete valors[extra_param.i_valor].arrayBufferPrint;
	else if (extra_param.vista.i_nova_vista==NovaVistaRodet)
		delete valors[extra_param.i_valor].capa_rodet[extra_param.i_data].arrayBuffer;
	else if (extra_param.vista.i_nova_vista==NovaVistaVideo)
		delete valors[extra_param.i_valor].capa_video[extra_param.i_data].arrayBuffer;
	else
		delete valors[extra_param.i_valor].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer;
}

//No substitueix el nodata.
function OmpleMultiFilaDVDesDeBinaryArray(fila, dv, valors, ncol, i_byte, i_cell)
{
var i_v, v_i, dv_i, valors_i, nodata, dtype, i, acumulat, comptador, n_v=valors.length;

	//Primer llegim totes les bandes de les files
	for (i_v=0; i_v<n_v; i_v++)
	{
		if (dv[i_v]==null)
			continue;
		dv_i=dv[i_v];
		valors_i=valors[i_v];
		dtype=valors_i.datatype
		if (!dtype)
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getUint8(i_byte[i_v], littleEndian);
							i_byte[i_v]++;
						}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getUint8(i_cell[i_v], littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="int8")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getInt8(i_byte[i_v], littleEndian);
							i_byte[i_v]++;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getInt8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getInt8(i_cell[i_v], littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="uint8")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getUint8(i_byte[i_v], littleEndian);
							i_byte[i_v]++;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getUint8(i_cell[i_v], littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="int16")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getInt16(i_byte[i_v], littleEndian);
							i_byte[i_v]+=2;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getInt16(i_byte[i_v], littleEndian);
						i_byte[i_v]+=2;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getInt16(i_cell[i_v]*2, littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="uint16")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getUint16(i_byte[i_v], littleEndian);
							i_byte[i_v]+=2;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getUint16(i_byte[i_v], littleEndian);
						i_byte[i_v]+=2;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
					}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getUint16(i_cell[i_v]*2, littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="int32")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getInt32(i_byte[i_v], littleEndian);
							i_byte[i_v]+=4;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getInt32(i_byte[i_v], littleEndian);
						i_byte[i_v]+=4;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getInt32(i_cell[i_v]*4, littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="uint32")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getUint32(i_byte[i_v], littleEndian);
							i_byte[i_v]+=4;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getUint32(i_byte[i_v], littleEndian);
						i_byte[i_v]+=4;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getUint32(i_cell[i_v]*4, littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="float32")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getFloat32(i_byte[i_v], littleEndian);
							i_byte[i_v]+=4;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getFloat32(i_byte[i_v], littleEndian);
						i_byte[i_v]+=4;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getFloat32(i_cell[i_v]*4, littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else if (dtype=="float64")
		{
			if (valors_i.compression && valors_i.compression=="RLE")
			{
				i=0;
				acumulat=0;
				while (i < ncol)
				{
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					if (comptador==0) /* Tros sense comprimir */
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						acumulat += comptador;

						for ( ; i<acumulat; i++)
									{
							fila[i][i_v]=dv_i.getFloat64(i_byte[i_v], littleEndian);
							i_byte[i_v]+=8;
								}
					}
					else
					{
						acumulat += comptador;
						v_i=dv_i.getFloat64(i_byte[i_v], littleEndian);
						i_byte[i_v]+=8;
						for ( ; i<acumulat; i++)
							fila[i][i_v]=v_i;
							}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					fila[i][i_v]=dv_i.getFloat64(i_cell[i_v]*8, littleEndian);
					i_cell[i_v]++;
				}
			}
		}
		else
		{
			alert(dtype + " " + GetMessage("neitherRecognizedNorImplemented") + ".");
			return;
		}
	}
}

function FilaFormulaConsultaDesDeMultiFila(fila_calc, i_data_video, histograma, fila, dv, valors, ncol, component0)
{
var valor0, v, i_v, i, i_nodata, nodata, n_v=valors.length;

	for (i=0;i<ncol;i++)
	{
		v=fila[i];
		i_nodata=-1;
		for (i_v=0;i_v<n_v;i_v++)
		{
			if (dv[i_v]==null)
				continue;
			nodata=valors[i_v].nodata;
			if (nodata)
			{
				i_nodata=nodata.indexOf(v[i_v]);
				if (i_nodata>=0)
					break;
			}
		}
		if (i_nodata>=0)
		{
			if (histograma)
				histograma.classe_nodata++;
			fila_calc[i][i_data_video]=null;
		}
		else
		{
			valor0=eval(component0.formulaInterna);
			if (isNaN(valor0) || valor0==null)
			{
				if (histograma)
					histograma.classe_nodata++;
				fila_calc[i][i_data_video]=null;
			}
			else
			{
				if (histograma)
				{
					if (histo_component0.valorMinimReal>valor0)
						histo_component0.valorMinimReal=valor0;
					if (histo_component0.valorMaximReal<valor0)
						histo_component0.valorMaximReal=valor0;
					if (histo_component0.sumaValorsReal) //si s'ha inicialitzat és que estic en un context que té sentit
						histo_component0.sumaValorsReal+=valor0;
				}
				fila_calc[i][i_data_video]=valor0;
			}
		}
	}
}

//No suporta combinacions RGB
function CalculaFilaDesDeBinaryArrays(fila_calc, i_data_video, histograma, dv, valors, ncol, i_byte, i_cell, component0)
{
var v=[], i_v, dv_i, bytesDadaType_i, valors_i, valor0, i_nodata, nodata, i, acumulat, comptador, i_col=0, n_v=valors.length;

	for (i_v=0;i_v<n_v;i_v++)
	{
		if (dv[i_v]==null)
			continue;
		dv_i=dv[i_v];
		valors_i=valors[i_v];
		nodata=valors_i.nodata;
		dv_i.donaNumero_i=DonaFuncioDonaNumeroDataView(dv_i, valors_i.datatype);
		bytesDadaType_i=DonaBytesDataType(valors_i.datatype);
		if (valors_i.compression && valors_i.compression=="RLE")
		{
			i=0;
			acumulat=0;
			while (i < ncol)
			{
				comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
				i_byte[i_v]++;
				if (comptador==0) /* Tros sense comprimir */
				{ /* La següent lectura de comptador no diu "quants de repetits vénen a continuació" sinó "quants de descomprimits en format ràster típic" */
					comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
					i_byte[i_v]++;
					acumulat += comptador;

					for ( ; i<acumulat; i++)
					{
						v[i_v]=dv_i.donaNumero_i(i_byte[i_v], littleEndian); 
						i_byte[i_v]+=bytesDadaType_i;
						i_nodata=-1;
						if (nodata)
							i_nodata=nodata.indexOf(v[i_v]);
						if (i_nodata>=0)
						{
							if (histograma)
								histograma.classe_nodata++;
							fila_calc[i_col][i_data_video]=null;
						}
						else
						{
							if (component0.formulaInterna)
								valor0=eval(component0.formulaInterna);
							else
								valor0=v[i_v];
							if (isNaN(valor0) || valor0==null)
							{
								if (histograma)
									component0.histograma_nodata++;
								fila_calc[i_col][i_data_video]=null;
							}
							else
							{
								if (histograma)
								{
									if (histo_component0.valorMinimReal>valor0)
										histo_component0.valorMinimReal=valor0;
									if (histo_component0.valorMaximReal<valor0)
										histo_component0.valorMaximReal=valor0;
									if (histo_component0.sumaValorsReal) //si s'ha inicialitzat és que estic en un context que té sentit
										histo_component0.sumaValorsReal+=valor0;
								}
								fila_calc[i_col][i_data_video]=valor0;
							}
						}
						i_col++;
					}
				}
				else
				{
					acumulat += comptador;
					v[i_v]=dv_i.donaNumero_i(i_byte[i_v], littleEndian); 
					i_byte[i_v]+=bytesDadaType_i;
					i_nodata=-1;
					if (nodata)
						i_nodata=nodata.indexOf(v[i_v]);
					if (i_nodata>=0)
					{
						if (histograma)
							histograma.classe_nodata+=comptador;
						for ( ; i<acumulat; i++)
						{
							fila_calc[i_col][i_data_video]=null;
							i_col++;
						}
					}
					else
					{
						if (component0.formulaInterna)
							valor0=eval(component0.formulaInterna);
						else
							valor0=v[i_v];
						if (isNaN(valor0) || valor0==null)
						{
							if (histograma)
								histograma.classe_nodata+=comptador;
							for ( ; i<acumulat; i++)
							{
								fila_calc[i_col][i_data_video]=null;
								i_col++;
							}
						}
						else
						{
							if (histograma)
							{
								if (histo_component0.valorMinimReal>valor0)
									histo_component0.valorMinimReal=valor0;
								if (histo_component0.valorMaximReal<valor0)
									histo_component0.valorMaximReal=valor0;
								if (histo_component0.sumaValorsReal) //si s'ha inicialitzat és que estic en un context que té sentit
									histo_component0.sumaValorsReal+=valor0*comptador;
							}
							for ( ; i<acumulat; i++)
							{
								fila_calc[i_col][i_data_video]=valor0;
								i_col++;
							}
						}
					}
				}
			}
		}
		else
		{
			for (i=0;i<ncol;i++)
			{
				v[i_v]=dv_i.donaNumero_i(i_cell[i_v]*bytesDadaType_i, littleEndian); 
				i_cell[i_v]++;
				i_nodata=-1;
				if (nodata)
					i_nodata=nodata.indexOf(v[i_v]);
				if (i_nodata>=0)
				{
					if (histograma)
						histograma.classe_nodata++;
					fila_calc[i][i_data_video]=null;
				}
				else
				{
					if (component0.formulaInterna)
						valor0=eval(component0.formulaInterna);
					else
						valor0=v[i_v];
					if (isNaN(valor0) || valor0==null)
					{
						if (histograma)
							histograma.classe_nodata++;
						fila_calc[i][i_data_video]=null;
					}
					else
					{
						if (histograma)
						{
							if (histo_component0.valorMinimReal>valor0)
								histo_component0.valorMinimReal=valor0;
							if (histo_component0.valorMaximReal<valor0)
								histo_component0.valorMaximReal=valor0;
							if (histo_component0.sumaValorsReal) //si s'ha inicialitzat és que estic en un context que té sentit
								histo_component0.sumaValorsReal+=valor0;
						}
						fila_calc[i][i_data_video]=valor0;
					}
				}
			}
		}
	}
}

function CalculaImatgeEstadisticaDesDesDeFilaCalc(img_stat, i_fil, histograma, fila_calc, ncol, f_estad, f_estad_param)
{
var i_cell_ini=i_fil*ncol, i, valor0, histo_component0=histograma ? histograma.component[0] : null;

	for (i=0;i<ncol;i++)
	{
		valor0=img_stat[i_cell_ini+i]=f_estad ? f_estad(fila_calc[i], f_estad_param) : fila_calc[i][0];
		if (histograma)
		{
			if (valor0==null || isNaN(valor0))
				histograma.classe_nodata++;
			else
			{
				if (histo_component0.valorMinimReal>valor0)
					histo_component0.valorMinimReal=valor0;
				if (histo_component0.valorMaximReal<valor0)
					histo_component0.valorMaximReal=valor0;
				if (histo_component0.sumaValorsReal) //si s'ha inicialitzat és que estic en un context que té sentit
					histo_component0.sumaValorsReal+=valor0;
			}
		}
	}
	return;
}

function DonaDataCanvasDesDeArrayNumericIPaleta(data, histograma, img_stat, ncol, nfil, estiramentPaleta, paleta)
{
var colors, ncolors, i_color0;
var j, i, a0, valor_min0, valor0, bigint;
var histo_component0, classe0;

	colors=(paleta && paleta.colors) ? paleta.colors : null;
	ncolors=colors ? colors.length : 256;
	/*if (colors)
	{
		for (i_color0=0; i_color0<ncolors; i_color0++)
		{
			if (colors[i_color0].charAt(0)!="#")
				alert(GetMessage("UnsupportedColor","imgrle") + ": " + colors[i_color0] + ". " + GetMessage("UseTheFormat") + ": #RRGGBB");
		}
	}*/
	a0=DonaFactorAEstiramentPaleta(estiramentPaleta, ncolors);
	valor_min0=DonaFactorValorMinEstiramentPaleta(estiramentPaleta);
	if (histograma)
	{
		histograma.classe_nodata=0;
		histograma.component=[{
					"classe": [],
					"valorMinimReal": +1e300,
					"valorMaximReal": -1e300,
					"sumaValorsReal": 0 //·$· quan passo per aquesta funció segur que és QC i té sentit fer això, oi?
				}];
		histo_component0=histograma.component[0];
		classe0=histo_component0.classe;
		for (i_color0=0; i_color0<ncolors; i_color0++)
			classe0[i_color0]=0;
	}
	for (j=0;j<nfil;j++)
	{
		//Passem la fila a colors RGB
		for (i=0;i<ncol;i++)
		{
			valor0=img_stat[j*ncol+i];
			if (valor0==null || isNaN(valor0))
			{
				if (histograma)
					histograma.classe_nodata++;
				data.push(255,255,255,0);
			}
			else
			{
				if (histograma)
				{
					if (histo_component0.valorMinimReal>valor0)
						histo_component0.valorMinimReal=valor0;
					if (histo_component0.valorMaximReal<valor0)
						histo_component0.valorMaximReal=valor0;
					histo_component0.sumaValorsReal+=valor0;	//·$· quan passo per aquesta funció segur que és QC i té sentit fer això, oi?
				}
				i_color0=Math.floor(a0*(valor0-valor_min0));
				if (i_color0>=ncolors)
					i_color0=ncolors-1;
				else if (i_color0<0)
					i_color0=0;
				if (histograma)
					classe0[i_color0]++;
				if (colors)
				{
					bigint = parseInt(colors[i_color0].substring(1), 16);
					data.push((bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255);
				}
				else
					data.push(i_color0, i_color0, i_color0, 255);
			}
		}
	}
}

function PrepararCalculIlluminacio(costat, f, elev_graus, az_graus)
{
	var dist=2.0*costat/(f?f:1);
	var elev=(elev_graus?elev_graus:45)*Math.PI/180;
	var az=((typeof az_graus==="undefined" || az_graus===null)?225:az_graus)*Math.PI/180;

	return {dist2: dist*dist,
		k1: Math.cos(elev)*Math.cos(Math.PI-az),
		k2: Math.cos(elev)*Math.sin(Math.PI-az),
		k3: Math.cos(elev)*Math.tan(elev)*dist}
}

function CalculaIlluminacioPunt(n, s, e, w, param)
{
	if (n==null || s==null || e==null || w==null)
		return null;
	var difv = n-s;
        var difh = w-e;
	var illum = (param.k1*difv+param.k2*difh+param.k3)/Math.sqrt(difv*difv+difh*difh+param.dist2);

	return illum<0 ? 0 : illum;
}

function CalculaIlluminacioImatge(imatge, ncol, nfil, param)
{
var img_illum=[];
	//Calculo els illuminacions de tota la imatge
	for (var j=1;j<nfil-1;j++)
	{
		var i_cell_ini=j*ncol, i_cell_ini_n=(j-1)*ncol, i_cell_ini_s=(j+1)*ncol;
		var ncol_1=ncol-1;
		for (var i=1; i<ncol_1; i++)
			img_illum[i_cell_ini+i]=CalculaIlluminacioPunt(imatge[i_cell_ini_n+i], imatge[i_cell_ini_s+i], imatge[i_cell_ini+i+1], imatge[i_cell_ini+i-1], param);
		img_illum[i_cell_ini]=img_illum[i_cell_ini+1]; //El primer punt repeteix del segon
		img_illum[i_cell_ini+i]=img_illum[i_cell_ini+i-1]; //El darrer punt repeteix del penúltim
	}
	//La primera final es repeteix de la segona. La darrera es repeteix de la penúltima
	var i_cell_ini=(nfil-1)*ncol; i_cell_ini_n=(nfil-2)*ncol;
	for (var i=0; i<ncol; i++)
	{
		img_illum[i]=img_illum[ncol+i]; //El primer punt repeteix del segon
		img_illum[i_cell_ini+i]=img_illum[i_cell_ini_n+i]; //El darrer punt repeteix del penúltim
	}
	return img_illum;
}

function ConstrueixImatgeCanvasIllum(data, histograma, ncol, nfil, dv, mes_duna_v, component, valors, paleta, categories)
{
var i_cell=[], i_byte=[], fila=[], fila_calc=[], imatge=[], img_illum=[];

	var param=PrepararCalculIlluminacio(ParamInternCtrl.vista.CostatZoomActual, component[0].illum.f, component[0].illum.elev, component[0].illum.az);

	for (var i_v=0; i_v<valors.length; i_v++)
	{
		i_cell[i_v]=0;
		i_byte[i_v]=0;
	}
	for (var i=0; i<ncol; i++)
	{
		fila_calc[i]=[];
		fila[i]=[];
	}
	for (var j=0;j<nfil;j++)
	{
		if (mes_duna_v)
		{
			OmpleMultiFilaDVDesDeBinaryArray(fila, dv, valors, ncol, i_byte, i_cell);
			FilaFormulaConsultaDesDeMultiFila(fila_calc, 0, null, fila, dv, valors, ncol, component[0]);
		}
		else
		{
			CalculaFilaDesDeBinaryArrays(fila_calc, 0, null, dv, valors, ncol, i_byte, i_cell, component[0]);
		}
		CalculaImatgeEstadisticaDesDesDeFilaCalc(imatge, j, null, fila_calc, ncol, null, null);
	}

	img_illum=CalculaIlluminacioImatge(imatge, ncol, nfil, param);

	//Aplico la paleta i obtinc l'array de dades dins de 'data'
	DonaDataCanvasDesDeArrayNumericIPaleta(data, histograma, img_illum, ncol, nfil, component[0].estiramentPaleta, paleta);
	//Ara caldria guardar l'array de valors nous com una altre i_valor en l'array.
}


/*img_data és un Uint8ClampedArray que no suporta .push() però a canvi "it clamps input values between 0 and 255.
This is especially handy for Canvas image processing algorithms since now you don't have to manually clamp your
image processing math to avoid overflowing the 8-bit range.
'data' es un array de dades que servirà per enviar al canvas
'histograma' pot contenir una variable on escriure histograma. Pot ser null si es vol obtenir un histograma.
'dv' són les dades a treballar que seran explorades per funcions tipus dv[i].getUint8(). N'hi ha tantes com bades però moltes poden ser null si no apareixen a la formula. Es poden obtenir amb CarregaDataViewsCapa(dv, ...);
'mes_duna_v' Indica si hi ha més d'una dv[] carregada. Es pot fer servir CarregaDataViewsCapa()-1
'component' és capa.estil[i_estil].component
'valors' és capa.valors. No es mira la part on hi ha els arrays binaris perquè això està a dv.
'paleta' és capa.estil[i_estil].paleta*/
function ConstrueixImatgeCanvas(data, histograma, ncol, nfil, dv, mes_duna_v, component, valors, paleta, categories)
{
var i_cell=[], i_byte=[], j, i, CalculaFilaDesDeBinaryArraydv_i, i_c, valor0, valor1, i_color=[], i_color0, i_color1, a=[], a0, a1, valor_min=[], valor_min0, valor_min1, comptador, acumulat, bigint, fila=[], i_nodata, i_ndt, classe0, classe1;
var histo_component0, component0, component1, n_v=valors.length, dv_i, v=[];
var colors, ncolors, valors_i, nodata, una_component, bytesDadaType_i;

	for (var i_v=0; i_v<n_v; i_v++)
	{
		i_cell[i_v]=0;
		i_byte[i_v]=0;
	}
	if (mes_duna_v)
	{
		for (i=0; i<ncol; i++)
			fila[i]=[];
	}

	if (component.length==1 || component.length==2)
	{
		/*if (!estil.paleta || !estil.paleta.colors)
		{
			alert(GetMessage("LayerSingleComponentNeedPallette", "imgrle") + ". (" + DonaCadenaNomDesc(capa) + ")");
			return;
		}*/
		component0=component[0];
		if (paleta && paleta.ramp && !paleta.colors)
		{
			if (TransformRampToColorsArray(paleta))
				return;
		}
		colors=(paleta && paleta.colors) ? paleta.colors : null;
		ncolors=colors ? colors.length : 256;
		if (colors)
		{
			var temp_color;
			for (i_color0=0; i_color0<ncolors; i_color0++)
			{
				if (typeof colors[i_color0]==="object")
					colors[i_color0]=RGB_JSON(colors[i_color0]);
				if (typeof colors[i_color0]!=="string" ||colors[i_color0].charAt(0)!="#")
				{
					alert(GetMessage("UnsupportedColor", "imgrle") + ": " + colors[i_color0] + ". " + GetMessage("UseTheFormat") + ": #RRGGBB");
					return;
				}
			}
		}
		a0=DonaFactorAEstiramentPaleta(component0.estiramentPaleta, ncolors);
		valor_min0=DonaFactorValorMinEstiramentPaleta(component0.estiramentPaleta);
		if (histograma)
		{
			//cal_histo=true;
			//component0.histograma=[];
			//component0.valorMinimReal=+1e300;
			if (categories) //si la component0 té categories, no cal calcular sumaValorsReal
			{
				histograma.component=[{
						"classe": [],
						"valorMinimReal": +1e300,
						"valorMaximReal": -1e300
					}];
			}
			else
			{
				histograma.component=[{
						"classe": [],
						"valorMinimReal": +1e300,
						"valorMaximReal": -1e300,
						"sumaValorsReal": 0
					}];
			}
			histo_component0=histograma.component[0];
			classe0=histo_component0.classe;
			for (i_color0=0; i_color0<ncolors; i_color0++)
				classe0[i_color0]=0;
		}
		if (component.length==2)
		{
			if (categories) //és una capa de transferència de camps estadístics a unes categories
			{
				component1=component[1];
				a1=DonaFactorAEstiramentPaleta(component1.estiramentPaleta, component1.herenciaOrigen.nColors);
				valor_min1=DonaFactorValorMinEstiramentPaleta(component1.estiramentPaleta);

				for (var i_categ=0; i_categ<categories.length; i_categ++)
				{
					if (!categories[i_categ])
						continue;
					categories[i_categ]["$stat$_histo"]={"classe": [], classe_nodata: 0}; // ·$· l'estructura de "pisos" és diferent en aquest histograma que en el "normal". És important? potser si si més endavant volem fer servir altres funcions?
					if (component1.herenciaOrigen.tractament!="categoric")
					{
						categories[i_categ]["$stat$_sum"]=0;
						categories[i_categ]["$stat$_min"]=1e300;
						categories[i_categ]["$stat$_max"]=-1e300;
					}
					var classe1=categories[i_categ]["$stat$_histo"].classe;
					for (i_color1=0; i_color1<component1.herenciaOrigen.nColors; i_color1++)
						classe1[i_color1]=0;
				}
			}
			else
			{
				alert(GetMessage("LayerMustHave1or3Components", "imgrle"));
				return;
			}
		}
	}
	else
	{
		if (histograma)
			histograma.component=[];
		for (i_c=0; i_c<3; i_c++)
		{
			a[i_c]=DonaFactorAEstiramentPaleta(component[i_c].estiramentPaleta, 256);
			valor_min[i_c]=DonaFactorValorMinEstiramentPaleta(component[i_c].estiramentPaleta);
			/*if (extra_param.vista.i_nova_vista!=NovaVistaImprimir && extra_param.vista.i_nova_vista!=NovaVistaRodet && extra_param.vista.i_nova_vista!=NovaVistaVideo)
			{
				cal_histo=true;
				component[i_c].histograma=[];
				component[i_c].valorMinimReal=+1e300;
				component[i_c].valorMaximReal=-1e300;
				component[i_c].sumaValorsReal=0;
				for (i_color0=0; i_color0<256; i_color0++)
					component[i_c].histograma[i_color0]=0;
			}*/
			if (histograma)
			{
				histograma.component[i_c]={
							"classe": [],
							"valorMinimReal": +1e300,
							"valorMaximReal": -1e300,
							"sumaValorsReal": 0		//si tinc tres components és que la variables és QC segur
						};
				classe0=histograma.component[i_c].classe;
				for (i_color0=0; i_color0<256; i_color0++)
					classe0[i_color0]=0;
			}
		}
	}

	//if (cal_histo)
	//estil.histograma_nodata=0;
	if (histograma)
		histograma.classe_nodata=0;

	una_component=(component.length==1)?true:false;

	if (mes_duna_v)
	{
		for (j=0;j<nfil;j++)
		{
			OmpleMultiFilaDVDesDeBinaryArray(fila, dv, valors, ncol, i_byte, i_cell)
			//Segon passem la fila a colors RGB
			if (una_component)
			{
				//Aquest codi és igual que FilaFormulaConsultaDesDeMultiFila() però sense passar a colors sino a una fila_calc
				for (i=0;i<ncol;i++)
				{
					v=fila[i];
					i_nodata=-1;
					for (i_v=0;i_v<n_v;i_v++)
					{
						if (dv[i_v]==null)
							continue;
						nodata=valors[i_v].nodata;
						if (nodata)
						{
							i_nodata=nodata.indexOf(v[i_v]);
							if (i_nodata>=0)
								break;
						}
					}
					if (i_nodata>=0)
					{
						if (histograma)
							histograma.classe_nodata++;
						data.push(255,255,255,0);
					}
					else
					{
						valor0=eval(component0.formulaInterna);
						if (isNaN(valor0) || valor0==null)
						{
							if (histograma)
								histograma.classe_nodata++;
							data.push(255,255,255,0);
						}
						else
						{
							if (histograma)
							{
								if (histo_component0.valorMinimReal>valor0)
									histo_component0.valorMinimReal=valor0;
								if (histo_component0.valorMaximReal<valor0)
									histo_component0.valorMaximReal=valor0;
								if (!categories)
									histo_component0.sumaValorsReal+=valor0;
							}
							i_color0=Math.floor(a0*(valor0-valor_min0));
							if (i_color0>=ncolors)
								i_color0=ncolors-1;
							else if (i_color0<0)
								i_color0=0;
							if (histograma)
								classe0[i_color0]++;
							if (colors)
							{
								bigint = parseInt(colors[i_color0].substring(1), 16);
								data.push((bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255);
							}
							else
								data.push(i_color0, i_color0, i_color0, 255);
						}
					}
				}
			}
			else if (component.length==2)
			{
				//Aquest codi és igual que FilaFormulaConsultaDesDeMultiFila() però sense passar a colors sino a una fila_calc
				for (i=0;i<ncol;i++)
				{
					v=fila[i];
					i_nodata=-1;
					for (i_v=0;i_v<n_v;i_v++)
					{
					  if (dv[i_v]==null)
							continue;
						nodata=valors[i_v].nodata;
						if (nodata)
						{
							i_nodata=nodata.indexOf(v[i_v]);
							if (i_nodata>=0)
								break;
						}
					}
					if (i_nodata>=0)
					{
						if (histograma)
							histograma.classe_nodata++;
						data.push(255,255,255,0);
					}
					else
					{
						if (component0.formulaInterna)
							valor0=eval(component0.formulaInterna);
						else if (component0.i_valor)
							valor0=v[component0.i_valor];
						else
							valor0=v[0];

						if (isNaN(valor0) || valor0==null)
						{
							if (histograma)
								histograma.classe_nodata++;
							data.push(255,255,255,0);
						}
						else
						{
							if (component1.formulaInterna)
								valor1=eval(component1.formulaInterna);
							else if (component1.i_valor)
								valor1=v[component1.i_valor];
							else
								valor1=v[1];

							if (isNaN(valor1) || valor1==null)
								categories[valor0]["$stat$_histo"].classe_nodata++
							else //if (!isNaN(valor1) && valor1!=null)
							{
								// ara valor0 conté el valor de l'array de categories i valor1 conté la variable de la qual s'han de fer estadístiques

								// creo histograma de la component1 per la categoria categories[valor0]
								i_color1=Math.floor(a1*(valor1-valor_min1));
								if (i_color1>=component1.herenciaOrigen.nColors)
									i_color1=component1.herenciaOrigen.nColors-1;
								else if (i_color1<0)
									i_color1=0;
								if (valor0<categories.length)
								{
									categories[valor0]["$stat$_histo"].classe[i_color1]++;

									//calculo el min, max i sum de la component1 per la categoria categories[valor0]
									if (component1.herenciaOrigen.tractament!="categoric")
									{
										if (categories[valor0]["$stat$_min"]>valor1)
											categories[valor0]["$stat$_min"]=valor1;
										if (categories[valor0]["$stat$_max"]<valor1)
											categories[valor0]["$stat$_max"]=valor1;
										categories[valor0]["$stat$_sum"]+=valor1;
									}
								}
							}

							if (histograma)
							{
								if (histo_component0.valorMinimReal>valor0)
									histo_component0.valorMinimReal=valor0;
								if (histo_component0.valorMaximReal<valor0)
									histo_component0.valorMaximReal=valor0;
								if (!categories)
									histo_component0.sumaValorsReal+=valor0;
							}
							i_color0=Math.floor(a0*(valor0-valor_min0));
							if (i_color0>=ncolors)
								i_color0=ncolors-1;
							else if (i_color0<0)
								i_color0=0;
							if (histograma)
								classe0[i_color0]++;
							if (colors)
							{
								bigint = parseInt(colors[i_color0].substring(1), 16);
								data.push((bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255);
							}
							else
								data.push(i_color0, i_color0, i_color0, 255);
						}
					}
				}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					v=fila[i];
					i_nodata=-1;
					for (i_v=0;i_v<n_v;i_v++)
					{
					        if (dv[i_v]==null)
							continue;
						nodata=valors[i_v].nodata;
						if (nodata)
						{
							i_nodata=nodata.indexOf(v[i_v]);
							if (i_nodata>=0)
								break;
						}
					}
					if (i_nodata>=0)
					{
						if (histograma)
							histograma.classe_nodata++;
						data.push(255, 255, 255, 0);
					}
					else
					{
						for (i_c=0; i_c<3; i_c++)
						{
							if (component[i_c].formulaInterna)
							{
								valor0=eval(component[i_c].formulaInterna);
								if (isNaN(valor0) || valor0==null)
								{
									if (histograma)
										histograma.classe_nodata++;
									for (; i_c<3; i_c++)
										data.push(255);
									data.push(0);
									break;
								}
							}
							else if (component[i_c].i_valor)
								valor0=v[component[i_c].i_valor];
							else
								valor0=v[0];
							if (histograma)
							{
								if (histograma.component[i_c].valorMinimReal>valor0)
									histograma.component[i_c].valorMinimReal=valor0;
								if (histograma.component[i_c].valorMaximReal<valor0)
									histograma.component[i_c].valorMaximReal=valor0;
								histograma.component[i_c].sumaValorsReal+=valor0;
							}
							i_color0=Math.floor(a[i_c]*(valor0-valor_min[i_c]));
							if (i_color0>=256)
								i_color0=255;
							else if (i_color0<0)
								i_color0=0;
							if (histograma)
								histograma.component[i_c].classe[i_color0]++;
							data.push(i_color0)
							if (i_c==2)
								data.push(255);
						}
					}
				}
			}
		} //End of for

 		if (component.length==2) //és una capa de transferència de camps estadístics a unes categories
		{
			var area_cella=DonaAreaCella({MinX: ParamInternCtrl.vista.EnvActual.MinX, MaxX: ParamInternCtrl.vista.EnvActual.MaxX, MinY: ParamInternCtrl.vista.EnvActual.MinY, MaxY: ParamInternCtrl.vista.EnvActual.MaxY},
					ParamInternCtrl.vista.CostatZoomActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)
			for (var i_categ=0; i_categ<categories.length; i_categ++)
			{
				if (!categories[i_categ])
					continue;

				if (component1.herenciaOrigen.tractament=="categoric")
				{
					var estad_cat=CalculaEstadisticsCategorics(categories[i_categ]["$stat$_histo"].classe);
					if (estad_cat.recompte)
					{
						categories[i_categ]["$stat$_i_mode"]=estad_cat.i_moda;
						categories[i_categ]["$stat$_mode"]=DonaTextCategoriaDesDeColor(component1.herenciaOrigen.categories, component1.herenciaOrigen.attributes, estad_cat.i_moda, true);
						categories[i_categ]["$stat$_percent_mode"]=categories[i_categ]["$stat$_histo"].classe[estad_cat.i_moda]/estad_cat.recompte*100;
					}
				}
				else
				{
					var stat=CalculaEstadisticsHistograma(categories[i_categ]["$stat$_histo"].classe, categories[i_categ]["$stat$_min"], categories[i_categ]["$stat$_max"], categories[i_categ]["$stat$_sum"]);
					if (stat.recompte!=0)
					{
						categories[i_categ]["$stat$_count"]=stat.recompte;
						categories[i_categ]["$stat$_sum_area"]=categories[i_categ]["$stat$_sum"]*area_cella;
						categories[i_categ]["$stat$_sum"]=categories[i_categ]["$stat$_sum"];
						categories[i_categ]["$stat$_range"]=categories[i_categ]["$stat$_max"]-categories[i_categ]["$stat$_min"]+1;
						categories[i_categ]["$stat$_min"]=categories[i_categ]["$stat$_min"];
						categories[i_categ]["$stat$_max"]=categories[i_categ]["$stat$_max"];
						categories[i_categ]["$stat$_mean"]=stat.mitjana;
						categories[i_categ]["$stat$_variance"]=stat.varianca;
						categories[i_categ]["$stat$_stdev"]=stat.desv_tipica;
					}
					else
					{
						delete categories[i_categ]["$stat$_histo"];
						delete categories[i_categ]["$stat$_sum"];
						delete categories[i_categ]["$stat$_min"];
						delete categories[i_categ]["$stat$_max"];
					}
				}
			}
	  	}
	}
	else
	{
		for (j=0;j<nfil;j++)
		{
			for (i_v=0;i_v<n_v;i_v++)
		   	{
			    if (dv[i_v]==null)
					continue;
				dv_i=dv[i_v];
				valors_i=valors[i_v];
				nodata=valors_i.nodata;
				dv_i.donaNumero_i=DonaFuncioDonaNumeroDataView(dv_i, valors_i.datatype);
				bytesDadaType_i=DonaBytesDataType(valors_i.datatype);
				if (valors_i.compression && valors_i.compression=="RLE")
				{
					i=0;
					acumulat=0;
					while (i < ncol)
					{
						comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
						i_byte[i_v]++;
						if (comptador==0) /* Tros sense comprimir */
						{ /* La següent lectura de comptador no diu "quants de repetits vénen a continuació" sinó "quants de descomprimits en format ràster típic" */
							comptador=dv_i.getUint8(i_byte[i_v], littleEndian);
							i_byte[i_v]++;
							acumulat += comptador;

							for ( ; i<acumulat; i++)
                		    			{
								v[i_v]=dv_i.donaNumero_i(i_byte[i_v], littleEndian);
								i_byte[i_v]+=bytesDadaType_i;
								i_nodata=-1;
								if (nodata)
									i_nodata=nodata.indexOf(v[i_v]);
								if (i_nodata>=0)
								{
									if (histograma)
										histograma.classe_nodata++;
									data.push(255,255,255,0);
								}
								else
								{
									if (una_component)
									{
										if (component0.formulaInterna)
											valor0=eval(component0.formulaInterna);
										else
											valor0=v[i_v];
										if (isNaN(valor0) || valor0==null)
										{
											if (histograma)
												component0.histograma_nodata++;
											data.push(255,255,255,0);
										}
										else
										{
											if (histograma)
											{
												if (histo_component0.valorMinimReal>valor0)
													histo_component0.valorMinimReal=valor0;
												if (histo_component0.valorMaximReal<valor0)
													histo_component0.valorMaximReal=valor0;
												if (!categories)
													histo_component0.sumaValorsReal+=valor0;
											}
											i_color0=Math.floor(a0*(valor0-valor_min0));
											if (i_color0>=ncolors)
												i_color0=ncolors-1;
											else if (i_color0<0)
												i_color0=0;
											if (histograma)
												classe0[i_color0]++;

											if (colors)
											{
												//From http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
												bigint = parseInt(colors[i_color0].substring(1), 16);
												data.push((bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255);
											}
											else
												data.push(i_color0, i_color0, i_color0, 255);
										}
									}
									else
									{
										for (i_c=0; i_c<3; i_c++)
										{
											if (component[i_c].formulaInterna)
											{
												valor0=eval(component[i_c].formulaInterna);
												if (isNaN(valor0) || valor0==null)
												{
													if (histograma)
														histograma.classe_nodata++;
													for (;i_c<3; i_c++)
														data.push(255);
													data.push(0);
													break;
												}
											}
											else
												valor0=v[i_v];
											if (histograma)
											{
												if (histograma.component[i_c].valorMinimReal>valor0)
													histograma.component[i_c].valorMinimReal=valor0;
												if (histograma.component[i_c].valorMaximReal<valor0)
													histograma.component[i_c].valorMaximReal=valor0;
												histograma.component[i_c].sumaValorsReal+=valor0;
											}
											i_color0=Math.floor(a[i_c]*(valor0-valor_min[i_c]));
											if (i_color0>=256)
												i_color0=255;
											else if (i_color0<0)
												i_color0=0;
											if (histograma)
												histograma.component[i_c].classe[i_color0]++;
											data.push(i_color0)
											if (i_c==2)
												data.push(255);
										}
									}
								}
							}
						}
						else
						{
							acumulat += comptador;
							v[i_v]=dv_i.donaNumero_i(i_byte[i_v], littleEndian);
							i_byte[i_v]+=bytesDadaType_i; 
							i_nodata=-1;
							if (nodata)
								i_nodata=nodata.indexOf(v[i_v]);
							if (i_nodata>=0)
							{
								if (histograma)
									histograma.classe_nodata+=comptador;
								for ( ; i<acumulat; i++)
									data.push(255,255,255,0);
							}
							else
							{
								if (una_component)
								{
									if (component0.formulaInterna)
										valor0=eval(component0.formulaInterna);
									else
										valor0=v[i_v];
									if (isNaN(valor0) || valor0==null)
									{
										if (histograma)
											histograma.classe_nodata+=comptador;
										for ( ; i<acumulat; i++)
											data.push(255,255,255,0);
									}
									else
									{
										if (histograma)
										{
											if (histo_component0.valorMinimReal>valor0)
												histo_component0.valorMinimReal=valor0;
											if (histo_component0.valorMaximReal<valor0)
												histo_component0.valorMaximReal=valor0;
											if (!categories)
												histo_component0.sumaValorsReal+=valor0*comptador;
										}
										i_color0=Math.floor(a0*(valor0-valor_min0));
										if (i_color0>=ncolors)
											i_color0=ncolors-1;
										else if (i_color0<0)
											i_color0=0;
										if (histograma)
											classe0[i_color0]+=comptador;
										if (colors)
										{
											bigint = parseInt(colors[i_color0].substring(1), 16);
											for ( ; i<acumulat; i++)
												data.push((bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255);
										}
										else
										{
											for ( ; i<acumulat; i++)
												data.push(i_color0,i_color0,i_color0,255);
										}
									}
								}
								else
								{
									for (i_c=0; i_c<3; i_c++)
									{
										if (component[i_c].formulaInterna)
										{
											valor0=eval(component[i_c].formulaInterna);
											if (isNaN(valor0) || valor0==null)
												break;
										}
										else
											valor0=v[i_v];
										if (histograma)
										{
											if (histograma.component[i_c].valorMinimReal>valor0)
												histograma.component[i_c].valorMinimReal=valor0;
											if (histograma.component[i_c].valorMaximReal<valor0)
												histograma.component[i_c].valorMaximReal=valor0;
											histograma.component[i_c].sumaValorsReal+=valor0*comptador;
										}
										i_color0=Math.floor(a[i_c]*(valor0-valor_min[i_c]));
										if (i_color0>=256)
											i_color0=255;
										else if (i_color0<0)
											i_color0=0;
										if (histograma)
											histograma.component[i_c].classe[i_color0]+=comptador;
										i_color[i_c]=i_color0;
									}
									if (i_c<3)
									{
										if (histograma)
											histograma.classe_nodata+=comptador;
										for ( ; i<acumulat; i++)
											data.push(255,255,255,0);
									}
									else
									{
										for ( ; i<acumulat; i++)
											data.push(i_color[0], i_color[1], i_color[2], 255);
									}
								}
							}
						}
					}
				}
				else
				{
					for (i=0;i<ncol;i++)
					{
						v[i_v]=dv_i.donaNumero_i(i_cell[i_v]*bytesDadaType_i, littleEndian);
						i_cell[i_v]++;
						i_nodata=-1;
						if (nodata)
							i_nodata=nodata.indexOf(v[i_v]);
						if (i_nodata>=0)
						{
							if (histograma)
								histograma.classe_nodata++;
							data.push(255,255,255,0);
						}
						else
						{
							if (una_component)
							{
								if (component0.formulaInterna)
									valor0=eval(component0.formulaInterna);
								else
									valor0=v[i_v];
								if (isNaN(valor0) || valor0==null)
								{
									if (histograma)
										histograma.classe_nodata++;
									data.push(255,255,255,0);
								}
								else
								{
									if (histograma)
									{
										if (histo_component0.valorMinimReal>valor0)
											histo_component0.valorMinimReal=valor0;
										if (histo_component0.valorMaximReal<valor0)
											histo_component0.valorMaximReal=valor0;
										if (!categories)
											histo_component0.sumaValorsReal+=valor0;
									}
									i_color0=Math.floor(a0*(valor0-valor_min0));
									if (i_color0>=ncolors)
										i_color0=ncolors-1;
									else if (i_color0<0)
										i_color0=0;
									if (histograma)
										classe0[i_color0]++;
									if (colors)
									{
										bigint = parseInt(colors[i_color0].substring(1), 16);
										data.push((bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255);
									}
									else
										data.push(i_color0, i_color0, i_color0, 255);
								}
							}
							else
							{
								for (i_c=0; i_c<3; i_c++)
								{
									if (component[i_c].formulaInterna)
									{
										valor0=eval(component[i_c].formulaInterna);
										if (isNaN(valor0) || valor0==null)
										{
											if (histograma)
												histograma.classe_nodata++;
											for (; i_c<3; i_c++)
												data.push(255);
											data.push(0);
											break;
										}
									}
									else
										valor0=v[i_v];
									if (histograma)
									{
										if (histograma.component[i_c].valorMinimReal>valor0)
											histograma.component[i_c].valorMinimReal=valor0;
										if (histograma.component[i_c].valorMaximReal<valor0)
											histograma.component[i_c].valorMaximReal=valor0;
										histograma.component[i_c].sumaValorsReal+=valor0;
									}
									i_color0=Math.floor(a[i_c]*(valor0-valor_min[i_c]));
									if (i_color0>=256)
										i_color0=255;
									else if (i_color0<0)
										i_color0=0;
									if (histograma)
										histograma.component[i_c].classe[i_color0]++;
									data.push(i_color0);
									if (i_c==2)
										data.push(255);
								}
							}
						}
					}
				}
			}
		}
	}
}

function CanviaImatgeBinariaCapaIndirectCallback(param)
{
	CanviaImatgeBinariaCapaCallback(param.dades, param.extra_param);
}

function CalEstiramentAutomaticPaleta(component)
{
	for (var i_c=0; i_c<component.length; i_c++)
	{
		if (component[i_c].estiramentPaleta && component[i_c].estiramentPaleta.auto)
			return true;
	}
	return false;
}

function DefineixEstiramentIniPaletaSiCal(component)
{
	for (var i_c=0; i_c<component.length; i_c++)
	{
		if (component[i_c].estiramentPaleta && component[i_c].estiramentPaleta.auto)
		{
			//Genero un ample gran per començar a determinar l'estirament necessari.
			component[i_c].estiramentPaleta.valorMaxim=1e+10;
			component[i_c].estiramentPaleta.valorMinim=-1e+10;
		}
	}
}

//return false, vol dir que no es pot fer l'estirament perquè hi ha massa poc valors
function AjustaEstiramentIniPaletaSiCal(histograma, component, paleta)
{
var c, histo, estadistics;
	for (var i_c=0; i_c<component.length; i_c++)
	{
		c=component[i_c];
		histo=histograma.component[i_c];
		if (c.estiramentPaleta && c.estiramentPaleta.auto)
		{
			if (c.estiramentPaleta.valorMaxim==1e+10 && c.estiramentPaleta.valorMinim==-1e+10)
			{
				c.estiramentPaleta.valorMinim=histo.valorMinimReal;
				c.estiramentPaleta.valorMaxim=histo.valorMaximReal;
			}
			else
			{
				if (c.estiramentPaleta.valorMinim==1e+300 && c.estiramentPaleta.valorMaxim==-1e+300)
					return false;
				estadistics=CalculaEstadisticsHistograma(histo.classe, c.estiramentPaleta.valorMinim, c.estiramentPaleta.valorMaxim, histo.sumaValorsReal);
				if (estadistics.recompte<histograma.classe_nodata/600)
					return false;  //Hi ha massa pocs valors per definir l'estirament
				c.estiramentPaleta.valorMinim=estadistics.mitjana-estadistics.desv_tipica*2;
				if (c.estiramentPaleta.valorMinim<histo.valorMinimReal)
					c.estiramentPaleta.valorMinim<histo.valorMinimReal;
				c.estiramentPaleta.valorMaxim=estadistics.mitjana+estadistics.desv_tipica*2;
				if (c.estiramentPaleta.valorMaxim>histo.valorMaximReal)
					c.estiramentPaleta.valorMaxim<histo.valorMaximReal;
				c.estiramentPaleta.auto=false;
			}
		}
	}
	return true;
}

function CanviaImatgeBinariaCapaCallback(dades, extra_param)
{
var i_v, dv=[], mes_duna_v;
var capa=ParamCtrl.capa[extra_param.i_capa], valors=capa.valors, n_v, n_v_plena;
var estil=capa.estil[extra_param.i_estil];
var histograma=null, imgData, ctx;
var data;
//cal_histo=false;

	if (typeof extra_param.i_event!=="undefined")
		CanviaEstatEventConsola(null, extra_param.i_event, EstarEventTotBe);

	//Carrego la banda que m'ha passat
	if (extra_param.vista.i_nova_vista==NovaVistaPrincipal)
		valors[extra_param.i_valor].arrayBuffer=dades;
	else if (extra_param.vista.i_nova_vista==NovaVistaImprimir)
		valors[extra_param.i_valor].arrayBufferPrint=dades;
	else if (extra_param.vista.i_nova_vista==NovaVistaRodet)
		valors[extra_param.i_valor].capa_rodet[extra_param.i_data].arrayBuffer=dades;
	else if (extra_param.vista.i_nova_vista==NovaVistaVideo)
		valors[extra_param.i_valor].capa_video[extra_param.i_data].arrayBuffer=dades;
	else
		valors[extra_param.i_valor].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer=dades;

	//Comprovo que tinc les bandes que necessito. Si no hi son, espero més.
	n_v=valors.length;
	var v=DeterminaArrayValorsNecessarisCapa(extra_param.i_capa, extra_param.i_estil);
	for (i_v=0; i_v<n_v; i_v++)
	{
		if (extra_param.vista.i_nova_vista==NovaVistaPrincipal)
		{
			if (v[i_v] && typeof valors[i_v].arrayBuffer!=="undefined" && valors[i_v].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==NovaVistaImprimir)
		{
			if (v[i_v] && typeof valors[i_v].arrayBufferPrint!=="undefined" && valors[i_v].arrayBufferPrint==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==NovaVistaRodet)
		{
			if (v[i_v] && typeof valors[i_v].capa_rodet[extra_param.i_data].arrayBuffer!=="undefined" && valors[i_v].capa_rodet[extra_param.i_data].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==NovaVistaVideo)
		{
			if (v[i_v] && typeof valors[i_v].capa_video[extra_param.i_data].arrayBuffer!=="undefined" && valors[i_v].capa_video[extra_param.i_data].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else
		{
			if (v[i_v] && typeof valors[i_v].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer!=="undefined" && valors[i_v].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
	}
  
	//Ara ha se que tinc el que necessito.	
	//Depen del ordre en que passen les coses s'arriba aquí quan ja s'ha demanat un altre redibuixat i aquest ja no està en sincronia amb l'actual contigut de la vista (que te les capes definides diferentment). 
	if (extra_param.imatge && extra_param.imatge.getContext)
	{
		//Decidim on en guarda l'histograma
		if (extra_param.vista.i_nova_vista==NovaVistaPrincipal)
			histograma=estil.histograma={};
		else if (extra_param.vista.i_nova_vista==NovaVistaRodet)
		{
			estil.capa_rodet[extra_param.i_data]={histograma: {}};
			histograma=estil.capa_rodet[extra_param.i_data].histograma;
		}
		else if (extra_param.vista.i_nova_vista==NovaVistaVideo)
		{
			estil.capa_video[extra_param.i_data]={histograma: {}};
			histograma=estil.capa_video[extra_param.i_data].histograma;
		}

		extra_param.imatge.width  = extra_param.vista.ncol;
		extra_param.imatge.height = extra_param.vista.nfil;

		ctx=extra_param.imatge.getContext("2d");
		ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);

		imgData=ctx.createImageData(extra_param.imatge.width,extra_param.imatge.height);

		n_v_plena=CarregaDataViewsCapa(dv, extra_param.vista.i_nova_vista, extra_param.i_data, valors);

		if (n_v_plena==0)
			return;

		DefineixEstiramentIniPaletaSiCal(estil.component);
		do {
			data=[]; //Empty the array;

			if (estil.component && estil.component.length==1 && estil.component[0].illum)
				ConstrueixImatgeCanvasIllum(data, histograma, imgData.width, imgData.height, dv, n_v_plena-1, estil.component, valors, estil.paleta, estil.categories);
			else
				ConstrueixImatgeCanvas(data, histograma, imgData.width, imgData.height, dv, n_v_plena-1, estil.component, valors, estil.paleta, estil.categories);

			if (CalEstiramentAutomaticPaleta(estil.component))
			{
				if (!AjustaEstiramentIniPaletaSiCal(histograma, estil.component, estil.paleta))
					break;
				ForcaRecalculItemLleg(estil);
			}
		} while (CalEstiramentAutomaticPaleta(estil.component))

		imgData.data.set(data);

		ctx.putImageData(imgData,0,0);
	}

	if (estil.diagrama && estil.diagrama.length>0)
	{
		var i_diagrama, i_histo;
		for (i_diagrama=0; i_diagrama<estil.diagrama.length; i_diagrama++)
		{
			DesactivaCheckITextUnChartMatriuDinamic(extra_param.i_capa, extra_param.i_estil, i_diagrama, false); //depèn de com he "tornat" a la visualització de la capa, potser encara estava "disabled"
			i_histo=estil.diagrama[i_diagrama].i_histograma;
			if (estil.diagrama[i_diagrama].tipus == "chart")
			{
				if (document.getElementById(DonaNomCheckDinamicHistograma(i_histo)).checked)
				{
					var retorn_prep_histo;
					// Desselecciona el checkbox per al tall de cues.

					if (DonaTipusGraficHistograma(estil,0)=="bar")
						document.getElementById(DonaNomCheckTrimTailsHistograma(i_histo)).checked=false;

					//actualitzo el/s gràfic/s i això també actualitza el text ocult de la finestra que es copia al portapapers
					for (var i_c=0; i_c<estil.component.length; i_c++)
					{
						retorn_prep_histo=PreparaHistograma(i_histo, i_c);
						HistogramaFinestra.vista[i_histo].chart[i_c].config.data.labels=retorn_prep_histo.labels;
						HistogramaFinestra.vista[i_histo].chart[i_c].config.data.valors=(retorn_prep_histo.valors ? retorn_prep_histo.valors : null);
						HistogramaFinestra.vista[i_histo].chart[i_c].config.data.datasets[0].data=retorn_prep_histo.data;
						HistogramaFinestra.vista[i_histo].chart[i_c].config.data.datasets[0].backgroundColor=retorn_prep_histo.colors;
						HistogramaFinestra.vista[i_histo].chart[i_c].config.data.datasets[0].unitats=retorn_prep_histo.unitats;
						HistogramaFinestra.vista[i_histo].chart[i_c].options=retorn_prep_histo.options;
						HistogramaFinestra.vista[i_histo].chart[i_c].update();
					}
				}
			}
			else if (estil.diagrama[i_diagrama].tipus == "chart_categ")
			{
				if (document.getElementById(DonaNomCheckDinamicHistograma(i_histo)).checked)
				{
					var retorn_prep_histo;
					//actualitzo el/s gràfic/s i això també actualitza el text ocult de la finestra que es copia al portapapers
					retorn_prep_histo=PreparaHistogramaPerCategories(i_histo, estil.diagrama[i_diagrama].stat, estil.diagrama[i_diagrama].order);
					//Gràfic de l'àrea
					HistogramaFinestra.vista[i_histo].chart[0].config.data.labels=retorn_prep_histo.labels;
					//HistogramaFinestra.vista[i_histo].chart[0].config.data.valors=(retorn_prep_histo.valors ? retorn_prep_histo.valors : null);
					HistogramaFinestra.vista[i_histo].chart[0].config.data.datasets[0].data=retorn_prep_histo.data_area;
					HistogramaFinestra.vista[i_histo].chart[0].config.data.datasets[0].backgroundColor=retorn_prep_histo.colors_area;
					HistogramaFinestra.vista[i_histo].chart[0].config.data.datasets[0].unitats=retorn_prep_histo.unitats_area;
					HistogramaFinestra.vista[i_histo].chart[0].options=retorn_prep_histo.options_area;
					HistogramaFinestra.vista[i_histo].chart[0].update();
					//Gràfic de l'estadístic
					HistogramaFinestra.vista[i_histo].chart[1].config.data.labels=retorn_prep_histo.labels;
					//HistogramaFinestra.vista[i_histo].chart[0].config.data.valors=(retorn_prep_histo.valors ? retorn_prep_histo.valors : null);
					HistogramaFinestra.vista[i_histo].chart[1].config.data.datasets[0].data=retorn_prep_histo.data_estad;
					HistogramaFinestra.vista[i_histo].chart[1].config.data.datasets[0].backgroundColor=retorn_prep_histo.colors_estad;
					HistogramaFinestra.vista[i_histo].chart[1].config.data.datasets[0].unitats=retorn_prep_histo.UoM_estad;
					HistogramaFinestra.vista[i_histo].chart[1].options=retorn_prep_histo.options_estad;
					HistogramaFinestra.vista[i_histo].chart[1].update();
				}
			}
			else if (estil.diagrama[i_diagrama].tipus == "matriu")
			{
				if (document.getElementById(DonaNomCheckDinamicHistograma(i_histo)).checked)
					document.getElementById(DonaNomMatriuConfusio(i_histo)).innerHTML=CreaTextMatriuDeConfusio(i_histo, true);
			}
			else if (estil.diagrama[i_diagrama].tipus == "stat")
			{
				if (document.getElementById(DonaNomCheckDinamicHistograma(i_histo)).checked)
					document.getElementById(DonaNomEstadistic(i_histo)).innerHTML=CreaTextEstadistic(i_histo, estil.diagrama[i_diagrama].stat);
			}
			else if (estil.diagrama[i_diagrama].tipus == "stat_categ")
			{
				if (document.getElementById(DonaNomCheckDinamicHistograma(i_histo)).checked)
					document.getElementById(DonaNomEstadistic(i_histo)).innerHTML=CreaTextEstadisticPerCategories(i_histo, estil.diagrama[i_diagrama].stat, estil.diagrama[i_diagrama].order);
			}
			else if (estil.diagrama[i_diagrama].tipus == "vista3d")
			{
				if (document.getElementById(DonaNomCheckDinamicGrafic3d(i_histo)).checked)
					CreaSuperficie3D(i_histo, true);
			}
		}
	}

	CanviaCursorSobreVista("auto");
	if (extra_param.nom_funcio_ok)
	{
		if (extra_param.funcio_ok_param!=null)
			extra_param.nom_funcio_ok(extra_param.funcio_ok_param);
		else
			extra_param.nom_funcio_ok();
	}
}

//Si imatge==null aquest funció no dibuixarà però servirà per carregar totes les bandes necessaries. Això és útil per attributes calculats de capes vectorials a partir de capes raster.
function CanviaImatgeBinariaCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param)
{
var i, i_event;
var i_estil2=(i_estil==-1) ? ParamCtrl.capa[i_capa].i_estil : i_estil;

	if (!ParamCtrl.capa[i_capa].estil || ParamCtrl.capa[i_capa].estil.length<=i_estil2)
		return;

	/*if (!estil.component)
	{
		alert(GetMessage("LayerIMGNoDefinesComponents", "imgrle") + "\n" + GetMessage("Layer") + " \"" + DonaCadena(ParamCtrl.capa[i_capa].desc));
		return;
	}*/
	//arrayBuffer és "undefined" si la banda no està implicada al dibuixat i null si encara no s'ha carregar però s'espera que ho faci.
	var valors=ParamCtrl.capa[i_capa].valors;
	//Determina les v[i] presents a l'expressió.
	var v=DeterminaArrayValorsNecessarisCapa(i_capa, i_estil2);

	if (vista.i_nova_vista==NovaVistaPrincipal)
	{
		for (i=0; i<valors.length; i++)
		{
			if (v[i])
				valors[i].arrayBuffer=null; //Marco que encara s'ha de fer
			else
			{
				if (valors[i].arrayBuffer)
					delete valors[i].arrayBuffer; //Marco que no es farà
			}
		}
	}
	else if (vista.i_nova_vista==NovaVistaImprimir)
	{
		for (i=0; i<valors.length; i++)
		{
			if (v[i])
				valors[i].arrayBufferPrint=null; //Marco que encara s'ha de fer
			else
			{
				if (valors[i].arrayBufferPrint)
					delete valors[i].arrayBufferPrint; //Marco que no es farà
			}
		}
	}
	else if (vista.i_nova_vista==NovaVistaRodet)
	{
		var estil=ParamCtrl.capa[i_capa].estil[i_estil2];
		if (!estil.capa_rodet)
			estil.capa_rodet=[];       //Preparo guardat els histogrames petits aquí dins.
		for (i=0; i<valors.length; i++)
		{
			if (!valors[i].capa_rodet)
				valors[i].capa_rodet=[];  //Preparo l'estructura
			if (!valors[i].capa_rodet[i_data])
				valors[i].capa_rodet[i_data]={}  //Preparo l'estructura
			if (v[i])
			{
				valors[i].capa_rodet[i_data].arrayBuffer=null;
				valors[i].capa_rodet[i_data].i_estil=i_estil2;
			}
			else
			{
				if (valors[i].capa_rodet[i_data].arrayBuffer)
					delete valors[i].capa_rodet[i_data].arrayBuffer;
			}
		}
	}
	else if (vista.i_nova_vista==NovaVistaVideo)
	{
		var estil=ParamCtrl.capa[i_capa].estil[i_estil2];
		if (!estil.capa_video)
			estil.capa_video=[];       //Preparo guardat els histogrames aquí dins.
		for (i=0; i<valors.length; i++)
		{
			if (!valors[i].capa_video)
				valors[i].capa_video=[];  //Preparo l'estructura
			if (!valors[i].capa_video[i_data])
				valors[i].capa_video[i_data]={}  //Preparo l'estructura
			if (v[i])
			{
				valors[i].capa_video[i_data].arrayBuffer=null;
				valors[i].capa_video[i_data].i_estil=i_estil2;
			}
			else
			{
				if (valors[i].capa_video[i_data].arrayBuffer)
					delete valors[i].capa_video[i_data].arrayBuffer;
			}
		}
	}
	else
	{
		for (i=0; i<valors.length; i++)
		{
			if (!valors[i].nova_capa)
				valors[i].nova_capa=[];  //Preparo l'estructura
			if (!valors[i].nova_capa[vista.i_nova_vista])
				valors[i].nova_capa[vista.i_nova_vista]={}  //Preparo l'estructura
			if (v[i])
			{
				valors[i].nova_capa[vista.i_nova_vista].arrayBuffer=null;
				valors[i].nova_capa[vista.i_nova_vista].i_estil=i_estil2;
			}
			else
			{
				if (valors[i].nova_capa[vista.i_nova_vista].arrayBuffer)
					delete valors[i].nova_capa[vista.i_nova_vista].arrayBuffer;
			}
		}
	}
	for (i=0; i<valors.length; i++)
	{
		if (v[i])
		{
			//Pot ser que aquesta v[i] ens envii a una altre capa i un altre temps i amb uns altres paràmetres addicionals si hi ha un càlcul en aquesta banda.
							
			var i_capa2=(typeof valors[i].i_capa==="undefined") ? i_capa : valors[i].i_capa;
			var i_data2=(typeof valors[i].i_data==="undefined") ? i_data : valors[i].i_data;
			var i_valor2=(typeof valors[i].i_valor==="undefined") ? i : valors[i].i_valor;
			
							
			if (ParamCtrl.capa[i_capa2].FormatImatge=="image/tiff" && (ParamCtrl.capa[i_capa2].tipus=="TipusHTTP_GET" || !ParamCtrl.capa[i_capa2].tipus))
			{
				var dims=valors[i].param;
				if (!DonaTiffCapa(i_capa2, i_valor2, i_data2, dims, i_capa, i, vista))
				{
					//Sistema per passar un altre argument a la funció d'error a partir de canviar l'scope de "this" amb .bind: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
					var imatgeTiffEvent={i_event: CreaIOmpleEventConsola("HTTP GET", i_capa2, DonaUrlLecturaTiff(i_capa2, i_valor2, i_data2, dims), TipusEventHttpGet),
						CanviaImatgeTiFFIndirect: function (param){
							if (param)
							{
								CanviaEstatEventConsola(null, this.i_event, EstarEventTotBe);
								
								if (!EsCapaVisibleAAquestNivellDeZoom(ParamCtrl.capa[param.i_capa]))
								{
									CanviaEstatCapa(param.i_capa, "visible");
									CreaLlegenda();
									return;
								}
								loadTiffData(param.i_capa2, param.i_valor2, param.imatge, param.vista, param.i_capa, param.i_data2, param.i_estil, param.dims, param.i_valor, param.nom_funcio_ok, param.funcio_ok_param).then(CanviaImatgeBinariaCapaIndirectCallback, ErrorImatgeBinariaCapaCallback);
								return;
								//return CanviaImatgeBinariaCapa(param.imatge, param.vista, param.i_capa, param.i_estil, param.i_data, param.nom_funcio_ok, param.funcio_ok_param);
							}
						},
						ErrorImatgeTIFF: function (error){
							alert(error);
							CanviaEstatEventConsola(null, this.i_event, EstarEventError);
						}
					};
					PreparaLecturaTiff(i_capa2, i_valor2, i_data2, imatge, vista, i_capa, i_estil2, i_data, dims, i, nom_funcio_ok, funcio_ok_param).then(imatgeTiffEvent.CanviaImatgeTiFFIndirect.bind(imatgeTiffEvent), imatgeTiffEvent.ErrorImatgeTIFF.bind(imatgeTiffEvent));
				}
				else
					loadTiffData(i_capa2, i_valor2, imatge, vista, i_capa, i_data2, i_estil2, dims, i, nom_funcio_ok, funcio_ok_param).then(CanviaImatgeBinariaCapaIndirectCallback, ErrorImatgeBinariaCapaCallback);
			}			
			else if (ParamCtrl.capa[i_capa2].model==model_vector)
			{
				//Si entro aquí, això hauria de ser una capa de polígons
				loadVectorData(i_capa2, i_valor2, imatge, vista, i_capa, i_data2, i_estil2, i, nom_funcio_ok, funcio_ok_param).then(CanviaImatgeBinariaCapaIndirectCallback, ErrorImatgeBinariaCapaCallback);
			}
			else
			{
				//var valors2=(typeof valors[i].i_capa==="undefined") ? valors : ParamCtrl.capa[i_capa2].valors;
				var url_dades=DonaRequestGetMap(i_capa2, -1, true, vista.ncol, vista.nfil, vista.EnvActual, i_data2, valors[i]);
				i_event=CreaIOmpleEventConsola("GetMap", i_capa2, url_dades, TipusEventGetMap);
				if(window.httploadHeif && ParamCtrl.capa[i_capa2].FormatImatge=="image/heif")
				{					
					httploadHeif(url_dades, CanviaImatgeBinariaCapaCallback, ErrorImatgeBinariaCapaCallback, {imatge: imatge, vista: vista, i_capa: i_capa, i_data: i_data2, i_estil: i_estil2, i_valor: i, i_event: i_event, nom_funcio_ok : nom_funcio_ok, funcio_ok_param :funcio_ok_param});
				}
				else
					loadBinaryFile(url_dades, "application/x-img", CanviaImatgeBinariaCapaCallback, 11, ErrorImatgeBinariaCapaCallback, {imatge: imatge, vista: 	vista, i_capa: i_capa, i_data: i_data2, i_estil: i_estil2, i_valor: i, i_event: i_event, nom_funcio_ok : nom_funcio_ok, funcio_ok_param :	 funcio_ok_param});
			}
		}
	}
	CanviaCursorSobreVista("progress");
}

function BuidaArrayBufferCapa(capa)
{
var valors, estil;
	if (capa.valors)
	{
		for (var i_v=0; i_v<capa.valors.length; i_v++)
		{
			valors=capa.valors[i_v];
			if (valors.arrayBuffer)
				delete valors.arrayBuffer;
			if (valors.arrayBufferPrint)
				delete valors.arrayBufferPrint;
			if (valors.arrayBuffer)
				delete valors.capa_rodet;
			if (valors.arrayBuffer)
				delete valors.capa_video;
			if (valors.nova_capa)
				delete valors.nova_capa;
		}
	}
	if (capa.estil)
	{
		for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
		{
			estil=capa.estil[i_estil];
			if (estil.histograma)
				delete estil.histograma;
			else if (estil.capa_rodet)
				delete estil.capa_rodet;
			else if (estil.capa_video)
				delete estil.capa_video;
			for (var i_c=0; i_c<estil.component; i_c++)
			{
				if (estil.component[i_c].calcul && estil.component[i_c].FormulaConsulta)
					delete estil.component[i_c].FormulaConsulta;
				if (estil.component[i_c].formulaInterna)
					delete estil.component[i_c].formulaInterna;
			}
		}
	}
}
