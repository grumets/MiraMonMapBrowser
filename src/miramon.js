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

var ToolsMMN="https://github.com/grumets/MiraMonMapBrowser"; //"https://github.com/joanma747/MiraMonMapBrowser";
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
IncludeScript("papaparse.min.js"); // Extret de https://www.papaparse.com/
IncludeScript("wicket.js"); // Extret de : https://github.com/arthur-e/Wicket
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
IncludeScript("vista.js");
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
		return v.Vers+"."+v.SubVers;
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

function CompletaDescarregaTotCapa(capa)
{
	if (DonaTipusServidorCapa(capa)=="TipusHTTP_GET" && !capa.DescarregaTot) 
	{
		var i_format;
		//Contrueixo la manera de descarregar automàticament.
		if (!ParamCtrl.FormatDescarregaTot)
			ParamCtrl.FormatDescarregaTot=[];
		if (capa.model==model_vector)
		{			
			// Hi ha el format que toca la l'array de formats?
			for (i_format=0; i_format<ParamCtrl.FormatDescarregaTot.length; i_format++)
			{
				if ((capa.FormatImatge=="application/json" || capa.FormatImatge=="application/geo+json" || capa.FormatImatge=="text/csv") &&
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
}
function GeneraUIDCapa(capa)
{
	// Generació de identificador de la capa i els estils
	CreaUUIDSiCal(capa);  // en el cas de la capa el faig més complexe perquè sinó em surten repetits
	if (capa.estil && capa.estil.length)
	{
		for (var j=0; j<capa.estil.length; j++)
			CreaIdSiCal(capa.estil[j], j);
	}
}

function CompletaDefinicioCapa(capa, capa_vola)
{	
	GeneraUIDCapa(capa);
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

	if (tipus=="TipusWFS" || tipus=="TipusOAPI_Features" || tipus=="TipusSOS" || (tipus=="TipusHTTP_GET" && (capa.FormatImatge=="application/geo+json" || capa.FormatImatge=="text/csv")) || (capa.objectes && capa.objectes.features))
		capa.model=model_vector;

	CompletaDescarregaTotCapa(capa);
	
	if (!capa_vola)
	{
		if (capa.model==model_vector)
		{
			if (!capa.CRSgeometry)
				capa.CRSgeometry=ParamCtrl.ImatgeSituacio[0].EnvTotal.CRS;
			InicialitzaIComprovaTileMatrixGeometryCapaDigi(capa);
			CanviaCRSITransformaCoordenadesCapaDigi(capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
		}
	}
	/* NJ: En el cas del TIFF s'usa també aquest membre com en el cas de model_vector, però en aquest cas ho inicialitzem al iniciar la lectura del TIFF perquè cal que prevalgui el que diu allà
	if (!capa.CRSgeometry)
		capa.CRSgeometry=ParamCtrl.ImatgeSituacio[0].EnvTotal.CRS;*/
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
		if(typeof cadena1.cze!=="undefined")
			a.cze=cadena1.cze;
		if(typeof cadena1.ger!=="undefined")
			a.ger=cadena1.ger;
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
			if(typeof cadena2.cze!=="undefined")
			{
				if(typeof a.cze==="undefined" || !a.cze)
					a.cze=cadena2.cze;
				else
					a.cze+=(cadena2.cze?cadena2.cze:"");
			}
			if(typeof cadena2.ger!=="undefined")
			{
				if(typeof a.ger==="undefined" || !a.ger)
					a.ger=cadena2.ger;
				else
					a.ger+=(cadena2.ger?cadena2.ger:"");
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
			if(typeof a.cze==="undefined" || !a.cze)
				a.cze=cadena2;
			else
				a.cze+=cadena2;
			if(typeof a.ger==="undefined" || !a.ger)
				a.ger=cadena2;
			else
				a.ger+=cadena2;
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
		if(typeof cadena2.cze!=="undefined")
			a.cze=cadena1 + (cadena2.cze?cadena2.cze:"");
		if(typeof cadena2.ger!=="undefined")
			a.ger=cadena1 + (cadena2.ger?cadena2.ger:"");
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
		if(typeof cadena2.cze!=="undefined")
			a.cze=cadena2.cze;
		if(typeof cadena2.ger!=="undefined")
			a.ger=cadena2.ger;
	}
	return a;
}


function DonaCadenaNomDesc(a)
{
	return a.desc ? DonaCadena(a.desc) : a.nom;
}

function DonaCadenaNomDescFormula(formula, a)
{
	// Si no hi ha desc i hi ha fórmula aplico la fórmula sobre el valor per obtenir la desc
	if(a.desc)
		return DonaCadena(a.desc);
	if(!formula)
		return a.nom;
	var valor=a.nom;
	return eval(formula);	
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
	if (a.cze && ParamCtrl.idioma=="cze")
		return a.cze;
	if (a.ger && ParamCtrl.idioma=="ger")
		return a.ger;
	if (a.eng)   //Si no hi ha l'idioma solicitat faig que xerri en anglès
		return a.eng;

	if (a.cat==null && a.spa==null && a.eng==null && a.fre==null && a.cze==null && a.ger==null)  //Cas de cadena no multiidioma
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
				if(cadena_lang.cat) return cadena_lang.cat;
				return cadena_lang.eng;
			case "spa":
				if(cadena_lang.spa)	return cadena_lang.spa;
				return cadena_lang.eng;
			default:     //Si no hi ha l'idioma solicitat faig que xerri en anglès
			case "eng":
				return cadena_lang.eng;
			case "fre":
				if(cadena_lang.fre)return cadena_lang.fre;
				return cadena_lang.eng;
			case "cze":
				if(cadena_lang.cze)return cadena_lang.cze;
				return cadena_lang.eng;
			case "ger":
				if(cadena_lang.ger)return cadena_lang.ger;
				return cadena_lang.eng;
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
	if (idioma=="cze" && a!=null && a.cze!=null)
		return a.cze;
	if (idioma=="ger" && a!=null && a.ger!=null)
		return a.ger;
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

/*
Converteix un codi d'idioma ISO de 2 lletres a un codi de idioma ISO de tres lletres
Per una entrada buida del paràmetre s'utilitza l'idioma de ParamCtrl.idioma.
*/
function getISOLanguageTag(language)
{
	if(!language)
		language=ParamCtrl.idioma;
	switch(language)
	{
		case "cat": return "ca";
		case "spa": return "es";
		case "eng": return "en";
		case "fre": return "fr";
		case "cze": return "cs";
		case "ger": return "de";
	}
	return "";
}

/*
Converteix un idioma ISO de 3 lletres en un idioma ISO de 2 lletres
Per defecte es pren l'ànglès.
*/
function getMMNLanguagefromISO(isoLanguage)
{
	if(!isoLanguage)
		return (ParamCtrl.idioma);
	switch(isoLanguage)
	{
		case "en": return "eng";
		case "ca": return "cat";
		case "es": return "spa";
		case "fr": return "fre";
		case "cs": return "cze";
		case "de": return "ger";
	}
	return "";
}


//Obté la sub-etiqueta de un idioma ISO. en-US --> en
function getSubtagIdiom(isoIdiom)
{
	return isoIdiom.split("-", 1)[0];
}

function CombinaURLServidorAmbParamPeticio(servidor, request)
{
	if(request.indexOf("=")==-1)
	{
		if(servidor.toLowerCase()==request.toLowerCase())
			return servidor;
		return DonaNomServidorSenseCaracterFinal(servidor) + request;
	}
	if(request.indexOf("?")==-1)
	{
		if(servidor.toLowerCase()==request.toLowerCase())
			return servidor;
		return DonaNomServidorCaracterFinal(servidor) + request;
	}
	if ((servidor.charAt(servidor.length-1)=="?")  // ·$· Potser també caldria mirar que l'interrogant sigui a dins del servidor i dins de la request i després cal fer espai per inserir la request al mig i treure el ? del servidor
		|| (servidor.charAt(servidor.length-1)=="/" &&  request.charAt(0)=="/"))
	{
		return servidor.substring(0, servidor.length-1) + request;
	}
	if(servidor.toLowerCase()==request.toLowerCase())
		return servidor;	
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
	ParamCtrl.idioma = s ? s : ComprovaDisponibilitatIdiomaPreferit();
	parent.document.title=DonaCadena(ParamCtrl.titol);
	CreaTitolNavegador();
	CreaLlegenda();

	if (ParamCtrl.ConsultaTipica && ParamCtrl.CapaConsultaPreguntaServidor && ParamCtrl.CapaConsultaPreguntaServidor.length>0 && NCapesCTipicaCarregades==ParamCtrl.CapaConsultaPreguntaServidor.length)
	{
		IniciaConsultesTipiques();
		CreaConsultesTipiques();
	}
	CreaBarra(null);
	
	for (var i_vista=0; i_vista<ParamCtrl.VistaPermanent.length; i_vista++)
		ReOmpleSlider(ParamCtrl.VistaPermanent[i_vista].nom, ParamInternCtrl.vista);
	
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

	elem=getFinestraLayer(window, "fbScope");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraFeedbackAmbScope();

	elem=getFinestraLayer(window, "param");
	if(isLayer(elem) && isLayerVisible(elem))
		OmpleFinestraParametres();

	elem=getFinestraLayer(window, "download");
	if(isLayer(elem) && isLayerVisible(elem))
		TancaFinestraLayer("download");  //Em falta una paràmetre per iniciar-la OmpleFinestraDownload(capa);

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
		
	elem=getFinestraLayer(window, "taulaCapaVectorial");
	if(isLayer(elem) && isLayerVisible(elem))
		MostraFinestraTaulaDeCapaVectorial()

	if (indexStoryMapActiu!==null)
	{
		if (indexStoryMapActiu<0)
			MostraFinestraTriaStoryMap();
		else
			IniciaStoryMap(indexStoryMapActiu);
	}
} // Fi function CanviaIdioma()


/*
Comprova del llistat de idiomes preferits per l'usuari, establert
a la configuració del navegador i si n'hi ha cap que correspongui
a un dels idiomes que gestiona el MMN. En cas afirmatiu es defineix
aquest com l'idioma d'inici per carregar el MMN.
*/
function ComprovaDisponibilitatIdiomaPreferit()
{
	const defaultLanguage = "eng";

 	if (window.navigator.languages) // Mai serà buit, en principi, perquè com a mínim contindrà l'idioma amb que es mostra les opcions del navegador.
	{
		const preferenciesIdiomesNavegador = window.navigator.languages;
		var currentISOIdiom, mmnIdiom;
		var idiomaTrobat = false;
		var indexIdioma = 0, preferencesLength = preferenciesIdiomesNavegador.length;
		/* Es recorre les preferencies idiomàtiques de l'usuari definides
		 al navegador.*/
		while (!idiomaTrobat && indexIdioma < preferencesLength)
		{
			currentISOIdiom = getSubtagIdiom(preferenciesIdiomesNavegador[indexIdioma]);
			mmnIdiom = getMMNLanguagefromISO(currentISOIdiom);
			if (mmnIdiom != "")
				idiomaTrobat = true;

			indexIdioma++
		}
		return idiomaTrobat ? mmnIdiom : defaultLanguage
	}
	else
	{
		return defaultLanguage;
	}
} // Fi function ComprovaDisponibilitatIdiomaPreferit()

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
			if(DonaCRSRepresentaQuasiIguals(ParamCtrl.capa[i_capa].TileMatrixSet[i].CRS, crs))
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
		CanviaCRSISituacio(null, ParamInternCtrl.ZoomPrevi[ParamInternCtrl.NZoomPreviUsat].ISituacio);
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
		alert(GetMessage("NoPreviousView", "miramon") + ".");
	}
}

function RecuperaVistaPreviaEvent(event) // Afegit Cristian 19/01/2016
{
	ComprovaCalTancarFeedbackAmbScope();
	RecuperaVistaPrevia();
	dontPropagateEvent(event);
}

var RectVistaAbansFullScreen=null;

function PortaVistaAFullScreen()
{
	//Si hi ha més d'una vista avisar que no te sentit fer-ho i plegar
	if (ParamCtrl.VistaPermanent[0].length>1)
	{
		alert(GetMessage("NoFullScreenMultiBrowser", "miramon"));
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
	ComprovaCalTancarFeedbackAmbScope();
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
	    alert(GetMessage("BrowserPopUpWindowsLocked", "miramon") + ". " + GetMessage("ChangeBrowserConfig", "miramon") + ".\n" + GetMessage("SomeInternetExplorerClickYellowBand", "miramon") + ".");
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
		{
			if(capa.FormatImage=="text/csv")
			{				
				if (capa.objectes && capa.objectes.features)
				{
					var features= capa.objectes.features;
					for (var i_obj=0; i_obj<features.length; i_obj++)
					{
						if(features[i_obj].origenProperties)
							delete features[i_obj].properties;							
					}
					if(capa.data)
					{
						delete capa.data;
						capa.AnimableMultiTime=false;
					}
				}
			}
			else
				delete capa.objectes;
		}
		else if (capa.FormatImatge=="image/tiff" && (capa.tipus=="TipusHTTP_GET" || !capa.tipus))
		{
			// Esborro els objectes tiff
			if(capa.tiff)
				delete capa.tiff;
			if(capa.i_capa_tiff)
				delete capa.i_capa_tiff;
			if(capa.valors)
			{
				for( var i_valor=0; i_valor<capa.valors.length; i_valor++)
				{
					if(capa.valors[i_valor].tiff)
						delete capa.tiff;
					if(capa.valors[i_valor].i_capa_tiff)
						delete capa.valors[i_valor].i_capa_tiff;
				}
			}
		}
		DescarregaSimbolsCapaDigi(capa);
		if (capa.tileMatrixSetGeometry)
		{
			if(capa.tileMatrixSetGeometry.tileMatrix)
			{
				for(var i_tm=0; i_tm<capa.tileMatrixSetGeometry.tileMatrix.length; i_tm++)
				{
					if(capa.tileMatrixSetGeometry.tileMatrix[i_tm].objNumerics)
						delete capa.tileMatrixSetGeometry.tileMatrix[i_tm].objNumerics;
				}
			}
			if(capa.tileMatrixSetGeometry.tilesSol)
				delete capa.tileMatrixSetGeometry.tilesSol;
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

var winImprimir=null;  //Necessari pels setTimeout();

function DonaWindowDesDeINovaVista(vista)
{
	if (vista.i_nova_vista==NovaVistaImprimir && winImprimir)
		return winImprimir;
	return window;
}

/*Aquesta funció canvia el CRS i el mapa de situació.
Si i_situació és -1, busca un mapa de situació que es correspongui al CRS demanat.
Si CRS és null i i_situacio no és -1, pren el CRS del mapa de situacio indicat*/
function CanviaCRSISituacio(crs_dest, i_situacio)
{
	if (crs_dest==null && i_situacio==-1)
	{
		alert("Wrong parameter combination in CanviaCRSISituacio()");
		return;
	}
	if (crs_dest==null)
		crs_dest=ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS;
	CanviaCRS(crs_dest);
	if (i_situacio==-1)
	{
		for (i_situacio=0; i_situacio<ParamCtrl.ImatgeSituacio.length; i_situacio++)
		{
			if (DonaCRSRepresentaQuasiIguals(ParamCtrl.ImatgeSituacio[i_situacio].EnvTotal.CRS, crs_dest))
				break;
		}
		if (i_situacio==ParamCtrl.ImatgeSituacio.length)
		{
			alert("CRS not available in the situation map array.");
			return;
		}
	}
	ParamInternCtrl.ISituacio=i_situacio;
	if(ParamCtrl.FuncioCanviProjeccio)
		eval(ParamCtrl.FuncioCanviProjeccio);
}

//El segon paràmetre no cal especificar-lo si és el CRS actual. Aquesta funció no canvia el mapa de situació.
function CanviaCRS(crs_dest, crs_ori)
{
var factor=1;
var i;

	if (!crs_ori)
		crs_ori=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS;

	if (DonaCRSRepresentaQuasiIguals(crs_ori, crs_dest))
		return;   //no cal torcar res

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

function CanviaCRSDeImatgeSituacio(i)
{
	if (i==-1)
		ParamCtrl.araCanviProjAuto=true;
	else
	{
		ParamCtrl.araCanviProjAuto=false;
		CanviaCRSISituacio(null, i);
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
		cdns.push("<form name=\"FormulProjeccio\" onSubmit=\"return false;\"><select CLASS=\"text_petit\" name=\"imatge\" onChange=\"CanviaCRSDeImatgeSituacio(parseInt(document.FormulProjeccio.imatge.value));\">");
		if (ParamCtrl.CanviProjAuto)
		{
			cdns.push("<OPTION VALUE=\"-1\"",(ParamCtrl.araCanviProjAuto ? " SELECTED" : "") ,">",
				GetMessage("automatic"));
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
		cdns.push("<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"2\"> &nbsp;",
			DonaDescripcioCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS),"</font>");
	return cdns.join("");
}

function CreaProjeccio()
{
    var elem=getLayer(window, "projeccio");
	if (isLayer(elem))
		contentLayer(elem, DonaCadenaHTMLProjeccio());
}

var TriaFullWindow=null;
function ObreTriaFullImprimir()
{
	ComprovaCalTancarFeedbackAmbScope();
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
	ComprovaCalTancarFeedbackAmbScope();
    if (AjudaWindow==null || AjudaWindow.closed)
    {
        AjudaWindow=window.open(GetMessage("helpHtm", "urls"),"FinestraAjuda",'toolbar=no,status=no,scrollbars=yes,location=no,menubar=yes,directories=no,resizable=yes,width=780,height=580');
		ShaObertPopUp(AjudaWindow);
    }
    else
        AjudaWindow.focus();
}

function InstalaLectorMapes()
{
	ComprovaCalTancarFeedbackAmbScope();
    var instalaWindow=window.open(GetMessage("installerMMRExe", "urls"));
    ShaObertPopUp(instalaWindow);
}

function DonaAreaCella(env, costat, crs)
{
	if (EsProjLongLat(crs))
		return FactorGrausAMetres*Math.cos((env.MaxY+env.MinY)/2*FactorGrausARadiants)*costat*FactorGrausAMetres*costat;
	return costat*costat;
}

function EscriuCostatIUnitatsZoom(i, crs)
{
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

//Només útils per la consulta per localització de punts
function DonaCoordenadaPuntCRSActual(punt, feature, crs_capa)
{
	if(!crs_capa || DonaCRSRepresentaQuasiIguals(crs_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
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
	if(!crs_capa || DonaCRSRepresentaQuasiIguals(crs_capa, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
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
	else if (nom_finestra=="fbScope")
		TancaFinestraFeedbackAmbScope();	
	else if (nom_finestra=="video")
		TancaFinestra_video();
	else if (nom_finestra=="editarVector")
		TancaFinestra_editarVector();
	else if (nom_finestra=="triaStoryMap")
		TancaFinestra_triaStoryMap();
	else if (nom_finestra=="creaStoryMap")
		TancaFinestra_storyMap();
	else if (nom_finestra=="storyMap")
		TancaFinestra_visualitzaStoryMap();
	else if (nom_finestra=="editaEstil")
		TancarFinestra_editEstil(nom_finestra);
	else if (nom_finestra=="taulaCapaVectorial")
		TancaFinestra_taulaCapaVectorial();
	else if (nom_finestra=="mostraQualitat")
		TancaFinestra_mostraQualitat();
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
	alert(GetMessage("FinishValidation", "miramon") + ". " + GetMessage("MayCloseBrowser", "miramon") + ".");
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
	ComprovaCalTancarFeedbackAmbScope();
	showFinestraLayer(window, "enllac");
	OmpleFinestraEnllac();
	setzIndexFinestraLayer(window, "enllac", (layerList.length-1));
}

function MostraFinestraEnllacWMS()
{
	ComprovaCalTancarFeedbackAmbScope();
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
	if(tipus=="TipusSTAplus")
		return "STA Plus";
	if(tipus=="TipusSTA")
		return "STA";
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

		for (i_capa=0, capesLength=ParamCtrl.capa.length; i_capa<capesLength; i_capa++)
			cdns.push(DonaServidorCapa(ParamCtrl.capa[i_capa]));

		cdns2.push("<center><table border=\"0\" width=\"95%\"><tr><td><font size=\"1\">");
		if(cdns.length>0)
		{
			cdns.sort();
			if (ParamCtrl.ServidorLocal)
			{
				for (i=0, cdnsLength=cdns.length; i<cdnsLength; i++)
				{
					if (ParamCtrl.ServidorLocal==cdns[i])
					{
						array_tipus.length=0;
						//Necessito saber el tipus.
						for (i_capa=0, capesLength=ParamCtrl.capa.length; i_capa<capesLength; i_capa++)
						{
							if (cdns[i]==DonaServidorCapa(ParamCtrl.capa[i_capa]))
							{
								if (array_tipus.length==0)
								{
									cdns2.push(GetMessage("MainServerBrowser", "miramon"),":<br>");
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
						cdns2.push("<P>", GetMessage("OtherServersUsed", "miramon"), ":<br>");
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
				cdns2.push(GetMessage("MainServerBrowser", "miramon"),":<br><a href=\"",
					DonaRequestServiceMetadata(ParamCtrl.ServidorLocal, ParamCtrl.VersioServidorLocal, ParamCtrl.TipusServidorLocal, ParamCtrl.CorsServidorLocal), "\" target=\"_blank\">",
					ParamCtrl.ServidorLocal, " (", DonaDescripcioTipusServidor(ParamCtrl.TipusServidorLocal), ")","</a><br>");
			}
			else
			{
				cdns2.push(GetMessage("ServerUrlNotDetermine", "miramon") + ".");
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
			GetMessage("OWSContextDocument", "miramon"),
			":<br><input type=\"text\" name=\"url_context\" value=\"\"><input type=\"submit\" value=\"",
			GetMessage("Open"),
			"\">",
			"<input type=\"button\" value=\"",
			GetMessage("Save"),
			"\" onClick=\"SaveOWSContext(document.OWSContext.url_context.value);\"><br>",
			//OWSC previewer (here will appear the info about the OWSC when loaded)
			//Direct link to de view (until the OWSC is loaded, a link to the current view)
			"</form><div id=\"OWSC_previewer\">",
			GetMessage("LinkToView", "miramon"),
			":<br><a href=\"",link,"\">",
			link,
			"</a></div>");
		contentFinestraLayer(window, "enllac", cdns.join(""));
    }
}

function EsPuntDinsAmbitNavegacio(punt)
{
	return EsPuntDinsEnvolupant(punt, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.EnvCRS);
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


function PortamAVistaGeneral()
{
	if (ParamCtrl.ConsultaTipica)
		PosaLlistaValorsConsultesTipiquesAlPrincipi(-1);
	GuardaVistaPrevia();
	CanviaAVistaGeneral();
}
function PortamAVistaGeneralEvent(event) //Afegit Cristian 19/01/2016
{
	ComprovaCalTancarFeedbackAmbScope();
	PortamAVistaGeneral();
	dontPropagateEvent(event);
}


//No crida GuardaVistaPrevia()
function CanviaAVistaGeneral()
{
//var i_max;
	//busco la vista de més extensió
	//i_max=0;
	/*for (var i=1; i<ParamCtrl.ImatgeSituacio.length; i++)
	{
		if ((ParamInternCtrl.EnvLLSituacio[i_max].MaxX-ParamInternCtrl.EnvLLSituacio[i_max].MinX)+
			(ParamInternCtrl.EnvLLSituacio[i_max].MaxY-ParamInternCtrl.EnvLLSituacio[i_max].MinY)<
		    (ParamInternCtrl.EnvLLSituacio[i].MaxX-ParamInternCtrl.EnvLLSituacio[i].MinX)+
			(ParamInternCtrl.EnvLLSituacio[i].MaxY-ParamInternCtrl.EnvLLSituacio[i].MinY))
				i_max=i;
	}*/
	/*if (i_max!=ParamInternCtrl.ISituacio)
	{
		if (ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS!=ParamCtrl.ImatgeSituacio[i_max].EnvTotal.CRS)
			CanviaCRSISituacio(null, i_max);
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
	ComprovaCalTancarFeedbackAmbScope();
	dontPropagateEvent(event);
	PortamANivellDeZoom(nivell);
}

//sz=1 will "zoom in" and sz=-1 will "zoom out"
function MouNivellDeZoomEvent(event, sz, targetParentElement, i_nova_vista, clientX, clientY)
{
	if (i_nova_vista!=null && targetParentElement)
		PortamAPunt(DonaCoordXDeCoordSobreVista(event.target.parentElement, i_nova_vista, clientX), DonaCoordYDeCoordSobreVista(event.target.parentElement, i_nova_vista, clientY));
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
		alert(GetMessage("NoMoreZoomOut", "miramon") + ".");
		nivell=0;
		CanviaAVistaGeneral();
	}
	else if (nivell>=ParamCtrl.zoom.length)
	{
		alert(GetMessage("NoMoreZoomIn", "miramon") + ".");
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
	ComprovaCalTancarFeedbackAmbScope();
	if (!ObreFinestra(window, "video", GetMessage("timeSeries", "miramon")))
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
	if (DonaCRSRepresentaQuasiIguals(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.EnvTotal.CRS))
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
	if (DonaCRSRepresentaQuasiIguals(c.EnvTotal.CRS, c2.EnvTotal.CRS))
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
	if (DonaCRSRepresentaQuasiIguals(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, env.CRS))
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
	if (DonaCRSRepresentaQuasiIguals(env_situa_actual.CRS, env_situa.CRS))
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
					DonaCRSRepresentaQuasiIguals(c.TileMatrixSet[i].CRS, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
				{
					return true;
				}
			}
			return false;
		}
		return false;
	}
	return true;
}

function EsCapaDisponibleEnElCRSActual(capa)
{
	if (capa.CRS /*&&
		!(capa.FormatImatge=="image/tiff" && (capa.tipus=="TipusHTTP_GET" || !capa.tipus))*/)  //NJ07-07-2023 Faig que les capes TIFF passin a funcionar com les altres pel que respecte a aquest membre i el sistema original es desa a CRSgeometry
	{
		for (var i=0; i<capa.CRS.length; i++)
		{
			if (DonaCRSRepresentaQuasiIguals(capa.CRS[i], ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
				return EsTileMatrixSetDeCapaDisponbleEnElCRSActual(capa);
		}
		return false;
	}
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
		return CanviaVariablesDeCadena(DonaCadena(capa.metadades.standard), capa, null, null);
	return CanviaVariablesDeCadena(DonaCadena(capa.estil[i_estil].metadades.standard), capa, null, null);
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
			alert(GetMessage("BinaryPayloadNotFound", "miramon") +": \n"+dades_request.text);
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
		alert(GetMessage("FormatNotFound", "miramon")+": \n"+dades_request.text);
		return;
	}
	else if (binary_content=="")
	{
		alert(GetMessage("BinaryPayloadAndPayloadContentNotFound", "miramon")+": \n"+dades_request.text );
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
			s="/collections/{collectionId}/styles/{styleId}/map/tiles/{tileMatrixSetId}/{tileMatrix}/{tileRow}/{tileCol}?";

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
		cdns.push(((capa.FormatImatge=="image/jpeg") ? "" : "&transparent=" + ((capa.transparencia && capa.transparencia!="opac")? "true" : "false")));
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
	return servidor ? servidor : "";
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

	if (tipus=="TipusOAPI_Maps")
		cdns.push("bbox-crs=");
	else if (DonaVersioServidorCapa(capa).Vers<1 || (DonaVersioServidorCapa(capa).Vers==1 && DonaVersioServidorCapa(capa).SubVers<2))
		cdns.push("SRS=");
	else
		cdns.push("CRS=");
	cdns.push(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	if (tipus=="TipusOAPI_Maps")
		 cdns.push("&bbox=");
	else
		cdns.push("&BBOX=");

	if(CalGirarCoordenades(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS,  (tipus=="TipusOAPI_Maps" ? null : DonaVersioServidorCapa(capa))))
		cdns.push(env.MinY , "," , env.MinX , "," , env.MaxY , "," , env.MaxX);
	else
		cdns.push(env.MinX , "," , env.MinY , "," , env.MaxX , "," , env.MaxY);
	if(tipus=="TipusOAPI_Maps")
	{
		cdns.push("&width=" , ncol , "&height=" , nfil,
				"&f=" , capa.FormatImatge,
				((capa.FormatImatge=="image/jpeg") ? "" : "&transparent=" + ((capa.transparencia && capa.transparencia!="opac")? "true" : "false")));

	}
	else
	{
		cdns.push("&WIDTH=" , ncol , "&HEIGHT=" , nfil,
				"&LAYERS=" , capa.nom, "&FORMAT=" , capa.FormatImatge,
				((capa.FormatImatge=="image/jpeg") ? "" : "&TRANSPARENT=" + ((capa.transparencia && capa.transparencia!="opac")? "TRUE" : "FALSE")),
				"&STYLES=");
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
				//Si la clau no comença per "DIM_", llavors ho afegeixo jo
				cdns.push("&",
					((clau_valor.clau.nom.toUpperCase()!="TIME" && clau_valor.clau.nom.toUpperCase()!="ELEVATION" && clau_valor.clau.nom.substr(0,4).toUpperCase()!="DIM_") ? "DIM_": ""),
					clau_valor.clau.nom,"=",clau_valor.valor.nom);
			}
		}
		else if (capa.dimensioExtra)
		{
			for (var i_param=0; i_param<capa.dimensioExtra.length; i_param++)
			{
				if (capa.dimensioExtra[i_param].i_valor>-1)
				{
					var clau=capa.dimensioExtra[i_param].clau.nom;
					//Si la clau no comença per "DIM_", llavors ho afegeixo jo
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

function EsCapaBinaria(capa)
{
	return capa.FormatImatge=="application/x-img" ||
	    (capa.FormatImatge=="image/tiff" && (capa.tipus=="TipusHTTP_GET" || !capa.tipus))
}



function DonaCadenaBotonsVistaLlegendaSituacioCoord()
{
var cdns=[]
	if (isFinestraLayer(window, "llegenda") && !isFinestraLayerVisible(window, "llegenda"))
		cdns.push(CadenaBotoPolsable('boto_mostra_llegenda', 'mostra_llegenda', GetMessage("ShowLegend", "miramon"), 'MostraFinestraLlegenda(event)'), "<br>",
			"<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"),"\" width=\"1\" height=\"3\"><br>");
	if (isFinestraLayer(window, "situacio") && !isFinestraLayerVisible(window, "situacio"))
		cdns.push(CadenaBotoPolsable('boto_mostra_situacio', 'mostra_situacio', GetMessage("ShowSituationMap", "miramon"), 'MostraFinestraSituacio(event)'),"<br>",
			"<img src=\"", AfegeixAdrecaBaseSRC("1tran.gif"),"\" width=\"1\" height=\"3\"><br>");
	if (isFinestraLayer(window, "coord") && !isFinestraLayerVisible(window, "coord"))
		cdns.push(CadenaBotoPolsable('boto_mostra_coord', 'mostra_coord', GetMessage("ShowInfoCurrentPosition", "miramon"), 'MostraFinestraCoord(event)'),"<br>");
	return cdns.join("");
}

function TancaFinestra_llegenda_situacio_coord()
{
	document.getElementById("llegenda_situacio_coord").innerHTML=DonaCadenaBotonsVistaLlegendaSituacioCoord();
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
				alert(GetMessage("NoMoreZoomOut", "miramon"));
				costat=ParamCtrl.zoom[0].costat;
			}
			else if (costat<ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat)
			{
				alert(GetMessage("NoMoreZoomIn", "miramon"));
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
		//Aquesta funció no fa canvis de CRS si no cal
		CanviaCRSISituacio(null, i_min);
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
			if (DonaCRSRepresentaQuasiIguals(crs, ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS) &&
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
			if (DonaCRSRepresentaQuasiIguals(crs, ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS))
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
			if (DonaCRSRepresentaQuasiIguals(crs, ParamCtrl.ImatgeSituacio[i].EnvTotal.CRS) &&
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
		CanviaCRSISituacio(null, i_min);
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

function DonaIndexCapa(capa)
{
	return ParamCtrl.capa.indexOf(capa);
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
	estil.origen=OrigenUsuari;  //Això ho va crear AZ ni no crec que hagi de ser 'usuari' sempre. De moment ho deixo.
	CarregaSimbolsEstilCapaDigi(capa, i_estil_nou, true);

	return i_estil_nou;
}

function FesVisiblesNomesAquestesCapesAmbEstils(layers, styles, param_name_layers)
{
var capa_visible=layers.split(","), capa_estil=styles ? styles.split(",") : null;
var capa, j, i, i_estil;

	if (capa_estil && capa_visible.length!=capa_estil.length)
	{
		alert(GetMessage("StyleNumberNotNumberLayers", "miramon"));
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
					alert(GetMessage("Layer") + " " + capa_visible[j] + " " +
						GetMessage("indicatedAt") + " " + param_name_layers +  " " +
						GetMessage("cannotBeActivated") + ".");
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
								    alert(GetMessage("CannotFindStyle") + " " + capa_estil[j] + " " + GetMessage("ForLayer") + " " + capa_visible[j]);
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
							if (capa_estil[j]!=null && capa_estil[j]!="" && capa.estil[0].id!=capa_estil[j])
								alert(GetMessage("CannotFindStyle") + " " + capa_estil[j] + " " +
								    GetMessage("ForLayer") + " " + capa_visible[j]);
					    	}
					}
				}

				if (capa.descarregable=="ara_no")
					capa.descarregable="si";
				break;
			}
		}
		if (i==ParamCtrl.capa.length)
			alert(GetMessage("CannotFindLayer") + " " + capa_visible[j] + " " +
					GetMessage("indicatedAt") + " " +  param_name_layers);
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
			alert(GetMessage("CannotFindServerToResponse", "miramon"));
			return false;
		}
		if(Accio.capes==null)
		{
			alert(GetMessage("CannotFindTestLayers", "miramon"));
			return false;
		}
		if(Accio.camps==null)
		{
			alert(GetMessage("CannotFindTestFields", "miramon"));
			return false;
		}

		if(Accio.camps.length!=Accio.capes.length)
		{
			alert(GetMessage("FieldNumberNotNumberLayers", "miramon") + ".");
			return false;
		}
		if(Accio.valors && Accio.valors.length!=Accio.capes.length)
		{
			alert(GetMessage("ValuesNumberNotNumberLayers", "miramon") + ".");
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
					alert(GetMessage("Layer") + Accio.capes[i] + GetMessage("indicatedTestLayerNotExist") + ".");
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
				alert(GetMessage("RequestedPoint", "miramon") + " (x,y)=" + Accio.coord.x + "," + Accio.coord.y + " " + GetMessage("isOutsideBrowserEnvelope", "miramon") + ".");
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
			alert(GetMessage("CannotFindXYParameters", "miramon"));
			return false;
		}
		else if(!EsPuntDinsAmbitNavegacio(Accio.coord))
		{
			alert(GetMessage("RequestedPoint", "miramon") + " (x,y)=" + Accio.coord.x + "," + Accio.coord.y + " " + GetMessage("isOutsideBrowserEnvelope", "miramon") + ".");
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
	    alert(GetMessage("TheVersion", "miramon") +
			" config.json (" + param_ctrl.VersioConfigMMN.Vers + "." + param_ctrl.VersioConfigMMN.SubVers + ") " +
			GetMessage("notMatchVersion", "miramon") +
			" tools.htm (" + VersioToolsMMN.Vers + "." + VersioToolsMMN.SubVers + "). " +
			GetMessage("UpgradeCorrectly", "miramon") + ".");
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
			false==confirm(GetMessage("ServerHasNewConfMap", "miramon") + "." + GetMessage("AcceptToAdopt", "miramon"))))
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
				alert(GetMessage("SavingStatusMapNotPossible", "miramon") + ".");
			}
		}
	}

	if (ComprovaVersioConfigMMN(ParamCtrl))
		return;

	ParamCtrl.containerName=param.div_name;
	ParamCtrl.config_json=param.config_json;

	ResolveJSONPointerRefs(ParamCtrl);

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

// Crea un UUID si cal
function CreaUUIDSiCal(obj)
{
	if (!obj.id)
		obj.id=create_UUID();
}

function ComprovaConsistenciaParamCtrl(param_ctrl)
{
	var i, j, k;

	if (!param_ctrl.VistaPermanent)
		param_ctrl.VistaPermanent=[{"nom": "vista"}]; //Això és el sistema antic, on només hi podia haver una vista. Si no m'ho especifiquen assumeixo això.

	if (param_ctrl.CapaDigi)
	{
		alert(GetMessage("CapaDigiNoLongerSupported", "miramon") + ". " + GetMessage("UseLayerModelInstead", "miramon") + ".");
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
		if(param_ctrl.ServidorLocal &&
		   host==DonaHost(param_ctrl.ServidorLocal).toLowerCase() &&
		   protocol!=DonaProtocol(param_ctrl.ServidorLocal).toLowerCase())
		{
			param_ctrl.ServidorLocal=protocol+param_ctrl.ServidorLocal.substring(param_ctrl.ServidorLocal.indexOf("://")+1, param_ctrl.ServidorLocal.length);
		}
	}
	if (typeof param_ctrl.CorsServidorLocal==="undefined")
		param_ctrl.CorsServidorLocal=false;

	for (i=0; i<param_ctrl.capa.length; i++)
	{
		capa=param_ctrl.capa[i];
		//CreaIdSiCal(capa, i); Traslladat a CompletaDefinicioCapa

		if (protocol=="https:" && capa.servidor && host==DonaHost(capa.servidor).toLowerCase() &&
			   protocol!=DonaProtocol(capa.servidor).toLowerCase())
		{
			capa.servidor=protocol+capa.servidor.substring(capa.servidor.indexOf("://")+1, capa.servidor.length);
		}

		if (capa.visible=="semitransparent" && capa.transparencia!="semitransparent")
		{
			alert(GetMessage("TheProperty") + " capa.visible " + GetMessage("indicates") + " \"semitransparent\" " + GetMessage("butTransparenciaDoesNotAllowIt", "miramon") + ". " + GetMessage("YouMayContinue") + "." +
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
								alert(GetMessage("TheProperty") + " atributs.mostrar " + GetMessage("mustBe") + " \"si\", \"si_ple\", \"no\" " + GetMessage("andIsInsteadSetOtherwise", "miramon") + ". " + GetMessage("ValueIgnoredAttributeShowable", "miramon") + ". " + GetMessage("YouMayContinue") + "." + " capa = " + DonaCadenaNomDesc(capa));
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

			if (protocol=="https:" && DonaServidorCapa(capa) && DonaProtocol(DonaServidorCapa(capa)) && protocol!=DonaProtocol(DonaServidorCapa(capa)).toLowerCase() /* && DonaCorsServidorCapa(capa)==true*/)
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
				// CreaIdSiCal(estil, j);  Traslladat a CompletaDefinicioCapa
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
										alert(GetMessage("TheProperty") + " atributs.mostrar " + GetMessage("mustBe") + " \"si\", \"si_ple\", \"no\" " + GetMessage("andIsInsteadSetTo", "miramon") + " \"true/false\". " + GetMessage("YouMayContinue") + "." +
												" estil = " + DonaCadenaNomDesc(estil));
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
										alert(GetMessage("TheProperty") + " atributs.mostrar " + GetMessage("mustBe") + " \"si\", \"si_ple\", \"no\" " + GetMessage("andIsInsteadSetOtherwise", "miramon") + ". " + GetMessage("ValueIgnoredAttributeShowable", "miramon") + ". " + GetMessage("YouMayContinue") + "." +
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
		if (capa.data && capa.data.length)
		{
			//Canvio des dates de tipus string ISO al format propi tipus JSON.
			for (j=0; j<capa.data.length; j++)
			{
				var s=capa.data[j];
				if (typeof s==="string")
				{
					capa.data[j]={};
					OmpleDataJSONAPartirDeDataISO8601(capa.data[j], s);
				}
			}
		}
	}

	if (param_ctrl.zoom[param_ctrl.zoom.length-1].costat>param_ctrl.zoom[0].costat)
	{
		alert(GetMessage("ZoomSizesSortedBiggerFirst", "miramon"));
		return 1;
	}
	for (i=0; i<param_ctrl.zoom.length; i++)
		if (param_ctrl.zoom[i].costat==param_ctrl.NivellZoomCostat)
			break;
	if (i==param_ctrl.zoom.length)
	{
		alert(GetMessage("NivellZoomCostatNotIndicated", "miramon"));
		return 1;
	}
	return 0;
}

function AfegeixPuntsCapabilitiesACapaDePunts(layers, capaDePunts)
{
var capa, layer, punt;

	//cerco la capa de punts
	//si te objectes li afegeixo els que toca
	if (null==(capa=DonaCapaDesDeIdCapa(capaDePunts.id)))
	{
		alert(GetMessage("CannotFindLayer") + " (id: " + i_capa + ")");
		return;
	}
	if (!capa.objectes || !capa.objectes.features)
	{
		alert("The 'capa' has no 'objectes' or there is no array on 'features' in 'objectes'" + " (id: " + i_capa + ")");
		return;
	}

	for(var i_layer=0; i_layer<layers.length; i_layer++)
	{
		layer=layers[i_layer];
		if (!layer.EnvLL)
			continue;

		punt={x: (layer.EnvLL.MaxX+layer.EnvLL.MinX)/2, y: (layer.EnvLL.MaxY+layer.EnvLL.MinY)/2};

		capa.objectes.features.push({
			"type": "Feature",
			"bbox": [punt.x, punt.y, punt.x, punt.y],
			"geometry": {
				"type": "Point",
				"coordinates": [punt.x, punt.y]
			},
			"properties": {
			}
		});
		if (capaDePunts.properties && capaDePunts.properties.length)
		{
			for (var i_prop=0; i_prop<capaDePunts.properties.length; i_prop++)
			{
				if (layer[capaDePunts.properties[i_prop]])
					capa.objectes.features[capa.objectes.features.length-1].properties[capaDePunts.properties[i_prop]]=layer[capaDePunts.properties[i_prop]];
			}
		}
	}
}

/*Aquesta funció afegeix automàticament totes les capes d'un servidor a la llegenda.
Funció inspirada en MostraCapesCapacitatsWMS(servidorGC) i AfegeixCapesWMSAlNavegadorForm() que permet al usuari triar quines capes vol afegir.*/
function AfegeixCapesWMSAlNavegador(servidorGC)
{
var i_get_featureinfo;
var capa_afegida, alguna_capa_afegida=false;

	i_get_featureinfo=DonaFormatFeatureInfoCapesWMS(servidorGC);

	for(var i_layer=0; i_layer<servidorGC.layer.length; i_layer++)
	{
		capa_afegida=AfegeixOModificaCapaWMSAlNavegador(DonaFormatGetMapCapesWMS(servidorGC, i_layer), servidorGC, servidorGC.i_capa_on_afegir, i_layer, i_get_featureinfo);
		if(!alguna_capa_afegida && capa_afegida)
			alguna_capa_afegida=true;
	}

	if (servidorGC.param_func_after && servidorGC.param_func_after.capaDePunts)
		AfegeixPuntsCapabilitiesACapaDePunts(servidorGC.layer, servidorGC.param_func_after.capaDePunts);
	if(alguna_capa_afegida)
	{
		RevisaEstatsCapes();
		//CreaLlegenda();
		RepintaMapesIVistes(); //NJ_07_03_2023: Faig un repinta mapes i vistes perquè tot sigui més coherent, abans ja he marcat totes les capes del TIFF com visibles="ara_no" per evitar problemes i saturar el navegador amb massa peticions
	}
}

//Aquesta funció fa login o logout segons convingui.
function FerLoginICarregaCapes()
{
var capa, n_capa_ini;
	
	if (!CalFerLogin())
	{
		//alert(GetMessage("SessionsAlreadyStarted", "authens"));
		if (confirm(GetMessage("CloseTheStartedSessions", "authens")))
		{
			n_capa_ini=ParamCtrl.capa.length;
			for (var i=0; i<ParamCtrl.capesDeServei.length; i++)
			{
				if (ParamCtrl.capesDeServei[i].servei.access)
					RevokeLogin(ParamCtrl.capesDeServei[i].servei.access);
				//Ara cal treure totes les capes que requereixen aquesta identificació
				for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
				{
					capa=ParamCtrl.capa[i_capa]
					if (capa.access && capa.access.tokenType==ParamCtrl.capesDeServei[i].servei.access.tokenType && capa.origen==OrigenUsuari)
					{
						CanviaIndexosCapesSpliceCapa(-1, i_capa+1, -1, ParamCtrl);  // com que 'i_capa' desapareix, intentar moure cosa que apuntin a 'i_capa' no te sentit; i ja hem avisat que no anirà bé.
						ParamCtrl.capa.splice(i_capa, 1);
						i_capa--;
					}
				}
			}
			if (n_capa_ini>ParamCtrl.capa.length);
			{
				RevisaEstatsCapes();
				RepintaMapesIVistes();
			}
			return;  
		}
	}
	CarregaArrayCapesDeServei(true, false, false);
}

function CarregaCapesDeServei(capesDeServei)
{
	FesPeticioCapacitatsIParsejaResposta(capesDeServei.servei.servidor, capesDeServei.servei.tipus, capesDeServei.servei.versio, capesDeServei.servei.cors, capesDeServei.servei.access, NumeroDeCapesVolatils(-1), AfegeixCapesWMSAlNavegador, {capa: capesDeServei.capa ? capesDeServei.capa : null, capaDePunts: capesDeServei.capaDePunts ? capesDeServei.capaDePunts : null, estilPerCapa: capesDeServei.estilPerCapa ? capesDeServei.estilPerCapa : null, dimensioPerCapa: capesDeServei.dimensioPerCapa ? capesDeServei.dimensioPerCapa : null, nodataPerCapa: capesDeServei.nodataPerCapa ? capesDeServei.nodataPerCapa : null });
}

function DonaCadenaPreguntarCarregaArrayCapesDeServei(nomesOffline)
{
var cdns=[];

	cdns.push(GetMessage("BrowserContainsLayersRequireLogin", "authens"), ".<br>",
		GetMessage("DoYouWantToLogInNow", "authens"),
		"<br><center><input type=\"button\" class=\"Verdana11px\" value=\"", GetMessage("OK"),"\" onClick='CarregaArrayCapesDeServei(",nomesOffline,", true, false);TancaFinestraLayer(\"info\");'/> ",
		"<input type=\"button\" class=\"Verdana11px\" value=\"", GetMessage("Cancel"),"\" onClick='CarregaArrayCapesDeServei(",nomesOffline,", true, true);TancaFinestraLayer(\"info\");'/></center>");
	return cdns.join("");
}

function PreguntarCarregaArrayCapesDeServei(nomesOffline)
{
	IniciaFinestraInformacio(DonaCadenaPreguntarCarregaArrayCapesDeServei(nomesOffline));
}

function CarregaArrayCapesDeServei(nomesOffline, preguntat, nomesSenseLogin)
{
	if (!ParamCtrl.capesDeServei || (nomesOffline && !ParamCtrl.accessClientId))
		return;

	var calfer=[], calferAlgun=false;
	if(!nomesSenseLogin)
	{
		for (var i=0; i<ParamCtrl.capesDeServei.length; i++)
		{
			calfer[i]=false;
			if (ParamCtrl.capesDeServei[i].servei.access)
			{
				if (!ParamInternCtrl.tokenType)
				{
					alert("authen.js not included in index.htm");
					return;
				}
				var access=ParamCtrl.capesDeServei[i].servei.access;
				if (!ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken || 
					ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken=="failed")
					calferAlgun=calfer[i]=true;
			}
		}
	}

	/*if (nomesOffline)
	{
		if (!calferAlgun)
			return;
		PreparaReintentarLogin();
		for (var i=0; i<ParamCtrl.capesDeServei.length; i++)
		{
			if (calfer[i])
				CarregaCapesDeServei(ParamCtrl.capesDeServei[i]);
		}
	}
	else
	{*/
		if (calferAlgun && !preguntat)
		{
			//Si hi ha alguna capa que requereix autentificació, el sistema de bloqueix de "pop ups" evita que surti la caixa a no ser que una acció de l'usuari ho invoqui. Per això cal una pregunta a l'usuari
			PreguntarCarregaArrayCapesDeServei(nomesOffline);
		}
		else
		{
			for (var i=0; i<ParamCtrl.capesDeServei.length; i++)
				if (calfer[i] || (!nomesOffline && !ParamCtrl.capesDeServei[i].servei.access))
					CarregaCapesDeServei(ParamCtrl.capesDeServei[i]);
		}
	//}	
}

function IniciaVisualitzacio()
{
var nou_env={"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300};
var nou_CRS="";
var i, j, l, titolFinestra, div=document.getElementById(ParamCtrl.containerName);

	//div.style.overflow="hidden";
	div.style.overflow="clip";
	div.innerHTML="";

	if (ParamCtrl.AdrecaBaseSRC)
		ParamCtrl.AdrecaBaseSRC=DonaAdrecaSenseBarraFinal(ParamCtrl.AdrecaBaseSRC);  // Es verifica aquí i així ja no cal versificar-ho cada cop. (JM)

	for (i=0; i<ParamCtrl.Layer.length; i++)
	{
		l=ParamCtrl.Layer[i];
		if (l.resizable)
		{
			var config_msg=MessageLang["config"][l.name];			
			titolFinestra = ( config_msg=="[Missing message]" || config_msg==("["+GetMessage("MissingMessage")+"]")) ? l.title : GetMessageJSON(l.name, "config");
			createFinestraLayer(window, l.name, titolFinestra, boto_tancar, l.left, l.top, l.width, l.height, l.ancora, {scroll: (l.scroll) ? l.scroll : "no", visible: (l.visible) ? l.visible : false, ev: (l.ev ? l.ev : null), resizable:true, onresize: (l.name=="situacio" ? CreaSituacio : null)}, (l.content) ? l.content : null);
		}
		else
			createLayer(window, l.name, l.left, l.top, l.width, l.height, l.ancora, {scroll: (l.scroll) ? l.scroll : "no", visible: (l.visible) ? l.visible : false, ev: (l.ev) ? l.ev : null}, (l.content) ? l.content : null);
	}


	createFinestraLayer(window, "executarProces", GetMessageJSON("ExecuteProcessWPS", "miramon"), boto_tancar, 400, 250, 550, 550, "nWSeCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "afegirCapa", GetMessageJSON("AddLayerToMap", "miramon"), boto_tancar, 420, 130, 520, 600, "nWSeC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "calculadoraCapa", GetMessageJSON("LayerCalculator", "cntxmenu"), boto_tancar, 420, 130, 450, 540, "NWCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "combinacioCapa", GetMessageJSON("AnalyticalCombinationLayers", "cntxmenu"), boto_tancar, 420, 130, 520, 450, "NWCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "seleccioCondicional", GetMessageJSON("SelectionByCondition", "miramon"), boto_tancar, 320, 100, 490, 555, "NWCR", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "combinacioRGB", GetMessageJSON("RGBCombination", "cntxmenu"), boto_tancar, 220, 90, 430, 275, "NwCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "seleccioEstadistic", GetMessageJSON("SelectionStatisticValue", "cntxmenu"), boto_tancar, 220, 90, 430, 265, "NwCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "editaEstil", GetMessageJSON("EditStyle", "cntxmenu"), boto_tancar, 240, 110, 430, 435, "NwCR", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "anarCoord", GetMessageJSON("GoToCoordinate", "barra"), boto_tancar, 297, 298, 250, 160, "NwCR", {scroll: "no", visible: false, ev: null}, null);
	createFinestraLayer(window, "fbScope", GetMessageJSON("FBwithScope", "barra"), boto_tancar, 297, 298, 350, 200, "NwCR", {scroll: "no", visible: false, ev: null}, null);
	createFinestraLayer(window, "multi_consulta", GetMessageJSON("Query"), boto_tancar, 1, 243, 243, 661, "nWSe", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "param", GetMessageJSON("Parameters"), boto_tancar, 250, 150, 480, 595, "NwCR", {scroll: "no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "download", GetMessageJSON("DownloadLayer", "download"), boto_tancar, 190, 120, 400, 360, "NwCR", {scroll: "no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "video", GetMessageJSON("TimeSeriesAnalysisAndAnimations", "miramon"), boto_tancar, 20, 1, 900, 610, "NWCR", {scroll: "no", visible: false, ev: null}, null);
	createFinestraLayer(window, "consola", GetMessageJSON("RequestConsole", "miramon"), boto_tancar, 277, 220, 500, 300, "Nw", {scroll: "ara_no", visible: false, ev:null, resizable:true}, null);
	createFinestraLayer(window, "reclassificaCapa", GetMessageJSON("ReclassifierLayerValues", "miramon"), boto_tancar, 250, 200, 650, 400, "Nw", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "calculaQualitat", GetMessageJSON("ComputeQuality", "cntxmenu"), boto_tancar, 250, 200, 700, 400, "Nw", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "mostraLlinatge", GetMessageJSON("Lineage"), boto_tancar, 250, 1, 800, 420, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "mostraQualitat", GetMessageJSON("Quality"), boto_tancar, 250, 200, 700, 400, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "feedback", GetMessageJSON("Feedback"), boto_tancar, 220, 180, 625, 400, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "feedbackAmbEstils", GetMessageJSON("FeedbackContainingStyles", "miramon"), boto_tancar, 220, 180, 625, 400, "Nw", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "enllac", GetMessageJSON("OpenOrSaveContext", "miramon"), boto_tancar, 650, 165, 450, 200, "NwCR", {scroll: "ara_no", visible: false, ev: null}, null);
	createFinestraLayer(window, "enllacWMS", GetMessageJSON("LinksToOGCServicesBrowser", "miramon"), boto_tancar, 650, 165, 400, 120, "NwCR", {scroll: "ara_no", visible: false, resizable: true, ev: null}, null);
	createFinestraLayer(window, "triaStoryMap", GetMessageJSON("Storymaps", "storymap"), boto_tancar, 420, 150, 420, 350, "nWC", {scroll: "ara_no", visible: false, ev: false, resizable:true}, null);
	createFinestraLayer(window, "storyMap", GetMessageJSON("storyMapTitle", "miramon"), boto_tancar, 220, 180, 500, 400, "Nw", {scroll: "ara_no", visible: false, ev: "onScroll='ExecutaAttributsStoryMapVisibleEvent(event);'", resizable:true}, null);
	createFinestraLayer(window, "info", GetMessageJSON("InformationHelp", "miramon"), boto_tancar, 420, 150, 420, 350, "nWC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "modificaNom", GetMessageJSON("ModifyName"), boto_tancar, 250, 200, 600, 200, "Nw", {scroll: "ara_no", visible: false, ev: null}, null);
	createLayer(window, "menuContextualCapa", 277, 168, 145, 240, "wC", {scroll: "no", visible: false, ev: null}, null);  //L'alt real es controla des de la funció OmpleLayerContextMenuCapa i l'ample real des de l'estil MenuContextualCapa
	createFinestraLayer(window, "editarVector", GetMessageJSON("InsertNewPoint", "miramon"), boto_tancar, 420, 150, 500, 320, "nWSeC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	//La següent finesta es fa servir pels missatges de les transaccions però, s'hauria de resoldre bé i fer servir de manera general per qualsevol missatge d'error emergent
	createFinestraLayer(window, "misTransaccio", GetMessageJSON("ResultOfTheTransaction", "miramon"), boto_tancar, 420, 150, 300, 300, "nWSeC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "taulaCapaVectorial", GetMessageJSON("ElementsVectorialTable", "vector"), boto_copiar|boto_tancar, 420, 150, 500, 320, "nWSeC", {scroll: "ara_no", visible: false, ev: null, resizable:true}, null);
	createFinestraLayer(window, "creaStoryMap", GetMessage("NewStorymap", "storymap"), boto_tancar, 420, 150, 420, 350, "nWC", {scroll: "ara_no", visible: false, ev: false, resizable:true}, null);
	
	if (ComprovaConsistenciaParamCtrl(ParamCtrl))
		return;

	PreparaParamInternCtrl();

	if (window.InitHello)
		InitHello();

	CreaCapesVolatils();

	CompletaDefinicioCapes();

	CarregaArrayCapesDeServei(false, false, false);

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
		var coord, capa_visible, tinc_estils, capa_estil, query={};
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
			coord=query["BBOX"].split(",");
			if (coord.length!=4)
			{
				alert(GetMessage("NotFindBBox", "miramon") + "=");
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
							alert(GetMessage("Layer") + capa_visible[j] + " " + GetMessage("IndicatedQueryLayers", "miramon") + "= " + GetMessage("cannotBeActivated") + ".");
						break;
					}
				}
				if (i==ParamCtrl.capa.length)
					alert(GetMessage("CannotFindLayer") + " " + capa_visible[j] + " " + GetMessage("IndicatedQueryLayers", "miramon") + "= ");
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

	div.bgColor=ParamCtrl.ColorFonsPlana;

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
					alert(GetMessage("UseBrowserToolsPlaceOnView", "ctipica"));
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
								"fre": "Acceptez-vous de sauvegarder l'état de la carte? (Pour restaurer l'état d'origine, ajoutez à l'URL:"})+" \"?reset=1\")"))*/
					localStorage.setItem("EditedParamCtrl_"+ParamCtrl.config_json, JSON.stringify(ParamCtrl));
			}
			catch (e)
			{
			        ;//localStorage.removeItem(key);
				/*alert(DonaCadenaLang({"cat":"No ha estat possible guardar estat del map.",
							"spa":"No ha sido posible guardar el estado del mapa.",
							"eng":"Saving the map status done was not possible.",
							"fre":"Il n'a pas été possible de sauvegarder le statut de la carte."}));*/
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
	if (indexStoryMapActiu!==null)
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
		MouNivellDeZoomEvent(event, -Math.sign(event.deltaY), event.target.parentElement, (i_vista<ParamCtrl.VistaPermanent.length) ? NovaVistaPrincipal : null, event.clientX, event.clientY);
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