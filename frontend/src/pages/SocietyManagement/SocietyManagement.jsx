import { useState } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import './SocietyManagement.css';
import { NewUserInputPopup } from "./NewUserInputPopup";
import { useEffect } from "react";
import { UpdateSocietyDataPopup } from "./UpdateSocietyDataPopup";
import requestApi from "../../requestApi";


export function SocietyManagement() {

    const [isPopupInputNewUser, setIsPopupInputNewUser] = useState(false);
    const [societyData, setSocietyData] = useState({});
    const [isUpdateSocietyDataPopupOpen, setIsUpdateSocietyDataPopupOpen] = useState(false);

    useEffect(() => {

        const fetchSocietyData = async () => {

            const response = await requestApi.get("/Society/getSocietyData", {
            });
            setSocietyData(response.data);
            setNewUserData({
                ...newUserData,
                society_id: response.data.p_iva // Assicurati che societyData.p_iva sia definito prima di usarlo
            });

        };
        fetchSocietyData();
    }, []); 


    const [newUserData, setNewUserData] = useState({
        username: '',
        name: '',
        surname: '',
        birthDate: null,
        mail: '',
        password: '',
        role: '',
        society_id: '' // Inizializza society_id come stringa vuota
    });


    const addNewAthlete = () => {
        setNewUserData({
            ...newUserData,
            role: 'athlete',
        })
        setIsPopupInputNewUser(true);

    }
    const addNewTrainer = () => {
        setNewUserData({
            ...newUserData,
            role: 'trainer',
        })
        setIsPopupInputNewUser(true);

    }
    return (
        <div className="gestione_societa">
            {isPopupInputNewUser && <NewUserInputPopup setIsOpen={setIsPopupInputNewUser} newUserData={newUserData} setNewUserData={setNewUserData} />}
            {isUpdateSocietyDataPopupOpen && <UpdateSocietyDataPopup setIsOpen={setIsUpdateSocietyDataPopupOpen} societyData={societyData} setSocietyData={setSocietyData} />}
            <PageTitle title={"Gestione Societa"} />
            <div className="society-data">
                <p>Nome: {societyData.company_name}</p>
                <p>Indirizzo: {societyData.adress} {societyData.house_number}, {societyData.location}</p>

                <p>Partita IVA: {societyData.p_iva}</p>

                <p>Numero di telefono: {societyData.phone}</p>
                <p>Email: {societyData.society_mail}</p>
            </div>
            <div className="buttons-container">
                <button onClick={addNewAthlete} >Registra Nuovo Atleta</button>
                <button onClick={addNewTrainer} >Registra Nuovo Allenatore</button>
                <button onClick={() => setIsUpdateSocietyDataPopupOpen(true)} >Modifica Dati Società</button>
            </div>


        </div>
    );
}