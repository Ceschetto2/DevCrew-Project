import { Link } from "react-router-dom";
import listOfCardsData from "../../Assets/dashboard-menu.json";
import "./Dashboard.css";
import { useContext } from "react";
import { authContext } from "../../Hooks/Token/tokenState";
export function Dashboard() {
    const { role } = useContext(authContext)
    return (

        < div className="dashboard-container" >
            <text className="titolo">Dashboard</text>
            <div className="dashboard-content">
                {listOfCardsData.filter(card => card.roles.includes(role) || card.roles.length === 0).map((card) => (dashboardMenuCard(card.cardIcon, card.cardTitle, card.cardPage)))}
            </div>
        </div >
    )
}

function dashboardMenuCard(cardIcon, cardText, cardPage) {
    return (

        <Link to={cardPage}>
            <button className="dashboard-menu-card">
                <div className="image-frame">
                    <img className="card-icon" src={cardIcon} alt="immagine assente" />
                </div>
                <text className="card-text">{cardText}</text>
            </button>
        </Link>
    )
}