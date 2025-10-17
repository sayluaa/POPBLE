package com.popble.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@NoArgsConstructor

//Oauth 2 사용 소셜 로그인
public class SocialLogin {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ouath_id")
	private Long id;

	@OneToOne

	@JoinColumn(name = "user_id")
	private Users users;

	// 소셜로그인(회사)
	// Enum으로 작성해야하는지(카카오,네이버,구글인지)
	@Column(name = "provider")
	private String provider;

	@Column(name = "provider_id", unique = true)
	private String providerId;

	// 토큰번호
	// 토큰 번호를 TEXT로 할지 아니면 그냥 String으로 둘지
	@Column(name = "access_token", columnDefinition = "TEXT")
	private String accessToken;
	
	@Column(name = "nickname")
	private String nickname;
}
