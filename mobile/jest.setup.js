jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/src/mock')
);

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props) =>
      React.createElement(View, { testID: props.name, ...props }),
  };
});

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default
);
