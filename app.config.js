// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,                     // keep any Expo defaults
  name: 'iron-gpt-lite',
  slug: 'iron-gpt-lite',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,

  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },

  ios: { supportsTablet: true },

  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },

  web: { favicon: './assets/favicon.png' },

  /**
   *  Any secrets or run‑time constants go here.
   *  Access in code via:
   *    Constants.expoConfig?.extra?.openAiApiKey
   */
  extra: {
    openAiApiKey: process.env.OPENAI_API_KEY,
    // Add more secrets later (e.g. supabaseUrl, sentryDsn, …)
  },
});
