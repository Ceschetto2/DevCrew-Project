import { useState } from 'react';
import { PageTitle } from '../../components/PageTitle/PageTitle';
import './Contacts.css'
import { useEffect } from 'react';
import UserCard from '../../components/userCard/UserCard';
import requestApi from '../../requestApi';

export function Contacts() {


    const [contacts, setContacts] = useState([]);
    const [searchParams, setSearchParams] = useState({ text: "", date: ""});


    useEffect(() => {
        const fetchContacts = async () => {
            try {
                console.log(searchParams);
                const response = await requestApi.get("/User/getContactsFiltered",
                    {
                         params: { text: searchParams.text, date: searchParams.date }
                    }
                   
                )
                console.log(response.data);
                setContacts(response.data);
            } catch (error) {
                alert('Si è verificato un errore durante il recupero dei contatti.');
                console.error('Error fetching contacts:', error);
            }
        }
        fetchContacts();
    }, [searchParams]);

    return (
        <div className="contacts_list">
            <PageTitle title="Contatti" setSearchData={setSearchParams} searchData={searchParams} searchLabel={"Ricerca Allenatore/Presidente"}/>
            {contacts.length === 0 ? (
                <p>Nessun contatto disponibile.</p>
            ) : (
                contacts.map((contact, index) => (
                    <UserCard user={contact} isManagment={false} />)

                )
            )}
        </div>
    );
}

