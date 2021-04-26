// Global variables
let map;
let lat = 0;
let lon = 0;
let zl = 3;
let path = "data/carbonEmissions.csv";
let markers = L.featureGroup();

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
	let circleOptions = {
		radius: 10,
		weight: 1,
		color: 'white',
		fillColor: 'dodgerblue',
		fillOpacity: 1,
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions) // create marker
		.on('mouseover',function(){
			this.bindPopup("<h3>" + item.title + " (" + item.date + ")" + "</h3>" + "<center><img src ='" + item.reference_url + "'width=100%'/></center>" +
			item.description).openPopup()
		})
		// add marker to featuregroup		
		markers.addLayer(marker)

		//fly to location and show/hide paragraph when clicked
		$('.sidebar').append(`<div class="sidebar-item" onclick="ShowAndHide(${index});flyToIndex(${index});">${item.title} <br><i>(${item.date})</i></div>`)
		//add paragraph div to sidebar
		$('.sidebar').append(`<div id = "${index}" style="display: none">${item.description}<br><center><img src="${item.reference_url}"></center><br>${item.caption}</div>`)
	})

	markers.addTo(map); // add featuregroup to map

	map.fitBounds(markers.getBounds()); // fit markers to map
}



function flyToIndex(index){
	// zoom to level 12 first
	map.setZoom(12);
	// pan to the marker
	map.flyTo(markers.getLayers()[index]._latlng);
	markers.getLayers()[index].openPopup();
}