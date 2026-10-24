package com.topaz.store.infrastructure.adapter.out.external.client;

import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;
import com.topaz.store.infrastructure.exception.ExternalServiceException;
import com.topaz.store.infrastructure.exception.ExternalServiceTimeoutException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.net.SocketTimeoutException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withResourceNotFound;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class DummyJsonClientTest {

    private static final String BASE_URL = "https://dummyjson.com";
    private static final String PRODUCTS_ENDPOINT = BASE_URL + "/products?limit=0";
    private static final String PRODUCT_BY_ID_ENDPOINT = BASE_URL + "/products/1";
    private static final String NON_EXISTING_ENDPOINT = BASE_URL + "/products/999";
    private static final long EXISTING_PRODUCT_ID = 1L;
    private static final long NON_EXISTING_PRODUCT_ID = 999L;
    private static final String TIMEOUT_MESSAGE = "Read timed out";

    private static final String ENVELOPE_JSON_RESPONSE = """
            {
              "products": [
                {
                  "id": 1,
                  "title": "Essence Mascara Lash Princess",
                  "description": "Popular mascara",
                  "category": "beauty",
                  "price": 9.99,
                  "discountPercentage": 10.48,
                  "rating": 2.56,
                  "stock": 99,
                  "brand": "Essence",
                  "thumbnail": "https://cdn.dummyjson.com/thumb.png",
                  "images": ["https://cdn.dummyjson.com/1.png"]
                }
              ],
              "total": 1,
              "skip": 0,
              "limit": 0
            }
            """;

    private static final String SINGLE_PRODUCT_JSON_RESPONSE = """
            {
              "id": 1,
              "title": "Essence Mascara Lash Princess",
              "description": "Popular mascara",
              "category": "beauty",
              "price": 9.99,
              "discountPercentage": 10.48,
              "rating": 2.56,
              "stock": 99,
              "brand": "Essence",
              "thumbnail": "https://cdn.dummyjson.com/thumb.png",
              "images": ["https://cdn.dummyjson.com/1.png"]
            }
            """;

    private MockRestServiceServer mockServer;
    private DummyJsonClient dummyJsonClient;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder().baseUrl(BASE_URL);
        mockServer = MockRestServiceServer.bindTo(builder).build();
        dummyJsonClient = new DummyJsonClient(builder.build());
    }

    @Test
    @DisplayName("Should unwrap envelope and return all products when upstream returns 200")
    void getAllProducts_shouldUnwrapEnvelope_whenUpstreamReturnsSuccess() {
        // Arrange
        mockServer.expect(requestTo(PRODUCTS_ENDPOINT))
                .andRespond(withSuccess(ENVELOPE_JSON_RESPONSE, MediaType.APPLICATION_JSON));

        // Act
        List<DummyJsonProductDto> products = dummyJsonClient.getAllProducts();

        // Assert
        mockServer.verify();
        assertThat(products).isNotNull().hasSize(1);
        DummyJsonProductDto product = products.get(0);
        assertThat(product.id()).isEqualTo(EXISTING_PRODUCT_ID);
        assertThat(product.title()).isEqualTo("Essence Mascara Lash Princess");
        assertThat(product.category()).isEqualTo("beauty");
        assertThat(product.price()).isEqualTo(9.99);
    }

    @Test
    @DisplayName("Should return product by id when upstream returns 200")
    void getProductById_shouldReturnProduct_whenUpstreamReturnsSuccess() {
        // Arrange
        mockServer.expect(requestTo(PRODUCT_BY_ID_ENDPOINT))
                .andRespond(withSuccess(SINGLE_PRODUCT_JSON_RESPONSE, MediaType.APPLICATION_JSON));

        // Act
        Optional<DummyJsonProductDto> product = dummyJsonClient.getProductById(EXISTING_PRODUCT_ID);

        // Assert
        mockServer.verify();
        assertThat(product).isPresent();
        assertThat(product.get().id()).isEqualTo(EXISTING_PRODUCT_ID);
        assertThat(product.get().title()).isEqualTo("Essence Mascara Lash Princess");
    }

    @Test
    @DisplayName("Should return empty optional when upstream returns 404")
    void getProductById_shouldReturnEmpty_whenUpstreamReturns404() {
        // Arrange
        mockServer.expect(requestTo(NON_EXISTING_ENDPOINT))
                .andRespond(withResourceNotFound());

        // Act
        Optional<DummyJsonProductDto> product = dummyJsonClient.getProductById(NON_EXISTING_PRODUCT_ID);

        // Assert
        mockServer.verify();
        assertThat(product).isEmpty();
    }

    @Test
    @DisplayName("Should throw ExternalServiceException when upstream returns 500")
    void getAllProducts_shouldThrowExternalServiceException_whenUpstreamReturns500() {
        // Arrange
        mockServer.expect(requestTo(PRODUCTS_ENDPOINT))
                .andRespond(withServerError());

        // Act & Assert
        assertThatThrownBy(() -> dummyJsonClient.getAllProducts())
                .isInstanceOf(ExternalServiceException.class)
                .hasMessageContaining("DummyJSON failed trying to fetch products");
        mockServer.verify();
    }

    @Test
    @DisplayName("Should throw ExternalServiceTimeoutException when request times out")
    void getAllProducts_shouldThrowExternalServiceTimeoutException_whenRequestTimesOut() {
        // Arrange
        mockServer.expect(requestTo(PRODUCTS_ENDPOINT))
                .andRespond(request -> {
                    throw new SocketTimeoutException(TIMEOUT_MESSAGE);
                });

        // Act & Assert
        assertThatThrownBy(() -> dummyJsonClient.getAllProducts())
                .isInstanceOf(ExternalServiceTimeoutException.class)
                .hasMessageContaining("Timeout trying to fetch products")
                .hasRootCauseInstanceOf(SocketTimeoutException.class);
        mockServer.verify();
    }
}
