import { useState } from "react";
import "./ImgGallery.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

/* 
Il componente ImgGallery rappresenta una galleria di immagini con funzionalità di visualizzazione a schermo intero.
- Accetta una prop:
  - img_array: un array di oggetti contenenti i link delle immagini da visualizzare.
- Utilizza useState per gestire lo stato locale:
  - fullScreenImage: memorizza il link dell'immagine attualmente visualizzata a schermo intero.
- Ogni immagine nella galleria è cliccabile e, se selezionata, viene mostrata a schermo intero.
- La modalità a schermo intero può essere chiusa cliccando sull'immagine visualizzata.
- Lo stile del componente è gestito tramite il file CSS "ImgGallery.css".
*/

export function ImgGallery({ img_array, enableDelete = false, onDelete }) {
  const [fullScreenImage, setFullScreenImage] = useState(null);
  return (
    <>
      <div className="gallery-container">
        {img_array.map((img_source, index) => (
          <div className="img-gallery-container">


            <img key={index} className="img-gallery" onClick={() => setFullScreenImage(img_source.img_url)} src={img_source.img_url} />
            {enableDelete &&<FontAwesomeIcon className="trash-icon" onClick={(e) => {
              e.stopPropagation()
              onDelete(img_source.img_id)
            }} icon={faTrashAlt} />}
          </div>
        ))}

        {fullScreenImage === null ? null : renderFullScreenImage(fullScreenImage)}
      </div>
    </>
  );

  function renderFullScreenImage() {

    return (
      <div className="popup-background" onClick={() => setFullScreenImage(null)}>
        <img className="full-img" src={fullScreenImage} />
      </div>
    );
  }
}
