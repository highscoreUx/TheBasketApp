import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter, Routes, Route } from "react-router-dom";
import PreferenceContext from "./contexts/PreferenceContext";
import AuthContext from "./contexts/AuthContext";
import BridgeCallContext from "./contexts/BridgeCallContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<PreferenceContext>
			<AuthContext>
				<BridgeCallContext>
					<HashRouter>
						<Routes>
							<Route path="/" element={<App />} />
						</Routes>
					</HashRouter>
				</BridgeCallContext>
			</AuthContext>
		</PreferenceContext>
	</React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
