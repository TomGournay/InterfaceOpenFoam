import React from "react";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import "../css/compute.css";

function Compute() {
  //VARIABLE
  const [caseName, setCaseName] = useState("");
  const [solverName, setSolverName] = useState("");
  const [status, setStatus] = useState(null);
  //RAPPELLER LE NOM DU CAS
  useEffect(() => {
    const storedCaseName = localStorage.getItem("caseName");
    if (storedCaseName) {
      setCaseName(storedCaseName);
    } else {
      alert(
        "Creez d'abord votre simulation dans solvers ou renseignez le nom de la simulation que vous avez fait dans le chargeur de simulation"
      );
    }
  });

  //RAPPELLER LE NOM DU SOLVER
  useEffect(() => {
    const storedSolverName = localStorage.getItem("solverName");
    if (storedSolverName) {
      setSolverName(storedSolverName);
    } else {
      alert(
        "Creez d'abord votre simulation dans solvers ou renseignez le nom de la simulation que vous avez fait dans le chargeur de simulation"
      );
    }
  });

  //LANCER LA SIMU
  const startSimulation = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/compute/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseName: caseName,
          solverName: solverName,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("✅ Lancement de la simulation effectué !");
        console.log("Sortie :", result.output);
      } else {
        setStatus("❌ Échec de la simulation.");
        console.error("Erreur : ", result.error || "Réponse inattendue");
      }
    } catch (error) {
      setStatus("❌ Erreur réseau ou serveur.");
      console.error("Erreur : ", error);
    }
  };

  //Supprimer les processeurs
  const rmProc = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/compute/rm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseName: caseName,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("✅ Dossier Processeurs supprimé !");
        console.log("Sortie :", result.output);
      } else {
        setStatus(
          "❌ Il n'y avait pas de dossier processeur dans ta simulation."
        );
        console.error("Erreur : ", result.error || "Réponse inattendue");
      }
    } catch (error) {
      setStatus("❌ Erreur réseau ou serveur.");
      console.error("Erreur : ", error);
    }
  };

  //RECONSTRUIRE LES RESULTATS
  const reconstruct = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/compute/reconstruct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caseName: caseName,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("✅ Solution reconstruite !");
        console.log("Sortie :", result.output);
      } else {
        setStatus(
          "❌ La simulation n'était pas en parallèle, impossible de reconstruire"
        );
        console.error("Erreur : ", result.error || "Réponse inattendue");
      }
    } catch (error) {
      setStatus("❌ Erreur réseau ou serveur.");
      console.error("Erreur : ", error);
    }
  };

  //AFFICHER LES RESULTATS
  const results = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/compute/results",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            caseName: caseName,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("✅ Resultat ouvert !!");
        console.log("Sortie :", result.output);
      } else {
        setStatus("❌ Impossible d'ouvrir les resultats");
        console.error("Erreur : ", result.error || "Réponse inattendue");
      }
    } catch (error) {
      setStatus("❌ Erreur réseau ou serveur.");
      console.error("Erreur : ", error);
    }
  };

  return (
    <div className="centered-text">
      <h2>Lancer la simulation</h2>
      <Button label="Supprimer Processeur" onClick={rmProc} />
      <Button label="Démarrer" onClick={startSimulation} />
      <Button label="Reconstruire" onClick={reconstruct} />
      <Button label="Resultats" onClick={results} />
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
export default Compute;
