import React from 'react';
import { Text, View } from 'react-native';
import CustomText from '@/components/CustomText';
import styles from './Login.style';
import usLogin from './usLogin';

const Login = () => {
  const { form } = usLogin();
  return (
    <View>
      <CustomText>Login</CustomText>
    </View>
  );
};

export default Login;
