import React, { useState } from "react";
import "../css/SimulationLoader.css";
import RadioButtons from './RadioButtonGroup'

function SimulationLoader({ show, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [solver, setSolver] = useState("");

  const solverlist = [
    { label: "icoFoam", value: "icoFoam" },
    { label: "pisoFoam", value: "pisoFoam" },
  ];

  const handleSubmit = () => {
    if (name.trim() && solver) {
      onSubmit(name.trim(), solver);
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Charger une Simulation</h3>
        <input
          type="text"
          placeholder="Nom de la simulation"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <RadioButtons options={solverlist} onChange={setSolver} />
        <div className="modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button onClick={handleSubmit}>Valider</button>
        </div>
      </div>
    </div>
  );
}

export default SimulationLoader;
