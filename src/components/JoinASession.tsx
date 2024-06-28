import React, { useEffect, useRef, useState } from "react";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { usePrefernce } from "../contexts/PreferenceContext";
import axios from "axios";
import { useAuthContext } from "../contexts/AuthContext";
import CallUi from "./Callui";

import {
	StreamCall,
	StreamVideo,
	StreamVideoClient,
	User,
} from "@stream-io/video-react-sdk";

import { useBridgeContext } from "../contexts/BridgeCallContext";

interface Preference {
	selectedColor: string;
}

interface Bridger {
	callScreen: Boolean;
	setCallScreen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Auths {
	token: string;
	streamtoken: string;
	userId: string;
}

const apiKey = `cyp34sbgy5bj`;

const JoinASession: React.FC = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { selectedColor } = usePrefernce() as Preference;
	const { token, streamtoken, userId } = useAuthContext() as Auths;
	const [sessionID, setSesionID] = useState("");
	const [error, setError] = useState("");
	const [activeSession, setActiveSession] = useState<String | Boolean>(() => {
		return sessionStorage.getItem("_Session") || "";
	});
	const waveFormRev = useRef(null);
	const [client, setClient] = useState<StreamVideoClient | null>(null);
	const [call, setCall] = useState<any>(null);
	const { setCallScreen } = useBridgeContext() as Bridger;
	null;

	const user: User = {
		id: userId,
		name: "Producer",
		// image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
	};

	useEffect(() => {
		if (activeSession && !client && !call) {
			setCallScreen(true);
			const newSesh = sessionStorage.getItem("_Session") || "";
			const data = { apiKey, user, token: streamtoken };
			const newClient = new StreamVideoClient(data);
			const newCall = newClient.call("default", newSesh);

			newCall.join({ create: true });
			setClient(newClient);
			setCall(newCall);
		}
	}, [activeSession, sessionID, streamtoken, user]);

	useEffect(() => {
		setActiveSession(!!activeSession);
	}, [activeSession]);

	useEffect(() => {
		const handleBeforeUnload = () => {
			if (call) {
				call.leave(); // Ensure the call is ended
				setClient(null); // Clear the client
				setCall(null); // Clear the call
				setActiveSession(false);
				sessionStorage.removeItem("_Session"); // Remove session ID from session storage
				setSesionID("");
				setCallScreen(false);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [call]);

	const handleJoinSession = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsLoading(true);
		const url = `https://api.thebasketapp.com/api/v1/session/${sessionID}`;
		try {
			const response = await axios.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.status === 200) {
				sessionStorage.setItem("_Session", sessionID);
			}
			{
				setActiveSession(sessionID);
			}
		} catch (error) {
			setError("!Incorrect session ID, Please Provide a Valid Session ID");
			setTimeout(() => {
				setError("");
			}, 3000);
		} finally {
			setIsLoading(false);
		}
	};

	const endCall = () => {
		setClient(null); // Clear the client
		setCall(null); // Clear the call
		setActiveSession(false); // Update session status
		sessionStorage.removeItem("_Session"); // Remove session ID from session storage
		setSesionID("");
		setCallScreen(false);
	};

	if (activeSession && client && call) {
		return (
			<>
				<div>
					<h1 className="text-3xl font-medium mb-2">
						Studio Session in Progress
					</h1>
					<p className="w-[85%] text-neutral-500 mb-6 text-sm">
						Check out participants
					</p>
				</div>
				<div className="w-full">
					<div ref={waveFormRev} className="mt-4"></div>
					<StreamVideo client={client}>
						<StreamCall call={call}>
							<CallUi isSessionActive={true} endCall={endCall} />
						</StreamCall>
					</StreamVideo>
					{/* {isCallLive ? (
						<button
							className={`mt-8 w-full bg-${selectedColor}-500 p-4 `}
							onClick={() => setActiveSession(false)}
						>
							Leave Studio Session
						</button>
					) : (
						<button
							className={`mt-8 w-full bg-${selectedColor}-500 p-4 `}
							onClick={() => setActiveSession(false)}
						>
							Session is Starting
						</button>
					)} */}
				</div>
			</>
		);
	}

	return (
		<>
			<div>
				<h1 className="text-3xl font-medium mb-2">Join a Studio Session</h1>
				<p className="w-[85%] text-neutral-500 mb-6 text-sm">
					Welcome Back, Please Provide a session ID, so you can record an artist
				</p>
			</div>
			<div className="w-full">
				<div className="flex flex-col ">
					<label htmlFor="sessionID">Session ID</label>
					<input
						className={`focus:outline-${selectedColor}-500`}
						type="text"
						name="sessionID"
						id="sessionID"
						placeholder="Please enter session ID"
						value={sessionID}
						onChange={(e) => {
							setSesionID(e.target.value);
						}}
					/>
				</div>
				{error && <div className="text-red-500 mt-2 text-sm">{error}</div>}

				<button
					className={`mt-8 w-full bg-${selectedColor}-500 p-4 `}
					onClick={handleJoinSession}
				>
					{isLoading ? "Joining Session" : "Join Session"}
				</button>
			</div>
		</>
	);
};

export default JoinASession;
