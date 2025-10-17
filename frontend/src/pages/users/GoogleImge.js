import GoogleImg from "../../assets/img/Google.jpg"


const GoogleImage = ({alt, size =37}) => {

    return(
        <img
        
      src={GoogleImg}
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

export default GoogleImage;