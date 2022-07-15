"use strict"

function InitHello()
{
	if (!ParamCtrl.accessClientId)
	{
		alert("authen.js has been included by the homepage but the config.json does not specify accessClientId. Autentication has not been iniciated.")
		return;
	}
	hello.init(ParamCtrl.accessClientId, {redirect_uri: ((location.pathname.charAt(location.pathname.length-1)=='/') ? location.pathname.substring(0, location.pathname.length-1) : location.pathname)});
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
	else
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
		else
			return null;
	}
	return url;
}


function AuthResponseConnect(f_repeat, access, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10)
{
	if (hello(access.tokenType ? access.tokenType : "authenix").askingAToken)  //Parametre meu que no forma part de la llibreria
	{
		//Com que hi ha una caixa del hello per autentificar oberta, renuncio a obrir-ne cap altre i provo si la caixa ja s'ha despatxat més tard.
		setTimeout(f_repeat, 2000, access, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10);
		return;
	}

	hello(access.tokenType ? access.tokenType : "authenix").askingAToken=true;  //Parametre meu que no forma part de la llibreria
	hello(access.tokenType ? access.tokenType : "authenix").login({redirect_uri: location.pathname, scope: "openid profile", display: "popup"}).then(
			function(success) {
				//alert("success");
				//console.log("Success login Authenix: " + success);
				try
				{
					var authResponse=hello(access.tokenType).getAuthResponse();
					if (!authResponse || !authResponse.access_token)
						return 0;
					if (!hello(access.tokenType ? access.tokenType : "authenix").userAlreadyWelcomed)
					{
						var jwt = parseJwt(authResponse.id_token);

						// https://github.com/kjur/jsrsasign/wiki/Tutorial-for-JWT-verification

						if (access.tokenType=="nextgeoss")
							alert("Hello " + decode_utf8(jwt.name));  //Sembla que nextgeoss que ho diferent i envia el nom del utf8. En canvi landsense/authenix ho fa "normal".
						else if (access.tokenType=="wqems")
							alert("Hello " + jwt.preferred_username);
						else
							alert("Hello " + jwt.name);
						hello(access.tokenType ? access.tokenType : "authenix").userAlreadyWelcomed=true;
					}
				}
				catch (err)
				{
					alert("Error: " +err.message);
				}
				hello(access.tokenType ? access.tokenType : "authenix").askingAToken=false;
				f_repeat(access, param1, param2, param3, param4, param5, param6, param7, param8, param9, param10);
			},
			// On error
			function(error) {
				hello(access.tokenType ? access.tokenType : "authenix").askingAToken=false;
				alert(GetMessage("LoginAccountFailed","authens") + " " + access.tokenType + ". " + error.error.message);
			}
		);
}

function doAutenticatedHTTPRequest(access, method, ajax, url, request_format, dataPayload, hand, response_format, struct)
{
	if (!access || !access.tokenType || access.tokenType.length==0)
	{
		//No autentication requested in the 'access' property
		ajax.doReqIndirect(method, url, request_format, dataPayload, hand, response_format, struct);
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
		if (access.request && access.request.indexOf("map")!=-1 && url.indexOf("REQUEST=GetMap")!=-1)
			ajax.doReqIndirect(method, url + (url.indexOf('?')==-1 ? "?" : "&") + "access_token=" + authResponse.access_token, request_format, dataPayload, hand, response_format, struct);
		else
		{
			ajax.setAccessToken(authResponse.access_token, access.tokenType);
			ajax.doReqIndirect(method, url, request_format, dataPayload, hand, response_format, struct);
		}
		return;
	}

	AuthResponseConnect(doAutenticatedHTTPRequest, access, method, ajax, url, request_format, dataPayload, hand, response_format, struct, null, null);
}
