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

var PrepMesDeLAny=[{"cat": "de gener", "spa": "de enero", "eng": "January", "fre": "Janvier"}, 
				   {"cat": "de febrer", "spa": "de febrero", "eng": "February", "fre": "Février"}, 
				   {"cat": "de març", "spa": "de marzo", "eng": "March", "fre": "Mars"}, 
				   {"cat": "d\'abril", "spa": "de abril", "eng": "April", "fre": "Avril"}, 
				   {"cat": "de maig", "spa": "de mayo", "eng": "May", "fre": "Mai"}, 
				   {"cat": "de juny", "spa": "de junio", "eng": "June", "fre": "Juin"},
				   {"cat": "de juliol", "spa": "de julio", "eng": "July", "fre": "Juillet"}, 
				   {"cat": "d\'agost", "spa": "de agosto", "eng": "August", "fre": "Août"}, 
				   {"cat": "de setembre", "spa": "de setiembre", "eng": "September", "fre": "Septembre"},
				   {"cat": "d\'octubre", "spa": "de octubre", "eng": "October", "fre": "Octobre"},
				   {"cat": "de novembre", "spa": "de noviembre", "eng": "November", "fre": "Novembre"}, 
				   {"cat": "de desembre", "spa": "de diciembre", "eng": "December", "fre": "Décembre"}];

var MesDeLAny=[{"cat": "Gener", "spa": "Enero", "eng": "January", "fre": "Janvier"},
			   {"cat": "Febrer", "spa": "Febrero", "eng": "February", "fre": "Février"}, 
			   {"cat": "Març", "spa": "Marzo", "eng": "March", "fre": "Mars"}, 
			   {"cat": "Abril", "spa": "Abril", "eng": "April","fre": "Avril"}, 
			   {"cat": "Maig", "spa": "Mayo", "eng": "May","fre": "Mai"}, 
			   {"cat": "Juny", "spa": "Junio", "eng": "June","fre": "Juin"}, 
			   {"cat": "Juliol", "spa": "Julio", "eng": "July","fre": "Juillet"}, 
			   {"cat": "Agost", "spa": "Agosto", "eng": "August","fre": "Août"}, 
			   {"cat": "Setembre", "spa": "Setiembre", "eng": "September","fre": "Septembre"},
			   {"cat": "Octubre", "spa": "Octubre", "eng": "October","fre": "Octobre"},
			   {"cat": "Novembre", "spa": "Noviembre", "eng": "November","fre": "Novembre"},
			   {"cat": "Desembre", "spa": "Diciembre", "eng": "December","fre": "Décembre"}];

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

function DonaYearJSON(data)
{
	if (data.year)
		return data.year;
	return 1970;
}

function DonaMonthJSON(data)
{
	if (data.month)
		return data.month;
	return 1;
}

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
		    cdns.push(DonaCadena(PrepMesDeLAny[DonaMonthJSON(data_a_usar)-1]));
		else
		    cdns.push(DonaCadena(MesDeLAny[DonaMonthJSON(data_a_usar)-1]));
	}
	if (capa.FlagsData.DataMostraAny)
	{
		if (capa.FlagsData.DataMostraMes)
		    cdns.push((DonaCadenaLang({"cat":" de ","spa":" de ", "eng":" ","fre":" "})));
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
	o_data.year=parseInt(tros_data[0],10);					

	if(tros_data.length==1) //Només hi ha any i res més
		return {"DataMostraAny": true};
	
	o_data.month=parseInt(tros_data[1],10);
	
	if(tros_data.length==2) //Any i mes	
		return {"DataMostraAny": true, "DataMostraMes": true};

	//Any, mes i dia i potser time
	var i_time=tros_data[2].search("[T]");
	if(i_time==-1)
	{
		o_data.day=parseInt(tros_data[2],10);		
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true};
	}
	o_data.day=parseInt(tros_data[2].substr(0, i_time),10);					
		
	var tros_time=(tros_data[2].substr(i_time+1)).split(":");				
	if(tros_time.length==1) //només hi ha hora
	{
		var i_z=tros_time[0].search("[Z]");
		if(i_z==-1)
			o_data.hour=parseInt(tros_time[0],10);
		else
			o_data.hour=parseInt(tros_time[0].substr(0,i_z),10);
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true};
	}
	o_data.hour=parseInt(tros_time[0],10);
	if(tros_time.length==2) //hh:mm[Z]
	{
		var i_z=tros_time[1].search("[Z]");
		if(i_z==-1)
			o_data.minute=parseInt(tros_time[1],10);
		else
			o_data.minute=parseInt(tros_time[1].substr(0,i_z),10);
		return {"DataMostraAny": true, "DataMostraMes": true, "DataMostraDia": true, "DataMostraHora": true, "DataMostraMinut": true};	
	}
	o_data.minute=parseInt(tros_time[1],10);
	if(tros_time.length==3) //hh:mm:ss[Z]  // ·$· NJ-> ? Això no és correcte, hi ha altres formats ISO que tenen una longitud de més de 3 i aquesta funció no reconeix. per exemple "2020-09-25T12:59:06.035+02:00"
	// Jo ho he resolt fent new Date("2020-09-25T12:59:06.035+02:00"); potser no caldria fer cap parser, no? ja que un cop tens un date és més fàcil passar-ho a JSON i ja tenim funcions per això.
	{
		var i_ms=tros_time[2].search("[.]");
		var i_z=tros_time[2].search("[Z]");		
		if(i_z==-1 && i_ms==-1)
			o_data.second=parseInt(tros_time[2],10);
		else if(i_z!=-1 && i_ms==-1)
			o_data.second=parseInt(tros_time[2].substr(0,i_z),10);				
		else
		{
			o_data.second=parseInt(tros_time[2].substr(0,i_ms),10);
			o_data.millisecond=parseInt(tros_time[2].substr(i_ms+1,(i_z-i_ms)),10);
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
