const express = require('express');
const path = require('path');
const router = express.Router();
const fs=require('fs');

const SIMULATION_ROOT = path.join(__dirname, '..', 'data', 'simulations');

//Creer l'input du FileManager
function buildFileTree(dirPath) {
    const stats = fs.statSync(dirPath);

    //Si c'est un fichier
    if (stats.isFile()) {
        return {
            type: 'file',
            name: path.basename(dirPath),
        };
    }

    // Si c'est un dossier
    const children = fs.readdirSync(dirPath).map(child => {
        return buildFileTree(path.join(dirPath, child));
    });

    return {
        type: 'folder',
        name: path.basename(dirPath),
        items: children,
    };
}
//Relever quel fichier est utilisé
router.get('/files', (req, res) => {
  const caseName = req.query.caseName;
  if (!caseName) {
    return res.status(400).json({ error: 'Missing caseName parameter' });
  }

  const BASE_DIR = path.resolve(__dirname, '..', 'data', 'simulations');
  const pathTo0 = path.join(BASE_DIR, caseName, '0');

  console.log("[API] caseName =", caseName);
  console.log("[API] Lecture du dossier =", pathTo0);

  if (!fs.existsSync(pathTo0)) {
    return res.status(404).json({ error: 'Folder not found' });
  }

  try {
    // Retourne directement les enfants de "0", sans encapsuler dans un folder "0"
    const items = fs.readdirSync(pathTo0).map(child =>
      buildFileTree(path.join(pathTo0, child))
    );

    res.json(items);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error reading directory' });
  }
});

//Ouvrir le fichier 
const BASE_DIR = path.resolve(__dirname, '..', 'data', 'simulations');

router.get('/file-content', (req, res) => {
  const { caseName, fileName } = req.query;

  if (!caseName || !fileName) {
    return res.status(400).json({ error: 'Missing caseName or fileName parameter' });
  }

  // Chemin vers le fichier
  const filePath = path.join(BASE_DIR, caseName, '0', fileName);


  // Vérification de sécurité
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.join(BASE_DIR, caseName))) {
    return res.status(403).json({ error: 'Access denied' });
  }

  if (!fs.existsSync(resolvedPath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  try {
    const content = fs.readFileSync(resolvedPath, 'utf8');
    res.json({ name: fileName, content });
  } catch (err) {
    console.error('[API] Erreur lecture fichier', err);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

//ENREGISTRER LE FICHIER 

router.post('/save', (req, res) => {
  const { caseName, fileName, content } = req.body;

  if (!caseName || !fileName || typeof content !== 'string') {
    return res.status(400).json({ error: 'Paramètres manquants ou invalides' });
  }

  const BASE_DIR = path.resolve(__dirname, '..', 'data', 'simulations');
  const filePath = path.join(BASE_DIR, caseName, '0', fileName);
  const resolvedPath = path.resolve(filePath);

  // Sécurité : on vérifie qu'on reste bien dans la bonne simulation
  if (!resolvedPath.startsWith(path.join(BASE_DIR, caseName))) {
    return res.status(403).json({ error: 'Access denied' });
  }

  fs.writeFile(resolvedPath, content, 'utf8', (err) => {
    if (err) {
      console.error("Erreur écriture fichier :", err);
      return res.status(500).json({ error: 'Erreur lors de l’écriture du fichier' });
    }
    res.json({ message: `✅ Fichier ${fileName} enregistré avec succès.` });
  });
});
module.exports = router;