package com.popble.dto;

import java.util.List;

// 카카오 지오코딩 API의 전체 응답을 담는 DTO
public class KakaoGeoResponse {
    
    private List<Document> documents; // 실제 좌표 정보가 담긴 리스트

    public List<Document> getDocuments() { return documents; }
    public void setDocuments(List<Document> documents) { this.documents = documents; }
    
    //지오코딩 결과의 개별 문서 (좌표 정보)를 담는 내부 클래스
    public static class Document {
        private String addressName;
        private String y; // 위도 (Latitude)
        private String x; // 경도 (Longitude)
        
        public String getAddressName() { return addressName; }
        public void setAddressName(String addressName) { this.addressName = addressName; }
        public String getY() { return y; }
        public void setY(String y) { this.y = y; }
        public String getX() { return x; }
        public void setX(String x) { this.x = x; }

        // 편의를 위한 메소드
        @Override
        public String toString() {
            return "Document{" +
                   "addressName='" + addressName + '\'' +
                   ", latitude(y)='" + y + '\'' +
                   ", longitude(x)='" + x + '\'' +
                   '}';
        }
    }
}