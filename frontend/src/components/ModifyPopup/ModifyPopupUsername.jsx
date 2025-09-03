import { useState, useEffect } from "react";
import "./ModifyPopup.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../Hooks/Token/tokenState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import requestApi from "../../requestApi";

function ModifyPopup(props) {
  const { logout } = useContext(authContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const results = await requestApi.get("/getUserFromToken");
      setUserInfo(results.data);
    };
    fetchUser();
  }, []);



  const [usernameError, setUsernameError] = useState("");

  const handleSave = async () => {
    try {
      await requestApi.put("/User/updateUser", userInfo);
      alert("Modifica avvenuta con successo");
      logout(navigate);
    } catch (err) {
      console.log("Errore: " + err);
      alert("Errore durante la modifica");
    }
  };
  //Modifyfpopup inner e il componente che ho creato per per mettere una gestione migliore del popup con flex
  return props.trigger ? (
    <div className="background-popup">
      <div className="ModifyPopup-box">
        <button className="CloseBottom" onClick={() => props.setTrigger(false)}>
          <FontAwesomeIcon className="close_icon" icon={faCircleXmark} style={{ color: "#ed0707" }} />
        </button>
        <div className="ModifyPopup-inner">
          <div className="title">
            Inserisci nuovo username:</div>
          <div className="useinfo"><li>sono ammessi max 20 caratteri</li><li>non sono ammessi caratteri speciali</li></div>
          <input className="infox"
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              setUserInfo({ ...userInfo, username: value });
              if (value.trim().length === 0) {
                setUsernameError("Username non può essere vuoto");
              } else if (value.length > 20) {
                setUsernameError("Username troppo lungo (max 20 caratteri)");
              } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                setUsernameError("Username contiene caratteri non validi");
              } else {
                setUsernameError("");
              }
            }}
          />
          {usernameError && (
            <div className="field-hint">{usernameError}</div>
          )}

        </div>
        <button className="ConfirmBottom" onClick={handleSave}>
          Conferma
        </button>
      </div>

      {props.children}
    </div>
  ) : (
    ""
  );
}

export default ModifyPopup;
