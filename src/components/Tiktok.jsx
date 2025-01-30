import { useDispatch } from "react-redux";
import { addNode } from "../utils/flowSlice";
import { useState } from "react";
import { createPortal } from "react-dom";
import { LiaTimesSolid } from "react-icons/lia";
import axios from "axios";
import { SiTiktok } from "react-icons/si";
import { BiLoaderCircle } from "react-icons/bi";

const Tiktok = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [url, setUrl] = useState(null);
  const handleInstagramButtonClick = async () => {
    setModal(true);

    // dispatch(addNode({ type: "instagramNode" }));
  };

  const handleAddButton = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASED_URL}/board/tiktok`,
        { url }
      );
      dispatch(
        addNode({
          type: "tiktokNode",
          imageUrl: response.data,
          sourceUrl: url,
        })
      );
      setLoading(false);
      setModal(false);
      setUrl(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseModal = () => {
    setModal(false); // Hide the modal
  };

  return (
    <div>
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full transition duration-300 bg-[#38cadd] hover:bg-[#2a97a5] text-white mb-5`}
        onClick={handleInstagramButtonClick}
      >
        <SiTiktok />
      </button>
      {modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={handleCloseModal} // Close the modal when clicking the background
        >
          <div
            className="w-[500px] h-auto relative bg-white rounded-[8px] shadow-lg p-6 "
            onClick={(e) => e.stopPropagation()} // Prevent background click from closing the modal
          >
            <div className="flex justify-between">
              <p className="font-semibold text-lg">Enter Tiktok URL</p>
              <span
                className="mt-[-5px] mr-[-10px] hover:cursor-pointer"
                onClick={handleCloseModal}
              >
                <LiaTimesSolid />
              </span>
            </div>

            <input
              type="text"
              className="w-[100%] bg-slate-800 rounded-[8px] shadow-lg text-lg p-2 mt-2 text-white font-semibold"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
            ></input>
            <button
              className="w-[100%] bg-purple-700 mt-3 text-white font-semibold p-2 rounded-[8px] hover:bg-purple-800 flex justify-center"
              onClick={handleAddButton}
              disabled={loading}
            >
              {loading ? (
                <BiLoaderCircle className="loading-icon" color="white" />
              ) : (
                "Add Video"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tiktok;
