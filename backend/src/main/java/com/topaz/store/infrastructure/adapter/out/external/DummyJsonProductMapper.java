package com.topaz.store.infrastructure.adapter.out.external;

import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.model.ProductCategory;
import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class DummyJsonProductMapper {

    public Product toDomain(DummyJsonProductDto dto) {
        Objects.requireNonNull(dto, "DummyJsonProductDto must not be null");
        return new Product(
                dto.id(),
                dto.title(),
                dto.description(),
                ProductCategory.fromValue(dto.category()),
                dto.price(),
                dto.discountPercentage(),
                dto.rating(),
                dto.stock(),
                dto.brand(),
                dto.thumbnail(),
                dto.images()
        );
    }
}
