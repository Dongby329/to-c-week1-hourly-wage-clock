/**
 * Preload script — bridges Node.js context to renderer
 * Exposes a minimal API for desktop-specific features.
 */
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('desktopApp', {
  platform: process.platform,
  version: process.env.npm_package_version || '1.0.0'
});
