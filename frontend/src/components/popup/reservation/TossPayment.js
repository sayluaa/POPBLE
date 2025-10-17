import { useEffect } from "react";

const TossPayment = ({ price, ordername, onSuccess, onFail }) => {
  const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq"; 

  useEffect(() => {
    if (!window.TossPayments) {
      alert("토스 결제가 로드되지 않았습니다.");
      return;
    }

    const tossPayments = window.TossPayments(clientKey);

    tossPayments
      .requestPayment("카드", {
        amount: price,
        orderId: `order_${new Date().getTime()}`,
        orderName: ordername,
        customerName: "예약자",
      })
      .then((result) => {
        console.log("결제 성공:", result);
        if (onSuccess) onSuccess(result);
      })
      .catch((error) => {
        console.error("결제 실패:", error);
        if (onFail) onFail(error);
      });
  }, [price, ordername, onSuccess, onFail]);

  return null;
};

export default TossPayment;