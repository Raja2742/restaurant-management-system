package restaurant_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import restaurant_backend.exception.BadRequestException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class MenuImageStorageService {

    private final Path uploadDirectory;

    private static final long MAX_FILE_SIZE =
            5 * 1024 * 1024;

    public MenuImageStorageService(
            @Value("${app.upload.menu-dir}") String directory
    ) {
        this.uploadDirectory = Paths.get(directory)
                .toAbsolutePath()
                .normalize();

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not create menu image directory",
                    exception
            );
        }
    }

    public String storeImage(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException(
                    "Menu image is required"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException(
                    "Image size must not exceed 5 MB"
            );
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null ||
                originalFilename.isBlank()) {
            throw new BadRequestException(
                    "Invalid image filename"
            );
        }

        String filename = Paths.get(originalFilename)
                .getFileName()
                .toString();

        int dotIndex = filename.lastIndexOf('.');

        if (dotIndex < 0) {
            throw new BadRequestException(
                    "Image file must have an extension"
            );
        }

        String extension = filename.substring(dotIndex)
                .toLowerCase(Locale.ROOT);

        Set<String> allowedExtensions =
                Set.of(".jpg", ".jpeg", ".png", ".webp");

        if (!allowedExtensions.contains(extension)) {
            throw new BadRequestException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
            );
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !Set.of(
                        "image/jpeg",
                        "image/png",
                        "image/webp"
                ).contains(contentType)) {

            throw new BadRequestException(
                    "Unsupported image type"
            );
        }

        String generatedFilename =
                UUID.randomUUID() + extension;

        Path destination = uploadDirectory
                .resolve(generatedFilename)
                .normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new BadRequestException(
                    "Invalid image path"
            );
        }

        try (InputStream inputStream = file.getInputStream()) {

            Files.copy(inputStream, destination);

            return "/uploads/menu/" + generatedFilename;

        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not save menu image",
                    exception
            );
        }
    }

    public void deleteImage(String imageUrl) {

        if (imageUrl == null ||
                !imageUrl.startsWith("/uploads/menu/")) {
            return;
        }

        String filename = imageUrl.substring(
                "/uploads/menu/".length()
        );

        // Only allow a filename, not an arbitrary path.
        if (filename.isBlank() ||
                filename.contains("/") ||
                filename.contains("\\")) {
            return;
        }

        Path imagePath = uploadDirectory
                .resolve(filename)
                .normalize();

        if (!imagePath.startsWith(uploadDirectory)) {
            return;
        }

        try {
            Files.deleteIfExists(imagePath);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not delete menu image",
                    exception
            );
        }
    }
}