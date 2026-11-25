package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import restaurant_backend.dto.menu.MenuCategoryRequest;
import restaurant_backend.dto.menu.MenuCategoryResponse;
import restaurant_backend.entity.MenuCategory;
import restaurant_backend.exception.ConflictException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.MenuCategoryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuCategoryService {

    private final MenuCategoryRepository menuCategoryRepository;

    public List<MenuCategoryResponse> getAllCategories() {

        return menuCategoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public MenuCategoryResponse getCategoryById(Long id) {

        MenuCategory category =
                menuCategoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                        );

        return toResponse(category);
    }

    public MenuCategoryResponse createCategory(
            MenuCategoryRequest request
    ) {

        if (menuCategoryRepository.existsByName(
                request.name()
        )) {

            throw new ConflictException(
                    "Category already exists"
            );
        }

        MenuCategory category =
                new MenuCategory();

        category.setName(request.name());
        category.setDescription(request.description());

        if (request.active() != null) {
            category.setActive(request.active());
        }

        return toResponse(
                menuCategoryRepository.save(category)
        );
    }

    public MenuCategoryResponse updateCategory(
            Long id,
            MenuCategoryRequest request
    ) {

        MenuCategory category =
                menuCategoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                        );

        category.setName(request.name());
        category.setDescription(request.description());

        if (request.active() != null) {
            category.setActive(request.active());
        }

        return toResponse(
                menuCategoryRepository.save(category)
        );
    }

    public void deleteCategory(Long id) {

        MenuCategory category =
                menuCategoryRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Category not found"
                                )
                        );

        menuCategoryRepository.delete(category);
    }

    private MenuCategoryResponse toResponse(
            MenuCategory category
    ) {

        return new MenuCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getActive()
        );
    }
}