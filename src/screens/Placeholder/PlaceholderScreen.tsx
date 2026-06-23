import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { usePlaceholderScreen } from './usePlaceholderScreen';
import { styles } from './placeholderScreen.styles';
import CustomText from '@/components/CustomText';

const PlaceholderScreen: React.FC = () => {
  const { title, handlePress } = usePlaceholderScreen();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <CustomText fontFamily="bold" color="primary">
          {title}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default PlaceholderScreen;
