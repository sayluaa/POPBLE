package com.popble;





import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.popble.domain.Role;
import com.popble.domain.Users;
import com.popble.repository.UserRepository;


@SpringBootTest
public class UserRepositoryTest {
	
	
	@Autowired
	UserRepository userRepository;
	@Autowired
	PasswordEncoder passwordEncoder;
	
	
	@Test
	public void testINsertMember() {
		Users users = Users.builder()
				.loginId("java")
				.password(passwordEncoder.encode("1111"))
				.email("cih2745@naver.com")
				.name("aa")
				.social(false)
				.role(Role.ADMIN)
				.build();
		
		userRepository.save(users);
		
				
	
	}
	
}