import { create } from 'zustand';
import { 
  Connection, 
  EdgeChange, 
  NodeChange, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import { AppNode, AppEdge, LayerType, LayerParams, TensorShape } from '../types';
import { calculateOutputShape } from '../utils/shapeCalculator';
import { produce } from 'immer';

interface NetworkState {
  nodes: AppNode[];
  edges: AppEdge[];
  selectedNodeId: string | null;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: AppNode) => void;
  selectNode: (id: string | null) => void;
  updateNodeParams: (id: string, params: Partial<LayerParams>) => void;
  recalculateShapes: () => void;
  deleteSelected: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
    get().recalculateShapes();
  },

  onConnect: (connection) => {
    set({
      edges: addEdge({ 
        ...connection, 
        markerEnd: { type: MarkerType.ArrowClosed, color: '#fff' },
        style: { stroke: '#fff', strokeWidth: 2 },
        animated: true,
      }, get().edges),
    });
    get().recalculateShapes();
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
    get().recalculateShapes();
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
    set(produce((state: NetworkState) => {
       state.nodes.forEach((n) => {
         n.selected = n.id === id;
       });
    }));
  },

  updateNodeParams: (id, newParams) => {
    set(produce((state: NetworkState) => {
      const node = state.nodes.find((n) => n.id === id);
      if (node) {
        node.data.params = { ...node.data.params, ...newParams };
      }
    }));
    get().recalculateShapes();
  },

  deleteSelected: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;

    const newNodes = nodes.filter(n => n.id !== selectedNodeId);
    const newEdges = edges.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId);
    
    set({ nodes: newNodes, edges: newEdges, selectedNodeId: null });
    get().recalculateShapes();
  },

  recalculateShapes: () => {
    const { nodes, edges } = get();
    
    const nodeMap = new Map<string, AppNode>();
    nodes.forEach(n => {
        nodeMap.set(n.id, { ...n, data: { ...n.data } });
    });
    
    nodeMap.forEach((node) => {
       if (node.data.type !== LayerType.INPUT) {
         node.data.inputShape = null;
         node.data.outputShape = null;
       }
    });

    const inputNode = nodes.find(n => n.data.type === LayerType.INPUT);
    if (!inputNode) {
      set({ nodes: Array.from(nodeMap.values()) });
      return;
    }

    const queue = [inputNode.id];
    const inputNodeData = nodeMap.get(inputNode.id)!;
    inputNodeData.data.outputShape = calculateOutputShape(LayerType.INPUT, inputNodeData.data.params, null);
    
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currId = queue.shift()!;
      if (visited.has(currId)) continue;
      visited.add(currId);

      const currNode = nodeMap.get(currId)!;
      const outShape = currNode.data.outputShape;

      const childEdges = edges.filter(e => e.source === currId);
      
      childEdges.forEach(edge => {
        const childNode = nodeMap.get(edge.target);
        if (childNode && outShape) {
          childNode.data.inputShape = outShape;
          
          childNode.data.outputShape = calculateOutputShape(childNode.data.type, childNode.data.params, childNode.data.inputShape);
          
          queue.push(childNode.id);
        }
      });
    }

    set({ nodes: Array.from(nodeMap.values()) });
  }
}));