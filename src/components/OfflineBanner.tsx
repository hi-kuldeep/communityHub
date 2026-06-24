import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { WifiOff, Wifi } from 'lucide-react-native';

import CustomText from '@/components/CustomText';
import { useNetworkStore } from '@/store/useNetworkStore';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

// How long the "back online" success banner lingers before sliding away
const BACK_ONLINE_SHOW_DURATION = 2500;
// Must be tall enough to fully hide banner (incl. safe area) — Animated slides to -this value
const BANNER_SLIDE_OFFSET = -120;

const OfflineBanner: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const insets = useSafeAreaInsets();

  const isOnline = useNetworkStore(state => state.isOnline);

  // Whether the banner DOM node is mounted
  const [visible, setVisible] = useState(false);
  // Whether we are in the "back online" success phase
  const [justCameOnline, setJustCameOnline] = useState(false);

  // Ref tracks previous isOnline to detect transitions without stale closures
  const wasOfflineRef = useRef(false);
  const translateY = useRef(new Animated.Value(BANNER_SLIDE_OFFSET)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slideIn = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  };

  const slideOut = (onDone?: () => void) => {
    Animated.timing(translateY, {
      toValue: BANNER_SLIDE_OFFSET,
      duration: 300,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onDone?.();
    });
  };

  useEffect(() => {
    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }

    if (!isOnline) {
      // ── Went offline ──────────────────────────────────────────
      wasOfflineRef.current = true;
      setJustCameOnline(false);
      setVisible(true);
      // Reset position instantly before sliding in (handles re-trigger)
      translateY.setValue(BANNER_SLIDE_OFFSET);
      slideIn();
    } else if (wasOfflineRef.current) {
      // ── Came back online (was previously offline) ──────────────
      wasOfflineRef.current = false;
      setJustCameOnline(true);
      // Slide in the green "back online" state
      slideIn();
      // Auto-dismiss after delay
      dismissTimer.current = setTimeout(() => {
        slideOut(() => {
          setVisible(false);
          setJustCameOnline(false);
        });
      }, BACK_ONLINE_SHOW_DURATION);
    }

    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const isSuccess = justCameOnline;
  const bannerBg = isSuccess ? colors.success : colors.error;

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          backgroundColor: bannerBg,
          paddingTop: insets.top > 0 ? insets.top + spacing.xs : spacing.sm,
          transform: [{ translateY }],
        },
      ]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <View style={styles.row}>
        {isSuccess ? (
          <Wifi size={16} color="#fff" style={styles.icon} />
        ) : (
          <WifiOff size={16} color="#fff" style={styles.icon} />
        )}
        <View style={styles.textBlock}>
          <CustomText
            fontFamily="semiBold"
            colorCode="#fff"
            fontSize={13}
            style={styles.title}
          >
            {isSuccess ? t('common.backOnline') : t('common.offline')}
          </CustomText>
          {!isSuccess && (
            <CustomText colorCode="rgba(255,255,255,0.85)" fontSize={11}>
              {t('common.offlineMessage')}
            </CustomText>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

export default OfflineBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    marginBottom: 1,
  },
});
