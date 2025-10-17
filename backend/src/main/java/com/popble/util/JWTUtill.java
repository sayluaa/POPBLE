package com.popble.util;

import java.net.URLEncoder;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.popble.domain.Users;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class JWTUtill {

	private static String key = "1234567890123456789012345678901234567890";

	public static String generateToken(Map<String, Object> valMap, int min) {
		SecretKey key = null;

		try {
			key = Keys.hmacShaKeyFor(JWTUtill.key.getBytes("UTF-8"));
		} catch (Exception e) {
			throw new RuntimeException(e.getMessage());

		}

		String jwtStr = Jwts.builder().setHeader(Map.of("typ", "JWT")).setClaims(valMap)
				.setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
				.setExpiration(Date.from(ZonedDateTime.now().plusMinutes(min).toInstant())).signWith(key).compact();
		return jwtStr;
	}

	public String makeRedirectUrl(String jwt, Users users  ) {
	    try {
	        ObjectMapper mapper = new ObjectMapper();
	        String userJson = mapper.writeValueAsString(users); // user 객체 → JSON
	        log.info("users:"+users);
	        String encodedUser = URLEncoder.encode(userJson, "UTF-8"); // URL 인코딩

	        return "http://localhost:3000/popble/oauth/callback?token=" + jwt + "&user=" + encodedUser;
	    } catch (Exception e) {
	        // 로깅하거나 기본 fallback URL 반환
	        return "http://localhost:3000/popble/oauth/callback?token=" + jwt;
	    }
	}

	public static Map<String, Object> validateToken(String token) { // 키의 유효성검사
		Map<String, Object> claim = null;

		try {
			SecretKey key = Keys.hmacShaKeyFor(JWTUtill.key.getBytes("UTF-8"));

			claim = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
		} catch (MalformedJwtException malformedJwtException) {
			throw new CustomJWTException("Malformed");
		} catch (ExpiredJwtException expiredJwtException) {
			throw new CustomJWTException("Expired");

		} catch (InvalidClaimException invalidClaimException) {
			throw new CustomJWTException("Invalid");

		} catch (JwtException jwtException) {
			throw new CustomJWTException("JWTError");

		} catch (Exception e) {
			throw new CustomJWTException("error");
		}
		return claim;
	}
}