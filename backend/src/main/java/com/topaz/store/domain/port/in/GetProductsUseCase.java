package com.topaz.store.domain.port.in;

import com.topaz.store.domain.model.Product;
import java.util.List;

public interface GetProductsUseCase {
    List<Product> execute();
}
