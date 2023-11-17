import { Icon } from '@iconify/react';
import { TodoProps, HandleModalProps } from '../interfaces';
import { useEffect, useState } from 'react';

type ListItemProps = {
	todo: TodoProps;
	openModal: HandleModalProps;
	handleEditTodo: (id: string) => void;
	handleDeleteTodo: (id: string) => void;
};
const ListItem = ({
	todo,
	openModal,
	handleEditTodo,
	handleDeleteTodo,
}: ListItemProps) => {
	const date = new Date(todo?.createdat).toLocaleString().split(',')[0];
	// const [editTodo, setEditTodo] = useState<TodoProps>({} as TodoProps);
	const [barColor, setBarColor] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		let color;
		const progress = Number(todo.progress);

		switch (true) {
			case progress <= 40:
				color = 'bg-red-400';
				break;
			case progress <= 80:
				color = 'bg-orange-400';
				break;
			case progress > 80:
				color = 'bg-green-400';
				break;

			default:
				color = '';
				break;
		}
		setBarColor(color);
	}, [todo]);

	return (
		<div className="relative flex flex-col gap-2 shadow-sm border rounded-lg p-4 hover:bg-gray-100 transition-colors duration-300 ">
			<div className="flex  items-center justify-between">
				<div className="flex  items-center  gap-4 w-3/6">
					<Icon
						icon="el:ok-circle"
						className="text-green-500 text-2xl"
						style={{ opacity: `${todo.progress === 100 ? 1 : 0}` }}
					/>
					<div>
						<h1
							className="text-lg mb-2"
							style={{
								textDecoration: `${
									todo.progress === 100 ? 'line-through' : 'none'
								}`,
								textDecorationColor: `${
									todo.progress === 100 ? 'red' : 'default'
								}`,
							}}
						>
							{todo.title}
						</h1>
						<p className="text-xs">{date}</p>
					</div>
				</div>
				<div className="h-4 w-2/6 bg-gray-300 rounded-2xl">
					<div
						className={`h-4 bg-green-300 rounded-2xl transition-all duration-500  ${barColor}`}
						style={{
							width: `${todo.progress}%`,
						}}
					></div>
				</div>
				<div className="flex items-center justify-end gap-2 w-1/6">
					<button>
						<Icon
							icon="mdi:file-edit-outline"
							className="text-green-500 text-xl"
							onClick={() => {
								openModal('edit'), handleEditTodo(todo.id);
							}}
						/>
					</button>
					<button>
						<Icon
							icon="bxs:trash"
							className="text-red-500 text-xl"
							onClick={() => handleDeleteTodo(todo.id)}
						/>
					</button>
				</div>
			</div>
			<div
				className={` relative  overflow-hidden transition-all duration-300 py-4`}
			>
				{isOpen ? (
					<Icon
						className={`absolute top-0 right-0  text-3xl cursor-pointer ${
							!todo.description?.length ? 'hidden ' : 'block'
						}`}
						icon="mdi:chevron-up"
						onClick={() => setIsOpen(!isOpen)}
					/>
				) : (
					<Icon
						className={`absolute top-0 right-0  text-3xl cursor-pointer ${
							!todo.description?.length ? 'hidden ' : 'block'
						}`}
						icon="mdi:chevron-down"
						onClick={() => setIsOpen(!isOpen)}
					/>
				)}

				<p
					className={` border overflow-hidden transition-all duration-300 whitespace-pre-wrap  px-8 mt-4 ${
						isOpen ? 'h-auto py-4' : 'h-0'
					}`}
				>
					{todo.description}
				</p>
			</div>
		</div>
	);
};

export default ListItem;
