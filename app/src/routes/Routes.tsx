import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import { MatchAdmin } from '~/modules/auth/components/MatchRole';
import ProtectedWrapper from '~/modules/auth/components/ProtectedWrapper';
import { LOGIN_PATH } from '~/utils/paths';

const LoginPage = lazy(() => import('~/modules/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('~/pages/NotFoundPage'));
const Home = lazy(() => import('~/pages/Home'));
const Users = lazy(() => import('~/modules/users/pages/Users'));
const Roles = lazy(() => import('~/modules/users/pages/Roles'));
const NavWrapper = lazy(() => import('~/modules/auth/components/NavWrapper'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={NavWrapper}>
					<Route path={'/'} component={Home} />
					<Route path={'/'} component={MatchAdmin}>
						<Route path={'/users'} component={Users} />
						<Route path={'/roles'} component={Roles} />
					</Route>
				</Route>
			</Route>
			<Route path={LOGIN_PATH} component={LoginPage} />
			<Route path='*404' component={NotFoundPage} />
		</>
	);
}

export default Routes;
