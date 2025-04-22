const express = require('express');
const path = require('path');
const router = express.Router();
const fs=require('fs');

const SIMULATION_ROOT = path.join(__dirname, '..', 'data', 'simulations');

//Creer l'input du FileManager
function buildFileTree(dirPath, basePath) {
  try {
    const stats = fs.statSync(dirPath);
    const relativePath = path.relative(basePath, dirPath);

    if (stats.isFile()) {
      return {
        type: 'file',
        name: path.basename(dirPath),
        path: relativePath,
      };
    }

    const children = fs.readdirSync(dirPath)
      .map(child => buildFileTree(path.join(dirPath, child), basePath))
      .filter(child => child !== null);

    return {
      type: 'folder',
      name: path.basename(dirPath),
      path: relativePath,
      items: children,
    };
  } catch (err) {
    console.error("❌ Erreur lors du traitement de :", dirPath, "\n", err);
    return null;
  }
}


// 📂 Route pour lister les fichiers du cas (arborescence)
router.get('/files', (req, res) => {
  const caseName = req.query.caseName;
  if (!caseName) {
      return res.status(400).json({ error: 'Missing caseName parameter' });
  }

  const pathToCase = path.join(SIMULATION_ROOT, caseName);
  console.log("[API] caseName =", caseName);
  console.log("[API] Lecture du dossier =", pathToCase);

  if (!fs.existsSync(pathToCase)) {
      return res.status(404).json({ error: 'Folder not found' });
  }

  try {
      const items = fs.readdirSync(pathToCase).map(child =>
          buildFileTree(path.join(pathToCase, child), pathToCase)
      );

      res.json(items);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading directory' });
  }
});

// 📄 Route pour lire un fichier en fonction de son chemin relatif
router.get('/files/read', (req, res) => {
  const { caseName, filePath } = req.query;

  if (!caseName || !filePath) {
      return res.status(400).json({ error: 'Missing caseName or filePath parameter' });
  }

  const fullPath = path.join(SIMULATION_ROOT, caseName, filePath);

  if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
  }

  const stats = fs.statSync(fullPath);
  if (!stats.isFile()) {
      return res.status(400).json({ error: 'Path is not a file' });
  }

  try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      res.json({ content });
      cconsole.log("[API] Lecture du fichier :", fullPath);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error reading file' });
  }
});

// ENREGISTRER UN FICHIER À UN CHEMIN DONNÉ
router.post('/files/save', (req, res) => {
  const { caseName, filePath, content } = req.body;

  if (!caseName || !filePath || typeof content !== 'string') {
    return res.status(400).json({ error: 'Paramètres manquants ou invalides' });
  }

  const BASE_DIR = path.resolve(__dirname, '..', 'data', 'simulations');
  const fullPath = path.join(BASE_DIR, caseName, filePath);
  const resolvedPath = path.resolve(fullPath);

  // Sécurité : empêcher l'accès hors dossier de simulation
  if (!resolvedPath.startsWith(path.join(BASE_DIR, caseName))) {
    return res.status(403).json({ error: 'Access denied' });
  }

  fs.writeFile(resolvedPath, content, 'utf8', (err) => {
    if (err) {
      console.error("Erreur écriture fichier :", err);
      return res.status(500).json({ error: 'Erreur lors de l’écriture du fichier' });
    }
    res.json({ message: `✅ Fichier ${filePath} enregistré avec succès.` });
  });
});

module.exports = router;