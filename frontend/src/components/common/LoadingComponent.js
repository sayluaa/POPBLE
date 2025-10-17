import { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

const LoadingComponent = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div style={{ textAlign: "center" }}>
        {loading ? (
          <PulseLoader
            color="#B2D4FD"
            size={30}
            cssOverride={{ margin: "10px" }}
          />
        ) : (
          <p>데이터가 로드되었습니다.</p>
        )}
      </div>
    </div>
  );
};

export default LoadingComponent;
