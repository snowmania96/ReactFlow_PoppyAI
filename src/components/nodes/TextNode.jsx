import { useCallback, useEffect, useRef, useState } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { updateNode } from "../../utils/flowSlice";

const TextNode = ({ data, isConnectable }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 100 });
  const [script, setScript] = useState("");
  // const updateNodeInternals = useUpdateNodeInternals();
  const nodeRef = useRef(null);
  const dispatch = useDispatch();
  const handleResize = (event, params) => {
    setDimensions({ width: params.width, height: params.height });
  };
  const handleDoubleClick = () => {
    setIsEditable(true); // Enable editing on double-click
  };

  const handleBlur = (e) => {
    setIsEditable(false); // Disable editing when the textarea loses focus
    // setScript(e.target.value);
    dispatch(
      updateNode({
        id: data.id,
        data: {
          ...data,
          script: e.target.value,
        },
      })
    );
  };

  // const fetchScript = () => {
  //   dispatch(
  //     updateNode({
  //       id: data.id,
  //       data: {
  //         ...data,
  //         script: script,
  //       },
  //     })
  //   );
  // };
  // useEffect(() => {
  //   fetchScript();
  // }, [script]);

  return (
    <div
      style={{
        width: dimensions.width,
        height: dimensions.height,
        position: "relative",
      }}
    >
      <NodeResizer
        onResize={handleResize}
        color="#F7F9FB"
        isVisible={true} // Hides default corner controls
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
        className="mx-auto rounded-[10px] shadow-md border-[4px] border-gray-300 transition-colors duration-300 focus-within:border-[#c27dcf]"
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
        tabIndex="0"
      >
        <textarea
          placeholder="✏️ Double click to start writing..."
          style={{ fontSize: "14px", fontFamily: "cursive" }}
          className={`focus:outline-none border-none rounded-[10px] p-3 w-full resize-none overflow-hidden h-full ${
            isEditable ? "bg-white" : "bg-white cursor-pointer"
          }`}
          rows="3"
          readOnly={!isEditable} // Prevent editing unless editable
          onDoubleClick={handleDoubleClick} // Enable editing on double-click
          onBlur={handleBlur} // Disable editing on blur
        ></textarea>
      </div>
    </div>
  );
};

export default TextNode;
