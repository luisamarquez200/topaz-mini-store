package com.topaz.store.infrastructure.adapter.in.rest.dto;

import com.topaz.store.domain.model.Product;

import java.util.List;

public record ProductResponseDto(
    Long id,
    String title,
    String description,
    String category,
    Double price,
    Double discountPercentage,
    Double rating,
    Integer stock,
    String brand,
    String thumbnail,
    List<String> images
) {
    public static ProductResponseDto fromDomain(Product product) {
        if (product == null) {
            return null;
        }
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
