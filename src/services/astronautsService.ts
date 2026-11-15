import { apiClient } from './apiClient';

export type AnatomicalSystem = 'body' | 'skeleton' | 'cardiovascular' | 'nervous' | 'organs';

export interface Mission {
  id: string;
  code: string;
  name: string;
  title?: string;
  appName?: string;
  environment: string;
  status: string;
  launchDate: string;
  estimatedEndDate: string;
  crewIds: string[];
}

export interface Astronaut {
  id: string;
  missionId: string;
  fullName: string;
  name?: string;
  callsign: string;
  role: string;
  avatar: string;
  bloodType: string;
  height?: string;
  weight?: string;
  pulse?: string;
  pressure?: string;
  symptoms?: string[];
  overallHealthStatus: 'NOMINAL' | 'MONITORING' | 'CRITICAL';
}

export interface RecentUpdate {
  id: string;
  date: string;
  crewMember: string;
  astronautId: string;
  notification: string;
  status: string;
  pulse: string;
  pressure: string;
}

export interface AnatomicalPartState {
  partId: string;
  label: string;
  system: AnatomicalSystem;
  region: string;
  healthStatus: 'NOMINAL' | 'WARNING' | 'CRITICAL';
  displayColor: string;
  primaryCondition: string;
  painLevel: number;
  lastVitals: {
    perfusionRatio?: number;
    localTempC?: number;
  };
  activeAlert: boolean;
  lastEvaluatedAt: string;
}

export interface SystemProjection {
  id: string;
  astronautId: string;
  system: AnatomicalSystem;
  updatedAt: string;
  parts: Record<string, AnatomicalPartState>;
}

export interface SystemOverviewItem {
  system: AnatomicalSystem;
  name: string;
  defaultColor: string;
  totalParts: number;
  alertCount: number;
  hasAlerts: boolean;
  updatedAt: string;
}

export const astronautsService = {
  /**
   * Obtiene la misión activa
   */
  async getMission(): Promise<Mission> {
    const missions = await apiClient.get<Mission[]>('/missions');
    return missions[0];
  },

  /**
   * Obtiene la lista de tripulantes de la misión
   */
  async getAstronauts(): Promise<Astronaut[]> {
    return apiClient.get<Astronaut[]>('/astronauts');
  },

  /**
   * Obtiene la ficha de un astronauta por su ID
   */
  async getAstronautById(id: string): Promise<Astronaut> {
    return apiClient.get<Astronaut>(`/astronauts/${id}`);
  },

  /**
   * Obtiene las actualizaciones recientes
   */
  async getRecentUpdates(): Promise<RecentUpdate[]> {
    return apiClient.get<RecentUpdate[]>('/missions/recent-updates');
  },

  /**
   * Obtiene el resumen de los 5 sistemas anatómicos para un astronauta
   */
  async getSystemsOverview(astronautId: string): Promise<SystemOverviewItem[]> {
    return apiClient.get<SystemOverviewItem[]>(`/astronauts/${astronautId}/systems`);
  },

  /**
   * Obtiene la proyección completa de un sistema anatómico (body, skeleton, cardiovascular, nervous, organs)
   */
  async getSystemProjection(
    astronautId: string,
    system: AnatomicalSystem,
  ): Promise<SystemProjection> {
    return apiClient.get<SystemProjection>(`/astronauts/${astronautId}/systems/${system}`);
  },

  /**
   * Obtiene el detalle clínico de una parte específica
   */
  async getPartDetail(
    astronautId: string,
    system: AnatomicalSystem,
    partId: string,
  ): Promise<{ part: AnatomicalPartState; systemMetadata: any; recentEvents: any[] }> {
    return apiClient.get(`/astronauts/${astronautId}/systems/${system}/${partId}`);
  },

  /**
   * Actualiza el estado clínico y color 3D de una parte
   */
  async updatePartStatus(
    astronautId: string,
    system: AnatomicalSystem,
    partId: string,
    data: {
      status: 'NOMINAL' | 'WARNING' | 'CRITICAL';
      displayColor?: string;
      reason?: string;
      painLevel?: number;
    },
  ): Promise<AnatomicalPartState> {
    return apiClient.patch<AnatomicalPartState>(
      `/astronauts/${astronautId}/systems/${system}/${partId}`,
      data,
    );
  },
};

export default astronautsService;
