import { useCallback } from "react";
import { Handle, Position } from "@xyflow/react";

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
          // top: "50%", // Align vertically
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

      <div
        className="w-[1000px] h-[800px] mx-auto bg-blue-700 rounded-[15px] shadow-md border-[4px] border-gray-300 focus-within:border-[#259ec4] transition-colors duration-300 flex flex-col"
        tabIndex="0"
      >
        {/* <!-- Header --> */}
        <div className="flex justify-between items-center text-white px-4 py-2 rounded-[9px]">
          <div className="flex items-center space-x-2">
            <span className="text-lg">💬</span>
            <span className="font-semibold">AI Assistant</span>
          </div>
        </div>

        {/* <!-- Main Content --> */}
        <div className="flex-1 bg-white rounded-[10px] shadow-inner flex flex-col">
          <div className="grid grid-cols-12 divide-x divide-gray-300 h-full">
            {/* <!-- Sidebar --> */}
            <div className="col-span-3 p-4 flex flex-col h-full">
              <button className="w-full mb-4 flex items-center justify-center rounded-[8px] bg-blue-700 text-white text-[16px] shadow-lg hover:bg-blue-500 transition-all focus:outline-none py-2">
                New Chat
              </button>
              <div className="text-gray-700 text-left">
                <p className="font-semibold mb-2">Previous Chats</p>
                <ul className="space-y-1">
                  <li className="p-2 bg-gray-200 rounded-[10px] hover:bg-gray-300 cursor-pointer">
                    hi
                  </li>
                </ul>
              </div>
            </div>

            {/* <!-- Chat Section --> */}
            <div className="col-span-9 p-4 flex flex-col h-full">
              {/* <!-- Chat Header --> */}
              <div className="text-lg font-medium border-b pb-2 mb-4">hi</div>
              {/* <!-- Chat History --> */}
              <div className="flex-1 space-y-4 overflow-y-auto ">
                {/* <!-- Incoming Message --> */}
                <div className="flex items-start space-x-2">
                  <span className="bg-blue-100 text-blue-700 p-2 rounded-full font-semibold">
                    C
                  </span>
                  <div className="bg-gray-200 p-3 rounded-[8px] shadow">
                    <p className="text-gray-800">hi</p>
                  </div>
                </div>
                {/* <!-- Outgoing Message --> */}
                <div className="flex justify-end items-start space-x-2">
                  <div className="bg-blue-500 text-white p-3 rounded-[8px] shadow">
                    <p>Hello! 👋</p>
                    <p className="text-sm mt-1">I'm here to help you today!</p>
                  </div>
                  <span className="bg-blue-700 text-white p-2 rounded-full font-semibold">
                    P
                  </span>
                </div>
              </div>
              {/* <!-- Input Section --> */}
              <div className="bg-gray-100 px-4 py-3 border-t border-gray-300 flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-[8px] focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatNode;
