import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  MiniMap,
  Controls,
  useReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import WebsiteNode from "../../components/nodes/WebsiteNode";
import TextNode from "../../components/nodes/TextNode";
import ImageNode from "../../components/nodes/ImageNode";
import DocumentNode from "../../components/nodes/DocumentNode";
import RecordNode from "../../components/nodes/RecordNode";
import AIChatNode from "../../components/nodes/AIChatNode";
import SideBar from "../../components/SideBar";
import TiktokNode from "../../components/nodes/TiktokNode";
import InstagramNode from "../../components/nodes/InstagramNode";
import FaceBookNode from "../../components/nodes/FaceBookNode";
import YoutubeNode from "../../components/nodes/YoutubeNode";
import { useDispatch, useSelector } from "react-redux";
import CustomEdge from "../../components/edges/CustomEdges";
import {
  onConnect,
  onEdgesChange,
  onNodesChange,
  updateNode,
} from "../../utils/flowSlice";
import ContextMenu from "../../components/ContextMenu";
import GroupNode from "../../components/nodes/GroupNode";

const defaultViewport = { x: 0, y: 0, zoom: 1 };
const nodeTypes = {
  websiteNode: WebsiteNode,
  textNode: TextNode,
  imageNode: ImageNode,
  documentNode: DocumentNode,
  recordNode: RecordNode,
  aichatNode: AIChatNode,
  tiktokNode: TiktokNode,
  instagramNode: InstagramNode,
  youtubeNode: YoutubeNode,
  facebookNode: FaceBookNode,
  groupNode: GroupNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

const Board = () => {
  const nodes = useSelector((store) => store.flow.nodes);
  const edges = useSelector((store) => store.flow.edges);
  const ref = useRef(null);
  const nodeRef = useRef(nodes);
  const [menu, setMenu] = useState(null);
  const { getIntersectingNodes } = useReactFlow();

  const dispatch = useDispatch();

  const onNodeContextMenu = useCallback(
    (event, node) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom: event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const onNodeClick = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  const onNodeDrag = (e, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n);
    let intersected = false;
    for (let i = 0; i < intersections.length; i++) {
      if (intersections[i].type === "groupNode") {
        intersected = true;
        dispatch(
          updateNode({ id: intersections[i].id, data: { intersected: true } })
        );
      }
    }
    if (!intersected) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === "groupNode") {
          dispatch(
            updateNode({
              id: nodes[i].id,
              data: { intersected: false },
            })
          );
        }
      }
    }
  };

  const onNodeDragStop = (e, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n);
    for (let i = 0; i < intersections.length; i++) {
      if (intersections[i].type === "groupNode" && node.type !== "groupNode") {
        dispatch(
          updateNode({
            id: node.id,
            data: {
              grouped: true,
              parentNodeId: intersections[i].id,
            },
          })
        );
      }
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={(e) => dispatch(onNodesChange(e))}
        onEdgesChange={(e) => dispatch(onEdgesChange(e))}
        onConnect={(e) => dispatch(onConnect(e))}
        defaultViewport={defaultViewport}
        minZoom={0.1}
        style={{ background: "#F7F9FB", pointerEvents: "auto" }}
        maxZoom={15}
        attributionPosition="bottom-left"
        fitView
        fitViewOptions={{ padding: 0.5 }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClick}
        onMoveStart={(e) => setMenu(null)}
        onNodeDrag={onNodeDrag}
        onNodeDragStart={(e) => setMenu(null)}
        onNodeDragStop={onNodeDragStop}
        onContextMenu={(e) => e.preventDefault()}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        <SideBar />
        <Background />
        <MiniMap />
        <Controls />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </div>
  );
};

export default Board;
