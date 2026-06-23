import React, { useEffect, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { usePlaceholderScreen } from './usePlaceholderScreen';
import { createStyles } from './placeholderScreen.styles';
import CustomText from '@/components/CustomText';
import CustomButton from '@/components/CustomButton';
import { showModal } from '@/components/modalProvider/ModalProvider';
import { useTranslation } from 'react-i18next';
import ReuseableModalizeBottomSheet from '@/components/reuseableModalizeBottomSheet/ReuseableModalizeBottomSheet';

const PlaceholderScreen: React.FC = () => {
  const { title, description, themeMode, toggleThemeMode, handlePress } =
    usePlaceholderScreen();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(themeMode), [themeMode]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <CustomText fontFamily="bold" color="primary" style={styles.title}>
          {title}
        </CustomText>
      </TouchableOpacity>
      <CustomText color="textSecondary" style={styles.subtitle}>
        {description}
      </CustomText>
      <CustomButton
        mode="filled"
        onPress={toggleThemeMode}
        style={styles.themeToggleButton}
      >
        {themeMode === 'light'
          ? t('placeholder.switchToDarkMode')
          : t('placeholder.switchToLightMode')}
      </CustomButton>

      <CustomButton
        onPress={() => {
          showModal({
            message: 'Please enter your name',
          });
        }}
        style={{ marginTop: 29 }}
      >
        Show Modal
      </CustomButton>

      <ReuseableModalizeBottomSheet
        actionElement={
          <CustomButton style={{ marginTop: 29 }}>
            Show Bottom Sheet
          </CustomButton>
        }
      />
    </View>
  );
};

export default PlaceholderScreen;
