
# Backend
Il server di back-end si occupa della gestione delle informazioni. I client e il server scambiano informazioni informazioni tramite [richieste](#express). Il server di back-end è in relazione diretta con il [Database](Database.md) che contiene i dati.



## Librerie

### Express
<a href=https://expressjs.com/it/guide/routing.html>Express</a> è il cuore del nostro server di back-end, ci consente di definire le **route** per effettuare le varie richieste (GET, POST,...) dai vari [client](Front-end.md).

Le richieste possono essere inviate/ricevute in diversi formati  intercambiabili. Con **Express** si definisce il formato con il comando:
```js
const app = express();
app.use(express.json()); //<--
```
Ogni richiesta va fatta specficando una "rotta":
```
indirizzo del server/router/route
```
Richiesta al router:
```js
const authenticationRouter = require("./routes/Authentication_route");
app.use('/Authentication', authenticationRouter);
//this route must be authorized
const userRouter = require("./routes/Users_route");
app.use('/User', userRouter);
```
All'interno del router abbiamo tante funzioni legate ad una specifica richiesta (Get, Post, ...) e ad una specifica rotta:
```js
router.post("/addNewUser", tokenValidation, userController.addNewUser);
router.post("/forceAddNewUser", userController.addNewUser); //permette di aggiungere un nuovo utente senza token

router.get("/getUserTest", tokenValidation, userController.getUserFromToken )

module.exports = router;

```
Ogni rotta fa riferimento ad un controller dove è definita la logica necessaria al compimento della richiesta:
```js
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rms072296@gmail.com",
    pass: "kcjm pisb jzqk oprp ",
  },
});


exports.addNewUser = async (req, res) => {
  const psswd = Math.random().toString(36).slice(-8);
  const userData = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(psswd, salt);
    userData.password = hash;
    await Users.create(userData);
  } catch (err) {
    console.log(err);
    return res.json("Utente non inserito");
  }

  const info = transporter.sendMail({
    from: '"Associazione Vogatori Ostuni", rms072296@gmail.com',
    to: userData.mail,
    subject: "Test",
    text: "Ciao questa è la tua password " + psswd,
  });
  return res.json("Utente Inserito");
};

exports.getUserFromToken = async (req, res) => {
  res.json(req.user);
};
```
In questo esempio viene mostrata la rotta per la gestione degli utenti. Una richiesta di inserimento di un nuovo utente deve essere di tipo **post** fatta all'indirizzo: `indirizzoServer/User/addNewUser`.
#### Tipologia richieste
- **POST**: Invia dati al server usando la risorsa indicata.
Una richiesta POST viene, in genere, inviata tramite un form HTML e comporta una modifica sul server. In questo caso, il tipo di contenuto viene gestito dell’elemento <form> nella pagina. Valori possibili per il tipo di contenuto sono application/x-www-form-urlencoded e multipart/form-data.
Quando la richiesta POST viene inviata tramite un metodo diverso da un form HTML, ad esempio tramite XMLHttpRequest, il body può essere di qualsiasi tipo (per esempio application/json)
- **GET**: Richiede la risorsa indicata, che il server fornisce come body della risposta. Poiché è usata per richiedere dati al server non dovrebbe includere un body (anche se incluso, verrà scartato all'invio della richiesta).
- **HEAD**: Ha lo stesso effetto della GET, ma la risposta del server è senza il body.
Può risultare utile da eseguire prima della GET per ottenere dal server informazioni sulla dimensione della risorsa, fornite nella risposta del server con l’header Content-Length.
- **PUT**: Crea una nuova risorsa o sostituisce la risorsa indicata con il body della richiesta.
A differenza del metodo POST, il metodo PUT è idempotente: chiamarlo una o più volte successivamente ha lo stesso effetto, mentre successive richieste `POST identiche possono avere effetti aggiuntivi (per esempio a ogni POST creo un nuovo ordine su un server di e-commerce).
- **DELETE**: Elimina la risorsa indicata.
- **PATCH**: Applica una modifica parziale alla risorsa.
Come il metodo POST può avere effetti aggiuntivi ogni volta che è chiamata su una risorsa (quindi non è idempotente).
A differenza del metodo PUT, nel body del metodo PATCH possono essere indicate delle “istruzioni” per modificare la risorsa.
Non tutti i server web implementano questo metodo per le varie risorse.
- **OPTIONS**: Chiede le opzioni di comunicazione per la risorsa indicata (per esempio il server può rispondere quali altri metodi sono applicabili alla risorsa).


### Sequelize
<a href=https://sequelize.org/docs/v6/category/core-concepts>Sequelize</a> è vitale per il progetto, consente tutte le operazioni legate al [Database](Database.md) in quanto consente la creazione di tutte le tabelle necessarie, e tutte le operazioni **CRUD** legate alle query.
Questa libreria consente di creare dei **modelli** che rappresentano le tabelle del nostro [Database](Database.md).

 I **Modelli** definiti sono delle classi con attributi le features della tabella e i metodi che consentono di fare operazioni sul db (query):
 ```

 ```
Il vantaggio di questa libreria è che una volta avvenuta la connessione al [Database](Database.md), in automatico creerà le tabelle o aggiornerà quelle esistenti senza doverlo fare a mano. Questo consente un rapido deploy. Inoltre l'uso dei modelli rende sicure le transazioni.

#### Configurazione di Sequelize

La connessione al **Database** avviene in automatico all'esecuzione del [Database](Database.md). La libreria [sequelize](Back-end.md#sequelize) ha un file di configurazione situato in: 
```shell
backend-serv
├── package.json
├── package-lock.json
└── src
    ├── config
    │   └── config.json   #<---Questo è il file di configurazione
    ├── controllers
    │   ├── faq_controllers
    │   │   └── faqControllers.js
    │   ├── gallery_controllers
    │   │   └── galleryController.js
    │   └── news_controllers
    │       └── newsController.js
    ├── models
    │   ├── FAQ_questions.js
    │   ├── Gallery_Images.js
    │   ├── index.js
    │   ├── InternalRegulations.js
    │   ├── News.js
    │   ├── Notices.js
    │   ├── Pdfs.js
    │   └── Users.js
    ├── routes
    │   ├── Bandi_route.js
    │   ├── FAQ_routes.js
    │   ├── GalleryImages_routes.js
    │   ├── Notizie_routes.js
    │   └── Regolamento_routes.js
    └── server.js
```

Quando si effettua il pull, dopo aver eseguito l'[Installazione](Installazione.md), bisogna creare questo file (config.json) nel folder config, come da albero mostrato quì sopra. Il file contiene un *Json* con le credenziali di accesso al database e il tipo di linguaggio come mostato di seguito:
```json
{

	"development":{
	
		"username": "inserire username",
		
		"password": "Password o null(senza virgolette)",
		
		"database": "Nome del database",
		
		"host": "127.0.0.1 (localhost) o indirizzo del server contente il db",
		
		"dialect": "dialetto di sql in uso dal db (mariadb, mysql, etc...)"

	},

	"test": {
	
		"username": "inserire username",
		
		"password": "Password o null(senza virgolette)",
		
		"database": "Nome del database",
		
		"host": "127.0.0.1 (localhost) o indirizzo del server contente il db",
		
		"dialect": "dialetto di sql in uso dal db (mariadb, mysql, etc...)"

	},

	"production": {
		
		"username": "inserire username",
		
		"password": "Password o null(senza virgolette)",
		
		"database": "Nome del database",
		
		"host": "127.0.0.1 (localhost) o indirizzo del server contente il db",
		
		"dialect": "dialetto di sql in uso dal db (mariadb, mysql, etc...)"

	}

}
```

Una volta completati i campi con l'username la password e il nome del [Database](Database.md) possiamo procedere con l'[Installazione](Installazione.md).

### Bcryptjs
Questa libreria ci consente di cryptare delle informazioni tramite una **funzione di hashing**. Usata per cryptaggio nel [front-end](Front-end.md#bcryptjs), nel back-end la si usa solo per la funzione di confronto tra password e valore hash:
```
 compare(data, encrypted, cb)

    data - [REQUIRED] - data to compare.
    encrypted - [REQUIRED] - data to be compared to.
    cb - [OPTIONAL] - a callback to be fired once the data has been compared. uses eio making it asynchronous. If cb is not specified, a Promise is returned if Promise support is available.
        err - First parameter to the callback detailing any errors.
        same - Second parameter to the callback providing whether the data and encrypted forms match [true | false].
```

### Nodemailer
Libreria utilizzata per l'invio automatizzato delle mail. Per poter utilizzare questa libreria va prima configurata e istanziata:
```js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", //< usiamo un servizio google
  auth: {
    user: "rms072296@gmail.com", //< mail con la quale inviare i messaggi
    pass: "kcjm pisb jzqk oprp ", //< password del servizio google
  },
});
```
E poi possiamo utilizzarla per l'invio di mail:
```js

  const info = transporter.sendMail({
    from: '"Associazione Vogatori Ostuni", <rms072296@gmail.com>',
    to: userData.mail,
    subject: "Test",
    text: "Ciao questa è la tua password " + psswd,
  });
```
Per ulteriori informazioni vedere la [guida](https://nodemailer.com/) sul sito.

### Json Web Token


### Cors
