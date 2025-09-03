import { useEffect } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import './EventsHistory.css';
import { useState } from "react";
import requestApi from "../../requestApi";
import EventContainer from "../../components/EventContainer/EventContainer";
export function EventsHistory() {

    const [eventsData, setEventsData] = useState([]);
    const [searchData, setSearchData] = useState({
        text: '',
        date: null,
        isGrowOrd: true
    });
    const [searchLabel, setSearchLabel] = useState('Search Event:');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await requestApi.get("/Events/getFilteredEvents",
                    {
                        params: { text: searchData.text, date: searchData.date, isGrowOrd: searchData.isGrowOrd},
                    }
                );
                setEventsData(response.data);

            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        fetchEvents();
    }, [searchData.text, searchData.date]);






    //DA COMPLETAREEEEEEEE
    //Sistemare la searchbar e aggiungere funzionalità per selezionare gara o allenamenti o entrambi.
    return (
        <div className="storico-attivita">
            <PageTitle title={"Storico Eventi"} searchData={searchData} searchLabel={searchLabel} setSearchData={setSearchData} />
            {eventsData.map((event, key) => {
                return (
                    <EventContainer event={event} />
                )
            })}

        </div>
    );


}