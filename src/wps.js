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

    Copyright 2001, 2021 Xavier Pons

    Aquest codi JavaScript ha estat idea de Joan Masó Pau (joan maso at uab cat) 
    amb l'ajut de Nuria Julià (n julia at creaf uab cat)
    dins del grup del MiraMon. MiraMon és un projecte del 
    CREAF que elabora programari de Sistema d'Informació Geogràfica 
    i de Teledetecció per a la visualització, consulta, edició i anàlisi 
    de mapes ràsters i vectorials. Aquest progamari programari inclou
    aplicacions d'escriptori i també servidors i clients per Internet.
    No tots aquests productes són gratuïts o de codi obert. 
    
    En particular, el Navegador de Mapes del MiraMon (client per Internet) 
    es distribueix sota els termes de la llicència GNU Affero General Public 
    License, mireu https://www.gnu.org/licenses/licenses.html#AGPL.
    
    El Navegador de Mapes del MiraMon es pot actualitzar des de 
    https://github.com/grumets/MiraMonMapBrowser.
*/

"use strict"

var opcio_predefinit=0x00;
var opcio_editable=0x01;
var opcio_url=0x02;

var AJAX_ID=0;
function CancelAjaxExecuteWPS()
{
	if (AJAX_ID)
	{
		clearTimeout(AJAX_ID);
		AJAX_ID=0;
	}
}


var ChronoStartTime = 0;
var ChronoEndTime = 0;
var ChronoDiffTime = 0;
var ChronoTimerID = 0;

function ChrnoInternals(chrono_id)
{
	ChronoEndTime = new Date()
	ChronoDiffTime = ChronoEndTime - ChronoStartTime
	ChronoDiffTime = new Date(ChronoDiffTime)
	var msec = ChronoDiffTime.getMilliseconds()
	var sec = ChronoDiffTime.getSeconds()
	var min = ChronoDiffTime.getMinutes()
	var hr = ChronoDiffTime.getHours()-1
	if (min < 10){
		min = "0" + min
	}
	if (sec < 10){
		sec = "0" + sec
	}
	if(msec < 10){
		msec = "00" +msec
	}
	else if(msec < 100){
		msec = "0" +msec
	}
	document.getElementById(chrono_id).innerHTML = hr + ":" + min + ":" + sec + ":" + msec;
	ChronoTimerID = setTimeout("ChrnoInternals(\""+chrono_id+"\")", 10);
}

function ChronoResetAndStart(chrono_id)
{
	document.getElementById(chrono_id).innerHTML = "0:00:00:000";
	ChronoStop();
	ChronoStartTime = new Date();
	ChrnoInternals(chrono_id);
}

function ChronoStop()
{
	if (ChronoTimerID)
	{
		clearTimeout(ChronoTimerID);
		ChronoTimerID=0;
	}
}

var ajaxExecuteWPS=[];

function UpdateAjaxExecuteWPS(url)
{
var url2;
var index=ajaxExecuteWPS.length;

	//WARNING: In order this to work, the server has to be configured to expire the content immmendiatelly in this folder
	ajaxExecuteWPS[index]=new Ajax();
		
	var s=AfegeixNomServidorARequest(url, "", true, false);
	ajaxExecuteWPS[index].doGet(s, AvaluaRespostaExecuteWPS, "text/xml", 
					document);
}

function AvaluaRespostaExecuteWPS(doc, document_html)
{
var root;
var i,j;

	if(!doc) 
		return;	
	root=doc.documentElement;
	if(!root) 
		return;
	resposta=document.getElementById("responseWPS");
	if (root.xml && resposta)
	{		
		resposta.value=root.xml;
	}
	else if (XMLSerializer && resposta)
	{
		var serializer = new XMLSerializer();   
		resposta.value=serializer.serializeToString(root);		
	}
	else if(resposta)
		resposta.value="Sorry, the server responded but I do not know how to show the result on this browser.";	
		
	if(root.nodeName!="wps:ExecuteResponse")  //Això passa quan ho he fet amb soap
	{
		root=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengeospatial.net/wps", "wps", "ExecuteResponse")[0];
	}
	
	var reference=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengeospatial.net/wps", "wps", "Reference");
	if (reference && reference.length>0)
	{		
		reference=reference[0];
		if(reference)
		{			
			document.getElementById("ResponseWPSReference").innerHTML="<b>"+DonaCadenaLang({"cat":"Resultat: ", "spa":"Resultado: ", "eng":"Result: ", "fre":"Résultat: "})+
					"</b><br>"+"<a href=\"" + reference.getAttribute('href') + "\" target=\"_blank\">" + reference.getAttribute('href') + "</a>";			
		}
	}
	var localitzacio_estat=root.getAttribute('statusLocation');
	
	var status=DonamElementsNodeAPartirDelNomDelTag(root, "http://www.opengeospatial.net/wps", "wps", "Status");
	if (status.length>0)
	{
		status=status[0];
		var percent=-1;
		var process_status=DonamElementsNodeAPartirDelNomDelTag(status, "http://www.opengeospatial.net/wps", "wps", "ProcessAccepted");
		if (process_status && process_status.length>0)
		{
			AJAX_ID=setTimeout("UpdateAjaxExecuteWPS(\"" + localitzacio_estat + "\");", 2*1000);					
			document.getElementById("StatusResponseWPS").innerHTML=DonaCadenaLang({"cat":"Acceptat", "spa":"Aceptado", "eng":"Accepted", "fre":"Accepté"});
			return;
		}
		process_status=DonamElementsNodeAPartirDelNomDelTag(status, "http://www.opengeospatial.net/wps", "wps", "ProcessStarted");
		if (process_status && process_status.length>0)
		{
			var process_started=process_status[0];
			percent=parseInt(process_started.getAttribute('percentCompleted'),10);
			
			AJAX_ID=setTimeout("UpdateAjaxExecuteWPS(\"" + localitzacio_estat + "\");", 2*1000);					
			document.getElementById("StatusResponseWPS").innerHTML=DonaCadenaLang({"cat":"Iniciat", "spa":"Iniciado", "eng":"Started", "fre":"Initié"})+ 
			DonaCadenaLang({"cat":" percentatge completat: ","spa":" porcentaje completado: ","eng":" percent completed: ", "fre":" pourcentage complété: "})+percent+"%";
			return;
		}
		process_status=DonamElementsNodeAPartirDelNomDelTag(status, "http://www.opengeospatial.net/wps", "wps", "ProcessPaused");
		if (process_status && process_status.length>0)
		{
			var process_paused=process_status[0];
			percent=parseInt(process_paused.getAttribute('percentCompleted'),10);
			
			AJAX_ID=setTimeout("UpdateAjaxExecuteWPS(\"" + localitzacio_estat + "\");", 2*1000);					
			if(percent!=-1)
				document.getElementById("StatusResponseWPS").innerHTML=DonaCadenaLang({"cat":"Pausat", "spa":"Pausado", "eng":"Paused", "fre":"En pause"})+ 
				DonaCadenaLang({"cat":" percentatge completat: ","spa":" porcentaje completado: ","eng":" percent completed: ", "fre":" pourcentage complété: "})+percent+"%";
			else
				document.getElementById("StatusResponseWPS").innerHTML=DonaCadenaLang({"cat":"Pausat", "spa":"Pausado", "eng":"Paused", "fre":"En pause"});
			return;
		}
		process_status=DonamElementsNodeAPartirDelNomDelTag(status, "http://www.opengeospatial.net/wps", "wps", "ProcessSucceeded");
		if (process_status && process_status.length>0)
		{
			document.getElementById("StatusResponseWPS").innerHTML=DonaCadenaLang({"cat":"Finalitzat", "spa":"Finalizado", "eng":"Succeeded", "fre":"Terminé"});
			document.getElementById("ResponseWPSReference").style.display="inline";
		}
		process_status=DonamElementsNodeAPartirDelNomDelTag(status, "http://www.opengeospatial.net/wps", "wps", "ProcessFailed");
		if (process_status && process_status.length>0)
		{
			var codi_error=null, text_error=null;
			var excepcio=DonamElementsNodeAPartirDelNomDelTag(process_status[0], "http://www.opengeospatial.net/ows", "ows", "ExceptionReport");
			if(excepcio && excepcio.length>0)
			{
				excepcio=DonamElementsNodeAPartirDelNomDelTag(excepcio[0], "http://www.opengeospatial.net/ows", "ows", "Exception");
				if(excepcio)
				{
					excepcio=excepcio[0];
					codi_error=excepcio.getAttribute('exceptionCode');
					text_error=DonamElementsNodeAPartirDelNomDelTag(excepcio, "http://www.opengeospatial.net/ows", "ows", "ExceptionText");
					if(text_error && text_error.length>0)
						text_error=text_error[0].childNodes[0].nodeValue;
				}
			}
			var cadena=DonaCadenaLang({"cat":"Error: ", "spa":"Error: ", "eng":"Failed: ", "fre":"Erreur: "});
			if(codi_error)
				cadena+=codi_error;
			if(text_error)
				cadena+="<blockquote><br>\""+text_error+ "\"";
						
			document.getElementById("StatusResponseWPS").innerHTML=cadena;
		}			
		document.getElementById("StatusResponseWPS").style.display="inline";
	}				
	ChronoStop();
	return;
}


/*function CreaInputDeProcesAExecutar(id, valor, flags)
{
	this.identificador=id;
	this.valor=valor;
	this.flags=flags;
}*/

/*function CreaProcesAExecutar(servidor,operacio,inputs)
{
	this.servidor=servidor;  //URL del servidor
	this.servidor_on_fer_peticio=null;
	this.operacio=operacio; //identificador de l'operació
	this.input=inputs; //new Array de CreaInputDeProcesAExecutar
}*/

var ProcessosAExecutar=[];


function OmpleCreaProcesAExecutarDeFormulari(i_capa)
{
var input=[];
var i_proces=document.SeleccionaProcesCapa.sel_proces.value;
var operacio=ParamCtrl.capa[i_capa].proces[i_proces].operacio;
var s1;

	for(var i=0; i<operacio.par_input.length; i++)
	{
		var form_activat=document.getElementById("p_form_input_"+i);
		if(form_activat.disabled==false)
		{
			if(operacio.par_input[i].InputOutputValorCapaWPS && operacio.par_input[i].InputOutputValorCapaWPS==true)
			{
				s1=ParamCtrl.capa[i_capa].proces[i_proces].capa_wps;			
			}
			else if(operacio.par_input[i].InputOutputValorBoolea && operacio.par_input[i].InputOutputValorBoolea==true)
			{
				var opcio=document.getElementById("p_check_"+i);
				var i_valor;
				if(opcio.checked)
				{
					for(i_valor=0; i_valor<operacio.par_input[i].valors.length; i_valor++)
					{				
						if(operacio.par_input[i].valors[i_valor].nom=="true" ||
						   operacio.par_input[i].valors[i_valor].nom=="si"  ||
						   operacio.par_input[i].valors[i_valor].nom=="yes"  ||
						   operacio.par_input[i].valors[i_valor].nom=="1")
						{
							s1=operacio.par_input[i].valors[i_valor].nom;
							break;
						}
					}				
				}
				else
				{
					for(i_valor=0; i_valor<operacio.par_input[i].valors.length; i_valor++)
					{				
						if(operacio.par_input[i].valors[i_valor].nom=="false" ||
						   operacio.par_input[i].valors[i_valor].nom=="no"  ||
						   operacio.par_input[i].valors[i_valor].nom=="0")
						{
							s1=operacio.par_input[i].valors[i_valor].nom;
							break;
						}
					}	
				}
				if(i_valor==operacio.par_input[i].valors.length)
				{
					alert(DonaCadenaLang({"cat":"No s'ha definit cap valor pel paràmetre \"",
									  "spa":"No se ha definido ningún valor para el paràmetro \"",
									  "eng":"Any value has been defined by parameter \"",
									  "fre":"Aucun valeur défini pour le paramètre \""})+ DonaCadena(operacio.par_input[i].nom.desc)+ "\"");
					return -1;
				}
			}
			else if(operacio.par_input[i].InputOutputValorEditable && operacio.par_input[i].InputOutputValorEditable==true &&
				operacio.par_input[i].InputOutputValorPredefinit && operacio.par_input[i].InputOutputValorPredefinit==true)
			{
				var opcio=document.getElementById("e_opcio_"+i);
				var sel_opcio;
				if(opcio.checked)
					sel_opcio=opcio_editable;
				else
				{
					opcio=document.getElementById("u_opcio_"+i);
					if(opcio && opcio.checked)
						sel_opcio=opcio_url;
					else
						sel_opcio=opcio_predefinit;
				}

				if(sel_opcio==opcio_predefinit)
				{
					var i_selec=parseInt(document.getElementById("p_sel_input_"+i).value,10);
					s1=CanviaRepresentacioCaractersProhibitsPerAtributXML(operacio.par_input[i].valors[i_selec].nom);
				}
				else if(sel_opcio==opcio_editable)
				{
					var text=document.getElementById("e_text_"+i);
					if(text && text.value && text.value!="")
						s1=CanviaRepresentacioCaractersProhibitsPerAtributXML(text.value);
					else
					{
						var cadena_error=DonaCadenaLang({"cat":"No s'ha definit cap valor pel paràmetre \"",
										  "spa":"No se ha definido ningún valor para el paràmetro \"",
										  "eng":"Any value has been defined by parameter \"",
										  "fre":"Aucun valeur défini pour le paramètre \""})+ DonaCadena(operacio.par_input[i].nom.desc)+ "\"";
						
						var file=document.getElementById("e_file_"+i);
						if(file && file.value)
						{
							cadena_error+=DonaCadenaLang({"cat":"\nCal enviar el fitxer al servidor abans d'executar el procès.",
													  "spa":"\nEs necesario enviar el fichero al servidor antes de ejecutar el proceso.",
													  "eng":"\nIt is necessary to send the file to the server before executing the process.",
													  "fre":"\nIl faut envoyer le fichier au serveur avant d'exécuter le processus."});
						}
						alert(cadena_error);					
						return -1;
					}
				}
				else
				{
					var text=document.getElementById("u_text_"+i);
					if(text && text.value && text.value!="")
					{
						if(false==ComprovaSiFormatFitxerParamProcesEsCorrecte(text.value, i_capa, i_proces, i))
							return -1;
						if(false==EsUnaURLValida(text.value))
						{
							alert(DonaCadenaLang({"cat":"La URL introduïda en el paràmetre \"", 
											  "spa":"La URL introducida en el parametro \"", 
											 "eng": "The URL introduced in the parameter \"",
											  "fre":"La URL introduite au paramètre \""}) +
									  DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces].operacio.par_input[i].nom.desc)+ 
									  DonaCadenaLang({"cat":"\" és invàlida.","spa":"\" es invalida.", "eng":"\" is invalid.", "fre":"n'est pas valide."}));
							return -1;
						}					
						s1=CanviaRepresentacioCaractersProhibitsPerAtributXML(text.value);					
					}
					else
					{
						alert(DonaCadenaLang({"cat":"No s'ha definit cap valor pel paràmetre \"",
										  "spa":"No se ha definido ningún valor para el paràmetro \"",
										  "eng":"Any value has been defined by parameter \"",
										  "fre":"Aucun valeur défini pour le paramètre \""})+ DonaCadena(operacio.par_input[i].nom.desc)+ "\"");
						return -1;					
					}
				}
			}
			else if(operacio.par_input[i].InputOutputValorPredefinit && operacio.par_input[i].InputOutputValorPredefinit==true)
			{
				var i_selec=parseInt(document.getElementById("p_sel_input_"+i).value,10);
				s1=CanviaRepresentacioCaractersProhibitsPerAtributXML(operacio.par_input[i].valors[i_selec].nom);
			}
			else //if(operacio.par_input[i].InputOutputValorEditable && operacio.par_input[i].InputOutputValorEditable==true)
			{
				if(operacio.par_input[i].InputOutputTipusRefFitxer && operacio.par_input[i].InputOutputTipusRefFitxer==true)
				{
					var opcio=document.getElementById("e_opcio_"+i);
					if(opcio.checked)
					{
						var text=document.getElementById("e_text_"+i);
						if(text && text.value)
							s1=CanviaRepresentacioCaractersProhibitsPerAtributXML(text.value);
						else
						{
							var cadena_error=DonaCadenaLang({"cat":"No s'ha definit cap valor pel paràmetre: \"",
											  "spa":"No se ha definido ningún valor para el paràmetro: \"",
											  "eng":"Any value has been defined by parameter: \"",
											  "fre":"Aucun valeur défini pour le paramètre: \""})+ DonaCadena(operacio.par_input[i].nom.desc)+ "\"";
							
							var file=document.getElementById("e_file_"+i);
							if(file && file.value)
							{
								cadena_error+=DonaCadenaLang({"cat":"\nCal enviar el fitxer al servidor abans d'executar el procès.",
													  "spa":"\nEs necesario enviar el fichero al servidor antes de ejecutar el proceso.",
													  "eng":"\nIt is necessary to send the file to the server before executing the process.",
													  "fre":"\nIl faut envoyer le fichier au serveur avant d'exécuter le processus"});
							}
							alert(cadena_error);					
							return -1;
						}
					}
					else
					{
						var text=document.getElementById("u_text_"+i);
						if(text && text.value && text.value!="")
						{
							if(false==ComprovaSiFormatFitxerParamProcesEsCorrecte(text.value, i_capa, i_proces, i))
								return;
							if(false==EsUnaURLValida(text.value))
							{
								alert(DonaCadenaLang({"cat":"La URL introduïda en el paràmetre \"", 
											  "spa":"La URL introducida en el parametro \"", 
											  "eng":"The URL introduced in the parameter \"",
											  "fre":"La URL introduite au paramètre \""}) +
								  DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces].operacio.par_input[i].nom.desc)+ 
									  DonaCadenaLang({"cat":"\" és invàlida.","spa":"\" es invalida.", "eng":"\" is invalid.", "fre":"n'est pas valide."}));
								return -1;
							}
							s1=CanviaRepresentacioCaractersProhibitsPerAtributXML(text.value);
						}
						else
						{
							alert(DonaCadenaLang({"cat":"No s'ha definit cap valor pel paràmetre \"",
											  "spa":"No se ha definido ningún valor para el paràmetro \"",
											  "eng":"Any value has been defined by parameter \"",
											  "fre":"Aucun valeur défini pour le paramètre \""})+  DonaCadena(operacio.par_input[i].nom.desc)+ "\"");
							return -1;					
						}
					}
				}
				else
				{
					var text=document.getElementById("e_text_"+i);
					if(text && text.value && text.value!="")
						s1=CanviaRepresentacioCaractersProhibitsPerAtributXML(text.value);
					else
					{
						var cadena_error=DonaCadenaLang({"cat":"No s'ha definit cap valor pel paràmetre: \"",
											  "spa":"No se ha definido ningún valor para el paràmetro: \"",
											  "eng":"Any value has been defined by parameter: \"",
											  "fre":"Aucun valeur défini pour le paramètre: \""})+ DonaCadena(operacio.par_input[i].nom.desc)+ "\"";

						alert(cadena_error);					
						return -1;
					}					
				}
			}
			input[input.length]={"identificador": operacio.par_input[i].nom.nom,
					"valor": s1,
					"InputOutputTipusReferencia": operacio.par_input[i].InputOutputTipusReferencia,
					"InputOutputTipusRefFitxer": operacio.par_input[i].InputOutputTipusRefFitxer,
					"InputOutputTipusDada": operacio.par_input[i].InputOutputTipusDada};
//					"flags": operacio.par_input[i].flags_tipus};	
		}
	}
	//Falten els outputs ·$·
	ProcessosAExecutar[ProcessosAExecutar.length]={
				"servidor": operacio.servidor,
				"servidor_on_fer_peticio": null,
				"operacio": operacio.id_operacio.nom,
				"input": input};
	return (ProcessosAExecutar.length-1);
}

function DonaRequestExecuteProces(i_proces)
{
var cdns=[];

	//si el servidor no és el local cal afegir el paràmetre servertoreuqes,
	//mirar com fer-ho en aquest cas

	if(ProcessosAExecutar && i_proces<ProcessosAExecutar.length)
	{
		var peticio_en_cascada=false;
		if ((typeof ProcessosAExecutar[i_proces].cors==="undefined" || ProcessosAExecutar[i_proces].cors==false) && location.host && DonaHost(ProcessosAExecutar[i_proces].servidor).toLowerCase()!=location.host.toLowerCase() && ParamCtrl.ServidorLocal)
			peticio_en_cascada=true;
	
		cdns.push("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n");
		
		if(peticio_en_cascada)
			cdns.push("<soap:Envelope xmlns:soap=\"http://www.w3.org/2001/12/soap-envelope\" ",
				  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" ",
				  "xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" ",
				  "xsi:schemaLocation=\"http://www.w3.org/2001/12/soap-envelope http://www.w3.org/2001/12/soap-envelope.xsd\">\n",
				  "<soap:Body>\n");

		cdns.push("<Execute service=\"WPS\" version=\"1.0.0\" xmlns=\"http://www.opengis.net/wps/1.0.0\" \n",
				  "xmlns:ows=\"http://www.opengis.net/ows/1.1\" \n",
				  "xmlns:xlink=\"http://www.w3.org/1999/xlink\" \n",
				  "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/wps/1.0.0 \n",
				  ParamCtrl.WPSschemaURL+"/wps/1.0.0/wpsExecute_request.xsd\">\n",
				  "	<ows:Identifier>",ProcessosAExecutar[i_proces].operacio,"</ows:Identifier>\n");
		
		if(ProcessosAExecutar[i_proces].input)
		{
			cdns.push("	<DataInputs>\n");		
			for(var i=0; i<ProcessosAExecutar[i_proces].input.length; i++)
			{
				cdns.push("		<Input>\n",
						"			<ows:Identifier>",ProcessosAExecutar[i_proces].input[i].identificador,"</ows:Identifier>\n");
				
				if((ProcessosAExecutar[i_proces].input[i].InputOutputTipusReferencia && ProcessosAExecutar[i_proces].input[i].InputOutputTipusReferencia==true) || 
					(ProcessosAExecutar[i_proces].input[i].InputOutputTipusRefFitxer && ProcessosAExecutar[i_proces].input[i].InputOutputTipusRefFitxer==true))
				{
					cdns.push("			<Reference xlink:href=\"" , ProcessosAExecutar[i_proces].input[i].valor , "\" schema=\"\"/>\n");
				}
				else
				{
					cdns.push("			<Data>\n",
							"				<LiteralData>", ProcessosAExecutar[i_proces].input[i].valor +"</LiteralData>\n" ,
							"			</Data>\n");
					//De tipus Data n'hi ha 3: LiteralData, ComplexData permet incrustar el gml directament aquí o BoundingBoxData
				}
				cdns.push("		</Input>\n");
			}
			cdns.push("	</DataInputs>\n");
		}
		
		//Falten els outputs ·$·
		//Falten els outputs ·$·
		//·$· Cal programar la definició dels outputs ara he fet la porqueria d'escriure el que necessito NJ
		cdns.push("	<ResponseForm>\n",
				"		<ResponseDocument storeExecuteResponse=\"true\" status=\"true\">\n",
				"			<Output asReference=\"true\" mimeType=\"application/gml+xml\" encoding=\"ISO-8859-1\" schema=\"http://schemas.opengis.net/schemas/gml/3.1.1/base/gml.xsd\">\n",			
				"				<ows:Identifier>OutputFile</ows:Identifier>\n",
				"			</Output>\n",
				"		</ResponseDocument>\n",				
				"	</ResponseForm>\n",
				"</Execute>\n");
		
		/*cdns.push("	<ResponseForm>\n",
				"		<ResponseDocument storeExecuteResponse=\"true\" status=\"true\">\n",
				"			<Output asReference=\"true\">\n",			
				"				<ows:Identifier>result</ows:Identifier>\n",
				"			</Output>\n",
				"		</ResponseDocument>\n",				
				"	</ResponseForm>\n",
				"</Execute>\n");*/
		
		if(peticio_en_cascada)
		{
			var s_host=DonaHost(ParamCtrl.ServidorLocal);
			var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
			if (s_host.toLowerCase()!=location.host.toLowerCase())
				ProcessosAExecutar[i_proces].servidor_on_fer_peticio=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal.substring(0,pos_host)+
								location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length));
			else
				ProcessosAExecutar[i_proces].servidor_on_fer_peticio=ParamCtrl.ServidorLocal;
			cdns.push("<ServerToRequest>",DonaNomServidorSenseCaracterFinal(ProcessosAExecutar[i_proces].servidor),"</ServerToRequest>\n");
		}
		else
			ProcessosAExecutar[i_proces].servidor_on_fer_peticio=DonaNomServidorSenseCaracterFinal(ProcessosAExecutar[i_proces].servidor);
		if(peticio_en_cascada)
			cdns.push("</soap:Body>\n",
					"</soap:Envelope>\n");	
	
		return cdns.join("");
	}
	return "";
}

function ExecutaRequestProces(servidor, request)
{
	ChronoResetAndStart("ChronoTimeWPS");
	CancelAjaxExecuteWPS();

	ajaxExecuteWPS=new Ajax();
	//alert(request);
	ajaxExecuteWPS.doPost(servidor, 
			"text/xml", request, 
			AvaluaRespostaExecuteWPS, "text/xml", 
			document);				
}

var MostraAvancadesWPS=true;

function MostraOAmagaAvancades()
{
	var resposta=document.getElementById("responseWPS");
	if(resposta)
	{
		if(MostraAvancadesWPS)
		{
			resposta.style.display="inline";
			MostraAvancadesWPS=false;
		}
		else
		{
			resposta.style.display="none";
			MostraAvancadesWPS=true;
		}		
	}
}

function OmpleEstructGlobalIExecutaProces(i_capa)
{
var request;
var i_proces_a_executar;


	if (!document.ExecutaProcesCapa)
		return false;

	//Agafo la info del formulari més la de la estructura i construeixo la petició		
	i_proces_a_executar=OmpleCreaProcesAExecutarDeFormulari(i_capa);
	if(i_proces_a_executar==-1)
		return false;

	request=DonaRequestExecuteProces(i_proces_a_executar);		
	
	if(request!="")
	{
		var cdns=[];
		var elem=getLayer(this, "executarProces_finestra");
		var i_proces=document.SeleccionaProcesCapa.sel_proces.value;
		
		contentLayer(elem, null);
		MostraAvancadesWPS=true;
		cdns.push("<div class=\"finestraproces\" name=\"estat_execucio\" id=\"estat_execucio\">",
				  "<b>",DonaCadenaLang({"cat":"Estat de l'execució", "spa":"Estado de la ejecución", "eng":"State of execution", "fre":"État de l'exécution"}),"</b><hr><br>",
				  "<b>",DonaCadenaLang({"cat":"Capa: ","spa":"Capa: ","eng":"Layer: ", "fre":"Couche: "}),"</b>",DonaCadena(ParamCtrl.capa[i_capa].desc),"<br><br>",
				  "<b>",DonaCadenaLang({"cat":"Procés: ", "spa":"Proceso: ", "eng":"Process: ", "fre":"Processus: "}),"</b>", DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces].operacio.id_operacio.desc),"<br><br>",
				  "<b>",DonaCadenaLang({"cat":"Temps d'execució: ","spa":"Tiempo de ejecución:	","eng":"Execution time: ", "fre":"Durée d’exécution: "}),"</b>","<span id=\"ChronoTimeWPS\">0:00:00:00</span><br><br>",
				  "<b>",DonaCadenaLang({"cat":"Estat: ", "spa":"Estado: ", "eng":"Status: ", "fre":"État: "}),"</b>", "<span id=\"StatusResponseWPS\"></span>",
				  "<br><br><span id=\"ResponseWPSReference\"></span>",
				  "<br><br><a  href=\"javascript:void(0);\" onClick=\"MostraOAmagaAvancades()\"; id=\"AvancadesResponseWPS\">",
				  DonaCadenaLang({"cat":"Opcions avançades","spa":"Opciones avanzadas","eng":"Advanced options","fre":"Options avancées"}),"</a>", 
				  "<textarea class=\"Verdana11px\" name=\"responseWPS\" id=\"responseWPS\" wrap=off cols=80 rows=15 style=\"display:none\"></textarea>",
				  "<br><br><center><input type=\"button\" value=\"",DonaCadenaLang({"cat":"Tancar", "spa":"Cerrar", "eng":"Close", "fre":"Quitter"}),
				  "\" onClick='TancaFinestraLayer(\"executarProces\");'/></center></div>");
		s=cdns.join("");
		contentLayer(elem, s);			
		ExecutaRequestProces(ProcessosAExecutar[i_proces_a_executar].servidor_on_fer_peticio, request);
		return true;
	}
	else
	{
		alert(DonaCadenaLang({"cat":"Error al construir la petició d'execució", 
							 "spa":"Error al construir la petición de ejecución", 
							 "eng":"Error while building execution request", 
							 "fre":"Erreur en construisant la demande d'exécution"}));
		return false;
	}
}//Fi de OmpleEstructGlobalIExecutaProces()

var ajaxEstatEnviaFitxer=[];
var EstatProcesEnviaFitxer=[];

function CreaEstatProcesEnviaFitxer(i_capa, i_proces_sel, i_input, id_proces)
{
	this.i_capa=i_capa;
	this.i_proces_sel=i_proces_sel;
	this.i_input=i_input;
	this.id_proces=id_proces;
}


function ActivaIMostraButtonEnviar(activar, i_input)
{
var boto_submit=document.getElementById("e_submit_"+i_input);
var boto_cancel=document.getElementById("e_cancel_"+i_input);
var exp_file=document.getElementById("e_file_"+i_input);
var path_file=document.getElementById("e_filepath_user_"+i_input);
var form=document.getElementById("e_form_input_"+i_input);
var opcio=document.getElementById("e_opcio_"+i_input);
	
	if(activar)
	{
		exp_file.style.display="none";
		path_file.style.display="inline";
		path_file.innerHTML=exp_file.value;
		boto_submit.style.display="inline";
		boto_submit.disabled=false;
		boto_cancel.style.display="inline";
		boto_cancel.disabled=false;
	}
	else
	{
		form.reset();
		opcio.checked=true;
		exp_file.style.display="inline";		
		path_file.style.display="none";
		boto_submit.style.display="none";
		boto_cancel.style.display="none";	
	}
}

function EsUnaURLValida(text)
{
	//var re=/^(file|http):\/\/S+.(com|net|org|info|biz|ws|us|es|cat|tv|cc)$/i;
	//La cadena ha de començar per file o http, 
	//S vol dir que busqui un caracter no blanc
	//S+ vol dir que n'hi hagi com a mínim un 
	//.
	//i alguna  de les seguënts extensions

	var re=/^(file|http):\/\/\w+(\.\w+)*\.\w{2,3}$/i; 	
	//http o file ://(n caracteres).(n caracteres)(0 ó más veces).(2 ó 3 caracteres)
	if (re.test(text))
		return true;
	return false;
}

function ComprovaSiFormatFitxerParamProcesEsCorrecte(sz_fitxer, i_capa, i_proces_sel, i_input)
{
	if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].formats)
	{
		var ext_fitxer=DonaExtensioFitxerSensePunt(sz_fitxer);
		if(ext_fitxer=="")
		{
			alert(DonaCadenaLang({"cat":"Format incorrecte. Formats permesos by parameter ", 
						  "spa":"Formato incorrecto. Formatos permitidos by parameter ", 
						  "eng":"Wrong format. Allowed formats by parameter ",
						  "fre":"Format incorrect. Formats permis by parameter "}) +
				  "\"" + DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].nom.desc)+ "\" :"+
				  ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].formats.join(",") + ".");
			return false;
		}
		ext_fitxer=ext_fitxer.toLowerCase();
		for(var i=0; i<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].formats.length; i++)
		{
			if(ext_fitxer==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].formats[i].toLowerCase())
				return true;
		}
		alert(DonaCadenaLang({"cat":"Format incorrecte. Formats permesos by parameter ", 
					      	  "spa":"Formato incorrecto. Formatos permitidos by parameter ", 
						      "eng":"Wrong format. Allowed formats by parameter ",
						      "fre":"Format incorrect. Formats permis by parameter "}) +
			  "\""+ DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].nom.desc)+ "\" :"+
		      ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].formats.join(",") + ".");
		return false;
	}
	return true;
}

function ComprovaActivaIMostraButtonEnviar(activar, i_capa, i_proces_sel, i_input)
{
var exp_file=document.getElementById("e_file_"+i_input);
	
	if(exp_file && exp_file.value)
	{
		if(true==ComprovaSiFormatFitxerParamProcesEsCorrecte(exp_file.value, i_capa, i_proces_sel, i_input))
			ActivaIMostraButtonEnviar(activar, i_input);
	}
}

function TornaASeleccionarFitxer(i_capa, i_proces_sel, i_input)
{
//Mostro el selector de fitxers i esborro la selecció que hi havia
var span_estat_file=document.getElementById("estat_file_"+i_input);
var nom_fitxer_servidor=document.getElementById("e_text_"+i_input);
var nom_fitxer_usuari=document.getElementById("e_file_user_"+i_input);		
var exp_file=document.getElementById("e_file_"+i_input);
var path_file=document.getElementById("e_filepath_user_"+i_input);
var boto_submit=document.getElementById("e_submit_"+i_input);
var boto_cancel=document.getElementById("e_cancel_"+i_input);
var boto_sel_altre_fitxer=document.getElementById("e_sel_file_"+i_input);
var form=document.getElementById("e_form_input_"+i_input);
var opcio_e=document.getElementById("e_opcio_"+i_input);
var opcio_u=document.getElementById("u_opcio_"+i_input);
var opcio_p=document.getElementById("u_opcio_"+i_input);
var sel_opcio=0;

	if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable && 
	   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable==true &&
	   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer && 
	   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer==true)
	{
		
		if(opcio_e && opcio_e.checked)
			sel_opcio=opcio_editable;
		else
		{
			if(opcio_u && opcio_u.checked)
				sel_opcio=opcio_url;
			else
				sel_opcio=opcio_predefinit;
		}
	}
	form.reset();
	exp_file.style.display="inline";
	exp_file.value="";
	boto_submit.style.display="none";
	boto_cancel.style.display="none";
	path_file.style.display="none";
	path_file.innerHTML="";
	span_estat_file.style.display="none";
	nom_fitxer_servidor.value="";		
	nom_fitxer_usuari.style.display="none";
	nom_fitxer_usuari.value="";
	boto_sel_altre_fitxer.style.display="none";
	
	//Genero un nou identificador de proces
	NIdProces++;
	var id_proces=IdProces+"_"+NIdProces;
	var id_file=document.getElementById("id_file_"+i_input);
	id_file.value=id_proces;
		
	if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable && 
	   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable==true &&
	   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer && 
	   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer==true)
	{
		if(sel_opcio==opcio_predefinit)
		{
			opcio_p.checked=true;
			ActivaTextPredefinit(i_input);
		}
		else if(sel_opcio==opcio_editable)
		{
			opcio_e.checked=true;
			ActivaTextEditable(i_input);
		}
		else 
		{
			opcio_u.checked=true;
			ActivaTextURL(i_input);
		}
	}
}

function AvaluaRespostaEstatProcesEnviaFitxer(doc, estat_proces)
{
var percentatge=-1;
var nom_fitxer, descp_fitxer;
var node, node2;

	//en cas d'error crec que hauria de modificar el formulari perquè no estigui esperant indefinidament el fitxer
	if(doc)
	{
		var root=doc.documentElement;	
		if(root)
		{
			node=root.getElementsByTagName('status');
			node=node[0];
			if(node && node.childNodes)
			{
				for(var i=0; i<node.childNodes.length; i++)
				{
					node2=node.childNodes[i];
					if(node2.nodeName=="ProcessAccepted")
					{
						percentatge=0;
						break;
					}
					else if(node2.nodeName=="ProcessStarted")
					{
						percentatge=node2.getAttribute('percentCompleted');
						break;
					}
					else if(node2.nodeName=="ProcessSucceeded")
					{
						percentatge=100;
						nom_fitxer=node2.getAttribute('serverfile');
						descp_fitxer=node2.getAttribute('userfilename');
						break;
					}
				}
			}
		}
	}
	//S'ha de modificar alguna cosa del formulari
	
	if(percentatge==-1)
	{
		alert(DonaCadenaLang({"cat":"S'ha produït algun error durant l'enviament del fitxer. Torna-ho a intentar",
						  "spa":"Se ha producido algun error durante el envío del fichero. Vuélvalo a intentar",
						  "eng":"Has been occurred an error while sending the file. Try again",
						  "fre":"Une erreur vient de se produire pendant l'envoi du fichier. Réessayez"}));
		//S'ha produit algun error torno a deixar les coses preparades per enviar un altre fitxer
		TornaASeleccionarFitxer(estat_proces.i_capa, estat_proces.i_proces_sel, estat_proces.i_input);
		return;
	}
	var span_estat_file=document.getElementById("estat_file_"+estat_proces.i_input);
	var nom_fitxer_servidor=document.getElementById("e_text_"+estat_proces.i_input);
	var nom_fitxer_usuari=document.getElementById("e_file_user_"+estat_proces.i_input);		
	var exp_file=document.getElementById("e_file_"+estat_proces.i_input);
	var path_file=document.getElementById("e_filepath_user_"+estat_proces.i_input);
	var boto_submit=document.getElementById("e_submit_"+estat_proces.i_input);
	var boto_cancel=document.getElementById("e_cancel_"+estat_proces.i_input);
	var boto_sel_altre_fitxer=document.getElementById("e_sel_file_"+estat_proces.i_input);
	if(percentatge<100)
	{
		//Mostro l'estat d'enviament i desactivo la resta de coses
		var cdns=[]; 
		cdns.push(DonaCadenaLang({"cat":"Enviant fitxer", "spa":"Enviando fichero", "eng":"Sending file", "fre":"Fichier en cours d’envoi"}), " ", percentatge, "%");
		span_estat_file.innerHTML=cdns.join("");
		span_estat_file.style.display="inline";						
	}
	else
	{
		span_estat_file.style.display="none";				
		nom_fitxer_servidor.value=nom_fitxer;	
		nom_fitxer_usuari.style.display="inline";
		nom_fitxer_usuari.value=descp_fitxer;		
		boto_sel_altre_fitxer.style.display="inline";
	}
	path_file.style.display="none";
	exp_file.style.display="none";
	boto_submit.style.display="none";
	boto_cancel.style.display="none";		
	if(percentatge>=0 && percentatge<100)
		setTimeout("ActualitzaValorParametre("+estat_proces.i_capa+","+estat_proces.i_proces_sel+","+estat_proces.i_input+", \'"+estat_proces.id_proces+"\')", 500);
	return;
}

function ActualitzaValorParametre(i_capa, i_proces_sel, i_input, id_proces)
{
var i_ajax=ajaxEstatEnviaFitxer.length;
		
	//Només s'usa per enviar un fitxer, i aquesta petició sempre és al ServidorLocal
	if (location.host && DonaHost(ParamCtrl.ServidorLocal).toLowerCase()!=location.host.toLowerCase())
	{
		var s_host=DonaHost(ParamCtrl.ServidorLocal);
		var pos_host=(-1!=ParamCtrl.ServidorLocal.indexOf("//")) ? ParamCtrl.ServidorLocal.indexOf("//")+2 : 0;
		if (s_host.toLowerCase()!=location.host.toLowerCase())
		{
			//Canvio l'arrel del servidor local per l'arrel de la plana del navegador per estar segur que l'ajax funcionarà sense "cross server vulmerability".
			servidor=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal.substring(0,pos_host)+location.host+ParamCtrl.ServidorLocal.substring(pos_host+s_host.length, ParamCtrl.ServidorLocal.length));
		}
		else
			servidor=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal);
	}
	else
		servidor=DonaNomServidorCaracterFinal(ParamCtrl.ServidorLocal);
	
	var request=servidor+"VERSION=1.2.0&REQUEST=GetProcessStatus&IDPROCES="+id_proces+"&FORMAT=text/xml&I_AJAX="+i_ajax;

	ajaxEstatEnviaFitxer[i_ajax]=new Ajax();
	EstatProcesEnviaFitxer[i_ajax]=new CreaEstatProcesEnviaFitxer(i_capa, i_proces_sel, i_input, id_proces);

	ajaxEstatEnviaFitxer[i_ajax].doGet(request, AvaluaRespostaEstatProcesEnviaFitxer, 
									   "text/xml", EstatProcesEnviaFitxer[i_ajax]);
}
	
function EnviarFitxerAlServidor(i_capa, i_proces_sel, i_input)
{
	var id_file=document.getElementById("id_file_"+i_input);
	var id_proces=id_file.value;

	setTimeout("ActualitzaValorParametre("+i_capa+","+i_proces_sel+","+i_input+", \'"+id_proces+"\')", 500);
	return;
}

function ActivaTextURL(i_input)
{
var elem;
	elem=document.getElementById("p_opcio_"+i_input);
	if(elem)
		elem.checked=false;		
	elem=document.getElementById("e_opcio_"+i_input);
	if(elem)
		elem.checked=false;		
	elem=document.getElementById("p_sel_input_"+i_input);
	if(elem)
		elem.disabled=true;
	elem=document.getElementById("e_file_"+i_input);
	if(elem)
		elem.disabled=true;		
	elem=document.getElementById("e_submit_"+i_input);
	if(elem)
		elem.disabled=true;		
	elem=document.getElementById("e_cancel_"+i_input);
	if(elem)
		elem.disabled=true;			
	elem=document.getElementById("e_sel_file_"+i_input);						
	if(elem)
		elem.disabled=true;		
	elem=document.getElementById("e_text_"+i_input);
	if(elem)
		elem.disabled=true;
	elem=document.getElementById("u_text_"+i_input);
	if(elem)
		elem.disabled=false;
}

function ActivaTextPredefinit(i_input)
{
var elem;
	elem=document.getElementById("e_opcio_"+i_input);
	if(elem)
		elem.checked=false;
	elem=document.getElementById("u_opcio_"+i_input);
	if(elem)
		elem.checked=false;
	elem=document.getElementById("p_sel_input_"+i_input);
	if(elem)
		elem.disabled=false;
	elem=document.getElementById("e_file_"+i_input);
	if(elem)
		elem.disabled=true;		
	elem=document.getElementById("e_submit_"+i_input);
	if(elem)
		elem.disabled=true;		
	elem=document.getElementById("e_cancel_"+i_input);
	if(elem)
		elem.disabled=true;			
	elem=document.getElementById("e_sel_file_"+i_input);						
	if(elem)
		elem.disabled=true;		
	elem=document.getElementById("e_text_"+i_input);
	if(elem)
		elem.disabled=true;
	elem=document.getElementById("u_text_"+i_input);
	if(elem)
		elem.disabled=true;
}

function ActivaTextEditable(i_input)
{
var elem;

	elem=document.getElementById("p_opcio_"+i_input);
	if(elem)
		elem.checked=false;
	elem=document.getElementById("u_opcio_"+i_input);
	if(elem)
		elem.checked=false;
	elem=document.getElementById("p_sel_input_"+i_input);
	if(elem)
		elem.disabled=true;
	elem=document.getElementById("e_file_"+i_input);
	if(elem)
		elem.disabled=false;		
	elem=document.getElementById("e_submit_"+i_input);
	if(elem)
		elem.disabled=false;
	elem=document.getElementById("e_cancel_"+i_input);
	if(elem)
		elem.disabled=false;						
	elem=document.getElementById("e_sel_file_"+i_input);						
	if(elem)
		elem.disabled=false;					
	elem=document.getElementById("e_text_"+i_input);
	if(elem)
		elem.disabled=false;
	elem=document.getElementById("u_text_"+i_input);
	if(elem)
		elem.disabled=true;
}

var ProcessosAActivar=[];
var ProcessosADesactivar=[];
function AfegeixProcessosAActivar(id_proces_a)
{
	ProcessosAActivar=ProcessosAActivar.concat(id_proces_a);
}

function AfegeixProcessosADesactivar(id_proces_d)
{
	ProcessosADesactivar=ProcessosADesactivar.concat(id_proces_d);
}

function ActivaIDesactivaProcessosAlFerClic(i_capa,i_proces_sel,i_input)
{
var elem=document.getElementById("p_check_"+i_input), i;

	ProcessosAActivar=[];
	ProcessosADesactivar=[];
	if(elem)
	{
		if(elem.checked)
		{
			for(i=0; i<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa.length; i++)
			{
				if("true"==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a ||
				   "1"==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a ||
				   "yes"==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a ||
				   "si"==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a)
				{
					AfegeixProcessosAActivar(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].id_proces_a);
				}
				else
					AfegeixProcessosADesactivar(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].id_proces_a);		
			}
		}
		else
		{
			for(i=0; i<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa.length; i++)
			{
				if("no"==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a ||
				   "0"==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a ||
				   "false"==ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a)
				{
					AfegeixProcessosAActivar(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].id_proces_a);
				}
				else
					AfegeixProcessosADesactivar(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].id_proces_a);		
			}
		}
		ActivaIDesactivaLlistaProcessos(i_capa, i_proces_sel);
	}
}

function ActivaIDesactivaLlistaProcessos(i_capa, i_proces_sel)
{
var i,j;

	//Necessito marcar tots els forms com a actius
	for(j=0; j<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input.length;j++)
	{
		elem=document.getElementById("p_form_input_"+j);
		if(elem)
			elem.disabled=false;
	}
	//Miro quins processos cal activar
	for(i=0; i<ProcessosAActivar.length;i++)
	{
		for(j=0; j<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input.length;j++)
		{
			if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[j].nom.nom==ProcessosAActivar[i])
			{
				elem=document.getElementById("p_form_input_"+j);
				if(elem)
					elem.disabled=false;
				elem=document.getElementById("p_sel_input_"+j);
				if(elem)
					elem.disabled=false;
				break;
			}
		}
	}
	for(i=0; i<ProcessosADesactivar.length;i++)
	{
		for(j=0; j<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input.length;j++)
		{
			if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[j].nom.nom==ProcessosADesactivar[i])
			{
				elem=document.getElementById("p_form_input_"+j);
				if(elem)
					elem.disabled=true;
				elem=document.getElementById("p_sel_input_"+j);
				if(elem)
					elem.disabled=true;
				break;
			}
		}
	}
}

function ActualitzaParametresProces(i_capa, i_proces_sel)
{
var i_valor, i;
var cdns=[]; 


	ProcessosAActivar=[];
	ProcessosADesactivar=[];

	contentLayer(getLayer(this, "parametres_operacio_wps"), null);	
	if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input)
	{				
		cdns.push("<b>",
				  DonaCadenaLang({"cat":"Paràmetres d'entrada: ","spa":"Parámetros de entrada: ", "eng":"Input parameters: ", "fre":"Paramètres d'entrée: "}), 
				  "</b>",
				  "<br><br>");
		for(var i_input=0; i_input<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input.length; i_input++)
		{
			
			if( ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorCapaWPS && 
				ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorCapaWPS==true)
			{
				cdns.push(DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].nom.desc), ": ");
				cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"p_form_input_",i_input,"\" name=\"p_form_input_",i_input, "\">",
						  "<input class=\"Verdana11px\" readonly type=\"text\" size=\"50px\" name=\"p_text_", 
						  i_input, "\" id=\"p_text_", i_input, "\" value=\"", DonaCadena(ParamCtrl.capa[i_capa].desc),"\" />",
						  "</form>");
			}
			else if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorBoolea && 
					ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorBoolea==true)
			{
				var i_valor=0;
				var i;
				//Formulari de tipus check
				cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"p_form_input_",i_input,"\" name=\"p_form_input_",i_input, "\">",
						  "<input class=\"Verdana11px\" type=\"checkbox\" id=\"p_check_", i_input, "\" name=\"p_check_", i_input, 
						  "\" value=\"boleana\"");
				//només hauria de tenir 2 valors (si/no) (yes/no) (1/0) (true/false)
				for(i_valor=0; i_valor<2; i_valor++)
				{
					if(i_valor<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors.length)
					{
						if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].sel)
						{
							if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].nom=="true" ||
							   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].nom=="si"  ||
							   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].nom=="yes"  ||
							   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].nom=="1" )
							{
								cdns.push(" checked");
								i_seleccionat=i_valor;
							}
								
							break;
						}						
					}
				}
				if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa)
				{
					cdns.push(" onClick=\"ActivaIDesactivaProcessosAlFerClic(",i_capa,",",i_proces_sel,",",i_input, ");\"/>");
					for(i=0; i<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa.length; i++)
					{
						if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].nom==
							ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].valor_a)
							AfegeixProcessosAActivar(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].id_proces_a);
						else
							AfegeixProcessosADesactivar(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].activa[i].id_proces_a);
					}
				}
				else
					cdns.push("/>");
				cdns.push(DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].nom.desc),
						  "</form>");
			}
			else if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable && 
					ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable==true &&
					ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorPredefinit && 
					ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorPredefinit==true)
			{
				cdns.push(DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].nom.desc), ": ");
				//Formulari de la part de l'input predefinida
				cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"p_form_input_",i_input,"\" name=\"p_form_input_",i_input, "\">",
						  "<input class=\"Verdana11px\" type=\"radio\" id=\"p_opcio_", i_input, "\" name=\"p_opcio_", i_input, 
						  "\" value=\"predefinit\" onClick=\"ActivaTextPredefinit(",i_input, ");\" checked />");
				if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer && 
				   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer==true)
					cdns.push("<label for=\"p_opcio_",i_input,"\">",DonaCadenaLang({"cat":"Predefinit","spa":"Predefinido","eng":"Predefined","fre":"Prédéfinie"}),": </label>");
				
				cdns.push("<select class=\"Verdana11px\" name=\"p_sel_input_", i_input, "\" id=\"p_sel_input_", i_input,"\">");
				for(i_valor=0; i_valor<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors.length; i_valor++)
				{
					cdns.push("<option value=\"", i_valor,"\" ",
							((ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].sel) ? "selected" : ""), ">",
							DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].desc), "</option>");
				}
				cdns.push("</select></form>");
				
				//Formulari de la part de l'input editable				
				if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer && 
				   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer==true)
				{					
	  				NIdProces++;
					var id_proces=IdProces+"_"+NIdProces;
												
					//El selector de fitxers locals
					cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"e_form_input_",i_input,
							  "\" name=\"e_form_input_",i_input, "\" action=\"",ParamCtrl.ServidorLocal,"\"",
							  "enctype=\"multipart/form-data\" method=\"post\" target=\"retorn_fitxers_operacio_wps_",i_input,
							  "\" onSubmit=\"EnviarFitxerAlServidor(",i_capa,",",i_proces_sel,",",i_input,");\" >",							  
							  "<input class=\"Verdana11px\" type=\"radio\"  id=\"e_opcio_", i_input, "\" name=\"e_opcio_", i_input, 
						  	  "\" value=\"editable\" onClick=\"ActivaTextEditable(", i_input,");\" />",							  
							  "<label for=\"e_opcio_",i_input,"\">",DonaCadenaLang({"cat":"Local","spa":"Local","eng":"Local","fre":"Local"}),": </label>",
							  "<span class=\"Verdana11px\" id=\"estat_file_",i_input,"\" style=\"display:none\"></span>",
							  "<input type=\"hidden\" id=\"id_file_",i_input, "\" name=\"idfile\" value=\"",id_proces,"\" />",
							  "<input class=\"Verdana11px\" disabled size=\"60px\" type=\"file\" id=\"e_file_", i_input, "\" name=\"datafile\" ",
							  "onChange=\"ComprovaActivaIMostraButtonEnviar(true,",i_capa,",",i_proces_sel,",",i_input,");\" />",
							  "<input class=\"Verdana11px\" readonly size=\"60px\" type=\"text\" id=\"e_file_user_", i_input, "\" style=\"display:none\" />",
							  "<span class=\"Verdana11px\" id=\"e_filepath_user_", i_input, "\" style=\"display:none\"></span>",
 							  "<input class=\"Verdana11px\" disabled type=\"button\" id=\"e_sel_file_", i_input, "\" style=\"display:none\" value=\"",
							  DonaCadenaLang({"cat":"Canviar el fitxer", "spa":"Cambiar el fichero", "eng":"Change a file", "fre":"Changer le fichier"}),"\" onclick=\"",
							  "TornaASeleccionarFitxer(", i_capa, ",", i_proces_sel, ",", i_input, ");\" />",
							  "<input type=\"hidden\" id=\"e_text_", i_input, "\" name=\"e_text_", i_input, "\" />",
							  "  <input class=\"Verdana11px\" disabled type=\"submit\" id=\"e_submit_", i_input, "\" value=\"", 
							  DonaCadenaLang({"cat":"Enviar","spa":"Enviar","eng":"Send","fre":"Envoyer"}),
							  "\" style=\"display:none\" />",
							  "  <input class=\"Verdana11px\" disabled type=\"button\" id=\"e_cancel_", i_input, "\" value=\"", 
							  DonaCadenaLang({"cat":"Cancel·lar","spa":"Cancelar","eng":"Cancel","fre":"Annuler"}),
							  "\" style=\"display:none\" onclick=\"ActivaIMostraButtonEnviar(false,",i_input,");\" />",
							  "</form>",
							  "<iframe name=\"retorn_fitxers_operacio_wps_", i_input, "\" style=\"display:none\"></iframe>");
					//L'edit per escriure url's
					cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"u_form_input_",i_input,"\" name=\"u_form_input_",i_input, "\">",
						      "<input class=\"Verdana11px\" type=\"radio\" id=\"u_opcio_", i_input, "\" name=\"u_opcio_", i_input, 
						      "\" value=\"url\" onClick=\"ActivaTextURL(",i_input, ");\" />",							  
							  "<label for=\"u_opcio_",i_input,"\">",DonaCadenaLang({"cat":"URL","spa":"URL","eng":"URL","fre":"URL"}),": </label>",
							  "<input type=\"text\" id=\"u_text_",i_input,"\" disabled size=\"60px\" />",
							  "</form>");					
				}
				else
				{
					cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"e_form_input_",i_input,"\" name=\"e_form_input_",i_input, "\">",
							  "<input class=\"Verdana11px\" type=\"radio\"  id=\"e_opcio_", i_input, "\" name=\"e_opcio_", i_input, 
							  "\" value=\"editable\" onClick=\"ActivaTextEditable(", i_input,");\" />",
							  "<input class=\"Verdana11px\" type=\"text\" size=\"50px\" name=\"e_text_", i_input, 
							  "\" id=\"e_text_",i_input, "\" disabled />",
							  "</form>");
				}
			}
			else if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorPredefinit && 
					ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorPredefinit==true)
			{
				cdns.push(DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].nom.desc), ": ");
				cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"p_form_input_",i_input,"\" name=\"p_form_input_",i_input, "\">",
						  "<select class=\"Verdana11px\" id=\"p_sel_input_", i_input, "\" name=\"p_sel_input_", i_input, "\">");
				
				for(i_valor=0; i_valor<ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors.length; i_valor++)
				{
					cdns.push("<option value=\"", i_valor,"\" ",
							((ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].sel) ? "selected" : ""), ">",
							DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].valors[i_valor].desc), "</option>");
				}
				cdns.push("</select></form>");				
			}
			else //if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable &&
				 // ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputValorEditable==true)
			{
				cdns.push(DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].nom.desc), ": ");
				//Formulari de la part de l'input editable				
				if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer && 
				   ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_input[i_input].InputOutputTipusRefFitxer==true)
				{
					NIdProces++;
					var id_proces=IdProces+"_"+NIdProces;
																
					//El selector de fitxers locals
					cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"e_form_input_",i_input,
							  "\" name=\"e_form_input_",i_input, "\" action=\"",ParamCtrl.ServidorLocal,"\"",
							  "enctype=\"multipart/form-data\" method=\"post\" target=\"retorn_fitxers_operacio_wps_",i_input,
							  "\" onSubmit=\"EnviarFitxerAlServidor(",i_capa,",",i_proces_sel,",",i_input,");\" >",							  
							  "<input class=\"Verdana11px\" type=\"radio\"  id=\"e_opcio_", i_input, "\" name=\"e_opcio_", i_input, 
						  	  "\" value=\"editable\" onClick=\"ActivaTextEditable(", i_input,");\" checked/>",							  
							  "<label for=\"e_opcio_",i_input,"\">",DonaCadenaLang({"cat":"Local","spa":"Local","eng":"Local","fre":"Local"}),": </label>",
							  "<span class=\"Verdana11px\" id=\"estat_file_",i_input,"\" style=\"display:none\"></span>",
							  "<input type=\"hidden\" id=\"id_file_",i_input, "\" name=\"idfile\" value=\"",id_proces,"\" />",
							  "<input class=\"Verdana11px\" size=\"60px\" type=\"file\" id=\"e_file_", i_input, "\" name=\"datafile\" ",
							  "onChange=\"ComprovaActivaIMostraButtonEnviar(true,",i_capa,",",i_proces_sel,",",i_input,");\" />",
							  "<input class=\"Verdana11px\" readonly size=\"60px\" type=\"text\" id=\"e_file_user_", i_input, "\" style=\"display:none\" />",
							  "<span class=\"Verdana11px\" id=\"e_filepath_user_", i_input, "\" style=\"display:none\"></span>",
 							  "<input class=\"Verdana11px\" type=\"button\" id=\"e_sel_file_", i_input, "\" style=\"display:none\" value=\"",
							  DonaCadenaLang({"cat":"Canviar el fitxer", "spa":"Cambiar el fichero", "eng":"Change a file", "fre":"Changer le fichier"}),"\" onclick=\"",
							  "TornaASeleccionarFitxer(", i_capa, ",", i_proces_sel, ",", i_input, ");\" />",
							  "<input type=\"hidden\" id=\"e_text_", i_input, "\" name=\"e_text_", i_input, "\" />",
							  "  <input class=\"Verdana11px\" type=\"submit\" id=\"e_submit_", i_input, "\" value=\"", 
							  DonaCadenaLang({"cat":"Enviar","spa":"Enviar","eng":"Send","fre":"Envoyer"}),
							  "\" style=\"display:none\" />",
							  "  <input class=\"Verdana11px\" type=\"button\" id=\"e_cancel_", i_input, "\" value=\"", 
							  DonaCadenaLang({"cat":"Cancel·lar","spa":"Cancelar","eng":"Cancel","fre":"Annuler"}),
							  "\" style=\"display:none\" onclick=\"ActivaIMostraButtonEnviar(false,",i_input,");\" />",
							  "</form>",
							  "<iframe name=\"retorn_fitxers_operacio_wps_", i_input, "\" style=\"display:none\"></iframe>");
					//L'edit per escriure url's
					cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"u_form_input_",i_input,"\" name=\"u_form_input_",i_input, "\">",
						      "<input class=\"Verdana11px\" type=\"radio\" id=\"u_opcio_", i_input, "\" name=\"u_opcio_", i_input, 
						      "\" value=\"url\" onClick=\"ActivaTextURL(",i_input, ");\" />",							  
							  "<label for=\"u_opcio_",i_input,"\">",DonaCadenaLang({"cat":"URL","spa":"URL","eng":"URL","fre":"URL"}),": </label>",
							  "<input type=\"text\" id=\"u_text_",i_input,"\" disabled size=\"60px\" />",
							  "</form>");					
				}
				else
				{
					cdns.push("<form style=\"margin-top:3px;margin-bottom:0\" id=\"p_form_input_",i_input,"\" name=\"p_form_input_",i_input, "\">",
							  "<input class=\"Verdana11px\" type=\"text\" size=\"60px\" name=\"e_text_", i_input, 
							  "\" id=\"e_text_",i_input, "\">",
  							  "</form>");
				}
			}
			cdns.push("<br>");
		}
		cdns.push("<br>");
	}
	if(ParamCtrl.capa[i_capa].proces[i_proces_sel].operacio.par_output)
	{
		cdns.push("<b>",DonaCadenaLang({"cat":"Paràmetres de sortida: ","spa":"Parámetros de salida: ", "eng":"Output parameters: ", "fre":"Paramètres de sortie: "}), "</b>","<br><br>");
		//·$· Falta fer aquesta part
		cdns.push("<br><br>");				
	}	
	var s=cdns.join("");
	contentLayer(getLayer(this, "parametres_operacio_wps"), s);	
	ActivaIDesactivaLlistaProcessos(i_capa, i_proces_sel);
}
//Fi de ActualitzaParametresProces()

function FinestraExecutaProcesCapa(elem, i_capa)
{
var cdns=[];
var s;
var i_proces, i; 

	//Esborro el contingut de la finestra
	contentLayer(elem, null);
	if (ParamCtrl.capa[i_capa].proces && ParamCtrl.capa[i_capa].proces.length>0)
	{	
		cdns.push("<div class=\"finestraproces\" id=\"finestraproces\">",
				"<form name=\"SeleccionaProcesCapa\" id=\"SeleccionaProcesCapa\">");
		if(!(ParamCtrl.capa[i_capa].ProcesMostrarTitolCapa && ParamCtrl.capa[i_capa].ProcesMostrarTitolCapa==false))
		{
			cdns.push("<b>", 
				DonaCadenaLang({"cat":"Capa a processar: ","spa":"Capa a procesar: ","eng":"Layer to process: ","fre":"Couche à traiter: "}),
			  	"</b>",DonaCadena(ParamCtrl.capa[i_capa].desc),"<br><br><hr>");
		}
		cdns.push("<b>",DonaCadenaLang({"cat":"Operació a executar: ", "spa":"Operación a ejecutar: ", "eng":"Operation to execute: ", "fre":"Opération à exécuter: "}),
			  	"</b><br><br><select name=\"sel_proces\" id=\"sel_proces\" class=\"Verdana11px\"",
				"onChange=\"ActualitzaParametresProces(",i_capa,", document.SeleccionaProcesCapa.sel_proces.value);\">");	  

		for (i_proces=0; i_proces<ParamCtrl.capa[i_capa].proces.length; i_proces++)
		{
			if(ParamCtrl.capa[i_capa].proces[i_proces].operacio)
			{
				cdns.push("<option value=\"", i_proces,"\"", ((i_proces==0)? " selected":""), ">",
					DonaCadena(ParamCtrl.capa[i_capa].proces[i_proces].operacio.id_operacio.desc), "</option>");
			}
			else
			{
				alert(DonaCadenaLang({"cat":"La capa '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' té processos sense cap operació definida",
									  "spa":"La capa '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' tiene procesos sin ninguna operación definida",
									  "eng":"The layer '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' have some process without any operation defined",
									  "fre":"La couche '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' a des processus sans aucune opération définie"}));
			}
		}
		cdns.push("</select></form><div name=\"parametres_operacio_wps\" id=\"parametres_operacio_wps\"></div>",
				  "<form name=\"ExecutaProcesCapa\" id=\"ExecutaProcesCapa\" onSubmit=\"return OmpleEstructGlobalIExecutaProces(",i_capa,");\"\>",
				  "<center><input TYPE=\"submit\" VALUE=\"",DonaCadenaLang({"cat":"Executar", "spa":"Ejecutar", "eng":"Execute", "fre":"Exécuter"}),"\" /></center></form></div>");				
	}
	else
	{
		alert(DonaCadenaLang({"cat":"La capa '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' no té capa procés executable definit",
						  "spa":"La capa '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' no tiene ningún proceso ejecutable definido",
						  "eng":"The layer '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' do not have any executable proces defined",
						  "fre":"La couche '"+DonaCadena(ParamCtrl.capa[i_capa].desc)+"' n'a aucun processus exécutable définit"}));
	}
	s=cdns.join("");
	contentLayer(elem, s);
	ActualitzaParametresProces(i_capa, document.SeleccionaProcesCapa.sel_proces.value);		
}

function IniciaFinestraExecutaProcesCapa(i_capa)
{
var elem=ObreFinestra(this, "executarProces", DonaCadenaLang({"cat":"d'afegir capes al navegador",
							 "spa":"de añadir capas al navegador",
							 "eng":"of adding a layer to the browser",
							 "fre":"pour ajouter des couches au navigateur"}));
	if (!elem)
		return;
	FinestraExecutaProcesCapa(elem, i_capa);			
}//Fi de IniciaFinestraExecutaProcesCapa()