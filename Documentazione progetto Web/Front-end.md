Un sito web è un progetto che può arrivare ad avere notevoli dimensioni in termini di righe di codice pertanto si suddividono le funzioni e i vari componenti suddividendoli in vari file eseguendo una divisione del codice che rende più facile il debug/comprensione dell'intero progetto. La nostra file structure (attualmente incompleta) è composta come segue:
```
react/
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── Assets
│   │   ├── header-logo.png
│   │   └── search.png
│   ├── components
│   │   ├── ContainerInfo
│   │   │   ├── ContainerInfo.css
│   │   │   └── ContainerInfo.jsx
│   │   ├── DropDownInfo
│   │   │   ├── DropDownInfo.css
│   │   │   └── DropDownInfo.jsx
│   │   ├── Footer
│   │   │   ├── Footer.css
│   │   │   └── Footer.jsx
│   │   ├── ImgGallery
│   │   │   ├── ImgGallery.css
│   │   │   └── ImgGallery.jsx
│   │   ├── ImgSlideShow
│   │   │   ├── ImgSlideShow.css
│   │   │   └── ImgSlideShow.jsx
│   │   ├── LoginPopup
│   │   │   ├── LoginPopup.css
│   │   │   └── LoginPopup.jsx
│   │   ├── Navbar
│   │   │   ├── Navbar.css
│   │   │   ├── Navbar.jsx
│   │   │   └── NavbarLogin.jsx
│   │   ├── PageTitle
│   │   │   ├── PageTitle.css
│   │   │   └── PageTitle.jsx
│   │   └── SearchBar
│   │       ├── SearchBar.css
│   │       └── SearchBar.jsx
│   ├── Data
│   │   └── lista_sviluppatri.json
│   ├── Hooks
│   │   └── Token
│   │       └── tokenState.jsx
│   ├── index.css
│   ├── Layout.css
│   ├── Layout.jsx
│   ├── main.jsx
│   └── pages
│       ├── Bandi
│       │   ├── Bandi.css
│       │   └── Bandi.jsx
│       ├── Dashboard
│       │   ├── Dashboard.css
│       │   └── Dashboard.jsx
│       ├── FAQ
│       │   ├── FAQ.css
│       │   └── FAQ.jsx
│       ├── Gallery
│       │   ├── Gallery.css
│       │   └── Gallery.jsx
│       ├── Home
│       │   ├── Home.css
│       │   └── Home.jsx
│       ├── Notizie
│       │   ├── Notizie.css
│       │   └── Notizie.jsx
│       └── Regolamento
│           ├── Regolamento.css
│           └── Regolamento.jsx
└── vite.config.js
```
La root directory (la cartella che contiene tutto il progetto) è chiamata react.
Tutto il codice sviluppato è contenuto nella cartella **src** che inizialmente conterrà solamente i file **App.jsx** e **main.jsx**.

La cartella **node_modules** contiene tutti i moduli di javascript installati mentre il **package.json** contiene la lista di moduli necessari e presenti nel progetto che vengono automaticamente installati all'esecuzione del comando:
```bash
npm install
```
come descritto nella [Installazione](Installazione.md). Questi file vengono automaticamente aggiornati quando si installa un nuovo pacchetto quindi non ce ne dobbiamo preoccupare.

Abbiamo scelto di suddividere i file seguendo una logica molto semplice, il main contiene il metodo di esecuzione del progetto, in altre parole esegue **App.jsx**.

## Librerie
### React
### Axios

