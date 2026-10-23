package com.topaz.store.infrastructure.adapter.out.external.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record DummyJsonProductsResponseDto(
    List<DummyJsonProductDto> products,
    Integer total,
    Integer skip,
    Integer limit
) {
    public DummyJsonProductsResponseDto {
        products = products != null ? List.copyOf(products) : List.of();
    }
}
