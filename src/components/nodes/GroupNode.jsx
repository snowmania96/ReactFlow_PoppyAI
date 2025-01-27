import {
  NodeResizeControl,
  Handle,
  Position,
  useUpdateNodeInternals,
} from "@xyflow/react";
import React, { useRef, useState } from "react";

const GroupNode = ({ data, isConnectable }) => {
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  console.log(data);
  const updateNodeInternals = useUpdateNodeInternals();
  const nodeRef = useRef(null);

  const handleResize = (event) => {
    const { width, height } = nodeRef.current.getBoundingClientRect();
    setDimensions({ width, height });
    // Notify React Flow about the dimension changes
    updateNodeInternals(data);
  };

  return (
    <div
      ref={nodeRef}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        border: "1px solid #ddd",
        position: "relative",
      }}
      className="text-updater-node"
    >
      <NodeResizeControl onResize={(e) => console.log(e)} />
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
      <div>Hello</div>
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "0",
          fontSize: "12px",
          color: "#888",
        }}
      >
        Width: {dimensions.width}px, Height: {dimensions.height}px
      </div>
    </div>
  );
};

export default GroupNode;
