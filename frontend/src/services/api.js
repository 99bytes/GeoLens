import axios from "axios";

/**
 * Central place for all backend communication.
 * Keeping API calls here (the "services" layer) means components don't need to
 * know the backend URL or how requests are built — they just call a function.
 */

// Base URL of the Tomcat backend. The WAR is deployed as "api-backend",
// and the servlet is mapped to "/api/upload".
const API_BASE_URL = "http://localhost:8080/api-backend";

/**
 * Uploads an image file to the backend and returns the parsed JSON response.
 *
 * @param {File} imageFile - the JPG/JPEG file selected by the user
 * @returns {Promise<Object>} the backend's ApiResponse JSON
 */
export async function uploadImage(imageFile) {
  // multipart/form-data is required for file uploads. The field name "image"
  // must match request.getPart("image") on the servlet side.
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}
