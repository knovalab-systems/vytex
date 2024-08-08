import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Colors = lazy(() => import('~/modules/color/pages/Colors'));
const ColorCreate = lazy(() => import('~/modules/color/pages/ColorCreate'));
const ColorUpdate = lazy(() => import('~/modules/color/pages/ColorUpdate'));

function ColorRoutes() {
	return (
		<Route path={PATHS.COLORS_PATH}>
			<Route path={'/'} component={Colors} />
			<Route path={PATHS.CREATE_PATH} component={ColorCreate} />
			<Route path={`${PATHS.UPDATE_PATH}/:id`} component={ColorUpdate} />
		</Route>
	);
}

export default ColorRoutes;
