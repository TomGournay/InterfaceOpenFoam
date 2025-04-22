import Button from "../components/Button";
import InputFile from "../components/InputFile";
import "../css/global.css";
import { useEffect, useState } from "react";
import TextEditor from "../components/TextEditor";

function Mesh() {
  //Variable pour cibler le fichier
  const [file, setFile] = useState(null);

  // Rappeler le nom de la simulation
  const [caseName, setCaseName] = useState("");

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

  //Variable pour affichage boundary file
  const [boundaryContent, setBoundaryContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  //Importer le fichier depuis l'input (actualiser la variable file)
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const isMsh = selectedFile.name.toLowerCase().endsWith(".msh");
      //message d'erreur si on importe pas .msh
      if (!isMsh) {
        alert("❌ Veuillez sélectionner un fichier avec l'extension .msh");
        event.target.value = null; // Réinitialise l'input
        setFile(null);
        return;
      }

      setFile(selectedFile);
      // TEST console.log("Fichier sélectionné :", selectedFile);
    }
  };

  // Envoyer le fichier au backend afin de lancer fluent3DMeshToFoam
  const handleUpload3D = async () => {
    if (!file) {
      alert("Veuillez inserer un maillage");
    }
    //Rendre sous forme Data le fichier pour le transferer au backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseName", caseName);

    //Post pour ecrir le fichier dans le dossier
    try {
      const response = await fetch("http://localhost:3000/api/mesh/upload3D", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      //AFFICHER Resultat de la console
      if (response.ok) {
        alert(result);
        await loadBoundaryFile(); // Charger le fichier boundary une fois mesh converti
        setShowEditor(true);
      } else {
        alert("Erreur du serveur : " + result);
      }
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Échec de l'envoi.");
    }
  };

  const handleUpload2D = async () => {
    if (!file) {
      alert("Veuillez inserer un maillage");
    }
    //Rendre sous forme Data le fichier pour le transferer au backend
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caseName", caseName);

    //Post pour ecrir le fichier dans le dossier
    try {
      const response = await fetch("http://localhost:3000/api/mesh/upload2D", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      //AFFICHER Resultat de la console
      if (response.ok) {
        alert(result);
        await loadBoundaryFile(); // Charger le fichier boundary une fois mesh converti
        setShowEditor(true);
      } else {
        alert("Erreur du serveur : " + result);
      }
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Échec de l'envoi.");
    }
  };

  //Fonction charger le fichier boundary (avec backend)

  const loadBoundaryFile = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/mesh/boundary?caseName=${caseName}`
      );
      const data = await response.text();
      setBoundaryContent(data);
    } catch (err) {
      console.error("Erreur chargement boundary :", err);
      alert("Erreur chargement fichier boundary.");
    }
  };

  //Sauvergarder le fichier modifié

  const saveBoundaryFile = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/mesh/boundary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseName,
          content: boundaryContent,
        }),
      });

      const result = await response.text();
      alert(result);
    } catch (err) {
      console.error("Erreur sauvegarde boundary :", err);
      alert("Erreur sauvegarde fichier boundary.");
    }
  };

  //Affichage
  return (
    <>
      <div className="top-text">
        <h2>Importer maillage</h2>
        <InputFile
          id="Maillage"
          label="Format .msh"
          size="lg"
          onChange={handleFileChange}
        />
        <div style={{ display: "flex", gap: "20px" }}>
          <Button label="Maillage 3D" color="Green" onClick={handleUpload3D} />
          <Button label="Maillage 2D" color="Green" onClick={handleUpload2D} />
          <Button
            label="Charger boundary"
            color="Blue"
            onClick={async () => {
              await loadBoundaryFile();
              setShowEditor(true);
            }}
          />
        </div>
      </div>
      {showEditor && (
        <div style={{ marginTop: "20px" }}>
          <h3>Fichier boundary :</h3>
          <TextEditor
            height="700px"
            language="cpp"
            value={boundaryContent}
            onChange={(newValue) => setBoundaryContent(newValue)}
          />
          <button onClick={saveBoundaryFile} style={{ marginTop: "10px" }}>
            💾 Enregistrer
          </button>
        </div>
      )}
    </>
  );
}
export default Mesh;
