package com.popble.security;

import java.util.Date;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.popble.util.CustomJWTException;
import com.popble.util.JWTUtill;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
public class APIReFreshController {
	
	@RequestMapping("/api/user/refresh")
	public Map<String, Object> refresh(@RequestHeader("Authorization") String authHeader, @RequestParam(name = "refreshToken") String refreshToken){
		if(refreshToken == null) {
			throw new CustomJWTException("NULL_REFRESH");
		}
		
		if(authHeader == null) {
			throw new CustomJWTException("INVSLID_STRING");
		}
		
		String accessToken = authHeader.substring(7);
		
		if(checkExpiredToken(accessToken) == false) {
			return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
			
		}
		
		Map<String, Object> claims = JWTUtill.validateToken(refreshToken);
		
		log.info("refresh------------ clalms :"+claims);
		
		String newAccessToken = JWTUtill.generateToken(claims, 10);
		
		String newRefreshToken = checkTime( (Integer) claims.get("exp")) == true ? JWTUtill.generateToken(claims, 60*24) : refreshToken;
		
		return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
		
	}
	
	private boolean checkTime(Integer exp) {
		Date expDate = new Date( (long) exp * (1000));
		long gap = expDate.getTime() - System.currentTimeMillis();
		
		long leftMin = gap / (1000*60);
		return leftMin < 60;
	}
	
	private boolean checkExpiredToken(String token) {
		
		try {
			JWTUtill.validateToken(token);
			
		} catch (CustomJWTException ex) {
			if(ex.getMessage().equals("Expired")) {
				
			
				return true;
			}
		}
		
		
		
		
		
	
	
	return false;	
	
	
}
}