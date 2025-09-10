import { useEffect, useState } from "react";
import "./Gallery.css";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ImgSlideShow } from "../../components/ImgSlideShow/ImgSlideShow";
import { ImgGallery } from "../../components/ImgGallery/ImgGallery";
import requestApi from "../../requestApi";
import { useContext } from "react";
import { authContext } from "../../Hooks/Token/tokenState";
import InputForm from "../../components/InputForm/InputForm";
import carusel from "../../Assets/carusel.png";
import gridimage from "../../Assets/gridimage.png"
import { PopupConfirmation } from "../../components/PopupConfirmation/PopupConfirmation";

/* 
Il componente Gallery gestisce e visualizza un elenco di immagini recuperate da un'API.
- Utilizza useState per gestire lo stato locale:
  - SearchValue memorizza il valore della barra di ricerca.
  - img_show determina la modalità di visualizzazione (galleria o slideshow).
  - img_array contiene l'elenco delle immagini recuperate dall'API.
- useEffect viene utilizzato per eseguire una chiamata API ogni volta che SearchValue cambia.
- La funzione fetchImages recupera i dati dall'endpoint "http://localhost:8080/GalleryImages" tramite axios,
  passando il valore di SearchValue come parametro di ricerca.
- Se non ci sono immagini disponibili, viene mostrato un messaggio di errore "There are no elements".
- L'utente può alternare tra la visualizzazione in galleria (ImgGallery) e slideshow (ImgSlideShow) tramite pulsanti.
- Lo stile del componente è gestito tramite il file CSS "Gallery.css".
*/

/*rendere i bottone evidenziato in base alla scelta selezionata, bisogna far 
variare il css in base allo stato della variabile img_show
Da aggiungere un paging system per la vista a gallery o un caricamento dinamico delle immagini
per lo slideshow
*/

export function Gallery() {

  const { role } = useContext(authContext)
  const [searchData, setSearchData] = useState({ text: "", date: "", isOrdGrow: true });


  const [img_show, setImgShow] = useState(0);
  let [img_array, setImgArray] = useState([]);
  const defaultImg = { title: "", body: "", imgs: [] }
  const [newImg, setNewImg] = useState(defaultImg)
  const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
  const [imgDeleteId, setImgDeleteId] = useState(null); 

  const [isInputPopupOpen, setInputPopupOpen] = useState(false);


  useEffect(() => {
    const fetchImages = async () => {
      const response = await requestApi.get("/GalleryImages", {
        params: {
          data: searchData.text,
          date: searchData.date,
          isOrdGrow: searchData.isOrdGrow,
        },
      });

      setImgArray(response.data);
    };



    fetchImages();
  }, [searchData.text, searchData.date, searchData.isOrdGrow]); //la funzione di quary si richiama ogni qualvolta SearchValue viene modificato




  const sendImgs = async () => {
    try {

      console.log("immagini da inserire", newImg)
      const form = new FormData();
      Array.from(newImg.imgs).forEach(img => form.append("imgs", img));
      form.append("newImgData", JSON.stringify(newImg));
      const res = await requestApi.post("/GalleryImages", form,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      alert("Immagini aggiunte con successo")
      setImgArray(prev => [...prev, ...res.data.addedImgs]);
      setNewImg(defaultImg)
      setInputPopupOpen(false);
    } catch (error) {
      alert("Impossibile aggiungere le immagini")
      console.log(error);
    }
  };

  const deleteImage = async () => {
    try {
      console.log(imgDeleteId)
      await requestApi.delete("/GalleryImages", { params: { img_id: imgDeleteId } })
      setImgArray(prev => prev.filter(img => img.img_id !== imgDeleteId))
      alert("Rimozione avvenuta con successo")
    } catch (error) {
      alert("Impossibile rimuovere l'immagine")
      console.log(error)
    }
    setConfirmPopupOpen(false)
  }




  return (
    <section id="sezione_gallery">
      <div className="page-background">

        <PageTitle
          title="Gallery"
          searchLabel="Search:"
          searchData={searchData}
          setSearchData={setSearchData}
        />
        {isConfirmPopupOpen && <PopupConfirmation title={"Rimozione Immagine"} message={"Sicuro di voler rimuovere l'immagine?"} onConfirm={deleteImage} onCancel={() => { setConfirmPopupOpen(false) }} />}
        {role === "president" && <button className="uploadButton" onClick={() => { setInputPopupOpen(true) }}> Inserisci Nuove immagini</button>}
        {isInputPopupOpen && <InputForm onClose={() => { setInputPopupOpen(false) }} enablePdf={false} enableImg={true} newItem={newImg} setNewItem={setNewImg} onSuccess={sendImgs} />}
        {img_array.length === 0 ? (
          <div className="Error">Nessun risultato trovato</div>
        ) : (
          <div className="img-container" >
            <div className="chng-visualization-button">
              <button className="gridb" onClick={() => setImgShow(0)}> <img className="gridimage" src={gridimage} alt="grid" /></button>
              <button className="caruselb" onClick={() => setImgShow(1)}><img className="carusel" src={carusel} alt="carosello" /></button>
            </div>
            {img_show === 1 ? (
              <ImgSlideShow img_array={img_array} enableDelete={role === 'president'} onDelete={() => setConfirmPopupOpen(true)} setDeleteImageId = {setImgDeleteId}/>
            ) : (
              <ImgGallery img_array={img_array} enableDelete={role === 'president'} onDelete={() => {setConfirmPopupOpen(true)}} setDeleteImageId = {setImgDeleteId} />
            )}
          </div>
        )}

      </div>
    </section>
  );
}
