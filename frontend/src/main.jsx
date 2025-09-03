import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//import 'bootstrap/dist/css/bootstrap.css';

/*
Il file main rappresenta il file dal quale viene eseguito il progetto. All'interno del codice trobiamo:
StrictMode: è un wrapper che aiuta a identificare potenziali problemi nel codice React.
createRoot(document.getElementById("root")) crea un punto di ingresso React per il rendering.
<App /> è il componente principale che verrà montato all'interno di #root.

Quando chiammiamo un componente react <App />, ad esempio, renderizziamo il codice presente nella funzione che exporta
e viene assemblto insieme al codice già presente fino a quel punto.

*/


import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

