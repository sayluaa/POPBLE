import Footer from "./Footer";
import Header from "./Header";

const BasicMenu = ({ children }) => {
  return (
    <>
      {/* 상단 메뉴바 + 네비바*/}
      <Header />

      {/* 페이지 내용과 Footer 겹치지 않도록 padding-bottom */}
      <div className="bg-backgroundColor">{children}</div>

      {/* 저작권 */}
      <Footer />
    </>
  );
};
export default BasicMenu;
