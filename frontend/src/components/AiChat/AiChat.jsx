import { Loading } from "../Loading/Loading";
import { ChatHistory } from "../ChatHistory/ChatHistory";
import requestApi from '../../requestApi';
import { useState,useEffect,useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import{faTrashCan}from '@fortawesome/free-solid-svg-icons'
import{faPaperPlane}from '@fortawesome/free-solid-svg-icons'

import './AiChat.css'

export function AiChat() {


 const [userInput,setUserInput]=useState("");
 const[chatHistory,setChatHistory]=useState([]);
 const[isLoading,setIsLoading]=useState(false);



const mapHistoryToBE = (historyFE) =>
  historyFE.map((h) => ({
    role: h.type === "bot" ? "model" : "user",
    text: h.message ?? "",
  }));

const sendMessage = async () => {
  const message = userInput.trim();
  if (!message) return;

  

  setIsLoading(true);
  try {
    const { data } = await requestApi.post("/AiChat", {
      message,
      history: mapHistoryToBE(chatHistory), // niente storage extra: solo contesto volatìle
    });

    const botText = data?.text ?? "";
    setChatHistory((prev) => [
      ...prev,
      { type: "user", message },
      { type: "bot", message: botText },
    ]);
    setUserInput("");
  } catch (err) {
    console.error("Errore /AiChat:", err); 
         // utile: messaggio dal server
  
  
  }

  finally {
    setIsLoading(false);
  }
};



 //funzione per l'inputbar
 const HandleUserInput=(e)=>{
    setUserInput(e.target.value);
 };



    
  



 
   

 //funzione per pulire la cronologia della chat
 const clearChat =()=>{
    setChatHistory([]);
 };

const handleEnterPress = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();          // evita submit/bling
    sendMessage();
  }
};



  return (
   
    <div className="chatbox">
      <h1> Argo </h1>
      <div className="Historychat">
        
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>
      <div className="Basediv">
      <input 
        type="text"
        className="inputchatbar"
        placeholder="Chiedi qualcosa ad Argo..."
        value={userInput}
        onChange={HandleUserInput}
        onKeyDown={handleEnterPress} 
      
/>
      <button  className="sendbottom"
        type="button"
        
        onClick={sendMessage}
       onKeyDown={handleEnterPress}
        disabled={isLoading}
      >
       Invia <FontAwesomeIcon icon={faPaperPlane} style={{color: "#f9f9f9ff",backgroundColor:"transparent"}} />
      </button>
      </div>
       <div>
 <button type="button" className="clearbutton" onClick={clearChat}>
    
        <FontAwesomeIcon className="trashicon" icon={faTrashCan} style={{color: "#ebe8edff"}} />
        Pulisci Chat
      </button>
       </div>
     
    </div>
  );
}
