import { Navigate } from '@solidjs/router';
import { type JSXElement, children, createResource, Switch, Match } from 'solid-js';
import { client } from '~/utils/client';
import { LOGIN_PATH } from '~/utils/paths';
import SideBarNav from './SideBarNav';

function ProtectedWrapper(props: { children?: JSXElement }) {
	const c = children(() => props.children);
	const [token] = createResource(() => client.refresh());

	return (
		<Switch>
			<Match when={token.state === 'ready'}>
				<SideBarNav>{c() /**temporal use of nav */}</SideBarNav>
			</Match>
			<Match when={token.state === 'errored'}>{<Navigate href={`${LOGIN_PATH}?reason=TOKEN_EXPIRED`} />}</Match>
		</Switch>
	);
}

export default ProtectedWrapper;
