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
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
