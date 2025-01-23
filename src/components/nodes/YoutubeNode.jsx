import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaYoutube } from "react-icons/fa";
import { IoPlayOutline } from "react-icons/io5";

const YoutubeNode = ({ data, isConnectable }) => {
  const [playButtonClicked, setPlayButtonClicked] = useState(false);

  const extractVideoId = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="text-updater-node">
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          width: "15px",
          height: "15px",
          background: "white",
          border: "2px solid #32b5e5",
          borderRadius: "50%",
          position: "absolute",
          right: "-15px",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          lineHeight: "15px",
          fontSize: "12px",
          justifyContent: "center",
          transition: "transform 0.2s, background-color 0.2s, right 0.2s",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-50%) scale(2)";
          e.target.style.background = "#32b5e5";
          e.target.style.color = "white";
          e.target.innerHTML = "+";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1)";
          e.target.style.background = "white";
          e.target.style.color = "";
          e.target.innerHTML = "";
        }}
      />
      <div
        className="w-auto mx-auto bg-[#ee4949] rounded-[15px] shadow-md border-[4px] transition-colors duration-300 focus-within:border-[#ee886f]"
        tabIndex="0"
      >
        <div className="flex justify-between items-center text-white px-4 py-2 rounded-[9px]">
          <div className="flex items-center space-x-2">
            <FaYoutube size={"18"} />
            <span className="font-semibold text-[16px]">YouTube</span>
          </div>
        </div>

        {playButtonClicked ? (
          <div className="relative w-[500px] h-[300px]">
            <iframe
              className="w-[500px] h-[300px] rounded-b-[8px]"
              src={`https://www.youtube.com/embed/${extractVideoId(
                data.sourceUrl
              )}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          </div>
        ) : (
          <div className="relative">
            <img
              src={data.imageUrl}
              alt="youtube thumbnail"
              className="w-[500px] h-[300px] rounded-b-[8px]"
            />
            <button
              className="absolute flex items-center justify-center bg-black bg-opacity-50 text-white rounded-[12px] text-[48px] transition duration-300 hover:bg-red-600"
              style={{
                width: "100px",
                height: "80px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setPlayButtonClicked(true)}
            >
              <IoPlayOutline />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeNode;
