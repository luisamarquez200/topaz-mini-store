package com.topaz.store.infrastructure.adapter.in.rest;

import com.topaz.store.ProductFixtures;
import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.port.in.GetProductByIdUseCase;
import com.topaz.store.domain.port.in.GetProductsUseCase;
import com.topaz.store.infrastructure.exception.ExternalServiceException;
import com.topaz.store.infrastructure.exception.ExternalServiceTimeoutException;
import com.topaz.store.infrastructure.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private static final String BASE_URL = "/api/products";
    private static final String BY_ID_URL = "/api/products/{id}";
    private static final String NON_NUMERIC_ID = "invalid-id";
    private static final long EXISTING_ID = ProductFixtures.DEFAULT_ID;
    private static final long NON_EXISTING_ID = 999L;
    private static final long NON_POSITIVE_ID = -5L;
    private static final String UPSTREAM_ERROR_MSG = "Upstream server returned error 502";
    private static final String UPSTREAM_TIMEOUT_MSG = "Upstream service timed out";
    private static final String UNEXPECTED_SECRET_ERROR = "Secret database connection failed: credentials leak";

    @Mock
    private GetProductsUseCase getProductsUseCase;

    @Mock
    private GetProductByIdUseCase getProductByIdUseCase;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        ProductController controller = new ProductController(getProductsUseCase, getProductByIdUseCase);
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/products should return 200 with list of products")
    void getAllProducts_shouldReturn200_whenProductsExist() throws Exception {
        // Arrange
        Product product = ProductFixtures.aProduct();
        when(getProductsUseCase.execute()).thenReturn(List.of(product));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is(ProductFixtures.DEFAULT_TITLE)))
                .andExpect(jsonPath("$[0].category", is(ProductFixtures.DEFAULT_CATEGORY_STRING)))
                .andExpect(jsonPath("$[0].price", is(ProductFixtures.DEFAULT_PRICE.doubleValue())));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return 200 with product when found")
    void getProductById_shouldReturn200_whenProductExists() throws Exception {
        // Arrange
        Product product = ProductFixtures.aProduct();
        when(getProductByIdUseCase.execute(EXISTING_ID)).thenReturn(Optional.of(product));

        // Act & Assert
        mockMvc.perform(get(BY_ID_URL, EXISTING_ID).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is(ProductFixtures.DEFAULT_TITLE)))
                .andExpect(jsonPath("$.category", is(ProductFixtures.DEFAULT_CATEGORY_STRING)));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return 404 ProblemDetail when product is not found")
    void getProductById_shouldReturn404_whenProductNotFound() throws Exception {
        // Arrange
        when(getProductByIdUseCase.execute(NON_EXISTING_ID)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(get(BY_ID_URL, NON_EXISTING_ID).accept(MediaType.APPLICATION_PROBLEM_JSON, MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.title", is("Resource not found")))
                .andExpect(jsonPath("$.detail", containsString(String.valueOf(NON_EXISTING_ID))));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return 400 ProblemDetail when id is non-numeric")
    void getProductById_shouldReturn400_whenIdIsNotNumeric() throws Exception {
        // Arrange & Act & Assert
        mockMvc.perform(get(BY_ID_URL, NON_NUMERIC_ID).accept(MediaType.APPLICATION_PROBLEM_JSON, MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.title", is("Bad Request")));
    }

    @Test
    @DisplayName("GET /api/products/{id} should return 400 ProblemDetail when id is not positive")
    void getProductById_shouldReturn400_whenIdIsNotPositive() throws Exception {
        // Arrange & Act & Assert
        mockMvc.perform(get(BY_ID_URL, NON_POSITIVE_ID).accept(MediaType.APPLICATION_PROBLEM_JSON, MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
        verifyNoInteractions(getProductByIdUseCase);
    }

    @Test
    @DisplayName("GET /api/products should return 502 ProblemDetail when upstream service fails without exposing internal details")
    void getAllProducts_shouldReturn502_whenUpstreamFails() throws Exception {
        // Arrange
        when(getProductsUseCase.execute()).thenThrow(new ExternalServiceException(UPSTREAM_ERROR_MSG));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).accept(MediaType.APPLICATION_PROBLEM_JSON, MediaType.APPLICATION_JSON))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.status", is(502)))
                .andExpect(jsonPath("$.title", is("Upstream error")))
                .andExpect(jsonPath("$.detail", is("The product catalog is currently unavailable.")));
    }

    @Test
    @DisplayName("GET /api/products should return 504 ProblemDetail when upstream service times out without exposing internal details")
    void getAllProducts_shouldReturn504_whenUpstreamTimesOut() throws Exception {
        // Arrange
        when(getProductsUseCase.execute()).thenThrow(new ExternalServiceTimeoutException(UPSTREAM_TIMEOUT_MSG));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).accept(MediaType.APPLICATION_PROBLEM_JSON, MediaType.APPLICATION_JSON))
                .andExpect(status().isGatewayTimeout())
                .andExpect(jsonPath("$.status", is(504)))
                .andExpect(jsonPath("$.title", is("Upstream timeout")))
                .andExpect(jsonPath("$.detail", is("The product catalog did not respond in time.")));
    }

    @Test
    @DisplayName("GET /api/products should return 500 ProblemDetail without exposing internal secrets on unexpected error")
    void getAllProducts_shouldReturn500_whenUnexpectedExceptionOccurs() throws Exception {
        // Arrange
        when(getProductsUseCase.execute()).thenThrow(new RuntimeException(UNEXPECTED_SECRET_ERROR));

        // Act & Assert
        mockMvc.perform(get(BASE_URL).accept(MediaType.APPLICATION_PROBLEM_JSON, MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status", is(500)))
                .andExpect(jsonPath("$.title", is("Internal server error")))
                .andExpect(jsonPath("$.detail", is("An unexpected error occurred.")))
                .andExpect(jsonPath("$.detail", not(containsString(UNEXPECTED_SECRET_ERROR))));
    }
}
