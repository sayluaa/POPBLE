package com.popble.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdBoardDTO {

    private Long id;                  // 게시글 번호
    private String title;             // 제목
    private String content;           // 내용

    private Long writerId;            // 작성자 ID
    private String writerName;        // 작성자 닉네임

    private LocalDateTime createTime; // 작성일
    private LocalDateTime updateTime; // 수정일

    private int viewCount;            // 조회수
    private int recommendCount;       // 추천수

    private List<String> uploadFileNames; // 첨부 이미지 파일명/URL
}
