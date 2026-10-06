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

    Copyright 2001, 2026 Xavier Pons

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

//Dona un índex que es pot aplicar directament a l'array de capes. 'i_data' pot ser null si volem la data per defecte. Com a 'capa' pots fer servir ParamCtrl.capa[i_capa]
function DonaIndexDataCapa(capa, i_data)
{
	if (i_data==null)
		return capa.i_data<0 ? capa.data.length+capa.i_data : capa.i_data;
	
	if(typeof i_data === "string")
	{
		// En aquest cas s'interpreta que i_data és un string que pot contenir una operació matemàtica que pot contenir '{i_sel}'; que representa la data seleccionada.
		return DonaIndexDataCapa(capa, eval(i_data.replaceAll('{i_sel}', capa.i_data)));
	}
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
		    cdns.push(" ",(GetMessage("ofData", "datahora"), " "));
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
	if(flags_data.DataMostraPeriodes)
		return cdns.join("");
	
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
	    if (d.getHours()<10)
			cdns.push("0");
	    cdns.push(d.getHours());
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

function DonaDataCapaPerLlegenda(i_capa, i_data, dates)
{
var data, cdns=[], capa=ParamCtrl.capa[i_capa];

	if(!dates)
		dates=capa.data;
	cdns.push(DonaDataCapaComATextBreu(i_capa, i_data, dates));
	if (capa.FlagsData && capa.FlagsData.properties)
	{
		data=dates[DonaIndexDataCapa(capa, i_data)];
		for (var i=0; i<capa.FlagsData.properties.length; i++)
		{
			var s, prop=capa.FlagsData.properties[i];
			try  //La fórmula pot apuntar a membre que no existeixen per una data concreta.
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

function DonaDataCapaComATextBreu(i_capa, i_data, dates)
{
var data_a_usar, cdns=[], capa=ParamCtrl.capa[i_capa];

	if (!(capa.FlagsData))
		return "";
	if(!dates)
		dates=capa.data;
	if (capa.FlagsData.DataMostraDescLlegenda)
	{
	    cdns.push(DonaCadena(capa.DescLlegenda));
		if (capa.FlagsData.DataMostraPeriodes)
		{
			if( capa.FlagsData.DataMostraAny ||
				capa.FlagsData.DataMostraMes ||
				capa.FlagsData.DataMostraDia)
				cdns.push(",");
		}
		else
		{
			if (capa.FlagsData.DataMostraAny ||
				capa.FlagsData.DataMostraMes ||
				capa.FlagsData.DataMostraDia ||
				capa.FlagsData.DataMostraHora ||
				capa.FlagsData.DataMostraMinut ||
				capa.FlagsData.DataMostraSegon)
					cdns.push(",");
		}
	}
	if (capa.FlagsData.DataMostraPeriodes)
	{
		if( capa.FlagsData.DataMostraAny ||
			capa.FlagsData.DataMostraMes ||
			capa.FlagsData.DataMostraDia)
			data_a_usar=dates[DonaIndexDataCapa(capa, i_data)];
		else
			return cdns.join("");
	}
	else{	
		if (capa.FlagsData.DataMostraAny ||
			capa.FlagsData.DataMostraMes ||
			capa.FlagsData.DataMostraDia ||
			capa.FlagsData.DataMostraHora ||
			capa.FlagsData.DataMostraMinut ||
			capa.FlagsData.DataMostraSegon)
			data_a_usar=dates[DonaIndexDataCapa(capa, i_data)];
		else
			return cdns.join("");
	}
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
}//fi de DonaDateComATextCompacte()


/*Aquesta funció retorna FlagsData i omple o_data amb els resultat del canvi de data. Cal passar una variable inicialitzada així: odata={};
La funció en si és una mica rara i si no interessa el retorn FlagsData potser és millor fer:
var d=new Date(cadena_data);
o_data=DonaDataJSONDesDeDate(d);
*/
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
	var i_time=tros_data[2].indexOf("T");
	if(i_time==-1)
	{
		o_data.day=parseInt(tros_data[2]);
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true};
	}
	o_data.day=parseInt(tros_data[2].substr(0, i_time));

	var tros_time=(tros_data[2].substr(i_time+1)).split(":");
	if(tros_time.length==1) //només hi ha hora
	{
		var i_z=tros_time[0].indexOf("Z");
		if(i_z==-1)
			o_data.hour=parseInt(tros_time[0]);
		else
			o_data.hour=parseInt(tros_time[0].substr(0,i_z));
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true};
	}
	o_data.hour=parseInt(tros_time[0]);
	if(tros_time.length==2) //hh:mm[Z]
	{
		var i_z=tros_time[1].indexOf("Z");
		if(i_z==-1)
			o_data.minute=parseInt(tros_time[1]);
		else
			o_data.minute=parseInt(tros_time[1].substr(0,i_z));
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true};
	}
	o_data.minute=parseInt(tros_time[1]);
	if(tros_time.length==3) //hh:mm:ss[Z]  // ·$· NJ-> ? Això no és correcte, hi ha altres formats ISO que tenen una longitud de més de 3 i aquesta funció no reconeix. per exemple "2020-09-25T12:59:06.035+02:00"
	{
		var i_ms=tros_time[2].indexOf(".");
		var i_z=tros_time[2].indexOf("Z");
		if(i_z==-1 && i_ms==-1)
			o_data.second=parseInt(tros_time[2]);
		else if(i_z!=-1 && i_ms==-1)
			o_data.second=parseInt(tros_time[2].substr(0,i_z));
		else
		{
			o_data.second=parseInt(tros_time[2].substr(0,i_ms));
			o_data.millisecond=parseInt(tros_time[2].substr(i_ms+1,(i_z-i_ms)));
		}
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true, "DataMostraSegon": true};
	}
	return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true};
}


function parseDurationISO8601(duration)
{
    const m = /^P(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(duration);

    if (!m)
        return null;

    return {
        years:   m[1] ? parseInt(m[1]) : 0,
        months:  m[2] ? parseInt(m[2]) : 0,
        weeks:   m[3] ? parseInt(m[3]) : 0,
        days:    m[4] ? parseInt(m[4]) : 0,
        hours:   m[5] ? parseInt(m[5]) : 0,
        minutes: m[6] ? parseInt(m[6]) : 0,
        seconds: m[7] ? parseFloat(m[7]) : 0
    };
}

function DonaValorAproxDuracioEnSegons(d)
{
    const SEGONS_PER_MINUT = 60;
    const SEGONS_PER_HORA  = 60 * SEGONS_PER_MINUT;
    const SEGONS_PER_DIA   = 24 * SEGONS_PER_HORA;

    // Durades mitjanes del calendari gregorià
    const SEGONS_PER_ANY   = 365.2425 * SEGONS_PER_DIA;
    const SEGONS_PER_MES   = SEGONS_PER_ANY / 12;

    let v = 0;

    if (d.years)
        v += d.years * SEGONS_PER_ANY;

    if (d.months)
        v += d.months * SEGONS_PER_MES;
	
	if (d.weeks)
        v += d.weeks * 7 * SEGONS_PER_DIA;

    if (d.days)
        v += d.days * SEGONS_PER_DIA;

    if (d.hours)
        v += d.hours * SEGONS_PER_HORA;

    if (d.minutes)
        v += d.minutes * SEGONS_PER_MINUT;

    if (d.seconds)
        v += d.seconds;

    return v;
}

function comparaDatesJSON(data1, data2)
{
	const d1=DonaDateDesDeDataJSON(data1).getTime();
	const d2=DonaDateDesDeDataJSON(data2).getTime();

    return d1 - d2;
}

function EsAnyDeTraspas(year)
{
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function diesDelMes(year, month)
{
    switch (month)
    {
		case 2:
			return EsAnyDeTraspas(year) ? 29 : 28;
		case 4:
		case 6:
		case 9:
		case 11:
			return 30;
		default:
			return 31;
    }
}

function AfegeixDuracioADataJSON(data, duration, flagsdata)
{
	/* Només se suporta duracions positives i les dates han de tenir aquesta forma:
				YYYY
				YYYY-MM													
				YYYY-MM-DD
				YYYY-MM-DD hh
				YYYY-MM-DD hh:mm
				YYYY-MM-DD hh:mm:ss*/													
	
    var year = DonaYearJSON(data),
        month = DonaMonthJSON(data),
        day = DonaDayJSON(data),
        hours = DonaHourJSON(data),
        minutes = DonaMinuteJSON(data),
        seconds = DonaSecondJSON(data);
		
	// Afegim anys
	if(duration.years)
		year += duration.years;
	
	if(!flagsdata.DataMostraMes)
		return {"year": year};
	
	// Necessito saber si estic el dia de la data és l'ultim dia del mes o no perquè si és així i vull incrementar les dates en 1 mes he d'incrementar de la següent manera: 31-1, 28-2, 31-3, 			
	var dini_darrer_dia=(day==diesDelMes(year,month));
	
	// Afegim mesos
	if(duration.months)
	{
		month += duration.months;
		while (month > 12)
		{
			month -= 12;
			year++;
		}
	}
	// Si hem canviat anys o mesos, mantenim la regla de final de mes
	if(duration.years || duration.months)
	{
		var nou_darrer_dia = diesDelMes(year, month);
		if (dini_darrer_dia)
			day = nou_darrer_dia;
		else if (day > nou_darrer_dia)
			day = nou_darrer_dia;
	}
	if(!flagsdata.DataMostraDia)
		return {"year": year, "month": month};
   
    // Calculem els dies a afegir( dies + setmanes)
	var dies_a_afegir = duration.days + duration.weeks * 7;
		
	if(flagsdata.DataMostraSegon)
	{
		// Afegim segons i propaguem a minuts
		seconds += duration.seconds;
		minutes += Math.floor(seconds / 60);
		seconds = seconds % 60;
	}
	if(flagsdata.DataMostraMinut)
	{
		// Afegim minuts i propaguem a hores
		minutes += duration.minutes;
		hours += Math.floor(minutes / 60);
		minutes = minutes % 60;
	}
	if(flagsdata.DataMostraHora)
	{
		// Afegim hores i propaguem a dies
		hours += duration.hours;
		dies_a_afegir += Math.floor(hours / 24);  // Afegim dies si hem afegit més de 24 hores, els afegim als dies que ja teniem de dies i setmanes
		hours = hours % 24;
	}
	
	// Afegim dies
	day += dies_a_afegir;

	while (day > diesDelMes(year, month))
	{
		day -= diesDelMes(year, month);
		month++;
		if (month > 12)
		{
			month = 1;
			year++;
		}
	}
	if(!flagsdata.DataMostraHora)
		return {"year": year, "month": month, "day": day};
	if(!flagsdata.DataMostraMinut)
		return {"year": year, "month": month, "day": day, "hour": hours};
	if(!flagsdata.DataMostraSegon)
		return {"year": year, "month": month, "day": day, "hour": hours, "minute": minutes};
    return {"year": year, "month": month, "day": day, "hour": hours, "minute": minutes, "second": seconds};
}

function DonaFlagsDataAPartirDeDuration(duration)
{
	if (duration.seconds)        
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true, "DataMostraSegon": true};
	if (duration.minutes)        
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true, "DataMostraSegon": false};
	if (duration.hours)        
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": false, "DataMostraSegon": false};
	if (duration.days || duration.weeks)
        return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": false, "DataMostraMinut": false, "DataMostraSegon": false};
	if (duration.months)
        return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": false, "DataMostraHora": false, "DataMostraMinut": false, "DataMostraSegon": false};
	if (duration.years)
        return {"DataMostraAny": true, "DataMostraMes": false, "DataMostraDia": false, "DataMostraHora": false, "DataMostraMinut": false, "DataMostraSegon": false};
   return {}; 
}

function DonaIndexPeriodeArray(periodes, i_periode)
{
	if(!periodes || !periodes.length)
		return -1;
	if(typeof i_periode==="undefined" || i_periode==null)
		i_periode=0;
	if(i_periode<0)
		i_periode=periodes.length+i_periode;
	if(i_periode<0)
		return 0;
	if(i_periode>=periodes.length)
		return periodes.length-1;
	return i_periode;
}

function DonaPeriodeDeArray(periodes, i_periode)
{
	var i=DonaIndexPeriodeArray(periodes, i_periode);
	if(i<0)
		return null;
	return periodes[i];
}

function DonaIPeriodeMesProperAActual(periodes, periode_actual)
{
	var i, i_proper=0, d_act, d_i, s_act, s_i, dif, dif_min=null;
	if(!periodes || !periodes.length)
		return -1;
	if(!periode_actual)
		return 0;
	for(i=0; i<periodes.length; i++)
	{
		if(periodes[i] && periode_actual && periodes[i].toUpperCase()==periode_actual.toUpperCase())
			return i;
	}
	d_act=parseDurationISO8601(periode_actual);
	if(!d_act)
		return 0;
	s_act=DonaValorAproxDuracioEnSegons(d_act);
	for(i=0; i<periodes.length; i++)
	{
		d_i=parseDurationISO8601(periodes[i]);
		if(!d_i)
			continue;
		s_i=DonaValorAproxDuracioEnSegons(d_i);
		dif=Math.abs(s_i-s_act);
		if(dif_min==null || dif<dif_min)
		{
			dif_min=dif;
			i_proper=i;
		}
	}
	return i_proper;
}

function DonaPeriodeActualDeCapa(capa)
{
	if(capa.dataPeriode && capa.dataPeriode.periodes && capa.dataPeriode.periodes.length)
		return DonaPeriodeDeArray(capa.dataPeriode.periodes, capa.dataPeriode.i_periode);
	return null;
}

function DonaFlagsDataAPartirDePeriodeActualDeCapa(capa)
{
	var periode=DonaPeriodeActualDeCapa(capa), duration;
	if(periode)
	{
		duration=parseDurationISO8601(periode);
		if(duration)
			return DonaFlagsDataAPartirDeDuration(duration);
	}
	return capa.FlagsData ? capa.FlagsData : {};
}

function DonaClauLlistaPeriodes(periodes)
{
	if(!periodes || !periodes.length)
		return "";
	return periodes.join(",").toUpperCase();
}

function DonaPeriodesTemporalsActiusDeCapa(capa)
{
	var tipus, i_zoneLevel, zoneLevel, periodes;
	if(!capa.dataPeriode || !capa.dataPeriode.periodes || capa.dataPeriode.periodes.length<1)
		return [];
	tipus=DonaTipusServidorCapa(capa);
	if((tipus=="TipusSTA" || tipus=="TipusSTAplus") &&
		capa.origenAccesObjs==origen_CellsFeaturesOfInterest &&
		capa.cellZoneLevelSet && capa.cellZoneLevelSet.zoneLevels)
	{
		i_zoneLevel=DonaCellsIndexZoneLevelMesProperAZoomActual(capa);
		if(i_zoneLevel!=-1)
		{
			zoneLevel=capa.cellZoneLevelSet.zoneLevels[i_zoneLevel];
			if(zoneLevel.aggregationPeriods && zoneLevel.aggregationPeriods.length)
			{
				periodes=[];
				for(var i=0; i<zoneLevel.aggregationPeriods.length; i++)
					periodes.push(DonaTextPeriodeISO(zoneLevel.aggregationPeriods[i]));
				periodes.sort(OrdenacioPeriodeDescendent);
				return periodes;
			}
		}
	}
	periodes=structuredClone(capa.dataPeriode.periodes);
	periodes.sort(OrdenacioPeriodeDescendent);
	return periodes;
}

// STA DGGS MultiDatastreams usen properties.dggs.interval com "1month", "1day", "1hour", "1min"
function DonaIntervalDGGSDesDePeriodeISO(periode)
{
	var d=parseDurationISO8601(periode);
	if(!d)
		return null;
	if(d.years)
		return d.years+"year";
	if(d.months)
		return d.months+"month";
	if(d.weeks)
		return d.weeks+"week";
	if(d.days)
		return d.days+"day";
	if(d.hours)
		return d.hours+"hour";
	if(d.minutes)
		return d.minutes+"min";
	if(d.seconds)
		return d.seconds+"sec";
	return null;
}

function DonaTextPeriodeISO(p)
{
	if(!p)
		return p;
	if(typeof p==="string")
		return p;
	return p.periode;
}

function NormalitzaArrayAggregationPeriods(periodes)
{
	var i;
	if(!periodes || !periodes.length)
		return periodes;
	for(i=0; i<periodes.length; i++)
	{
		if(periodes[i] && periodes[i].periode && !periodes[i].dggsInterval)
			periodes[i].dggsInterval=DonaIntervalDGGSDesDePeriodeISO(periodes[i].periode);
	}
	periodes.sort(OrdenacioPeriodeDescendent);
	return periodes;
}

function DonaIntervalDGGSDePeriodeICapa(capa, periode)
{
	var i_zone, ap, i, p_iso;
	if(!periode)
		return null;
	if(capa.cellZoneLevelSet && capa.cellZoneLevelSet.zoneLevels)
	{
		i_zone=DonaCellsIndexZoneLevelMesProperAZoomActual(capa);
		if(i_zone!=-1)
		{
			ap=capa.cellZoneLevelSet.zoneLevels[i_zone].aggregationPeriods;
			if(ap)
			{
				for(i=0; i<ap.length; i++)
				{
					p_iso=DonaTextPeriodeISO(ap[i]);
					if(p_iso && p_iso.toUpperCase()==periode.toUpperCase())
					{
						if(!ap[i].dggsInterval)
							ap[i].dggsInterval=DonaIntervalDGGSDesDePeriodeISO(p_iso);
						return ap[i].dggsInterval;
					}
				}
			}
		}
	}
	return DonaIntervalDGGSDesDePeriodeISO(periode);
}

function DonaIntervalDGGSDeCapa(capa)
{
	return DonaIntervalDGGSDePeriodeICapa(capa, DonaPeriodeActualDeCapa(capa));
}

function DonaPeriodesTemporalsDeZoneLevelCapa(capa, i_zone_level)
{
	var zoneLevel, periodes=[], i;
	if(i_zone_level==null || i_zone_level==-1 || !capa.cellZoneLevelSet || !capa.cellZoneLevelSet.zoneLevels ||
		!capa.cellZoneLevelSet.zoneLevels[i_zone_level] || !capa.cellZoneLevelSet.zoneLevels[i_zone_level].aggregationPeriods)
		return DonaPeriodesTemporalsActiusDeCapa(capa);
	zoneLevel=capa.cellZoneLevelSet.zoneLevels[i_zone_level];
	for(i=0; i<zoneLevel.aggregationPeriods.length; i++)
		periodes.push(DonaTextPeriodeISO(zoneLevel.aggregationPeriods[i]));
	periodes.sort(OrdenacioPeriodeDescendent);
	return periodes;
}

function DonaPeriodeISODesDeIntervalDGGS(capa, i_zone_level, interval_dggs)
{
	var periodes=DonaPeriodesTemporalsDeZoneLevelCapa(capa, i_zone_level), i, iv;
	if(!interval_dggs || !periodes.length)
		return null;
	for(i=0; i<periodes.length; i++)
	{
		iv=DonaIntervalDGGSDePeriodeICapa(capa, periodes[i]);
		if(iv && iv==interval_dggs)
			return periodes[i];
	}
	return null;
}

function DonaPeriodeISOPerFinestraTemporal(periodes, millis_visible)
{
	var i, d, ms_per, n, millor=null;
	if(!periodes || !periodes.length || !millis_visible || millis_visible<=0)
		return null;
	for(i=0; i<periodes.length; i++)
	{
		d=parseDurationISO8601(periodes[i]);
		if(!d)
			continue;
		ms_per=DonaValorAproxDuracioEnSegons(d)*1000;
		if(!ms_per)
			continue;
		n=millis_visible/ms_per;
		if(n>=4 && n<=250)
			millor=periodes[i];
	}
	if(millor)
		return millor;
	return periodes[periodes.length-1];
}

function DonaFinestraISOConsultaTemporalCapa(capa)
{
	var ini=null, fi=null, fi_json, duration;
	if(capa.dataPeriode && capa.dataPeriode.dataIni)
		ini=DonaDataJSONComATextISO8601(capa.dataPeriode.dataIni, null, true);
	else if(capa.dataMinima)
		ini=DonaDataJSONComATextISO8601(capa.dataMinima, null, true);
	else if(capa.data && capa.data.length)
		ini=DonaDataJSONComATextISO8601(capa.data[0], null, true);
	if(capa.dataPeriode && capa.dataPeriode.dataFi)
	{
		duration=parseDurationISO8601("P1D");
		fi_json=duration ? AfegeixDuracioADataJSON(capa.dataPeriode.dataFi, duration, {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true}) : capa.dataPeriode.dataFi;
		fi=DonaDataJSONComATextISO8601(fi_json, null, true);
	}
	else if(capa.dataMaxima)
		fi=DonaDataJSONComATextISO8601(capa.dataMaxima, null, true);
	else if(capa.data && capa.data.length)
	{
		fi_json=IncrementaDataSegonsPeriodeOFlagsData(capa, capa.data.length-1);
		fi=DonaDataJSONComATextISO8601(fi_json ? fi_json : capa.data[capa.data.length-1], null, true);
	}
	return {"ini": ini, "fi": fi};
}

function SincronitzaIPeriodeCapaAmbPeriode(capa, periode)
{
	var i;
	if(!capa.dataPeriode || !capa.dataPeriode.periodes || !periode)
		return;
	i=DonaIPeriodeMesProperAActual(capa.dataPeriode.periodes, periode);
	if(i>=0)
		capa.dataPeriode.i_periode=i;
}

function EsFlagsDataCoherentAmbPeriode(flags, periode)
{
	var duration, esperat;
	if(!flags || !periode)
		return false;
	duration=parseDurationISO8601(periode);
	if(!duration)
		return false;
	esperat=DonaFlagsDataAPartirDeDuration(duration);
	// El !! converteix el valor a booleà: el que “hi és” passa a true i el que no (undefined, null, false, 0…) a false. Després es comparen aquests dos booleans.
	return !!flags.DataMostraAny==!!esperat.DataMostraAny &&
		!!flags.DataMostraMes==!!esperat.DataMostraMes &&
		!!flags.DataMostraDia==!!esperat.DataMostraDia &&
		!!flags.DataMostraHora==!!esperat.DataMostraHora &&
		!!flags.DataMostraMinut==!!esperat.DataMostraMinut &&
		!!flags.DataMostraSegon==!!esperat.DataMostraSegon;
}

function NormalitzaDataJSONSegonsFlags(data, flags)
{
	var d={};
	if(!data)
		return d;
	d.year=DonaYearJSON(data);
	if(flags && flags.DataMostraMes)
		d.month=DonaMonthJSON(data);
	if(flags && flags.DataMostraDia)
		d.day=DonaDayJSON(data);
	if(flags && flags.DataMostraHora)
		d.hour=DonaHourJSON(data);
	if(flags && flags.DataMostraMinut)
		d.minute=DonaMinuteJSON(data);
	if(flags && flags.DataMostraSegon)
		d.second=DonaSecondJSON(data);
	return d;
}

function EsDataJSONCoherentAmbFlags(data, flags)
{
	if(!data || !flags)
		return false;
	if(!!flags.DataMostraMes != (typeof data.month!=="undefined" && data.month!=null))
		return false;
	if(!!flags.DataMostraDia != (typeof data.day!=="undefined" && data.day!=null))
		return false;
	if(!!flags.DataMostraHora != (typeof data.hour!=="undefined" && data.hour!=null))
		return false;
	if(!!flags.DataMostraMinut != (typeof data.minute!=="undefined" && data.minute!=null))
		return false;
	if(!!flags.DataMostraSegon != (typeof data.second!=="undefined" && data.second!=null))
		return false;
	return true;
}

function EsArrayDatesCoherentAmbFlags(dates, flags)
{
	var i;
	if(!dates || !dates.length || !flags)
		return false;
	for(i=0; i<dates.length; i++)
	{
		if(!EsDataJSONCoherentAmbFlags(dates[i], flags))
			return false;
	}
	return true;
}

function OmpleFlagsDataSelectorPeriodesDeCapa(capa, afegirACapa)
{
	var selec=null, periodes, periode_actual, i_act;
	if(!capa.dataPeriode || !capa.dataPeriode.periodes || capa.dataPeriode.periodes.length<1)
		return selec;
	periodes=DonaPeriodesTemporalsActiusDeCapa(capa);
	periode_actual=DonaPeriodeActualDeCapa(capa);
	i_act=DonaIPeriodeMesProperAActual(periodes, periode_actual);
	if(i_act<0)
		i_act=0;
	selec={"periodes": periodes, "i_periode_actual": i_act};
	if(afegirACapa)
	{
		if(!capa.FlagsData)
			capa.FlagsData={};
		capa.FlagsData.DataSelectorPeriodes=selec;
		capa.FlagsData.DataMostraBotonsResolucio=true;
		capa.FlagsData.DataMostraPeriodes=true;
	}
	return selec;
}

function AjustaPeriodeTemporalCapaAlZoomSiCal(capa)
{
	var periodes, periode_actual, i_act, periode_nou, data_sel, cal_recrear, clau_rang, clau_prev;
	if(!capa.dataPeriode || !capa.dataPeriode.periodes || capa.dataPeriode.periodes.length<1)
		return false;
	periodes=DonaPeriodesTemporalsActiusDeCapa(capa);
	if(!periodes.length)
		return false;
	periode_actual=DonaPeriodeActualDeCapa(capa);
	i_act=DonaIPeriodeMesProperAActual(periodes, periode_actual);
	if(i_act<0)
		return false;
	periode_nou=periodes[i_act];
	clau_rang=DonaClauLlistaPeriodes(periodes);
	clau_prev=(capa.FlagsData && capa.FlagsData.DataSelectorPeriodes && capa.FlagsData.DataSelectorPeriodes.periodes) ?
		DonaClauLlistaPeriodes(capa.FlagsData.DataSelectorPeriodes.periodes) : "";
	cal_recrear=!periode_actual || periode_nou.toUpperCase()!=periode_actual.toUpperCase() ||
		!EsFlagsDataCoherentAmbPeriode(capa.FlagsData, periode_nou) ||
		!EsArrayDatesCoherentAmbFlags(capa.data, DonaFlagsDataAPartirDeDuration(parseDurationISO8601(periode_nou))) ||
		clau_rang!==clau_prev;
	if(cal_recrear)
	{
		data_sel=(capa.data && capa.data.length) ? structuredClone(capa.data[DonaIndexDataCapa(capa, null)]) : null;
		SincronitzaIPeriodeCapaAmbPeriode(capa, periode_nou);
		CreaDatesDeDataPeriodeCapa(capa, true);
		if(data_sel)
			capa.i_data=DonaIndexDataQueConte(capa, data_sel);
	}
	OmpleFlagsDataSelectorPeriodesDeCapa(capa, true);
	return cal_recrear;
}

function DonaIndexDataQueConte(capa, data_ref)
{
	var i, millor=0;
	if(!capa.data || !capa.data.length || !data_ref)
		return 0;
	for(i=0; i<capa.data.length; i++)
	{
		if(comparaDatesJSON(capa.data[i], data_ref)<=0)
			millor=i;
		else
			break;
	}
	return millor;
}

function CreaDatesDeDataPeriodeCapa(capa, afegirACapa, dataIni, dataFi, exclusiuFi)
{
	if(!capa.dataPeriode || !capa.dataPeriode.periodes || capa.dataPeriode.periodes.length<1)
		return null;
	var dataPeriode=capa.dataPeriode;
	var periode=DonaPeriodeDeArray(dataPeriode.periodes, dataPeriode.i_periode);
	var duration= parseDurationISO8601(periode);
	if(!duration)
		return null;
	if(!dataPeriode.dataIni && !dataIni)
		return null;
	if(!dataPeriode.dataFi){
		dataPeriode.dataFi=structuredClone(DonaDataJSONDesDeDate(new Date()));
	}
	var flagdata=DonaFlagsDataAPartirDeDuration(duration);
	var data=[], data_uniq=[], actual, seguent, dataFiLocal, i;
	var flagsPrev=capa.FlagsData;

	actual=NormalitzaDataJSONSegonsFlags(dataIni ? dataIni : dataPeriode.dataIni, flagdata);
	dataFiLocal=NormalitzaDataJSONSegonsFlags(dataFi ? dataFi : dataPeriode.dataFi, flagdata);

	while (exclusiuFi ? (comparaDatesJSON(actual, dataFiLocal) < 0) : (comparaDatesJSON(actual, dataFiLocal) <= 0))
	{
		data.push(actual);
		seguent=NormalitzaDataJSONSegonsFlags(AfegeixDuracioADataJSON(actual, duration, flagdata), flagdata);
		if(comparaDatesJSON(seguent, actual)<=0)
			break;
		actual=seguent;
	}
	for(i=0; i<data.length; i++)
	{
		if(!data_uniq.length || comparaDatesJSON(data_uniq[data_uniq.length-1], data[i])!==0)
			data_uniq.push(data[i]);
	}
	data=data_uniq;
	if(afegirACapa && data.length>0)
	{
		capa.AnimableMultiTime=true;
		capa.FlagsData=structuredClone(flagdata);
		if(flagsPrev)
		{
			if(flagsPrev.DataMostraBotonsResolucio)
				capa.FlagsData.DataMostraBotonsResolucio=true;
			if(flagsPrev.DataMostraPeriodes)
				capa.FlagsData.DataMostraPeriodes=true;
		}
		if(dataPeriode.periodes.length>1)
		{
			capa.FlagsData.DataMostraBotonsResolucio=true;
			capa.FlagsData.DataMostraPeriodes=true;
		}
		capa.data=structuredClone(data);
	}
	return data;
}

function IncrementaDataSegonsPeriodeOFlagsData(capa, i_data)
{
var dataPeriode=capa.dataPeriode, periode=null, duration=null, data_sel;
	if(dataPeriode && dataPeriode.periodes && dataPeriode.periodes.length)
		periode=DonaPeriodeDeArray(dataPeriode.periodes, dataPeriode.i_periode);
	else if(capa.FlagsData){
		if(capa.FlagsData.DataMostraSegon)
			periode="PT1S";
		else if(capa.FlagsData.DataMostraMinut)
			periode="PT1M";
		else if(capa.FlagsData.DataMostraHora)
			periode="PT1H";
		else if(capa.FlagsData.DataMostraDia)
			periode="P1D";
		else if(capa.FlagsData.DataMostraMes)
			periode="P1M";
		else if(capa.FlagsData.DataMostraAny)
			periode="P1Y";
	}
	if(!capa.data || !capa.data.length)
		return null;
	data_sel=capa.data[DonaIndexDataCapa(capa, i_data)];
	if(!data_sel)
		return null;
	if(!periode)
		return structuredClone(data_sel);
	duration= parseDurationISO8601(periode);
	if(!duration)
		return structuredClone(data_sel);
	var flagsdata=capa.FlagsData ? capa.FlagsData: DonaFlagsDataAPartirDeDuration(duration);
	return AfegeixDuracioADataJSON(data_sel, duration, flagsdata);
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

			    //Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s'omple com 00:00:00.
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
}

function DonaDataJSONComATextISO8601(data, que_mostrar, datetime_complet)
{
var cdns=[], y, m, d, h, min, s, pad;

	if (!data)
		return "";

	pad=function(n) { return (n<10 ? "0" : "") + n; };
	y=DonaYearJSON(data);
	m=((que_mostrar && que_mostrar.DataMostraMes) || !que_mostrar) ? DonaMonthJSON(data) : 1;
	d=((que_mostrar && que_mostrar.DataMostraDia) || !que_mostrar) ? DonaDayJSON(data) : 1;
	h=((que_mostrar && que_mostrar.DataMostraHora) || !que_mostrar) ? DonaHourJSON(data) : 0;
	min=((que_mostrar && que_mostrar.DataMostraMinut) || !que_mostrar) ? DonaMinuteJSON(data) : 0;
	s=((que_mostrar && que_mostrar.DataMostraSegon) || !que_mostrar) ? DonaSecondJSON(data) : 0;

	if (que_mostrar)
	{
		// Segons la ISO com a mínim he de mostrar l'any però nosaltres permetem altres coses deliveradament
		cdns.push(y);
		if(que_mostrar.DataMostraMes)
		{
			cdns.push("-", pad(m));
			if (que_mostrar.DataMostraDia)
			{
				cdns.push("-", pad(d));
				// Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s'omple com 00:00:00.
				if(que_mostrar.DataMostraHora)
				{
					cdns.push("T", pad(h));
					if(que_mostrar.DataMostraMinut)
					{
						cdns.push(":", pad(min));
						if(que_mostrar.DataMostraSegon)
							cdns.push(":", pad(s));
					}
					cdns.push("Z");
				}
			}
		}
		return cdns.join("");
	}
	if(datetime_complet)
		return y+"-"+pad(m)+"-"+pad(d)+"T"+pad(h)+":"+pad(min)+":"+pad(s)+"Z";

	cdns.push(y, "-", pad(m), "-", pad(d));
	if (DonaHourJSON(data)!=0 || DonaMinuteJSON(data)!=0 || DonaSecondJSON(data)!=0)
		cdns.push("T", pad(h), ":", pad(min), ":", pad(s), "Z");
	return cdns.join("");
}

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

function DonaCadenaFormatEixTemporalGrafic(que_mostrar)
{
	if(que_mostrar && que_mostrar.DataMostraMes && !que_mostrar.DataMostraDia)
		return "MMMM YYYY";
	if(que_mostrar && que_mostrar.DataMostraAny && !que_mostrar.DataMostraMes)
		return "YYYY";
	var f=DonaCadenaFormatDataHora(que_mostrar);
	return f ? f : "DD-MM-YYYY";
}

function DonaDisplayFormatsChartJSDataHora(que_mostrar)
{
	var f=DonaCadenaFormatEixTemporalGrafic(que_mostrar), df;
	df={
		millisecond: f,
		second: f,
		minute: f,
		hour: f,
		day: f,
		week: f,
		month: f,
		quarter: f,
		year: f
	};
	if(que_mostrar && que_mostrar.DataMostraMes && !que_mostrar.DataMostraDia)
	{
		df.month="MMMM YYYY";
		df.quarter="MMMM YYYY";
		df.year="YYYY";
		if(!que_mostrar.DataMostraHora)
			df.day="MMMM YYYY";
	}
	else if(que_mostrar && que_mostrar.DataMostraAny && !que_mostrar.DataMostraMes)
	{
		df.year="YYYY";
		df.quarter="YYYY";
		df.month="YYYY";
		df.day="YYYY";
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
function CanviaVariablesDeCadena(s, capa, i_data, dims)
{
var i, ii, k, p, kvp, query, valor, i_v, num_of_vs, v, estil, param;

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
		if(capa.estil)
		{
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
				//Determinio si hi ha un sol v[i] a la fórmula i en aquest cas, no hi ha problema en continuar.
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
		}
		param=dims?dims:((valor && valor.param) ? valor.param : null);
		if(param)
		{
			for (var i_param=0; i_param<param.length; i_param++)
			{
				if (query.name==param[i_param].clau.nom)
				{
					s=s.substring(0,i) + param[i_param].valor.nom + s.substring(i+5+ii+1);
					break;
				}
			}
			if (i_param==param.length)
			{
				alert("Cannot find '" + query.name + "' extracted from the KVP '{DIM?' expression in the selected style");
				break;
			}
		}
	}	
	if (capa.tipus=="TipusHTTP_GET")
	{
		if(dims)
		{
			for (i=0; i<dims.length; i++)
			{
				var d=dims[i];
				s=s.replaceAll("{"+d.clau.nom+"}", d.valor.nom);
			}
		}
		else if (capa.dimensioExtra && capa.dimensioExtra.length)
		{
			for (i=0; i<capa.dimensioExtra.length; i++)
			{
				var d=capa.dimensioExtra[i];
				s=s.replaceAll("{"+d.clau.nom+"}", d.valor[d.i_valor].nom);
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

//Aquesta funció insereix una data a l'array de dates de la capa
function InsereixDataISOaCapa(data_iso, data_capa)
{
var d=new Date(data_iso);
var milliseg_a=d.getTime();
	var i=data_capa.binarySearch(milliseg_a, sortAscendingISOiData);
	if (i<0)  //Not present in the array
	{
		data_capa.splice(-i-1, 0, DonaDataJSONDesDeDate(d));
		i=-i-1;
	}
	return i;
}

// Aquesta funció busca una data en format ISO dins d'un array de dates
function DonaIndexDataADataCapa(data_json, data_capa)
{
var d=DonaDateDesDeDataJSON(data_json);
var milliseg_a=d.getTime();

	var i=data_capa.binarySearch(milliseg_a, sortAscendingISOiData);
	if (i<0)  //Not present in the array
		return -1;
	return i;
}
