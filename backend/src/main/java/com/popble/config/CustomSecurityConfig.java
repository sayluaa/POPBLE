package com.popble.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.popble.repository.UserRepository;
import com.popble.security.filter.JWTCheckFilter;
import com.popble.security.handlr.APILoginFailHandler;
import com.popble.security.handlr.APILoginSussessHandler;
import com.popble.security.handlr.Oauth2AuthenticationSuccessHandler;
import com.popble.service.UserOauth2Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@Log4j2
@EnableMethodSecurity
@RequiredArgsConstructor
public class CustomSecurityConfig {

   private final Oauth2AuthenticationSuccessHandler oauth2AuthenticationSuccessHandler;
   private final UserOauth2Service userOauth2Service;

   private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors(c -> c.configurationSource(corsConfigurationSource()));
        http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.csrf(csrf -> csrf.disable());

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.GET, "/files/**").permitAll()
                .requestMatchers("/", "/index.html", "/favicon.ico",
                        "/static/**", "/webjars/**", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers("/api/user/login", "/error").permitAll()
                .anyRequest().permitAll()
        );

        http.formLogin(config -> {
            config.loginPage("/api/user/login");
            config.successHandler(new APILoginSussessHandler());
            config.failureHandler(new APILoginFailHandler());
        });

        http.oauth2Login(oauth2 -> oauth2
                .failureUrl("/login?error=true")
                .defaultSuccessUrl("/user/success")
                .successHandler(oauth2AuthenticationSuccessHandler)
                .userInfoEndpoint(userInfo -> userInfo.userService(userOauth2Service))
        );

         http.addFilterBefore(new JWTCheckFilter(userRepository), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000","http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
