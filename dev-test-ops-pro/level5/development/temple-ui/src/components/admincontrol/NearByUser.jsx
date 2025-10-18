import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Haversine distance function
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const NearestUsersMap = () => {
  const [sortedUsers, setSortedUsers] = useState([]);

  const currentUser = {
    id: 100,
    name: "You",
    location: { latitude: 12.9716, longitude: 77.5946 },
  };

  const users = [
    {
      id: 1,
      name: "Ravi",
      location: { latitude: 12.972, longitude: 77.593 },
      status: "available",
    },
    {
      id: 2,
      name: "Anjali",
      location: { latitude: 12.968, longitude: 77.595 },
      status: "busy",
    },
    {
      id: 3,
      name: "Amit",
      location: { latitude: 13.035, longitude: 77.597 },
      status: "available",
    },
    {
      id: 4,
      name: "Sneha",
      location: { latitude: 12.975, longitude: 77.580 },
      status: "available",
    },
    {
      id: 5,
      name: "Farhan",
      location: { latitude: 12.961, longitude: 77.610 },
      status: "available",
    },
  ];

  useEffect(() => {
    const availableUsers = users.filter((u) => u.status === "available");

    const withDistance = availableUsers.map((u) => ({
      ...u,
      distance: getDistance(
        currentUser.location.latitude,
        currentUser.location.longitude,
        u.location.latitude,
        u.location.longitude
      ),
    }));

    withDistance.sort((a, b) => a.distance - b.distance);

    setSortedUsers(withDistance);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer
        center={[currentUser.location.latitude, currentUser.location.longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current User Marker */}
        <Marker
          position={[
            currentUser.location.latitude,
            currentUser.location.longitude,
          ]}
        >
          <Popup>You (Current Location)</Popup>
        </Marker>

        {/* Other Users */}
        {sortedUsers.map((user) => (
          <Marker
            key={user.id}
            position={[user.location.latitude, user.location.longitude]}
          >
            <Popup>
              {user.name} <br />
              {user.distance.toFixed(2)} km away
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NearestUsersMap;
