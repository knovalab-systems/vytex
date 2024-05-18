import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import { BsPersonWorkspace } from 'solid-icons/bs';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesUserFill } from 'solid-icons/ri';
import { type JSXElement, Show, Suspense } from 'solid-js';
import Loading from './Loading';
import MobileNav from './MobileNav';
import SideBarNav from './SideBarNav';

function NavWrapper(props: RouteSectionProps) {
	const isRouting = useIsRouting();
	// pending for get role

	const pages: PropsPages[] = [
		{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true },
		{ name: 'Usuarios', icon: () => <RiUserFacesUserFill size={24} />, path: '/users' },
		{ name: 'Roles', icon: () => <BsPersonWorkspace size={24} />, path: '/roles' },
	];

	return (
		<div class='flex flex-col w-full h-fit lg:h-full lg:flex-row'>
			<SideBarNav pages={pages} />
			<MobileNav pages={pages} />
			<main class='flex-1 m-2'>
				<Suspense fallback={<Loading label='Cargando página' />}>
					{<Show when={!isRouting()}>{props.children}</Show>}
				</Suspense>
			</main>
		</div>
	);
}

export interface PropsPages {
	name: string;
	path: string;
	end?: boolean;
	icon: () => JSXElement;
}

export default NavWrapper;
