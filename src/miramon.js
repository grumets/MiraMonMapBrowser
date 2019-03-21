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

"use strict"

var VersioToolsMMN={"Vers": 6, "SubVers": 0, "VariantVers": null};
var clientName= "MiraMon Map Browser";

function clientFullName() { return clientName+" Navigator v."+VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers; }


function IncludeScript(url, late)   //https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
{
	var script = document.createElement("script");  // create a script DOM node

	if (late)
	{
		script.setAttributeNode(document.createAttribute("async"));
		script.setAttributeNode(document.createAttribute("defer"));
	}
	script.src = url;  // set its src to the provided URL

	document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead). Ja ho he fet.
}

IncludeScript("tools1.js");
IncludeScript("canviprj.js");
IncludeScript("ctipica.js");
IncludeScript("consult.js");
IncludeScript("consola.js");
IncludeScript("imgrle.js");
IncludeScript("vector.js");
IncludeScript("video.js");
IncludeScript("qualitat.js");
IncludeScript("cntxmenu.js");
IncludeScript("xml.js");
IncludeScript("owc_atom.js");
IncludeScript("gml.js", true);
IncludeScript("owsc.js", true);
IncludeScript("wps.js", true);
IncludeScript("wps_iso_guf.js", true);
IncludeScript("guf_locale.js", true);
IncludeScript("guf.js", true);
IncludeScript("histopie.js", true);
IncludeScript("Chart.bundle.min.js", true);
IncludeScript("moment.min.js", true);


//La paleta tableau20 surt de https://vega.github.io/vega/docs/schemes/
var PaletesTematiquesTipiques={"tableau20": ["#4c78a8", "#9ecae9", "#f58518", "#ffbf79", "#54a24b", "#88d27a", "#b79a20", "#f2cf5b", "#439894", "#83bcb6", "#e45756", "#ff9d98", "#79706e", "#bab0ac", "#d67195", "#fcbfd2", "#b279a2", "#d6a5c9", "#9e765f", "#d8b5a5"]};
var IdProces=Math.random()*100000;
var NIdProces=0;
var NConsultesZero, NConsultesDigiZero, NCapesConsultables, NCapesDigiConsultables, NCapesCTipica=0;
var i_objdigi_consulta=-1, i_objdigi_anar_coord=-1, i_objdigi_edicio=-1;
var FormAnarCoord;
var timeoutCreaVistes=null;
var Accio=null;

/* General functionality: */
function dontPropagateEvent(e)
{
	if(!e)
		e= window.event;

	//IE9 & Other Browsers
	if(e.stopPropagation)
		e.stopPropagation();
	//IE8 and Lower
	else
		e.cancelBubble= true;
}

//allows compatibility between IE8 and modern browsers
function MMgetEventButton(event)
{
	if(typeof event.which === "undefined") //IE8 http://unixpapa.com/js/mouse.html
		return {first:event.button===1,middle:event.button===4,second:event.button===2};
	else
		return {first:event.button===0,middle:event.button===1,second:event.button===2};
}
/*
 * Adds a CSS class to the given HTML element.
 * This function is required until IE10 is the target browser version for IE
 *	or a framework like jQuery is adopted.
 * 
 * @param {DOMHTMLElement} element
 * @param {String} className
 * @returns {DOMHTMLElement}
 */
function MMaddClassName(element,className)
{
	try //Because this do not work on IE9- as classList do not exist
	{
		//Standard way
		element.classList.add(className);
	}
	catch(e)
	{
		//IE9- simple fix, buggy for classNames that are partial cases of other classNames
		if(element.className.search(className)===-1)
			element.className+= " "+className;
	}
	return element;
}
function MMremoveClassName(element,className)
{
	try //Because this do not work on IE9- as classList do not exist
	{
		//Standard way
		element.classList.remove(className);
	}
	catch(e)
	{
		//IE9- simple fix, buggy for classNames that are partial cases of other classNames
		if(element.className.search(className)!==-1)
			element.className.replace(" "+className,"");
	}
	return element;
}
/* End of General functionality functions. */

/* End of general javascript objects prototype modifications */

/* DOM extensions*/
/*
 * Gets a DOM NodeList and filters out the nodes that do not have as direct
 * parent the 2nd argument node. Returns an array of nodes.
 * In case there is no Node meeting the condition, it returns a 0 length Array.
 * @param {NodeList} thisNodeList
 * @param {Node} theParent
 * @returns {Array}
 */
function MMnodeListFilterByParent(thisNodeList,theParent)
{
	var retNodes= [];

	if(thisNodeList)
	{
		for(var i=0;i<thisNodeList.length;i++)
		{
			if(thisNodeList[i].parentNode===theParent)
				retNodes[retNodes.length]= thisNodeList[i];
		}
	}
	return retNodes;
}

/*
 * Creates a new DOM element appended to an existing one, and sets its text value.
 *
 * @param {DOMParser} The DOM XML Document
 * @param {XMLElement} Parent element for the new one
 * @param {string} name of the new node
 * @param {string} text value of the new node (maybe null)
 * @returns {XMLElement} Node element created
 */
function MMaddElement(xmlobject,parent,name,value,namespace)
{
	var elem;

	if(xmlobject.createElementNS)
	{
		if(!namespace)
			namespace= parent.namespaceURI;
		elem= xmlobject.createElementNS(namespace,name);	
	}
	else
		elem= xmlobject.createElement(name);

	parent.appendChild(elem);
	if(value)
		elem.appendChild(xmlobject.createTextNode(value));

	return elem;
}
/* End of DOM extensions*/

/*
 * Search for accessKeys on the lement and all children recursively and sets some
 * strategies for the user to get to know about the accessKey. More precisely,
 * it currently adds the accessKey to the element tooltip through the title tag.
 * 
 * @param {DOMHTMLElement} DOMElement
 */
function MMhighlightAccessKeys(DOMElement)
{
var elems= DOMElement.children,
	length= elems.length;
	for(var i=0;i<length;i++)
	{
		//In case the element has an accessKey defined, give a way for the user to discover it
		if(elems[i].accessKey)
		{
			if(elems[i].title)
				elems[i].title+= " (Alt+"+elems[i].accessKey.toUpperCase()+")";
			else
				elems[i].title= "(Alt+"+elems[i].accessKey.toUpperCase()+")";
		}
		//Recursively access to all elements
		if(elems[i].children.length)
			MMhighlightAccessKeys(elems[i]);
	}
}

function DonaServidorCapa(s)
{
	if (s==null)
		return ParamCtrl.ServidorLocal;
	return s;
}

function DonaVersioServidorCapa(s)
{
	if (s==null)
		return ParamCtrl.VersioServidorLocal;
	return s;
}

function DonaTipusServidorCapa(s)
{
	if (s==null)
		return ParamCtrl.TipusServidorLocal;
	return s;
}

function MostraEnllacWMS(finestra)
{
	showFinestraLayer(window, finestra);
}

function AmagaLayerMissatges()
{
	hideLayer(getLayer(window,"missatges"));
}

/*

// Tot aquest codi sembla no usar-se mai i per això el deixo comentat aquí 2018-01-04 (JM)
var estat_pendent=0x0001;
var estat_fi_exit=0x0002;
var estat_fi_error=0x0004;

var tipus_insert=0x0001;

function CreaTransaccio(i_capa, tipus, estat, win)
{
	this.i_capa=i_capa;
	this.tipus=tipus;
	this.estat=estat;
	this.text="";
	this.win=win;
}

var i_transaccio=0;
var transaccio=[];

function AvaluaRespostaTransaccio(doc)
{
var root;
var elem;
var trans_actual;

	if(!doc) return;	
	root=doc.documentElement;
	
	if(!root) return;
	
	elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "totalInserted");
	if(elem==null) return;

	if(parseInt(elem[0].childNodes[0].nodeValue,10)==1)
	{
		//Llegeix-ho la info, agafo l'identificador i faig un GetFeature d'aquest nou element
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "Feature");
		var i_trans=parseInt(elem[0].getAttribute('handle'),10);
		trans_actual=transaccio[i_trans];
		trans_actual.estat=estat_fi_exit;
		
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/ogc", "ogc", "FeatureId");
		var identificador=[];
		identificador.push(elem[0].getAttribute('fid'));		
		
		//Faig la petició GetFeature
		FesPeticioAjaxObjectesDigitalitzatsPerIdentificador(trans_actual.i_capa, identificador, false);		
		var mis=getLayer(trans_actual.win, "missatges");
		if(mis)
		{
			classLayer(mis, "mistrans");
			contentLayer(mis, "La transacció d'inserció \""+i_trans+ "\" de l'element \""+
						 	   identificador+"\" de la capa \""+ParamCtrl.capa[trans_actual.i_capa].nom+
							   "\" ha finalitzat amb èxit.") ;			
			showLayer(mis);
			setTimeout("AmagaLayerMissatges();",5000); 	
		}
		return;
	}
	else
	{
		
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "Action");
		var i_trans=parseInt(elem[0].getAttribute('locator'),10);
		trans_actual=transaccio[i_trans];
		trans_actual.estat=estat_fi_error;
		elem=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengis.net/wfs", "wfs", "Message");
		var mis=getLayer(trans_actual.win, "missatges");
		if(mis)
		{
			classLayer(mis, "mistrans");
			contentLayer(mis, "La transacció d'inserció \""+i_trans+ "\" d'un element de la capa \""+ParamCtrl.capa[trans_actual.i_capa].nom+
							   "\" NO ha estat finalitzat amb èxit."+((elem && elem[0].childNodes[0].nodeValue) ? ("\n"+elem[0].childNodes[0].nodeValue) : ""));			
			showLayer(mis);
			setTimeout("AmagaLayerMissatges();",5000); 	
		}
		return;
	}					 	
}//Fi de AvaluaRespostaTransaccio()
*/

function DonaNomServidorCaracterFinal(s)
{
	if (s.charAt(s.length-1)=="?" || s.charAt(s.length-1)=="&")
		return s;
	if (s.indexOf("?")==-1)
		s+="?";
	else
		s+="&";
	return s;
}

function DonaNomServidorSenseCaracterFinal(s)
{
	if (s.charAt(s.length-1)=="?" || s.charAt(s.length-1)=="&")
		return s.substring(0,s.length-1);
	else
		return s;
}

function DonaVersioComAText(v)
{
    return v.Vers+"."+v.SubVers+"."+v.VariantVers;
}

function DonaVersioPerNameSpaceComAText(v)
{
    return v.Vers+"."+v.SubVers;
}


var plantilla_dimpressio_intern=[];

/* Aquest constructor no s'usa i es deixa només com a documentació del JSON
function CreaPlantillaDImpressioLayerPropiaIntern(visible, rect, contingut, i_layer)
{
	this.visible = visible;
	this.rect = rect;
	this.contingut = contingut;
	this.ILayer = i_layer;
}*/

function IniciaLayerPropiaPlantillaDImpressio(i_plantilla, i_layer_propia,
						visible,
						rect_esq, rect_sup, rect_ample, rect_alt,
						contingut,
						i_layer)
{
	plantilla_dimpressio_intern[i_plantilla].LayersPropies[i_layer_propia] = 
						{"visible": visible, 
						"rect": {"esq": rect_esq, "sup": rect_sup, "ample": rect_ample, "alt": rect_alt},
						"contingut": contingut,
						"ILayer": i_layer};
}

function CompletaDefinicioCapa(capa, capa_especial)
{	
	//Càlcul de la envolupant el·lipsoidal
	if (capa.EnvTotal && capa.EnvTotal.EnvCRS)
		capa.EnvTotalLL=DonaEnvolupantLongLat(capa.EnvTotal.EnvCRS, capa.EnvTotal.CRS);

	if (!capa.CostatMinim)
		capa.CostatMinim=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
	if (!capa.CostatMaxim)
		capa.CostatMaxim=ParamCtrl.zoom[0].costat;

	if (typeof capa.VisibleALaLlegenda==="undefined" || capa.VisibleALaLlegenda==null)
		capa.VisibleALaLlegenda=true;

	if (typeof capa.visible==="undefined" || capa.visible==null)
		capa.visible="si";

	if (typeof capa.consultable==="undefined" || capa.consultable==null)
		capa.consultable="si";

	if (!capa.descarregable)
		capa.descarregable="no";

	//Evito haver de posar el nom i la descripció del video si la capa és animable sola.
	if (capa.animable && capa.AnimableMultiTime && capa.data && capa.data.length>1)
	{
		if (!capa.NomVideo)
			capa.NomVideo=capa.nom;
		if (!capa.DescVideo)
			capa.DescVideo=JSON.parse(JSON.stringify(capa.desc));
	}

	if (DonaTipusServidorCapa(capa.tipus)=="TipusWMS_C" || DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_REST" || DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_KVP" || 
		DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_SOAP" /*|| capa.tipus=="TipusGoogle_KVP"*/)
	{
		//ParamCtrl.VistaCapaTiled[i]=new CreaParametresVistaCapaTiled(null, 0, 0, 0, 0, 0, 0);
		capa.VistaCapaTiled={"TileMatrix": null, "ITileMin": 0, "ITileMax": 0, "JTileMin": 0, "JTileMax": 0, "dx": 0, "dy": 0};
	}

	if (capa.tipus=="TipusWFS" || capa.tipus=="TipusSOS" || (capa.objectes && capa.objectes.features))
		capa.model=model_vector;

	if (!capa_especial)
	{
		if (capa.model==model_vector)
		{
			if (!capa.CRSgeometry)
				capa.CRSgeometry=ParamCtrl.ImatgeSituacio[0].EnvTotal.CRS;
			InicialitzaTilesSolicitatsCapaDigi(capa);				
	
			if(capa.CRSgeometry.toUpperCase()!=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase() && capa.objectes && capa.objectes.features)
			{
				for(var j=0; j<capa.objectes.features.length; j++)
				{
					capa.objectes.features[j].puntCRSactual=[];
					capa.objectes.features[j].puntCRSactual[0]={"x": capa.objectes.features[j].geometry.coordinates[0], 
													"y": capa.objectes.features[j].geometry.coordinates[1]};
					TransformaCoordenadesPunt(capa.objectes.features[j].puntCRSactual[0], capa.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
				}
			}
		}
		
	}
	if (capa.model==model_vector)
		CarregaSimbolsEstilActualCapaDigi(capa);
}

function CompletaDefinicioCapes()
{
	for (var i=0; i<ParamCtrl.capa.length; i++)
		CompletaDefinicioCapa(ParamCtrl.capa[i], EsIndexCapaEspecial(i));
}


/* Aquest constructor no s'usa i es deixa només com a documentació del JSON
function CreaPlantillaDImpressioIntern(cal_imprimir, rect_titol, rect_vista, rect_situacio, rect_llegenda, rect_escala, layers_propies)
{
	this.CalImprimir = cal_imprimir;
	this.RectTitol = rect_titol;
	this.RectVista = rect_vista;
	this.RectEscala = rect_escala;
	this.RectLlegenda = rect_llegenda;
	this.RectSituacio = rect_situacio;
	this.LayersPropies = layers_propies;
}}*/

function TreuCometesDePrincipiIFinalDeCadena(cadena)
{		
var llav="";
	llav=llavor;
	if(llav.substring(0,1)=="\"" || llav.substring(0,1)=="'")
		llav=llav.substring(1,llav.length);
	if(llav.substring(llav.length-1, llav.length)=="\"" || llav.substring(llav.length-1, llav.length)=="'")
		llav=llav.substring(0,llav.length-1);
	return llav;
}

var ActualitzaLlistaMinimitzaVisu=true;  //Minimitza el nombre de vegades que es mostra la llista.


function DonaCadenaSenzilla(s)
{
//var LletresComplexes="àéèíóòúçÀÉÈÍÓÒÚÇïüÏÜ·ñáÑÁäãâåëêìîöôõùûÄÃÂÅËÊÌÎÖÔÕÙÛÿýÝðÐ";
//var LletresSenzilles="aeeiooucAEEIOOUCiuIU.naNAaaaaeeiiooouuAAAAEEIIOOOUUyyYdD";
var LletresComplexes="àéèíóòúçïü·áäãâåëêìîöôõùûÿýð";
var LletresSenzilles="aeeioouciu.aaaaaeeiiooouuyyd";
var s_low=s.toLowerCase();
var caracter;
var s_sortida="";
var k;

	/*Elimino el cas difícil de la ñ
	while (true)
	{
		k=s_low.indexOf("ñ");
		if (k==-1)
			break;
		else
			s_low=s_low.substring(0, k) + "ny" + s_low.substring(k+1,s_low.length);
	}*/

	for (var i=0; i<s_low.length; i++)
	{
		caracter=s_low.charAt(i);
		k=LletresComplexes.indexOf(caracter);
		if (k==-1)
			s_sortida+=caracter;
		else
			s_sortida+=LletresSenzilles.charAt(k);
	}

	/*Elimino el cas difícil de la l.l
	while (true)
	{
		k=s_sortida.indexOf("l.l");
		if (k==-1)
			break;
		else
			s_sortida=s_sortida.substring(0, k) + "l" + s_sortida.substring(k+3,s_sortida.length);
	}*/

	return s_sortida;
}


//////////////////////////////////////////////////////////////////////////
/*Funcions de Navegador de Mapes del MiraMon.*/

//S'usa per a les variables de l'estructura ParamCtrl. Suporta una cadena normal o una cadena multiidioma tipus {"cat": "sí", "spa": "sí", "eng": "yes", "fre": "oui"}

function ConcatenaCadenes(cadena1, cadena2)
{
var a={};
	
	if (cadena1==null && cadena2==null)
		return "";
	if(typeof cadena1!=="object" && typeof cadena2!=="object")
	{
		a=(cadena1?cadena1: "")+(cadena2?cadena2:"");
		return a;
	}
	// O un o l'altre són una cadena multidioma
	if(typeof cadena1==="object")
	{
		if(typeof cadena1.cat!=="undefined")	
			a.cat=cadena1.cat;
		if(typeof cadena1.spa!=="undefined")	
			a.spa=cadena1.spa;
		if(typeof cadena1.eng!=="undefined")	
			a.eng=cadena1.eng;
		if(typeof cadena1.fre!=="undefined")	
			a.fre=cadena1.fre;
		if(typeof cadena2==="object")
		{
			if(typeof cadena2.cat!=="undefined")	
			{
				if(typeof a.cat==="undefined" || !a.cat)
					a.cat=cadena2.cat;
				else
					a.cat+=(cadena2.cat?cadena2.cat:"");
			}
			if(typeof cadena2.spa!=="undefined")	
			{
				if(typeof a.spa==="undefined" || !a.spa)
					a.spa=cadena2.spa;
				else
					a.spa+=(cadena2.spa?cadena2.spa:"");
			}
			if(typeof cadena2.eng!=="undefined")	
			{
				if(typeof a.eng==="undefined" || !a.eng)
					a.eng=cadena2.eng;
				else
					a.eng+=(cadena2.eng?cadena2.eng:"");
			}
			if(typeof cadena2.fre!=="undefined")	
			{
				if(typeof a.fre==="undefined" || !a.fre)
					a.fre=cadena2.fre;
				else
					a.fre+=(cadena2.fre?cadena2.fre:"");
			}
		}
		else if(cadena2)
		{
			if(typeof a.cat==="undefined" || !a.cat)
				a.cat=cadena2;
			else
				a.cat+=cadena2;
			if(typeof a.spa==="undefined" || !a.spa)
				a.spa=cadena2;
			else
				a.spa=a.spa+cadena2;
			if(typeof a.eng==="undefined" || !a.eng)
				a.eng=cadena2
			else
				a.eng+=cadena2;
			if(typeof a.fre==="undefined" || !a.fre)
				a.fre=cadena2;
			else
				a.fre+=cadena2;
		}
	}
	else if(cadena1)
	{		
		// cadena2 ha de ser un objecte sinó hauria sortit per la segona condició, en la que totes dues no són un objecte
		if(typeof cadena2.cat!=="undefined")	
			a.cat=cadena1 + (cadena2.cat?cadena2.cat:"");
		if(typeof cadena2.spa!=="undefined")	
			a.spa=cadena1 + (cadena2.spa?cadena2.spa:"");
		if(typeof cadena2.eng!=="undefined")	
			a.eng=cadena1 + (cadena2.eng?cadena2.eng:"");
		if(typeof cadena2.fre!=="undefined")	
			a.fre=cadena1 + (cadena2.fre?cadena2.fre:"");		
	}
	else
	{
		// cadena2 ha de ser un objecte sinó hauria sortit per la segona condició, en la que totes dues no són un objecte
		if(typeof cadena2.cat!=="undefined")	
			a.cat=cadena2.cat;
		if(typeof cadena2.spa!=="undefined")	
			a.spa=cadena2.spa;
		if(typeof cadena2.eng!=="undefined")	
			a.eng=cadena2.eng;
		if(typeof cadena2.fre!=="undefined")	
			a.fre=cadena2.fre;
	}
	return a;	
}

function DonaCadena(a)
{
	if (a==null || ParamCtrl.idioma==null)
		return a;

	if (a.cat && ParamCtrl.idioma=="cat")
		return a.cat;
	if (a.spa && ParamCtrl.idioma=="spa")
		return a.spa;
	if (a.eng && ParamCtrl.idioma=="eng")
		return a.eng;
	if (a.fre && ParamCtrl.idioma=="fre")
		return a.fre;
	if (a.eng)   //Si no hi ha l'idioma solicitat faig que xerri en anglès
		return a.eng;  

	if (a.cat==null && a.spa==null && a.eng==null && a.fre==null)  //Cas de cadena no multiidioma
		return a;
	return null;
}

function DonaCadenaConcret(a, idioma)
{
	if (idioma=="cat" && a!=null && a.cat!=null)
		return a.cat;
	if (idioma=="spa" && a!=null && a.spa!=null)
		return a.spa;
	if (idioma=="eng" && a!=null && a.eng!=null)
		return a.eng;
	if (idioma=="fre" && a!=null && a.fre!=null)
		return a.fre;
	return a;
}



/* Es substitueix aquesta funció pe DonaCadenaLang al 
	canviar a l'implementació JSON.
function DonaCadena4(cat,spa,eng,fre)
{
	if (ParamCtrl.idioma)
	{	
		if (ParamCtrl.idioma=="cat")
			return cat;
		if (ParamCtrl.idioma=="spa")
			return spa;
		if (ParamCtrl.idioma=="eng")
			return eng;
		if (ParamCtrl.idioma=="fre")
			return fre;
	}
	return eng;
}*/

//S'usa per cadenes definides estàticament definides així: DonaCadenaLang({"cat": "sí", "spa": "sí", "eng": "yes", "fre": "oui"});
function DonaCadenaLang(cadena_lang)
{
	if(cadena_lang)
	{
		switch(ParamCtrl.idioma)
		{	
			case "cat":
				return cadena_lang.cat;
			case "spa":
				return cadena_lang.spa;
			default:     //Si no hi ha l'idioma solicitat faig que xerri en anglès
			case "eng":
				return cadena_lang.eng;
			case "fre":
				return cadena_lang.fre;
		}
	}
	return "";
}

function getISOLanguageTag(language)
{
	if(!language)
		language= ParamCtrl.idioma;
	switch(language)
	{
		case "cat": return "ca";
		case "spa": return "es";
		case "eng": return "en";
		case "fre": return "fr";
	}
	return "";
}

function AfegeixNomServidorARequest(servidor, request, es_ajax)
{
	if (es_ajax && location.host && DonaHost(servidor).toLowerCase()!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
	{
		var s_host=DonaHost(ParamCtrl.ServidorLocal);
		var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
		if (s_host.toLowerCase()!=location.host.toLowerCase())
		{
			//Canvio l'arrel del servidor local per l'arrel de la plana del navegador per estar segur que l'ajax funcionarà sense "cross server vulmerability".
			return DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal.substring(0,pos_host)+location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length)) + request + "&ServerToRequest="+DonaNomServidorSenseCaracterFinal(servidor);
		}
		return DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal) + request + "&ServerToRequest="+DonaNomServidorSenseCaracterFinal(servidor);
	}
	return DonaNomServidorCaracterFinal(servidor) + request;
}

function CreaTitolNavegador()
{
	if(ParamCtrl.TitolNavegador)
	{
		var nom_layer;
		if(ParamCtrl.TitolNavegador.layer)
			nom_layer=ParamCtrl.TitolNavegador.layer;
		else
			nom_layer="titol";			
		var elem=getLayer(window, nom_layer);
		if(elem && isLayer(elem))
			contentLayer(elem, DonaCadena(ParamCtrl.TitolNavegador.text)); 	
	}
}

function CanviaIdioma(s)
{
	ParamCtrl.idioma=s;
	parent.document.title=DonaCadena(ParamCtrl.titol);
	CreaTitolNavegador();
	CreaLlegenda();

	if (ParamCtrl.ConsultaTipica && capa_consulta_tipica_intern.length>0 && NCapesCTipica==capa_consulta_tipica_intern.length)
	{
		IniciaConsultesTipiques();
		CreaConsultesTipiques();
	}
	CreaBarra(null);
	CreaCoordenades();

	for (var i=0; i<layerFinestraList.length; i++)
	{
		if (layerFinestraList[i].nom)
			OmpleBarraFinestraLayer(window, i); 
	}
	for (var i=0; i<layerList.length; i++)
	{		
		if(layerList[i].contingut!=null)
			contentLayer(getLayer(window, layerList[i].nom), DonaCadena(layerList[i].contingut));
	}
	var elem=getLayer(window, "multi_consulta_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		CreaConsulta(window, 0);

	elem=getLayer(window, "executarProces_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("executarProces");  //Em falta un parametre per iniciar-la IniciaFinestraExecutaProcesCapa(i_capa);

	elem=getLayer(window, "afegirCapa_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("afegirCapa");  //Em falta una parametre per iniciar-la IniciaFinestraAfegeixCapaServidor(i_capa);

	elem=getLayer(window, "seleccioCondicional_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("seleccioCondicional");  //Em falta una parametre per iniciar-la ObreFinestraSeleccioCondicional(i_capa);

	elem=getLayer(window, "combinacioRGB_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("combinacioRGB"); //Em falta una parametre per iniciar-la 

	elem=getLayer(window, "anarCoord_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraAnarCoordenada();

	elem=getLayer(window, "multi_consulta_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("multi_consulta");

	elem=getLayer(window, "param_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraParametres();

	elem=getLayer(window, "download_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraDownload();

	elem=getLayer(window, "video_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		MostraFinestraVideo();

	elem=getLayer(window, "consola_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraConsola();

	elem=getLayer(window, "enllac");
	if(isLayer(elem) && isLayerVisible(elem))
		MostraFinestraEnllac();

	elem=getLayer(window, "enllacWMS");
	if(isLayer(elem) && isLayerVisible(elem))
		MostraFinestraEnllacWMS();

	/*elem=getLayer(window, "inserta_finestra");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraInserta(elem);*/
}

function DonaIndexNivellZoom(costat)
{
	for (var i=0; i<ParamCtrl.zoom.length; i++)
	{
		if (ParamCtrl.zoom[i].costat>costat*0.9999 && ParamCtrl.zoom[i].costat<costat*1.0001)
			return i;
	}
	return 0;
}

/*Dona el costat de píxel igual o immediatament inferior al demanat o -1.
function DonaIndexNivellZoomFloor(costat)
{
    for (var i=0; i<ParamCtrl.zoom.length; i++)
    {
	if (ParamCtrl.zoom[i].costat>costat*0.9999 && ParamCtrl.zoom[i].costat<costat*1.0001)
	    return i;
    }
    var d=costat-ParamCtrl.zoom[0].costat;
    var d_min=d;
    var i_retorn=((d_min>0) ? 0 : -1);
    for (var i=1; i<ParamCtrl.zoom.length; i++)
    {
	d=costat-ParamCtrl.zoom[i].costat;
	if (d>0)
	{
	    if (d_min>0)
	    {
	        if (d<d_min)
	        {
		    d_min=d;
		    i_retorn=i;
		}
	    }
	    else
	    {
		d_min=d;
		i_retorn=i;
	    }
	}
    }
    return i_retorn;
}*/

//Dona el costat de píxel igual o immediatament superior al demanat o -1.
function DonaIndexNivellZoomCeil(costat)
{
    for (var i=0; i<ParamCtrl.zoom.length; i++)
    {
		if (ParamCtrl.zoom[i].costat>costat*0.9999 && ParamCtrl.zoom[i].costat<costat*1.0001)
		    return i;
    }
    var d=ParamCtrl.zoom[0].costat-costat;
    var d_min=d;
    var i_retorn=((d_min>0) ? 0 : -1);
    for (var i=1; i<ParamCtrl.zoom.length; i++)
    {
		d=ParamCtrl.zoom[i].costat-costat;
		if (d>0)
		{
		    if (d_min>0)
	    	{
	        	if (d<d_min)
		        {
				    d_min=d;
				    i_retorn=i;
				}
		    }
		    else
	    	{
				d_min=d;
				i_retorn=i;
		    }
		}
    }
    return i_retorn;
}


function DonaIndexTileMatrixSetCRS(i_capa, crs)
{
	if(ParamCtrl.capa[i_capa].TileMatrixSet)
	{
		for (var i=0; i<ParamCtrl.capa[i_capa].TileMatrixSet.length; i++)
		{
			if (ParamCtrl.capa[i_capa].TileMatrixSet[i].CRS && ParamCtrl.capa[i_capa].TileMatrixSet[i].CRS.toUpperCase()==crs.toUpperCase())
				return i;
		}
	}
	return -1;
}

function DonaIndexTileMatrix(i_capa, i_tile_matrix_set, costat)
{
	for (var i=0; i<ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix.length; i++)
	{
		if (ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i].costat>costat*0.9999 && ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i].costat<costat*1.0001)
			return i;
	}
	return -1;
}


function GuardaVistaPrevia()
{
	if (ParamInternCtrl.NZoomPreviUsat==ParamInternCtrl.ZoomPrevi.length)
	{
		for (var i=1; i<ParamInternCtrl.ZoomPrevi.length; i++)
		{
			ParamInternCtrl.ZoomPrevi[i-1].costat=ParamInternCtrl.ZoomPrevi[i].costat;
			ParamInternCtrl.ZoomPrevi[i-1].PuntOri.x=ParamInternCtrl.ZoomPrevi[i].PuntOri.x;
			ParamInternCtrl.ZoomPrevi[i-1].PuntOri.y=ParamInternCtrl.ZoomPrevi[i].PuntOri.y;
			ParamInternCtrl.ZoomPrevi[i-1].ISituacio=ParamInternCtrl.ZoomPrevi[i].ISituacio;
		}
		ParamInternCtrl.NZoomPreviUsat--;
	}
	ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].costat=ParamInternCtrl.vista.CostatZoomActual;
	ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].PuntOri.x=ParamInternCtrl.PuntOri.x;
	ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].PuntOri.y=ParamInternCtrl.PuntOri.y;
	ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].ISituacio=ParamInternCtrl.ISituacio;
	ParamInternCtrl.NZoomPreviUsat++;
}

function EsCapaDinsRangDEscalesVisibles(capa)
{
	if (capa.CostatMinim<=ParamInternCtrl.vista.CostatZoomActual && 
		capa.CostatMaxim>=ParamInternCtrl.vista.CostatZoomActual)
	{
		return true;
	}
	return false;
}

//Aquesta funció ara caldrà usar-la cada vegada que es canvii l'estat de visibilitat d'una capa
function CanviaEstatVisibleISiCalDescarregableCapa(i_capa, nou_estat)
{
	if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)
	{
		if( (nou_estat=="si" || nou_estat=="semitransparent") && ParamCtrl.capa[i_capa].descarregable=="ara_no")
			ParamCtrl.capa[i_capa].descarregable="si";
		else if((nou_estat=="no" || nou_estat=="ara_no") && ParamCtrl.capa[i_capa].descarregable=="si")
			ParamCtrl.capa[i_capa].descarregable="ara_no";			
	}
	ParamCtrl.capa[i_capa].visible=nou_estat;
}

function RevisaEstatsCapes()
{
var capa, capa2;
	//De moment només revisa que en un grup la capa activa no estigui oculta.
	//Si està oculta i una altre capa del grup és visible, aquesta queda activada.
	if (ParamCtrl.LlegendaAmagaSegonsEscala==true || ParamCtrl.LlegendaGrisSegonsEscala==true)
	{
		for (var i=0; i<ParamCtrl.capa.length; i++)
		{
			capa=ParamCtrl.capa[i];
			if (!capa.VisibleALaLlegenda)
				continue;
			if ((!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa)) && 
			    (capa.visible=="si" || capa.visible=="semitransparent") && capa.grup!=null && capa.grup!="")
			{
				for (var j=0; j<ParamCtrl.capa.length; j++)
				{
					capa2=ParamCtrl.capa[j];
					if (j==i || capa2.grup==null || capa2.grup!=capa.grup)
						continue;
					if (EsCapaDinsRangDEscalesVisibles(capa2) && EsCapaDinsAmbitActual(capa2) && EsCapaDisponibleEnElCRSActual(capa2) && 
					    capa2.visible=="ara_no")
					{
						CanviaEstatVisibleISiCalDescarregableCapa(j, capa.visible);
						CanviaEstatVisibleISiCalDescarregableCapa(i, "ara_no");
					}
				}
			}
		}
	}
}

function RecuperaVistaPrevia()
{
	if (ParamInternCtrl.NZoomPreviUsat)
	{
		ParamInternCtrl.NZoomPreviUsat--;
		if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toLowerCase()!=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].ISituacio].EnvTotal.CRS.toLowerCase())
			CanviaCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].ISituacio].EnvTotal.CRS);
		ParamInternCtrl.ISituacio=ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].ISituacio;
		if(ParamCtrl.FuncioCanviProjeccio)
			eval(ParamCtrl.FuncioCanviProjeccio);
		ParamInternCtrl.PuntOri.x=ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].PuntOri.x;
		ParamInternCtrl.PuntOri.y=ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].PuntOri.y;
		if (ParamInternCtrl.vista.CostatZoomActual!=ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].costat)
		{
			ParamInternCtrl.vista.CostatZoomActual=ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].costat;
			RevisaEstatsCapes();
			CreaLlegenda();
		}
		if (window.document.zoom.nivell)
			window.document.zoom.nivell.selectedIndex = DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual);
		if (ParamCtrl.ConsultaTipica)
			PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
		RepintaMapesIVistes();
	}
	else
	{
		alert(DonaCadenaLang({"cat":"No hi ha cap vista prèvia a recuperar.", "spa":"No hay ninguna vista previa a recuperar.", 
							  "eng":"There is no previous view to be shown.", "fre":"Il n'y a pas une vue préalable à récupérer."}));
	}
}
function RecuperaVistaPreviaEvent(event) // Afegit Cristian 19/01/2016
{
	RecuperaVistaPrevia();
	dontPropagateEvent(event);
}

function ShaObertPopUp(wnd)
{
	if (wnd==null)
	{
	    alert(DonaCadenaLang({"cat":"Aquest navegador té les finestres emergents bloquejades. Canvia la configuració del teu navegador.\nEn algunes versions d'Internet Explorer, només cal fer un clic sobre la faixa groga superior.", 
							  "spa":"Este navegador tiene las ventanas emergentes bloqueadas. Modifique la configuración de su navegador.\nEn algunas versiones de Internet Explorer, un clic sobre la banda amarilla superior es suficiente.", 
							  "eng":"Sorry, this browser has pop-up windows locked. Please change browser configuration.\nIn some Internet Explorer versions only a click on top yellow band will fix it.",
							  "fre":"Ce navigateur a les fenêtres émergentes fermées. Changez la configuration de votre navigateur.\nDans certaines versions d'Internet Explorer, il suffit de cliquer sur la barre jaune supérieure."}));
	    return false;
	}
	return true;
}

/*var ParametresWindow=null;
function ObreFinestraParametres()
{
    if (ParametresWindow==null || ParametresWindow.closed)
    {
        ParametresWindow=window.open("param.htm","FinestraParam",'toolbar=no,status=yes,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=430,height=400');
		ShaObertPopUp(ParametresWindow);
    }
    else
        ParametresWindow.focus();
}*/

function RedibuixaParamColors()
{
	contentLayer(getLayer(window, "param_colors"), DonaTextParamColors());
}

var param_ColorFonsVista;  //Copia de la variable local a la caixa de paràmetres
var param_ColorQuadratSituacio; //Copia de la variable local a la caixa de paràmetres

function DonaTextParamColors()
{
var cdns=[];
	cdns.push(
		"<table class=\"Verdana11px\" border=0 cellspacing=0 cellpadding=0>",
               "<tr>",
	           "<td>", DonaCadenaLang({"cat":"Color de fons de la vista", "spa":"Color de fondo de la vista", "eng":"View area background color", "fre":"Couleur du fond"}) ,": </td>",
	           "<td bgcolor=",param_ColorFonsVista,"><img src=1tran.gif height=6 width=20></td>",
                   "<td>&nbsp;<button onClick=\"return ObreFinestraColors('param_ColorFonsVista', '", DonaCadenaLang({"cat":"Color de fons de la vista", "spa":"Color de fondo de la vista", "eng":"View area background color", "fre":"Couleur du fond"}) ,"');\"><img align=middle src=colors.gif></button></td>",
		"</tr>",
               "<tr>",
	           "<td colspan=3><img src=1tran.gif height=1 width=2></td>",
			   "</tr>",
			   "<tr>",
	           "<td>", DonaCadenaLang({"cat":"Color del quadrat de situació", "spa":"Color del cuadrado de situación", "eng":"Situation square color", "fre":"Couleur du carré de situation"}), ":&nbsp;&nbsp; </td>",
	           "<td bgcolor=",param_ColorQuadratSituacio,"><img src=1tran.gif height=6 width=20></td>",
                   "<td>&nbsp;<button onClick=\"return ObreFinestraColors('param_ColorQuadratSituacio', '", DonaCadenaLang({"cat":"Color del quadrat de situació", "spa":"Color del cuadrado de situación", "eng":"Situation square color", "fre":"Couleur du carré de situation"}) ,"');\"><img align=middle src=colors.gif></button></td>",
               "</tr></table>");
	return cdns.join("");
}

var ColorWindow=null;
var CadenaVariableTreball="";
var TextDescDelColor="";

function ObreFinestraColors(s,text)
{
	CadenaVariableTreball=s;
	TextDescDelColor=text;
	if (ColorWindow==null || ColorWindow.closed)
	{
		ColorWindow=window.open("colors.htm","FinestraColors",'toolbar=no,status=yes,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=500,height=200');
		ShaObertPopUp(ColorWindow);
	}
	else
	    ColorWindow.focus();
	return false;
}

function RecuperaValorsFinestraParametres(formul, tancar)
{
	if (MidaDePixelPantalla!=parseFloat(formul.param_MidaAmplePantalla.value)/ParamInternCtrl.vista.ncol);
	{
	    MidaDePixelPantalla=parseFloat(formul.param_MidaAmplePantalla.value)/ParamInternCtrl.vista.ncol;
		CreaBarra(null);
	}
	ParamCtrl.psalt=parseInt(formul.param_psalt.value,10);
	ParamCtrl.ColorFonsVista=param_ColorFonsVista;
	ParamCtrl.ColorQuadratSituacio=param_ColorQuadratSituacio;
	ParamCtrl.NDecimalsCoordXY=parseInt(formul.param_NDecimalsCoordXY.value,10);
	if (formul.param_CoordExtremes[1].checked)
		ParamCtrl.CoordExtremes="proj";
	else if (formul.param_CoordExtremes[2].checked)
	{
		if (formul.param_CoordExtremesGMS.checked)
			ParamCtrl.CoordExtremes="longlat_gms";
		else
			ParamCtrl.CoordExtremes="longlat_g";
	}
	else
	{
	    delete ParamCtrl.CoordExtremes; 
	}
	if (formul.param_CoordActualProj.checked)
		ParamCtrl.CoordActualProj=true;
	else 
		ParamCtrl.CoordActualProj=false;
	if (formul.param_CoordActualLongLat.checked)
	{
		ParamCtrl.CoordActualLongLatG=true;
		if (formul.param_CoordActualGMS.checked)
			ParamCtrl.CoordActualLongLatGMS=true;
		else
			ParamCtrl.CoordActualLongLatGMS=false;
	}
	else
	{
		ParamCtrl.CoordActualLongLatG=false;
		ParamCtrl.CoordActualLongLatGMS=false;
	}

	if (formul.param_ZoomUnSolClic[1].checked)
		ParamCtrl.ZoomUnSolClic=true;
	else
		ParamCtrl.ZoomUnSolClic=false;

	GuardaVistaPrevia();
	//ActualitzaEnvParametresDeControl();
	RepintaMapesIVistes();
	if (tancar==true)
		TancaFinestraLayer("param");
	
    return false;  //per no efectuar l'acció de submit del formulari
}

function OmpleFinestraParametres()
{
var cdns=[];

	param_ColorFonsVista=ParamCtrl.ColorFonsVista;
	param_ColorQuadratSituacio=ParamCtrl.ColorQuadratSituacio;

	cdns.push("<form name=\"form_param\" onSubmit=\"return false;\"><div class=\"Verdana11px\">");
	cdns.push(DonaCadenaLang({"cat":"Punt origen central","spa":"Punto origen central", "eng":"Origin central point", "fre":"Point origine central"}),":  x:", OKStrOfNe(ParamCtrl.PuntOri.x, ParamCtrl.NDecimalsCoordXY),
				  " y: " + OKStrOfNe(ParamCtrl.PuntOri.y, ParamCtrl.NDecimalsCoordXY) + "<br>",
		"<small>", DonaCadenaLang({"cat":"Àmbit disponible", "spa":"Ámbito disponible", "eng":"Available boundary", "fre":"Champ disponible"}), ": x=(",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX, ParamCtrl.NDecimalsCoordXY),
					",",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX, ParamCtrl.NDecimalsCoordXY),
					"); y=(",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY, ParamCtrl.NDecimalsCoordXY),
					",",OKStrOfNe(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY, ParamCtrl.NDecimalsCoordXY),")<br>",
		DonaCadenaLang({"cat":"Costat de píxel actual", "spa":"Lado de píxel actual", "eng":"Current pixel size", "fre":"Côte de pixel actuel"}) , ": ", ParamInternCtrl.vista.CostatZoomActual,
		"</small><hr>",
		DonaCadenaLang({"cat":"Ample", "spa":"Ancho", "eng":"Width", "fre":"Largeur"}) , ": ", ParamInternCtrl.vista.ncol, "px ",
		DonaCadenaLang({"cat":"Alt", "spa":"Alto", "eng":"Height", "fre":"Hauteur"}) , ": " , ParamInternCtrl.vista.nfil, "px ",
		DonaCadenaLang({"cat":"Mida de l\'ample de la vista", "spa":"Tamaño del ancho de la vista", "eng":"Width of the view", "fre":"Dimensions de la largeur de la vue"}) , ": <input type=\"text\" size=\"8\" name=\"param_MidaAmplePantalla\" value=\""+OKStrOfNe(MidaDePixelPantalla*ParamInternCtrl.vista.ncol,1)+"\" maxlength=\"8\"> mm<br>",
		DonaCadenaLang({"cat":"Perc. de salt", "spa":"Porc. de salto", "eng":"Jump Perc.", "fre":"Pourc. de saut"}) , ": <input type=\"text\" size=\"3\" name=\"param_psalt\" value=\"" + ParamCtrl.psalt + "\" maxlength=\"3\"> %<br>",
		"<input type=\"radio\" name=\"param_ZoomUnSolClic\" id=\"id_ZoomUnSolClicNo\""+ (ParamCtrl.ZoomUnSolClic==true ? "" : " checked=\"checked\"")+"><label for=\"id_ZoomUnSolClicNo\" accesskey=\"2\"> ",
		DonaCadenaLang({"cat":"Zoom i pan basat en <u>2</u> simples clics (ergonòmic)", "spa":"Zoom y pan basado en <u>2</u> simples clics (ergonómico)", 
			   "eng": "Zoom and pan based in <u>2</u> simples clicks (ergonomic)", "fre":"Zoom et pan basé en <u>2</u> simples clics (ergonomique)"}) , "</label><br>" ,
		"<input type=\"radio\" name=\"param_ZoomUnSolClic\" id=\"id_ZoomUnSolClicSi\""+ (ParamCtrl.ZoomUnSolClic==true ? " checked=\"checked\"" : "")+ "><label for=\"id_ZoomUnSolClicSi\" accesskey=\"1\"> ",
		DonaCadenaLang({"cat":"Zoom i pan en <u>1</u> clic i arrossegant", "spa":"Zoom y pan en <u>1</u> clic y arrastrando", 
			    "eng":"Zoom and pan with <u>1</u> click and dragging", "fre":"Zoom et pan en <u>1</u> cliques et glisser"}) ,
		"</label><hr>",
		"Coord: &nbsp;&nbsp;&nbsp;&nbsp;" , DonaCadenaLang({"cat":"N. decimals", "spa":"N. decimales", "eng":"N. of figures", "fre":"N. décimales"}) , ": <input type=\"text\" size=\"1\" name=\"param_NDecimalsCoordXY\" value=\""+ ParamCtrl.NDecimalsCoordXY +"\" maxlength=\"1\"><br>",
		"&nbsp;&nbsp;&nbsp;" , DonaCadenaLang({"cat":"Cantonades", "spa":"Esquinas", "eng":"Corners", "fre":"Coins"}) , ": ",
		   "<input type=\"radio\" name=\"param_CoordExtremes\" id=\"id_CoordExtremesCap\""+ (ParamCtrl.CoordExtremes ? "": " checked=\"checked\"") +"> <label for=\"id_CoordExtremesCap\" accesskey=\"a\">", DonaCadenaLang({"cat":"c<u>a</u>p", "spa":"ningun<u>a</u>", "eng":"<u>a</u>ny", "fre":"<u>a</u>ucune"}) ,"</label> ",
		   "<input type=\"radio\" name=\"param_CoordExtremes\" id=\"id_CoordExtremesProj\""+ ((ParamCtrl.CoordExtremes && ParamCtrl.CoordExtremes=="proj") ? " checked=\"checked\"" : "")+"> <label for=\"id_CoordExtremesProj\" accesskey=\"p\">", DonaCadenaLang({"cat":"<u>P</u>roj", "spa":"<u>P</u>roy", "eng":"<u>P</u>roj", "fre":"<u>P</u>roj"}) ,".</label> ",
                   "<input type=\"radio\" name=\"param_CoordExtremes\" id=\"id_CoordExtremesLongLat\""+ ((ParamCtrl.CoordExtremes && (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")) ? " checked=\"checked\"" : "")+"> <label for=\"id_CoordExtremesLongLat\" accesskey=\"l\"><u>L</u>ong/Lat</label> ",
                   "<input type=\"checkbox\" name=\"param_CoordExtremesGMS\" id=\"id_CoordExtremesGMS\""+ ((ParamCtrl.CoordExtremes && ParamCtrl.CoordExtremes=="longlat_gms") ? " checked=\"checked\"" : "")+"> <label for=\"id_CoordExtremesGMS\">(° \' \")</label><br>",
		"&nbsp;&nbsp;&nbsp;" , DonaCadenaLang({"cat":"Actual", "spa":"Actual", "eng":"Current", "fre":"Actuel"}) , ": ",
                   "<input type=\"checkbox\" name=\"param_CoordActualProj\" id=\"id_CoordActualProj\""+ (ParamCtrl.CoordActualProj==true ? " checked=\"checked\"" : "")+"> <label for=\"id_CoordActualProj\" accesskey=\"r\">", DonaCadenaLang({"cat":"P<u>r</u>oj", "spa":"P<u>r</u>oy", "eng":"P<u>r</u>oj", "fre":"P<u>r</u>oj"}) ,".</label> ",
		   "<input type=\"checkbox\" name=\"param_CoordActualLongLat\" id=\"id_CoordActualLongLat\""+ ((ParamCtrl.CoordActualLongLatG==true || ParamCtrl.CoordActualLongLatGMS==true) ? " checked=\"checked\"" : "")+"> <label for=\"id_CoordActualLongLat\" accesskey=\"o\">L<u>o</u>ng/Lat</label> ",
		   "(<input type=\"checkbox\" name=\"param_CoordActualGMS\" id=\"id_CoordActualGMS\""+ (ParamCtrl.CoordActualLongLatGMS==true ? " checked=\"checked\"" : "")+"> <label for=\"id_CoordActualGMS\">(° \' \")</label>)<hr></div>",
		"<div id=\"param_colors\">",
		DonaTextParamColors(),		
		"</div>",
		"<div align=\"center\">",
                "<input TYPE=\"button\" class=\"Verdana11px\" value=\""+DonaCadenaLang({"cat":"D'acord","spa": "Aceptar","eng": "  Ok  ", "fre":"D’accord"})+"\" onClick=\"RecuperaValorsFinestraParametres(document.form_param, true);\"> ",
		"<input TYPE=\"button\" class=\"Verdana11px\" value=\""+DonaCadenaLang({"cat":"Cancel·lar", "spa":"Cancelar", "eng":"Cancel", "fre":"Annuler"})+"\" onClick='TancaFinestraLayer(\"param\");'> &nbsp;&nbsp;",
		"<input TYPE=\"button\" class=\"Verdana11px\" value=\""+DonaCadenaLang({"cat":"Aplicar", "spa":"Aplicar", "eng":"Apply", "fre":"Appliquer"})+"\" onClick=\"RecuperaValorsFinestraParametres(document.form_param, false);\"></div>",
	        "</form>");

	contentFinestraLayer(window, "param", cdns.join("")); 
}

function MostraFinestraParametres()
{
	if (!ObreFinestra(window, "param", DonaCadenaLang({"cat":"de canviar paràmetres", 
							  "spa":"de cambiar parámetros",
							  "eng":"of changing parameters",
							  "fre":"pour changement de paramètres"})))
		return;
	OmpleFinestraParametres();
}

var nfilVistaImprimir;
var VistaImprimir={ "EnvActual": {"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0},
				 "nfil": 0,
				 "ncol": 0,
				 "CostatZoomActual": 0,
				 "i_vista": -2,
				 "i_nova_vista": -2};  //El significat de "i_nova_vista" es pot trobar a la funció PreparaParamInternCtrl()

function CalculaNColNFilVistaImprimir(ncol,nfil)
{
var factor_mapa=(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)/(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX);
var factor_paper=nfil/ncol;
var i;
	if (factor_mapa>factor_paper)
	{
	    VistaImprimir.nfil=nfil;
	    VistaImprimir.ncol=floor_DJ(nfil/factor_mapa);
	}
	else
	{
	    VistaImprimir.ncol=ncol;
	    VistaImprimir.nfil=floor_DJ(ncol*factor_mapa);
	}
	var costat;
	if (!(plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&RespectarResolucioVistaImprimir))
	{
	    for (i=0; i<ParamCtrl.capa.length; i++)
	    {
			if (EsCapaVisibleAAquestNivellDeZoom(i) &&
				DonaTipusServidorCapa(ParamCtrl.capa[i].tipus)!="TipusWMS")
			{
				//Hi ha 1 capa (o més) en WMTS. En aquest cas, es fixa un nivell de zoom superior al ambit que es vol demanar.
				costat=(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)/VistaImprimir.ncol;
				//Buscar el costar de pixel que cumplim:
				var i_zoom=DonaIndexNivellZoomCeil(costat);
				if (i_zoom==-1)
				{
					i=ParamCtrl.capa.length;  //No ha ha cap costat que em serveixi.
				}
				else
				{
					//Ara amb el nou costat de píxel cal redefinir envolupant per excés donat que no la puc conservar totalment.
					costat=ParamCtrl.zoom[i_zoom].costat;
				}
				break;
			}
	    }
	    if (i==ParamCtrl.capa.length)
	    {
			VistaImprimir.EnvActual.MinX=ParamInternCtrl.vista.EnvActual.MinX;
			VistaImprimir.EnvActual.MinY=ParamInternCtrl.vista.EnvActual.MinY;
			VistaImprimir.EnvActual.MaxX=ParamInternCtrl.vista.EnvActual.MaxX;
			VistaImprimir.EnvActual.MaxY=ParamInternCtrl.vista.EnvActual.MaxY;
	        return;
	    }
	}
	else
	    costat=ParamInternCtrl.vista.CostatZoomActual;

	VistaImprimir.EnvActual.MinX=(ParamInternCtrl.vista.EnvActual.MaxX+ParamInternCtrl.vista.EnvActual.MinX)/2-VistaImprimir.ncol/2*costat;
	VistaImprimir.EnvActual.MinY=(ParamInternCtrl.vista.EnvActual.MaxY+ParamInternCtrl.vista.EnvActual.MinY)/2-VistaImprimir.nfil/2*costat;
	VistaImprimir.EnvActual.MaxX=VistaImprimir.EnvActual.MinX+VistaImprimir.ncol*costat;
	VistaImprimir.EnvActual.MaxY=VistaImprimir.EnvActual.MinY+VistaImprimir.nfil*costat;
}


var winImprimir=null;  //Necessari pels setTimeout();

function DonaWindowDesDeINovaVista(vista)
{
	if (vista.i_nova_vista==-2 && winImprimir)
		return winImprimir;
	return window;
}

function CreaVistaFullImprimir(win)
{
	winImprimir=win;
	CreaVistaImmediata(win, "vista", VistaImprimir);
}


function DonaCadenaHTMLDibuixEscala(env)
{
var cdns=[];

	var escala=DonaNumeroArrodonit125((env.MaxX-env.MinX)*0.4);
	cdns.push("<font face=arial size=1><img src=\"",
			  AfegeixAdrecaBaseSRC("1tran.gif"), 
			  "\" width=1 height=3 border=0><br><img src=\"",
			  AfegeixAdrecaBaseSRC("colors/c000000.gif"),
			  "\" width=", Math.round(escala/ParamInternCtrl.vista.CostatZoomActual),
		  " height=2 border=0><br>", escala ," ", DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS));
	if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
		cdns.push(" (aprox. " , (DonaDenominadorDeLEscalaArrodonit(escala*FactotGrausAMetres*Math.cos((env.MaxY+env.MinY)/2*FactorGrausARadiants))) , " m " , 
			(DonaCadenaLang({"cat":"a lat.","spa":"a lat.","eng":"at lat.","fre":"à lat"})) , " " , (OKStrOfNe((env.MaxY+env.MinY)/2,1)) , "°)");
	else if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="AUTO2:MERCATOR,1,0,41.42")
		cdns.push(" (" , (DonaCadenaLang({"cat":"a lat.","spa":"a lat.","eng":"at lat.","fre":"à lat"})) , " 41° 25\')");
	else if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="AUTO2:MERCATOR,1,0,40.60")
		cdns.push(" (" , (DonaCadenaLang({"cat":"a lat.","spa":"a lat.","eng":"at lat.","fre":"à lat"})) , " 40° 36\')");
	else if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="AUTO2:MERCATOR,1,0,0.0" || ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()=="EPSG:3785")
		cdns.push(" (" , (DonaCadenaLang({"cat":"a lat.","spa":"a lat.","eng":"at lat.","fre":"à lat"})) , " 0° 0\')");
	cdns.push("</font>");
	return cdns.join("");
}

function CanviaCRSDeImatgeSituacio(i)
{
	if (i==-1)
		ParamInternCtrl.flags|=ara_canvi_proj_auto;
	else
	{
		ParamInternCtrl.flags&=~ara_canvi_proj_auto;
		CanviaCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS);
		ParamInternCtrl.ISituacio=i;
		if(ParamCtrl.FuncioCanviProjeccio)
			eval(ParamCtrl.FuncioCanviProjeccio);
	}
	RevisaEstatsCapes();
	RepintaMapesIVistes();
}

function OrdenacioCRSSituacio(x,y) {
	//Ascendent per crs
	if ( x.crs.toUpperCase() < y.crs.toUpperCase() ) return -1; 
	if ( x.crs.toUpperCase() > y.crs.toUpperCase() ) return 1; 
	return 0; 
}

function DonaCadenaHTMLProjeccio()
{
var cdns=[], i;

	if (ParamCtrl.DesplegableProj==true && ParamCtrl.ImatgeSituacio.length>1)
	{
		cdns.push("<form name=FormulProjeccio onSubmit=\"return false;\"><select CLASS=text_petit name=\"imatge\" onChange=\"CanviaCRSDeImatgeSituacio(parseInt(document.FormulProjeccio.imatge.value,10));\">");
		if (ParamCtrl.CanviProjAuto==true)
		{
			cdns.push("<OPTION VALUE=\"-1\"",((ParamInternCtrl.flags&ara_canvi_proj_auto) ? " SELECTED" : "") ,">", 
				DonaCadenaLang({"cat":"automàtic", "spa":"automático", "eng":"automatic","fre":"automatique"}));
			if (ParamInternCtrl.flags&ara_canvi_proj_auto)
				cdns.push(" (", DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS), ")");
			cdns.push("</OPTION>");
		}
		//NJ_31_03_2017: Hi ha casos en que hi ha imatges de situació amb igual sistema de referència però diferent àmbit
		//al desplegable de projeccions no té sentit que surtin repeticions, per tant, construeixo un array de crs, 
		//del qual eliminaré les repeticions.
		var crs_temp=[];
		for (i=0; i<ParamCtrl.ImatgeSituacio.length; i++)
		{
			if (i==ParamInternCtrl.ISituacio || EsImatgeSituacioDinsAmbitActual(i))
				crs_temp[crs_temp.length]={"crs": ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS, "i_situacio": i};
		}
		crs_temp.sort(OrdenacioCRSSituacio);
		crs_temp.removeDuplicates(OrdenacioCRSSituacio);		
		for (i=0; i<crs_temp.length; i++)
		{
			cdns.push("<OPTION VALUE=\"", crs_temp[i].i_situacio ,"\"",((!(ParamInternCtrl.flags&ara_canvi_proj_auto) && crs_temp[i].i_situacio==ParamInternCtrl.ISituacio) ? " SELECTED" : ""),">", 
				DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[crs_temp[i].i_situacio].EnvTotal.CRS) , "</OPTION>");
		}
		cdns.push("</select></form>");
	}
	else
		cdns.push("<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=2> &nbsp;",
			DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS),"</font>");	
	return cdns.join("");
}

function CreaProjeccio()
{
    var elem=getLayer(window, "projeccio");    
	if (isLayer(elem))
		contentLayer(elem, DonaCadenaHTMLProjeccio());
}

function DonaCadenaHTMLEscala(env)
{
var cdns=[];

	cdns.push("<table border=0 cellspacing=0 cellpadding=0><tr><td align=middle>", DonaCadenaHTMLDibuixEscala(env) , "</td></tr></table>");
	return cdns.join("");
}

function DonaCadenaHTMLEscalaImprimir(env)
{
	return "<table border=0 cellspacing=0 cellpadding=0><tr><td align=middle>" + DonaCadenaHTMLDibuixEscala(env) + "</td><td><font face=arial size=2> &nbsp;"+
		DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)+"</font></td></tr></table>"
}

function CreaEscalaFullImprimir(win)
{
    var elem=getLayer(win, "escala");
    if (isLayer(elem))
		contentLayer(elem, DonaCadenaHTMLEscalaImprimir(VistaImprimir.EnvActual));
}

function CreaSituacioFullImprimir(win, esq, sup, ample, alt)
{
var factor_imatge=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt/ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample;
var factor_paper=alt/ample;
var elem=getLayer(win, "situacio");

    if (isLayer(elem))
    {
		if (factor_imatge>factor_paper)
			ample=floor_DJ(alt/factor_imatge);
		else
			alt=floor_DJ(ample*factor_imatge);
	
		var rec=OmpleMidesRectangleSituacio(ample,alt,VistaImprimir.EnvActual);
		contentLayer(elem, 
				"<img src=\"" + 
				AfegeixAdrecaBaseSRC(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].nom) + "\" width="+ample+" height="+alt+" border=0>"+
				"<br><img src=\""+
				AfegeixAdrecaBaseSRC("1tran.gif")+ 
				"\" height=\"15\" width=\"1\"><br>"+
				textHTMLLayer("l_rect", esq+rec.MinX,
						sup+alt-rec.MaxY,
						rec.MaxX-rec.MinX,
						rec.MaxY-rec.MinY,
						null, "no", true, null, null, false,
						DonaCadenaHTMLMarcSituacio(rec.MaxX-rec.MinX, rec.MaxY-rec.MinY)));
    }
}//Fi de CreaSituacioFullImprimir()


function OmpleMidesRectangleSituacio(ncol,nfil, env)
{
	return {"MinX": Math.max(0,Math.floor((env.MinX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)*ncol/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX))), 
		"MaxX": Math.min(ncol,Math.floor((env.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)*ncol/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)+1)),
		"MinY": Math.max(0,Math.floor((env.MinY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)*nfil/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY))), 
		"MaxY": Math.min(nfil,Math.floor((env.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)*nfil/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)+1))};
}

var TriaFullWindow=null;
function ObreTriaFullImprimir()
{
    if (TriaFullWindow==null || TriaFullWindow.closed)
    {
        TriaFullWindow=window.open("print.htm","FinestraPrint",'toolbar=no,status=yes,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=400,height=600,left=0,top=0');
		ShaObertPopUp(TriaFullWindow);
    }
    else
        TriaFullWindow.focus();
}

var AjudaWindow=null;
function ObreFinestraAjuda()
{
    if (AjudaWindow==null || AjudaWindow.closed)
    {
        AjudaWindow=window.open(DonaCadenaLang({"cat":"ajuda/cat/ajuda.htm", "spa":"ajuda/spa/ajuda.htm", "eng":"ajuda/eng/ajuda.htm", "fre":"ajuda/fre/ajuda.htm"}),"FinestraAjuda",'toolbar=no,status=no,scrollbars=yes,location=no,menubar=yes,directories=no,resizable=yes,width=780,height=580');
		ShaObertPopUp(AjudaWindow);
    }
    else
        AjudaWindow.focus();
}

function InstalaLectorMapes()
{
    var instalaWindow=window.open(DonaCadenaLang({"cat":"http://www.creaf.uab.cat/miramon/mmr/cat/exe/Inst_MMR.EXE", 
												 "spa":"http://www.creaf.uab.cat/miramon/mmr/esp/exe/Inst_MMR.EXE", 
												 "eng":"http://www.creaf.uab.cat/miramon/mmr/usa/exe/Inst_MMR.EXE", 
												 "fre":"http://www.creaf.uab.cat/miramon/mmr/cat/exe/Inst_MMR.EXE"}));
    ShaObertPopUp(instalaWindow);
}

function SeparaNumerosDe3En3(s, separador)
{
var mida=s.length/3;
var j;

	for (var i=0; i<mida; i++)
	{
		j=s.length-i*(3+separador.length)-3;
		s=s.substring(0,j)+separador+s.substring(j,s.length);
	}
	return s;
}

function EscriuEscalaAproximada(i, crs)
{
var e=ParamCtrl.zoom[i].costat*1000/MidaDePixelPantalla;
//var crs_up=crs.toUpperCase();

	if (EsProjLongLat(crs))
		e*=FactotGrausAMetres;
	return DonaDenominadorDeLEscalaArrodonit(e);
}

function DonaAreaCella(env, costat, crs)
{
	if (EsProjLongLat(crs))
		return FactotGrausAMetres*Math.cos((env.MaxY+env.MinY)/2*FactorGrausARadiants)*costat*FactotGrausAMetres*costat;
	return costat*costat;
}

function EscriuCostatIUnitatsZoom(i, crs)
{
//var crs_up=crs.toUpperCase(); 

	if (EsProjLongLat(crs))
		return g_gms(ParamCtrl.zoom[i].costat, false);
	return ParamCtrl.zoom[i].costat+DonaUnitatsCoordenadesProj(crs);
}

function EscriuDescripcioNivellZoom(i, crs, vull_retorns)
{
var cdns=[];
var parentesis=false;
var s=null;

    if (ParamCtrl.LlistatZoomFraccio==true)
    {
		s="1"+((i==ParamCtrl.zoom.length-1) ? "" : "/" + (Math.floor(ParamCtrl.zoom[i].costat/ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat*1000))/1000);
		cdns.push(s);
        parentesis=true;
    }
    if (ParamCtrl.LlistatZoomMidaPixel==true)
    {
        if (parentesis)
			cdns.push((vull_retorns ? "<br>": " ") + "(");
        cdns.push((EscriuCostatIUnitatsZoom(i, crs)));
        if (parentesis)
        {
			cdns.push(")");
            parentesis=false;
        }
		else
	    	parentesis=true;
    }
    if (ParamCtrl.LlistatZoomEscalaAprox==true)
    {
        if (parentesis)
			cdns.push((vull_retorns ? "<br>": " ") + "(");
		else if (s && s.length)
			cdns.push(vull_retorns ? "<br>": " ");
        cdns.push("1:", (SeparaNumerosDe3En3(""+EscriuEscalaAproximada(i, crs), " ")));
        if (parentesis)
			cdns.push(")");
    }
    return cdns.join("");
}

function VerificaICorregeixPuntOri()
{
var d_max;

    if (ParamCtrl.RelaxaAmbitVisualitzacio==true)
		return;

	if (ParamInternCtrl.PuntOri.x<ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX+ParamInternCtrl.vista.CostatZoomActual+ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual/2)
		ParamInternCtrl.PuntOri.x=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX+ParamInternCtrl.vista.CostatZoomActual+ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual/2;
	d_max=ParamInternCtrl.PuntOri.x+ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual/2;
	if (d_max>ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX)
		ParamInternCtrl.PuntOri.x=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX-ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual/2;

	if (ParamInternCtrl.PuntOri.y<ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY+ParamInternCtrl.vista.CostatZoomActual+ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual/2)
		ParamInternCtrl.PuntOri.y=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY+ParamInternCtrl.vista.CostatZoomActual+ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual/2;
	d_max=ParamInternCtrl.PuntOri.y+ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual/2;
	if (d_max>ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY)
		ParamInternCtrl.PuntOri.y=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual/2;
}

//Aquesta funció converteix un nom de vista en un index de l'array ParamCtrl.VistaPermanent. Noteu que no funciona per les "vistes noves" creades per l'usuari.
function DonaIVista(nom)
{
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		if (ParamCtrl.VistaPermanent[i_vista].nom==nom)
			return i_vista;
	}
}

var NRequestedCursor=0;


//https://www.w3schools.com/cssref/pr_class_cursor.asp
/*cursor pot ser 
	un cursor requerit (que cal cancelar més tard)
	"auto" per cancelar un cursor requerit
	null perque la funció determini el cursor a partir del estats del botons (de fet de les variables que reflectexien l'estat dels botons)*/
function CanviaCursorSobreVista(requested_cursor)
{
var cursor="auto";
	
	if (requested_cursor)
	{
		if (requested_cursor=="auto")
			NRequestedCursor--;
		else
		{
			cursor=requested_cursor;
			NRequestedCursor++
		}
	}

	if (NRequestedCursor==0)
	{
		if(ParamCtrl.EstatClickSobreVista=="ClickPan1" || ParamCtrl.EstatClickSobreVista=="ClickPan2")
			cursor="all-scroll";  //abans "move", "grab"

		if(ParamCtrl.EstatClickSobreVista=="ClickZoomRec1" || ParamCtrl.EstatClickSobreVista=="ClickZoomRec2" || 
		   ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2" ||
		   ParamCtrl.EstatClickSobreVista=="ClickMouMig")
			cursor="crosshair"; 
		else if (ParamCtrl.EstatClickSobreVista=="ClickConLoc")
			cursor="help";
	}
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		var elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_tel_trans");
		if(elem)
			elem.style.cursor=cursor;
		elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_sliderzoom");
		if(elem)
			elem.style.cursor=cursor;
	}
	for (var i_vista=0; i_vista<NovaVistaFinestra.vista.length; i_vista++)
	{
		var elem=getLayer(window, prefixNovaVistaFinestra+i_vista+"_finestra" + "_tel_trans");
		if(elem)
			elem.style.cursor=cursor;
		//elem=getLayer(window, NovaVistaFinestra.vista[i_vista].nom + "_sliderzoom");   De moment no hi ha slider en aquest cas.
		//if(elem)
		//	elem.style.cursor=cursor;
	}
}	

function MouLaVista(dx,dy)
{
    if (ParamCtrl.ConsultaTipica)
		PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
    GuardaVistaPrevia();
    ParamInternCtrl.PuntOri.x+=dx;
    ParamInternCtrl.PuntOri.y+=dy;	
    VerificaICorregeixPuntOri();  
    RepintaMapesIVistes();
}

/*Mou la vista un finestra sencera en x, y especificant -1, 0 o 1 segons el sentit desitjat:
     sx: -1 per esquerra, 0 per res, 1 per dreta.
     sy: -1 per aball,    0 per res, 1 per adalt.
  El moviment no salta una finetra sencera exactament sino que té en compte el paràmetre psalt 
  (percentatge de salt). Crida RepintaMapesIVistes() al final*/
function MouLaVistaSalt(sx,sy)
{
	MouLaVista( ParamInternCtrl.vista.ncol*ParamInternCtrl.vista.CostatZoomActual*ParamCtrl.psalt/100*sx,
		   		ParamInternCtrl.vista.nfil*ParamInternCtrl.vista.CostatZoomActual*ParamCtrl.psalt/100*sy);
}

function MouLaVistaEventDeSalt(event, sx, sy) //Afegit JM 18/09/2016
{
	MouLaVistaSalt(sx,sy)
	dontPropagateEvent(event);
}


/*Mou la vista per centrar-la a la posició x,y en coordenades mapa. Crida RepintaMapesIVistes()
  al final. Aquesta funció NO guarda la vista.*/
function CentraLaVista(x,y)
{
    ParamInternCtrl.PuntOri.x=x;
    ParamInternCtrl.PuntOri.y=y;
    ParamInternCtrl.vista.EnvActual.MinX=ParamInternCtrl.PuntOri.x-(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2;
    //ParamInternCtrl.vista.EnvActual.MaxX=ParamInternCtrl.PuntOri.x+(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2;
    ParamInternCtrl.vista.EnvActual.MaxX=ParamInternCtrl.vista.EnvActual.MinX+(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual;
    ParamInternCtrl.vista.EnvActual.MinY=ParamInternCtrl.PuntOri.y-(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2;
    //ParamInternCtrl.vista.EnvActual.MaxY=ParamInternCtrl.PuntOri.y+(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2;
    ParamInternCtrl.vista.EnvActual.MaxY=ParamInternCtrl.vista.EnvActual.MinY+(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual;
}

function ClickSobreSituacio(event_de_click)
{
	PortamAPunt(DonaCoordXDeCoordSobreSituacio(event_de_click.clientX), DonaCoordYDeCoordSobreSituacio(event_de_click.clientY));
}

var MidaFletxaInclinada=10;
var MidaFletxaPlana=15;

function DonaMargeSuperiorVista(i_nova_vista)
{
	if (i_nova_vista!=-1)
		return 0;
	return (ParamCtrl.MargeSupVista?ParamCtrl.MargeSupVista:0)+(ParamCtrl.CoordExtremes?AltTextCoordenada:0)+(ParamCtrl.VoraVistaGrisa==true ? MidaFletxaInclinada:0);  //Distancia entre la vista i vora superior del frame
}

function DonaMargeEsquerraVista(i_nova_vista)
{
	if (i_nova_vista!=-1)
		return 0;
	return (ParamCtrl.MargeEsqVista?ParamCtrl.MargeEsqVista:0)+(ParamCtrl.VoraVistaGrisa==true ? MidaFletxaInclinada:0);      //Distancia entre la vista i vora esquerra del frame
}


function DonaOrigenSuperiorVista(elem, i_nova_vista)
{
	return DonaMargeSuperiorVista(i_nova_vista)+getRectSupLayer(elem);
}

function DonaOrigenEsquerraVista(elem, i_nova_vista)
{
	return DonaMargeEsquerraVista(i_nova_vista)+getRectEsqLayer(elem);
}

function DonaCoordSobreVistaDeCoordX(elem, x)
{
	return (x-ParamInternCtrl.vista.EnvActual.MinX)/(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)*(ParamInternCtrl.vista.ncol)-((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0) + DonaOrigenEsquerraVista(elem, -1);
}

function DonaCoordSobreVistaDeCoordY(elem, y)
{
	return (ParamInternCtrl.vista.EnvActual.MaxY-y)/(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)*(ParamInternCtrl.vista.nfil)-((window.document.body.scrollTop) ? window.document.body.scrollTop : 0) + DonaOrigenSuperiorVista(elem, -1);
}

function DonaCoordXDeCoordSobreVista(elem, i_nova_vista, x)
{
	var vista=DonaVistaDesDeINovaVista(i_nova_vista);
	return vista.EnvActual.MinX+(vista.EnvActual.MaxX-vista.EnvActual.MinX)/(vista.ncol)*(((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+x-DonaOrigenEsquerraVista(elem, i_nova_vista));
}

function DonaCoordYDeCoordSobreVista(elem, i_nova_vista, y)
{
	var vista=DonaVistaDesDeINovaVista(i_nova_vista);
	return vista.EnvActual.MaxY-(vista.EnvActual.MaxY-vista.EnvActual.MinY)/(vista.nfil)*(((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+y-DonaOrigenSuperiorVista(elem, i_nova_vista));
}

function DonaCoordIDeCoordSobreVista(elem, i_nova_vista, x)
{
	return ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0) + x-DonaOrigenEsquerraVista(elem, i_nova_vista);
}

function DonaCoordJDeCoordSobreVista(elem, i_nova_vista, y)
{
	return ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0) + y-DonaOrigenSuperiorVista(elem, i_nova_vista);
}

function DonaCoordXDeCoordSobreSituacio(x)
{
	return ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX+(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)/(ParamInternCtrl.AmpleSituacio-1)*(((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+x-OrigenEsqSituacio);
}
function DonaCoordYDeCoordSobreSituacio(y)
{
	return ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)/(ParamInternCtrl.AltSituacio-1)*(((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+y-OrigenSupSituacio);
}

//consulta per localització
function DonaCoordenadaPuntCRSActual(punt, feature, crs_capa)
{
	if(!crs_capa  || crs_capa.toUpperCase()==ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase())
	{
		punt.x=feature.geometry.coordinates[0];
		punt.y=feature.geometry.coordinates[1];
		return true;
	}
	
	//En un futur proper, quan se suportin linies i polígons això s'haurà de canviar de lloc
	punt.x=feature.puntCRSactual[0].x;
	punt.y=feature.puntCRSactual[0].y;
	return false;
}

function EsCapaConsultable(i)
{
var capa=ParamCtrl.capa[i];

	return capa.consultable=="si" && EsCapaDinsAmbitActual(capa) && EsCapaDisponibleEnElCRSActual(capa) &&
			    (!(ParamCtrl.ConsultableSegonsEscala && ParamCtrl.ConsultableSegonsEscala==true) || EsCapaDinsRangDEscalesVisibles(capa));
}

function TancaFinestraLayer(nom_finestra)
{
	hideFinestraLayer(window, nom_finestra);

	if (nom_finestra=="multi_consulta")
		TancaFinestra_multi_consulta();
	else if (nom_finestra=="anarCoord")
		TancaFinestra_anarCoord();
	else if (nom_finestra=="video")
		TancaFinestra_video();
	else if (nom_finestra.length>prefixNovaVistaFinestra.length && nom_finestra.substring(0, prefixNovaVistaFinestra.length) == prefixNovaVistaFinestra)
		TancaFinestra_novaFinestra(nom_finestra, NovaVistaFinestra);
	else if (nom_finestra.length>prefixHistogramaFinestra.length && nom_finestra.substring(0, prefixHistogramaFinestra.length) == prefixHistogramaFinestra)
		TancaFinestra_novaFinestra(nom_finestra, HistogramaFinestra);
}


function TancaFinestra_novaFinestra(nom, finestra)
{
	if (isFinestraLayer(window, nom))
		removeFinestraLayer(window, nom);
	
	for (var z=0; z<layerFinestraList.length; z++)
	{
		if (layerFinestraList[z].nom && nom==layerFinestraList[z].nom)
		{
			layerFinestraList[z].nom=null;  //marco que ja no existeix.
			if (z+1==layerFinestraList.length)
			{
				delete layerFinestraList[z];
				layerFinestraList.pop();
				finestra.n--;
			}
			return;
		}
	}
}


function ValidacioFinalitzada(doc)
{
	alert(DonaCadenaLang({"cat":"Validació finalitzada. Pots tancar el navegador.", 
						  "spa":"Validación finalizada. Puedes cerrar el navegador.",
						  "eng":"Finished validation. You can close the browser.",
						  "fre":"Validation terminée. Vous pouvez fermer le navigateur."}));
	return;
}
function FesPeticioAjaxValidacio(s)
{
	var resp_valida_ajax=new Ajax();
	resp_valida_ajax.doGet(s, ValidacioFinalitzada, "text/plain", null); 
}

function EnviarRespostaAccioValidacio(despatxada)
{
var cdns=[];
	
	if(Accio.servidor)
	{
		cdns.push(DonaNomServidorSenseCaracterFinal(Accio.servidor), "?comanda=GuardaResultatValidacio&", 
			 (Accio.id_trans ? ("IdTrans="+Accio.id_trans+ "&"): ""));
		 if(Accio.coord)
			 cdns.push("X=",Accio.coord.x,"&Y=",Accio.coord.y);
		 cdns.push("&EstatComanda=", (despatxada ? "Despatxada" : "Cancellada"));
		//For per tots el valors si cal
		if(despatxada && Accio.valors)
		{
			for(var i=0; i<Accio.valors.length;i++)
				cdns.push("&SelecObj",i,"=",Accio.valors[i]);
		}
		var s=cdns.join("");

		//envio la reposta
		setTimeout("FesPeticioAjaxValidacio(\""+s+"\");",30);
		
		//Tanco la finestra de consulta si és una finestra emergent
		if(ParamCtrl.TipusConsulta=="FinestraDeCop" && ConsultaWindow && ConsultaWindow.closed==false)
			setTimeout("ConsultaWindow.close();",300); 	
		else if(ParamCtrl.TipusConsulta=="IncrustadaDeCop")
			hideFinestraLayer(window, "multi_consulta");
	}
		
}//Fi de EnviarRespostaAccioValidacio()


function EditarPunts(event_de_click, i_nova_vista)
{	
//	PuntConsultat.i=DonaCoordIDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX)
//	PuntConsultat.j=DonaCoordJDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY)

//	alert(event_de_click.clientY + " : " + PuntConsultat.j);
	PuntConsultat.x=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
	PuntConsultat.y=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
	PuntConsultat.i_nova_vista=i_nova_vista;
	
	if (ParamCtrl.IconaEdicio)
	{
	 	var capa=ParamCtrl.capa[i_objdigi_edicio];
		capa.objectes.features[0].geometry.coordinates[0]=PuntConsultat.x;
		capa.objectes.features[0].geometry.coordinates[1]=PuntConsultat.y;		
		capa.objectes.features[0].seleccionat=false;	
		capa.visible="si";
	    
		CreaVistes();
	}
	if (ParamCtrl.BarraBotoInsereix==true && ParamCtrl.FuncioIconaEdicio)
		eval(ParamCtrl.FuncioIconaEdicio);		
	else if(i_objdigi_edicio!=-1 && ParamCtrl.capa[i_objdigi_edicio].FuncioEdicio)
		eval(ParamCtrl.capa[i_objdigi_edicio].FuncioEdicio);		
	
}//Fi de EditarPunts()



/*Anar a coordenada
function FormAnarCoord(proj, x, y, m)
{
	this.proj=proj;
	this.x=x;
	this.y=y;
	this.m_voltant=m;
}*/

function OmpleFinestraAnarCoordenada()
{
var cdns=[];
    cdns.push("<form name=\"AnarCoord\" onSubmit=\"return false;\"><table class=\"Verdana11px\" width=\"100%\"><tr><td align=\"center\"><input name=\"proj\" type=\"radio\" value=\"0\" id=\"proj_anarcoord\"",
			(FormAnarCoord.proj ? "checked" : "") ,
			" onClicK=\"CanviaEtiquetes(0);\"><label for=\"proj_anarcoord\" >",
			(DonaCadenaLang({"cat":"Proj", "spa":"Proy", "eng":"Proj","fre":"Proj"})),
			"</label>  <input name=\"proj\" type=\"radio\" value=\"1\" id=\"longlat_anarcoord\"",
			(FormAnarCoord.proj ? "" : "checked"), 
			" onClicK=\"CanviaEtiquetes(1);\"><label for=\"longlat_anarcoord\" >Long/Lat</label></td></tr><tr><td align=\"right\"><label id=\"X_anarcoord\" for=\"coordX_anarcoord\">X: </label><input class=\"Verdana11px\" id=\"coordX_anarcoord\" name=\"coordX\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.x,"\"><label id=\"Y_anarcoord\" for=\"coordY_anarcoord\"> Y: </label><input class=\"Verdana11px\" id=\"coordY_anarcoord\" name=\"coordY\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.y,"\"></td></tr><tr><td align=\"right\"><label for=\"mVoltant_anarcoord\">",
			(DonaCadenaLang({"cat":"Zona al voltant (m):", "spa":"Zona alrededor (m):", "eng":"Round zone (m):","fre":"Zone autour (m):"})),
			" </label><input class=\"Verdana11px\" id=\"mVoltant_anarcoord\" name=\"mVoltant\" type=\"text\" size=\"10\" value=\"",FormAnarCoord.m_voltant,"\"></td></tr><tr><td align=\"center\"><input class=\"Verdana11px\" type=\"button\" name=\"Acceptar\" value=\"",
			(DonaCadenaLang({"cat":"Anar-hi", "spa":"Ir", "eng":"Go to","fre":"Aller à"})),
			"\" onClick=\"AnarACoordenada(form);\"> <input class=\"Verdana11px\" type=\"button\" name=\"Tancar\" value=\"",
			(DonaCadenaLang({"cat":"Tancar", "spa":"Cerrar", "eng":"Close", "fre":"Quitter"})),
			"\" onClick='TancaFinestraLayer(\"anarCoord\");'></td></tr></table></form>");
	contentFinestraLayer(window, "anarCoord", cdns.join("")); 
}//Fi de OmpleFinestraAnarCoordenada()

function MostraFinestraAnarCoordenada()
{
	if (!ObreFinestra(window, "anarCoord", DonaCadenaLang({"cat":"d'anar a coordenada", 
							  "spa":"de ir a coordenada",
							  "eng":"of go-to coordenate",
							  "fre":"pour aller à la coordonnée"})))
		return;
	OmpleFinestraAnarCoordenada();
	if (i_objdigi_anar_coord!=-1)
	{
		ParamCtrl.capa[i_objdigi_anar_coord].visible="no";
		CreaVistes();
	}
}

function MostraFinestraAnarCoordenadaEvent(event) //Afegit Cristian 19/01/2016
{
	MostraFinestraAnarCoordenada()
	dontPropagateEvent(event)
}//Fi de MostraFinestraAnarCoordenada()

//No usar: Useu TancaFinestraLayer("anarCoord");
function TancaFinestra_anarCoord()
{
	if (i_objdigi_anar_coord!=-1)
	{
	   ParamCtrl.capa[i_objdigi_anar_coord].visible="no";
	   CreaVistes();
	}
}//Fi de TancaFinestra_anarCoord()

/* El dia 06-02-2018 descubreixo aquesta funció però no tinc idea de a que es refereix i la esborro. (JM)
function MostraFinestraInserta()
{
	if (!ObreFinestra(window, "inserta", DonaCadenaLang({"cat":"d'inserir", 
							  "spa":"de insertar",
							  "eng":"of inserting",
							  "fre":"d'insertion"})))
		return;
	OmpleFinestraInserta(elem);
}*/

function EsborraTotIOmpleEventConsola()
{
	EventConsola.length=0;
	OmpleFinestraConsola();
}


//La funció de tanca la caixa general serveix en aquet cas i no en creem una de pròpia.

function DonaEnllacAAquestNavegador()
{
var cdns=[], cal_coma, capa, i;

	i=location.href.indexOf("?");

	if (i==-1)	
		cdns.push(location.href);
	else
		cdns.push(location.href.substring(0, i));

	cdns.push("?BBOX=", ParamInternCtrl.vista.EnvActual.MinX, ",", ParamInternCtrl.vista.EnvActual.MinY, ",", ParamInternCtrl.vista.EnvActual.MaxX, ",", ParamInternCtrl.vista.EnvActual.MaxY, "&LAYERS=");

	cal_coma=false;
	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		//Crec que s'hauria de fer això EsCapaVisibleAAquestNivellDeZoom  //·$·
		if (ParamCtrl.capa[i].visible=="si" || ParamCtrl.capa[i].visible=="semitransparent")
		{
			if (cal_coma)
				cdns.push(",", ParamCtrl.capa[i].nom);
			else
			{
				cdns.push(ParamCtrl.capa[i].nom);
				cal_coma=true;
			}
		}
	}

	//Estils
	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if ((capa.visible=="si" || capa.visible=="semitransparent") && 
			(((capa.estil && capa.estil.length>1) || capa.visible=="semitransparent")))
		{
			cdns.push("&STYLES=");
			break
		}
	}
	cal_coma=false;
	for (;i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.visible=="si" || capa.visible=="semitransparent")
		{
			if (cal_coma)
				cdns.push(",");
			else
				cal_coma=true;
			if (capa.estil && capa.estil.length>1 && capa.estil[capa.i_estil].nom)
			{
				cdns.push(capa.estil[capa.i_estil].nom);
				if (capa.visible=="semitransparent")
					cdns.push(":SEMITRANSPARENT");
			}
			else if (capa.visible=="semitransparent")
				cdns.push("SEMITRANSPARENT");
		}
	}

	//S'hauria d'afegir el paràmetre time per aquelles capes que el tenen per saber quina és la data que es vol mostrar
	//·$·
	cdns.push("&QUERY_LAYERS="); 
	cal_coma=false;
	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		//Crec que s'hauria de fer això ·$·
		//EsCapaDinsRangDEscalesVisibles(c) && EsCapaDinsAmbitActual(c) && EsCapaDisponibleEnElCRSActual(c))
		if (ParamCtrl.capa[i].consultable=="si")
		{
			if (cal_coma)
				cdns.push(",", ParamCtrl.capa[i].nom);
			else
			{
				cdns.push(ParamCtrl.capa[i].nom);
				cal_coma=true;
			}
		}
	}
	if (ParamCtrl.idiomes.length>1)
		cdns.push("&LANGUAGE=", ParamCtrl.idioma);
	if (ParamCtrl.ImatgeSituacio.length>1)
		cdns.push("&CRS=", ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	return cdns.join("");
}

function MostraFinestraEnllac()
{
	showFinestraLayer(window, "enllac");
	OmpleFinestraEnllac();
	setzIndexFinestraLayer(window, "enllac", (layerList.length-1));
}

function MostraFinestraEnllacWMS()
{
	showFinestraLayer(window, "enllacWMS");
	OmpleFinestraEnllacWMS();
	setzIndexFinestraLayer(window, "enllacWMS", (layerList.length-1));
}

function DonaDescripcioTipusServidor(tipus)
{
    if (tipus=="TipusWMS")
		return "WMS";
    if (tipus=="TipusWMS_C")
		return "WMS-C";
    if (tipus=="TipusWMTS_REST")
		return "WMTS RESTful";
    if (tipus=="TipusWMTS_KVP")
		return "WMTS KVP";
    if (tipus=="TipusWMTS_SOAP")
		return "WMTS SOAP";
    /*if (tipus=="TipusGoogle_KVP")
		return "Google KVP";*/
    if (tipus=="TipusWFS")
		return "WFS";
    if (tipus=="TipusSOS")
		return "SOS";
    return "";
}

//Si mode==0 dona un enllaç amb la URL com a text subratllat
//Si mode==1 dona un enllaç amb el tipus com a text subratllat
function DonaEnllacCapacitatsServidorDeCapa(i_capa, mode)
{
var cdns=[];

	if(DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus)=="TipusWMTS_SOAP")
	{
		cdns.push("<a href=\"javascript:void(0);\" onClick=\"FesPeticioCapacitatsPost(\'", 
				DonaNomServidorSenseCaracterFinal(DonaServidorCapa(ParamCtrl.capa[i_capa].servidor)),"\', \'",DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa].versio)),"\', ",
				DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus), ");\">", ((mode==0) ? DonaServidorCapa(ParamCtrl.capa[i_capa].servidor) : DonaDescripcioTipusServidor(DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus))), "</a>");
	}
	else
	{
		cdns.push("<a href=\"", DonaRequestServiceMetadata(DonaServidorCapa(ParamCtrl.capa[i_capa].servidor), 
				DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa].versio)), 
				DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus)), "\" target=\"_blank\">", 
				((mode==0) ? DonaServidorCapa(ParamCtrl.capa[i_capa].servidor) : DonaDescripcioTipusServidor(DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus))), "</a>");
	}
	return cdns.join("");
}

function DonaEnllacCapacitatsServidorDeCapaDigi(i_capa, mode)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	cdns.push("<a href=\"", DonaRequestServiceMetadata(DonaServidorCapa(capa.servidor), 
				DonaVersioComAText(capa.versio), 
				capa.tipus ? capa.tipus : "TipusWFS"), "\" target=\"_blank\">", 
				((mode==0) ? DonaServidorCapa(capa.servidor) : DonaDescripcioTipusServidor(capa.tipus ? capa.tipus : "TipusWFS")), "</a>");
	return cdns.join("");
}

/*Només enumero el servidor local si s'usa o si el nombre da capes és 0. Tinc en compte
els servidors WFS.*/
function OmpleFinestraEnllacWMS()
{
var elem=getLayer(window, "enllacWMS_finestra");
    
    if(isLayer(elem) && isLayerVisible(elem))
    {
		var serv_l=null, serv_temp, cdns=[], array_tipus=[], cdns2=[], i, i_capa, tipus_acumulat, servidor_local_trobat=false;
		
		for (i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
			cdns.push(DonaServidorCapa(ParamCtrl.capa[i_capa].servidor));
		
		cdns2.push("<center><table border=0 width=95%><tr><td><font size=1>");
		if(cdns.length>0)
		{		    
			cdns.sort();
			if (ParamCtrl.ServidorLocal)
			{
				for (i=0; i<cdns.length; i++)
				{
					if (ParamCtrl.ServidorLocal==cdns[i])
					{
						array_tipus.length=0;
						//Necessito saber el tipus.
						for (i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
						{
							if (cdns[i]==DonaServidorCapa(ParamCtrl.capa[i_capa].servidor))
							{
								if (array_tipus.length==0)
								{
									cdns2.push(DonaCadenaLang({"cat":"Servidor principal d'aquest navegador",
																"spa":"Servidor principal de este navegador", 
																"eng":"Main Server of this browser",
																"fre":"Serveur principal du navigateur"}),":<br>");
									cdns2.push(DonaEnllacCapacitatsServidorDeCapa(i_capa, 0));
									servidor_local_trobat=true;
								}
								for (var i_tipus=0; i_tipus<array_tipus.length; i_tipus++)
								{
									if (DonaTipusServidorCapa(ParamCtrl.capa[array_tipus[i_tipus]].tipus)==DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus))
										break;
								}
								if (i_tipus<array_tipus.length)
									continue;
								array_tipus.push(i_capa);
							}
						}
						if (array_tipus.length)
						{
							cdns2.push(" (");
							for (var i_tipus=0; i_tipus<array_tipus.length; i_tipus++)
							{
								cdns2.push(DonaEnllacCapacitatsServidorDeCapa(array_tipus[i_tipus], 1));
								if (i_tipus+1<array_tipus.length)
									cdns2.push(" ,");
							}
							servidor_local_trobat=true;
						}
						if (servidor_local_trobat)
							cdns2.push(")");
						cdns2.push("<P>", DonaCadenaLang({"cat":"Altres servidors usats", "spa":"Otros servidores usados", "eng":"Others servers used", "fre":"Autres serveurs utilisés"}), ":<br>");
						break;
					}
				}
			}
			servidor_local_trobat=false;
			for (i=0; i<cdns.length; i++)
			{
				if ((!ParamCtrl.ServidorLocal || ParamCtrl.ServidorLocal.toLowerCase()!=cdns[i].toLowerCase()) && (i==0 || cdns[i-1].toLowerCase()!=cdns[i].toLowerCase()))
				{
					array_tipus.length=0;
					for (i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
					{
						if (cdns[i]==DonaServidorCapa(ParamCtrl.capa[i_capa].servidor))
						{
							for (var i_tipus=0; i_tipus<array_tipus.length; i_tipus++)
							{
								if (DonaTipusServidorCapa(ParamCtrl.capa[array_tipus[i_tipus]].tipus)==DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus))
									break;
							}
							if (i_tipus<array_tipus.length)
								continue;
							if (array_tipus.length==0)
							{
								cdns2.push(DonaEnllacCapacitatsServidorDeCapa(i_capa, 0));
								servidor_local_trobat=true;
							}
							array_tipus.push(i_capa);
						}
					}
					if (array_tipus.length)
					{
						cdns2.push(" (");
						for (var i_tipus=0; i_tipus<array_tipus.length; i_tipus++)
						{
							cdns2.push(DonaEnllacCapacitatsServidorDeCapa(array_tipus[i_tipus], 1));
							if (i_tipus+1<array_tipus.length)
								cdns2.push(" ,");
						}
						servidor_local_trobat=true;
					}
					if (servidor_local_trobat)
						cdns2.push(")<br>");
				}
			}
		}
		else
		{
			//No hi ha capes
			if(ParamCtrl.ServidorLocal && ParamCtrl.VersioServidorLocal && ParamCtrl.TipusServidorLocal)
			{
				cdns2.push(DonaCadenaLang({"cat":"Servidor principal d'aquest navegador",
											"spa":"Servidor principal de este navegador", 
											"eng":"Main Sever of this browser",
											"fre":"Serveur principal du navigateur"}),":<br><a href=\"",
					DonaRequestServiceMetadata(ParamCtrl.ServidorLocal, ParamCtrl.VersioServidorLocal, ParamCtrl.TipusServidorLocal), "\" target=\"_blank\">", 
					ParamCtrl.ServidorLocal, " (", DonaDescripcioTipusServidor(ParamCtrl.TipusServidorLocal), ")","</a><br>");
			}
			else
			{
				cdns2.push(DonaCadenaLang({"cat":"No s'han pogut determinar les adreçes dels servidors usats en aquest navegador.",
										   "spa":"No se han podido determinar las direcciones de los servidores usados en este navegador.",
										   "eng":"It could not determine the servers URL used in this browser.",
										   "fre":"Impossible de déterminer les adresses des serveurs utilisés avec ce navigateur"}));
			}
		}
		cdns2.push("</font></td></tr></table>");
		contentFinestraLayer(window, "enllacWMS", cdns2.join(""));
	}
}//Fi de OmpleFinestraEnllacWMS()

function OmpleFinestraEnllac()
{
    var elem=getLayer(window, "enllac_finestra");
    if(isLayer(elem) && isLayerVisible(elem))
    {
		var cdns=[],
		link=DonaEnllacAAquestNavegador();
		cdns.push("<form name=\"OWSContext\" class=\"floatingWindowText\" onsubmit=\"OpenOWSContext(document.OWSContext.url_context.value); return false;\">", //Returning false effectively blocks the submission of the form
			//OWSC open/save interface
			DonaCadenaLang({"cat":"Document de context OWS",
						"spa":"Documento de contexto OWS", 
						"eng":"OWS context document",
						"fre":"Document de contexte OWS"}),
			":<br><input type=\"text\" name=\"url_context\" value=\"\"><input type=\"submit\" value=\"",
			DonaCadenaLang({"cat":"Obrir", "spa":"Abrir", "eng":"Open","fre":"Ouvrir"}),
			"\">",
			"<input type=\"button\" value=\"",
			DonaCadenaLang({"cat":"Desar","spa":"Guardar","eng":"Save","fre":"Sauvegarder"}),
			"\" onClick=\"SaveOWSContext(document.OWSContext.url_context.value);\"><br>",
			//OWSC previewer (here will appear the info about the OWSC when loaded)
			//Direct link to de view (until the OWSC is loaded, a link to the current view)
			"</form><div id=\"OWSC_previewer\">",
			DonaCadenaLang({"cat":"Enllaç a aquesta vista",
							"spa":"Enlace a esta vista", 
							"eng":"Link to this view",
							"fre":"Lien à cette vue"}),					
			":<br><a href=\"",link,"\">",
			link,
			"</a></div>");
		contentFinestraLayer(window, "enllac", cdns.join(""));
    }
}

function EsEnvDinsMapaSituacio(env_actual)
{
	return EsEnvDinsEnvolupant(env_actual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS);
}//Fi de EsPuntDinsAmbitNavegacio()

function EsPuntDinsAmbitNavegacio(punt)
{
	return EsPuntDinsEnvolupant(punt, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS);
}//Fi de EsPuntDinsAmbitNavegacio()

function EsPuntDinsEnvolupant(punt, env)
{
	if (punt.x>env.MaxX ||
	    punt.x<env.MinX ||
	    punt.y>env.MaxY ||
	    punt.y<env.MinY)
		return false;	

	return true;
}//Fi de EsPuntDinsEnvolupant()


function EsEnvDinsEnvolupant(env_actual, env_situacio)
{
	if (env_actual.MinX>env_situacio.MaxX ||
	    env_actual.MaxX<env_situacio.MinX ||
	    env_actual.MinY>env_situacio.MaxY ||
	    env_actual.MaxY<env_situacio.MinY)
		return false;	

	return true;
}//Fi de EsEnvDinsEnvolupant()

var PuntCoord={"x": 0.0, "y": 0.0};

function AnarACoordenada(form)
{
var d, crs_xy;	

	PuntCoord.x=parseFloat(form.coordX.value);
	PuntCoord.y=parseFloat(form.coordY.value);

	if(isNaN(PuntCoord.x) || isNaN(PuntCoord.y))
	{
  	   alert(DonaCadenaLang({"cat":"Format de les coordenades erroni:\nS'ha d'indicar un valor numèric.", 
						"spa":"Formato de las coordenadas erróneo:\nSe debe indicar un valor numérico.", 
						"eng":"Coordinate format is incorrectly:\nIt Must indicate a numeric value.",
						"fre":"Format des coordonnées erroné:\nVous devez indiquer une valeur numérique."}));
	   return;	  
	}	

	FormAnarCoord.x=PuntCoord.x;
	FormAnarCoord.y=PuntCoord.y;

	//Ho transformo si cal de long/lat a les coordenades de la projecció
	if(form.proj[1].checked)
	{
   	   crs_xy=DonaCoordenadesCRS(PuntCoord.x,PuntCoord.y,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	   PuntCoord.x=crs_xy.x;
	   PuntCoord.y=crs_xy.y;
	   FormAnarCoord.proj=false;
	}
	else
	   FormAnarCoord.proj=true;

	if(!EsPuntDinsAmbitNavegacio(PuntCoord))
	{
  	   alert(DonaCadenaLang({"cat":"El punt sol·licitat està fora de l'àmbit de navegació", 
						 "spa":"El punto solicitado está fuera del ámbito de navegación", 
						 "eng":"The requested point is outside browser envelope",
						 "fre":"Le point requis se trouve dehors le milieu de navigation"}));
	   return;
	}

	//Dibuixo la icona per mostrar el punt consultat
	if (i_objdigi_anar_coord>=0)
	{
		var capa=ParamCtrl.capa[i_objdigi_anar_coord];
		capa.objectes.features[0].geometry.coordinates[0]=PuntCoord.x;
		capa.objectes.features[0].geometry.coordinates[1]=PuntCoord.y;
		capa.visible="si";
		CreaVistes();
	}
	
	d=parseFloat(form.mVoltant.value);
	if(isNaN(d))
	    d=0;
	FormAnarCoord.proj=d;

	if(d>0)
	{
	   var env=DonaEnvDeXYAmpleAlt(PuntCoord.x, PuntCoord.y, d, d);   
    	   //env=AjustaAmbitAAmbitNavegacio(env);
	   PortamAAmbit(env);	
	}
	else
	{
	   PortamAPunt(PuntCoord.x,PuntCoord.y);	
	}
}//Fi de AnarACoordenada() 

function CanviaEtiquetes(sel)
{
	if(sel == 0)
	{
		window.document.getElementById('X_anarcoord').innerHTML = "X: ";
		window.document.getElementById('Y_anarcoord').innerHTML = "Y: ";
	}
	else
	{
		window.document.getElementById('X_anarcoord').innerHTML = "Lon: ";
		window.document.getElementById('Y_anarcoord').innerHTML = "Lat: ";
	}
}//Fi de CanviaEtiquetes()


//Fer un click sobre la vista.

var AmbitZoomRectangle={"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0};
var ZRec_1PuntClient={"x": 0, "y": 0};
var HiHaHagutMoviment=false;
var HiHaHagutPrimerClick=false;
var NovaVistaFinestra={"n": 0, "vista":[]};

function ClickSobreVista(event_de_click, i_nova_vista)
{
var i_vista;

	if (ParamCtrl.EstatClickSobreVista=="ClickConLoc")
		ConsultaSobreVista(event_de_click, i_nova_vista);
	else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
		EditarPunts(event_de_click, i_nova_vista);
	else if (ParamCtrl.EstatClickSobreVista=="ClickMouMig")
	{
		PortamAPunt(DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX), DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY));
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan1")
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
		ZRec_1PuntClient.x=event_de_click.clientX;
		ZRec_1PuntClient.y=event_de_click.clientY;
		
		ParamCtrl.EstatClickSobreVista="ClickPan2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan2")
	{
		if (!HiHaHagutMoviment)
			return;
		//Calculo el moviment que s'ha de produir i el faig.
		MouLaVista(AmbitZoomRectangle.MinX-DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX),
		AmbitZoomRectangle.MinY-DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY));
		ParamCtrl.EstatClickSobreVista="ClickPan1";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec1")
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
		ZRec_1PuntClient.x=event_de_click.clientX;
		ZRec_1PuntClient.y=event_de_click.clientY;
	
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_z_rectangle"), 
				 ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ event_de_click.clientX-DonaOrigenEsquerraVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeEsquerraVista(i_nova_vista), 
				 ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+ event_de_click.clientY-DonaOrigenSuperiorVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeSuperiorVista(i_nova_vista), 
				 ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ event_de_click.clientX-DonaOrigenEsquerraVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeEsquerraVista(i_nova_vista), 
				 ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+event_de_click.clientY-DonaOrigenSuperiorVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeSuperiorVista(i_nova_vista));
			showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_z_rectangle"));
		}
		ParamCtrl.EstatClickSobreVista="ClickZoomRec2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" &&  i_nova_vista==-1)
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
		ZRec_1PuntClient.x=event_de_click.clientX;
		ZRec_1PuntClient.y=event_de_click.clientY;
	
		moveLayer2(getLayer(window, event_de_click.target.parentElement.id+"_z_rectangle"), 
				 ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ event_de_click.clientX-DonaOrigenEsquerraVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeEsquerraVista(i_nova_vista), 
				 ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+ event_de_click.clientY-DonaOrigenSuperiorVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeSuperiorVista(i_nova_vista), 
				 ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ event_de_click.clientX-DonaOrigenEsquerraVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeEsquerraVista(i_nova_vista), 
				 ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+event_de_click.clientY-DonaOrigenSuperiorVista(event_de_click.target.parentElement, i_nova_vista)+DonaMargeSuperiorVista(i_nova_vista));
		showLayer(getLayer(window, event_de_click.target.parentElement.id+"_z_rectangle"));
		ParamCtrl.EstatClickSobreVista="ClickNovaVista2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec2")
	{
		if (!HiHaHagutMoviment)
			return;
		if (AmbitZoomRectangle.MinX<DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX))
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
		else
		{
			AmbitZoomRectangle.MaxX=AmbitZoomRectangle.MinX;
			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
		}
		if (AmbitZoomRectangle.MinY<DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY))
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
		else
		{
			AmbitZoomRectangle.MaxY=AmbitZoomRectangle.MinY;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
		}
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_z_rectangle"));
		if (ParamCtrl.ConsultaTipica)
			PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
		PortamAAmbit(AmbitZoomRectangle);
		ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista2" && i_nova_vista==-1)
	{
		if (!HiHaHagutMoviment)
			return;
		if (AmbitZoomRectangle.MinX<DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX))
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
		else
		{
			AmbitZoomRectangle.MaxX=AmbitZoomRectangle.MinX;
			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientX);
		}
		if (AmbitZoomRectangle.MinY<DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY))
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
		else
		{
			AmbitZoomRectangle.MaxY=AmbitZoomRectangle.MinY;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event_de_click.target.parentElement, i_nova_vista, event_de_click.clientY);
		}
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_z_rectangle"));
		if (ParamCtrl.ConsultaTipica)
			PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);

		var di, dj, min_i, min_j;
		if (event_de_click.clientX>ZRec_1PuntClient.x)
		{
			min_i=ZRec_1PuntClient.x;
			di= event_de_click.clientX-ZRec_1PuntClient.x
		}
		else
		{
			min_i=event_de_click.clientX;
			di= ZRec_1PuntClient.x-event_de_click.clientX;
		}
		if (event_de_click.clientY>ZRec_1PuntClient.y)
		{
			min_j=ZRec_1PuntClient.y;
			dj= event_de_click.clientY-ZRec_1PuntClient.y
		}
		else
		{
			min_j=event_de_click.clientY;
			dj= ZRec_1PuntClient.y-event_de_click.clientY;
		}
		min_i=((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ min_i + DonaMargeEsquerraVista(i_nova_vista);
		min_j=((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+ min_j + DonaMargeSuperiorVista(i_nova_vista);
		min_j-=AltBarraFinestraLayer*2;
		dj+=AltBarraFinestraLayer;
		
		var nom_nova_vista=prefixNovaVistaFinestra+NovaVistaFinestra.n;
		insertContentLayer(getLayer(window, event_de_click.target.parentElement.id), "afterEnd", textHTMLFinestraLayer(nom_nova_vista, {"cat": "Vista "+(NovaVistaFinestra.n+1), "spa": "Vista "+(NovaVistaFinestra.n+1), "eng": "View "+(NovaVistaFinestra.n+1), "fre": "Vue "+(NovaVistaFinestra.n+1) }, boto_tancar, min_i-1, min_j-1, di, dj, "NW", "no", true, null, null));
		OmpleBarraFinestraLayerNom(window, nom_nova_vista);
		dj-=(AltBarraFinestraLayer+1);
		di-=1;
		NovaVistaFinestra.vista[NovaVistaFinestra.n]={ "EnvActual": {"MinX": AmbitZoomRectangle.MinX, "MaxX": AmbitZoomRectangle.MinX+ParamInternCtrl.vista.CostatZoomActual*di, "MinY": AmbitZoomRectangle.MinY+ParamInternCtrl.vista.CostatZoomActual*AltBarraFinestraLayer, "MaxY": AmbitZoomRectangle.MinY+ParamInternCtrl.vista.CostatZoomActual*(AltBarraFinestraLayer+dj)},
				 "nfil": dj,
				 "ncol": di,
				 "CostatZoomActual": ParamInternCtrl.vista.CostatZoomActual,
				 "i_vista": DonaIVista(event_de_click.target.parentElement.id),
				 "i_nova_vista": NovaVistaFinestra.n};
		//alert(JSON.stringify(NovaVistaFinestra.vista[NovaVistaFinestra.n], null, "\t"));
		CreaVistaImmediata(window, nom_nova_vista+"_finestra", NovaVistaFinestra.vista[NovaVistaFinestra.n]);
		NovaVistaFinestra.n++;

		ParamCtrl.EstatClickSobreVista="ClickNovaVista1";
	}
	HiHaHagutPrimerClick=false;
}



function CanviaEstatClickSobreVista(estat)
{
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_z_rectangle"));
	ParamCtrl.EstatClickSobreVista=estat;
	CanviaCursorSobreVista(null);
}

function CanviaEstatClickSobreVistaEvent(event, estat)
{
	CanviaEstatClickSobreVista(estat);
	dontPropagateEvent(event);
}

function DonaValorDeCoordActual(x,y,negreta,input)
{
var cdns=[], ll;
	if (ParamCtrl.CoordActualProj==true)
	{
		cdns.push((negreta ? "<b>" : ""),
			(input ? " X: " : " X,Y: "),
			(negreta ? "</b>" : ""),				   
			(input ? "<input type=\"text\" name=\"coord_e_x\" class=\"input_coord\" value=\"" : ""),
			OKStrOfNe(x,ParamCtrl.NDecimalsCoordXY),
			(input ? ( negreta ? "\" readonly>/><b>Y:</b> <input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" :
			"\" readonly/>Y:<input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" ) : ", "),
			OKStrOfNe(y,ParamCtrl.NDecimalsCoordXY),
			(input ? "\" readonly>" : ""));	
	}
	if (ParamCtrl.CoordActualLongLatG==true)
	{
		if (ParamCtrl.CoordActualProj==true &&
			ParamCtrl.EstilCoord && ParamCtrl.EstilCoord=="area")
			cdns.push("\n");
		ll=DonaCoordenadesLongLat(x,y,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push((negreta ? "<b>" : ""),
			(input ? " Long: " : " Long,Lat: "),
			(negreta ? "</b>" : ""),				   
			(input ? "<input type=\"text\" name=\"coord_e_x\" class=\"input_coord\" value=\"" : ""),
			ParamCtrl.CoordActualLongLatGMS==true ? g_gms(ll.x, true) : OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4),
			(input ? ( negreta ? "\" readonly/><b>Lat:</b> <input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" :
			"\" readonly/>Lat: <input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" ) : ", "),
			ParamCtrl.CoordActualLongLatGMS==true ? g_gms(ll.y, true) : OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4),
			(input ? "\" readonly/>" : ""));
	}
	return cdns.join("");
}

function MostraValorDeCoordActual(i_nova_vista, x, y)
{
	if (window.document.form_coord && window.document.form_coord.info_coord)
	{
		var cdns=[], i, j, vista;
		cdns.push(DonaValorDeCoordActual(x, y, false, false));

		vista=DonaVistaDesDeINovaVista(i_nova_vista);

		i=Math.round((x-vista.EnvActual.MinX)/vista.CostatZoomActual);
		j=Math.round((vista.EnvActual.MaxY-y)/vista.CostatZoomActual);
		
		if (i>=0 && i<vista.ncol && j>=0 && j<vista.nfil)
		{
			for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
			{
				if (EsCapaVisibleAAquestNivellDeZoom(i_capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=-1 ? vista.i_vista : 0/*S'hauria de fer això però no se el nom de la vista: DonaIVista(nom_vista)*/, i_capa) &&
					ParamCtrl.capa[i_capa].model!=model_vector && HiHaDadesBinariesPerAquestaCapa(i_nova_vista, i_capa))
				{
					var s=DonaValorEstilComATextDesDeValorsCapa(i_nova_vista, i_capa, DonaValorsDeDadesBinariesCapa(i_nova_vista, ParamCtrl.capa[i_capa], null, i, j));
					if (s=="")
						continue;
					if (ParamCtrl.EstilCoord && ParamCtrl.EstilCoord=="area")
						cdns.push("\n");
					else
						cdns.push("; ");
					cdns.push(DonaDescripcioValorMostrarCapa(i_capa, true), ": ", s);
				}
			}
		}
		window.document.form_coord.info_coord.value=cdns.join("");
	}
}

function IniciClickSobreVista(event_de_click, i_nova_vista)
{
/* http://unixpapa.com/js/mouse.html*/

	if (ParamCtrl.ZoomUnSolClic==true)
	{
	    HiHaHagutPrimerClick=true;
	    if (ParamCtrl.EstatClickSobreVista!="ClickPan2" && ParamCtrl.EstatClickSobreVista!="ClickZoomRec2" && ParamCtrl.EstatClickSobreVista!="ClickNovaVista2")
		    HiHaHagutMoviment=false;
	    if (ParamCtrl.EstatClickSobreVista=="ClickPan1" || ParamCtrl.EstatClickSobreVista=="ClickZoomRec1" || (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" && i_nova_vista==-1))
	    {
			if (event_de_click.which == null)
			{
				if (event_de_click.button==1)
					ClickSobreVista(event_de_click, i_nova_vista);
			}
			else
			{
				if (event_de_click.which==1)
					ClickSobreVista(event_de_click, i_nova_vista);
			}
		}
	}
}

var NPanVista=0;

function PanVistes(cx, cy, cx_ori, cy_ori)
{
var w,xm,xc,h,ym,yc;
var elem;
var i_pan_vista;

	xm=DonaMargeEsquerraVista(-1)+1+cx-cx_ori;
	//alert(OrigenEsquerraVista+ " " +cx +"  " +cx_ori);
	if (cx_ori>cx)
	{
		w=ParamInternCtrl.vista.ncol-cx_ori+cx;
		xc=cx_ori-cx;
	}
	else
	{
		w=ParamInternCtrl.vista.ncol-cx+cx_ori;
		xc=0;
	}

	ym=DonaMargeSuperiorVista(-1)+1+cy-cy_ori;
	if (cy_ori>cy)
	{
		h=ParamInternCtrl.vista.nfil-cy_ori+cy;
		yc=cy_ori-cy;
	}
	else
	{
		h=ParamInternCtrl.vista.nfil-cy+cy_ori;
		yc=0;
	}

	NPanVista++;
	i_pan_vista=NPanVista;

	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		for (var i=0; i<ParamCtrl.capa.length; i++)
		{
			if (i_pan_vista!=NPanVista)
				return;
			var capa=ParamCtrl.capa[i];
			if (capa.model==model_vector)
			{
				//if (capa.visible!="no" &&  EsObjDigiVisibleAAquestNivellDeZoom(capa))
				if (EsCapaVisibleAAquestNivellDeZoom(i) &&  EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					if (!capa.objectes || !capa.objectes.features)
						continue;
					elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+"_l_capa"+i);
					moveLayer(elem, xm, ym, ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil);
					clipLayer(elem, xc, yc, w, h);
				}
		    }
			else 
			{
				if (EsCapaVisibleAAquestNivellDeZoom(i) &&  EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i);
					if ((DonaTipusServidorCapa(capa.tipus)=="TipusWMS_C" || DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_REST" || DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_KVP" 
						|| DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_SOAP"/* || DonaTipusServidorCapa(capa.tipus)=="TipusGoogle_KVP"*/) && capa.VistaCapaTiled.TileMatrix)
					{
						moveLayer(elem, xm-capa.VistaCapaTiled.dx, ym-capa.VistaCapaTiled.dy, ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil);
						clipLayer(elem, xc+capa.VistaCapaTiled.dx, yc+capa.VistaCapaTiled.dy, w, h);
					}
					else
					{
						moveLayer(elem, xm, ym, ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil);
						clipLayer(elem, xc, yc, w, h);
					}
				}
			}
		}
	}
}

function MovimentSobreVista(event_de_moure, i_nova_vista)
{
	var x=DonaCoordXDeCoordSobreVista(event_de_moure.target.parentElement, i_nova_vista, event_de_moure.clientX);
	var y=DonaCoordYDeCoordSobreVista(event_de_moure.target.parentElement, i_nova_vista, event_de_moure.clientY);
	MostraValorDeCoordActual(i_nova_vista, x, y);
	if (ParamCtrl.ZoomUnSolClic==true && HiHaHagutPrimerClick &&
	    ParamCtrl.EstatClickSobreVista!="ClickZoomRec1" && ParamCtrl.EstatClickSobreVista!="ClickZoomRec2" &&
        ParamCtrl.EstatClickSobreVista!="ClickNovaVista1" && ParamCtrl.EstatClickSobreVista!="ClickNovaVista2" &&
	    ParamCtrl.EstatClickSobreVista!="ClickPan1" && ParamCtrl.EstatClickSobreVista!="ClickPan2" && 
		ParamCtrl.EstatClickSobreVista!="ClickEditarPunts" &&
		ParamCtrl.EstatClickSobreVista!="ClickMouMig" &&
		ParamCtrl.EstatClickSobreVista!="ClickConLoc") 
	{		
		ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
		CreaBarra(null);
		ClickSobreVista(event_de_moure);
	}

	if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec2" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2")
	{
		for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_z_rectangle"), 
				 ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ ZRec_1PuntClient.x-DonaOrigenEsquerraVista(event_de_moure.target.parentElement, i_nova_vista)+DonaMargeEsquerraVista(i_nova_vista), 
				 ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+ ZRec_1PuntClient.y-DonaOrigenSuperiorVista(event_de_moure.target.parentElement, i_nova_vista)+DonaMargeSuperiorVista(i_nova_vista), 
				 ((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ event_de_moure.clientX-DonaOrigenEsquerraVista(event_de_moure.target.parentElement, i_nova_vista)+DonaMargeEsquerraVista(i_nova_vista), 
				 ((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+event_de_moure.clientY-DonaOrigenSuperiorVista(event_de_moure.target.parentElement, i_nova_vista)+DonaMargeSuperiorVista(i_nova_vista));
		HiHaHagutMoviment=true;
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan2")
	{
		PanVistes(event_de_moure.clientX, event_de_moure.clientY, ZRec_1PuntClient.x, ZRec_1PuntClient.y);
		HiHaHagutMoviment=true;
	}
}

function CreaCoordenades()
{
var s, elem=getLayer(window, "coord");
	if (isLayer(elem))
	{
		s="<form name=\"form_coord\" onSubmit=\"return false;\"><table style=\"width: 100%\"><tr><td style=\"width: 1\"><span class=\"text_coord\">"+
			   (ParamCtrl.TitolCoord ? DonaCadena(ParamCtrl.TitolCoord) : "Coord: ")+
			   "</span></td>";
		if (ParamCtrl.EstilCoord && ParamCtrl.EstilCoord=="area")
			s+="</tr><tr><td><textarea CLASS=\"input_info_coord\" name=\"info_coord\" style=\"width: 97%; height: "+ (elem.clientHeight-25) +"px\" readonly=\"readonly\"></textarea></td>";
		else
			s+="<td><input class=\"input_info_coord\" type=\"text\" name=\"info_coord\" style=\"width: 97%\" readonly=\"readonly\"></td>";
		s+="</tr></table></form>"
		contentLayer(elem, s);
		elem.style.opacity=0.8;
		elem.style.backgroundColor="#FFFFFF";
	}
}

function CreaAtribucioVista()
{
var elem=getLayer(window, "atribucio");
	if (isLayer(elem))
	{
		var cdns=[], atrib=[], i, j;

		cdns.push("<table style=\"width: 100%\"><tr><td align=\"right\"><span class=\"atribucio\">MiraMon<sup>&copy;</sup>");
		if (ParamCtrl.capa && ParamCtrl.capa.length)
		{
			for (i=ParamCtrl.capa.length-1; i>=0; i--)
			{
				var capa=ParamCtrl.capa[i];
				/*if (capa.model==model_vector)
				{
					if (EsObjDigiVisibleAAquestNivellDeZoom(capa) && capa.atribucio)
						atrib.push(DonaCadena(capa.atribucio));
				}
				else
				{*/
					if (EsCapaVisibleAAquestNivellDeZoom(i) && EsCapaVisibleEnAquestaVista(0/*i_vista*/, i) && capa.atribucio)
						atrib.push(DonaCadena(capa.atribucio));
				//}
			}
		}		
		for (i=0; i<atrib.length; i++)
		{
			for (j=0; j<i; j++)
			{
				if (atrib[i]==atrib[j])
				{
					atrib.splice(i,1);  //Elimino el repetit.
					i--;
					break;
				}
			}	
		}
		if (atrib.length)
			cdns.push("|");
		cdns.push(atrib.join(","), "</span></td></tr></table>");
		contentLayer(elem, cdns.join(""));
	}
}


function MovimentSobreSituacio(event_de_moure)
{
	MostraValorDeCoordActual(-1, DonaCoordXDeCoordSobreSituacio(event_de_moure.clientX), DonaCoordYDeCoordSobreSituacio(event_de_moure.clientY));
}

function PortamAVistaGeneral()
{
	if (ParamCtrl.ConsultaTipica)
		PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
	GuardaVistaPrevia();
	CanviaAVistaGeneral();
}
function PortamAVistaGeneralEvent(event) //Afegit Cristian 19/01/2016
{
	PortamAVistaGeneral();
	dontPropagateEvent(event);
}
function TransformaEnvolupant(env, crs_ori, crs_dest)
{
var env_ll;
	env_ll=DonaEnvolupantLongLat(env, crs_ori);
	return DonaEnvolupantCRS(env_ll, crs_dest);
}

function TransformaCoordenadesPunt(punt, crs_ori, crs_dest)
{
	if (crs_ori!=crs_dest)
	{
		var ll=DonaCoordenadesLongLat(punt.x, punt.y,crs_ori);
		var crs_xy=DonaCoordenadesCRS(ll.x, ll.y, crs_dest);
		punt.x=crs_xy.x;
		punt.y=crs_xy.y;
	}
}	

function CanviaCRSITransformaCoordenadesCapaDigi(crs_dest)
{
	for(var i=0; i<ParamCtrl.capa.length; i++)
	{
		var capa=ParamCtrl.capa[i];
		if (capa.model==model_vector)
		{
			if(capa.CRSgeometry &&
			   capa.CRSgeometry.toUpperCase()!=crs_dest.toUpperCase() && capa.objectes && capa.objectes.features)
			{
				for(var j=0; j<capa.objectes.features.length; j++)
				{
					capa.objectes.features[j].puntCRSactual=[];
					capa.objectes.features[j].puntCRSactual[0]={"x": capa.objectes.features[j].geometry.coordinates[0], "y": capa.objectes.features[j].geometry.coordinates[1]};
					TransformaCoordenadesPunt(capa.objectes.features[j].puntCRSactual[0], capa.CRSgeometry, crs_dest);
				}
			}
		}
	}
}

function TransformaCoordenadesCapaDigiVolatils(crs_ori, crs_dest)
{
var punt, capa;
	if(i_objdigi_consulta!=-1)
	{
		capa=ParamCtrl.capa[i_objdigi_consulta];
		punt={"x": capa.objectes.features[0].geometry.coordinates[0], 
			"y": capa.objectes.features[0].geometry.coordinates[1]}
		TransformaCoordenadesPunt(punt, crs_ori, crs_dest);
		capa.objectes.features[0].geometry.coordinates[0]=punt.x;
		capa.objectes.features[0].geometry.coordinates[1]=punt.y;
		capa.CRSgeometry=crs_dest;
	}
	if(i_objdigi_anar_coord!=-1)
	{
		capa=ParamCtrl.capa[i_objdigi_anar_coord];
		punt={"x": capa.objectes.features[0].geometry.coordinates[0], 
			"y": capa.objectes.features[0].geometry.coordinates[1]}
		TransformaCoordenadesPunt(punt, crs_ori, crs_dest);
		capa.objectes.features[0].geometry.coordinates[0]=punt.x;
		capa.objectes.features[0].geometry.coordinates[1]=punt.y;
		capa.CRSgeometry=crs_dest;
	}
	if(i_objdigi_edicio!=-1)
	{
		capa=ParamCtrl.capa[i_objdigi_edicio];
		punt={"x": capa.objectes.features[0].geometry.coordinates[0], 
			"y": capa.objectes.features[0].geometry.coordinates[1]}
		TransformaCoordenadesPunt(punt, crs_ori, crs_dest);
		capa.objectes.features[0].geometry.coordinates[0]=punt.x;
		capa.objectes.features[0].geometry.coordinates[1]=punt.y;
		capa.CRSgeometry=crs_dest;
		if(ParamCtrl.BarraBotoInsereix==true && ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
			eval(ParamCtrl.FuncioIconaEdicio);		
	}
}

function CanviaCRS(crs_ori, crs_dest)
{
var factor=1;
var i;

	TransformaCoordenadesPunt(ParamInternCtrl.PuntOri, crs_ori, crs_dest);
	TransformaCoordenadesPunt(PuntConsultat, crs_ori, crs_dest);
	
	//He de transformar les coordenades dels objectes digitalitzats a memòria
	TransformaCoordenadesCapaDigiVolatils(crs_ori, crs_dest);
	
	//i també de les CapesDigitalitzades
	CanviaCRSITransformaCoordenadesCapaDigi(crs_dest);

	if (DonaUnitatsCoordenadesProj(crs_ori)=="m" && DonaUnitatsCoordenadesProj(crs_dest)=="°")
	{
		factor=1/120000; // Aquí no apliquem FactotGrausAMetres perquè volem obtenir un costat de zoom arrodonit.
		ParamCtrl.NDecimalsCoordXY+=4;
	}
	else if (DonaUnitatsCoordenadesProj(crs_ori)=="°" && DonaUnitatsCoordenadesProj(crs_dest)=="m")
	{
		factor=120000; // Aquí no apliquem FactotGrausAMetres perquè volem obtenir un costat de zoom arrodonit.
		ParamCtrl.NDecimalsCoordXY-=4;
		if (ParamCtrl.NDecimalsCoordXY<0)
		    ParamCtrl.NDecimalsCoordXY=0;	
	}
	if (factor!=1)
	{
		for (i=0; i<ParamCtrl.zoom.length; i++)
		{
			ParamCtrl.zoom[i].costat=ArrodoneixSiSoroll(ParamCtrl.zoom[i].costat*=factor);
		}
		for (i=0; i<ParamCtrl.capa.length; i++)	
		{
			ParamCtrl.capa[i].CostatMinim=ArrodoneixSiSoroll(ParamCtrl.capa[i].CostatMinim*=factor);
			ParamCtrl.capa[i].CostatMaxim=ArrodoneixSiSoroll(ParamCtrl.capa[i].CostatMaxim*=factor);
		}
		ParamInternCtrl.vista.CostatZoomActual=ArrodoneixSiSoroll(ParamInternCtrl.vista.CostatZoomActual*=factor);
		CreaBarra(crs_dest);
	}
	ActualitzaEnvParametresDeControl();	
}

//No crida GuardaVistaPrevia()
function CanviaAVistaGeneral()
{
var i_max;
	//busco la vista de més extensió
	i_max=0;
	for (var i=1; i<ParamCtrl.ImatgeSituacio.length; i++)
	{
		if ((ParamInternCtrl.EnvLLSituacio[i_max].MaxX-ParamInternCtrl.EnvLLSituacio[i_max].MinX)+
			(ParamInternCtrl.EnvLLSituacio[i_max].MaxY-ParamInternCtrl.EnvLLSituacio[i_max].MinY)<
		    (ParamInternCtrl.EnvLLSituacio[i].MaxX-ParamInternCtrl.EnvLLSituacio[i].MinX)+
			(ParamInternCtrl.EnvLLSituacio[i].MaxY-ParamInternCtrl.EnvLLSituacio[i].MinY))
				i_max=i;
	}
	/*if (i_max!=ParamInternCtrl.ISituacio)
	{
		if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS!=ParamCtrl.ImatgeSituacio[i_max].EnvTotal.CRS)
			CanviaCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ParamCtrl.ImatgeSituacio[i_max].EnvTotal.CRS);
		ParamInternCtrl.ISituacio=i_max;
	}*/
    CentraLaVista((ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxX+ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinX)/2,																												
    	(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MaxY+ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS.MinY)/2);
	
    if (ParamInternCtrl.vista.CostatZoomActual!=ParamCtrl.zoom[0].costat)
	    CanviaNivellDeZoom(0);
    else
		RepintaMapesIVistes();
}

function PortamANivellDeZoom(nivell)
{
	if (ParamCtrl.ConsultaTipica)
		PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
	GuardaVistaPrevia();
	return CanviaNivellDeZoom(nivell);
}
function PortamANivellDeZoomEvent(event, nivell) //Afegit Cristian 19/01/2016
{
	dontPropagateEvent(event);
	PortamANivellDeZoom(nivell);
}

//No crida GuardaVistaPrevia()
function CanviaNivellDeZoom(nivell)
{
	if (nivell<0)
	{
		alert(DonaCadenaLang({"cat":"No hi ha zoom inferior a mostrar.", "spa":"No hay zoom inferior a mostrar.", 
						  "eng":"There is no more zoom out to be shown.", "fre":"Il n'y a pas un zoom inférieur à montrer"}));
		nivell=0;
		CanviaAVistaGeneral();
	}
	else if (nivell>=ParamCtrl.zoom.length)
	{
		alert(DonaCadenaLang({"cat":"No hi ha zoom superior a mostrar.", "spa":"No hay zoom superior a mostrar.", 
						  "eng":"There is no more zoom in to be shown.","fre":"Il n'y a pas un zoom supérieur à montrer"}));
		nivell=ParamCtrl.zoom.length-1;
	}
	if (ParamCtrl.ZoomContinu==true || nivell!=DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual))  //Evito canviar de nivell al nivell actual.
	{
		ParamInternCtrl.vista.CostatZoomActual=ParamCtrl.zoom[nivell].costat;
		RevisaEstatsCapes();
		CreaLlegenda();
		if (window.document.zoom.nivell)
			window.document.zoom.nivell.selectedIndex = nivell;
		CentraLaVista((ParamInternCtrl.vista.EnvActual.MaxX+ParamInternCtrl.vista.EnvActual.MinX)/2,(ParamInternCtrl.vista.EnvActual.MaxY+ParamInternCtrl.vista.EnvActual.MinY)/2);
		RepintaMapesIVistes();
	}
	return false;  //evitar el submit del formulari
}

var MMZWindow=null;
function ObtenirMMZ()
{
	if (MMZWindow==null || MMZWindow.closed)
	{
	    MMZWindow=window.open("mmz.htm","FinestraMMZ",'toolbar=no,status=no,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=500,height=320');
            ShaObertPopUp(MMZWindow);
	}
	else
	{
	    MMZWindow.focus();
	    MMZWindow.mmz1.RedibuixaMMZ();    
	}
}

/*
var WCSWindow=null;
var i_capa_wcs;
function ObreFinestraWCS(i)
{
    i_capa_wcs=i;
    if (WCSWindow==null || WCSWindow.closed)
    {
        WCSWindow=window.open("wcs.htm","FinestraWCS",'toolbar=no,status=no,scrollbars=no,location=no,menubar=no,directories=no,resizable=yes,width=500,height=550');
        ShaObertPopUp(WCSWindow);
    }
    else
    {
        WCSWindow.focus();
		WCSWindow.wcs1.DibuixaOpcionsWCS();    
    }	
}
*/

function AvaluaRespostaEstatDescarrega(doc, param_extra)
{
var percentatge=-1, s="";
var nom_fitxer, descp_fitxer;
var node, node2;

	//en cas d'error crec que hauria de modificar el formulari perquè no estigui esperant indefinidament el fitxer
	if(doc)
	{
		var root=doc.documentElement;	
		if(root)
		{
			node=root.getElementsByTagName('status');
			node=node[0];
			if(node && node.childNodes)
			{
				for(var i=0; i<node.childNodes.length; i++)
				{
					node2=node.childNodes[i];
					if(node2.nodeName=="ProcessAccepted")
					{
						percentatge=0;
						break;
					}
					else if(node2.nodeName=="ProcessStarted")
					{
						percentatge=node2.getAttribute('percentCompleted');
						break;
					}
					else if(node2.nodeName=="ProcessSucceeded")
					{
						percentatge=100;
						break;
					}
				}
				s=node2.textContent;
			}
		}
	}
	
	if(percentatge==-1)
	{
		alert(DonaCadenaLang({"cat":"S'ha produït algun error durant l'enviament del fitxer. Torna-ho a intentar",
						  "spa":"Se ha producido algun error durante el envío del fichero. Vuélvalo a intentar",
						  "eng":"Has been occurred an error while sending the file. Try again",
						  "fre":"Une erreur vient de se produire pendant l'envoi du fichier. Réessayez"}));
		CanviaEstatEventConsola(null, param_extra.i_event, EstarEventError);
		return;
	}
	document.getElementById("finestra_download_status").innerHTML=s;
	if(percentatge>=0 && percentatge<100)
		param_extra.timeout=setTimeout("CreaEstatDescarrega("+param_extra.temps+", "+param_extra.i_capa_wcs+")", param_extra.temps);
	else
		CanviaEstatEventConsola(null, param_extra.i_event, EstarEventTotBe);

	return;
}

function CreaEstatDescarrega(temps, i_capa_wcs, i_event)
{
var cdns=[], cadena_cgi;

	cdns.push("VERSION=1.1.0&REQUEST=DonaEstatProces&IDPROCES=", self.IdProces, "_", self.NIdProces, "&FORMAT=text/xml");  //"&TEMPS_REFRESC=", temps
	cadena_cgi=AfegeixNomServidorARequest(DonaServidorCapa(ParamCtrl.capa[i_capa_wcs].servidor), cdns.join(""), ParamCtrl.UsaSempreMeuServidor==true ? true : false);

	//parent.wcs3.location.href=cadena_cgi;
	//document.getElementById("finestra_download_status").innerHTML=cadena_cgi;
	loadFile(cadena_cgi, "text/xml", AvaluaRespostaEstatDescarrega, function(text, param_extra) {alert(text); if (param_extra.timeout){ clearTimeout(param_extra.timeout), param_extra.timeout=null}}, {"temps": temps, "i_capa_wcs": i_capa_wcs, "i_event": i_event, "timeout": null});
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

function DescarregaWCS(oferir_vincle, i_capa_wcs)
{
var cdns=[], cdns_req=[], capa=ParamCtrl.capa[i_capa_wcs];

	cdns.push("<CENTER>"+DonaCadenaLang({"cat":"Espereu si us plau", "spa":"Espere por favor", "eng":"Please, wait", "fre":"Attendez, s'il-vous-plaît"})+"...<br>"+
						   "<small>("+
						DonaCadenaLang({"cat":"La generació de la descàrrega de la capa podria trigar alguns minuts",
										"spa":"La generación de la descarga de la capa podría demorarse algunos minutos",
										"eng":"Generación of layer to be download can be take some minutes",
										"fre":"La création du téléchargement de la couche pourrai prendre quelques minutes"}) +
						")</small><br>"+
						DonaCadenaLang({"cat":"Preparant la capa sol·licitada", 
									"spa":"Preparando la capa solicitada",
									"eng":"Preparing the requeried layer",
									"fre":"En préparant la couche demandée"}) +
						":<br>");
//canvi d'ambit si la consulta és completa i hi ha sel·leccionat x,y o ambit.
	cdns.push(DonaCadena(capa.desc));
	cdns.push("</CENTER>");
	contentLayer(getLayer(window, "finestra_download_opcions"), cdns.join(""));

	var env=DonaEnvolupantDescarregaAmbCTipicaCompleta();

	var res_cov=ParamCtrl.ResGetCoverage[capa.ResCoverage];
	cdns_req.push("SERVICE=WCS&VERSION=1.0.0&REQUEST=GetCoverage&CRS=", 
				ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, 
				"&BBOX=", env.MinX, ",", env.MinY, ",", env.MaxX, ",", env.MaxY, 
				"&COVERAGE=", capa.nom, 
				"&RESX=", res_cov.ll.x.sel, "&RESY=", res_cov.ll.y.sel, "&FORMAT=");
	var format_cov=ParamCtrl.FormatGetCoverage[capa.FormatCoverage];
	for (var i=0; i<format_cov.ll.length; i++)
	{
		if (format_cov.ll[i].sel)
		{
			cdns_req.push(format_cov.ll[i].nom);
			break;
		}
	}
	if (oferir_vincle)
		cdns_req.push("; disposition=attachment");

	var param_cov=ParamCtrl.ParGetCoverage[capa.ParamCoverage];
	if (param_cov.ll)
	{
		for (var i_par=0; i_par<param_cov.ll.length; i_par++)
		{
			cdns_req.push("&", param_cov.ll[i_par].nom.nom, "=");
			if (param_cov.ll[i_par].cardin=="i")
			{
                cdns_req.push(param_cov.ll[i_par].valors.sel);
			}
			else if (param_cov.ll[i_par].cardin=="1")
			{
				if (param_cov.ll[i_par].nom.nom=="TIME" && param_cov.ll[i_par].valors==null)
				{
					var i_data_sel=DonaIndexDataCapa(capa, null);
					cdns_req.push(DonaDataJSONComATextISO8601(capa.data[i_data_sel], capa.FlagsData));
				}
				else
				{
				 	for (var i=0; i<param_cov.ll[i_par].valors.length; i++)
					{
						if (param_cov.ll[i_par].valors[i].sel)
						{
							cdns_req.push(param_cov.ll[i_par].valors[i].nom);
							break;
						}
					}
				}
			}
			else
			{
	  		 	if (param_cov.ll[0].nom.nom=="RADIOMET" &&
					(((param_cov.ll[0].valors[0].nom=="opti_nat" || param_cov.ll[0].valors[0].nom=="opti_fals") &&
							 param_cov.ll[0].valors[0].sel) || 
						(((param_cov.ll[0].valors.length>0 && param_cov.ll[0].valors[1].nom=="opti_fals") ||
								(param_cov.ll[0].valors.length>0 && param_cov.ll[0].valors[1].nom=="opti_nat")) && 
							 (param_cov.ll[0].valors.length>0 && param_cov.ll[0].valors[1].sel))))
				{
					cdns_req.push("RGB");
				}
				else
				{
				 	var j=0;
					for (var i=0; i<param_cov.ll[i_par].valors.length; i++)
					{
						if (param_cov.ll[i_par].valors[i].sel)
						{
							if (j!=0)
								cdns_req.push(",");
							cdns_req.push(param_cov.ll[i_par].valors[i].nom);
							j++;
						}
					}
				}
			}			
		}
	}
	var form_ctipica=DonaFormulariCTipicaCompleta();
	if (form_ctipica)
	{
		if (form_ctipica.retallar[2].checked) //per_objecte
		{
			for (var i=0; i<capa_consulta.length; i++)
			{
				if (form_ctipica.ctipica.capa[i].checked)
				{
				     //triar l'ambit del objecte.
					//·$·NJ: això no crec que funcioni està malament, en un estil molt antic
					 cdns_req.push("&TYPENAME=", capa_consulta[i].nom, "&FILTER=(<Filter xmlns=\"http://www.opengis.net/ogc\"><PropertyIsEqualTo><PropertyName>", capa_consulta[i].nom, ".", capa_consulta[i].camp, "</PropertyName><Literal>", capa_consulta[i].proj_camp[ctipica_valor].valor, "</Literal></PropertyIsEqualTo></Filter>)");
					 break;
				}
			}
		}
	}	
	if (self.IdProces)
	{
		self.NIdProces++;
		cdns_req.push("&IDPROCES=", self.IdProces, "_", self.NIdProces);
	}
	//Eliminat el 13-07-2008
	//if (oferir_vincle)
	//	cdns_req.push("&INFO_FORMAT=text/html");
	var cadena_cgi=AfegeixNomServidorARequest(DonaServidorCapa(capa.servidor), cdns_req.join(""), 
			ParamCtrl.UsaSempreMeuServidor==true ? true : false);	

	//Aquest sistema per controlar l'estat no sembla funcionar.
	var iframe=document.getElementById("finestra_download_hidden");
	iframe.i_event=CreaIOmpleEventConsola("GetCoverage", i_capa_wcs, cadena_cgi, TipusEventGetCoverage);
	iframe.onerror=function(event) {
			CanviaEstatEventConsola(event, window.i_event, EstarEventError);
			window.onload=null;
		};
	iframe.onload=function(event) {
			CanviaEstatEventConsola(event, window.i_event, EstarEventTotBe);
		};
	iframe.src=cadena_cgi;
	//

	if (IdProces  && NIdProces)
		setTimeout("CreaEstatDescarrega(ParamCtrl.TempsRefresc, "+i_capa_wcs+")",ParamCtrl.TempsRefresc, iframe.i_event);
}

function MarcaIHabilitaCheckBoxCoverage(nom, marca, habilita)
{
    if (marca==null)
	    ;
	else if (marca)
	    nom.checked=true;
	else
	    nom.checked=false;

    if (habilita)
	    nom.disabled=false;
	else
	    nom.disabled=true;
}

function CanviaParamCoverage(i_par,i_sel, i_capa_wcs)
{
	var param_cov=ParamCtrl.ParGetCoverage[ParamCtrl.capa[i_capa_wcs].ParamCoverage];
	if (param_cov.ll[i_par].cardin=="1")
	{
		if(param_cov.ll[i_par].valors)
		{
			for (var j=0; j<param_cov.ll[i_par].valors.length; j++)
				param_cov.ll[i_par].valors[j].sel=false;
			
			if(i_sel<param_cov.ll[i_par].valors.length)
				param_cov.ll[i_par].valors[i_sel].sel=true;
		}		
	}
	else //"n"
		param_cov.ll[i_par].valors[i_sel].sel=!param_cov.ll[i_par].valors[i_sel].sel;
}

//Excepcions a la norma general:
function ParamCoverageGrisos(i_par, i_capa_wcs)
{
	var param_cov=ParamCtrl.ParGetCoverage[ParamCtrl.capa[i_capa_wcs].ParamCoverage];
	
	if (param_cov.ll.length>i_par+1 &&
	    	param_cov.ll[i_par].nom.nom=="RADIOMET" &&
		param_cov.ll[i_par+1].nom.nom=="BAND")
	{
		for (var j=0; j<param_cov.ll[i_par].valors.length; j++)
		{
			if (param_cov.ll[i_par].valors[j].sel==true)
			{
				if (param_cov.ll[i_par].valors[j].nom=="opti_nat")
				{
					for (var k=0; k<param_cov.ll[i_par+1].valors.length; k++)
					{
						if (param_cov.ll[i_par+1].valors[k].nom=="3-R" ||  //TM o ETM
						        param_cov.l[i_par+1].valors[k].nom=="2-G" ||
							param_cov.l[i_par+1].valors[k].nom=="1-B" ||
							param_cov.ll[i_par+1].valors[k].nom=="4-R" ||  //Combinació color_natural landsat 8
							param_cov.ll[i_par+1].valors[k].nom=="3-G" ||
							param_cov.ll[i_par+1].valors[k].nom=="2-B")
						{
							//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[i_par+1].nom.nom + "_" + k +", true, false)");
							MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[i_par+1].nom.nom + "_" + k], true, false);
							param_cov.ll[i_par+1].valors[k].sel=true;
						}
					    	else
						{
							//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[i_par+1].nom.nom + "_" + k +", false, false)");
							MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[i_par+1].nom.nom + "_" + k], false, false);
							param_cov.ll[i_par+1].valors[k].sel=false;
						}
					}
					break;
				}
				else if (param_cov.ll[i_par].valors[j].nom=="opti_fals")
				{
					for (var k=0; k<param_cov.ll[i_par+1].valors.length; k++)
					{
						if (param_cov.ll[i_par+1].valors[k].nom=="4-IRp"  || //TM o ETM						
						        param_cov.ll[i_par+1].valors[k].nom=="5-IRm1" ||
							param_cov.ll[i_par+1].valors[k].nom=="3-R"    ||
							param_cov.ll[i_par+1].valors[k].nom=="4-IRp2" || //MSS45
							param_cov.ll[i_par+1].valors[k].nom=="1-G"    ||
							param_cov.ll[i_par+1].valors[k].nom=="2-R"    ||							
							param_cov.ll[i_par+1].valors[k].nom=="7-IRp2" || //MSS13
							param_cov.ll[i_par+1].valors[k].nom=="4-G"    ||
							param_cov.ll[i_par+1].valors[k].nom=="5-R"    ||
							param_cov.ll[i_par+1].valors[k].nom=="5-NIR"   || //landsat 8
							param_cov.ll[i_par+1].valors[k].nom=="6-SWIR1" ||
							param_cov.ll[i_par+1].valors[k].nom=="4-R")
						{
					 	    	//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[i_par+1].nom.nom +  "_" + k +", true, false)");
							MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[i_par+1].nom.nom +  "_" + k], true, false);
							param_cov.ll[i_par+1].valors[k].sel=true;
						}
						else
						{
							//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[i_par+1].nom.nom +  "_" + k +", false, false)");
							MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[i_par+1].nom.nom +  "_" + k], false, false);
							param_cov.ll[i_par+1].valors[k].sel=false;
						}
					}
					break;
				}
				else
				{
					for (var k=0; k<param_cov.ll[i_par+1].valors.length; k++)
				    	{
						//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[i_par+1].nom.nom + "_" + k +", null, true)");
						MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[i_par+1].nom.nom + "_" + k], null, true);
					}
				}
			}
		}
	}
	if (param_cov.ll.length>i_par+2 &&
    		param_cov.ll[i_par].nom.nom=="RADIOMET" &&
	    	param_cov.ll[i_par+2].nom.nom=="QUALITY")
	{
		for (var j=0; j<param_cov.ll[i_par].valors.length; j++)
		{
			if (param_cov.ll[i_par].valors[j].sel==true)
			{
				if (param_cov.ll[i_par].valors[j].nom=="opti_nat" ||
				    param_cov.ll[i_par].valors[j].nom=="opti_fals")
				{
					//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[i_par+2].nom.nom + ", null, true)");
					MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[i_par+2].nom.nom], null, true);
					break;
				}
			    	else
				{
					//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[i_par+2].nom.nom + ", null, false)");
					MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[i_par+2].nom.nom], null, false);
					break;
				}
			}
		}
	}
}

function CanviaParamCoverageIGrisos(i_par,i, i_capa_wcs)
{    
	CanviaParamCoverage(i_par,i, i_capa_wcs);
	ParamCoverageGrisos(i_par, i_capa_wcs);	
}

function CanviaFormatCoverage(i, i_capa_wcs)
{
var format_cov=ParamCtrl.FormatGetCoverage[ParamCtrl.capa[i_capa_wcs].FormatCoverage];
	for (j=0; j<format_cov.ll.length; j++)
		format_cov.ll[j].sel=false;
	format_cov.ll[i].sel=true;
}

function CanviaParamTextCoverage(nom,i_par,i, i_capa_wcs)
{
var param_cov=ParamCtrl.ParGetCoverage[ParamCtrl.capa[i_capa_wcs].ParamCoverage];

	param_cov.ll[i_par].valors.sel =document.botons_param_wcs.nom;
}

function CreaSelectorAPartirDeLesDatesCapa(i_capa_wcs, nom, i_par)
{
var cdns=[], i_data_sel=DonaIndexDataCapa(ParamCtrl.capa[i_capa_wcs], null);

	if (ParamCtrl.capa[i_capa_wcs].data.length>8)
	{
		cdns.push("<select name=\"", nom,
			"\"",
			((i_par==-1) ? "" : " onChange=\"ParamCtrl.capa["+i_capa_wcs+"].i_data=parseInt(document.botons_param_wcs."+nom+".value);\""),
			">");
													
		for (var i=0; i<ParamCtrl.capa[i_capa_wcs].data.length; i++)
			cdns.push("<option value=\""+i+"\""+
				 ((i_data_sel==i) ? " SELECTED" : "") + "> "+
				 DonaDataCapaComATextBreu(i_capa_wcs, i)+"</option>");
		cdns.push("</select><br>");
	}
	else
	{
		for (var i=0; i<ParamCtrl.capa[i_capa_wcs].data.length; i++)
			cdns.push("<input TYPE=\"radio\" NAME=\"",
				nom, "\" ",
				((i_data_sel==i) ? "CHECKED " : ""),
				((i_par==-1) ? "" : "onClick=\"CanviaParamCoverageIGrisos("+i_par+","+i+","+i_capa_wcs+");\""),
				"> ", DonaDataCapaComATextBreu(i_capa_wcs, i)+"<br>");
	}
	return cdns.join("");
}

function DibuixaOpcionsWCS(i_capa_wcs)
{
var cdns=[], capa=ParamCtrl.capa[i_capa_wcs];

	if ( typeof capa.ParamCoverage!=="undefined" && ParamCtrl.ParGetCoverage && 
  		ParamCtrl.ParGetCoverage[capa.ParamCoverage].ll)
	{
		cdns.push("<form name=\"botons_param_wcs\" onSubmit=\"DibuixaOpcionsDescarregaWCS("+i_capa_wcs+");return false;\">"+
				   "<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"2\">");
		var param_cov=ParamCtrl.ParGetCoverage[capa.ParamCoverage];
		cdns.push("<center><font size=\"3\"><b>"+DonaCadenaLang({"cat":"Capa","spa":"Capa","eng":"Layer","fre":"Couche"})+" "+
			DonaCadena(capa.desc)+"</b></font><br>",
			DonaCadenaLang({"cat": "Descàrrega selectiva de la zona",
						"spa": "Descarga selectiva de la zona",
						"eng": "Selective download of the zone",
						"fre": "Téléchargement sélectif de la zone"})," (OGC-WCS)",
			"</center>");
		for (var i_par=0; i_par<param_cov.ll.length; i_par++)
		{
			cdns.push("<fieldset><legend><b>"+DonaCadena(param_cov.ll[i_par].nom.desc));
			if (param_cov.ll[i_par].cardin=="i")
			{
				cdns.push(" ["+ param_cov.ll[i_par].valors.v1 +"  </b><small>("+ 
					DonaCadena(param_cov.ll[i_par].valors.desc1) +")</small><b>-"+
					param_cov.ll[i_par].valors.v2 +"</b><small>("+
					DonaCadena(param_cov.ll[i_par].valors.desc2) +
					")</small><b>]:</b></legend> <input TYPE=\"text\" NAME=\""+ param_cov.ll[i_par].nom.nom +
					"\" VALUE=\""+param_cov.ll[i_par].valors.sel+
					"\" SIZE=\"10\" onChange=\"ParamCtrl.capa["+i_capa_wcs+"].ParamCoverage.ll["+i_par+
					"].valors.sel=document.botons_param_wcs."+param_cov.ll[i_par].nom.nom+".value;\"><br>");
			}
			else if (param_cov.ll[i_par].cardin=="1")
			{
				cdns.push(":</b></legend>");
				if (param_cov.ll[i_par].nom.nom=="TIME" && param_cov.ll[i_par].valors==null)
				{
					cdns.push(CreaSelectorAPartirDeLesDatesCapa(i_capa_wcs, param_cov.ll[i_par].nom.nom, i_par));
				}
				else
				{
			  		for (var i=0; i<param_cov.ll[i_par].valors.length; i++)
                		cdns.push("<input TYPE=\"radio\" NAME=\""+ 
							param_cov.ll[i_par].nom.nom + "\" "+ 
							((param_cov.ll[i_par].valors[i].sel) ? "CHECKED " : "") + 
							"onClick=\"CanviaParamCoverageIGrisos("+i_par+","+i+","+i_capa_wcs+");\"> "+
							DonaCadena(param_cov.ll[i_par].valors[i].desc)+"<br>");
				}
			}			 	 
			else
			{
				cdns.push(":</b></legend>");
				for (var i=0; i<param_cov.ll[i_par].valors.length; i++)
		    	{
		            cdns.push("<input TYPE=\"checkbox\" NAME=\"" + 
						param_cov.ll[i_par].nom.nom + "_" + i + "\" " + 
						((param_cov.ll[i_par].valors[i].sel) ? "CHECKED " : "")  +
						"onClick=\"CanviaParamCoverageIGrisos("+i_par+","+i+","+i_capa_wcs+");\"> "+
						DonaCadena(param_cov.ll[i_par].valors[i].desc)+"<br>");
				}
			}
			cdns.push("</fieldset>");
		}
		cdns.push("<center><input NAME=\"seguent\" ID=\"seguent\" TYPE=\"submit\" VALUE=\""+DonaCadenaLang({"cat":"Següent", "spa":"Siguiente", "eng":"Next", "fre":"Suivant"})+"\"></center>"+
						   "</font></form>");
		contentLayer(getLayer(window, "finestra_download_opcions"), cdns.join(""));

		ParamCoverageGrisos(0, i_capa_wcs);

		//Provisional fins que disposem de les imatges corregides radiomètricament.
		var param_cov=ParamCtrl.ParGetCoverage[capa.ParamCoverage];
		if (param_cov.ll[0].nom.nom=="RADIOMET")
		{
	        for (var j=0; j<param_cov.ll[0].valors.length; j++)
			{
			    if (param_cov.ll[0].valors[j].nom=="corr")
				{
					//eval("MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs." + param_cov.ll[0].nom.nom + "[j], null, false)");
					MarcaIHabilitaCheckBoxCoverage(document.botons_param_wcs[param_cov.ll[0].nom.nom + "["+j+"]"], null, false);
				}
			}
		}
	}
	else
	{
		DibuixaOpcionsDescarregaWCS(i_capa_wcs);
	}
}

function DonaMissatgeSiMMZCalMiraMon()
{
var cdns=[];
	cdns.push("<br><small>");
	if (ParamCtrl.DescarregesCertificades)
		cdns.push(DonaCadenaLang({"cat":"Per el format MMZ o MMZX, si no teniu instal·lat o actualitzat el Lector Universal de Mapes del MiraMon, <a href=\"http://www.creaf.uab.cat/miramon/mmr/cat\" target=\"_blank\">descarregueu-lo</a>",
					"spa":"Para el formato MMZ o MMZX, si no tiene instalado o actualizado el Lector Universal de Mapas de MiraMon, <a href=\"http://www.creaf.uab.cat/miramon/mmr/esp\" target=\"_blank\">descárguelo</a>",
					"eng":"For the MMZ or MMZX format, if you don't have installed or updated MiraMon Universal Map Reader, please, <a href=\"http://www.creaf.uab.cat/miramon/mmr/usa\" target=\"_blank\">download it</a>",
					"fre":"Pour le format MMZ ou MMZX, si vous n'avez pas installé où actualisé le Lecteur Universel de Cartes du MiraMon, please, <a href=\"http://www.creaf.uab.cat/miramon/mmr/usa\" target=\"_blank\">download it</a>"}));
	else
		cdns.push(DonaCadenaLang({"cat":"Per poder visualitzar les capes en format MMZ o MMZX cal tenir correctament instal·lat el programa MiraMon.", 
					"spa":"Para poder visualitzar las capas en formato MMZ o MMZX es necessario tener correctamente instalado el programa MiraMon.", 
					"eng":"In order to be able to view the layers in MMZ of MMZX format, and installed version of the MiraMon software is required.",
					"fre":"Pour pouvoir visualiser les couches en MMZ du format MMZX, et la version installée du logiciel MiraMon est nécessaire"}));
	cdns.push("</small>");
	return cdns.join("");
}


function DibuixaOpcionsDescarregaWCS(i_capa_wcs)
{
var cdns=[], missatge_mmz=false;


	cdns.push("<form name=\"botons_descarrega\" onSubmit=\"DescarregaWCS(false, "+i_capa_wcs+");return false;\">"+
				   "<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"2\">");
				   
	cdns.push("<center><font size=\"3\"><b>"+DonaCadenaLang({"cat":"Capa","spa":"Capa","eng":"Layer","fre":"Couche"})+" "+
			DonaCadena(ParamCtrl.capa[i_capa_wcs].desc)+"</b></font><br>",
			DonaCadenaLang({"cat": "Descàrrega selectiva de la zona",
						"spa": "Descarga selectiva de la zona",
						"eng": "Selective download of the zone",
						"fre": "Téléchargement sélectif de la zone"})," (OGC-WCS)<br>",
			"</center>");
	var format_cov=ParamCtrl.FormatGetCoverage[ParamCtrl.capa[i_capa_wcs].FormatCoverage];
	cdns.push("<fieldset><legend><b>", DonaCadenaLang({"cat": "Format",
				"spa": "Formato",
				"eng": "Format",
				"fre": "Format"}), ":</b></legend>");

	for (var i=0; i<format_cov.ll.length; i++)
	{
		cdns.push("<input TYPE=\"radio\" NAME=\"format\" ", 
				((format_cov.ll[i].sel) ? "CHECKED " : ""),
				"onClick=\"CanviaFormatCoverage("+i+");\"> ",
				DonaCadena(format_cov.ll[i].desc)+"<br>");
		if (format_cov.ll[i].nom=="application/x-mmz" || format_cov.ll[i].nom=="application/x-mmzx")
			missatge_mmz=true;
	}
	cdns.push("</fieldset>");
	if (missatge_mmz)
		cdns.push(DonaMissatgeSiMMZCalMiraMon())

	/* Els sistema de descàrrega se simplifica donat que la opció "Generar i obrir" només funciona amb Internet explorer.
	cdns.push("<br><center>",
			"<input name=\"obrir\" TYPE=\"submit\" VALUE=\"",
			DonaCadenaLang({"cat":"Generar i obrir directament","spa":"Generar y ofrecer directamente","eng":"Generate and offer directly","fre":"Créer et ouvrir directement"}),
			"\"></br><input TYPE=\"button\" VALUE=\"",
			DonaCadenaLang({"cat":"Preparar i oferir","spa":"Preparar y ofrecer","eng":"Prepare and offer","fre":"Préparer et télécharger"}),
			"\" onClick=\"DescarregaWCS(true, ",i_capa_wcs,")\">",
			" (",DonaCadenaLang({"cat":"per a guardar el fitxer", "spa":"para guardar el fichero", "eng":"to save file", "fre":"pour enregistrer le fichier"}),")</center>");*/

	cdns.push("<br><center><input TYPE=\"button\" VALUE=\"",
			DonaCadenaLang({"cat":"Descarregar","spa":"Descargar","eng":"Download","fre":"Télécharger"}),
			"\" onClick=\"DescarregaWCS(true, ",i_capa_wcs,")\"></center>");

	cdns.push("</font></form>");
	contentLayer(getLayer(window, "finestra_download_opcions"), cdns.join(""));
}

function EsCapaDecarregableIndividualment(capa)
{
	if (capa.FormatCoverage || capa.DescarregaTot)
		return true;
	return false;
}

function DeterminaTimeDescarregaCapa(i_capa)
{
var i, s, capa=ParamCtrl.capa[i_capa];

	if (capa.data)
	{
		if (capa.data.length>8)
			return OfereixOpcionsDescarregaTot(i_capa, document.botons_descarrega.TIME.selectedIndex);
		else if (capa.data.length==1)
			return OfereixOpcionsDescarregaTot(i_capa, 0);
		else
		{
			for (i=0; i<capa.data.length; i++)
			{
				if (document.botons_descarrega.TIME[i].checked)
					return OfereixOpcionsDescarregaTot(i_capa, i);
			}
		}
	}
	return OfereixOpcionsDescarregaTot(i_capa, null); //Això no hauria de passar mai, però per si de cas.
}

function DibuixaTimeDescarregaTot(i_capa)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	if (capa.data)
	{
		cdns.push("<form name=\"botons_descarrega\" onSubmit=\"DeterminaTimeDescarregaCapa("+i_capa+");return false;\">"+
				   "<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"2\">");
		cdns.push("<center><font size=\"3\"><b>"+DonaCadenaLang({"cat":"Capa","spa":"Capa","eng":"Layer","fre":"Couche"})+" "+
				DonaCadena(capa.desc)+"</b></font><br>",
				DonaCadenaLang({"cat": "Descàrrega de la capa completa",
							"spa": "Descarga de la capa completa",
							"eng": "Download the full layer",
							"fre": "Téléchargement de la couche complète"}),"<br>",
				"</center>");

		if (capa.data)
		{
			//Aquesta part es part fer millor
			cdns.push("<fieldset><legend><b>")
		
			if (typeof capa.FlagsData==="undefined" || capa.FlagsData===null || 
				(capa.DataMostraDia && capa.DataMostraHora))
				cdns.push(DonaCadenaLang({"cat": "Data i hora",
					"spa": "Fecha y hora",
					"eng": "Date and time",
					"fre": "Date et l'heure"}));
			else if (capa.DataMostraHora)
				cdns.push(DonaCadenaLang({"cat": "Hora",
					"spa": "Hora",
					"eng": "Time",
					"fre": "L'heure"}));
			else	
				cdns.push(DonaCadenaLang({"cat": "Data",
					"spa": "Fecha",
					"eng": "Date",
					"fre": "Date"}));
			cdns.push(":</b></legend>");
			cdns.push(CreaSelectorAPartirDeLesDatesCapa(i_capa, "TIME", -1));
			cdns.push("</fieldset>")
		}
		cdns.push("<center><input NAME=\"seguent\" ID=\"seguent\" TYPE=\"submit\" VALUE=\""+DonaCadenaLang({"cat":"Següent", "spa":"Siguiente", "eng":"Next", "fre":"Suivant"})+"\"></center>"+
						   "</font></form>");
		contentLayer(getLayer(window, "finestra_download_opcions"), cdns.join(""));
	}
	else
		OfereixOpcionsDescarregaTot(i_capa, null);
}

function OfereixOpcionsDescarregaTot(i_capa, i_data)
{
var cdns=[], capa=ParamCtrl.capa[i_capa], missatge_mmz=false;

	cdns.push("<form name=\"botons_descarrega\" onSubmit=\"DescarregaFitxerCapa("+i_capa+");return false;\">"+
				   "<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"2\">");
	cdns.push("<center><font size=\"3\"><b>"+DonaCadenaLang({"cat":"Capa","spa":"Capa","eng":"Layer","fre":"Couche"})+" "+
			DonaCadena(capa.desc)+"</b></font><br>",
			DonaCadenaLang({"cat": "Descàrrega de la capa completa",
						"spa": "Descarga de la capa completa",
						"eng": "Download the full layer",
						"fre": "Téléchargement de la couche complète"}),"<br>",
			"</center>");

	cdns.push("<fieldset><legend><b>", DonaCadenaLang({"cat": "Opció",
				"spa": "Opición",
				"eng": "Option",
				"fre": "Option"}), ":</b></legend>");


	for (var i=0; i<capa.DescarregaTot.length; i++)
	{
		//S'ha de demanar la descarrega de la url enviant-la a l'iframe ocult.
		for (var i_format=0; i_format<capa.DescarregaTot[i].format.length; i_format++)
		{
			cdns.push("<a href=\"", DonaNomFitxerDescarregaTot(i_capa, i, i_format, i_data), "\" target=\"_blank\">",DonaCadena(capa.DescarregaTot[i].desc),
				"</a> (",DonaCadena(ParamCtrl.FormatDescarregaTot[capa.DescarregaTot[i].format[i_format]].format.desc),
				")<br>");
			if (ParamCtrl.FormatDescarregaTot[capa.DescarregaTot[i].format[i_format]].format.nom=="application/x-mmz" || 
			    ParamCtrl.FormatDescarregaTot[capa.DescarregaTot[i].format[i_format]].format.nom=="application/x-mmzx")
				missatge_mmz=true;
		}
	}
	cdns.push("</fieldset>");
	if (missatge_mmz)
		cdns.push(DonaMissatgeSiMMZCalMiraMon())
	
	cdns.push("</font></form>");

	contentLayer(getLayer(window, "finestra_download_opcions"), cdns.join(""));
}

function DibuixaTriaDescarregaWCSoTot(i_capa)
{
var cdns=[];

	cdns.push("<form name=\"botons_descarrega\" onSubmit=\"if (document.botons_descarrega.protocol[0].checked==true){ DibuixaTimeDescarregaTot("+i_capa+");return false;}else{DibuixaOpcionsWCS("+i_capa+");return false;}\">"+
		   "<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"2\">");
				   
	cdns.push("<center><font size=\"3\"><b>"+DonaCadenaLang({"cat":"Capa","spa":"Capa","eng":"Layer","fre":"Couche"})+" "+
			DonaCadena(ParamCtrl.capa[i_capa].desc)+"</b></font><br></center>");
	cdns.push("<input TYPE=\"radio\" NAME=\"protocol\" checked=\"checked\"> ",
				DonaCadenaLang({"cat": "Descàrrega de la capa completa",
						"spa": "Descarga de la capa completa",
						"eng": "Download the full layer",
						"fre": "Téléchargement de la couche complète"}),"<br>");
	cdns.push("<input TYPE=\"radio\" NAME=\"protocol\"> ",
				DonaCadenaLang({"cat": "Descàrrega selectiva de la zona",
						"spa": "Descarga selectiva de la zona",
						"eng": "Selective download of the zone",
						"fre": "Téléchargement sélectif de la zone"}),"<br>");

	cdns.push("<center><input NAME=\"seguent\" ID=\"seguent\" TYPE=\"submit\" VALUE=\""+DonaCadenaLang({"cat":"Següent", "spa":"Siguiente", "eng":"Next", "fre":"Suivant"})+"\"></center>"+
						   "</font></form>");
	contentLayer(getLayer(window, "finestra_download_opcions"), cdns.join(""));
	return;
}

function OmpleFinestraDownload(i_capa)
{
var cdns=[], capa;

	//<div class=\"Verdana11px\">
	cdns.push("<center>", DonaCadena(ParamCtrl.TitolCaixa), "</center>");
	cdns.push("<div id=\"finestra_download_opcions\" style=\"overflow-y: auto; height:250px;\"></div>");
	cdns.push("<iframe id=\"finestra_download_hidden\" width=\"1\" height=\"1\" style=\"display:none\"></iframe>");
	cdns.push(DonaCadenaLang({"cat":"Estat", "spa":"Estado", "eng":"Status", "fre":"statut"}), ":<div id=\"finestra_download_status\" style=\"height: 52px; width: 98%; background-color: #EEEEEE\"></div>");
	cdns.push("<div align=\"right\"><a href=\"javascript:void(0);\" onclick='TancaFinestraLayer(\"download\");'>",
		DonaCadenaLang({"cat":"Tancar", "spa":"Cerrar", "eng":"Close", "fre":"Quitter"}),"</a></div>");

	contentFinestraLayer(window, "download", cdns.join(""));

	capa=ParamCtrl.capa[i_capa];

	if (typeof capa.FormatCoverage!=="undefined" && capa.FormatCoverage!=null && 
	    typeof capa.DescarregaTot!=="undefined" && capa.DescarregaTot!=null)
		DibuixaTriaDescarregaWCSoTot(i_capa)
	else if (typeof capa.FormatCoverage!=="undefined" && capa.FormatCoverage!=null)
		DibuixaOpcionsWCS(i_capa);
	else if (typeof capa.DescarregaTot!=="undefined" && capa.DescarregaTot!=null)
		DibuixaTimeDescarregaTot(i_capa);
	
	return;
}

function MostraFinestraDownload(i_capa)
{
	if (!ObreFinestra(window, "download", DonaCadenaLang({"cat":"de descarregar", 
							  "spa":"de descargar",
							  "eng":"of downloading",
							  "fre":"de téléchargement"})))
		return;
	OmpleFinestraDownload(i_capa);
}

function MostraFinestraVideo()
{
	if (!ObreFinestra(window, "video", DonaCadenaLang({"cat":"de projectar videos", 
							  "spa":"de proyectar vídeos",
							  "eng":"of projecting videos",
							  "fre":"pour vidéos en projection"})))
		return;
	OmpleFinestraVideo(window, "video");
}


function CalculaMidesSituacio()
{
var factor, factor_y;
var w,h,e,s;

	ParamInternCtrl.MargeEsqSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeEsq;
	ParamInternCtrl.AmpleSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample;
	ParamInternCtrl.MargeSupSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeSup;
	ParamInternCtrl.AltSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt;
	OrigenEsqSituacio=ParamInternCtrl.MargeEsqSituacio;
	OrigenSupSituacio=ParamInternCtrl.MargeSupSituacio;

	if (ParamCtrl.AmpleAltSituacioAuto)
	{
		var elem=getLayer(window, "situacio");
		if (isLayer(elem))
		{
			var rect=getRectLayer(elem);
			w=rect.ample;
			h=rect.alt;
			e=rect.esq;
			s=rect.sup;
		}
		else
			return;

		factor=w/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeEsq*2+ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample);
		factor_y=h/(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeSup*2+ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt);
		if (factor_y<factor)
			factor=factor_y;
		factor*=0.97
		ParamInternCtrl.MargeEsqSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeEsq*factor;
		ParamInternCtrl.AmpleSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Ample*factor;
		ParamInternCtrl.MargeSupSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].MargeSup*factor;
		ParamInternCtrl.AltSituacio=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].Alt*factor;
		OrigenEsqSituacio=ParamInternCtrl.MargeEsqSituacio+e;
		OrigenSupSituacio=ParamInternCtrl.MargeSupSituacio+s;
	}
}

function DonaCadenaHTMLMarcSituacio(ample, alt)
{
    return "<table border=0 cellspacing=0 cellpadding=0><tr><td colspan=3><img src=\"" +
		AfegeixAdrecaBaseSRC(DonaFitxerColor(ParamCtrl.ColorQuadratSituacio)) + "\" height=1 width="+ample+
		"></td></tr><tr><td><img src=\"" + 
		AfegeixAdrecaBaseSRC(DonaFitxerColor(ParamCtrl.ColorQuadratSituacio)) + "\" height="+(alt-2)+
		" width=1></td><td><img src=\""+
		AfegeixAdrecaBaseSRC("1tran.gif")+
		"\" height=1 width="+(ample-2)+
		"></td><td><img src=\"" + AfegeixAdrecaBaseSRC(DonaFitxerColor(ParamCtrl.ColorQuadratSituacio)) + "\" height="+(alt-2)+
		" width=1></td></tr><tr><td colspan=3><img src=\"" + 
		AfegeixAdrecaBaseSRC(DonaFitxerColor(ParamCtrl.ColorQuadratSituacio)) + "\" height=1 width="+ample+"></td></table>";
}

function CreaSituacio()
{
	CalculaMidesSituacio();
	var rec=OmpleMidesRectangleSituacio(ParamInternCtrl.AmpleSituacio, ParamInternCtrl.AltSituacio, ParamInternCtrl.vista.EnvActual);
	var elem=getLayer(window, "situacio");
	if (isLayer(elem))
	{
		var s=textHTMLLayer("l_situa", ParamInternCtrl.MargeEsqSituacio, ParamInternCtrl.MargeSupSituacio, ParamInternCtrl.AmpleSituacio, ParamInternCtrl.AltSituacio, null, "no", true, null, null, false, "<img name=\"i_situa\" src=\"" + AfegeixAdrecaBaseSRC(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].nom) + "\" width="+ParamInternCtrl.AmpleSituacio+" height="+ParamInternCtrl.AltSituacio+" border=0>") +"\n";
		if (EsEnvDinsMapaSituacio(ParamInternCtrl.vista.EnvActual))
			s+=textHTMLLayer("l_rect", ParamInternCtrl.MargeEsqSituacio+rec.MinX, ParamInternCtrl.MargeSupSituacio+ParamInternCtrl.AltSituacio-rec.MaxY, rec.MaxX-rec.MinX, rec.MaxY-rec.MinY, null, "no", true, null, null, false, DonaCadenaHTMLMarcSituacio(rec.MaxX-rec.MinX, rec.MaxY-rec.MinY))+ "\n";
		s+=textHTMLLayer("l_situa_actiu", ParamInternCtrl.MargeEsqSituacio, ParamInternCtrl.MargeSupSituacio, ParamInternCtrl.AmpleSituacio, ParamInternCtrl.AltSituacio, null, "no", true, null, null, false, "<a href=\"javascript:void(0);\" onClick=\"ClickSobreSituacio(event);\" onmousemove=\"MovimentSobreSituacio(event);\"><img src=\""+ AfegeixAdrecaBaseSRC("1tran.gif") + "\" width="+ParamInternCtrl.AmpleSituacio+" height="+ParamInternCtrl.AltSituacio+" border=0></a>")+"\n";
		contentLayer(elem, s);
	}
}

function CadenaBotoPolsable(nom, fitxer, text_groc, funcio)
{
	//return "<img align=absmiddle src=\"" + AfegeixAdrecaBaseSRC(fitxer + ".gif") + "\" name=\"" + nom + "\" border=\"0\" alt=\"" + text_groc + "\" title=\"" + text_groc + "\" onClick=\"" + nom + ".src=\'" + AfegeixAdrecaBaseSRC(fitxer + ".gif") + "\';" + funcio + "\" onmousedown=\"document." + nom + ".src='" + AfegeixAdrecaBaseSRC(fitxer + "p.gif") + "'; return true;\" onMouseOver=\"if (document." + nom + " && document." + nom + ".alt) window.status=document." + nom + ".alt; return true;\" onMouseOut=\"document." + nom + ".src=\'" + AfegeixAdrecaBaseSRC(fitxer + ".gif") + "\';if (document." + nom + "&& document." + nom + ".alt) window.status=\'\'; return true;\">";
	return "<img align=absmiddle src=\"" + AfegeixAdrecaBaseSRC(fitxer + ".gif") + "\" name=\"" + nom + "\" border=\"0\" alt=\"" + text_groc + "\" title=\"" + text_groc + "\" onClick=\"this.src=\'" + AfegeixAdrecaBaseSRC(fitxer + ".gif") + "\';" + funcio + "\" onmousedown=\"this.src='" + AfegeixAdrecaBaseSRC(fitxer + "p.gif") + "'; return true;\" onMouseOver=\"if (this.alt) window.status=this.alt; return true;\" onMouseOut=\"this.src=\'" + AfegeixAdrecaBaseSRC(fitxer + ".gif") + "\';if (this.alt) window.status=\'\'; return true;\">";
}

//Els arguments són parelles de 'nom_img', 'nom_fitxer_img'...
function CanviaPolsatEnBotonsAlternatius()
{
	for (var i=0; i<arguments.length; i+=2)
		//eval("window.document." + arguments[i] + ".src=" + "\"" + AfegeixAdrecaBaseSRC(arguments[i+1]) + "\"");
		window.document[arguments[i]].src=AfegeixAdrecaBaseSRC(arguments[i+1]);
	return true;
}

//Els arguments són: l'índex del botó premut al inici + trios de 'nom_img', 'text_groc', 'funcio'...
function CadenaBotonsAlternatius(boto_p, botons)
{
var j,l;
var cdns=[];
	for (j=0; j<botons.length; j++)
	{
		cdns.push("<IMG align=absmiddle name=\"" , botons[j].src , "\" SRC=\"" , 
			AfegeixAdrecaBaseSRC(botons[j].src) , 
			((boto_p==botons[j].src) ? "p" : "") , 
			".gif\" alt=\"" , botons[j].alt , 
			"\" title=\"" , botons[j].alt ,
			"\" onClick=\"CanviaPolsatEnBotonsAlternatius(");

		for (l=0; l<botons.length; l++)
		{
            if (l!=0)
				cdns.push(",");
			cdns.push("\'" , botons[l].src , "\',\'" , botons[l].src , ((j==l) ? "p" : "") , ".gif\'");
		}
		cdns.push(");" , botons[j].funcio , "\" onMouseOver=\"if (document." , botons[j].src , ".alt) window.status=document." , botons[j].src , ".alt; return true;\" onMouseOut=\"if (document." , botons[j].src , ".alt) window.status=''; return true;\">");	
	}
	return cdns.join("");
}


function CreaBarra(crs)
{
var i, j, k;
var cdns=[];

	if (ParamCtrl.BarraNomesDescarrega==true)
	{
		cdns.push("<FORM NAME=\"zoom\" METHOD=\"GET\" onSubmit=\"return ObtenirMMZ();\">");
		ParamCtrl.EstatClickSobreVista="ClickMouMig";
		cdns.push("<CENTER>",
		   (CadenaBotoPolsable("getmmz_text", "getmmz_text", DonaCadenaLang({"cat":"descarregar", "spa":"descargar", "eng":"download", "fre":"télécharger"}), "ObtenirMMZ();")),
		   "&nbsp;&nbsp;&nbsp;",
		   (CadenaBotoPolsable("ajuda", "ajuda", DonaCadenaLang({"cat":"ajuda interactiva", "spa":"ayuda interactiva", "eng":"interactive help", "fre":"aide intéractive"}), "ObreFinestraAjuda();")),
		   "</CENTER>");
	}
	else // Barra completa
	{
		cdns.push("<FORM NAME=\"zoom\" METHOD=\"GET\" onSubmit=\"return PortamANivellDeZoom(document.zoom.nivell.value)\">\n");
		if (ParamCtrl.BarraBotoMes==true)
		   	cdns.push((CadenaBotoPolsable("zoom_in", "zoom_in", DonaCadenaLang({"cat":"acostar", "spa":"acercar", "eng":"zoom in","fre":"rapprocher"}), 	
				"PortamANivellDeZoom(DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual)+1);")));
		if (ParamCtrl.BarraBotoMenys==true)
			cdns.push((CadenaBotoPolsable("zoomout", "zoomout", DonaCadenaLang({"cat":"allunyar", "spa":"alejar", "eng":"zoom out","fre":"éloigner"}), 
				"PortamANivellDeZoom(DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual)-1);")));
		if (ParamCtrl.BarraBotoAnarCoord==true)
			cdns.push((CadenaBotoPolsable("zoomcoord", "zoomcoord", DonaCadenaLang({"cat":"anar a coordenada", "spa":"ir a coordenada", "eng":"go to coordinate", "fre":"aller à la coordonnée"}), 
				"MostraFinestraAnarCoordenada()")));
		if (ParamCtrl.BarraBotoBack==true)
			cdns.push((CadenaBotoPolsable("zoom_bk", "zoom_bk", DonaCadenaLang({"cat":"vista prèvia", "spa":"vista previa", "eng":"previous view","fre":"vue préalable"}), 
				"RecuperaVistaPrevia();")));
		if (ParamCtrl.BarraBotoVGeneral==true)
			cdns.push((CadenaBotoPolsable("zoomall", "zoomall", DonaCadenaLang({"cat":"vista general", "spa":"vista general", "eng":"general view","fre":"vue générale"}), 
				"PortamAVistaGeneral();")));

		// Activació de les consultes perquè hi ha alguna capa consultable
		if(Accio==null || (Accio && ~Accio.accio&accio_validacio))
		{
			for (i=0; i<ParamCtrl.capa.length; i++)
			{
				if (ParamCtrl.capa[i].consultable!="no")
				    break;
			}
		}
		else
			i=0;
		// Activació de les consultes perquè hi ha alguna vector consultable
		for (k=0; k<ParamCtrl.capa.length; k++)
		{
			if (ParamCtrl.capa[k].model==model_vector && ParamCtrl.capa[k].consultable!="no")
				break;
		}
		// Activació de les consultes perquè hi ha alguna vector editable
		for (j=0; j<ParamCtrl.capa.length; j++)
		{
			if (ParamCtrl.capa[j].model==model_vector && ParamCtrl.capa[j].editable!="no")
				break;
		}
		if (ParamCtrl.BarraBotonsAlternatius==true)
		{
			var botons=[];
			var boto_p;

			//Precaucions previes: S'eviten situacions on ParamCtrl.EstatClickSobreVista és incompatible amb l'estat actual del navegador
			if (ParamCtrl.EstatClickSobreVista=="ClickMouMig" && !(ParamCtrl.BarraBotoMouMig==true))
				ParamCtrl.EstatClickSobreVista="ClickPan1";
			else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts" && !(ParamCtrl.BarraBotoInsereix==true || (ParamCtrl.capa && j<ParamCtrl.capa.length)))
				ParamCtrl.EstatClickSobreVista="ClickConLoc";
			else if ((ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2") && !(ParamCtrl.BarraBotoNovaVista==true))
				ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
			if (ParamCtrl.EstatClickSobreVista=="ClickConLoc" && (!(i<ParamCtrl.capa.length) && (ParamCtrl.capa && !(k<ParamCtrl.capa.length))))
				ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
				

			if (ParamCtrl.EstatClickSobreVista=="ClickPan1" || ParamCtrl.EstatClickSobreVista=="ClickPan2")
				boto_p="pan";
			else if (ParamCtrl.EstatClickSobreVista=="ClickMouMig" )
				boto_p="moumig";		
			else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec1" || ParamCtrl.EstatClickSobreVista=="ClickZoomRec2")
				boto_p="zoomfin";
			else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" || ParamCtrl.EstatClickSobreVista=="ClickNovaVista2")
				boto_p="novavista";
			else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts" && (ParamCtrl.BarraBotoInsereix==true || (ParamCtrl.capa && j<ParamCtrl.capa.length)))   //hi ha alguna capa digitalitzable
				boto_p="inserta";
			else if (i<ParamCtrl.capa.length || (ParamCtrl.capa && k<ParamCtrl.capa.length))  //hi ha alguna capa consultable
				boto_p=(i<ParamCtrl.capa.length && Accio && Accio.accio&accio_validacio) ? "conval" : "conloc";				
			else
				boto_p="zoomfin";
			
			botons[botons.length]={"src": "pan", 
				   "alt": DonaCadenaLang({"cat":"mou vista", "spa":"mueve vista", "eng":"pan view", "fre":"déplace vue"}), 
				   "funcio": "CanviaEstatClickSobreVista(\'ClickPan1\');"};
	    	if (ParamCtrl.BarraBotoMouMig==true)
	    	{
				botons[botons.length]={"src": "moumig", 
					   "alt": DonaCadenaLang({"cat":"centra on faci clic", "spa":"centra donde haga clic", "eng":"center where click", "fre":"centre où cliquer"}),  
					   "funcio": "CanviaEstatClickSobreVista(\'ClickMouMig\');"};
 			}
			botons[botons.length]={"src": "zoomfin", 
					   "alt": DonaCadenaLang({"cat":"zoom de finestra", "spa":"zoom de ventana", "eng":"window zoom", "fre":"zoom de fenêtre"}), 
					   "funcio": "CanviaEstatClickSobreVista(\'ClickZoomRec1\');"};
			if (ParamCtrl.BarraBotoNovaVista==true)
			{
				botons[botons.length]={"src": "novavista",
					   "alt": DonaCadenaLang({"cat":"nova vista", "spa":"nova vista", "eng":"new view", "fre":"nouvelle vue"}),
					   "funcio": "CanviaEstatClickSobreVista(\'ClickNovaVista1\');"};
			}
			if (i<ParamCtrl.capa.length || (ParamCtrl.capa && k<ParamCtrl.capa.length))  //hi ha alguna capa consultable
			{
				botons[botons.length]={"src": (i<ParamCtrl.capa.length && Accio && Accio.accio&accio_validacio) ? "conval" : "conloc",
					   "alt": (i<ParamCtrl.capa.length && Accio && Accio.accio&accio_validacio) ? DonaCadenaLang({"cat":"validació", "spa":"validación", "eng":"validate", "fre":"validation"}) : DonaCadenaLang({"cat":"consulta", "spa":"consulta", "eng":"query", "fre":"reserche"}),
					   "funcio": "CanviaEstatClickSobreVista(\'ClickConLoc\');"};
			}
			if (ParamCtrl.BarraBotoInsereix==true || (ParamCtrl.capa && j<ParamCtrl.capa.length))
		    {
				botons[botons.length]={"src": "inserta", 
					   "alt": DonaCadenaLang({"cat":"editar un nou punt", "spa":"editar un nuevo punto", "eng":"edit a new point", "fre":"éditer un nouveaux point"}),  
					   "funcio": "CanviaEstatClickSobreVista(\'ClickEditarPunts\');"};
 			}
			cdns.push(CadenaBotonsAlternatius(boto_p, botons),"\n");
		}

		if ((typeof ParamCtrl.BarraEscala==="undefined" || ParamCtrl.BarraEscala==true) &&
			(ParamCtrl.LlistatZoomFraccio==true || ParamCtrl.LlistatZoomMidaPixel==true || ParamCtrl.LlistatZoomEscalaAprox==true))
		{
			cdns.push("&nbsp;<span class=\"titol_zoom\">",
			   (ParamCtrl.TitolLlistatNivellZoom ? 
					DonaCadena(ParamCtrl.TitolLlistatNivellZoom) : 
					"Zoom:"),
			   "</span>",
			   "<select CLASS=text_petit name=\"nivell\" onChange=\"PortamANivellDeZoom(parseInt(document.zoom.nivell.value,10));\">\n");

			for (var i=0; i<ParamCtrl.zoom.length; i++)
			{
			    cdns.push("<OPTION VALUE=\"",i,"\"",
			    	((i==DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual)) ? " SELECTED" : "") ,">",
				(EscriuDescripcioNivellZoom(i, crs ? crs : ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, false)), "</OPTION>\n");
			}
			cdns.push("</select>\n");
		}
		if (ParamCtrl.BarraBotoCTipica==true && ParamCtrl.ConsultaTipica)
			cdns.push((CadenaBotoPolsable("consulta_tipica_i", "ctipica", DonaCadenaLang({"cat":"Consulta típica o per objectes", "spa":"Consulta típica o por objetos", "eng":"Typical or object query","fre":"Recherche typique où par objets"}), "MostraOAmagaCtipiques();")));
		for (i=0; i<ParamCtrl.capa.length; i++)
		{
		 	if (ParamCtrl.capa[i].descarregable!="no")
			{
			    //window.document.write("&nbsp;");
				cdns.push((CadenaBotoPolsable("getmmz", "getmmz", DonaCadenaLang({"cat":"descarregar", "spa":"descargar", "eng":"download", "fre":"télécharger"}), "ObtenirMMZ();")),"\n");
				break;
			}
		}
		for (i=0; i<ParamCtrl.capa.length; i++)
		{
		 	if (ParamCtrl.capa[i].animable==true)
			{
				cdns.push((CadenaBotoPolsable("video", "video", DonaCadenaLang({"cat":"mostrar animació", "spa":"mostrar animación", "eng":"show animation", "fre":"montrer animation"}), 
					"MostraFinestraVideo();")),"\n");
				break;
			}
		}
		
		if (ParamCtrl.BarraBotoCaixaParam==true)
			cdns.push((CadenaBotoPolsable("param", "param", DonaCadenaLang({"cat":"opcions", "spa":"opciones", "eng":"options","fre":"options"}), "MostraFinestraParametres();")));
		if (ParamCtrl.BarraBotoConsola==true)
			cdns.push((CadenaBotoPolsable("consola", "consola", DonaCadenaLang({"cat":"consola", "spa":"consola", "eng":"console","fre":"console"}), "MostraFinestraConsola();")));
		if (ParamCtrl.BarraBotoEnllac==true)
			cdns.push((CadenaBotoPolsable("enllac", "enllac", DonaCadenaLang({"cat":"enllaç al mapa", "spa":"enlace al mapa", "eng":"link to map", "fre":"lien à la carte"}), "MostraFinestraEnllac();")));
		if (ParamCtrl.BarraBotoEnllacWMS==true)
			cdns.push((CadenaBotoPolsable("enllacWMS", "enllacWMS", DonaCadenaLang({"cat":"enllaços als servidors", "spa":"enlaces a los servidores", "eng":"links to the servers", "fre":"lien aux serveurs"}), "MostraFinestraEnllacWMS();")));
		if (ParamCtrl.BarraBotoAfegeixCapa==true)
			cdns.push((CadenaBotoPolsable("afegirCapa", "afegirCapa", DonaCadenaLang({"cat":"Afegir capes", "spa":"Añadir capas", "eng":"Add layers", "fre":"Ajouter couches"}), "IniciaFinestraAfegeixCapaServidor(0);")));			
		if (ParamCtrl.BarraBotoCalculadora==true)
			cdns.push((CadenaBotoPolsable("calculadora", "calculadora", DonaCadenaLang({"cat":"Calculadora de capes", "spa":"Calculadora de capas", "eng":"Layer calculator", "fre":"Calculateur de couches"}), "IniciaFinestraCalculadoraCapes();")));			
		cdns.push("\n");

		if (ParamCtrl.BarraBotoPrint==true)
			cdns.push((CadenaBotoPolsable("print", "print", DonaCadenaLang({"cat":"imprimir", "spa":"imprimir", "eng":"print", "fre":"imprimer"}), "ObreTriaFullImprimir();")));
		if (ParamCtrl.BarraBotoPlanaPrincipal==true)
			cdns.push((CadenaBotoPolsable("home", "home", DonaCadenaLang({"cat":"Reiniciar des de servidor", "spa":"Reiniciar desde servidor", "eng":"Restart from server", "fre":"Redémarrer depuis le serveur"}), "RestartMiraMonMapBrowser();")));
		if (ParamCtrl.BarraBotoInstallarMMZ==true)
			cdns.push((CadenaBotoPolsable("instmmr", "instmmr", 
				DonaCadenaLang({"cat":"instal·lar el Lector Universal de Mapes del MiraMon", "spa":"instalar el Lector Universal de Mapas de MiraMon", "eng":"install MiraMon Universal Map Reader","fre":"installer le Lecteur Universel de Cartes du Miramon"}), 
				"InstalaLectorMapes();")));
		if (ParamCtrl.BarraBotoAjuda==true)
			cdns.push((CadenaBotoPolsable("ajuda", "ajuda", DonaCadenaLang({"cat":"ajuda interactiva", "spa":"ayuda interactiva", "eng":"interactive help","fre":"aide intéractive"}), 
				"ObreFinestraAjuda();")));
		if (ParamCtrl.BarraBotonsIdiomes==true && ParamCtrl.idiomes.length>1)
		{
			var nom_idioma_alt={"cat": "Català", "spa": "Español", "eng": "English", "fre":"Français"};
			//var boto_per_defecte=(ParamCtrl.idioma=="cat")?0:((ParamCtrl.idioma=="spa")?1:2);
			var boto_per_defecte;
			for (boto_per_defecte=0; boto_per_defecte<ParamCtrl.idiomes.length; boto_per_defecte++)
			{
				if (ParamCtrl.idiomes[boto_per_defecte]==ParamCtrl.idioma)
					break;
			}
			if (boto_per_defecte==ParamCtrl.idiomes.length)
				boto_per_defecte=0;
			if (ParamCtrl.idiomes.length==2)
				cdns.push((CadenaBotonsAlternatius("idioma_"+ParamCtrl.idiomes[boto_per_defecte], 
					[{"src": "idioma_"+ParamCtrl.idiomes[0], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[0]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[0]+"\');"}, 
					 {"src": "idioma_"+ParamCtrl.idiomes[1], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[1]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[1]+"\');"}])),"\n");
			else if (ParamCtrl.idiomes.length==3)
				cdns.push((CadenaBotonsAlternatius("idioma_"+ParamCtrl.idiomes[boto_per_defecte], 
					[{"src": "idioma_"+ParamCtrl.idiomes[0], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[0]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[0]+"\');"}, 
					 {"src": "idioma_"+ParamCtrl.idiomes[1], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[1]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[1]+"\');"}, 
					 {"src": "idioma_"+ParamCtrl.idiomes[2], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[2]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[2]+"\');"}]))+"\n");
			else //if (ParamCtrl.idiomes.length==4)
				cdns.push((CadenaBotonsAlternatius("idioma_"+ParamCtrl.idiomes[boto_per_defecte], 
					[{"src": "idioma_"+ParamCtrl.idiomes[0], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[0]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[0]+"\');"}, 
					 {"src": "idioma_"+ParamCtrl.idiomes[1], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[1]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[1]+"\');"}, 
					 {"src": "idioma_"+ParamCtrl.idiomes[2], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[2]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[2]+"\');"}, 
					 {"src": "idioma_"+ParamCtrl.idiomes[3], "alt": DonaCadenaConcret(nom_idioma_alt, ParamCtrl.idiomes[3]), "funcio": "CanviaIdioma(\'"+ParamCtrl.idiomes[3]+"\');"}]))+"\n");
		}
		if (ParamCtrl.AltresLinks)
			cdns.push((CadenaBotoPolsable(ParamCtrl.AltresLinks.boto, ParamCtrl.AltresLinks.boto, DonaCadena(ParamCtrl.AltresLinks.text_boto), ParamCtrl.AltresLinks.funcio)));
	}
	cdns.push("</FORM>\n");
	var elem=getLayer(window, "barra");
	if (isLayer(elem))
	{
		contentLayer(elem, cdns.join(""));
		if (window.document.zoom.nivell)
			window.document.zoom.nivell.focus();
	}	
}//Fi de CreaBarra()

function EsCapaDinsAmbitActual(capa)
{
	if (capa.EnvTotal==null || capa.EnvTotal.EnvCRS==null)
		return true;
	if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()==capa.EnvTotal.CRS.toUpperCase())
	{
		if (!EsEnvDinsEnvolupant(ParamInternCtrl.vista.EnvActual, capa.EnvTotal.EnvCRS))
			return false;
	}
	else if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS) && 
		 capa.EnvTotalLL)
	{		
		if (!EsEnvDinsEnvolupant(ParamInternCtrl.vista.EnvActual, capa.EnvTotalLL))
			return false;
	}
	else
	{
		//Paso l'envolupant actual a lat/long i comparo.
		var env_ll=DonaEnvolupantLongLat(ParamInternCtrl.vista.EnvActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (!EsEnvDinsEnvolupant(env_ll,capa.EnvTotalLL))
			return false;
	}
	return true;
}

function EsCapaDinsAmbitCapa(c, c2)
{
	if (c.EnvTotal==null || c.EnvTotal.EnvCRS==null || c2.EnvTotal==null || c2.EnvTotal.EnvCRS==null)
		return true;
	if (c.EnvTotal.CRS.toUpperCase()==c2.EnvTotal.CRS.toUpperCase())
	{
		if (!EsEnvDinsEnvolupant(c.EnvTotal.EnvCRS, c2.EnvTotal.EnvCRS))
			return false;
	}
	else if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS) && 
		 c.EnvTotalLL && c2.EnvTotalLL)
	{		
		if (!EsEnvDinsEnvolupant(c.EnvTotalLL, c2.EnvTotalLL))
			return false;
	}
	else
	{
		//Paso l'envolupant actual a lat/long i comparo.
		var env_ll=DonaEnvolupantLongLat(c.EnvTotal.EnvCRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		var env_ll2=DonaEnvolupantLongLat(c2.EnvTotal.EnvCRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (!EsEnvDinsEnvolupant(env_ll,env_ll2))
			return false;
	}
	return true;
}

function EsImatgeSituacioDinsAmbitActual(i)
{
var env_situa=ParamCtrl.ImatgeSituacio[i].EnvTotal;
var env_situa_actual=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal;

	if (ParamInternCtrl.ISituacio==i)
		true;
	if (env_situa_actual.CRS.toUpperCase()==env_situa.CRS.toUpperCase())
	{
		if (!EsEnvDinsEnvolupant(ParamInternCtrl.vista.EnvActual, env_situa.EnvCRS))
			return false;
	}
	else if (EsProjLongLat(env_situa_actual.CRS))
	{		
		if (!EsEnvDinsEnvolupant(ParamInternCtrl.vista.EnvActual, ParamInternCtrl.EnvLLSituacio[i]))
			return false;
	}
	else
	{
		//Paso l'envolupant actual a lat/long i comparo.
		var env_ll=DonaEnvolupantLongLat(ParamInternCtrl.vista.EnvActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (!EsEnvDinsEnvolupant(env_ll, ParamInternCtrl.EnvLLSituacio[i]))
			return false;
	}
	return true;
}


function EsTileMatrixSetDeCapaDisponbleEnElCRSActual(c)
{
	if(DonaTipusServidorCapa(c.tipus)=="TipusWMS_C" || DonaTipusServidorCapa(c.tipus)=="TipusWMTS_REST" || DonaTipusServidorCapa(c.tipus)=="TipusWMTS_KVP" || DonaTipusServidorCapa(c.tipus)=="TipusWMTS_SOAP")
	{
		if(c.TileMatrixSet)
		{
			for (var i=0; i<c.TileMatrixSet.length; i++)
			{
				//·$· Que passa amb els sinònims de sistemes de referència??? ara mateix no es tenen en compte i no funcionen
				if (c.TileMatrixSet[i].CRS && 
					c.TileMatrixSet[i].CRS.toUpperCase()==ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase())
				{
					return true;
				}
			}
			return false;			
		}
		else
			return false;
	}
	else
		return true;
}

function EsCapaDisponibleEnElCRSActual(capa)
{
	if (capa.CRS)
	{
		for (var i=0; i<capa.CRS.length; i++)
		{
			//·$· Que passa amb els sinònims de sistemes de referència??? ara mateix no es tenen en compte i no funcionen
			if (capa.CRS[i].toUpperCase()==ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase())
				return EsTileMatrixSetDeCapaDisponbleEnElCRSActual(capa);
		}
		return false;
	}
	else
		return EsTileMatrixSetDeCapaDisponbleEnElCRSActual(capa);
}

var FitxerMetadadesWindow=null;
function ObreFinestraFitxerMetadades(i_capa, i_estil)
{
var capa=ParamCtrl.capa[i_capa];

	if (FitxerMetadadesWindow==null || FitxerMetadadesWindow.closed)
	{
		var url=DonaNomFitxerMetadades(capa, i_estil);
		FitxerMetadadesWindow=window.open(url,"FitxerMetadades",'toolbar=no,status=no,scrollbars=yes,location=no,menubar=no,directories=no,resizable=yes,width=700,height=600');
		ShaObertPopUp(FitxerMetadadesWindow);
	}
	else
	{
		FitxerMetadadesWindow.location.href=DonaNomFitxerMetadades(capa, i_estil);
		FitxerMetadadesWindow.focus();
	}
}

function DonaNomFitxerMetadades(capa, i_estil)
{
	if (i_estil==-1)
		return CanviaVariablesDeCadena(DonaCadena(capa.metadades.standard), capa, null);
	return CanviaVariablesDeCadena(DonaCadena(capa.estil[i_estil].metadades.standard), capa, null);
}

function DonaNomFitxerDescarregaTot(i_capa, i_des, i_format, i_data)
{
var capa=ParamCtrl.capa[i_capa];
var s=CanviaVariablesDeCadena(capa.DescarregaTot[i_des].url, capa, i_data);

	if (ParamCtrl.FormatDescarregaTot[capa.DescarregaTot[i_des].format[i_format]].extension)
	{
		s=s.replace("{extension}", ParamCtrl.FormatDescarregaTot[capa.DescarregaTot[i_des].format[i_format]].extension);
		s=s.replace("{EXTENSION}", ParamCtrl.FormatDescarregaTot[capa.DescarregaTot[i_des].format[i_format]].extension);
	}
	return s;
}

function DonaCadenaHTMLSimbolUnicLlegenda(estil)
{
var cdns=[];
	cdns.push("<td valign=\"middle\">");
	if (estil.TipusObj=="S")
		cdns.push("<img src=\"", AfegeixAdrecaBaseSRC(estil.ItemLleg[0].color), "\">");
	else if (estil.TipusObj=="L" || estil.TipusObj=="P")
		cdns.push("<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"><tr><td><img src=\"" ,
					AfegeixAdrecaBaseSRC(DonaFitxerColor(estil.ItemLleg[0].color)), "\" width=\"18\" height=\"",
					((estil.TipusObj=="P") ? 10 : 2), "\"></td></tr></table>");
	cdns.push("</td><td valign=\"middle\" nowrap>");
	return cdns.join("");
}

function DonaCadenaHTMLSimbolMultipleLlegenda(estil, salt_entre_columnes, aspecte)
{
var cdns=[];

	var ncol_items=estil.ncol ? estil.ncol : 1;
	cdns.push("<TABLE border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	for (var j=0; j<salt_entre_columnes; j++)
	{
		cdns.push("<tr><td valign=\"middle\"><img src=\"",
				  AfegeixAdrecaBaseSRC("1tran.gif"), 
				  "\" width=\"4\" height=\"1\"></td>");
		for (var k=0; k<ncol_items; k++)
		{
			var l=j+k*salt_entre_columnes;
			if (l<estil.ItemLleg.length)
			{
				cdns.push("<td valign=\"middle\">");
				if (estil.TipusObj=="S")
					cdns.push("<img src=\"", AfegeixAdrecaBaseSRC(estil.ItemLleg[l].color), "\">");
				else if (estil.TipusObj=="L" || estil.TipusObj=="P")
					cdns.push("<table border=\"1\" cellspacing=\"0\" cellpadding=\"0\"><tr><td><img src=\"",
						AfegeixAdrecaBaseSRC(DonaFitxerColor(estil.ItemLleg[l].color)),
						"\" width=\"10\" height=\"",
						((estil.TipusObj=="P") ? 6 : 2),
						"\"></td></tr></table>");
				cdns.push("</td>",
					"<td valign=\"middle\"><img src=\"",
					AfegeixAdrecaBaseSRC("1tran.gif"), 
					"\" width=\"2\" height=\"1\"></td>",
					"<td valign=\"middle\">",aspecte.PreviDescColor,
						(DonaCadena(estil.ItemLleg[l].DescColor)==null ? 
							"" : DonaCadena(estil.ItemLleg[l].DescColor)) ,
						aspecte.PostDescColor,"</td>");
			}
			else
				cdns.push("<td colspan=3 valign=\"middle\">",aspecte.PreviDescColor,"&nbsp;",aspecte.PostDescColor,"</td>");
		}
		cdns.push("</tr>");
	}
	cdns.push("</TABLE>");
	return cdns.join("");
}

var llegenda_amb_control_capes=0x01;
var llegenda_amb_capes_no_visibles=0x02;

function DonaCadenaHTMLLlegenda(aspecte, flag)
{
var salt_entre_columnes, cdns=[], capa, estil;
var alguna={desplegable:1, visible:1, consultable:1, descarregable:1, getcoverage:1, WPS:1};

	if (flag&llegenda_amb_control_capes)
	{
		cdns.push("<form name=form_llegenda>");			
		if (!(ParamCtrl.LlegendaIconesInactivesGrises && ParamCtrl.LlegendaIconesInactivesGrises==true))
		{
			alguna.visible=0;
			alguna.consultable=0;
			alguna.descarregable=0;			
			alguna.getcoverage=0;
			alguna.WPS=0;
			for (var i=0; i<ParamCtrl.capa.length; i++)
			{
				if (EsIndexCapaEspecial(i))
					continue;
				capa=ParamCtrl.capa[i];
				/*if (capa.model==model_vector)
				{
					if ((ParamCtrl.LlegendaAmagaSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa)) ||
						!capa.VisibleALaLlegenda)
						continue;
					if (capa.visible!="no")
						alguna.visible=1;
					if (capa.consultable!="no")
						alguna.consultable=1;
				}
				else
				{*/
					if(!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa))
						continue;
					if (capa.visible!="no")
						alguna.visible=1;
					if (capa.consultable!="no")
						alguna.consultable=1;
					if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable!=true && capa.descarregable!="no")
						alguna.descarregable=1;
					if (EsCapaDecarregableIndividualment(capa))
						alguna.getcoverage=1;
					if (capa.proces)
						alguna.WPS=1;
				//}
			}
		}
	}
	else
	{
		alguna.desplegable=0;
		alguna.visible=0;
		alguna.consultable=0;
		alguna.descarregable=0;
		alguna.getcoverage=0;
		alguna.WPS=0;
	}
	

	//Inici de taula i regle d'un píxel
	cdns.push((aspecte.CapcaleraLlegenda?DonaCadena(aspecte.CapcaleraLlegenda):""),
			"<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tr>");
	if (alguna.desplegable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"7\" height=\"1\"></td>");
	if (alguna.visible)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"10\" height=\"1\"></td>");
	if (alguna.consultable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"16\" height=\"1\"></td>");
	if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable!=true && alguna.descarregable)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"18\" height=\"1\"></td>");
	if (alguna.getcoverage)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"20\" height=\"1\"></td>");
	if (alguna.WPS)
		cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"22\" height=\"1\"></td>");		
	cdns.push("<td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"27\" height=\"1\"></td><td><img src=\"",
									AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"300\" height=\"1\"></td></tr>");

    for (var i=0; i<ParamCtrl.capa.length; i++)
    {
		if (EsIndexCapaEspecial(i))
			continue;
		capa=ParamCtrl.capa[i];
	    if (capa.separa!=null)
	    {
	        if (ParamCtrl.LlegendaAmagaSeparaNoCapa==true &&
	        	(!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa) ||
			    (capa.visible!="si" && capa.visible!="semitransparent" && !(flag&llegenda_amb_capes_no_visibles))))
	        {
	 		    //Busco si hi ha alguna capa visible fins al pròxim separador
				var capa2;
				for (var i2=i+1; i2<ParamCtrl.capa.length; i2++)
		 		{
					capa2=ParamCtrl.capa[i2];
					if (capa2.separa)
						break;
					if (!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa2) ||
						(capa2.visible!="si" && capa2.visible!="semitransparent" && !(flag&llegenda_amb_capes_no_visibles)))
					{
						continue;
					}
						
					cdns.push("<tr><td colspan=");
					if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)					
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
					else
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
					cdns.push(" valign=\"middle\">",aspecte.PreviSepara , DonaCadena(capa.separa) , aspecte.PostSepara , "</td></tr>");
					break;
				}
			}
			else
	    	{
			    cdns.push("<tr><td colspan=");
				if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
				else
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
				cdns.push(" valign=\"middle\">",aspecte.PreviSepara , DonaCadena(capa.separa) , aspecte.PostSepara , "</td></tr>");

	    	}
	    }

	    if (!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa) ||
		   (capa.visible!="si" && capa.visible!="semitransparent" && !(flag&llegenda_amb_capes_no_visibles)) )
			continue;

		if (capa.model==model_vector)
		{
   	   	 	if (flag&llegenda_amb_control_capes)
	   		{
				cdns.push("<tr><td valign=\"middle\">");		
				//Icones de + o -:
				if (capa.estil && capa.estil.length>0 &&
					(capa.visible!="no" && capa.visible!="ara_no") &&
					(!(ParamCtrl.LlegendaGrisSegonsEscala && ParamCtrl.LlegendaGrisSegonsEscala==true) || EsCapaDinsRangDEscalesVisibles(capa)) &&
					capa.estil[capa.i_estil].ItemLleg && capa.estil[capa.i_estil].ItemLleg.length>1)
				{
					cdns.push("<img src=\"");
					if (capa.LlegDesplegada==true)
						cdns.push(AfegeixAdrecaBaseSRC("menys.gif"), "\" alt=\"",
							(DonaCadenaLang({"cat":"plega llegenda", "spa":"recoge leyenda", "eng":"fold legend up","fre":"plie légende"})),
							"\" title=\"",
							(DonaCadenaLang({"cat":"plega llegenda", "spa":"recoge leyenda", "eng":"fold legend up","fre":"plie légende"})));
					else 
						cdns.push(AfegeixAdrecaBaseSRC("mes.gif"), "\" alt=\"",
							(DonaCadenaLang({"cat":"desplega llegenda", "spa":"expande leyenda", "eng":"unfold legend","fre":"déplier légende"})),
							"\" title=\"",
							(DonaCadenaLang({"cat":"desplega llegenda", "spa":"expande leyenda", "eng":"unfold legend","fre":"déplier légende"})));
	
					cdns.push("\" align=middle name=\"m_obj_digi",i,"\" border=\"0\" onClick='CanviaEstatObjDigi(",
						i,", \"lleg_desplegada\");' onMouseOver=\"if (m_obj_digi",i,".alt) window.status=m_obj_digi",
						i,".alt; return true;\" onMouseOut=\"if (m_obj_digi",i,".alt) window.status=\'\'; return true;\">");
				}
				else
					cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("menysg.gif"), "\" alt=\"\" align=middle>");
				cdns.push("</td>");		
				//Icones d'estats:
				//Icones visible:
				if (capa.visible=="no")
				{
					if (alguna.visible)
					{
						if (ParamCtrl.LlegendaIconesInactivesGrises==true)
							cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("ara_no_visibleg.gif"), "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"5\" height=\"1\"></td>");
					}
				}
				else if (ParamCtrl.LlegendaGrisSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa)) 
				{
					if (capa.visible=="ara_no")
						cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("ara_no_visibleg.gif"), "\" align=middle></td>");
					else
						cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("visibleg.gif"), "\" align=middle></td>");
				}
				else
				{
					cdns.push("<td valign=\"middle\">");
					if (capa.visible=="si")
						cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("visible.gif"), "\" alt=\"visible\" title=\"visible\"");
					else
						cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("ara_no_visible.gif"), "\" alt=\"no visible\" title=\"no visible\"");
					cdns.push(" align=middle name=\"v_obj_digi",i,"\" border=\"0\" onClick='CanviaEstatObjDigi(",
							i,", \"visible\");' onMouseOver=\"if (v_obj_digi",i,".alt) window.status=v_obj_digi",
						i,".alt; return true;\" onMouseOut=\"if (v_obj_digi",i,".alt) window.status=\'\'; return true;\"></td>");
				}
				//Icones consultable:
				if (capa.consultable=="no")
				{
					if (alguna.consultable)
					{
						if (ParamCtrl.LlegendaIconesInactivesGrises==true)
							cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("ara_no_consultableg.gif"), "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"1\" height=\"1\"></td>");
					}
				}
				else if (ParamCtrl.LlegendaGrisSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa))
				{
					if (capa.consultable=="ara_no")
						cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("ara_no_consultableg.gif"), "\" align=middle></td>");
					else
						cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("consultableg.gif"), "\" align=middle></td>");
				}
				else
					cdns.push("<td valign=\"middle\"><img src=\"",
						((capa.consultable=="si") ? 
							(AfegeixAdrecaBaseSRC("consultable.gif")+
								"\" alt=\""+DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"})+
								"\" title=\""+DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"}) + "\"") : 
							(AfegeixAdrecaBaseSRC("ara_no_consultable.gif")+
								"\" alt=\""+DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"})+
								"\" title=\""+DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"})+"\" align=middle")),
							" name=\"c_obj_digi",i,"\" border=\"0\" onClick='CanviaEstatObjDigi(",i,
						", \"consultable\");' onMouseOver=\"if (c_obj_digi",i,".alt) window.status=c_obj_digi",i,
						".alt; return true;\" onMouseOut=\"if (c_obj_digi",i,".alt) window.status=\'\'; return true;\"></td>");
				//Icones descarregable:
				if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable!=true && alguna.descarregable)
				{
					cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"1\" height=\"1\"></td>");
				}
				//Botó de GetCoverage:
				if (alguna.getcoverage)
					cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"1\" height=\"1\"></td>");
				//Botó de processos
				if(alguna.WPS)
					cdns.push("<td valign=\"middle\"><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" width=\"1\" height=\"1\"></td>");
		     }
		 
			 //Icona o color general per tota la capa en el cas de símbol únic
			 if (capa.estil && capa.estil.length>0 && capa.estil[capa.i_estil].ItemLleg && 
				capa.estil[capa.i_estil].ItemLleg.length==1 &&
			   (!(ParamCtrl.LlegendaGrisSegonsEscala && ParamCtrl.LlegendaGrisSegonsEscala==true) || EsCapaDinsRangDEscalesVisibles(capa)))
				cdns.push(DonaCadenaHTMLSimbolUnicLlegenda(capa.estil[capa.i_estil]));
			 else
				cdns.push("<td colspan=2 valign=\"middle\" nowrap>");

			 //Nom de capa
			 if (flag&llegenda_amb_control_capes)
			 {
				if (isLayer(window, "menuContextualCapa"))  //https://stackoverflow.com/questions/4235426/how-can-i-capture-the-right-click-event-in-javascript
					cdns.push("<a href=\"javascript:void(0);\" style=\"cursor:context-menu;\" onClick=\"OmpleLayerContextMenuCapa(event,",i,");\" onContextMenu=\"return OmpleLayerContextMenuCapa(event,",i,");\">");
				else if (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades.standard))
					cdns.push("<a href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i,",-1);\" title=\"", 
						DonaCadenaLang({"cat":"metadades", "spa":"metadatos", "eng":"metadata","fre":"métadonnées"}), "\">");
			 }		
			 if (ParamCtrl.LlegendaGrisSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa))
				cdns.push(aspecte.PreviDescLlegendaGris , DonaCadena(capa.DescLlegenda) , aspecte.PostDescLlegendaGris);
			 else
				cdns.push(aspecte.PreviDescLlegenda , DonaCadena(capa.DescLlegenda) , aspecte.PostDescLlegenda);
			
			 if (flag&llegenda_amb_control_capes && (isLayer(window, "menuContextualCapa") || (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades.standard))))
				cdns.push("</a>");
			 cdns.push("</td></tr>");
		}
		else // model no vector
		{
			if (flag&llegenda_amb_control_capes)
			{
				cdns.push("<tr><td valign=\"middle\">");
			
				//Icones de + o -:
				if (capa.estil && capa.estil.length>0 && 
					(!capa.grup || !(ParamCtrl.LlegendaGrupsComARadials && ParamCtrl.LlegendaGrupsComARadials==true) || (capa.visible!="no" && capa.visible!="ara_no")) &&
					(!(ParamCtrl.LlegendaGrisSegonsEscala && ParamCtrl.LlegendaGrisSegonsEscala==true) || EsCapaDinsRangDEscalesVisibles(capa)) &&
					(!(ParamCtrl.LlegendaGrisSiForaAmbit && ParamCtrl.LlegendaGrisSiForaAmbit==true) || EsCapaDinsAmbitActual(capa)) &&
					((capa.estil[capa.i_estil].ItemLleg && capa.estil[capa.i_estil].ItemLleg.length>1) || (capa.estil[capa.i_estil].nItemLlegAuto && capa.estil[capa.i_estil].nItemLlegAuto>1)))
				{
					if (capa.LlegDesplegada==true)
						cdns.push("<img src=\"",
								  AfegeixAdrecaBaseSRC("menys.gif"), 
								  "\" alt=\"",
							(DonaCadenaLang({"cat":"plega llegenda", "spa":"recoge leyenda", "eng":"fold legend up","fre":"plie légende"})),
							"\" title=\"",
							(DonaCadenaLang({"cat":"plega llegenda", "spa":"recoge leyenda", "eng":"fold legend up","fre":"plie légende"})),
							"\"");
					else 
						cdns.push("<img src=\"",
								  AfegeixAdrecaBaseSRC("mes.gif"), 
								  "\" alt=\"",
							(DonaCadenaLang({"cat":"desplega llegenda", "spa":"expande leyenda", "eng":"unfold legend", "fre":"déplier légende"})),
						"\" title=\"",
						(DonaCadenaLang({"cat":"desplega llegenda", "spa":"expande leyenda", "eng":"unfold legend", "fre":"déplier légende"})),
						"\"");
					cdns.push(" align=middle name=\"m_raster",i,"\" border=\"0\" onClick='CanviaEstatCapa(",
						i,", \"lleg_desplegada\");' onMouseOver=\"if (m_raster",i,".alt) window.status=m_raster",
						i,".alt; return true;\" onMouseOut=\"if (m_raster",i,".alt) window.status=\'\'; return true;\">");
				}
				else
					cdns.push("<img src=\"",
							  AfegeixAdrecaBaseSRC("menysg.gif"), 
							  "\" alt=\"\" align=middle>");
				cdns.push("</td>");
				//Icones d'estats:
				//Icones visible:
				if (capa.visible=="no")
				{
					if (alguna.visible)
					{
						if (ParamCtrl.LlegendaIconesInactivesGrises==true)
						{
							if (capa.grup!=null && capa.grup!="")
								cdns.push("<td valign=\"middle\"><img src=\"",
										  AfegeixAdrecaBaseSRC("ara_no_radiog.gif"), 
										  "\" align=middle></td>");
							else
								cdns.push("<td valign=\"middle\"><img src=\"",
										  AfegeixAdrecaBaseSRC("ara_no_visibleg.gif"), 
										  "\" align=middle></td>");
						}
						else
							cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\" width=\"5\" height=\"1\"></td>");
					}
				}
				else if ((ParamCtrl.LlegendaGrisSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa)) ||
					 (ParamCtrl.LlegendaGrisSiForaAmbit==true && !EsCapaDinsAmbitActual(capa)))
				{
					if (capa.grup!=null && capa.grup!="")
					{
						if (capa.visible=="ara_no")
							cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("ara_no_radiog.gif"),  
								  "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("radiog.gif"), 
								  "\" align=middle></td>");
					}
					else
					{
						if (capa.visible=="ara_no")
							cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_visibleg.gif"), 
									  "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("visibleg.gif"), 
									  "\" align=middle></td>");
					}
				}
				else
				{
						//"<input type=\"checkbox\" name=\"raster"+i+"\""+ ((capa.visible=="si") ? " checked" : "") +" onClick=\"ControlCapes(document.llegenda)\">"+
					cdns.push("<td valign=\"middle\">");
					if (capa.grup && ParamCtrl.LlegendaGrupsComARadials==true)
					{
						if (capa.visible=="si")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("radio.gif"), 
									  "\" alt=\"visible\" title=\"visible\"");  //No cal DonaCadena();
						else if (capa.visible=="semitransparent")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("semi_radio.gif"),  
									  "\" alt=\"",
								(DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),
							"\" title=\"", (DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),"\"");
						else
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_radio.gif"),  
									  "\" alt=\"no visible\" title=\"no visible\"");  //No cal DonaCadena();
					}
					else
					{
						if (capa.visible=="si")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("visible.gif"), 
									  "\" alt=\"visible\" title=\"visible\"");  //No cal DonaCadena();
						else if (capa.visible=="semitransparent")
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("semitransparent.gif"), 
									  "\" alt=\"",(DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),
							"\" title=\"",(DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent","fre":"semi transparent"})),"\"");
						else
							cdns.push("<img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_visible.gif"), 
									  "\" alt=\"no visible\" title=\"no visible\""); //No cal DonaCadena();
					}
					cdns.push(" align=middle name=\"v_raster",i,"\" border=\"0\" onClick='CanviaEstatCapa(",
						i,", \"visible\");' onMouseOver=\"if (v_raster",i,".alt) window.status=v_raster",
						i,".alt; return true;\" onMouseOut=\"if (v_raster",i,".alt) window.status=\'\'; return true;\"></td>");
				}
				//Icones consultable:
				if (capa.consultable=="no")
				{
					if (alguna.consultable)
					{
						if (ParamCtrl.LlegendaIconesInactivesGrises==true)
							cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("ara_no_consultableg.gif"),  
								  "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("1tran.gif"), 
								  "\" width=\"1\" height=\"1\"></td>");
					}
				}
				else if ((ParamCtrl.LlegendaGrisSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa)) ||
					 (ParamCtrl.LlegendaGrisSiForaAmbit==true && !EsCapaDinsAmbitActual(capa)))
				{
					if (capa.consultable=="ara_no")
						cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("ara_no_consultableg.gif"),  
								  "\" align=middle></td>");
					else
						cdns.push("<td valign=\"middle\"><img src=\"",
								  AfegeixAdrecaBaseSRC("consultableg.gif"), 
								  "\" align=middle></td>");
				}
				else
					cdns.push("<td valign=\"middle\"><img src=\"",
						((capa.consultable=="si") ? 
							(AfegeixAdrecaBaseSRC("consultable.gif") +
							"\" alt=\""+DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"})+
							"\" title=\""+DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"})+ "\"") : 
							(AfegeixAdrecaBaseSRC("ara_no_consultable.gif") +
							"\" alt=\""+DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"})+
							"\" title=\""+DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"})+ "\" align=middle")),
								" name=\"c_raster",i,"\" border=\"0\" onClick='CanviaEstatCapa(",
							i,", \"consultable\");' onMouseOver=\"if (c_raster",i,".alt) window.status=c_raster",
							i,".alt; return true;\" onMouseOut=\"if (c_raster",i,".alt) window.status=\'\'; return true;\"></td>");
				//Icones descarregable:
				if (!(ParamCtrl.LlegendaLligaVisibleAmbDescarregable && ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true))
					if (capa.descarregable=="no")
					{
						if (alguna.descarregable)
						{
							if (ParamCtrl.LlegendaIconesInactivesGrises==true)
								cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_descarregableg.gif"), 
									  "\" align=middle></td>");
							else
								cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\" width=\"1\" height=\"1\"></td>");
						}
					}
					else if ((ParamCtrl.LlegendaGrisSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa)) ||
						 (ParamCtrl.LlegendaGrisSiForaAmbit==true && !EsCapaDinsAmbitActual(capa)))
					{
						if (capa.descarregable=="ara_no")
							cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("ara_no_descarregableg.gif"), 
									  "\" align=middle></td>");
						else
							cdns.push("<td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("descarregableg.gif"), 
									  "\" align=middle></td>");
					}
					else
						cdns.push("<td valign=\"middle\"><img src=\"",
								((capa.descarregable=="si") ? 
											(AfegeixAdrecaBaseSRC("descarregable.gif") +
											"\" alt=\""+DonaCadenaLang({"cat":"descarregable", "spa":"descargable", "eng":"downloadable", "fre":"téléchargeable"})+"\"") : 
											(AfegeixAdrecaBaseSRC("ara_no_descarregable.gif") +
											"\" alt=\""+DonaCadenaLang({"cat":"no descarregable", "spa":"no descargable", "eng":"no downloadable", "fre":"non téléchargeable"})+"\" align=middle")),
									" name=\"z_raster",i,"\" border=\"0\" onClick='CanviaEstatCapa(",i,
								", \"descarregable\");' onMouseOver=\"if (z_raster",i,".alt) window.status=z_raster",i,
								".alt; return true;\" onMouseOut=\"if (z_raster",i,".alt) window.status=\'\'; return true;\"></td>");
			}
			//Botó de GetCovergage:
			if (EsCapaDecarregableIndividualment(capa))
			{
				cdns.push("<td valign=\"middle\">",
				(CadenaBotoPolsable("getcov"+i, "getcov", DonaCadenaLang({"cat":"descarregar", "spa":"descargar", "eng":"download", "fre":"téléchargeable"}), "MostraFinestraDownload("+i+")")),
				"</td>");
			}
			else
			{
				if (alguna.getcoverage)
					cdns.push("<td valign=\"middle\"><img src=\"",
							  AfegeixAdrecaBaseSRC("1tran.gif"), 
							  "\" width=\"1\" height=\"1\"></td>");
			}
	
			//Botó de WPS
			if(capa.proces==null)
			{
				if (alguna.WPS)
					cdns.push("<td valign=\"middle\"><img src=\"",
						  AfegeixAdrecaBaseSRC("1tran.gif"), 
						  "\" width=\"1\" height=\"1\"></td>");
			}
			else
				cdns.push("<td valign=\"middle\">",
							(CadenaBotoPolsable("excutewps"+i, "executewps", 
									DonaCadenaLang({"cat":"servei de processos", "spa":"servicio de procesos", "eng":"processing service","fre":"service des processus"}), 
									"IniciaFinestraExecutaProcesCapa("+i+")")),
							"</td>");
	

			//Icona o color general per tota la capa en cas de simbol únic.
			if (capa.estil && capa.estil.length && capa.estil[capa.i_estil].ItemLleg && 
				capa.estil[capa.i_estil].ItemLleg.length==1 &&
				(!(ParamCtrl.LlegendaGrisSegonsEscala && ParamCtrl.LlegendaGrisSegonsEscala==true) || EsCapaDinsRangDEscalesVisibles(capa)) &&
					(!(ParamCtrl.LlegendaGrisSiForaAmbit && ParamCtrl.LlegendaGrisSiForaAmbit==true) || EsCapaDinsAmbitActual(capa)))
				cdns.push(DonaCadenaHTMLSimbolUnicLlegenda(capa.estil[capa.i_estil]));
			else
				cdns.push("<td colspan=2 valign=\"middle\" nowrap>");

			//Nom de capa
			if (flag&llegenda_amb_control_capes)
			{
				if (isLayer(window, "menuContextualCapa"))
					cdns.push("<a href=\"javascript:void(0);\" style=\"cursor:context-menu;\" onClick=\"OmpleLayerContextMenuCapa(event,",i,");\" onContextMenu=\"return OmpleLayerContextMenuCapa(event,",i,");\">");
				else if (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades.standard))
					cdns.push("<a href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i,",-1);\" title=\"", 
						DonaCadenaLang({"cat":"metadades", "spa":"metadatos", "eng":"metadata","fre":"métadonnées"}), "\">");
			}		
			if ((ParamCtrl.LlegendaGrisSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa)) ||
				(ParamCtrl.LlegendaGrisSiForaAmbit==true && !EsCapaDinsAmbitActual(capa)))
				cdns.push(aspecte.PreviDescLlegendaGris, DonaCadena(capa.DescLlegenda), aspecte.PostDescLlegendaGris);
			else
				cdns.push(aspecte.PreviDescLlegenda , DonaCadena(capa.DescLlegenda) , aspecte.PostDescLlegenda);
			
			if (flag&llegenda_amb_control_capes && (isLayer(window, "menuContextualCapa") || (capa.metadades && capa.metadades.standard && DonaCadena(capa.metadades.standard))))
				cdns.push("</a>");
			cdns.push("</td></tr>");

			//Control del temps si cal
			if (capa.AnimableMultiTime==true && capa.visible!="no" && capa.visible!="ara_no" &&
				(!(ParamCtrl.LlegendaGrisSegonsEscala && ParamCtrl.LlegendaGrisSegonsEscala==true) || EsCapaDinsRangDEscalesVisibles(capa)) &&
					(!(ParamCtrl.LlegendaGrisSiForaAmbit && ParamCtrl.LlegendaGrisSiForaAmbit==true) || EsCapaDinsAmbitActual(capa)))
			{
				if (flag&llegenda_amb_control_capes)
				{
					if(capa.data)
					{
						if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)
						{
							cdns.push("<tr><td valign=\"middle\" colspan=2><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\"></td>",
							   "<td valign=\"middle\" colspan=" ,
							   (alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS) ,
								   "><select CLASS=text_petit name=\"data_capa_",i,"\" onChange=\"CanviaDataDeCapaMultitime(",
							   i,", parseInt(document.form_llegenda.data_capa_",i,".value,10));\">\n");
						}
						else
						{
							cdns.push("<tr><td valign=\"middle\" colspan=2><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\"></td>",
							   "<td valign=\"middle\" colspan=");
							if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)
								cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
							else
								cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
							cdns.push("><select CLASS=text_petit name=\"data_capa_",i,"\" onChange=\"CanviaDataDeCapaMultitime(",
							   i,", parseInt(document.form_llegenda.data_capa_",i,".value,10));\">\n");
						}
						var i_data_sel=DonaIndexDataCapa(capa, null);
						for (var i_data=0; i_data<capa.data.length; i_data++)
						{
							cdns.push("<OPTION VALUE=\"",i_data,"\"",
								((i_data==i_data_sel) ? " SELECTED" : "") ,
							">" , (DonaDataCapaPerLlegenda(i,i_data)) , "</OPTION>\n");
						}
						cdns.push("</select></td></tr>");
					}
					else
					{
						alert(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) +" "+ DonaCadena(capa.desc) + " " +
							DonaCadenaLang({"cat":"indica que és AnimableMultiTime però no té dates definides", "spa":"indica que es AnimableMultiTime pero no tiene fechas definidas", "eng":"indicates that is AnimableMultiTime but it has no dates defined", "fre":"Indique que c\'est AnimableMultiTime, mais il n\'a pas de dates définies"}));
					}
				}
				else
				{
					cdns.push("<td valign=\"middle\" colspan=3>",aspecte.PreviDescEstil,(DonaDataCapaPerLlegenda(i, null)),
						aspecte.PostDescEstil , "</td>");
				}
			}
		}
		if (capa.estil && capa.estil.length && 
			(!capa.grup || !(ParamCtrl.LlegendaGrupsComARadials && ParamCtrl.LlegendaGrupsComARadials==true) || (capa.visible!="no" && capa.visible!="ara_no" &&
			(!(ParamCtrl.LlegendaGrisSegonsEscala && ParamCtrl.LlegendaGrisSegonsEscala==true) || EsCapaDinsRangDEscalesVisibles(capa)) &&
		        (!(ParamCtrl.LlegendaGrisSiForaAmbit && ParamCtrl.LlegendaGrisSiForaAmbit==true) || EsCapaDinsAmbitActual(capa))
			)))
		{
			//Radials d'estil si cal	
			if (capa.estil.length>1 && capa.visible!="ara_no")
			{
				var ncol_estil=capa.NColEstil ? capa.NColEstil : 1;
				/*if (capa.NColEstil==0)
				{
					alert(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) +" "+ DonaCadena(capa.desc) + " "+
							DonaCadenaLang({"cat":", "indica incorrectament 0 columnes dels items de la llegenda però té", "spa":"indica incorrectamente 0 columnas en los items de la leyenda pero tiene", "eng":"has been incorrectly set to 0 columns on the legend items but it has", "fre":"indique 0 colonnes des éléments de la légende mais a"}) +
							 " "+ estil.ItemLleg.length + " " + 
							DonaCadenaLang({"cat":"elements descrits. No es dibuixaran.", "spa":"elementos descritos. No es dibujaran.", "eng":"described elements. They will not be shown on the legend.", "fre":"éléments décrits. Ils ne seront pas dessinés."}));
				}
				else
				{*/
				    cdns.push("<tr>");
				    if (flag&llegenda_amb_control_capes)
				    {
						cdns.push("<td valign=\"middle\" colspan=2><img src=\"",
								  AfegeixAdrecaBaseSRC("1tran.gif"), "\"></td>",
							  "<td valign=\"middle\" colspan=");
						if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
						else
							cdns.push((alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
						cdns.push("><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
						salt_entre_columnes=Math.floor(capa.estil.length/ncol_estil)+((capa.estil.length%ncol_estil!=0) ? 1 : 0);
						for (var j=0; j<salt_entre_columnes; j++)
						{
							cdns.push("<tr><td valign=\"middle\"><img src=\"",
									  AfegeixAdrecaBaseSRC("1tran.gif"), 
									  "\" width=\"4\" height=\"1\"></td>");
							for (var k=0; k<ncol_estil; k++)
							{
								var l=j+k*salt_entre_columnes;
								if (l<capa.estil.length)
								{
									cdns.push("<td valign=\"middle\">",
										"<img src=\"",
										AfegeixAdrecaBaseSRC("1tran.gif"), 
										"\" width=\"4\" height=\"1\"><img align=middle name=\"e_raster_vector",
										i,"_",l,"\"  border=\"0\" onClick='CanviaEstilCapa(",i,", ",l,", false);' src=\"");
									if (l==capa.i_estil)
										cdns.push(AfegeixAdrecaBaseSRC("radio.gif"));
									else
										cdns.push(AfegeixAdrecaBaseSRC("ara_no_radio.gif"));
									cdns.push("\"></td>",
										"<td valign=\"middle\"><img src=\"",
										AfegeixAdrecaBaseSRC("1tran.gif"), 
										"\" width=\"2\" height=\"1\"></td>",
										"<td valign=\"middle\">");
									cdns.push("<a href=\"javascript:void(0);\" style=\"cursor:context-menu;\" onClick=\"OmpleLayerContextMenuEstil(event,", i, ",", l,");\" onContextMenu=\"return OmpleLayerContextMenuEstil(event,", i, ",", l,");\">");
									cdns.push(aspecte.PreviDescEstil , DonaCadena(capa.estil[l].desc) , aspecte.PostDescEstil);
									cdns.push("</a>");
									cdns.push("</td>");
								}
								else
									cdns.push("<td colspan=3 valign=\"middle\">",aspecte.PreviDescEstil,"&nbsp;",aspecte.PostDescEstil,"</td>");
							}
							cdns.push("</tr>");
						}
						cdns.push("</table></td>");
				    }
				    else
				    {
						cdns.push("<td valign=\"middle\" colspan=3>" ,
							aspecte.PreviDescEstil, (DonaCadena(capa.estil[capa.i_estil].desc)),
							aspecte.PostDescEstil, "</td>");
				    }
				    cdns.push("</tr>");
				//}				
			}

			//Si la capa té una paleta, defineixo els colors de la llegenda aquí.
			CreaItemLlegDePaletaSiCal(i, capa.i_estil); 
		
			//Llegenda si hi ha més d'un item
			estil=capa.estil[capa.i_estil];
			if (estil.ItemLleg && estil.ItemLleg.length>1 && 
				(!(flag&llegenda_amb_control_capes) || capa.LlegDesplegada==true))
			{
				var ncol_items=estil.ncol ? estil.ncol : 1;
				salt_entre_columnes=Math.floor(estil.ItemLleg.length/ncol_items)+((estil.ItemLleg.length%ncol_items!=0) ? 1 : 0);
				if (estil.DescItems)
				{
					cdns.push("<tr><td colspan=");
					if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
					else
						cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
					cdns.push(">",aspecte.PreviDescItems,DonaCadena(estil.DescItems),
						aspecte.PostDescItems,"</td></tr>");
				}
				cdns.push("<tr><td colspan=");
				if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable==true)
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.getcoverage+alguna.WPS));
				else
					cdns.push((2+alguna.desplegable+alguna.visible+alguna.consultable+alguna.descarregable+alguna.getcoverage+alguna.WPS));
				cdns.push(">");
				cdns.push(DonaCadenaHTMLSimbolMultipleLlegenda(estil, salt_entre_columnes, aspecte));
				cdns.push("</td></tr>");
			}
		}
		//i=i_fi_grup;
    }
    cdns.push("</table>",
		(aspecte.PeuLlegenda ? 
			(DonaCadena(aspecte.PeuLlegenda)!="" ? "<br>" + DonaCadena(aspecte.PeuLlegenda) : "") 
			: ""));
    if (flag&llegenda_amb_control_capes)
		cdns.push("</form>");
    return cdns.join("");
}//Fi de DonaCadenaHTMLLlegenda()



var scroll_llegenda_previ={"x": 0, "y": 0};

function CreaLlegenda()
{
var salt_entre_columnes;

	var s=DonaCadenaHTMLLlegenda(ParamCtrl.AspecteLlegenda, llegenda_amb_control_capes|llegenda_amb_capes_no_visibles);
	var elem=getLayer(window, "llegenda");
	if (isLayer(elem))
	{
		contentLayer(elem, s);
		showLayer(elem);
		//·$·Queda pendent el tema de la recuperaciò d'scrolls.
	}
}

function EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(capa)
{
	if ((ParamCtrl.LlegendaAmagaSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(capa)) ||
		(ParamCtrl.LlegendaAmagaSiForaAmbit==true && !EsCapaDinsAmbitActual(capa)) ||
		!EsCapaDisponibleEnElCRSActual(capa) ||
		!capa.VisibleALaLlegenda)
		return false;
	return true;
}

function EsCapaVisibleAAquestNivellDeZoom(i)
{
var capa=ParamCtrl.capa[i];
	if ((capa.visible=="si" || capa.visible=="semitransparent") &&
	    EsCapaDinsRangDEscalesVisibles(capa) && EsCapaDinsAmbitActual(capa) && EsCapaDisponibleEnElCRSActual(capa))
		return true;
	return false;
}

/*function EsObjDigiVisibleAAquestNivellDeZoom(c)
{
	//Els nivells de zoom estan invertits.
	if ((c.visible=="si" || c.visible=="semitransparent") &&
	    EsCapaDinsRangDEscalesVisibles(c))
		return true;
	return false;
}*/


function EsVisibleEnAquestaVista(i_vista, c)
{
	if (c.visible_vista==null)
		return true;
	for (var i=0; i<c.visible_vista.length; i++)
	{
		if (c.visible_vista[i]<ParamCtrl.VistaPermanent.length && c.visible_vista[i]==i_vista)
			return true;		
	}
	return false;
}

function EsCapaVisibleEnAquestaVista(i_vista, i_capa)
{
	return EsVisibleEnAquestaVista(i_vista, ParamCtrl.capa[i_capa]);
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
	if (capa.FlagsData.DataMostraAny==true || 
	    capa.FlagsData.DataMostraMes==true || 
	    capa.FlagsData.DataMostraDia==true ||
	    capa.FlagsData.DataMostraHora==true || 
	    capa.FlagsData.DataMostraMinut==true || 
	    capa.FlagsData.DataMostraSegon==true)
		data_a_usar=capa.data[DonaIndexDataCapa(capa, i_data)];
	
	if (capa.FlagsData.DataMostraDescLlegenda==true)
	    cdns.push(DonaCadena(capa.DescLlegenda)," ");
	if (capa.FlagsData.DataMostraDia==true)
	    cdns.push(DonaDayJSON(data_a_usar) , " ");
	if (capa.FlagsData.DataMostraMes==true)
	{
		if (capa.FlagsData.DataMostraDia==true)
		    cdns.push(DonaCadena(PrepMesDeLAny[DonaMonthJSON(data_a_usar)-1]));
		else
		    cdns.push(DonaCadena(MesDeLAny[DonaMonthJSON(data_a_usar)-1]));
	}
	if (capa.FlagsData.DataMostraAny==true)
	{
		if (capa.FlagsData.DataMostraMes==true)
		    cdns.push((DonaCadenaLang({"cat":" de ","spa":" de ", "eng":" ","fre":" "})));
		cdns.push(DonaYearJSON(data_a_usar));
    }
	return cdns.join("");
}

function DonaDataComATextBreu(flags_data, data_a_usar)
{
var cdns=[];

	if (flags_data.DataMostraDia==true)
	{
		if (DonaDayJSON(data_a_usar)<10)
		    cdns.push("0");
		cdns.push(DonaDayJSON(data_a_usar));
	}
	if (flags_data.DataMostraMes==true)
	{
	    if (flags_data.DataMostraDia==true)
	        cdns.push("-");
	    if (DonaMonthJSON(data_a_usar)<10)
			cdns.push("0");
	    cdns.push(DonaMonthJSON(data_a_usar));
	}
	if (flags_data.DataMostraAny==true)
	{
	    if (flags_data.DataMostraMes==true)
			cdns.push("-");
	    cdns.push(DonaYearJSON(data_a_usar));
    }
	if (flags_data.DataMostraHora==true || flags_data.DataMostraMinut==true || flags_data.DataMostraSegon==true)
	{
	    if (flags_data.DataMostraAny==true || flags_data.DataMostraMes==true || flags_data.DataMostraDia==true)
			cdns.push(" ");
	}
	if (flags_data.DataMostraHora==true)
	{
	    if (DonaHourJSON(data_a_usar)<10)
			cdns.push("0");
	    cdns.push(DonaHourJSON(data_a_usar));
    }
	if (flags_data.DataMostraMinut==true)
	{
	    if (flags_data.DataMostraHora==true)
			cdns.push(":");
	    if (DonaMinuteJSON(data_a_usar)<10)
			cdns.push("0");
	    cdns.push(DonaMinuteJSON(data_a_usar));
    }
	if (flags_data.DataMostraSegon==true)
	{
	    if (flags_data.DataMostraMinut==true)
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
	if (capa.FlagsData.properties)
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
	if (capa.FlagsData.DataMostraDescLlegenda==true)
	{
	    cdns.push(DonaCadena(capa.DescLlegenda));
	    if (capa.FlagsData.DataMostraAny==true || 
			capa.FlagsData.DataMostraMes==true || 
			capa.FlagsData.DataMostraDia==true ||
			capa.FlagsData.DataMostraHora==true || 
        	capa.FlagsData.DataMostraMinut==true || 
			capa.FlagsData.DataMostraSegon==true)
		        cdns.push(",");
	}	
	if (capa.FlagsData.DataMostraAny==true || 
		capa.FlagsData.DataMostraMes==true || 
		capa.FlagsData.DataMostraDia==true ||
		capa.FlagsData.DataMostraHora==true || 
        capa.FlagsData.DataMostraMinut==true || 
		capa.FlagsData.DataMostraSegon==true)
		data_a_usar=capa.data[DonaIndexDataCapa(capa, i_data)];
	else
		return cdns.join("");
	cdns.push(DonaDataComATextBreu(capa.FlagsData, data_a_usar));
	return cdns.join("");
}

function DonaDataCompacteComAText(data)
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

	    //Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s¡omple com 00:00:00.
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
}//fi de DonaDataCompacteComAText()

function OmpleDateAPartirDeDataISO8601(o_data, cadena_data)
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
	if(tros_time.length==3) //hh:mm:ss[Z]
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
}

function DonaDateComATextISO8601(data, que_mostrar)
{
var cdns=[];

	if (data && que_mostrar)
	{
		//Segons la ISO com a mínim he de mostrar l'any
	    cdns.push(data.getFullYear ? data.getFullYear() : takeYear(data));
		if(que_mostrar.DataMostraMes==true)
		{
			cdns.push("-");
		    	if( data.getMonth()<9)
				cdns.push("0");
			cdns.push((data.getMonth()+1));
			if (que_mostrar.DataMostraDia==true)
			{
				cdns.push("-");
		    	if(data.getDate()<10)
					cdns.push("0");
			    cdns.push((data.getDate()));

			    //Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s¡omple com 00:00:00.
				if(que_mostrar.DataMostraHora==true)
				{
	    			if(data.getHours()!=0 || data.getMinutes()!=0 || data.getSeconds()!=0) 
				    {
						cdns.push("T");
						if(data.getHours()<10)
							cdns.push("0");
						cdns.push(data.getHours());
						if(que_mostrar.DataMostraMinut==true)
						{
							cdns.push(":" );
							if(data.getMinutes()<10)
								cdns.push("0");
							cdns.push(data.getMinutes());
							if(que_mostrar.DataMostraSegon==true)
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

	if (data && que_mostrar)
	{
		//Segons la ISO com a mínim he de mostrar l'any
	    cdns.push(DonaYearJSON(data));
		if(que_mostrar.DataMostraMes==true)
		{
			cdns.push("-");
		    	if( DonaMonthJSON(data)<10)
				cdns.push("0");
			cdns.push(DonaMonthJSON(data));
			if (que_mostrar.DataMostraDia==true)
			{
				cdns.push("-");
		    	if(DonaDayJSON(data)<10)
					cdns.push("0");
			    cdns.push(DonaDayJSON(data));

			    //Vol dir que hi ha temps, perquè en la creació sinó es diu hora, l'estructura s¡omple com 00:00:00.
				if(que_mostrar.DataMostraHora==true)
				{
	    			if(DonaHourJSON(data)!=0 || DonaMinuteJSON(data)!=0 || DonaSecondJSON(data)!=0) 
				    {
						cdns.push("T");
						if(DonaHourJSON(data)<10)
							cdns.push("0");
						cdns.push(DonaHourJSON(data));
						if(que_mostrar.DataMostraMinut==true)
						{
							cdns.push(":" );
							if(DonaMinuteJSON(data)<10)
								cdns.push("0");
							cdns.push(DonaMinuteJSON(data));
							if(que_mostrar.DataMostraSegon==true)
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
	return cdns.join("");
}//fi de DonaDataJSONComATextISO8601()

//Aquest funció, de moment, només canvia les variables {TIME} i {TIME_ISO}
function CanviaVariablesDeCadena(s, capa, i_data)
{
var i;

	if (capa.data && capa.data.length)
	{
		var i_data_sel=DonaIndexDataCapa(capa, i_data);
		while(true)
		{	
			i=s.indexOf("{TIME}");  //Abans era %TIME% però prefereixo fer servi una URL template.
			if (i==-1)
				break;
			s=s.substring(0,i) + DonaDataCompacteComAText(capa.data[i_data_sel]) + s.substring(i+6,s.length);
			
		}
		while(true)
		{	
			i=s.indexOf("{time}");  //Abans era %TIME% però prefereixo fer servi una URL template.
			if (i==-1)
				break;
			s=s.substring(0,i) + DonaDataCompacteComAText(capa.data[i_data_sel]) + s.substring(i+6,s.length);
			
		}
		while(true)
		{	
			i=s.indexOf("{TIME_ISO}");
			if (i==-1)
				break;
			s=s.substring(0,i) + 
				DonaDataJSONComATextISO8601(capa.data[i_data_sel], capa.FlagsData) + 
				s.substring(i+10,s.length);
		}
		while(true)
		{	
			i=s.indexOf("{time_ISO}");
			if (i==-1)
				break;
			s=s.substring(0,i) + 
				DonaDataJSONComATextISO8601(capa.data[i_data_sel], capa.FlagsData) + 
				s.substring(i+10,s.length);
		}
		while(true)
		{	
			i=s.indexOf("{time_iso}");
			if (i==-1)
				break;
			s=s.substring(0,i) + 
				DonaDataJSONComATextISO8601(capa.data[i_data_sel], capa.FlagsData) + 
				s.substring(i+10,s.length);
		}
	}
	return s;
}

function CanviaDataDeCapaMultitime(i_capa, i_data)
{
	ParamCtrl.capa[i_capa].i_data=i_data;
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
}
/*
 * Returns the WMTS TileMatrixSet from a image url of the tile set.
 * The TileMatrixSet produced in this way lacks CRS and TileMatrix list, which
 * must be added manually.
 * Used to obtain the template from OWSC documents and similar.
 * @param {string} wmts_img_url
 * @returns {CreaNomURLTemplateILlista}
 */
function MMnewTileMatrixSetFromImageURL(wmts_img_url,tileCRS)
{
	var subdirs= wmts_img_url.split("/"),
		i= subdirs.length,
		setName= subdirs[i-4], //TileMatrixSet name id
		myTileMatrixSet,
		myTileMatrixName= subdirs[i-3],
		myEstil= [{"nom": subdirs[i-5], "desc":	null, "DescItems": null, "TipusObj": "I", "metadades": null, "ItemLleg": [{ "color": "#888888", "DescColor": null}], "ncol": 1}],
		myLayer= subdirs[i-6],
		myServer= subdirs.slice(0,i-7).join("/");

	subdirs[i-5]= "{style}";
	subdirs[i-4]= "{TileMatrixSet}";
	subdirs[i-3]= "{TileMatrix}";
	subdirs[i-2]= "{TileCol}";
	subdirs[i-1]= "{TileRow}.{file_extension}";

	//myTileMatrixSet= new CreaNomURLTemplateILlista(setName,tileCRS,subdirs.join("/"),null);
	myTileMatrixSet={"nom":	setName, "CRS":	tileCRS, "URLTemplate":	subdirs.join("/"), "TileMatrix": null};
	//new Array(new CreaTileMatrix("0", 1100, new MMPoint2D(258000, 4766600), 256, 256, 1, 1),)
	
	//We add some members to the object for convenience, so a second call
	//is not required to find this vars:
	myTileMatrixSet.tileMatrixName= myTileMatrixName;
	myTileMatrixSet.symbology= myEstil;
	myTileMatrixSet.layer= myLayer;
	myTileMatrixSet.server= myServer;

	return myTileMatrixSet;
}
function CreaGetTileWMTS_SOAP(i_capa, i_tile_matrix, j, i)
{
	this.i_capa=i_capa;
	this.i_tile_matrix=i_tile_matrix;
	this.j=j;
	this.i=i;
	this.text="";
}

function AvaluaRespostaGetTileWMTS_SOAP(doc, dades_request)
{
var root;
var elem, elem_fill;
var binary_content="";
var format="";
var ns;

	if(!doc || !dades_request) return;	
	root=doc.documentElement;
	if(!root) return;
	
	//Agafo l'element BinaryPayload
	ns="http://www.opengis.net/wmts/"+DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(ParamCtrl.capa[dades_request.i_capa].versio));	
	elem=DonamElementsNodeAPartirDelNomDelTag(root, ns, "wmts", "BinaryPayload");
	if(!elem || elem.length<1)
	{
		ns="http://www.opengis.net/wmts/"+DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[dades_request.i_capa].versio));	
		elem=DonamElementsNodeAPartirDelNomDelTag(root, ns, "wmts", "BinaryPayload");
		if(!elem || elem.length<1)
		{
			alert(DonaCadenaLang({"cat":"No trobo BinaryPayload a la resposta GetTile en SOAP", 
							  "spa":"No encuentro BinaryPayload la respuesta GetTile en SOAP", 
							  "eng":"BinaryPayload cannot be found on GetTile SOAP answer",
							  "fre":"Impossible trouver BinaryPayload à la réponse GetTile à SOAP"})+": \n"+dades_request.text);
			return;  //Si no existeix l'element BinaryPayload es podria mirar si hi ha l'element Fault i 
					   //llegir i mostrar l'excepció, però això de moment no es fa mira en cap dels casos, ni en el GetMap		
		}
	}
	for(var i=0; i<elem[0].childNodes.length; i++)
	{				
		var tag=elem[0].childNodes[i];
		if(tag.tagName=="wmts:Format" || tag.tagName=="Format")
		   format=tag.childNodes[0].nodeValue;
		else if(tag.tagName=="wmts:BinaryContent" || tag.tagName=="BinaryContent" || tag.tagName=="wmts:PayloadContent" || tag.tagName=="PayloadContent")
			binary_content=tag.childNodes[0].nodeValue;
	}
	if(format=="")
	{
		alert(DonaCadenaLang({"cat":"No trobo Format a la resposta GetTile en SOAP", 
						  "spa":"No encuentro Format en la respuesta GetTile en SOAP", 
						  "eng":"Format cannot be found on GetTile SOAP answer",
						  "fre":"Impossible trouver Format à la réponse GetTile à SOAP."})+": \n"+dades_request.text);
		return;  
	}
	else if (binary_content=="")
	{
		alert(DonaCadenaLang({"cat":"No trobo BinaryContent ni PayloadContent a la resposta GetTile en SOAP", 
						  "spa":"No encuentro BinaryContent ni PayloadContent en la respuesta GetTile en SOAP", 
						  "eng":"BinaryPayload and PayloadContent cannot be found on GetTile SOAP answer",
						  "fre":"Impossible trouver BinaryPayload ou PayloadContent à la réponse GetTile à SOAP."})+": \n"+dades_request.text );
		return;  //Si no existeix l'element BinaryPayload es podria mirar si hi ha l'element Fault i 
					   //llegir i mostrar l'excepció, però això de moment no es fa mira en cap dels casos, ni en el GetMap		
	}
	
	/* No ho faig servir perquè no sé perquè però em diu que el binary_content no té cap fill
	//Obtinc el format
	elem_fill=DonamElementsNodeAPartirDelNomDelTag(elem[0], ns, "wmts", "Format");
	if(elem_fill && elem_fill.length>0 && elem_fill[0].hasChildNodes())
	   format=elem_fill[0].childNodes[0].nodeValue;
	else 
		return;

	//Obtinc el binary_content que és la imatge sol·licitada en codificació amb base 63
	elem_fill=DonamElementsNodeAPartirDelNomDelTag(elem[0],ns,"wmts","BinaryContent");
	if(!elem_fill || elem.length<1)
		elem_fill=DonamElementsNodeAPartirDelNomDelTag(elem[0], ns, "wmts", "PayloadContent");
	if(elem_fill && elem_fill.length>0 && elem_fill[0].hasChildNodes())
	   binary_content=elem_fill[0].childNodes[0].nodeValue;
	else
	{
		alert(DonaCadenaLang({"cat":"No trobo BinaryContent ni PayloadContent a la resposta GetTile en SOAP", 
						  "spa":"No encuentro BinaryContent ni PayloadContent en la respuesta GetTile en SOAP", 
						  "eng":"BinaryPayload and PayloadContent cannot be found on GetTile SOAP answer",
						  "fre":"Impossible trouver BinaryPayload ou PayloadContent à la réponse GetTile à SOAP"}));
		return;  //Si no existeix l'element BinaryPayload es podria mirar si hi ha l'element Fault i 
					   //llegir i mostrar l'excepció, però això de moment no es fa mira en cap dels casos, ni en el GetMap		
	}*/


	//alert(binary_content);

	binary_content=binary_content.replace(/\n/g,"");
	binary_content=binary_content.replace(/\r/g,"");
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		setTimeout("window.document." + ParamCtrl.VistaPermanent[i_vista].nom + "_i_raster"+ dades_request.i_capa +"_"+dades_request.j+"_"+dades_request.i +".src=\"data:"+format +";base64,"+ binary_content+"\"", 75);

}//Fi de AvaluaRespostaGetTileWMTS_SOAP()

var RespostaGetTileWMTS_SOAP=[];
var ajaxGetTileWMTS_SOAP=[];

function FesPeticioAjaxGetTileWMTS_SOAP(i_capa, estil, i_tile_matrix_set, i_tile_matrix, j, i, i_data)
{
var cdns=[], cdns_temp=[], s, servidor_temp, capa=ParamCtrl.capa[i_capa];

	RespostaGetTileWMTS_SOAP[RespostaGetTileWMTS_SOAP.length]=new CreaGetTileWMTS_SOAP(i_capa, i_tile_matrix, j, i);
	//Creo la petició de GetTile en SOAP
	cdns.push("<?xml version=\"1.0\"?>\n",
			  "<soap:Envelope xmlns:soap=\"http://www.w3.org/2001/12/soap-envelope\" ",
			  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ",
			  "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" ",
			  "xsi:schemaLocation=\"http://www.w3.org/2001/12/soap-envelope http://www.w3.org/2001/12/soap-envelope.xsd\">",
			  "<soap:Body>",
			  "<GetTile xmlns=\"http://www.opengis.net/wmts/", DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(capa.versio)),"\" ",
						"xmlns:ows=\"http://www.opengis.net/ows/1.1\" ",
						"xsi:schemaLocation=\"http://www.opengis.net/wmts/",DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(capa.versio)),
						" http://www.miramon.uab.cat/ogc/schemas/wmts/", 
						DonaVersioComAText(DonaVersioServidorCapa(capa.versio)), "/wmtsGetTile_request.xsd\" ", 
						"service=\"WMTS\" version=\"",DonaVersioComAText(DonaVersioServidorCapa(capa.versio)),"\">\n",
							"<Layer>",capa.nom, "</Layer>\n");						  
	cdns.push(			  "<Style>");
	if (capa.estil && capa.estil.length)
	{	
		if (estil==null)
		{
			if (capa.estil[capa.i_estil].nom)
				cdns.push(capa.estil[capa.i_estil].nom);
		}
		else
			cdns.push(estil);	
	}
	cdns.push(			  "</Style>\n");
	cdns.push(			  "<Format>", capa.FormatImatge,"</Format>\n");
	if (capa.AnimableMultiTime==true)
	{
		cdns.push(			"<DimensionNameValue name=\"TIME\">",
				  			DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)], capa.FlagsData),
								"</DimensionNameValue>\n");
	}
	cdns.push(			"<TileMatrixSet>",capa.TileMatrixSet[i_tile_matrix_set].nom,"</TileMatrixSet>\n",
						"<TileMatrix>",capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier,"</TileMatrix>\n",
						"<TileRow>",j,"</TileRow>\n",
						"<TileCol>",i,"</TileCol>\n",
					"</GetTile>\n");
	//ServerToRequest
	if (location.host && DonaHost(DonaServidorCapa(capa.servidor)).toLowerCase()!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
	{
		var s_host=DonaHost(ParamCtrl.ServidorLocal);
		var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
		if (s_host.toLowerCase()!=location.host.toLowerCase())
			servidor_temp=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal.substring(0,pos_host)+
							location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length));
		else
			servidor_temp=ParamCtrl.ServidorLocal;
		cdns.push(		"<ServerToRequest>",DonaNomServidorSenseCaracterFinal(DonaServidorCapa(capa.servidor)),"</ServerToRequest>\n");
	}
	else
		servidor_temp=DonaNomServidorSenseCaracterFinal(DonaServidorCapa(capa.servidor));
	
	cdns.push(			"</soap:Body>\n",
				"</soap:Envelope>\n");	
	s=cdns.join("");
	CreaIOmpleEventConsola("WMTS-SOAP, tiled", i_capa, servidor_temp+"\n\n"+s, TipusEventWMTSTileSOAP);
	ajaxGetTileWMTS_SOAP[ajaxGetTileWMTS_SOAP.length]=new Ajax();
	ajaxGetTileWMTS_SOAP[ajaxGetTileWMTS_SOAP.length-1].doPost(servidor_temp, 
							"text/xml", s, 
							AvaluaRespostaGetTileWMTS_SOAP, "text/xml", 
							RespostaGetTileWMTS_SOAP[RespostaGetTileWMTS_SOAP.length-1]);
}//Fi de FesPeticioAjaxGetTileWMTS_SOAP()

function DonaRequestGetMapTiled(i_capa, i_estil, pot_semitrans, ncol, nfil, i_tile_matrix_set, i_tile_matrix, j, i, i_data)
{
	var env_tile={"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0};
	var tile_matrix=ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix];

	env_tile.MinX=tile_matrix.TopLeftPoint.x+tile_matrix.costat*tile_matrix.TileWidth*i;
	env_tile.MaxX=env_tile.MinX+tile_matrix.costat*tile_matrix.TileWidth;
	env_tile.MaxY=tile_matrix.TopLeftPoint.y-tile_matrix.costat*tile_matrix.TileHeight*j;
	env_tile.MinY=env_tile.MaxY-tile_matrix.costat*tile_matrix.TileHeight;
	var s=DonaRequestGetMap(i_capa, i_estil, pot_semitrans, ncol, nfil, env_tile, i_data);
	//CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
	return s;
}

//Inspired on code from http://msdn.microsoft.com/en-us/library/bb259689.aspx
function TileXYToQuadKey(tileX, tileY, levelOfDetail)
{
var cdns= [];
var digit, mask;
    for (var i = levelOfDetail; i > 0; i--)
    {
        digit = 0;
        mask = 1 << (i - 1);
        if ((tileX & mask) != 0)
        {
            digit++;
        }
        if ((tileY & mask) != 0)
        {
            digit++;
            digit++;
        }
        cdns.push(digit);
    }
    return cdns.join("");
}

function DonaNomImatgeTiled(i_capa, i_tile_matrix_set, i_tile_matrix, j, i, i_estil, pot_semitrans, i_data)
{
var cdns=[], url_template, i_estil2, capa=ParamCtrl.capa[i_capa];

	if (DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_REST")
	{
		//{WMTSBaseURL}/{layer}/{style}/{firstDimension}/{...}/{lastDimension}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{format_extension}	
	if (capa.TileMatrixSet[i_tile_matrix_set].URLTemplate)
			var s=capa.TileMatrixSet[i_tile_matrix_set].URLTemplate+"";
		else
			var s="{WMTSBaseURL}/{layer}/{style}/{time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{format_extension}";

		s=s.replace("{WMTSBaseURL}", DonaServidorCapa(capa.servidor));
		s=s.replace("{layer}", capa.nom);
		if (capa.estil && capa.estil.length)
		{
			if (i_estil==-1)
				i_estil2=capa.i_estil;
			else
				i_estil2=i_estil;
			if (capa.estil[i_estil2].nom)
	 			s=s.replace("{style}", capa.estil[i_estil2].nom);
			else
				s=s.replace("{style}/", "");	
		}
		else
			s=s.replace("{style}/", "");	


		if (capa.AnimableMultiTime==true)
			s=s.replace("{time}", DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)], capa.FlagsData));
		else
			s=s.replace("{time}/", ""); 
		

		s=s.replace("{TileMatrixSet}", capa.TileMatrixSet[i_tile_matrix_set].nom);
		s=s.replace("{TileMatrix}", capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier);
		s=s.replace("{TileRow}", j);
		s=s.replace("{TileCol}", i);
		s=s.replace("{TileQuadTree}", TileXYToQuadKey(i, j, i_tile_matrix));
		if (capa.FormatImatge)
		{
			if(capa.FormatImatge.charAt(0)==".")  
				s=s.replace(".{format_extension}", capa.FormatImatge);
			else		
				s=s.replace("{format_extension}", capa.FormatImatge);
		}
		/*
		cdns.push(DonaServidorCapa(capa.servidor), (DonaServidorCapa(capa.servidor).charAt(DonaServidorCapa(capa.servidor).length-1)=="/") ? "": "/", capa.nom, "/");

		if (capa.estil && capa.estil.length)
		{
			if (i_estil==-1)
				i_estil2=capa.i_estil;
			else
				i_estil2=i_estil;
			if (capa.estil[i_estil2].nom)
	 			cdns.push(capa.estil[i_estil2].nom, "/");
			else
 				cdns.push(estil, "/");
		}
		else
			cdns.push("default/");
	
		if (capa.AnimableMultiTime==true)
			cdns.push(DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)], capa.FlagsData) , "/");

		cdns.push(capa.TileMatrixSet[i_tile_matrix_set].nom, "/", capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier, "/", j, "/", i, (capa.FormatImatge.charAt(0)==".") ? "" : ".", capa.FormatImatge);

		var s=cdns.join("");*/
		//CreaIOmpleEventConsola("WMTS-REST, tiled", i_capa, s, TipusEventWMTSTile);
		return s;
	}
	else if (DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_KVP")
	{
		//Encara per revisar pq WMTS va diferent que el WMS.
		cdns.push("SERVICE=WMTS&VERSION=", DonaVersioComAText(DonaVersioServidorCapa(capa.versio)), "&REQUEST=GetTile&TileMatrixSet=" , 
			capa.TileMatrixSet[i_tile_matrix_set].nom ,
			 "&TileMatrix=" , capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier , "&TileRow=" , j , "&TileCol=" , i ,
			 "&LAYER=" , capa.nom , "&FORMAT=" , capa.FormatImatge ,
			 "&STYLE=");

		if (capa.estil && capa.estil.length)
		{
			if (i_estil==-1)
				i_estil2=capa.i_estil;
			else
				i_estil2=i_estil;
			if (capa.estil[i_estil2].nom)
	 			cdns.push(capa.estil[i_estil2].nom);
		}
		if (capa.AnimableMultiTime==true)
			cdns.push("&TIME=",
				(DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)], capa.FlagsData)));
		var s=AfegeixNomServidorARequest(DonaServidorCapa(capa.servidor), cdns.join(""), ParamCtrl.UsaSempreMeuServidor==true ? true : false);
		//CreaIOmpleEventConsola("WMTS-KVP, tiled", i_capa, s, TipusEventWMTSTile);
		return s;
	}
	/*if (DonaTipusServidorCapa(capa.tipus)=="TipusGoogle_KVP")
	{
		//http://khm.google.com/maptilecompress/hl=en&s=Gal&t=3&q=25&x=0&y=0&z=0
		//{WMTSBaseURL}&t={layer}&q={quality_style}&z={TileMatrix}&y={TileRow}&x={TileCol}
		
		cdns.push(DonaServidorCapa(capa.servidor), (DonaServidorCapa(capa.servidor).charAt(DonaServidorCapa(capa.servidor).length-1)=="&") ? "": "&", "t=", capa.nom, "&");

		if (capa.estil && capa.estil.length)
		{
			if (i_estil==-1)
				i_estil2=capa.i_estil;
			else
				i_estil2=i_estil;
			if (capa.estil[i_estil2].nom)
	 			cdns.push("q=", capa.estil[i_estil2].nom, "&");
		}
		cdns.push("z=", capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier, "&y=", j, "&x=", i);
		var s=cdns.join("");
		//CreaIOmpleEventConsola("Google-KVP, tiled", i_capa, s, TipusEventWMTSTile);
		return s;
	}*/
	else //wms-c
	{
		var tile_matrix=capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix];
		return DonaRequestGetMapTiled(i_capa, i_estil, pot_semitrans, tile_matrix.TileWidth, tile_matrix.TileHeight, i_tile_matrix_set, i_tile_matrix, j, i, i_data);
	}
}

var ajaxGetCapabilities_POST=[];
var RespostaGetCapabilities_POST=[];

function CreaRespostaGetCapabilities_POST(servidor)
{
	this.text="";
	this.servidor=servidor;
}

function AvaluaRespostaGetCapabilitiesPost(doc, dades_request)
{
	if(dades_request && dades_request.text)
	{
		var FinestraGetCapaPost;
		FinestraGetCapaPost=window.open();
		FinestraGetCapaPost.document.open();
//		FinestraGetCapaPost.document.open('content-type: text/xml');
//		FinestraGetCapaPost.document.open('text/xml');		
		FinestraGetCapaPost.document.write("<title>"+dades_request.servidor+"<title>");
		FinestraGetCapaPost.document.write("<xmp>"+dades_request.text+"</xmp>");
		FinestraGetCapaPost.document.close();		
	}
	return;
}

function DonaGetCapabilitesSOAP(servidor, versio, tipus)
{
var cdns=[];

	cdns.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
			  "<soap:Envelope xmlns:soap=\"http://www.w3.org/2001/12/soap-envelope\">",
			  "<soap:Body>",
			  "<GetCapabilities service=\"");
	if(tipus=="TipusWMTS_SOAP")
		cdns.push("WMTS");		
	cdns.push("\" xmlns=\"http://www.opengis.net/ows/1.1\">",
			  "<AcceptVersions>",
			  "<Version>",versio,"</Version>",
			  "</AcceptVersions>",
			  "<AcceptFormats>",
			  "<OutputFormat>text/xml</OutputFormat>",
			  "</AcceptFormats>",
			  "</GetCapabilities>");
	if(servidor!=null)
		cdns.push("<ServerToRequest>", servidor, "</ServerToRequest>");			  
	cdns.push("</soap:Body>",
			  "</soap:Envelope>");
	return cdns.join("");
}

function FesPeticioCapacitatsPost(servidor, versio, tipus)
{
var servidor_temp;

	ajaxGetCapabilities_POST[ajaxGetCapabilities_POST.length]=new Ajax();
	RespostaGetCapabilities_POST[RespostaGetCapabilities_POST.length]=new CreaRespostaGetCapabilities_POST(servidor);
	
	if (location.host && DonaHost(servidor).toLowerCase()!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
	{
		var s_host=DonaHost(ParamCtrl.ServidorLocal);
		var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
		if (s_host.toLowerCase()!=location.host.toLowerCase())
			servidor_temp=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal.substring(0,pos_host)+
							location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length));
		else
			servidor_temp=ParamCtrl.ServidorLocal;
	}
	else
		servidor_temp=null;

	ajaxGetCapabilities_POST[ajaxGetCapabilities_POST.length-1].doPost((servidor_temp ? servidor_temp : servidor), "text/xml", 
																	DonaGetCapabilitesSOAP((servidor_temp ? servidor: null), versio, tipus), 															
																	AvaluaRespostaGetCapabilitiesPost, "text/xml", 
																	RespostaGetCapabilities_POST[RespostaGetCapabilities_POST.length-1]);
}

function DonaRequestServiceMetadata(servidor, versio, tipus)
{
	if (tipus=="TipusWMS" || tipus=="TipusWMS_C")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION="+versio+ "&SERVICE=WMS", ParamCtrl.UsaSempreMeuServidor==true ? true : false);
	if (tipus=="TipusWMTS_KVP")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION=1.0.0&SERVICE=WMTS", ParamCtrl.UsaSempreMeuServidor==true ? true : false);
	if (tipus=="TipusWMTS_REST")
		return servidor + ((servidor.charAt(servidor.length-1)=="/") ? "": "/") + "1.0.0/WMTSCapabilities.xml";
	if (tipus=="TipusWFS")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION="+versio+ "&SERVICE=WFS", ParamCtrl.UsaSempreMeuServidor==true ? true : false);
	if (tipus=="TipusSOS")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION="+versio+ "&SERVICE=SOS", ParamCtrl.UsaSempreMeuServidor==true ? true : false);
	return "";
}


function CalGirarCoordenades(crs, v)
{
	if(crs.toUpperCase()=="EPSG:4326" && (!v || (v.Vers==1 && v.SubVers>=3) || v.Vers>1))
		return true;
	return false;
}

function AfegeixPartCridaComunaGetMapiGetFeatureInfo(i, i_estil, pot_semitrans, ncol, nfil, env, i_data)
{
var cdns=[];

	if (DonaVersioServidorCapa(ParamCtrl.capa[i].versio).Vers<1 || (DonaVersioServidorCapa(ParamCtrl.capa[i].versio).Vers==1 && DonaVersioServidorCapa(ParamCtrl.capa[i].versio).SubVers<2))
    	cdns.push("SRS=");
    else
        cdns.push("CRS=");	
	cdns.push(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, "&BBOX=");
	
	if(CalGirarCoordenades(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, DonaVersioServidorCapa(ParamCtrl.capa[i].versio)))
       	cdns.push(env.MinY , "," , env.MinX , "," , env.MaxY , "," , env.MaxX);
    else
        cdns.push(env.MinX , "," , env.MinY , "," , env.MaxX , "," , env.MaxY);

	cdns.push("&WIDTH=" , ncol , "&HEIGHT=" , nfil ,
		 "&LAYERS=" , ParamCtrl.capa[i].nom , "&FORMAT=" , ParamCtrl.capa[i].FormatImatge ,
		  ((ParamCtrl.capa[i].FormatImatge=="image/jpeg") ? "" : "&TRANSPARENT=" + ((ParamCtrl.capa[i].transparencia && ParamCtrl.capa[i].transparencia!="opac")? "TRUE" : "FALSE")),
		 "&STYLES=");

	if (ParamCtrl.capa[i].estil && ParamCtrl.capa[i].estil.length)
	{
		var i_estil2=(i_estil==-1) ? ParamCtrl.capa[i].i_estil : i_estil;

		if (ParamCtrl.capa[i].estil[i_estil2].nom)
		{
 			cdns.push(ParamCtrl.capa[i].estil[i_estil2].nom);
			if (pot_semitrans && ParamCtrl.capa[i].FormatImatge!="image/jpeg" && ParamCtrl.capa[i].visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor==true)
				cdns.push(":SEMITRANSPARENT");
		}
		else if (pot_semitrans && ParamCtrl.capa[i].FormatImatge!="image/jpeg" && ParamCtrl.capa[i].visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor==true)
			cdns.push("SEMITRANSPARENT");
	}
	else if (pot_semitrans && ParamCtrl.capa[i].FormatImatge!="image/jpeg" && ParamCtrl.capa[i].visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor==true)
			cdns.push("SEMITRANSPARENT");
	if (ParamCtrl.capa[i].AnimableMultiTime==true)
		cdns.push("&TIME=",
			(DonaDataJSONComATextISO8601(ParamCtrl.capa[i].data[DonaIndexDataCapa(ParamCtrl.capa[i], i_data)],ParamCtrl.capa[i].FlagsData)));
		
	return cdns.join("");
}

//i_estil és un index d'estil o -1 si ha de ser l'estil indicat a la capa
//i_data és un número (positiu o negatiu o null si ha de ser la dada indicada a la capa.
function DonaRequestGetMap(i, i_estil, pot_semitrans, ncol, nfil, env, i_data)
{
var cdns=[];
	
	if (DonaVersioServidorCapa(ParamCtrl.capa[i].versio).Vers<1 || (DonaVersioServidorCapa(ParamCtrl.capa[i].versio).Vers==1 && DonaVersioServidorCapa(ParamCtrl.capa[i].versio).SubVers==0))
	    cdns.push("WMTVER=");
    else
		cdns.push("SERVICE=WMS&VERSION="); 
	cdns.push(DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i].versio)), "&REQUEST=");
	
    if (DonaVersioServidorCapa(ParamCtrl.capa[i].versio).Vers<1 || (DonaVersioServidorCapa(ParamCtrl.capa[i].versio).Vers==1 && DonaVersioServidorCapa(ParamCtrl.capa[i].versio).SubVers==0))
    	cdns.push("map&");
    else
    	cdns.push("GetMap&");
		
	cdns.push(AfegeixPartCridaComunaGetMapiGetFeatureInfo(i, i_estil, pot_semitrans, ncol, nfil, env, i_data));	
	
	var s=AfegeixNomServidorARequest(DonaServidorCapa(ParamCtrl.capa[i].servidor), cdns.join(""), ParamCtrl.UsaSempreMeuServidor==true ? true : false);
	//CreaIOmpleEventConsola("GetMap", i, s, TipusEventGetMap);
	return s;
}



function EsborraSeleccio()
{
	for (var i=0; i<ParamCtrl.capa.length; i++)
	{
		var capa=ParamCtrl.capa[i];
		if (capa.model==model_vector)
		{
			if(capa.objectes && capa.objectes.features && capa.objectes.features.length>0)
			{
				for (var j=0;j<capa.objectes.features.length; j++)
					capa.objectes.features[j].seleccionat=false;
			}
		}			
	}
	EnvSelec=null;	
}//Fi de EsborraSeleccio()

function PortamASeleccio()
{	
	if(EnvSelec)
		PortamAAmbit(EnvSelec);
}//Fi de PortamASeleccio()


function OmpleVistaCapa(nom_vista, vista, i)
{
	if (DonaTipusServidorCapa(ParamCtrl.capa[i].tipus)=="TipusWMS")
	{
		//var image=eval("this.document." + nom_vista + "_i_raster"+i);  //Això no funciona pel canvas.
		var win=DonaWindowDesDeINovaVista(vista);
		var image=win.document.getElementById(nom_vista + "_i_raster"+i);
		CanviaImatgeCapa(image, vista, i, -1, null, null, null);
	}
	else
		CreaMatriuCapaTiled(nom_vista, vista, i);
}

//Aquesta funció està en desús i només es fa servir pel video. Useu DonaRequestGetMap() directament. 'estil' és el nom de l'estil o null per fer servir l'estiu predeterminat a l'estructura.
function DonaNomImatge(i_capa, vista, estil, pot_semitrans, i_data)
{
var i_estil, capa=ParamCtrl.capa[i_capa];

	if (capa.estil && capa.estil.length)
	{
		for (i_estil=0; i_estil<capa.estil.length; i_estil++)
		{
			if (capa.estil[i_estil].nom==estil)
				break;
		}
		if (i_estil==capa.estil.length)
			i_estil=-1;
	}
	else
		i_estil=-1;

	var s=DonaRequestGetMap(i_capa, i_estil, pot_semitrans, vista.ncol, vista.nfil, vista.EnvActual, i_data);
	CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
	return s;
}

function DonaFactorAEstiramentPaleta(estiramentPaleta, n_colors)
{
	if (!estiramentPaleta || estiramentPaleta.valorMaxim==estiramentPaleta.valorMinim)
		return 1;
	return n_colors/(estiramentPaleta.valorMaxim-estiramentPaleta.valorMinim);
}

function DonaFactorValorMinEstiramentPaleta(estiramentPaleta)
{
	return (estiramentPaleta && estiramentPaleta.valorMinim) ? estiramentPaleta.valorMinim : 0;
}

function DonaFactorValorMaxEstiramentPaleta(estiramentPaleta, n_colors)
{
	return (estiramentPaleta) ? estiramentPaleta.valorMaxim : n_colors-1;
}


function CreaItemLlegDePaletaSiCal(i_capa, i_estil)
{
var capa=ParamCtrl.capa[i_capa];
var estil=capa.estil[i_estil];
var a, value, valor_min, valor_max, i_color, value_text, ncolors, colors, ample, desc;

	if (estil.ItemLleg && estil.ItemLleg.length>0)
		return;  //No cal fer-la: ja està feta.

	colors=(estil.paleta && estil.paleta.colors) ? estil.paleta.colors : null;
	ncolors=colors ? colors.length : 256;

	if (estil.categories && estil.atributs)
	{
		//La llegenda es pot generar a partir de la llista de categories i la paleta.

		estil.ItemLleg=[];
		ncolors=(estil.categories.length>ncolors) ? ncolors : estil.categories.length;
		
		for (var i=0, i_color=0; i_color<ncolors; i_color++)
		{
			if (!estil.categories[i_color])
				continue;
			desc=DonaTextCategoriaDesDeColor(estil, i_color);
			if (desc=="")
				continue;
			estil.ItemLleg[i]={"color": (colors) ? colors[i_color] : RGB(i_color,i_color,i_color), "DescColor": desc};
			i++;
		}	
		return;
	}

	if (!estil.component || estil.component.length==0)
		return;

	//La llegenda es pot generar a partir d'estirar la paleta.
	a=DonaFactorAEstiramentPaleta(estil.component[0].estiramentPaleta, ncolors);
	valor_min=DonaFactorValorMinEstiramentPaleta(estil.component[0].estiramentPaleta);
	valor_max=DonaFactorValorMaxEstiramentPaleta(estil.component[0].estiramentPaleta, ncolors);

	if (!estil.nItemLlegAuto || estil.nItemLlegAuto==0)
		return;

	ample=(valor_max-valor_min)/estil.nItemLlegAuto;
	if (!estil.ColorMinimPrimer || estil.ColorMinimPrimer==false)
		ample=-ample;

	estil.ItemLleg=[];
	for (var i=0, value=(estil.ColorMinimPrimer ? ample/2+valor_min : valor_max+ample/2); i<estil.nItemLlegAuto; i++, value+=ample)
	{
		i_color=Math.floor(a*(value-valor_min));
		if (i_color>=ncolors)	
			i_color=ncolors-1;
		else if (i_color<0)
			i_color=0;
		if (estil.descColorMultiplesDe)
			value_text=multipleOf(value, estil.descColorMultiplesDe) 
		else
			value_text=value;
		estil.ItemLleg[i]={"color": (colors) ? colors[i_color] : RGB(i_color,i_color,i_color), "DescColor": (estil.component[0].NDecimals!=null ? OKStrOfNe(parseFloat(value_text), estil.component[0].NDecimals): value_text)};
	}
}


function DonaDescripcioValorMostrarCapa(i_capa, una_linia)
{
var capa=ParamCtrl.capa[i_capa];
	if (una_linia)
		return (capa.DescLlegenda ? DonaCadena(capa.DescLlegenda) : 
				((capa.desc) ? DonaCadena(capa.desc) : capa.nom)) + 
			((capa.estil.length>1 && capa.estil[capa.i_estil].desc) ? " - " + DonaCadena(capa.estil[capa.i_estil].desc) : "") +
			(capa.estil[capa.i_estil].DescItems ? " (" + DonaCadena(capa.estil[capa.i_estil].DescItems) +")" : "");
	
	return capa.estil[capa.i_estil].desc ? 
			DonaCadena(capa.estil[capa.i_estil].desc) : 
			(
				(capa.desc) ? DonaCadena(capa.desc) : capa.nom
			);
}

//Aquesta funció assumeix que hi ha estil.categories i estil.atributs. Si alguna descripció era undefined, retorna una cadean buida.
function DonaTextCategoriaDesDeColor(estil, i_color)
{
	if (estil.atributs.length==1)
		return estil.categories[i_color][estil.atributs[0].nom];

	var value_text="[";
	for (var i_a=0; i_a<estil.atributs.length; i_a++)
	{
		if (!estil.categories[i_color][estil.atributs[i_a].nom])
			return "";
		value_text+=(estil.atributs[i_a].desc ? DonaCadena(estil.atributs[i_a].desc) : estil.atributs[i_a].nom) + ": " + estil.categories[i_color][estil.atributs[i_a].nom]; 
		if (i_a+1<estil.atributs.length)
			value_text+="; "
	}
	value_text+="]";
	return value_text;
}

function onLoadCanviaImatge(event)
{
	CanviaEstatEventConsola(event, this.i_event, EstarEventTotBe);
	if (this.nom_funcio_ok)
	{
		if (this.funcio_ok_param!=null)
			this.nom_funcio_ok(this.funcio_ok_param);
		else
			this.nom_funcio_ok();
	}
}

function onErrorCanviaImatge(event)
{
	CanviaEstatEventConsola(event, this.i_event, EstarEventError);
	this.onload=null;
	this.src="1tran.gif";
}


function CanviaImatgeCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param)
{
	if (ParamCtrl.capa[i_capa].FormatImatge=="application/x-img")
		CanviaImatgeBinariaCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param);
	else
	{
		var url_dades=DonaRequestGetMap(i_capa, i_estil, true, vista.ncol, vista.nfil, vista.EnvActual, i_data);
		imatge.i_event=CreaIOmpleEventConsola("GetMap", i_capa, url_dades, TipusEventGetMap);
		if (nom_funcio_ok)
			imatge.nom_funcio_ok=nom_funcio_ok;
		if (typeof funcio_ok_param!=="undefined" && funcio_ok_param!=null)
			imatge.funcio_ok_param=funcio_ok_param;		
		imatge.onerror=onErrorCanviaImatge;
		imatge.onload=onLoadCanviaImatge;
		imatge.src=url_dades;
	}
}

/* No puc fer servir aquestas funció donat que els PNG's progressius no es tornen a mostrar només fent un showLayer. Els torno a demanar sempre.
function CanviaImatgeCapaSiCal(imatge, i_capa)
{
	//Aquí no faig servir DonaCadenaLang() expressament. Si es canvia l'idioma mentre es mostre un "espereu.gif", aquest no és canviat pel nou idioma. De fet, això es podria fer durant el canvi d'idioma però és un detall massa insignificant.
	if ((ParamCtrl.capa[i_capa].transparencia && ParamCtrl.capa[i_capa].transparencia=="semitransparent") ||
		imatge.src.indexOf("espereu.gif")!=-1 || imatge.src.indexOf("espereu_spa.gif")!=-1 || imatge.src.indexOf("espereu_eng.gif")!=-1|| imatge.src.indexOf("espereu_fre.gif")!=-1)
	{
	    for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
	}
}*/

function CanviaEstatVisibleCapa(icon_capa, i)
{
var i_vista, capa=ParamCtrl.capa[i];
var nom_icona=TreuAdreca(icon_capa.src);

	if (nom_icona=="ara_no_visible.gif" ||
	    nom_icona=="ara_no_radio.gif")
	{
		//pas a visible
		if (capa.grup)
		{
			for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
			{
			    if (i_capa==i)
				    continue;
				if (capa.grup==ParamCtrl.capa[i_capa].grup && 
				    EsCapaVisibleAAquestNivellDeZoom(i_capa))
				{
				   if (!(ParamCtrl.LlegendaGrupsComARadials && ParamCtrl.LlegendaGrupsComARadials==true))
				   {
					   if (!confirm(DonaCadenaLang({"cat":"No és possible mostrar dues capes del mateix grup.\nLa capa \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", que també format part del grup \"" + ParamCtrl.capa[i_capa].grup + "\", serà desmarcada.",
													"spa":"No es posible mostrar dos capas del mismo grupo.\nLa capa \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", que también forma parte del grupo \"" + ParamCtrl.capa[i_capa].grup + "\", será desmarcada.",
													"eng":"It is not possible to show two layers from the same group.\nLayer \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", that also is member to the group \"" + ParamCtrl.capa[i_capa].grup + "\", will be deselected.", 
													"fre":"Impossible de montrer deux couches du même groupe..\nLa couche \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", appartenant aussi au groupe \"" + ParamCtrl.capa [i_capa].grup + "\", va être désélectionnée."})))
						   return;
				   }
				   if (ParamCtrl.capa[i_capa].transparencia && ParamCtrl.capa[i_capa].transparencia=="semitransparent")
				   {
						CanviaEstatVisibleISiCalDescarregableCapa(i_capa, "semitransparent");//Així forço que passi a no visible
				       	if (ParamCtrl.LlegendaGrupsComARadials==true)
						{
							//eval("window.document.v_raster"+i_capa+".src=\""+ AfegeixAdrecaBaseSRC("semi_radio.gif")+"\"");
							window.document["v_raster"+i_capa].src=AfegeixAdrecaBaseSRC("semi_radio.gif");
						}
				   }
				   //eval("CanviaEstatVisibleCapa(window.document.v_raster"+i_capa+","+i_capa+")");
				   CanviaEstatVisibleCapa(window.document["v_raster"+i_capa],i_capa);
				   break;
				}
			}
		}
		CanviaEstatVisibleISiCalDescarregableCapa(i,"si");
		if (EsCapaVisibleAAquestNivellDeZoom(i))
		{
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				if (EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i);
					showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
				}
			}
		}
		if (capa.grup && ParamCtrl.LlegendaGrupsComARadials==true)
		    icon_capa.src=AfegeixAdrecaBaseSRC("radio.gif");
		else
		    icon_capa.src=AfegeixAdrecaBaseSRC("visible.gif");
		if (icon_capa.alt)
			icon_capa.alt="visible"; //no cal DonaCadenaLang();
	}	
	else if (nom_icona=="semitransparent.gif" || 
		 nom_icona=="semi_radio.gif"||
	         (capa.transparencia && capa.transparencia!="semitransparent"))
	{	
		//pas a no visible
		CanviaEstatVisibleISiCalDescarregableCapa(i, "ara_no");
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			if (ParamCtrl.TransparenciaDesDeServidor!=true)
				opacLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
		}
		if (capa.grup && ParamCtrl.LlegendaGrupsComARadials==true)
		    icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_radio.gif");
		else
		    icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_visible.gif");
		if (icon_capa.alt)
			icon_capa.alt="no visible";  //no cal DonaCadenaLang();
	}	
	else
	{
		//pas a semitransparent
		CanviaEstatVisibleISiCalDescarregableCapa(i,"semitransparent");
		if (EsCapaVisibleAAquestNivellDeZoom(i))
		{
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				if (EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
					if (ParamCtrl.TransparenciaDesDeServidor!=true)
						semitransparentLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
					else
						OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i);
				}
			}
		}
	    if (capa.grup && ParamCtrl.LlegendaGrupsComARadials==true)
		    icon_capa.src=AfegeixAdrecaBaseSRC("semi_radio.gif");
		else
 		    icon_capa.src=AfegeixAdrecaBaseSRC("semitransparent.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"semitransparent", "spa":"semitransparente", "eng":"semitransparent", "fre":"semi transparent"});
	}
}

function CanviaEstatConsultableCapa(icon_capa, i)
{
	if (TreuAdreca(icon_capa.src)=="ara_no_consultable.gif")
	{
		ParamCtrl.capa[i].consultable="si";
		icon_capa.src=AfegeixAdrecaBaseSRC("consultable.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"});
	}
	else 
	{
		ParamCtrl.capa[i].consultable="ara_no";
		icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_consultable.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"});
	}
}

function CanviaEstatDescarregableCapa(icon_capa, i)
{
var capa=ParamCtrl.capa[i];
	if (TreuAdreca(icon_capa.src)=="ara_no_descarregable.gif")
	{
	    if (capa.grup)
	    {
			for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
			{
				if (i_capa==i)
					continue;
				if (capa.grup==ParamCtrl.capa[i_capa].grup && ParamCtrl.capa[i_capa].descarregable=="si")
				{
				   if (!confirm(DonaCadenaLang({"cat":"No és possible descarregar dues capes del mateix grup.\nLa capa \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", que també format part del grup \"" + ParamCtrl.capa[i_capa].grup + "\", serà desmarcada.", 
												"spa":"No es posible descargar dos capas del mismo grupo.\nLa capa \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", que también forma parte del grupo \"" + ParamCtrl.capa[i_capa].grup + "\", será desmarcada.", 
												"eng":"It is not possible to download two layers from the same group.\nLayer \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", that also is member to the group \"" + ParamCtrl.capa[i_capa].grup + "\", will be deselected.", 
												"fre":"Impossible de télécharger deux couches du même groupe.\nLa couche \"" + DonaCadena(ParamCtrl.capa[i_capa].desc) + "\", appartenant aussi au groupe \"" + ParamCtrl.capa [i_capa].grup + "\", va être désélectionnée."})))
					   return;
				   //CanviaEstatDescarregableCapa(eval("window.document.z_raster"+i_capa), i_capa);
				   CanviaEstatDescarregableCapa(window.document["z_raster"+i_capa], i_capa);
				   break;
				}
			}
	    }
	    capa.descarregable="si";
	    icon_capa.src=AfegeixAdrecaBaseSRC("descarregable.gif");
	    if (icon_capa.alt)
		icon_capa.alt=DonaCadenaLang({"cat":"descarregable", "spa":"descargable", "eng":"downloadable","fre":"téléchargeable"});
	}
	else 
	{
	    capa.descarregable="ara_no";
	    icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_descarregable.gif");
	    if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"no descarregable", "spa":"no descargable", "eng":"no downloadable", "fre":"non téléchargeable"});
	}
}

function CanviaEstatLlegendaDesplegadaCapa(icon_capa, i)
{
	if (TreuAdreca(icon_capa.src)=="menys.gif")
		ParamCtrl.capa[i].LlegDesplegada=false;
	else 
		ParamCtrl.capa[i].LlegDesplegada=true;

	CreaLlegenda();
}

function CanviaEstatCapa(i, estat)
{
	if (estat=="visible")
	{
		//CanviaEstatVisibleCapa(eval("window.document.v_raster"+i), i);
		CanviaEstatVisibleCapa(window.document["v_raster"+i], i);
		if ((ParamCtrl.capa[i].estil && ParamCtrl.capa[i].estil.length>1) || 
			(ParamCtrl.capa[i].grup && ParamCtrl.LlegendaGrupsComARadials==true) ||
			ParamCtrl.capa[i].AnimableMultiTime==true)
			CreaLlegenda();
	}
	else if (estat=="consultable")
		//CanviaEstatConsultableCapa(eval("window.document.c_raster"+i),i);
		CanviaEstatConsultableCapa(window.document["c_raster"+i],i);
	else if (estat=="descarregable")
		//CanviaEstatDescarregableCapa(eval("window.document.z_raster"+i),i);
		CanviaEstatDescarregableCapa(window.document["z_raster"+i],i);
	else if (estat=="lleg_desplegada")
		//CanviaEstatLlegendaDesplegadaCapa(eval("window.document.m_raster"+i),i);
		CanviaEstatLlegendaDesplegadaCapa(window.document["m_raster"+i],i);
	else
		alert(DonaCadenaLang({"cat":"Estat no reconegut.", "spa":"Estado no reconocido.", "eng":"Unknown state.", "fre":"État non reconnu"}));
}

function CanviaEstatVisibleObjDigi(icon_capa, i)
{
var i_vista, capa=ParamCtrl.capa[i];
	if (TreuAdreca(icon_capa.src)=="ara_no_visible.gif")
	{		
		capa.visible="si";
		icon_capa.src=AfegeixAdrecaBaseSRC("visible.gif");
		//if (EsObjDigiVisibleAAquestNivellDeZoom(capa) && capa.objectes && capa.objectes.features)
		if (EsCapaVisibleAAquestNivellDeZoom(i) && capa.objectes && capa.objectes.features)
		{
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				if (EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					OmpleVistaCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i);
					showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
				}
			}
			/*
			for (var j=capa.objectes.features.length-1; j>=0; j--)
			{
				elem=getLayer(window, "l_obj_digi"+i+"_"+j);
				if(elem)
					showLayer(elem); 
			}*/
		}
		if (icon_capa.alt)
			icon_capa.alt="visible"; //no cal DonaCadenaLang();
	}
	else 
	{
		capa.visible="ara_no";
		icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_visible.gif");
		if(capa.objectes && capa.objectes.features)
		{
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			{
				if (EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i));
				}
			}
			/*for (var j=capa.objectes.features.length-1; j>=0; j--)
			{
				elem=getLayer(window, "l_obj_digi"+i+"_"+j);
				if(elem)
					hideLayer(elem); 
			}*/
			//	hideLayerIfIsLayer(window, "l_obj_digi"+i+"_"+j);
		}
		if (icon_capa.alt)
			icon_capa.alt="no visible"; //no cal DonaCadenaLang();
	}
}

function CanviaEstatConsultableObjDigi(icon_capa, i)
{
	if (TreuAdreca(icon_capa.src)=="ara_no_consultable.gif")
	{
		ParamCtrl.capa[i].consultable="si";
		icon_capa.src=AfegeixAdrecaBaseSRC("consultable.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"consultable", "spa":"consultable", "eng":"queryable", "fre":"consultable"});
	}
	else 
	{
		ParamCtrl.capa[i].consultable="ara_no";
		icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_consultable.gif");
		if (icon_capa.alt)
			icon_capa.alt=DonaCadenaLang({"cat":"no consultable", "spa":"no consultable", "eng":"no queryable", "fre":"non consultable"});
	}
}
function CanviaEstatLlegendaDesplegadaObjDigi(icon_capa, i)
{
	if (TreuAdreca(icon_capa.src)=="menys.gif")
		ParamCtrl.capa[i].LlegDesplegada=false;
	else 
		ParamCtrl.capa[i].LlegDesplegada=true;

	CreaLlegenda();
}

function CanviaEstatObjDigi(i, estat)
{
	if (estat=="visible")
	{
		//CanviaEstatVisibleObjDigi(eval("window.document.v_obj_digi"+i), i);
		CanviaEstatVisibleObjDigi(window.document["v_obj_digi"+i], i);
		if (ParamCtrl.capa[i].estil && ParamCtrl.capa[i].estil.length>1)
			CreaLlegenda();
	}

	else if (estat=="consultable")
		//CanviaEstatConsultableObjDigi(eval("window.document.c_obj_digi"+i), i);
		CanviaEstatConsultableObjDigi(window.document["c_obj_digi"+i], i);
	else if (estat=="lleg_desplegada")
		//CanviaEstatLlegendaDesplegadaObjDigi(eval("window.document.m_obj_digi"+i), i);
		CanviaEstatLlegendaDesplegadaObjDigi(window.document["m_obj_digi"+i], i);
	else
		alert(DonaCadenaLang({"cat":"Estat no reconegut.", "spa":"Estado no reconocido.", "eng":"Unknown state.", "fre":"État non reconnu"}));
}


function CanviaEstatLlegendaRadioEstil(icon_capa, marcat)
{
	if (marcat)
		icon_capa.src=AfegeixAdrecaBaseSRC("radio.gif");
	else
		icon_capa.src=AfegeixAdrecaBaseSRC("ara_no_radio.gif");	
}

function CanviaEstilCapa(i_capa, i_estil, repinta_si_mateix_estil)
{
var redibuixar_llegenda=false, capa=ParamCtrl.capa[i_capa];

	if (!repinta_si_mateix_estil && capa.i_estil==i_estil)
		return;
	
	if (capa.i_estil!=i_estil)
	{
		for (var i=0; i<capa.estil.length; i++)
		{
			if (i==i_estil)
				//CanviaEstatLlegendaRadioEstil(eval("window.document.e_raster_vector"+i_capa+"_"+i), true);
				CanviaEstatLlegendaRadioEstil(window.document["e_raster_vector"+i_capa+"_"+i], true);
			else
				//CanviaEstatLlegendaRadioEstil(eval("window.document.e_raster_vector"+i_capa+"_"+i), false);
				CanviaEstatLlegendaRadioEstil(window.document["e_raster_vector"+i_capa+"_"+i], false);
			if (!redibuixar_llegenda && capa.LlegDesplegada==true && capa.estil[i].ItemLleg && capa.estil[i].ItemLleg.length>1)
				redibuixar_llegenda=true;
		}
		capa.i_estil=i_estil;
	}
	else
		redibuixar_llegenda=false;

	if (capa.model==model_vector)
	{
		if(!redibuixar_llegenda && capa.visible!="no" && capa.visible!="ara_no" &&
			i_estil!=capa.i_estil && capa.LlegDesplegada==false && 
			((capa.estil[i_estil].ItemLleg && capa.estil[i_estil].ItemLleg.length<2) ||
			 (capa.estil[capa.i_estil].ItemLleg && capa.estil[capa.i_estil].ItemLleg.length<2)))
			redibuixar_llegenda=true;
		CarregaSimbolsEstilActualCapaDigi(capa);
		/* Abans s'assumia que un canvi d'estil era també un canvi de contingut. De moment, això no és pas així
		  i per això no cal fer això que hi ha aquí:
		capa.objectes=null;
		if (capa.tipus)
		{
			InicialitzaTilesSolicitatsCapaDigi(capa);
			DemanaTilesDeCapaDigitalitzadaSiCal(i_capa, ParamInternCtrl.vista.EnvActual);
		}
		else
			capa.TileMatrixGeometry.tiles_solicitats=null;*/
	}
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		if (EsCapaVisibleAAquestNivellDeZoom(i_capa) && EsCapaVisibleEnAquestaVista(i_vista, i_capa))
		{
			if (capa.model==model_vector)
				OmpleVistaCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
			else 
				OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
		}			
	}
    if (redibuixar_llegenda)
	    CreaLlegenda();
}

function PrecarregaValorsArrayBinaryAtributSiCal(i_atribut, funcio, param)
{
var capa_digi=ParamCtrl.capa[param.i_capa];
var atribut=capa_digi.atributs[i_atribut];

	if (atribut.calcul && !atribut.FormulaConsulta)
		atribut.FormulaConsulta=DonaFormulaConsultaDesDeCalcul(atribut.calcul, param.i_capa, i_atribut);
		
	if (atribut.FormulaConsulta)
	{
		// Aquí hem de pensar que passa si hi ha v[] però encara no estan carregats.
		// En aquest punt es demanes les capes v[] per fer servir més tard una consulta per localització
		if (!param["v_carregat_"+i_atribut] && HiHaValorsNecessarisCapaFormulaconsulta(capa_digi, atribut.FormulaConsulta))
		{
			param["v_carregat_"+i_atribut]=true;
			CanviaImatgeBinariaCapa(null, param.vista, param.i_capa, i_atribut, -1, funcio, param);
			return true;
		}
	}
	param["v_carregat_"+i_atribut]=true;
	return false;
}

var ErrorInRenderingIconsPresented=false;

function OmpleVistaCapaDigi(nom_vista, vista, i_capa_digi)
{
	OmpleVistaCapaDigiIndirect({nom_vista: nom_vista, vista: vista, i_capa: i_capa_digi, carregant_geo: false/*, v_carregat_*: false*/})
}

function OmpleVistaCapaDigiIndirect(param)
{
var nom_vista=param.nom_vista, vista=param.vista;
var capa_digi=ParamCtrl.capa[param.i_capa];
var env=vista.EnvActual;
	
	if(capa_digi.tipus)
	{
		if(DemanaTilesDeCapaDigitalitzadaSiCal(param.i_capa, env, OmpleVistaCapaDigiIndirect, param))
			return;
	}
	
	if (capa_digi.objectes && capa_digi.objectes.features)
	{
		var estil=capa_digi.estil[capa_digi.i_estil];
		var i_atri_sel, i_atri_interior;
		if (estil.simbols &&
			estil.simbols.NomCamp)
		{
			//Precàrrega de valors si hi ha referencies ràster.
			var i=DonaIAtributsDesDeNomAtribut(capa_digi, estil.simbols.NomCamp)
			if (i==-1)
			{
				alert(DonaCadenaLang({"cat": "Nom d'atribut incorrecte", 
							"spa": "Nom de atributo incorrecto", 
							"eng": "Wrong attribute name",
							"fre": "Nom d'attribut incorrect"}) + 
					" " +
					estil.simbols.NomCamp + " (estil.simbols.NomCamp) " +
					DonaCadenaLang({"cat": "per simbolitzar la capa", 
							"spa": "para simbolizar la capa", 
							"eng": "to symbolize the layer", 
							"fre": "por symboliser la couche"}) + " " +
					(capa_digi.desc ? capa_digi.desc : capa_digi.nom));
				return ;
			}
			if (PrecarregaValorsArrayBinaryAtributSiCal(i, OmpleVistaCapaDigiIndirect, param))
				return;
		}
		if (estil.NomCampSel)
		{
			//Precàrrega de valors de la selecció
			i_atri_sel=DonaIAtributsDesDeNomAtribut(capa_digi, estil.NomCampSel)
			if (i_atri_sel==-1)
			{
				alert(DonaCadenaLang({"cat": "Nom d'atribut incorrecte", 
							"spa": "Nom de atributo incorrecto", 
							"eng": "Wrong attribute name",
							"fre": "Nom d'attribut incorrect"}) + 
					" " +
					estil.NomCampSel + " (estil.NomCampSel) " +
					DonaCadenaLang({"cat": "per simbolitzar la capa", 
							"spa": "para simbolizar la capa", 
							"eng": "to symbolize the layer", 
							"fre": "por symboliser la couche"}) + " " +
					(capa_digi.desc ? capa_digi.desc : capa_digi.nom));
				return ;
			}
			if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_sel, OmpleVistaCapaDigiIndirect, param))
				return;
		}
		if (estil.interior &&
			estil.interior.NomCamp)
		{
			//Precàrrega de valors si hi ha referencies ràster.
			i_atri_interior=DonaIAtributsDesDeNomAtribut(capa_digi, estil.interior.NomCamp)
			if (i_atri_interior==-1)
			{
				alert(DonaCadenaLang({"cat": "Nom d'atribut incorrecte", 
							"spa": "Nom de atributo incorrecto", 
							"eng": "Wrong attribute name",
							"fre": "Nom d'attribut incorrect"}) + 
					" " +
					estil.interior.NomCamp + " (estil.interior.NomCamp) " +
					DonaCadenaLang({"cat": "per simbolitzar la capa", 
							"spa": "para simbolizar la capa", 
							"eng": "to symbolize the layer", 
							"fre": "por symboliser la couche"}) + " " +
					(capa_digi.desc ? capa_digi.desc : capa_digi.nom));
				return ;
			}
			if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_interior, OmpleVistaCapaDigiIndirect, param))
				return;
		}
		if ( (estil.simbols && estil.simbols.NomCamp) || estil.NomCampSel || 
			(estil.interior && estil.interior.NomCamp) )
		{
			if (DescarregaPropietatsCapaDigiVistaSiCal(OmpleVistaCapaDigiIndirect, param))
				return;  //ja es tornarà a cridar a si mateixa quan la crida assincrona acabi
		}
		var fillStylePrevi, a_interior=1, valor_min_interior=0, i_color, ncolors, valor;
		var shadowBlurPrevi, shadowOffsetXPrevi, shadowOffsetYPrevi, shadowColorPrevi;
		var nom_canvas=DonaNomCanvasCapaDigi(nom_vista, param.i_capa);
		var env_icona, punt={}, i_col, i_fil;
		var icona, font, i_simbol;
		var win = DonaWindowDesDeINovaVista(vista);
		var canvas = win.document.getElementById(nom_canvas);
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (estil.interior && estil.interior.paleta)
		{
			ncolors=estil.interior.paleta.colors.length
			a_interior=DonaFactorAEstiramentPaleta(estil.interior.estiramentPaleta, ncolors);
			valor_min_interior=DonaFactorValorMinEstiramentPaleta(estil.interior.estiramentPaleta);
		}

		for (var j=capa_digi.objectes.features.length-1; j>=0; j--)
		{				
			DonaCoordenadaPuntCRSActual(punt, capa_digi.objectes.features[j], capa_digi.CRSgeometry);
			i_col=Math.round((punt.x-env.MinX)/(env.MaxX-env.MinX)*vista.ncol);
			i_fil=Math.round((env.MaxY-punt.y)/(env.MaxY-env.MinY)*vista.nfil);
			if (estil.simbols && estil.simbols.simbol)
			{
				var simbol=estil.simbols.simbol;
				if (simbol.length==1) 
					i_simbol=0;
				else if (i_col>=0 && i_col<vista.ncol && i_fil>=0 && i_fil<vista.nfil)
					i_simbol=DeterminaISimbolObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_col, i_fil);
				else
					i_simbol=-1;

				if (i_simbol!=-1)
				{								
					if (vista.i_nova_vista!=-2 && capa_digi.objectes.features[j].seleccionat==true && simbol[i_simbol].IconaSel)  //Sistema que feiem servir per l'edició
						icona=simbol[i_simbol].IconaSel;
					else if(estil.NomCampSel)
					{
						if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_atri_sel, i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
							icona=(simbol[i_simbol].IconaSel ?simbol[i_simbol].IconaSel: simbol[i_simbol].icona);
						else 
							icona=(simbol[i_simbol].IconaSel ?simbol[i_simbol].icona: null);						
					}
					else
						icona=simbol[i_simbol].icona;					

					if(icona)
					{
						env_icona=DonaEnvIcona(punt, icona);
						if (env.MinX < env_icona.MinX &&
							env.MaxX > env_icona.MaxX &&
							env.MinY < env_icona.MinY &&
							env.MaxY > env_icona.MaxY)
						{
							//la layer l_obj_digi té les coordenades referides a la seva layer pare que és l_capa_digi --> No he de considerar ni els marges de la vista ni els scrolls.
							//la manera de fer això està extreta de: http://stackoverflow.com/questions/6011378/how-to-add-image-to-canvas
	
							if (Array.isArray(icona))
							{
								alert("OmpleVistaCapaDigiIndirect() does not implement arrays of shapes yet");
							}
							else if (icona.type=="circle")
							{
								if (estil.interior && estil.interior.paleta)
								{
									fillStylePrevi=ctx.fillStyle;
									valor=DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_atri_interior, i_col, i_fil)
									if (isNaN(valor))
										ctx.fillStyle="rgba(255,255,255,0)";
									else
									{
										i_color=Math.floor(a_interior*(valor-valor_min_interior));
										if (i_color>=ncolors)
											i_color=ncolors-1;
										else if (i_color<0)
											i_color=0;
										ctx.fillStyle=estil.interior.paleta.colors[i_color];
									}
								}
								ctx.beginPath();
								ctx.arc(i_col,i_fil,icona.r,0,2*Math.PI);
								ctx.fill(); // Close the path and fill
								//ctx.stroke();
								if (estil.interior && estil.interior.paleta)
									ctx.fillStyle=fillStylePrevi;
							}
							else
							{
								//Hi ha un problem extrany al intentar dibuixar una imatge sobre un canvas que està en un altre window. El problema ha estat analitzat aquí:
								//https://stackoverflow.com/questions/34402718/img-from-opener-is-not-img-type-for-canvas-drawimage-in-ie-causing-type-mismatch
								//In IE there is a problem "img from opener is not img type for canvas drawImage (DispHTMLImg, being HTMLImageElement instead) in IE causing TYPE_MISMATCH_ERR"
								//Després d'invertir dies, he estat incapaç de trobar una manera de resoldre això en IE i ha hagut de renunciar i fer un try an catch per sortir del pas. 2017-12-17 (JM)
		
								if (icona.img.sha_carregat==true)
								{
									try
									{
										ctx.drawImage(icona.img, i_col-icona.i, 
													i_fil-icona.j, icona.img.ncol, icona.img.nfil);
									}
									catch (e)
									{
										if (!ErrorInRenderingIconsPresented)
										{
											if (e.message=="TypeMismatchError")
												win.alert("In Internet Explorer is not possible to render icons when printing. We recommed to print with Chrome or to deactivate layers with icons (" + e.message +")");
											else
												win.alert(e.message);
											ErrorInRenderingIconsPresented=true;
										}
									}
								}
								else if (!icona.img.hi_ha_hagut_error || icona.img.hi_ha_hagut_error==false)
									setTimeout("OmpleVistaCapaDigi(\"" + nom_vista + "\", " + JSON.stringify(vista) + ", " + param.i_capa + ");", 500);
							}
						}
					}
				}
			}
			if (estil.fonts)
			{
				if (env.MinX < punt.x &&
					env.MaxX > punt.x &&
					env.MinY < punt.y &&
					env.MaxY > punt.y)
				{
					shadowBlurPrevi=ctx.shadowBlur;
					shadowOffsetXPrevi=ctx.shadowOffsetX;
					shadowOffsetYPrevi=ctx.shadowOffsetY;
					shadowColorPrevi=ctx.shadowColor;
					ctx.shadowBlur=3;
					ctx.shadowOffsetX=1;
					ctx.shadowOffsetY=1;
					ctx.shadowColor="white";

					if(estil.fonts.aspecte.length==1) 
						font=estil.fonts.aspecte[0].font;
					else
						font=estil.fonts.aspecte[capa_digi.objectes.features[j].i_aspecte].font;  //No acabat implementar encara. Caldria generar index d'estils a cada objecte.
					ctx.font=font.font;
					if (font.color)
					{
						fillStylePrevi=ctx.fillStyle;
						ctx.fillStyle=font.color;
					}
					if (font.align)
						ctx.textAlign=font.align;
					ctx.fillText(capa_digi.objectes.features[j].properties[estil.fonts.NomCampText], i_col-font.i, i_fil-font.j);
					if (font.color)
						ctx.fillStyle=fillStylePrevi;
					ctx.shadowBlur=shadowBlurPrevi;
					ctx.shadowOffsetX=shadowOffsetXPrevi;
					ctx.shadowOffsetY=shadowOffsetYPrevi;
					ctx.shadowColor=shadowColorPrevi;
				}
			}
			//http://stackoverflow.com/questions/13618844/polygon-with-a-hole-in-the-middle-with-html5s-canvas
		}				
	}
	
}

function DonaNomCanvasCapaDigi(nom_vista, /*i_nova_vista,*/ i)
{
	return nom_vista + "_l_capa_digi" + i + "_canvas";
}

function CreaCapaDigiLayer(nom_vista, i_nova_vista, i)
{
	if (ParamCtrl.capa[i].visible!="no"/* && EsObjDigiVisibleAAquestNivellDeZoom(ParamCtrl.capa[i])*/)
	{
		var vista=DonaVistaDesDeINovaVista(i_nova_vista);
		return textHTMLLayer(nom_vista+"_l_capa"+i, DonaMargeEsquerraVista(i_nova_vista)+1, DonaMargeSuperiorVista(i_nova_vista)+1, 
						vista.ncol, vista.nfil, 
						null, "no", true, null, null, false, "<canvas id=\"" + DonaNomCanvasCapaDigi(nom_vista, /*i_nova_vista,*/ i) + "\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>");  // DonaCadenaHTMLCapaDigi(nom_vista, i_nova_vista, i)
	}
	else 
		return "";
}

function OmpleMatriuVistaCapaTiled(i_capa, vista, i_tile_matrix_set)
{
var vista_tiled=ParamCtrl.capa[i_capa].VistaCapaTiled;

	var i_tile_matrix=DonaIndexTileMatrix(i_capa, i_tile_matrix_set, vista.CostatZoomActual);
	if (i_tile_matrix==-1)
	{
		vista_tiled.TileMatrix=null;
		return i_tile_matrix;
	}
	vista_tiled.TileMatrix=ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix];
	
	vista_tiled.ITileMin = floor_DJ((vista.EnvActual.MinX - vista_tiled.TileMatrix.TopLeftPoint.x) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileWidth));
	vista_tiled.ITileMax = floor_DJ((vista.EnvActual.MaxX - vista_tiled.TileMatrix.TopLeftPoint.x) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileWidth));
	vista_tiled.JTileMin = floor_DJ((vista_tiled.TileMatrix.TopLeftPoint.y - vista.EnvActual.MaxY) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileHeight));
	vista_tiled.JTileMax = floor_DJ((vista_tiled.TileMatrix.TopLeftPoint.y - vista.EnvActual.MinY) / (vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileHeight));

	if (vista_tiled.ITileMin < 0) vista_tiled.ITileMin = 0;
	else if (vista_tiled.ITileMin >= vista_tiled.TileMatrix.MatrixWidth) vista_tiled.ITileMin = vista_tiled.TileMatrix.MatrixWidth - 1;
	if (vista_tiled.ITileMax < 0) vista_tiled.ITileMax = 0;
	else if (vista_tiled.ITileMax >= vista_tiled.TileMatrix.MatrixWidth) vista_tiled.ITileMax = vista_tiled.TileMatrix.MatrixWidth - 1;

	if (vista_tiled.JTileMin < 0) vista_tiled.JTileMin = 0;
	else if (vista_tiled.JTileMin >= vista_tiled.TileMatrix.MatrixHeight) vista_tiled.JTileMin = vista_tiled.TileMatrix.MatrixHeight - 1;
	if (vista_tiled.JTileMax < 0) vista_tiled.JTileMax = 0;
	else if (vista_tiled.JTileMax >= vista_tiled.TileMatrix.MatrixHeight) vista_tiled.JTileMax = vista_tiled.TileMatrix.MatrixHeight - 1;
 
	//Moc la layer, li canvio de mides i la tallo.
	vista_tiled.dx= floor_DJ((vista.EnvActual.MinX - (vista_tiled.TileMatrix.TopLeftPoint.x+vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileWidth*vista_tiled.ITileMin))/vista_tiled.TileMatrix.costat);
	vista_tiled.dy= floor_DJ(((vista_tiled.TileMatrix.TopLeftPoint.y-vista_tiled.TileMatrix.costat*vista_tiled.TileMatrix.TileHeight*vista_tiled.JTileMin) - vista.EnvActual.MaxY)/vista_tiled.TileMatrix.costat);
	return i_tile_matrix;
}

function AssignaDonaNomImatgeTiledASrc(nom_vista, i_capa, i_tile_matrix_set, i_tile_matrix, j, i)
{
	var capa=ParamCtrl.capa[i_capa];
	var img=window.document[nom_vista + "_i_raster"+ i_capa +"_"+ j +"_"+ i];
	var s=DonaNomImatgeTiled(i_capa, i_tile_matrix_set, i_tile_matrix, j, i, -1, true, null);

	img.src=s;
	if (DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_REST")
		img.i_event=CreaIOmpleEventConsola("WMTS-REST, tiled", i_capa, s, TipusEventWMTSTile);
	else if (DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_KVP")
		img.i_event=CreaIOmpleEventConsola("WMTS-KVP, tiled", i_capa, s, TipusEventWMTSTile);
	else //wms-c
		img.i_event=CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
			
	img.onload=onLoadCanviaImatge; 
	img.onerror=onErrorCanviaImatge;
}

function CreaMatriuCapaTiled(nom_vista, vista, i_capa)
{
var cdns=[], vista_tiled=ParamCtrl.capa[i_capa].VistaCapaTiled;

	var i_tile_matrix_set=DonaIndexTileMatrixSetCRS(i_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	if (i_tile_matrix_set==-1)
	{	
		//eval("window.document." + nom_vista + "_i_raster"+i_capa+".src=\""+AfegeixAdrecaBaseSRC("1tran.gif")+"\"");
		window.document[nom_vista + "_i_raster"+i_capa].src=AfegeixAdrecaBaseSRC("1tran.gif");
		return;
	}
	var i_tile_matrix=OmpleMatriuVistaCapaTiled(i_capa, vista, i_tile_matrix_set);
	if(i_tile_matrix==-1) 
	{	
		//eval("window.document." + nom_vista + "_i_raster"+i_capa+".src=\""+AfegeixAdrecaBaseSRC("1tran.gif")+"\"");
		window.document[nom_vista + "_i_raster"+i_capa].src=AfegeixAdrecaBaseSRC("1tran.gif");
		return;
	}
	var layer_vista=getLayer(window, nom_vista + "_l_capa"+i_capa);

	moveLayer(layer_vista, DonaMargeEsquerraVista(vista.i_nova_vista)+1-vista_tiled.dx, DonaMargeSuperiorVista(vista.i_nova_vista)+1-vista_tiled.dy, (vista_tiled.ITileMax-vista_tiled.ITileMin+1)*vista_tiled.TileMatrix.TileWidth, (vista_tiled.JTileMax-vista_tiled.JTileMin+1)*vista_tiled.TileMatrix.TileHeight);
	clipLayer(layer_vista, vista_tiled.dx, vista_tiled.dy, vista.ncol, vista.nfil);

	//Genero la taula
	cdns.push("<table border=0 cellspacing=0 cellpadding=0>");
	for (var j=vista_tiled.JTileMin; j<=vista_tiled.JTileMax; j++)
	{
		cdns.push("  <tr cellspacing=0 cellpadding=0 height=", vista_tiled.TileMatrix.TileHeight ,">");
		for (var i=vista_tiled.ITileMin; i<=vista_tiled.ITileMax; i++)
		{
			cdns.push("<td width=", vista_tiled.TileMatrix.TileWidth, "><img name=\"", nom_vista, "_i_raster", i_capa, "_" , j , "_", i , "\" src=\"",
						AfegeixAdrecaBaseSRC(DonaCadenaLang({"cat":"espereu.gif", "spa":"espereu_spa.gif", "eng":"espereu_eng.gif","fre":"espereu_fre.gif"})) +"\"></td>");
		}
		cdns.push("  </tr>");
	}
	cdns.push("  </table>");
	
	contentLayer(layer_vista, cdns.join(""));

	//Carrego les imatges
	for (var j=vista_tiled.JTileMin; j<=vista_tiled.JTileMax; j++)
	{
		for (var i=vista_tiled.ITileMin; i<=vista_tiled.ITileMax; i++)
		{
			if (DonaTipusServidorCapa(ParamCtrl.capa[i_capa].tipus)=="TipusWMTS_SOAP")
			{
				//if(j==vista_tiled.JTileMin && i==vista_tiled.ITileMin)
				FesPeticioAjaxGetTileWMTS_SOAP(i_capa, null, i_tile_matrix_set, i_tile_matrix, j, i, null);  //NJ a JM: Perquè el estil i el i_data sempre són null en el WMTS?? 
			}
			else
			{
				//setTimeout("window.document." + nom_vista + "_i_raster"+ i_capa +"_"+ j +"_"+ i +".src=DonaNomImatgeTiled("+i_capa+", "+i_tile_matrix_set+", "+i_tile_matrix+", "+j+", "+i+", -1, true, null)", 75);
				setTimeout("AssignaDonaNomImatgeTiledASrc(\""+nom_vista+"\", "+i_capa+", "+i_tile_matrix_set+", "+i_tile_matrix+", "+j+", "+i+");");
			}
		}
	}
}

function DonaTextMatriuCapaTiledImprimir(i_capa, ncol, nfil, env)
{
var cdns=[], tile_matrix;

	//Donat que només és possible imprimir conservant la resolució.
	var i_tile_matrix_set=DonaIndexTileMatrixSetCRS(i_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);

	if (i_tile_matrix_set==-1)
	{
		return "<img name=\"l_raster_print"+i_capa+"\" src=\""+
		AfegeixAdrecaBaseSRC("1tran.gif")+"\">";
	}
	var i_tile_matrix=DonaIndexTileMatrix(i_capa, i_tile_matrix_set, (env.MaxX-env.MinX)/ncol);
	if (i_tile_matrix==-1)
	{
		//ParamCtrl.capa[i_capa].VistaCapaTiled.TileMatrix=null;
		return "<img name=\"l_raster_print"+i_capa+"\" src=\""+
		AfegeixAdrecaBaseSRC("1tran.gif")+"\">";
	}
	tile_matrix=ParamCtrl.capa[i_capa].TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix];
	
	var i_tile_min = floor_DJ((env.MinX - tile_matrix.TopLeftPoint.x) / (tile_matrix.costat*tile_matrix.TileWidth));
	var i_tile_max = floor_DJ((env.MaxX - tile_matrix.TopLeftPoint.x) / (tile_matrix.costat*tile_matrix.TileWidth));
	var j_tile_min = floor_DJ((tile_matrix.TopLeftPoint.y - env.MaxY) / (tile_matrix.costat*tile_matrix.TileHeight));
	var j_tile_max = floor_DJ((tile_matrix.TopLeftPoint.y - env.MinY) / (tile_matrix.costat*tile_matrix.TileHeight));

	if (i_tile_min < 0) i_tile_min = 0;
	else if (i_tile_min >= tile_matrix.MatrixWidth) i_tile_min = tile_matrix.MatrixWidth - 1;
	if (i_tile_max < 0) i_tile_max = 0;
	else if (i_tile_max >= tile_matrix.MatrixWidth) i_tile_max = tile_matrix.MatrixWidth - 1;

	if (j_tile_min < 0) j_tile_min = 0;
	else if (j_tile_min >= tile_matrix.MatrixHeight) j_tile_min = tile_matrix.MatrixHeight - 1;
	if (j_tile_max < 0) j_tile_max = 0;
	else if (j_tile_max >= tile_matrix.MatrixHeight) j_tile_max = tile_matrix.MatrixHeight - 1;

	//Moc la layer, li canvio de mides i la tallo.
	var dx= floor_DJ((env.MinX - (tile_matrix.TopLeftPoint.x+tile_matrix.costat*tile_matrix.TileWidth*i_tile_min))/tile_matrix.costat);
	var dy= floor_DJ(((tile_matrix.TopLeftPoint.y-tile_matrix.costat*tile_matrix.TileHeight*j_tile_min) - env.MaxY)/tile_matrix.costat);

	var layer_vista=getLayer(winImprimir, "l_raster_print"+i_capa);

	moveLayer(layer_vista, -dx, -dy, (i_tile_max-i_tile_min+1)*tile_matrix.TileWidth, (j_tile_max-j_tile_min+1)*tile_matrix.TileHeight);
	clipLayer(layer_vista, dx, dy, ncol, nfil);

	//Genero la taula
	//NJ a JM: cal fer alguna modificació aquí també perquè funcioni correctament la impressió en SOAP
	cdns.push("<table border=0 cellspacing=0 cellpadding=0>");
	for (var j=j_tile_min; j<=j_tile_max; j++)
	{
		cdns.push("  <tr cellspacing=0 cellpadding=0 height=", tile_matrix.TileHeight ,">");
		for (var i=i_tile_min; i<=i_tile_max; i++)
		{
			cdns.push("<td width=", tile_matrix.TileWidth, "><img name=\"i_raster", i_capa, "_" , j , "_", i , "\" src=");
			var s=DonaNomImatgeTiled(i_capa, i_tile_matrix_set, i_tile_matrix, j, i, -1, true, null);
			var i_event;
			if (DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_REST")
				i_event=CreaIOmpleEventConsola("WMTS-REST, tiled", i_capa, s, TipusEventWMTSTile);
			else if (DonaTipusServidorCapa(capa.tipus)=="TipusWMTS_KVP")
				i_event=CreaIOmpleEventConsola("WMTS-KVP, tiled", i_capa, s, TipusEventWMTSTile);
			else //wms-c
				i_event=CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
			cdns.push(s);
			//cdns.push(DonaRequestGetMapTiled(i_capa, -1, true, tile_matrix.TileWidth, tile_matrix.TileHeight, i_tile_matrix_set, i_tile_matrix, j, i, null));
			cdns.push(" i_event=\""+i_event+"\" onLoad=\"onLoadCanviaImatge\" onError=\"onErrorCanviaImatge\"></td>");
		}
		cdns.push("  </tr>");
	}
	cdns.push("  </table>");
	
	return cdns.join("");
}

var AltTextCoordenada=18;
var AmpleTextCoordenada=85;

function CreaVistes()
{	
	if (timeoutCreaVistes)
	{
		clearTimeout(timeoutCreaVistes);
		timeoutCreaVistes=null;
	}			
	timeoutCreaVistes=setTimeout(CreaVistesImmediates, 10);
}

function CreaVistesImmediates()
{
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		CreaVistaImmediata(window, ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista);
	CanviaCursorSobreVista(null);
}

var NCreaVista=0;  //Guarda el nombre de vegades que he cridat CreaVistaImmediata(). D'aquesta manera puc detectar si he entrat a redibuixar quan encara estic redibuixant la vegada anterior i plegar immediatament de la vegada anterior.

function CreaVistaImmediata(win, nom_vista, vista)
{
var cdns=[], ll;
var i_crea_vista;
var elem=getLayer(win, nom_vista);
var cal_vora=(ParamCtrl.VoraVistaGrisa==true && vista.i_nova_vista==-1) ? true : false;
var cal_coord=(ParamCtrl.CoordExtremes && (vista.i_nova_vista==-1 || vista.i_nova_vista==-2)) ? true : false;
var estil_parella_coord=(vista.i_nova_vista==-2) ? true : false;

	NCreaVista++;
	i_crea_vista=NCreaVista;
		
	cdns.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	if (vista.i_nova_vista==-1)
	{
	    cdns.push("  <tr>",
				"    <td rowspan=", (cal_vora ? (cal_coord ? 8 : 7) : (cal_coord ? 5 : 3)), "><img src=\"",
				AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=1 width=", (ParamCtrl.MargeEsqVista?ParamCtrl.MargeEsqVista:0) , "></td>",
				"    <td colspan=", (cal_vora ? (cal_coord ? 6 : 5) : (cal_coord ? 3 : 1)), "><img src=\"",
				AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=" , (ParamCtrl.MargeSupVista?ParamCtrl.MargeSupVista:0) , " width=1></td>",
				"  </tr>");
	}

	if (cal_coord)
	{
	    cdns.push("  <tr>\n");
		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MinX,vista.EnvActual.MaxY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (cal_vora)
			cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=0 width=10></td>\n");
		cdns.push("    <td align=left><font face=arial size=1>\n");
		if (estil_parella_coord)
		{
			if (ParamCtrl.CoordExtremes=="proj")
				cdns.push("(" , (OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)) , "," ,
				  (OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)) , ")");
			else if (ParamCtrl.CoordExtremes=="longlat_g")
				cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)) , "," ,
				  (OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)) , "," , (g_gms(ll.y, true)) , ")");
		}
		else
		{
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)));
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)));
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.x, true)));
		}
		cdns.push("</td>\n");

		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MaxY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push("    <td"+ (cal_vora ? " colspan=\"2\"" : ""), " align=right><font face=arial size=1>\n");
		if (estil_parella_coord)
		{
			if (ParamCtrl.CoordExtremes=="proj")
				cdns.push("(" , (OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)) , "," ,
					(OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)) ,")");
			else if (ParamCtrl.CoordExtremes=="longlat_g")
				cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)) , "," ,
					(OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)), "," , (g_gms(ll.y, true)) , ")");
		}
		else
		{
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)));
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			   cdns.push((OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)));
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.x, true)));
		}
		cdns.push("    </td>\n");
		if (cal_vora)
			cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=0 width=10></td>\n");
		cdns.push("    <td",(cal_vora ? " rowspan=\"2\"": "" ),"><img src=\"",AfegeixAdrecaBaseSRC("1tran.gif"), 
		   "\" height=" , AltTextCoordenada , "></td>\n",
		   "  </tr>\n");
	}

	if (cal_vora)
	{
	  cdns.push("  <tr>",
			   "    <td><a href=\"javascript:MouLaVistaSalt(-1,1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc11.gif"), "\"",
			   " width=",
				MidaFletxaInclinada," height=",MidaFletxaInclinada," border=0></a></td>",
			   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), "\"",
			   " width=",Math.floor((vista.ncol-MidaFletxaPlana)/2)," height=",MidaFletxaInclinada,"></td>",
			   "    <td><a href=\"javascript:MouLaVistaSalt(0,1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_pla1.gif"), "\"",
			   " width=",MidaFletxaPlana," height=",MidaFletxaInclinada," border=0></a></td>",
			   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), "\"",
			   " width=",(Math.floor((vista.ncol-MidaFletxaPlana)/2)+(vista.ncol-MidaFletxaPlana)%2)," height=",MidaFletxaInclinada,"></td>",
			   "    <td><a href=\"javascript:MouLaVistaSalt(1,1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc21.gif"), "\"",
			   " width=",MidaFletxaInclinada," height=",MidaFletxaInclinada,
			   " border=0></a></td>\n");
	   cdns.push("  </tr>");
	}

	cdns.push("  <tr>");
	if (cal_vora)
		cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), 
	   		"\" width=",MidaFletxaInclinada," height=",Math.floor((vista.nfil-MidaFletxaPlana)/2),"></td>");
	cdns.push(
	   "    <td colspan=", ((cal_vora) ? 3 : (cal_coord? 2: 1)), " rowspan=", ((cal_vora) ? 3 : ((cal_coord && !estil_parella_coord)? 2: 1)), "><img src=\"", 
	   AfegeixAdrecaBaseSRC(DonaFitxerColor(ParamCtrl.ColorFonsVista)),"\" width=",vista.ncol," height=",vista.nfil,"></td>");

	if (cal_vora)
	  cdns.push(
	   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), 
	   "\" width=",MidaFletxaInclinada," height=",Math.floor((vista.nfil-MidaFletxaPlana)/2),"></td>");
	if (cal_coord)
	{
		if (estil_parella_coord)
			cdns.push("    <td", (cal_vora ? " rowspan=\"2\"":  ""),  " nowrap><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\"></td>\n");
		else
		{
			cdns.push("    <td", (cal_vora ? " rowspan=\"2\"":  ""), " valign=top nowrap><font face=arial size=1>&nbsp;&nbsp;\n");
			if (ParamCtrl.CoordExtremes=="proj")		
			    cdns.push((OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)));
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)));
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.y, true)));
			cdns.push("</td>\n");
		}
	}		 
	cdns.push("  </tr>");

	if ((cal_coord && !estil_parella_coord) || cal_vora) 
	{
		cdns.push("  <tr>");
		if (cal_vora)
		  cdns.push(
		   "    <td><a href=\"javascript:MouLaVistaSalt(-1,0);\"><img src=\"", AfegeixAdrecaBaseSRC("f_ver1.gif"), 
		   "\" width=",MidaFletxaInclinada," height=",MidaFletxaPlana," border=0></a></td>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(1,0);\"><img src=\"", AfegeixAdrecaBaseSRC("f_ver2.gif"), 
		   "\" width=",MidaFletxaInclinada," height=",MidaFletxaPlana," border=0></a></td>",
		   "  </tr>",
		   "  <tr>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), 
		   "\" width=",MidaFletxaInclinada," height=",(Math.floor((vista.nfil-MidaFletxaPlana)/2)+(vista.nfil-MidaFletxaPlana)%2),"></td>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"),  
		   "\" width=",MidaFletxaInclinada," height=",(Math.floor((vista.nfil-MidaFletxaPlana)/2)+(vista.nfil-MidaFletxaPlana)%2),"></td>\n");
		if (cal_coord)
		{
			cdns.push("    <td valign=bottom nowrap><font face=arial size=1>&nbsp;&nbsp;\n");
			if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
			    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MinY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)));
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)));
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.y, true)));
			cdns.push("</td>\n");
		}
		cdns.push("  </tr>");
	}

	if (cal_vora)
	{
		cdns.push("  <tr>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(-1,-1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc12.gif"), 
		   "\" width=",MidaFletxaInclinada," height=",MidaFletxaInclinada," border=0></a></td>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), 
		   "\" width=",Math.floor((vista.ncol-MidaFletxaPlana)/2)," height=",MidaFletxaInclinada,"></td>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(0,-1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_pla2.gif"), 
		   "\" width=",MidaFletxaPlana," height=",MidaFletxaInclinada," border=0></a></td>",
		   "    <td><img src=\"", AfegeixAdrecaBaseSRC("1gris.gif"), 
		   "\" width=",(Math.floor((vista.ncol-MidaFletxaPlana)/2)+(vista.ncol-MidaFletxaPlana)%2), " height=",MidaFletxaInclinada,"></td>",
		   "    <td><a href=\"javascript:MouLaVistaSalt(1,-1);\"><img src=\"", AfegeixAdrecaBaseSRC("f_inc22.gif"), 
		   "\" width=",MidaFletxaInclinada," height=",MidaFletxaInclinada," border=0></a></td>");
		if (cal_coord)
		   cdns.push("    <td rowspan=\"2\"><img src=\"1tran.gif\"></td>");
		cdns.push("  </tr>");
	}
	if (cal_coord && estil_parella_coord)
	{
	    cdns.push("  <tr>\n");
		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MinX,vista.EnvActual.MinY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (cal_vora)
			cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=0 width=10></td>\n");
		cdns.push("    <td align=left><font face=arial size=1>\n");
		if (ParamCtrl.CoordExtremes=="proj")
			cdns.push("(" , (OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)) , "," ,
				  (OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)) , ")");
		else if (ParamCtrl.CoordExtremes=="longlat_g")
			cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)) , "," ,
				  (OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
		else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)) , "," , (g_gms(ll.y, true)) , ")");
		cdns.push("</td>\n");

		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MinY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push("    <td"+ (cal_vora ? " colspan=\"2\"" : ""), " align=right><font face=arial size=1>\n");
		if (ParamCtrl.CoordExtremes=="proj")
			cdns.push("(" , (OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)) , "," ,
					(OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)) ,")");
		else if (ParamCtrl.CoordExtremes=="longlat_g")
			cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)) , "," ,
					(OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
		else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			cdns.push("(" , (g_gms(ll.x, true)), "," , (g_gms(ll.y, true)) , ")");
		cdns.push("    </td>\n");
		if (cal_vora)
			cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=0 width=10></td>\n");
		cdns.push("    <td",(cal_vora ? " rowspan=\"2\"": "" ),"><img src=\"",AfegeixAdrecaBaseSRC("1tran.gif"), 
		   "\" height=" , AltTextCoordenada , "></td>\n",
		   "  </tr>\n");
	}

	if(ParamCtrl.MostraBarraEscala==true && vista.i_nova_vista==-1)
	{
		cdns.push("  <tr>",
		   "    <td colspan=", (cal_vora ? 5 : (cal_coord ? 2 : 1)), " align=middle>", DonaCadenaHTMLEscala(vista.EnvActual) ,"</td>");  //Servirà per indicar l'escala.
		if (cal_coord && !cal_vora)
			cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\"></td>\n");
		cdns.push("  </tr>");
	}
	cdns.push("</table>");

	//alert(cdns.join(""));

	if (isLayer(elem))
	{
		//Les capes
		for (var i=ParamCtrl.capa.length-1; i>=0; i--)
		{
			if(i_crea_vista!=NCreaVista)		
				return;
			var capa=ParamCtrl.capa[i];
			if (capa.model==model_vector)
			{
				cdns.push(CreaCapaDigiLayer(nom_vista, vista.i_nova_vista, i));
			}
			else
			{
				if (capa.visible!="no")
				{
					cdns.push(textHTMLLayer(nom_vista+"_l_capa"+i, DonaMargeEsquerraVista(vista.i_nova_vista)+1, DonaMargeSuperiorVista(vista.i_nova_vista)+1, vista.ncol, vista.nfil, null, "no", 
											((EsCapaVisibleAAquestNivellDeZoom(i) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=-1 ? vista.i_vista : DonaIVista(nom_vista), i)) ? true : false), null, null, false, 
											((capa.FormatImatge=="application/x-img") ? "<canvas id=\"" + nom_vista + "_i_raster"+i+"\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>" : "<img id=\"" + nom_vista + "_i_raster"+i+"\" name=\"" + nom_vista + "_i_raster"+i+"\" src=\""+AfegeixAdrecaBaseSRC(DonaCadenaLang({"cat":"espereu.gif", "spa":"espereu_spa.gif", "eng":"espereu_eng.gif","fre":"espereu_fre.gif"}))+"\">")));
				}
			}
		}


		if (vista.i_nova_vista!=-2)  //Evito que la impressión tingui events.
		{
			//Dibuixo el rectangle de zoom sobre la vista (inicialment invisible)
			cdns.push(textHTMLLayer(nom_vista+"_z_rectangle", DonaMargeEsquerraVista(vista.i_nova_vista), DonaMargeSuperiorVista(vista.i_nova_vista), vista.ncol+1, vista.nfil+1, null, "no", false, null, null, false,
				  "<table cellspacing=\"0\" cellpadding=\"0\" width=\"100%\" height=\"100%\" style=\"border: 1px solid "+ ParamCtrl.ColorQuadratSituacio +";\">"+
				  "  <tr><td><img src=\"" + 
				  AfegeixAdrecaBaseSRC("1tran.gif") + "\" height=\"100%\" width=\"100%\"></td>"+
				  "  </tr>"+
				  "</table>"));
			//Dibuixo el "tel" transparent amb els events de moure i click
			cdns.push(textHTMLLayer(nom_vista+"_tel_trans", DonaMargeEsquerraVista(vista.i_nova_vista)+1, DonaMargeSuperiorVista(vista.i_nova_vista)+1, vista.ncol, vista.nfil, null, "no", true, null, (ParamCtrl.ZoomUnSolClic==true ? "onmousedown=\"IniciClickSobreVista(event, "+vista.i_nova_vista+");\" " : "") + "onmousemove=\"MovimentSobreVista(event, "+vista.i_nova_vista+");\" onClick=\"ClickSobreVista(event, "+vista.i_nova_vista+");\"", false, "<!-- -->"));
		}

		if (( ParamCtrl.VistaBotonsBruixola==true || ParamCtrl.VistaBotonsZoom==true || ParamCtrl.VistaSliderZoom==true || ParamCtrl.VistaEscalaNumerica==true) && vista.i_nova_vista==-1)
		{
			var barra_slider=[];
			barra_slider.push("<table class=\"finestra_superposada\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
			if (ParamCtrl.VistaBotonsBruixola==true && (parseInt(document.getElementById("vista").style.height,10) >= 300))
			{
				barra_slider.push("<tr><td align='center'>");
				barra_slider.push(CadenaBotoPolsable('boto_nw', 'nw', DonaCadenaLang({"cat":"mou al Nord-Oest", "spa":"mover al NorOeste", "eng":"move to North-West","fre":"déplacer vers le Nord-Ouest"}), 'MouLaVistaEventDeSalt(event,-1,1)'));
				barra_slider.push(CadenaBotoPolsable("boto_n", "n", DonaCadenaLang({"cat":"mou al Nord", "spa":"mover al Norte", "eng":"move to North","fre":"déplacer vers le Nord"}), "MouLaVistaEventDeSalt(event,0,1)"));
				barra_slider.push(CadenaBotoPolsable("boto_ne", "ne", DonaCadenaLang({"cat":"mou al Nord-Est", "spa":"mover al Noreste", "eng":"move to North-East","fre":"déplacer vers le Nord-Est"}), "MouLaVistaEventDeSalt(event,1,1)"));
				barra_slider.push("<br/>");
				barra_slider.push(CadenaBotoPolsable("boto_w", "w", DonaCadenaLang({"cat":"mou a l'Oest", "spa":"mover al Oeste", "eng":"move to West","fre":"déplacer vers l'Ouest"}), "MouLaVistaEventDeSalt(event,-1,0)"));
				barra_slider.push(CadenaBotoPolsable("boto_zoomall", "zoomall", DonaCadenaLang({"cat":"vista general", "spa":"vista general", "eng":"general view","fre":"vue générale"}), "PortamAVistaGeneralEvent(event)"));
				barra_slider.push(CadenaBotoPolsable("boto_e", "e", DonaCadenaLang({"cat":"mou a l'Est", "spa":"mover al Este", "eng":"move to East","fre":"déplacer vers l'Est"}), "MouLaVistaEventDeSalt(event,1,0)"));
				barra_slider.push("<br/>");
				barra_slider.push(CadenaBotoPolsable("boto_sw", "sw", DonaCadenaLang({"cat":"mou al Sud-Oest", "spa":"mover al Suroeste", "eng":"move to South-West","fre":"déplacer vers le Sud-Ouest"}), "MouLaVistaEventDeSalt(event,-1,-1)"));
				barra_slider.push(CadenaBotoPolsable("boto_s", "s", DonaCadenaLang({"cat":"mou al Sud", "spa":"mover al Sur", "eng":"move to South","fre":"déplacer vers le Sud"}), "MouLaVistaEventDeSalt(event,0,-1)"));
				barra_slider.push(CadenaBotoPolsable("boto_se", "se", DonaCadenaLang({"cat":"mou al Sud-Est", "spa":"mover al Sureste", "eng":"move to South-East","fre":"déplacer vers le Sud-Est"}), "MouLaVistaEventDeSalt(event,1,-1)"));
				barra_slider.push("</td></tr><tr><td height='15px'></td></tr>");
			}
			barra_slider.push("<tr><td align='center'>");
			if (ParamCtrl.VistaBotonsZoom==true)
			{
				barra_slider.push(CadenaBotoPolsable("boto_zoom_in", "zoom_in", DonaCadenaLang({"cat":"augmenta 1 nivell de zoom", "spa":"augmenta 1 nivel de zoom", "eng":"increase 1 zoom level","fre":"augmenter 1 niveau de zoom"}), "PortamANivellDeZoomEvent(event, " + (DonaIndexNivellZoom(vista.CostatZoomActual)+1) + ")"));
				barra_slider.push("<br>");
			}
			if (ParamCtrl.VistaSliderZoom==true && (parseInt(document.getElementById("vista").style.height,10) >= 500))
			{	
				barra_slider.push("<input id='latZoom' type='range' step='1' min='0' max='" + (ParamCtrl.zoom.length-1) + "' value='"+DonaIndexNivellZoom(vista.CostatZoomActual)+"' style=';' orient='vertical' onchange='PortamANivellDeZoomEvent(event, this.value);' onclick='dontPropagateEvent(event);'><br>");
			}
			if (ParamCtrl.VistaBotonsZoom==true)
			{
				barra_slider.push(CadenaBotoPolsable("boto_zoom_out", "zoomout", DonaCadenaLang({"cat":"redueix 1 nivell de zoom", "spa":"reduce 1 nivel de zoom", "eng":"reduce 1 zoom level","fre":"réduire 1 niveau de zoom"}), "PortamANivellDeZoomEvent(event, " + (DonaIndexNivellZoom(vista.CostatZoomActual)-1) + ")"));
			}
			barra_slider.push("</td></tr>");
			if (ParamCtrl.VistaEscalaNumerica==true && (parseInt(document.getElementById("vista").style.height,10) >= 400))
			{
				barra_slider.push("<tr><td align='center'><span class=\"text_allus\" style='font-family: Verdana, Arial; font-size: 0.6em;'>"+ (ParamCtrl.TitolLlistatNivellZoom ? DonaCadena(ParamCtrl.TitolLlistatNivellZoom) : "Zoom:") +"<br>"+ EscriuDescripcioNivellZoom(DonaIndexNivellZoom(vista.CostatZoomActual), ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, true) +"</span>");	
				barra_slider.push("<br>");
				barra_slider.push(CadenaBotoPolsable("boto_zoomcoord", "zoomcoord", DonaCadenaLang({"cat":"anar a coordenada", "spa":"ir a coordenada", "eng":"go to coordinate", "fre":"aller à la coordonnée"}), "MostraFinestraAnarCoordenadaEvent(event)"));
				barra_slider.push(CadenaBotoPolsable("boto_zoom_bk", "zoom_bk", DonaCadenaLang({"cat":"vista prèvia", "spa":"vista previa", "eng":"previous view","fre":"vue préalable"}), "RecuperaVistaPreviaEvent(event)"));
				barra_slider.push("</td></tr>");
			}
			barra_slider.push("</table>");
			
			cdns.push(textHTMLLayer(nom_vista+"_sliderzoom", DonaMargeEsquerraVista(vista.i_nova_vista)+4, DonaMargeSuperiorVista(vista.i_nova_vista)+4, vista.ncol-3, vista.nfil-3, null, "no", true, null, (ParamCtrl.ZoomUnSolClic==true ? "onmousedown=\"IniciClickSobreVista(event, "+vista.i_nova_vista+");\" " : "") + "onmousemove=\"MovimentSobreVista(event, "+vista.i_nova_vista+");\" onClick=\"ClickSobreVista(event, "+vista.i_nova_vista+");\"", false, barra_slider.join("")));
		}

		contentLayer(elem, cdns.join(""));

		//Només s'hauria de fer si hi ha peticions SOAP
		RespostaGetTileWMTS_SOAP.splice(0,RespostaGetTileWMTS_SOAP.length);
		ajaxGetTileWMTS_SOAP.splice(0,ajaxGetTileWMTS_SOAP.length);

		for (var i=ParamCtrl.capa.length-1; i>=0; i--)
		{
			if(i_crea_vista!=NCreaVista)
				return;
			var capa=ParamCtrl.capa[i];
			if (capa.model==model_vector)
			{
				//if (EsObjDigiVisibleAAquestNivellDeZoom(capa))
				if (EsCapaVisibleAAquestNivellDeZoom(i) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=-1 ? vista.i_vista : DonaIVista(nom_vista), i))
					setTimeout("OmpleVistaCapaDigi(\""+nom_vista+"\", "+JSON.stringify(vista)+", "+i+")", 25*i);
			}
			else
			{
				if (EsCapaVisibleAAquestNivellDeZoom(i) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=-1 ? vista.i_vista : DonaIVista(nom_vista), i))
					setTimeout("OmpleVistaCapa(\""+nom_vista+"\", "+JSON.stringify(vista)+", "+i+")", 25*i);
			}
			if (capa.visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor!=true)
				setTimeout("semitransparentThisNomLayer(\""+nom_vista+"_l_capa"+i+"\")", 25*i);
		}		
	}
	if (vista.i_nova_vista==-1 || vista.i_nova_vista==-2)
		CreaAtribucioVista();
}

function PortamAPunt(x,y)
{
	if (ParamCtrl.ConsultaTipica)
		PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
	GuardaVistaPrevia();
	CentraLaVista(x, y);
	VerificaICorregeixPuntOri();
	RepintaMapesIVistes();
}

function PortamAAmbit(env)
{
	var costat=(env.MaxX-env.MinX)/ParamInternCtrl.vista.ncol;
	var costat_Y=(env.MaxY-env.MinY)/ParamInternCtrl.vista.nfil;
	if (costat<costat_Y)
		costat=costat_Y;

	GuardaVistaPrevia();
	if (ParamCtrl.ZoomContinu==true)
	{	
		if (ParamCtrl.zoom && ParamCtrl.zoom.length>2)
		{
			if (costat>ParamCtrl.zoom[0].costat)
			{
				alert(DonaCadenaLang({"cat":"No hi ha zoom inferior a mostrar.", "spa":"No hay zoom inferior a mostrar.", "eng":"There is no more zoom out to be shown.", "fre":"Il n'y a pas un zoom inférieur à montrer."}));
				costat=ParamCtrl.zoom[0].costat;
			}
			else if (costat<ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat)
			{
				alert(DonaCadenaLang({"cat":"No hi ha zoom superior a mostrar.", "spa":"No hay zoom superior a mostrar.", "eng":"There is no more zoom in to be shown.", "fre":"Il n'y a pas un zoom supérieur à montrer."}));
				costat=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
			}
		}
		ParamInternCtrl.vista.CostatZoomActual=costat;
		CentraLaVista((env.MaxX+env.MinX)/2,(env.MaxY+env.MinY)/2);
		RepintaMapesIVistes();
	}
	else
	{
		var j;
		for (j=ParamCtrl.zoom.length-1; j>0; j--)
		{
			if (ParamCtrl.zoom[j].costat>=costat)
				break;
		}
		CentraLaVista((env.MaxX+env.MinX)/2,(env.MaxY+env.MinY)/2);
		if (j!=DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual))  //Evito canviar de nivell al nivell actual.
			CanviaNivellDeZoom(j);
		else
		{
			RevisaEstatsCapes();
			CreaLlegenda();
			RepintaMapesIVistes();
		}
	}
	if (ParamCtrl.ConsultaTipica)
		OmpleXYAmpleAltEnvConsultesTipiquesCompleta(env);
}

function DonaEnvDeXYAmpleAlt(x, y, ample, alt)
{
	return {"MinX": x-ample/2, "MaxX": x+ample/2, "MinY": y-alt/2, "MaxY": y+alt/2};
}

function DonaEnvDeMinMaxXY(minx, maxx, miny, maxy)
{
var env={"MinX": minx, "MaxX": maxx, "MinY": miny, "MaxY": maxy};
	return env;
}

function CalculaMidesVista(i_nova_vista)
{
var w=0, h=0;
var elem=getLayer(window, "vista");
var cal_coord=(ParamCtrl.CoordExtremes) ? true : false;

	if (isLayer(elem))
	{
		var rect=getRectLayer(elem);
		w=rect.ample;
		h=rect.alt;
	}
	if (w>0)
	{
		ParamInternCtrl.vista.ncol=w-((ParamCtrl.MargeEsqVista?ParamCtrl.MargeEsqVista:0)+MidaFletxaInclinada*2+MidaFletxaPlana+((cal_coord && i_nova_vista==-1) ? AmpleTextCoordenada : 0));
		if (w>200)
		    ParamInternCtrl.vista.ncol+=10;
		if (ParamInternCtrl.vista.ncol<MidaFletxaPlana+((cal_coord && i_nova_vista==-1) ? AmpleTextCoordenada*2 : 5))
			ParamInternCtrl.vista.ncol=MidaFletxaPlana+((cal_coord && i_nova_vista==-1) ? AmpleTextCoordenada*2 : 5);
	}
	if (h>0)
	{
		ParamInternCtrl.vista.nfil=h-((ParamCtrl.MargeSupVista?ParamCtrl.MargeSupVista:0)+((cal_coord && i_nova_vista==-1) ? AltTextCoordenada:0)+MidaFletxaInclinada*2+MidaFletxaPlana+AltTextCoordenada+5);
		if (h>200)
		    ParamInternCtrl.vista.nfil+=18;
		if (ParamInternCtrl.vista.nfil<MidaFletxaPlana+((cal_coord && i_nova_vista==-1) ? AltTextCoordenada*2 : 5))
			ParamInternCtrl.vista.nfil=MidaFletxaPlana+((cal_coord && i_nova_vista==-1) ? AltTextCoordenada*2 : 5);
	}
}

function ActualitzaEnvParametresDeControl()
{
/*Generalment demandes un ambit que està desplaçat de la malla de píxels. El resultat és que la CGI et retorna
  una imatge 1 píxel més gran del compte. Per prevenir això, decremento en 1. Aquest truco està molts llocs!. Compte!*/
	if (ParamCtrl.NColNFilAuto)
		CalculaMidesVista(false);

	if (Math.abs(ParamInternCtrl.vista.EnvActual.MinX-ParamInternCtrl.PuntOri.x+(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2)<1e-9 &&
		Math.abs(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.PuntOri.x-(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2)<1e-9 &&
		Math.abs(ParamInternCtrl.vista.EnvActual.MinY-ParamInternCtrl.PuntOri.y+(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2)<1e-9 &&
		Math.abs(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.PuntOri.y-(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2)<1e-9)
		return 0;
	ParamInternCtrl.vista.EnvActual.MinX=ParamInternCtrl.PuntOri.x-(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2;
	ParamInternCtrl.vista.EnvActual.MaxX=ParamInternCtrl.PuntOri.x+(ParamInternCtrl.vista.ncol)*ParamInternCtrl.vista.CostatZoomActual/2;
	ParamInternCtrl.vista.EnvActual.MinY=ParamInternCtrl.PuntOri.y-(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2;
	ParamInternCtrl.vista.EnvActual.MaxY=ParamInternCtrl.PuntOri.y+(ParamInternCtrl.vista.nfil)*ParamInternCtrl.vista.CostatZoomActual/2;
	return 1;
}

function EstableixNouCRSSiCal()
{
var i_min=ParamCtrl.ImatgeSituacio.length, i_max;
var env_ll;

	env_ll=DonaEnvolupantLongLat(ParamInternCtrl.vista.EnvActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	for (var i=0; i<ParamCtrl.ImatgeSituacio.length; i++)
	{
		if (ParamInternCtrl.EnvLLSituacio[i].MinX-(ParamInternCtrl.EnvLLSituacio[i].MaxX-ParamInternCtrl.EnvLLSituacio[i].MinX)*0.15<env_ll.MinX && ParamInternCtrl.EnvLLSituacio[i].MaxX+(ParamInternCtrl.EnvLLSituacio[i].MaxX-ParamInternCtrl.EnvLLSituacio[i].MinX)*0.15>env_ll.MaxX &&
			ParamInternCtrl.EnvLLSituacio[i].MinY-(ParamInternCtrl.EnvLLSituacio[i].MaxY-ParamInternCtrl.EnvLLSituacio[i].MinY)*0.15<env_ll.MinY && ParamInternCtrl.EnvLLSituacio[i].MaxY+(ParamInternCtrl.EnvLLSituacio[i].MaxY-ParamInternCtrl.EnvLLSituacio[i].MinY)*0.15>env_ll.MaxY &&
                        (i_min==ParamCtrl.ImatgeSituacio.length || 
				(ParamInternCtrl.EnvLLSituacio[i_min].MaxX-ParamInternCtrl.EnvLLSituacio[i_min].MinX)+(ParamInternCtrl.EnvLLSituacio[i_min].MaxY-ParamInternCtrl.EnvLLSituacio[i_min].MinY)>
				(ParamInternCtrl.EnvLLSituacio[i].MaxX-ParamInternCtrl.EnvLLSituacio[i].MinX)+(ParamInternCtrl.EnvLLSituacio[i].MaxY-ParamInternCtrl.EnvLLSituacio[i].MinY) ))
				i_min=i;
	}

	if (i_min==ParamCtrl.ImatgeSituacio.length)
	{
	    //Agafo la més general en aquest cas.
	    i_max=0;
	    for (var i=1; i<ParamCtrl.ImatgeSituacio.length; i++)
	    {
		if ((ParamInternCtrl.EnvLLSituacio[i_max].MaxX-ParamInternCtrl.EnvLLSituacio[i_max].MinX)+
			(ParamInternCtrl.EnvLLSituacio[i_max].MaxY-ParamInternCtrl.EnvLLSituacio[i_max].MinY)<
		    (ParamInternCtrl.EnvLLSituacio[i].MaxX-ParamInternCtrl.EnvLLSituacio[i].MinX)+
			(ParamInternCtrl.EnvLLSituacio[i].MaxY-ParamInternCtrl.EnvLLSituacio[i].MinY))
				i_max=i;
	    }
            i_min=i_max;
	}

	if (ParamInternCtrl.ISituacio!=i_min)
	{
	    if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS!=ParamCtrl.ImatgeSituacio[i_min].EnvTotal.CRS)
		CanviaCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ParamCtrl.ImatgeSituacio[i_min].EnvTotal.CRS);
	    ParamInternCtrl.ISituacio=i_min;
		if(ParamCtrl.FuncioCanviProjeccio)
			eval(ParamCtrl.FuncioCanviProjeccio);
	    return 1;
	}

	return 0;
}

function EstableixNouCRSEnv(crs, env)
{
var i_min=ParamCtrl.ImatgeSituacio.length, i_max;
var i_situacio_anterior=ParamInternCtrl.ISituacio;

	for (var i=0; i<ParamCtrl.ImatgeSituacio.length; i++)
	{
		if (crs==ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS &&
		    ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinX-(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinX)*0.15<env.MinX && 
			ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxX+(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinX)*0.15>env.MaxX &&
			ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinY-(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinY)*0.15<env.MinY && 
			ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxY+(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinY)*0.15>env.MaxY &&
            (i_min==ParamCtrl.ImatgeSituacio.length || 
				(ParamCtrl.ImatgeSituacio[i_min].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[i_min].EnvTotal.EnvCRS.MinX)+(ParamCtrl.ImatgeSituacio[i_min].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[i_min].EnvTotal.EnvCRS.MinY)>
				(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinX)+(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinY) ))
				i_min=i;
	}

	if (i_min==ParamCtrl.ImatgeSituacio.length)
	{
	    //Agafo la més general en aquest cas.
	    i_max=0;
	    for (var i=1; i<ParamCtrl.ImatgeSituacio.length; i++)
	    {
			if (crs==ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS &&
		    	((ParamCtrl.ImatgeSituacio[i_max].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[i_max].EnvTotal.EnvCRS.MinX)+
				 (ParamCtrl.ImatgeSituacio[i_max].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[i_max].EnvTotal.EnvCRS.MinY)<
				 (ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxX-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinX)+
				 (ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MaxY-ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS.MinY)))
				i_max=i;
	    }
        i_min=i_max;
	}

	if (ParamInternCtrl.ISituacio!=i_min)
	{
	    if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS!=ParamCtrl.ImatgeSituacio[i_min].EnvTotal.CRS)
			CanviaCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ParamCtrl.ImatgeSituacio[i_min].EnvTotal.CRS);		
	    ParamInternCtrl.ISituacio=i_min;
		if(ParamCtrl.FuncioCanviProjeccio)
			eval(ParamCtrl.FuncioCanviProjeccio);
	    return 1;
	}
	return 0;
}

function RepintaMapesIVistes()
{
	ActualitzaEnvParametresDeControl();
	if (ParamInternCtrl.flags&ara_canvi_proj_auto)
	{
		if (EstableixNouCRSSiCal())
			ActualitzaEnvParametresDeControl();
	}
	CreaSituacio();
	CreaVistes();
	CreaProjeccio();
	if (ParamCtrl.LlegendaAmagaSiForaAmbit==true || ParamCtrl.LlegendaGrisSiForaAmbit==true)
		CreaLlegenda();
	if (ParamCtrl.ConsultaTipica)
	{
		OmpleXYAmpleAltEnvConsultesTipiquesCompleta(null);
		SeleccionaRadialPuntCentralConsultesTipiques();
		PosaAGrisRetallPerObjecteConsultesTipiques();
	}
}

function ChangeSizeMiraMonMapBrowser()
{
	//if (isLayer(getLayer(window, "vista")))
	if (changeSizeLayers(window)==false)
		return;
	if (ActualitzaEnvParametresDeControl())
	{
		CreaSituacio();
		CreaVistes();
		CreaProjeccio();
	}
}

/*
Closes all the opened "capa" in the current view.
By default (unless Redraw is false) the view will be redrawn after removing all "capa".
*/
function EliminaTotesLesCapes(Redraw)
{
	ParamCtrl.capa=[];
	if(Redraw)
	{
		RevisaEstatsCapes();
		CreaLlegenda();
		RepintaMapesIVistes();
	}
}

function ComprovaOpcionsAccio()
{
	if(Accio.accio==null)
	{
		alert(DonaCadenaLang({"cat":"No s'ha trobat el paràmetre 'REQUEST'", 
							  "spa":"No se ha encontrado el parámetro 'REQUEST'",
							  "eng":"Cannot find the 'REQUEST' parameter",
							  "fre":"Le paramètre 'REQUEST' n'a pas été trouvé"}));
		return false;	
	}
	if(Accio.accio&accio_validacio)
	{
		if(Accio.servidor==null)
		{
			alert(DonaCadenaLang({"cat":"No s'ha trobat el paràmetre 'SERVERTORESPONSE'", 
								  "spa":"No se ha encontrado el parámetro 'SERVERTORESPONSE'",
								  "eng":"Cannot find the 'SERVERTORESPONSE' parameter",
								  "fre":"Le paramètre 'SERVERTORESPONSE' n'a pas été trouvé"}));
			return false;	
		}
		if(Accio.capes==null)
		{
			alert(DonaCadenaLang({"cat":"No s'ha trobat el paràmetre 'TEST_LAYERS'", 
								  "spa":"No se ha encontrado el parámetro 'TEST_LAYERS'",
								  "eng": "Cannot find the 'TEST_LAYERS' parameter",
								  "fre":"Le paramètre 'TEST_LAYERS' n'a pas été trouvé"}));			
			return false;	
		}
		if(Accio.camps==null)
		{
			alert(DonaCadenaLang({"cat":"No s'ha trobat el paràmetre 'TEST_FIELDS'", 
								  "spa":"No se ha encontrado el parámetro 'TEST_FIELDS'",
								  "eng":"Cannot find the 'TEST_FIELDS'  parameter",
								  "fre":"Le paramètre 'TEST_FIELDS' n'a pas été trouvé"}));
			return false;	
		}
		
		if(Accio.camps.length!=Accio.capes.length)
		{
			alert(DonaCadenaLang({"cat":"El nombre de camps no es correspon amb el nombre de capes.", 
								  "spa":"El número de campos no se corresponde con el número de capas.", 
								  "eng":"Field number is not the same of the number of layers.",
								  "fre":"Le nombre de champs ne correspond pas au nombre de couches."}));
			return false;
		}
		if(Accio.valors && Accio.valors.length!=Accio.capes.length)
		{
			alert(DonaCadenaLang({"cat":"El nombre de valors no es correspon amb el nombre de capes.", 
								  "spa":"El número de valores no se corresponde con el número de capas.", 
								  "eng":"Field values number is not the same of the number of layers.",
								  "fre":"Le nombre de valeurs ne correspond pas au nombre de couches."}));	  
			return false;
		}		
		
		if(capa)
		{		
			//Cal marcar com a consultables les capes sol·licitades en l'acció i la resta com a no consultables
			//Ho faré mentre les recorro per comprobar que són correctes
			for (var j=0; j<ParamCtrl.capa.length; j++)
			{
				if(ParamCtrl.capa[j].consultable=="si")
					ParamCtrl.capa[j].consultable="ara_no";
			}
			for (var i=0; i<Accio.capes.length; i++)
			{	
				for (var j=0; j<ParamCtrl.capa.length; j++)
				{
					if (Accio.capes[i]==ParamCtrl.capa[j].nom)					
					{
						if(ParamCtrl.capa[j].consultable=="ara_no")
							ParamCtrl.capa[j].consultable="si";
						break;					
					}
				}
				if(j==ParamCtrl.capa.length) //Capa no trobada
				{
					alert(DonaCadenaLang({"cat":"La capa " + Accio.capes[i] + " indicada al paràmetre TEST_LAYERS no existeix.", 
										  "spa":"La capa " + Accio.capes[i] + " indicada en el parámetro TEST_LAYERS no existe.", 
										  "eng":"Layer " + Accio.capes[i] + " indicated in TEST_LAYERS parameter does not exist.",
										  "fre":"La couche " + Accio.capes[i] + " indiquée au paramètre TEST_LAYERS n'existe pas."}));
					return false;
				}
			}
		
		}
		//Comprovo si puc anar a alguna coordenada perquè m'ho han indicat o a partir de la consulta típica
		if(Accio.coord)
		{
			if(isNaN(Accio.coord.x) || isNaN(Accio.coord.y))
				Accio.coord=null;
			else if(!EsPuntDinsAmbitNavegacio(Accio.coord))
			{
				alert(DonaCadenaLang({"cat":"El punt sol·licitat (x,y)="+Accio.coord.x+","+Accio.coord.y+" està fora de l'àmbit de navegació.", 
									  "spa":"El punto solicitado (x,y)="+Accio.coord.x+","+Accio.coord.y+" está fuera del ámbito de navegación.", 
									  "eng":"The requested point (x,y)="+Accio.coord.x+","+Accio.coord.y+" is outside browser envelope.",
									  "fre":"Le point requis (x,y)="+Accio.coord.x+","+Accio.coord.y+" se trouve dehors le milieu de navigation."}));
				Accio.coord=null;
			}
			else
				Accio.accio|=accio_conloc;			
		}
		if(Accio.valors)
		{
			//Intento buscar un punt on anar mitjançant els valors dels camps
			// i si el trobo marco
			if(dades_pendents_accio==false && BuscaValorAConsultesTipiques())
				Accio.accio|=accio_conloc;
		}
		else
		{
			dades_pendents_accio=true;
			Accio.valors=new Array(Accio.capes.length);
		}
	}
	else if(Accio.accio&accio_anar_coord || Accio.accio&accio_conloc)
	{
		if(Accio.coord==null)
		{
			alert(DonaCadenaLang({"cat":"No s'ha trobat els paràmetres 'X' i 'Y'.", 
								  "spa":"No se ha encontrado los parámetro 'X' y 'Y'.",
								  "eng":"Cannot find 'X' and 'Y' parameters.",
								  "fre":"Les paramètres 'X' et 'Y' n’ont pas été trouvés."}));
			return false;
		}
		else if(!EsPuntDinsAmbitNavegacio(Accio.coord))
		{
			alert(DonaCadenaLang({"cat":"El punt sol·licitat (x,y)="+Accio.coord.x+","+Accio.coord.y+" està fora de l'àmbit de navegació.", 
								  "spa":"El punto solicitado (x,y)="+Accio.coord.x+","+Accio.coord.y+" está fuera del ámbito de navegación.", 
								  "eng":"The requested point (x,y)="+Accio.coord.x+","+Accio.coord.y+" is outside browser envelope.",
								  "fre":"Le point requis (x,y)="+Accio.coord.x+","+Accio.coord.y+" se trouve dehors le milieu de navigation."}));
			return false;
		}
	}
	return true;
	
}//Fi de ComprovaOpcionsAccio()
 
function SimulaEventOnClickPerConloc()
{
	if(Accio && Accio.coord)
	{
		PortamAPunt(Accio.coord.x, Accio.coord.y);			
		ParamCtrl.EstatClickSobreVista="ClickConLoc";
		var event_de_click= new Object();
		
		event_de_click.clientX=DonaCoordSobreVistaDeCoordX(getLayer(window, ParamCtrl.VistaPermanent[0].nom), Accio.coord.x);
		//+ DonaOrigenEsquerraVista()-((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0);
		event_de_click.clientY=DonaCoordSobreVistaDeCoordY(getLayer(window, ParamCtrl.VistaPermanent[0].nom), Accio.coord.y);
		//+ DonaOrigenSuperiorVista() -((window.document.body.scrollTop) ? window.document.body.scrollTop : 0);					
		return event_de_click;
	}
	else
		return null;
}//Fi de SimulaEventOnClickPerConloc()

var dades_pendents_accio=false;

var ParamInternCtrl;

function DonaVistaDesDeINovaVista(i_nova_vista)
{
	if (i_nova_vista==-2) 
		return VistaImprimir;
	else if (i_nova_vista==-1 || i_nova_vista==-4)
		return ParamInternCtrl.vista;
	else
		return NovaVistaFinestra.vista[i_nova_vista];
}

function PreparaParamInternCtrl()
{
	ParamInternCtrl={"PuntOri": ParamCtrl.PuntOri,
			 		 "vista": { "EnvActual": {"MinX": 0.0, "MaxX": 0.0, "MinY": 0.0, "MaxY": 0.0},
					 			"nfil": ParamCtrl.nfil,
								"ncol": ParamCtrl.ncol,
								"CostatZoomActual": ParamCtrl.NivellZoomCostat,
								"i_vista": -1,        //index en l'array ParamCtrl.VistaPermanent[]	
								"i_nova_vista": -1},  //index en l'array NovaVistaFinestra.vista[] o -1 si és la vista principal, -2 si és la vista d'impressió, -3 si és el rodet del video i -4 si és el fotograma del video
					 "EnvLLSituacio": [],
					 "AmpleSituacio": 99,
					 "AltSituacio": 99,
					 "MargeEsqSituacio": 99,
					 "MargeSupSituacio": 99,
					 "ISituacio": ParamCtrl.ISituacioOri,
					 "LListaCRS": null,
					 "ZoomPrevi": [{"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0}, {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0},
								   {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0}, {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0},
								   {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0}, {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0},
								   {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0}, {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0},
								   {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0}, {"costat": 1, "PuntOri": {"x": 0, "y": 0}, "ISituacio": 0}],
					 "NZoomPreviUsat": 0, //10 zooms previs, 0 usats 
					 "flags": 0};

	for (var i=0; i<ParamCtrl.ImatgeSituacio.length; i++)
	{
		//Càlcul de la envolupant el·lipsoidal
		ParamInternCtrl.EnvLLSituacio[i]=DonaEnvolupantLongLat(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS, ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS);
	}

	if (ParamCtrl.CanviProjAuto==true)
		ParamInternCtrl.flags|=ara_canvi_proj_auto;

	for (var i=0; i<ParamCtrl.PlantillaDImpressio.length; i++)
	{
		plantilla_dimpressio_intern[plantilla_dimpressio_intern.length]={
					"CalImprimir": CalImprimirTitol|CalImprimirVista|CalImprimirSituacio|CalImprimirLlegenda|CalImprimirEscala,
					"RectTitol": {"esq": 0, "sup": 0, "ample": 0, "alt": 0},
					"RectVista": {"esq": 0, "sup": 0, "ample": 0, "alt": 0},
					"RectEscala": {"esq": 0, "sup": 0, "ample": 0, "alt": 0},
					"RectLlegenda": {"esq": 0, "sup": 0, "ample": 0, "alt": 0},
					"RectSituacio": {"esq": 0, "sup": 0, "ample": 0, "alt": 0},
					"LayersPropies": []};
	}
}

function EsIndexCapaEspecial(i_capa)
{
	if (i_objdigi_consulta==i_capa || i_objdigi_anar_coord==i_capa || i_objdigi_edicio==i_capa)
		return true;
	else
		return false;
}

function NumeroDeCapesEspecials(i_capa)
{
	if (i_capa==-1)  //nombre de capes total
		return ((-1!=i_objdigi_consulta)?1:0)+ ((-1!=i_objdigi_anar_coord)?1:0) +((-1!=i_objdigi_edicio)?1:0);
	else     //nombre de capes per sobre (amb index més baix que i_capa
		return ((-1!=i_objdigi_consulta && i_objdigi_consulta<i_capa )?1:0)+ ((-1!=i_objdigi_anar_coord && i_objdigi_anar_coord<i_capa )?1:0) +((-1!=i_objdigi_edicio && i_objdigi_edicio<i_capa)?1:0);
}

function AnullaCapaEspecial(i_capa)
{
	if (i_objdigi_consulta==i_capa)
		i_objdigi_consulta=-1;
	if (i_objdigi_anar_coord==i_capa)
		i_objdigi_anar_coord=-1;
	if (i_objdigi_edicio==i_capa)
		i_objdigi_edicio=-1;
}

function CanviaIndexosCapesEspecials(n_moviment, i_capa_ini, i_capa_fi_per_sota)
{
	if (typeof i_capa_fi_per_sota==="undefined")
		var i_capa_fi_per_sota=i_capa_ini+1;

	if (i_objdigi_consulta!=-1 && i_objdigi_consulta>=i_capa_ini && i_objdigi_consulta<i_capa_fi_per_sota)
		i_objdigi_consulta+=n_moviment;
	if (i_objdigi_anar_coord!=-1 && i_objdigi_anar_coord>=i_capa_ini && i_objdigi_anar_coord<i_capa_fi_per_sota)
		i_objdigi_anar_coord+=n_moviment;
	if (i_objdigi_edicio!=-1 && i_objdigi_edicio>=i_capa_ini && i_objdigi_edicio<i_capa_fi_per_sota)
		i_objdigi_edicio+=n_moviment;
}
function CreaCapesEspecials()
{
	var i_nova_capa=0;

	if (!ParamCtrl.IconaConsulta)
		ParamCtrl.IconaConsulta={"icona": "mes.gif",
 "ncol": 9,
	"nfil": 9,
 "i": 5,
 "j": 5};
	if (i_objdigi_consulta==-1)
	{
		i_objdigi_consulta=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(i_objdigi_consulta, 0, {
					"servidor": null,
					"versio": null,
					"model": model_vector,
					"nom": null,	
					"desc": null,
					"CRSgeometry": ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,
					"objectes": {
						"type": "FeatureCollection",
						"features":[{
							"id": null,
							"data": null,
							//"i_simbol": 0,
							"geometry": {
								"type": "Point",
								"coordinates": [0,0]
							},
							"properties": {},
						}]
					},
					"estil": [{
						"nom": null,
						"desc":	null,
						"DescItems": null, 
						"simbols": {
							"NomCamp": null,
							"simbol": [{"ValorCamp": null, "icona": JSON.parse(JSON.stringify(ParamCtrl.IconaConsulta)), "IconaSel": (ParamCtrl.IconaValidacio ? JSON.parse(JSON.stringify(ParamCtrl.IconaValidacio)) : null)}]
						},
						"ItemLleg": null,
						"ncol": 1					
					}],
					"i_estil": 0,
					"NColEstil": 1,
					"separa": null,
					"DescLlegenda": null, 
					"LlegDesplegada": false,
					"VisibleALaLlegenda": false,
					"visible": "no",
					"consultable": "no",
					"editable": "no",
					"FuncioEdicio": null,
					"metadades": null
				});
		CanviaIndexosCapesSpliceCapa(1, i_objdigi_consulta+1);
	}
	if (ParamCtrl.IconaEdicio && i_objdigi_edicio==-1)
	{
		i_objdigi_edicio=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(i_objdigi_edicio, 0, {
					"servidor": null,
					"versio": null,
					"model": model_vector,
					"nom": null,	
					"desc": null,
					"CRSgeometry": ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,
					"objectes": {
						"type": "FeatureCollection",
						"features": [{
							"id": null,
							"data": null,
							//"i_simbol": 0,
							"geometry": {
								"type": "Point",
								"coordinates": [0,0]
							},
							"properties": {},
						}]
					},
					"estil": [{
						"nom": null,
						"desc":	null,
						"DescItems": null, 
						"simbols": {
							"NomCamp": null,
							"simbol":[{
								"ValorCamp": null, 
								"icona": JSON.parse(JSON.stringify(ParamCtrl.IconaEdicio))
							}]
						},
						"ItemLleg":	null,
						"ncol": 1,
					}],
					"i_estil": 0,
					"NColEstil": 1,
					"separa": null,
					"DescLlegenda": null, 
					"LlegDesplegada": false,
					"VisibleALaLlegenda": false,
					"visible": "no",
					"consultable": "no",
					"editable": "no",
					"FuncioEdicio": null,
					"metadades": null
				});
		CanviaIndexosCapesSpliceCapa(1, i_objdigi_edicio+1);
	}
	if (!ParamCtrl.IconaAnarCoord)
		ParamCtrl.IconaAnarCoord={"icona": "mes.gif",
 "ncol": 9,
 "nfil": 9, "i": 5, "j": 5};
	if (i_objdigi_anar_coord==-1)
	{
		i_objdigi_anar_coord=i_nova_capa;
		i_nova_capa++;
		ParamCtrl.capa.splice(i_objdigi_anar_coord, 0, {
					"servidor": null,
					"versio": null,
					"model": model_vector,
					"nom": null,	
					"desc": null,
					"CRSgeometry": ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,
					"objectes": {
						"type": "FeatureCollection",
						"features": [{
							"id": null,
							"data": null,
							//"i_simbol": 0,
							"geometry": {
								"type": "Point",
								"coordinates": [0, 0]
							},
							"properties": {},
						}]
					},
					"estil": [{
						"nom": null,
						"desc":	null,
						"DescItems": null, 
						"simbols": {
							"NomCamp": null,
							"simbol": [{"ValorCamp": null, "icona": JSON.parse(JSON.stringify(ParamCtrl.IconaAnarCoord))}]
						},
						"ItemLleg": null,
						"ncol": 1
					}],
					"i_estil": 0,
					"NColEstil": 1,
					"separa": null,
					"DescLlegenda": null, 
					"LlegDesplegada": false,
					"VisibleALaLlegenda": false,
					"visible": "no",
					"consultable": "no",
					"editable": "no",
					"FuncioEdicio": null,
					"metadades": null
				});
		CanviaIndexosCapesSpliceCapa(1, i_objdigi_anar_coord+1);
	}

}

var ParamCtrl;

function IniciaParamCtrlIVisualitzacio(param_ctrl, param)
{
	ParamCtrl=param_ctrl; //Ho necessito aquí perquè funcioni la configuració idiomàtica en cas d'haver de preguntar.
	if (typeof Storage !== "undefined")
	{
		if (param.config_reset)
			localStorage.removeItem("EditedParamCtrl_"+param.config_json);
		var stored_param_ctrl=localStorage.getItem("StoredParamCtrl_"+param.config_json);
		var edited_param_ctrl=localStorage.getItem("EditedParamCtrl_"+param.config_json);
		var original_param_ctrl=JSON.stringify(param_ctrl);
		if (edited_param_ctrl && 
			(original_param_ctrl==stored_param_ctrl || 
			false==confirm(DonaCadenaLang({"cat": "El servidor incorpora una configuració del mapa més nova. Acceptes adoptar-la?",
							"spa": "El servidor incorpora una configuración del mapa más nueva. ¿Acepta adoptarla?",
							"eng": "The server has a newer configuration for the map. Do you accept to adopt it?",
							"fre": "Le serveur intègre une configuration de carte plus récente. Acceptez-vous de l'adopter?"}))))
			ParamCtrl=JSON.parse(edited_param_ctrl);
		else
		{
			try 
			{
				localStorage.setItem("StoredParamCtrl_"+param.config_json, original_param_ctrl);
			} 
			catch (e) 
			{
			        //localStorage.removeItem(key);
				alert(DonaCadenaLang({"cat":"No serà possible guardar l'estat del map.",
						"spa":"No será posible guardar el estado del mapa.",
						"eng":"Saving the status of the map will not possible.",
						"fre":"Il ne sera pas possible de sauvegarder le statut de la carte."}));
			}
		}
	}

	if (ParamCtrl.VersioConfigMMN.Vers!=VersioToolsMMN.Vers || 
	    ParamCtrl.VersioConfigMMN.SubVers>VersioToolsMMN.SubVers)
	{
	    alert(DonaCadenaLang({"cat": "La versió de", "spa": "La versión de", "eng": "The version of", "fre": "La version"}) +
			" config.json (" + ParamCtrl.VersioConfigMMN.Vers+"."+ParamCtrl.VersioConfigMMN.SubVers + ") " +
			DonaCadenaLang({"cat": "no es correspon amb la versió de", "spa": "no se corresponde con la versión de", "eng": "it is not according with the version of", "fre": "ne correspond pas à la version de"}) +
			" tools.htm (" + VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers + "). "+
			DonaCadenaLang({"cat": "Actualitza't correctament.", "spa": "Actualicese correctamente.", "eng": "Please, upgrade it correctly.", "fre": "S'il vous plaît, actualisez vous correctement."}));
		return;
	}
	ParamCtrl.containerName=param.div_name;
	ParamCtrl.config_json=param.config_json; 
	IniciaVisualitzacio();
}

function IniciaVisualitzacio()
{
var clau=new Array("BBOX=", "LAYERS=", "QUERY_LAYERS=", "LANGUAGE=", "CRS=" , "REQUEST=", "X=", "Y=", "BUFFER=", 
		   "TEST_LAYERS=", "TEST_FIELDS=",  "TEST_VALUES=", "SERVERTORESPONSE=", "IDTRANS=");  //"CONFIG=" es tracta abans.
var nou_env={"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0};
var nou_CRS="";
var win, i;

	document.getElementById(ParamCtrl.containerName).innerHTML="";
	if (ParamCtrl.AdrecaBaseSRC)	
		ParamCtrl.AdrecaBaseSRC=DonaAdrecaSenseBarraFinal(ParamCtrl.AdrecaBaseSRC);  //Es verifica aquí i així ja no cal versificar-ho cada cop. (JM)

	for (i=0; i<ParamCtrl.Layer.length; i++)
	{
		var l=ParamCtrl.Layer[i];
		createLayer(window, l.name, l.left, l.top, l.width, l.height, l.ancora, (l.scroll) ? l.scroll : "no", (l.visible) ? l.visible : false, (l.ev) ? l.ev : null, (l.content) ? l.content : null);
	}

	/*createMiniWinLayer("prova de caixa que es mou", //main context
				   "prova de caixa que es mou",  //titles
				   400,250,550,550, //left, topo, width, height
				   "#00CCCC", //bar colour
				   "#FFFFFF", //main colour
				   null,null,null,"tanca_consulta.gif",null,null,1,false,null,true);*/

	createFinestraLayer(window, "executarProces", {"cat":"Executar un proces (WPS)", "spa":"Ejecutar un proceso (WPS)", "eng": "Execute a process (WPS)", "fre":"Exécuter un processus (WPS)"}, boto_tancar, 400, 250, 550, 550, "nWSeCR", "ara_no", false, null, null);
	createLayer(window, "menuContextualCapa", 277, 168, 140, 140, "wC", "no", false, null, null);  //L'alt real es controla des de la funció OmpleLayerContextMenuCapa i l'ample real des de l'estil MenuContextualCapa 
	createFinestraLayer(window, "afegirCapa", {"cat":"Afegir capa al navegador", "spa":"Añadir capa al navegador", "eng": "Add layer to browser", "fre":"Rajouter couche au navigateur"}, boto_tancar, 420, 150, 520, 150, "nWSeC", "ara_no", false, null, null);
	createFinestraLayer(window, "calculadoraCapa", {"cat":"Calculadora de capes", "spa":"Calculadora de capas", "eng": "Calculator of layers", "fre":"Calculateur des couches"}, boto_tancar, 420, 150, 520, 700, "nWSeC", "ara_no", false, null, null);
	createFinestraLayer(window, "seleccioCondicional", {"cat":"Selecció per condicions", "spa":"Selección por condición", "eng": "Selection by condition", "fre":"Sélection par condition"}, boto_tancar, 320, 100, 490, 555, "NWCR", "ara_no", false, null, null);
	createFinestraLayer(window, "combinacioRGB", {"cat":"Combinació RGB", "spa":"Combinación RGB", "eng":"RGB combination", "fre":"Combinaison RVB"}, boto_tancar, 220, 90, 430, 275, "NwCR", "ara_no", false, null, null);
	createFinestraLayer(window, "editaEstil", {"cat":"Edita estil", "spa":"Editar estilo", "eng":"Edit style", "fre":"Modifier le style"}, boto_tancar, 240, 110, 430, 275, "NwCR", "ara_no", false, null, null);
	createFinestraLayer(window, "anarCoord", {"cat":"Anar a coordenada", "spa":"Ir a coordenada", "eng": "Go to coordinate","fre": "Aller à la coordonnée"}, boto_tancar, 297, 298, 250, 130, "NwCR", "no", false, null, null);
	createFinestraLayer(window, "multi_consulta",{"cat":"Consulta","spa": "Consulta", "eng": "Query", "fre":"Recherche"}, boto_tancar, 1, 243, 243, 661, "nWSe", "ara_no", false, null, null);
	createFinestraLayer(window, "param", {"cat":"Paràmetres", "spa":"Parámetros", "eng": "Parameters","fre": "Parameters"}, boto_tancar, 277, 200, 480, 320, "NwCR", "no", false, null, null);
	createFinestraLayer(window, "download", {"cat":"Descàrrega de capes", "spa":"Descarga de capas", "eng":"Layer download", "fre":"Télécharger des couches"}, boto_tancar, 190, 120, 400, 360, "NwCR", "no", false, null, null);
	createFinestraLayer(window, "video", {"cat":"Vídeo", "spa":"Vídeo", "eng":"Video", "fre":"Vidéo"}, boto_tancar, 20, 1, 900, 610, "NWCR", "no", false, null, null);
	createFinestraLayer(window, "consola", {"cat":"Consola de peticions", "spa":"Consola de peticiones", "eng": "Request console","fre": "Console de demandes"}, boto_tancar, 277, 220, 500, 300, "Nw", "ara_no", false, null, null);
	createFinestraLayer(window, "reclassificaCapa", {"cat":"Reclassificadora de capes", "spa":"Reclasificadora de capas", "eng":"Reclassifier of layers", "fre":"Reclassificateur des couches"}, boto_tancar, 250, 200, 650, 400, "Nw", "ara_no", false, null, null);
	createFinestraLayer(window, "calculaQualitat", {"cat":"Calcula la qualitat", "spa":"Calcula la calidad", "eng":"Compute the quality", "fre":"Calculer la qualité"}, boto_tancar, 250, 200, 700, 400, "Nw", "ara_no", false, null, null);
	createFinestraLayer(window, "mostraQualitat", {"cat":"Qualitat", "spa":"Calidad", "eng":"Quality", "fre":"Qualité"}, boto_tancar, 250, 200, 700, 400, "Nw", "ara_no", false, null, null);
	createFinestraLayer(window, "feedback", {"cat":"Valoracions", "spa":"Valoraciones", "eng":"Feedback", "fre":"rétroaction"}, boto_tancar, 220, 180, 500, 400, "Nw", "ara_no", false, null, null);
	createFinestraLayer(window, "enllac", {"cat":"Obrir o desar el contexte","spa":"Abrir o guardar el contexto","eng": "Open or save the context"}, boto_tancar, 650, 165, 450, 200, "NwCR", "ara_no", false, null, null);
	createFinestraLayer(window, "enllacWMS", {"cat":"Enllaços als servidors WMS del navegador", "spa":"Enlaces a los servidors WMS del navegador","eng": "Links to WMS", "fre":"Liens aux serveurs WMS du navigateur"}, boto_tancar, 650, 165, 400, 120, "NwCR", "ara_no", false, null, null);
	createFinestraLayer(window, "info", {"cat":"Informació/Ajuda", "spa":"Información/Ayuda", "eng": "Information/Help", "fre":"Information/Aide"}, boto_tancar, 420, 150, 420, 350, "nWC", "ara_no", false, null, null);
	createFinestraLayer(window, "modificaNom", {"cat":"Modifica el nom", "spa":"Modifica el nombre", "eng":"Modify the name", "fre":"Modifier le nom"}, boto_tancar, 250, 200, 600, 200, "Nw", "ara_no", false, null, null);

	if (!ParamCtrl.VistaPermanent)
		ParamCtrl.VistaPermanent=[{"nom": "vista"}]; //Això és el sistema antic, on només hi podia haver una vista. Si no m'ho especifiquen assumeixo això.

	if (ParamCtrl.CapaDigi)
	{
		alert(DonaCadenaLang({"cat": "CapaDigi ja no se suportada. Useu una \"capa\" amb \"model\": \"vector\".", 
				"spa": "CapaDigi ya no se suporta. Use una \"capa\" con \"model\": \"vector\".",
				"eng": "CapaDigi no longer supported. Use a \"capa\" with \"model\": \"vector\" instead.",
				"fre": "CapaDigi n'est plus pris en charge. Utilisez un \"capa\" avec le \"model\": \"vector\"."}));
		return;
	}
	if (ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat>ParamCtrl.zoom[0].costat)
	{
		alert(DonaCadenaLang({"cat": "Els costats de zoom han d'estat ordenats amb el més gran primer", 
				"spa": "Los lados de zoom deben estar ordenados con el más grande primero",
				"eng": "The zoom sizes must be sorted with the bigger first",
				"fre": "Les tailles de zoom doivent être triées par ordre croissant"}));
		return;
	}
	for (i=0; i<ParamCtrl.zoom.length; i++)
		if (ParamCtrl.zoom[i].costat==ParamCtrl.NivellZoomCostat)
			break;

	if (i==ParamCtrl.zoom.length)
	{
		alert(DonaCadenaLang({"cat": "El NivellZoomCostat no és cap del costats indicats a la llista de zooms", 
				"spa": "El NivellZoomCostat no es ninguno de los 'costat' indicados en la lista de zooms",
				"eng": "The NivellZoomCostat is not one of the indicated 'costat' in the zoom array",
				"fre": "Le NivellZoomCostat n'est pas l'un des 'costat' indiqués dans la matrice de zoom"}));
		return;
	}

	window.document.body.onmousemove=MovementMiraMonMapBrowser;
	window.document.body.onbeforeunload=EndMiraMonMapBrowser;
	window.document.body.onresize=ResizeMiraMonMapBrowser;

	PreparaParamInternCtrl();
	CreaCapesEspecials();

	CompletaDefinicioCapes();

	changeSizeLayers(window);
	CarregaConsultesTipiques();

	if (location.search && location.search.substring(0,1)=="?")
	{
		var kvp=location.search.substring(1, location.search.length).split("&");
		for (var i_clau=0; i_clau<clau.length; i_clau++)
		{
			for (var i_kvp=0; i_kvp<kvp.length; i_kvp++)
			{
				if (kvp[i_kvp].substring(0, clau[i_clau].length).toUpperCase()==clau[i_clau])
				{
					var valor=unescape(kvp[i_kvp].substring(clau[i_clau].length,kvp[i_kvp].length));
					if (i_clau==0)  //BBOX
					{
						var coord=valor.split(",");
						if (coord.length!=4)
						{
							alert(DonaCadenaLang({"cat":"No trobo les 4 coordenades a BBOX=", "spa":"No encuentro las 4 coordenadas en BBOX=", "eng":"Cannot find 4 coordinates at BBOX=", "fre":"Impossible de trouver les 4 coordonnées à BBOX="}));
							break;
						}
						//Cal carregar les 4 coordenades i fer el canvi d'àmbit
						nou_env.MinX=parseFloat(coord[0]); 
						nou_env.MaxX=parseFloat(coord[2]); 
						nou_env.MinY=parseFloat(coord[1]);
						nou_env.MaxY=parseFloat(coord[3]);
					}
					else if (i_clau==1)  //LAYERS
					{
						//Declaro totes les capes com a ara no visibles.
						for (var i=0; i<ParamCtrl.capa.length; i++)
						{
							if (ParamCtrl.capa[i].visible=="si" || ParamCtrl.capa[i].visible=="semitransparent")
								CanviaEstatVisibleISiCalDescarregableCapa(i, "ara_no");
							if (ParamCtrl.capa[i].descarregable=="si")
								ParamCtrl.capa[i].descarregable="ara_no";
						}
						//Declaro visibles les que m'han dit.
						var capa_visible=valor.split(",");
						var tinc_estils=false;
						for (var i_kvp2=0; i_kvp2<kvp.length; i_kvp2++)
						{
							if (kvp[i_kvp2].substring(0, 7).toUpperCase()=="STYLES=")
							{
								var valor2=unescape(kvp[i_kvp2].substring(7,kvp[i_kvp2].length));
								var capa_estil=valor2.split(",");
								if (capa_visible.length==capa_estil.length)
									tinc_estils=true;
								else
									alert(DonaCadenaLang({"cat":"El nombre d\'estils no es correspon amb el nombre de capes.", 
														 "spa":"El número de estilos no se corresponde con el número de capas.",
														 "eng":"Style number is no the same of the number of layers.", 
														 "fre":"Le nombre de styles ne correspond pas au nombre de couches."}));
							}
						}
						for (var j=0; j<capa_visible.length; j++)
						{
							for (var i=0; i<capa.length; i++)
							{
								if (capa_visible[j]==ParamCtrl.capa[i].nom)
								{
									if (ParamCtrl.capa[i].visible=="ara_no")
										CanviaEstatVisibleISiCalDescarregableCapa(i, "si");
									else
										alert(DonaCadenaLang({"cat":"La capa ", "spa":"La capa ", "eng":"Layer ", "fre":"La couche "}) + capa_visible[j] + 
												DonaCadenaLang({"cat":" indicada a LAYERS= no pot ser activada.", "spa":" indicada en LAYERS= no puede ser activada.", 
															   "eng":" indicated at LAYERS= cannot be activaded.", "fre":" indiquée à LAYERS= ne peut pas être activée."}));
									if (tinc_estils)
									{
										if (ParamCtrl.capa[i].estil && ParamCtrl.capa[i].estil.length>1)
										{
											//Si a la part del final posa ":SEMITRANSPARENT"
											if (capa_estil[j].toUpperCase()=="SEMITRANSPARENT")
											{
												if (ParamCtrl.capa[i].visible!="no")
													CanviaEstatVisibleISiCalDescarregableCapa(i, "semitransparent");
											}
											else
											{
												if (capa_estil[j].length>16 && capa_estil[j].substring(capa_estil[j].length-16, capa_estil[j].length).toUpperCase()==":SEMITRANSPARENT")
												{
													if (ParamCtrl.capa[i].visible!="no")
														CanviaEstatVisibleISiCalDescarregableCapa(i, "semitransparent");
													capa_estil[j]=capa_estil[j].substring(0, capa_estil[j].length-16);
												}
												for (i_estil=0; i_estil<ParamCtrl.capa[i].estil.length; i_estil++)
												{													
													if (ParamCtrl.capa[i].estil[i_estil].nom==capa_estil[j])
													{
														ParamCtrl.capa[i].i_estil=i_estil;
														break;
													}
													
												}
												if (i_estil==ParamCtrl.capa[i].estil.length)
												{
													if (capa_estil[j]!=null && capa_estil[j]!="")  //si es blanc vol dir estil per defecte													
														alert(DonaCadenaLang({"cat":"No trobo l\'estil ", "spa":"No encuentro el estilo ", "eng":"Cannot find style ", "fre":"Impossible trouver le style "}) + capa_estil[j] + DonaCadenaLang({"cat":" per a la capa ", "spa":" para la capa ", "eng":" for the layer ", "fre":" pour cette couche "}) + capa_visible[j]);
														
												}
											}
										}
										else
										{
											//Només pot dir semitransparent.
											if (capa_estil[j].toUpperCase()=="SEMITRANSPARENT")
											{
												if (ParamCtrl.capa[i].visible!="no")
													CanviaEstatVisibleISiCalDescarregableCapa(i, "semitransparent");

											}
											else
											{
												if (capa_estil[j]!=null && capa_estil[j]!="")													
													alert(DonaCadenaLang({"cat":"No trobo l\'estil ", "spa":"No encuentro el estilo ", "eng":"Cannot find style ", "fre":"Impossible trouver le style "}) + capa_estil[j] + 
														DonaCadenaLang({"cat":" per a la capa ", "spa":" para la capa ", "eng":" for the layer ", "fre":" pour cette couche "}) + capa_visible[j]);
											}
										}
									}
									if (ParamCtrl.capa[i].descarregable=="ara_no")
										ParamCtrl.capa[i].descarregable="si";
									break;
								}
							}
							if (i==ParamCtrl.capa.length)
								alert(DonaCadenaLang({"cat":"No trobo la capa ", "spa":"No encuentro la capa ", "eng":"Cannot find layer ","fre":"Impossible trouver la couche "}) + capa_visible[j] + 
										DonaCadenaLang({"cat":" indicada a LAYERS=", "spa":" indicada en LAYERS=", "eng":" indicated at LAYERS=", "fre":" indiquée à LAYERS="}));
						}
					    //CreaVistes();
						//CreaLlegenda();
					}
					else if (i_clau==2)  //QUERY_LAYERS
					{
						//Declaro totes les capes com a ara no consultables.
						for (var i=0; i<ParamCtrl.capa.length; i++)
						{
							if (ParamCtrl.capa[i].consultable=="si")
								ParamCtrl.capa[i].consultable="ara_no";
						}
						//Declaro consultables les que m'han dit.
						var capa_visible=valor.split(",");
						for (var j=0; j<capa_visible.length; j++)
						{
							for (var i=0; i<ParamCtrl.capa.length; i++)
							{
								if (capa_visible[j]==ParamCtrl.capa[i].nom)
								{
									if (ParamCtrl.capa[i].consultable=="ara_no")
										ParamCtrl.capa[i].consultable="si";
									else
										alert(DonaCadenaLang({"cat":"La capa ", "spa":"La capa ", "eng":"Layer ", "fre":"La couche "}) + capa_visible[j] + 
											  DonaCadenaLang({"cat":" indicada a QUERY_LAYERS= no pot ser activada.", "spa":" indicada en QUERY_LAYERS= no puede ser activada.", "eng":" indicated at QUERY_LAYERS= cannot be activaded.", "fre":" indiquée à QUERY_LAYERS= ne peut pas être activée."}));
									break;
								}
							}
							if (i==ParamCtrl.capa.length)
								alert(DonaCadenaLang({"cat":"No trobo la capa ", "spa":"No encuentro la capa ", "eng":"Cannot find layer ", "fre":"Impossible trouver la couche "}) + capa_visible[j] + 
									  DonaCadenaLang({"cat":" indicada a QUERY_LAYERS=", "spa":" indicada en QUERY_LAYERS=", "eng":" indicated at QUERY_LAYERS=", "fre":" indiquée à QUERY_LAYERS="}));
						}
					        //CreaVistes();
						//CreaLlegenda();
					}
					else if (i_clau==3)  //LANGUAGE
					{
						//CanviaIdioma(valor);
						ParamCtrl.idioma=valor.toLowerCase();
					}
					else if (i_clau==4)  //CRS
						nou_CRS=valor;
					else if(i_clau==5)// REQUEST
					{
						if(valor.toLowerCase()=="validaatributscoord")
						{
							if(Accio==null)
								Accio=new CreaAccio(accio_validacio, null, null, 0, null, null, null, null, false);
							else
								Accio.accio=accio_validacio;
						}
						else if(valor.toLowerCase()=="anarcoord")
						{
							if(Accio==null)
								Accio=new CreaAccio(accio_anar_coord, null, null, 0, null, null, null, null, false);
							else
								Accio.accio=accio_anar_coord;
						}
						else if(valor.toLowerCase()=="consultaperlocalitzacio")
						{
							if(Accio==null)
								Accio=new CreaAccio(accio_conloc, null, null, 0, null, null, null, null, false);
							else
								Accio.accio=accio_conloc;
						}
					}
					else if(i_clau==6) //X=
					{
						if(Accio==null)
							Accio=new CreaAccio(null, null, {"x": parseFloat(valor), "y": 0}, 0, null, null, null, null, false);
						else
						{
							if(Accio.coord==null)							
								Accio.coord={"x": parseFloat(valor), "y": 0};
							else
								Accio.coord.x=parseFloat(valor);
						}
					}
					else if(i_clau==7) //Y=
					{
						if(Accio==null)
							Accio=new CreaAccio(null, null, {"x": 0, "y": parseFloat(valor)}, 0, null, null, null, null, false);								
						else
						{
							if(Accio.coord==null)
								Accio.coord={"x": 0, "y": parseFloat(valor)};
							else
								Accio.coord.y=parseFloat(valor);
						}

					}
					else if(i_clau==8) //BUFFER
					{
						if(Accio==null)
							Accio=new CreaAccio(null,null, null, parseFloat(valor), null, null, null, null,false);
						else
							Accio.buffer=parseFloat(valor);
					}
					else if(i_clau==9)//TEST_LAYERS
					{
						if(Accio==null)
							Accio=new CreaAccio(null,null, null, 0, valor.split(","), null, null, null,false);
						else
							Accio.capes=valor.split(",");
					}
					else if(i_clau==10)//TEST_FIELDS
					{
						if(Accio==null)
							Accio=new CreaAccio(null, null, null, 0, null, valor.split(","), null, null, false);
						else
							Accio.camps=valor.split(",")
					}
					else if(i_clau==11)//TEST_VALUES
					{
						if(Accio==null)
							Accio=new CreaAccio(null, null, null, 0, null, null, valor.split(","), null, false);
						else
							Accio.valors=valor.split(",")
					}
					else if(i_clau==12) //SERVERTORESPONSE
					{
						if(Accio==null)
							Accio=new CreaAccio(null, valor, null, 0, null, null, null, null, false);
						else
							Accio.servidor=valor;
					}
					else if(i_clau==13)//IDTRANS
					{
						if(Accio==null)
							Accio=new CreaAccio(null, null, null, 0, null, null, null, valor, false);
						else
							Accio.id_trans=valor;
					}
					//Ara els altres paràmetres.
					break;
				}
			}
		}
	}
	if(Accio && NCapesCTipica < capa_consulta_tipica_intern.length)
		dades_pendents_accio=true;
	
	if (nou_env.MinX!=0.0 || nou_env.MaxX!=0.0 || nou_env.MinY!=0.0 || nou_env.MaxY!=0.0)
	{
		
		if (nou_CRS!="")
			EstableixNouCRSEnv(nou_CRS, nou_env);
		CanviaIdioma(ParamCtrl.idioma);
		PortamAAmbit(nou_env);		
	}
	else
	{
		RevisaEstatsCapes();
		CanviaIdioma(ParamCtrl.idioma);
		RepintaMapesIVistes();
	}		
	document.body.bgColor=ParamCtrl.ColorFonsPlana;		
	if(Accio && ComprovaOpcionsAccio())
	{			
		if(Accio.accio&accio_validacio || Accio.accio&accio_conloc)
		{
			//Haig de tornar a fer un CreaLLegenda() perquè he tocat l'estat de les capes
			CreaLlegenda();
			if(dades_pendents_accio==false)
			{
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
										"fre":"Utilisez les outils du navigateur pour vous placer sur la vue.\n Ensuite cliquez sur la vue pour déterminer la coordonné\n et l'information du point à valider.\nFinalement, pressez [Valider Coordonnée] où [Annuler] de la fenêtre de validation."})); 				
					Accio.coord={"x": 0, "y": 0};
				}
			}
			FormAnarCoord={"proj": true,
					"x": ParamInternCtrl.PuntOri.x, 
					"y": ParamInternCtrl.PuntOri.y, 
					"m_voltant": ParamInternCtrl.vista.CostatZoomActual};
		}
		else if(Accio.accio&accio_anar_coord)
		{
			dades_pendents_accio=false;
			FormAnarCoord={"proj": true,
					"x": Accio.coord.x, 
					"y": Accio.coord.y, 
					"m_voltant": Accio.buffer};
			MostraFinestraAnarCoordenada();
			var formulari=getLayer(window, "anarCoord_finestra").getElementsByTagName("form")[0];
			if(formulari)
				AnarACoordenada(formulari);			
		}
	}
	else
	{
		if(Accio)
		{
			if(Accio.accio&accio_validacio)			
				EnviarRespostaAccioValidacio(false);
			Accio=null;
			dades_pendents_accio=false;
			CreaBarra(null);			
		}
		FormAnarCoord={"proj": true,
					"x": ParamInternCtrl.PuntOri.x, 
					"y": ParamInternCtrl.PuntOri.y,
					"m_voltant": ParamInternCtrl.vista.CostatZoomActual};
	}	
	/* Mogut a la propia caixa
		loadJSON("serv_ows.json",
			function(llista_serv_OWS) { LlistaServOWS=llista_serv_OWS; },
			function(xhr) { alert(xhr); });*/

}//Fi de IniciaVisualitzacio()

function ResizeMiraMonMapBrowser()
{
	setTimeout(ChangeSizeMiraMonMapBrowser,200);
}

function EndMiraMonMapBrowser(event, reset)
{
	/*if (ParametresWindow!=null)
	{
		ParametresWindow.close();
		ParametresWindow=null;
	}*/

	if (TriaFullWindow!=null)
	{
		TriaFullWindow.close();
		TriaFullWindow=null;
	}
	if (AjudaWindow!=null)
	{
		AjudaWindow.close();
		AjudaWindow=null;
	}
	if (ConsultaWindow!=null)
	{
		ConsultaWindow.close();
		ConsultaWindow=null;
	}
	if (MMZWindow!=null)
	{
		MMZWindow.close();
		MMZWindow=null;
	}

	if (typeof Storage !== "undefined")  //https://arty.name/localstorage.html
	{
		ParamCtrl.NivellZoomCostat=ParamInternCtrl.vista.CostatZoomActual;  //Recupero el costat de zoom actual

		//Buido les coses grans que he afegit al ParamCtrl abans de guardar la configuració.
		//De fet, tots les elements documentats com "INTERN" al config-schema s'haurien d'esborrar.
		for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
		{
			if (EsIndexCapaEspecial(i_capa))
			{
				//Esborro la capa calladament:				
				ParamCtrl.capa.splice(i_capa, 1);
				AnullaCapaEspecial(i_capa);
				CanviaIndexosCapesSpliceCapa(-1, i_capa, ParamCtrl.capa.length);
				i_capa--;
				continue;
			}
			var capa=ParamCtrl.capa[i_capa];
			BuidaArrayBufferCapa(capa);
			//Buida objectes vectorials si han vingut d'un servidor.
			if (capa.model==model_vector && (capa.tipus=="TipusWFS" || capa.tipus=="TipusSOS"))
				delete capa.objectes; 
			DescarregaSimbolsCapaDigi(capa);
			if (capa.TileMatrixGeometry)
			{
				if(capa.TileMatrixGeometry.tiles_solicitats)
					delete capa.TileMatrixGeometry.tiles_solicitats;
				if(capa.TileMatrixGeometry.env)
					delete capa.TileMatrixGeometry.env;
			}
		}

		if (reset)
			localStorage.removeItem("EditedParamCtrl_"+ParamCtrl.config_json);
		else
		{
			try 
			{			
				//Només Internet explorer suporta un missatge de confirmació tipus confirm o alert en aquest punt.
				/*if (confirm(DonaCadenaLang({"cat": "Aceptes guardar l'estat del mapa?. (Per recuperar l'estat original afegiu a la URL:",
								"spa": "¿Acepta guardar el estado del mapa? (Para recuperar el estado original añada a la URL:",
								"eng": "Do you accept to save the status of the map? (To recover the original status add to the URL:",
								"fre": "Acceptez-vous de sauvegarder l’état de la carte? (Pour restaurer l'état d'origine, ajoutez à l'URL:"})+" \"?reset=1\")"))*/
					localStorage.setItem("EditedParamCtrl_"+ParamCtrl.config_json, JSON.stringify(ParamCtrl));
			} 
			catch (e) 
			{
			        ;//localStorage.removeItem(key);
				/*alert(DonaCadenaLang({"cat":"No ha estat possible guardar estat del map.",
							"spa":"No ha sido posible guardar el estado del mapa.",
							"eng":"Saving the map status done was not possible.",
							"fre":"Il n’a pas été possible de sauvegarder le statut de la carte."}));*/
			}
		}
	}

	layerList=[];
	ParamInternCtrl={};
	
	/*return DonaCadenaLang({"cat": "Estat del mapa guardat.(Per recuperar l'estat original afegiu a la URL:",
					"spa": "Estado del mapa guardado. (Para recuperar el estado original añada a la URL:",
					"eng": "Map status saved (To recover the original status add to the URL:",
					"fre": "Statut de la carte enregistré (Pour restaurer l'état d'origine, ajoutez à l'URL:"})+" \"?reset=1\")";*/
}

function StartMiraMonMapBrowser(div_name)
{
var config_json="config.json", config_reset=false;
var clau_config="CONFIG=", clau_reset="RESET=";

	if (location.search && location.search.substring(0,1)=="?")
	{
		var kvp=location.search.substring(1, location.search.length).split("&");
		for (var i_kvp=0; i_kvp<kvp.length; i_kvp++)
		{
			if (kvp[i_kvp].substring(0, clau_config.length).toUpperCase()==clau_config)
				config_json=unescape(kvp[i_kvp].substring(clau_config.length,kvp[i_kvp].length));
			else if (kvp[i_kvp].substring(0, clau_reset.length).toUpperCase()==clau_reset)
				config_reset=unescape(kvp[i_kvp].substring(clau_reset.length,kvp[i_kvp].length));
		}
	}
	loadJSON(config_json,
			IniciaParamCtrlIVisualitzacio,
			function(xhr) { alert(xhr); },
			{div_name:div_name, config_json:config_json, config_reset: config_reset});
}

function RestartMiraMonMapBrowser()
{
	//location.href=DonaCadena(ParamCtrl.PlanaPrincipal);	
	EndMiraMonMapBrowser(null, true);
	StartMiraMonMapBrowser(ParamCtrl.containerName);
}

function MovementMiraMonMapBrowser(event)
{
	if (!layerFinestraList || iFinestraLayerFora>=layerFinestraList.length)
		iFinestraLayerFora=-1;
	if (iFinestraLayerFora!=-1)
		MouFinestraLayer(event, iFinestraLayerFora);
}
