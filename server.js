const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

app.use(express.static("public"));

let fotos = [];

// Subir imagen
app.post("/upload", upload.single("foto"), async (req, res) => {
  try {
    const resultado = await cloudinary.uploader.upload_stream(
      { folder: "evento" },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        fotos.push(result.secure_url);
        res.redirect("/");
      }
    );
    resultado.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Página principal
app.get("/", (req, res) => {
  let html = `
    <h1>Galería del Evento</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="foto" required />
      <button type="submit">Subir Foto</button>
    </form>
    <div>
      ${fotos.map(url => `<img src="${url}" width="200"/>`).join("")}
    </div>
  `;
  res.send(html);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
