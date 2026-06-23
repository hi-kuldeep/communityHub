import AnimatedLottieView from 'lottie-react-native';
import React, { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from '@/components/CustomText';
import { lottie } from '@/assets/lottie';

type TEmpty = {
  text?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  lottieStyle?: StyleProp<ViewStyle>;
};
function Empty({ text, style, children, lottieStyle }: TEmpty) {
  const { t } = useTranslation();
  return (
    <View style={[{ alignItems: 'center', justifyContent: 'center' }, style]}>
      <AnimatedLottieView
        source={lottie.notFound}
        autoPlay
        loop
        style={[
          {
            height: 180,
            width: 180,
          },
          lottieStyle,
        ]}
      />
      <CustomText
        textAlign="center"
        color="text"
        fontFamily="semiBold"
        fontSize={18}
        style={{ marginTop: 20 }}
      >
        {text ?? t('common.noDataFound')}
      </CustomText>
      {children && children}
    </View>
  );
}

export default Empty;
