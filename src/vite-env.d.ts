import React from 'react';
import type { ModelViewerElement } from '@google/model-viewer';

// Solución universal para React moderno (Vite + React 18/19)
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<ModelViewerElement> & {
          src?: string;
          alt?: string;
          'camera-controls'?: boolean | string;
          'disable-zoom'?: boolean | string;
          'disable-tap'?: boolean | string;
          'auto-rotate'?: boolean | string;
          'interpolation-decay'?: number | string;
          'camera-orbit'?: string;
          'camera-target'?: string;
          'field-of-view'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'touch-action'?: string;
          'shadow-intensity'?: string | number;
          'environment-image'?: string;
          'ar'?: boolean | string;
        },
        ModelViewerElement
      >;
    }
  }
}
