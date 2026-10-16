import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Menu } from './components/Menu';
import { Destinos } from './pages/Destinos';
import { Clientes } from './pages/Clientes';
import { Pacotes } from './pages/Pacotes';

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        <Route path="/" element={<Navigate to="/destinos" replace />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pacotes" element={<Pacotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;