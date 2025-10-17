package com.popble.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.popble.domain.Board;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardResponse {

    private Long id;                    // 글 번호
    private Board.Type type;            // 게시판 종류
    private String title;               // 제목
    private String content;             // 내용
    private Long writerId;              // 작성자 ID
    private Long userID;
    private LocalDateTime createTime;   // 작성일
    private LocalDateTime modifyTime;   // 수정일

    // ✅ 전체 게시판 최상단 고정 관련
    private boolean pinnedGlobal;       // 전역 고정 여부
    private LocalDateTime pinUntil;     // 고정 만료 시각 (null=무기한)
    private LocalDateTime pinnedAt;     // 고정 설정 시각

    private List<ImageDto> images;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDto {
        private Long id;
        private String url;
        private Integer sortOrder;
    }
}
