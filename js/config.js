const baseMaps = {
  "OpenStreetMap": L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: "© OpenStreetMap" }
  )
};

const CREF_DATA = {
  "BORUCA": {
    clasif: "CREF y PAFs",
    area: { 2023: 1485.9, 2024: 1509.26 },
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  },
  "CABECAR TALAMANCA": {
    clasif: "CREF y PAFs",
    area: { 2023: 25408, 2024: 25409.16 },
    adenda: "SI",
    rosa: "PENDIENTE",
    pendiente: "NO"
  }
};
