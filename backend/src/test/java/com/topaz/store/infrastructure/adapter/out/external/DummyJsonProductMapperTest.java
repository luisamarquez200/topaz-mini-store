package com.topaz.store.infrastructure.adapter.out.external;

import com.topaz.store.ProductFixtures;
import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.model.ProductCategory;
import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class DummyJsonProductMapperTest {

    private static final String UNKNOWN_CATEGORY_STRING = "spacecraft-electronics";

    private DummyJsonProductMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new DummyJsonProductMapper();
    }

    @Test
    @DisplayName("Should map all DTO fields accurately to domain Product")
    void toDomain_shouldMapAllFieldsAccurately() {
        // Arrange
        DummyJsonProductDto dto = ProductFixtures.aDto();

        // Act
        Product domainProduct = mapper.toDomain(dto);

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
        Product domainProduct = mapper.toDomain(dto);

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
        Product domainProduct = mapper.toDomain(dto);

        // Assert
        assertThat(domainProduct).isNotNull();
        assertThat(domainProduct.brand()).isNull();
    }

    @Test
    @DisplayName("Should throw NullPointerException when DTO is null")
    void toDomain_shouldThrowNullPointerException_whenDtoIsNull() {
        // Arrange & Act & Assert
        assertThatThrownBy(() -> mapper.toDomain(null))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("DummyJsonProductDto must not be null");
    }
}
