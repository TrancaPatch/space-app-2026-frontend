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
              src="/avatars/logo_ProtOn.svg"
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
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.endsWith('.jpg')) {
                        target.src = target.src.replace('.jpg', '.png');
                      }
                    }}
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
                  <span className="material-symbols-outlined" aria-label="Estatura">
                    height
                  </span>
                  <span>{astronaut.height || '168 cm'}</span>
                </div>

                {/* Peso */}
                <div className="stat-item">
                  <span className="material-symbols-outlined" aria-label="Peso">
                    weight
                  </span>
                  <span>{astronaut.weight || '74 kg'}</span>
                </div>

                {/* Pulso */}
                <div className="stat-item">
                  <span className="material-symbols-outlined" aria-label="Pulso">
                    ecg_heart
                  </span>
                  <span>{astronaut.pulse || '76 bpm'}</span>
                </div>

                {/* Presión Arterial */}
                <div className="stat-item">
                  <span className="material-symbols-outlined" aria-label="Presión arterial">
                    blood_pressure
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
