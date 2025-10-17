package com.popble.repository;

import com.popble.domain.AdBoard;
import com.popble.domain.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdBoardRepository extends JpaRepository<AdBoard, Long> {

    // ===== 단건 조회 (작성자 + 이미지까지 한번에 fetch) =====
    @EntityGraph(attributePaths = {"imageList", "userProfile"})
    Optional<AdBoard> findById(Long id);

    // ===== 목록 조회 (작성자 + 이미지 포함, 최신순) =====
    @EntityGraph(attributePaths = {"imageList", "userProfile"})
    List<AdBoard> findAllByOrderByCreateTimeDesc();

    // ===== 제목/내용 검색 + 페이지네이션 =====
    @EntityGraph(attributePaths = {"imageList", "userProfile"})
    Page<AdBoard> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    // ===== 전체 목록 페이지네이션 =====
    @EntityGraph(attributePaths = {"imageList", "userProfile"})
    Page<AdBoard> findAll(Pageable pageable);

    // ===== 기업이 작성한 AD 게시글 =====
    List<AdBoard> findByUserProfile(UserProfile userProfile);
}
