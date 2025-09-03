import { useContext, useEffect, useState } from "react";
import "./LoginPopup.css";
import { authContext, setToken } from "../../Hooks/Token/tokenState";
import { useNavigate } from "react-router-dom";
import close from "../../Assets/close.png";
import requestApi from "../../requestApi";

/* 

/* 
Il componente LoginPopup rappresenta un popup per il login degli utenti.
- Accetta una prop:
  - handlePopupClick: una funzione per chiudere il popup, associata al pulsante "X" e al pulsante "Login".
- Contiene un modulo di login con campi per l'username e la password.
- Lo stile del componente è gestito tramite il file CSS "LoginPopup.css".
*/

export function LoginPopup() {
  const [user, setUser] = useState({ username: "", passwd: "" });

  //inizializzazione dell'hook useNavigate usato per indirizzare l'utente verso altre pagine dopo qualche azione
  let navigate = useNavigate();


  //handleEnterPress è una funzione che gestisce l'evento di pressione del tasto "Enter" durante l'inserimento della password.
  //Se il tasto premuto è "Enter", chiama la funzione userAuthentication per autenticare l'utente.
  const handleEnterPress=(e) => {
    if (e.key === 'Enter') {

     userAuthentication(user, setLoginLabel, setAuthStatus, navigate); 
    }
  }
  const setUserCredential = (e) => {
    setUser({
      
      ...user,
      [e.target.name]: e.target.value,
    });
    //Se l'utente modifica il campo username o password, il messaggio di errore viene resettato
    //in questo modo, se l'utente inserisce un username o una password errata, il messaggio di errore non rimane visibile
    if(loginLabel !== ""  )  setLoginLabel("");
          
  };
  
  const [loginLabel, setLoginLabel] = useState("");
  const { authStatus, setAuthStatus, handleLoginPopupButtonClick, setRole } = useContext(authContext)


  //Questo hook ha l'effetto di chiudere il popup di login quando l'autenticazione va a buon fine.
  useEffect(() => {
    if (authStatus) handleLoginPopupButtonClick();
  }, [authStatus]);

  const userAuthentication = async () => {
    if ((!user.username || !user.passwd) === false) {
      try {
          const response = await requestApi.post("/Authentication/login", {
            username: user.username,
            password: user.passwd
          }
        
        );

        setToken(response.data.token)
        setRole(response.data.role)
        setLoginLabel("Credenziali corrette, benvenuto campione");
        setAuthStatus(true);
        navigate("/dashboard");

      } catch (err) {
        console.log("Errore: " + err);
        setLoginLabel("Credenziali Errate");
      }
    }
  }


  return (
    <div className="popup-background">
      <div className="login-background">
        <div className="head-bar">
          <button className="Close-popup" onClick={handleLoginPopupButtonClick}>
            <img className="closeimg" src={close} />{" "}
          </button>
        </div>
                <div className="loguser"><label className="darktext">Username:</label></div>
  <input
          className="input-bar" 
          name="username"
          value={user.username}
          onChange={setUserCredential}
          
        />
        <div className="loguser">
          <label className="darktext">Password:</label>
        </div>
        <input
          className="input-bar"
          name="passwd"
          value={user.passwd}
          onChange={setUserCredential }
          //onKeyDown è un evento che si attiva quando un tasto viene premuto
          //in questo caso, se il tasto premuto è "Enter", viene chiamata la funzione handleEnterPress   
          onKeyDown={handleEnterPress}
        /> 
        <button
          className="login-button"
          onClick={() =>
            userAuthentication()
          }
        >
          Login
        </button>
        <label className="dark-text">{loginLabel}</label>;
      </div>
    </div>
  );
}

