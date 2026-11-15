import type { RGBA } from '@google/model-viewer/lib/features/scene-graph/api';

/**
 * Identificadores exactos de los 135 huesos del modelo 3D Esqueleto.glb
 */
export type SkeletonPartId =
  | 'ClaviculaDer'
  | 'ClaviculaIzq'
  | 'CubitoDer'
  | 'MDistal1_Der'
  | 'MProximal1_Der'
  | 'Metacarpo1_Der'
  | 'MDistal2_Der'
  | 'MNudillo2_Der'
  | 'MProximal2_Der'
  | 'Metacarpo2_Der'
  | 'MDistal3_Der'
  | 'MNudillo3_Der'
  | 'MProximal3_Der'
  | 'Metacarpo3_Der'
  | 'MDistal4_Der'
  | 'MNudillo4_Der'
  | 'MProximal4_Der'
  | 'Metacarpo4_Der'
  | 'MDistal5_Der'
  | 'MNudillo5_Der'
  | 'MProximal5_Der'
  | 'Metcarpo5_Der'
  | 'CarpoDer'
  | 'RadioDer'
  | 'HumeroDer'
  | 'OmoplatoDer'
  | 'CubitoIzq'
  | 'MDistal1_Izq'
  | 'MProximal1_Izq'
  | 'Metacarpo1_Izq'
  | 'MDistal2_Izq'
  | 'MNudillo2_Izq'
  | 'MProximal2_Izq'
  | 'Metacarpo2_Izq'
  | 'MDistal3_Izq'
  | 'MNudillo3_Izq'
  | 'MProximal3_Izq'
  | 'Metacarpo3_Izq'
  | 'MDistal4_Izq'
  | 'MNudillo4_Izq'
  | 'MProximal4_Izq'
  | 'Metacarpo4_Izq'
  | 'MDistal5_Izq'
  | 'MNudillo5_Izq'
  | 'MProximal5_Izq'
  | 'Metcarpo5_Izq'
  | 'CarpoIzq'
  | 'RadioIzq'
  | 'HumeroIzq'
  | 'OmoplatoIzq'
  | 'Costillas'
  | 'FibulaDer'
  | 'PatelaDer'
  | 'CalcaneoDer'
  | 'Distal1_Der'
  | 'Proximal1_Der'
  | 'Metatarso1_Der'
  | 'Distal2_Der'
  | 'PNudillo2_Der'
  | 'Proximal2_Der'
  | 'Metatarso2_Der'
  | 'Distal3_Der'
  | 'PNudillo3_Der'
  | 'Proximal3_Der'
  | 'Metatarso3_Der'
  | 'Distal4_Der'
  | 'PNudillo4_Der'
  | 'Proximal4_Der'
  | 'Metatarso4_Der'
  | 'Distal5_Der'
  | 'PNudillo5_Der'
  | 'Proximal5_Der'
  | 'Metatarso5_Der'
  | 'TarsoDer'
  | 'TaloDer'
  | 'TibulaDer'
  | 'FemurDer'
  | 'FibulaIzq'
  | 'PatelaIzq'
  | 'CalcaneoIzq'
  | 'Distal1_Izq'
  | 'Proximal1_Izq'
  | 'Metatarso1_Izq'
  | 'Distal2_Izq'
  | 'PNudillo2_Izq'
  | 'Proximal2_Izq'
  | 'Metatarso2_Izq'
  | 'Distal3_Izq'
  | 'PNudillo3_Izq'
  | 'Proximal3_Izq'
  | 'Metatarso3_Izq'
  | 'Distal4_Izq'
  | 'PNudillo4_Izq'
  | 'Proximal4_Izq'
  | 'Metatarso4_Izq'
  | 'Distal5_Izq'
  | 'PNudillo5_izq'
  | 'Proximal5_Izq'
  | 'Metatarso5_Izq'
  | 'TarsoIzq'
  | 'TaloIzq'
  | 'TibulaIzq'
  | 'FemurIzq'
  | 'Coxis'
  | 'Craneo'
  | 'VertebraCervical1'
  | 'VertebraCervical2'
  | 'VertebraCervical3'
  | 'VertebraCervical4'
  | 'VertebraCervical5'
  | 'VertebraCervical6'
  | 'VertebraCervical7'
  | 'VertebraToracica'
  | 'VertebraToracica2'
  | 'VertebraToracica3'
  | 'VertebraToracica4'
  | 'VertebraToracica5'
  | 'VertebraToracica6'
  | 'VertebraToracica7'
  | 'VertebraToracica8'
  | 'VertebraToracica9'
  | 'VertebraToracica10'
  | 'VertebraToracica11'
  | 'VertebraToracica12'
  | 'VertebraLumbar1'
  | 'VertebraLumbar1.5'
  | 'VertebraLumbar2'
  | 'VertebraLumbar2.5'
  | 'VertebraLumbar3'
  | 'VertebraLumbar3.5'
  | 'VertebraLumbar4'
  | 'VertebraLumbar4.5'
  | 'VertebraLumbar5'
  | 'Sacro'
  | 'Cadera'

export type SkeletonRegion =
  | 'Cráneo y Columna'
  | 'Tórax'
  | 'Pelvis'
  | 'Extremidad Superior Derecha'
  | 'Extremidad Superior Izquierda'
  | 'Extremidad Inferior Derecha'
  | 'Extremidad Inferior Izquierda';

export interface SkeletonPartClickContext {
  id: SkeletonPartId;
  config: SkeletonPartConfig;
  setPartColor: (hexOrRgba: string | RGBA) => void;
}

export interface SkeletonPartConfig {
  id: SkeletonPartId;
  label: string;
  region: SkeletonRegion;
  color: string;
  highlightColor?: string;
  cameraTarget: string;
  cameraOrbit?: string;
  fieldOfView?: string;
  onClick: (ctx: SkeletonPartClickContext) => void;
}

export const DEFAULT_SKELETON_VIEW = {
  cameraTarget: '0m 0.95m 0m',
  cameraOrbit: '0deg 75deg 3.5m',
  fieldOfView: '28deg',
};

/** Color base de hueso natural (marfil óseo) */
export const SKELETON_BONE_COLOR = '#EFECE6';

/** Color de selección de hueso activo (amarillo dorado vibrante) */
export const SKELETON_HIGHLIGHT_COLOR = '#FFD700';

export const SKELETON_PARTS_CONFIG: Record<SkeletonPartId, SkeletonPartConfig> = {
  'ClaviculaDer': {
    id: 'ClaviculaDer',
    label: 'Clavícula Derecha',
    region: 'Tórax',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.10m 1.45m 0.03m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'ClaviculaIzq': {
    id: 'ClaviculaIzq',
    label: 'Clavícula Izquierda',
    region: 'Tórax',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.09m 1.45m 0.03m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'CubitoDer': {
    id: 'CubitoDer',
    label: 'Cúbito Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.40m 1.06m 0.02m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal1_Der': {
    id: 'MDistal1_Der',
    label: 'Falange Distal Manual 1 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.41m 0.88m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal1_Der': {
    id: 'MProximal1_Der',
    label: 'Falange Proximal Manual 1 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.42m 0.90m 0.14m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo1_Der': {
    id: 'Metacarpo1_Der',
    label: 'Metacarpiano 1 Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.42m 0.92m 0.11m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal2_Der': {
    id: 'MDistal2_Der',
    label: 'Falange Distal Manual 2 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.43m 0.80m 0.13m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo2_Der': {
    id: 'MNudillo2_Der',
    label: 'Falange Media Manual 2 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.44m 0.82m 0.13m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal2_Der': {
    id: 'MProximal2_Der',
    label: 'Falange Proximal Manual 2 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.45m 0.84m 0.12m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo2_Der': {
    id: 'Metacarpo2_Der',
    label: 'Metacarpiano 2 Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.44m 0.89m 0.10m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal3_Der': {
    id: 'MDistal3_Der',
    label: 'Falange Distal Manual 3 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.43m 0.78m 0.11m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo3_Der': {
    id: 'MNudillo3_Der',
    label: 'Falange Media Manual 3 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.44m 0.80m 0.10m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal3_Der': {
    id: 'MProximal3_Der',
    label: 'Falange Proximal Manual 3 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.45m 0.83m 0.09m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo3_Der': {
    id: 'Metacarpo3_Der',
    label: 'Metacarpiano 3 Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.44m 0.89m 0.08m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal4_Der': {
    id: 'MDistal4_Der',
    label: 'Falange Distal Manual 4 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.43m 0.78m 0.07m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo4_Der': {
    id: 'MNudillo4_Der',
    label: 'Falange Media Manual 4 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.44m 0.80m 0.07m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal4_Der': {
    id: 'MProximal4_Der',
    label: 'Falange Proximal Manual 4 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.45m 0.84m 0.07m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo4_Der': {
    id: 'Metacarpo4_Der',
    label: 'Metacarpiano 4 Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.44m 0.88m 0.06m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal5_Der': {
    id: 'MDistal5_Der',
    label: 'Falange Distal Manual 5 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.42m 0.80m 0.05m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo5_Der': {
    id: 'MNudillo5_Der',
    label: 'Falange Media Manual 5 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.43m 0.82m 0.04m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal5_Der': {
    id: 'MProximal5_Der',
    label: 'Falange Proximal Manual 5 Derecha',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.43m 0.84m 0.05m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metcarpo5_Der': {
    id: 'Metcarpo5_Der',
    label: 'Metacarpiano 5 Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.43m 0.88m 0.05m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'CarpoDer': {
    id: 'CarpoDer',
    label: 'Carpo Derecho (Muñeca)',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.42m 0.93m 0.06m',
    cameraOrbit: '0deg 75deg 0.6m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'RadioDer': {
    id: 'RadioDer',
    label: 'Radio Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.37m 1.06m 0.00m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'HumeroDer': {
    id: 'HumeroDer',
    label: 'Húmero Derecho',
    region: 'Extremidad Superior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.26m 1.30m 0.00m',
    cameraOrbit: '0deg 75deg 0.9m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'OmoplatoDer': {
    id: 'OmoplatoDer',
    label: 'Omóplato / Escápula Derecha',
    region: 'Tórax',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.14m 1.40m -0.02m',
    cameraOrbit: '0deg 75deg 0.85m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'CubitoIzq': {
    id: 'CubitoIzq',
    label: 'Cúbito Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.39m 1.06m 0.02m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal1_Izq': {
    id: 'MDistal1_Izq',
    label: 'Falange Distal Manual 1 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.41m 0.88m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal1_Izq': {
    id: 'MProximal1_Izq',
    label: 'Falange Proximal Manual 1 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.42m 0.90m 0.14m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo1_Izq': {
    id: 'Metacarpo1_Izq',
    label: 'Metacarpiano 1 Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.42m 0.92m 0.11m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal2_Izq': {
    id: 'MDistal2_Izq',
    label: 'Falange Distal Manual 2 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.42m 0.80m 0.13m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo2_Izq': {
    id: 'MNudillo2_Izq',
    label: 'Falange Media Manual 2 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.82m 0.13m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal2_Izq': {
    id: 'MProximal2_Izq',
    label: 'Falange Proximal Manual 2 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.44m 0.84m 0.12m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo2_Izq': {
    id: 'Metacarpo2_Izq',
    label: 'Metacarpiano 2 Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.44m 0.89m 0.10m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal3_Izq': {
    id: 'MDistal3_Izq',
    label: 'Falange Distal Manual 3 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.78m 0.11m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo3_Izq': {
    id: 'MNudillo3_Izq',
    label: 'Falange Media Manual 3 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.80m 0.10m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal3_Izq': {
    id: 'MProximal3_Izq',
    label: 'Falange Proximal Manual 3 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.44m 0.83m 0.09m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo3_Izq': {
    id: 'Metacarpo3_Izq',
    label: 'Metacarpiano 3 Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.44m 0.89m 0.08m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal4_Izq': {
    id: 'MDistal4_Izq',
    label: 'Falange Distal Manual 4 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.78m 0.07m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo4_Izq': {
    id: 'MNudillo4_Izq',
    label: 'Falange Media Manual 4 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.80m 0.07m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal4_Izq': {
    id: 'MProximal4_Izq',
    label: 'Falange Proximal Manual 4 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.44m 0.84m 0.07m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metacarpo4_Izq': {
    id: 'Metacarpo4_Izq',
    label: 'Metacarpiano 4 Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.88m 0.06m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MDistal5_Izq': {
    id: 'MDistal5_Izq',
    label: 'Falange Distal Manual 5 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.41m 0.80m 0.05m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MNudillo5_Izq': {
    id: 'MNudillo5_Izq',
    label: 'Falange Media Manual 5 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.42m 0.82m 0.04m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'MProximal5_Izq': {
    id: 'MProximal5_Izq',
    label: 'Falange Proximal Manual 5 Izquierda',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.84m 0.05m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metcarpo5_Izq': {
    id: 'Metcarpo5_Izq',
    label: 'Metacarpiano 5 Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.43m 0.88m 0.05m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'CarpoIzq': {
    id: 'CarpoIzq',
    label: 'Carpo Izquierdo (Muñeca)',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.42m 0.93m 0.06m',
    cameraOrbit: '0deg 75deg 0.6m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'RadioIzq': {
    id: 'RadioIzq',
    label: 'Radio Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.37m 1.06m 0.00m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'HumeroIzq': {
    id: 'HumeroIzq',
    label: 'Húmero Izquierdo',
    region: 'Extremidad Superior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.26m 1.30m 0.00m',
    cameraOrbit: '0deg 75deg 0.9m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'OmoplatoIzq': {
    id: 'OmoplatoIzq',
    label: 'Omóplato / Escápula Izquierda',
    region: 'Tórax',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.14m 1.40m -0.02m',
    cameraOrbit: '0deg 75deg 0.85m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Costillas': {
    id: 'Costillas',
    label: 'Caja Torácica (Costillas y Esternón)',
    region: 'Tórax',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.33m 0.03m',
    cameraOrbit: '0deg 75deg 1.2m',
    fieldOfView: '28deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'FibulaDer': {
    id: 'FibulaDer',
    label: 'Peroné (Fíbula) Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.16m 0.26m -0.01m',
    cameraOrbit: '0deg 75deg 0.9m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PatelaDer': {
    id: 'PatelaDer',
    label: 'Rótula (Patela) Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.11m 0.49m 0.05m',
    cameraOrbit: '0deg 75deg 0.65m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'CalcaneoDer': {
    id: 'CalcaneoDer',
    label: 'Calcáneo Derecho (Talón)',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.13m 0.04m -0.01m',
    cameraOrbit: '0deg 75deg 0.65m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal1_Der': {
    id: 'Distal1_Der',
    label: 'Falange Distal Podal 1 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.13m 0.01m 0.19m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal1_Der': {
    id: 'Proximal1_Der',
    label: 'Falange Proximal Podal 1 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.13m 0.02m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso1_Der': {
    id: 'Metatarso1_Der',
    label: 'Metatarsiano 1 Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.13m 0.03m 0.11m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal2_Der': {
    id: 'Distal2_Der',
    label: 'Falange Distal Podal 2 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.16m 0.01m 0.20m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo2_Der': {
    id: 'PNudillo2_Der',
    label: 'Falange Media Podal 2 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.16m 0.01m 0.18m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal2_Der': {
    id: 'Proximal2_Der',
    label: 'Falange Proximal Podal 2 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.15m 0.01m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso2_Der': {
    id: 'Metatarso2_Der',
    label: 'Metatarsiano 2 Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.15m 0.03m 0.10m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal3_Der': {
    id: 'Distal3_Der',
    label: 'Falange Distal Podal 3 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.17m 0.01m 0.19m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo3_Der': {
    id: 'PNudillo3_Der',
    label: 'Falange Media Podal 3 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.17m 0.01m 0.18m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal3_Der': {
    id: 'Proximal3_Der',
    label: 'Falange Proximal Podal 3 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.17m 0.01m 0.15m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso3_Der': {
    id: 'Metatarso3_Der',
    label: 'Metatarsiano 3 Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.16m 0.03m 0.10m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal4_Der': {
    id: 'Distal4_Der',
    label: 'Falange Distal Podal 4 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.19m 0.01m 0.17m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo4_Der': {
    id: 'PNudillo4_Der',
    label: 'Falange Media Podal 4 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.18m 0.01m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal4_Der': {
    id: 'Proximal4_Der',
    label: 'Falange Proximal Podal 4 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.18m 0.01m 0.14m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso4_Der': {
    id: 'Metatarso4_Der',
    label: 'Metatarsiano 4 Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.17m 0.02m 0.09m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal5_Der': {
    id: 'Distal5_Der',
    label: 'Falange Distal Podal 5 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.20m 0.01m 0.15m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo5_Der': {
    id: 'PNudillo5_Der',
    label: 'Falange Media Podal 5 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.20m 0.01m 0.14m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal5_Der': {
    id: 'Proximal5_Der',
    label: 'Falange Proximal Podal 5 Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.19m 0.01m 0.12m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso5_Der': {
    id: 'Metatarso5_Der',
    label: 'Metatarsiano 5 Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.18m 0.02m 0.08m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'TarsoDer': {
    id: 'TarsoDer',
    label: 'Tarso Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.14m 0.05m 0.06m',
    cameraOrbit: '0deg 75deg 0.6m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'TaloDer': {
    id: 'TaloDer',
    label: 'Astrágalo (Talus) Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.13m 0.07m 0.01m',
    cameraOrbit: '0deg 75deg 0.65m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'TibulaDer': {
    id: 'TibulaDer',
    label: 'Tibia Derecha',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.12m 0.28m -0.00m',
    cameraOrbit: '0deg 75deg 0.95m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'FemurDer': {
    id: 'FemurDer',
    label: 'Fémur Derecho',
    region: 'Extremidad Inferior Derecha',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.11m 0.72m 0.01m',
    cameraOrbit: '0deg 75deg 1.0m',
    fieldOfView: '26deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'FibulaIzq': {
    id: 'FibulaIzq',
    label: 'Peroné (Fíbula) Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.15m 0.26m -0.01m',
    cameraOrbit: '0deg 75deg 0.9m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PatelaIzq': {
    id: 'PatelaIzq',
    label: 'Rótula (Patela) Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.11m 0.49m 0.05m',
    cameraOrbit: '0deg 75deg 0.65m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'CalcaneoIzq': {
    id: 'CalcaneoIzq',
    label: 'Calcáneo Izquierdo (Talón)',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.13m 0.04m -0.01m',
    cameraOrbit: '0deg 75deg 0.65m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal1_Izq': {
    id: 'Distal1_Izq',
    label: 'Falange Distal Podal 1 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.12m 0.01m 0.19m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal1_Izq': {
    id: 'Proximal1_Izq',
    label: 'Falange Proximal Podal 1 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.12m 0.02m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso1_Izq': {
    id: 'Metatarso1_Izq',
    label: 'Metatarsiano 1 Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.12m 0.03m 0.11m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal2_Izq': {
    id: 'Distal2_Izq',
    label: 'Falange Distal Podal 2 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.15m 0.01m 0.20m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo2_Izq': {
    id: 'PNudillo2_Izq',
    label: 'Falange Media Podal 2 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.15m 0.01m 0.18m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal2_Izq': {
    id: 'Proximal2_Izq',
    label: 'Falange Proximal Podal 2 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.15m 0.01m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso2_Izq': {
    id: 'Metatarso2_Izq',
    label: 'Metatarsiano 2 Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.14m 0.03m 0.10m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal3_Izq': {
    id: 'Distal3_Izq',
    label: 'Falange Distal Podal 3 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.17m 0.01m 0.19m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo3_Izq': {
    id: 'PNudillo3_Izq',
    label: 'Falange Media Podal 3 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.17m 0.01m 0.18m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal3_Izq': {
    id: 'Proximal3_Izq',
    label: 'Falange Proximal Podal 3 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.16m 0.01m 0.15m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso3_Izq': {
    id: 'Metatarso3_Izq',
    label: 'Metatarsiano 3 Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.15m 0.03m 0.10m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal4_Izq': {
    id: 'Distal4_Izq',
    label: 'Falange Distal Podal 4 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.18m 0.01m 0.17m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo4_Izq': {
    id: 'PNudillo4_Izq',
    label: 'Falange Media Podal 4 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.18m 0.01m 0.16m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal4_Izq': {
    id: 'Proximal4_Izq',
    label: 'Falange Proximal Podal 4 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.17m 0.01m 0.14m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso4_Izq': {
    id: 'Metatarso4_Izq',
    label: 'Metatarsiano 4 Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.16m 0.02m 0.09m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Distal5_Izq': {
    id: 'Distal5_Izq',
    label: 'Falange Distal Podal 5 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.19m 0.01m 0.15m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'PNudillo5_izq': {
    id: 'PNudillo5_izq',
    label: 'Falange Media Podal 5 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.19m 0.01m 0.14m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Proximal5_Izq': {
    id: 'Proximal5_Izq',
    label: 'Falange Proximal Podal 5 Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.19m 0.01m 0.12m',
    cameraOrbit: '0deg 75deg 0.45m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Metatarso5_Izq': {
    id: 'Metatarso5_Izq',
    label: 'Metatarsiano 5 Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.17m 0.02m 0.08m',
    cameraOrbit: '0deg 75deg 0.5m',
    fieldOfView: '20deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'TarsoIzq': {
    id: 'TarsoIzq',
    label: 'Tarso Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.13m 0.05m 0.06m',
    cameraOrbit: '0deg 75deg 0.6m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'TaloIzq': {
    id: 'TaloIzq',
    label: 'Astrágalo (Talus) Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.12m 0.07m 0.01m',
    cameraOrbit: '0deg 75deg 0.65m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'TibulaIzq': {
    id: 'TibulaIzq',
    label: 'Tibia Izquierda',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.12m 0.28m -0.00m',
    cameraOrbit: '0deg 75deg 0.95m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'FemurIzq': {
    id: 'FemurIzq',
    label: 'Fémur Izquierdo',
    region: 'Extremidad Inferior Izquierda',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '0.10m 0.72m 0.01m',
    cameraOrbit: '0deg 75deg 1.0m',
    fieldOfView: '26deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Coxis': {
    id: 'Coxis',
    label: 'Cóccix',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 0.91m -0.05m',
    cameraOrbit: '0deg 75deg 0.7m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Craneo': {
    id: 'Craneo',
    label: 'Cráneo',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.65m 0.05m',
    cameraOrbit: '0deg 75deg 1.1m',
    fieldOfView: '26deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraCervical1': {
    id: 'VertebraCervical1',
    label: 'Vértebra Cervical C1 (Atlas)',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.61m 0.01m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraCervical2': {
    id: 'VertebraCervical2',
    label: 'Vértebra Cervical C2 (Axis)',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.60m 0.00m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraCervical3': {
    id: 'VertebraCervical3',
    label: 'Vértebra Cervical C3',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.58m -0.00m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraCervical4': {
    id: 'VertebraCervical4',
    label: 'Vértebra Cervical C4',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.56m -0.00m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraCervical5': {
    id: 'VertebraCervical5',
    label: 'Vértebra Cervical C5',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.54m -0.01m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraCervical6': {
    id: 'VertebraCervical6',
    label: 'Vértebra Cervical C6',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.52m -0.01m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraCervical7': {
    id: 'VertebraCervical7',
    label: 'Vértebra Cervical C7',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.50m -0.02m',
    cameraOrbit: '0deg 75deg 0.75m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica': {
    id: 'VertebraToracica',
    label: 'Vértebra Torácica T1',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.49m -0.02m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica2': {
    id: 'VertebraToracica2',
    label: 'Vértebra Torácica T2',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.47m -0.03m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica3': {
    id: 'VertebraToracica3',
    label: 'Vértebra Torácica T3',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.45m -0.05m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica4': {
    id: 'VertebraToracica4',
    label: 'Vértebra Torácica T4',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.43m -0.06m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica5': {
    id: 'VertebraToracica5',
    label: 'Vértebra Torácica T5',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.41m -0.06m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica6': {
    id: 'VertebraToracica6',
    label: 'Vértebra Torácica T6',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.38m -0.07m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica7': {
    id: 'VertebraToracica7',
    label: 'Vértebra Torácica T7',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.36m -0.07m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica8': {
    id: 'VertebraToracica8',
    label: 'Vértebra Torácica T8',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.33m -0.07m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica9': {
    id: 'VertebraToracica9',
    label: 'Vértebra Torácica T9',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.30m -0.06m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica10': {
    id: 'VertebraToracica10',
    label: 'Vértebra Torácica T10',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.27m -0.05m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica11': {
    id: 'VertebraToracica11',
    label: 'Vértebra Torácica T11',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.24m -0.04m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraToracica12': {
    id: 'VertebraToracica12',
    label: 'Vértebra Torácica T12',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.21m -0.03m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar1': {
    id: 'VertebraLumbar1',
    label: 'Vértebra Lumbar L1',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.18m -0.01m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar1.5': {
    id: 'VertebraLumbar1.5',
    label: 'Vértebra Lumbar L1.5',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.17m 0.02m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar2': {
    id: 'VertebraLumbar2',
    label: 'Vértebra Lumbar L2',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.15m -0.00m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar2.5': {
    id: 'VertebraLumbar2.5',
    label: 'Vértebra Lumbar L2.5',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.13m 0.03m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar3': {
    id: 'VertebraLumbar3',
    label: 'Vértebra Lumbar L3',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.11m 0.00m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar3.5': {
    id: 'VertebraLumbar3.5',
    label: 'Vértebra Lumbar L3.5',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.09m 0.03m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar4': {
    id: 'VertebraLumbar4',
    label: 'Vértebra Lumbar L4',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.08m -0.00m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar4.5': {
    id: 'VertebraLumbar4.5',
    label: 'Vértebra Lumbar L4.5',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.05m 0.01m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'VertebraLumbar5': {
    id: 'VertebraLumbar5',
    label: 'Vértebra Lumbar L5',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 1.04m -0.01m',
    cameraOrbit: '0deg 75deg 0.8m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Sacro': {
    id: 'Sacro',
    label: 'Sacro',
    region: 'Cráneo y Columna',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 0.98m -0.03m',
    cameraOrbit: '0deg 75deg 0.85m',
    fieldOfView: '25deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
  'Cadera': {
    id: 'Cadera',
    label: 'Pelvis (Cintura Pélvica)',
    region: 'Pelvis',
    color: SKELETON_BONE_COLOR,
    highlightColor: SKELETON_HIGHLIGHT_COLOR,
    cameraTarget: '-0.00m 0.96m 0.01m',
    cameraOrbit: '0deg 75deg 1.2m',
    fieldOfView: '28deg',
    onClick: ({ config }) => {
      console.log("[Esqueleto Click] " + config.label + " (" + config.id + ")");
    },
  },
};
