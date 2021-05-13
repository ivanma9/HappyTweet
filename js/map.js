// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path1 = "data/happiness_cities.csv";
let path2 = "data/user_tweet.csv";
let geojsonPath = "data/happy_cities.json";
let markers = L.featureGroup();

let geojson_data;
let geojson_layer;
let fieldtomap;

let brew = new classyBrew();
let legend = L.control({ position: "bottomright" });
let info_panel = L.control();

// initialize
$(document).ready(function () {
	createMap(lat, lon, zl);
	// readCSV(path);
});

function makeHappinessMap() {
	markers.clearLayers();
	getGeoJSON();
}

function makeTwitterMap() {
	markers.clearLayers();
	readCSV(path2, "t");
}

function makeBothMap() {
	markers.clearLayers();
	readCSV(path1, "h");
	readCSV(path2, "t");
}

// create the map
function createMap(lat, lon, zl) {
	map = L.map("map").setView([lat, lon], zl);

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
}

// function to read csv data
function readCSV(path, type) {
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function (data) {
			console.log(data);

			// map the data
			if (type == "h") {
				mapCSV(data);
			} else if (type == "t") {
				mapCSVTweet(data);
			}
		},
	});
}

function mapCSV(data) {
	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: "white",
		fillColor: "dodgerblue",
		fillOpacity: 1,
	};

	let dataArray = data.data;

	let sliced1000 = dataArray.slice(0, 1000);

	// loop through each entry
	sliced1000.forEach(function (item, index) {
		// console.log(item);
		let marker = L.circleMarker([item.lat, item.lon], circleOptions).on(
			"mouseover",
			function () {
				this.bindPopup(`${label} <br>`).openPopup();
			}
		);

		// add marker to featuregroup
		markers.addLayer(marker);

		// // add entry to sidebar
		// $(".sidebar").append(
		// 	`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`
		// );
	});

	// add featuregroup to map
	markers.addTo(map);

	// fit map to markers
	map.fitBounds(markers.getBounds());
}

function mapCSVTweet(data) {
	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: "#878787",
		fillColor: "#D19D1F",
		fillOpacity: 1,
	};

	let dataArray = data.data;

	let sliced1000 = dataArray.slice(0, 100);

	// loop through each entry
	sliced1000.forEach(function (item, index) {
		// console.log(item);
		let marker = L.circleMarker([item.lat, item.lon], circleOptions).on(
			"mouseover",
			function () {
				this.bindPopup(`${label} <br>`).openPopup();
			}
		);

		// add marker to featuregroup
		markers.addLayer(marker);

		// // add entry to sidebar
		// $(".sidebar").append(
		// 	`<img src="${item.thumbnail_url}" onmouseover="panToImage(${index})">`
		// );
	});

	// add featuregroup to map
	markers.addTo(map);

	// fit map to markers
	map.fitBounds(markers.getBounds());
}

function panToImage(index) {
	map.setZoom(17);
	map.panTo(markers.getLayers()[index]._latlng);
}

// function to get the geojson data
function getGeoJSON() {
	$.getJSON(geojsonPath, function (data) {
		console.log(data);

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON("happy score", 7, "YlOrRd", "quantile");
	});
}
function mapGeoJSON(field, num_classes, color, scheme) {
	// clear layers in case it has been mapped already
	if (geojson_layer) {
		geojson_layer.clearLayers();
	}

	// globalize the field to map
	fieldtomap = field;

	// create an empty array
	let values = [];

	// based on the provided field, enter each value into the array
	geojson_data.features.forEach(function (item, index) {
		values.push(item.properties[field]);
	});
	console.log(values);

	// set up the "brew" options
	brew.setSeries(values);
	brew.setNumClasses(num_classes);
	brew.setColorCode(color);
	brew.classify(scheme);

	// create the layer and add to map
	geojson_layer = L.geoJson(geojson_data, {
		pointToLayer: getStyle, //call a function to style each feature
		onEachFeature: onEachFeature, // actions on each feature
	}).addTo(map);

	map.fitBounds(geojson_layer.getBounds());
	// create the legend
	createLegend();

	// create the infopanel
	createInfoPanel();
}

function getStyle(feature) {
	return {
		stroke: true,
		color: "white",
		weight: 1,
		fill: true,
		fillColor: getColor(feature.properties[fieldtomap]), //brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.8,
	};
}

// return the color for each feature
function getColor(d) {
	return d > 70
		? "#800026"
		: d > 60
		? "#BD0026"
		: d > 50
		? "#E31A1C"
		: d > 40
		? "#FC4E2A"
		: d > 30
		? "#FD8D3C"
		: d > 20
		? "#FEB24C"
		: d > 10
		? "#FED976"
		: "#FFEDA0";
}

function createLegend() {
	legend.onAdd = function (map) {
		var div = L.DomUtil.create("div", "info legend"),
			breaks = brew.getBreaks(),
			labels = [],
			from,
			to;
		console.log(breaks);
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if (to) {
				labels.push(
					'<i style="background:' +
						getColor(to) +
						'"></i> ' +
						from.toFixed(2) +
						" &ndash; " +
						to.toFixed(2)
				);
			}
		}

		div.innerHTML = labels.join("<br>");
		return div;
	};

	legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature,
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;

	// style to use on mouse over
	layer.setStyle({
		weight: 2,
		color: "#666",
		fillOpacity: 0.7,
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info_panel.update(layer.feature.properties);
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
	geojson_layer.resetStyle(e.target);
	info_panel.update(); // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function createInfoPanel() {
	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		// if feature is highlighted
		if (properties) {
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else {
			this._div.innerHTML = "Hover over a country";
		}
	};

	info_panel.addTo(map);
}

//const provider = new GeoSearch.OpenStreetMapProvider();

// // create a marker
// let query_addr = "Irvine";
// // Get the provider, in this case the OpenStreetMap (OSM) provider. For some reason, this is the "wrong" way to instanciate it. Instead, we should be using an import "leaflet-geosearch" but I coulnd't make that work
// let query_promise = provider.search({
// 	query: query_addr,
// });
// query_promise
// 	.then((value) => {
// 		// Success!
// 		let lon = value[0].x;
// 		let lat = value[0].y;
// 		let label = value[0].label;
// 		//var marker = L.marker([y_coor, x_coor]).addTo(map); // CAREFULL!!! The first position corresponds to the lat (y) and the second to the lon (x)
// 		//marker.bindPopup("<b>Found location</b><br>" + label).openPopup(); // note the "openPopup()" method. It only works on the marker
// 		console.log( label + " : " + lon + " , " + lat);
// 	})
// 	.catch(console.log.bind(console));
