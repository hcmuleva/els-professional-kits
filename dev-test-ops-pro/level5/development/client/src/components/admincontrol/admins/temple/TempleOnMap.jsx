import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icon issue in some bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
});

const bangaloreLocations = [
  { name: "Bangalore Palace", lat: 12.9977, lng: 77.5925 },
  { name: "Lalbagh Botanical Garden", lat: 12.9507, lng: 77.5848 },
  { name: "Cubbon Park", lat: 12.9764, lng: 77.5927 },
  { name: "ISKCON Temple", lat: 13.0105, lng: 77.5510 },
  { name: "UB City Mall", lat: 12.9716, lng: 77.5946 },
  { name: "MG Road", lat: 12.9754, lng: 77.6037 },
  { name: "Bannerghatta National Park", lat: 12.8000, lng: 77.5777 },
  { name: "Vidhana Soudha", lat: 12.9791, lng: 77.5913 },
  { name: "Wonderla Amusement Park", lat: 12.8348, lng: 77.4030 },
  { name: "Bangalore Fort", lat: 12.9622, lng: 77.5763 }
];

const Templemap = () => {
  return (
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {bangaloreLocations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]}>
          <Tooltip permanent direction="top" offset={[0, -10]}>
            {location.name}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Templemap;
