import React from 'react';
import { Text, View } from 'react-native';
import CustomText from '@/components/CustomText';
import styles from './Login.style';
import usLogin from './usLogin';
import { CustomInput, PasswordInput } from '@/components/input';
import ThemeToggle from '@/components/ThemeToggle';
import Container from '@/components/container/Container';

const Login = () => {
  const {
    form: { getInputProps },
  } = usLogin();
  return (
    <Container containerStyle={{ marginTop: 20 }}>
      <CustomText>Login</CustomText>
      <ThemeToggle />
      <PasswordInput {...getInputProps('email')} />
      <CustomInput />
    </Container>
  );
};

export default Login;
