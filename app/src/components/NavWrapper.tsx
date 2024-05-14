import { Suspense, Show } from 'solid-js';
import Loading from './Loading';
import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import SideBarNav from './SideBarNav';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesUserFill } from 'solid-icons/ri';

function NavWrapper(props: RouteSectionProps) {
	const isRouting = useIsRouting();
	// pending for get role

	const pages = [
		{ name: 'Home', icon: <OcHomefill3 size={24} />, path: '/', end: true },
		{ name: 'Usuarios', icon: <RiUserFacesUserFill size={24} />, path: '/users' },
	];

	return (
		<>
			<SideBarNav pages={pages} />
			<main class='flex-1 m-2 overflow-auto'>
				<Suspense fallback={<Loading label='Cargando página' />}>
					{<Show when={!isRouting()}>{props.children}</Show>}
				</Suspense>
			</main>
		</>
	);
}

export default NavWrapper;
