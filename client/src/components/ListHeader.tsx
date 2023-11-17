import { HandleModalProps } from '../interfaces/';
import { useCookies } from 'react-cookie';

type ListHeaderProps = {
	title: string;
	openModal: HandleModalProps;
};

function ListHeader({ title, openModal }: ListHeaderProps) {
	const [cookies, , removeCookies] = useCookies();

	return (
		<div className="">
			<div className="flex items-center justify-between w-full border-b-2 border-b-green-300 pb-6 mb-4">
				<h1 className="text-2xl font-semibold uppercase">{title}</h1>
				<div className="flex items-center gap-2 ">
					<button
						className="py-2 px-4 border-2 rounded-2xl border-gray-500 uppercase text-xs font-medium hover:bg-gray-200 transition-colors duration-300 tracking-wider"
						onClick={() => openModal('add')}
					>
						add new
					</button>
					<button
						className="py-2 px-4 border-2 rounded-2xl border-red-400 bg-red-400 uppercase text-xs  text-white font-medium hover:border-gray-500 transition-colors duration-300 tracking-wider"
						onClick={() => (removeCookies('email'), removeCookies('authToken'))}
					>
						sign out
					</button>
				</div>
			</div>
			<h1 className="text-right">Welcome {cookies.email}</h1>
		</div>
	);
}

export default ListHeader;
