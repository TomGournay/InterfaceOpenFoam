const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const tempPath = path.join(__dirname, '../data/temp');
      fs.mkdirSync(tempPath, { recursive: true });
      cb(null, tempPath);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  });

const upload = multer({ storage });

router.post('/upload3D', upload.single('file'), (req, res) => {
    try {
      const caseName = req.body.caseName;
      const fileName = req.file.originalname;
      const tempPath = req.file.path;
      const finalPath = path.join(__dirname, '../data/simulations', caseName);
      const casePath = finalPath;
      const bashrcPath = '../../etc/bashrc';
  
      fs.mkdirSync(finalPath, { recursive: true });
      const newFilePath = path.join(finalPath, fileName);
      fs.renameSync(tempPath, newFilePath); // déplace le fichier .msh dans le bon dossier
  
      const bashCommand = `
        cd "${casePath}" && \
        source "${bashrcPath}" && \
        fluent3DMeshToFoam "${fileName}"
      `;
  
      exec(bashCommand, { shell: '/bin/bash' }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erreur : ${error.message}`);
          return res.status(500).send(`❌ Erreur : ${error.message}`);
        }
        if (stderr) console.warn(`stderr : ${stderr}`);
        res.send(`✅ Mesh converti avec succès !\n\n${stdout}`);
      });
    } catch (err) {
      console.error("Erreur serveur :", err);
      res.status(500).send("Erreur interne serveur.");
    }
  });

  router.post('/upload2D', upload.single('file'), (req, res) => {
    try {
      const caseName = req.body.caseName;
      const fileName = req.file.originalname;
      const tempPath = req.file.path;
      const finalPath = path.join(__dirname, '../data/simulations', caseName);
      const casePath = finalPath;
      const bashrcPath = '../../etc/bashrc';
  
      fs.mkdirSync(finalPath, { recursive: true });
      const newFilePath = path.join(finalPath, fileName);
      fs.renameSync(tempPath, newFilePath); // déplace le fichier .msh dans le bon dossier
  
      const bashCommand = `
        cd "${casePath}" && \
        source "${bashrcPath}" && \
        fluentMeshToFoam "${fileName}"
      `;
  
      exec(bashCommand, { shell: '/bin/bash' }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erreur : ${error.message}`);
          return res.status(500).send(`❌ Erreur : ${error.message}`);
        }
        if (stderr) console.warn(`stderr : ${stderr}`);
        res.send(`✅ Mesh converti avec succès !\n\n${stdout}`);
      });
    } catch (err) {
      console.error("Erreur serveur :", err);
      res.status(500).send("Erreur interne serveur.");
    }
  });
  
// GET pour lire le fichier boundary
router.get('/boundary', (req, res) => {
    const caseName = req.query.caseName;
    const boundaryPath = path.join(__dirname, `../data/simulations/${caseName}/constant/polyMesh/boundary`);
  
    fs.readFile(boundaryPath, 'utf8', (err, data) => {
      if (err) {
        console.error("Erreur lecture boundary :", err);
        return res.status(500).send("Erreur lecture fichier boundary.");
      }
      res.send(data);
    });
  });
  
  // POST pour sauvegarder les modifications
  router.post('/boundary', (req, res) => {
    const { caseName, content } = req.body;
    const boundaryPath = path.join(__dirname, `../data/simulations/${caseName}/constant/polyMesh/boundary`);
  
    fs.writeFile(boundaryPath, content, 'utf8', (err) => {
      if (err) {
        console.error("Erreur écriture boundary :", err);
        return res.status(500).send("Erreur écriture fichier boundary.");
      }
      res.send("✅ Fichier boundary enregistré avec succès !");
    });
  });
  

module.exports = router;
