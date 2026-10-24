import { NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  ProductsTab: undefined;
  FavoritesTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { readonly productId: number };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
