import { Navigate } from '@solidjs/router';
import { createResource, Switch, Match } from 'solid-js';
import { client } from '~/utils/client';
import LoginForm from '../components/LoginForm';

function LoginPage() {
	const [token] = createResource(client.refresh);

	return (
		<Switch>
			<Match when={token.state === 'ready'}>{<Navigate href={'/'} />}</Match>
			<Match when={token.state === 'errored'}>{<LoginForm />}</Match>
		</Switch>
	);
}

export default LoginPage;
