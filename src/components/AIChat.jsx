import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";
import { BsChatDotsFill } from "react-icons/bs";

const AIChat = () => {
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    dispatch(addNode({ type: "aichatNode" }));
  };

  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 bg-blue-500 hover:bg-blue-600 text-white `}
        onClick={handleButtonClick}
      >
        <BsChatDotsFill />
      </button>
    </div>
  );
};

export default AIChat;
