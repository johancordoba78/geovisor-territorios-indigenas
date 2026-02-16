// ===============================
// 🔥 ESTADO GLOBAL
// ===============================

window.APP_STATE = {
  territorio: null,
  datos: null
};

let territorioSeleccionado = null;
let capaFocus = null;
let capaTerritorios = null;


// ===============================
// 🗺️ BASEMAP
// ===============================

const satellite = L.tileLayer(
"https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
{ attribution:"© OSM"}
);

const baseMaps = {
"Satélite": satellite
};

const overlayMaps = {};


// ===============================
// 🗺️ MAPA COSTA RICA COMPLETA
// ===============================

const boundsCostaRica = [
[7.5,-86.5],
[11.5,-82.0]
];

const map = L.map("map",{
center:[9.75,-84.2],
zoom:8,
minZoom:7,
maxZoom:18,
maxBounds: boundsCostaRica,
maxBoundsViscosity:1.0,
layers:[satellite]
});

const controlCapas = L.control.layers(baseMaps,overlayMaps,{
collapsed:false
}).addTo(map);


// =====================================================
// 🌎 MINI MAPA REGIONAL (NUEVO)
// =====================================================

const miniLayer = L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{ attribution:"" }
);

new L.Control.MiniMap(miniLayer,{
position:"bottomleft",
width:160,
height:120,
zoomLevelOffset:-4,
toggleDisplay:true
}).addTo(map);


// ===============================
// 📊 JSON CREF
// ===============================

fetch("data/cref_por_territorio.json")
.then(r=>r.json())
.then(data=>{
CREF_DATA=data;
cargarTerritorios();
});


// ===============================
// 🎨 ESTILO TERRITORIOS
// ===============================

function estiloTerritorio(feature){

const clasif=(feature.properties.CLASIF||"").trim().toUpperCase();

let fillColor="#ff6600";
if(clasif==="CREF Y PAFTS") fillColor="#6a0dad";
if(clasif==="SOLO PAFTS") fillColor="#0047ff";

return{
color:"#ffffff",
weight:2.5,
fillColor,
fillOpacity:0.85
};
}


// ===============================
// 🎯 FOCUS
// ===============================

function activarFocusMode(layer){

if(capaFocus){
map.removeLayer(capaFocus);
capaFocus=null;
}

capaFocus=L.geoJSON(layer.feature,{
style:{
color:"#fff200",
weight:4,
fillColor:"#000000",
fillOpacity:0.35,
interactive:false,
className:"territorio-activo"
}
}).addTo(map);

}


// ===============================
// 📍 TERRITORIOS
// ===============================

function cargarTerritorios(){

fetch("data/territorios_indigenas.geojson")
.then(r=>r.json())
.then(data=>{

capaTerritorios=L.geoJSON(data,{

style:estiloTerritorio,

onEachFeature:(feature,layer)=>{

const nombre=feature.properties.TERRITORIO?.trim().toUpperCase();
const clasif=feature.properties.CLASIF;

layer.bindTooltip(
`<div class="tooltip-pro">
<strong>${feature.properties.TERRITORIO}</strong><br>${clasif}
</div>`,
{sticky:true,direction:"top",offset:[0,-10]}
);

layer.on("mouseover",()=>{
if(territorioSeleccionado!==layer){
layer.setStyle({color:"#ffe600",weight:2.5,fillOpacity:0.92});
}
});

layer.on("mouseout",()=>{
if(territorioSeleccionado!==layer){
layer.setStyle(estiloTerritorio(feature));
}
});

layer.on("click",(e)=>{

L.DomEvent.stopPropagation(e);

if(territorioSeleccionado){
territorioSeleccionado.setStyle(
estiloTerritorio(territorioSeleccionado.feature)
);
}

layer.setStyle({
color:"#fff200",
weight:3,
fillOpacity:1,
className:"territorio-activo"
});

territorioSeleccionado=layer;

activarFocusMode(layer);

map.flyToBounds(layer.getBounds(),{duration:0.8});

window.APP_STATE.territorio=nombre;
window.APP_STATE.datos=CREF_DATA[nombre]||null;

actualizarPanel(nombre,window.APP_STATE.datos);
renderClasificacion(clasif);

});

}

});

capaTerritorios.addTo(map);
controlCapas.addOverlay(capaTerritorios,"Territorios indígenas");

});

}


// =====================================================
// 👩 GIGUP POR AÑO (PRO)
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

const capasGigup=[
{url:"data/Gigup_2022_wgs84.geojson",nombre:"GIGUP 2022"},
{url:"data/Gigup_2023_wgs84.geojson",nombre:"GIGUP 2023"},
{url:"data/Gigup_2024_wgs84.geojson",nombre:"GIGUP 2024"},
{url:"data/Gigup_2025_wgs84.geojson",nombre:"GIGUP 2025"}
];

Promise.all(
capasGigup.map(c=>fetch(c.url).then(r=>r.json()))
)
.then(respuestas=>{

respuestas.forEach((data,i)=>{

const capa=L.geoJSON(data,{

pointToLayer:estiloGigup,

onEachFeature:(feature,layer)=>{

const nombreM=feature.properties.Name||"Sin nombre";
const anio=feature.properties.Anio||"Sin año";

layer.bindTooltip(
`<div class="tooltip-pro">
<strong>👩 ${nombreM}</strong><br>
📅 Año GIGUP: ${anio}
</div>`,
{direction:"top",offset:[0,-8],sticky:true}
);

layer.bindPopup(`
<div style="font-size:13px;line-height:18px;min-width:160px;">
<div style="font-weight:700;font-size:14px;margin-bottom:4px;">
👩 ${nombreM}
</div>
<div style="color:#374151;">
📅 Año GIGUP: <strong>${anio}</strong>
</div>
</div>
`);

}

});

controlCapas.addOverlay(capa,capasGigup[i].nombre);

});

});


// ===============================
// 🔄 RESET TERRITORIOS
// ===============================

const zoomInicial={
center:[9.75,-84.2],
zoom:8
};

map.on("click",function(){

if(!territorioSeleccionado) return;

territorioSeleccionado.setStyle(
estiloTerritorio(territorioSeleccionado.feature)
);

territorioSeleccionado=null;

if(capaFocus){
map.removeLayer(capaFocus);
capaFocus=null;
}

window.APP_STATE.territorio=null;
window.APP_STATE.datos=null;

map.flyTo(zoomInicial.center,zoomInicial.zoom,{duration:0.8});

});

