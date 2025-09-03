import { useEffect, useState } from "react";
import { ContainerInfo } from "../../components/ContainerInfo/ContainerInfo";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./RuleBook.css";
import requestApi from "../../requestApi";
import { useContext } from "react";
import { authContext } from "../../Hooks/Token/tokenState";
import InputForm from "../../components/InputForm/InputForm";
import { PopupConfirmation } from "../../components/PopupConfirmation/PopupConfirmation";
/* Il componente Regolamento gestisce e visualizza un elenco di regole recuperate da un'API.
- Utilizza useState per gestire lo stato locale: 
  - ruleList contiene le regole recuperate dall'API.
  - searchValue memorizza il valore della barra di ricerca.
- La funzione fetchRegole recupera i dati dall'endpoint "http://localhost:8080/Regolamento" tramite axios e li salva in ruleList.
- Il componente PageTitle visualizza il titolo della pagina e include una barra di ricerca che aggiorna searchValue.
- Ogni regola recuperata viene visualizzata tramite il componente ContainerInfo, che riceve i dati della regola come prop.
*/

export function RuleBook() {
  const [ruleList, setRuleList] = useState([])
  const [searchData, setSearchData] = useState({ text: "", date: "", isOrdGrow: true });
  const defaultRule = {
    title: "",
    body: "",
    object: "",
    files: []
  }
  const [newRule, setNewRule] = useState(defaultRule);
  const { role } = useContext(authContext)
  const [inputPopupOpen, setInputPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false); 
  const [deleteRuleId, setDeleteRuleId] = useState(null);

  const fetchRules = async () => {
    const regole = await requestApi.get("/RuleBook",
      {
        params: { text: searchData.text, date: searchData.date, isOrdGrow: searchData.isOrdGrow },
      }
    )
    setRuleList(regole.data);
  }


  useEffect(() => {
    fetchRules()

  }, [searchData.text, searchData.date, searchData.isOrdGrow])

  async function handleDelete() {
    try {
      await requestApi.delete(`/RuleBook`, { params: {rule_id: deleteRuleId } })
      alert("Regolamentazione eliminata con successo")
      setRuleList(ruleList.filter(rule => rule.rule_id !== deleteRuleId))
    } catch (error) {
      alert("Errore durante la cancellazione")
      console.log(error)

    }finally{
    setConfirmPopupOpen(false)
    setDeleteRuleId(null)
    }
  }


  const sendRegolamento = async () => {
    try {
      const form = new FormData();
      Array.from(newRule.files).forEach(f => form.append("files", f, f.name));
      form.append("newRule", JSON.stringify(newRule));
      const results = await requestApi.post("/RuleBook",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      )
      alert("Insertimento avvenuto con successo")
      setRuleList([...ruleList, results.data.rule])
      setNewRule(defaultRule)
      setInputPopupOpen(false)
    }

    catch (err) {
      alert("Impossibile inviare il regolamento")
      console.log(err)
    }
  }

  return (
    <div className="regolamento">


      {inputPopupOpen ? <InputForm onClose={() => setInputPopupOpen(false)} title={"Carica Regolamento"} enablePdf={true} enableImg={false} newItem={newRule} setNewItem={setNewRule} onSuccess={sendRegolamento} /> : null}
      {isConfirmPopupOpen ? <PopupConfirmation title={"Eliminazione Regolamento"} message={"Sei sicuro di voler eliminare questo regolamento?"} onCancel={() => {setConfirmPopupOpen(false); setDeleteRuleId(null)}} onConfirm={() => handleDelete()} /> : null}

      <PageTitle title={"Regolamento"} searchLabel={"Search:"} searchData={searchData} setSearchData={setSearchData} />
      {(role === 'president') && <button className="uploadButton" onClick={() => setInputPopupOpen(true)}>Aggiungi regola</button>}
      {ruleList.length === 0 ? <div>Nessun risultato trovato</div> :
        ruleList.map((rule, index) => (
          <ContainerInfo key={index} title={rule.title} object={rule.object} description={rule.body} createdAt={rule.createdAt} Pdfs={rule.Pdfs}
            enableDelete={role === "president"}
            onDelete={() => {setDeleteRuleId(rule.rule_id); setConfirmPopupOpen(true)}} />
        ))}

    </div>

  );
}
