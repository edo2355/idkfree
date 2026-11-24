const appJson = require('./app.json');

module.exports = () => {
  const isDev = process.env.APP_VARIANT === 'development';
  const basePlugins = appJson.expo.plugins || [];
  const devPlugins = (isDev || !process.env.CI) ? ['expo-dev-client'] : [];

  return {
    ...appJson.expo,
    name: isDev ? 'IDKFREE DEV' : appJson.expo.name,
    slug: isDev ? 'idkfree-dev' : appJson.expo.slug,
    android: {
      ...appJson.expo.android,
      package: isDev ? 'app.idkfree.mobile.dev' : 'app.idkfree.mobile',
    },
    ios: {
      ...appJson.expo.ios,
      bundleIdentifier: isDev ? 'app.idkfree.mobile.dev' : 'app.idkfree.mobile',
    },
    plugins: [...basePlugins, ...devPlugins],
  };
};
