package com.popble.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 10;   // ✅ 글은 10개씩

    @Builder.Default
    private int pageBlockSize = 5; // ✅ 페이지 버튼은 최대 5개 표시
}
