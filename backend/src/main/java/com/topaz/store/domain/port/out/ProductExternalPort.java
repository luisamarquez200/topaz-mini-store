package com.topaz.store.domain.port.out;

import com.topaz.store.domain.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductExternalPort {
    List<Product> fetchAllProducts();
    Optional<Product> fetchProductById(Long id);
}
