import "./InputEventPopup.css";
import { useContext, useEffect, useState } from 'react';
import { eventsDataContext } from '../../Hooks/Events/EventProvider';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
export function InputEventPopup({ startStr, endStr }) {

    const { sendEvent, setIsInputEventPopupOpen, refreshEventsDataTrigger, setRefreshEventsDataTrigger } = useContext(eventsDataContext);
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Ottieni ora locale in formato HH:mm
    const timeNow = now.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const [dateStr, setDateStr] = useState({ startDate: startStr ? startStr : today, startTime: timeNow, endDate: endStr ? endStr : today, endTime: timeNow })
    const defaultEvent = {
        allDay: false,
        location: null,
        eventType: "Gara",
        start: new Date(),
        end: new Date(),
        competitionCode: null,
        boatType: null,
        costalType: null,
        description: null
    }
    const [event, setEvent] = useState(
        defaultEvent
    )

    const [errorLabel, setErrorLabel] = useState("")
    const setDate = (e) => {

        setDateStr({
            ...dateStr,
            [e.target.name]: e.target.value
        })
    }



    const setEventData = (e) => {
        const { name, type, checked, value } = e.target
        setEvent({
            ...event,
            [name]: type === "checkbox" ? checked : value
        })

    }

    useEffect(() => {
        if (event.boatType !== "Costal") {
            setEvent({
                ...event,
                costalType: defaultEvent.costalType
            })
        }

    }, [event.boatType])

    useEffect(() => {
        if (event.eventType === "Riunione Associativa") {
            setEvent({
                ...event,
                costalType: defaultEvent.costalType,
                competitionCode: defaultEvent.competitionCode,
                boatType: defaultEvent.boatType

            })
        }
    }, [event.eventType])

    useEffect(() => {
        console.log("dateStr", dateStr)
        setEvent({

            ...event,

            start: new Date(dateStr.startDate + "T" + dateStr.startTime),
            end: new Date(dateStr.endDate + "T" + dateStr.endTime)
        })

    }, [dateStr])

    useEffect(() => {
        setDateStr({
            ...dateStr,
            endDate: event.allDay ? "" : today,
            endTime: event.allDay ? "" : timeNow,
        })

    }, [event.allDay])


    const submitEvent = () => {
        //fare i controlli logici
        if (!event.title) {
            setErrorLabel("Inserisci il titolo dell'attività");
            return;
        }
        if (event.eventType === "Gara" && (!event.competitionCode || event.competitionCode === "")) {
            setErrorLabel("Inserisci il codice Gara.")
            return;
        }
        if (event.location === "") {
            setErrorLabel("Inserisci il luogo della gara.")
            return;
        }
        const now = new Date()
        if (event.start > event.end || event.start < now) {
            setErrorLabel("Errore nell'inserimento della data.");
            return;
        }
        event.participationStatus = false;

        console.log("evento inserito", event)
        sendEvent(event);
        setRefreshEventsDataTrigger(!refreshEventsDataTrigger);

        setIsInputEventPopupOpen(false);
    }
    const eventReset = () => {
        {
            setEvent(
                defaultEvent
                //fare le cose per il reset al default
            )
            setDateStr({
                startDate: today,
                startTime: timeNow,
                endDate: today,
                endTime: timeNow
            })

        }
    }

    return (
        <div className="popup-background">
            <div className='popup-container'>

                <div className='top-bar' >
                    <label className='head' > Inserisci Nuove Attività </label>
                    <button className="close" onClick={() => setIsInputEventPopupOpen(false)}>
                        <FontAwesomeIcon className="close_icon" icon={faCircleXmark} style={{ color: "#ed0707", }} />
                    </button>
                </div>

                <EventTitleSelector setEventData={setEventData} />

                <EventTimeDateSelector dateStr={dateStr} event={event} setDate={setDate} setEventData={setEventData} />

                <EventLocationSelector setEventData={setEventData} />

                <EventTypeSelector setEventData={setEventData} event={event} />

                <EventDescriptionSelector setEventData={setEventData} event={event} />

                <div className="submit-reset-button">
                    <button className="resetbutton" onClick={eventReset}>Reset</button>
                    <button className="submitbutton" onClick={submitEvent} >Submit</button>
                </div>
                <label className="dark-text">{errorLabel}</label>
            </div>

        </div>
    );
}
function EventTitleSelector({ setEventData }) {
    return (
        <label className="dark-text">  Titolo:
            <input className="inputBar" type="text" name="title" placeholder="Inserisci titolo attività" onChange={setEventData} />
        </label>
    )
}
function EventTimeDateSelector({ dateStr, event, setEventData, setDate }) {
    return (

        <div className="data-container">



            <label className="dark-text" style={{ fontSize: "70%" }}> Tutto il giorno

                <input className="checkbox" type="checkbox" name="allDay" checked={event.allDay} onChange={setEventData} />
            </label>

            <div className="time-date-container">

                <label className="dark-text"> Inizio:
                    <input className="inputdate" name="startDate" type="date" defaultValue={dateStr.startDate} onChange={setDate} />

                    <input className="inputdate" name="startTime" type="time" value={dateStr.startTime} onChange={setDate} />
                </label>


                <label className="dark-text"> Fine:
                    {<input className="inputdate" name="endDate" type="date" value={dateStr.endDate} disabled={event.allDay} onChange={setDate} />}
                    <input className="inputdate" name="endTime" type="time" value={dateStr.endTime} disabled={event.allDay} onChange={setDate} />
                </label>


            </div>

        </div>
    )
}
function EventLocationSelector({ setEventData }) {
    return (
        <label className="dark-text">Luogo:
            <input className="inputBar" type="text" name="location" placeholder="Inserisci il luogo" onChange={setEventData} />
        </label>)
}
function EventTypeSelector({ event, setEventData }) {
    const eventTypes = ["Gara", "Allenamento", "Riunione Associativa"]
    const boatTypes = ["", "Gozzo Nazionale", "Jole Lariana", "Bilancella", "Costal", "Veneta", "Bisse", "Galeone", "VIP750"]
    const costalTypes = ["", "C1X", "C2X", "C2X+", "C4X", "C4X+", "C8X+"]
    return (
        <div className="event-type-container">
            <label className="dark-text">Tipo Evento:
                <div className="event-type-select">
                    {eventTypes.map(opt => (
                        <label key={opt} className="dark-text">
                            <input
                                className="checkbox"
                                type="radio"
                                name="eventType"
                                value={opt}
                                checked={event.eventType === opt}
                                onChange={setEventData}
                            />
                            {opt}
                        </label>
                    ))}
                </div>
            </label>
            {(event.eventType !== eventTypes[2]) ?
                <div className="boat-selector-container">
                    {event.eventType === eventTypes[0] ?
                        <label className="dark-text">Codice Gara:
                            <input className="inputBar" name="competitionCode" placeholder="Inserisci codice gara" value={event.competitionCode} onChange={setEventData} />
                        </label> : null}
                    <label className="dark-text">
                        Specialità:
                        <select className="inputBar" name="boatType" placeholder="Scegli la specialità" value={event.boatType} onChange={setEventData} style={{ height: "30px", borderColor: "rgba(12, 41, 62, 1)", borderWidth: "2px" }}>
                            {boatTypes.map((boat) => (
                                <option value={boat}>{boat}</option>
                            ))}
                        </select>
                        {event.boatType === "Costal" ?
                            <select name="costalType" value={event.costalType} onChange={setEventData}>
                                {costalTypes.map((cType) => (
                                    <option value={cType}>{cType}</option>
                                ))}
                            </select>

                            : null}

                    </label>

                </div> : null
            }




        </div>

    )
}
function EventDescriptionSelector({ event, setEventData }) {
    return (<label className="dark-text"> Descrizione Evento:
        <textarea className="inputdescriz"
            name="description"
            id="note"
            rows="4"
            cols="50"
            value={event.description}
            onChange={setEventData}
        />
    </label>)
}

