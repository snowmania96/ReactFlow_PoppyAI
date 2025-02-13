import { Handle, Position, NodeResizer } from "@xyflow/react";
import React, { useEffect, useRef, useState } from "react";

import { FaFolder } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { updateNode } from "../../utils/flowSlice";

const GroupNode = ({ data, isConnectable }) => {
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  const [isFocus, setIsFocus] = useState(false);
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  const nodes = useSelector((store) => store.flow.nodes);
  const currentNode = nodes.find((node) => node.id === data.id);
  const newScriptArray = [];
  const getScript = () => {
    const childNodes = nodes.filter((node) => node.parentId === data.id);

    for (let node of childNodes) {
      newScriptArray.push({ id: node.id, type: node.type, script: node.data.script });
    }
    console.log(newScriptArray);

    dispatch(
      updateNode({
        id: data.id,
        data: {
          ...data,
          scriptArray: newScriptArray,
        },
      })
    );
  };

  useEffect(() => {
    getScript();
  }, []);

  const handleResize = (event, params) => {
    setDimensions({ width: params.width, height: params.height });
  };

  return (
    <div
      onClick={() => setIsFocus(!isFocus)}
      ref={nodeRef}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
      }}
      className="text-updater-node"
    >
      <NodeResizer
        onResize={handleResize}
        color="#F7F9FB"
        isVisible={isFocus} // Hides default corner controls
        minWidth={200}
        minHeight={150}
      />
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
        className={`w-full h-full mx-auto rounded-[15px] shadow-md border-[4px]  focus-within:border-gray-500 transition-colors duration-300 flex flex-col ${
          data.parentReady ? "border-gray-500" : "border-gray-300"
        }`}
        tabIndex="0"
      >
        {/* <!-- Header --> */}
        <div className="flex justify-between items-center h-[40px] bg-slate-800 text-white px-4 py-2 rounded-t-[8px] rounded-b-[-12px]">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              <FaFolder color="white" />
            </span>
            <input className="font-semibold bg-slate-800" placeholder="Type the title..."></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupNode;
