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

    Copyright 2001, 2026 Xavier Pons

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

function InitHello()
{
	if (!ParamCtrl.accessClientId)
	{
		alert("authen.js has been included by the homepage but the config.json does not specify accessClientId. Autentication has not been iniciated.")
		return;
	}
	hello.init(ParamCtrl.accessClientId, {redirect_uri: ((location.pathname.charAt(location.pathname.length-1)=='/') ? location.pathname.substring(0, location.pathname.length-1) : location.pathname)});
	ParamInternCtrl.tokenType={};
	for (var tokenType in ParamCtrl.accessClientId)
	{
		if (ParamCtrl.accessClientId.hasOwnProperty(tokenType))
			ParamInternCtrl.tokenType[tokenType]={};
	}
}

function parseJwt(token)
{
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace("-", "+").replace("_", "/");
	return JSON.parse(window.atob(base64));
}

function IsAuthResponseOnline(session) {
	var currentTime = (new Date()).getTime() / 1000;
	return session && session.access_token && session.expires > currentTime;
}

//Suporta que access_token sigui null
function DonaUrlAmbAccessToken(url, access_token)
{
	if (access_token)
		return url + (url.indexOf('?')!=-1 ? "&" : "?") + "access_token=" + access_token;
	return url;
}

function AddAccessTokenToURLIfOnline(url, access)
{
	if (access)
	{
		var authResponse=hello(access.tokenType).getAuthResponse();
		if (IsAuthResponseOnline(authResponse))
		{
			if (authResponse.error)
			{
				alert(authResponse.error.message)
				return null;
			}
			if (authResponse.error_description)
			{
				alert(authResponse.error_description)
				return null;
			}
			return DonaUrlAmbAccessToken(url, authResponse.access_token);
		}
		return null;
	}
	return url;
}


function AuthResponseConnect(f_repeat, access, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12)
{
	if (ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken=="logout")
		return;
	if (ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken)  //Parametre meu que no forma part de la llibreria
	{
		//Com que hi ha una caixa del hello per autentificar oberta, renuncio a obrir-ne cap altre i provo si la caixa ja s'ha despatxat més tard.
		setTimeout(f_repeat, 2000, access, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12);
		return;
	}

	ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken=true;  //Parametre meu que no forma part de la llibreria
	hello(access.tokenType ? access.tokenType : "authenix").login({redirect_uri: location.pathname, scope: "openid profile", display: "popup"}).then(
			function(success) {
				//alert("success");
				//console.log("Success login Authenix: " + success);
				try
				{
					var authResponse=hello(access.tokenType).getAuthResponse();
					if (!authResponse || !authResponse.access_token)
						return 0;
					if (!ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].userAlreadyWelcomed)
					{
						var jwt = parseJwt(authResponse.id_token);

						// https://github.com/kjur/jsrsasign/wiki/Tutorial-for-JWT-verification

						if (access.tokenType=="nextgeoss")
							alert("Hello " + decode_utf8(jwt.name));  //Sembla que nextgeoss que ho diferent i envia el nom del utf8. En canvi landsense/authenix ho fa "normal".
						else if (access.tokenType=="wqems")
							alert("Hello " + jwt.preferred_username);
						else
							alert("Hello " + jwt.name);
						ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].userAlreadyWelcomed=true;
					}
				}
				catch (err)
				{
					alert("Error: " +err.message);
				}
				ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken=false;
				f_repeat(access, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12);
			},
			// On error
			function(error) 
			{
				ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken="failed";
				if (error.error.code=="cancelled")
				{
					/*NJ_31032023: No intento fer la petició sense login, si l'usuari cancel·la no em connecto aquest servei ni amb login ni sense. 
					Si és com en el cas del WQEMS que el servei dona coses diferents segons si uso usuari o no ja ho hem resolt afegint el servei de les dues maneres.
					if (confirm(GetMessage("LoginAccountFailed","authens") + " " + access.tokenType + ". " + GetMessage("ContinueWithoutAuthentication","authens") + "?"))
						f_repeat(null, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10, param11, param12);*/
					return;
				}	
				alert(GetMessage("LoginAccountFailed","authens") + " " + access.tokenType + ". " + error.error.message);
			}
		);
}

function doAutenticatedHTTPRequest(access, method, ajax, url, request_format, dataPayload, hand, response_format, struct)
{
	if (!access || !access.tokenType || access.tokenType.length==0)
	{
		//No autentication requested in the 'access' property
		//Aquí no puc fer una copia "deep" (hi ha funcions dins que no es poden "stringifar" i només puc fer una copia "shallow" (https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/)
		var struct2=Object.assign({}, struct);
		if (struct.access)
			struct2.access=null;  //No propago l'access per no intentar-ho més tard.
		ajax.doReqIndirect(method, url, request_format, dataPayload, hand, response_format, struct2);
		return;
	}
	var authResponse=hello(access.tokenType).getAuthResponse();
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
		ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken=false;
		if (access.request && access.request.indexOf("map")!=-1 && url.indexOf("REQUEST=GetMap")!=-1)
			ajax.doReqIndirect(method, url + (url.indexOf('?')==-1 ? "?" : "&") + "access_token=" + authResponse.access_token, request_format, dataPayload, hand, response_format, struct);
		else
		{
			ajax.setAccessToken(authResponse.access_token, access.tokenType);
			ajax.doReqIndirect(method, url, request_format, dataPayload, hand, response_format, struct);
		}
		return;
	}

	AuthResponseConnect(doAutenticatedHTTPRequest, access, method, ajax, url, request_format, dataPayload, hand, response_format, struct, null, null, null);
}

function CalFerLogin()
{
	if (!ParamCtrl.accessClientId)
		return false;
	for (var tokenType in ParamCtrl.accessClientId)
	{
		if (ParamCtrl.accessClientId.hasOwnProperty(tokenType))
		{
			if (typeof ParamInternCtrl.tokenType[tokenType].askingAToken==="undefined" ||
				ParamInternCtrl.tokenType[tokenType].askingAToken=="failed")
				return true;
		}
	}
	return false;
}

function PreparaReintentarLogin()
{
	if (!ParamCtrl.accessClientId)
		return false;
	for (var tokenType in ParamCtrl.accessClientId)
	{
		if (ParamCtrl.accessClientId.hasOwnProperty(tokenType))
		{
			if (ParamInternCtrl.tokenType[tokenType].askingAToken=="failed")
				delete ParamInternCtrl.tokenType[tokenType].askingAToken;
		}
	}
	return false;
}

function RevokeLogin(access)
{
	var authResponse=hello(access.tokenType).getAuthResponse();		
	if (IsAuthResponseOnline(authResponse) || 
		ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken==false)
	{
		ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken="revoking";
		hello(access.tokenType ? access.tokenType : "authenix").logout({force:true}).then(function() {
				delete ParamInternCtrl.tokenType[access.tokenType ? access.tokenType : "authenix"].askingAToken;
				alert("Signed out from"+ " " + access.tokenType + ". ");
			}, function(e) {
				alert("Signed out error:" + " " + access.tokenType + ". " + e.error.message);
			});
	}
}	