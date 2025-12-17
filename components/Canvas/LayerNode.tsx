import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { LayerNodeData, LayerType } from '../../types';
import { clsx } from 'clsx';
import { Box, Layers, ArrowRight, Grid3X3, type LucideIcon } from 'lucide-react';

const Icons: Record<LayerType, LucideIcon> = {
  [LayerType.INPUT]: ArrowRight,
  [LayerType.CONV2D]: Layers,
  [LayerType.LINEAR]: Box,
  [LayerType.MAXPOOL2D]: Grid3X3,
  [LayerType.FLATTEN]: ArrowRight,
  [LayerType.RELU]: ArrowRight,
  [LayerType.DROPOUT]: Box,
  [LayerType.BATCHNORM2D]: Box,
};

const formatShape = (shape?: number[] | null) => {
  if (!shape) return '?';
  return `[${shape.join(', ')}]`;
};

const LayerNode = ({ data, selected }: NodeProps<LayerNodeData>) => {
  const Icon = Icons[data.type] || Box;

  return (
    <div className={clsx(
      "relative min-w-[180px] rounded-lg border-2 bg-black text-white transition-all shadow-lg",
      selected ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-zinc-800 hover:border-zinc-600"
    )}>
      {data.type !== LayerType.INPUT && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-white !w-3 !h-3 !border-2 !border-black"
        />
      )}

      <div className="flex items-center gap-2 border-b border-zinc-800 p-3 bg-zinc-900/50 rounded-t-md">
        <Icon size={16} className="text-zinc-400" />
        <span className="font-mono text-sm font-bold tracking-wide uppercase">{data.label}</span>
      </div>

      <div className="p-3 space-y-2 text-xs font-mono text-zinc-400">
        <div className="flex justify-between items-center">
            <span>In:</span>
            <span className={clsx("bg-zinc-900 px-1.5 py-0.5 rounded", !data.inputShape && "text-zinc-600")}>
              {data.type === LayerType.INPUT ? 'N/A' : formatShape(data.inputShape)}
            </span>
        </div>
        <div className="flex justify-between items-center">
            <span>Out:</span>
            <span className={clsx("bg-zinc-900 px-1.5 py-0.5 rounded", !data.outputShape && "text-zinc-600")}>
               {formatShape(data.outputShape)}
            </span>
        </div>
        
        {data.type === LayerType.CONV2D && (
          <div className="pt-2 border-t border-zinc-900 text-[10px] text-zinc-500 flex gap-2">
            <span>K: {data.params.kernel_size}</span>
            <span>S: {data.params.stride}</span>
            <span>C: {data.params.out_channels}</span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-white !w-3 !h-3 !border-2 !border-black"
      />
    </div>
  );
};

export default memo(LayerNode);
