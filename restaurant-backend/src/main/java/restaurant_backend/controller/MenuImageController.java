package restaurant_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import restaurant_backend.entity.MenuItem;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.MenuItemRepository;
import restaurant_backend.service.MenuImageStorageService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/menu-items")
@RequiredArgsConstructor
public class MenuImageController {

    private final MenuItemRepository menuItemRepository;
    private final MenuImageStorageService imageStorageService;

    @PostMapping(
            value = "/{itemId}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, String>> uploadImage(
            @PathVariable Long itemId,
            @RequestParam("file") MultipartFile file
    ) {

        MenuItem menuItem =
                menuItemRepository.findById(itemId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Menu item not found"
                                )
                        );

        String imageUrl =
                imageStorageService.storeImage(file);

        menuItem.setImageUrl(imageUrl);

        menuItemRepository.save(menuItem);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Menu image uploaded successfully",
                        "imageUrl", imageUrl
                )
        );
    }
}