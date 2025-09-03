import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { authContext, getToken } from "../../Hooks/Token/tokenState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Navbar.css";
import { useEffect } from "react";
import { faLeftLong, faUser } from "@fortawesome/free-solid-svg-icons";

/**
 * Componente Navbar che visualizza la barra di navigazione principale dell'applicazione.
 *
 * - Mostra i link di navigazione verso varie pagine (Gallery, Notizie, Bandi, Regolamento, FAQ, Dashboard).
 * - Visualizza i pulsanti di login/logout in base allo stato di autenticazione.
 * - Fornisce l'accesso all'area personale quando l'utente è autenticato.
 * - Aggiorna lo stato di autenticazione al rendering in base alla presenza del token.
 *
 * @component
 * @returns {JSX.Element} Il componente Navbar renderizzato.
 */
export function Navbar() {
  const { authStatus, setAuthStatus, handleLoginPopupButtonClick, handleLogoutPopupButtonClick } =
    useContext(authContext);
  const navigate = useNavigate();
  //Hook per aggiornare il valore dell'autsStatus in base alla presenza del token
  //quando viene aggiornata la pagina.
  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthStatus(true);
    } else {
      setAuthStatus(false);
    }
  }, []);

  return (
    <div className="navbar">
      <button className="go-back" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faLeftLong} />
      </button>
      <Link className="nav-link-image" to="/">
        <img
          className="nav-image"
          src="https://iili.io/3fDhbyb.png"
          alt="home"
        ></img>
      </Link>


      <div className="nav-link-list">
        <Link className="nav-link" to="/gallery">
          <button className="nav-button">Gallery</button>
        </Link>

        <Link className="nav-link" to="/News">
          <button className="nav-button">Notizie</button>
        </Link>

        <Link className="nav-link" to="/Notices">
          <button className="nav-button">Bandi</button>
        </Link>

        <Link className="nav-link" to="/RuleBook">
          <button className="nav-button">Regolamento</button>
        </Link>
        <Link className="nav-link" to="/FAQ">
          <button className="nav-button">FAQ</button>
        </Link>
        {authStatus && <Link className="nav-link" to="/dashboard">
          <button className="nav-button">Dashboard</button>
        </Link>}
      </div>

      {authStatus ? (
        <div className="nav-logout">
          <button className="nav-button" onClick={() => navigate("/PersonalArea")} >
            <FontAwesomeIcon icon={faUser} className="icon" />
          </button>
          <button className="nav-button" onClick={handleLogoutPopupButtonClick}>
            Logout
          </button>
        </div>
      ) : (

        <button className="nav-button" onClick={handleLoginPopupButtonClick}>
          Login
        </button>

      )}

    </div>
  );
}
