package com.popble.service;

import com.popble.domain.Board;
import com.popble.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

public interface BoardService {

    // ===== 생성 =====
    Long create(BoardCreateRequest req);
    Long create(BoardCreateRequest req, java.util.List<MultipartFile> images);

    // ===== 단건 조회 =====
    BoardResponse get(Long id);

    // ===== 목록 조회 (타입별 + 페이지네이션) =====
    PageResponseDTO<BoardResponse> listByType(Board.Type type, PageRequestDTO pageRequestDTO, String order);

    // ===== 전체 목록 조회 =====
    PageResponseDTO<BoardResponse> listAll(PageRequestDTO pageRequestDTO, String order);

    // ===== 수정 =====
    void update(Long id, BoardUpdateRequest req);
    void updateImages(Long id, java.util.List<Long> keepIds, java.util.List<MultipartFile> newImages);

    // ===== 고정(공지) =====
    void setPinned(Long id, boolean pinned, LocalDateTime pinUntil);

    // ===== 삭제 =====
    void delete(Long id);
}