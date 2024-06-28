import React, { useState } from "react";
import Container from "./Container";
import { usePrefernce } from "../contexts/PreferenceContext";
import JoinASession from "./JoinASession";
import Settings from "./Settings";
import { useBridgeContext } from "../contexts/BridgeCallContext";

interface Preference {
	selectedColor: string;
}

interface Bridger {
	callScreen: Boolean;
	setCallScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinSession: React.FC = () => {
	const { selectedColor } = usePrefernce() as Preference;
	const [isActive, setIsActive] = useState("sessions");
	const { callScreen } = useBridgeContext() as Bridger;

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement>,
		click: string
	) => {
		e.preventDefault();
		click === "sessions" ? setIsActive("sessions") : setIsActive("settings");
	};
	return (
		<Container>
			<div className="h-full flex flex-col items-center justify-center	">
				<div className=" bg-neutral-900 p-16  border border-white/5 w-full rounded-xl">
					<div>
						<div className="w-full flex mb-4">
							<button
								className={`flex-1 rounded-none ${
									isActive === "sessions"
										? `bg-${selectedColor}-500`
										: `bg-neutral-800`
								}`}
								onClick={(e) => handleClick(e, "sessions")}
							>
								Studio Session
							</button>
							<button
								disabled={!!callScreen}
								className={`flex-1 rounded-none ${
									isActive === "settings"
										? `bg-${selectedColor}-500`
										: `bg-neutral-800`
								}`}
								onClick={(e) => handleClick(e, "settings")}
							>
								Settings
							</button>
						</div>

						<div className="min-h-[350px]">
							{isActive === `sessions` ? <JoinASession /> : <Settings />}
						</div>
					</div>
				</div>
			</div>

			{/* //Just for stylling */}
			<div className="bg-blue-500"></div>
			<div className="bg-green-500"></div>
			<div className="bg-red-500"></div>
			<div className="bg-orange-500"></div>
			<div className="bg-amber-500"></div>
			<div className="bg-lime-500"></div>
		</Container>
	);
};

export default JoinSession;
