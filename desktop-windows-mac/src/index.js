const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "IDKMEDIA Desktop",
    backgroundColor: '#050505',
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  });
  win.loadFile('../index.html'); // Carga el HTML de prueba
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
