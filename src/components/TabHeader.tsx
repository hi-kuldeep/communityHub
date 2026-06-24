import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import Avatar from './imageComponent/Avatar';
import ThemeToggle from './ThemeToggle';
import { bottomTabStackName } from '@/navigation/bottomTabStackNavigator/bottomTabStackName';

interface TabHeaderProps {
  title: string;
  location?: string;
  onSettingsPress?: () => void;
  onLocationPress?: () => void;
  navigation?: any; // Add navigation prop for drawer
}

const TabHeader: React.FC<TabHeaderProps> = ({ location, onLocationPress }) => {
  const { user } = useAuthStore();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const navigation = useNavigation<any>();

  const userLocation = user?.location || location || 'Dubai';

  const handleAvatarPress = () => {
    navigation.navigate(bottomTabStackName.PROFILE);
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.surface,
        },
      ]}
    >
      <View style={styles.innerRow}>
        {/* Avatar */}
        <TouchableOpacity activeOpacity={0.7} onPress={handleAvatarPress}>
          <Avatar
            source={
              user?.profilePicture ? { uri: user.profilePicture } : undefined
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Center: Location and title */}
        <TouchableOpacity
          style={styles.center}
          onPress={onLocationPress}
          activeOpacity={0.7}
          disabled={!onLocationPress}
        >
          <View style={styles.locationWrapper}>
            <MapPin size={16} color={colors.primary} style={styles.pinIcon} />
            <Text style={[styles.locationText, { color: colors.text }]}>
              {userLocation}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Right: Theme Toggle */}
        <View style={styles.rightIcons}>
          <ThemeToggle style={styles.themeToggle} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 16,
  },
  container: {
    height: Platform.OS === 'ios' ? 65 + 48 : 65,
    paddingTop: Platform.OS === 'ios' ? 48 : 0,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'center',
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginEnd: 4,
  },
  locationText: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 12,
    color: '#222',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  themeToggle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E53935',
    borderWidth: 1,
    borderColor: '#FFF',
  },
});

export default TabHeader;
