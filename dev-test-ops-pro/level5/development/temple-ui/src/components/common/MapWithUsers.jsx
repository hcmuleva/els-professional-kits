import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAllAddresses } from "../../services/address";

// Haversine formula to calculate distance in km between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Dummy random profile images generator
const getRandomPhoto = () =>
  `https://randomuser.me/api/portraits/${
    Math.random() > 0.5 ? "men" : "women"
  }/${Math.floor(Math.random() * 80)}.jpg`;

// Color palette for polylines
const colors = ["red", "blue", "green", "orange", "purple", "brown"];

// Default icon for your current location
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapWithPhotos = () => {
  const [myLocation, setMyLocation] = useState(null);
  const [userLocations, setUserLocations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMyLocation({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        alert("Unable to get your location.");
      }
    );
  }, []);

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await getAllAddresses();
        const cleanedData = response.data
          .filter(
            (item) =>
              item.attributes.latitude &&
              item.attributes.longitude &&
              item.attributes.users.data.length > 0
          )
          .map((item) => {
            const user = item.attributes.users.data[0];
            const firstName = user?.attributes?.first_name || "Unknown";
            const lastName = user?.attributes?.last_name || "";
            return {
              id: item.id,
              lat: item.attributes.latitude,
              lng: item.attributes.longitude,
              name: `${firstName} ${lastName}`.trim(),
              photo: getRandomPhoto(),
            };
          });

        setUserLocations(cleanedData);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    }

    fetchAddresses();
  }, []);

  if (!myLocation) return <div>Loading map...</div>;

  return (
    <MapContainer
      center={[myLocation.lat, myLocation.lng]}
      zoom={16}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Your current location marker */}
      <Marker position={[myLocation.lat, myLocation.lng]} icon={defaultIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {userLocations.map((user, index) => {
        const distance = calculateDistance(
          myLocation.lat,
          myLocation.lng,
          user.lat,
          user.lng
        ).toFixed(2);

        // Circular photo icon for user
        const customIcon = L.divIcon({
          className: "custom-user-icon",
          html: `<img src="${user.photo}" alt="${user.name}" style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
          " />`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        return (
          <React.Fragment key={user.id}>
            <Marker position={[user.lat, user.lng]} icon={customIcon}>
              <Tooltip>{user.name}</Tooltip>
              <Popup>
                <div>
                  <strong>{user.name}</strong>
                  <br />
                  Distance: {distance} km
                </div>
              </Popup>
            </Marker>
            <Polyline
              positions={[
                [myLocation.lat, myLocation.lng],
                [user.lat, user.lng],
              ]}
              pathOptions={{ color: colors[index % colors.length], weight: 2 }}
            />
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
};

export default MapWithPhotos;
