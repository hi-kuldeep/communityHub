import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Placeholder: undefined;
};

export type RootStackNavigationProp<RouteName extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, RouteName>;

export type RootStackRouteProp<RouteName extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, RouteName>;
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type RootRouteProp = RouteProp<RootStackParamList>;
export type RootRouteKey = keyof RootStackParamList;
export interface RouteProps<T extends RootRouteKey> {
  navigation: RootStackNavigationProp<T>;
  route: RootStackRouteProp<T>;
}
