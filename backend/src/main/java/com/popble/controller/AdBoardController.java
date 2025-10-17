package com.popble.controller;

import com.popble.dto.*;
import com.popble.service.AdBoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ad")
@RequiredArgsConstructor
@Log4j2
public class AdBoardController {

    private final AdBoardService adBoardService;

    // ===== 목록 조회 =====
    @GetMapping("/list")
    public ResponseEntity<PageResponseDTO<AdResponse>> getList(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "order", required = false) String order,
            @RequestParam(name = "keyword", required = false) String keyword
    ) {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        return ResponseEntity.ok(adBoardService.getList(pageRequestDTO, order, keyword));
    }

    // ===== 단건 조회 =====
    @GetMapping("/{id}")
    public ResponseEntity<AdResponse> getOne(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adBoardService.getOne(id));
    }

    // ===== 등록 (JSON) =====
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> create(
            @AuthenticationPrincipal UserDTO user,
            @RequestBody AdCreateRequest req) {

        req.setWriterId(user.getId()); // ✅ JWT에서 사용자 ID 세팅
        Long id = adBoardService.create(req);

        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "등록 성공"
        ));
    }

    // ===== 등록 (이미지 포함) =====
    @PostMapping(value = "/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createWithImages(
            @AuthenticationPrincipal UserDTO user,
            @RequestPart("board") AdCreateRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
    	  log.info("userId from AuthenticationPrincipal: {}", user != null ? user.getId() : "null");

        req.setWriterId(user.getId()); // ✅ JWT에서 사용자 ID 세팅
        Long id = adBoardService.create(req, images);

        return ResponseEntity.ok(Map.of(
                "id", id,
                "message", "등록 성공"
        ));
    }

    // ===== 수정 (JSON) =====
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable("id") Long id,
            @RequestBody AdUpdateRequest req) {
        adBoardService.update(id, req);
        return ResponseEntity.ok(Map.of("message", "수정 성공"));
    }

    // ===== 수정 (이미지 포함) =====
    @PutMapping(value = "/{id}/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateWithImages(
            @PathVariable("id") Long id,
            @RequestPart("board") AdUpdateRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestPart(value = "keepImages", required = false) List<String> keepImages) {

        adBoardService.update(id, req, images, keepImages);
        return ResponseEntity.ok(Map.of("message", "수정 성공"));
    }

    // ===== 삭제 =====
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable("id") Long id) {
        adBoardService.delete(id);
        return ResponseEntity.ok(Map.of("message", "삭제 성공"));
    }
}