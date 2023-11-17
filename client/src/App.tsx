import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import Authentication from './pages/Authentication';

function App() {
	const [cookies] = useCookies();
	const [isAuthToken, setIsAuthToken] = useState(false);

	useEffect(() => {
		if (cookies.authToken) {
			setIsAuthToken(true);
		} else {
			setIsAuthToken(false);
		}
	}, [cookies]);

	return (
		<>
			<ToastContainer />
			{!isAuthToken ? <Authentication /> : <Home />}
		</>
	);
}

export default App;
