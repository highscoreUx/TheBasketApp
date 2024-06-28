import React from "react";
import Signin from "./components/Signin";
import JoinSession from "./components/JoinSession";
import { useAuthContext } from "./contexts/AuthContext";

interface Logs {
	isLoggedin: Boolean;
}

const App: React.FC = () => {
	const { isLoggedin } = useAuthContext() as Logs;

	if (isLoggedin) {
		return <JoinSession />;
	}

	return <Signin />;
};

export default App;
