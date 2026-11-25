package restaurant_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import restaurant_backend.dto.table.TableRequest;
import restaurant_backend.dto.table.TableResponse;
import restaurant_backend.entity.TableStatus;
import restaurant_backend.service.RestaurantTableService;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableService restaurantTableService;

    @GetMapping
    public ResponseEntity<List<TableResponse>>
    getAllTables() {

        return ResponseEntity.ok(
                restaurantTableService.getAllTables()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableResponse>
    getTableById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                restaurantTableService.getTableById(id)
        );
    }

    @GetMapping("/number/{tableNumber}")
    public ResponseEntity<TableResponse>
    getTableByNumber(
            @PathVariable String tableNumber
    ) {

        return ResponseEntity.ok(
                restaurantTableService.getTableByNumber(
                        tableNumber
                )
        );
    }

    @GetMapping("/qr/{qrCode}")
    public ResponseEntity<TableResponse>
    getTableByQrCode(
            @PathVariable String qrCode
    ) {

        return ResponseEntity.ok(
                restaurantTableService.getTableByQrCode(
                        qrCode
                )
        );
    }

    @PostMapping
    public ResponseEntity<TableResponse>
    createTable(
            @Valid @RequestBody TableRequest request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        restaurantTableService.createTable(
                                request
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<TableResponse>
    updateTable(
            @PathVariable Long id,
            @Valid @RequestBody TableRequest request
    ) {

        return ResponseEntity.ok(
                restaurantTableService.updateTable(
                        id,
                        request
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TableResponse>
    updateTableStatus(
            @PathVariable Long id,
            @RequestParam TableStatus status
    ) {

        return ResponseEntity.ok(
                restaurantTableService.updateTableStatus(
                        id,
                        status
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteTable(
            @PathVariable Long id
    ) {

        restaurantTableService.deleteTable(id);

        return ResponseEntity.noContent().build();
    }
}