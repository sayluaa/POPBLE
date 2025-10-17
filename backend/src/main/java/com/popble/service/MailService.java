package com.popble.service;

import java.io.UnsupportedEncodingException;
import java.util.Random;


import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class MailService {
	private final JavaMailSender emailSender;

	private final SpringTemplateEngine templateEngine;
	private String authNum;



	public void createCode() {
		Random random = new Random();
		StringBuffer key = new StringBuffer();


		for(int i = 0; i<8; i++) {
			int index = random.nextInt(3);

			switch (index) {
			case  0: 
				key.append((char) ((int)random.nextInt(26)+97));
				break;
			case 1:
				key.append((char)((int)random.nextInt(26)+65));
				break;
			case 2:
				key.append(random.nextInt(9));
				break;

			}
		}

		authNum = key.toString();
	}

	public MimeMessage createEmailForm(String email) throws MessagingException, UnsupportedEncodingException {
			createCode();
			String setFrom = "cih2745@naver.com";
			String toEmail = email;
			String title = "POPBLE 인증번호";

			MimeMessage message = emailSender.createMimeMessage();

			message.addRecipients(MimeMessage.RecipientType.TO, email);
			message.setSubject(title);
			message.setFrom(new InternetAddress(setFrom, "POPBLE"));
			message.setText("POPBLE 인증번호는"+authNum+ "입니다.");

			return message;

	    }

	    //실제 메일 전송
	    public String sendEmail(String toEmail) throws MessagingException, UnsupportedEncodingException {

	        //메일전송에 필요한 정보 설정
	        MimeMessage emailForm = createEmailForm(toEmail);
	        //실제 메일 전송
	        emailSender.send(emailForm);

	        return authNum; //인증 코드 반환
	    }

	    //타임리프를 이용한 context 설정
	    public String setContext(String code) {
	        Context context = new Context();
	        context.setVariable("code", code);
	        return templateEngine.process("mail", context); //mail.html
	    }
}
