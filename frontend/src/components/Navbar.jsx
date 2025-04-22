import { Link } from "react-router-dom";
import "../css/NavBar.css";
import logo from "../images/logo.png";
import Button from "./Button";
import { useEffect, useState } from "react";
import SimulationLoader from "./SimulationLoader";

function NavBar() {
  //Charge le caseName
  const [caseName, setCaseName] = useState("");
  const [showLoader, setShowLoader] = useState(false);

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
    setShowLoader(true);
  };
  
  const handleModalSubmit = (newCaseName, newSolver) => {
    localStorage.setItem("caseName", newCaseName);
    localStorage.setItem("solverName", newSolver);
    setCaseName(newCaseName);
    setShowLoader(false);
    alert("Simulation chargée. Rechargez la page pour appliquer les changements.");
  };
  
  //Frontend
  return (
    <>
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
  
      {/* Modal d'entrée de simulation + solveur */}
      <SimulationLoader
        show={showLoader}
        onClose={() => setShowLoader(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );  
}

export default NavBar;
