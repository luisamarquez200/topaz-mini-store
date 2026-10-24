package com.topaz.store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TopazStoreApplication {

    public static final String CACHE_PRODUCTS = "products";
    public static final String CACHE_PRODUCT_BY_ID = "productById";

    public static void main(String[] args) {
        SpringApplication.run(TopazStoreApplication.class, args);
    }
}
