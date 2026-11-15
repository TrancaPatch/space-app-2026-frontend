import type { RGBA } from '@google/model-viewer/lib/features/scene-graph/api';

/**
 * Identificadores exactos de los 33 nodos del modelo 3D SisCardiovascular.glb
 */
export type CardiovascularPartId =
  | 'ArteriaFemoralIzq'
  | 'VenaCavaArteriaAorta'
  | 'PulmonarDer1'
  | 'PulmonarDer2'
  | 'PulmonarDer3'
  | 'PulmonarDer4'
  | 'PulmonarIzq1'
  | 'PulmonarIzq3'
  | 'PulmonarIzq4'
  | 'PulmonarIzq2'
  | 'Subclava'
  | 'VCerebral'
  | 'ACerebral'
  | 'SubCarotida'
  | 'Carotida'
  | 'Corazon'
  | 'Brazo1'
  | 'Brazo1.001'
  | 'Brazo1.002'
  | 'Brazo1.003'
  | 'Brazo1.004'
  | 'Brazo1.005'
  | 'Brazo1.006'
  | 'Brazo1.007'
  | 'Brazo1.008'
  | 'Brazo1.009'
  | 'NurbsPath'
  | 'NurbsPath.001'
  | 'NurbsPath.002'
  | 'NurbsPath.003'
  | 'NurbsPath.004'
  | 'NurbsPath.005'
  | 'NurbsPath.006'

export type CardiovascularRegion =
  | 'Corazón y Grandes Vasos'
  | 'Vasos Pulmonares'
  | 'Vasos Cerebrales y Cuello'
  | 'Extremidad Superior Derecha'
  | 'Extremidad Superior Izquierda'
  | 'Extremidad Inferior y Pelvis'
  | 'Sistema Cardiovascular';

export interface CardiovascularPartClickContext {
  id: CardiovascularPartId;
  config: CardiovascularPartConfig;
  setPartColor: (hexOrRgba: string | RGBA) => void;
}

export interface CardiovascularPartConfig {
  id: CardiovascularPartId;
  label: string;
  region: CardiovascularRegion;
  color: string;
  highlightColor?: string;
  cameraTarget: string;
  cameraOrbit?: string;
  fieldOfView?: string;
  onClick: (ctx: CardiovascularPartClickContext) => void;
}

export const DEFAULT_CARDIOVASCULAR_VIEW = {
  cameraTarget: '0m 2.25m 0m',
  cameraOrbit: '0deg 75deg 10m',
  fieldOfView: '30deg',
};

/** Color base vascular carmesí natural */
export const CARDIOVASCULAR_BASE_COLOR = '#C62828';

/** Color de selección activo (amarillo dorado vibrante) */
export const CARDIOVASCULAR_HIGHLIGHT_COLOR = '#FFD700';

export const CARDIOVASCULAR_PARTS_CONFIG: Record<CardiovascularPartId, CardiovascularPartConfig> = {
  'ArteriaFemoralIzq': {
    id: 'ArteriaFemoralIzq',
    label: 'Arteria Femoral Izquierda',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.13m 2.63m -0.15m',
    cameraOrbit: '0deg 75deg 1.8m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VenaCavaArteriaAorta': {
    id: 'VenaCavaArteriaAorta',
    label: 'Vena Cava y Arteria Aorta',
    region: 'Corazón y Grandes Vasos',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.30m 2.76m -0.19m',
    cameraOrbit: '0deg 75deg 2.2m',
    fieldOfView: '26deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarDer1': {
    id: 'PulmonarDer1',
    label: 'Vasos Pulmonares Derechos (Rama 1)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.06m 3.74m -0.15m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarDer2': {
    id: 'PulmonarDer2',
    label: 'Vasos Pulmonares Derechos (Rama 2)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.12m 3.62m -0.15m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarDer3': {
    id: 'PulmonarDer3',
    label: 'Vasos Pulmonares Derechos (Rama 3)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.11m 3.56m -0.15m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarDer4': {
    id: 'PulmonarDer4',
    label: 'Vasos Pulmonares Derechos (Rama 4)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.04m 3.57m -0.15m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarIzq1': {
    id: 'PulmonarIzq1',
    label: 'Vasos Pulmonares Izquierdos (Rama 1)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.20m 3.79m -0.08m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarIzq3': {
    id: 'PulmonarIzq3',
    label: 'Vasos Pulmonares Izquierdos (Rama 3)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.22m 3.67m -0.09m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarIzq4': {
    id: 'PulmonarIzq4',
    label: 'Vasos Pulmonares Izquierdos (Rama 4)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.21m 3.59m -0.09m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PulmonarIzq2': {
    id: 'PulmonarIzq2',
    label: 'Vasos Pulmonares Izquierdos (Rama 2)',
    region: 'Vasos Pulmonares',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.22m 3.73m -0.08m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Subclava': {
    id: 'Subclava',
    label: 'Arteria y Vena Subclavia',
    region: 'Corazón y Grandes Vasos',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.33m 3.38m -0.22m',
    cameraOrbit: '0deg 75deg 1.8m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VCerebral': {
    id: 'VCerebral',
    label: 'Venas Cerebrales y Senos Venosos',
    region: 'Vasos Cerebrales y Cuello',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.08m 4.27m -0.08m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'ACerebral': {
    id: 'ACerebral',
    label: 'Arterias Cerebrales (Círculo de Willis)',
    region: 'Vasos Cerebrales y Cuello',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.06m 4.24m -0.07m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'SubCarotida': {
    id: 'SubCarotida',
    label: 'Tronco Braquiocefálico y Ramas Carotídeas',
    region: 'Vasos Cerebrales y Cuello',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.14m 4.27m -0.15m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Carotida': {
    id: 'Carotida',
    label: 'Arteria Carótida Común',
    region: 'Vasos Cerebrales y Cuello',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.14m 4.21m -0.15m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Corazon': {
    id: 'Corazon',
    label: 'Corazón (Miocardio y Cavidades)',
    region: 'Corazón y Grandes Vasos',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.03m 3.65m -0.00m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '26deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1': {
    id: 'Brazo1',
    label: 'Arteria Braquial Derecha',
    region: 'Extremidad Superior Derecha',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.64m 2.99m -0.18m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.001': {
    id: 'Brazo1.001',
    label: 'Arteria Radial Derecha',
    region: 'Extremidad Superior Derecha',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.65m 2.74m -0.18m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.002': {
    id: 'Brazo1.002',
    label: 'Arteria Cubital Derecha',
    region: 'Extremidad Superior Derecha',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.67m 2.66m -0.18m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.003': {
    id: 'Brazo1.003',
    label: 'Arco Palmar Derecho',
    region: 'Extremidad Superior Derecha',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.58m 2.76m -0.18m',
    cameraOrbit: '0deg 75deg 1.2m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.004': {
    id: 'Brazo1.004',
    label: 'Red Arterial Digital Derecha',
    region: 'Extremidad Superior Derecha',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.60m 2.67m -0.19m',
    cameraOrbit: '0deg 75deg 1.0m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.005': {
    id: 'Brazo1.005',
    label: 'Red Arterial Digital Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.60m 2.67m -0.25m',
    cameraOrbit: '0deg 75deg 1.0m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.006': {
    id: 'Brazo1.006',
    label: 'Arco Palmar Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.57m 2.77m -0.25m',
    cameraOrbit: '0deg 75deg 1.2m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.007': {
    id: 'Brazo1.007',
    label: 'Arteria Cubital Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.66m 2.66m -0.23m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.008': {
    id: 'Brazo1.008',
    label: 'Arteria Radial Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.65m 2.74m -0.26m',
    cameraOrbit: '0deg 75deg 1.4m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Brazo1.009': {
    id: 'Brazo1.009',
    label: 'Arteria Braquial Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.63m 2.99m -0.26m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'NurbsPath': {
    id: 'NurbsPath',
    label: 'Arteria Ilíaca Común Derecha',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.22m 1.18m -0.15m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'NurbsPath.001': {
    id: 'NurbsPath.001',
    label: 'Vena Ilíaca Externa Derecha',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '-0.19m 1.19m -0.17m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'NurbsPath.002': {
    id: 'NurbsPath.002',
    label: 'Vasos Poplíteos Derechos',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.02m 0.83m -0.18m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'NurbsPath.003': {
    id: 'NurbsPath.003',
    label: 'Vasos Tibiales Anteriores / Posteriores',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.02m 0.35m -0.20m',
    cameraOrbit: '0deg 75deg 1.5m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'NurbsPath.004': {
    id: 'NurbsPath.004',
    label: 'Red Vascular Podal y Arco Plantar',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.02m 0.26m -0.21m',
    cameraOrbit: '0deg 75deg 1.3m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'NurbsPath.005': {
    id: 'NurbsPath.005',
    label: 'Arteria Ilíaca Común Izquierda',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.26m 1.08m -0.15m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
  'NurbsPath.006': {
    id: 'NurbsPath.006',
    label: 'Vena Ilíaca Externa Izquierda',
    region: 'Extremidad Inferior y Pelvis',
    color: CARDIOVASCULAR_BASE_COLOR,
    highlightColor: CARDIOVASCULAR_HIGHLIGHT_COLOR,
    cameraTarget: '0.22m 1.11m -0.17m',
    cameraOrbit: '0deg 75deg 1.6m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Cardiovascular Click] " + config.label + " (" + config.id + ")");
    },
  },
};
