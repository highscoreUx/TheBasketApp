import React, { useState } from "react";
import Container from "./Container";
import { usePrefernce } from "../contexts/PreferenceContext";
import axios from "axios";
import { useAuthContext } from "../contexts/AuthContext";

interface Preference {
	selectedColor: string;
}

interface Auths {
	setStreamToken: React.Dispatch<React.SetStateAction<string>>;
	setToken: React.Dispatch<React.SetStateAction<string>>;
	setUserid: React.Dispatch<React.SetStateAction<string>>;
}

const Signin = () => {
	const [credentails, setCredentails] = useState({
		email: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const { selectedColor } = usePrefernce() as Preference;
	const { setToken, setStreamToken, setUserid } = useAuthContext() as Auths;

	const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		const url = `https://api.thebasketapp.com/api/v1/auth/login`;
		try {
			setIsLoading(true);
			const response = await axios.post(url, { ...credentails });
			setToken(response.data.token);
			localStorage.setItem("token", response.data.token);
			setStreamToken(response.data.streamToken);
			localStorage.setItem("StreamToken", response.data.streamToken);
			setUserid(response.data._id);
			localStorage.setItem("userId", response.data._id);
		} catch (error) {
			//@ts-ignore
			setError(error.response.data.msg);
			setTimeout(() => {
				setError("");
			}, 3000);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<Container>
			<div className="h-full flex flex-col items-center justify-center	">
				<div className=" bg-neutral-900 p-16  border border-white/5 w-full rounded-xl">
					<div>
						<h1 className="text-3xl font-medium mb-2">
							Sign in to Basketbridge
						</h1>
						<p className="w-[85%] text-neutral-500 mb-6 text-sm">
							Sign in to your basket account, if you don't have an account,
							Please create an account at Flowbasket.com
						</p>
					</div>
					<div className="w-full">
						<div className="flex flex-col mb-4">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								name="email"
								id="email"
								placeholder="Email"
								value={credentails.email}
								onChange={(e) => {
									setCredentails({ ...credentails, email: e.target.value });
								}}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								name="password"
								id="password"
								placeholder="Enter Password"
								value={credentails.password}
								onChange={(e) => {
									setCredentails({ ...credentails, password: e.target.value });
								}}
							/>
						</div>
						{error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
						<button
							className={`mt-8 w-full bg-${selectedColor}-500 p-4`}
							onClick={handleSubmit}
						>
							{isLoading ? "Signing in..." : "Sign in"}
						</button>
					</div>
				</div>
			</div>
		</Container>
	);
};

export default Signin;
