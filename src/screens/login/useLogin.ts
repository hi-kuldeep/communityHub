import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import useForm from '@/hooks/useForm';
import { useAuthStore } from '@/store/useAuthStore';
import { loginUser } from '@/services/api/userService';

export const useLogin = () => {
  const { t } = useTranslation();
  const { login } = useAuthStore();

  const loginSchema = useMemo(() => {
    return Yup.object().shape({
      email: Yup.string()
        .required(t('validation.emailRequired'))
        .email(t('validation.emailInvalid')),
      password: Yup.string()
        .required(t('validation.passwordRequired'))
        .min(6, t('validation.passwordMin')),
    });
  }, [t]);

  // Handle the login API request as a TanStack Query mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser(email, password),
    onSuccess: async data => {
      await login(data);
    },
    onError: error => {
      console.error('Login submit error', error);
    },
  });

  const form = useForm({
    initialValues: {
      email: __DEV__ ? 'test@gmail.com' : '',
      password: __DEV__ ? '123456' : '',
    },
    validationSchema: loginSchema,
    onSubmit: async values => {
      try {
        await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });
      } catch (error: any) {
        const apiErrorMessage =
          error?.response?.data?.message || 'Invalid email or password.';
        if (apiErrorMessage.toLowerCase().includes('user not found')) {
          form.setFieldError('email', apiErrorMessage);
        } else {
          form.setFieldError('password', apiErrorMessage);
        }
      }
    },
  });

  return {
    form,
    loading: loginMutation.isPending,
  };
};

export default useLogin;
