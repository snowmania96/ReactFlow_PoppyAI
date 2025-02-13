import { useRef } from "react";
import { MdImage } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";

const Image = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    console.log(fileInputRef.current);
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(addNode({ type: "imageNode", imageUrl: imageUrl }));
      // Handle file upload logic here
    }
  };
  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-700 bg-pink-500 hover:bg-pink-700 text-white `}
        onClick={handleButtonClick}
      >
        <MdImage />
      </button>

      <input
        ref={fileInputRef}
        accept="image/*"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Image;
