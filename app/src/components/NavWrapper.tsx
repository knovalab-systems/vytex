import { type RouteSectionProps, useIsRouting } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlineApartment } from 'solid-icons/ai';
import { HiSolidTruck } from 'solid-icons/hi';
import { IoBandageSharp, IoColorPaletteSharp, IoCut, IoExtensionPuzzleSharp, IoShirtSharp } from 'solid-icons/io';
import { OcHomefill3 } from 'solid-icons/oc';
import { RiUserFacesTeamFill, RiUserFacesUserFill } from 'solid-icons/ri';
import { type Accessor, Match, Show, Suspense, Switch, createEffect, createMemo } from 'solid-js';
import Loading from '~/components/Loading';
import MenuNav from '~/components/MenuNav';
import MobileNav from '~/components/MobileNav';
import SideBarNav from '~/components/SideBarNav';
import * as PATHS from '~/constants/paths';
import { cn } from '~/lib/utils';
import { getMyUserQuery } from '~/requests/getMe';
import type { NavPages, PolicyNav } from '~/types/navPages';
import ErrorMessage from './ErrorMessage';

const baseClassMain = 'flex-1 m-2 overflow-auto';

function NavWrapper(props: RouteSectionProps) {
	const isRouting = useIsRouting();
	const user = createQuery(getMyUserQuery);

	const pages: Record<PolicyNav, NavPages> = {
		ReadUsers: { name: 'Usuarios', icon: () => <RiUserFacesUserFill size={24} />, path: PATHS.USERS_PATH },
		ReadColors: { name: 'Colores', icon: () => <IoColorPaletteSharp size={24} />, path: PATHS.COLORS_PATH },
		ReadFabrics: { name: 'Telas', icon: () => <IoBandageSharp size={24} />, path: PATHS.FABRICS_PATH },
		ReadReferences: { name: 'Referencias', icon: () => <IoShirtSharp size={24} />, path: PATHS.REFS_PATH },
		ReadOrders: { name: 'Ordenes', icon: () => <AiOutlineApartment size={24} />, path: PATHS.ORDERS_PATH },
		ReadResources: { name: 'Insumos', icon: () => <IoExtensionPuzzleSharp size={24} />, path: PATHS.RESOURCES_PATH },
		ReadSuppliers: { name: 'Proveedores', icon: () => <HiSolidTruck size={24} />, path: PATHS.SUPPLIERS_PATH },
		ReadCorte: { name: 'Corte', icon: () => <IoCut size={24} />, path: PATHS.CORTE_PATH },
		ReadRoles: { name: 'Roles', icon: () => <RiUserFacesTeamFill size={24} />, path: PATHS.ROLES_PATH },
	};

	const getPages: Accessor<NavPages[]> = createMemo(() => {
		const p: NavPages[] = [{ name: 'Home', icon: () => <OcHomefill3 size={24} />, path: '/', end: true }];
		for (const policy of user.data?.role?.policies ?? []) {
			if (Object.hasOwn(pages, policy)) {
				p.push(pages[policy as PolicyNav]);
			}
		}
		return p;
	});

	createEffect(() => {
		if (user.isSuccess) {
			document.documentElement.className = user.data.role?.code ?? '';
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
			<Match when={user.isSuccess && user.data.role?.code === 'admin'}>
				<div class='flex flex-col w-full h-fit lg:h-full lg:flex-row'>
					<SideBarNav pages={getPages()} />
					<MobileNav pages={getPages()} />
					<main class={cn(baseClassMain)}>
						<Suspense fallback={<Loading label='Cargando página' />}>
							{<Show when={!isRouting()}>{props.children}</Show>}
						</Suspense>
					</main>
				</div>
			</Match>
			<Match when={user.isSuccess && !user.data.role}>{props.children}</Match>
			<Match when={user.isSuccess}>
				<div class='flex flex-col w-full h-fit lg:h-full'>
					<MenuNav pages={getPages()} />
					<MobileNav pages={getPages()} />
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

export default NavWrapper;
