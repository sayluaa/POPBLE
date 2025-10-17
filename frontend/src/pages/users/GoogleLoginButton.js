

const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google"



const GoogleLoginButton = ({className, children}) => {
    const handleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    }

    return(
        <button onClick={handleLogin} className={className}>
            {children}
        </button>


    )





}


export default GoogleLoginButton;