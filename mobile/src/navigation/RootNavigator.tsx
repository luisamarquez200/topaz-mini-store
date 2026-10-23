import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../core/theme/colors';
import { SPACING } from '../core/theme/spacing';
import { Typography } from '../shared/components/Typography';
import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const ProductDetailPlaceholder: React.FC = () => {
  return (
    <View style={styles.detailScreen}>
      <Typography variant="heading" color={COLORS.primary}>
        Detalle del Producto
      </Typography>
    </View>
  );
};

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
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
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailPlaceholder}
        options={{ title: 'Detalle' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  detailScreen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
});
