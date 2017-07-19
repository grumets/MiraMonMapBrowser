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

    Copyright 2001, 2016 Xavier Pons

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

function MoureASobreDeTot(i_capa)
{
	//he de baixar totes les capes que estan sobre i_capa una posició
	for(var i=0; i<i_capa; i++)
		ParamCtrl.capa[i].ordre=ParamCtrl.capa[i].ordre+1;
	ParamCtrl.capa[i_capa].ordre=0;
	ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
	CreaParamInternCtrlCapa();
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASobre(i_capa)
{
	while(true)
	{
		if(i_capa>0)
		{
			ParamCtrl.capa[i_capa].ordre--;
			ParamCtrl.capa[i_capa-1].ordre++;			
			if(!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(i_capa-1))
			{
				ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
				CreaParamInternCtrlCapa();
				i_capa--;
			}
			else
				break;
		}
	}
	//Caldrà fer alguna cosa amb els grups, capes no visibles a la llegenda en aquell moment,...
	ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
	CreaParamInternCtrlCapa();
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASota(i_capa)
{
	while(true)
	{
		if(i_capa<(ParamCtrl.capa.length-1))
		{
			ParamCtrl.capa[i_capa].ordre++;
			ParamCtrl.capa[i_capa+1].ordre--;
			if(!EsCapaVisibleAAquestNivellDeZoomOEnLlegenda(i_capa+1))
			{
				ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
				CreaParamInternCtrlCapa();
				i_capa++;
			}
			else
				break;
		}
	}

	//Caldrà fer alguna cosa amb els grups, capes no visibles a la llegenda en aquell moment,...
	ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
	CreaParamInternCtrlCapa();
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASotaDeTot(i_capa)
{
	//he de pujar totes les capes que estan sota i_capa una posició
	for(var i=ParamCtrl.capa.length-1; i>i_capa; i--)
		ParamCtrl.capa[i].ordre=ParamCtrl.capa[i].ordre-1;
	ParamCtrl.capa[i_capa].ordre=ParamCtrl.capa.length-1;

	ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
	CreaParamInternCtrlCapa()
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function AfegirCapa(i_capa)
{
	IniciaFinestraAfegeixCapaServidor(i_capa);	
}

function EsborrarCapa(i_capa)
{
	ParamCtrl.capa[i_capa].ordre=ParamCtrl.capa.length-1;
	if((i_capa+1)<ParamCtrl.capa.length)
	{
		for(var i=i_capa+1; i<ParamCtrl.capa.length; i++)
			ParamCtrl.capa[i].ordre=ParamCtrl.capa[i].ordre-1;
	}
	ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
	ParamCtrl.capa[ParamCtrl.capa.length-1]=null;
	ParamCtrl.capa.length--;
	CreaParamInternCtrlCapa()	
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
}

function TancaContextMenuCapa()
{	
	var elem=getLayer(this, "menuContextualCapa");
	hideLayer(elem);
}

function OmpleLayerContextMenuCapa(event, i)
{
var cdns=[];
var s;
	if ((ParamCtrl.BarraBotoAfegeixCapa && ParamCtrl.BarraBotoAfegeixCapa==true) || ParamCtrl.capa[i].ordre>0 || ParamCtrl.capa[i].ordre<(ParamCtrl.capa.length-1) || DonaCadena(ParamCtrl.capa[i].metadades))
	{
		cdns.push("<div class=\"MenuContextualCapa\">",
				  "<img align=\"right\" src=\"tanca_consulta.gif\" alt=\"",
					DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" onClick=\"TancaContextMenuCapa();\">",
				   "<div class=\"llistaMenuContext\">");
		if (ParamCtrl.BarraBotoAfegeixCapa && ParamCtrl.BarraBotoAfegeixCapa==true)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"AfegirCapa(", i, ");TancaContextMenuCapa();\">",
							DonaCadenaLang({"cat":"Afegir capa", "spa":"A&ntilde;adir capa", "eng":"Add layer", "fre":"Ajouter couche"}), "</a><br>",
							"<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"EsborrarCapa(", i,");TancaContextMenuCapa();\">",
							DonaCadenaLang({"cat":"Esborrar capa", "spa":"Borrar capa", "eng":"Delete layer", "fre":"Effacer couche"}), "</a>");
		}
		if (ParamCtrl.capa[i].ordre>0 || ParamCtrl.capa[i].ordre<(ParamCtrl.capa.length-1))
		{
			cdns.push("<hr><b><font color=\"#888888\">",
				  DonaCadenaLang({"cat":"Moure la capa", "spa":"Mover la capa", "eng":"Move layer", "fre":"Déplacer la couche"}), "</b><br>");
			if(ParamCtrl.capa[i].ordre>0)	
			{
				cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASobreDeTot(", i, ");TancaContextMenuCapa();\">",
						DonaCadenaLang({"cat":"A sobre de tot","spa":"Encima de todo", "eng":"To the top", "fre":"En haut de"}), "</a><br>",
						"<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASobre(", i,");TancaContextMenuCapa();\">",
						DonaCadenaLang({"cat":"A sobre","spa":"Encima", "eng":"Up", "fre":"Au-dessus"}), "</a>");
			}
			if(ParamCtrl.capa[i].ordre<(ParamCtrl.capa.length-1))
			{
				cdns.push("<br><a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASota(", i,");TancaContextMenuCapa();\">",
						  DonaCadenaLang({"cat":"A sota", "spa":"Debajo", "eng":"Down", "fre":"Au-dessous"}), "</a><br>",
						  "<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASotaDeTot(", i,");TancaContextMenuCapa();\">",
						  DonaCadenaLang({"cat":"A sota de tot", "spa":"Debajo de todo", "eng":"To the end", "fre":"En bas"}), "</a>");
			}		
		}
		cdns.push("<hr>");
		if (DonaCadena(ParamCtrl.capa[i].metadades))
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i,",-1);TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"metadades", "spa":"metadatos", "eng":"metadata", "fre":"métadonnées"}), "</a><br>");
		}
		if (ParamCtrl.capa[i].estil[ParamCtrl.capa[i].i_estil].component && ParamCtrl.capa[i].estil[ParamCtrl.capa[i].i_estil].component[0].histograma)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraHistograma(", i,");TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Histograma", "spa":"Histograma", "eng":"Histogram", "fre":"Histogramme"}), "</a>");
		}
		cdns.push("</div></div>");
		s=cdns.join("");
			
		//Crear la layer i mostrar-ho en la posició on s'ha fet el clic 
		//amb aquest contingut
		var elem=getLayer(this, "menuContextualCapa");
	
		if (isLayer(elem))
		{		
			var y;
			contentLayer(elem, s);
			
			var mida=event.screenY+10+parseInt(elem.style.height,10)+10; //li afegeixo 10 més de marge
			
			if(mida>=this.window.screen.height)
				y=event.clientY-10-parseInt(elem.style.height,10);
			else
				y=event.clientY+10;
			changePosAndShowLayer(elem, event.clientX, y);
		}
	}
}
	
function AfegirCapesAlNavegador(form, i_serv)
{
var i, j, k, i_capa, i_get_featureinfo, i_getmap;
var alguna_capa_afegida=false;
var estil;
var format;
var format_get_map;
var servidorGC=ServidorGetCapabilities[i_serv];
var i_on_afegir=servidorGC.i_capa_on_afegir;
	
	if(form==null)
		return;
	//Format de consulta comú per totes les capes
	i_get_featureinfo=-1;
	if(servidorGC.formatGetFeatureInfo)
	{
		for(j=0; j<servidorGC.formatGetFeatureInfo.length; j++)
		{
			if(servidorGC.formatGetFeatureInfo[j].search("text/xml"))
			{
				i_get_featureinfo=j;
				break;
			}
		}
		if(i_get_featureinfo==-1)
		{
			for(j=0; j<servidorGC.formatGetFeatureInfo.length; j++)
			{
				if(servidorGC.formatGetFeatureInfo[j].search("text/html"))
				{
					i_get_featureinfo=j;
					break;
				}
			}
		}
	}
	//Potser només tinc una capa al servidor, en aquest cap form.sel_capes no és un array i no puc fer sel_capes.length
	if(form.sel_capes.length!=null)
	{
		for(i=0; i<form.sel_capes.length; i++)
		{
			if(form.sel_capes[i].checked)  //Si la capa està seleccionada l'afegeix-ho al navegador
			{
				if(!alguna_capa_afegida)
					alguna_capa_afegida=true;
				i_capa=form.sel_capes[i].value;				
				format=eval("form.format_capa_"+i_capa);
				format_get_map=servidorGC.formatGetMap[format.options[format.selectedIndex].value];
				if(servidorGC.layer[i_capa].estil && servidorGC.layer[i_capa].estil.length>0)
				{
					estil = [];
					for(j=0; j<servidorGC.layer[i_capa].estil.length; j++)
					{
						/*estil[estil.length]=new CreaEstil(servidorGC.layer[i_capa].estil[j].nom,
											(servidorGC.layer[i_capa].estil[j].desc ?servidorGC.layer[i_capa].estil[j].desc: servidorGC.layer[i_capa].estil[j].nom),
												  null,
												  "I",
												  null,
												  null,
												  0);*/
						estil[estil.length]={"nom": servidorGC.layer[i_capa].estil[j].nom, "desc": (servidorGC.layer[i_capa].estil[j].desc ? servidorGC.layer[i_capa].estil[j].desc: servidorGC.layer[i_capa].estil[j].nom), "DescItems": null, "TipusObj": "I", "metadades": null, "ItemLleg": null, "ncol": 0};
					}
				}
				else
					estil=null;			
				if(servidorGC.layer[i_capa].CostatMinim && servidorGC.layer[i_capa].CostatMinim>=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat)	
					minim=servidorGC.layer[i_capa].CostatMinim;
				else
					minim=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
				if(servidorGC.layer[i_capa].CostatMaxim && servidorGC.layer[i_capa].CostatMaxim<=ParamCtrl.zoom[0].costat)	
					maxim=servidorGC.layer[i_capa].CostatMaxim;
				else
					maxim=ParamCtrl.zoom[0].costat;
								
				if(i_on_afegir==-1)
					k=ParamCtrl.capa.length;
				else
				{
					for(k=i_on_afegir; k<ParamCtrl.capa.length; k++)
						ParamCtrl.capa[k].ordre=ParamCtrl.capa[k].ordre+1;
					k=i_on_afegir;				
				}
												
				ParamCtrl.capa[ParamCtrl.capa.length]={"ordre": k,
									"servidor": servidorGC.servidor, 
									"versio": servidorGC.versio, 
									"tipus": servidorGC.tipus, 
									"nom": servidorGC.layer[i_capa].nom,
									"desc": servidorGC.layer[i_capa].desc,
									"CRS": [ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS],
									"FormatImatge": format_get_map,
									"transparencia": (format_get_map=="image/jpeg") ? "opac" : "transparent",
									"CostatMinim": minim,	
									"CostatMaxim": maxim,	
									"FormatConsulta": (i_get_featureinfo==-1 ? null :servidorGC.formatGetFeatureInfo[i_get_featureinfo]), 
									"DescLlegenda": (servidorGC.layer[i_capa].desc ? servidorGC.layer[i_capa].desc : servidorGC.layer[i_capa].nom),
									"estil": estil, 
									"i_estil": 0,
									"NColEstil": (estil && estil.length>0) ? 1: 0,
									"LlegDesplegada": false, 
									"VisibleALaLlegenda": true, 
									"visible": "si", 
									"consultable": (i_get_featureinfo!=-1 && servidorGC.layer[i_capa].consultable)? "si" : "no",
									"descarregable": "no", 
									"FlagsData": servidorGC.layer[i_capa].FlagsData, 
									"data": servidorGC.layer[i_capa].data, 
									"i_data": servidorGC.layer[i_capa].i_data, 
									"animable": (servidorGC.layer[i_capa].data)? true: false, 
									"AnimableMultiTime": (servidorGC.layer[i_capa].data)? true:false};

				if (ParamCtrl.LlegendaAmagaSegonsEscala && ParamCtrl.LlegendaAmagaSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(ParamCtrl.capa[ParamCtrl.capa.length-1]))
					   alert(DonaCadenaLang({"cat":"La nova capa afegida, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' no és visible al nivell de zoom actual del navegador",
										 "spa":"La nueva capa añadida, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' no es visible al nivel de zoom actual del navegador",
										 "eng":"The new layer added, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' is not visible in the current zoom level of the browser",
										 "fre":"La nouvelle couche ajoutée, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' n'est pas visible au niveau du zoom actuel du navigateur"}));
				if(i_on_afegir!=-1)
				{
					ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
					i_on_afegir++;
				}				
			}
		}
	}
	else
	{
		if(form.sel_capes.checked)  //Si la capa està seleccionada l'afegeix-ho al navegador
		{
			if(!alguna_capa_afegida)
				alguna_capa_afegida=true;
			i_capa=form.sel_capes.value;				
			format=eval("form.format_capa_"+i_capa);
			format_get_map=servidorGC.formatGetMap[format.options[format.selectedIndex].value];
			if(servidorGC.layer[i_capa].estil && servidorGC.layer[i_capa].estil.length>0)
			{
				estil = [];
				for(j=0; j<servidorGC.layer[i_capa].estil.length; j++)
				{
					estil[estil.length]=new CreaEstil(servidorGC.layer[i_capa].estil[j].nom,
											(servidorGC.layer[i_capa].estil[j].desc ?servidorGC.layer[i_capa].estil[j].desc: servidorGC.layer[i_capa].estil[j].nom),
											  null,
											  "I",
											  null,
											  null,
											  0);					
				}
			}
			else
				estil=null;			
			if(servidorGC.layer[i_capa].CostatMinim && servidorGC.layer[i_capa].CostatMinim>=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat)	
				minim=servidorGC.layer[i_capa].CostatMinim;
			else
				minim=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
			if(servidorGC.layer[i_capa].CostatMaxim && servidorGC.layer[i_capa].CostatMaxim<=ParamCtrl.zoom[0].costat)	
				maxim=servidorGC.layer[i_capa].CostatMaxim;
			else
				maxim=ParamCtrl.zoom[0].costat;
			
			if(i_on_afegir==-1)
				k=ParamCtrl.capa.length;
			else
			{
				for(k=i_on_afegir; k<ParamCtrl.capa.length; k++)
					ParamCtrl.capa[k].ordre=ParamCtrl.capa[k].ordre+1;
				k=i_on_afegir;				
			}
				
			ParamCtrl.capa[ParamCtrl.capa.length]={"ordre": k,
									"servidor": servidorGC.servidor, 
									"versio": servidorGC.versio, 
									"tipus": servidorGC.tipus, 
									"nom": servidorGC.layer[i_capa].nom,
									"desc": servidorGC.layer[i_capa].desc,
									"CRS": [ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS],
									"FormatImatge": format_get_map,
									"transparencia": (format_get_map=="image/jpeg") ? "opac" : "transparent",
									"CostatMinim": minim,	
									"CostatMaxim": maxim,	
									"FormatConsulta": (i_get_featureinfo==-1 ? null :servidorGC.formatGetFeatureInfo[i_get_featureinfo]), 
									"DescLlegenda": (servidorGC.layer[i_capa].desc ? servidorGC.layer[i_capa].desc : servidorGC.layer[i_capa].nom),
									"estil": estil, 
									"i_estil": 0,
									"NColEstil": (estil && estil.length>0) ? 1: 0,  
									"LlegDesplegada": false, 
									"VisibleALaLlegenda": true, 
									"visible": "si", 
									"consultable": (i_get_featureinfo!=-1 && servidorGC.layer[i_capa].consultable)? "si" : "no",
									"descarregable": "no", 
									"FlagsData": servidorGC.layer[i_capa].FlagsData, 
									"data": servidorGC.layer[i_capa].data, 
									"i_data": servidorGC.layer[i_capa].i_data, 
									"animable": (servidorGC.layer[i_capa].data)? true: false, 
									"AnimableMultiTime": (servidorGC.layer[i_capa].data)? true:false};

			if (ParamCtrl.LlegendaAmagaSegonsEscala && ParamCtrl.LlegendaAmagaSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(ParamCtrl.capa[ParamCtrl.capa.length-1]))
					   alert(DonaCadenaLang({"cat":"La nova capa afegida, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' no és visible al nivell de zoom actual del navegador",
										 "spa":"La nueva capa añadida, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' no es visible al nivel de zoom actual del navegador",
										 "eng":"The new layer added, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' is not visible in the current zoom level of the browser",
										"fre":"La nouvelle couche ajoutée, \'"+ParamCtrl.capa[ParamCtrl.capa.length-1].nom+"\' n'est pas visible au niveau du zoom actuel du navigateur"}));
			if(i_on_afegir!=-1)
			{
				ParamCtrl.capa.sort(OrdenaOrdreVisualitzacio);
				i_on_afegir++;
			}			
		}
	}
	if(alguna_capa_afegida)
	{
		/*Si s'ha afegit alguna capa de servidor extern, relaxo les 
                limitacions d'àmbit de navegació per poder-me sortir del mapa 
		de situació. En realitat, el que voldria programar és que si la
                capa que afegixo se surt del àmbit "relaxo" però si no, doncs no
		però no sembla que NJ llegeixi l'àmbit de la capa i per això 
		decideixo fer-ho més general*/
		ParamCtrl.RelaxaAmbitVisualitzacio=true;
                //Redibuixo el navegador perquè les noves capes siguin visibles
		CreaParamInternCtrlCapa();
		RevisaEstatsCapes();
		CreaLlegenda();
		RepintaMapesIVistes();
	}
}//Fi de AfegirCapesAlNavegador


function TancaFinestra_afegirCapa()
{
	hideFinestraLayer(this, "afegirCapa");
}//Fi de TancaFinestra_afegirCapa()

function SeleccionaTotesLesCapesDelServidor(form)
{
var i;

	if(form.sel_capes.length!=null)
	{
		if(form.seltotes_capes.checked=="1") //Seleccionar totes les capes
		{
			for(i=0; i<form.sel_capes.length; i++)
				form.sel_capes[i].checked=true;
		}
		else //Deseleccionar totes les capes
		{
			for(i=0; i<form.sel_capes.length; i++)
				form.sel_capes[i].checked=false;
		}
	}
	else
	{
		if(form.seltotes_capes.checked=="1") //Seleccionar totes les capes
		{
			form.sel_capes.checked=true;
		}
		else //Deseleccionar totes les capes
		{
			form.sel_capes.checked=false;
		}
	}
}


var ajaxGetCapabilities=[];
var ServidorGetCapabilities=[];

function CreaServidorGetCapabilities(servidor, win, index, i_capa)
{	
	this.win=win;
	this.index=index;
	this.i_capa_on_afegir=i_capa;
	this.servidor=servidor;
	this.versio=null;
	this.tipus="TipusWMS";
	this.titol=null;
	this.formatGetMap=[];
	this.formatGetFeatureInfo=[];
	this.layer=[];
}

function CreaCapaServidor()
{
	this.nom = null;
	this.desc = null;
	this.CostatMinim = null;
	this.CostatMaxim = null;	
	this.consultable = false;
	this.estil = [];
	this.FlagsData=null;
	this.i_data=0;
	this.data=null;
}

function LlegeixLayer(servidorGC, node, sistema_ref_comu, pare)
{
var i, j;	
var node2;
var trobat=false;
var cadena, cadena2;
var minim, maxim;
var factor_k, factorpixel;
	
	//Llegeixo les capacitats d'aquesta capa
	//Començo pel sistema de referència
	//versió 1.0.0, 1.1.0 i 1.1.1 en l'estil antic --> un únic element amb els diversos sistemes de referència separats per espais (SRS)
    //versió 1.1.1 en l'estil nou--> un element per cada sistema de referència (SRS)
	//versió major a 1.1.1 --> un element per cada sistema de referència (CRS)	
	
	
	if(DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)=="°")
	{
		factor_k=120000*1000/0.28;  //pas de graus a mm dividit per la mida de píxel
		factorpixel=120000; // de graus a metres
	}
	else //if(unitats=="m")
	{
		factor_k=1000/0.28;  // pas de m a mm dividit per la mida de píxel
		factorpixel=1; //de m a m
	}

	//Això no ho puc usar perquè em dona els elements SRS de node i dels seus fills node.getElementsByTagName('SRS');	 
	for(i=0; i<node.childNodes.length; i++)
	{
		node2=node.childNodes[i];
		if(node2.nodeName=="SRS" || node2.nodeName=="CRS")
		{
			cadena=node2.childNodes[0].nodeValue;
			if(cadena)
			{
				cadena=cadena.toUpperCase();
				cadena2=ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS.toUpperCase();
				if(cadena.search(cadena2)!=-1)
				{
					//·$·Aqui s'haurà de fer alguna cosa amb els sinònims,...
					trobat=true;
					break;
				}
			}
		}
	}
	if(trobat || sistema_ref_comu)
	{
		for(i=0; i<node.childNodes.length; i++)
		{
			node2=node.childNodes[i];
			if(node2.nodeName=="Name")
			{
				//Llegeix-ho la capa si té name
				servidorGC.layer[servidorGC.layer.length]=new CreaCapaServidor();				
				servidorGC.layer[servidorGC.layer.length-1].nom=node2.childNodes[0].nodeValue;
				//hereto les coses del pare
				if(pare)
				{
					if(pare.consultable) 
						servidorGC.layer[servidorGC.layer.length-1].consultable=true;
					if(pare.estil)
					{
						for(j=0; j<pare.estil.length; j++)
							servidorGC.layer[servidorGC.layer.length-1].estil[servidorGC.layer[servidorGC.layer.length-1].estil.length]=pare.estil[j];
					}
					servidorGC.layer[servidorGC.layer.length-1].CostatMinim=pare.CostatMinim;
					servidorGC.layer[servidorGC.layer.length-1].CostatMaxim=pare.CostatMaxim;
				}
				break;
			}
		}

		if(i<node.childNodes.length)  //vol dir que aquesta capa té name
		{
			var temps_defecte=null, valors_temps=null;
			for(i=0; i<node.childNodes.length; i++)
			{
				node2=node.childNodes[i];

				if(node2.nodeName=="Title")
				{
					servidorGC.layer[servidorGC.layer.length-1].desc=node2.childNodes[0].nodeValue;
				}
				else if(node2.nodeName=="Style")
				{
					node3=node2.getElementsByTagName('Name');
					if(node3 && node3.length>0)
					{
						cadena=node3[0].childNodes[0].nodeValue;
						node3=node2.getElementsByTagName('Title');
						if(node3 && node3.length>0)
							cadena2=node3[0].childNodes[0].nodeValue;
						servidorGC.layer[servidorGC.layer.length-1].estil[servidorGC.layer[servidorGC.layer.length-1].estil.length]={"nom": cadena, "desc": cadena2};
					}
				}
				else if(node2.nodeName=="ScaleHint")
				{
					minim=parseInt(node2.getAttribute('min'),10);
					maxim=parseInt(node2.getAttribute('max'),10);
					if(minim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMinim=minim/Math.SQRT2;
					if(maxim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMaxim=maxim/Math.SQRT2;
				}
				else if(node2.nodeName=="MinScaleDenominator")
				{
					minim=parseInt(node2.childNodes[0].nodeValue, 10);				
					if(minim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMinim=minim*factorpixel/factor_k;
				}
				else if(node2.nodeName=="MaxScaleDenominator")
				{
					maxim=parseInt(node2.childNodes[0].nodeValue, 10);
					if(maxim)
						servidorGC.layer[servidorGC.layer.length-1].CostatMaxim=maxim*factorpixel/factor_k;
				}
				else if ((node2.nodeName=="Dimension" || node2.nodeName=="Extent") && node2.getAttribute('name').toLowerCase()=='time')
				{
					temps_defecte=node2.getAttribute('default');
					if(node2.childNodes.length>0)
						valors_temps=node2.childNodes[0].nodeValue;
				}
			}	
			//Miro si és consultable
			if(node.getAttribute('queryable')=='1') 
			{
				servidorGC.layer[servidorGC.layer.length-1].consultable=true;			
			}
			if(valors_temps!=null)
			{
				if(valors_temps.search("/")==-1)  //Si és un interval (!=-1) de moment no li dono suport ·$·
				{
					var data_defecte=null;
					var dates;
					//És una capa multitemporal
					//valors_temps és una cadena que pot contenir un únic valor, una llista de valors separats per coma o un interval amb període
					//yyyy-mm-ddThh:mm:ss.sssZ
					if(temps_defecte)
					{
						var data_defecte;
						OmpleDateAPartirDeDataISO8601(data_defecte, temps_defecte);
					}
					servidorGC.layer[servidorGC.layer.length-1].data=[];			
					dates=valors_temps.split(",");
					for(i=0; i<dates.length; i++)
					{
						//servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length]=new Date();
						if(i==0)
						{
							servidorGC.layer[servidorGC.layer.length-1].FlagsData=OmpleDateAPartirDeDataISO8601(
														servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length],
														dates[i]);
						}
						else
							OmpleDateAPartirDeDataISO8601(servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length],
														dates[i]);
						if(data_defecte &&
						   servidorGC.layer[servidorGC.layer.length-1].data[servidorGC.layer[servidorGC.layer.length-1].data.length-1]==data_defecte)
							servidorGC.layer[servidorGC.layer.length-1].i_data=servidorGC.layer[servidorGC.layer.length-1].data.length-1;
					}
				}
			}
		}
	}	
	
	//Si aquesta layer té fills continuo llegint
	node2=node.getElementsByTagName('Layer');	
	if(node2)
	{
		var pare2=servidorGC.layer[servidorGC.layer.length-1];
		for(i=0; i<node2.length; i++)
			LlegeixLayer(servidorGC, node2[i], trobat, pare2);
	}		
}//Fi de LlegeixLayer()

function HiHaAlgunErrorDeParsejat(doc)
{
	if (doc.parseError && doc.parseError.errorCode != 0)
    {
	    alert("Error in line " + doc.parseError.line +
				" position " + doc.parseError.linePos +
				"\nError Code: " + doc.parseError.errorCode +
				"\nError Reason: " + doc.parseError.reason +
				"Error Line: " + doc.parseError.srcText);
	    return true;
    }
	else if (doc.documentElement.nodeName=="parsererror")
	{
		var errStr=doc.documentElement.childNodes[0].nodeValue;
		errStr=errStr.replace(/</g, "&lt;");
		alert(errStr);
		return true;
	}
	return false;
}

function ParsejaRespostaGetCapabilities(doc, servidorGC)
{
var root;
var cadena;
var node, node2;
var i;
var cdns=[];
	
	if(!doc) 
	{
		alert(DonaCadenaLang({"cat":"No s'ha obtingut cap resposta vàlida del servidor sol·licitat", 
						  "spa":"No se ha obtenido ninguna respuesta válida del servidor solicitado",
						  "eng":"Cannot obtain any valid response of server",
						  "fre":"Aucune réponse valide a été obtenue depuis le serveur sollicité"}));
		return;	
	}
	if(HiHaAlgunErrorDeParsejat(doc))
		return;
	root=doc.documentElement;		
	if(!root) 
	{
		alert(DonaCadenaLang({"cat":"No s'ha obtingut cap resposta vàlida del servidor sol·licitat", 
						  "spa":"No se ha obtenido ninguna respuesta válida del servidor solicitado",
						  "eng":"Cannot obtain any valid response of server",
						  "fre":"Aucune réponse valide a été obtenue depuis le serveur sollicité"}));
		return;
	}

	//Cal comprovar que és un document de capacitats, potser és un error, en aquest cas el llegeix-ho i el mostraré directament
	if(root.nodeName!="WMT_MS_Capabilities")
	{
		alert(DonaCadenaLang({"cat":"No s'ha obtingut cap resposta vàlida del servidor sol·licitat", 
						  "spa":"No se ha obtenido ninguna respuesta válida del servidor solicitado",
						  "eng":"Cannot obtain any valid response of server",
						  "fre":"Aucune réponse valide a été obtenue depuis le serveur sollicité"}));
		//·$· mirar de possar el que ens ha retornat el servidor
		return;
	}
	
	//Obtinc la versió de les capacitats
	cadena=root.getAttribute('version');	
	servidorGC.versio={"Vers": parseInt(cadena.substr(0,1),10), "SubVers": parseInt(cadena.substr(2,1),10), "VariantVers": parseInt(cadena.substr(4),10)};
	
	//Obtinc el títol del servidor, és obligatòri però podria ser que algun servidor posses el tag sense valor
	servidorGC.titol="";
	node=root.getElementsByTagName('Service')[0];	
	if(node)
	{
		node2=node.getElementsByTagName('Title')[0];
		if(node2 && node2.hasChildNodes())	
			servidorGC.titol=node2.childNodes[0].nodeValue;
	}
	
	//Selecciono el node request
	node=(root.getElementsByTagName('Capability')[0]).getElementsByTagName('Request')[0];
	
	//Formats de visualització
	if(servidorGC.versio.Vers==1 && servidorGC.versio.SubVers==0)
	{
		node2=(node.getElementsByTagName('Map')[0]).getElementsByTagName('Format');
		for(i=0; i<node2[0].childNodes.length; i++)
		{
			cadena=node2[0].childNodes[i].nodeName;
			if(cadena.search(/JPEG/i)!=-1)
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/jpeg";
			else if(cadena.search(/GIF/i)!=-1)
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/gif";
			else if(cadena.search(/PNG/i)!=-1)
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]="image/png";
		}
	}
    else
	{
		node2=(node.getElementsByTagName('GetMap')[0]).getElementsByTagName('Format');
		for(i=0; i<node2.length; i++)
		{
			cadena=node2[i].childNodes[0].nodeValue;
			if(cadena)
				servidorGC.formatGetMap[servidorGC.formatGetMap.length]=cadena;		
		}
	}
	
	//Formats de consulta
	if(servidorGC.versio.Vers==1 && servidorGC.versio.SubVers==0)
	{
		node2=node.getElementsByTagName('FeatureInfo')[0];
		if(node2)
		{
			node2=node2.getElementsByTagName('Format');
			for(i=0; i<node2[0].childNodes.length; i++)
			{
				cadena=node2[0].childNodes[i].nodeName;
				if(cadena)
				{
					if(cadena.search(/XML/i)!=-1)
						servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]="text/xml";
					else if(cadena.search(/HTML/i)!=-1)
						servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]="text/html";
				}
			}
		}
	}
    else
	{
		node2=node.getElementsByTagName('GetFeatureInfo')[0];
		if(node2)
		{
			node2=node2.getElementsByTagName('Format');
			for(i=0; i<node2.length; i++)
			{
				cadena=node2[i].childNodes[0].nodeValue;
				if(cadena)
					servidorGC.formatGetFeatureInfo[servidorGC.formatGetFeatureInfo.length]=cadena;
			}
		}
	}
		
	//Llegeix-ho les capes disponibles en el sistema de referència actual del navegador
	node=root.getElementsByTagName('Capability')[0];
	for(i=0; i<node.childNodes.length; i++)
	{
		node2=node.childNodes[i];
		if(node2.nodeName=="Layer")  //És una layer que a dins pot tenir altres layers
		{
			//Si té name vol dir que és una capa de veritat, sinó és que és una capa d'agrupació
			LlegeixLayer(servidorGC, node2, false, null);
		}
	}
	if(servidorGC.layer.length>0)
	{
		cdns.push("<form name=\"AfegeixCapaServidor\">",
				"<div id=\"LayerAfegeixCapaServidor\" class=\"LayerAfegeixCapaServidor\" style=\"position:absolute;left:10px;top:10px;\">",
			  	"<span class=\"Verdana11px\"><b>",
			  	DonaCadenaLang({"cat":"URL del servidor:", "spa":"URL del servidor:", "eng":"server URL:", "fre":"URL du serveur:"}),			  
			  	"</b></span><br><input type=\"text\" name=\"servidor\" readOnly class=\"input_url\" value=\"",
			  	servidorGC.servidor, "\">",
				  "<br><br><span class=\"Verdana11px\"><b>",
				  DonaCadenaLang({"cat":"T&iacute;tol", "spa":"T&iacute;tulo", "eng":"Title", "fre":"Titre"}),
				  "</b><br></span><input type=\"text\" name=\"TitolServidor\" class=\"input_url\"");
		if(servidorGC.titol)
	  		cdns.push(" value=\"",servidorGC.titol, "\"");
		cdns.push("><br><br><hr><br><div class=\"layerselectorcapesafegir\">",
				  "<span class=\"Verdana11px\"><b>",DonaCadenaLang({"cat":"Capes","spa":"Capas","eng":"Layers","fre":"Couches"}),"</b><br>",
				  "<input name=\"seltotes_capes\" onclick=\"SeleccionaTotesLesCapesDelServidor(form);\" type=\"checkbox\">", 
				  DonaCadenaLang({"cat":"Seleccionar totes les capes", "spa":"Seleccionar todas las capas", "eng":"Select all layers", "fre":"Sélectionner toutes les couches"}), "<br><br><table class=\"Verdana11px\">");
		for(i=0; i<servidorGC.layer.length; i++)
		{
			cdns.push("<tr><td><input name=\"sel_capes\" value=\"", i, "\" type=\"checkbox\">", 
					(servidorGC.layer[i].desc? servidorGC.layer[i].desc : servidorGC.layer[i].nom));
			cdns.push("</td><td><select name=\"format_capa_", i, "\" class=\"Verdana11px\">");
			for(j=0; j<servidorGC.formatGetMap.length; j++)
				cdns.push("<option value=\"", j, "\">",  servidorGC.formatGetMap[j]);
			cdns.push("</select></td></tr>");
		}
		cdns.push("</table></div><br>",
				  "<input type=\"button\" class=\"Verdana11px\" value=\"",				
				  DonaCadenaLang({"cat":"Afegir\"", "spa":"A&ntilde;adir\"", "eng":"Add\"", "fre":"Ajouter\""}), 
				  " onClick=\"AfegirCapesAlNavegador(form, ",servidorGC.index,");TancaFinestra_afegirCapa();\">",
				  "<input type=\"button\" class=\"Verdana11px\" value=\"",				
				  DonaCadenaLang({"cat":"Cancel·lar\"", "spa":"Cancelar\"", "eng":"Cancel\"", "fre":"Annuler\""}), 
				  " onClick=\"TancaFinestra_afegirCapa();\">",				  
				  "</div></form>");
		cadena=cdns.join("");
		
		if (isFinestraLayer(servidorGC.win, "afegirCapa"))
		{
			showFinestraLayer(servidorGC.win, "afegirCapa");
			var elem=getLayer(servidorGC.win, "afegirCapa_finestra");
			contentLayer(elem, cadena);
		}
	}
	else
	{
		alert(DonaCadenaLang({"cat":"Aquest servidor no té cap capa disponible en el sistema de referència actual del navegador",
						  "spa":"Este servidor no tiene ninguna capa disponible en el sistema de referéncia actual del navegador",
						  "eng":"This server don't have any layer in the browser actual reference system",
						  "fre":"Ce serveur n'a aucune couche disponible dans le système de référence actuel du navigateur"}));
	}
}//Fi de ParsejaRespostaGetCapabilities()

function FesPeticioCapacitatsIParsejaResposta(form, i_capa)
{
var servidor=form.servidor.value;
var request;
	
	if(servidor)
		servidor=DonaCadenaSenseEspaisDavantDarrera(servidor);
	
	if(!servidor || servidor=="")
	{
		
		//·$· Crec que caldria mirar més a fons que l'adreça sigui vàlida
		alert(DonaCadenaLang({"cat":"Cal indicar una adreça vàlida", 
							 "spa":"Se debe indicar una dirección válida", 
							 "eng":"Its necessary indicated a valid URL", 
							 "fre":"Vous devez indiquer une adresse valide"}));
		return;
	}
	ajaxGetCapabilities[ajaxGetCapabilities.length]=new Ajax();
	var i=ServidorGetCapabilities.length;
	ServidorGetCapabilities[ServidorGetCapabilities.length]=new CreaServidorGetCapabilities(servidor, this, i, i_capa);
	
	
	request=AfegeixNomServidorARequest(servidor, "REQUEST=GetCapabilities&VERSION=1.1.0&SERVICE=WMS", true);
	ajaxGetCapabilities[ajaxGetCapabilities.length-1].doGet(request, 															
															ParsejaRespostaGetCapabilities, "text/xml", 
															ServidorGetCapabilities[ServidorGetCapabilities.length-1]);		
}//Fi de FesPeticioCapacitatsIParsejaResposta


function ActualitzaLlistaServSegonsCategoriaSel(form)
{
var nova_opcio;
var i, j;

	var categoria_sel=form.llista_cat_serveis_OWS.options[form.llista_cat_serveis_OWS.selectedIndex].value;
	DonaCadena(LlistaServOWS[0].categoria.desc).toLowerCase();
	form.llista_serveis_OWS.options.length=0;
	i=0;
	while( i<LlistaServOWS.length && categoria_sel!=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
		i++;
	j=0;
	form.llista_serveis_OWS.options[j]=new Option(DonaCadenaLang({"cat":"--Seleccciona'n un de la llista--", "spa":"--Escoja uno de la lista--","eng": "--Choose one from list--", "fre":"--Sélectionnez un objet de la liste--"}), "");
	j++;	
	while(i<LlistaServOWS.length && categoria_sel==DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
	{
		form.llista_serveis_OWS.options[j]=new Option(DonaCadena(LlistaServOWS[i].nom), LlistaServOWS[i].url);
		j++;
		i++;		
	}

}

function MostraServidorSeleccionatDeLlistaOWSAEdit(form)
{
var url_a_mostrar;
	if(form.llista_serveis_OWS.selectedIndex>0)
		url_a_mostrar=form.llista_serveis_OWS.options[form.llista_serveis_OWS.selectedIndex].value;
	if(url_a_mostrar)
		form.servidor.value=url_a_mostrar;
}

function OrdenacioServOWSPerCategoriaINom(a,b) {
	//Ascendent per identificador i descendent per data
    var x = DonaCadena(a.categoria.desc);
    var y = DonaCadena(b.categoria.desc);
	
	//podria ser que en un dels idiomes no estigués indicat
	if(x==null && y==null)
		return 0;
	if(x==null)
		return -1;
	if(y==null)
		return 1;
	
	x = x.toLowerCase();
    y = y.toLowerCase();

	if(x < y) 
		return -1;
	if(x > y) 
		return 1;

	//Si són iguals ho ordeno pel nom
	x = DonaCadena(a.nom);
    y = DonaCadena(b.nom);
	if(x==null && y==null)
		return 0;
	if(x==null)
		return -1;
	if(y==null)
		return 1;
	
	x = x.toLowerCase();
    y = y.toLowerCase();

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function PreparaLlistaServidorsOWS()
{
	if (!LlistaServOWS)
		return;
	for(var i=0; i<LlistaServOWS.length; i++)
	{
		if(!LlistaServOWS[i].categoria || DonaCadena(LlistaServOWS[i].categoria.desc)==null)
			LlistaServOWS[i].categoria={"nom": "Altres", "desc": {"cat": "ZZAltresZZ", "spa": "ZZOtrosZZ", "eng": "ZZOthersZZ", "fre": "ZZAutresZZ"}};
	}
	LlistaServOWS.sort(OrdenacioServOWSPerCategoriaINom);
}


function DonaCadenaAfegeixCapaServidor(elem, url, i_capa, tanca_div)
{
var cdns=[];
var i;

	cdns.push("<div id=\"LayerAfegeixCapaServidor\" class=\"LayerAfegeixCapaServidor\" style=\"position:absolute;left:10px;top:10px;\">",
			  "<span class=\"Verdana11px\">",
			  DonaCadenaLang({"cat":"Especifica l'adreça URL del servidor:", "spa":"Especifique la dirección URL del servidor:", "eng":"Specify the server URL:", "fre":"Spécifiez l'adresse URL du serveur:"}),			  
			  "</span><br><input type=\"text\" name=\"servidor\" class=\"input_url\" value=\"",
			  (url ? url: "http://"), "\">",
			  "<input type=\"button\" class=\"Verdana11px\" value=\"",				
	     	  DonaCadenaLang({"cat":"Acceptar\"", "spa":"Aceptar\"", "eng":"OK\"", "fre":"Accepter\""}), 
	          " onClick=\"FesPeticioCapacitatsIParsejaResposta(AfegeixCapaServidor,",i_capa,");\">");
	if(LlistaServOWS && LlistaServOWS.length)
	{
		cdns.push("<br><br><span class=\"Verdana11px\">",
				  DonaCadenaLang({"cat":"o Seleccciona'n un de la llista de serveis", "spa":"o Escoja uno de la lista de servicios", "eng":"or Choose one from service list", "fre":"ou sélectionnez un des services de la liste"}),
				  "</span><br>",				  
				  "<select name=\"llista_cat_serveis_OWS\" id=\"llista_cat_serveis_OWS\" class=\"Verdana11px\"",
				  " onChange=\"ActualitzaLlistaServSegonsCategoriaSel(form);\">");
		var categoria_previa="";
		for(i=0;i<LlistaServOWS.length; i++)
		{
			if(categoria_previa!=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
			{
				categoria_previa=DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase();
				if(categoria_previa==DonaCadenaLang({"cat":"ZZAltresZZ", "spa":"ZZOtrosZZ", "eng":"ZZOthersZZ", "fre":"ZZAutresZZ"}).toLowerCase())
					cdns.push("<option value=\"", categoria_previa, "\">",  DonaCadenaLang({"cat":"Altres", "spa":"Otros", "eng":"Others", "fre":"Autres"}));																		
				else
					cdns.push("<option value=\"", categoria_previa, "\">",  DonaCadena(LlistaServOWS[i].categoria.desc));																		
			}
		}
		cdns.push("</select><br><br>",
   		  		  "<select name=\"llista_serveis_OWS\" id=\"llista_serveis_OWS\" class=\"Verdana11px\"",
				  " onChange=\"MostraServidorSeleccionatDeLlistaOWSAEdit(form);\">");
		var categoria_sel=DonaCadena(LlistaServOWS[0].categoria.desc).toLowerCase();
		i=0;
		cdns.push("<option value=\"\">",  DonaCadenaLang({"cat":"--Seleccciona'n un de la llista--", "spa":"--Escoja uno de la lista--","eng": "--Choose one from list--", "fre":"--Sélectionnez un des objets de la liste--"}));
		while(categoria_sel==DonaCadena(LlistaServOWS[i].categoria.desc).toLowerCase())
		{
			cdns.push("<option value=\"", LlistaServOWS[i].url, "\">",  DonaCadena(LlistaServOWS[i].nom));
			i++;
		}
		cdns.push("</select>");
	}
	if(tanca_div)
		cdns.push("</div>");
	return cdns.join("");
}

function FinestraAfegeixCapaServidor(elem, i_capa)
{
var cdns=[];
var s;

	cdns.push("<form name=\"AfegeixCapaServidor\">");
	cdns.push(DonaCadenaAfegeixCapaServidor(elem, null, i_capa, true));
	cdns.push("</form>");
	s=cdns.join("");
	contentLayer(elem, s);

}

function IniciaFinestraAfegeixCapaServidor(i_capa)
{
	if (isFinestraLayer(this, "afegirCapa"))
	{
		PreparaLlistaServidorsOWS();
		showFinestraLayer(this, "afegirCapa");
		var elem=getLayer(this, "afegirCapa_finestra");
		FinestraAfegeixCapaServidor(elem, i_capa);		
	}
	else  //missatge error
	{
		alert(DonaCadenaLang({"cat":"No s'ha definit la layer de tipus finestra 'afegirCapa' i per tant no es pot usar la funcionalitat d'afegir capes al navegador",
						  "spa":"No se ha definido la layer de tipo ventana 'afegirCapa' y en consecuencia no se puede usar la funcionalidad de añadir capas al navegador",
						  "eng":"The layer 'afegirCapa' don't has defined and its not possible use the funcionality add layer to browser",
						  "fre":"La layer de type fenêtre 'afegirCapa' n'a été pas définie et il n'est donc pas possible d'utilise l'outil pour ajouter des couches au navigateur"}));						  
	}
	
}
