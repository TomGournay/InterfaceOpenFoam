import { Link } from "react-router-dom";
import "../css/NavBar.css";
import logo from "../images/logo.png";
import Button from "./Button";
import { useEffect, useState } from "react";

function NavBar() {
  //Charge le caseName
  const [caseName, setCaseName] = useState("");

  useEffect(() => {
    const storedCaseName = localStorage.getItem("caseName");
    if (storedCaseName) {
      setCaseName(storedCaseName);
    } else {
      setCaseName("Aucune");
    }
  }, []);

  //Fonction pour changer/charger le caseName si besoin
  const handleLoadSimulation = () => {
    const userInput = prompt("Entrez le nom de votre simulation existante :");

    if (userInput && userInput.trim() !== "") {
      localStorage.setItem("caseName", userInput.trim());
      setCaseName(userInput.trim());
      alert ("Rechargez la page pour valider le changement")
    } else {
      alert("Nom invalide. Veuillez réessayer.");
    }
  };

  //Frontend
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <Link to="/"><img src={logo} alt="Logo" style={{ height: '60px' }} /></Link>
        </div>
        <div className="navbar-links">
          <Link to="/solvers" className="nav-link">Solvers</Link>
          <Link to="/mesh" className="nav-link">Mesh</Link>
          <Link to="/boundaries" className="nav-link">Boundaries</Link>
          <Link to="/setup" className="nav-link">Setup</Link>
          <Link to="/advanced" className="nav-link">Advanced</Link>
          <Link to="/compute" className="nav-link">Compute</Link>
        </div>
      </div>
      <div className="navbar-right">
        <Button label="Charger une Simulation" onClick={handleLoadSimulation} />
        <div className="case-name">
          Simulation en cours : <strong>{caseName}</strong>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
