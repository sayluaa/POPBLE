package com.popble.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.popble.domain.PopupStore;
import com.popble.domain.Rating;
import java.util.List;
import com.popble.domain.UserProfile;



public interface RatingRepository extends JpaRepository<Rating, Long>{

	//특정 팝업에 대한 모든 별점
	List<Rating> findByPopupStore(PopupStore popupStore);
	//특정 팝업의 평균 별점
	@Query("SELECT AVG(r.score) FROM Rating r WHERE r.popupStore = :popupStore")
	Double findAverageScoreByPopupStore(@Param("popupStore") PopupStore popupStore);
	//유저가 별점을남겼는지
	boolean existsByPopupStoreAndUserProfile(PopupStore popupStore, UserProfile userProfile);
}
