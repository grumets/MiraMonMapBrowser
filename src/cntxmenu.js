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
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(1, 0, i_capa);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length, ParamCtrl.capa.length);

	ParamCtrl.capa.splice(0, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASobre(i_capa)
{
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(1, i_capa-1);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+i_capa-1, ParamCtrl.capa.length);

	ParamCtrl.capa.splice(i_capa-1, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	//Caldrà fer alguna cosa amb els grups, capes no visibles a la llegenda en aquell moment,...
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASota(i_capa)
{
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1);
	CanviaIndexosCapesSpliceCapa(-ParamCtrl.capa.length+i_capa+1, ParamCtrl.capa.length);

	ParamCtrl.capa.splice(i_capa+1, 0, ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

function MoureASotaDeTot(i_capa)
{
	//He de pujar totes les capes que estan sota i_capa una posició
	CanviaIndexosCapesSpliceCapa(ParamCtrl.capa.length-i_capa, i_capa);  //els moc fora de rang per no barrejar-los amb els nous
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, ParamCtrl.capa.length+1);

	ParamCtrl.capa.push(ParamCtrl.capa.splice(i_capa, 1)[0]);

	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
	return;
}

/*function AfegirCapa(i_capa)
{
	IniciaFinestraAfegeixCapaServidor(i_capa);
}*/

function EsborrarCapa(i_capa)
{
	if (AvisaDeCapaAmbIndexosACapaEsborrada(i_capa)==false)
		return;
	CanviaIndexosCapesSpliceCapa(-1, i_capa+1, ParamCtrl.capa.length);  //els moc fora de rang per no barrejar-los amb els nous
	ParamCtrl.capa.splice(i_capa, 1);
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
}

function TancaContextMenuCapa()
{	
	var elem=getLayer(this, "menuContextualCapa");
	hideLayer(elem);
}

function MouLayerContextMenuCapa(event, s)
{
	//Crear la layer i mostrar-ho en la posició on s'ha fet el clic amb aquest contingut	
	var menu=getLayer(this, "menuContextualCapa");
		
	if (isLayer(menu))
	{		
		var y;

		contentLayer(menu, s);
		var menu_marc=getLayer(this, "menuContextualCapa-contingut");
		var menu_text=getLayer(this, "menuContextualCapa-text");
			
		var rec=getRectLayer(getLayer(this, "menuContextualCapa-text"));
			
		var mida=event.clientY+((this.document.body.scrollTop) ? this.document.body.scrollTop : 0)+parseInt(rec.alt);
			
		var rec_naveg=getRectLayer(this.document.body);
		if(mida>=rec_naveg.alt)
			y=event.clientY-parseInt(rec.alt);
		else
			y=event.clientY+5;
		changePosAndShowLayer(menu, event.clientX, y);
		moveLayer(menu_marc, event.clientX, y, rec.ample, rec.alt);
	}
}

function OmpleLayerContextMenuEstil(event, i_capa, i_estil)
{
var cdns=[];
capa=ParamCtrl.capa[i_capa];

	if (DonaCadena(capa.estil[i_estil].metadades) || capa.FormatImatge=="application/x-img")
	{
		cdns.push("<div class=\"MenuContextualCapa\" id=\"menuContextualCapa-contingut\">",
				  "<img align=\"right\" src=\"tanca_consulta.gif\" alt=\"",
					DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" onClick=\"TancaContextMenuCapa();\">",
				   "<div class=\"llistaMenuContext\"  id=\"menuContextualCapa-text\">");
		if (DonaCadena(capa.estil[i_estil].metadades))
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Metadades", "spa":"Metadatos", "eng":"Metadata", "fre":"Métadonnées"}), "</a><br>");
		}
		if (capa.estil && capa.estil.length>1)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraEditaEstilCapa(", i_capa,",", i_estil,");TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Edita estil", "spa":"Editar estilo", "eng":"Edit style", "fre":"Modifier le style"}), "</a><br>");
		}
		cdns.push("</div></div>");
		MouLayerContextMenuCapa(event, cdns.join(""));
	}
}

function OmpleLayerContextMenuCapa(event, i_capa)
{
var cdns=[]
capa=ParamCtrl.capa[i_capa];

		if (ParamCtrl.BarraBotoAfegeixCapa && ParamCtrl.BarraBotoAfegeixCapa==true)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"IniciaFinestraAfegeixCapaServidor(", i_capa, ");TancaContextMenuCapa();\">",
							DonaCadenaLang({"cat":"Afegir capa", "spa":"A&ntilde;adir capa", "eng":"Add layer", "fre":"Ajouter couche"}), "</a><br>",
							"<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"EsborrarCapa(", i_capa,");TancaContextMenuCapa();\">",
							DonaCadenaLang({"cat":"Esborrar capa", "spa":"Borrar capa", "eng":"Delete layer", "fre":"Effacer couche"}), "</a>");
		}		
		if (ParamCtrl.capa.length>1)
		{
			cdns.push("<hr><b><font color=\"#888888\">",
				  DonaCadenaLang({"cat":"Moure la capa", "spa":"Mover la capa", "eng":"Move layer", "fre":"Déplacer la couche"}), "</b>");
			if(i_capa>0)
			{
				cdns.push("<br /><a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASobreDeTot(", i_capa, ");TancaContextMenuCapa();\">",
						DonaCadenaLang({"cat":"A sobre de tot","spa":"Encima de todo", "eng":"To the top", "fre":"En haut de"}), "</a><br>",
						"<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASobre(", i_capa,");TancaContextMenuCapa();\">",
						DonaCadenaLang({"cat":"A sobre","spa":"Encima", "eng":"Up", "fre":"Au-dessus"}), "</a>");
			}
			if(i_capa<(ParamCtrl.capa.length-1))
			{
				cdns.push("<br/><a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASota(", i_capa, ");TancaContextMenuCapa();\">",
						DonaCadenaLang({"cat":"A sota", "spa":"Debajo", "eng":"Down", "fre":"Au-dessous"}), "</a><br>",
						"<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"MoureASotaDeTot(", i_capa,");TancaContextMenuCapa();\">",
					  	DonaCadenaLang({"cat":"A sota de tot", "spa":"Debajo de todo", "eng":"To the end", "fre":"En bas"}), "</a>");
			}
			cdns.push("<br />");
		}
		cdns.push("<hr>");
		if (DonaCadena(capa.metadades))
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraFitxerMetadades(", i_capa, ",-1);TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Metadades", "spa":"Metadatos", "eng":"Metadata", "fre":"Métadonnées"}), "</a><br>");
		}
		if (capa.estil && capa.estil.length==1)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraEditaEstilCapa(", i_capa, ",0);TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Edita estil", "spa":"Editar estilo", "eng":"Edit style", "fre":"Modifier le style"}), "</a><br>");
		}
		if (capa.estil && capa.estil.length && capa.estil[capa.i_estil].histograma)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraHistograma(", i_capa, ");TancaContextMenuCapa();\">",
					(capa.estil[capa.i_estil].categories && capa.estil[capa.i_estil].atributs) ? DonaCadenaLang({"cat":"Gràfic circular", "spa":"Gráfico circular", "eng":"Pie chart", "fre":"Diagramme à secteurs"}) : DonaCadenaLang({"cat":"Histograma", "spa":"Histograma", "eng":"Histogram", "fre":"Histogramme"}), "</a><br>");
		}
		if (capa.valors && capa.valors.length>2)
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraCombinacioRGB(", i_capa, ");TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Combinació RGB", "spa":"Combinación RGB", "eng":"RGB combination", "fre":"Combinaison RVB"}), "</a><br>");
		}
		if (capa.FormatImatge=="application/x-img")
		{
			cdns.push("<a class=\"unmenu\" href=\"javascript:void(0);\" onClick=\"ObreFinestraSeleccioCondicional(", i_capa, ");TancaContextMenuCapa();\">",
					DonaCadenaLang({"cat":"Selecció", "spa":"Selección", "eng":"Selection", "fre":"Sélection"}), "</a>");
		}
		if (cdns.length==0)
			return;
		cdns.splice(0, 0, "<div class=\"MenuContextualCapa\" id=\"menuContextualCapa-contingut\">",
				  "<img align=\"right\" src=\"tanca_consulta.gif\" alt=\"",
					DonaCadenaLang({"cat":"tancar", "spa":"cerrar", "eng":"close", "fre":"quitter"}) , "\" onClick=\"TancaContextMenuCapa();\">",
				   "<div class=\"llistaMenuContext\"  id=\"menuContextualCapa-text\">");
		cdns.push("</div></div>");
		MouLayerContextMenuCapa(event, cdns.join(""));
}

function DonaTextSeparadorCapaAfegida(i_capa)
{
var separa_capa_afegida=DonaCadenaLang({"cat":"Capes afegides", "spa":"Capas añadidas", "eng":"Added layers", "fre":"Couches ajoutées"});
	if (i_capa!=0)
		return null
	var capa=ParamCtrl.capa[i_capa];

	if (capa.separa && capa.separa==separa_capa_afegida)
		capa.separa=null;
	return separa_capa_afegida;
}

function AfegirCapaAlNavegador(form, servidorGC, i_on_afegir, i_capa, i_get_featureinfo, i_getmap)
{
var j, k;
var alguna_capa_afegida=false;
var estil;
var minim, maxim;

	var format=eval("form.format_capa_"+i_capa);
	var format_get_map=servidorGC.formatGetMap[format.options[format.selectedIndex].value];
	if(servidorGC.layer[i_capa].estil && servidorGC.layer[i_capa].estil.length>0)
	{
		estil=[];
		for(j=0; j<servidorGC.layer[i_capa].estil.length; j++)
		{
			estil[estil.length]={"nom": servidorGC.layer[i_capa].estil[j].nom, 
						"desc": (servidorGC.layer[i_capa].estil[j].desc ? servidorGC.layer[i_capa].estil[j].desc: servidorGC.layer[i_capa].estil[j].nom), 
						"DescItems": null, 
						"TipusObj": "I", 
						"metadades": null, 
						"ItemLleg": null, 
						"ncol": 0};
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
		k=i_on_afegir;
		CanviaIndexosCapesSpliceCapa(1, k, ParamCtrl.capa.length);
	}
	ParamCtrl.capa.splice(k, 0, {"servidor": servidorGC.servidor, 
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
				"separa": DonaTextSeparadorCapaAfegida(k),
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
				"AnimableMultiTime": (servidorGC.layer[i_capa].data)? true:false});

	CompletaDefinicioCapa(ParamCtrl.capa[k]);

	if (ParamCtrl.LlegendaAmagaSegonsEscala && ParamCtrl.LlegendaAmagaSegonsEscala==true && !EsCapaDinsRangDEscalesVisibles(ParamCtrl.capa[k]))
		   alert(DonaCadenaLang({"cat":"La nova capa afegida, \'"+ParamCtrl.capa[k].nom+"\' no és visible al nivell de zoom actual del navegador",
							 "spa":"La nueva capa añadida, \'"+ParamCtrl.capa[k].nom+"\' no es visible al nivel de zoom actual del navegador",
							 "eng":"The new layer added, \'"+ParamCtrl.capa[k].nom+"\' is not visible in the current zoom level of the browser",
							 "fre":"La nouvelle couche ajoutée, \'"+ParamCtrl.capa[k].nom+"\' n'est pas visible au niveau du zoom actuel du navigateur"}));
}
	
function AfegirCapesAlNavegador(form, i_serv)
{
var i, j, i_capa, i_get_featureinfo, i_getmap;
var alguna_capa_afegida=false;
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
				i_capa=form.sel_capes[i].value;
				if(!alguna_capa_afegida)
					alguna_capa_afegida=true;

				AfegirCapaAlNavegador(form, servidorGC, i_on_afegir, i_capa, i_get_featureinfo, i_getmap);

				if(i_on_afegir!=-1)
					i_on_afegir++;
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
			AfegirCapaAlNavegador(form, servidorGC, i_on_afegir, i_capa, i_get_featureinfo, i_getmap);
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
		RevisaEstatsCapes();
		CreaLlegenda();
		RepintaMapesIVistes();
	}
}//Fi de AfegirCapesAlNavegador

//n_moviment pot ser negatiu quan elimines capes o positiu quan insereixes. Aquest funció s'ha de cridar despres fer capa.splice() o similars.
//i_capa_ini és la capa inicial per fer el canvi d'indexos
//i_capa_fi_per_sota és la capa fi (no incluent ella mateixa) on cal fer el canvi d'indexos. Opcional; si no s'especifica, val ParamCtrl.capa.length
function CanviaIndexosCapesSpliceCapa(n_moviment, i_capa_ini, i_capa_fi_per_sota)
{
var capa, j, k, fragment, cadena;

	if (typeof i_capa_fi_per_sota==="undefined")
		var i_capa_fi_per_sota=i_capa_ini+1;

	for(var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.valors && capa.valors.length)
		{
			for (j=0; j<capa.valors.length; j++)
			{
				if (typeof capa.valors[j].i_capa!=="undefined" &&  capa.valors[j].i_capa!= null && capa.valors[j].i_capa>=i_capa_ini && capa.valors[j].i_capa<i_capa_fi_per_sota)
					capa.valors[j].i_capa+=n_moviment;
			}
		}
		if (capa.estil && capa.estil.length)
		{
			for (j=0; j<capa.estil.length; j++)
			{
				if (capa.estil[j].component && capa.estil[j].component.length)
				{
					for (k=0; k<capa.estil[j].component.length; k++)
					{
						calcul="";
						if (!capa.estil[j].component[k].calcul)
							continue;
						fragment=capa.estil[j].component[k].calcul;
						while ((inici=fragment.indexOf("{"))!=-1)
						{
							//busco una clau de tancar
							final=fragment.indexOf("}");
							if (final==-1)
							{
								alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
								break;
							}
							cadena=fragment.substring(inici, final+1);
							//interpreto el fragment metajson
							nou_valor=JSON.parse(cadena);
							if (nou_valor.i_capa>=i_capa_ini && nou_valor.i_capa<i_capa_fi_per_sota)
							{
								nou_valor.i_capa+=n_moviment;
								calcul+=fragment.substring(0, inici)+JSON.stringify(nou_valor); 
							}
							else
								calcul+=fragment.substring(0, inici)+cadena;
							fragment=fragment.substring(final+1, fragment.length);
						}
						calcul+=fragment;
						capa.estil[j].component[k].calcul=calcul;
					}
				}
			}
		}
	}
}

function AvisaDeCapaAmbIndexosACapaEsborrada(i_capa)
{
var capa, j, k, fragment, cadena;

	for(var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (capa.valors && capa.valors.length)
		{
			for (j=0; j<capa.valors.length; j++)
			{
				if (typeof capa.valors[j].i_capa!=="undefined" &&  capa.valors[j].i_capa!= null && capa.valors[j].i_capa==i_capa)
				{
					if (false==confirm(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"}) + " " + DonaCadena(capa.desc) + " " + DonaCadenaLang({"cat":"conté referències a la capa que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias a la capa que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références à la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"}) + "?"));
						return false;
				}
			}
		}
		if (capa.estil && capa.estil.length)
		{
			for (j=0; j<capa.estil.length; j++)
			{
				if (capa.estil[j].component && capa.estil[j].component.length)
				{
					for (k=0; k<capa.estil[j].component.length; k++)
					{
						if (!capa.estil[j].component[k].calcul)
							continue;
						fragment=capa.estil[j].component[k].calcul;
						while ((inici=fragment.indexOf("{"))!=-1)
						{
							//busco una clau de tancar
							final=fragment.indexOf("}");
							if (final==-1)
							{
								alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
								break;
							}
							cadena=fragment.substring(inici, final+1);
							//interpreto el fragment metajson
							nou_valor=JSON.parse(cadena);
							if (nou_valor.i_capa==i_capa)
							{
								if (false==confirm(DonaCadenaLang({"cat":"La capa", "spa":"La capa", "eng":"The layer", "fre":"La couche"}) + " " + DonaCadena(capa.desc) + " " + DonaCadenaLang({"cat":"conté referències a la capa que s'està intentant esborrar i deixarà de funcionar. Vols continuar", "spa": "contiene referencias a la capa que se está intentando borrar y dejará de funcionar. Desea continuar", "eng": "contains references to the layer that you are trying to erase and will stop working. Do you want to continue", "fre": "contient des références à la couche que vous essayez d'effacer et de cesser de travailler. Voulez-vous continuer"}) + "?"))
									return false;
							}
							fragment=fragment.substring(final+1, fragment.length);
						}
					}
				}
			}
		}
	}
	return true;
}

function DonaIndexosACapesDeCalcul(calcul)
{
var fragment, cadena, i_capes=[];

	fragment=calcul;
	while ((inici=fragment.indexOf("{"))!=-1)
	{
		//busco una clau de tancar
		final=fragment.indexOf("}");
		if (final==-1)
		{
			alert("Character '{' without '}' in 'calcul' in capa" + i_capa + " estil " + i_estil);
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		nou_valor=JSON.parse(cadena);
		i_capes.push(nou_valor.i_capa);
		fragment=fragment.substring(final+1, fragment.length);
	}
	i_capes.sort(sortAscendingNumber);
	EliminaRepeticionsArray(i_capes, sortAscendingNumber);
	
	return i_capes;
}

function DeterminaEnvTotalDeCapes(i_capes)
{
var env={"MinX": +1e300, "MaxX": -1e300, "MinY": +1e300, "MaxY": -1e300}, i;

	if (!i_capes.length || !ParamCtrl.capa[i_capes[0]].EnvTotal)
		return null;
	if (i_capes.length==1)
		return JSON.parse(JSON.stringify(ParamCtrl.capa[i_capes[0]].EnvTotal));
	for (i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].EnvTotal)
			return null;
		if (i<0 && ParamCtrl.capa[i_capes[i]].EnvTotal.CRS!=ParamCtrl.capa[i_capes[i-1]].EnvTotal.CRS)
			break;
	}
	if (i<i_capes.length)  //Hi ha ambits en CRSs diferents. Ho faig amb LongLat
	{
		for (i=0; i<i_capes.length; i++)
		{
			if (ParamCtrl.capa[i_capes[i]].EnvTotalLL)
			{
				if (env.MinX>ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinX)
					env.MinX=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinX;
				if (env.MaxX<ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxX)
					env.MaxX=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxX;
				if (env.MinY>ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinY)
					env.MinY=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MinY;
				if (env.MaxY<ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxY)
					env.MaxY=ParamCtrl.capa[i_capes[i]].EnvTotalLL.MaxY;
			}
		}
		return {"EnvCRS": env, "CRS": "EPSG:4326"};
	}
	else
	{
		for (i=0; i<i_capes.length; i++)
		{
			if (env.MinX>ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinX)
				env.MinX=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinX;
			if (env.MaxX<ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxX)
				env.MaxX=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxX;
			if (env.MinY>ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinY)
				env.MinY=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MinY;
			if (env.MaxY<ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxY)
				env.MaxY=ParamCtrl.capa[i_capes[i]].EnvTotal.EnvCRS.MaxY;
		}
		return {"EnvCRS": env, "CRS": ParamCtrl.capa[i_capes[0]].EnvTotal.EnvCRS.CRS};
	}
}


function DeterminaCostatMinimDeCapes(i_capes)
{
var costat=1e+300;

	if (!i_capes.length)
		return ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
	
	for (i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].CostatMinim)
			return ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
		if (costat>ParamCtrl.capa[i_capes[i]].CostatMinim)
			costat=ParamCtrl.capa[i_capes[i]].CostatMinim;
	}
	return (costat==1e+300) ? ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat : costat;
}

function DeterminaCostatMaximDeCapes(i_capes)
{
var costat=1e-300;

	if (!i_capes.length)
		return ParamCtrl.zoom[0].costat;
	
	for (i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].CostatMaxim)
			return ParamCtrl.zoom[0].costat;
		if (costat<ParamCtrl.capa[i_capes[i]].CostatMaxim)
			costat=ParamCtrl.capa[i_capes[i]].CostatMaxim;
	}
	return (costat==1e-300) ? ParamCtrl.zoom[0].costat : costat;
}

function AfegeixCapaCalcul(i_capa)
{
var alguna_capa_afegida=false;

var i_capes=DonaIndexosACapesDeCalcul(document.AfegeixCapaServidor.calcul.value);

	ParamCtrl.capa.splice(i_capa, 0, {"servidor": null,
		"versio": null,
		"tipus": null,
		"nom":	"CalculatedLayer",
		"desc":	"Calculated layer",
		"CRS": (i_capes.length ? JSON.parse(JSON.stringify(ParamCtrl.capa[i_capes[0]].CRS)) : null),
		"EnvTotal": DeterminaEnvTotalDeCapes(i_capes),
		"FormatImatge": "application/x-img",
		"valors": [],
		"transparencia": "semitransparent",
		"CostatMinim": DeterminaCostatMinimDeCapes(i_capes),
		"CostatMaxim": DeterminaCostatMaximDeCapes(i_capes),
		"TileMatrixSet": null,
		"FormatConsulta": "text/xml",
		"grup":	null,
		"separa": DonaTextSeparadorCapaAfegida(i_capa),
		"DescLlegenda": "Calculated layer",
		"estil": [{
			"nom":	null,
			"desc":	"Calulated layer",
			"TipusObj": "P",
			"component": [{
				"calcul": document.AfegeixCapaServidor.calcul.value,
			}],
			"metadades": null,
			"nItemLlegAuto": 20,
			"ncol": 4,
			"descColorMultiplesDe": 0.01
		}],
		"i_estil":	0,
		"NColEstil":	2,
		"LlegDesplegada":	false,
		"VisibleALaLlegenda":	true,
		"visible":	"si",
		"visible_vista":	null,
		"consultable":	"si",
		"descarregable":	"no",
		"metadades":	null,
		"NomVideo":	null,
		"DescVideo":	null,
		"FlagsData": null,
		"data": null,
		"i_data": 0,
		"animable":	false, //··Segurament la capa es podria declarar animable si alguna capa té els temps "current" i és multitime.
		"AnimableMultiTime": false,  //··Segurament la capa es podria declarar AnimableMultiTime si alguna capa té els temps "current" i és multitime.
		"proces":	null,
		"ProcesMostrarTitolCapa" : false
		});

	if (i_capa<ParamCtrl.capa.length)  //això és fa desrpés, donat que els índex de capa de la capa nova es poden referir a capes que s'han pogut.
		CanviaIndexosCapesSpliceCapa(1, i_capa, ParamCtrl.capa.length);

	CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

        //Redibuixo el navegador perquè les noves capes siguin visibles
	RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
}//Fi de AfegeixCapaCalcul()


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
var i, j, node2, trobat=false, cadena, cadena2;
var minim, maxim, factor_k, factorpixel;
	
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
var root, cadena, node, node2, i, cdns=[];
	
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
		cdns.push("<b>",
			  	DonaCadenaLang({"cat":"URL del servidor:", "spa":"URL del servidor:", "eng":"server URL:", "fre":"URL du serveur:"}),			  
			  	"</b><br><input type=\"text\" name=\"servidor\" readOnly style=\"width:400px;\" value=\"",
			  	servidorGC.servidor, "\" />",
				  "<br><br><b>",
				  DonaCadenaLang({"cat":"T&iacute;tol", "spa":"T&iacute;tulo", "eng":"Title", "fre":"Titre"}),
				  "</b><br><input type=\"text\" name=\"TitolServidor\" style=\"width:400px;\"");
		if(servidorGC.titol)
	  		cdns.push(" value=\"",servidorGC.titol, "\"");
		cdns.push(" /><br><br><hr><br><div class=\"layerselectorcapesafegir\">",
				  "<b>",DonaCadenaLang({"cat":"Capes","spa":"Capas","eng":"Layers","fre":"Couches"}),"</b><br>",
				  "<input name=\"seltotes_capes\" onclick=\"SeleccionaTotesLesCapesDelServidor(form);\" type=\"checkbox\" />", 
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
				  " onClick='AfegirCapesAlNavegador(form, ",servidorGC.index,");TancaFinestraLayer(\"afegirCapa\");' />",
				  "<input type=\"button\" class=\"Verdana11px\" value=\"",				
				  DonaCadenaLang({"cat":"Cancel·lar\"", "spa":"Cancelar\"", "eng":"Cancel\"", "fre":"Annuler\""}), 
				  " onClick='TancaFinestraLayer(\"afegirCapa\");' />");
		document.getElementById("LayerAfegeixCapaServidor").innerHTML=cdns.join("");
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
	ServidorGetCapabilities[ServidorGetCapabilities.length]={"win": this, 
								"index": ServidorGetCapabilities.length,
								"i_capa_on_afegir": i_capa,
								"servidor": servidor,
								"versio": null,
								"tipus": "TipusWMS",
								"titol": null,
								"formatGetMap": [],
								"formatGetFeatureInfo": [],
								"layer": []};
	
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

function EscriuCapaALaFormulaAfegeixCapa()
{
var condicio={};
	condicio=LlegeixParametresCondicioCapaDataEstil("afegeix-capa-capa-calcul", "-valor", 0);
	calcul=document.AfegeixCapaServidor.calcul;
	calcul.focus();
	calcul.value = calcul.value.substring(0, calcul.selectionStart)+DonaCadenaEstilCapaPerCalcul(-1, condicio.i_capa, condicio.i_data, condicio.i_estil)+calcul.value.substring(calcul.selectionEnd);
}

function DonaCadenaAfegeixCapaServidor(url, i_capa)
{
var cdns=[], i, capa;

	cdns.push("<form name=\"AfegeixCapaServidor\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerAfegeixCapaServidor\" class=\"Verdana11px\" style=\"position:absolute; left:10px; top:10px;\">",
			"<fieldset><legend>",
			DonaCadenaLang({"cat":"Capa nova de servidor", "spa":"Capa nueva de servidor:", "eng":"New layer from server", "fre":"Nouvelle couche du serveur"}),
			"</legend>",
			DonaCadenaLang({"cat":"Especifica l'adreça URL del servidor", "spa":"Especifique la dirección URL del servidor", "eng":"Specify the server URL", "fre":"Spécifiez l'adresse URL du serveur"}),
			":<br><input type=\"text\" name=\"servidor\" style=\"width:400px;\" value=\"",
			(url ? url: "http://"), "\" />",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",				
		     	DonaCadenaLang({"cat":"Afegir", "spa":"Añadir", "eng":"Add", "fre":"Ajouter"}), 
		        "\" onClick=\"FesPeticioCapacitatsIParsejaResposta(document.AfegeixCapaServidor,",i_capa,");\" />");
	if(LlistaServOWS && LlistaServOWS.length)
	{
		cdns.push("<br><br>",
			DonaCadenaLang({"cat":"o Seleccciona'n un de la llista de serveis", "spa":"o Escoja uno de la lista de servicios", "eng":"or Choose one from service list", "fre":"ou sélectionnez un des services de la liste"}),
			"<br>",				  
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
		cdns.push("</select><br>",
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
	cdns.push("</fieldset>");
	for (i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) || 
			capa.FormatImatge!="application/x-img" || !capa.valors)
			continue;
		break;
	}
	if (i<ParamCtrl.capa.length)
	{
		cdns.push("<fieldset><legend>",
			  DonaCadenaLang({"cat":"Calculada a partir de les capes existents", "spa":"Calculada a partir de las capas existentes", "eng":"Computed from existing layers", "fre":"Calculé à partir de couches existantes"}),
			  "</legend>",
			  "<fieldset><legend>",
			  DonaCadenaLang({"cat":"Capa per a la fòrmula", "spa":"Capa para la fórmula", "eng":"Layer for the expression", "fre":"Couche pour l'expression"}),
			  "</legend>");
		//Posar uns desplegables de capes, estils i dates
		cdns.push(DonaCadenaCapaDataEstilOperacioValor("afegeix-capa-capa-calcul", -1, 0, false));
		//Posar un botó d'afegir a la fòrmula
		cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"",				
		     	DonaCadenaLang({"cat":"Escriu a la fòrmula", "spa":"Escribe en fórmula", "eng":"Write in expression", "fre":"Ecrire à la formule"}), 
		        "\" onClick='EscriuCapaALaFormulaAfegeixCapa();' /></fieldset>");
		//Caixa multilínia per a la formula.
		cdns.push(DonaCadenaLang({"cat":"Fòrmula", "spa":"Fórmula:", "eng":"Expression", "fre":"Formule"}),
			":<br><textarea name=\"calcul\" class=\"Verdana11px\" style=\"width:430px;height:140\" ></textarea><br>",
			"<input type=\"button\" class=\"Verdana11px\" value=\"",				
		     	DonaCadenaLang({"cat":"Afegir", "spa":"Añadir", "eng":"Add", "fre":"Ajouter"}), 
		        "\" onClick='AfegeixCapaCalcul(",i_capa,");TancaFinestraLayer(\"afegirCapa\");' />",
			"</fieldset>");
	}
	cdns.push("</div></form>");
	return cdns.join("");
}

function FinestraAfegeixCapaServidor(elem, i_capa)
{
	contentLayer(elem, DonaCadenaAfegeixCapaServidor(null, i_capa));
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
						  "eng":"The layer 'afegirCapa' has not been defined and its not possible use the funcionality add layer to browser",
						  "fre":"La layer de type fenêtre 'afegirCapa' n'a été pas définie et il n'est donc pas possible d'utilise l'outil pour ajouter des couches au navigateur"}));
	}
	
}

function CanviaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil)
{
	document.getElementById(prefix_id + "-operador-valor-"+i_condicio).innerHTML=DonaCadenaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil);
}

function ActivaConstantOCapaSeleccioCondicional(prefix_id, i_condicio, es_capa)
{
	document.getElementById("div-" + prefix_id + "-operador-"+i_condicio).style.display=(es_capa==null) ? "none" : "inline";
	document.getElementById("div-" + prefix_id + "-cc-constant-"+i_condicio).style.display=(es_capa==null || es_capa==true) ? "none" : "inline";
	document.getElementById("div-" + prefix_id + "-cc-capa-"+i_condicio).style.display=(es_capa==null || es_capa==false) ? "none" : "inline";
}


/*Retorna un objecte amb "n_capa" que és nombre de capes compatibles amb i_capa i la vista actual (o si i_capa==-1 només amb la vista actual) 
i "i_capa_unica" que és la primera capa compatible (o la única si només n'hi ha una)*/
function DonaNCapesVisiblesOperacioArraysBinaris(i_capa)
{
var n_capa=0, i_capa_unica=-1;
	for (var i=0; i<ParamCtrl.capa.length; i++)
	{
		capa=ParamCtrl.capa[i];
		if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) || 
			((i_capa==-1) ? false : !EsCapaDinsAmbitCapa(capa, ParamCtrl.capa[i_capa])) || capa.FormatImatge!="application/x-img" || !capa.valors)
			continue;
		n_capa++;
		if (i_capa_unica==-1)
			i_capa_unica=i;
	}
	return {"n_capa": n_capa, "i_capa_unica": i_capa_unica};
}

function DonaCadenaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, i_estil)
{
var cdns=[], nc, capa=ParamCtrl.capa[i_capa];
var estil=capa.estil[i_estil];

	//Una caixa que permeti triar un operador
	cdns.push("<div id=\"div-", prefix_id, "-operador-",i_condicio,"\" ><label for=\"", prefix_id, "-operador-",i_condicio, "\">", DonaCadenaLang({"cat":"Operador", "spa":"Operador", "eng":"Operator", "fre":"Opérateur"}), ":</label>",
		"<select id=\"", prefix_id, "-operador-",i_condicio,"\" name=\"operador", i_condicio, "\" style=\"width:80px;\">",
		"<option value=\"==\" selected=\"selected\">=</option>",
		"<option value=\"!=\">=/=</option>");
	if (!estil.categories)
	{
		cdns.push("<option value=\"<\">&lt;</option>",
			"<option value=\">\">&gt;</option>",
			"<option value=\"<=\">&lt;=</option>",
			"<option value=\">=\">&gt;=</option>");
	}
	cdns.push("</select></div>");

	nc=DonaNCapesVisiblesOperacioArraysBinaris(i_capa);
	cdns.push("<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-qualsevol\" name=\"cc",i_condicio, "\" value=\"qualsevol\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", null);' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-constant\">", DonaCadenaLang({"cat":"qualsevol valor", "spa":"cualquier valor", "eng":"any value", "fre":"toute valeur"}), "</label>",
			"<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-constant\" name=\"cc",i_condicio, "\" value=\"constant\" checked=\"checked\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", false);' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-constant\">", DonaCadenaLang({"cat":"constant", "spa":"constante", "eng":"constant", "fre":"constant"}), "</label>");
	if (nc.n_capa>1)
		cdns.push("<input type=\"radio\" id=\"", prefix_id, "-cc-",i_condicio, "-capa\" name=\"cc",i_condicio, "\" value=\"capa\" onClick='ActivaConstantOCapaSeleccioCondicional(\"", prefix_id, "\", ", i_condicio, ", true);' />", "<label for=\"", prefix_id, "-cc-",i_condicio, "-capa\">", DonaCadenaLang({"cat":"capa", "spa":"capa", "eng":"layer", "fre":"couche"}), "</label>");

	cdns.push("<br>");

	//Una caixa que permeti triar un valor com a constant
	cdns.push("<div id=\"div-", prefix_id, "-cc-constant-",i_condicio,"\" style=\"display:inline;\">",
		"<label for=\"", prefix_id, "-valor-",i_condicio, "\">", DonaCadenaLang({"cat":"Valor", "spa":"Valor", "eng":"Value", "fre":"Valeur"}), ":</label>");
	if (estil.categories && estil.categories.length && estil.atributs)
	{
		if (estil.categories.length>1)
		{
			cdns.push("<select  id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\">");
			for (var i_cat=0; i_cat<estil.categories.length; i_cat++)
			{
				if (estil.categories[i_cat])
				{
					cdns.push("<option value=\"",i_cat,"\"",
					    	((i_cat==0) ? " selected=\"selected\"" : "") ,
						">", DonaTextCategoriaDesDeColor(estil, i_cat), "</option>");
				}
			}
			cdns.push("</select>");
		}
		else
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" />", DonaTextCategoriaDesDeColor(estil, 0));
		cdns.push("<br>");
	}		
	else
	{
		cdns.push("<input type=\"text\" id=\"", prefix_id, "-valor-",i_condicio,"\" name=\"valor", i_condicio, "\" style=\"width:400px;\" value=\"\" /><br>");
		if (estil.component[0].estiramentPaleta && typeof estil.component[0].estiramentPaleta.valorMaxim!=="undefined" && typeof estil.component[0].estiramentPaleta.valorMinim!=="undefined")
			cdns.push(DonaCadenaLang({"cat":"Interval de valors recomenats", "spa":"Intervaluo de valores recomendados", "eng":"Interval of recommended values", "fre":"Intervalle des valeurs recommandées"}), ": [", estil.component[0].estiramentPaleta.valorMinim, ",", estil.component[0].estiramentPaleta.valorMaxim, "]");

	}
	cdns.push("</div>");
	if (nc.n_capa>1)
	{
		//Una caixa que permeti triar un valor com a capa
		cdns.push("<div id=\"div-", prefix_id, "-cc-capa-",i_condicio,"\" style=\"display:none\">",
			DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, false),
			"</div>");
	}
	return cdns.join("");
}

function CanviaCondicioSeleccioCondicional(prefix_id, i_capa, i_condicio, vull_operador)
{
	document.getElementById(prefix_id+"-"+(vull_operador? "": "capa-valor-")+ i_condicio).innerHTML=DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, vull_operador);
}

function DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, vull_operador)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	//Desplegable de dates si s'escau.
	if (capa.AnimableMultiTime && capa.AnimableMultiTime==true && capa.data && capa.data.length)
	{
		cdns.push("<label for=\"", prefix_id, "-",(vull_operador? "": "valor-"),"data-",i_condicio, "\">", DonaCadenaLang({"cat":"Data", "spa":"Fecha", "eng":"Date", "fre":"Date"}), ": </label>");
		if (capa.data.length>1)
		{
			cdns.push("<select id=\"", prefix_id, "-",(vull_operador? "": "valor-"),"data-",i_condicio,"\" name=\"",(vull_operador? "": "valor_"),"data", i_condicio, "\" style=\"width:400px;\">");
			//var i_data_sel=DonaIndexDataCapa(capa, null);
			for (var i_data=0; i_data<capa.data.length; i_data++)
			{
				cdns.push("<option value=\"",i_data,"\"",
				    	/*((i_data==i_data_sel) ? " selected=\"selected\"" : "") ,*/
					">" , DonaDataCapaComATextBreu(i_capa,i_data) , "</option>");
			}
			cdns.push("<option value=\"null\" selected=\"selected\">" , DonaCadenaLang({"cat":"Seleccionada a la capa", "spa":"Seleccionada en la capa", "eng":"Selected in the layer", "fre":"···Selected in the layer"}), "</option>");
			cdns.push("</select>");
		}
		else 
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-",(vull_operador? "": "valor-"),"data-",i_condicio,"\" name=\"",(vull_operador? "": "valor_"),"data", i_condicio, "\" />", DonaDataCapaComATextBreu(i_capa,0));
		cdns.push("<br>");
	}
	//Desplegable de les bandes disponsibles
	if (capa.estil && capa.estil.length)
	{
		cdns.push("<label for=\"", prefix_id, "-",(vull_operador? "": "valor-"),"estil-",i_condicio, "\">", DonaCadenaLang({"cat":"Camp", "spa":"Camp", "eng":"Field", "fre":"Champ"}), ": </label>");
		if (capa.estil.length>1)
		{
			cdns.push("<select id=\"", prefix_id, "-",(vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",(vull_operador? "" : "valor_"),"estil", i_condicio, "\" style=\"width:400px;\"");
			if (vull_operador)
				cdns.push(" onChange='CanviaOperadorValorSeleccioCondicional(\"", prefix_id, "\", ", i_capa, ", ", i_condicio, ", parseInt(document.getElementById(\"", prefix_id, "-",(vull_operador? "": "valor-"), "estil-", i_condicio, "\").value));'");
			cdns.push(">");
			for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
			{
				if (capa.estil[i_estil].component.length>1 /*||
					typeof capa.estil[i_estil].component[0].calcul!=="undefined"*/)
					continue;
				cdns.push("<option value=\"",i_estil,"\"",
				    	((i_estil==capa.i_estil) ? " selected=\"selected\"" : "") ,
					">", DonaCadena(capa.estil[i_estil].desc), "</option>");
			}
			cdns.push("</select>");
		}
		else 
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-",(vull_operador? "": "valor-"),"estil-", i_condicio, "\" name=\"",(vull_operador? "": "valor_"),"estil", i_condicio, "\" />", DonaCadena(capa.estil[0].desc));
		cdns.push("<br>");
	}
	if (vull_operador)
	{
		cdns.push("<div id=\"", prefix_id, "-operador-valor-", i_condicio, "\">",
			DonaCadenaOperadorValorSeleccioCondicional(prefix_id, i_capa, i_condicio, capa.i_estil),
			"</div>");
	}
	return cdns.join("");
}

function ActivaCondicioSeleccioCondicional(prefix_id, i_condicio, estat)
{
	document.getElementById(prefix_id + "-nexe-"+i_condicio).style.display=(estat) ? "inline" : "none";
}

//i_capa és la capa que se seleccionarà per defecte en el selector. Pot ser -1 per seleccionar la primera compatible.
function DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, vull_operador)
{
var cdns=[], capa, nc, capa_def;

	nc=DonaNCapesVisiblesOperacioArraysBinaris(i_capa);
	if (i_capa==-1)
	{
		capa_def=null;
		i_capa=nc.i_capa_unica;
	}
	else
		capa_def=ParamCtrl.capa[i_capa];

	//Desplegable de les capes visibles per aquesta vista
	cdns.push("<label for=\""+prefix_id+"-",(vull_operador? "": "valor-"),"capa-",i_condicio, "\">", DonaCadenaLang({"cat":"Capa", "spa":"Capa", "eng":"Layer", "fre":"Couche"}), ":</label>");
	if (nc.n_capa>1)
	{	
		cdns.push("<select id=\"", prefix_id, "-",(vull_operador? "" : "valor-"),"capa-",i_condicio,"\" name=\"",(vull_operador? "" : "valor_"),"capa", i_condicio, "\" style=\"width:400px;\" onChange='CanviaCondicioSeleccioCondicional(\"", prefix_id, "\", parseInt(document.getElementById(\"", prefix_id, "-",(vull_operador? "" : "valor-"),"capa-",i_condicio,"\").value), ",i_condicio, ", ", vull_operador,");'>");
		for (var i=0; i<ParamCtrl.capa.length; i++)
		{
			capa=ParamCtrl.capa[i];
			if (!EsCapaDinsRangDEscalesVisibles(capa) || !EsCapaDinsAmbitActual(capa) || !EsCapaDisponibleEnElCRSActual(capa) || 
				((capa_def) ? !EsCapaDinsAmbitCapa(capa, capa_def) : false) || capa.FormatImatge!="application/x-img" || !capa.valors)
				continue;
			cdns.push("<option value=\"", i, "\"", (i_capa==i ? " selected=\"selected\"" : ""), ">", DonaCadena(capa.DescLlegenda), "</option>");
		}
		cdns.push("</select>");
	}
	else if (nc.n_capa>0)
		cdns.push("<input type=\"hidden\" value=\"",nc.i_capa_unica,"\" id=\"", prefix_id, "-",(vull_operador? "": "valor-"),"capa-",i_condicio,"\" name=\"",(vull_operador? "": "valor_"),"capa", i_condicio, "\" />", DonaCadena(ParamCtrl.capa[nc.i_capa_unica].DescLlegenda));
	cdns.push("<br>",
		"<div id=\"", prefix_id, "-",(vull_operador? "" : "capa-valor-"), i_condicio, "\">",
		DonaCadenaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, vull_operador),
		"</div>");
	return cdns.join("");
}

function DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, i_estil)
{
	return DonaCadena(ParamCtrl.capa[i_capa].estil[(i_estil!=null) ? i_estil : parseInt(document.getElementById(prefix_id+"-estil").value)].desc) + " (" + DonaCadenaLang({"cat":"Selecció", "spa":"Selección", "eng":"Selection", "fre":"Sélection"}) + ")";
}

function CanviaNomNouEstilSeleccioCondicional(prefix_id, i_capa)
{
	document.SeleccioCondicional.nom_estil.value=DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, null);
}

function DonaCadenaSeleccioCondicional(prefix_id, i_capa)
{
var cdns=[], consulta, nexe, capa, primer_i_estil_valid=null;

	cdns.push("<form name=\"SeleccioCondicional\" onSubmit=\"return false;\">");
	capa=ParamCtrl.capa[i_capa];
	cdns.push("<div style=\"position:absolute; left:10px; top:10px;\">",
			DonaCadenaLang({"cat":"Mostra només els valors de la capa", "spa":"Muestra solo los valores de la capa", "eng":"Only show the values of the layer", "fre":"Afficher uniquement les valeurs de la couche"}), " \"", 
			DonaCadena(capa.DescLlegenda),
			"\"<br/>");
	if (capa.estil && capa.estil.length)
	{
		cdns.push("<label for=\"", prefix_id, "-estil\">", DonaCadenaLang({"cat":"del camp", "spa":"del campo", "eng":"of the field", "fre":"du champ"}), ":</label>");
		if (capa.estil.length>1)
		{
			cdns.push("<select id=\"", prefix_id, "-estil\" name=\"estil\" style=\"width:400px;\" onChange='CanviaNomNouEstilSeleccioCondicional(\"", prefix_id, "\",", i_capa, ");'>");
			for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
			{
				/*if (capa.estil[i_estil].component.length>1 ||
				    typeof capa.estil[i_estil].component[0].calcul!=="undefined")
					continue;*/
				cdns.push("<option value=\"",i_estil,"\"",
				    	((i_estil==capa.i_estil) ? " selected=\"selected\"" : "") ,
					">", DonaCadena(capa.estil[i_estil].desc), "</option>");
			}
			cdns.push("</select>");
		}
		else
			cdns.push("<input type=\"hidden\" value=\"0\" id=\"", prefix_id, "-estil\" name=\"estil\" />", DonaCadena(capa.estil[0].desc));
		cdns.push("<br>");
	}
	cdns.push(DonaCadenaLang({"cat":"que cumplexien les condicions següents", "spa":"que cumplen las condiciones seguientes", "eng":"that conform to the following conditions", "fre":"qui se conforment aux conditions suivantes"}), ":");
	
	for (var i_condicio=0; i_condicio<10; i_condicio++)
	{
		cdns.push("<span id=\"", prefix_id, "-nexe-", i_condicio, "\" class=\"Verdana11px\" style=\"display: "+((i_condicio==0) ? "inline" : "none")+"\"><fieldset><legend>",
			DonaCadenaLang({"cat":"Condició", "spa":"Condición", "eng":"Condition", "fre":"Condition"}), " ", i_condicio+1, ":</legend>",
			DonaCadenaCapaDataEstilOperacioValor(prefix_id, i_capa, i_condicio, true),
			"</fieldset>");
		if (i_condicio<(10-1))
		{
			/*(Eventualment Un nexe... i altre cop el mateix)*/
			cdns.push(DonaCadenaLang({"cat":"Nexe amb la següent condició", "spa":"Nexo con la siguiente condición", "eng":"Nexus with next condition", "fre":"Nexus avec la prochaine condition"}), ":",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-none\" name=\"nexe",i_condicio, "\" value=\"\" checked=\"checked\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", false);' />", "<label for=\"", prefix_id, "-nexe-",i_condicio, "-none\">", DonaCadenaLang({"cat":"cap", "spa":"ninguno", "eng":"none", "fre":"aucun"}), "</label>",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-and\" name=\"nexe",i_condicio, "\" value=\"and\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", true);' />", "<label for=\"", prefix_id, "-nexe-",i_condicio, "-and\">", DonaCadenaLang({"cat":"i", "spa":"y", "eng":"and", "fre":"et"}), "</label>",
				"<input type=\"radio\" id=\"", prefix_id, "-nexe-",i_condicio, "-or\" name=\"nexe",i_condicio, "\" value=\"or\" onClick='ActivaCondicioSeleccioCondicional(\"", prefix_id, "\", ", i_condicio+1, ", true);' />",  "<label for=\"", prefix_id, "-nexe-",i_condicio, "-or\">", DonaCadenaLang({"cat":"o", "spa":"o", "eng":"or", "fre":"ou"}), "</label><br>");
		}
		cdns.push("</span>");
	}
	cdns.push("<hr>",
		DonaCadenaLang({"cat":"El resultat de la selecció serà afegit com a un estil nou de nom", "spa":"El resultado de la selección será añadido como un estilo nuevo de nombre", "eng":"The result of the selection will be added as a new style with name", "fre":"Le résultat de la sélection sera ajouté en tant que nouveau style avec le nom"}), 
		" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
		DonaNomNouEstilSeleccioCondicional(prefix_id, i_capa, (capa.estil && capa.estil.length>1) ? capa.i_estil : 0),
		"\" /><br/>",
		DonaCadenaLang({"cat":"a la capa", "spa":"a la capa", "eng":"to the layer", "fre":"à la couche"}), 
		" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"", 
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}), 
	        "\" onClick='CreaBandaSeleccioCondicional(\"", prefix_id, "\",", i_capa,");TancaFinestraLayer(\"seleccioCondicional\");' />",
		"</div></form>");
	return cdns.join("");
}

function FinestraSeleccioCondicional(elem, i_capa)
{
	contentLayer(elem, DonaCadenaSeleccioCondicional("condicio-seleccio-condicional", i_capa));
}

function ObreFinestraSeleccioCondicional(i_capa)
{
	if (isFinestraLayer(this, "seleccioCondicional"))
	{
		showFinestraLayer(this, "seleccioCondicional");
		var elem=getLayer(this, "seleccioCondicional_finestra");
		FinestraSeleccioCondicional(elem, i_capa);
	}
	else  //missatge error
	{
		alert(DonaCadenaLang({"cat":"No s'ha definit la layer de tipus finestra 'seleccioCondicional' i per tant no es pot usar la funcionalitat de selecció per condició",
						  "spa":"No se ha definido la layer de tipo ventana 'seleccioCondicional' y en consecuencia no se puede usar la funcionalidad de selección por condición",
						  "eng":"The layer 'seleccioCondicional' has not been defined and its not possible use the funcionality of query by attribute selection by condition",
						  "fre":"La layer de type fenêtre 'seleccioCondicional' n'a été pas définie et il n'est donc pas possible d'utilise l'outil pour sélection par condition"}));
	}
}

function LlegeixParametresCondicioCapaDataEstil(prefix_id, prefix_condicio, i_condicio)
{
var condicio_capa={};
	condicio_capa.i_capa=parseInt(document.getElementById(prefix_id + prefix_condicio + "-capa-" + i_condicio).value);
	var capa=ParamCtrl.capa[condicio_capa.i_capa];
	if (capa.AnimableMultiTime && capa.AnimableMultiTime==true && capa.data && capa.data.length)
	{
		var i_time=parseInt(document.getElementById(prefix_id + prefix_condicio + "-data-" + i_condicio).value);
		if (!isNaN(i_time) && i_time!=null)
			condicio_capa.i_data=i_time;
	}
	if (capa.estil && capa.estil.length)
		condicio_capa.i_estil=parseInt(document.getElementById(prefix_id + prefix_condicio + "-estil-" + i_condicio).value);
	return condicio_capa;
}

/*function LlegeixParametresValorCondicioCapaDataEstil(prefix_id, condicio, i_condicio)
{
	condicio.valor_i_capa=parseInt(document.getElementById(prefix_id + "-valor-capa-" + i_condicio).value);
	var capa=ParamCtrl.capa[condicio.valor_i_capa];
	if (capa.AnimableMultiTime && capa.AnimableMultiTime==true && capa.data && capa.data.length)
	{
		var i_time=parseInt(document.getElementById(prefix_id + "-valor-data-" + i_condicio).value;
		if (!isNaN(i_time) && i_time!=null)
			condicio.valor_i_data=i_time;
	}
	if (capa.estil && capa.estil.length)
		condicio.valor_i_estil=parseInt(document.getElementById(prefix_id + "-valor-estil-" + i_condicio).value);
}*/

function LlegeixParametresSeleccioCondicional(prefix_id, i_capa)
{
var sel_condicional={}, condicio, radials;

	sel_condicional.i_capa=i_capa;
	var capa=ParamCtrl.capa[i_capa];
	if (capa.estil && capa.estil.length)
		sel_condicional.i_estil=parseInt(document.getElementById(prefix_id+"-estil").value);  //No se perquè en IE no funciona la manera clàssica.
	sel_condicional.nom_estil=document.SeleccioCondicional.nom_estil.value;
	sel_condicional.condicio=[];
	for (var i_condicio=0; i_condicio<10; i_condicio++)
	{
		sel_condicional.condicio[i_condicio]={};
		condicio=sel_condicional.condicio[i_condicio];

		condicio.capa_clau=LlegeixParametresCondicioCapaDataEstil(prefix_id, "", i_condicio);

		radials=eval("document.SeleccioCondicional.cc"+i_condicio);
		if (radials && (radials[1] && radials[1].checked) || (radials[2] && radials[2].checked))
			condicio.operador=eval("document.SeleccioCondicional.operador"+i_condicio+".value");

		if (radials && radials[2] && radials[2].checked)
			condicio.capa_valor=LlegeixParametresCondicioCapaDataEstil(prefix_id, "-valor", i_condicio);
		else if (radials && radials[1] && radials[1].checked)
		{
			var valor=eval("document.SeleccioCondicional.valor"+i_condicio+".value");
			if (valor && valor!="")  //Si la cadena és buida, no ho recullo"
				condicio.valor=eval("document.SeleccioCondicional.valor"+i_condicio+".value");
			else
				delete condicio.operador;
		}

		if (i_condicio<(10-1))
		{
			if (eval("document.SeleccioCondicional.nexe"+i_condicio+"[1].checked"))
				condicio.nexe="&&";
			else if (eval("document.SeleccioCondicional.nexe"+i_condicio+"[2].checked"))
				condicio.nexe="||";
			else 
				break;
		}
	}
	return sel_condicional;
}

//Escriu una referencia a una capa, valor i data per un càlcul (format {\"i_capa\":0, \"i_valor\":1, \"i_data\":2})
function DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_valor, i_data) 
{
var cdns=[];

	cdns.push("{");
	if (i_capa!=i_capa_ref)
		cdns.push("\"i_capa\":",i_capa);
	if (cdns.length!=1)
		cdns.push(",");
	cdns.push("\"i_valor\":", (i_valor) ? i_valor : 0);
	if (typeof i_data!=="undefined" && i_data!=null /*&& DonaIndexDataCapa(ParamCtrl.capa[i_capa], null)!=i_data*/)
	{
		if (cdns.length!=1)
			cdns.push(",");
		cdns.push("\"i_data\":"+i_data);
	}
	cdns.push("}");
	return cdns.join("");
}

function DonaCadenaEstilCapaPerCalcul(i_capa_ref, i_capa, i_data, i_estil)
{
var component_sel=ParamCtrl.capa[i_capa].estil[i_estil].component[0], s_patro, i;

	if (typeof component_sel.FormulaConsulta!=="undefined")
	{
		var valors=ParamCtrl.capa[i_capa].valors;
		var s=component_sel.FormulaConsulta;
		for (var i_valor=0; i_valor<valors.length; i_valor++)
		{
			s_patro="v["+i_valor+"]";
			while ((i=s.indexOf(s_patro))!=-1)
				s=s.substring(0, i)+DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, i_valor, i_data)+s.substring(i+s_patro.length);
		}
		return "("+ s +")";
	}
	return DonaReferenciaACapaPerCalcul(i_capa_ref, i_capa, component_sel.i_valor, i_data);
}

function CreaBandaSeleccioCondicional(prefix_id, i_capa)
{
var sel_condicional, i_estil_nou, estil, calcul;

	sel_condicional=LlegeixParametresSeleccioCondicional(prefix_id, i_capa);
	//Crea un nou estil
	capa=ParamCtrl.capa[i_capa];
	i_estil_nou=capa.estil.length;
	capa.estil[capa.estil.length]=JSON.parse(JSON.stringify(capa.estil[(sel_condicional.i_estil) ? sel_condicional.i_estil : 0]));
	estil=capa.estil[i_estil_nou];	
	estil.desc=sel_condicional.nom_estil;
	/*
	if (typeof estil.desc==="object")
	{
		if (estil.desc.cat)
			estil.desc.cat+=" (selecció)";
		if (estil.desc.spa)
			estil.desc.spa+=" (selección)";
		if (estil.desc.eng)
			estil.desc.eng+=" (selection)";
		if (estil.desc.fra)
			estil.desc.fra+=" (Sélection)";
	}
	else
		estil.desc+=" ("+ DonaCadenaLang({"cat":"Selecció", "spa":"Selección", "eng":"Selection", "fre":"Sélection"})+ ")";*/

	//Defineix el "calcul" de la seleccio que serà de tipus "(capaA<5 || CapaA>capaB)? capa : null"
	calcul="("
	for (var i_condicio=0; i_condicio<sel_condicional.condicio.length; i_condicio++)
	{
		calcul+=DonaCadenaEstilCapaPerCalcul(i_capa, sel_condicional.condicio[i_condicio].capa_clau.i_capa, sel_condicional.condicio[i_condicio].capa_clau.i_data, sel_condicional.condicio[i_condicio].capa_clau.i_estil);

		if (typeof sel_condicional.condicio[i_condicio].operador==="undefined")
			calcul+="!=null";
		else
		{
			calcul+=sel_condicional.condicio[i_condicio].operador;
			if (typeof sel_condicional.condicio[i_condicio].valor!=="undefined")
				calcul+=sel_condicional.condicio[i_condicio].valor;
			else		
				calcul+=DonaCadenaEstilCapaPerCalcul(i_capa, sel_condicional.condicio[i_condicio].capa_valor.i_capa, sel_condicional.condicio[i_condicio].capa_valor.i_data, sel_condicional.condicio[i_condicio].capa_valor.i_estil);
		}
		if (typeof sel_condicional.condicio[i_condicio].nexe!=="undefined")
			calcul+=sel_condicional.condicio[i_condicio].nexe;
	}
	calcul+=")?";
	for (var i_c=0; i_c<estil.component.length; i_c++)
	{
		if (typeof estil.component[i_c].calcul!=="undefined" && estil.component[i_c].calcul!=null)
		{
			estil.component[i_c].calcul=calcul + "("+estil.component[i_c].calcul+")";
			if (estil.component[i_c].FormulaConsulta)
				delete estil.component[i_c].FormulaConsulta;
		}
		else if (typeof estil.component[i_c].FormulaConsulta!=="undefined" && estil.component[i_c].FormulaConsulta!=null)
		{
			estil.component[i_c].calcul=calcul + "("+estil.component[i_c].FormulaConsulta+")";
			delete estil.component[i_c].FormulaConsulta;
		}
		else //if (typeof estil.component[i_c].i_valor!=="undefined")
		{
			estil.component[i_c].calcul=calcul + "v["+estil.component[i_c].i_valor+"]";
			delete estil.component[i_c].i_valor;
		}
		estil.component[i_c].calcul+=":null";
	}

	if (capa.visible=="ara_no")
		CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
	else
		CreaLlegenda();

	//Defineix el nou estil com estil actiu
	CanviaEstilCapa(i_capa, i_estil_nou, false);
}

function ObreFinestraCombinacioRGB(i_capa)
{
	if (isFinestraLayer(this, "combinacioRGB"))
	{
		showFinestraLayer(this, "combinacioRGB");
		var elem=getLayer(this, "combinacioRGB_finestra");
		FinestraCombinacioRGB(elem, i_capa);
	}
	else  //missatge error
	{
		alert(DonaCadenaLang({"cat":"No s'ha definit la layer de tipus finestra 'combinacioRGB' i per tant no es pot usar la funcionalitat de combinació RGB",
						  "spa":"No se ha definido la layer de tipo ventana 'combinacioRGB' y en consecuencia no se puede usar la funcionalidad de combinación RGB",
						  "eng":"The layer 'combinacioRGB' has not been defined and its not possible use the funcionality of RGB combination",
						  "fre":"La layer de type fenêtre 'combinacioRGB' n'a été pas définie et il n'est donc pas possible d'utilise l'outil pour combinaison RVB"}));
	}
}

function FinestraCombinacioRGB(elem, i_capa)
{
	contentLayer(elem, DonaCadenaCombinacioRGB(i_capa));
}

function DonaCadenaCombinacioRGB(i_capa)
{
var cdns=[], capa=ParamCtrl.capa[i_capa];

	cdns.push("<form name=\"CombinacioRGB\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerCombinacioRGB\" style=\"position:absolute;left:10px;top:10px;\">",
			DonaCadenaLang({"cat":"Sel·lecciona les 3 components de la capa", "spa":"Selecciona las 3 componentes de la capa", "eng":"Select the three components of the layer", "fre":"Sélectionnez les trois composants de la couche"}), " \"", 
			DonaCadena(capa.DescLlegenda),
			"\"<br/>");
	
	for (var i_component=0; i_component<3; i_component++)
	{
		cdns.push("<span id=\"combinacio-rgb-", i_component, "\" class=\"Verdana11px\"><fieldset><legend>",
			DonaCadenaLang({"cat":"Component", "spa":"Componente", "eng":"Component", "fre":"Composant"}), " ");
		switch (i_component)
		{
			case 0:
				cdns.push("R");
				break;
			case 1:
				cdns.push("G");
				break;
			case 2:
				cdns.push("B");
				break;
		}

		cdns.push(":</legend>",
			DonaCadenaComponentDeCombinacioRGB(i_capa, i_component),
			"</fieldset>");
		cdns.push("</span>");
	}
	cdns.push("<hr>",
		DonaCadenaLang({"cat":"La combinació RGB serà afegida com a un estil nou de nom", "spa":"La combinación RGB será añadida como un estilo nuevo de nombre", "eng":"The RGB combination will be added as a new style with name", "fre":"La combinaison RVB sera ajouté en tant que nouveau style avec le nom"}),
		" <input type=\"text\" name=\"nom_estil\" class=\"Verdana11px\" style=\"width:400px;\" value=\"",
		DonaNomNouEstilCombinacioRGB(i_capa),
		"\" /><br/>",
		DonaCadenaLang({"cat":"a la capa", "spa":"a la capa", "eng":"to the layer", "fre":"à la couche"}), 
		" \"", DonaCadena(capa.DescLlegenda), "\"<br/>",
		"<input type=\"button\" class=\"Verdana11px\" value=\"", 
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}), 
	        "\" onClick='CreaBandaCombinacioRGB(",i_capa,"); TancaFinestraLayer(\"combinacioRGB\");' />",
		"</div></form>");
	return cdns.join("");
}

function DonaNomNouEstilCombinacioRGB(i_capa)
{
	return DonaCadenaLang({"cat":"Combinació RGB", "spa":"Combinación RGB", "eng":"RGB combination", "fre":"Combinaison RVB"});
}

function DonaDescripcioValorsCapa(params)
{
var cdns=[];
	for (var i_param=0; i_param<params.length; i_param++)
	{
		cdns.push((params[i_param].clau.desc ? DonaCadena(params[i_param].clau.desc) : params[i_param].clau.nom),
			 " ", 
			(params[i_param].valor.desc ? DonaCadena(params[i_param].valor.desc) : params[i_param].valor.nom));
		if (i_param+1<params.length)
			cdns.push(", ");
	}
	return cdns.join("");
}


//només funciona bé amb i_component<3
function DonaCadenaComponentDeCombinacioRGB(i_capa, i_component)
{
var cdns=[], capa, primers_i_valor_valid=[null, null, null], params;

	capa=ParamCtrl.capa[i_capa];
	cdns.push("<select id=\"combinacio-rgb-component",i_component,"\" name=\"component",i_component,"\" style=\"width:400px;\">");
	for (var i_valor=0; i_valor<capa.valors.length; i_valor++)
	{
		params=capa.valors[i_valor].param;
		if (!params || params.length==0)
			continue;
		if (primers_i_valor_valid[0]==null)
			primers_i_valor_valid[0]=i_valor;
		else if (primers_i_valor_valid[1]==null)
			primers_i_valor_valid[1]=i_valor;
		else if (primers_i_valor_valid[2]==null)
			primers_i_valor_valid[2]=i_valor;
		cdns.push("<option value=\"",i_valor,"\"",
		    	((primers_i_valor_valid[i_component]==i_valor) ? " selected=\"selected\"" : "") ,
			">",
			DonaDescripcioValorsCapa(params),
			"</option>");
	}
	cdns.push("</select>");
	return cdns.join("");
}

function CreaBandaCombinacioRGB(i_capa)
{
var combinacio_rgb, i_estil_nou, estil;

	combinacio_rgb=LlegeixParametresCombinacioRGB();
	//Crea un nou estil
	capa=ParamCtrl.capa[i_capa];
	i_estil_nou=capa.estil.length;
	capa.estil[capa.estil.length]={"nom": null, "desc": combinacio_rgb.nom_estil,"TipusObj": "P", "component": []};
	estil=capa.estil[i_estil_nou];

	for (var i_component=0; i_component<3; i_component++)
	{
		estil.component[i_component]={"i_valor": combinacio_rgb.i_valor[i_component],
					"desc": DonaDescripcioValorsCapa(capa.valors[combinacio_rgb.i_valor[i_component]].param),
					"NDecimals": 0}
		if (capa.estil[0].component && capa.estil[0].component[0] && capa.estil[0].component[0].estiramentPaleta)
			estil.component[i_component].estiramentPaleta=JSON.parse(JSON.stringify(capa.estil[0].component[0].estiramentPaleta));
	}

	if (capa.visible=="ara_no")
		CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
	else
		CreaLlegenda();

	//Defineix el nou estil com estil actiu
	CanviaEstilCapa(i_capa, i_estil_nou, false);
}

function LlegeixParametresCombinacioRGB()
{
var combinacio_rgb={"i_valor": []};

	for (var i_component=0; i_component<3; i_component++)
		combinacio_rgb.i_valor[i_component]=eval("document.CombinacioRGB.component"+i_component+".value");
	combinacio_rgb.nom_estil=document.CombinacioRGB.nom_estil.value;
	return combinacio_rgb;
}


function ObreFinestraEditaEstilCapa(i_capa, i_estil)
{
	if (isFinestraLayer(this, "editaEstil"))
	{
		showFinestraLayer(this, "editaEstil");
		var elem=getLayer(this, "editaEstil_finestra");
		FinestraEditaEstilCapa(elem, i_capa, i_estil);
	}
	else  //missatge error
	{
		alert(DonaCadenaLang({"cat":"No s'ha definit la layer de tipus finestra 'editaEstil' i per tant no es pot usar la funcionalitat de editar l'estil",
						  "spa":"No se ha definido la layer de tipo ventana 'editaEstil' y en consecuencia no se puede usar la funcionalidad de editar el estilo",
						  "eng":"The layer 'editaEstil' has not been defined and its not possible use the funcionality of edit the style",
						  "fre":"La layer de type fenêtre 'editaEstil' n'a été pas définie et il n'est donc pas possible d'utilise l'outil pour modifier le style"}));
	}
}

function FinestraEditaEstilCapa(elem, i_capa, i_estil)
{
	contentLayer(elem, DonaCadenaEditaEstilCapa(i_capa, i_estil));
}

function DonaCadenaEditaEstilCapa(i_capa, i_estil)
{
var cdns=[], capa=ParamCtrl.capa[i_capa], estil=capa.estil[i_estil], valor;

	cdns.push("<form name=\"EstilCapa\" onSubmit=\"return false;\">");
	cdns.push("<div id=\"LayerEstilCapa\" class=\"Verdana11px\" style=\"position:absolute;left:10px;top:10px;\">",
			DonaCadenaLang({"cat":"Sel·lecciona les 3 components de la capa", "spa":"Selecciona las 3 componentes de la capa", "eng":"Select the three components of the layer", "fre":"Sélectionnez les trois composants de la couche"}), " \"", 
			DonaCadena(capa.DescLlegenda),
			"\"<br/>");

	if (estil.component)
	{
		cdns.push("<fieldset><legend>",
			DonaCadenaLang({"cat":"Valors per l'estirament de color", "spa":"Valores para el estiramiento de color", "eng":"Value for stretching of color", "fre":"Valeur pour l'étirement de la couleur"}));
			cdns.push(":</legend>");
		for (var i_c=0; i_c<estil.component.length; i_c++)
		{
			if (estil.component.length>1)
			{
				cdns.push("<fieldset><legend>",
					DonaCadenaLang({"cat":"Component", "spa":"Componente", "eng":"Component", "fre":"Composant"}), " ");
				switch (i_component)
				{
					case 0:
						cdns.push("R");
						break;
					case 1:
						cdns.push("G");
						break;
					case 2:
						cdns.push("B");
						break;
					default:
						cdns.push(i_c);
				}
				cdns.push(":</legend>");
			}
			//Valor mínim i valor màxim
			if (estil.component[i_c].estiramentPaleta && estil.component[i_c].estiramentPaleta.valorMinim)
				valor=estil.component[i_c].estiramentPaleta.valorMinim;
			else 
				valor=0;
			cdns.push("<label for=\"edita-estil-capa-valor-minim-", i_c, "\">", DonaCadenaLang({"cat":"Mínim", "spa":"Mínimo", "eng":"Minimum", "fre":"Minimum"}), ": </label>", 
				"<input type=\"text\" id=\"edita-estil-capa-valor-minim-",i_c, "\" name=\"minim", i_c,"\" value=\"", valor, "\" style=\"width:50px;\" />",
				" (", DonaCadenaLang({"cat":"calculat", "spa":"calculado", "eng":"computed", "fre":"calculé"}), " ", estil.component[i_c].valorMinimReal, " ", 
				"<input type=\"button\" class=\"Verdana11px\" value=\"", DonaCadenaLang({"cat":"Adoptar", "spa":"Adoptar", "eng":"Adopt", "fre":"Adopter"}), 
			        "\" onClick='document.getElementById(\"edita-estil-capa-valor-minim-", i_c, "\").value=", estil.component[i_c].valorMinimReal,";' />",")",
				"<br>");

			if (estil.component[i_c].estiramentPaleta && typeof estil.component[i_c].estiramentPaleta.valorMaxim!=="undefined" && estil.component[i_c].estiramentPaleta.valorMaxim!=null)
				valor=estil.component[i_c].estiramentPaleta.valorMaxim;
			else 
				valor=255;
			cdns.push("<label for=\"edita-estil-capa-valor-maxim-", i_c, "\">", DonaCadenaLang({"cat":"Màxim", "spa":"Máximo", "eng":"Maximum", "fre":"Maximum"}), ": </label>", 
				"<input type=\"text\" id=\"edita-estil-capa-valor-maxim-",i_c, "\" name=\"maxim", i_c,"\" value=\"", valor, "\" style=\"width:50px;\" />",
				" (", DonaCadenaLang({"cat":"calculat", "spa":"calculado", "eng":"computed", "fre":"calculé"}), " ", estil.component[i_c].valorMaximReal, " ", 
				"<input type=\"button\" class=\"Verdana11px\" value=\"", DonaCadenaLang({"cat":"Adoptar", "spa":"Adoptar", "eng":"Adopt", "fre":"Adopter"}), 
			        "\" onClick='document.getElementById(\"edita-estil-capa-valor-maxim-", i_c, "\").value=", estil.component[i_c].valorMaximReal,";' />",")");
			if (estil.component.length>1)
				cdns.push("</fieldset>");
		}
		cdns.push("</fieldset>");
	}
	cdns.push("<input type=\"button\" class=\"Verdana11px\" value=\"", 
		DonaCadenaLang({"cat":"Acceptar", "spa":"Aceptar", "eng":"OK", "fre":"Accepter"}), 
	        "\" onClick='EditaEstilCapa(", i_capa, ",", i_estil, ");TancaFinestraLayer(\"editaEstil\");' />",
		"</div></form>");
	return cdns.join("");
}

function EditaEstilCapa(i_capa, i_estil)
{
var capa=ParamCtrl.capa[i_capa], estil=capa.estil[i_estil], valor_min, valor_max;

	if (estil.component)
	{
		for (var i_c=0; i_c<estil.component.length; i_c++)
		{
			valor_min=parseFloat(document.getElementById("edita-estil-capa-valor-minim-" + i_c).value);
			valor_max=parseFloat(document.getElementById("edita-estil-capa-valor-maxim-" + i_c).value);
			if (valor_min==0 && valor_max==255)
			{
				if (estil.component[i_c].estiramentPaleta)
					delete estil.component[i_c].estiramentPaleta;
			}
			else
			{
				estil.component[i_c].estiramentPaleta={"valorMinim": valor_min,
								"valorMaxim": valor_max};
			}
		}
	}
	CanviaEstilCapa(i_capa, i_estil, true);
}
