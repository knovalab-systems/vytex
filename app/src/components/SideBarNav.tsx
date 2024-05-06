import { For, children, type JSXElement } from 'solid-js';
import { A } from '@solidjs/router';
import { RiUserFacesUserFill, RiSystemLogoutBoxLine } from 'solid-icons/ri';
import { OcHomefill3 } from 'solid-icons/oc';
import { IoLogoIonitron } from 'solid-icons/io';

function SideBarNav(props: { children?: JSXElement }) {
	const c = children(() => props.children);
	const pages = [
		{ name: 'Home', icon: <OcHomefill3 size={24} />, path: '/', end: true },
		{ name: 'Usuarios', icon: <RiUserFacesUserFill size={24} />, path: '/users' },
	];

	return (
		<div class='h-full w-full flex flex-no-wrap'>
			<nav class=' w-1/8 p-2 bg-gray-900/95 h-full shadow-md shadow-gray-900'>
				<div class='flex font-sans lg:text-xs 2xl:text-xl items-center text-center py-2 text-white uppercase'>
					<IoLogoIonitron size={64} />
					<span class='ml-3'> Vytex</span>
				</div>
				<div class='my-2 bg-gray-600 h-[1px]' />
				<ul class='space-y-2'>
					<For each={pages}>
						{page => (
							<li>
								<A
									activeClass='bg-practice_date'
									href={page.path}
									end={page.end}
									class='w-full flex items-center group  p-2 font-semibold text-sm rounded-lg text-white hover:bg-practice_date dark:hover:bg-gray-700 gap-1 p transition-colors duration-200'
								>
									{page.icon}
									<span class='ml-3'>{page.name}</span>
									<div class='ml-auto w-1 rounded-xl h-8 bg-transparent transition-colors duration-200 relative overflow-hidden'>
										<span class='absolute top-0 left-0 w-full h-[102%] translate-y-full group-hover:translate-y-0 bg-white transition-all duration-300' />
									</div>
								</A>
							</li>
						)}
					</For>
					<div class='my-2 bg-gray-600 h-[1px]' />
					<li>
						<A
							activeClass='bg-practice_date'
							href={'/logout'}
							class='w-full flex items-center group  p-2 font-semibold text-sm rounded-lg text-white hover:bg-practice_date dark:hover:bg-gray-700 gap-1 p transition-colors duration-200'
							inactiveClass='text-gray-400'
						>
							<RiSystemLogoutBoxLine size={24} />
							<span class='ml-3'>Cerrar sesión</span>
							<div class='ml-auto w-1 rounded-xl h-8 bg-transparent transition-colors duration-200 relative overflow-hidden'>
								<span class='absolute top-0 left-0 w-full h-[102%] translate-y-full group-hover:translate-y-0 bg-white transition-all duration-300' />
							</div>
						</A>
					</li>
				</ul>
			</nav>
			<main class='flex-1 m-2'>{c()}</main>
		</div>
	);
}

export default SideBarNav;
