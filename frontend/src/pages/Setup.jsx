import React, { useState, useEffect } from "react";
import Inputtext from "../components/Inputtext";
import Button from "../components/Button";
import "../css/Setup.css";

function Setup() {
  const [caseName, setCaseName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [deltaT, setDeltaT] = useState("");
  const [writeInterval, setWriteInterval] = useState("");
  const [numberOfSubdomains, setNumberOfSubdomains] = useState("");

  useEffect(() => {
    const storedCaseName = localStorage.getItem("caseName");
    if (storedCaseName) {
      setCaseName(storedCaseName);
    } else {
      alert("Créez d'abord votre simulation dans Solvers ou renseignez le nom de la simulation");
    }
  }, []);  

  const fetchValue = async (filePath, matchPattern, setter) => {
    try {
      console.log(`🛰️ Fetching value for ${matchPattern} in ${filePath}`);
      const res = await fetch(`http://localhost:3000/api/setup/getLineValue?caseName=${caseName}&filePath=${filePath}&matchPattern=${matchPattern}`);
      const data = await res.json();
      console.log(`📥 Valeur reçue pour ${matchPattern} :`, data);
  
      if (data.value !== undefined) {
        setter(data.value);
      } else {
        console.warn(`⚠️ Aucune valeur trouvée pour ${matchPattern}`);
      }
    } catch (err) {
      console.error(`❌ Erreur fetch ${matchPattern} :`, err);
    }
  };
  

  useEffect(() => {
    if (!caseName) return;
  
    fetchValue("system/controlDict", "startTime", setStartTime);
    fetchValue("system/controlDict", "endTime", setEndTime);
    fetchValue("system/controlDict", "deltaT", setDeltaT);
    fetchValue("system/controlDict", "writeInterval", setWriteInterval);
    fetchValue("system/decomposeParDict", "numberOfSubdomains", setNumberOfSubdomains);
  }, [caseName]); // ⬅️ s'exécute uniquement quand caseName est bien défini

  
  const handleStartTime = async () => {
    console.log("🔧 Envoi startTime...");
    const res = await fetch("http://localhost:3000/api/setup/updateLine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseName,
        filePath: "system/controlDict",
        matchPattern: "startTime",
        newLine: `startTime       ${startTime};`,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error("Erreur mise à jour startTime");
    console.log("✅ startTime mis à jour");
  };

  const handleEndTime = async () => {
    console.log("🔧 Envoi endTime...");
    const res = await fetch("http://localhost:3000/api/setup/updateLine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseName,
        filePath: "system/controlDict",
        matchPattern: "endTime",
        newLine: `endTime         ${endTime};`,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error("Erreur mise à jour endTime");
    console.log("✅ endTime mis à jour");
  };

  const handleDeltaT = async () => {
    console.log("🔧 Envoi deltaT...");
    const res = await fetch("http://localhost:3000/api/setup/updateLine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseName,
        filePath: "system/controlDict",
        matchPattern: "deltaT",
        newLine: `deltaT          ${deltaT};`,
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error("Erreur mise à jour deltaT");
    console.log("✅ deltaT mis à jour");
  };

  const handleWriteInterval = async () => {
    console.log("🔧 Envoi writeInterval...");
    const res = await fetch("http://localhost:3000/api/setup/updateLine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseName,
        filePath: "system/controlDict",
        matchPattern: "writeInterval",
        newLine: `writeInterval   ${writeInterval};`, // ⚠️ ici tu mettais `${deltaT}` au lieu de `${writeInterval}`
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error("Erreur mise à jour writeInterval");
    console.log("✅ writeInterval mis à jour");
  };

  const handleNumberOfSubdomain = async () => {
    console.log("🔧 Envoi writeInterval...");
    const res = await fetch("http://localhost:3000/api/setup/updateLine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseName,
        filePath: "system/decomposeParDict",
        matchPattern: "numberOfSubdomains",
        newLine: `numberOfSubdomains   ${numberOfSubdomains};`, // ⚠️ ici tu mettais `${deltaT}` au lieu de `${writeInterval}`
      }),
    });

    const data = await res.json();
    if (!data.success) throw new Error("Erreur mise à jour numberofsubdomain");
    console.log("✅ numberofsubdomain mis à jour");

    localStorage.setItem("numberOfSubdomains", numberOfSubdomains);
    window.dispatchEvent(new Event("numberofsubdomainsChanged"));
  };

  return (
    <div className="page-container">
      <div className="setup-form">
        <label>Start Time :</label>
        <div className="input-wrapper">
          <Inputtext
            text={startTime}
            onChange={setStartTime}
            placeholder="exemple : 0"
          />
        </div>

        <label>End Time :</label>
        <div className="input-wrapper">
          <Inputtext
            text={endTime}
            onChange={setEndTime}
            placeholder="exemple : 10"
          />
        </div>

        <label>Delta T :</label>
        <div className="input-wrapper">
          <Inputtext
            text={deltaT}
            onChange={setDeltaT}
            placeholder="exemple : 1e-3"
          />
        </div>

        <label>Write Interval :</label>
        <div className="input-wrapper">
          <Inputtext
            text={writeInterval}
            onChange={setWriteInterval}
            placeholder="exemple : 100"
          />
        </div>

        <label>Nombre de processeur :</label>
        <div className="input-wrapper">
          <Inputtext
            text={numberOfSubdomains}
            onChange={setNumberOfSubdomains}
            placeholder="exemple : 10"
          />
        </div>

        <div className="button-container">
          <Button
            label="Sauvegarder"
            onClick={async () => {
              try {
                console.log("🚀 Démarrage sauvegarde");
                await handleStartTime();
                await handleEndTime();
                await handleDeltaT();
                await handleWriteInterval();
                await handleNumberOfSubdomain();
                alert("✅ Tous les paramètres ont été sauvegardés !");
              } catch (err) {
                console.error("❌ Erreur pendant la sauvegarde :", err);
                alert("❌ Erreur pendant la sauvegarde : " + err.message);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Setup;
