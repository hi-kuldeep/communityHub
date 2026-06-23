import { ActivityIndicator, StyleSheet, View } from 'react-native';
import CustomText from '../CustomText';
import { getColors } from '@/theme/colors';
import { useThemeStore } from '@/store/useThemeStore';

function LoadingModal({ text = 'Loading...' }: { text?: string }) {
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.text} />
      <CustomText color="text" fontFamily="semiBold" style={styles.text}>
        {text}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  text: {
    marginStart: 10,
    fontSize: 15,
  },
});

export default LoadingModal;
