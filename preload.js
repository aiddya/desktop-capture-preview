/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  listAll: () => ipcRenderer.invoke('main:list:all'),
  listScreens: () => ipcRenderer.invoke('main:list:screens'),
  listWindows: () => ipcRenderer.invoke('main:list:windows'),
})
