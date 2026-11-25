package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import restaurant_backend.dto.menu.MenuItemRequest;
import restaurant_backend.dto.menu.MenuItemResponse;
import restaurant_backend.entity.MenuCategory;
import restaurant_backend.entity.MenuItem;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.MenuCategoryRepository;
import restaurant_backend.repository.MenuItemRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuImageStorageService imageStorageService;

    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<MenuItemResponse> getAvailableMenuItems() {
        return menuItemRepository.findByAvailableTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MenuItemResponse getMenuItemById(Long id) {

        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Menu item not found"
                        )
                );

        return toResponse(menuItem);
    }

    public List<MenuItemResponse> getAvailableItemsByCategory(
            Long categoryId
    ) {
        return menuItemRepository
                .findByCategoryIdAndAvailableTrue(categoryId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MenuItemResponse createMenuItem(
            MenuItemRequest request,
            MultipartFile image
    ) {

        MenuCategory category =
                menuCategoryRepository.findById(
                                request.categoryId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                        );

        // Store the image first.
        String imageUrl =
                imageStorageService.storeImage(image);

        try {

            MenuItem menuItem = new MenuItem();

            menuItem.setName(request.name());
            menuItem.setDescription(request.description());
            menuItem.setPrice(request.price());
            menuItem.setImageUrl(imageUrl);
            menuItem.setCategory(category);

            if (request.available() != null) {
                menuItem.setAvailable(request.available());
            }

            MenuItem savedItem =
                    menuItemRepository.save(menuItem);

            return toResponse(savedItem);

        } catch (RuntimeException exception) {

            // If saving the database record fails,
            // remove the newly uploaded image.
            imageStorageService.deleteImage(imageUrl);

            throw exception;
        }
    }

    @Transactional
    public MenuItemResponse updateMenuItem(
            Long id,
            MenuItemRequest request,
            MultipartFile image
    ) {


        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Menu item not found")
                );

        MenuCategory category = menuCategoryRepository.findById(
                        request.categoryId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found")
                );

        String oldImageUrl = menuItem.getImageUrl();
        String newImageUrl = null;

        if (image != null && !image.isEmpty()) {
            newImageUrl = imageStorageService.storeImage(image);
        }

        try {
            menuItem.setName(request.name());
            menuItem.setDescription(request.description());
            menuItem.setPrice(request.price());
            menuItem.setCategory(category);

            if (request.available() != null) {
                menuItem.setAvailable(request.available());
            }

            if (newImageUrl != null) {
                menuItem.setImageUrl(newImageUrl);
            }

            MenuItem updatedItem = menuItemRepository.saveAndFlush(menuItem);

            MenuItemResponse response = toResponse(updatedItem);

            // The database update succeeded. Old-image cleanup
            // should not invalidate the newly saved database record.
            if (newImageUrl != null && oldImageUrl != null) {
                try {
                    imageStorageService.deleteImage(oldImageUrl);
                } catch (RuntimeException cleanupException) {
                    // Log this exception; do not delete the new image.
                    System.err.println(
                            "Could not delete old image: "
                                    + cleanupException.getMessage()
                    );
                }
            }

            return response;

        } catch (RuntimeException exception) {

            if (newImageUrl != null) {
                try {
                    imageStorageService.deleteImage(newImageUrl);
                } catch (RuntimeException cleanupException) {
                    exception.addSuppressed(cleanupException);
                }
            }

            throw exception;
        }


    }


    @Transactional
    public void deleteMenuItem(Long id) {

        MenuItem menuItem =
                menuItemRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Menu item not found"
                                )
                        );

        String imageUrl = menuItem.getImageUrl();

        menuItemRepository.delete(menuItem);
        menuItemRepository.flush();

        if (imageUrl != null) {
            imageStorageService.deleteImage(imageUrl);
        }
    }

    private MenuItemResponse toResponse(
            MenuItem menuItem
    ) {
        return new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.getImageUrl(),
                menuItem.getAvailable(),
                menuItem.getCategory().getId(),
                menuItem.getCategory().getName()
        );
    }
}