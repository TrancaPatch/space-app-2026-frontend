import { useState } from 'react';

export interface ChartPoint {
  label: string;
  value: number;
}

export interface MetricData {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  points: ChartPoint[];
}

interface MedicalChartProps {
  metrics: Record<string, MetricData>;
}

export function MedicalChart({ metrics }: MedicalChartProps) {
  const metricKeys = Object.keys(metrics);
  const [selectedKey, setSelectedKey] = useState<string>(metricKeys[0] || 'Peso');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  const currentMetric = metrics[selectedKey] || metrics[metricKeys[0]];

  // Dimensiones del SVG
  const width = 520;
  const height = 220;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 45;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const yMin = currentMetric.min;
  const yMax = currentMetric.max;
  const yRange = yMax - yMin || 1;

  // Generar marcas en eje Y
  const yTicks: number[] = [];
  for (let val = yMax; val >= yMin; val -= currentMetric.step) {
    yTicks.push(Math.round(val * 10) / 10);
  }

  // Coordenadas de los puntos
  const pointsCount = currentMetric.points.length;
  const coords = currentMetric.points.map((pt, idx) => {
    const x = paddingLeft + (pointsCount > 1 ? (idx / (pointsCount - 1)) * chartW : chartW / 2);
    const normalizedY = (pt.value - yMin) / yRange;
    const y = paddingTop + chartH - normalizedY * chartH;
    return { x, y, value: pt.value, label: pt.label };
  });

  // Path SVG para la línea continua
  const pathD = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Path para el área degradada bajo la curva
  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${paddingTop + chartH} L ${coords[0].x} ${paddingTop + chartH} Z`
    : '';

  return (
    <div className="medical-chart-card">
      {/* Barra superior con selector de parámetros */}
      <div className="chart-header">
        <div className="chart-title-group">
          <span className="chart-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
            </svg>
          </span>
          <h3 className="chart-title">Detalle chequeo</h3>
        </div>

        <div className="chart-selector-group">
          <label htmlFor="param-select" className="selector-label">Comparar parametros:</label>
          <div className="custom-select-wrapper">
            <select
              id="param-select"
              className="chart-param-dropdown"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
            >
              {metricKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gráfico SVG interactivo */}
      <div className="chart-svg-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="medical-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Líneas de rejilla horizontales y etiquetas del eje Y */}
          {yTicks.map((tickVal) => {
            const normalizedY = (tickVal - yMin) / yRange;
            const y = paddingTop + chartH - normalizedY * chartH;
            return (
              <g key={tickVal}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="system-ui, sans-serif"
                >
                  {tickVal} {currentMetric.unit}
                </text>
              </g>
            );
          })}

          {/* Líneas de rejilla verticales y etiquetas del eje X */}
          {coords.map((pt, idx) => (
            <g key={idx}>
              <line
                x1={pt.x}
                y1={paddingTop}
                x2={pt.x}
                y2={paddingTop + chartH}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
              {pt.label.split('\n').map((lineText, lineIdx) => (
                <text
                  key={lineIdx}
                  x={pt.x}
                  y={paddingTop + chartH + 16 + lineIdx * 12}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="system-ui, sans-serif"
                >
                  {lineText}
                </text>
              ))}
            </g>
          ))}

          {/* Área sombreada bajo la curva */}
          {areaD && <path d={areaD} fill="url(#purpleGradient)" />}

          {/* Línea principal violeta brillante */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />
          )}

          {/* Puntos de datos */}
          {coords.map((pt, idx) => (
            <g
              key={idx}
              className="chart-point-group"
              onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, val: pt.value, label: pt.label })}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#c084fc"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="12"
                fill="transparent"
              />
            </g>
          ))}

          {/* Tooltip dinámico al pasar el cursor */}
          {hoveredPoint && (
            <g transform={`translate(${hoveredPoint.x}, ${hoveredPoint.y - 12})`}>
              <rect
                x="-36"
                y="-26"
                width="72"
                height="22"
                rx="6"
                fill="#1e1b4b"
                stroke="#a855f7"
                strokeWidth="1"
              />
              <text
                x="0"
                y="-11"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                {hoveredPoint.val} {currentMetric.unit}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}

export default MedicalChart;