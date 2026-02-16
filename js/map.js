// ===============================
// 🔥 ESTADO GLOBAL
// ===============================

window.APP_STATE = {
territorio: null,
datos: null
};

let territorioSeleccionado = null;
let capaFocus = null;


// ===============================
// 🗺️ BASEMAPS
// ===============================

const satellite = L.tileLayer(
"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
{ attribution: "© OSM" }
);

const dark = L.tileLayer(
"https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
{ attribution: "© CARTO" }
);

const baseMaps = {
"Satélite": satellite,
"Negro": dark
};

const overlayMaps = {};

const map = L.map("map", {
center: [9.75, -84.2],
zoom: 9,
layers: [satellite]
});

const controlCapas = L.control.layers(baseMaps, overlayMaps,{
collapsed:false
});

controlCapas.addTo(map);

// 🌲 mover árbol al panel
setTimeout(()=>{
const contenedor = document.getElementById("arbol-capas");
if(contenedor){
contenedor.appendChild(
document.querySelector(".leaflet-control-layers")
);
}
},500);


// ===============================
// 🎨 ESTILO TERRITORIOS
// ===============================

function estiloTerritorio(feature) {

const clasif = (feature.properties.CLASIF || "")
.trim()
.toUpperCase();

let fillColor = "#ff6600";

if (clasif === "CREF Y PAFTS") fillColor = "#6a0dad";
if (clasif === "SOLO PAFTS") fillColor = "#0047ff";

return {
color: "#ffffff",
weight: 2.5,
fillColor,
fillOpacity: 0.85
};
}


// ===============================
// 📍 TERRITORIOS
// ===============================

function cargarTerritorios() {

fetch("data/territorios_indigenas.geojson")
.then(r => r.json())
.then(data => {

const capa = L.geoJSON(data, {
style: estiloTerritorio
}).addTo(map);

map.fitBounds(capa.getBounds());

});
}

cargarTerritorios();


// =====================================================
// 🗺️ DISTRITOS COSTA RICA
// =====================================================

fetch("data/distritos_cr.geojson")
.then(r=>r.json())
.then(data=>{

const capaDistritos = L.geoJSON(data,{
style:{
color:"#888888",
weight:0.8,
fillOpacity:0
}
});

controlCapas.addOverlay(capaDistritos,"Distritos CR");

});


// =====================================================
// 👩 CAPAS GIGUP
// =====================================================

function estiloGigup(feature,latlng){
return L.circleMarker(latlng,{
radius:5,
fillColor:"#ff2fa0",
color:"#ffffff",
weight:1,
fillOpacity:0.9
});
}

function cargarGigup(url,nombre){

fetch(url)
.then(r=>r.json())
.then(data=>{

const capa = L.geoJSON(data,{
pointToLayer: estiloGigup
});

controlCapas.addOverlay(capa,nombre);

});
}

cargarGigup("data/Gigup_2022_wgs84.geojson","GIGUP 2022");
cargarGigup("data/Gigup_2023_wgs84.geojson","GIGUP 2023");
cargarGigup("data/Gigup_2024_wgs84.geojson","GIGUP 2024");
cargarGigup("data/Gigup_2025_wgs84.geojson","GIGUP 2025");
