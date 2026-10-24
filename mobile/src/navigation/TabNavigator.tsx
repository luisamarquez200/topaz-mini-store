import React from 'react';
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
import { MainTabParamList } from '@/navigation/types';
import { ProductListView } from '@/features/products/presentation/views/ProductListView';
import { FavoritesListView } from '@/features/favorites/presentation/views/FavoritesListView';

const Tab = createBottomTabNavigator<MainTabParamList>();

const BASE_TAB_OPTIONS: BottomTabNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.surface,
  },
  headerTitleStyle: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabBarActiveTintColor: COLORS.accent,
  tabBarInactiveTintColor: COLORS.textMuted,
};

const getProductsTabOptions = (): BottomTabNavigationOptions => ({
  title: STRINGS.nav.productsTitle,
  tabBarLabel: STRINGS.nav.productsTab,
  tabBarIcon: ({ color, size, focused }) => (
    <Ionicons
      name={focused ? 'grid' : 'grid-outline'}
      size={size}
      color={color}
    />
  ),
});

const getFavoritesTabOptions = (): BottomTabNavigationOptions => ({
  title: STRINGS.nav.favoritesTitle,
  tabBarLabel: STRINGS.nav.favoritesTab,
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
  const bottomInset = Math.max(insets.bottom, SPACING.xs);

  const screenOptions: BottomTabNavigationOptions = {
    ...BASE_TAB_OPTIONS,
    tabBarStyle: {
      backgroundColor: COLORS.surface,
      borderTopColor: COLORS.border,
      height: 56 + bottomInset,
      paddingBottom: bottomInset,
      paddingTop: SPACING.xs,
      ...SHADOWS.md,
    },
  };

  return (
    <Tab.Navigator
      initialRouteName="ProductsTab"
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductListView}
        options={getProductsTabOptions}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesListView}
        options={getFavoritesTabOptions}
      />
    </Tab.Navigator>
  );
};
