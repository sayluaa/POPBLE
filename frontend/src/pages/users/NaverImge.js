import NaverImg from "../../assets/img/Naver.jpg"


const NaverImage = ({alt, size =37}) => {

    return(
        <img
        
      src={NaverImg}
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

export default NaverImage;