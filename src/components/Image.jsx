import { useRef } from "react";
import { MdImage, MdTextFields } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";

const Image = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      dispatch(addNode({ type: "imageNode", imageUrl }));
      // Handle file upload logic here
    }
  };
  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 bg-pink-500 hover:bg-pink-700 text-white mb-5`}
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
