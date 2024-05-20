import { Navigate, type RouteSectionProps } from '@solidjs/router';
import { type JSXElement, Match, Switch } from 'solid-js';
import { ADMIN_ROLE } from '~/utils/env';
import RoleRoot from './RoleRoot';

function MatchRole(props: {
	children: JSXElement;
	role: string;
}) {
	const { role } = RoleRoot;

	return (
		<Switch>
			<Match when={role() === null}>
				<div />
			</Match>
			<Match when={role() === props.role}>{props.children}</Match>
			<Match when={role() !== props.role}>
				<Navigate href={'/'} />
			</Match>
		</Switch>
	);
}

export function MatchAdmin(props: RouteSectionProps) {
	return <MatchRole role={ADMIN_ROLE}>{props.children}</MatchRole>;
}
