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

const OriginUsuari="usuari";

function AfegeixCapaWMSAlNavegador(format_get_map, servidorGC, i_on_afegir, i_capa, i_get_featureinfo, i_getmap)
{
var j, k;
var alguna_capa_afegida=false;
var estil;
var minim, maxim;

	if(servidorGC.layer[i_capa].estil && servidorGC.layer[i_capa].estil.length>0)
	{
		estil=[];
		for(j=0; j<servidorGC.layer[i_capa].estil.length; j++)
		{
			estil[estil.length]={nom: servidorGC.layer[i_capa].estil[j].nom,
						desc: (servidorGC.layer[i_capa].estil[j].desc ? servidorGC.layer[i_capa].estil[j].desc: servidorGC.layer[i_capa].estil[j].nom),
						DescItems: null,
						TipusObj: "I",
						metadades: null,
						ItemLleg: null,
						ncol: 0};
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
		CanviaIndexosCapesSpliceCapa(1, k, -1, ParamCtrl);
	}
	ParamCtrl.capa.splice(k, 0, {servidor: servidorGC.servidor,
				versio: servidorGC.versio,
				tipus: servidorGC.tipus,
				nom: servidorGC.layer[i_capa].nom,
				desc: servidorGC.layer[i_capa].desc,
				CRS: [ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS],
				FormatImatge: format_get_map,
				transparencia: (format_get_map=="image/jpeg") ? "opac" : "transparent",
				CostatMinim: minim,
				CostatMaxim: maxim,
				FormatConsulta: (i_get_featureinfo==-1 ? null :servidorGC.formatGetFeatureInfo[i_get_featureinfo]),
				separa: DonaTextSeparadorCapaAfegida(k),
				DescLlegenda: (servidorGC.layer[i_capa].desc ? servidorGC.layer[i_capa].desc : servidorGC.layer[i_capa].nom),
				estil: estil,
				i_estil: 0,
				NColEstil: (estil && estil.length>0) ? 1: 0,
				LlegDesplegada: false,
				VisibleALaLlegenda: true,
				visible: "si",
				consultable: (i_get_featureinfo!=-1 && servidorGC.layer[i_capa].consultable)? "si" : "no",
				descarregable: "no",
				FlagsData: servidorGC.layer[i_capa].FlagsData,
				data: servidorGC.layer[i_capa].data,
				i_data: servidorGC.layer[i_capa].i_data,
				animable: (servidorGC.layer[i_capa].data)? true: false,
				AnimableMultiTime: (servidorGC.layer[i_capa].data)? true:false,
				origen: OriginUsuari});

	CompletaDefinicioCapa(ParamCtrl.capa[k]);

	if (ParamCtrl.LlegendaAmagaSegonsEscala && !EsCapaDinsRangDEscalesVisibles(ParamCtrl.capa[k]))
		   alert(GetMessage("NewLayerAdded", "cntxmenu")+", \'"+ParamCtrl.capa[k].nom+"\' "+GetMessage("notVisibleInCurrentZoom", "cntxmenu"));
}

/* i_capa es passa en el context que estic demanat els indexos en relació a una capa concreta,
per si la definicó d'algun v[] d'aquell no indica i_capa explícitament, com per exemple passa
en crear un flistre espacial a partir d'una banda de la mateixa capa
En contextos on no te sentit (per exemple a AfegeixCapaCalcul no es passa i està protegit) */
function DonaIndexosACapesDeCalcul(calcul, i_capa)
{
var fragment, cadena, i_capes=[], inici, final, nou_valor;

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

	if (i_capes.length>1) //Si en l'expressió entra en joc més d'una capa -> la capa calculada és una capa nova
	{
		//pensar què fer amb origen en aquest cas, si es posa a nivell de capa (encara no al config.json) i/o de estil ·$·
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
			origen: OriginUsuari
			});

		if (i_capa<ParamCtrl.capa.length)  //això és fa després, donat que els índex de capa de la capa nova es poden referir a capes que s'han mogut.
			CanviaIndexosCapesSpliceCapa(1, i_capa, -1, ParamCtrl);

		CompletaDefinicioCapa(ParamCtrl.capa[i_capa]);

		//Redibuixo el navegador perquè les noves capes siguin visibles
		RevisaEstatsCapes();
		CreaLlegenda();
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
				}],
				metadades: null,
				nItemLlegAuto: 20,
				ncol: 4,
				descColorMultiplesDe: 0.01,
				origen: OriginUsuari
			});

			if (capa.visible=="ara_no")
				CanviaEstatCapa(i_capa, "visible");  //CreaLlegenda(); es fa a dins.
			else
				CreaLlegenda();

			//Defineix el nou estil com estil actiu
			CanviaEstilCapa(i_capa, capa.estil.length-1, false);
	}
}//Fi de AfegeixCapaCalcul()

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
				atributs: [],
				FormatImatge: "application/json",
				transparencia: "opac",
				CostatMinim: null,
				CostatMaxim: null,
				FormatConsulta: null,
				separa: null,
				DescLlegenda: desc,
				estil: [{nom: null,
					desc: desc,
					DescItems: null,
					TipusObj: "P",
					metadades: null,
					ItemLleg: [
						{
							color: "#377200",
							DescColor: desc
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
				}],
				i_estil: 0,
				NColEstil: 1,
				LlegDesplegada: false,
				VisibleALaLlegenda: true,
				visible: "si",
				consultable: "si",
				descarregable: "no",
				FlagsData: null,
				data: null,
				i_data: 0,
				animable: false,
				AnimableMultiTime: false,
				origen: OriginUsuari});
	
	if (objectes.features[0].properties)
	{
		for (var j in objectes.features[0].properties)
		{
			ParamCtrl.capa[k].atributs.push({"nom": j,
						"descripcio": j,
						"mostrar": "si_ple"});
		}
	}
	CompletaDefinicioCapa(ParamCtrl.capa[k]);

	//Redibuixo el navegador perquè les noves capes siguin visibles
	//RevisaEstatsCapes();
	CreaLlegenda();
	RepintaMapesIVistes();
}

