package com.popble.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsGlobalFilterConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        // 쿠키/세션 안 쓸거면 false 권장 (true면 프론트 fetch/axios에도 withCredentials 필요)

        config.setAllowCredentials(false);
        config.setAllowedOrigins(List.of("http://localhost:3000", "http://127.0.0.1:3000"));

        config.addAllowedHeader("*");
        config.addAllowedMethod("*"); // GET, POST, PUT, PATCH, DELETE, OPTIONS

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
