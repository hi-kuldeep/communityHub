import AnimatedLottieView from 'lottie-react-native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  IModalProvider,
  loadingModalProps,
  modalHandlerType,
} from './@types/ModalProviderType';
import LoadingModal from './LoadingModal';
import { lottie } from '@/assets/lottie';

import { X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from '../CustomButton';
import { getColors } from '@/theme/colors';
import { useThemeStore } from '@/store/useThemeStore';
import CustomText from '../CustomText';

const ModalProvider = ({ children }: IModalProvider) => {
  const [handler, setHandler] = React.useState<modalHandlerType>({
    message: '',
    isVisible: false,
    type: undefined,
    successBtnStyle: {},
    successTitleSTyle: {},
    iconVisible: false,
    title: 'info',
    cancelTitle: '',
  });

  const [loadingHandler, setLoadingHandler] = React.useState({
    isLoading: false,
    loadingText: '',
  });
  const { t } = useTranslation();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  const getLottieType = () => {
    if (handler?.type) {
      return lottie[handler.type];
    }
    return lottie.info;
  };

  useEffect(() => {
    showModal = ({
      message = '',
      successFn,
      cancelFn,
      showCancelButton = false,
      successTitle = '',
      type = 'info',
      successBtnStyle,
      successTitleSTyle,
      title,
      cancelTitle,
      closeIconVisible = false,
      iconVisible = false,
      secondMessage,
    }) => {
      setLoadingHandler(prev => {
        return {
          ...prev,
          isLoading: false,
        };
      });
      setHandler({
        isVisible: true,
        message,
        title,
        showCancelButton,
        successTitle,
        type,
        closeIconVisible,
        cancelTitle,
        iconVisible,
        secondMessage,
        ...(successFn && { successFn }),
        ...(cancelFn && { cancelFn }),
        ...(successBtnStyle && { successBtnStyle }),
        ...(successTitleSTyle && { successTitleSTyle }),
      });
      return null;
    };

    showLoadingSpinner = ({ loadingText = t('common.loading') }) => {
      setHandler(prev => {
        return {
          ...prev,
          isVisible: false,
        };
      });
      setLoadingHandler(prev => {
        return {
          ...prev,
          isLoading: true,
          loadingText,
        };
      });
      return null;
    };

    hideModal = () => {
      setHandler({ ...handler, isVisible: false });
      return null;
    };
    hideLoadingSpinner = () => {
      setLoadingHandler(prev => {
        return {
          ...prev,
          isLoading: false,
        };
      });
      return null;
    };
  }, [handler, loadingHandler, t]);

  return (
    <>
      <Modal
        isVisible={handler?.isVisible || loadingHandler?.isLoading}
        avoidKeyboard
      >
        <View
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          {loadingHandler?.isLoading ? <LoadingModal /> : null}
          {handler?.closeIconVisible && (
            <CustomButton
              mode="text"
              onPress={() =>
                setHandler(prev => {
                  return {
                    ...prev,
                    isVisible: false,
                  };
                })
              }
              style={styles.closeButton}
            >
              <X size={24} color={colors.textSecondary} />
            </CustomButton>
          )}
          {handler?.isVisible ? (
            <View style={styles.contentContainer}>
              {handler?.iconVisible ? (
                <View style={styles.placeholderIconContainer}>
                  {/* <Icon name="luluHoldingHeart" /> */}
                </View>
              ) : (
                handler?.type && (
                  <AnimatedLottieView
                    autoPlay
                    loop={false}
                    source={getLottieType()}
                    style={styles.lottieContainer}
                  />
                )
              )}

              {handler?.title ? (
                <CustomText
                  fontSize={20}
                  fontFamily="semiBold"
                  textAlign="center"
                  color="primary"
                  style={styles.title}
                >
                  {handler?.title}
                </CustomText>
              ) : null}
              {handler?.message ? (
                <CustomText textAlign="center" color="textSecondary">
                  {handler?.message}
                </CustomText>
              ) : null}
              {handler?.secondMessage ? (
                <CustomText textAlign="center" color="textSecondary">
                  {handler?.secondMessage}
                </CustomText>
              ) : null}
              <View style={styles.buttonContainer}>
                {handler?.showCancelButton && (
                  <CustomButton
                    mode="outlined"
                    onPress={() => {
                      if (handler?.cancelFn) {
                        handler?.cancelFn();
                      }
                      setHandler(prev => {
                        return {
                          ...prev,
                          isVisible: false,
                        };
                      });
                    }}
                  >
                    {handler?.cancelTitle || t('common.cancel')}
                  </CustomButton>
                )}

                {!handler?.iconVisible ? (
                  <CustomButton
                    onPress={() => {
                      if (handler?.successFn) {
                        handler?.successFn();
                      }
                      setHandler(prev => {
                        return {
                          ...prev,
                          isVisible: false,
                        };
                      });
                    }}
                  >
                    {handler?.successTitle || t('common.ok')}
                  </CustomButton>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    borderRadius: 20,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowColor: '#000',
    shadowRadius: 8,
    shadowOpacity: 0.2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    borderWidth: 0,
    minWidth: 0,
    minHeight: 0,
    paddingHorizontal: 0,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  placeholderIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  lottieContainer: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
});

export default ModalProvider;

export let showModal = ({}: Omit<modalHandlerType, 'isVisible'>) => null;
export let hideModal = () => null;
export let hideLoadingSpinner = () => null;
export let showLoadingSpinner = ({}: Omit<loadingModalProps, 'isLoading'>) =>
  null;
