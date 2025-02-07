import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Mic,
  Send,
  PanelLeftClose,
  PanelLeft,
  PlusCircle,
  FullscreenIcon,
  DeleteIcon,
} from "lucide-react";
import { MdClose } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegStopCircle, FaMicrophone } from "react-icons/fa";
import "./Chat.css";

const ChatInterface = () => {
  const [selectedModel, setSelectedModel] = useState("Claude (Anthropic)");
  const [audioURL, setAudioURL] = useState("");
  const [audioBLOB, setAudioBLOB] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const animationId = useRef(null);
  const [messages, setMessages] = useState([]);
  const sampleChatHistory = [
    {
      title: "Pricing Strategy Discussion",
      model: "Claude",
      color: "bg-orange-900/20 text-orange-400",
      time: "2h ago",
      content: [],
    },
    {
      title: "Contract Review",
      model: "GPT-4",
      color: "bg-green-900 text-green-400",
      time: "Yesterday",
      content: [],
    },
    {
      title: "Sales Script Analysis",
      model: "DeepSeek",
      color: "bg-blue-900 text-blue-400",
      time: "2 days ago",
      content: [],
    },
  ];
  const [chatHistory, setChatHistory] = useState(sampleChatHistory);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [botMessage, setbotMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen state
  const chatContainerRef = useRef(null); // Reference to the main chat container

  const ws = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket("ws://localhost:8080");

    // Listen for messages from the WebSocket server
    ws.current.onmessage = (event) => {
      setbotMessage(event.data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", text: event.data, time: new Date().toLocaleString() },
      ]);
      setbotMessage("");
    };

    return () => {
      // Close WebSocket connection on cleanup
      // ws.current.close();
    };
  });

  const handleCloseChat = () => {
    // Save the current conversation to the history with the current time.
    const newChatHistory = {
      model: selectedModel,
      color:
        selectedModel === "Claude (Anthropic)"
          ? "bg-orange-900/20 text-orange-400"
          : selectedModel === "GPT-4 (OpenAI)"
          ? "bg-green-900 text-green-400"
          : "bg-blue-900 text-blue-400", // You can customize based on the model or other criteria
      time: new Date().toLocaleString(),
      content: messages,
    };

    // Update the chat history state
    setChatHistory([...chatHistory, newChatHistory]);

    // Clear the current messages (reset chat)
    setMessages([]);
  };

  const handleHistoryClick = (chat) => {
    setMessages(chat.content);
    setIsHistory(true);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setUserMessage(e.target.value);
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return;
      } else {
        setUserMessage(event.target.value);
        if (userMessage.trim()) {
          setMessages([
            ...messages,
            { role: "user", text: userMessage, time: new Date().toLocaleString() },
          ]);
          // Send the message to the WebSocket server
          if (ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(
              JSON.stringify([
                ...messages,
                { role: "user", text: userMessage, time: new Date().toLocaleString() },
              ])
            );
          } else {
            console.log("WebSocket is not open yet.");
          }
          setInput("");
          // Optionally, you can send this message to the backend here
          setUserMessage("");
        }
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);

      // Initialize MediaRecorder
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBLOB(audioBlob);
        fetchScriptAndSend(audioBlob);
      };

      // Initialize Web Audio API
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();

      source.connect(analyser.current);
      analyser.current.fftSize = 256; // Smaller fftSize for better resolution
      dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);

      mediaRecorder.current.start(); // Start recording
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  const fetchScriptAndSend = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.mp3");
      formData.append("model", "whisper-1");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      };
      const openAiResponse = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: headers,
        }
      );
      const script = openAiResponse.data.text;
      setScript(script);
      setInput(script);
    } catch (error) {
      console.error("Error fetching transcription:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    if (audioContext.current) {
      audioContext.current.close();
    }

    cancelAnimationFrame(animationId.current); // Stop the animation
    setIsRecording(false);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      if (chatContainerRef.current.requestFullscreen) {
        chatContainerRef.current.requestFullscreen();
      } else if (chatContainerRef.current.mozRequestFullScreen) {
        // Firefox
        chatContainerRef.current.mozRequestFullScreen();
      } else if (chatContainerRef.current.webkitRequestFullscreen) {
        // Chrome, Safari
        chatContainerRef.current.webkitRequestFullscreen();
      } else if (chatContainerRef.current.msRequestFullscreen) {
        // IE/Edge
        chatContainerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false); // Exit fullscreen
      } else {
        setIsFullscreen(true); // Enter fullscreen
      }
    };

    // Add event listener for fullscreen change
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // For Safari/Chrome
    document.addEventListener("mozfullscreenchange", handleFullscreenChange); // For Firefox
    document.addEventListener("msfullscreenchange", handleFullscreenChange); // For IE/Edge

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={chatContainerRef}
      className={`flex w-[1000px] h-[800px] bg-neutral-900 ${
        isFullscreen ? "fixed top-0 left-0 w-full h-full z-50" : ""
      }`}
    >
      {/* Sidebar */}
      {!isSidebarCollapsed && (
        <aside className="w-64 bg-neutral-800 border-r border-neutral-700 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <button
              className="text-neutral-400 hover:text-neutral-200"
              onClick={() => {
                setMessages([]);
                handleCloseChat();
              }}
            >
              <PlusCircle className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="text-neutral-400 hover:text-neutral-200"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* AI Model Select */}
          <div className="mb-6">
            <div className="text-sm text-neutral-400 mb-2">AI Model</div>
            <select
              className="w-full p-2 rounded bg-neutral-700 text-neutral-200 border border-neutral-600"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={false}
            >
              <option>Claude (Anthropic)</option>
              <option>GPT-4 (OpenAI)</option>
              <option>DeepSeek R1</option>
            </select>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <div className="text-sm text-neutral-400 mb-2">Chat History</div>
            <div className="flex flex-col gap-1">
              {chatHistory.map((chat, idx) => (
                <button
                  key={chat.time}
                  className="flex flex-col p-2 mb-2 rounded bg-neutral-700 hover:bg-neutral-700"
                  onClick={() => {
                    setMessages(chat.content);
                    setSelectedModel(chat.model);
                  }}
                >
                  <input
                    className="text-sm bg-neutral-700 text-neutral-200"
                    placeholder="Title..."
                  />
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${chat.color}`}>
                      {chat.model}
                    </span>
                    <span className="text-xs text-neutral-400">{chat.time}</span>
                    <span
                      onClick={() => {
                        chatHistory.splice(idx, 1);
                      }}
                      className="hover:bg-gray-300 p-1"
                    >
                      <RiDeleteBin6Line color="gray" size={16} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Main Chat Section */}
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-neutral-700 flex items-center justify-between px-6 bg-neutral-800 text-white font-semibold">
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="text-neutral-400 hover:text-neutral-200 mr-4"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center justify-start">
            <button onClick={handleCloseChat} className="flex pr-5">
              <MdClose className="w-5 h-5 text-neutral-400 hover:text-neutral-200 " />
            </button>

            {selectedModel}
          </div>
          <button onClick={toggleFullscreen}>
            <FullscreenIcon className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
          </button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-4 mb-4 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 mt-8 rounded bg-neutral-700 flex items-center justify-center shrink-0 text-[20px]">
                  🤖
                </div>
              )}
              <div>
                <div className="text-xs text-neutral-400 mt-2 flex justify-start mb-2">
                  {msg.time}
                </div>
                <div
                  className={`text-left font-sans text-[15px] flex items-center justify-center px-5 py-3  rounded ${
                    msg.role === "user"
                      ? "max-w-96 bg-neutral-400 text-neutral-950"
                      : "max-w-[80%]  bg-neutral-700 text-neutral-200"
                  } break-words whitespace-pre-wrap leading-relaxed`}
                >
                  {msg.text}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 mt-8 rounded bg-neutral-400 flex items-center justify-center shrink-0">
                  <FaRegUser size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input Bar */}
        <div className="border-t border-neutral-700 p-6 bg-neutral-800 flex items-center">
          <div className="relative flex-1">
            <textarea
              className="w-full bg-neutral-700 text-[15px] font-sans text-neutral-200 p-3 pr-12 rounded border border-neutral-600 focus:outline-none"
              placeholder="Message..."
              value={input}
              onChange={(e) => handleInputChange(e)}
              onKeyUp={(e) => handleEnterPress(e)}
              rows={3}
            />

            <button
              className={`absolute right-8 top-1/2 transform -translate-y-1/2 roun text-neutral-400 hover:text-neutral-200 `}
              onClick={
                isRecording
                  ? () => {
                      stopRecording();
                    }
                  : startRecording
              }
            >
              {isRecording ? (
                <FaRegStopCircle className="pumping-icon" size={25} color="red" />
              ) : (
                <FaMicrophone size={25} />
              )}
            </button>
            {/* </button> */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;
