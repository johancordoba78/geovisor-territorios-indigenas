// ===============================
// MAPA BASE BLANCO
// ===============================

const baseMaps = {
  "Blanco": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  )
};

// ===============================
// MAPA
// ===============================

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["Blanco"]]
});

L.control.layers(baseMaps).addTo(map);

// ===============================
// ESTILO POR CLASIFICACIÓN
// ===============================

function estiloTerritorio(feature) {

  const clasif = (feature.properties.CLASIF || "")
    .trim()
    .toUpperCase();

  let fillColor = "#ff7a00"; // Naranja fuerte (sin CREF ni PAFT)

  if (clasif === "CREF Y PAFTS") fillColor = "#6a00ff"; // Morado fuerte
  if (clasif === "SOLO CREF") fillColor = "#0057ff"; // Azul fuerte

  return {
    color: "#ffffff",   // borde blanco
    weight: 2,
    fillColor: fillColor,
    fillOpacity: 0.85
  };
}

// ===============================
// RESALTADO AL PASAR EL MOUSE
// ===============================

function resaltar(e) {
  const layer = e.target;

  layer.setStyle({
    fillColor: "#ffff00", // Amarillo
    fillOpacity: 0.9
  });

  layer.bringToFront();
}

function resetResalte(e) {
  capaTerritorios.resetStyle(e.target);
}

// ===============================
// VARIABLE GLOBAL DE CAPA
// ===============================

let capaTerritorios;

// ===============================
// CARGAR DATOS CREF DESDE JSON
// ===============================

fetch("data/cref_por_territorio.json")
  .then(r => r.json())
  .then(data => {
    CREF_DATA = data;
    cargarTerritorios();
  });

// ===============================
// CARGAR TERRITORIOS
// ===============================

function cargarTerritorios() {

  fetch("data/territorios_indigenas.geojson")
    .then(r => r.json())
    .then(data => {

      capaTerritorios = L.geoJSON(data, {
        style: estiloTerritorio,

        onEachFeature: (feature, layer) => {

          const nombre = feature.properties.TERRITORIO
            ?.trim()
            .toUpperCase();

          // 👇 EVENTOS VISUALES
          layer.on({
            mouseover: resaltar,
            mouseout: resetResalte,
            click: () => {
              actualizarPanel(nombre, CREF_DATA[nombre] || null);
            }
          });

        }
      }).addTo(map);

    });

}

