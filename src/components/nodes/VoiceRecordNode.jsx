import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { Handle, Position } from "@xyflow/react";
import { BiLoaderCircle, BiStop, BiPlay, BiPause } from "react-icons/bi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateNode } from "../../utils/flowSlice";
import FormData from "form-data";

import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
const handleStyle = { left: 10 };

const VoiceRecordNode = ({ data, isConnectable }) => {
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Fetching the title");
  const [script, setScript] = useState("Fetching the data insights");
  const dispatch = useDispatch();
  const audioUrl = data.audioUrl;

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

  const formatTime = (seconds) =>
    [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(":");
  const containerRef = useRef(null);
  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: audioUrl,
    // plugins: useMemo(() => [Timeline.create()], []),
  });
  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

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
        className="w-80 mx-auto bg-purple-100 rounded-xl shadow-lg border-[4px] border-gray-300 p-4 transition-colors duration-300 focus-within:border-[#da9dec]"
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

        <>
          <div ref={containerRef} className="w-auto h-25" />
          <div className="flex items-center justify-center">
            <button onClick={onPlayPause} style={{ minWidth: "5em" }}>
              {isPlaying ? <BiPause /> : <BiPlay />}
            </button>
            <p>{formatTime(currentTime)}</p>
          </div>
        </>

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
