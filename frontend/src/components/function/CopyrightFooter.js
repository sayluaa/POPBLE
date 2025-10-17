import React from "react";

import { FiInstagram } from "react-icons/fi";
import { MdOutlineEmail } from "react-icons/md";

//저작권
const CopyrightFooter = ({ company = "POPBLE" }) => {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="mt-3 max-w-6xl flex flex-col justify-start m-5 gap-1">
        <p className="text-xs text-gray-800 mt-2 mb-2">
          Copyright © {year} {company}. All Rights Reserved.
        </p>
      
        {/* 아이콘: 저작권 밑에 위치 */}
        <a className="flex items-center gap-1"><FiInstagram size={18} />@Popble</a>
        <a className="flex items-center gap-1"><MdOutlineEmail size={19} />popble@gmail.com</a>
      </div>
      <div className="py-10"></div>
    </>
  );
};

export default CopyrightFooter;