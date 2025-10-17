package com.popble.security.handlr;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.google.gson.Gson;
import com.popble.dto.UserDTO;
import com.popble.util.JWTUtill;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class APILoginSussessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {

        UserDTO userDTO = (UserDTO) authentication.getPrincipal();

        Map<String, Object> claims = new HashMap<>();

        // 필수 정보 클레임에 추가
        claims.put("id", userDTO.getId());
        claims.put("loginId", userDTO.getLoginId());
        claims.put("name", userDTO.getName());
        claims.put("email", userDTO.getEmail());
        claims.put("phonenumber", userDTO.getPhonenumber());
        claims.put("social", userDTO.isSocial());
        claims.put("roleNames", userDTO.getRoleNames());

        // 토큰 생성
        String accessToken = JWTUtill.generateToken(claims, 10);
        String refreshToken = JWTUtill.generateToken(claims, 60 * 24);

        // 클라이언트에 전달
        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);
        claims.put("user", userDTO.getClaims());

        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);

        response.setContentType("application/json; charset=UTF-8");

        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();
    }
}
