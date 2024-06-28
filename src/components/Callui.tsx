import { FaVideoSlash } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { usePrefernce } from "../contexts/PreferenceContext";
import {
	ParticipantView,
	useCall,
	useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { MdCallEnd } from "react-icons/md";
import { useEffect, useMemo, useRef } from "react";

interface Preference {
	selectedColor: string;
}

const CallUi: React.FC<{
	isSessionActive: boolean;
	endCall: () => void;
}> = (props) => {
	const { selectedColor } = usePrefernce() as Preference;
	const call = useCall();
	const {
		useIsCallLive,
		useParticipantCount,
		useParticipants,
		useCameraState,
		useMicrophoneState,

		// ... more hooks
	} = useCallStateHooks();
	const totalParticipants = useParticipantCount();
	const participants = useParticipants();
	const { isMute } = useCameraState();
	const isCallLive = useIsCallLive();
	const isMicMute = useMicrophoneState().isMute;

	const processedStreams = useRef(new Set<MediaStream>());
	const audioContextRef = useRef<AudioContext | null>(null);
	const audioWorkletNodes = useRef<Map<MediaStream, AudioWorkletNode>>(
		new Map()
	);

	const participantViews = useMemo(
		() =>
			participants.map((participant) => (
				<div key={participant.sessionId} className="rounded-lg">
					<div className="h-16">
						<ParticipantView
							participant={participant}
							ParticipantViewUI={null}
							className="h-full w-full  object-cover rounded"
						/>
					</div>
				</div>
			)),
		[participants]
	);

	useEffect(() => {
		const startAudioCapture = async (stream: MediaStream) => {
			if (!audioContextRef.current) {
				audioContextRef.current = new AudioContext();
			}
			const audioContext = audioContextRef.current;

			try {
				if (audioContext.state === "suspended") {
					await audioContext.resume();
				}

				if (!processedStreams.current.has(stream)) {
					await audioContext.audioWorklet.addModule(
						new URL("../utils/worklet-processor.ts", import.meta.url)
					);

					const audioSource = audioContext.createMediaStreamSource(stream);
					const audioWorkletNode = new AudioWorkletNode(
						audioContext,
						"audio-processor"
					);

					audioWorkletNode.port.onmessage = (evt) => {
						const audioData = evt.data;
						window.ipcRenderer.send("audioData", audioData);
					};

					audioSource.connect(audioWorkletNode);
					audioWorkletNode.connect(audioContext.destination);

					processedStreams.current.add(stream);
					audioWorkletNodes.current.set(stream, audioWorkletNode);
				}
			} catch (error) {
				console.log(error);
			}
		};

		if (props.isSessionActive && isCallLive) {
			participants.forEach((participant) => {
				const audioStream = participant.audioStream;
				// if (audioStream) {
				// 	startAudioCapture(audioStream);
				// }
				if (audioStream && !processedStreams.current.has(audioStream)) {
					startAudioCapture(audioStream);
					processedStreams.current.add(audioStream);
				}
			});
		}

		return () => {
			// Cleanup on component unmount or dependency change
			processedStreams.current.clear();
			audioWorkletNodes.current.forEach((node) => {
				node.port.close();
				node.disconnect();
			});
			audioWorkletNodes.current.clear();
			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
		};
	}, [props.isSessionActive, isCallLive, participants]);

	useEffect(() => {
		if (!props.isSessionActive || !isCallLive) {
			// Cleanup when session is inactive or call is not live
			processedStreams.current.clear();
			audioWorkletNodes.current.forEach((node) => {
				node.port.close();
				node.disconnect();
			});
			audioWorkletNodes.current.clear();
			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
		}
	}, [props.isSessionActive, isCallLive]);

	return (
		<main>
			<div>
				<div className="flex flex-col ">
					<div className="flex justify-between mb-2">
						<label htmlFor="participants" className="font-bold text-xl">
							Participants
						</label>
						<div
							className={`self-start text-white bg-${selectedColor}-500 rounded-lg py-1 px-2`}
						>
							Live: {totalParticipants}
						</div>
					</div>
					<div className="grid-cols-4 grid gap-4">{participantViews}</div>
				</div>
			</div>
			<div className="flex flex-col gap-1"></div>
			<div className="w-full mt-4">
				{props.isSessionActive && isCallLive ? (
					<div className="flex [&>*]:flex-1 gap-4">
						<button
							type="button"
							className={`flex items-center justify-center ${
								isMute ? "bg-red-500" : ""
							}`}
							onClick={() => {
								call?.camera.toggle();
							}}
						>
							{isMute ? (
								<span>
									<FaVideoSlash className="text-2xl" />
								</span>
							) : (
								<span>
									<FaVideo className="text-2xl" />
								</span>
							)}
						</button>
						<button
							type="button"
							className={`flex items-center justify-center bg-red-500 flex-[2]`}
							title="endcall"
							onClick={() => {
								call?.leave();
								props.endCall();
							}}
						>
							<MdCallEnd className="text-2xl" />
						</button>
						<button
							type="button"
							title={isMicMute ? "Unmute Mic" : "Mute Mic"}
							className={`flex items-center justify-center ${
								isMicMute ? "bg-red-500" : ""
							}`}
							onClick={() => {
								call?.microphone.toggle();
							}}
						>
							{isMicMute ? (
								<span>
									<BsMicMuteFill className="text-2xl" />
								</span>
							) : (
								<span>
									<BsMicFill className="text-2xl" />
								</span>
							)}
						</button>
					</div>
				) : (
					<button disabled={true}>Session is Starting...</button>
				)}
			</div>
		</main>
	);
};

export default CallUi;
