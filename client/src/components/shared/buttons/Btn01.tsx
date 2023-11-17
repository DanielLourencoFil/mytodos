import React from 'react';
type BtnProps = {
	children: React.ReactNode;
	handleSubmit: () => void;
};

function Btn01({ children, handleSubmit }: BtnProps) {
	return (
		<button
			className="py-2 px-4 border-2 rounded-2xl border-gray-500 uppercase text-base font-medium hover:bg-gray-200 transition-colors duration-300 tracking-wider w-full flex items-center justify-center"
			onClick={handleSubmit}
		>
			{children}
		</button>
	);
}

export default Btn01;
