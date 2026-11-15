import rawData from './astronautsData.json';

export interface Astronaut {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bloodType: string;
  height: string;
  weight: string;
  pulse: string;
  pressure: string;
  symptoms: string[];
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

export interface MissionData {
  mission: {
    title: string;
    appName: string;
  };
  astronauts: Astronaut[];
  recentUpdates: RecentUpdate[];
}

export const missionData: MissionData = rawData as MissionData;
export const astronautsList: Astronaut[] = missionData.astronauts;
export const recentUpdatesList: RecentUpdate[] = missionData.recentUpdates;

export function getAstronautById(id: string): Astronaut | undefined {
  return astronautsList.find((a) => a.id === id);
}
