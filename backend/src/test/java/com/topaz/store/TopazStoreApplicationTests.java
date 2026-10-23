package com.topaz.store;

import com.topaz.store.application.service.ProductService;
import com.topaz.store.domain.port.in.GetProductByIdUseCase;
import com.topaz.store.domain.port.in.GetProductsUseCase;
import com.topaz.store.domain.port.out.ProductExternalPort;
import com.topaz.store.infrastructure.adapter.in.rest.ProductController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class TopazStoreApplicationTests {

    @Autowired
    private ApplicationContext applicationContext;

    @Autowired
    private ProductService productService;

    @Autowired
    private GetProductsUseCase getProductsUseCase;

    @Autowired
    private GetProductByIdUseCase getProductByIdUseCase;

    @Autowired
    private ProductExternalPort productExternalPort;

    @Autowired
    private ProductController productController;

    @Test
    @DisplayName("Context should load and BeanConfiguration should wire hexagonal beans properly")
    void contextLoads_andWiresHexagonalArchitecture() {
        // Arrange
        // Dependencies injected via @SpringBootTest

        // Act
        boolean contextLoaded = applicationContext != null;

        // Assert
        assertThat(contextLoaded).isTrue();
        assertThat(productService).isNotNull();
        assertThat(getProductsUseCase).isNotNull().isSameAs(productService);
        assertThat(getProductByIdUseCase).isNotNull().isSameAs(productService);
        assertThat(productExternalPort).isNotNull();
        assertThat(productController).isNotNull();
    }
}
