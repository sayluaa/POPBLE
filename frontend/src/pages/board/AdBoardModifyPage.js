import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/board/ModifyComponent";

const AdBoardModifyPage = () => {

    const {id} = useParams()

    return(
        <div className="p-4 w-full bg-white">
            <div className="text-3xl font-extrabold">
                팝업스토어 수정 페이지
            </div>
            <ModifyComponent id = {id}></ModifyComponent>
        </div>
    )
}

export default AdBoardModifyPage;