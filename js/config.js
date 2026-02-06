// ===============================
// MAPAS BASE
// ===============================

const baseMaps = {
  "OpenStreetMap": L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "© OpenStreetMap" }
  ),

  "Carto Claro": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  )
};

// ===============================
// DATOS CREF
// ===============================

const CREF_DATA = {
  "BORUCA": {
    clasif: "CREF y PAFs",
    area: {
      2023: 1485.9,
      2024: 1509.26
    },
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  },

  "CABECAR TALAMANCA": {
    clasif: "CREF y PAFs",
    area: {
      2023: 25408,
      2024: 25409.16
    },
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  }
};
