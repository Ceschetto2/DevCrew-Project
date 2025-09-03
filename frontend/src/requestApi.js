import axios from "axios";
let logoutHandler = null
// Crea istanza Axios
const requestApi = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor per aggiungere token a ogni richiesta
requestApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor per gestire errori di risposta
requestApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Controlla codici che richiedono logout
      if (status === 401 || status === 403) {
        console.error("Sessione scaduta o non autorizzato:", data.message);
        logoutHandler()
      }
    } else {

      console.error("Errore di rete o server non raggiungibile:", error);
    }

    return Promise.reject(error);
  }
);

export default requestApi;
export function setLogoutHandler(fn) {
  logoutHandler = fn
}
