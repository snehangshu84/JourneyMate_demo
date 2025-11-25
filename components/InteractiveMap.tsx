import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Coordinates, POI, RouteData } from '../types';
import { ROUTE_DATA } from '../constants';

// Fix for default marker icons in React Leaflet
const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const carIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png", // Simple car placeholder
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Component to update map center when location changes
const MapUpdater: React.FC<{ center: Coordinates }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
};

// Component to handle map clicks for teleportation
const MapClickHandler: React.FC<{ onMapClick: (coords: Coordinates) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
};

interface InteractiveMapProps {
  currentLocation: Coordinates;
  pois: POI[];
  onTeleport: (coords: Coordinates) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ currentLocation, pois, onTeleport }) => {
  const polylinePositions = ROUTE_DATA.waypoints.map(p => [p.lat, p.lng] as [number, number]);

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[currentLocation.lat, currentLocation.lng]} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={currentLocation} />
        <MapClickHandler onMapClick={onTeleport} />

        {/* The Route Line */}
        <Polyline positions={polylinePositions} color="blue" weight={4} opacity={0.7} />

        {/* Current User Location */}
        <Marker position={[currentLocation.lat, currentLocation.lng]} icon={carIcon} zIndexOffset={1000}>
          <Popup>You are here</Popup>
        </Marker>

        {/* POI Markers */}
        {pois.map(poi => (
          <Marker 
            key={poi.id} 
            position={[poi.location.lat, poi.location.lng]} 
            icon={markerIcon}
          >
            <Popup>
              <div className="font-sans">
                <strong className="block text-lg">{poi.name}</strong>
                <span className="text-xs font-bold text-gray-500 uppercase">{poi.type}</span>
                <p className="text-sm mt-1">{poi.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;