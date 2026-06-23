import { View, ViewStyle, StyleProp } from 'react-native';
import React, { ReactNode } from 'react';
import AnimatedLottieView from 'lottie-react-native';
import CustomText from '@/components/CustomText';
import { lottie } from '@/assets/lottie';

type TEmpty = {
  text?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};
function Error({ text, style, children }: TEmpty) {
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <AnimatedLottieView
        source={lottie.error}
        autoPlay
        loop
        style={{
          height: 150,
          width: 150,
        }}
      />
      <CustomText
        textAlign="center"
        color="text"
        fontFamily="semiBold"
        fontSize={16}
        style={{ marginTop: 20, paddingHorizontal: 20 }}
      >
        {text ?? 'Something went wrong! Please try again later'}
      </CustomText>
      {children && children}
    </View>
  );
}

export default Error;
