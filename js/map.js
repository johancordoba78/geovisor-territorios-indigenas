// ===============================
// 🔥 ESTADO GLOBAL DE LA APP
// ===============================

window.APP_STATE = {
  territorio: null,
  datos: null
};

let territorioSeleccionado = null;
let capaFocus = null;
let capaTerritorios = null;


// ===============================
// 🗺️ BASEMAP (SOLO SATÉLITE)
// ===============================

const satellite = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  { attribution: "© OSM" }
);

const baseMaps = {
  "Satélite": satellite
};

const overlayMaps = {};


// ===============================
// 🗺️ CREAR MAPA
// ===============================

const map = L.map("map", {
  center: [9.75, -84.2],
  zoom: 9,
  layers: [satellite]
});

const controlCapas = L.control.layers(baseMaps, overlayMaps,{
collapsed:false
}).addTo(map);


// 🌲 mover árbol al panel si existe
setTimeout(()=>{
const contenedor = document.getElementById("arbol-capas");
if(contenedor){
contenedor.appendChild(
document.querySelector(".leaflet-control-layers")
);
}
},500);


// ===============================
// 📊 CARGAR JSON CREF
// ===============================

fetch("data/cref_por_territorio.json")
.then(r => r.json())
.then(data => {

  console.log("✔ JSON CREF cargado");
  CREF_DATA = data;

  cargarTerritorios();

})
.catch(err => console.error("Error JSON:", err));


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
// 🎯 FOCUS MODE PRO
// ===============================

function activarFocusMode(layer){

  if(capaFocus){
    map.removeLayer(capaFocus);
    capaFocus = null;
  }

  const geo = layer.feature;

  capaFocus = L.geoJSON(geo,{
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
// 📍 CARGAR TERRITORIOS (EN ÁRBOL)
// ===============================

function cargarTerritorios() {

fetch("data/territorios_indigenas.geojson")
.then(r => r.json())
.then(data => {

capaTerritorios = L.geoJSON(data,{

style: estiloTerritorio,

onEachFeature:(feature,layer)=>{

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

layer.on("mouseover",()=>{

if(territorioSeleccionado !== layer){

layer.setStyle({
color:"#ffe600",
weight:2.5,
opacity:1,
fillOpacity:0.92
});

}

});

layer.on("mouseout",()=>{

if(territorioSeleccionado !== layer){
layer.setStyle(estiloTerritorio(feature));
}

});

layer.on("click",(e)=>{

L.DomEvent.stopPropagation(e);

const key = nombre.trim().toUpperCase();

if(territorioSeleccionado){
territorioSeleccionado.setStyle(
estiloTerritorio(territorioSeleccionado.feature)
);
}

layer.setStyle({
color:"#fff200",
weight:3,
opacity:1,
fillOpacity:1,
className:"territorio-activo"
});

territorioSeleccionado = layer;

activarFocusMode(layer);

map.flyToBounds(layer.getBounds(),{
duration:0.8,
easeLinearity:0.25
});

window.APP_STATE.territorio = key;
window.APP_STATE.datos = CREF_DATA[key] || null;

actualizarPanel(
window.APP_STATE.territorio,
window.APP_STATE.datos
);

renderClasificacion(feature.properties.CLASIF);

});

}

});

capaTerritorios.addTo(map);

controlCapas.addOverlay(capaTerritorios,"Territorios indígenas");

map.fitBounds(capaTerritorios.getBounds());

});
}


// =====================================================
// 👩 CAPAS GIGUP ORDENADAS CRONOLÓGICAMENTE (PRO)
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

const capasGigup = [
{url:"data/Gigup_2022_wgs84.geojson", nombre:"GIGUP 2022"},
{url:"data/Gigup_2023_wgs84.geojson", nombre:"GIGUP 2023"},
{url:"data/Gigup_2024_wgs84.geojson", nombre:"GIGUP 2024"},
{url:"data/Gigup_2025_wgs84.geojson", nombre:"GIGUP 2025"}
];

Promise.all(
capasGigup.map(c=>fetch(c.url).then(r=>r.json()))
)
.then(respuestas=>{

respuestas.forEach((data,i)=>{

const capa = L.geoJSON(data,{

pointToLayer: estiloGigup,

onEachFeature:(feature,layer)=>{

const nombreM = feature.properties.Name || "Sin nombre";
const anio = feature.properties.Anio || "Sin año";

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
// 🔄 RESET CLICK FUERA
// ===============================

const zoomInicial = {
center:[9.75,-84.2],
zoom:9
};

map.on("click",function(){

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

map.flyTo(
zoomInicial.center,
zoomInicial.zoom,
{duration:0.8,easeLinearity:0.25}
);

});

// =====================================================
// 🔥 RESET SOLO PARA EXPLORACIÓN GIGUP (NO TERRITORIOS)
// =====================================================

map.on("dblclick", function(e){

// Si hay territorio activo → NO hacer nada
if(territorioSeleccionado) return;

// Volver al zoom nacional cuando solo exploran puntos
map.flyTo(
zoomInicial.center,
zoomInicial.zoom,
{
duration:0.8,
easeLinearity:0.25
}
);

});

