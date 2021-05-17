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
let csvData;

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
	getGeoJSON();
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
				if (csvData){
					csvData = data;
				}
			}
				
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
		fillColor: "#1F8AD1",
		fillOpacity: 1,
	};

	let dataArray = data.data;

	let sliced1000 = dataArray.slice(0, 100);

	// loop through each entry
	sliced1000.forEach(function (item, index) {
		// console.log(item);
		let marker = L.circleMarker([item.lat, item.lon], circleOptions);

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
	console.log(markers.getBounds());

	map.panTo(markers.getLayers()[index]._latlng);
}

// function to get the geojson data
function getGeoJSON() {
	$.getJSON(geojsonPath, function (data) {
		console.log(data);

		// put the data in a global variable
		geojson_data = data;

		// call the map function
		mapGeoJSON("happy score", 7, "RdYlGn", "quantile");
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
		style: (feature) => getScoresStyle, 
		// pointToLayer: function (feature, latlng) {
		// 	return L.circleMarker(latlng, getStyle(feature));
		// },
		onEachFeature: onEachFeature, // actions on each feature
	}).addTo(map);

	map.fitBounds(geojson_layer.getBounds());
	// create the legend
	createLegend();

	// create the infopanel
	createInfoPanel();
	let i = 0;
	map.eachLayer(function () {
		i += 1;
	});
	console.log("Map has", i, "layers.");
}

function getStyle(feature) {
	return {
		color: brew.getColorInRange(feature.properties[fieldtomap]),
		radius: 10,
		weight: 1,
		fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
		fillOpacity: 0.9,
	};
}

// return the color for each feature
function getColor(d) {
	return d > 70
		? "#096F00"
		: d > 60
		? "#75BD00"
		: d > 50
		? "#E4CC19"
		: d > 40
		? "#FDA63C"
		: d > 30
		? "#FF7E28"
		: d > 20
		? "#FF3628"
		: d > 10
		? "#981608"
		: "#610202";
}

function createLegend() {
	legend.onAdd = function (map) {
		var div = L.DomUtil.create("div", "info legend"),
			breaks = brew.getBreaks(),
			labels = [],
			from,
			to;
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if (to) {
				labels.push(
					'<i style="background:' +
						brew.getColorInRange(to) +
						'"></i> ' +
						from.toFixed(2) +
						" &ndash; " +
						to.toFixed(2)
				);
			}
		}
		div.innerHTML = `<h3>${fieldtomap} legend </h3>` + labels.join("<br>");
		return div;
	};
	legend.addTo(map);
}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
	console.log(layer.feature);
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature,
	});
}

// on mouse over, highlight the feature
function highlightFeature(e) {
	var layer = e.target;
	console.log(layer);

	// // style to use on mouse over
	// layer.setStyle({
	// 	weight: 2,
	// 	color: "#20211F",
	// 	fillOpacity: 0.7,
	// });

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
	console.log(e.target.feature.geometry.coordinates[0] - 1);
	var southWest = new L.LatLng(
			e.target.feature.geometry.coordinates[1] - 0.1,
			e.target.feature.geometry.coordinates[0] - 0.1
		),
		northEast = new L.LatLng(
			e.target.feature.geometry.coordinates[1] + 0.1,
			e.target.feature.geometry.coordinates[0] + 0.1
		),
		bounds = new L.LatLngBounds(southWest, northEast);
	map.fitBounds(bounds);
}

function createInfoPanel() {
	info_panel.onAdd = function (map) {
		this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
		this.update();
		return this._div;
	};

	// method that we will use to update the control based on feature properties passed
	info_panel.update = function (properties) {
		console.log(properties);
		// if feature is highlighted
		if (properties) {
			this._div.innerHTML = `<b>${properties.name}</b><br>${fieldtomap}: ${properties[fieldtomap]}`;
		}
		// if feature is not highlighted
		else {
			this._div.innerHTML = "Hover over a city";
		}
	};

	info_panel.addTo(map);
}

function getScoresStyle(feature) {
	const cityData = csvData[csvPathsIndex].data.find((row) => row.City === feature.properties.NAME);

	if (cityData) {
		const stateScore = cityData["Total Score"];

		const scaledVal = (stateScore - min) / (max - min);
		const colorHSL = getHeatmapColorFromValue(scaledVal);
		const colorHex = hslToHex(colorHSL.hue, colorHSL.saturation, colorHSL.luminance);

		return {
			fillColor: colorHex,
			fillOpacity: 0.2,
			color: "black",
			weight: 0.3,
		};
	}
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
