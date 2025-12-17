import React from 'react';
import { useNetworkStore } from '../../store/useNetworkStore';
import { LayerType, TensorShape } from '../../types';
import { LAYER_DESCRIPTIONS } from '../../constants/layerConfigs';
import { Trash2 } from 'lucide-react';

const InputField = ({ label, value, onChange, type = "number" }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-white transition-colors"
    />
  </div>
);

export const PropertyInspector = () => {
  const { nodes, selectedNodeId, updateNodeParams, deleteSelected } = useNetworkStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-72 bg-zinc-950 border-l border-zinc-800 p-6 flex flex-col justify-center items-center text-zinc-600">
        <p className="text-sm font-mono">Select a layer to edit</p>
      </div>
    );
  }

  const { type, params, outputShape, inputShape } = selectedNode.data;
  const description = LAYER_DESCRIPTIONS[type];

  const handleParamChange = (key: string, value: any) => {
    updateNodeParams(selectedNode.id, { [key]: value });
  };

  const handleInputShapeChange = (idx: number, val: number) => {
    const current = params.inputShape || [3, 224, 224];
    const next = [...current];
    next[idx] = val;
    handleParamChange('inputShape', next);
  }

  return (
    <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800">
         <h2 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-1">
          {type} Properties
        </h2>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {type === LayerType.INPUT && (
           <div className="space-y-2">
             <label className="text-[10px] uppercase font-bold text-zinc-500">Input Shape (C, H, W)</label>
             <div className="flex gap-2">
               {[0, 1, 2].map((i) => (
                 <input
                    key={i}
                    type="number"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm font-mono"
                    value={params.inputShape?.[i] || 0}
                    onChange={(e) => handleInputShapeChange(i, Number(e.target.value))}
                 />
               ))}
             </div>
           </div>
        )}

        {(type === LayerType.CONV2D || type === LayerType.MAXPOOL2D) && (
          <>
            <div className="grid grid-cols-2 gap-4">
              {type === LayerType.CONV2D && (
                 <InputField label="Out Channels" value={params.out_channels} onChange={(v:any) => handleParamChange('out_channels', v)} />
              )}
              <InputField label="Kernel Size" value={params.kernel_size} onChange={(v:any) => handleParamChange('kernel_size', v)} />
              <InputField label="Stride" value={params.stride} onChange={(v:any) => handleParamChange('stride', v)} />
              <InputField label="Padding" value={params.padding} onChange={(v:any) => handleParamChange('padding', v)} />
            </div>
          </>
        )}

        {type === LayerType.LINEAR && (
          <div className="space-y-4">
             <InputField label="Output Features" value={params.out_features} onChange={(v:any) => handleParamChange('out_features', v)} />
             <div className="text-xs text-zinc-500 italic">Input features are inferred from previous layer.</div>
          </div>
        )}
        
        {type === LayerType.DROPOUT && (
             <InputField label="Probability (p)" value={params.p} onChange={(v:any) => handleParamChange('p', v)} />
        )}

        <div className="pt-6 border-t border-zinc-800">
           <h3 className="text-xs font-bold text-white uppercase mb-3">Tensor Info</h3>
           <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Input:</span>
                <span className="text-zinc-300">{inputShape ? `[${inputShape.join(', ')}]` : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Output:</span>
                <span className="text-green-400">{outputShape ? `[${outputShape.join(', ')}]` : 'Invalid'}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
        <button
          onClick={deleteSelected}
          className="flex items-center justify-center gap-2 w-full py-2 bg-red-900/20 text-red-400 border border-red-900/50 rounded hover:bg-red-900/40 transition-colors font-mono text-xs uppercase font-bold"
        >
          <Trash2 size={14} /> Delete Layer
        </button>
      </div>
    </div>
  );
};
