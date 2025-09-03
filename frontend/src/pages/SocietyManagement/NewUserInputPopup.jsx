
import './NewUserInputPopup.css';
import requestApi from '../../requestApi';

export function NewUserInputPopup({ setIsOpen, newUserData, setNewUserData }) {
    const handleChange = (e) => {
        setNewUserData({
            ...newUserData,
            [e.target.name]: e.target.value,
            society_id: newUserData.society_id

        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestApi.post('/User/addNewUser', newUserData);
            alert('User registered successfully');
            setIsOpen(false);
        } catch (error) {
            alert('Error registering user. Please try again.');
            console.error('Error registering user:', error);
        }
    };
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };
    return (

        <div className="popup-background" onClick={handleBackgroundClick}>
            <div className="new-user-popup">
                <h2>Register New {newUserData.role.charAt(0).toUpperCase() + newUserData.role.slice(1)}</h2>
                <form className='user-input-form' onSubmit={handleSubmit}>
                    <label>Username:
                        <input type="text" name="username" placeholder="Username" value={newUserData.username} onChange={handleChange} required />
                    </label>
                    <label>Nome: <input type="text" name="name" placeholder="Nome" value={newUserData.name} onChange={handleChange} required /></label>
                    <label>Cognome: <input type="text" name="surname" placeholder="Cognome" value={newUserData.surname} onChange={handleChange} required /></label>
                    <label>Data di Nascita: <input type="Date" name="birthDate" placeholder="1994/04/04" value={newUserData.birthDate} onChange={handleChange} required /></label>

                    <label>E-Mail: <input type="email" name="mail" placeholder="Email" value={newUserData.mail} onChange={handleChange} required /></label>
                    <div className='buttons-div'>
                        <button type="submit">Register</button>
                        <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}