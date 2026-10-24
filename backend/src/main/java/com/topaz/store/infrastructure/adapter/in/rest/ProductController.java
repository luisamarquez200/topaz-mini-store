package com.topaz.store.infrastructure.adapter.in.rest;

import com.topaz.store.domain.port.in.GetProductByIdUseCase;
import com.topaz.store.domain.port.in.GetProductsUseCase;
import com.topaz.store.infrastructure.adapter.in.rest.dto.ProductResponseDto;
import com.topaz.store.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.constraints.Positive;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(ProductController.BASE_PATH)
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
    public List<ProductResponseDto> getAllProducts() {
        return getProductsUseCase.execute()
                .stream()
                .map(ProductResponseDto::fromDomain)
                .toList();
    }

    @GetMapping(BY_ID_PATH)
    public ProductResponseDto getProductById(@PathVariable @Positive long id) {
        return getProductByIdUseCase.execute(id)
                .map(ProductResponseDto::fromDomain)
                .orElseThrow(() -> new ResourceNotFoundException(PRODUCT_NOT_FOUND_MSG + id));
    }
}
