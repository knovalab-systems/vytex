import { type RouteSectionProps, Router } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { Toaster } from 'solid-toast';
import './App.css';
import Routes from './Routes';
import { AuthProvider } from './hooks/useAuth';
import { ColorsProvider } from './hooks/useColors';
import { OrderStatusProvider } from './hooks/useOrderStatus';
import { SuppliersProvider } from './hooks/useSuppliers';
import { queryClient } from './lib/queryClient';

function App() {
	return (
		<Router
			root={(props: RouteSectionProps) => (
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<OrderStatusProvider>
							<SuppliersProvider>
								<ColorsProvider>{props.children}</ColorsProvider>
							</SuppliersProvider>
						</OrderStatusProvider>
						<Toaster />
					</AuthProvider>
				</QueryClientProvider>
			)}
		>
			<Routes />
		</Router>
	);
}

export default App;
