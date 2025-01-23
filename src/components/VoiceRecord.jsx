import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaRegStopCircle } from "react-icons/fa";

const VoiceRecord = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const canvasRef = useRef(null);
  const animationId = useRef(null);

  useEffect(() => {
    if (isRecording && canvasRef.current) {
      startVisualization(); // Start drawing bars when canvas is ready
    }
  }, [isRecording]);

  const startVisualization = () => {
    const drawBars = () => {
      const canvas = canvasRef.current;
      if (!canvas) return; // Ensure canvas exists
      const canvasCtx = canvas.getContext("2d");

      // Clear the canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Get frequency data
      analyser.current.getByteFrequencyData(dataArray.current);

      // Set bar dimensions
      const barWidth = (canvas.width / dataArray.current.length) * 1.5; // Width of each bar
      let barHeight;
      let x = 0;

      for (let i = 0; i < dataArray.current.length; i++) {
        barHeight = dataArray.current[i] / 2; // Scale height for better visibility

        canvasCtx.fillStyle = "#10b981"; // Bar color
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight); // Draw the bar

        x += barWidth + 1; // Add spacing between bars
      }

      animationId.current = requestAnimationFrame(drawBars);
    };

    drawBars(); // Start the drawing loop
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

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      // Initialize Web Audio API
      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)();
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

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    if (audioContext.current) {
      audioContext.current.close();
    }

    console.log(audioURL);

    cancelAnimationFrame(animationId.current); // Stop the animation
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center mt-5">
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 ${
          isRecording ? "bg-red-500" : "bg-purple-500 hover:bg-purple-700"
        } text-white mb-5`}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? <FaRegStopCircle /> : <FaMicrophone />}
      </button>

      {/* Conditionally Render Canvas */}
      {isRecording && (
        <canvas
          ref={canvasRef}
          width="300"
          height="50"
          className="bg-gray-800 rounded-[8px] absolute top-8 left-16"
        ></canvas>
      )}

      {/* Recorded Audio */}
      {/* {audioURL && (
        <div className="mt-5 ml-[32rem]">
          <h3 className="text-lg font-semibold">Recorded Audio</h3>
          <audio controls src={audioURL}></audio>
        </div>
      )} */}
    </div>
  );
};

export default VoiceRecord;
