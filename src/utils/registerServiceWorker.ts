export const registerServiceWorker = async () => {
  // Service workers only work in production environments with HTTPS
  // They won't work in preview/iframe environments like Figma Make
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    try {
      // Check if we're in a deployable environment (not in an iframe or preview)
      if (window.self !== window.top) {
        console.log('PWA features are disabled in preview mode. Deploy to enable offline functionality.');
        return;
      }

      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      console.log('Service Worker registered successfully:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, prompt user to refresh
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      // Silently fail in preview environments
      console.log('Service Worker not available in this environment. Deploy to a web server to enable PWA features.');
    }
  }
};
