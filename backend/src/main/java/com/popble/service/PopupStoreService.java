package com.popble.service;

import java.util.List;

import com.popble.dto.PageRequestDTO;
import com.popble.dto.PageResponseDTO;
import com.popble.dto.PopupFilterDTO;
import com.popble.dto.PopupStoreDTO;

public interface PopupStoreService {

    // 🔹 필터 조회
    PageResponseDTO<PopupStoreDTO> getFilteredList(PopupFilterDTO popupFilterDTO);

    // 🔹 단건 조회
    PopupStoreDTO get(Long id);

    // 🔹 목록 조회 (페이징)
    PageResponseDTO<PopupStoreDTO> getList(PageRequestDTO pageRequestDTO);

    // 🔹 팝업스토어 등록
    Long register(PopupStoreDTO popupStoreDTO);

    // 🔹 팝업스토어 수정
    void modify(PopupStoreDTO popupStoreDTO);

    // 🔹 팝업스토어 삭제
    void remove(Long id);
    
    // 맵 리스트
    List<PopupStoreDTO> getMapList();
}
