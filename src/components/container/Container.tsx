import React, { useEffect, useRef } from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import { IContainerProps } from './@types/container.type';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import LoadingSpinner from '@/components/placeholder/LoadingSpinner';
import Error from '@/components/placeholder/Error';
import RefreshControlComponent from '@/components/refreshControlComponent/RefreshControlComponent';
import { IS_IOS, SCREEN_HEIGHT } from '@/constants/deviceInfo';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';

const Container = ({
  children,
  contentContainerStyle,
  isLoading,
  isError,
  errorText,
  isPaddingBottomEnabled,
  stickyHeaderIndices,
  isScrollable = true,
  isRefreshing,
  alwaysBounceVertical,
  keyboardVerticalOffset,
  onRefresh,
  containerStyle,
  isSaferAreaView = false,
  keyboardShouldPersistTaps,
}: IContainerProps) => {
  const ref = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  const render = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }
    if (isError) {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Error text={errorText} />
        </View>
      );
    }
    return children;
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={[
        {
          flex: 1,
          zIndex: 9999,
          backgroundColor: colors.background,
        },
        containerStyle,
        isSaferAreaView &&
          !IS_IOS && {
            paddingTop: insets.top,
          },
      ]}
      behavior={IS_IOS ? 'padding' : 'height'}
    >
      {isScrollable ? (
        <ScrollView
          nestedScrollEnabled
          automaticallyAdjustKeyboardInsets={true}
          ref={ref}
          alwaysBounceVertical={alwaysBounceVertical}
          refreshControl={
            onRefresh && (
              <RefreshControlComponent
                refreshing={!!isRefreshing}
                onRefresh={onRefresh}
              />
            )
          }
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingBottom: isPaddingBottomEnabled ? SCREEN_HEIGHT * 0.15 : 0,
              // paddingHorizontal: 20,
            },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: colors.background,
            flex: 1,
          }}
          stickyHeaderIndices={stickyHeaderIndices}
        >
          {isSaferAreaView ? (
            <SafeAreaView style={{ flex: 1 }}>{render()}</SafeAreaView>
          ) : (
            render()
          )}
        </ScrollView>
      ) : isSaferAreaView ? (
        <SafeAreaView style={{ flex: 1 }}>{render()}</SafeAreaView>
      ) : (
        render()
      )}
    </KeyboardAvoidingView>
  );
};

export default Container;
