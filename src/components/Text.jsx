import { MdTextFields } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";

const Text = () => {
  const dispatch = useDispatch();
  const handleButtonClick = () => {
    dispatch(addNode({ type: "textNode" }));
  };

  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 bg-[#f06996] hover:bg-[#bb5275] text-white `}
        onClick={handleButtonClick}
      >
        <MdTextFields />
      </button>
    </div>
  );
};

export default Text;
