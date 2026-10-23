package com.topaz.store.infrastructure.adapter.out.external;

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

    private static final Long SAMPLE_ID = 1L;
    private static final String SAMPLE_TITLE = "Wireless Headphones";
    private static final String SAMPLE_DESCRIPTION = "Noise cancelling headphones";
    private static final String KNOWN_CATEGORY_STRING = "beauty";
    private static final String UNKNOWN_CATEGORY_STRING = "spacecraft-electronics";
    private static final Double SAMPLE_PRICE = 99.99;
    private static final Double SAMPLE_DISCOUNT = 15.0;
    private static final Double SAMPLE_RATING = 4.8;
    private static final Integer SAMPLE_STOCK = 30;
    private static final String SAMPLE_BRAND = "TopazAudio";
    private static final String SAMPLE_THUMBNAIL = "https://example.com/thumb.jpg";
    private static final List<String> SAMPLE_IMAGES = List.of("https://example.com/1.jpg", "https://example.com/2.jpg");

    @Mock
    private DummyJsonClient dummyJsonClient;

    private DummyJsonAdapter dummyJsonAdapter;

    @BeforeEach
    void setUp() {
        dummyJsonAdapter = new DummyJsonAdapter(dummyJsonClient);
    }

    private DummyJsonProductDto createDto(String category, String brand) {
        return new DummyJsonProductDto(
                SAMPLE_ID,
                SAMPLE_TITLE,
                SAMPLE_DESCRIPTION,
                category,
                SAMPLE_PRICE,
                SAMPLE_DISCOUNT,
                SAMPLE_RATING,
                SAMPLE_STOCK,
                brand,
                SAMPLE_THUMBNAIL,
                SAMPLE_IMAGES
        );
    }

    @Test
    @DisplayName("Should map all DTO fields accurately to domain Product")
    void toDomain_shouldMapAllFieldsAccurately() {
        // Arrange
        DummyJsonProductDto dto = createDto(KNOWN_CATEGORY_STRING, SAMPLE_BRAND);

        // Act
        Product domainProduct = dummyJsonAdapter.toDomain(dto);

        // Assert
        assertThat(domainProduct).isNotNull();
        assertThat(domainProduct.id()).isEqualTo(SAMPLE_ID);
        assertThat(domainProduct.title()).isEqualTo(SAMPLE_TITLE);
        assertThat(domainProduct.description()).isEqualTo(SAMPLE_DESCRIPTION);
        assertThat(domainProduct.category()).isEqualTo(ProductCategory.BEAUTY);
        assertThat(domainProduct.price()).isEqualTo(SAMPLE_PRICE);
        assertThat(domainProduct.discountPercentage()).isEqualTo(SAMPLE_DISCOUNT);
        assertThat(domainProduct.rating()).isEqualTo(SAMPLE_RATING);
        assertThat(domainProduct.stock()).isEqualTo(SAMPLE_STOCK);
        assertThat(domainProduct.brand()).isEqualTo(SAMPLE_BRAND);
        assertThat(domainProduct.thumbnail()).isEqualTo(SAMPLE_THUMBNAIL);
        assertThat(domainProduct.images()).isEqualTo(SAMPLE_IMAGES);
    }

    @Test
    @DisplayName("Should map unknown category to ProductCategory.OTHER fallback")
    void toDomain_shouldMapUnknownCategoryToOtherFallback() {
        // Arrange
        DummyJsonProductDto dto = createDto(UNKNOWN_CATEGORY_STRING, SAMPLE_BRAND);

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
        DummyJsonProductDto dto = createDto(KNOWN_CATEGORY_STRING, null);

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
        DummyJsonProductDto dto = createDto(KNOWN_CATEGORY_STRING, SAMPLE_BRAND);
        when(dummyJsonClient.getAllProducts()).thenReturn(List.of(dto));

        // Act
        List<Product> products = dummyJsonAdapter.fetchAllProducts();

        // Assert
        assertThat(products).isNotNull().hasSize(1);
        assertThat(products.get(0).id()).isEqualTo(SAMPLE_ID);
        verify(dummyJsonClient).getAllProducts();
    }

    @Test
    @DisplayName("Should fetch product by id and map to domain model")
    void fetchProductById_shouldFetchAndMapToDomainOptional() {
        // Arrange
        DummyJsonProductDto dto = createDto(KNOWN_CATEGORY_STRING, SAMPLE_BRAND);
        when(dummyJsonClient.getProductById(SAMPLE_ID)).thenReturn(Optional.of(dto));

        // Act
        Optional<Product> product = dummyJsonAdapter.fetchProductById(SAMPLE_ID);

        // Assert
        assertThat(product).isPresent();
        assertThat(product.get().id()).isEqualTo(SAMPLE_ID);
        verify(dummyJsonClient).getProductById(SAMPLE_ID);
    }
}
