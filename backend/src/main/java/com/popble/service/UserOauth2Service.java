 package com.popble.service;

 import java.util.Collections;
 import java.util.HashMap;
 import java.util.Map;

 import org.springframework.security.core.authority.SimpleGrantedAuthority;
 import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
 import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
 import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
 import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
 import org.springframework.security.oauth2.core.user.OAuth2User;
 import org.springframework.stereotype.Service;

 import jakarta.servlet.http.HttpSession;
 import lombok.RequiredArgsConstructor;
 import lombok.extern.log4j.Log4j2;

 @Log4j2
 @RequiredArgsConstructor
 @Service
 public class UserOauth2Service extends DefaultOAuth2UserService {

     private final HttpSession httpSession;

     @Override
     public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

         String registrationId = userRequest.getClientRegistration().getRegistrationId();

         OAuth2User oAuth2User = super.loadUser(userRequest);
         Map<String, Object> originnalattributes = oAuth2User.getAttributes();
         Map<String, Object> attributes = new HashMap<>(originnalattributes);

         if ("kakao".equals(registrationId)) {

             Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");

             if (properties != null) {
                 String nickname = (String) properties.get("nickname");
             }

         } else if ("naver".equals(registrationId)) {

             Map<String, Object> response = (Map<String, Object>) attributes.get("response");
             attributes.put("id", response.get("id"));

             if (response != null) {
                 log.info("=======================response==========================================");
                 String nickname = (String) response.get("nickname");
             }

         } else if ("google".equals(registrationId)) {
             Map<String, Object> sub = (Map<String, Object>) attributes.get("sub");

             if (sub != null) {
                 String profile = (String) sub.get("profile");
             }
         }

         return new DefaultOAuth2User(Collections.singleton(new SimpleGrantedAuthority("MEMBER")), attributes, "id");
     }
 }
