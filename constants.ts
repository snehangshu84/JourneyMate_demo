import { Coordinates, POI, PoiType, RouteData } from './types';

// Route: Dallas -> Austin (Roughly along I-35)
export const DALLAS_COORDS: Coordinates = { lat: 32.7767, lng: -96.7970 };
export const AUSTIN_COORDS: Coordinates = { lat: 30.2672, lng: -97.7431 };

// Simplified Waypoints for visualization
export const ROUTE_DATA: RouteData = {
  origin: DALLAS_COORDS,
  destination: AUSTIN_COORDS,
  waypoints: [
    { lat: 32.7767, lng: -96.7970 }, // Dallas
    { lat: 32.5925, lng: -96.9048 }, // DeSoto area
    { lat: 32.3860, lng: -96.8539 }, // Waxahachie
    { lat: 32.1287, lng: -97.0869 }, // Hillsboro
    { lat: 31.7580, lng: -97.1130 }, // West
    { lat: 31.5493, lng: -97.1467 }, // Waco
    { lat: 31.0982, lng: -97.3428 }, // Temple
    { lat: 30.5083, lng: -97.6789 }, // Round Rock
    { lat: 30.2672, lng: -97.7431 }, // Austin
  ]
};

// Mock Database of POIs
export const MOCK_POIS: POI[] = [
  {
    id: '1',
    name: 'Czech Stop',
    type: PoiType.RESTAURANT,
    location: { lat: 31.8042, lng: -97.0924 },
    description: 'Famous for kolaches in West, TX.'
  },
  {
    id: '2',
    name: 'Magnolia Market',
    type: PoiType.SCENIC,
    location: { lat: 31.5583, lng: -97.1258 },
    description: 'Home and garden market in Waco.'
  },
  {
    id: '3',
    name: 'Buc-ee\'s Temple',
    type: PoiType.GAS,
    location: { lat: 31.1442, lng: -97.3884 },
    description: 'Massive gas station and travel center.'
  },
  {
    id: '4',
    name: 'Inner Space Cavern',
    type: PoiType.SCENIC,
    location: { lat: 30.6690, lng: -97.6836 },
    description: 'Karst cave in Georgetown.'
  },
  {
    id: '5',
    name: 'Reunion Tower',
    type: PoiType.SCENIC,
    location: { lat: 32.7755, lng: -96.8089 },
    description: 'Observation deck in Dallas.'
  },
  {
    id: '6',
    name: 'Texas State Capitol',
    type: PoiType.SCENIC,
    location: { lat: 30.2747, lng: -97.7404 },
    description: 'Capitol building in Austin.'
  }
];