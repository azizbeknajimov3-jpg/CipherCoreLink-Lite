const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

const isDev = process.env.NODE_ENV === "development";
let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 760,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // optional
    },
  });

  const url = isDev
    ? "http://localhost:3000"
    : `http://localhost:5000`; // prod rejimda backend server serve qiladi

  mainWindow.loadURL(url);

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", () => {
  // start backend server
  if (!isDev) {
    const serverPath = path.join(__dirname, "server.js");
    serverProcess = spawn(process.execPath, [serverPath], {
      stdio: "inherit",
    });
  }

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});

app.on("quit", () => {
  if (serverProcess) serverProcess.kill();
});