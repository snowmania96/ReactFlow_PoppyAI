import React, { useState, useCallback, useRef, useMemo } from "react";
import { ReactFlow, Background, MiniMap, Controls, useReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import ModeButton from "../../components/ModeButton";
import WebsiteNode from "../../components/nodes/WebsiteNode";
import TextNode from "../../components/nodes/TextNode";
import ImageNode from "../../components/nodes/ImageNode";
import DocumentNode from "../../components/nodes/DocumentNode";
import VoiceRecordNode from "../../components/nodes/VoiceRecordNode";
import AIChatNode from "../../components/nodes/AIChatNode/AIChatNode";
import SideBar from "../../components/SideBar";
import TiktokNode from "../../components/nodes/TiktokNode";
import InstagramNode from "../../components/nodes/InstagramNode";
import FaceBookNode from "../../components/nodes/FacebookNode";
import YoutubeNode from "../../components/nodes/YoutubeNode";
import { useDispatch, useSelector } from "react-redux";
import CustomEdge from "../../components/edges/CustomEdges";
import {
  onConnect,
  onEdgesChange,
  onNodesChange,
  updateNode,
  updateViewport,
} from "../../utils/flowSlice";
import ContextMenu from "../../components/ContextMenu";
import GroupNode from "../../components/nodes/GroupNode";
import { useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import { MODE } from "../../constants";

const defaultViewport = { x: 0, y: 0, zoom: 0.5 };
const nodeTypes = {
  websiteNode: WebsiteNode,
  textNode: TextNode,
  imageNode: ImageNode,
  documentNode: DocumentNode,
  voiceRecordNode: VoiceRecordNode,
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
  const [menu, setMenu] = useState(null);
  const { getIntersectingNodes } = useReactFlow();
  const dispatch = useDispatch();

  const { darkMode } = useContext(DarkModeContext);

  // Memoize any changing values inside the component, like darkMode
  const memoizedNodeTypes = useMemo(() => nodeTypes, []);
  const memoizedEdgeTypes = useMemo(() => edgeTypes, []);

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

  const checkChildInsideParent = (childNode, parentNode) => {
    const childBounds = {
      x: childNode.position.x,
      y: childNode.position.y,
      width: childNode.measured.width,
      height: childNode.measured.height,
    };

    const parentBounds = {
      x: parentNode.position.x,
      y: parentNode.position.y,
      width: parentNode.measured.width,
      height: parentNode.measured.height,
    };

    // Check if the child node's bounding box is fully within the parent node's bounds
    return (
      childBounds.x >= parentBounds.x &&
      childBounds.y >= parentBounds.y &&
      childBounds.x + childBounds.width <= parentBounds.x + parentBounds.width &&
      childBounds.y + childBounds.height <= parentBounds.y + parentBounds.height
    );
  };

  const onNodeDrag = (e, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n);

    for (let i = 0; i < intersections.length; i++) {
      if (intersections[i].type === "groupNode") {
        if (checkChildInsideParent(node, intersections[i])) {
          dispatch(
            updateNode({
              id: intersections[i].id,
              data: { ...intersections[i].data, parentReady: true },
            })
          );
        } else {
          dispatch(
            updateNode({
              id: intersections[i].id,
              data: { ...intersections[i].data, parentReady: false },
            })
          );
        }
      }
    }
  };

  const onNodeDragStop = (e, node) => {
    const intersections = getIntersectingNodes(node).map((n) => n);
    for (let i = 0; i < intersections.length; i++) {
      if (
        intersections[i].type === "groupNode" &&
        node.type !== "groupNode" &&
        node.type !== "aichatNode" &&
        checkChildInsideParent(node, intersections[i])
      ) {
        dispatch(
          updateNode({
            id: intersections[i].id,
            data: { ...intersections[i].data, parentReady: false },
          })
        );
        if (!node.parentId) {
          dispatch(
            updateNode({
              id: node.id,
              data: {
                grouped: true,
                parentNodeId: intersections[i].id,
                position: {
                  x: node.position.x - intersections[i].position.x,
                  y: node.position.y - intersections[i].position.y,
                },
              },
            })
          );
        } else {
          dispatch(
            updateNode({
              id: node.id,
              data: {
                grouped: true,
                parentNodeId: intersections[i].id,
                position: {
                  x: node.position.x,
                  y: node.position.y,
                },
              },
            })
          );
        }
      }
    }
  };

  const onViewportChange = (viewport) => {
    dispatch(updateViewport({ viewport: viewport }));
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={(e) => dispatch(onNodesChange(e))}
        onEdgesChange={(e) => dispatch(onEdgesChange(e))}
        onViewportChange={onViewportChange}
        onConnect={(e) => dispatch(onConnect(e))}
        defaultViewport={defaultViewport}
        minZoom={0.1}
        style={{ background: darkMode ? "#eeeeee" : "#464646", pointerEvents: "auto" }}
        maxZoom={10}
        zoomOnScroll={false}
        zoomOnDoubleClick={false}
        attributionPosition="top-left"
        fitViewOptions={{ padding: 0.5 }}
        nodeTypes={memoizedNodeTypes}
        edgeTypes={memoizedEdgeTypes}
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
        <Background gap={15} color={darkMode ? "#adadad" : "#525252"} />
        <MiniMap
          className="z-50"
          nodeColor={darkMode ? MODE.dark.miniMapNode : MODE.light.miniMapNode}
          bgcolor={darkMode ? MODE.dark.miniMapBg : MODE.light.miniMapBg}
          maskColor={darkMode ? MODE.dark.miniMapMask : MODE.light.miniMapMask}
        />

        {menu && <ContextMenu {...menu} setMenu={setMenu} />}

        <Controls className="z-50" />
        <ModeButton />
      </ReactFlow>
    </div>
  );
};

export default Board;
