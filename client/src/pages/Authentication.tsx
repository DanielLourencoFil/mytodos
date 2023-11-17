import { useState, MouseEvent } from 'react';
import { Icon } from '@iconify/react';
import axios, { AxiosError } from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import Spinner from '../components/shared/Spinner';
import emailValidation from '../utils/emailValidation';

type UserProps = {
	email: string;
	password: string;
	passwordConfirmation: string;
};

type ErrorProps = {
	email: string;
	password: string;
	passwordConfirmation: string;
};

function Authentication() {
	const errosDefault: ErrorProps = {
		email: '',
		password: '',
		passwordConfirmation: '',
	};
	const userDefault: UserProps = {
		email: '',
		password: '',
		passwordConfirmation: '',
	};

	const [cookies, setCookies] = useCookies();
	const [user, setUser] = useState<UserProps>(userDefault);
	const [mode, setMode] = useState<'login' | 'signup'>('login');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<ErrorProps>(errosDefault);
	const [isShowPassword, setIsShowPassword] = useState({
		password: false,
		passwordConfirmation: false,
	});
	const [isActive, setIsActive] = useState({
		passwordInput: false,
		passwordConfirmationInput: false,
		submitBtn: true,
	});

	const fetchUser = async (endPoint: string, authData: UserProps) => {
		setIsLoading(true);
		console.log(isLoading);

		try {
			const { data } = await axios.post(
				`${import.meta.env.VITE_URL_SERVER}/${endPoint}`,
				{
					...authData,
				}
			);
			setCookies('email', data.email);
			setCookies('authToken', data.token);
			// window.location.reload();
			endPoint === 'signup' && toast.success('User was registred successfuly!');
			setUser(userDefault);
			setMode('login');
		} catch (errorAxios: unknown) {
			console.log(errorAxios);
			const err = errorAxios as AxiosError;

			setError({ ...error, email: err?.response?.data.message });
		} finally {
			setIsLoading(false);
		}
	};

	const handleInput = (e: EventTarget & HTMLInputElement) => {
		if (mode === 'login') {
			setUser((prev) => {
				const user = {
					...prev,
					[e.name]: e.value,
				};
				if (user.email.length > 0 && user.password.length >= 6) {
					setIsActive({ ...isActive, submitBtn: false });
				} else {
					setIsActive({ ...isActive, submitBtn: true });
				}

				return user;
			});
		}

		if (mode === 'signup') {
			setUser((prev) => {
				const newUser = {
					...prev,
					[e.name]: e.value,
				};
				if (
					newUser.email.length > 0 &&
					newUser.password.length > 0 &&
					newUser.passwordConfirmation.length > 0
				) {
					setIsActive({ ...isActive, submitBtn: false });
				} else {
					setIsActive({ ...isActive, submitBtn: true });
				}

				return newUser;
			});
		}
	};

	const handleSubmit = (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
	) => {
		e.preventDefault();
		if (mode === 'login') {
			//API goes here
			const { email, password } = user;
			fetchUser('login', { email, password } as UserProps);
			console.log('login');

			// 'This email is already in use'
		}

		if (mode === 'signup') {
			setError(errosDefault);
			const isValidEmail = emailValidation(user.email);
			const isValidPassword = user.password === user.passwordConfirmation;
			console.log(emailValidation(user.email));

			// useState is async, so is necessary to calc the all conditions before invoque setErro()
			const errorsSignupHandle = () => {
				const errorsUpdate = {} as ErrorProps;
				let isErros = false;

				if (!isValidEmail) {
					isErros = true;
					errorsUpdate.email = 'Email format not valid';
				}
				if (!isValidPassword) {
					isErros = true;
					errorsUpdate.passwordConfirmation =
						'Password and confirmation not match';
				}
				// TODO = IMPLEMENTATION of better password validation latter: must include number and letters, uppercase and special chars (@#$) and mix-max lenghts
				if (user.password.length < 6) {
					isErros = true;
					errorsUpdate.password =
						'Your password must be at least 6 characters long';
				}
				setError((prev) => ({ ...prev, ...errorsUpdate }));
				return isErros;
			};

			if (!errorsSignupHandle()) {
				const { email, password } = user;
				fetchUser('signup', { email, password } as UserProps);
			}
		}
	};

	return (
		<div className="h-screen w-screen flex items-center justify-center bg-gray-200">
			<div className="relative flex flex-col gap-4  bg-white shadow-md shadow-[rgba(0,0,0,0.5)] rounded-md  w-3/5 max-w-xl">
				<form action="submit" className="p-12  flex flex-col gap-8">
					<h1 className="text-2xl font-semibold mb-2 capitalize">
						{mode === 'login' ? 'Please log in' : 'Please sign up'}
					</h1>
					{/* EMAIL */}
					<div>
						<input
							type="email"
							name="email"
							value={user.email}
							placeholder="Your email"
							onChange={(e) => handleInput(e.target)}
							onFocus={() => setError({ ...error, email: '' })}
							className="border w-full rounded-md py-1 px-2 border-gray-400 focus:outline-gray-500"
						/>
						<p className="text-red-500 text-sm mt-1 h-4">{error.email}</p>
					</div>
					{/* PASSWORD */}
					<div>
						<div
							className={`border flex items-center justify-between w-full rounded-md border-gray-400   ${
								isActive.passwordInput
									? 'outline outline-gray-500 outline-1'
									: ''
							}`}
						>
							<input
								type={isShowPassword.password ? 'text' : 'password'}
								name="password"
								placeholder="Your password"
								value={user.password}
								onChange={(e) => handleInput(e.target)}
								onBlur={() =>
									setIsActive({ ...isActive, passwordInput: false })
								}
								onClick={() => {
									setIsActive({ ...isActive, passwordInput: true }),
										setError({ ...error, password: '' });
								}}
								className="py-1 px-2 rounded-md focus:outline-none flex-1"
							/>
							{/* SHOW ICONS */}
							<div className="py-1 px-2 cursor-pointer ">
								{isShowPassword.password ? (
									<Icon
										icon="ph:eye-slash-duotone"
										onClick={() =>
											setIsShowPassword({
												...isShowPassword,
												password: !isShowPassword.password,
											})
										}
									/>
								) : (
									<Icon
										icon="ph:eye-duotone"
										onClick={() =>
											setIsShowPassword({
												...isShowPassword,
												password: !isShowPassword.password,
											})
										}
									/>
								)}
							</div>
						</div>
						<p className="text-red-500 text-sm mt-1 h-4">{error.password}</p>
					</div>

					{/* PASSWORD CONFIRMATION */}
					{mode === 'signup' && (
						<div>
							<div
								className={`border flex items-center justify-between w-full rounded-md border-gray-400   ${
									isActive.passwordConfirmationInput
										? 'outline outline-gray-500 outline-1'
										: ''
								}`}
							>
								<input
									type={
										isShowPassword.passwordConfirmation ? 'text' : 'password'
									}
									name="passwordConfirmation"
									value={user.passwordConfirmation}
									placeholder="Repeat your password"
									onChange={(e) => handleInput(e.target)}
									onBlur={() =>
										setIsActive({
											...isActive,
											passwordConfirmationInput: false,
										})
									}
									onClick={() => {
										setIsActive({
											...isActive,
											passwordConfirmationInput: true,
										}),
											setError({ ...error, passwordConfirmation: '' });
									}}
									className="py-1 px-2 rounded-md focus:outline-none flex-1"
								/>

								{/* SHOW ICONS */}
								<div className="py-1 px-2 cursor-pointer ">
									{isShowPassword.passwordConfirmation ? (
										<Icon
											icon="ph:eye-slash-duotone"
											onClick={() =>
												setIsShowPassword({
													...isShowPassword,
													passwordConfirmation:
														!isShowPassword.passwordConfirmation,
												})
											}
										/>
									) : (
										<Icon
											icon="ph:eye-duotone"
											onClick={() =>
												setIsShowPassword({
													...isShowPassword,
													passwordConfirmation:
														!isShowPassword.passwordConfirmation,
												})
											}
										/>
									)}
								</div>
							</div>
							<p className="text-red-500 text-sm mt-1 h-4">
								{error.passwordConfirmation}
							</p>
						</div>
					)}
					{/* SUBMIT BTN */}
					<button
						type="submit"
						onClick={(e) => handleSubmit(e)}
						className={`bg-gray-300 rounded-md p-2 uppercase text-sm font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center `}
						disabled={isActive.submitBtn}
					>
						{!isLoading ? 'submit' : <Spinner size={4} />}
					</button>
				</form>
				{/* SIGN UP AND LOGIN BUTTONS */}
				<div className="mt-auto flex justify-between ">
					<button
						className={`capitalize  rounded-bl-md flex-1 p-2 transition-all duration-500 cursor-pointer ${
							mode !== 'login'
								? 'text-gray-300 bg-gray-700'
								: 'text-gray-700  bg-gray-300'
						}`}
						onClick={() => (
							setMode('signup'), setUser(userDefault), setError(errosDefault)
						)}
					>
						sign up
					</button>
					<button
						className={`capitalize  rounded-br-md flex-1 p-2 transition-all duration-500 cursor-pointer ${
							mode === 'login'
								? 'text-gray-300 bg-gray-700'
								: 'text-gray-700  bg-gray-300'
						}`}
						onClick={() => (
							setMode('login'), setUser(userDefault), setError(errosDefault)
						)}
					>
						login
					</button>
				</div>
			</div>
		</div>
	);
}

export default Authentication;

// import { useState, useEffect, MouseEvent } from 'react';
// import { Icon } from '@iconify/react';
// import axios, { AxiosError } from 'axios';

// type UserProps = {
// 	email: string;
// 	password: string;
// };

// type NewUserProps = UserProps & {
// 	passwordConfirmation: string;
// };

// type ErrorProps = {
// 	email: string;
// 	password: string;
// 	passwordConfirmation: string;
// };

// function Authentication() {
// 	const errosDefault = {
// 		email: '',
// 		password: '',
// 		passwordConfirmation: '',
// 	};
// 	const newUserDefault: NewUserProps = {
// 		email: '',
// 		password: '',
// 		passwordConfirmation: '',
// 	};
// 	const userDefault: UserProps = {
// 		email: '',
// 		password: '',
// 	};
// 	const [newUser, setNewUser] = useState<NewUserProps>(newUserDefault);
// 	// const [user, setUser] = useState<UserProps>(userDefault);

// 	const [mode, setMode] = useState<'login' | 'signup'>('login');
// 	const [error, setError] = useState<ErrorProps>(errosDefault);
// 	const [isShowPassword, setIsShowPassword] = useState({
// 		password: false,
// 		passwordConfirmation: false,
// 	});
// 	const [isActive, setIsActive] = useState({
// 		passwordInput: false,
// 		passwordConfirmationInput: false,
// 		submitBtn: true,
// 	});

// 	const fetchUser = async (
// 		endPoint: string,
// 		authData: NewUserProps | UserProps
// 	) => {
// 		try {
// 			await axios.post(`${import.meta.env.VITE_URL_SERVER}/${endPoint}`, {
// 				...authData,
// 			});
// 		} catch (errorAxios: unknown) {
// 			console.log(errorAxios);
// 			const err = errorAxios as AxiosError;
// 			if (err.response && err.response.request.status === 400) {
// 				const errorMessage = 'user is already registred';
// 				setError({ ...error, email: errorMessage });
// 			}
// 		}
// 	};

// 	const handleInput = (e: EventTarget & HTMLInputElement) => {
// 		if (mode === 'login') {
// 			setUser((prev) => {
// 				const user = {
// 					...prev,
// 					[e.name]: e.value,
// 				};
// 				if (user.email.length > 0 && user.password.length >= 6) {
// 					setIsActive({ ...isActive, submitBtn: false });
// 				} else {
// 					setIsActive({ ...isActive, submitBtn: true });
// 				}

// 				return user;
// 			});
// 		}

// 		if (mode === 'signup') {
// 			setNewUser((prev) => {
// 				const newUser = {
// 					...prev,
// 					[e.name]: e.value,
// 				};
// 				if (
// 					newUser.email.length > 0 &&
// 					newUser.password.length > 0 &&
// 					newUser.passwordConfirmation.length > 0
// 				) {
// 					setIsActive({ ...isActive, submitBtn: false });
// 				} else {
// 					setIsActive({ ...isActive, submitBtn: true });
// 				}

// 				return newUser;
// 			});
// 		}
// 	};

// 	const handleSubmit = (
// 		e: MouseEvent<HTMLInputElement, globalThis.MouseEvent>
// 	) => {
// 		e.preventDefault();
// 		if (mode === 'login') {
// 			//API goes here
// 			fetchUser('login', user);
// 			console.log('login');

// 			// 'This email is already in use'
// 		}

// 		if (mode === 'signup') {
// 			setError(errosDefault);
// 			const isValidEmail =
// 				newUser.email.includes('@') && newUser.email.includes('.');
// 			const isValidPassword = newUser.password === newUser.passwordConfirmation;

// 			// useState is async, so is necessary to calc the all conditions before invoque setErro()
// 			const errorsSignupHandle = () => {
// 				const errorsUpdate = {} as ErrorProps;
// 				let isErros = false;

// 				if (!isValidEmail) {
// 					isErros = true;
// 					errorsUpdate.email = 'Email format not valid';
// 				}
// 				if (!isValidPassword) {
// 					isErros = true;
// 					errorsUpdate.passwordConfirmation =
// 						'Password and confirmation not match';
// 				}
// 				// TODO = IMPLEMENTATION of better password validation latter: must include number and letters, uppercase and special chars (@#$)
// 				if (newUser.password.length < 6) {
// 					isErros = true;
// 					errorsUpdate.password =
// 						'Your password must be at least 6 characters long';
// 				}
// 				setError((prev) => ({ ...prev, ...errorsUpdate }));
// 				return isErros;
// 			};
// 			if (!errorsSignupHandle()) {
// 				const { email, password } = newUser;
// 				fetchUser('signup', { email, password });
// 			}
// 		}
// 	};

// 	return (
// 		<div className="h-screen w-screen flex items-center justify-center bg-gray-200">
// 			<div className="relative flex flex-col gap-4  bg-white shadow-md shadow-[rgba(0,0,0,0.5)] rounded-md  w-3/5 max-w-xl">
// 				<form action="submit" className="p-12  flex flex-col gap-8">
// 					<h1 className="text-2xl font-semibold mb-2 capitalize">
// 						{mode === 'login' ? 'Please log in' : 'Please sign up'}
// 					</h1>
// 					{/* EMAIL */}
// 					<div>
// 						<input
// 							type="email"
// 							name="email"
// 							value={mode === 'login' ? user.email : newUser.email}
// 							placeholder="Your email"
// 							onChange={(e) => handleInput(e.target)}
// 							onFocus={() => setError({ ...error, email: '' })}
// 							className="border w-full rounded-md py-1 px-2 border-gray-400 focus:outline-gray-500"
// 						/>
// 						<p className="text-red-500 text-sm mt-1 h-4">{error.email}</p>
// 					</div>
// 					{/* PASSWORD */}
// 					<div>
// 						<div
// 							className={`border flex items-center justify-between w-full rounded-md border-gray-400   ${
// 								isActive.passwordInput
// 									? 'outline outline-gray-500 outline-1'
// 									: ''
// 							}`}
// 						>
// 							<input
// 								type={isShowPassword.password ? 'text' : 'password'}
// 								name="password"
// 								placeholder="Your password"
// 								value={mode === 'login' ? user.password : newUser.password}
// 								onChange={(e) => handleInput(e.target)}
// 								onBlur={() =>
// 									setIsActive({ ...isActive, passwordInput: false })
// 								}
// 								onClick={() => {
// 									setIsActive({ ...isActive, passwordInput: true }),
// 										setError({ ...error, password: '' });
// 								}}
// 								className="py-1 px-2 rounded-md focus:outline-none flex-1"
// 							/>
// 							{/* SHOW ICONS */}
// 							<div className="py-1 px-2 cursor-pointer ">
// 								{isShowPassword.password ? (
// 									<Icon
// 										icon="ph:eye-slash-duotone"
// 										onClick={() =>
// 											setIsShowPassword({
// 												...isShowPassword,
// 												password: !isShowPassword.password,
// 											})
// 										}
// 									/>
// 								) : (
// 									<Icon
// 										icon="ph:eye-duotone"
// 										onClick={() =>
// 											setIsShowPassword({
// 												...isShowPassword,
// 												password: !isShowPassword.password,
// 											})
// 										}
// 									/>
// 								)}
// 							</div>
// 						</div>
// 						<p className="text-red-500 text-sm mt-1 h-4">{error.password}</p>
// 					</div>

// 					{/* PASSWORD CONFIRMATION */}
// 					{mode === 'signup' && (
// 						<div>
// 							<div
// 								className={`border flex items-center justify-between w-full rounded-md border-gray-400   ${
// 									isActive.passwordConfirmationInput
// 										? 'outline outline-gray-500 outline-1'
// 										: ''
// 								}`}
// 							>
// 								<input
// 									type={
// 										isShowPassword.passwordConfirmation ? 'text' : 'password'
// 									}
// 									name="passwordConfirmation"
// 									value={newUser.passwordConfirmation}
// 									placeholder="Repeat your password"
// 									onChange={(e) => handleInput(e.target)}
// 									onBlur={() =>
// 										setIsActive({
// 											...isActive,
// 											passwordConfirmationInput: false,
// 										})
// 									}
// 									onClick={() => {
// 										setIsActive({
// 											...isActive,
// 											passwordConfirmationInput: true,
// 										}),
// 											setError({ ...error, passwordConfirmation: '' });
// 									}}
// 									className="py-1 px-2 rounded-md focus:outline-none flex-1"
// 								/>

// 								{/* SHOW ICONS */}
// 								<div className="py-1 px-2 cursor-pointer ">
// 									{isShowPassword.passwordConfirmation ? (
// 										<Icon
// 											icon="ph:eye-slash-duotone"
// 											onClick={() =>
// 												setIsShowPassword({
// 													...isShowPassword,
// 													passwordConfirmation:
// 														!isShowPassword.passwordConfirmation,
// 												})
// 											}
// 										/>
// 									) : (
// 										<Icon
// 											icon="ph:eye-duotone"
// 											onClick={() =>
// 												setIsShowPassword({
// 													...isShowPassword,
// 													passwordConfirmation:
// 														!isShowPassword.passwordConfirmation,
// 												})
// 											}
// 										/>
// 									)}
// 								</div>
// 							</div>
// 							<p className="text-red-500 text-sm mt-1 h-4">
// 								{error.passwordConfirmation}
// 							</p>
// 						</div>
// 					)}
// 					<input
// 						type="submit"
// 						value="submit"
// 						onClick={(e) => handleSubmit(e)}
// 						className={`bg-gray-300 rounded-md p-2 uppercase text-sm font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-60`}
// 						disabled={isActive.submitBtn}
// 					/>
// 				</form>
// 				{/* SIGN UP AND LOGIN BUTTONS */}
// 				<div className="mt-auto flex justify-between ">
// 					<button
// 						className={`capitalize  rounded-bl-md flex-1 p-2 transition-all duration-500 cursor-pointer ${
// 							mode !== 'login'
// 								? 'text-gray-300 bg-gray-700'
// 								: 'text-gray-700  bg-gray-300'
// 						}`}
// 						onClick={() => (
// 							setMode('signup'),
// 							setNewUser(newUserDefault),
// 							setError(errosDefault)
// 						)}
// 					>
// 						sign up
// 					</button>
// 					<button
// 						className={`capitalize  rounded-br-md flex-1 p-2 transition-all duration-500 cursor-pointer ${
// 							mode === 'login'
// 								? 'text-gray-300 bg-gray-700'
// 								: 'text-gray-700  bg-gray-300'
// 						}`}
// 						onClick={() => (
// 							setMode('login'), setUser(userDefault), setError(errosDefault)
// 						)}
// 					>
// 						login
// 					</button>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default Authentication;
