package com.popble.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.popble.domain.PopupRecommend;
import com.popble.domain.PopupStore;
import com.popble.domain.UserProfile;
import com.popble.repository.PopupRecommendRepository;
import com.popble.repository.PopupStoreRepository;
import com.popble.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
@Transactional
public class PopupRecommendServiceImpl implements PopupRecommendService {

	private final PopupRecommendRepository popupRecommendRepository;
	private final UserProfileRepository userProfileRepository;
	private final PopupStoreRepository popupStoreRepository;

	// 추천하기
	public void recommend(Long userId, Long popupId) {
		UserProfile user = userProfileRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + userId));
		PopupStore popup = popupStoreRepository.findById(popupId)
				.orElseThrow(() -> new IllegalArgumentException("해당 popupId의 팝업이 존재하지 않습니다. popupId:" + popupId));

		if (popupRecommendRepository.existsByUserProfileAndPopupStore(user, popup)) {
			throw new IllegalArgumentException("이미 추천한 팝업입니다.");
		}
		PopupRecommend recommend = new PopupRecommend();
		recommend.setUserProfile(user);
		recommend.setPopupStore(popup);
		recommend.setCreateTime(LocalDateTime.now());

		popupRecommendRepository.save(recommend);

		popup.setRecommend(popup.getRecommend() + 1);
	}

	// 추천취소
	public void cancelRecommend(Long userId, Long popupId) {
		UserProfile user = userProfileRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + userId));
		PopupStore popup = popupStoreRepository.findById(popupId)
				.orElseThrow(() -> new IllegalArgumentException("해당 popupId의 팝업이 존재하지 않습니다. popupId:" + popupId));
		PopupRecommend recommend = popupRecommendRepository.findByUserProfileAndPopupStore(user, popup).orElseThrow();

		popupRecommendRepository.delete(recommend);

		popup.setRecommend(popup.getRecommend() - 1);
	}

	// 추천 여부 확인
	@Transactional(readOnly = true)
	public boolean isRecommended(Long userId, Long popupId) {
		UserProfile user = userProfileRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("해당 userId의 유저가 존재하지 않습니다. userId:" + userId));
		PopupStore popup = popupStoreRepository.findById(popupId)
				.orElseThrow(() -> new IllegalArgumentException("해당 popupId의 팝업이 존재하지 않습니다. popupId:" + popupId));

		return popupRecommendRepository.existsByUserProfileAndPopupStore(user, popup);
	}
}
