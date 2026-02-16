// 🔥 ESTADO GLOBAL
window.APP_STATE = {
  territorio: null,
  datos: null
};

let territorioSeleccionado = null;
let capaFocus = null;


// 🗺️ BASEMAPS
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


// 📊 JSON CREF
fetch("data/cref_por_territorio.json")
.then(r => r.json())
.then(data => {
  CREF_DATA = data;
  cargarTerritorios();
});


// 🎨 ESTILO
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


// 🎯 FOCUS
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


// 📍 GEOJSON
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

          // 🔥 NUEVO
          renderClasificacion(feature.properties.CLASIF);

        });

      }

    }).addTo(map);

    map.fitBounds(capa.getBounds());

  });

}
