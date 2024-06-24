import { A } from '@solidjs/router';
import { AiOutlineClose } from 'solid-icons/ai';
import { FiMenu } from 'solid-icons/fi';
import { createEffect, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import LogoutNavButton from '~/modules/auth/components/LogoutNavButton';
import type { NavPages } from '~/modules/auth/components/NavWrapper';
import { Button } from './ui/Button';

function MobileNav(props: { pages: NavPages[] }) {
	const [open, setOpen] = createSignal(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	createEffect(() => {
		if (open()) document.body.style.setProperty('overflow', 'hidden');
		else document.body.style.removeProperty('overflow');
	});

	return (
		<>
			<header class='sticky w-full top-0 bg-white z-30 shadow lg:hidden '>
				<Button variant={'ghost'} type='button' onClick={handleOpen} class='p-3 h-auto ripple-bg-white'>
					<FiMenu size={32} />
				</Button>
			</header>
			<Portal>
				<nav
					class={`transform top-0 left-0 w-full bg-white fixed h-full ease-in-out transition-all duration-300 z-30 lg:hidden ${
						open() ? 'translate-x' : '-translate-x-full'
					}`}
				>
					<ul class='p-4 space-y-2'>
						<li>
							<Button
								variant={'ghost'}
								class='w-full justify-start items-center gap-1 p-2 font-semibold text-lg rounded-lg'
								onClick={handleClose}
							>
								<AiOutlineClose size={24} />
								<span class='ml-3'>Cerrar</span>
							</Button>
							<div class='my-2 bg-gray-500 h-[1px]' />
						</li>
						{props.pages.map(page => (
							<li>
								<A
									href={page.path}
									end={page.end}
									onClick={handleClose}
									activeClass='bg-practice_date text-white'
									class='w-full flex items-center group p-2 font-semibold text-lg rounded-lg gap-1 transition-colors duration-200 hover:text-white hover:bg-practice_date hover:shadow'
								>
									{page.icon()}
									<span class='ml-3'>{page.name}</span>
									<div class='ml-auto w-1 rounded-xl h-8 bg-transparent transition-colors duration-200 relative overflow-hidden'>
										<span class='absolute top-0 left-0 w-full h-[102%] translate-y-full bg-white transition-all duration-300 group-hover:translate-y-0' />
									</div>
								</A>
							</li>
						))}
						<li class='text-black'>
							<div class='my-2 bg-gray-500 h-[1px]' />
							<LogoutNavButton class=' text-black text-lg hover:text-white' />
						</li>
					</ul>
				</nav>
			</Portal>
		</>
	);
}

export default MobileNav;
