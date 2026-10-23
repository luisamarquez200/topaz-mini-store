import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { COLORS } from '@/core/theme/colors';
import { STRINGS } from '@/core/theme/strings';
import { TabNavigator } from '@/navigation/TabNavigator';
import { RootStackParamList } from '@/navigation/types';
import { ProductDetailView } from '@/features/products/presentation/views/ProductDetailView';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ROOT_NAVIGATOR_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: COLORS.surface,
  },
  headerTitleStyle: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  headerTintColor: COLORS.accent,
  contentStyle: {
    backgroundColor: COLORS.background,
  },
};

const MAIN_TABS_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  headerShown: false,
};

const DETAIL_SCREEN_OPTIONS: NativeStackNavigationOptions = {
  title: STRINGS.nav.detailTitle,
};

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
        component={ProductDetailView}
        options={DETAIL_SCREEN_OPTIONS}
      />
    </Stack.Navigator>
  );
};
