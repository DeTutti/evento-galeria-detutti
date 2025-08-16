import express from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const app = express();
const upload = multer({ dest: "uploads/" });

// Configuración de Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Ruta de prueba: subir una imagen
app.post("/upload", upload.single("foto"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "evento-galeria",
    });
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
import path from "path";
import { fileURLToPath } from "url";

// Esto es necesario para obtener la ruta correcta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir index.html cuando alguien entra a "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
