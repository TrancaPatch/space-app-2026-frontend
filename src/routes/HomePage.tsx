import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  missionData as defaultMissionData,
  astronautsList as defaultAstronautsList,
  recentUpdatesList as defaultRecentUpdatesList,
} from '../data/astronauts';
import { BloodDropBadge } from '../components/BloodDropBadge';
import { astronautsService } from '../services/astronautsService';
import type {
  Astronaut,
  Mission,
  RecentUpdate,
} from '../services/astronautsService';
import '../styles/Dashboard.css';

export function HomePage() {
  const navigate = useNavigate();
  const [mission, setMission] = useState<Mission | null>(null);
  const [astronauts, setAstronauts] = useState<Astronaut[]>(defaultAstronautsList as any);
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>(defaultRecentUpdatesList);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [missionRes, astronautsRes, updatesRes] = await Promise.all([
          astronautsService.getMission(),
          astronautsService.getAstronauts(),
          astronautsService.getRecentUpdates(),
        ]);

        if (isMounted) {
          if (missionRes) setMission(missionRes);
          if (astronautsRes && astronautsRes.length > 0) setAstronauts(astronautsRes);
          if (updatesRes && updatesRes.length > 0) setRecentUpdates(updatesRes);
          setIsBackendConnected(true);
        }
      } catch (err) {
        console.warn('Usando datos de respaldo locales para el dashboard:', err);
        if (isMounted) {
          setIsBackendConnected(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayAppName = mission?.appName || defaultMissionData.mission.appName;
  const displayTitle = mission?.title || mission?.name || defaultMissionData.mission.title;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header superior: Logo "App" a la izquierda y Título de Misión en el centro */}
        <header className="dashboard-header">
          <div className="header-left">
            <img
              src="/avatars/app_logo.png"
              alt="Logo App"
              className="app-logo-img"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="app-title">{displayAppName}</span>
            {isBackendConnected && (
              <span
                style={{
                  fontSize: '11px',
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22C55E',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  marginLeft: '8px',
                }}
                title="Conectado a RethinkDB API"
              >
                ● DB En vivo
              </span>
            )}
          </div>

          <h1 className="mission-title">{displayTitle}</h1>
        </header>

        {/* Fichas de los 3 Astronautas (Clickables para navegar a /body/:id) */}
        <section className="astronauts-grid">
          {astronauts.map((astronaut) => (
            <Link
              key={astronaut.id}
              to={`/body/${astronaut.id}`}
              className="astronaut-card"
              title={`Ver modelo 3D de ${astronaut.name || astronaut.fullName}`}
            >
              {/* Encabezado de la Ficha: Foto, Nombre, Rol y Grupo Sanguíneo */}
              <div className="card-header-row">
                <div className="card-profile-info">
                  <img
                    src={astronaut.avatar}
                    alt={astronaut.name || astronaut.fullName}
                    className="card-avatar"
                  />
                  <div className="card-names">
                    <h2 className="astronaut-name">{astronaut.name || astronaut.fullName}</h2>
                    <span className="astronaut-role">{astronaut.role}</span>
                  </div>
                </div>

                <BloodDropBadge type={astronaut.bloodType} />
              </div>

              {/* Grid de Signos Vitales y Parámetros Físicos */}
              <div className="card-stats-grid">
                {/* Altura */}
                <div className="stat-item">
                  <span className="stat-icon" aria-label="Estatura">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2L8 6h3v12H8l4 4 4-4h-3V6h3L12 2z" />
                    </svg>
                  </span>
                  <span>{astronaut.height || '168 cm'}</span>
                </div>

                {/* Peso */}
                <div className="stat-item">
                  <span className="stat-icon" aria-label="Peso">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 3a4 4 0 00-4 4v1H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-3V7a4 4 0 00-4-4zm-2 4a2 2 0 114 0v1h-4V7z" />
                    </svg>
                  </span>
                  <span>{astronaut.weight || '74 kg'}</span>
                </div>

                {/* Pulso */}
                <div className="stat-item">
                  <span className="stat-icon" aria-label="Pulso">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </span>
                  <span>{astronaut.pulse || '76 bpm'}</span>
                </div>

                {/* Presión Arterial */}
                <div className="stat-item">
                  <span className="stat-icon" aria-label="Presión arterial">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                    </svg>
                  </span>
                  <span>{astronaut.pressure || '120/80'}</span>
                </div>
              </div>

              {/* Lista de Síntomas / Observaciones Médicas */}
              <ul className="symptoms-list">
                {(astronaut.symptoms || []).map((symptom, idx) => (
                  <li key={idx} className="symptom-item">
                    <span className="bullet-dot">•</span>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>

              <div className="card-hover-hint">
                <span>Ver modelo 3D →</span>
              </div>
            </Link>
          ))}
        </section>

        {/* Sección de Actualizaciones Recientes */}
        <section className="recent-updates-section">
          <h2 className="updates-title">Actualizaciones Recientes</h2>

          <div className="updates-table-wrapper">
            <table className="updates-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tripulante</th>
                  <th>Notificación</th>
                  <th>Estado</th>
                  <th>Pulso</th>
                  <th>Presión</th>
                </tr>
              </thead>
              <tbody>
                {recentUpdates.map((update) => (
                  <tr
                    key={update.id}
                    className="update-row"
                    onClick={() => navigate(`/body/${update.astronautId}`)}
                    title={`Ver modelo 3D de ${update.crewMember}`}
                  >
                    <td>{update.date}</td>
                    <td>
                      <span className="member-name-clickable">
                        {update.crewMember}
                      </span>
                    </td>
                    <td>{update.notification}</td>
                    <td className="status-cell">{update.status}</td>
                    <td>{update.pulse}</td>
                    <td>{update.pressure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
