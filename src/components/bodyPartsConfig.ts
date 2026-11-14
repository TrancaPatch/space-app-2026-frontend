import type { RGBA } from '@google/model-viewer/lib/features/scene-graph/api';

/**
 * Convierte un color hexadecimal (ej. "#4FC3F7") a formato RGBA [0..1, 0..1, 0..1, 1]
 * requerido por pbrMetallicRoughness.setBaseColorFactor de <model-viewer>.
 */
export function hexToRgba(hex: string, alpha = 1): RGBA {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b, alpha];
}

/**
 * Identificadores exactos de los 49 nodos/materiales definidos en CuerpoSeparado.glb
 */
export type BodyPartId =
  // Cabeza y Cuello (12)
  | 'Cabeza'
  | 'Cuello'
  | 'Nariz'
  | 'Tabique'
  | 'OjoDer'
  | 'OjoIzq'
  | 'ParpadoSuperiorDer'
  | 'ParpadoSuperiorIzq'
  | 'ParpadoInferiorDer'
  | 'ParpadoInferiorIzq'
  | 'OrejaDer'
  | 'OrejaIzq'
  // Tronco (3)
  | 'Pecho'
  | 'Torso'
  | 'Pelvis'
  // Extremidad Superior Derecha (9)
  | 'HombroDer'
  | 'BrazoDer'
  | 'AntebrazoDer'
  | 'PalmaDer'
  | 'DM1_Der'
  | 'DM2_Der'
  | 'DM3_Der'
  | 'DM4_Der'
  | 'DM5_Der'
  // Extremidad Superior Izquierda (9)
  | 'HombroIzq'
  | 'BrazoIzq'
  | 'AntebrazoIzq'
  | 'PalmaIzq'
  | 'DM1_Izq'
  | 'DM2_Izq'
  | 'DM3_Izq'
  | 'DM4_Izq'
  | 'DM5_Izq'
  // Extremidad Inferior Derecha (8)
  | 'MusloDer'
  | 'PantorrillaDer'
  | 'PieDer'
  | 'DP1_Der'
  | 'DP2_Der'
  | 'DP3_Der'
  | 'DP4_Der'
  | 'DP5_Der'
  // Extremidad Inferior Izquierda (8)
  | 'MusloIzq'
  | 'PantorrillaIzq'
  | 'PieIzq'
  | 'DP1_Izq'
  | 'DP2_Izq'
  | 'DP3_Izq'
  | 'DP4_Izq'
  | 'DP5_Izq';

export type BodyRegion =
  | 'Cabeza y Cuello'
  | 'Tronco'
  | 'Brazo Derecho'
  | 'Brazo Izquierdo'
  | 'Pierna Derecha'
  | 'Pierna Izquierda';

export interface BodyPartClickContext {
  id: BodyPartId;
  config: BodyPartConfig;
  /** Permite cambiar dinámicamente el color de esta parte desde su propio onClick */
  setPartColor: (hexOrRgba: string | RGBA) => void;
}

export interface BodyPartConfig {
  /** Nombre exacto del nodo/material en el archivo .glb */
  id: BodyPartId;
  /** Nombre legible en español para mostrar en la interfaz */
  label: string;
  /** Región anatómica a la que pertenece */
  region: BodyRegion;
  /** Color base inicial en hexadecimal */
  color: string;
  /** Color al seleccionarse con click (opcional, por defecto amarillo brillante) */
  highlightColor?: string;
  /** Coordenadas tridimensionales exactas para enfocar la cámara: "${x}m ${y}m ${z}m" */
  cameraTarget: string;
  /** Ángulo y distancia de cámara recomendada: "${theta} ${phi} ${radius}" */
  cameraOrbit?: string;
  /** Campo de visión angular (zoom): ej. "25deg" */
  fieldOfView?: string;
  /** Acción específica que se ejecuta al hacer click en esta parte del cuerpo */
  onClick: (ctx: BodyPartClickContext) => void;
}

/**
 * Diccionario explícito y documentado de cada una de las 49 partes del cuerpo.
 * Puedes personalizar el color inicial y la función `onClick` de cada parte individualmente.
 */
export const DEFAULT_FULL_BODY_VIEW = {
  cameraTarget: "-0.04m 0.85m 0m",
  cameraOrbit: "0deg 75deg 4m",
  fieldOfView: "28deg",
};

export const BODY_PARTS_CONFIG: Record<BodyPartId, BodyPartConfig> = {
  // ============================================================================
  // 1. CABEZA Y CUELLO
  // ============================================================================
  Cabeza: {
    id: 'Cabeza',
    label: 'Cabeza (Cráneo)',
    region: 'Cabeza y Cuello',
    color: '#FF7043',
    cameraTarget: "-0.05m 1.58m -0.01m",
    cameraOrbit: "0deg 80deg 0.75m",
    fieldOfView: "28deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  Cuello: {
    id: 'Cuello',
    label: 'Cuello',
    region: 'Cabeza y Cuello',
    color: '#FFAB91',
    cameraTarget: "-0.05m 1.45m -0.03m",
    cameraOrbit: "0deg 80deg 0.70m",
    fieldOfView: "28deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  Nariz: {
    id: 'Nariz',
    label: 'Nariz',
    region: 'Cabeza y Cuello',
    color: '#F4511E',
    cameraTarget: "-0.05m 1.56m 0.09m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  Tabique: {
    id: 'Tabique',
    label: 'Tabique Nasal',
    region: 'Cabeza y Cuello',
    color: '#FF8A65',
    cameraTarget: "-0.05m 1.59m 0.08m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  OjoDer: {
    id: 'OjoDer',
    label: 'Ojo Derecho',
    region: 'Cabeza y Cuello',
    color: '#29B6F6',
    cameraTarget: "-0.08m 1.58m 0.06m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  OjoIzq: {
    id: 'OjoIzq',
    label: 'Ojo Izquierdo',
    region: 'Cabeza y Cuello',
    color: '#039BE5',
    cameraTarget: "-0.02m 1.58m 0.06m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  ParpadoSuperiorDer: {
    id: 'ParpadoSuperiorDer',
    label: 'Párpado Superior Derecho',
    region: 'Cabeza y Cuello',
    color: '#E64A19',
    cameraTarget: "-0.08m 1.58m 0.06m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  ParpadoSuperiorIzq: {
    id: 'ParpadoSuperiorIzq',
    label: 'Párpado Superior Izquierdo',
    region: 'Cabeza y Cuello',
    color: '#D84315',
    cameraTarget: "-0.02m 1.58m 0.06m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  ParpadoInferiorDer: {
    id: 'ParpadoInferiorDer',
    label: 'Párpado Inferior Derecho',
    region: 'Cabeza y Cuello',
    color: '#FFCCBC',
    cameraTarget: "-0.08m 1.57m 0.06m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  ParpadoInferiorIzq: {
    id: 'ParpadoInferiorIzq',
    label: 'Párpado Inferior Izquierdo',
    region: 'Cabeza y Cuello',
    color: '#FBE9E7',
    cameraTarget: "-0.02m 1.57m 0.06m",
    cameraOrbit: "0deg 80deg 0.45m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  OrejaDer: {
    id: 'OrejaDer',
    label: 'Oreja Derecha',
    region: 'Cabeza y Cuello',
    color: '#FF5722',
    cameraTarget: "-0.12m 1.56m -0.01m",
    cameraOrbit: "-60deg 80deg 0.55m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  OrejaIzq: {
    id: 'OrejaIzq',
    label: 'Oreja Izquierda',
    region: 'Cabeza y Cuello',
    color: '#BF360C',
    cameraTarget: "0.03m 1.56m -0.01m",
    cameraOrbit: "60deg 80deg 0.55m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },

  // ============================================================================
  // 2. TRONCO
  // ============================================================================
  Pecho: {
    id: 'Pecho',
    label: 'Pecho (Tórax)',
    region: 'Tronco',
    color: '#42A5F5',
    cameraTarget: "-0.05m 1.26m -0.04m",
    cameraOrbit: "0deg 75deg 1.10m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  Torso: {
    id: 'Torso',
    label: 'Torso (Abdomen)',
    region: 'Tronco',
    color: '#1E88E5',
    cameraTarget: "-0.05m 1.05m -0.02m",
    cameraOrbit: "0deg 75deg 1.10m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  Pelvis: {
    id: 'Pelvis',
    label: 'Pelvis (Cadera)',
    region: 'Tronco',
    color: '#1565C0',
    cameraTarget: "-0.05m 0.86m -0.04m",
    cameraOrbit: "0deg 75deg 1.10m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },

  // ============================================================================
  // 3. EXTREMIDAD SUPERIOR DERECHA (Brazo y Mano Derecha)
  // ============================================================================
  HombroDer: {
    id: 'HombroDer',
    label: 'Hombro Derecho',
    region: 'Brazo Derecho',
    color: '#66BB6A',
    cameraTarget: "-0.24m 1.31m -0.06m",
    cameraOrbit: "-25deg 75deg 1.00m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  BrazoDer: {
    id: 'BrazoDer',
    label: 'Brazo Superior Derecho',
    region: 'Brazo Derecho',
    color: '#43A047',
    cameraTarget: "-0.32m 1.22m -0.06m",
    cameraOrbit: "-25deg 75deg 1.00m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  AntebrazoDer: {
    id: 'AntebrazoDer',
    label: 'Antebrazo Derecho',
    region: 'Brazo Derecho',
    color: '#2E7D32',
    cameraTarget: "-0.45m 1.04m -0.02m",
    cameraOrbit: "-25deg 75deg 0.90m",
    fieldOfView: "28deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  PalmaDer: {
    id: 'PalmaDer',
    label: 'Palma Derecha',
    region: 'Brazo Derecho',
    color: '#81C784',
    cameraTarget: "-0.53m 0.90m 0.04m",
    cameraOrbit: "-25deg 75deg 0.60m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM1_Der: {
    id: 'DM1_Der',
    label: 'Dedo Pulgar (Mano Derecha)',
    region: 'Brazo Derecho',
    color: '#A5D6A7',
    cameraTarget: "-0.51m 0.89m 0.10m",
    cameraOrbit: "-25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM2_Der: {
    id: 'DM2_Der',
    label: 'Dedo Índice (Mano Derecha)',
    region: 'Brazo Derecho',
    color: '#C8E6C9',
    cameraTarget: "-0.57m 0.84m 0.10m",
    cameraOrbit: "-25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM3_Der: {
    id: 'DM3_Der',
    label: 'Dedo Medio (Mano Derecha)',
    region: 'Brazo Derecho',
    color: '#00E676',
    cameraTarget: "-0.58m 0.83m 0.08m",
    cameraOrbit: "-25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM4_Der: {
    id: 'DM4_Der',
    label: 'Dedo Anular (Mano Derecha)',
    region: 'Brazo Derecho',
    color: '#00C853',
    cameraTarget: "-0.58m 0.82m 0.05m",
    cameraOrbit: "-25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM5_Der: {
    id: 'DM5_Der',
    label: 'Dedo Meñique (Mano Derecha)',
    region: 'Brazo Derecho',
    color: '#B9F6CA',
    cameraTarget: "-0.57m 0.83m 0.02m",
    cameraOrbit: "-25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },

  // ============================================================================
  // 4. EXTREMIDAD SUPERIOR IZQUIERDA (Brazo y Mano Izquierda)
  // ============================================================================
  HombroIzq: {
    id: 'HombroIzq',
    label: 'Hombro Izquierdo',
    region: 'Brazo Izquierdo',
    color: '#26A69A',
    cameraTarget: "0.15m 1.31m -0.06m",
    cameraOrbit: "25deg 75deg 1.00m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  BrazoIzq: {
    id: 'BrazoIzq',
    label: 'Brazo Superior Izquierdo',
    region: 'Brazo Izquierdo',
    color: '#00897B',
    cameraTarget: "0.23m 1.22m -0.06m",
    cameraOrbit: "25deg 75deg 1.00m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  AntebrazoIzq: {
    id: 'AntebrazoIzq',
    label: 'Antebrazo Izquierdo',
    region: 'Brazo Izquierdo',
    color: '#00695C',
    cameraTarget: "0.36m 1.05m -0.02m",
    cameraOrbit: "25deg 75deg 0.90m",
    fieldOfView: "28deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  PalmaIzq: {
    id: 'PalmaIzq',
    label: 'Palma Izquierda',
    region: 'Brazo Izquierdo',
    color: '#4DB6AC',
    cameraTarget: "0.45m 0.91m 0.03m",
    cameraOrbit: "25deg 75deg 0.60m",
    fieldOfView: "24deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM1_Izq: {
    id: 'DM1_Izq',
    label: 'Dedo Pulgar (Mano Izquierda)',
    region: 'Brazo Izquierdo',
    color: '#80CBC4',
    cameraTarget: "0.44m 0.90m 0.09m",
    cameraOrbit: "25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM2_Izq: {
    id: 'DM2_Izq',
    label: 'Dedo Índice (Mano Izquierda)',
    region: 'Brazo Izquierdo',
    color: '#B2DFDB',
    cameraTarget: "0.49m 0.86m 0.09m",
    cameraOrbit: "25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM3_Izq: {
    id: 'DM3_Izq',
    label: 'Dedo Medio (Mano Izquierda)',
    region: 'Brazo Izquierdo',
    color: '#1DE9B6',
    cameraTarget: "0.51m 0.84m 0.07m",
    cameraOrbit: "25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM4_Izq: {
    id: 'DM4_Izq',
    label: 'Dedo Anular (Mano Izquierda)',
    region: 'Brazo Izquierdo',
    color: '#00BFA5',
    cameraTarget: "0.51m 0.84m 0.04m",
    cameraOrbit: "25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DM5_Izq: {
    id: 'DM5_Izq',
    label: 'Dedo Meñique (Mano Izquierda)',
    region: 'Brazo Izquierdo',
    color: '#A7FFEB',
    cameraTarget: "0.50m 0.84m 0.01m",
    cameraOrbit: "25deg 75deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },

  // ============================================================================
  // 5. EXTREMIDAD INFERIOR DERECHA (Pierna y Pie Derecho)
  // ============================================================================
  MusloDer: {
    id: 'MusloDer',
    label: 'Muslo Derecho',
    region: 'Pierna Derecha',
    color: '#AB47BC',
    cameraTarget: "-0.15m 0.69m -0.03m",
    cameraOrbit: "-15deg 80deg 1.10m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  PantorrillaDer: {
    id: 'PantorrillaDer',
    label: 'Pantorrilla Derecha',
    region: 'Pierna Derecha',
    color: '#8E24AA',
    cameraTarget: "-0.20m 0.31m -0.08m",
    cameraOrbit: "-15deg 82deg 1.00m",
    fieldOfView: "28deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  PieDer: {
    id: 'PieDer',
    label: 'Pie Derecho',
    region: 'Pierna Derecha',
    color: '#BA68C8',
    cameraTarget: "-0.25m 0.06m -0.06m",
    cameraOrbit: "-15deg 84deg 0.70m",
    fieldOfView: "25deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP1_Der: {
    id: 'DP1_Der',
    label: 'Dedo Gordo (Pie Derecho)',
    region: 'Pierna Derecha',
    color: '#CE93D8',
    cameraTarget: "-0.26m 0.01m 0.05m",
    cameraOrbit: "-15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP2_Der: {
    id: 'DP2_Der',
    label: '2.º Dedo (Pie Derecho)',
    region: 'Pierna Derecha',
    color: '#E1BEE7',
    cameraTarget: "-0.28m 0.01m 0.04m",
    cameraOrbit: "-15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP3_Der: {
    id: 'DP3_Der',
    label: '3.er Dedo (Pie Derecho)',
    region: 'Pierna Derecha',
    color: '#EA80FC',
    cameraTarget: "-0.29m 0.01m 0.03m",
    cameraOrbit: "-15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP4_Der: {
    id: 'DP4_Der',
    label: '4.º Dedo (Pie Derecho)',
    region: 'Pierna Derecha',
    color: '#D500F9',
    cameraTarget: "-0.30m 0.01m 0.01m",
    cameraOrbit: "-15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP5_Der: {
    id: 'DP5_Der',
    label: 'Dedo Meñique (Pie Derecho)',
    region: 'Pierna Derecha',
    color: '#AA00FF',
    cameraTarget: "-0.31m 0.01m 0.00m",
    cameraOrbit: "-15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },

  // ============================================================================
  // 6. EXTREMIDAD INFERIOR IZQUIERDA (Pierna y Pie Izquierdo)
  // ============================================================================
  MusloIzq: {
    id: 'MusloIzq',
    label: 'Muslo Izquierdo',
    region: 'Pierna Izquierda',
    color: '#EC407A',
    cameraTarget: "0.05m 0.69m -0.03m",
    cameraOrbit: "15deg 80deg 1.10m",
    fieldOfView: "30deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  PantorrillaIzq: {
    id: 'PantorrillaIzq',
    label: 'Pantorrilla Izquierda',
    region: 'Pierna Izquierda',
    color: '#D81B60',
    cameraTarget: "0.11m 0.31m -0.08m",
    cameraOrbit: "15deg 82deg 1.00m",
    fieldOfView: "28deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  PieIzq: {
    id: 'PieIzq',
    label: 'Pie Izquierdo',
    region: 'Pierna Izquierda',
    color: '#F06292',
    cameraTarget: "0.15m 0.06m -0.06m",
    cameraOrbit: "15deg 84deg 0.70m",
    fieldOfView: "25deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP1_Izq: {
    id: 'DP1_Izq',
    label: 'Dedo Gordo (Pie Izquierdo)',
    region: 'Pierna Izquierda',
    color: '#F48FB1',
    cameraTarget: "0.16m 0.01m 0.05m",
    cameraOrbit: "15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP2_Izq: {
    id: 'DP2_Izq',
    label: '2.º Dedo (Pie Izquierdo)',
    region: 'Pierna Izquierda',
    color: '#F8BBD0',
    cameraTarget: "0.18m 0.01m 0.04m",
    cameraOrbit: "15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP3_Izq: {
    id: 'DP3_Izq',
    label: '3.er Dedo (Pie Izquierdo)',
    region: 'Pierna Izquierda',
    color: '#FF80AB',
    cameraTarget: "0.20m 0.01m 0.03m",
    cameraOrbit: "15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP4_Izq: {
    id: 'DP4_Izq',
    label: '4.º Dedo (Pie Izquierdo)',
    region: 'Pierna Izquierda',
    color: '#F50057',
    cameraTarget: "0.21m 0.01m 0.01m",
    cameraOrbit: "15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
  DP5_Izq: {
    id: 'DP5_Izq',
    label: 'Dedo Meñique (Pie Izquierdo)',
    region: 'Pierna Izquierda',
    color: '#C51162',
    cameraTarget: "0.22m 0.01m 0.00m",
    cameraOrbit: "15deg 84deg 0.50m",
    fieldOfView: "22deg",
    onClick: ({ config }) => {
      console.log(`[Click] ${config.label}`);
    },
  },
};
