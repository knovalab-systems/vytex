import { Navigate, type RouteSectionProps } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createResource } from 'solid-js';
import Loading from '~/components/Loading';
import { refreshRequest } from '~/modules/auth/requests/authRequests';
import { client } from '~/utils/client';
import { LOGIN_PATH } from '~/utils/paths';

function ProtectedWrapper(props: RouteSectionProps) {
	const [token] = createResource(client.getToken);
	const refresh = createQuery(() => refreshRequest(token.state === 'ready' && !token()));

	return (
		<Switch>
			<Match when={token.loading || refresh.isFetching}>
				<Loading label='Comprobando credenciales' />
			</Match>
			<Match when={(token.state === 'ready' && Boolean(token())) || refresh.isSuccess}>{props.children}</Match>
			<Match when={token.state === 'errored' || refresh.isError}>
				{<Navigate href={`${LOGIN_PATH}?reason=TOKEN_EXPIRED`} />}
			</Match>
		</Switch>
	);
}

export default ProtectedWrapper;
