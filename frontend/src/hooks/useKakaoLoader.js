import { useEffect, useState } from "react";

export default function useKakaoLoader(appKey) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // 이미 SDK가 로드된 경우
    if (window.kakao && window.kakao.maps) {
      setLoaded(true);
      return;
    }

    // 이미 script 태그가 있으면 중복 생성 방지
    if (document.getElementById("kakao-map-sdk")) {
      const checkInterval = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          setLoaded(true);
          clearInterval(checkInterval);
        }
      }, 100);
      return;
    }
    //최초 로드
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer&autoload=false`;

    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setLoaded(true);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [appKey]);

  return loaded;
}

