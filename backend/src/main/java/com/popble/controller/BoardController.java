package com.popble.controller;

import com.popble.domain.Board;
import com.popble.dto.*;
import com.popble.service.BoardService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BoardController {

    private final BoardService boardService;

    @Data
    static class PinRequest {
        private boolean pinned;
        private LocalDateTime pinUntil;
    }

    /** ✅ 게시글 생성 (JSON 전용) */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> createJson(@RequestBody @Valid BoardCreateRequest req) {
        return ResponseEntity.ok(boardService.create(req));
    }

    /** ✅ 게시글 생성 (이미지 포함) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> createMultipart(
            @RequestPart("board") @Valid BoardCreateRequest req,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        Long id = boardService.create(req, images);
        return ResponseEntity.ok(id);
    }

    /** 게시글 단건 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponse> get(@PathVariable("id") Long id) {
        return ResponseEntity.ok(boardService.get(id));
    }

    /** ✅ 게시판 타입별 목록 (페이지네이션 적용) */
    @GetMapping
    public ResponseEntity<PageResponseDTO<BoardResponse>> list(
            @RequestParam("type") Board.Type type,
            @RequestParam(name = "order", defaultValue = "date") String order,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        return ResponseEntity.ok(boardService.listByType(type, pageRequestDTO, order));
    }

    /** ✅ 전체 게시글 (페이지네이션 + pinned 공지 상단) */
    @GetMapping("/all")
    public ResponseEntity<PageResponseDTO<BoardResponse>> listAll(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "order", defaultValue = "date") String order
    ) {
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        return ResponseEntity.ok(boardService.listAll(pageRequestDTO, order));
    }

    /** 게시글 수정 (본문만) */
    @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid BoardUpdateRequest req
    ) {
        boardService.update(id, req);
        return ResponseEntity.noContent().build();
    }

    /** ✅ 게시글 이미지 수정 */
    @PatchMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updateImages(
            @PathVariable("id") Long id,
            @RequestParam(value = "keepIds", required = false) List<Long> keepIds,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages
    ) {
        boardService.updateImages(id, keepIds, newImages);
        return ResponseEntity.noContent().build();
    }

    /** ✅ 공지 전역 고정/해제 */
    @PatchMapping(value = "/{id}/pin", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> pinToggle(
            @PathVariable("id") Long id,
            @RequestBody PinRequest req
    ) {
        boardService.setPinned(id, req.isPinned(), req.getPinUntil());
        return ResponseEntity.noContent().build();
    }

    /** 게시글 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        boardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}