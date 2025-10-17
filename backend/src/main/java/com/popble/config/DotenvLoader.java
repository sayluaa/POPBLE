package com.popble.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;


@Configuration
public class DotenvLoader {

    @PostConstruct
    public void loadEnv() {
        try {
            // 현재 프로젝트의 backend 폴더 기준으로 .env 경로 설정
            Path envPath = Paths.get(System.getProperty("user.dir"), "backend");
            
            Dotenv dotenv = Dotenv.configure()
                                  .directory(envPath.toString())
                                  .ignoreIfMalformed()   // .env 문법 오류 무시
                                  .ignoreIfMissing()     // .env 없으면 무시
                                  .load();

            // 환경변수로 설정
            if(dotenv.get("MAIL_USERNAME") != null) {
                System.setProperty("MAIL_USERNAME", dotenv.get("MAIL_USERNAME"));
            }
            if(dotenv.get("MAIL_PASSWORD") != null) {
                System.setProperty("MAIL_PASSWORD", dotenv.get("MAIL_PASSWORD"));
            }

            System.out.println(".env 로드 성공: " + envPath.toString());
        } catch (Exception e) {
            System.err.println(".env 로드 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}