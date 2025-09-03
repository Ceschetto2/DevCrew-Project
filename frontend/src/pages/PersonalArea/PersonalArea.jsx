import { useState, useEffect } from "react";

import "./PersonalArea.css";

import ModifyPopupPass from "../../components/ModifyPopup/ModifyPopupPass";
import ModifyPopupUsername from "../../components/ModifyPopup/ModifyPopupUsername";
import requestApi from "../../requestApi";

// Il componente PersonalArea rappresenta l'area personale dell'utente.

export default function PersonalArea() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const results = await requestApi.get("/User/getUserFromToken");

      setUserInfo(results.data);
      console.log("userInfo", results);
    };
    fetchUser();
  }, []);

  const [modifyPopupbuttom, setModifyPopupbuttom] = useState(false);
  const [modifypasspopupbuttom, setModifypassbuttom] = useState(false);
  return (
    <div className="personalbox">
      <h2 className="element_title">Area Personale</h2>
      <div className="personalbox-inner">
        <h5 className="title_info">
          Nome:
          <input
            className="results"
            type="text"
            readOnly={true}
            defaultValue={userInfo.name}
          />
        </h5>

        <h5 className="title_info">
          Cognome:
          <input
            className="results"
            type="text"
            readOnly={true}
            defaultValue={userInfo.surname}
          />{" "}
        </h5>

        <h5 className="title_info">
          Email:
          <input
            className="results"
            type="text"
            readOnly={true}
            defaultValue={userInfo.mail}
          />{" "}
        </h5>

        <h5 className="title_info">
          Ruolo:
          <input
            className="results"
            type="text"
            readOnly={true}
            defaultValue={userInfo.role}
          />{" "}
        </h5>
      </div>
      <div className="personalbox-button">
        <button
          onClick={() => setModifyPopupbuttom(true)}
          className="ModifyUbottom"
        >
          Modifica Username
        </button>
        <button
          onClick={() => setModifypassbuttom(true)}
          className="ModifyPbottom"
        >
          Modifica Password
        </button>
        <ModifyPopupUsername
          trigger={modifyPopupbuttom}
          setTrigger={setModifyPopupbuttom}
        />

        <ModifyPopupPass
          trigger={modifypasspopupbuttom}
          setTrigger={setModifypassbuttom}
        />
      </div>
    </div>
  );
}
