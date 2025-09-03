import { useState } from "react";
import { AiChat } from "../AiChat/AiChat";
import './PopupAi.css'
import { useRef,useEffect } from "react";
export function PopupAi({open,setOpen})
{
if(!open)return null;
      const divRef = useRef(null);

useEffect(()=>{
const HandleClosePointer =(e)=>{

 if (divRef.current && divRef.current instanceof HTMLElement) {
        if (!divRef.current.contains(e.target)) {
          setOpen(false);
          console.log("popup chiuso");
    }
}
    };



    
document.addEventListener("mousedown", HandleClosePointer);
return () => 
  document.removeEventListener("mousedown", HandleClosePointer);
},[setOpen]);


  return(
    <div ref={divRef} className="Back">
 <AiChat></AiChat>
    </div>
   
  )

}