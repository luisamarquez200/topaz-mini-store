package com.topaz.store.infrastructure.adapter.in.rest;

import com.topaz.store.domain.port.in.GetProductByIdUseCase;
import com.topaz.store.domain.port.in.GetProductsUseCase;
import com.topaz.store.infrastructure.adapter.in.rest.dto.ProductResponseDto;
import com.topaz.store.infrastructure.exception.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ProductController.BASE_PATH)
@CrossOrigin(origins = "*")
public class ProductController {

    public static final String BASE_PATH = "/api/products";
    public static final String BY_ID_PATH = "/{id}";
    private static final String PRODUCT_NOT_FOUND_MSG = "Product not found with id: ";

    private final GetProductsUseCase getProductsUseCase;
    private final GetProductByIdUseCase getProductByIdUseCase;

    public ProductController(GetProductsUseCase getProductsUseCase, GetProductByIdUseCase getProductByIdUseCase) {
        this.getProductsUseCase = getProductsUseCase;
        this.getProductByIdUseCase = getProductByIdUseCase;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAllProducts() {
        List<ProductResponseDto> products = getProductsUseCase.execute()
                .stream()
                .map(ProductResponseDto::fromDomain)
                .toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping(BY_ID_PATH)
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        return getProductByIdUseCase.execute(id)
                .map(ProductResponseDto::fromDomain)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException(PRODUCT_NOT_FOUND_MSG + id));
    }
}
