package com.topaz.store.infrastructure.config;

import com.topaz.store.application.service.ProductService;
import com.topaz.store.domain.port.out.ProductExternalPort;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(DummyJsonProperties.class)
public class BeanConfiguration {

    @Bean
    RestClient dummyJsonRestClient(RestClient.Builder builder, DummyJsonProperties props) {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(props.getConnectTimeout())
                .build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(props.getReadTimeout());
        return builder.baseUrl(props.getBaseUrl()).requestFactory(factory).build();
    }

    @Bean
    public ProductService productService(ProductExternalPort productExternalPort) {
        return new ProductService(productExternalPort);
    }
}
