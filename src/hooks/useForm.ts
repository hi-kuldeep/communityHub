import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';

type FormValues = {
  [key: string]: any; // Can be any type for a generic form
};

// Define the useForm hook that accepts parameters like initialValues, validationSchema, and onSubmit
function useForm<T extends FormValues>({
  initialValues,
  validationSchema,
  onSubmit,
}: {
  initialValues: T;
  validationSchema?: Yup.ObjectSchema<any>; // Optional Yup validation schema
  onSubmit: (values: T, actions: FormikHelpers<T>) => void; // Custom submit handler
}) {
  const form = useFormik<T>({
    initialValues,
    validationSchema, // Optional validation schema
    onSubmit,
  });

  const getInputProps = (fieldName: keyof T) => {
    const value = form.values[fieldName];

    return {
      value:
        typeof value === 'string' || typeof value === 'number'
          ? String(value)
          : '',
      onChangeText: form.handleChange(fieldName),
      onBlur: form.handleBlur(fieldName),
      errorText: form.touched[fieldName] && form.errors[fieldName],
      isError: Boolean(form.touched[fieldName] && form.errors[fieldName]),
      isTouched: form.touched[fieldName],
      isValid: Boolean(form.touched[fieldName] && !form.errors[fieldName]),
    };
  };

  return {
    ...form,
    getInputProps,
    handleSubmit: () => form?.handleSubmit(),
  };
}

export default useForm;
