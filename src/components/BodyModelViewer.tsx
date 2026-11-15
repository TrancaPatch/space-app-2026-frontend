import { useCallback, useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import type { ModelViewerElement } from '@google/model-viewer';
import type { RGBA } from '@google/model-viewer/lib/features/scene-graph/api';
import {
  BODY_PARTS_CONFIG,
  DEFAULT_FULL_BODY_VIEW,
  hexToRgba,
  type BodyPartConfig,
  type BodyPartId,
} from './bodyPartsConfig';
import {
  SKELETON_PARTS_CONFIG,
  DEFAULT_SKELETON_VIEW,
  SKELETON_BONE_COLOR,
  type SkeletonPartConfig,
  type SkeletonPartId,
} from './skeletonPartsConfig';
import {
  CARDIOVASCULAR_PARTS_CONFIG,
  DEFAULT_CARDIOVASCULAR_VIEW,
  CARDIOVASCULAR_BASE_COLOR,
  type CardiovascularPartConfig,
  type CardiovascularPartId,
} from './cardiovascularPartsConfig';
import {
  NERVOUS_PARTS_CONFIG,
  DEFAULT_NERVOUS_VIEW,
  NERVOUS_BASE_COLOR,
  type NervousPartConfig,
  type NervousPartId,
} from './nervousPartsConfig';
import {
  ORGANS_PARTS_CONFIG,
  DEFAULT_ORGANS_VIEW,
  ORGANS_BASE_COLOR,
  type OrganPartConfig,
  type OrganPartId,
} from './organsPartsConfig';
import { astronautsService } from '../services/astronautsService';
import type {
  AnatomicalPartState,
  AnatomicalSystem,
} from '../services/astronautsService';
import { telemetrySocket } from '../services/telemetrySocket';
import '../styles/BodyModelViewer.css';

/**
 * Modelos disponibles en el visor
 */
export type ModelMode = 'cuerpo-holografico' | 'esqueleto' | 'cardiovascular' | 'nervioso' | 'organos';

/**
 * Mapeo de modo de interfaz al sistema anatómico del backend
 */
export function toBackendSystem(mode: ModelMode): AnatomicalSystem {
  switch (mode) {
    case 'cuerpo-holografico':
      return 'body';
    case 'esqueleto':
      return 'skeleton';
    case 'cardiovascular':
      return 'cardiovascular';
    case 'nervioso':
      return 'nervous';
    case 'organos':
      return 'organs';
  }
}

/**
 * Paleta de colores clínicos estándar
 */
export const CLINICAL_COLORS = {
  nominalGreen: '#22C55E',
  selectedBlue: '#38BDF8',
  warningYellow: '#F59E0B',
  criticalRed: '#EF4444',
};

/**
 * Estilos holográficos para el cuerpo:
 * - Nominal: Verde Saludable (#22C55E)
 * - Selected: Azul Eléctrico al hacer click (#38BDF8)
 * - Warning: Amarillo Ámbar (#F59E0B)
 * - Critical: Rojo Alerta (#EF4444)
 */
const HOLOGRAPHIC_STYLES = {
  nominal: {
    rimColor: [0.133, 0.772, 0.369] as [number, number, number], // #22C55E
    rimPower: 2.2,
    rimIntensity: 3.8,
    baseAlpha: 0.62,
    coreTint: 0.08,
  },
  selected: {
    rimColor: [0.22, 0.741, 0.972] as [number, number, number], // #38BDF8
    rimPower: 1.7,
    rimIntensity: 5.0,
    baseAlpha: 0.75,
    coreTint: 0.20,
  },
  warning: {
    rimColor: [0.96, 0.619, 0.043] as [number, number, number], // #F59E0B
    rimPower: 1.7,
    rimIntensity: 5.0,
    baseAlpha: 0.76,
    coreTint: 0.22,
  },
  critical: {
    rimColor: [0.937, 0.267, 0.267] as [number, number, number], // #EF4444
    rimPower: 1.6,
    rimIntensity: 5.4,
    baseAlpha: 0.80,
    coreTint: 0.25,
  },
};

/**
 * Extrae los materiales MeshPhysicalMaterial de Three.js desde la fachada de model-viewer
 */
function getThreeMaterials(modelViewerMaterial: any): any[] {
  if (!modelViewerMaterial) return [];
  const symbols = [
    ...Object.getOwnPropertySymbols(modelViewerMaterial),
    ...Object.getOwnPropertySymbols(Object.getPrototypeOf(modelViewerMaterial) || {}),
  ];
  for (const sym of symbols) {
    if (sym.description === 'correlatedObjects') {
      const set = modelViewerMaterial[sym];
      if (set instanceof Set) return Array.from(set);
    }
  }
  return [];
}

/**
 * Inyecta el shader de holograma
 */
function applyHologramShader(
  modelViewerMaterial: any,
  partId: string,
  style: typeof HOLOGRAPHIC_STYLES.nominal,
) {
  const threeMats = getThreeMaterials(modelViewerMaterial);

  for (const mat of threeMats) {
    if (!mat) continue;

    mat.transparent = true;
    mat.depthWrite = true;
    mat.side = 0; // THREE.FrontSide
    mat.customProgramCacheKey = () => `holo_${partId}`;

    if (mat.userData?.shader) {
      const u = mat.userData.shader.uniforms;
      if (u.uRimColor) u.uRimColor.value = style.rimColor;
      if (u.uRimPower) u.uRimPower.value = style.rimPower;
      if (u.uRimIntensity) u.uRimIntensity.value = style.rimIntensity;
      if (u.uBaseAlpha) u.uBaseAlpha.value = style.baseAlpha;
      if (u.uCoreTint) u.uCoreTint.value = style.coreTint;
    } else {
      mat.onBeforeCompile = (shader: any) => {
        shader.uniforms.uRimColor = { value: style.rimColor };
        shader.uniforms.uRimPower = { value: style.rimPower };
        shader.uniforms.uRimIntensity = { value: style.rimIntensity };
        shader.uniforms.uBaseAlpha = { value: style.baseAlpha };
        shader.uniforms.uCoreTint = { value: style.coreTint };

        shader.fragmentShader = `
          uniform vec3 uRimColor;
          uniform float uRimPower;
          uniform float uRimIntensity;
          uniform float uBaseAlpha;
          uniform float uCoreTint;
        ` + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          `
          #include <dithering_fragment>

          vec3 nNormal = normalize(vNormal);
          vec3 nViewDir = normalize(vViewPosition);

          float rawRim = 1.0 - abs(dot(nNormal, nViewDir));
          float fresnel = pow(clamp(rawRim, 0.0, 1.0), uRimPower);

          vec3 coreColor = uRimColor * uCoreTint;
          float scanline = 0.94 + 0.06 * sin(gl_FragCoord.y * 1.5);

          vec3 holoColor = mix(coreColor, uRimColor * uRimIntensity, fresnel) * scanline;

          gl_FragColor.rgb = holoColor;
          gl_FragColor.a = clamp(uBaseAlpha + fresnel * (1.0 - uBaseAlpha), 0.0, 1.0);
          `
        );

        mat.userData = mat.userData || {};
        mat.userData.shader = shader;
      };
      mat.needsUpdate = true;
    }
  }
}

export interface BodyModelViewerProps {
  astronautId?: string;
}

export function BodyModelViewer({ astronautId = '1' }: BodyModelViewerProps) {
  const bodyViewerRef = useRef<ModelViewerElement | null>(null);
  const skeletonViewerRef = useRef<ModelViewerElement | null>(null);
  const cardioViewerRef = useRef<ModelViewerElement | null>(null);
  const nervousViewerRef = useRef<ModelViewerElement | null>(null);
  const organsViewerRef = useRef<ModelViewerElement | null>(null);

  const [selectedModel, setSelectedModel] = useState<ModelMode>('cuerpo-holografico');
  const [selectedPart, setSelectedPart] = useState<BodyPartConfig | null>(null);
  const [selectedSkeletonPart, setSelectedSkeletonPart] = useState<SkeletonPartConfig | null>(null);
  const [selectedCardioPart, setSelectedCardioPart] = useState<CardiovascularPartConfig | null>(null);
  const [selectedNervousPart, setSelectedNervousPart] = useState<NervousPartConfig | null>(null);
  const [selectedOrganPart, setSelectedOrganPart] = useState<OrganPartConfig | null>(null);

  // Datos clínicos de la base de datos para la parte seleccionada
  const [selectedClinicalData, setSelectedClinicalData] = useState<AnatomicalPartState | null>(null);

  // Proyección de partes del sistema activo en memoria
  const systemPartsRef = useRef<Record<string, AnatomicalPartState>>({});
  const [, setSystemPartsVersion] = useState<number>(0);

  // Estados de preparación de modelos para evitar parpadeos
  const [isHoloReady, setIsHoloReady] = useState(false);
  const [isSkeletonReady, setIsSkeletonReady] = useState(false);
  const [isCardioReady, setIsCardioReady] = useState(false);
  const [isNervousReady, setIsNervousReady] = useState(false);
  const [isOrgansReady, setIsOrgansReady] = useState(false);

  // ============================================================================
  // FUNCIONES DE PINTADO INDIVIDUAL POR MODELO
  // ============================================================================

  /**
   * Pinta una parte del cuerpo holográfico
   */
  const paintBodyPart = useCallback((
    partId: string,
    mode: 'nominal' | 'selected' | 'warning' | 'critical' | RGBA = 'nominal',
  ) => {
    const model = bodyViewerRef.current?.model;
    if (!model) return;

    const material = model.getMaterialByName(partId);
    if (!material) return;

    if (mode === 'selected') {
      applyHologramShader(material, partId, HOLOGRAPHIC_STYLES.selected);
    } else if (mode === 'warning') {
      applyHologramShader(material, partId, HOLOGRAPHIC_STYLES.warning);
    } else if (mode === 'critical') {
      applyHologramShader(material, partId, HOLOGRAPHIC_STYLES.critical);
    } else if (mode === 'nominal') {
      applyHologramShader(material, partId, HOLOGRAPHIC_STYLES.nominal);
    } else {
      const rgb: [number, number, number] = [mode[0], mode[1], mode[2]];
      applyHologramShader(material, partId, {
        rimColor: rgb,
        rimPower: 2.0,
        rimIntensity: 4.5,
        baseAlpha: 0.50,
        coreTint: 0.20,
      });
    }
  }, []);

  /**
   * Pinta un hueso específico
   */
  const paintSkeletonBone = useCallback((
    boneId: string,
    colorHexOrRgba: string | RGBA = CLINICAL_COLORS.selectedBlue,
  ) => {
    const model = skeletonViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(boneId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  /**
   * Pinta una estructura cardiovascular
   */
  const paintCardiovascularPart = useCallback((
    partId: string,
    colorHexOrRgba: string | RGBA = CLINICAL_COLORS.selectedBlue,
  ) => {
    const model = cardioViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(partId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  /**
   * Pinta una estructura nerviosa
   */
  const paintNervousPart = useCallback((
    partId: string,
    colorHexOrRgba: string | RGBA = CLINICAL_COLORS.selectedBlue,
  ) => {
    const model = nervousViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(partId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  /**
   * Pinta un órgano interno
   */
  const paintOrganPart = useCallback((
    partId: string,
    colorHexOrRgba: string | RGBA = CLINICAL_COLORS.selectedBlue,
  ) => {
    const model = organsViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(partId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  // ============================================================================
  // ESTADOS EN REPOSO CON COLORES DE BASE DE DATOS
  // ============================================================================

  /**
   * Aplica el estado de reposo al cuerpo holográfico teniendo en cuenta los estados de la DB
   */
  const applyHolographicRestingState = useCallback(() => {
    const partsMap = systemPartsRef.current;
    (Object.keys(BODY_PARTS_CONFIG) as BodyPartId[]).forEach((partId) => {
      const partState = partsMap[partId];
      if (partState?.healthStatus === 'CRITICAL') {
        paintBodyPart(partId, 'critical');
      } else if (partState?.healthStatus === 'WARNING' || partState?.activeAlert) {
        paintBodyPart(partId, 'warning');
      } else {
        paintBodyPart(partId, 'nominal');
      }
    });
  }, [paintBodyPart]);

  /**
   * Aplica color hueso en reposo, resaltando huesos con alertas de DB (ej. osteoporosis / pérdida ósea)
   */
  const applySkeletonRestingState = useCallback(() => {
    const model = skeletonViewerRef.current?.model;
    if (!model) return;
    const boneRgba: RGBA = hexToRgba(SKELETON_BONE_COLOR);
    const partsMap = systemPartsRef.current;

    model.materials.forEach((mat) => {
      const boneId = mat.name;
      const partState = partsMap[boneId];
      if (partState?.healthStatus === 'CRITICAL') {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(CLINICAL_COLORS.criticalRed));
      } else if (partState?.healthStatus === 'WARNING' || partState?.activeAlert) {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(partState.displayColor || CLINICAL_COLORS.warningYellow));
      } else {
        mat.pbrMetallicRoughness.setBaseColorFactor(boneRgba);
      }
    });
  }, []);

  /**
   * Aplica color carmesí en reposo, resaltando vasos con alertas
   */
  const applyCardiovascularRestingState = useCallback(() => {
    const model = cardioViewerRef.current?.model;
    if (!model) return;
    const cardioRgba: RGBA = hexToRgba(CARDIOVASCULAR_BASE_COLOR);
    const partsMap = systemPartsRef.current;

    model.materials.forEach((mat) => {
      const partId = mat.name;
      const partState = partsMap[partId];
      if (partState?.healthStatus === 'CRITICAL') {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(CLINICAL_COLORS.criticalRed));
      } else if (partState?.healthStatus === 'WARNING' || partState?.activeAlert) {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(partState.displayColor || CLINICAL_COLORS.warningYellow));
      } else {
        mat.pbrMetallicRoughness.setBaseColorFactor(cardioRgba);
      }
    });
  }, []);

  /**
   * Aplica color violeta en reposo, resaltando nervios con alertas
   */
  const applyNervousRestingState = useCallback(() => {
    const model = nervousViewerRef.current?.model;
    if (!model) return;
    const nervousRgba: RGBA = hexToRgba(NERVOUS_BASE_COLOR);
    const partsMap = systemPartsRef.current;

    model.materials.forEach((mat) => {
      const partId = mat.name;
      const partState = partsMap[partId];
      if (partState?.healthStatus === 'CRITICAL') {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(CLINICAL_COLORS.criticalRed));
      } else if (partState?.healthStatus === 'WARNING' || partState?.activeAlert) {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(partState.displayColor || CLINICAL_COLORS.warningYellow));
      } else {
        mat.pbrMetallicRoughness.setBaseColorFactor(nervousRgba);
      }
    });
  }, []);

  /**
   * Aplica color terracota en reposo, resaltando órganos con alertas (ej. pulmones con tos, estómago)
   */
  const applyOrgansRestingState = useCallback(() => {
    const model = organsViewerRef.current?.model;
    if (!model) return;
    const organsRgba: RGBA = hexToRgba(ORGANS_BASE_COLOR);
    const partsMap = systemPartsRef.current;

    model.materials.forEach((mat) => {
      const partId = mat.name;
      const partState = partsMap[partId];
      if (partState?.healthStatus === 'CRITICAL') {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(CLINICAL_COLORS.criticalRed));
      } else if (partState?.healthStatus === 'WARNING' || partState?.activeAlert) {
        mat.pbrMetallicRoughness.setBaseColorFactor(hexToRgba(partState.displayColor || CLINICAL_COLORS.warningYellow));
      } else {
        mat.pbrMetallicRoughness.setBaseColorFactor(organsRgba);
      }
    });
  }, []);

  /**
   * Re-aplica el estado en reposo según el modelo activo
   */
  const applyCurrentModelRestingState = useCallback(() => {
    if (selectedModel === 'cuerpo-holografico') applyHolographicRestingState();
    else if (selectedModel === 'esqueleto') applySkeletonRestingState();
    else if (selectedModel === 'cardiovascular') applyCardiovascularRestingState();
    else if (selectedModel === 'nervioso') applyNervousRestingState();
    else if (selectedModel === 'organos') applyOrgansRestingState();
  }, [
    selectedModel,
    applyHolographicRestingState,
    applySkeletonRestingState,
    applyCardiovascularRestingState,
    applyNervousRestingState,
    applyOrgansRestingState,
  ]);

  // ============================================================================
  // CARGA DE DATOS DE LA BASE DE DATOS Y CONEXIÓN WEBSOCKET
  // ============================================================================

  // 1. Cargar proyecciones de la base de datos cuando cambia el astronauta o el modelo
  useEffect(() => {
    let isMounted = true;
    const backendSystem = toBackendSystem(selectedModel);

    astronautsService
      .getSystemProjection(astronautId, backendSystem)
      .then((proj) => {
        if (!isMounted) return;
        systemPartsRef.current = proj.parts || {};
        setSystemPartsVersion((v) => v + 1);
        applyCurrentModelRestingState();
      })
      .catch((err) => {
        console.warn(`No se pudo cargar proyección de ${backendSystem} desde DB:`, err);
      });

    return () => {
      isMounted = false;
    };
  }, [astronautId, selectedModel, applyCurrentModelRestingState]);

  // 2. Suscribirse a WebSocket para actualizaciones en vivo
  useEffect(() => {
    telemetrySocket.subscribe(astronautId);

    const unsubscribePart = telemetrySocket.onPartUpdated((payload) => {
      if (payload.astronautId !== astronautId) return;

      const activeSystem = toBackendSystem(selectedModel);
      if (payload.system && payload.system !== activeSystem) {
        return;
      }

      // Actualizar en el mapa en memoria
      const existing = systemPartsRef.current[payload.partId] || {
        partId: payload.partId,
        label: payload.partId,
        system: payload.system || activeSystem,
        region: 'Anatomía',
        healthStatus: payload.status,
        displayColor: payload.displayColor,
        primaryCondition: payload.primaryCondition || payload.reason || 'Nominal',
        painLevel: payload.painLevel || 0,
        lastVitals: payload.lastVitals || {},
        activeAlert: payload.activeAlert ?? (payload.status !== 'NOMINAL'),
        lastEvaluatedAt: payload.timestamp || new Date().toISOString(),
      };

      const updated: AnatomicalPartState = {
        ...existing,
        healthStatus: payload.status,
        displayColor: payload.displayColor,
        primaryCondition: payload.primaryCondition || payload.reason || existing.primaryCondition,
        painLevel: payload.painLevel ?? existing.painLevel,
        activeAlert: payload.activeAlert ?? (payload.status !== 'NOMINAL'),
        lastVitals: payload.lastVitals || existing.lastVitals,
        lastEvaluatedAt: payload.timestamp || new Date().toISOString(),
      };

      systemPartsRef.current[payload.partId] = updated;
      setSystemPartsVersion((v) => v + 1);

      // Actualizar si está actualmente seleccionada en el panel
      setSelectedClinicalData((prev) => (prev?.partId === payload.partId ? updated : prev));

      // Actualizar material en el visor 3D activo
      if (activeSystem === 'body') {
        const mode = payload.status === 'CRITICAL' ? 'critical' : payload.status === 'WARNING' ? 'warning' : 'nominal';
        paintBodyPart(payload.partId, mode);
      } else if (activeSystem === 'skeleton') {
        paintSkeletonBone(payload.partId, payload.displayColor || CLINICAL_COLORS.warningYellow);
      } else if (activeSystem === 'cardiovascular') {
        paintCardiovascularPart(payload.partId, payload.displayColor || CLINICAL_COLORS.warningYellow);
      } else if (activeSystem === 'nervous') {
        paintNervousPart(payload.partId, payload.displayColor || CLINICAL_COLORS.warningYellow);
      } else if (activeSystem === 'organs') {
        paintOrganPart(payload.partId, payload.displayColor || CLINICAL_COLORS.warningYellow);
      }
    });

    return () => {
      unsubscribePart();
    };
  }, [
    astronautId,
    selectedModel,
    paintBodyPart,
    paintSkeletonBone,
    paintCardiovascularPart,
    paintNervousPart,
    paintOrganPart,
  ]);

  // ============================================================================
  // RESTABLECER CÁMARA
  // ============================================================================

  const resetCamera = useCallback(() => {
    setSelectedPart(null);
    setSelectedSkeletonPart(null);
    setSelectedCardioPart(null);
    setSelectedNervousPart(null);
    setSelectedOrganPart(null);
    setSelectedClinicalData(null);

    if (selectedModel === 'cuerpo-holografico') {
      const viewer = bodyViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_FULL_BODY_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_FULL_BODY_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_FULL_BODY_VIEW.fieldOfView;
      applyHolographicRestingState();
    } else if (selectedModel === 'esqueleto') {
      const viewer = skeletonViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_SKELETON_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_SKELETON_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_SKELETON_VIEW.fieldOfView;
      applySkeletonRestingState();
    } else if (selectedModel === 'cardiovascular') {
      const viewer = cardioViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_CARDIOVASCULAR_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_CARDIOVASCULAR_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_CARDIOVASCULAR_VIEW.fieldOfView;
      applyCardiovascularRestingState();
    } else if (selectedModel === 'nervioso') {
      const viewer = nervousViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_NERVOUS_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_NERVOUS_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_NERVOUS_VIEW.fieldOfView;
      applyNervousRestingState();
    } else if (selectedModel === 'organos') {
      const viewer = organsViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_ORGANS_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_ORGANS_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_ORGANS_VIEW.fieldOfView;
      applyOrgansRestingState();
    }
  }, [
    selectedModel,
    applyHolographicRestingState,
    applySkeletonRestingState,
    applyCardiovascularRestingState,
    applyNervousRestingState,
    applyOrgansRestingState,
  ]);

  /**
   * Cambia el modelo 3D activo desde el selector desplegable
   */
  const handleModelChange = (newModel: ModelMode) => {
    setSelectedModel(newModel);
    setSelectedPart(null);
    setSelectedSkeletonPart(null);
    setSelectedCardioPart(null);
    setSelectedNervousPart(null);
    setSelectedOrganPart(null);
    setSelectedClinicalData(null);

    // Cargar proyección del nuevo modelo de la DB
    const backendSys = toBackendSystem(newModel);
    astronautsService
      .getSystemProjection(astronautId, backendSys)
      .then((proj) => {
        systemPartsRef.current = proj.parts || {};
        setSystemPartsVersion((v) => v + 1);

        if (newModel === 'cuerpo-holografico') {
          const viewer = bodyViewerRef.current;
          if (viewer) {
            viewer.cameraTarget = DEFAULT_FULL_BODY_VIEW.cameraTarget;
            viewer.cameraOrbit = DEFAULT_FULL_BODY_VIEW.cameraOrbit;
            viewer.fieldOfView = DEFAULT_FULL_BODY_VIEW.fieldOfView;
            applyHolographicRestingState();
          }
        } else if (newModel === 'esqueleto') {
          const viewer = skeletonViewerRef.current;
          if (viewer) {
            viewer.cameraTarget = DEFAULT_SKELETON_VIEW.cameraTarget;
            viewer.cameraOrbit = DEFAULT_SKELETON_VIEW.cameraOrbit;
            viewer.fieldOfView = DEFAULT_SKELETON_VIEW.fieldOfView;
            applySkeletonRestingState();
          }
        } else if (newModel === 'cardiovascular') {
          const viewer = cardioViewerRef.current;
          if (viewer) {
            viewer.cameraTarget = DEFAULT_CARDIOVASCULAR_VIEW.cameraTarget;
            viewer.cameraOrbit = DEFAULT_CARDIOVASCULAR_VIEW.cameraOrbit;
            viewer.fieldOfView = DEFAULT_CARDIOVASCULAR_VIEW.fieldOfView;
            applyCardiovascularRestingState();
          }
        } else if (newModel === 'nervioso') {
          const viewer = nervousViewerRef.current;
          if (viewer) {
            viewer.cameraTarget = DEFAULT_NERVOUS_VIEW.cameraTarget;
            viewer.cameraOrbit = DEFAULT_NERVOUS_VIEW.cameraOrbit;
            viewer.fieldOfView = DEFAULT_NERVOUS_VIEW.fieldOfView;
            applyNervousRestingState();
          }
        } else if (newModel === 'organos') {
          const viewer = organsViewerRef.current;
          if (viewer) {
            viewer.cameraTarget = DEFAULT_ORGANS_VIEW.cameraTarget;
            viewer.cameraOrbit = DEFAULT_ORGANS_VIEW.cameraOrbit;
            viewer.fieldOfView = DEFAULT_ORGANS_VIEW.fieldOfView;
            applyOrgansRestingState();
          }
        }
      })
      .catch((err) => {
        console.warn(`Error al cambiar a modelo ${newModel}:`, err);
      });
  };

  /**
   * Helper para obtener o generar los datos clínicos de una parte
   */
  const resolveClinicalData = (
    partId: string,
    label: string,
    region: string,
    system: AnatomicalSystem,
  ): AnatomicalPartState => {
    const existing = systemPartsRef.current[partId];
    if (existing) return existing;

    return {
      partId,
      label,
      system,
      region,
      healthStatus: 'NOMINAL',
      displayColor: CLINICAL_COLORS.nominalGreen,
      primaryCondition: 'Sin anomalías registradas (Nominal)',
      painLevel: 0,
      lastVitals: { perfusionRatio: 1.0, localTempC: 36.6 },
      activeAlert: false,
      lastEvaluatedAt: new Date().toISOString(),
    };
  };

  // ============================================================================
  // EVENTOS Y CLICK HANDLERS: CUERPO HOLOGRÁFICO
  // ============================================================================
  useEffect(() => {
    const viewer = bodyViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      applyHolographicRestingState();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsHoloReady(true);
        });
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!viewer.model) return;

      // 1. Restaurar el estado en reposo
      applyHolographicRestingState();

      // 2. Raycast
      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as BodyPartId;
      const partConfig = BODY_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedPart(null);
        setSelectedClinicalData(null);
        return;
      }

      // 3. Resaltar la parte seleccionada en Azul Eléctrico (#38BDF8)
      paintBodyPart(partId, 'selected');
      setSelectedPart(partConfig);

      // 4. Obtener datos clínicos de la DB
      const clinicalData = resolveClinicalData(
        partId,
        partConfig.label,
        partConfig.region,
        'body',
      );
      setSelectedClinicalData(clinicalData);

      // 5. Enfocar cámara
      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) viewer.cameraOrbit = partConfig.cameraOrbit;
      if (partConfig.fieldOfView) viewer.fieldOfView = partConfig.fieldOfView;
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) handleLoad();

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyHolographicRestingState, paintBodyPart, resetCamera]);

  // ============================================================================
  // EVENTOS Y CLICK HANDLERS: ESQUELETO
  // ============================================================================
  useEffect(() => {
    const viewer = skeletonViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      applySkeletonRestingState();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsSkeletonReady(true);
        });
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!viewer.model) return;

      applySkeletonRestingState();

      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const boneId = material.name as SkeletonPartId;
      const boneConfig = SKELETON_PARTS_CONFIG[boneId];
      if (!boneConfig) {
        setSelectedSkeletonPart(null);
        setSelectedClinicalData(null);
        return;
      }

      // Resaltar en Azul al hacer click (#38BDF8)
      paintSkeletonBone(boneId, CLINICAL_COLORS.selectedBlue);
      setSelectedSkeletonPart(boneConfig);

      const clinicalData = resolveClinicalData(
        boneId,
        boneConfig.label,
        boneConfig.region,
        'skeleton',
      );
      setSelectedClinicalData(clinicalData);

      viewer.cameraTarget = boneConfig.cameraTarget;
      if (boneConfig.cameraOrbit) viewer.cameraOrbit = boneConfig.cameraOrbit;
      if (boneConfig.fieldOfView) viewer.fieldOfView = boneConfig.fieldOfView;
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) handleLoad();

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applySkeletonRestingState, paintSkeletonBone, resetCamera]);

  // ============================================================================
  // EVENTOS Y CLICK HANDLERS: CARDIOVASCULAR
  // ============================================================================
  useEffect(() => {
    const viewer = cardioViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      applyCardiovascularRestingState();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsCardioReady(true);
        });
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!viewer.model) return;

      applyCardiovascularRestingState();

      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as CardiovascularPartId;
      const partConfig = CARDIOVASCULAR_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedCardioPart(null);
        setSelectedClinicalData(null);
        return;
      }

      // Resaltar en Azul (#38BDF8)
      paintCardiovascularPart(partId, CLINICAL_COLORS.selectedBlue);
      setSelectedCardioPart(partConfig);

      const clinicalData = resolveClinicalData(
        partId,
        partConfig.label,
        partConfig.region,
        'cardiovascular',
      );
      setSelectedClinicalData(clinicalData);

      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) viewer.cameraOrbit = partConfig.cameraOrbit;
      if (partConfig.fieldOfView) viewer.fieldOfView = partConfig.fieldOfView;
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) handleLoad();

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyCardiovascularRestingState, paintCardiovascularPart, resetCamera]);

  // ============================================================================
  // EVENTOS Y CLICK HANDLERS: SISTEMA NERVIOSO
  // ============================================================================
  useEffect(() => {
    const viewer = nervousViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      applyNervousRestingState();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsNervousReady(true);
        });
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!viewer.model) return;

      applyNervousRestingState();

      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as NervousPartId;
      const partConfig = NERVOUS_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedNervousPart(null);
        setSelectedClinicalData(null);
        return;
      }

      // Resaltar en Azul (#38BDF8)
      paintNervousPart(partId, CLINICAL_COLORS.selectedBlue);
      setSelectedNervousPart(partConfig);

      const clinicalData = resolveClinicalData(
        partId,
        partConfig.label,
        partConfig.region,
        'nervous',
      );
      setSelectedClinicalData(clinicalData);

      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) viewer.cameraOrbit = partConfig.cameraOrbit;
      if (partConfig.fieldOfView) viewer.fieldOfView = partConfig.fieldOfView;
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) handleLoad();

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyNervousRestingState, paintNervousPart, resetCamera]);

  // ============================================================================
  // EVENTOS Y CLICK HANDLERS: ÓRGANOS INTERNOS
  // ============================================================================
  useEffect(() => {
    const viewer = organsViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      applyOrgansRestingState();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsOrgansReady(true);
        });
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!viewer.model) return;

      applyOrgansRestingState();

      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as OrganPartId;
      const partConfig = ORGANS_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedOrganPart(null);
        setSelectedClinicalData(null);
        return;
      }

      // Resaltar en Azul (#38BDF8)
      paintOrganPart(partId, CLINICAL_COLORS.selectedBlue);
      setSelectedOrganPart(partConfig);

      const clinicalData = resolveClinicalData(
        partId,
        partConfig.label,
        partConfig.region,
        'organs',
      );
      setSelectedClinicalData(clinicalData);

      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) viewer.cameraOrbit = partConfig.cameraOrbit;
      if (partConfig.fieldOfView) viewer.fieldOfView = partConfig.fieldOfView;
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) handleLoad();

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyOrgansRestingState, paintOrganPart, resetCamera]);

  // ============================================================================
  // RENDERIZADO DEL COMPONENTE
  // ============================================================================
  const activeLabel =
    selectedPart?.label ||
    selectedSkeletonPart?.label ||
    selectedCardioPart?.label ||
    selectedNervousPart?.label ||
    selectedOrganPart?.label ||
    selectedClinicalData?.label;

  const activeRegion =
    selectedPart?.region ||
    selectedSkeletonPart?.region ||
    selectedCardioPart?.region ||
    selectedNervousPart?.region ||
    selectedOrganPart?.region ||
    selectedClinicalData?.region;

  const activeTarget =
    selectedPart?.cameraTarget ||
    selectedSkeletonPart?.cameraTarget ||
    selectedCardioPart?.cameraTarget ||
    selectedNervousPart?.cameraTarget ||
    selectedOrganPart?.cameraTarget;

  return (
    <div className="viewer-container">
      {/* Controles en la parte superior derecha: Selector de sistema y Reset */}
      <div className="top-right-controls">
        <select
          className="model-select-dropdown"
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value as ModelMode)}
          aria-label="Seleccionar modelo anatómico"
        >
          <option value="cuerpo-holografico"> Cuerpo Holográfico</option>
          <option value="esqueleto">💀 Esqueleto</option>
          <option value="cardiovascular">🫀 Sistema Cardiovascular</option>
          <option value="nervioso">🧠 Sistema Nervioso Central</option>
          <option value="organos">🫁 Órganos Internos</option>
        </select>

        <button
          type="button"
          className="reset-view-button"
          onClick={resetCamera}
          title="Restablecer vista general"
        >
           Vista General
        </button>
      </div>

      {/* Panel Informativo Clínico Interactivo (Alineado con DB y tiempo real) */}
      {selectedClinicalData && (
        <div className="part-info-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="part-info-region">{activeRegion}</span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                textTransform: 'uppercase',
                background:
                  selectedClinicalData.healthStatus === 'CRITICAL'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : selectedClinicalData.healthStatus === 'WARNING' || selectedClinicalData.activeAlert
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(34, 197, 94, 0.2)',
                color:
                  selectedClinicalData.healthStatus === 'CRITICAL'
                    ? '#EF4444'
                    : selectedClinicalData.healthStatus === 'WARNING' || selectedClinicalData.activeAlert
                    ? '#F59E0B'
                    : '#22C55E',
                border: `1px solid ${
                  selectedClinicalData.healthStatus === 'CRITICAL'
                    ? 'rgba(239, 68, 68, 0.4)'
                    : selectedClinicalData.healthStatus === 'WARNING' || selectedClinicalData.activeAlert
                    ? 'rgba(245, 158, 11, 0.4)'
                    : 'rgba(34, 197, 94, 0.4)'
                }`,
              }}
            >
              {selectedClinicalData.healthStatus}
            </span>
          </div>

          <strong className="part-info-title">{activeLabel}</strong>
          <code className="part-info-id">ID: {selectedClinicalData.partId}</code>

          {/* Diagnóstico / Síntoma de la base de datos */}
          <div
            style={{
              marginTop: '6px',
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderLeft: `3px solid ${
                selectedClinicalData.healthStatus === 'CRITICAL'
                  ? '#EF4444'
                  : selectedClinicalData.healthStatus === 'WARNING' || selectedClinicalData.activeAlert
                  ? '#F59E0B'
                  : '#22C55E'
              }`,
            }}
          >
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>
              Diagnóstico / Observación
            </div>
            <div style={{ fontSize: '12px', color: '#f1f5f9', fontWeight: 500, marginTop: '2px' }}>
              {selectedClinicalData.primaryCondition || 'Nominal - Sin anomalías'}
            </div>
          </div>

          {/* Nivel de dolor si existe */}
          {selectedClinicalData.painLevel > 0 && (
            <div style={{ fontSize: '11px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Dolor (EVA):</span>
              <strong style={{ color: '#ef4444' }}>{selectedClinicalData.painLevel}/10</strong>
            </div>
          )}

          {/* Coordenadas 3D */}
          {activeTarget && (
            <span className="part-info-coords">
              Target: <code>{activeTarget}</code>
            </span>
          )}

          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
            🛰️ Sincronizado en tiempo real
          </div>
        </div>
      )}

      {/* Visor 3D: Cuerpo Holográfico */}
      <div className={`model-viewport ${selectedModel === 'cuerpo-holografico' && isHoloReady ? 'active' : ''}`}>
        <model-viewer
          ref={bodyViewerRef}
          src="/CuerpoSeparado-1.glb"
          alt="Modelo 3D del cuerpo humano interactivo"
          camera-controls
          touch-action="pan-y"
          disable-tap
          interpolation-decay={200}
          camera-orbit={DEFAULT_FULL_BODY_VIEW.cameraOrbit}
          camera-target={DEFAULT_FULL_BODY_VIEW.cameraTarget}
          field-of-view={DEFAULT_FULL_BODY_VIEW.fieldOfView}
          shadow-intensity="0"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Visor 3D: Esqueleto */}
      <div className={`model-viewport ${selectedModel === 'esqueleto' && isSkeletonReady ? 'active' : ''}`}>
        <model-viewer
          ref={skeletonViewerRef}
          src="/Esqueleto.glb"
          alt="Modelo 3D del esqueleto humano interactivo"
          camera-controls
          touch-action="pan-y"
          disable-tap
          interpolation-decay={200}
          camera-orbit={DEFAULT_SKELETON_VIEW.cameraOrbit}
          camera-target={DEFAULT_SKELETON_VIEW.cameraTarget}
          field-of-view={DEFAULT_SKELETON_VIEW.fieldOfView}
          shadow-intensity="0"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Visor 3D: Sistema Cardiovascular */}
      <div className={`model-viewport ${selectedModel === 'cardiovascular' && isCardioReady ? 'active' : ''}`}>
        <model-viewer
          ref={cardioViewerRef}
          src="/SisCardiovascular.glb"
          alt="Modelo 3D del sistema cardiovascular interactivo"
          camera-controls
          touch-action="pan-y"
          disable-tap
          interpolation-decay={200}
          camera-orbit={DEFAULT_CARDIOVASCULAR_VIEW.cameraOrbit}
          camera-target={DEFAULT_CARDIOVASCULAR_VIEW.cameraTarget}
          field-of-view={DEFAULT_CARDIOVASCULAR_VIEW.fieldOfView}
          shadow-intensity="0"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Visor 3D: Sistema Nervioso */}
      <div className={`model-viewport ${selectedModel === 'nervioso' && isNervousReady ? 'active' : ''}`}>
        <model-viewer
          ref={nervousViewerRef}
          src="/SisNervioso.glb"
          alt="Modelo 3D del sistema nervioso interactivo"
          camera-controls
          touch-action="pan-y"
          disable-tap
          interpolation-decay={200}
          camera-orbit={DEFAULT_NERVOUS_VIEW.cameraOrbit}
          camera-target={DEFAULT_NERVOUS_VIEW.cameraTarget}
          field-of-view={DEFAULT_NERVOUS_VIEW.fieldOfView}
          shadow-intensity="0"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Visor 3D: Órganos Internos */}
      <div className={`model-viewport ${selectedModel === 'organos' && isOrgansReady ? 'active' : ''}`}>
        <model-viewer
          ref={organsViewerRef}
          src="/Organos.glb"
          alt="Modelo 3D de órganos internos interactivo"
          camera-controls
          touch-action="pan-y"
          disable-tap
          interpolation-decay={200}
          camera-orbit={DEFAULT_ORGANS_VIEW.cameraOrbit}
          camera-target={DEFAULT_ORGANS_VIEW.cameraTarget}
          field-of-view={DEFAULT_ORGANS_VIEW.fieldOfView}
          shadow-intensity="0"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

export default BodyModelViewer;
