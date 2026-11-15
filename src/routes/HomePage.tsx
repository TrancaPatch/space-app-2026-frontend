import { Link, useNavigate } from 'react-router-dom';
import { missionData, astronautsList, recentUpdatesList } from '../data/astronauts';
import { BloodDropBadge } from '../components/BloodDropBadge';
import '../styles/Dashboard.css';

export function HomePage() {
  const navigate = useNavigate();

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
                // Fallback elegante en caso de que no cargue la imagen
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="app-title">{missionData.mission.appName}</span>
          </div>

          <h1 className="mission-title">{missionData.mission.title}</h1>
        </header>

        {/* Fichas de los 3 Astronautas (Clickables para navegar a /body/:id) */}
        <section className="astronauts-grid">
          {astronautsList.map((astronaut) => (
            <Link
              key={astronaut.id}
              to={`/body/${astronaut.id}`}
              className="astronaut-card"
              title={`Ver modelo 3D de ${astronaut.name}`}
            >
              {/* Encabezado de la Ficha: Foto, Nombre, Rol y Grupo Sanguíneo */}
              <div className="card-header-row">
                <div className="card-profile-info">
                  <img
                    src={astronaut.avatar}
                    alt={astronaut.name}
                    className="card-avatar"
                  />
                  <div className="card-names">
                    <h2 className="astronaut-name">{astronaut.name}</h2>
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
                  <span>{astronaut.height}</span>
                </div>

                {/* Peso */}
                <div className="stat-item">
                  <span className="material-symbols-outlined" aria-label="Peso">
                    weight
                  </span>
                  <span>{astronaut.weight}</span>
                </div>

                {/* Pulso */}
                <div className="stat-item">
                  <span className="material-symbols-outlined" aria-label="Pulso">
                    ecg_heart
                  </span>
                  <span>{astronaut.pulse}</span>
                </div>

                {/* Presión Arterial */}
                <div className="stat-item">
                  <span className="material-symbols-outlined" aria-label="Presión arterial">
                    blood_pressure
                  </span>
                  <span>{astronaut.pressure}</span>
                </div>
              </div>

              {/* Lista de Síntomas / Observaciones Médicas */}
              <ul className="symptoms-list">
                {astronaut.symptoms.map((symptom, idx) => (
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
                {recentUpdatesList.map((update) => (
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