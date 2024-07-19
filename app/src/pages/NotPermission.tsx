import LogoutNavButton from '~/modules/auth/components/LogoutNavButton';

function NotPermission() {
	return (
		<main class='h-full flex-1 px-8 flex'>
			<div class='flex m-auto flex-col items-center justify-center gap-6 p-8 bg-white rounded-md border border-gray-100 shadow-xl'>
				<p class='text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300'>401</p>
				<p class='text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500  text-center'>
					No tienes permisos
				</p>
				<p class='text-gray-500 pb-3 border-b-2 text-center'>No tienes un rol, contacta con el administrador.</p>
				<div
					class='flex items-center text-white space-x-2 px-4 py-2 rounded transition duration-150 bg-blue-500 shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-700/40'
					title='Cerrar sesión'
				>
					<LogoutNavButton class='hover:bg-transparent *:ml-auto' />
				</div>
			</div>
		</main>
	);
}

export default NotPermission;
