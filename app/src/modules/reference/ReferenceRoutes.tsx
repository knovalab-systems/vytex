import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const ReferenceCreate = lazy(() => import('~/modules/reference/pages/ReferenceCreate'));
const References = lazy(() => import('~/modules/reference/pages/References'));

function ReferenceRoutes() {
	return (
		<Route path={PATHS.REFS_PATH}>
			<Route path={'/'} component={References} />
			<Route path={PATHS.CREATE_PATH} component={ReferenceCreate} />
		</Route>
	);
}

export default ReferenceRoutes;
