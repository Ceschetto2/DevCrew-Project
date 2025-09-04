const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- util: crea cartelle se non esistono
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// --- storage: cartella diversa in base al campo
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    let dest = "";
    if (file.fieldname === "files") dest = "uploads/pdfs";
    if (file.fieldname === "imgs") dest = "uploads/images";
    ensureDirSync(dest);
    cb(null, dest);
  },
  filename: (req, file, cb) => {

    // evita collisioni: timestamp + nome pulito
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeBase = base.replace(/[^a-z0-9_\-\.]/gi, "_");
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

// --- filtri MIME separati per campo
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "files") {
    if (file.mimetype === "application/pdf") return cb(null, true);
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo PDF per il campo 'pdfs'"));
  }
  if (file.fieldname === "imgs") {
    console.log(file.mimetype)
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo immagini per il campo 'imgs'"));
  }
  return cb(null, false);
  

};

// --- limiti
exports.upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 10MB per file
    files: 20,                  // max file totali
    fieldSize: 2 * 1024 * 1024, // 2MB per i campi testo
  },
});
