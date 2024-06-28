import { type RouteSectionProps, Router } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { Toaster } from 'solid-toast';
import './App.css';
import { queryClient } from './lib/queryClient';
import Routes from './routes/Routes';
import { ColorProvider } from './hooks/useColor';

function App() {
	return (
		<Router
			root={(props: RouteSectionProps) => (
				<QueryClientProvider client={queryClient}>
					<ColorProvider>{props.children}</ColorProvider>
					<Toaster />
				</QueryClientProvider>
			)}
		>
			<Routes />
		</Router>
	);
}

export default App;
