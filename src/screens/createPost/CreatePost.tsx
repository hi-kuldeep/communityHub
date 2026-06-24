import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import Container from '@/components/container/Container';
import ScreenHeader from '@/components/ScreenHeader';
import CustomInput from '@/components/input/CustomInput';
import CustomButton from '@/components/CustomButton';

import useCreatePost from './useCreatePost';
import styles from './CreatePost.style';

const CreatePost = () => {
  const { t } = useTranslation();
  const { form, isSubmitting, handleGoBack } = useCreatePost();
  const { getInputProps } = form;

  return (
    <Container
      isScrollable={true}
      isSaferAreaView={true}
      containerStyle={styles.container}
    >
      <View style={styles.content}>
        {/* Title Input Field */}
        <CustomInput
          label={t('createPost.titleLabel')}
          placeholder={t('createPost.titlePlaceholder')}
          maxLength={100}
          {...getInputProps('title')}
        />

        {/* Body Multiline Input Field */}
        <CustomInput
          label={t('createPost.bodyLabel')}
          placeholder={t('createPost.bodyPlaceholder')}
          multiline={true}
          numberOfLines={8}
          inputStyle={styles.multilineInput}
          maxLength={500}
          {...getInputProps('body')}
        />

        {/* Submit Post Button */}
        <CustomButton
          mode="filled"
          loading={isSubmitting}
          onPress={form.handleSubmit}
          style={styles.submitButton}
        >
          {t('createPost.postButton')}
        </CustomButton>
      </View>
    </Container>
  );
};

export default CreatePost;
