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

    Funcions i codi en mode immediat per a les plantilles d'impressió.
    Joan Masó   15-01-2007 
*/

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
	with (window.opener.parent.opener)
	{
		this.document.title=DonaCadena(ParamCtrl.titol);
		var elem=getLayer(this, "vista");
		if (isLayer(elem) &&
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectVista.esq==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectVista.sup==0 && 
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectVista.ample==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectVista.alt==0)
		{
			
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectVista=getRectLayer(elem);
			if (isLayerVisible(elem))
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir|=CalImprimirVista;
			else
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&=~CalImprimirVista;
			if (this.RespectarResolucioVista)
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir|=RespectarResolucioVistaImprimir;
			else
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&=~RespectarResolucioVistaImprimir;
		}
		elem=getLayer(this, "escala");
		if (isLayer(elem) &&
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectEscala.esq==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectEscala.sup==0 && 
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectEscala.ample==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectEscala.alt==0)
		{
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectEscala=getRectLayer(elem);
			if (isLayerVisible(elem))
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir|=CalImprimirEscala;
			else
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&=~CalImprimirEscala;
		}
		elem=getLayer(this, "titol");
		if (isLayer(elem) && 
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectTitol.esq==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectTitol.sup==0 && 
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectTitol.ample==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectTitol.alt==0)
		{
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectTitol=getRectLayer(elem);
			if (isLayerVisible(elem))
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir|=CalImprimirTitol;
			else
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&=~CalImprimirTitol;
		}
		elem=getLayer(this, "llegenda");
		if (isLayer(elem) &&
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectLlegenda.esq==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectLlegenda.sup==0 && 
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectLlegenda.ample==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectLlegenda.alt==0)
		{
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectLlegenda=getRectLayer(elem);
			if (isLayerVisible(elem))
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir|=CalImprimirLlegenda;
			else
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&=~CalImprimirLlegenda;
		}
		elem=getLayer(this, "situacio");
		if (isLayer(elem) &&
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectSituacio.esq==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectSituacio.sup==0 && 
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectSituacio.ample==0 && plantilla_dimpressio_intern[IPlantillaDImpressio].RectSituacio.alt==0)
		{
			plantilla_dimpressio_intern[IPlantillaDImpressio].RectSituacio=getRectLayer(elem);
			if (isLayerVisible(elem))
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir|=CalImprimirSituacio;
			else
				plantilla_dimpressio_intern[IPlantillaDImpressio].CalImprimir&=~CalImprimirSituacio;
		}
		if (plantilla_dimpressio_intern[IPlantillaDImpressio].LayersPropies.length==0)
		{
		    for (var i=0; i<this.layerList.length; i++)
		    {
			if (this.layerList[i]=="vista" ||
			    this.layerList[i]=="escala" ||
			    this.layerList[i]=="titol" ||
			    this.layerList[i]=="situacio" ||
			    this.layerList[i]=="llegenda")
			    continue;
			elem=getLayer(this, this.layerList[i]);
			var rect=getRectLayer(elem);
			
			IniciaLayerPropiaPlantillaDImpressio(IPlantillaDImpressio, plantilla_dimpressio_intern[IPlantillaDImpressio].LayersPropies.length,
						isLayerVisible(elem),
						rect.esq, rect.sup, rect.ample, rect.alt,
						getContentLayer(elem),
						i);
		    }
		}
	}
	window.opener.DibuixaEditsMides();
	window.opener.RedibuixaRadialsIChecks();
	window.opener.ReompleEditsMides();
	window.opener.MouLayersImpressio(true);
}


var RespectarResolucioVista=false;  //El valor d'aquesta variable pot ser modificat pel redactor de la plantilla.
document.write("<body onLoad=\"ModificaPlantillaImpressio();\" onFocus=\"RenunciaAFocus();\" onunLoad=\"SurtModificaPlantillaImpressio();\" onafterPrint=\"window.opener.parent.close();window.close();\">");
