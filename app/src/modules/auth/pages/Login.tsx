import { Navigate } from '@solidjs/router';
import { Match, Suspense, Switch, lazy } from 'solid-js';
import Loading from '~/components/Loading';
import { useAuth } from '~/hooks/useAuth';

const LoginForm = lazy(() => import('../components/LoginForm'));

function LoginPage() {
	const { authStatus } = useAuth();

	return (
		<Switch>
			<Match when={authStatus() === 'unresolved'}>
				<Loading label='Comprobando credenciales' />
			</Match>
			<Match when={authStatus() === 'authenticated'}>{<Navigate href={'/'} />}</Match>
			<Match when={authStatus() === 'unauthenticated'}>
				{
					<Suspense fallback={<Loading label='Cargando inicio de sesión' />}>
						<LoginForm />
					</Suspense>
				}
			</Match>
		</Switch>
	);
}

export default LoginPage;
