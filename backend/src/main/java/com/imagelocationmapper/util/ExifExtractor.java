package com.imagelocationmapper.util;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.exif.GpsDirectory;
import com.imagelocationmapper.model.ApiResponse;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Utility (helper) class that does the actual EXIF work.
 *
 * Keeping this separate from the servlet means the "how do we read metadata"
 * logic is isolated and easy to test or reuse. The servlet just deals with
 * HTTP; this class just deals with image metadata.
 */
public class ExifExtractor {

    /**
     * Reads an image stream and returns an {@link ApiResponse}:
     *  - success (with lat/lon/camera/date) when GPS data is present,
     *  - failure (with a message) when it is not.
     *
     * @throws Exception if the bytes are not a readable image
     */
    public static ApiResponse extract(InputStream imageStream) throws Exception {

        Metadata metadata = ImageMetadataReader.readMetadata(imageStream);

        // --- 1. GPS coordinates (the main feature) ---
        GpsDirectory gps = metadata.getFirstDirectoryOfType(GpsDirectory.class);
        if (gps == null || gps.getGeoLocation() == null) {
            return ApiResponse.failure("No GPS metadata found in image");
        }
        double latitude = gps.getGeoLocation().getLatitude();
        double longitude = gps.getGeoLocation().getLongitude();

        // --- 2. Camera model (optional) ---
        String cameraModel = readCameraModel(metadata);

        // --- 3. Date the photo was taken (optional), formatted as yyyy-MM-dd ---
        String dateTaken = readDateTaken(metadata);

        return ApiResponse.success(latitude, longitude, cameraModel, dateTaken);
    }

    /** Returns the camera model from EXIF, or null if it is not recorded. */
    private static String readCameraModel(Metadata metadata) {
        ExifIFD0Directory dir = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
        if (dir != null && dir.containsTag(ExifIFD0Directory.TAG_MODEL)) {
            return dir.getString(ExifIFD0Directory.TAG_MODEL);
        }
        return null;
    }

    /** Returns the "date taken" as yyyy-MM-dd, or null if it is not recorded. */
    private static String readDateTaken(Metadata metadata) {
        ExifSubIFDDirectory dir = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
        if (dir != null) {
            Date date = dir.getDateOriginal();   // TAG_DATETIME_ORIGINAL
            if (date != null) {
                return new SimpleDateFormat("yyyy-MM-dd").format(date);
            }
        }
        return null;
    }
}
