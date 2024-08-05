import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import * as PATHS from '~/constants/paths';

const Resources = lazy(() => import('~/modules/resource/pages/Resources'));
const ResourceCreate = lazy(() => import('~/modules/resource/pages/ResourceCreate'));
const ResourceUpdate = lazy(() => import('~/modules/resource/pages/ResourceUpdate'));

function ResourceRoutes() {
	return (
		<Route path={PATHS.RESOURCES_PATH}>
			<Route path={'/'} component={Resources} />
			<Route path={PATHS.CREATE_PATH} component={ResourceCreate} />
			<Route path={PATHS.CREATE_PATH} component={ResourceCreate} />
			<Route path={`${PATHS.UPDATE_PATH}/:id`} component={ResourceUpdate} />
		</Route>
	);
}

export default ResourceRoutes;
