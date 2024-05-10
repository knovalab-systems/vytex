import { Suspense } from 'solid-js';
import './App.css';
import { Router } from '@solidjs/router';
import { Toaster } from 'solid-toast';
import Routes from './routes/Routes';
import { QueryClientProvider } from '@tanstack/solid-query';
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
