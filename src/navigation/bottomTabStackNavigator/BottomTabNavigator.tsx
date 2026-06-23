import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, User } from 'lucide-react-native';
import { useThemeStore } from '@/store/useThemeStore';
import { getColors } from '@/theme/colors';
import TabHeader from '@/components/TabHeader';
import MainScreen from '@/screens/main';
import CommunitiesScreen from '@/screens/communities';
import ProfileScreen from '@/screens/profile';
import { bottomTabStackParam } from './bottomTabStackParam';
import { bottomTabStackName } from './bottomTabStackName';

const Tab = createBottomTabNavigator<bottomTabStackParam>();

const BottomTabNavigator = () => {
  const { themeMode } = useThemeStore();
  const colors = getColors(themeMode);
  const isDarkMode = themeMode === 'dark';

  const getHeaderTitle = (routeName: string) => {
    switch (routeName) {
      case bottomTabStackName.HOME:
        return 'Home';
      case bottomTabStackName.COMMUNITIES:
        return 'Groups';
      case bottomTabStackName.PROFILE:
        return 'Profile';
      default:
        return 'Community Hub';
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <TabHeader title={getHeaderTitle(route.name)} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarShowLabel: false, // Cleaner, premium icon-only floating dock
        tabBarStyle: {
          position: 'absolute',
          // bottom: Platform.OS === 'ios' ? 24 : 16,
          left: 24,
          right: 24,
          backgroundColor: colors.surface,
          borderRadius: 24,
          height: 74,
          borderTopWidth: 0,
          // Premium iOS dropshadows
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDarkMode ? 0.35 : 0.08,
          shadowRadius: 16,
          // Android elevation
          elevation: 8,
        },
        tabBarItemStyle: {
          marginTop: 10,
        },
      })}
    >
      <Tab.Screen
        name={bottomTabStackName.HOME}
        component={MainScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <Home size={22} color={color} />
              {focused && (
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={bottomTabStackName.COMMUNITIES}
        component={CommunitiesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <Users size={22} color={color} />
              {focused && (
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={bottomTabStackName.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabIconContainer}>
              <User size={22} color={color} />
              {focused && (
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
});
