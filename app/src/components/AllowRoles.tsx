import { Navigate } from '@solidjs/router';
import { type JSXElement, Match, Switch, createEffect, createSignal } from 'solid-js';
import { type RoleType, roles } from '~/constants/roles';
import { queryClient } from '~/lib/queryClient';
import { getMeQueryKey, type getMeType } from '~/requests/getMe';

function AllowRoles(props: { children: JSXElement; roles: Array<RoleType>; to?: string }) {
	const [permission, setPermission] = createSignal<'unresolved' | 'allow' | 'unallow'>('unresolved');
	const user = queryClient.getQueryData<getMeType>([getMeQueryKey]);

	createEffect(() => {
		if (user?.role) {
			for (const role of props.roles) {
				if (role === roles[user.role as string].type) {
					setPermission('allow');
					return;
				}
			}
			setPermission('unallow');
			return;
		}
		setPermission('unallow');
	});

	return (
		<Switch>
			<Match when={permission() === 'unresolved'}>
				<div />
			</Match>
			<Match when={permission() === 'allow'}>{props.children}</Match>
			<Match when={permission() === 'unallow'}>
				<Navigate href={props.to || '/'} />
			</Match>
		</Switch>
	);
}

export default AllowRoles;
