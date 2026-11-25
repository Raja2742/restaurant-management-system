package restaurant_backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import restaurant_backend.dto.table.TableRequest;
import restaurant_backend.dto.table.TableResponse;
import restaurant_backend.entity.OrderSession;
import restaurant_backend.entity.OrderSessionStatus;
import restaurant_backend.entity.RestaurantTable;
import restaurant_backend.entity.TableStatus;
import restaurant_backend.exception.ConflictException;
import restaurant_backend.exception.ResourceNotFoundException;
import restaurant_backend.repository.OrderSessionRepository;
import restaurant_backend.repository.RestaurantTableRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTableService {

    private final RestaurantTableRepository restaurantTableRepository;
    private final OrderSessionRepository orderSessionRepository;

    public List<TableResponse> getAllTables() {

        return restaurantTableRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TableResponse getTableById(Long id) {

        RestaurantTable table =
                restaurantTableRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        return toResponse(table);
    }

    public TableResponse getTableByNumber(
            String tableNumber
    ) {

        RestaurantTable table =
                restaurantTableRepository
                        .findByTableNumber(tableNumber)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        return toResponse(table);
    }

    public TableResponse getTableByQrCode(
            String qrCode
    ) {

        RestaurantTable table =
                restaurantTableRepository
                        .findByQrCode(qrCode)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        return toResponse(table);
    }

    public TableResponse createTable(
            TableRequest request
    ) {

        if (restaurantTableRepository
                .existsByTableNumber(
                        request.tableNumber()
                )) {

            throw new ConflictException(
                    "Table number already exists"
            );
        }

        RestaurantTable table =
                new RestaurantTable();

        table.setTableNumber(
                request.tableNumber()
        );

        table.setCapacity(
                request.capacity()
        );

        table.setQrCode(
                request.qrCode()
        );

        // Server controls this
        table.setStatus(
                TableStatus.AVAILABLE
        );

        RestaurantTable savedTable =
                restaurantTableRepository.save(table);

        return toResponse(savedTable);
    }

    public TableResponse updateTable(
            Long id,
            TableRequest request
    ) {

        RestaurantTable table =
                restaurantTableRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        // Prevent changing to another existing table number
        if (!table.getTableNumber()
                .equals(request.tableNumber())
                &&
                restaurantTableRepository.existsByTableNumber(
                        request.tableNumber()
                )) {

            throw new ConflictException(
                    "Table number already exists"
            );
        }

        table.setTableNumber(
                request.tableNumber()
        );

        table.setCapacity(
                request.capacity()
        );

        table.setQrCode(
                request.qrCode()
        );

        // Do NOT modify status here

        RestaurantTable updatedTable =
                restaurantTableRepository.save(table);

        return toResponse(updatedTable);
    }

    public TableResponse updateTableStatus(
            Long id,
            TableStatus status
    ) {

        RestaurantTable table =
                restaurantTableRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        table.setStatus(status);

        return toResponse(
                restaurantTableRepository.save(table)
        );
    }

    public void deleteTable(Long id) {

        RestaurantTable table =
                restaurantTableRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Table not found"
                                )
                        );

        restaurantTableRepository.delete(table);
    }

    private TableResponse toResponse(RestaurantTable table) {

        Long activeSessionId = orderSessionRepository
                .findByRestaurantTableIdAndStatus(
                        table.getId(),
                        OrderSessionStatus.ACTIVE
                )
                .map(OrderSession::getId)
                .orElse(null);

        return new TableResponse(
                table.getId(),
                table.getTableNumber(),
                table.getCapacity(),
                table.getStatus(),
                table.getQrCode(),
                activeSessionId
        );
    }
}