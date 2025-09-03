import { Home } from "./pages/Home/Home";
import { News } from "./pages/News/News";
import { Notices } from "./pages/Notices/Notices";
import { FAQ } from "./pages/FAQ/FAQ";
import { RuleBook } from "./pages/RuleBook/RuleBook";
import { Gallery } from "./pages/Gallery/Gallery";
import PersonalArea from "./pages/PersonalArea/PersonalArea";
import { EventsList } from "./pages/Events/EventsList";
import { authContext, AuthStatus, getToken } from "./Hooks/Token/tokenState";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Events } from "./pages/Events/Events";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { EventProvider } from "./Hooks/Events/EventProvider";
import { SocietyManagement } from "./pages/SocietyManagement/SocietyManagement";
import { EventsHistory } from "./pages/EventsHistory/EventsHistory";
import { UserList } from "./pages/SocietyManagement/UsersList/UserList";
import { Contacts } from "./pages/Contacts/Contacts";
import { Avvisi } from "./pages/Avvisi/Avvisi";
import { useContext } from "react";
import { Layout } from "./Layout";

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import "./App.css";
import { useEffect } from "react";


library.add(fas)





/*
Questa è l'interezza della nostra app. Sono contenute tutte le pagine presenti sotto forma di root.
Inoltre abbiamo l'elemento Layout che contiene elementi (componenti) che sono seppre presenti e quindi è
inutile renderizzarle ad ogni pagina.

Le componenti più importanti della pagina sono:
BrowserRouter (Router): Fornisce il contesto per la navigazione nel browser.
Routes: Contiene tutte le route dell'applicazione.
Route: Definisce una singola pagina con il relativo percorso (path).
Questi ci consentono di localizzare e navigare fra le varie pagine presenti. Le pagine vengono importate dalla cartella pages
e chiamate in base alla path specificata.
*/

/**
 * Componente principale dell'applicazione che configura il routing e i provider di contesto.
 *
 * - Avvolge l'app con `AuthStatus` per gestire lo stato di autenticazione.
 * - Utilizza `Router` e `Routes` di React Router per la navigazione client-side.
 * - Fornisce il contesto `PersonalAreaProvider` al `Layout` e alle sue route annidate.
 * - Definisce le route pubbliche per Home, Notizie, Bandi, FAQ, Regolamento e Gallery.
 * - Protegge le route `/dashboard` e `/Events` tramite il componente `ProtectedRoute`,
 *   assicurando che solo gli utenti autenticati possano accedervi.
 *
 * @component
 */
function App() {

    useEffect(() => {
    document.title = "RMS-Rowing Management System"; 
  }, []);
  return (

    <Router>
      <AuthStatus>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/FAQ" element={<FAQ />} />
            <Route path="/RuleBook" element={<RuleBook />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Events"
              element={
                <ProtectedRoute>
                  <EventProvider>
                    <Events />
                  </EventProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/EventsList"
              element={
                <ProtectedRoute>
                  <EventProvider>
                    <EventsList />
                  </EventProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/SocietyManagement"
              element={
                <ProtectedRoute>
                  <EventProvider>
                    <SocietyManagement />
                  </EventProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/EventsHistory"
              element={
                <ProtectedRoute>
                  <EventProvider>
                    <EventsHistory />
                  </EventProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usersList"
              element={
                <ProtectedRoute>
                  <EventProvider>
                    <UserList />
                  </EventProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contacts"
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Announce"
              element={
                <ProtectedRoute>
                  <Avvisi />
                </ProtectedRoute>
              }
            />
            <Route path="/PersonalArea" element={<ProtectedRoute><PersonalArea /></ProtectedRoute>} />
          </Route>
        </Routes>
      </AuthStatus>
    </Router>

  );
}

//Funzione che permette di raggiungere delle rotte soltanto se si è in possesso di un token(non controlla la validità del token in se(da valutare)).
//se si è in possesso di un token la pagina può essere caricata, ma per ogni richiesta al backend protetta bisogna far validare il token.

/**
 * Componente protetta che consente l'accesso solo agli utenti autenticati.
 * Se il token di autenticazione non è presente, reindirizza alla home page.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - I componenti figli da renderizzare se autenticato.
 * @returns {React.ReactNode} I figli se autenticato, altrimenti un redirect.
 */
function ProtectedRoute({ children }) {
  const { logout } = useContext(authContext)
  if (!getToken()) {
    logout()
  }
  return children;
}

export default App;
