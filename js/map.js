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

const map = L.map("map", {
center: [9.75, -84.2],
zoom: 9,
layers: [satellite]
});

L.control.layers({
"Satélite": satellite,
"Negro": dark
}).addTo(map);


// ===============================
// 📊 JSON CREF
// ===============================

fetch("data/cref_por_territorio.json")
.then(r => r.json())
.then(data => {
CREF_DATA = data;
cargarTerritorios();
});


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
// 🎯 FOCUS MODE
// ===============================

function activarFocusMode(layer){

if(capaFocus){
map.removeLayer(capaFocus);
capaFocus = null;
}

capaFocus = L.geoJSON(layer.feature,{
style:{
color:"#fff200",
weight:4,
fillColor:"#000000",
fillOpacity:0.35,
interactive:false
}
}).addTo(map);

}


// ===============================
// 📍 TERRITORIOS
// ===============================

function cargarTerritorios() {

fetch("data/territorios_indigenas.geojson")
.then(r => r.json())
.then(data => {

const capa = L.geoJSON(data, {

style: estiloTerritorio,

onEachFeature: (feature, layer) => {

const nombre = feature.properties.TERRITORIO
?.trim()
.toUpperCase();

const clasif = feature.properties.CLASIF;

layer.bindTooltip(
`<div class="tooltip-pro">
<strong>${feature.properties.TERRITORIO}</strong><br>${clasif}
</div>`,
{sticky:true,direction:"top",offset:[0,-10]}
);

layer.on("mouseover", () => {
if(territorioSeleccionado !== layer){
layer.setStyle({
color:"#ffe600",
weight:2.5,
fillOpacity:0.92
});
}
});

layer.on("mouseout", () => {
if(territorioSeleccionado !== layer){
layer.setStyle(estiloTerritorio(feature));
}
});

layer.on("click", (e) => {

L.DomEvent.stopPropagation(e);

if(territorioSeleccionado){
territorioSeleccionado.setStyle(
estiloTerritorio(territorioSeleccionado.feature)
);
}

layer.setStyle({
color:"#fff200",
weight:3,
fillOpacity:1
});

territorioSeleccionado = layer;

activarFocusMode(layer);

map.flyToBounds(layer.getBounds(),{
duration:0.8
});

window.APP_STATE.territorio = nombre;
window.APP_STATE.datos = CREF_DATA[nombre] || null;

actualizarPanel(
window.APP_STATE.territorio,
window.APP_STATE.datos
);

renderClasificacion(feature.properties.CLASIF);

});

}

}).addTo(map);

map.fitBounds(capa.getBounds());

});
}


// ===============================
// 🔄 RESET TERRITORIO
// ===============================

map.on("click", function(){

if(!territorioSeleccionado) return;

territorioSeleccionado.setStyle(
estiloTerritorio(territorioSeleccionado.feature)
);

territorioSeleccionado = null;

if(capaFocus){
map.removeLayer(capaFocus);
capaFocus = null;
}

window.APP_STATE.territorio = null;
window.APP_STATE.datos = null;

map.flyTo([9.75,-84.2],9,{duration:0.8});

});


// =====================================================
// 👩 CAPA GIGUP NACIONAL DINÁMICA POR AÑO
// =====================================================

let capaGigup = null;
let gigupData = [];

Promise.all([
fetch("data/Gigup_2022_wgs84.geojson").then(r=>r.json()),
fetch("data/Gigup_2023_wgs84.geojson").then(r=>r.json()),
fetch("data/Gigup_2024_wgs84.geojson").then(r=>r.json()),
fetch("data/Gigup_2025_wgs84.geojson").then(r=>r.json())
])
.then(res => {

gigupData = res.flatMap(fc => fc.features);

actualizarGigupPorAnio();

});


// =====================================================
// 🔄 FILTRO DINÁMICO GIGUP
// =====================================================

function actualizarGigupPorAnio(){

const selector = document.getElementById("anio-select");
if(!selector) return;

const anio = Number(selector.value);

if(capaGigup){
map.removeLayer(capaGigup);
capaGigup = null;
}

const filtrados = gigupData.filter(f =>
Number(f.properties.Anio) === anio
);

capaGigup = L.geoJSON(filtrados,{

pointToLayer:(feature,latlng)=>{

return L.circleMarker(latlng,{
radius:5,
fillColor:"#ff2fa0",
color:"#ffffff",
weight:1,
fillOpacity:0.9
});

},

onEachFeature:(feature,layer)=>{

const nombre = feature.properties.Name || "";
const lugar = feature.properties.Lugar || "";

layer.bindTooltip(`
<div class="tooltip-pro">
<strong>${nombre}</strong><br>${lugar}
</div>
`);

}

}).addTo(map);

}
