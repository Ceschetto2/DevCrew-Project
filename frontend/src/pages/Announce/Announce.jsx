import { useEffect, useState } from "react";
import "./Announce.css";
import requestApi from "../../requestApi";

import { PageTitle } from "../../components/PageTitle/PageTitle";
import campanella from "../../Assets/campanella.png";
import { useContext } from "react";
import { authContext } from "../../Hooks/Token/tokenState";
import InputForm from "../../components/InputForm/InputForm";
import { PopupConfirmation } from "../../components/PopupConfirmation/PopupConfirmation";

export function Announce() {
  const [openUpload, setOpenUpload] = useState(false);
  const [announceInfo, setAnnounceInfo] = useState({ title: "", body: "" });
  const [searchData, setSearchData] = useState({
    text: "",
    date: "",
    isOrdGrow: true,
  });
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [deleteAnnounceId, setDeleteAnnounceId] = useState(null);

  const [AnnounceList, setAnnounceList] = useState([]);
  const { role } = useContext(authContext)



  const fetchAvvisi = async () => {
    const Avvisi = await requestApi.get("/Announce", { params: { data: searchData.text, date: searchData.date, isOrdGrow: searchData.isOrdGrow } });
    setAnnounceList(Avvisi.data);
  };



  useEffect(() => {
    console.log(searchData);
    fetchAvvisi();
  }, [searchData.text, searchData.isOrdGrow, searchData.date]);

  const handleDelete = async () => {
    try {
      await requestApi.delete("Announce/delete", {
        params: { announce_id: deleteAnnounceId },
      });
      alert("Rimozione Avvenuta con successo")
      setAnnounceList(
        AnnounceList.filter((Avvisi) => Avvisi.announce_id !== deleteAnnounceId)
      );
    } catch (error) {
      console.error("Errore nell'eliminazione dell'avviso", error);
    }
    setDeleteAnnounceId(null);
    setConfirmPopupOpen(false);
  };
  const handleSuccess = async () => {
    try {
      const response = await requestApi.post("/Announce", announceInfo)
      setAnnounceList([...AnnounceList, response.data.avviso]);
      setOpenUpload(false);
    }
    catch (error) {
      console.error(error)
    }

  }

  return (

    <section id="sezione_avvisi">
      {isConfirmPopupOpen && <PopupConfirmation title={"Eliminazione Avviso"} message={"Sei sicuro di voler eliminare questo avviso?"} onConfirm={() => handleDelete()} onCancel={() =>{setDeleteAnnounceId(null); setConfirmPopupOpen(false)}} />}
      {openUpload && <InputForm title={"Carica Avviso"} newItem={announceInfo} setNewItem={setAnnounceInfo} onSuccess={handleSuccess} onClose={() => setOpenUpload(false)}></InputForm>}
      <div className="avvisi">
        <PageTitle
          title={"Avvisi"}
          searchLabel={"Search:"}
          searchData={searchData}
          setSearchData={setSearchData}
        />

        {role === "president" && <button className="uploadButton" onClick={() => { setOpenUpload(true) }}>Aggiungi Avviso </button>}

        {AnnounceList.map(
          (Avvisi, index) => (
            (
              <ContainerInfo
                key={index}
                title={Avvisi.title}
                body={Avvisi.body}
                createdAt={Avvisi.createdAt}
                enableDelete={role === "president"}
                onDelete={()=>{setDeleteAnnounceId(Avvisi.announce_id); setConfirmPopupOpen(true)}}
              />
            )
          )
        )}
      </div>
    </section>
  );

  function ContainerInfo({ title, body, createdAt, onDelete, enableDelete }) {
    if (!(title, body)) return null;

    return (
      <div className="container">
        <div className="header-box">
          <text className="titolo_n" alt="titolo">
            {" "}
            {title}{" "}
          </text>
          <text className="data-pubblicazione" alt="nan ">
            {" "}
            data pubblicazione: {transformDate(createdAt)}{" "}
          </text>
        </div>
        <div className="centre">
          <img className="campanella" src={campanella} alt="AVVISO!" />
          <div className="descrizionebox">
            <text className="descrizione" alt="descrizione ">
              {" "}
              {body}{" "}
            </text>
          </div>
        </div>
        {enableDelete &&
          <button className="delete-button" onClick={onDelete} disabled={!enableDelete}>
            Rimuovi
          </button>}
      </div>
    );
  }
  function transformDate(dataString) {
    return new Date(dataString).toLocaleDateString();
  }
}
