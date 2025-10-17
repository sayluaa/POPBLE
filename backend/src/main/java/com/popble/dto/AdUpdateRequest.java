package com.popble.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class AdUpdateRequest {

    @Size(max = 120)
    private String title;

    @Size(max = 5000)
    private String content;

    private Long popupStoreId;
    private List<String> tags;

    @Size(max = 500)
    private String externalUrl;

    @Size(max = 100)
    private String contact;

    // 🔹 LocalDate로 변경
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate publishStartDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate publishEndDate;

    private Boolean pinned;
    private Boolean visible;

    @Size(max = 200)
    private String storeName;

    @Size(max = 500)
    private String address;

    @Size(max = 5000)
    private String description;

    private Integer thumbnailIndex;
}
