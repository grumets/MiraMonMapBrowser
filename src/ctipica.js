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

//////////////////////////////////////////////////////////////////////////
/* funcions per a gestió de llistes */
var LlistaCadenes=[];
var LlistaSenzilla=[];
var ILlistaDeICellaLlista=[];
var NCellaLlista=[];
var ICellaLlistaBlau=[];
var NomEditLlavorLlista=[];
var NomLayerLlista=[];
var CTipicaCapa=[];

//var WindowDelEvent=parent.ctipica;

function SeleccionaEditLlavor(llavor)
{
var i_llista;
	for (i_llista=0; i_llista<NomEditLlavorLlista.length; i_llista++)
	{
		if (llavor.name==NomEditLlavorLlista[i_llista])
		    break;
	}
	if (i_llista==NomEditLlavorLlista.length)
		return;
	if (NCellaLlista[i_llista]<=1)
		llavor.select();
}

function TeclaLLavor(e)
{
//Segons codi a: http://www.ryancooper.com/resources/keycode.asp
var keycode=0;
var a, i;
var llavor;
var i_llista;

	if (window.document.getElementById)
	{
	    if (window.event)
	    {
			keycode = window.event.keyCode;
			llavor = window.event.srcElement;
        }
	    else if (e) 
	    {
			keycode = e.which;
			llavor=e.target;
	    }
	    if (llavor.nodeType == 3) // defeat Safari bug
			llavor = llavor.parentNode;
	    for (i_llista=0; i_llista<NomEditLlavorLlista.length; i_llista++)
	    {
			if (llavor.name==NomEditLlavorLlista[i_llista])
			    break;
	    }
	    if (i_llista==NomEditLlavorLlista.length)
			return;
	    if (ActualitzaLlistaMinimitzaVisu==false || NCellaLlista[i_llista]>1)
	    {
			if (keycode==37 ||  //fletxa esquerra
			    keycode==39 ||  //fletxa dreta
			    keycode==16)    //Mayuscules
				;
			else if (keycode==40)  //fletxa avall
			{
				if (ICellaLlistaBlau[i_llista]!=-1)
				{
					if (ICellaLlistaBlau[i_llista]>=NCellaLlista[i_llista]-1)
						i=0;
					else
						i=ICellaLlistaBlau[i_llista]+1;
				}
				else
					i=0;
				a=window.document.getElementById("CellaLlista_"+i_llista+"_"+i);
				EscriuLlavor(llavor, i_llista, a, i);
				vScrollLayer(getLayer(window, NomLayerLlista[i_llista]), i, NCellaLlista[i_llista]);
			}
			else if (keycode==38)  //fletxa amunt
			{
				if (ICellaLlistaBlau[i_llista]!=-1)
				{
					if (ICellaLlistaBlau[i_llista]==0)
						i=NCellaLlista[i_llista]-1;
					else
						i=ICellaLlistaBlau[i_llista]-1;
				}
				else
					i=NCellaLlista[i_llista]-1;
				a=window.document.getElementById("CellaLlista_"+i_llista+"_"+i);
				EscriuLlavor(llavor, i_llista, a, i);
				vScrollLayer(getLayer(window, NomLayerLlista[i_llista]), i, NCellaLlista[i_llista]);
			}
			else 
			{
				if (ICellaLlistaBlau[i_llista]!=-1)
				{
					//a_previ=window.document.getElementById("CellaLlista_"+i_llista+"_"+ICellaLlistaBlau[i_llista]);
					ICellaLlistaBlau[i_llista]=-1;
					//CellaATransparent(a_previ);
				}
				ActualitzaLlista(llavor, i_llista, keycode);
			}
	    }
	    else
	    {
			if (llavor.value.trim()=="" && keycode==40)
				ActualitzaLlista(llavor, i_llista, keycode);
			else if (keycode==37 ||  //fletxa esquerra
			    	keycode==39 ||  //fletxa dreta
				    keycode==40 ||  //fletxa avall
		    		keycode==38 ||  //fletxa amunt
				    keycode==16) 
					;
			else
				ActualitzaLlista(llavor, i_llista, keycode);
	    }
	}
	else
		ICellaLlistaBlau[i_llista]=-1;
}

function EscriuLlavorIActualitza(nom, i_llista, i)
{
	var llavor=window.document.getElementsByName(nom)[0];
	llavor.value=LlistaCadenes[i_llista][ILlistaDeICellaLlista[i_llista][i]];
	llavor.focus();
	ActualitzaLlista(llavor, i_llista, 0);
}

function EscriuLlavor(llavor, i_llista, a, i)
{
	CellaABlau(a, i_llista, i)
	llavor.value=LlistaCadenes[i_llista][ILlistaDeICellaLlista[i_llista][i]];
	llavor.focus();
}

function CellaATransparent(a)
{
	a.className='CellaTransparent';
}

function CellaABlau(a, i_llista, i)
{
	if (ICellaLlistaBlau[i_llista]!=-1)
	{
		var a_previ;
		a_previ=window.document.getElementById("CellaLlista_"+i_llista+"_"+ICellaLlistaBlau[i_llista]);
		CellaATransparent(a_previ);
	}
	a.className='CellaBlava';
	ICellaLlistaBlau[i_llista]=i;
}

function ActualitzaLlistaTimeOut(i_llista, keycode)
{
var llavor;
var llav="";
var k, i;
var cdns=[];
var elem;

	//llavor=eval("window.document.ctipica"+i_llista+"."+NomEditLlavorLlista[i_llista]);
	llavor=window.document["ctipica"+i_llista][NomEditLlavorLlista[i_llista]];

	llav=llavor.value.trim();
	ICellaLlistaBlau[i_llista]=-1;
	elem=getLayer(window, NomLayerLlista[i_llista]);
	if (llav=="")
	{
		if (ActualitzaLlistaMinimitzaVisu && keycode!=40)  //fletxa avall
		{
			cdns.push("<table class=\"TaulaAmbVora\" cellspacing=\"0\" cellpadding=\"0\"></table>");
			NCellaLlista[i_llista]=0;
			hideLayer(elem);
		}
		else
		{
			cdns.push("<table class=\"TaulaAmbVora\" CELLSPACING=0 CELLPADDING=0>");
			for (i=0,NCellaLlista[i_llista]=0; i<LlistaCadenes[i_llista].length; i++,NCellaLlista[i_llista]++)
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],
					"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],
					");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\">",
					LlistaCadenes[i_llista][i],"</td></tr>");
			}
			cdns.push("</table>");
			showLayer(elem);
		}
	}
	else
	{
		cdns.push("<table class=\"TaulaAmbVora\" cellspacing=0 cellpadding=0>");
		NCellaLlista[i_llista]=0;
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase());
			if (k==0)
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],
					"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],
					");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\"><b>",
					(LlistaCadenes[i_llista][i].substring(0,llav.length)),"</b>",
					(LlistaCadenes[i_llista][i].substring(llav.length,LlistaCadenes[i_llista][i].length)),"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase());
			if (k>0 && (LlistaCadenes[i_llista][i].substring(k-1,k)==" " || LlistaCadenes[i_llista][i].substring(k-1,k)=="\'") &&
				(k+llav.length==LlistaCadenes[i_llista][i].length || LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)==" " || 
				LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)=="\'"))
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],
					"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],
					");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\">",
					(LlistaCadenes[i_llista][i].substring(0,k)),"<b>",
					(LlistaCadenes[i_llista][i].substring(k,k+llav.length)),"</b>",
					(LlistaCadenes[i_llista][i].substring(k+llav.length,LlistaCadenes[i_llista][i].length)),
					"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase());
			if (k>0 && (LlistaCadenes[i_llista][i].substring(k-1,k)==" " || LlistaCadenes[i_llista][i].substring(k-1,k)=="\'") &&
				k+llav.length!=LlistaCadenes[i_llista][i].length && LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)!=" " && 
				LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)!="\'")
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name+"\", ",i_llista,", ",NCellaLlista[i_llista],");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\">",(LlistaCadenes[i_llista][i].substring(0,k)),"<b>",
					(LlistaCadenes[i_llista][i].substring(k,k+llav.length)),"</b>",
					(LlistaCadenes[i_llista][i].substring(k+llav.length,LlistaCadenes[i_llista][i].length)),"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase());
			if (k>0 && LlistaCadenes[i_llista][i].substring(k-1,k)!=" " && LlistaCadenes[i_llista][i].substring(k-1,k)!="\'")
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\">",(LlistaCadenes[i_llista][i].substring(0,k)),"<b>",
					(LlistaCadenes[i_llista][i].substring(k,k+llav.length)),"</b>",
					(LlistaCadenes[i_llista][i].substring(k+llav.length,LlistaCadenes[i_llista][i].length)),"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}

		var llav_senzilla=DonaCadenaSenzilla(llav);
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaSenzilla[i_llista][i].indexOf(llav_senzilla);
			if (k==0 && 
				LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase())!=0)
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\"><b>",
					(LlistaCadenes[i_llista][i].substring(0,llav.length)),"</b>",
					(LlistaCadenes[i_llista][i].substring(llav.length,LlistaCadenes[i_llista][i].length)),"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaSenzilla[i_llista][i].indexOf(llav_senzilla);
			if (k>0 && LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase())<1 && 
				(LlistaCadenes[i_llista][i].substring(k-1,k)==" " || LlistaCadenes[i_llista][i].substring(k-1,k)=="\'") &&
				(k+llav.length==LlistaCadenes[i_llista][i].length || LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)==" " || 
				LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)=="\'") &&
				LlistaSenzilla[i_llista][i].substring(k,k+llav_senzilla.length)!=LlistaCadenes[i_llista][i].toLowerCase().substring(k,k+llav_senzilla.length))
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\">",(LlistaCadenes[i_llista][i].substring(0,k)),"<b>",
					(LlistaCadenes[i_llista][i].substring(k,k+llav.length)),"</b>",				
					(LlistaCadenes[i_llista][i].substring(k+llav.length,LlistaCadenes[i_llista][i].length)),"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaSenzilla[i_llista][i].indexOf(llav_senzilla);
			if (k>0 && LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase())<1 &&
				(LlistaCadenes[i_llista][i].substring(k-1,k)==" " || LlistaCadenes[i_llista][i].substring(k-1,k)=="\'") &&
				k+llav.length!=LlistaCadenes[i_llista][i].length && LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)!=" " && 
				LlistaCadenes[i_llista][i].substring(k+llav.length,k+llav.length+1)!="\'" &&
				LlistaSenzilla[i_llista][i].substring(k,k+llav_senzilla.length)!=LlistaCadenes[i_llista][i].toLowerCase().substring(k,k+llav_senzilla.length))
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\">",(LlistaCadenes[i_llista][i].substring(0,k)),"<b>",
					(LlistaCadenes[i_llista][i].substring(k,k+llav.length)),"</b>",
					(LlistaCadenes[i_llista][i].substring(k+llav.length,LlistaCadenes[i_llista][i].length)),"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}
		for (i=0; i<LlistaCadenes[i_llista].length; i++)
		{
			k=LlistaSenzilla[i_llista][i].indexOf(llav_senzilla);
			if (k>0 && LlistaCadenes[i_llista][i].toLowerCase().indexOf(llav.toLowerCase())<1 &&
				LlistaCadenes[i_llista][i].substring(k-1,k)!=" " && LlistaCadenes[i_llista][i].substring(k-1,k)!="\'" &&
				LlistaSenzilla[i_llista][i].substring(k,k+llav_senzilla.length)!=LlistaCadenes[i_llista][i].toLowerCase().substring(k,k+llav_senzilla.length))
			{
				ILlistaDeICellaLlista[i_llista][NCellaLlista[i_llista]]=i;
				cdns.push("<tr><td id=\"CellaLlista_",i_llista,"_",NCellaLlista[i_llista],"\" onClick=\'EscriuLlavorIActualitza(\"",
					llavor.name,"\", ",i_llista,", ",NCellaLlista[i_llista],");\' onMouseOver=\"CellaABlau(window,",i_llista,", ",
					NCellaLlista[i_llista],");\" onMouseOut=\"CellaATransparent(window)\">",(LlistaCadenes[i_llista][i].substring(0,k)),"<b>",
					(LlistaCadenes[i_llista][i].substring(k,k+llav.length)),"</b>",
					(LlistaCadenes[i_llista][i].substring(k+llav.length,LlistaCadenes[i_llista][i].length)),"<br></td></tr>");
				NCellaLlista[i_llista]++;
			}
		}
		if (ActualitzaLlistaMinimitzaVisu)
		{
			if (keycode==8 ||  //backspace
			    keycode==46)   //Suprimir
				showLayer(elem);
			else if (NCellaLlista[i_llista]==1)
			{
				llavor.value=LlistaCadenes[i_llista][ILlistaDeICellaLlista[i_llista][0]];
				hideLayer(elem);
				PortamAAmbitConsultaTipicaCercador(i_llista, ILlistaDeICellaLlista[i_llista][0]);
			}
			else if (NCellaLlista[i_llista]==0)
			{
				cdns.push("<tr><td>--",(DonaCadenaLang({"cat":"Cap coincidència", "spa":"Ninguna coincidencia", "eng":"Any match", "fre":"Aucune coïncidence"})),"--</td></tr>");
				showLayer(elem);
			}
			else
				showLayer(elem);
		}
		cdns.push("</table>");
	}
	contentLayer(elem, cdns.join("")); 
}//Fi de ActualitzaLlistaTimeOut()

var timeoutActualitzaLLista=null;

//Aquesta funció necessita WindowsDelEvent ple
function ActualitzaLlista(llavor, i_llista, keycode)
{
var s="";
var elem;

	if (timeoutActualitzaLLista)
	{
		clearTimeout(timeoutActualitzaLLista);
		timeoutActualitzaLLista=null;
	}
	elem=getLayer(window, NomLayerLlista[i_llista]);
	s+="<table class=\"TaulaAmbVora\" CELLSPACING=0 CELLPADDING=0><tr><td>"+
	   DonaCadenaLang({"cat":"Actualitzant la llista, espereu", "spa":"Actualizando la lista, espere", 
					   "eng":"Updating the list, please wait","fre":"La liste est en train d'être actualisée, attendez."})+
	   "...</td></tr></table>";
	contentLayer(elem, s);
	showLayer(elem);
	//ActualitzaLlistaTimeOut(i_llista, keycode);
	timeoutActualitzaLLista=setTimeout("ActualitzaLlistaTimeOut("+i_llista+", "+keycode+")", 50);
//Funciona amb tots excepte amb IE
//timeoutActualitzaLLista=setTimeout(ActualitzaLlistaTimeOut, 50, i_llista, keycode);
}

function IniciaLlista(layer_name, edit_name, i_llista)
{
	LlistaSenzilla[i_llista]=[];
	ILlistaDeICellaLlista[i_llista]=[];
	NCellaLlista[i_llista]=0;
	ICellaLlistaBlau[i_llista]=-1;
	NomEditLlavorLlista[i_llista]=edit_name;
	NomLayerLlista[i_llista]=layer_name;

	for (var i=0; i<LlistaCadenes[i_llista].length; i++)
		LlistaSenzilla[i_llista][i]=DonaCadenaSenzilla(LlistaCadenes[i_llista][i]);
}

function OmpleXYAmpleAltEnvConsultaTipicaCompleta(win, i_ctipica, env)
{
    if (win && win.document && ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCompleta")
    {
		//form_ctipica=eval("window.document.ctipica"+i_ctipica);
		form_ctipica=window.document["ctipica"+i_ctipica];
		if (form_ctipica)
		{
			if (env)
			{
				form_ctipica.x.value=OKStrOfNe((env.MaxX+env.MinX)/2,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.y.value=OKStrOfNe((env.MaxY+env.MinY)/2,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.ample.value=OKStrOfNe(env.MaxX-env.MinX,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.alt.value=OKStrOfNe(env.MaxY-env.MinY,ParamCtrl.NDecimalsCoordXY);
	
				form_ctipica.MinX.value=OKStrOfNe(env.MinX,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.MaxX.value=OKStrOfNe(env.MaxX,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.MinY.value=OKStrOfNe(env.MinY,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.MaxY.value=OKStrOfNe(env.MaxY,ParamCtrl.NDecimalsCoordXY);
			}
			else
			{
				form_ctipica.x.value=OKStrOfNe(
							ParamInternCtrl.PuntOri.x,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.y.value=OKStrOfNe(
							ParamInternCtrl.PuntOri.y,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.ample.value=OKStrOfNe(
							ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.alt.value=OKStrOfNe(
							ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual,ParamCtrl.NDecimalsCoordXY);
	
				form_ctipica.MinX.value=OKStrOfNe(
							ParamInternCtrl.PuntOri.x-ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual/2,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.MinY.value=OKStrOfNe(
							ParamInternCtrl.PuntOri.y-ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual/2,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.MaxX.value=OKStrOfNe(
							ParamInternCtrl.PuntOri.x+ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual/2,ParamCtrl.NDecimalsCoordXY);
				form_ctipica.MaxY.value=OKStrOfNe(
						ParamInternCtrl.PuntOri.y+ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual/2,ParamCtrl.NDecimalsCoordXY);
			}
		}
    }
}

function OmpleXYAmpleAltEnvConsultesTipiquesCompleta(env)
{
	for (var i_ctipica=0; i_ctipica<ParamCtrl.ConsultaTipica.length; i_ctipica++)
	{
		OmpleXYAmpleAltEnvConsultaTipicaCompleta(window, i_ctipica, env);
	}
}

//Posa visible la capa ctipica si pot i posa a no visible la resta de ctipiques
function PosaVisibleIConsultableCapaConsultaTipica(i_ctipica)
{
var retorn=1;  //No he tocat res
var i_capa, i_capa_a_activar;

	for(i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		if (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].nom==ParamCtrl.capa[i_capa].nom)
		{
			if (ParamCtrl.capa[i_capa].visible=="no")
				return retorn;
			i_capa_a_activar=i_capa;
			break;
		}
	}
	if (i_capa==ParamCtrl.capa.length)
		return retorn;

	for(var i_tipica=0; i_tipica<capa_consulta_tipica_intern.length; i_tipica++)
	{
		for(i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
		{
			if (i_capa!=i_capa_a_activar &&
				capa_consulta_tipica_intern[i_tipica].nom==ParamCtrl.capa[i_capa].nom)
			{
				if (i_tipica!=CTipicaCapa[i_ctipica])
				{
					//Revisa si hi ha capes consultables-tipica visibles o consultables i apaga-les 
					if (ParamCtrl.capa[i_capa].visible!="no")
					{
			       		if (ParamCtrl.capa[i_capa].visible!="ara_no")
						{
							CanviaEstatVisibleISiCalDescarregableCapa(i_capa, "ara_no");
							retorn=0;  //He tocat
						}
					}
					if (ParamCtrl.capa[i_capa].consultable!="no")
					{
						if (ParamCtrl.capa[i_capa].consultable!="ara_no")
						{
							ParamCtrl.capa[i_capa].consultable="ara_no";
							retorn=0;  //He tocat
						}
					}

				}
			}
		}
	}
	//Activa la capa consultada.
	if (ParamCtrl.capa[i_capa_a_activar].visible!="no")
	{
		if (ParamCtrl.capa[i_capa_a_activar].transparencia && ParamCtrl.capa[i_capa_a_activar].transparencia=="semitransparent")
		{
			for(i_capa=i_capa_a_activar+1; i_capa<ParamCtrl.capa.length; i_capa++)
			{
				if (ParamCtrl.capa[i_capa].visible=="si" || ParamCtrl.capa[i_capa].visible=="semitransparent")
					break;
			}
			if (ParamCtrl.capa[i_capa_a_activar].visible!="semitransparent" &&
			    ParamCtrl.capa[i_capa_a_activar].visible!="si")
			{
				if (i_capa==ParamCtrl.capa.length)
					CanviaEstatVisibleISiCalDescarregableCapa(i_capa_a_activar, "si");
				else
					CanviaEstatVisibleISiCalDescarregableCapa(i_capa_a_activar, "semitransparent");
				retorn=0;  //He tocat
			}
		}
		else
		{
			if (ParamCtrl.capa[i_capa_a_activar].visible!="si")
			{
				CanviaEstatVisibleISiCalDescarregableCapa(i_capa_a_activar, "si");
				retorn=0;  //He tocat
			}
		}
		if (ParamCtrl.capa[i_capa_a_activar].estil!=null && CTipicaValor < ParamCtrl.capa[i_capa_a_activar].estil.length)
			ParamCtrl.capa[i_capa_a_activar].i_estil=CTipicaValor;
	}
	if (ParamCtrl.capa[i_capa_a_activar].consultable!="no")
	{
		if (ParamCtrl.capa[i_capa_a_activar].consultable!="si")
		{
			ParamCtrl.capa[i_capa_a_activar].consultable="si";
			retorn=0;  //He tocat
		}
	}
	return retorn;
}


function PortamAAmbitConsultaTipicaCercador(i_ctipica, i_llista_buscar)
{
var i_ctipica_capa, i_valor;

	if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCercador")
	{
		var i_llista=0;
		if (ParamCtrl.ConsultaTipica[i_ctipica].NomCapa==null)
		{
			if (capa_consulta_tipica_intern.length==1)
			{
				if(capa_consulta_tipica_intern[0].id_camp)
					i_valor=capa_consulta_tipica_intern[0].id_camp[0][i_llista_buscar].id;
				else
					i_valor==i_llista_buscar;				
				PortamAAmbitConsultaTipica(i_ctipica, 0, 0, i_valor);
				return;
			}
			else
			{
				for (var i_tipica_capa=0; i_tipica_capa<capa_consulta_tipica_intern.length; i_tipica_capa++)
				{		    	    
					if(capa_consulta_tipica_intern[i_tipica_capa].id_camp)
					{
						for (var i=0; i<capa_consulta_tipica_intern[i_tipica_capa].id_camp[0].length; i++, i_llista++)
						{
							if (i_llista==i_llista_buscar)
							{
								i_valor=capa_consulta_tipica_intern[0].id_camp[0][i].id;
								PortamAAmbitConsultaTipica(i_ctipica, i_tipica_capa, 0, i_valor);
								return 0;
							}	
						}								
					}
					else
					{
						for (var i_valor=0; i_valor<capa_consulta_tipica_intern[i_tipica_capa].proj_camp[0].length; i_valor++, i_llista++)
						{
							if (i_llista==i_llista_buscar)
							{
								PortamAAmbitConsultaTipica(i_ctipica, i_tipica_capa, 0, i_valor);
								return 0;
							}
						}
					}
				}
			}
		}
		else
		{
			for (i_nom_capa=0; i_nom_capa<ParamCtrl.ConsultaTipica[i_ctipica].NomCapa.length; i_nom_capa++)
			{
				for (var i_tipica_capa=0; i_tipica_capa<capa_consulta_tipica_intern.length; i_tipica_capa++)
				{
					if (capa_consulta_tipica_intern[i_tipica_capa].nom==ParamCtrl.ConsultaTipica[i_ctipica].NomCapa[i_nom_capa])
						break;
				}
				if (i_tipica_capa<capa_consulta_tipica_intern.length)
				{
					if(capa_consulta_tipica_intern[i_tipica_capa].id_camp)
					{
						for (var i=0; i<capa_consulta_tipica_intern[i_tipica_capa].id_camp[0].length; i++, i_llista++)
						{
							if (i_llista==i_llista_buscar)
							{
								i_valor=capa_consulta_tipica_intern[0].id_camp[0][i].id;
								PortamAAmbitConsultaTipica(i_ctipica, i_tipica_capa, 0, i_valor);
								return 0;
							}	
						}								
					}
					else
					{
						for (var i_valor=0; i_valor<capa_consulta_tipica_intern[i_tipica_capa].proj_camp[0].length; i_valor++, i_llista++)
						{
							if (i_llista==i_llista_buscar)
							{
								PortamAAmbitConsultaTipica(i_ctipica, i_tipica_capa, 0, i_valor);
								return 0;
							}
						}
					}
				}
			}
		}
	}
	return;  //això no hauria de passar mai.
}

function InsertaOpcioEnSelect(selector, opcio, posicio)
{
	try
	{						
		selector.add(opcio, posicio);// standards compliant
	}
	catch(ex)
	{						
		selector.add(opcio); //IE only
	}
}

function ActualitzaComboConsultaTipicaSeguents(i_ctipica, i_ctipica_capa, i_camp_ctipica, valor)
{
	if (capa_consulta_tipica_intern.length && i_camp_ctipica>0)
	{
		//He d'actualitzar els combos amb la informació del valor seleccionat a partir d'aquest combo			
		var document_ctipica=window.document;
		var i_camp_selec=i_camp_ctipica;
		if(valor<0 && i_camp_selec<capa_consulta_tipica_intern[i_ctipica_capa].camps.length)  // S'ha escollit l'opció de --Seleccionar ---
			i_camp_selec++;

		var select_ctipica_anterior;
		var valor_seleccionat=[];
		for(var z=i_camp_selec; z<capa_consulta_tipica_intern[i_ctipica_capa].camps.length; z++)
		{
			//select_ctipica_anterior=eval("window.document.ctipica"+i_ctipica+".valor"+z);
			select_ctipica_anterior=window.document["ctipica"+i_ctipica]["valor"+z];
			valor_seleccionat[z]=select_ctipica_anterior.options[select_ctipica_anterior.selectedIndex].value;
		}
		for(var i=i_camp_ctipica-1; i>=0; i--)
		{
			var opcio="";
			var array_index= [];
			//var select_ctipica=eval("window.document.ctipica"+i_ctipica+".valor"+i);
			var select_ctipica=window.document.ctipica[i_ctipica]["valor"+i];
			
			//Esborro el select
			select_ctipica.options.length=0;
			
			//Construeixo una llista amb els índexs dels camps que cumpleixen la selecció actual i les anteriors
			for(var j=0; j<capa_consulta_tipica_intern[i_ctipica_capa].id_camp[0].length; j++)
			{													
				for(var z=i_camp_selec; z<capa_consulta_tipica_intern[i_ctipica_capa].camps.length; z++)
				{
					if(valor_seleccionat[z]>=0 && capa_consulta_tipica_intern[i_ctipica_capa].id_camp[z][j].id!=valor_seleccionat[z])													
						break;
				}
				if(z==capa_consulta_tipica_intern[i_ctipica_capa].camps.length)
					array_index[array_index.length]=capa_consulta_tipica_intern[i_ctipica_capa].id_camp[i][j].id;
			}
			//Haig ordenar array_index
			array_index.sort(sortAscendingNumber);
			//Tornor a omplir el combo 				
			//Afegeix-ho el seleccionar tots
			opcio=document_ctipica.createElement('option');
			opcio.text=DonaCadenaLang({"cat":"--Seleccionar--", "spa":"--Seleccionar--", "eng":"--Select--", "fre":"--Sélectionner--"});
			opcio.value=-2;
			opcio.selected=true;
			InsertaOpcioEnSelect(select_ctipica, opcio, null);
			opcio=document_ctipica.createElement('option');
			opcio.text=DonaCadenaLang({"cat":"---------------","spa": "---------------", "eng":"----------", "fre":"----------------"});
			opcio.value=-1;
			opcio.selected=false;
			InsertaOpcioEnSelect(select_ctipica, opcio, null);
			
			//I ara els valors
			var ultim_valor_usat=-1;
			for(var j=0; j<array_index.length; j++)
			{					
				//En l'array hi poden haver-hi repeticions					
				if(ultim_valor_usat!=array_index[j])
				{
					opcio=document_ctipica.createElement('option');
					opcio.text=capa_consulta_tipica_intern[i_ctipica_capa].proj_camp[i][array_index[j]].valor;
					opcio.value=array_index[j];
					opcio.selected=false;
					InsertaOpcioEnSelect(select_ctipica, opcio, null);
					ultim_valor_usat=array_index[j];
				}
			}
		}			
	}
}

function PortamAAmbitConsultaTipica(i_ctipica, i_ctipica_capa, i_camp_ctipica, valor)
{

	if (capa_consulta_tipica_intern.length && i_camp_ctipica>=0 && valor>=0)
	{
		CTipicaCapa[i_ctipica]=i_ctipica_capa;
		CTipicaValor=valor;
		if (ParamCtrl.LlegendaLligaVisibleAmbCtipica==true)
		{
			if (PosaVisibleIConsultableCapaConsultaTipica(i_ctipica)==0)
			{
				RevisaEstatsCapes();
				CreaLlegenda();
			}
		}
		EstableixNouCRSEnv(ParamCtrl.CapaConsultaPreguntaServidor[i_ctipica_capa].CRS, capa_consulta_tipica_intern[i_ctipica_capa].proj_camp[i_camp_ctipica][valor].env);
		PortamAAmbit(capa_consulta_tipica_intern[i_ctipica_capa].proj_camp[i_camp_ctipica][valor].env);
		PosaLlistaValorsConsultesTipiquesAlPrincipi(i_ctipica);
	}
}

function PortamAAmbitConsultaTipicaCompleta(i_ctipica, capa, valor)
{
    if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCompleta")
    {
		//var form_ctipica=eval("window.document.ctipica"+i_ctipica);
		var form_ctipica=window.document["ctipica"+i_ctipica];
		if (form_ctipica && form_ctipica.capa)
		{
			CTipicaCapa[i_ctipica]=capa;
			PortamAAmbitConsultaTipica(i_ctipica, capa, 0, valor);
			for (var i=0; i<capa_consulta_tipica_intern.length+3; i++)
			{
				if (i==CTipicaCapa[i_ctipica])
					form_ctipica.capa[i].checked=true;
				else
					form_ctipica.capa[i].checked=false;
			}
			form_ctipica.retallar[2].disabled=false;
		}
    }
}

function DonaFormulariCTipicaCompleta()
{
	if (ParamCtrl.ConsultaTipica)
	{
		for (var i_ctipica=0; i_ctipica<ParamCtrl.ConsultaTipica.length; i_ctipica++)
		{
			//var form_ctipica=eval("window.document.ctipica"+i_ctipica);
			var form_ctipica=window.document["ctipica"+i_ctipica];
			if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCompleta" && form_ctipica && form_ctipica.capa && capa_consulta)
			{
				return form_ctipica;
			}
		}
	}
	return null;
}

function DonaEnvolupantDescarregaAmbCTipicaCompleta()
{
	//canvi d'ambit si la consulta és completa i hi ha sel·leccionat x,y o ambit.
	var form_ctipica=DonaFormulariCTipicaCompleta();

	if (form_ctipica)
	{
		for (var i=0; i<capa_consulta.length; i++)
		{
			if (form_ctipica.capa[i].checked)
			{
			    //triar l'ambit del objecte.
				return capa_consulta[i].proj_camp[ctipica_valor].env;
				break;
			}
		}
		if (form_ctipica.capa[i].checked)
			return DonaEnvDeXYAmpleAlt(parseFloat(form_ctipica.x.value), parseFloat(form_ctipica.y.value), parseFloat(form_ctipica.ample.value), parseFloat(form_ctipica.alt.value));
		if (form_ctipica.capa[i+1].checked)
			return DonaEnvDeMinMaxXY(parseFloat(form_ctipica.MinX.value), parseFloat(form_ctipica.MaxX.value), parseFloat(form_ctipica.MinY.value), parseFloat(form_ctipica.MaxY.value));
		return ParamCtrl.EnvTotal;
	}
	return ParamInternCtrl.vista.EnvActual;		
}

function SeleccionaRadialPuntCentralConsultaTipica(i_ctipica)
{
    if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCompleta")
    {
		//var form_ctipica=eval("window.document.ctipica"+i_ctipica);
		var form_ctipica=window.document["ctipica"+i_ctipica];
		if (form_ctipica && form_ctipica.capa)
		{
			for (var i=0; i<capa_consulta_tipica_intern.length+3; i++)
				form_ctipica.capa[i].checked=false;
			form_ctipica.capa[capa_consulta_tipica_intern.length].checked=true;
		}
    }
}

function SeleccionaRadialPuntCentralConsultesTipiques()
{
	for (var i=0; i<ParamCtrl.ConsultaTipica.length; i++)
		SeleccionaRadialPuntCentralConsultaTipica(i);
}

function ModificaAmpleIAltFactor(ctipica, factor)
{
	ctipica.ample.value=OKStrOfNe(parseFloat(ctipica.ample.value)*factor,ParamCtrl.NDecimalsCoordXY);
	ctipica.alt.value=OKStrOfNe(parseFloat(ctipica.alt.value)*factor,ParamCtrl.NDecimalsCoordXY);
}

function PosaAGrisRetallPerObjecteConsultaTipica(i_ctipica)
{
    if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCompleta")
    {
		//var form_ctipica=eval("window.document.ctipica"+i_ctipica);
		var form_ctipica=window.document["ctipica"+i_ctipica];
		if (form_ctipica && form_ctipica.capa)
		{
			for (var i=0; i<capa_consulta_tipica_intern.length; i++)
			{
				if (form_ctipica.capa[i].checked)
					break;
			}
			if (i==capa_consulta_tipica_intern.length)
			{
				if (form_ctipica.retallar[2].checked)
				{
					form_ctipica.retallar[2].checked=false;	    		
					form_ctipica.retallar[1].checked=true;
				}
				form_ctipica.retallar[2].disabled=true;
			}
		}
    }
}

function PosaAGrisRetallPerObjecteConsultesTipiques()
{
	for (var i=0; i<ParamCtrl.ConsultaTipica.length; i++)
		PosaAGrisRetallPerObjecteConsultaTipica(i);
}

//var ctipica_capa=0; ara és CTipicaCapa[i_ctipica]
var CTipicaOffset=2;  //És una constant per saltar el text "seleccioneu"
var CTipicaValor=-CTipicaOffset;

function CanviaLlistaCapaConsultaTipica(i_ctipica)
{
    if (capa_consulta_tipica_intern.length)
    {
		//var form_ctipica=eval("window.document.ctipica"+i_ctipica);
		var form_ctipica=window.document["ctipica"+i_ctipica];
		if (form_ctipica && form_ctipica.capa)
		{
			CTipicaCapa[i_ctipica]=form_ctipica.capa.selectedIndex;
			CTipicaValor=-CTipicaOffset;		
			CreaConsultaTipica(i_ctipica);
		}
    }
}


function PosaConsultaTipicaDesplegableAlPrincipi(i_ctipica)
{
    if (capa_consulta_tipica_intern.length)
    {
		//var form_ctipica=eval("window.document.ctipica"+i_ctipica);
		var form_ctipica=window.document["ctipica"+i_ctipica];
		if (form_ctipica)
		{
			if(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].id_camp)		
			{
				//var form_ctipica_valor=eval("form_ctipica.valor"+(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length-1));
				var form_ctipica_valor=form_ctipica["valor"+(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length-1)];
				if(form_ctipica_valor)
				{
					CTipicaValor=-CTipicaOffset;
					form_ctipica_valor.selectedIndex=0;
					ActualitzaComboConsultaTipicaSeguents(i_ctipica, CTipicaCapa[i_ctipica], 
						(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length-1), -2);
				}
			}
			else
			{
				if(form_ctipica.valor)
				{
					CTipicaValor=-CTipicaOffset;
					form_ctipica.valor.selectedIndex=0;
				}
			}
		}
    }
}

function PosaConsultaTipicaCercadorAlPrincipi(win, i_ctipica)
{
    if (win && win.document && capa_consulta_tipica_intern.length)
    {
		//var form_ctipica=eval("window.document.ctipica"+i_ctipica);
		var form_ctipica=window.document["ctipica"+i_ctipica];
		
		if (form_ctipica)
		{
			//var valor=eval("window.document.ctipica"+i_ctipica+".llavor"+i_ctipica);
			var valor=window.document["ctipica"+i_ctipica]["llavor"+i_ctipica];
			if (valor)
			{
				valor.value="";
				hideLayer(getLayer(window, NomLayerLlista[i_ctipica]));
			}
		}
    }
}

function PosaLlistaValorsConsultesTipiquesAlPrincipi(excepte_i_ctipica)
{
	for (var i_ctipica=0; i_ctipica<ParamCtrl.ConsultaTipica.length; i_ctipica++)
	{
		if (i_ctipica==excepte_i_ctipica)
			continue;
		if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaDesplegables")
			PosaConsultaTipicaDesplegableAlPrincipi(i_ctipica);
		else if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCercador")
			PosaConsultaTipicaCercadorAlPrincipi(window, i_ctipica);
		else if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaInicials")
			CanviaInicialCapaConsultaTipica(i_ctipica, null);
	}
}

var InicialConsultaTipica="A";
function CanviaInicialCapaConsultaTipica(i_ctipica, s)
{
	if (capa_consulta_tipica_intern.length)
	{
		InicialConsultaTipica=s;		
		CreaConsultaTipica(i_ctipica);
	}
}

function CreaConsultaTipica(i_ctipica)
{
var cdns=[];
var s;

	cdns.push("<FORM NAME=\"ctipica",i_ctipica,"\" onSubmit=\"return false;\">\n\n");
	
	if (CTipicaCapa.length)
	{
	    if ((ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaDesplegables" || ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaInicials") 
			&& capa_consulta_tipica_intern.length)
	    {
			//Camp final seleccionable Anar a ""
			if ((ParamCtrl.ConsultaTipica[i_ctipica].NomCapa==null && capa_consulta_tipica_intern.length==1) || 
			   (ParamCtrl.ConsultaTipica[i_ctipica].NomCapa!=null && ParamCtrl.ConsultaTipica[i_ctipica].NomCapa.length==1))
			{
				cdns.push("<span class=\"text_general_consulta\">",
					DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[0].previ) , " </span><span class=\"nom_capa_consulta\">" ,
					DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[0].desc) , "</span> ");

				cdns.push("<span class=\"text_general_consulta\">");
				if(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length>1  && ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaDesplegables")
					cdns.push("<br>&nbsp;&nbsp;&nbsp;&nbsp;",DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length-1].previ));
				else
					cdns.push(DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[0].post));
				cdns.push("</span>");
			}
			else //Hi ha més d'una capa
			{	
				cdns.push("<span class=\"text_general_consulta\">",
				   DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[0].previ), " </span>" ,
				   "  <select name=\"capa\" class=\"desplegable\" onChange=\'CanviaLlistaCapaConsultaTipica(",i_ctipica,");\'>");
				if (ParamCtrl.ConsultaTipica[i_ctipica].NomCapa==null)
				{
					for (var i=0; i<capa_consulta_tipica_intern.length; i++)
					{
						cdns.push("  <option VALUE=\"" , i , "\"" , ((i==CTipicaCapa[i_ctipica]) ? " SELECTED" : "") , ">" ,
						   DonaCadena(capa_consulta_tipica_intern[i].camps[0].desc) , "</option>");
					}
				}
				else
				{
					for (var i_nom_capa=0; i_nom_capa<ParamCtrl.ConsultaTipica[i_ctipica].NomCapa.length; i_nom_capa++)
					{			        	
						for (var i=0; i<capa_consulta_tipica_intern.length; i++)
						{
							if (capa_consulta_tipica_intern[i].nom==ParamCtrl.ConsultaTipica[i_ctipica].NomCapa[i_nom_capa])
								break;
						}
						if (i==capa_consulta_tipica_intern.length)
						{						
							s=DonaCadenaLang({"cat":"La capa ", "spa":"La capa ", "eng":"Layer ", "fre":"La couche "}) + 
							ParamCtrl.ConsultaTipica[i_ctipica].NomCapa[i_nom_capa] +
							DonaCadenaLang({"cat":" per a mostrar al frame ", "spa":" para mostrar en el frame ", "eng":" to be shown in the frame ", "fre":" à montrer au frame "}) +
							ParamCtrl.ConsultaTipica[i_ctipica].nom + 
							DonaCadenaLang({"cat":" no és a la llista de capes amb consulta típica.", 
									"spa":" no está en la lista de capas con consulta típica.", 
									"eng":" is not in the typical query layer list.",
									"fre":" ne se trouve pas dans la liste de couches avec recherche typique"});
							alert(s);								 
						}
						else
						{
							cdns.push("  <option VALUE=\"" , i , "\"" , ((i==CTipicaCapa[i_ctipica]) ? " SELECTED" : "") , 
							   ">" , DonaCadena(capa_consulta_tipica_intern[i].camps[0].desc) , "</option>");
						}
					}	
				}
				cdns.push("  </SELECT><span class=\"text_general_consulta\">");
				if(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length>1 && ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaDesplegables")
					cdns.push("<br>&nbsp;&nbsp;&nbsp;&nbsp;",
						 DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length-1].previ));
				else
					cdns.push("&nbsp;",DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[0].post));
				cdns.push("</span>");
			}
			
			//Valors del camp si només ni ha un o valors del camp n, n-1,...1 
			if (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]])
			{
				if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaInicials")
				{
					//Crear les llistes de lletres.
					cdns.push("<br><span class=\"lletres_consulta_inicials\">");
					for (var i=0; i<capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0].length; i++)
					{
						if (i==0 || capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor.substring(0,1)!=
									 capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i-1].valor.substring(0,1))
						{
							if (i!=0)
							   cdns.push("\n");
							//Faig que la lletres seleccionada estigui en negreta.
							if (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor.substring(0,1)==InicialConsultaTipica)
							   cdns.push("<b>");
							cdns.push("<a href=\"javascript:void(0);\" onClick=\'CanviaInicialCapaConsultaTipica(",i_ctipica,
							   ",\"" , (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor.substring(0,1)) , "\");\'>",
							   (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor.substring(0,1)) ,"</a>");									
							if (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor.substring(0,1)==InicialConsultaTipica)
								cdns.push("</b>");
						}
					}
					cdns.push("<br></span><span class=\"valors_consulta_inicials\"><ul>");
		
					//Crear les llistes d'atributs de la inicial seleccionada.
					for (var i=0; i<capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0].length; i++)
					{
						if (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor.substring(0,1)==InicialConsultaTipica)
						   break;
					}
					for (; i<capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0].length; i++)
					{
						if (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor.substring(0,1)!=InicialConsultaTipica)
						   break;
						cdns.push("\n<li><a href=\"javascript:void(0);\" onClick=\"PortamAAmbitConsultaTipica(",
						   i_ctipica,", ",CTipicaCapa[i_ctipica],", 0, ",i,");\">",
						   capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor,
						   "</a>");
					}
					cdns.push("\n</ul></span>");
				}
				else  //  if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaDesplegables")
				{
					var valor_opcio="";
					if(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length>1)
					{
						for (var j=capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps.length-1; j>0; j--)
						{
							cdns.push("<span class=\"nom_camp_consulta\">&nbsp;" ,
							  DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[j].desc) ,
							  " </span><span class=\"text_general_consulta\">",
							  DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[j].post),
							  "</span>");
							valor_opcio="document.ctipica"+i_ctipica+".valor"+j+".options[document.ctipica"+i_ctipica+".valor"+j+".selectedIndex].value";
							cdns.push("  <select name=\"valor",j,"\" class=\"desplegable\" onChange=\"PortamAAmbitConsultaTipica(",i_ctipica,", ",
								   CTipicaCapa[i_ctipica],", ",j,", ",valor_opcio,");",
								   "ActualitzaComboConsultaTipicaSeguents(",i_ctipica,", ",CTipicaCapa[i_ctipica],", ",j,
								   ", ",valor_opcio,");\">" ,
								   "  <option VALUE=\"-2\"" , ((-1==CTipicaValor) ? " SELECTED" : "") , ">" , 
								   (DonaCadenaLang({"cat":"--Seleccionar--", "spa":"--Seleccionar--", "eng":"--Select--", "fre":"--Sélectionner--"})) , "</option>" ,
								   "  <option VALUE=\"-1\">" , (DonaCadenaLang({"cat":"---------------", "spa":"---------------", "eng":"----------","fre":"----------------"})) , "</option>");
							for (var i=0; i<capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[j].length; i++)
								cdns.push("  <option VALUE=\"" , i , "\"" , ((i==CTipicaValor) ? " SELECTED" : "") , ">" , 
									capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[j][i].valor , "</option>");
							cdns.push("  </SELECT>");
							if(j>1)
							   cdns.push("<br><span class=\"text_general_consulta\">&nbsp;&nbsp;&nbsp;&nbsp;",
								   DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[j-1].previ),"</span>");
						}
						cdns.push("<br><span class=\"text_general_consulta\">",
							DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[0].post),
							"</span>");
					}
					valor_opcio="document.ctipica"+i_ctipica+".valor"+0+".options[document.ctipica"+i_ctipica+".valor"+0+".selectedIndex].value";
					cdns.push("  <select name=\"valor0\" class=\"desplegable\" onChange=\"PortamAAmbitConsultaTipica(",i_ctipica,", ",
					   CTipicaCapa[i_ctipica] , ", 0, " , valor_opcio , ");\">" ,
					   "  <option VALUE=\"-2\"" , ((-1==CTipicaValor) ? " SELECTED" : "") , ">" , 
					   (DonaCadenaLang({"cat":"--Seleccionar--", "spa":"--Seleccionar--", "eng":"--Select--", "fre":"--Sélectionner--"})) , "</option>" ,
					   "  <option VALUE=\"-1\">" , (DonaCadenaLang({"cat":"---------------", "spa":"---------------", "eng":"----------","fre":"----------------"})) , "</option>");
					for (var i=0; i<capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0].length; i++)
						cdns.push("  <option VALUE=\"" , i , "\"" , ((i==CTipicaValor) ? " SELECTED" : "") , ">" , 
							capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].proj_camp[0][i].valor , "</option>");
					cdns.push("  </SELECT>");
				}
			}
			cdns.push("</FORM>");
	    }
	    else if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCercador")
	    {
			cdns.push("<span class=\"text_general_consulta\">",
			   DonaCadena(capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].camps[0].previ), 
			   "</span> <input class=\"InputPetit\" autocomplete=\"off\" type=text name=\"llavor",i_ctipica,
			   "\" size=\"55\" onkeyup=\"WindowDelEvent=this;TeclaLLavor(event);\" onfocus=\"SeleccionaEditLlavor(this);\"></FORM>\n",
			   (textHTMLiframeLayer("AreaLlista"+i_ctipica, 60, 20, 364, 70, true)),
			   (textHTMLLayer("AreaLlista"+i_ctipica, 60, 20, 364, 70, null, {scroll: "ara_no", visible: true, ev: null, save_content: false}, null, "--Waiting--")));
	    }
	    else if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCompleta")
	    {
			cdns.push("<table border=0 cellspacing=0 cellpadding=0>" ,
			   "<tr><td rowspan=",(capa_consulta_tipica_intern.length+4),
			   "><img src=\"",
			   AfegeixAdrecaBaseSRC("1tran.gif"), 
			   "\" height=1 width=5></td>",
			   "<td colspan=2><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2><b>Selecció de l'àmbit:</b></td></tr>");
			//(*) Per ··· [    ][v]
			var i;
			for (i=0; i<capa_consulta_tipica_intern.length; i++)
			{
				cdns.push("<tr><td><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2><input type=\"radio\" name=\"capa\" value=\"" , i , 
					"\" onClick='PortamAAmbitConsultaTipicaCompleta(",i_ctipica,", ",i,", 0, document.ctipica",i_ctipica,".valor",i,
					".selectedIndex);'> Per " , DonaCadena(capa_consulta_tipica_intern[i].camps[0].desc) , ": </td>" ,
					"<td><select name=\"valor",i,"\" onChange='PortamAAmbitConsultaTipicaCompleta(",i_ctipica,", ",i,
					", 0, document.ctipica",i_ctipica,".valor",i,".selectedIndex);'>");
				for (var j=0; j<capa_consulta_tipica_intern[i].proj_camp[0].length; j++)
					cdns.push("  <option VALUE=\"" , j , "\"" , ((i==CTipicaCapa[i_ctipica] && j==CTipicaValor) ? " SELECTED" : "") , ">" , 
						capa_consulta_tipica_intern[i].proj_camp[0][j].valor , "</option>");
				cdns.push("  </SELECT></td></tr>");
			}
		
    		//(*) Per punt central: x:[ ] y:[ ] ample: [ ] alt: [ ] [Anar-hi] [+10%][x2][/2]
			cdns.push("<tr><td valign=top><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2><input type=\"radio\" name=\"capa\" value=\"" , i , 
				"\" CHECKED onClick='PosaAGrisRetallPerObjecteConsultaTipica(this);'> Per punt central:</td><td valign=top><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2>x: <input type=\"text\" size=\"15\" name=\"x\" value=\"\"> y: <input type=\"text\" size=\"15\" name=\"y\" value=\"\"><br>" ,
				"ample: <input type=\"text\" size=\"8\" name=\"ample\" value=\"\"> alt: <input type=\"text\" size=\"8\" name=\"alt\" value=\"\">" ,
				"<input TYPE=\"button\" VALUE=\"Anar-hi\" onClick=\"PortamAAmbit(DonaEnvDeXYAmpleAlt(parseFloat(document.ctipica",i_ctipica,".x.value), parseFloat(document.ctipica",i_ctipica,".y.value), parseFloat(document.ctipica",i_ctipica,".ample.value), parseFloat(document.ctipica",i_ctipica,".alt.value)));document.ctipica",i_ctipica,".capa[",i,"].checked=true;\">" ,
				"<input TYPE=\"button\" VALUE=\"+10%\" onClick=\"ModificaAmpleIAltFactor(document.ctipica",i_ctipica,", 1.1);PortamAAmbit(DonaEnvDeXYAmpleAlt(parseFloat(document.ctipica",i_ctipica,".x.value), parseFloat(document.ctipica",i_ctipica,".y.value), parseFloat(document.ctipica",i_ctipica,".ample.value), parseFloat(document.ctipica",i_ctipica,".alt.value)));document.ctipica",i_ctipica,".capa[",i,"].checked=true;\">" ,
				"<input TYPE=\"button\" VALUE=\"*2\" onClick=\"ModificaAmpleIAltFactor(document.ctipica",i_ctipica,", 2.0);PortamAAmbit(DonaEnvDeXYAmpleAlt(parseFloat(document.ctipica",i_ctipica,".x.value), parseFloat(document.ctipica",i_ctipica,".y.value), parseFloat(document.ctipica",i_ctipica,".ample.value), parseFloat(document.ctipica",i_ctipica,".alt.value)));document.ctipica",i_ctipica,".capa[",i,"].checked=true;\">" ,
				"<input TYPE=\"button\" VALUE=\"/2\" onClick=\"ModificaAmpleIAltFactor(document.ctipica",i_ctipica,", 0.5);PortamAAmbit(DonaEnvDeXYAmpleAlt(parseFloat(document.ctipica",i_ctipica,".x.value), parseFloat(document.ctipica",i_ctipica,".y.value), parseFloat(document.ctipica",i_ctipica,".ample.value), parseFloat(document.ctipica",i_ctipica,".alt.value)));document.ctipica",i_ctipica,".capa[",i,"].checked=true;\"></td></tr>");
			i++;
			
			//(*) Per envolupant X min: [  ] X max: []  Y min: [] X max: [] [Anar-hi]
			cdns.push("<tr><td valign=top><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2><input type=\"radio\" name=\"capa\" value=\"" , i , 
				"\" onClick='PosaAGrisRetallPerObjecteConsultaTipica(this);'> Per envolupant:</td><td valign=top><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2>mín X: <input type=\"text\" size=\"15\" name=\"MinX\" value=\"\"> màx X: <input type=\"text\" size=\"15\" name=\"MaxX\" value=\"\"><br>mín Y: <input type=\"text\" size=\"15\" name=\"MinY\" value=\"\"> màx Y: <input type=\"text\" size=\"15\" name=\"MaxY\" value=\"\"> <input TYPE=\"button\" VALUE=\"Anar-hi\" onClick=\"PortamAAmbit({\'MinX\': parseFloat(document.ctipica",
				i_ctipica,".MinX.value), \'MaxX\': parseFloat(document.ctipica",i_ctipica,".MaxX.value), \'MinY\': parseFloat(document.ctipica",i_ctipica,
				".MinY.value), \'MaxY\': parseFloat(document.ctipica",i_ctipica,".MaxY.value)});document.ctipica",i_ctipica,".capa[",i,"].checked=true;\"></td></tr>");
			i++;
		
			//(*) Tot l'ambit disponible
			cdns.push("<tr><td colspan=2><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2><input type=\"radio\" name=\"capa\" value=\"" , i , 
				"\" onClick=\"PortamAVistaGeneral();document.ctipica",i_ctipica,".capa[",i,
				"].checked=true;\"> Tot l'àmbit disponible <small>(només per a les capes més lleugeres)</small></td></tr>" ,
				"<table>" ,
				"<br><FONT FACE=\"Verdana, Arial, Helvetica, sans-serif\" size=2>",
				"&nbsp;&nbsp;<b>En descarregar:</b><br>" ,
				"&nbsp;<input type=\"radio\" name=\"retallar\" value=\"fulls_sencers\" CHECKED> Obtenir fulls vectorials sencers <small>(força més ràpid)</small><br>" ,
				"&nbsp;<input type=\"radio\" name=\"retallar\" value=\"per_rectangle\"> Retallar per rectangle d'àmbit exacte <small>(més lent)</small><br>" ,
				"&nbsp;<input type=\"radio\" name=\"retallar\" value=\"per_objecte\" DISABLED> Retallar usant l'objecte selecionat <small>(encara més lent)</small><br>" ,
				"</FONT></FORM>");
	    }
	}
	s=cdns.join("");
	if(isFinestraLayer(window, ParamCtrl.ConsultaTipica[i_ctipica].nom))
		contentFinestraLayer(window, ParamCtrl.ConsultaTipica[i_ctipica].nom, s);
	else
	{
		var elem=getLayer(window, ParamCtrl.ConsultaTipica[i_ctipica].nom);
		if (elem && isLayer(elem))
			contentLayer(elem, s);
	}
	if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCercador")
	{
		elem=getLayer(window, "AreaLlista"+i_ctipica);
		borderLayer(elem, "1.0px solid #000000");
		colorLayer(elem, "#FFFFFF");
		//llavor_ctipica=eval("window.document.ctipica"+i_ctipica+".llavor"+i_ctipica);
		llavor_ctipica=window.document["ctipica"+i_ctipica]["llavor"+i_ctipica];
		ActualitzaLlista(llavor_ctipica, i_ctipica, 0);
	}
}

function CreaConsultesTipiques()
{
	for (var i=0; i<ParamCtrl.ConsultaTipica.length; i++)
		CreaConsultaTipica(i);
}

//var ajax_ctipica= [];
var capa_consulta_tipica_intern=[];

function OmpleICarregaConsultaTipica(doc, i_event)
{
var root=doc.documentElement;
var i_ctipica=-1, i_camp_ctipica;
var nom_capa="", nom_camp="";
var id_camps_id_tesaure=null;

	CanviaEstatEventConsola(null, i_event, EstarEventTotBe);
	if(root && root.hasChildNodes)
  	{
		if(root.tagName=="ConsultaTipica")
		{				    
			//Obtinc el nom i CRS identificador de la capa consulta típica
			nom_capa=root.getAttribute('id_capa');
				//Busco quin index de consulta li pertoca per començar a omplir l'estructura
			for(var i=0; i<capa_consulta_tipica_intern.length; i++)
			{
				if(capa_consulta_tipica_intern[i].nom==nom_capa)
				{	
					i_ctipica=i;
					break;
				}
			}
			if(i_ctipica==-1)
				return;
	
			//Obtinc la taula de identificadors
	
			var taula_id=root.getElementsByTagName('TaulaIdentificadors')[0];
			var camps=taula_id.getElementsByTagName('Camps')[0];
			var n_camps=parseInt(camps.getAttribute("NombreDeCamps"),10);

	    	if(n_camps>1) //Hi ha registres a la taula d'identificadors
		    {
				capa_consulta_tipica_intern[i_ctipica].id_camp=new Array(n_camps);
				capa_consulta_tipica_intern[i_ctipica].proj_camp=new Array(n_camps);
				id_camps_id_tesaure=new Array(n_camps);
			}
		    else //Només tinc un tesaure
		    {
				capa_consulta_tipica_intern[i_ctipica].id_camp=null;
				capa_consulta_tipica_intern[i_ctipica].proj_camp=new Array(1);
				id_camps_id_tesaure=new Array(1);
			}

			/*Busco el nom dels camps a omplir i els seus tesaures corresponents i els deso en
			  una estructura amb igual ordre que camps de capa_consulta_tipica_intern[i_ctipica] */
			var camp=camps.getElementsByTagName('Camp');
			for(var i=0; i<camp.length; i++)
			{
				i_camp_ctipica=-1;
				nom_camp=camp[i].getAttribute('id_camp');
	
				for(var j=0; j<capa_consulta_tipica_intern[i_ctipica].camps.length; j++)
				{
				   if(capa_consulta_tipica_intern[i_ctipica].camps[j].nom==nom_camp)
				   {
						i_camp_ctipica=j;
						break;
				   }				
				}
				if(i_camp_ctipica==-1)
				   return;
	
				id_camps_id_tesaure[i_camp_ctipica]={"nom": nom_camp, "desc": camp[i].getAttribute('id_tesaure')};
			 }

		     //Llegeixo els registres de la Taula d'Identificadors
		     if(n_camps>1)
	    	 {
				var registres=taula_id.getElementsByTagName('Registres')[0];
				var num_regs=parseInt(registres.getAttribute('NombreDeRegistres'),10);
				for(var z=0; z<n_camps; z++)
				{
				  capa_consulta_tipica_intern[i_ctipica].id_camp[z]=new Array(num_regs);
				}

				for(var i=0; i<registres.childNodes.length; i++)
				{
					var reg=registres.childNodes[i];
				
					if(reg.tagName=="Registre")
					{			
						var index=parseInt(reg.getAttribute('id_reg'),10);	
						var valors=reg.getElementsByTagName('Valor');

						for(var j=0; j<valors.length; j++)
						{			   
						   var valor_id=parseInt(valors[j].childNodes[0].nodeValue,10);

						   for(var z=0; z<id_camps_id_tesaure.length; z++)
						   {
								if(id_camps_id_tesaure[z].nom==valors[j].getAttribute('id_camp'))
								{				    
									capa_consulta_tipica_intern[i_ctipica].id_camp[z][index]=new CreaItemIdentificadorConsultaTipica(index, valor_id);
									break;
								}
							}
						}
				    }
				}
			}

		 	//Començo a llegir els tesaures de cada un dels camps
			var tesaures=root.getElementsByTagName('Tesaure');
			for(var i=0; i<tesaures.length; i++)
			{
				var nom_tesaure=tesaures[i].getAttribute('id_tesaure');
				i_camp_ctipica=-1;
				for(var j=0; j<id_camps_id_tesaure.length; j++)
				{
					if(id_camps_id_tesaure[j].desc==nom_tesaure)
					{
						i_camp_ctipica=j;
						break;
					}
				}
				if(i_camp_ctipica==-1)
				   return;

				//Ja tinc l'índex d'on haig de desar l'estructura projecció del camp
				var registres=tesaures[i].getElementsByTagName('Registres')[0];
				var num_regs=parseInt(registres.getAttribute('NombreDeRegistres'),10);

				capa_consulta_tipica_intern[i_ctipica].proj_camp[i_camp_ctipica]=new Array(num_regs);
			
				//Començo a llegir els registres de tesaure
				for(var z=0; z<registres.childNodes.length; z++)
				{
					var reg=registres.childNodes[z];
						
					if(reg.tagName=="Registre")
					{			
						var index=parseInt(reg.getAttribute('id_reg'),10);	
						var valor=reg.getElementsByTagName('Valor')[0];
						var bbox=reg.getElementsByTagName('BoundingBox')[0];			
						var env_reg={"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0};
						env_reg.MinX=parseFloat(bbox.getAttribute('minx'));
						env_reg.MinY=parseFloat(bbox.getAttribute('miny'));
						env_reg.MaxX=parseFloat(bbox.getAttribute('maxx'));
						env_reg.MaxY=parseFloat(bbox.getAttribute('maxy'));
			
						capa_consulta_tipica_intern[i_ctipica].proj_camp[i_camp_ctipica][index]={"valor": valor.childNodes[0].nodeValue,
													"env": env_reg};
					}
				}
			}						
			NCapesCTipica++;
		}
	}
   	if(capa_consulta_tipica_intern.length>0 && NCapesCTipica==capa_consulta_tipica_intern.length)
   	{
		//Ja les tinc totes carregades i ja puc iniciar les consultes típiques
		IniciaConsultesTipiques();
		CreaConsultesTipiques();
		if(dades_pendents_accio)
		{
			dades_pendents_accio=false;
			if(Accio && Accio.accio&accio_validacio)
			{			
				//Haig de tornar a fer un CreaLLegenda() perquè he tocat l'estat de les capes						
				CreaLlegenda();
				BuscaValorAConsultesTipiques();
				if(Accio.coord)
				{
					var event_de_click= SimulaEventOnClickPerConloc();
					ClickSobreVista(event_de_click);
				}
				else 
				{
					//Mostro un missatge de que comencin a buscar amb les eines del navegador
					alert(DonaCadenaLang({"cat":"Usa les eines del navegador per situar-te sobre la vista.\nA continuació fés clic sobre la vista per determinar la coordenada i la informació del punt a validar.\nPer finalitzar, prem [Validar Coordenada] o [Cancel·lar] des de la finestra de validació.",
										"spa":"Utiliza las herramientas del navegador para situarte sobre la vista.\nA continuación haz clic sobre la vista para determinar la coordenada y la información del punto a validar.\nPara finalizar aprieta [Validar Coordenada] o [Cancelar] desde la ventana de validación.",
										"eng":"You have to use browser tools to place on the view.\n Later, you have to click on the view to determine the coordinate\nand the information of the point of validating.\nTo finish you have to click [Validate coordinate] or [Cancel] from the validation window.",
										"fre":"Utilisez les outils du navigateur pour vous placer sur la vue.\n Ensuite cliquez sur la vue pour déterminer la coordonné\net l'information du point à valider.\nFinalement, pressez [Valider Coordonnée] où [Annuler] de la fenêtre de validation."})); 				
					Accio.coord={"x": 0, "y": 0};
				}
			}
		}
	}
}//Fi de OmpleICarregaConsultaTipica()


function CarregaConsultesTipiques()
{
var s="";

	NCapesCTipica=0;
	if (ParamCtrl.ConsultaTipica && ParamCtrl.CapaConsultaPreguntaServidor)
	{
		for (var i=0; i<ParamCtrl.CapaConsultaPreguntaServidor.length; i++)
		{
	   		capa_consulta_tipica_intern[i]={servidor: DonaServidorCapa(ParamCtrl.CapaConsultaPreguntaServidor[i]), 
				nom: ParamCtrl.CapaConsultaPreguntaServidor[i].nom, 
				camps: ParamCtrl.CapaConsultaPreguntaServidor[i].camps, 
				CRS: ParamCtrl.CapaConsultaPreguntaServidor[i].CRS, 
				proj_camp: null, 
				id_camp: null};
		}
		//Primer creo las capes i desprès torno a fer un bucle per demanar-les
		//sinó em trobava amb problemes de que no estaven totes creades i algunes 
		//coses es feien massa vegades
		for (var i=0; i<ParamCtrl.CapaConsultaPreguntaServidor.length; i++)
		{
			var cdns=[], i_event;
		   	//ajax_ctipica[i]=new Ajax();
			cdns.push("VERSION=1.2.0&REQUEST=DonaProjeccioConsultaTipica&CRS=",
				ParamCtrl.CapaConsultaPreguntaServidor[i].CRS,
				"&INFO_FORMAT=text/xml&QUERY_LAYERS=",
				ParamCtrl.CapaConsultaPreguntaServidor[i].nom);
			s=AfegeixNomServidorARequest(DonaServidorCapa(ParamCtrl.CapaConsultaPreguntaServidor[i]), cdns.join(""), true, DonaCorsServidorCapa(ParamCtrl.CapaConsultaPreguntaServidor[i]));
			i_event=CreaIOmpleEventConsola("DonaProjeccioConsultaTipica", -1, s, TipusEventDonaProjeccioConsultaTipica);
			loadFile(s, "text/xml", 
					OmpleICarregaConsultaTipica, 
					function(text, i_event) {
						CanviaEstatEventConsola(null, i_event, EstarEventError);
					},
					i_event);
		}
	}
}//Fi de CarregaConsultesTipiques()

function DonaCoordXCentralDeEnv(env)
{
	return ((env.MaxX-env.MinX)/2)+env.MinX;
}
function DonaCoordYCentralDeEnv(env)
{
	return ((env.MaxY-env.MinY)/2)+env.MinY;
}
					
function BuscaValorAConsultesTipiques()
{
var trobat=false;

	if(Accio && capa_consulta_tipica_intern.length>0 && Accio.valors && Accio.valors.length>0)
	{
		//Per cada una de les capes a validar	   
		for(var i_capa_accio=0; i_capa_accio<Accio.valors.length; i_capa_accio++)
		{
			for(var i_tipica=0; i_tipica<capa_consulta_tipica_intern.length; i_tipica++)
			{
				//Busco si té una consulta típica amb la que pugui validar el valor demanat
				if(Accio.capes[i_capa_accio]==capa_consulta_tipica_intern[i_tipica].nom)
				{
					//Ara haig de buscar el camp a dins de la consulta típica
					//Busco el camp a validar dins dels camps de la consulta típica de la capa
					for(var i_camp=0; i_camp<capa_consulta_tipica_intern[i_tipica].camps.length; i_camp++)
					{
						if(Accio.camps[i_capa_accio]==capa_consulta_tipica_intern[i_tipica].camps[i_camp].nom)
						{
							//he trobat el camp
							if(capa_consulta_tipica_intern[i_tipica].proj_camp && capa_consulta_tipica_intern[i_tipica].proj_camp[i_camp])
							{
								for(var i_valor=0; i_valor<capa_consulta_tipica_intern[i_tipica].proj_camp[i_camp].length; i_valor++)
								{
									if(Accio.valors[i_capa_accio]==capa_consulta_tipica_intern[i_tipica].proj_camp[i_camp][i_valor].valor)
									{						
										if(Accio.coord==null)
										{
											Accio.coord={"x": DonaCoordXCentralDeEnv(capa_consulta_tipica_intern[i_tipica].proj_camp[i_camp][i_valor].env),
												"y": DonaCoordYCentralDeEnv(capa_consulta_tipica_intern[i_tipica].proj_camp[i_camp][i_valor].env)};
										}						
										trobat=true;
										break;
									}
								}
								if(i_valor==capa_consulta_tipica_intern[i_tipica].proj_camp[i_camp].length && Accio.valors[i_capa_accio]!=null && Accio.valors[i_capa_accio]!="")
								{
									alert(DonaCadenaLang({"cat":"El valor "+Accio.valors[i_capa_accio]+" del camp "+Accio.camps[i_capa_accio]+" de la capa "+Accio.capes[i_capa_accio]+" és incorrecte",
													"spa":"El valor "+Accio.valors[i_capa_accio]+" del campo "+Accio.camps[i_capa_accio]+" de la capa "+Accio.capes[i_capa_accio]+" es incorrecto",
													"eng":"The value "+Accio.valors[i_capa_accio]+" of the field "+Accio.camps[i_capa_accio]+" of the layer "+Accio.capes[i_capa_accio]+" is incorrect",
													"fre":"La valeur "+Accio.valors[i_capa_accio]+" du champ "+Accio.camps[i_capa_accio]+" de la couche "+Accio.capes[i_capa_accio]+" est incorrecte"}));
								}   
							}
							break;
						}			
					}		     
					break; //aquest camp ja l'he validat i haig de passar a validar la següent capa
					//else if(i_camp==capa_consulta_tipica_intern[i_tipica].camps.length)
					//No he trobat el camp a dins de la consulta típica i per tant no he pogut validar		     
					//Si he arribat aquí és perquè el valor indicat és incorrecte, he trobat la capa però no he trobat el valor	     	    
				}
			}	      	      
		}
	}
	return trobat;
}//Fi de BuscaValorAConsultesTipiques()

function IniciaConsultesTipiques()
{
var valor;

	if(capa_consulta_tipica_intern.length>0)
	{
		//Per cada finestra de consulta típica
		for (var i_ctipica=0; i_ctipica<ParamCtrl.ConsultaTipica.length; i_ctipica++)
		{
			if (ParamCtrl.ConsultaTipica[i_ctipica].NomCapa)
			{
				for (CTipicaCapa[i_ctipica]=0; CTipicaCapa[i_ctipica]<capa_consulta_tipica_intern.length; CTipicaCapa[i_ctipica]++)
				{
					if (capa_consulta_tipica_intern[CTipicaCapa[i_ctipica]].nom==ParamCtrl.ConsultaTipica[i_ctipica].NomCapa[0])
						break;
				}
				if (CTipicaCapa[i_ctipica]==capa_consulta_tipica_intern.length)
				{
					var s=DonaCadenaLang({"cat":"La capa","spa":"La capa", "eng":"Layer", "fre":"La couche"}) + 
						ParamCtrl.ConsultaTipica[i_ctipica].NomCapa[0] +
						DonaCadenaLang({"cat":" per a mostrar al frame ", "spa":" para mostrar en el frame ", "eng":" to be shown in the frame ", "fre":" à montrer au frame "}) +
						ParamCtrl.ConsultaTipica[i_ctipica].nom + 
						DonaCadenaLang({"cat":" no és a la llista de capes amb consulta típica.", 
										"spa":" no está en la lista de capas con consulta típica.", 
										"eng":" is not in the typical query layer list.",
										"fre":" ne se trouve pas dans la liste de couches avec recherche typique."});
					alert(s);
				}
			}
			else
				CTipicaCapa[i_ctipica]=0;
		
			if (ParamCtrl.ConsultaTipica[i_ctipica].TipusConsultaTipica=="CTipicaCercador")
			{
				var i_llista=0;
				LlistaCadenes[i_ctipica]=[];
				if (ParamCtrl.ConsultaTipica[i_ctipica].NomCapa==null)
				{
					if (capa_consulta_tipica_intern.length==1)
					{
						if(capa_consulta_tipica_intern[0].id_camp)
						{							
							var i_proj=0;
							//Totes les columnnes de id_camp tenen els mateixos registres --> Per cada registre
							for (var i=0; i<capa_consulta_tipica_intern[0].id_camp[0].length; i++, i_llista++)
							{								
								//Per cada camp busco el seu valor que possarè a llista
								valor="";
								for(var j=0; j<capa_consulta_tipica_intern[0].camps.length; j++)
								{
									i_proj=capa_consulta_tipica_intern[0].id_camp[j][i].id;
									if(i_proj>=capa_consulta_tipica_intern[0].proj_camp[j].length || i_proj<0)
										alert("Error: Índex de registre de projecció incorrecte "+
											capa_consulta_tipica_intern[0].id_camp[j][i].id +
											"de camp "+ j);
									else
									{
										if(j==0)
											valor=capa_consulta_tipica_intern[0].proj_camp[j][i_proj].valor;
										else
											valor+=" (" + capa_consulta_tipica_intern[0].proj_camp[j][i_proj].valor + ")";
									}
								}
								LlistaCadenes[i_ctipica][i_llista]=valor;
							}
						}
						else
						{
							for (var i=0; i<capa_consulta_tipica_intern[0].proj_camp[0].length; i++, i_llista++)
							{
								LlistaCadenes[i_ctipica][i_llista]=capa_consulta_tipica_intern[0].proj_camp[0][i].valor;
							}
						}
					}
					else
					{
						for (var i_tipica_capa=0; i_tipica_capa<capa_consulta_tipica_intern.length; i_tipica_capa++)
						{
							if(capa_consulta_tipica_intern[i_tipica_capa].id_camp)
							{							
								var i_proj=0;
								//Totes les columnnes de id_camp tenen els mateixos registres --> Per cada registre
								for (var i=0; i<capa_consulta_tipica_intern[i_tipica_capa].id_camp[0].length; i++, i_llista++)
								{								
									//Per cada camp busco el seu valor que possarè a llista
									valor="";
									for(var j=0; j<capa_consulta_tipica_intern[i_tipica_capa].camps.length; j++)
									{
										i_proj=capa_consulta_tipica_intern[i_tipica_capa].id_camp[j][i].id;
										if(i_proj>=capa_consulta_tipica_intern[i_tipica_capa].proj_camp[j].length || i_proj<0)
											alert("Error: Índex de registre de projecció incorrecte "+
												capa_consulta_tipica_intern[i_tipica_capa].id_camp[j][i].id +
												"de camp "+ j);
										else
										{
											if(j==0)
												valor=capa_consulta_tipica_intern[i_tipica_capa].proj_camp[j][i_proj].valor;
											else
												valor+=" (" + capa_consulta_tipica_intern[i_tipica_capa].proj_camp[j][i_proj].valor + ")";
										}
									}									
									LlistaCadenes[i_ctipica][i_llista]=valor + " ("+DonaCadena(capa_consulta_tipica_intern[i_tipica_capa].camps[0].desc)+")";
								}
							}
							else
							{
								//La consulta només té un camps
								for (var i=0; i<capa_consulta_tipica_intern[i_tipica_capa].proj_camp[0].length; i++, i_llista++)
								{
									LlistaCadenes[i_ctipica][i_llista]=capa_consulta_tipica_intern[i_tipica_capa].proj_camp[0][i].valor + 
									" ("+DonaCadena(capa_consulta_tipica_intern[i_tipica_capa].camps[0].desc)+")";
								}
							}
						}
					}
				}
				else
				{
					//Per totes les capes de la finestra i_ctipica 
					for (var i_nom_capa=0; i_nom_capa<ParamCtrl.ConsultaTipica[i_ctipica].NomCapa.length; i_nom_capa++)
					{
						for (var i_tipica_capa=0; i_tipica_capa<capa_consulta_tipica_intern.length; i_tipica_capa++)
						{
							if (capa_consulta_tipica_intern[i_tipica_capa].nom==ParamCtrl.ConsultaTipica[i_ctipica].NomCapa[i_nom_capa])
								break;
						}
						if (i_tipica_capa==capa_consulta_tipica_intern.length)
						{
							var s=DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) + 
							ParamCtrl.ConsultaTipica[i_ctipica].NomCapa[i_nom_capa] +
							DonaCadenaLang({"cat":" per a mostrar al frame ", "spa":" para mostrar en el frame ", "eng":" to be shown in the frame ", "fre":" à montrer au frame "}) +
							ParamCtrl.ConsultaTipica[i_ctipica].nom + 
							DonaCadenaLang({"cat":" no és a la llista de capes amb consulta típica.", 
											"spa":" no está en la lista de capas con consulta típica.", 
											"eng":" is not in the typical query layer list.",
											"fre":" ne se trouve pas dans la liste de couches avec recherche typique."});
							alert(s);
						}
						else
						{
							if(capa_consulta_tipica_intern[i_tipica_capa].id_camp)
							{							
								//Totes les columnnes de id_camp tenen els mateixos registres --> Per cada registre
								var i_proj=0;
								for (var i=0; i<capa_consulta_tipica_intern[i_tipica_capa].id_camp[0].length; i++, i_llista++)
								{								
									//Per cada camp busco el seu valor que possarè a llista
									valor="";									
									for(var j=0; j<capa_consulta_tipica_intern[i_tipica_capa].camps.length; j++)
									{										
										i_proj=capa_consulta_tipica_intern[i_tipica_capa].id_camp[j][i].id;
										if(i_proj>=capa_consulta_tipica_intern[i_tipica_capa].proj_camp[j].length || i_proj<0)
											alert("Error: Índex de registre de projecció incorrecte "+
												capa_consulta_tipica_intern[i_tipica_capa].id_camp[j][i].id +
												"de camp "+ j);
										else
										{
											if(j==0)
											{											
												valor=capa_consulta_tipica_intern[i_tipica_capa].proj_camp[j][i_proj].valor;
											}
											else
											{
												valor+=" (" + 
												capa_consulta_tipica_intern[i_tipica_capa].proj_camp[j][i_proj].valor + 
												")";											
											}
										}
									}
									LlistaCadenes[i_ctipica][i_llista]=valor + " ("+DonaCadena(capa_consulta_tipica_intern[i_tipica_capa].camps[0].desc)+")";
								}
							}
							else
							{
								//La consulta només té un camps
								for (var i=0; i<capa_consulta_tipica_intern[i_tipica_capa].proj_camp[0].length; i++, i_llista++)
								{
									LlistaCadenes[i_ctipica][i_llista]=capa_consulta_tipica_intern[i_tipica_capa].proj_camp[0][i].valor + 
									" ("+DonaCadena(capa_consulta_tipica_intern[i_tipica_capa].camps[0].desc)+")";
								}
							}
						}
					}
				}
				IniciaLlista("AreaLlista"+i_ctipica, "llavor"+i_ctipica, i_ctipica);
			}
		}
	}
}//Fi de IniciaConsultesTipiques()

var MostraCTipiques=true;
function MostraOAmagaCtipiques()
{
	if(ParamCtrl.ConsultaTipica)
	{
		for(var i=0; i<ParamCtrl.ConsultaTipica.length; i++)
		{
			if(isFinestraLayer(window, ParamCtrl.ConsultaTipica[i].nom))
			{
				if(MostraCTipiques)
					showFinestraLayer(window, ParamCtrl.ConsultaTipica[i].nom);
				else
					hideFinestraLayer(window, ParamCtrl.ConsultaTipica[i].nom);
			}
			else
			{
				var elem=getLayer(window, ParamCtrl.ConsultaTipica[i].nom);
				if (elem)
				{
					if(MostraCTipiques)
						showLayer(elem);
					else
						hideLayer(elem);
				}
			}
		}
		MostraCTipiques=!MostraCTipiques;
	}
	return;	
}
