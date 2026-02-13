// ===============================
// 🔥 ESTADO GLOBAL DE LA APP
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

          // 🔥 TOOLTIP PRO OSCURO
          layer.bindTooltip(
            `<div class="tooltip-pro">
              <strong>${feature.properties.TERRITORIO}</strong><br>${clasif}
            </div>`,
            {
              sticky:true,
              direction:"top",
              offset:[0,-10]
            }
          );


          // ===============================
          // ✨ HOVER PRO SUAVE
          // ===============================

          layer.on("mouseover", () => {

            if(territorioSeleccionado !== layer){

              layer.setStyle({
                color:"#ffe600",
                weight:2.5,
                opacity:1,
                fillOpacity:0.92
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

            L.DomEvent.stopPropagation(e);

            const key = nombre.trim().toUpperCase();

            if(territorioSeleccionado){
              territorioSeleccionado.setStyle(
                estiloTerritorio(territorioSeleccionado.feature)
              );
            }

            // ⭐ HALO PRO
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

          });

        }

      }).addTo(map);

      map.fitBounds(capa.getBounds());

    })
    .catch(err => console.error("Error GEOJSON:", err));
}


// ===============================
// 🎯 LEYENDA CLASIFICACIÓN
// ===============================

const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {

  const div = L.DomUtil.create("div", "info legend");

  div.innerHTML = `
    <div style="
      background:white;
      padding:10px;
      border-radius:8px;
      box-shadow:0 2px 6px rgba(0,0,0,0.2);
      font-size:12px;
      line-height:18px;
    ">
      <strong>Clasificación</strong><br>

      <span style="background:#6a0dad;width:12px;height:12px;display:inline-block;margin-right:6px"></span>
      CREF y PAFTS<br>

      <span style="background:#0047ff;width:12px;height:12px;display:inline-block;margin-right:6px"></span>
      Solo PAFTS<br>

      <span style="background:#ff6600;width:12px;height:12px;display:inline-block;margin-right:6px"></span>
      Otros
    </div>
  `;

  return div;
};

legend.addTo(map);


// ===============================
// 🎯 ZOOM INICIAL
// ===============================

const zoomInicial = {
  center: [9.75, -84.2],
  zoom: 9
};


// ===============================
// 🔄 RESET CLICK FUERA
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

  map.flyTo(
    zoomInicial.center,
    zoomInicial.zoom,
    {
      duration:0.8,
      easeLinearity:0.25
    }
  );

});
