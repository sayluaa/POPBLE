package com.popble.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "board_image",
       indexes = {
           @Index(name = "idx_boardimage_board", columnList = "board_id"),
           @Index(name = "idx_boardimage_popup", columnList = "popup_id"),
           @Index(name = "idx_boardimage_sort", columnList = "sort_order") // ✅ sort_order 컬럼 인덱스
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String originalName;   // 업로드 당시 파일명
    private String storedName;     // 서버/스토리지 저장 파일명(UUID.ext)
    private String folder;         // yyyy/MM/dd
    private String url;            // /uploads/... 또는 S3 URL
    private String contentType;    // MIME 타입
    private long size;             // 파일 크기(byte)

    @Column(name = "sort_order")
    private int sortOrder;         // 0이 대표 이미지

    // ===== 호환용 alias 필드 =====
    // 기존 코드에서 "ord" 라는 이름을 참조하는 경우가 있어 안전하게 alias 유지
    @Transient
    public int getOrd() {
        return this.sortOrder;
    }

    public void setOrd(int ord) {
        this.sortOrder = ord;
    }

    // ===== 연관관계 =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private Board board;           // 일반 게시판 연결

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "popup_id")
    private PopupStore popupStore; // 팝업스토어 연결
}
