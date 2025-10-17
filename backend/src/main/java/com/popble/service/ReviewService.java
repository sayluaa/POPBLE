package com.popble.service;

import java.util.ArrayList;
import java.util.List;

// ReviewImageRepository도 필요
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.popble.domain.PopupStore;
import com.popble.domain.Review;
import com.popble.domain.ReviewImage;
import com.popble.dto.ReviewRequest2;
import com.popble.repository.PopupStoreRepository;
import com.popble.repository.ReviewRepository;

@Service
@Transactional
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PopupStoreRepository popupStoreRepository; 

    public void saveReview(ReviewRequest2 reviewRequest, List<MultipartFile> imageFiles) throws Exception {
        
    	 System.out.println("DEBUG: DTO Popup ID: " + reviewRequest.getPopupId()); 
    	 System.out.println("DEBUG: DTO Popup ID Class: " + reviewRequest.getPopupId().getClass().getName()); 
    	
        // Popup ID로 PopupStore 엔티티 조회
        PopupStore popupStore = popupStoreRepository.findById(reviewRequest.getPopupId())
            .orElseThrow(() -> new IllegalArgumentException("팝업스토어를 찾을 수 없습니다."));

        // 리뷰 엔티티 기본 정보 생성
        Review review = Review.builder()
            .popupStore(popupStore)
            .userNickname(reviewRequest.getNickname())
            .rating(reviewRequest.getRating())
            .content(reviewRequest.getContent())
            .likes(0)
            .build();
        
        // 이미지 처리 및 ReviewImage 리스트 생성
        if (imageFiles != null && !imageFiles.isEmpty()) {
            
            List<ReviewImage> reviewImages = new ArrayList<>();
            
            for (int i = 0; i < imageFiles.size(); i++) {
                MultipartFile file = imageFiles.get(i);
                if (file.isEmpty()) continue;
                
                // 실제 저장 로직 호출 (S3 또는 로컬)
                String storedPath = saveFileAndGetUrl(file); 
                
                // 첫 번째 이미지를 대표 이미지
                if (i == 0) {
                    review.setImageUrl(storedPath);
                }
                
                // ReviewImage 엔티티 생성
                ReviewImage reviewImage = new ReviewImage();
                reviewImage.setReview(review);
                reviewImage.setImageUrl(storedPath);
                reviewImage.setThumbnail(i == 0);
                reviewImages.add(reviewImage);
            }
            
            // Review 엔티티에 이미지 리스트 설정
            review.setImages(reviewImages); 
        }

        // 최종적 저장
        reviewRepository.save(review);
    }
    
    private String saveFileAndGetUrl(MultipartFile file) {
        // 실제 저장 로직 구현 (예: 파일 이름 기반 URL 생성)
        return "https://your-storage-url.com/review/" + file.getOriginalFilename();
    }
}