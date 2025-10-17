package com.popble.dto;

import com.popble.domain.Board;
import lombok.Data;

@Data
public class BoardUpdateRequest {

    private String title;

    private String content;

    // ✅ 게시판 종류 선택 가능하도록 필드 추가
    private Board.Type type;
}
