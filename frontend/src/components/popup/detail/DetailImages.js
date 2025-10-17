import { useState } from "react";

const DetailImages = ({ uploadFileNames, popupStore }) => {
  const [selectImage, setSelectImage] = useState(null); //null -> 아무것도 선택안된 상태
  //selectImage:클릭한 이미지 저장 setSelectImage:확대하기 위해 사용

  //이미지 배열로 묶어서 map으로 순회하면서 렌더링
  const images = uploadFileNames;

  // Nas => DB에 있는 URL로 가져오고 내가 등록했을 경우 기본 경로로
  const getImageSrc = (fileName) => {
    if (!fileName) return "";
    // URL
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
      return fileName;
    }
    // 기본경로
    return `http://localhost:8080/uploads/${fileName}`;
  };

  return (
    <div className="flex flex-col items-center justify-center text-neutral-500">
      <h2 className="mb-2">이미지를 터치하면 확대해서 확인이 가능합니다.</h2>

      {/* 이미지 리스트 */}
      <div className="flex flex-col items-center">
        {images.map(
          (
            fileName,
            idx //map -> 이미지 순서대로 렌더링
          ) => (
            //img:현재 순회중인 이미지 값 idx:순서대로 중가하는 숫자로 배열에서 몇번째 요소인지 알려줌
            <img
              key={idx}
              src={getImageSrc(fileName)}
              height={500}
              width={500} //cursor-pointer:커서 올르면 손 모양  hover:scale:커서 올리면 살짝 확대
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => setSelectImage(fileName)} //transtion-transform duration:부드럽게 확대/축소되도록 애니메이션 효과
            />
          )
        )}
      </div>

      {/* 이미지 클릭시 확대 */}
      {selectImage && ( //selectImage가 bull이 아니면 모달 렌더링
        //확대되었을때 반투명 검정 배경  fixed insert-0:화면 전체를 덮는 모달
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectImage(null)}
        >
          {" "}
          {/*클릭 시 닫힘*/}
          <img
            src={getImageSrc(selectImage)}
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />{" "}
          {/*화면 최대 크기 제한*/}
        </div>
      )}
    </div>
  );
};

export default DetailImages;
