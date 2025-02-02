import { useCallback, useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { BiLoaderCircle } from "react-icons/bi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateNode } from "../../utils/flowSlice";

const handleStyle = { left: 10 };

const VoiceRecordNode = ({ data, isConnectable }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const onChange = useCallback((evt) => console.log(evt.target.value));

  console.log(data);
  const audioUrl = data.audioUrl;
  const fetchScriptAndTitle = async (audioUrl) => {
    setLoading(true);
    const response = await axios.post(`${process.env.REACT_APP_BASED_URL}/board/audioScript`, {
      audioUrl,
    });

    const title = response.data.title;
    const script = response.data.script;

    setLoading(false);
    dispatch(
      updateNode({
        id: data.id,
        data: {
          ...data,
          title: title,
          script: script,
        },
      })
    );
  };

  useEffect(() => {
    fetchScriptAndTitle(audioUrl);
  }, [data.audioUrl]);

  return (
    <div className="text-updater-node">
      <Handle
        id="red"
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          width: "15px", // Default width
          height: "15px", // Default height
          background: "white", // Default background color
          border: "2px solid #32b5e5", // Default border color
          borderRadius: "50%", // Circular shape
          position: "absolute",
          right: "-15px", // Ensure proper alignment
          // top: "50%", // Align vertically
          transform: "translateY(-50%)", // Center the handle
          display: "flex",
          alignItems: "center",
          lineHeight: "15px", // Match the handle's height for vertical centering
          fontSize: "12px", // Ensure text size fits
          justifyContent: "center",
          transition: "transform 0.2s, background-color 0.2s, right 0.2s", // Smooth hover transition
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-50%) scale(2)"; // Keep alignment and scale
          e.target.style.background = "#32b5e5"; // Change background to blue
          e.target.style.color = "white"; // Set text color to white
          e.target.innerHTML = "+"; // Add "+" symbol inside
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1)"; // Reset scale while maintaining alignment
          e.target.style.background = "white"; // Reset background to white
          e.target.style.color = ""; // Clear the text color
          e.target.innerHTML = ""; // Remove "+" symbol
        }}
      />

      <div
        className="max-w-md mx-auto bg-purple-100 rounded-xl shadow-lg border-[4px] border-gray-300 p-4 transition-colors duration-300 focus-within:border-[#da9dec]"
        tabIndex="0"
      >
        <div className="flex items-center space-x-2 bg-purple-300 text-white px-4 py-2 rounded-[15px]">
          {loading ? (
            <div className="flex items-center justify-center">
              <BiLoaderCircle size={"16"} className="loading-icon" color="white" />
              <h2 className="ml-2 font-semibold text-xs">Fetching the insights</h2>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg">🎤</span>
              <h2 className="ml-2 font-semibold text-sm">Extracting Data Insights</h2>
            </div>
          )}
        </div>

        <div className="flex items-center mt-4 space-x-4">
          <button className="w-10 h-10 flex items-center justify-center bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600">
            ▶
          </button>

          <div className="flex-1 bg-purple-200 h-4 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2/3 h-full bg-purple-500 rounded-lg"></div>
          </div>

          <span className="text-sm text-gray-600">00:14</span>
        </div>

        <div className="mt-2 flex justify-end">
          <button className="px-3 py-1 text-sm font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-600">
            1x
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-700">
          {/* <p>
            So. Okay, let me get this tradeaight at this institution. So in this poppy AI, I want to
            extract some information and useful information from these datas. This is the main point
            of this poppy AI.
          </p> */}

          {loading ? (
            <div className="flex items-center justify-center">
              <BiLoaderCircle size={"14"} className="loading-icon" color="purple" />
              {/* <h2 className="ml-2 font-semibold text-xs">Fetching the script</h2> */}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg">🎤</span>
              <h2 className="ml-2 font-semibold text-sm">Extracting Data Insights</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordNode;
