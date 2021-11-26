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

function takeYear(theDate)
{
	//tret de http://www.quirksmode.org/js/introdate.html
	var x = theDate.getYear();
	var y = x % 100;
	y += (y < 38) ? 2000 : 1900;
	return y;
}

function DonaDateDesDeDataJSON(data)
{
	return new Date(DonaYearJSON(data), DonaMonthJSON(data)-1, DonaDayJSON(data), DonaHourJSON(data), DonaMinuteJSON(data), DonaSecondJSON(data));
}

function DonaDataJSONDesDeDate(d)
{
	return {year:d.getFullYear(), month: d.getMonth()+1, day: d.getDate(), hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds()};
}

//Dona un index que es pot aplicar directament a l'array de capes. 'i_data' pot ser null si volem la data per defecte. Com a 'capa' pots fer servir ParamCtrl.capa[i_capa]
function DonaIndexDataCapa(capa, i_data)
{
	if (i_data==null)
		return capa.i_data<0 ? capa.data.length+capa.i_data : capa.i_data;
	if (i_data>=capa.data.length)
		return capa.data.length-1;
	if (-i_data>capa.data.length)
		return 0;
	return (i_data<0) ? capa.data.length+i_data : i_data;
}

//Any de 4 xifres (l'equivalment javascript és d.getFullYear())
function DonaYearJSON(data)
{
	if (data.year)
		return data.year;
	return 1970;
}

//Mes de l'any de 1 a 12 (l'equivalment javascript és d.getMonth()+1)
function DonaMonthJSON(data)
{
	if (data.month)
		return data.month;
	return 1;
}

//Dia del mes de 1 a 31 (l'equivalment javascript és d.getDate())
function DonaDayJSON(data)
{
	if (data.day)
		return data.day;
	return 1;
}

function DonaHourJSON(data)
{
	if (data.hour)
		return data.hour;
	return 0;
}

function DonaMinuteJSON(data)
{
	if (data.minute)
		return data.minute;
	return 0;
}

function DonaSecondJSON(data)
{
	if (data.second)
		return data.second;
	return 0;
}

function DonaDataComAText(i_capa, i_data)
{
var cdns=[], data_a_usar, capa=ParamCtrl.capa[i_capa];

	if (!(capa.FlagsData))
		return "";
	if (capa.FlagsData.DataMostraAny ||
	    capa.FlagsData.DataMostraMes ||
	    capa.FlagsData.DataMostraDia ||
	    capa.FlagsData.DataMostraHora ||
	    capa.FlagsData.DataMostraMinut ||
	    capa.FlagsData.DataMostraSegon)
		data_a_usar=capa.data[DonaIndexDataCapa(capa, i_data)];

	if (capa.FlagsData.DataMostraDescLlegenda)
	    cdns.push(DonaCadena(capa.DescLlegenda)," ");
	if (capa.FlagsData.DataMostraDia)
	    cdns.push(DonaDayJSON(data_a_usar) , " ");
	if (capa.FlagsData.DataMostraMes)
	{
		if (capa.FlagsData.DataMostraDia)
		    cdns.push(GetMessage("PrepMonthOfTheYear"+(DonaMonthJSON(data_a_usar)-1), "datahora"));
		else
		    cdns.push(GetMessage("MonthOfTheYear"+(DonaMonthJSON(data_a_usar)-1), "datahora"));
	}
	if (capa.FlagsData.DataMostraAny)
	{
		if (capa.FlagsData.DataMostraMes)
		    cdns.push(" ",(GetMessage("ofData"), " "));
		cdns.push(DonaYearJSON(data_a_usar));
    }
	return cdns.join("");
}

function DonaDataComATextBreu(flags_data, data_a_usar)
{
var cdns=[];

	if (flags_data.DataMostraDia)
	{
		if (DonaDayJSON(data_a_usar)<10)
		    cdns.push("0");
		cdns.push(DonaDayJSON(data_a_usar));
	}
	if (flags_data.DataMostraMes)
	{
	    if (flags_data.DataMostraDia)
	        cdns.push("-");
	    if (DonaMonthJSON(data_a_usar)<10)
			cdns.push("0");
	    cdns.push(DonaMonthJSON(data_a_usar));
	}
	if (flags_data.DataMostraAny)
	{
	    if (flags_data.DataMostraMes)
			cdns.push("-");
	    cdns.push(DonaYearJSON(data_a_usar));
	}
	if (flags_data.DataMostraHora || flags_data.DataMostraMinut || flags_data.DataMostraSegon)
	{
	    if (flags_data.DataMostraAny || flags_data.DataMostraMes || flags_data.DataMostraDia)
			cdns.push(" ");
	}
	if (flags_data.DataMostraHora)
	{
	    if (DonaHourJSON(data_a_usar)<10)
			cdns.push("0");
	    cdns.push(DonaHourJSON(data_a_usar));
	}
	if (flags_data.DataMostraMinut)
	{
	    if (flags_data.DataMostraHora)
			cdns.push(":");
	    if (DonaMinuteJSON(data_a_usar)<10)
			cdns.push("0");
	    cdns.push(DonaMinuteJSON(data_a_usar));
	}
	if (flags_data.DataMostraSegon)
	{
	    if (flags_data.DataMostraMinut)
			cdns.push(":");
	    if (DonaSecondJSON(data_a_usar)<10)
			cdns.push("0");
	    cdns.push(DonaSecondJSON(data_a_usar));
	}
	return cdns.join("");
}

function DonaDataMillisegonsComATextBreu(flags_data, millisegons)
{
var cdns=[];
var d = new Date(millisegons);

	if (flags_data.DataMostraDia)
	{
		if (d.getDate()<10)
		    cdns.push("0");
		cdns.push(d.getDate());
	}
	if (flags_data.DataMostraMes)
	{
	    if (flags_data.DataMostraDia)
	        cdns.push("-");
	    if (d.getMonth()<9)
			cdns.push("0");
	    cdns.push(d.getMonth()+1);
	}
	if (flags_data.DataMostraAny)
	{
	    if (flags_data.DataMostraMes)
			cdns.push("-");
	    cdns.push(d.getFullYear());
	}
	if (flags_data.DataMostraHora || flags_data.DataMostraMinut || flags_data.DataMostraSegon)
	{
	    if (flags_data.DataMostraAny || flags_data.DataMostraMes || flags_data.DataMostraDia)
			cdns.push(" ");
	}
	if (flags_data.DataMostraHora)
	{
	    if (d.getHour()<10)
			cdns.push("0");
	    cdns.push(d.getHour());
	}
	if (flags_data.DataMostraMinut)
	{
	    if (flags_data.DataMostraHora)
			cdns.push(":");
	    if (d.getMinutes()<10)
			cdns.push("0");
	    cdns.push(d.getMinutes());
	}
	if (flags_data.DataMostraSegon)
	{
	    if (flags_data.DataMostraMinut)
			cdns.push(":");
	    if (d.getSeconds()<10)
			cdns.push("0");
	    cdns.push(d.getSeconds());
	}
	return cdns.join("");
}


function DonaDataCapaPerLlegenda(i_capa, i_data)
{
var data, cdns=[], capa=ParamCtrl.capa[i_capa];
	cdns.push(DonaDataCapaComATextBreu(i_capa, i_data));
	if (capa.FlagsData && capa.FlagsData.properties)
	{
		data=capa.data[DonaIndexDataCapa(capa, i_data)];
		for (var i=0; i<capa.FlagsData.properties.length; i++)
		{
			var s, prop=capa.FlagsData.properties[i];
			try  //La formula pot apuntar a membre que no existeixen per una data concreta.
			{
				s=eval(prop.formula);
			}
			catch(e)
			{
				s=null;
			}
			if (s)
				cdns.push(", "+DonaCadena(prop.DescLlegenda)+"="+s+(prop.unitats? prop.unitats : ""));
		}
	}
	return cdns.join("");
}

function DonaDataCapaComATextBreu(i_capa, i_data)
{
var data_a_usar, cdns=[], capa=ParamCtrl.capa[i_capa];

	if (!(capa.FlagsData))
		return "";
	if (capa.FlagsData.DataMostraDescLlegenda)
	{
	    cdns.push(DonaCadena(capa.DescLlegenda));
	    if (capa.FlagsData.DataMostraAny ||
			capa.FlagsData.DataMostraMes ||
			capa.FlagsData.DataMostraDia ||
			capa.FlagsData.DataMostraHora ||
        	capa.FlagsData.DataMostraMinut ||
			capa.FlagsData.DataMostraSegon)
		        cdns.push(",");
	}
	if (capa.FlagsData.DataMostraAny ||
		capa.FlagsData.DataMostraMes ||
		capa.FlagsData.DataMostraDia ||
		capa.FlagsData.DataMostraHora ||
        capa.FlagsData.DataMostraMinut ||
		capa.FlagsData.DataMostraSegon)
		data_a_usar=capa.data[DonaIndexDataCapa(capa, i_data)];
	else
		return cdns.join("");
	cdns.push(DonaDataComATextBreu(capa.FlagsData, data_a_usar));
	return cdns.join("");
}

function DonaDataJSONComATextCompacte(data)
{
var cdns=[];

	if(data)
	{
	    cdns.push(DonaYearJSON(data));
	    if(DonaMonthJSON(data)<10)
			cdns.push("0");
	    cdns.push(DonaMonthJSON(data));
	    if(DonaDayJSON(data)<10)
			cdns.push("0");
	    cdns.push(DonaDayJSON(data));

	    //Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s'omple com 00:00:00.
	    if(DonaHourJSON(data)!=0 || DonaMinuteJSON(data)!=0 || DonaSecondJSON(data)!=0)
	    {
			if(DonaHourJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaHourJSON(data));
			if(DonaMinuteJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaMinuteJSON(data));
			if(DonaSecondJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaSecondJSON(data));
	    }
	}
	return cdns.join("");
}//fi de DonaDataJSONComATextCompacte()

function DonaDateComATextCompacte(d)
{
var cdns=[];

	if(data)
	{
	    cdns.push(d.getFullYear());
	    if(d.getMonth()<9)
			cdns.push("0");
	    cdns.push(d.getMonth()+1);
	    if(d.getDate()<10)
			cdns.push("0");
	    cdns.push(d.getDate());

	    //Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s'omple com 00:00:00.
	    if(DonaHourJSON(data)!=0 || DonaMinuteJSON(data)!=0 || DonaSecondJSON(data)!=0)
	    {
			if(d.getHours()<10)
				cdns.push("0");
			cdns.push(d.getHours());
			if(d.getMinutes()<10)
				cdns.push("0");
			cdns.push(d.getMinutes());
			if(d.getSeconds()<10)
				cdns.push("0");
			cdns.push(d.getSeconds());
	    }
	}
	return cdns.join("");
}//fi de DonaDataJSONComATextCompacte()


//o_data és una sortida en aquesta funció
function OmpleDataJSONAPartirDeDataISO8601(o_data, cadena_data)
{
	//primer miro els separadors de guions per veure que té de aaaa-mm-dd
	var tros_data=cadena_data.split("-");
	o_data.year=parseInt(tros_data[0]);

	if(tros_data.length==1) //Només hi ha any i res més
		return {"DataMostraAny": true};

	o_data.month=parseInt(tros_data[1]);

	if(tros_data.length==2) //Any i mes
		return {"DataMostraAny": true, "DataMostraMes": true};

	//Any, mes i dia i potser time
	var i_time=tros_data[2].indexOf("[T]");
	if(i_time==-1)
	{
		o_data.day=parseInt(tros_data[2]);
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true};
	}
	o_data.day=parseInt(tros_data[2].substr(0, i_time));

	var tros_time=(tros_data[2].substr(i_time+1)).split(":");
	if(tros_time.length==1) //només hi ha hora
	{
		var i_z=tros_time[0].indexOf("[Z]");
		if(i_z==-1)
			o_data.hour=parseInt(tros_time[0]);
		else
			o_data.hour=parseInt(tros_time[0].substr(0,i_z));
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true};
	}
	o_data.hour=parseInt(tros_time[0]);
	if(tros_time.length==2) //hh:mm[Z]
	{
		var i_z=tros_time[1].indexOf("[Z]");
		if(i_z==-1)
			o_data.minute=parseInt(tros_time[1]);
		else
			o_data.minute=parseInt(tros_time[1].substr(0,i_z));
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true};
	}
	o_data.minute=parseInt(tros_time[1]);
	if(tros_time.length==3) //hh:mm:ss[Z]  // ·$· NJ-> ? Això no és correcte, hi ha altres formats ISO que tenen una longitud de més de 3 i aquesta funció no reconeix. per exemple "2020-09-25T12:59:06.035+02:00"
	// Jo ho he resolt fent new Date("2020-09-25T12:59:06.035+02:00"); potser no caldria fer cap parser, no? ja que un cop tens un date és més fàcil passar-ho a JSON i ja tenim funcions per això.
	{
		var i_ms=tros_time[2].indexOf("[.]");
		var i_z=tros_time[2].indexOf("[Z]");
		if(i_z==-1 && i_ms==-1)
			o_data.second=parseInt(tros_time[2]);
		else if(i_z!=-1 && i_ms==-1)
			o_data.second=parseInt(tros_time[2].substr(0,i_z));
		else
		{
			o_data.second=parseInt(tros_time[2].substr(0,i_ms));
			o_data.millisecond=parseInt(tros_time[2].substr(i_ms+1,(i_z-i_ms)));
		}
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true, "DataMostraSegon": segon};
	}
	return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true};
}

/*Eliminada en favor DonaDateComATextISO8601() que existeix sempre. Es va crear per IE8 compatibility for toISOString
if(!Date.prototype.toISOString)
{
	Date.prototype.toISOString= function(data) {
		//Copy of the old DonaDataISO8601ComAText for IE8 compatibility.
		//Can be deleted once Microsoft target browser raises to IE9
	var cdns=[];

		if(data)
		{
			//Segons la ISO com a mínim he de mostrar l'any
				cdns.push((data.getFullYear ? data.getFullYear() : takeYear(data)));
			if(que_mostrar&mostra_mes)
			{
				cdns.push("-");
				if(data.getMonth()<9)
					cdns.push("0");
				cdns.push((data.getMonth()+1));
				if(que_mostrar&mostra_dia)
				{
					cdns.push("-");
					if(data.getDate()<10)
						cdns.push("0");
					cdns.push((data.getDate()));

						//Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s'omple com 00:00:00.
					if(que_mostrar&mostra_hora)
					{
						if(data.getHours()!=0 || data.getMinutes()!=0 || data.getSeconds()!=0)
						{
							cdns.push("T");
							if(data.getHours()<10)
								cdns.push("0");
							cdns.push(data.getHours());
							if(que_mostrar&mostra_minut)
							{
								cdns.push(":" );
								if(data.getMinutes()<10)
									cdns.push("0");
								cdns.push(data.getMinutes());
								if(que_mostrar&mostra_segon)
								{
									cdns.push(":" );
									if(data.getSeconds()<10)
										cdns.push("0");
									cdns.push(data.getSeconds());
								}
							}
							cdns.push("Z");
						}
					}
				}
			}
		}
		return cdns.join("");
	};
}*/

function DonaDateComATextISO8601(data, que_mostrar)
{
var cdns=[];

	if (data && que_mostrar)
	{
		//Segons la ISO com a mínim he de mostrar l'any
	    cdns.push(data.getFullYear ? data.getFullYear() : takeYear(data));
		if(que_mostrar.DataMostraMes)
		{
			cdns.push("-");
		    	if( data.getMonth()<9)
				cdns.push("0");
			cdns.push((data.getMonth()+1));
			if (que_mostrar.DataMostraDia)
			{
				cdns.push("-");
		    	if(data.getDate()<10)
					cdns.push("0");
			    cdns.push((data.getDate()));

			    //Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s¡omple com 00:00:00.
				if(que_mostrar.DataMostraHora)
				{
	    			if(data.getHours()!=0 || data.getMinutes()!=0 || data.getSeconds()!=0)
				    {
						cdns.push("T");
						if(data.getHours()<10)
							cdns.push("0");
						cdns.push(data.getHours());
						if(que_mostrar.DataMostraMinut)
						{
							cdns.push(":" );
							if(data.getMinutes()<10)
								cdns.push("0");
							cdns.push(data.getMinutes());
							if(que_mostrar.DataMostraSegon)
							{
								cdns.push(":" );
								if(data.getSeconds()<10)
									cdns.push("0");
								cdns.push(data.getSeconds());
						    }
						}
						cdns.push("Z");
					}
				}
			}
		}
	}
	return cdns.join("");
}//fi de DonaDateComATextISO8601()

function DonaDataJSONComATextISO8601(data, que_mostrar)
{
var cdns=[];

	if (!data)
		return "";
	if (que_mostrar)
	{
		//Segons la ISO com a mínim he de mostrar l'any però nosaltres permetem altres coses deliveradament
		if(que_mostrar.DataMostraAny)
			cdns.push(DonaYearJSON(data));
		if(que_mostrar.DataMostraMes)
		{
			if(que_mostrar.DataMostraAny)
				cdns.push("-");
		    	if( DonaMonthJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaMonthJSON(data));
			if (que_mostrar.DataMostraDia)
			{
				cdns.push("-");
				if(DonaDayJSON(data)<10)
					cdns.push("0");
				cdns.push(DonaDayJSON(data));

			    	//Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s'omple com 00:00:00.
				if(que_mostrar.DataMostraHora)
				{
	    				if(DonaHourJSON(data)!=0 || DonaMinuteJSON(data)!=0 || DonaSecondJSON(data)!=0)
					{
						cdns.push("T");
						if(DonaHourJSON(data)<10)
							cdns.push("0");
						cdns.push(DonaHourJSON(data));
						if(que_mostrar.DataMostraMinut)
						{
							cdns.push(":" );
							if(DonaMinuteJSON(data)<10)
								cdns.push("0");
							cdns.push(DonaMinuteJSON(data));
							if(que_mostrar.DataMostraSegon)
							{
								cdns.push(":" );
								if(DonaSecondJSON(data)<10)
									cdns.push("0");
								cdns.push(DonaSecondJSON(data));
						    }
						}
						cdns.push("Z");
					}
				}
			}
		}
	}
	else
	{
		cdns.push(DonaYearJSON(data));
		cdns.push("-");
		if( DonaMonthJSON(data)<10)
			cdns.push("0");
		cdns.push(DonaMonthJSON(data));
		cdns.push("-");
		if(DonaDayJSON(data)<10)
			cdns.push("0");
		cdns.push(DonaDayJSON(data));

		if (DonaHourJSON(data)!=0 || DonaMinuteJSON(data)!=0 || DonaSecondJSON(data)!=0)
		{
			cdns.push("T");
			if(DonaHourJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaHourJSON(data));
			cdns.push(":" );
			if(DonaMinuteJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaMinuteJSON(data));
			cdns.push(":" );
			if(DonaSecondJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaSecondJSON(data));
			cdns.push("Z");
		}
	}
	return cdns.join("");
}//fi de DonaDataJSONComATextISO8601()

//Retorna una cosa com: "DD-MM-YYYY hh:mm:ss" depenent de que_mostrar
function DonaCadenaFormatDataHora(que_mostrar)
{
var cdns=[];

	if (que_mostrar)
	{
		//Segons la ISO com a mínim he de mostrar l'any
		if (que_mostrar.DataMostraDia)
			cdns.push("DD");
		if (que_mostrar.DataMostraMes)
		{
			if (que_mostrar.DataMostraDia)
				cdns.push("-");
			cdns.push("MM");
		}
		if (que_mostrar.DataMostraAny)
		{
			if (que_mostrar.DataMostraMes)
				cdns.push("-");
			cdns.push("YYYY");
		}

		if(que_mostrar.DataMostraHora)
		{
			if (cdns.length>0)
				cdns.push(" ");
			cdns.push("hh");
		}
		if(que_mostrar.DataMostraMinut)
		{
			if(que_mostrar.DataMostraHora)
				cdns.push(":");
			cdns.push("mm");
		}
		if(que_mostrar.DataMostraSegon)
		{
			if(que_mostrar.DataMostraMinut)
				cdns.push(":");
			cdns.push("ss");
		}
	}
	return cdns.join("");
}

function DonaDisplayFormatsChartJSDataHora(que_mostrar)
{
var df={}, cdns=[];

	if (que_mostrar)
	{
		//Segons la ISO com a mínim he de mostrar l'any
		if (que_mostrar.DataMostraDia)
			cdns.push("DD");
		if (que_mostrar.DataMostraMes)
		{
			if (que_mostrar.DataMostraDia)
				cdns.push("-");
			cdns.push("MM");
		}
		if (que_mostrar.DataMostraAny)
		{
			if (que_mostrar.DataMostraMes)
				cdns.push("-");
			cdns.push("YYYY");
		}
		if (cdns.length)
			df.day=cdns.join("");

		cdns=[];
		if(que_mostrar.DataMostraHora)
		{
			cdns.push("hh");
		}
		if(que_mostrar.DataMostraMinut)
		{
			if(que_mostrar.DataMostraHora)
				cdns.push(":");
			cdns.push("mm");
		}
		if(que_mostrar.DataMostraSegon)
		{
			if(que_mostrar.DataMostraMinut)
				cdns.push(":");
			cdns.push("ss");
		}
		if (cdns.length)
			df.second=cdns.join("");
	}
	return df;
}

function DonaUnitTimeChartJSDataHora(que_mostrar)
{
	if (que_mostrar)
	{
		if (que_mostrar.DataMostraSegon)
			return "second";
		if (que_mostrar.DataMostraMinut)
			return "minute";
		if (que_mostrar.DataMostraHora)
			return "hour";
		if (que_mostrar.DataMostraDia)
			return "day";
		if (que_mostrar.DataMostraMes)
			return "month";
		if (que_mostrar.DataMostraAny)
			return "year";
	}
	return null;
}

//Aquest funció, de moment, només canvia les variables {TIME}, {TIME?f=*&year=*&month=*...} i {DIM?name=*}. En el config_schema.json s'explica una mica més.
function CanviaVariablesDeCadena(s, capa, i_data)
{
var i, ii, k, p, kvp, query, valor, i_v, num_of_vs, v, estil;

	if (capa.data && capa.data.length)
	{
		var i_data_sel=DonaIndexDataCapa(capa, i_data);
		while(true)
		{
			i=s.toUpperCase().indexOf("{TIME}");  //Abans era %TIME% però prefereixo fer servir una URL template.
			if (i==-1)
				break;
			s=s.substring(0,i) + DonaDataJSONComATextCompacte(capa.data[i_data_sel]) + s.substring(i+6);

		}
		while(true)
		{
			i=s.toUpperCase().indexOf("{TIME_ISO}");  //Deprecated. Please use
			if (i==-1)
				break;
			alert("'{TIME_ISO}' has been deprecated. Please use '{TIME?f=ISO}'");
			s=s.substring(0,i) +
				DonaDataJSONComATextISO8601(capa.data[i_data_sel], capa.FlagsData) +
				s.substring(i+10);
		}
		while(true)
		{
			i=s.toUpperCase().indexOf("{TIME?");  //Abans era %TIME% però prefereixo fer servir una URL template.
			if (i==-1)
				break;
			ii=s.substring(i+6,s.length).indexOf("}");
			if (ii==-1)
			{
				alert("Format error. '{TIME?' without '}' at the end");
				break;
			}
			kvp=s.substring(i+6,i+6+ii).split("&");
			query={};
			for(k=0; k<kvp.length; k++)
			{
				p = kvp[k].indexOf("=");  // Gets the first index where a space occours
				if (p==-1)
				{
					alert("Format error in '{TIME?', Key and value pair (KVP) without '='.");
					break;
				}
				query[kvp[k].substring(0, p).toLowerCase()]=kvp[k].substring(p+1);
			}

			if (query["year"] || query["month"] || query["day"] || query["hour"] || query["minute"] || query["second"])
			{
				//All these parametres can be positive or negative
				var d=DonaDateDesDeDataJSON(capa.data[i_data_sel])
				if (query["year"])
					d.setFullYear(d.getFullYear()+parseInt(query["year"]));
				if (query["month"])
					d.setMonth(d.getMonth()+parseInt(query["month"]));
				if (query["day"])
					d.setDate(d.getDate()+parseInt(query["day"]));
				if (query["hour"])
					d.setHours(d.getHours()+parseInt(query["hour"]));
				if (query["minute"])
					d.setMinutes(d.getMinutes()+parseInt(query["minute"]));
				if (query["second"])
					d.setSeconds(d.getSeconds()+parseInt(query["second"]));
				s=s.substring(0,i) + (query.f=="ISO" ? DonaDateComATextISO8601(d, capa.FlagsData) : DonaDateComATextCompacte(d)) + s.substring(i+6+ii+1);
			}
			else
				s=s.substring(0,i) + (query.f=="ISO" ? DonaDataJSONComATextISO8601(capa.data[i_data_sel], capa.FlagsData) : DonaDataJSONComATextCompacte(capa.data[i_data_sel])) + s.substring(i+6+ii+1);
		}
		while(true)
		{
			i=s.toUpperCase().indexOf("{DIM?");
			if (i==-1)
				break;
			ii=s.substring(i+5,s.length).indexOf("}");
			if (ii==-1)
			{
				alert("Format error. '{DIM?' without '}' at the end");
				break;
			}
			kvp=s.substring(i+5,i+5+ii).split("&");
			query={};
			for(k=0; k<kvp.length; k++)
			{
				p = kvp[k].indexOf("=");
				if (p==-1)
				{
					alert("Format error in '{DIM?', Key and value pair (KVP) without '='.");
					break;
				}
				query[kvp[k].substring(0, p).toLowerCase()]=kvp[k].substring(p+1);
			}
			if (!query.name)
			{
				alert("Format error in '{DIM?', Key 'name' not found.");
				break;
			}
			estil=capa.estil[capa.i_estil];
			if (!estil || !estil.component[0])
			{
				alert("Cannot find '" + query.name + "' extracted from the KVP '{DIM?' expression in the selected style");
				break;
			}
			if (estil.component[0].i_valor)
			{
				valor=capa.valors[estil.component[0].i_valor];
				if (!valor)
				{
					alert("Cannot find '" + query.name + "' extracted from the KVP '{DIM?' expression in the selected style");
					break;
				}
			}
			else if (estil.component[0].FormulaConsulta)
			{
				//Determinio si hi ha un sol v[i] a la formula i en aquest cas, no hi ha problema en continuar.
				num_of_vs=0;
				v=DeterminaArrayValorsNecessarisCapa(ParamCtrl.capa.indexOf(capa), capa.i_estil);
				for (i_v=0; i_v<capa.valors.length; i_v++)
				{
					if (v[i_v])
					{
						valor=capa.valors[i_v];
						num_of_vs++;
						if (num_of_vs>1)
							break;
					}
				}
				if (num_of_vs!=1 || !valor)
				{
					alert("There is ambiguity in the values of '" + query.name + "' extracted from the KVP '{DIM?' expression. This is probably because this style is an expression. Try to select another style.");
					break;
				}
			}

			for (var i_param=0; i_param<valor.param.length; i_param++)
			{
				if (query.name==valor.param[i_param].clau.nom)
				{
					s=s.substring(0,i) + valor.param[i_param].valor.nom + s.substring(i+5+ii+1);
					break;
				}
			}
			if (i_param==valor.param.length)
			{
				alert("Cannot find '" + query.name + "' extracted from the KVP '{DIM?' expression in the selected style");
				break;
			}
		}
	}
	return s;
}

//Funció simplificada de CarregaDatesVideo() que retorna només un array de dades de totes les capes en mil·lisegons.
function CarregaDatesCapes()
{
var capa, dates=[];

	for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		capa=ParamCtrl.capa[i_capa];
		if (capa.data)
		{
			for (var i_data=0; i_data<capa.data.length; i_data++)
			{
				var d=DonaDateDesDeDataJSON(capa.data[i_data]);
				dates.push(d.getTime());
			}
		}
	}
	dates.sort(sortAscendingNumber);
	dates.removeDuplicates(sortAscendingNumber);
	return dates;
}

function DeterminaMillisegonsActualCapes()
{
var capa, millisegons=0;

	for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		capa=ParamCtrl.capa[i_capa];
		if (capa.data)
		{
			var d=DonaDateDesDeDataJSON(capa.data[DonaIndexDataCapa(capa, capa.i_data)]);
			if (millisegons<d.getTime())
				millisegons=d.getTime();
		}
	}
	return millisegons;
}

function SincronitzaCapesMillisegons(millisegons)
{
var i_data, i_data_bona, i_capa_bona, m_bona, m, i, es_video_agregat;
var capa, capa_previa, capa_seguent, capa_visible;

	i=ParamInternCtrl.millisegons.binarySearch(millisegons, sortAscendingNumber);
	if (i<0)
		ParamInternCtrl.iMillisegonsActual=-i-2;
	else
		ParamInternCtrl.iMillisegonsActual=i;

	//corregeixo el valor.
	millisegons=ParamInternCtrl.millisegons[ParamInternCtrl.iMillisegonsActual];

	for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		capa=ParamCtrl.capa[i_capa];
		if (capa.data && capa.data.length)
		{
			//Determino si forma part d'un video que no s'ha evaluat abans.
			if (capa.NomVideo)
			{
				//Determino si forma part d'un video "agregat" que no s'ha avaluat abans.
				for (var i_capa_previa=0; i_capa_previa<i_capa; i_capa_previa++)
				{
					capa_previa=ParamCtrl.capa[i_capa_previa];
					if (capa_previa.data && capa_previa.data.length && capa_previa.NomVideo==capa.NomVideo)
						break;
				}
				if (i_capa_previa<i_capa)
					continue;  //Ja ha estat evaluada i no cal ara.
			}

			m_bona=ParamInternCtrl.millisegons[ParamInternCtrl.millisegons.length-1]-ParamInternCtrl.millisegons[0]+1;
			i_data_bona=0;
			i_capa_bona=i_capa;

			//Les capes agregades s'avaluen juntes
			for (var i_capa_seguent=i_capa; i_capa_seguent<ParamCtrl.capa.length; i_capa_seguent++)
			{
				capa_seguent=ParamCtrl.capa[i_capa_seguent];
				if (capa_seguent.data && capa_seguent.data.length && (!capa.NomVideo || capa_seguent.NomVideo==capa.NomVideo))
				{
					//Decideixo no assumir que estan ordenats.
					for (var i_data=0; i_data<capa_seguent.data.length; i_data++)
					{
						var d=DonaDateDesDeDataJSON(capa_seguent.data[i_data]);
						if (millisegons<d.getTime())
							continue;
						if (millisegons==d.getTime())
						{
							i_data_bona=i_data;
							i_capa_bona=i_capa_seguent;
							m_bona=0;
							break;
						}
						else
						{
							m=millisegons-d.getTime();
							if (m_bona>m)
							{
								m_bona=m;
								i_data_bona=i_data;
								i_capa_bona=i_capa_seguent;
							}
						}
					}
					if (i_data<capa_seguent.data.length || !capa.NomVideo)
						break;
				}
			}

			es_video_agregat=false;
			if (capa.NomVideo)
			{
				for (var i_capa_seguent=i_capa+1; i_capa_seguent<ParamCtrl.capa.length; i_capa_seguent++)
				{
					capa_seguent=ParamCtrl.capa[i_capa_seguent];
					if (capa_seguent.data && capa_seguent.data.length && (!capa.NomVideo || capa_seguent.NomVideo==capa.NomVideo))
					{
						es_video_agregat=true;
						break;
					}
				}
			}

			capa=ParamCtrl.capa[i_capa_bona];
			capa.i_data=i_data_bona;
			if (es_video_agregat)
			{
				//Ara cal repassar totes les capes agregades en un video i mirar quina es deixa visible (si n'hi ha alguna).
				for (var i_capa_visible=i_capa; i_capa_visible<ParamCtrl.capa.length; i_capa_visible++)
				{
					capa_visible=ParamCtrl.capa[i_capa_visible];
					if (capa_visible.data && capa_visible.data.length && capa_visible.NomVideo==capa.NomVideo && (capa_visible.visible=="si" || capa_visible.visible=="semitransparent"))
						break;
				}
				if (i_capa_visible<ParamCtrl.capa.length)  //una capa es visible
				{
					var visible=capa_visible.visible;
					for (var i_capa_seguent=i_capa; i_capa_seguent<ParamCtrl.capa.length; i_capa_seguent++)
					{
						var capa_seguent=ParamCtrl.capa[i_capa_seguent];
						if (capa_seguent.data && capa_seguent.data.length && capa_seguent.NomVideo==capa.NomVideo)
						{
							if (i_capa_seguent==i_capa_bona)
								capa.visible=visible;
							else
								capa_seguent.visible="ara_no";
						}
					}
				}
			}
		}
	}
}

function DeterminaFlagsDataCapes()
{
var capa, flags_data={};

	//Determino quins fotogrames he de fer servir.
	for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		capa=ParamCtrl.capa[i_capa];
		if (!(capa.FlagsData))
			continue;
		if (capa.FlagsData.DataMostraAny)
			flags_data.DataMostraAny=true;
		if (capa.FlagsData.DataMostraMes)
			flags_data.DataMostraMes=true;
		if (capa.FlagsData.DataMostraDia)
			flags_data.DataMostraDia=true;
		if (capa.FlagsData.DataMostraHora)
			flags_data.DataMostraHora=true;
		if (capa.FlagsData.DataMostraMinut)
			flags_data.DataMostraMinut=true;
		if (capa.FlagsData.DataMostraSegon)
			flags_data.DataMostraSegon=true;
		if (capa.FlagsData.DataMostraDescLlegenda)
			flags_data.DataMostraDescLlegenda=true;
	}
	return flags_data;
}

function DonaDescriptorDates(flags_data)
{
	if (flags_data.DataMostraHora || flags_data.DataMostraMinut || flags_data.DataMostraSegon)
		return GetMessage("DateTime");
	return GetMessage("Date");
}

function sortAscendingISOiData(milliseg_a, data_json)
{
var milliseg_b;
	milliseg_b=DonaDateDesDeDataJSON(data_json).getTime();
	return sortAscendingNumber(milliseg_a, milliseg_b);
}

//Aquesta funció insereix una data a l'array de dades de la capa
function InsereixDataISOaCapa(data_iso, data_capa)
{
var d=new Date(data_iso);
var milliseg_a=d.getTime();
	var i=data_capa.binarySearch(milliseg_a, sortAscendingISOiData);
	if (i<0)  //Not present in the array
		data_capa.splice(-i-1, 0, DonaDataJSONDesDeDate(d));
}
