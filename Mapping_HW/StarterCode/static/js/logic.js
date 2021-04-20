console.log("working");

//We create the tile layer that will be the background of our map
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution:'Map data',
    maxZoom: 18,
    accessToken: API_KEY

})

//We create second tile layer that will be the background of our map
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution:'Map data',
    maxZoom: 18,
    accessToken: API_KEY

})

//We create second tile layer that will be the background of our map
let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution:'Map data',
    maxZoom: 18,
    accessToken: API_KEY

})



let map = L.map('mapid',{
    center:[40.7,-94.5],
    zoom: 3,
    layers:[streets]
})


let baseMaps = {
    "Streets" : streets,
    "Satellite" : satelliteStreets,
    Light: light
}

let allEarthquakes = new L.layerGroup()
let largeEarthquakes = new L.layerGroup()
let tectonicplates = new L.layerGroup()

let overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": allEarthquakes
}

L.control.layers(baseMaps, overlays).addTo(map)


//Retrieve the earthquak geoJSON data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    //function return style for each earthquake we plot on the map
    function styleInfo(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.propereties.mag),
            color:"#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        }
    }

    function getColor(magnitude){
        if(magnitude > 5 ) {
            return "#ea2c2c";
        }

        if (magnitude > 4) {
            return "#ea822c";
        }

        if (magintude > 3) {
            return "#ee9c00";

        }

        if (magintude > 2) {
            return "#eecc00";
            
        }

        if (magintude > 1) {
            return "#d4ee00";
            
        }
        return "#98eee0";

    }

    // This function determins the radus of the earthquake marker based on it's magnitude
    // Earthquake with a magnitude of 0 being plotted with wrong radius
    function getRadius(maginitude){
        if (magnitude ===0 ){
            return 1
        }
        return magnitude * 4;

    }

    L.geoJson(data, {
        pointToLayer: function( feature, latlng){
            console.log(data);
            return L.circleMarker(latlng)
        },
        style: styleInfo,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Magnitude: "+ feature.properties.mag + "<br> Location:" + feature.properties.place);

        }
    }).addTo(allEarthquakes)

    allEarthquakes.addTo(map)

    let legend = L.control({
        position: "bottomright"
    })

    legend.onAdd = function(){
        let div = L.DomUtil.create('div', 'info legend');
        const magnitudes = [0,1,2,3,4,5]
        const colors = [
            "#98eee0",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ]

        for(var i = 0; i < magnitudes.length; i++){
            console.log(colors[i]);
            div.innerHTML += `<i style='background:${colors[i]}'></i>` + magnitudes[i] + (magnitudes[i+1]?"&ndash;" + magnitudes[i+1] + "<br>":"+")
        }

        return div;

    }

    legend.addTo(map)

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_bounderies.json").then(function(plateData){
        L.geoJson(plateData, {
            color: "#ff65ea",
            weight: 2
        }).addTo(tectonicplates)

        tectonicplates.addTo(map)

    })


})
