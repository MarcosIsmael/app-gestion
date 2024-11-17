const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,  // Desactiva nodeIntegration
      contextIsolation: true,  // Asegura que el contexto de Node.js esté aislado
    },
  });
  

  // Asegúrate de que el servidor de Next.js esté corriendo en localhost:3000
  win.loadURL('http://localhost:3000');

  // Abre las herramientas de desarrollo si es necesario
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
