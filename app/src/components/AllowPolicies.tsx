import { Navigate } from '@solidjs/router';
import { type JSXElement, Match, Switch, createEffect, createSignal } from 'solid-js';
import { POLICIES, type Policy } from '~/constants/policies';
import { PoliciesProvider } from '~/hooks/usePolicies';
import { queryClient } from '~/lib/queryClient';
import { getMeQueryKey, type getMeType } from '~/requests/getMe';

function AllowPolicies(props: { children: JSXElement; policies: Array<Policy> }) {
	const [permission, setPermission] = createSignal<'unresolved' | 'allow' | 'unallow'>('unresolved');
	const user = queryClient.getQueryData<getMeType>([getMeQueryKey]);

	createEffect(() => {
		if (user?.role?.policies) {
			for (const policy of props.policies) {
				for (const userPolicy of user.role.policies) {
					if (policy === POLICIES[userPolicy]) {
						setPermission('allow');
						return;
					}
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
			<Match when={permission() === 'allow'}>
				<PoliciesProvider policies={user?.role?.policies ?? []}>{props.children}</PoliciesProvider>
			</Match>
			<Match when={permission() === 'unallow'}>
				<Navigate href={'/'} />
			</Match>
		</Switch>
	);
}

export default AllowPolicies;
