import Ai from "../../Assets/ai.png";
import React, { useState } from "react";
import "./ButtomAi.css";

import { PopupAi } from "../PopupAi/PopupAi";

export function ButtomAi() {
  const [AiPopupOpen, setAiPopupOpen] = useState(false);

  const handleOpen = () => {
    setAiPopupOpen(!AiPopupOpen);
    
  };

  return (
    <div className="divbuttom">
        <PopupAi open={AiPopupOpen} setOpen={setAiPopupOpen}></PopupAi>
      <img className="Aimage" src={Ai} onClick={handleOpen} />
    </div>
  );
}
