import "./AdviseContainer.css"
import StandardNewsImage from "../../Assets/StandardNewsImage.jpg";


export function AdviseShow({ img_url, title, object, description,createdAt }) {
    if (!(title || object || description||createdAt)) return null;
    return (

        <div className="adv-show">
           {img_url &&(<img className="immagine-adv" src={img_url}  alt ="Immagine mancante"/>)}
             
        
                 <text className="titolo-adv" alt = "titolo"> {title} </text>

                 <text className="oggetto-adv" alt = "oggetto"> {object}  </text>    
             <text className="descrizione-adv" alt = "descrizione "> {description}  </text>
             <text className="data-adv"alt="data">{createdAt? new Date(createdAt).toLocaleDateString("it-IT") : ""}</text>
           
    </div>
        
    )



}