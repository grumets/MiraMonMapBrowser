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
    
    Funcions i codi en mode immediat per a les plantilles d'impressió.
    Joan Masó   15-01-2007 
*/

//ATENCIO: Aquest mòdul NO s'ha d'incloure a la plana principal

"use strict"

/*Duplicar la funció de createLayer em permet tenir un array
  diferent de layers per a cada plantilla d'impressió i pel
  navegador. Malgrat tot, ara per ara aquest array no s'usa.*/

var layerList = [];
var layerListDesc = [];
function createLayer(win, name, desc, left, top, width, height, visible, content) 
{
  var z = layerList.length;

  layerList[z] = name;
  layerListDesc[z] = desc;
  
  if (win.document.layers) 
  {  // Netscape
    win.document.writeln('<layer name="' + name + '" left=' + left + ' top=' + top + ' width=' + width + ' height=' + height + ' visibility=' + (visible ? '"show"' : '"hide"') + ' z-index=' + z +'>');
    win.document.writeln((content) ? window.opener.parent.opener.DonaCadena(content) : "-"+name+"-");
    win.document.writeln('</layer>');    
    win.document.layers[name].width = width;
    win.document.layers[name].height = height;        
  }
  else if (win.document.all || win.document.getElementById) 
  {  	// Explorer
    win.document.writeln('<div id="' + name + '" style="position:absolute; overflow:visible; left:' + left + 'px; top:' + top + 'px; width:' + width + '; height:' + height + 'px;' + ' visibility:' + (visible ? 'visible;' : 'hidden;') + ' z-index:' + z + ';">');
    win.document.writeln((content) ? window.opener.parent.opener.DonaCadena(content) : "-"+name+"-");
    win.document.writeln('</div>');
  }
  else
  {
	;
  }
  if (name!="vista" && name!="escala" && name!="titol" && name!="llegenda" && name!="situacio")
  {
	;
  }
}

function RenunciaAFocus()
{
	window.opener.focus();
}

//var TimerModificaPlantilla=null;

function SurtModificaPlantillaImpressio()
{
//	if (TimerModificaPlantilla)
//		clearTimeout(TimerModificaPlantilla);
	if (window.opener && window.opener.FullImprimirWindow)
		window.opener.FullImprimirWindow=null;
}

//function EsperaIModificaPlantillaImpressio()
//{
//	TimerModificaPlantilla=setTimeout("ModificaPlantillaImpressio()", 500)
//}

function ModificaPlantillaImpressio()
{
var win=window.opener.parent.opener;
	window.document.title=win.DonaCadena(win.ParamCtrl.titol);
	var elem=win.getLayer(window, "vista");
	if (win.isLayer(elem) &&
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectVista.esq==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectVista.sup==0 && 
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectVista.ample==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectVista.alt==0)
	{		
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectVista=win.getRectLayer(elem);
		if (win.isLayerVisible(elem))
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir|=win.CalImprimirVista;
		else
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir&=~win.CalImprimirVista;
		if (window.RespectarResolucioVista)
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir|=win.RespectarResolucioVistaImprimir;
		else
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir&=~win.RespectarResolucioVistaImprimir;
	}
	elem=win.getLayer(window, "escala");
	if (win.isLayer(elem) &&
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectEscala.esq==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectEscala.sup==0 && 
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectEscala.ample==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectEscala.alt==0)
	{
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectEscala=win.getRectLayer(elem);
		if (win.isLayerVisible(elem))
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir|=win.CalImprimirEscala;
		else
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir&=~win.CalImprimirEscala;
	}
	elem=win.getLayer(window, "titol");
	if (win.isLayer(elem) && 
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectTitol.esq==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectTitol.sup==0 && 
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectTitol.ample==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectTitol.alt==0)
	{
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectTitol=win.getRectLayer(elem);
		if (win.isLayerVisible(elem))
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir|=win.CalImprimirTitol;
		else
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir&=~win.CalImprimirTitol;
	}
	elem=win.getLayer(window, "llegenda");
	if (win.isLayer(elem) &&
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectLlegenda.esq==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectLlegenda.sup==0 && 
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectLlegenda.ample==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectLlegenda.alt==0)
	{
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectLlegenda=win.getRectLayer(elem);
		if (win.isLayerVisible(elem))
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir|=win.CalImprimirLlegenda;
		else
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir&=~win.CalImprimirLlegenda;
	}
	elem=win.getLayer(window, "situacio");
	if (win.isLayer(elem) &&
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectSituacio.esq==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectSituacio.sup==0 && 
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectSituacio.ample==0 && win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectSituacio.alt==0)
	{
		win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].RectSituacio=win.getRectLayer(elem);
		if (win.isLayerVisible(elem))
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir|=win.CalImprimirSituacio;
		else
			win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].CalImprimir&=~win.CalImprimirSituacio;
	}
	if (win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].LayersPropies.length==0)
	{
		for (var i=0; i<window.layerList.length; i++)
		{
			if (window.layerList[i]=="vista" ||
				window.layerList[i]=="escala" ||
				window.layerList[i]=="titol" ||
				window.layerList[i]=="situacio" ||
				window.layerList[i]=="llegenda")
				continue;
			elem=win.getLayer(window, window.layerList[i]);
			var rect=win.getRectLayer(elem);
			
			win.IniciaLayerPropiaPlantillaDImpressio(win.IPlantillaDImpressio, win.plantilla_dimpressio_intern[win.IPlantillaDImpressio].LayersPropies.length,
						win.isLayerVisible(elem),
						rect.esq, rect.sup, rect.ample, rect.alt,
						win.getContentLayer(elem),
						i);
		}
	}
	window.opener.DibuixaEditsMides();
	window.opener.RedibuixaRadialsIChecks();
	window.opener.ReompleEditsMides();
	window.opener.MouLayersImpressio(true);
}


var RespectarResolucioVista=false;  //El valor d'aquesta variable pot ser modificat pel redactor de la plantilla.
document.write("<body onLoad=\"ModificaPlantillaImpressio();\" onFocus=\"RenunciaAFocus();\" onunLoad=\"SurtModificaPlantillaImpressio();\" onafterPrint=\"window.opener.parent.close();window.close();\">");
