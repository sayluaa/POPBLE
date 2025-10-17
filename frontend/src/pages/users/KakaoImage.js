import KakaoImg from "../../assets/img/Kakao.jpg"


const KaKaoImage = ({alt, size =37}) => {

    return(
        <img
        
      src={KakaoImg}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
         border: '1px solid #000'
        
      }}
        />

    )



}

export default KaKaoImage;