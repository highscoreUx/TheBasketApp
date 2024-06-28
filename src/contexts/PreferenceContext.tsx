import React, { createContext, useContext, useState } from "react";

interface props {
	children: React.ReactNode;
}
const UserPreferenceContext = createContext({});

const PreferenceContext = ({ children }: props) => {
	const colors = ["blue", "green", "red", "orange", "amber", "lime"];
	const [selectedColor, setSelectedColor] = useState(() => {
		return localStorage.getItem("userColor") || "blue";
	});
	return (
		<UserPreferenceContext.Provider
			value={{ colors, selectedColor, setSelectedColor }}
		>
			{children}
		</UserPreferenceContext.Provider>
	);
};

export default PreferenceContext;

export const usePrefernce = () => {
	return useContext(UserPreferenceContext);
};
