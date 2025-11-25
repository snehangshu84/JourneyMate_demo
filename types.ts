export interface Coordinates {
  lat: number;
  lng: number;
}

export enum PoiType {
  RESTAURANT = 'RESTAURANT',
  GAS = 'GAS',
  SCENIC = 'SCENIC',
  CITY = 'CITY'
}

export interface POI {
  id: string;
  name: string;
  type: PoiType;
  location: Coordinates;
  description?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TriviaItem {
  id: string;
  fact: string;
  locationName: string;
  sources?: GroundingSource[];
}

export interface RouteData {
  origin: Coordinates;
  destination: Coordinates;
  waypoints: Coordinates[];
}

export enum Persona {
  LOCAL = 'LOCAL',
  HISTORIAN = 'HISTORIAN',
  COMEDIAN = 'COMEDIAN',
  FOODIE = 'FOODIE'
}

export interface UserPreferences {
  persona: Persona;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
}