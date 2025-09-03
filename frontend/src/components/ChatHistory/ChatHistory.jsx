import React from "react";

import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import{faCopy} from '@fortawesome/free-solid-svg-icons'
import './ChatHistory.css'

export function ChatHistory({chatHistory}){
  
    const bottomRef = useRef(null);
 
     // Autoscroll in fondo ogni volta che arrivano nuovi messaggi
      useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  /*  /*(<div
            key={index}
            className={`${message.type==="user"}`} >
                {message.type==="user"&&(
                    <span className="tuachat">IO:</span>
                    )}
               <div> 
                <ReactMarkdown>{message.message}</ReactMarkdown>
                </div>
            </div>)*/


    return(
        <div className="chat-history">
        {chatHistory.map((turn,i)=>{
             const isUser = turn.type === "user";
        return (
          <div key={i} className={`msg ${isUser ? "user" : "bot"}`}>
            {!isUser && <div className="Argo">🤖Argo</div>}
            <div className="bubble">
             
              <span>
                <div className="bubble-text">{turn.message}
                    </div>
                </span>

              
              <button
                className="copy"
                title="Copia"
                onClick={() => navigator.clipboard.writeText(turn.message)}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            {isUser && <div className="avataruser">🧑Io</div> }
           </div>
            
        );
    })}
     <div ref={bottomRef} />
    
    </div>)}


      