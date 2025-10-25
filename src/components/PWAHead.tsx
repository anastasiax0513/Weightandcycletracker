import { useEffect } from 'react';

export function PWAHead() {
  useEffect(() => {
    // Add manifest link
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/manifest.json';
    document.head.appendChild(manifestLink);

    // Add theme color
    const themeColorMeta = document.createElement('meta');
    themeColorMeta.name = 'theme-color';
    themeColorMeta.content = '#8b5cf6';
    document.head.appendChild(themeColorMeta);

    // Add apple mobile web app capable
    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);

    // Add apple mobile web app status bar style
    const appleStatusMeta = document.createElement('meta');
    appleStatusMeta.name = 'apple-mobile-web-app-status-bar-style';
    appleStatusMeta.content = 'default';
    document.head.appendChild(appleStatusMeta);

    // Add apple mobile web app title
    const appleTitleMeta = document.createElement('meta');
    appleTitleMeta.name = 'apple-mobile-web-app-title';
    appleTitleMeta.content = 'Health Tracker';
    document.head.appendChild(appleTitleMeta);

    // Update page title
    document.title = 'Health Tracker';

    return () => {
      document.head.removeChild(manifestLink);
      document.head.removeChild(themeColorMeta);
      document.head.removeChild(appleMeta);
      document.head.removeChild(appleStatusMeta);
      document.head.removeChild(appleTitleMeta);
    };
  }, []);

  return null;
}
