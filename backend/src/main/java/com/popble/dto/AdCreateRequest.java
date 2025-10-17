package com.popble.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class AdCreateRequest {

    @NotBlank
    @Size(max = 120)
    private String title;

    @NotBlank
    @Size(max = 5000)
    private String content;

    // 작성자 ID (UserProfile 연동 예정)
    private Long writerId;

    // ✅ 팝업스토어 연계 ID (PopupStore 엔티티 참조)
    private Long popupStoreId;

    // 태그 목록
    @Builder.Default
    private List<String> tags = List.of();

    @Size(max = 500)
    private String externalUrl;

    @Size(max = 100)
    private String contact;

    // 🔹 LocalDate로 변경 (행사 시작/종료일)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate publishStartDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate publishEndDate;

    // 고정 여부
    @Builder.Default
    private boolean pinned = false;

    // 노출 여부
    @Builder.Default
    private boolean visible = true;

    // ✅ 대표 이미지 인덱스
    private Integer thumbnailIndex;
}
