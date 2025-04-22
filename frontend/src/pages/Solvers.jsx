import Button from "../components/Button";
import Inputtext from "../components/Inputtext";
import RadioButtons from "../components/RadioButtonGroup";
import "../css/global.css";
import { useEffect, useState } from "react";

function Solvers() {
  //Declaration des variables
  const [caseName, setCaseName] = useState("");
  const [solverName, setSolverName] = useState("");

  //Declaration des solvers
  const solverlist = [
    { label: "icoFoam", value: "icoFoam" },
    { label: "pisoFoam", value: "pisoFoam" },
  ];

  //Redefinir la variable solverName quand on choisi l'option
  const handleSolverChange = (value) => {
    setSolverName(value);
  };

  /*
  // TEST POUR VERIFIER QUE LES VALEURS S'ACTUALISENT BIEN
  useEffect(() => {
    console.log("Nouveau solveur sélectionné :", solverName);
  }, [solverName]);
  

  useEffect(() => {
    console.log("Nom de la simulation :", caseName);
  }, [caseName]);
  */

  //Fonction backend, Creation d'une copie de template dans le dossier simulation
  const handleSubmit = async () => {
    if (!caseName || !solverName) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    localStorage.setItem("caseName", caseName);
window.dispatchEvent(new Event("caseNameChanged"));

localStorage.setItem("solverName", solverName);
window.dispatchEvent(new Event("solverNameChanged"));

    try {
      const response = await fetch("http://localhost:3000/api/solvers/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solverName: solverName,
          caseName: caseName,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error || "Erreur inconnue.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Erreur de communication avec le serveur.");
    }
  };

  //AFFICHAGE frontend
  return (
    <>
      <div className="centered-text">
        
        <div >
          <h2>Choisir un nom de simulation : </h2>  
        </div>
        
        <div style={{ marginTop: "20px" }}>
          <Inputtext text={caseName} onChange={setCaseName} placeholder="exemple : AymericJTM" />
        </div>
        
        <div style={{ marginTop: "40px" }} >
          <h2>Choisir un solver :</h2>
        </div>
        <div style={{ marginTop: "20px" }}>
          <RadioButtons options={solverlist} onChange={handleSolverChange} />
        </div>

        <div style={{ marginTop: "20px" }}>
          <Button label="Valider" color="Green" onClick={handleSubmit} />
        </div>
      </div>
    </>
  );
}

export default Solvers;
