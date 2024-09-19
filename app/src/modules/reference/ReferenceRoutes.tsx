import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const ReferenceCreate = lazy(() => import('~/modules/reference/pages/ReferenceCreate'));
const References = lazy(() => import('~/modules/reference/pages/References'));
const ReferenceTimesUpdate = lazy(() => import('~/modules/reference/pages/ReferenceTimesUpdate'));
const Reference = lazy(() => import('~/modules/reference/pages/Reference'));

function ReferenceRoutes() {
	return (
		<Route path={PATHS.REFS_PATH}>
			<Route path={'/'} component={References} />
			<Route path={'/:id'} component={Reference} />
			<Route path={`${PATHS.REFS_TIMES_RELATIVE_PATH}/:id`} component={ReferenceTimesUpdate} />
			<Route path={PATHS.CREATE_PATH} component={ReferenceCreate} />
		</Route>
	);
}

export default ReferenceRoutes;
