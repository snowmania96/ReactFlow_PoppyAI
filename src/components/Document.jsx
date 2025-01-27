import { useRef } from "react";
import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";
import { GrDocumentText } from "react-icons/gr";
const Document = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log(file);
      console.log(imageUrl);
      dispatch(addNode({ type: "documentNode", file: file.name }));
      // Handle file upload logic here
    }
  };
  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 bg-[#f39b72] hover:bg-[#be6840] text-white mb-5`}
        onClick={handleButtonClick}
      >
        <GrDocumentText />
      </button>

      <input
        ref={fileInputRef}
        accept=".pdf, .doc, .text, .txt, .csv, .dot, .doc, .docx, .odt, .xls, .xlsx, .com, .exe, .bin, .epub, .pub"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Document;
