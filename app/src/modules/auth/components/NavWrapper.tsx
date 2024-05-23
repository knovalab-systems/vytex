import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { readMe } from '@vytex/client';
import { BsPersonWorkspace } from 'solid-icons/bs';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesUserFill } from 'solid-icons/ri';
import { type JSXElement, Match, Show, Suspense, Switch, createEffect, lazy } from 'solid-js';
import Loading from '~/components/Loading';
import MobileNav from '~/components/MobileNav';
import { client } from '~/utils/client';
import { ADMIN_ROLE } from '~/utils/env';
import * as PATHS from '~/utils/paths';
import RoleRoot from './RoleRoot';

const SideBarNav = lazy(() => import('~/components/SideBarNav'));

function NavWrapper(props: RouteSectionProps) {
	const { setRole } = RoleRoot;
	const isRouting = useIsRouting();
	const user = createQuery(() => ({
		queryFn: async () => client.request(readMe()),
		queryKey: ['role'],
	}));

	const pages: Record<string, NavPages[]> = {
		[ADMIN_ROLE]: [
			{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true },
			{ name: 'Usuarios', icon: () => <RiUserFacesUserFill size={24} />, path: PATHS.USERS_PATH },
			{ name: 'Roles', icon: () => <BsPersonWorkspace size={24} />, path: PATHS.ROLES_PATH },
		],
	};

	createEffect(() => {
		if (user.isSuccess) {
			setRole(user.data?.role);
		}
	});

	return (
		<div class='flex flex-col w-full h-fit lg:h-full lg:flex-row'>
			<Switch>
				<Match when={user.isSuccess && user.data.role === ADMIN_ROLE}>
					<SideBarNav pages={pages[ADMIN_ROLE]} />
					<MobileNav pages={pages[ADMIN_ROLE]} />
					<main class='flex-1 m-2'>
						<Suspense fallback={<Loading label='Cargando página' />}>
							{<Show when={!isRouting()}>{props.children}</Show>}
						</Suspense>
					</main>
				</Match>
				<Match when={user.isSuccess}>
					<SideBarNav pages={[]} />
					<MobileNav pages={[]} />
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
