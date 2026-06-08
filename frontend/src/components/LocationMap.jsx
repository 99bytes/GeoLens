import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Leaflet marker icon fix ---
// When bundling with Vite, Leaflet's default marker images don't resolve
// correctly. We point the icons at the CDN copies so the marker shows up.
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/**
 * Renders an interactive OpenStreetMap centered on the given coordinates,
 * with a marker + popup at the exact spot.
 *
 * Props:
 *  - latitude:  number
 *  - longitude: number
 */
function LocationMap({ latitude, longitude }) {
  const position = [latitude, longitude];

  return (
    <MapContainer center={position} zoom={13} className="map">
      {/* Free OpenStreetMap tiles — no API key required */}
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Photo taken here
          <br />
          {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default LocationMap;
