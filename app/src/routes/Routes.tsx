import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import NavWrapper from '~/components/NavWrapper';
import ProtectedWrapper from '~/components/ProtectedWrapper';
import * as PATHS from '~/constants/paths';
import AdminRoutes from './AdminRoutes';
import DesignerRoutes from './DesignerRoutes';

const Login = lazy(() => import('~/pages/Login'));
const NotFound = lazy(() => import('~/pages/NotFound'));
const Home = lazy(() => import('~/pages/Home'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={NavWrapper}>
					<Route path={'/'} component={Home} />
					<AdminRoutes />
					<DesignerRoutes />
				</Route>
			</Route>
			<Route path={PATHS.LOGIN_PATH} component={Login} />
			<Route path='*404' component={NotFound} />
		</>
	);
}

export default Routes;
