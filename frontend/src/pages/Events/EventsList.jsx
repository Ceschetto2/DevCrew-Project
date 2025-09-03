import { PageTitle } from "../../components/PageTitle/PageTitle";
import './EventsList.css';
import { useContext } from 'react';
import { eventsDataContext } from '../../Hooks/Events/EventProvider';
import ActivityContainer from '../../components/EventContainer/EventContainer';
import { authContext } from "../../Hooks/Token/tokenState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



export function EventsList() {
    const { eventsData,deleteEvent, currentMonthYear, setCurrentMonthYear } = useContext(eventsDataContext);
    const {role} = useContext(authContext)

    const eventsFilter = (event) => {
        if (currentMonthYear.month && currentMonthYear.year) {
            const eventDate = new Date(event.start);
            return (eventDate.getMonth() + 1 === currentMonthYear.month && eventDate.getFullYear() === currentMonthYear.year);
        }
        return true; // If month or year is not set, show all events
    }
    const goPrevMonth = () =>
        setCurrentMonthYear((prev) =>
            prev.month === 1
                ? { month: 12, year: prev.year - 1 }
                : { month: prev.month - 1, year: prev.year }
        );

    const goNextMonth = () =>
        setCurrentMonthYear((prev) =>
            prev.month === 12
                ? { month: 1, year: prev.year + 1 }
                : { month: prev.month + 1, year: prev.year }
        );
    const monthNumberToName = () => {
        return new Date(currentMonthYear.year, currentMonthYear.month - 1, 1)
            .toLocaleString("it-IT", { month: "long" });
    }



    return (
        <div className="lista_attivita">
            <PageTitle title={"Lista Attività"} />
            {(currentMonthYear.month && currentMonthYear.year) ? <div className='month-navigation'>
                <button className="prevmesebutton"onClick={goPrevMonth}><FontAwesomeIcon icon="fa-solid fa-arrow-left" />  Mese Precedente </button>
                <h2>{monthNumberToName(currentMonthYear.month)}</h2>
                <button className="succmesebutton"onClick={goNextMonth}>Mese Successivo  <FontAwesomeIcon icon="fa-solid fa-arrow-right" /></button>
            </div> : null}
            {eventsData.filter(eventsFilter).map((event, index) => {
                return <ActivityContainer key={index} event={event} enableDelete = {role === 'president'} onDelete={() => deleteEvent(event.event_id)} />;
            })}
        </div>
    );
}