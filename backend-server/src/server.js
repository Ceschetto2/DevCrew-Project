/* 
Il file server.js configura e avvia un server Express per gestire le richieste API.
- Utilizza il middleware express.json() per il parsing del corpo delle richieste in formato JSON.
- Configura il middleware CORS per consentire richieste provenienti dall'origine "http://localhost:5173".
- Importa e utilizza i router per diverse risorse:
  - /GalleryImages: gestisce le richieste relative alle immagini della galleria.
  - /Faq: gestisce le richieste relative alle domande frequenti.
  - /Notizie: gestisce le richieste relative alle notizie.
  - /Regolamento: gestisce le richieste relative al regolamento.
  - /Bandi: gestisce le richieste relative ai bandi.
- Sincronizza il database utilizzando Sequelize e avvia il server sulla porta 8080.
*/


const multer= require("multer");
const express = require("express");
require("dotenv").config(); 
const app = express()

app.use(express.json());


const path = require("path");



const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"]
};

app.use(cors(corsOptions));

const db = require("./models");

const galleryImageRouter = require("./routes/GalleryImages_routes");
app.use("/GalleryImages", galleryImageRouter);
const faqRouter = require("./routes/FAQ_routes");
app.use("/Faq", faqRouter);
const newsRouter = require("./routes/News_routes");
app.use("/News", newsRouter);
const RuleBookRouter = require("./routes/RuleBook_routes");
app.use("/RuleBook", RuleBookRouter);


const noticesRouter = require("./routes/Notices_route");
app.use("/Notices", noticesRouter);
const authenticationRouter = require("./routes/Authentication_route");
app.use('/Authentication', authenticationRouter);
//this route must be authorized
const userRouter = require("./routes/Users_route");
app.use('/User', userRouter);
const wheatherRouter = require("./routes/Weather_route");
app.use('/Weather', wheatherRouter);
const eventsRouter = require("./routes/Events_route");
app.use('/Events', eventsRouter);
const societyRouter = require("./routes/Society_route");
app.use('/Society', societyRouter);
const AiChat_router=require("./routes/AiChat_route");
app.use("/AiChat", AiChat_router);
const Announce_router= require("./routes/Announce_route");
app.use("/Announce",Announce_router);


//senza lo static, i file salvati sul disco non sarebbero raggiungibili dal broswer.
// Con /files pubblichi in sola lettura la cartella uploads
app.use('/files', express.static(path.join(__dirname, '../uploads')));

db.sequelize.sync().then(() => {
  app.listen(8080, () => {
    console.log("server started on port 8080");
  });
});

