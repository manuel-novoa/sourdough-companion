"use strict";
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = process.env.NODE_ENV === "development";
async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    icon: path.join(__dirname, "public/icon.png")
  });
  if (isDev) {
    await win.loadURL("http://localhost:3000");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
  if (process.platform === "darwin") {
    app.dock.setIcon(path.join(__dirname, "public/icon.png"));
  }
}
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
const recordsPath = path.join(app.getPath("userData"), "records");
if (!fs.existsSync(recordsPath)) {
  fs.mkdirSync(recordsPath, { recursive: true });
}
ipcMain.handle("save-record", async (event, { data, name }) => {
  try {
    const filename = `${name}.json`;
    const filepath = path.join(recordsPath, filename);
    await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2));
    console.log("Record saved:", filepath);
    return { success: true, filename };
  } catch (error) {
    console.error("Error saving record:", error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle("delete-record", async (event, recordName) => {
  try {
    const filename = `${recordName}.json`;
    const filepath = path.join(recordsPath, filename);
    await fs.promises.unlink(filepath);
    console.log("Record deleted:", filepath);
    return { success: true };
  } catch (error) {
    console.error("Error deleting record:", error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle("list-records", async () => {
  try {
    const files = await fs.promises.readdir(recordsPath);
    const records = await Promise.all(
      files.filter((file) => file.endsWith(".json")).map(async (file) => {
        const stats = await fs.promises.stat(path.join(recordsPath, file));
        return {
          name: path.parse(file).name,
          date: stats.mtime.toISOString()
        };
      })
    );
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log("Found records:", records);
    return { success: true, files: records };
  } catch (error) {
    console.error("Error listing records:", error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle("load-record", async (event, recordName) => {
  try {
    const filename = `${recordName}.json`;
    const filepath = path.join(recordsPath, filename);
    const content = await fs.promises.readFile(filepath, "utf8");
    const data = JSON.parse(content);
    console.log("Record loaded:", filename);
    return data;
  } catch (error) {
    console.error("Error loading record:", error);
    return { success: false, error: error.message };
  }
});
