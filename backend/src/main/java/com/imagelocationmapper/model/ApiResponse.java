package com.imagelocationmapper.model;

/**
 * Model object that Gson serializes into the JSON returned to the React app.
 *
 * Gson omits {@code null} fields by default, so the same class produces both
 * response shapes cleanly:
 *
 *  Success -> { "success": true, "latitude": .., "longitude": .., "cameraModel": .., "dateTaken": .. }
 *  Failure -> { "success": false, "message": ".." }
 *
 * Static factory methods make the two cases easy to read in the servlet.
 */
public class ApiResponse {

    private boolean success;

    // Present only on success (left null on failure, so Gson drops them)
    private Double latitude;
    private Double longitude;
    private String cameraModel;
    private String dateTaken;

    // Present only on failure
    private String message;

    private ApiResponse(boolean success) {
        this.success = success;
    }

    /** Builds a successful response containing the detected location + camera info. */
    public static ApiResponse success(double latitude, double longitude,
                                      String cameraModel, String dateTaken) {
        ApiResponse r = new ApiResponse(true);
        r.latitude = latitude;
        r.longitude = longitude;
        r.cameraModel = cameraModel;   // may be null if camera info missing
        r.dateTaken = dateTaken;       // may be null if date missing
        return r;
    }

    /** Builds a failure response with a human-readable message. */
    public static ApiResponse failure(String message) {
        ApiResponse r = new ApiResponse(false);
        r.message = message;
        return r;
    }
}
