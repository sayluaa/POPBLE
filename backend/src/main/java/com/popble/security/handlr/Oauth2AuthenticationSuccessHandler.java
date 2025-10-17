package com.popble.security.handlr;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.PrivateKey;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.popble.domain.Role;
import com.popble.domain.SocialLogin;
import com.popble.domain.Users;
import com.popble.dto.SocialLoginDTO;
import com.popble.dto.UserDTO;
import com.popble.repository.SocialLoginRepository;
import com.popble.repository.UserRepository;
import com.popble.service.PopupStoreServiceImpl;
import com.popble.util.JWTUtill;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
@RequiredArgsConstructor
public class Oauth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	private final PopupStoreServiceImpl popupStoreServiceImpl;
	private final SocialLoginDTO socialLoginDTO;

	private final SocialLoginRepository socialLoginRepository;

	private final UserRepository userRepository;
//	private final JWTUtill jwtUtill;
	
	//사용 가능하지만 위에처럼 @RequiredArgsConstructor일때 생성자 주입으로 사용하는것이 더 바람직한..?
	@Autowired
	JWTUtill jwtUtill;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {

		// login 성공한 사용자 목록

		String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();
		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
		Map<String, Object> attributes = oAuth2User.getAttributes();

		String nickname = "";
		String name = "";
		String providerId = "";
		Map<String, Object> claims = new HashMap<>();

		if ("kakao".equals(registrationId)) {

			providerId = String.valueOf(attributes.get("id"));

			Map<String, Object> kakao_account = (Map<String, Object>) oAuth2User.getAttributes().get("kakao_account");
			Map<String, Object> properties = (Map<String, Object>) oAuth2User.getAttributes().get("properties");
			nickname = (String) properties.get("nickname");
			claims.put("provider", "kakao");
			claims.put("providerId", providerId);
			claims.put("nickname", nickname);

			socialLoginDTO.setProvider("kakao");
			socialLoginDTO.setNickname(nickname);
			socialLoginDTO.setProviderId(providerId);

		} else if ("google".equals(registrationId)) {
			String sub = (String) attributes.get("sub");
			providerId = sub;

			nickname = (String) oAuth2User.getAttributes().get("name");
			claims.put("provider", "google");

			socialLoginDTO.setProvider("google");
			socialLoginDTO.setNickname(nickname);
			socialLoginDTO.setProviderId(providerId);
			socialLoginDTO.setProviderId(sub);

		} else if ("naver".equals(registrationId)) {
			Map<String, Object> responses = (Map<String, Object>) attributes.get("response");
			providerId = (String) responses.get("id");

			Map<String, Object> responseMap = (Map<String, Object>) oAuth2User.getAttributes().get("response");
			nickname = (String) responseMap.get("name");
			claims.put("provider", "naver");

			socialLoginDTO.setProvider("naver");
			socialLoginDTO.setNickname(nickname);
			socialLoginDTO.setProviderId(providerId);

		}

		claims.put("nickname", nickname);
		claims.put("providerid", providerId);

		Optional<SocialLogin> existing = socialLoginRepository.findByProviderId(providerId);

		int tokenTime = 60 * 24;

		String jwt = jwtUtill.generateToken(claims, tokenTime);
		Users users = new Users();
		// 중복 저장
		if (!existing.isPresent()) {
			SocialLogin socialLogin = new SocialLogin();

			users.setEmail(name);
			users.setLoginId(name);
			users.setName(socialLoginDTO.getNickname());
			users.setPassword(name);
			users.setPhonenumber(name);
			users.setRole(Role.MEMBER);
			users.setSocial(true);

			users = userRepository.save(users);

			socialLogin.setAccessToken(jwt);
			socialLogin.setProvider(socialLoginDTO.getProvider());
			socialLogin.setProviderId(socialLoginDTO.getProviderId());
			socialLogin.setNickname(socialLoginDTO.getNickname());
			socialLogin.setUsers(users);

			socialLoginRepository.save(socialLogin);
		}

		// users = socialLoginRepository.findUsersByProviderId(providerId).orElse(null);

		String url = jwtUtill.makeRedirectUrl(jwt, users);
		System.out.println("url:" + url);


		if (response.isCommitted()) {
			logger.debug("응답이 이미 커밋된 상태입니다." + url + "로 리다이렉트 하도록 바꿀 수 없습니다.");
			return;
		}
		getRedirectStrategy().sendRedirect(request, response, url);
		log.info(
				"======================================getRedirectStrategy======================================================");
	}

	private String makeRedirectUrl(String token, Users users) {
		try {
			Map<String, Object> userMap = new HashMap<>();
			userMap.put("id", users.getId());
			userMap.put("email", users.getEmail());
			userMap.put("loginId", users.getLoginId());
			userMap.put("name", users.getName());
			userMap.put("role", users.getRole());
			userMap.put("social", users.isSocial());

			ObjectMapper objectMapper = new ObjectMapper();
			String userJson = URLEncoder.encode(objectMapper.writeValueAsString(userMap), StandardCharsets.UTF_8);

			return UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect")
					.queryParam("token", token).queryParam("user", userJson).build().toUriString();

		} catch (Exception e) {
			log.error("유저 정보 직렬화 실패", e);
			return "http://localhost:3000/oauth2/redirect" + token;
		}
	}
}

