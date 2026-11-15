import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './routes/HomePage';
import { BodyPage } from './routes/BodyPage';
import { HistorialPage } from './routes/HistorialPage';
import './styles/App.css';

function AppContent() {
  const location = useLocation();
  // La barra de navegación superior se muestra en el visor 3D (/body),
  // mientras que la página de Inicio y la de Historial cuentan con sus propios encabezados según sus mockups.
  const isBodyPage = location.pathname.startsWith('/body');

  return (
    <div className="app-layout">
      {isBodyPage && <Navbar />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/body/:astronautId" element={<BodyPage />} />
          <Route path="/body" element={<Navigate to="/body/1" replace />} />
          <Route path="/historial/:astronautId" element={<HistorialPage />} />
          <Route path="/historial" element={<Navigate to="/historial/1" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;