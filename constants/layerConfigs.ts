import { LayerType, LayerParams } from '../types';

export const DEFAULT_LAYER_PARAMS: Record<LayerType, LayerParams> = {
  [LayerType.INPUT]: {
    inputShape: [3, 224, 224], 
  },
  [LayerType.CONV2D]: {
    in_channels: 3,
    out_channels: 16,
    kernel_size: 3,
    stride: 1,
    padding: 1,
    bias: true,
  },
  [LayerType.LINEAR]: {
    in_features: 0, 
    out_features: 10,
    bias: true,
  },
  [LayerType.MAXPOOL2D]: {
    kernel_size: 2,
    stride: 2,
    padding: 0,
  },
  [LayerType.FLATTEN]: {},
  [LayerType.RELU]: {},
  [LayerType.DROPOUT]: {
    p: 0.5,
  },
  [LayerType.BATCHNORM2D]: {
    in_channels: 0, 
  },
};

export const LAYER_DESCRIPTIONS: Record<LayerType, string> = {
  [LayerType.INPUT]: "Starting tensor shape (C, H, W)",
  [LayerType.CONV2D]: "2D Convolutional Layer",
  [LayerType.LINEAR]: "Fully Connected (Dense) Layer",
  [LayerType.MAXPOOL2D]: "2D Max Pooling",
  [LayerType.FLATTEN]: "Flattens input to 1D",
  [LayerType.RELU]: "Rectified Linear Unit Activation",
  [LayerType.DROPOUT]: "Randomly zeroes elements",
  [LayerType.BATCHNORM2D]: "Batch Normalization over 4D input",
};
