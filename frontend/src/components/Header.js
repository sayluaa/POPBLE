import { Link } from "react-router-dom";
import NavBar from "./function/NavBar";
import logo from "../assets/img/POPBLE Logo.png";

const Header = () => {
  return (
    <>
      {/* 상단 메뉴바 로고
        상단 색상 지정 */}
      <div id="menubar" className="flex bg-primaryColor">
        {/* 로고 삽입 및 여백 지정 */}
        <div className="ml-5 mt-2 mb-2">
          <Link to={"/"}>
            <img src={logo} height="200px" width="200px" alt="logo"></img>
          </Link>
        </div>
        {/* 햄버거 버튼 */}
        <div className="ml-auto mt-5">
          <NavBar />
        </div>
      </div>
    </>
  );
};
export default Header;
