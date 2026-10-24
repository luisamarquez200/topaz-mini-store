package com.topaz.store.infrastructure.adapter.out.external;

import com.topaz.store.ProductFixtures;
import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.model.ProductCategory;
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

    private static final String UNKNOWN_CATEGORY_STRING = "spacecraft-electronics";

    @Mock
    private DummyJsonClient dummyJsonClient;

    private DummyJsonAdapter dummyJsonAdapter;

    @BeforeEach
    void setUp() {
        dummyJsonAdapter = new DummyJsonAdapter(dummyJsonClient);
    }

    @Test
    @DisplayName("Should map all DTO fields accurately to domain Product")
    void toDomain_shouldMapAllFieldsAccurately() {
        // Arrange
        DummyJsonProductDto dto = ProductFixtures.aDto();

        // Act
        Product domainProduct = dummyJsonAdapter.toDomain(dto);

        // Assert
        assertThat(domainProduct).isNotNull();
        assertThat(domainProduct.id()).isEqualTo(ProductFixtures.DEFAULT_ID);
        assertThat(domainProduct.title()).isEqualTo(ProductFixtures.DEFAULT_TITLE);
        assertThat(domainProduct.description()).isEqualTo(ProductFixtures.DEFAULT_DESCRIPTION);
        assertThat(domainProduct.category()).isEqualTo(ProductFixtures.DEFAULT_CATEGORY);
        assertThat(domainProduct.price()).isEqualTo(ProductFixtures.DEFAULT_PRICE);
        assertThat(domainProduct.discountPercentage()).isEqualTo(ProductFixtures.DEFAULT_DISCOUNT);
        assertThat(domainProduct.rating()).isEqualTo(ProductFixtures.DEFAULT_RATING);
        assertThat(domainProduct.stock()).isEqualTo(ProductFixtures.DEFAULT_STOCK);
        assertThat(domainProduct.brand()).isEqualTo(ProductFixtures.DEFAULT_BRAND);
        assertThat(domainProduct.thumbnail()).isEqualTo(ProductFixtures.DEFAULT_THUMBNAIL);
        assertThat(domainProduct.images()).isEqualTo(ProductFixtures.DEFAULT_IMAGES);
    }

    @Test
    @DisplayName("Should map unknown category to ProductCategory.OTHER fallback")
    void toDomain_shouldMapUnknownCategoryToOtherFallback() {
        // Arrange
        DummyJsonProductDto dto = ProductFixtures.aDto(UNKNOWN_CATEGORY_STRING, ProductFixtures.DEFAULT_BRAND);

        // Act
        Product domainProduct = dummyJsonAdapter.toDomain(dto);

        // Assert
        assertThat(domainProduct).isNotNull();
        assertThat(domainProduct.category()).isEqualTo(ProductCategory.OTHER);
    }

    @Test
    @DisplayName("Should map null brand gracefully without throwing NPE")
    void toDomain_shouldMapNullBrandGracefully() {
        // Arrange
        DummyJsonProductDto dto = ProductFixtures.aDto(ProductFixtures.DEFAULT_CATEGORY_STRING, null);

        // Act
        Product domainProduct = dummyJsonAdapter.toDomain(dto);

        // Assert
        assertThat(domainProduct).isNotNull();
        assertThat(domainProduct.brand()).isNull();
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
