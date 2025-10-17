package com.popble.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.gson.Gson;
import com.popble.dto.UserDTO;
import com.popble.repository.UserRepository;
import com.popble.util.JWTUtill;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
@Log4j2
@RequiredArgsConstructor
public class JWTCheckFilter extends OncePerRequestFilter {
	
	private final UserRepository userRepository;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // ✅ CORS preflight 무조건 통과
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();
        log.info("check uri...............{}", path);

        // ✅ 인증 없이 접근 허용할 공개 API
        if (path.startsWith("/api/user")) {
            return true;
        }
        if (path.startsWith("/api/search") || path.startsWith("/api/filter")) {
            return true;
        }

        // ✅ 개발 편의 (boards 전체 통과 → 배포 시 제거 권장)
        if (path.startsWith("/api/boards")) {
            return true;
        }

        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        log.info("----------------------JWTCheckFilter-------------------------");

        String authHeaderStr = request.getHeader("Authorization");

        if (authHeaderStr == null || !authHeaderStr.startsWith("Bearer ")) {
            log.warn("Authorization header is missing or invalid. authHeaderStr={}", authHeaderStr);
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String accessToken = authHeaderStr.substring(7);
            Map<String, Object> claims = JWTUtill.validateToken(accessToken);

            log.info("JWT claims: {}", claims);

            String loginId = (String) claims.get("loginId");
            String name = (String) claims.get("name");
            String email = (String) claims.get("email");
            String phonenumber = (String) claims.get("phonenumber");

            // ✅ null-safe 처리
            Boolean social = claims.get("social") != null ? (Boolean) claims.get("social") : false;
            List<String> roleNames = claims.get("roleNames") != null
                    ? (List<String>) claims.get("roleNames")
                    : List.of("MEMBER");

            Long id = null;
            Object idObj = claims.get("id");
            if (idObj != null) {
                id = Long.valueOf(String.valueOf(idObj));
            }

            UserDTO userDTO = new UserDTO(
                    loginId,
                    "N/A", // ✅ password는 토큰에서 꺼내 쓰지 않음
                    name,
                    social,
                    email,
                    phonenumber,
                    roleNames
            );
            userDTO.setId(id);

            log.info("-----------------------");
            log.info(userDTO);
            log.info(userDTO.getAuthorities());

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(userDTO, null, userDTO.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("JWT Check Error---------------------");
            log.error(e.getMessage());
            writeErrorJson(response, "ERROR_ACCESS_TOKEN");
        }
    }

    private void writeErrorJson(HttpServletResponse response, String message) throws IOException {
        Gson gson = new Gson();
        String msg = gson.toJson(Map.of("error", message));
        response.setContentType("application/json");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(msg);
        printWriter.close();
    }
}

