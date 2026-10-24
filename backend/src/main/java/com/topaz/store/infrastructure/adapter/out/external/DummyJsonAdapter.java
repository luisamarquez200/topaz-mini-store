package com.topaz.store.infrastructure.adapter.out.external;

import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.port.out.ProductExternalPort;
import com.topaz.store.infrastructure.adapter.out.external.client.DummyJsonClient;
import com.topaz.store.infrastructure.config.CacheNames;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Component
public class DummyJsonAdapter implements ProductExternalPort {

    private final DummyJsonClient dummyJsonClient;
    private final DummyJsonProductMapper productMapper;

    public DummyJsonAdapter(DummyJsonClient dummyJsonClient, DummyJsonProductMapper productMapper) {
        this.dummyJsonClient = Objects.requireNonNull(dummyJsonClient, "dummyJsonClient must not be null");
        this.productMapper = Objects.requireNonNull(productMapper, "productMapper must not be null");
    }

    @Override
    @Cacheable(CacheNames.PRODUCTS)
    public List<Product> fetchAllProducts() {
        return dummyJsonClient.getAllProducts()
                .stream()
                .map(productMapper::toDomain)
                .toList();
    }

    @Override
    @Cacheable(value = CacheNames.PRODUCT_BY_ID, key = "#id")
    public Optional<Product> fetchProductById(long id) {
        return dummyJsonClient.getProductById(id)
                .map(productMapper::toDomain);
    }
}
