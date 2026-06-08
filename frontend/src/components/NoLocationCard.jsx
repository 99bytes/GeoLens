/**
 * Shown when the backend reports success = false (no GPS metadata).
 * Still displays the uploaded image alongside a clean, professional message.
 *
 * Props:
 *  - message:  the message returned by the backend
 *  - imageUrl: local object URL of the uploaded image (for the preview)
 */
function NoLocationCard({ message, imageUrl }) {
  return (
    <div className="result">
      {/* Left column: image preview */}
      <div className="card">
        <h2 className="card__heading">Uploaded Image</h2>
        <img src={imageUrl} alt="Uploaded" className="result__image" />
      </div>

      {/* Right column: friendly "no location" message */}
      <div className="card">
        <div className="no-location">
          <div className="no-location__icon">🛰</div>
          <h2 className="card__heading">No Location Found</h2>
          <p className="no-location__text">
            This image does not contain GPS location metadata.
          </p>
          <p className="no-location__hint">
            {message ||
              "Photos taken on a phone with location services enabled usually include GPS data. Screenshots and edited images often have it removed."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoLocationCard;
