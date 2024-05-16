import { type RouteSectionProps, Router } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { lazy } from 'solid-js';
import { Toaster } from 'solid-toast';
import './App.css';
import { queryClient } from './utils/queryClient';

const Routes = lazy(() => import('~/routes/Routes'));

function App() {
	return (
		<Router
			root={(props: RouteSectionProps) => (
				<QueryClientProvider client={queryClient}>
					{props.children}
					<Toaster />
				</QueryClientProvider>
			)}
		>
			<Routes />
		</Router>
	);
}

export default App;
