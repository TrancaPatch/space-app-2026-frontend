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
  SKELETON_HIGHLIGHT_COLOR,
  type SkeletonPartConfig,
  type SkeletonPartId,
} from './skeletonPartsConfig';
import {
  CARDIOVASCULAR_PARTS_CONFIG,
  DEFAULT_CARDIOVASCULAR_VIEW,
  CARDIOVASCULAR_BASE_COLOR,
  CARDIOVASCULAR_HIGHLIGHT_COLOR,
  type CardiovascularPartConfig,
  type CardiovascularPartId,
} from './cardiovascularPartsConfig';
import {
  NERVOUS_PARTS_CONFIG,
  DEFAULT_NERVOUS_VIEW,
  NERVOUS_BASE_COLOR,
  NERVOUS_HIGHLIGHT_COLOR,
  type NervousPartConfig,
  type NervousPartId,
} from './nervousPartsConfig';
import {
  ORGANS_PARTS_CONFIG,
  DEFAULT_ORGANS_VIEW,
  ORGANS_BASE_COLOR,
  ORGANS_HIGHLIGHT_COLOR,
  type OrganPartConfig,
  type OrganPartId,
} from './organsPartsConfig';
import '../styles/BodyModelViewer.css';

/**
 * Modelos disponibles en el visor
 */
export type ModelMode = 'cuerpo-holografico' | 'esqueleto' | 'cardiovascular' | 'nervioso' | 'organos';

/**
 * Estilos holográficos refinados: Volumétricos, mayor densidad/opacidad y uniones interiores ocultas
 */
const HOLOGRAPHIC_STYLES = {
  // Estado nominal: Transparencia reducida (62% opacidad base) para ocultar uniones internas
  nominal: {
    rimColor: [0.0, 0.95, 1.0] as [number, number, number],
    rimPower: 2.2,
    rimIntensity: 3.6,
    baseAlpha: 0.62, // Opacidad aumentada: bloquea la visión de geometrías internas
    coreTint: 0.08,  // Núcleo azul espacial denso y uniforme
  },
  // Estado seleccionado: Dorado Neón de alta energía (destaca la parte seleccionada)
  selected: {
    rimColor: [1.0, 0.90, 0.12] as [number, number, number],
    rimPower: 1.7,
    rimIntensity: 4.8,
    baseAlpha: 0.75,
    coreTint: 0.22,
  },
  // Estado crítico / alerta: Rojo Neón pulsante para emergencias biomédicas
  critical: {
    rimColor: [1.0, 0.10, 0.20] as [number, number, number],
    rimPower: 1.6,
    rimIntensity: 5.2,
    baseAlpha: 0.78,
    coreTint: 0.24,
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
 * Inyecta el shader de holograma puro estático (sin cálculos dinámicos de descarte)
 * Las uniones de corte articulares están resueltas estáticamente en la geometría del modelo 3D.
 */
function applyHologramShader(
  modelViewerMaterial: any,
  partId: BodyPartId,
  style: typeof HOLOGRAPHIC_STYLES.nominal,
) {
  const threeMats = getThreeMaterials(modelViewerMaterial);

  for (const mat of threeMats) {
    if (!mat) continue;

    mat.transparent = true;
    mat.depthWrite = true; // La pared frontal escribe profundidad y ocluye las uniones internas
    mat.side = 0; // THREE.FrontSide
    mat.customProgramCacheKey = () => `holo_${partId}`;

    if (mat.userData?.shader) {
      // Ya compilado: actualizar uniforms dinámicos en tiempo real
      const u = mat.userData.shader.uniforms;
      if (u.uRimColor) u.uRimColor.value = style.rimColor;
      if (u.uRimPower) u.uRimPower.value = style.rimPower;
      if (u.uRimIntensity) u.uRimIntensity.value = style.rimIntensity;
      if (u.uBaseAlpha) u.uBaseAlpha.value = style.baseAlpha;
      if (u.uCoreTint) u.uCoreTint.value = style.coreTint;
    } else {
      // Primera vez: compilar shader de holograma estático puro
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

          // 1. Normales y vector de vista en espacio de cámara
          vec3 nNormal = normalize(vNormal);
          vec3 nViewDir = normalize(vViewPosition);

          // 2. Fresnel exterior angular puro: 100% estático y suave en rotación 360°
          float rawRim = 1.0 - abs(dot(nNormal, nViewDir));
          float fresnel = pow(clamp(rawRim, 0.0, 1.0), uRimPower);

          // 3. Núcleo etéreo sin aspecto de goma opaca
          vec3 coreColor = uRimColor * uCoreTint;

          // 4. Micro-escaneo digital de holograma
          float scanline = 0.94 + 0.06 * sin(gl_FragCoord.y * 1.5);

          // 5. Composición final de luz pura
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

export function BodyModelViewer({ astronautId: _astronautId = '1' }: BodyModelViewerProps = {}) {
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

  // Estados de preparación para evitar parpadeo o renderizado de material sin compilar
  const [isHoloReady, setIsHoloReady] = useState(false);
  const [isSkeletonReady, setIsSkeletonReady] = useState(false);
  const [isCardioReady, setIsCardioReady] = useState(false);
  const [isNervousReady, setIsNervousReady] = useState(false);
  const [isOrgansReady, setIsOrgansReady] = useState(false);

  // ============================================================================
  // LÓGICA DEL CUERPO HOLOGRÁFICO (100% INTACTA)
  // ============================================================================

  /**
   * Pinta una parte específica en estilo holográfico (Cian, Amarillo, Rojo o Color personalizado)
   */
  const paintBodyPart = useCallback((
    partId: BodyPartId,
    mode: 'nominal' | 'selected' | 'critical' | RGBA = 'nominal',
  ) => {
    const model = bodyViewerRef.current?.model;
    if (!model) return;

    const material = model.getMaterialByName(partId);
    if (!material) return;

    if (mode === 'selected') {
      applyHologramShader(material, partId, HOLOGRAPHIC_STYLES.selected);
    } else if (mode === 'critical') {
      applyHologramShader(material, partId, HOLOGRAPHIC_STYLES.critical);
    } else if (mode === 'nominal') {
      applyHologramShader(material, partId, HOLOGRAPHIC_STYLES.nominal);
    } else {
      // Color RGBA personalizado
      const rgb: [number, number, number] = [mode[0], mode[1], mode[2]];
      applyHologramShader(material, partId, {
        rimColor: rgb,
        rimPower: 2.0,
        rimIntensity: 4.5,
        baseAlpha: 0.40,
        coreTint: 0.20,
      });
    }
  }, []);

  /**
   * Aplica el holograma cian uniforme en reposo a las 49 partes del cuerpo
   */
  const applyHolographicRestingState = useCallback(() => {
    (Object.keys(BODY_PARTS_CONFIG) as BodyPartId[]).forEach((partId) => {
      paintBodyPart(partId, 'nominal');
    });
  }, [paintBodyPart]);

  // ============================================================================
  // LÓGICA DEL ESQUELETO (COLOR HUESO EN REPOSO Y AMARILLO AL SELECCIONAR)
  // ============================================================================

  /**
   * Aplica el color hueso natural (#EFECE6) en reposo a todos los huesos del esqueleto
   */
  const applySkeletonRestingState = useCallback(() => {
    const model = skeletonViewerRef.current?.model;
    if (!model) return;
    const boneRgba: RGBA = hexToRgba(SKELETON_BONE_COLOR);
    model.materials.forEach((mat) => {
      mat.pbrMetallicRoughness.setBaseColorFactor(boneRgba);
    });
  }, []);

  /**
   * Pinta un hueso específico (por defecto amarillo dorado #FFD700)
   */
  const paintSkeletonBone = useCallback((
    boneId: SkeletonPartId,
    colorHexOrRgba: string | RGBA = SKELETON_HIGHLIGHT_COLOR,
  ) => {
    const model = skeletonViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(boneId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  // ============================================================================
  // LÓGICA DEL SISTEMA CARDIOVASCULAR (COLOR CARMESÍ EN REPOSO Y AMARILLO AL SELECCIONAR)
  // ============================================================================

  /**
   * Aplica el color carmesí vascular (#C62828) en reposo a todos los vasos y corazón
   */
  const applyCardiovascularRestingState = useCallback(() => {
    const model = cardioViewerRef.current?.model;
    if (!model) return;
    const cardioRgba: RGBA = hexToRgba(CARDIOVASCULAR_BASE_COLOR);
    model.materials.forEach((mat) => {
      mat.pbrMetallicRoughness.setBaseColorFactor(cardioRgba);
    });
  }, []);

  /**
   * Pinta un vaso o estructura vascular específica (por defecto amarillo dorado #FFD700)
   */
  const paintCardiovascularPart = useCallback((
    partId: CardiovascularPartId,
    colorHexOrRgba: string | RGBA = CARDIOVASCULAR_HIGHLIGHT_COLOR,
  ) => {
    const model = cardioViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(partId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  // ============================================================================
  // LÓGICA DEL SISTEMA NERVIOSO (COLOR VIOLETA EN REPOSO Y AMARILLO AL SELECCIONAR)
  // ============================================================================

  /**
   * Aplica el color violeta neural (#9C27B0) en reposo a todas las estructuras del sistema nervioso
   */
  const applyNervousRestingState = useCallback(() => {
    const model = nervousViewerRef.current?.model;
    if (!model) return;
    const nervousRgba: RGBA = hexToRgba(NERVOUS_BASE_COLOR);
    model.materials.forEach((mat) => {
      mat.pbrMetallicRoughness.setBaseColorFactor(nervousRgba);
    });
  }, []);

  /**
   * Pinta una estructura neural específica (por defecto amarillo dorado #FFD700)
   */
  const paintNervousPart = useCallback((
    partId: NervousPartId,
    colorHexOrRgba: string | RGBA = NERVOUS_HIGHLIGHT_COLOR,
  ) => {
    const model = nervousViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(partId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  // ============================================================================
  // LÓGICA DE LOS ÓRGANOS INTERNOS (COLOR TERRACOTA EN REPOSO Y AMARILLO AL SELECCIONAR)
  // ============================================================================

  /**
   * Aplica el color terracota/ámbar (#E65100) en reposo a todos los órganos internos
   */
  const applyOrgansRestingState = useCallback(() => {
    const model = organsViewerRef.current?.model;
    if (!model) return;
    const organsRgba: RGBA = hexToRgba(ORGANS_BASE_COLOR);
    model.materials.forEach((mat) => {
      mat.pbrMetallicRoughness.setBaseColorFactor(organsRgba);
    });
  }, []);

  /**
   * Pinta un órgano específico (por defecto amarillo dorado #FFD700)
   */
  const paintOrganPart = useCallback((
    partId: OrganPartId,
    colorHexOrRgba: string | RGBA = ORGANS_HIGHLIGHT_COLOR,
  ) => {
    const model = organsViewerRef.current?.model;
    if (!model) return;
    const mat = model.getMaterialByName(partId);
    if (!mat) return;
    const rgba: RGBA = typeof colorHexOrRgba === 'string' ? hexToRgba(colorHexOrRgba) : colorHexOrRgba;
    mat.pbrMetallicRoughness.setBaseColorFactor(rgba);
  }, []);

  // ============================================================================
  // RESTABLECER CÁMARA SEGÚN EL MODELO ACTIVO
  // ============================================================================

  /**
   * Restablece la cámara a la vista general correspondiente y restaura el estado en reposo
   */
  const resetCamera = useCallback(() => {
    if (selectedModel === 'cuerpo-holografico') {
      const viewer = bodyViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_FULL_BODY_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_FULL_BODY_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_FULL_BODY_VIEW.fieldOfView;
      applyHolographicRestingState();
      setSelectedPart(null);
    } else if (selectedModel === 'esqueleto') {
      const viewer = skeletonViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_SKELETON_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_SKELETON_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_SKELETON_VIEW.fieldOfView;
      applySkeletonRestingState();
      setSelectedSkeletonPart(null);
    } else if (selectedModel === 'cardiovascular') {
      const viewer = cardioViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_CARDIOVASCULAR_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_CARDIOVASCULAR_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_CARDIOVASCULAR_VIEW.fieldOfView;
      applyCardiovascularRestingState();
      setSelectedCardioPart(null);
    } else if (selectedModel === 'nervioso') {
      const viewer = nervousViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_NERVOUS_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_NERVOUS_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_NERVOUS_VIEW.fieldOfView;
      applyNervousRestingState();
      setSelectedNervousPart(null);
    } else if (selectedModel === 'organos') {
      const viewer = organsViewerRef.current;
      if (!viewer) return;
      viewer.cameraTarget = DEFAULT_ORGANS_VIEW.cameraTarget;
      viewer.cameraOrbit = DEFAULT_ORGANS_VIEW.cameraOrbit;
      viewer.fieldOfView = DEFAULT_ORGANS_VIEW.fieldOfView;
      applyOrgansRestingState();
      setSelectedOrganPart(null);
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
  };

  // ============================================================================
  // EVENTOS Y CICLO DE VIDA: CUERPO HOLOGRÁFICO
  // ============================================================================
  useEffect(() => {
    const viewer = bodyViewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      applyHolographicRestingState();
      // Esperar a que Three.js compile los shaders y renderice el frame holográfico antes de mostrarlo
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsHoloReady(true);
        });
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!viewer.model) return;

      // 1. Restaurar el estado de holograma en reposo
      applyHolographicRestingState();

      // 2. Detectar qué parte del cuerpo fue tocada mediante raycast
      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as BodyPartId;
      const partConfig = BODY_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedPart(null);
        return;
      }

      // 3. Resaltar la parte seleccionada en Dorado Holográfico
      paintBodyPart(partId, 'selected');
      setSelectedPart(partConfig);

      // 4. Enfocar automáticamente la cámara hacia la parte del cuerpo seleccionada
      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) {
        viewer.cameraOrbit = partConfig.cameraOrbit;
      }
      if (partConfig.fieldOfView) {
        viewer.fieldOfView = partConfig.fieldOfView;
      }

      // 5. Ejecutar la acción personalizada configurada para esta parte
      partConfig.onClick({
        id: partId,
        config: partConfig,
        setPartColor: (customColor) => {
          const rgba = typeof customColor === 'string' ? hexToRgba(customColor) : customColor;
          paintBodyPart(partId, rgba);
        },
      });
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) {
      handleLoad();
    }

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyHolographicRestingState, paintBodyPart, resetCamera]);

  // ============================================================================
  // EVENTOS Y CICLO DE VIDA: ESQUELETO
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

      // 1. Restaurar color hueso a todos los huesos
      applySkeletonRestingState();

      // 2. Detectar qué hueso fue tocado mediante raycast
      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const boneId = material.name as SkeletonPartId;
      const boneConfig = SKELETON_PARTS_CONFIG[boneId];
      if (!boneConfig) {
        setSelectedSkeletonPart(null);
        return;
      }

      // 3. Resaltar el hueso seleccionado en Amarillo
      paintSkeletonBone(boneId, SKELETON_HIGHLIGHT_COLOR);
      setSelectedSkeletonPart(boneConfig);

      // 4. Enfocar automáticamente la cámara hacia el hueso seleccionado
      viewer.cameraTarget = boneConfig.cameraTarget;
      if (boneConfig.cameraOrbit) {
        viewer.cameraOrbit = boneConfig.cameraOrbit;
      }
      if (boneConfig.fieldOfView) {
        viewer.fieldOfView = boneConfig.fieldOfView;
      }

      // 5. Ejecutar la acción personalizada configurada para este hueso
      boneConfig.onClick({
        id: boneId,
        config: boneConfig,
        setPartColor: (customColor) => {
          paintSkeletonBone(boneId, customColor);
        },
      });
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) {
      handleLoad();
    }

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applySkeletonRestingState, paintSkeletonBone, resetCamera]);

  // ============================================================================
  // EVENTOS Y CICLO DE VIDA: SISTEMA CARDIOVASCULAR
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

      // 1. Restaurar color carmesí a todos los vasos
      applyCardiovascularRestingState();

      // 2. Detectar qué vaso o corazón fue tocado mediante raycast
      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as CardiovascularPartId;
      const partConfig = CARDIOVASCULAR_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedCardioPart(null);
        return;
      }

      // 3. Resaltar la parte seleccionada en Amarillo
      paintCardiovascularPart(partId, CARDIOVASCULAR_HIGHLIGHT_COLOR);
      setSelectedCardioPart(partConfig);

      // 4. Enfocar automáticamente la cámara hacia la estructura seleccionada
      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) {
        viewer.cameraOrbit = partConfig.cameraOrbit;
      }
      if (partConfig.fieldOfView) {
        viewer.fieldOfView = partConfig.fieldOfView;
      }

      // 5. Ejecutar la acción personalizada configurada para este vaso
      partConfig.onClick({
        id: partId,
        config: partConfig,
        setPartColor: (customColor) => {
          paintCardiovascularPart(partId, customColor);
        },
      });
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) {
      handleLoad();
    }

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyCardiovascularRestingState, paintCardiovascularPart, resetCamera]);

  // ============================================================================
  // EVENTOS Y CICLO DE VIDA: SISTEMA NERVIOSO
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

      // 1. Restaurar color violeta a todas las partes
      applyNervousRestingState();

      // 2. Detectar qué estructura neural fue tocada mediante raycast
      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as NervousPartId;
      const partConfig = NERVOUS_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedNervousPart(null);
        return;
      }

      // 3. Resaltar la parte seleccionada en Amarillo
      paintNervousPart(partId, NERVOUS_HIGHLIGHT_COLOR);
      setSelectedNervousPart(partConfig);

      // 4. Enfocar automáticamente la cámara hacia la estructura seleccionada
      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) {
        viewer.cameraOrbit = partConfig.cameraOrbit;
      }
      if (partConfig.fieldOfView) {
        viewer.fieldOfView = partConfig.fieldOfView;
      }

      // 5. Ejecutar la acción personalizada configurada
      partConfig.onClick({
        id: partId,
        config: partConfig,
        setPartColor: (customColor) => {
          paintNervousPart(partId, customColor);
        },
      });
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) {
      handleLoad();
    }

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyNervousRestingState, paintNervousPart, resetCamera]);

  // ============================================================================
  // EVENTOS Y CICLO DE VIDA: ÓRGANOS INTERNOS
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

      // 1. Restaurar color terracota a todos los órganos
      applyOrgansRestingState();

      // 2. Detectar qué órgano fue tocado mediante raycast
      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        resetCamera();
        return;
      }

      const partId = material.name as OrganPartId;
      const partConfig = ORGANS_PARTS_CONFIG[partId];
      if (!partConfig) {
        setSelectedOrganPart(null);
        return;
      }

      // 3. Resaltar la parte seleccionada en Amarillo
      paintOrganPart(partId, ORGANS_HIGHLIGHT_COLOR);
      setSelectedOrganPart(partConfig);

      // 4. Enfocar automáticamente la cámara hacia el órgano seleccionado
      viewer.cameraTarget = partConfig.cameraTarget;
      if (partConfig.cameraOrbit) {
        viewer.cameraOrbit = partConfig.cameraOrbit;
      }
      if (partConfig.fieldOfView) {
        viewer.fieldOfView = partConfig.fieldOfView;
      }

      // 5. Ejecutar la acción personalizada configurada
      partConfig.onClick({
        id: partId,
        config: partConfig,
        setPartColor: (customColor) => {
          paintOrganPart(partId, customColor);
        },
      });
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('click', handleClick);

    if (viewer.model) {
      handleLoad();
    }

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyOrgansRestingState, paintOrganPart, resetCamera]);

  return (
    <div className="viewer-container">
      {/* Controles en la parte superior derecha: Dropdown de modelos y Botón de vista general */}
      <div className="top-right-controls">
        <select
          className="model-select-dropdown"
          value={selectedModel}
          onChange={(e) => handleModelChange(e.target.value as ModelMode)}
          aria-label="Seleccionar modelo anatómico"
        >
          <option value="cuerpo-holografico">🧍 Cuerpo Holográfico</option>
          <option value="esqueleto">💀 Esqueleto (135 Huesos)</option>
          <option value="cardiovascular">🫀 Sistema Cardiovascular (33 Vasos)</option>
          <option value="nervioso">🧠 Sistema Nervioso Central (5 Estructuras)</option>
          <option value="organos">🫁 Órganos Internos (4 Sistemas)</option>
        </select>

        <button
          type="button"
          className="reset-view-button"
          onClick={resetCamera}
          title="Restablecer vista general"
        >
          🧍 Vista General
        </button>
      </div>

      {/* Panel informativo de la parte del cuerpo holográfico seleccionada */}
      {selectedModel === 'cuerpo-holografico' && selectedPart && (
        <div className="part-info-card">
          <span className="part-info-region">{selectedPart.region}</span>
          <strong className="part-info-title">{selectedPart.label}</strong>
          <code className="part-info-id">ID: {selectedPart.id}</code>
          <span className="part-info-coords">
            Target: <code>{selectedPart.cameraTarget}</code>
          </span>
        </div>
      )}

      {/* Panel informativo del hueso seleccionado */}
      {selectedModel === 'esqueleto' && selectedSkeletonPart && (
        <div className="part-info-card">
          <span className="part-info-region">{selectedSkeletonPart.region}</span>
          <strong className="part-info-title">{selectedSkeletonPart.label}</strong>
          <code className="part-info-id">Hueso: {selectedSkeletonPart.id}</code>
          <span className="part-info-coords">
            Target: <code>{selectedSkeletonPart.cameraTarget}</code>
          </span>
        </div>
      )}

      {/* Panel informativo del sistema cardiovascular seleccionado */}
      {selectedModel === 'cardiovascular' && selectedCardioPart && (
        <div className="part-info-card">
          <span className="part-info-region">{selectedCardioPart.region}</span>
          <strong className="part-info-title">{selectedCardioPart.label}</strong>
          <code className="part-info-id">Estructura: {selectedCardioPart.id}</code>
          <span className="part-info-coords">
            Target: <code>{selectedCardioPart.cameraTarget}</code>
          </span>
        </div>
      )}

      {/* Panel informativo del sistema nervioso seleccionado */}
      {selectedModel === 'nervioso' && selectedNervousPart && (
        <div className="part-info-card">
          <span className="part-info-region">{selectedNervousPart.region}</span>
          <strong className="part-info-title">{selectedNervousPart.label}</strong>
          <code className="part-info-id">Estructura: {selectedNervousPart.id}</code>
          <p style={{ margin: '6px 0 2px', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            {selectedNervousPart.description}
          </p>
          <span className="part-info-coords">
            Target: <code>{selectedNervousPart.cameraTarget}</code>
          </span>
        </div>
      )}

      {/* Panel informativo de órganos internos seleccionado */}
      {selectedModel === 'organos' && selectedOrganPart && (
        <div className="part-info-card">
          <span className="part-info-region">{selectedOrganPart.region}</span>
          <strong className="part-info-title">{selectedOrganPart.label}</strong>
          <code className="part-info-id">Órgano: {selectedOrganPart.id}</code>
          <p style={{ margin: '6px 0 2px', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            {selectedOrganPart.description}
          </p>
          <span className="part-info-coords">
            Target: <code>{selectedOrganPart.cameraTarget}</code>
          </span>
        </div>
      )}

      {/* Visor 3D: Cuerpo Holográfico (Permanece en memoria GPU con shaders compilados para evitar recarga) */}
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