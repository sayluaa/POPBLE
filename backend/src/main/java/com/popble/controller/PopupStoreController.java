package com.popble.controller;

import java.time.LocalDate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.popble.domain.Category;
import com.popble.domain.PopupStore;
import com.popble.domain.SortType;
import com.popble.dto.PageRequestDTO;
import com.popble.dto.PageResponseDTO;
import com.popble.dto.PopupFilterDTO;
import com.popble.dto.PopupStoreDTO;
import com.popble.service.PopupStoreService;
import com.popble.util.CustomFileUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
@RequestMapping("/api/popup")
public class PopupStoreController {

    private final CustomFileUtil fileUtil;
    private final PopupStoreService popupStoreService;
    private final ObjectMapper objectMapper;

    // ===== 목록 조회 (필터링 지원) =====
    @GetMapping("/list")
    public PageResponseDTO<PopupStoreDTO> getList(
            @RequestParam(required = false, name = "status") PopupStore.Status status,
            @RequestParam(required = false, name = "sort") SortType sort,
            @RequestParam(required = false, name = "categoryType") Category.CategoryType categoryType,
            @RequestParam(required = false, name = "categoryId") Integer categoryId,
            @RequestParam(required = false, name = "keyword") String keyword,
            @RequestParam(defaultValue = "1", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size) {

        PageRequestDTO pageRequestDTO = PageRequestDTO.builder()
                .page(page)
                .size(size)
                .build();

        PopupFilterDTO popupFilterDTO = PopupFilterDTO.builder()
                .status(status)
                .sort(sort)
                .categoryType(categoryType)
                .categoryId(categoryId)
                .keyword(keyword)
                .pageRequestDTO(pageRequestDTO)
                .build();

        log.info("Popup list filter: status={}, sort={}, categoryType={}, categoryId={}, keyword={}",
                status, sort, categoryType, categoryId, keyword);

        return popupStoreService.getFilteredList(popupFilterDTO);
    }

    // ===== 단건 조회 =====
    @GetMapping("/{id}")
    public PopupStoreDTO get(@PathVariable("id") Long id) {
        return popupStoreService.get(id);
    }

    // ===== 등록 (JSON + 파일 분리) =====
    @PostMapping(value = "/", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> register(
            @RequestPart("dto") String popupStoreDtoStr,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) throws Exception {

        PopupStoreDTO popupStoreDTO = objectMapper.readValue(popupStoreDtoStr, PopupStoreDTO.class);

        // 이미지 파일 처리
        List<String> uploadFileNames = fileUtil.saveFiles(files);
        popupStoreDTO.setUploadFileNames(uploadFileNames);

        Long id = popupStoreService.register(popupStoreDTO);

        return ResponseEntity.ok(Map.of("id", id, "message", "팝업스토어 등록 완료"));
    }

    // ===== 파일 조회 =====
    @GetMapping("/viewFile/{fileName}")
    public ResponseEntity<Resource> viewFileGet(@PathVariable("fileName") String fileName) {
        return fileUtil.getFile(fileName);
    }

    // ===== 수정 =====
    @PutMapping("/{id}")
    public Map<String, String> modify(@PathVariable("id") Long id, PopupStoreDTO popupStoreDTO) {
        popupStoreDTO.setId(id);

        PopupStoreDTO oldPopupStoreDTO = popupStoreService.get(id);

        List<String> oldFileNames = oldPopupStoreDTO.getUploadFileNames();
        List<MultipartFile> files = popupStoreDTO.getFiles();
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);
        List<String> uploadFileNames = popupStoreDTO.getUploadFileNames();

        if (currentUploadFileNames != null && !currentUploadFileNames.isEmpty()) {
            uploadFileNames.addAll(currentUploadFileNames);
        }

        popupStoreService.modify(popupStoreDTO);

        if (oldFileNames != null && !oldFileNames.isEmpty()) {
            List<String> removeFiles = oldFileNames.stream()
                    .filter(fileName -> uploadFileNames.indexOf(fileName) == -1)
                    .collect(Collectors.toList());

            fileUtil.deleteFile(removeFiles);
        }

        return Map.of("결과", "성공");
    }

    // ===== 삭제 =====
    @DeleteMapping("/{id}")
    public Map<String, String> remove(@PathVariable("id") Long id) {
        List<String> oldFileNames = popupStoreService.get(id).getUploadFileNames();
        popupStoreService.remove(id);
        fileUtil.deleteFile(oldFileNames);
        return Map.of("결과", "성공");
    }
    
    // 카카오 맵 리스트
    @GetMapping("/mapList")
	public ResponseEntity<List<PopupStoreDTO>> getMapList(){
    	List<PopupStoreDTO> storeList = popupStoreService.getMapList();
    	return ResponseEntity.ok(storeList);
    }

}
