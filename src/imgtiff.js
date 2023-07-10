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

function DonaTiffCapa(i_capa2, i_valor2, i_data2, dims, vista)
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
					if (typeof dim.i_valor_tiff === "undefined")
						return null;
					var dim=capa.dimensioExtra[i_dim], dim2= null;
					if(dims)
					{
						for(var i_dim2=0; i_dim2<dims.length; i_dim2++)
						{
							if(dims[i_dim2].clau.nom.toLowerCase()==dim.clau.nom.toLowerCase())
							{	
								dim2=dims[i_dim2];
								break;
							}
						}
					}
					if (dim2)
					{
						if(dim2.valor.nom.toLowerCase()!=dim.valor[dim.i_valor_tiff].nom.toLowerCase())
							return null;
					}
					else
					{
						if (dim.i_valor_tiff!=dim.i_valor)
							return null;
					}
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
				var dim=capa.dimensioExtra[i_dim], dim2= null;
				if (typeof dim.i_valor_tiff === "undefined")
					return null;
				if(dims)
				{
					for(var i_dim2=0; i_dim2<dims.length; i_dim2++)
					{
						if(dims[i_dim2].clau.nom.toLowerCase()==dim.clau.nom.toLowerCase())
						{	
							dim2=dims[i_dim2];
							break;
						}
					}
				}
				if (dim2)
				{
					if(dim2.valor.nom.toLowerCase()!=dim.valor[dim.i_valor_tiff].nom.toLowerCase())
						return null;
				}
				else
				{
					if (dim.i_valor_tiff!=dim.i_valor)
						return null;
				}
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

function DonaUrlLecturaTiff(i_capa2, i_valor2, i_data2, dims)
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
	return CanviaVariablesDeCadena(url, capa, i_data2, dims);
}

async function PreparaLecturaTiff(i_capa2, i_valor2, i_data2, imatge, vista, i_capa, i_estil, i_data, dims, nom_funcio_ok, funcio_ok_param)
{
	if (!window.GeoTIFFfromUrl)
		await loadGeoTIFF();
	var capa = ParamCtrl.capa[i_capa2];
	var url = DonaUrlLecturaTiff(i_capa2, i_valor2, i_data2, dims);

	/*if (window.doAutenticatedHTTPRequest && capa.access && capa.access.request && capa.access.request.indexOf("map")!=-1)
	{
		if (null==(url=AddAccessTokenToURLIfOnline(url, capa.access)))
		{
			AuthResponseConnect(PreparaLecturaTiff, capa.access, i_capa2, i_valor2, i_data2, imatge, vista, i_capa, i_estil, i_data, dims, nom_funcio_ok, funcio_ok_param);
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
			AuthResponseConnect(PreparaLecturaTiff, capa.access, i_capa2, i_valor2, i_data2, imatge, vista, i_capa, i_estil, i_data, dims, nom_funcio_ok, funcio_ok_param);
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
	//Actualitzo el valor de la darrera dimensió demanada
	if (capa.dimensioExtra)
	{
		if(dims)
		{
			for (var i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
			{
				var dim=capa.dimensioExtra[i_dim];
				for(var i_dim2=0; i_dim2<dims.length; i_dim2++)
				{
					if(dims[i_dim2].clau.nom.toLowerCase()==dim.clau.nom.toLowerCase())
					{	
						var dim2=dims[i_dim2];
						for (var i_valor=0; i_valor<dim.valor.length; i_valor++)
						{
							if(dim2.valor.nom.toLowerCase()==dim.valor[i_valor].nom.toLowerCase())
							{
								dim.i_valor_tiff=i_valor;
								break;
							}
						}
					}
				}
			}
		}	
		else
		{
			for (var i_dim=0; i_dim<capa.dimensioExtra.length; i_dim++)
			{
				var dim=capa.dimensioExtra[i_dim];
				dim.i_valor_tiff=dim.i_valor;
			}
		}
	}
	await CompletaDefinicioCapaTIFF(capa, tiff, url, capa.desc, i_valor2);
	if (capa.origen==OrigenUsuari)
		CompletaDefinicioCapa(capa, false);
	return {imatge: imatge, vista: vista, i_capa: i_capa, i_estil: i_estil, i_data: i_data, dims: dims, nom_funcio_ok: nom_funcio_ok, funcio_ok_param: funcio_ok_param};
}


async function loadTiffData(i_capa2, i_valor2, imatge, vista, i_capa, i_data2, i_estil2, dims, i_valor, nom_funcio_ok, funcio_ok_param)
{
var fillValue, tiff=DonaTiffCapa(i_capa2, i_valor2, i_data2, dims, vista);
var capa2=ParamCtrl.capa[i_capa2];
var bbox, width, height, dades, env_tiff;

	if (!DonaCRSRepresentaQuasiIguals(capa2.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
	{
		//cal fer canvi de projecció;
		//determino l'envolupant en el sistema del tiff
		env_tiff=TransformaEnvolupant(vista.EnvActual, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa2.CRSgeometry);
		bbox=[env_tiff.MinX, env_tiff.MinY, env_tiff.MaxX, env_tiff.MaxY];
		width=Math.floor(vista.ncol*1.1);
		height=Math.floor(vista.nfil*1.1);
	}
	else
	{
		bbox=[vista.EnvActual.MinX, vista.EnvActual.MinY, vista.EnvActual.MaxX, vista.EnvActual.MaxY];
		width=vista.ncol;
		height=vista.nfil;
	}

	//Demano la imatge en el sistema propi del tiff
	var data = await tiff.readRasters({samples: [capa2.valors[i_valor2].iBand ? capa2.valors[i_valor2].iBand : 0], 
					bbox: bbox, 
					width: width, height: height, 
					fillValue: (capa2.valors[i_valor2].nodata && capa2.valors[i_valor2].nodata.length) ? capa2.valors[i_valor2].nodata[0]: null 
					/*, resampleMethod: 'bilinear'*/});

	if (!DonaCRSRepresentaQuasiIguals(capa2.CRSgeometry, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS))
	{
		//canvio la imatge al sistema nou
		var dv_tiff=new DataView(data[0].buffer);

		//Demano un buffer
		var bytesDataType=DonaBytesDataType(capa2.valors[i_valor2].datatype);
		var dades=new ArrayBuffer(vista.ncol*vista.nfil*bytesDataType);
		var dv_out=new DataView(dades);
		var punt={}, y, i_fil, i_col;

		dv_out.posaNumero=DonaFuncioPosaNumeroDataView(dv_out, capa2.valors[i_valor2].datatype);

		//Recorro el buffer de sortida (amb i_col i i_fil)
		for (i_fil=0; i_fil<vista.nfil; i_fil++)
		{
			y=vista.EnvActual.MaxY-(vista.EnvActual.MaxY-vista.EnvActual.MinY)*i_fil/vista.nfil;
			for (i_col=0; i_col<vista.ncol; i_col++)
			{
				//Passo a coordenades mapa
				punt.x=vista.EnvActual.MinX+(vista.EnvActual.MaxX-vista.EnvActual.MinX)*i_col/vista.ncol; 
				punt.y=y;

				TransformaCoordenadesPunt(punt, ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS, capa2.CRSgeometry);

				//Llegeixo el valor a la posició que toca en el tiff (i_col_tiff, i_fil_tiff),
				//Poso el valor on toca en el buffer de sortida.
				dv_out.posaNumero((vista.ncol*i_fil+i_col)*bytesDataType, 
						DonaValorBandaDeDadesBinariesCapa(dv_tiff, capa2.valors[i_valor2].compression, capa2.valors[i_valor2].datatype, width, 
								Math.round((punt.x-env_tiff.MinX)/(env_tiff.MaxX-env_tiff.MinX)*width), 
								Math.round((env_tiff.MaxY-punt.y)/(env_tiff.MaxY-env_tiff.MinY)*height)), 
						littleEndian);
			}
		}
	}
	else
		dades=data[0].buffer;

	return {dades: dades, extra_param: {imatge: imatge, vista: vista, i_capa: i_capa, i_data: i_data2, i_estil: i_estil2, dims: dims, i_valor: i_valor, nom_funcio_ok: nom_funcio_ok, funcio_ok_param: funcio_ok_param}};
}