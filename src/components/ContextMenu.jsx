import React, { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { deleteNode } from "../utils/flowSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
export default function ContextMenu({ id, top, left, right, bottom, ...props }) {
  const dispatch = useDispatch();
  const deleteSelectedNode = () => {
    dispatch(deleteNode({ id: id }));
  };

  return (
    <div
      style={{ top, left, right, bottom }}
      className="bg-slate-200  border-gray-200 absolute z-10 rounded-[4px] p-2 w-[150px] hover:bg-neutral-400"
      {...props}
    >
      <button className="text-lg flex flex-row items-center" onClick={deleteSelectedNode}>
        <RiDeleteBin6Line />
        <p className="ml-2">Delete</p>
      </button>
    </div>
  );
}
