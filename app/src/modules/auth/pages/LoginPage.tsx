import { Navigate, useSearchParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import LoginForm from '../components/LoginForm';
import { refreshRequest } from '../requests/authRequests';

function LoginPage() {
	const [searchParams, _] = useSearchParams();
	const refresh = createQuery(() => refreshRequest(!searchParams.reason));

	return (
		<Switch>
			<Match when={refresh.isSuccess}>{<Navigate href={'/'} />}</Match>
			<Match when={refresh.isError || !!searchParams}>{<LoginForm />}</Match>
		</Switch>
	);
}

export default LoginPage;
