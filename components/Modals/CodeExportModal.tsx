import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { useNetworkStore } from '../../store/useNetworkStore';
import { generatePyTorchCode } from '../../utils/codeGenerator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal = ({ isOpen, onClose }: Props) => {
  const { nodes, edges } = useNetworkStore();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode(generatePyTorchCode(nodes, edges));
    }
  }, [isOpen, nodes, edges]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[800px] bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl flex flex-col max-h-[80vh]">
        
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="font-mono text-white font-bold uppercase tracking-wider">Export PyTorch Code</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-0 bg-[#0d0d0d] relative group">
          <pre className="p-6 text-sm font-mono text-zinc-300 leading-relaxed">
            <code>{code}</code>
          </pre>
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-zinc-800 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all opacity-0 group-hover:opacity-100"
          >
             {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
        </div>

        <div className="p-4 border-t border-zinc-800 flex justify-end">
           <button onClick={onClose} className="px-4 py-2 text-sm font-mono text-zinc-400 hover:text-white transition-colors">
             Close
           </button>
           <button onClick={handleCopy} className="ml-2 px-6 py-2 bg-white text-black font-mono font-bold text-sm rounded hover:bg-zinc-200 transition-colors">
             {copied ? "Copied!" : "Copy Code"}
           </button>
        </div>

      </div>
    </div>
  );
};
