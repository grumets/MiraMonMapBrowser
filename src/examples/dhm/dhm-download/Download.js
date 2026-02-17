//variable global que en diu en quin idioma es mostra la pàigna. Per defecte Anglés.
var Lang="eng";

function setLang(){
	//Canviem el valor de la variable global d'idioma en funció de la selecció de l'usuari
	Lang=document.getElementById("sel_language").value;
	PintaPlanaPrincipalMultiidoma(Lang);
}

function updateDownloadLinks() {
    var format = document.getElementById("formatSelector").value;

    // Troba tots els <a> dins de tots els <svg>
    var links = document.querySelectorAll("svg a");

    links.forEach(function(link) {
        var href = link.getAttribute("xlink:href");

        // Modifica només la part final de l'URL sense alterar el domini
        if (href) {
            var newHref = href.replace(/\.(mmzx|zip)$/, "." + format);
            link.setAttribute("xlink:href", newHref);
        }
    });
}

//funció copiada i modificada de Nmmblang.js
function DonaCadenaJSON(s)
{
	if (Lang=="cat")
		return s.cat;
	else if (Lang=="spa")
		return s.spa;
	else //if (Lang=="eng")
		return s.eng;		
}

function PintaPlanaPrincipalMultiidoma(lang, extra_param)
{
	//títol web
	if (document.getElementById("t_web"))
		document.getElementById("t_web").innerHTML=DonaCadenaJSON({
			eng:"LidarTeam: Downloads",
			cat:"LidarTeam: Descàrregues",
			spa:"LidarTeam: Descargas"
		})
		
	//títol princial
	if (document.getElementById("title"))
		document.getElementById("title").innerHTML=DonaCadenaJSON({
			eng:"lidarTeam",
			cat:"lidarTeam",
			spa:"lidarTeam"
		})	
		
	//subtítol
	if (document.getElementById("subtitle"))
		document.getElementById("subtitle").innerHTML=DonaCadenaJSON({
			eng:"Downloads",
			cat:"Descàrregues",
			spa:"Descargas"
		})	
		
	if (document.getElementById("par_01"))
		document.getElementById("par_01").innerHTML=DonaCadenaJSON({
			eng:"Access the <b>downloads</b> of the different Digital Height Models in <a href=\"https://www.miramon.cat/new_note/news/MMZX/MMZXu.htm\" target=\"_blank\" rel=\"noopener noreferrer\"><b>MMZX</b></a> format (<a href=\"https://www.iso19165.org/\" target=\"_blank\" rel=\"noopener noreferrer\">ISO19165</a>) from <a href=\"https://www.miramon.cat/Index_eng.htm\" target=\"_blank\" rel=\"noopener noreferrer\">MiraMon</a> or in <b>GeoTIFF</b> format (<a href=\"https://docs.ogc.org/is/19-008r4/19-008r4.html\" target=\"_blank\" rel=\"noopener noreferrer\">OGC standard</a>).",
			cat:"Accedeix a les <b>descàrregues</b> dels diferents Models Digitals d'Alçàries en format <a href=\"https://www.miramon.cat/new_note/news/MMZX/MMZX.htm\" target=\"_blank\" rel=\"noopener noreferrer\"><b>MMZX</b></a> (<a href=\"https://www.iso19165.org/\" target=\"_blank\" rel=\"noopener noreferrer\">ISO19165</a>) del <a href=\"https://www.miramon.cat/mus/cat/index.htm\" target=\"_blank\" rel=\"noopener noreferrer\">MiraMon</a> o en <b>GeoTIFF</b> (<a href=\"https://docs.ogc.org/is/19-008r4/19-008r4.html\" target=\"_blank\" rel=\"noopener noreferrer\">estàndard OGC</a>).",
			spa:"Accede a las <b>descargas</b> de los diferentes Modelos Digitales de Alturas en formato <a href=\"https://www.miramon.cat/new_note/news/MMZX/MMZXe.htm\" target=\"_blank\" rel=\"noopener noreferrer\"><b>MMZX</b></a> (<a href=\"https://www.iso19165.org/\" target=\"_blank\" rel=\"noopener noreferrer\">ISO19165</a>) del <a href=\"https://www.miramon.cat/Index_spa.htm\" target=\"_blank\" rel=\"noopener noreferrer\">MiraMon</a> o en <b>GeoTIFF</b> (<a href=\"https://docs.ogc.org/is/19-008r4/19-008r4.html\" target=\"_blank\" rel=\"noopener noreferrer\">estándar OGC</a>)."
		})

	if (document.getElementById("lv1"))
		document.getElementById("lv1").innerHTML=DonaCadenaJSON({
			eng:"DHM lidarCat v1",
			cat:"MDA lidarCat v1",
			spa:"MDA lidarCat v1"
		})
		
	if (document.getElementById("lv2"))
			document.getElementById("lv2").innerHTML=DonaCadenaJSON({
				eng:"DHM lidarCat v2",
				cat:"MDA lidarCat v2",
				spa:"MDA lidarCat v2"
			})		

	if (document.getElementById("amb"))
		document.getElementById("amb").innerHTML=DonaCadenaJSON({
			eng:"DHM AMB",
			cat:"MDA AMB",
			spa:"MDA AMB"
		})

	if (document.getElementById("m_home"))
		document.getElementById("m_home").innerHTML=DonaCadenaJSON({
			eng:"Home",
			cat:"Inici",
			spa:"Inicio"
		})

	if (document.getElementById("m_navi"))
		document.getElementById("m_navi").innerHTML=DonaCadenaJSON({
			eng:"Map Browser",
			cat:"Navegador de Mapes",
			spa:"Navegador de Mapas"
		})		
		
	if (document.getElementById("m_down"))
		document.getElementById("m_down").innerHTML=DonaCadenaJSON({
			eng:"Download",
			cat:"Descàrregues",
			spa:"Descargas"
		})		
		
	if (document.getElementById("m_meta"))
		document.getElementById("m_meta").innerHTML=DonaCadenaJSON({
			eng:"Metadata",
			cat:"Metadades",
			spa:"Metadatos"
		})
	if (document.getElementById("m_stnd"))
		document.getElementById("m_stnd").innerHTML=DonaCadenaJSON({
			eng:"OGC Web service & API",
			cat:"OGC Web service & API",
			spa:"OGC Web service & API"
		})		
}

// Executar el canvi d'idioma en carregar la pàgina
document.addEventListener("DOMContentLoaded", function() {
    PintaPlanaPrincipalMultiidoma();
});