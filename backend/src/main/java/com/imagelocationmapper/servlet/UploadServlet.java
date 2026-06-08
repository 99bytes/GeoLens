package com.imagelocationmapper.servlet;

import com.google.gson.Gson;
import com.imagelocationmapper.model.ApiResponse;
import com.imagelocationmapper.util.ExifExtractor;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

/**
 * REST endpoint: POST /api/upload
 *
 * Responsibilities (kept deliberately thin):
 *  1. Receive the uploaded image (multipart/form-data).
 *  2. Validate it is a JPG/JPEG.
 *  3. Delegate EXIF reading to {@link ExifExtractor}.
 *  4. Write the result back as JSON.
 *
 * @MultipartConfig lets the servlet container parse file uploads natively,
 * so no extra upload library is needed.
 */
@WebServlet("/api/upload")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024,      // 1 MB
        maxFileSize = 10 * 1024 * 1024,       // 10 MB per file
        maxRequestSize = 12 * 1024 * 1024     // 12 MB per request
)
public class UploadServlet extends HttpServlet {

    // Gson is thread-safe, so one shared instance is fine.
    private final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Every response from this endpoint is JSON.
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            Part filePart = request.getPart("image");

            // --- Validation: a file must be present ---
            if (filePart == null || filePart.getSize() == 0) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                        ApiResponse.failure("No image was uploaded"));
                return;
            }

            // --- Validation: only JPG / JPEG accepted ---
            String fileName = getFileName(filePart);
            if (!isJpeg(fileName)) {
                writeJson(response, HttpServletResponse.SC_BAD_REQUEST,
                        ApiResponse.failure("Only JPG and JPEG images are supported"));
                return;
            }

            // --- Delegate the real work to the utility class ---
            try (InputStream imageStream = filePart.getInputStream()) {
                ApiResponse result = ExifExtractor.extract(imageStream);
                writeJson(response, HttpServletResponse.SC_OK, result);
            }

        } catch (Exception e) {
            // metadata-extractor throws on corrupt / non-image files
            writeJson(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    ApiResponse.failure("Could not read the image. It may be corrupted."));
        }
    }

    /** Serializes the model to JSON and writes it with the given HTTP status. */
    private void writeJson(HttpServletResponse response, int status, ApiResponse body)
            throws IOException {
        response.setStatus(status);
        try (PrintWriter out = response.getWriter()) {
            out.print(gson.toJson(body));
            out.flush();
        }
    }

    /** Extracts the original file name from the part's content-disposition header. */
    private String getFileName(Part part) {
        String header = part.getHeader("content-disposition");
        if (header == null) return "";
        for (String token : header.split(";")) {
            if (token.trim().startsWith("filename")) {
                return token.substring(token.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return "";
    }

    /** True only for .jpg / .jpeg file names (case-insensitive). */
    private boolean isJpeg(String fileName) {
        String lower = fileName.toLowerCase();
        return lower.endsWith(".jpg") || lower.endsWith(".jpeg");
    }
}
