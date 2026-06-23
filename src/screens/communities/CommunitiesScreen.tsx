import React from 'react';
import { View } from 'react-native';
import { Users } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import CustomText from '@/components/CustomText';
import useCommunitiesScreen from './useCommunitiesScreen';
import styles from './communitiesScreen.styles';

const CommunitiesScreen = () => {
  useCommunitiesScreen();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Users size={56} color={colors.primary} />
      <CustomText preset="heading3" color="text" style={styles.title}>
        Communities
      </CustomText>
      <CustomText preset="bodyMedium" color="textSecondary" style={styles.subtitle}>
        Explore and join active groups within the Community Hub network.
      </CustomText>

      {/* Mock community list */}
      <View style={styles.mockList}>
        <View style={[styles.mockItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Users size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <CustomText preset="bodyLarge" color="text">React Native Engineers</CustomText>
            <CustomText preset="bodySmall" color="textSecondary">1,240 members</CustomText>
          </View>
        </View>
        <View style={[styles.mockItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Users size={20} color={colors.primary} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <CustomText preset="bodyLarge" color="text">Design System Core</CustomText>
            <CustomText preset="bodySmall" color="textSecondary">845 members</CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommunitiesScreen;
