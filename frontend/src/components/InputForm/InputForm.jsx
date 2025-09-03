import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import './InputForm.css'


export default function InputForm({ onClose, title = "Upload Form", newItem, setNewItem, enablePdf = false, enableImg = false, onSuccess }) {



    const MAX_TITOLO = 255;
    const MAX_OBJECT = 255;
    const MAX_DESCRIPTION = 1000;

    const overTitolo = newItem.title?.length > MAX_TITOLO;
    const overObject = newItem.object?.length > MAX_OBJECT;
    const overDescription = newItem.body?.length > MAX_DESCRIPTION;

    const hasErrors = overTitolo || overObject || overDescription;



    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (type === "file") {
            if (name === "files") {

                setNewItem((prev) => ({ ...prev, files: Array.from(files || []) }));
            } else if (name === "imgs") {
                setNewItem((prev) => ({ ...prev, imgs: Array.from(files || []) }));
            }
        } else {
            setNewItem((prev) => ({ ...prev, [name]: value }));
        }
    };



    return (
        <div className="background-popup">
            <div className="input-form">

                <div className="head-form">
                    <div className="head-form-text">{title}

                    </div>
                    <button type="button" className="form-close-button" onClick={onClose}>
                        <FontAwesomeIcon className="close_icon" icon={faCircleXmark} style={{ color: "#ed0707" }} />
                    </button>
                </div>


                <div className="form" onSubmit={onSuccess}>

                    {(newItem.title !== undefined) ? (<><div className="nomebar">Titolo:</div>
                        <input className={`input-bar-pers ${overTitolo ? "input-error" : ""}`}
                            type="text"
                            name="title"
                            value={newItem.title}
                            onChange={handleChange}
                            placeholder="Inserisci il titolo"
                            required
                            aria-invalid={overTitolo}
                            aria-describedby="titolo-help"
                        />
                        <div className="field" id="titolo-help">
                            {newItem.title.length}/{MAX_TITOLO}
                            {overTitolo && <span className="error-msg"> — Hai superato il limite di {MAX_TITOLO} caratteri</span>}
                        </div>
                    </> ): null}

                    {(newItem.object !== undefined)? <>
                        <div className="nomebar">Oggetto:</div>
                        <input className={`input-bar-pers ${overObject ? "input-error" : ""}`}
                            type="text"
                            name="object"
                            value={newItem?.object}
                            onChange={handleChange}
                            placeholder="Inserisci l'oggetto "
                            required
                            aria-invalid={overObject}
                            aria-describedby="oggetto-help"
                        />
                        <div className="field" id="oggetto-help">
                            {newItem.object.length}/{MAX_OBJECT}
                            {overObject && <span className="error-msg"> — Hai superato il limite di {MAX_OBJECT} caratteri</span>}
                        </div>
                    </> : null
                    }

                    {(newItem?.body !== undefined) ? <><div className="nomebar">Descrizione: </div>
                        <textarea className={`input-bar-descr ${overDescription ? "input-error" : ""}`}
                            name="body"
                            value={newItem.body}
                            onChange={handleChange}
                            placeholder="Inserisci una descrizione"
                            aria-invalid={overDescription}
                            aria-describedby="descrizione-help"
                        />
                        <div className="field" id="descrizione-help">
                            {newItem.body.length}/{MAX_DESCRIPTION}
                            {overDescription && <span className="error-msg"> — Hai superato il limite di {MAX_DESCRIPTION} caratteri</span>}
                        </div></> : null
                    }

                    {enableImg &&
                        <>
                            <div className="nomebar">Aggiungi allegati ( <i>max.10 file formato .jpg, .png</i>) :</div>
                            <input className="boxfile"
                                disabled={!enableImg}
                                type="file"
                                name="imgs"
                                accept="image/*"
                                multiple
                                onChange={handleChange}
                            />
                        </>

                    }
                    {enablePdf &&
                        <>
                            <div className="nomebar">Aggiungi allegati ( <i>max.10 file formato .pdf </i>) :</div>
                            <input className="boxfile"
                                disabled={!enablePdf}
                                type="file"
                                name="files"
                                accept="application/pdf"
                                multiple
                                onChange={handleChange}
                            />
                        </>
                    }

                </div>


                    <div className="form-buttons">

                        <button type="button" className="cancelaction" onClick={onClose}>Annulla</button>
                        <button type="submit" className="confirmaction" onClick={onSuccess} disabled={hasErrors}>Carica</button>

                    </div>


            </div>
        </div>

    );
}

