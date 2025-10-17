import CopyrightFooter from "./function/CopyrightFooter";

const Footer = () => {
  return (
    <div className="bottom-0 left-0 w-full h-20 border-t border-subSecondColor">
      <div className="flex justify-center font-bold text-medium m-5 gap-10">
        <a>서비스 이용 약관</a>
        <a>개인정보 처리방침</a>
        <a>마케팅 수신 동의</a>
      </div>
      <div className="flex flex-col justify-center font-medium text-sm m-2 ml-5 gap-1">
        <a>(주)파블</a>
        <a>주소 : 경기도 김포시 김포한강4로 125 월드타워 10층</a>
      </div>
      <div className="text-xs ml-5">
        본 사이트의 컨텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.
      </div>
      <CopyrightFooter />
    </div>
  );
}; 

export default Footer;