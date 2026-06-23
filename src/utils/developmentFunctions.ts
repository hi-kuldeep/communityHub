import { PixelRatio } from 'react-native';

function capitalizeString(str: string | undefined) {
  if (str && str !== undefined)
    return String(str)?.charAt(0)?.toUpperCase() + String(str)?.slice(1);
  else 'N/A';
}

const fontSizePixelRatio = (px: number) => {
  return (
    (PixelRatio.getPixelSizeForLayoutSize(px) ?? 14) /
    (PixelRatio.getFontScale() * PixelRatio.get())
  );
};

export { capitalizeString, fontSizePixelRatio };
