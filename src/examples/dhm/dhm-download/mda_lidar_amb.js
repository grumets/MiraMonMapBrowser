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
			eng:"AMB Digital Height Model [2011-2013]",
			cat:"Model Digital d'Alçàries AMB [2011-2013]",
			spa:"Model Digital de Alturas AMB [2011-2013]"
		})
		
	//títol princial
	if (document.getElementById("title"))
		document.getElementById("title").innerHTML=DonaCadenaJSON({
			eng:"Digital Height Model",
			cat:"Model Digital d'Alçàries",
			spa:"Model Digital de Alturas"
		})	
		
	//subtítol
	if (document.getElementById("subtitle"))
		document.getElementById("subtitle").innerHTML=DonaCadenaJSON({
			eng:"AMB DHM (2011-2013)",
			cat:"MDA AMB (2011-2013)",
			spa:"MDA AMB (2011-2013)"
		})	
		
	if (document.getElementById("par_01"))
		document.getElementById("par_01").innerHTML=DonaCadenaJSON({
			eng:"<b>Digital Height Model of the Metropolitan Area of Barcelona</b> (AMB), of 2 m cell side, generated from the <a href=\"https://geoportalcartografia.amb.cat/AppGeoportalCartografia2/?locale=ca&Categoria=Lidar&Producte=54\" target=\"_blank\" rel=\"noopener noreferrer\">AMB</a> lidar base with a minimum density of <b>4 points/m²</b> (generated from several flights between 2011 and 2013), the 2-meter resolution <b>Digital Elevation Model</b> from <a href=\"https://www.icgc.cat/ca/Dades-i-productes/Bessons-digitals-Elevacions/Model-delevacions-del-terreny-de-2x2-m\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>, and other reference bases such as the <a href=\"https://agricultura.gencat.cat/ca/serveis/cartografia-sig/bases-cartografiques/usos-sol-subsol/usos-sol/index.html\" target=\"_blank\" rel=\"noopener noreferrer\"><b>Land Use and Cover Maps of Catalonia</b></a> (MUCSC) from UAB-CREAF and the 1:2500 CIR orthophoto (2012) from <a href=\"https://www.icgc.cat/ca/Geoinformacio-i-mapes/Geoinformacio-en-linia-Geoserveis/WMS-Ortoimatges/WMS-dOrtofoto-Territorial\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>. <br><br>The data mostly correspond to the months of December, January, and February (99.2 %) and to the years 2012 (11.0 %) and 2013 (88.9 %).",		
			cat:"<b>Model Digital d'Alçàries de l'Àrea Metropolitana de Barcelona</b> (AMB) de 2 m de costat de cel·la generat a partir de la base lidar de l'<a href=\"https://geoportalcartografia.amb.cat/AppGeoportalCartografia2/?locale=ca&Categoria=Lidar&Producte=54\" target=\"_blank\" rel=\"noopener noreferrer\">AMB</a> amb densitat mínima de <b>4 punts/m²</b> (generada a partir de diferents vols entre 2011 i 2013), el <b>Model Digital d'Elevacions</b> de l'<a href=\"https://www.icgc.cat/ca/Dades-i-productes/Bessons-digitals-Elevacions/Model-delevacions-del-terreny-de-2x2-m\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a> de 2 m de resolució i altres bases de referència com els <a href=\"https://agricultura.gencat.cat/ca/serveis/cartografia-sig/bases-cartografiques/usos-sol-subsol/usos-sol/index.html\" target=\"_blank\" rel=\"noopener noreferrer\"><b>Mapes d'Usos i Cobertes del Sòl de Catalunya</b></a> (MUCSC) de la UAB-CREAF i l'ortofoto IRC 1:2500 (2012) de l'<a href=\"https://www.icgc.cat/ca/Geoinformacio-i-mapes/Geoinformacio-en-linia-Geoserveis/WMS-Ortoimatges/WMS-dOrtofoto-Territorial\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>. <br><br>Les dades corresponen majoritàriament als mesos de desembre, gener i febrer (99.2 %) i als anys 2012 (11.0 %) i 2013 (88.9 %).",
			spa:"<b>Modelo Digital de Alturas del Área Metropolitana de Barcelona</b> (AMB) de 2 m de lado de celda generado a partir de la base lidar del <a href=\"https://geoportalcartografia.amb.cat/AppGeoportalCartografia2/?locale=ca&Categoria=Lidar&Producte=54\" target=\"_blank\" rel=\"noopener noreferrer\">AMB</a> con densidad mínima de <b>4 puntos/m²</b> (generada a partir de diferentes vuelos entre 2011 y 2013), el <b>Modelo Digital de Elevaciones</b> del <a href=\"https://www.icgc.cat/ca/Dades-i-productes/Bessons-digitals-Elevacions/Model-delevacions-del-terreny-de-2x2-m\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a> de 2 m de resolución y otras bases de referencia como los <a href=\"https://agricultura.gencat.cat/ca/serveis/cartografia-sig/bases-cartografiques/usos-sol-subsol/usos-sol/index.html\" target=\"_blank\" rel=\"noopener noreferrer\"><b>Mapas de Usos y Cubiertas del Suelo de Cataluña</b></a> (MUCSC) de la UAB-CREAF y la ortofoto IRC 1:2500 (2012) del '<a href=\"https://www.icgc.cat/ca/Geoinformacio-i-mapes/Geoinformacio-en-linia-Geoserveis/WMS-Ortoimatges/WMS-dOrtofoto-Territorial\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>. <br><br>Los datos corresponden mayormente a los meses de diciembre, enero y febrero (99.2 %) y a los años 2012 (11.0 %) y 2013 (88.9 %)."
		})	
		
	if (document.getElementById("par_02"))
		document.getElementById("par_02").innerHTML=DonaCadenaJSON({
			eng:"The <b>DHM</b> is available for <b>download</b> in <a href=\"https://www.miramon.cat/new_note/news/MMZX/MMZXu.htm\" target=\"_blank\" rel=\"noopener noreferrer\"><b>MMZX</b></a> format (<a href=\"https://www.iso19165.org/\" target=\"_blank\" rel=\"noopener noreferrer\">ISO19165</a>) from <a href=\"https://www.miramon.cat/Index_eng.htm\" target=\"_blank\" rel=\"noopener noreferrer\">MiraMon</a>, as well as in <b>GeoTIFF</b> format (<a href=\"https://docs.ogc.org/is/19-008r4/19-008r4.html\" target=\"_blank\" rel=\"noopener noreferrer\">OGC standard</a>).",
			cat:"El <b>MDA</b> està disponible per <b>descàrrega</b> en format <a href=\"https://www.miramon.cat/new_note/news/MMZX/MMZX.htm\" target=\"_blank\" rel=\"noopener noreferrer\"><b>MMZX</b></a> (<a href=\"https://www.iso19165.org/\" target=\"_blank\" rel=\"noopener noreferrer\">ISO19165</a>) del <a href=\"https://www.miramon.cat/mus/cat/index.htm\" target=\"_blank\" rel=\"noopener noreferrer\">MiraMon</a>, així com en format <b>GeoTIFF</b> (<a href=\"https://docs.ogc.org/is/19-008r4/19-008r4.html\" target=\"_blank\" rel=\"noopener noreferrer\">estàndard OGC</a>).",
			spa:"El <b>MDA</b> está disponible para <b>descarga</b> en formato <a href=\"https://www.miramon.cat/new_note/news/MMZX/MMZXe.htm\" target=\"_blank\" rel=\"noopener noreferrer\"><b>MMZX</b></a> (<a href=\"https://www.iso19165.org/\" target=\"_blank\" rel=\"noopener noreferrer\">ISO19165</a>) del <a href=\"https://www.miramon.cat/Index_spa.htm\" target=\"_blank\" rel=\"noopener noreferrer\">MiraMon</a>, así como en formato <b>GeoTIFF</b> (<a href=\"https://docs.ogc.org/is/19-008r4/19-008r4.html\" target=\"_blank\" rel=\"noopener noreferrer\">estándar OGC</a>)."
		})
		
	if (document.getElementById("par_03"))
		document.getElementById("par_03").innerHTML=DonaCadenaJSON({
			eng:"Select download format:",
			cat:"Selecciona el format de descàrrega:",
			spa:"Selecciona el formato de descarga"
		})
		
	if (document.getElementById("par_04"))
		document.getElementById("par_04").innerHTML=DonaCadenaJSON({
			eng:"In case you use these data, please cite:<br><p class=\"cita\"><b>Pons, X., González-Guerrero, O., Masó, J., Zabala, A., Serral, I., & Ninyerola, M.</b> (2025). LidarTeam: a remote sensing driven method for massive lidar data to regional DHM refined through user feedback. <i>International Journal of Digital Earth, 18(2)</i>. <a href=\"https://doi.org/10.1080/17538947.2025.2562051\" target=\"_blank\" rel=\"noopener noreferrer\">https://doi.org/10.1080/17538947.2025.2562051</a></p>",
			cat:"En cas que useu aquestes dades, si us plau, citeu:<br><p class=\"cita\"><b>Pons, X., González-Guerrero, O., Masó, J., Zabala, A., Serral, I., & Ninyerola, M.</b> (2025). LidarTeam: a remote sensing driven method for massive lidar data to regional DHM refined through user feedback. <i>International Journal of Digital Earth, 18(2)</i>. <a href=\"https://doi.org/10.1080/17538947.2025.2562051\" target=\"_blank\" rel=\"noopener noreferrer\">https://doi.org/10.1080/17538947.2025.2562051</a></p>",
			spa:"En caso de que use estos datos, por favor, cite:<br><p class=\"cita\"><b>Pons, X., González-Guerrero, O., Masó, J., Zabala, A., Serral, I., & Ninyerola, M.</b> (2025). LidarTeam: a remote sensing driven method for massive lidar data to regional DHM refined through user feedback. <i>International Journal of Digital Earth, 18(2)</i>. <a href=\"https://doi.org/10.1080/17538947.2025.2562051\" target=\"_blank\" rel=\"noopener noreferrer\">https://doi.org/10.1080/17538947.2025.2562051</a></p>"
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