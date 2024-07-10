import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { readMe } from '@vytex/client';
import { BsPersonWorkspace } from 'solid-icons/bs';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesUserFill } from 'solid-icons/ri';
import { type JSXElement, Match, Show, Suspense, Switch, createEffect } from 'solid-js';
import Loading from '~/components/Loading';
import MenuNav from '~/components/MenuNav';
import MobileNav from '~/components/MobileNav';
import SideBarNav from '~/components/SideBarNav';
import { client } from '~/lib/client';
import { ADMIN_ROLE, DESIGNER_ROLE, NO_ROLE } from '~/envs/roles';
import * as PATHS from '~/constants/paths';
import RoleRoot from '../../../hooks/roleRoot';

function NavWrapper(props: RouteSectionProps) {
	const { setRole } = RoleRoot;
	const isRouting = useIsRouting();
	const user = createQuery(() => ({
		queryFn: async () => client.request(readMe({ fields: ['role'] })),
		queryKey: ['role'],
	}));

	const pages: Record<string, NavPages[]> = {
		[ADMIN_ROLE]: [
			{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true },
			{ name: 'Usuarios', icon: () => <RiUserFacesUserFill size={24} />, path: PATHS.USERS_PATH },
			{ name: 'Roles', icon: () => <BsPersonWorkspace size={24} />, path: PATHS.ROLES_PATH },
		],
		[DESIGNER_ROLE]: [
			{ name: 'Home', icon: () => null, path: '/', end: true },
			{ name: 'Referencias', icon: () => null, path: PATHS.REFS_PATH },
			{ name: 'Colores', icon: () => null, path: PATHS.COLORS_PATH },
			{ name: 'Telas', icon: () => null, path: PATHS.FABRICS_PATH },
			{ name: 'Insumos', icon: () => null, path: PATHS.RESOURCES_PATH },
		],
	};

	createEffect(() => {
		if (user.isSuccess) {
			setRole(user.data?.role);
		}
	});

	return (
		<Switch>
			<Match when={user.isPending}>
				<Loading label='Cargando rol' />
			</Match>
			<Match when={user.isSuccess && user.data.role === ADMIN_ROLE}>
				<div class='flex flex-col w-full h-fit lg:h-full lg:flex-row'>
					<SideBarNav pages={pages[ADMIN_ROLE]} />
					<MobileNav pages={pages[ADMIN_ROLE]} />
					<main class='flex-1 m-2'>
						<Suspense fallback={<Loading label='Cargando página' />}>
							{<Show when={!isRouting()}>{props.children}</Show>}
						</Suspense>
					</main>
				</div>
			</Match>
			<Match when={user.isSuccess && user.data.role === NO_ROLE}>{props.children}</Match>
			<Match when={user.isSuccess}>
				<div class='flex flex-col w-full h-fit lg:h-full'>
					<MenuNav pages={pages[user.data?.role as string]} />
					<MobileNav pages={pages[user.data?.role as string]} />
					<main class='flex-1 m-2 overflow-auto'>
						<Suspense fallback={<Loading label='Cargando página' />}>
							{<Show when={!isRouting()}>{props.children}</Show>}
						</Suspense>
					</main>
				</div>
			</Match>
		</Switch>
	);
}

export interface NavPages {
	name: string;
	path: string;
	end?: boolean;
	icon: () => JSXElement;
}

export default NavWrapper;
