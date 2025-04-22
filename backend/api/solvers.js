const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

// POST /api/solvers/run
router.post('/run', async (req, res) => {
  const { solverName, caseName } = req.body;

  const srcPath = path.join(__dirname, '../data/templates', `${solverName}_template`);
  const destPath = path.join(__dirname, '../data/simulations', caseName);

  try {
    await fs.copy(srcPath, destPath);
    res.json({ message: `Cas "${caseName}" créé depuis le template "${solverName}"` });
  } catch (err) {
    console.error('Erreur copie template :', err);
    res.status(500).json({ error: 'Impossible de créer le dossier de simulation' });
  }
});

module.exports = router;