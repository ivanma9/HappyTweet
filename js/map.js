// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path1 = "data/happiness_cities.csv";
let path2 = "data/user_tweet.csv";
let markers = L.featureGroup();

let brew= new classybrew(); 
let legend = L.control({position: 'bottomright'});
let info_panel = L.control();

// initialize
$(document).ready(function () {
	createMap(lat, lon, zl);
	// readCSV(path);
});

function makeHappinessMap() {
	markers.clearLayers();
	readCSV(path1, "h");
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

function createLegend(){
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info legend'),
		breaks = brew.getBreaks(),
		labels = [],
		from, to;
		
		for (var i = 0; i < breaks.length; i++) {
			from = breaks[i];
			to = breaks[i + 1];
			if(to) {
				labels.push(
					'<i style="background:' + brew.getColorInRange(from) + '"></i> ' +
					from.toFixed(2) + ' &ndash; ' + to.toFixed(2));
				}
			}
			
			div.innerHTML = labels.join('<br>');
			return div;
		};
		
		legend.addTo(map);
}

function mappath1(field){

	

	// create the legend
	createLegend();
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
