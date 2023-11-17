// import { Omit } from './path-to-your-utility-types';

export type TodoProps = {
	id: string;
	description:string,
	user_email: string;
	title: string;
	progress: number;
	createdat: string;
}
export type TodoAddProps = Omit<TodoProps, 'id' | 'user_email' | 'createdAt'>;

export type ModalProps = {
	mode: 'edit' | 'add' |'initial' | 'cancel' |'fetch';
	isOpen: boolean;
};

export type HandleModalProps = (title: ModalProps['mode']) => void;