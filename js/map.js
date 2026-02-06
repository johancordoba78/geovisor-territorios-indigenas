// ===============================
// MAPA BASE
// ===============================

const map = L.map("map", {
  center: [9.6, -84.2],
  zoom: 7,
  layers: [baseMaps["OpenStreetMap"]]
});

// Control de mapas base
L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);

// ===============================
// VARIABLES GLOBALES (PANEL)
// ===============================

window.territorioActivo = null;
window.datosActivos = null;

// ===============================
// FUNCIÓN DE CLASIFICACIÓN
// ===============================

function obtenerClasificacion(nombre) {
  const datos = CREF_DATA[nombre];

  if (!datos) return "Sin CREF ni PAFs";

  // Ajustá esto si luego separás CREF / PAFs
  if (datos.clasif === "Solo PAFs") return "Solo PAFs";
  if (datos.clasif === "CREF y PAFs") return "CREF y PAFs";

  // Por defecto
  return "CREF y PAFs";
}

// ===============================
// ESTILO POR CLASIFICACIÓN
// ===============================

function estiloTerritorio(feature) {
  const nombre = feature.properties.TERRITORIO?.trim().toUpperCase();
  const clasif = obtenerClasificacion(nombre);

  let fillColor = "#999999"; // gris → sin datos

  if (clasif === "CREF y PAFs") fillColor = "#c67c2d";   // café
  if (clasif === "Solo PAFs") fillColor = "#f2c94c";    // amarillo

  return {
    color: "#444",
    weight: 1,
    fillColor: fillColor,
    fillOpacity: 0.7
  };
}

// ===============================
// CARGA DE TERRITORIOS INDÍGENAS
// ===============================

fetch("data/territorios_indigenas.geojson")
  .then(res => res.json())
  .then(data => {

    const capaTerritorios = L.geoJSON(data, {
      style: estiloTerritorio,

      onEachFeature: (feature, layer) => {
        const nombre = feature.properties.TERRITORIO
          ?.trim()
          .toUpperCase();

        const datos = CREF_DATA[nombre] || null;
        const clasif = obtenerClasificacion(nombre);

        // TOOLTIP
        layer.bindTooltip(
          `<strong>${nombre}</strong><br>${clasif}`,
          { sticky: true }
        );

        // CLICK
        layer.on("click", () => {
          window.territorioActivo = nombre;
          window.datosActivos = datos;

          actualizarPanel(nombre, datos);
        });
      }
    });

    capaTerritorios.addTo(map);
  })
  .catch(err => console.error("Error cargando territorios:", err));
