# 📍 Image Location Mapper

🚀 **Live Demo:** [https://geolens-1-1y0g.onrender.com/](https://geolens-1-epms.onrender.com/)

A full-stack web application that extracts **GPS coordinates** from an image's
**EXIF metadata** and displays the location on an **interactive map**.

Upload a JPG/JPEG photo → the backend reads its hidden metadata → the frontend
shows the latitude, longitude, camera model, date taken, and a marker on a map.

---

## 🧱 Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React, Vite, JavaScript, CSS3, Axios, React Leaflet |
| Backend  | Java Servlets, Maven, Apache Tomcat, metadata-extractor, Gson |
| Maps     | Leaflet.js + OpenStreetMap |

No Spring Boot, no database, no authentication, no Docker — intentionally simple.

---

## 📂 Project Structure

```
GeoLens/
│
├── backend/                                 # Java Servlet REST API
│   ├── pom.xml                              # Maven build + dependencies
│   └── src/main/
│       ├── java/com/imagelocationmapper/
│       │   ├── servlet/
│       │   │   └── UploadServlet.java       # POST /api/upload endpoint
│       │   ├── util/
│       │   │   ├── ExifExtractor.java       # Reads EXIF GPS/camera/date
│       │   │   └── CorsFilter.java          # Allows the React app to call us
│       │   └── model/
│       │       └── ApiResponse.java         # JSON response shape
│       └── webapp/WEB-INF/web.xml
│
├── frontend/                                # React single-page app
│   ├── package.json                         # React dependencies + scripts
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                         # React entry point
│       ├── App.jsx                          # Root component
│       ├── index.css                        # Global styles (white/blue theme)
│       ├── pages/
│       │   └── HomePage.jsx                 # Owns state, orchestrates the UI
│       ├── components/
│       │   ├── ImageUpload.jsx              # Upload + preview + validation
│       │   ├── ResultCard.jsx               # Shows metadata + map
│       │   ├── LocationMap.jsx              # React Leaflet map + marker
│       │   └── NoLocationCard.jsx           # "No GPS metadata" card
│       └── services/
│           └── api.js                       # Axios call to the backend
│
├── .gitignore
└── README.md
```

---

## 🔌 API

### `POST /api/upload`
**Request:** `multipart/form-data` with a single field `image` (a JPG/JPEG file).

**Success response (GPS found):**
```json
{
  "success": true,
  "latitude": 22.5726,
  "longitude": 88.3639,
  "cameraModel": "Samsung Galaxy S24",
  "dateTaken": "2026-01-15"
}
```

**Failure response (no GPS):**
```json
{
  "success": false,
  "message": "No GPS metadata found in image"
}
```
`cameraModel` and `dateTaken` are omitted if the photo doesn't record them.

---

## ⚙️ Setup & Run

### Prerequisites
- **JDK 21+**
- **Maven 3.6+**
- **Apache Tomcat 11** (Tomcat 11 uses the `jakarta.*` Servlet API this project targets — *not* Tomcat 9, which uses the old `javax.*`)
- **Node.js 18+**

### 1. Backend → Tomcat

```bash
cd backend
mvn clean package
```
This produces `backend/target/api-backend.war`.

Deploy it by **copying the WAR into Tomcat's `webapps/` folder**:

```bash
# Example (adjust paths to your machine)
copy target\api-backend.war  C:\apache-tomcat-11\webapps\
```

Start Tomcat:
```bash
# Windows
C:\apache-tomcat-11\bin\startup.bat
```

The API is now live at:
```
http://localhost:8080/api-backend/api/upload
```

### 2. Frontend → Vite dev server

```bash
cd frontend
npm install
npm run dev
```

Open the URL it prints (default **http://localhost:5173**).

> The backend URL is set in `frontend/src/services/api.js`
> (`API_BASE_URL = "http://localhost:8080/api-backend"`). Change it there if your
> Tomcat host/port/context differs.

---

## 🧠 How It Works (Architecture)

```
┌──────────────┐   multipart/form-data    ┌────────────────────┐
│  React (Vite)│ ───────POST /api/upload──▶│  Servlet (Tomcat)  │
│  port 5173   │                           │  port 8080         │
│              │ ◀──────── JSON ───────────│                    │
└──────────────┘                           └─────────┬──────────┘
        ▲                                            │
        │ renders                                    │ reads EXIF
        ▼                                            ▼
   React Leaflet map                        metadata-extractor lib
```

1. The React app collects the image and POSTs it to the servlet as
   `multipart/form-data` using Axios.
2. The servlet (`@MultipartConfig`) parses the upload and hands the bytes to
   `ExifExtractor`.
3. `ExifExtractor` uses **metadata-extractor** to read the GPS directory (and
   camera/date), then builds an `ApiResponse`.
4. **Gson** serializes that object to JSON, which the servlet writes back.
5. React reads the JSON and renders either the **map + details** or the
   **"no location"** card. **React Leaflet** draws the OpenStreetMap tiles and
   places a marker on the coordinates.

