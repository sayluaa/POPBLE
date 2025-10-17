package com.popble.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import com.popble.domain.SocialLogin;
import com.popble.domain.Users;

public interface SocialLoginRepository extends JpaRepository<SocialLogin, Long> {

	Optional<SocialLogin> findByProviderId(String providerId);

	@Query("SELECT s.users FROM SocialLogin s WHERE s.providerId = :providerId")
	Optional<Users> findUsersByProviderId(@Param("providerId") String providerId);

}