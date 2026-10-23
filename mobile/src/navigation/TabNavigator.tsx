import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../core/theme/colors';
import { SPACING } from '../core/theme/spacing';
import { Typography } from '../shared/components/Typography';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

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

export const ProductsPlaceholder: React.FC = () => (
  <PlaceholderView
    title="Catálogo"
    subtitle="Productos disponibles en Topaz Store"
  />
);

export const FavoritesPlaceholder: React.FC = () => (
  <PlaceholderView
    title="Favoritos"
    subtitle="Tus productos guardados aparecerán aquí"
  />
);

export const SettingsPlaceholder: React.FC = () => (
  <PlaceholderView
    title="Ajustes"
    subtitle="Configuración general de la aplicación"
  />
);

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
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
      }}
    >
      <Tab.Screen
        name="ProductsTab"
        component={ProductsPlaceholder}
        options={{
          title: 'Productos',
          tabBarLabel: 'Productos',
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesPlaceholder}
        options={{
          title: 'Favoritos',
          tabBarLabel: 'Favoritos',
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsPlaceholder}
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  subtitle: {
    marginTop: SPACING.sm,
  },
});
