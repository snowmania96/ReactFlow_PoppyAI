import { useCallback, useEffect, useState } from "react";
import { Handle, NodeResizeControl, Position } from "@xyflow/react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { updateNode } from "../../utils/flowSlice";
import { BiLoaderCircle, BiImage } from "react-icons/bi";

const ImageNode = ({ data, isConnectable }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [title, setTitle] = useState("Fetching the title");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const getTitleFromImage = async (imageUrl) => {
    setLoading(true);
    const convertBlobToBase64 = async (imageUrl) => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    // Example usage
    const imageForOpenAI = await convertBlobToBase64(imageUrl);
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-2024-08-06",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please give me a title for this image.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageForOpenAI,
                },
              },
            ],
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

    const tempTitle = response.data?.choices?.[0]?.message?.content?.slice(1, -1);
    console.log(tempTitle);
    if (!title) {
      console.log("Failed to fetch title");
    }
    setLoading(false);
    setTitle(tempTitle);
    dispatch(
      updateNode({
        id: data.id,
        data: {
          ...data,
          title: title,
        },
      })
    );
  };

  useEffect(() => {
    getTitleFromImage(data.imageUrl);
  }, [data.imageUrl]);

  const handleZoomClick = () => {
    setIsZoomed(true); // Show the modal
  };

  const handleCloseModal = () => {
    setIsZoomed(false); // Hide the modal
  };
  return (
    <div className="text-updater-node">
      <Handle
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
        className="w-[320px] mx-auto bg-white rounded-[12px] shadow-md border-[4px] border-gray-300 transition-colors duration-300 focus-within:border-[#eb99e7] "
        tabIndex={0}
      >
        {/* Title Section */}
        <div className="flex items-center space-x-2 px-4 py-2 bg-purple-400 rounded-t-[8px]">
          {loading ? (
            <BiLoaderCircle size={"18"} className="loading-icon" color="white" />
          ) : (
            <BiImage size={"18"} color="white" />
          )}
          <h3 className="text-white font-semibold text-sm">{title}</h3>
        </div>

        {/* Image Section */}
        <div className="relative">
          <img
            // src="https://placekitten.com/300/300"
            src={data.imageUrl || "AdobeStock_797148184_Preview.jpeg"}
            alt="Adorable Ginger Kitten"
            className="w-full h-auto rounded-b-[8px]"
          />
          {/* Zoom Icon */}
          <button
            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all focus:outline-none"
            onClick={handleZoomClick}
            onFocus={() => console.log("Button Focused")}
          >
            🔍
          </button>
        </div>
      </div>

      {/* Full-Screen Modal */}
      {isZoomed &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
            onClick={handleCloseModal} // Close the modal when clicking the background
          >
            <div
              className="relative bg-white rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // Prevent background click from closing the modal
            >
              <img
                src={data.imageUrl || "AdobeStock_797148184_Preview.jpeg"}
                alt="Zoomed Adorable Ginger Kitten"
                className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
              />
              <button
                className="absolute top-3 right-3 bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-300 transition-all"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>
          </div>,
          document.body // Render modal in the root of the DOM
        )}
    </div>
  );
};

export default ImageNode;
