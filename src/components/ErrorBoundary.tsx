import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Error from '@/components/placeholder/Error';
import CustomButton from '@/components/CustomButton';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import i18n from '@/localization/i18n';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const themeMode = useThemeStore.getState().themeMode;
      const colors = getColors(themeMode);

      return (
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.content}>
            <Error text={i18n.t('common.unexpectedError')}>
              <CustomButton
                mode="filled"
                onPress={this.handleReset}
                style={styles.button}
              >
                {i18n.t('common.resetApp')}
              </CustomButton>
            </Error>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 24,
    width: '80%',
    maxWidth: 240,
  },
});

export default ErrorBoundary;
