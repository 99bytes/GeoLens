import LocationMap from "./LocationMap.jsx";

/**
 * Shows the successful result: the uploaded image, the extracted metadata
 * (coordinates, camera, date) and an interactive map with a marker.
 *
 * Props:
 *  - result:    the backend ApiResponse (success = true)
 *  - imageUrl:  local object URL of the uploaded image (for the preview)
 */
function ResultCard({ result, imageUrl }) {
  const { latitude, longitude, cameraModel, dateTaken } = result;

  // External links to the exact coordinates (no API key required).
  // - Google Maps: standard map view centered on the point.
  // - Street View: opens an interactive 360° panorama at the location.
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

  return (
    <div className="result">
      {/* Left column: image preview */}
      <div className="card">
        <h2 className="card__heading">Uploaded Image</h2>
        <img src={imageUrl} alt="Uploaded" className="result__image" />
      </div>

      {/* Right column: details + map */}
      <div className="card">
        <h2 className="card__heading">Detected Location</h2>

        <div className="info-grid">
          <div className="info-item">
            <span className="info-item__label">Latitude</span>
            <span className="info-item__value">{latitude}</span>
          </div>
          <div className="info-item">
            <span className="info-item__label">Longitude</span>
            <span className="info-item__value">{longitude}</span>
          </div>
          <div className="info-item">
            <span className="info-item__label">Camera Model</span>
            <span className="info-item__value">{cameraModel || "Not available"}</span>
          </div>
          <div className="info-item">
            <span className="info-item__label">Date Taken</span>
            <span className="info-item__value">{dateTaken || "Not available"}</span>
          </div>
        </div>

        <LocationMap latitude={latitude} longitude={longitude} />

        {/* External views: open the exact spot in Google Maps / Street View */}
        <div className="link-buttons">
          <a
            className="link-btn"
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            🗺 Open in Google Maps
          </a>
          <a
            className="link-btn link-btn--secondary"
            href={streetViewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            👁 Open Street View
          </a>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
