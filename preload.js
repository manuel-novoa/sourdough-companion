const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Get user's home directory
const homeDir = require('os').homedir();
const APP_FOLDER = path.join(homeDir, '.sourdough-companion');

// Ensure app directory exists
if (!fs.existsSync(APP_FOLDER)) {
  fs.mkdirSync(APP_FOLDER, { recursive: true });
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // File System Operations
    saveRecord: async (data, name) => {
      try {
        const filePath = path.join(APP_FOLDER, `${name}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    loadRecord: async (name) => {
      try {
        const filePath = path.join(APP_FOLDER, `${name}.json`);
        if (fs.existsSync(filePath)) {
          const data = fs.readFileSync(filePath, 'utf8');
          return JSON.parse(data);
        }
        return null;
      } catch (error) {
        console.error('Error loading record:', error);
        return null;
      }
    },

    listRecords: async () => {
      try {
        const files = fs.readdirSync(APP_FOLDER)
          .filter(file => file.endsWith('.json'))
          .map(file => {
            const filePath = path.join(APP_FOLDER, file);
            const stats = fs.statSync(filePath);
            return {
              name: path.basename(file, '.json'),
              date: stats.mtime.toISOString()
            };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        return { success: true, files };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    deleteRecord: async (name) => {
      try {
        const filePath = path.join(APP_FOLDER, `${name}.json`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          return { success: true };
        }
        return { success: false, error: 'File not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // IPC Communication
    send: (channel, data) => {
      // whitelist channels
      const validChannels = ['toMain'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      // whitelist channels
      const validChannels = ['fromMain'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },

    // App Info
    getAppPath: () => APP_FOLDER,

    // Platform info
    platform: process.platform
  }
);

// Listen for dom-ready
window.addEventListener('DOMContentLoaded', () => {
  // Any initialization code can go here
  console.log('preload.js loaded');
});