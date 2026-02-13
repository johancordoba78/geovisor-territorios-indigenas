// ===============================
// 🔥 ESTADO GLOBAL DE LA APP
// ===============================

window.APP_STATE = {
  territorio: null,
  datos: null
};

let territorioSeleccionado = null;
let capaFocus = null; // 🔥 capa oscura


// ===============================
// 🗺️ BASEMAPS
// ===============================

// 🌍 SATELITE (DEFAULT)
const satellite = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  { attribution: "© OSM" }
);

// 🌑 NEGRO
const dark = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
  { attribution: "© CARTO" }
);

const baseMaps = {
  "Satélite": satellite,
  "Negro": dark
};


// ===============================
// 🗺️ CREAR MAPA
// ===============================

const map = L.map("map", {
  center: [9.75, -84.2],
  zoom: 9,
  layers: [satellite]
});

L.control.layers(baseMaps).addTo(map);


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
      color:"#ffff00",
      weight:4,
      fillColor:"#000000",
      fillOpacity:0.35,
      interactive:false
    }
  }).addTo(map);

}


// ===============================
// 📍 CARGAR GEOJSON
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
            `<strong>${feature.properties.TERRITORIO}</strong><br>${clasif}`,
            { sticky: true }
          );

          // ===============================
          // ✨ HOVER AMARILLO
          // ===============================

          layer.on("mouseover", () => {

            if(territorioSeleccionado !== layer){

              layer.setStyle({
                color:"#ffd400",
                weight:3,
                fillOpacity:0.95
              });

            }

          });

          layer.on("mouseout", () => {

            if(territorioSeleccionado !== layer){
              layer.setStyle(estiloTerritorio(feature));
            }

          });


          // ===============================
          // 🔥 CLICK TERRITORIO PRO
          // ===============================

          layer.on("click", (e) => {

            L.DomEvent.stopPropagation(e); // 🔥 evita reset al click

            const key = nombre.trim().toUpperCase();

            if(territorioSeleccionado){
              territorioSeleccionado.setStyle(
                estiloTerritorio(territorioSeleccionado.feature)
              );
            }

            layer.setStyle({
              color:"#ffd400",
              weight:5,
              fillOpacity:1
            });

            territorioSeleccionado = layer;

            activarFocusMode(layer); // 🔥 FOCUS PRO

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

          });

        }

      }).addTo(map);

      map.fitBoun
