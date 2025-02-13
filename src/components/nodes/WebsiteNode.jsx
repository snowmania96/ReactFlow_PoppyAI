import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { FiExternalLink } from "react-icons/fi";
import { FaGlobe } from "react-icons/fa";
import axios from "axios";
import { BiLoaderCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { ungroupNode } from "../../utils/flowSlice";
import { LucideUngroup } from "lucide-react";

const WebsiteNode = ({ data, isConnectable }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();
  const nodes = useSelector((store) => store.flow.nodes);
  const currentNode = nodes.find((node) => node.id === data.id);
  const isGrouped = !!currentNode ? !!currentNode.parentId : false;
  const unGroup = () =>
    dispatch(
      ungroupNode({
        id: data.id,
      })
    );

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASED_URL}/board/website`, {
        url,
      });
      setLoading(false);
      setImage(response.data.image);
      console.log(url);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLinkButtonClick = async () => {
    window.open(`${url}`, "_blank");
  };
  return (
    <div>
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
        className="max-w-md mx-auto bg-[#32b5e5] rounded-[15px] shadow-md border-[4px] transition-colors duration-300 focus-within:border-[#259ec4] focus:border-[#259ec4]"
        tabIndex="0"
      >
        <div className="flex justify-between items-center text-white px-4 py-2 rounded-[9px]">
          <div className="flex items-center space-x-2">
            {isGrouped && (
              <LucideUngroup
                size={"16"}
                className="hover:cursor-pointer"
                onClick={() => unGroup()}
              />
            )}
            <FaGlobe size={"14px"} />
            <span className="font-semibold">Website</span>
          </div>
          <div className="hover:cursor-pointer">
            <FiExternalLink size={"14px"} onClick={handleLinkButtonClick} />
          </div>
        </div>

        {image ? (
          <div className="relative">
            <img
              // src="https://placekitten.com/300/300"
              src={image}
              alt="Adorable Ginger Kitten"
              className="w-full h-auto rounded-b-[8px]"
              style={{ maxwidth: "100%", height: "auto", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="bg-white p-4 rounded-[10px] shadow-inner">
            <div className="flex items-center border border-gray-300 rounded-[9px] px-4 py-1 focus-within:border-[#32b5e5]">
              <input
                type="text"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                placeholder="Enter any website url"
                className="flex-1 focus:outline-none text-gray-600 text-sm border-gray-200 "
              />
              <button
                className="bg-[#32b5e5] text-white w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#259ec4] transition-transform transform hover:scale-110"
                onClick={handleButtonClick}
                disabled={loading}
              >
                {loading ? <BiLoaderCircle className="loading-icon" color="white" /> : "➜"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteNode;
