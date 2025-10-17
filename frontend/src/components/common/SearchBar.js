import { useState } from "react";

import { IoMdSearch } from "react-icons/io";

const SearchBar = ({className, onSearch}) => {

    const [keyword, setKeyword] = useState("");

    const handleEnterKey = (e) =>{
        if (e.key === "Enter" && onSearch){
            console.log("엔터 확인")
            onSearch(keyword);
        }
    }


    return(
          <div className={`flex justify-center m-10 ${className}`}>
            <div className="w-full max-w-[90%] h-[40px] flex-wrap items-center">
                <div className="relative flex"> 
                    {/* 검색창, 입력 */}
                    <input className="w-full p-3 pl-5 rounded-3xl border border-solid border-hashTagColor bg-subFirstColor shadow-md" 
                        value = {keyword}
                        placeholder="검색할 내용을 입력하세요"
                        onChange={(e) => setKeyword(e.target.value)} 
                        onKeyDown = {handleEnterKey}
                        ></input>

                    {/* 검색 아이콘 */}
                    <IoMdSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-xl cursor-pointer" 
                            size={27} 
                            onClick={() => {onSearch && onSearch(keyword);
                                console.log("확인");
                    }}> 
                    </IoMdSearch>
                </div>       
            </div>        
         </div>
     
    )
}
export default SearchBar;