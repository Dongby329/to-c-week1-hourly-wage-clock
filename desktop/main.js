const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function appPath(...segments) {
  return path.join(__dirname, '..', 'prototype', ...segments);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420, height: 650, minWidth: 380, minHeight: 500,
    frame: true, backgroundColor: '#08080c', title: '时薪桌面钟',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false
    }
  });

  mainWindow.loadFile(appPath('hero.html'));
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('close', (e) => {
    if (!isQuitting) { e.preventDefault(); mainWindow.hide(); }
  });
}

function createTray() {
  try {
    tray = new Tray(nativeImage.createEmpty());
    tray.setToolTip('时薪桌面钟');
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: '显示窗口', click: () => { if (mainWindow) mainWindow.show(); } },
      { type: 'separator' },
      { label: '退出', click: () => { isQuitting = true; app.quit(); } }
    ]));
    tray.on('double-click', () => { if (mainWindow) mainWindow.show(); });
  } catch(e) {}
}

app.whenReady().then(() => { createWindow(); createTray(); });
app.on('activate', () => { if (mainWindow) mainWindow.show(); else createWindow(); });
app.on('before-quit', () => { isQuitting = true; });
