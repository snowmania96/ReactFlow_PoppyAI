import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Handle, Position } from "@xyflow/react";
import { FaFacebook } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import axios from "axios";
import { ungroupNode, updateNode } from "../../utils/flowSlice";
import { BiLoaderCircle } from "react-icons/bi";
import { LucideUngroup } from "lucide-react";

const FacebookNode = ({ data, isConnectable }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Fetching the title");
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

  const fetchTitle = async (script) => {
    setLoading(true);
    const response = await axios.post(`${process.env.REACT_APP_BASED_URL}/board/title`, {
      script,
    });
    const temptitle = response.data;

    setLoading(false);
    setTitle(temptitle);
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
    fetchTitle(data.script);
  }, [data.script]);

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
        className="max-w-sm mx-auto bg-[#18725e] rounded-[15px] shadow-md border-[4px] transition-colors duration-300 focus-within:border-[#ee9bee]"
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
            {loading ? (
              <div className="flex items-center justify-start">
                <BiLoaderCircle size={"18"} className="loading-icon" color="white" />
                <span className="ml-2 flex justify-start font-semibold text-[16px]">
                  Fetching the title
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-start">
                <FaFacebook size={"18"} />
                <span className="ml-2 w-56 font-semibold text-[16px] overflow-hidden overflow-ellipsis text-nowrap">
                  {title}
                </span>
              </div>
            )}
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
