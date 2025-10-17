package com.popble.controller;

import java.io.UnsupportedEncodingException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.popble.dto.UserDTO;
import com.popble.service.MailService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class EmailController {

	private final MailService mailService;


	@PostMapping("/api/mail")
	public String mailConfirm(@RequestBody UserDTO userDTO  ) throws MessagingException, UnsupportedEncodingException {

		String authCode = mailService.sendEmail(userDTO.getEmail());

		return authCode;
	}




}