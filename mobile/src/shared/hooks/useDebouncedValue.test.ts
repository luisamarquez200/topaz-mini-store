import { act, renderHook } from '@testing-library/react-native';
import {
  DEFAULT_DEBOUNCE_DELAY_MS,
  useDebouncedValue,
} from '@/shared/hooks/useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', async () => {
    // Arrange
    const initial = 'topaz';

    // Act
    const { result } = await renderHook(() => useDebouncedValue(initial));

    // Assert
    expect(result.current).toBe('topaz');
  });

  it('should debounce value change until timer elapses', async () => {
    // Arrange
    let value = 'initial';
    const { result, rerender } = await renderHook(() =>
      useDebouncedValue(value, DEFAULT_DEBOUNCE_DELAY_MS)
    );

    // Act
    value = 'updated';
    await act(async () => {
      await rerender({});
    });

    // Assert (before timer)
    expect(result.current).toBe('initial');

    // Act
    await act(async () => {
      jest.advanceTimersByTime(DEFAULT_DEBOUNCE_DELAY_MS);
    });

    // Assert (after timer)
    expect(result.current).toBe('updated');
  });
});
