import { Navigate, useSearchParams } from '@solidjs/router';
import { createResource, Switch, Match } from 'solid-js';
import LoginForm from '../components/LoginForm';
import { refreshRequest } from '../requests/authRequests';

function LoginPage() {
	const [searchParams, _] = useSearchParams();
	const [token] = createResource(searchParams.reason ? 0 : 1, refreshRequest);

	return (
		<Switch>
			<Match when={token.state === 'ready'}>{<Navigate href={'/'} />}</Match>
			<Match when={token.state === 'errored'}>{<LoginForm />}</Match>
		</Switch>
	);
}

export default LoginPage;
