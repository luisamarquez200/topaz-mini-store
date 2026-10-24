package com.topaz.store;

import com.topaz.store.domain.model.Product;
import com.topaz.store.domain.model.ProductCategory;
import com.topaz.store.infrastructure.adapter.out.external.dto.DummyJsonProductDto;

import java.math.BigDecimal;
import java.util.List;

public final class ProductFixtures {

    public static final Long DEFAULT_ID = 1L;
    public static final String DEFAULT_TITLE = "Essence Mascara";
    public static final String DEFAULT_DESCRIPTION = "High volume mascara";
    public static final ProductCategory DEFAULT_CATEGORY = ProductCategory.BEAUTY;
    public static final String DEFAULT_CATEGORY_STRING = "beauty";
    public static final BigDecimal DEFAULT_PRICE = new BigDecimal("9.99");
    public static final Double DEFAULT_DISCOUNT = 10.0;
    public static final Double DEFAULT_RATING = 4.5;
    public static final Integer DEFAULT_STOCK = 50;
    public static final String DEFAULT_BRAND = "Essence";
    public static final String DEFAULT_THUMBNAIL = "https://example.com/thumb.jpg";
    public static final List<String> DEFAULT_IMAGES = List.of("https://example.com/img1.jpg");

    private ProductFixtures() {
    }

    public static Product aProduct() {
        return aProduct(DEFAULT_ID);
    }

    public static Product aProduct(Long id) {
        return new Product(
                id,
                DEFAULT_TITLE,
                DEFAULT_DESCRIPTION,
                DEFAULT_CATEGORY,
                DEFAULT_PRICE,
                DEFAULT_DISCOUNT,
                DEFAULT_RATING,
                DEFAULT_STOCK,
                DEFAULT_BRAND,
                DEFAULT_THUMBNAIL,
                DEFAULT_IMAGES
        );
    }

    public static DummyJsonProductDto aDto() {
        return aDto(DEFAULT_CATEGORY_STRING, DEFAULT_BRAND);
    }

    public static DummyJsonProductDto aDto(String category, String brand) {
        return new DummyJsonProductDto(
                DEFAULT_ID,
                DEFAULT_TITLE,
                DEFAULT_DESCRIPTION,
                category,
                DEFAULT_PRICE,
                DEFAULT_DISCOUNT,
                DEFAULT_RATING,
                DEFAULT_STOCK,
                brand,
                DEFAULT_THUMBNAIL,
                DEFAULT_IMAGES
        );
    }
}
