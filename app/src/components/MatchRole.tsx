import { Navigate, type RouteSectionProps } from '@solidjs/router';
import { type JSXElement, Match, Switch } from 'solid-js';
import { ADMIN_ROLE, DESIGNER_ROLE } from '~/envs/roles';
import { queryClient } from '~/lib/queryClient';
import { getMeQueryKey, type getMeType } from '~/requests/getMe';

function MatchRole(props: {
	children: JSXElement;
	role: string;
}) {
	const user = queryClient.getQueryData<getMeType>([getMeQueryKey]);

	return (
		<Switch>
			<Match when={user?.role === props.role}>{props.children}</Match>
			<Match when={user?.role !== props.role}>
				<Navigate href={'/404'} />
			</Match>
		</Switch>
	);
}

export function MatchDesigner(props: RouteSectionProps) {
	return <MatchRole role={DESIGNER_ROLE}>{props.children}</MatchRole>;
}

export function MatchAdmin(props: RouteSectionProps) {
	return <MatchRole role={ADMIN_ROLE}>{props.children}</MatchRole>;
}
