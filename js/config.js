// ===============================
// CARGA DE DATOS CREF
// ===============================

let CREF_DATA = {};

function cargarCREFData() {
  fetch("data/cref_resumen.csv")
    .then(r => r.text())
    .then(text => {
      const filas = text.split("\n").map(f => f.trim()).filter(Boolean);
      const headers = filas[0].split(",");

      for (let i = 1; i < filas.length; i++) {
        const valores = filas[i].split(",");
        let obj = {};
        headers.forEach((h, idx) => obj[h] = valores[idx] ?? null);
        CREF_DATA[obj.TERRITORIO] = obj;
      }

      console.log("✔ Datos CREF cargados", CREF_DATA);
    });
}

cargarCREFData();
