const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// metro.config.js
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(
  getDefaultConfig(__dirname),
  wrapWithReanimatedMetroConfig(config),
);
