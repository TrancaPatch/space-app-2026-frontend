import { io, Socket } from 'socket.io-client';
import type { AnatomicalSystem } from './astronautsService';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000/telemetry';

export interface PartUpdatedPayload {
  astronautId: string;
  system?: AnatomicalSystem;
  partId: string;
  status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  displayColor: string;
  reason?: string;
  painLevel?: number;
  primaryCondition?: string;
  activeAlert?: boolean;
  lastVitals?: {
    perfusionRatio?: number;
    localTempC?: number;
  };
  timestamp?: string;
}

export interface AlertTriggeredPayload {
  alertId: string;
  system?: AnatomicalSystem;
  severity: string;
  affectedParts: string[];
  title: string;
  description: string;
  timestamp: string;
}

class TelemetrySocketClient {
  private socket: Socket | null = null;
  private currentAstronautId: string | null = null;
  private partUpdatedListeners: Set<(payload: PartUpdatedPayload) => void> = new Set();
  private alertListeners: Set<(payload: AlertTriggeredPayload) => void> = new Set();

  connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1500,
      });

      this.socket.on('connect', () => {
        console.log('🛰️ [WebSocket] Conectado al namespace de telemetría:', this.socket?.id);
        if (this.currentAstronautId) {
          this.subscribe(this.currentAstronautId);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.warn('⚠️ [WebSocket] Desconectado del namespace de telemetría:', reason);
      });

      this.socket.on('part_updated', (data: PartUpdatedPayload) => {
        console.debug('📡 [WebSocket:part_updated]', data);
        this.partUpdatedListeners.forEach((listener) => {
          try {
            listener(data);
          } catch (e) {
            console.error('Error in part_updated listener:', e);
          }
        });
      });

      this.socket.on('alert_triggered', (data: AlertTriggeredPayload) => {
        console.warn('🚨 [WebSocket:alert_triggered]', data);
        this.alertListeners.forEach((listener) => {
          try {
            listener(data);
          } catch (e) {
            console.error('Error in alert_triggered listener:', e);
          }
        });
      });
    }

    return this.socket;
  }

  subscribe(astronautId: string): void {
    this.connect();
    if (this.currentAstronautId && this.currentAstronautId !== astronautId) {
      this.socket?.emit('unsubscribe_astronaut', { astronautId: this.currentAstronautId });
    }
    this.currentAstronautId = astronautId;
    this.socket?.emit('subscribe_astronaut', { astronautId });
    console.log(`📡 [WebSocket] Suscrito a sala de astronauta #${astronautId}`);
  }

  unsubscribe(astronautId?: string): void {
    const target = astronautId || this.currentAstronautId;
    if (target && this.socket?.connected) {
      this.socket.emit('unsubscribe_astronaut', { astronautId: target });
      if (this.currentAstronautId === target) {
        this.currentAstronautId = null;
      }
    }
  }

  onPartUpdated(callback: (payload: PartUpdatedPayload) => void): () => void {
    this.partUpdatedListeners.add(callback);
    return () => {
      this.partUpdatedListeners.delete(callback);
    };
  }

  onAlert(callback: (payload: AlertTriggeredPayload) => void): () => void {
    this.alertListeners.add(callback);
    return () => {
      this.alertListeners.delete(callback);
    };
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentAstronautId = null;
    }
  }
}

export const telemetrySocket = new TelemetrySocketClient();
export default telemetrySocket;
