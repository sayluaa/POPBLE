import PopbleImg from "../../assets/img/POPBLE Logo.png"


const PopbleImage = ({alt, size =330}) => {

    return(
        <img
        
      src={PopbleImg}
      alt={alt}
      style={{
          width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
      
        
      }}
        />

    )



}

export default PopbleImage;