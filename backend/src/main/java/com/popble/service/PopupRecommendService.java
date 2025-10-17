package com.popble.service;

public interface PopupRecommendService {

	void recommend(Long userId, Long popupId);
	
	void cancelRecommend(Long userId, Long popupId);
	
	boolean isRecommended(Long userId, Long popupId); 
}
