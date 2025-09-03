import { useContext } from 'react';
import { eventsDataContext } from '../../Hooks/Events/EventProvider';
import './EventContainer.css'



export default function EventContainer({ event, enableDelete = false, onDelete }) {
    const {cancelParticipation, submitParticipation} = useContext(eventsDataContext);

    const dateStart = new Date(event.start);
    const dateEnd = new Date(event.end);
    const formattedStart = dateStart.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const formattedEnd = dateEnd.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    const actualDate= new Date();

    return (
        <div className="activity-container">
            <div className='event-title-box'>
                <h1 className='event-title'>{event.title}</h1>

                <p >{event.allDay ? formattedStart : formattedStart + " - " + formattedEnd}</p>
            </div>
            <h2>{event.location}</h2>
            <p className='event-description'>{event.description}</p>


            <div className='buttons-container'>
                {((dateStart >= actualDate && (event.participationStatus !== undefined)))? event.participationStatus ?<button onClick={()=>cancelParticipation(event.event_id)}>Cancella Partecipazione</button>:<button onClick={() => submitParticipation(event.event_id)}>Partecipa</button> : ""}
                {enableDelete && <button onClick={onDelete}>Rimuovi</button>}
            </div>
        </div>
    )

}