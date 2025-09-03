import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownWideShort, faArrowUpShortWide, faArrowUpWideShort, faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
/* 
Il componente SearchBar rappresenta una barra di ricerca con un'etichetta, un campo di input e un pulsante.
- Accetta tre prop:
  - label: il testo dell'etichetta visualizzata accanto alla barra di ricerca.
  - searchValue: il valore corrente del campo di input.
  - setSearchValue: la funzione per aggiornare il valore del campo di input.
- L'input è controllato, quindi il valore è sincronizzato con lo stato passato tramite searchValue.
- Il pulsante include un'icona di ricerca, ma non sembra avere un'azione associata nel codice mostrato.
- Lo stile del componente è gestito tramite il file CSS "SearchBar.css".
*/

export function SearchBar({ label, searchData, setSearchData }) {
  const setSearchValue = e => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  }


  // Stato per gestire l'apertura e la chiusura del popup di filtro
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  // Funzione per gestire il click sul pulsante di filtro
  const handleFilterClick = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  }


  const outsideClickRef = useRef(null);

  const handleClickOutside = (event) => {
    if (outsideClickRef.current && !outsideClickRef.current.contains(event.target)) {
      setIsFilterPopupOpen(false);
    }
  };

  // Aggiunta e rimozione del listener
  useEffect(() => {
    // Aggiunge l'evento al montaggio
    document.addEventListener('mousedown', handleClickOutside);

    // Rimuove l'evento allo smontaggio
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  return (

    <div className="search-container">
      <label className="label">{label}</label>
      <input className="search-bar" name="text" value={searchData.text} type="text" placeholder="Cerca..."
        onChange={setSearchValue}
      />

      <button className="search-button">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="icon" />
      </button>
      <div ref={outsideClickRef}>
        <button className="filter-button" onClick={handleFilterClick} >
          <FontAwesomeIcon icon={faFilter} className="icon" />
        </button>
        {isFilterPopupOpen && (
          <div className="filter-popup">
            Ordine:

            <div className="order-buttons">
              <span>{searchData.isOrdGrow ? "Crescente" : "Decrescente"}</span>
              <button name="isOrdGrow" onClick={() => setSearchData({ ...searchData, isOrdGrow: !searchData.isOrdGrow })}>
                <FontAwesomeIcon icon={searchData.isOrdGrow ? faArrowUpWideShort : faArrowDownWideShort} />
              </button>
            </div>
            Data:
            <input value={searchData.date} name="date" type="date" onChange={setSearchValue} />
          </div>
        )}
      </div>
    </div>

  );
}
