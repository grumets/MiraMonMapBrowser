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

    Copyright 2001, 2024 Xavier Pons

    Aquest codi JavaScript ha estat idea de Joan Masó Pau (joan maso at uab cat)
    i de Núria Julià (n julia at creaf uab cat)
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

var WellKnownTMS=[
	{
		id: "WorldCRS84Quad",
		title: "CRS84 for the World",
		uri: "http://www.opengis.net/def/tilematrixset/OGC/1.0/WorldCRS84Quad",
		crs: "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
		orderedAxes: [ "Lon", "Lat" ],
		wellKnownScaleSet: "http://www.opengis.net/def/wkss/OGC/1.0/GoogleCRS84Quad",
		tileMatrices: [
			{ id: "0", scaleDenominator: 279541132.014358, cellSize: 0.703125, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 2, matrixHeight: 1 },
			{ id: "1", scaleDenominator: 139770566.007179, cellSize: 0.3515625, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 4, matrixHeight: 2 },
			{ id: "2", scaleDenominator: 69885283.0035897, cellSize: 0.17578125, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 8, matrixHeight: 4 },
			{ id: "3", scaleDenominator: 34942641.5017948, cellSize: 0.087890625, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 16, matrixHeight: 8 },
			{ id: "4", scaleDenominator: 17471320.7508974, cellSize: 0.0439453125, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 32, matrixHeight: 16 },
			{ id: "5", scaleDenominator: 8735660.37544871, cellSize: 0.02197265625, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 64, matrixHeight: 32 },
			{ id: "6", scaleDenominator: 4367830.18772435, cellSize: 0.010986328125, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 128, matrixHeight: 64 },
			{ id: "7", scaleDenominator: 2183915.09386217, cellSize: 0.0054931640625, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 256, matrixHeight: 128 },
			{ id: "8", scaleDenominator: 1091957.54693108, cellSize: 0.00274658203125, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 512, matrixHeight: 256 },
			{ id: "9", scaleDenominator: 545978.773465544, cellSize: 0.001373291015625, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 1024, matrixHeight: 512 },
			{ id: "10", scaleDenominator: 272989.386732772, cellSize: 0.0006866455078125, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 2048, matrixHeight: 1024 },
			{ id: "11", scaleDenominator: 136494.693366386, cellSize: 0.00034332275390625, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 4096, matrixHeight: 2048 },
			{ id: "12", scaleDenominator: 68247.346683193, cellSize: 0.000171661376953125, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 8192, matrixHeight: 4096 },
			{ id: "13", scaleDenominator: 34123.6733415964, cellSize: 0.0000858306884765625, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 16384, matrixHeight: 8192 },
			{ id: "14", scaleDenominator: 17061.8366707982, cellSize: 0.0000429153442382812, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 32768, matrixHeight: 16384 },
			{ id: "15", scaleDenominator: 8530.91833539913, cellSize: 0.0000214576721191406, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 65536, matrixHeight: 32768 },
			{ id: "16", scaleDenominator: 4265.45916769956, cellSize: 0.0000107288360595703, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 131072, matrixHeight: 65536 },
			{ id: "17", scaleDenominator: 2132.72958384978, cellSize: 0.00000536441802978515, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 262144, matrixHeight: 131072 },
			{ id: "18", scaleDenominator: 1066.36479192489, cellSize: 0.00000268220901489258, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 524288, matrixHeight: 262144 },
			{ id: "19", scaleDenominator: 533.182395962445, cellSize: 0.00000134110450744629, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 1048576, matrixHeight: 524288 },
			{ id: "20", scaleDenominator: 266.591197981222, cellSize: 0.00000067055225372314, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 2097152, matrixHeight: 1048576 },
			{ id: "21", scaleDenominator: 133.295598990611, cellSize: 0.00000033527612686157, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 4194304, matrixHeight: 2097152 },
			{ id: "22", scaleDenominator: 66.6477994953056, cellSize: 0.00000016763806343079, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 8388608, matrixHeight: 4194304 },
			{ id: "23", scaleDenominator: 33.3238997476528, cellSize: 0.00000008381903171539, pointOfOrigin: [ -180, 90 ], tileWidth: 256, tileHeight: 256, matrixWidth: 16777216, matrixHeight: 8388608 }
		]
	},
	{
		id: "WebMercatorQuad",
		title: "Google Maps Compatible for the World",
		uri: "http://www.opengis.net/def/tilematrixset/OGC/1.0/WebMercatorQuad",
		crs: "http://www.opengis.net/def/crs/EPSG/0/3857",
		orderedAxes: ["X", "Y"],
		wellKnownScaleSet: "http://www.opengis.net/def/wkss/OGC/1.0/GoogleMapsCompatible",
		tileMatrices:
		[
			{ id: "0", scaleDenominator: 559082264.028717, cellSize: 156543.033928041, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 1, matrixHeight: 1 },
			{ id: "1", scaleDenominator: 279541132.014358, cellSize: 78271.5169640204, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 2, matrixHeight: 2 },
			{ id: "2", scaleDenominator: 139770566.007179, cellSize: 39135.7584820102, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 4, matrixHeight: 4 },
			{ id: "3", scaleDenominator: 69885283.0035897, cellSize: 19567.8792410051, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 8, matrixHeight: 8 },
			{ id: "4", scaleDenominator: 34942641.5017948, cellSize: 9783.93962050256, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 16, matrixHeight: 16 },
			{ id: "5", scaleDenominator: 17471320.7508974, cellSize: 4891.96981025128, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 32, matrixHeight: 32 },
			{ id: "6", scaleDenominator: 8735660.37544871, cellSize: 2445.98490512564, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 64, matrixHeight: 64 },
			{ id: "7", scaleDenominator: 4367830.18772435, cellSize: 1222.99245256282, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 128, matrixHeight: 128 },
			{ id: "8", scaleDenominator: 2183915.09386217, cellSize: 611.49622628141, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 256, matrixHeight: 256 },
			{ id: "9", scaleDenominator: 1091957.54693108, cellSize: 305.748113140704, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 512, matrixHeight: 512 },
			{ id: "10", scaleDenominator: 545978.773465544, cellSize: 152.874056570352, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 1024, matrixHeight: 1024 },
			{ id: "11", scaleDenominator: 272989.386732772, cellSize: 76.4370282851762, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 2048, matrixHeight: 2048 },
			{ id: "12", scaleDenominator: 136494.693366386, cellSize: 38.2185141425881, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 4096, matrixHeight: 4096 },
			{ id: "13", scaleDenominator: 68247.346683193, cellSize: 19.109257071294, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 8192, matrixHeight: 8192 },
			{ id: "14", scaleDenominator: 34123.6733415964, cellSize: 9.55462853564703, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 16384, matrixHeight: 16384 },
			{ id: "15", scaleDenominator: 17061.8366707982, cellSize: 4.77731426782351, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 32768, matrixHeight: 32768 },
			{ id: "16", scaleDenominator: 8530.91833539913, cellSize: 2.38865713391175, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 65536, matrixHeight: 65536 },
			{ id: "17", scaleDenominator: 4265.45916769956, cellSize: 1.19432856695587, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 131072, matrixHeight: 131072 },
			{ id: "18", scaleDenominator: 2132.72958384978, cellSize: 0.597164283477939, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 262144, matrixHeight: 262144 },
			{ id: "19", scaleDenominator: 1066.36479192489, cellSize: 0.29858214173897, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 524288, matrixHeight: 524288 },
			{ id: "20", scaleDenominator: 533.182395962445, cellSize: 0.149291070869485, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 1048576, matrixHeight: 1048576 },
			{ id: "21", scaleDenominator: 266.591197981222, cellSize: 0.0746455354347424, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 2097152, matrixHeight: 2097152 },
			{ id: "22", scaleDenominator: 133.295598990611, cellSize: 0.0373227677173712, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 4194304, matrixHeight: 4194304 },
			{ id: "23", scaleDenominator: 66.6477994953056, cellSize: 0.0186613838586856, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 8388608, matrixHeight: 8388608 },
			{ id: "24", scaleDenominator: 33.3238997476528, cellSize: 0.0093306919293428, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 16777216, matrixHeight: 16777216 }
		]
	},
	{
		id: "WorldMercatorWGS84Quad",
		title: "World Mercator WGS84 (ellipsoid)",
		uri: "http://www.opengis.net/def/tilematrixset/OGC/1.0/WorldMercatorWGS84Quad",
		crs: "http://www.opengis.net/def/crs/EPSG/0/3395",
		orderedAxes: ["E", "N"],
		wellKnownScaleSet: "http://www.opengis.net/def/wkss/OGC/1.0/WorldMercatorWGS84",
		tileMatrices:
		[
			{ id: "0", scaleDenominator: 559082264.028717, cellSize: 156543.033928041, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 1, matrixHeight: 1 },
			{ id: "1", scaleDenominator: 279541132.014358, cellSize: 78271.5169640204, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 2, matrixHeight: 2 },
			{ id: "2", scaleDenominator: 139770566.007179, cellSize: 39135.7584820102, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 4, matrixHeight: 4 },
			{ id: "3", scaleDenominator: 69885283.0035897, cellSize: 19567.8792410051, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 8, matrixHeight: 8 },
			{ id: "4", scaleDenominator: 34942641.5017948, cellSize: 9783.93962050256, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 16, matrixHeight: 16 },
			{ id: "5", scaleDenominator: 17471320.7508974, cellSize: 4891.96981025128, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 32, matrixHeight: 32 },
			{ id: "6", scaleDenominator: 8735660.37544871, cellSize: 2445.98490512564, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 64, matrixHeight: 64 },
			{ id: "7", scaleDenominator: 4367830.18772435, cellSize: 1222.99245256282, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 128, matrixHeight: 128 },
			{ id: "8", scaleDenominator: 2183915.09386217, cellSize: 611.49622628141, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 256, matrixHeight: 256 },
			{ id: "9", scaleDenominator: 1091957.54693108, cellSize: 305.748113140704, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 512, matrixHeight: 512 },
			{ id: "10", scaleDenominator: 545978.773465544, cellSize: 152.874056570352, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 1024, matrixHeight: 1024 },
			{ id: "11", scaleDenominator: 272989.386732772, cellSize: 76.4370282851762, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 2048, matrixHeight: 2048 },
			{ id: "12", scaleDenominator: 136494.693366386, cellSize: 38.2185141425881, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 4096, matrixHeight: 4096 },
			{ id: "13", scaleDenominator: 68247.346683193, cellSize: 19.109257071294, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 8192, matrixHeight: 8192 },
			{ id: "14", scaleDenominator: 34123.6733415964, cellSize: 9.55462853564703, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 16384, matrixHeight: 16384 },
			{ id: "15", scaleDenominator: 17061.8366707982, cellSize: 4.77731426782351, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 32768, matrixHeight: 32768 },
			{ id: "16", scaleDenominator: 8530.91833539913, cellSize: 2.38865713391175, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 65536, matrixHeight: 65536 },
			{ id: "17", scaleDenominator: 4265.45916769956, cellSize: 1.19432856695587, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 131072, matrixHeight: 131072 },
			{ id: "18", scaleDenominator: 2132.72958384978, cellSize: 0.597164283477939, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 262144, matrixHeight: 262144 },
			{ id: "19", scaleDenominator: 1066.36479192489, cellSize: 0.29858214173897, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 524288, matrixHeight: 524288 },
			{ id: "20", scaleDenominator: 533.182395962445, cellSize: 0.149291070869485, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 1048576, matrixHeight: 1048576 },
			{ id: "21", scaleDenominator: 266.591197981222, cellSize: 0.0746455354347424, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 2097152, matrixHeight: 2097152 },
			{ id: "22", scaleDenominator: 133.295598990611, cellSize: 0.0373227677173712, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 4194304, matrixHeight: 4194304 },
			{ id: "23", scaleDenominator: 66.6477994953056, cellSize: 0.0186613838586856, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 8388608, matrixHeight: 8388608 },
			{ id: "24", scaleDenominator: 33.3238997476528, cellSize: 0.0093306919293428, pointOfOrigin: [-20037508.3427892,20037508.3427892], tileWidth: 256, tileHeight: 256, matrixWidth: 16777216, matrixHeight: 16777216 }
		]
	},
	{
		id: "EuropeanETRS89_LAEAQuad",
		title: "Lambert Azimuthal Equal Area ETRS89 for Europe",
		uri: "http://www.opengis.net/def/tilematrixset/OGC/1.0/EuropeanETRS89_LAEAQuad",
		crs: "http://www.opengis.net/def/crs/EPSG/0/3035",
		orderedAxes: [ "Y", "X" ],
		tileMatrices:
		[
			{ id: "0", scaleDenominator: 62779017.8571428, cellSize: 17578.125, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 1, matrixHeight: 1 },
			{ id: "1", scaleDenominator: 31389508.9285714, cellSize: 8789.0625, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 2, matrixHeight: 2 },
			{ id: "2", scaleDenominator: 15694754.4642857, cellSize: 4394.53125, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 4, matrixHeight: 4 },
			{ id: "3", scaleDenominator: 7847377.23214285, cellSize: 2197.265625, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 8, matrixHeight: 8 },
			{ id: "4", scaleDenominator: 3923688.61607142, cellSize: 1098.6328125, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 16, matrixHeight: 16 },
			{ id: "5", scaleDenominator: 1961844.30803571, cellSize: 549.31640625, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 32, matrixHeight: 32 },
			{ id: "6", scaleDenominator: 980922.154017857, cellSize: 274.658203125, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 64, matrixHeight: 64 },
			{ id: "7", scaleDenominator: 490461.077008928, cellSize: 137.3291015625, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 128, matrixHeight: 128 },
			{ id: "8", scaleDenominator: 245230.538504464, cellSize: 68.6645507812, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 256, matrixHeight: 256 },
			{ id: "9", scaleDenominator: 122615.269252232, cellSize: 34.3322753906, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 512, matrixHeight: 512 },
			{ id: "10", scaleDenominator: 61307.634626116, cellSize: 17.1661376953, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 1024, matrixHeight: 1024 },
			{ id: "11", scaleDenominator: 30653.817313058, cellSize: 8.5830688477, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 2048, matrixHeight: 2048 },
			{ id: "12", scaleDenominator: 15326.908656529, cellSize: 4.2915344238, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 4096, matrixHeight: 4096 },
			{ id: "13", scaleDenominator: 7663.45432826451, cellSize: 2.1457672119, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 8192, matrixHeight: 8192 },
			{ id: "14", scaleDenominator: 3831.72716413225, cellSize: 1.072883606, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 16384, matrixHeight: 16384 },
			{ id: "15", scaleDenominator: 1915.86358206612, cellSize: 0.536441803, pointOfOrigin: [5500000.0, 2000000.0], tileWidth: 256, tileHeight: 256, matrixWidth: 32768, matrixHeight: 32768 }
		]
	},
	{
	   "id": "UTM31WGS84Quad",
	   "title": "Universal Transverse Mercator Zone 31 WGS84 Quad",
	   "uri": "http://www.opengis.net/def/tilematrixset/OGC/1.0/UTM31WGS84Quad",
	   "crs": "http://www.opengis.net/def/crs/EPSG/0/32631",
	   "orderedAxes": ["E", "N"],
	   "tileMatrices":
	   [
			{ "id": "1", "scaleDenominator": 279072704.500914, "cellSize": 78140.3572602559, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 1, "matrixHeight": 2 },
			{ "id": "2", "scaleDenominator": 139536352.250457, "cellSize": 39070.178630128, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 2,  "matrixHeight": 4 },
			{ "id": "3", "scaleDenominator": 69768176.1252285, "cellSize": 19535.089315064, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 4, "matrixHeight": 8 },
			{ "id": "4", "scaleDenominator": 34884088.0626143, "cellSize": 9767.5446575319, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 8, "matrixHeight": 16 },
			{ "id": "5", "scaleDenominator": 17442044.0313071, "cellSize": 4883.772328766, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 16, "matrixHeight": 32 },
			{ "id": "6", "scaleDenominator": 8721022.01565356, "cellSize": 2441.886164383, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 32, "matrixHeight": 64 },
			{ "id": "7", "scaleDenominator": 4360511.00782678, "cellSize": 1220.9430821915, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 64, "matrixHeight": 128 },
			{ "id": "8", "scaleDenominator": 2180255.50391339, "cellSize": 610.471541095749, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 128, "matrixHeight": 256 },
			{ "id": "9", "scaleDenominator": 1090127.7519567, "cellSize": 305.235770547875, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 256, "matrixHeight": 512 },
			{ "id": "10", "scaleDenominator": 545063.875978348, "cellSize": 152.617885273937, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 512, "matrixHeight": 1024 },
			{ "id": "11", "scaleDenominator": 272531.937989174, "cellSize": 76.3089426369687, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 1024, "matrixHeight": 2048 },
			{ "id": "12", "scaleDenominator": 136265.968994587, "cellSize": 38.1544713184843, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 2048, "matrixHeight": 4096 },
			{ "id": "13", "scaleDenominator": 68132.9844972935, "cellSize": 19.0772356592422, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 4096, "matrixHeight": 8192 },
			{ "id": "14", "scaleDenominator": 34066.4922486467, "cellSize": 9.53861782962109, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 8192, "matrixHeight": 16384 },
			{ "id": "15", "scaleDenominator": 17033.2461243234, "cellSize": 4.76930891481054, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 16384, "matrixHeight": 32768 },
			{ "id": "16", "scaleDenominator": 8516.62306216168, "cellSize": 2.38465445740527, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 32768, "matrixHeight": 65536 },
			{ "id": "17", "scaleDenominator": 4258.31153108084, "cellSize": 1.19232722870264, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 65536, "matrixHeight": 131072 },
			{ "id": "18", "scaleDenominator": 2129.15576554042, "cellSize": 0.596163614351318, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 131072, "matrixHeight": 262144 },
			{ "id": "19", "scaleDenominator": 1064.57788277021, "cellSize": 0.298081807175659, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 262144, "matrixHeight": 524288 },
			{ "id": "20", "scaleDenominator": 532.288941385105, "cellSize": 0.149040903587829, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 524288, "matrixHeight": 1048576 },
			{ "id": "21", "scaleDenominator": 266.144470692553, "cellSize": 0.0745204517939147, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 1048576, "matrixHeight": 2097152 },
			{ "id": "22", "scaleDenominator": 133.072235346276, "cellSize": 0.0372602258969574, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 2097152, "matrixHeight": 4194304 },
			{ "id": "23", "scaleDenominator": 66.5361176731382, "cellSize": 0.0186301129484787, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 4194304, "matrixHeight": 8388608 },
			{ "id": "24", "scaleDenominator": 33.2680588365691, "cellSize": 0.00931505647423934, "pointOfOrigin": [-9501965.72931276,20003931.4586255], "tileWidth": 256, "tileHeight": 256, "matrixWidth": 8388608, "matrixHeight": 16777216  }
		]
	}
];
