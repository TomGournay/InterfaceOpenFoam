const express = require('express');
const path = require('path');
const router = express.Router();
const { exec } = require('child_process');

router.post('/run', (req,res) => {
    const { caseName, solverName} = req.body;
    const simulationPath = path.resolve(__dirname, '../data/simulations', caseName);
    const bashrcPath = `../../etc/bashrc`;
    
    const fullCommand = `cd "${simulationPath}" && source "${bashrcPath}" && decomposePar && mpirun -np 24 ${solverName} -parallel`;

    const launchTerminal = `gnome-terminal -- bash -c '${fullCommand}; exec bash'`;
  
    exec(launchTerminal, (err) => {
      if (err) {
        console.error("Erreur lors de l'ouverture du terminal :", err);
        return res.status(500).json({ success: false, error: err.message });
      }
      return res.json({ success: true, message: 'Terminal lancé avec la simulation.' });
    });
  });
  
  router.post('/rm', (req,res) => {
    const { caseName } = req.body;
    const simulationPath = path.resolve(__dirname, "../data/simulations", caseName);
    const bashrcPath = `../../etc/bashrc`;
    const command = ` cd "${simulationPath}" && source "${bashrcPath}" && rm -r processor*`

    exec(command, { shell: '/bin/bash' }, (err => {
        if (err) {
            console.error("Il n'y a pas de dossier processeur dans le dossier", err)
            return res.status(500).json({success: false, error: err.message});
        }
        return res.json({success: true, message: 'Dossiers processeurs effacé !'})
    }))
  })

  router.post('/reconstruct', (req,res) => {
    const { caseName } = req.body;
    const simulationPath = path.resolve(__dirname, "../data/simulations", caseName);
    const bashrcPath = `../../etc/bashrc`;
    const command = ` cd "${simulationPath}" && source "${bashrcPath}" && reconstructPar`

    exec(command, { shell: '/bin/bash' }, (err => {
        if (err) {
            console.error("La simulation n'était pas en parallèle pas besoin de reconstruire", err)
            return res.status(500).json({success: false, error: err.message});
        }
        return res.json({success: true, message: 'Solution reconstruite !'})
    }))
  })

  router.post('/results', (req,res) => {
    const { caseName } = req.body;
    const simulationPath = path.resolve(__dirname, "../data/simulations", caseName);
    const bashrcPath = `../../etc/bashrc`;
    const command = ` cd "${simulationPath}" && source "${bashrcPath}" && paraFoam`

    exec(command, { shell: '/bin/bash' }, (err => {
        if (err) {
            console.error("Impossible d'ouvrir les resultats", err)
            return res.status(500).json({success: false, error: err.message});
        }
        return res.json({success: true, message: 'Ouverture de paraview !'})
    }))
  })

  module.exports = router;