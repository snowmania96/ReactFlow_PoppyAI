import { useEffect, useState, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaYoutube } from "react-icons/fa";
import { IoPlayOutline } from "react-icons/io5";
import { BiLoaderCircle } from "react-icons/bi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateNode } from "../../utils/flowSlice";

const YoutubeNode = ({ data, isConnectable }) => {
  const [playButtonClicked, setPlayButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(null);
  const dispatch = useDispatch();

  const extractVideoId = (url) => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  const fetchScriptAndTitle = async (url) => {
    setLoading(true);
    const response1 = await axios.post(`${process.env.REACT_APP_BASED_URL}/board/youtube/script`, {
      url,
    });
    const script = response1.data;
    console.log(script);

    const response2 = await axios.post(`${process.env.REACT_APP_BASED_URL}/board/title`, {
      script,
    });
    const title = response2.data?.choices?.[0]?.message?.content?.slice(1, -1);

    setLoading(false);
    setTitle(title);
    dispatch(
      updateNode({
        id: data.id,
        data: {
          ...data,
          script: script,
          title: title,
        },
      })
    );
  };

  useEffect(() => {
    fetchScriptAndTitle(data.sourceUrl);
  }, [data.sourceUrl]);

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
          willChange: "transform",
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
            {loading ? (
              <div className="flex items-center justify-center">
                <BiLoaderCircle size={"18"} className="loading-icon" color="white" />
                <span className=" flex justify-start font-semibold text-[16px]">
                  Fetching the title
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-start">
                <FaYoutube size={"18"} />
                <span className="w-56 font-semibold text-[14px] overflow-hidden overflow-ellipsis text-nowrap">
                  {title}
                </span>
              </div>
            )}
          </div>
        </div>

        {playButtonClicked ? (
          <div className="relative w-[500px] h-[300px]">
            <iframe
              className="w-[500px] h-[300px] rounded-b-[8px]"
              src={`https://www.youtube.com/embed/${extractVideoId(data.sourceUrl)}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          </div>
        ) : (
          <div className="relative">
            <img
              src={`https://img.youtube.com/vi/${extractVideoId(data.sourceUrl)}/maxresdefault.jpg`}
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
