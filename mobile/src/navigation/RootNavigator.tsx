import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { COLORS } from '@/core/theme/colors';
import { STRINGS } from '@/core/theme/strings';
import { FONT_FAMILY } from '@/core/theme/typography';
import { TabNavigator } from '@/navigation/TabNavigator';
import { RootStackParamList } from '@/navigation/types';
import { Product } from '@/features/products/domain/types/Product';
import { ProductDetailView } from '@/features/products/presentation/views/ProductDetailView';
import { FavoriteButton } from '@/features/favorites/presentation/components/FavoriteButton';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ROOT_NAVIGATOR_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.surface,
  },
  headerTitleStyle: {
    color: COLORS.ink,
    fontFamily: FONT_FAMILY.bold,
  },
  headerTintColor: COLORS.accent,
  headerBackTitle: STRINGS.nav.back,
  contentStyle: {
    backgroundColor: COLORS.background,
  },
};

const MAIN_TABS_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
  title: '',
  headerBackTitle: STRINGS.nav.back,
};

const DETAIL_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  title: STRINGS.nav.detailTitle,
  headerBackTitle: '',
  headerBackButtonDisplayMode: 'minimal',
};

const renderDetailFavoriteButton = (product: Product): React.ReactNode => (
  <FavoriteButton product={product} />
);

const renderBottomAction = (product: Product): React.ReactNode => (
  <FavoriteButton product={product} variant="expanded" />
);

const DetailScreen: React.FC = () => (
  <ProductDetailView
    renderFavoriteButton={renderDetailFavoriteButton}
    renderBottomAction={renderBottomAction}
  />
);

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={MAIN_TABS_SCREEN_OPTIONS}
      />
      <Stack.Screen
        name="ProductDetail"
        component={DetailScreen}
        options={DETAIL_SCREEN_OPTIONS}
      />
    </Stack.Navigator>
  );
};
