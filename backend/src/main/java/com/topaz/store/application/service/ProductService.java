package com.topaz.store.application.service;

import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.port.in.GetProductByIdUseCase;
import com.topaz.store.domain.port.in.GetProductsUseCase;
import com.topaz.store.domain.port.out.ProductExternalPort;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class ProductService implements GetProductsUseCase, GetProductByIdUseCase {

    private final ProductExternalPort productExternalPort;

    public ProductService(ProductExternalPort productExternalPort) {
        this.productExternalPort = Objects.requireNonNull(productExternalPort, "productExternalPort must not be null");
    }

    @Override
    public List<Product> execute() {
        return productExternalPort.fetchAllProducts();
    }

    @Override
    public Optional<Product> execute(long id) {
        return productExternalPort.fetchProductById(id);
    }
}
