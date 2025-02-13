import { createSlice } from "@reduxjs/toolkit";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

export const flow = createSlice({
  name: "flow",
  initialState: {
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  },

  reducers: {
    updateViewport: (state, action) => {
      state.viewport = action.payload.viewport;
    },
    addNode: (state, action) => {
      // To generate a unique id for the new node, we will use the following logic:
      let id;
      const existingIds = state.nodes.map((node) => node.id);
      for (let i = 1; ; i++) {
        id = `Node ${i}`;
        if (!existingIds.includes(id)) {
          break;
        }
      }
      let newNode;
      if (action.payload.type === "imageNode") {
        newNode = {
          id: id,
          type: action.payload.type,
          data: {
            id: id,
            imageUrl: action.payload.imageUrl || null,
            script: action.payload.script || null,
          },
          position: {
            x: -state.viewport.x + 350 + (Math.random() - 0.5) * 50,
            y: -state.viewport.y + 250 + (Math.random() - 0.5) * 50,
          },
        };
      } else if (
        action.payload.type === "instagramNode" ||
        action.payload.type === "youtubeNode" ||
        action.payload.type === "tiktokNode" ||
        action.payload.type === "facebookNode"
      ) {
        newNode = {
          id: id,
          type: action.payload.type,
          data: {
            id: id,
            imageUrl: action.payload.imageUrl || null,
            sourceUrl: action.payload.sourceUrl || null,
            script: action.payload.script || null,
            title: action.payload.title || null,
          },
          position: {
            x: -state.viewport.x + 350 + (Math.random() - 0.5) * 50,
            y: -state.viewport.y + 250 + (Math.random() - 0.5) * 50,
          },
        };
      } else if (action.payload.type === "documentNode") {
        newNode = {
          id: id,
          type: action.payload.type,
          data: {
            id: id,
            file: action.payload.file || null,
            script: action.payload.script || null,
          },
          position: {
            x: -state.viewport.x + 350 + (Math.random() - 0.5) * 50,
            y: -state.viewport.y + 250 + (Math.random() - 0.5) * 50,
          },
        };
      } else if (action.payload.type === "voiceRecordNode") {
        newNode = {
          id: id,
          type: action.payload.type,
          data: {
            id: id,
            audioUrl: action.payload.audioUrl || null,
            script: action.payload.script || null,
            title: action.payload.title || null,
          },
          position: {
            x: -state.viewport.x + 350 + (Math.random() - 0.5) * 50,
            y: -state.viewport.y + 250 + (Math.random() - 0.5) * 50,
          },
        };
      } else if (action.payload.type === "aichatNode") {
        newNode = {
          id: id,
          type: action.payload.type,
          data: {
            id: id,
            AIModel: null,
          },
          position: {
            x: -state.viewport.x + 350 + (Math.random() - 0.5) * 50,
            y: -state.viewport.y + 250 + (Math.random() - 0.5) * 50,
          },
        };
      } else {
        newNode = {
          id: id,
          type: action.payload.type,
          data: {
            id: id,
            script: action.payload.script || null,
          },
          position: {
            x: -state.viewport.x + 350 + (Math.random() - 0.5) * 50,
            y: -state.viewport.y + 250 + (Math.random() - 0.5) * 50,
          },
        };
      }

      state.nodes.push(newNode);
    },

    updateNode: (state, action) => {
      const { id, data } = action.payload;
      if (data.grouped) {
        const updatingNode = state.nodes.find((node) => node.id === id);
        const parentNode = state.nodes.find((node) => node.id === data.parentNodeId);
        const updatingNodeIdx = state.nodes.indexOf(updatingNode);
        const parentNodeIdx = state.nodes.indexOf(parentNode);
        if (updatingNodeIdx > parentNodeIdx) {
          state.nodes[updatingNodeIdx] = {
            ...updatingNode,
            parentId: data.parentNodeId,
            position: data.position,
            extent: "parent",
          };
        } else {
          state.nodes[parentNodeIdx] = {
            ...updatingNode,
            parentId: data.parentNodeId,
            position: data.position,
            extent: "parent",
          };
          state.nodes[updatingNodeIdx] = parentNode;
        }
      } else {
        state.nodes = state.nodes.map((node) => {
          if (node.id === id) {
            node.data = data;
          }
          return node;
        });
      }
    },

    ungroupNode: (state, action) => {
      state.nodes = state.nodes.map((node) => {
        if (node.id === action.payload.id) {
          return {
            id: node.id,
            type: node.type,
            data: node.data,
            position: {
              x: -state.viewport.x + 350 + (Math.random() - 0.5) * 50,
              y: -state.viewport.y + 250 + (Math.random() - 0.5) * 50,
            },
          };
        }
        return node;
      });
    },

    deleteNode: (state, action) => {
      const { id } = action.payload;
      state.nodes = state.nodes.filter((node) => node.id !== id);
    },

    onNodesChange: (state, action) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes).map((node) => {
        const change = action.payload.find((c) => c.id === node.id);
        if (change?.resized) {
          // Update size for resized nodes
          return {
            ...node,
            width: change.width || node.width,
            height: change.height || node.height,
          };
        }
        return node;
      });
    },
    onEdgesChange: (state, action) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    onConnect: (state, action) => {
      state.edges = addEdge(
        { ...action.payload, type: "customEdge", animated: true, zIndex: 2000 },
        state.edges
      );
    },
  },
});

export const {
  addNode,
  updateNode,
  ungroupNode,
  deleteNode,
  onNodesChange,
  onEdgesChange,
  onConnect,
  updateViewport,
} = flow.actions;

export default flow.reducer;
