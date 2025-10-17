package com.popble.service;

import com.popble.domain.MapApi;
import com.popble.domain.PopupStore;
import com.popble.dto.KakaoGeoResponse;
import com.popble.dto.KakaoGeoResponse.Document;
import com.popble.dto.MapApiRequest;
import com.popble.repository.MapApiRepository;
import com.popble.repository.PopupStoreRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MapApiService {
	
	private final PopupStoreRepository popupStoreRepository;
    private final MapApiRepository mapApiRepository;
    private final WebClient kakaoWebClient;

    public MapApiService(PopupStoreRepository popupStoreRepository,
                         MapApiRepository mapApiRepository,
                         WebClient kakaoWebClient) {
        this.popupStoreRepository = popupStoreRepository;
        this.mapApiRepository = mapApiRepository;
        this.kakaoWebClient = kakaoWebClient;
    }

    // 1️⃣ 카카오 API 호출
    private Mono<KakaoGeoResponse> getCoordinatesFromAddress(String address) {
        return kakaoWebClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/v2/local/search/address.json")
                        .queryParam("query", address)
                        .build())
                .retrieve()
                .bodyToMono(KakaoGeoResponse.class);
    }

    // 2️⃣ popup_store → map_api 자동 저장
    @Transactional
    public void importPopupStoreAddresses() {
        List<PopupStore> stores = popupStoreRepository.findAll();

        for (PopupStore store : stores) {
            String address = store.getAddress();
            if (address != null && !address.isEmpty()) {

                MapApi mapApi = new MapApi();
                mapApi.setAddress(address);
                mapApi.setPopupStore(store);

                // 좌표 가져오기
                try {
                    KakaoGeoResponse response = getCoordinatesFromAddress(address).block();
                    if (response != null && !response.getDocuments().isEmpty()) {
                        Document doc = response.getDocuments().get(0);
                        mapApi.setLatitude(Double.parseDouble(doc.getY()));
                        mapApi.setLongitude(Double.parseDouble(doc.getX()));
                    } else {
                        mapApi.setLatitude(0.0);
                        mapApi.setLongitude(0.0);
                    }
                } catch (Exception e) {
                    mapApi.setLatitude(0.0);
                    mapApi.setLongitude(0.0);
                    System.err.println("좌표 변환 실패: " + address + " -> " + e.getMessage());
                }

                mapApiRepository.save(mapApi);
            }
        }
    }
    //전체 map_api 데이터 조회
    public List<MapApi> findAllMapData() {
        return mapApiRepository.findAll();
    }
}
