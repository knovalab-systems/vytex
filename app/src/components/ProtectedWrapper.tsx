import { Navigate, type RouteSectionProps } from '@solidjs/router';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';
import { LOGIN_PATH } from '~/constants/paths';
import { useAuth } from '~/hooks/useAuth';

function ProtectedWrapper(props: RouteSectionProps) {
	const { authStatus } = useAuth();

	return (
		<Switch>
			<Match when={authStatus() === 'unresolved'}>
				<Loading label='Comprobando credenciales' />
			</Match>
			<Match when={authStatus() === 'authenticated'}>{props.children}</Match>
			<Match when={authStatus() === 'unauthenticated'}>{<Navigate href={LOGIN_PATH} />}</Match>
		</Switch>
	);
}

export default ProtectedWrapper;
