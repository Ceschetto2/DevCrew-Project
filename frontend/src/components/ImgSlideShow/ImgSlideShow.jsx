import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ImgSlideShow.css";
import { useState } from "react";
import { faArrowLeft, faArrowRight, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

/* 
Il componente ImgSlideShow rappresenta uno slideshow di immagini con funzionalità di navigazione e visualizzazione a schermo intero.
- Accetta una prop:
  - img_array: un array di oggetti contenenti i link delle immagini da visualizzare.
- Utilizza useState per gestire lo stato locale:
  - currentImgIndex: l'indice dell'immagine attualmente visualizzata.
  - fullScreenStatus: uno stato booleano per determinare se l'immagine è visualizzata a schermo intero.
- Include pulsanti per navigare tra le immagini precedenti e successive.
- Consente di attivare/disattivare la modalità a schermo intero per l'immagine corrente.
- Lo stile del componente è gestito tramite il file CSS "ImgSlideShow.css".
*/

export function ImgSlideShow({ img_array, enableDelete = false, onDelete = null, setDeleteImageId = null }) {
  const [currentImgIndex, setImageIndex] = useState(0);
  const [fullScreenStatus, setFullScreenStatus] = useState(false);

  function getPrvIndex() {
    return currentImgIndex === 0 ? img_array.length - 1 : currentImgIndex - 1;
    //immagine precedente : => indiceprecedente = currentimgindex -1  if currentindex=0 ? img:array.lengt -1 : currentimg.index -1 ;
  }
  function getNextIndex() {
    return currentImgIndex === img_array.length - 1 ? 0 : currentImgIndex + 1;
  }

  return (
    <>
      <div className="img-slide-show">

        <button className="prv-img" onClick={() => setImageIndex(getPrvIndex())}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>


        <img
          className="l-img"
          src={img_array[getPrvIndex()].img_url}
          alt="errore"
        />

        {fullScreenStatus ? (
          renderFullScreenImage()
        ) : (
          <img
            onClick={() => setFullScreenStatus(!fullScreenStatus)}
            className="img"
            src={img_array[currentImgIndex].img_url}
            alt="errore"
          />
        )}


        <img
          className="r-img"
          src={img_array[getNextIndex()].img_url}
          alt="errore"
        ></img>

        <button
          className="next-img"
          onClick={() => setImageIndex(getNextIndex())}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {enableDelete && <FontAwesomeIcon className="trash-icon-slideshow" onClick={(e) => {
        e.stopPropagation();
        setDeleteImageId(img_array[currentImgIndex].img_id)
        setImageIndex(getNextIndex());
        onDelete()

      }} icon={faTrashAlt} />}

    </>
  );



  function renderFullScreenImage() {
    return (
      <div className="test" onClick={() => setFullScreenStatus(!fullScreenStatus)}>
        <img className="full-img" src={img_array[currentImgIndex].img_url} />
      </div>
    );
  }
}
