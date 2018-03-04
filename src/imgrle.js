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

    Copyright 2001, 2018 Xavier Pons

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


//v[] és false si la banda no està implicada en el redibuixat.
function DeterminaArrayValorsNecessarisCapa(i_capa, i_estil)
{
var valors=ParamCtrl.capa[i_capa].valors, component=ParamCtrl.capa[i_capa].estil[i_estil].component, v=[], i, i_c;

	for (i=0; i<valors.length; i++)
		v[i]=false;

	for (i_c=0; i_c<component.length; i_c++)
	{
		if (component[i_c].calcul && !component[i_c].FormulaConsulta)
		{
			//Busco la descripció de cada "valor" en la operació i creo un equivalent FormulaConsulta
			//busco una clau d'obrir
			var fragment, inici, final, cadena, c, i_capa_link;

			component[i_c].FormulaConsulta="";
			fragment=component[i_c].calcul;
			while ((inici=fragment.indexOf("{"))!=-1)
			{
				//busco una clau de tancar
				final=fragment.indexOf("}");
				if  (final==-1)
				{
					alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
					break;
				}
				cadena=fragment.substring(inici, final+1);
				//interpreto el fragment metajson
				nou_valor=JSON.parse(cadena);
				if (typeof nou_valor.i_capa!=="undefined")
				{
					if (nou_valor.i_capa>=ParamCtrl.capa.length)
					{
						alert("capa " + nou_valor.i_capa + " in 'calcul' in capa" + i_capa + " estil " + i_estil + " is out of range");
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
					alert("i_data has been indicated for a 'capa' without 'data' array in 'calcul' in capa" + i_capa + " estil " + i_estil);
					break;
				}
				if (typeof nou_valor.i_data!=="undefined" && nou_valor.i_data>=ParamCtrl.capa[i_capa_link].data.length)
				{
					alert("'data' " + nou_valor.i_data + " in 'calcul' in capa" + i_capa + " estil " + i_estil + " is out of range");
					break;
				}
				/*Eliminar aquesta línia em permet diferenciar entre "la data d'ara" encara que m'ho canviïn o "la seleccionada a la capa" i si la canvien l'adopto també.
				if (DonaIndexDataCapa(ParamCtrl.capa[i_capa_link], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[i_capa_link], null))
					delete nou_valor.i_data;*/

				if (typeof nou_valor.i_valor==="undefined")
				{
					alert("i_Valor is missing in 'calcul' in capa" + i_capa + " estil " + i_estil);
					break;
				}
				if (!ParamCtrl.capa[i_capa_link].valors)
				{
					alert("i_valor has been indicated for a 'capa' without 'valors' array in 'calcul' in capa" + i_capa + " estil " + i_estil);
					break;
				}
				if (nou_valor.i_valor>=ParamCtrl.capa[i_capa_link].valors.length)
				{
					alert("i_valor " + nou_valor.i_valor + " in 'calcul' in capa" + i_capa + " estil " + i_estil + " is out of range");
					break;
				}
				if (ParamCtrl.capa[i_capa_link].valors[nou_valor.i_valor].calcul)
				{
					alert("i_valor " + nou_valor.i_valor + " in 'calcul' in capa" + i_capa + " estil " + i_estil + " points to one of the 'values' that is a 'calcul'. This is not supported yet.");
					break;
				}
				if (ParamCtrl.capa[i_capa_link].valors[nou_valor.i_valor].FormulaConsulta)
				{
					alert("i_valor " + nou_valor.i_valor + " in 'calcul' in capa" + i_capa + " estil " + i_estil + " points to one of the 'values' that has a 'FormulaConsulta'. This is not supported yet.");
					break;
				}
				if (typeof nou_valor.i_capa==="undefined" && typeof nou_valor.i_data==="undefined")  //si és la mateixa capa i la mateixa data puc fer servir el valor de l'array de valors que ja existeix
					i=nou_valor.i_valor;
				else
				{
					//cerco si ja existeix un valor amb aquestes caracteristiques
					for (i=0; i<valors.length; i++)
					{
						if ((
							(typeof nou_valor.i_capa==="undefined" || nou_valor.i_capa==i_capa) && 
							(
								(typeof nou_valor.i_data==="undefined" && valors[i].i_data==="undefined") || 
								(typeof nou_valor.i_data!=="undefined" && typeof valors[i].i_data!=="undefined" && DonaIndexDataCapa(ParamCtrl.capa[i_capa], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[i_capa], valors[i].i_data))
							) && 
							nou_valor.i_valor==i
						    ) || (
                                                        typeof nou_valor.i_capa!=="undefined" && typeof valors[i].i_capa!=="undefined" && nou_valor.i_capa==valors[i].i_capa && 
							nou_valor.i_valor==valors[i].i_valor && 
							typeof nou_valor.i_data!=="undefined" && typeof valors[i].i_data!=="undefined" && DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], nou_valor.i_data)==DonaIndexDataCapa(ParamCtrl.capa[nou_valor.i_capa], valors[i].i_data) 
						    ))
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
				component[i_c].FormulaConsulta+=fragment.substring(0, inici)+"v["+i+"]"; //contrueixo el fragment de FormulaConsulta
				fragment=fragment.substring(final+1, fragment.length);
			}
			component[i_c].FormulaConsulta+=fragment;
		}
		if (component[i_c].FormulaConsulta)
		{
			for (i=0; i<valors.length; i++)
			{
				if (component[i_c].FormulaConsulta.indexOf("v["+i+"]")!=-1)
					v[i]=true;
			}
		}
		else if (typeof component[i_c].i_valor !== "undefined")
		{
			for (i=0; i<valors.length; i++)
			{
				if (i==component[i_c].i_valor)
					v[i]=true;
			}
		}
		else
			v[0]=true;
	}
	return v;
}

function DonaEstilDadesBinariesCapa(i_nova_vista, i_capa)
{
var valors=ParamCtrl.capa[i_capa].valors, i_v;

	if (i_nova_vista==-1 || i_nova_vista==-2 || i_nova_vista==-3)  //L'estil d'impressió i de visualització són els mateixos
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
	if (i_nova_vista==-1)
	{
		for (i_v=0; i_v<valors.length; i_v++)
		{
			if (v[i_v] && !valors[i_v].arrayBuffer)
				return false;
		}
	}
	/*else if (i_nova_vista==-2)
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
		if (i_nova_vista==-1)
			array_buffer=valors[i_v].arrayBuffer;
		else if (i_nova_vista==-2)
			array_buffer=valors[i_v].arrayBufferPrint;
		else if (i_nova_vista==-3)
			array_buffer=valors[i_v].capa_rodet[i_data].arrayBuffer;
		else if (i_nova_vista==-4)
			array_buffer=valors[i_v].capa_video[i_data].arrayBuffer;
		else
			array_buffer=(valors[i_v].nova_capa && valors[i_v].nova_capa[i_nova_vista] && valors[i_v].nova_capa[i_nova_vista].arrayBuffer) ? valors[i_v].nova_capa[i_nova_vista].arrayBuffer : null;
		if (array_buffer)
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
function DonaValorsDeDadesBinariesCapa(i_nova_vista, i_capa, i_data, i_col, i_fil)
{
var i_v, comptador, vista, dv=[], n_v, v=[], i_ndt;
var valors=ParamCtrl.capa[i_capa].valors;

	vista=DonaVistaDesDeINovaVista(i_nova_vista);

	n_v=CarregaDataViewsCapa(dv, i_nova_vista, i_data, valors);
	if (n_v==0)
		return null;
	n_v--;

	for (i_v=0; i_v<valors.length; i_v++)
	{
		if (dv[i_v])
		{
			v[i_v]=DonaValorBandaDeDadesBinariesCapa(dv[i_v], valors[i_v].compression, valors[i_v].datatype, vista.ncol, i_col, i_fil);
			if (valors[i_v].nodata)
			{
				for (i_ndt=0; i_ndt<valors[i_v].nodata.length; i_ndt++)
				{
					if (v[i_v]==valors[i_v].nodata[i_ndt])
					{
						v[i_v]=null;
						break;
					}
				}
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

	estil=capa.estil[DonaEstilDadesBinariesCapa(i_nova_vista, i_capa)]
	component=estil.component;

	v_c=DonaValorEstilComArrayDesDeValorsCapa(i_nova_vista, i_capa, -1, v)

	if (v_c==null)
		return "";

	if (component.length==1)
	{
		if (estil.categories && estil.atributs)
			return DonaTextCategoriaDesDeColor(estil, v_c[0]);
		return (typeof component[0].NDecimals!=="undefined" && component[0].NDecimals!=null) ? OKStrOfNe(v_c[0], component[0].NDecimals) : v_c[0];
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
	if (extra_param.vista.i_nova_vista==-1)
		delete valors[extra_param.i_valor].arrayBuffer;
	else if (extra_param.vista.i_nova_vista==-2)
		delete valors[extra_param.i_valor].arrayBufferPrint;
	else if (extra_param.vista.i_nova_vista==-3)
		delete valors[extra_param.i_valor].capa_rodet[extra_param.i_data].arrayBuffer;
	else if (extra_param.vista.i_nova_vista==-4)
		delete valors[extra_param.i_valor].capa_video[extra_param.i_data].arrayBuffer;
	else
		delete valors[extra_param.i_valor].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer;
}

function ContruieixImatgeCanvas(data, histograma, ncol, nfil, dv, mes_duna_v, component, valors, paleta)
{
var i_cell=[], i_byte=[], i_data=0, j, i, v=[], v_i, dv_i, i_c, valor0, i_color=[], i_color0, a=[], valor_min=[], comptador, acumulat, bigint, fila=[], es_nodata, i_ndt, classe0;
var component0, n_v=valors.length;
var colors, ncolors, valors_i, nodata, dtype, una_component;

	for (i_v=0; i_v<n_v; i_v++)
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
		a[0]=DonaFactorAEstiramentPaleta(component0, ncolors);
		valor_min[0]=DonaFactorValorMinEstiramentPaleta(component0);
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
			a[i_c]=DonaFactorAEstiramentPaleta(component[i_c], 256);
			valor_min[i_c]=DonaFactorValorMinEstiramentPaleta(component[i_c]);
			/*if (extra_param.vista.i_nova_vista!=-2 && extra_param.vista.i_nova_vista!=-3 && extra_param.vista.i_nova_vista!=-4)
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
			//Primer llegim totes les bandes de les files
			for (i_v=0;i_v<n_v;i_v++)
		    	{
			        if (dv[i_v]==null)
					continue;
				dv_i=dv[i_v];
				valors_i=valors[i_v];
				nodata=valors_i.nodata;
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
			//Segon passem la fila a colors RGB
			if (una_component)
			{
				for (i=0;i<ncol;i++)
				{
					v=fila[i];
					es_nodata=false;
					for (i_v=0;i_v<n_v;i_v++)
					{
					        if (dv[i_v]==null)
							continue;
						nodata=valors[i_v].nodata;
						if (nodata)
						{
							for (i_ndt in nodata)
							{
								if (v[i_v]==nodata[i_ndt])
								{
									es_nodata=true;
									break;
								}
							}
							if (es_nodata)
								break;
						}
					}
					if (es_nodata)
					{
						if (histograma)
							histograma.classe_nodata++;
						data[i_data+2]=data[i_data+1]=data[i_data]=255;
						data[i_data+3]=0;
					}
					else
					{
						valor0=eval(component0.FormulaConsulta);
						if (isNaN(valor0) || valor0==null)
						{
							if (histograma)	
								histograma.classe_nodata++;
							data[i_data+2]=data[i_data+1]=data[i_data]=255;
							data[i_data+3]=0;
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
							i_color0=Math.floor(a[0]*(valor0-valor_min[0]));
							if (i_color0>=ncolors)
								i_color0=ncolors-1;
							else if (i_color0<0)
								i_color0=0;
							if (histograma)
								classe0[i_color0]++;
							if (colors)
							{
								bigint = parseInt(colors[i_color0].substring(1), 16);
								data[i_data]=(bigint >> 16) & 255;
								data[i_data+1]=(bigint >> 8) & 255;
								data[i_data+2]=bigint & 255;
							}
							else
								data[i_data+2]=data[i_data+1]=data[i_data]=i_color0;
							data[i_data+3]=255;
						}
					}
					i_data+=4;
                        	}
			}
			else
			{
				for (i=0;i<ncol;i++)
				{
					v=fila[i];
					es_nodata=false;
					for (i_v=0;i_v<n_v;i_v++)
					{
					        if (dv[i_v]==null)
							continue;
						nodata=valors[i_v].nodata;
						if (nodata)
						{
							for (i_ndt in nodata)
							{
								if (v[i_v]==nodata[i_ndt])
								{
									es_nodata=true;
									break;
								}
							}
							if (es_nodata)
								break;
						}
					}
					if (es_nodata)
					{
						if (histograma)
							histograma.classe_nodata++;
						data[i_data+2]=data[i_data+1]=data[i_data]=255;
						data[i_data+3]=0;
					}
					else
					{
						data[i_data+3]=255;
						for (i_c=0; i_c<3; i_c++)
						{
							if (component[i_c].FormulaConsulta)
							{
								valor0=eval(component[i_c].FormulaConsulta);
								if (isNaN(valor0) || valor0==null)
								{
									if (histograma)
										histograma.classe_nodata++;
									data[i_data+2]=data[i_data+1]=data[i_data]=255;
									data[i_data+3]=0;
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
							data[i_data+i_c]=i_color0;
						}
					}
					i_data+=4;
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
							
								es_nodata=false;
								if (nodata)
								{
									for (i_ndt in nodata)
									{
										if (v[i_v]==nodata[i_ndt])
										{
											es_nodata=true;
											break;
										}
									}
								}
								if (es_nodata)
								{
									if (histograma)
										histograma.classe_nodata++;
									data[i_data+2]=data[i_data+1]=data[i_data]=255;
									data[i_data+3]=0;
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
											data[i_data+2]=data[i_data+1]=data[i_data]=255;
											data[i_data+3]=0;
										}
										else
										{
											if (histograma)
											{
												if (histo_component0.valorMinimReal>valor0)
													component0.valorMinimReal=valor0;
												if (histo_component0.valorMaximReal<valor0)
													component0.valorMaximReal=valor0;
											}
											i_color0=Math.floor(a[0]*(valor0-valor_min[0]));
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
												data[i_data]=(bigint >> 16) & 255;
												data[i_data+1]=(bigint >> 8) & 255;
												data[i_data+2]=bigint & 255;
											}
											else
												data[i_data+2]=data[i_data+1]=data[i_data]=i_color0;
											data[i_data+3]=255;
										}
									}
									else
									{
										data[i_data+3]=255;
										for (i_c=0; i_c<3; i_c++)
										{
											if (component[i_c].FormulaConsulta)
											{
												valor0=eval(component[i_c].FormulaConsulta);
												if (isNaN(valor0) || valor0==null)
												{
													if (histograma)
														histograma.classe_nodata++;
													data[i_data+2]=data[i_data+1]=data[i_data]=255;
													data[i_data+3]=0;
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
											data[i_data+i_c]=i_color0;
										}
									}
								}
								i_data+=4;
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
	
							es_nodata=false;
							if (nodata)
							{
								for (i_ndt in nodata)
								{
									if (v[i_v]==nodata[i_ndt])
									{
										es_nodata=true;
										break;
									}
								}
							}
							if (es_nodata)
							{
								if (histograma)
									histograma.classe_nodata+=comptador;
								for ( ; i<acumulat; i++)
								{
									data[i_data+2]=data[i_data+1]=data[i_data]=255;
									data[i_data+3]=0;
									i_data+=4;
								}
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
										{
											data[i_data+2]=data[i_data+1]=data[i_data]=255;
											data[i_data+3]=0;
											i_data+=4;
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
										i_color0=Math.floor(a[0]*(valor0-valor_min[0]));
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
											{
												data[i_data]=(bigint >> 16) & 255;
												data[i_data+1]=(bigint >> 8) & 255;
												data[i_data+2]=bigint & 255;
												data[i_data+3]=255;
												i_data+=4;
											}
										}
										else
										{
											for ( ; i<acumulat; i++)
											{
												data[i_data+2]=data[i_data+1]=data[i_data]=i_color0;
												data[i_data+3]=255;
												i_data+=4;
											}
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
										{
											data[i_data+2]=data[i_data+1]=data[i_data]=255;
											data[i_data+3]=0;
											i_data+=4;
										}
									}
									else
									{
										for ( ; i<acumulat; i++)
										{
											data[i_data]=i_color[0];
											data[i_data+1]=i_color[1];
											data[i_data+2]=i_color[2];
											data[i_data+3]=255;
											i_data+=4;
										}
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
	
						es_nodata=false;
						if (nodata)
						{
							for (i_ndt in nodata)
							{
								if (v[i_v]==nodata[i_ndt])
								{
									es_nodata=true;
									break;
								}
							}
						}
						if (es_nodata)
						{
							if (histograma)
								histograma.classe_nodata++;
							data[i_data+2]=data[i_data+1]=data[i_data]=255;
							data[i_data+3]=0;
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
									data[i_data+2]=data[i_data+1]=data[i_data]=255;
									data[i_data+3]=0;
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
									i_color0=Math.floor(a[0]*(valor0-valor_min[0]));
									if (i_color0>=ncolors)
										i_color0=ncolors-1;
									else if (i_color0<0)
										i_color0=0;
									if (histograma)
										classe0[i_color0]++;
									if (colors)
									{
										bigint = parseInt(colors[i_color0].substring(1), 16);
										data[i_data]=(bigint >> 16) & 255;
										data[i_data+1]=(bigint >> 8) & 255;
										data[i_data+2]=bigint & 255;
									}
									else
										data[i_data+2]=data[i_data+1]=data[i_data]=i_color0;
									data[i_data+3]=255;
								}
							}
							else
							{
								data[i_data+3]=255;
								for (i_c=0; i_c<3; i_c++)
								{
									if (component[i_c].FormulaConsulta)
									{
										valor0=eval(component[i_c].FormulaConsulta);
										if (isNaN(valor0) || valor0==null)
										{
											if (histograma)
												histograma.classe_nodata++;
											data[i_data+2]=data[i_data+1]=data[i_data]=255;
											data[i_data+3]=0;
											break;
										}
									}
									else
										valor0=v[i_v];
									if (histograma)
									{
										if (histograma.component[i_c].valorMinimReal>valor0)
											histograma.component[i_c].valorMinimReal=valor0;
										if (component[i_c].valorMaximReal<valor0)
											component[i_c].valorMaximReal=valor0;
									}
									i_color0=Math.floor(a[i_c]*(valor0-valor_min[i_c]));
									if (i_color0>=256)
										i_color0=255;
									else if (i_color0<0)
										i_color0=0;
									if (histograma)
										histograma.component[i_c].classe[i_color0]++;
									data[i_data+i_c]=i_color0;
								}
							}
						}
						i_data+=4;
					}
				}
			}
		}
        }
}

function CanviaImatgeBinariaCapaCallback(dades, extra_param)
{
var i_v, dv=[], mes_duna_v;
var capa=ParamCtrl.capa[extra_param.i_capa], valors=capa.valors, n_v;
var estil=capa.estil[extra_param.i_estil];
var histograma=null, imgData, ctx;
//cal_histo=false;

	CanviaEstatEventConsola(null, extra_param.i_event, EstarEventTotBe);

	if (extra_param.imatge==null)
	{
		alert("No support for canvas detected");
		return;
	}

	//Carrego la banda que m'ha passat
	if (extra_param.vista.i_nova_vista==-1)
		valors[extra_param.i_valor].arrayBuffer=dades;
	else if (extra_param.vista.i_nova_vista==-2)
		valors[extra_param.i_valor].arrayBufferPrint=dades;
	else if (extra_param.vista.i_nova_vista==-3)
		valors[extra_param.i_valor].capa_rodet[extra_param.i_data].arrayBuffer=dades;
	else if (extra_param.vista.i_nova_vista==-4)
		valors[extra_param.i_valor].capa_video[extra_param.i_data].arrayBuffer=dades;
	else
		valors[extra_param.i_valor].nova_capa[extra_param.vista.i_nova_vista].arrayBuffer=dades;

	//Comprovo que tinc les bandes que necessito. Si no hi son, espero més.
	n_v=valors.length;
	for (i_v=0; i_v<n_v; i_v++)
	{
		if (extra_param.vista.i_nova_vista==-1)
		{
			if (typeof valors[i_v].arrayBuffer!=="undefined" && valors[i_v].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==-2)
		{
			if (typeof valors[i_v].arrayBufferPrint!=="undefined" && valors[i_v].arrayBufferPrint==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==-3)
		{
			if (typeof valors[i_v].capa_rodet[extra_param.i_data].arrayBuffer!=="undefined" && valors[i_v].capa_rodet[extra_param.i_data].arrayBuffer==null)
				return;  //Cal esperar a la càrrega de les altres capes.
		}
		else if (extra_param.vista.i_nova_vista==-4)
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

	//Decidim on en guarda l'histograma
	if (extra_param.vista.i_nova_vista==-1)
		histograma=estil.histograma={};
	else if (extra_param.vista.i_nova_vista==-4)
	{
		estil.capa_video[extra_param.i_data]={histograma: {}};
		histograma=estil.capa_video[extra_param.i_data].histograma;
	}

	extra_param.imatge.width  = extra_param.vista.ncol;
	extra_param.imatge.height = extra_param.vista.nfil;

	ctx=extra_param.imatge.getContext("2d");
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);

	imgData=ctx.createImageData(extra_param.imatge.width,extra_param.imatge.height);

	n_v=CarregaDataViewsCapa(dv, extra_param.vista.i_nova_vista, extra_param.i_data, valors);

	if (n_v==0)
		return;

	ContruieixImatgeCanvas(imgData.data, histograma, imgData.width, imgData.height, dv, n_v-1, capa.estil[extra_param.i_estil].component, valors, estil.paleta)

	ctx.putImageData(imgData,0,0);
	CanviaCursorSobreVista("auto");
	if (extra_param.nom_funcio_ok)
	{
		if (extra_param.funcio_ok_param!=null)
			extra_param.nom_funcio_ok(extra_param.funcio_ok_param);
		else
			extra_param.nom_funcio_ok();
	}
}


function CanviaImatgeBinariaCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param)
{
var i, i_event;
var i_estil2=(i_estil==-1) ? ParamCtrl.capa[i_capa].i_estil : i_estil;
var estil=ParamCtrl.capa[i_capa].estil[i_estil2];

		if (!estil.component)
		{
			alert(DonaCadenaLang({"cat":"La capa ha estat demanada com img però no hi ha components definides al estil actual. No es podrà ni consultar\nCapa: \"",
						"spa":"La capa ha sido solicitada como img pero no tiene componentes definidas en el estilo actual.\nCapa \"",
						"eng":"The layer is requested as img but there are no defined components for the current style.\nLayer \"", 
						"fre":"La couche est requise comme img mais il n'y a pas de composants définis pour le style actuel.\nCouche \""}) + DonaCadena(ParamCtrl.capa[i_capa].desc));
			return;
		}
		//arrayBuffer és "undefined" si la banda no està implicada al dibuixat i null si encara no s'ha carregar però s'espera que ho faci.
		var valors=ParamCtrl.capa[i_capa].valors;
		//Determina les v[i] presents a l'expressió.
		var v=DeterminaArrayValorsNecessarisCapa(i_capa, i_estil2);

		if (vista.i_nova_vista==-1)
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
		else if (vista.i_nova_vista==-2)
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
		else if (vista.i_nova_vista==-3)
		{
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
		else if (vista.i_nova_vista==-4)
		{
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