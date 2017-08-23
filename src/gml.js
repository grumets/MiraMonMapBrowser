/* 
    This file is part of MiraMon Map Browser.
    MiraMon Map Browser is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Foobar is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with MiraMon Map Browser.  If not, see "http://www.gnu.org/licenses/".

    Copyright 2001, 2016 Xavier Pons

    Aquest codi JavaScript ha estat realitzat per Joan Masó Pau 
    (joan maso at uab cat) i Nuria Julià (n julia at creaf uab cat) i
    Daniel Díaz (d diaz at creaf uab cat) dins del grup de MiraMon. 
    MiraMon és un projecte del Centre de recerca i aplicacions forestals (CREAF) 
    que elabora programari de Sistema d'Informació Geogràfica i de Teledetecció 
    per a la visualització, consulta, edició i anàlisi de mapes ràsters i 
    vectorials. Elabora programari d'escriptori i també servidors i clients 
    per Internet. No tots aquests productes són gratuïts o de codi obert. 
    En particular, el Navegador de Mapes del MiraMon (client per Internet) 
    es distribueix sota els termes de la llicència "GNU General Public 
    License". Es pot actualitzar des de www.creaf.uab.cat/miramon/mmn
*/

/* 
 * Daniel Díaz Benito 18-XII-2012
 * Gml object that supports loading GeoRSS.
 * In the beginning it only supports Point and Envelope.
 * 
 * All the functions implemented over Gml members will be better implemented
 * over Class prototypes, but that is not yet supported by IE8 (they will
 * not require to be added to all instances).
 */


/* Gml Object (shall be moved to an independent file?) */
function Gml(xArray,yArray) //,zCoord) not required for now
{
	if(this===window)
		throw "Oops! Using Gml() constructor in a wrong way.";
	var myself= this; //Required for referencing inside methods

	if(xArray || yArray)
	{
		var i=xArray.length;
		
		if(i===4 && !yArray)
		{
			//We are creating an Envelope Gml object
			myself.type= 3;
			//The array order must be the same as for BBOX web
			//services parameter: minX,maxX,minY,maxY
			myself.lowerCorner= new Gml([xArray[0]],[xArray[2]]);
			myself.upperCorner= new Gml([xArray[1]],[xArray[3]]);
			/*
			 * Allows the object setCRS function to automatically propagate
			 * the CRS change to the Box members.
			 */
			myself.propagateCRS= function () {
				this.lowerCorner.setCRS(this.CRS.name);
				this.upperCorner.setCRS(this.CRS.name);
			};
		}
		else if(i===yArray.length)
		{
			//Number of coordinates===number of points, which
			//determines type of Gml object.
			switch(i)
			{
				case 0:
					throw "Coordinates must be provided in an array of numbers."
				case 1:
					myself.type= 0;
					myself.x= xArray[0];
					myself.y= yArray[0];
					myself.toMMPoint2D= function() { return {"x": this.x, "y": this.y}; };
					break;
				case 2: //Line
				default: //Polygon
					throw "Only Points and bounding boxes are currently implemented."
			}
		}
		else
			throw "Same amount of X (l="+i+") and Y (l="+yArray.length+") coordinates must be provided.";
	}
	else
		myself.type= null; //point:0, line:1, polygon:2, box:3

	/*Gml data structures*/
	myself.CRS= { name: null, dimensions: 2, units: "?" }; //Coordinate Reference System
	
	/* Gml methods */
	myself.setCRS= function(name) {
		if(name!==this.CRS.name)
		{
			this.CRS.name= name.toUpperCase();
			this.CRS.units= DonaUnitatsCoordenadesProj(name);
			if(this.propagateCRS)
				this.propagateCRS();
		}
	};
	myself.CRS.getDescription= function() {
		var crs= DonaDescripcioCRS(this.name);
		if(crs==="")
			return this.name;
		else
			return crs;
	};

	myself.toString= function() {
		if(!this.type)
			return "[object Gml("+this.x+" "+this.y+")]";
		else if(this.type===3)
			return "[object Gml(low:"+this.lowerCorner.x+" "+this.lowerCorner.y+" upp:"+this.upperCorner.x+" "+this.upperCorner.y+")]";
		else
			return "[object Gml(type:"+this.type+")]";
	};
	/*
	 * Converts the Gml object to GeoRSSGml format and add the corresponding
	 * tags to the 'parent' element existant in the 'xmlobject' document.
	 * @param {XMLDocument} xmlobject
	 * @param {XMLElement} parent
	 */
	myself.addToGeoRSS= function(xmlobject,parent) {
		if(this.type!==3)
			throw "GeoRSS of Gml objects different than Envelope not implemented.";
		
		parent= MMaddElement(xmlobject,parent,"gml:Envelope");
		//Add CRS attributes
		parent.setAttribute("srsName",this.CRS.name);
		parent.setAttribute("srsDimension",this.CRS.dimensions);
		MMaddElement(xmlobject,parent,"gml:lowerCorner",this.lowerCorner.x+" "+this.lowerCorner.y); //,"http://www.opengis.net/gml"); added in the file header
		MMaddElement(xmlobject,parent,"gml:upperCorner",this.upperCorner.x+" "+this.upperCorner.y); //,"http://www.opengis.net/gml");
	};
	//Given a GeoRSSGML tag, create a Gml object
	//myself.loadGmlTag= loadGmlTag;
}
//In order of this function to be able to create new Gml objects, it requires to be defined outside the Gml object
function loadGmlTag(gmlTag)
{
	var elem,i,
		myGml, //Gml object returned by the function
		nameCRS;
	
	/*
	 * This function loads the attribute srsName in a Tag, which represents a
	 * valid CRS, and set the CRS of the Gml object to that one.
	 * @param {XMLElement} gmlTag
	 * @param {string} noDefault, don't change the CRS if none is found 
	 */
	var loadSrsName= function(gmlTag,noDefault)
	{
		//Load the Coordinate Reference System
		var elem= gmlTag.attributes.getNamedItem("srsName");

		if(!elem || !elem.value)
		{
			if(!noDefault)
				return "EPSG:4326"; //GeoRSSGML Standard defined default value
			else
				return null;
		}
		else
			return elem.value; //Maybe we should check if it is a known CRS
	};

	//Try to load the CRS in this tag (otherwise would be in the posList)
	nameCRS= loadSrsName(gmlTag);

	switch(gmlTag.nodeName)
	{
		case "gml:Point":
		case "Point":
			myGml.type= 0;
			break;
		case "gml:LineString":
		case "LineString":
			myGml.type= 1;
			break;
		case "gml:Polygon":
		case "Polygon":
			myGml= new Gml();
			myGml.type= 2;
			myGml.setCRS(nameCRS);
			
			//Process the childnodes until finding the posList of the
			//exterior of the polygon.
			elem=DonamElementsNodeAPartirDelNomDelTag(gmlTag, null, "gml", "exterior");
			//elem= DonamElementsNodeAPartirDelNomDelTag(elem[0], null, "gml","LinearRing"); Can be jumped...
			elem= DonamElementsNodeAPartirDelNomDelTag(elem[0], null, "gml", "posList");

			//Try to load the CRS from the posList
			nameCRS= loadSrsName(elem[0],true);
			if(nameCRS)
				myGml.setCRS(nameCRS);

			//Get the points coordinates
			var pStr= elem[0].firstChild.nodeValue.split(" "),
				isYXFormat= CalGirarCoordenades(myGml.CRS.name,null);
			//Generate the points array
			myGml.vertexs= [];
			//Create a MMPoint2D for each XY pair and add it to the array
			for(i=0;i<pStr.length;i+=2)
			{
				if(isYXFormat)
					myGml.vertexs[i/2]= {"x": parseFloat(pStr[i+1]), "y": parseFloat(pStr[i])};
				else
					myGml.vertexs[i/2]= {"x": parseFloat(pStr[i]), "y": parseFloat(pStr[i+1])};
			}
		
			/* Add polygon specific methods */
			myGml.toGmlBox= function() {
				var newGml,
					minX=this.vertexs[0].x,maxX=this.vertexs[0].x,
					minY=this.vertexs[0].y,maxY=this.vertexs[0].y;

				//Find the min and max X
				for(i=1;i<this.vertexs.length;i++)
				{
					if(minX>this.vertexs[i].x)
						minX= this.vertexs[i].x;
					else if(maxX<this.vertexs[i].x)
						maxX= this.vertexs[i].x;
					if(minY>this.vertexs[i].y)
						minY= this.vertexs[i].y;
					else if(maxY<this.vertexs[i].y)
						maxY= this.vertexs[i].y;
				}
				newGml= new Gml([minX,maxX,minY,maxY]);
				//And CRS
				newGml.setCRS(this.CRS.name);

				return newGml;
			};
			break;
		case "BoundingBox":
		case "gml:Envelope":
		case "Envelope":
			var coordArray= [];
			
			elem=DonamElementsNodeAPartirDelNomDelTag(gmlTag, null, "gml", "lowerCorner");
			elem= elem[0].firstChild.nodeValue.split(" ");
			coordArray[0]= parseFloat(elem[0]);
			coordArray[2]= parseFloat(elem[1]);
			elem=DonamElementsNodeAPartirDelNomDelTag(gmlTag, null, "gml", "upperCorner");
			elem= elem[0].firstChild.nodeValue.split(" ");
			coordArray[1]= parseFloat(elem[0]);
			coordArray[3]= parseFloat(elem[1]);
			
			//Build-up a Gml Envelope from the array coordinate
			myGml= new Gml(coordArray);
			myGml.setCRS(nameCRS);
			break;
	}
	return myGml;
}
//Creates a Gml objects array from a GeoRSS tag
function loadGeoRSSTag(geoTag)
{
	var elem= geoTag.firstChild,
		gmlCollection= [],
		myGml;
	while(elem)
	{
		//Cal assegurar que el node actual no sigui de tipus text
		if(elem.nodeType!==3) //IE still do not support this: window.Node.TEXT_NODE)
		{
			//Create a new Gml object from the current tag
			myGml= loadGmlTag(elem);
			//Save the object created into the collection
			gmlCollection[gmlCollection.length]= myGml;
		}
		elem= elem.nextSibling;
	}
	return gmlCollection;
}
/* End of Gml Object */


//Returns a Bounding Box Gml object representing the same extent.
//@returns {Gml}
function EnvolupantToGml(env)
{
var myGml= new Gml([env.MinX,env.MaxX,env.MinY,env.MaxY]);

	//Set the CRS
	myGml.setCRS(ParamCtrl.ImatgeSituacio[ParamInternCtrl.ISituacio].EnvTotal.CRS);
	return myGml;
};
