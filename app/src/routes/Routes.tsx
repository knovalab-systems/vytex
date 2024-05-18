import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import ProtectedWrapper from '~/components/ProtectedWrapper';
import { LOGIN_PATH } from '~/utils/paths';

const LoginPage = lazy(() => import('~/modules/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('~/pages/NotFoundPage'));
const Home = lazy(() => import('~/pages/Home'));
const Users = lazy(() => import('~/modules/users/pages/Users'));
const CreatePage = lazy(() => import('~/modules/users/pages/CreatePage'));
const NavWrapper = lazy(() => import('~/components/NavWrapper'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={NavWrapper}>
					<Route path={'/'} component={Home} />
					<Route path={'/users'} component={Users} />
					<Route path={'/users/create'} component={CreatePage} />
				</Route>
			</Route>
			<Route path={LOGIN_PATH} component={LoginPage} />
			<Route path='*404' component={NotFoundPage} />
		</>
	);
}

export default Routes;
