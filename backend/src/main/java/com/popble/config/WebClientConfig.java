package com.popble.config; // 패키지명은 프로젝트에 맞게 수정하세요

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration(proxyBeanMethods = false)
public class WebClientConfig {

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    // 카카오 API의 기본 URL
    private static final String KAKAO_API_BASE_URL = "https://dapi.kakao.com/v2/local/search/";

    //생성자를 통해 @Value 값을 주입받아 안정성을 높임
    public WebClientConfig(@Value("${kakao.api.key}") String kakaoApiKey) {
        this.kakaoApiKey = kakaoApiKey;
    }
    
    @Bean
    public WebClient kakaoWebClient() {
        return WebClient.builder()
                .baseUrl(KAKAO_API_BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "KakaoAK " + kakaoApiKey) // 카카오 API 키 설정
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}