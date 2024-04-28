import { useNavigate } from '@solidjs/router';
import { Button } from '~/components/ui/button';
import { singOut } from '~/modules/auth/requests/logoutRequests';

function Home() {
	const navigate = useNavigate();

	const logout = () => {
		singOut()
			.then(() => {
				navigate('/login', { replace: true });
			})
			.catch(error => {
				console.error(error);
			});
	};

	return (
		<div class="flex flex-col h-screen justify-between">
			<nav class="bg-blue-500 p-6">
				<div class="flex items-center justify-between">
					<div class="text-white text-2xl">Vytex</div>
					<Button
						variant="default"
						onClick={logout}
						class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					>
						Logout
					</Button>
				</div>
			</nav>
			<div class="mb-auto ...">
				<div class="container mx-auto p-4">
					<h1 class="text-4xl font-bold text-center">Home</h1>
					<p class="text-lg text-center">Welcome to the temporally home page</p>
				</div>
			</div>
		</div>
	);
}

export default Home;
