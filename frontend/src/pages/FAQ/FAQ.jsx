import { useEffect, useState } from "react";
import { DropDownInfo } from "../../components/DropDownInfo/DropDownInfo";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./FAQ.css";
import requestApi from "../../requestApi";

/* 
Il componente FAQ gestisce e visualizza un elenco di domande frequenti (FAQ) recuperate da un'API.
- Utilizza useState per gestire lo stato locale:
  - searchValue memorizza il valore della barra di ricerca.
  - FaqList contiene l'elenco delle FAQ recuperate dall'API.
- useEffect viene utilizzato per eseguire una chiamata API ogni volta che searchValue cambia.
- La funzione fetchFaq recupera i dati dall'endpoint "http://localhost:8080/Faq" tramite axios,
  passando il valore di searchValue come parametro di ricerca.
- Ogni FAQ recuperata viene visualizzata tramite il componente DropDownInfo, che riceve la domanda e la risposta come prop.
- Lo stile del componente è gestito tramite il file CSS "FAQ.css".
*/

export function FAQ() {

  const [searchData, setSearchData] = useState({text: "", date: "", isOrdGrow: true});

  const [FaqList, setFaqList] = useState([]);
  useEffect(() => {
    const fetchFaq = async () => {
      const response = await requestApi.get("/Faq", {
        params: { data: searchData },
      });

      setFaqList(response.data);
      
    };
    fetchFaq();

  }, [searchData.text]);

  return (
    <div className="faq-container">
      <PageTitle
        title="FAQ"
        searchLabel="Search:"
        searchData={searchData}
        setSearchData={setSearchData}
      />

      {FaqList.map((domanda, index)=>(<DropDownInfo key={index} answare={domanda.answare} question={domanda.question} />))}
    </div>
  );
}
