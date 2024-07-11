import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const User = lazy(() => import('~/modules/user/pages/User'));
const Users = lazy(() => import('~/modules/user/pages/Users'));
const UserCreate = lazy(() => import('~/modules/user/pages/UserCreate'));
const UserUpdate = lazy(() => import('~/modules/user/pages/UserUpdate'));
const Roles = lazy(() => import('~/modules/user/pages/Roles'));
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
