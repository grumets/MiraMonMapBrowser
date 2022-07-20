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

    Copyright 2001, 2022 Xavier Pons

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

var ToolsMMN="https://github.com/joanma747/MiraMonMapBrowser";
var VersioToolsMMN={"Vers": 6, "SubVers": 0, "VariantVers": null};
var clientName= "MiraMon Map Browser";
var config_schema_estil="config-schema.json#/definitions/estil";

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
IncludeScript("imgtiff.js");
IncludeScript("geomet.js");
IncludeScript("vector.js");
IncludeScript("paletes.js");
IncludeScript("capavola.js");
IncludeScript("editavec.js", true);
IncludeScript("datahora.js");
IncludeScript("video.js");
IncludeScript("stats.js");
IncludeScript("gaussian_fit_1d.js");
IncludeScript("phenology.js");
IncludeScript("qualitat.js");
IncludeScript("llinatge.js");
IncludeScript("cntxmenu.js");
IncludeScript("wmscapab.js");
IncludeScript("novacapa.js");
IncludeScript("llegenda.js");
IncludeScript("situacio.js");
IncludeScript("coord.js");
IncludeScript("barra.js");
IncludeScript("download.js");
IncludeScript("storymap.js");
IncludeScript("params.js");
IncludeScript("commands.js");
//IncludeScript("xml.js");   //Ja les carrega el GUF.js
//IncludeScript("owc_atom.js");  //Ja les carrega el guf.js
//IncludeScript("wps_iso_guf.js", true);  //Ja les carrega el GUF.js
//IncludeScript("guf_locale.js", true);   //Ja les carrega el GUF.js
IncludeScript("gml.js", true);
IncludeScript("owsc.js", true);
IncludeScript("wps.js", true);
IncludeScript("guf.js", true);
IncludeScript("histopie.js", true);
IncludeScript("jsonpointer.js");
IncludeScript("Chart.bundle.min.js", true);
IncludeScript("moment.min.js", true);
IncludeScript("3d.js", true);
IncludeScript("vis.min.js", true);

IncludeScript("msg.js", true);

var IdProces=Math.random()*100000;
var NIdProces=0;
var NConsultesZero, NConsultesDigiZero, NCapesConsultables, NCapesDigiConsultables;
var timeoutCreaVistes=null;
var Accio={};
var AccioAnarCoord=0x0001;
var AccioConLoc=0x0002;
var AccioValidacio=0x0004;

//constants per i_nova_vista
var NovaVistaPrincipal=-1;
var NovaVistaImprimir=-2;
var NovaVistaRodet=-3;  //El rodet de petites previsualitzacions de la serie temporal
var NovaVistaVideo=-4;  //El el fotogrames de la serie temporal
//Els números positius es reserven per les vistes instantàneas (array NovaVistaFinestra)

//allows compatibility between IE8 and modern browsers
function MMgetEventButton(event)
{
	if(typeof event.which === "undefined") //IE8 http://unixpapa.com/js/mouse.html
		return {first:event.button===1,middle:event.button===4,second:event.button===2};
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
var elems= DOMElement.children, length= elems.length;
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

function DonaServidorCapa(capa)
{
	if (capa.servidor==null)   //Els servidors vectorials distigeixen entre null i undefined. Caldria analitzar be això per poder canviar a una condició més simple
		return ParamCtrl.ServidorLocal;
	return capa.servidor;
}

function DonaVersioServidorCapa(capa)
{
	if (!capa.versio)
		return ParamCtrl.VersioServidorLocal;
	return capa.versio;
}

function DonaTipusServidorCapa(capa)
{
	if (!capa.tipus)
		return ParamCtrl.TipusServidorLocal;
	return capa.tipus;
}

function DonaCorsServidorCapa(capa)
{
	if (typeof capa.cors==="undefined" || capa.cors==null)
		return ParamCtrl.CorsServidorLocal;
	return capa.cors;
}

function MostraEnllacWMS(finestra)
{
	showFinestraLayer(window, finestra);
}

function AmagaLayerMissatges()
{
	hideLayer(getLayer(window,"missatges"));
}

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
	return s;
}

function DonaVersioComAText(v)
{
	if (v.VariantVers===0 || v.VariantVers)
		return v.Vers+"."+v.SubVers+"."+v.VariantVers;
	else
		return v.Vers+"."+v.SubVers
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

function CompletaDefinicioCapa(capa, capa_vola)
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

	if (!capa.visible)
		capa.visible="si";

	if (!capa.consultable)
		capa.consultable="si";

	if (!capa.descarregable)
		capa.descarregable="no";

	if (!capa.editable)
		capa.editable="no";

	//Evito haver de posar el nom i la descripció del video si la capa és animable sola.
	if (capa.animable && capa.AnimableMultiTime && capa.data && capa.data.length>1)
	{
		if (!capa.NomVideo)
			capa.NomVideo=capa.nom;
		if (!capa.DescVideo)
			capa.DescVideo=JSON.parse(JSON.stringify(capa.desc));
	}
	var tipus=DonaTipusServidorCapa(capa);
	if (tipus=="TipusWMS_C" || tipus=="TipusWMTS_REST" || tipus=="TipusWMTS_KVP" || tipus=="TipusWMTS_SOAP" || tipus=="TipusOAPI_MapTiles"/*|| tipus=="TipusGoogle_KVP"*/)
	{
		capa.VistaCapaTiled={"TileMatrix": null, "ITileMin": 0, "ITileMax": 0, "JTileMin": 0, "JTileMax": 0, "dx": 0, "dy": 0};
	}

	if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features" || tipus=="TipusSOS" || (tipus=="TipusHTTP_GET" && capa.FormatImatge=="application/geo+json") || (capa.objectes && capa.objectes.features) )
		capa.model=model_vector;

	if (tipus=="TipusHTTP_GET" && !capa.DescarregaTot)
	{
		var i_format;
		//Contrueixo la manera de descarregar automàticament.
		if (!ParamCtrl.FormatDescarregaTot)
			ParamCtrl.FormatDescarregaTot=[];
		if (capa.model==model_vector)
		{
			//Hi ha el format que toca la l'array de formats?
			for (i_format=0; i_format<ParamCtrl.FormatDescarregaTot.length; i_format++)
			{
				if ((capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json") && 
					(ParamCtrl.FormatDescarregaTot.extension=="json" || ParamCtrl.FormatDescarregaTot.extension=="geojson"))
					break;
			}
			if (i_format==ParamCtrl.FormatDescarregaTot.length)
				ParamCtrl.FormatDescarregaTot.push({format: {nom:"geojson", desc:"GeoJSON"}, extension:"json"});
			capa.DescarregaTot=[{desc: "GeoJSON", url:capa.servidor, format:[i_format]}];
		}
		else
		{
			//Hi ha el format que toca la l'array de formats?
			for (i_format=0; i_format<ParamCtrl.FormatDescarregaTot.length; i_format++)
			{
				if (capa.FormatImatge=="image/tiff" && 
					(ParamCtrl.FormatDescarregaTot.extension=="tif" || ParamCtrl.FormatDescarregaTot.extension=="tiff"))
					break;
			}
			if (i_format==ParamCtrl.FormatDescarregaTot.length)
				ParamCtrl.FormatDescarregaTot.push({format: {nom: "geotiff", desc:"GeoTIFF (COG)"}, extension:"tif"});
			if (!capa.valors || !capa.valors[0].url)
				capa.DescarregaTot=[{desc: "GeoTIFF", url:capa.servidor, format:[i_format]}];
			else
			{
				var url, valor;
				capa.DescarregaTot=[];
				for (var i_v=0; i_v<capa.valors.length; i_v++)
				{
					url = capa.servidor;
					valor = capa.valors[i_v];
					if (valor.url)
					{
						if (url.charAt(url.length-1)!='/' && valor.url.charAt(0)!='/')
						url += '/';
						url += valor.url;
					}
					capa.DescarregaTot.push({desc: GetMessage("Band")+" "+(i_v+1)+" (GeoTIFF, COG)", url:url, format:[i_format]});
				}
			}
		}		
		//Poso una descarrega per tot o una descàrrega per a cada valor segons calgui.
	}

	if (!capa_vola)
	{
		if (capa.model==model_vector)
		{
			if (!capa.CRSgeometry)
				capa.CRSgeometry=ParamCtrl.ImatgeSituacio[0].EnvTotal.CRS;
			InicialitzaTilesSolicitatsCapaDigi(capa);
			CanviaCRSITransformaCoordenadesCapaDigi(capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		}
	}
	if (capa.model==model_vector)
		CarregaSimbolsEstilActualCapaDigi(capa);
}

function CompletaDefinicioCapes()
{
	for (var i=0; i<ParamCtrl.capa.length; i++)
		CompletaDefinicioCapa(ParamCtrl.capa[i], EsIndexCapaVolatil(i,ParamCtrl));
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

function DonaCadenaNomDesc(a)
{
	return a.desc ? DonaCadena(a.desc) : a.nom;
}

function DonaCadenaNomDescItemsLleg(estil)
{
	return estil.DescItems ? DonaCadena(estil.DescItems) : DonaCadenaNomDesc(estil);
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

function GetMessage(msg_id, section)
{
	if (section)
	{
		if (-1!=section.indexOf("."))
		{
			var sections=section.split("."), place=MessageLang;
			for (var i=0; i<sections.length; i++)
			{
				if (!place[sections[i]])
				{
					alert("MessageLang Error: I cannot found section \""+sections[i]+"\" in \""+section+"\"");
					return "["+GetMessage("MissingMessage")+"]";
				}
				place=place[sections[i]];
			}
			if (!place[msg_id])
			{
				alert("MessageLang Error: I cannot found message id \""+msg_id+"\" in \""+section+"\"");
				return "["+GetMessage("MissingMessage")+"]";
			}
			return DonaCadenaLang(place[msg_id]);
		}
		if (!MessageLang[section])
		{
			alert("MessageLang Error: I cannot found section \""+section+"\"");
			return "["+GetMessage("MissingMessage")+"]";
		}
		if (!MessageLang[section][msg_id])
		{
			alert("MessageLang Error: I cannot found message id \""+msg_id+"\" in \""+section+"\"");
			return "["+GetMessage("MissingMessage")+"]";
		}
		return DonaCadenaLang(MessageLang[section][msg_id]);
	}	
	if (!MessageLang[msg_id])
	{
		alert("MessageLang Error: I cannot found message id \""+msg_id+"\" as a 'root' message");
		if (msg_id=="MissingMessage")
			return "[Missing message]"
		return "["+GetMessage("MissingMessage")+"]";
	}
	return DonaCadenaLang(MessageLang[msg_id]);
}

function GetMessageJSON(msg_id, section)
{
	if (section)
	{
		if (-1!=section.indexOf("."))
		{
			var sections=section.split("."), place=MessageLang;
			for (var i=0; i<sections.length; i++)
			{
				if (!place[sections[i]])
				{
					alert("MessageLang Error: I cannot found section \""+sections[i]+"\" in \""+section+"\"");
					return "["+GetMessage("MissingMessage")+"]";
				}
				place=place[sections[i]];
			}
			if (!place[msg_id])
			{
				alert("MessageLang Error: I cannot found message id \""+msg_id+"\" in \""+section+"\"");
				return "["+GetMessage("MissingMessage")+"]";
			}
			return place[msg_id];
		}
		if (!MessageLang[section])
		{
			alert("MessageLang Error: I cannot found section \""+section+"\"");
			return "["+GetMessage("MissingMessage")+"]";
		}
		if (!MessageLang[section][msg_id])
		{
			alert("MessageLang Error: I cannot found message id \""+msg_id+"\" in \""+section+"\"");
			return "["+GetMessage("MissingMessage")+"]";
		}
		return MessageLang[section][msg_id];
	}	
	if (!MessageLang[msg_id])
	{
		alert("MessageLang Error: I cannot found message id \""+msg_id+"\" as a 'root' message");
		if (msg_id=="MissingMessage")
			return "[Missing message]"
		return "["+GetMessage("MissingMessage")+"]";
	}
	return MessageLang[msg_id];
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

/* Es substitueix aquesta funció per DonaCadenaLang al
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

function CombinaURLServidorAmbParamPeticio(servidor, request)
{
	if(request.indexOf("=")==-1)	
		return DonaNomServidorSenseCaracterFinal(servidor) + request;
	if (request.indexOf("?")==-1)
		return DonaNomServidorCaracterFinal(servidor) + request;
	if ((servidor.charAt(servidor.length-1)=="?")  // ·$· Potser també caldria mirar que l'interrogant sigui a dins del servidor i dins de la request i després cal fer espai per inserir la request al mig i treure el ? del servidor
		|| (servidor.charAt(servidor.length-1)=="/" &&  request.charAt(0)=="/"))
		returnservidor.substring(0, servidor.length-1) + request;
	return servidor + request;
}

function AfegeixNomServidorARequest(servidor, request, es_ajax, suporta_cors)
{
	if (!suporta_cors && es_ajax && location.host && DonaHost(servidor).toLowerCase()!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
	{
		var s_host=DonaHost(ParamCtrl.ServidorLocal);
		var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
		if (s_host.toLowerCase()!=location.host.toLowerCase())
		{
			//Canvio l'arrel del servidor local per l'arrel de la plana del navegador per estar segur que l'ajax funcionarà sense "cross server vulmerability".
			return CombinaURLServidorAmbParamPeticio(ParamCtrl.ServidorLocal.substring(0,pos_host)+location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length), request) + "&ServerToRequest="+DonaNomServidorSenseCaracterFinal(servidor);
		}
		return CombinaURLServidorAmbParamPeticio(ParamCtrl.ServidorLocal,request)  + "&ServerToRequest="+DonaNomServidorSenseCaracterFinal(servidor);
	}
	return CombinaURLServidorAmbParamPeticio(servidor, request);
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

	if (ParamCtrl.ConsultaTipica && ParamCtrl.CapaConsultaPreguntaServidor.length>0 && NCapesCTipicaCarregades==ParamCtrl.CapaConsultaPreguntaServidor.length)
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
	var elem=getFinestraLayer(window, "multi_consulta");
	if(isLayer(elem) && isLayerVisible(elem))
		CreaConsulta(window, 0);

	elem=getFinestraLayer(window, "executarProces");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("executarProces");  //Em falta un parametre per iniciar-la IniciaFinestraExecutaProcesCapa(i_capa);

	elem=getFinestraLayer(window, "afegirCapa");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("afegirCapa");  //Em falta una parametre per iniciar-la IniciaFinestraAfegeixCapaServidor(i_capa);

	elem=getFinestraLayer(window, "seleccioCondicional");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("seleccioCondicional");  //Em falta una parametre per iniciar-la ObreFinestraSeleccioCondicional(i_capa);

	elem=getFinestraLayer(window, "combinacioRGB");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("combinacioRGB"); //Em falta una paràmetre per iniciar-la

	elem=getFinestraLayer(window, "seleccioEstadistic");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("seleccioEstadistic"); //Em falta una paràmetre per iniciar-la

	elem=getFinestraLayer(window, "anarCoord");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraAnarCoordenada();

	elem=getFinestraLayer(window, "param");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraParametres();

	elem=getFinestraLayer(window, "download");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraDownload();

	elem=getFinestraLayer(window, "video");
	if(isLayer(elem) && isLayerVisible(elem))
		MostraFinestraVideo();

	elem=getFinestraLayer(window, "consola");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraConsola();

	elem=getFinestraLayer(window, "enllac");
	if(isLayer(elem) && isLayerVisible(elem))
		MostraFinestraEnllac();

	elem=getFinestraLayer(window, "enllacWMS");
	if(isLayer(elem) && isLayerVisible(elem))
		MostraFinestraEnllacWMS();

	elem=getFinestraLayer(window, "editarVector");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("editarVector");

	elem=getFinestraLayer(window, "mostraLlinatge");
	if(isLayer(elem))  // Encara que no sigui visible vull canviar el contingut sino quan l'obri si té algun graf es mostraria en l'idioma anterior
		OmpleFinestraLlinatge({elem: elem, i_capa: -1, redibuixat: true});

	if (IStoryActive!==null)
	{
		if (IStoryActive<0)
			MostraFinestraTriaStoryMap();
		else
			IniciaStoryMap(IStoryActive);
	}
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
var i;
    for (i=0; i<ParamCtrl.zoom.length; i++)
    {
		if (ParamCtrl.zoom[i].costat>costat*0.9999 && ParamCtrl.zoom[i].costat<costat*1.0001)
		    return i;
    }
    var d=ParamCtrl.zoom[0].costat-costat;
    var d_min=d;
    var i_retorn=((d_min>0) ? 0 : -1);
    for (i=1; i<ParamCtrl.zoom.length; i++)
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
	if (ParamCtrl.LlegendaLligaVisibleAmbDescarregable)
	{
		if( (nou_estat=="si" || nou_estat=="semitransparent") && ParamCtrl.capa[i_capa].descarregable=="ara_no")
			ParamCtrl.capa[i_capa].descarregable="si";
		else if((nou_estat=="no" || nou_estat=="ara_no") && ParamCtrl.capa[i_capa].descarregable=="si")
			ParamCtrl.capa[i_capa].descarregable="ara_no";
	}
	ParamCtrl.capa[i_capa].visible=nou_estat;
}

//A diferència de CanviaEstatVisibleCapaLlegenda, aquesta funció no toca res de la llegenda ni força un redibuixat
function CanviaEstatVisibleCapa(i_capa, nou_estat)
{
var capa=ParamCtrl.capa[i_capa], capa2, grup_consultable=false;

	if (nou_estat=="si" || nou_estat=="semitransparent")
	{
		if (capa.grup)
		{
			for (var i_capa2=0; i_capa2<ParamCtrl.capa.length; i_capa2++)
			{
				if (i_capa2==i_capa)
					continue;
				capa2=ParamCtrl.capa[i_capa2];
				if (capa.grup==capa2.grup && 
				    EsCapaVisibleAAquestNivellDeZoom(capa2))
				{
					//In the case of groups We sincronize the querible (consultable) with the visible property.
					if (!(ParamCtrl.LlegendaGrupsComARadials && ParamCtrl.LlegendaGrupsComARadials==true))
					{
						if (!confirm(GetMessage("NotPossibleShowLayersSameGroup", "miramon") + ".\n" + GetMessage("TheLayer") +
							" \"" + DonaCadena(capa2.desc) + "\", " +
							GetMessage("alsoMemberToTheGroup", "miramon") + 
							" \"" + capa2.grup + "\", " +
							GetMessage("willBeDeselected", "miramon") + ".")) 
							return;
					}
					if (nou_estat=="si" || nou_estat=="semitransparent")
						CanviaEstatVisibleISiCalDescarregableCapa(i_capa2, "ara_no"); 

					if (capa2.consultable=="si")
					{
						capa2.consultable=="ara_no"
						grup_consultable=true;
					}
					break;
				}
			}
		}
	}
	CanviaEstatVisibleISiCalDescarregableCapa(i_capa, nou_estat);
	if (grup_consultable && capa.consultable=="ara_no")
		capa.consultable=="si"
}

function RevisaEstatsCapes()
{
var capa, capa2;
	//De moment només revisa que en un grup la capa activa no estigui oculta.
	//Si està oculta i una altre capa del grup és visible, aquesta queda activada.
	if (ParamCtrl.LlegendaAmagaSegonsEscala || ParamCtrl.LlegendaGrisSegonsEscala)
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

var RectVistaAbansFullScreen=null;

function PortaVistaAFullScreen()
{
	//Si hi ha més d'una vista avisar que no te sentit fer-ho i plegar
	if (ParamCtrl.VistaPermanent[0].length>1)
	{
		alert(DonaCadenaLang({"cat":"No es possible saltar a pantalla completa en un navegador multivista.", "spa":"No es posible saltar a pantalla completa en un navegador multivista.",
						  "eng":"You cannot go full screen in a multiview browser.", "fre":"Vous ne pouvez pas accéder au plein écran dans un navigateur à vues multiples."}));
		ParamCtrl.fullScreen=0;
		return;
	}
	var vista=getLayer(window, ParamCtrl.VistaPermanent[0].nom);
	//Guardar la posició de la finestra de la vista.
	RectVistaAbansFullScreen=getRectLayer(vista);

	//Canviar la posició de la finestra de la vista per ocupar tota la pantalla
	moveLayer(vista, 0, 0, window.document.body.clientWidth, window.document.body.clientHeight);
	if (isFinestraLayer(window, "situacio") && isFinestraLayerVisible(window, "llegenda"))
		hideFinestraLayer(window, "situacio");
	if (isFinestraLayer(window, "coord") && isFinestraLayerVisible(window, "coord"))
		hideFinestraLayer(window, "coord");
	if (isFinestraLayer(window, "llegenda") && isFinestraLayerVisible(window, "llegenda"))
		hideFinestraLayer(window, "llegenda");
	RepintaMapesIVistes();
}

function PortaVistaANormalScreen()
{
	if (!RectVistaAbansFullScreen)
		return;
	var vista=getLayer(window, ParamCtrl.VistaPermanent[0].nom);

	//Recuperar la posició de la finestra de la vista.
	moveLayer(vista, RectVistaAbansFullScreen.esq, RectVistaAbansFullScreen.sup, RectVistaAbansFullScreen.ample, RectVistaAbansFullScreen.alt);
	RectVistaAbansFullScreen=null;
	//Recuperar la posició de la caixa de coordenades.
}

function GoFullScreenEvent(event)
{
	if (ParamCtrl.fullScreen)  //This should not happen
		alert("Already in full screen");

	//Moure la caixa de la coordenada actual adientment
	//openFullscreen(document.documentElement);
	openFullscreen(document.getElementById(ParamCtrl.containerName));

	//Es produexi un event de resize automaticament RepintaMapesIVistes();
	dontPropagateEvent(event);
}

function ExitFullScreenEvent(event)
{
	if (!ParamCtrl.fullScreen)  //This should not happen
		alert("Not in full screen");
	if (ParamCtrl.fullScreen==2)
		closeFullscreen();
	else if (ParamCtrl.fullScreen==1)
	{
		ParamCtrl.fullScreen=0;
		ResizeMiraMonMapBrowser()
	}
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


function NetejaParamCtrl(param_ctrl, is_local_storage)
{
	param_ctrl.NivellZoomCostat=ParamInternCtrl.vista.CostatZoomActual;  //Recupero el costat de zoom actual
	param_ctrl.ISituacioOri=ParamInternCtrl.ISituacio; //Recupero el mapa de situació, que indica el CRS

	//Buido les coses grans que he afegit al param_ctrl abans de guardar la configuració.
	//De fet, tots les elements documentats com "INTERN" al config-schema s'haurien d'esborrar.
	for (var i_capa=0; i_capa<param_ctrl.capa.length; i_capa++)
	{
		if (EsIndexCapaVolatil(i_capa, param_ctrl))
		{
			//Esborro la capa calladament:
			EliminaCapaVolatil(i_capa, param_ctrl);
			i_capa--;
			continue;
		}
		var capa=param_ctrl.capa[i_capa];
		BuidaArrayBufferCapa(capa);
		//Buida objectes vectorials si han vingut d'un servidor.
		if (capa.model==model_vector && (capa.tipus=="TipusWFS" || capa.tipus=="TipusOAPI_Features" || capa.tipus=="TipusSOS" || capa.tipus=="TipusHTTP_GET"))
			delete capa.objectes;
		DescarregaSimbolsCapaDigi(capa);
		if (capa.TileMatrixGeometry)
		{
			if(capa.TileMatrixGeometry.tiles_solicitats)
				delete capa.TileMatrixGeometry.tiles_solicitats;
			if(capa.TileMatrixGeometry.env)
				delete capa.TileMatrixGeometry.env;
		}

		if (capa.EnvTotalLL)
			delete capa.EnvTotalLL;

		if (capa.estil && capa.estil.length>0)
		{
			for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
			{
				var estil=capa.estil[i_estil];
				if (estil.component)
				{
					for (var i_c=0; i_c<estil.component.length; i_c++)
					{
						if (estil.component[i_c].calcul && estil.component[i_c].FormulaConsulta)
							delete estil.component[i_c].FormulaConsulta;
						if (estil.component[i_c].formulaInterna)
							delete estil.component[i_c].formulaInterna;
					}
				}
				
				if (estil.diagrama && estil.diagrama.length>0)
				{
					for (var i_diagrama=0; i_diagrama<estil.diagrama.length; i_diagrama++)
					{	// en tancar el navegador anoto al config les coses que mecessitaré per tornar a obrir la caixa igual, i esborro el i_histograma que és la marca que la fienstra no s'ha obert
						// posició finestra
						var nom_finestra="";
						
						if (estil.diagrama[i_diagrama].tipus == "chart" ||  estil.diagrama[i_diagrama].tipus == "chart_categ" || estil.diagrama[i_diagrama].tipus == "matriu" || 
								estil.diagrama[i_diagrama].tipus == "stat" || estil.diagrama[i_diagrama].tipus == "stat_categ")
							nom_finestra=DonaNomHistograma(estil.diagrama[i_diagrama].i_histograma);
						else if (estil.diagrama[i_diagrama].tipus == "vista3d")
							nom_finestra=DonaNomGrafic3d(estil.diagrama[i_diagrama].i_histograma);
						
						if (nom_finestra != "")
						{
							for (var i_layer_fin=0; i_layer_fin<layerFinestraList.length; i_layer_fin++)
							{
								if (layerFinestraList[i_layer_fin].nom == nom_finestra)							
									break;
							}
							if (i_layer_fin < layerFinestraList.length) //he identificar quina finestra era
							{
								var div=getBarraLayer(window, nom_finestra);
								estil.diagrama[i_diagrama].left=parseInt(div.style.left);
								estil.diagrama[i_diagrama].top=parseInt(div.style.top);
								if (estil.diagrama[i_diagrama].tipus == "matriu" || estil.diagrama[i_diagrama].tipus == "stat" || estil.diagrama[i_diagrama].tipus == "stat_categ")
								{	//les uniques redimensionables
									div=getFinestraLayer(window, nom_finestra);
									estil.diagrama[i_diagrama].width=parseInt(div.style.width); //encara no s'usa en recarregar la finestra
									estil.diagrama[i_diagrama].height=parseInt(div.style.height); //encara no s'usa en recarregar la finestra
								}
							}
							//else -> si no l'he identificat, no anoto res i el proper cop s'obrirà a la posició per defecte
						}
						
						// mida finestra -> s'haurà de fer més endavant, si fem que aquestes caixes siguin redimensionables (ara no ho són)
						
						/* dades del darrer gràfic visualitzat + estat dianmisme (important per si tinc un gràfic estàtic i he de desar 
						aquestes dades que ja no surten de la vita actual!, i també important per poder obrir totes les finestres 
						des del principi encara que no estigui veient aquesta capa/estil concret * / 
						if (estil.diagrama[i_diagrama].tipus == "chart")
						{
							estil.diagrama[i_diagrama].chart=[];
							for (var i_c=0; i_c<estil.component.length; i_c++)
							{
								var retorn_prep_histo=PreparaHistograma(estil.diagrama[i_diagrama].i_histograma, i_c);												
								/*estil.diagrama[i_diagrama].chart.push({labels: retorn_prep_histo.label, valors: (retorn_prep_histo.valors ? retorn_prep_histo.valors : null),
									data: retorn_prep_histo.data, backgroundColor: retorn_prep_histo.colors, unitats: retorn_prep_histo.unitats, options: retorn_prep_histo.options});* /	
							}
						}
						else if (estil.diagrama[i_diagrama].tipus == "matriu")
							estil.diagrama[i_diagrama].matriu=CreaTextMatriuDeConfusio(estil.diagrama[i_diagrama].i_histograma, true);
						//else if (estil.diagrama[i_diagrama].tipus == "stat")
							//··*/
						// esborrar i_histograma
						delete estil.diagrama[i_diagrama].i_histograma; //en reiniciar serà la marca que no s'ha creat a finestra encara
					}
				}	
			}
		}			
						
		if (capa.metadades && capa.metadades.provenance && capa.metadades.provenance.peticioServCSW=="true" && capa.metadades.provenance.lineage)
			delete capa.metadades.provenance.lineage;
	}
	EliminaIndexDeCapesVolatils(param_ctrl);

	EliminaProjCampIIdCampSiServidor(param_ctrl);

	if (is_local_storage==false)
	{
		delete param_ctrl.mmn;
		delete param_ctrl.config_json;
	}

	RemoveOtherPropertiesInObjWithRef(param_ctrl);
}

function CreaDuplicatNetejaiMostraParamCtrl(text_area)
{
	var param_ctrl=JSON.parse(JSON.stringify(ParamCtrl));
	NetejaParamCtrl(param_ctrl, false);
	document.getElementById(text_area).value=JSON.stringify(param_ctrl, null, '\t');
}

function CarregaiAdoptaParamCtrl(s)
{
	try {
		var param_ctrl=JSON.parse(s);
	}
	catch (e) {
			alert("JSON string error: "+ e);
			return 1;
	}
	FinalitzaMiraMonMapBrowser();
	//La seguent crida tancarà la caixa i reiniciarà el navegador amb els nous parametres
	IniciaParamCtrlIVisualitzacio(param_ctrl, {div_name: ParamCtrl.containerName, config_json:ParamCtrl.config_json, config_reset: true/*, usa_local_storage: false*/});
	return 0;
}

var nfilVistaImprimir;
var VistaImprimir={ "EnvActual": {"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0},
				 "nfil": 0,
				 "ncol": 0,
				 "CostatZoomActual": 0,
				 "i_vista": -2,
				 "i_nova_vista": NovaVistaImprimir};  //El significat de "i_nova_vista" es pot trobar a la funció PreparaParamInternCtrl()

function CalculaNColNFilVistaImprimir(ncol,nfil)
{
var factor_mapa=(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)/(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX);
var factor_paper=nfil/ncol;
var i, capa;
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
			capa=ParamCtrl.capa[i];
			if (EsCapaVisibleAAquestNivellDeZoom(capa) &&
				DonaTipusServidorCapa(capa)!="TipusWMS" &&
				DonaTipusServidorCapa(capa)!="TipusOAPI_Maps")
			{
				//Hi ha 1 capa (o més) en WMTS. En aquest cas, es fixa un nivell de zoom superior al ambit que es vol demanar.
				costat=(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)/VistaImprimir.ncol;
				//Buscar el costar de pixel que cumplim:
				var i_zoom=DonaIndexNivellZoomCeil(costat);
				if (i_zoom==-1)
					i=ParamCtrl.capa.length;  //No ha ha cap costat que em serveixi.
				else
					costat=ParamCtrl.zoom[i_zoom].costat; //Ara amb el nou costat de píxel cal redefinir envolupant per excés donat que no la puc conservar totalment.
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
	if (vista.i_nova_vista==NovaVistaImprimir && winImprimir)
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
			  AfegeixAdrecaBaseSRC("1negre.gif"),
			  "\" width=", Math.round(escala/ParamInternCtrl.vista.CostatZoomActual),
		  " height=2 border=0><br>", escala ,DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS));
	if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
	{
		var d_escala=DonaDenominadorDeLEscalaArrodonit(escala*FactorGrausAMetres*Math.cos((env.MaxY+env.MinY)/2*FactorGrausARadiants))
		cdns.push(" (", DonaCadenaLang({"cat":"aprox","spa":"aprox","eng":"approx","fre":"approx"}), ". " , (d_escala>10000 ? d_escala/1000+" km" : d_escala+" m"), " " ,
			DonaCadenaLang({"cat":"a lat.","spa":"a lat.","eng":"at lat.","fre":"à lat"}), " " , (OKStrOfNe((env.MaxY+env.MinY)/2,1)) , "°)");
	}
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
		ParamCtrl.araCanviProjAuto=true;
	else
	{
		ParamCtrl.araCanviProjAuto=false;
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

	if (ParamCtrl.DesplegableProj && ParamCtrl.ImatgeSituacio.length>1)
	{
		cdns.push("<form name=FormulProjeccio onSubmit=\"return false;\"><select CLASS=text_petit name=\"imatge\" onChange=\"CanviaCRSDeImatgeSituacio(parseInt(document.FormulProjeccio.imatge.value));\">");
		if (ParamCtrl.CanviProjAuto)
		{
			cdns.push("<OPTION VALUE=\"-1\"",(ParamCtrl.araCanviProjAuto ? " SELECTED" : "") ,">",
				DonaCadenaLang({"cat":"automàtic", "spa":"automático", "eng":"automatic","fre":"automatique"}));
			if (ParamCtrl.araCanviProjAuto)
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
			cdns.push("<OPTION VALUE=\"", crs_temp[i].i_situacio ,"\"",((!ParamCtrl.araCanviProjAuto && crs_temp[i].i_situacio==ParamInternCtrl.ISituacio) ? " SELECTED" : ""),">",
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
var cdns=[];
	cdns.push("<table border=0 cellspacing=0 cellpadding=0><tr><td align=middle>" , DonaCadenaHTMLDibuixEscala(env) , "</td><td><font face=arial size=2> &nbsp;",
		DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS),"</font></td></tr></table>");
	return cdns.join("");
}

function CreaEscalaFullImprimir(win)
{
    var elem=getLayer(win, "escala");
    if (isLayer(elem))
		contentLayer(elem, DonaCadenaHTMLEscalaImprimir(VistaImprimir.EnvActual));
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
		e*=FactorGrausAMetres;
	return DonaDenominadorDeLEscalaArrodonit(e);
}

function DonaAreaCella(env, costat, crs)
{
	if (EsProjLongLat(crs))
		return FactorGrausAMetres*Math.cos((env.MaxY+env.MinY)/2*FactorGrausARadiants)*costat*FactorGrausAMetres*costat;
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

    if (ParamCtrl.LlistatZoomFraccio)
    {
		s="1"+((i==ParamCtrl.zoom.length-1) ? "" : "/" + (Math.floor(ParamCtrl.zoom[i].costat/ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat*1000))/1000);
		cdns.push(s);
        parentesis=true;
    }
    if (ParamCtrl.LlistatZoomMidaPixel)
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
    if (ParamCtrl.LlistatZoomEscalaAprox)
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

    if (ParamCtrl.RelaxaAmbitVisualitzacio)
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
		else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
			cursor="crosshair";
	}
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		var elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixTelTrans);
		if(elem)
			elem.style.cursor=cursor;
		elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixSliderZoom);
		if(elem)
			elem.style.cursor=cursor;
	}
	for (var i_vista=0; i_vista<NovaVistaFinestra.vista.length; i_vista++)
	{
		var elem=getLayer(window, prefixNovaVistaFinestra+i_vista+"_finestra" + SufixTelTrans);
		if(elem)
			elem.style.cursor=cursor;
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

var MidaFletxaInclinada=10;
var MidaFletxaPlana=15;

function DonaMargeSuperiorVista(i_nova_vista)
{
	if (i_nova_vista!=NovaVistaPrincipal)
		return 0;
	return ((ParamCtrl.MargeSupVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeSupVista:0)+(ParamCtrl.CoordExtremes?AltTextCoordenada:0)+(ParamCtrl.VoraVistaGrisa ? MidaFletxaInclinada:0);  //Distancia entre la vista i vora superior del frame
}

function DonaMargeEsquerraVista(i_nova_vista)
{
	if (i_nova_vista!=NovaVistaPrincipal)
		return 0;
	return ((ParamCtrl.MargeEsqVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeEsqVista:0)+(ParamCtrl.VoraVistaGrisa ? MidaFletxaInclinada:0);      //Distancia entre la vista i vora esquerra del frame
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

//Només útils per la consulta per localització de punts
function DonaCoordenadaPuntCRSActual(punt, feature, crs_capa)
{
	if(!crs_capa  || crs_capa.toUpperCase()==ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase())
	{
		punt.x=feature.geometry.coordinates[0];
		punt.y=feature.geometry.coordinates[1];
		return true;
	}

	//En un futur proper, quan se suportin linies i polígons això s'haurà de canviar de lloc
	punt.x=feature.geometryCRSactual.coordinates[0];
	punt.y=feature.geometryCRSactual.coordinates[1];
	return false;
}

function DonaGeometryCRSActual(feature, crs_capa)
{
	if(!crs_capa  || crs_capa.toUpperCase()==ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase())
		return feature.geometry;

	return feature.geometryCRSactual;
}

function EsCapaConsultable(i)
{
var capa=ParamCtrl.capa[i];

	return capa.consultable=="si" && EsCapaDinsAmbitActual(capa) && EsCapaDisponibleEnElCRSActual(capa) &&
			    (!(ParamCtrl.ConsultableSegonsEscala && ParamCtrl.ConsultableSegonsEscala) || EsCapaDinsRangDEscalesVisibles(capa));
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
	else if (nom_finestra=="editarVector")
		TancaFinestra_editarVector();
	else if (nom_finestra=="triaStoryMap")
		TancaFinestra_triaStoryMap();
	else if (nom_finestra=="storyMap")
		TancaFinestra_storyMap();
	else if (nom_finestra=="llegenda" || nom_finestra=="situacio" || nom_finestra=="coord")
		TancaFinestra_llegenda_situacio_coord();
	else if (nom_finestra.length>prefixNovaVistaFinestra.length && nom_finestra.substring(0, prefixNovaVistaFinestra.length) == prefixNovaVistaFinestra)
		TancaFinestra_novaFinestra(nom_finestra, NovaVistaFinestra);
	else if (nom_finestra.length>prefixHistogramaFinestra.length && nom_finestra.substring(0, prefixHistogramaFinestra.length) == prefixHistogramaFinestra)
	{
		TancaFinestra_novaFinestra(nom_finestra, HistogramaFinestra);
		var str_id = nom_finestra.substr(prefixHistogramaFinestra.length);
		var number_id = parseInt(str_id);
		var estil = ParamCtrl.capa[HistogramaFinestra.vista[number_id].i_capa].estil[HistogramaFinestra.vista[number_id].i_estil];
	 
	 	if (estil.diagrama && estil.diagrama.length>0)
		{	
			for (var i_diagrama=0; i_diagrama<estil.diagrama.length; i_diagrama++)
			{
				if (estil.diagrama[i_diagrama].i_histograma == number_id &&
						(estil.diagrama[i_diagrama].tipus == "chart" || estil.diagrama[i_diagrama].tipus == "chart_categ" || estil.diagrama[i_diagrama].tipus == "matriu" || 
						estil.diagrama[i_diagrama].tipus == "stat" || estil.diagrama[i_diagrama].tipus == "stat_categ"))
				//és aquest (cal comprovar el tipus perquè les numeracions són independents i es podrien repetir entre Histogrames i Vistes3D)
					estil.diagrama.splice(i_diagrama, 1);				
					//break; -> crec que ara ja no passa que hi ha diversos "diagrama" amb el mateix number_id, perquè ara les 3 components van a un sol diagram. Comprovar i potser treure elcomentari per fer el break
			}
		}
		if (estil.diagrama.length == 0)
				delete estil.diagrama;
	}
	else if (nom_finestra.length>prefixSuperficie3DFinestra.length && nom_finestra.substring(0, prefixSuperficie3DFinestra.length) == prefixSuperficie3DFinestra)
	{
		TancaFinestra_novaFinestra(nom_finestra, Superficie3DFinestra);
		var str_id = nom_finestra.substr(prefixSuperficie3DFinestra.length);
		var number_id = parseInt(str_id);
		var estil = ParamCtrl.capa[Superficie3DFinestra.vista[number_id].i_capa].estil[Superficie3DFinestra.vista[number_id].i_estil];
	 
	 	if (estil.diagrama && estil.diagrama.length>0)
		{	
			for (var i_diagrama=0; i_diagrama<estil.diagrama.length; i_diagrama++)
			{
				if (estil.diagrama[i_diagrama].i_histograma == number_id && estil.diagrama[i_diagrama].tipus == "vista3d" )
				//és aquest (cal comprovar el tipus perquè les numeracions són independents i es podrien repetir entre Histogrames i Vistes3D)
					estil.diagrama.splice(i_diagrama, 1);				
					//break; -> crec que ara ja no passa que hi ha diversos "diagrama" amb el mateix number_id, perquè ara les 3 components van a un sol diagram. Comprovar i potser treure elcomentari per fer el break
			}
		}
		if (estil.diagrama.length == 0)
				delete estil.diagrama;
	}
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
}

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
	if(tipus=="TipusOAPI_Maps")
		return "OAPI Maps";
	if(tipus=="TipusOAPI_MapTiles")
		return "OAPI Map Tiles";
	if(tipus=="TipusOAPI_Features")
		return "OAPI Features";
	if(tipus=="TipusHTTP_GET")
		return "HTTP GET";
	return "";
}

//Si mode==0 dona un enllaç amb la URL com a text subratllat
//Si mode==1 dona un enllaç amb el tipus com a text subratllat
function DonaEnllacCapacitatsServidorDeCapa(i_capa, mode)
{
var cdns=[];

	if(DonaTipusServidorCapa(ParamCtrl.capa[i_capa])=="TipusWMTS_SOAP")
	{
		cdns.push("<a href=\"javascript:void(0);\" onClick=\"FesPeticioCapacitatsPost(\'",
				DonaNomServidorSenseCaracterFinal(DonaServidorCapa(ParamCtrl.capa[i_capa])),"\', \'",DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])),"\', ",
				DonaTipusServidorCapa(ParamCtrl.capa[i_capa]),", ", DonaCorsServidorCapa(ParamCtrl.capa[i_capa]), ");\">",
				((mode==0) ? DonaServidorCapa(ParamCtrl.capa[i_capa]) : DonaDescripcioTipusServidor(DonaTipusServidorCapa(ParamCtrl.capa[i_capa]))), "</a>");
	}
	else
	{
		cdns.push("<a href=\"", DonaRequestServiceMetadata(DonaServidorCapa(ParamCtrl.capa[i_capa]),
				DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[i_capa])),
				DonaTipusServidorCapa(ParamCtrl.capa[i_capa]), DonaCorsServidorCapa(ParamCtrl.capa[i_capa])), "\" target=\"_blank\">",
				((mode==0) ? DonaServidorCapa(ParamCtrl.capa[i_capa]) : DonaDescripcioTipusServidor(DonaTipusServidorCapa(ParamCtrl.capa[i_capa]))), "</a>");
	}
	return cdns.join("");
}

function DonaEnllacCapacitatsServidorDeCapaDigi(i_capa, mode)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	cdns.push("<a href=\"", DonaRequestServiceMetadata(DonaServidorCapa(capa),
				DonaVersioComAText(capa.versio),
				capa.tipus ? capa.tipus : "TipusWFS",
				DonaCorsServidorCapa(capa)), "\" target=\"_blank\">",
				((mode==0) ? DonaServidorCapa(capa) : DonaDescripcioTipusServidor(capa.tipus ? capa.tipus : "TipusWFS")), "</a>");
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
			cdns.push(DonaServidorCapa(ParamCtrl.capa[i_capa]));

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
							if (cdns[i]==DonaServidorCapa(ParamCtrl.capa[i_capa]))
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
									if (DonaTipusServidorCapa(ParamCtrl.capa[array_tipus[i_tipus]])==DonaTipusServidorCapa(ParamCtrl.capa[i_capa]))
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
						if (cdns[i]==DonaServidorCapa(ParamCtrl.capa[i_capa]))
						{
							for (var i_tipus=0; i_tipus<array_tipus.length; i_tipus++)
							{
								if (DonaTipusServidorCapa(ParamCtrl.capa[array_tipus[i_tipus]])==DonaTipusServidorCapa(ParamCtrl.capa[i_capa]))
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
					DonaRequestServiceMetadata(ParamCtrl.ServidorLocal, ParamCtrl.VersioServidorLocal, ParamCtrl.TipusServidorLocal, ParamCtrl.CorsServidorLocal), "\" target=\"_blank\">",
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
			GetMessage("Open"),
			"\">",
			"<input type=\"button\" value=\"",
			GetMessage("Save"),
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

function EsPuntDinsAmbitNavegacio(punt)
{
	return EsPuntDinsEnvolupant(punt, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS);
}//Fi de EsPuntDinsAmbitNavegacio()

//Fer un click sobre la vista.

var AmbitZoomRectangle={"MinX": 0, "MaxX": 0, "MinY": 0, "MaxY": 0};
var ZRec_1PuntClient={"x": 0, "y": 0};  //This is used for store the first point of a zoom window rectangle in desktop but also for a 2 fingers touch event in mobile devices
var ZRecSize_1Client={"x": 0, "y": 0}, ZRecSize_2Client={"x": 0, "y": 0};   //Only for touch events. I'm allowing for a negative sizes until the very last moment.
var HiHaHagutMoviment=false, HiHaHagutPrimerClick=false;
var NovaVistaFinestra={"n": 0, "vista":[]};

function ClickSobreVista(event, i_nova_vista)
{
var i_vista;

	if (ParamCtrl.EstatClickSobreVista=="ClickConLoc")
		ConsultaSobreVista(event, i_nova_vista);
	else if (ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
		EditarPunts(event, i_nova_vista);
	else if (ParamCtrl.EstatClickSobreVista=="ClickMouMig")
	{
		PortamAPunt(DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX), DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY));
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan1")
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		ZRec_1PuntClient.x=event.clientX;
		ZRec_1PuntClient.y=event.clientY;

		ParamCtrl.EstatClickSobreVista="ClickPan2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan2")
	{
		if (!HiHaHagutMoviment)
			return;
		//Calculo el moviment que s'ha de produir i el faig.
		MouLaVista(AmbitZoomRectangle.MinX-DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX),
		AmbitZoomRectangle.MinY-DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY));
		ParamCtrl.EstatClickSobreVista="ClickPan1";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec1")
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		ZRec_1PuntClient.x=event.clientX;
		ZRec_1PuntClient.y=event.clientY;

		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista));
			showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		}
		ParamCtrl.EstatClickSobreVista="ClickZoomRec2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" &&  i_nova_vista==NovaVistaPrincipal)
	{
		AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		ZRec_1PuntClient.x=event.clientX;
		ZRec_1PuntClient.y=event.clientY;

		moveLayer2(getLayer(window, event.target.parentElement.id+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY)+DonaMargeSuperiorVista(i_nova_vista));
		showLayer(getLayer(window, event.target.parentElement.id+SufixZRectangle));
		ParamCtrl.EstatClickSobreVista="ClickNovaVista2";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickZoomRec2")
	{
		if (!HiHaHagutMoviment)
			return;
		if (AmbitZoomRectangle.MinX<DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX))
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		else
		{
			AmbitZoomRectangle.MaxX=AmbitZoomRectangle.MinX;
			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		}
		if (AmbitZoomRectangle.MinY<DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY))
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		else
		{
			AmbitZoomRectangle.MaxY=AmbitZoomRectangle.MinY;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		}
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		if (ParamCtrl.ConsultaTipica)
			PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
		PortamAAmbit(AmbitZoomRectangle);
		ParamCtrl.EstatClickSobreVista="ClickZoomRec1";
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickNovaVista2" && i_nova_vista==NovaVistaPrincipal)
	{
		if (!HiHaHagutMoviment)
			return;
		if (AmbitZoomRectangle.MinX<DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX))
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		else
		{
			AmbitZoomRectangle.MaxX=AmbitZoomRectangle.MinX;
			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientX);
		}
		if (AmbitZoomRectangle.MinY<DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY))
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		else
		{
			AmbitZoomRectangle.MaxY=AmbitZoomRectangle.MinY;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.clientY);
		}
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		if (ParamCtrl.ConsultaTipica)
			PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);

		var di, dj, min_i, min_j;
		if (event.clientX>ZRec_1PuntClient.x)
		{
			min_i=ZRec_1PuntClient.x;
			di= event.clientX-ZRec_1PuntClient.x
		}
		else
		{
			min_i=event.clientX;
			di= ZRec_1PuntClient.x-event.clientX;
		}
		if (event.clientY>ZRec_1PuntClient.y)
		{
			min_j=ZRec_1PuntClient.y;
			dj= event.clientY-ZRec_1PuntClient.y
		}
		else
		{
			min_j=event.clientY;
			dj= ZRec_1PuntClient.y-event.clientY;
		}
		min_i=((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0)+ min_i + DonaMargeEsquerraVista(i_nova_vista);
		min_j=((window.document.body.scrollTop) ? window.document.body.scrollTop : 0)+ min_j + DonaMargeSuperiorVista(i_nova_vista);
		min_j-=AltBarraFinestraLayer*2;
		dj+=AltBarraFinestraLayer;

		var nom_nova_vista=prefixNovaVistaFinestra+NovaVistaFinestra.n;
		insertContentLayer(getLayer(window, event.target.parentElement.id), "afterEnd", textHTMLFinestraLayer(nom_nova_vista, {"cat": "Vista "+(NovaVistaFinestra.n+1), "spa": "Vista "+(NovaVistaFinestra.n+1), "eng": "View "+(NovaVistaFinestra.n+1), "fre": "Vue "+(NovaVistaFinestra.n+1) }, boto_tancar, min_i-1, min_j-1, di, dj, "NW", {scroll: "no", visible: true, ev: null}, null));
		OmpleBarraFinestraLayerNom(window, nom_nova_vista);
		dj-=(AltBarraFinestraLayer+1);
		di-=1;
		NovaVistaFinestra.vista[NovaVistaFinestra.n]={ "EnvActual": {"MinX": AmbitZoomRectangle.MinX, "MaxX": AmbitZoomRectangle.MinX+ParamInternCtrl.vista.CostatZoomActual*di, "MinY": AmbitZoomRectangle.MinY+ParamInternCtrl.vista.CostatZoomActual*AltBarraFinestraLayer, "MaxY": AmbitZoomRectangle.MinY+ParamInternCtrl.vista.CostatZoomActual*(AltBarraFinestraLayer+dj)},
				 "nfil": dj,
				 "ncol": di,
				 "CostatZoomActual": ParamInternCtrl.vista.CostatZoomActual,
				 "i_vista": DonaIVista(event.target.parentElement.id),
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
		hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixZRectangle));
	if(ParamCtrl.EstatClickSobreVista=="ClickEditarPunts")
		TancaFinestraLayer("editarVector");
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
var cdns=[], ll, p, unitats_CRS;

	p=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	if (p=="°")
		unitats_CRS=p;
	else
		unitats_CRS=" "+p;

	if (ParamCtrl.CoordActualProj)
	{
		cdns.push((negreta ? "<b>" : ""),
			(input ? " X: " : " X,Y: "),
			(negreta ? "</b>" : ""),
			(input ? "<input type=\"text\" name=\"coord_e_x\" class=\"input_coord\" value=\"" : ""),
			OKStrOfNe(x,ParamCtrl.NDecimalsCoordXY), unitats_CRS,
			(input ? ( negreta ? "\" readonly>/><b>Y:</b> <input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" :
			"\" readonly/>Y:<input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" ) : ", "),
			OKStrOfNe(y,ParamCtrl.NDecimalsCoordXY), unitats_CRS,
			(input ? "\" readonly>" : ""));
	}
	if (ParamCtrl.CoordActualLongLatG)
	{
		if (ParamCtrl.CoordActualProj && ParamCtrl.EstilCoord=="area")
			cdns.push("<br>");
		ll=DonaCoordenadesLongLat(x,y,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push((negreta ? "<b>" : ""),
			(input ? " Long: " : " Long,Lat: "),
			(negreta ? "</b>" : ""),
			(input ? "<input type=\"text\" name=\"coord_e_x\" class=\"input_coord\" value=\"" : ""),
			ParamCtrl.CoordActualLongLatGMS ? g_gms(ll.x, true) : OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4),
			(input ? ( negreta ? "\" readonly/><b>Lat:</b> <input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" :
			"\" readonly/>Lat: <input type=\"text\" name=\"coord_e_y\" class=\"input_coord\" value=\"" ) : ", "),
			ParamCtrl.CoordActualLongLatGMS ? g_gms(ll.y, true) : OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4),
			(input ? "\" readonly/>" : ""));
	}
	return cdns.join("");
}

function DonaValorsDePosicioActual(i_nova_vista, x, y)
{
var cdns=[], i, j, vista, capa;

	cdns.push(DonaValorDeCoordActual(x, y, false, false));

	vista=DonaVistaDesDeINovaVista(i_nova_vista);

	i=Math.round((x-vista.EnvActual.MinX)/vista.CostatZoomActual);
	j=Math.round((vista.EnvActual.MaxY-y)/vista.CostatZoomActual);

	if (i>=0 && i<vista.ncol && j>=0 && j<vista.nfil)
	{
		for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
		{
			capa=ParamCtrl.capa[i_capa];
			if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=NovaVistaPrincipal ? vista.i_vista : 0/*S'hauria de fer això però no se el nom de la vista: DonaIVista(nom_vista)*/, i_capa) &&
				capa.model!=model_vector && HiHaDadesBinariesPerAquestaCapa(i_nova_vista, i_capa))
			{
				var s=DonaValorEstilComATextDesDeValorsCapa(i_nova_vista, i_capa, DonaValorsDeDadesBinariesCapa(i_nova_vista, capa, null, i, j), true);
				if (s=="")
					continue;
				if (ParamCtrl.EstilCoord && ParamCtrl.EstilCoord=="area")
					cdns.push("<br>");
				else
					cdns.push("; ");
				cdns.push(DonaDescripcioValorMostrarCapa(i_capa, true), ": ", s);
			}
		}
	}
	return cdns.join("");
}

function MostraValorDeCoordActual(i_nova_vista, x, y)
{
	var text=DonaValorsDePosicioActual(i_nova_vista, x, y);
	if (window.opener)
		window.opener.postMessage(JSON.stringify({msg: "MiraMon Map Browser current location text", text: text}), "*");

	if (window.document.form_coord && window.document.form_coord.info_coord)
	{
		if (ParamCtrl.EstilCoord && ParamCtrl.EstilCoord=="area")
			window.document.form_coord.info_coord.innerHTML=text;
		else
			window.document.form_coord.info_coord.value=text;
	}
}

var MapTouchTypeIniciat=0;
function IniciDitsSobreVista(event, i_nova_vista)
{
/*https://stackoverflow.com/questions/11183174/simplest-way-to-detect-a-pinch/11183333#11183333*/
var i_vista;

	if (event.touches.length == 2 && MapTouchTypeIniciat == 0)
	{
    	MapTouchTypeIniciat = 2;
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientY)+DonaMargeSuperiorVista(i_nova_vista));
			showLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		}
		ZRec_1PuntClient.x=(event.touches[1].clientX+event.touches[0].clientX)/2;
		ZRec_1PuntClient.y=(event.touches[1].clientY+event.touches[0].clientY)/2;
		ZRecSize_1Client.x=(event.touches[1].clientX-event.touches[0].clientX);
		ZRecSize_1Client.y=(event.touches[1].clientY-event.touches[0].clientY);
		HiHaHagutMoviment=false;
		return false;
	}
	MapTouchTypeIniciat==0;
	for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
	return true;
}

function MovimentDitsSobreVista(event, i_nova_vista)
{
var i_vista;

	if (MapTouchTypeIniciat==2)
	{
		/*if (event.touches.length != 2)
		{
			MapTouchTypeIniciat==-1;
			setTimeout("MapTouchTypeIniciat=0", 900);
			for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
				hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
			return false;
		}*/
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		{
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[0].clientY)+DonaMargeSuperiorVista(i_nova_vista),
				 DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientX)+DonaMargeEsquerraVista(i_nova_vista),
				 DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event.touches[1].clientY)+DonaMargeSuperiorVista(i_nova_vista));
		}
		ZRecSize_2Client.x=(event.touches[1].clientX-event.touches[0].clientX);
		ZRecSize_2Client.y=(event.touches[1].clientY-event.touches[0].clientY);
		PanVistes((event.touches[1].clientX+event.touches[0].clientX)/2, (event.touches[1].clientY+event.touches[0].clientY)/2, ZRec_1PuntClient.x, ZRec_1PuntClient.y);
		HiHaHagutMoviment=true;
		//return false;
	}
	return false;
}

function FiDitsSobreVista(event, i_nova_vista)
{
var i_vista, ratio={x:0, y:0};

	if (MapTouchTypeIniciat==2)
	{
		MapTouchTypeIniciat=-1;
		setTimeout("MapTouchTypeIniciat=0;", 200);
		for (i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			hideLayer(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom+SufixZRectangle));
		if (event.touches.length==1)  //The user has removed one finger and the 2 fingers event has concluded.
		{
			//unfortunatelly the data form the event is not useful now because we cannot get the two fingers possition.
			//This is why there has been stored in advance.
			if (!HiHaHagutMoviment || ZRecSize_1Client.x==0 || ZRecSize_1Client.y==0 || ZRecSize_2Client.x==0 || ZRecSize_2Client.y==0)
				return;
			ratio.x=ZRecSize_1Client.x/ZRecSize_2Client.x;
			ratio.y=ZRecSize_1Client.y/ZRecSize_2Client.y;
			if (ratio.x<0)
				ratio.x=-ratio.x;
			if (ratio.y<0)
				ratio.y=-ratio.y;

			AmbitZoomRectangle.MinX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.x)-(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)/2*ratio.x;
			AmbitZoomRectangle.MaxX=DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.x)+(ParamInternCtrl.vista.EnvActual.MaxX-ParamInternCtrl.vista.EnvActual.MinX)/2*ratio.x;
			AmbitZoomRectangle.MinY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.y)-(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)/2*ratio.y;
			AmbitZoomRectangle.MaxY=DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.y)+(ParamInternCtrl.vista.EnvActual.MaxY-ParamInternCtrl.vista.EnvActual.MinY)/2*ratio.y;
			if (ParamCtrl.ConsultaTipica)
				PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
			PortamAAmbit(AmbitZoomRectangle);
			//alert("Fer la feina!");
			return false;
		}
		return true;
	}
	return true;
}


function IniciClickSobreVistaUnSolClic(event, i_nova_vista)
{
/* http://unixpapa.com/js/mouse.html*/

	HiHaHagutPrimerClick=true;
	if (ParamCtrl.EstatClickSobreVista!="ClickPan2" && ParamCtrl.EstatClickSobreVista!="ClickZoomRec2" && ParamCtrl.EstatClickSobreVista!="ClickNovaVista2")
		HiHaHagutMoviment=false;
	if (ParamCtrl.EstatClickSobreVista=="ClickPan1" || ParamCtrl.EstatClickSobreVista=="ClickZoomRec1" || (ParamCtrl.EstatClickSobreVista=="ClickNovaVista1" && i_nova_vista==NovaVistaPrincipal))
	{
		if (event.which == null)
		{
			if (event.button==1)
				ClickSobreVista(event, i_nova_vista);
		}
		else
		{
			if (event.which==1)
				ClickSobreVista(event, i_nova_vista);
		}
	}
}

function IniciClickSobreVista(event, i_nova_vista)
{
	if (ParamCtrl.ZoomUnSolClic)
	   	IniciClickSobreVistaUnSolClic(event, i_nova_vista);
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
				if (EsCapaVisibleAAquestNivellDeZoom(capa) &&  EsCapaVisibleEnAquestaVista(i_vista, i))
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
				if (EsCapaVisibleAAquestNivellDeZoom(capa) &&  EsCapaVisibleEnAquestaVista(i_vista, i))
				{
					elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + "_l_capa"+i);
					if ((DonaTipusServidorCapa(capa)=="TipusWMS_C" || DonaTipusServidorCapa(capa)=="TipusWMTS_REST" || DonaTipusServidorCapa(capa)=="TipusWMTS_KVP"
						|| DonaTipusServidorCapa(capa)=="TipusWMTS_SOAP" || DonaTipusServidorCapa(capa)=="TipusOAPI_MapTiles"/* || DonaTipusServidorCapa(capa)=="TipusGoogle_KVP"*/) && capa.VistaCapaTiled.TileMatrix)
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
	if (ParamCtrl.ZoomUnSolClic && HiHaHagutPrimerClick &&
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
			moveLayer2(getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom + SufixZRectangle),
				DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.x)+DonaMargeEsquerraVista(i_nova_vista),
				DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, ZRec_1PuntClient.y)+DonaMargeSuperiorVista(i_nova_vista),
				DonaCoordIDeCoordSobreVista(event.target.parentElement, i_nova_vista, event_de_moure.clientX)+DonaMargeEsquerraVista(i_nova_vista),
				DonaCoordJDeCoordSobreVista(event.target.parentElement, i_nova_vista, event_de_moure.clientY)+DonaMargeSuperiorVista(i_nova_vista));
		HiHaHagutMoviment=true;
	}
	else if (ParamCtrl.EstatClickSobreVista=="ClickPan2")
	{
		PanVistes(event_de_moure.clientX, event_de_moure.clientY, ZRec_1PuntClient.x, ZRec_1PuntClient.y);
		HiHaHagutMoviment=true;
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
			for (i=0; i<ParamCtrl.capa.length; i++)
			{
				var capa=ParamCtrl.capa[i];
				if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(0/*i_vista*/, i) && capa.atribucio)
					atrib.push(DonaCadena(capa.atribucio));
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
		cdns.push(atrib.join("; "), "</span></td></tr></table>");
		contentLayer(elem, cdns.join(""));
	}
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

function TransformaCoordenadesArray(coord, crs_ori, crs_dest)
{
	if (crs_ori!=crs_dest)
	{
		var ll=DonaCoordenadesLongLat(coord[0], coord[1], crs_ori);
		var crs_xy=DonaCoordenadesCRS(ll.x, ll.y, crs_dest);
		coord[0]=crs_xy.x;
		coord[1]=crs_xy.y;
	}
}


function CanviaCRS(crs_ori, crs_dest)
{
var factor=1;
var i;

	TransformaCoordenadesPunt(ParamInternCtrl.PuntOri, crs_ori, crs_dest);
	TransformaCoordenadesPunt(PuntConsultat, crs_ori, crs_dest);

	//He de transformar les coordenades dels objectes digitalitzats a memòria
	TransformaCoordenadesCapesVolatils(crs_ori, crs_dest);

	//i també de les CapesDigitalitzades
	for (i=0; i<ParamCtrl.capa.length; i++)
		CanviaCRSITransformaCoordenadesCapaDigi(ParamCtrl.capa[i], crs_dest);

	if (DonaUnitatsCoordenadesProj(crs_ori)=="m" && EsProjLongLat(crs_dest))
	{
		factor=1/120000; // Aquí no apliquem FactorGrausAMetres perquè volem obtenir un costat de zoom arrodonit.
		ParamCtrl.NDecimalsCoordXY+=4;
	}
	else if (EsProjLongLat(crs_ori) && DonaUnitatsCoordenadesProj(crs_dest)=="m")
	{
		factor=120000; // Aquí no apliquem FactorGrausAMetres perquè volem obtenir un costat de zoom arrodonit.
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
		CanviaNivellDeZoom(0, false);
	RepintaMapesIVistes();
}

function PortamANivellDeZoom(nivell)
{
	if (ParamCtrl.ConsultaTipica)
		PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
	GuardaVistaPrevia();
	return CanviaNivellDeZoom(nivell, true);
}

function PortamANivellDeZoomEvent(event, nivell) //Afegit Cristian 19/01/2016
{
	dontPropagateEvent(event);
	PortamANivellDeZoom(nivell);
}

//sz=1 will "zoom in" and sz=-1 will "zoom out"
function MouNivellDeZoomEvent(event, sz)
{
	PortamANivellDeZoomEvent(event, DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual)+sz);
}

function PortamAData(millisegons)
{
	if (ParamInternCtrl.millisegons[ParamInternCtrl.iMillisegonsActual]==millisegons)
		return;
	SincronitzaCapesMillisegons(millisegons);
	RepintaMapesIVistes();
}

function PortamADataEvent(event, millisegons)
{
	dontPropagateEvent(event);
	PortamAData(millisegons);
}

//dt=1 will "goto the future" and dt=-1 will "goto the past"
function MouDataEvent(event, dt)
{
	if (!ParamInternCtrl.millisegons)
		return;
	if (dt<0)
		PortamADataEvent(event, ParamInternCtrl.millisegons[(ParamInternCtrl.iMillisegonsActual<-dt) ? 0 : ParamInternCtrl.iMillisegonsActual+dt]);
	else if (dt>0)
		PortamADataEvent(event, ParamInternCtrl.millisegons[(ParamInternCtrl.iMillisegonsActual<ParamInternCtrl.millisegons.length-dt) ? ParamInternCtrl.iMillisegonsActual+dt : ParamInternCtrl.millisegons.length-1]);
}


//No crida GuardaVistaPrevia()
function CanviaNivellDeZoom(nivell, redibuixa)
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
	if (ParamCtrl.ZoomContinu || nivell!=DonaIndexNivellZoom(ParamInternCtrl.vista.CostatZoomActual))  //Evito canviar de nivell al nivell actual.
	{
		ParamInternCtrl.vista.CostatZoomActual=ParamCtrl.zoom[nivell].costat;
		RevisaEstatsCapes();
		if (ParamCtrl.LlegendaAmagaSiForaAmbit || ParamCtrl.LlegendaGrisSiForaAmbit)
			;
		else
		CreaLlegenda();
		if (window.document.zoom.nivell)
			window.document.zoom.nivell.selectedIndex = nivell;
		CentraLaVista((ParamInternCtrl.vista.EnvActual.MaxX+ParamInternCtrl.vista.EnvActual.MinX)/2,(ParamInternCtrl.vista.EnvActual.MaxY+ParamInternCtrl.vista.EnvActual.MinY)/2);
		RepintaMapesIVistes();
	}
	return false;  //evitar el submit del formulari
}

function MostraFinestraVideo()
{
	if (!ObreFinestra(window, "video", DonaCadenaLang({"cat":"de sèries temporals",
							  "spa":"de series temporales",
							  "eng":"of time series",
							  "fre":"pour séries chronologiques"})))
		return;
	PreparaIOmpleFinestraVideo();
}

function PreparaIOmpleFinestraVideo()
{
	if (!PaletesGlobals)
	{
		loadJSON("paletes.json",
			function(paletes_globals, extra_param) {
				PaletesGlobals=paletes_globals;
				OmpleFinestraVideo(window, "video");
			},
			function(xhr) { alert(xhr); },
			null);
	}
	else
		OmpleFinestraVideo(window, "video");
}

function EsCapaDinsAmbitActual(capa)
{
	if (!capa.EnvTotal || !capa.EnvTotal.EnvCRS)
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
		if (!EsEnvDinsEnvolupant(DonaEnvolupantLongLat(ParamInternCtrl.vista.EnvActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS),
					capa.EnvTotalLL))
			return false;
	}
	return true;
}

function EsCapaDinsAmbitCapa(c, c2)
{
	if (!c.EnvTotal || !c.EnvTotal.EnvCRS || !c2.EnvTotal || !c2.EnvTotal.EnvCRS)
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
		if (!EsEnvDinsEnvolupant(DonaEnvolupantLongLat(c.EnvTotal.EnvCRS, c.EnvTotal.CRS),
				DonaEnvolupantLongLat(c2.EnvTotal.EnvCRS, c2.EnvTotal.CRS)))
			return false;
	}
	return true;
}

function EsEnvDinsAmbitActual(env)
{
//var env_situa_actual=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal;

	if (!env || !env.CRS)
		return true;
	if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase()==env.CRS.toUpperCase())
	{
		if (!EsEnvDinsEnvolupant(ParamInternCtrl.vista.EnvActual, env.EnvCRS))
			return false;
	}
	else
	{
		//Paso l'envolupant actual a lat/long i comparo.
		if (!EsEnvDinsEnvolupant(
					DonaEnvolupantLongLat(ParamInternCtrl.vista.EnvActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS), 
					DonaEnvolupantLongLat(env.EnvCRS, env.CRS)))
			return false;
	}
	return true;
}


function EsImatgeSituacioDinsAmbitActual(i)
{
var env_situa=ParamCtrl.ImatgeSituacio[i].EnvTotal;
var env_situa_actual=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal;

	if (ParamInternCtrl.ISituacio==i)
		return true;
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
		if (!EsEnvDinsEnvolupant(DonaEnvolupantLongLat(ParamInternCtrl.vista.EnvActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS), 
			ParamInternCtrl.EnvLLSituacio[i]))
			return false;
	}
	return true;
}

function EsTileMatrixSetDeCapaDisponbleEnElCRSActual(c)
{
	if(DonaTipusServidorCapa(c)=="TipusWMS_C" || DonaTipusServidorCapa(c)=="TipusWMTS_REST" || DonaTipusServidorCapa(c)=="TipusWMTS_KVP" || DonaTipusServidorCapa(c)=="TipusWMTS_SOAP" ||  DonaTipusServidorCapa(c)=="TipusOAPI_MapTiles")
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

function EsCapaVisibleAAquestNivellDeZoom(capa)
{
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

function CanviaDataDeCapaMultitime(i_capa, i_data)
{
var capa=ParamCtrl.capa[i_capa];

	capa.i_data=i_data;
	if (capa.model==model_vector)
	{
		for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			OmpleVistaCapaDigi(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
	}
	else
	{
		for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
			OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
	}
}

function CanviaValorDimensioExtraDeCapa(i_capa, i_dim, i_valor)
{
var dim=ParamCtrl.capa[i_capa].dimensioExtra[i_dim];

	dim.i_valor=i_valor;
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
	ns="http://www.opengis.net/wmts/"+DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(ParamCtrl.capa[dades_request.i_capa]));
	elem=DonamElementsNodeAPartirDelNomDelTag(root, ns, "wmts", "BinaryPayload");
	if(!elem || elem.length<1)
	{
		ns="http://www.opengis.net/wmts/"+DonaVersioComAText(DonaVersioServidorCapa(ParamCtrl.capa[dades_request.i_capa]));
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
			  "<GetTile xmlns=\"http://www.opengis.net/wmts/", DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(capa)),"\" ",
						"xmlns:ows=\"http://www.opengis.net/ows/1.1\" ",
						"xsi:schemaLocation=\"http://www.opengis.net/wmts/",DonaVersioPerNameSpaceComAText(DonaVersioServidorCapa(capa)),
						" http://www.miramon.uab.cat/ogc/schemas/wmts/",
						DonaVersioComAText(DonaVersioServidorCapa(capa)), "/wmtsGetTile_request.xsd\" ",
						"service=\"WMTS\" version=\"",DonaVersioComAText(DonaVersioServidorCapa(capa)),"\">\n",
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
	if (capa.AnimableMultiTime)
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
	// ServerToRequest
	if ( DonaCorsServidorCapa(capa) &&
		 location.host && DonaHost(DonaServidorCapa(capa)).toLowerCase()!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
	{
		var s_host=DonaHost(ParamCtrl.ServidorLocal);
		var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
		if (s_host.toLowerCase()!=location.host.toLowerCase())
			servidor_temp=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal.substring(0,pos_host)+
							location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length));
		else
			servidor_temp=ParamCtrl.ServidorLocal;
		cdns.push(		"<ServerToRequest>",DonaNomServidorSenseCaracterFinal(DonaServidorCapa(capa)),"</ServerToRequest>\n");
	}
	else
		servidor_temp=DonaNomServidorSenseCaracterFinal(DonaServidorCapa(capa));

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
	var s=DonaRequestGetMap(i_capa, i_estil, pot_semitrans, ncol, nfil, env_tile, i_data, null);
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
var s, cdns=[], url_template, i_estil2, capa=ParamCtrl.capa[i_capa], tipus=DonaTipusServidorCapa(capa);

	if (tipus=="TipusWMTS_REST")
	{
	if (capa.TileMatrixSet[i_tile_matrix_set].URLTemplate)
			s=capa.TileMatrixSet[i_tile_matrix_set].URLTemplate+"";
		else
			s="{WMTSBaseURL}/{layer}/{style}/{time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.{format_extension}";
		s=s.replace("{WMTSBaseURL}", DonaServidorCapa(capa));
		s=s.replace("{layer}", capa.nom);
		if (capa.estil && capa.estil.length)
		{
			i_estil2=(i_estil==-1) ? capa.i_estil : i_estil;
			if (capa.estil[i_estil2].nom)
	 			s=s.replace("{style}", capa.estil[i_estil2].nom);
			else
				s=s.replace("{style}/", "");
		}
		else
			s=s.replace("{style}/", "");


		if (capa.AnimableMultiTime)
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
		return s;
		}
	else if (tipus=="TipusOAPI_MapTiles")
	{
		if (capa.TileMatrixSet[i_tile_matrix_set].URLTemplate)
			s=capa.TileMatrixSet[i_tile_matrix_set].URLTemplate+"?";
		else
			s="collections/{collectionId}/styles/{styleId}/map/tiles/{tileMatrixSetId}/{tileMatrix}/{tileRow}/{tileCol}?";

		s=s.replace("{collectionId}", capa.nom);
		if (capa.estil && capa.estil.length)
		{
			i_estil2=(i_estil==-1) ? capa.i_estil : i_estil;

			if (capa.estil[i_estil2].nom)
	 			s=s.replace("{styleId}", capa.estil[i_estil2].nom);
			else
				s=s.replace("{styleId}/", "default");
		}
		else
			s=s.replace("{styleId}/", "default");
		s=s.replace("{tileMatrixSetId}", capa.TileMatrixSet[i_tile_matrix_set].nom);
		s=s.replace("{tileMatrix}", capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier);
		s=s.replace("{tileRow}", j);
		s=s.replace("{tileCol}", i);
		if(capa.FormatImatge.charAt(0)==".")
			s=s.replace(".{format_extension}", capa.FormatImatge);
		else
			s=s.replace("{format_extension}", capa.FormatImatge);
		cdns.push(s);

		cdns.push("&f=" , capa.FormatImatge ) ;
		cdns.push(((capa.FormatImatge=="image/jpeg") ? "" : "&transparent=" + ((capa.transparencia && capa.transparencia!="opac")? "TRUE" : "FALSE")));
		if (capa.AnimableMultiTime)
			cdns.push("&datetime=",DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)], capa.FlagsData));
		return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), ParamCtrl.UsaSempreMeuServidor ? true : false, DonaCorsServidorCapa(capa));
	}
	else if (DonaTipusServidorCapa(capa)=="TipusWMTS_KVP")
	{
		//Encara per revisar pq WMTS va diferent que el WMS.
		cdns.push("SERVICE=WMTS&VERSION=", DonaVersioComAText(DonaVersioServidorCapa(capa)), "&REQUEST=GetTile&TileMatrixSet=" ,
			capa.TileMatrixSet[i_tile_matrix_set].nom ,
			 "&TileMatrix=",capa.TileMatrixSet[i_tile_matrix_set].TileMatrix[i_tile_matrix].Identifier , "&TileRow=",j,"&TileCol=",i,
			 "&LAYER=", capa.nom , "&FORMAT=", capa.FormatImatge, "&STYLE=");

		if (capa.estil && capa.estil.length)
		{
			if (i_estil==-1)
				i_estil2=capa.i_estil;
			else
				i_estil2=i_estil;
			if (capa.estil[i_estil2].nom)
	 			cdns.push(capa.estil[i_estil2].nom);
		}
		if (capa.AnimableMultiTime)
			cdns.push("&TIME=",
				(DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)], capa.FlagsData)));
		return AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), ParamCtrl.UsaSempreMeuServidor ? true : false, DonaCorsServidorCapa(capa));
	}
	/*if (DonaTipusServidorCapa(capa)=="TipusGoogle_KVP")
	{
		//http://khm.google.com/maptilecompress/hl=en&s=Gal&t=3&q=25&x=0&y=0&z=0
		//{WMTSBaseURL}&t={layer}&q={quality_style}&z={TileMatrix}&y={TileRow}&x={TileCol}

		cdns.push(DonaServidorCapa(capa), (DonaServidorCapa(capa).charAt(DonaServidorCapa(capa).length-1)=="&") ? "": "&", "t=", capa.nom, "&");

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

function FesPeticioCapacitatsPost(servidor, versio, tipus, suporta_cors)
{
var servidor_temp;

	ajaxGetCapabilities_POST[ajaxGetCapabilities_POST.length]=new Ajax();
	RespostaGetCapabilities_POST[RespostaGetCapabilities_POST.length]=new CreaRespostaGetCapabilities_POST(servidor);

	if (!suporta_cors && location.host && DonaHost(servidor).toLowerCase()!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
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

function DonaRequestServiceMetadata(servidor, versio, tipus, suporta_cors)
{
	if (tipus=="TipusWMS" || tipus=="TipusWMS_C")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION="+versio+ "&SERVICE=WMS", ParamCtrl.UsaSempreMeuServidor ? true : false, suporta_cors);
	if (tipus=="TipusWMTS_KVP")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION=1.0.0&SERVICE=WMTS", ParamCtrl.UsaSempreMeuServidor ? true : false, suporta_cors);
	if (tipus=="TipusWMTS_REST")
		return servidor + ((servidor.charAt(servidor.length-1)=="/") ? "": "/") + "1.0.0/WMTSCapabilities.xml";
	if (tipus=="TipusWFS")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION="+versio+ "&SERVICE=WFS", ParamCtrl.UsaSempreMeuServidor ? true : false, suporta_cors);
	if (tipus=="TipusSOS")
		return AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION="+versio+ "&SERVICE=SOS", ParamCtrl.UsaSempreMeuServidor ? true : false, suporta_cors);
	// En TipusOAPI_Maps, ... no existeix aquesta petició que he de retornar, la landing page?
	return "";
}


function CalGirarCoordenades(crs, v)
{
	if(crs.toUpperCase()=="EPSG:4326" && (!v || (v.Vers==1 && v.SubVers>=3) || v.Vers>1))
		return true;
	return false;
}

function AfegeixPartCridaComunaGetMapiGetFeatureInfo(i, i_estil, pot_semitrans, ncol, nfil, env, i_data, valors_i)
{
var cdns=[], tipus, plantilla, i_estil2, capa=ParamCtrl.capa[i];

	tipus=DonaTipusServidorCapa(capa);
	if (tipus=="TipusOAPI_Maps")
	{
		if(capa.URLTemplate)
			plantilla=capa.URLTemplate+"?";
		else
			plantilla="/collections/{collectionId}/styles/{styleId}/map?";

		plantilla=plantilla.replace("{collectionId}", capa.nom);
		if (capa.estil && capa.estil.length)
		{
			i_estil2=(i_estil==-1) ? capa.i_estil : i_estil;
			if (capa.estil[i_estil2].nom)
	 			plantilla=plantilla.replace("{styleId}", capa.estil[i_estil2].nom);
			else
				plantilla=plantilla.replace("{styleId}", "default");
		}
		else
			plantilla=plantilla.replace("{styleId}", "default");
		cdns.push(plantilla);
	}

	if (DonaVersioServidorCapa(capa).Vers<1 || (DonaVersioServidorCapa(capa).Vers==1 && DonaVersioServidorCapa(capa).SubVers<2))
		cdns.push("SRS=");
	else
		cdns.push("CRS=");
	cdns.push(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, "&BBOX=");

	if(CalGirarCoordenades(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,  (tipus=="TipusOAPI_Maps" ? null : DonaVersioServidorCapa(capa))))
		cdns.push(env.MinY , "," , env.MinX , "," , env.MaxY , "," , env.MaxX);
	else
		cdns.push(env.MinX , "," , env.MinY , "," , env.MaxX , "," , env.MaxY);

	cdns.push("&WIDTH=" , ncol , "&HEIGHT=" , nfil);
	if(tipus=="TipusOAPI_Maps")
		cdns.push("&f=" , capa.FormatImatge ) ;
	else
		 cdns.push("&LAYERS=" , capa.nom, "&FORMAT=" , capa.FormatImatge );
	cdns.push(((capa.FormatImatge=="image/jpeg") ? "" : "&TRANSPARENT=" + ((capa.transparencia && capa.transparencia!="opac")? "TRUE" : "FALSE")));

	if(tipus!="TipusOAPI_Maps")
	{
		cdns.push("&STYLES=");
		if (capa.estil && capa.estil.length)
		{
			i_estil2=(i_estil==-1) ? capa.i_estil : i_estil;

			if (capa.estil[i_estil2].nom)
			{
				if (EsCapaBinaria(capa))
				{
					alert("A binary array layer cannot have a 'estil' with 'nom'. The 'nom' is being disabled. Please use extra dimensions instead of style names");
					capa.estil[i_estil2].nom=null;
				}
				else
				{
					cdns.push(capa.estil[i_estil2].nom);
					if (pot_semitrans && !EsCapaBinaria(capa) && capa.FormatImatge!="image/jpeg" && capa.visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor)
						cdns.push(":SEMITRANSPARENT");
				}
			}
			else if (pot_semitrans && !EsCapaBinaria(capa) && capa.FormatImatge!="image/jpeg" && capa.visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor)
				cdns.push("SEMITRANSPARENT");
		}
		else if (pot_semitrans && !EsCapaBinaria(capa) && capa.FormatImatge!="image/jpeg" && capa.visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor)
				cdns.push("SEMITRANSPARENT");

		//Afegeixo els paràmetres addicionals que venen de la definició dels valors.
		if (valors_i && valors_i.param)
		{
			var clau_valor;
			for (var i_param=0; i_param<valors_i.param.length; i_param++)
			{
				clau_valor=valors_i.param[i_param];
				//Si la clau no comença per "DIM_", llavors ho afageixo jo
				cdns.push("&",
					((clau_valor.clau.nom.toUpperCase()!="TIME" && clau_valor.clau.nom.toUpperCase()!="ELEVATION" && clau_valor.clau.nom.substr(0,4).toUpperCase()!="DIM_") ? "DIM_": ""),
					clau_valor.clau.nom,"=",clau_valor.valor.nom);
			}
		}
		if (capa.dimensioExtra)
		{
			for (var i_param=0; i_param<capa.dimensioExtra.length; i_param++)
			{
				if (capa.dimensioExtra[i_param].i_valor>-1)
				{
					var clau=capa.dimensioExtra[i_param].clau.nom;
					//Si la clau no comença per "DIM_", llavors ho afageixo jo
					cdns.push("&",
						((clau.toUpperCase()!="TIME" && clau.toUpperCase()!="ELEVATION" && clau.substr(0,4).toUpperCase()!="DIM_") ? "DIM_": ""),
						clau,"=",capa.dimensioExtra[i_param].valor[capa.dimensioExtra[i_param].i_valor].nom);
				}
			}
		}
	}
	if (capa.AnimableMultiTime)
	{
		if(tipus=="TipusOAPI_Maps")
			cdns.push("&datetime=",
				(DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)],capa.FlagsData)));
		else
			cdns.push("&TIME=",
			(DonaDataJSONComATextISO8601(capa.data[DonaIndexDataCapa(capa, i_data)],capa.FlagsData)));
	}
	return cdns.join("");
}

//i_estil és un index d'estil o -1 si ha de ser l'estil indicat a la capa
//i_data és un número (positiu o negatiu o null si ha de ser la dada indicada a la capa.
function DonaRequestGetMap(i, i_estil, pot_semitrans, ncol, nfil, env, i_data, valors_i)
{
var cdns=[], tipus, capa=ParamCtrl.capa[i];

	tipus=DonaTipusServidorCapa(capa);
	if (tipus!="TipusOAPI_Maps")
	{
		if (DonaVersioServidorCapa(capa).Vers<1 || (DonaVersioServidorCapa(capa).Vers==1 && DonaVersioServidorCapa(capa).SubVers==0))
			cdns.push("WMTVER=");
		else
			cdns.push("SERVICE=WMS&VERSION=");
		cdns.push(DonaVersioComAText(DonaVersioServidorCapa(capa)), "&REQUEST=");

		if (DonaVersioServidorCapa(capa).Vers<1 || (DonaVersioServidorCapa(capa).Vers==1 && DonaVersioServidorCapa(capa).SubVers==0))
			cdns.push("map&");
		else
			cdns.push("GetMap&");
	}
	cdns.push(AfegeixPartCridaComunaGetMapiGetFeatureInfo(i, i_estil, pot_semitrans, ncol, nfil, env, i_data, valors_i));

	var s=AfegeixNomServidorARequest(DonaServidorCapa(capa), cdns.join(""), ParamCtrl.UsaSempreMeuServidor ? true : false, DonaCorsServidorCapa(capa));

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
}

function PortamASeleccio()
{
	if(EnvSelec)
		PortamAAmbit(EnvSelec);
}


function OmpleVistaCapa(nom_vista, vista, i)
{
var tipus=DonaTipusServidorCapa(ParamCtrl.capa[i]);
	if (tipus=="TipusWMS" || tipus=="TipusOAPI_Maps" || tipus=="TipusHTTP_GET")
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
// ·$· potser ni pel vídeo
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

	var s=DonaRequestGetMap(i_capa, i_estil, pot_semitrans, vista.ncol, vista.nfil, vista.EnvActual, i_data, null);
	CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
	return s;
}

function DonaDescripcioValorMostrarCapa(i_capa, una_linia)
{
var capa=ParamCtrl.capa[i_capa];
	if (una_linia)
		return (capa.DescLlegenda ? DonaCadena(capa.DescLlegenda) :
				DonaCadenaNomDesc(capa)) +
			((capa.estil.length>1 && capa.estil[capa.i_estil].desc) ? " - " + DonaCadena(capa.estil[capa.i_estil].desc) : "") +
			(capa.estil[capa.i_estil].DescItems ? " (" + DonaCadena(capa.estil[capa.i_estil].DescItems) +")" : "");

	return (capa.estil[capa.i_estil].desc ?
			DonaCadena(capa.estil[capa.i_estil].desc) : DonaCadenaNomDesc(capa)
		) + (capa.estil[capa.i_estil].DescItems ? " (" + DonaCadena(capa.estil[capa.i_estil].DescItems) +")" : "");
}

//Igual que la funció posterior però retorna sempre un text
function DonaTextCategoriaDesDeColor(categories, atributs, i_color, filtra_stats, compacte)
{
	return DonaCadena(DonaDescCategoriaDesDeColor(categories, atributs, i_color, filtra_stats, compacte));
}

//Aquesta funció assumeix que hi ha estil.categories i estil.atributs. Si alguna descripció era undefined, obvia aquesta i continua amb les altres. Si la cadena és multiidioma es retorna un objecte
function DonaDescCategoriaDesDeColor(categories, atributs, i_color, filtra_stats, compacte)
{
	if (atributs.length==1)
	{
		if (categories[i_color] && categories[i_color][atributs[0].nom])
			return categories[i_color][atributs[0].nom];
		return "";
	}
	if (!categories[i_color])
		return "";

	var value_text;	
	var i_ple=0;
	var desc_atrib;
	
	if (compacte)
		value_text="[";
	else
		value_text="<br>";
	
	for (var i_a=0; i_a<atributs.length; i_a++)
	{
		if (!categories[i_color][atributs[i_a].nom])
			continue; //return ""; -> per algun atribut pot no haver valor però puc mostrar els altres
						
		if (filtra_stats && atributs[i_a].nom.substring(0,7) == "$stat$_")
			continue; //en un context de "nomes_atrib_simples" els stat no els vull mostrar
		
		if (atributs[i_a].mostrar == "no" || (atributs[i_a].mostrar == "si_ple" && 
				(!categories[i_color][atributs[i_a].nom] || categories[i_color][atributs[i_a].nom].length==0)))
			continue; //si és no mostrable o és si_ple i buit no el mostro
			
		if (compacte)
			desc_atrib=(atributs[i_a].simbol ? atributs[i_a].simbol : (atributs[i_a].descripcio ? DonaCadena(atributs[i_a].descripcio) : atributs[i_a].nom));
		else
			desc_atrib=(atributs[i_a].descripcio ? DonaCadena(atributs[i_a].descripcio) : (atributs[i_a].simbol ? atributs[i_a].simbol : atributs[i_a].nom));
		
		if (atributs[i_a].NDecimals)
			value_text+= desc_atrib + ": " + OKStrOfNe(categories[i_color][atributs[i_a].nom], atributs[i_a].NDecimals);		
		else
			value_text+= desc_atrib + ": " + categories[i_color][atributs[i_a].nom];
		if (atributs[i_a].unitats)
			value_text+=" "+atributs[i_a].unitats;
		i_ple++;
		if (i_a+1<atributs.length)
		{
			if (compacte)
				value_text+="; "
			else
				value_text+="<br>"				
		}
	}
	if (compacte)
	{
		if (value_text.length>2 && value_text.substr(value_text.length-2)=="; ")
			value_text=value_text.substring(0, value_text.length-2);
	}
	else
	{
		if (value_text.length>4 && value_text.substr(value_text.length-4)=="<br>")
			value_text=value_text.substring(0, value_text.length-4);	
	}
	
	if (i_ple==1) 
	{
		if (compacte) //si només hi ha un atribut no cal posar-lo entre "[", ni tampoc posar la descripció abans ni els ": "
			value_text=value_text.substr(desc_atrib.length+2+2);
		else
			value_text=value_text.substr(desc_atrib.length+2+4);
	}
	else if (compacte)
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

function EsCapaBinaria(capa)
{
	return capa.FormatImatge=="application/x-img" || 
	    (capa.FormatImatge=="image/tiff" && (capa.tipus=="TipusHTTP_GET" || !capa.tipus))
}


function CanviaImatgeCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param)
{
var capa=ParamCtrl.capa[i_capa];

	if (EsCapaBinaria(capa))
		CanviaImatgeBinariaCapa(imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param);
	else
	{
		var url_dades=DonaRequestGetMap(i_capa, i_estil, true, vista.ncol, vista.nfil, vista.EnvActual, i_data, null);
		var url_dades_real=url_dades;
		if (window.doAutenticatedHTTPRequest && capa.access && capa.access.request && capa.access.request.indexOf("map")!=-1)
		{
			/*var authResponse=hello(capa.access.tokenType).getAuthResponse();
			if (IsAuthResponseOnline(authResponse))
			{
				if (authResponse.error)
				{
					alert(authResponse.error.message)
					return;
				}
				if (authResponse.error_description)
				{
					alert(authResponse.error_description)
					return;
				}
				url_dades_real+= "&" + "access_token=" + authResponse.access_token;
			}
			else*/
			if (null==(url_dades_real=AddAccessTokenToURLIfOnline(url_dades_real, capa.access)))
			{
				AuthResponseConnect(CanviaImatgeCapa, capa.access, imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param, null, null, null);
				return;
			}
		}
		if (DonaTipusServidorCapa(ParamCtrl.capa[i_capa])=="TipusOAPI_Maps")
			imatge.i_event=CreaIOmpleEventConsola("OAPI_Maps", i_capa, url_dades, TipusEventGetMap);
		else
			imatge.i_event=CreaIOmpleEventConsola("GetMap", i_capa, url_dades, TipusEventGetMap);
		if (nom_funcio_ok)
			imatge.nom_funcio_ok=nom_funcio_ok;
		if (typeof funcio_ok_param!=="undefined" && funcio_ok_param!=null)
			imatge.funcio_ok_param=funcio_ok_param;
		imatge.onerror=onErrorCanviaImatge;
		imatge.onload=onLoadCanviaImatge;

		imatge.src=url_dades_real;
	}
}

/* No puc fer servir aquestas funció donat que els PNG's progressius no es tornen a mostrar només fent un showLayer. Els torno a demanar sempre.
function CanviaImatgeCapaSiCal(imatge, i_capa)
{
	//Aquí no faig servir DonaCadenaLang() expressament. Si es canvia l'idioma mentre es mostre un "espereu.gif", aquest no és canviat pel nou idioma. De fet, això es podria fer durant el canvi d'idioma però és un detall massa insignificant.
	if ((ParamCtrl.capa[i_capa].transparencia && ParamCtrl.capa[i_capa].transparencia=="semitransparent") ||
		imatge.src.indexOf("espereu_cat.gif")!=-1 || imatge.src.indexOf("espereu_spa.gif")!=-1 || imatge.src.indexOf("espereu_eng.gif")!=-1|| imatge.src.indexOf("espereu_fre.gif")!=-1)
	{
	    for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		OmpleVistaCapa(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista, i_capa);
	}
}*/

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

function ActivaSombraFonts(ctx)
{
var shadowPrevi={blur: ctx.shadowBlur, offsetX: ctx.shadowOffsetX, offsetY: ctx.shadowOffsetY, color: ctx.shadowColor};
	ctx.shadowBlur=3;
	ctx.shadowOffsetX=1;
	ctx.shadowOffsetY=1;
	ctx.shadowColor="white";
	return shadowPrevi;
}

function DesactivaSombraFonts(ctx, shadowPrevi)
{
	ctx.shadowBlur=shadowPrevi.blur;
	ctx.shadowOffsetX=shadowPrevi.offsetX;
	ctx.shadowOffsetY=shadowPrevi.offsetY;
	ctx.shadowColor=shadowPrevi.color;
}

function PreparaCtxColorVoraOInterior(vista, capa_digi, j, previ, ctx, ctx_style, estil_interior_o_vora, i_atri, a, valor_min, ncolors, i_col, i_fil)
{
	var i_color, valor;
	if (!estil_interior_o_vora || !estil_interior_o_vora)
		return;
	previ[ctx_style]=ctx[ctx_style];
	if (typeof i_atri==="undefined")
	{
		ctx[ctx_style]=estil_interior_o_vora.paleta.colors[0];
		return;
	}
	valor=DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_atri, i_col, i_fil)
	if (isNaN(valor))
	{
		ctx[ctx_style]="rgba(255,255,255,0)";
		return;
	}
	i_color=Math.floor(a*(valor-valor_min));
	if (i_color>=ncolors)
		i_color=ncolors-1;
	else if (i_color<0)
		i_color=0;
	ctx[ctx_style]=estil_interior_o_vora.paleta.colors[i_color];
}

function PintaCtxColorVoraIInterior(estil_vora, estil_interior, ctx, previ)
{
	if (estil_interior)
	{
		//https://stackoverflow.com/questions/13618844/polygon-with-a-hole-in-the-middle-with-html5s-canvas
		ctx.mozFillRule = 'evenodd'; //for old firefox 1~30
		ctx.fill('evenodd'); //for firefox 31+, IE 11+, chrome
	}
	if (estil_vora)
		ctx.stroke();
	if (estil_interior && estil_interior.paleta)
		ctx.fillStyle=previ.fillStyle;
	if (estil_vora && estil_vora.paleta)
		ctx.strokeStyle=previ.strokeStyle;
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
		var i_atri_sel, i_atri_interior=[], i_atri_vora=[];
		if (estil.simbols && estil.simbols.length)
		{
			for (var i_simb=0; i_simb<estil.simbols.length; i_simb++)
			{
				var simbols=estil.simbols[i_simb];
				if (simbols.NomCamp)
				{
					//Precàrrega de valors si hi ha referencies ràster.
					var i=DonaIAtributsDesDeNomAtribut(capa_digi, simbols.NomCamp)
					if (i==-1)
					{
						AlertaNomAtributIncorrecteSimbolitzar(simbols.NomCamp, "simbols.NomCamp", capa_digi);
						return ;
					}
					if (PrecarregaValorsArrayBinaryAtributSiCal(i, OmpleVistaCapaDigiIndirect, param))
						return;
				}
				if (simbols.NomCampFEscala)
				{
					//Precàrrega de valors si hi ha referencies ràster.
					var i=DonaIAtributsDesDeNomAtribut(capa_digi, simbols.NomCampFEscala)
					if (i==-1)
					{
						AlertaNomAtributIncorrecteSimbolitzar(simbols.NomCampFEscala, "simbols.NomCampFEscala", capa_digi);
						return ;
					}
					if (PrecarregaValorsArrayBinaryAtributSiCal(i, OmpleVistaCapaDigiIndirect, param))
						return;
				}
			}
		}
		if (estil.NomCampSel)
		{
			//Precàrrega de valors de la selecció
			i_atri_sel=DonaIAtributsDesDeNomAtribut(capa_digi, estil.NomCampSel)
			if (i_atri_sel==-1)
			{
				AlertaNomAtributIncorrecteSimbolitzar(estil.NomCampSel, "estil.NomCampSel", capa_digi);
				return ;
			}
			if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_sel, OmpleVistaCapaDigiIndirect, param))
				return;
		}
		if (estil.formes && estil.formes.length)
		{
			for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
			{
				forma=estil.formes[i_forma];
				if (forma.interior &&
					forma.interior.NomCamp)
				{
					//Precàrrega de valors si hi ha referencies ràster.
					i_atri_interior[i_forma]=DonaIAtributsDesDeNomAtribut(capa_digi, forma.interior.NomCamp)
					if (i_atri_interior[i_forma]==-1)
					{
						AlertaNomAtributIncorrecteSimbolitzar(forma.interior.NomCamp, "forma.interior.NomCamp", capa_digi);
						return ;
					}
					if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_interior[i_forma], OmpleVistaCapaDigiIndirect, param))
						return;
				}
				if (forma.vora &&
					forma.vora.NomCamp)
				{
					//Precàrrega de valors si hi ha referencies ràster.
					i_atri_vora[i_forma]=DonaIAtributsDesDeNomAtribut(capa_digi, forma.vora.NomCamp)
					if (i_atri_vora[i_forma]==-1)
					{
						AlertaNomAtributIncorrecteSimbolitzar(forma.vora.NomCamp, "forma.vora.NomCamp", capa_digi);
						return ;
					}
					if (PrecarregaValorsArrayBinaryAtributSiCal(i_atri_vora[i_forma], OmpleVistaCapaDigiIndirect, param))
						return;
				}
			}
		}
		if (HiHaSimbolitzacioIndexadaPerPropietats(estil))
		{
			if (DescarregaPropietatsCapaDigiVistaSiCal(OmpleVistaCapaDigiIndirect, param))
				return;  //ja es tornarà a cridar a si mateixa quan la crida assincrona acabi
		}
		var previ={}, a_vmin_ncol_interior=[], a_vmin_ncol_interiorSel=[], un_a_vmin_ncol_interior, valor, a_vmin_ncol_vora=[], a_vmin_ncol_voraSel=[], un_a_vmin_ncol_vora, forma, forma_interior, forma_vora;
		var nom_canvas=DonaNomCanvasCapaDigi(nom_vista, param.i_capa);
		var env_icona, i_col, i_fil, icona, font, i_simbol, mida, text, coord, geometry, lineString, polygon;
		var win = DonaWindowDesDeINovaVista(vista);
		var canvas = win.document.getElementById(nom_canvas);
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (estil.formes && estil.formes.length)
		{
			for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
			{
				forma=estil.formes[i_forma];
				if (forma.interior && forma.interior.paleta)
				{
					a_vmin_ncol_interior[i_forma]={};
					a_vmin_ncol_interior[i_forma].ncolors=forma.interior.paleta.colors.length;
					a_vmin_ncol_interior[i_forma].a=DonaFactorAEstiramentPaleta(forma.interior.estiramentPaleta, a_vmin_ncol_interior[i_forma].ncolors);
					a_vmin_ncol_interior[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.interior.estiramentPaleta);
				}
				if (forma.interiorSel && forma.interiorSel.paleta)
				{
					a_vmin_ncol_interiorSel[i_forma]={};
					a_vmin_ncol_interiorSel[i_forma].ncolors=forma.interiorSel.paleta.colors.length;
					a_vmin_ncol_interiorSel[i_forma].a=DonaFactorAEstiramentPaleta(forma.interiorSel.estiramentPaleta, a_vmin_ncol_interiorSel[i_forma].ncolors);
					a_vmin_ncol_interiorSel[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.interiorSel.estiramentPaleta);
				}
				if (forma.vora && forma.vora.paleta)
				{
					a_vmin_ncol_vora[i_forma]={};
					a_vmin_ncol_vora[i_forma].ncolors=forma.vora.paleta.colors.length;
					a_vmin_ncol_vora[i_forma].a=DonaFactorAEstiramentPaleta(forma.vora.estiramentPaleta, a_vmin_ncol_vora[i_forma].ncolors);
					a_vmin_ncol_vora[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.vora.estiramentPaleta);
				}
				if (forma.voraSel && forma.voraSel.paleta)
				{
					a_vmin_ncol_voraSel[i_forma]={};
					a_vmin_ncol_voraSel[i_forma].ncolors=forma.voraSel.paleta.colors.length;
					a_vmin_ncol_voraSel[i_forma].a=DonaFactorAEstiramentPaleta(forma.voraSel.estiramentPaleta, a_vmin_ncol_voraSel[i_forma].ncolors);
					a_vmin_ncol_voraSel[i_forma].valor_min=DonaFactorValorMinEstiramentPaleta(forma.voraSel.estiramentPaleta);
				}
			}
		}

		for (var j=capa_digi.objectes.features.length-1; j>=0; j--)
		{
			geometry=DonaGeometryCRSActual(capa_digi.objectes.features[j], capa_digi.CRSgeometry);
			if (geometry.type=="LineString" || geometry.type=="MultiLineString")
			{
				if (!estil.formes)
					alert("No symbology for lineString found: 'formes' found");

				for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
				{
					forma=estil.formes[i_forma];
					if (vista.i_nova_vista!=NovaVistaImprimir && capa_digi.objectes.features[j].seleccionat==true && forma.voraSel)  //Sistema que feiem servir per l'edició
					{
						forma_vora=forma.voraSel;
						un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
					}
					else if (estil.NomCampSel)
					{
						if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_atri_sel, i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
						{
							if (forma.voraSel)
							{
								forma_vora=forma.voraSel;
								un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
							}
							else
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
						}
						else
						{
							if (forma.voraSel)
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							else
							{
								forma_vora=null;
								un_a_vmin_ncol_vora=null;
							}
						}
					}
					else
					{
						forma_vora=forma.vora;
						un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
					}


					if (!forma_vora)
						continue;
					PreparaCtxColorVoraOInterior(vista, capa_digi, j, previ, ctx, "strokeStyle", forma_vora, i_atri_vora[i_forma], un_a_vmin_ncol_vora.a, un_a_vmin_ncol_vora.valor_min, un_a_vmin_ncol_vora.ncolors, i_col, i_fil);
				 	if (!forma_vora.gruix || !forma_vora.gruix.amples || !forma_vora.gruix.amples.length)
						ctx.lineWidth = 1;
					else
						ctx.lineWidth = forma_vora.gruix.amples[0];

					ctx.beginPath();
					if (!forma_vora.patro || !forma_vora.patro.separacions || !forma_vora.patro.separacions.length)
						ctx.setLineDash([]);
					else
						ctx.setLineDash(forma_vora.patro.separacions[0]);

					for (var c2=0; c2<(geometry.type=="MultiLineString" ? geometry.coordinates.length : 1); c2++)
					{
						if (geometry.type=="MultiLineString")
							lineString=geometry.coordinates[c2];
						else
							lineString=geometry.coordinates;
						i_col=Math.round((lineString[0][0]-env.MinX)/(env.MaxX-env.MinX)*vista.ncol);
						i_fil=Math.round((env.MaxY-lineString[0][1])/(env.MaxY-env.MinY)*vista.nfil);
						ctx.moveTo(i_col, i_fil);
						for (var c1=1; c1<lineString.length; c1++)
						{
							i_col=Math.round((lineString[c1][0]-env.MinX)/(env.MaxX-env.MinX)*vista.ncol);
							i_fil=Math.round((env.MaxY-lineString[c1][1])/(env.MaxY-env.MinY)*vista.nfil);
							ctx.lineTo(i_col, i_fil);
						}						
					}
					PintaCtxColorVoraIInterior(forma_vora, null, ctx, previ);
				}
			}
			else if (geometry.type=="Polygon" || geometry.type=="MultiPolygon")
			{
				//http://stackoverflow.com/questions/13618844/polygon-with-a-hole-in-the-middle-with-html5s-canvas
				if (!estil.formes)
					alert("No symbology for polygon found: 'formes' found");

				for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
				{
					forma=estil.formes[i_forma];
					if (vista.i_nova_vista!=NovaVistaImprimir && capa_digi.objectes.features[j].seleccionat==true && (forma.voraSel || forma.interiorSel))  //Sistema que feiem servir per l'edició
					{
						forma_vora=forma.voraSel ? forma.voraSel : forma.vora;
						un_a_vmin_ncol_vora=forma.voraSel ? a_vmin_ncol_voraSel[i_forma] : a_vmin_ncol_vora[i_forma];
						forma_interior=forma.interiorSel ? forma.interiorSel : forma.interior;
						un_a_vmin_ncol_interior=forma.interiorSel ? a_vmin_ncol_interiorSel[i_forma] : a_vmin_ncol_interior[i_forma];
					}
					else if (estil.NomCampSel)
					{
						if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_atri_sel, i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
						{
							if (forma.voraSel)
							{
								forma_vora=forma.voraSel;
								un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
							}
							else
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							if (forma.interiorSel)
							{
								forma_interior=forma.interiorSel;
								un_a_vmin_ncol_interior=a_vmin_ncol_interiorSel[i_forma];
							}
							else
							{
								forma_interior=forma.interior;
								un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
							}
						}
						else
						{
							if (forma.voraSel)
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							else
							{
								forma_vora=null;
								un_a_vmin_ncol_vora=null;
							}
							if (forma.interiorSel)
							{
								forma_interior=forma.interior;
								un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
							}
							else
							{
								forma_interior=null;
								un_a_vmin_ncol_interior=null;
							}
						}
					}
					else
					{
						forma_vora=forma.vora;
						un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
						forma_interior=forma.interior;
						un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
					}

					if (!forma_vora && !forma_interior)
						continue;
					if (forma_interior)
						PreparaCtxColorVoraOInterior(vista, capa_digi, j, previ, ctx, "fillStyle", forma_interior, i_atri_interior[i_forma], un_a_vmin_ncol_interior.a, un_a_vmin_ncol_interior.valor_min, un_a_vmin_ncol_interior.ncolors, i_col, i_fil);
					if (forma_vora)
					{
						PreparaCtxColorVoraOInterior(vista, capa_digi, j, previ, ctx, "strokeStyle", forma_vora, i_atri_vora[i_forma], un_a_vmin_ncol_vora.a, un_a_vmin_ncol_vora.valor_min, un_a_vmin_ncol_vora.ncolors, i_col, i_fil);

						if (!forma_vora.gruix || !forma_vora.gruix.amples || !forma_vora.gruix.amples.length)
							ctx.lineWidth = 1;
						else
							ctx.lineWidth = forma_vora.gruix.amples[0];
					}
					ctx.beginPath();
					if (forma_vora)
					{
						if (!forma_vora.patro || !forma_vora.patro.separacions || !forma_vora.patro.separacions.length)
							ctx.setLineDash([]);
						else
							ctx.setLineDash(forma_vora.patro.separacions[0]);
					}
					for (var c3=0; c3<(geometry.type=="MultiPolygon" ? geometry.coordinates.length : 1); c3++)
					{
						if (geometry.type=="MultiPolygon")
							polygon=geometry.coordinates[c3];
						else
							polygon=geometry.coordinates;
						for (var c2=0; c2<polygon.length; c2++)
						{
							lineString=polygon[c2];
							i_col=Math.round((lineString[0][0]-env.MinX)/(env.MaxX-env.MinX)*vista.ncol);
							i_fil=Math.round((env.MaxY-lineString[0][1])/(env.MaxY-env.MinY)*vista.nfil);
							ctx.moveTo(i_col, i_fil);
							for (var c1=1; c1<lineString.length; c1++)
							{
								i_col=Math.round((lineString[c1][0]-env.MinX)/(env.MaxX-env.MinX)*vista.ncol);
								i_fil=Math.round((env.MaxY-lineString[c1][1])/(env.MaxY-env.MinY)*vista.nfil);
								ctx.lineTo(i_col, i_fil);
							}
						}
					}
					PintaCtxColorVoraIInterior(forma_vora, forma_interior, ctx, previ);
				}
			}
			else if (geometry.type=="Point" || geometry.type=="MultiPoint")
			{
				for (var c1=0; c1<(geometry.type=="MultiPoint" ? geometry.coordinates.length : 1); c1++)
				{
					if (geometry.type=="MultiPoint")
						coord=geometry.coordinates[c1];
					else
						coord=geometry.coordinates;
					i_col=Math.round((coord[0]-env.MinX)/(env.MaxX-env.MinX)*vista.ncol);
					i_fil=Math.round((env.MaxY-coord[1])/(env.MaxY-env.MinY)*vista.nfil);
					if (estil.simbols && estil.simbols.length)
					{
						for(i_simb=0; i_simb<estil.simbols.length; i_simb++)
						{
							var simbols=estil.simbols[i_simb];
						 	if (simbols.simbol)
							{
								var simbol=simbols.simbol;
								if (i_col<0 || i_col>vista.ncol || i_fil<0 || i_fil>vista.nfil)
									i_simbol=-1;  //Necessari per evitar formules que puguin contenir valors de raster.
								else if (simbol.length==1 && !simbols.NomCamp)
									i_simbol=0;
								else
									i_simbol=DeterminaISimbolObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_simb, i_col, i_fil);

								if (i_simbol!=-1)
								{
									if (vista.i_nova_vista!=NovaVistaImprimir && capa_digi.objectes.features[j].seleccionat==true && simbol[i_simbol].IconaSel)  //Sistema que feiem servir per l'edició
										icona=simbol[i_simbol].IconaSel;
									else if (estil.NomCampSel)
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
										if (simbols.NomCampFEscala)
										{
											icona.fescala=DeterminaValorObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_simb, i_col, i_fil, simbols.NomCampFEscala);
											if (typeof icona.fescala==="undefined" || isNaN(icona.fescala) || icona.fescala<=0)
												icona.fescala=-1;
										}
										else
											icona.fescala=1;

										if (icona.fescala>0)
											env_icona=DonaEnvIcona({x: coord[0],y: coord[1]}, icona);
										if (icona.fescala>0 && EsEnvDinsEnvolupant(env_icona, env))
										{
											//la layer l_obj_digi té les coordenades referides a la seva layer pare que és l_capa_digi --> No he de considerar ni els marges de la vista ni els scrolls.
											//la manera de fer això està extreta de: http://stackoverflow.com/questions/6011378/how-to-add-image-to-canvas

											if (Array.isArray(icona))
											{
												alert("OmpleVistaCapaDigiIndirect() does not implement arrays of shapes yet");
											}
											else if (icona.type=="circle" || icona.type=="square")
											{
												if (!estil.formes)
													alert("No symbology for 'circle' or 'squere' was found: 'formes' is required");

												for (var i_forma=0; i_forma<estil.formes.length; i_forma++)
												{
													forma=estil.formes[i_forma];

					if (vista.i_nova_vista!=NovaVistaImprimir && capa_digi.objectes.features[j].seleccionat==true && (forma.voraSel || forma.interiorSel))  //Sistema que feiem servir per l'edició
					{
						forma_vora=forma.voraSel ? forma.voraSel : forma.vora;
						un_a_vmin_ncol_vora=forma.voraSel ? a_vmin_ncol_voraSel[i_forma] : a_vmin_ncol_vora[i_forma];
						forma_interior=forma.interiorSel ? forma.interiorSel : forma.interior;
						un_a_vmin_ncol_interior=forma.interiorSel ? a_vmin_ncol_interiorSel[i_forma] : a_vmin_ncol_interior[i_forma];
					}
					else if (estil.NomCampSel)
					{
						if(DeterminaValorAtributObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_atri_sel, i_col, i_fil)==true)  //Sistema que fen servir per les consultes per atribut en vectors
						{
							if (forma.voraSel)
							{
								forma_vora=forma.voraSel;
								un_a_vmin_ncol_vora=a_vmin_ncol_voraSel[i_forma];
							}
							else
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							if (forma.interiorSel)
							{
								forma_interior=forma.interiorSel;
								un_a_vmin_ncol_interior=a_vmin_ncol_interiorSel[i_forma];
							}
							else
							{
								forma_interior=forma.interior;
								un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
							}
						}
						else
						{
							if (forma.voraSel)
							{
								forma_vora=forma.vora;
								un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
							}
							else
							{
								forma_vora=null;
								un_a_vmin_ncol_vora=null;
							}
							if (forma.interiorSel)
							{
								forma_interior=forma.interior;
								un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
							}
							else
							{
								forma_interior=null;
								un_a_vmin_ncol_interior=null;
							}
						}
					}
					else
					{
						forma_vora=forma.vora;
						un_a_vmin_ncol_vora=a_vmin_ncol_vora[i_forma];
						forma_interior=forma.interior;
						un_a_vmin_ncol_interior=a_vmin_ncol_interior[i_forma];
					}

					if (!forma_vora && !forma_interior)
						continue;
					if (forma_interior)
						PreparaCtxColorVoraOInterior(vista, capa_digi, j, previ, ctx, "fillStyle", forma_interior, i_atri_interior[i_forma], un_a_vmin_ncol_interior.a, un_a_vmin_ncol_interior.valor_min, un_a_vmin_ncol_interior.ncolors, i_col, i_fil);
													if (forma_vora)
														PreparaCtxColorVoraOInterior(vista, capa_digi, j, previ, ctx, "strokeStyle", forma_vora, i_atri_vora[i_forma], un_a_vmin_ncol_vora.a, un_a_vmin_ncol_vora.valor_min, un_a_vmin_ncol_vora.ncolors, i_col, i_fil);
													if (!forma_vora || !forma_vora.gruix || !forma_vora.gruix.amples || !forma_vora.gruix.amples.length)
														ctx.lineWidth = 1;
													else
														ctx.lineWidth = forma_vora.gruix.amples[0];

													ctx.beginPath();
													if (!forma_vora || !forma_vora.patro || !forma_vora.patro.separacions || !forma_vora.patro.separacions.length)
														ctx.setLineDash([]);
													else
														ctx.setLineDash(forma_vora.patro.separacions[0]);

													mida=DonaMidaIconaForma(icona);
													if (icona.unitats=="m")
													{
														if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
															mida/=FactorGrausAMetres;
														mida/=ParamInternCtrl.vista.CostatZoomActual;
													}
													if (mida<=0)
														mida=1;
													if (icona.type=="square")
													{
														ctx.rect(i_col-mida/2, i_fil-mida/2, mida, mida);
													}
													else
														ctx.arc(i_col, i_fil, mida, 0, 2*Math.PI);

													PintaCtxColorVoraIInterior(forma_vora, forma_interior, ctx, previ);
												}
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
														ctx.drawImage(icona.img, i_col-icona.i*icona.fescala,
																	i_fil-icona.j*icona.fescala, icona.img.ncol*icona.fescala, icona.img.nfil*icona.fescala);
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
												{
													//the icon is not available yet. Let's wait sometime and repeat this
													setTimeout("OmpleVistaCapaDigi(\"" + nom_vista + "\", " + JSON.stringify(vista) + ", " + param.i_capa + ");", 600);
													return;
												}
											}
										}
									}
								}
							}
						}
					}
					if (estil.fonts)
					{
						if (env.MinX < coord[0] &&
							env.MaxX > coord[0] &&
							env.MinY < coord[1] &&
							env.MaxY > coord[1])
						{
							valor=DeterminaTextValorObjecteCapaDigi(vista.i_nova_vista, capa_digi, j, i_simb, i_col, i_fil, estil.fonts.NomCampText);
							if (typeof valor!=="undefined" && (typeof valor!=="string" || valor!="") && (typeof valor!=="number" || !isNaN(valor)))
							{
								previ.shadow=ActivaSombraFonts(ctx);
								if(estil.fonts.aspecte.length==1)
									font=estil.fonts.aspecte[0].font;
								else
									font=estil.fonts.aspecte[capa_digi.objectes.features[j].i_aspecte].font;  //No acabat implementar encara. Caldria generar index d'estils a cada objecte.
								ctx.font=font.font;
								if (font.color)
								{
									previ.fillStyle=ctx.fillStyle;
									ctx.fillStyle=font.color;
								}
								if (font.align)
									ctx.textAlign=font.align;
								ctx.fillText(valor, i_col-font.i, i_fil-font.j);
								if (font.color)
									ctx.fillStyle=previ.fillStyle;
								DesactivaSombraFonts(ctx, previ.shadow);
							}
						}
					}
				}
			}
			else
			{
				alert("Type of feature geometry: " + geometry.type + " not supported yet");
			}
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
						null, {scroll: "no", visible: true, ev: null, save_content: false}, null, "<canvas id=\"" + DonaNomCanvasCapaDigi(nom_vista, /*i_nova_vista,*/ i) + "\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>");  // DonaCadenaHTMLCapaDigi(nom_vista, i_nova_vista, i)
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
	var tipus=DonaTipusServidorCapa(capa);

	img.src=s;
	if (tipus=="TipusWMTS_REST")
		img.i_event=CreaIOmpleEventConsola("WMTS-REST, tiled", i_capa, s, TipusEventWMTSTile);
	else if (tipus=="TipusWMTS_KVP")
		img.i_event=CreaIOmpleEventConsola("WMTS-KVP, tiled", i_capa, s, TipusEventWMTSTile);
	else if (tipus=="TipusOAPI_MapTiles")
		img.i_event=CreaIOmpleEventConsola("OAPI_MapTiles", i_capa, s, TipusEventWMTSTile);
	else if (tipus=="TipusOAPI_Maps")
		img.i_event=CreaIOmpleEventConsola("OAPI_Maps", i_capa, s, TipusEventGetMap);
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
						AfegeixAdrecaBaseSRC("espereu_"+ParamCtrl.idioma+".gif") +"\"></td>");
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
			if (DonaTipusServidorCapa(ParamCtrl.capa[i_capa])=="TipusWMTS_SOAP")
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
			if (DonaTipusServidorCapa(capa)=="TipusWMTS_REST")
				i_event=CreaIOmpleEventConsola("WMTS-REST, tiled", i_capa, s, TipusEventWMTSTile);
			else if (DonaTipusServidorCapa(capa)=="TipusWMTS_KVP")
				i_event=CreaIOmpleEventConsola("WMTS-KVP, tiled", i_capa, s, TipusEventWMTSTile);
			else if (DonaTipusServidorCapa(capa)=="TipusOAPI_MapTiles")
				i_event=CreaIOmpleEventConsola("OAPI_MapTiles", i_capa, s, TipusEventWMTSTile);
			else if (DonaTipusServidorCapa(capa)=="TipusOAPI_Maps")
				i_event=CreaIOmpleEventConsola("OAPI_Maps", i_capa, s, TipusEventGetMap);
			else //wms-c
				i_event=CreaIOmpleEventConsola("GetMap", i_capa, s, TipusEventGetMap);
			cdns.push(s);
			//cdns.push(DonaRequestGetMapTiled(i_capa, -1, true, tile_matrix.TileWidth, tile_matrix.TileHeight, i_tile_matrix_set, i_tile_matrix, j, i));
			cdns.push(" i_event=\""+i_event+"\" onLoad=\"onLoadCanviaImatge\" onError=\"onErrorCanviaImatge\"></td>");
		}
		cdns.push("  </tr>");
	}
	cdns.push("  </table>");

	return cdns.join("");
}

function DonaCadenaBotonsVistaLlegendaSituacioCoord()
{
var cdns=[]
	if (isFinestraLayer(window, "llegenda") && !isFinestraLayerVisible(window, "llegenda"))
		cdns.push(CadenaBotoPolsable('boto_mostra_llegenda', 'mostra_llegenda', DonaCadenaLang({"cat":"Mostra llegenda", "spa":"Muestra legenda", "eng":"Show legend","fre":"Afficher la légende"}), 'MostraFinestraLlegenda(event)'), "<br>",
			"<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"),"\" width=\"1\" height=\"3\"><br>");
	if (isFinestraLayer(window, "situacio") && !isFinestraLayerVisible(window, "situacio"))
		cdns.push(CadenaBotoPolsable('boto_mostra_situacio', 'mostra_situacio', DonaCadenaLang({"cat":"Mostra mapa de situació", "spa":"Muestra mapa de situación", "eng":"Show situation map", "fre":"Afficher la carte de situation"}), 'MostraFinestraSituacio(event)'),"<br>",
			"<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"),"\" width=\"1\" height=\"3\"><br>");
	if (isFinestraLayer(window, "coord") && !isFinestraLayerVisible(window, "coord"))
		cdns.push(CadenaBotoPolsable('boto_mostra_coord', 'mostra_coord', DonaCadenaLang({"cat":"Mostra informació de la posició", "spa":"Muestra información sobre la posición", "eng":"Show information about current position","fre":"Afficher des informations sur la position actuelle"}), 'MostraFinestraCoord(event)'),"<br>");
	return cdns.join("");
}

function TancaFinestra_llegenda_situacio_coord()
{
	document.getElementById("llegenda_situacio_coord").innerHTML=DonaCadenaBotonsVistaLlegendaSituacioCoord();
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
var SufixSliderZoom="sliderzoom";    //No pot tenir subratllat al davant. Aquesta es pot desactivar
var SufixTelTrans="_tel_trans";    //Cal que porti el subratllat al davant. Aquesta no s'hauria de desactivar mai
var SufixZRectangle="_z_rectangle";  //Cal que porti el subratllat al davant.

function CreaVistaImmediata(win, nom_vista, vista)
{
var cdns=[], ll;
var i_crea_vista;
var elem=getLayer(win, nom_vista);
var cal_vora=(ParamCtrl.VoraVistaGrisa && vista.i_nova_vista==NovaVistaPrincipal) ? true : false;
var cal_coord=(ParamCtrl.CoordExtremes && (vista.i_nova_vista==NovaVistaPrincipal || vista.i_nova_vista==NovaVistaImprimir)) ? true : false;
var estil_parella_coord=(vista.i_nova_vista==NovaVistaImprimir) ? true : false;
var p, unitats_CRS;

	if (ParamCtrl.CoordExtremes=="longlat_g")
		unitats_CRS="°";
	else if (ParamCtrl.CoordExtremes=="proj")
	{
		p=DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		if (p=="°")
			unitats_CRS=p;
		else
			unitats_CRS=" "+p;
	}
	else //if (ParamCtrl.CoordExtremes=="longlat_gms") -> tant pel cas gms (pq ja les té) com pel cas desconegut no poso unitats
		unitats_CRS="";

	NCreaVista++;
	i_crea_vista=NCreaVista;

	cdns.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
	if (vista.i_nova_vista==NovaVistaPrincipal)
	{
	    cdns.push("  <tr>",
				"    <td rowspan=", (cal_vora ? (cal_coord ? 8 : 7) : (cal_coord ? 5 : 3)), "><img src=\"",
				AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=1 width=", ((ParamCtrl.MargeEsqVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeEsqVista:0) , "></td>",
				"    <td colspan=", (cal_vora ? (cal_coord ? 6 : 5) : (cal_coord ? 3 : 1)), "><img src=\"",
				AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=" , ((ParamCtrl.MargeSupVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeSupVista:0) , " width=1></td>",
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
				cdns.push("(" , (OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
				  (OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
			else if (ParamCtrl.CoordExtremes=="longlat_g")
				cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
				  (OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, ")");
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)), unitats_CRS, "," , (g_gms(ll.y, true)), unitats_CRS, ")");
		}
		else
		{
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.x, true)), unitats_CRS);
		}
		cdns.push("</td>\n");

		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MaxY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push("    <td"+ (cal_vora ? " colspan=\"2\"" : ""), " align=right><font face=arial size=1>\n");
		if (estil_parella_coord)
		{
			if (ParamCtrl.CoordExtremes=="proj")
				cdns.push("(" , (OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
					(OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
			else if (ParamCtrl.CoordExtremes=="longlat_g")
				cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
					(OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS , ")");
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)), unitats_CRS, ",", (g_gms(ll.y, true)), unitats_CRS , ")");
		}
		else
		{
			if (ParamCtrl.CoordExtremes=="proj")
			    cdns.push((OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			   cdns.push((OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.x, true)), unitats_CRS);
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
	   "    <td colspan=", ((cal_vora) ? 3 : (cal_coord? 2: 1)), " rowspan=", ((cal_vora) ? 3 : ((cal_coord && !estil_parella_coord)? 2: 1)), " style=\"background-color:", ParamCtrl.ColorFonsVista ,";\"><img src=\"",
	   AfegeixAdrecaBaseSRC("1tran.gif"),"\" width=",vista.ncol," height=",vista.nfil,"></td>");

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
			    cdns.push((OKStrOfNe(vista.EnvActual.MaxY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.y, true)), unitats_CRS);
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
			    cdns.push((OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS);
			else if (ParamCtrl.CoordExtremes=="longlat_g")
			    cdns.push((OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS);
			else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			    cdns.push((g_gms(ll.y, true)), unitats_CRS);
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
			cdns.push("(" , (OKStrOfNe(vista.EnvActual.MinX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
				  (OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
		else if (ParamCtrl.CoordExtremes=="longlat_g")
			cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
				  (OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
		else //if (ParamCtrl.CoordExtremes=="longlat_gms")
				cdns.push("(" , (g_gms(ll.x, true)), unitats_CRS, "," , (g_gms(ll.y, true)), unitats_CRS, ")");
		cdns.push("</td>\n");

		if (ParamCtrl.CoordExtremes=="longlat_g" || ParamCtrl.CoordExtremes=="longlat_gms")
		    ll=DonaCoordenadesLongLat(vista.EnvActual.MaxX,vista.EnvActual.MinY,ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		cdns.push("    <td"+ (cal_vora ? " colspan=\"2\"" : ""), " align=right><font face=arial size=1>\n");
		if (ParamCtrl.CoordExtremes=="proj")
			cdns.push("(" , (OKStrOfNe(vista.EnvActual.MaxX,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, "," ,
					(OKStrOfNe(vista.EnvActual.MinY,ParamCtrl.NDecimalsCoordXY)), unitats_CRS, ")");
		else if (ParamCtrl.CoordExtremes=="longlat_g")
			cdns.push("(" , (OKStrOfNe(ll.x,ParamCtrl.NDecimalsCoordXY+4)), unitats_CRS, "," ,
					(OKStrOfNe(ll.y,ParamCtrl.NDecimalsCoordXY+4)) , ")");
		else //if (ParamCtrl.CoordExtremes=="longlat_gms")
			cdns.push("(" , (g_gms(ll.x, true)), "," , (g_gms(ll.y, true)), unitats_CRS, ")");
		cdns.push("    </td>\n");
		if (cal_vora)
			cdns.push("    <td><img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"), "\" height=0 width=10></td>\n");
		cdns.push("    <td",(cal_vora ? " rowspan=\"2\"": "" ),"><img src=\"",AfegeixAdrecaBaseSRC("1tran.gif"),
		   "\" height=" , AltTextCoordenada , "></td>\n",
		   "  </tr>\n");
	}

	if(ParamCtrl.MostraBarraEscala && vista.i_nova_vista==NovaVistaPrincipal)
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
					cdns.push(textHTMLLayer(nom_vista+"_l_capa"+i, DonaMargeEsquerraVista(vista.i_nova_vista)+1, DonaMargeSuperiorVista(vista.i_nova_vista)+1, vista.ncol, vista.nfil, null, {scroll: "no", visible:
											((EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=-1 ? vista.i_vista : DonaIVista(nom_vista), i)) ? true : false), ev: null, save_content: false}, null,
											(EsCapaBinaria(capa) ? "<canvas id=\"" + nom_vista + "_i_raster"+i+"\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>" : "<img id=\"" + nom_vista + "_i_raster"+i+"\" name=\"" + nom_vista + "_i_raster"+i+"\" src=\""+AfegeixAdrecaBaseSRC("espereu_"+ParamCtrl.idioma+".gif")+"\">")));
				}
			}
		}


		if (vista.i_nova_vista!=NovaVistaImprimir)  //Evito que la impressión tingui events.
		{
			//Dibuixo el rectangle de zoom sobre la vista (inicialment invisible)
			cdns.push(textHTMLLayer(nom_vista+SufixZRectangle, DonaMargeEsquerraVista(vista.i_nova_vista), DonaMargeSuperiorVista(vista.i_nova_vista), vista.ncol+1, vista.nfil+1, null, {scroll: "no", visible: false, border: "1px solid " + ParamCtrl.ColorQuadratSituacio, ev: null, save_content: false}, null, null));

			//Dibuixo el "tel" transparent amb els events de moure i click. Sembla que si tinc slider aquests esdeveniments no es fan servir i els altres tenen prioritat
			cdns.push(textHTMLLayer(nom_vista+SufixTelTrans, DonaMargeEsquerraVista(vista.i_nova_vista)+1, DonaMargeSuperiorVista(vista.i_nova_vista)+1, vista.ncol, vista.nfil, null, {scroll: "no", visible: true, ev: (ParamCtrl.ZoomUnSolClic ? "onmousedown=\"IniciClickSobreVista(event, "+vista.i_nova_vista+");\" " : "") + "onmousemove=\"MovimentSobreVista(event, "+vista.i_nova_vista+");\" onClick=\"ClickSobreVista(event, "+vista.i_nova_vista+");\" onTouchStart=\"return IniciDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchMove=\"return MovimentDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchEnd=\"return FiDitsSobreVista(event, "+vista.i_nova_vista+");\"", save_content: false, bg_trans: true}, null, "<!-- -->"));

		    var barra_slider=[];
		    if (( ParamCtrl.VistaBotonsBruixola || ParamCtrl.VistaBotonsZoom || ParamCtrl.VistaSliderZoom || ParamCtrl.VistaEscalaNumerica) && 
			vista.i_nova_vista==NovaVistaPrincipal && !ParamCtrl.hideLayersOverVista)
		    {
			barra_slider.push("<table class=\"", MobileAndTabletWebBrowser ? "finestra_superposada_opaca" : "finestra_superposada", "\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">");
			if (ParamCtrl.VistaBotonsBruixola && (parseInt(document.getElementById("vista").style.height) >= 300))
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
			if (ParamCtrl.VistaBotonsZoom)
			{
				barra_slider.push(CadenaBotoPolsable("boto_zoom_in", "zoom_in", DonaCadenaLang({"cat":"augmenta 1 nivell de zoom", "spa":"augmenta 1 nivel de zoom", "eng":"increase 1 zoom level","fre":"augmenter 1 niveau de zoom"}), "PortamANivellDeZoomEvent(event, " + (DonaIndexNivellZoom(vista.CostatZoomActual)+1) + ")"));
				barra_slider.push("<br>");
			}
			if (ParamCtrl.VistaSliderZoom && (parseInt(document.getElementById("vista").style.height) >= 500))
			{
				barra_slider.push("<input id='zoomSlider' type='range' step='1' min='0' max='", (ParamCtrl.zoom.length-1), "' value='", DonaIndexNivellZoom(vista.CostatZoomActual), "' style=';' orient='vertical' onchange='PortamANivellDeZoomEvent(event, this.value);' onclick='dontPropagateEvent(event);'><br>");
			}
			if (ParamCtrl.VistaBotonsZoom)
			{
				barra_slider.push(CadenaBotoPolsable("boto_zoom_out", "zoomout", DonaCadenaLang({"cat":"redueix 1 nivell de zoom", "spa":"reduce 1 nivel de zoom", "eng":"reduce 1 zoom level","fre":"réduire 1 niveau de zoom"}), "PortamANivellDeZoomEvent(event, " + (DonaIndexNivellZoom(vista.CostatZoomActual)-1) + ")"));
			}
			barra_slider.push("</td></tr>");
			if (ParamCtrl.VistaEscalaNumerica && (parseInt(document.getElementById("vista").style.height,10) >= 400))
			{
				barra_slider.push("<tr><td align='center'><span class=\"text_allus\" style='font-family: Verdana, Arial; font-size: 0.6em;'>", (ParamCtrl.TitolLlistatNivellZoom ? DonaCadena(ParamCtrl.TitolLlistatNivellZoom) : "Zoom:"), "<br>", EscriuDescripcioNivellZoom(DonaIndexNivellZoom(vista.CostatZoomActual), ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, true), "</span>");
				barra_slider.push("<br>");
				barra_slider.push(CadenaBotoPolsable("boto_zoomcoord", "zoomcoord", DonaCadenaLang({"cat":"anar a coordenada", "spa":"ir a coordenada", "eng":"go to coordinate", "fre":"aller à la coordonnée"}), "MostraFinestraAnarCoordenadaEvent(event)"));
				barra_slider.push(CadenaBotoPolsable("boto_zoom_bk", "zoom_bk", DonaCadenaLang({"cat":"vista prèvia", "spa":"vista previa", "eng":"previous view","fre":"vue préalable"}), "RecuperaVistaPreviaEvent(event)"));
				if (ParamCtrl.fullScreen)
					barra_slider.push(CadenaBotoPolsable("boto_fullscreen", "exitfullscreen", DonaCadenaLang({"cat":"sortir de pantalla completa", "spa":"salir de pantalla completa", "eng":"exit full screen","fre":"Quitter le mode plein écran"}), "ExitFullScreenEvent(event)"));
				else
					barra_slider.push(CadenaBotoPolsable("boto_fullscreen", "fullscreen", DonaCadenaLang({"cat":"pantalla completa", "spa":"pantalla completa", "eng":"full screen","fre":"plein écran"}), "GoFullScreenEvent(event)"));

				barra_slider.push("</td></tr>");
			}
			barra_slider.push("</table>");
		    }

		    if (ParamCtrl.VistaSliderData && ParamInternCtrl.millisegons.length &&
			vista.i_nova_vista==NovaVistaPrincipal && !ParamCtrl.hideLayersOverVista)
		    {
			barra_slider.push("<span style='position: absolute; bottom: 20; right: 100; font-family: Verdana, Arial; font-size: 0.6em;' class='text_allus ", MobileAndTabletWebBrowser ? "finestra_superposada_opaca" : "finestra_superposada", "'>", DonaDataMillisegonsComATextBreu(ParamInternCtrl.FlagsData, ParamInternCtrl.millisegons[ParamInternCtrl.iMillisegonsActual]),
					"<input type='button' value='<' onClick='PortamADataEvent(event, ", ParamInternCtrl.millisegons[(ParamInternCtrl.iMillisegonsActual ? ParamInternCtrl.iMillisegonsActual-1 : 0)], ");'", (ParamInternCtrl.iMillisegonsActual==0 ? " disabled='disabled'" : ""), ">",
					"<input id='timeSlider' type='range' style='width: 300px;' step='1' min='", ParamInternCtrl.millisegons[0], "' max='", ParamInternCtrl.millisegons[ParamInternCtrl.millisegons.length-1], "' value='", ParamInternCtrl.millisegons[ParamInternCtrl.iMillisegonsActual], "' onchange='PortamADataEvent(event, this.value);' onclick='dontPropagateEvent(event);' list='timeticks'>",
					"<input type='button' value='>' onClick='PortamADataEvent(event, ", ParamInternCtrl.millisegons[(ParamInternCtrl.iMillisegonsActual==ParamInternCtrl.millisegons.length-1 ? ParamInternCtrl.millisegons.length-1 : ParamInternCtrl.iMillisegonsActual+1)], ");'", (ParamInternCtrl.iMillisegonsActual==ParamInternCtrl.millisegons.length-1 ? " disabled='disabled'" : ""), ">");
			if (ParamInternCtrl.millisegons.length<300/2)
			{
				barra_slider.push("<datalist id='timeticks'>");
				for (var i=0; i<ParamInternCtrl.millisegons.length; i++)
					barra_slider.push("<option value='", ParamInternCtrl.millisegons[i], "'></option>");
				barra_slider.push("</datalist>");
			}
			barra_slider.push("</span>");
		    }

		    barra_slider.push("<span id='llegenda_situacio_coord' style='position: absolute; top: 4; right: 4;' class='", MobileAndTabletWebBrowser ? "finestra_superposada_opaca" : "finestra_superposada", "'>", 
				DonaCadenaBotonsVistaLlegendaSituacioCoord(),
				"</span>");
		    //if (barra_slider.length) Finalment la creo sempre per poder canviar el seu interior si cal.
		    cdns.push(textHTMLLayer(nom_vista+SufixSliderZoom, DonaMargeEsquerraVista(vista.i_nova_vista)+4, DonaMargeSuperiorVista(vista.i_nova_vista)+4, vista.ncol-3, vista.nfil-3, null, {scroll: "no", visible: true, ev: (ParamCtrl.ZoomUnSolClic ? "onmousedown=\"IniciClickSobreVista(event, "+vista.i_nova_vista+");\" " : "") + "onmousemove=\"MovimentSobreVista(event, "+vista.i_nova_vista+");\" onClick=\"ClickSobreVista(event, "+vista.i_nova_vista+");\" onTouchStart=\"return IniciDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchMove=\"return MovimentDitsSobreVista(event, "+vista.i_nova_vista+");\" onTouchEnd=\"return FiDitsSobreVista(event, "+vista.i_nova_vista+");\"", save_content: false, bg_trans: true}, null, barra_slider.join("")));
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
				if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=NovaVistaPrincipal ? vista.i_vista : DonaIVista(nom_vista), i))
					setTimeout("OmpleVistaCapaDigi(\""+nom_vista+"\", "+JSON.stringify(vista)+", "+i+")", 25*i);
			}
			else
			{
				if (EsCapaVisibleAAquestNivellDeZoom(capa) && EsCapaVisibleEnAquestaVista(vista.i_nova_vista!=NovaVistaPrincipal ? vista.i_vista : DonaIVista(nom_vista), i))
					setTimeout("OmpleVistaCapa(\""+nom_vista+"\", "+JSON.stringify(vista)+", "+i+")", 25*i);
				else if (capa.estil) //si la capa ara és no visible, i té estils, he de mirar si hi ha gràfics vinculats a ella per a "congelar-los"
				{
					for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
						DesactivaCheckITextChartsMatriusDinamics(i, i_estil, true);
				}
			}
			if (capa.visible=="semitransparent" && ParamCtrl.TransparenciaDesDeServidor!=true)
				setTimeout("semitransparentThisNomLayer(\""+nom_vista+"_l_capa"+i+"\")", 25*i);
		}
	}
	if (vista.i_nova_vista==NovaVistaPrincipal || vista.i_nova_vista==NovaVistaImprimir)
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
	if (ParamCtrl.ZoomContinu)
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
			CanviaNivellDeZoom(j, true);
		else
		{
			RevisaEstatsCapes();
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
	 return {"MinX": minx, "MaxX": maxx, "MinY": miny, "MaxY": maxy};
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
		ParamInternCtrl.vista.ncol=w-(((ParamCtrl.MargeEsqVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeEsqVista:0)+MidaFletxaInclinada*2+MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AmpleTextCoordenada : 0));
		if (w>200)
		    ParamInternCtrl.vista.ncol+=10;
		if (ParamInternCtrl.vista.ncol<MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AmpleTextCoordenada*2 : 5))
			ParamInternCtrl.vista.ncol=MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AmpleTextCoordenada*2 : 5);
	}
	if (h>0)
	{
		ParamInternCtrl.vista.nfil=h-(((ParamCtrl.MargeSupVista && !ParamCtrl.fullScreen)?ParamCtrl.MargeSupVista:0)+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AltTextCoordenada:0)+MidaFletxaInclinada*2+MidaFletxaPlana+AltTextCoordenada+5);
		if (h>200)
		    ParamInternCtrl.vista.nfil+=18;
		if (ParamInternCtrl.vista.nfil<MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AltTextCoordenada*2 : 5))
			ParamInternCtrl.vista.nfil=MidaFletxaPlana+((cal_coord && i_nova_vista==NovaVistaPrincipal) ? AltTextCoordenada*2 : 5);
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

/*'env' pot ser null
Retorna: 2 si no troba el 'crs'
	1 si no necessita canviar ni el crs ni la imatge de situació.
Compte que si ParamCtrl.araCanviProjAuto==true RepintaMapesIVistes pot canviar les coses altre cop.
*/
function EstableixNouCRSEnv(crs, env)
{
var i_min=ParamCtrl.ImatgeSituacio.length, i_max;

	if (env)
	{
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
	}

	if (i_min==ParamCtrl.ImatgeSituacio.length)
	{
		//Agafo la més general en aquest cas.
		//Busco el primer per començar
		for (var i=0; i<ParamCtrl.ImatgeSituacio.length; i++)
		{
			if (crs==ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS)
			{
				i_max=i;
				break;
			}
		}
		if (i==ParamCtrl.ImatgeSituacio.length)
			return 2;  //No és possible canviar al CRS que m'han demanat perquè no hi ha mapa de situació en aquest CRS.
		//Ara miro si n'hi ha un de més general.
		for (var i=i_max+1; i<ParamCtrl.ImatgeSituacio.length; i++)
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

	if (ParamInternCtrl.ISituacio!=i_min)  //En cas contrari ja estem en el CRS que toca i no hi ha canvis.
	{
		if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS!=ParamCtrl.ImatgeSituacio[i_min].EnvTotal.CRS)
			CanviaCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, ParamCtrl.ImatgeSituacio[i_min].EnvTotal.CRS);
		ParamInternCtrl.ISituacio=i_min;
		if(ParamCtrl.FuncioCanviProjeccio)
			eval(ParamCtrl.FuncioCanviProjeccio);
		return 0;
	}
	return 1;
}

function RepintaMapesIVistes()
{
	ActualitzaEnvParametresDeControl();
	if (ParamCtrl.araCanviProjAuto)
	{
		if (EstableixNouCRSSiCal())
			ActualitzaEnvParametresDeControl();
	}
	CreaSituacio();
	CreaVistes();
	CreaProjeccio();
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
		if (ParamCtrl.LlegendaAmagaSiForaAmbit || ParamCtrl.LlegendaGrisSiForaAmbit)
			;
		else
		CreaLlegenda();
		RepintaMapesIVistes();
	}
}

function DonaCapaDesDeIdCapa(id)
{
var capa;
	for (var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (id==capa.id)
			return capa;
	}
	return null;
}

function DonaEstilDesDeNomEstil(capa, nom)
{
var estil;
	for (var i=0; i<capa.estil.length; i++)
	{
		estil=capa.estil[i];
		if (nom==estil.nom)
			return estil;
	}
	return null;
}

function DonaEstilDesDeIdEstil(capa, id)
{
var estil;
	for (var i=0; i<capa.estil.length; i++)
	{
		estil=capa.estil[i];
		if (id==estil.id)
			return estil;
	}
	return null;
}


function DuplicaEstilCapa(capa, i_estil_patro, nom_nou)
{
var i_estil_nou=capa.estil.length, estil;

	if(capa.estil.length==1 && !capa.estil[0].nom && !capa.estil[0].desc)
	{
		// Si la capa només té un estil, potser que no tingui ni nom ni descripció perquè és l'estil per defecte
		// com que ara n'afegeix-ho un de nou li he de possar com a mínim la descripció
		capa.estil[0].desc=GetMessageJSON("byDefault","cntxmenu");
	}
	capa.estil[i_estil_nou]=JSON.parse(JSON.stringify(capa.estil[(i_estil_patro) ? i_estil_patro : 0]));
	estil=capa.estil[i_estil_nou];
	if (estil.diagrama)
		delete estil.diagrama;
	estil.id=nom_nou;
	estil.desc=nom_nou;
	estil.origen=OriginUsuari;  //Això ho va crear AZ ni no crec que hagi de ser 'usuari' sempre. De moment ho deixo.
	CarregaSimbolsEstilCapaDigi(capa, i_estil_nou, true);

	return i_estil_nou;
}

function FesVisiblesNomesAquestesCapesAmbEstils(layers, styles, param_name_layers)
{
var capa_visible=layers.split(","), capa_estil=styles ? styles.split(",") : null;
var capa, j, i, i_estil;

	if (capa_estil && capa_visible.length!=capa_estil.length)
	{
		alert(DonaCadenaLang({"cat":"El nombre d\'estils no es correspon amb el nombre de capes.",
					 "spa":"El número de estilos no se corresponde con el número de capas.",
					 "eng":"Style number is no the same of the number of layers.",
					 "fre":"Le nombre de styles ne correspond pas au nombre de couches."}));
		capa_estil=null;
	}

	//Declaro totes les capes com a ara no visibles.
	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.visible=="si" || capa.visible=="semitransparent")
			CanviaEstatVisibleISiCalDescarregableCapa(i, "ara_no");
		if (capa.descarregable=="si")
			capa.descarregable="ara_no";
	}
	//Declaro visibles les que m'han dit.
	for (j=0; j<capa_visible.length; j++)
	{
		for (i=0; i<ParamCtrl.capa.length; i++)
		{
			capa=ParamCtrl.capa[i];
			if (capa_visible[j]==capa.id)
			{
				if (capa.visible=="ara_no")
					CanviaEstatVisibleISiCalDescarregableCapa(i, "si");
				else
				{
					alert(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"Layer", "fre":"La couche"}) + " " + capa_visible[j] + " " +
						DonaCadenaLang({"cat":"indicada a", "spa":"indicada en", "eng":"indicated at", "fre":"indiquée à"}) + " " + param_name_layers +  " " +
						DonaCadenaLang({"cat":"no pot ser activada", "spa":"no puede ser activada", "eng":"cannot be activaded", "fre":"ne peut pas être activée"}) + ".");
					continue;
				}
				if (capa_estil && capa_estil[j])
				{
					if (capa.estil && capa.estil.length>1)
					{
					    //Si a la part del final posa ":SEMITRANSPARENT"
					    if (capa_estil[j].toUpperCase()=="SEMITRANSPARENT")
					    {
						    if (capa.visible!="no")
							    CanviaEstatVisibleISiCalDescarregableCapa(i, "semitransparent");
					    }
					    else
					    {
						    if (capa_estil[j].length>16 && capa_estil[j].substring(capa_estil[j].length-16, capa_estil[j].length).toUpperCase()==":SEMITRANSPARENT")
						    {
							    if (capa.visible!="no")
								    CanviaEstatVisibleISiCalDescarregableCapa(i, "semitransparent");
							    capa_estil[j]=capa_estil[j].substring(0, capa_estil[j].length-16);
						    }
						    for (i_estil=0; i_estil<capa.estil.length; i_estil++)
						    {
							    if (capa.estil[i_estil].id==capa_estil[j])
							    {
								    capa.i_estil=i_estil;
								    break;
							    }
						    }
						    if (i_estil==capa.estil.length)
						    {
							    if (capa_estil[j]!=null && capa_estil[j]!="")  //si es blanc vol dir l'estil per defecte
								    alert(DonaCadenaLang({"cat":"No trobo l'estil", "spa":"No encuentro el estilo", "eng":"Cannot find style", "fre":"Impossible trouver le style"})+ " " + capa_estil[j] + " " +DonaCadenaLang({"cat":"per a la capa", "spa":"para la capa", "eng":"for the layer", "fre":"pour cette couche"}) + " " + capa_visible[j]);
						    }
					    }
					}
					else
					{
						//Si és un servidor de MiraMon només pot dir semitransparent.
						if (capa_estil[j].toUpperCase()=="SEMITRANSPARENT")
						{
							if (capa.visible!="no")
								CanviaEstatVisibleISiCalDescarregableCapa(i, "semitransparent");

						}
						else
						{
							if (capa_estil[j]!=null && capa_estil[j]!="" && capa.estil[0].if!=capa_estil[j])
								alert(DonaCadenaLang({"cat":"No trobo l'estil", "spa":"No encuentro el estilo", "eng":"Cannot find style", "fre":"Impossible trouver le style"}) + " " + capa_estil[j] + " " +
								    DonaCadenaLang({"cat":"per a la capa", "spa":"para la capa", "eng":"for the layer", "fre":"pour cette couche"}) + " " + capa_visible[j]);
					    	}
					}
				}

				if (capa.descarregable=="ara_no")
					capa.descarregable="si";
				break;
			}
		}
		if (i==ParamCtrl.capa.length)
			alert(DonaCadenaLang({"cat":"No trobo la capa", "spa":"No encuentro la capa", "eng":"Cannot find layer","fre":"Impossible trouver la couche"}) + " " + capa_visible[j] + " " +
					DonaCadenaLang({"cat":"indicada a", "spa":"indicada en", "eng":"indicated at", "fre":"indiquée à"}) + " " +  param_name_layers);
	}
}


function ComprovaOpcionsAccio()
{
	if(Accio.accio==null)
	{
		/*alert(DonaCadenaLang({"cat":"No s'ha trobat el paràmetre 'REQUEST'",
							  "spa":"No se ha encontrado el parámetro 'REQUEST'",
							  "eng":"Cannot find the 'REQUEST' parameter",
							  "fre":"Le paramètre 'REQUEST' n'a pas été trouvé"}));*/
		return false;
	}
	if(Accio.accio&AccioValidacio)
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
				Accio.accio|=AccioConLoc;
		}
		if(Accio.valors)
		{
			//Intento buscar un punt on anar mitjançant els valors dels camps
			// i si el trobo marco
			if(DadesPendentsAccio==false && BuscaValorAConsultesTipiques())
				Accio.accio|=AccioConLoc;
		}
		else
		{
			DadesPendentsAccio=true;
			Accio.valors=new Array(Accio.capes.length);
		}
	}
	else if(Accio.accio&AccioAnarCoord || Accio.accio&AccioConLoc)
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
	if(Accio.coord)
	{
		PortamAPunt(Accio.coord.x, Accio.coord.y);
		ParamCtrl.EstatClickSobreVista="ClickConLoc";
		var event= new Object();

		event.clientX=DonaCoordSobreVistaDeCoordX(getLayer(window, ParamCtrl.VistaPermanent[0].nom), Accio.coord.x);
		//+ DonaOrigenEsquerraVista()-((window.document.body.scrollLeft) ? window.document.body.scrollLeft : 0);
		event.clientY=DonaCoordSobreVistaDeCoordY(getLayer(window, ParamCtrl.VistaPermanent[0].nom), Accio.coord.y);
		//+ DonaOrigenSuperiorVista() -((window.document.body.scrollTop) ? window.document.body.scrollTop : 0);
		return event;
	}
	return null;
}//Fi de SimulaEventOnClickPerConloc()

var DadesPendentsAccio=false;

var ParamInternCtrl;

function DonaVistaDesDeINovaVista(i_nova_vista)
{
	if (i_nova_vista==NovaVistaImprimir)
		return VistaImprimir;
	if (i_nova_vista==NovaVistaPrincipal || i_nova_vista==NovaVistaVideo)
		return ParamInternCtrl.vista;
	return NovaVistaFinestra.vista[i_nova_vista];
}

function PreparaParamInternCtrl()
{
	ParamInternCtrl={PuntOri: ParamCtrl.PuntOri,
			 		 vista: { EnvActual: {MinX: 0.0, MaxX: 0.0, MinY: 0.0, MaxY: 0.0},
					 			nfil: ParamCtrl.nfil,
								ncol: ParamCtrl.ncol,
								CostatZoomActual: ParamCtrl.NivellZoomCostat,
								i_vista: -1,        //index en l'array ParamCtrl.VistaPermanent[]
								i_nova_vista: NovaVistaPrincipal},  //index en l'array NovaVistaFinestra.vista[] o -1 si és la vista principal, -2 si és la vista d'impressió, -3 si és el rodet del video i -4 si és el fotograma del video
					 EnvLLSituacio: [],
					 AmpleSituacio: 99,
					 AltSituacio: 99,
					 MargeEsqSituacio: 99,
					 MargeSupSituacio: 99,
					 ISituacio: ParamCtrl.ISituacioOri,
					 LListaCRS: null,
					 ZoomPrevi: [{costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0}, {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0},
								   {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0}, {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0},
								   {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0}, {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0},
								   {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0}, {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0},
								   {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0}, {costat: 1, PuntOri: {x: 0, y: 0}, ISituacio: 0}],
					 NZoomPreviUsat: 0, //10 zooms previs, 0 usats
					 millisegons: CarregaDatesCapes(),
					 FlagsData: DeterminaFlagsDataCapes(),
					 flags: 0};

	if (ParamInternCtrl.millisegons.length)
		ParamInternCtrl.iMillisegonsActual=ParamInternCtrl.millisegons.binarySearch(DeterminaMillisegonsActualCapes());

	for (var i=0; i<ParamCtrl.ImatgeSituacio.length; i++)
	{
		//Càlcul de la envolupant el·lipsoidal
		ParamInternCtrl.EnvLLSituacio[i]=DonaEnvolupantLongLat(ParamCtrl.ImatgeSituacio[i].EnvTotal.EnvCRS, ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS);
	}

	if (ParamCtrl.CanviProjAuto && typeof ParamCtrl.araCanviProjAuto === "undefined")
		ParamCtrl.araCanviProjAuto=true;

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

function ComprovaVersioConfigMMN(param_ctrl)
{
	if (param_ctrl.VersioConfigMMN.Vers!=VersioToolsMMN.Vers ||
	    param_ctrl.VersioConfigMMN.SubVers>VersioToolsMMN.SubVers)
	{
	    alert(DonaCadenaLang({"cat": "La versió de", "spa": "La versión de", "eng": "The version of", "fre": "La version"}) +
			" config.json (" + param_ctrl.VersioConfigMMN.Vers+"."+param_ctrl.VersioConfigMMN.SubVers + ") " +
			DonaCadenaLang({"cat": "no es correspon amb la versió de", "spa": "no se corresponde con la versión de", "eng": "it is not according with the version of", "fre": "ne correspond pas à la version de"}) +
			" tools.htm (" + VersioToolsMMN.Vers+"."+VersioToolsMMN.SubVers + "). "+
			DonaCadenaLang({"cat": "Actualitza't correctament.", "spa": "Actualicese correctamente.", "eng": "Please, upgrade it correctly.", "fre": "S'il vous plaît, actualisez vous correctement."}));
			return 1;
	}
	return 0;
}

var ParamCtrl;

function IniciaParamCtrlIVisualitzacio(param_ctrl, param)
{
	ParamCtrl=param_ctrl; //Ho necessito aquí perquè funcioni la configuració idiomàtica en cas d'haver de preguntar.

	if (typeof Storage !== "undefined" && param.usa_local_storage)
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
				localStorage.removeItem("EditedParamCtrl_"+param.config_json);  //Avoids that if we exit without saving, the old edited version remains saved and considered valid.
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

	if (ComprovaVersioConfigMMN(ParamCtrl))
		return;

	ParamCtrl.containerName=param.div_name;
	ParamCtrl.config_json=param.config_json;

	ResolveJSONPointerRefs(ParamCtrl);

	if (window.InitHello)
		InitHello();

	IniciaVisualitzacio();
}

//Crea un identificador des de del nom o l'i d'ordre
function CreaIdSiCal(obj, i)
{
	if (!obj.id)
	{
		if (obj.nom)
			obj.id=obj.nom;
		else
			obj.id=i.toString();
	}
}

function ComprovaConsistenciaParamCtrl(param_ctrl)
{
	var i, j, k;

	if (!param_ctrl.VistaPermanent)
		param_ctrl.VistaPermanent=[{"nom": "vista"}]; //Això és el sistema antic, on només hi podia haver una vista. Si no m'ho especifiquen assumeixo això.

	if (param_ctrl.CapaDigi)
	{
		alert(DonaCadenaLang({"cat": "CapaDigi ja no se suporta. Useu una \"capa\" amb \"model\": \"vector\".",
				"spa": "CapaDigi ya no se soporta. Use una \"capa\" con \"model\": \"vector\".",
				"eng": "CapaDigi no longer supported. Use a \"capa\" with \"model\": \"vector\" instead.",
				"fre": "CapaDigi n'est plus pris en charge. Utilisez un \"capa\" avec le \"model\": \"vector\"."}));
		return 1;
	}
	
	// arreglem els config.json que deien mostrar: true false errònimament
	var avis_mostrar_atributs=false;
	var capa, estil;

	var protocol=location.protocol.toLowerCase();
	var host=location.host.toLowerCase();
	if(protocol=="https:")
	{
		// 22-11-2019 (NJ i JM) : Decidim canviar el protocol dels servidors que tenen el mateix host que el navegador
		// perquè per seguretat els navegadors bloquegen o donen error quan fas una petició http des d'una url(navegador) en htpps
		if(ParamCtrl.ServidorLocal &&
		   host==DonaHost(ParamCtrl.ServidorLocal).toLowerCase() &&
		   protocol!=DonaProtocol(ParamCtrl.ServidorLocal).toLowerCase())
		{
			ParamCtrl.ServidorLocal=protocol+ParamCtrl.ServidorLocal.substring(ParamCtrl.ServidorLocal.indexOf("://")+1, ParamCtrl.ServidorLocal.length);
		}
	}

	for (i=0; i<param_ctrl.capa.length; i++)
	{
		capa=param_ctrl.capa[i];
		CreaIdSiCal(capa, i);

		if (protocol=="https:" && capa.servidor && host==DonaHost(capa.servidor).toLowerCase() &&
			   protocol!=DonaProtocol(capa.servidor).toLowerCase())
		{
			capa.servidor=protocol+capa.servidor.substring(capa.servidor.indexOf("://")+1, capa.servidor.length);
		}

		if (capa.visible=="semitransparent" && capa.transparencia!="semitransparent")
		{
			alert(GetMessage("TheProperty") + " capa.visible " + GetMessage("indica") + " \"semitransparent\" " + GetMessage("butTransparenciaDoesNotAllowIt", "miramon") + ". " + GetMessage("YouMayContinue") + "." +
					" " + GetMessage("Layer") + " = " + DonaCadenaNomDesc(capa));
			capa.transparencia="semitransparent";
		}

		if (capa.atributs && capa.atributs.length)
		{
			for (j=0; j<capa.atributs.length; j++)
			{
				if (capa.atributs[j].mostrar)
				{
					if (capa.atributs[j].mostrar != "si" && capa.atributs[j].mostrar != "si_ple" && capa.atributs[j].mostrar != "no")
					{
						if (capa.atributs[j].mostrar == true || capa.atributs[j].mostrar == false)
						{	
							if (!avis_mostrar_atributs)
							{
								alert(GetMessage("TheProperty") + " atributs.mostrar " + GetMessage("mustBe") + " \"si\", \"si_ple\", \"no\" " + GetMessage("andIsInsteadSetTo", "miramon") + " \"true/false\". " + GetMessage("YouMayContinue") + "." +
										" " + GetMessage("Layer") + " = " + DonaCadenaNomDesc(capa));
								avis_mostrar_atributs=true;
							}
							if (capa.atributs[j].mostrar)
								capa.atributs[j].mostrar = "si";
							else						
								capa.atributs[j].mostrar = "no";						
						}
						else 
						{
							if (!avis_mostrar_atributs)
							{
								alert(DonaCadenaLang({"cat": "La propietat atributs.mostrar ha de ser \"si\", \"si_ple\", \"no\" i en canvi està definida d'una altra manera. El valor serà ignorat i l'atribut marcat com a mostrable. Es deixa continuar.",
										"spa": "La propiedad atributs.mostrar debe ser \"si\", \"si_ple\", \"no\" y en cambio está definido de otra manera. El valor será ignorado y el atributo marcado como mostrable. Se deja continuar.",
										"eng": "The property atributs.mostrar must be \"si\", \"si_ple\", \"no\" and is otherwise defined. The value will be ignored and the attribute marked as showable. You may continue.",
										"fre": "La propriété atributs.mostrar doit être \"si\", \"si_ple\", \"no\" et est définie autrement. La valeur sera ignorée et l'attribut marqué comme affichable. Il est permis de continuer."})
										+ " capa = " + DonaCadenaNomDesc(capa));
								avis_mostrar_atributs=true;
							}
							capa.atributs[j].mostrar = "si";
						}
					}
				}
			}
		}

		if ((capa.FormatImatge=="image/tiff" ||  capa.FormatImatge=="application/x-img"))
		{
			if (!capa.valors || capa.valors.length==0)
			{
				alert(GetMessage("LayerTIFFIMGMustHaveValues", "miramon") + ". "+ GetMessage("LayerSetToNoVisibleQueriable", "miramon")+ "." + " capa = " + DonaCadenaNomDesc(capa));
				capa.visible="no";
				capa.consultable="no";
			}

			if (protocol=="https:" && DonaServidorCapa(capa) && protocol!=DonaProtocol(DonaServidorCapa(capa)).toLowerCase()/* && DonaCorsServidorCapa(capa)==true*/)
			{
				alert(GetMessage("LayerBinaryArrayMustBeHTTPS", "miramon") + ". "+ GetMessage("LayerSetToNoVisibleQueriable", "miramon")+ "." + " capa = " + DonaCadenaNomDesc(capa));
				capa.visible="no";
				capa.consultable="no";
			}
		}
			
		if (capa.estil && capa.estil.length)
		{ 	
			var estil;
			for (j=0; j<capa.estil.length; j++)
			{
				estil=capa.estil[j];
				CreaIdSiCal(estil, j);
				if (estil.atributs && estil.atributs.length)
				{
					for (k=0; k<estil.atributs.length; k++)
					{
						if (estil.atributs[k].mostrar)
						{
							if (estil.atributs[k].mostrar != "si" && estil.atributs[k].mostrar != "si_ple" && estil.atributs[k].mostrar != "no")
							{
								if (estil.atributs[k].mostrar == true || estil.atributs[k].mostrar == false)
								{	
									if (!avis_mostrar_atributs)
									{
										alert(DonaCadenaLang({"cat": "La propietat atributs.mostrar ha de ser \"si\", \"si_ple\", \"no\" i en canvi està definit com a \"true/false\". Es deixa continuar.",
												"spa": "La propiedad atributs.mostrar debe ser \"si\", \"si_ple\", \"no\" y en cambio está definido como \"true/false\". Se deja continuar.",
												"eng": "The property atributs.mostrar must be \"si\", \"si_ple\", \"no\" and is instead set to \"true/false\". You may continue.",
												"fre": "La propriété atributs.mostrar doit être \"si\", \"si_ple\", \"no\" et est à la place définie sur \"true/false\". Il est permis de continuer."}) 
												+ " estil = " + DonaCadenaNomDesc(estil));
												avis_mostrar_atributs=true;
									}
									if (estil.atributs[k].mostrar)
										estil.atributs[k].mostrar = "si";
									else
										estil.atributs[k].mostrar = "no";						
								}
								else 
								{
									if (!avis_mostrar_atributs)
									{
										alert(DonaCadenaLang({"cat": "La propietat atributs.mostrar ha de ser \"si\", \"si_ple\", \"no\" i en canvi està definida d'una altra manera. El valor serà ignorat i l'atribut marcat com a mostrable. Es deixa continuar.",
												"spa": "La propiedad atributs.mostrar debe ser \"si\", \"si_ple\", \"no\" y en cambio está definido de otra manera. El valor será ignorado y el atributo marcado como mostrable. Se deja continuar.",
												"eng": "The property atributs.mostrar must be \"si\", \"si_ple\", \"no\" and is otherwise defined. The value will be ignored and the attribute marked as showable. You may continue.",
												"fre": "La propriété atributs.mostrar doit être \"si\", \"si_ple\", \"no\" et est définie autrement. La valeur sera ignorée et l'attribut marqué comme affichable. Il est permis de continuer."})
												+ " estil = " + DonaCadenaNomDesc(estil));
										avis_mostrar_atributs=true;
									}
									estil.atributs[k].mostrar = "si";
								}						
							}
						}
					}
				}			
			}					
		}
	}
	
	if (param_ctrl.zoom[param_ctrl.zoom.length-1].costat>param_ctrl.zoom[0].costat)
	{
		alert(DonaCadenaLang({"cat": "Els costats de zoom han d'estat ordenats amb el més gran primer",
				"spa": "Los lados de zoom deben estar ordenados con el más grande primero",
				"eng": "The zoom sizes must be sorted with the bigger first",
				"fre": "Les tailles de zoom doivent être triées par ordre croissant"}));
		return 1;
	}
	for (i=0; i<param_ctrl.zoom.length; i++)
		if (param_ctrl.zoom[i].costat==param_ctrl.NivellZoomCostat)
			break;
	if (i==param_ctrl.zoom.length)
	{
		alert(DonaCadenaLang({"cat": "El NivellZoomCostat no és cap del costats indicats a la llista de zooms",
				"spa": "El NivellZoomCostat no es ninguno de los 'costat' indicados en la lista de zooms",
				"eng": "The NivellZoomCostat is not one of the indicated 'costat' in the zoom array",
				"fre": "Le NivellZoomCostat n'est pas l'un des 'costat' indiqués dans la matrice de zoom"}));
		return 1;
	}
	return 0;
}

/*Aquesta funció afegeix automàticament totes les capes d'un servidor a la llegenda. 
Funció inspirada en MostraCapesCapacitatsWMS(servidorGC) i AfegeixCapesWMSAlNavegadorForm() que permet al usuari triar quines capes vol afegir.*/
function AfegeixCapesWMSAlNavegador(servidorGC)
{
var i_get_featureinfo;

	i_get_featureinfo=DonaFormatFeatureInfoCapesWMS(servidorGC);

	for(var i_layer=0; i_layer<servidorGC.layer.length; i_layer++)
		AfegeixCapaWMSAlNavegador(DonaFormatGetMapCapesWMS(servidorGC, i_layer), servidorGC, servidorGC.i_capa_on_afegir, i_layer, i_get_featureinfo);
	RevisaEstatsCapes();
	CreaLlegenda();
}

function CarregaCapesDeServei(capesDeServei)
{
	FesPeticioCapacitatsIParsejaResposta(capesDeServei.servei.servidor, capesDeServei.servei.tipus, capesDeServei.servei.versio, capesDeServei.servei.access, NumeroDeCapesVolatils(-1), AfegeixCapesWMSAlNavegador);
}

function CarregaArrayCapesDeServei()
{
	if (!ParamCtrl.capesDeServei)
		return;
	for (var i_srv=0; i_srv<ParamCtrl.capesDeServei.length; i_srv++)
		CarregaCapesDeServei(ParamCtrl.capesDeServei[i_srv]);
}

function IniciaVisualitzacio()
{
var nou_env={"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300};
var nou_CRS="";
var win, i, j, l, capa;

	document.getElementById(ParamCtrl.containerName).style.overflow="hidden";
	document.getElementById(ParamCtrl.containerName).style.width="100%";
	document.getElementById(ParamCtrl.containerName).innerHTML="";
	if (ParamCtrl.AdrecaBaseSRC)
		ParamCtrl.AdrecaBaseSRC=DonaAdrecaSenseBarraFinal(ParamCtrl.AdrecaBaseSRC);  // Es verifica aquí i així ja no cal versificar-ho cada cop. (JM)

	for (i=0; i<ParamCtrl.Layer.length; i++)
	{
		l=ParamCtrl.Layer[i];
		if (l.resizable)
			createFinestraLayer(window, l.name, l.title, boto_tancar, l.left, l.top, l.width, l.height, l.ancora, {scroll: (l.scroll) ? l.scroll : "no", visible: (l.visible) ? l.visible : false, ev: (l.ev ? l.ev : null), resizable:true, onresize: (l.name=="situacio" ? CreaSituacio : null)}, (l.content) ? l.content : null);
		else
			createLayer(window, l.name, l.left, l.top, l.width, l.height, l.ancora, {scroll: (l.scroll) ? l.scroll : "no", visible: (l.visible) ? l.visible : false, ev: (l.ev) ? l.ev : null}, (l.content) ? l.content : null);
	}


	createFinestraLayer(window, "executarProces", GetMessage("ExecuteProcessWPS", "miramon"), boto_tancar, 400, 250, 550, 550, "nWSeCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "afegirCapa", GetMessage("AddLayerToMap", "miramon"), boto_tancar, 420, 150, 520, 600, "nWSeC", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "calculadoraCapa", GetMessage("LayerCalculator", "cntxmenu"), boto_tancar, 420, 150, 450, 500, "NWCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "combinacioCapa", GetMessage("AnalyticalCombinationLayers", "cntxmenu"), boto_tancar, 420, 150, 520, 400, "NWCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "seleccioCondicional", GetMessage("SelectionByCondition", "miramon"), boto_tancar, 320, 100, 490, 555, "NWCR", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "combinacioRGB", GetMessage("RGBCombination", "cntxmenu"), boto_tancar, 220, 90, 430, 275, "NwCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "seleccioEstadistic", GetMessage("SelectionStatisticValue", "cntxmenu"), boto_tancar, 220, 90, 430, 265, "NwCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "editaEstil", GetMessage("EditStyle", "cntxmenu"), boto_tancar, 240, 110, 430, 275, "NwCR", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "anarCoord", GetMessage("GoToCoordinate", "barra"), boto_tancar, 297, 298, 250, 160, "NwCR", {scroll: "no", visible: false, ev: null}, null);
	createFinestraLayer(window, "multi_consulta", GetMessage("Query"), boto_tancar, 1, 243, 243, 661, "nWSe", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "param", GetMessage("Parameters"), boto_tancar, 277, 200, 480, 530, "NwCR", {scroll: "no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "download", GetMessage("DownloadLayer", "download"), boto_tancar, 190, 120, 400, 360, "NwCR", {scroll: "no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "video", GetMessage("TimeSeriesAnalysisAndAnimations", "miramon"), boto_tancar, 20, 1, 900, 610, "NWCR", {scroll: "no", visible: false, ev: null}, null);
	createFinestraLayer(window, "consola", GetMessage("RequestConsole", "miramon"), boto_tancar, 277, 220, 500, 300, "Nw", {scroll: "ara_no", visible: false, ev:null, resizable:true}, null);
	createFinestraLayer(window, "reclassificaCapa", GetMessage("ReclassifierLayerValues", "miramon"), boto_tancar, 250, 200, 650, 400, "Nw", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "calculaQualitat", GetMessage("ComputeQuality", "cntxmenu"), boto_tancar, 250, 200, 700, 400, "Nw", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "mostraLlinatge", GetMessage("Lineage"), boto_tancar, 250, 1, 800, 420, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "mostraQualitat", GetMessage("Quality"), boto_tancar, 250, 200, 700, 400, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "feedback", GetMessage("Feedback"), boto_tancar, 220, 180, 625, 400, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "feedbackAmbEstils", GetMessage("FeedbackContainingStyles", "miramon"), boto_tancar, 220, 180, 625, 400, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "enllac", GetMessage("OpenOrSaveContext", "miramon"), boto_tancar, 650, 165, 450, 200, "NwCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "enllacWMS", GetMessage("LinksToOGCServicesBrowser", "miramon"), boto_tancar, 650, 165, 400, 120, "NwCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "triaStoryMap", GetMessage("Storymaps", "storymap"), boto_tancar, 420, 150, 420, 350, "nWC", {scroll: "ara_no", visible: false, ev: false, resizable:true}, null);
	createFinestraLayer(window, "storyMap", GetMessage("StoryMapTitle", "miramon"), boto_tancar, 220, 180, 500, 400, "Nw", {scroll: "ara_no", visible: false, ev: "onScroll='ExecutaAttributsStoryMapVisibleEvent(event);'", resizable:true}, null);
	createFinestraLayer(window, "info", GetMessage("InformationHelp", "miramon"), boto_tancar, 420, 150, 420, 350, "nWC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "modificaNom", GetMessage("ModifyName"), boto_tancar, 250, 200, 600, 200, "Nw", {scroll: "ara_no", visible: false, ev: null}, null);
	createLayer(window, "menuContextualCapa", 277, 168, 145, 240, "wC", {scroll: "no", visible: false, ev: null}, null);  //L'alt real es controla des de la funció OmpleLayerContextMenuCapa i l'ample real des de l'estil MenuContextualCapa
	createFinestraLayer(window, "editarVector", GetMessage("InsertNewPoint", "miramon"), boto_tancar, 420, 150, 500, 320, "nWSeC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	//La següent finesta es fa servir pels missatges de les transaccions però, s'hauria de resoldre bé i fer servir de manera general per qualsevol missatge d'error emergent
	createFinestraLayer(window, "misTransaccio", GetMessage("ResultOfTheTransaction", "miramon"), boto_tancar, 420, 150, 300, 300, "nWSeC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);

	if (ComprovaConsistenciaParamCtrl(ParamCtrl))
		return;

	PreparaParamInternCtrl();
	CreaCapesVolatils();

	CompletaDefinicioCapes();

	CarregaArrayCapesDeServei();

	changeSizeLayers(window);
	CarregaConsultesTipiques();

	window.document.body.onmousemove=MovementMiraMonMapBrowser;
	window.document.body.onbeforeunload=EndMiraMonMapBrowser;
	window.document.body.onresize=ResizeMiraMonMapBrowser;
	window.document.body.onmessage=ProcessMessageMiraMonMapBrowser;
	window.document.addEventListener('wheel', WheelMiraMonMapBrowser, {passive: false});  //https://stackoverflow.com/questions/56465207/how-can-i-prevent-full-page-zoom-on-mousewheel-event-in-javascript

	if (window.opener)
		window.opener.postMessage(JSON.stringify({msg: "MiraMon Map Browser is listening"}), "*");

	if (location.search && location.search.substring(0,1)=="?")
	{
		var acoord, capa_visible, tinc_estils, capa_estil, query={};
		var kvp=location.search.substring(1, location.search.length).split("&");
		for(var i_clau=0; i_clau<kvp.length; i_clau++)
		{
			j = kvp[i_clau].indexOf("=");  // Gets the first index where a space occours
			if (j==-1)
			{
				alert("Format error in query URL '"+location.search+"', Key and value pair (KVP) '"+kvp[i_clau]+"' without '='.").
				break;
			}
			query[unescape(kvp[i_clau].substring(0, j)).toUpperCase()]=unescape(kvp[i_clau].substring(j+1));
		}

		if (query["BBOX"])
		{
			var coord=query["BBOX"].split(",");
			if (coord.length!=4)
			{
				alert(DonaCadenaLang({"cat":"No trobo les 4 coordenades a BBOX=", "spa":"No encuentro las 4 coordenadas en BBOX=", "eng":"Cannot find 4 coordinates at BBOX=", "fre":"Impossible de trouver les 4 coordonnées à BBOX="}));
			}
			else
			{
				//Cal carregar les 4 coordenades i fer el canvi d'àmbit
				nou_env.MinX=parseFloat(coord[0]);
				nou_env.MaxX=parseFloat(coord[2]);
				nou_env.MinY=parseFloat(coord[1]);
				nou_env.MaxY=parseFloat(coord[3]);
			}
		}
		if (query["LAYERS"])
		{
			FesVisiblesNomesAquestesCapesAmbEstils(query["LAYERS"], query["STYLES"], "LAYERS=");
		}
		else if (query["QUERY_LAYERS"])
		{
			//Declaro totes les capes com a ara no consultables.
			for (i=0; i<ParamCtrl.capa.length; i++)
			{
				if (ParamCtrl.capa[i].consultable=="si")
					ParamCtrl.capa[i].consultable="ara_no";
			}
			//Declaro consultables les que m'han dit.
			capa_visible=query["QUERY_LAYERS"].split(",");
			for (j=0; j<capa_visible.length; j++)
			{
				for (i=0; i<ParamCtrl.capa.length; i++)
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
		}
		if (query["LANGUAGE"])
		{
			ParamCtrl.idioma=query["LANGUAGE"].toLowerCase();
		}
		if (query["CRS"])
			nou_CRS=query["CRS"];
		if(query["REQUEST"])
		{
			if(query["REQUEST"].toLowerCase()=="validaatributscoord")
			{
				Accio.accio=AccioValidacio;
			}
			else if(query["REQUEST"].toLowerCase()=="anarcoord")
			{
				Accio.accio=AccioAnarCoord;
			}
			else if(query["REQUEST"].toLowerCase()=="consultaperlocalitzacio")
			{
				Accio.accio=AccioConLoc;
			}
		}
		if(query["X"])  //Coordenada Y demanada per AnarACoordenada()
		{
			if(!Accio.coord)
				Accio.coord={"x": parseFloat(query["X"]), "y": 0};
			else
				Accio.coord.x=parseFloat(query["X"]);
		}
		if(query["Y"])  //Coordenada Y demanada per AnarACoordenada()
		{
			if(!Accio.coord)
				Accio.coord={"x": 0, "y": parseFloat(query["Y"])};
			else
				Accio.coord.y=parseFloat(query["Y"]);
		}
		if(query["BUFFER"])  //Buffer al voltant de la coordenada X,Y demanada per AnarACoordenada()
		{
			Accio.buffer=parseFloat(query["BUFFER"]);
		}
		if (query["STORYMAP"])
		{
			Accio.storymap=parseInt(query["STORYMAP"]);
		}
		if(query["TEST_LAYERS"])
		{
			Accio.capes=query["TEST_LAYERS"].split(",");
		}
		if(query["TEST_FIELDS"])
		{
			Accio.camps=query["TEST_FIELDS"].split(",")
		}
		if(query["TEST_VALUES"])
		{
			Accio.valors=query["TEST_VALUES"].split(",")
		}
		if(query["SERVERTORESPONSE"])
		{
			Accio.servidor=query["SERVERTORESPONSE"];
		}
		if(query["IDTRANS"])
		{
			Accio.id_trans=query["IDTRANS"];
		}
		if(query["FULLSCR"])
		{
			Accio.fullscreen=(query["FULLSCR"]) ? true: false;
		}
		//"CONFIG=" es tracta abans.
	}

	if(ParamCtrl.CapaConsultaPreguntaServidor && NCapesCTipicaCarregades < ParamCtrl.CapaConsultaPreguntaServidor.length)
		DadesPendentsAccio=true;

	if (nou_env.MinX<1e300 && nou_env.MaxX>-1e300 && nou_env.MinY<1e300 && nou_env.MaxY>-1e300)
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
	if(ComprovaOpcionsAccio())
	{
		if(Accio.accio&AccioValidacio || Accio.accio&AccioConLoc)
		{
			//Haig de tornar a fer un CreaLLegenda() perquè he tocat l'estat de les capes
			CreaLlegenda();
			if(DadesPendentsAccio==false)
			{
				if(Accio.coord)
				{
					var event= SimulaEventOnClickPerConloc();
					ClickSobreVista(event);
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
		else if(Accio.accio&AccioAnarCoord)
		{
			DadesPendentsAccio=false;
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
		if(Accio.accio&AccioValidacio)
		{
			EnviarRespostaAccioValidacio(false);
			CreaBarra(null);
		}
		if (typeof Accio.storymap !== "undefined")
		{
			if (Accio.storymap<0)
				MostraFinestraTriaStoryMap();
			else
				IniciaStoryMap(Accio.storymap);
		}
		if (Accio.fullscreen)
		{
			ParamCtrl.fullScreen=1;
			setTimeout(PortaVistaAFullScreen, 1000);
		}

		DadesPendentsAccio=false;
		FormAnarCoord={"proj": true,
					"x": ParamInternCtrl.PuntOri.x,
					"y": ParamInternCtrl.PuntOri.y,
					"m_voltant": (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS) ? FactorGrausAMetres : 1)*ParamInternCtrl.vista.CostatZoomActual*ParamInternCtrl.vista.ncol/5};
	}

	IniciaPosicioGPS();

	/* Mogut a la propia caixa
		loadJSON("serv_ows.json",
			function(llista_serv_OWS) { LlistaServOWS=llista_serv_OWS; },
			function(xhr) { alert(xhr); });*/

}//Fi de IniciaVisualitzacio()

function ResizeMiraMonMapBrowser()
{
	if ((ParamCtrl.fullScreen==2 && !isFullscreen()) || 
		(RectVistaAbansFullScreen && ParamCtrl.fullScreen==0))
	{
		ParamCtrl.fullScreen=0;
		PortaVistaANormalScreen();
	}
	else if (!ParamCtrl.fullScreen!=2 && isFullscreen())
	{
		//Si hi ha més d'una vista avisar que no te sentit fer-ho i plegar
		ParamCtrl.fullScreen=2;
		setTimeout(PortaVistaAFullScreen, 1000);  //Hi ha un event de ResizeMiraMonMapBrowser() pendent i causat per openFullscreen que s'executa en 200 mil·lisegons i jo demano això després.
	}
	setTimeout(ChangeSizeMiraMonMapBrowser,200);
}

function FinalitzaMiraMonMapBrowser()
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
	if (window.opener)
		window.opener.postMessage(JSON.stringify({msg: "MiraMon Map Browser closed"}), "*");

	layerList=[];
	ParamInternCtrl={};
}

function EndMiraMonMapBrowser(event, reset)
{
	if (typeof Storage !== "undefined")  //https://arty.name/localstorage.html
	{
		NetejaParamCtrl(ParamCtrl, true);

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

	FinalitzaMiraMonMapBrowser()

	/*return DonaCadenaLang({"cat": "Estat del mapa guardat.(Per recuperar l'estat original afegiu a la URL:",
					"spa": "Estado del mapa guardado. (Para recuperar el estado original añada a la URL:",
					"eng": "Map status saved (To recover the original status add to the URL:",
					"fre": "Statut de la carte enregistré (Pour restaurer l'état d'origine, ajoutez à l'URL:"})+" \"?reset=1\")";*/
}

function StartMiraMonMapBrowser(div_name)
{
var config_json="config.json", config_reset=false;
var clau_config="CONFIG=", clau_reset="RESET=";

	FesTestDeNavegador();

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
			{div_name:div_name, config_json:config_json, config_reset: config_reset, usa_local_storage: true});
}

function RestartMiraMonMapBrowser()
{
	//location.href=DonaCadena(ParamCtrl.PlanaPrincipal);
	EndMiraMonMapBrowser(null, true);
	StartMiraMonMapBrowser(ParamCtrl.containerName);
}

function MovementMiraMonMapBrowser(event)
{
	ExecutaMovimentRedirigitFinestraLayer(event);
}

//https://stackoverflow.com/questions/33083484/on-ctrlmousewheel-event
/*Moving the wheel to change the map zoom and position is only possible if the mouse is over the map view or the situation map*/
function WheelMiraMonMapBrowser(event)
{
var elem, rect;
	if (IStoryActive!==null)
		return;

	for (var z=0; z<layerFinestraList.length; z++)
	{
		if (layerFinestraList[z].nom!="llegenda" && layerFinestraList[z].nom!="coord" && layerFinestraList[z].nom!="situacio")
		{
			elem=getFinestraLayer(window, layerFinestraList[z].nom);
			if (isLayer(elem) && isLayerVisible(elem))
				return;
		}
	}

	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
	{
		elem=getLayer(window, ParamCtrl.VistaPermanent[i_vista].nom);
		if (isLayer(elem) && isLayerVisible(elem))
		{
			rect=getRectLayer(elem);
			if (event.clientX>rect.esq && event.clientX<rect.esq+rect.ample &&
				event.clientY>rect.sup && event.clientY<rect.sup+rect.alt)
				break;
		}
	}
	if (i_vista==ParamCtrl.VistaPermanent.length)
	{
		if (!isLayerVisible(getResizableLayer(window, "situacio")))
			return;
		rect=getRectLayerName(window, "situacio");
		if (event.clientX<rect.esq || event.clientX>rect.esq+rect.ample ||
			event.clientY<rect.sup || event.clientY>rect.sup+rect.alt)
			return;
	}
	else
	{
		if (isLayerVisible(getResizableLayer(window, "llegenda")))
		{
			rect=getRectLayerName(window, "llegenda");
			if (event.clientX>rect.esq && event.clientX<rect.esq+rect.ample &&
				event.clientY>rect.sup && event.clientY<rect.sup+rect.alt)
				return; // La llegenda està sobre una de les vistes i no vull que faci scroll a la vista
		}
	}

	if (event.shiftKey)
		MouLaVistaEventDeSalt(event, Math.sign(event.deltaY)*0.1, (event.altKey) ? -Math.sign(event.deltaY)*0.1 : (event.ctrlKey ? Math.sign(event.deltaY)*0.1 : 0));
	else if (event.ctrlKey)
		MouNivellDeZoomEvent(event, -Math.sign(event.deltaY));
	else if (event.altKey)
		MouDataEvent(event, -Math.sign(event.deltaY));
	else
		MouLaVistaEventDeSalt(event, 0, -Math.sign(event.deltaY)*0.1);
	event.preventDefault();
}

function ProcessMessageMiraMonMapBrowser(event)
{
	if (event.data.substring(0, 10)!="CommandMMN")
		return;
	eval(event.data);
	RepintaMapesIVistes();
}
