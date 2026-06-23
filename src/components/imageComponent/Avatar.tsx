import React from 'react';
import FastImage from 'react-native-fast-image';
import { TAvatar } from './ImageComponent';

const default_avatar = require('./avatarPlaceHolder.png');

const Avatar = ({
  source,
  style,
  resizeMode = 'cover',
  size = 55,
  isLoading = false,
  ...props
}: TAvatar) => {
  const [isLoadingImage, setLoadingImageState] = React.useState(isLoading);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setIsError(false);
  }, [source]);

  const onLoadStart = () => {
    setLoadingImageState(true);
    setIsError(false);
  };
  const onLoadEnd = () => setLoadingImageState(false);
  const onError = () => setIsError(true);

  let finalSource = source;
  if (isError || !source) {
    finalSource = default_avatar;
  } else if (typeof source === 'object' && !Array.isArray(source)) {
    const uri = (source as any).uri;
    if (
      !uri ||
      (typeof uri === 'string' &&
        !uri.startsWith('http') &&
        !uri.startsWith('/') &&
        !uri.startsWith('file://') &&
        !uri.startsWith('data:'))
    ) {
      finalSource = default_avatar;
    } else if (Object.keys(source).length === 0) {
      finalSource = default_avatar;
    }
  }

  return (
    <FastImage
      {...props}
      source={finalSource}
      defaultSource={default_avatar}
      style={[
        {
          height: size,
          width: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          //
        },
        style,
      ]}
      resizeMode={resizeMode}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
      onError={onError}
    />
  );
};

export default Avatar;
