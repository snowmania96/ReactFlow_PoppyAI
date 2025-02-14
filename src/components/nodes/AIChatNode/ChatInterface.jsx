import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { PanelLeftClose, PanelLeft, PlusCircle, FullscreenIcon } from "lucide-react";
import { FaRegUser } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegStopCircle, FaMicrophone } from "react-icons/fa";
import "./Chat.css";
import { updateNode } from "../../../utils/flowSlice";
import { GrClose } from "react-icons/gr";
import { BiLoader } from "react-icons/bi";

const ChatInterface = ({ chatNodeId }) => {
  const [selectedModel, setSelectedModel] = useState("Claude");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const animationId = useRef(null);
  const [messages, setMessages] = useState([]);
  const sampleChatHistory = [
    // {
    //   title: "Pricing Strategy Discussion",
    //   model: "Claude",
    //   color: "bg-orange-900/20 text-orange-400",
    //   time: "2h ago",
    //   content: [],
    // },
    // {
    //   title: "Contract Review",
    //   model: "GPT-4",
    //   color: "bg-green-900 text-green-400",
    //   time: "Yesterday",
    //   content: [],
    // },
    // {
    //   title: "Sales Script Analysis",
    //   model: "DeepSeek",
    //   color: "bg-blue-900 text-blue-400",
    //   time: "2 days ago",
    //   content: [],
    // },
  ];
  const [chatHistory, setChatHistory] = useState(sampleChatHistory);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userMessage, setUserMessage] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false); // Track fullscreen state
  const chatContainerRef = useRef(null); // Reference to the main chat container
  const textAreaRef = useRef(null); // Create a ref for the textarea

  const [scriptArray, setScriptArray] = useState([]);
  const [sourceNodes, setSourceNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [isEnterPress, setIsEnterPress] = useState(false);
  const edges = useSelector((store) => store.flow.edges);
  const nodes = useSelector((store) => store.flow.nodes);
  const currentEdges = edges.filter((edge) => edge.target === chatNodeId);
  const sourceNodeId = currentEdges.map((edge) => {
    return edge.source;
  });
  const tempSourceNodes = nodes.filter((node) => sourceNodeId.includes(node.id));
  const getScript = () => {
    if (JSON.stringify(tempSourceNodes) !== JSON.stringify(sourceNodes)) {
      setSourceNodes(tempSourceNodes);
    }
    const targetNode = nodes.find((node) => node.id === chatNodeId);
    const newScriptArray = sourceNodes.map((node) => ({
      id: node.id,
      type: node.type,
      script: node.data.script,
    }));
    setScriptArray(newScriptArray);
    dispatch(
      updateNode({
        id: chatNodeId,
        data: {
          ...targetNode.data,
          scriptArray: newScriptArray,
        },
      })
    );
  };

  useEffect(() => {
    getScript();
  }, [sourceNodes, isEnterPress]);

  const handleCloseChat = () => {
    // Clear the current messages (reset chat)
    setMessages([]);
  };

  const handleSaveChat = () => {
    if (messages.length > 0) {
      // Save the current conversation to the history with the current time.
      const newChatHistory = {
        model: selectedModel,
        color:
          selectedModel === "Claude"
            ? "bg-orange-900/20 text-orange-400"
            : selectedModel === "GPT-4"
            ? "bg-green-900 text-green-400"
            : "bg-blue-900 text-blue-400", // You can customize based on the model or other criteria
        time: new Date().toLocaleString(),
        content: messages,
      };

      // Update the chat history state
      setChatHistory([...chatHistory, newChatHistory]);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setUserMessage(e.target.value);
  };

  const handleEnterPress = async (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return;
      } else {
        setInput("");
        setIsEnterPress(true);
        setUserMessage(event.target.value);
        if (userMessage.trim()) {
          const newMessage = { role: "user", text: userMessage, time: new Date().toLocaleString() };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setInput((input) => input.slice(0, -1));
          const content = JSON.stringify({
            messages: [...messages, newMessage],
            linkedNodeInfo: scriptArray,
          });
          setLoading(true);
          try {
            const response = await axios.post(`${process.env.REACT_APP_BASED_URL}/board/chat`, {
              content,
            });
            const script = response.data;

            const botMsg = { role: "bot", text: script, time: new Date().toLocaleString() };
            setLoading(false);
            setMessages((prevMessages) => [...prevMessages, botMsg]);
            setUserMessage(false);
          } catch (error) {
            console.error("Error while fetching the stream:", error);
          }
        }
        setIsEnterPress(false);
      }
    }
  };
  useEffect(() => {
    let top = 0;
    for (let i = 0; i < messages.length; i++) {
      top += 2 * document.getElementById(`${chatNodeId}${i}`).getBoundingClientRect().height;
    }
    document.getElementById(`${chatNodeId}chatMessages`).scrollTo({
      top: top,
      behavior: "smooth",
    });
  }, [messages]);

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
        setIsConverting(true);
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
      setInput(script);
      setIsConverting(false);
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

    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
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

  const handleHistoryDelClick = (idx) => {
    const newChatHistory = [...chatHistory]; // Create a copy of the current chatHistory
    newChatHistory.splice(idx, 1); // Remove the item at the given index
    setChatHistory(newChatHistory); // Update state with the new array
  };

  return (
    <div
      ref={chatContainerRef}
      className={`flex w-[800px] h-[640px] bg-neutral-900 
        ${isFullscreen ? "fixed top-0 left-0 w-full h-full z-50" : ""}`}
    >
      {/* Sidebar  */}
      {!isSidebarCollapsed && (
        <aside className="w-56 bg-neutral-800 border-r border-neutral-700 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <button
              className="text-neutral-400 hover:text-neutral-200"
              onClick={() => {
                setMessages([]);
                handleCloseChat();
                handleSaveChat();
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
          <div className="mb-6 mr-3">
            <div className="text-sm text-neutral-400 mb-2">AI Model</div>
            <select
              className="w-full p-2 rounded-2xl bg-neutral-700 text-neutral-200 border border-neutral-600"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={false}
            >
              <option>
                Claude
                {/* (Anthropic) */}
              </option>
              <option>
                GPT-4
                {/* (OpenAI) */}
              </option>
              <option>
                Deep Seek
                {/* R1 */}
              </option>
            </select>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <div className="text-sm text-neutral-400 mb-2 mr-3">Chat History</div>
            <div className="flex flex-col gap-1">
              {chatHistory.map((chat, idx) => (
                <button
                  key={chat.time}
                  className="flex flex-col p-2 mb-2 mr-3 rounded-2xl bg-neutral-700 hover:bg-neutral-700"
                  onClick={() => {
                    setMessages(chat.content);
                    setSelectedModel(chat.model);
                  }}
                >
                  <input
                    className="text-sm bg-neutral-700 text-neutral-200 max-w-10 focus-within:outline-none"
                    placeholder="Title..."
                  />
                  <div className="flex items-center justify-start mt-1">
                    <span className={`w-12 text-xs px-1.5 py-0.5 rounded ${chat.color}`}>
                      {chat.model}
                    </span>
                    <p className="w-20 text-xs pr-1.5 text-neutral-400">{chat.time}</p>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHistoryDelClick(idx);
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
        <header className="h-14 border-b border-neutral-700 flex items-center justify-normal px-6 bg-neutral-800 text-white font-semibold">
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="text-neutral-400 hover:text-neutral-200 mr-4"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center justify-start">
            <button className="flex pr-5">
              {/* <FaSave
                onClick={handleSaveChat}
                className="w-5 h-5 text-neutral-400 hover:text-neutral-200 "
              /> */}
              <GrClose
                onClick={() => {
                  handleCloseChat();
                  handleSaveChat();
                }}
                className="w-5 h-5 ml-4 mr-5 text-neutral-400 hover:text-neutral-200 "
              />
            </button>
            <p>{selectedModel}</p>
          </div>
          <button onClick={toggleFullscreen}>
            <FullscreenIcon className="w-5 h-5 fixed right-5 top-5 text-neutral-400 hover:text-neutral-200" />
          </button>
        </header>

        {/* Chat Messages */}
        <div
          id={`${chatNodeId}chatMessages`}
          className="flex-1 pt-6 pr-3 pl-3 overflow-y-auto max-h-screen"
        >
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex mb-4 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "bot" && (
                <div className="flex-col flex items-center justify-center text-[28px]">
                  <div className="w-10 h-10  bg-neutral-700 rounded-xl">🤖</div>
                  <div className="w-16 text-xs text-neutral-400 mt-2">{msg.time}</div>
                </div>
              )}
              <div id={`${chatNodeId}${idx}`}>
                <div
                  className={`text-left font-sans text-[15px] flex items-center justify-center px-4 py-3  rounded-2xl ${
                    msg.role === "user"
                      ? "max-w-96 min-w-40 mr-1 bg-neutral-400 text-neutral-950"
                      : "max-w-[80%] ml-1 bg-neutral-700 text-neutral-200"
                  } break-words whitespace-pre-wrap leading-relaxed`}
                >
                  {msg.text}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="flex-col  flex items-center justify-center text-[20px]">
                  <div className="w-10 h-10 rounded-xl bg-neutral-400 flex items-center justify-center ">
                    <FaRegUser size={28} />
                  </div>
                  <div className="w-16 text-xs text-neutral-400 mt-2">{msg.time}</div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="pl-5 pb-5">
              <BiLoader size={"24"} className="loading-icon" color="white" />
            </div>
          )}
        </div>

        {/* Message Input Bar */}
        <div className="border-t border-neutral-700 p-6 bg-neutral-800 flex items-center">
          <div className="relative flex-1">
            <textarea
              ref={textAreaRef}
              className="w-full bg-neutral-700 text-[15px] font-sans font-light text-neutral-200 p-3 pr-12 rounded-xl border border-neutral-600 focus-within:outline-none"
              placeholder={
                isRecording ? "Recording..." : isConverting ? "Converting..." : "Message..."
              }
              value={input}
              onChange={(e) => handleInputChange(e)}
              onKeyUp={(e) => handleEnterPress(e)}
              rows={2}
            />

            <button
              className={`absolute right-8 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 `}
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
