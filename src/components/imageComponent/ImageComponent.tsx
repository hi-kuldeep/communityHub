import React, { memo, use, useMemo } from 'react';
import { StyleProp, View, ActivityIndicator } from 'react-native';
import FastImage, {
  FastImageProps,
  ImageStyle,
  ResizeMode,
} from 'react-native-fast-image';
import { COLORS } from 'theme/colors';

export interface TAvatar extends FastImageProps {
  style?: StyleProp<ImageStyle>;
  resizeMode?: ResizeMode;
  size?: number;
  isLoading?: boolean;
  thumbnail?: string;
}

const ImageComponent = ({
  source,
  style,
  resizeMode = 'cover',
  thumbnail,
  ...props
}: TAvatar) => {
  const [isLoadingImage, setLoadingImageState] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const onLoadStart = () => {
    setLoadingImageState(true);
    setIsError(false); // reset error state on new load start
  };

  const onLoadEnd = () => setLoadingImageState(false);

  const onError = () => {
    setIsError(true);
    setLoadingImageState(false);
  };

  // Show placeholder if error or source is falsy
  const imageSource = useMemo(() => {
    // local image (require)
    if (typeof source === 'number') {
      return source;
    }
    // remote image with valid uri
    if (
      source &&
      typeof source === 'object' &&
      'uri' in source &&
      source.uri
    ) {
      return source;
    }

    // fallback
    return require('./placeholder.png');
  }, [source]);

  return (
    <View style={[{ position: 'relative', overflow: 'hidden' }, style]}>
      {/* Thumbnail as background during load */}
      {thumbnail && (isLoadingImage || isError) && (
        <FastImage
          source={{ uri: thumbnail }}
          style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, style]}
          resizeMode={resizeMode}
        />
      )}
      
      <FastImage
        {...props}
        source={isError ? require('./placeholder.png') : imageSource}
        style={[
          {
            backgroundColor: (isLoadingImage && !thumbnail)
              ? COLORS.backGroundGrey
              : COLORS.background,
          },
          style,
        ]}
        resizeMode={resizeMode}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        onError={onError}
      />
      {isLoadingImage && !thumbnail && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -10,
            marginTop: -10,
          }}
          size="small"
          color={COLORS.primary}
        />
      )}
    </View>
  );
};

export default memo(ImageComponent);
