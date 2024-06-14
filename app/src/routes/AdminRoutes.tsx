import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/utils/paths';

const User = lazy(() => import('~/modules/users/pages/User'));
const Users = lazy(() => import('~/modules/users/pages/Users'));
const UserCreate = lazy(() => import('~/modules/users/pages/UserCreate'));
const UserUpdate = lazy(() => import('~/modules/users/pages/UserUpdate'));
const Roles = lazy(() => import('~/modules/users/pages/Roles'));
const MatchAdmin = lazy(() => import('~/modules/auth/components/MatchAdmin'));

function AdminRoutes() {
	return (
		<Route path={'/'} component={MatchAdmin}>
			<Route path={PATHS.USERS_PATH}>
				<Route path={'/'} component={Users} />
				<Route path={'/:id'} component={User} />
				<Route path={PATHS.CREATE_PATH} component={UserCreate} />
				<Route path={`${PATHS.UPDATE_PATH}/:id`} component={UserUpdate} />
			</Route>
			<Route path={PATHS.ROLES_PATH} component={Roles} />
		</Route>
	);
}

export default AdminRoutes;
