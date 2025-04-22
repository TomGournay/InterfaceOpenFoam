const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors()); // Autorise les requêtes cross-origin depuis Vite
app.use(express.json());

// Routes solveurs
const solversRoutes = require('./api/solvers');
app.use('/api/solvers', solversRoutes);

const meshRoutes = require('./api/mesh');
app.use('/api/mesh', meshRoutes);

const boundariesRoutes = require('./api/boundaries');
app.use('/api/boundaries', boundariesRoutes);

const advancedRoutes = require('./api/advanced');
app.use('/api/advanced', advancedRoutes);

const setupRoutes = require('./api/setup');
app.use('/api/setup', setupRoutes);

const computeRoutes = require('./api/compute');
app.use('/api/compute', computeRoutes);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});