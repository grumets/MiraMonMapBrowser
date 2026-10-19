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
    i Núria Julià (n julia at creaf uab cat)
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



//Carrega hello.js, authen.js i authenix.js quan hi ha autenticació bearer.
//Els altres proveïdors s'indiquen a authProviderScripts o s'inclouen a index.htm.
async function CarregaAutenticacio(param_ctrl)
{
	if (!param_ctrl.accessClientId)
		return;

	await IncludeScript("hello.all.min.js");
	await IncludeScript("authen.js");
	await IncludeScript("authenix.js");
	if (param_ctrl.authProviderScripts)
		for (var i=0; i<param_ctrl.authProviderScripts.length; i++)
			await IncludeScript(param_ctrl.authProviderScripts[i]);
}

//Retorna l'objecte de capçaleres amb Authorization per a capa.access, per passar-lo a HTTPFetch(), HTTPHead() o HTTPBinaryData() a headersToSend. Retorna null si no hi ha credencials disponibles.
function DonaCapcaleraAuthorization(access)
{
	var authResponse;

	if (!access)
		return null;
	if (access.authenticationType=="basic")
		return access.cadenaAutenBasica ? {"Authorization": access.cadenaAutenBasica} : null;
	if (!window.hello)
		return null;
	authResponse=hello(access.tokenType ? access.tokenType : "authenix").getAuthResponse();
	if (IsAuthResponseOnline(authResponse))
		return {"Authorization": "Bearer "+authResponse.access_token};
	return null;
}


function DonaCadenaBasicAuth(user, pass) {
  return "Basic " + window.btoa(
    unescape(encodeURIComponent(`${user}:${pass}`))
  );
}



function DonaCadenaFinestraAutentificacioBasica(i_capa)
{
var cdns=[];
	cdns.push("<form method='dialog' id='loginFormBasicAuth'><p class='Verdana11px'>",GetMessage("LoginServidor", "authens"),
			ParamCtrl.capa[i_capa].servidor, " ('",DonaCadena(ParamCtrl.capa[i_capa].DescLlegenda),"')</p>",
			"<label class='Verdana11px'>",GetMessage("User", "authens"),"<input type='text' id='username' class='Verdana11px' required></label><br><br>",
			"<label class='Verdana11px'>",GetMessage("Password", "authens"),"<input type='password' id='password' class='Verdana11px' required></label><br><br>",
			"<input type='button' class='Verdana11px' value='",GetMessage("OK"),"' id='OKBasicAuth'/>",
			"<input type='button' class='Verdana11px' value='", GetMessage("Cancel"), "' id='CancelBasicAuth'/></form>");
	return cdns.join("");
}

/* Les capes es demanen en paral·lel. Un segon showModal, amb el primer diàleg
   encara al document, no rep el clic: getElementById enganxa l'onclick als
   botons del primer i el diàleg de dalt queda inert. */
   
var cuaDialogAutenBasica=[];

function DonaCadenaAutentificacioBasicaCapa(dialogAB, formAB, i_capa)
{
	var capa=ParamCtrl.capa[i_capa];
	if(!capa.access || capa.access.authenticationType!="basic")
	{
		dialogAB.close("error");
		return;
	}
	if(!formAB.username.value)
	{
		alert(Message("ValidUserMustBeProvided", "authens"));
		return;
	}
	if(!formAB.password.value)
	{
		alert(Message("ValidPasswordMustBeProvided", "authens"));
		return;
	}
	capa.access.cadenaAutenBasica=DonaCadenaBasicAuth(formAB.username.value, formAB.password.value);
	dialogAB.close("ok");
	return;
}

function ObreSeguentDialogAutenBasica()
{
	var dialogPrevi, peticio, i_capa, capa, dialogABasica, formAB, okBA, cancelBA, acabat;

	if (!cuaDialogAutenBasica.length)
		return;
	dialogPrevi=document.getElementById("autenBasica");
	if (dialogPrevi && !dialogPrevi.open && dialogPrevi.parentNode)
		dialogPrevi.parentNode.removeChild(dialogPrevi);

	peticio=cuaDialogAutenBasica[0];
	i_capa=peticio.i_capa;
	capa=ParamCtrl.capa[i_capa];
	if (capa.access && capa.access.cadenaAutenBasica)
	{
		cuaDialogAutenBasica.shift();
		peticio.resolve(true);
		ObreSeguentDialogAutenBasica();
		return;
	}

	dialogABasica=CreaDialog("autenBasica", DonaCadenaFinestraAutentificacioBasica(i_capa));
	formAB=dialogABasica.querySelector("form");
	okBA=dialogABasica.querySelector("#OKBasicAuth");
	cancelBA=dialogABasica.querySelector("#CancelBasicAuth");
	acabat=false;

	function acaba(ok)
	{
		if (acabat)
			return;
		acabat=true;
		if (dialogABasica.open)
			dialogABasica.close(ok ? "ok" : "cancel");
		if (dialogABasica.parentNode)
			dialogABasica.parentNode.removeChild(dialogABasica);
		cuaDialogAutenBasica.shift();
		if (ok)
			peticio.resolve(true);
		else
			peticio.reject(false);
		// Fora de l'event close/click, perquè un showModal encadenat no quedi inert.
		setTimeout(ObreSeguentDialogAutenBasica, 0);
	}

	okBA.onclick=function () {
		DonaCadenaAutentificacioBasicaCapa(dialogABasica, formAB, i_capa);
		// Si la validació falla, el diàleg continua obert.
		if (!dialogABasica.open)
			acaba(!!(ParamCtrl.capa[i_capa].access && ParamCtrl.capa[i_capa].access.cadenaAutenBasica));
	};
	cancelBA.onclick=function () {
		acaba(false);
	};
	dialogABasica.addEventListener("close", function () {
		acaba(!!(ParamCtrl.capa[i_capa].access && ParamCtrl.capa[i_capa].access.cadenaAutenBasica));
	});
	dialogABasica.showModal();
}

async function CreaDialogAutentificacioBasica(i_capa)
{
	return new Promise(function(resolve, reject){
		cuaDialogAutenBasica.push({i_capa: i_capa, resolve: resolve, reject: reject});
		if (cuaDialogAutenBasica.length==1)
			ObreSeguentDialogAutenBasica();
	});
}
