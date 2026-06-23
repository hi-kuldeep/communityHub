import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { usePlaceholderScreen } from './usePlaceholderScreen';
import { styles } from './placeholderScreen.styles';

const PlaceholderScreen: React.FC = () => {
  const { title, description, handlePress } = usePlaceholderScreen();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{description}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PlaceholderScreen;
