"use strict"

const MMN_PM_IsListening="MiraMon Map Browser is listening";
const MMN_PM_Closed="MiraMon Map Browser closed";
const MMN_PM_CurrentLocationText="MiraMon Map Browser current location text";

function GetCleanURLMiraMonMapBrowser(url){
	if (url.indexOf('?')==-1)
		return url;
	return url.substring(0, url.indexOf('?'));
}

function GetOriginURLMiraMonMapBrowser(url){
	if (url.indexOf('//')==-1)
	{
		if (url.indexOf('/')==-1)
			return url;
		return url.substring(0, url.indexOf('/'));
	}		
	if (url.substring(url.indexOf('//')+2).indexOf('/')==-1)
		return url;
	return url.substring(0, url.substring(url.indexOf('//')+2).indexOf('/')+url.indexOf('//')+2);
}

// Do we trust the sender of this message?
function IsTrustedMiraMonMapBrowser(event, mmnUrl){
	return event.origin === GetOriginURLMiraMonMapBrowser(mmnUrl);
}
