const map = L.map("map").setView([9.6, -84.1], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

// DATOS SIMULADOS (PRUEBA)
const ejemploTerritorio = {
  TERRITORIO: "BORUCA",
  BENEFICIARIO:
    "Asociación de Desarrollo Integral de la Reserva Indígena de Boruca",
  RES_2023: 1384.9,
  RES_2024: 1509.26,
  ADENTA: "SI",
  ROSA: "PENDIENTE",
  PENDIENTE: "NO"
};

// Cargar ficha al inicio (prueba)
actualizarPanel(ejemploTerritorio);
