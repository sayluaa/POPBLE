package com.popble.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.popble.formatter.LocalDateFormatter;

@Configuration
public class CustomServletConfig implements WebMvcConfigurer{

	public void addFormatters(FormatterRegistry registry) {
		registry.addFormatter(new LocalDateFormatter());
	}
	
//	public void addCorsMappings(CorsRegistry registry) {
//		registry.addMapping("/**")
//		.allowedOrigins("http://localhost:3000")
//		.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
//		.allowedHeaders("Authorization", "Cache-Control", "Content-Type")
//		.allowCredentials(true)
//		.maxAge(3600);
//	}

}
