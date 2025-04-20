// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind }   = require('nativewind/metro');

// Wrap Expo’s Metro config so NativeWind’s transforms run at bundle time
module.exports = withNativeWind(getDefaultConfig(__dirname));
