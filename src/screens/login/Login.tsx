import React from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { Mail, Lock, Users } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Container from '@/components/container/Container';
import CustomText from '@/components/CustomText';
import CustomButton from '@/components/CustomButton';
import { CustomInput, PasswordInput } from '@/components/input';
import ThemeToggle from '@/components/ThemeToggle';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import useLogin from './useLogin';
import styles from './Login.style';

const Login = () => {
  const { t } = useTranslation();
  const { form, loading } = useLogin();
  const { getInputProps, handleSubmit } = form;
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const isDarkMode = themeMode === 'dark';

  const dynamicStyles = React.useMemo(() => {
    return {
      container: { backgroundColor: colors.background },
      blob1: { backgroundColor: colors.primary },
      blob2: { backgroundColor: colors.secondary || '#3b82f6' },
      blob3: { backgroundColor: colors.primary },
      logoIconBg: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
      },
      authCard: {
        backgroundColor: isDarkMode
          ? 'rgba(30, 41, 59, 0.65)'
          : 'rgba(255, 255, 255, 0.75)',
        borderColor: isDarkMode
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(255, 255, 255, 0.6)',
      },
      button: {
        shadowColor: colors.primary,
      },
    };
  }, [colors, isDarkMode]);

  return (
    <Container isSaferAreaView={true} containerStyle={dynamicStyles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      {/* Floating Ambient Mesh Gradient Blobs */}
      <View style={[styles.blob1, dynamicStyles.blob1]} />
      <View style={[styles.blob2, dynamicStyles.blob2]} />
      <View style={[styles.blob3, dynamicStyles.blob3]} />

      <View style={styles.themeToggleContainer}>
        <ThemeToggle />
      </View>

      <View style={styles.outerContainer}>
        {/* Logo and Greeting Header */}
        <View style={styles.headerSection}>
          <View style={[styles.logoIconBg, dynamicStyles.logoIconBg]}>
            <Users size={28} color={colors.primary} />
          </View>
          <CustomText preset="heading1" color="text" style={styles.appTitle}>
            {t('login.welcomeBack')}
          </CustomText>
          <CustomText
            preset="bodyMedium"
            color="textSecondary"
            style={styles.appSubtitle}
          >
            {t('login.subtitle')}
          </CustomText>
        </View>

        {/* Floating Glassmorphic Authentication Card */}
        <View style={[styles.authCard, dynamicStyles.authCard]}>
          <CustomInput
            label={t('login.emailLabel')}
            placeholder={t('login.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Mail size={18} color={colors.textLight} />}
            containerStyle={styles.input}
            {...getInputProps('email')}
          />

          <PasswordInput
            label={t('login.passwordLabel')}
            placeholder={t('login.passwordPlaceholder')}
            leftIcon={<Lock size={18} color={colors.textLight} />}
            containerStyle={styles.input}
            {...getInputProps('password')}
          />

          {/* Demo Credentials hint */}
          <View style={styles.demoCredentialsContainer}>
            <CustomText preset="bodySmall" color="textSecondary" style={styles.demoCredentialsLabel}>
              Demo Credentials:
            </CustomText>
            <CustomText preset="bodyMedium" color="primary" style={styles.demoCredentialsValue}>
              test@gmail.com   |   123456
            </CustomText>
          </View>

          {/* Sign In Button with Ambient Glow */}
          <CustomButton
            mode="filled"
            loading={loading}
            onPress={handleSubmit}
            style={[styles.button, dynamicStyles.button]}
          >
            {t('login.signIn')}
          </CustomButton>
        </View>
      </View>
    </Container>
  );
};

export default Login;
