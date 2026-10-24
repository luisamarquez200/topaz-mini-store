package com.topaz.store.application.service;

import com.topaz.store.ProductFixtures;
import com.topaz.store.domain.model.Product;
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

    private static final long NON_EXISTING_PRODUCT_ID = 999L;
    private static final String EXTERNAL_ERROR_MSG = "Upstream connection failure";

    @Mock
    private ProductExternalPort productExternalPort;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productExternalPort);
    }

    @Test
    @DisplayName("Should return list of products when external port returns products")
    void execute_shouldReturnAllProducts_whenPortReturnsList() {
        // Arrange
        Product product = ProductFixtures.aProduct();
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
        Product expectedProduct = ProductFixtures.aProduct();
        when(productExternalPort.fetchProductById(ProductFixtures.DEFAULT_ID)).thenReturn(Optional.of(expectedProduct));

        // Act
        Optional<Product> actualProduct = productService.execute(ProductFixtures.DEFAULT_ID);

        // Assert
        assertThat(actualProduct).isPresent().contains(expectedProduct);
        verify(productExternalPort).fetchProductById(ProductFixtures.DEFAULT_ID);
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
