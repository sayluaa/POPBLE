package com.popble.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
		
	//메세지 보낼 url send /app/message
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/topic");	//구독 경로
		registry.setApplicationDestinationPrefixes("/app");	//발행 경로
	}
	
	//URL chatting -> 웹소켓 연결 주소
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/chatting")	//엔드포인트
				.setAllowedOriginPatterns("*")	//CORS 허용 (패턴 사용)
				.withSockJS();	//SockJS 사용
	}
}