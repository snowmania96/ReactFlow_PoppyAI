import { NodeResizeControl, Handle, Position } from "@xyflow/react";

const controlStyle = {
  background: "rgba(189, 35, 255, 1)",
};

const GroupNode = ({ data, isConnectable }) => {
  return (
    <div className="node-container" style={{ position: "relative" }}>
      {/* Header Section */}
      <div
        style={{
          height: 40, // Fixed height for the header
          backgroundColor: "#2b2e4a",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        {data.label || "Group Node"}
      </div>

      {/* Resizable Body Section */}
      <NodeResizeControl
        style={controlStyle}
        minWidth={200}
        minHeight={100}
        maxWidth={1200}
        maxHeight={900}
        onResizeStop={(event, { width, height }) => {
          if (data.updateNode) {
            data.updateNode({
              id: data.id,
              width,
              height,
            });
          }
        }}
      />
      <div
        style={{
          width: data.width || 500,
          height: data.height || 400,
          backgroundColor: "#f3f4f6",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          border: "2px solid #d1d5db",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{
            width: "15px",
            height: "15px",
            background: "white",
            border: "2px solid #32b5e5",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "-15px",
            transform: "translateY(-50%)",
          }}
        />
        {/* Content inside the resizable body */}
        <div
          style={{
            padding: 10,
            color: "#000",
          }}
        >
          {data.content || "Resizable body content"}
        </div>
      </div>
    </div>
  );
};

export default GroupNode;
