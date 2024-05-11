import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import ProtectedWrapper from '~/components/ProtectedWrapper';
import Users from '~/modules/users/pages/Users';
import Home from '~/pages/Home';
import { LOGIN_PATH } from '~/utils/paths';

const LoginPage = lazy(() => import('~/modules/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('~/pages/NotFoundPage'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={Home} />
				<Route path={'/users'} component={Users} />
			</Route>
			<Route path={LOGIN_PATH} component={LoginPage} />
			<Route path='*404' component={NotFoundPage} />
		</>
	);
}

export default Routes;
