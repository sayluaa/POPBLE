const getImageSrc = (fileName) => {
    if (!fileName) return "";
    // URL
    if (fileName.startsWith("http://") || fileName.startsWith("https://")) {
      return fileName;
    }
    // 기본경로
    return `http://localhost:8080/uploads/${fileName}`;
  };

  export default getImageSrc