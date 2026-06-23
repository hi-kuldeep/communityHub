import React from 'react';
import { View } from 'react-native';
import { MapPin, Mail } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import CustomText from '@/components/CustomText';
import CustomButton from '@/components/CustomButton';
import Avatar from '@/components/imageComponent/Avatar';
import useProfileScreen from './useProfileScreen';
import styles from './profileScreen.styles';

const ProfileScreen = () => {
  const { user, handleLogout } = useProfileScreen();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* User Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Avatar
          source={user?.profilePicture ? { uri: user.profilePicture } : undefined}
          size={80}
        />
        <CustomText preset="heading3" color="text" style={{ marginTop: spacing.md }}>
          {user?.name || 'User Profile'}
        </CustomText>

        <View style={[styles.infoRow, { marginTop: spacing.lg }]}>
          <Mail size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <CustomText preset="bodyMedium" color="textSecondary">
            {user?.email || 'N/A'}
          </CustomText>
        </View>

        <View style={[styles.infoRow, { marginTop: spacing.sm }]}>
          <MapPin size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <CustomText preset="bodyMedium" color="textSecondary">
            {user?.location || 'Dubai'}
          </CustomText>
        </View>
      </View>

      <CustomButton
        mode="outlined"
        onPress={handleLogout}
        style={[styles.logoutButton, { borderColor: colors.error }]}
        textStyle={{ color: colors.error }}
      >
        Sign Out
      </CustomButton>
    </View>
  );
};

export default ProfileScreen;
