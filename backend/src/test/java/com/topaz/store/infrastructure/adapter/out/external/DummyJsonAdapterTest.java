package com.topaz.store.infrastructure.adapter.out.external;

import com.topaz.store.ProductFixtures;
import com.topaz.store.domain.model.Product;
import com.topaz.store.infrastructure.adapter.out.external.client.DummyJsonClient;
import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DummyJsonAdapterTest {

    @Mock
    private DummyJsonClient dummyJsonClient;

    private DummyJsonProductMapper dummyJsonProductMapper;
    private DummyJsonAdapter dummyJsonAdapter;

    @BeforeEach
    void setUp() {
        dummyJsonProductMapper = new DummyJsonProductMapper();
        dummyJsonAdapter = new DummyJsonAdapter(dummyJsonClient, dummyJsonProductMapper);
    }

    @Test
    @DisplayName("Should fetch all products and map each to domain model")
    void fetchAllProducts_shouldFetchAndMapToDomainList() {
        // Arrange
        DummyJsonProductDto dto = ProductFixtures.aDto();
        when(dummyJsonClient.getAllProducts()).thenReturn(List.of(dto));

        // Act
        List<Product> products = dummyJsonAdapter.fetchAllProducts();

        // Assert
        assertThat(products).isNotNull().hasSize(1);
        assertThat(products.get(0).id()).isEqualTo(ProductFixtures.DEFAULT_ID);
        verify(dummyJsonClient).getAllProducts();
    }

    @Test
    @DisplayName("Should fetch product by id and map to domain model")
    void fetchProductById_shouldFetchAndMapToDomainOptional() {
        // Arrange
        DummyJsonProductDto dto = ProductFixtures.aDto();
        when(dummyJsonClient.getProductById(ProductFixtures.DEFAULT_ID)).thenReturn(Optional.of(dto));

        // Act
        Optional<Product> product = dummyJsonAdapter.fetchProductById(ProductFixtures.DEFAULT_ID);

        // Assert
        assertThat(product).isPresent();
        assertThat(product.get().id()).isEqualTo(ProductFixtures.DEFAULT_ID);
        verify(dummyJsonClient).getProductById(ProductFixtures.DEFAULT_ID);
    }
}
