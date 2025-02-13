import { useRef } from "react";
import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";
import { GrDocumentText } from "react-icons/gr";
import axios from "axios";
import { useReactFlow } from "@xyflow/react";
const Document = () => {
  const { getViewport } = useReactFlow();
  const { x, y } = getViewport();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create FormData object to send file
      const formData = new FormData();
      formData.append("file", file);

      // Send the file to your backend for processing
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASED_URL}/board/document`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }, // Explicitly set the Content-Type
          }
        );
        console.log(response);

        if (!!response) {
          const script = response.data;
          console.log("Backend response:", script);
          // Dispatch any node updates or handle backend response here
          dispatch(
            addNode({
              type: "documentNode",
              file: file.name,
              script: script,
              x: x,
              y: y,
            })
          );
        } else {
          const script = "I can read content";
          console.log("Backend response:", script);
          // Dispatch any node updates or handle backend response here
          dispatch(
            addNode({
              type: "documentNode",
              file: file.name,
              script: script,
            })
          );
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 bg-[#f39b72] hover:bg-[#be6840] text-white `}
        onClick={handleButtonClick}
      >
        <GrDocumentText />
      </button>

      <input
        ref={fileInputRef}
        accept=".pdf, .txt, .csv, .docx, .odt, .xlsx, .pptx "
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Document;
