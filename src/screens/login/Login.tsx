import React from 'react';
import { Text, View } from 'react-native';
import CustomText from '@/components/CustomText';
import styles from './Login.style';
import usLogin from './usLogin';
import { CustomInput, PasswordInput } from '@/components/input';
import ThemeToggle from '@/components/ThemeToggle';

const Login = () => {
  const {
    form: { getInputProps },
  } = usLogin();
  return (
    <View style={{ marginTop: 120 }}>
      <CustomText>Login</CustomText>
      <ThemeToggle />
      <PasswordInput {...getInputProps('email')} />
      <CustomInput />
    </View>
  );
};

export default Login;
