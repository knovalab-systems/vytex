import { Navigate, useSearchParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Suspense, Switch, lazy } from 'solid-js';
import Loading from '~/components/Loading';
import { refreshRequest } from '../requests/authRequests';

const LoginForm = lazy(() => import('../components/LoginForm'));

function LoginPage() {
	const [searchParams, _] = useSearchParams();
	const refresh = createQuery(() => refreshRequest(!searchParams.reason));

	return (
		<Switch>
			<Match when={refresh.isFetching}>
				<Loading label='Comprobando credenciales' />
			</Match>
			<Match when={refresh.isSuccess}>{<Navigate href={'/'} />}</Match>
			<Match when={refresh.isError || !!searchParams}>
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
