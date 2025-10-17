package com.popble.repository;

import com.popble.domain.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BoardRepository extends JpaRepository<Board, Long> {

    // ===== 기본 조회 =====
    List<Board> findByType(Board.Type type);
    List<Board> findByTypeOrderByCreateTimeDesc(Board.Type type);
    List<Board> findAllByOrderByCreateTimeDesc();

    // ===== 동적 정렬 지원 =====
    List<Board> findByType(Board.Type type, Sort sort);
    List<Board> findAll(Sort sort);
    
 // ✅ 페이지네이션 지원 (추가)
    Page<Board> findByType(Board.Type type, Pageable pageable);

    // ===== 상세 조회 (이미지/작성자 fetch join) =====
    @Query("""
           select distinct b
           from Board b
           left join fetch b.images
           left join fetch b.userProfile
           where b.id = :id
           """)
    Optional<Board> findWithImagesById(@Param("id") Long id);

    // ===== 전체 목록 fetch join (주의: 페이징 부적합) =====
    @Query("""
           select distinct b
           from Board b
           left join fetch b.userProfile
           left join fetch b.images
           order by b.createTime desc
           """)
    List<Board> findAllWithImagesOrderByCreateTimeDesc();

    // ===== 전역 고정 공지 + NoticeBoard.pin 같이 체크 =====
    @Query("""
           select distinct b
           from Board b
           left join fetch b.userProfile
           left join fetch b.images
           where b.type = 'NOTICE'
             and (b.pinnedGlobal = true or (type(b) = NoticeBoard and b.pin = true))
             and (b.pinUntil is null or b.pinUntil > :now)
           """)
    List<Board> findPinnedNotices(@Param("now") LocalDateTime now, Sort sort);

    @Query("""
           select distinct b
           from Board b
           left join fetch b.userProfile
           left join fetch b.images
           where not (
                b.type = 'NOTICE'
            and (b.pinnedGlobal = true or (type(b) = NoticeBoard and b.pin = true))
            and (b.pinUntil is null or b.pinUntil > :now)
           )
           """)
    List<Board> findRestForAll(@Param("now") LocalDateTime now, Sort sort);

    // 📌 AD 제외 전체 조회 (페이지네이션)
    Page<Board> findByTypeNot(Board.Type type, Pageable pageable);
}