import { Navigate } from '@solidjs/router';
import { type JSXElement, children, createResource, Switch, Match } from 'solid-js';
import { client } from '~/utils/client';

function ProtectedWrapper(props: { children?: JSXElement }) {
	const c = children(() => props.children);
	const [token] = createResource(() => client.refresh());

	return (
		<Switch>
			<Match when={token.state === 'ready'}>{c()}</Match>
			<Match when={token.state === 'errored'}>{<Navigate href={'/login?reason=TOKEN_EXPIRED'} />}</Match>
		</Switch>
	);
}

export default ProtectedWrapper;
