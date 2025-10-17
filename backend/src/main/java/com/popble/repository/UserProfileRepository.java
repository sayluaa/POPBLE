package com.popble.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.popble.domain.UserProfile;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long>{

	//닉네임으로 조회
	List<UserProfile> findByNickname(String nickname);
	
}
