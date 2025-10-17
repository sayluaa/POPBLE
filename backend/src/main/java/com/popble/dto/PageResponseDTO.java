package com.popble.dto;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import lombok.Builder;
import lombok.Data;

@Data
public class PageResponseDTO<E> {

    // 실제 데이터 목록
    private List<E> dtoList;
    // 화면에 표시될 페이지 번호 목록
    private List<Integer> pageNumList;
    // 요청 정보(현재 페이지, 페이지 크기)
    private PageRequestDTO pageRequestDTO;
    
    // 이전, 다음 페이지 존재여부
    private boolean prev, next;
    // 전체 항목 수
    private int totalCount;
    // 이전페이지, 다음페이지 번호
    private int prevPage, nextPage;
    // 전체 페이지 수
    private int totalPage;
    // 현재 페이지 번호
    private int current;
    
    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> dtoList, PageRequestDTO pageRequestDTO, long totalCount) {
        
        this.dtoList = dtoList;
        this.pageRequestDTO = pageRequestDTO;
        this.totalCount = (int) totalCount;
        
        // ✅ 한 페이지에 보여줄 버튼 개수 (5개 고정)
        int pageBlockSize = 5;

        // 페이지네이션 계산
        int end = (int)(Math.ceil(pageRequestDTO.getPage() / (double) pageBlockSize)) * pageBlockSize;
        int start = end - (pageBlockSize - 1);
        
        // 실제 마지막 페이지
        int last = (int)(Math.ceil(totalCount / (double) pageRequestDTO.getSize()));
        
        // end가 last를 초과하지 않도록
        end = Math.min(end, last);
        
        // 이전 페이지 그룹이 있는지 없는지
        this.prev = start > 1;
        
        // 다음 페이지 그룹이 있는지 없는지
        this.next = totalCount > (long) end * pageRequestDTO.getSize();
        
        // 화면에 표시될 페이지 번호 목록
        this.pageNumList = IntStream.rangeClosed(start, end).boxed().collect(Collectors.toList());
        
        // 이전, 다음페이지 번호 설계
        if(prev) {
            this.prevPage = start - 1;
        }
        
        if(next) {
            this.nextPage = end + 1;
        }
        
        this.totalPage = last;
        this.current = pageRequestDTO.getPage();
    }
}
