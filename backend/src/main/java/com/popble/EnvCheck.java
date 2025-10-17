package com.popble;

import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.annotation.PostConstruct;
import lombok.extern.log4j.Log4j2;

@Component
@Log4j2
public class EnvCheck {


	@PostConstruct
	public void printEnv() {
		log.info(">> MAIL_USERNAME from ENV: " + System.getenv("MAIL_USERNAME"));
        log.info(">> MAIL_USERNAME from JVM: " + System.getProperty("MAIL_USERNAME"));
	}


}