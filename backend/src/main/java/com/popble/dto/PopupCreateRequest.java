package com.popble.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor       // ← Jackson 역직렬화용 기본 생성자 필수
@AllArgsConstructor
public class PopupCreateRequest {

    @NotBlank
    @Size(max = 100)
    private String storeName;

    @NotBlank
    @Size(max = 200)
    private String address;

    // 선택값이면 @Size 정도만
    @Size(max = 200)
    private String addressDetail;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;

    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;
}
