import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/useAuthStore';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import Avatar from './imageComponent/Avatar';

interface CustomHeaderProps {
  title: string;
  location?: string;
  onSettingsPress?: () => void;
  onLocationPress?: () => void;
  navigation?: any; // Add navigation prop for drawer
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  location,
  onSettingsPress,
  onLocationPress,
  navigation,
}) => {
  const { user } = useAuthStore();
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);

  const userLocation = user?.location || location || 'Dubai';

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        backgroundColor: colors.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingBottom: 16,
      }}
    >
      <View style={styles.innerRow}>
        {/* Avatar */}
        <TouchableOpacity activeOpacity={0.7}>
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
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MapPin size={16} color={colors.primary} style={{ marginEnd: 4 }} />
            <Text style={[styles.locationText, { color: colors.text }]}>
              {userLocation}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Right: Empty spacer for alignment */}
        <View style={styles.rightIcons} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default CustomHeader;
