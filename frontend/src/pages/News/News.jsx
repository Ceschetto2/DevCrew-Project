import { useEffect, useState } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./News.css";
import requestApi from "../../requestApi";
import InputForm from "../../components/InputForm/InputForm";
import { useContext } from "react";
import { authContext } from "../../Hooks/Token/tokenState";
import { PopupConfirmation } from "../../components/PopupConfirmation/PopupConfirmation";

/* 
Il componente Notizie gestisce e visualizza un elenco di notizie recuperate da un'API.
- Utilizza useState per gestire lo stato locale:
  - searchValue memorizza il valore della barra di ricerca.
  - newsList contiene le notizie recuperate dall'API.
- useEffect viene utilizzato per eseguire una chiamata API ogni volta che searchValue cambia.
- La funzione fetchNotizie recupera i dati dall'endpoint "http://localhost:8080/Notizie" tramite axios,
  passando il valore di searchValue come parametro di ricerca.
- Se non ci sono risultati, viene mostrato un messaggio "Nessun risultato trovato".
- Ogni notizia recuperata viene visualizzata tramite il componente ContainerInfo, che riceve i dati della notizia come prop.
*/

export function News() {
  const { role } = useContext(authContext)
  const [searchData, setSearchData] = useState({ text: "", date: "", isOrdGrow: true });
  const [inputPopup, setInputPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState(null);
  const [newsList, setnewsList] = useState([])

  const defaultNews = {
    title: "",
    body: "",
    object: "",
    files: [],
    imgs: [],
  }

  const [newItem, setNewItem] = useState(defaultNews);

  useEffect(() => {
    const fetchNotizie = async () => {
      const results = await requestApi.get("/News",
        {
          params: { data: searchData.text, date: searchData.date, isOrdGrow: searchData.isOrdGrow },
        }
      )
      setnewsList(results.data)
    }
    fetchNotizie();

  }, [searchData.text, searchData.date, searchData.isOrdGrow])


  const sendNotizia = async () => {
    try {
      const formData = new FormData();
      Array.from(newItem.imgs).forEach(img => formData.append("imgs", img));
      formData.append("newItem", JSON.stringify(newItem));
      const resp = await requestApi.post("/News", formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      console.log(resp.data)
      alert("Inserimento Avvenuto con Successo")
      setnewsList([...newsList, resp.data.news])
      setNewItem(defaultNews)
      setInputPopupOpen(false);
    } catch (err) {
      alert("Impossibile inviare la notizia")
    }
  }

  const handleDelete = async (id) => {
    console.log(id)
    try {
      await requestApi.delete(`/News/delete/`,
        { params: { news_id: id } }
      );
      setnewsList(newsList.filter((notizia) => notizia.news_id !== id));
      alert("Rimozione effettuata con successo")
    } catch (error) {
      alert("Impossibile effettuare la rimozione")
      console.log(error);
    }
    setDeleteImageId(null);
    setConfirmPopupOpen(false)
  }
  




  return (
    <section id="sezione_notizie">
        {isConfirmPopupOpen && <PopupConfirmation title={"Rimozione Notizia"} message={"Sicuro di voler rimuovere la notizia?"} onConfirm={()=>handleDelete(deleteImageId)} onCancel={() => {  setDeleteImageId(null);setConfirmPopupOpen(false) }} />}

      <div className="notizie">
        {inputPopup && <InputForm onClose={() => setInputPopupOpen(false)} title="Aggiungi Notizia" newItem={newItem} setNewItem={setNewItem} enablePdf={false} enableImg={true} onSuccess={sendNotizia} />}


        <PageTitle title={"Notizie"} searchLabel={"Search:"} searchData={searchData} setSearchData={setSearchData} />
        {role === "president" && <button className="uploadButton" onClick={() => setInputPopupOpen(true)}>Aggiungi Notizia</button>}
        {newsList.length === 0 ? <div>Nessun risultato trovato</div> :
          newsList.map((notizia, index) => (
            <ContainerInfo key={index} img_url={notizia.img_url} description={notizia.description} title={notizia.title} object={notizia.object} createdAt={notizia.createdAt} enableDelete={role === "president"} onDelete={ () =>{ setDeleteImageId( notizia.news_id); setConfirmPopupOpen(true)}} />
          ))}



      </div>
    </section>

  );
}


function ContainerInfo({ img_url, title, object, description, enableDelete, createdAt, onDelete }) {
  if (!(title || object || description)) return null;
  return (
    <div className="container-news">
      <div className="image-frame-news">
        <img src={img_url} alt="Immagine mancante" />
      </div>
      <div className="text-box">
        <div className="header-box-news">
          <text className="titolo_n" alt="titolo"> {title} </text>
          <text className="data-pubblicazione" alt="nan "> data pubblicazione: {transformDate(createdAt)}  </text>

        </div>
      
        <text className="oggetto" alt="oggetto"> {object}  </text>
        <div className="descrizionebox">
        <text className="descrizione" alt="descrizione "> {description}  </text>
         </div>

          { enableDelete &&<div className="delete-button-div" onClick={onDelete}>Rimuovi</div>}
      </div>
    
      
   </div>
  );
}

function transformDate(dataString) {
  return new Date(dataString).toLocaleDateString();


}