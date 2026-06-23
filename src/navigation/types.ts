import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { rootStackParams } from './rootStackNavigator/rootStackParams';

export type RootStackNavigationProp<RouteName extends keyof rootStackParams> =
  NativeStackNavigationProp<rootStackParams, RouteName>;

export type RootStackRouteProp<RouteName extends keyof rootStackParams> =
  RouteProp<rootStackParams, RouteName>;
export type RootNavigationProp = NativeStackNavigationProp<rootStackParams>;
export type RootRouteProp = RouteProp<rootStackParams>;
export type RootRouteKey = keyof rootStackParams;
export interface RouteProps<T extends RootRouteKey> {
  navigation: RootStackNavigationProp<T>;
  route: RootStackRouteProp<T>;
}
