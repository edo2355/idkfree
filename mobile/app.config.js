const appJson = require('./app.json');

module.exports = () => {
  const isDev = process.env.APP_VARIANT === 'development';

  return {
    ...appJson.expo,
    name: isDev ? 'IDKFREE DEV' : appJson.expo.name,
    slug: isDev ? 'idkfree-dev' : appJson.expo.slug,
    
    // ICONO: Usa ./assets/dev/icon.png si existe y es DEV, sino el original
    icon: isDev ? './assets/dev/icon.png' : (appJson.expo.icon || './assets/icon.png'),
    
    // SPLASH: Usa ./assets/dev/splash.png si es DEV
    splash: {
      ...appJson.expo.splash,
      image: isDev ? './assets/dev/splash.png' : (appJson.expo.splash?.image || './assets/splash-icon.png'),
      backgroundColor: isDev ? '#001a1a' : (appJson.expo.splash?.backgroundColor || '#050505')
    },

    android: {
      ...appJson.expo.android,
      package: isDev ? 'app.idkfree.mobile.dev' : (appJson.expo.android?.package || 'app.idkfree.mobile'),
      adaptiveIcon: isDev ? {
        foregroundImage: './assets/dev/adaptive-icon.png',
        backgroundColor: '#001a1a'
      } : appJson.expo.android?.adaptiveIcon
    },
    
    ios: {
      ...appJson.expo.ios,
      bundleIdentifier: isDev ? 'app.idkfree.mobile.dev' : (appJson.expo.ios?.bundleIdentifier || 'app.idkfree.mobile'),
    }
  };
};
