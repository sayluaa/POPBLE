import { Suspense, lazy } from "react";
import LoadingComponent from "../components/common/LoadingComponent";

const ReservationInfo = lazy( () => import("../components/popup/detail/ReserveInfo"))



const reservationRouter= ()=> {
    return[
        {
            //팝업스토어 예약 페이지 경로
            path:"/reservation",
            element:(
                <Suspense fallback={<LoadingComponent/>}><ReservationInfo/></Suspense>
            )
        },
        {
            //특정 예약 상세 페이지
            path:"",
            element:(
                <Suspense fallback={<LoadingComponent/>}></Suspense>
            )
        },
        {
            //사용자 마이페이지예약내역
            path:"",
            element:(
                <Suspense fallback={<LoadingComponent/>}></Suspense>
            )
        }
    
];
}

export default reservationRouter;