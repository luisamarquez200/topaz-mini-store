package com.topaz.store.infrastructure.adapter.out.external;

import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.model.ProductCategory;
import com.topaz.store.domain.port.out.ProductExternalPort;
import com.topaz.store.infrastructure.adapter.out.external.client.DummyJsonClient;
import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
public class DummyJsonAdapter implements ProductExternalPort {

    private final DummyJsonClient dummyJsonClient;

    public DummyJsonAdapter(DummyJsonClient dummyJsonClient) {
        this.dummyJsonClient = Objects.requireNonNull(dummyJsonClient, "dummyJsonClient must not be null");
    }

    @Override
    public List<Product> fetchAllProducts() {
        return dummyJsonClient.getAllProducts()
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Product> fetchProductById(Long id) {
        return dummyJsonClient.getProductById(id)
                .map(this::toDomain);
    }

    public Product toDomain(DummyJsonProductDto dto) {
        if (dto == null) {
            return null;
        }
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
