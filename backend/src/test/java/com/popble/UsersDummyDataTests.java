package com.popble;

import static org.mockito.ArgumentMatchers.anyList;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.popble.domain.Role;
import com.popble.domain.Users;
import com.popble.domain.UserProfile;
import com.popble.repository.CategoryRepository;
import com.popble.repository.PopupStoreRepository;
import com.popble.repository.UserProfileRepository;
import com.popble.repository.UserRepository;

@SpringBootTest
public class UsersDummyDataTests {

		//유저
		@Autowired
		UserRepository userRepository;
		
		//유저 프로필
		@Autowired
		UserProfileRepository userProfireProfileRepository;
		// 비밀번호 암호화
		@Autowired
		PasswordEncoder passwordEncoder;
	
	@Test
	public void insertUserDummy() {
		//1.유저 생성
			//관리자
			Users admin = new Users();
			admin.setRole(Role.ADMIN);
			admin.setLoginId("admin");
			admin.setPassword(passwordEncoder.encode("1111"));
			admin.setEmail("admin@email.com");
			admin.setName("Admin");
			admin.setPhonenumber("01011111111");
			
			//기업1
			Users company1 = new Users();
			company1.setRole(Role.COMPANY);
			company1.setLoginId("company1");
			company1.setPassword("2222");
			company1.setEmail("company1@email.com");
			company1.setName("company1");
			company1.setPhonenumber("01022222222");
			
			//기업2
			Users company2 = new Users();
			company2.setRole(Role.COMPANY);
			company2.setLoginId("company2");
			company2.setPassword("3333");
			company2.setEmail("company2@email.com");
			company2.setName("company2");
			company2.setPhonenumber("01033333333");
			
			//회원1
			Users user1 = new Users();
			user1.setRole(Role.MEMBER);
			user1.setLoginId("user1");
			user1.setPassword("4444");
			user1.setEmail("user1@email.com");
			user1.setName("user1");
			user1.setPhonenumber("01044444444");
			
			//회원2
			Users user2 = new Users();
			user2.setRole(Role.MEMBER);
			user2.setLoginId("user2");
			user2.setPassword("5555");
			user2.setEmail("user2@email.com");
			user2.setName("user2");
			user2.setPhonenumber("01055555555");
			
			userRepository.save(admin);
			userRepository.save(company1);
			userRepository.save(company2);
			userRepository.save(user1);
			userRepository.save(user2);
			
		//2.프로필 생성?
		
		
	}
	
}
