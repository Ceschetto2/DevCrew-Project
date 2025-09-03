import { PageTitle } from '../../../components/PageTitle/PageTitle';
import './UserList.css';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { eventsDataContext } from '../../../Hooks/Events/EventProvider';
import UserCard from '../../../components/userCard/UserCard';
import { PopupConfirmation } from '../../../components/PopupConfirmation/PopupConfirmation';
import requestApi from '../../../requestApi';
import { authContext } from '../../../Hooks/Token/tokenState';


export function UserList() {
    const [users, setUsers] = useState([]);
    const [confirmationPopupState, setConfirmationPopupState] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); 
    const { setEventsData, refreshEventsDataTrigger, setCurrentMonthYear } = useContext(eventsDataContext);
    const [searchData, setSearchData] = useState({text: '', date: ''});
    const {role} = useContext(authContext)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await requestApi('/User/getUsersFiltered',
                    {
                        params: { text: searchData.text, date: searchData.date }
                    }
                );
                const data = await response.data;
                setUsers(data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }
        fetchUsers();
    }, [refreshEventsDataTrigger, searchData]);


    const navigator = useNavigate();


    const handleEventsPartecipation = async (user) => {
        try {
            const response = await requestApi('/User/getUsersEventParticipations',
                {
                    params: { user_id: user.user_id }
                });

            const data = await response.data;
            setEventsData(data);
            setCurrentMonthYear({})
            navigator('/EventsList');
        } catch (error) {
            console.log('There was a problem with the fetch operation:', error);
        }


    };

    const onRemove = (user) => {
        setConfirmationPopupState(true);
        setUserToDelete(user);
    }

    const deleteUser = async (user) => {
        try {
            const response = await requestApi.post('/User/deleteUser',
                {
                    user_id: user.user_id
                });

            alert('Utente rimosso con successo');
            setUsers(users.filter(u => u.user_id !== user.user_id));
        } catch (error) {
            alert('Errore durante la rimozione dell\'utente');
            console.log('There was a problem with the fetch operation:', error);
        }
    }




    return (
        <div className="user_list">
            <PageTitle title="Lista Utenti" searchData={searchData} searchLabel={"Ricerca Utente"} setSearchData={setSearchData} />
            {confirmationPopupState ? (
                <PopupConfirmation
                    title={`Rimozione Utente ID: ${userToDelete.user_id}`} message={`Sei sicuro di voler rimuovere ${userToDelete.name} ${userToDelete.surname}?`}
                    onConfirm={() => { deleteUser(userToDelete); setConfirmationPopupState(false); }}
                    onCancel={() => setConfirmationPopupState(false)}
                />
            ) : null}
            {users.length > 0 ? (
                users.map((user) => <UserCard user={user} handleEventsPartecipation={handleEventsPartecipation} onRemove={onRemove} userManagment={role === 'president'} eventManagment={['president', 'trainer'].includes(role)} />
                )) : (
                <p>Nessun utente trovato.</p>
            )}
        </div>
    );
}

