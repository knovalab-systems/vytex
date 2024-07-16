import { type RouteSectionProps, Router } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { Toaster } from 'solid-toast';
import './App.css';
import { ColorsProvider } from './hooks/useColors';
import { SuppliersProvider } from './hooks/useSuppliers';
import { queryClient } from './lib/queryClient';
import Routes from './routes/Routes';

function App() {
	return (
		<Router
			root={(props: RouteSectionProps) => (
				<QueryClientProvider client={queryClient}>
					<SuppliersProvider>
						<ColorsProvider>{props.children}</ColorsProvider>
					</SuppliersProvider>
					<Toaster />
				</QueryClientProvider>
			)}
		>
			<Routes />
		</Router>
	);
}

export default App;
