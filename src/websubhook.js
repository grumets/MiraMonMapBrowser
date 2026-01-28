"use strict"

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

    Copyright 2001, 2025 Xavier Pons

	Aquest codi JavaScript ha estat idea de Núria Julià Selvas (n julia at creaf uab cat) 
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


var webSocket=null;
var webSocketId="";
var WebHubSubs=[]; // array with the information of the subscriptions alive
var XAPIKey="TestXAPIKey9876543210";
var i_event_ws=-1;

//depends on md5.min.js

function getLinkArrayFromHTTPLinkHeader(linkHeader) {
	let arrData = linkHeader.split("link:")
	linkHeader = arrData.length == 2 ? arrData[1] : linkHeader;
	let parsed_data = {}

	arrData = linkHeader.split(",")
	let linkInfo;
	for (var d of arrData) {
		linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/ig.exec(d);
		parsed_data[linkInfo[2]] = linkInfo[1];
	}
	return parsed_data;
}

async function DiscoverSTATopic(url_topic) {
	
	var i_event=CreaIOmpleEventConsola("HEAD Discover STA Topic", -1, url_topic, TipusEventDiscover);
	var r=await HTTPHead(url_topic, ["link"]);

	if (!r.responseHeaders["link"])
	{
		CanviaEstatEventConsola(null, i_event, EstarEventError);
		return null;
	}

	var links=getLinkArrayFromHTTPLinkHeader(r.responseHeaders["link"])

	if (!links['hub'])
	{
		CanviaEstatEventConsola(null, i_event, EstarEventError);
		return null;
	}
	CanviaEstatEventConsola(null, i_event, EstarEventTotBe);
	return {hub: links['hub'], self: (links['self'] ? links['self'] : url_topic)};
}

function GetSTAURLtoSubscribe(url)
{
	return RemoveQueryParamFromURL(RemoveQueryParamFromURL(RemoveQueryParamFromURL(RemoveQueryParamFromURL(url, "$top"), "$skip"), "$orderby"), "$count");
}

function getSubscSecret() {
	let result = "";
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	const max=199; // The secret MUST be less than 200 bytes in length.
	while (counter < max) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter++;
    	}
	return result;
}


function removeSubsc(subsc){
	var index = WebHubSubs.indexOf(subsc);
	if (index > -1) // only splice array when item is found
		WebHubSubs.splice(index, 1);
	return WebHubSubs;
}

/*
Entry point to the library. Subscribes to a topic and starts the websocket if necessary. 
WebSocketUrl is the url of the websocket service. Starts with ws: or wss: 
WebHookUrl is the url of the webhook service and part of the callback url. 
WebSubUrl is the websub service that the webhook will communicate with the subcriptions sent POST messatges to subcribe to topics. 
topic is the STA request to subcribe. It cannot contain $top, $count, $skip or $orderby in the root.
id_capa is the id of the capa to be updated. 
lease_seconds is the resubscription period for the WebSub. The function takes care of the resubscription
f_updateCapa is the callback function to call if there are updates for this layer. 
f_message is the callback function to call to show an information or error message
resubsc is internal. Indicates if this is a resubscripton
*/
async function SubscribeTopicToWebHub(WebSocketUrl, WebHookUrl, WebSubUrl, topic, id_capa, lease_seconds, f_updateCapa, f_error, param, resubsc) {
	if(!topic)
		return;	

	if (!webSocket)
		createWS(WebSocketUrl);

	if (!webSocketId) {
		setTimeout(SubscribeTopicToWebHub, 500, WebSocketUrl, WebHookUrl, WebSubUrl, topic, id_capa, lease_seconds, f_updateCapa, f_error, param);
		return;
	}
		
	var subsc=null, re_subs=false;
	for(var i=0; i<WebHubSubs.length; i++)
	{
		if(id_capa==WebHubSubs[i].capaIds)
		{
			if(topic.toLowerCase()==WebHubSubs[i].topic.toLowerCase() )
			{
				// Resubscription
				subsc=WebHubSubs[i];
				re_subs=true;
			}
			else
			{
				// és la mateixa capa però ha canviat el topic i per tant he de cancel·lar la subscripció i fer la nova
				UnSubscribeTopicToWebHub(id_capa);
			}
			break;			
		}
	}
	
	if(!subsc)	
	{
		if (resubsc)
			return;  //We do not resubcribe to a topic that is not there
		WebHubSubs.push({WebSubUrl: WebSubUrl,
			topic: topic,
			capaIds: id_capa,
			callback: WebHookUrl+"?WSId="+webSocketId+"&topic="+md5(topic),
			hub_secret: getSubscSecret(),
			x_api_key: XAPIKey,
			lease_seconds: lease_seconds ? lease_seconds: 20,
			fUpdate: f_updateCapa,
			fError: f_error,
			fParam: param
		});
		subsc=WebHubSubs[WebHubSubs.length-1];
	}	

	// Sending a POST message with some headers and with the data in application/x-www-form-urlencoded' format.	
	var cdns=[];
	cdns.push("hub.callback=" , encodeURIComponent(subsc.callback),
				"&hub.topic=", encodeURIComponent(subsc.topic), 
				"&hub.mode=subscribe",
				"&hub.lease_seconds=", subsc.lease_seconds, 
				"&hub.secret=", subsc.hub_secret,
				"&webhook.x_api_key=",subsc.x_api_key);
		
	HTTPFetch(subsc.WebSubUrl, null, "POST", cdns.join(""), {'Accept': 'text/plain'}, "application/x-www-form-urlencoded; charset=utf-8").then(
				function(value) {
					if (!re_subs)
					{
						AfegeixTextADescripcioEventConsola("Subscription to topic \""+subsc.topic+"\" completed.\nWaiting for notifications...", i_event_ws); 
					}
					// Automatic resubscription
					subsc.timeOut=setTimeout(SubscribeTopicToWebHub, lease_seconds*1000, WebSocketUrl, WebHookUrl, WebSubUrl, topic, id_capa, lease_seconds, f_updateCapa, f_error, param, true);
				},
				function(error) { 
					AfegeixTextADescripcioEventConsola('Subscription to topic \"'+subsc.topic+'\" failed. <br>name: ' + error.name + ' message: ' + error.message + ' at: ' + error.at + ' text: ' + error.text, i_event_ws); 
					removeSubscription(subsc);
					console.log(error);
				}
			);
	return;
}

//Unsubscribes a node to a topic. If no node is subcribed to a topic, the topic is unsubcribed. 
//If no subscriptions, the websocket is closed. 
function UnSubscribeTopicToWebHub(id_capa) {
	var subsc=null;
	for(var i=0; i<WebHubSubs.length; i++) {
		if (id_capa==WebHubSubs[i].capaIds)
		{
			subsc=WebHubSubs[i];
			break;		
		}
	}
	if (!subsc) {	
		AfegeixTextADescripcioEventConsola("Subscription for the layer "+ id_capa+" not found", i_event_ws); 
		return;
	}

	// Sending a POST message with some headers and with the data in application/x-www-form-urlencoded' format.		
	var cdns=[];
	cdns.push("hub.callback=" , encodeURIComponent(subsc.callback),
				"&hub.topic=", encodeURIComponent(subsc.topic), 
				"&hub.mode=unsubscribe",
				"&hub.secret=", subsc.hub_secret,
				"&webhook.x_api_key=", subsc.x_api_key);
	
	HTTPFetch(subsc.WebSubUrl, null, "POST", cdns.join(""), {'Accept': 'text/plain'}, "application/x-www-form-urlencoded; charset=utf-8").then(
				function(value) { 
					AfegeixTextADescripcioEventConsola("Unsubscription to topic \""+subsc.topic+"\" completed.", i_event_ws); 
					clearTimeout(subsc.timeOut);
					removeSubsc(subsc);
					if (WebHubSubs.length)
						return;
					//No subscription left.
					closeWS();
				},
				function(error) { 
					AfegeixTextADescripcioEventConsola('Unsubscription to topic \"'+subsc.topic+'\" failed.\nname: ' + error.name + ' message: ' + error.message + ' at: ' + error.at + ' text: ' + error.text, i_event_ws);
					removeSubscription(subsc);
					console.log(error);
				}
			);
	return;
}


//--------WebSocket management-------------

function onWSOpen(event) {    
	CanviaEstatEventConsola(null, i_event_ws, EstatEventOnGoing);
	AfegeixTextADescripcioEventConsola("Websocket opened.", i_event_ws);
	//alert("Websocket opened. Waiting for WebSocketId...");
	return;
}

function onWSError (event) {  
	AfegeixTextADescripcioEventConsola("Error in websocket" + event, i_event_ws);  
}

async function onWSMessage (event) {    
	// Listen for messages from server
	var data=await event.data;
	try {
		var data_json=JSON.parse(data);
	} catch (error) {
		if (error instanceof SyntaxError) {
			AfegeixTextADescripcioEventConsola("Syntax error parsing " + data + ": " + error.message, i_event_ws); 
			//alert("Syntax error parsing " + data + ": " + error.message);
			console.log('There was a SyntaxError', error);
		}
	}
	if (data_json && data_json.webSocketId && !webSocketId) {
		webSocketId=data_json.webSocketId;
		AfegeixTextADescripcioEventConsola("WebsocketId: " + webSocketId + ".\nWaiting for subscriptions...", i_event_ws); 
		return;
	}
	if (data_json && data_json.topic && data_json.data)
	{
		AfegeixTextADescripcioEventConsola("data received: " + JSON.stringify(data_json), i_event_ws); 
		for(var i=0; i<WebHubSubs.length; i++)
		{
			if(data_json.topic.toLowerCase()==decodeURIComponent(WebHubSubs[i].topic).toLowerCase() ||
			   decodeURIComponent(data_json.topic).toLowerCase()==decodeURIComponent(WebHubSubs[i].topic).toLowerCase())
			{
				var subsc=WebHubSubs[i];
				subsc.fUpdate(data_json.data, subsc.fParam);
				break;
			}
		}
	}
}

function onWSClose (event) {    
	//Connection closed
	AfegeixTextADescripcioEventConsola("WS connection closed", i_event_ws);  
	CanviaEstatEventConsola(null, i_event_ws, EstarEventTotBe);
	webSocketId="";
	webSocket=null;
	i_event_ws=-1;
}

function closeWS() {
	// Closing the WS connection	
	if(webSocket)
		webSocket.close();
}

function createWS(WebSocketUrl)
{	
	closeWS();	

	// Create WebSocket connection.
	i_event_ws=CreaIOmpleEventConsola("WebSocket Connection", -1, WebSocketUrl, TipusEventWebSocket);
	webSocket = new WebSocket(WebSocketUrl);	
	
	// WebSocket events
	webSocket.addEventListener("open", onWSOpen);
	webSocket.addEventListener("message", onWSMessage);
	webSocket.addEventListener("error", onWSError);
	webSocket.addEventListener("close", onWSClose);	
}
