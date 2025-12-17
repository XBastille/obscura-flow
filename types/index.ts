import { Node, Edge } from 'reactflow';

export type TensorShape = number[]; 

// --- Layer Types ---
export enum LayerType {
  INPUT = 'Input',
  CONV2D = 'Conv2D',
  LINEAR = 'Linear',
  MAXPOOL2D = 'MaxPool2D',
  FLATTEN = 'Flatten',
  RELU = 'ReLU',
  DROPOUT = 'Dropout',
  BATCHNORM2D = 'BatchNorm2D'
}

export interface LayerParams {
  inputShape?: TensorShape;
  
  in_channels?: number;
  out_channels?: number;
  kernel_size?: number | [number, number];
  stride?: number | [number, number];
  padding?: number | [number, number];
  
  in_features?: number;
  out_features?: number;
  
  p?: number;
  
  bias?: boolean;
}

export interface LayerNodeData {
  label: string;
  type: LayerType;
  params: LayerParams;
  inputShape?: TensorShape | null;
  outputShape?: TensorShape | null;
  isValid?: boolean;
  error?: string;
}

export type AppNode = Node<LayerNodeData>;
export type AppEdge = Edge;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
