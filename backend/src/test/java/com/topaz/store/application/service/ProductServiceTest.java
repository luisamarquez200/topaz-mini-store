package com.topaz.store.application.service;

import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.model.ProductCategory;
import com.topaz.store.domain.port.out.ProductExternalPort;
import com.topaz.store.infrastructure.exception.ExternalServiceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    private static final Long SAMPLE_PRODUCT_ID = 1L;
    private static final Long NON_EXISTING_PRODUCT_ID = 999L;
    private static final String SAMPLE_TITLE = "Essence Mascara";
    private static final String SAMPLE_DESCRIPTION = "High volume mascara";
    private static final ProductCategory SAMPLE_CATEGORY = ProductCategory.BEAUTY;
    private static final Double SAMPLE_PRICE = 9.99;
    private static final Double SAMPLE_DISCOUNT = 10.0;
    private static final Double SAMPLE_RATING = 4.5;
    private static final Integer SAMPLE_STOCK = 50;
    private static final String SAMPLE_BRAND = "Essence";
    private static final String SAMPLE_THUMBNAIL = "https://example.com/thumb.jpg";
    private static final List<String> SAMPLE_IMAGES = List.of("https://example.com/img1.jpg");
    private static final String EXTERNAL_ERROR_MSG = "Upstream connection failure";

    @Mock
    private ProductExternalPort productExternalPort;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productExternalPort);
    }

    private Product createSampleProduct(Long id) {
        return new Product(
                id,
                SAMPLE_TITLE,
                SAMPLE_DESCRIPTION,
                SAMPLE_CATEGORY,
                SAMPLE_PRICE,
                SAMPLE_DISCOUNT,
                SAMPLE_RATING,
                SAMPLE_STOCK,
                SAMPLE_BRAND,
                SAMPLE_THUMBNAIL,
                SAMPLE_IMAGES
        );
    }

    @Test
    @DisplayName("Should return list of products when external port returns products")
    void execute_shouldReturnAllProducts_whenPortReturnsList() {
        // Arrange
        Product product = createSampleProduct(SAMPLE_PRODUCT_ID);
        List<Product> expectedProducts = List.of(product);
        when(productExternalPort.fetchAllProducts()).thenReturn(expectedProducts);

        // Act
        List<Product> actualProducts = productService.execute();

        // Assert
        assertThat(actualProducts).isNotNull().hasSize(1);
        assertThat(actualProducts.get(0)).isEqualTo(product);
        verify(productExternalPort).fetchAllProducts();
    }

    @Test
    @DisplayName("Should return product when found by id")
    void execute_shouldReturnProduct_whenPortReturnsProductById() {
        // Arrange
        Product expectedProduct = createSampleProduct(SAMPLE_PRODUCT_ID);
        when(productExternalPort.fetchProductById(SAMPLE_PRODUCT_ID)).thenReturn(Optional.of(expectedProduct));

        // Act
        Optional<Product> actualProduct = productService.execute(SAMPLE_PRODUCT_ID);

        // Assert
        assertThat(actualProduct).isPresent().contains(expectedProduct);
        verify(productExternalPort).fetchProductById(SAMPLE_PRODUCT_ID);
    }

    @Test
    @DisplayName("Should return empty optional when product does not exist")
    void execute_shouldReturnEmpty_whenPortReturnsEmptyById() {
        // Arrange
        when(productExternalPort.fetchProductById(NON_EXISTING_PRODUCT_ID)).thenReturn(Optional.empty());

        // Act
        Optional<Product> actualProduct = productService.execute(NON_EXISTING_PRODUCT_ID);

        // Assert
        assertThat(actualProduct).isEmpty();
        verify(productExternalPort).fetchProductById(NON_EXISTING_PRODUCT_ID);
    }

    @Test
    @DisplayName("Should return empty optional when id is null without calling port")
    void execute_shouldReturnEmpty_whenIdIsNull() {
        // Arrange
        Long nullId = null;

        // Act
        Optional<Product> actualProduct = productService.execute(nullId);

        // Assert
        assertThat(actualProduct).isEmpty();
    }

    @Test
    @DisplayName("Should propagate external service exception when port throws exception")
    void execute_shouldPropagateException_whenPortThrowsException() {
        // Arrange
        when(productExternalPort.fetchAllProducts()).thenThrow(new ExternalServiceException(EXTERNAL_ERROR_MSG));

        // Act & Assert
        assertThatThrownBy(() -> productService.execute())
                .isInstanceOf(ExternalServiceException.class)
                .hasMessage(EXTERNAL_ERROR_MSG);
        verify(productExternalPort).fetchAllProducts();
    }
}
