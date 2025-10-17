import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { FreeMode } from "swiper/modules";

const CustomSwiper = ({
  children,
  spaceBetween = 20,
  slidesPerView = "auto",
  ...props
}) => {
  return (
    <Swiper
      modules={[FreeMode]}
      spaceBetween={20}
      slidesPerView={"auto"}
      grabCursor={true}
      freeMode={true}
      {...props}
    >
      {children}
    </Swiper>
  );
};

export default CustomSwiper;
