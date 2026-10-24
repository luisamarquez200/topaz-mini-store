package com.topaz.store.infrastructure.adapter.in.rest.dto;

import com.topaz.store.domain.model.Product;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

public record ProductResponseDto(
    Long id,
    String title,
    String description,
    String category,
    BigDecimal price,
    Double discountPercentage,
    Double rating,
    Integer stock,
    String brand,
    String thumbnail,
    List<String> images
) {
    public static ProductResponseDto fromDomain(Product product) {
        Objects.requireNonNull(product, "product must not be null");
        return new ProductResponseDto(
                product.id(),
                product.title(),
                product.description(),
                product.category() != null ? product.category().getValue() : null,
                product.price(),
                product.discountPercentage(),
                product.rating(),
                product.stock(),
                product.brand(),
                product.thumbnail(),
                product.images()
        );
    }
}
