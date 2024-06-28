import React from "react";

interface props extends React.HTMLProps<HTMLDivElement> {
	children: React.ReactNode;
}

const Container = ({ children }: props) => {
	return <div className="max-w-[546px] mx-auto h-screen">{children}</div>;
};

export default Container;
