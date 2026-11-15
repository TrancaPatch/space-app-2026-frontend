import type { RGBA } from '@google/model-viewer/lib/features/scene-graph/api';

/**
 * Identificadores exactos de los 5 nodos del modelo 3D SisNervioso.glb
 */
export type NervousPartId =
  | 'CerebroDer'
  | 'CerebroIzq'
  | 'Cerebelo'
  | 'Diencefalo'
  | 'MedulaEspinal';

export type NervousRegion =
  | 'Encéfalo / Telencéfalo'
  | 'Romboencéfalo'
  | 'Diencéfalo'
  | 'Sistema Nervioso Central';

export interface NervousPartClickContext {
  id: NervousPartId;
  config: NervousPartConfig;
  setPartColor: (hexOrRgba: string | RGBA) => void;
}

export interface NervousPartConfig {
  id: NervousPartId;
  label: string;
  region: NervousRegion;
  description: string;
  color: string;
  highlightColor?: string;
  cameraTarget: string;
  cameraOrbit?: string;
  fieldOfView?: string;
  onClick: (ctx: NervousPartClickContext) => void;
}

export const DEFAULT_NERVOUS_VIEW = {
  cameraTarget: '0m 1.35m 0.02m',
  cameraOrbit: '0deg 75deg 2.0m',
  fieldOfView: '30deg',
};

/** Color base neural violeta anatómico */
export const NERVOUS_BASE_COLOR = '#9C27B0';

/** Color de selección activo (amarillo dorado vibrante) */
export const NERVOUS_HIGHLIGHT_COLOR = '#FFD700';

export const NERVOUS_PARTS_CONFIG: Record<NervousPartId, NervousPartConfig> = {
  'CerebroDer': {
    id: 'CerebroDer',
    label: 'Hemisferio Cerebral Derecho',
    region: 'Encéfalo / Telencéfalo',
    description: 'Control motor y sensorial del hemicuerpo izquierdo, orientación espacial, creatividad y percepción holística.',
    color: NERVOUS_BASE_COLOR,
    highlightColor: NERVOUS_HIGHLIGHT_COLOR,
    cameraTarget: '-0.04m 1.70m 0.03m',
    cameraOrbit: '35deg 75deg 0.75m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log(`[Nervous Click] ${config.label} (${config.id})`);
    },
  },
  'CerebroIzq': {
    id: 'CerebroIzq',
    label: 'Hemisferio Cerebral Izquierdo',
    region: 'Encéfalo / Telencéfalo',
    description: 'Control motor y sensorial del hemicuerpo derecho, procesamiento del lenguaje, razonamiento lógico y matemático.',
    color: NERVOUS_BASE_COLOR,
    highlightColor: NERVOUS_HIGHLIGHT_COLOR,
    cameraTarget: '0.04m 1.70m 0.03m',
    cameraOrbit: '-35deg 75deg 0.75m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log(`[Nervous Click] ${config.label} (${config.id})`);
    },
  },
  'Cerebelo': {
    id: 'Cerebelo',
    label: 'Cerebelo',
    region: 'Romboencéfalo',
    description: 'Coordinación fina del movimiento motor voluntario, equilibrio, postura y aprendizaje sensoriomotor.',
    color: NERVOUS_BASE_COLOR,
    highlightColor: NERVOUS_HIGHLIGHT_COLOR,
    cameraTarget: '0.00m 1.64m -0.01m',
    cameraOrbit: '180deg 75deg 0.70m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log(`[Nervous Click] ${config.label} (${config.id})`);
    },
  },
  'Diencefalo': {
    id: 'Diencefalo',
    label: 'Diencéfalo y Tronco Encefálico',
    region: 'Diencéfalo',
    description: 'Integración y relevo sensorial (tálamo), regulación homeostática y neuroendocrina (hipotálamo) y funciones vitales autónomas.',
    color: NERVOUS_BASE_COLOR,
    highlightColor: NERVOUS_HIGHLIGHT_COLOR,
    cameraTarget: '0.00m 1.66m 0.04m',
    cameraOrbit: '0deg 75deg 0.70m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log(`[Nervous Click] ${config.label} (${config.id})`);
    },
  },
  'MedulaEspinal': {
    id: 'MedulaEspinal',
    label: 'Médula Espinal',
    region: 'Sistema Nervioso Central',
    description: 'Vía principal de transmisión de impulsos nerviosos aferentes y eferentes entre encéfalo y sistema periférico, y centro de arcos reflejos.',
    color: NERVOUS_BASE_COLOR,
    highlightColor: NERVOUS_HIGHLIGHT_COLOR,
    cameraTarget: '0.00m 1.28m -0.03m',
    cameraOrbit: '20deg 75deg 1.35m',
    fieldOfView: '28deg',
    onClick: ({ config }) => {
      console.log(`[Nervous Click] ${config.label} (${config.id})`);
    },
  },
};
