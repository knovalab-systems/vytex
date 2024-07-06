import { A } from '@solidjs/router';
import { IoLogoIonitron } from 'solid-icons/io';
import { For } from 'solid-js';
import LogoutMenuButton from '~/modules/auth/components/LogoutMenuButton';
import type { NavPages } from '~/modules/auth/components/NavWrapper';

function MenuNav(props: { pages: NavPages[] }) {
	return (
		<nav class='p-2 w-full hadow-md hidden shadow-md bg-slate-200 lg:flex lg:justify-between'>
			<div class='flex font-sans items-center text-center py-2 text-indigo-500 uppercase lg:text-xs 2xl:text-xl'>
				<IoLogoIonitron size={32} />
				<span class='ml-3'>Vytex</span>
			</div>
			<ul class='space-x-2 flex'>
				<For each={props.pages}>
					{page => (
						<li class='my-auto'>
							<A
								activeClass='text-indigo-500'
								inactiveClass='text-gray-600 '
								href={page.path}
								end={page.end}
								class='w-full my-auto p-3 font-semibold rounded-lg transition-colors duration-200 hover:text-gray-700 hover:shadow hover:bg-slate-300'
							>
								<span>{page.name}</span>
							</A>
						</li>
					)}
				</For>
				<li class='my-auto'>
					<LogoutMenuButton />
				</li>
			</ul>
		</nav>
	);
}

export default MenuNav;
