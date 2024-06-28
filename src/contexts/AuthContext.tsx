import React, { createContext, useContext, useEffect, useState } from "react";

interface props {
	children: React.ReactNode;
}

const AuthorizationContext = createContext({});

const AuthContext = ({ children }: props) => {
	const [token, setToken] = useState(() => {
		return localStorage.getItem("token") || "";
	});
	const [streamtoken, setStreamToken] = useState(() => {
		return localStorage.getItem("StreamToken") || "";
	});

	const [userId, setUserid] = useState(() => {
		return localStorage.getItem("userId") || "";
	});
	const [isLoggedin, setisLoggedin] = useState(!!token);

	useEffect(() => {
		setisLoggedin(!!token);
	}, [token]);
	return (
		<AuthorizationContext.Provider
			value={{
				isLoggedin,
				token,
				setToken,
				streamtoken,
				setStreamToken,
				userId,
				setUserid,
			}}
		>
			{children}
		</AuthorizationContext.Provider>
	);
};

export default AuthContext;

export const useAuthContext = () => {
	return useContext(AuthorizationContext);
};
