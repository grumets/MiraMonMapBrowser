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
    dins del grup del MiraMon. MiraMon és un projecte del Centre
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

/*Aquesta funció transforma {i_capa:, i_valor:, i_data:} a v[i] i {i_capa:, prop: } a p["nom_atribut"]
(la segona part només és vàlida per vectors).*/
function DonaFormulaConsultaDesDeCalcul(calcul, i_capa, estil_o_atribut)
{
var text_estil_attribut=ParamCtrl.capa[i_capa].model==model_vector ? " name in atributs " : " estil ";
//Busco la descripció de cada "valor" en la operació i creo un equivalent FormulaConsulta
//busco una clau d'obrir
var i, fragment, inici, final, cadena, c, i_capa_link;
var FormulaConsulta="";

	fragment=calcul;
	while ((inici=fragment.indexOf("{"))!=-1)
	{
		//busco una clau de tancar
		final=fragment.indexOf("}");
		if  (final==-1)
		{
			alert("Character '{' without '}' in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		var nou_valor=JSON.parse(cadena);
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
		/*Eliminar aquesta línia em permet diferenciar entre "la data d'ara" encara que m'ho canviïn o "la seleccionada a la capa" i si la canvien l'adopto també.
		if (DonaIndexDataCapa(ParamCtrl.capa[i_capa_link], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[i_capa_link], null))
			delete nou_valor.i_data;*/

		
		if(ParamCtrl.capa[i_capa_link].model==model_vector)
		{
			if(ParamCtrl.capa[i_capa].model==model_vector && i_capa!=i_capa_link)
			{
				alert("prop does not belong to the layer" + i_capa);
				break;
			}
			if (typeof nou_valor.prop==="undefined")
			{
				alert("prop is missing in 'calcul' in capa" + i_capa + text_estil_attribut + estil_o_atribut);
				break;
			}
			FormulaConsulta+=fragment.substring(0, inici)+"p[\""+nou_valor.prop+"\"]"; //contrueixo el fragment de FormulaConsulta
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
			if (typeof nou_valor.i_capa==="undefined" && typeof nou_valor.i_data==="undefined")  //si és la mateixa capa i la mateixa data puc fer servir el valor de l'array de valors que ja existeix
				i=nou_valor.i_valor;
			else
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
						nou_valor.i_valor==i
						) || 
						(   typeof nou_valor.i_capa!=="undefined" && typeof valors[i].i_capa!=="undefined" && nou_valor.i_capa==valors[i].i_capa && 
							nou_valor.i_valor==valors[i].i_valor && 
							(
								(typeof nou_valor.i_data==="undefined" && typeof valors[i].i_data==="undefined") || 
								(typeof nou_valor.i_data!=="undefined" && typeof valors[i].i_data!=="undefined" && DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], valors[i].i_data)) 
							)
						)
						)
						break;
				}
				if (i==valors.length)
				{
					//afageixo el valor si no existeix copiant tot el necessari.
					valors[i]=JSON.parse(JSON.stringify(ParamCtrl.capa[i_capa_link].valors[nou_valor.i_valor]));
					if (typeof nou_valor.i_capa!=="undefined")
						valors[i].i_capa=nou_valor.i_capa;
					valors[i].i_valor=nou_valor.i_valor;
					if (typeof nou_valor.i_data!=="undefined")
						valors[i].i_data=nou_valor.i_data;
				}
			}
			FormulaConsulta+=fragment.substring(0, inici)+"v["+i+"]"; //contrueixo el fragment de FormulaConsulta
		}		
		fragment=fragment.substring(final+1, fragment.length);
	}
	return FormulaConsulta+fragment;
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
			if (capa.atributs[i_estil_o_atrib].FormulaConsulta.indexOf("v["+i+"]")!=-1)
				v[i]=true;
		}
		return v;
	}

	var component=ParamCtrl.capa[i_capa].estil[i_estil_o_atrib].component, i_c;

	for (i_c=0; i_c<component.length; i_c++)
	{
		if (component[i_c].calcul && !component[i_c].FormulaConsulta)
			component[i_c].FormulaConsulta=DonaFormulaConsultaDesDeCalcul(component[i_c].calcul, i_capa, i_estil_o_atrib);

		if (component[i_c].FormulaConsulta)
		{
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
function DonaValorEstilComATextDesDeValorsCapa(i_nova_vista, i_capa, v)
{
var capa=ParamCtrl.capa[i_capa], estil, component, valors=capa.valors, valor, i_v, i_c, i_a, i_valor, v_c;

	if (v==null)
		return "";

	estil=capa.estil[DonaEstilDadesBinariesCapa(i_nova_vista, i_capa)]
	component=estil.component;

	v_c=DonaValorEstilComArrayDesDeValorsCapa(i_nova_vista, i_capa, -1, v)

	if (v_c==null)
		return "";

	if (component.length==1)
	{
		if (estil.categories && estil.atributs)
			return DonaCadena(DonaTextCategoriaDesDeColor(estil, v_c[0]));
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
		if (component[0].FormulaConsulta)
		{
			valor=eval(component[0].FormulaConsulta);
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
		if (component[i_c].FormulaConsulta)
		{
			valor=eval(component[i_c].FormulaConsulta);
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


var littleEndian = true;  //Constant

function DonaValorBandaDeDadesBinariesCapa(dv, compression, datatype, ncol, i_col, i_fil)
{
var j, i, comptador, acumulat, i_byte=0;

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
						if (!datatype)
							return dv.getUint8(i_byte+i, littleEndian);
						if (datatype=="int8")
							return dv.getInt8(i_byte+i, littleEndian);
						if (datatype=="uint8")
							return dv.getUint8(i_byte+i, littleEndian);
						if (datatype=="int16")
							return dv.getInt16(i_byte+i*2, littleEndian);
						if (datatype=="uint16")
							return dv.getUint16(i_byte+i*2, littleEndian);
						if (datatype=="int32")
							return dv.getInt32(i_byte+i*4, littleEndian);
						if (datatype=="uint32")
							return dv.getUint32(i_byte+i*4, littleEndian);
						if (datatype=="float32")
							return dv.getFloat32(i_byte+i*4, littleEndian);
						if (datatype=="float64")
							return dv.getFloat64(i_byte+i*8, littleEndian);
						return dv.getUint8(i_byte+i_col, littleEndian);
					}
					else
					{
						//Toca saltar.
						if (!datatype || datatype=="int8" || datatype=="uint8")
							i_byte+=comptador;
						else if (datatype=="int16" || datatype=="uint16")
							i_byte+=2*comptador;
						else if (datatype=="int32" || datatype=="uint32" || datatype=="float32")
							i_byte+=4*comptador;
						else if (datatype=="float64")
							i_byte+=8*comptador;
						else
							i_byte+=comptador;
					}
				}
				else
				{
					acumulat += comptador;

					if (j==i_fil && i_col<acumulat)
					{
						if (!datatype)
							return dv.getUint8(i_byte, littleEndian);
						if (datatype=="int8")
							return dv.getInt8(i_byte, littleEndian);
						if (datatype=="uint8")
							return dv.getUint8(i_byte, littleEndian);
						if (datatype=="int16")
							return dv.getInt16(i_byte, littleEndian);
						if (datatype=="uint16")
							return dv.getUint16(i_byte, littleEndian);
						if (datatype=="int32")
							return dv.getInt32(i_byte, littleEndian);
						if (datatype=="uint32")
							return dv.getUint32(i_byte, littleEndian);
						if (datatype=="float32")
							return dv.getFloat32(i_byte, littleEndian);
						if (datatype=="float64")
							return dv.getFloat64(i_byte, littleEndian);
						return dv.getUint8(i_byte, littleEndian);
					}
					else
					{
						if (!datatype || datatype=="int8" || datatype=="uint8")
							i_byte++;
						else if (datatype=="int16" || datatype=="uint16")
							i_byte+=2;
						else if (datatype=="int32" || datatype=="uint32" || datatype=="float32")
							i_byte+=4;
						else if (datatype=="float64")
							i_byte+=8;
						else
							i_byte++;
					}
               			}
			}			
		}
		return 0; //No s'hauria de sortir mai per aquí
	}
	if (!datatype)
		return dv.getUint8(i_fil*vista.ncol+i_col, littleEndian);
	if (datatype=="int8")
		return dv.getInt8(i_fil*ncol+i_col, littleEndian);
	if (datatype=="uint8")
		return dv.getUint8(i_fil*ncol+i_col, littleEndian);
	if (datatype=="int16")
		return dv.getInt16((i_fil*ncol+i_col)*2, littleEndian);
	if (datatype=="uint16")
		return dv.getUint16((i_fil*ncol+i_col)*2, littleEndian);
	if (datatype=="int32")
		return dv.getInt32((i_fil*ncol+i_col)*4, littleEndian);
	if (datatype=="uint32")
		return dv.getUint32((i_fil*ncol+i_col)*4, littleEndian);
	if (datatype=="float32")
		return dv.getFloat32((i_fil*ncol+i_col)*4, littleEndian);
	if (datatype=="float64")
		return dv.getFloat64((i_fil*ncol+i_col)*8, littleEndian);
	return dv.getUint8(i_fil*ncol+i_col, littleEndian);
}

function ErrorImatgeBinariaCapaCallback(text, extra_param)
{
var valors=ParamCtrl.capa[extra_param.i_capa].valors

	alert(text);
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
			alert(dtype + " " + DonaCadenaLang({"cat": "no reconnegut o implementat.", "spa": "no reconocido o implementado.", "eng": "neither recognized nor implemented.", "fre":"Ni reconnu ni mis en œuvre"}));
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
			valor0=eval(component0.FormulaConsulta);
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
				}
				fila_calc[i][i_data_video]=valor0;
			}
		}
	}
}

//No suporta combinacions RGB
function CalculaFilaDesDeBinaryArrays(fila_calc, i_data_video, histograma, dv, valors, ncol, i_byte, i_cell, component0)
{
var v=[], i_v, dv_i, valors_i, valor0, i_nodata, nodata, dtype, i, acumulat, comptador, i_col=0, n_v=valors.length;

	for (i_v=0;i_v<n_v;i_v++)
	{
		if (dv[i_v]==null)
			continue;
		dv_i=dv[i_v];
		valors_i=valors[i_v];
		nodata=valors_i.nodata;
		dtype=valors_i.datatype
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
						if (!dtype)
							{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
						else if (dtype=="int8")
							{ v[i_v]=dv_i.getInt8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
						else if (dtype=="uint8")
							{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
						else if (dtype=="int16")
							{ v[i_v]=dv_i.getInt16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
						else if (dtype=="uint16")
							{ v[i_v]=dv_i.getUint16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
						else if (dtype=="int32")
							{ v[i_v]=dv_i.getInt32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
						else if (dtype=="uint32")
							{ v[i_v]=dv_i.getUint32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
						else if (dtype=="float32")
							{ v[i_v]=dv_i.getFloat32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
						else if (dtype=="float64")
							{ v[i_v]=dv_i.getFloat64(i_byte[i_v], littleEndian); i_byte[i_v]+=8; }
					
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
							if (component0.FormulaConsulta)
								valor0=eval(component0.FormulaConsulta);
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
					if (!dtype)
						{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
					else if (dtype=="int8")
						{ v[i_v]=dv_i.getInt8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
					else if (dtype=="uint8")
						{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
					else if (dtype=="int16")
						{ v[i_v]=dv_i.getInt16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
					else if (dtype=="uint16")
						{ v[i_v]=dv_i.getUint16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
					else if (dtype=="int32")
						{ v[i_v]=dv_i.getInt32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
					else if (dtype=="uint32")
						{ v[i_v]=dv_i.getUint32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
					else if (dtype=="float32")
						{ v[i_v]=dv_i.getFloat32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
					else if (dtype=="float64")
						{ v[i_v]=dv_i.getFloat64(i_byte[i_v], littleEndian); i_byte[i_v]+=8; }

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
						if (component0.FormulaConsulta)
							valor0=eval(component0.FormulaConsulta);
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
				if (!dtype)
					v[i_v]=dv_i.getUint8(i_cell[i_v], littleEndian);
				else if (dtype=="int8")
					v[i_v]=dv_i.getInt8(i_cell[i_v], littleEndian);
				else if (dtype=="uint8")
					v[i_v]=dv_i.getUint8(i_cell[i_v], littleEndian);
				else if (dtype=="int16")
					v[i_v]=dv_i.getInt16(i_cell[i_v]*2, littleEndian);
				else if (dtype=="uint16")
					v[i_v]=dv_i.getUint16(i_cell[i_v]*2, littleEndian);
				else if (dtype=="int32")
					v[i_v]=dv_i.getInt32(i_cell[i_v]*4, littleEndian);
				else if (dtype=="uint32")
					v[i_v]=dv_i.getUint32(i_cell[i_v]*4, littleEndian);
				else if (dtype=="float32")
					v[i_v]=dv_i.getFloat32(i_cell[i_v]*4, littleEndian);
				else if (dtype=="float64")
					v[i_v]=dv_i.getFloat64(i_cell[i_v]*8, littleEndian);
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
					if (component0.FormulaConsulta)
						valor0=eval(component0.FormulaConsulta);
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
		valor0=img_stat[i_cell_ini+i]=f_estad(fila_calc[i], f_estad_param);
		if (histograma)
		{
			if (isNaN(valor0) || valor0==null)
				histograma.classe_nodata++;
			else
			{
				if (histo_component0.valorMinimReal>valor0)
					histo_component0.valorMinimReal=valor0;
				if (histo_component0.valorMaximReal<valor0)
					histo_component0.valorMaximReal=valor0;
			}
		}
	}
	return;
}

function DonaDataCanvasDesDeArrayNumericIPaleta(data, histograma, img_stat, ncol, nfil, estiramentPaleta, paleta)
{
var colors, ncolors, i_color0;
var j, i, a0, valor_min0, valor0, bigint;

	colors=(paleta && paleta.colors) ? paleta.colors : null;
	ncolors=colors ? colors.length : 256;
	/*if (colors)
	{
		for (i_color0=0; i_color0<ncolors; i_color0++)
		{
			if (colors[i_color0].charAt(0)!="#")
				alert(DonaCadenaLang({"cat":"Color no suportat", "spa":"Color no suportado", "eng":"Unsupported color","fre":"Couleur non supportée"}) + ": " + colors[i_color0] + ". " + DonaCadenaLang({"cat":"Useu el format", "spa":"Use el formato", "eng":"Use the format","fre":"Utilisez le format"}) + ": #RRGGBB");
		}
	}*/
	a0=DonaFactorAEstiramentPaleta(estiramentPaleta, ncolors);
	valor_min0=DonaFactorValorMinEstiramentPaleta(estiramentPaleta);
	if (histograma)
	{
		histograma.component=[{
					"classe": [], 
					"valorMinimReal": +1e300,
					"valorMaximReal": -1e300
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


/*img_data és un Uint8ClampedArray que no suporta .push() però a canvi "it clamps input values between 0 and 255. 
This is especially handy for Canvas image processing algorithms since now you don’t have to manually clamp your 
image processing math to avoid overflowing the 8-bit range.
'data' es un array de dades que servirà per enviar al canvas
'histograma' pot contenir una variable on escriure histograma. Pot ser null si es vol obtenir un histograma.
'dv' són les dades a treballar que seran explorades per funcions tipus dv[i].getUint8(). N'hi ha tantes com bades però moltes poden ser null si no apareixen a la formula. Es poden obtenir amb CarregaDataViewsCapa(dv, ...); 
'mes_duna_v' Indica si hi ha més d'una dv[] carregada. Es pot fer servir CarregaDataViewsCapa()-1
'component' és capa.estil[i_estil].component
'valors' és capa.valors. No es mira la part on hi ha els arrays binaris perquè això està a dv.
'paleta' és capa.estil[i_estil].paleta*/
function ConstrueixImatgeCanvas(data, histograma, ncol, nfil, dv, mes_duna_v, component, valors, paleta)
{
var i_cell=[], i_byte=[], j, i, CalculaFilaDesDeBinaryArraydv_i, i_c, valor0, i_color=[], i_color0, a=[], a0, valor_min=[], valor_min0, comptador, acumulat, bigint, fila=[], i_nodata, i_ndt, classe0;
var histo_component0, component0, n_v=valors.length, dv_i, v=[];
var colors, ncolors, valors_i, nodata, dtype, una_component;

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

	if (component.length==1)
	{
		/*if (!estil.paleta || !estil.paleta.colors)
		{
			alert(DonaCadenaLang({"cat":"Una capa amb una sola component ha de tenir definits els colors de la paleta", 
						"spa":"Una capa con una sola componente debe tener definidos los colores de la paleta", 
						"eng":"A layer with a single component must define a pallette of colors",
						"fre":"Une couche d'un composant unique doit avoir défini les couleurs de la palette"}) + ". (" + (capa.desc ? capa.desc: capa.nom) + ")");
			return;
		}*/
		component0=component[0];
		colors=(paleta && paleta.colors) ? paleta.colors : null;
		ncolors=colors ? colors.length : 256;
		if (colors)
		{
			for (i_color0=0; i_color0<ncolors; i_color0++)
			{
				if (colors[i_color0].charAt(0)!="#")
					alert(DonaCadenaLang({"cat":"Color no suportat", "spa":"Color no suportado", "eng":"Unsupported color","fre":"Couleur non supportée"}) + ": " + colors[i_color0] + ". " + DonaCadenaLang({"cat":"Useu el format", "spa":"Use el formato", "eng":"Use the format","fre":"Utilisez le format"}) + ": #RRGGBB");
			}
		}
		a0=DonaFactorAEstiramentPaleta(component0.estiramentPaleta, ncolors);
		valor_min0=DonaFactorValorMinEstiramentPaleta(component0.estiramentPaleta);
		if (histograma)
		{
			//cal_histo=true;
			//component0.histograma=[];
			//component0.valorMinimReal=+1e300;
			histograma.component=[{
						"classe": [], 
						"valorMinimReal": +1e300,
						"valorMaximReal": -1e300
					}];
			histo_component0=histograma.component[0];
			classe0=histo_component0.classe;
			for (i_color0=0; i_color0<ncolors; i_color0++)
				classe0[i_color0]=0;
		}
	}
	else if (component.length==2)
	{
		alert(DonaCadenaLang({"cat":"Una capa no pot tenir 2 components. Ha de tenir definides 1 o 3 components.", 
						"spa":"Una capa no puede tener 2 componentes. Debe tener definidas 1 o 3 componentes", 
						"eng":"A layer can not have 2 component. It must have defined 1 or 3 components",
						"fre":"Une couche ne peut pas avoir deux composants. Vous devez avoir défini un ou trois composants"}) + ". (" + (capa.desc ? capa.desc: capa.nom) + ")");
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
				for (i_color0=0; i_color0<256; i_color0++)
					component[i_c].histograma[i_color0]=0;
			}*/
			if (histograma)
			{
				histograma.component[i_c]={
							"classe": [], 
							"valorMinimReal": +1e300,
							"valorMaximReal": -1e300
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
						valor0=eval(component0.FormulaConsulta);
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
							if (component[i_c].FormulaConsulta)
							{
								valor0=eval(component[i_c].FormulaConsulta);
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
				dtype=valors_i.datatype
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
								if (!dtype)
									{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
								else if (dtype=="int8")
									{ v[i_v]=dv_i.getInt8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
								else if (dtype=="uint8")
									{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
								else if (dtype=="int16")
									{ v[i_v]=dv_i.getInt16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
								else if (dtype=="uint16")
									{ v[i_v]=dv_i.getUint16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
								else if (dtype=="int32")
									{ v[i_v]=dv_i.getInt32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
								else if (dtype=="uint32")
									{ v[i_v]=dv_i.getUint32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
								else if (dtype=="float32")
									{ v[i_v]=dv_i.getFloat32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
								else if (dtype=="float64")
									{ v[i_v]=dv_i.getFloat64(i_byte[i_v], littleEndian); i_byte[i_v]+=8; }
							
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
										if (component0.FormulaConsulta)
											valor0=eval(component0.FormulaConsulta);
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
											if (component[i_c].FormulaConsulta)
											{
												valor0=eval(component[i_c].FormulaConsulta);
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
							if (!dtype)
								{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
							else if (dtype=="int8")
								{ v[i_v]=dv_i.getInt8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
							else if (dtype=="uint8")
								{ v[i_v]=dv_i.getUint8(i_byte[i_v], littleEndian); i_byte[i_v]++; }
							else if (dtype=="int16")
								{ v[i_v]=dv_i.getInt16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
							else if (dtype=="uint16")
								{ v[i_v]=dv_i.getUint16(i_byte[i_v], littleEndian); i_byte[i_v]+=2; }
							else if (dtype=="int32")
								{ v[i_v]=dv_i.getInt32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
							else if (dtype=="uint32")
								{ v[i_v]=dv_i.getUint32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
							else if (dtype=="float32")
								{ v[i_v]=dv_i.getFloat32(i_byte[i_v], littleEndian); i_byte[i_v]+=4; }
							else if (dtype=="float64")
								{ v[i_v]=dv_i.getFloat64(i_byte[i_v], littleEndian); i_byte[i_v]+=8; }
	
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
									if (component0.FormulaConsulta)
										valor0=eval(component0.FormulaConsulta);
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
										if (component[i_c].FormulaConsulta)
										{
											valor0=eval(component[i_c].FormulaConsulta);
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
						if (!dtype)
							v[i_v]=dv_i.getUint8(i_cell[i_v], littleEndian);
						else if (dtype=="int8")
							v[i_v]=dv_i.getInt8(i_cell[i_v], littleEndian);
						else if (dtype=="uint8")
							v[i_v]=dv_i.getUint8(i_cell[i_v], littleEndian);
						else if (dtype=="int16")
							v[i_v]=dv_i.getInt16(i_cell[i_v]*2, littleEndian);
						else if (dtype=="uint16")
							v[i_v]=dv_i.getUint16(i_cell[i_v]*2, littleEndian);
						else if (dtype=="int32")
							v[i_v]=dv_i.getInt32(i_cell[i_v]*4, littleEndian);
						else if (dtype=="uint32")
							v[i_v]=dv_i.getUint32(i_cell[i_v]*4, littleEndian);
						else if (dtype=="float32")
							v[i_v]=dv_i.getFloat32(i_cell[i_v]*4, littleEndian);
						else if (dtype=="float64")
							v[i_v]=dv_i.getFloat64(i_cell[i_v]*8, littleEndian);
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
								if (component0.FormulaConsulta)
									valor0=eval(component0.FormulaConsulta);
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
									if (component[i_c].FormulaConsulta)
									{
										valor0=eval(component[i_c].FormulaConsulta);
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


function CanviaImatgeBinariaCapaCallback(dades, extra_param)
{
var i_v, dv=[], mes_duna_v;
var capa=ParamCtrl.capa[extra_param.i_capa], valors=capa.valors, n_v, n_v_plena;
var estil=capa.estil[extra_param.i_estil];
var histograma=null, imgData, ctx;
var data;
//cal_histo=false;

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
	for (i_v=0; i_v<n_v; i_v++)
	{
		if (extra_param.vista.i_nova_vista==NovaVistaPrincipal)
		{
			if (typeof valors[i_v].arrayBuffer!=="undefined" && valors[i_v].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==NovaVistaImprimir)
		{
			if (typeof valors[i_v].arrayBufferPrint!=="undefined" && valors[i_v].arrayBufferPrint==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==NovaVistaRodet)
		{
			if (typeof valors[i_v].capa_rodet[extra_param.i_data].arrayBuffer!=="undefined" && valors[i_v].capa_rodet[extra_param.i_data].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==NovaVistaVideo)
		{
			if (typeof valors[i_v].capa_video[extra_param.i_data].arrayBuffer!=="undefined" && valors[i_v].capa_video[extra_param.i_data].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else
		{
			if (typeof valors[i_v].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer!=="undefined" && valors[i_v].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
	}

	//Ara ha se que tinc el que necessito.
	
	if (extra_param.imatge)
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

		data=[]; //Empty the array;

		ConstrueixImatgeCanvas(data, histograma, imgData.width, imgData.height, dv, n_v_plena-1, capa.estil[extra_param.i_estil].component, valors, estil.paleta)

		imgData.data.set(data);

		ctx.putImageData(imgData,0,0);
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

//Si imatge==null aquest funció no dibuixarà però servirà per carregar totes les bandes necessaries. Això és útil per atributs calculats de capes vectorials a partir de capes raster.
function CanviaImatgeBinariaCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param)
{
var i, i_event;
var i_estil2=(i_estil==-1) ? ParamCtrl.capa[i_capa].i_estil : i_estil;

		/*if (!estil.component)
		{
			alert(DonaCadenaLang({"cat":"La capa ha estat demanada com img però no hi ha components definides al estil actual. No es podrà ni consultar\nCapa: \"",
						"spa":"La capa ha sido solicitada como img pero no tiene componentes definidas en el estilo actual.\nCapa \"",
						"eng":"The layer is requested as img but there are no defined components for the current style.\nLayer \"", 
						"fre":"La couche est requise comme img mais il n'y a pas de composants définis pour le style actuel.\nCouche \""}) + DonaCadena(ParamCtrl.capa[i_capa].desc));
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
				//Pot ser que aquesta v[i] ens envii a una altre capa i un altre temps i amb uns altres parametres addicionals si hi ha un calcul en aquesta banda.
				var i_capa2=(typeof valors[i].i_capa==="undefined") ? i_capa : valors[i].i_capa;
				var i_data2=(typeof valors[i].i_data==="undefined") ? i_data : valors[i].i_data;
				var i_valor=(typeof valors[i].i_valor==="undefined") ? i : valors[i].i_valor;
				var valors2=(typeof valors[i].i_capa==="undefined") ? valors : ParamCtrl.capa[i_capa2].valors;

				var url_dades=DonaRequestGetMap(i_capa2, -1, true, vista.ncol, vista.nfil, vista.EnvActual, i_data2);
				//Afegeixo els paràmetres addicionals que venen de la definició dels valors.
				if (valors2[i_valor].param)
				{
					for (var i_param=0; i_param<valors2[i_valor].param.length; i_param++)
						url_dades+="&"+valors2[i_valor].param[i_param].clau.nom+"="+valors2[i_valor].param[i_param].valor.nom;
				}
				i_event=CreaIOmpleEventConsola("GetMap", i_capa2, url_dades, TipusEventGetMap);
				loadBinaryFile(url_dades, "application/x-img", CanviaImatgeBinariaCapaCallback, ErrorImatgeBinariaCapaCallback, {"imatge": imatge, "vista": vista, "i_capa": i_capa, "i_data": i_data2, "i_estil": i_estil2, "i_valor": i, "i_event": i_event, "nom_funcio_ok" : nom_funcio_ok, "funcio_ok_param" : funcio_ok_param});
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
			}
		}
	}
}