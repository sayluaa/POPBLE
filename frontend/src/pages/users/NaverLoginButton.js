

const NAVER_AUTH_URL = "http://localhost:8080/oauth2/authorization/naver"

const NaverLoginButton = ({className, children}) => {
    const handleLogin = () => {
        window.location.href =  NAVER_AUTH_URL;
    }

    return (

        <button onClick={handleLogin} className={className} >
            {children}
        </button>



    )


}

export default NaverLoginButton;

