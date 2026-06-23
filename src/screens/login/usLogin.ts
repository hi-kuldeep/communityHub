import useForm from '@/hooks/useForm';

const usLogin = () => {
  const form = useForm<{
    email: string;
    password: string;
  }>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: () => {},
  });
  return { form };
};

export default usLogin;
