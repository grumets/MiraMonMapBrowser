"use strict"

//https://www.authenix.eu/.well-known/openid-configuration
/*
https://www.authenix.eu/registerapps

client_id	bbf7d666-9553-36b4-91b4-5c3e1f22652d
client_secret	this application type has no client_secret
grant_type	implicit
scopes	openid profile
redirect_uri	https://www.ogc.uab.cat/OGCFeaturesSprint/ http://www.ogc.uab.cat/OGCFeaturesSprint2/ http://localhost/OGCFeaturesSprint2/
*/

function InitHello()
{
	hello.init({
		authenix: 'bbf7d666-9553-36b4-91b4-5c3e1f22652d',
	}, {redirect_uri: ((location.pathname.charAt(location.pathname.length-1)=='/') ? location.pathname.substring(0, location.pathname.length-1) : location.pathname)});
}

function parseJwt(token) 
{
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace("-", "+").replace("_", "/");
	return JSON.parse(window.atob(base64));
}

function doAutenticatedHTTPRequest(access, method, ajax, url, request_format, dataPayload, hand, response_format, struct) 
{
var authResponse
	if (!access || !access.tokenType || access.tokenType.length==0)
	{
		//No autehtication requested in the access member.
		ajax.doReqIndirect(method, url, request_format, dataPayload, hand, response_format, struct);
		return;
	}
	authResponse=hello(access.tokenType).getAuthResponse();
	if (authResponse)
	{
		ajax.setAccessToken(authResponse.access_token, access.tokenType);
		ajax.doReqIndirect(method, url, request_format, dataPayload, hand, response_format, struct);
		return;

		/*if (access.tokenType=="authenix" || access.tokenType=="nextgeoss")
		{*/
			//In external authentication, session expires. We need to be sure that it is valid or we risc that a server that is slow on responding could try to validate a token that has already expired.
			/*
			var currentTime;

			//if (access.tokenType=="nextgeoss")
			//	expires=access.tokenExpires;
			//else
			//	expires=OmpleHelloAccessTokenIType(access.tokenType);  //Automatic regenerated token is valid
			
			var currentTime = (new Date()).getTime() / 1000;  //in seconds since 1970/01/01
			if ((access.tokenExpires-5) <= currentTime)
			{
				access.token=null;
				if (access.tokenExpires<currentTime)
				{
					doAutenticatedHTTPRequest(access, method, ajax, url, request_format, dataPayload, hand, response_format, struct);
				}
				else
				{
					//Session is close to expire. Since forced authentication does not work, we simply wait until the access token is invalid and then we will request it again.
					setTimeout(doAutenticatedHTTPRequest, (access.tokenExpires-currentTime+2)*1000, access, method, ajax, url, request_format, dataPayload, hand, response_format, struct);
				}
				return;
			}
			else
			{
				ajax.setAccessToken(authResponse.access_token, access.tokenType);
				ajax.doReqIndirect(method, url, request_format, dataPayload, hand, response_format, struct);
			}
		}*/
	}
	hello("authenix").login({redirect_uri: location.pathname, scope: "openid profile", display: "popup"}).then(
			function(success) {
				//alert("success");
				//console.log("Success login Authenix: " + success);
				try
				{
					var authResponse=hello(access.tokenType).getAuthResponse();
					if (!authResponse || !authResponse.access_token)
						return 0;
					/*if (authResponse.access_token!=access.token)
					{*/
						var jwt = parseJwt(authResponse.id_token);
	
						// https://github.com/kjur/jsrsasign/wiki/Tutorial-for-JWT-verification
	
						if (access.tokenType=="nextgeoss")
							alert("Hello " + decode_utf8(jwt.name));  //Sembla que nextgeoss que ho diferent i envia el nom del utf8. En canvi landsense/authenix ho fa "normal".
						else
							alert("Hello " + jwt.name);
						//access.token = authResponse.access_token;
					//}
					//access.tokenExpires=authResponse.expires;
				}
				catch (err)
				{
					alert("Error: " +err.message);
				}
				doAutenticatedHTTPRequest(access, method, ajax, url, request_format, dataPayload, hand, response_format, struct);
			},
			// On error
			function(error) {
				alert(DonaCadenaLang({cat: "Error o cancel·lació de la identificació amb el compte de", spa: "Error o cancelación de la identificación en la cuenta de", eng: "Login in your account failed or cancelled in"}) + " " + access.tokenType + ". " + error.error.message);
			}
		);
}

