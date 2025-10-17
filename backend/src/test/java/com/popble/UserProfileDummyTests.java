package com.popble;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.popble.domain.UserProfile;
import com.popble.domain.Users;
import com.popble.repository.UserProfileRepository;
import com.popble.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class UserProfileDummyTests {

	@Autowired
	UserProfileRepository userProfileRepository;
	
	@Autowired
	UserRepository userRepository;
		
	
	@Test
	public void createUserProfileTests() {
		//유저 전체 불러오기
		List<Users> userList = userRepository.findAll();
		log.info(userList);
		
		for(Users user: userList) {
			UserProfile userProfile = new UserProfile();
			userProfile.setUsers(user);
			userProfile.setNickname("닉네임_" + user.getName());
			userProfile.setProfileImg("default.jpg");
			
			user.setUserProfile(userProfile);
			userProfile.setUsers(user);
			
			userRepository.save(user);
		}
		
	}
}
