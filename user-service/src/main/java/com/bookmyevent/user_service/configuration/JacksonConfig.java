package com.bookmyevent.user_service.configuration;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.MapperFeature;

@Configuration
public class JacksonConfig {

    @Bean
    public JsonMapperBuilderCustomizer jsonMapperBuilderCustomizer() {
        return builder -> builder
                // This smoothly disables alphabetical sorting globally across your app
                .disable(MapperFeature.SORT_PROPERTIES_ALPHABETICALLY);
    }
}