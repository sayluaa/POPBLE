package com.popble.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.popble.domain.Bookmark;
import com.popble.domain.UserProfile;
import com.popble.domain.PopupStore;

import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    // 유저의 북마크 목록 조회
    Page<Bookmark> findByUserProfile(UserProfile userProfile, Pageable pageable);

    // 북마크한 팝업스토어를 최신순으로
    Page<Bookmark> findByUserProfileOrderByCreateDateDesc(UserProfile userProfile, Pageable pageable);

    // 특정 유저가 북마크를 했는지 여부
    Optional<Bookmark> findByUserProfileAndPopupStore(UserProfile userProfile, PopupStore popupStore);

    // 북마크 여부 빠르게 확인
    boolean existsByUserProfileAndPopupStore(UserProfile userProfile, PopupStore popupStore);

    // 북마크 삭제 (팝업스토어 기준)
    void deleteByPopupStore(PopupStore popupStore);

    // 북마크 삭제 (유저 기준)
    void deleteByUserProfile(UserProfile userProfile);
}
