import { LayerType, LayerParams, TensorShape } from '../types';

export const calculateOutputShape = (
  type: LayerType,
  params: LayerParams,
  inputShape: TensorShape | null | undefined
): TensorShape | null => {
  if (!inputShape) {
    if (type === LayerType.INPUT && params.inputShape) {
      return [...params.inputShape];
    }
    return null;
  }

  const val = (v: number | [number, number] | undefined, def = 1): number => 
    typeof v === 'number' ? v : (Array.isArray(v) ? v[0] : def);

  try {
    switch (type) {
      case LayerType.CONV2D:
      case LayerType.MAXPOOL2D: {
        if (inputShape.length !== 3) return null;
        
        const [c_in, h_in, w_in] = inputShape;
        const kernel = val(params.kernel_size, 1);
        const stride = val(params.stride, 1);
        const padding = val(params.padding, 0);
        const out_channels = type === LayerType.CONV2D ? (params.out_channels || 1) : c_in;

        const h_out = Math.floor((h_in + 2 * padding - kernel) / stride + 1);
        const w_out = Math.floor((w_in + 2 * padding - kernel) / stride + 1);

        if (h_out <= 0 || w_out <= 0) return null; 
        return [out_channels, h_out, w_out];
      }

      case LayerType.FLATTEN: {
        const totalFeatures = inputShape.reduce((a, b) => a * b, 1);
        return [totalFeatures];
      }

      case LayerType.LINEAR: {
        if (inputShape.length !== 1) {
           return null;
        }
        return [params.out_features || 1];
      }

      case LayerType.RELU:
      case LayerType.DROPOUT:
      case LayerType.BATCHNORM2D:
        return [...inputShape];

      default:
        return [...inputShape];
    }
  } catch (e) {
    console.error("Shape calculation error", e);
    return null;
  }
};
