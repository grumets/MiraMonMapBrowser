class ScratchMiraMonMapBrowser {
	constructor(runtime) {
        	this.runtime = runtime;
		this.lasthat = true;
	}
    	
	getInfo() {
        	return {
			"id": "MiraMonMapBrowser",
			"name": "MiraMon Maps",
			"blocks": [
				{
					"opcode": "OpenAnotherWindow",
					"blockType": "command",
					"text": "Open map brower [url]",
					"arguments": {
						"url": {
							"type": "string",
							"defaultValue": "https://www.datacube.cat/cdc"
						}						
					}
				},
				{
					"opcode": "SetZoomMap",
					"blockType": "command",
					"text": "Zoom map to [costat] m",
					"arguments": {
						"costat": {
							"type": "number",
							"defaultValue": "20"
						}
					}
				},
				{
					"opcode": "SetCenterMap",
					"blockType": "command",
					"text": "Pan map to x: [x] y: [y]",
					"arguments": {
						"x": {
							"type": "number",
							"defaultValue": "428200"
						},
						"y": {
							"type": "number",
							"defaultValue": "4582500"
						}						
					}
				},
				{
					"opcode": "SetDateMap",
					"blockType": "command",
					"text": "Date map to year: [year] month: [month] day [day]",
					"arguments": {
						"year": {
							"type": "number",
							"defaultValue": "2021"
						},
						"month": {
							"type": "number",
							"defaultValue": "8"
						},						
						"day": {
							"type": "number",
							"defaultValue": "20"
						}						
					}
	        	},				
				{
					"opcode": "WhenStopTravelling",
					"blockType": "hat",
                	"text": "When stop travel",
		            "arguments": {
					}
				},
				{
					"opcode": "GetPositionMap",
					"blockType": "reporter",
					"text": "Map position",
					"arguments": {						
					}
				},
        	]
		};
	}
    
	OpenAnotherWindow({url})
	{
		window.addEventListener("message", ProcessMessageFromMiraMonMapBrowser);
		MiraMonMapBrowserVars.mmnURL=url;
		MiraMonMapBrowserVars.mmn=window.open(url, "_blank", "width=1400,height=800");
	}

	SetZoomMap({costat})
	{
		MiraMonMapBrowserVars.mmn.postMessage("CommandMMNSetZoom("+costat+")", GetCleanURLMiraMonMapBrowser(MiraMonMapBrowserVars.mmnURL));
	}

	SetCenterMap(punt)
	{
		MiraMonMapBrowserVars.mmn.postMessage("CommandMMNSetCenterCoord("+JSON.stringify(punt)+")", GetCleanURLMiraMonMapBrowser(MiraMonMapBrowserVars.mmnURL));
	}

	SetDateMap(date)
	{
		MiraMonMapBrowserVars.mmn.postMessage("CommandMMNSetDateTime("+JSON.stringify(date)+")", GetCleanURLMiraMonMapBrowser(MiraMonMapBrowserVars.mmnURL));
	}

	WhenStopTravelling()
	{
		//You need to alternate between returning true of false to trigger the event.
		if (this.lasthat==MiraMonMapBrowserVars.currentLocText)
			return true;
		else
		{
			this.lasthat=MiraMonMapBrowserVars.currentLocText;
			return false;
		}
	}

	GetPositionMap()
	{
		return MiraMonMapBrowserVars.currentLocText;
	}	
}

var MiraMonMapBrowserVars=
{
	mmn: null,
	mmnURL: null,
	currentLocText: ""
}

function GetCleanURLMiraMonMapBrowser(url)
{
	if (url.indexOf('?')==-1)
		return url;
	return url.substring(0, url.indexOf('?'));
}

function GetOriginURLMiraMonMapBrowser(url)
{
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

function ProcessMessageFromMiraMonMapBrowser(event)
{
		// Do we trust the sender of this message?
		if (event.origin !== GetOriginURLMiraMonMapBrowser(MiraMonMapBrowserVars.mmnURL))
			return;

		try
		{
			var data=JSON.parse(event.data);
		}	
		catch (e) 
		{
			alert("JSON message parse error: " + e + " The response was:\n" + event.data);
			return;
		}

		if (data.msg === "MiraMon Map Browser is listening")
		{
			MiraMonMapBrowserVars.currentLocText="Ready!";
			return;
		}

		if (data.msg === "MiraMon Map Browser closed")
		{
			MiraMonMapBrowserVars.currentLocText="";
			MiraMonMapBrowserVars.mmn=null;
			MiraMonMapBrowserVars.mmnURL=null;
			return;
		}
		if (data.msg === "MiraMon Map Browser current location text")
		{
			MiraMonMapBrowserVars.currentLocText=data.text;
			return;
		}
}

(function() {
	var extensionInstance = new ScratchMiraMonMapBrowser(window.vm.extensionManager.runtime)
	var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
	window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()