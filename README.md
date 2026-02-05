# MiraMonMapBrowser

## Mission
The most popular map browsers available (e.g. Leaflet, OpenLayers) require you to call JavaScript libraries from your page. This assumes some knowledge of JavaScript. The MiraMon Map Browser is designed in a way that does not require the user to have any knowledge of coding. Instead, the JavaScript code interprets a config.json file that configures all aspects of the browser in a declarative way, including distribution of the elements in the screen as well as the list of data layers and services shown. The use of the MiraMon Map Browser is expected to edit the config.json only.

Our aim is to support as many OGC web services and OGA API standards as possible. The Map Browser can be used to present and analyze information coming from standard OGC web services from any vendor. However, we also experiment with extensions of the OGC standards, and this can be obtained by combining the Browser with the MiraMon Map Server CGI. The most significant example of extension that we promote is the use of WMS with binary arrays.

General information about the main functionalities of the map browser here: https://www.miramon.cat/ENG/Prod-NavegadorServidor.htm

## Code

The MiraMon Map Browser code can be found in the SRC folder. To test it, you can set a copy of the SRC folder in your web server folder (for example, in Windows IIS, folder in C:\inetpub\wwwroot\MiraMonMapBrowser). The landing page of the browser is called index.htm. 

The code of the MiraMon Map Browser can be used with no modification. However it requires a config.json file that configures the Map Browser behavior including the list of layers that can be shown and query. Since the config.json is specific of you deployment, the SRC folder does not contain a config.json file. This prevents accidental loss of your instance configuration when updating to a new version of the code. 

## How to create a config.json
One easy way to start a MiraMon Map Browser deployment, is to take one of the examples of config.json documents can be found in [the examples](src/examples) folder and copying the selected one to the root of your deployment as "config.json". You can also copy the folder containing the images (folder ending with "-img") one level down.

You can request a Windows application called Adm_MMN.exe (that is part of the MiraMon products) to edit some parts of config.json in a user friendly way by sending a request to suport@miramon.uab.cat (unfortunately this application does not allow configuring the more recent functionalities).

To know the meaning of all keys in the config.json data model, you can open de config schema [json schema file](src/config-schema.json) and read the descriptions of the objects and keys. The config schema can also be used to semantically validate the config.json

It is also possible to load a different config file (with a different name) by calling the landing page of the MiraMon Map Browser with the `config` extra parameter: index.htm?config={name-config.json}

## Evolution
Commit descriptions provide information about updates and corrections not listed here.

## Attribution
The MiraMon Map Browser is part of the MiraMon project managed by CREAF.

More information about this product can be found in the [MiraMon website](https://www.miramon.cat/ENG/Prod-NavegadorServidor.htm#MiraMonMapBrowser) with some [examples of applications](https://www.miramon.cat/ENG/Servidors.htm)

## License
The code is distributed under the GNU AFFERO GENERAL PUBLIC LICENSE. We encourage reuse of our code. We will appreciate a reference in the acknowledgements of any modified code.

## Publications
Masó J., Zabala A., Pons X. (2020) Protected Areas from Space Map Browser with Fast Visualization and Analytical Operations on the Fly. Characterizing Statistical Uncertainties and Balancing Them with Visual Perception . ISPRS International Journal of Geo-Information. Vol.9 (5), Article Id: 300. DOI: 10.3390/ijgi9050300 . In Internet: https://www.mdpi.com/2220-9964/9/5/300/pdf

## Demo guide
Catalan Data Cube: https://www.datacube.cat/cdc/
* Create RGB combinations as well as band indices from raw images directly
* Dynamic histograms of NDVI (in Sentinel-2 NDVI 22-05-2022 you can compare histograms viewing and without see and the change in NDVI on 17-01-2022)
* Create new indices and RGB compositions.

Catalan Data Cube with COG: https://www.datacube.cat/cdc-cog/
* Illustrate that the same capacities are possible with COG format.
* Show the possibility to load a local TIFF or GeoJSON

ECOPotential: http://maps.ecopotential-project.eu/
*	In Swiss National Park filter the landcover by the park border.
*	Compare pies with and without the border filter
*	Geospatial user feedback in canopy height in Swiss National Park

LidarCAT: https://lidarteam.grumets.cat/maps/?BBOX=436625.67982456135,4605133.216867469,439595.67982456135,4606339.216867469
*	Create a difference of heights between two times,
*	Change to rainbow palette,
*	Visually detect some spot with square shape in the metropolitan area; see a building to appear.

RutesMaresme: https://www.ogc.grumets.cat/rutesmaresme/
*	Capability to generate profiles from routes (query by location)
*	Capability of automatic creation of shadows from DEM data.

BESTMAP: http://www.ogc.grumets.cat/bestmap/
* Story maps (FSA distribution for Mulde CS story generates an histogram) (work in progress)
