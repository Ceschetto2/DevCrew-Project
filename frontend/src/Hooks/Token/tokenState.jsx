import { createContext, useState, useEffect } from "react";
import requestApi, { setLogoutHandler } from "../../requestApi.js";
import { useNavigate } from "react-router-dom";


export const authContext = createContext(null);


export function AuthStatus({ children }) {
    const [role, setRole] = useState(null);
    const [authStatus, setAuthStatus] = useState(false);
    const [loginPopupState, setLoginPopupState] = useState(false)
    const [logoutPopupState, setLogoutPopupState] = useState(false)
    const navigate = useNavigate();



    const fetchRole = async () => {
        try {
            const response = await requestApi.get('/User/getRoleByToken');
            console.log("Recatching role:", response.data);
            setRole(response.data);

        } catch (err) {
            setRole(null)
            console.error("Errore nel recupero del ruolo", err);
        }
    };


    const refreshAuthStatus = () => {
        const token = localStorage.getItem("jwt");
        if (token) {
            fetchRole();
            setAuthStatus(true);
        } else {
            setAuthStatus(false);
        }
    }


    useEffect(() => {
        setLogoutHandler(forceLogout)
        refreshAuthStatus();


    }, [])





    function logout() {
        //Funzione per gestire il click sul bottone di logout
        setAuthStatus(false);
        deleteToken();
        setRole(null);
        setLogoutPopupState(false);
        console.log("Logout effettuato");
        navigate("/");
    }

    function forceLogout() {
        alert('Sessione scaduta o non Valida. Rieffettuare login.')
        logout()
    }




    //Funzione per gestire il click sul bottone di login
    function handleLoginPopupButtonClick() {
        setLoginPopupState(!loginPopupState)
    }
    //Funzione per gestire il click sul bottone di logout
    function handleLogoutPopupButtonClick() {
        setLogoutPopupState(!logoutPopupState)
    }
    return (
        <authContext.Provider value={{ authStatus, setAuthStatus, loginPopupState, handleLoginPopupButtonClick, logoutPopupState, logout, forceLogout, handleLogoutPopupButtonClick, role, setRole }}>
            {children}
        </authContext.Provider>
    )
}



//Variabile per salvare il JWT token di autenticazione in locale usando una variabile react. Non sopravvive alla ricarica della pagina, ma è la implementazione più sicura
//let JWTtoken = null
//Una alternativa sarebbe usare lo storage del brosware. Sia i cookie che il localStorage sopravvivono alla ricarica della pagina.

//Funzione per settare il valore del token dall'estenrno del modulo
export function setToken(token) {
    localStorage.setItem("jwt", token);
}

//Funzione per cancellare il valore del token dall'esterno del modulo
export function deleteToken() {
    localStorage.removeItem("jwt");
}

//funzione per prendere il valore del token dall'esterno
export function getToken() {

    return localStorage.getItem("jwt");
}
