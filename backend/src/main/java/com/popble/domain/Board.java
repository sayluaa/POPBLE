package com.popble.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "board")
@Getter
@Setter
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@EntityListeners(AuditingEntityListener.class)
public abstract class Board {

    public enum Type {
        NOTICE, GENERAL, QNA, AD   // ✅ REVIEW 제거됨
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id")
    private Long id; // 게시판 고유 id

    // 프로필 유저 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile userProfile;

    // 권한 (기본 MEMBER)
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = true)
    private Role role;

    // 게시판 종류
    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    // 제목
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    // 내용
    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    // 작성 시간
    @Column(name = "create_time", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createTime;

    // 수정 시간
    @Column(name = "modify_time", nullable = false)
    @LastModifiedDate
    private LocalDateTime modifyTime;

    // 작성자 표시 문자열
    @Column(name = "writer", nullable = false, length = 50)
    private String writer;

    // 조회수 / 추천수
    @Column(name = "view", nullable = false)
    private int view = 0;

    @Column(name = "recommend", nullable = false)
    private int recommend = 0;

    // ====== 🔹 전역 고정(핀) 기능 ======
    /** 전체 게시판 최상단 고정 여부 (NOTICE만 사용 권장) */
    @Column(name = "pinned_global", nullable = false)
    private boolean pinnedGlobal = false;

    /** 고정 설정 시각(정렬용) */
    @Column(name = "pinned_at")
    private LocalDateTime pinnedAt;

    /** 고정 만료시각(옵션) - null이면 무기한 */
    @Column(name = "pin_until")
    private LocalDateTime pinUntil;
    // =================================

    // 이미지 컬렉션
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC, id ASC")
    private List<BoardImage> images = new ArrayList<>();

    // 편의 메서드
    public void addImage(BoardImage img) {
        images.add(img);
        img.setBoard(this);
    }

    public void removeImage(BoardImage img) {
        images.remove(img);
        img.setBoard(null);
    }

    // ✅ 공지글 고정/해제 처리
    public void setPinnedGlobal(boolean pinnedGlobal) {
        this.pinnedGlobal = pinnedGlobal;
        if (pinnedGlobal) {
            this.pinnedAt = LocalDateTime.now();  // 고정 시점 기록
        } else {
            this.pinnedAt = null;                 // 해제 시 제거 (정렬에서 빠짐)
            this.pinUntil = null;                 // 만료일도 초기화
        }
    }

    // Auditing 누락/지연 대비
    @PrePersist
    public void prePersist() {
        if (this.createTime == null) this.createTime = LocalDateTime.now();
        if (this.modifyTime == null) this.modifyTime = this.createTime;
        if (this.role == null) this.role = Role.MEMBER;
        // pinnedGlobal은 false 기본값 유지
    }

    @PreUpdate
    public void preUpdate() {
        this.modifyTime = LocalDateTime.now();
    }
}