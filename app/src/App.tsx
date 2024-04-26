import { Suspense } from 'solid-js';
import './App.css';
import { Router } from '@solidjs/router';
import { Toaster } from 'solid-toast';
import Routes from './routes/Routes';

function App() {
	return (
		<Suspense>
			<Router>
				<Routes />
			</Router>
			<Toaster />
		</Suspense>
	);
}

export default App;
