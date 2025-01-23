import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";
import { FaGlobe } from "react-icons/fa";

const Website = () => {
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    dispatch(addNode({ type: "websiteNode" }));
  };

  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 bg-[#42cef8] hover:bg-[#259ec4] text-white mb-5`}
        onClick={handleButtonClick}
      >
        <FaGlobe />
      </button>
    </div>
  );
};

export default Website;
