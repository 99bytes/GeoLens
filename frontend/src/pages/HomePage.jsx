import { useState } from "react";
import ImageUpload from "../components/ImageUpload.jsx";
import ResultCard from "../components/ResultCard.jsx";
import NoLocationCard from "../components/NoLocationCard.jsx";
import { uploadImage } from "../services/api.js";

/**
 * The single page of the app. It owns all the state and decides what to render:
 *  - the upload form (always),
 *  - a result card (when GPS data was found),
 *  - a "no location" card (when it wasn't),
 *  - an error message (if the request itself failed).
 */
function HomePage() {
  const [result, setResult] = useState(null);   // backend ApiResponse
  const [imageUrl, setImageUrl] = useState(null); // local preview URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Called by <ImageUpload /> when the user clicks "Find Location".
  async function handleAnalyze(file) {
    setLoading(true);
    setError("");
    setResult(null);
    setImageUrl(URL.createObjectURL(file)); // keep a preview of what was sent

    try {
      const data = await uploadImage(file);
      setResult(data);
    } catch (err) {
      // Network error, or the server returned an error status.
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Something went wrong while contacting the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      {/* Header */}
      <header className="hero">
        <h1 className="hero__title">📍 GeoSnap</h1>
        <p className="hero__subtitle">
          Upload a photo and discover where it was taken. We read the GPS
          coordinates stored in the image's EXIF metadata and plot them on a map.
        </p>
      </header>

      {/* Upload card */}
      <section className="card upload-card">
        <ImageUpload onAnalyze={handleAnalyze} loading={loading} />
        {error && <p className="upload__error">{error}</p>}
      </section>

      {/* Results: choose the right card based on the response */}
      {result && imageUrl && (
        result.success ? (
          <ResultCard result={result} imageUrl={imageUrl} />
        ) : (
          <NoLocationCard message={result.message} imageUrl={imageUrl} />
        )
      )}

      <footer className="footer">
        <p>Java Servlets · metadata-extractor · React · React Leaflet · OpenStreetMap</p>
      </footer>
    </div>
  );
}

export default HomePage;
