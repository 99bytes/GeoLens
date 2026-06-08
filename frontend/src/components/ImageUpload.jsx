import { useRef, useState } from "react";

/**
 * Reusable upload component.
 *
 * Responsibilities:
 *  - let the user pick (or drag & drop) a JPG/JPEG file
 *  - validate the file type on the client
 *  - show a preview before uploading
 *  - call onAnalyze(file) when the user clicks "Find Location"
 *
 * Props:
 *  - onAnalyze: function(File)  -> called with the chosen file
 *  - loading:   boolean         -> disables the button while the request runs
 */
function ImageUpload({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef(null);

  // Accept only .jpg / .jpeg files.
  function isJpeg(f) {
    return /\.(jpg|jpeg)$/i.test(f.name);
  }

  // Common handler for both click-to-browse and drag-and-drop.
  function handleFile(selectedFile) {
    if (!selectedFile) return;

    if (!isJpeg(selectedFile)) {
      setValidationError("Please select a JPG or JPEG image.");
      setFile(null);
      setPreview(null);
      return;
    }

    setValidationError("");
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // local preview, no upload yet
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  }

  return (
    <div className="upload">
      {/* Drag-and-drop / click area */}
      <div
        className="dropzone"
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Selected preview" className="dropzone__preview" />
        ) : (
          <>
            <div className="dropzone__icon">⬆</div>
            <p className="dropzone__text">Drag &amp; drop your photo here</p>
            <p className="dropzone__hint">or click to browse — JPG / JPEG only</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg"
          onChange={handleInputChange}
          hidden
        />
      </div>

      {file && <p className="upload__filename">Selected: {file.name}</p>}
      {validationError && <p className="upload__error">{validationError}</p>}

      <button
        className="btn"
        disabled={!file || loading}
        onClick={() => onAnalyze(file)}
      >
        {loading ? "Analyzing…" : "Find Location"}
      </button>
    </div>
  );
}

export default ImageUpload;
