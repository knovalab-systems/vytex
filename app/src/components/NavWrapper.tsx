import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlineApartment } from 'solid-icons/ai';
import { BsPersonWorkspace } from 'solid-icons/bs';
import { HiSolidTruck } from 'solid-icons/hi';
import { IoBandageSharp, IoColorPaletteSharp, IoExtensionPuzzleSharp, IoShirtSharp } from 'solid-icons/io';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesUserFill } from 'solid-icons/ri';
import { type JSXElement, Match, Show, Suspense, Switch, createEffect } from 'solid-js';
import Loading from '~/components/Loading';
import MenuNav from '~/components/MenuNav';
import MobileNav from '~/components/MobileNav';
import SideBarNav from '~/components/SideBarNav';
import * as PATHS from '~/constants/paths';
import { roles } from '~/constants/roles';
import * as ROLES from '~/envs/roles';
import { cn } from '~/lib/utils';
import { getMyUserQuery } from '~/requests/getMe';
import ErrorMessage from './ErrorMessage';

const baseClassMain = 'flex-1 m-2 overflow-auto';

function NavWrapper(props: RouteSectionProps) {
	const isRouting = useIsRouting();
	const user = createQuery(getMyUserQuery);

	const pages: Record<string, NavPages[]> = {
		[ROLES.ADMIN_ROLE]: [
			{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true },
			{ name: 'Usuarios', icon: () => <RiUserFacesUserFill size={24} />, path: PATHS.USERS_PATH },
			{ name: 'Roles', icon: () => <BsPersonWorkspace size={24} />, path: PATHS.ROLES_PATH },
			{ name: 'Proveedores', icon: () => <HiSolidTruck size={24} />, path: PATHS.SUPPLIERS_PATH },
			{ name: 'Telas', icon: () => <IoBandageSharp size={24} />, path: PATHS.FABRICS_PATH },
			{ name: 'Insumos', icon: () => <IoExtensionPuzzleSharp size={24} />, path: PATHS.RESOURCES_PATH },
		],
		[ROLES.DESIGNER_ROLE]: [
			{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true },
			{ name: 'Referencias', icon: () => <IoShirtSharp size={24} />, path: PATHS.REFS_PATH },
			{ name: 'Colores', icon: () => <IoColorPaletteSharp size={24} />, path: PATHS.COLORS_PATH },
			{ name: 'Telas', icon: () => <IoBandageSharp size={24} />, path: PATHS.FABRICS_PATH },
			{ name: 'Insumos', icon: () => <IoExtensionPuzzleSharp size={24} />, path: PATHS.RESOURCES_PATH },
		],
		[ROLES.PRO_SUPERVISOR_ROLE]: [
			{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true },
			{ name: 'Referencias', icon: () => <IoShirtSharp size={24} />, path: PATHS.REFS_PRO_SUPERVISOR_PATH },
			{ name: 'Ordenes', icon: () => <AiOutlineApartment size={24} />, path: PATHS.ORDERS_PATH },
		],
	};

	createEffect(() => {
		if (user.isSuccess) {
			document.documentElement.className = roles[user.data.role?.id as string].type || '';
		}
	});

	return (
		<Switch>
			<Match when={user.isError}>
				<ErrorMessage title='Error al cargar usuario' />
			</Match>
			<Match when={user.isPending}>
				<Loading label='Cargando rol' />
			</Match>
			<Match when={user.isSuccess && user.data.role?.id === ROLES.ADMIN_ROLE}>
				<div class='flex flex-col w-full h-fit lg:h-full lg:flex-row'>
					<SideBarNav pages={pages[ROLES.ADMIN_ROLE]} />
					<MobileNav pages={pages[ROLES.ADMIN_ROLE]} />
					<main class={cn(baseClassMain)}>
						<Suspense fallback={<Loading label='Cargando página' />}>
							{<Show when={!isRouting()}>{props.children}</Show>}
						</Suspense>
					</main>
				</div>
			</Match>
			<Match when={user.isSuccess && user.data.role?.id === ROLES.NO_ROLE}>{props.children}</Match>
			<Match when={user.isSuccess}>
				<div class='flex flex-col w-full h-fit lg:h-full'>
					<MenuNav pages={pages[user.data?.role?.id as string]} />
					<MobileNav pages={pages[user.data?.role?.id as string]} />
					<main class={cn(baseClassMain)}>
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
