import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { TodoProps, HandleModalProps } from '../interfaces';
import Btn01 from './shared/buttons/Btn01';
import Spinner from './shared/Spinner';

type ModalProps = {
	mode: string;
	openModal: HandleModalProps;
	isOpen: boolean;
	editTodo: TodoProps;
};

function Modal({ openModal, isOpen, mode, editTodo }: ModalProps) {
	const [cookies] = useCookies();
	const defaultTodo = {
		title: '',
		description: '',
		progress: 0,
		user_email: cookies.email,
	} as TodoProps;

	const [todo, setTodo] = useState<TodoProps>(defaultTodo as TodoProps);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [status, setStatus] = useState({
		barColor: '',
		statusColor: '',
		statusText: '',
	});

	const fetchData = async () => {
		setLoading(true);
		try {
			if (mode === 'edit') {
				await axios.put(`${import.meta.env.VITE_URL_SERVER}/todos/${todo.id}`, {
					...todo,
				});

				toast.success('Your todo was updated!!');

				openModal('initial');
			}
			if (mode === 'add') {
				await axios.post(`${import.meta.env.VITE_URL_SERVER}/todos`, {
					...todo,
				});
				toast.success('Your todo was created!!');
				openModal('initial');
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const handleTodo = (e: { target: { name: string; value: string } }) => {
		setTodo({
			...todo,
			[e.target.name]: e.target.value,
		});
	};

	useEffect(() => {
		let color;
		let status = 'not started';

		const progress = Number(todo.progress);

		switch (true) {
			case progress === 0:
				color = 'red-400';
				status = 'not started';
				break;
			case progress === 50:
				color = 'orange-400';
				status = 'in progress';
				break;
			case progress === 100:
				color = 'green-400';
				status = 'finished';
				break;

			default:
				color = '';
				break;
		}
		const progressColor = `accent-${color}`;
		const statusColor = ` transition-color duration-300 text-center capitalize mb-2 text-${color}`;

		setStatus({
			barColor: progressColor,
			statusColor: statusColor,
			statusText: status,
		});
	}, [todo.progress]);

	//set initial value for todo based on mode 'edit' or 'add'
	useEffect(() => {
		setError('');
		if (mode === 'edit') {
			setTodo(editTodo);
			return;
		} else {
			setTodo(defaultTodo);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode, editTodo]);

	const handleSubmit = () => {
		if (todo.title.length < 1) {
			setError('Title can not be empty');
			return;
		}
		switch (mode) {
			case 'edit':
				// openModal('initial');
				fetchData();
				break;
			case 'add':
				fetchData();
				break;

			default:
				break;
		}
	};

	return (
		<div
			className={`fixed top-0 left-0 bg-black bg-opacity-75 h-full w-full flex items-center justify-center transition-transform duration-500  overflow-hidden ${
				isOpen ? 'translate-x-0' : 'translate-x-full'
			}`}
		>
			<div className="relative flex flex-col gap-4 py-10 px-8 bg-white shadow-sm rounded-md w-4/5 max-w-2xl  ">
				<h1 className="font-semibold text-xl">Let's {mode} your task!</h1>
				<Icon
					icon="uil:times"
					className="absolute top-0 right-0 text-gray-600 text-3xl m-8 cursor-pointer  transition-transform duration-300 will-change-transform hover:rotate-90 hover:text-red-500"
					onClick={() => openModal('cancel')}
				/>
				<div>
					<input
						value={todo?.title}
						type="text"
						name="title"
						placeholder="add your task title..."
						onChange={(e) => handleTodo(e)}
						onClick={() => setError('')}
						className="w-full border rounded-md border-gray-300 p-2 mt-10 focus:outline-blue-300"
					/>
					<p className="text-red-400 h-4 text-sm mt-1">{error}</p>
				</div>
				<textarea
					value={todo?.description}
					name="description"
					placeholder="add your task description..."
					onChange={(e) => handleTodo(e)}
					rows={6}
					className="border rounded-md border-gray-300 p-2 mt-10 focus:outline-blue-300 whitespace-pre-wrap"
				/>
				<label htmlFor="progress" className="mt-4">
					Drag to select your current progress
				</label>
				<input
					id="progress"
					type="range"
					name="progress"
					min={0}
					max={100}
					step={50}
					value={todo?.progress}
					onChange={(e) => handleTodo(e)}
					className={` ${status.barColor} `}
					style={{ height: '20px' }}
				/>
				<p className={status.statusColor}>{status.statusText}</p>
				<div className="flex items-center gap-2 self-end mt-auto  w-full">
					<Btn01 handleSubmit={handleSubmit}>
						{loading ? (
							<Spinner size={4} />
						) : mode === 'edit' ? (
							'save changes'
						) : (
							'submit'
						)}
					</Btn01>
				</div>
			</div>
		</div>
	);
}

export default Modal;
