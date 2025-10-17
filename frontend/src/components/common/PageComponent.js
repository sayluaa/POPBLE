const PageComponent = ({ serverData, movePage }) => {
  return (
    <div className="m-6 flex justify-center items-center">
      {serverData.prev ? (
        <div
          className="m-2 p-2 w-16 text-center font-bold text-black"
          onClick={() => movePage({ page: serverData.prevPage })}
        >
          ◀ 이전
        </div>
      ) : (
        <></>
      )}
      {serverData.pageNumList.map((pageNum) => (
        <div
          key={pageNum}
          className={`m-2 p-2 w-10 text-center text-black
                    ${
                      serverData.current === pageNum
                        ? "rounded-3xl bg-secondaryAccentColor shadow-md font-bold"
                        : ""
                    }`}
          onClick={() => movePage({ page: pageNum })}
        >
          {pageNum}
        </div>
      ))}
      {serverData.next ? (
        <div
          className="m-2 p-2 w-16 text-center font-bold text-black"
          onClick={() => movePage({ page: serverData.nextPage })}
        >
          다음 ▶
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PageComponent;
