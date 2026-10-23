package com.topaz.store.domain.port.in;

import com.topaz.store.domain.model.Product;
import java.util.Optional;

public interface GetProductByIdUseCase {
    Optional<Product> execute(Long id);
}
