import { Router } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { Suspense } from 'solid-js';
import { Toaster } from 'solid-toast';
import './App.css';
import Routes from './routes/Routes';
import { queryClient } from './utils/queryClient';

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Suspense>
				<Router>
					<Routes />
				</Router>
				<Toaster />
			</Suspense>
		</QueryClientProvider>
	);
}

export default App;
