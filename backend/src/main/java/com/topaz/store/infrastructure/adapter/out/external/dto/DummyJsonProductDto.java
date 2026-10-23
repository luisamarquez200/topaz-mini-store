package com.topaz.store.infrastructure.adapter.out.external.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DummyJsonProductDto(
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
    public DummyJsonProductDto {
        images = images != null ? List.copyOf(images) : List.of();
    }
}
