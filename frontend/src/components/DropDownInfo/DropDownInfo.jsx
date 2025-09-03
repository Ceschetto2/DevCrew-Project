import { useState } from "react";
import "./DropDownInfo.css";

/* 
Il componente DropDownInfo rappresenta un elemento a tendina per visualizzare una domanda e la relativa risposta.
- Accetta due prop:
  - question: il testo della domanda da visualizzare.
  - answare: il testo della risposta associata alla domanda.
- Utilizza useState per gestire lo stato locale:
  - clicked: determina se la risposta è visibile o nascosta.
- La visibilità della risposta cambia quando l'utente clicca sull'elemento.
- Lo stile del componente è gestito tramite il file CSS "DropDownInfo.css".
*/

export function DropDownInfo({ question, answare }) {
  const [clicked, setClicked] = useState(true);
  const handleClick = () => {
    setClicked(!clicked);
  };
  return (
    <div className="question-container" onClick={handleClick}>
      <text className="testo-domanda">{question}</text>

      {clicked ? <></> : <div className="question-container expanded">
        {answare}
      
        
        </div>}
    </div>
  );
}
