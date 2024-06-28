import React, { createContext, useContext, useState } from "react";

const BridgeContext = createContext({});

const BridgeCallContext = ({ children }: { children: React.ReactNode }) => {
	const [callScreen, setCallScreen] = useState(false);
	return (
		<BridgeContext.Provider value={{ callScreen, setCallScreen }}>
			{children}
		</BridgeContext.Provider>
	);
};

export default BridgeCallContext;

export const useBridgeContext = () => {
	return useContext(BridgeContext);
};
