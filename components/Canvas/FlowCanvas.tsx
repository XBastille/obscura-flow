import React, { useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, NodeTypes } from 'reactflow';
import { useNetworkStore } from '../../store/useNetworkStore';
import LayerNode from './LayerNode';
import { createNode } from '../../utils/nodeFactory';
import { LayerType } from '../../types';

const nodeTypes: NodeTypes = {
  layerNode: LayerNode,
};

const FlowCanvasInner = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode
  } = useNetworkStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as LayerType;
      if (!type) return;

      const reactFlowBounds = wrapperRef.current?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 100, 
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode = createNode(type, position);
      addNode(newNode);
    },
    [addNode]
  );

  const onNodeClick = (_: React.MouseEvent, node: any) => {
    selectNode(node.id);
  };

  const onPaneClick = () => {
    selectNode(null);
  };

  return (
    <div className="w-full h-full bg-black relative" ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={20} size={1} />
        <Controls className="!bg-zinc-900 !border-zinc-800 [&>button]:!fill-black [&>button]:!border-zinc-800 hover:[&>button]:!bg-zinc-800" />
      </ReactFlow>
    </div>
  );
};

export const FlowCanvas = () => (
  <ReactFlowProvider>
    <FlowCanvasInner />
  </ReactFlowProvider>
);