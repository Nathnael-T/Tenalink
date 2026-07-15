import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
const DEFAULT_CENTER = {
  lat: 9.03,
  lng: 38.74
};

// =====================
// LOCAL MOCK DATA
// =====================
const MOCK_HOSPITALS = [{
  id: 1,
  name: "City Hospital",
  lat: 9.02,
  lng: 38.75,
  address: "Main Street",
  wait_time: 15,
  contact: "+251911000111"
}];
const MOCK_AMBULANCES = [{
  id: 1,
  driver_name: "Abebe Kebede",
  status: "available",
  current_lat: 9.04,
  current_lng: 38.73
}];
const MOCK_PHARMACIES = [{
  id: 1,
  name: "Health Pharmacy",
  latitude: 9.031,
  longitude: 38.742,
  address: "Bole Road",
  phone_number: "+251900000000",
  delivery_available: true
}];
const MOCK_CLINICS = [{
  id: 1,
  name: "Downtown Clinic",
  lat: 9.035,
  lng: 38.74,
  formatted: "Near central area"
}];

// =====================
// DEFAULT MAP CENTERING
// =====================
function FocusMap({
  hospitals,
  ambulances,
  pharmacies,
  clinics,
  selectedLocation
}) {
  const map = useMap();
  useEffect(() => {
    const points = [...hospitals.map(h => ({
      lat: h.lat,
      lng: h.lng
    })), ...ambulances.map(a => ({
      lat: a.current_lat,
      lng: a.current_lng
    })), ...pharmacies.map(p => ({
      lat: p.latitude,
      lng: p.longitude
    })), ...clinics.map(c => ({
      lat: c.lat,
      lng: c.lng
    }))].filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng) && Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180);
    if (selectedLocation) {
      if (points.length === 0) {
        map.setView([selectedLocation.lat, selectedLocation.lng], 14);
        return;
      }
      const bounds = L.latLngBounds([[selectedLocation.lat, selectedLocation.lng], ...points.map(p => [p.lat, p.lng])]);
      map.fitBounds(bounds, {
        padding: [48, 48]
      });
      return;
    }
    if (points.length === 0) {
      map.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 12);
      return;
    }
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, {
      padding: [48, 48]
    });
  }, [hospitals, ambulances, pharmacies, clinics, selectedLocation, map]);
  return null;
}

// =====================
// MAIN MAP PAGE
// =====================
export function MapPage() {
  const location = useLocation();
  const [hospitals] = useState(MOCK_HOSPITALS);
  const [ambulances] = useState(MOCK_AMBULANCES);
  const [pharmacies] = useState(MOCK_PHARMACIES);
  const [clinics] = useState(MOCK_CLINICS);
  const [isLoading] = useState(false);
  const selectedLocation = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const lat = Number(params.get('lat'));
    const lng = Number(params.get('lng'));
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return {
        lat,
        lng
      };
    }
    return null;
  }, [location.search]);
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><p className="text-neutral-600">Loading map data...</p></div>;
  }
  return <div><div className="rounded-bento border border-neutral-200 bg-white overflow-hidden"><div className="p-6"><div className="rounded-2xl overflow-hidden border border-neutral-200" style={{
          minHeight: '480px'
        }}><MapContainer center={[selectedLocation?.lat ?? DEFAULT_CENTER.lat, selectedLocation?.lng ?? DEFAULT_CENTER.lng]} zoom={selectedLocation ? 14 : 12} scrollWheelZoom className="h-[480px] w-full"><TileLayer attribution="© OpenStreetMap contributors" url={tileUrl} /><FocusMap hospitals={hospitals} ambulances={ambulances} pharmacies={pharmacies} clinics={clinics} selectedLocation={selectedLocation} />{
            // HOSPITALS
            hospitals.map(h => <CircleMarker center={[h.lat, h.lng]} radius={9} pathOptions={{
              color: '#166534',
              fillColor: '#22C55E',
              fillOpacity: 0.85,
              weight: 2
            }} key={h.id}><Popup><div className="space-y-1"><p className="font-semibold">{h.name}</p><p>{h.address}</p><p>Wait time: {h.wait_time} mins</p><p>{h.contact}</p></div></Popup></CircleMarker>)}{
            // PHARMACIES
            pharmacies.map(p => <CircleMarker center={[p.latitude, p.longitude]} radius={8} pathOptions={{
              color: '#7E22CE',
              fillColor: '#C084FC',
              fillOpacity: 0.85,
              weight: 2
            }} key={p.id}><Popup><div><p className="font-semibold">{p.name}</p><p>{p.address}</p><p>{p.delivery_available ? "Delivery Available" : "No Delivery"}</p></div></Popup></CircleMarker>)}{
            // AMBULANCES
            ambulances.map(a => <CircleMarker center={[a.current_lat, a.current_lng]} radius={8} pathOptions={{
              color: a.status === 'available' ? '#9A3412' : '#991B1B',
              fillColor: a.status === 'available' ? '#FB923C' : '#EF4444',
              fillOpacity: 0.85,
              weight: 2
            }} key={a.id}><Popup><div><p className="font-semibold">{a.driver_name}</p><p>{`Status: ${a.status}`}</p><p>{`${a.current_lat.toFixed(5)}, ${a.current_lng.toFixed(5)}`}</p></div></Popup></CircleMarker>)}{
            // CLINICS
            clinics.map(c => <CircleMarker center={[c.lat, c.lng]} radius={8} pathOptions={{
              color: '#7C2D12',
              fillColor: '#F97316',
              fillOpacity: 0.85,
              weight: 2
            }} key={c.id}><Popup><div><p className="font-semibold">{c.name}</p><p>{c.formatted}</p></div></Popup></CircleMarker>)}</MapContainer></div></div></div></div>;
}
