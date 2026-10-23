package com.topaz.store.infrastructure.adapter.out.external.client;

import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;
import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductsResponseDto;
import com.topaz.store.infrastructure.config.DummyJsonProperties;
import com.topaz.store.infrastructure.exception.ExternalServiceException;
import com.topaz.store.infrastructure.exception.ExternalServiceTimeoutException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.net.SocketTimeoutException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeoutException;

@Component
public class DummyJsonClient {

    private static final class UpstreamNotFoundException extends RuntimeException {}

    private final RestClient restClient;

    @Autowired
    public DummyJsonClient(RestClient.Builder restClientBuilder, DummyJsonProperties properties) {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout((int) properties.getConnectTimeout().toMillis());
        requestFactory.setReadTimeout((int) properties.getReadTimeout().toMillis());

        this.restClient = restClientBuilder
                .baseUrl(properties.getBaseUrl())
                .requestFactory(requestFactory)
                .build();
    }

    public DummyJsonClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public List<DummyJsonProductDto> getAllProducts() {
        try {
            DummyJsonProductsResponseDto response = restClient.get()
                    .uri("/products?limit=0")
                    .retrieve()
                    .onStatus(HttpStatusCode::is5xxServerError, (request, resp) -> {
                        throw new ExternalServiceException("External service returned server error: " + resp.getStatusCode());
                    })
                    .onStatus(HttpStatusCode::is4xxClientError, (request, resp) -> {
                        throw new ExternalServiceException("External service returned client error: " + resp.getStatusCode());
                    })
                    .body(DummyJsonProductsResponseDto.class);

            if (response == null || response.products() == null) {
                throw new ExternalServiceException("Invalid payload received from external service");
            }
            return response.products();
        } catch (ExternalServiceTimeoutException | ExternalServiceException ex) {
            throw ex;
        } catch (ResourceAccessException ex) {
            if (isTimeoutException(ex)) {
                throw new ExternalServiceTimeoutException("Timeout communicating with external service: " + ex.getMessage(), ex);
            }
            throw new ExternalServiceException("Network error communicating with external service: " + ex.getMessage(), ex);
        } catch (RestClientResponseException ex) {
            throw new ExternalServiceException("External service returned error " + ex.getStatusCode() + ": " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            throw new ExternalServiceException("Failed to fetch products from external service: " + ex.getMessage(), ex);
        }
    }

    public Optional<DummyJsonProductDto> getProductById(Long id) {
        try {
            DummyJsonProductDto product = restClient.get()
                    .uri("/products/{id}", id)
                    .retrieve()
                    .onStatus(status -> status.value() == 404, (request, resp) -> {
                        throw new UpstreamNotFoundException();
                    })
                    .onStatus(HttpStatusCode::is5xxServerError, (request, resp) -> {
                        throw new ExternalServiceException("External service returned server error: " + resp.getStatusCode());
                    })
                    .onStatus(HttpStatusCode::is4xxClientError, (request, resp) -> {
                        throw new ExternalServiceException("External service returned client error: " + resp.getStatusCode());
                    })
                    .body(DummyJsonProductDto.class);

            return Optional.ofNullable(product);
        } catch (UpstreamNotFoundException ex) {
            return Optional.empty();
        } catch (ExternalServiceTimeoutException | ExternalServiceException ex) {
            throw ex;
        } catch (ResourceAccessException ex) {
            if (isTimeoutException(ex)) {
                throw new ExternalServiceTimeoutException("Timeout communicating with external service: " + ex.getMessage(), ex);
            }
            throw new ExternalServiceException("Network error communicating with external service: " + ex.getMessage(), ex);
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().value() == 404) {
                return Optional.empty();
            }
            throw new ExternalServiceException("External service returned error " + ex.getStatusCode() + ": " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            throw new ExternalServiceException("Failed to fetch product from external service: " + ex.getMessage(), ex);
        }
    }

    private boolean isTimeoutException(ResourceAccessException ex) {
        Throwable cause = ex.getCause();
        while (cause != null) {
            if (cause instanceof SocketTimeoutException
                    || cause instanceof TimeoutException
                    || (cause.getMessage() != null && cause.getMessage().toLowerCase().contains("timed out"))) {
                return true;
            }
            cause = cause.getCause();
        }
        return ex.getMessage() != null && ex.getMessage().toLowerCase().contains("timed out");
    }
}
