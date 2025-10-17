package com.popble.service;

import com.popble.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdBoardService {

    // ===== 목록 조회 (페이지네이션) =====
    PageResponseDTO<AdResponse> getList(PageRequestDTO pageRequestDTO, String order, String keyword);

    // ===== 단건 조회 =====
    AdResponse getOne(Long id);

    // ===== 등록 =====
    Long create(AdCreateRequest req);
    Long create(AdCreateRequest req, List<MultipartFile> images);

    // ===== 수정 =====
    void update(Long id, AdUpdateRequest req);
    void update(Long id, AdUpdateRequest req, List<MultipartFile> images, List<String> keepImages);

    // ===== 삭제 =====
    void delete(Long id);
}
