import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getList } from "../../../api/BoardApi";
import useCustomMove from "../../../hooks/useCustomMove";
import PageComponent from "./PageComponent";

const initState = {
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
};

const ListComponent = () => {
  const { page, size, moveToList, moveToRead } = useCustomMove();
  const [queryParams] = useSearchParams();
  const type = queryParams.get("type") || "GENERAL"; // ✅ 자유게시판 기본값

  const [serverData, setServerData] = useState(initState);

  useEffect(() => {
    (async () => {
      const data = await getList({ type, page, size }); // ✅ type 전달
      setServerData(data || initState);
    })();
  }, [type, page, size]);

  return (
    <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
      <div className="flex flex-wrap mx-auto justify-center p-6">
        {serverData.dtoList.map((item) => {
          // 백엔드 필드명 호환 처리 (tno/id, createdAt/createTime 등)
          const id = item.id ?? item.tno;
          const title = item.title;
          const date =
            item.createTime ??
            item.createdAt ??
            item.dueDate ??
            item.regDate ??
            "";

        return (
          <div
            key={id}
            className="w-full min-w-[400px] p-2 m-2 rounded shadow-md cursor-pointer"
            onClick={() => moveToRead(id)} // ✅ 상세 이동
          >
            <div className="flex">
              <div className="font-extrabold text-2xl p-2 w-1/12">{id}</div>
              <div className="text-1xl m-1 p-2 w-8/12 font-extrabold">
                {title}
              </div>
              <div className="text-1xl m-1 p-2 w-2/12 font-medium">{date}</div>
            </div>
          </div>
        );
        })}
      </div>

      <PageComponent serverData={serverData} movePage={moveToList} />
    </div>
  );
};

export default ListComponent;
