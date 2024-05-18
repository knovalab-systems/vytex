import { A } from '@solidjs/router';
import { IoLogoIonitron } from 'solid-icons/io';
import { For } from 'solid-js';
import LogoutNavButton from '~/modules/auth/components/LogoutNavButton';
import type { PropsPages } from './NavWrapper';

function SideBarNav(props: { pages: PropsPages[] }) {
	return (
		<nav class='w-1/8 p-2 bg-gray-900/95 h-full shadow-md shadow-gray-900 hidden lg:block'>
			<div class='flex font-sans items-center text-center py-2 text-white uppercase lg:text-xs 2xl:text-xl'>
				<IoLogoIonitron size={64} />
				<span class='ml-3'>Vytex</span>
			</div>
			<div class='my-2 bg-gray-600 h-[1px]' />
			<ul class='space-y-2'>
				<For each={props.pages}>
					{page => (
						<li>
							<A
								activeClass='bg-practice_date'
								href={page.path}
								end={page.end}
								class='w-full flex items-center group p-2 font-semibold text-sm rounded-lg text-white gap-1 transition-colors duration-200 hover:bg-practice_date'
							>
								{page.icon()}
								<span class='ml-3'>{page.name}</span>
								<div class='ml-auto w-1 rounded-xl h-8 bg-transparent transition-colors duration-200 relative overflow-hidden'>
									<span class='absolute top-0 left-0 w-full h-[102%] translate-y-full bg-white transition-all duration-300 group-hover:translate-y-0' />
								</div>
							</A>
						</li>
					)}
				</For>
				<li>
					<div class='my-2 bg-gray-600 h-[1px]' />
					<LogoutNavButton />
				</li>
			</ul>
		</nav>
	);
}

export default SideBarNav;
