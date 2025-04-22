const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.post('/updateLine', (req, res) => {
  const { caseName, filePath, matchPattern, newLine } = req.body;

  if (!caseName || !filePath || !matchPattern || !newLine) {
    return res.status(400).json({ error: 'Paramètres manquants dans la requête' });
  }

  const fullPath = path.join(__dirname, '..', 'data', 'simulations', caseName, filePath);

  console.log("🔧 Mise à jour de fichier");
  console.log("📄 Fichier ciblé :", fullPath);
  console.log("🔍 Motif recherché :", matchPattern);
  console.log("✏️  Nouvelle ligne :", newLine);

  if (!fs.existsSync(fullPath)) {
    console.error("❌ Fichier introuvable");
    return res.status(404).json({ error: 'Fichier introuvable', path: fullPath });
  }

  fs.readFile(fullPath, 'utf8', (readErr, content) => {
    if (readErr) {
      console.error("❌ Erreur lecture fichier :", readErr);
      return res.status(500).json({ error: 'Erreur lecture fichier', details: readErr.message });
    }

    const regex = new RegExp(`^\\s*${matchPattern}\\b`);
    const lines = content.split('\n');

    let matchFound = false;
    const updatedLines = lines.map(line => {
      if (regex.test(line)) {
        matchFound = true;
        console.log(`✅ Ligne remplacée :\n  Avant : ${line}\n  Après : ${newLine}`);
        return newLine;
      }
      return line;
    });

    if (!matchFound) {
      console.warn("⚠️ Aucune ligne correspondante trouvée pour le motif :", matchPattern);
      return res.status(404).json({ error: `Motif '${matchPattern}' introuvable dans le fichier.` });
    }

    fs.writeFile(fullPath, updatedLines.join('\n'), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error("❌ Erreur écriture fichier :", writeErr);
        return res.status(500).json({ error: 'Erreur écriture fichier', details: writeErr.message });
      }

      console.log("✅ Fichier mis à jour avec succès !");
      res.json({ success: true });
    });
  });
});

module.exports = router;
