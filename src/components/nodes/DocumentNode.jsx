import { Handle, Position } from "@xyflow/react";

const DocuemntNode = ({ data, isConnectable }) => {
  console.log(data);

  // const fileContent
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
        className="w-48 mx-auto bg-gray-300 rounded-[15px] shadow-md border-[4px] border-transparent transition-colors duration-300 focus-within:border-[#e9ad91]"
        tabIndex="0"
      >
        <div className="flex justify-between items-center text-white px-4 py-2 rounded-t-[12px] bg-[#F5A397]">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📝</span>
            <span className="font-semibold text-sm">{data.file}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-b-[12px] shadow-inner">
          <span className="text-lg">📄 </span>
          <span className="text-gray-700 font-medium text-[14px]">
            {data.file || "dejanpetrovic2.pdf"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocuemntNode;
