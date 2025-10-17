package com.popble.repository;

import com.popble.domain.Review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 특정 팝업스토어의 리뷰 목록을 가져올 때(상세페이지)
     List<Review> findAllByPopupStore_Id(Long popupStoreId); 
    
    // 특정 사용자의 리뷰 목록을 가져올 때(마이페이지)
     List<Review> findAllByUserNickname(String userNickname); 
}