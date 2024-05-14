import { A } from '@solidjs/router';
import { IoLogoIonitron } from 'solid-icons/io';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesUserFill } from 'solid-icons/ri';
import { For } from 'solid-js';
import LogoutNavButton from '~/modules/auth/components/LogoutNavButton';

function SideBarNav() {
	const pages = [
		{ name: 'Home', icon: <OcHomefill3 size={24} />, path: '/', end: true },
		{ name: 'Usuarios', icon: <RiUserFacesUserFill size={24} />, path: '/users' },
	];

	return (
		<nav class=' w-1/8 p-2 bg-gray-900/95 h-full shadow-md shadow-gray-900 hidden lg:block'>
			<div class='flex font-sans lg:text-xs 2xl:text-xl items-center text-center py-2 text-white uppercase'>
				<IoLogoIonitron size={64} />
				<span class='ml-3'>Vytex</span>
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
								class='w-full flex items-center group p-2 font-semibold text-sm rounded-lg text-white hover:bg-practice_date  gap-1 p transition-colors duration-200'
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
					<LogoutNavButton />
				</li>
			</ul>
		</nav>
	);
}

export default SideBarNav;
