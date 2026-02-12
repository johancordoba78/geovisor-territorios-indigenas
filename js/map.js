// ===============================
// MAPA BASE BLANCO
// ===============================

const baseMaps = {
  "Blanco": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  )
};

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 5,
  layers: [baseMaps["Blanco"]]
});

L.control.layers(baseMaps).addTo(map);

// ===============================
// CARGAR JSON DEL EXCEL
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
// ESTILO SEGÚN CLASIFICACIÓN
// ===============================

function estiloTerritorio(feature) {

  const clasif = (feature.properties.CLASIF || "")
    .trim()
    .toUpperCase();

  let fillColor = "#ff6600"; // Sin CREF ni PAFT

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
// CARGAR TERRITORIOS GEOJSON
// ===============================

function cargarTerritorios() {

  fetch("data/territorios_indigenas.geojson")
    .then(r => r.json())
    .then(data => {

      L.geoJSON(data, {

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

          layer.on("mouseover", () => {
            layer.setStyle({
              color: "#ffff00",
              weight: 4
            });
          });

          layer.on("mouseout", () => {
            layer.setStyle(estiloTerritorio(feature));
          });

          layer.on("click", () => {

            const key = nombre.trim().toUpperCase();

            console.log("Buscando:", key);
            console.log("JSON:", CREF_DATA[key]);

            actualizarPanel(key, CREF_DATA[key] || null);

          });
        }

      }).addTo(map);

    })
    .catch(err => console.error("Error GEOJSON:", err));
}
