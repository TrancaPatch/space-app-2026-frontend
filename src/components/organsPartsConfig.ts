import type { RGBA } from '@google/model-viewer/lib/features/scene-graph/api';

/**
 * Identificadores exactos de los 4 órganos del modelo 3D Organos.glb
 */
export type OrganPartId =
  | 'Pulmones'
  | 'Digestivo'
  | 'Higado'
  | 'Rinones';

export type OrganRegion =
  | 'Sistema Respiratorio'
  | 'Sistema Digestivo'
  | 'Sistema Hepatobiliar'
  | 'Sistema Renal / Excretor';

export interface OrganPartClickContext {
  id: OrganPartId;
  config: OrganPartConfig;
  setPartColor: (hexOrRgba: string | RGBA) => void;
}

export interface OrganPartConfig {
  id: OrganPartId;
  label: string;
  region: OrganRegion;
  description: string;
  color: string;
  highlightColor?: string;
  cameraTarget: string;
  cameraOrbit?: string;
  fieldOfView?: string;
  onClick: (ctx: OrganPartClickContext) => void;
}

export const DEFAULT_ORGANS_VIEW = {
  cameraTarget: '0m 1.10m 0m',
  cameraOrbit: '0deg 75deg 1.9m',
  fieldOfView: '28deg',
};

/** Color base visceral terracota/ámbar natural */
export const ORGANS_BASE_COLOR = '#E65100';

/** Color de selección activo (amarillo dorado vibrante) */
export const ORGANS_HIGHLIGHT_COLOR = '#FFD700';

export const ORGANS_PARTS_CONFIG: Record<OrganPartId, OrganPartConfig> = {
  'Pulmones': {
    id: 'Pulmones',
    label: 'Pulmones (Árbol Broncopulmonar)',
    region: 'Sistema Respiratorio',
    description: 'Intercambio gaseoso (hematosis), oxigenación de la sangre y eliminación de CO2. Regulación del equilibrio ácido-base y volumen respiratorio en microgravedad.',
    color: ORGANS_BASE_COLOR,
    highlightColor: ORGANS_HIGHLIGHT_COLOR,
    cameraTarget: '0.00m 1.29m 0.03m',
    cameraOrbit: '0deg 75deg 0.90m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log(`[Organ Click] ${config.label} (${config.id})`);
    },
  },
  'Digestivo': {
    id: 'Digestivo',
    label: 'Tracto Digestivo (Estómago e Intestinos)',
    region: 'Sistema Digestivo',
    description: 'Digestión mecánica y enzimática de nutrientes, motilidad gastrointestinal, absorción de agua y macronutrientes esenciales.',
    color: ORGANS_BASE_COLOR,
    highlightColor: ORGANS_HIGHLIGHT_COLOR,
    cameraTarget: '-0.01m 1.07m -0.04m',
    cameraOrbit: '15deg 75deg 1.10m',
    fieldOfView: '26deg',
    onClick: ({ config }) => {
      console.log(`[Organ Click] ${config.label} (${config.id})`);
    },
  },
  'Higado': {
    id: 'Higado',
    label: 'Hígado',
    region: 'Sistema Hepatobiliar',
    description: 'Metabolismo lipídico y glucídico, detoxificación sanguínea de toxinas y fármacos, síntesis de proteínas plasmáticas y secreción de bilis.',
    color: ORGANS_BASE_COLOR,
    highlightColor: ORGANS_HIGHLIGHT_COLOR,
    cameraTarget: '-0.02m 1.13m 0.03m',
    cameraOrbit: '-25deg 75deg 0.75m',
    fieldOfView: '22deg',
    onClick: ({ config }) => {
      console.log(`[Organ Click] ${config.label} (${config.id})`);
    },
  },
  'Rinones': {
    id: 'Rinones',
    label: 'Riñones (Sistema Renal)',
    region: 'Sistema Renal / Excretor',
    description: 'Filtración glomerular, excreción de desechos metabólicos, osmorregulación hidrosalina y regulación de la presión arterial sistémica.',
    color: ORGANS_BASE_COLOR,
    highlightColor: ORGANS_HIGHLIGHT_COLOR,
    cameraTarget: '0.00m 0.85m -0.03m',
    cameraOrbit: '180deg 75deg 0.85m',
    fieldOfView: '24deg',
    onClick: ({ config }) => {
      console.log(`[Organ Click] ${config.label} (${config.id})`);
    },
  },
};
