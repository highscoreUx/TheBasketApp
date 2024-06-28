import React, { useRef } from "react";
import { usePrefernce } from "../contexts/PreferenceContext";
import { useAuthContext } from "../contexts/AuthContext";

interface Preference {
	colors: string[];
	selectedColor: string;
	setSelectedColor: (color: string) => void;
}

interface Auths {
	setToken: React.Dispatch<React.SetStateAction<string>>;
	setStreamToken: React.Dispatch<React.SetStateAction<string>>;
	setUserid: React.Dispatch<React.SetStateAction<string>>;
}

const Settings: React.FC = () => {
	const dialogref = useRef<HTMLDialogElement>(null);
	const { setToken, setStreamToken, setUserid } = useAuthContext() as Auths;
	const { colors, selectedColor, setSelectedColor } =
		usePrefernce() as Preference;
	const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		localStorage.setItem("userColor", e.target.value);
		setSelectedColor(e.target.value);
	};

	return (
		<>
			<div>
				<h1 className="text-3xl font-medium mb-2">Customize Your Settings</h1>
				<p className="w-[85%] text-neutral-500 mb-6 text-sm">
					Here you can control your application Preferences
				</p>
			</div>
			<div className="w-full">
				<div className="flex flex-col ">
					<label htmlFor="sessionID">Interface Colour</label>
					<select
						title="col"
						name="col"
						id="col"
						value={selectedColor}
						onChange={handleColorChange}
					>
						{colors.map((color) => {
							return (
								<option
									key={color}
									value={color}
									className={`hover:bg-green-500`}
								>
									{color}
								</option>
							);
						})}
					</select>
				</div>
				<div className="mt-4">
					<button
						className="hover:bg-red-500"
						onClick={() => {
							dialogref.current?.showModal();
						}}
					>
						Sign Out
					</button>
				</div>

				<dialog
					className="p-6 bg-neutral-950 backdrop:backdrop-blur-sm"
					ref={dialogref}
				>
					<p className="mb-4">Are you Sure you want to signout</p>
					<div className="flex [&>*]:flex-1 gap-4">
						<button
							className="hover:bg-red-500"
							onClick={() => {
								setToken("");
								// localStorage.setItem("token", "");
								localStorage.removeItem("token");
								setStreamToken("");
								// localStorage.setItem("StreamToken", "");
								localStorage.removeItem("StreamToken");
								setUserid("");
								localStorage.removeItem("userId");
							}}
						>
							Yes
						</button>
						<button
							type="button"
							onClick={() => {
								dialogref.current?.close();
							}}
						>
							No
						</button>
					</div>
				</dialog>
			</div>
		</>
	);
};

export default Settings;
