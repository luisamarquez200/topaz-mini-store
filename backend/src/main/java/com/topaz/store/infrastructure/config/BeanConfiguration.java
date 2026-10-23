package com.topaz.store.infrastructure.config;

import com.topaz.store.application.service.ProductService;
import com.topaz.store.domain.port.out.ProductExternalPort;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(DummyJsonProperties.class)
public class BeanConfiguration {

    @Bean
    public ProductService productService(ProductExternalPort productExternalPort) {
        return new ProductService(productExternalPort);
    }
}
