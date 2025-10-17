package com.popble.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.popble.domain.Users;
import com.popble.dto.UserProfileDTO;

public interface UserProfileService {
	
	
	//유저프로필찾기
	UserProfileDTO getUserProfile(Long id);
	
	
	//유저프로필만들기
	UserProfileDTO createUserProfile(Users user, String nickname, MultipartFile profileImg) throws IOException;
	
	
	//예약시 이름,번호 변경할 때
	UserProfileDTO updateUserProfile(Long id, UserProfileDTO userProfileDTO);
	

	UserProfileDTO updateUserProfile(Long userId, String nickname, MultipartFile profileImg);

}
