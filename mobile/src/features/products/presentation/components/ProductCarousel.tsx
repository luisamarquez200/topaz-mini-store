import React, { useCallback, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { COLORS } from '@/core/theme/colors';
import { RADIUS, SPACING } from '@/core/theme/spacing';

const CAROUSEL_HEIGHT = 320;
const DOT_SIZE = 8;
const ACTIVE_DOT_WIDTH = 24;
const IMAGE_TRANSITION_MS = 200;

export interface ProductCarouselProps {
  readonly images: readonly string[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ images }) => {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
      const scrollOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollOffset / width);
      if (index >= 0 && index < images.length) {
        setActiveIndex(index);
      }
    },
    [images.length, width]
  );

  const keyExtractor = useCallback(
    (item: string, index: number): string => `${item}-${index}`,
    []
  );

  const renderImageItem = useCallback(
    ({ item }: { readonly item: string }) => {
      return (
        <View style={[styles.imageWrapper, { width }]}>
          <Image
            source={{ uri: item }}
            style={styles.image}
            contentFit="contain"
            transition={IMAGE_TRANSITION_MS}
          />
        </View>
      );
    },
    [width]
  );

  if (images.length === 0) {
    return (
      <View style={[styles.emptyContainer, { width }]}>
        <View style={styles.imagePlaceholder} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={keyExtractor}
        renderItem={renderImageItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        decelerationRate="fast"
      />
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((img, index) => {
            const isActive = index === activeIndex;
            return (
              <View
                key={`${img}-dot-${index}`}
                style={[
                  styles.dot,
                  isActive ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  imageWrapper: {
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    height: CAROUSEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.imageBackground,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.border,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: SPACING.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dot: {
    height: DOT_SIZE,
    borderRadius: RADIUS.round,
  },
  activeDot: {
    width: ACTIVE_DOT_WIDTH,
    backgroundColor: COLORS.accent,
  },
  inactiveDot: {
    width: DOT_SIZE,
    backgroundColor: COLORS.border,
  },
});
