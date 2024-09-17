import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Corte = lazy(() => import('~/modules/taskControls/pages/Corte'));

function TaskControlsRoutes() {
	return (
		<Route path={PATHS.TASKS_PATH}>
			<Route path={PATHS.CORTE_RELATIVE_PATH} component={Corte} />
		</Route>
	);
}

export default TaskControlsRoutes;
