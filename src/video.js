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

var RodetVertical=false;  // Constant. el mode vertical no s'ha provat mai.
var DatesVideo=[];  //Un array de propietats de cada "fotograma" de conforma el video: {"i_capa":, "i_data":, "i_estil:, "millisegons":, "animable":("si", "ara_no", "no"), "carregada":, "carregadaRodet":, "timeoutRodet":, "timeoutFotograma":}
var IDataVideoMostrada;
var IDataVideoInicial, IDataVideoFinal;  //Només útils al principi de la càrrega. Després DatesVideo és manipulat per eliminar les dates fora de l'interval que desapareixen del array.
var NomVideoActiu;
var PuntsSerieTemporal=[], IconaVideoClick={}, ImgVideoStat, ImgVideoStatHistograma;
//var EstadisticCarregatVideo=null;
var IFilEixXEixTVideo=-1    //Index de fila que representa la imatge x/t
var IDataFilEixXEixT=[];    //Array amb d'index de fotograma que representa cada linia (fila) de la imatge x/t

var timeoutVideoID=null, timeoutVideoInfo=null;

function OrdenacioCapesVideoData(x,y)
{
	//Ascendent per data
	return (x.millisegons - y.millisegons);
}

function EsCapaAptePerVideo(capa)
{
	if (capa.NomVideo!=null && (DonaTipusServidorCapa(capa)=="TipusWMS" || DonaTipusServidorCapa(capa)=="TipusHTTP_GET") &&   // Segurament les capes en TipusOAPI_Maps també són aptes per a vídeos
		EsCapaDinsRangDEscalesVisibles(capa) && EsCapaDinsAmbitActual(capa) && EsCapaDisponibleEnElCRSActual(capa) &&
		capa.animable==true && capa.data)
		return true;
	return false;
}

function DonaNPecesBarraVideo()
{
	return Math.round((ParamInternCtrl.vista.ncol-2)/8);
}

function DonaIPecaBarraVideo(i_data_video, n)
{
	if (document.video_animacions.TipusTemps[0].checked)
		return parseInt(((DatesVideo[i_data_video].millisegons-DatesVideo[0].millisegons)/(DatesVideo[DatesVideo.length-1].millisegons-DatesVideo[0].millisegons))*(n-1));
	return Math.round((n-1)*(i_data_video/(DatesVideo.length-1)));
}

function DonaIDataVideoDesDePecaBarraVideo(i, n)
{
var t;
	if (document.video_animacions.TipusTemps[0].checked)
	{
		t=((DatesVideo[DatesVideo.length-1].millisegons-DatesVideo[0].millisegons)/(n-1))*i+DatesVideo[0].millisegons;
		for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
			if (DatesVideo[i_data_video].millisegons>t)
				return i_data_video-1;
		return DatesVideo.length-1;
	}
	return Math.round((DatesVideo.length-1)*(i/(n-1)));
}

function ParticipaFotogramaDeLaSerieTemporal(i_data_video)
{
var capa=ParamCtrl.capa[DatesVideo[i_data_video].i_capa];
	if (DatesVideo[i_data_video].animable=="si" && capa.estil &&
		capa.estil[DatesVideo[i_data_video].i_estil].component &&
		capa.estil[DatesVideo[i_data_video].i_estil].component.length>0)
		return true;
	return false;
}

function DeterminaNombreComponentsSerieTemporal()
{
var n_c=0;
	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (ParticipaFotogramaDeLaSerieTemporal(i_data_video))
		{
			if (n_c<ParamCtrl.capa[DatesVideo[i_data_video].i_capa].estil[DatesVideo[i_data_video].i_estil].component.length)
				n_c=ParamCtrl.capa[DatesVideo[i_data_video].i_capa].estil[DatesVideo[i_data_video].i_estil].component.length;
		}
	}
	return n_c;
}


function DonaDadesValorsSerieTemporalLocalitzacio(i_col,i_fil, filtra_null)
{
var data=[], v, i_c;

	var n_c=DeterminaNombreComponentsSerieTemporal();
	if (n_c==0)
		return null;
	for (i_c=0; i_c<n_c; i_c++)
		data[i_c]=[];

	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (ParticipaFotogramaDeLaSerieTemporal(i_data_video))
		{
			v=DonaValorEstilComArrayDesDeValorsCapa(NovaVistaVideo, DatesVideo[i_data_video].i_capa, DatesVideo[i_data_video].i_estil, DonaValorsDeDadesBinariesCapa(NovaVistaVideo, ParamCtrl.capa[DatesVideo[i_data_video].i_capa], DatesVideo[i_data_video].i_data, i_col, i_fil));
			if (v==null)
			{
				if (!filtra_null)
					for (i_c=0; i_c<n_c; i_c++)
						data[i_c].push({t:DatesVideo[i_data_video].millisegons, y:""});
				continue;
			}
			for (i_c=0; i_c<v.length; i_c++)
				data[i_c].push({t:DatesVideo[i_data_video].millisegons, y:v[i_c]});
		}
	}
	return data;
}

function DonaDadesEstadistiquesFotogramaDeSerieTemporal()
{
var estadistics, estil;
var data=[], i_v, i_c;
	var n_c=DeterminaNombreComponentsSerieTemporal();
	if (n_c==0)
		return null;
	for (i_c=0; i_c<n_c; i_c++)
		data[i_c]=[[],[],[]];

	for (var i_data_video=0, i_v=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (!ParticipaFotogramaDeLaSerieTemporal(i_data_video))
			continue;

		estil=ParamCtrl.capa[DatesVideo[i_data_video].i_capa].estil[DatesVideo[i_data_video].i_estil];

		if (estil.component)
		{
			for (i_c=0; i_c<estil.component.length; i_c++)
			{
				estadistics=CalculaEstadisticsHistograma(estil.capa_video[DatesVideo[i_data_video].i_data].histograma.component[i_c].classe,
						DonaFactorValorMinEstiramentPaleta(estil.component[i_c].estiramentPaleta),
						DonaFactorValorMaxEstiramentPaleta(estil.component[i_c].estiramentPaleta,
								estil.capa_video[DatesVideo[i_data_video].i_data].histograma.component[i_c].classe.length  //El nombre de colors, o és el nombre de colors de la paleta, o és 256 per totes les bandes
									));
				data[i_c][0][i_v]={t:DatesVideo[i_data_video].millisegons, y:estadistics.mitjana+estadistics.desv_tipica};
				data[i_c][1][i_v]={t:DatesVideo[i_data_video].millisegons, y:estadistics.mitjana};
				data[i_c][2][i_v]={t:DatesVideo[i_data_video].millisegons, y:estadistics.mitjana-estadistics.desv_tipica};
			}
			i_v++;
		}
	}
	return data;
}


//Aquesta funció dona les etiquetes de temps en mode "moment" tal com ho vol la llibreria chart.js.
function DonaEtiquetesValorsSerieTemporalLocalitzacio()
{
var labels=[];
	for (var i_data_video=0, i_v=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (ParticipaFotogramaDeLaSerieTemporal(i_data_video))
		{
			labels[i_v]=moment(DatesVideo[i_data_video].millisegons);
			i_v++;
		}
	}
	return labels;
}

//Aquesta funció dona les etiquetes de temps en mode text.
function DonaTempsValorsSerieTemporalLocalitzacio()
{
var temps=[];

	for (var i_data_video=0, i_v=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (ParticipaFotogramaDeLaSerieTemporal(i_data_video))
		{
			temps[i_v]=DonaDataCapaComATextBreu(DatesVideo[i_data_video].i_capa, DatesVideo[i_data_video].i_data);
			i_v++;
		}
	}
	return temps;
}

function DonaTitolEixYSerieTemporalLocalitzacio()
{
var titol=[], estil;
	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (!ParticipaFotogramaDeLaSerieTemporal(i_data_video))
			continue;

		estil=ParamCtrl.capa[DatesVideo[i_data_video].i_capa].estil[DatesVideo[i_data_video].i_estil];
		if (estil.component)
		{
			for (var i_c=0; i_c<estil.component.length; i_c++)
				titol[i_c]=(estil.component[i_c].desc) ? DonaCadena(estil.component[i_c].desc) : DonaCadena(estil.desc);
			return titol;  //agafem el primer títol sense més.
		}
	}
}

/*function CanviaTipusClickVideo(event)
{
	if (document.video_animacions.TipusClick[0].checked && PuntsSerieTemporal.length==0)
	{
		document.getElementById("video_click").style.visibility="hidden";
		//if (typeof document.video_animacions.veure!=="undefined" && document.video_animacions.veure!=null)
		//{
			document.video_animacions.veure.selectedIndex=0;
			PosaEstadisticSerieOAnimacio(null, estadistic, -1);
		}
	}
	else
	{
		TancaFinestraSerieTemp("video_grafic", "video_click");
		document.getElementById("video_click").style.visibility="visible";
		IFilEixXEixTVideo=-1;
		return;
	}
	if (event)
		dontPropagateEvent(event);
}*/

function ClickSobreVideo(event_de_click)
{
	if (IFilEixXEixTVideo==-1)
		ConsultaSobreVideo(event_de_click);
	else if (IFilEixXEixTVideo==-2)
	{
		if (!EstanTotsElsFotogramesCarregatsVideo())
			return;
		if (typeof document.video_animacions.veure!=="undefined" && document.video_animacions.veure!=null)
			document.video_animacions.veure.selectedIndex=1;
		PosaEstadisticSerieOAnimacio(null, "x/t", DonaCoordJDeCoordSobreVista(document.getElementById("video_central"), NovaVistaVideo, event_de_click.clientY))
		document.getElementById("video_click").style.visibility="hidden";
	}
}

var ChartConsultaSobreVideo=null;

function ConsultaSobreVideo(event_de_click)
{

	if (!EstanTotsElsFotogramesCarregatsVideo())
		return;

	var i=DonaCoordIDeCoordSobreVista(document.getElementById("video_central"), NovaVistaVideo, event_de_click.clientX)
	var j=DonaCoordJDeCoordSobreVista(document.getElementById("video_central"), NovaVistaVideo, event_de_click.clientY)

	var x=DonaCoordXDeCoordSobreVista(document.getElementById("video_central"), NovaVistaVideo, event_de_click.clientX);
	var y=DonaCoordYDeCoordSobreVista(document.getElementById("video_central"), NovaVistaVideo, event_de_click.clientY);

	var data=DonaDadesValorsSerieTemporalLocalitzacio(i, j, true);
	if (data==null)
		return;

	if (PuntsSerieTemporal.length==0)
	{
		//Ara cal presentar la gràfica.
		ChartConsultaSobreVideo=ObreGraficSerieTemporal("video_grafic", "video_click", "video_grafic",
						DonaDadesEstadistiquesFotogramaDeSerieTemporal(),
						DonaEtiquetesValorsSerieTemporalLocalitzacio(),
						DonaTempsValorsSerieTemporalLocalitzacio(),
						DonaTitolEixYSerieTemporalLocalitzacio(),
						ParamCtrl.capa[DatesVideo[IDataVideoMostrada].i_capa].FlagsData);
	}
	var color_name=AfegeixGraficSerieTemporal(ChartConsultaSobreVideo, data, /*DonaValorDeCoordActual(x, y, false, false)*/ PuntsSerieTemporal.length+1);
	PuntsSerieTemporal.push({i:i, j:j, x:x, y:y, color:color_name});
	PintaPosicionsConsutaSobreVideo();
}

function MouSobreVideo(event_de_click)
{
var ctx, canvas, shadowPrevi;

	if (IFilEixXEixTVideo==-1)
		return;

	var j=DonaCoordJDeCoordSobreVista(document.getElementById("video_central"), NovaVistaVideo, event_de_click.clientY)

	if (IFilEixXEixTVideo>=0)
	{
		MostraFotograma(IDataFilEixXEixT[j], false, true);
		return;
	}

	canvas = document.getElementById("video_click_canvas");
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	shadowPrevi=ActivaSombraFonts(ctx)

	ctx.beginPath();
	ctx.strokeStyle="#888888";
	ctx.lineWidth=2;
	ctx.moveTo(0, j);
	ctx.lineTo(canvas.width, j);
	ctx.stroke();

	DesactivaSombraFonts(ctx, shadowPrevi)
}

function PintaPosicionsConsutaSobreVideo()
{
var ctx, canvas, shadowPrevi;

	canvas = document.getElementById("video_click_canvas");
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (!IconaVideoClick.img || !IconaVideoClick.img.sha_carregat)
		return;

	for (var i_punt=0; i_punt<PuntsSerieTemporal.length; i_punt++)
	{
		try
		{
			ctx.drawImage(IconaVideoClick.img, PuntsSerieTemporal[i_punt].i-IconaVideoClick.i+1,
						PuntsSerieTemporal[i_punt].j-IconaVideoClick.j+1, IconaVideoClick.img.ncol, IconaVideoClick.img.nfil);

			shadowPrevi=ActivaSombraFonts(ctx)

			ctx.beginPath();
			ctx.strokeStyle=PuntsSerieTemporal[i_punt].color;;
			ctx.lineWidth=3;
			var i_ini=PuntsSerieTemporal[i_punt].i+5;
			var j_ini=PuntsSerieTemporal[i_punt].j-5;
			ctx.moveTo(i_ini, j_ini);
			ctx.lineTo(i_ini+15, j_ini);
			ctx.stroke();

			ctx.font="bold 15px Verdana";
			ctx.fillStyle="#000000";
			ctx.textAlign="left";
			ctx.fillText(i_punt+1, PuntsSerieTemporal[i_punt].i+22, PuntsSerieTemporal[i_punt].j);

			DesactivaSombraFonts(ctx, shadowPrevi)

		}
		catch (e)
		{
			alert(e.message);
		}
	}
}

function OmpleFinestraVideo(win, name)
{
var cdns=[], capa, i_capa_primer_video;

	//Canviar la mida de la finestra.
	moveFinestraLayer(win, name, -1, -1, ParamInternCtrl.vista.ncol+142, ParamInternCtrl.vista.nfil+140);

	//Determinar el primer video actiu.
	for (i_capa_primer_video=0; i_capa_primer_video<ParamCtrl.capa.length; i_capa_primer_video++)
	{
		if (EsCapaAptePerVideo(ParamCtrl.capa[i_capa_primer_video]))
			break;
	}
	if (i_capa_primer_video==ParamCtrl.capa.length)
	{
		alert(GetMessage("NoLayerAvailableForAnimation", "video"));
		return;
	}

	//Començo pel selector de capes.
	cdns.push("<form name=\"video_animacions\" METHOD=\"GET\" onSubmit=\"return CanviaAnimacio(document.video_animacions.capa.value);\">",
		" <table border=\"0\" width=\"98%\" cellspacing=\"0\" cellpadding=\"0\"><tr><td align=left>"+DonaCadena(ParamCtrl.TitolCaixa)+"</td>",
			  "<td align=right><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=2>",
			  GetMessage("TimeSeries", "video"),
			  ": <select name=\"capa\" onChange=\"CanviaAnimacio(document.video_animacions.capa.value);\">");

	var i_capa_video_actiu_actual=-1;
	for (var i_capa_video_actiu=i_capa_primer_video; i_capa_video_actiu<ParamCtrl.capa.length; i_capa_video_actiu++)
	{
		capa=ParamCtrl.capa[i_capa_video_actiu];
		if (EsCapaAptePerVideo(capa))
		{
			cdns.push("<option value=\"",capa.NomVideo,"\"",((i_capa_video_actiu_actual==-1) ? " selected" : ""),">" ,
					DonaCadena(capa.DescVideo),"</option>");
			if (i_capa_video_actiu_actual==-1)
				i_capa_video_actiu_actual=i_capa_video_actiu;
			//Salto la resta.
			for (var i_capa_video_actiu2=i_capa_video_actiu+1; true; i_capa_video_actiu2++)
			{
				if (i_capa_video_actiu2==ParamCtrl.capa.length ||
					(EsCapaAptePerVideo(ParamCtrl.capa[i_capa_video_actiu2]) && ParamCtrl.capa[i_capa_video_actiu2].NomVideo!=capa.NomVideo))
				{
					i_capa_video_actiu=i_capa_video_actiu2-1;
					break;
				}
			}
		}
	}
	cdns.push("</select>",
		"<span id=\"video_estil\"></span></font></td></tr></table>");

	//Creo la pantalla on es projecte el video.
	cdns.push("<div id=\"video_central\" style=\"position: relative; margin-left: auto; margin-right: auto; width:", ParamInternCtrl.vista.ncol, "; height:", ParamInternCtrl.vista.nfil, ";\">",
		"<div id=\"video_pantalla\" style=\"position: absolute; bottom: 0; width:", ParamInternCtrl.vista.ncol, "; height:", ParamInternCtrl.vista.nfil, ";\"><img src=\"",AfegeixAdrecaBaseSRC("1gris.gif"),"\" NAME=\"pantalla\" width=\"", ParamInternCtrl.vista.ncol, "\" height=\"", ParamInternCtrl.vista.nfil, "\"></div>",
		"<div id=\"video_click\" style=\"position: absolute; bottom: 0; width:", ParamInternCtrl.vista.ncol, "; height:", ParamInternCtrl.vista.nfil, ";\"><canvas id=\"video_click_canvas\" width=\"", ParamInternCtrl.vista.ncol, "\" height=\"", ParamInternCtrl.vista.nfil, "\"></canvas></div>",
		"<div id=\"video_info\" class=\"text_allus\" style=\"position: absolute; top: 0; margin-left: auto; margin-right: auto; width:", ParamInternCtrl.vista.ncol, "; height:", ParamInternCtrl.vista.nfil, ";\" onClick=\"ClickSobreVideo(event);\" onMouseMove=\"MouSobreVideo(event);\"></div>",
		"<div id=\"video_botons\" class=\"finestra_superposada text_allus\" style=\"position: absolute; bottom: 0; margin-left: auto; margin-right: auto;\" onClick=\"ClickSobreVideo(event);\" onMouseMove=\"MouSobreVideo(event);\">");

	// Desplegable d' animació o d'estadistic.
	cdns.push("<center><span id=\"video_veure\"></span>");

	//Dibuixar els botons de progrés del video.
	cdns.push("<span id=\"video_botons_estadistics\" style=\"visibility: hidden\"><button onClick=\"return VideoCopiaEstadistic(event);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("boto_copiar.gif"),"\" alt=\"",GetMessage("copy"),"\" title=\"",GetMessage("copy"),"\"></button></span>");
	cdns.push("<span id=\"video_botons_animacio\"><button onClick=\"return VideoMostraEvent(event, -2);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("b_start.gif"),"\" alt=\"",GetMessage("toTheStart"),"\" title=\"",GetMessage("toTheStart"),"\"></button>",
		"<button onClick=\"return VideoMostraEvent(event, -1);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("b_rewind.gif"),"\" alt=\"",GetMessage("stepBack"),"\" title=\"",GetMessage("stepBack"),"\"></button>",
		"<button onClick=\"return VideoMostraEvent(event, 0);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("b_pause.gif"),"\" alt=\"",GetMessage("pause"),"\" title=\"",GetMessage("pause"),"\"></button>",
		"<button onClick=\"return VideoPlayEvent(event, 9);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("b_play.gif"),"\" alt=\"",GetMessage("play"),"\" title=\"",GetMessage("play"),"\"></button>",
		"<button onClick=\"return VideoPlayEvent(event, 8);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("b_repeat.gif"),"\" alt=\"",GetMessage("repeatedlyPlay", "video"),"\" title=\"",GetMessage("repeatedlyPlay", "video"),"\"></button>",
		"<button onClick=\"return VideoMostraEvent(event, 1);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("b_forward.gif"),"\" alt=\"",GetMessage("stepForward"),"\" title=\"",GetMessage("stepForward"),"\"></button>",
		"<button onClick=\"return VideoMostraEvent(event, 2);\"><img align=middle src=\"",AfegeixAdrecaBaseSRC("b_end.gif"),"\" alt=\"",GetMessage("toTheEnd"),"\" title=\"",GetMessage("toTheEnd"),"\"></button>",
		"<br />",
		"<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=1>",
		GetMessage("SpeedyBy"),
		": <input type=\"radio\" name=\"TipusTemps\">",
		GetMessage("TemporalScale", "video"),
		" 1:<input type=\"text\" name=\"EscalaTemporal\" value=\"1000000\" size=8 onChange=\"document.video_animacions.TipusTemps[0].checked=true\">",
		"<input type=\"radio\" name=\"TipusTemps\" checked>",
		GetMessage("Interval", "video"),
		"<input name=\"interval\" type=\"text\" value=\"0.9\" size=\"3\" onChange=\"document.video_animacions.TipusTemps[1].checked=true\">s</span>",
		//"&nbsp;&nbsp;&nbsp;&nbsp;",
		//DonaCadenaLang({"cat":"Al fer clic", "spa":"Al hacer clic", "eng":"On click", "fre":"Sur clic"}),
		//" <input type=\"radio\" name=\"TipusClick\" onClick=\"CanviaTipusClickVideo(event)\" checked>",
		//DonaCadenaLang({"cat":"punt/t", "spa":"punto/t", "eng":"point/t", "fre":"point/t"}),
		//" <input type=\"radio\" name=\"TipusClick\" onClick=\"CanviaTipusClickVideo(event)\">x/t",
		//"<a href='javascript:TancaFinestraLayer(\"video\");'>",
		//DonaCadenaLang({"cat":"Tancar", "spa":"Cerrar", "eng":"Close", "fre":"Quitter"}),
		//"</a>",
		"</font>",
		"</center>");

	//Dibuixar la data i la barra de progrés del video.
	cdns.push("<span id=\"video_time_text\"><center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=2>",
			  GetMessage("Date"),": <span id=\"video_data\"></span></center><span>",
			"<span id=\"video_time_slider\"><center><img src=\"", AfegeixAdrecaBaseSRC("evol_mrg.png"), "\" border=\"0\">");
	var n=DonaNPecesBarraVideo();
	for (var i=0; i<n; i++)
		cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("evol_bl.png"), "\" border=\"0\" name=\"video_evol",i,"\" onMouseOver=\"CanviaFotogramaSiPuntABarra(event,",i,");\">");
	cdns.push("<img src=\"", AfegeixAdrecaBaseSRC("evol_mrg.png"), "\" border=\"0\"></center></span>");

	if (ParamCtrl.IconaConsulta && !IconaVideoClick.img || !IconaVideoClick.img.sha_carregat || IconaVideoClick.img.hi_ha_hagut_error)
	{
		IconaVideoClick=JSON.parse(JSON.stringify(ParamCtrl.IconaConsulta));
		CarregaImatgeIcona(IconaVideoClick);
	}

	cdns.push("</div>",
		"</div>");

	//if (RodetVertical==false)
	cdns.push("<div id=\"video_rodet\" style=\"overflow:auto;\"></div>",
		"<div id=\"video_grafic\" style=\"position: absolute; visibility: hidden; top: 25px; width:"+ 460 +"; height:"+ ParamInternCtrl.vista.nfil +";\"></div>",
		"</form>",
		DonaTextDivCopiaPortapapersFinestra("VideoDiv"));

	contentFinestraLayer(win, name, cdns.join(""));

		//Si hi ha un video actiu, activar la seva preparació.
	CanviaAnimacio(document.video_animacions.capa.value);
}

function CanviaEstatAnimable(boto, i_data_video)
{
	if (boto.checked)
	{
		if (!DatesVideo[i_data_video].carregada)
		{
			if (DatesVideo[i_data_video].timeOutFotograma)
				clearTimeout(DatesVideo[i_data_video].timeOutFotograma);
			var vista=JSON.parse(JSON.stringify(ParamInternCtrl.vista));
			vista.i_nova_vista=NovaVistaVideo;
			DatesVideo[i_data_video].timeoutFotograma=setTimeout("CanviaImatgeCapaVideo("+i_data_video+", "+JSON.stringify(vista)+", "+DatesVideo[i_data_video].i_capa+", "+DatesVideo[i_data_video].i_estil+", "+DatesVideo[i_data_video].i_data+")", 50);
		}
		DatesVideo[i_data_video].animable="si";
	}
	else
		DatesVideo[i_data_video].animable="ara_no";
}

//Transforma un nom d'estil en un i_estil de la capa i_capa_video_actiu. Retorna null si no el troba
function DonaIEstilFotograma(i_capa_video_actiu, estil)
{
var capa=ParamCtrl.capa[i_capa_video_actiu];

	if (capa.estil && capa.estil.length>1 && estil)
	{
        for (var i_estil=0; i_estil<capa.estil.length; i_estil++)
		{
	     	if (estil==((capa.estil[i_estil].nom) ? capa.estil[i_estil].nom : capa.estil[i_estil].desc))
				return i_estil;
		}
		return null;
	}
	return 0;
}

function CanviaImatgeCapaRodet(i_data_video, vista, i_capa, i_estil, i_data)
{
	var image=document.getElementById("rodet_i_raster"+i_data_video);
	CanviaImatgeCapa(image, vista, i_capa, i_estil, i_data, ActivaFotogramaRodet, i_data_video);
}

function CanviaImatgeCapaVideo(i_data_video, vista, i_capa, i_estil, i_data)
{
	var image=document.getElementById("video_i_raster"+i_data_video);
	CanviaImatgeCapa(image, vista, i_capa, i_estil, i_data, ActivaFotogramaVideo, i_data_video);
}

function CanviaValorDataVideoInicialFinal(event, millisegons, final)
{
	dontPropagateEvent(event);
	if (DatesVideo[final ? IDataVideoFinal : IDataVideoInicial].millisegons==millisegons)
		return;
	var i=DatesVideo.binarySearch({millisegons: millisegons}, OrdenacioCapesVideoData);

	if (final)
	{
		IDataVideoFinal=(i<0) ? -i-2 : i;
		if (IDataVideoFinal<IDataVideoInicial)
			IDataVideoFinal=IDataVideoInicial;
	}
	else
	{
		IDataVideoInicial=(i<0) ? -i-2 : i;
		if (IDataVideoInicial>IDataVideoFinal)
			IDataVideoInicial=IDataVideoFinal;
	}
	//corregeixo el valor.
	//millisegons=DatesVideo[IDataVideoInicial].millisegons;
	document.getElementById("SliderDataVideoInicialFinal").innerHTML=DonaCadenaHTMLSliderDataVideoInicialFinal();
	document.getElementById("NumeroFotogramesVideo").innerHTML=DonaNumeroFotogramesVideo();
}

function DonaCadenaHTMLSliderDataVideoInicialFinal()
{
var cdns=[];
	cdns.push(GetMessage("StartDate"), ": ",
		DonaDataMillisegonsComATextBreu(ParamCtrl.capa[DatesVideo[IDataVideoInicial].i_capa].FlagsData, DatesVideo[IDataVideoInicial].millisegons), " ",
		"<input type='button' value='<' onClick='CanviaValorDataVideoInicialFinal(event, ", DatesVideo[(IDataVideoInicial ? IDataVideoInicial-1 : 0)].millisegons, ", false);'", (IDataVideoInicial==0 ? " disabled='disabled'" : ""), ">",
		"<input type='range' style='width: 300px;' step='1' min='", DatesVideo[0].millisegons, "' max='", DatesVideo[DatesVideo.length-1].millisegons, "' value='", DatesVideo[IDataVideoInicial].millisegons, "' onchange='CanviaValorDataVideoInicialFinal(event, this.value, false);' onclick='dontPropagateEvent(event);' list='DataVideoInicialTicks'>",
		"<input type='button' value='>' onClick='CanviaValorDataVideoInicialFinal(event, ", DatesVideo[(IDataVideoInicial==DatesVideo.length-1 ? DatesVideo.length-1 : IDataVideoInicial+1)].millisegons, ", false);'", (IDataVideoInicial==IDataVideoFinal ? " disabled='disabled'" : ""), ">");
	if (DatesVideo.length<300/2)
	{
		cdns.push("<datalist id='DataVideoInicialTicks'>");
		for (var i=0; i<DatesVideo.length; i++)
			cdns.push("<option value='", DatesVideo[i].millisegons, "'></option>");
		cdns.push("</datalist>");
	}
	/*Atenció que aquest slider està dibuixat al revés ("direction: rtl"; de dreta a esquerra) i tots els calculs s'han d'invertir.
	Això és important perquè Chrome i Edge posen un color a la dreta de l'slider (que, en aquest cas, ha de quedar a l'esquerra)*/
	cdns.push("<br>",
		GetMessage("EndDate"), ": ",
		DonaDataMillisegonsComATextBreu(ParamCtrl.capa[DatesVideo[IDataVideoFinal].i_capa].FlagsData, DatesVideo[IDataVideoFinal].millisegons), " ",
		"<input type='button' value='<' onClick='CanviaValorDataVideoInicialFinal(event, ", DatesVideo[(IDataVideoFinal ? IDataVideoFinal-1 : 0)].millisegons, ", true);'", (IDataVideoInicial==IDataVideoFinal ? " disabled='disabled'" : ""), ">",
		"<input type='range' style='width: 300px;direction: rtl;' step='1' min='", 0, "' max='", DatesVideo[DatesVideo.length-1].millisegons-DatesVideo[0].millisegons, "' value='", DatesVideo[DatesVideo.length-1].millisegons-DatesVideo[IDataVideoFinal].millisegons, "' onchange='CanviaValorDataVideoInicialFinal(event, ", DatesVideo[DatesVideo.length-1].millisegons, " - this.value, true);' onclick='dontPropagateEvent(event);' list='DataVideoFinalTicks'>",
		"<input type='button' value='>' onClick='CanviaValorDataVideoInicialFinal(event, ", DatesVideo[(IDataVideoFinal==DatesVideo.length-1 ? DatesVideo.length-1 : IDataVideoFinal+1)].millisegons, ", true);'", (IDataVideoFinal==DatesVideo.length-1 ? " disabled='disabled'" : ""), ">");
	if (DatesVideo.length<300/2)
	{
		cdns.push("<datalist id='DataVideoFinalTicks'>");
		for (var i=0; i<DatesVideo.length; i++)
			cdns.push("<option value='", DatesVideo[DatesVideo.length-1].millisegons-DatesVideo[i].millisegons, "'></option>");
		cdns.push("</datalist>");
	}
	return cdns.join("");
}

function DonaNumeroFotogramesVideo()
{
	return IDataVideoFinal-IDataVideoInicial+1;
}

function CanviaVideo(nom_video, estil)
{
var img;
var cdns=[], capa, estil;

	//Faig un reset general de variables.
	DescarregaVideo();

	var n=DonaNPecesBarraVideo();
	for (var i=0; i<n; i++)
	{
		img=document["video_evol"+i];
		img.src=AfegeixAdrecaBaseSRC("evol_bl.png");
	}

	CarregaDatesVideo(nom_video, estil);

	cdns=[];

	//Llista per veure animació o veure estadistics
	if (estil!=null)
	{
		for (var i_capa_video_actiu=0;i_capa_video_actiu<ParamCtrl.capa.length; i_capa_video_actiu++)
		{
			capa=ParamCtrl.capa[i_capa_video_actiu];
			if (EsCapaAptePerVideo(capa) && nom_video==capa.NomVideo && capa.estil)
			{
				//Em quedo amb el primer i no em complico: Si n'hi ha més d'un haurien de ser iguals.
				//De fet, cal limitar-ho a animacions d'una sola capa de moment.

				estil=capa.estil[DonaIEstilFotograma(i_capa_video_actiu, estil)];
				if (EsCapaBinaria(capa) && estil && estil.component && estil.component.length==1)  //Per extreure stadistics cal que la capa tingui una sola component. Si no tot és massa complicat.
				{
					cdns.push(GetMessage("View"),
						": <select name=\"veure\" onClick=\"dontPropagateEvent(event);\" onChange=\"PosaEstadisticSerieOAnimacio(event, document.video_animacions.veure.value, -1);\">");
					cdns.push("<option value=\"animacio\" selected >", GetMessage("Animations", "video"), "</option>");
					cdns.push("<option value=\"x/t\">", GetMessage("Graph", "video"), " x/t</option>");
					if (DonaTractamentComponent(estil, 0)=="categoric")
					{
						cdns.push("<option value=\"Moda\">", GetMessage("Mode"), "</option>");
						for (var i=0; i<estil.categories.length; i++)
						{
							if (!estil.categories[i])
								continue;
							cdns.push("<option value=\"NDeValor_"+i+"\">", GetMessage("NumPhotosValue", "video"), " ", DonaTextCategoriaDesDeColor(estil.categories, estil.atributs, i, true), "</option>");
						}
					}
					else
					{
						//Fer estadistics clàsics: mitjana, desviació etc.
						//Considerar determinar transformades de fourier o wavelet.
						cdns.push("<option value=\"Mitjana\">", GetMessage("Mean"), "</option>");
						cdns.push("<option value=\"StanDev\">", GetMessage("StandardDeviation"), "</option>");
						cdns.push("<option value=\"Moda\">", GetMessage("Mode"), "</option>");
						cdns.push("<option value=\"Pheno_idxsos\">", GetMessage("StartSeasonDay", "video"), " (SoS)</option>");
						cdns.push("<option value=\"Pheno_idxpos\">", GetMessage("PeakSeasonDay", "video"), " (PoS)</option>");
						cdns.push("<option value=\"Pheno_idxeos\">", GetMessage("EndSeasonDay", "video"), " (EoS)</option>");
						cdns.push("<option value=\"Pheno_idxlos\">", GetMessage("LengthSeasonDays", "video"), " (LoS)</option>");
						cdns.push("<option value=\"Pheno_sos\">", GetMessage("StartSeasonValue", "video"), " (SoS)</option>");
						cdns.push("<option value=\"Pheno_pos\">", GetMessage("PeakSeasonValue", "video"), " (PoS)</option>");
						cdns.push("<option value=\"Pheno_eos\">", GetMessage("EndSeasonValue", "video"), " (EoS)</option>");
						cdns.push("<option value=\"Pheno_base\">", GetMessage("SeasonBaseValue", "video"), "</option>");
						cdns.push("<option value=\"Pheno_aos\">", GetMessage("AmplitudeSeason", "video"), " (AoS)</option>");
						cdns.push("<option value=\"Pheno_rog\">", GetMessage("RateGreening", "video"), " (RoG)</option>");
						cdns.push("<option value=\"Pheno_ros\">", GetMessage("RateSenescing", "video"), " (RoS)</option>");
					}
					cdns.push("</select>");
				}
				break;
			}
		}
	}
	document.getElementById("video_veure").innerHTML=cdns.join("");

	cdns=[];
	cdns.push("<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"3\">",
		"<div id='SliderDataVideoInicialFinal'>",
		DonaCadenaHTMLSliderDataVideoInicialFinal(),
		"</div>",
		//DonaCadenaLang({"cat":"Prem", "spa":"Presione", "eng":"Press", "fre":"Presse"}), ": "
		"<input type=\"button\" class=\"Verdana11px\" value=\"--",
		GetMessage("Load"),
	        "--\" onClick='CarregaVideoRodetEvent(event, \"", nom_video+"\", \"", estil, "\");'>",
		" (<span id='NumeroFotogramesVideo'>" , DonaNumeroFotogramesVideo() , "</span> " , GetMessage("frames", "video"), ")",
		"</font></center>")
	document.getElementById("video_info").innerHTML=cdns.join("");
}

function CarregaVideoRodetEvent(event, nom_video, estil)
{
	if (IDataVideoFinal<DatesVideo.length-1)
		DatesVideo.splice(IDataVideoFinal+1, DatesVideo.length-1-IDataVideoFinal);
	if (IDataVideoInicial)
		DatesVideo.splice(0, IDataVideoInicial);
	CarregaVideoRodet(nom_video, estil);
	dontPropagateEvent(event);
}

function CarregaDatesVideo(nom_video, estil)
{
var capa, i_estil;

	//Determino quins fotogrames he de fer servir.
	for (var i_capa=0; i_capa<ParamCtrl.capa.length; i_capa++)
	{
		capa=ParamCtrl.capa[i_capa];
		if (EsCapaAptePerVideo(capa) && capa.NomVideo==nom_video)
		{
			i_estil=DonaIEstilFotograma(i_capa, estil);
			if (i_estil==null)
				break;
			for (var i_data=0; i_data<capa.data.length; i_data++)
			{
				var d=DonaDateDesDeDataJSON(capa.data[i_data]);
				DatesVideo.push({"i_capa": i_capa,
						"i_data": i_data,
						"i_estil": i_estil,
						"millisegons": d.getTime(),
						"animable": ((capa.animable && capa.animable==true) ? "si" : "ara_no"),
						"carregada": false,
						"carregadaRodet": false});
			}
		}
	}
	DatesVideo.sort(OrdenacioCapesVideoData);
	IDataVideoInicial=0;
	IDataVideoFinal=DatesVideo.length-1;
}

function DonaNColVideoRodet()
{
	if (RodetVertical)
		return 85;
	return parseInt(DonaNFilVideoRodet()*ParamInternCtrl.vista.ncol/ParamInternCtrl.vista.nfil);
}

function DonaNFilVideoRodet()
{
	if (RodetVertical)
		return parseInt(DonaNColVideoRodet()*ParamInternCtrl.vista.nfil/ParamInternCtrl.vista.ncol);
	return 50;
}

function DonaCadenaHTMLTitolFotogramaRodet(i_data_video)
{
var cdns=[];
	cdns.push("<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=1><input ",
				((DatesVideo[i_data_video].animable=="si") ? "checked" : ""), " id=\"video_rodet_foto_ch",i_data_video,"\"",
				" type=\"checkbox\" onClick=\"CanviaEstatAnimable(this, ", i_data_video ,");\"><span id=\"video_rodet_foto_tx",i_data_video,"\" style=\"font-size:x-small;\">",
				DonaDataCapaComATextBreu(DatesVideo[i_data_video].i_capa, DatesVideo[i_data_video].i_data),"</span>");
	return cdns.join("");
}

function CarregaVideoRodet(nom_video, estil)
{
var i_data_video, capa, cdns=[];
var vista=JSON.parse(JSON.stringify(ParamInternCtrl.vista));

	document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"4\">"+ GetMessage("LoadingFilm", "video") + ". " + GetMessage("PleaseWait") +"...</font></center>";

	//Dibuixo el rodet de fotogrames buit
	vista.i_nova_vista=NovaVistaRodet;

	cdns.push("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\'background-image: url(\"",AfegeixAdrecaBaseSRC("1film_v.png"),"\");background-repeat: repeat-x;\'>");
	vista.ncol=DonaNColVideoRodet();
	vista.nfil=DonaNFilVideoRodet();
	if (RodetVertical)
	{
		//Estil antic del rodet vertical a la esquerra.
		for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
		{
			cdns.push("<tr><td rowspan=\"4\" width=\"13\">&nbsp;</td>",
				"<td colspan=3>",
				DonaCadenaHTMLTitolFotogramaRodet(i_data_video),
				"</td></tr>",
				"<tr><td colspan=3><img name=\"video_marc_sup",i_data_video,"\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"",vista.ncol+4,"\" height=\"2\"></td></tr>",
				"<tr><td><img name=\"video_marc_esq",i_data_video,"\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"2\" height=\"",vista.nfil,"\"></td>",
				"<td><div id=\"rodet_l_raster",i_data_video,"\" style=\"overflow:auto; width:", vista.ncol, "px; height:", vista.nfil, "px; background-color:white; \" onClick=\"MostraFotogramaAillat(", i_data_video,", false)\">",
				((EsCapaBinaria(ParamCtrl.capa[DatesVideo[i_data_video].i_capa])) ? "<canvas id=\"rodet_i_raster"+i_data_video+"\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>" : "<img id=\"rodet_i_raster"+i_data_video+"\" name=\"rodet_i_raster"+i_data_video+"\" src=\""+AfegeixAdrecaBaseSRC("1tran.gif")+"\">"),
				"</div></td>",
				"<td><img name=\"video_marc_dre",i_data_video,"\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"2\" height=\"", vista.nfil,"\"></td></tr>",
				"<tr><td colspan=3><img name=\"video_marc_inf",i_data_video, "\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"",vista.ncol+4,"\" height=\"2\"></td></tr>");
		}
	}
	else
	{
		//Estil nou amb rodet horizontal a la part inferior.
		cdns.push("<tr>");
		for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
		{
			cdns.push("<td colspan=3>",
				DonaCadenaHTMLTitolFotogramaRodet(i_data_video),
				"</td>",
				"<td rowspan=\"6\"><img src=1tran.gif width=\"8\"></td>");
		}
		cdns.push("</tr><tr>");
		for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
			cdns.push("<td colspan=3><img src=1tran.gif height=\"13\"></td>");
		cdns.push("</tr><tr>");
		for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
			cdns.push("<td colspan=3><img name=\"video_marc_sup",i_data_video,"\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"",vista.ncol+4,"\" height=\"2\"></td>");
		cdns.push("</tr><tr>");
		for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
		{
			cdns.push("<td><img name=\"video_marc_esq",i_data_video,"\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"2\" height=\"",vista.nfil,"\"></td>",
				"<td><div id=\"rodet_l_raster",i_data_video,"\" style=\"overflow:auto; width:", vista.ncol, "px; height:", vista.nfil, "px; background-color:white;\" onClick=\"MostraFotogramaAillat(", i_data_video,", false)\">",
				((EsCapaBinaria(ParamCtrl.capa[DatesVideo[i_data_video].i_capa])) ? "<canvas id=\"rodet_i_raster"+i_data_video+"\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>" : "<img id=\"rodet_i_raster"+i_data_video+"\" name=\"rodet_i_raster"+i_data_video+"\" src=\""+AfegeixAdrecaBaseSRC("espereu_"+ParamCtrl.idioma+".gif")+"\">"),
				"</div></td>",
				"<td><img name=\"video_marc_dre",i_data_video,"\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"2\" height=\"",vista.nfil,"\"></td>");
		}
		cdns.push("</tr><tr>");
		for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
			cdns.push("<td colspan=3><img name=\"video_marc_inf",i_data_video,"\" src=\"",AfegeixAdrecaBaseSRC("1negre.gif"),"\" width=\"",vista.ncol+4,"\" height=\"2\"></td>");
		cdns.push("</tr><tr>");
		for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
			cdns.push("<td colspan=3><img src=1tran.gif height=\"16\"></td>");
		cdns.push("<tr>");
	}
	cdns.push("</table>");
	var rodet=document.getElementById("video_rodet");
	rodet.innerHTML=cdns.join("");
	if (RodetVertical)
		rodet.scrollTop=0;
	else
		rodet.scrollLeft=0;

	//Demano totes les imatges petites per omplir el rodet de fotogrames
	for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		DatesVideo[i_data_video].timeOutRodet=setTimeout("CanviaImatgeCapaRodet("+i_data_video+", "+JSON.stringify(vista)+", "+DatesVideo[i_data_video].i_capa+", "+DatesVideo[i_data_video].i_estil+", "+DatesVideo[i_data_video].i_data+")", 75*i_data_video+75);
	}

	//Dibuixo tots els fotogrames de l'animació buits i apagats
	cdns.length=0;
	vista.ncol=ParamInternCtrl.vista.ncol;
	vista.nfil=ParamInternCtrl.vista.nfil;

	for (i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		//http://www.greywyvern.com/?post=337
		cdns.push("<div id=\"video_l_raster",i_data_video,"\" style=\"position: absolute; width:", vista.ncol, "px; height:", vista.nfil, "px; opacity:0;\" >",
			((EsCapaBinaria(ParamCtrl.capa[DatesVideo[i_data_video].i_capa])) ? "<canvas id=\"video_i_raster"+i_data_video+"\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>" : "<img id=\"video_i_raster"+i_data_video+"\" name=\"video_i_raster"+i_data_video+"\" src=\""+AfegeixAdrecaBaseSRC("espereu_"+ParamCtrl.idioma+".gif")+"\">"),
			"</div>");
	}
	if (EsCapaBinaria(ParamCtrl.capa[DatesVideo[0].i_capa]))
		cdns.push("<div id=\"video_l_raster_stat\" style=\"position: absolute; width:", vista.ncol, "px; height:", vista.nfil, "px; opacity:0;\" >",
			"<canvas id=\"video_i_raster_stat\" width=\""+vista.ncol+"\" height=\""+vista.nfil+"\"></canvas>",
			"</div>");

	document.getElementById("video_pantalla").innerHTML=cdns.join("");

	NomVideoActiu=nom_video;
	if (timeoutVideoInfo)
	{
	    clearTimeout(timeoutVideoInfo);
	    timeoutVideoInfo=null;
	}
	timeoutVideoInfo=setTimeout("ActualitzaNCarregatRodet()", 600);
}

function DonaRatioNodataRodet(i_data_video)
{
var capa=ParamCtrl.capa[DatesVideo[i_data_video].i_capa];
	if (EsCapaBinaria(capa))
		return capa.estil[DatesVideo[i_data_video].i_estil].capa_rodet[DatesVideo[i_data_video].i_data].histograma.classe_nodata/(DonaNColVideoRodet()*DonaNFilVideoRodet());
	return 0.0;
}

var RatioNodataNoTolerat=0.99;

function CanviaRatioNodataNoTolera(event, valor)
{
	var ratio_nodata_no_tolerat=valor/100;
	if (ratio_nodata_no_tolerat>0.99)
		ratio_nodata_no_tolerat=0.99;
	var n_foto=0;
	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		//Determino si la imatge és enterament nodata.
		if (ratio_nodata_no_tolerat>DonaRatioNodataRodet(i_data_video))
			n_foto++;
	}
	document.getElementById("video_nodata_max_tx").innerHTML=valor + "% (" + n_foto + "/" + DatesVideo.length + " " + GetMessage("frames", "video") +")";
}

function FiltraNodataICarregaVideo()
{
var ratio_nodata, inserir_slider=false;

	document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"4\">"+ GetMessage("LoadingFrames", "video") + ". " + GetMessage("PleaseWait")+"...</font></center>";

	//Demano totes les imatges grans per omplir el video de fotogrames
	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		//Determino si la imatge és enterament nodata.
		ratio_nodata=DonaRatioNodataRodet(i_data_video);
		if (0.99<ratio_nodata)
		{
			DatesVideo[i_data_video].animable="no";
			document.getElementById("video_rodet_foto_ch"+i_data_video).disabled=true;
			document.getElementById("video_rodet_foto_ch"+i_data_video).checked=false;
			document.getElementById("video_rodet_foto_tx"+i_data_video).style.textDecoration="line-through";
		}
		if (ratio_nodata>0.01)
			inserir_slider=true;
	}
	if (inserir_slider)
	{
		//codi que insereix un slider
		var initial_value=(RatioNodataNoTolerat>=0.99 ? 99.9 : RatioNodataNoTolerat*100);
		document.getElementById("video_info").innerHTML="<font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"3\">"+
			GetMessage("AllowedPercentageVoidSpace", "video") +
			": <input id=\"video_nodata_max_rg\" type=\"range\" step=\"0.1\" min=\"0\" max=\"99.9\" value=\""+ initial_value +"\" onchange=\"CanviaRatioNodataNoTolera(event, this.value);\" oninput=\"CanviaRatioNodataNoTolera(event, this.value);\" style=\"width: 300px\">"+
			" <span id=\"video_nodata_max_tx\"></span>"+
			" <input type=\"button\" class=\"Verdana11px\" value=\"--"+
			GetMessage("Load")+
		        "--\" onClick='CarregaVideoEvent(event);'></font>";
		CanviaRatioNodataNoTolera(null, initial_value);
		return;
	}
	//Mostrar immediatament el vídeo
	CarregaVideo();
}

function CarregaVideoEvent(event)
{
	RatioNodataNoTolerat=document.getElementById("video_nodata_max_rg").value/100;
	if (RatioNodataNoTolerat>0.99)
		RatioNodataNoTolerat=0.99;

	CarregaVideo();
	dontPropagateEvent(event);
}


function CarregaVideo()
{
var vista=JSON.parse(JSON.stringify(ParamInternCtrl.vista));

	document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"4\">"+ GetMessage("LoadingFrames", "video") + ". " + GetMessage("PleaseWait")+"...</font></center>";

	vista.i_nova_vista=NovaVistaVideo; //Les imatges grans del video

	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (RatioNodataNoTolerat>DonaRatioNodataRodet(i_data_video))
			DatesVideo[i_data_video].timeoutFotograma=setTimeout("CanviaImatgeCapaVideo("+i_data_video+", "+JSON.stringify(vista)+", "+DatesVideo[i_data_video].i_capa+", "+DatesVideo[i_data_video].i_estil+", "+DatesVideo[i_data_video].i_data+")", 200*i_data_video+75);
		else
		{
			if (DatesVideo[i_data_video].animable!="no")
			{
				document.getElementById("video_rodet_foto_ch"+i_data_video).checked=false;
				DatesVideo[i_data_video].animable="ara_no";
			}
		}
	}
	if (timeoutVideoInfo)
	{
		clearTimeout(timeoutVideoInfo);
		timeoutVideoInfo=null;
	}
	timeoutVideoInfo=setTimeout("ActualitzaNCarregatVideo()", 1000);
}//Fi de CanviaVideo()

function CanviaAnimacio(nom_video)
{
//Generar desplegable d'estils.
var capa, estil, estils=[], cdns=[], i_estil, i_estil_sel=-1;

	//Determino la llista d'estils.
	for (var i_capa_video_actiu=0;i_capa_video_actiu<ParamCtrl.capa.length; i_capa_video_actiu++)
	{
		capa=ParamCtrl.capa[i_capa_video_actiu];
		if (EsCapaAptePerVideo(capa) && nom_video==capa.NomVideo)
		{
			if (capa.estil==null || capa.estil.length==0)
			{
				for (i_estil=0; i_estil<estils.length; i_estil++)
				{
					if (estils[i_estil].nom=="")
						break;
				}
				if (i_estil==estils.length)
				{
					estils[i_estil]={"nom":"", "desc": ""};
					if (i_estil_sel==-1)
						i_estil_sel=i_estil;
				}
			}
			else
			{
				for (var i_estil_video_actiu=0; i_estil_video_actiu<capa.estil.length; i_estil_video_actiu++)
				{
					for (i_estil=0; i_estil<estils.length; i_estil++)
					{
						if (!capa.estil[0].nom)
						{
							if (estils[i_estil].desc==capa.estil[i_estil_video_actiu].desc)
								break;
						}
						else
						{
							if (estils[i_estil].nom==capa.estil[i_estil_video_actiu].nom)
								break;
						}
					}
					if (i_estil==estils.length)
					{
						estils[i_estil]={"nom":capa.estil[i_estil_video_actiu].nom, "desc": capa.estil[i_estil_video_actiu].desc};
						if (i_estil_sel==-1 && i_estil_video_actiu==capa.i_estil)
							i_estil_sel=i_estil;
					}
				}
			}
			break;  //Assumeixo que totes les capes que formen part d'aquest video tenen els mateixos estils.
		}
	}

	if (estils.length==0)
		cdns.push("");
	else if (estils.length==1)
		cdns.push(DonaCadena(estils[0].desc));
	else
	{
		if (i_estil_sel==-1)
			i_estil_sel=0;
		cdns.push("<select name=\"estil\" onChange=\"CanviaVideo(document.video_animacions.capa.value, document.video_animacions.estil.value);\">");
		for (i_estil=0; i_estil<estils.length; i_estil++)
			cdns.push("<option value=\"",((estils[i_estil].nom) ? estils[i_estil].nom : DonaCadena(estils[i_estil].desc)),"\"",((i_estil==i_estil_sel) ? " SELECTED" : "") +">",DonaCadena(estils[i_estil].desc),"</option>");
		cdns.push("</select>");
	}
	document.getElementById("video_estil").innerHTML=cdns.join("");

	CanviaVideo(nom_video, (i_estil_sel==-1) ? null : (estils[i_estil_sel].nom ? estils[i_estil_sel].nom : DonaCadena(estils[i_estil_sel].desc)));
	return false;
}


function CanviaImatgeBinariaEstadisticaSerieTemporal(nom_canvas, estadistic)
{
	CanviaImatgeBinariaEstadisticaSerieTemporalVista(nom_canvas, ParamInternCtrl.vista, estadistic);
}

function PreparaArraysEstadisticaSerieTemporal(i_cell, i_byte, fila, fila_calc, ncol)
{
var capa, estil, valors;

	for (var i=0; i<ncol; i++)
		fila_calc[i]=[];

	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (!ParticipaFotogramaDeLaSerieTemporal(i_data_video))
			continue;
		capa=ParamCtrl.capa[DatesVideo[i_data_video].i_capa];
		estil=capa.estil[DatesVideo[i_data_video].i_estil];
		valors=capa.valors;
		i_cell[i_data_video]=[];
		i_byte[i_data_video]=[];
		for (var i_v=0; i_v<valors.length; i_v++)
		{
			i_cell[i_data_video][i_v]=0;
			i_byte[i_data_video][i_v]=0;
		}
		fila[i_data_video]=[];
		for (var i=0; i<ncol; i++)
			fila[i_data_video][i]=[];
	}
}

function CanviaImatgeBinariaEstadisticaSerieTemporalVistaProgressiva(nom_canvas, f_estad, f_estad_param, j_ini, paquet_j, nfil, ncol, i_cell, i_byte, fila, fila_calc, estiramentPaleta, paleta)
{
var n_j=j_ini+paquet_j;
var capa, estil, valors;
var ctx, imgData, data, dv=[], n_v_plena;
var i, j, i_data_video;

	if (n_j>nfil)
		n_j=nfil;

	for (var j=j_ini;j<n_j;j++)
	{
		for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
		{
			if (!ParticipaFotogramaDeLaSerieTemporal(i_data_video))
			{
				for (i=0; i<ncol; i++) //Necessari perque alguns estadistic reordenen els valors de l'array. si no els anulo influeixen en les files següents.
					fila_calc[i][i_data_video]=null;
				continue;
			}
			capa=ParamCtrl.capa[DatesVideo[i_data_video].i_capa];
			estil=capa.estil[DatesVideo[i_data_video].i_estil];
			valors=capa.valors;
			n_v_plena=CarregaDataViewsCapa(dv, NovaVistaVideo, DatesVideo[i_data_video].i_data, valors);
			if (n_v_plena==0)
				return;  //Això no hauria d'haver passat mai

			if (n_v_plena>1)
			{
				OmpleMultiFilaDVDesDeBinaryArray(fila[i_data_video], dv, valors, ncol, i_byte[i_data_video], i_cell[i_data_video]);
				FilaFormulaConsultaDesDeMultiFila(fila_calc, i_data_video, null, fila[i_data_video], dv, valors, ncol, estil.component[0]);
			}
			else
			{
				CalculaFilaDesDeBinaryArrays(fila_calc, i_data_video, null, dv, valors, ncol, i_byte[i_data_video], i_cell[i_data_video], estil.component[0]);
			}
		}
		//Tinc una fila per tota la serie fins de file_calc[i_col]
		//Calculo l'estadistic i el guardo en al imatge de floats
		CalculaImatgeEstadisticaDesDesDeFilaCalc(ImgVideoStat, j, ImgVideoStatHistograma, fila_calc, ncol, f_estad, f_estad_param);
	}

	if (n_j<nfil)
		document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"3\">"+
				GetMessage("ComputingStatisticSeries", "video")+
				". " + Math.floor(j*100/nfil) + "% " + GetMessage("PleaseWait") + "</font></center>";
	else
		document.getElementById("video_info").innerHTML="";

	//document.getElementById("video_nodata_max_tx").innerHTML=100;
	var imatge=document.getElementById(nom_canvas);
	imatge.width=ncol;
	imatge.height=nfil;

	ctx=imatge.getContext("2d");
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);

	imgData=ctx.createImageData(imatge.width,imatge.height);

	data=[]; //Empty the array;

	//Aplico la paleta i obtinc l'array de dades dins de 'data'
	DonaDataCanvasDesDeArrayNumericIPaleta(data, null, ImgVideoStat, ncol, nfil, estiramentPaleta, paleta);

	imgData.data.set(data);

	ctx.putImageData(imgData,0,0);
	if (n_j<nfil)
		setTimeout(CanviaImatgeBinariaEstadisticaSerieTemporalVistaProgressiva, 50, nom_canvas, f_estad, f_estad_param, n_j, paquet_j, nfil, ncol, i_cell, i_byte, fila, fila_calc, estiramentPaleta, paleta);
}

function CanviaImatgeBinariaEstadisticaSerieTemporalVista(nom_canvas, vista, estadistic)
{
var capa, primer_estil=null;
var ncol=vista.ncol, nfil=vista.nfil;
var i_cell=[], i_byte=[], fila=[], fila_calc=[];
var f_estad, f_estad_param=null;
var primera_data, primer_gener;
var estiramentPaleta, paleta;

	IniciaImgVideoStat();

	if (estadistic=="Mitjana")
		f_estad=CalculaMeanNValues;
	else if (estadistic=="StanDev")
		f_estad=CalculaStanDevNValues;
	else if (estadistic=="Moda")
	{
		f_estad=CalculaModeNValues;
		f_estad_param=false;
	}
	else if (estadistic=="Pheno_idxsos" || estadistic=="Pheno_idxpos" || estadistic=="Pheno_idxeos" || estadistic=="Pheno_sos" || estadistic=="Pheno_pos" || estadistic=="Pheno_eos" || estadistic=="Pheno_base")
		f_estad=CalculaPhenologyNValues;
	else if (estadistic=="Pheno_idxlos" || estadistic=="Pheno_aos" || estadistic=="Pheno_rog" || estadistic=="Pheno_ros")
		f_estad=CalculaPhenologyDerivNValues;
	else if (estadistic.substring(0, 9)=="NDeValor_")
	{
		f_estad=CalculaCountClasseNValues;
		f_estad_param=parseInt(estadistic.substring(9));
	}
	else
	{
		alert(GetMessage("UnsupportedStatisticalFunction", "video") + ": " + estadistic);
		return;
	}

	if (estadistic.substring(0, 6)=="Pheno_")
	{
		f_estad_param={t:[], stat: estadistic.substring(6)}
		primera_data=new Date(DatesVideo[0].millisegons);
		primer_gener=new Date(primera_data.getFullYear(), 0, 1);
		primer_gener=primer_gener.getTime()/24/60/60/1000;

		for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
			f_estad_param.t[i_data_video]=DatesVideo[i_data_video].millisegons/24/60/60/1000 - primer_gener;
	}

	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (!ParticipaFotogramaDeLaSerieTemporal(i_data_video))
			continue;
		capa=ParamCtrl.capa[DatesVideo[i_data_video].i_capa];
		primer_estil=capa.estil[DatesVideo[i_data_video].i_estil];
		break;
	}

	//Determino com estirar la paleta i quina paleta
	if (estadistic=="Mitjana" || estadistic=="Moda" || estadistic=="Pheno_sos" || estadistic=="Pheno_pos" || estadistic=="Pheno_eos" || estadistic=="Pheno_base" || estadistic=="Pheno_aos")
	{
		estiramentPaleta=primer_estil.component[0].estiramentPaleta;
		paleta=primer_estil.paleta;
	}
	else if (estadistic=="Pheno_idxsos" || estadistic=="Pheno_idxpos" || estadistic=="Pheno_idxeos" || estadistic=="Pheno_idxlos")
	{
		estiramentPaleta={"valorMaxim": 366, "valorMinim": 0};
		paleta=PaletesGlobals.continuous.PhenoCycle;
		if (paleta.ramp && !paleta.colors)
		{
			if (TransformRampToColorsArray(paleta))
				return;
		}
	}
	else
	{
		estiramentPaleta={"valorMaxim": ImgVideoStatHistograma.component[0].valorMaximReal,
				"valorMinim": ImgVideoStatHistograma.component[0].valorMinimReal};
		paleta=null;
	}

	PreparaArraysEstadisticaSerieTemporal(i_cell, i_byte, fila, fila_calc, ncol);

	setTimeout(CanviaImatgeBinariaEstadisticaSerieTemporalVistaProgressiva, 50, nom_canvas, f_estad, f_estad_param, 0, 30, nfil, ncol, i_cell, i_byte, fila, fila_calc, estiramentPaleta, paleta);
}

function CanviaImatgeBinariaEstadisticaEixXEixT(nom_canvas, i_fil)
{
	CanviaImatgeBinariaEstadisticaEixXEixTVista(nom_canvas, ParamInternCtrl.vista, i_fil);
	//EstadisticCarregatVideo="x/t";
	IFilEixXEixTVideo=i_fil;
	document.getElementById("video_info").innerHTML="";
}

function CanviaImatgeBinariaEstadisticaEixXEixTVista(nom_canvas, vista, i_fil)
{
var capa, estil, primer_estil=null, valors
var ctx, imgData, data, dv=[], n_v_plena;
var j, ncol=vista.ncol, nfil=vista.nfil, i_data_video;
var i_cell=[], i_byte=[], fila=[], fila_calc=[];

	IniciaImgVideoStat();

	PreparaArraysEstadisticaSerieTemporal(i_cell, i_byte, fila, fila_calc, ncol);

	for (j=0;j<nfil;j++)
	{
		for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
		{
			if (!ParticipaFotogramaDeLaSerieTemporal(i_data_video))
				continue;
			capa=ParamCtrl.capa[DatesVideo[i_data_video].i_capa];
			estil=capa.estil[DatesVideo[i_data_video].i_estil];
			if (!primer_estil)
				primer_estil=estil
			valors=capa.valors;
			n_v_plena=CarregaDataViewsCapa(dv, NovaVistaVideo, DatesVideo[i_data_video].i_data, valors);
			if (n_v_plena==0)
				return;  //Això no hauria d'haver passat mai

			if (n_v_plena>1)
			{
				OmpleMultiFilaDVDesDeBinaryArray(fila[i_data_video], dv, valors, ncol, i_byte[i_data_video], i_cell[i_data_video]);
				if (j==i_fil)
					FilaFormulaConsultaDesDeMultiFila(fila_calc, i_data_video, null, fila[i_data_video], dv, valors, ncol, estil.component[0]);
			}
			else
			{
				//Es podria obtimitzar evitant que calculi el que no cal donat que només vull la darrera fila
				CalculaFilaDesDeBinaryArrays(fila_calc, i_data_video, null, dv, valors, ncol, i_byte[i_data_video], i_cell[i_data_video], estil.component[0]);
			}
		}
		//Tinc una fila per tota la serie fins de file_calc[i_col]

		if (j==i_fil)
		{
			CalculaImatgeEixXEixTDesDesDeFilaCalc(ImgVideoStat, i_fil, nfil, ImgVideoStatHistograma, fila_calc, ncol);
			break;
		}
	}

	var imatge=document.getElementById(nom_canvas);
	imatge.width=ncol;
	imatge.height=nfil;

	ctx=imatge.getContext("2d");
	ctx.clearRect( 0, 0, ctx.canvas.width, ctx.canvas.height);

	imgData=ctx.createImageData(imatge.width,imatge.height);

	data=[]; //Empty the array;

	//Aplico la paleta i obtinc l'array de dades dins de 'data'
	DonaDataCanvasDesDeArrayNumericIPaleta(data, null, ImgVideoStat, ncol, nfil, primer_estil.component[0].estiramentPaleta, primer_estil.paleta);

	imgData.data.set(data);

	ctx.putImageData(imgData,0,0);
}

function CalculaValorsEixTPerImatgeEixXEixT(nfil)
{
var i_data_fil=[], t, j, i_data_video;

	var time_span=(DatesVideo[DatesVideo.length-1].millisegons-DatesVideo[0].millisegons)
	time_span+=time_span/DatesVideo.length; //Per tal de fer que el darrer temps s'allargui com tots els altres
	var time_step=time_span/nfil;

	for (j=0, t=DatesVideo[0].millisegons, i_data_video=0; j<nfil; j++, t+=time_step)
	{
		while(i_data_video<DatesVideo.length && DatesVideo[i_data_video].millisegons<=t)
			i_data_video++;
		i_data_fil[j]=i_data_video-1;
	}

	//Ara elimino totes les files no animables
	//Busco el primer temps animable
	for (j=0; j<nfil; j++)
	{
		if (ParticipaFotogramaDeLaSerieTemporal(i_data_fil[j]))
			break;
	}
	if (j<nfil)
	{
		//substituexo els primers temps que no són animables pel primer que ho és
		for (var j2=0; j2<j; j2++)
			i_data_fil[j2]=i_data_fil[j];

		//substituexo els temps que no són animables pels immediatement anteriors que ho són
		for (j++; j<nfil; j++)
		{
			if (!ParticipaFotogramaDeLaSerieTemporal(i_data_fil[j]))
				i_data_fil[j]=i_data_fil[j-1];
		}
	}
	return i_data_fil;
}

function CalculaImatgeEixXEixTDesDesDeFilaCalc(img_stat, i_fil, nfil, histograma, fila_calc, ncol)
{
var i_cell_ini, i_data, i, j, valor0, histo_component0=histograma ? histograma.component[0] : null;

	IDataFilEixXEixT=CalculaValorsEixTPerImatgeEixXEixT(nfil);

	for (j=0; j<nfil; j++)
	{
		i_data=IDataFilEixXEixT[j];
		i_cell_ini=j*ncol;
		for (i=0; i<ncol; i++)
		{
			valor0=img_stat[i_cell_ini+i]=fila_calc[i][i_data];
			if (histograma)
			{
				if (isNaN(valor0) || valor0==null)
					histograma.classe_nodata++;
				else
				{
					if (histo_component0.valorMinimReal>valor0)
						histo_component0.valorMinimReal=valor0;
					if (histo_component0.valorMaximReal<valor0)
						histo_component0.valorMaximReal=valor0;
				}
			}
		}
	}
	return;
}

function PosaEstadisticSerieOAnimacio(event, estadistic, i_fil)
{
	if (event)
		dontPropagateEvent(event);
	if (estadistic=="x/t" && i_fil==-1 && IFilEixXEixTVideo==-1)
	{
		//document.video_animacions.TipusClick[0].checked=false;
		//document.video_animacions.TipusClick[1].checked=true;
		TancaFinestraSerieTemp("video_grafic", "video_click");
		document.getElementById("video_click").style.visibility="visible";
		IFilEixXEixTVideo=-2;
		return;
	}

	var n=parseFloat(document.video_animacions.interval.value);
	if (isNaN(n) || n<0.09)
		n=0;

	if (estadistic=="animacio")
	{
		//Activo les caracteristiques de video.
		document.getElementById("video_botons_animacio").style.visibility="visible";
		document.getElementById("video_botons_estadistics").style.visibility="hidden";
		document.getElementById("video_time_text").style.visibility="visible";
		document.getElementById("video_time_slider").style.visibility="visible";
		EncenFotogramaRodet(IDataVideoMostrada, n);
		EncenFotogramaVideo(IDataVideoMostrada, n);
		ApagaEstadisticsVideo(n);
		IFilEixXEixTVideo=-1;
		return;
	}

		//Desactivo les caracteristiques de video.
   		if (timeoutVideoID)
		{
			clearTimeout(timeoutVideoID);
			timeoutVideoID=null;
		}
		document.getElementById("video_botons_animacio").style.visibility="hidden";
		document.getElementById("video_botons_estadistics").style.visibility="visible";
		document.getElementById("video_time_slider").style.visibility="hidden";
		ApagaFotogramaVideo(IDataVideoMostrada, n);
		//Activo el fotograma de les estadístiques
		EncenEstadisticsVideo(n);
		if (estadistic=="x/t")
		{
			document.getElementById("video_time_text").style.visibility="visible";
			//if (EstadisticCarregatVideo!=estadistic || (IFilEixXEixTVideo!=i_fil && i_fil!=-1))
			if (i_fil!=-1)
			{
				//Demano l'execució del perfil x/t
				setTimeout("CanviaImatgeBinariaEstadisticaEixXEixT(\"video_i_raster_stat\", "+i_fil+")", 50);
				document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"3\">"+
					GetMessage("ComputingGraphicSeries", "video")+
					". 0% " + GetMessage("PleaseWait") + "</font></center>";
			}
		}
		else
		{
			document.getElementById("video_time_text").style.visibility="hidden";
			IFilEixXEixTVideo=-1;
			//if (EstadisticCarregatVideo!=estadistic)
			//{
				//Demano l'execució del càlcul estadístic
				setTimeout("CanviaImatgeBinariaEstadisticaSerieTemporal(\"video_i_raster_stat\", \""+estadistic+"\")", 50);
				document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"3\">"+
					GetMessage("ComputingStatisticSeries", "video")+
					". 0% " + GetMessage("PleaseWait") + "</font></center>";
			//}
		}
	return;
}

//Segons: http://resources.esri.com/help/9.3/arcgisengine/java/GP_ToolRef/spatial_analyst_tools/esri_ascii_raster_format.htm?
function ConverteixImatgeArrayNumericAAESRIASCIIRaster(img_array_num, histo_component0, ncol, nfil, env, costat)
{
var cdns=[], nodata=255, i, j, valor0;

	if (nodata<histo_component0.valorMaximReal)
	{
		nodata=-32768;
		if (nodata>histo_component0.valorMinimReal)
			nodata=Math.ceil(histo_component0.valorMaximReal+1);
	}
	cdns.push("ncols ", ncol, "\n",
		"nrows ", nfil, "\n",
		"xllcorner ", env.MinX, "\n",
		"yllcorner ", env.MinY, "\n",
		"cellsize ", costat, "\n",
		"NODATA_value ", nodata, "\n");

	for (j=0;j<nfil;j++)
	{
		for (i=0;i<ncol;i++)
		{
			valor0=img_array_num[j*ncol+i];
			if (isNaN(valor0) || valor0==null)
				cdns.push(nodata);
			else
				cdns.push(valor0);   //cdns.push(valor0.toPrecision(3));
			if (i+1<ncol)
				cdns.push(" ");
		}
		cdns.push("\n");
	}
	return cdns.join("");
}

function VideoCopiaEstadistic(event)
{
	IniciaCopiaPortapapersFinestra(window, "VideoDiv");

	FinalitzaCopiaPortapapersFinestra(window, "VideoDiv",
			ConverteixImatgeArrayNumericAAESRIASCIIRaster(ImgVideoStat, ImgVideoStatHistograma.component[0], ParamInternCtrl.vista.ncol, ParamInternCtrl.vista.nfil, ParamInternCtrl.vista.EnvActual, ParamInternCtrl.vista.CostatZoomActual),
			GetMessage("ValuesImageCopiedClipboard", "video"));

	dontPropagateEvent(event);
	return false;
}


function MostraFotogramaAillat(i_data_video, actualitza_scroll)
{
   	if (timeoutVideoID)
	{
        	clearTimeout(timeoutVideoID);
		timeoutVideoID=null;""
	}
	MostraFotograma(i_data_video, true, actualitza_scroll);
}

var ActualitzaNCarregatRodetEsCurs=false;

function ActualitzaNCarregatRodet()
{
var n_carregat=0;

	if (ActualitzaNCarregatRodetEsCurs)
	{
		timeoutVideoInfo=setTimeout("ActualitzaNCarregatRodet()", 50);
		return;
	}

	ActualitzaNCarregatRodetEsCurs=true;
	for (var i_data=0; i_data<DatesVideo.length; i_data++)
	{
		if (DatesVideo[i_data].carregadaRodet)
			n_carregat++
	}
	if (n_carregat>=DatesVideo.length)
	{
		document.getElementById("video_info").innerHTML="";
		ActualitzaNCarregatRodetEsCurs=false;
		FiltraNodataICarregaVideo();
		return;
	}
	document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"4\">"+ GetMessage("LoadingThumbnails", "video") + " " + n_carregat +"/"+ DatesVideo.length +" "+GetMessage("PleaseWait")+"...</font></center>";
	timeoutVideoInfo=setTimeout("ActualitzaNCarregatRodet()", 600);
	ActualitzaNCarregatRodetEsCurs=false;
}

function DonaNFotogramesCarregatsVideo()
{
var n_carregat=0;
	for (var i_data=0; i_data<DatesVideo.length; i_data++)
	{
		if (DatesVideo[i_data].carregada)
			n_carregat++
	}
	return n_carregat;
}

function DonaNFotogramesCarregablesVideo()
{
var n_carregable=0;
	for (var i_data=0; i_data<DatesVideo.length; i_data++)
	{
		if (DatesVideo[i_data].animable!="no" && RatioNodataNoTolerat>DonaRatioNodataRodet(i_data))
			n_carregable++
	}
	return n_carregable;
}


function EstanTotsElsFotogramesCarregatsVideo()
{
var n_carregat=DonaNFotogramesCarregatsVideo();
var n_carregable=DonaNFotogramesCarregablesVideo();
	if (n_carregat<n_carregable)
		return false;
	return true;
}

var ActualitzaNCarregatVideoEsCurs=false;

function ActualitzaNCarregatVideo()
{
var n_carregat, n_carregable;
	if (ActualitzaNCarregatVideoEsCurs)
	{
		timeoutVideoInfo=setTimeout("ActualitzaNCarregatVideo()", 50);
		return;
	}
	ActualitzaNCarregatVideoEsCurs=true;

	n_carregat=DonaNFotogramesCarregatsVideo();
	n_carregable=DonaNFotogramesCarregablesVideo();
	if (n_carregat>=n_carregable)
	{
		document.getElementById("video_info").innerHTML="";
		ActualitzaNCarregatVideoEsCurs=false;
		VideoPlay(8);  //Com que se que ja ho tinc tot, faig "Play" repetitiu.
		return;
	}
	document.getElementById("video_info").innerHTML="<center><font face=\"Verdana, Arial, Helvetica, sans-serif\" size=\"4\">"+ GetMessage("Loading") + " " + n_carregat +"/"+ n_carregable +" "+GetMessage("PleaseWait")+"...</font></center>";
	timeoutVideoInfo=setTimeout("ActualitzaNCarregatVideo()", 1000);
	ActualitzaNCarregatVideoEsCurs=false;
}

function ActivaFotogramaRodet(i_data_video)
{
	DatesVideo[i_data_video].carregadaRodet=true;
}

function ActivaFotogramaVideo(i_data_video)
{
	DatesVideo[i_data_video].carregada=true;
	var img=document["video_evol"+DonaIPecaBarraVideo(i_data_video, DonaNPecesBarraVideo())];
	var nom_icona=TreuAdreca(img.src);

	//Posa la ratlleta vermella a la barra estreta
	if (nom_icona=="evol_bl.png")
		img.src=AfegeixAdrecaBaseSRC("evol_bl_fotog.png");
	else if (nom_icona=="evol_blau.png")
		img.src=AfegeixAdrecaBaseSRC("evol_blau_fotog.png");
	else if (nom_icona=="evol_pnt.png")
		img.src=AfegeixAdrecaBaseSRC("evol_pnt_fotog.png");
	else if (nom_icona=="evol_pnt_blau.png")
		img.src=AfegeixAdrecaBaseSRC("evol_pnt_blau_fotog.png");
}

function CanviaFotogramaSiPuntABarra(event, i)
{
var img=document["video_evol"+i];
var nom_icona=TreuAdreca(img.src);

	if (nom_icona!="evol_bl_fotog.png" && nom_icona!="evol_blau_fotog.png" &&
	    nom_icona!="evol_pnt_fotog.png" && nom_icona!="evol_pnt_blau_fotog.png")
		return;

	MostraFotogramaAillat(DonaIDataVideoDesDePecaBarraVideo(i, DonaNPecesBarraVideo()), true);
}

function ApagaFotogramaRodet(i_data_video, n)
{
	if (i_data_video!=-1)
	{
		document["video_marc_sup"+i_data_video].src=AfegeixAdrecaBaseSRC("1negre.gif");
		document["video_marc_dre"+i_data_video].src=AfegeixAdrecaBaseSRC("1negre.gif");
		document["video_marc_esq"+i_data_video].src=AfegeixAdrecaBaseSRC("1negre.gif");
		document["video_marc_inf"+i_data_video].src=AfegeixAdrecaBaseSRC("1negre.gif");
	}
}

function ApagaFotogramaVideo(i_data_video, n)
{
	if (i_data_video!=-1)
	{
		//Desactivo els fotograma que no toca en el video
		document.getElementById("video_l_raster"+i_data_video).style.opacity=0;
		//Determino la corba adient amb: http://cubic-bezier.com
		document.getElementById("video_l_raster"+i_data_video).style.transition=(n) ? "opacity "+n/2+"s cubic-bezier(.6,.2,.8,.4)" : null;
	}
}

function ApagaEstadisticsVideo(n)
{
	var elem=document.getElementById("video_l_raster_stat");
	if (elem) // potser que no existeix-hi perquè no hi ha cap capa animable tipus IMG
	{
		elem.style.opacity=0;
		elem.style.transition=(n) ? "opacity "+n/2+"s cubic-bezier(.6,.2,.8,.4)" : null;
	}
}

function EncenFotogramaRodet(i_data_video, n)
{
	if (i_data_video!=-1)
	{
		document["video_marc_sup"+i_data_video].src=AfegeixAdrecaBaseSRC("1vermell.gif");
		document["video_marc_dre"+i_data_video].src=AfegeixAdrecaBaseSRC("1vermell.gif");
		document["video_marc_esq"+i_data_video].src=AfegeixAdrecaBaseSRC("1vermell.gif");
		document["video_marc_inf"+i_data_video].src=AfegeixAdrecaBaseSRC("1vermell.gif");
	}
}

function EncenFotogramaVideo(i_data_video, n)
{
	if (i_data_video!=-1)
	{
		//Activo els fotograma que no toca en el video.
		document.getElementById("video_l_raster"+i_data_video).style.opacity=1;
		document.getElementById("video_l_raster"+i_data_video).style.transition=(n) ? "opacity "+n/2+"s cubic-bezier(.2,.6,.4,.8)" : null;
	}
}

function EncenEstadisticsVideo(n)
{
	var elem=document.getElementById("video_l_raster_stat");
	if (elem) // potser que no existeix-hi perquè no hi ha cap capa animable tipus IMG
	{
		elem.style.opacity=1;
		elem.style.transition=(n) ? "opacity "+n/2+"s cubic-bezier(.2,.6,.4,.8)" : null;
	}
}

function MostraFotograma(i_data_video, actualitza_fotograma_video, actualitza_scroll)
{
var j, img, nom_icona;

	if (DatesVideo[i_data_video].animable!="si")
		return;

	//Actualitzo la data.
	document.getElementById("video_data").innerHTML=DonaDataComAText(DatesVideo[i_data_video].i_capa, DatesVideo[i_data_video].i_data);

	//Apago la barra de progrés de videos.
	var n=DonaNPecesBarraVideo();

	//Encenc l'element de la barra que toca.
	var i=DonaIPecaBarraVideo(i_data_video, n);
	for (j=0; j<i; j++)
	{
		img=document["video_evol"+j];
		nom_icona=TreuAdreca(img.src);
		if (nom_icona=="evol_bl_fotog.png" || nom_icona=="evol_blau_fotog.png" || nom_icona=="evol_pnt_fotog.png" || nom_icona=="evol_pnt_blau_fotog.png")
			img.src=AfegeixAdrecaBaseSRC("evol_blau_fotog.png");
		else
			img.src=AfegeixAdrecaBaseSRC("evol_blau.png");

	}

	img=document["video_evol"+j];
	nom_icona=TreuAdreca(img.src);

	if (j==n-1)
	{
		if (nom_icona=="evol_bl_fotog.png" || nom_icona=="evol_blau_fotog.png" || nom_icona=="evol_pnt_blau_fotog.png")
			img.src=AfegeixAdrecaBaseSRC("evol_pnt_blau_fotog.png");
		else
			img.src=AfegeixAdrecaBaseSRC("evol_pnt_blau.png");
	}
	else
	{
		if (nom_icona=="evol_bl_fotog.png" || nom_icona=="evol_blau_fotog.png" || nom_icona=="evol_pnt_fotog.png")
			img.src=AfegeixAdrecaBaseSRC("evol_pnt_fotog.png");
		else
			img.src=AfegeixAdrecaBaseSRC("evol_pnt.png");
		for (j++; j<n; j++)
		{
			img=document["video_evol"+j];
			nom_icona=TreuAdreca(img.src);
			if (nom_icona=="evol_bl_fotog.png" || nom_icona=="evol_blau_fotog.png" || nom_icona=="evol_pnt_fotog.png" || nom_icona=="evol_pnt_blau_fotog.png")
				img.src=AfegeixAdrecaBaseSRC("evol_bl_fotog.png");
			else
				img.src=AfegeixAdrecaBaseSRC("evol_bl.png");
		}
	}

	//Actualitzo la posició del rodet i el fotograma actiu
	var n=parseFloat(document.video_animacions.interval.value);
	if (isNaN(n) || n<0.09)
		n=0;

	ApagaFotogramaRodet(IDataVideoMostrada, n);
	EncenFotogramaRodet(i_data_video, n);

	ApagaFotogramaVideo(IDataVideoMostrada, n);
	if (actualitza_fotograma_video)
	{
		EncenFotogramaVideo(i_data_video, n);
		ApagaEstadisticsVideo(n);
		//Poso el selector a animacions
		if (typeof document.video_animacions.veure!=="undefined" && document.video_animacions.veure!=null)
			document.video_animacions.veure.selectedIndex=0;
	}

	if (actualitza_scroll)
	{
		var i_actual;
		var rodet;
		rodet=document.getElementById("video_rodet");
		if (rodet)
		{
			if (RodetVertical)
			{
				i_actual=i_data_video;
				if (i_actual>0)
				    i_actual--;
				rodet.scrollTop=i_actual*rodet.scrollHeight/DatesVideo.length;
			}
			else
			{
				var ncol=parseInt(50*ParamInternCtrl.vista.ncol/ParamInternCtrl.vista.nfil)+8+2+2; //Mida d'un fotograma del rodet amb tots els marges
				var n_fotog_rodet_visibles=(ParamInternCtrl.vista.ncol+142)/ncol;
				i_actual=parseInt(i_data_video/n_fotog_rodet_visibles)*n_fotog_rodet_visibles;
				rodet.scrollLeft=i_actual*rodet.scrollWidth/DatesVideo.length;
			}
		}
	}
	IDataVideoMostrada=i_data_video;
}

function DeterminaIDataVideoSeguent(i_data_mostrada, opcio)
{
var i_data_a_mostrar=i_data_mostrada;
var i_data_video_actiu;

		if (i_data_mostrada==-1)
		{
			for(var i=0; i<DatesVideo.length; i++)
			{
				if(DatesVideo[i].animable=="si")
					return i;
			}
		}
		else
		{
			for (i_data_video_actiu=0; i_data_video_actiu<DatesVideo.length; i_data_video_actiu++)
			{
				if (i_data_video_actiu!=i_data_mostrada &&
					DatesVideo[i_data_video_actiu].animable=="si")
				{
					if (opcio==1)
					{
						if (DatesVideo[i_data_mostrada].millisegons < DatesVideo[i_data_video_actiu].millisegons)
						{
							if (i_data_a_mostrar==i_data_mostrada)
								i_data_a_mostrar=i_data_video_actiu;
							else if (DatesVideo[i_data_a_mostrar].millisegons > DatesVideo[i_data_video_actiu].millisegons)
								i_data_a_mostrar=i_data_video_actiu;
						}
					}
					else
					{
						if (DatesVideo[i_data_mostrada].millisegons > DatesVideo[i_data_video_actiu].millisegons)
						{
							if (i_data_a_mostrar==i_data_mostrada)
								i_data_a_mostrar=i_data_video_actiu;
							else if (DatesVideo[i_data_a_mostrar].millisegons < DatesVideo[i_data_video_actiu].millisegons)
								i_data_a_mostrar=i_data_video_actiu;
						}
					}
				}
			}
		}
	return i_data_a_mostrar;
}

function VideoPlayEvent(event, opcio)
{
	VideoPlay(opcio);
	dontPropagateEvent(event);
	return false;
}

function VideoPlay(opcio)
{
	if (timeoutVideoID)
	{
	    clearTimeout(timeoutVideoID);
	    timeoutVideoID=null;
	}
	VideoPlayRecursiva(opcio);
	return false;
}

function VideoPlayRecursiva(opcio)
{
var i_data_a_mostrar;
var i_capa_previa;
var n;

	if (document.video_animacions.TipusTemps[0].checked)
	{
		n=parseFloat(document.video_animacions.EscalaTemporal.value);
		if (n<=0)
			alert(GetMessage("WrongValueTemporalScale", "video"));
		else
		{
			if (0==VideoMostra(opcio)) 	   //mostrar la imatge que toca.
			{
				//buscar la imatge següent.
				i_data_a_mostrar=DeterminaIDataVideoSeguent(IDataVideoMostrada, 1)
				if (IDataVideoMostrada==i_data_a_mostrar)
				{
					if (opcio==9)
						return; //Estic al final d'una sequencia automàtica.

					//animació circular
					i_data_a_mostrar=0;
					while (DatesVideo[i_data_a_mostrar].animable!="si")
					{
						i_capa_previa=i_data_a_mostrar;
						i_data_a_mostrar=DeterminaIDataVideoSeguent(i_capa_previa, 1);
						if (i_capa_previa==i_data_a_mostrar)
						return;  //alguna cosa no va
					}
				}
				timeoutVideoID=setTimeout('VideoPlayRecursiva('+opcio+')', (DatesVideo[i_data_a_mostrar].millisegons-DatesVideo[IDataVideoMostrada].millisegons)/n);
			}
		}
	}
	else if (document.video_animacions.TipusTemps[1].checked)
	{
		n=parseFloat(document.video_animacions.interval.value);
		if (n<=0 || isNaN(n))
		{
			alert(GetMessage("IncorrectValueIntervalSeconds", "video") + ". " + GetMessage("WillUse", "video"));
			n=5.0;
		}
		if (0==VideoMostra(opcio))
			timeoutVideoID=setTimeout("VideoPlayRecursiva("+opcio+")", n*1000);
	}
	else
		alert(GetMessage("SelectTempScaleInterval", "video"));
}//Fi de VideoPlayRecursiva()

function VideoMostraEvent(event, opcio)
{
	VideoMostra(opcio);
	dontPropagateEvent(event);
	return false;
}

function VideoMostra(opcio)
{
var i_data_a_mostrar=(IDataVideoMostrada==-1) ? 0 : IDataVideoMostrada;
var i_capa_previa;


	if (opcio!=8 && opcio!=9)
	{
   		if (timeoutVideoID)
		{
			clearTimeout(timeoutVideoID);
			timeoutVideoID=null;
		}
	}
	if (opcio==1 || opcio==8 || opcio==9)
	{
		i_data_a_mostrar=DeterminaIDataVideoSeguent(IDataVideoMostrada, 1);
		if ((opcio==8 || opcio==9) && IDataVideoMostrada==i_data_a_mostrar)
		{
		    //Estic al final d'una sequencia automàtica.
			if (opcio==9)
				return 1;

			//animació circular
		 	i_data_a_mostrar=0;
			while (DatesVideo[i_data_a_mostrar].animable!="si")
			{
				i_capa_previa=i_data_a_mostrar;
				i_data_a_mostrar=DeterminaIDataVideoSeguent(i_capa_previa, 1);
				if (i_capa_previa==i_data_a_mostrar)
				return;  //alguna cosa no va
			}
 		}
	}
	else if (opcio==-1)
	{
		i_data_a_mostrar=DeterminaIDataVideoSeguent(IDataVideoMostrada, -1);
	}
	else if (opcio==2)
	{
		i_data_a_mostrar=DatesVideo.length-1;
		while (DatesVideo[i_data_a_mostrar].animable!="si")
		{
			i_capa_previa=i_data_a_mostrar;
			i_data_a_mostrar=DeterminaIDataVideoSeguent(i_capa_previa, -1);
			if (i_capa_previa==i_data_a_mostrar)
			return;  //alguna cosa no va
		}
	}
	else if (opcio==-2)
	{
		i_data_a_mostrar=0;
		while (DatesVideo[i_data_a_mostrar].animable!="si")
		{
			i_capa_previa=i_data_a_mostrar;
			i_data_a_mostrar=DeterminaIDataVideoSeguent(i_capa_previa, 1);
			if (i_capa_previa==i_data_a_mostrar)
			return;  //alguna cosa no va
		}
	}

	/*else  //(opcio==0)*/
	MostraFotograma(i_data_a_mostrar, true, true);
	return 0;
}

function IniciaImgVideoStat()
{
	ImgVideoStat=[];
	ImgVideoStatHistograma={"classe_nodata": 0,
		"component": [{
			//"classe": [],
			"valorMinimReal": +1e300,
			"valorMaximReal": -1e300}]};
}

function DescarregaVideo()
{
	if (timeoutVideoID)
	{
	    clearTimeout(timeoutVideoID);
	    timeoutVideoID=null;
	}
	if (timeoutVideoInfo)
	{
	    clearTimeout(timeoutVideoInfo);
	    timeoutVideoInfo=null;
	}
	for (var i_data_video=0; i_data_video<DatesVideo.length; i_data_video++)
	{
		if (DatesVideo[i_data_video].timeOutRodet)
		{
			clearTimeout(DatesVideo[i_data_video].timeOutRodet);
			DatesVideo[i_data_video].timeOutRodet=null
		}
		if (DatesVideo[i_data_video].timeOutFotograma)
		{
			clearTimeout(DatesVideo[i_data_video].timeOutFotograma);
			DatesVideo[i_data_video].timeOutFotograma=null
		}
	}
	DatesVideo=[];
	IDataVideoMostrada=-1;
	PuntsSerieTemporal=[];
	IniciaImgVideoStat();
	//EstadisticCarregatVideo=null;
	IDataFilEixXEixT=[];
	IFilEixXEixTVideo=-1;
	TancaFinestraSerieTemp("video_grafic", "video_click");
}

//No useu sola. Useu TancaFinestraLayer("video")
function TancaFinestra_video()
{
	DescarregaVideo();
}
