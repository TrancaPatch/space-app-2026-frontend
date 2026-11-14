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
import '../styles/BodyModelViewer.css';

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

export function BodyModelViewer() {
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const [selectedPart, setSelectedPart] = useState<BodyPartConfig | null>(null);

  /**
   * Pinta una parte específica en estilo holográfico (Cian, Amarillo, Rojo o Color personalizado)
   */
  const paintBodyPart = useCallback((
    partId: BodyPartId,
    mode: 'nominal' | 'selected' | 'critical' | RGBA = 'nominal',
  ) => {
    const model = viewerRef.current?.model;
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

  /**
   * Restablece la cámara a la vista general de cuerpo completo y restaura el holograma
   */
  const resetCamera = useCallback(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.cameraTarget = DEFAULT_FULL_BODY_VIEW.cameraTarget;
    viewer.cameraOrbit = DEFAULT_FULL_BODY_VIEW.cameraOrbit;
    viewer.fieldOfView = DEFAULT_FULL_BODY_VIEW.fieldOfView;
    applyHolographicRestingState();
    setSelectedPart(null);
  }, [applyHolographicRestingState]);

  // Manejo de carga inicial y clics en cada parte del cuerpo
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => {
      applyHolographicRestingState();
    };

    const handleClick = (event: MouseEvent) => {
      if (!viewer.model) return;

      // 1. Restaurar el estado de holograma en reposo
      applyHolographicRestingState();

      // 2. Detectar qué parte del cuerpo fue tocada mediante raycast
      const material = viewer.materialFromPoint(event.clientX, event.clientY);
      if (!material) {
        // Clic en el fondo vacío: restablece la vista general
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

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('click', handleClick);
    };
  }, [applyHolographicRestingState, paintBodyPart, resetCamera]);

  return (
    <div className="viewer-container">
      {/* Botón flotante para restablecer la vista general en cualquier momento */}
      <button
        type="button"
        className="reset-view-button"
        onClick={resetCamera}
        title="Restablecer vista a cuerpo completo"
      >
        🧍 Vista General
      </button>

      {/* Panel informativo de la parte actualmente seleccionada */}
      {selectedPart && (
        <div className="part-info-card">
          <span className="part-info-region">{selectedPart.region}</span>
          <strong className="part-info-title">{selectedPart.label}</strong>
          <code className="part-info-id">ID: {selectedPart.id}</code>
          <span className="part-info-coords">
            Target: <code>{selectedPart.cameraTarget}</code>
          </span>
        </div>
      )}

      {/* Visor 3D con interpolación suave de cámara en cada clic */}
      <model-viewer
        ref={viewerRef}
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
        //exposure="1.0"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default BodyModelViewer;
