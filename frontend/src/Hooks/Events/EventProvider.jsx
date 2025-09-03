import { createContext, useState, useEffect } from 'react';
import requestApi from '../../requestApi';
export const eventsDataContext = createContext(null);
export function EventProvider({ children }) {

  const [eventsData, setEventsData] = useState([]);
  const [isInputEventPopupOpen, setIsInputEventPopupOpen] = useState(false);
  const [refreshEventsDataTrigger, setRefreshEventsDataTrigger] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [isEventPopup, setIsEventPopup] = useState(false);
  const [currentMonthYear, setCurrentMonthYear] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

  const submitParticipation = async (eventId) => {
    try {
      const response = await requestApi.post('/Events/submitParticipation',
        { event_id: eventId }
      );

      setRefreshEventsDataTrigger(!refreshEventsDataTrigger);
      alert('Partecipazione all\'evento effettuata con successo');

    } catch (error) {
      alert('Errore durante la partecipazione all\'evento');
      console.error('Error fetching events:', error);
    }
  }

  async function sendEvent(newEvent) {

    try {
      await requestApi.post("/Events/addSingleEvent", newEvent)
    }
    catch (e) {
      console.log("Impossibile inserire l'attività. ", e)
    }
  }




  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await requestApi.get('/Events/allEvents');
        setEventsData(response.data)
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
    fetchEvents();

  }, [, refreshEventsDataTrigger])


  async function deleteEvent(event_id) {
    try {
      await requestApi.delete('/Events', { params: { event_id: event_id } })

      alert('Rimozione avvenuta con successo')
      setEventsData(eventsData.filter(event => event.event_id !== event_id))

    } catch (error) {
      console.error(error)
      alert('Impossibile rimuovere l\'evento')
    }

  }

  async function cancelParticipation(eventId) {
    try {
      const response = await requestApi.post('Events/cancelParticipation',
        { event_id: eventId }
      );

      event.participationStatus = false;
      setRefreshEventsDataTrigger(!refreshEventsDataTrigger);
      alert('Cancellazione partecipazione effettuata con successo');

    } catch (error) {
      alert('Errore durante la cancellazione della partecipazione all\'evento');
      console.error('Error updating events participations:', error);
    }
  }





  return (
    <eventsDataContext.Provider value={{ eventsData, setEventsData, submitParticipation, cancelParticipation, sendEvent, deleteEvent, isEventPopup, setIsEventPopup, selectedEvent, setSelectedEvent, isInputEventPopupOpen, setIsInputEventPopupOpen, refreshEventsDataTrigger, setRefreshEventsDataTrigger, currentMonthYear, setCurrentMonthYear }}>
      {children}
    </eventsDataContext.Provider>

  );
}