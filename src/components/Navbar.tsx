import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getAstronautById, astronautsList } from '../data/astronauts';
import { astronautsService } from '../services/astronautsService';
import type { Astronaut } from '../services/astronautsService';
import '../styles/Navigation.css';

export function Navbar() {
  const location = useLocation();

  // Extraer el astronautId de la URL si existe (/body/:astronautId o /historial/:astronautId), por defecto '1'
  const match = location.pathname.match(/\/(body|historial)\/([^/]+)/);
  const astronautId = match ? match[2] : '1';
  const defaultAstro = getAstronautById(astronautId) || astronautsList[0];

  const [astronaut, setAstronaut] = useState<Astronaut>(defaultAstro as any);

  useEffect(() => {
    let isMounted = true;
    astronautsService
      .getAstronautById(astronautId)
      .then((data) => {
        if (isMounted && data) {
          setAstronaut(data);
        }
      })
      .catch(() => {
        // Fallback al astronauta estático
        if (isMounted) {
          setAstronaut(defaultAstro as any);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [astronautId]);

  return (
    <header className="main-navbar">
      <div className="navbar-brand">
        <NavLink to="/" className="brand-link" title="Volver al Panel Principal">
          <span className="brand-back-arrow">←</span>
          <img src="/avatars/app_logo.png" alt="App" className="brand-mini-logo" />
          <div className="brand-text">
            <strong>Misión Espacial Trancapatch</strong>
            <span className="brand-sub">Panel de Control</span>
          </div>
        </NavLink>
      </div>

      <nav className="navbar-links">
        <NavLink
          to={`/body/${astronautId}`}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">🧍</span>
          <span>Cuerpo 3D</span>
        </NavLink>

        <NavLink
          to={`/historial/${astronautId}`}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">📋</span>
          <span>Historial Clínico</span>
        </NavLink>
      </nav>

      <div className="navbar-astronaut-badge">
        <img
          src={astronaut.avatar || defaultAstro.avatar}
          alt={astronaut.name || astronaut.fullName}
          className="navbar-avatar-img"
        />
        <div className="astronaut-info">
          <span className="astronaut-name">{astronaut.name || astronaut.fullName}</span>
          <span className="astronaut-id">
            {astronaut.role} • ID #{astronaut.id}
          </span>
        </div>
        <span className="status-indicator online" title="Telemetría en tiempo real activa">
          ● Online
        </span>
      </div>
    </header>
  );
}

export default Navbar;
