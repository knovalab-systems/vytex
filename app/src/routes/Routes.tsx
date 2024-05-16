import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import ProtectedWrapper from '~/components/ProtectedWrapper';
import SideBarNav from '~/components/SideBarNav';
import { LOGIN_PATH } from '~/utils/paths';

const LoginPage = lazy(() => import('~/modules/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('~/pages/NotFoundPage'));
const Home = lazy(() => import('~/pages/Home'));
const Users = lazy(() => import('~/modules/users/pages/Users'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={SideBarNav}>
					<Route path={'/'} component={Home} />
					<Route path={'/users'} component={Users} />
				</Route>
			</Route>
			<Route path={LOGIN_PATH} component={LoginPage} />
			<Route path='*404' component={NotFoundPage} />
		</>
	);
}

export default Routes;
