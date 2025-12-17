import { AppNode, AppEdge, LayerType } from '../types';


export const generatePyTorchCode = (nodes: AppNode[], edges: AppEdge[]): string => {
  if (nodes.length === 0) return "# No layers defined.";

  const sortedNodes: AppNode[] = [];
  const inputNode = nodes.find(n => n.data.type === LayerType.INPUT);

  if (!inputNode) return "# Error: No Input Node found. Please add an Input layer.";

  const queue = [inputNode];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    sortedNodes.push(current);

    const outgoing = edges
      .filter(e => e.source === current.id)
      .map(e => nodes.find(n => n.id === e.target))
      .filter((n): n is AppNode => !!n);

    queue.push(...outgoing);
  }

  const initLines: string[] = [];
  const forwardLines: string[] = [];

  const getName = (node: AppNode, index: number) => {
    return `${node.data.type.toLowerCase().replace('2d', '')}_${index}`;
  };

  sortedNodes.forEach((node, index) => {
    const type = node.data.type;
    const p = node.data.params;
    const name = getName(node, index);

    if (type === LayerType.INPUT) return;

    let layerCode = "";

    switch (type) {
      case LayerType.CONV2D:
        layerCode = `nn.Conv2d(in_channels=${p.in_channels}, out_channels=${p.out_channels}, kernel_size=${p.kernel_size}, stride=${p.stride}, padding=${p.padding})`;
        break;
      case LayerType.LINEAR:
        layerCode = `nn.Linear(in_features=${p.in_features}, out_features=${p.out_features})`;
        break;
      case LayerType.MAXPOOL2D:
        layerCode = `nn.MaxPool2d(kernel_size=${p.kernel_size}, stride=${p.stride})`;
        break;
      case LayerType.FLATTEN:
        layerCode = `nn.Flatten()`;
        break;
      case LayerType.RELU:
        layerCode = `nn.ReLU()`;
        break;
      case LayerType.DROPOUT:
        layerCode = `nn.Dropout(p=${p.p})`;
        break;
      case LayerType.BATCHNORM2D:
        layerCode = `nn.BatchNorm2d(num_features=${p.in_channels})`;
        break;
    }

    if (layerCode) {
      initLines.push(`        self.layer${index} = ${layerCode}`);
      forwardLines.push(`        x = self.layer${index}(x)`);
    }
  });

  return `import torch
import torch.nn as nn

class GeneratedNetwork(nn.Module):
    def __init__(self):
        super(GeneratedNetwork, self).__init__()
${initLines.length > 0 ? initLines.join('\n') : '        pass'}

    def forward(self, x):
${forwardLines.length > 0 ? forwardLines.join('\n') : '        return x'}
        return x
`;
};
