import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const usePlaceholderScreen = () => {
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    console.log('Placeholder screen interaction');
  }, []);

  return {
    title: t('placeholder.title'),
    description: t('placeholder.description'),
    handlePress,
  };
};
