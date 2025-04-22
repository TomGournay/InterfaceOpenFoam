import React, { useState, useEffect } from "react";
import FileManager from "../components/FileManager";
import TextEditor from "../components/TextEditor";
import '../css/global.css';

function Advanced() {
  // Déclaration des variables
  const [caseName, setCaseName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filesStructure, setFileStructure] = useState(null);
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [displayedFile, setDisplayedFile] = useState(null);

  // CaseName sauvegardé en local donc on le rappelle
  useEffect(() => {
    const storedCaseName = localStorage.getItem("caseName");
    if (storedCaseName) {
      setCaseName(storedCaseName);
    } else {
      alert("Veuillez créer une simulation dans Solvers ou charger une existante.");
    }
  }, []);

  // Fonction backend : charger les fichiers dans le FileManager
  useEffect(() => {
    if (!caseName) return;

    fetch(`http://localhost:3000/api/advanced/files?caseName=${caseName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger les fichiers");
        return res.json();
      })
      .then((data) => {
        setFileStructure(data);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des fichiers.");
      });
  }, [caseName]);

  // Fonction backend : ouvrir un fichier quand on clique dessus
  const handleFileClick = (file) => {
    const path = file.path || file.name;

    setFileContent("");
    setOriginalContent("");
    setDisplayedFile(null);
    setSelectedFile(file.name);

    fetch(`http://localhost:3000/api/advanced/files/read?caseName=${caseName}&filePath=${encodeURIComponent(path)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lecture fichier");
        return res.json();
      })
      .then((data) => {
        setFileContent(data.content);
        setOriginalContent(data.content);
        setDisplayedFile(path);
      })
      .catch((err) => {
        console.error("Erreur lors de la lecture du fichier :", err);
        setFileContent("// Erreur lors du chargement du fichier");
        setDisplayedFile(path);
      });
  };

  // Fonction backend : sauvegarder le fichier
  const saveFile = () => {
    if (!selectedFile || !caseName) return;

    fetch("http://localhost:3000/api/advanced/files/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseName: caseName,
        filePath: displayedFile,
        content: fileContent,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de l'enregistrement");
        return res.json();
      })
      .then((data) => {
        setOriginalContent(fileContent);
      })
      .catch((err) => {
        console.error(err);
        alert("❌ Erreur lors de la sauvegarde.");
      });
  };

  // Affichage UX : si modifié ou sauvegardé
  const isModified = fileContent !== originalContent;
  const isSaved = !isModified && originalContent !== "";

  const decorateStructure = (structure) => {
    if (!Array.isArray(structure)) return [];
  
    return structure.map((item) => {
      if (item.type === "file") {
        const isCurrent = displayedFile && item.path === displayedFile;
        let decoratedName = item.name;
  
        if (isCurrent && isModified) decoratedName += " *";
        if (isCurrent && isSaved) decoratedName += " ✓";
  
        return { ...item, name: decoratedName };
      }
  
      // Si c’est un dossier, on décore récursivement ses enfants
      if (item.type === "folder" && Array.isArray(item.items)) {
        return {
          ...item,
          items: decorateStructure(item.items),
        };
      }
  
      return item;
    });
  };
  
  const decoratedFileStructure = decorateStructure(filesStructure);
  

  // Frontend
  return (
    <div className="boundaries-container">
      <div className="advanced-sidebar">
        <FileManager files={decoratedFileStructure} onFileClick={handleFileClick} />
      </div>
      <div className="boundaries-editor-area">
        {selectedFile ? (
          <>
            <h4 className="boundaries-file-title">
              Contenu de : {selectedFile}{" "}
              {isModified && <span style={{ color: 'orange' }}>*</span>}
              {isSaved && <span style={{ color: 'green' }}>✓</span>}
            </h4>
            <TextEditor
              key={displayedFile}
              value={fileContent}
              onChange={(value) => setFileContent(value)}
              language="cpp"
              height="900px"
            />
            <button onClick={saveFile} className="boundaries-save-button">
              💾 Enregistrer
            </button>
          </>
        ) : (
          <h4>Sélectionnez un fichier dans l’arborescence</h4>
        )}
      </div>
    </div>
  );
}

export default Advanced;
