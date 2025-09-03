import { useEffect, useState } from "react";
import { ContainerInfo } from "../../components/ContainerInfo/ContainerInfo";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Notices.css";
import requestApi from "../../requestApi";
import { useContext } from "react";
import { authContext } from "../../Hooks/Token/tokenState";
import InputForm from "../../components/InputForm/InputForm";
import { PopupConfirmation } from "../../components/PopupConfirmation/PopupConfirmation";
/* 
Il componente Bandi gestisce e visualizza un elenco di bandi recuperati da un'API.
- Utilizza useState per gestire lo stato locale:
  - noticesList contiene l'elenco dei bandi recuperati dall'API.
  - searchValue memorizza il valore della barra di ricerca.
- useEffect viene utilizzato per eseguire una chiamata API ogni volta che searchValue cambia.
- La funzione fetchBandi recupera i dati dall'endpoint "http://localhost:8080/Bandi" tramite axios.
- Ogni bando recuperato viene visualizzato tramite il componente ContainerInfo, che riceve i dati del bando come prop.
- Lo stile del componente è gestito tramite il file CSS "Bandi.css".
*/

export function Notices() {
  const [noticesList, setNoticesList] = useState([]);
  const defaultNotice = {
    title: "",
    body: "",
    object: "",
    files: []
  }
  const [newItem, setNewItem] = useState(defaultNotice);
  const [searchData, setSearchData] = useState({ text: "", date: "", isOrdGrow: true });
  const [isInputPopupOpen, setInputPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [deleteNoticeId, setDeleteNoticeId] = useState(null);


  const { role } = useContext(authContext)



  const fetchNotices = async () => {
    const notices = await requestApi.get("/Notices", {
      params: {
        data: searchData.text,
        isOrdGrow: searchData.isOrdGrow,
        date: searchData.date,


      }
    });

    setNoticesList(notices.data);
  };

  useEffect(() => {
    fetchNotices();
  }, [searchData.text, searchData.isOrdGrow, searchData.date]);


  const sendNotice = async () => {
    try {
      const form = new FormData();
      Array.from(newItem.files).forEach(f => form.append("files", f));
      form.append("newItem", JSON.stringify(newItem));
      const resp = await requestApi.post("/Notices", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Inserimento avvenuto con successo");
      setNoticesList([...noticesList, resp.data.notice]);
      setNewItem(defaultNotice);
      setInputPopupOpen(false);
    } catch (error) {
      alert("Impossibile inviare il bando");
      console.error("Errore nell'invio del bando:", error);
    }
  }



  const handleDeleteBando = async () => {
    console.log(deleteNoticeId)
    try {
      await requestApi.delete(`/Notices/delete/`, { params: { notice_id: deleteNoticeId } });
      // Aggiorna la lista bandi dopo la cancellazione (es. ricarica i dati)
      setNoticesList(noticesList.filter(bando => bando.notice_id !== deleteNoticeId))
    } catch (error) {
      console.error("Errore eliminazione bando:", error);
      setConfirmPopupOpen(false);
    }
    setConfirmPopupOpen(false);
    setDeleteNoticeId(null);
  };


  return (
    <section id="sezione_bandi">
      {isConfirmPopupOpen && <PopupConfirmation title={"Elimina Bando"} message={"Sei sicuro di voler eliminare questo bando?"} onCancel={() => { setConfirmPopupOpen(false); setDeleteNoticeId(null); }} onConfirm={() => handleDeleteBando()} />}
      {isInputPopupOpen && <InputForm onClose={() => setInputPopupOpen(false)} title={"Carica Bando"} newItem={newItem} setNewItem={setNewItem} enablePdf={true} enableImg={false} onSuccess={sendNotice} />}
      <div className="bandi">
        <PageTitle
          title={"Bandi"}
          searchLabel={"Search:"}
          searchData={searchData}
          setSearchData={setSearchData}
        />

        {role === "president" && (<button className="uploadButton" onClick={() => setInputPopupOpen(true)}
        >Carica Bando </button>)}
        {(noticesList.length === 0) ? <div>Nessun risultato trovato</div> :

          noticesList.map((bando, index) => (
            <ContainerInfo
              key={index}
              title={bando.title}
              object={bando.object}
              description={bando.body}
              createdAt={bando.createdAt}
              Pdfs={bando.Pdfs}
              enableDelete={role === "president"}
              onDelete={() => { setDeleteNoticeId(bando.notice_id); setConfirmPopupOpen(true) }}
            />

          ))
        }
      </div>





    </section>

  );
}
