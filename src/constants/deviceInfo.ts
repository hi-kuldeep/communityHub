import { Dimensions, I18nManager, Platform, StatusBar } from 'react-native';

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;

export const IS_IOS = Platform.OS === 'ios';

export const STATUS_BAR_HEIGHT = StatusBar.currentHeight;
export const IS_RTL = I18nManager.isRTL;

export const APP_BAR_HEIGHT = 50;
