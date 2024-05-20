import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import { BsPersonWorkspace } from 'solid-icons/bs';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesUserFill } from 'solid-icons/ri';
import { type JSXElement, Show, Suspense, lazy, Switch, Match } from 'solid-js';
import Loading from './Loading';
import { createQuery } from '@tanstack/solid-query';
import { client } from '~/utils/client';
import { readMe } from '@vytex/client';
import { ADMIN_ROLE } from '~/utils/env';
import MobileNav from './MobileNav';

const SideBarNav = lazy(() => import('./SideBarNav'));

function NavWrapper(props: RouteSectionProps) {
	const isRouting = useIsRouting();
	const role = createQuery(() => ({
		queryFn: async () => client.request(readMe()),
		queryKey: ['role'],
	}));

	const pages: Record<string, NavPages[]> = {
		[ADMIN_ROLE]: [
			{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true },
			{ name: 'Usuarios', icon: () => <RiUserFacesUserFill size={24} />, path: '/users' },
			{ name: 'Roles', icon: () => <BsPersonWorkspace size={24} />, path: '/roles' },
		],
	};

	return (
		<div class='flex flex-col w-full h-fit lg:h-full lg:flex-row'>
			<Switch>
				<Match when={role.isSuccess && role.data.role === ADMIN_ROLE}>
					<SideBarNav pages={pages[role.data?.role]} />
					<MobileNav pages={pages[role.data?.role]} />
					<main class='flex-1 m-2'>
						<Suspense fallback={<Loading label='Cargando página' />}>
							{<Show when={!isRouting()}>{props.children}</Show>}
						</Suspense>
					</main>
				</Match>
				<Match when={role.isSuccess}>
					<div>{'empty' /** temporal*/}</div>
				</Match>
			</Switch>
		</div>
	);
}

export interface NavPages {
	name: string;
	path: string;
	end?: boolean;
	icon: () => JSXElement;
}

export default NavWrapper;
