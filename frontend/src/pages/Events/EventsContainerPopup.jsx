import { useContext } from "react";
import { eventsDataContext } from "../../Hooks/Events/EventProvider";
import EventContainer from "../../components/EventContainer/EventContainer";

export function EventsContainerPopup({event}) {

    const { setIsEventPopup} = useContext(eventsDataContext);
    return(
        <div onClick={() => setIsEventPopup(false)} className="popup-background">
            <EventContainer event = {event} />
        </div>
    )
}