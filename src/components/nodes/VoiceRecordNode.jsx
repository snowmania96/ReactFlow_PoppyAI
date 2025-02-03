import { useCallback, useEffect, useState, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { BiLoaderCircle } from "react-icons/bi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateNode } from "../../utils/flowSlice";
import FormData from "form-data";
const handleStyle = { left: 10 };

const VoiceRecordNode = ({ data, isConnectable }) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Fetching the title");
  const [script, setScript] = useState("Fetching the data insights");
  const dispatch = useDispatch();
  const audioUrl = data.audioUrl;

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const fetchScriptAndTitle = async (audioUrl) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      formData.append("file", blob, "audio.mp3");
      formData.append("model", "whisper-1");

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      };
      const openAiResponse1 = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: headers,
        }
      );
      const script = openAiResponse1.data.text;
      setScript(script);
      const openAiResponse2 = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-2024-08-06",
          messages: [
            {
              role: "system",
              content: "You extract email addresses into JSON data.",
            },
            {
              role: "user",
              content: `Here's a script. '${script}'  Please give me a short title for this script.`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );
      const title = openAiResponse2.data?.choices?.[0]?.message?.content;
      if (!title) {
        console.log("Failed to fetch title");
      }
      setTitle(title);
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
    } catch (error) {
      console.error("Error fetching transcription or title:", error);
    }
  };

  useEffect(() => {
    fetchScriptAndTitle(audioUrl);
  }, [data.audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const updateProgress = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setCurrentTime(audioRef.current.currentTime);
    if (progressRef.current) {
      progressRef.current.style.width = `${progress}%`;
    }
    if (progress === 100) {
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e) => {
    const progressBar = e.target;
    const clickPosition = (e.clientX - progressBar.offsetLeft) / progressBar.offsetWidth;
    audioRef.current.currentTime = clickPosition * audioRef.current.duration;
  };

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
              <h2 className="ml-2 font-semibold text-xs">Fetching the title</h2>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg">🎤</span>
              <h2 className="ml-2 w-56 font-semibold text-sm overflow-hidden overflow-ellipsis text-nowrap">
                {title}
              </h2>
            </div>
          )}
        </div>

        {/* <div className="flex items-center mt-4 space-x-4">
          <button className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600">
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
        </div> */}

        <div className="flex items-center mt-4 space-x-4">
          <button
            className="w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600"
            onClick={togglePlay}
          >
            {isPlaying ? "⏸️" : "▶"}
          </button>

          <div
            className="flex-1 bg-purple-200 h-4 rounded-lg relative overflow-hidden cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full bg-purple-500 rounded-lg"
              style={{ width: `${(currentTime / audioRef.current?.duration) * 100}%` }}
            ></div>
          </div>

          <span className="text-sm text-gray-600">
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, "0")}
          </span>

          <audio ref={audioRef} src={audioUrl} preload="metadata" />
        </div>

        <div className="mt-4 text-sm text-gray-700">
          {loading ? (
            <div className="flex items-center justify-center">
              <BiLoaderCircle size={"14"} className="loading-icon" color="purple" />
              <h2 className="ml-2 font-semibold text-xs">Fetching the data Insights</h2>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <h2 className="ml-2 font-semibold text-sm">{script}</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecordNode;
