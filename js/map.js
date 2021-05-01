// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/happiness_cities.csv";
let markers = L.featureGroup();

// initialize
$(document).ready(function () {
	createMap(lat, lon, zl);
	readCSV(path);
});

// create the map
function createMap(lat, lon, zl) {
	map = L.map("map").setView([lat, lon], zl);

	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
}

// function to read csv data
function readCSV(path) {
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function (data) {
			console.log(data);

			// map the data
			mapCSV(data);
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

	// loop through each entry
	data.data.forEach(function (item, index) {
		console.log(item);
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
