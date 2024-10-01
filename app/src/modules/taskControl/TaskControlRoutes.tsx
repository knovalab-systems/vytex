import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Corte = lazy(() => import('./pages/Corte'));
const Confeccion = lazy(() => import('./pages/Confeccion'));

function TaskControlsRoutes() {
	return (
		<Route path={PATHS.TASKS_PATH}>
			<Route path={PATHS.CORTE_RELATIVE_PATH} component={Corte} />
			<Route path={PATHS.CONFECCION_RELATIVE_PATH} component={Confeccion} />
		</Route>
	);
}

export default TaskControlsRoutes;
