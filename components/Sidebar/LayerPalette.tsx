import React from 'react';
import { LayerType } from '../../types';
import { Box, Layers, Grid3X3, ArrowRight, Type, Activity } from 'lucide-react';

const LAYER_ITEMS = [
  { type: LayerType.INPUT, icon: ArrowRight, label: 'Input' },
  { type: LayerType.CONV2D, icon: Layers, label: 'Conv2D' },
  { type: LayerType.LINEAR, icon: Box, label: 'Linear' },
  { type: LayerType.MAXPOOL2D, icon: Grid3X3, label: 'MaxPool' },
  { type: LayerType.FLATTEN, icon: ArrowRight, label: 'Flatten' },
  { type: LayerType.RELU, icon: Activity, label: 'ReLU' },
  { type: LayerType.DROPOUT, icon: Box, label: 'Dropout' },
  { type: LayerType.BATCHNORM2D, icon: Box, label: 'Batch Norm' },
];

export const LayerPalette = () => {
  const onDragStart = (event: React.DragEvent, nodeType: LayerType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
          <span className="text-zinc-500 mr-2">///</span>Components
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {LAYER_ITEMS.map((item) => (
          <div
            key={item.type}
            className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded cursor-grab hover:border-white hover:bg-zinc-800 transition-all group"
            draggable
            onDragStart={(e) => onDragStart(e, item.type)}
          >
            <item.icon size={18} className="text-zinc-400 group-hover:text-white" />
            <span className="text-sm font-mono text-zinc-300 group-hover:text-white">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-600 font-mono">
        Drag items onto the canvas
      </div>
    </div>
  );
};
