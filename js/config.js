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
  ),

  "Carto Oscuro": L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    { attribution: "© CARTO" }
  )
};

// ===============================
// DATOS CREF (ejemplo)
// ===============================

const CREF_DATA = {
  "BORUCA": {
    beneficiario: "Asociación de Desarrollo Integral de la Reserva Indígena de Boruca",
    area_2024: 1509.26,
    variacion: 124.4,
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  },

  "CABECAR TALAMANCA": {
    beneficiario: "Asociación de Desarrollo Integral Cabécar Talamanca",
    area_2024: 25409.16,
    variacion: 0,
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  }
};
