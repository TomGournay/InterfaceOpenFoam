import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from "react-router-dom";
import NavBar from './components/Navbar'
import './css/App.css'


import Solvers from './pages/Solvers';
import Mesh from './pages/Mesh';
import Boundaries from './pages/Boundaries';
import Compute from './pages/Compute';
import OpenFOAMInterface from "./pages/OpenFOAMInterface";
import Advanced from "./pages/Advanced";
import Setup from "./pages/Setup";


function App() {
  return (
    <div className=''>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<OpenFOAMInterface />} />
          <Route path="/solvers" element={<Solvers />} />
          <Route path="/mesh" element={<Mesh />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/boundaries" element={<Boundaries />} />
          <Route path="/advanced" element={<Advanced />} />
          <Route path="/compute" element={<Compute />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
