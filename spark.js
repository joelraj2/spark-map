function addPopUp(feature, layer){
	var popupTxt = "Hi it's joel";
	var osmURL = ""

	// does this feature have a property named id?
	if (feature.properties && feature.properties['@id']) {
		// Excellent! We can now link directly to the feature
		featureID = feature.properties['@id'];
		osmURL = `https://www.openstreetmap.org/${featureID}`
		popupTxt = `<b>OSM ${featureID.split('/')[0]} ID: ${featureID.split('/')[1]}</b>`;
	} else if (feature.properties && feature.properties['id']) {
		// Excellent! We can now link directly to the feature
		featureID = feature.properties['id'];
		osmURL = `https://www.openstreetmap.org/${featureID}`
		popupTxt = `<b>OSM ${featureID.split('/')[0]} ID: ${featureID.split('/')[1]}</b>`;
	} else if (feature.properties && feature.geometry.coordinates) {
		// Since we don't have the ID, let's try for the centroid of the feature
		var centroid;
		if (feature.geometry.type === 'Polygon') {
			centroid = turf.centroid(feature).geometry.coordinates;
		}
		osmURL = `https://www.openstreetmap.org/edit/#map=${map.getZoom()}/${centroid[0]}/${centroid[0]}`;
	}

	// Try to get the name of the feature
	if (feature.properties && feature.properties.name) {
		popupTxt = `<b>${feature.properties.name}</b>`;
	}


	if (osmURL != "") {
		popupTxt += `</br></br>Hi it's Joel - see this on <a target="_blank" href=${osmURL}>OSM</a>!`
	}
	layer.bindPopup(popupTxt);
}

function addStyle(feature, layer){
if (feature.properties.building) {
switch (feature.properties.building){
	case 'apartments':
		return apartmentsStyle;
		break;

		case 'school':
		return schoolStyle;
		break;

		case 'garage':
		return garagesStyle;
		break;

		case 'garages':
		return garagesStyle;
		break;

		case 'apartments':
		return apartmentsStyle;
		break;
		
		default:
		return otherStyle;
		break;
}
}
	 else if (feature.properties.footway){
	switch (feature.properties.footway) {
		case 'sidewalk':
		return sidewalkStyle;
		break;
			
		default:
		return otherStyle;
		break;
}
}
else if (feature.properties.building == 'residential') {return residentialStyle}	
else if (feature.properties.building == 'service') {return serviceStyle}
else {return buildingsStyle}
} else {
return otherStyle
}
	
	
	
if (feature.properties.highway){
if (feature.properties.highway == 'railway') {return railwayStyle}
else {return OwaysStyle}
}
else {
return otherStyle
}

}

function addGJLayer(GJson) {
// Add buildings layer
var newLayer = L.geoJSON(null, {
	style: addStyle,
	onEachFeature: function(feature, layer) {
		addPopUp(feature,layer);
	}
});

$.getJSON(GJson, function(data){
	newLayer.addData(data).addTo(map);
});

return newLayer;
}

function getXML(query, lyrControl){
var output = "";
$.ajax({
type: "GET",
url: query,
dataType: "xml",

error: function (e) {
	alert("A " + e.status + " error occurred while processing your request! The error is: " + e.statusText + ".")
	console.log("XML reading Failed: ", e);
},

success: function (response) {
	output = response;
	var overpassGJ = osmtogeojson(response);
	if(overpassGJ.features.length == 0) {
		alert("Your query did not return any results!")
	} else {
		var newLayer = L.geoJSON(overpassGJ, {
			style: addStyle,
			onEachFeature: function(feature, layer) {
				addPopUp(feature, layer);
			}
		}).addTo(map);

		/* If using gjLayerGroup, clear layers before adding the new one */
		//lyrControl.clearLayers();
		//lyrControl.addLayer(newLayer);

		/* If adding the layer to the map, be sure to give it a name! */
		
		lyrControl.addOverlay(newLayer, "Overpass Query");
		alert("Your layer has been added to the map!");
	}
}
});
}


var sidewalkStyle = {
color: "#F4F6F7", 
weight: 5, 
opacity: 0.70
};

var otherStyle = {
color: "#1A5276", 
weight: 5, 
opacity: 0.5
};

var OwaysStyle = {
color: "#E22B2B", 
weight: 5, 
opacity: 0.70
};

var EwaysStyle = {
color: "#38f5a3", 
weight: 5, 
opacity: 0.70
};

var EbuildingsStyle = {
color: "#E22B2B", 
weight: 5, 
opacity: 0.70
};

var schoolStyle = {
color: "#FFFFFF", 
weight: 5, 
opacity: 0.70
};

var houseStyle = {
color: "#6f15cf", 
weight: 5, 
opacity: 0.70
};

var apartmentsStyle = {
color: "#8a427f", 
weight: 5, 
opacity: 0.70}

var garageStyle = {
color: "#42898a", 
weight: 5, 
opacity: 0.70
};

var garagesStyle = {
color: "#c9400e", 
weight: 5, 
opacity: 0.70
};

var yesStyle = {
color: "#edf505", 
weight: 5, 
opacity: 0.70
};

var residentialStyle = {
color: "#24ff5e",
weight: 5,
opactiy: 0.70
};	

var serviceStyle = {
color: "#ff7621",
weight: 5,
opacity: 0.70
};
