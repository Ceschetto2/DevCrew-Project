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

  
  const[newPassword, setNewPassword] = useState("");
  const[ConfirmPassword, setConfirmPassword] = useState("");
const[passwordError,setPasswordError]=useState("");
const[confirmError,setConfirmError]=useState("");
/*
  const HandleSubmit=async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if(newPassowrd !== ConfirmPassword){
      alert("Le password non corrispondono");
      setError("Le password non corrispondono");
      return;
    }
    try {
      await axios.put("http://localhost:8080/User/updatePassword", {...userInfo, password: newPassowrd}, {
        headers: { authorization: localStorage.getItem("jwt") },
      });
      setSuccess("Modifica avvenuta con successo");
      logout(navigate);
    } catch (err) {
      console.log("Errore: " + err);
      setError("Errore durante la modifica");
    }
  };
  */

  /*useEffect(() => {
    const fetchUser = async () => {
      const results = await axios.get(
        "http://localhost:8080/User/getUserFromToken",
        { headers: { authorization: localStorage.getItem("jwt") } }
      );
      setUserInfo(results.data);
      console.log("userInfo", results);
    };
    fetchUser();
  }, []);*/

  const handleSave = async () => {
    console.log("nuova password", newPassword);
    console.log("conferma password", ConfirmPassword);
    if (newPassword !== ConfirmPassword) {
      alert("Le password non corrispondono");

      return;
    }
    try {
      await requestApi.put("/User/updatePassword", { newPassword });
      alert("Modifica avvenuta con successo");
      logout(navigate);
    } catch (err) {
      console.log("Errore: " + err);
      alert("Errore durante la modifica");
    }
  };

  return props.trigger ? (
    <div className="background-popup">

      <div className="ModifyPopup-box">


            <button className="CloseBottom" onClick={() => props.setTrigger(false)}>
              <FontAwesomeIcon className="close_icon"icon={faCircleXmark} style={{color: "#ed0707",}} />
            </button>
              <div className="ModifyPopup-inner">
              <div className="title">
                 Nuova password:</div>
                <input
                  className="infox"
                  type="text"
                  
                  onChange={(e) =>{
                    const value=e.target.value;
                    setNewPassword(value);
                     if (value.length < 8) {
    setPasswordError("La password deve avere almeno 8 caratteri");
  } else if (!/[A-Z]/.test(value)) {
    setPasswordError("La password deve contenere almeno una lettera maiuscola");
  } else if (!/[a-z]/.test(value)) {
    setPasswordError("La password deve contenere almeno una lettera minuscola");
  } else if (!/[0-9]/.test(value)) {
    setPasswordError("La password deve contenere almeno un numero");
  } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
    setPasswordError("La password deve contenere almeno un carattere speciale");
  } else {
    setPasswordError("");
  }}}
                  
                />
                {passwordError &&(<div className="field-hint">{passwordError}</div>)}
              </div>
              <div className="ModifyPopup-inner">
              <div className="title">
                   Ripeti nuova password:
                     </div>
                <input
                  className="infox"
                  type="text"
                    onChange={(e) =>{
                      const value= e.target.value;
                       setConfirmPassword(value);
                      setConfirmError(value === newPassword ? "" : "Le password non corrispondono");
                      } }
                />
                {confirmError && <div className="field-hint">{confirmError}</div>}

            
              </div>
               <button className="ConfirmBottom" onClick={handleSave}>Conferma</button>
              
                

      </div>



      {props.children}
    </div>

  ) : (
    ""
  );
}

export default ModifyPopup;
