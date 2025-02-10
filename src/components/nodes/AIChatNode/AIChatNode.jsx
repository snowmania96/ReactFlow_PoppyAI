import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

import React, { useState, useEffect } from "react";

import ChatInterface from "./ChatInterface";

const handleStyle = { left: 10 };

const AIChatNode = ({ data, isConnectable }) => {
  const onChange = useCallback((evt) => console.log(evt.target.value));

  return (
    <div className="text-updater-node">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          width: "15px", // Default width
          height: "15px", // Default height
          background: "white", // Default background color
          border: "2px solid #32b5e5", // Default border color
          borderRadius: "50%", // Circular shape
          position: "absolute",
          left: "-15px", // Ensure proper alignment
          top: "50%", // Align vertically
          transform: "translateY(50%)", // Center the handle
          display: "flex",
          alignItems: "center",
          lineHeight: "15px", // Match the handle's height for vertical centering
          fontSize: "12px", // Ensure text size fits
          justifyContent: "center",
          transition: "transform 0.2s, background-color 0.2s, right 0.2s", // Smooth hover transition
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(50%) scale(2)"; // Keep alignment and scale
          e.target.style.background = "#32b5e5"; // Change background to blue
          e.target.style.color = "white"; // Set text color to white
          e.target.innerHTML = "+"; // Add "+" symbol inside
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(50%) scale(1)"; // Reset scale while maintaining alignment
          e.target.style.background = "white"; // Reset background to white
          e.target.style.color = ""; // Clear the text color
          e.target.innerHTML = ""; // Remove "+" symbol
        }}
      />
      <ChatInterface chatNodeId={data.id} />
    </div>
  );
};

export default AIChatNode;
