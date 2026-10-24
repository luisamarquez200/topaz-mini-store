package com.topaz.store.domain.model;

import java.math.BigDecimal;
import java.util.List;

public record Product(
    Long id,
    String title,
    String description,
    ProductCategory category,
    BigDecimal price,
    Double discountPercentage,
    Double rating,
    Integer stock,
    String brand,
    String thumbnail,
    List<String> images
) {
    public Product {
        images = images != null ? List.copyOf(images) : List.of();
    }
}
