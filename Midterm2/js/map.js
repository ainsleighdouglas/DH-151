// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/carbonEmissionsDH.csv";
let markers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap(lat,lon,zl);
	readCSV(path);
});

// create the map
function createMap(lat,lon,zl){
	map = L.map('map').setView([lat,lon], zl);

	var Thunderforest_MobileAtlas = L.tileLayer('https://{s}.tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
   });

   L.tileLayer.provider('Thunderforest.MobileAtlas').addTo(map);

/*
	var OpenStreetMap_HOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
	}).addTo(map);


	L.tileLayer.provider('Stamen.Watercolor').addTo(map);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
	*/
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
	let circleOptions = {
		radius: 15,
		weight: 1,
		color: 'white',
		fillColor: 'green',
		fillOpacity: .5,
	}

	// loop through each entry
	data.data.forEach(function(item,index){

        circleOptions.radius = item.latest_value * 20

		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)
		.on('mouseover',function(){
			this.bindPopup(`<h3>${item.geoAreaName}</h3>${item.latest_value}`).openPopup()
		})

		// add marker to featuregroup
		markers.addLayer(marker)

		// add entry to sidebar
		$('.sidebar').append(`<img src="https://images.emojiterra.com/twitter/v13.0/512px/1f5fa.png"  onclick="panToImage(${index})"> ${item.geoAreaName}<br>`)
	})

	markers.addTo(map); // add featuregroup to map

	map.fitBounds(markers.getBounds()); // fit markers to map
}

function panToImage(index){
	map.setZoom(17);
	map.panTo(markers.getLayers()[index]._latlng);
}