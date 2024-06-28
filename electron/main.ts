import { app, BrowserWindow, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dgram from "node:dgram";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
	? path.join(process.env.APP_ROOT, "public")
	: RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC, "BasketIcon.svg"),
		backgroundColor: "black",
		width: 1200,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
		autoHideMenuBar: true,
	});

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send("main-process-message", new Date().toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}

	const udpSocket = dgram.createSocket("udp4");

	udpSocket.on("error", (err) => {
		console.error(`UDP socket error:\n${err.stack}`);
		udpSocket.close();
	});

	// Handle closing of UDP socket
	udpSocket.on("close", () => {
		console.log("UDP socket closed");
	});

	// Listen for messages on UDP socket
	udpSocket.on("message", (msg, rinfo) => {
		console.log(
			`UDP message received from ${rinfo.address}:${rinfo.port}: ${msg}`
		);
		// Process incoming audio data here
	});

	// Bind UDP socket to a port (e.g., 12345)
	udpSocket.bind(12345, () => {
		console.log("UDP socket is listening on port 12345");
	});

	ipcMain.on("audioData", (event, audioData) => {
		const buffer = Buffer.from(audioData.buffer);
		udpSocket.send(buffer, 0, buffer.length, 12345, "localhost", (err) => {
			if (err) {
				console.error("Error Sending UDP data: ", err);
			}
		});

		// console.log({ recievedData: audioData });
	});
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
