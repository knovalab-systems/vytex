import { Suspense, Show } from 'solid-js';
import Loading from './Loading';
import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import SideBarNav from './SideBarNav';

function NavWrapper(props: RouteSectionProps) {
	const isRouting = useIsRouting();
	// pending for get role

	return (
		<>
			<SideBarNav />
			<main class='flex-1 m-2 overflow-auto'>
				<Suspense fallback={<Loading label='Cargando página' />}>
					{<Show when={!isRouting()}>{props.children}</Show>}
				</Suspense>
			</main>
		</>
	);
}

export default NavWrapper;
