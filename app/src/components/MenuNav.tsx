import { A } from '@solidjs/router';
import { IoLogoIonitron } from 'solid-icons/io';
import { For } from 'solid-js';
import type { NavPages } from '~/types/navPages';
import LogoutMenuButton from './LogoutMenuButton';

function MenuNav(props: { pages: NavPages[] }) {
	return (
		<nav class='p-2 w-full hadow-md hidden shadow-md bg-slate-200 lg:flex lg:justify-between'>
			<div class='flex font-sans items-center text-center py-2 text-nav uppercase lg:text-xs 2xl:text-xl'>
				<IoLogoIonitron size={32} />
				<span class='ml-3'>Vytex</span>
			</div>
			<ul class='space-x-2 flex'>
				<For each={props.pages}>
					{page => (
						<li class='my-auto'>
							<A
								activeClass='bg-nav/70 text-fre text-nav-foreground '
								inactiveClass='text-gray-600 '
								href={page.path}
								end={page.end}
								class='w-full my-auto duration-300 p-3 font-bold rounded-lg transition-colors hover:shadow-md  hover:scale-105 hover:text-nav/80 hover:bg-slate-300'
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
