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

const OrigenUsuari="usuari";

function AfegeixOModificaCapaWMSAlNavegador(i_format_get_map, servidorGC, i_on_afegir, i_layer, i_get_featureinfo)
{
	
var i_capa, layer=servidorGC.layer[i_layer], capa=ParamCtrl.capa;

	// Si la capa ja existeix la modifico i sinó l'afegeixo
	var nom_serv=DonaNomServidorSenseCaracterFinal(servidorGC.servidor).toLowerCase();
	var tipus=DonaTipusServidorCapa(layer);
	for(i_capa=0; i_capa<capa.length; i_capa++)
	{
		if (nom_serv==DonaServidorCapa(capa[i_capa]).toLowerCase() &&
			capa[i_capa].nom==layer.nom && tipus==DonaTipusServidorCapa(capa[i_capa]))
			break;
	}
	if(i_capa==capa.length)
	{
		 AfegeixCapaWMSAlNavegador(i_format_get_map, servidorGC, i_on_afegir, i_layer, i_get_featureinfo, (layer.esCOG && layer.uriDataTemplate)? "ara_no": "si"); // Marco els TIFF com a visibles "ara_no" NJ_07_03_2023
		 return true;
	}
	
	// Actualitzo l'array de dates
	if(layer.data)
		capa[i_capa].data=JSON.parse(JSON.stringify(layer.data));	
	return false;
}

function DonaIndexDimensioLayerPerNom(dimensioExtra, nom)
{
	for(var i=0; i<dimensioExtra.length; i++)
	{
		if(dimensioExtra[i].clau && dimensioExtra[i].clau.nom.toLowerCase()==nom.toLowerCase())
			return i;
	}
	return -1;
}

function AfegeixCapaWMSAlNavegador(i_format_get_map, servidorGC, i_on_afegir, i_layer, i_get_featureinfo, visible)
{
var j, k, z, estils, estil, minim, maxim;
var alguna_capa_afegida=false, layer=servidorGC.layer[i_layer], capa, estilPerCapa=null, dimensioPerCapa=null, nodataPerCapa=null, i_dimensio_layer=-1;
var trobat=false, criteris;

	//COLOR_TIF_06092022: Ancora per lligar els 3 llocs on es gestiones els colors i categories dels fitxers TIFF
	if (layer.dimensioExtra && servidorGC.param_func_after && servidorGC.param_func_after.dimensioPerCapa)
	{
		trobat=false;
		for(j=0; j<servidorGC.param_func_after.dimensioPerCapa.length; j++)
		{
			if(-1!=(i_dimensio_layer=DonaIndexDimensioLayerPerNom(layer.dimensioExtra, servidorGC.param_func_after.dimensioPerCapa[j].nom)) &&
			   servidorGC.param_func_after.dimensioPerCapa[j].criteris && servidorGC.param_func_after.dimensioPerCapa[j].formulaDesc)
			{
				criteris=servidorGC.param_func_after.dimensioPerCapa[j].criteris;
				for(k=0; k<criteris.length; k++)
				{
					trobat=false;
					if(criteris[k].clau=="Keyword" && layer.keywords && layer.keywords.length>0)
					{
						for(z=0; z<layer.keywords.length; z++)
						{
							if(criteris[k].valor.toLowerCase()==layer.keywords[z].toLowerCase())
							{
								trobat=true;
								break;
							}
						}
						if(!trobat)
						{							
							//no trobat, no cal que continui mirant els criteris d'aquest estil
							break;
						}
					}
				}
				if(trobat)
				{
					// S'han complert tots els criteris i per tant he trobat la dimensió a aplicar a la capa
					dimensioPerCapa=servidorGC.param_func_after.dimensioPerCapa[j];									
					break;
				}
			}
		}		
	}
	if (servidorGC.param_func_after && servidorGC.param_func_after.nodataPerCapa)
	{
		trobat=false;
		for(j=0; j<servidorGC.param_func_after.nodataPerCapa.length; j++)
		{
			if(servidorGC.param_func_after.nodataPerCapa[j].criteris && servidorGC.param_func_after.nodataPerCapa[j].nodata)
			{
				criteris=servidorGC.param_func_after.nodataPerCapa[j].criteris;
				for(k=0; k<criteris.length; k++)
				{
					trobat=false;
					if(criteris[k].clau=="Keyword" && layer.keywords && layer.keywords.length>0)
					{
						for(z=0; z<layer.keywords.length; z++)
						{
							if(criteris[k].valor.toLowerCase()==layer.keywords[z].toLowerCase())
							{
								trobat=true;
								break;
							}
						}
						if(!trobat)
						{							
							//no trobat, no cal que continui mirant els criteris d'aquest nodata
							break;
						}
					}
				}
				if(trobat)
				{
					// S'han complert tots els criteris i per tant he trobat el nodata a aplicar a la capa
					nodataPerCapa=servidorGC.param_func_after.nodataPerCapa[j].nodata;
					break;
				}
			}
		}
		
	}
	if (servidorGC.param_func_after && servidorGC.param_func_after.estilPerCapa)
	{
		trobat=false;
		for(j=0; j<servidorGC.param_func_after.estilPerCapa.length; j++)
		{
			if(servidorGC.param_func_after.estilPerCapa[j].criteris && servidorGC.param_func_after.estilPerCapa[j].estil)
			{
				criteris=servidorGC.param_func_after.estilPerCapa[j].criteris;
				for(k=0; k<criteris.length; k++)
				{
					trobat=false;
					if(criteris[k].clau=="Keyword" && layer.keywords && layer.keywords.length>0)
					{
						for(z=0; z<layer.keywords.length; z++)
						{
							if(criteris[k].valor.toLowerCase()==layer.keywords[z].toLowerCase())
							{
								trobat=true;
								break;
							}
						}
						if(!trobat)
						{							
							//no trobat, no cal que continui mirant els criteris d'aquest estil
							break;
						}
					}
				}
				if(trobat)
				{
					// S'han complert tots els criteris i per tant he trobat l'estil a aplicar a la capa
					estilPerCapa=servidorGC.param_func_after.estilPerCapa[j].estil;
					break;
				}
			}
		}
		
	}
	if(layer.estil && layer.estil.length>0)
	{
		estils=[];
		for(j=0; j<layer.estil.length; j++)
		{
			if(estilPerCapa)
			{
				estils[estils.length]=JSON.parse(JSON.stringify(estilPerCapa));
				estil=estils[estils.length-1];
				estil.nom =layer.estil[j].nom;
				if(!estil.desc)
					estil.desc =DonaCadenaNomDesc(layer.estil[j]);
				if(!estil.DescItems)
					estil.DescItems =layer.uom;
			}
			else
			{
				estils[estils.length]={nom: layer.estil[j].nom,
						desc: DonaCadenaNomDesc(layer.estil[j]),
						DescItems: layer.uom,
						metadades: null,
						ItemLleg: null,
						ncol: 0};
				estil=estils[estils.length-1];
			}
			if (layer.esCOG && layer.uriDataTemplate)
			{
				if(!estil.component)
					estil.component=[{"i_valor": 0}];
				if (layer.vom=="Land Water Transition Zone - Hydroperiod" && !estil.component[0].estiramentPaleta)
					estil.component[0].estiramentPaleta={valorMinim: 0, valorMaxim: 365};
			}
			if (layer.categories && layer.categories.length && !estil.categories)
			{
				estil.categories=[];
				var s=layer.uom ? layer.uom : GetMessage("Class");
				for (k=0; k<layer.categories.length; k++)
				{
					if (layer.categories[k])
					{
						estil.categories[k]={};
						estil.categories[k][s]=layer.categories[k];
					}
					else
						estil.categories[k]=null;
				}
				estil.atributs=[{nom: s, unitats: layer.uom, mostrar: "si"}];
			}
		}
	}
	else
	{
		if(estilPerCapa)
		{
			estils=[];
			estils[0]=JSON.parse(JSON.stringify(estilPerCapa));
		}
		else
			estils=null;
	}

	if(layer.CostatMinim && layer.CostatMinim>=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat)
		minim=layer.CostatMinim;
	else
		minim=ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
	if(layer.CostatMaxim && layer.CostatMaxim<=ParamCtrl.zoom[0].costat)
		maxim=layer.CostatMaxim;
	else
		maxim=ParamCtrl.zoom[0].costat;


	if(i_on_afegir==-1)
		k=ParamCtrl.capa.length;
	else
	{
		k=i_on_afegir;
		CanviaIndexosCapesSpliceCapa(1, k, -1, ParamCtrl);
	}

	ParamCtrl.capa.splice(k, 0, 
		(layer.esCOG && layer.uriDataTemplate) ? 
			IniciaDefinicioCapaTIFF(layer.uriDataTemplate, layer.desc, layer.CRSs, visible)
			:
			{servidor: servidorGC.servidor,
				versio: servidorGC.versio,
				tipus: servidorGC.tipus,
				nom: layer.nom,
				desc: layer.desc,
				CRS: layer.CRSs ? layer.CRSs : [ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS],
				FormatImatge: servidorGC.formatGetMap[i_format_get_map],
				transparencia: "semitransparent",
				CostatMinim: minim,
				CostatMaxim: maxim,
				FormatConsulta: (i_get_featureinfo==-1 ? null :servidorGC.formatGetFeatureInfo[i_get_featureinfo]),
				separa: DonaTextSeparadorCapaAfegida(k),
				DescLlegenda: DonaCadenaNomDesc(layer),
				estil: estils,
				i_estil: 0,
				NColEstil: (estils && estils.length>0) ? 1: 0,
				LlegDesplegada: false,
				VisibleALaLlegenda: true,
				visible: visible ? visible: "si",
				consultable: (i_get_featureinfo!=-1 && layer.consultable)? "si" : "no",
				descarregable: "no",
				FlagsData: layer.FlagsData,
				data: JSON.parse(JSON.stringify(layer.data)),
				i_data: layer.i_data,
				animable: (layer.data)? true: false,
				AnimableMultiTime: (layer.data)? true:false,
				origen: OrigenUsuari}
		);

	capa=ParamCtrl.capa[k];
	capa.access=(servidorGC.access) ? JSON.parse(JSON.stringify(servidorGC.access)): null;
	
	if(layer.dimensioExtra)
	{
		capa.dimensioExtra=JSON.parse(JSON.stringify(layer.dimensioExtra));
		if(dimensioPerCapa && i_dimensio_layer!=-1)
			capa.dimensioExtra[i_dimensio_layer].formulaDesc=dimensioPerCapa.formulaDesc;
	}
	else
		capa.dimensioExtra=null;
	

	if (layer.uriMDTemplate)
		capa.metadades={standard: layer.uriMDTemplate};
	if (layer.EnvLL)
		capa.EnvTotal={EnvCRS: JSON.parse(JSON.stringify(layer.EnvLL)), CRS:"EPSG:4326"};
	
	if (layer.esCOG && layer.uriDataTemplate)
	{
		capa.CostatMinim=minim;
		capa.CostatMaxim=maxim;
		if (capa.EnvTotal && capa.EnvTotal.EnvCRS)
			capa.EnvTotalLL=DonaEnvolupantLongLat(capa.EnvTotal.EnvCRS, capa.EnvTotal.CRS);

		
		
		capa.valors=[{ datatype: "float32",
					   nodata: (nodataPerCapa)? JSON.parse(JSON.stringify(nodataPerCapa)) : null //[-9999, 0] NJ Ho trec perque sinó no puc distingir entre el que m'ha dit l'usuari i el que he posat per defecte
					}],  //provisional. CompletaDefinicioCapaTIFF ho reescriu amb informació del propi TIFF
		capa.estil=estils;
		CompletaDescarregaTotCapa(capa); // això ho necessito fer per marcar la capa com a descarregable
		//CompletaDefinicioCapa() es fa més tard dins de PreparaLecturaTiff()
	}
	else
		CompletaDefinicioCapa(capa);

	if (ParamCtrl.LlegendaAmagaSegonsEscala && !EsCapaDinsRangDEscalesVisibles(capa))
		alert(GetMessage("NewLayerAdded", "cntxmenu")+", \'"+DonaCadenaNomDesc(capa)+"\' "+GetMessage("notVisibleInCurrentZoom", "cntxmenu"));
}

/* i_capa es passa en el context que estic demanat els indexos en relació a una capa concreta,
per si la definicó d'algun v[] d'aquell no indica i_capa explícitament, com per exemple passa
en crear un flistre espacial a partir d'una banda de la mateixa capa
En contextos on no te sentit (per exemple a AfegeixCapaCalcul no es passa i està protegit) */
function DonaIndexosACapesDeCalcul(calcul, i_capa)
{
var fragment, cadena, i_capes=[], inici, final, nou_valor;

	fragment=calcul;
	while ((inici=fragment.indexOf('{'))!=-1)
	{
		//busco una clau de tancar
		final=fragment.indexOf('}');
		if (final==-1)
		{
			alert("Character '{' without '}' in 'calcul'" + (typeof i_capa!=="undefined" ? (" in capa" + i_capa) : ""));
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		nou_valor=JSON.parse(cadena);
		if (typeof nou_valor.i_capa === "undefined" && typeof i_capa !== "undefined")
			i_capes.push(i_capa);
		else
			i_capes.push(nou_valor.i_capa);
		fragment=fragment.substring(final+1, fragment.length);
	}
	i_capes.sort(sortAscendingNumber);
	//EliminaRepeticionsArray(i_capes, sortAscendingNumber);
	i_capes.removeDuplicates(sortAscendingNumber);

	return i_capes;
}

function AlgunaCapaAmbDataNoDefecteACalcul(calcul)
{
var fragment, cadena, inici, final, nou_valor;

	fragment=calcul;
	while ((inici=fragment.indexOf('{'))!=-1)
	{
		//busco una clau de tancar
		final=fragment.indexOf('}');
		if (final==-1)
		{
			alert("Character '{' without '}' in 'calcul'");
			break;
		}
		cadena=fragment.substring(inici, final+1);
		//interpreto el fragment metajson
		nou_valor=JSON.parse(cadena);
		if (typeof nou_valor.i_data !== "undefined")
			return true;
		fragment=fragment.substring(final+1, fragment.length);
	}
	return false;
}


function DeterminaEnvTotalDeCapes(i_capes)
{
var env={MinX: +1e300, MaxX: -1e300, MinY: +1e300, MaxY: -1e300}, i;

	if (!i_capes.length || !ParamCtrl.capa[i_capes[0]].EnvTotal)
		return null;
	if (i_capes.length==1)
		return JSON.parse(JSON.stringify(ParamCtrl.capa[i_capes[0]].EnvTotal));
	for (i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].EnvTotal)
			return null;
		if (i<0 && !DonaCRSRepresentaQuasiIguals(ParamCtrl.capa[i_capes[i]].EnvTotal.CRS, ParamCtrl.capa[i_capes[i-1]].EnvTotal.CRS))
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
		return {EnvCRS: env, CRS: "EPSG:4326"};
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
		return {"EnvCRS": env, "CRS": ParamCtrl.capa[i_capes[0]].EnvTotal.CRS};
	}
}

function DeterminaCostatMinimDeCapes(i_capes)
{
var costat=1e300;

	if (!i_capes.length)
		return ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;

	for (var i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].CostatMinim)
			return ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat;
		if (costat>ParamCtrl.capa[i_capes[i]].CostatMinim)
			costat=ParamCtrl.capa[i_capes[i]].CostatMinim;
	}
	return (costat==1e300) ? ParamCtrl.zoom[ParamCtrl.zoom.length-1].costat : costat;
}

function DeterminaCostatMaximDeCapes(i_capes)
{
var costat=1e-300;

	if (!i_capes.length)
		return ParamCtrl.zoom[0].costat;

	for (var i=0; i<i_capes.length; i++)
	{
		if (!ParamCtrl.capa[i_capes[i]].CostatMaxim)
			return ParamCtrl.zoom[0].costat;
		if (costat<ParamCtrl.capa[i_capes[i]].CostatMaxim)
			costat=ParamCtrl.capa[i_capes[i]].CostatMaxim;
	}
	return (costat==1e-300) ? ParamCtrl.zoom[0].costat : costat;
}

function AfegeixCapaCalcul(calcul, desc_capa)
{
var alguna_capa_afegida=false;

var i_capes=DonaIndexosACapesDeCalcul(calcul);

	var i_capa=Math.min.apply(Math, i_capes); //https://www.w3schools.com/js/js_function_apply.asp

	if (i_capes.length>1 || AlgunaCapaAmbDataNoDefecteACalcul(calcul)) //Si en l'expressió entra en joc més d'una capa o les dates no son les dades per defecte -> la capa calculada és una capa nova
	{
		//AZ: pensar què fer amb origen en aquest cas, si es posa a nivell de capa (encara no al config.json) i/o de estil

		ParamCtrl.capa.splice(i_capa, 0, {servidor: null,
			versio: null,
			tipus: null,
			nom:	"ComputedLayer",
			desc:	(desc_capa) ? desc_capa : "Computed layer",
			CRS: (i_capes.length ? JSON.parse(JSON.stringify(ParamCtrl.capa[i_capes[0]].CRS)) : null),
			EnvTotal: DeterminaEnvTotalDeCapes(i_capes),
			FormatImatge: "application/x-img",
			valors: [],
			transparencia: "semitransparent",
			CostatMinim: DeterminaCostatMinimDeCapes(i_capes),
			CostatMaxim: DeterminaCostatMaximDeCapes(i_capes),
			TileMatrixSet: null,
			FormatConsulta: null,
			grup:	null,
			separa: DonaTextSeparadorCapaAfegida(i_capa),
			DescLlegenda: (desc_capa) ? desc_capa : "Computed layer",
			estil: [{
				nom:	null,
				desc:	(desc_capa) ? desc_capa : "Computed layer",
				TipusObj: "P",
				component: [{
					calcul: document.CalculadoraCapes.calcul.value,
					estiramentPaleta: {auto: true}
				}],
				metadades: null,
				nItemLlegAuto: 20,
				ncol: 4,
				descColorMultiplesDe: 0.01
			}],
			i_estil:	0,
			NColEstil:	1,
			LlegDesplegada:	false,
			VisibleALaLlegenda:	true,
			visible:	"si",
			visible_vista:	null,
			consultable:	"si",
			descarregable:	"no",
			metadades:	null,
			NomVideo:	null,
			DescVideo:	null,
			FlagsData: null,
			data: null,
			i_data: 0,
			animable:	false, //··Segurament la capa es podria declarar animable si alguna capa té els temps "current" i és multitime.
			AnimableMultiTime: false,  //··Segurament la capa es podria declarar AnimableMultiTime si alguna capa té els temps "current" i és multitime.
			proces:	null,
			ProcesMostrarTitolCapa: false,
			origen: OrigenUsuari
			});

		if (i_capa<ParamCtrl.capa.length)  //això és fa després, donat que els índex de capa de la capa nova es poden referir a capes que s'han mogut.
			CanviaIndexosCapesSpliceCapa(1, i_capa, -1, ParamCtrl);

		CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

		//Redibuixo el navegador perquè les noves capes siguin visibles
		RevisaEstatsCapes();
		RepintaMapesIVistes();
	}
	else //si en l'expressió només entra en joc una capa (la i_capa) -> la capa calculada s'afegeix com un estil de la mateixa
	{
		var capa=ParamCtrl.capa[i_capa];
		capa.estil.push({
				nom:	null,
				desc:	(desc_capa) ? desc_capa : "Computed style",
				TipusObj: "P",
				component: [{
					calcul: calcul,
					estiramentPaleta: {auto: true}
				}],
				metadades: null,
				nItemLlegAuto: 20,
				ncol: 4,
				descColorMultiplesDe: 0.01,
				origen: OrigenUsuari
			});

			if (capa.visible=="ara_no")
				CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
			else
				CreaLlegenda();

			//Defineix el nou estil com estil actiu
			CanviaEstilCapa(i_capa, capa.estil.length-1, false);
	}
}//Fi de AfegeixCapaCalcul()

function AfegeixSimbolitzacioVectorDefecteCapa(capa)
{
	capa.estil=[{nom: null,
			desc: capa.desc,
			DescItems: null,
			TipusObj: "P",
			metadades: null,
			ItemLleg: [
				{
					color: "#377200",
					DescColor: capa.desc
				}
			],
			ncol: 1,
			simbols:
			[{
				simbol:
				[
					{
						icona:
						{
							type: "circle",
							r: 6
						}
					}
				]
			}],
			formes: [
				{
					vora: {
						paleta: {
							colors: [
								"#377200"
							]
						}
					},
					interior: {
						paleta: {
							colors: [
								"rgba(25,48,0,0.3)"
							]
						}
					}
				}	
			]
		}];

	capa.separa=null;
	capa.DescLlegenda=capa.desc;
	capa.i_estil=0;
	capa.NColEstil=1;
	capa.LlegDesplegada=false;
	capa.VisibleALaLlegenda=true;
}

function AfegeixCapaGeoJSON_URL(url, i_on_afegir)
{
var k;
	if(i_on_afegir==-1)
		k=ParamCtrl.capa.length;
	else
	{
		k=i_on_afegir;
		CanviaIndexosCapesSpliceCapa(1, k, -1, ParamCtrl);
	}
	ParamCtrl.capa.splice(k, 0, {servidor: url,
				versio: null,
				tipus: "TipusHTTP_GET",
				model: model_vector,
				nom: null,
				desc: TreuAdreca(url),
				CRSgeometry: "EPSG:4326",
				objectes: null,
				atributs: null,
				FormatImatge: "application/json",
				transparencia: "opac",
				CostatMinim: null,
				CostatMaxim: null,
				FormatConsulta: null,
				visible: "si",
				consultable: "si",
				descarregable: "no",
				FlagsData: null,
				data: null,
				i_data: 0,
				animable: false,
				AnimableMultiTime: false,
				origen: OrigenUsuari});

	AfegeixSimbolitzacioVectorDefecteCapa(ParamCtrl.capa[k]);
	CompletaDefinicioCapa(ParamCtrl.capa[k]);

	//Redibuixo el navegador perquè les noves capes siguin visibles
	//RevisaEstatsCapes();
	RepintaMapesIVistes();
}

function DefineixAtributsCapaVectorSiCal(capa)
{
	if (!capa.atributs && capa.objectes && capa.objectes.features && capa.objectes.features.length && 
		capa.objectes.features[0].properties)
	{
		//Si els atributs no estaven definits es defineixen de manera trivial
		capa.atributs=[];
		for (var j in capa.objectes.features[0].properties)
		{
			capa.atributs.push({"nom": j,
						"descripcio": j,
						"mostrar": "si_ple"});
		}
	}
}

function AfegeixCapaGeoJSON(desc, objectes, i_on_afegir)
{
var k;
	if(i_on_afegir==-1)
		k=ParamCtrl.capa.length;
	else
	{
		k=i_on_afegir;
		CanviaIndexosCapesSpliceCapa(1, k, -1, ParamCtrl);
	}
	ParamCtrl.capa.splice(k, 0, {servidor: null,
				versio: null,
				tipus: null,
				model: model_vector,
				nom: null,
				desc: desc,
				CRSgeometry: "EPSG:4326",
				objectes: objectes,
				atributs: null,
				FormatImatge: "application/json",
				transparencia: "opac",
				CostatMinim: null,
				CostatMaxim: null,
				FormatConsulta: null,
				visible: "si",
				consultable: "si",
				descarregable: "no",
				FlagsData: null,
				data: null,
				i_data: 0,
				animable: false,
				AnimableMultiTime: false,
				origen: OrigenUsuari});
	
	DefineixAtributsCapaVectorSiCal(ParamCtrl.capa[k]);
	AfegeixSimbolitzacioVectorDefecteCapa(ParamCtrl.capa[k]);
	CompletaDefinicioCapa(ParamCtrl.capa[k]);
		
	//Redibuixo el navegador perquè les noves capes siguin visibles
	//RevisaEstatsCapes();
	RepintaMapesIVistes();
}

function IniciaDefinicioCapaTIFF(url, desc, CRSs, visible)
{
	return {servidor: url,
			versio: null,
			tipus: "TipusHTTP_GET",
			nom: null,
			desc: desc,
			CRS: CRSs,
			FormatImatge: "image/tiff",
			valors: [],
			transparencia: "semitrasparent",
			CostatMinim: null,
			CostatMaxim: null,
			FormatConsulta: null,
			separa: null,
			DescLlegenda: desc,
			estil: null,
			i_estil: 0,
			NColEstil: 1,
			LlegDesplegada: false,
			VisibleALaLlegenda: true,
			visible: visible ? visible: "si",
			consultable: "si",
			descarregable: "no",
			FlagsData: null,
			data: null,
			i_data: 0,
			animable: false,
			AnimableMultiTime: false,
			origen: OrigenUsuari};
}

async function CompletaDefinicioCapaTIFF(capa, tiff, url, descEstil, i_valor)
{
	var image = await tiff.getImage();

	if (capa.servidor)
	{
		capa.tiff=tiff;
		capa.i_data_tiff=0;
	}

	if (image.getGeoKeys() && (image.getGeoKeys().ProjectedCSTypeGeoKey || image.getGeoKeys().GeographicTypeGeoKey))
	{
		/*NJ_27_02_2023: Trec aquesta protecció ja no cal ara que reprojectem el COG's
		if (capa.CRS && capa.CRS.length && capa.CRS[0]!="EPSG:"+(image.getGeoKeys().ProjectedCSTypeGeoKey ? image.getGeoKeys().ProjectedCSTypeGeoKey : image.getGeoKeys().GeographicTypeGeoKey))
		{
			alert("Incompatible CRSs among the set of TIFF files. Add them separatelly.");
			return;
		}*/
		capa.CRS=["EPSG:"+(image.getGeoKeys().ProjectedCSTypeGeoKey ? image.getGeoKeys().ProjectedCSTypeGeoKey : image.getGeoKeys().GeographicTypeGeoKey)];
		if (capa.origen==OrigenUsuari && ParamCtrl.LlegendaAmagaSiForaCRS && !DonaCRSRepresentaQuasiIguals(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRS[0]))
			alert(GetMessage("NewLayerAdded", "cntxmenu")+", \'"+DonaCadenaNomDesc(capa)+"\' "+GetMessage("notVisibleInCurrentCRS", "cntxmenu") + ".\n" + GetMessage("OnlyVisibleInTheFollowCRS", "cntxmenu") + ": " + DonaDescripcioCRS(capa.CRS[0]));
		var bbox = image.getBoundingBox();
		capa.EnvTotal={"EnvCRS": { "MinX": bbox[0], "MaxX": bbox[2], "MinY": bbox[1], "MaxY": bbox[3]}, "CRS": capa.CRS[0]}
		if (capa.origen==OrigenUsuari && ParamCtrl.LlegendaAmagaSiForaEnv && 
			DonaCRSRepresentaQuasiIguals(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa.CRS[0]) && !EsEnvDinsMapaSituacio(capa.EnvTotal.EnvCRS))
			alert(GetMessage("NewLayerAdded", "cntxmenu")+", \'"+DonaCadenaNomDesc(capa)+"\' "+GetMessage("notVisibleInCurrentView", "cntxmenu") + ".");
	}

	var datatype;

	//Ara, amb aquestes metadades podem creo millor els valors i components.
	if (image.getArrayForSample() instanceof Int8Array)
		datatype="int8";
	else if (image.getArrayForSample() instanceof Uint8Array)
		datatype="uint8";
	else if (image.getArrayForSample() instanceof Int16Array)
		datatype="int16";
	else if (image.getArrayForSample() instanceof Uint16Array)
		datatype="uint16";
	else if (image.getArrayForSample() instanceof Int32Array)
		datatype="int32";
	else if (image.getArrayForSample() instanceof Uint32Array)
		datatype="uint32";
	else if (image.getArrayForSample() instanceof Float32Array)
		datatype="float32";
	else if (image.getArrayForSample() instanceof Float64Array)
		datatype="float64";
	else
	{
		alert("Unsuported tiff data type");
		return;
	}

	if (capa.origen==OrigenUsuari)
	{
		var nodata_usuari=(capa.valors && capa.valors[0].nodata) ? capa.valors[0].nodata : null;  // em deso el nodata que l'usuari hagi pogut indicar que vol en les capesDeServei
		capa.valors=[];
		var i_v=0;
		for (var i=0; i<image.getSamplesPerPixel(); i++)
		{
			capa.valors.push({
				url: capa.servidor ? null : url,
				datatype: datatype,
				nodata: (image.getGDALNoData()!==null) ? [image.getGDALNoData()] : null
			});
			if(nodata_usuari)
			{
				// intento afegir els nodata que hi pugui haver definits per l'usuari als nodata definits a dins de la imatge
				if(capa.valors[i].nodata)
				{
					var j, k;
					for(j=0; j<nodata_usuari.length; j++)
					{
						for(k=0; k<capa.valors[i].nodata.length; k++)
						{
							if(nodata_usuari[j]==capa.valors[i].nodata[k])
								break;
						}
						if(k==capa.valors[i].nodata.length)
						{
							// no trobat, afegeixo el nodata
							capa.valors[i].nodata.push(nodata_usuari[j]);
						}
					}
				}
				else
					capa.valors[i].nodata=JSON.parse(JSON.stringify(nodata_usuari));
					
			}
			if (!capa.servidor)
			{
				capa.valors[i_v+i].tiff=tiff;
				capa.valors[i_v+i].i_data_tiff=0;
			}
		}
	}
	else
	{
		var i_v=i_valor;
		for (var i=0; i<image.getSamplesPerPixel(); i++)
		{
			capa.valors[i_v+i].datatype=datatype;
			capa.valors[i_v+i].nodata=(image.getGDALNoData()!==null) ? [image.getGDALNoData()] : null;
			if (!capa.servidor)
			{
				capa.valors[i_v+i].tiff=tiff;
				capa.valors[i_v+i].i_data_tiff=0;
			}
		}
	}

	if (capa.origen==OrigenUsuari)
	{
		//En la versió qeu hem provat de geotiff.js, si demanes un costat molt gran (mires de la imatge molt "de lluny") la llibreria demana massa memòria i cal evitar-ho
                //En un COG, cada overview és una imatge més en el compte. La darrera és la de menys detall. Només la primera presenta resolució. Les altres s'ha de "deduir" de la relació entre mides d'imatges en pixels
		//https://geoexamples.com/other/2019/02/08/cog-tutorial.html/
		var n_overviews = await tiff.getImageCount();
		var lastImage = await tiff.getImage(n_overviews-1);

		//var costatMin=image.getResolution()[0];  //No hi ha probrema en un costat petit (mirar la imatge molt de prop)
		var costatMax=image.getResolution()[0]*image.getWidth()/lastImage.getWidth()*4;  // El 4 s'ha posat per permetre una certa tolerància sobre el costat màxim
		if (capa.CRS && capa.CRS.length)
		{
			if (DonaUnitatsCoordenadesProj(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS)=="m" && EsProjLongLat(capa.CRS[0]))
				costatMax*=FactorGrausAMetres; 
			else if (EsProjLongLat(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS) && DonaUnitatsCoordenadesProj(capa.CRS[0])=="m")
				costatMax/=FactorGrausAMetres;
		}
		for (var nivell=0; nivell<ParamCtrl.zoom.length; nivell++)
		{
			if (ParamCtrl.zoom[nivell].costat<=costatMax)
			{
				capa.CostatMaxim=ParamCtrl.zoom[nivell].costat;
				break;
			}
		}

		//Miro de recuperar si hi havia alguna cosa al estil que val la pena i ho guardo per recuperar-ho
		//COLOR_TIF_06092022: Ancora per lligar els 3 llocs on es gestiones els colors i categories dels fitxers TIFF

		var estilCapa=null, descItems=null, metadades=null, categories=null, atributs=null, estiramentPaleta=null, formulaConsulta=null;
		if (capa.estil && capa.estil.length)
		{
			estilCapa=JSON.parse(JSON.stringify(capa.estil[0]));
			if (estilCapa.DescItems)
				descItems=JSON.parse(JSON.stringify(estilCapa.DescItems));
			if (estilCapa.metadades)
				metadades=JSON.parse(JSON.stringify(estilCapa.metadades));
			if (estilCapa.categories) 
				categories=JSON.parse(JSON.stringify(estilCapa.categories));
			if (estilCapa.atributs)
				atributs=JSON.parse(JSON.stringify(estilCapa.atributs));
			if (estilCapa.component && estilCapa.component.length)
			{				
				if(estilCapa.component[0].estiramentPaleta)
					estiramentPaleta=JSON.parse(JSON.stringify(estilCapa.component[0].estiramentPaleta));
				if(estilCapa.component[0].FormulaConsulta)
					formulaConsulta=JSON.parse(JSON.stringify(estilCapa.component[0].FormulaConsulta));
			}
		}
		capa.estil=[];
		if (image.getSamplesPerPixel()==3)
		{
			capa.estil.push({nom: null,
					desc: descEstil,
					DescItems: descItems,
					TipusObj: "I",
					metadades: metadades,
					component: [
						{
							i_valor: i_v,
						},{
							i_valor: i_v+1,
						},{
							i_valor: i_v+2,
						}
					]
				});
		}
		else
		{
			var estil;
			for (var i=0; i<image.getSamplesPerPixel(); i++)
			{
				capa.estil.push({nom: null,
						desc: descEstil,
						DescItems: descItems,
						TipusObj: "P",
						metadades: metadades,
						component: [
							{
								i_valor: i_v+i,
								NDecimals: (datatype=="float32" || datatype=="float64") ? 4 : 0,
								FormulaConsulta: formulaConsulta
							}
						],
						categories: categories,
						atributs: atributs,
						ColorMinimPrimer: false
					});
				estil=capa.estil[capa.estil.length-1];
				if (image.fileDirectory && image.fileDirectory.ColorMap)
				{
					// ·$· Aquí no aplico l'estil exterior perquè a dins al TIFF hi ha una paleta (NJ)
					estil.paleta={colors: []};
					estil.ItemLleg=[];
					var ncolors=image.fileDirectory.ColorMap.length/3;
					for (var i=0; i<ncolors; i++)
					{
						if (i>0 && image.fileDirectory.ColorMap[i-1]==32896 && image.fileDirectory.ColorMap[ncolors+i-1]==32896 && image.fileDirectory.ColorMap[ncolors*2+i-1]==32896 && 
							image.fileDirectory.ColorMap[i]==32896 && image.fileDirectory.ColorMap[ncolors+i]==32896 && image.fileDirectory.ColorMap[ncolors*2+i]==32896)
							break; //Aquest color està repetit amb l'anterior i és un gris. Sembla que és el final de la paleta.
						estil.paleta.colors[i]={
								r: image.fileDirectory.ColorMap[i]>>>8,
								g: image.fileDirectory.ColorMap[ncolors+i]>>>8,
								b: image.fileDirectory.ColorMap[ncolors*2+i]>>>8};
						//estil.ItemLleg[i]={color: RGB(estil.paleta.colors[i].r, estil.paleta.colors[i].g, estil.paleta.colors[i].b), DescColor: i};
					}
					estil.ncol=1;
				}
				else if (categories)
				{
					if(estilCapa && estilCapa.paleta)
					{
						estil.paleta=JSON.parse(JSON.stringify(estilCapa.paleta));
						if(estilCapa.ItemLleg)
							estil.ItemLleg=JSON.parse(JSON.stringify(estilCapa.ItemLleg));
						else
							estil.ItemLleg=[];
						if(typeof estilCapa.ncol!=="undefined")
							estil.ncol=estilCapa.ncol;
						else	
							estil.ncol=1;
					}
					else
					{
						//hi ha categories però no hi ha paleta dins del TIFF. En aquest cas, agafo una paleta de les globals.
						if (!PaletesGlobals)
							PaletesGlobals=await promiseLoadJSON("paletes.json");

						estil.paleta={colors: []};
						estil.ItemLleg=[];
						var ncolors=categories.length;
						for (var i=0, j=0; i<ncolors; i++, j++)
						{
							if (j==20)
								j==0;
							estil.paleta.colors[i]=PaletesGlobals.categoric.category20.colors[j];
							//estil.ItemLleg[i]={color: PaletesGlobals.categoric.category20.colors[j], DescColor: i};
						}
						estil.ncol=1;
					}
				}
				else
				{
					if(estilCapa && estilCapa.paleta)
					{
						estil.paleta=JSON.parse(JSON.stringify(estilCapa.paleta));
						if(estilCapa.ItemLleg)
							estil.ItemLleg=JSON.parse(JSON.stringify(estilCapa.ItemLleg));
						else
						{
							estil.ItemLleg=[];
							estil.nItemLlegAuto=20;
							estil.descColorMultiplesDe=0.01;
						}
						if(typeof estilCapa.ncol!=="undefined")
							estil.ncol=estilCapa.ncol;
						else	
							estil.ncol=4;
					}
					else
					{
						estil.nItemLlegAuto=20;
						estil.descColorMultiplesDe=0.01;
						estil.ncol=4;
					}
					estil.component[0].estiramentPaleta=estiramentPaleta ? estiramentPaleta : {auto: true};					
				}
			}
		}
		//capa.LlegDesplegada=true;
	}
}

function AcabaAfegeixCapaGeoTIFF(capa, i_on_afegir)
{
var k;
	if(i_on_afegir==-1)
		k=ParamCtrl.capa.length;
	else
	{
		k=i_on_afegir;
		CanviaIndexosCapesSpliceCapa(1, k, -1, ParamCtrl);
	}
	ParamCtrl.capa.splice(k, 0, capa);
	CompletaDefinicioCapa(ParamCtrl.capa[k]);
	if (capa.CRS && !DonaCRSRepresentaQuasiIguals(capa.CRS[0], ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
	{
		CreaLlegenda();
		if (ParamCtrl.LlegendaAmagaSiForaCRS)
			alert(GetMessage("NewLayerAdded", "cntxmenu")+", \'"+DonaCadenaNomDesc(capa)+"\' "+GetMessage("notVisibleInCurrentCRS", "cntxmenu") + ".\n" + GetMessage("OnlyVisibleInTheFollowCRS", "cntxmenu") + ": " + DonaDescripcioCRS(capa.CRS[0]));
	}
	else
		RepintaMapesIVistes();
}

async function AfegeixCapaGeoTIFF_URL(urls, i_on_afegir)
{
var i_fitxer, i_event;

	if (!urls.length)
		return;

	var capa=IniciaDefinicioCapaTIFF((urls.length==1) ? urls[0] : null, TreuAdreca(urls[0]), null, "si");

	for (i_fitxer=0; i_fitxer<urls.length; i_fitxer++)
	{
		if (!window.GeoTIFFfromUrl)
			await loadGeoTIFF();

		i_event=CreaIOmpleEventConsola("HTTP GET", -1, urls[i_fitxer], TipusEventHttpGet);
		try{
			var tiff = await GeoTIFFfromUrl(urls[i_fitxer]);
			CanviaEstatEventConsola(null, i_event, EstarEventTotBe);
		}catch(e){
			alert(e);
			CanviaEstatEventConsola(null, i_event, EstarEventError);
			return;
		}
		await CompletaDefinicioCapaTIFF(capa, tiff, urls[i_fitxer], TreuAdreca(urls[i_fitxer], 0));
	}

	AcabaAfegeixCapaGeoTIFF(capa, i_on_afegir);
}

async function AfegeixCapaGeoTIFF(desc, tiff_blobs, i_on_afegir)
{
var i_fitxer;

	var capa=IniciaDefinicioCapaTIFF((tiff_blobs.length==1) ? tiff_blobs[0].name : null, desc, null, "si"); 	

	for (i_fitxer=0; i_fitxer<tiff_blobs.length; i_fitxer++)
	{
		if (!window.GeoTIFFfromBlob)
			await loadGeoTIFF();
		
		var tiff = await GeoTIFFfromBlob(tiff_blobs[i_fitxer]);
		await CompletaDefinicioCapaTIFF(capa, tiff, tiff_blobs[i_fitxer].name, tiff_blobs[i_fitxer].name, 0);
	}

	AcabaAfegeixCapaGeoTIFF(capa, i_on_afegir);
}



