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

/////////////////////////////////////////////

"use strict"

/////////////////////////////////////////////
/*Cross browser compatibility functions*/

/**  FUNCIO ELIMINADA, useu: DonamElementsNodeAPartirDelNomDelTag() de NJ
 * Cross browser function to get elements by tag name, properly handling
 * namespaces.
 * @param {Element} thisElement
 * @param {string} namespace
 * @param {string} name
 * @returns {Element}
function compatGetElementsByTag(thisElement,namespace,name)
{
	if(!thisElement.getElementsByTagNameNS)
	{
		//This compatibility issue is for IE8 and below
		if(namespace && namespace!=="" && namespace!=="*")
		{
			try
			{
				return thisElement.getElementsByTagName(namespace+":"+name);
			}
			catch(e)
			{
				//else try without namespace...	
			}
		}
		return thisElement.getElementsByTagName(name);
	}
	else //DOM2 Standard compliant:
	{
		//var elem= thisElement.getElementsByTagNameNS(namespace,name);
		//if(elem && elem.length>0)
		//	return elem;
		namespace= "*"; //Hotfix as the line above seems not to work for owc:offering for example
		return thisElement.getElementsByTagNameNS(namespace,name);
	}
}*/

// Creada per NJ i modificada per JM
// uri_ns pot ser null. nom_ns pot ser "*"
// Retorna una array de totes els nodes a qualsevol nivell del arbre que compleixen amb el nom. És lenta
// Useu GetXMLChildElementByName(), sempre que sigui possible, per nodes immediatament fills del node actual.
function DonamElementsNodeAPartirDelNomDelTag(pare, uri_ns, nom_ns, nom_tag)
{
	//NJ_03_11_2016: Segons el navegador el comportament de getElementsByTagName i
	//de getElementsByTagNameNS és diferent
	//En Mozilla a getElementsByTagNameNS cal indicar la URI del ns i el nom del tag en d'altres és el nom del ns i el nom del tag 
	//Per getElementsByTagName() en Opera i Chrome no funciona si indiquem el id del ns, és a dir, ns:name no va
	//En IE depen de la versió. En Motzilla en principi funciona amb ns:name, però crec que també depen de la versió
	//Recomano usar aquesta funció que provarà les diferents possibilitats i així és menys probable tenir problemes

	if (pare.getElementsByTagNameNS)
	{
		if (uri_ns)
		{
			var fills=pare.getElementsByTagNameNS(uri_ns, nom_tag); //Mozilla
			if(fills && fills.length>0)
				return fills;
		}
		var fills2=pare.getElementsByTagNameNS(nom_ns, nom_tag); //La resta			
		if(fills2 && fills2.length>0)
			return fills2;
	}
	var fills3=pare.getElementsByTagName(nom_ns+":"+nom_tag); //IE, Mozilla segons versions
	if(fills3 && fills3.length>0)
		return fills3;
		
	var fills4=pare.getElementsByTagName(nom_tag); //sense namespace
	if(fills4 && fills4.length>0)
		return fills4;

	if (pare.getElementsByTagNameNS)  //Incorporo a la funció de NJ aquest truc suggerit per DD i esborro compatGetElementsByTag() que havia fet el darrer (JM) 19-08-2017
	{
		var fills5=pare.getElementsByTagNameNS("*",nom_tag); //amb qualsevol namespace
		if (fills5 && fills5.length>0)
			return fills5;
	}

	return null;
}

/*
 * Returns first tag appearance Text node value or null if it is not found.
 * @param {Element} thisElement
 * @param {string} namespace
 * @param {string} name
 * @returns {Number}
 */
function MMgetElementTextByTag(thisElement,namespace,name)
{
	//var tags= compatGetElementsByTag(thisElement,namespace,name);
	var tags=DonamElementsNodeAPartirDelNomDelTag(thisElement, null, namespace,name);
	
	if(tags && tags.length && tags[0].firstChild)
		return tags[0].firstChild.nodeValue;
	return null;
}

/*
 * Returns the currently checked button in the form passed as a first argument
 * which is part of the radioButton group 'buttonName', which corresponds
 * to the 'name' attribute value of the input button.
 * @param {DOMFormElement} myForm
 * @param {string} groupName
 * @returns {DOMInputElement}
 */
function MMgetCheckedRadioButton(form,buttonName)
{
	var radios= form.getElementsByTagName("input");
	for (var i=0;i<radios.length;i++)
	{
		if(radios[i].type==="radio" && radios[i].name===buttonName && radios[i].checked)
			return radios[i];
	}
	return null;
}

/*
 * Returns True if the variable is an string constant or an instance of an
 * String class. Otherwise, returns false.
 * @param {Object} thisVariable
 * @returns {boolean}
No usada.
function MMisString(thisVariable) 
{
	return typeof thisVariable==="string" || thisVariable instanceof String;
}
*/

//IE8 and lower compatibility for addEventListener
if(!window.addEventListener)
{
	//window.prototype.addEventListener= function(eventName,eventFunction,nonSupportedArgument) { Prototypes not supported...
	window.addEventListener= function(eventName,eventFunction,nonSupportedArgument) {
		return window.document.body.attachEvent("on"+eventName,eventFunction);
	};
	//window.prototype.removeEventListener= function(eventName,eventFunction,nonSupportedArgument) {
	window.removeEventListener= function(eventName,eventFunction,nonSupportedArgument) {
		return window.document.body.detachEvent("on"+eventName,eventFunction);
	};
}

//IE8 and lower compatibility for Array.indexOf()
if(!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function (obj, fromIndex) {
		if (fromIndex == null) {
			fromIndex = 0;
		} 
		else if (fromIndex < 0) {
	        	fromIndex = Math.max(0, this.length + fromIndex);
		}
		for (var i = fromIndex, j = this.length; i < j; i++) {
		        if (this[i] === obj)
            			return i;
		}
		return -1;
  	};
}

//IE11 and other old browsers for Array.find() (based on Array.filter() that has much better support). https://www.w3schools.com/js/js_array_iteration.asp
if(!Array.prototype.find)
{
	Array.prototype.find = function (myFunction) {
		try
		{						
			var x=this.filter(myFunction);
			if (x.length>0)
				return x[0];
		}
		catch(ex)
		{								
			// En funció de la versió potser que no existeixi la funció find()
			for (var i=0; i<this.length; i++)
			{
				if (myFunction(this[i]))
					return this[i];
			}
		}
  	};
}

/*
 * Binary search (bsearch) in a sorted array (from https://oli.me.uk/2013/06/08/searching-javascript-arrays-with-a-binary-search   http://jsfiddle.net/aryzhov/pkfst550/
 * Returns 
      * the index of the element in a sorted array that is iqual to 'elem' (see the note if there are more than one)
      * (-n-1) where n is the insertion point for the new element.  E.g. -5 means "insert in i=4" to keep the array sorted, a.k.a "insert between 3 and 4".
 * Parameters:
 *     elem - An element to search for
 *     compare_fn - A comparator function in the same way that Array.sort() wants it: The function takes two arguments: (elem, b) and returns:
 *        a negative number  if a is less than b;
 *        0 if a is equal to b;
 *        a positive number of a is greater than b.
 * Note: The array may contain duplicate elements. 
 * If there are more than one equal elements in the array, the returned value can be the index of any one of the equal elements.
 */

if(!Array.prototype.binarySearch)
{
	Array.prototype.binarySearch = function (elem, compare_fn) {
		var m = 0;
		var n = this.length - 1;
		while (m <= n) {
        		var k = (n + m) >> 1;
		        var cmp = compare_fn(elem, this[k]);
	        	if (cmp > 0) {
				m = k + 1;
	        	} else if(cmp < 0) {
				n = k - 1;
		        } else {
				return k;
		        }
		}
		return -m - 1;
	}
}

function sortAscendingStringSensible(a, b)
{
	return ((a < b) ? -1 : ((a > b) ? 1 : 0));		
}

function sortAscendingStringInsensible(a, b)
{
	a = a.toLowerCase();
    b = b.toLowerCase();
   	return ((a < b) ? -1 : ((a > b) ? 1 : 0));		
}

function sortAscendingNumber(a, b)
{
	return a - b;
}

//Posa els nulls i undefined al final de la lista ordenada
function sortAscendingNumberNull(a, b)
{
	if (!a && a!=0 && !b && b!=0)
		return 0;
	if (!a && a!=0)
		return 1;
	if (!b && b!=0)
		return -1;
	return a - b;
}


/* Eliminada. Useu array.removeDuplicates() en el seu lloc
function EliminaRepeticionsArray(llista, funcio_ordena)
{
	for (var i=0; i+1<llista.length;)
	{
		if (0==funcio_ordena(llista[i], llista[i+1]))
			llista.splice(i+1, 1);
		else
			i++;
	}
}
*/

if(!Array.prototype.removeDuplicates)
{
	Array.prototype.removeDuplicates = function (compare_fn) {
		for (var i=0; i+1<this.length; i++)
		{
			var n=0;
			while (i+n+1<this.length && 0==compare_fn(this[i], this[i+n+1]))
				n++;	
			if (n)
				this.splice(i+1, n);
		}
		return this;
	}
}


/*Trim actual com DonaCadenaSenseEspaisDavantDarrera() i per tant no creem cap funció per fer-ho. Useu .trim()
IE8 compatibility for trim*/
if(!String.prototype.trim)
{
	String.prototype.trim= function() {
		var llav= this.toString();
		while (llav.substring(0,1)==" ")
			llav=llav.substring(1,llav.length);
		while (llav.substring(llav.length-1, llav.length)==" ")
			llav=llav.substring(0,llav.length-1);
		return llav;
	};
}


/*Older versions of IE will crash when trying to use console.log to debug and
 * the console window (debug tools) is not open.
 * This small hack fix it so even if the console do not exist, it will not crash.
 */
if(!window.console)
{
	window.console= {
		log: function() {},
		info: function() {},
		warn: function() {},
		debug: function() {},
		error: function(t) { alert("ERROR: "+t); }
		};
}


/*Funcions d'utilitat general inspirades en codis trobats a la Internet*/

function create_UUID(guions){
	// Codi inspirat en https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
    var dt = new Date().getTime();
	var patro= guions ? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' : 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx';
    var uuid = patro.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function MMgetFileExtension(fileName)
{
	var re= /(?:\.([^.]+))?$/;
	return re.exec(fileName)[1];
}

function DonaAdrecaSenseBarraFinal(s)
{
	if (s.charAt(s.length-1)=="/" || s.charAt(s.length-1)=="\\")
		return s.substring(0,s.length-1);
	return s;
}

function AfegeixAdrecaBaseSRC(s)
{
	if (ParamCtrl.AdrecaBaseSRC)
		return ParamCtrl.AdrecaBaseSRC+"/"+s;
	return s;
}

function TreuAdreca(s)
{
	var i=s.lastIndexOf("/");
	if (i==-1)
		return s;
	return s.substring(i+1);
}

function DonaExtensioFitxerSensePunt(s)
{
	var i=s.lastIndexOf(".");
	if(i==-1)
		return "";
	return s.substring(i+1);
}



/*
 * Returns the currently selected button of the group with name 'groupName' in
 * the 'myForm' form. In case there is no radio button with that name, or
 * none is checked, it returns null.
 * @param {DOMForm} myForm
 * @param {string} groupName
 * @returns {DOMRadioButton}
 */
function MMgetCheckedRadioButton(myForm,groupName)
{
	var group= myForm.elements;

	for (var i=0;i<group.length;i++)
		if(group[i].name===groupName && group[i].checked)
			return group[i];

	return null;
}

//Inspired in http://stackoverflow.com/questions/126100/how-to-efficiently-count-the-number-of-keys-properties-of-an-object-in-javascrip
function CountPropertiesOfObject(myobj)
{
var count = 0, k;
	for (k in myobj) if (myobj.hasOwnProperty(k)) count++;
	return count;
}

/*Funcions d'utilitat general inspirades en codis trobats a la Internet*/

var layerList = [];
var layerFinestraList = [];
var focusedFloatingWindow=-1; //This is the floating window that last got focus (so it must be on the top) -1==no focused fWindow
var JaAvisatSuportLayers=false;

/* Aquest constructor no s'usa i es deia només com a documentació del JSON.
function CreaPropietatsLayer(nom, ancora, contingut)
{
	this.nom=nom;
	this.ancora=ancora;
	this.contingut=contingut;
}*/

function showOrHideLayer(elem, show)
{
	if (show)
		showLayer(elem);
	else
		hideLayer(elem);
}

function removeLayer(elem) 
{
	var elem_pare=elem.parentNode;
	if (!elem_pare)
		return;
	elem_pare.removeChild(elem);
	if (NecessariLayerIFrame)
	{
		 var elem_iframe=elem_pare.getElementById("iframe_"+elem.id);
		 if (elem_iframe)  
			 elem_pare.removeChild(elem_iframe);
	}
}

function hideLayer(elem) 
{
	elem.style.visibility = "hidden";	
	if (NecessariLayerIFrame)
	{		 
		 var elem_iframe=elem.ownerDocument.getElementById("iframe_"+elem.id);
		 if (elem_iframe)  //Problema IE6
		     elem_iframe.style.visibility = "hidden";
	}
}

function showLayer(elem) 
{
  	elem.style.visibility = "visible";
	
	if (NecessariLayerIFrame)
	{		 
		 var elem_iframe=elem.ownerDocument.getElementById("iframe_"+elem.id);
		 if (elem_iframe)  //Problema IE6
		     elem_iframe.style.visibility = "visible";
	}
}

function semitransparentLayer(elem)
{
	elem.style.opacity = 0.5;
}

function semitransparentThisNomLayer(nom)
{
	semitransparentLayer(getLayer(window, nom));
}

function opacLayer(elem)
{
	elem.style.opacity = 1.0;
}

function isLayerVisible(elem)
{
	if (elem.style.visibility == "hidden")
		return false;
	else
		return true;
}

// Extret de http://www.faqts.com/knowledge_base/view.phtml/aid/5756
// insertAdjacentHTML(), insertAdjacentText() and insertAdjacentElement()
// for Netscape 6/Mozilla by Thor Larholm me@jscript.dk
// Usage: include this code segment at the beginning of your document
// before any other Javascript contents.

if(typeof HTMLElement!="undefined" && !
HTMLElement.prototype.insertAdjacentElement){
	HTMLElement.prototype.insertAdjacentElement = function(where,parsedNode)
	{
		switch (where){
		case 'beforeBegin':
			this.parentNode.insertBefore(parsedNode,this)
			break;
		case 'afterBegin':
			this.insertBefore(parsedNode,this.firstChild);
			break;
		case 'beforeEnd':
			this.appendChild(parsedNode);
			break;
		case 'afterEnd':
			if (this.nextSibling) 
				this.parentNode.insertBefore(parsedNode,this.nextSibling);
			else 
				this.parentNode.appendChild(parsedNode);
			break;
		}
	}

	HTMLElement.prototype.insertAdjacentHTML = function(where,htmlStr)
	{
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var parsedHTML = r.createContextualFragment(htmlStr);
		this.insertAdjacentElement(where,parsedHTML)
	}


	HTMLElement.prototype.insertAdjacentText = function(where,txtStr)
	{
		var parsedText = document.createTextNode(txtStr)
		this.insertAdjacentElement(where,parsedText)
	}
}

//where can be: 'beforebegin' Before the element itself. 'afterbegin' Just inside the element, before its first child. 'beforeend' Just inside the element, after its last child.'afterend': After the element itself.
function insertContentLayer(elem_pare, where, content)
{
	elem_pare.insertAdjacentHTML(where, content);
}

function contentLayer(elem, content) 
{
	elem.innerHTML = content;
}

function getContentLayer(elem)
{
	return elem.innerHTML;
}

//Si alguna de les x, y, w, h són -1, no es canvia aquesta dimensió.
function moveLayer(elem, x, y, w, h)
{
	//Ara ho manipulo i ho canvio.
	var estil=elem.style;
	if (x!=-1)
		estil.left = x;
	if (y!=-1)
		estil.top = y;
	if (w!=-1)
		estil.width = w;
	if (h!=-1)
		estil.height = h;
}

function changePosAndShowLayer(elem, x, y)
{
	var estil=elem.style;
	estil.left = x;
	estil.top = y;
     	estil.visibility = "visible";
	if (NecessariLayerIFrame)
	{		 
		 var elem_iframe=elem.ownerDocument.getElementById("iframe_"+elem.id);
		 if (elem_iframe)  //Problema IE6
		     elem_iframe.style.visibility = "visible";
	}
}


function moveLayer2(elem, x1, y1, x2, y2)
{
var x,y,w,h;
  if (x1<x2)
  {
	x=x1;
	w=x2-x1+1;
  }
  else
  {
	x=x2;
	w=x1-x2+1;
  }
  if (w<2)
	w=2;
  if (y1<y2)
  {
	y=y1;
	h=y2-y1+1;
  }
  else
  {
	y=y2;
	h=y1-y2+1;
  }
  if (h<2)
	h=2;
  moveLayer(elem, x, y, w, h);
}

function clipLayer2(elem,x1,y1,x2,y2)
{
   	elem.style.clip="rect("+y1+"px "+x2+"px "+y2+"px "+x1+"px)";
}

function clipLayer(elem,x,y,w,h)
{
	clipLayer2(elem,x,y,x+w,y+h);
}

function borderLayer(elem, s)
{
	elem.style.border = s;
}

//s pot ser "transparent" o un color
function colorLayer(elem, s)
{
	elem.style.backgroundColor = s;
}

function classLayer(elem, s)
{
	elem.className = s;
}

function getzIndexLayer(elem) 
{
	return elem.style.zIndex;
}

function setzIndexLayer(elem, z) 
{
	elem.zIndex=z;
   	elem.style.zIndex=z;
}

/*function CreaRectangle(esq,sup,ample,alt)
{
	this.esq=esq;
	this.sup=sup;
	this.ample=ample;
	this.alt=alt;
}

var RectGetRectLayer=new CreaRectangle(0,0,0,0);*/

//http://stackoverflow.com/questions/288699/get-the-position-of-a-div-span-tag
function getRectLayer(elem)
{
	// ? és usat perquè FireFox no té pixelLeft i suposo que left està en píxels.
	/*var estil=elem.style;
	RectGetRectLayer.esq=estil.pixelLeft ? estil.pixelLeft : ((estil.left=="") ? 0 : parseInt(estil.left,10));
	RectGetRectLayer.sup=estil.pixelTop ? estil.pixelTop : ((estil.top=="") ? 0 : parseInt(estil.top,10));
	RectGetRectLayer.ample=estil.pixelWidth ? estil.pixelWidth : ((estil.width=="") ? 0 : parseInt(estil.width,10));
	RectGetRectLayer.alt=estil.pixelHeight ? estil.pixelHeight : ((estil.height=="") ? 0 : parseInt(estil.height,10));*/
	var offsets = elem.getBoundingClientRect();
	return {"esq": offsets.left + window.pageXOffset - elem.ownerDocument.documentElement.clientLeft, 
		"sup": offsets.top + window.pageYOffset - elem.ownerDocument.documentElement.clientTop, 
		"ample": Math.round(offsets.right-offsets.left), 
		"alt": Math.round(offsets.bottom-offsets.top)};
}

function getRectEsqLayer(elem)
{
	//var estil=elem.style;
	//return estil.pixelLeft ? estil.pixelLeft : ((estil.left=="") ? 0 : parseInt(estil.left,10));
	return Math.round(elem.getBoundingClientRect().left) + window.pageXOffset - elem.ownerDocument.documentElement.clientLeft;
}

function getRectSupLayer(elem)
{
	//var estil=elem.style;
	//return estil.pixelTop ? estil.pixelTop : ((estil.top=="") ? 0 : parseInt(estil.top,10));
	return Math.round(elem.getBoundingClientRect().top) + window.pageYOffset - elem.ownerDocument.documentElement.clientTop;
}

function spaceForLayers(win)
{
	if (win.document.body.clientWidth)
		ParamInternCtrl.realSpaceForLayers.width=win.document.body.clientWidth;
	if (win.document.body.clientHeight)
		ParamInternCtrl.realSpaceForLayers.height=win.document.body.clientHeight;
}

var SufixBarra="_barra"
var SufixFinestra="_finestra"
var SufixCanto="_canto"
var AltBarraFinestraLayer=19;
var MidaCantoFinestraLayer=12;

function changeSizeLayers(win)
{
var w_previ,h_previ, delta_w, delta_h, delta, delta1;
var canvis=false;
var elem, rect, ancora, nom;

	if (!ParamInternCtrl.realSpaceForLayers)
		ParamInternCtrl.realSpaceForLayers=JSON.parse(JSON.stringify(ParamCtrl.SpaceForLayers));

	w_previ=ParamInternCtrl.realSpaceForLayers.width;
	h_previ=ParamInternCtrl.realSpaceForLayers.height;

	spaceForLayers(win);

	delta_w=ParamInternCtrl.realSpaceForLayers.width-w_previ
	delta_h=ParamInternCtrl.realSpaceForLayers.height-h_previ;

	//alert(delta_w+" "+delta_h);
	for (var i=0; i<layerList.length; i++)
	{
		nom=layerList[i].nom;
		if((nom.length>SufixBarra.length && nom.substr(-SufixBarra.length)==SufixBarra) ||
		   (nom.length>SufixCanto.length && nom.substr(-SufixCanto.length)==SufixCanto))
			continue;

		elem=getLayer(win, nom);
		rect=getRectLayer(elem);
		if(nom.length>SufixFinestra.length && nom.substr(-SufixFinestra.length)==SufixFinestra)
		{
			rect.alt+=AltBarraFinestraLayer;
			rect.sup-=AltBarraFinestraLayer;
		}
		ancora=layerList[i].ancora;
		if (ancora)
		{
			if (ancora.indexOf("e")!=-1)
			{
				delta=Math.round(delta_w*(rect.esq+rect.ample)/w_previ);
				if (ancora.indexOf("w")!=-1)
				{
					delta1=Math.round(delta_w*rect.esq/w_previ);
					rect.esq+=delta1;
					rect.ample+=delta-delta1;
				}
				else if (ancora.indexOf("C")!=-1)
				{
					rect.esq+=delta;
				}
				else //if (ancora.indexOf("W")!=-1)
				{
					rect.ample+=delta;
				}
				canvis=true;
			}
			else if (ancora.indexOf("E")!=-1)
			{
				if (ancora.indexOf("w")!=-1)
				{
					delta=Math.round(delta_w*rect.esq/w_previ);
					rect.esq+=delta;
					rect.ample+=delta_w-delta;
				}
				else if (ancora.indexOf("C")!=-1)
				{
					rect.esq+=delta_w;
				}
				else //if (ancora.indexOf("W")!=-1)
				{
					rect.ample+=delta_w;
				}
				canvis=true;
			}
			else
			{
				if (ancora.indexOf("w")!=-1)
				{
					delta=Math.round(delta_w*rect.esq/w_previ);
					rect.esq+=delta;
					if (ancora.indexOf("C")!=-1)
						;
					else
						rect.ample-=delta;
					canvis=true;
				}
				//else if (ancora.indexOf("W")!=-1)
			}
			if (ancora.indexOf("s")!=-1)
			{
				delta=Math.round(delta_h*(rect.sup+rect.alt)/h_previ);
				if (ancora.indexOf("n")!=-1)
				{
					delta1=Math.round(delta_h*rect.sup/h_previ);
					rect.sup+=delta1;
					rect.alt+=delta-delta1;
				}
				else if (ancora.indexOf("R")!=-1)
				{
					rect.sup+=delta;
				}
				else //if (ancora.indexOf("N")!=-1)
				{
					rect.alt+=delta;
				}
				canvis=true;
			}
			else if (ancora.indexOf("S")!=-1)
			{
				if (ancora.indexOf("n")!=-1)
				{
					delta=Math.round(delta_h*rect.sup/h_previ);
					rect.sup+=delta;
					rect.alt+=delta_h-delta;
				}
				else if (ancora.indexOf("R")!=-1)
				{
					rect.sup+=delta_h;
				}
				else //if (ancora.indexOf("N")!=-1)
				{
					rect.alt+=delta_h;
				}
				canvis=true;
			}
			else
			{
				if (ancora.indexOf("n")!=-1)
				{
					delta=Math.round(delta_h*rect.sup/h_previ);
					rect.sup+=delta;
					if (ancora.indexOf("R")==-1)
						rect.alt-=delta;
					canvis=true;
				}
				//else if (ancora.indexOf("N")!=-1)
			}
			if (canvis==true)
			{
				//alert(nom+" "+rect.esq+" "+rect.sup+" "+rect.ample+" "+rect.alt);
				if (rect.esq<0)
					rect.esq=0;
				if (rect.ample<5)  //Impedeixo que les layers desaparexin totalment
					rect.ample=5;
				if (rect.sup<0)
					rect.sup=0;
				if (rect.alt<5)    //Impedeiso que les layers desaparexin totalment
					rect.alt=5;

				if(nom.length>SufixFinestra.length && nom.substr(-SufixFinestra.length)==SufixFinestra)
					moveFinestraLayer(win, nom.substring(0, nom.length-SufixFinestra.length), rect.esq, rect.sup, rect.ample, rect.alt);
				else					
					moveLayer(elem, rect.esq, rect.sup, rect.ample, rect.alt);
			}
		}
	}
	return canvis;
}

function vScrollLayer(elem, i, n)
{
	if (elem.scrollHeight && elem.scrollHeight>elem.offsetHeight)
	{
	    var i_scroll=i*elem.scrollHeight/n;
	    if (i_scroll<elem.scrollTop)
		elem.scrollTop=i_scroll;
	    if (i_scroll>elem.scrollTop+elem.offsetHeight-elem.scrollHeight/n)
	    	elem.scrollTop=i_scroll-elem.offsetHeight+elem.scrollHeight/n;
	}
}

//Aquests 
var boto_tancar=0x01;
var boto_pop_up=0x02;
var boto_pop_down=0x04;
var boto_ajuda=0x08;
var boto_copiar=0x10;

function OmpleBarraFinestraLayerNom(win, nom)
{
var z;
	for (z=0; z<layerFinestraList.length; z++)
	{
		if (layerFinestraList[z].nom && nom==layerFinestraList[z].nom)
			return OmpleBarraFinestraLayer(win, z);
	}
	alert("Finestra \""+nom+ "\"no trobada");
}

var movimentDesactiu=0x01;
var movimentArrossegant=0x02;
var movimentRedimensionant=0x04;

function OmpleBarraFinestraLayer(win, i_finestra)
{
var cdns=[];
var nom=layerFinestraList[i_finestra].nom + SufixBarra;

	cdns.push("<table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr>",
			  "<td class=\"titolfinestra\" onmousedown=\"ActivaMovimentFinestraLayer(event, ",i_finestra,", movimentArrossegant);\" ",
			  "onmouseup=\"DesactivaMovimentFinestraLayer(event, ",i_finestra,");\" ",
  			  "onmouseout=\"RedirigeixMovimentFinestraLayer(event, ",i_finestra,");\" ",
			  "onmousemove=\"MovimentFinestraLayerPerLaBarra(event, ",i_finestra,");\" >", 
			  "&nbsp;", DonaCadena(layerFinestraList[i_finestra].titol), "</td>");

	if(layerFinestraList[i_finestra].botons&boto_copiar)
	   cdns.push("<td align=\"center\" valign=\"middle\" width=\"16px\"><img src=\"", 
				 AfegeixAdrecaBaseSRC("boto_copiar.gif"), 
				 "\" alt=\"",DonaCadenaLang({"cat":"copiar", "spa":"copiar", "eng":"copy","fre":"copier"}),"\" ", 
				 "title=\"",DonaCadenaLang({"cat":"copiar", "spa":"copiar", "eng":"copy","fre":"copier"}),"\" onClick=\"",
				 "CopiaPortapapersFinestraLayer('",layerFinestraList[i_finestra].nom,"');\"></td>");

	if(layerFinestraList[i_finestra].botons&boto_ajuda)
	   cdns.push("<td align=\"center\" valign=\"middle\" width=\"16px\"><img src=\"", 
				 AfegeixAdrecaBaseSRC("boto_ajuda.gif"), 
				 "\" alt=\"",DonaCadenaLang({"cat":"ajuda", "spa":"ayuda", "eng":"help","fre":"aider"}),"\" ", 
				 "title=\"",DonaCadenaLang({"cat":"ajuda", "spa":"ayuda", "eng":"help","fre":"aider"}),"\ onClick=\"AjudaFinestra_",
				 layerFinestraList[i_finestra].nom ,"();\"></td>");

	if(layerFinestraList[i_finestra].botons&boto_pop_down)
	   cdns.push("<td align=\"center\" valign=\"middle\" width=\"16px\"><img src=\"",
				 AfegeixAdrecaBaseSRC("pop_down.gif"),
				 "\" alt=\"pop down\" onClick=\"PopDownFinestra_",
				 layerFinestraList[i_finestra].nom ,"();\"></td>");
	if(layerFinestraList[i_finestra].botons&boto_pop_up)
	   cdns.push("<td align=\"center\" valign=\"middle\" width=\"16px\"><img src=\"",
				 AfegeixAdrecaBaseSRC("pop_up.gif"), 
				 "\" alt=\"pop up\" onClick=\"PopUpFinestra_",
				 layerFinestraList[i_finestra].nom,"();\"></td>");

	if(layerFinestraList[i_finestra].botons&boto_tancar)
	   cdns.push("<td align=\"center\" valign=\"middle\" width=\"16px\"><img src=\"",
				 AfegeixAdrecaBaseSRC("tanca_consulta.gif"), 
				 "\" alt=\"", DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close","fre":"quitter"}) , "\" ",
				 "title=\"", DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close","fre":"quitter"}),"\" onClick=\"", 
				"TancaFinestraLayer('",layerFinestraList[i_finestra].nom,"');\"></td>");
	cdns.push("<td width=\"5px\"></td></tr></table>");
	contentLayer(getLayer(win, nom), cdns.join(""));

}//Fi de OmpleBarraFinestraLayer()

function afegeixBotoABarraFinestraLayer(win, name, botons)
{
var nom=name+SufixBarra;

	for (var i=0; i<layerFinestraList.length; i++)
	{
	    if(layerFinestraList[i].nom && layerFinestraList[i].nom==name)
	    {
			layerFinestraList[i].botons|=botons;		
			//Omplo la layer barra amb els botons i el títol
			OmpleBarraFinestraLayer(win,i);
			return;
	    }
	}
}//Fi de afegeixBotoABarraFinestraLayer()

function getFinestraLayer(win, name)
{
	return getLayer(win, name+SufixFinestra);
}

function isFinestraLayer(win, name)
{
	return isLayer(getFinestraLayer(win, name));
}

function setzIndexFinestraLayer(win, name, z)
{
	setzIndexLayer(getFinestraLayer(win, name),z);
	setzIndexLayer(getLayer(win,name+SufixBarra),z);
	var div=getLayer(win,name+SufixCanto);
	if (div)
		setzIndexLayer(div,z);
}

/* això sembla ser un codi perdut que no s'usa i crida una funció que no existeix.
function esborraFinestraLayer(win, name)
{
	esborraLayer(getFinestraLayer(win,name));
}*/

//Retorna la finestra de la barra per poder ser omplerta directament.
function ObreFinestra(win, name, desc_funcionalitat_de)
{
	if (!isFinestraLayer(win, name))
	{
		alert(DonaCadenaLang({"cat":"No s'ha definit la layer de tipus finestra '"+name+"' i per tant no es pot usar la funcionalitat ",
						  "spa":"No se ha definido la layer de tipo ventana '"+name+"' y en consecuencia no se puede usar la funcionalidad ",
						  "eng":"The layer '"+name+"' has not been defined and its not possible use the funcionality ",
						  "fre":"La layer de type fenêtre '"+name+"' n'a été pas définie et il n'est donc pas possible d'utilise l'outil "})+desc_funcionalitat_de);
		return null;
	}
	showFinestraLayer(win, name);
	setzIndexFinestraLayer(win, name, (layerList.length-1));
	return getLayer(win, name+SufixFinestra);
}

//Returns the floating window position within the floating windows array
function getFloatingWindowId(name)
{
	var i= layerFinestraList.length;
	while(i--)
	{
		if(layerFinestraList[i].nom==name)
			return i;
	}
	return -1;
}

//We change the focus of the window so it comes to the top (so it will not be hided by other floating windows)
//Passing a -1 will make no floating window to have the focus
function setTopFloatingWindow(i_finestra)
{
var div, div_canto;
	if(focusedFloatingWindow!=-1)
	{		
		div=getLayer(window, layerFinestraList[focusedFloatingWindow].nom+SufixBarra);
		 //Restore the zIndex
		setzIndexLayer(div,div.old_zIndex);
		setzIndexLayer(getLayer(window, layerFinestraList[focusedFloatingWindow].nom+SufixFinestra), div.old_zIndex);
		div_canto=getLayer(window, layerFinestraList[focusedFloatingWindow].nom+SufixCanto);
		if (div_canto)
			setzIndexLayer(div_canto, div.old_zIndex);
	}
	if(i_finestra!=-1)
	{
		var div=getLayer(window, layerFinestraList[i_finestra].nom+SufixBarra);

		//Save the current zIndex (as they are the same we only need to save it in the bar)
		div.old_zIndex= div.style.zIndex;

		//This must be always bigger than the topmost floatingWindow zIndex
		setzIndexLayer(div, layerList.length);
		setzIndexLayer(getLayer(window, layerFinestraList[i_finestra].nom+SufixFinestra), layerList.length);
		div_canto=getLayer(window, layerFinestraList[i_finestra].nom+SufixCanto)
		if (div_canto)
			setzIndexLayer(div_canto, layerList.length);
	}
	focusedFloatingWindow=i_finestra;
}

function showFinestraLayer(win, name) 
{
	showLayer(getFinestraLayer(win, name));
	showLayer(getLayer(win,name+SufixBarra));
	var div=getLayer(win,name+SufixCanto);
	if (div)
		showLayer(div);

	setTopFloatingWindow(getFloatingWindowId(name));
}

function hideFinestraLayer(win, name) 
{
	hideLayer(getFinestraLayer(win, name));
	hideLayer(getLayer(win,name+SufixBarra));
	var div=getLayer(win,name+SufixCanto);
	if (div)
		hideLayer(div);
}

function showOrHideFinestraLayer(win, name, show)
{
	if (show)
		showFinestraLayer(win, name);
	else
		hideFinestraLayer(win, name) 
}


function removeFinestraLayer(win, name) 
{
	removeLayer(getFinestraLayer(win, name));
	removeLayer(getLayer(win,name+SufixBarra));
	var div=getLayer(win,name+SufixCanto);
	if (div)
		removeLayer(div);
}

function moveFinestraLayer(win, name, x, y, w, h)
{
	moveLayer(getLayer(win, name+SufixBarra), x, y, w, AltBarraFinestraLayer);
	moveLayer(getFinestraLayer(win, name), x, (y==-1) ? -1 : y+AltBarraFinestraLayer, w, (h<AltBarraFinestraLayer) ? -1 : h-AltBarraFinestraLayer);
	var div=getLayer(win,name+SufixCanto);
	if (div)
		moveLayer(div, x+w-MidaCantoFinestraLayer, y+h-MidaCantoFinestraLayer, MidaCantoFinestraLayer, MidaCantoFinestraLayer);
}

function isFinestraLayerVisible(win, name)
{
	var elem=getFinestraLayer(win,name);
	if(elem && isLayerVisible(elem))
		return true;
	else
		return false;	
}

function getcontentFinestraLayer(win, name)
{
	return getContentLayer(getFinestraLayer(win, name));
}

function contentFinestraLayer(win, name, content) 
{
	contentLayer(getFinestraLayer(win, name), content);
}

function winMousePos(e) 
{
	//get the position of the mouse
	if( !e ) 
		e = window.event; 
	if( !e || ( typeof( e.pageX ) != 'number' && typeof( e.clientX ) != 'number' ) ) 
		return {"x": 0, "y": 0};
	
	if( typeof( e.pageX ) == 'number' ) 
	{ 
		var xcoord = e.pageX; 
		var ycoord = e.pageY; 
	} 
	else 
	{
		var xcoord = e.clientX; 
		var ycoord = e.clientY;
		if( !(( window.navigator.userAgent.indexOf( 'Opera' ) + 1) || 
			  (window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) || 
			  window.navigator.vendor == 'KDE' ) ) 
		{
			if( document.documentElement && ( document.documentElement.scrollTop || document.documentElement.scrollLeft ) ) 
			{
				xcoord += document.documentElement.scrollLeft; ycoord += document.documentElement.scrollTop;
			} 
			else if( document.body && ( document.body.scrollTop || document.body.scrollLeft ) ) 
			{
				xcoord += document.body.scrollLeft; ycoord += document.body.scrollTop; 
			} 
		} 
	}
	return {"x": xcoord, "y": ycoord};
}

var iFinestraLayerFora=-1;

function ActivaMovimentFinestraLayer(event, i_finestra, tipus)
{
var layer_finestra=layerFinestraList[i_finestra];
	if(layer_finestra.estat_click!=tipus)  
	{
		var div;
		layer_finestra.coord_click=winMousePos(event);		
		layer_finestra.estat_click=tipus;

		div=getFinestraLayer(window, layer_finestra.nom);
		layer_finestra.pos_ini_finestra.x=parseInt(div.style.left, 10);
		layer_finestra.pos_ini_finestra.y=parseInt(div.style.top, 10);
		layer_finestra.pos_ini_finestra.w=parseInt(div.style.width, 10);
		layer_finestra.pos_ini_finestra.h=parseInt(div.style.height, 10);

		div=getLayer(window, layer_finestra.nom+SufixBarra);
		layer_finestra.pos_ini_barra.x=parseInt(div.style.left,10);
		layer_finestra.pos_ini_barra.y=parseInt(div.style.top,10);
		layer_finestra.pos_ini_barra.w=parseInt(div.style.width, 10);

		div=getLayer(window, layer_finestra.nom+SufixCanto);
		if (div)
		{
			layer_finestra.pos_ini_canto.x=parseInt(div.style.left,10);
			layer_finestra.pos_ini_canto.y=parseInt(div.style.top,10);	
		}
	}
	iFinestraLayerFora=-1;
}

function MovimentFinestraLayerPerLaBarra(event, i_finestra)
{
var layer_finestra=layerFinestraList[i_finestra];

	if(layer_finestra.estat_click!=movimentDesactiu)
	{
		var dx, dy, coordActual, div;
				
		coordActual=winMousePos(event);
		
		//Make sure the mouse is not outside the client area (avoid the window
		//to be placed in a non reacheable area).
		if(coordActual.y<=0)
			coordActual.y=1;
		else if(coordActual.y>=window.innerHeight)
			coordActual.y= window.innerHeight;
		if(coordActual.x<=0)
			coordActual.x=1;
		else if(coordActual.x>=window.innerWidth)
			coordActual.x= window.innerWidth;
		
		dx=coordActual.x-layer_finestra.coord_click.x;
		dy=coordActual.y-layer_finestra.coord_click.y;
			
		if(layer_finestra.estat_click==movimentArrossegant)
		{
			moveLayer(getFinestraLayer(window, layer_finestra.nom), layer_finestra.pos_ini_finestra.x+dx, layer_finestra.pos_ini_finestra.y+dy, -1, -1);
			moveLayer(getLayer(window, layer_finestra.nom+SufixBarra), layer_finestra.pos_ini_barra.x+dx, layer_finestra.pos_ini_barra.y+dy, -1, -1);
		}
		else //if(layer_finestra.estat_click==movimentRedimensionant)
		{
			//Impedeixo que la caixa es faci massa petita al redimensionar.
			if (layer_finestra.pos_ini_finestra.w+dx<100)
				dx=100-layer_finestra.pos_ini_finestra.w;
			if (layer_finestra.pos_ini_finestra.h+dy<38)
				dy=38-layer_finestra.pos_ini_finestra.h;
			moveLayer(getFinestraLayer(window, layer_finestra.nom), -1, -1, layer_finestra.pos_ini_finestra.w+dx, layer_finestra.pos_ini_finestra.h+dy);
			moveLayer(getLayer(window, layer_finestra.nom+SufixBarra), -1, -1, layer_finestra.pos_ini_finestra.w+dx, -1);
		}		
		div=getLayer(window, layer_finestra.nom+SufixCanto);
		if (div)
			moveLayer(div, layer_finestra.pos_ini_canto.x+dx, layer_finestra.pos_ini_canto.y+dy, -1, -1);

		//Avoid text being selected while moving...
		if(window.getSelection)
			window.getSelection().removeAllRanges();
	}
}

function DesactivaMovimentFinestraLayer(event_on_click, i_finestra)
{
	layerFinestraList[i_finestra].estat_click=movimentDesactiu;
	layerFinestraList[i_finestra].coord_click=null;
}

function RedirigeixMovimentFinestraLayer(event_on_click, i_finestra)
{
	if(layerFinestraList[i_finestra].estat_click!=movimentDesactiu)
		iFinestraLayerFora=i_finestra;
}

function textHTMLImgCantoFinestra(i_finestra)
{
var cdns=[];

	cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("canto.png"),
					 "\" alt=\"", DonaCadenaLang({"cat":"redimensionar", "spa":"redimensionar", "eng":"resize","fre":"redimensionner"}), "\" ", 
					 "title=\"", DonaCadenaLang({"cat":"redimensionar", "spa":"redimensionar", "eng":"resize","fre":"redimensionner"}), "\" ", 
					 "onmousedown=\"ActivaMovimentFinestraLayer(event, ",i_finestra,", movimentRedimensionant);\" ",
					 "onmouseup=\"DesactivaMovimentFinestraLayer(event, ",i_finestra,");\" ",
  			  		 "onmouseout=\"RedirigeixMovimentFinestraLayer(event, ",i_finestra,");\" ",
			  		 "onmousemove=\"MovimentFinestraLayerPerLaBarra(event, ",i_finestra,", true);\" >");
	return cdns.join("");
}

function createFinestraLayer(win, name, titol, botons, left, top, width, height, ancora, param, content)   //param --> scroll, visible, ev, bg_trans, resizable
{
var nom, i_finestra=layerFinestraList.length;

	layerFinestraList[i_finestra]={nom: name, titol: titol, botons: botons, estat_click: movimentDesactiu, 
			coord_click: null, pos_ini_barra: {x: 0, y: 0, w: 0}, pos_ini_finestra: {x: 0, y: 0, w: 0, h: 0}, pos_ini_canto: null};

	//Creo les dos layers que formaran la layer tipus finestra amb títol i botons

	//Creo la barra
	nom=name+SufixBarra;
	createLayer(win, nom, left, top, width, AltBarraFinestraLayer, ancora, {scroll: "no", visible: param.visible, ev:param.ev, save_content: false}, null);

	//Li assigno el seu estil de visualització
	classLayer(getLayer(win, nom), "barrafinestra");

	//No omplo la layer barra amb els botons i el títol ho faré quan conegui l'idioma del navegador
	
	//Creo la finestra i li assigno el seu estil de visualització
	nom=name+SufixFinestra;
	createLayer(win, nom, left, (top+AltBarraFinestraLayer), width, (height-AltBarraFinestraLayer), ancora, param, content);
	classLayer(getLayer(win, nom), "finestra"); 

	if (param.resizable)
	{ 
		nom=name+SufixCanto;
		createLayer(win, nom, left+width-MidaCantoFinestraLayer, top+height-MidaCantoFinestraLayer, MidaCantoFinestraLayer, MidaCantoFinestraLayer, ancora, {scroll: "no", visible: param.visible, ev:param.ev, save_content: false}, textHTMLImgCantoFinestra(i_finestra));
		classLayer(getLayer(win, nom), "cantofinestra");
		layerFinestraList[i_finestra].pos_ini_canto={x: 0, y: 0};
	}
}//Fi de createFinestraLayer()

function textHTMLFinestraLayer(name, titol, botons, left, top, width, height, ancora, param, content)   //param --> scroll, visible, ev, bg_trans, resizable
{
var nom, s, i_finestra=layerFinestraList.length;

	layerFinestraList[i_finestra]={nom: name, titol: titol, botons: botons, estat_click: movimentDesactiu, 
			coord_click: null, pos_ini_barra: {x: 0, y: 0, w: 0}, pos_ini_finestra: {x: 0, y: 0, w: 0, h: 0}, pos_ini_canto: null};

	//el text de les dos layers que formaran la layer tipus finestra amb títol i botons

	//Creo la barra
	nom=name+SufixBarra;
	s=textHTMLLayer(nom, left, top, width, AltBarraFinestraLayer, ancora, {scroll: "no", visible: param.visible, ev:param.ev, save_content: false}, "barrafinestra", null);

	//No omplo la layer barra amb els botons i el títol ho faré quan conegui l'idioma del navegador
	
	//Creo la finestra i li assigno el seu estil de visualització
	nom=name+SufixFinestra;
	s+=textHTMLLayer(nom, left, (top+AltBarraFinestraLayer+1), width, (height-AltBarraFinestraLayer), ancora, param, "finestra", content);
	
	if (param.resizable)
	{ 
		nom=name+SufixCanto;
		s+=textHTMLLayer(nom, left+width-MidaCantoFinestraLayer, top+height-MidaCantoFinestraLayer, MidaCantoFinestraLayer, MidaCantoFinestraLayer, ancora, {scroll: "no", visible: param.visible, ev:param.ev, save_content: false}, "cantofinestra", textHTMLImgCantoFinestra(i_finestra));
		layerFinestraList[i_finestra].pos_ini_canto={x: 0, y: 0};
	}
	return s;
}//Fi de textHTMLFinestraLayer()


function createLayer(win, name, left, top, width, height, ancora, param, content)  // param --> scroll, visible, ev 
{
	var container = document.getElementById(ParamCtrl.containerName);
	param.save_content=true;
	container.innerHTML += textHTMLLayer(name, left, top, width, height, ancora, param, null, content);
}

function textHTMLLayer(name, left, top, width, height, ancora, param, div_class, content)   //param --> scroll, visible, ev, save_content, bg_trans
{

	var z=layerList.length;
	//Posem null a content per tal de que la funció de canvi d'idioma no la repinti.
	layerList[z]= { "nom": name, "ancora": ancora, "contingut": ((param.save_content) ? content : null)};
	
	return '<div id="' + name + '" style="position:absolute; overflow:'+((param.scroll=="si") ? 'scroll' : (param.scroll=="ara_no"? 'auto':'visible'))+'; left:' + left + 'px; top:' + top + 'px; width:' + width + 'px; height:' + height + 'px;' + ' visibility:' + (param.visible ? 'visible;' : 'hidden;') + (param.bg_trans ? ' background-image : url(1tran.gif);' : '') +' z-index:' + z +';" ' + (param.ev ? param.ev+ ' ' : '') + (div_class ? 'class='+div_class : '')+'>'+
			 ((content) ? ((typeof content == 'object')? '' : content) : '') +
    			'</div>';
}

/*Aquesta funció afegeix un iframe per resoldre un problema del IE 6
i la transparència de selects (DIV over SELECT). Solució trobada a:
http://esdi.excelsystems.com/wsexmp/DIVDRP.pgm?task=showinst&wsnum=00110
http://weblogs.asp.net/bleroy/archive/2005/08/09/how-to-put-a-div-over-a-select-in-ie.aspx
S'ha de cridar ABANS de crear la DIV corresponent.
*/
function textHTMLiframeLayer(name, left, top, width, height, visible)
{
var s="";
	if (NecessariLayerIFrame)
	{
	      s='<iframe src="blanc.htm" id="iframe_' + name + '" style="position:absolute; left:' + left + 'px; top:' + top + 'px; width:' + width + '; height:' + height + 'px;' + ' visibility:' + (visible ? 'visible;' : 'hidden;') + '"></iframe>';
	}
	return s;
}

function getLayer(win, name)
{
	return win.document.getElementById(name);
}

function isLayer(elem)
{
	if (elem)
		return true;
	return false;
}

// Funció inspirada en una de SitePoint Pty. Ltd, www.sitepoint.com
function Ajax() 
{
	this.req = null;
	this.url = null;
	this.status = null;
	this.statusText = '';
	this.method = 'GET';
	this.async = true;
	this.dataPayload = "";
	this.readyState = null;
	this.responseText = null;
	this.responseXML = null;
	this.handleResp = null;
	this.responseFormat = 'text/plain', // 'text/plain', 'text/xml', 'object'
	this.requestFormat = 'application/x-www-form-urlencoded'  //només per POST
	this.structResp=null;
	this.mimeType = null;  
	//this.headers = [];
	this.requestHeaders=[];
	this.accessToken = null;
	this.accessTokenType =null;

	this.init = function() {
		var i = 0;
		var reqTry = [ 
			function() { return new XMLHttpRequest(); },
			function() { return new ActiveXObject('Msxml2.XMLHTTP') },
			function() { return new ActiveXObject('Microsoft.XMLHTTP' )} ];
      
		while (!this.req && (i < reqTry.length)) {
			try { 
				this.req = reqTry[i++]();
			} 
			catch(e) {}
		}
		return true;
	};
	this.doGet = function(url, hand, response_format, struct) 
	{
		//alert(url);  //·$·Per a depurar
		this.url = url;
		this.handleResp = hand;
		this.responseFormat = response_format || 'text/plain';
		this.structResp = struct;
		this.method = 'GET';
		this.doReq();
	};

	this.doPost = function(url, request_format, dataPayload, hand, response_format, struct) 
	{
		this.url = url;
		this.requestFormat = request_format || 'application/x-www-form-urlencoded';    
		this.dataPayload = dataPayload;
		this.handleResp = hand;
		this.responseFormat = response_format || 'text/plain';
		this.structResp = struct;
		this.method = 'POST';
		this.doReq();
	};
	
	this.doPut = function(url, request_format, dataPayload, hand, response_format, struct) 
	{
		this.url = url;
		this.requestFormat = request_format || 'application/x-www-form-urlencoded';    
		this.dataPayload = dataPayload;
		this.handleResp = hand;
		this.responseFormat = response_format || 'text/plain';
		this.structResp = struct;
		this.method = 'PUT';
		this.doReq();
	};
	
	this.doDelete = function(url, hand, response_format, struct) 
	{
		//alert(url);
		this.url = url;
		this.handleResp = hand;
		this.responseFormat = response_format || 'text/plain';
		this.structResp = struct;
		this.method = 'DELETE';
		this.doReq();
	};
	
	this.doReqIndirect = function(method, url, request_format, dataPayload, hand, response_format, struct)
	{
		if (method=="POST")
			this.doPost(url, request_format, dataPayload, hand, response_format, struct);
		else if (method=="PUT")
			this.doPut(url, request_format, dataPayload, hand, response_format, struct);
		else if (method=="DELETE")
			this.doDelete(url, hand, response_format, struct);
		else
			this.doGet(url, hand, response_format, struct);
	};	

	this.doReq = function() 
	{
		var self = null;
		var req = null;
		var headArr = [];
    
		if (!this.init()) {
			alert('Could not create XMLHttpRequest object.');
			return;
		}
			   
		req = this.req;		
		req.open(this.method, this.url, this.async);

		if (this.accessTokenType && this.accessTokenType.length)
   			this.setRequestHeader("nb-access-token-type", this.accessTokenType);
  		if (this.accessToken && this.accessToken.length)
			this.setRequestHeader("Authorization", "Bearer " + this.accessToken);
		if ((this.method == 'POST' || this.method == 'PUT') && this.requestFormat) 
			req.setRequestHeader('Content-Type', this.requestFormat);
		if ((this.method == 'POST' || this.method == 'PUT') && this.responseFormat)
			req.setRequestHeader('Accept', this.responseFormat);
		req.setRequestHeader('Access-Control-Expose-Headers', '*');

		for (var i=0; i<this.requestHeaders.length; i++)
			req.setRequestHeader(this.requestHeaders[i].name, this.requestHeaders[i].value);

		self = this;
	
		req.onreadystatechange = function() {
			var resp = null;
			self.readyState = req.readyState;
			if (req.readyState == 2)  // this.HEADERS_RECEIVED
			{
			    // Get the raw header string
			    var headers = req.getAllResponseHeaders();
			
				// Convert the header string into an array
				// of individual headers
				var arr = headers.trim().split(/[\r\n]+/);

				// Create a map of header names to values
				req.responseHeaders = {};
				arr.forEach(function (line) {
				  var parts = line.split(': ');
				  var header = parts.shift();
				  var value = parts.join(': ');
				  req.responseHeaders[header] = value;
				});
		    }

			if (req.readyState == 4) {
				self.status = req.status;
				self.statusText = req.statusText;
				self.responseText = req.responseText;
				self.responseXML = req.responseXML;
				switch(self.responseFormat) {
					default:
					case 'text/plain':
						resp = self.responseText;
						break;
					case 'text/xml':
						resp = self.responseXML;
						break;					
					case 'application/json':
						if (self.responseText=="")
						{
							resp = "";
							break;
						}
						if (self.responseText)
						{
							try {
								resp = JSON.parse(self.responseText);
							} 
							catch (e) {
								self.handleErr("JSON file error: " + self.responseText, self.structResp);
								return;
							}
						}						
						break;					
					case 'object':
						resp = req;
						break;
				}

				if(self.structResp)
					self.structResp.text=self.responseText;
				if (self.status > 199 && self.status < 300) {
					if (!self.handleResp) {
						alert('No response handler defined for this XMLHttpRequest object.');
            					return;
					}
					if(self.structResp) 
					{
						try
						{
							self.handleResp(resp, self.structResp);
						}
						catch(e)
						{
							alert("Error on handling server response. "+ e)
						}
					}
					else
						self.handleResp(resp);
				} else {
					self.handleErr(resp, self.structResp);
				}
			}
		}
		req.send(this.dataPayload);
	};
	this.abort = function() {
		if (this.req) {
			this.req.onreadystatechange = function() { };
			this.req.abort();
			this.req = null;
		}
	};
	this.handleErr = function() {
		var errorWin;
		// Create new window and display error
		try {
			errorWin = window.open('', 'errorWin');
			errorWin.document.body.innerHTML = this.responseText;
		}
		// If pop-up gets blocked, inform user
		catch(e) {
			alert('An error occurred, but the error message cannot be displayed because of your browser\'s pop-up blocker.\n' +
				'You could try to allow pop-ups from this Web site. Meanwhile, the text version of the error is:\n' + this.responseText);
		}
	};
	this.setMimeType = function(mimeType) {
		this.mimeType = mimeType;
	};  
	this.setHandlerResp = function(funcRef) {
		this.handleResp = funcRef;
	};
	this.setHandlerErr = function(funcRef) {
		this.handleErr = funcRef; 
	};
	this.setHandlerBoth = function(funcRef) {
		this.handleResp = funcRef;
		this.handleErr = funcRef;
	};
	this.setRequestHeader = function(headerName, headerValue) {
		this.requestHeaders.push({"name": headerName, "value": headerValue});
		//this.headers.push(headerName + ': ' + headerValue);
	};

	this.getResponseHeader = function(headerName) {
		this.req.responseHeaders[headerName];
	};

	this.setAccessToken = function(accessToken, accessTokenType) {
		this.accessToken=accessToken;
		this.accessTokenType=accessTokenType;
	};
}

//See also loadFile() in xml.js


//Preparo una funció per descarregar les dades JSON assíncronament
//Extreta de: http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
function loadJSON(path, success, error, extra_param)
{
var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
        if (xhr.readyState === XMLHttpRequest.DONE) 
		{
	       	if (xhr.status === 200) 
			{
            	if (success)
				{
					var data;
					try {
						data = JSON.parse(xhr.responseText);
					} 
					catch (e) {
		                		if (error)
							return error("JSON file: \""+ path + "\". " + e);
					}
					success(data, extra_param);
				}
			} 
			else 
			{
                if (error)
				{
					var s=null;
					if (xhr.response)
					{
						var s=arrayBufferToString(xhr.response);
						if (-1!=s.indexOf("<body>"))
							s=s.substring(s.indexOf("<body>"));
					}
		    			error("JSON file: \""+ path + "\". Status: " + xhr.statusText + "\n\nURL: "+ path + ((xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ? "\n\nResponse headers:\n"+xhr.getAllResponseHeaders() : "") + ((s) ? "\nResponse Body:\n"+s : ""), extra_param);
				}
			}
		}
	};
	xhr.open("GET", path, true);
	//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=ISO-8859-1');
	xhr.setRequestHeader('Accept', 'application/json');
	//xhr.setRequestHeader('Accept-Charset', 'utf-8');	Això no li agrada als navegadors, donen error
	xhr.send();
}

function loadTextFile(path, mimetype, success, error, extra_param)
{
var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
        if (xhr.readyState === XMLHttpRequest.DONE) 
		{
	        if (xhr.status === 200) 
			{
				if (mimetype && mimetype!="" && mimetype!=xhr.getResponseHeader('content-type'))
				{
			        if (error)
					{
						var s=null;
						if (xhr.response)
						{
							var s=xhr.response;
							if (-1!=s.indexOf("<body>"))
								s=s.substring(s.indexOf("<body>"));
						}
						error("Wrong response content type:"+ xhr.getResponseHeader('content-type') + "\n\nResponse headers:\n"+ ((xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ? xhr.getAllResponseHeaders() : "") + ((s) ? "\nResponse Body:\n"+s : ""), extra_param);
					}
				}
				else
				{
	                if (success)
					{
						success(xhr.responseText, extra_param);
					}
				}
			} 
			else 
			{
             	if (error)
				{
					var s=null;
					if (xhr.response)
					{
						var s=xhr.response;
						if (-1!=s.indexOf("<body>"))
							s=s.substring(s.indexOf("<body>"));
					}
					error(xhr.status + ": " +xhr.statusText + "\n\nURL: "+ path + ((xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ? "\n\nResponse headers:\n"+ xhr.getAllResponseHeaders() : "") + ((s) ? "\nResponse Body:\n"+s : ""), extra_param);
				}
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}


//Modifyed as sugested in: http://www.html5rocks.com/en/tutorials/webgl/typed_arrays/ and http://www.html5rocks.com/en/tutorials/file/xhr2/
function loadBinaryFile(path, mimetype, success, error, extra_param)
{
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function()
	{
		if (xhr.readyState === XMLHttpRequest.DONE) 
		{
			if (xhr.status === 200) 
			{
				if (mimetype!=xhr.getResponseHeader('content-type'))
				{
			        if (error)
					{
						var s=null;
						if (xhr.response)
						{
							var s=arrayBufferToString(xhr.response);
							if (-1!=s.indexOf("<body>"))
								s=s.substring(s.indexOf("<body>"));
						}
						error("Wrong response content type: "+ xhr.getResponseHeader('content-type') + "\n\nResponse headers:\n"+((xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ? xhr.getAllResponseHeaders() : "") + ((s) ? "\nResponse Body:\n"+s : ""), extra_param);
					}
				}
				else
				{
	                if (success)
						success(xhr.response, extra_param);
				}
			} 
			else 
			{
		        if (error)
				{
					var s=null;
					if (xhr.response)
					{
						var s=arrayBufferToString(xhr.response);
						if (-1!=s.indexOf("<body>"))
							s=s.substring(s.indexOf("<body>"));
					}
					error(xhr.status + ": " +xhr.statusText + "\n\nURL: "+ path + ((xhr.getAllResponseHeaders && xhr.getAllResponseHeaders()) ? "\n\nResponse headers:\n"+xhr.getAllResponseHeaders() : "") + ((s) ? "\nResponse Body:\n"+s : ""), extra_param);
				}
			}
		}

	};
	xhr.open("GET", path, true);
	xhr.responseType = "arraybuffer";

	xhr.send();
}

function arrayBufferToString(buffer){
    var arr = new Uint8Array(buffer);
    var str = String.fromCharCode.apply(String, arr);
    return str;
}

//Auxiliar internal function. Use ResolveJSONPointerRefs(obj_root) instead
function AddJSONPointerRefToObject(obj_root, obj, ref)
{
var i;
	if (-1==(i=ref.indexOf('#')))
	{
		alert(DonaCadenaLang({"cat": "El valor de $ref ha de contenir un caracter '#'", "spa": "El valor de $ref debe contenir un caracter '#'", "eng": "The value of $ref requires a caracter '#'", "fre": "La valeur de $ref nécessite un caractère '#'"}));
		return;
	}
	if (i!=0)
	{
		alert(DonaCadenaLang({"cat": "Encara no se suporten valors de $ref amb referències a altres fitxers JSON", "spa": "Aún no se suporta valores de $ref con referencias a otros ficheros JSON", "eng": "$ref values with references to other JSON files are still not supported", "fre": "Les valeurs $ref avec des références à d'autres fichiers JSON ne sont toujours pas prises en charge"}));
		return;
	}
	var r=jsonpointer.get(obj_root, ref);
	if (typeof r === "undefined" || r===null)
	{
		alert(DonaCadenaLang({"cat": "El valor de $ref", "spa": "El valor de $ref", "eng": "The value of $ref", "fre": "La valeur de $ref"})+": \""+ref+"\" "+ DonaCadenaLang({"cat": "no està definit", "spa": "no está definido", "eng": "is not defined", "fre": "n'est pas défini"}));
		return;
	}
	if (typeof r !== "object")
	{
		alert(DonaCadenaLang({"cat": "El valor de $ref", "spa": "El valor de $ref", "eng": "The value of $ref", "fre": "La valeur de $ref"})+": \""+ref+"\" "+ DonaCadenaLang({"cat": "no és un objecte", "spa": "no es un objecto", "eng": "is not an object", "fre": "n'est pas un objet"}));
		return;
	}
	//Replico les propietats de l'objecte aquí
	for (var p in r)
	{
		if (r.hasOwnProperty(p))
			obj[p]=JSON.parse(JSON.stringify(r[p]));
	}
}

/*Recursive function. To call it use ResolveJSONPointerRefs(obj_root) without second parameter. 
It supports that "$ref" is a string of a single JSON Pointer or an array of JSON Pointers.
The original object can have other properties but they should not the properties of the pointed object ($ref) 
should not have the same names.
The only JSON Pointers supported are the ones starting by "#/" (root JSON Pointers to this document).
Pointing to a different JSON document is not implemented yet.
*/
function ResolveJSONPointerRefs(obj_root, obj)
{
	if (typeof obj === "undefined")
		obj=obj_root;
	if (typeof obj === "object" && null !== obj)
	{
		for (var k in obj)
		{
			var found=false;
			if (obj.hasOwnProperty(k) && k=="$ref")
			{
				found=true;
				break;
			}
		}
		if (found)
		{
			if (typeof obj["$ref"]==="string")
			{
				AddJSONPointerRefToObject(obj_root, obj, obj["$ref"]);
			}
			else  //assumeixo que és un Array
			{
				for (var i=0; i<obj["$ref"].length; i++)
					AddJSONPointerRefToObject(obj_root, obj, obj["$ref"][i]);
			}
			for (var k in obj)
			{
				if (obj.hasOwnProperty(k) && k!="$ref")
					ResolveJSONPointerRefs(obj_root, obj[k]);
			}
		}
		else
		{
			for (var k in obj)
			{
				if (obj.hasOwnProperty(k))
					ResolveJSONPointerRefs(obj_root, obj[k]);
			}
		}
	}
}

function RemoveOtherPropertiesInObjWithRef(obj_root, obj)
{
	if (typeof obj === "undefined")
		obj=obj_root;
	if (typeof obj === "object" && null !== obj)
	{
		var found=false;
		for (var k in obj)
		{
			if (obj.hasOwnProperty(k) && k=="$ref")
			{
				found=true;
				break;
			}
		}
		if (found)
		{
			if (typeof obj["$ref"]==="string")
			{
				var r=jsonpointer.get(obj_root, obj["$ref"]);
				for (var k in obj)
				{
					if (obj.hasOwnProperty(k) && k!="$ref")
					{
						if (r.hasOwnProperty(k))
							delete obj[k];
						else			
							RemoveOtherPropertiesInObjWithRef(obj_root, obj[k]);
					}
				}
			}
			else //assumeixo que és un Array
			{
				var r=[];
				for (var i=0; i<obj["$ref"].length; i++)
				{
					r[i]=jsonpointer.get(obj_root, obj["$ref"][i]);
				}	
				for (var k in obj)
				{
					if (obj.hasOwnProperty(k) && k!="$ref")
					{
						for (var i=0; i<obj["$ref"].length; i++)
						{
							if (r[i].hasOwnProperty(k))
								delete obj[k];
						}
						if (obj[k])
							RemoveOtherPropertiesInObjWithRef(obj_root, obj[k]);
					}
				}
			}
		}
		else
		{
			for (var k in obj)
			{
				if (obj.hasOwnProperty(k))
					RemoveOtherPropertiesInObjWithRef(obj_root, obj[k]);
			}
		}
	}
}


function floor_DJ(x)
{
var a=Math.floor(x);

	if (x-a>0.9999999999)
       	a+=1.0;
	return a;
}

//Arrodonir X a N decimals amb suport a positius i negatius i notació exponencial.
//Extret de http://www.merlyn.demon.co.uk/js-round.htm
//Modificada perque si es demanen 0 decimals no es vegi el punt.
//Sempre retorna el número com a text
function OKStrOfNe(X, N) 
{ 
var es_negatiu;
	if (isNaN(X))
		return "";
	if (N==0)
		return Math.round(X).toString();
	if (X<0)
	{
		X=-X
		es_negatiu=true;
	}
	else
		es_negatiu=false;
	
	var Q = ''+Math.round(X*Number("1e"+N))
	while (Q.length<=N) 
		Q='0'+Q
	if (Q.search(/e/)!=-1) 
		return X.toString();
	return ((es_negatiu) ? "-" : "") + Q.substring(0,Q.length-N)+'.'+Q.substring(Q.length-N,Q.length);
}

//Pot ser que retorni el número com a text
function multipleOf(v, m) 
{
var r;

	if (m<1)
		return OKStrOfNe(v, Math.round(-Math.log(m)/Math.LN10));

	r = v%m;
	if (r <= (m/2)) { 
        	return v-r;
	} else {
        	return v+m-r;
    	}
}


//Aquesta funció no és a la llibrerira matemàtica.
function sinh(z)
{
	return (Math.exp(z)-Math.exp(-z))/2;
}

function ArrodoneixSiSoroll(n)
{ 
var e, d;

	e=Math.floor(Math.log(n)/Math.LN10);    //dona l'exponent en base 10
	d=n/Math.pow(10,e);
	if (parseFloat(OKStrOfNe(d, 4))==parseFloat(OKStrOfNe(d, 12)))
		return OKStrOfNe(d, 4)*Math.pow(10,e);
	else
		return n;
}

/*Aquesta funció retorna un número positiu arrodonit per sota a una
sola xifra significativa que només pot ser 1, 2 o 5. Joan Masó*/
function DonaNumeroArrodonit125(a)
{
	if (a<1e-20)
		return a;
	var e=Math.floor(Math.log(a)/Math.LN10);    //dona l'exponent en base 10
	var n=Math.abs(a/Math.pow(10,e));
	
	//Ara cal arrodinir a l'enter més proper:
	if (n<2)
		n=1;
	else if (n<5)
		n=2;
	else
		n=5;
	return n*Math.pow(10,e);
}



function RGB(r,g,b)
{
    if (r<0 || r>255 || g<0 || g>255 || b<0 || b>255)
	alert("Índex de color incorrecte: " + r + "," + g + "," + b +". Els índexs de color han d\'anar de 0 a 255.\n" +
		"Índice de color incorrecto: " + r + "," + g + "," + b +". Los índices de color deberian ir entre 0 i 255.\n" +
		  "Wrong color index: " + r + "," + g + "," + b +". Color indices has to be between 0 and 255.\n" +
		  "Index de couleur incorrect: " + r + "," + g + "," + b +". Les valeurs des index de couleurs doivent être comprises entre 0 et 255.");
   
    return "#" + (r.toString(16).length==1 ? "0"+r.toString(16) : r.toString(16))
		+ (g.toString(16).length==1 ? "0"+g.toString(16) : g.toString(16))
		+ (b.toString(16).length==1 ? "0"+b.toString(16) : b.toString(16));
}

function RGB_JSON(color)
{
    if (color.r<0 || color.r>255 || color.g<0 || color.g>255 || color<0 || color.b>255)
	alert("Índex de color incorrecte: " + color.r + "," + color.g + "," + color.b +". Els índexs de color han d\'anar de 0 a 255.\n" +
		"Índice de color incorrecto: " + color.r + "," + color.g + "," + color.b +". Los índices de color deberian ir entre 0 i 255.\n" +
		  "Wrong color index: " + color.r + "," + color.g + "," + color.b +". Color indices has to be between 0 and 255.\n" +
		  "Index de couleur incorrect: " + color.r + "," + color.g + "," + color.b +". Les valeurs des index de couleurs doivent être comprises entre 0 et 255.");
   
    return "#" + (color.r.toString(16).length==1 ? "0"+color.r.toString(16) : color.r.toString(16))
		+ (color.g.toString(16).length==1 ? "0"+color.g.toString(16) : color.g.toString(16))
		+ (color.b.toString(16).length==1 ? "0"+color.b.toString(16) : color.b.toString(16));
}

function DonaCaracterHexaMultiple3(s)
{
	if (s=='1')
		return '0';
	if (s=='2' || s=='4')
		return '3';
	if (s=='5' || s=='7')
		return '6';
	if (s=='8' || s=='a' || s=='A')
		return '9';
	if (s=='b' || s=='B' || s=='C' || s=='d' || s=='D')
		return 'c';
	if (s=='e' || s=='E' || s=='F')
		return 'f';
	return s;
}

function DonaFitxerColor(c)
{
	//Arrodoneix el valor del color
	var s=new String(c)	
	if (s.toLowerCase()=="#e6f2ff")
		s="colors/c"+s.substring(1,7)+".gif";	
	else
	{
		if (s.charAt(0)=='#')
			s="colors/c"+DonaCaracterHexaMultiple3(s.substring(1,2))+DonaCaracterHexaMultiple3(s.charAt(1))+DonaCaracterHexaMultiple3(s.substring(3,4))+DonaCaracterHexaMultiple3(s.charAt(3))+DonaCaracterHexaMultiple3(s.substring(5,6))+DonaCaracterHexaMultiple3(s.charAt(5))+".gif";
	}
	return s;
}

function DonaCadenaAmbCometesBarra(cadena)
{
	s=new String(cadena);
	for (var i=0; i<s.length; i++)
	{
		if (s.charAt(i)=='\'')
		{
			s=s.substring(0,i)+"\\\'"+s.substring(i+1,s.length);
			i++;
		}
		if (s.charAt(i)=='\"')
		{
			s=s.substring(0,i)+"\\\""+s.substring(i+1,s.length);
			i++;
		}
	}
	return s;
}

//Després de intentar fer servir l'objecte link() sense exit he hagut de fer això.
function DonaHost(s)
{
var s2;
	if (-1!=s.indexOf("://"))
	{
		s2=s.substring(s.indexOf("://")+3,s.length);
		if (-1!=s2.indexOf("/"))
			return s2.substring(0,s2.indexOf("/"));
		else
			return s2;
	}
	else
	{
		if (-1!=s.indexOf("/"))
			return s.substring(0,s.indexOf("/"));
		else
			return s;
	}
}

function DonaProtocol(s)  // Vull obtenir http: o https:,... d'una url d'un servidor
{
	if(-1!=s.indexOf("://"))
		return s.substring(0,s.indexOf("://")+1);
	return "";
}

//Extret de: http://www.xs4all.nl/~ppk/js/detect.html

function checkIt(detect, string)
{
	var place = detect.indexOf(string) + 1;
	return place;
}

var NecessariLayerIFrame=false;

function FesTestDeNavegador()
{
    if (!document.getElementById)
    {
		alert("Aquest navegador és massa antic i no suporta la funció javascript document.getElementById() pel que no funcionarà correctament. Actualitzeu-vos.\n" +
			"Este navegador es demassiado antiguo y no suporta la función javascript document.getElementById() por lo que no funcionará correctamente. Actualicese.\n" + 
			"This browser is too old and do not supports the javascript function document.getElementById(). It will not work properly. Please upgrade it.\n" +
			"Vous utilisez une version ancienne du navigateur qui ne supporte pas la fonction javascript document.getElementById(), par conséquent, il ne fonctionnera pas correctement. Actualisez la version.");
    }

    var detect = navigator.userAgent.toLowerCase();
    var OS, browser, version = 0, NomNavegador;

	if (checkIt(detect, 'konqueror'))
	{
		browser = "Konqueror";
		OS = "Linux";
		NomNavegador='konqueror';
	}
	else if (checkIt(detect, 'chrome'))
	{
		browser = "Chrome";
		NomNavegador='chrome';
	}
	else if (checkIt(detect, 'safari'))
	{
		browser = "Safari";
		NomNavegador='safari';
	}
	else if (checkIt(detect, 'omniweb')) 
	{
		browser = "OmniWeb";
		NomNavegador='omniweb';
	}
	else if (checkIt(detect, 'opera')) 
	{
		browser = "Opera";
		NomNavegador='opera';
	}
	else if (checkIt(detect, 'webtv'))
	{
		browser = "WebTV";
		NomNavegador='webtv';
	}
	else if (checkIt(detect, 'icab'))
	{
		browser = "iCab";
		NomNavegador='icab';
	}
	else if (checkIt(detect, 'msie'))
	{
		browser = "Internet Explorer";
		NomNavegador='msie';
	}
	else if (!checkIt(detect, 'compatible'))
	{
		browser = "Netscape Navigator";
		version = detect.charAt(8);
		NomNavegador='compatible';
	}
	else
	{ 
		browser = "An unknown browser";
	}

	if (!version)
	{
	   //Perform a search with regexp, looking for any number appearing after
		//the browser name, and a random character ( space or /, matched by the dot.
		//The parenthesis create the group that holds the value we want to capture.
	   var re= new RegExp(NomNavegador+".([0-9]*)");

		//We retrieve the element [1] (the first group), because [0] is the
	   //whole matched string.
	   version= parseInt(detect.match(re)[1],10);
	   //This old version only gets the first digit (failing for >9) and is not
	   //able to handle other inconsistencies.
	   //version = detect.charAt(detect.indexOf(NomNavegador) + 1 + NomNavegador.length);
	}

    if (!OS)
    {
		if (checkIt('linux')) OS = "Linux";
		else if (checkIt('x11')) OS = "Unix";
		else if (checkIt('mac')) OS = "Mac";
		else if (checkIt('win')) OS = "Windows";
		else OS = "an unknown operating system";
    }

    //Diverses precaucions sobre la versió dels navegadors:
    if (browser=="Internet Explorer")
    {
		if (version<8)
		{
			alert("S'ha detectat una versió " + version + " de " + browser + ". Aquest navegador de mapes necessita una versió 8 o posterior per a funcionar correctament.\n" +
				"Se ha detectado una versión " + version + " de " + browser + ". Este navegador de mapas necesita una versión 8 o posterior para funcionar correctamente.\n" + 
				"A version " + version + " of " + browser + " has been detected. This map browser need a version 8 o greater to work properly.\n"+
				"Une version " + version + " de " + browser + " a été détectée. Ce navigateur de couches a besoin d'une version 8 oû postérieure pour bien fonctionner.");
		}
		var appVer = navigator.appVersion.toLowerCase(); 
		var iePos = appVer.indexOf('msie'); 
		if (iePos !=-1) 
		{
			var is_minor = parseFloat(appVer.substring(iePos+5,appVer.indexOf(';',iePos))); 
			var is_major = parseInt(is_minor,10); 
		} 
		if (navigator.appName.substring(0,9) == "Microsoft" && is_major <= 6)
			NecessariLayerIFrame=true;
    }
    else if (browser=="Netscape Navigator")
    {
		if (version<5)
		{
			alert("S'ha detectat una versió " + version + " de " + browser + ". Aquest navegador de mapes necessita una versió 5 o posterior per a funcionar correctament (es recomana la versió 7).\n" +
				"Se ha detectado una versión " + version + " de " + browser + ". Este navegador de mapas necesita una versión 5 o posterior para funcionar correctamente (se recomienda la versión 7).\n" + 
				"A version " + version + " of " + browser + " has been detected. This map browser need a version 5 o greater to work properly (version 7 is recomended).\n"+
				"Une version " + version + " de " + browser + " a été détectée. Ce navigateur de couches a besoin d'une version 5 oû postérieure pour bien fonctionner (nous recommandons la version 7).");
		}
    }
    else if (browser=="Opera")
    {
		if (version<7)
		{
			alert("S'ha detectat una versió " + version + " de " + browser + ". Actualment, no hi ha cap versió de Opera que funcioni correctament amb aquest navegador de mapes, malgrat que la versió 7 gairebé resulta compatible.\n" +
				"Se ha detectado una versión " + version + " de " + browser + ". Actualmente, no existe ninguna versión de Opera que funcione correctamente con este navegador de mapas, aunque la versión 7 casi resulta compatible.\n" +
				"A version " + version + " of " + browser + " has been detected. Today, there is not any version of Opera that works properly with this map browser. Version 7 is almost compatible.\n" +
				"Une version " + version + " de " + browser + " a été détectée. Actuellement il n'y a aucune version d'Opera qui fonctionne bien avec ce navigateur de couches, bien que la version 7 c'est presque compatible.");
		}
		else if (version==7)
		{
			alert("S'ha detectat una versió " + version + " de " + browser + ". El funcionament d'aquest navegador de mapes és pobre en aquesta versió. Es deixa continuar amb finalitats experimentals.\n" +
				"Se ha detectado una versión " + version + " de " + browser + ". El funcionamiento de esta navegador de mapas es pobre en esta versión. Se deja continuar con finalidades experimentales.\n" +
				"A version " + version + " of " + browser + " has been detected. El performance of this map browser is poor on this version. It is allowed to continue with experimental proposes.\n" +
				"Une version " + version + " de " + browser + " a été détectée. Le fonctionnement de ce navigateur de couches est réduit en cette version. On le maintient a des fins finalités expérimentales.");
		}
    }
    else if (version<5)
    {
		alert("S'ha detectat la versió " + version + " del navegador " + browser + ". Aquest navegador no ha estat testat i la versió indicada és inferior a la 5. Es deixa continuar però no garantim el funcionament correcte d'aquest navegador de mapes.\n" +
			"Se ha detectado la versión " + version + " del navegador " + browser + ". Este navegador no ha sido testeado y la versión indicada es inferior a la 5. Es deja continuar pero no se garantiza el funcionamento correcto de este navegador de mapas.\n" +
			"Version " + version + " of the browser " + browser + " has been detected. This browser has not been tested and the indicated version is lower than 5. It is allowed to continue but we cannot guaranty a correct performance of this map browser.\n"+
			"Une version " + version + " de " + browser + " a été détectée. Ce navigateur n'a pas été testé et la version indiquée est antérieure au la version 5. On laisse poursuivre mais on ne garantit pas le fonctionnement correct de ce navigateur de couches.");
    }
}

FesTestDeNavegador();

/////////////////////////////////////////////
/*Definició de les clases propies del Navegador de Mapes de MiraMon*/
/* Aquest constructor no s'usa i es deia només com a documentació del JSON
function CadenaMultiIdioma(cat,spa,eng,fre)
{
    this.cat=cat;
    this.spa=spa;
    this.eng=eng;
	this.fre=fre;
}*/

var OrigenEsqSituacio=0;
var OrigenSupSituacio=0;

var MidaDePixelPantalla=0.28;  //Mida del píxel de pantalla en metres. Això es podria tenir com un paràmetre igual que en MiraMon

/* Aquest constructor no s'usa i es deixa només com a documentació del JSON
function CreaParametresVistaCapaTiled(tile_matrix, i_tileMin, i_tileMax, j_tileMin, j_tileMax, dx, dy)
{
	this.TileMatrix=tile_matrix;
	this.ITileMin=i_tileMin;
	this.ITileMax=i_tileMax;
	this.JTileMin=j_tileMin;
	this.JTileMax=j_tileMax;
	this.dx=dx; 
	this.dy=dy;
}

function CreaParametresInternsDeControl(env_actual, env_capa, env_ll_situacio, ample_situacio, alt_situacio, marge_esq_situacio, marge_sup_situacio, i_situacio, costat_zoom_actual, zoom_previ, n_zoom_previ_usat, punt_ori, vista, flags)
{
	this.EnvActual=env_actual;
	this.EnvLLCapa=env_capa; 
	this.EnvLLSituacio=env_ll_situacio;
	this.AmpleSituacio=ample_situacio;
	this.AltSituacio=alt_situacio;
	this.MargeEsqSituacio=marge_esq_situacio;
	this.MargeSupSituacio=marge_sup_situacio;
	this.ISituacio=i_situacio;
	this.CostatZoomActual = costat_zoom_actual;
	this.ZoomPrevi = zoom_previ;
	this.NZoomPreviUsat = n_zoom_previ_usat;
	this.PuntOri=punt_ori;   //Punt del angle inferior esquerra on està actualment la vista
	this.VistaCapaTiled=vista;  //De moment només útil pel cas tiled. Conté una array de new CreaParametresVistaCapaTiled() per cada capa si és tiled. No té res a veure amb si hi ha més d'una "vista" del mapa.
	this.flags=flags;
}
*/


function DonaVersioDeCadena(vers)
{
	//If only provided an String of type "1.1.1" then try to parse for the other arguments
	var version= vers.split(".");
	if(version.length!==3)
	{
		alert("Version format must follow the pattern #.#.# but got '"+version+"' instead");
		return {"Vers": 1, "SubVers": 0, "VariantVers": 0};
	}
	return {"Vers": parseInt(version[0],10), "SubVers": parseInt(version[1],10), "VariantVers": parseInt(version[2],10)};
}


/*function CreaVisibleVista(i_vista, opacity, semitransparent)  No implementat mai encara
{
	this.i_vista;  //-1: all, 0, 1, 2...
	this.opacity;  //0.0-1.0 opacity
	this.semitransparent;  //true
}*/


function CreaItemIdentificadorConsultaTipica(index,valor_id)
{
	this.index=index;
	this.id=valor_id;
}

/* Aquest constructor no s'usa i es deixa només com a documentació del JSON
function CreaItemProjeccioConsultaTipica(valor,env)
{
	this.valor=valor;
	this.env=env;
}*/

/*function CreaCapaConsulta(nom, desc, camp, proj_camp)
{
        this.nom=nom;
	this.desc=desc;
	this.camp=camp;
	this.proj_camp=proj_camp;
}
capa_consulta=[];
*/

/* Aquest constructor no s'usa i es deixa només com a documentació del JSON
function CreaCampConsultaTipica(previ, nom, desc, post)
{
    this.previ=previ;
    this.nom=nom;
    this.desc=desc;
    this.post=post;
}

function CreaCapaPreguntaServidorConsultaTipica(servidor, nom, camps, crs)
{   
	this.servidor=servidor;
	this.nom=nom;
	this.camps=camps;  //Array de CreaCampConsultaTipica: noms,descripcions de camps i textos anteriors i posterios, ordenats en funció de com estan continguts  1er Municipis - 2on Provincies
	this.CRS=crs;
}

function CreaConsultaTipicaIntern(servidor, nom, camps, crs, proj_camp, id_camp)
{
	this.servidor=servidor;
	this.nom=nom;
	this.camps=camps;  //Array de CreaCampConsultaTipica:noms, descripcions de camps i textos anteriors i posterios, ordenats en funció de com estan continguts  1er Municipis - 2on Provincies
	this.CRS=crs;
	this.proj_camp=proj_camp;  //Array de les projeccions de cada camp
	this.id_camp=id_camp; //Array de les taules de identificadors que relacionen els diferents camps
}*/

var IPlantillaDImpressio=0;

var CalImprimirTitol=0x0001;
var CalImprimirVista=0x0002;
var CalImprimirSituacio=0x0004;
var CalImprimirLlegenda=0x0008;
var CalImprimirEscala=0x0010;
var RespectarResolucioVistaImprimir=0x0020;  //Per contraposició a respectar àmbit.
//var CalImprimirCoordProj=0x0040;
//var CalImprimirCoordLongLatG=0x0080;
//var CalImprimirCoordLongLatGMS=0x0100;



var accio_anar_coord=0x0001;
var accio_conloc=0x0002;
var accio_validacio=0x0004;

function CreaAccio(accio,servidor, coord, buffer, capes, camps, valors, id_trans, feta)
{
	this.accio=accio;
	this.servidor=servidor;
	this.coord=coord; //Punt que es vol validar
	this.buffer=buffer;
	this.capes=capes; //Array de capes que es volen validar
	this.camps=camps; //Array de camps de les capes (1 per cada capa en el mateix ordre)
	this.valors=valors; //Array de valors dels camps (1 per cada camp en el mateix ordre)
	this.id_trans=id_trans; //Identificador de la transacció
	this.feta=feta; //feta:true--> acció despatxada, feta:false --> acció cancel·lada
}

/*LlistaServOWS=[]; es deixa només com a documentació del JSON
function CreaLListaServidorsOWS(url, nom, tipus, categoria)
{
	this.url=url;
	this.nom=nom;
	this.tipus=tipus;
	this.categoria=categoria; 
}*/
