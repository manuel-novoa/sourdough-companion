const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const isDev = process.env.NODE_ENV === 'development';

function resolveHtmlPath() {
    if (isDev) {
        return 'http://localhost:5173';
    }
    return path.join(__dirname, 'dist', 'index.html');
}

async function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, isDev ? 'public' : 'dist', 'icon.png')
    });

    if (isDev) {
        // Wait for dev server to be ready
        await waitForViteServer();
        await win.loadURL(resolveHtmlPath());
        win.webContents.openDevTools();
    } else {
        // In production, load the built files
        win.loadFile(resolveHtmlPath());
    }

    // Set dock icon for macOS
    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, isDev ? 'public' : 'dist', 'icon.png'));
    }

    // Handle external links
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http:') || url.startsWith('https:')) {
            require('electron').shell.openExternal(url);
        }
        return { action: 'deny' };
    });
}

function waitForViteServer() {
    if (!isDev) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const maxAttempts = 20;
        let attempts = 0;
        
        const checkServer = () => {
            attempts++;
            const req = http.get('http://localhost:5173', (res) => {
                if (res.statusCode === 200) {
                    console.log('Vite dev server is ready');
                    resolve();
                } else {
                    tryAgain();
                }
            });
            
            req.on('error', () => {
                tryAgain();
            });
        };
        
        const tryAgain = () => {
            if (attempts >= maxAttempts) {
                reject(new Error('Timed out waiting for Vite dev server'));
                return;
            }
            console.log('Waiting for Vite dev server...');
            setTimeout(checkServer, 500);
        };
        
        checkServer();
    });
}

// Handle app lifecycle
app.whenReady().then(async () => {
    await createWindow();

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        }
    });
}).catch(console.error);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Ensure records directory exists
const recordsPath = path.join(app.getPath('userData'), 'records');
if (!fs.existsSync(recordsPath)) {
    fs.mkdirSync(recordsPath, { recursive: true });
}

// Handle saving records
ipcMain.handle('save-record', async (event, { data, name }) => {
    try {
        const filename = `${name}.json`;
        const filepath = path.join(recordsPath, filename);
        
        await fs.promises.writeFile(filepath, JSON.stringify(data, null, 2));
        console.log('Record saved:', filepath);
        
        return { success: true, filename };
    } catch (error) {
        console.error('Error saving record:', error);
        return { success: false, error: error.message };
    }
});

// Handle deleting records
ipcMain.handle('delete-record', async (event, recordName) => {
    try {
        const filename = `${recordName}.json`;
        const filepath = path.join(recordsPath, filename);
        await fs.promises.unlink(filepath);
        console.log('Record deleted:', filepath);
        return { success: true };
    } catch (error) {
        console.error('Error deleting record:', error);
        return { success: false, error: error.message };
    }
});

// Handle listing records
ipcMain.handle('list-records', async () => {
    try {
        const files = await fs.promises.readdir(recordsPath);
        const records = await Promise.all(
            files
                .filter(file => file.endsWith('.json'))
                .map(async file => {
                    const stats = await fs.promises.stat(path.join(recordsPath, file));
                    return {
                        name: path.parse(file).name,
                        date: stats.mtime.toISOString()
                    };
                })
        );
        
        // Sort by date, newest first
        records.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('Found records:', records);
        return { success: true, files: records };
    } catch (error) {
        console.error('Error listing records:', error);
        return { success: false, error: error.message };
    }
});

// Handle loading records
ipcMain.handle('load-record', async (event, recordName) => {
    try {
        const filename = `${recordName}.json`;
        const filepath = path.join(recordsPath, filename);
        const content = await fs.promises.readFile(filepath, 'utf8');
        const data = JSON.parse(content);
    
        console.log('Record loaded:', filename);
        return data;
    } catch (error) {
        console.error('Error loading record:', error);
        return { success: false, error: error.message };
    }
});