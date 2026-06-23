import React from 'react';
import { View } from 'react-native';
import Container from '@/components/container/Container';
import CustomText from '@/components/CustomText';
import CustomButton from '@/components/CustomButton';
import ThemeToggle from '@/components/ThemeToggle';
import useMainScreen from './useMainScreen';
import styles from './MainScreen.style';

const MainScreen = () => {
  const { user, loading, handleLogout } = useMainScreen();

  return (
    <Container contentContainerStyle={styles.container}>
      <View style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle />
      </View>

      <CustomText preset="heading2" color="text" style={styles.title}>
        Welcome Back!
      </CustomText>

      <CustomText preset="bodyLarge" color="textSecondary" style={styles.subtitle}>
        Logged in as: {user?.email || 'Guest User'}
      </CustomText>

      <CustomButton
        mode="filled"
        loading={loading}
        onPress={handleLogout}
        style={styles.button}
      >
        Logout
      </CustomButton>
    </Container>
  );
};

export default MainScreen;
