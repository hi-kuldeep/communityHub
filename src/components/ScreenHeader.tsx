import React, { ReactNode } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import CustomText from '@/components/CustomText';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { IS_IOS } from '@/constants/deviceInfo';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';

interface IScreenHeader {
  title?: string;
  isGoBack?: boolean;
  onBackIconPressed?: () => void;
  rightSection?: ReactNode;
}

const ScreenHeader: React.FC<IScreenHeader> = ({
  title,
  isGoBack = true,
  onBackIconPressed,
  rightSection,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { top } = useSafeAreaInsets();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const isDarkMode = themeMode === 'dark';

  const handleBack = () => {
    if (onBackIconPressed) {
      onBackIconPressed();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDarkMode ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
          },
          IS_IOS
            ? {
                paddingBottom: top !== 0 ? top / 4 : 0,
              }
            : {
                paddingVertical: 10,
                alignItems: 'center',
              },
        ]}
      >
        {isGoBack ? (
          <TouchableOpacity
            style={[
              styles.backBtn,
              {
                backgroundColor: isDarkMode ? colors.border : '#f5f6f8',
              },
            ]}
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ChevronLeft size={22} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtnPlaceholder} />
        )}

        <CustomText
          fontFamily="semiBold"
          color="text"
          style={[styles.title, { marginStart: 10 }]}
          numberOfLines={1}
        >
          {title}
        </CustomText>

        <View style={styles.rightSection}>
          {rightSection}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
  rightSection: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
