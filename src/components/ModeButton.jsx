import { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { MdLightMode, MdDarkMode } from "react-icons/md";

const ModeButton = () => {
  const { darkMode } = useContext(DarkModeContext);
  const { dispatch } = useContext(DarkModeContext);

  return (
    <button
      className="fixed top-5 right-5 hover:cursor-pointer z-50"
      onClick={() => {
        dispatch({ type: "TOGGLE" });
      }}
    >
      {darkMode ? (
        <MdDarkMode size={25} color="#1e1e1e" />
      ) : (
        <MdLightMode size={25} color="#e1e1e1" />
      )}
    </button>
  );
};

export default ModeButton;
