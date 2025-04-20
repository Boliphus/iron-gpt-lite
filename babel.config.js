// babel.config.js
module.exports = function(api) {
    api.cache(true);
    return {
      presets: [
        // 1) Expo’s preset with the NativeWind JSX import source
        ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
        // 2) NativeWind’s own Babel transforms
        'nativewind/babel',
      ],
      // no other plugins here
    };
  };
  