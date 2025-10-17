package com.popble.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageDto {
 private Long id;               // 이미지 PK (선택)
 private Long boardId;          // 소유 게시글 ID (선택: 응답/매핑용)

 @NotBlank
 private String uuid;           // 서버 저장용 파일명 키

 @NotBlank
 private String originalName;   // 원본 파일명

 @NotBlank
 private String path;           // 저장 경로 (예: /2025/09/11)

 @PositiveOrZero
 private Integer ord;           // 정렬 순서(0부터). PATCH 고려해서 Integer!

 private String contentType;    // image/png 등
 private Long size;             // 바이트

 @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
 private LocalDateTime createdAt;

 
}
