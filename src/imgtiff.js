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

function DonaTiffCapa(i_capa2, i_valor2, i_data2, vista)
{
	var capa = ParamCtrl.capa[i_capa2];
	var valor2 = capa.valors[i_valor2];

	if (valor2.url)
	{
		if (vista.i_nova_vista==NovaVistaRodet || vista.i_nova_vista==NovaVistaVideo)
		{
			if (valor2.capa_video && valor2.capa_video[i_data2])
				return valor2.capa_video[i_data2].tiff;
			return null;
		}
		if (!capa.data || !capa.data.length || DonaIndexDataCapa(capa, i_data2)==valor2.i_data_tiff)
		{
			if (capa.dimensioExtra)
			{
				for (var i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
				{
					var dim=capa.dimensioExtra[i_dim];
					if (typeof dim.i_valor_tiff === "undefined" || dim.i_valor_tiff!=dim.i_valor)
						return null;
				}
			}
			return valor2.tiff;
		}
		return null;
	}
	if (vista.i_nova_vista==NovaVistaRodet || vista.i_nova_vista==NovaVistaVideo)
	{
		if (capa.capa_video && capa.capa_video[i_data2])
			return capa.capa_video[i_data2].tiff;
		return null;
	}
	if (!capa.data || !capa.data.length || DonaIndexDataCapa(capa, i_data2)==capa.i_data_tiff)
	{
		if (capa.dimensioExtra)
		{
			for (var i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
			{
				var dim=capa.dimensioExtra[i_dim];
				if (typeof dim.i_valor_tiff === "undefined" || dim.i_valor_tiff!=dim.i_valor)
					return null;
			}
		}
		return capa.tiff;
	}
	return null;
}


//https://dmitripavlutin.com/ecmascript-modules-dynamic-import/
async function loadGeoTIFF() {
	const { 
		default: GeoTIFF,
		fromUrl, 
		fromBlob
	} = await import('./geotiff/geotiff.js');
	window.GeoTIFFfromBlob = fromBlob;
	window.GeoTIFFfromUrl = fromUrl;
}

function DonaUrlLecturaTiff(i_capa2, i_valor2, i_data2)
{
var capa = ParamCtrl.capa[i_capa2], url;

	if (capa.servidor)
	{
		url = capa.servidor;
		var valor2 = capa.valors[i_valor2];
		if (valor2.url)
		{
			if (url.charAt(url.length-1)!='/' && valor2.url.charAt(0)!='/')
				url += '/';
			url += valor2.url;
		}
	}
	else
		url = capa.valors[i_valor2];

	if (!url)
		return "";
	return CanviaVariablesDeCadena(url, capa, i_data2);
}

async function PreparaLecturaTiff(i_capa2, i_valor2, i_data2, imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param)
{
	if (!window.GeoTIFFfromUrl)
		await loadGeoTIFF();
	var capa = ParamCtrl.capa[i_capa2];
	var url = DonaUrlLecturaTiff(i_capa2, i_valor2, i_data2);

	/*if (window.doAutenticatedHTTPRequest && capa.access && capa.access.request && capa.access.request.indexOf("map")!=-1)
	{
		if (null==(url=AddAccessTokenToURLIfOnline(url, capa.access)))
		{
			AuthResponseConnect(PreparaLecturaTiff, capa.access, i_capa2, i_valor2, i_data2, imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param);
			return;
		}
	}*/

	var valor2 = capa.valors[i_valor2];

	if (window.doAutenticatedHTTPRequest && capa.access && capa.access.request && capa.access.request.indexOf("map")!=-1)
	{
		var authResponse=hello(capa.access.tokenType).getAuthResponse();
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
			var tiff = await GeoTIFFfromUrl(url, {headers: {"Authorization":"Bearer "+authResponse.access_token}});
		}
		else
		{
			AuthResponseConnect(PreparaLecturaTiff, capa.access, i_capa2, i_valor2, i_data2, imatge, vista, i_capa, i_estil, i_data, nom_funcio_ok, funcio_ok_param);
			return null;
		}
	}
	else
		var tiff = await GeoTIFFfromUrl(url);

	if (valor2.url)
	{
		if (vista.i_nova_vista==NovaVistaRodet || vista.i_nova_vista==NovaVistaVideo)
		{
			if (!valor2.capa_video)
				valor2.capa_video=[];  //Preparo l'estructura
			if (!valor2.capa_video[i_data2])
				valor2.capa_video[i_data]={}  //Preparo l'estructura
			valor2.capa_video[i_data2].tiff=tiff;
		}
		else
		{
			if (capa.data && capa.data.length)
				valor2.i_data_tiff=DonaIndexDataCapa(capa, i_data2);
			valor2.tiff=tiff;
		}
	}
	else
	{
		if (vista.i_nova_vista==NovaVistaRodet || vista.i_nova_vista==NovaVistaVideo)
		{
			if (!capa.capa_video)
				capa.capa_video=[];  //Preparo l'estructura
			if (!capa.capa_video[i_data2])
				capa.capa_video[i_data]={}  //Preparo l'estructura
			capa.capa_video[i_data2].tiff=tiff;
		}
		else
		{
			if (capa.data && capa.data.length)
				capa.i_data_tiff=DonaIndexDataCapa(capa, i_data2);
			capa.tiff=tiff;
		}
	}
	if (capa.dimensioExtra)
	{
		for (var i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
		{
			var dim=capa.dimensioExtra[i_dim];
			dim.i_valor_tiff=dim.i_valor;
		}
	}
	await CompletaDefinicioCapaTIFF(capa, tiff, url, capa.desc, i_valor2);
	if (capa.origen==OrigenUsuari)
		CompletaDefinicioCapa(capa, false);
	return {imatge: imatge, vista: vista, i_capa: i_capa, i_estil: i_estil, i_data: i_data, nom_funcio_ok: nom_funcio_ok, funcio_ok_param: funcio_ok_param};
}


async function loadTiffData(i_capa2, i_valor2, imatge, vista, i_capa, i_data2, i_estil2, i_valor, nom_funcio_ok, funcio_ok_param)
{
var fillValue, tiff=DonaTiffCapa(i_capa2, i_valor2, i_data2, vista);

	var data = await tiff.readRasters({samples: [ParamCtrl.capa[i_capa2].valors[i_valor2].iBand ? ParamCtrl.capa[i_capa2].valors[i_valor2].iBand : 0], 
					bbox: [vista.EnvActual.MinX, vista.EnvActual.MinY, vista.EnvActual.MaxX, vista.EnvActual.MaxY], 
					width: vista.ncol, height: vista.nfil, 
					fillValue: (ParamCtrl.capa[i_capa2].valors[i_valor2].nodata && ParamCtrl.capa[i_capa2].valors[i_valor2].nodata.length) ? ParamCtrl.capa[i_capa2].valors[i_valor2].nodata[0]: null 
					/*, resampleMethod: 'bilinear'*/});
	return {dades: data[0].buffer, extra_param: {imatge: imatge, vista: vista, i_capa: i_capa, i_data: i_data2, i_estil: i_estil2, i_valor: i_valor, nom_funcio_ok: nom_funcio_ok, funcio_ok_param: funcio_ok_param}};
}