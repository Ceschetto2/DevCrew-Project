import { useState } from 'react';
import './UpdateSocietyDataPopup.css';
import requestApi from '../../requestApi';

export function UpdateSocietyDataPopup({ setIsOpen, societyData, setSocietyData }) {


    const [updatedSocietyData, setUpdatedSocietyData] = useState(societyData);


    const handleChange = (e) => {
        setUpdatedSocietyData({
            ...updatedSocietyData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await requestApi.put('/Society/updateSocietyData', updatedSocietyData);
            console.log('Society data update successfully:', response.data);
            alert('Data Updated Successfully');
            setSocietyData(updatedSocietyData);
            setIsOpen(false);
        } catch (error) {
            alert('Error updadating society data. Please try again.');
            console.error('Error updating society data:', error);
        }
    };
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };
    return (

        <div className="popup-background" onClick={handleBackgroundClick}>
            <div className="update-society-data-popup">
                <form className='user-input-form' onSubmit={handleSubmit}>
                    <label>Nome Società: <input type="text" name="company_name" placeholder="Nome Società" value={updatedSocietyData.company_name} onChange={handleChange} required /></label>
                    <label>Numero di telefono:
                        <input type="text" name="phone" placeholder="1231231234" value={updatedSocietyData.phone} onChange={handleChange} required />
                    </label>
                    <label>Città: <input type="text" name="location" placeholder="Città" value={updatedSocietyData.location} onChange={handleChange} required /></label>
                    <label>Indirizzo <input type="text" name="adress" placeholder="Via Mario Rossi" value={updatedSocietyData.adress} onChange={handleChange} required /></label>
                    <label>Numero Civico: <input type="text" name="house_number" placeholder="123" value={updatedSocietyData.house_number} onChange={handleChange} required /></label>
                    <label>Indirizzo mail della Societa: <input type="email" name="mail" placeholder="Email" value={updatedSocietyData.society_mail} onChange={handleChange} required /></label>
                    <div className='buttons-div'>
                        <button type="submit">Register</button>
                        <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}