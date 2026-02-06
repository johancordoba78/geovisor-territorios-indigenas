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
// DATOS CREF + CLASIFICACIÓN
// CLAVE = NOMBRE DEL TERRITORIO
// (MAYÚSCULAS, SIN TILDES)
// ===============================

const CREF_DATA = {

  "BORUCA": {
    beneficiario: "Asociación de Desarrollo Integral de la Reserva Indígena de Boruca",
    area_2024: 1509.26,
    area_2023: 1384.90,
    variacion: 124.36,
    clasificacion: "CREF y PAFS",
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  },

  "CABECAR TALAMANCA": {
    beneficiario: "Asociación de Desarrollo Integral Cabécar de Talamanca",
    area_2024: 25409.16,
    area_2023: 25409.16,
    variacion: 0,
    clasificacion: "CREF y PAFS",
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  },

  "BRIBRI TALAMANCA": {
    beneficiario: null,
    area_2024: null,
    area_2023: null,
    variacion: null,
    clasificacion: "Sin CREF ni PAFS",
    adenda: "—",
    rosa: "—",
    pendiente: "—"
  },

  "CABAGRA": {
    beneficiario: null,
    area_2024: null,
    area_2023: null,
    variacion: null,
    clasificacion: "Solo PAFS",
    adenda: "—",
    rosa: "—",
    pendiente: "—"
  },

  "ALTO CHIRRIPO": {
    beneficiario: null,
    area_2024: null,
    area_2023: null,
    variacion: null,
    clasificacion: "Sin CREF ni PAFS",
    adenda: "—",
    rosa: "—",
    pendiente: "—"
  }

};

// ===============================
// COLORES POR CLASIFICACIÓN
// ===============================

const CLASIFICACION_COLOR = {
  "CREF y PAFS": "#c67c2d",
  "Solo PAFS": "#9e9e9e",
  "Sin CREF ni PAFS": "#d9d9d9"
};
