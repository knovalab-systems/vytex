import LogoutButton from '~/components/LogoutButton';

function Home() {
	return (
		<div class='flex flex-col h-full justify-between'>
			<nav class='p-6'>
				<div class='flex items-center justify-between'>
					<div class='text-white text-2xl' />
					<LogoutButton navigateTo='/login' />
				</div>
			</nav>
			<div class='mb-auto ...'>
				<div class='container mx-auto p-4'>
					<h1 class='text-4xl font-bold text-center'>Home</h1>
					<p class='text-lg text-center'>Welcome to the temporally home page</p>
				</div>
			</div>
		</div>
	);
}

export default Home;
