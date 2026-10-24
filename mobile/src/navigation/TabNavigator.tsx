import React, { useMemo } from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/core/theme/colors';
import { SPACING } from '@/core/theme/spacing';
import { SHADOWS } from '@/core/theme/shadows';
import { STRINGS } from '@/core/theme/strings';
import { FONT_FAMILY } from '@/core/theme/typography';
import { MainTabParamList } from '@/navigation/types';
import { ProductListView } from '@/features/products/presentation/views/ProductListView';
import { Product } from '@/features/products/domain/types/Product';
import { FavoriteButton } from '@/features/favorites/presentation/components/FavoriteButton';
import { FavoritesListView } from '@/features/favorites/presentation/views/FavoritesListView';
import { useFavoritesCount } from '@/features/favorites/presentation/hooks/useFavorites';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_BAR_BASE_HEIGHT = 56;
const MAX_BADGE_COUNT = 99;
const BADGE_FONT_SIZE = 10;

const renderProductFavoriteButton = (product: Product): React.ReactNode => (
  <FavoriteButton product={product} />
);

const ProductsScreen: React.FC = () => (
  <ProductListView renderItemAction={renderProductFavoriteButton} />
);

const BASE_TAB_OPTIONS: BottomTabNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.surface,
  },
  headerTitleStyle: {
    color: COLORS.ink,
    fontFamily: FONT_FAMILY.bold,
  },
  tabBarActiveTintColor: COLORS.ink,
  tabBarInactiveTintColor: COLORS.muted,
};

const getProductsTabOptions = (): BottomTabNavigationOptions => ({
  title: STRINGS.nav.productsTitle,
  tabBarLabel: STRINGS.nav.productsTab,
  tabBarLabelStyle: {
    fontFamily: FONT_FAMILY.medium,
  },
  tabBarIcon: ({ color, size, focused }) => (
    <Ionicons
      name={focused ? 'grid' : 'grid-outline'}
      size={size}
      color={color}
    />
  ),
});

const getFavoritesTabOptions = (count: number): BottomTabNavigationOptions => ({
  title: STRINGS.nav.favoritesTitle,
  tabBarLabel: STRINGS.nav.favoritesTab,
  tabBarLabelStyle: {
    fontFamily: FONT_FAMILY.medium,
  },
  tabBarBadge:
    count > MAX_BADGE_COUNT
      ? `${MAX_BADGE_COUNT}+`
      : count > 0
        ? count
        : undefined,
  tabBarBadgeStyle: {
    backgroundColor: COLORS.ink,
    color: COLORS.surface,
    fontFamily: FONT_FAMILY.bold,
    fontSize: BADGE_FONT_SIZE,
  },
  tabBarIcon: ({ color, size, focused }) => (
    <Ionicons
      name={focused ? 'heart' : 'heart-outline'}
      size={size}
      color={color}
    />
  ),
});

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const favoritesCount = useFavoritesCount();
  const bottomInset = Math.max(insets.bottom, SPACING.xs);

  const screenOptions: BottomTabNavigationOptions = useMemo(
    () => ({
      ...BASE_TAB_OPTIONS,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopColor: COLORS.border,
        height: TAB_BAR_BASE_HEIGHT + bottomInset,
        paddingBottom: bottomInset,
        paddingTop: SPACING.xs,
        ...SHADOWS.md,
      },
    }),
    [bottomInset]
  );

  const favoritesOptions = useMemo(
    () => getFavoritesTabOptions(favoritesCount),
    [favoritesCount]
  );

  return (
    <Tab.Navigator initialRouteName="ProductsTab" screenOptions={screenOptions}>
      <Tab.Screen
        name="ProductsTab"
        component={ProductsScreen}
        options={getProductsTabOptions}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesListView}
        options={favoritesOptions}
      />
    </Tab.Navigator>
  );
};
