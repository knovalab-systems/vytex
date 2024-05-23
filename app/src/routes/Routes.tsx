import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import { MatchAdmin } from '~/modules/auth/components/MatchRole';
import ProtectedWrapper from '~/modules/auth/components/ProtectedWrapper';
import * as PATHS from '~/utils/paths';

const LoginPage = lazy(() => import('~/modules/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('~/pages/NotFoundPage'));
const Home = lazy(() => import('~/pages/Home'));
const Users = lazy(() => import('~/modules/users/pages/Users'));
const CreatePage = lazy(() => import('~/modules/users/pages/UserCreatePage'));
const Roles = lazy(() => import('~/modules/users/pages/Roles'));
const NavWrapper = lazy(() => import('~/modules/auth/components/NavWrapper'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={NavWrapper}>
					<Route path={'/'} component={Home} />
					<Route path={'/'} component={MatchAdmin}>
						<Route path={PATHS.USERS_PATH} component={Users} />
						<Route path={PATHS.CREATE_USER_PATH} component={CreatePage} />
						<Route path={PATHS.ROLES_PATH} component={Roles} />
					</Route>
				</Route>
			</Route>
			<Route path={PATHS.LOGIN_PATH} component={LoginPage} />
			<Route path='*404' component={NotFoundPage} />
		</>
	);
}

export default Routes;
