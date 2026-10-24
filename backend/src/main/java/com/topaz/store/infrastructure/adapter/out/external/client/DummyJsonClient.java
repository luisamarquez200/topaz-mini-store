package com.topaz.store.infrastructure.adapter.out.external.client;

import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;
import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductsResponseDto;
import com.topaz.store.infrastructure.exception.ExternalServiceException;
import com.topaz.store.infrastructure.exception.ExternalServiceTimeoutException;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.net.SocketTimeoutException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeoutException;
import java.util.function.Supplier;

@Component
public class DummyJsonClient {

    private static final String PRODUCTS_PATH = "/products";
    private static final String PRODUCT_BY_ID_PATH = "/products/{id}";
    private static final String LIMIT_PARAM = "limit";
    private static final int NO_LIMIT = 0;
    private static final String OP_FETCH_ALL = "fetch products";
    private static final String OP_FETCH_BY_ID = "fetch product %d";

    private final RestClient restClient;

    public DummyJsonClient(RestClient dummyJsonRestClient) {
        this.restClient = dummyJsonRestClient;
    }

    public List<DummyJsonProductDto> getAllProducts() {
        DummyJsonProductsResponseDto response = call(OP_FETCH_ALL, () -> restClient.get()
                .uri(uri -> uri.path(PRODUCTS_PATH).queryParam(LIMIT_PARAM, NO_LIMIT).build())
                .retrieve()
                .body(DummyJsonProductsResponseDto.class));
        if (response == null || response.products() == null) {
            throw new ExternalServiceException("Invalid payload received from DummyJSON");
        }
        return response.products();
    }

    public Optional<DummyJsonProductDto> getProductById(long id) {
        return call(OP_FETCH_BY_ID.formatted(id), () -> {
            try {
                return Optional.ofNullable(restClient.get()
                        .uri(PRODUCT_BY_ID_PATH, id)
                        .retrieve()
                        .body(DummyJsonProductDto.class));
            } catch (HttpClientErrorException.NotFound notFound) {
                return Optional.empty();
            }
        });
    }

    /** Único punto donde se traducen los errores de transporte. */
    private <T> T call(String operation, Supplier<T> action) {
        try {
            return action.get();
        } catch (ResourceAccessException ex) {
            throw isTimeout(ex)
                    ? new ExternalServiceTimeoutException("Timeout trying to " + operation, ex)
                    : new ExternalServiceException("Network error trying to " + operation, ex);
        } catch (RestClientException ex) {
            throw new ExternalServiceException("DummyJSON failed trying to " + operation, ex);
        }
    }

    private boolean isTimeout(Throwable throwable) {
        for (Throwable c = throwable; c != null; c = c.getCause()) {
            if (c instanceof SocketTimeoutException || c instanceof TimeoutException) {
                return true;
            }
        }
        return false;
    }
}
