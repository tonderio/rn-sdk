import type { StylesBaseVariant } from '../../types';

const buildBaseStyleText = (style?: StylesBaseVariant) => {
  return {
    ...(style?.base?.fontSize ? { fontSize: style?.base?.fontSize } : {}),
    ...(style?.base?.color ? { color: style?.base?.color } : {}),
    ...(style?.base?.fontWeight ? { fontWeight: style?.base?.fontWeight } : {}),
  };
};

export { buildBaseStyleText };
