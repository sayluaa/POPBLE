package com.popble.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MapApiRequest {
    private Long popupStoreId; // id만 받아서 서비스에서 객체로 변환
    private double lat;
    private double lng;
    private String address;
    private String popLocation;
    private String parking;
    private String accomodation;
}
