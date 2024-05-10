import { Navigate } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { type JSXElement, Match, Switch, children, createResource } from 'solid-js';
import { refreshRequest } from '~/modules/auth/requests/authRequests';
import { client } from '~/utils/client';
import { LOGIN_PATH } from '~/utils/paths';
import SideBarNav from './SideBarNav';

function ProtectedWrapper(props: { children?: JSXElement }) {
	const c = children(() => props.children);
	const [token] = createResource(client.getToken);
	const refresh = createQuery(() => refreshRequest(token.state === 'ready' && !token()));

	return (
		<Switch>
			<Match when={(token.state === 'ready' && !!token()) || refresh.isSuccess}>
				<SideBarNav>{c() /**temporal use of nav */}</SideBarNav>
			</Match>
			<Match when={token.state === 'errored' || refresh.isError}>
				{<Navigate href={`${LOGIN_PATH}?reason=TOKEN_EXPIRED`} />}
			</Match>
		</Switch>
	);
}

export default ProtectedWrapper;
