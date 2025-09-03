import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid/index.js'
import interactionPlugin from '@fullcalendar/interaction/index.js'
import "./Events.css"
import { useContext } from 'react'
import { eventsDataContext } from '../../Hooks/Events/EventProvider';
import { Link } from 'react-router-dom'
import { EventsContainerPopup } from './EventsContainerPopup'
import { ButtomAi } from '../../components/ButtomAi/ButtomAi';
import { InputEventPopup } from '../../components/InputEventPopup/InputEventPopup';


// <button type="button" className='aibottom'onClick={sendMessage} disabled={isLoading}>Invia</button>

import { authContext } from "../../Hooks/Token/tokenState";

export function Events() {
    const { eventsData,
        isInputEventPopupOpen,
        setIsInputEventPopupOpen,
        isEventPopup,
        setIsEventPopup,
        selectedEvent,
        setSelectedEvent,
        setCurrentMonthYear } = useContext(eventsDataContext);




    const inputPopupHandler = () => {
        setIsInputEventPopupOpen(true);

    }
    const eventPopupHandler = (event_id) => {
        
        setSelectedEvent(eventsData.find(event => event.event_id === event_id));
        setIsEventPopup(true);
    }

    const handleEventDidMount = (arg) => {
        if (arg.event.extendedProps.participationStatus) {
            arg.el.classList.add('evt-participated');
        }
        // possibilità di aggiunta di css specifici per tipologia di evento
    };
    const { role } = useContext(authContext)







    return (
        <div className="activity">
            {isInputEventPopupOpen ? <InputEventPopup /> : null}
            {isEventPopup && <EventsContainerPopup event={selectedEvent} />}
            <div>
                <h1 className="titolo">Attività</h1>
                {['president', 'trainer'].includes(role) && <button className="uploadButton" onClick={inputPopupHandler}>Aggiungi attività</button>}
                <Link className="nav-link" to="/EventsList">
                    <button className="nav">Lista Attività</button>
                </Link>

            </div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay'
                }}
                datesSet={(arg) => { setCurrentMonthYear({ month: arg.view.currentStart.getMonth() + 1, year: arg.view.currentStart.getFullYear() }) }}

                height="auto"
                aspectRatio={1.8}
                initialDate={new Date()}
                selectable={true}
                events={eventsData}
                eventDidMount={handleEventDidMount}
                eventClick={(info) => {
                    eventPopupHandler(info.event.extendedProps.event_id);
                }}
                eventMouseEnter={(info => {
                    info.el.style.backgroundColor = 'lightblue'
                    info.el.style.cursor = 'pointer'
                }
                )}
                eventMouseLeave={(info => {
                    info.el.style.backgroundColor = ''
                }
                )}
                dateClick={(info) => {
                    const calendarApi = info.view.calendar;
                    calendarApi.changeView('dayGridDay', info.dateStr);
                }}

                locale="it"
                buttonText={{
                    today: 'Oggi',
                    month: 'Mese',
                    week: 'Settimana',
                    day: 'Giorno',
                }}
            />



            <ButtomAi>

            </ButtomAi>




        </div>



    )
}