import "./ContainerInfo.css";
import Manobando from "../../Assets/Manobando.png";
/* 
Il componente ContainerInfo rappresenta un contenitore per visualizzare informazioni dettagliate su un elemento.
- Accetta una prop:
  - props: un oggetto contenente i dati da visualizzare, come immagine, titolo, data di pubblicazione, oggetto e descrizione.
- Se la prop props non è presente, il componente restituisce null.
- Mostra un'immagine, un titolo, una data di pubblicazione (formattata tramite la funzione transformDate), un oggetto e una descrizione.
- Lo stile del componente è gestito tramite il file CSS "ContainerInfo.css".
*/

export function ContainerInfo({
  title,
  object,
  description,
  createdAt,
  Pdfs,
  enableDelete = false,
  onDelete,
}) {
  if (!(title || object || description || Pdfs)) return null;

  return (
    <div className="container-info">
      <div className="header-info">
        <h1 className="titolo-info" alt="titolo">
          {" "}
          {title}{" "}
        </h1>
        <text className="data-pubblicazione-info" alt="nan ">
          {" "}
          data pubblicazione:{" "}
          {(createdAt && String(createdAt).split("T")[0]) || "—"}{" "}
        </text>
      </div>

      <section className="center-box">
        <div className="object-box">
          <img
            bandoicona
            src={Manobando}
            className="bandoicona"
            alt="bando icona"
          />
          <div className="objectitle">Oggetto:</div>
          <p className="objectext" alt="oggetto">
            {" "}
            {object}{" "}
          </p>
          <div className="divider"></div>
        </div>

        <aside className="descr-col">
          <div className="descrititle">Descrizione:</div>
          <p className="descritext" alt="descrizione ">
            {" "}
            {description}{" "}
          </p>
        </aside>
      </section>

      <section className="bando-attacchements">
        <div className="Allegatitle">Allegati:</div>

        {Pdfs && Pdfs.length > 0 && (
          <ul className="pdfslink">
            {Pdfs.map((Pdfs, idx) => (
              <li key={idx}>
                <a
                  href={Pdfs.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Pdfs.file_path.split("/").pop()}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
      
      {enableDelete && <button type="button" className="RemoveBando" onClick={onDelete}>
        Rimuovi 
      </button>}
    </div>
  );
}
