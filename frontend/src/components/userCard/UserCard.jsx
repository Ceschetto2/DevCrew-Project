import './UserCard.css';
export default function UserCard({ user, handleEventsPartecipation, onRemove, userManagment, eventManagment }) {


    return (

        <div className="user_card">

            <h3 className="user_name">{user.name} {user.surname}</h3>

            <p className="user_field"><span>Email:</span> {user.mail}</p>
            <p className="user_field"><span>Ruolo:</span> {user.role}</p>
            <p className="user_field"><span>Data di Nascita:</span> {user.birthDate.split('T')[0]}</p>

            {(userManagment || eventManagment) ?
            <div className="user_actions">
            {eventManagment ? 
                <button className="infopartebutton"onClick={() => handleEventsPartecipation(user)}>
                    Eventi A Cui Partecipa
                </button>:null}

                {userManagment ? <button className="RemoveUbutton"onClick={() => onRemove(user)} >Rimuovi</button> : null}
            </div> : null}
        </div>
    );
}