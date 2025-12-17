import { LayerType, AppNode } from '../types';
import { DEFAULT_LAYER_PARAMS } from '../constants/layerConfigs';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const createNode = (type: LayerType, position: { x: number, y: number }): AppNode => {
  return {
    id: generateId(),
    type: 'layerNode',
    position,
    data: {
      label: type,
      type: type,
      params: { ...DEFAULT_LAYER_PARAMS[type] },
      inputShape: null,
      outputShape: null,
    },
  };
};