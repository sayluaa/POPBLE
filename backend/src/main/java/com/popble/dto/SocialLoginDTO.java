package com.popble.dto;

import org.springframework.stereotype.Component;

import com.popble.domain.SocialLogin;
import com.popble.domain.Users;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Component
public class SocialLoginDTO extends SocialLogin {

	//oauth2 id
	private Long id;
	
	private Users users;
	//소셜로그인(회사)
	private String provider;
	//소셜로그인아이디
	private String providerId;
	//토큰번호
	private String accessToken;
	//닉네임
	private String nickname;
}
