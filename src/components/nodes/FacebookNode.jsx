import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import { FaFacebook } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const FacebookNode = ({ data, isConnectable }) => {
  console.log("data: ", data);
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
        className="max-w-sm mx-auto bg-[#d56cf0] rounded-[15px] shadow-md border-[4px] transition-colors duration-300 focus-within:border-[#ee9bee]"
        tabIndex="0"
      >
        <div className="flex justify-between items-center text-white px-4 py-2 rounded-[9px]">
          <div className="flex items-center space-x-2">
            <FaFacebook size={"16"} />
            <span className="font-semibold text-[16px]">Facebook</span>
          </div>
          <FiExternalLink
            size={"16"}
            className="hover:cursor-pointer"
            onClick={() => {
              window.open(data.sourceUrl || null, "_blank");
            }}
          />
        </div>

        {data.imageUrl ? (
          <div className="relative">
            <img
              src={data.imageUrl}
              alt="Facebook thumbnail"
              className="w-[300px] h-[500px] rounded-b-[8px]"
            />
          </div>
        ) : (
          <div className="w-[300px] h-[500px] rounded-b-[8px] bg-white"></div>
        )}
      </div>
    </div>
  );
};

export default FacebookNode;
