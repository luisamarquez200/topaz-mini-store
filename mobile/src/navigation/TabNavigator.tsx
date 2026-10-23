import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { COLORS } from '@/core/theme/colors';
import { SPACING } from '@/core/theme/spacing';
import { STRINGS } from '@/core/theme/strings';
import { Typography } from '@/shared/components/Typography';
import { MainTabParamList } from '@/navigation/types';
import { ProductListView } from '@/features/products/presentation/views/ProductListView';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.surface,
  },
  headerTitleStyle: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  tabBarStyle: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
  },
  tabBarActiveTintColor: COLORS.accent,
  tabBarInactiveTintColor: COLORS.textMuted,
};

const PRODUCTS_TAB_OPTIONS: BottomTabNavigationOptions = {
  title: STRINGS.nav.productsTitle,
  tabBarLabel: STRINGS.nav.productsTab,
};

const FAVORITES_TAB_OPTIONS: BottomTabNavigationOptions = {
  title: STRINGS.nav.favoritesTitle,
  tabBarLabel: STRINGS.nav.favoritesTab,
};

const SETTINGS_TAB_OPTIONS: BottomTabNavigationOptions = {
  title: STRINGS.nav.settingsTitle,
  tabBarLabel: STRINGS.nav.settingsTab,
};

const PlaceholderView: React.FC<{ readonly title: string; readonly subtitle: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <View style={styles.screen}>
      <Typography variant="heading" color={COLORS.primary} align="center">
        {title}
      </Typography>
      <Typography
        variant="body"
        color={COLORS.textSecondary}
        align="center"
        style={styles.subtitle}
      >
        {subtitle}
      </Typography>
    </View>
  );
};

export const FavoritesPlaceholder: React.FC = () => (
  <PlaceholderView
    title={STRINGS.nav.favoritesTitle}
    subtitle={STRINGS.products.placeholderFavoritesSubtitle}
  />
);

export const SettingsPlaceholder: React.FC = () => (
  <PlaceholderView
    title={STRINGS.nav.settingsTitle}
    subtitle={STRINGS.products.placeholderSettingsSubtitle}
  />
);

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={TAB_NAVIGATOR_SCREEN_OPTIONS}>
      <Tab.Screen
        name="ProductsTab"
        component={ProductListView}
        options={PRODUCTS_TAB_OPTIONS}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesPlaceholder}
        options={FAVORITES_TAB_OPTIONS}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsPlaceholder}
        options={SETTINGS_TAB_OPTIONS}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  subtitle: {
    marginTop: SPACING.sm,
  },
});
