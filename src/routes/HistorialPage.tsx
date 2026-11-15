import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import rawHistoryData from '../data/medicalHistoryData.json';
import { MedicalChart } from '../components/MedicalChart';
import '../styles/Historial.css';

interface Checkup {
  id: string;
  date: string;
  title: string;
  status: 'warning' | 'nominal';
  area: string;
  description: string;
}

interface MissionPhase {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  status: string;
  date?: string;
  state: 'completed' | 'active' | 'pending';
}

interface AstronautHistory {
  id: string;
  name: string;
  code: string;
  avatar: string;
  familyHistory: string[];
  personalHistory: string[];
  missionPhases: MissionPhase[];
  checkups: Checkup[];
  comparisonMetrics: any;
}

export function HistorialPage() {
  const { astronautId = '1' } = useParams<{ astronautId: string }>();
  const navigate = useNavigate();

  const historyStore = rawHistoryData.astronautsHistory as Record<string, AstronautHistory>;
  const history: AstronautHistory = historyStore[astronautId] || historyStore['1'];

  // Estado para el chequeo seleccionado en la línea de tiempo
  const [selectedCheckupId, setSelectedCheckupId] = useState<string>(
    history.checkups[0]?.id || ''
  );

  const selectedCheckup = history.checkups.find((c) => c.id === selectedCheckupId) || history.checkups[0];

  return (
    <div className="historial-page">
      <div className="historial-container">
        {/* Banner superior con botón Regresar */}
        <header className="historial-banner-card">
          <div className="banner-left-content">
            <div className="banner-folder-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="banner-text-group">
              <h1 className="banner-title">Historial Médico del Astronauta</h1>
              <p className="banner-subtitle">
                Registro, monitoreo de la salud antes, durante y después de la misión espacial.
              </p>
            </div>
          </div>

          <div className="btn-add-checkup" onClick={() => navigate(-1)} title="Volver a la vista anterior">
            <span className="material-symbols-outlined">
              arrow_back_ios
            </span>
            <p>Regresar</p>
          </div>
        </header>

        {/* Grid principal de 3 columnas */}
        <main className="historial-main-grid">
          {/* ====================================================================
              COLUMNA 1: Línea de tiempo de Últimos Chequeos
             ==================================================================== */}
          <aside className="checkups-card">
            <div className="checkups-header">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Últimos Chequeos</span>
            </div>

            <div className="timeline-list">
              {history.checkups.map((chk) => {
                const isActive = chk.id === selectedCheckup.id;
                return (
                  <div
                    key={chk.id}
                    className={`timeline-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCheckupId(chk.id)}
                    title={`Ver detalles del chequeo del ${chk.date}`}
                  >
                    <div className="timeline-node">
                      <div className="timeline-node-inner" />
                    </div>

                    <div className="timeline-info">
                      <span className="timeline-date">{chk.date}</span>
                      <span className="timeline-desc">{chk.title}</span>
                    </div>

                    <div className="timeline-status-icon">
                      {chk.status === 'warning' ? (
                        <span className="status-warning-icon" title="Alerta médica en seguimiento">
                          ⚠️
                        </span>
                      ) : (
                        <span className="status-success-circle" title="Chequeo nominal completado">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button type="button" className="btn-add-checkup">
              <span>Añadir chequeo</span>
              <span style={{ fontSize: '18px', fontWeight: 700 }}>+</span>
            </button>
          </aside>

          {/* ====================================================================
              COLUMNA 2: Perfil Astronauta, Gráfico Interactivo y Fases
             ==================================================================== */}
          <section className="historial-center-col">
            {/* Ficha reducida del Astronauta */}
            <div className="astronaut-mini-profile-card">
              <img
                src={history.avatar}
                alt={history.name}
                className="mini-avatar-img"
              />
              <div className="mini-profile-text">
                <h2 className="mini-profile-name">Astronauta: {history.name}</h2>
                <span className="mini-profile-code">{history.code}</span>
              </div>
            </div>

            {/* Gráfico interactivo con selector de parámetros (D3 / SVG puro) */}
            <MedicalChart metrics={history.comparisonMetrics} />

            {/* Fases del Viaje (Stepper de 3 etapas con chevron) */}
            <div className="mission-phases-card">
              <div className="phases-container">
                {history.missionPhases.map((phase, idx) => (
                  <div key={phase.id} style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
                    <div className={`phase-step ${phase.state === 'active' ? 'active' : ''}`}>
                      <div className="phase-top">
                        <span className="phase-icon">
                          {phase.icon === 'clipboard' && '📋'}
                          {phase.icon === 'rocket' && '🚀'}
                          {phase.icon === 'heart' && '🤍'}
                        </span>
                        <div>
                          <div className="phase-title">{phase.title}</div>
                          <div className="phase-sub">{phase.subtitle}</div>
                        </div>
                      </div>

                      <div className="phase-desc">{phase.description}</div>

                      <div className="phase-status-footer">
                        {phase.state === 'completed' && (
                          <span className="phase-status-completed">
                            {phase.status} {phase.date}
                          </span>
                        )}
                        {phase.state === 'active' && (
                          <span>▶ {phase.status}</span>
                        )}
                        {phase.state === 'pending' && (
                          <span style={{ opacity: 0.8 }}>🕒 {phase.status}</span>
                        )}
                      </div>
                    </div>

                    {idx < history.missionPhases.length - 1 && (
                      <span className="phases-chevron">&gt;&gt;</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ====================================================================
              COLUMNA 3: Antecedentes Familiares, Personales y Detalle del Chequeo
             ==================================================================== */}
          <aside className="historial-right-col">
            {/* Antecedentes familiares */}
            <div className="history-box-card">
              <div className="history-box-header">
                <div className="box-title-group">
                  <span>Antecedentes familiares</span>
                </div>
                <span className="box-edit-icon" title="Editar antecedentes familiares">
                  
                </span>
              </div>
              <ul className="history-bullets-list">
                {history.familyHistory.map((item, idx) => (
                  <li key={idx} className="history-bullet-item">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Antecedentes personales */}
            <div className="history-box-card">
              <div className="history-box-header">
                <div className="box-title-group">
                  <span>Antecedentes personales</span>
                </div>
                <span className="box-edit-icon" title="Editar antecedentes personales">
                  
                </span>
              </div>
              <ul className="history-bullets-list">
                {history.personalHistory.map((item, idx) => (
                  <li key={idx} className="history-bullet-item">
                    <span>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detalle del chequeo seleccionado */}
            <div className="checkup-detail-card">
              <div className="detail-card-header">
                <span>Detalle chequeo</span>
              </div>

              <div className="detail-items-list">
                <div className="detail-line">
                  <div>
                    <span className="detail-label">Fecha: </span>
                    <span className="detail-val">{selectedCheckup.date}</span>
                  </div>
                </div>

                <div className="detail-line">
                  <div>
                    <span className="detail-label">Área: </span>
                    <span className="detail-val">{selectedCheckup.area}</span>
                  </div>
                </div>

                <div className="detail-line" style={{ flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="detail-label">Descripción:</span>
                  </div>
                  <div className="detail-desc-box">
                    {selectedCheckup.description}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default HistorialPage;