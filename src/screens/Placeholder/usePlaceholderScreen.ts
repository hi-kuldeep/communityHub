import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/store/useThemeStore';

export const usePlaceholderScreen = () => {
  const { t } = useTranslation();
  const { themeMode, toggleThemeMode } = useThemeStore();

  const handlePress = useCallback(() => {
    console.log('Placeholder screen interaction');
  }, []);

  return {
    title: t('placeholder.title'),
    description: t('placeholder.description'),
    themeMode,
    toggleThemeMode,
    handlePress,
  };
};
