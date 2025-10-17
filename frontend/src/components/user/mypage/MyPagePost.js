import { useState, useEffect } from "react";
import { getAll, getList } from "../../../api/BoardApi";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdEditDocument } from "react-icons/md";

const MyPagePost = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const userId = useSelector((state) => state.auth?.user?.id);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //전체 게시글
        const { dtoList = [] } = await getAll({ page: 1, size: 5 });
        const myPosts = dtoList.filter((post) => post.writerId === userId);
        const type = category === "ALL" ? null : category;
        const filtered = type
          ? myPosts.filter((post) => post.type?.toUpperCase() === type)
          : myPosts;
        setPosts(filtered);
        console.log("전체 게시글 수:", dtoList.length);
        console.log("내 게시글 수:", myPosts.length);
        console.log("카테고리 필터 후:", filtered.length);
      } catch (e) {
        console.error("게시글 불러오기 실패", e);
        setPosts([]);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [category, userId]);

  return (
    <div className="flex flex-col justify-center w-full">
      <div className="mt-2 w-full flex flex-center items-center gap-2">
        <MdEditDocument size={25} className="ml-5" />
        <p className="m-1 text-2xl">내 게시글 보기</p>
      </div>      
      <hr className="min-w-[300px] border border-black border-l-2 m-2 mb-4"></hr>
      
      {/* 게시판 선택 selectbox */}
      <div className="ml-5 flex items-center space-y-6 mb-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-hashTagColor p-2 pr-7 rounded-lg"
        >
          <option value={"ALL"}>전체</option>
          <option value={"GENERAL"}>자유</option>
          <option value={"QNA"}>QNA</option>
        </select>
      </div>
      {/* 게시글 목록 */}
        <table className="w-full font-normal text-sm text-black border-separate border-spacing-0
        md:px-5">
          <thead>
            <tr className="bg-secondaryColor">
              <th className="p-2 border w-2/12 rounded-tl-lg">카테고리</th>
              <th className="p-2 border w-7/12 ">제목</th>
              <th className="p-2 border w-2/12 ">작성일</th>
              <th className="p-2 border w-1/12 rounded-tr-lg">조회수</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="text-center hover:bg-gray-100 cursor-pointer">
                  <th className="p-2 border">{post.type}</th>
                  <th
                    className="p-2 border cursor-pointer"
                    onClick={() => {
                      navigate(`/boards/${post.type?.toLowerCase()}/${post.id}`);
                    }}
                  >
                    {post.title}
                  </th>
                  <th className="p-2 border">
                    {dayjs(post.createTime).format("YYYY-MM-DD HH:mm")}
                  </th>
                  <th className="p-2 border">{post.view}</th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-5 text-gray-500 text-center">
                  게시글이 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      {/* 답변 */}
      <div className="mt-5 w-full flex items-center text-2xl gap-2">
        <MdEditDocument size={25} className="ml-5" />
        <p className="m-2 text-2xl">내 답변글 보기</p>
      </div>
      <hr className="min-w-[300px] border border-black border-l-2 m-2"></hr>
      <div className="p-5 text-gray-500 text-center">
        답변글이 없습니다</div>
    </div>
  );
};

export default MyPagePost;