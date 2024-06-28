import { Navigate } from '@solidjs/router';
import { type JSXElement, Match, Switch } from 'solid-js';
import RoleRoot from '../../../hooks/roleRoot';

export default function MatchRole(props: {
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
				<Navigate href={'/404'} />
			</Match>
		</Switch>
	);
}
