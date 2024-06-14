import { Navigate } from '@solidjs/router';
import { type JSXElement, Match, Switch } from 'solid-js';
import RoleRoot from './RoleRoot';

export default function MatchRole(props: {
	children: JSXElement;
	role: string;
}) {
	const { role } = RoleRoot;

	return (
		<Switch fallback={<div />}>
			<Match when={role() === props.role}>{props.children}</Match>
			<Match when={role() !== props.role}>
				<Navigate href={'/'} />
			</Match>
		</Switch>
	);
}
