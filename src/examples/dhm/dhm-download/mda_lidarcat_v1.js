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
			eng:"Digital Height Model v.1 [2008-2012]",
			cat:"Model Digital d'Alçàries v.1 [2008-2012]",
			spa:"Model Digital de Alturas v.1 [2008-2012]"
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
			eng:"DHM lidarCat v.1.0 (2008-2012)",
			cat:"MDA lidarCat v.1.0 (2008-2012)",
			spa:"MDA lidarCat v.1.0 (2008-2012)"
		})	
		
	if (document.getElementById("par_01"))
		document.getElementById("par_01").innerHTML=DonaCadenaJSON({
			eng:"<b>Digital Height Model of Catalonia</b> generated from the first lidar coverage of <a href=\"https://www.icgc.cat/en/Geoinformation-and-Maps/Data-and-products/Bessons-digitals-Elevacions/Historical-LiDAR-data\"  target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a> with a density of <b>0.5 points/m²</b> (generated from various flights between 2008 and 2012), the 2-meter resolution <b>Digital Elevation Model</b> from <a href=\"https://www.icgc.cat/en/Data-and-products/Bessons-digitals-Elevacions/2x2-m-Terrain-elevation-model\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>, and other reference bases such as the <a href=\"https://agricultura.gencat.cat/ca/serveis/cartografia-sig/bases-cartografiques/usos-sol-subsol/usos-sol/index.html\" target=\"_blank\" rel=\"noopener noreferrer\"><b>Land Use and Cover Maps of Catalonia</b></a> (MUCSC) from UAB-CREAF and the <b>1:2500 CIR orthophoto</b> (2009) from <a href=\"https://www.icgc.cat/en/Geoinformation-and-Maps/Online-services-Geoservices/WMS-Orthoimages/WMS-Territorial-Orthophoto\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>. <br><br>The data mostly correspond to the months between March and August (88.4%), with May and June being the most abundant (28.5% and 14.8%, respectively). By year, 2009 contributes 43.6% of the data, followed by 2010 (28.1%), 2008 (15.3%), and 2011 (12.9%), with a very small contribution from data from 2012.",
			cat:"<b>Model Digital d'Alçàries de Catalunya</b> generat a partir de la primera cobertura lidar de l'<a href=\"https://www.icgc.cat/ca/Geoinformacio-i-mapes/Dades-i-productes/Bessons-digitals-Elevacions/Dades-historiques-LiDAR\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a> amb densitat de <b>0.5 punts/m²</b> (generada a partir de diferents vols entre 2008 i 2012), el <b>Model Digital d'Elevacions</b> de l'<a href=\"https://www.icgc.cat/ca/Dades-i-productes/Bessons-digitals-Elevacions/Model-delevacions-del-terreny-de-2x2-m\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a> de 2 m de resolució i altres bases de referència com els <a href=\"https://agricultura.gencat.cat/ca/serveis/cartografia-sig/bases-cartografiques/usos-sol-subsol/usos-sol/index.html\" target=\"_blank\" rel=\"noopener noreferrer\"><b>Mapes d'Usos i Cobertes del Sòl de Catalunya</b></a> (MUCSC) de la UAB-CREAF i <b>l'ortofoto IRC 1:2500</b> (2009) de l'<a href=\"https://www.icgc.cat/ca/Geoinformacio-i-mapes/Geoinformacio-en-linia-Geoserveis/WMS-Ortoimatges/WMS-dOrtofoto-Territorial\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>. <br><br>Les dades corresponen majoritàriament als mesos entre març i agost (88.4 %), sent les de maig i juny les més abundants (28.5 % i 14.8 % respectivament). Per anys, 2009 aporta el 43.6 % de les dades, seguit de 2010 (28.1 %), 2008 (15.3 %) i 2011 (12.9 %) i una aportació molt residual de dades de 2012.",
			spa:"<b>Modelo Digital de Alturas de Cataluña</b> generado a partir de la primera cobertura lidar del <a href=\"https://www.icgc.cat/es/Geoinformacion-y-mapas/Datos-y-productos/Bessons-digitals-Elevacions/Datos-historicos-LiDAR\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a> con densidad de <b>0.5 puntos/m²</b> (generada a partir de diferentes vuelos entre 2008 y 2012), el <b>Modelo Digital de Elevaciones</b> del <a href=\"https://www.icgc.cat/es/Datos-y-productos/Bessons-digitals-Elevacions/Modelo-de-elevaciones-del-terreno-de-2x2-m\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a> de 2 m de resolución y otras bases de referencia como los <a href=\"https://agricultura.gencat.cat/ca/serveis/cartografia-sig/bases-cartografiques/usos-sol-subsol/usos-sol/index.html\" target=\"_blank\" rel=\"noopener noreferrer\"><b>Mapas de Usos y Cubiertas del Suelo de Cataluña</b></a> (MUCSC) de la UAB-CREAF y la <b>ortofoto IRC 1:2500</b> (2009) del <a href=\"https://www.icgc.cat/es/Geoinformacion-y-mapas/Servicios-en-linea-Geoservicios/WMS-Ortoimatges/WMS-Ortofoto-Territorial\" target=\"_blank\" rel=\"noopener noreferrer\">ICGC</a>. <br><br>Los datos corresponden mayoritariamente a los meses entre marzo y agosto (88.4%), siendo los de mayo y junio los más abundantes (28.5% y 14.8% respectivamente). Por años, 2009 aporta el 43.6% de los datos, seguido de 2010 (28.1%), 2008 (15.3%) y 2011 (12.9%) y una aportación muy residual de datos de 2012."
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