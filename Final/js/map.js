// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_PlPERpLYVzWdq_FLrMAzv7ZANCa1qvC0egyBeB5EBR2te24SmY2EqZSl-WwSFxuhw0p-KNl7lJwG/pub?output=csv";
// let markers = L.featureGroup();
let comarkers = L.featureGroup();
let datamarkers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

// function to read csv data
function readCSV(path){
	Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			mapCSV(data); // map the data

		}
	});
}

function mapCSV(data){
	
	// circle options
	let circleCarbon = {
		radius: 15,
		weight: 1,
		color: "white",
		fillColor: null,
		fillOpacity: 0.009,
	}

		let circleData = {
			radius: 15,
			weight: 1,
			color: "white",
			fillColor: null,
			fillOpacity: 0.005,
		}

data.data.forEach(function(item,index){
	
	
	for (i = 0; i < 109; i++){
	
		circleCarbon.radius = item.Quantity * .166
		circleCarbon.fillColor= "green"

		let comarker = L.circleMarker([item.lat,item.lon], circleCarbon)
		.on('mouseover',function(index){
			this.bindPopup(`<h3>${item.Location}</h3>${item.Quantity} Data Centers`)
		})
		comarkers.addLayer(comarker)
		//$('.sidebar').append(`<img src="https://images.emojiterra.com/twitter/v13.0/512px/1f5fa.png"  onmouseover="zoomToImage(${index})"> ${item.Location}<br>`)
	}
	for (i = 0; i < 143; i++){
		circleData.radius = item.latest_value * 20
		circleData.fillColor= "blue"
		
		let datamarker = L.circleMarker([item.latitude,item.longitude], circleData)
		.on('mouseover',function(){
			this.bindPopup(`<h3>${item.geoAreaName}</h3>${item.latest_value} KG of CO2 emitted per dollar of GDP`).openPopup()
		})
		datamarkers.addLayer(datamarker)

	}

// add featuregroup of markers to map
	datamarkers.addTo(map)
	comarkers.addTo(map)

})

let addedlayers = {
	"CO2 Output": datamarkers,
	"Data Center Quantity": comarkers,
}


// add layer control box. "null" is for basemap. layers, i.e., is defined above
L.control.layers(null,addedlayers).addTo(map);

// fit markers to map so that the map goes to the fitted markers
map.fitBounds(comarkers.getBounds())
}

function zoomToImage(index){
	map.setZoom(10);
	map.panTo(comarkers.getLayers()[index]._latlng);
}