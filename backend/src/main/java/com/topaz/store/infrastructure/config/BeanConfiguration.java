package com.topaz.store.infrastructure.config;

import com.topaz.store.application.service.ProductService;
import com.topaz.store.domain.port.out.ProductExternalPort;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(DummyJsonProperties.class)
public class BeanConfiguration {

    @Bean
    RestClient dummyJsonRestClient(RestClient.Builder builder, DummyJsonProperties props) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Math.toIntExact(props.getConnectTimeout().toMillis()));
        factory.setReadTimeout(Math.toIntExact(props.getReadTimeout().toMillis()));
        return builder.baseUrl(props.getBaseUrl()).requestFactory(factory).build();
    }

    @Bean
    public ProductService productService(ProductExternalPort productExternalPort) {
        return new ProductService(productExternalPort);
    }
}
