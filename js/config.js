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
// ÁREAS CREF POR AÑO
// ===============================
const CREF_DATA = {
  "BORUCA": {
    area: {
      2018: 1200.5,
      2019: 1210.3,
      2020: 1300.0,
      2021: 1350.2,
      2022: 1380.1,
      2023: 1384.9,
      2024: 1509.26
    }
  },

  "CABECAR TALAMANCA": {
    area: {
      2018: 25000,
      2019: 25050,
      2020: 25200,
      2021: 25300,
      2022: 25380,
      2023: 25409.16,
      2024: 25409.16
    }
  }
};
