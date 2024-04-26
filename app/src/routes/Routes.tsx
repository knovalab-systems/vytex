import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import ProtectedWrapper from '~/components/ProtectedWrapper';
import { LOGIN_PATH } from '~/utils/paths';

const LoginPage = lazy(() => import('~/modules/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('~/pages/NotFoundPage'));

function Routes() {
	return (
		<>
			<Route path={'/'} component={ProtectedWrapper}>
				<Route path={'/'} component={() => <div>home</div>} />
			</Route>
			<Route path={LOGIN_PATH} component={LoginPage} />
			<Route path="*404" component={NotFoundPage} />
		</>
	);
}

export default Routes;
