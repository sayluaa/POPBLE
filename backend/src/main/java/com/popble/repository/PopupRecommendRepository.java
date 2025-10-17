package com.popble.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.PopupRecommend;
import java.util.List;
import com.popble.domain.UserProfile;
import com.popble.domain.PopupStore;


public interface PopupRecommendRepository extends JpaRepository<PopupRecommend, Long>{

	Optional<PopupRecommend>findByUserProfileAndPopupStore(UserProfile userProfile, PopupStore popupStore);
	
	boolean existsByUserProfileAndPopupStore(UserProfile userProfile, PopupStore popupStore);
	
	void deleteByUserProfileAndPopupStore(UserProfile userProfile, PopupStore popupStore);
}
