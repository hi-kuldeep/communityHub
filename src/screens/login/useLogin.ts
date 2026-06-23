import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import useForm from '@/hooks/useForm';
import { useAuthStore } from '@/store/useAuthStore';

export const useLogin = () => {
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

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

  const form = useForm({
    initialValues: {
      email: __DEV__ ? 'test@gmail.com' : '',
      password: __DEV__ ? '123456' : '',
    },
    validationSchema: loginSchema,
    onSubmit: async values => {
      setLoading(true);
      try {
        // Simulate API request using 1 second delay
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
        const timestamp = Date.now();
        const fakeToken = `fake_jwt_token_${timestamp}`;

        await login(values.email, fakeToken);
      } catch (error) {
        console.error('Login submit error', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    form,
    loading,
  };
};

export default useLogin;
