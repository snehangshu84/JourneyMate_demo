import { MOCK_POIS, ROUTE_DATA } from '../constants';
import { Coordinates, POI } from '../types';

// Utility to calculate Haversine distance in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// SIMULATED BACKEND ENDPOINT: GET /stops/route_pois
export const getRoutePois = async (): Promise<POI[]> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_POIS;
};

// SIMULATED BACKEND ENDPOINT: GET /stops/nearby?lat=...&lng=...
export const getNearbyPois = async (current: Coordinates, radiusKm = 20): Promise<POI[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_POIS.filter(poi => {
    const dist = getDistanceFromLatLonInKm(current.lat, current.lng, poi.location.lat, poi.location.lng);
    return dist <= radiusKm;
  });
};

// Helper to simulate movement along the route for the demo
export const interpolateRoute = (progress: number): Coordinates => {
  const waypoints = ROUTE_DATA.waypoints;
  const totalSegments = waypoints.length - 1;
  const segmentProgress = 1 / totalSegments;
  
  const currentSegmentIndex = Math.min(Math.floor(progress / segmentProgress), totalSegments - 1);
  const segmentPercent = (progress - (currentSegmentIndex * segmentProgress)) / segmentProgress;

  const start = waypoints[currentSegmentIndex];
  const end = waypoints[currentSegmentIndex + 1];

  return {
    lat: start.lat + (end.lat - start.lat) * segmentPercent,
    lng: start.lng + (end.lng - start.lng) * segmentPercent
  };
};