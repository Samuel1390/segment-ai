// scripts/copy-icons.js
const fs = require("fs");
const path = require("path");

const sourceDir = path.join(process.cwd(), "node_modules/omni-file/dist/icons");
const destDir = path.join(process.cwd(), "public/icons");

// 1. Asegura que el directorio de destino exista (lo crea si no existe)
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// 2. Lee todos los archivos SVG de la fuente y los copia uno por uno
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error("Error al leer el directorio fuente:", err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".svg") {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFile(sourcePath, destPath, (err) => {
        if (err) {
          console.error(`Error copiando ${file}:`, err);
        }
      });
    }
  });
  console.log("✅ Iconos copiados exitosamente.");
});
