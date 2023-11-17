import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import ListHeader from '../components/ListHeader';
import ListItem from '../components/ListItem';
import Modal from '../components/Modal';
import { TodoProps, ModalProps } from '../interfaces';
import Spinner from '../components/shared/Spinner';

function App() {
	const [cookies] = useCookies();
	const [todos, setTodos] = useState<TodoProps[]>([]);
	const [editTodo, setEditTodo] = useState<TodoProps>({} as TodoProps);
	const [loading, setLoading] = useState(true);
	const [modal, setModal] = useState<ModalProps>({
		mode: 'initial',
		isOpen: false,
	});

	const fetchData = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				`${import.meta.env.VITE_URL_SERVER}/todos/${cookies.email}`
			);
			setTodos(data);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const handleDeleteTodo = async (id: string) => {
		setLoading(true);
		try {
			await axios.delete(`${import.meta.env.VITE_URL_SERVER}/todos/${id}`);
			setModal((prev) => ({ ...prev, mode: 'initial' }));
			fetchData();
			toast.success('Your todo was deleted!!');
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};
	const handleEditTodo = (id: string) => {
		const todo = todos?.filter((item) => id === item.id);

		if (todo && modal.mode === 'edit') {
			setEditTodo(todo[0]);
			return;
		}
	};

	const openModal = (title: ModalProps['mode']) => {
		setModal((prev) => {
			return { mode: (prev.mode = title), isOpen: !prev.isOpen };
		});

		if (modal.mode === 'cancel') {
			setEditTodo({} as TodoProps);
			return;
		}
	};

	useEffect(() => {
		if (modal.mode === 'initial') {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modal.mode]);

	return (
		<>
			<div className="bg-white flex flex-col gap-8 border max-w-[800px] w-[90%] m-auto p-8 rounded-md shadow-md mt-14  ">
				<ListHeader title="My todo list" openModal={openModal} />

				{loading ? (
					<Spinner />
				) : todos?.length > 0 ? (
					todos.map((todo: TodoProps) => (
						<ListItem
							key={todo.id}
							todo={todo}
							openModal={openModal}
							handleEditTodo={handleEditTodo}
							handleDeleteTodo={handleDeleteTodo}
						/>
					))
				) : (
					<h1>No todos available.</h1>
				)}
				<Modal
					mode={modal.mode}
					openModal={openModal}
					isOpen={modal.isOpen}
					editTodo={editTodo}
				/>
			</div>
		</>
	);
}

export default App;
