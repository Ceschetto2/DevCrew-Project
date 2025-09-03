import { useEffect, useState } from "react";
import { ImgSlideShow } from "../../components/ImgSlideShow/ImgSlideShow";
import { AdviseShow } from "../../components/AdviseContainer/AdviseContainer";
import angle_top from "../../Assets/angle_top.png";
import Intro from "../../Assets/Intro.webm";
import enter from "../../Assets/enter.png";
import "./Home.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import requestApi from "../../requestApi";


/* 
Il componente Home rappresenta la pagina principale dell'applicazione.
- Importa i componenti ImgGallery e ImgSlideShow, che gestiscono rispettivamente una galleria di immagini e una presentazione di immagini.
- Include un elemento <div> con attributi personalizzati (data-rel, data-href, ecc.), che sembra essere configurato per integrare un visualizzatore di contenuti esterni (ad esempio, un lightbox o un embed di FlipHTML5).
- Lo stile del componente è gestito tramite il file CSS "Home.css".
*/

export function Home() {
  let [img_array, setImgArray] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [noticesList, setNoticesList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      // Mostra il pulsante se lo scroll supera i 300px
      setIsVisible(window.scrollY > 1900);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchImages = async () => {
    const response = await requestApi.get("/GalleryImages", { params: { n_obj: 10 } });
    setImgArray(response.data);
  };
  
  const fetchNews = async () => {
    const notices = await requestApi.get("/News", { params: { n_obj: 4 } });
    setNewsList(notices.data);
  };

  const fetchNotices = async () => {
    const notices = await requestApi.get("/Notices", { params: { n_obj: 4 } });
    setNoticesList(notices.data);
  };

  useEffect(() => {

    fetchNotices();

    fetchNews();
    fetchImages();
  }, []); //la funzione di quary si richiama ogni qualvolta SearchValue viene modificato



  /*React Router non gestisce gli anchor link come HTML puro.
  Soluzioni: Scroll manuale con useLocation + useEffect
 Cos'è useLocation()?È un hook di React Router
 che ti permette di accedere all'oggetto location, che contiene informazioni sull'URL corrente, 
 come:
-> pathname: la route attuale ("/"),
->search: query string (?nome=ciao)
-> hash: parte dopo # nell'URL (#sez2)
location.hash   :   restituisce la parte dell’URL dopo il #, ad esempio #sez2 è usata come riferimento ad un id HTML nella pagina.
Perché useEffect([location])?   :  L'effetto viene eseguito ogni volta che cambia la route (cioè quando cambia location)
quindi: 
Quando arrivi su /#sez2, location.hash sarà #sez2.
querySelector(hash) diventa querySelector("#sez2"), cioè cerca un elemento con id="sez2".
Se lo trova, chiama .scrollIntoView({ behavior: "smooth" }), che fa uno scroll automatico e fluido fino a quella sezione.*/

  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);


  return (
    <div>
      <section id="sez2">
        <video className="video" src={Intro} autoPlay loop muted />
        <h2 className="element_title">Gallery</h2>
      </section>
      <div className="home_gallery">
        {img_array.length !== 0 ? (
          <ImgSlideShow img_array={img_array} />) : (<>no images found</>
        )}

        <Link className="open" to="Gallery/#sezione_gallery" >Visualizza la sezione <img className="enter" src={enter} alt="enter"></img></Link>

      </div>

      <h2 className="element_title">Notizie</h2>

      <div className="news_show">
        <div className="news_container" id="sezione_notizie">
          {newsList.length === 0 ? <div>No new found</div> : newsList.map((notizia, index) => (
            <AdviseShow key={index} img_url={notizia.img_url} description={notizia.description} title={notizia.title} object={notizia.object} createdAt={notizia.createdAt} />
          ))}
        </div>
        <Link className="open" to="News/#sezione_notizie" >Visualizza la sezione <img className="enter" src={enter} alt="enter"></img></Link>

      </div>


      <h2 className="element_title">Bandi</h2>

      <div className="bandi_show">
        <div className="bandi_container" id="sezione_bandi">
          {noticesList.length === 0 ? <div>No Applications found</div> : noticesList.map((bando, index) => (
            <AdviseShow key={index}  description={bando.description} title={bando.title} object={bando.object} createdAt={bando.createdAt} />
          ))}
        </div>
        <Link className="open" to="News/#sezione_bandi" >Visualizza la sezione <img className="enter" src={enter} alt="enter"></img></Link>
      </div>


      <Link className="nav-link-image" to="/#sez2">
        {isVisible && (<img className="backtotop" src={angle_top} />)}
      </Link>

    </div>


  )
};
