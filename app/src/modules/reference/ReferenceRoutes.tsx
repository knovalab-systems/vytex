import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const ReferenceCreate = lazy(() => import('~/modules/reference/pages/ReferenceCreate'));
const References = lazy(() => import('~/modules/reference/pages/References'));
const ReferencesProSupervisor = lazy(() => import('~/modules/reference/pages/ReferencesProSupervisor'));

function ReferenceRoutes() {
	return (
		<Route path={PATHS.REFS_PATH}>
			<Route path={'/'} component={References} />
			<Route path={PATHS.REFS_PRO_SUPERVISOR_RELATIVE_PATH}>
				<Route path={'/'} component={ReferencesProSupervisor} />
				<Route path={`${PATHS.REFS_TIMES_RELATIVE_PATH}/:id`} component={() => <div>1</div>} />
			</Route>
			<Route path={PATHS.CREATE_PATH} component={ReferenceCreate} />
		</Route>
	);
}

export default ReferenceRoutes;
